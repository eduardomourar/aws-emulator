// SPDX-License-Identifier: CC0-1.0

//! The PROGRAM a job's container runs: the argument vector the request declares for it, the
//! status that program exits with, and the `AlgorithmError` wording SageMaker reports for a
//! non-zero one.
//!
//! # The rule this module implements
//!
//! A job that runs a container declares the program that container starts:
//! `AlgorithmSpecification$ContainerEntrypoint` is "the entrypoint script for a Docker
//! container used to run a training job. This script takes precedence over the default train
//! processing instructions", `AppSpecification$ContainerEntrypoint` is "the entrypoint for a
//! container used to run a processing job", and each is followed by that specification's
//! `ContainerArguments` — together the argument vector the image runs. So the STATUS such a
//! job ends in is the status that program exits with: zero completes the job, and non-zero
//! fails it with `FailureReason` in the form AWS reports for a container that exited on its
//! own ([`algorithm_error`]) — the `AlgorithmError:` class, the tail of what the container
//! wrote on standard error, and the exit status it ended with.
//!
//! # How the program is performed
//!
//! In process, by the ONE bounded POSIX/bash session this workspace performs caller-supplied
//! shell text with ([`::service_common::posix_shell_session`]): the grammar is that crate's,
//! the commands are the session's own catalog, and the session has NO host process to start,
//! no host filesystem to open and no host environment to read — the utilities it provides are
//! the ones whose whole effect is inside the session itself, and the tree the file utilities
//! work over is memory this run owns. Nothing here resolves a command against the host's
//! `PATH`, starts a child process or reaches a socket; a command the session's catalog does not
//! provide is never performed at all and answers the status a shell answers for a command it
//! could not run — which is also the status a container exits with when its program cannot be
//! started. So a declared program chooses between the session's own utilities and nothing: it
//! does not choose a program on the machine running the emulator.
//!
//! Every bound is the emulator's and lives in that session's own configuration
//! ([`::service_common::posix_shell_session::Bounds`], defaulted here): how many commands one
//! run may perform (latched — past it the run performs nothing), how long a line may be, how
//! deeply it may nest, how much one word may expand to, how many files and bytes its tree may
//! hold, and how much of what it wrote is kept ([`MAX_CONTAINER_OUTPUT_LINES`]). The work is
//! synchronous and CPU-bound, so a handler performs it off the request worker
//! ([`run_container_program_off_worker`]).
//!
//! The argument vector is handed to the session as ONE command line, quoted word by word by
//! the maintained POSIX word quoter (`shell-words`) so a word carrying a space, a quote or a
//! shell operator stays ONE word of that line rather than becoming syntax. Its first word is
//! the PROGRAM, which a container entrypoint names by path (`/bin/false`), and the session's
//! catalog names a utility by the name `PATH` resolution would find it under, so the program's
//! own final path component is the command name the session is given.
//!
//! The variables the session starts with are the job's own `Environment` — "the environment
//! variables to set in the Docker container" — and nothing else: the process this emulator runs
//! in contributes none of its own, so nothing of the developer's environment is visible to a
//! declared program.
//!
//! # A program nothing performed CLAIMS NOTHING
//!
//! Whether the declared program is one this emulator can perform at all is decided BEFORE it is
//! performed: the catalog is a fixed set of names ([`performable_program`]), so a vector naming
//! a program outside it — a script inside the caller's own image, an interpreter — and a
//! specification declaring no vector at all are both answered [`ContainerOutcome::NotPerformed`],
//! which carries NO exit status and NO output. Nothing ran, so nothing about a run is reported:
//! a job in that position ends in its modelled failure status with a reason NAMING what was not
//! performed, never in the `AlgorithmError` form, which belongs to a container that really
//! exited. The same rule the container session of
//! `service-com-amazonaws-ecs-amazonec2containerservicev20141113` states for its own declined
//! commands.
//!
//! A program the catalog DOES name is performed, and the status it exits with is the container's
//! own — including the status a shell inside it reports for a command that shell could not find,
//! which is a status the program itself produced.

use super::*;

/// How many lines of what the container wrote one run keeps, on each of its two streams.
///
/// THIS NUMBER IS THE EMULATOR'S: the program is caller-supplied, so what it can leave behind
/// is bounded here.
pub const MAX_CONTAINER_OUTPUT_LINES: usize = 200;

/// How many bytes ONE kept line may carry, under [`MAX_CONTAINER_OUTPUT_LINES`]' rule applied
/// to one line. A longer line is truncated rather than dropped, so what the container wrote is
/// still reported.
pub const MAX_CONTAINER_OUTPUT_LINE_BYTES: usize = 1_024;

/// How many words one container's argument vector may carry, and how many bytes one of those
/// words may be.
///
/// EMULATOR ceilings over the modelled ones (`ContainerEntrypoint` and `ContainerArguments` are
/// each `@length 1..100`), stated here so the vector is bounded where it is BUILT rather than
/// only where it is performed: a vector past either ceiling names no program at all.
pub const MAX_PROGRAM_WORDS: usize = 200;
/// See [`MAX_PROGRAM_WORDS`].
pub const MAX_PROGRAM_WORD_BYTES: usize = 4 * 1024;

/// What one container's program did, or the fact that nothing was performed for it.
#[derive(Debug, Clone)]
pub enum ContainerOutcome {
    /// The declared program WAS performed: the status it exited with, the tail of what it
    /// wrote on standard error, and the files it left in the container's own storage.
    Performed {
        /// The exit status of the program, as the session performed it.
        status: i32,
        /// The last line the program wrote on standard error, empty when it wrote none — the
        /// `<stderr tail>` [`algorithm_error`] reports.
        error_tail: String,
        /// The files the program left in the container's storage, as `(path, contents)` in
        /// path order. A job's outputs are READ out of these — the model artifacts the
        /// container wrote to `/opt/ml/model` and the checkpoints it wrote to its checkpoint
        /// directory — so what the job uploads is what its own program produced rather than
        /// anything synthesised beside it.
        files: Vec<(String, String)>,
    },
    /// NOTHING was performed for the container, and this is why. No status and no output are
    /// claimed, because none was produced.
    NotPerformed {
        /// The job's `FailureReason`: what was not performed, in this emulator's own words,
        /// because no container exited and so no `AlgorithmError` was reported by one.
        reason: String,
    },
}

impl ContainerOutcome {
    /// Whether a program was performed at all — which is what decides whether the job reports
    /// an instant its work started.
    #[must_use]
    pub fn performed(&self) -> bool {
        matches!(self, Self::Performed { .. })
    }

    /// Why the job this outcome belongs to FAILED, and `None` for a program that exited zero.
    ///
    /// A program that exited non-zero failed inside the container, which AWS reports in the
    /// `AlgorithmError` form ([`algorithm_error`]); a program nothing performed failed for the
    /// reason it carries instead.
    #[must_use]
    pub fn failure_reason(&self) -> Option<String> {
        match self {
            Self::Performed { status, .. } if *status == 0 => None,
            Self::Performed {
                status, error_tail, ..
            } => Some(algorithm_error(error_tail, *status)),
            Self::NotPerformed { reason } => Some(reason.clone()),
        }
    }

    /// The contents of the file the program left at `path`, when it left one there.
    #[must_use]
    pub fn file(&self, path: &str) -> Option<&str> {
        match self {
            Self::Performed { files, .. } => files
                .iter()
                .find(|(left, _)| left == path)
                .map(|(_, contents)| contents.as_str()),
            Self::NotPerformed { .. } => None,
        }
    }

    /// The files the program left UNDER the directory `directory`, each as `(name, contents)`
    /// with the directory's own prefix cut off, so the name is the one an archive of that
    /// directory carries.
    ///
    /// Empty for a program nothing performed, which left no file at all.
    #[must_use]
    pub fn files_under(&self, directory: &str) -> Vec<(String, String)> {
        let Self::Performed { files, .. } = self else {
            return Vec::new();
        };
        let prefix = format!("{}/", directory.trim_end_matches('/'));
        files
            .iter()
            .filter_map(|(path, contents)| {
                let name = path.strip_prefix(&prefix)?;
                (!name.is_empty()).then(|| (name.to_string(), contents.clone()))
            })
            .collect()
    }
}

/// How this emulator states that a job's container declared no program for it to run: the
/// image's own entrypoint is what AWS would start, and this emulator starts no image.
///
/// Not an AWS sentence, and deliberately not AWS's `AlgorithmError` form: no container exited,
/// so nothing about an exit status or a container's output may be claimed. A job that declares
/// a program this emulator CAN perform is reported from that program's own outcome instead.
#[must_use]
pub fn no_declared_program(image: &str) -> String {
    format!(
        "This emulator starts no container image, so the program the image \"{image}\" declares \
         as its own entrypoint was never started: declare ContainerEntrypoint (and \
         ContainerArguments) for a program this emulator performs."
    )
}

/// How this emulator states that the program a job DECLARED is not one it performs: the
/// container's work was never started, so no status is claimed for it.
#[must_use]
pub fn program_not_performed(command: &str) -> String {
    format!(
        "This emulator performs a job's declared container program itself and provides no \
         program named \"{command}\", so the container's program was never started and the job \
         performed no work."
    )
}

/// How SageMaker words a job whose algorithm container exited non-zero: the `AlgorithmError:`
/// class a failure inside the container carries, the tail of what the container wrote on
/// standard error, and the status it exited with.
///
/// Every part but the two values is fixed text, so a client that classifies a `FailureReason`
/// by its class and reads the exit status out of it reads the same thing here as on AWS.
#[must_use]
pub fn algorithm_error(error_tail: &str, status: i32) -> String {
    format!("AlgorithmError: {error_tail}, exit code: {status}")
}

/// The argument vector a container runs: the entrypoint the request declared, then the
/// arguments it declared for it.
///
/// Empty when the request declares neither, which is a container running the program its IMAGE
/// declares — a program no specification here names — and empty too for a vector past this
/// emulator's own ceilings ([`MAX_PROGRAM_WORDS`], [`MAX_PROGRAM_WORD_BYTES`]): a caller
/// supplies the words, so how many of them there may be and how long each may be is decided
/// here and not by the request.
#[must_use]
pub fn container_program(entrypoint: Option<&[String]>, arguments: Option<&[String]>) -> Vec<String> {
    let declared: Vec<String> = entrypoint
        .unwrap_or_default()
        .iter()
        .chain(arguments.unwrap_or_default().iter())
        .take(MAX_PROGRAM_WORDS + 1)
        .cloned()
        .collect();
    if declared.len() > MAX_PROGRAM_WORDS
        || declared
            .iter()
            .any(|word| word.len() > MAX_PROGRAM_WORD_BYTES)
    {
        return Vec::new();
    }
    declared
}

/// The command name the session would be given for `program`, when that name is one the
/// session's catalog performs — and `None` for a vector naming a program it provides none for,
/// which is a program nothing starts.
///
/// A container entrypoint names its program by path (`/bin/false`) and the catalog names a
/// utility by the name `PATH` resolution would find it under, so the final path component is
/// the command name. The catalog is the session's own: its built-in utilities, the text filters
/// it performs, and the file utilities a session working over a tree provides (which is how
/// `sh -c` is performed).
#[must_use]
pub fn performable_program(program: &[String]) -> Option<&str> {
    let executable = program.first()?;
    let name = executable.rsplit('/').next().unwrap_or(executable);
    let performed = ::service_common::posix_shell_session::BUILT_IN_COMMANDS.contains(&name)
        || ::service_common::posix_shell_session::VOLUME_COMMANDS.contains(&name)
        || ::service_common::posix_shell_text_filters::TEXT_FILTER_COMMANDS.contains(&name);
    performed.then_some(name)
}

/// Perform `program` — a container's argument vector — and report what it did, or that nothing
/// was performed for it.
///
/// `image` is the container image the job declared, which the reason for a vector naming no
/// program at all names.
///
/// Pure computation over the caller's own words: the session starts no process, opens no host
/// file and reaches no network, and the work it performs is bounded by that session's own
/// bounds.
#[must_use]
pub fn run_container_program(
    program: &[String],
    image: &str,
    environment: Option<&HashMap<String, String>>,
) -> ContainerOutcome {
    if program.is_empty() {
        return ContainerOutcome::NotPerformed {
            reason: no_declared_program(image),
        };
    }
    let Some(name) = performable_program(program) else {
        let declared = program.first().map_or("", String::as_str);
        return ContainerOutcome::NotPerformed {
            reason: program_not_performed(declared),
        };
    };
    let mut words: Vec<&str> = vec![name];
    words.extend(program.iter().skip(1).map(String::as_str));
    let line = ::shell_words::join(words);

    let variables: BTreeMap<String, String> = environment
        .into_iter()
        .flatten()
        // The variables the program sees are the job's own declared ones and nothing of this
        // process's; how many of them the session may hold is one of its own bounds, and the
        // vector's own ceiling is applied where it is built ([`container_program`]).
        .map(|(name, value)| (name.clone(), value.clone()))
        .collect();
    let config = ::service_common::posix_shell_session::SessionConfig {
        output: Some(::service_common::posix_shell_session::OutputLimits {
            lines: MAX_CONTAINER_OUTPUT_LINES,
            line_bytes: MAX_CONTAINER_OUTPUT_LINE_BYTES,
        }),
        ..::service_common::posix_shell_session::SessionConfig::default()
    };
    // The container has storage of its own — the ML storage volume the job's inputs are
    // downloaded to and its outputs are written from — so the session performs the file
    // utilities over its own tree, which is also what makes `sh -c` a program it can run.
    let mut session =
        ::service_common::posix_shell_session::ShellSession::new(variables, config)
            .with_file_utilities();
    let status = session.run(&line);
    // An `exit` the program performed is the status it ended with, the way a shell takes it.
    let status = session.exit_status().unwrap_or(status);
    ContainerOutcome::Performed {
        status,
        error_tail: session.errors().last().cloned().unwrap_or_default(),
        // What the program left in the container's storage, which is where a training job's
        // own outputs are: the artifacts it wrote to the model directory and the checkpoints
        // it wrote to its checkpoint directory.
        files: session
            .tree_files()
            .into_iter()
            .map(|(path, contents)| (path.to_string(), contents.to_string()))
            .collect(),
    }
}

/// [`run_container_program`] off the request worker: performing a caller's own program is
/// synchronous, CPU-bound work bounded by the session's own command budget, so it goes to the
/// blocking pool and the worker serving the request is released while it runs.
///
/// `None` is a fault of this process rather than of the request — the work could not be
/// performed at all — which the job reports as such.
pub async fn run_container_program_off_worker(
    program: &[String],
    image: &str,
    environment: Option<&HashMap<String, String>>,
) -> Option<ContainerOutcome> {
    let program = program.to_vec();
    let image = image.to_string();
    let environment = environment.cloned();
    crate::state::cpu_bound::run(move || run_container_program(&program, &image, environment.as_ref())).await
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The image every row of these tests declares, which a reason for a vector naming no
    /// program at all quotes back.
    const IMAGE: &str = "000000000000.dkr.ecr.us-east-1.amazonaws.com/algorithm:1";

    /// The status a shell reports when "the utility to be executed could not be found", which
    /// is what the shared session answers INTERNALLY for a command it provides no program for.
    ///
    /// It is never reported as a container's own exit status: a program this emulator did not
    /// perform claims no status at all ([`ContainerOutcome::NotPerformed`]). A shell the
    /// program itself ran may of course exit with it, and that status IS the program's — which
    /// is the one row below that expects it.
    const EXIT_COMMAND_NOT_FOUND: i32 = 127;

    /// RULE: the status a container's program exits with is the status the job that ran it
    /// ends on, and the `AlgorithmError` form is reported for that status alone.
    ///
    /// The rows differ along the FORM of the argument vector: a bare utility, the same utility
    /// named by its absolute path, a shell performing a program given as one word, and a shell
    /// whose own program ends on a status of its own.
    #[test]
    fn the_program_decides_the_status() {
        // (case, argument vector, expected status)
        let rows: [(&str, &[&str], i32); 7] = [
            ("the true utility", &["true"], 0),
            ("the false utility", &["false"], 1),
            ("false by its absolute path", &["/bin/false"], 1),
            ("true by its absolute path", &["/usr/bin/true"], 0),
            ("a shell performing a zero exit", &["/bin/sh", "-c", "exit 0"], 0),
            ("a shell performing a non-zero exit", &["/bin/sh", "-c", "exit 7"], 7),
            (
                "a shell whose own command it could not find",
                &["/bin/sh", "-c", "no-such-program"],
                EXIT_COMMAND_NOT_FOUND,
            ),
        ];

        for (case, program, expected) in rows {
            let words: Vec<String> = program.iter().map(|word| (*word).to_string()).collect();
            let outcome = run_container_program(&words, IMAGE, None);
            let ContainerOutcome::Performed {
                status, error_tail, ..
            } = &outcome
            else {
                panic!("case {case:?}: expected the program to be performed, got {outcome:?}");
            };
            assert_eq!(
                *status, expected,
                "case {case:?}: expected exit status {expected}, got {status}"
            );
            assert!(
                outcome.performed(),
                "case {case:?}: a performed program reports that it ran, got {outcome:?}"
            );
            assert_eq!(
                outcome.failure_reason(),
                (expected != 0).then(|| algorithm_error(error_tail, expected)),
                "case {case:?}: only a non-zero status fails the job, in AWS's AlgorithmError \
                 form, got {outcome:?}"
            );
        }
    }

    /// RULE: a program this emulator does not perform CLAIMS NOTHING — no exit status, no
    /// output, and a reason naming what was not performed rather than the `AlgorithmError`
    /// form, which belongs to a container that really exited.
    ///
    /// The rows differ along WHY nothing ran: no declared vector at all, a program the
    /// catalog does not name, and a vector past this emulator's ceiling on how many words one
    /// may carry.
    #[test]
    fn a_program_nothing_performed_claims_nothing() {
        let long: Vec<String> = (0..=MAX_PROGRAM_WORDS).map(|_| "true".to_string()).collect();
        // (case, argument vector, a fragment the reason has to carry)
        let rows: [(&str, Vec<String>, &str); 3] = [
            ("no declared program", Vec::new(), IMAGE),
            (
                "a program the catalog does not name",
                vec!["/opt/ml/code/train.py".to_string()],
                "/opt/ml/code/train.py",
            ),
            (
                "a vector past the word ceiling",
                container_program(Some(&long), None),
                IMAGE,
            ),
        ];
        for (case, program, fragment) in rows {
            let outcome = run_container_program(&program, IMAGE, None);
            let ContainerOutcome::NotPerformed { reason } = &outcome else {
                panic!("case {case:?}: expected nothing to be performed, got {outcome:?}");
            };
            assert!(
                !outcome.performed() && reason.contains(fragment),
                "case {case:?}: expected a reason naming {fragment:?} and no run, got \
                 {outcome:?}"
            );
            assert!(
                !reason.contains("AlgorithmError") && !reason.contains("exit code"),
                "case {case:?}: nothing exited, so no exit status may be claimed, got \
                 {reason:?}"
            );
            assert_eq!(
                outcome.failure_reason().as_deref(),
                Some(reason.as_str()),
                "case {case:?}: the job fails for exactly that reason, got {outcome:?}"
            );
        }
    }

    /// RULE: the vector a container runs is the declared entrypoint followed by the declared
    /// arguments, and a specification that declares neither names no program.
    #[test]
    fn the_vector_is_the_entrypoint_then_the_arguments() {
        let entrypoint = vec!["/bin/sh".to_string(), "-c".to_string()];
        let arguments = vec!["exit 3".to_string()];
        /// One row: the case, which of the two members the specification declares, and the
        /// vector that declaration runs.
        struct Row<'declared> {
            case: &'declared str,
            entrypoint: Option<&'declared [String]>,
            arguments: Option<&'declared [String]>,
            expected: &'declared [&'declared str],
        }
        let rows = [
            Row {
                case: "neither",
                entrypoint: None,
                arguments: None,
                expected: &[],
            },
            Row {
                case: "entrypoint only",
                entrypoint: Some(&entrypoint),
                arguments: None,
                expected: &["/bin/sh", "-c"],
            },
            Row {
                case: "arguments only",
                entrypoint: None,
                arguments: Some(&arguments),
                expected: &["exit 3"],
            },
            Row {
                case: "both",
                entrypoint: Some(&entrypoint),
                arguments: Some(&arguments),
                expected: &["/bin/sh", "-c", "exit 3"],
            },
        ];
        for row in rows {
            let (case, expected) = (row.case, row.expected);
            let program = container_program(row.entrypoint, row.arguments);
            assert_eq!(
                program, expected,
                "case {case:?}: expected the vector {expected:?}, got {program:?}"
            );
        }
    }

    /// RULE: the environment the job declares is the environment the program sees, so a
    /// program branching on one of its variables answers out of what the request carried.
    #[test]
    fn the_program_sees_the_declared_environment() {
        let mut environment = HashMap::new();
        environment.insert("MODE".to_string(), "fail".to_string());
        let program: Vec<String> = ["/bin/sh", "-c", "if [ \"$MODE\" = fail ]; then exit 4; fi"]
            .iter()
            .map(|word| (*word).to_string())
            .collect();
        let outcome = run_container_program(&program, IMAGE, Some(&environment));
        assert_eq!(
            outcome.failure_reason(),
            Some(algorithm_error("", 4)),
            "expected the status the environment selected, got {outcome:?}"
        );
    }

    /// RULE: what the container's program left in the container's own storage is what the job
    /// takes its outputs out of, read back under the directory it wrote them to.
    ///
    /// The rows differ along where the program wrote: the model directory, a nested path under
    /// it, the checkpoint directory, and a path outside both.
    #[test]
    fn the_files_the_program_left_are_read_back_under_their_directory() {
        let program: Vec<String> = [
            "/bin/sh",
            "-c",
            "mkdir -p /opt/ml/model/nested && echo fitted > /opt/ml/model/artifact.txt && \
             echo deep > /opt/ml/model/nested/part.bin && \
             echo step > /opt/ml/checkpoints/state.json && echo other > /tmp/scratch",
        ]
        .iter()
        .map(|word| (*word).to_string())
        .collect();
        let outcome = run_container_program(&program, IMAGE, None);
        assert_eq!(
            outcome.failure_reason(),
            None,
            "the program has to run to success for its files to be the job's output, got \
             {outcome:?}"
        );
        // (case, the directory, the names it holds)
        let rows: [(&str, &str, &[&str]); 3] = [
            (
                "the model directory",
                crate::state::MODEL_DIRECTORY,
                &["artifact.txt", "nested/part.bin"],
            ),
            (
                "the checkpoint directory",
                crate::state::DEFAULT_CHECKPOINT_DIRECTORY,
                &["state.json"],
            ),
            ("a directory the program wrote nothing under", "/opt/ml/input", &[]),
        ];
        for (case, directory, expected) in rows {
            let mut names: Vec<String> = outcome
                .files_under(directory)
                .into_iter()
                .map(|(name, _)| name)
                .collect();
            names.sort();
            assert_eq!(
                names, expected,
                "case {case:?}: expected {expected:?}, got {names:?}"
            );
        }
        assert_eq!(
            outcome.file("/opt/ml/model/artifact.txt").map(str::trim),
            Some("fitted"),
            "the file's contents are the ones the program wrote, got {:?}",
            outcome.file("/opt/ml/model/artifact.txt")
        );
    }
}
