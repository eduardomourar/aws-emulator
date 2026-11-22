declare const SET_HANDLER: (handler: import("@bytecodealliance/preview2-shim/io").OutputStreamHandler, acknowledge?: import("./output.js").OutputDrain) => void;
export { SET_HANDLER as _setStderr };
declare const _default: {
    writeViaStream(data: import("../streams.js").ByteStream): Promise<{
        tag: "ok";
        val: any;
    } | {
        tag: "err";
        val: "illegal-byte-sequence" | "io" | "pipe";
    }>;
    _flush(): Promise<void>;
    _shutdown(): Promise<void>;
};
export default _default;
export type * from "../../../types/interfaces/wasi-cli-stderr.d.ts";
