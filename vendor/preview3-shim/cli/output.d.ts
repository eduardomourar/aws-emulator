import type { OutputStreamHandler } from "@bytecodealliance/preview2-shim/io";
import { type ByteStream, type Preview2OutputStream } from "../streams.js";
/** A host acknowledgement for output queued on a buffered or asynchronous sink. */
export type OutputDrain = () => void | Promise<void>;
/** Add host lifecycle helpers without changing Preview 2 output handler semantics. */
export declare function createOutput(getOutput: () => Preview2OutputStream, setOutput: (handler: OutputStreamHandler) => void): {
    output: {
        /** Transfer stream bytes using the existing synchronous output handler contract. */
        writeViaStream(data: ByteStream): Promise<{
            tag: "ok";
            val: any;
        } | {
            tag: "err";
            val: "illegal-byte-sequence" | "io" | "pipe";
        }>;
        /** Flush the destination and await its optional acknowledgement without guest EOF. */
        _flush(): Promise<void>;
        /** Close active host readers and drain accepted output, leaving the destination open. */
        _shutdown(): Promise<void>;
    };
    setHandler: (handler: OutputStreamHandler, acknowledge?: OutputDrain) => void;
};
