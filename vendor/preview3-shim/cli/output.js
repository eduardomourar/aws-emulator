import { preview2StreamErrorCode, writeToPreview2Output, } from "../streams.js";
const SYMBOL_DISPOSE = Symbol.dispose ?? Symbol.for("dispose");
/** Close a host reader without waiting for an async iterator's return() to finish. */
function outputReader(data) {
    let next;
    let dispose;
    let interrupt = false;
    if (typeof data.read === "function") {
        const reader = data;
        next = (options) => reader.read(options);
        const close = reader[SYMBOL_DISPOSE] ?? reader.close ?? reader.cancel;
        dispose = () => close?.call(reader);
        // Generated stream disposal finishes its pending copy, which may contain
        // accepted bytes that must be drained before stopping the transfer.
        interrupt = !close;
    }
    else if (typeof data.getReader === "function") {
        const reader = data.getReader();
        next = async () => {
            try {
                const result = await reader.read();
                if (result.done) {
                    reader.releaseLock();
                }
                return result;
            }
            catch (error) {
                reader.releaseLock();
                throw error;
            }
        };
        dispose = () => {
            const cancelled = reader.cancel();
            reader.releaseLock();
            return cancelled;
        };
    }
    else {
        const iterator = data[Symbol.asyncIterator]();
        next = () => iterator.next();
        dispose = () => iterator.return?.();
        interrupt = true;
    }
    let ended = false;
    let finishRead;
    return {
        /** Read one chunk, allowing shutdown to interrupt a suspended async iterator. */
        async read(options) {
            if (ended) {
                return null;
            }
            const closed = new Promise((resolve) => {
                finishRead = () => resolve(null);
            });
            try {
                const reading = next(options);
                const result = await (interrupt ? Promise.race([reading, closed]) : reading);
                if (result === null ||
                    (result && typeof result === "object" && "done" in result && result.done)) {
                    ended = true;
                }
                return result;
            }
            finally {
                finishRead = undefined;
            }
        },
        /** Stop further reads while preserving an in-flight generated stream copy. */
        close() {
            if (ended) {
                return;
            }
            ended = true;
            if (interrupt) {
                finishRead?.();
            }
            // Source cleanup may settle after disposal; its failures cannot be
            // delivered to a reader whose host-owned end has already been closed.
            Promise.resolve(dispose()).catch(() => { });
        },
    };
}
/** Add host lifecycle helpers without changing Preview 2 output handler semantics. */
export function createOutput(getOutput, setOutput) {
    const transfers = new Set();
    let drain;
    /** Preserve the existing setter and optionally register a destination drain acknowledgement. */
    function setHandler(handler, acknowledge) {
        setOutput(handler);
        drain = acknowledge;
    }
    const output = {
        /** Transfer stream bytes using the existing synchronous output handler contract. */
        async writeViaStream(data) {
            try {
                const reader = outputReader(data);
                const transfer = { close: () => reader.close(), finished: null };
                transfers.add(transfer);
                const finished = writeToPreview2Output(reader, getOutput())
                    .then(() => ({ tag: "ok", val: undefined }))
                    .catch((error) => {
                    reader.close();
                    return { tag: "err", val: preview2StreamErrorCode(error) };
                })
                    .finally(() => transfers.delete(transfer));
                transfer.finished = finished;
                return await finished;
            }
            catch (error) {
                return { tag: "err", val: preview2StreamErrorCode(error) };
            }
        },
        /** Flush the destination and await its optional acknowledgement without guest EOF. */
        async _flush() {
            const acknowledge = drain;
            getOutput().blockingFlush();
            await acknowledge?.();
        },
        /** Close active host readers and drain accepted output, leaving the destination open. */
        async _shutdown() {
            const pending = [...transfers];
            for (const transfer of pending) {
                transfer.close();
            }
            await Promise.all(pending.map((transfer) => transfer.finished));
            await output._flush();
        },
    };
    return { output, setHandler };
}
