interface Preview2InputStream {
    blockingRead(length: bigint): Uint8Array | Promise<Uint8Array>;
    subscribe(): {
        block(): void | Promise<void>;
    };
}
export interface Preview2OutputStream {
    blockingWriteAndFlush(contents: Uint8Array): void;
    blockingFlush(): void;
}
export type StreamReaderLike = {
    read(options?: {
        count: number;
    }): Promise<unknown> | unknown;
    cancel?(reason?: unknown): Promise<void> | void;
    close?(): void;
};
export type ByteStream = ReadableStream<number> | AsyncIterable<unknown> | StreamReaderLike;
export declare function writeToPreview2Output(data: ByteStream, output: Preview2OutputStream): Promise<void>;
export declare function readableFromPreview2Input<E>(input: Preview2InputStream, errorCode: (error: unknown) => E): [ReadableStream<number>, Promise<{
    tag: "ok";
    val: void;
} | {
    tag: "err";
    val: E;
}>];
export declare function preview2StreamErrorCode(error: unknown): "io" | "illegal-byte-sequence" | "pipe";
export {};
