// SPDX-License-Identifier: CC0-1.0

//! Serving an INFERENCE from a model this emulator's own training produced: the variant an
//! invocation routes to, the artifact behind it, and the prediction the fitted model computes
//! for the payload the caller sent.
//!
//! # What an endpoint DOES
//!
//! "After you deploy a model into production using Amazon SageMaker AI hosting services, your
//! client applications use this API to get inferences from the model hosted at the specified
//! endpoint" (`InvokeEndpoint`). So the endpoint's work is: find the model behind the variant
//! the request routes to, load that model's artifacts, and answer what the model computes for
//! the payload.
//!
//! This module performs it IN PROCESS, over state this emulator really holds:
//!
//! * the variant is resolved through the endpoint's own endpoint configuration — the one
//!   `CreateEndpoint` snapshotted — so the model behind it is the model the caller deployed;
//! * that model's `ModelDataUrl` is read out of this emulator's own Amazon S3 and the fitted
//!   parameters are read back out of the `model.tar.gz` a training or AutoML run wrote
//!   ([`super::model_from_archive`]), so the model served is the model trained;
//! * a model that carries no artifact of its own but names a MODEL PACKAGE is served from the
//!   artifact that package's inference specification names ([`model_package_artifact_url`]), so
//!   a model deployed out of the registry serves what the registered package carries;
//! * an artifact holding a SERIALIZED GRADIENT-BOOSTED model instead — what SageMaker's own
//!   boosting algorithm and the framework containers that wrap it upload — is read for the
//!   booster's own parameters ([`super::boosted_model`]) and the prediction is computed from
//!   them, so a model trained elsewhere and deployed here is served from what its artifact
//!   really carries;
//! * an artifact carrying the model's own INFERENCE CODE — the handler script a framework
//!   container takes out of the artifact's code directory — is served by RUNNING that script over
//!   the payload ([`super::inference_script`]), so what such a model answers is what its own code
//!   returned;
//! * the payload is read as the caller's own records and the prediction is COMPUTED from
//!   those parameters, one prediction per record in the order the payload carried them —
//!   rendered as one comma-separated record for a `text/csv` answer and as the `predictions`
//!   list of scores for a JSON one.
//!
//! Nothing here runs a container image, and nothing is derived from an artifact's identity or
//! from the request: an artifact holding no model either of those readings can take parameters
//! out of and no entry point the container runs is served by nothing at all, and neither is a
//! variant whose model carries no artifact, a URI naming no object, an object Amazon S3 would not
//! answer or a payload holding no record the model can be applied to. Each of those gets the
//! operation's modelled failure for an invocation the model did not answer — never a synthesised
//! body.
//!
//! # Which reading answers an artifact that carries BOTH
//!
//! An artifact may carry the model's parameters AND a handler script beside them, and this
//! service reads the PARAMETERS for it: they are the model, and the script's own `model_fn` reads
//! that same file out of that same artifact, so the prediction is computed from the model that
//! was deployed either way. What differs from the real service is the step between: a framework
//! container would run the script's `predict_fn`/`transform_fn` over the loaded model, so an
//! artifact whose script post-processes what it loaded (scaling a score, selecting a class,
//! rendering another shape) is answered here by the parameters alone. The parameter readings are
//! this service's own computation over a model it can read, while a script that imports a
//! modelling library the artifact does not ship could not run at all — so the reading that
//! answers is the one that computes from the deployed model rather than the one that fails for
//! want of a library. An artifact carrying only code has no such choice: its code is the model,
//! and it is run.

use super::*;

use crate::ops::types::{ContainerDefinition, ModelPackageContainerDefinition};

/// The most entries of a model archive that are examined for a serialized model: a container's
/// artifact carries its model file beside what else it needs (the feature names, the
/// configuration it was trained under), so the archive is walked rather than one name assumed —
/// bounded, because the archive is a caller's own object.
pub const MAX_ARTIFACT_ENTRIES: usize = 64;

/// The most records one invocation's payload may carry. An EMULATOR ceiling, not an AWS
/// limit: the predictions are held in memory, so the answer is bounded however large the
/// payload the modelled `Body` length admits.
pub const MAX_PAYLOAD_RECORDS: usize = 1_000;

/// The most feature values one record contributes, which is the width the records of a
/// payload are read against. An EMULATOR ceiling, not an AWS limit, so a record is bounded
/// whatever the payload carries; it matches the width the fits here are bounded to
/// ([`super::MAX_FEATURES`]).
pub const MAX_PAYLOAD_FEATURES: usize = super::MAX_FEATURES;

/// The media type a payload of comma-separated values carries, and the one the answer is
/// rendered in unless the request asks for another ("text/csv" is the content type SageMaker's
/// built-in algorithms take and answer records in).
pub const CSV_MEDIA_TYPE: &str = "text/csv";

/// The media type an answer is rendered as JSON for, when the request's `Accept` asks for it.
pub const JSON_MEDIA_TYPE: &str = "application/json";

/// The content type a comma-separated answer is served under: [`CSV_MEDIA_TYPE`] together with
/// the character set its bytes are written in.
///
/// "The MIME type of the inference returned from the model container"
/// (`InvokeEndpointOutput$ContentType`) — so what an answer declares is the content type the
/// bytes really carry, parameters and all. The predictions are rendered as UTF-8 text and the
/// bytes of a TEXTUAL media type are only readable against the encoding they were written in, so
/// the answer says which that is. A media type whose own definition fixes the encoding takes no
/// such parameter, which is why [`JSON_MEDIA_TYPE`] is a JSON answer's content type as it stands.
pub const CSV_ANSWER_CONTENT_TYPE: &str = "text/csv; charset=utf-8";

/// What separates the predictions of a `text/csv` answer: one answer is a SINGLE record of
/// comma-separated values, one per input record, so a client reads a batched answer by
/// splitting it on commas.
pub const CSV_FIELD_SEPARATOR: &str = ",";

/// What serves an invocation behind one of an endpoint's production variants.
#[derive(Debug, Clone)]
pub struct ServingVariant {
    /// `ProductionVariant$VariantName`, which is what `TargetVariant` names.
    pub variant_name: String,
    /// `ProductionVariant$ModelName`: the model deployed behind the variant.
    pub model_name: String,
    /// The model's primary container's `ModelDataUrl`, when it names one.
    pub model_data_url: Option<String>,
    /// The entry point the model's container runs the artifact's own inference code by
    /// ([`super::model_inference_program`]), when the container names one.
    pub inference_program: Option<String>,
}

/// Why nothing could serve an invocation: the condition that stopped it, as the modelled
/// failure for an invocation the model did not answer reports it.
#[derive(Debug, Clone)]
#[non_exhaustive]
pub enum ServingRefusal {
    /// The variant's model carries no model artifact, so there are no parameters to serve.
    NoModelArtifact { model_name: String },
    /// The artifact could not be read out of Amazon S3.
    ArtifactUnreadable { uri: String },
    /// The artifact was read and holds no model whose parameters an inference can be computed
    /// from: it carries no model this emulator's own runs wrote and no serialized booster
    /// either, and nothing here runs the container image that would know how to read it.
    ArtifactNotServable { uri: String },
    /// The payload holds no record the model can be applied to.
    PayloadNotRecords,
    /// The payload carries more records than one invocation may.
    PayloadTooManyRecords { records: usize },
    /// The payload's records carry a different number of features than the model was fitted
    /// on, so the model cannot be applied to them.
    FeatureCountMismatch { expected: usize, found: usize },
    /// The payload carries more bytes than one run of the model's own inference code may be
    /// handed.
    PayloadTooLarge { bytes: usize },
    /// The model's own inference code RAISED, and this is the exception it raised — the script's
    /// own failure, reported as it reported it.
    ScriptRaised {
        error_type: String,
        error_message: String,
    },
    /// The run of the model's own inference code was STOPPED by one of the bounds this emulator
    /// gives one.
    ScriptStopped { reason: String },
    /// Nothing ran the model's own inference code at all, and this is why. No answer is claimed
    /// for it, because none was computed.
    ScriptNotRun { detail: String },
}

impl ServingRefusal {
    /// The sentence this condition is reported with, naming what stopped the inference.
    #[must_use]
    pub fn message(&self) -> String {
        match self {
            Self::NoModelArtifact { model_name } => format!(
                "Model {model_name} carries no ModelDataUrl, so there are no model artifacts \
                 to compute an inference from."
            ),
            Self::ArtifactUnreadable { uri } => format!(
                "The model artifacts at {uri} could not be read, so no inference was computed."
            ),
            Self::ArtifactNotServable { uri } => format!(
                "The model artifacts at {uri} hold no model this emulator can compute an \
                 inference from: a SageMaker model runs as a container image, which this \
                 emulator does not run, so the artifact has to carry the model's own \
                 parameters."
            ),
            Self::PayloadNotRecords => format!(
                "The records hold nothing to predict from: a record is a row of \
                 numeric feature values, as {CSV_MEDIA_TYPE} or as a JSON array of them."
            ),
            Self::PayloadTooManyRecords { records } => format!(
                "The records number {records}, past the {MAX_PAYLOAD_RECORDS} one \
                 inference may carry."
            ),
            Self::FeatureCountMismatch { expected, found } => format!(
                "The records carry {found} feature values, and the model they are applied to \
                 was fitted on {expected}."
            ),
            Self::PayloadTooLarge { bytes } => format!(
                "The payload carries {bytes} bytes, past the {} one inference may carry.",
                super::MAX_SCRIPT_PAYLOAD_BYTES
            ),
            Self::ScriptRaised {
                error_type,
                error_message,
            } => format!("The model's inference script raised {error_type}: {error_message}"),
            Self::ScriptStopped { reason } => {
                format!("The run of the model's inference script was stopped: {reason}.")
            }
            Self::ScriptNotRun { detail } => {
                format!("The model's inference script was not run: {detail}.")
            }
        }
    }
}

/// The variants `endpoint_name` serves, in the order its endpoint configuration listed them,
/// each with the model deployed behind it and that model's artifact.
///
/// Read through the endpoint's OWN configuration — the one `CreateEndpoint` resolved — so the
/// model behind a variant is the model the caller deployed rather than whatever a later
/// configuration of the same name says.
#[must_use]
pub fn endpoint_serving_variants(
    store: &ComAmazonawsSagemakerSagemakerState,
    endpoint_name: &str,
) -> Vec<ServingVariant> {
    let Some(endpoint) = store.endpoints.get(endpoint_name) else {
        return Vec::new();
    };
    let Some(config) = store.endpoint_configs.get(&endpoint.config_name) else {
        return Vec::new();
    };
    config
        .production_variants
        .iter()
        // `ProductionVariant$ModelName` is optional in the model (a variant may carry an
        // inference component instead), and a variant naming no model has nothing deployed
        // behind it to serve from, so it is not a serving variant at all.
        .filter_map(|variant| {
            let model_name = variant.model_name.clone()?;
            let deployed = store.models.get(&model_name);
            Some(ServingVariant {
                variant_name: variant.variant_name.clone(),
                model_data_url: deployed.and_then(|model| served_artifact_url(store, model)),
                inference_program: deployed
                    .and_then(|model| served_inference_program(store, model)),
                model_name,
            })
        })
        .collect()
}

/// Where a model's artifacts are: its primary container's `ModelDataUrl`, and otherwise the
/// first of its inference containers that names one.
///
/// "PrimaryContainer - The location of the primary docker image containing inference code"
/// and `Containers` carries the pipeline's containers; either way the artifact a prediction is
/// computed from is the `ModelDataUrl` the container names.
#[must_use]
pub fn model_artifact_url(model: &Model) -> Option<String> {
    let containers = model
        .primary_container
        .iter()
        .chain(model.containers.iter().flatten());
    containers.filter_map(container_artifact_url).next()
}

/// One container's `ModelDataUrl`, when it names one.
fn container_artifact_url(container: &ContainerDefinition) -> Option<String> {
    container
        .model_data_url
        .as_ref()
        .filter(|uri| !uri.is_empty())
        .cloned()
}

/// What serves an invocation of the model a MODEL PACKAGE names, when this account holds that
/// package: the variant the package's own selected inference specification describes.
///
/// The package is resolved ONCE here — through [`resolved_package`], then the specification
/// `specification` selects ([`specification_containers`]) — so a caller that needs the whole
/// variant (a load test deploying the package for a test of its own) does not look the same
/// package up per member. `model_name` is the package's own key, which is what a condition that
/// stopped an invocation names as the model it could not serve; `variant_name` is the package's
/// name, and a caller that deploys the package under a variant of its own replaces it.
///
/// A package this account holds whose named specification it does NOT carry answers the variant
/// with no artifact rather than nothing at all: the package is the model under test either way,
/// so what stopped the invocation is reported as the model carrying no artifact — deliberately,
/// because the caller needs the model the request named in order to say so.
#[must_use]
pub fn model_package_serving_variant(
    store: &ComAmazonawsSagemakerSagemakerState,
    identifier: &str,
    specification: Option<&str>,
) -> Option<ServingVariant> {
    let package = resolved_package(store, identifier)?;
    let containers = specification_containers(package, specification);
    Some(ServingVariant {
        variant_name: package.name.clone(),
        model_name: package.key(),
        model_data_url: containers
            .iter()
            .copied()
            .flatten()
            .find_map(package_container_artifact_url),
        inference_program: containers
            .iter()
            .copied()
            .flatten()
            .find_map(package_container_program),
    })
}

/// Where the artifacts of a model named by a MODEL PACKAGE this account holds are: the first
/// container of the package's inference specification that names a `ModelDataUrl`.
///
/// A model package is one of the ways a request names the model to serve —
/// `ContainerDefinition$ModelPackageName` deploys one, and
/// `RecommendationJobInputConfig$ModelPackageVersionArn` is "the Amazon Resource Name (ARN) of
/// a versioned model package" to benchmark — and the package's `InferenceSpecification`
/// carries "the Amazon ECR paths of containers that contain the inference code and model
/// artifacts". So the artifact such a model is served from is the `ModelDataUrl` that
/// specification's container names, read off the package the store holds rather than off the
/// request.
///
/// `specification` picks WHICH specification of the package the request asked for, as
/// `EndpointInputConfiguration$InferenceSpecificationName` and
/// `ContainerDefinition$InferenceSpecificationName` ("the inference specification name in the
/// model package version") name it: the package's additional inference specification of that
/// name, and the package's own `InferenceSpecification` when the request names none.
///
/// `identifier` is read the one way this crate reads a package identifier
/// ([`model_package_lookup_key`]), so an ARN and a name resolve to the same package; a package
/// this account does not hold resolves to nothing, which is not an artifact.
#[must_use]
pub fn model_package_artifact_url(
    store: &ComAmazonawsSagemakerSagemakerState,
    identifier: &str,
    specification: Option<&str>,
) -> Option<String> {
    model_package_containers(store, identifier, specification)?
        .iter()
        .find_map(package_container_artifact_url)
}

/// The entry point the container of that same specification runs the artifact's own inference
/// code by: the `SAGEMAKER_PROGRAM` variable of the first of its containers that declares one,
/// read the way a deployed model's is ([`model_inference_program`]) —
/// `ModelPackageContainerDefinition$Environment` is "the environment variables to set in the
/// Docker container", the same place a model's container declares its handler script.
#[must_use]
pub fn model_package_inference_program(
    store: &ComAmazonawsSagemakerSagemakerState,
    identifier: &str,
    specification: Option<&str>,
) -> Option<String> {
    model_package_containers(store, identifier, specification)?
        .iter()
        .find_map(package_container_program)
}

/// The containers of the inference specification `specification` selects on the package
/// `identifier` names, and `None` when this account holds no such package or that package
/// carries no such specification.
fn model_package_containers<'package>(
    store: &'package ComAmazonawsSagemakerSagemakerState,
    identifier: &str,
    specification: Option<&str>,
) -> Option<&'package [ModelPackageContainerDefinition]> {
    specification_containers(resolved_package(store, identifier)?, specification)
}

/// The model package a caller-supplied identifier names, when this account holds one.
///
/// The ONE reading of such an identifier in this module ([`model_package_lookup_key`], the
/// reading `DescribeModelPackage` and `DeleteModelPackage` resolve one by), so an ARN and a
/// name reach the same stored package wherever a model is named by its package.
fn resolved_package<'package>(
    store: &'package ComAmazonawsSagemakerSagemakerState,
    identifier: &str,
) -> Option<&'package ModelPackage> {
    store.model_packages.get(model_package_lookup_key(identifier))
}

/// The containers `specification` selects on `package`: its additional inference specification
/// of that name, and the package's own `InferenceSpecification` when the request names none.
fn specification_containers<'package>(
    package: &'package ModelPackage,
    specification: Option<&str>,
) -> Option<&'package [ModelPackageContainerDefinition]> {
    match specification {
        Some(name) => package
            .additional_inference_specifications
            .as_deref()
            .unwrap_or_default()
            .iter()
            .find(|additional| additional.name == name)
            .map(|additional| additional.containers.as_slice()),
        None => package
            .inference_specification
            .as_ref()
            .map(|specification| specification.containers.as_slice()),
    }
}

/// One model package container's `ModelDataUrl`, when it names one.
fn package_container_artifact_url(
    container: &ModelPackageContainerDefinition,
) -> Option<String> {
    container
        .model_data_url
        .as_ref()
        .filter(|uri| !uri.is_empty())
        .cloned()
}

/// One model package container's `SAGEMAKER_PROGRAM`, when its environment declares one.
fn package_container_program(container: &ModelPackageContainerDefinition) -> Option<String> {
    container
        .environment
        .as_ref()?
        .get(super::SAGEMAKER_PROGRAM_VARIABLE)
        .map(String::as_str)
        .map(str::trim)
        .filter(|named| !named.is_empty())
        .map(str::to_string)
}

/// Where the artifacts of the DEPLOYED model `model` are: its own container's `ModelDataUrl`,
/// and otherwise the artifact of the model package one of its containers names
/// ([`model_package_artifact_url`]) — which is how a model deployed out of the registry names
/// the artifact it serves.
#[must_use]
pub fn served_artifact_url(
    store: &ComAmazonawsSagemakerSagemakerState,
    model: &Model,
) -> Option<String> {
    if let Some(uri) = model_artifact_url(model) {
        return Some(uri);
    }
    model
        .primary_container
        .iter()
        .chain(model.containers.iter().flatten())
        .find_map(|container| {
            model_package_artifact_url(
                store,
                container.model_package_name.as_deref()?,
                container.inference_specification_name.as_deref(),
            )
        })
}

/// The entry point the DEPLOYED model `model` runs the artifact's own inference code by: its
/// own container's `SAGEMAKER_PROGRAM`, and otherwise the one declared by the container of the
/// model package a container of it names ([`model_package_inference_program`]) — read beside
/// the artifact, because the container that carries the artifact is the one that names its
/// handler.
#[must_use]
pub fn served_inference_program(
    store: &ComAmazonawsSagemakerSagemakerState,
    model: &Model,
) -> Option<String> {
    if let Some(program) = model_inference_program(model) {
        return Some(program);
    }
    model
        .primary_container
        .iter()
        .chain(model.containers.iter().flatten())
        .find_map(|container| {
            model_package_inference_program(
                store,
                container.model_package_name.as_deref()?,
                container.inference_specification_name.as_deref(),
            )
        })
}

/// The entry point a model's container runs the artifact's own inference code by: the
/// `SAGEMAKER_PROGRAM` variable of the first of its containers that declares one.
///
/// "The environment variables to set in the Docker container"
/// (`ContainerDefinition$Environment`) is where a framework inference container is told which
/// module of the artifact's code directory is its handler script; a container that declares none
/// runs the conventional name ([`super::DEFAULT_INFERENCE_PROGRAM`]), so `None` here is not "no
/// script" but "the default name".
#[must_use]
pub fn model_inference_program(model: &Model) -> Option<String> {
    let containers = model
        .primary_container
        .iter()
        .chain(model.containers.iter().flatten());
    containers
        .filter_map(|container| {
            container
                .environment
                .as_ref()?
                .get(super::SAGEMAKER_PROGRAM_VARIABLE)
                .map(String::as_str)
                .map(str::trim)
                .filter(|named| !named.is_empty())
                .map(str::to_string)
        })
        .next()
}

/// What serves an invocation behind a variant: the model the artifact the variant's model
/// names holds.
#[derive(Debug, Clone)]
pub enum ServedModel {
    /// The parameters a training or AutoML run of this emulator FITTED and wrote into the
    /// artifact, read back out of it ([`super::model_from_archive`]).
    Fitted(LinearModel),
    /// The serialized GRADIENT-BOOSTED model the artifact carries, read for the booster's own
    /// parameters ([`super::boosted_model`]).
    Boosted(BoostedModel),
}

impl ServedModel {
    /// What this model answers for one record's features.
    #[must_use]
    pub fn predict(&self, features: &[f64]) -> f64 {
        match self {
            Self::Fitted(model) => model.predict(features),
            Self::Boosted(model) => model.predict(features),
        }
    }

    /// How many feature values a record has to carry for this model to be applied to it, for a
    /// model that was FITTED on a particular width — and `None` for one that routes a value it
    /// has no feature for and a feature the record does not carry, which a boosted model does
    /// (a missing value takes the node's own default direction).
    #[must_use]
    pub fn fitted_width(&self) -> Option<usize> {
        match self {
            Self::Fitted(model) => Some(model.weights.len()),
            Self::Boosted(_) => None,
        }
    }
}

/// What SERVES an invocation behind a variant: what the artifact the variant's model names
/// carries.
///
/// A SageMaker model is served by its container, and what that container has to work with is
/// what the artifact holds: the model's own PARAMETERS, or the model's own inference CODE. Both
/// are read out of the one artifact ([`artifact_from_bytes`]), and an invocation is answered from
/// whichever of them it carries ([`serve_artifact`]).
#[derive(Debug, Clone)]
pub enum ServedArtifact {
    /// The model's own parameters, read out of the artifact.
    Model(ServedModel),
    /// The model's own inference code, which answers a whole payload rather than a record.
    Script(super::InferenceScript),
}

impl ServedArtifact {
    /// How many feature values a record has to carry for this artifact's model to be applied to
    /// it, where the artifact carries a model fitted on a particular width
    /// ([`ServedModel::fitted_width`]) — and `None` for every other artifact, including one whose
    /// own code decides what a payload has to carry.
    #[must_use]
    pub fn fitted_width(&self) -> Option<usize> {
        match self {
            Self::Model(model) => model.fitted_width(),
            Self::Script(_) => None,
        }
    }
}

/// Load what serves `variant`, reading its artifact out of this emulator's own Amazon S3.
///
/// `None` is a fault of this process rather than of the request — the decode could not be
/// performed at all — which a handler answers as such; every answer ABOUT the artifact is a
/// `Result` of its own.
pub async fn load_served_artifact(
    ctx: &smithy_server_runtime::OperationContext<'_>,
    region: &str,
    variant: &ServingVariant,
) -> Option<Result<ServedArtifact, ServingRefusal>> {
    let Some(uri) = variant.model_data_url.as_deref() else {
        return Some(Err(ServingRefusal::NoModelArtifact {
            model_name: variant.model_name.clone(),
        }));
    };
    let Some(location) = S3Location::parse(uri) else {
        return Some(Err(ServingRefusal::ArtifactUnreadable {
            uri: uri.to_string(),
        }));
    };
    let client = s3_client(ctx, region);
    let Ok(bytes) = read_object(&client, &location, MAX_OBJECT_BYTES).await else {
        return Some(Err(ServingRefusal::ArtifactUnreadable {
            uri: location.uri(),
        }));
    };
    // Decoding an artifact is synchronous, CPU-bound work over a caller's own object, so it
    // goes to the blocking pool and the worker serving this request is released while it runs —
    // the same seam a training run's fit uses. The work itself is bounded (see
    // [`MAX_ARTIFACT_ENTRIES`] and the ceilings in [`super::boosted_model`] and
    // [`super::binary_json`]), so the pool is never occupied for long.
    let program = variant.inference_program.clone();
    let decoded = crate::state::cpu_bound::run(move || artifact_from_bytes(&bytes, program.as_deref())).await?;
    Some(decoded.ok_or(ServingRefusal::ArtifactNotServable {
        uri: location.uri(),
    }))
}

/// [`serve_artifact`] on the blocking pool: serving a payload is synchronous, CPU-bound work —
/// bounded by the model's own ceilings and by [`MAX_PAYLOAD_RECORDS`] for an artifact carrying
/// parameters, and by the bounds of one script run for one carrying code — so the worker serving
/// the request is released while it runs.
///
/// `None` is a fault of this process rather than of the request — the work could not be
/// performed at all — which a handler answers as such.
pub async fn serve_inference_off_worker(
    artifact: &ServedArtifact,
    body: &[u8],
    content_type: Option<&str>,
    accept: Option<&str>,
) -> Option<Result<ServedInference, ServingRefusal>> {
    let artifact = artifact.clone();
    let body = body.to_vec();
    let content_type = content_type.map(str::to_string);
    let accept = accept.map(str::to_string);
    crate::state::cpu_bound::run(move || {
        serve_artifact(
            &artifact,
            &body,
            content_type.as_deref(),
            accept.as_deref(),
        )
    })
    .await
}

/// What `artifact` answers for `body`: the prediction its parameters compute, or what its own
/// inference code returned.
///
/// `content_type` is the media type the payload is in, which a container hands its script's
/// `input_fn`; the readings that compute from parameters read the records of either media type
/// themselves ([`payload_records`]).
pub fn serve_artifact(
    artifact: &ServedArtifact,
    body: &[u8],
    content_type: Option<&str>,
    accept: Option<&str>,
) -> Result<ServedInference, ServingRefusal> {
    match artifact {
        ServedArtifact::Model(model) => serve_inference(model, body, accept),
        ServedArtifact::Script(script) => {
            super::run_inference_script(script, body, content_type, accept)
        }
    }
}

/// What the artifact `bytes` carry, and `None` for an artifact carrying neither a model's
/// parameters nor its inference code.
///
/// `program` is the entry point the model's container names for the code it runs
/// ([`model_inference_program`]).
///
/// The PARAMETERS are read first: where the artifact carries the model itself, those parameters
/// ARE the model — the handler script's own `model_fn` would load the very same file out of the
/// same artifact — so the inference is computed from the model that was deployed either way, by
/// this service, record by record, the same way for every surface that applies a deployed model
/// ([`model_from_artifact`]). An artifact carrying no parameters this service can read carries its
/// model as CODE, and that code is what computes the inference
/// ([`super::inference_script`]).
#[must_use]
pub fn artifact_from_bytes(bytes: &[u8], program: Option<&str>) -> Option<ServedArtifact> {
    if let Some(model) = model_from_artifact(bytes) {
        return Some(ServedArtifact::Model(model));
    }
    super::inference_script_in(&archive_entries_named(bytes), program).map(ServedArtifact::Script)
}

/// The model the artifact `bytes` carry, and `None` for an artifact holding none.
///
/// The one reading of a deployed artifact, so every caller of a model's artifact — an
/// invocation, and any other work that applies a deployed model to records — takes the same
/// parameters out of the same bytes:
///
/// * the model a training or AutoML run of this emulator wrote, read back out of the archive it
///   wrote it into;
/// * otherwise, a serialized gradient-boosted model, looked for in each entry of the archive —
///   a container's artifact carries its model file beside whatever else it needs — and then in
///   the bytes themselves, for an artifact that is the model file alone.
#[must_use]
pub fn model_from_artifact(bytes: &[u8]) -> Option<ServedModel> {
    if let Some(fitted) = model_from_archive(bytes) {
        return Some(ServedModel::Fitted(fitted));
    }
    if let Some(boosted) = archive_entries(bytes)
        .into_iter()
        .find_map(|entry| boosted_model_from_bytes(&entry))
    {
        return Some(ServedModel::Boosted(boosted));
    }
    boosted_model_from_bytes(bytes).map(ServedModel::Boosted)
}

/// The bytes of each entry a compressed archive holds, bounded by [`MAX_ARTIFACT_ENTRIES`]
/// entries and by [`super::MAX_INFLATED_ARCHIVE_BYTES`] over the whole inflated stream — the
/// archive is a caller's own object, so the decompressed side is bounded as explicitly as the
/// download was.
///
/// Empty for bytes that are not such an archive, which is not an error here: an artifact may be
/// the model file itself.
fn archive_entries(bytes: &[u8]) -> Vec<Vec<u8>> {
    archive_entries_named(bytes)
        .into_iter()
        .map(|(_, body)| body)
        .collect()
}

/// [`archive_entries`] with each entry's own PATH inside the archive, which is what decides
/// whether an entry is the model's inference code and where the model directory holds it
/// ([`super::inference_script_in`]).
///
/// An entry whose path the archive does not state, and one holding nothing, is not one of the
/// files the artifact carries.
#[must_use]
pub fn archive_entries_named(bytes: &[u8]) -> Vec<(String, Vec<u8>)> {
    use ::std::io::Read;

    let decoder = ::flate2::read::GzDecoder::new(bytes).take(MAX_INFLATED_ARCHIVE_BYTES);
    let mut archive = ::tar::Archive::new(decoder);
    let Ok(entries) = archive.entries() else {
        return Vec::new();
    };
    let mut read = Vec::new();
    for entry in entries.take(MAX_ARTIFACT_ENTRIES) {
        let Ok(mut entry) = entry else { continue };
        let path = entry
            .path()
            .map(|path| path.to_string_lossy().into_owned())
            .unwrap_or_default();
        let mut body = Vec::new();
        if entry
            .by_ref()
            .take(MAX_INFLATED_ARCHIVE_BYTES)
            .read_to_end(&mut body)
            .is_ok()
            && !body.is_empty()
        {
            read.push((path, body));
        }
    }
    read
}

/// What an endpoint answers one invocation with: the rendered body and the content type it is
/// served under.
#[derive(Debug, Clone)]
pub struct ServedInference {
    pub body: Vec<u8>,
    pub content_type: String,
}

impl ServedInference {
    /// The MEDIA TYPE of the answer, without the parameters its content type carries beside it:
    /// what the body was rendered as, for a reader that decides by the form rather than by the
    /// character set ([`CSV_ANSWER_CONTENT_TYPE`]).
    #[must_use]
    pub fn media_type(&self) -> &str {
        self.content_type
            .split_once(';')
            .map_or(self.content_type.as_str(), |(media_type, _)| media_type)
            .trim()
    }
}

/// Apply `model` to the records `body` carries and render the predictions in the media type
/// `accept` asks for.
pub fn serve_inference(
    model: &ServedModel,
    body: &[u8],
    accept: Option<&str>,
) -> Result<ServedInference, ServingRefusal> {
    let rows = payload_records(body)?;
    if rows.is_empty() {
        return Err(ServingRefusal::PayloadNotRecords);
    }
    if rows.len() > MAX_PAYLOAD_RECORDS {
        return Err(ServingRefusal::PayloadTooManyRecords { records: rows.len() });
    }
    // A model FITTED on a particular set of feature columns cannot be applied to a record of
    // another width; one read out of an artifact was fitted here on none, so every record's
    // width is one it applies to.
    if let Some(expected) = model.fitted_width() {
        if let Some(found) = rows.iter().find(|row| row.len() != expected).map(Vec::len) {
            return Err(ServingRefusal::FeatureCountMismatch { expected, found });
        }
    }
    let predictions: Vec<f64> = rows.iter().map(|row| model.predict(row)).collect();
    let as_json = accept.is_some_and(|accept| accept.contains(JSON_MEDIA_TYPE));
    if as_json {
        let document = ::serde_json::json!({
            "predictions": predictions
                .iter()
                .map(|score| ::serde_json::json!({ "score": score }))
                .collect::<Vec<_>>(),
        });
        return Ok(ServedInference {
            body: ::serde_json::to_vec(&document).unwrap_or_default(),
            content_type: JSON_MEDIA_TYPE.to_string(),
        });
    }
    // One record in, one prediction out, in the order the payload carried them, rendered as
    // ONE comma-separated record with no line terminator — the framing SageMaker's inference
    // containers answer a `text/csv` invocation in, which is why a client reads a batched
    // answer by splitting it on commas. A line per prediction would be a different framing:
    // a caller that splits on commas would read one value where it asked for several.
    let rendered = predictions
        .iter()
        .map(f64::to_string)
        .collect::<Vec<_>>()
        .join(CSV_FIELD_SEPARATOR);
    Ok(ServedInference {
        body: rendered.into_bytes(),
        content_type: CSV_ANSWER_CONTENT_TYPE.to_string(),
    })
}

/// The records one invocation's payload carries: a row of numeric feature values each.
///
/// A payload that opens as a JSON object or array is read as JSON — an `instances` list, a
/// list of rows, or one row — and anything else as comma-separated values, which is the form
/// a `text/csv` payload carries. A row that holds no number at all is not a record and is
/// skipped; a payload holding no record at all is refused.
fn payload_records(body: &[u8]) -> Result<Vec<Vec<f64>>, ServingRefusal> {
    let text = ::std::str::from_utf8(body).map_err(|_| ServingRefusal::PayloadNotRecords)?;
    let trimmed = text.trim_start();
    if trimmed.starts_with('{') || trimmed.starts_with('[') {
        if let Ok(document) = ::serde_json::from_str::<::serde_json::Value>(trimmed) {
            return Ok(json_records(&document));
        }
    }
    Ok(csv_records(text))
}

/// The records a JSON payload carries: the rows of its `instances` list when it has one, the
/// rows of a bare list, or the single row a bare list of numbers is.
fn json_records(document: &::serde_json::Value) -> Vec<Vec<f64>> {
    let rows = document
        .get("instances")
        .or_else(|| document.get("inputs"))
        .unwrap_or(document);
    let Some(items) = rows.as_array() else {
        return Vec::new();
    };
    // A list whose every element is a number is ONE record, not a list of them.
    if items.iter().all(::serde_json::Value::is_number) {
        return numbers(items).map(|row| vec![row]).unwrap_or_default();
    }    items
        .iter()
        .take(MAX_PAYLOAD_RECORDS + 1)
        .filter_map(json_record)
        .collect()
}

/// One record of a JSON payload: a list of numbers, or an object carrying one under
/// `features`.
fn json_record(item: &::serde_json::Value) -> Option<Vec<f64>> {
    let values = match item {
        ::serde_json::Value::Array(values) => values.as_slice(),
        ::serde_json::Value::Object(_) => item.get("features")?.as_array()?.as_slice(),
        _ => return None,
    };
    numbers(values)
}

/// `values` as a row of numbers, and `None` when any of the first
/// [`MAX_PAYLOAD_FEATURES`] of them is not one. A record wider than that is read against its
/// first [`MAX_PAYLOAD_FEATURES`] values, so one record's width is bounded however long the
/// list is.
fn numbers(values: &[::serde_json::Value]) -> Option<Vec<f64>> {
    values
        .iter()
        .take(MAX_PAYLOAD_FEATURES)
        .map(::serde_json::Value::as_f64)
        .collect::<Option<Vec<f64>>>()
}

/// The records a comma-separated payload carries, read by the maintained CSV reader rather
/// than by splitting text here.
fn csv_records(text: &str) -> Vec<Vec<f64>> {
    let mut reader = ::csv::ReaderBuilder::new()
        // "SageMaker requires that a CSV file doesn't have a header record", so every row is
        // a record.
        .has_headers(false)
        .flexible(true)
        .from_reader(text.as_bytes());
    let mut rows: Vec<Vec<f64>> = Vec::new();
    for row in reader.records() {
        if rows.len() > MAX_PAYLOAD_RECORDS {
            return rows;
        }
        let Ok(row) = row else { continue };
        let values: Option<Vec<f64>> = row
            .iter()
            .take(MAX_PAYLOAD_FEATURES)
            .map(|field| field.trim().parse::<f64>().ok())
            .collect();
        if let Some(values) = values.filter(|values| !values.is_empty()) {
            rows.push(values);
        }
    }
    rows
}
