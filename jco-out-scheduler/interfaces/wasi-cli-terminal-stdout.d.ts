/** @module Interface wasi:cli/terminal-stdout@0.3.0 **/
export function getTerminalStdout(): TerminalOutput | undefined;
export type TerminalOutput = import('./wasi-cli-terminal-output.js').TerminalOutput;
