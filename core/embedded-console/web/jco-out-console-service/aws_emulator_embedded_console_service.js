"use components";
function __jcoEmbeddedRuntime$promiseWithResolvers() {
	if (Promise.withResolvers) return Promise.withResolvers();
	let resolve;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
function __jcoEmbeddedRuntime$isPromiseLike(value) {
	return value !== null && (typeof value == "object" || typeof value == "function") && typeof value.then == "function";
}
const __jcoEmbeddedRuntime$debugLog = (...args) => {
	if (!globalThis?.process?.env?.JCO_DEBUG) return;
	console.debug(...args);
};
const __jcoEmbeddedRuntime$initializeTaskRegisters = () => ({});
function __jcoEmbeddedRuntime$validate(args) {
	if (!args) throw TypeError("args missing");
	if (args.taskID === void 0) throw TypeError("missing task ID");
	if (args.threadID === void 0) throw TypeError("missing thread ID");
	if (args.componentIdx === void 0) throw TypeError("missing component idx");
}
const __jcoEmbeddedRuntime$getCurrentTaskMeta = (registers, componentIdx) => {
	let value = componentIdx == null ? registers.current : registers[componentIdx];
	return value == null ? void 0 : { ...value };
};
const __jcoEmbeddedRuntime$setCurrentTaskMeta = (registers, args) => {
	__jcoEmbeddedRuntime$validate(args);
	let { taskID, threadID, componentIdx } = args;
	return registers.current = registers[componentIdx] = {
		taskID,
		threadID,
		componentIdx
	};
};
function __jcoEmbeddedRuntime$withCurrentTaskMeta(registers, args) {
	__jcoEmbeddedRuntime$debugLog("[_withGlobalCurrentThreadMeta()] args", args);
	__jcoEmbeddedRuntime$validate(args);
	if (!args.fn) throw TypeError("missing fn");
	let { taskID, threadID, componentIdx, fn } = args;
	let previous = registers[componentIdx] ?? null;
	let previousCurrent = registers.current ?? null;
	try {
		registers.current = registers[componentIdx] = {
			taskID,
			threadID,
			componentIdx
		};
		return fn();
	} catch (error) {
		__jcoEmbeddedRuntime$debugLog("error while executing sync callee/callback", {
			...args,
			err: error
		});
		throw error;
	} finally {
		registers[componentIdx] = previous;
		registers.current = previousCurrent;
	}
}
function __jcoEmbeddedRuntime$withCurrentTaskMetaAsync(registers, args) {
	__jcoEmbeddedRuntime$debugLog("[_withGlobalCurrentThreadMetaAsync()] args", args);
	__jcoEmbeddedRuntime$validate(args);
	if (!args.fn) throw TypeError("missing fn");
	let { taskID, threadID, componentIdx, fn } = args;
	let previous = registers[componentIdx] ?? null;
	let previousCurrent = registers.current ?? null;
	let result;
	try {
		registers.current = registers[componentIdx] = {
			taskID,
			threadID,
			componentIdx
		};
		result = fn();
	} catch (error) {
		__jcoEmbeddedRuntime$debugLog("error while executing sync callee/callback", {
			...args,
			err: error
		});
		registers[componentIdx] = previous;
		registers.current = previousCurrent;
		throw error;
	}
	if (!__jcoEmbeddedRuntime$isPromiseLike(result)) {
		registers[componentIdx] = previous;
		registers.current = previousCurrent;
		return result;
	}
	return (async () => {
		try {
			return await result;
		} catch (error) {
			__jcoEmbeddedRuntime$debugLog("error while executing async callee/callback", {
				...args,
				err: error
			});
			throw error;
		} finally {
			registers[componentIdx]?.threadID === threadID && registers[componentIdx]?.taskID === taskID && (registers[componentIdx] = null);
			registers.current?.threadID === threadID && registers.current?.taskID === taskID && (registers.current = null);
		}
	})();
}
const __jcoEmbeddedRuntime$clearCurrentTaskMeta = async (registers, args) => {
	__jcoEmbeddedRuntime$debugLog("[_clearCurrentTask()] args", args);
	__jcoEmbeddedRuntime$validate(args);
	let { taskID, threadID, componentIdx } = args;
	let meta = registers[componentIdx];
	if (!meta) throw Error(`missing current thread meta for component idx [${componentIdx}]`);
	if (meta.threadID !== threadID) throw Error(`thread ID [${meta.threadID}] != requested ID [${threadID}]`);
	if (meta.taskID !== taskID) throw Error(`task ID [${meta.taskID}] != requested ID [${taskID}]`);
	if (meta.componentIdx !== componentIdx) throw Error(`component idx [${meta.componentIdx}] != requested idx [${componentIdx}]`);
	registers[componentIdx] = null;
	registers.current?.threadID === threadID && registers.current?.taskID === taskID && (registers.current = null);
};
const __jcoEmbeddedRuntime$reportTrap = (context, err) => {
	let { storeTrap, RuntimeError } = context;
	if (storeTrap.onTrap === null || storeTrap.stopped) return;
	if (!(err instanceof RuntimeError) || storeTrap.trapsReported.has(err)) return;
	storeTrap.trapsReported.add(err);
	let trap = __jcoEmbeddedRuntime$normalizeCoreTrap(context.normalization, err);
	try {
		storeTrap.onTrap(trap);
	} catch (e) {
		queueMicrotask(() => {
			throw e;
		});
	}
};
function __jcoEmbeddedRuntime$isIdle(context) {
	if (context.storeTrap.error !== null) return !0;
	for (let [componentIdx, metas] of context.tasks) if (componentIdx !== -1 && metas.length > 0) return !1;
	return !0;
}
const __jcoEmbeddedRuntime$checkIdle = (context) => {
	context.checkCalls?.();
	let { idleWaiters } = context.storeAsyncState;
	if (idleWaiters.size === 0 || !__jcoEmbeddedRuntime$isIdle(context)) return;
	let waiters = [...idleWaiters];
	idleWaiters.clear();
	for (let resolve of waiters) resolve();
};
const __jcoEmbeddedRuntime$whenIdle = (context) => {
	if (__jcoEmbeddedRuntime$isIdle(context)) return Promise.resolve();
	return new Promise((resolve) => {
		context.storeAsyncState.idleWaiters.add(resolve);
	});
};
const __jcoEmbeddedRuntime$stopInstance = (context) => {
	let { storeTrap, storeAsyncState, asyncState, symbolDispose } = context;
	if (storeTrap.stopped) return;
	storeTrap.stopped = !0;
	let err = new context.RuntimeError("component instance has been stopped");
	storeTrap.error ??= err;
	clearTimeout(storeAsyncState.deadlockCheck);
	storeAsyncState.deadlockCheck = null;
	for (let state of asyncState.values()) state.markTrapped(err);
	for (let reject of storeTrap.stopWaiters) reject(err);
	storeTrap.stopWaiters.clear();
	let pending = [...context.tasks.values()].flat().map((meta) => meta.task);
	for (let task of pending) task.stop(err);
	for (let state of asyncState.values()) state.stop();
	let errors = [];
	for (let channels of context.channels) for (let i = 2, data = channels.data(); i < data.length; i += 2) {
		let channel = data[i];
		if (channel === void 0 || channel === context.RepTable.FREE) continue;
		try {
			channel.onInstanceStop?.();
		} catch (e) {
			errors.push(e);
		}
	}
	let resources = new Set();
	for (let { handles, captures } of storeTrap.resourceTables) for (let i = 2; i < handles.length; i += 2) {
		if (handles[i] & 1073741824 || !(handles[i + 1] >= __jcoEmbeddedRuntime$tableOwn)) continue;
		let resource = captures.get(handles[i + 1] - __jcoEmbeddedRuntime$tableOwn);
		resource !== void 0 && resources.add(resource);
	}
	for (let { captures } of storeTrap.resourceTables) captures.clear();
	storeTrap.resourceTables.length = 0;
	for (let resource of resources) {
		if (storeTrap.disposed.has(resource)) continue;
		try {
			resource[symbolDispose]?.();
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length) throw AggregateError(errors, "failed to dispose stopped instance resources");
};
const __jcoEmbeddedRuntime$initializeInstanceFlags = () => new Map();
const __jcoEmbeddedRuntime$initializeStoreTrap = (onTrap = null) => ({
	error: null,
	stopped: !1,
	resourceTables: [],
	stopWaiters: new Set(),
	disposed: new WeakSet(),
	onTrap,
	trapsReported: new WeakSet()
});
const __jcoEmbeddedRuntime$initializeStoreAsyncState = () => ({
	deadlockCheck: null,
	pendingHostOperations: 0,
	idleWaiters: new Set()
});
const __jcoEmbeddedRuntime$initializeComponentAsyncStates = () => new Map();
const __jcoEmbeddedRuntime$initializeCoreTrapMessages = (messages) => new Map(Object.entries(messages));
function __jcoEmbeddedRuntime$normalizeCoreTrap(context, err) {
	let { RuntimeError, messages: trapMessages } = context;
	if (!(err instanceof RuntimeError)) return err;
	let message = trapMessages.get(err.message);
	message !== void 0 && (err.message = message);
	return err;
}
function __jcoEmbeddedRuntime$checkForDeadlock(context) {
	let { RuntimeError, storeAsyncState, storeTrap, asyncState } = context;
	if (storeAsyncState.deadlockCheck !== null || storeTrap.error !== null) return;
	storeAsyncState.deadlockCheck = setTimeout(() => {
		storeAsyncState.deadlockCheck = null;
		if (storeTrap.error !== null || storeAsyncState.pendingHostOperations > 0) return;
		let suspendedTasks = new Set();
		for (let state of asyncState.values()) {
			if (state.hasPendingSchedulerWork()) {
				state.runTickLoop();
				return;
			}
			for (let meta of state.suspendedTaskMetas()) suspendedTasks.add(meta.task);
		}
		let unresolvedRoots = new Set();
		for (let task of suspendedTasks) {
			let root = task.getRootTask();
			root.isResolvedState() || unresolvedRoots.add(root);
		}
		if (unresolvedRoots.size === 0) return;
		let err = new RuntimeError("wasm trap: deadlock detected: event loop cannot make further progress");
		err.deadlockDetail = {
			pendingHostOperations: storeAsyncState.pendingHostOperations,
			suspendedTasks: [...suspendedTasks].map((task) => ({
				taskID: task.id(),
				componentIdx: task.componentIdx(),
				state: task.taskState(),
				rootTaskID: task.getRootTask().id()
			})),
			unresolvedRootTaskIDs: [...unresolvedRoots].map((root) => root.id())
		};
		storeTrap.error = err;
		for (let root of unresolvedRoots) {
			root.setErrored(err);
			root.reject(err);
		}
		for (let task of suspendedTasks) if (!task.isResolvedState() && unresolvedRoots.has(task.getRootTask())) {
			task.setErrored(err);
			task.reject(err);
		}
		for (let state of asyncState.values()) state.markTrapped(err);
		for (let state of asyncState.values()) state.abandonLockWaiters();
		for (let state of asyncState.values()) state.abandonAdmissionWaiters();
		for (let state of asyncState.values()) state.runTickLoop();
	}, 0);
}
function __jcoEmbeddedRuntime$trackHostOperation(context, operation) {
	let { storeAsyncState, asyncState, symbolDispose, storeTrap } = context;
	if (storeTrap.stopped) throw storeTrap.error;
	let result = operation();
	if (!__jcoEmbeddedRuntime$isPromiseLike(result)) {
		if (storeTrap.stopped) throw storeTrap.error;
		return result;
	}
	storeAsyncState.pendingHostOperations++;
	let rejectStopped;
	let stopped = new Promise((_, reject) => {
		rejectStopped = reject;
	});
	storeTrap.stopWaiters.add(rejectStopped);
	storeTrap.stopped && rejectStopped(storeTrap.error);
	let tracked = Promise.race([result, stopped]).finally(() => {
		storeTrap.stopWaiters.delete(rejectStopped);
		storeAsyncState.pendingHostOperations--;
		if (storeAsyncState.pendingHostOperations < 0) throw Error("negative pending host operation count");
		for (let state of asyncState.values()) state.runTickLoop();
		__jcoEmbeddedRuntime$checkForDeadlock(context);
	});
	for (let sym of [Symbol.asyncDispose, symbolDispose]) typeof sym == "symbol" && typeof result[sym] == "function" && (tracked[sym] = () => result[sym]());
	return tracked;
}
function __jcoEmbeddedRuntime$checkMayLeave(context, componentIdx) {
	let { RuntimeError, instanceFlags } = context;
	if (instanceFlags.get(componentIdx)?.value !== 1) throw new RuntimeError("cannot leave component instance");
}
function __jcoEmbeddedRuntime$guardMayLeave(context, componentIdx, fn) {
	return function(...args) {
		__jcoEmbeddedRuntime$checkMayLeave(context, componentIdx);
		return fn.apply(this, args);
	};
}
function __jcoEmbeddedRuntime$recordTrap(context, componentIdx, err, convertsRangeErrors = !1) {
	let { RuntimeError, registers: currentTaskMeta } = context;
	convertsRangeErrors && err instanceof RangeError && (err = new RuntimeError("out of bounds memory access"));
	if (err instanceof RuntimeError) {
		let idx = componentIdx ?? currentTaskMeta.current?.componentIdx;
		idx != null && __jcoEmbeddedRuntime$getOrCreateAsyncState(context.lookup, idx).markTrapped(err);
	}
	return err;
}
function __jcoEmbeddedRuntime$guardTrap(context, componentIdx, fn, convertsRangeErrors = !1) {
	return function(...args) {
		try {
			return fn.apply(this, args);
		} catch (err) {
			throw __jcoEmbeddedRuntime$recordTrap(context, componentIdx, err, convertsRangeErrors);
		}
	};
}
function __jcoEmbeddedRuntime$getOrCreateAsyncState(context, componentIdx) {
	let { asyncState, ComponentAsyncState } = context;
	if (!asyncState.has(componentIdx)) {
		let newState = new ComponentAsyncState({ componentIdx });
		asyncState.set(componentIdx, newState);
	}
	return asyncState.get(componentIdx);
}
const __jcoEmbeddedRuntime$TICK_DONE = "done";
const __jcoEmbeddedRuntime$TICK_RESUMED = "resumed";
const __jcoEmbeddedRuntime$TICK_IDLE = "idle";
function __jcoEmbeddedRuntime$initializeComponentAsyncStateClass(context) {
	let { RuntimeError, RepTable, indexSpaces, instanceFlags, storeTrap, normalization, cannotEnter, deadlock, Waitable } = context;
	class ComponentAsyncState {
		static EVENT_HANDLER_EVENTS = ["backpressure-change"];
		static TickResult = {
			DONE: __jcoEmbeddedRuntime$TICK_DONE,
			RESUMED: __jcoEmbeddedRuntime$TICK_RESUMED,
			IDLE: __jcoEmbeddedRuntime$TICK_IDLE
		};
		#componentIdx;
		#callingAsyncImport = !1;
		#syncImportWait = __jcoEmbeddedRuntime$promiseWithResolvers();
		#lockHolderTaskID = null;
		#lockWaiters = [];
		#admissionQueue = [];
		#lockHandoffScheduled = !1;
		#pendingTaskStarts = 0;
		#suspendedThreadsByRef = new Map();
		#errored = null;
		#trapped = !1;
		#trapError = null;
		#backpressure = 0;
		#backpressureWaiters = 0n;
		#handlers = [];
		#nextHandlerID = 0n;
		#tickLoop = null;
		#onExclusiveReleaseHandlers = [];
		#mayLeave = !0;
		handles;
		subtasks;
		threads;
		constructor(args) {
			this.#componentIdx = args.componentIdx;
			this.handles = new RepTable({
				target: `component [${this.#componentIdx}] handles (waitable objects)`,
				space: __jcoEmbeddedRuntime$getHandleIndexSpace(indexSpaces, this.#componentIdx)
			});
			this.subtasks = new RepTable({ target: `component [${this.#componentIdx}] subtasks` });
			this.threads = new RepTable({ target: `component [${this.#componentIdx}] threads` });
		}
		componentIdx() {
			return this.#componentIdx;
		}
		get mayLeave() {
			let flags = instanceFlags.get(this.#componentIdx);
			return flags === void 0 ? this.#mayLeave : flags.value === 1;
		}
		set mayLeave(value) {
			if (typeof value != "boolean") throw TypeError("mayLeave must be a boolean");
			this.#mayLeave = value;
			let flags = instanceFlags.get(this.#componentIdx);
			flags !== void 0 && (flags.value = +!!value);
		}
		errored() {
			return this.#errored !== null;
		}
		setErrored(err) {
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#setErrored()] component errored", {
				err,
				componentIdx: this.#componentIdx
			});
			if (this.#errored) return;
			err ||= Object.assign(Error("error elswehere (see other component instance error)"), { componentIdx: this.#componentIdx });
			this.#errored = err;
		}
		markTrapped(err) {
			if (!(err instanceof RuntimeError)) return !1;
			let trap = __jcoEmbeddedRuntime$normalizeCoreTrap(normalization, err);
			this.#trapped = !0;
			this.#trapError === null && (this.#trapError = trap);
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#markTrapped()] component trapped", {
				err,
				componentIdx: this.#componentIdx
			});
			storeTrap.error === null && (storeTrap.error = trap);
			context.reportTrap?.(trap);
			context.checkIdle?.();
			return !0;
		}
		isTrapped() {
			return this.#trapped;
		}
		throwIfInterrupted() {
			if (storeTrap.stopped) throw storeTrap.error;
			if (this.#trapped) throw this.#trapError ?? new RuntimeError(cannotEnter);
		}
		throwIfTrapped() {
			if (storeTrap.stopped) throw storeTrap.error;
			if (this.#trapped) throw new RuntimeError(cannotEnter);
		}
		callingSyncImport(val) {
			if (val === void 0) return this.#callingAsyncImport;
			if (typeof val != "boolean") throw TypeError("invalid setting for async import");
			let prev = this.#callingAsyncImport;
			this.#callingAsyncImport = val;
			prev === !0 && this.#callingAsyncImport === !1 && this.#notifySyncImportEnd();
		}
		#notifySyncImportEnd() {
			let existing = this.#syncImportWait;
			this.#syncImportWait = __jcoEmbeddedRuntime$promiseWithResolvers();
			existing.resolve();
		}
		async waitForSyncImportCallEnd() {
			await this.#syncImportWait.promise;
		}
		setBackpressure(v) {
			this.#backpressure = v;
			for (let handler of this.#handlers.filter((handler) => handler.event === "backpressure-change")) handler.fn(v);
			return this.#backpressure;
		}
		getBackpressure() {
			return this.#backpressure;
		}
		incrementBackpressure() {
			let current = this.#backpressure;
			if (current < 0 || current > 2 ** 16) throw Error(`invalid current backpressure value [${current}]`);
			let newValue = this.getBackpressure() + 1;
			if (newValue >= 2 ** 16) throw Error(`invalid new backpressure value [${newValue}], overflow`);
			return this.setBackpressure(newValue);
		}
		decrementBackpressure() {
			let current = this.#backpressure;
			if (current < 0 || current > 2 ** 16) throw Error(`invalid current backpressure value [${current}]`);
			let newValue = current - 1;
			if (newValue < 0) throw new RuntimeError("backpressure counter underflow");
			return this.setBackpressure(newValue);
		}
		hasBackpressure() {
			return this.#backpressure > 0;
		}
		waitForBackpressure() {
			if (!this.hasBackpressure()) return Promise.resolve(null);
			this.addBackpressureWaiter();
			return new Promise((resolve) => {
				let pending = !0;
				let handlerID = this.registerHandler({
					event: "backpressure-change",
					fn: (bp) => {
						if (bp !== 0 || !pending) return;
						pending = !1;
						this.removeHandler({
							event: "backpressure-change",
							handlerID
						});
						this.removeBackpressureWaiter();
						resolve(null);
					}
				});
			});
		}
		registerHandler(args) {
			let { event, fn } = args;
			if (!event) throw Error("missing handler event");
			if (!fn) throw Error("missing handler fn");
			if (!ComponentAsyncState.EVENT_HANDLER_EVENTS.includes(event)) throw Error(`unrecognized event handler [${event}]`);
			let handlerID = this.#nextHandlerID++;
			this.#handlers.push({
				id: handlerID,
				fn,
				event
			});
			return handlerID;
		}
		removeHandler(args) {
			let { event, handlerID } = args;
			this.#handlers = this.#handlers.filter((handler) => handler.event !== event || handler.id !== handlerID);
		}
		getBackpressureWaiters() {
			return this.#backpressureWaiters;
		}
		addBackpressureWaiter() {
			this.#backpressureWaiters++;
		}
		removeBackpressureWaiter() {
			this.#backpressureWaiters--;
			if (this.#backpressureWaiters < 0) throw Error("unexepctedly negative number of backpressure waiters");
		}
		isExclusivelyLocked() {
			return this.#lockHolderTaskID !== null;
		}
		exclusivelyLockedBy(taskID) {
			return this.#lockHolderTaskID === taskID;
		}
		exclusiveLock(taskID) {
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#exclusiveLock()]", {
				holder: this.#lockHolderTaskID,
				requester: taskID,
				componentIdx: this.#componentIdx
			});
			if (taskID == null) throw Error("exclusive lock requires the acquiring task id");
			if (this.#lockHolderTaskID !== null) throw Error(`component [${this.#componentIdx}] exclusive lock held by task [${this.#lockHolderTaskID}], requested by [${taskID}]`);
			this.#lockHolderTaskID = taskID;
		}
		acquireExclusiveLock(taskID) {
			if (taskID == null) throw Error("exclusive lock requires the acquiring task id");
			if (this.#lockHolderTaskID === null) {
				this.#lockHolderTaskID = taskID;
				__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#acquireExclusiveLock()] acquired", {
					holder: taskID,
					componentIdx: this.#componentIdx
				});
				return;
			}
			if (this.#lockHolderTaskID === taskID) throw Error(`task [${taskID}] already holds the lock for component [${this.#componentIdx}]`);
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#acquireExclusiveLock()] waiting", {
				holder: this.#lockHolderTaskID,
				requester: taskID,
				componentIdx: this.#componentIdx,
				queued: this.#lockWaiters.length
			});
			return new Promise((resolve) => {
				this.#lockWaiters.push({
					taskID,
					resolve
				});
			});
		}
		takeAdmissionTicket(taskID) {
			let ticket = {
				taskID,
				...__jcoEmbeddedRuntime$promiseWithResolvers()
			};
			this.#admissionQueue.push(ticket);
			return ticket;
		}
		hasPendingAdmissions() {
			return this.#admissionQueue.length > 0;
		}
		waitForAdmissionTurn(ticket) {
			if (this.#admissionQueue[0] === ticket) return;
			return ticket.promise;
		}
		releaseAdmissionTicket(ticket) {
			let idx = this.#admissionQueue.indexOf(ticket);
			if (idx === -1) return;
			this.#admissionQueue.splice(idx, 1);
			idx === 0 && this.#admissionQueue.length > 0 && this.#admissionQueue[0].resolve();
		}
		abandonAdmissionWaiters() {
			let tickets = this.#admissionQueue.splice(0);
			for (let ticket of tickets) ticket.resolve();
		}
		abandonLockWaiters() {
			let waiters = this.#lockWaiters.splice(0);
			for (let waiter of waiters) waiter.resolve();
		}
		cancelExclusiveLockWaiter(taskID) {
			let idx = this.#lockWaiters.findIndex((waiter) => waiter.taskID === taskID);
			if (idx === -1) return !1;
			let [waiter] = this.#lockWaiters.splice(idx, 1);
			waiter.resolve();
			return !0;
		}
		exclusiveRelease(taskID) {
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#exclusiveRelease()] args", {
				holder: this.#lockHolderTaskID,
				releaser: taskID,
				componentIdx: this.#componentIdx
			});
			if (this.#lockHolderTaskID !== taskID) {
				__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#exclusiveRelease()] ignoring foreign release", {
					holder: this.#lockHolderTaskID,
					releaser: taskID,
					componentIdx: this.#componentIdx
				});
				return !1;
			}
			this.#lockHolderTaskID = null;
			this.#onExclusiveReleaseHandlers = this.#onExclusiveReleaseHandlers.filter((v) => !!v);
			for (let [idx, f] of this.#onExclusiveReleaseHandlers.entries()) try {
				this.#onExclusiveReleaseHandlers[idx] = null;
				f();
			} catch (err) {
				__jcoEmbeddedRuntime$debugLog("error while executing handler for next exclusive release", err);
				throw err;
			}
			this.#scheduleLockHandoff();
			return !0;
		}
		#scheduleLockHandoff() {
			if (this.#lockHandoffScheduled || this.#lockWaiters.length === 0) return;
			this.#lockHandoffScheduled = !0;
			queueMicrotask(() => {
				this.#lockHandoffScheduled = !1;
				if (this.#lockHolderTaskID !== null) return;
				let next = this.#lockWaiters.shift();
				if (!next) return;
				this.#lockHolderTaskID = next.taskID;
				next.resolve();
			});
		}
		onNextExclusiveRelease(fn) {
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#()onNextExclusiveRelease] registering");
			this.#onExclusiveReleaseHandlers.push(fn);
		}
		async waitForExclusiveRelease() {
			for (; this.isExclusivelyLocked();) await new Promise((resolve) => this.onNextExclusiveRelease(resolve));
		}
		#getSuspendedTaskMeta(taskID) {
			let metas = [...this.#suspendedThreadsByRef.values()].filter((meta) => meta.thread.taskID() === taskID);
			return metas.find((meta) => meta.cancellable && this.suspendedThreadReady(meta.thread)) ?? metas[0];
		}
		suspendTask(args) {
			let { task, ...opts } = args;
			task.endFirstSlice();
			return this.suspendThread({
				thread: task.defaultThread(),
				...opts
			});
		}
		resumeTaskByID(taskID) {
			let meta = this.#getSuspendedTaskMeta(taskID);
			return meta ? this.resumeThread(meta.thread) : !1;
		}
		suspendedTaskReady(taskID) {
			let meta = this.#getSuspendedTaskMeta(taskID);
			return meta ? this.suspendedThreadReady(meta.thread) : !1;
		}
		suspendedTaskCancellable(taskID) {
			return !!this.#getSuspendedTaskMeta(taskID)?.cancellable;
		}
		isTaskSuspended(taskID) {
			return !!this.#getSuspendedTaskMeta(taskID);
		}
		*suspendedTaskMetas() {
			for (let meta of this.#suspendedThreadsByRef.values()) yield {
				...meta,
				task: meta.thread.task()
			};
		}
		#removeSuspendedThreadMeta(thread) {
			let meta = this.#suspendedThreadsByRef.get(thread);
			this.#suspendedThreadsByRef.delete(thread);
			return meta;
		}
		suspendThread(args) {
			let { thread, readyFn, cancellable, onResume, suspended = !1 } = args;
			__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#suspendThread()]", {
				threadID: thread.id(),
				taskID: thread.taskID(),
				componentIdx: this.#componentIdx
			});
			if (thread.componentIdx() !== this.#componentIdx) throw Error("assert: thread component idx should match async state");
			if (this.#suspendedThreadsByRef.has(thread)) throw Error(`thread [${thread.id()}] already suspended`);
			let promise;
			let resume;
			if (onResume) resume = () => onResume(!thread.isCancelled() && !thread.isRejected() && !this.isTrapped());
			else {
				let resolvers = __jcoEmbeddedRuntime$promiseWithResolvers();
				promise = resolvers.promise;
				resume = () => resolvers.resolve(!thread.isCancelled() && !thread.isRejected() && !this.isTrapped());
			}
			if (storeTrap.stopped) {
				this.markTrapped(storeTrap.error);
				resume();
				return promise;
			}
			this.#suspendedThreadsByRef.set(thread, {
				thread,
				cancellable,
				readyFn,
				resume,
				suspended
			});
			thread.notifyProgress();
			this.runTickLoop();
			__jcoEmbeddedRuntime$checkForDeadlock(deadlock);
			return promise;
		}
		resumeThread(thread) {
			let meta = this.#removeSuspendedThreadMeta(thread);
			if (!meta) return !1;
			meta.resume();
			return !0;
		}
		markThreadReady(thread) {
			let meta = this.#suspendedThreadsByRef.get(thread);
			if (!meta || !meta.suspended) return !1;
			meta.suspended = !1;
			meta.readyFn = () => !0;
			this.runTickLoop();
			return !0;
		}
		isThreadSuspended(thread) {
			return this.#suspendedThreadsByRef.get(thread)?.suspended ?? !1;
		}
		isThreadReady(thread) {
			let meta = this.#suspendedThreadsByRef.get(thread);
			return !!meta && !meta.suspended && (meta.thread.isRejected() || meta.readyFn());
		}
		suspendedThreadReady(thread) {
			let meta = this.#suspendedThreadsByRef.get(thread);
			if (!meta) return !1;
			if (!meta.readyFn) throw Error(`suspended thread [${thread.id()}] is missing a readiness function`);
			if (this.isTrapped() || meta.thread.isRejected()) return !0;
			if (!meta.readyFn()) return !1;
			let task = meta.thread.task();
			return !task.needsExclusiveLock() || !this.isExclusivelyLocked() || this.exclusivelyLockedBy(task.id());
		}
		addPendingTaskStart() {
			this.#pendingTaskStarts++;
		}
		removePendingTaskStart() {
			this.#pendingTaskStarts--;
		}
		hasPendingSchedulerWork() {
			if (this.#pendingTaskStarts > 0) return !0;
			if (this.#lockHandoffScheduled) return !0;
			for (let meta of this.#suspendedThreadsByRef.values()) if (this.suspendedThreadReady(meta.thread)) return !0;
			return !1;
		}
		stop() {
			this.#tickLoop !== null && clearTimeout(this.#tickLoop);
			this.#tickLoop = null;
			this.abandonLockWaiters();
			this.abandonAdmissionWaiters();
			for (let thread of [...this.#suspendedThreadsByRef.keys()]) this.resumeThread(thread);
		}
		runTickLoop() {
			if (storeTrap.stopped || this.#tickLoop !== null) return;
			let run = () => {
				if (storeTrap.stopped) {
					this.#tickLoop = null;
					return;
				}
				let result = this.tick();
				if (storeTrap.stopped || result === __jcoEmbeddedRuntime$TICK_DONE) {
					this.#tickLoop = null;
					return;
				}
				result === __jcoEmbeddedRuntime$TICK_IDLE && __jcoEmbeddedRuntime$checkForDeadlock(deadlock);
				let delay = result === __jcoEmbeddedRuntime$TICK_RESUMED ? 0 : 10;
				this.#tickLoop = setTimeout(run, delay);
			};
			this.#tickLoop = setTimeout(run, 10);
		}
		tick() {
			for (let [thread, meta] of this.#suspendedThreadsByRef) {
				if (!meta || !meta.readyFn) throw Error(`missing/invalid thread meta despite thread [${thread.id()}] being present`);
				if (this.isTrapped() || meta.thread.isRejected()) {
					__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#tick()] detected thread rejection, leaving early", { meta });
					this.resumeThread(thread);
					return __jcoEmbeddedRuntime$TICK_RESUMED;
				}
				if (!this.suspendedThreadReady(thread)) continue;
				__jcoEmbeddedRuntime$debugLog("[ComponentAsyncState#tick()] resuming thread via tick", {
					threadID: thread.id(),
					componentIdx: this.#componentIdx
				});
				this.resumeThread(thread);
				return __jcoEmbeddedRuntime$TICK_RESUMED;
			}
			return this.#suspendedThreadsByRef.size > 0 ? __jcoEmbeddedRuntime$TICK_IDLE : __jcoEmbeddedRuntime$TICK_DONE;
		}
		createWaitable(args) {
			return new Waitable({ target: args?.target });
		}
	}
	return ComponentAsyncState;
}
const __jcoEmbeddedRuntime$postReturnTrap = (context, componentIdx, error) => {
	let trap;
	if (error instanceof context.RuntimeError) trap = error;
	else {
		let message = /call stack|stack overflow|too much recursion/i.test(error?.message ?? "") ? context.stackOverflow : context.uncaughtException;
		trap = new context.RuntimeError(message, { cause: error });
	}
	__jcoEmbeddedRuntime$getOrCreateAsyncState(context.lookup, componentIdx).markTrapped(trap);
	return trap;
};
function __jcoEmbeddedRuntime$getCurrentTask(_context, componentIdx, taskID) {
	if (componentIdx == null) throw Error("missing component idx");
	let taskMetas = _context.tasks.get(componentIdx);
	if (taskMetas === void 0 || taskMetas.length === 0) return;
	if (taskID) return taskMetas.find((meta) => meta.task.id() === taskID);
	let current = _context.registers[componentIdx];
	if (current && current.taskID !== void 0) {
		let currentMeta = taskMetas.find((meta) => meta.task.id() === current.taskID);
		if (currentMeta) return currentMeta;
	}
	let taskMeta = taskMetas[taskMetas.length - 1];
	if (!taskMeta || !taskMeta.task) return;
	return taskMeta;
}
function __jcoEmbeddedRuntime$createNewCurrentImplicitThread(_context, args) {
	__jcoEmbeddedRuntime$debugLog("[createNewCurrentImplicitThread()] args", args);
	let { componentIdx, isAsync, isManualAsync, preserveFutureResult, entryFnName, callbackFnName, getCallbackFn, stringEncoding, errHandling, getCalleeParamsFn, resultPtr, callingWasmExport } = args;
	if (componentIdx == null) throw Error("missing/invalid component instance index while starting task");
	let taskMetas = _context.tasks.get(componentIdx);
	let callbackFn = getCallbackFn ? getCallbackFn() : null;
	let newTask = new _context.AsyncTask({
		componentIdx,
		isAsync,
		isManualAsync,
		preserveFutureResult,
		entryFnName,
		callbackFn,
		callbackFnName,
		stringEncoding,
		getCalleeParamsFn,
		resultPtr,
		errHandling,
		callingWasmExport
	});
	let thread = newTask.addThread(new _context.AsyncThread({
		componentIdx,
		task: newTask
	}));
	let newTaskID = newTask.id();
	let newTaskMeta = {
		id: newTaskID,
		componentIdx,
		task: newTask
	};
	_context.taskIds.push(newTaskID);
	_context.componentIdxs.push(componentIdx);
	if (taskMetas) taskMetas.push(newTaskMeta);
	else {
		taskMetas = [newTaskMeta];
		_context.tasks.set(componentIdx, [newTaskMeta]);
	}
	return {
		task: newTask,
		taskID: newTaskID,
		thread,
		threadID: thread.id()
	};
}
function __jcoEmbeddedRuntime$clearCurrentThread(_context, componentIdx, taskID, options = {}) {
	__jcoEmbeddedRuntime$debugLog("[clearCurrentThread()] args", {
		componentIdx,
		taskID
	});
	if (componentIdx == null) throw Error("missing/invalid component instance index while ending current task");
	let tasks = _context.tasks.get(componentIdx);
	if (!tasks || !Array.isArray(tasks)) throw Error("missing/invalid tasks for component instance while ending task");
	if (tasks.length == 0) throw Error(`no current tasks for component instance [${componentIdx}] while ending task`);
	let taskIdx = taskID === void 0 ? tasks.length - 1 : tasks.findIndex((meta) => meta.id === taskID);
	if (taskIdx === -1) return;
	let taskMeta = tasks[taskIdx];
	if (!options.preserveTask) {
		tasks.splice(taskIdx, 1);
		_context.checkIdle?.();
	}
	let globalTaskIdx = _context.taskIds.lastIndexOf(taskMeta.id);
	if (globalTaskIdx !== -1) {
		_context.taskIds.splice(globalTaskIdx, 1);
		_context.componentIdxs.splice(globalTaskIdx, 1);
	}
	return taskMeta.task;
}
const __jcoEmbeddedRuntime$RESOURCE_TABLE_FLAG = 1 << 30;
const __jcoEmbeddedRuntime$RESOURCE_TABLE_OWN = 2 ** 32;
const __jcoEmbeddedRuntime$tableOwn = __jcoEmbeddedRuntime$RESOURCE_TABLE_OWN;
const __jcoEmbeddedRuntime$initializeHandleIndexSpaces = () => new Map();
const __jcoEmbeddedRuntime$initializeHandleTables = () => [];
const __jcoEmbeddedRuntime$initializeCurrentBorrows = () => ({ borrows: [] });
const __jcoEmbeddedRuntime$initializeResourceScopeCounter = () => ({ value: 0 });
const __jcoEmbeddedRuntime$initializeResourceScopeTasks = () => new Map();
const __jcoEmbeddedRuntime$getHandleIndexSpace = (spaces, key) => {
	let space = spaces.get(key);
	if (space === void 0) {
		space = {
			next: 1,
			free: [],
			alloc() {
				return this.free.length > 0 ? this.free.pop() : this.next++;
			},
			release(index) {
				this.free.push(index);
			}
		};
		spaces.set(key, space);
	}
	return space;
};
const __jcoEmbeddedRuntime$tableCreateOwn = (spaces, table, rep) => {
	rep >>>= 0;
	table._createdReps.add(rep);
	let handle = __jcoEmbeddedRuntime$getHandleIndexSpace(spaces, table._componentIdx ?? table).alloc();
	table[handle << 1] = 0;
	table[(handle << 1) + 1] = rep + __jcoEmbeddedRuntime$RESOURCE_TABLE_OWN;
	return handle;
};
const __jcoEmbeddedRuntime$tableRemove = (context, table, handle) => {
	let scope = table[handle << 1];
	let value = table[(handle << 1) + 1];
	let own = value >= __jcoEmbeddedRuntime$RESOURCE_TABLE_OWN;
	let rep = own ? value - __jcoEmbeddedRuntime$RESOURCE_TABLE_OWN : value;
	if (value === void 0 || scope & __jcoEmbeddedRuntime$RESOURCE_TABLE_FLAG) throw new context.RuntimeError("unknown handle index " + handle);
	if (own && scope !== 0) throw new context.RuntimeError("cannot remove owned resource while borrowed");
	let borrowTask = own ? void 0 : context.scopeTasks.get(scope);
	table[handle << 1] = __jcoEmbeddedRuntime$RESOURCE_TABLE_FLAG;
	table[(handle << 1) + 1] = 0;
	__jcoEmbeddedRuntime$getHandleIndexSpace(context.indexSpaces, table._componentIdx ?? table).release(handle);
	borrowTask?.removeBorrowedHandle();
	return {
		rep,
		scope,
		own
	};
};
const __jcoEmbeddedRuntime$isInt8 = (value) => typeof value == "number" && value === value << 24 >> 24;
const __jcoEmbeddedRuntime$isUint8 = (value) => typeof value == "number" && value === (value & 255);
const __jcoEmbeddedRuntime$isInt16 = (value) => typeof value == "number" && value === value << 16 >> 16;
const __jcoEmbeddedRuntime$isUint16 = (value) => typeof value == "number" && value === (value & 65535);
const __jcoEmbeddedRuntime$isInt32 = (value) => typeof value == "number" && value === (value | 0);
const __jcoEmbeddedRuntime$isUint32 = (value) => typeof value == "number" && value === value >>> 0;
const __jcoEmbeddedRuntime$isInt64 = (value) => typeof value == "bigint" && value === BigInt.asIntN(64, value);
const __jcoEmbeddedRuntime$isUint64 = (value) => typeof value == "bigint" && value === BigInt.asUintN(64, value);
function __jcoEmbeddedRuntime$invalidNumericPrimitive(type, value) {
	throw TypeError(`invalid ${type} value [${value}]`);
}
const __jcoEmbeddedRuntime$toUint8 = (context, value) => {
	context.strict && !__jcoEmbeddedRuntime$isUint8(value) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u8", value);
	return value & 255;
};
const __jcoEmbeddedRuntime$toUint16 = (context, value) => {
	context.strict && !__jcoEmbeddedRuntime$isUint16(value) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u16", value);
	return value & 65535;
};
const __jcoEmbeddedRuntime$toUint32 = (context, value) => {
	context.strict && !__jcoEmbeddedRuntime$isUint32(value) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u32", value);
	return value >>> 0;
};
const __jcoEmbeddedRuntime$toUint64 = (context, value) => {
	let converted = BigInt(value);
	context.strict && !__jcoEmbeddedRuntime$isUint64(converted) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u64", converted);
	return BigInt.asUintN(64, converted);
};
const __jcoEmbeddedRuntime$isValidNumericPrimitive = (type, value) => {
	switch (type) {
		case "bool": return value === 0 || value === 1;
		case "s8": return __jcoEmbeddedRuntime$isInt8(value);
		case "u8": return __jcoEmbeddedRuntime$isUint8(value);
		case "s16": return __jcoEmbeddedRuntime$isInt16(value);
		case "u16": return __jcoEmbeddedRuntime$isUint16(value);
		case "s32": return __jcoEmbeddedRuntime$isInt32(value);
		case "u32": return __jcoEmbeddedRuntime$isUint32(value);
		case "s64": return __jcoEmbeddedRuntime$isInt64(value);
		case "u64": return __jcoEmbeddedRuntime$isUint64(value);
		case "f32":
		case "f64": return typeof value == "number";
		default: return !1;
	}
};
const __jcoEmbeddedRuntime$requireValidNumericPrimitive = (type, value) => {
	__jcoEmbeddedRuntime$isValidNumericPrimitive(type, value) || __jcoEmbeddedRuntime$invalidNumericPrimitive(type, value);
	return !0;
};
function __jcoEmbeddedRuntime$getCurrentThread(context, componentIdx, threadID, taskID) {
	if (componentIdx === -1 || threadID == null || threadID === 0) return;
	let thread = __jcoEmbeddedRuntime$getOrCreateAsyncState(context.lookup, componentIdx).threads.get(threadID);
	if (!thread || taskID !== void 0 && thread.taskID() !== taskID) return;
	return {
		id: threadID,
		componentIdx,
		taskID: thread.taskID(),
		task: thread.task(),
		thread
	};
}
const __jcoEmbeddedRuntime$emptyFunc = () => {};
const __jcoEmbeddedRuntime$initializeDataViewCache = () => ({ view: new DataView(new ArrayBuffer(0)) });
const __jcoEmbeddedRuntime$dataView = (context, memory) => context.view.buffer === memory.buffer ? context.view : context.view = new DataView(memory.buffer);
function __jcoEmbeddedRuntime$requireString(value) {
	if (typeof value != "string") throw TypeError("expected a string, received [" + typeof value + "]");
	return value;
}
function __jcoEmbeddedRuntime$utf8Size(s) {
	let len = 0;
	let codepoints = 0;
	for (let i = 0; i < s.length; i++) {
		let ch = s.charCodeAt(i);
		codepoints++;
		if (ch < 128) len += 1;
		else if (ch < 2048) len += 2;
		else if (ch >= 55296 && ch <= 56319 && i + 1 < s.length && (s.charCodeAt(i + 1) & 64512) == 56320) {
			len += 4;
			i++;
		} else len += 3;
	}
	return {
		len,
		codepoints
	};
}
const __jcoEmbeddedRuntime$initializeUtf8Decoder = () => new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
const __jcoEmbeddedRuntime$initializeUtf16Decoder = () => new TextDecoder("utf-16", {
	fatal: !0,
	ignoreBOM: !0
});
const __jcoEmbeddedRuntime$initializeUtf8Encoder = () => new TextEncoder();
const __jcoEmbeddedRuntime$initializeUtf16Encoding = () => ({ littleEndian: new Uint8Array(new Uint16Array([1]).buffer)[0] === 1 });
function __jcoEmbeddedRuntime$writeUtf16(context, str, ptr, memory) {
	let len = str.length;
	let out = new Uint16Array(memory.buffer, ptr, len);
	let put = context.littleEndian ? (i, ch) => {
		out[i] = ch;
	} : (i, ch) => {
		out[i] = (ch & 255) << 8 | ch >>> 8;
	};
	for (let i = 0; i < len; i++) {
		let ch = str.charCodeAt(i);
		if ((ch & 63488) == 55296) {
			if (ch < 56320 && i + 1 < len && (str.charCodeAt(i + 1) & 64512) == 56320) {
				put(i++, ch);
				ch = str.charCodeAt(i);
			} else ch = 65533;
		}
		put(i, ch);
	}
	return {
		ptr,
		len,
		codepoints: [...str].length
	};
}
function __jcoEmbeddedRuntime$writeUtf8(encoder, s, ptr, len, codepoints, memory) {
	let { read, written } = encoder.encodeInto(s, new Uint8Array(memory.buffer, ptr, len));
	if (read !== s.length || written !== len) throw Error("failed to encode whole string");
	return {
		ptr,
		len,
		codepoints
	};
}
const __jcoEmbeddedRuntime$utf16Encode = (context, value, realloc, memory) => {
	let str = __jcoEmbeddedRuntime$requireString(value);
	return __jcoEmbeddedRuntime$writeUtf16(context, str, realloc(0, 0, 2, str.length * 2), memory);
};
const __jcoEmbeddedRuntime$utf8Encode = (encoder, value, realloc, memory) => {
	let s = __jcoEmbeddedRuntime$requireString(value);
	if (s.length === 0) return {
		ptr: 1,
		len: 0
	};
	let { len, codepoints } = __jcoEmbeddedRuntime$utf8Size(s);
	return __jcoEmbeddedRuntime$writeUtf8(encoder, s, realloc(0, 0, 1, len), len, codepoints, memory);
};
const __jcoEmbeddedRuntime$compactUtf16Decode = (decoder, memory, ptr, taggedLength) => {
	ptr >>>= 0;
	taggedLength >>>= 0;
	if (ptr % 2 != 0) throw RangeError("unaligned compact UTF-16 string");
	if (taggedLength & 2147483648) return decoder.decode(new Uint8Array(memory.buffer, ptr, (taggedLength & 2147483647) * 2));
	let bytes = new Uint8Array(memory.buffer, ptr, taggedLength);
	let value = "";
	for (let i = 0; i < bytes.length; i += 32768) value += String.fromCharCode(...bytes.subarray(i, i + 32768));
	return value;
};
const __jcoEmbeddedRuntime$compactUtf16Encode = (context, value, realloc, memory) => {
	if (typeof value != "string") throw TypeError("expected a string");
	if (value.length >= 2147483648) throw RangeError("compact UTF-16 string is too long");
	for (let i = 0; i < value.length; i++) if (value.charCodeAt(i) > 255) {
		let encoded = __jcoEmbeddedRuntime$utf16Encode(context, value, realloc, memory);
		return {
			...encoded,
			len: (encoded.len | 2147483648) >>> 0
		};
	}
	let ptr = realloc(0, 0, 2, value.length) >>> 0;
	if (ptr % 2 != 0) throw RangeError("unaligned compact UTF-16 allocation");
	let bytes = new Uint8Array(memory.buffer, ptr, value.length);
	for (let i = 0; i < value.length; i++) bytes[i] = value.charCodeAt(i);
	return {
		ptr,
		len: value.length
	};
};
function __jcoEmbeddedRuntime$initializeRepTableClass(context) {
	let { RuntimeError } = context;
	let free = Symbol("RepTable.free");
	class RepTable {
		static FREE = free;
		#data = [0, null];
		#size = 0;
		target;
		#space = null;
		constructor(args) {
			this.target = args?.target;
			this.#space = args?.space ?? null;
		}
		data() {
			return this.#data;
		}
		insert(val) {
			if (this.#space !== null) {
				let rep = this.#space.alloc();
				this.#data[rep << 1] = val;
				this.#data[(rep << 1) + 1] = null;
				this.#size += 1;
				return rep;
			}
			__jcoEmbeddedRuntime$debugLog("[RepTable#insert()] args", {
				val,
				target: this.target
			});
			let freeIdx = this.#data[0];
			if (freeIdx === 0) {
				this.#data.push(val);
				this.#data.push(null);
				let rep = (this.#data.length >> 1) - 1;
				__jcoEmbeddedRuntime$debugLog("[RepTable#insert()] inserted", {
					val,
					target: this.target,
					rep
				});
				this.#size += 1;
				return rep;
			}
			let placementIdx = freeIdx << 1;
			if (this.#data[placementIdx] !== free) throw Error("corrupt rep table freelist: head does not point at a freed slot");
			this.#data[0] = this.#data[placementIdx + 1];
			this.#data[placementIdx] = val;
			this.#data[placementIdx + 1] = null;
			__jcoEmbeddedRuntime$debugLog("[RepTable#insert()] inserted", {
				val,
				target: this.target,
				rep: freeIdx
			});
			this.#size += 1;
			return freeIdx;
		}
		get(rep) {
			__jcoEmbeddedRuntime$debugLog("[RepTable#get()] args", {
				rep,
				target: this.target
			});
			if (rep === 0) throw new RuntimeError("invalid resource rep during get, (cannot be 0)");
			let baseIdx = rep << 1;
			let val = this.#data[baseIdx];
			if (val === free) return;
			return val;
		}
		contains(rep) {
			__jcoEmbeddedRuntime$debugLog("[RepTable#contains()] args", {
				rep,
				target: this.target
			});
			if (rep === 0) throw Error("invalid resource rep during contains, (cannot be 0)");
			let baseIdx = rep << 1;
			let val = this.#data[baseIdx];
			return val !== free && !!val;
		}
		remove(rep) {
			__jcoEmbeddedRuntime$debugLog("[RepTable#remove()] args", {
				rep,
				target: this.target
			});
			if (rep === 0) throw Error("invalid resource rep during remove, (cannot be 0)");
			if (this.#space !== null) {
				let baseIdx = rep << 1;
				let val = this.#data[baseIdx];
				if (val === void 0 || val === free) throw new RuntimeError(`unknown handle index ${rep}`);
				this.#data[baseIdx] = free;
				this.#data[baseIdx + 1] = null;
				--this.#size;
				this.#space.release(rep);
				return val;
			}
			if (this.#data.length === 2) throw Error("invalid");
			let baseIdx = rep << 1;
			if (baseIdx >= this.#data.length) throw Error(`invalid rep [${rep}] during remove, out of range`);
			let val = this.#data[baseIdx];
			if (val === free) throw new RuntimeError(`double removal of rep [${rep}] (already freed)`);
			this.#data[baseIdx] = free;
			this.#data[baseIdx + 1] = this.#data[0];
			this.#data[0] = rep;
			--this.#size;
			return val;
		}
		size() {
			return this.#size;
		}
		clear() {
			__jcoEmbeddedRuntime$debugLog("[RepTable#clear()] args", { target: this.target });
			if (this.#space) for (let rep = 1; rep < this.#data.length / 2; rep++) this.#data[(rep << 1) + 1] === null && this.#data[rep << 1] !== free && this.#space.release(rep);
			this.#size = 0;
			this.#data = [0, null];
		}
	}
	return RepTable;
}
const __jcoEmbeddedRuntime$initializeAsyncDeterminism = (mode) => mode;
const __jcoEmbeddedRuntime$initializeRuntimeErrorConstructor = (platform) => platform.RuntimeError;
const __jcoEmbeddedRuntime$initializeSymbolCabiDispose = () => Symbol.for("cabiDispose");
const __jcoEmbeddedRuntime$initializeSymbolResourceHandle = () => Symbol("handle");
const __jcoEmbeddedRuntime$initializeSymbolResourceRep = () => Symbol.for("cabiRep");
const __jcoEmbeddedRuntime$initializeSymbolDispose = () => Symbol.dispose || Symbol.for("dispose");
const __jcoEmbeddedRuntime$initializeEndianness = () => new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
const __jcoEmbeddedRuntime$initializeHasOwnProperty = () => Object.prototype.hasOwnProperty;
const __jcoEmbeddedRuntime$initializeAsyncEventCodes = () => ({
	NONE: 0,
	SUBTASK: 1,
	STREAM_READ: 2,
	STREAM_WRITE: 3,
	FUTURE_READ: 4,
	FUTURE_WRITE: 5,
	TASK_CANCELLED: 6
});
const __jcoEmbeddedRuntime$initializeComponentMemoryMap = () => new Map();
const __jcoEmbeddedRuntime$initializeFileCompileCache = (nodejsCompat) => ({
	node: !!(nodejsCompat && globalThis.process?.versions?.node),
	fs: void 0
});
const __jcoEmbeddedRuntime$coinFlip = () => Math.random() > .5;
const __jcoEmbeddedRuntime$base64Compile = (context, encoded) => {
	let host = globalThis;
	return context.WebAssembly.compile(context.nodejsCompat && host.Buffer !== void 0 ? host.Buffer.from(encoded, "base64") : Uint8Array.from(atob(encoded), (byte) => byte.charCodeAt(0)));
};
async function __jcoEmbeddedRuntime$fetchWithNode(context, url) {
	if (context.fileCache.node) {
		context.fileCache.fs = context.fileCache.fs || await import("node:fs/promises");
		return context.WebAssembly.compile(await context.fileCache.fs.readFile(url));
	}
	return fetch(url).then(context.WebAssembly.compileStreaming);
}
const __jcoEmbeddedRuntime$fetchCompile = (context, url) => context.nodejsCompat ? __jcoEmbeddedRuntime$fetchWithNode(context, url) : fetch(url).then(context.WebAssembly.compileStreaming);
const __jcoEmbeddedRuntime$instantiateCore = (platform, module, imports) => platform.instantiate(module, imports);
const __jcoEmbeddedRuntime$clampGuest = (value, min, max) => {
	if (value < min || value > max) throw TypeError(`must be between ${min} and ${max}`);
	return value;
};
const __jcoEmbeddedRuntime$getErrorPayload = (hasOwnProperty, error) => {
	if (error && hasOwnProperty.call(error, "payload")) return error.payload;
	if (error instanceof Error) throw error;
	return error;
};
const __jcoEmbeddedRuntime$disposeHostValue = (disposeSymbol, value, disposeFn) => {
	if (!disposeFn) {
		if (value === null || typeof value != "object" && typeof value != "function") return;
		let disposable = value;
		if (typeof Symbol.asyncDispose == "symbol" && typeof disposable[Symbol.asyncDispose] == "function") disposeFn = disposable[Symbol.asyncDispose];
		else if (typeof disposable[disposeSymbol] == "function") disposeFn = disposable[disposeSymbol];
		else return;
	}
	let dispose = disposeFn;
	let report = (error) => console.error("[jco] error while disposing discarded host value", error);
	queueMicrotask(() => {
		try {
			let result = dispose.call(value);
			result && typeof result.then == "function" && result.then(void 0, report);
		} catch (error) {
			report(error);
		}
	});
};
function __jcoEmbeddedRuntime$lookupMemories(map, args) {
	let { componentIdx } = args ?? {};
	if (args.componentIdx === void 0) throw TypeError("missing component idx");
	let metas = map.get(componentIdx);
	if (!metas) return [];
	return args.memoryIdx === void 0 ? Object.values(metas) : metas[args.memoryIdx]?.memory;
}
function __jcoEmbeddedRuntime$initializeWaitableClass() {
	class Waitable {
		#componentIdx;
		#pendingEventFn = null;
		#promise;
		#resolve;
		#reject;
		#waitableSet = null;
		#hasSyncWaiter = !1;
		#idx = null;
		target;
		constructor(args) {
			let { componentIdx } = args;
			this.#componentIdx = componentIdx;
			this.target = args.target;
			this.#resetPromise();
		}
		componentIdx() {
			return this.#componentIdx;
		}
		isInSet() {
			return this.#waitableSet !== null;
		}
		idx() {
			return this.#idx;
		}
		setIdx(idx) {
			if (idx === 0) throw Error("waitable idx cannot be zero");
			this.#idx = idx;
		}
		setTarget(tgt) {
			this.target = tgt;
		}
		#resetPromise() {
			let { promise, resolve, reject } = __jcoEmbeddedRuntime$promiseWithResolvers();
			this.#promise = promise;
			this.#resolve = resolve;
			this.#reject = reject;
		}
		resolve() {
			this.#resolve();
		}
		reject(err) {
			this.#reject(err);
		}
		promise() {
			return this.#promise;
		}
		hasPendingEvent() {
			return this.#pendingEventFn !== null;
		}
		setPendingEvent(fn) {
			__jcoEmbeddedRuntime$debugLog("[Waitable#setPendingEvent()] args", {
				waitable: this,
				inSet: this.#waitableSet
			});
			this.#pendingEventFn = fn;
		}
		getPendingEvent() {
			__jcoEmbeddedRuntime$debugLog("[Waitable#getPendingEvent()] args", {
				waitable: this,
				inSet: this.#waitableSet,
				hasPendingEvent: this.#pendingEventFn !== null
			});
			if (this.#pendingEventFn === null) return null;
			let eventFn = this.#pendingEventFn;
			this.#pendingEventFn = null;
			let e = eventFn();
			this.#resetPromise();
			return e;
		}
		join(waitableSet) {
			__jcoEmbeddedRuntime$debugLog("[Waitable#join()] args", {
				waitable: this,
				waitableSet,
				isRemoval: waitableSet === null
			});
			if (waitableSet === void 0) throw TypeError("waitable set must be not be undefined");
			this.#waitableSet && this.#waitableSet.removeWaitable(this);
			this.#waitableSet = waitableSet;
			waitableSet && waitableSet.addWaitable(this);
		}
		drop() {
			__jcoEmbeddedRuntime$debugLog("[Waitable#drop()] args", {
				componentIdx: this.#componentIdx,
				waitable: this
			});
			this.join(null);
		}
		async waitForPendingEvent(args) {
			let { cstate } = args;
			if (!cstate) throw TypeError("missing component state");
			if (this.#waitableSet !== null || this.#hasSyncWaiter) throw Error("waitable is already in a set/has a sync waiter");
			this.#hasSyncWaiter = !0;
			try {
				await cstate.waitUntil({
					cancellable: !1,
					readyFn: () => this.hasPendingEvent()
				});
			} finally {
				this.#hasSyncWaiter = !1;
			}
		}
	}
	return Waitable;
}
const __jcoEmbeddedRuntime$initializeTasksByComponent = () => new Map();
const __jcoEmbeddedRuntime$initializeCurrentTaskIds = () => [];
const __jcoEmbeddedRuntime$initializeCurrentComponentIdxs = () => [];
const __jcoEmbeddedRuntime$initializeCurrentTaskMayBlock = (platform) => {
	if (platform === !1) return !1;
	let Global = platform.Global;
	if (!Global) throw TypeError("async task registers require WebAssembly.Global");
	return new Global({
		value: "i32",
		mutable: !0
	}, 0);
};
const __jcoEmbeddedRuntime$TASK_INITIAL = "initial";
const __jcoEmbeddedRuntime$TASK_CANCEL_PENDING = "cancel-pending";
const __jcoEmbeddedRuntime$TASK_CANCEL_DELIVERED = "cancel-delivered";
const __jcoEmbeddedRuntime$TASK_RESOLVED = "resolved";
function __jcoEmbeddedRuntime$initializeAsyncTaskClass(context) {
	let { lookup: _lookup, registers: _registers, clearing: _clearing, RuntimeError: _RuntimeError, AsyncSubtask: _Subtask, Waitable: _Waitable, events: _events, determinism: _determinism, FutureValue, scopeCounter: _scopeCounter, scopeTasks: _scopeTasks, storeTrap: _storeTrap } = context;
	class AsyncTask {
		static _ID = 0n;
		static #hostThreadID = 0;
		static State = {
			INITIAL: __jcoEmbeddedRuntime$TASK_INITIAL,
			CANCELLED: "cancelled",
			CANCEL_PENDING: __jcoEmbeddedRuntime$TASK_CANCEL_PENDING,
			CANCEL_DELIVERED: __jcoEmbeddedRuntime$TASK_CANCEL_DELIVERED,
			RESOLVED: __jcoEmbeddedRuntime$TASK_RESOLVED
		};
		static BlockResult = {
			CANCELLED: "block.cancelled",
			NOT_CANCELLED: "block.not-cancelled"
		};
		#id;
		#componentIdx;
		#state;
		#isAsync;
		#isManualAsync;
		#callingWasmExport = !0;
		#lockFreeEntry = !1;
		#preserveFutureResult;
		#entryFnName;
		#onResolveHandlers = [];
		#progressWaiters = [];
		#completionPromise;
		#completionValue;
		#completionReady = !1;
		#settleCompletionPromise;
		#rejected = !1;
		#exitPromise;
		#resolveExitPromise;
		#memoryIdx = null;
		#memory = null;
		#callbackFn = null;
		#callbackFnName = null;
		#postReturnFn = null;
		#getCalleeParamsFn = null;
		#calleeIsAsync = null;
		#admissionTicket = null;
		#funcTypeIsAsync = !1;
		#returnResultTypeIdx = null;
		#parentSubtask = null;
		#errHandling;
		#returnLowerFns = null;
		#resourceScopeId;
		#resourceBorrowCount = 0;
		#resourceLenders = [];
		#resourceScopeExited = !1;
		#subtasks = [];
		#threads = [];
		#entered = !1;
		#exited = !1;
		#errored = null;
		get storage() {
			return this.defaultThread().storage;
		}
		cancelled = !1;
		cancelRequested = !1;
		alwaysTaskReturn = !1;
		returnCalls = 0;
		tmpRetI64HighBits = 0;
		constructor(opts) {
			this.#id = ++AsyncTask._ID;
			this.#resourceScopeId = ++_scopeCounter.value;
			_scopeTasks.set(this.#resourceScopeId, this);
			if (opts?.componentIdx === void 0) throw TypeError("missing component id during task creation");
			this.#componentIdx = opts.componentIdx;
			this.#state = __jcoEmbeddedRuntime$TASK_INITIAL;
			this.#isAsync = opts.isAsync ?? !1;
			this.#isManualAsync = opts.isManualAsync ?? !1;
			this.#preserveFutureResult = opts.preserveFutureResult ?? !1;
			this.#entryFnName = opts.entryFnName;
			this.#callingWasmExport = opts.callingWasmExport !== !1;
			let { promise: completionPromise, resolve: resolveCompletionPromise, reject: rejectCompletionPromise } = __jcoEmbeddedRuntime$promiseWithResolvers();
			this.#completionPromise = completionPromise;
			completionPromise.then(__jcoEmbeddedRuntime$emptyFunc, __jcoEmbeddedRuntime$emptyFunc);
			let completionSettled = !1;
			let settleCompletionPromise = () => {
				if (completionSettled || !this.#completionReady) return;
				completionSettled = !0;
				this.#errored === null ? this.#rejected ? rejectCompletionPromise(this.#completionValue) : this.#preserveFutureResult && this.#completionValue instanceof FutureValue ? this.#completionValue.resolveAsValue(resolveCompletionPromise) : resolveCompletionPromise(this.#completionValue) : rejectCompletionPromise(this.#errored);
			};
			this.#settleCompletionPromise = settleCompletionPromise;
			this.#onResolveHandlers.push((results) => {
				if (this.#parentSubtask !== null) return;
				if (!this.#isAsync && !this.#isManualAsync) return;
				this.#completionValue = results;
				this.#completionReady = !0;
			});
			let { promise: exitPromise, resolve: resolveExitPromise } = __jcoEmbeddedRuntime$promiseWithResolvers();
			this.#exitPromise = exitPromise;
			this.#resolveExitPromise = resolveExitPromise;
			opts.callbackFn && (this.#callbackFn = opts.callbackFn);
			opts.callbackFnName && (this.#callbackFnName = opts.callbackFnName);
			opts.getCalleeParamsFn && (this.#getCalleeParamsFn = opts.getCalleeParamsFn);
			opts.parentSubtask && (this.#parentSubtask = opts.parentSubtask);
			opts.errHandling && (this.#errHandling = opts.errHandling);
		}
		taskState() {
			return this.#state;
		}
		id() {
			return this.#id;
		}
		componentIdx() {
			return this.#componentIdx;
		}
		entryFnName() {
			return this.#entryFnName;
		}
		resourceScopeId() {
			return this.#resourceScopeId;
		}
		addBorrowedHandle() {
			if (this.#resourceScopeExited) throw Error("cannot add a borrow to an exited resource scope");
			this.#resourceBorrowCount++;
		}
		removeBorrowedHandle() {
			if (this.#resourceBorrowCount === 0) throw Error("resource borrow count underflow");
			this.#resourceBorrowCount--;
		}
		addResourceLender(table, handle) {
			if (this.#resourceScopeExited) throw Error("cannot add a lender to an exited resource scope");
			this.#resourceLenders.push({
				table,
				handle
			});
		}
		validateResourceBorrowScope() {
			if (this.#resourceScopeExited) return;
			if (_storeTrap.stopped) {
				this.#resourceLenders = [];
				this.#resourceScopeExited = !0;
				_scopeTasks.delete(this.#resourceScopeId);
				return;
			}
			if (this.#resourceBorrowCount !== 0) throw new _RuntimeError("borrow handles still remain at the end of the call");
			for (let { table, handle } of this.#resourceLenders) {
				let idx = handle << 1;
				let lendCount = table[idx];
				if (!Number.isInteger(lendCount) || lendCount <= 0 || lendCount >= 2 ** 30) throw Error("invalid resource lender state at scope exit");
				table[idx] = lendCount - 1;
			}
			this.#resourceLenders = [];
			this.#resourceScopeExited = !0;
			_scopeTasks.delete(this.#resourceScopeId);
		}
		completionPromise() {
			return this.#completionPromise;
		}
		settleCompletion() {
			this.#settleCompletionPromise();
		}
		exitPromise() {
			return this.#exitPromise;
		}
		waitForProgress() {
			let { promise, resolve } = __jcoEmbeddedRuntime$promiseWithResolvers();
			this.#progressWaiters.push(resolve);
			return promise;
		}
		notifyProgress() {
			let waiters = this.#progressWaiters;
			this.#progressWaiters = [];
			for (let resolve of waiters) resolve();
		}
		isAsync() {
			return this.#isAsync;
		}
		isManualAsync() {
			return this.#isManualAsync;
		}
		isSync() {
			return !this.isAsync();
		}
		getErrHandling() {
			return this.#errHandling;
		}
		hasCallback() {
			return this.#callbackFn !== null;
		}
		getReturnMemoryIdx() {
			return this.#memoryIdx;
		}
		setReturnMemoryIdx(idx) {
			if (idx === null) return;
			this.#memoryIdx = idx;
		}
		getReturnMemory() {
			return this.#memory;
		}
		setReturnMemory(m) {
			if (m === null) return;
			this.#memory = m;
		}
		setReturnLowerFns(fns) {
			this.#returnLowerFns = fns;
		}
		getReturnLowerFns() {
			return this.#returnLowerFns;
		}
		setCalleeIsAsync(value) {
			if (typeof value != "boolean") throw TypeError("callee async state must be a boolean");
			this.#calleeIsAsync = value;
		}
		setParentSubtask(subtask) {
			if (!subtask || !(subtask instanceof _Subtask)) return;
			if (this.#parentSubtask) throw Error("parent subtask can only be set once");
			this.#parentSubtask = subtask;
		}
		getParentSubtask() {
			return this.#parentSubtask;
		}
		getRootTask() {
			let currentSubtask = this.getParentSubtask();
			let task = this;
			for (; currentSubtask;) {
				task = currentSubtask.getParentTask();
				currentSubtask = task.getParentSubtask();
			}
			return task;
		}
		setPostReturnFn(f) {
			if (!f) return;
			if (this.#postReturnFn) throw Error("postReturn fn can only be set once");
			this.#postReturnFn = f;
		}
		setCallbackFn(f, name) {
			if (!f) return;
			if (this.#callbackFn) throw Error("callback fn can only be set once");
			this.#callbackFn = f;
			this.#callbackFnName = name;
		}
		getCallbackFnName() {
			if (!this.#callbackFnName) return;
			return this.#callbackFnName;
		}
		runCallbackFn(...args) {
			if (!this.#callbackFn) throw Error("no callback function has been set for task");
			if (this.#callbackFn._jcoMaySuspend === !1) return __jcoEmbeddedRuntime$withCurrentTaskMeta(_registers, {
				taskID: this.#id,
				threadID: this.defaultThread().id(),
				componentIdx: this.#componentIdx,
				fn: () => this.#callbackFn.apply(null, args)
			});
			return __jcoEmbeddedRuntime$withCurrentTaskMetaAsync(_registers, {
				taskID: this.#id,
				threadID: this.defaultThread().id(),
				componentIdx: this.#componentIdx,
				fn: () => this.#callbackFn.apply(null, args)
			});
		}
		getCalleeParams() {
			if (!this.#getCalleeParamsFn) throw Error("missing/invalid getCalleeParamsFn");
			return this.#getCalleeParamsFn();
		}
		mayBlock() {
			return this.isAsync() || this.isManualAsync() || this.isResolvedState() || this.#funcTypeIsAsync;
		}
		setFuncTypeIsAsync(v) {
			this.#funcTypeIsAsync = v;
		}
		setReturnResultTypeIdx(v) {
			this.#returnResultTypeIdx = v;
		}
		returnResultTypeIdx() {
			return this.#returnResultTypeIdx;
		}
		mayEnter(task) {
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			if (cstate.hasBackpressure()) {
				__jcoEmbeddedRuntime$debugLog("[AsyncTask#mayEnter()] disallowed due to backpressure", { taskID: this.#id });
				return !1;
			}
			if (!cstate.callingSyncImport()) {
				__jcoEmbeddedRuntime$debugLog("[AsyncTask#mayEnter()] disallowed due to sync import call", { taskID: this.#id });
				return !1;
			}
			if (!Reflect.get(cstate, "callingSyncExport") || task.isAsync) {
				__jcoEmbeddedRuntime$debugLog("[AsyncTask#mayEnter()] disallowed due to sync export w/ sync pending", { taskID: this.#id });
				return !1;
			}
			return !0;
		}
		enterSync() {
			if (this.needsExclusiveLock()) {
				let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
				if (!cstate.isExclusivelyLocked()) cstate.exclusiveLock(this.#id);
				else {
					this.#lockFreeEntry = !0;
					__jcoEmbeddedRuntime$debugLog("[AsyncTask#enterSync()] entering without exclusive lock", {
						taskID: this.#id,
						componentIdx: this.#componentIdx
					});
				}
			}
			return !0;
		}
		tryEnter() {
			if (this.#entered) throw Error(`task with ID [${this.#id}] should not be entered twice`);
			if (this.deliverPendingCancel({ cancellable: !0 })) {
				this.cancel();
				return !1;
			}
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			if (this.isSync()) {
				this.#entered = !0;
				return !0;
			}
			if (cstate.hasBackpressure()) return null;
			if (cstate.hasPendingAdmissions()) return null;
			if (this.needsExclusiveLock()) {
				if (cstate.isExclusivelyLocked()) return null;
				cstate.exclusiveLock(this.#id);
			}
			if (this.deliverPendingCancel({ cancellable: !0 })) {
				cstate.exclusiveRelease(this.#id);
				this.cancel();
				return !1;
			}
			this.#entered = !0;
			return !0;
		}
		async enter(opts) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#enter()] args", {
				taskID: this.#id,
				componentIdx: this.#componentIdx,
				subtaskID: this.getParentSubtask()?.id(),
				args: opts,
				entryFnName: this.#entryFnName
			});
			if (opts?.isHost) return this.enterHost();
			if (this.#entered) throw Error(`task with ID [${this.#id}] should not be entered twice`);
			if (this.deliverPendingCancel({ cancellable: !0 })) {
				this.cancel();
				return !1;
			}
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			if (this.isSync()) {
				this.#entered = !0;
				this.#isManualAsync && this.needsExclusiveLock() && await cstate.acquireExclusiveLock(this.#id);
				return this.#entered;
			}
			let ticket = cstate.takeAdmissionTicket(this.#id);
			this.#admissionTicket = ticket;
			let entered = !1;
			try {
				entered = await this.#enterQueued(cstate, ticket);
				return entered;
			} finally {
				entered || this.endFirstSlice();
			}
		}
		endFirstSlice() {
			let ticket = this.#admissionTicket;
			if (ticket === null) return;
			this.#admissionTicket = null;
			__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx).releaseAdmissionTicket(ticket);
		}
		async #enterQueued(cstate, ticket) {
			await cstate.waitForAdmissionTurn(ticket);
			if (this.isResolvedState() || this.isCancelled()) return !1;
			for (;;) {
				if (cstate.hasBackpressure()) {
					cstate.addBackpressureWaiter();
					let result = await this.waitUntil({
						readyFn: () => !cstate.hasBackpressure(),
						cancellable: !0
					});
					cstate.removeBackpressureWaiter();
					if (!result || this.isCancelled()) {
						this.isResolvedState() || this.cancel();
						return !1;
					}
				}
				if (this.needsExclusiveLock()) {
					await cstate.acquireExclusiveLock(this.#id);
					if (cstate.hasBackpressure()) {
						cstate.exclusiveRelease(this.#id);
						continue;
					}
				}
				break;
			}
			try {
				cstate.throwIfInterrupted();
			} catch (err) {
				cstate.exclusiveRelease(this.#id);
				this.setErrored(err);
				return !1;
			}
			if (this.isResolvedState() || this.isCancelled()) {
				cstate.exclusiveRelease(this.#id);
				return !1;
			}
			if (this.deliverPendingCancel({ cancellable: !0 })) {
				cstate.exclusiveRelease(this.#id);
				this.cancel();
				return !1;
			}
			this.#entered = !0;
			return this.#entered;
		}
		isRunningState() {
			return this.#state !== __jcoEmbeddedRuntime$TASK_RESOLVED;
		}
		isResolvedState() {
			return this.#state === __jcoEmbeddedRuntime$TASK_RESOLVED;
		}
		isResolved() {
			return this.#state === __jcoEmbeddedRuntime$TASK_RESOLVED;
		}
		isExited() {
			return this.#exited;
		}
		async waitUntil(opts) {
			let { readyFn, cancellable } = opts;
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#waitUntil()] args", {
				taskID: this.#id,
				args: { cancellable }
			});
			return await this.suspendUntil({
				readyFn,
				cancellable
			});
		}
		async yieldUntil(opts) {
			let { readyFn, cancellable } = opts;
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#yieldUntil()]", {
				taskID: this.#id,
				args: { cancellable },
				componentIdx: this.#componentIdx
			});
			return {
				code: await this.immediateSuspend({
					readyFn,
					cancellable
				}) ? _events.NONE : _events.TASK_CANCELLED,
				payload0: 0,
				payload1: 0
			};
		}
		async suspendUntil(opts) {
			let { cancellable, readyFn } = opts;
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#suspendUntil()] args", {
				taskID: this.#id,
				args: { cancellable },
				componentIdx: this.#componentIdx
			});
			if (this.deliverPendingCancel({ cancellable })) return !1;
			return await this.immediateSuspendUntil({
				readyFn,
				cancellable
			});
		}
		suspendUntilCallback(opts, onResume) {
			let { cancellable, readyFn } = opts;
			if (this.deliverPendingCancel({ cancellable })) {
				onResume(!1);
				return;
			}
			__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx).suspendTask({
				task: this,
				cancellable: !!cancellable,
				readyFn: () => {
					if (cancellable && this.#state === __jcoEmbeddedRuntime$TASK_CANCEL_PENDING) return !0;
					return readyFn();
				},
				onResume: (keepGoing) => {
					keepGoing && this.deliverPendingCancel({ cancellable }) && (keepGoing = !1);
					onResume(keepGoing);
				}
			});
		}
		async immediateSuspendUntil(opts) {
			let { cancellable, readyFn } = opts;
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#immediateSuspendUntil()] args", {
				args: {
					cancellable,
					readyFn
				},
				taskID: this.#id,
				componentIdx: this.#componentIdx
			});
			if (readyFn() && _determinism === "random" && __jcoEmbeddedRuntime$coinFlip()) return !0;
			return await this.immediateSuspend({
				cancellable,
				readyFn
			});
		}
		async immediateSuspend(opts) {
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			let thread = this.#entered ? cstate.threads.get(__jcoEmbeddedRuntime$getCurrentTaskMeta(_registers, this.#componentIdx).threadID) : this.defaultThread();
			if (!thread || thread.task() !== this) throw Error("invalid current thread for wait");
			return thread.suspend({
				...opts,
				releaseLock: !1
			});
		}
		deliverPendingCancel(opts) {
			let { cancellable } = opts;
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#deliverPendingCancel()]", {
				args: { cancellable },
				taskID: this.#id,
				componentIdx: this.#componentIdx
			});
			if (cancellable && this.#state === __jcoEmbeddedRuntime$TASK_CANCEL_PENDING) {
				this.#state = __jcoEmbeddedRuntime$TASK_CANCEL_DELIVERED;
				return !0;
			}
			return !1;
		}
		isCancelled() {
			return this.cancelled;
		}
		cancellationRequested() {
			return this.cancelRequested;
		}
		requestCancellation() {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#requestCancellation()] args", {
				taskID: this.#id,
				componentIdx: this.#componentIdx,
				state: this.#state
			});
			if (this.isResolvedState() || this.cancelRequested) return;
			this.cancelRequested = !0;
			if (this.#state === __jcoEmbeddedRuntime$TASK_INITIAL) {
				this.#state = __jcoEmbeddedRuntime$TASK_CANCEL_PENDING;
				if (!this.#entered) {
					this.deliverPendingCancel({ cancellable: !0 });
					this.cancel();
					let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
					cstate.resumeTaskByID(this.#id);
					cstate.cancelExclusiveLockWaiter(this.#id);
					this.exit({ skipExclusiveLockCheck: !0 });
					return;
				}
			}
			__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx).runTickLoop();
		}
		cancel(args) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#cancel()] args", {});
			if (this.taskState() !== __jcoEmbeddedRuntime$TASK_CANCEL_DELIVERED) throw Error("`task.cancel` called by task which has not been cancelled");
			this.validateResourceBorrowScope();
			this.cancelled = !0;
			this.onResolve(args?.error ?? null);
			this.#state = __jcoEmbeddedRuntime$TASK_RESOLVED;
			this.#entered || this.notifyProgress();
		}
		onResolve(taskValue) {
			let handlers = this.#onResolveHandlers;
			this.#onResolveHandlers = [];
			for (let f of handlers) try {
				f(taskValue);
			} catch (err) {
				__jcoEmbeddedRuntime$debugLog("[AsyncTask#onResolve] error during task resolve handler", err);
				throw err;
			}
			if (this.#rejected) {
				this.#parentSubtask?.reject(taskValue);
				return;
			}
			let parentSubtaskPending = this.#parentSubtask && !this.#parentSubtask.isResolved();
			let taskReturned = !this.isCancelled();
			if (parentSubtaskPending && taskReturned) {
				let meta = this.#parentSubtask.getCallMetadata();
				if (meta.returnFn && !meta.returnFnCalled) {
					__jcoEmbeddedRuntime$debugLog("[AsyncTask#onResolve()] running returnFn", {
						componentIdx: this.#componentIdx,
						taskID: this.#id,
						subtaskID: this.#parentSubtask.id()
					});
					let callerTask = this.#parentSubtask.getParentTask();
					__jcoEmbeddedRuntime$withCurrentTaskMeta(_registers, {
						taskID: callerTask.id(),
						threadID: meta.callerThreadID,
						componentIdx: callerTask.componentIdx(),
						fn: () => meta.returnFn.apply(null, [taskValue, meta.resultPtr])
					});
					meta.returnFnCalled = !0;
				}
			}
			if (this.#postReturnFn && taskReturned) {
				__jcoEmbeddedRuntime$debugLog("[AsyncTask#onResolve()] running post return ", {
					componentIdx: this.#componentIdx,
					taskID: this.#id
				});
				try {
					__jcoEmbeddedRuntime$withCurrentTaskMeta(_registers, {
						taskID: this.#id,
						threadID: this.defaultThread().id(),
						componentIdx: this.#componentIdx,
						fn: () => this.#postReturnFn(taskValue)
					});
				} catch (err) {
					err = __jcoEmbeddedRuntime$postReturnTrap(context.postReturn, this.#componentIdx, err);
					this.reject(err);
					throw err;
				}
			}
			parentSubtaskPending && this.#parentSubtask.onResolve(taskValue);
		}
		registerOnResolveHandler(f) {
			this.#onResolveHandlers.push(f);
		}
		isRejected() {
			return this.#rejected;
		}
		isErrored() {
			return this.#errored;
		}
		setErrored(err) {
			this.#errored === null && (this.#errored = err);
		}
		stop(err) {
			this.reject(err);
			this.#completionReady = !0;
			this.#settleCompletionPromise();
		}
		reject(taskErr) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#reject()] args", {
				componentIdx: this.#componentIdx,
				taskID: this.#id,
				parentSubtask: this.#parentSubtask,
				parentSubtaskID: this.#parentSubtask?.id(),
				entryFnName: this.entryFnName(),
				callbackFnName: this.#callbackFnName,
				errMsg: taskErr.message
			});
			this.setErrored(taskErr);
			if (this.#rejected) return;
			if (this.isResolvedState()) {
				this.#rejected = !0;
				this.#errored = taskErr;
				let parentTask = this.#parentSubtask?.getParentTask();
				parentTask && parentTask.reject(taskErr);
				return;
			}
			this.#rejected = !0;
			this.cancelRequested = !0;
			this.#state = __jcoEmbeddedRuntime$TASK_CANCEL_PENDING;
			this.deliverPendingCancel({ cancellable: !0 });
			this.cancel({ error: taskErr });
		}
		resolve(results) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#resolve()] args", {
				componentIdx: this.#componentIdx,
				taskID: this.#id,
				entryFnName: this.entryFnName(),
				callbackFnName: this.#callbackFnName
			});
			if (this.#state === __jcoEmbeddedRuntime$TASK_RESOLVED) {
				if (this.#errored !== null) throw this.#errored;
				throw Error(`(component [${this.#componentIdx}]) task [${this.#id}]  is already resolved (did you forget to wait for an import?)`);
			}
			this.validateResourceBorrowScope();
			this.#state = __jcoEmbeddedRuntime$TASK_RESOLVED;
			switch (results.length) {
				case 0:
					this.onResolve(void 0);
					break;
				case 1:
					this.onResolve(results[0]);
					break;
				default:
					__jcoEmbeddedRuntime$debugLog("[AsyncTask#resolve()] unexpected number of results", {
						componentIdx: this.#componentIdx,
						results,
						taskID: this.#id,
						subtaskID: this.#parentSubtask?.id(),
						entryFnName: this.#entryFnName,
						callbackFnName: this.#callbackFnName
					});
					throw Error("unexpected number of results");
			}
		}
		exit(args) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#exit()]", {
				componentIdx: this.#componentIdx,
				taskID: this.#id
			});
			this.endFirstSlice();
			if (this.#exited) throw Error("task has already exited");
			this.#checkThreadExit();
			this.validateResourceBorrowScope();
			let state = this.#componentIdx === -1 ? null : __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			if (!state && this.#componentIdx !== -1) throw Error("missing async state for component [" + this.#componentIdx + "]");
			if (state && !args?.skipExclusiveLockCheck && !this.#lockFreeEntry && this.needsExclusiveLock() && !state.exclusivelyLockedBy(this.#id)) throw Error(`task [${this.#id}] exit: component [${this.#componentIdx}] should have been exclusively locked by it`);
			state && state.exclusiveRelease(this.#id);
			this.notifyProgress();
			try {
				this.#parentSubtask === null && (this.#isAsync || this.#isManualAsync) && this.#settleCompletionPromise();
				this.#resolveExitPromise();
			} catch (err) {
				console.error("error during task exit handler", err);
				throw err;
			}
			this.#exited = !0;
			this.removeThread(this.defaultThread());
			this.#threads.length > 0 && __jcoEmbeddedRuntime$clearCurrentThread(_clearing, this.#componentIdx, this.#id, { preserveTask: !0 });
		}
		needsExclusiveLock() {
			if (this.#componentIdx === -1) return !1;
			if (!this.#callingWasmExport) return !1;
			if (!this.#funcTypeIsAsync) return !1;
			return !this.#isAsync || this.hasCallback() || this.#calleeIsAsync === !1;
		}
		createSubtask(args) {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#createSubtask()] args", args);
			let { componentIdx, childTask, callMetadata, fnName, isAsync, isManualAsync } = args;
			if (!__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx)) throw Error(`invalid/missing async state for component idx [${componentIdx}]`);
			let waitable = new _Waitable({
				componentIdx: this.#componentIdx,
				target: `subtask (internal ID [${this.#id}])`
			});
			let newSubtask = new _Subtask({
				componentIdx,
				childTask,
				parentTask: this,
				callMetadata,
				isAsync,
				isManualAsync,
				fnName,
				waitable
			});
			this.#subtasks.push(newSubtask);
			newSubtask.setTarget(`subtask (internal ID [${newSubtask.id()}], waitable [${waitable.idx()}], component [${componentIdx}])`);
			return newSubtask;
		}
		getLatestSubtask() {
			return this.#subtasks.at(-1);
		}
		getSubtaskByWaitableRep(rep) {
			if (rep === void 0) throw TypeError("missing rep");
			return this.#subtasks.find((s) => s.waitableRep() === rep);
		}
		currentSubtask() {
			__jcoEmbeddedRuntime$debugLog("[AsyncTask#currentSubtask()]");
			if (this.#subtasks.length === 0) return;
			return this.#subtasks.at(-1);
		}
		removeSubtask(subtask) {
			if (this.#subtasks.length === 0) throw Error("cannot end current subtask: no current subtask");
			this.#subtasks = this.#subtasks.filter((t) => t !== subtask);
			return subtask;
		}
		cancellationPending() {
			return this.#state === __jcoEmbeddedRuntime$TASK_CANCEL_PENDING;
		}
		enterHost() {
			if (this.#entered) throw Error(`task with ID [${this.#id}] should not be entered twice`);
			if (this.deliverPendingCancel({ cancellable: !0 })) {
				this.cancel();
				return !1;
			}
			__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			this.#entered = !0;
			let parentTask = this.#parentSubtask?.getParentTask();
			(parentTask?.taskState() === __jcoEmbeddedRuntime$TASK_CANCEL_DELIVERED || parentTask && !parentTask.hasCallback()) && parentTask.notifyProgress();
			return this.#entered;
		}
		defaultThread() {
			return this.#threads[0];
		}
		removeThread(thread) {
			this.#checkThreadExit();
			this.settleCompletion();
			this.#componentIdx !== -1 && __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx).threads.remove(thread.id());
			this.#threads = this.#threads.filter((t) => t !== thread);
			this.#exited && this.#threads.length === 0 && __jcoEmbeddedRuntime$clearCurrentThread(_clearing, this.#componentIdx, this.#id);
		}
		#checkThreadExit() {
			if (this.#threads.length === 1 && !this.isResolvedState() && !this.isRejected()) {
				let err = new _RuntimeError(`(component [${this.#componentIdx}]) task [${this.#id}] exited without resolution`);
				throw this.#componentIdx === -1 ? err : __jcoEmbeddedRuntime$recordTrap(context.traps, this.#componentIdx, err);
			}
		}
		addThread(thread) {
			if (this.#componentIdx === -1) {
				thread.setId(++AsyncTask.#hostThreadID);
				this.#threads.push(thread);
				return thread;
			}
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			thread.setId(cstate.threads.insert(thread));
			this.#threads.push(thread);
			return thread;
		}
		calleeIsAsync() {
			return this.#calleeIsAsync === !0;
		}
	}
	return AsyncTask;
}
function __jcoEmbeddedRuntime$initializeAsyncSubtaskClass(context) {
	let { lookup: _lookup, memories: _memories, disposeSymbol: _disposeSymbol, RuntimeError } = context;
	class AsyncSubtask {
		static _ID = 0n;
		static State = {
			STARTING: 0,
			STARTED: 1,
			RETURNED: 2,
			CANCELLED_BEFORE_STARTED: 3,
			CANCELLED_BEFORE_RETURNED: 4
		};
		#id;
		#state = 0;
		#componentIdx;
		#parentTask;
		#childTask = null;
		#cancelRequested = !1;
		#lenders = null;
		#waitable;
		#callbackFn = null;
		#postReturnFn = null;
		#onProgressFn = null;
		#callMetadata = {};
		#resolved = !1;
		#onResolveHandlers = [];
		#onStartHandlers = [];
		#result = null;
		#resultSet = !1;
		#hostPendingResult = null;
		fnName;
		target;
		isAsync;
		isManualAsync;
		cancelProgress = null;
		constructor(args) {
			if (typeof args.componentIdx != "number") throw Error("invalid componentIdx for subtask creation");
			this.#componentIdx = args.componentIdx;
			this.#id = ++AsyncSubtask._ID;
			this.fnName = args.fnName;
			if (!args.parentTask) throw Error("missing parent task during subtask creation");
			this.#parentTask = args.parentTask;
			args.childTask && (this.#childTask = args.childTask);
			if (!args.waitable) throw Error("missing/invalid waitable");
			this.#waitable = args.waitable;
			args.callMetadata && (this.#callMetadata = args.callMetadata);
			this.#lenders = [];
			this.target = args.target;
			this.isAsync = args.isAsync;
			this.isManualAsync = args.isManualAsync;
		}
		id() {
			return this.#id;
		}
		parentTaskID() {
			return this.#parentTask?.id();
		}
		childTaskID() {
			return this.#childTask?.id();
		}
		state() {
			return this.#state;
		}
		getWaitable() {
			return this.#waitable;
		}
		waitable() {
			return this.#waitable;
		}
		waitableRep() {
			return this.#waitable.idx();
		}
		ensureHandle() {
			let existing = this.#waitable.idx();
			if (existing != null) return existing;
			let idx = this.#getComponentState().handles.insert(this);
			this.#waitable.setIdx(idx);
			this.#waitable.setTarget(`waitable for subtask (waitable id [${idx}], subtask internal ID [${this.id()}])`);
			return idx;
		}
		join(set) {
			return this.#waitable.join(set);
		}
		getPendingEvent() {
			return this.#waitable.getPendingEvent();
		}
		hasPendingEvent() {
			return this.#waitable.hasPendingEvent();
		}
		setPendingEvent(fn) {
			return this.#waitable.setPendingEvent(fn);
		}
		setTarget(tgt) {
			this.target = tgt;
		}
		getResult() {
			if (!this.#resultSet) throw Error("subtask result has not been set");
			return this.#result;
		}
		setResult(v) {
			if (this.#resultSet) throw Error("subtask result has already been set");
			this.#result = v;
			this.#resultSet = !0;
		}
		componentIdx() {
			return this.#componentIdx;
		}
		setChildTask(t) {
			if (!t) throw Error("cannot set missing/invalid child task on subtask");
			if (this.#childTask) throw Error("child task is already set on subtask");
			if (this.#parentTask === t) throw Error("parent cannot be child");
			this.#childTask = t;
		}
		getChildTask() {
			return this.#childTask;
		}
		getParentTask() {
			return this.#parentTask;
		}
		setCallbackFn(f, _name) {
			if (!f) return;
			if (this.#callbackFn) throw Error("callback fn can only be set once");
			this.#callbackFn = f;
		}
		getCallbackFnName() {
			return this.#callbackFn?.name;
		}
		setPostReturnFn(f) {
			if (!f) return;
			if (this.#postReturnFn) throw Error("postReturn fn can only be set once");
			this.#postReturnFn = f;
		}
		setOnProgressFn(f) {
			if (this.#onProgressFn) throw Error("on progress fn can only be set once");
			this.#onProgressFn = f;
		}
		isNotStarted() {
			return this.#state == 0;
		}
		cancellationRequested() {
			return this.#cancelRequested;
		}
		requestCancellation() {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#requestCancellation()] args", {
				componentIdx: this.#componentIdx,
				subtaskID: this.#id,
				state: this.#state,
				childTaskID: this.childTaskID(),
				fnName: this.fnName
			});
			if (this.#cancelRequested) throw Error("cancellation has already been requested for this subtask");
			this.#cancelRequested = !0;
			if (this.#resolved) return;
			if (this.#childTask) {
				this.#childTask.requestCancellation();
				return;
			}
			this.onResolve(null);
			this.#disposeHostPendingResult();
		}
		setHostPendingResult(v) {
			if (!__jcoEmbeddedRuntime$isPromiseLike(v)) return;
			this.#hostPendingResult = v;
			this.#resolved && this.#state !== 2 && this.#disposeHostPendingResult();
		}
		#disposeHostPendingResult() {
			let pending = this.#hostPendingResult;
			if (!pending) return;
			this.#hostPendingResult = null;
			__jcoEmbeddedRuntime$disposeHostValue(_disposeSymbol, pending);
		}
		registerOnStartHandler(f) {
			this.#onStartHandlers.push(f);
		}
		onStart(args) {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#onStart()] args", {
				componentIdx: this.#componentIdx,
				subtaskID: this.#id,
				parentTaskID: this.parentTaskID(),
				fnName: this.fnName,
				args
			});
			this.#onProgressFn?.();
			this.#parentTask.notifyProgress();
			this.#state = 1;
			let result;
			this.#callMetadata.startFn && (result = this.#callMetadata.startFn.apply(null, args?.startFnParams ?? []));
			return result;
		}
		registerOnResolveHandler(f) {
			this.#onResolveHandlers.push(f);
		}
		reject(subtaskErr) {
			if (this.#resolved) return;
			this.#onProgressFn?.();
			if (this.#state >= 2) throw Error("cannot reject a completed subtask");
			this.#state = this.#state === 0 ? 3 : 4;
			this.#resolved = !0;
			this.#hostPendingResult = null;
			this.#parentTask.removeSubtask(this);
			this.#parentTask.reject(subtaskErr);
		}
		onResolve(subtaskValue) {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#onResolve()] args", {
				componentIdx: this.#componentIdx,
				subtaskID: this.#id,
				isAsync: this.isAsync,
				childTaskID: this.childTaskID(),
				parentTaskID: this.parentTaskID(),
				parentTaskFnName: this.#parentTask?.entryFnName(),
				fnName: this.fnName
			});
			if (this.#resolved) throw Error("subtask has already been resolved");
			this.#onProgressFn?.();
			if (subtaskValue === null && this.#cancelRequested) {
				if (this.#state >= 2) throw Error("resolved subtask must have been started before cancellation");
				this.#state = this.#state === 0 ? 3 : 4;
			} else {
				if (this.#state !== 1) throw Error("resolved subtask must have been started before completion");
				this.#state = 2;
				this.#hostPendingResult = null;
			}
			this.setResult(subtaskValue);
			for (let f of this.#onResolveHandlers) try {
				f(subtaskValue);
			} catch (err) {
				console.error("error during subtask resolve handler", err);
				throw err;
			}
			let callMetadata = this.getCallMetadata();
			let memory = callMetadata.memory ?? this.#parentTask?.getReturnMemory() ?? __jcoEmbeddedRuntime$lookupMemories(_memories, { componentIdx: this.#parentTask.componentIdx() })[0]?.memory;
			if (this.#state === 2 && callMetadata && !callMetadata.returnFn && (this.isAsync || callMetadata.funcTypeIsAsync) && callMetadata.resultPtr && memory) {
				let { resultPtr, realloc } = callMetadata;
				let lowers = callMetadata.lowers;
				lowers && lowers.length > 0 && lowers[0]({
					componentIdx: this.#componentIdx,
					memory,
					realloc,
					vals: [subtaskValue],
					storagePtr: resultPtr,
					stringEncoding: callMetadata.stringEncoding
				});
			}
			this.#resolved = !0;
			this.#parentTask.removeSubtask(this);
			if (!this.isAsync) {
				this.deliverResolve();
				let rep = this.waitableRep();
				if (rep) try {
					if (this.#getComponentState().handles.remove(rep) !== this) throw Error("unexpectedly received non-self Subtask from handle removal");
					this.drop();
				} catch (err) {
					__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#onResolve()] failed to remove subtask after sync subtask completion", err);
				}
			}
		}
		getStateNumber() {
			return this.#state;
		}
		isReturned() {
			return this.#state === 2;
		}
		getCallMetadata() {
			return this.#callMetadata;
		}
		isResolved() {
			return this.#state >= 2;
		}
		addLender(handle) {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#addLender()] args", { handle });
			if (!handle || typeof handle.lends != "number") throw Error("missing/invalid lender handle [" + handle + "]");
			if (this.#lenders === null || this.isResolved()) throw Error("subtask has no lendors or has already been resolved");
			handle.lends++;
			this.#lenders.push(handle);
		}
		deliverResolve() {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#deliverResolve()] args", {
				lenders: this.#lenders,
				parentTaskID: this.parentTaskID(),
				subtaskID: this.#id,
				childTaskID: this.childTaskID(),
				resolved: this.isResolved(),
				resolveDelivered: this.resolveDelivered()
			});
			if (this.resolveDelivered() || !this.isResolved()) throw Error("subtask cannot deliver resolution twice, and the subtask must be resolved");
			for (let lender of this.#lenders) lender.lends--;
			this.#lenders = null;
		}
		resolveDelivered() {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#resolveDelivered()] args", {});
			if (this.#lenders === null && !this.isResolved()) throw Error("invalid subtask state, lenders missing and subtask has not been resolved");
			return this.#lenders === null;
		}
		drop() {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#drop()] args", {
				componentIdx: this.#componentIdx,
				parentTaskID: this.#parentTask?.id(),
				parentTaskFnName: this.#parentTask?.entryFnName(),
				childTaskID: this.#childTask?.id(),
				childTaskFnName: this.#childTask?.entryFnName(),
				subtaskFnName: this.fnName
			});
			if (!this.#waitable) throw Error("missing/invalid inner waitable");
			if (!this.resolveDelivered()) throw new RuntimeError("cannot drop a subtask which has not yet resolved");
			this.#waitable && this.#waitable.drop();
		}
		#getComponentState() {
			let state = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			if (!state) throw Error("invalid/missing async state for component [" + this.#componentIdx + "]");
			return state;
		}
		getWaitableHandleIdx() {
			__jcoEmbeddedRuntime$debugLog("[AsyncSubtask#getWaitableHandleIdx()] args", {});
			if (!this.#waitable) throw Error("missing/invalid waitable");
			return this.waitableRep();
		}
	}
	return AsyncSubtask;
}
function __jcoEmbeddedRuntime$lowerImportBackwardsCompat(_context, args, ...params) {
	__jcoEmbeddedRuntime$debugLog("[_lowerImportBackwardsCompat()] args", {
		args,
		params
	});
	let { componentIdx, isAsync, isManualAsync, resultLowerFns, hasResultPointer, funcTypeIsAsync, memoryIdx, getMemoryFn, getReallocFn, importFn, stringEncoding } = args;
	__jcoEmbeddedRuntime$checkMayLeave(_context.mayLeave, componentIdx);
	let meta = __jcoEmbeddedRuntime$getCurrentTaskMeta(_context.registers, componentIdx);
	let taskMeta = meta && __jcoEmbeddedRuntime$getCurrentTask(_context, componentIdx, meta.taskID);
	let createdTask;
	if (!taskMeta) {
		if (funcTypeIsAsync || isAsync && !isManualAsync) throw Error("p3 async wasm exports cannot use backwards compat auto-task init");
		let { task: newTask, taskID: newTaskID, threadID: newThreadID } = __jcoEmbeddedRuntime$createNewCurrentImplicitThread(_context.creation, {
			componentIdx,
			isAsync,
			isManualAsync,
			callingWasmExport: !1
		});
		createdTask = newTask;
		createdTask.registerOnResolveHandler(() => {
			__jcoEmbeddedRuntime$clearCurrentTaskMeta(_context.registers, {
				taskID: newTaskID,
				threadID: newThreadID,
				componentIdx: task.componentIdx()
			});
		});
		__jcoEmbeddedRuntime$setCurrentTaskMeta(_context.registers, {
			componentIdx,
			taskID: newTaskID,
			threadID: newThreadID
		});
		taskMeta = __jcoEmbeddedRuntime$getCurrentTask(_context, componentIdx, newTaskID);
	}
	if (!taskMeta) throw Error("invalid/missing async task meta");
	let task = taskMeta.task;
	if (!task) throw Error("invalid/missing async task");
	__jcoEmbeddedRuntime$getOrCreateAsyncState(_context.lookup, componentIdx);
	if (!task.mayBlock() && funcTypeIsAsync && !isAsync) throw Error("non async exports cannot synchronously call async functions");
	let memory = getMemoryFn();
	let resultPtr = hasResultPointer ? params[params.length - 1] >>> 0 : void 0;
	let subtask = task.createSubtask({
		componentIdx,
		parentTask: task,
		fnName: importFn.fnName,
		isAsync,
		isManualAsync,
		callMetadata: {
			memoryIdx,
			memory,
			realloc: getReallocFn?.(),
			getReallocFn,
			resultPtr,
			lowers: resultLowerFns,
			funcTypeIsAsync,
			stringEncoding
		}
	});
	task.setReturnMemoryIdx(memoryIdx);
	task.setReturnMemory(getMemoryFn());
	subtask.onStart();
	if (!isManualAsync && !isAsync && !funcTypeIsAsync) {
		createdTask && createdTask.enterSync();
		importFn(...params);
		if (!funcTypeIsAsync && !subtask.isReturned()) throw Error("post-execution subtasks must either be async or returned");
		let syncRes = subtask.getResult();
		if (createdTask) {
			createdTask.resolve([syncRes]);
			createdTask.exit();
		}
		return syncRes;
	}
	if (!isManualAsync && !isAsync && funcTypeIsAsync) {
		let { promise, resolve, reject } = __jcoEmbeddedRuntime$promiseWithResolvers();
		queueMicrotask(async () => {
			try {
				await importFn(...params);
				subtask.isResolved() || await task.suspendUntil({ readyFn: () => subtask.isResolved() });
				resolve(subtask.getResult());
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}
	let subtaskState = subtask.getStateNumber();
	if (subtaskState < 0 || subtaskState >= 16) throw Error("invalid subtask state, out of valid range");
	subtask.setOnProgressFn(() => {
		subtask.setPendingEvent(() => {
			subtask.isResolved() && subtask.deliverResolve();
			return {
				code: _context.events.SUBTASK,
				payload0: subtask.waitableRep(),
				payload1: subtask.getStateNumber()
			};
		});
	});
	if (!isAsync && !funcTypeIsAsync && isManualAsync) {
		__jcoEmbeddedRuntime$debugLog("[_lowerImportBackwardsCompat()] calling lowered import", {
			importFn,
			params
		});
		createdTask && createdTask.enterSync();
		try {
			let result = importFn(...params);
			let isPromise = __jcoEmbeddedRuntime$isPromiseLike(result);
			createdTask && createdTask.resolve([isPromise ? void 0 : result]);
			if (!isPromise) return subtask.getResult();
			return Promise.resolve(result).then(() => subtask.getResult());
		} catch (error) {
			createdTask && createdTask.reject(error);
			throw error;
		} finally {
			createdTask && createdTask.exit();
		}
	}
	queueMicrotask(async () => {
		try {
			__jcoEmbeddedRuntime$debugLog("[_lowerImportBackwardsCompat()] calling lowered import", {
				importFn,
				params
			});
			createdTask && await createdTask.enter();
			let asyncRes = await importFn(...params);
			createdTask && createdTask.resolve([asyncRes]);
		} catch (err) {
			__jcoEmbeddedRuntime$debugLog("[_lowerImportBackwardsCompat()] import fn error:", err);
			task.setErrored(err);
			task.reject(err);
		}
	});
	__jcoEmbeddedRuntime$debugLog("[_lowerImportBackwardsCompat()] async-lowered import return", {
		fnName: importFn.fnName,
		componentIdx,
		subtaskID: subtask.id(),
		waitableRep: subtask.waitableRep(),
		subtaskState,
		packedResult: Number(subtask.waitableRep()) << 4 | subtaskState
	});
	return Number(subtask.ensureHandle()) << 4 | subtaskState;
}
const __jcoEmbeddedRuntime$THREAD_NOT_STARTED = "not-started";
const __jcoEmbeddedRuntime$THREAD_RUNNING = "running";
const __jcoEmbeddedRuntime$THREAD_COMPLETED = "completed";
function __jcoEmbeddedRuntime$initializeAsyncThreadClass(context) {
	let { lookup: _lookup, registers: _registers } = context;
	class AsyncThread {
		static State = {
			NOT_STARTED: __jcoEmbeddedRuntime$THREAD_NOT_STARTED,
			RUNNING: __jcoEmbeddedRuntime$THREAD_RUNNING,
			COMPLETED: __jcoEmbeddedRuntime$THREAD_COMPLETED
		};
		#id = null;
		#componentIdx;
		#task;
		#state;
		#startFn = null;
		storage = [0, 0];
		constructor(opts) {
			if (opts?.componentIdx === void 0) throw TypeError("missing component id during thread creation");
			this.#componentIdx = opts.componentIdx;
			if (!opts?.task) throw TypeError("missing task during thread creation");
			this.#task = opts.task;
			if (opts.startFn) {
				this.#startFn = opts.startFn;
				this.#state = __jcoEmbeddedRuntime$THREAD_NOT_STARTED;
			} else this.#state = __jcoEmbeddedRuntime$THREAD_RUNNING;
		}
		id() {
			return this.#id;
		}
		setId(id) {
			if (this.#id !== null) throw Error("thread id can only be assigned once");
			this.#id = id;
		}
		componentIdx() {
			return this.#componentIdx;
		}
		task() {
			return this.#task;
		}
		taskID() {
			return this.#task.id();
		}
		state() {
			return this.#state;
		}
		isCancelled() {
			return this.#task.isCancelled();
		}
		isRejected() {
			return this.#task.isRejected();
		}
		notifyProgress() {
			return this.#task.notifyProgress();
		}
		entryFnName() {
			return this.#task.entryFnName();
		}
		getParentSubtask() {
			return this.#task.getParentSubtask();
		}
		async suspend(opts) {
			let cstate = __jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx);
			let task = this.#task;
			task.endFirstSlice();
			task.settleCompletion();
			let { cancellable, readyFn, releaseLock = !1 } = opts;
			if (task.deliverPendingCancel({ cancellable })) return !1;
			let reacquireLock = releaseLock && task.needsExclusiveLock() && cstate.exclusivelyLockedBy(task.id());
			reacquireLock && cstate.exclusiveRelease(task.id());
			try {
				let keepGoing = await cstate.suspendThread({
					...opts,
					cancellable: !!cancellable,
					thread: this,
					readyFn: () => cancellable && task.cancellationPending() || readyFn()
				});
				cstate.throwIfInterrupted();
				if (keepGoing && task.deliverPendingCancel({ cancellable })) return !1;
				return !!keepGoing;
			} finally {
				reacquireLock && !cstate.exclusivelyLockedBy(task.id()) && await cstate.acquireExclusiveLock(task.id());
			}
		}
		start() {
			if (this.#state !== __jcoEmbeddedRuntime$THREAD_NOT_STARTED) throw Error(`cannot start thread [${this.#id}] in state [${this.#state}]`);
			this.#state = __jcoEmbeddedRuntime$THREAD_RUNNING;
			let startFn = this.#startFn;
			this.#startFn = null;
			__jcoEmbeddedRuntime$withCurrentTaskMetaAsync(_registers, {
				threadID: this.#id,
				taskID: this.#task.id(),
				componentIdx: this.#componentIdx,
				fn: async () => {
					__jcoEmbeddedRuntime$getOrCreateAsyncState(_lookup, this.#componentIdx).throwIfInterrupted();
					return startFn();
				}
			}).then(() => {
				this.#state = __jcoEmbeddedRuntime$THREAD_COMPLETED;
				this.#task.removeThread(this);
			}).catch((err) => {
				err = __jcoEmbeddedRuntime$recordTrap(context.traps, this.#componentIdx, err);
				this.#state = __jcoEmbeddedRuntime$THREAD_COMPLETED;
				__jcoEmbeddedRuntime$debugLog("[AsyncThread#start()] spawned thread errored", {
					threadID: this.#id,
					taskID: this.#task.id(),
					componentIdx: this.#componentIdx,
					err
				});
				this.#task.setErrored(err);
				this.#task.reject(err);
				this.#task.removeThread(this);
			});
		}
	}
	return AsyncThread;
}
const __jcoEmbeddedRuntime$initializeStreams = (RepTable) => new RepTable({ target: "global stream map" });
const __jcoEmbeddedRuntime$initializeFutures = (RepTable) => new RepTable({ target: "global future map" });
const __jcoEmbeddedRuntime$decodeUtf8 = (RuntimeError, decoder, input) => {
	try {
		return decoder.decode(input);
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		let bytes;
		try {
			bytes = ArrayBuffer.isView(input) ? new Uint8Array(input.buffer, input.byteOffset, input.byteLength) : new Uint8Array(input);
		} catch {
			throw error;
		}
		for (let i = 0; i < bytes.length; i++) {
			let lead = bytes[i];
			if (lead < 128) continue;
			let count = lead >= 194 && lead <= 223 ? 1 : lead >= 224 && lead <= 239 ? 2 : lead >= 240 && lead <= 244 ? 3 : -1;
			if (count < 0) throw new RuntimeError("invalid utf-8");
			for (let j = 1; j <= count; j++) {
				if (i + j >= bytes.length) throw new RuntimeError("incomplete utf-8 byte sequence");
				let byte = bytes[i + j];
				if (byte < 128 || byte > 191 || j === 1 && (lead === 224 && byte < 160 || lead === 237 && byte > 159 || lead === 240 && byte < 144 || lead === 244 && byte > 143)) throw new RuntimeError("invalid utf-8");
			}
			i += count;
		}
		throw error;
	}
};
const __jcoEmbeddedRuntime$initializeLiftVariant = () => ({ scratch: new DataView(new ArrayBuffer(8)) });
function __jcoEmbeddedRuntime$liftFlatU8(ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatU8()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length === 0) throw Error("expected at least a single i32 argument");
		val = ctx.params[0];
		ctx.params = ctx.params.slice(1);
		return [val, ctx];
	}
	if (ctx.storageLen !== void 0 && ctx.storageLen < 1) throw Error(`insufficient storage ([${ctx.storageLen}] bytes) for lift (u8 requires 1 byte)`);
	val = new DataView(ctx.memory.buffer).getUint8(ctx.storagePtr);
	ctx.storagePtr += 1;
	ctx.storageLen !== void 0 && --ctx.storageLen;
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatU16(ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatU16()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length === 0) throw Error("expected at least a single i32 argument");
		val = ctx.params[0];
		ctx.params = ctx.params.slice(1);
		return [val, ctx];
	}
	if (ctx.storageLen !== void 0 && ctx.storageLen < 2) throw Error(`insufficient storage ([${ctx.storageLen}] bytes) for lift (u16 requires 2 bytes)`);
	val = new DataView(ctx.memory.buffer).getUint16(ctx.storagePtr, !0);
	ctx.storagePtr += 2;
	ctx.storageLen !== void 0 && (ctx.storageLen -= 2);
	let rem = ctx.storagePtr % 2;
	rem !== 0 && (ctx.storagePtr += 2 - rem);
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatU32(ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatU32()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length === 0) throw Error("expected at least a single i34 argument");
		val = ctx.params[0] >>> 0;
		ctx.params = ctx.params.slice(1);
		return [val, ctx];
	}
	if (ctx.storageLen !== void 0 && ctx.storageLen < 4) throw Error(`insufficient storage ([${ctx.storageLen}] bytes) for lift (u32 requires 4 bytes)`);
	val = new DataView(ctx.memory.buffer).getUint32(ctx.storagePtr, !0);
	ctx.storagePtr += 4;
	ctx.storageLen !== void 0 && (ctx.storageLen -= 4);
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatU64(ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatU64()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length === 0) throw Error("expected at least one single i64 argument");
		if (typeof ctx.params[0] != "bigint") throw Error("expected bigint");
		val = BigInt.asUintN(64, ctx.params[0]);
		ctx.params = ctx.params.slice(1);
		return [val, ctx];
	}
	if (ctx.storageLen !== void 0 && ctx.storageLen < 8) throw Error(`insufficient storage ([${ctx.storageLen}] bytes) for lift (u64 requires 8 bytes)`);
	val = new DataView(ctx.memory.buffer).getBigUint64(ctx.storagePtr, !0);
	ctx.storagePtr += 8;
	ctx.storageLen !== void 0 && (ctx.storageLen -= 8);
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatStringAny(_context, ctx) {
	switch (ctx.stringEncoding) {
		case "utf8": return __jcoEmbeddedRuntime$liftFlatStringUTF8(_context, ctx);
		case "utf16": return __jcoEmbeddedRuntime$liftFlatStringUTF16(_context, ctx);
		case "compact-utf16": {
			let [ptr, ptrCtx] = __jcoEmbeddedRuntime$liftFlatU32(ctx);
			let [len, newCtx] = __jcoEmbeddedRuntime$liftFlatU32(ptrCtx);
			return [__jcoEmbeddedRuntime$compactUtf16Decode(_context.utf16, ctx.memory, ptr, len), newCtx];
		}
		default: throw Error(`missing/unrecognized/unsupported string encoding [${ctx.stringEncoding}]`);
	}
}
function __jcoEmbeddedRuntime$requireStringInMemory(RuntimeError, memory, offset, codeUnits, unitSize) {
	if (offset % unitSize !== 0) throw new RuntimeError("wasm trap: unaligned pointer");
	let byteLength = memory.buffer.byteLength;
	if (offset > byteLength || codeUnits < 0 || codeUnits > Math.floor((byteLength - offset) / unitSize)) throw new RuntimeError("string pointer/length out of bounds of memory");
}
function __jcoEmbeddedRuntime$liftFlatStringUTF8(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatStringUTF8()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length < 2) throw Error("expected at least two u32 arguments");
		let offset = ctx.params[0];
		typeof offset == "bigint" ? offset = Number(offset) : offset >>>= 0;
		if (!Number.isSafeInteger(offset)) throw Error("invalid offset");
		let len = ctx.params[1];
		if (!Number.isSafeInteger(len)) throw Error("invalid len");
		__jcoEmbeddedRuntime$requireStringInMemory(_context.RuntimeError, ctx.memory, offset, len, 1);
		val = __jcoEmbeddedRuntime$decodeUtf8(_context.RuntimeError, _context.utf8, new DataView(ctx.memory.buffer, offset, len));
		ctx.params = ctx.params.slice(2);
		return [val, ctx];
	}
	let rem = ctx.storagePtr % 4;
	rem !== 0 && (ctx.storagePtr += 4 - rem);
	let dv = new DataView(ctx.memory.buffer);
	let start = dv.getUint32(ctx.storagePtr, !0);
	let codeUnits = dv.getUint32(ctx.storagePtr + 4, !0);
	__jcoEmbeddedRuntime$requireStringInMemory(_context.RuntimeError, ctx.memory, start, codeUnits, 1);
	val = __jcoEmbeddedRuntime$decodeUtf8(_context.RuntimeError, _context.utf8, new Uint8Array(ctx.memory.buffer, start, codeUnits));
	ctx.storagePtr += 8;
	ctx.storageLen !== void 0 && (ctx.storageLen -= 8);
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatStringUTF16(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatStringUTF16()] args", { ctx });
	let val;
	if (ctx.useDirectParams) {
		if (ctx.params.length < 2) throw Error("expected at least two u32 arguments");
		let offset = ctx.params[0];
		typeof offset == "bigint" ? offset = Number(offset) : offset >>>= 0;
		if (!Number.isSafeInteger(offset)) throw Error("invalid offset");
		let len = ctx.params[1];
		if (!Number.isSafeInteger(len)) throw Error("invalid len");
		__jcoEmbeddedRuntime$requireStringInMemory(_context.RuntimeError, ctx.memory, offset, len, 2);
		val = _context.utf16.decode(new DataView(ctx.memory.buffer, offset, len * 2));
		ctx.params = ctx.params.slice(2);
		return [val, ctx];
	}
	let rem = ctx.storagePtr % 4;
	rem !== 0 && (ctx.storagePtr += 4 - rem);
	let dv = new DataView(ctx.memory.buffer);
	let start = dv.getUint32(ctx.storagePtr, !0);
	let codeUnits = dv.getUint32(ctx.storagePtr + 4, !0);
	__jcoEmbeddedRuntime$requireStringInMemory(_context.RuntimeError, ctx.memory, start, codeUnits, 2);
	val = _context.utf16.decode(new DataView(ctx.memory.buffer, start, codeUnits * 2));
	ctx.storagePtr += 8;
	ctx.storageLen !== void 0 && (ctx.storageLen -= 8);
	return [val, ctx];
}
function __jcoEmbeddedRuntime$liftFlatRecord(meta) {
	let { fieldMetas, size32: recordSize32, align32: recordAlign32 } = meta;
	return function liftFlatRecordInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatRecord()] args", { ctx });
		let originalPtr = ctx.storagePtr;
		let res = {};
		for (let [key, liftFn, size32, align32] of fieldMetas) {
			let fieldPtr;
			if (ctx.storagePtr !== void 0) {
				let rem = ctx.storagePtr % align32;
				rem !== 0 && (ctx.storagePtr += align32 - rem);
				fieldPtr = ctx.storagePtr;
			}
			let fieldLen;
			ctx.storageLen !== void 0 && (fieldLen = ctx.storageLen);
			let [val, newCtx] = liftFn(ctx);
			res[key] = val;
			ctx = newCtx;
			fieldPtr !== void 0 && (ctx.storagePtr = Math.max(ctx.storagePtr, fieldPtr + size32));
			fieldLen !== void 0 && (ctx.storageLen = fieldLen - size32);
		}
		originalPtr !== void 0 && (ctx.storagePtr = Math.max(ctx.storagePtr, originalPtr + recordSize32));
		if (ctx.storagePtr !== void 0) {
			let rem = ctx.storagePtr % recordAlign32;
			rem !== 0 && (ctx.storagePtr += recordAlign32 - rem);
		}
		return [res, ctx];
	};
}
function __jcoEmbeddedRuntime$liftFlatVariant(_context, meta) {
	let { caseMetas, variantSize32, variantAlign32, variantPayloadOffset32, variantFlatCount, variantPayloadFlatTypes, isEnum } = meta;
	return function liftFlatVariantInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatVariant()] args", { ctx });
		let origUseParams = ctx.useDirectParams;
		let caseIdx;
		let liftRes;
		let originalPtr = ctx.storagePtr;
		let numCases = caseMetas.length;
		if (caseMetas.length < 256) liftRes = __jcoEmbeddedRuntime$liftFlatU8(ctx);
		else if (numCases >= 256 && numCases < 65536) liftRes = __jcoEmbeddedRuntime$liftFlatU16(ctx);
		else if (numCases >= 65536 && numCases < 4294967296) liftRes = __jcoEmbeddedRuntime$liftFlatU32(ctx);
		else throw Error(`unsupported number of variant cases [${numCases}]`);
		caseIdx = liftRes[0];
		ctx = liftRes[1];
		let [tag, liftFn, , , caseFlatCount, caseFlatTypes] = caseMetas[caseIdx];
		if (variantPayloadOffset32 === void 0) throw Error("unexpectedly missing payload offset");
		originalPtr !== void 0 && (ctx.storagePtr = originalPtr + variantPayloadOffset32);
		let val;
		if (liftFn === null) {
			val = { tag };
			originalPtr !== void 0 && (ctx.storagePtr = originalPtr + variantSize32);
		} else {
			if (ctx.useDirectParams) {
				if (!variantPayloadFlatTypes || !caseFlatTypes) throw Error("missing variant flat type metadata during direct-param lift");
				let scratch = _context.scratch;
				for (let i = 0; i < caseFlatTypes.length; i++) {
					let have = variantPayloadFlatTypes[i];
					let want = caseFlatTypes[i];
					if (have === want) continue;
					let val = ctx.params[i];
					if (have === "i64" && want === "i32") ctx.params[i] = Number(BigInt.asIntN(32, val));
					else if (have === "i64" && want === "f32") {
						scratch.setInt32(0, Number(BigInt.asIntN(32, val)), !0);
						ctx.params[i] = scratch.getFloat32(0, !0);
					} else if (have === "i64" && want === "f64") {
						scratch.setBigInt64(0, val, !0);
						ctx.params[i] = scratch.getFloat64(0, !0);
					} else if (have === "i32" && want === "f32") {
						scratch.setInt32(0, val, !0);
						ctx.params[i] = scratch.getFloat32(0, !0);
					} else throw Error(`invalid variant payload coercion [${have}] -> [${want}]`);
				}
			}
			let [newVal, newCtx] = liftFn(ctx);
			val = {
				tag,
				val: newVal
			};
			ctx = newCtx;
		}
		if (origUseParams) {
			if (variantFlatCount == null) {
				__jcoEmbeddedRuntime$debugLog("[_liftFlatVariant()] variant with unknown flat count", {
					ctx,
					meta
				});
				throw Error("cannot lift variant with unknown flat count");
			}
			if (caseFlatCount == null) {
				__jcoEmbeddedRuntime$debugLog("[_liftFlatVariant()] case with unknown flat count", {
					ctx,
					meta,
					case: meta.caseMetas[caseIdx]
				});
				throw Error("cannot lift case with unknown flat count");
			}
			let remainingPayloadParams = variantFlatCount - caseFlatCount - +!isEnum;
			if (remainingPayloadParams < 0) throw Error("invalid variant flat count metadata");
			if (ctx.params.length < remainingPayloadParams) throw Error(`expected at least [${remainingPayloadParams}] remaining variant payload params, but got [${ctx.params.length}]`);
			ctx.params = ctx.params.slice(remainingPayloadParams);
		}
		if (ctx.storagePtr !== void 0) {
			let rem = ctx.storagePtr % variantAlign32;
			rem !== 0 && (ctx.storagePtr += variantAlign32 - rem);
		}
		return [val, ctx];
	};
}
function __jcoEmbeddedRuntime$liftFlatList(_context, meta) {
	let { elemLiftFn, elemSize32, elemAlign32, knownLen, typedArray } = meta;
	let listValue = typedArray === void 0 ? (values) => values : (values) => new typedArray(values);
	let readValuesAndReset = (ctx, originalPtr, originalLen, dataPtr, len) => {
		if (dataPtr < 0 || len < 0 || elemSize32 !== 0 && len > Math.floor(((1 << 28) - 1) / elemSize32) || dataPtr > ctx.memory.buffer.byteLength || elemSize32 !== 0 && len > Math.floor((ctx.memory.buffer.byteLength - dataPtr) / elemSize32)) throw new _context.RuntimeError("wasm trap: out of bounds memory access");
		if (dataPtr % elemAlign32 !== 0) throw TypeError(`list pointer [${dataPtr}] is not aligned to ${elemAlign32}`);
		ctx.storagePtr = dataPtr;
		let val;
		if (typedArray !== void 0 && (_context.littleEndian || elemSize32 === 1)) {
			ctx.storagePtr = dataPtr + len * elemSize32;
			val = new typedArray(ctx.memory.buffer.slice(dataPtr, ctx.storagePtr));
		} else {
			let values = [];
			for (let i = 0; i < len; i++) {
				let elemPtr = dataPtr + i * elemSize32;
				ctx.storagePtr = elemPtr;
				let [res, nextCtx] = elemLiftFn(ctx);
				values.push(res);
				ctx = nextCtx;
				ctx.storagePtr = Math.max(ctx.storagePtr, elemPtr + elemSize32);
			}
			val = listValue(values);
		}
		originalPtr !== null && (ctx.storagePtr = originalPtr);
		originalLen !== null && (ctx.storageLen = originalLen);
		return [val, ctx];
	};
	return function liftFlatListInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatList()] args", { ctx });
		let liftResults;
		if (knownLen !== void 0) {
			if (ctx.useDirectParams) {
				__jcoEmbeddedRuntime$debugLog("memory unexpectedly missing while lifting unknown length list", { ctx });
				liftResults = [listValue(ctx.params.slice(0, knownLen)), ctx];
				ctx.params = ctx.params.slice(knownLen);
			} else {
				if (ctx.memory === null) {
					__jcoEmbeddedRuntime$debugLog("memory unexpectedly missing while lifting known length list", {
						knownLen,
						ctx
					});
					throw Error(`memory missing while lifting known length (${knownLen}) list`);
				}
				let originalLen = ctx.storageLen;
				ctx.storageLen = knownLen * elemSize32;
				liftResults = readValuesAndReset(ctx, null, originalLen, ctx.storagePtr, knownLen);
			}
		} else if (ctx.useDirectParams) {
			let dataPtr = ctx.params[0] >>> 0;
			let len = ctx.params[1];
			ctx.params = ctx.params.slice(2);
			ctx.useDirectParams = !1;
			let originalPtr = ctx.storagePtr;
			let originalLen = ctx.storageLen;
			ctx.storageLen = len * elemSize32;
			liftResults = readValuesAndReset(ctx, originalPtr, originalLen, dataPtr, len);
			ctx.useDirectParams = !0;
		} else {
			let originalLen = ctx.storageLen;
			ctx.storageLen = 8;
			let dataPtrLiftRes = __jcoEmbeddedRuntime$liftFlatU32(ctx);
			let dataPtr = dataPtrLiftRes[0];
			ctx = dataPtrLiftRes[1];
			let lenLiftRes = __jcoEmbeddedRuntime$liftFlatU32(ctx);
			let len = lenLiftRes[0];
			ctx = lenLiftRes[1];
			let originalPtr = ctx.storagePtr;
			ctx.storagePtr = dataPtr;
			ctx.storageLen = len * elemSize32;
			liftResults = readValuesAndReset(ctx, originalPtr, originalLen, dataPtr, len);
		}
		return liftResults;
	};
}
function __jcoEmbeddedRuntime$liftFlatTuple(meta) {
	let { elemLiftFns, size32: tupleSize32, align32: tupleAlign32 } = meta;
	return function liftFlatTupleInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatTuple()] args", { ctx });
		let originalPtr = ctx.storagePtr;
		let val = [];
		for (let [liftFn, size32, align32] of elemLiftFns) {
			let elemPtr;
			if (ctx.storagePtr !== void 0) {
				let rem = ctx.storagePtr % align32;
				rem !== 0 && (ctx.storagePtr += align32 - rem);
				elemPtr = ctx.storagePtr;
			}
			let elemLen;
			ctx.storageLen !== void 0 && (elemLen = ctx.storageLen);
			let [newValue, newCtx] = liftFn(ctx);
			val.push(newValue);
			ctx = newCtx;
			elemPtr !== void 0 && (ctx.storagePtr = Math.max(ctx.storagePtr, elemPtr + size32));
			elemLen !== void 0 && (ctx.storageLen = elemLen - size32);
		}
		originalPtr !== void 0 && (ctx.storagePtr = Math.max(ctx.storagePtr, originalPtr + tupleSize32));
		if (ctx.storagePtr !== void 0) {
			let rem = ctx.storagePtr % tupleAlign32;
			rem !== 0 && (ctx.storagePtr += tupleAlign32 - rem);
		}
		return [val, ctx];
	};
}
function __jcoEmbeddedRuntime$liftFlatOption(_context, meta) {
	let { payloadMaybeNull } = meta;
	let f = __jcoEmbeddedRuntime$liftFlatVariant(_context, meta);
	return function liftFlatOptionInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatOption()] args", { ctx });
		let res = f(ctx);
		if (!payloadMaybeNull) {
			let value = res[0];
			res[0] = value.tag === "none" ? void 0 : value.val;
		}
		return res;
	};
}
function __jcoEmbeddedRuntime$liftFlatResult(_context, meta) {
	let f = __jcoEmbeddedRuntime$liftFlatVariant(_context, meta);
	return function liftFlatResultInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatResult()] args", { ctx });
		let res = f(ctx);
		let value = res[0];
		"val" in value || (value.val = void 0);
		return res;
	};
}
function __jcoEmbeddedRuntime$liftFlatOwn(meta) {
	let { classNameFn, createResourceFn, componentIdx, tableIdx } = meta;
	return function liftFlatOwnInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_liftFlatOwn()] args", {
			ctx,
			className: classNameFn()
		});
		if (ctx.componentIdx !== componentIdx) throw Error("invalid component for resource lift");
		let [handle, newCtx] = __jcoEmbeddedRuntime$liftFlatU32(ctx);
		return [ctx.liftResource ? ctx.liftResource(handle, tableIdx) : createResourceFn(handle), newCtx];
	};
}
function __jcoEmbeddedRuntime$liftFlatBorrow(componentTableIdx, size, memory, vals, storagePtr, storageLen) {
	__jcoEmbeddedRuntime$debugLog("[_liftFlatBorrow()] args", {
		size,
		memory,
		vals,
		storagePtr,
		storageLen
	});
	throw Error("flat lift for borrowed resources is not supported!");
}
function __jcoEmbeddedRuntime$lowerFlatBool(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatBool()] args", { ctx });
	if (!ctx.memory) throw Error("missing memory for lower");
	if (ctx.vals.length !== 1) throw Error(`unexpected number [${ctx.vals.length}] of vals (expected 1)`);
	if (_context.strict && typeof ctx.vals[0] != "boolean") throw TypeError(`invalid bool value [${ctx.vals[0]}]`);
	new DataView(ctx.memory.buffer).setUint8(ctx.storagePtr, +!!ctx.vals[0]);
	ctx.storagePtr += 1;
}
function __jcoEmbeddedRuntime$lowerFlatU8(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatU8()] args", ctx);
	if (ctx.vals.length !== 1) throw Error(`unexpected number [${ctx.vals.length}] of vals (expected 1)`);
	_context.strict && !__jcoEmbeddedRuntime$isUint8(ctx.vals[0]) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u8", ctx.vals[0]);
	if (!ctx.memory) throw Error("missing memory for lower");
	new DataView(ctx.memory.buffer).setUint8(ctx.storagePtr, ctx.vals[0]);
	ctx.storagePtr += 1;
}
function __jcoEmbeddedRuntime$lowerFlatU16(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatU16()] args", { ctx });
	if (!ctx.memory) throw Error("missing memory for lower");
	if (ctx.vals.length !== 1) throw Error(`unexpected number [${ctx.vals.length}] of vals (expected 1)`);
	let rem = ctx.storagePtr % 2;
	rem !== 0 && (ctx.storagePtr += 2 - rem);
	_context.strict && !__jcoEmbeddedRuntime$isUint16(ctx.vals[0]) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u16", ctx.vals[0]);
	new DataView(ctx.memory.buffer).setUint16(ctx.storagePtr, ctx.vals[0], !0);
	ctx.storagePtr += 2;
}
function __jcoEmbeddedRuntime$lowerFlatU32(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatU32()] args", { ctx });
	if (ctx.vals.length !== 1) throw Error(`expected single value to lower, got [${ctx.vals.length}]`);
	let rem = ctx.storagePtr % 4;
	rem !== 0 && (ctx.storagePtr += 4 - rem);
	_context.strict && !__jcoEmbeddedRuntime$isUint32(ctx.vals[0]) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u32", ctx.vals[0]);
	new DataView(ctx.memory.buffer).setUint32(ctx.storagePtr, ctx.vals[0], !0);
	ctx.storagePtr += 4;
}
function __jcoEmbeddedRuntime$lowerFlatU64(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatU64()] args", { ctx });
	if (ctx.vals.length !== 1) throw Error("unexpected number of vals");
	let rem = ctx.storagePtr % 8;
	rem !== 0 && (ctx.storagePtr += 8 - rem);
	_context.strict && !__jcoEmbeddedRuntime$isUint64(ctx.vals[0]) && __jcoEmbeddedRuntime$invalidNumericPrimitive("u64", ctx.vals[0]);
	new DataView(ctx.memory.buffer).setBigUint64(ctx.storagePtr, ctx.vals[0], !0);
	ctx.storagePtr += 8;
}
function __jcoEmbeddedRuntime$lowerFlatStringAny(_context, ctx) {
	switch (ctx.stringEncoding) {
		case "utf8": return __jcoEmbeddedRuntime$lowerFlatStringUTF8(_context.utf8, ctx);
		case "utf16": return __jcoEmbeddedRuntime$lowerFlatStringUTF16(_context.utf16, ctx);
		case "compact-utf16": {
			if (!ctx.realloc) throw Error("missing realloc during flat string lower");
			let { ptr, len } = __jcoEmbeddedRuntime$compactUtf16Encode(_context.utf16, ctx.vals[0], ctx.realloc, ctx.memory);
			let view = new DataView(ctx.memory.buffer);
			view.setUint32(ctx.storagePtr, ptr, !0);
			view.setUint32(ctx.storagePtr + 4, len, !0);
			ctx.storagePtr += 8;
			return;
		}
		default: throw Error(`missing/unrecognized/unsupported string encoding [${ctx.stringEncoding}]`);
	}
}
function __jcoEmbeddedRuntime$lowerFlatStringUTF16(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatStringUTF16()] args", { ctx });
	if (!ctx.realloc) throw Error("missing realloc during flat string lower");
	let { ptr, len } = __jcoEmbeddedRuntime$utf16Encode(_context, ctx.vals[0], ctx.realloc, ctx.memory);
	let view = new DataView(ctx.memory.buffer);
	view.setUint32(ctx.storagePtr, ptr, !0);
	view.setUint32(ctx.storagePtr + 4, len, !0);
	ctx.storagePtr += 8;
}
function __jcoEmbeddedRuntime$lowerFlatStringUTF8(_context, ctx) {
	__jcoEmbeddedRuntime$debugLog("[_lowerFlatStringUTF8()] args", ctx);
	if (!ctx.realloc) throw Error("missing realloc during flat string lower");
	let { ptr, len } = __jcoEmbeddedRuntime$utf8Encode(_context, ctx.vals[0], ctx.realloc, ctx.memory);
	let view = new DataView(ctx.memory.buffer);
	view.setUint32(ctx.storagePtr, ptr, !0);
	view.setUint32(ctx.storagePtr + 4, len, !0);
	ctx.storagePtr += 8;
}
function __jcoEmbeddedRuntime$lowerFlatRecord(meta) {
	let { fieldMetas, size32: recordSize32, align32: recordAlign32 } = meta;
	return function lowerFlatRecordInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatRecord()] args", { ctx });
		let originalPtr = ctx.storagePtr;
		let r = ctx.vals[0];
		for (let [tag, lowerFn, size32, align32] of fieldMetas) {
			let rem = ctx.storagePtr % align32;
			rem !== 0 && (ctx.storagePtr += align32 - rem);
			let fieldPtr = ctx.storagePtr;
			ctx.vals = [r[tag]];
			lowerFn(ctx);
			ctx.storagePtr = Math.max(ctx.storagePtr, fieldPtr + size32);
		}
		ctx.storagePtr = Math.max(ctx.storagePtr, originalPtr + recordSize32);
		let rem = ctx.storagePtr % recordAlign32;
		rem !== 0 && (ctx.storagePtr += recordAlign32 - rem);
	};
}
function __jcoEmbeddedRuntime$lowerFlatVariant(_context, meta) {
	let { variantSize32, variantAlign32, variantPayloadOffset32, caseMetas } = meta;
	let caseLookup = Object.create(null);
	for (let [idx, meta] of caseMetas.entries()) {
		let tag = meta[0];
		caseLookup[tag] = {
			discriminant: idx,
			meta
		};
	}
	return function lowerFlatVariantInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatVariant()] args", { ctx });
		let { tag, val } = ctx.vals[0];
		let variantCase = caseLookup[tag];
		if (!variantCase) throw Error(`missing tag [${tag}] (valid tags: ${Object.keys(caseLookup)})`);
		let [, lowerFn] = variantCase.meta;
		let originalPtr = ctx.storagePtr;
		ctx.vals = [variantCase.discriminant];
		if (caseMetas.length < 256) __jcoEmbeddedRuntime$lowerFlatU8(_context, ctx);
		else if (caseMetas.length >= 256 && caseMetas.length < 65536) __jcoEmbeddedRuntime$lowerFlatU16(_context, ctx);
		else if (caseMetas.length >= 65536 && caseMetas.length < 4294967296) __jcoEmbeddedRuntime$lowerFlatU32(_context, ctx);
		else throw Error(`unsupported number of cases [${caseMetas.length}]`);
		ctx.storagePtr = originalPtr + variantPayloadOffset32;
		ctx.vals = [val];
		lowerFn && lowerFn(ctx);
		ctx.storagePtr = Math.max(ctx.storagePtr, originalPtr + variantSize32);
		let rem = ctx.storagePtr % variantAlign32;
		rem !== 0 && (ctx.storagePtr += variantAlign32 - rem);
	};
}
function __jcoEmbeddedRuntime$lowerFlatList(_context, meta) {
	let { elemLowerFn, knownLen, size32, elemSize32, elemAlign32, typedArray } = meta;
	if (!elemLowerFn) throw TypeError("missing/invalid element lower fn for list");
	return function lowerFlatListInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatList()] args", { ctx });
		if (ctx.useDirectParams) {
			if (ctx.params.length < 2) throw Error("insufficient params left to lower list");
			let storagePtr = ctx.params[0] >>> 0;
			let elemCount = ctx.params[1];
			ctx.params = ctx.params.slice(2);
			let list = ctx.vals[0];
			if (!list) throw Error("missing direct param value");
			if (elemCount !== list.length) throw Error("list length does not match allocated storage");
			let lowerCtx = {
				storagePtr,
				memory: ctx.memory,
				stringEncoding: ctx.stringEncoding,
				componentIdx: ctx.componentIdx,
				realloc: ctx.realloc,
				lowerResource: ctx.lowerResource,
				vals: []
			};
			for (let idx = 0; idx < list.length; idx++) {
				let elemPtr = storagePtr + idx * elemSize32;
				lowerCtx.storagePtr = elemPtr;
				lowerCtx.vals = list.slice(idx, idx + 1);
				elemLowerFn(lowerCtx);
				lowerCtx.storagePtr = Math.max(lowerCtx.storagePtr, elemPtr + elemSize32);
			}
			ctx.storagePtr = lowerCtx.storagePtr;
			return;
		}
		let elems = ctx.vals[0];
		let totalSizeBytes = knownLen === void 0 ? 8 : size32 ?? elems.length * elemSize32;
		if (ctx.storageLen !== void 0 && totalSizeBytes > ctx.storageLen) throw Error("not enough storage remaining for list flat lower");
		if (knownLen === void 0) {
			if (!ctx.realloc) throw Error("missing realloc during flat string lower");
			let dataPtr = ctx.realloc(0, 0, elemAlign32, elemSize32 * elems.length);
			ctx.vals[0] = dataPtr;
			__jcoEmbeddedRuntime$lowerFlatU32(_context.numeric, ctx);
			ctx.vals[0] = elems.length;
			__jcoEmbeddedRuntime$lowerFlatU32(_context.numeric, ctx);
			let origPtr = ctx.storagePtr;
			ctx.storagePtr = dataPtr;
			if (typedArray !== void 0 && elems instanceof typedArray && (_context.littleEndian || elemSize32 === 1)) new Uint8Array(ctx.memory.buffer, dataPtr, elems.byteLength).set(new Uint8Array(elems.buffer, elems.byteOffset, elems.byteLength));
			else for (let [idx, elem] of elems.entries()) {
				let elemPtr = dataPtr + idx * elemSize32;
				ctx.storagePtr = elemPtr;
				ctx.vals = [elem];
				elemLowerFn(ctx);
				ctx.storagePtr = Math.max(ctx.storagePtr, elemPtr + elemSize32);
			}
			ctx.storagePtr = origPtr;
		} else {
			if (elems.length !== knownLen) throw TypeError(`invalid list input of length [${elems.length}], must be length [${knownLen}]`);
			let originalPtr = ctx.storagePtr;
			for (let [idx, elem] of elems.entries()) {
				let elemPtr = originalPtr + idx * elemSize32;
				ctx.storagePtr = elemPtr;
				ctx.vals = [elem];
				elemLowerFn(ctx);
				ctx.storagePtr = Math.max(ctx.storagePtr, elemPtr + elemSize32);
			}
		}
	};
}
function __jcoEmbeddedRuntime$lowerFlatTuple(meta) {
	let { elemLowerMetas, size32: tupleSize32, align32: tupleAlign32 } = meta;
	return function lowerFlatTupleInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatTuple()] args", { ctx });
		let originalPtr = ctx.storagePtr;
		let tuple = ctx.vals[0];
		for (let [idx, [lowerFn, size32, align32]] of elemLowerMetas.entries()) {
			let rem = ctx.storagePtr % align32;
			rem !== 0 && (ctx.storagePtr += align32 - rem);
			let elemPtr = ctx.storagePtr;
			ctx.vals = [tuple[idx]];
			lowerFn(ctx);
			ctx.storagePtr = Math.max(ctx.storagePtr, elemPtr + size32);
		}
		ctx.storagePtr = Math.max(ctx.storagePtr, originalPtr + tupleSize32);
		let rem = ctx.storagePtr % tupleAlign32;
		rem !== 0 && (ctx.storagePtr += tupleAlign32 - rem);
	};
}
function __jcoEmbeddedRuntime$lowerFlatOption(_context, meta) {
	let { payloadMaybeNull } = meta;
	let f = __jcoEmbeddedRuntime$lowerFlatVariant(_context, meta);
	return function lowerFlatOptionInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatOption()] args", { ctx });
		let v = ctx.vals[0];
		v == null ? ctx.vals[0] = { tag: "none" } : payloadMaybeNull ? (typeof v != "object" || Object.keys(v).length !== 2 || !("tag" in v) || v.tag !== "some" && v.tag !== "none" || !("val" in v)) && (ctx.vals[0] = {
			tag: "some",
			val: v
		}) : ctx.vals[0] = {
			tag: "some",
			val: v
		};
		f(ctx);
	};
}
function __jcoEmbeddedRuntime$lowerFlatResult(_context, meta) {
	let f = __jcoEmbeddedRuntime$lowerFlatVariant(_context, meta);
	return function lowerFlatResultInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatResult()] args", { ctx });
		let v = ctx.vals[0];
		typeof v == "object" && v && Object.keys(v).length === 2 && "tag" in v && (v.tag === "ok" || v.tag === "err") && "val" in v || (ctx.vals[0] = {
			tag: "ok",
			val: v
		});
		f(ctx);
	};
}
function __jcoEmbeddedRuntime$lowerFlatOwn(_context, meta) {
	let { lowerFn, componentIdx, tableIdx } = meta;
	return function lowerFlatOwnInner(ctx) {
		__jcoEmbeddedRuntime$debugLog("[_lowerFlatOwn()] args", { ctx });
		if (ctx.componentIdx !== componentIdx) throw Error(`component index mismatch (expected [${componentIdx}], lift called from [${ctx.componentIdx}])`);
		let obj = ctx.vals[0];
		if (obj == null) throw Error("missing resource");
		let handle = ctx.lowerResource ? ctx.lowerResource(obj, tableIdx) : lowerFn(obj);
		ctx.vals[0] = handle;
		__jcoEmbeddedRuntime$lowerFlatU32(_context, ctx);
	};
}
function __jcoEmbeddedRuntime$initializeFutureValueClass(disposeSymbol) {
	var _a;
	class FutureValue {
		#start;
		#dropFn;
		#dropped = !1;
		#delivered = !1;
		#settled;
		#hideThen = 0;
		#thenFn;
		constructor(start, dropFn) {
			if (typeof start != "function") throw TypeError("future start operation must be a function");
			this.#start = start;
			this.#dropFn = dropFn;
			this.#thenFn = this.#then.bind(this);
		}
		get then() {
			return this.#hideThen === 0 ? this.#thenFn : void 0;
		}
		#read() {
			this.#settled ||= Promise.resolve().then(this.#start);
			return this.#settled;
		}
		resolveAsValue(resolve) {
			this.#hideThen++;
			try {
				resolve(this);
			} finally {
				this.#hideThen--;
			}
		}
		#deliver(resolve, value) {
			if (value instanceof _a) {
				value.resolveAsValue(resolve);
				return;
			}
			resolve(value);
		}
		#then(resolve, reject) {
			let droppedError = () => Error("future was dropped");
			return (this.#dropped ? Promise.reject(droppedError()) : this.#read()).then((box) => {
				if (this.#dropped) {
					if (typeof reject == "function") return reject(droppedError());
					throw droppedError();
				}
				this.#delivered = !0;
				return this.#deliver(resolve, box.value);
			}, reject);
		}
		[disposeSymbol]() {
			if (this.#dropped) return;
			this.#dropped = !0;
			this.#dropFn?.();
			this.#settled?.then((box) => {
				this.#delivered || __jcoEmbeddedRuntime$disposeHostValue(disposeSymbol, box.value);
			}, () => {});
		}
	}
	_a = FutureValue;
	return FutureValue;
}
const createNewCurrentImplicitThread = __jcoEmbeddedRuntime$createNewCurrentImplicitThread;
const getCurrentTask = __jcoEmbeddedRuntime$getCurrentTask;
const getCurrentThread = __jcoEmbeddedRuntime$getCurrentThread;
const _jcoInitializeAsyncSubtaskClass = __jcoEmbeddedRuntime$initializeAsyncSubtaskClass;
const _jcoInitializeAsyncTaskClass = __jcoEmbeddedRuntime$initializeAsyncTaskClass;
const _jcoInitializeAsyncThreadClass = __jcoEmbeddedRuntime$initializeAsyncThreadClass;
const _jcoInitializeCurrentComponentIdxs = __jcoEmbeddedRuntime$initializeCurrentComponentIdxs;
const _jcoInitializeCurrentTaskIds = __jcoEmbeddedRuntime$initializeCurrentTaskIds;
const _jcoInitializeCurrentTaskMayBlock = __jcoEmbeddedRuntime$initializeCurrentTaskMayBlock;
const _jcoInitializeTasksByComponent = __jcoEmbeddedRuntime$initializeTasksByComponent;
const _lowerImportBackwardsCompat = __jcoEmbeddedRuntime$lowerImportBackwardsCompat;
const _checkIdle = __jcoEmbeddedRuntime$checkIdle;
const getOrCreateAsyncState = __jcoEmbeddedRuntime$getOrCreateAsyncState;
const _guardMayLeave = __jcoEmbeddedRuntime$guardMayLeave;
const _guardTrap = __jcoEmbeddedRuntime$guardTrap;
const _jcoInitializeComponentAsyncStateClass = __jcoEmbeddedRuntime$initializeComponentAsyncStateClass;
const _jcoInitializeComponentAsyncStates = __jcoEmbeddedRuntime$initializeComponentAsyncStates;
const _jcoInitializeCoreTrapMessages = __jcoEmbeddedRuntime$initializeCoreTrapMessages;
const _jcoInitializeInstanceFlags = __jcoEmbeddedRuntime$initializeInstanceFlags;
const _jcoInitializeStoreAsyncState = __jcoEmbeddedRuntime$initializeStoreAsyncState;
const _jcoInitializeStoreTrap = __jcoEmbeddedRuntime$initializeStoreTrap;
const _reportTrap = __jcoEmbeddedRuntime$reportTrap;
const _stopInstance = __jcoEmbeddedRuntime$stopInstance;
const _trackHostOperation = __jcoEmbeddedRuntime$trackHostOperation;
const _whenIdle = __jcoEmbeddedRuntime$whenIdle;
const _requireValidNumericPrimitive = __jcoEmbeddedRuntime$requireValidNumericPrimitive;
const toUint16 = __jcoEmbeddedRuntime$toUint16;
const toUint32 = __jcoEmbeddedRuntime$toUint32;
const toUint64 = __jcoEmbeddedRuntime$toUint64;
const toUint8 = __jcoEmbeddedRuntime$toUint8;
const base64Compile = __jcoEmbeddedRuntime$base64Compile;
const clampGuest = __jcoEmbeddedRuntime$clampGuest;
const _clearCurrentTask = __jcoEmbeddedRuntime$clearCurrentTaskMeta;
const _debugLog = __jcoEmbeddedRuntime$debugLog;
const fetchCompile = __jcoEmbeddedRuntime$fetchCompile;
const _getGlobalCurrentThreadMeta = __jcoEmbeddedRuntime$getCurrentTaskMeta;
const getErrorPayload = __jcoEmbeddedRuntime$getErrorPayload;
const _jcoInitializeAsyncDeterminism = __jcoEmbeddedRuntime$initializeAsyncDeterminism;
const _jcoInitializeAsyncEventCodes = __jcoEmbeddedRuntime$initializeAsyncEventCodes;
const _jcoInitializeComponentMemoryMap = __jcoEmbeddedRuntime$initializeComponentMemoryMap;
const _jcoInitializeEndianness = __jcoEmbeddedRuntime$initializeEndianness;
const _jcoInitializeFileCompileCache = __jcoEmbeddedRuntime$initializeFileCompileCache;
const _jcoInitializeHasOwnProperty = __jcoEmbeddedRuntime$initializeHasOwnProperty;
const _jcoInitializeRepTableClass = __jcoEmbeddedRuntime$initializeRepTableClass;
const _jcoInitializeRuntimeErrorConstructor = __jcoEmbeddedRuntime$initializeRuntimeErrorConstructor;
const _jcoInitializeSymbolCabiDispose = __jcoEmbeddedRuntime$initializeSymbolCabiDispose;
const _jcoInitializeSymbolDispose = __jcoEmbeddedRuntime$initializeSymbolDispose;
const _jcoInitializeSymbolResourceHandle = __jcoEmbeddedRuntime$initializeSymbolResourceHandle;
const _jcoInitializeSymbolResourceRep = __jcoEmbeddedRuntime$initializeSymbolResourceRep;
const _jcoInitializeTaskRegisters = __jcoEmbeddedRuntime$initializeTaskRegisters;
const instantiateCore = __jcoEmbeddedRuntime$instantiateCore;
const _setGlobalCurrentThreadMeta = __jcoEmbeddedRuntime$setCurrentTaskMeta;
const _withGlobalCurrentThreadMeta = __jcoEmbeddedRuntime$withCurrentTaskMeta;
const _jcoInitializeFutureValueClass = __jcoEmbeddedRuntime$initializeFutureValueClass;
const _jcoInitializeFutures = __jcoEmbeddedRuntime$initializeFutures;
const dataView = __jcoEmbeddedRuntime$dataView;
const _jcoInitializeDataViewCache = __jcoEmbeddedRuntime$initializeDataViewCache;
const _decodeUtf8 = __jcoEmbeddedRuntime$decodeUtf8;
const _jcoInitializeLiftVariant = __jcoEmbeddedRuntime$initializeLiftVariant;
const _liftFlatBorrow = __jcoEmbeddedRuntime$liftFlatBorrow;
const _liftFlatList = __jcoEmbeddedRuntime$liftFlatList;
const _liftFlatOption = __jcoEmbeddedRuntime$liftFlatOption;
const _liftFlatOwn = __jcoEmbeddedRuntime$liftFlatOwn;
const _liftFlatRecord = __jcoEmbeddedRuntime$liftFlatRecord;
const _liftFlatResult = __jcoEmbeddedRuntime$liftFlatResult;
const _liftFlatStringAny = __jcoEmbeddedRuntime$liftFlatStringAny;
const _liftFlatTuple = __jcoEmbeddedRuntime$liftFlatTuple;
const _liftFlatU16 = __jcoEmbeddedRuntime$liftFlatU16;
const _liftFlatU32 = __jcoEmbeddedRuntime$liftFlatU32;
const _liftFlatU64 = __jcoEmbeddedRuntime$liftFlatU64;
const _liftFlatU8 = __jcoEmbeddedRuntime$liftFlatU8;
const _liftFlatVariant = __jcoEmbeddedRuntime$liftFlatVariant;
const _lowerFlatBool = __jcoEmbeddedRuntime$lowerFlatBool;
const _lowerFlatList = __jcoEmbeddedRuntime$lowerFlatList;
const _lowerFlatOption = __jcoEmbeddedRuntime$lowerFlatOption;
const _lowerFlatOwn = __jcoEmbeddedRuntime$lowerFlatOwn;
const _lowerFlatRecord = __jcoEmbeddedRuntime$lowerFlatRecord;
const _lowerFlatResult = __jcoEmbeddedRuntime$lowerFlatResult;
const _lowerFlatStringAny = __jcoEmbeddedRuntime$lowerFlatStringAny;
const _lowerFlatTuple = __jcoEmbeddedRuntime$lowerFlatTuple;
const _lowerFlatU16 = __jcoEmbeddedRuntime$lowerFlatU16;
const _lowerFlatU32 = __jcoEmbeddedRuntime$lowerFlatU32;
const _lowerFlatU64 = __jcoEmbeddedRuntime$lowerFlatU64;
const _lowerFlatU8 = __jcoEmbeddedRuntime$lowerFlatU8;
const _lowerFlatVariant = __jcoEmbeddedRuntime$lowerFlatVariant;
const _jcoInitializeCurrentBorrows = __jcoEmbeddedRuntime$initializeCurrentBorrows;
const _jcoInitializeHandleIndexSpaces = __jcoEmbeddedRuntime$initializeHandleIndexSpaces;
const _jcoInitializeHandleTables = __jcoEmbeddedRuntime$initializeHandleTables;
const _jcoInitializeResourceScopeCounter = __jcoEmbeddedRuntime$initializeResourceScopeCounter;
const _jcoInitializeResourceScopeTasks = __jcoEmbeddedRuntime$initializeResourceScopeTasks;
const rscTableCreateOwn = __jcoEmbeddedRuntime$tableCreateOwn;
const T_FLAG = 1073741824;
const T_OWN = __jcoEmbeddedRuntime$tableOwn;
const rscTableRemove = __jcoEmbeddedRuntime$tableRemove;
const _jcoInitializeStreams = __jcoEmbeddedRuntime$initializeStreams;
const _jcoInitializeUtf16Decoder = __jcoEmbeddedRuntime$initializeUtf16Decoder;
const _jcoInitializeUtf16Encoding = __jcoEmbeddedRuntime$initializeUtf16Encoding;
const _jcoInitializeUtf8Decoder = __jcoEmbeddedRuntime$initializeUtf8Decoder;
const _jcoInitializeUtf8Encoder = __jcoEmbeddedRuntime$initializeUtf8Encoder;
const _utf8AllocateAndEncode = __jcoEmbeddedRuntime$utf8Encode;
const _jcoInitializeWaitableClass = __jcoEmbeddedRuntime$initializeWaitableClass;
import { environment, exit as exit$1, stderr, stdin, stdout, terminalInput, terminalOutput, terminalStderr, terminalStdin, terminalStdout } from "@bytecodealliance/preview2-shim/cli";
import { monotonicClock, wallClock } from "@bytecodealliance/preview2-shim/clocks";
import { outgoingHandler, types } from "@bytecodealliance/preview2-shim/http";
import { error, poll as poll$1, streams } from "@bytecodealliance/preview2-shim/io";
import { insecureSeed as insecureSeed$1 } from "@bytecodealliance/preview2-shim/random";
const { getEnvironment } = environment;
if (getEnvironment === void 0) {
	let err = Error("unexpectedly undefined local import 'getEnvironment', was 'getEnvironment' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { exit, exitWithCode } = exit$1;
if (exit === void 0) {
	let err = Error("unexpectedly undefined local import 'exit', was 'exit' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (exitWithCode === void 0) {
	let err = Error("unexpectedly undefined local import 'exitWithCode', was 'exitWithCode' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getStderr } = stderr;
if (getStderr === void 0) {
	let err = Error("unexpectedly undefined local import 'getStderr', was 'getStderr' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getStdin } = stdin;
if (getStdin === void 0) {
	let err = Error("unexpectedly undefined local import 'getStdin', was 'getStdin' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getStdout } = stdout;
if (getStdout === void 0) {
	let err = Error("unexpectedly undefined local import 'getStdout', was 'getStdout' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { TerminalInput } = terminalInput;
if (TerminalInput === void 0) {
	let err = Error("unexpectedly undefined local import 'TerminalInput', was 'TerminalInput' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { TerminalOutput } = terminalOutput;
if (TerminalOutput === void 0) {
	let err = Error("unexpectedly undefined local import 'TerminalOutput', was 'TerminalOutput' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getTerminalStderr } = terminalStderr;
if (getTerminalStderr === void 0) {
	let err = Error("unexpectedly undefined local import 'getTerminalStderr', was 'getTerminalStderr' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getTerminalStdin } = terminalStdin;
if (getTerminalStdin === void 0) {
	let err = Error("unexpectedly undefined local import 'getTerminalStdin', was 'getTerminalStdin' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { getTerminalStdout } = terminalStdout;
if (getTerminalStdout === void 0) {
	let err = Error("unexpectedly undefined local import 'getTerminalStdout', was 'getTerminalStdout' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { now, subscribeDuration } = monotonicClock;
if (now === void 0) {
	let err = Error("unexpectedly undefined local import 'now', was 'now' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (subscribeDuration === void 0) {
	let err = Error("unexpectedly undefined local import 'subscribeDuration', was 'subscribeDuration' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { now: now$1 } = wallClock;
if (now$1 === void 0) {
	let err = Error("unexpectedly undefined local import 'now$1', was 'now' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { handle } = outgoingHandler;
if (handle === void 0) {
	let err = Error("unexpectedly undefined local import 'handle', was 'handle' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { Fields, FutureIncomingResponse, FutureTrailers, IncomingBody, IncomingRequest, IncomingResponse, OutgoingBody, OutgoingRequest, OutgoingResponse, RequestOptions, ResponseOutparam } = types;
if (Fields === void 0) {
	let err = Error("unexpectedly undefined local import 'Fields', was 'Fields' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (FutureIncomingResponse === void 0) {
	let err = Error("unexpectedly undefined local import 'FutureIncomingResponse', was 'FutureIncomingResponse' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (FutureTrailers === void 0) {
	let err = Error("unexpectedly undefined local import 'FutureTrailers', was 'FutureTrailers' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (IncomingBody === void 0) {
	let err = Error("unexpectedly undefined local import 'IncomingBody', was 'IncomingBody' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (IncomingRequest === void 0) {
	let err = Error("unexpectedly undefined local import 'IncomingRequest', was 'IncomingRequest' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (IncomingResponse === void 0) {
	let err = Error("unexpectedly undefined local import 'IncomingResponse', was 'IncomingResponse' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (OutgoingBody === void 0) {
	let err = Error("unexpectedly undefined local import 'OutgoingBody', was 'OutgoingBody' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (OutgoingRequest === void 0) {
	let err = Error("unexpectedly undefined local import 'OutgoingRequest', was 'OutgoingRequest' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (OutgoingResponse === void 0) {
	let err = Error("unexpectedly undefined local import 'OutgoingResponse', was 'OutgoingResponse' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (RequestOptions === void 0) {
	let err = Error("unexpectedly undefined local import 'RequestOptions', was 'RequestOptions' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (ResponseOutparam === void 0) {
	let err = Error("unexpectedly undefined local import 'ResponseOutparam', was 'ResponseOutparam' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { Error: Error$1 } = error;
if (Error$1 === void 0) {
	let err = Error("unexpectedly undefined local import 'Error$1', was 'Error' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { Pollable, poll } = poll$1;
if (Pollable === void 0) {
	let err = Error("unexpectedly undefined local import 'Pollable', was 'Pollable' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (poll === void 0) {
	let err = Error("unexpectedly undefined local import 'poll', was 'poll' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { InputStream, OutputStream } = streams;
if (InputStream === void 0) {
	let err = Error("unexpectedly undefined local import 'InputStream', was 'InputStream' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
if (OutputStream === void 0) {
	let err = Error("unexpectedly undefined local import 'OutputStream', was 'OutputStream' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const { insecureSeed } = insecureSeed$1;
if (insecureSeed === void 0) {
	let err = Error("unexpectedly undefined local import 'insecureSeed', was 'insecureSeed' available at instantiation?");
	console.error("ERROR:", err.toString());
	throw err;
}
const _jcoDataViewCacheContext = _jcoInitializeDataViewCache();
const _jcoStrictNumericContext = { strict: !1 };
const TEXT_DECODER_UTF8 = _jcoInitializeUtf8Decoder();
const TEXT_ENCODER_UTF8 = _jcoInitializeUtf8Encoder();
const HANDLE_INDEX_SPACES = _jcoInitializeHandleIndexSpaces();
const RESOURCE_SCOPE_TASKS = _jcoInitializeResourceScopeTasks();
const _jcoResourceRemoveContext = {
	RuntimeError: WebAssembly.RuntimeError,
	indexSpaces: HANDLE_INDEX_SPACES,
	scopeTasks: RESOURCE_SCOPE_TASKS
};
const _jcoCurrentBorrowContext = _jcoInitializeCurrentBorrows();
const CURRENT_TASK_META = _jcoInitializeTaskRegisters();
const ASYNC_STATE = _jcoInitializeComponentAsyncStates();
const Waitable = _jcoInitializeWaitableClass();
const RepTable = _jcoInitializeRepTableClass({ RuntimeError: WebAssembly.RuntimeError });
const INSTANCE_FLAGS = _jcoInitializeInstanceFlags();
const STORE_TRAP = _jcoInitializeStoreTrap();
const CORE_TRAP_MESSAGES = _jcoInitializeCoreTrapMessages({
	unreachable: "wasm trap: wasm `unreachable` instruction executed",
	"memory access out of bounds": "wasm trap: out of bounds memory access",
	"divide by zero": "wasm trap: integer divide by zero",
	"remainder by zero": "wasm trap: integer divide by zero",
	"divide result unrepresentable": "wasm trap: integer overflow",
	"float unrepresentable in integer range": "wasm trap: invalid conversion to integer",
	"table index is out of bounds": "wasm trap: undefined element: out of bounds table access",
	"function signature mismatch": "wasm trap: indirect call type mismatch",
	"call stack exhausted": "wasm trap: call stack exhausted"
});
const _jcoComponentNormalizeTrapContext = {
	RuntimeError: WebAssembly.RuntimeError,
	messages: CORE_TRAP_MESSAGES
};
const STORE_ASYNC_STATE = _jcoInitializeStoreAsyncState();
const _jcoComponentDeadlockContext = {
	RuntimeError: WebAssembly.RuntimeError,
	storeTrap: STORE_TRAP,
	storeAsyncState: STORE_ASYNC_STATE,
	asyncState: ASYNC_STATE
};
const _jcoComponentStateLookupContext = {
	asyncState: ASYNC_STATE,
	ComponentAsyncState: _jcoInitializeComponentAsyncStateClass({
		RuntimeError: WebAssembly.RuntimeError,
		RepTable,
		indexSpaces: HANDLE_INDEX_SPACES,
		instanceFlags: INSTANCE_FLAGS,
		storeTrap: STORE_TRAP,
		normalization: _jcoComponentNormalizeTrapContext,
		cannotEnter: "wasm trap: cannot enter component instance",
		deadlock: _jcoComponentDeadlockContext,
		Waitable,
		reportTrap: (err) => _reportTrap(_jcoComponentReportTrapContext, err),
		checkIdle: () => _checkIdle(_jcoComponentIdleContext)
	})
};
const GLOBAL_COMPONENT_MEMORY_MAP = _jcoInitializeComponentMemoryMap();
const symbolDispose = _jcoInitializeSymbolDispose();
const AsyncSubtask = _jcoInitializeAsyncSubtaskClass({
	RuntimeError: WebAssembly.RuntimeError,
	lookup: _jcoComponentStateLookupContext,
	memories: GLOBAL_COMPONENT_MEMORY_MAP,
	disposeSymbol: symbolDispose
});
const _jcoComponentPostReturnTrapContext = {
	RuntimeError: WebAssembly.RuntimeError,
	lookup: _jcoComponentStateLookupContext,
	stackOverflow: "wasm trap: call stack exhausted",
	uncaughtException: "wasm trap: uncaught exception propagated out of component"
};
const _jcoComponentRecordTrapContext = {
	RuntimeError: WebAssembly.RuntimeError,
	registers: CURRENT_TASK_META,
	lookup: _jcoComponentStateLookupContext
};
const WebAssemblyRuntimeError = _jcoInitializeRuntimeErrorConstructor(WebAssembly);
const ASYNC_EVENT_CODE = _jcoInitializeAsyncEventCodes();
const ASYNC_DETERMINISM = _jcoInitializeAsyncDeterminism("random");
const _jcoResourceScopeCounterContext = _jcoInitializeResourceScopeCounter();
const ASYNC_TASKS_BY_COMPONENT_IDX = _jcoInitializeTasksByComponent();
const ASYNC_CURRENT_TASK_IDS = _jcoInitializeCurrentTaskIds();
const ASYNC_CURRENT_COMPONENT_IDXS = _jcoInitializeCurrentComponentIdxs();
const AsyncTask = _jcoInitializeAsyncTaskClass({
	RuntimeError: WebAssemblyRuntimeError,
	postReturn: _jcoComponentPostReturnTrapContext,
	traps: _jcoComponentRecordTrapContext,
	AsyncSubtask,
	Waitable,
	lookup: _jcoComponentStateLookupContext,
	events: ASYNC_EVENT_CODE,
	determinism: ASYNC_DETERMINISM,
	scopeCounter: _jcoResourceScopeCounterContext,
	scopeTasks: RESOURCE_SCOPE_TASKS,
	storeTrap: STORE_TRAP,
	clearing: {
		tasks: ASYNC_TASKS_BY_COMPONENT_IDX,
		taskIds: ASYNC_CURRENT_TASK_IDS,
		componentIdxs: ASYNC_CURRENT_COMPONENT_IDXS,
		checkIdle: () => _checkIdle(_jcoComponentIdleContext)
	},
	registers: CURRENT_TASK_META,
	FutureValue: _jcoInitializeFutureValueClass(symbolDispose)
});
const _jcoThreadLookupContext = {
	lookup: _jcoComponentStateLookupContext,
	registers: CURRENT_TASK_META
};
const _jcoTaskCreateContext = {
	AsyncTask,
	AsyncThread: _jcoInitializeAsyncThreadClass({
		lookup: _jcoComponentStateLookupContext,
		registers: CURRENT_TASK_META,
		traps: _jcoComponentRecordTrapContext
	}),
	tasks: ASYNC_TASKS_BY_COMPONENT_IDX,
	taskIds: ASYNC_CURRENT_TASK_IDS,
	componentIdxs: ASYNC_CURRENT_COMPONENT_IDXS
};
const _jcoTaskLookupContext = {
	tasks: ASYNC_TASKS_BY_COMPONENT_IDX,
	registers: CURRENT_TASK_META
};
const _jcoComponentMayLeaveContext = {
	RuntimeError: WebAssembly.RuntimeError,
	instanceFlags: INSTANCE_FLAGS
};
const _jcoTaskCompatImportContext = {
	tasks: ASYNC_TASKS_BY_COMPONENT_IDX,
	registers: CURRENT_TASK_META,
	lookup: _jcoComponentStateLookupContext,
	creation: _jcoTaskCreateContext,
	mayLeave: _jcoComponentMayLeaveContext,
	events: ASYNC_EVENT_CODE
};
const CURRENT_TASK_MAY_BLOCK = _jcoInitializeCurrentTaskMayBlock(typeof WebAssembly > "u" ? !1 : { Global: WebAssembly.Global });
const _jcoLiftStringContext = {
	RuntimeError: WebAssemblyRuntimeError,
	utf8: TEXT_DECODER_UTF8,
	utf16: _jcoInitializeUtf16Decoder()
};
const _jcoLiftVariantContext = _jcoInitializeLiftVariant();
const isLE = _jcoInitializeEndianness();
const _jcoLiftListContext = {
	RuntimeError: WebAssemblyRuntimeError,
	littleEndian: isLE
};
const _jcoLowerStringContext = {
	utf8: TEXT_ENCODER_UTF8,
	utf16: _jcoInitializeUtf16Encoding()
};
const _jcoLowerListContext = {
	numeric: _jcoStrictNumericContext,
	littleEndian: isLE
};
const STREAMS = _jcoInitializeStreams(RepTable);
const FUTURES = _jcoInitializeFutures(RepTable);
const _jcoComponentStopContext = {
	RuntimeError: WebAssembly.RuntimeError,
	storeTrap: STORE_TRAP,
	storeAsyncState: STORE_ASYNC_STATE,
	asyncState: ASYNC_STATE,
	tasks: ASYNC_TASKS_BY_COMPONENT_IDX,
	symbolDispose,
	RepTable,
	channels: [STREAMS, FUTURES]
};
const _jcoComponentIdleContext = {
	storeTrap: STORE_TRAP,
	storeAsyncState: STORE_ASYNC_STATE,
	tasks: ASYNC_TASKS_BY_COMPONENT_IDX
};
const _jcoComponentReportTrapContext = {
	RuntimeError: WebAssembly.RuntimeError,
	storeTrap: STORE_TRAP,
	normalization: _jcoComponentNormalizeTrapContext
};
const _jcoComponentHostOperationContext = {
	RuntimeError: WebAssembly.RuntimeError,
	storeTrap: STORE_TRAP,
	storeAsyncState: STORE_ASYNC_STATE,
	asyncState: ASYNC_STATE,
	symbolDispose
};
const _jcoBase64CompileContext = {
	WebAssembly,
	nodejsCompat: !0
};
const _jcoFileCompileCache = _jcoInitializeFileCompileCache(!0);
const _jcoFetchCompileContext = {
	WebAssembly,
	nodejsCompat: !0,
	fileCache: _jcoFileCompileCache
};
const symbolCabiDispose = _jcoInitializeSymbolCabiDispose();
const symbolRscHandle = _jcoInitializeSymbolResourceHandle();
const symbolRscRep = _jcoInitializeSymbolResourceRep();
const HANDLE_TABLES = _jcoInitializeHandleTables();
const hasOwnProperty = _jcoInitializeHasOwnProperty();
WebAssembly.RuntimeError;
let exports0;
const handleTable5 = [T_FLAG, 0];
handleTable5._createdReps = new Set();
handleTable5._componentIdx = 0;
const captureTable5 = new Map();
let captureCnt5 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable5,
	captures: captureTable5
});
HANDLE_TABLES[5] = handleTable5;
const handleTable10 = [T_FLAG, 0];
handleTable10._createdReps = new Set();
handleTable10._componentIdx = 0;
const captureTable10 = new Map();
let captureCnt10 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable10,
	captures: captureTable10
});
HANDLE_TABLES[10] = handleTable10;
const _trampoline9 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable5[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable5.get(rep2);
	if (rsc0) captureTable5.delete(rep2);
	else {
		rsc0 = Object.create(Fields.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle1);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]outgoing-request\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "new OutgoingRequest",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => new OutgoingRequest(rsc0))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof OutgoingRequest)) throw TypeError("Resource error: Not a valid \"OutgoingRequest\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt10) >>> 0;
		captureTable10.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable10, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]outgoing-request\"][Instruction::Return]", {
		funcName: "[constructor]outgoing-request",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline9.fnName = "wasi:http/types@0.2.12#new OutgoingRequest";
const handleTable11 = [T_FLAG, 0];
handleTable11._createdReps = new Set();
handleTable11._componentIdx = 0;
const captureTable11 = new Map();
let captureCnt11 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable11,
	captures: captureTable11
});
HANDLE_TABLES[11] = handleTable11;
const handleTable0 = [T_FLAG, 0];
handleTable0._createdReps = new Set();
handleTable0._componentIdx = 0;
const captureTable0 = new Map();
let captureCnt0 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable0,
	captures: captureTable0
});
HANDLE_TABLES[0] = handleTable0;
const _trampoline11 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable11[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable11.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(FutureIncomingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-incoming-response.subscribe\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "subscribe",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.subscribe())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt0) >>> 0;
		captureTable0.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-incoming-response.subscribe\"][Instruction::Return]", {
		funcName: "[method]future-incoming-response.subscribe",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline11.fnName = "wasi:http/types@0.2.12#subscribe";
const _trampoline12 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable0[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable0.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(Pollable.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"[method]pollable.block\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "block",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		_withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.block())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"[method]pollable.block\"][Instruction::Return]", {
		funcName: "[method]pollable.block",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline12.fnName = "wasi:io/poll@0.2.12#block";
const handleTable12 = [T_FLAG, 0];
handleTable12._createdReps = new Set();
handleTable12._componentIdx = 0;
const captureTable12 = new Map();
let captureCnt12 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable12,
	captures: captureTable12
});
HANDLE_TABLES[12] = handleTable12;
const _trampoline14 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable12[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable12.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.status\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "status",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.status())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.status\"][Instruction::Return]", {
		funcName: "[method]incoming-response.status",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([toUint16(_jcoStrictNumericContext, ret)]);
	task.exit();
	return toUint16(_jcoStrictNumericContext, ret);
};
_trampoline14.fnName = "wasi:http/types@0.2.12#status";
const _trampoline15 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable12[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable12.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.headers\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "headers",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.headers())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Fields)) throw TypeError("Resource error: Not a valid \"Headers\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt5) >>> 0;
		captureTable5.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.headers\"][Instruction::Return]", {
		funcName: "[method]incoming-response.headers",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline15.fnName = "wasi:http/types@0.2.12#headers";
const handleTable6 = [T_FLAG, 0];
handleTable6._createdReps = new Set();
handleTable6._componentIdx = 0;
const captureTable6 = new Map();
let captureCnt6 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable6,
	captures: captureTable6
});
HANDLE_TABLES[6] = handleTable6;
const handleTable7 = [T_FLAG, 0];
handleTable7._createdReps = new Set();
handleTable7._componentIdx = 0;
const captureTable7 = new Map();
let captureCnt7 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable7,
	captures: captureTable7
});
HANDLE_TABLES[7] = handleTable7;
const _trampoline19 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable6[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable6.get(rep2);
	if (rsc0) captureTable6.delete(rep2);
	else {
		rsc0 = Object.create(IncomingBody.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable6, handle1);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]incoming-body.finish\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "IncomingBody.finish",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => IncomingBody.finish(rsc0))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof FutureTrailers)) throw TypeError("Resource error: Not a valid \"FutureTrailers\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt7) >>> 0;
		captureTable7.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable7, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]incoming-body.finish\"][Instruction::Return]", {
		funcName: "[static]incoming-body.finish",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline19.fnName = "wasi:http/types@0.2.12#IncomingBody.finish";
const _trampoline20 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable7[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable7.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(FutureTrailers.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-trailers.subscribe\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "subscribe",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.subscribe())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt0) >>> 0;
		captureTable0.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-trailers.subscribe\"][Instruction::Return]", {
		funcName: "[method]future-trailers.subscribe",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline20.fnName = "wasi:http/types@0.2.12#subscribe";
const handleTable13 = [T_FLAG, 0];
handleTable13._createdReps = new Set();
handleTable13._componentIdx = 0;
const captureTable13 = new Map();
let captureCnt13 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable13,
	captures: captureTable13
});
HANDLE_TABLES[13] = handleTable13;
const _trampoline21 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable5[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable5.get(rep2);
	if (rsc0) captureTable5.delete(rep2);
	else {
		rsc0 = Object.create(Fields.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle1);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]outgoing-response\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "new OutgoingResponse",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => new OutgoingResponse(rsc0))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof OutgoingResponse)) throw TypeError("Resource error: Not a valid \"OutgoingResponse\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt13) >>> 0;
		captureTable13.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable13, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]outgoing-response\"][Instruction::Return]", {
		funcName: "[constructor]outgoing-response",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline21.fnName = "wasi:http/types@0.2.12#new OutgoingResponse";
const _trampoline22 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable13[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable13.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-response.set-status-code\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "setStatusCode",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.setStatusCode(clampGuest(arg1, 0, 65535)))
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant4 = ret;
	let variant4_0;
	switch (variant4.tag) {
		case "ok":
			variant4.val;
			variant4_0 = 0;
			break;
		case "err":
			variant4.val;
			variant4_0 = 1;
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant4,
				valueType: typeof variant4
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-response.set-status-code\"][Instruction::Return]", {
		funcName: "[method]outgoing-response.set-status-code",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([variant4_0]);
	task.exit();
	return variant4_0;
};
_trampoline22.fnName = "wasi:http/types@0.2.12#setStatusCode";
const handleTable8 = [T_FLAG, 0];
handleTable8._createdReps = new Set();
handleTable8._componentIdx = 0;
const captureTable8 = new Map();
let captureCnt8 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable8,
	captures: captureTable8
});
HANDLE_TABLES[8] = handleTable8;
const _trampoline23 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.headers\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "headers",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.headers())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Fields)) throw TypeError("Resource error: Not a valid \"Headers\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt5) >>> 0;
		captureTable5.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.headers\"][Instruction::Return]", {
		funcName: "[method]incoming-request.headers",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline23.fnName = "wasi:http/types@0.2.12#headers";
const _trampoline24 = function() {
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]fields\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "new Fields",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => new Fields())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
	var handle0 = ret[symbolRscHandle];
	if (!handle0) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt5) >>> 0;
		captureTable5.set(rep, ret);
		handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[constructor]fields\"][Instruction::Return]", {
		funcName: "[constructor]fields",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle0]);
	task.exit();
	return handle0;
};
_trampoline24.fnName = "wasi:http/types@0.2.12#new Fields";
const handleTable3 = [T_FLAG, 0];
handleTable3._createdReps = new Set();
handleTable3._componentIdx = 0;
const captureTable3 = new Map();
let captureCnt3 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable3,
	captures: captureTable3
});
HANDLE_TABLES[3] = handleTable3;
const _trampoline25 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable3[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable3.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(InputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.subscribe\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "subscribe",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.subscribe())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt0) >>> 0;
		captureTable0.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.subscribe\"][Instruction::Return]", {
		funcName: "[method]input-stream.subscribe",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline25.fnName = "wasi:io/streams@0.2.12#subscribe";
const handleTable2 = [T_FLAG, 0];
handleTable2._createdReps = new Set();
handleTable2._componentIdx = 0;
const captureTable2 = new Map();
let captureCnt2 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable2,
	captures: captureTable2
});
HANDLE_TABLES[2] = handleTable2;
const _trampoline26 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.subscribe\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "subscribe",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.subscribe())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	if (!(ret instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
	var handle3 = ret[symbolRscHandle];
	if (!handle3) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt0) >>> 0;
		captureTable0.set(rep, ret);
		handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.subscribe\"][Instruction::Return]", {
		funcName: "[method]output-stream.subscribe",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle3]);
	task.exit();
	return handle3;
};
_trampoline26.fnName = "wasi:io/streams@0.2.12#subscribe";
const _trampoline27 = function(arg0) {
	_debugLog("[iface=\"wasi:clocks/monotonic-clock@0.2.12\", function=\"subscribe-duration\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "subscribeDuration",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => subscribeDuration(BigInt.asUintN(64, BigInt(arg0))))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
	var handle0 = ret[symbolRscHandle];
	if (!handle0) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt0) >>> 0;
		captureTable0.set(rep, ret);
		handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
	}
	_debugLog("[iface=\"wasi:clocks/monotonic-clock@0.2.12\", function=\"subscribe-duration\"][Instruction::Return]", {
		funcName: "subscribe-duration",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle0]);
	task.exit();
	return handle0;
};
_trampoline27.fnName = "wasi:clocks/monotonic-clock@0.2.12#subscribeDuration";
const _trampoline28 = function(arg0) {
	var handle1 = arg0;
	var rep2 = handleTable0[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable0.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(Pollable.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"[method]pollable.ready\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "ready",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.ready())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"[method]pollable.ready\"][Instruction::Return]", {
		funcName: "[method]pollable.ready",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([+!!ret]);
	task.exit();
	return +!!ret;
};
_trampoline28.fnName = "wasi:io/poll@0.2.12#ready";
const _trampoline31 = function(arg0) {
	let variant0;
	switch (arg0) {
		case 0:
			variant0 = {
				tag: "ok",
				val: void 0
			};
			break;
		case 1:
			variant0 = {
				tag: "err",
				val: void 0
			};
			break;
		default: throw TypeError("invalid variant discriminant for expected");
	}
	_debugLog("[iface=\"wasi:cli/exit@0.2.12\", function=\"exit\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "exit",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		_withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => exit(variant0))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	_debugLog("[iface=\"wasi:cli/exit@0.2.12\", function=\"exit\"][Instruction::Return]", {
		funcName: "exit",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline31.fnName = "wasi:cli/exit@0.2.12#exit";
const _trampoline32 = function(arg0) {
	_debugLog("[iface=\"wasi:cli/exit@0.2.12\", function=\"exit-with-code\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "exitWithCode",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		_withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => exitWithCode(clampGuest(arg0, 0, 255)))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	_debugLog("[iface=\"wasi:cli/exit@0.2.12\", function=\"exit-with-code\"][Instruction::Return]", {
		funcName: "exit-with-code",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline32.fnName = "wasi:cli/exit@0.2.12#exitWithCode";
const _trampoline33 = function() {
	_debugLog("[iface=\"wasi:cli/stdin@0.2.12\", function=\"get-stdin\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getStdin",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getStdin())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof InputStream)) throw TypeError("Resource error: Not a valid \"InputStream\" resource.");
	var handle0 = ret[symbolRscHandle];
	if (!handle0) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt3) >>> 0;
		captureTable3.set(rep, ret);
		handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable3, rep);
	}
	_debugLog("[iface=\"wasi:cli/stdin@0.2.12\", function=\"get-stdin\"][Instruction::Return]", {
		funcName: "get-stdin",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle0]);
	task.exit();
	return handle0;
};
_trampoline33.fnName = "wasi:cli/stdin@0.2.12#getStdin";
const _trampoline34 = function() {
	_debugLog("[iface=\"wasi:cli/stdout@0.2.12\", function=\"get-stdout\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getStdout",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getStdout())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
	var handle0 = ret[symbolRscHandle];
	if (!handle0) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt2) >>> 0;
		captureTable2.set(rep, ret);
		handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
	}
	_debugLog("[iface=\"wasi:cli/stdout@0.2.12\", function=\"get-stdout\"][Instruction::Return]", {
		funcName: "get-stdout",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle0]);
	task.exit();
	return handle0;
};
_trampoline34.fnName = "wasi:cli/stdout@0.2.12#getStdout";
const _trampoline35 = function() {
	_debugLog("[iface=\"wasi:cli/stderr@0.2.12\", function=\"get-stderr\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getStderr",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getStderr())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	if (!(ret instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
	var handle0 = ret[symbolRscHandle];
	if (!handle0) {
		let rep = (ret[symbolRscRep] ?? ++captureCnt2) >>> 0;
		captureTable2.set(rep, ret);
		handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
	}
	_debugLog("[iface=\"wasi:cli/stderr@0.2.12\", function=\"get-stderr\"][Instruction::Return]", {
		funcName: "get-stderr",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([handle0]);
	task.exit();
	return handle0;
};
_trampoline35.fnName = "wasi:cli/stderr@0.2.12#getStderr";
const _trampoline36 = function() {
	_debugLog("[iface=\"wasi:clocks/monotonic-clock@0.2.12\", function=\"now\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "now",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => now())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	_debugLog("[iface=\"wasi:clocks/monotonic-clock@0.2.12\", function=\"now\"][Instruction::Return]", {
		funcName: "now",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([toUint64(_jcoStrictNumericContext, ret)]);
	task.exit();
	return toUint64(_jcoStrictNumericContext, ret);
};
_trampoline36.fnName = "wasi:clocks/monotonic-clock@0.2.12#now";
let exports1;
let memory0;
let realloc0;
const _trampoline37 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	let variant4;
	switch (arg1) {
		case 0:
			variant4 = { tag: "get" };
			break;
		case 1:
			variant4 = { tag: "head" };
			break;
		case 2:
			variant4 = { tag: "post" };
			break;
		case 3:
			variant4 = { tag: "put" };
			break;
		case 4:
			variant4 = { tag: "delete" };
			break;
		case 5:
			variant4 = { tag: "connect" };
			break;
		case 6:
			variant4 = { tag: "options" };
			break;
		case 7:
			variant4 = { tag: "trace" };
			break;
		case 8:
			variant4 = { tag: "patch" };
			break;
		case 9:
			var ptr3 = arg2 >>> 0 >>> 0;
			var len3 = arg3 >>> 0;
			if (ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
			variant4 = {
				tag: "other",
				val: _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr3, len3))
			};
			break;
		default: throw TypeError("invalid variant discriminant for Method");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-method\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "setMethod",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet5 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.setMethod(variant4))
		});
		ret = typeof hostRet5 == "object" && hostRet5 && (hostRet5.tag === "ok" || hostRet5.tag === "err") ? hostRet5 : {
			tag: "ok",
			val: hostRet5
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant6 = ret;
	let variant6_0;
	switch (variant6.tag) {
		case "ok":
			variant6.val;
			variant6_0 = 0;
			break;
		case "err":
			variant6.val;
			variant6_0 = 1;
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-method\"][Instruction::Return]", {
		funcName: "[method]outgoing-request.set-method",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([variant6_0]);
	task.exit();
	return variant6_0;
};
_trampoline37.fnName = "wasi:http/types@0.2.12#setMethod";
const _trampoline38 = function(arg0, arg1, arg2, arg3, arg4) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	let variant5;
	switch (arg1) {
		case 0:
			variant5 = void 0;
			break;
		case 1: {
			let variant4;
			switch (arg2) {
				case 0:
					variant4 = { tag: "HTTP" };
					break;
				case 1:
					variant4 = { tag: "HTTPS" };
					break;
				case 2:
					var ptr3 = arg3 >>> 0 >>> 0;
					var len3 = arg4 >>> 0;
					if (ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
					variant4 = {
						tag: "other",
						val: _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr3, len3))
					};
					break;
				default: throw TypeError("invalid variant discriminant for Scheme");
			}
			variant5 = variant4;
			break;
		}
		default: throw TypeError("invalid variant discriminant for option");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-scheme\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "setScheme",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet6 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.setScheme(variant5))
		});
		ret = typeof hostRet6 == "object" && hostRet6 && (hostRet6.tag === "ok" || hostRet6.tag === "err") ? hostRet6 : {
			tag: "ok",
			val: hostRet6
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	let variant7_0;
	switch (variant7.tag) {
		case "ok":
			variant7.val;
			variant7_0 = 0;
			break;
		case "err":
			variant7.val;
			variant7_0 = 1;
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-scheme\"][Instruction::Return]", {
		funcName: "[method]outgoing-request.set-scheme",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([variant7_0]);
	task.exit();
	return variant7_0;
};
_trampoline38.fnName = "wasi:http/types@0.2.12#setScheme";
const _trampoline39 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	let variant4;
	switch (arg1) {
		case 0:
			variant4 = void 0;
			break;
		case 1:
			var ptr3 = arg2 >>> 0 >>> 0;
			var len3 = arg3 >>> 0;
			if (ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
			variant4 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr3, len3));
			break;
		default: throw TypeError("invalid variant discriminant for option");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-authority\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "setAuthority",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet5 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.setAuthority(variant4))
		});
		ret = typeof hostRet5 == "object" && hostRet5 && (hostRet5.tag === "ok" || hostRet5.tag === "err") ? hostRet5 : {
			tag: "ok",
			val: hostRet5
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant6 = ret;
	let variant6_0;
	switch (variant6.tag) {
		case "ok":
			variant6.val;
			variant6_0 = 0;
			break;
		case "err":
			variant6.val;
			variant6_0 = 1;
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-authority\"][Instruction::Return]", {
		funcName: "[method]outgoing-request.set-authority",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([variant6_0]);
	task.exit();
	return variant6_0;
};
_trampoline39.fnName = "wasi:http/types@0.2.12#setAuthority";
const _trampoline40 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	let variant4;
	switch (arg1) {
		case 0:
			variant4 = void 0;
			break;
		case 1:
			var ptr3 = arg2 >>> 0 >>> 0;
			var len3 = arg3 >>> 0;
			if (ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
			variant4 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr3, len3));
			break;
		default: throw TypeError("invalid variant discriminant for option");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-path-with-query\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "setPathWithQuery",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet5 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.setPathWithQuery(variant4))
		});
		ret = typeof hostRet5 == "object" && hostRet5 && (hostRet5.tag === "ok" || hostRet5.tag === "err") ? hostRet5 : {
			tag: "ok",
			val: hostRet5
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant6 = ret;
	let variant6_0;
	switch (variant6.tag) {
		case "ok":
			variant6.val;
			variant6_0 = 0;
			break;
		case "err":
			variant6.val;
			variant6_0 = 1;
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.set-path-with-query\"][Instruction::Return]", {
		funcName: "[method]outgoing-request.set-path-with-query",
		paramCount: 1,
		async: !1,
		postReturn: !1
	});
	task.resolve([variant6_0]);
	task.exit();
	return variant6_0;
};
_trampoline40.fnName = "wasi:http/types@0.2.12#setPathWithQuery";
const handleTable4 = [T_FLAG, 0];
handleTable4._createdReps = new Set();
handleTable4._componentIdx = 0;
const captureTable4 = new Map();
let captureCnt4 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable4,
	captures: captureTable4
});
HANDLE_TABLES[4] = handleTable4;
const _trampoline41 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.body\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "body",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.body())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof OutgoingBody)) throw TypeError("Resource error: Not a valid \"OutgoingBody\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt4) >>> 0;
				captureTable4.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable4, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-request.body\"][Instruction::Return]", {
		funcName: "[method]outgoing-request.body",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline41.fnName = "wasi:http/types@0.2.12#body";
const _trampoline42 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable4[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable4.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingBody.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-body.write\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "write",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.write())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt2) >>> 0;
				captureTable2.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-body.write\"][Instruction::Return]", {
		funcName: "[method]outgoing-body.write",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline42.fnName = "wasi:http/types@0.2.12#write";
const _trampoline43 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable12[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable12.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.consume\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "consume",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.consume())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof IncomingBody)) throw TypeError("Resource error: Not a valid \"IncomingBody\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt6) >>> 0;
				captureTable6.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable6, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-response.consume\"][Instruction::Return]", {
		funcName: "[method]incoming-response.consume",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline43.fnName = "wasi:http/types@0.2.12#consume";
const _trampoline44 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable6[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable6.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingBody.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-body.stream\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "stream",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.stream())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof InputStream)) throw TypeError("Resource error: Not a valid \"InputStream\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt3) >>> 0;
				captureTable3.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable3, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-body.stream\"][Instruction::Return]", {
		funcName: "[method]incoming-body.stream",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline44.fnName = "wasi:http/types@0.2.12#stream";
const _trampoline45 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable4[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable4.get(rep2);
	if (rsc0) captureTable4.delete(rep2);
	else {
		rsc0 = Object.create(OutgoingBody.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable4, handle1);
	let variant6;
	switch (arg1) {
		case 0:
			variant6 = void 0;
			break;
		case 1:
			var handle4 = arg2;
			var rep5 = handleTable5[(handle4 << 1) + 1] % T_OWN;
			var rsc3 = captureTable5.get(rep5);
			if (rsc3) captureTable5.delete(rep5);
			else {
				rsc3 = Object.create(Fields.prototype);
				Object.defineProperty(rsc3, symbolRscHandle, {
					writable: !0,
					value: handle4
				});
				Object.defineProperty(rsc3, symbolRscRep, {
					writable: !0,
					value: rep5
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle4);
			variant6 = rsc3;
			break;
		default: throw TypeError("invalid variant discriminant for option");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]outgoing-body.finish\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "OutgoingBody.finish",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet7 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => OutgoingBody.finish(rsc0, variant6))
		});
		ret = typeof hostRet7 == "object" && hostRet7 && (hostRet7.tag === "ok" || hostRet7.tag === "err") ? hostRet7 : {
			tag: "ok",
			val: hostRet7
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant46 = ret;
	switch (variant46.tag) {
		case "ok":
			variant46.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 0, !0);
			break;
		case "err": {
			let e = variant46.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 1, !0);
			var variant45 = e;
			switch (variant45.tag) {
				case "DNS-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 0, !0);
					break;
				case "DNS-error": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 1, !0);
					var { rcode: v8_0, infoCode: v8_1 } = e;
					var variant10 = v8_0;
					if (variant10 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant10;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr9 = encodeRes.ptr;
						var len9 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len9, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr9, !0);
					}
					var variant11 = v8_1;
					if (variant11 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant11;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt16((arg3 >>> 0) + 30, toUint16(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "destination-not-found":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 2, !0);
					break;
				case "destination-unavailable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 3, !0);
					break;
				case "destination-IP-prohibited":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 4, !0);
					break;
				case "destination-IP-unroutable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 5, !0);
					break;
				case "connection-refused":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 6, !0);
					break;
				case "connection-terminated":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 7, !0);
					break;
				case "connection-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 8, !0);
					break;
				case "connection-read-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 9, !0);
					break;
				case "connection-write-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 10, !0);
					break;
				case "connection-limit-reached":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 11, !0);
					break;
				case "TLS-protocol-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 12, !0);
					break;
				case "TLS-certificate-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 13, !0);
					break;
				case "TLS-alert-received": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 14, !0);
					var { alertId: v12_0, alertMessage: v12_1 } = e;
					var variant13 = v12_0;
					if (variant13 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant13;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 17, toUint8(_jcoStrictNumericContext, e), !0);
					}
					var variant15 = v12_1;
					if (variant15 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 0, !0);
					else {
						let e = variant15;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr14 = encodeRes.ptr;
						var len14 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 28, len14, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, ptr14, !0);
					}
					break;
				}
				case "HTTP-request-denied":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 15, !0);
					break;
				case "HTTP-request-length-required":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 16, !0);
					break;
				case "HTTP-request-body-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 17, !0);
					var variant16 = e;
					if (variant16 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant16;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg3 >>> 0) + 24, toUint64(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-method-invalid":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 18, !0);
					break;
				case "HTTP-request-URI-invalid":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 19, !0);
					break;
				case "HTTP-request-URI-too-long":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 20, !0);
					break;
				case "HTTP-request-header-section-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 21, !0);
					var variant17 = e;
					if (variant17 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant17;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-header-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 22, !0);
					var variant22 = e;
					if (variant22 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant22;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var { fieldName: v18_0, fieldSize: v18_1 } = e;
						var variant20 = v18_0;
						if (variant20 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 0, !0);
						else {
							let e = variant20;
							dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 1, !0);
							var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
								let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
								let previousMayLeave = state.mayLeave;
								let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
								let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
								let previousStorage = thread?.storage;
								thread && (thread.storage = [0, 0]);
								state.mayLeave = !1;
								let restore = () => {
									state.mayLeave = previousMayLeave;
									thread && (thread.storage = previousStorage);
								};
								let result;
								try {
									result = realloc0(...args);
								} catch (err) {
									restore();
									throw err;
								}
								if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
								restore();
								return result;
							}), memory0);
							var ptr19 = encodeRes.ptr;
							var len19 = encodeRes.len;
							dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 28, len19, !0);
							dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, ptr19, !0);
						}
						var variant21 = v18_1;
						if (variant21 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 32, 0, !0);
						else {
							let e = variant21;
							dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 32, 1, !0);
							dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
						}
					}
					break;
				}
				case "HTTP-request-trailer-section-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 23, !0);
					var variant23 = e;
					if (variant23 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant23;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-trailer-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 24, !0);
					var { fieldName: v24_0, fieldSize: v24_1 } = e;
					var variant26 = v24_0;
					if (variant26 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant26;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr25 = encodeRes.ptr;
						var len25 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len25, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr25, !0);
					}
					var variant27 = v24_1;
					if (variant27 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant27;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-incomplete":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 25, !0);
					break;
				case "HTTP-response-header-section-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 26, !0);
					var variant28 = e;
					if (variant28 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant28;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-header-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 27, !0);
					var { fieldName: v29_0, fieldSize: v29_1 } = e;
					var variant31 = v29_0;
					if (variant31 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant31;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr30 = encodeRes.ptr;
						var len30 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len30, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr30, !0);
					}
					var variant32 = v29_1;
					if (variant32 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant32;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-body-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 28, !0);
					var variant33 = e;
					if (variant33 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant33;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg3 >>> 0) + 24, toUint64(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-trailer-section-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 29, !0);
					var variant34 = e;
					if (variant34 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant34;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-trailer-size": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 30, !0);
					var { fieldName: v35_0, fieldSize: v35_1 } = e;
					var variant37 = v35_0;
					if (variant37 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant37;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr36 = encodeRes.ptr;
						var len36 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len36, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr36, !0);
					}
					var variant38 = v35_1;
					if (variant38 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant38;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-transfer-coding": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 31, !0);
					var variant40 = e;
					if (variant40 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant40;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr39 = encodeRes.ptr;
						var len39 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len39, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr39, !0);
					}
					break;
				}
				case "HTTP-response-content-coding": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 32, !0);
					var variant42 = e;
					if (variant42 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant42;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr41 = encodeRes.ptr;
						var len41 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len41, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr41, !0);
					}
					break;
				}
				case "HTTP-response-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 33, !0);
					break;
				case "HTTP-upgrade-failed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 34, !0);
					break;
				case "HTTP-protocol-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 35, !0);
					break;
				case "loop-detected":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 36, !0);
					break;
				case "configuration-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 37, !0);
					break;
				case "internal-error": {
					let e = variant45.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 38, !0);
					var variant44 = e;
					if (variant44 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant44;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr43 = encodeRes.ptr;
						var len43 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len43, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr43, !0);
					}
					break;
				}
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant45.tag)}\` (received \`${variant45}\`) specified for \`ErrorCode\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant46,
				valueType: typeof variant46
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]outgoing-body.finish\"][Instruction::Return]", {
		funcName: "[static]outgoing-body.finish",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline45.fnName = "wasi:http/types@0.2.12#OutgoingBody.finish";
const _trampoline46 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable11[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable11.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(FutureIncomingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-incoming-response.get\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "get",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.get())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant44 = ret;
	if (variant44 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
	else {
		let e = variant44;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
		var variant43 = e;
		switch (variant43.tag) {
			case "ok": {
				let e = variant43.val;
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 0, !0);
				var variant42 = e;
				switch (variant42.tag) {
					case "ok": {
						let e = variant42.val;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 16, 0, !0);
						if (!(e instanceof IncomingResponse)) throw TypeError("Resource error: Not a valid \"IncomingResponse\" resource.");
						var handle3 = e[symbolRscHandle];
						if (!handle3) {
							let rep = (e[symbolRscRep] ?? ++captureCnt12) >>> 0;
							captureTable12.set(rep, e);
							handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable12, rep);
						}
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 24, handle3, !0);
						break;
					}
					case "err": {
						let e = variant42.val;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 16, 1, !0);
						var variant41 = e;
						switch (variant41.tag) {
							case "DNS-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 0, !0);
								break;
							case "DNS-error": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 1, !0);
								var { rcode: v4_0, infoCode: v4_1 } = e;
								var variant6 = v4_0;
								if (variant6 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant6;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr5 = encodeRes.ptr;
									var len5 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len5, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr5, !0);
								}
								var variant7 = v4_1;
								if (variant7 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant7;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt16((arg1 >>> 0) + 46, toUint16(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "destination-not-found":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 2, !0);
								break;
							case "destination-unavailable":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 3, !0);
								break;
							case "destination-IP-prohibited":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 4, !0);
								break;
							case "destination-IP-unroutable":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 5, !0);
								break;
							case "connection-refused":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 6, !0);
								break;
							case "connection-terminated":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 7, !0);
								break;
							case "connection-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 8, !0);
								break;
							case "connection-read-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 9, !0);
								break;
							case "connection-write-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 10, !0);
								break;
							case "connection-limit-reached":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 11, !0);
								break;
							case "TLS-protocol-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 12, !0);
								break;
							case "TLS-certificate-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 13, !0);
								break;
							case "TLS-alert-received": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 14, !0);
								var { alertId: v8_0, alertMessage: v8_1 } = e;
								var variant9 = v8_0;
								if (variant9 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant9;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 33, toUint8(_jcoStrictNumericContext, e), !0);
								}
								var variant11 = v8_1;
								if (variant11 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 0, !0);
								else {
									let e = variant11;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr10 = encodeRes.ptr;
									var len10 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 44, len10, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, ptr10, !0);
								}
								break;
							}
							case "HTTP-request-denied":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 15, !0);
								break;
							case "HTTP-request-length-required":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 16, !0);
								break;
							case "HTTP-request-body-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 17, !0);
								var variant12 = e;
								if (variant12 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant12;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg1 >>> 0) + 40, toUint64(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-method-invalid":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 18, !0);
								break;
							case "HTTP-request-URI-invalid":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 19, !0);
								break;
							case "HTTP-request-URI-too-long":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 20, !0);
								break;
							case "HTTP-request-header-section-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 21, !0);
								var variant13 = e;
								if (variant13 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant13;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-header-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 22, !0);
								var variant18 = e;
								if (variant18 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant18;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var { fieldName: v14_0, fieldSize: v14_1 } = e;
									var variant16 = v14_0;
									if (variant16 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 0, !0);
									else {
										let e = variant16;
										dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 1, !0);
										var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
											let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
											let previousMayLeave = state.mayLeave;
											let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
											let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
											let previousStorage = thread?.storage;
											thread && (thread.storage = [0, 0]);
											state.mayLeave = !1;
											let restore = () => {
												state.mayLeave = previousMayLeave;
												thread && (thread.storage = previousStorage);
											};
											let result;
											try {
												result = realloc0(...args);
											} catch (err) {
												restore();
												throw err;
											}
											if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
											restore();
											return result;
										}), memory0);
										var ptr15 = encodeRes.ptr;
										var len15 = encodeRes.len;
										dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 44, len15, !0);
										dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, ptr15, !0);
									}
									var variant17 = v14_1;
									if (variant17 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 48, 0, !0);
									else {
										let e = variant17;
										dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 48, 1, !0);
										dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 52, toUint32(_jcoStrictNumericContext, e), !0);
									}
								}
								break;
							}
							case "HTTP-request-trailer-section-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 23, !0);
								var variant19 = e;
								if (variant19 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant19;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-trailer-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 24, !0);
								var { fieldName: v20_0, fieldSize: v20_1 } = e;
								var variant22 = v20_0;
								if (variant22 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant22;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr21 = encodeRes.ptr;
									var len21 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len21, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr21, !0);
								}
								var variant23 = v20_1;
								if (variant23 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant23;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-incomplete":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 25, !0);
								break;
							case "HTTP-response-header-section-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 26, !0);
								var variant24 = e;
								if (variant24 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant24;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-header-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 27, !0);
								var { fieldName: v25_0, fieldSize: v25_1 } = e;
								var variant27 = v25_0;
								if (variant27 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant27;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr26 = encodeRes.ptr;
									var len26 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len26, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr26, !0);
								}
								var variant28 = v25_1;
								if (variant28 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant28;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-body-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 28, !0);
								var variant29 = e;
								if (variant29 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant29;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg1 >>> 0) + 40, toUint64(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-trailer-section-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 29, !0);
								var variant30 = e;
								if (variant30 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant30;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-trailer-size": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 30, !0);
								var { fieldName: v31_0, fieldSize: v31_1 } = e;
								var variant33 = v31_0;
								if (variant33 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant33;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr32 = encodeRes.ptr;
									var len32 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len32, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr32, !0);
								}
								var variant34 = v31_1;
								if (variant34 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant34;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-transfer-coding": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 31, !0);
								var variant36 = e;
								if (variant36 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant36;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr35 = encodeRes.ptr;
									var len35 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len35, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr35, !0);
								}
								break;
							}
							case "HTTP-response-content-coding": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 32, !0);
								var variant38 = e;
								if (variant38 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant38;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr37 = encodeRes.ptr;
									var len37 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len37, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr37, !0);
								}
								break;
							}
							case "HTTP-response-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 33, !0);
								break;
							case "HTTP-upgrade-failed":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 34, !0);
								break;
							case "HTTP-protocol-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 35, !0);
								break;
							case "loop-detected":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 36, !0);
								break;
							case "configuration-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 37, !0);
								break;
							case "internal-error": {
								let e = variant41.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 38, !0);
								var variant40 = e;
								if (variant40 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant40;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr39 = encodeRes.ptr;
									var len39 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len39, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr39, !0);
								}
								break;
							}
							default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant41.tag)}\` (received \`${variant41}\`) specified for \`ErrorCode\``);
						}
						break;
					}
					default:
						_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
							value: variant42,
							valueType: typeof variant42
						});
						throw TypeError("invalid variant specified for result");
				}
				break;
			}
			case "err":
				variant43.val;
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 1, !0);
				break;
			default:
				_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
					value: variant43,
					valueType: typeof variant43
				});
				throw TypeError("invalid variant specified for result");
		}
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-incoming-response.get\"][Instruction::Return]", {
		funcName: "[method]future-incoming-response.get",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline46.fnName = "wasi:http/types@0.2.12#get";
const _trampoline47 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable5[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable5.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(Fields.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]fields.entries\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "entries",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.entries())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var vec6 = ret;
	var len6 = vec6.length;
	var result6 = ((...args) => {
		let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
		let previousMayLeave = state.mayLeave;
		let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
		let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
		let previousStorage = thread?.storage;
		thread && (thread.storage = [0, 0]);
		state.mayLeave = !1;
		let restore = () => {
			state.mayLeave = previousMayLeave;
			thread && (thread.storage = previousStorage);
		};
		let result;
		try {
			result = realloc0(...args);
		} catch (err) {
			restore();
			throw err;
		}
		if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
		restore();
		return result;
	})(0, 0, 4, len6 * 16);
	result6 >>>= 0;
	if (result6 % 4 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
	if (result6 > memory0.buffer.byteLength || len6 > Math.floor((memory0.buffer.byteLength - result6) / 16)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
	if (result6 < 0 || len6 < 0 || len6 > 16777215 || result6 > memory0.buffer.byteLength || len6 > Math.floor((memory0.buffer.byteLength - result6) / 16)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	for (let i = 0; i < vec6.length; i++) {
		let e = vec6[i];
		let base = result6 + i * 16;
		var [tuple3_0, tuple3_1] = e;
		var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, tuple3_0, ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		}), memory0);
		var ptr4 = encodeRes.ptr;
		var len4 = encodeRes.len;
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 4, len4, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 0, ptr4, !0);
		var val5 = tuple3_1;
		var len5 = Array.isArray(val5) ? val5.length : val5.byteLength;
		var ptr5 = ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		})(0, 0, 1, len5 * 1);
		ptr5 >>>= 0;
		if (ptr5 % 1 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
		if (ptr5 > memory0.buffer.byteLength || len5 > Math.floor((memory0.buffer.byteLength - ptr5) / 1)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
		let valData5;
		let valLenBytes5 = len5 * 1;
		if (Array.isArray(val5)) {
			let offset = 0;
			let dv5 = new DataView(memory0.buffer);
			for (let v of val5) {
				_requireValidNumericPrimitive.bind(null, "u8")(v);
				dv5.setUint8(ptr5 + offset, v, !0);
				offset += 1;
			}
		} else {
			valData5 = new Uint8Array(val5.buffer || val5, val5.byteOffset, valLenBytes5);
			new Uint8Array(memory0.buffer, ptr5, valLenBytes5).set(valData5);
		}
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 12, len5, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 8, ptr5, !0);
	}
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 4, len6, !0);
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 0, result6, !0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]fields.entries\"][Instruction::Return]", {
		funcName: "[method]fields.entries",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline47.fnName = "wasi:http/types@0.2.12#entries";
const _trampoline48 = function(arg0, arg1, arg2) {
	var len2 = arg1;
	var base2 = arg0 >>> 0 >>> 0;
	if (base2 < 0 || len2 < 0 || len2 > 16777215 || base2 > memory0.buffer.byteLength || len2 > Math.floor((memory0.buffer.byteLength - base2) / 16)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	if (base2 % 4 != 0) throw TypeError(`list pointer [${base2}] is not aligned to 4`);
	var result2 = [];
	for (let i = 0; i < len2; i++) {
		let base = base2 + i * 16;
		var ptr0 = dataView(_jcoDataViewCacheContext, memory0).getUint32(base + 0, !0) >>> 0;
		var len0 = dataView(_jcoDataViewCacheContext, memory0).getUint32(base + 4, !0) >>> 0;
		if (ptr0 > memory0.buffer.byteLength || len0 > Math.floor((memory0.buffer.byteLength - ptr0) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
		var result0 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr0, len0));
		var ptr1 = dataView(_jcoDataViewCacheContext, memory0).getUint32(base + 8, !0) >>> 0;
		var len1 = dataView(_jcoDataViewCacheContext, memory0).getUint32(base + 12, !0);
		if (ptr1 < 0 || len1 < 0 || len1 > 268435455 || ptr1 > memory0.buffer.byteLength || len1 > Math.floor((memory0.buffer.byteLength - ptr1) / 1)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
		if (ptr1 % 1 != 0) throw TypeError(`list pointer [${ptr1}] is not aligned to 1`);
		var result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
		result2.push([result0, result1]);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]fields.from-list\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "Fields.fromList",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => Fields.fromList(result2))
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant6 = ret;
	switch (variant6.tag) {
		case "ok": {
			let e = variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 0, !0);
			if (!(e instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt5) >>> 0;
				captureTable5.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg2 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err": {
			let e = variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 1, !0);
			var variant5 = e;
			switch (variant5.tag) {
				case "invalid-syntax":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 0, !0);
					break;
				case "forbidden":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 1, !0);
					break;
				case "immutable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 2, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`HeaderError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]fields.from-list\"][Instruction::Return]", {
		funcName: "[static]fields.from-list",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline48.fnName = "wasi:http/types@0.2.12#Fields.fromList";
const handleTable9 = [T_FLAG, 0];
handleTable9._createdReps = new Set();
handleTable9._componentIdx = 0;
const captureTable9 = new Map();
let captureCnt9 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable9,
	captures: captureTable9
});
HANDLE_TABLES[9] = handleTable9;
const _trampoline49 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
	var handle1 = arg0;
	var rep2 = handleTable9[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable9.get(rep2);
	if (rsc0) captureTable9.delete(rep2);
	else {
		rsc0 = Object.create(ResponseOutparam.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable9, handle1);
	let variant38;
	switch (arg1) {
		case 0:
			var handle4 = arg2;
			var rep5 = handleTable13[(handle4 << 1) + 1] % T_OWN;
			var rsc3 = captureTable13.get(rep5);
			if (rsc3) captureTable13.delete(rep5);
			else {
				rsc3 = Object.create(OutgoingResponse.prototype);
				Object.defineProperty(rsc3, symbolRscHandle, {
					writable: !0,
					value: handle4
				});
				Object.defineProperty(rsc3, symbolRscRep, {
					writable: !0,
					value: rep5
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable13, handle4);
			variant38 = {
				tag: "ok",
				val: rsc3
			};
			break;
		case 1: {
			let variant37;
			switch (arg2) {
				case 0:
					variant37 = { tag: "DNS-timeout" };
					break;
				case 1: {
					let variant7;
					switch (arg3) {
						case 0:
							variant7 = void 0;
							break;
						case 1:
							var ptr6 = Number(arg4) >>> 0 >>> 0;
							var len6 = arg5 >>> 0 >>> 0;
							if (ptr6 > memory0.buffer.byteLength || len6 > Math.floor((memory0.buffer.byteLength - ptr6) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant7 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr6, len6));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					let variant8;
					switch (arg6 >>> 0 | 0) {
						case 0:
							variant8 = void 0;
							break;
						case 1:
							variant8 = clampGuest(arg7, 0, 65535);
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "DNS-error",
						val: {
							rcode: variant7,
							infoCode: variant8
						}
					};
					break;
				}
				case 2:
					variant37 = { tag: "destination-not-found" };
					break;
				case 3:
					variant37 = { tag: "destination-unavailable" };
					break;
				case 4:
					variant37 = { tag: "destination-IP-prohibited" };
					break;
				case 5:
					variant37 = { tag: "destination-IP-unroutable" };
					break;
				case 6:
					variant37 = { tag: "connection-refused" };
					break;
				case 7:
					variant37 = { tag: "connection-terminated" };
					break;
				case 8:
					variant37 = { tag: "connection-timeout" };
					break;
				case 9:
					variant37 = { tag: "connection-read-timeout" };
					break;
				case 10:
					variant37 = { tag: "connection-write-timeout" };
					break;
				case 11:
					variant37 = { tag: "connection-limit-reached" };
					break;
				case 12:
					variant37 = { tag: "TLS-protocol-error" };
					break;
				case 13:
					variant37 = { tag: "TLS-certificate-error" };
					break;
				case 14: {
					let variant9;
					switch (arg3) {
						case 0:
							variant9 = void 0;
							break;
						case 1:
							variant9 = clampGuest(Number(arg4), 0, 255);
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					let variant11;
					switch (arg5 >>> 0 | 0) {
						case 0:
							variant11 = void 0;
							break;
						case 1:
							var ptr10 = arg6 >>> 0 >>> 0;
							var len10 = arg7 >>> 0;
							if (ptr10 > memory0.buffer.byteLength || len10 > Math.floor((memory0.buffer.byteLength - ptr10) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant11 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr10, len10));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "TLS-alert-received",
						val: {
							alertId: variant9,
							alertMessage: variant11
						}
					};
					break;
				}
				case 15:
					variant37 = { tag: "HTTP-request-denied" };
					break;
				case 16:
					variant37 = { tag: "HTTP-request-length-required" };
					break;
				case 17: {
					let variant12;
					switch (arg3) {
						case 0:
							variant12 = void 0;
							break;
						case 1:
							variant12 = BigInt.asUintN(64, BigInt(arg4));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-request-body-size",
						val: variant12
					};
					break;
				}
				case 18:
					variant37 = { tag: "HTTP-request-method-invalid" };
					break;
				case 19:
					variant37 = { tag: "HTTP-request-URI-invalid" };
					break;
				case 20:
					variant37 = { tag: "HTTP-request-URI-too-long" };
					break;
				case 21: {
					let variant13;
					switch (arg3) {
						case 0:
							variant13 = void 0;
							break;
						case 1:
							variant13 = Number(arg4) >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-request-header-section-size",
						val: variant13
					};
					break;
				}
				case 22: {
					let variant17;
					switch (arg3) {
						case 0:
							variant17 = void 0;
							break;
						case 1: {
							let variant15;
							switch (Number(arg4)) {
								case 0:
									variant15 = void 0;
									break;
								case 1:
									var ptr14 = arg5 >>> 0 >>> 0;
									var len14 = arg6 >>> 0 >>> 0;
									if (ptr14 > memory0.buffer.byteLength || len14 > Math.floor((memory0.buffer.byteLength - ptr14) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
									variant15 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr14, len14));
									break;
								default: throw TypeError("invalid variant discriminant for option");
							}
							let variant16;
							switch (arg7) {
								case 0:
									variant16 = void 0;
									break;
								case 1:
									variant16 = arg8 >>> 0;
									break;
								default: throw TypeError("invalid variant discriminant for option");
							}
							variant17 = {
								fieldName: variant15,
								fieldSize: variant16
							};
							break;
						}
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-request-header-size",
						val: variant17
					};
					break;
				}
				case 23: {
					let variant18;
					switch (arg3) {
						case 0:
							variant18 = void 0;
							break;
						case 1:
							variant18 = Number(arg4) >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-request-trailer-section-size",
						val: variant18
					};
					break;
				}
				case 24: {
					let variant20;
					switch (arg3) {
						case 0:
							variant20 = void 0;
							break;
						case 1:
							var ptr19 = Number(arg4) >>> 0 >>> 0;
							var len19 = arg5 >>> 0 >>> 0;
							if (ptr19 > memory0.buffer.byteLength || len19 > Math.floor((memory0.buffer.byteLength - ptr19) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant20 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr19, len19));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					let variant21;
					switch (arg6 >>> 0 | 0) {
						case 0:
							variant21 = void 0;
							break;
						case 1:
							variant21 = arg7 >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-request-trailer-size",
						val: {
							fieldName: variant20,
							fieldSize: variant21
						}
					};
					break;
				}
				case 25:
					variant37 = { tag: "HTTP-response-incomplete" };
					break;
				case 26: {
					let variant22;
					switch (arg3) {
						case 0:
							variant22 = void 0;
							break;
						case 1:
							variant22 = Number(arg4) >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-header-section-size",
						val: variant22
					};
					break;
				}
				case 27: {
					let variant24;
					switch (arg3) {
						case 0:
							variant24 = void 0;
							break;
						case 1:
							var ptr23 = Number(arg4) >>> 0 >>> 0;
							var len23 = arg5 >>> 0 >>> 0;
							if (ptr23 > memory0.buffer.byteLength || len23 > Math.floor((memory0.buffer.byteLength - ptr23) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant24 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr23, len23));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					let variant25;
					switch (arg6 >>> 0 | 0) {
						case 0:
							variant25 = void 0;
							break;
						case 1:
							variant25 = arg7 >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-header-size",
						val: {
							fieldName: variant24,
							fieldSize: variant25
						}
					};
					break;
				}
				case 28: {
					let variant26;
					switch (arg3) {
						case 0:
							variant26 = void 0;
							break;
						case 1:
							variant26 = BigInt.asUintN(64, BigInt(arg4));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-body-size",
						val: variant26
					};
					break;
				}
				case 29: {
					let variant27;
					switch (arg3) {
						case 0:
							variant27 = void 0;
							break;
						case 1:
							variant27 = Number(arg4) >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-trailer-section-size",
						val: variant27
					};
					break;
				}
				case 30: {
					let variant29;
					switch (arg3) {
						case 0:
							variant29 = void 0;
							break;
						case 1:
							var ptr28 = Number(arg4) >>> 0 >>> 0;
							var len28 = arg5 >>> 0 >>> 0;
							if (ptr28 > memory0.buffer.byteLength || len28 > Math.floor((memory0.buffer.byteLength - ptr28) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant29 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr28, len28));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					let variant30;
					switch (arg6 >>> 0 | 0) {
						case 0:
							variant30 = void 0;
							break;
						case 1:
							variant30 = arg7 >>> 0;
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-trailer-size",
						val: {
							fieldName: variant29,
							fieldSize: variant30
						}
					};
					break;
				}
				case 31: {
					let variant32;
					switch (arg3) {
						case 0:
							variant32 = void 0;
							break;
						case 1:
							var ptr31 = Number(arg4) >>> 0 >>> 0;
							var len31 = arg5 >>> 0 >>> 0;
							if (ptr31 > memory0.buffer.byteLength || len31 > Math.floor((memory0.buffer.byteLength - ptr31) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant32 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr31, len31));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-transfer-coding",
						val: variant32
					};
					break;
				}
				case 32: {
					let variant34;
					switch (arg3) {
						case 0:
							variant34 = void 0;
							break;
						case 1:
							var ptr33 = Number(arg4) >>> 0 >>> 0;
							var len33 = arg5 >>> 0 >>> 0;
							if (ptr33 > memory0.buffer.byteLength || len33 > Math.floor((memory0.buffer.byteLength - ptr33) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant34 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr33, len33));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "HTTP-response-content-coding",
						val: variant34
					};
					break;
				}
				case 33:
					variant37 = { tag: "HTTP-response-timeout" };
					break;
				case 34:
					variant37 = { tag: "HTTP-upgrade-failed" };
					break;
				case 35:
					variant37 = { tag: "HTTP-protocol-error" };
					break;
				case 36:
					variant37 = { tag: "loop-detected" };
					break;
				case 37:
					variant37 = { tag: "configuration-error" };
					break;
				case 38: {
					let variant36;
					switch (arg3) {
						case 0:
							variant36 = void 0;
							break;
						case 1:
							var ptr35 = Number(arg4) >>> 0 >>> 0;
							var len35 = arg5 >>> 0 >>> 0;
							if (ptr35 > memory0.buffer.byteLength || len35 > Math.floor((memory0.buffer.byteLength - ptr35) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
							variant36 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr35, len35));
							break;
						default: throw TypeError("invalid variant discriminant for option");
					}
					variant37 = {
						tag: "internal-error",
						val: variant36
					};
					break;
				}
				default: throw TypeError("invalid variant discriminant for ErrorCode");
			}
			variant38 = {
				tag: "err",
				val: variant37
			};
			break;
		}
		default: throw TypeError("invalid variant discriminant for expected");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]response-outparam.set\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "ResponseOutparam.set",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		_withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => ResponseOutparam.set(rsc0, variant38))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[static]response-outparam.set\"][Instruction::Return]", {
		funcName: "[static]response-outparam.set",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline49.fnName = "wasi:http/types@0.2.12#ResponseOutparam.set";
const _trampoline50 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable7[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable7.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(FutureTrailers.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-trailers.get\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "get",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.get())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant45 = ret;
	if (variant45 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
	else {
		let e = variant45;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
		var variant44 = e;
		switch (variant44.tag) {
			case "ok": {
				let e = variant44.val;
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 0, !0);
				var variant43 = e;
				switch (variant43.tag) {
					case "ok": {
						let e = variant43.val;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 16, 0, !0);
						var variant4 = e;
						if (variant4 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 0, !0);
						else {
							let e = variant4;
							dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 1, !0);
							if (!(e instanceof Fields)) throw TypeError("Resource error: Not a valid \"Trailers\" resource.");
							var handle3 = e[symbolRscHandle];
							if (!handle3) {
								let rep = (e[symbolRscRep] ?? ++captureCnt5) >>> 0;
								captureTable5.set(rep, e);
								handle3 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
							}
							dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 28, handle3, !0);
						}
						break;
					}
					case "err": {
						let e = variant43.val;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 16, 1, !0);
						var variant42 = e;
						switch (variant42.tag) {
							case "DNS-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 0, !0);
								break;
							case "DNS-error": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 1, !0);
								var { rcode: v5_0, infoCode: v5_1 } = e;
								var variant7 = v5_0;
								if (variant7 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant7;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr6 = encodeRes.ptr;
									var len6 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len6, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr6, !0);
								}
								var variant8 = v5_1;
								if (variant8 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant8;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt16((arg1 >>> 0) + 46, toUint16(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "destination-not-found":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 2, !0);
								break;
							case "destination-unavailable":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 3, !0);
								break;
							case "destination-IP-prohibited":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 4, !0);
								break;
							case "destination-IP-unroutable":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 5, !0);
								break;
							case "connection-refused":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 6, !0);
								break;
							case "connection-terminated":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 7, !0);
								break;
							case "connection-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 8, !0);
								break;
							case "connection-read-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 9, !0);
								break;
							case "connection-write-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 10, !0);
								break;
							case "connection-limit-reached":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 11, !0);
								break;
							case "TLS-protocol-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 12, !0);
								break;
							case "TLS-certificate-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 13, !0);
								break;
							case "TLS-alert-received": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 14, !0);
								var { alertId: v9_0, alertMessage: v9_1 } = e;
								var variant10 = v9_0;
								if (variant10 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant10;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 33, toUint8(_jcoStrictNumericContext, e), !0);
								}
								var variant12 = v9_1;
								if (variant12 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 0, !0);
								else {
									let e = variant12;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr11 = encodeRes.ptr;
									var len11 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 44, len11, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, ptr11, !0);
								}
								break;
							}
							case "HTTP-request-denied":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 15, !0);
								break;
							case "HTTP-request-length-required":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 16, !0);
								break;
							case "HTTP-request-body-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 17, !0);
								var variant13 = e;
								if (variant13 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant13;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg1 >>> 0) + 40, toUint64(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-method-invalid":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 18, !0);
								break;
							case "HTTP-request-URI-invalid":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 19, !0);
								break;
							case "HTTP-request-URI-too-long":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 20, !0);
								break;
							case "HTTP-request-header-section-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 21, !0);
								var variant14 = e;
								if (variant14 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant14;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-header-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 22, !0);
								var variant19 = e;
								if (variant19 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant19;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var { fieldName: v15_0, fieldSize: v15_1 } = e;
									var variant17 = v15_0;
									if (variant17 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 0, !0);
									else {
										let e = variant17;
										dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 36, 1, !0);
										var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
											let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
											let previousMayLeave = state.mayLeave;
											let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
											let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
											let previousStorage = thread?.storage;
											thread && (thread.storage = [0, 0]);
											state.mayLeave = !1;
											let restore = () => {
												state.mayLeave = previousMayLeave;
												thread && (thread.storage = previousStorage);
											};
											let result;
											try {
												result = realloc0(...args);
											} catch (err) {
												restore();
												throw err;
											}
											if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
											restore();
											return result;
										}), memory0);
										var ptr16 = encodeRes.ptr;
										var len16 = encodeRes.len;
										dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 44, len16, !0);
										dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, ptr16, !0);
									}
									var variant18 = v15_1;
									if (variant18 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 48, 0, !0);
									else {
										let e = variant18;
										dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 48, 1, !0);
										dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 52, toUint32(_jcoStrictNumericContext, e), !0);
									}
								}
								break;
							}
							case "HTTP-request-trailer-section-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 23, !0);
								var variant20 = e;
								if (variant20 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant20;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-request-trailer-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 24, !0);
								var { fieldName: v21_0, fieldSize: v21_1 } = e;
								var variant23 = v21_0;
								if (variant23 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant23;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr22 = encodeRes.ptr;
									var len22 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len22, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr22, !0);
								}
								var variant24 = v21_1;
								if (variant24 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant24;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-incomplete":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 25, !0);
								break;
							case "HTTP-response-header-section-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 26, !0);
								var variant25 = e;
								if (variant25 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant25;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-header-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 27, !0);
								var { fieldName: v26_0, fieldSize: v26_1 } = e;
								var variant28 = v26_0;
								if (variant28 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant28;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr27 = encodeRes.ptr;
									var len27 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len27, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr27, !0);
								}
								var variant29 = v26_1;
								if (variant29 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant29;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-body-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 28, !0);
								var variant30 = e;
								if (variant30 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant30;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg1 >>> 0) + 40, toUint64(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-trailer-section-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 29, !0);
								var variant31 = e;
								if (variant31 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant31;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-trailer-size": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 30, !0);
								var { fieldName: v32_0, fieldSize: v32_1 } = e;
								var variant34 = v32_0;
								if (variant34 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant34;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr33 = encodeRes.ptr;
									var len33 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len33, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr33, !0);
								}
								var variant35 = v32_1;
								if (variant35 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 0, !0);
								else {
									let e = variant35;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 44, 1, !0);
									dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 48, toUint32(_jcoStrictNumericContext, e), !0);
								}
								break;
							}
							case "HTTP-response-transfer-coding": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 31, !0);
								var variant37 = e;
								if (variant37 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant37;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr36 = encodeRes.ptr;
									var len36 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len36, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr36, !0);
								}
								break;
							}
							case "HTTP-response-content-coding": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 32, !0);
								var variant39 = e;
								if (variant39 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant39;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr38 = encodeRes.ptr;
									var len38 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len38, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr38, !0);
								}
								break;
							}
							case "HTTP-response-timeout":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 33, !0);
								break;
							case "HTTP-upgrade-failed":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 34, !0);
								break;
							case "HTTP-protocol-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 35, !0);
								break;
							case "loop-detected":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 36, !0);
								break;
							case "configuration-error":
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 37, !0);
								break;
							case "internal-error": {
								let e = variant42.val;
								dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 24, 38, !0);
								var variant41 = e;
								if (variant41 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 0, !0);
								else {
									let e = variant41;
									dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 32, 1, !0);
									var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
										let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
										let previousMayLeave = state.mayLeave;
										let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
										let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
										let previousStorage = thread?.storage;
										thread && (thread.storage = [0, 0]);
										state.mayLeave = !1;
										let restore = () => {
											state.mayLeave = previousMayLeave;
											thread && (thread.storage = previousStorage);
										};
										let result;
										try {
											result = realloc0(...args);
										} catch (err) {
											restore();
											throw err;
										}
										if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
										restore();
										return result;
									}), memory0);
									var ptr40 = encodeRes.ptr;
									var len40 = encodeRes.len;
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 40, len40, !0);
									dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 36, ptr40, !0);
								}
								break;
							}
							default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant42.tag)}\` (received \`${variant42}\`) specified for \`ErrorCode\``);
						}
						break;
					}
					default:
						_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
							value: variant43,
							valueType: typeof variant43
						});
						throw TypeError("invalid variant specified for result");
				}
				break;
			}
			case "err":
				variant44.val;
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 1, !0);
				break;
			default:
				_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
					value: variant44,
					valueType: typeof variant44
				});
				throw TypeError("invalid variant specified for result");
		}
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]future-trailers.get\"][Instruction::Return]", {
		funcName: "[method]future-trailers.get",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline50.fnName = "wasi:http/types@0.2.12#get";
const _trampoline51 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable13[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable13.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutgoingResponse.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-response.body\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "body",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.body())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof OutgoingBody)) throw TypeError("Resource error: Not a valid \"OutgoingBody\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt4) >>> 0;
				captureTable4.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable4, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]outgoing-response.body\"][Instruction::Return]", {
		funcName: "[method]outgoing-response.body",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline51.fnName = "wasi:http/types@0.2.12#body";
const _trampoline52 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
	var handle1 = arg0;
	var rep2 = handleTable5[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable5.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(Fields.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	var ptr3 = arg1 >>> 0 >>> 0;
	var len3 = arg2 >>> 0;
	if (ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("string pointer/length out of bounds of memory");
	var result3 = _decodeUtf8(WebAssemblyRuntimeError, TEXT_DECODER_UTF8, new Uint8Array(memory0.buffer, ptr3, len3));
	var ptr4 = arg3 >>> 0 >>> 0;
	var len4 = arg4;
	if (ptr4 < 0 || len4 < 0 || len4 > 268435455 || ptr4 > memory0.buffer.byteLength || len4 > Math.floor((memory0.buffer.byteLength - ptr4) / 1)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	if (ptr4 % 1 != 0) throw TypeError(`list pointer [${ptr4}] is not aligned to 1`);
	var result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]fields.append\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "append",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet5 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.append(result3, result4))
		});
		ret = typeof hostRet5 == "object" && hostRet5 && (hostRet5.tag === "ok" || hostRet5.tag === "err") ? hostRet5 : {
			tag: "ok",
			val: hostRet5
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	switch (variant7.tag) {
		case "ok":
			variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg5 >>> 0) + 0, 0, !0);
			break;
		case "err": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg5 >>> 0) + 0, 1, !0);
			var variant6 = e;
			switch (variant6.tag) {
				case "invalid-syntax":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg5 >>> 0) + 1, 0, !0);
					break;
				case "forbidden":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg5 >>> 0) + 1, 1, !0);
					break;
				case "immutable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg5 >>> 0) + 1, 2, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`HeaderError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]fields.append\"][Instruction::Return]", {
		funcName: "[method]fields.append",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline52.fnName = "wasi:http/types@0.2.12#append";
const _trampoline53 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.method\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "method",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.method())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant4 = ret;
	switch (variant4.tag) {
		case "get":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			break;
		case "head":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		case "post":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 2, !0);
			break;
		case "put":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 3, !0);
			break;
		case "delete":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 4, !0);
			break;
		case "connect":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 5, !0);
			break;
		case "options":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 6, !0);
			break;
		case "trace":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 7, !0);
			break;
		case "patch":
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 8, !0);
			break;
		case "other": {
			let e = variant4.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 9, !0);
			var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
				let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
				let previousMayLeave = state.mayLeave;
				let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
				let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
				let previousStorage = thread?.storage;
				thread && (thread.storage = [0, 0]);
				state.mayLeave = !1;
				let restore = () => {
					state.mayLeave = previousMayLeave;
					thread && (thread.storage = previousStorage);
				};
				let result;
				try {
					result = realloc0(...args);
				} catch (err) {
					restore();
					throw err;
				}
				if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
				restore();
				return result;
			}), memory0);
			var ptr3 = encodeRes.ptr;
			var len3 = encodeRes.len;
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 8, len3, !0);
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 4, ptr3, !0);
			break;
		}
		default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`Method\``);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.method\"][Instruction::Return]", {
		funcName: "[method]incoming-request.method",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline53.fnName = "wasi:http/types@0.2.12#method";
const _trampoline54 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.path-with-query\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "pathWithQuery",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.pathWithQuery())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant4 = ret;
	if (variant4 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
	else {
		let e = variant4;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
		var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		}), memory0);
		var ptr3 = encodeRes.ptr;
		var len3 = encodeRes.len;
		dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 8, len3, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 4, ptr3, !0);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.path-with-query\"][Instruction::Return]", {
		funcName: "[method]incoming-request.path-with-query",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline54.fnName = "wasi:http/types@0.2.12#pathWithQuery";
const _trampoline55 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.scheme\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "scheme",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.scheme())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	if (variant5 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
	else {
		let e = variant5;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
		var variant4 = e;
		switch (variant4.tag) {
			case "HTTP":
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 4, 0, !0);
				break;
			case "HTTPS":
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 4, 1, !0);
				break;
			case "other": {
				let e = variant4.val;
				dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 4, 2, !0);
				var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
					let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
					let previousMayLeave = state.mayLeave;
					let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
					let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
					let previousStorage = thread?.storage;
					thread && (thread.storage = [0, 0]);
					state.mayLeave = !1;
					let restore = () => {
						state.mayLeave = previousMayLeave;
						thread && (thread.storage = previousStorage);
					};
					let result;
					try {
						result = realloc0(...args);
					} catch (err) {
						restore();
						throw err;
					}
					if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
					restore();
					return result;
				}), memory0);
				var ptr3 = encodeRes.ptr;
				var len3 = encodeRes.len;
				dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 12, len3, !0);
				dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 8, ptr3, !0);
				break;
			}
			default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`Scheme\``);
		}
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.scheme\"][Instruction::Return]", {
		funcName: "[method]incoming-request.scheme",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline55.fnName = "wasi:http/types@0.2.12#scheme";
const _trampoline56 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.authority\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "authority",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.authority())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant4 = ret;
	if (variant4 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
	else {
		let e = variant4;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
		var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		}), memory0);
		var ptr3 = encodeRes.ptr;
		var len3 = encodeRes.len;
		dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 8, len3, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 4, ptr3, !0);
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.authority\"][Instruction::Return]", {
		funcName: "[method]incoming-request.authority",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline56.fnName = "wasi:http/types@0.2.12#authority";
const _trampoline57 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable8[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable8.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(IncomingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.consume\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "consume",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.consume())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant5 = ret;
	switch (variant5.tag) {
		case "ok": {
			let e = variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			if (!(e instanceof IncomingBody)) throw TypeError("Resource error: Not a valid \"IncomingBody\" resource.");
			var handle4 = e[symbolRscHandle];
			if (!handle4) {
				let rep = (e[symbolRscRep] ?? ++captureCnt6) >>> 0;
				captureTable6.set(rep, e);
				handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable6, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 4, handle4, !0);
			break;
		}
		case "err":
			variant5.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			break;
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant5,
				valueType: typeof variant5
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/types@0.2.12\", function=\"[method]incoming-request.consume\"][Instruction::Return]", {
		funcName: "[method]incoming-request.consume",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline57.fnName = "wasi:http/types@0.2.12#consume";
const handleTable1 = [T_FLAG, 0];
handleTable1._createdReps = new Set();
handleTable1._componentIdx = 0;
const captureTable1 = new Map();
let captureCnt1 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable1,
	captures: captureTable1
});
HANDLE_TABLES[1] = handleTable1;
const _trampoline58 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	var ptr3 = arg1 >>> 0 >>> 0;
	var len3 = arg2;
	if (ptr3 < 0 || len3 < 0 || len3 > 268435455 || ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	if (ptr3 % 1 != 0) throw TypeError(`list pointer [${ptr3}] is not aligned to 1`);
	var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.blocking-write-and-flush\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "blockingWriteAndFlush",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet4 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.blockingWriteAndFlush(result3))
		});
		ret = typeof hostRet4 == "object" && hostRet4 && (hostRet4.tag === "ok" || hostRet4.tag === "err") ? hostRet4 : {
			tag: "ok",
			val: hostRet4
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	switch (variant7.tag) {
		case "ok":
			variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 0, !0);
			break;
		case "err": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 1, !0);
			var variant6 = e;
			switch (variant6.tag) {
				case "last-operation-failed": {
					let e = variant6.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 4, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle5 = e[symbolRscHandle];
					if (!handle5) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle5 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 8, handle5, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 4, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.blocking-write-and-flush\"][Instruction::Return]", {
		funcName: "[method]output-stream.blocking-write-and-flush",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline58.fnName = "wasi:io/streams@0.2.12#blockingWriteAndFlush";
const _trampoline59 = function(arg0, arg1, arg2) {
	var handle1 = arg0;
	var rep2 = handleTable3[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable3.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(InputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.blocking-read\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "blockingRead",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.blockingRead(BigInt.asUintN(64, BigInt(arg1))))
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	switch (variant7.tag) {
		case "ok": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 0, !0);
			var val4 = e;
			var len4 = Array.isArray(val4) ? val4.length : val4.byteLength;
			var ptr4 = ((...args) => {
				let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
				let previousMayLeave = state.mayLeave;
				let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
				let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
				let previousStorage = thread?.storage;
				thread && (thread.storage = [0, 0]);
				state.mayLeave = !1;
				let restore = () => {
					state.mayLeave = previousMayLeave;
					thread && (thread.storage = previousStorage);
				};
				let result;
				try {
					result = realloc0(...args);
				} catch (err) {
					restore();
					throw err;
				}
				if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
				restore();
				return result;
			})(0, 0, 1, len4 * 1);
			ptr4 >>>= 0;
			if (ptr4 % 1 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
			if (ptr4 > memory0.buffer.byteLength || len4 > Math.floor((memory0.buffer.byteLength - ptr4) / 1)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
			let valData4;
			let valLenBytes4 = len4 * 1;
			if (Array.isArray(val4)) {
				let offset = 0;
				let dv4 = new DataView(memory0.buffer);
				for (let v of val4) {
					_requireValidNumericPrimitive.bind(null, "u8")(v);
					dv4.setUint8(ptr4 + offset, v, !0);
					offset += 1;
				}
			} else {
				valData4 = new Uint8Array(val4.buffer || val4, val4.byteOffset, valLenBytes4);
				new Uint8Array(memory0.buffer, ptr4, valLenBytes4).set(valData4);
			}
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 8, len4, !0);
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 4, ptr4, !0);
			break;
		}
		case "err": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 1, !0);
			var variant6 = e;
			switch (variant6.tag) {
				case "last-operation-failed": {
					let e = variant6.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle5 = e[symbolRscHandle];
					if (!handle5) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle5 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg2 >>> 0) + 8, handle5, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.blocking-read\"][Instruction::Return]", {
		funcName: "[method]input-stream.blocking-read",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline59.fnName = "wasi:io/streams@0.2.12#blockingRead";
const _trampoline60 = function(arg0, arg1, arg2) {
	var handle1 = arg0;
	var rep2 = handleTable3[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable3.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(InputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.read\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "read",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.read(BigInt.asUintN(64, BigInt(arg1))))
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	switch (variant7.tag) {
		case "ok": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 0, !0);
			var val4 = e;
			var len4 = Array.isArray(val4) ? val4.length : val4.byteLength;
			var ptr4 = ((...args) => {
				let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
				let previousMayLeave = state.mayLeave;
				let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
				let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
				let previousStorage = thread?.storage;
				thread && (thread.storage = [0, 0]);
				state.mayLeave = !1;
				let restore = () => {
					state.mayLeave = previousMayLeave;
					thread && (thread.storage = previousStorage);
				};
				let result;
				try {
					result = realloc0(...args);
				} catch (err) {
					restore();
					throw err;
				}
				if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
				restore();
				return result;
			})(0, 0, 1, len4 * 1);
			ptr4 >>>= 0;
			if (ptr4 % 1 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
			if (ptr4 > memory0.buffer.byteLength || len4 > Math.floor((memory0.buffer.byteLength - ptr4) / 1)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
			let valData4;
			let valLenBytes4 = len4 * 1;
			if (Array.isArray(val4)) {
				let offset = 0;
				let dv4 = new DataView(memory0.buffer);
				for (let v of val4) {
					_requireValidNumericPrimitive.bind(null, "u8")(v);
					dv4.setUint8(ptr4 + offset, v, !0);
					offset += 1;
				}
			} else {
				valData4 = new Uint8Array(val4.buffer || val4, val4.byteOffset, valLenBytes4);
				new Uint8Array(memory0.buffer, ptr4, valLenBytes4).set(valData4);
			}
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 8, len4, !0);
			dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 4, ptr4, !0);
			break;
		}
		case "err": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 0, 1, !0);
			var variant6 = e;
			switch (variant6.tag) {
				case "last-operation-failed": {
					let e = variant6.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle5 = e[symbolRscHandle];
					if (!handle5) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle5 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg2 >>> 0) + 8, handle5, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg2 >>> 0) + 4, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]input-stream.read\"][Instruction::Return]", {
		funcName: "[method]input-stream.read",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline60.fnName = "wasi:io/streams@0.2.12#read";
const _trampoline61 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.check-write\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "checkWrite",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.checkWrite())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant6 = ret;
	switch (variant6.tag) {
		case "ok": {
			let e = variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg1 >>> 0) + 8, toUint64(_jcoStrictNumericContext, e), !0);
			break;
		}
		case "err": {
			let e = variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			var variant5 = e;
			switch (variant5.tag) {
				case "last-operation-failed": {
					let e = variant5.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle4 = e[symbolRscHandle];
					if (!handle4) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 12, handle4, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 8, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.check-write\"][Instruction::Return]", {
		funcName: "[method]output-stream.check-write",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline61.fnName = "wasi:io/streams@0.2.12#checkWrite";
const _trampoline62 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	var ptr3 = arg1 >>> 0 >>> 0;
	var len3 = arg2;
	if (ptr3 < 0 || len3 < 0 || len3 > 268435455 || ptr3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - ptr3) / 1)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	if (ptr3 % 1 != 0) throw TypeError(`list pointer [${ptr3}] is not aligned to 1`);
	var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.write\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "write",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet4 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.write(result3))
		});
		ret = typeof hostRet4 == "object" && hostRet4 && (hostRet4.tag === "ok" || hostRet4.tag === "err") ? hostRet4 : {
			tag: "ok",
			val: hostRet4
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant7 = ret;
	switch (variant7.tag) {
		case "ok":
			variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 0, !0);
			break;
		case "err": {
			let e = variant7.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 1, !0);
			var variant6 = e;
			switch (variant6.tag) {
				case "last-operation-failed": {
					let e = variant6.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 4, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle5 = e[symbolRscHandle];
					if (!handle5) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle5 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 8, handle5, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 4, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant7,
				valueType: typeof variant7
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.write\"][Instruction::Return]", {
		funcName: "[method]output-stream.write",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline62.fnName = "wasi:io/streams@0.2.12#write";
const _trampoline63 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	var handle4 = arg1;
	var rep5 = handleTable3[(handle4 << 1) + 1] % T_OWN;
	var rsc3 = captureTable3.get(rep5);
	if (!rsc3) {
		rsc3 = Object.create(InputStream.prototype);
		Object.defineProperty(rsc3, symbolRscHandle, {
			writable: !0,
			value: handle4
		});
		Object.defineProperty(rsc3, symbolRscRep, {
			writable: !0,
			value: rep5
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc3);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.splice\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "splice",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet6 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.splice(rsc3, BigInt.asUintN(64, BigInt(arg2))))
		});
		ret = typeof hostRet6 == "object" && hostRet6 && (hostRet6.tag === "ok" || hostRet6.tag === "err") ? hostRet6 : {
			tag: "ok",
			val: hostRet6
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant9 = ret;
	switch (variant9.tag) {
		case "ok": {
			let e = variant9.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 0, !0);
			dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg3 >>> 0) + 8, toUint64(_jcoStrictNumericContext, e), !0);
			break;
		}
		case "err": {
			let e = variant9.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 1, !0);
			var variant8 = e;
			switch (variant8.tag) {
				case "last-operation-failed": {
					let e = variant8.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle7 = e[symbolRscHandle];
					if (!handle7) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle7 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 12, handle7, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant8.tag)}\` (received \`${variant8}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant9,
				valueType: typeof variant9
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.splice\"][Instruction::Return]", {
		funcName: "[method]output-stream.splice",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline63.fnName = "wasi:io/streams@0.2.12#splice";
const _trampoline64 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable2[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable2.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(OutputStream.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.blocking-flush\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "blockingFlush",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet3 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.blockingFlush())
		});
		ret = typeof hostRet3 == "object" && hostRet3 && (hostRet3.tag === "ok" || hostRet3.tag === "err") ? hostRet3 : {
			tag: "ok",
			val: hostRet3
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var variant6 = ret;
	switch (variant6.tag) {
		case "ok":
			variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 0, !0);
			break;
		case "err": {
			let e = variant6.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 0, 1, !0);
			var variant5 = e;
			switch (variant5.tag) {
				case "last-operation-failed": {
					let e = variant5.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 4, 0, !0);
					if (!(e instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error\" resource.");
					var handle4 = e[symbolRscHandle];
					if (!handle4) {
						let rep = (e[symbolRscRep] ?? ++captureCnt1) >>> 0;
						captureTable1.set(rep, e);
						handle4 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
					}
					dataView(_jcoDataViewCacheContext, memory0).setInt32((arg1 >>> 0) + 8, handle4, !0);
					break;
				}
				case "closed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg1 >>> 0) + 4, 1, !0);
					break;
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant6,
				valueType: typeof variant6
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:io/streams@0.2.12\", function=\"[method]output-stream.blocking-flush\"][Instruction::Return]", {
		funcName: "[method]output-stream.blocking-flush",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline64.fnName = "wasi:io/streams@0.2.12#blockingFlush";
const _trampoline65 = function(arg0, arg1) {
	var handle1 = arg0;
	var rep2 = handleTable1[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable1.get(rep2);
	if (!rsc0) {
		rsc0 = Object.create(Error$1.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	_jcoCurrentBorrowContext.borrows.push(rsc0);
	_debugLog("[iface=\"wasi:io/error@0.2.12\", function=\"[method]error.to-debug-string\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "toDebugString",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => rsc0.toDebugString())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, ret, ((...args) => {
		let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
		let previousMayLeave = state.mayLeave;
		let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
		let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
		let previousStorage = thread?.storage;
		thread && (thread.storage = [0, 0]);
		state.mayLeave = !1;
		let restore = () => {
			state.mayLeave = previousMayLeave;
			thread && (thread.storage = previousStorage);
		};
		let result;
		try {
			result = realloc0(...args);
		} catch (err) {
			restore();
			throw err;
		}
		if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
		restore();
		return result;
	}), memory0);
	var ptr3 = encodeRes.ptr;
	var len3 = encodeRes.len;
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 4, len3, !0);
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg1 >>> 0) + 0, ptr3, !0);
	_debugLog("[iface=\"wasi:io/error@0.2.12\", function=\"[method]error.to-debug-string\"][Instruction::Return]", {
		funcName: "[method]error.to-debug-string",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline65.fnName = "wasi:io/error@0.2.12#toDebugString";
const handleTable14 = [T_FLAG, 0];
handleTable14._createdReps = new Set();
handleTable14._componentIdx = 0;
const captureTable14 = new Map();
STORE_TRAP.resourceTables.push({
	handles: handleTable14,
	captures: captureTable14
});
HANDLE_TABLES[14] = handleTable14;
const _trampoline66 = function(arg0, arg1, arg2, arg3) {
	var handle1 = arg0;
	var rep2 = handleTable10[(handle1 << 1) + 1] % T_OWN;
	var rsc0 = captureTable10.get(rep2);
	if (rsc0) captureTable10.delete(rep2);
	else {
		rsc0 = Object.create(OutgoingRequest.prototype);
		Object.defineProperty(rsc0, symbolRscHandle, {
			writable: !0,
			value: handle1
		});
		Object.defineProperty(rsc0, symbolRscRep, {
			writable: !0,
			value: rep2
		});
	}
	rscTableRemove(_jcoResourceRemoveContext, handleTable10, handle1);
	let variant6;
	switch (arg1) {
		case 0:
			variant6 = void 0;
			break;
		case 1:
			var handle4 = arg2;
			var rep5 = handleTable14[(handle4 << 1) + 1] % T_OWN;
			var rsc3 = captureTable14.get(rep5);
			if (rsc3) captureTable14.delete(rep5);
			else {
				rsc3 = Object.create(RequestOptions.prototype);
				Object.defineProperty(rsc3, symbolRscHandle, {
					writable: !0,
					value: handle4
				});
				Object.defineProperty(rsc3, symbolRscRep, {
					writable: !0,
					value: rep5
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable14, handle4);
			variant6 = rsc3;
			break;
		default: throw TypeError("invalid variant discriminant for option");
	}
	_debugLog("[iface=\"wasi:http/outgoing-handler@0.2.12\", function=\"handle\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "handle",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "result-catch-handler",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		let hostRet7 = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => handle(rsc0, variant6))
		});
		ret = typeof hostRet7 == "object" && hostRet7 && (hostRet7.tag === "ok" || hostRet7.tag === "err") ? hostRet7 : {
			tag: "ok",
			val: hostRet7
		};
	} catch (e) {
		if (getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(e)) throw e;
		ret = {
			tag: "err",
			val: getErrorPayload(hasOwnProperty, e)
		};
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant47 = ret;
	switch (variant47.tag) {
		case "ok": {
			let e = variant47.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 0, !0);
			if (!(e instanceof FutureIncomingResponse)) throw TypeError("Resource error: Not a valid \"FutureIncomingResponse\" resource.");
			var handle8 = e[symbolRscHandle];
			if (!handle8) {
				let rep = (e[symbolRscRep] ?? ++captureCnt11) >>> 0;
				captureTable11.set(rep, e);
				handle8 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable11, rep);
			}
			dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 8, handle8, !0);
			break;
		}
		case "err": {
			let e = variant47.val;
			dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 0, 1, !0);
			var variant46 = e;
			switch (variant46.tag) {
				case "DNS-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 0, !0);
					break;
				case "DNS-error": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 1, !0);
					var { rcode: v9_0, infoCode: v9_1 } = e;
					var variant11 = v9_0;
					if (variant11 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant11;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr10 = encodeRes.ptr;
						var len10 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len10, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr10, !0);
					}
					var variant12 = v9_1;
					if (variant12 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant12;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt16((arg3 >>> 0) + 30, toUint16(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "destination-not-found":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 2, !0);
					break;
				case "destination-unavailable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 3, !0);
					break;
				case "destination-IP-prohibited":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 4, !0);
					break;
				case "destination-IP-unroutable":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 5, !0);
					break;
				case "connection-refused":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 6, !0);
					break;
				case "connection-terminated":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 7, !0);
					break;
				case "connection-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 8, !0);
					break;
				case "connection-read-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 9, !0);
					break;
				case "connection-write-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 10, !0);
					break;
				case "connection-limit-reached":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 11, !0);
					break;
				case "TLS-protocol-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 12, !0);
					break;
				case "TLS-certificate-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 13, !0);
					break;
				case "TLS-alert-received": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 14, !0);
					var { alertId: v13_0, alertMessage: v13_1 } = e;
					var variant14 = v13_0;
					if (variant14 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant14;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 17, toUint8(_jcoStrictNumericContext, e), !0);
					}
					var variant16 = v13_1;
					if (variant16 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 0, !0);
					else {
						let e = variant16;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr15 = encodeRes.ptr;
						var len15 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 28, len15, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, ptr15, !0);
					}
					break;
				}
				case "HTTP-request-denied":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 15, !0);
					break;
				case "HTTP-request-length-required":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 16, !0);
					break;
				case "HTTP-request-body-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 17, !0);
					var variant17 = e;
					if (variant17 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant17;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg3 >>> 0) + 24, toUint64(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-method-invalid":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 18, !0);
					break;
				case "HTTP-request-URI-invalid":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 19, !0);
					break;
				case "HTTP-request-URI-too-long":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 20, !0);
					break;
				case "HTTP-request-header-section-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 21, !0);
					var variant18 = e;
					if (variant18 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant18;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-header-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 22, !0);
					var variant23 = e;
					if (variant23 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant23;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var { fieldName: v19_0, fieldSize: v19_1 } = e;
						var variant21 = v19_0;
						if (variant21 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 0, !0);
						else {
							let e = variant21;
							dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 20, 1, !0);
							var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
								let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
								let previousMayLeave = state.mayLeave;
								let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
								let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
								let previousStorage = thread?.storage;
								thread && (thread.storage = [0, 0]);
								state.mayLeave = !1;
								let restore = () => {
									state.mayLeave = previousMayLeave;
									thread && (thread.storage = previousStorage);
								};
								let result;
								try {
									result = realloc0(...args);
								} catch (err) {
									restore();
									throw err;
								}
								if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
								restore();
								return result;
							}), memory0);
							var ptr20 = encodeRes.ptr;
							var len20 = encodeRes.len;
							dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 28, len20, !0);
							dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, ptr20, !0);
						}
						var variant22 = v19_1;
						if (variant22 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 32, 0, !0);
						else {
							let e = variant22;
							dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 32, 1, !0);
							dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 36, toUint32(_jcoStrictNumericContext, e), !0);
						}
					}
					break;
				}
				case "HTTP-request-trailer-section-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 23, !0);
					var variant24 = e;
					if (variant24 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant24;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-request-trailer-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 24, !0);
					var { fieldName: v25_0, fieldSize: v25_1 } = e;
					var variant27 = v25_0;
					if (variant27 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant27;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr26 = encodeRes.ptr;
						var len26 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len26, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr26, !0);
					}
					var variant28 = v25_1;
					if (variant28 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant28;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-incomplete":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 25, !0);
					break;
				case "HTTP-response-header-section-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 26, !0);
					var variant29 = e;
					if (variant29 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant29;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-header-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 27, !0);
					var { fieldName: v30_0, fieldSize: v30_1 } = e;
					var variant32 = v30_0;
					if (variant32 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant32;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr31 = encodeRes.ptr;
						var len31 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len31, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr31, !0);
					}
					var variant33 = v30_1;
					if (variant33 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant33;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-body-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 28, !0);
					var variant34 = e;
					if (variant34 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant34;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg3 >>> 0) + 24, toUint64(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-trailer-section-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 29, !0);
					var variant35 = e;
					if (variant35 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant35;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 20, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-trailer-size": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 30, !0);
					var { fieldName: v36_0, fieldSize: v36_1 } = e;
					var variant38 = v36_0;
					if (variant38 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant38;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr37 = encodeRes.ptr;
						var len37 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len37, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr37, !0);
					}
					var variant39 = v36_1;
					if (variant39 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 0, !0);
					else {
						let e = variant39;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 28, 1, !0);
						dataView(_jcoDataViewCacheContext, memory0).setInt32((arg3 >>> 0) + 32, toUint32(_jcoStrictNumericContext, e), !0);
					}
					break;
				}
				case "HTTP-response-transfer-coding": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 31, !0);
					var variant41 = e;
					if (variant41 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant41;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr40 = encodeRes.ptr;
						var len40 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len40, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr40, !0);
					}
					break;
				}
				case "HTTP-response-content-coding": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 32, !0);
					var variant43 = e;
					if (variant43 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant43;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr42 = encodeRes.ptr;
						var len42 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len42, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr42, !0);
					}
					break;
				}
				case "HTTP-response-timeout":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 33, !0);
					break;
				case "HTTP-upgrade-failed":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 34, !0);
					break;
				case "HTTP-protocol-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 35, !0);
					break;
				case "loop-detected":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 36, !0);
					break;
				case "configuration-error":
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 37, !0);
					break;
				case "internal-error": {
					let e = variant46.val;
					dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 8, 38, !0);
					var variant45 = e;
					if (variant45 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 0, !0);
					else {
						let e = variant45;
						dataView(_jcoDataViewCacheContext, memory0).setInt8((arg3 >>> 0) + 16, 1, !0);
						var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, e, ((...args) => {
							let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
							let previousMayLeave = state.mayLeave;
							let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
							let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
							let previousStorage = thread?.storage;
							thread && (thread.storage = [0, 0]);
							state.mayLeave = !1;
							let restore = () => {
								state.mayLeave = previousMayLeave;
								thread && (thread.storage = previousStorage);
							};
							let result;
							try {
								result = realloc0(...args);
							} catch (err) {
								restore();
								throw err;
							}
							if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
							restore();
							return result;
						}), memory0);
						var ptr44 = encodeRes.ptr;
						var len44 = encodeRes.len;
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 24, len44, !0);
						dataView(_jcoDataViewCacheContext, memory0).setUint32((arg3 >>> 0) + 20, ptr44, !0);
					}
					break;
				}
				default: throw TypeError(`invalid variant tag value \`${JSON.stringify(variant46.tag)}\` (received \`${variant46}\`) specified for \`ErrorCode\``);
			}
			break;
		}
		default:
			_debugLog("ERROR: invalid value (expected result as object with 'tag' member)", {
				value: variant47,
				valueType: typeof variant47
			});
			throw TypeError("invalid variant specified for result");
	}
	_debugLog("[iface=\"wasi:http/outgoing-handler@0.2.12\", function=\"handle\"][Instruction::Return]", {
		funcName: "handle",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline66.fnName = "wasi:http/outgoing-handler@0.2.12#handle";
const _trampoline67 = function(arg0, arg1, arg2) {
	var len3 = arg1;
	var base3 = arg0 >>> 0 >>> 0;
	if (base3 < 0 || len3 < 0 || len3 > 67108863 || base3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - base3) / 4)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	if (base3 % 4 != 0) throw TypeError(`list pointer [${base3}] is not aligned to 4`);
	var result3 = [];
	for (let i = 0; i < len3; i++) {
		let base = base3 + i * 4;
		var handle1 = dataView(_jcoDataViewCacheContext, memory0).getInt32(base + 0, !0);
		var rep2 = handleTable0[(handle1 << 1) + 1] % T_OWN;
		var rsc0 = captureTable0.get(rep2);
		if (!rsc0) {
			rsc0 = Object.create(Pollable.prototype);
			Object.defineProperty(rsc0, symbolRscHandle, {
				writable: !0,
				value: handle1
			});
			Object.defineProperty(rsc0, symbolRscRep, {
				writable: !0,
				value: rep2
			});
		}
		_jcoCurrentBorrowContext.borrows.push(rsc0);
		result3.push(rsc0);
	}
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"poll\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "poll",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => poll(result3))
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	for (let entry of _jcoCurrentBorrowContext.borrows) {
		let rsc = entry.rsc ?? entry;
		entry.drop && rsc[symbolRscHandle] && entry.drop(rsc[symbolRscHandle]);
		rsc[symbolRscHandle] = void 0;
	}
	_jcoCurrentBorrowContext.borrows = [];
	var val4 = ret;
	var len4 = val4.length;
	var ptr4 = ((...args) => {
		let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
		let previousMayLeave = state.mayLeave;
		let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
		let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
		let previousStorage = thread?.storage;
		thread && (thread.storage = [0, 0]);
		state.mayLeave = !1;
		let restore = () => {
			state.mayLeave = previousMayLeave;
			thread && (thread.storage = previousStorage);
		};
		let result;
		try {
			result = realloc0(...args);
		} catch (err) {
			restore();
			throw err;
		}
		if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
		restore();
		return result;
	})(0, 0, 4, len4 * 4);
	ptr4 >>>= 0;
	if (ptr4 % 4 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
	if (ptr4 > memory0.buffer.byteLength || len4 > Math.floor((memory0.buffer.byteLength - ptr4) / 4)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
	let valData4;
	let valLenBytes4 = len4 * 4;
	if (Array.isArray(val4)) {
		let offset = 0;
		let dv4 = new DataView(memory0.buffer);
		for (let v of val4) {
			_requireValidNumericPrimitive.bind(null, "u32")(v);
			dv4.setUint32(ptr4 + offset, v, !0);
			offset += 4;
		}
	} else {
		valData4 = new Uint8Array(val4.buffer || val4, val4.byteOffset, valLenBytes4);
		new Uint8Array(memory0.buffer, ptr4, valLenBytes4).set(valData4);
	}
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 4, len4, !0);
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg2 >>> 0) + 0, ptr4, !0);
	_debugLog("[iface=\"wasi:io/poll@0.2.12\", function=\"poll\"][Instruction::Return]", {
		funcName: "poll",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline67.fnName = "wasi:io/poll@0.2.12#poll";
const _trampoline68 = function(arg0) {
	_debugLog("[iface=\"wasi:random/insecure-seed@0.2.12\", function=\"insecure-seed\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "insecureSeed",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => insecureSeed())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var [tuple0_0, tuple0_1] = ret;
	dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg0 >>> 0) + 0, toUint64(_jcoStrictNumericContext, tuple0_0), !0);
	dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg0 >>> 0) + 8, toUint64(_jcoStrictNumericContext, tuple0_1), !0);
	_debugLog("[iface=\"wasi:random/insecure-seed@0.2.12\", function=\"insecure-seed\"][Instruction::Return]", {
		funcName: "insecure-seed",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline68.fnName = "wasi:random/insecure-seed@0.2.12#insecureSeed";
const _trampoline69 = function(arg0) {
	_debugLog("[iface=\"wasi:cli/environment@0.2.12\", function=\"get-environment\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getEnvironment",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getEnvironment())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var vec3 = ret;
	var len3 = vec3.length;
	var result3 = ((...args) => {
		let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
		let previousMayLeave = state.mayLeave;
		let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
		let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
		let previousStorage = thread?.storage;
		thread && (thread.storage = [0, 0]);
		state.mayLeave = !1;
		let restore = () => {
			state.mayLeave = previousMayLeave;
			thread && (thread.storage = previousStorage);
		};
		let result;
		try {
			result = realloc0(...args);
		} catch (err) {
			restore();
			throw err;
		}
		if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
		restore();
		return result;
	})(0, 0, 4, len3 * 16);
	result3 >>>= 0;
	if (result3 % 4 != 0) throw new WebAssemblyRuntimeError("realloc return: result not aligned");
	if (result3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - result3) / 16)) throw new WebAssemblyRuntimeError("realloc return: beyond end of memory");
	if (result3 < 0 || len3 < 0 || len3 > 16777215 || result3 > memory0.buffer.byteLength || len3 > Math.floor((memory0.buffer.byteLength - result3) / 16)) throw new WebAssemblyRuntimeError("wasm trap: out of bounds memory access");
	for (let i = 0; i < vec3.length; i++) {
		let e = vec3[i];
		let base = result3 + i * 16;
		var [tuple0_0, tuple0_1] = e;
		var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, tuple0_0, ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		}), memory0);
		var ptr1 = encodeRes.ptr;
		var len1 = encodeRes.len;
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 4, len1, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 0, ptr1, !0);
		var encodeRes = _utf8AllocateAndEncode(TEXT_ENCODER_UTF8, tuple0_1, ((...args) => {
			let state = getOrCreateAsyncState(_jcoComponentStateLookupContext, 0);
			let previousMayLeave = state.mayLeave;
			let meta = _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0);
			let thread = meta && getCurrentThread(_jcoThreadLookupContext, meta.componentIdx, meta.threadID, meta.taskID)?.thread;
			let previousStorage = thread?.storage;
			thread && (thread.storage = [0, 0]);
			state.mayLeave = !1;
			let restore = () => {
				state.mayLeave = previousMayLeave;
				thread && (thread.storage = previousStorage);
			};
			let result;
			try {
				result = realloc0(...args);
			} catch (err) {
				restore();
				throw err;
			}
			if (result && typeof result.then == "function") return Promise.resolve(result).finally(restore);
			restore();
			return result;
		}), memory0);
		var ptr2 = encodeRes.ptr;
		var len2 = encodeRes.len;
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 12, len2, !0);
		dataView(_jcoDataViewCacheContext, memory0).setUint32(base + 8, ptr2, !0);
	}
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg0 >>> 0) + 4, len3, !0);
	dataView(_jcoDataViewCacheContext, memory0).setUint32((arg0 >>> 0) + 0, result3, !0);
	_debugLog("[iface=\"wasi:cli/environment@0.2.12\", function=\"get-environment\"][Instruction::Return]", {
		funcName: "get-environment",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline69.fnName = "wasi:cli/environment@0.2.12#getEnvironment";
const handleTable15 = [T_FLAG, 0];
handleTable15._createdReps = new Set();
handleTable15._componentIdx = 0;
const captureTable15 = new Map();
let captureCnt15 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable15,
	captures: captureTable15
});
HANDLE_TABLES[15] = handleTable15;
const _trampoline70 = function(arg0) {
	_debugLog("[iface=\"wasi:cli/terminal-stdin@0.2.12\", function=\"get-terminal-stdin\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getTerminalStdin",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getTerminalStdin())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant1 = ret;
	if (variant1 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 0, !0);
	else {
		let e = variant1;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 1, !0);
		if (!(e instanceof TerminalInput)) throw TypeError("Resource error: Not a valid \"TerminalInput\" resource.");
		var handle0 = e[symbolRscHandle];
		if (!handle0) {
			let rep = (e[symbolRscRep] ?? ++captureCnt15) >>> 0;
			captureTable15.set(rep, e);
			handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable15, rep);
		}
		dataView(_jcoDataViewCacheContext, memory0).setInt32((arg0 >>> 0) + 4, handle0, !0);
	}
	_debugLog("[iface=\"wasi:cli/terminal-stdin@0.2.12\", function=\"get-terminal-stdin\"][Instruction::Return]", {
		funcName: "get-terminal-stdin",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline70.fnName = "wasi:cli/terminal-stdin@0.2.12#getTerminalStdin";
const handleTable16 = [T_FLAG, 0];
handleTable16._createdReps = new Set();
handleTable16._componentIdx = 0;
const captureTable16 = new Map();
let captureCnt16 = 0;
STORE_TRAP.resourceTables.push({
	handles: handleTable16,
	captures: captureTable16
});
HANDLE_TABLES[16] = handleTable16;
const _trampoline71 = function(arg0) {
	_debugLog("[iface=\"wasi:cli/terminal-stdout@0.2.12\", function=\"get-terminal-stdout\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getTerminalStdout",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getTerminalStdout())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant1 = ret;
	if (variant1 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 0, !0);
	else {
		let e = variant1;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 1, !0);
		if (!(e instanceof TerminalOutput)) throw TypeError("Resource error: Not a valid \"TerminalOutput\" resource.");
		var handle0 = e[symbolRscHandle];
		if (!handle0) {
			let rep = (e[symbolRscRep] ?? ++captureCnt16) >>> 0;
			captureTable16.set(rep, e);
			handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable16, rep);
		}
		dataView(_jcoDataViewCacheContext, memory0).setInt32((arg0 >>> 0) + 4, handle0, !0);
	}
	_debugLog("[iface=\"wasi:cli/terminal-stdout@0.2.12\", function=\"get-terminal-stdout\"][Instruction::Return]", {
		funcName: "get-terminal-stdout",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline71.fnName = "wasi:cli/terminal-stdout@0.2.12#getTerminalStdout";
const _trampoline72 = function(arg0) {
	_debugLog("[iface=\"wasi:cli/terminal-stderr@0.2.12\", function=\"get-terminal-stderr\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "getTerminalStderr",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => getTerminalStderr())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var variant1 = ret;
	if (variant1 == null) dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 0, !0);
	else {
		let e = variant1;
		dataView(_jcoDataViewCacheContext, memory0).setInt8((arg0 >>> 0) + 0, 1, !0);
		if (!(e instanceof TerminalOutput)) throw TypeError("Resource error: Not a valid \"TerminalOutput\" resource.");
		var handle0 = e[symbolRscHandle];
		if (!handle0) {
			let rep = (e[symbolRscRep] ?? ++captureCnt16) >>> 0;
			captureTable16.set(rep, e);
			handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable16, rep);
		}
		dataView(_jcoDataViewCacheContext, memory0).setInt32((arg0 >>> 0) + 4, handle0, !0);
	}
	_debugLog("[iface=\"wasi:cli/terminal-stderr@0.2.12\", function=\"get-terminal-stderr\"][Instruction::Return]", {
		funcName: "get-terminal-stderr",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline72.fnName = "wasi:cli/terminal-stderr@0.2.12#getTerminalStderr";
const _trampoline73 = function(arg0) {
	_debugLog("[iface=\"wasi:clocks/wall-clock@0.2.12\", function=\"now\"] [Instruction::CallInterface] (sync, @ enter)");
	let parentTask;
	let task;
	let threadID;
	let subtask;
	let createTask = () => {
		({task, threadID} = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
			componentIdx: -1,
			isAsync: !1,
			entryFnName: "now$1",
			getCallbackFn: () => null,
			callbackFnName: null,
			errHandling: "none",
			callingWasmExport: !1
		}));
	};
	taskCreation: {
		parentTask = getCurrentTask(_jcoTaskLookupContext, 0, _getGlobalCurrentThreadMeta(CURRENT_TASK_META, 0)?.taskID)?.task;
		if (!parentTask) {
			createTask();
			break taskCreation;
		}
		createTask();
		subtask = parentTask.getLatestSubtask();
		if (!subtask) throw Error(`Missing subtask (in parent task [${parentTask.id()}]) for host import, has the import been lowered? (ensure asyncImports are set properly)`);
		task.setParentSubtask(subtask);
	}
	task.enterSync();
	let ret;
	try {
		ret = _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
			componentIdx: task.componentIdx(),
			taskID: task.id(),
			threadID,
			fn: () => _trackHostOperation(_jcoComponentHostOperationContext, () => now$1())
		});
	} catch (err) {
		_debugLog("[Instruction::CallInterface] error during sync call", {
			taskID: task.id(),
			subtaskID: task.getParentSubtask()?.id(),
			err
		});
		getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
		task.setErrored(err);
		task.reject(err);
		task.exit();
		throw err;
	}
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfInterrupted();
	var { seconds: v0_0, nanoseconds: v0_1 } = ret;
	dataView(_jcoDataViewCacheContext, memory0).setBigInt64((arg0 >>> 0) + 0, toUint64(_jcoStrictNumericContext, v0_0), !0);
	dataView(_jcoDataViewCacheContext, memory0).setInt32((arg0 >>> 0) + 8, toUint32(_jcoStrictNumericContext, v0_1), !0);
	_debugLog("[iface=\"wasi:clocks/wall-clock@0.2.12\", function=\"now\"][Instruction::Return]", {
		funcName: "now",
		paramCount: 0,
		async: !1,
		postReturn: !1
	});
	task.resolve([ret]);
	task.exit();
};
_trampoline73.fnName = "wasi:clocks/wall-clock@0.2.12#now$1";
let exports2;
const handleTable17 = [T_FLAG, 0];
handleTable17._createdReps = new Set();
handleTable17._componentIdx = 1;
STORE_TRAP.resourceTables.push({
	handles: handleTable17,
	captures: captureTable8
});
HANDLE_TABLES[17] = handleTable17;
const handleTable18 = [T_FLAG, 0];
handleTable18._createdReps = new Set();
handleTable18._componentIdx = 1;
STORE_TRAP.resourceTables.push({
	handles: handleTable18,
	captures: captureTable9
});
HANDLE_TABLES[18] = handleTable18;
let incomingHandler0212Handle;
function handle$1(arg0, arg1) {
	getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).throwIfTrapped();
	let { task, threadID } = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
		componentIdx: 0,
		isAsync: !1,
		isManualAsync: !1,
		preserveFutureResult: !1,
		entryFnName: "incomingHandler0212Handle",
		getCallbackFn: () => null,
		callbackFnName: null,
		errHandling: "none",
		callingWasmExport: !0
	});
	task.setCalleeIsAsync(!1);
	task.setFuncTypeIsAsync(!1);
	task.setReturnResultTypeIdx(2);
	task.enterSync();
	CURRENT_TASK_MAY_BLOCK.value = +!!task.mayBlock();
	return _withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
		taskID: task.id(),
		threadID,
		componentIdx: task.componentIdx(),
		fn: () => {
			try {
				if (!(arg0 instanceof IncomingRequest)) throw TypeError("Resource error: Not a valid \"IncomingRequest\" resource.");
				var handle0 = arg0[symbolRscHandle];
				if (!handle0) {
					let rep = (arg0[symbolRscRep] ?? ++captureCnt8) >>> 0;
					captureTable8.set(rep, arg0);
					handle0 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable8, rep);
				}
				if (!(arg1 instanceof ResponseOutparam)) throw TypeError("Resource error: Not a valid \"ResponseOutparam\" resource.");
				var handle1 = arg1[symbolRscHandle];
				if (!handle1) {
					let rep = (arg1[symbolRscRep] ?? ++captureCnt9) >>> 0;
					captureTable9.set(rep, arg1);
					handle1 = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable9, rep);
				}
				_debugLog("[iface=\"wasi:http/incoming-handler@0.2.12\", function=\"handle\"][Instruction::CallWasm] enter", {
					funcName: "handle",
					paramCount: 2,
					async: !1,
					postReturn: !1
				});
				let ret;
				try {
					_withGlobalCurrentThreadMeta(CURRENT_TASK_META, {
						taskID: task.id(),
						threadID,
						componentIdx: task.componentIdx(),
						fn: () => incomingHandler0212Handle(handle0, handle1)
					});
				} catch (err) {
					_debugLog("[Instruction::CallWasm] error during sync call", {
						taskID: task.id(),
						err
					});
					getOrCreateAsyncState(_jcoComponentStateLookupContext, 0).markTrapped(err);
					task.setErrored(err);
					task.reject(err);
					task.exit();
					throw err;
				}
				task.endFirstSlice();
				_debugLog("[iface=\"wasi:http/incoming-handler@0.2.12\", function=\"handle\"][Instruction::Return]", {
					funcName: "handle",
					paramCount: 0,
					async: !1,
					postReturn: !1
				});
				task.resolve([ret]);
				task.exit();
			} catch (err) {
				if (!task.isResolvedState()) {
					task.setErrored(err);
					task.reject(err);
				}
				task.isExited() || task.exit({ skipExclusiveLockCheck: !0 });
				throw err;
			}
		}
	});
}
function trampoline0(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable4, handle);
	if (handleEntry.own) {
		let rsc = captureTable4.get(handleEntry.rep);
		if (rsc) {
			captureTable4.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else OutgoingBody[symbolCabiDispose] && OutgoingBody[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline1(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle);
	if (handleEntry.own) {
		let rsc = captureTable5.get(handleEntry.rep);
		if (rsc) {
			captureTable5.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else Fields[symbolCabiDispose] && Fields[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline2(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable2, handle);
	if (handleEntry.own) {
		let rsc = captureTable2.get(handleEntry.rep);
		if (rsc) {
			captureTable2.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else OutputStream[symbolCabiDispose] && OutputStream[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline3(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable6, handle);
	if (handleEntry.own) {
		let rsc = captureTable6.get(handleEntry.rep);
		if (rsc) {
			captureTable6.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else IncomingBody[symbolCabiDispose] && IncomingBody[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline4(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable7, handle);
	if (handleEntry.own) {
		let rsc = captureTable7.get(handleEntry.rep);
		if (rsc) {
			captureTable7.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else FutureTrailers[symbolCabiDispose] && FutureTrailers[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline5(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable8, handle);
	if (handleEntry.own) {
		let rsc = captureTable8.get(handleEntry.rep);
		if (rsc) {
			captureTable8.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else IncomingRequest[symbolCabiDispose] && IncomingRequest[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline6(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable9, handle);
	if (handleEntry.own) {
		let rsc = captureTable9.get(handleEntry.rep);
		if (rsc) {
			captureTable9.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else ResponseOutparam[symbolCabiDispose] && ResponseOutparam[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline7(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable3, handle);
	if (handleEntry.own) {
		let rsc = captureTable3.get(handleEntry.rep);
		if (rsc) {
			captureTable3.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else InputStream[symbolCabiDispose] && InputStream[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline8(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable1, handle);
	if (handleEntry.own) {
		let rsc = captureTable1.get(handleEntry.rep);
		if (rsc) {
			captureTable1.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else Error$1[symbolCabiDispose] && Error$1[symbolCabiDispose](handleEntry.rep);
	}
}
let trampoline9 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 9,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline9.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 5,
		classNameFn: () => Fields,
		createResourceFn: (handle) => {
			let rep = handleTable5[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable5.get(rep);
			if (resourceObj) captureTable5.delete(rep);
			else {
				resourceObj = Object.create(Fields.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle);
			return resourceObj;
		}
	})],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 10,
		lowerFn: function lowerImportedOwnedHost_OutgoingRequest(obj) {
			if (!(obj instanceof OutgoingRequest)) throw TypeError("Resource error: Not a valid \"OutgoingRequest\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt10) >>> 0;
				captureTable10.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable10, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline9
});
function trampoline10(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable10, handle);
	if (handleEntry.own) {
		let rsc = captureTable10.get(handleEntry.rep);
		if (rsc) {
			captureTable10.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else OutgoingRequest[symbolCabiDispose] && OutgoingRequest[symbolCabiDispose](handleEntry.rep);
	}
}
let trampoline11 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 11,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline11.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 11)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 0,
		lowerFn: function lowerImportedOwnedHost_Pollable(obj) {
			if (!(obj instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt0) >>> 0;
				captureTable0.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline11
});
let trampoline12 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 12,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline12.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 0)],
	resultLowerFns: [],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline12
});
function trampoline13(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable0, handle);
	if (handleEntry.own) {
		let rsc = captureTable0.get(handleEntry.rep);
		if (rsc) {
			captureTable0.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else Pollable[symbolCabiDispose] && Pollable[symbolCabiDispose](handleEntry.rep);
	}
}
let trampoline14 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 14,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline14.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 12)],
	resultLowerFns: [_lowerFlatU16.bind(void 0, _jcoStrictNumericContext)],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline14
});
let trampoline15 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 15,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline15.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 12)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 5,
		lowerFn: function lowerImportedOwnedHost_Fields(obj) {
			if (!(obj instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt5) >>> 0;
				captureTable5.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline15
});
function trampoline16(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable12, handle);
	if (handleEntry.own) {
		let rsc = captureTable12.get(handleEntry.rep);
		if (rsc) {
			captureTable12.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else IncomingResponse[symbolCabiDispose] && IncomingResponse[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline17(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable11, handle);
	if (handleEntry.own) {
		let rsc = captureTable11.get(handleEntry.rep);
		if (rsc) {
			captureTable11.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else FutureIncomingResponse[symbolCabiDispose] && FutureIncomingResponse[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline18(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable13, handle);
	if (handleEntry.own) {
		let rsc = captureTable13.get(handleEntry.rep);
		if (rsc) {
			captureTable13.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else OutgoingResponse[symbolCabiDispose] && OutgoingResponse[symbolCabiDispose](handleEntry.rep);
	}
}
let trampoline19 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 19,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline19.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 6,
		classNameFn: () => IncomingBody,
		createResourceFn: (handle) => {
			let rep = handleTable6[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable6.get(rep);
			if (resourceObj) captureTable6.delete(rep);
			else {
				resourceObj = Object.create(IncomingBody.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable6, handle);
			return resourceObj;
		}
	})],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 7,
		lowerFn: function lowerImportedOwnedHost_FutureTrailers(obj) {
			if (!(obj instanceof FutureTrailers)) throw TypeError("Resource error: Not a valid \"FutureTrailers\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt7) >>> 0;
				captureTable7.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable7, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline19
});
let trampoline20 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 20,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline20.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 7)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 0,
		lowerFn: function lowerImportedOwnedHost_Pollable(obj) {
			if (!(obj instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt0) >>> 0;
				captureTable0.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline20
});
let trampoline21 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 21,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline21.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 5,
		classNameFn: () => Fields,
		createResourceFn: (handle) => {
			let rep = handleTable5[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable5.get(rep);
			if (resourceObj) captureTable5.delete(rep);
			else {
				resourceObj = Object.create(Fields.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle);
			return resourceObj;
		}
	})],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 13,
		lowerFn: function lowerImportedOwnedHost_OutgoingResponse(obj) {
			if (!(obj instanceof OutgoingResponse)) throw TypeError("Resource error: Not a valid \"OutgoingResponse\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt13) >>> 0;
				captureTable13.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable13, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline21
});
let trampoline22 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 22,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline22.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 13), _liftFlatU16],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			1,
			1,
			1
		], [
			"err",
			null,
			1,
			1,
			1
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline22
});
let trampoline23 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 23,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline23.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 5,
		lowerFn: function lowerImportedOwnedHost_Fields(obj) {
			if (!(obj instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt5) >>> 0;
				captureTable5.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline23
});
let trampoline24 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 24,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline24.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 5,
		lowerFn: function lowerImportedOwnedHost_Fields(obj) {
			if (!(obj instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt5) >>> 0;
				captureTable5.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline24
});
let trampoline25 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 25,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline25.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 3)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 0,
		lowerFn: function lowerImportedOwnedHost_Pollable(obj) {
			if (!(obj instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt0) >>> 0;
				captureTable0.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline25
});
let trampoline26 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 26,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline26.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 2)],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 0,
		lowerFn: function lowerImportedOwnedHost_Pollable(obj) {
			if (!(obj instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt0) >>> 0;
				captureTable0.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline26
});
let trampoline27 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 27,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline27.manuallyAsync,
	paramLiftFns: [_liftFlatU64],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 0,
		lowerFn: function lowerImportedOwnedHost_Pollable(obj) {
			if (!(obj instanceof Pollable)) throw TypeError("Resource error: Not a valid \"Pollable\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt0) >>> 0;
				captureTable0.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable0, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline27
});
let trampoline28 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 28,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline28.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 0)],
	resultLowerFns: [_lowerFlatBool.bind(void 0, _jcoStrictNumericContext)],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline28
});
function trampoline29(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable15, handle);
	if (handleEntry.own) {
		let rsc = captureTable15.get(handleEntry.rep);
		if (rsc) {
			captureTable15.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else TerminalInput[symbolCabiDispose] && TerminalInput[symbolCabiDispose](handleEntry.rep);
	}
}
function trampoline30(handle) {
	let handleEntry = rscTableRemove(_jcoResourceRemoveContext, handleTable16, handle);
	if (handleEntry.own) {
		let rsc = captureTable16.get(handleEntry.rep);
		if (rsc) {
			captureTable16.delete(handleEntry.rep);
			STORE_TRAP.disposed.add(rsc);
			rsc[symbolDispose] && rsc[symbolDispose]();
		} else TerminalOutput[symbolCabiDispose] && TerminalOutput[symbolCabiDispose](handleEntry.rep);
	}
}
let trampoline31 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 31,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline31.manuallyAsync,
	paramLiftFns: [_liftFlatResult(_jcoLiftVariantContext, {
		caseMetas: [[
			"ok",
			null,
			0,
			0,
			0,
			[]
		], [
			"err",
			null,
			0,
			0,
			0,
			[]
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1,
		variantPayloadFlatTypes: []
	})],
	resultLowerFns: [],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline31
});
let trampoline32 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 32,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline32.manuallyAsync,
	paramLiftFns: [_liftFlatU8],
	resultLowerFns: [],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline32
});
let trampoline33 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 33,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline33.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 3,
		lowerFn: function lowerImportedOwnedHost_InputStream(obj) {
			if (!(obj instanceof InputStream)) throw TypeError("Resource error: Not a valid \"InputStream\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt3) >>> 0;
				captureTable3.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable3, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline33
});
let trampoline34 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 34,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline34.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 2,
		lowerFn: function lowerImportedOwnedHost_OutputStream(obj) {
			if (!(obj instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt2) >>> 0;
				captureTable2.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline34
});
let trampoline35 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 35,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline35.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOwn(_jcoStrictNumericContext, {
		componentIdx: 0,
		tableIdx: 2,
		lowerFn: function lowerImportedOwnedHost_OutputStream(obj) {
			if (!(obj instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
			let handle = obj[symbolRscHandle];
			if (!handle) {
				let rep = (obj[symbolRscRep] ?? ++captureCnt2) >>> 0;
				captureTable2.set(rep, obj);
				handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
			}
			return handle;
		}
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline35
});
let trampoline36 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 36,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline36.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatU64.bind(void 0, _jcoStrictNumericContext)],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: null,
	stringEncoding: "utf8",
	getMemoryFn: () => null,
	getReallocFn: void 0,
	importFn: _trampoline36
});
let trampoline37 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 37,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline37.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 10), _liftFlatVariant(_jcoLiftVariantContext, {
		caseMetas: [
			[
				"get",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"head",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"post",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"put",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"delete",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"connect",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"options",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"trace",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"patch",
				null,
				0,
				0,
				0,
				[]
			],
			[
				"other",
				_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
				8,
				4,
				2,
				["i32", "i32"]
			]
		],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3,
		variantPayloadFlatTypes: ["i32", "i32"]
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			1,
			1,
			1
		], [
			"err",
			null,
			1,
			1,
			1
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline37
});
let trampoline38 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 38,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline38.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 10), _liftFlatOption(_jcoLiftVariantContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0,
			[]
		], [
			"some",
			_liftFlatVariant(_jcoLiftVariantContext, {
				caseMetas: [
					[
						"HTTP",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTPS",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"other",
						_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
						8,
						4,
						2,
						["i32", "i32"]
					]
				],
				variantSize32: 12,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 3,
				variantPayloadFlatTypes: ["i32", "i32"]
			}),
			12,
			4,
			3,
			[
				"i32",
				"i32",
				"i32"
			]
		]],
		variantSize32: 16,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 4,
		variantPayloadFlatTypes: [
			"i32",
			"i32",
			"i32"
		],
		payloadMaybeNull: !1
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			1,
			1,
			1
		], [
			"err",
			null,
			1,
			1,
			1
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline38
});
let trampoline39 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 39,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline39.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 10), _liftFlatOption(_jcoLiftVariantContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0,
			[]
		], [
			"some",
			_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
			8,
			4,
			2,
			["i32", "i32"]
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3,
		variantPayloadFlatTypes: ["i32", "i32"],
		payloadMaybeNull: !1
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			1,
			1,
			1
		], [
			"err",
			null,
			1,
			1,
			1
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline39
});
let trampoline40 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 40,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline40.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 10), _liftFlatOption(_jcoLiftVariantContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0,
			[]
		], [
			"some",
			_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
			8,
			4,
			2,
			["i32", "i32"]
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3,
		variantPayloadFlatTypes: ["i32", "i32"],
		payloadMaybeNull: !1
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			1,
			1,
			1
		], [
			"err",
			null,
			1,
			1,
			1
		]],
		variantSize32: 1,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 1
	})],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline40
});
let trampoline41 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 41,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline41.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 10)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 4,
				lowerFn: function lowerImportedOwnedHost_OutgoingBody(obj) {
					if (!(obj instanceof OutgoingBody)) throw TypeError("Resource error: Not a valid \"OutgoingBody\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt4) >>> 0;
						captureTable4.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable4, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline41
});
let trampoline42 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 42,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline42.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 4)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 2,
				lowerFn: function lowerImportedOwnedHost_OutputStream(obj) {
					if (!(obj instanceof OutputStream)) throw TypeError("Resource error: Not a valid \"OutputStream\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt2) >>> 0;
						captureTable2.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable2, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline42
});
let trampoline43 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 43,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline43.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 12)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 6,
				lowerFn: function lowerImportedOwnedHost_IncomingBody(obj) {
					if (!(obj instanceof IncomingBody)) throw TypeError("Resource error: Not a valid \"IncomingBody\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt6) >>> 0;
						captureTable6.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable6, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline43
});
let trampoline44 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 44,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline44.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 6)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 3,
				lowerFn: function lowerImportedOwnedHost_InputStream(obj) {
					if (!(obj instanceof InputStream)) throw TypeError("Resource error: Not a valid \"InputStream\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt3) >>> 0;
						captureTable3.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable3, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline44
});
let trampoline45 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 45,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline45.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 4,
		classNameFn: () => OutgoingBody,
		createResourceFn: (handle) => {
			let rep = handleTable4[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable4.get(rep);
			if (resourceObj) captureTable4.delete(rep);
			else {
				resourceObj = Object.create(OutgoingBody.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable4, handle);
			return resourceObj;
		}
	}), _liftFlatOption(_jcoLiftVariantContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0,
			[]
		], [
			"some",
			_liftFlatOwn({
				componentIdx: 0,
				tableIdx: 5,
				classNameFn: () => Fields,
				createResourceFn: (handle) => {
					let rep = handleTable5[(handle << 1) + 1] % T_OWN;
					let resourceObj = captureTable5.get(rep);
					if (resourceObj) captureTable5.delete(rep);
					else {
						resourceObj = Object.create(Fields.prototype);
						Object.defineProperty(resourceObj, symbolRscHandle, {
							writable: !0,
							value: handle
						});
						Object.defineProperty(resourceObj, symbolRscRep, {
							writable: !0,
							value: rep
						});
					}
					rscTableRemove(_jcoResourceRemoveContext, handleTable5, handle);
					return resourceObj;
				}
			}),
			4,
			4,
			1,
			["i32"]
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2,
		variantPayloadFlatTypes: ["i32"],
		payloadMaybeNull: !1
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			40,
			8,
			8
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [
					[
						"DNS-timeout",
						null,
						0,
						0,
						0
					],
					[
						"DNS-error",
						_lowerFlatRecord({
							fieldMetas: [[
								"rcode",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"infoCode",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU16.bind(void 0, _jcoStrictNumericContext),
										2,
										2,
										1
									]],
									variantSize32: 4,
									variantAlign32: 2,
									variantPayloadOffset32: 2,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								4,
								2
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5
					],
					[
						"destination-not-found",
						null,
						0,
						0,
						0
					],
					[
						"destination-unavailable",
						null,
						0,
						0,
						0
					],
					[
						"destination-IP-prohibited",
						null,
						0,
						0,
						0
					],
					[
						"destination-IP-unroutable",
						null,
						0,
						0,
						0
					],
					[
						"connection-refused",
						null,
						0,
						0,
						0
					],
					[
						"connection-terminated",
						null,
						0,
						0,
						0
					],
					[
						"connection-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-read-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-write-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-limit-reached",
						null,
						0,
						0,
						0
					],
					[
						"TLS-protocol-error",
						null,
						0,
						0,
						0
					],
					[
						"TLS-certificate-error",
						null,
						0,
						0,
						0
					],
					[
						"TLS-alert-received",
						_lowerFlatRecord({
							fieldMetas: [[
								"alertId",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
										1,
										1,
										1
									]],
									variantSize32: 2,
									variantAlign32: 1,
									variantPayloadOffset32: 1,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								2,
								1
							], [
								"alertMessage",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5
					],
					[
						"HTTP-request-denied",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-length-required",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-body-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
								8,
								8,
								1
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						16,
						8,
						2
					],
					[
						"HTTP-request-method-invalid",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-URI-invalid",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-URI-too-long",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-header-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-request-header-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatRecord({
									fieldMetas: [[
										"fieldName",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4
									], [
										"fieldSize",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4
									]],
									size32: 20,
									align32: 4
								}),
								20,
								4,
								5
							]],
							variantSize32: 24,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 6,
							payloadMaybeNull: !1
						}),
						24,
						4,
						6
					],
					[
						"HTTP-request-trailer-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-request-trailer-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-incomplete",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-response-header-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-response-header-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-body-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
								8,
								8,
								1
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						16,
						8,
						2
					],
					[
						"HTTP-response-trailer-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-response-trailer-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-transfer-coding",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					],
					[
						"HTTP-response-content-coding",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					],
					[
						"HTTP-response-timeout",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-upgrade-failed",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-protocol-error",
						null,
						0,
						0,
						0
					],
					[
						"loop-detected",
						null,
						0,
						0,
						0
					],
					[
						"configuration-error",
						null,
						0,
						0,
						0
					],
					[
						"internal-error",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					]
				],
				variantSize32: 32,
				variantAlign32: 8,
				variantPayloadOffset32: 8,
				variantFlatCount: 7
			}),
			40,
			8,
			8
		]],
		variantSize32: 40,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 8
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline45
});
let trampoline46 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 46,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline46.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 11)],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatResult(_jcoStrictNumericContext, {
				caseMetas: [[
					"ok",
					_lowerFlatResult(_jcoStrictNumericContext, {
						caseMetas: [[
							"ok",
							_lowerFlatOwn(_jcoStrictNumericContext, {
								componentIdx: 0,
								tableIdx: 12,
								lowerFn: function lowerImportedOwnedHost_IncomingResponse(obj) {
									if (!(obj instanceof IncomingResponse)) throw TypeError("Resource error: Not a valid \"IncomingResponse\" resource.");
									let handle = obj[symbolRscHandle];
									if (!handle) {
										let rep = (obj[symbolRscRep] ?? ++captureCnt12) >>> 0;
										captureTable12.set(rep, obj);
										handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable12, rep);
									}
									return handle;
								}
							}),
							40,
							8,
							8
						], [
							"err",
							_lowerFlatVariant(_jcoStrictNumericContext, {
								caseMetas: [
									[
										"DNS-timeout",
										null,
										0,
										0,
										0
									],
									[
										"DNS-error",
										_lowerFlatRecord({
											fieldMetas: [[
												"rcode",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"infoCode",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU16.bind(void 0, _jcoStrictNumericContext),
														2,
														2,
														1
													]],
													variantSize32: 4,
													variantAlign32: 2,
													variantPayloadOffset32: 2,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												4,
												2
											]],
											size32: 16,
											align32: 4
										}),
										16,
										4,
										5
									],
									[
										"destination-not-found",
										null,
										0,
										0,
										0
									],
									[
										"destination-unavailable",
										null,
										0,
										0,
										0
									],
									[
										"destination-IP-prohibited",
										null,
										0,
										0,
										0
									],
									[
										"destination-IP-unroutable",
										null,
										0,
										0,
										0
									],
									[
										"connection-refused",
										null,
										0,
										0,
										0
									],
									[
										"connection-terminated",
										null,
										0,
										0,
										0
									],
									[
										"connection-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-read-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-write-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-limit-reached",
										null,
										0,
										0,
										0
									],
									[
										"TLS-protocol-error",
										null,
										0,
										0,
										0
									],
									[
										"TLS-certificate-error",
										null,
										0,
										0,
										0
									],
									[
										"TLS-alert-received",
										_lowerFlatRecord({
											fieldMetas: [[
												"alertId",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
														1,
														1,
														1
													]],
													variantSize32: 2,
													variantAlign32: 1,
													variantPayloadOffset32: 1,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												2,
												1
											], [
												"alertMessage",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											]],
											size32: 16,
											align32: 4
										}),
										16,
										4,
										5
									],
									[
										"HTTP-request-denied",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-length-required",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-body-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
												8,
												8,
												1
											]],
											variantSize32: 16,
											variantAlign32: 8,
											variantPayloadOffset32: 8,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										16,
										8,
										2
									],
									[
										"HTTP-request-method-invalid",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-URI-invalid",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-URI-too-long",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-header-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-request-header-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatRecord({
													fieldMetas: [[
														"fieldName",
														_lowerFlatOption(_jcoStrictNumericContext, {
															caseMetas: [[
																"none",
																null,
																0,
																0,
																0
															], [
																"some",
																_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
																8,
																4,
																2
															]],
															variantSize32: 12,
															variantAlign32: 4,
															variantPayloadOffset32: 4,
															variantFlatCount: 3,
															payloadMaybeNull: !1
														}),
														12,
														4
													], [
														"fieldSize",
														_lowerFlatOption(_jcoStrictNumericContext, {
															caseMetas: [[
																"none",
																null,
																0,
																0,
																0
															], [
																"some",
																_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
																4,
																4,
																1
															]],
															variantSize32: 8,
															variantAlign32: 4,
															variantPayloadOffset32: 4,
															variantFlatCount: 2,
															payloadMaybeNull: !1
														}),
														8,
														4
													]],
													size32: 20,
													align32: 4
												}),
												20,
												4,
												5
											]],
											variantSize32: 24,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 6,
											payloadMaybeNull: !1
										}),
										24,
										4,
										6
									],
									[
										"HTTP-request-trailer-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-request-trailer-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-incomplete",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-response-header-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-response-header-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-body-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
												8,
												8,
												1
											]],
											variantSize32: 16,
											variantAlign32: 8,
											variantPayloadOffset32: 8,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										16,
										8,
										2
									],
									[
										"HTTP-response-trailer-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-response-trailer-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-transfer-coding",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									],
									[
										"HTTP-response-content-coding",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									],
									[
										"HTTP-response-timeout",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-upgrade-failed",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-protocol-error",
										null,
										0,
										0,
										0
									],
									[
										"loop-detected",
										null,
										0,
										0,
										0
									],
									[
										"configuration-error",
										null,
										0,
										0,
										0
									],
									[
										"internal-error",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									]
								],
								variantSize32: 32,
								variantAlign32: 8,
								variantPayloadOffset32: 8,
								variantFlatCount: 7
							}),
							40,
							8,
							8
						]],
						variantSize32: 40,
						variantAlign32: 8,
						variantPayloadOffset32: 8,
						variantFlatCount: 8
					}),
					48,
					8,
					8
				], [
					"err",
					null,
					48,
					8,
					8
				]],
				variantSize32: 48,
				variantAlign32: 8,
				variantPayloadOffset32: 8,
				variantFlatCount: 9
			}),
			48,
			8,
			9
		]],
		variantSize32: 56,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 10,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline46
});
let trampoline47 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 47,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline47.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 5)],
	resultLowerFns: [_lowerFlatList(_jcoLowerListContext, {
		elemLowerFn: _lowerFlatTuple({
			elemLowerMetas: [[
				_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
				8,
				4
			], [
				_lowerFlatList(_jcoLowerListContext, {
					elemLowerFn: _lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
					elemSize32: 1,
					elemAlign32: 1,
					typedArray: Uint8Array
				}),
				8,
				4
			]],
			size32: 16,
			align32: 4
		}),
		elemSize32: 16,
		elemAlign32: 4,
		typedArray: void 0
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline47
});
let trampoline48 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 48,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline48.manuallyAsync,
	paramLiftFns: [_liftFlatList(_jcoLiftListContext, {
		elemLiftFn: _liftFlatTuple({
			elemLiftFns: [[
				_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
				8,
				4
			], [
				_liftFlatList(_jcoLiftListContext, {
					elemLiftFn: _liftFlatU8,
					elemAlign32: 1,
					elemSize32: 1,
					typedArray: Uint8Array
				}),
				8,
				4
			]],
			size32: 16,
			align32: 4
		}),
		elemAlign32: 4,
		elemSize32: 16,
		typedArray: void 0
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 5,
				lowerFn: function lowerImportedOwnedHost_Fields(obj) {
					if (!(obj instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt5) >>> 0;
						captureTable5.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [
					[
						"invalid-syntax",
						null,
						0,
						0,
						0
					],
					[
						"forbidden",
						null,
						0,
						0,
						0
					],
					[
						"immutable",
						null,
						0,
						0,
						0
					]
				],
				variantSize32: 1,
				variantAlign32: 1,
				variantPayloadOffset32: 1,
				variantFlatCount: 1
			}),
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline48
});
let trampoline49 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 49,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline49.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 9,
		classNameFn: () => ResponseOutparam,
		createResourceFn: (handle) => {
			let rep = handleTable9[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable9.get(rep);
			if (resourceObj) captureTable9.delete(rep);
			else {
				resourceObj = Object.create(ResponseOutparam.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable9, handle);
			return resourceObj;
		}
	}), _liftFlatResult(_jcoLiftVariantContext, {
		caseMetas: [[
			"ok",
			_liftFlatOwn({
				componentIdx: 0,
				tableIdx: 13,
				classNameFn: () => OutgoingResponse,
				createResourceFn: (handle) => {
					let rep = handleTable13[(handle << 1) + 1] % T_OWN;
					let resourceObj = captureTable13.get(rep);
					if (resourceObj) captureTable13.delete(rep);
					else {
						resourceObj = Object.create(OutgoingResponse.prototype);
						Object.defineProperty(resourceObj, symbolRscHandle, {
							writable: !0,
							value: handle
						});
						Object.defineProperty(resourceObj, symbolRscRep, {
							writable: !0,
							value: rep
						});
					}
					rscTableRemove(_jcoResourceRemoveContext, handleTable13, handle);
					return resourceObj;
				}
			}),
			4,
			4,
			1,
			["i32"]
		], [
			"err",
			_liftFlatVariant(_jcoLiftVariantContext, {
				caseMetas: [
					[
						"DNS-timeout",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"DNS-error",
						_liftFlatRecord({
							fieldMetas: [[
								"rcode",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
										8,
										4,
										2,
										["i32", "i32"]
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									variantPayloadFlatTypes: ["i32", "i32"],
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"infoCode",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatU16,
										2,
										2,
										1,
										["i32"]
									]],
									variantSize32: 4,
									variantAlign32: 2,
									variantPayloadOffset32: 2,
									variantFlatCount: 2,
									variantPayloadFlatTypes: ["i32"],
									payloadMaybeNull: !1
								}),
								4,
								2
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"destination-not-found",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"destination-unavailable",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"destination-IP-prohibited",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"destination-IP-unroutable",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-refused",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-terminated",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-timeout",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-read-timeout",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-write-timeout",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"connection-limit-reached",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"TLS-protocol-error",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"TLS-certificate-error",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"TLS-alert-received",
						_liftFlatRecord({
							fieldMetas: [[
								"alertId",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatU8,
										1,
										1,
										1,
										["i32"]
									]],
									variantSize32: 2,
									variantAlign32: 1,
									variantPayloadOffset32: 1,
									variantFlatCount: 2,
									variantPayloadFlatTypes: ["i32"],
									payloadMaybeNull: !1
								}),
								2,
								1
							], [
								"alertMessage",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
										8,
										4,
										2,
										["i32", "i32"]
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									variantPayloadFlatTypes: ["i32", "i32"],
									payloadMaybeNull: !1
								}),
								12,
								4
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-request-denied",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-request-length-required",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-request-body-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU64,
								8,
								8,
								1,
								["i64"]
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i64"],
							payloadMaybeNull: !1
						}),
						16,
						8,
						2,
						["i32", "i64"]
					],
					[
						"HTTP-request-method-invalid",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-request-URI-invalid",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-request-URI-too-long",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-request-header-section-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU32,
								4,
								4,
								1,
								["i32"]
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i32"],
							payloadMaybeNull: !1
						}),
						8,
						4,
						2,
						["i32", "i32"]
					],
					[
						"HTTP-request-header-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatRecord({
									fieldMetas: [[
										"fieldName",
										_liftFlatOption(_jcoLiftVariantContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0,
												[]
											], [
												"some",
												_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
												8,
												4,
												2,
												["i32", "i32"]
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											variantPayloadFlatTypes: ["i32", "i32"],
											payloadMaybeNull: !1
										}),
										12,
										4
									], [
										"fieldSize",
										_liftFlatOption(_jcoLiftVariantContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0,
												[]
											], [
												"some",
												_liftFlatU32,
												4,
												4,
												1,
												["i32"]
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											variantPayloadFlatTypes: ["i32"],
											payloadMaybeNull: !1
										}),
										8,
										4
									]],
									size32: 20,
									align32: 4
								}),
								20,
								4,
								5,
								[
									"i32",
									"i32",
									"i32",
									"i32",
									"i32"
								]
							]],
							variantSize32: 24,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 6,
							variantPayloadFlatTypes: [
								"i32",
								"i32",
								"i32",
								"i32",
								"i32"
							],
							payloadMaybeNull: !1
						}),
						24,
						4,
						6,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-request-trailer-section-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU32,
								4,
								4,
								1,
								["i32"]
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i32"],
							payloadMaybeNull: !1
						}),
						8,
						4,
						2,
						["i32", "i32"]
					],
					[
						"HTTP-request-trailer-size",
						_liftFlatRecord({
							fieldMetas: [[
								"fieldName",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
										8,
										4,
										2,
										["i32", "i32"]
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									variantPayloadFlatTypes: ["i32", "i32"],
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatU32,
										4,
										4,
										1,
										["i32"]
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									variantPayloadFlatTypes: ["i32"],
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-response-incomplete",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-response-header-section-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU32,
								4,
								4,
								1,
								["i32"]
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i32"],
							payloadMaybeNull: !1
						}),
						8,
						4,
						2,
						["i32", "i32"]
					],
					[
						"HTTP-response-header-size",
						_liftFlatRecord({
							fieldMetas: [[
								"fieldName",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
										8,
										4,
										2,
										["i32", "i32"]
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									variantPayloadFlatTypes: ["i32", "i32"],
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatU32,
										4,
										4,
										1,
										["i32"]
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									variantPayloadFlatTypes: ["i32"],
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-response-body-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU64,
								8,
								8,
								1,
								["i64"]
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i64"],
							payloadMaybeNull: !1
						}),
						16,
						8,
						2,
						["i32", "i64"]
					],
					[
						"HTTP-response-trailer-section-size",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatU32,
								4,
								4,
								1,
								["i32"]
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							variantPayloadFlatTypes: ["i32"],
							payloadMaybeNull: !1
						}),
						8,
						4,
						2,
						["i32", "i32"]
					],
					[
						"HTTP-response-trailer-size",
						_liftFlatRecord({
							fieldMetas: [[
								"fieldName",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
										8,
										4,
										2,
										["i32", "i32"]
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									variantPayloadFlatTypes: ["i32", "i32"],
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_liftFlatOption(_jcoLiftVariantContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0,
										[]
									], [
										"some",
										_liftFlatU32,
										4,
										4,
										1,
										["i32"]
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									variantPayloadFlatTypes: ["i32"],
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5,
						[
							"i32",
							"i32",
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-response-transfer-coding",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
								8,
								4,
								2,
								["i32", "i32"]
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							variantPayloadFlatTypes: ["i32", "i32"],
							payloadMaybeNull: !1
						}),
						12,
						4,
						3,
						[
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-response-content-coding",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
								8,
								4,
								2,
								["i32", "i32"]
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							variantPayloadFlatTypes: ["i32", "i32"],
							payloadMaybeNull: !1
						}),
						12,
						4,
						3,
						[
							"i32",
							"i32",
							"i32"
						]
					],
					[
						"HTTP-response-timeout",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-upgrade-failed",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"HTTP-protocol-error",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"loop-detected",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"configuration-error",
						null,
						0,
						0,
						0,
						[]
					],
					[
						"internal-error",
						_liftFlatOption(_jcoLiftVariantContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0,
								[]
							], [
								"some",
								_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
								8,
								4,
								2,
								["i32", "i32"]
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							variantPayloadFlatTypes: ["i32", "i32"],
							payloadMaybeNull: !1
						}),
						12,
						4,
						3,
						[
							"i32",
							"i32",
							"i32"
						]
					]
				],
				variantSize32: 32,
				variantAlign32: 8,
				variantPayloadOffset32: 8,
				variantFlatCount: 7,
				variantPayloadFlatTypes: [
					"i32",
					"i64",
					"i32",
					"i32",
					"i32",
					"i32"
				]
			}),
			32,
			8,
			7,
			[
				"i32",
				"i32",
				"i64",
				"i32",
				"i32",
				"i32",
				"i32"
			]
		]],
		variantSize32: 40,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 8,
		variantPayloadFlatTypes: [
			"i32",
			"i32",
			"i64",
			"i32",
			"i32",
			"i32",
			"i32"
		]
	})],
	resultLowerFns: [],
	hasResultPointer: !1,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline49
});
let trampoline50 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 50,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline50.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 7)],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatResult(_jcoStrictNumericContext, {
				caseMetas: [[
					"ok",
					_lowerFlatResult(_jcoStrictNumericContext, {
						caseMetas: [[
							"ok",
							_lowerFlatOption(_jcoStrictNumericContext, {
								caseMetas: [[
									"none",
									null,
									0,
									0,
									0
								], [
									"some",
									_lowerFlatOwn(_jcoStrictNumericContext, {
										componentIdx: 0,
										tableIdx: 5,
										lowerFn: function lowerImportedOwnedHost_Fields(obj) {
											if (!(obj instanceof Fields)) throw TypeError("Resource error: Not a valid \"Fields\" resource.");
											let handle = obj[symbolRscHandle];
											if (!handle) {
												let rep = (obj[symbolRscRep] ?? ++captureCnt5) >>> 0;
												captureTable5.set(rep, obj);
												handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable5, rep);
											}
											return handle;
										}
									}),
									4,
									4,
									1
								]],
								variantSize32: 8,
								variantAlign32: 4,
								variantPayloadOffset32: 4,
								variantFlatCount: 2,
								payloadMaybeNull: !1
							}),
							40,
							8,
							8
						], [
							"err",
							_lowerFlatVariant(_jcoStrictNumericContext, {
								caseMetas: [
									[
										"DNS-timeout",
										null,
										0,
										0,
										0
									],
									[
										"DNS-error",
										_lowerFlatRecord({
											fieldMetas: [[
												"rcode",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"infoCode",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU16.bind(void 0, _jcoStrictNumericContext),
														2,
														2,
														1
													]],
													variantSize32: 4,
													variantAlign32: 2,
													variantPayloadOffset32: 2,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												4,
												2
											]],
											size32: 16,
											align32: 4
										}),
										16,
										4,
										5
									],
									[
										"destination-not-found",
										null,
										0,
										0,
										0
									],
									[
										"destination-unavailable",
										null,
										0,
										0,
										0
									],
									[
										"destination-IP-prohibited",
										null,
										0,
										0,
										0
									],
									[
										"destination-IP-unroutable",
										null,
										0,
										0,
										0
									],
									[
										"connection-refused",
										null,
										0,
										0,
										0
									],
									[
										"connection-terminated",
										null,
										0,
										0,
										0
									],
									[
										"connection-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-read-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-write-timeout",
										null,
										0,
										0,
										0
									],
									[
										"connection-limit-reached",
										null,
										0,
										0,
										0
									],
									[
										"TLS-protocol-error",
										null,
										0,
										0,
										0
									],
									[
										"TLS-certificate-error",
										null,
										0,
										0,
										0
									],
									[
										"TLS-alert-received",
										_lowerFlatRecord({
											fieldMetas: [[
												"alertId",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
														1,
														1,
														1
													]],
													variantSize32: 2,
													variantAlign32: 1,
													variantPayloadOffset32: 1,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												2,
												1
											], [
												"alertMessage",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											]],
											size32: 16,
											align32: 4
										}),
										16,
										4,
										5
									],
									[
										"HTTP-request-denied",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-length-required",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-body-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
												8,
												8,
												1
											]],
											variantSize32: 16,
											variantAlign32: 8,
											variantPayloadOffset32: 8,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										16,
										8,
										2
									],
									[
										"HTTP-request-method-invalid",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-URI-invalid",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-URI-too-long",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-request-header-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-request-header-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatRecord({
													fieldMetas: [[
														"fieldName",
														_lowerFlatOption(_jcoStrictNumericContext, {
															caseMetas: [[
																"none",
																null,
																0,
																0,
																0
															], [
																"some",
																_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
																8,
																4,
																2
															]],
															variantSize32: 12,
															variantAlign32: 4,
															variantPayloadOffset32: 4,
															variantFlatCount: 3,
															payloadMaybeNull: !1
														}),
														12,
														4
													], [
														"fieldSize",
														_lowerFlatOption(_jcoStrictNumericContext, {
															caseMetas: [[
																"none",
																null,
																0,
																0,
																0
															], [
																"some",
																_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
																4,
																4,
																1
															]],
															variantSize32: 8,
															variantAlign32: 4,
															variantPayloadOffset32: 4,
															variantFlatCount: 2,
															payloadMaybeNull: !1
														}),
														8,
														4
													]],
													size32: 20,
													align32: 4
												}),
												20,
												4,
												5
											]],
											variantSize32: 24,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 6,
											payloadMaybeNull: !1
										}),
										24,
										4,
										6
									],
									[
										"HTTP-request-trailer-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-request-trailer-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-incomplete",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-response-header-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-response-header-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-body-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
												8,
												8,
												1
											]],
											variantSize32: 16,
											variantAlign32: 8,
											variantPayloadOffset32: 8,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										16,
										8,
										2
									],
									[
										"HTTP-response-trailer-section-size",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4,
										2
									],
									[
										"HTTP-response-trailer-size",
										_lowerFlatRecord({
											fieldMetas: [[
												"fieldName",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
														8,
														4,
														2
													]],
													variantSize32: 12,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 3,
													payloadMaybeNull: !1
												}),
												12,
												4
											], [
												"fieldSize",
												_lowerFlatOption(_jcoStrictNumericContext, {
													caseMetas: [[
														"none",
														null,
														0,
														0,
														0
													], [
														"some",
														_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
														4,
														4,
														1
													]],
													variantSize32: 8,
													variantAlign32: 4,
													variantPayloadOffset32: 4,
													variantFlatCount: 2,
													payloadMaybeNull: !1
												}),
												8,
												4
											]],
											size32: 20,
											align32: 4
										}),
										20,
										4,
										5
									],
									[
										"HTTP-response-transfer-coding",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									],
									[
										"HTTP-response-content-coding",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									],
									[
										"HTTP-response-timeout",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-upgrade-failed",
										null,
										0,
										0,
										0
									],
									[
										"HTTP-protocol-error",
										null,
										0,
										0,
										0
									],
									[
										"loop-detected",
										null,
										0,
										0,
										0
									],
									[
										"configuration-error",
										null,
										0,
										0,
										0
									],
									[
										"internal-error",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4,
										3
									]
								],
								variantSize32: 32,
								variantAlign32: 8,
								variantPayloadOffset32: 8,
								variantFlatCount: 7
							}),
							40,
							8,
							8
						]],
						variantSize32: 40,
						variantAlign32: 8,
						variantPayloadOffset32: 8,
						variantFlatCount: 8
					}),
					48,
					8,
					8
				], [
					"err",
					null,
					48,
					8,
					8
				]],
				variantSize32: 48,
				variantAlign32: 8,
				variantPayloadOffset32: 8,
				variantFlatCount: 9
			}),
			48,
			8,
			9
		]],
		variantSize32: 56,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 10,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline50
});
let trampoline51 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 51,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline51.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 13)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 4,
				lowerFn: function lowerImportedOwnedHost_OutgoingBody(obj) {
					if (!(obj instanceof OutgoingBody)) throw TypeError("Resource error: Not a valid \"OutgoingBody\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt4) >>> 0;
						captureTable4.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable4, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline51
});
let trampoline52 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 52,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline52.manuallyAsync,
	paramLiftFns: [
		_liftFlatBorrow.bind(null, 5),
		_liftFlatStringAny.bind(void 0, _jcoLiftStringContext),
		_liftFlatList(_jcoLiftListContext, {
			elemLiftFn: _liftFlatU8,
			elemAlign32: 1,
			elemSize32: 1,
			typedArray: Uint8Array
		})
	],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			2,
			1,
			1
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [
					[
						"invalid-syntax",
						null,
						0,
						0,
						0
					],
					[
						"forbidden",
						null,
						0,
						0,
						0
					],
					[
						"immutable",
						null,
						0,
						0,
						0
					]
				],
				variantSize32: 1,
				variantAlign32: 1,
				variantPayloadOffset32: 1,
				variantFlatCount: 1
			}),
			2,
			1,
			1
		]],
		variantSize32: 2,
		variantAlign32: 1,
		variantPayloadOffset32: 1,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline52
});
let trampoline53 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 53,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline53.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatVariant(_jcoStrictNumericContext, {
		caseMetas: [
			[
				"get",
				null,
				0,
				0,
				0
			],
			[
				"head",
				null,
				0,
				0,
				0
			],
			[
				"post",
				null,
				0,
				0,
				0
			],
			[
				"put",
				null,
				0,
				0,
				0
			],
			[
				"delete",
				null,
				0,
				0,
				0
			],
			[
				"connect",
				null,
				0,
				0,
				0
			],
			[
				"options",
				null,
				0,
				0,
				0
			],
			[
				"trace",
				null,
				0,
				0,
				0
			],
			[
				"patch",
				null,
				0,
				0,
				0
			],
			[
				"other",
				_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
				8,
				4,
				2
			]
		],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline53
});
let trampoline54 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 54,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline54.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
			8,
			4,
			2
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline54
});
let trampoline55 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 55,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline55.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [
					[
						"HTTP",
						null,
						0,
						0,
						0
					],
					[
						"HTTPS",
						null,
						0,
						0,
						0
					],
					[
						"other",
						_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
						8,
						4,
						2
					]
				],
				variantSize32: 12,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 3
			}),
			12,
			4,
			3
		]],
		variantSize32: 16,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 4,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline55
});
let trampoline56 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 56,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline56.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
			8,
			4,
			2
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline56
});
let trampoline57 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 57,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline57.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 8)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 6,
				lowerFn: function lowerImportedOwnedHost_IncomingBody(obj) {
					if (!(obj instanceof IncomingBody)) throw TypeError("Resource error: Not a valid \"IncomingBody\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt6) >>> 0;
						captureTable6.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable6, rep);
					}
					return handle;
				}
			}),
			8,
			4,
			4
		], [
			"err",
			null,
			8,
			4,
			4
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline57
});
let trampoline58 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 58,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline58.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 2), _liftFlatList(_jcoLiftListContext, {
		elemLiftFn: _liftFlatU8,
		elemAlign32: 1,
		elemSize32: 1,
		typedArray: Uint8Array
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			12,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			12,
			4,
			4
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline58
});
let trampoline59 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 59,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline59.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 3), _liftFlatU64],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatList(_jcoLowerListContext, {
				elemLowerFn: _lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
				elemSize32: 1,
				elemAlign32: 1,
				typedArray: Uint8Array
			}),
			12,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			12,
			4,
			4
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline59
});
let trampoline60 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 60,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline60.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 3), _liftFlatU64],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatList(_jcoLowerListContext, {
				elemLowerFn: _lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
				elemSize32: 1,
				elemAlign32: 1,
				typedArray: Uint8Array
			}),
			12,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			12,
			4,
			4
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline60
});
let trampoline61 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 61,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline61.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 2)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
			16,
			8,
			8
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			16,
			8,
			8
		]],
		variantSize32: 16,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline61
});
let trampoline62 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 62,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline62.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 2), _liftFlatList(_jcoLiftListContext, {
		elemLiftFn: _liftFlatU8,
		elemAlign32: 1,
		elemSize32: 1,
		typedArray: Uint8Array
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			12,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			12,
			4,
			4
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline62
});
let trampoline63 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 63,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline63.manuallyAsync,
	paramLiftFns: [
		_liftFlatBorrow.bind(null, 2),
		_liftFlatBorrow.bind(null, 3),
		_liftFlatU64
	],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
			16,
			8,
			8
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			16,
			8,
			8
		]],
		variantSize32: 16,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline63
});
let trampoline64 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 64,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline64.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 2)],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			null,
			12,
			4,
			4
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [[
					"last-operation-failed",
					_lowerFlatOwn(_jcoStrictNumericContext, {
						componentIdx: 0,
						tableIdx: 1,
						lowerFn: function lowerImportedOwnedHost_Error$1(obj) {
							if (!(obj instanceof Error$1)) throw TypeError("Resource error: Not a valid \"Error$1\" resource.");
							let handle = obj[symbolRscHandle];
							if (!handle) {
								let rep = (obj[symbolRscRep] ?? ++captureCnt1) >>> 0;
								captureTable1.set(rep, obj);
								handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable1, rep);
							}
							return handle;
						}
					}),
					4,
					4,
					1
				], [
					"closed",
					null,
					0,
					0,
					0
				]],
				variantSize32: 8,
				variantAlign32: 4,
				variantPayloadOffset32: 4,
				variantFlatCount: 2
			}),
			12,
			4,
			4
		]],
		variantSize32: 12,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 3
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline64
});
let trampoline65 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 65,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline65.manuallyAsync,
	paramLiftFns: [_liftFlatBorrow.bind(null, 1)],
	resultLowerFns: [_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext)],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline65
});
let trampoline66 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 66,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline66.manuallyAsync,
	paramLiftFns: [_liftFlatOwn({
		componentIdx: 0,
		tableIdx: 10,
		classNameFn: () => OutgoingRequest,
		createResourceFn: (handle) => {
			let rep = handleTable10[(handle << 1) + 1] % T_OWN;
			let resourceObj = captureTable10.get(rep);
			if (resourceObj) captureTable10.delete(rep);
			else {
				resourceObj = Object.create(OutgoingRequest.prototype);
				Object.defineProperty(resourceObj, symbolRscHandle, {
					writable: !0,
					value: handle
				});
				Object.defineProperty(resourceObj, symbolRscRep, {
					writable: !0,
					value: rep
				});
			}
			rscTableRemove(_jcoResourceRemoveContext, handleTable10, handle);
			return resourceObj;
		}
	}), _liftFlatOption(_jcoLiftVariantContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0,
			[]
		], [
			"some",
			_liftFlatOwn({
				componentIdx: 0,
				tableIdx: 14,
				classNameFn: () => RequestOptions,
				createResourceFn: (handle) => {
					let rep = handleTable14[(handle << 1) + 1] % T_OWN;
					let resourceObj = captureTable14.get(rep);
					if (resourceObj) captureTable14.delete(rep);
					else {
						resourceObj = Object.create(RequestOptions.prototype);
						Object.defineProperty(resourceObj, symbolRscHandle, {
							writable: !0,
							value: handle
						});
						Object.defineProperty(resourceObj, symbolRscRep, {
							writable: !0,
							value: rep
						});
					}
					rscTableRemove(_jcoResourceRemoveContext, handleTable14, handle);
					return resourceObj;
				}
			}),
			4,
			4,
			1,
			["i32"]
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2,
		variantPayloadFlatTypes: ["i32"],
		payloadMaybeNull: !1
	})],
	resultLowerFns: [_lowerFlatResult(_jcoStrictNumericContext, {
		caseMetas: [[
			"ok",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 11,
				lowerFn: function lowerImportedOwnedHost_FutureIncomingResponse(obj) {
					if (!(obj instanceof FutureIncomingResponse)) throw TypeError("Resource error: Not a valid \"FutureIncomingResponse\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt11) >>> 0;
						captureTable11.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable11, rep);
					}
					return handle;
				}
			}),
			40,
			8,
			8
		], [
			"err",
			_lowerFlatVariant(_jcoStrictNumericContext, {
				caseMetas: [
					[
						"DNS-timeout",
						null,
						0,
						0,
						0
					],
					[
						"DNS-error",
						_lowerFlatRecord({
							fieldMetas: [[
								"rcode",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"infoCode",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU16.bind(void 0, _jcoStrictNumericContext),
										2,
										2,
										1
									]],
									variantSize32: 4,
									variantAlign32: 2,
									variantPayloadOffset32: 2,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								4,
								2
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5
					],
					[
						"destination-not-found",
						null,
						0,
						0,
						0
					],
					[
						"destination-unavailable",
						null,
						0,
						0,
						0
					],
					[
						"destination-IP-prohibited",
						null,
						0,
						0,
						0
					],
					[
						"destination-IP-unroutable",
						null,
						0,
						0,
						0
					],
					[
						"connection-refused",
						null,
						0,
						0,
						0
					],
					[
						"connection-terminated",
						null,
						0,
						0,
						0
					],
					[
						"connection-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-read-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-write-timeout",
						null,
						0,
						0,
						0
					],
					[
						"connection-limit-reached",
						null,
						0,
						0,
						0
					],
					[
						"TLS-protocol-error",
						null,
						0,
						0,
						0
					],
					[
						"TLS-certificate-error",
						null,
						0,
						0,
						0
					],
					[
						"TLS-alert-received",
						_lowerFlatRecord({
							fieldMetas: [[
								"alertId",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU8.bind(void 0, _jcoStrictNumericContext),
										1,
										1,
										1
									]],
									variantSize32: 2,
									variantAlign32: 1,
									variantPayloadOffset32: 1,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								2,
								1
							], [
								"alertMessage",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							]],
							size32: 16,
							align32: 4
						}),
						16,
						4,
						5
					],
					[
						"HTTP-request-denied",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-length-required",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-body-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
								8,
								8,
								1
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						16,
						8,
						2
					],
					[
						"HTTP-request-method-invalid",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-URI-invalid",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-URI-too-long",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-request-header-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-request-header-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatRecord({
									fieldMetas: [[
										"fieldName",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
												8,
												4,
												2
											]],
											variantSize32: 12,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 3,
											payloadMaybeNull: !1
										}),
										12,
										4
									], [
										"fieldSize",
										_lowerFlatOption(_jcoStrictNumericContext, {
											caseMetas: [[
												"none",
												null,
												0,
												0,
												0
											], [
												"some",
												_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
												4,
												4,
												1
											]],
											variantSize32: 8,
											variantAlign32: 4,
											variantPayloadOffset32: 4,
											variantFlatCount: 2,
											payloadMaybeNull: !1
										}),
										8,
										4
									]],
									size32: 20,
									align32: 4
								}),
								20,
								4,
								5
							]],
							variantSize32: 24,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 6,
							payloadMaybeNull: !1
						}),
						24,
						4,
						6
					],
					[
						"HTTP-request-trailer-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-request-trailer-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-incomplete",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-response-header-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-response-header-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-body-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
								8,
								8,
								1
							]],
							variantSize32: 16,
							variantAlign32: 8,
							variantPayloadOffset32: 8,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						16,
						8,
						2
					],
					[
						"HTTP-response-trailer-section-size",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
								4,
								4,
								1
							]],
							variantSize32: 8,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 2,
							payloadMaybeNull: !1
						}),
						8,
						4,
						2
					],
					[
						"HTTP-response-trailer-size",
						_lowerFlatRecord({
							fieldMetas: [[
								"fieldName",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
										8,
										4,
										2
									]],
									variantSize32: 12,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 3,
									payloadMaybeNull: !1
								}),
								12,
								4
							], [
								"fieldSize",
								_lowerFlatOption(_jcoStrictNumericContext, {
									caseMetas: [[
										"none",
										null,
										0,
										0,
										0
									], [
										"some",
										_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
										4,
										4,
										1
									]],
									variantSize32: 8,
									variantAlign32: 4,
									variantPayloadOffset32: 4,
									variantFlatCount: 2,
									payloadMaybeNull: !1
								}),
								8,
								4
							]],
							size32: 20,
							align32: 4
						}),
						20,
						4,
						5
					],
					[
						"HTTP-response-transfer-coding",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					],
					[
						"HTTP-response-content-coding",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					],
					[
						"HTTP-response-timeout",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-upgrade-failed",
						null,
						0,
						0,
						0
					],
					[
						"HTTP-protocol-error",
						null,
						0,
						0,
						0
					],
					[
						"loop-detected",
						null,
						0,
						0,
						0
					],
					[
						"configuration-error",
						null,
						0,
						0,
						0
					],
					[
						"internal-error",
						_lowerFlatOption(_jcoStrictNumericContext, {
							caseMetas: [[
								"none",
								null,
								0,
								0,
								0
							], [
								"some",
								_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
								8,
								4,
								2
							]],
							variantSize32: 12,
							variantAlign32: 4,
							variantPayloadOffset32: 4,
							variantFlatCount: 3,
							payloadMaybeNull: !1
						}),
						12,
						4,
						3
					]
				],
				variantSize32: 32,
				variantAlign32: 8,
				variantPayloadOffset32: 8,
				variantFlatCount: 7
			}),
			40,
			8,
			8
		]],
		variantSize32: 40,
		variantAlign32: 8,
		variantPayloadOffset32: 8,
		variantFlatCount: 8
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline66
});
let trampoline67 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 67,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline67.manuallyAsync,
	paramLiftFns: [_liftFlatList(_jcoLiftListContext, {
		elemLiftFn: _liftFlatBorrow.bind(null, 0),
		elemAlign32: 4,
		elemSize32: 4,
		typedArray: void 0
	})],
	resultLowerFns: [_lowerFlatList(_jcoLowerListContext, {
		elemLowerFn: _lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
		elemSize32: 4,
		elemAlign32: 4,
		typedArray: Uint32Array
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline67
});
let trampoline68 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 68,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline68.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatTuple({
		elemLowerMetas: [[
			_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
			8,
			8
		], [
			_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
			8,
			8
		]],
		size32: 16,
		align32: 8
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline68
});
let trampoline69 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 69,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline69.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatList(_jcoLowerListContext, {
		elemLowerFn: _lowerFlatTuple({
			elemLowerMetas: [[
				_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
				8,
				4
			], [
				_lowerFlatStringAny.bind(void 0, _jcoLowerStringContext),
				8,
				4
			]],
			size32: 16,
			align32: 4
		}),
		elemSize32: 16,
		elemAlign32: 4,
		typedArray: void 0
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: () => realloc0,
	importFn: _trampoline69
});
let trampoline70 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 70,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline70.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 15,
				lowerFn: function lowerImportedOwnedHost_TerminalInput(obj) {
					if (!(obj instanceof TerminalInput)) throw TypeError("Resource error: Not a valid \"TerminalInput\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt15) >>> 0;
						captureTable15.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable15, rep);
					}
					return handle;
				}
			}),
			4,
			4,
			1
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline70
});
let trampoline71 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 71,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline71.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 16,
				lowerFn: function lowerImportedOwnedHost_TerminalOutput(obj) {
					if (!(obj instanceof TerminalOutput)) throw TypeError("Resource error: Not a valid \"TerminalOutput\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt16) >>> 0;
						captureTable16.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable16, rep);
					}
					return handle;
				}
			}),
			4,
			4,
			1
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline71
});
let trampoline72 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 72,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline72.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatOption(_jcoStrictNumericContext, {
		caseMetas: [[
			"none",
			null,
			0,
			0,
			0
		], [
			"some",
			_lowerFlatOwn(_jcoStrictNumericContext, {
				componentIdx: 0,
				tableIdx: 16,
				lowerFn: function lowerImportedOwnedHost_TerminalOutput(obj) {
					if (!(obj instanceof TerminalOutput)) throw TypeError("Resource error: Not a valid \"TerminalOutput\" resource.");
					let handle = obj[symbolRscHandle];
					if (!handle) {
						let rep = (obj[symbolRscRep] ?? ++captureCnt16) >>> 0;
						captureTable16.set(rep, obj);
						handle = rscTableCreateOwn(HANDLE_INDEX_SPACES, handleTable16, rep);
					}
					return handle;
				}
			}),
			4,
			4,
			1
		]],
		variantSize32: 8,
		variantAlign32: 4,
		variantPayloadOffset32: 4,
		variantFlatCount: 2,
		payloadMaybeNull: !1
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline72
});
let trampoline73 = _lowerImportBackwardsCompat.bind(null, _jcoTaskCompatImportContext, {
	trampolineIdx: 73,
	componentIdx: 0,
	isAsync: !1,
	isManualAsync: _trampoline73.manuallyAsync,
	paramLiftFns: [],
	resultLowerFns: [_lowerFlatRecord({
		fieldMetas: [[
			"seconds",
			_lowerFlatU64.bind(void 0, _jcoStrictNumericContext),
			8,
			8
		], [
			"nanoseconds",
			_lowerFlatU32.bind(void 0, _jcoStrictNumericContext),
			4,
			4
		]],
		size32: 16,
		align32: 8
	})],
	hasResultPointer: !0,
	funcTypeIsAsync: !1,
	getCallbackFn: () => null,
	getPostReturnFn: () => null,
	isCancellable: !1,
	memoryIdx: 0,
	stringEncoding: "utf8",
	getMemoryFn: () => memory0,
	getReallocFn: void 0,
	importFn: _trampoline73
});
await (() => {
	let gen = (function* _initGenerator() {
		let module0 = fetchCompile(_jcoFetchCompileContext, new URL("./aws_emulator_embedded_console_service.core.wasm", import.meta.url));
		Promise.resolve(module0).catch(() => {});
		let module1 = base64Compile(_jcoBase64CompileContext, "AGFzbQEAAAABSgpgBH9/f38Bf2AFf39/f38Bf2ACf38AYAR/f39/AGADf39/AGAJf39/f35/f39/AGAGf39/f39/AGADf35/AGAEf39+fwBgAX8AAyYlAAEAAAICAgIDAgIEBQICBgICAgICAwcHAgMIAgIDBAkJCQkJCQQFAXABJSUHuwEmATAAAAExAAEBMgACATMAAwE0AAQBNQAFATYABgE3AAcBOAAIATkACQIxMAAKAjExAAsCMTIADAIxMwANAjE0AA4CMTUADwIxNgAQAjE3ABECMTgAEgIxOQATAjIwABQCMjEAFQIyMgAWAjIzABcCMjQAGAIyNQAZAjI2ABoCMjcAGwIyOAAcAjI5AB0CMzAAHgIzMQAfAjMyACACMzMAIQIzNAAiAjM1ACMCMzYAJAgkaW1wb3J0cwEACvUDJQ8AIAAgASACIANBABEAAAsRACAAIAEgAiADIARBAREBAAsPACAAIAEgAiADQQIRAAALDwAgACABIAIgA0EDEQAACwsAIAAgAUEEEQIACwsAIAAgAUEFEQIACwsAIAAgAUEGEQIACwsAIAAgAUEHEQIACw8AIAAgASACIANBCBEDAAsLACAAIAFBCRECAAsLACAAIAFBChECAAsNACAAIAEgAkELEQQACxkAIAAgASACIAMgBCAFIAYgByAIQQwRBQALCwAgACABQQ0RAgALCwAgACABQQ4RAgALEwAgACABIAIgAyAEIAVBDxEGAAsLACAAIAFBEBECAAsLACAAIAFBERECAAsLACAAIAFBEhECAAsLACAAIAFBExECAAsLACAAIAFBFBECAAsPACAAIAEgAiADQRURAwALDQAgACABIAJBFhEHAAsNACAAIAEgAkEXEQcACwsAIAAgAUEYEQIACw8AIAAgASACIANBGREDAAsPACAAIAEgAiADQRoRCAALCwAgACABQRsRAgALCwAgACABQRwRAgALDwAgACABIAIgA0EdEQMACw0AIAAgASACQR4RBAALCQAgAEEfEQkACwkAIABBIBEJAAsJACAAQSERCQALCQAgAEEiEQkACwkAIABBIxEJAAsJACAAQSQRCQALAC8JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQHMC4yNTcuMQ");
		Promise.resolve(module1).catch(() => {});
		let module2 = base64Compile(_jcoBase64CompileContext, "AGFzbQEAAAABTQtgBH9/f38Bf2AFf39/f38Bf2ACf38AYAR/f39/AGADf39/AGAJf39/f35/f39/AGAGf39/f39/AGADf35/AGAEf39+fwBgAX8AYAAAAtkDJwZhY3R1YWwBMAAABmFjdHVhbAExAAEGYWN0dWFsATIAAAZhY3R1YWwBMwAABmFjdHVhbAE0AAIGYWN0dWFsATUAAgZhY3R1YWwBNgACBmFjdHVhbAE3AAIGYWN0dWFsATgAAwZhY3R1YWwBOQACBmFjdHVhbAIxMAACBmFjdHVhbAIxMQAEBmFjdHVhbAIxMgAFBmFjdHVhbAIxMwACBmFjdHVhbAIxNAACBmFjdHVhbAIxNQAGBmFjdHVhbAIxNgACBmFjdHVhbAIxNwACBmFjdHVhbAIxOAACBmFjdHVhbAIxOQACBmFjdHVhbAIyMAACBmFjdHVhbAIyMQADBmFjdHVhbAIyMgAHBmFjdHVhbAIyMwAHBmFjdHVhbAIyNAACBmFjdHVhbAIyNQADBmFjdHVhbAIyNgAIBmFjdHVhbAIyNwACBmFjdHVhbAIyOAACBmFjdHVhbAIyOQADBmFjdHVhbAIzMAAEBmFjdHVhbAIzMQAJBmFjdHVhbAIzMgAJBmFjdHVhbAIzMwAJBmFjdHVhbAIzNAAJBmFjdHVhbAIzNQAJBmFjdHVhbAIzNgAJBG1haW4LX2luaXRpYWxpemUACgRzaGltCCRpbXBvcnRzAXABJSUIASUJKwEAQQALJQABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQALwlwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQENd2l0LWNvbXBvbmVudAcwLjI1Ny4x");
		Promise.resolve(module2).catch(() => {});
		let instanceFlags0 = new WebAssembly.Global({
			value: "i32",
			mutable: !0
		}, 1);
		INSTANCE_FLAGS.set(0, instanceFlags0);
		let _initTask0;
		let _initTaskID0;
		let _initThreadID0;
		try {
			{
				let { task, taskID, threadID } = createNewCurrentImplicitThread(_jcoTaskCreateContext, {
					componentIdx: 0,
					isAsync: !1,
					callingWasmExport: !0,
					entryFnName: "<initialize>"
				});
				_initTask0 = task;
				_initTaskID0 = taskID;
				_initThreadID0 = threadID;
				_setGlobalCurrentThreadMeta(CURRENT_TASK_META, {
					componentIdx: 0,
					taskID,
					threadID
				});
			}
			({exports: exports0} = yield instantiateCore(WebAssembly, yield module1));
			({exports: exports1} = yield instantiateCore(WebAssembly, yield module0, {
				"wasi:cli/environment@0.2.12": { "get-environment": Object.assign(exports0[32], { _jcoMaySuspend: !1 }) },
				"wasi:cli/exit@0.2.12": {
					exit: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline31, !1), { _jcoMaySuspend: !1 }),
					"exit-with-code": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline32, !1), { _jcoMaySuspend: !1 })
				},
				"wasi:cli/stderr@0.2.12": { "get-stderr": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline35, !1), { _jcoMaySuspend: !1 }) },
				"wasi:cli/stdin@0.2.12": { "get-stdin": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline33, !1), { _jcoMaySuspend: !1 }) },
				"wasi:cli/stdout@0.2.12": { "get-stdout": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline34, !1), { _jcoMaySuspend: !1 }) },
				"wasi:cli/terminal-input@0.2.12": { "[resource-drop]terminal-input": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline29), !0), { _jcoMaySuspend: !1 }) },
				"wasi:cli/terminal-output@0.2.12": { "[resource-drop]terminal-output": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline30), !0), { _jcoMaySuspend: !1 }) },
				"wasi:cli/terminal-stderr@0.2.12": { "get-terminal-stderr": Object.assign(exports0[35], { _jcoMaySuspend: !1 }) },
				"wasi:cli/terminal-stdin@0.2.12": { "get-terminal-stdin": Object.assign(exports0[33], { _jcoMaySuspend: !1 }) },
				"wasi:cli/terminal-stdout@0.2.12": { "get-terminal-stdout": Object.assign(exports0[34], { _jcoMaySuspend: !1 }) },
				"wasi:clocks/monotonic-clock@0.2.12": {
					now: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline36, !1), { _jcoMaySuspend: !1 }),
					"subscribe-duration": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline27, !1), { _jcoMaySuspend: !1 })
				},
				"wasi:clocks/wall-clock@0.2.12": { now: Object.assign(exports0[36], { _jcoMaySuspend: !1 }) },
				"wasi:http/outgoing-handler@0.2.12": { handle: Object.assign(exports0[29], { _jcoMaySuspend: !1 }) },
				"wasi:http/types@0.2.12": {
					"[constructor]fields": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline24, !1), { _jcoMaySuspend: !1 }),
					"[constructor]outgoing-request": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline9, !1), { _jcoMaySuspend: !1 }),
					"[constructor]outgoing-response": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline21, !1), { _jcoMaySuspend: !1 }),
					"[method]fields.append": Object.assign(exports0[15], { _jcoMaySuspend: !1 }),
					"[method]fields.entries": Object.assign(exports0[10], { _jcoMaySuspend: !1 }),
					"[method]future-incoming-response.get": Object.assign(exports0[9], { _jcoMaySuspend: !1 }),
					"[method]future-incoming-response.subscribe": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline11, !1), { _jcoMaySuspend: !1 }),
					"[method]future-trailers.get": Object.assign(exports0[13], { _jcoMaySuspend: !1 }),
					"[method]future-trailers.subscribe": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline20, !1), { _jcoMaySuspend: !1 }),
					"[method]incoming-body.stream": Object.assign(exports0[7], { _jcoMaySuspend: !1 }),
					"[method]incoming-request.authority": Object.assign(exports0[19], { _jcoMaySuspend: !1 }),
					"[method]incoming-request.consume": Object.assign(exports0[20], { _jcoMaySuspend: !1 }),
					"[method]incoming-request.headers": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline23, !1), { _jcoMaySuspend: !1 }),
					"[method]incoming-request.method": Object.assign(exports0[16], { _jcoMaySuspend: !1 }),
					"[method]incoming-request.path-with-query": Object.assign(exports0[17], { _jcoMaySuspend: !1 }),
					"[method]incoming-request.scheme": Object.assign(exports0[18], { _jcoMaySuspend: !1 }),
					"[method]incoming-response.consume": Object.assign(exports0[6], { _jcoMaySuspend: !1 }),
					"[method]incoming-response.headers": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline15, !1), { _jcoMaySuspend: !1 }),
					"[method]incoming-response.status": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline14, !1), { _jcoMaySuspend: !1 }),
					"[method]outgoing-body.write": Object.assign(exports0[5], { _jcoMaySuspend: !1 }),
					"[method]outgoing-request.body": Object.assign(exports0[4], { _jcoMaySuspend: !1 }),
					"[method]outgoing-request.set-authority": Object.assign(exports0[2], { _jcoMaySuspend: !1 }),
					"[method]outgoing-request.set-method": Object.assign(exports0[0], { _jcoMaySuspend: !1 }),
					"[method]outgoing-request.set-path-with-query": Object.assign(exports0[3], { _jcoMaySuspend: !1 }),
					"[method]outgoing-request.set-scheme": Object.assign(exports0[1], { _jcoMaySuspend: !1 }),
					"[method]outgoing-response.body": Object.assign(exports0[14], { _jcoMaySuspend: !1 }),
					"[method]outgoing-response.set-status-code": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline22, !1), { _jcoMaySuspend: !1 }),
					"[resource-drop]fields": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline1), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]future-incoming-response": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline17), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]future-trailers": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline4), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]incoming-body": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline3), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]incoming-request": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline5), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]incoming-response": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline16), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]outgoing-body": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline0), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]outgoing-request": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline10), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]outgoing-response": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline18), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]response-outparam": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline6), !0), { _jcoMaySuspend: !1 }),
					"[static]fields.from-list": Object.assign(exports0[11], { _jcoMaySuspend: !1 }),
					"[static]incoming-body.finish": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline19, !1), { _jcoMaySuspend: !1 }),
					"[static]outgoing-body.finish": Object.assign(exports0[8], { _jcoMaySuspend: !1 }),
					"[static]response-outparam.set": Object.assign(exports0[12], { _jcoMaySuspend: !1 })
				},
				"wasi:io/error@0.2.12": {
					"[method]error.to-debug-string": Object.assign(exports0[28], { _jcoMaySuspend: !1 }),
					"[resource-drop]error": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline8), !0), { _jcoMaySuspend: !1 })
				},
				"wasi:io/poll@0.2.12": {
					"[method]pollable.block": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline12, !1), { _jcoMaySuspend: !1 }),
					"[method]pollable.ready": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline28, !1), { _jcoMaySuspend: !1 }),
					"[resource-drop]pollable": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline13), !0), { _jcoMaySuspend: !1 }),
					poll: Object.assign(exports0[30], { _jcoMaySuspend: !1 })
				},
				"wasi:io/streams@0.2.12": {
					"[method]input-stream.blocking-read": Object.assign(exports0[22], { _jcoMaySuspend: !1 }),
					"[method]input-stream.read": Object.assign(exports0[23], { _jcoMaySuspend: !1 }),
					"[method]input-stream.subscribe": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline25, !1), { _jcoMaySuspend: !1 }),
					"[method]output-stream.blocking-flush": Object.assign(exports0[27], { _jcoMaySuspend: !1 }),
					"[method]output-stream.blocking-write-and-flush": Object.assign(exports0[21], { _jcoMaySuspend: !1 }),
					"[method]output-stream.check-write": Object.assign(exports0[24], { _jcoMaySuspend: !1 }),
					"[method]output-stream.splice": Object.assign(exports0[26], { _jcoMaySuspend: !1 }),
					"[method]output-stream.subscribe": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline26, !1), { _jcoMaySuspend: !1 }),
					"[method]output-stream.write": Object.assign(exports0[25], { _jcoMaySuspend: !1 }),
					"[resource-drop]input-stream": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline7), !0), { _jcoMaySuspend: !1 }),
					"[resource-drop]output-stream": Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, _guardMayLeave(_jcoComponentMayLeaveContext, 0, trampoline2), !0), { _jcoMaySuspend: !1 })
				},
				"wasi:random/insecure-seed@0.2.12": { "insecure-seed": Object.assign(exports0[31], { _jcoMaySuspend: !1 }) }
			}));
			memory0 = exports1.memory;
			realloc0 = (oldPtr, oldSize, align, newSize) => exports1.cabi_realloc(oldPtr, oldSize, align, newSize) >>> 0;
			try {
				WebAssembly.promising(exports1.cabi_realloc);
			} catch {}
			({exports: exports2} = yield instantiateCore(WebAssembly, yield module2, (_setGlobalCurrentThreadMeta(CURRENT_TASK_META, {
				componentIdx: 0,
				taskID: _initTaskID0,
				threadID: _initThreadID0
			}), {
				actual: {
					0: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline37, !1), { _jcoMaySuspend: !1 }),
					1: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline38, !1), { _jcoMaySuspend: !1 }),
					10: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline47, !1), { _jcoMaySuspend: !1 }),
					11: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline48, !1), { _jcoMaySuspend: !1 }),
					12: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline49, !1), { _jcoMaySuspend: !1 }),
					13: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline50, !1), { _jcoMaySuspend: !1 }),
					14: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline51, !1), { _jcoMaySuspend: !1 }),
					15: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline52, !1), { _jcoMaySuspend: !1 }),
					16: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline53, !1), { _jcoMaySuspend: !1 }),
					17: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline54, !1), { _jcoMaySuspend: !1 }),
					18: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline55, !1), { _jcoMaySuspend: !1 }),
					19: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline56, !1), { _jcoMaySuspend: !1 }),
					2: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline39, !1), { _jcoMaySuspend: !1 }),
					20: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline57, !1), { _jcoMaySuspend: !1 }),
					21: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline58, !1), { _jcoMaySuspend: !1 }),
					22: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline59, !1), { _jcoMaySuspend: !1 }),
					23: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline60, !1), { _jcoMaySuspend: !1 }),
					24: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline61, !1), { _jcoMaySuspend: !1 }),
					25: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline62, !1), { _jcoMaySuspend: !1 }),
					26: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline63, !1), { _jcoMaySuspend: !1 }),
					27: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline64, !1), { _jcoMaySuspend: !1 }),
					28: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline65, !1), { _jcoMaySuspend: !1 }),
					29: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline66, !1), { _jcoMaySuspend: !1 }),
					3: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline40, !1), { _jcoMaySuspend: !1 }),
					30: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline67, !1), { _jcoMaySuspend: !1 }),
					31: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline68, !1), { _jcoMaySuspend: !1 }),
					32: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline69, !1), { _jcoMaySuspend: !1 }),
					33: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline70, !1), { _jcoMaySuspend: !1 }),
					34: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline71, !1), { _jcoMaySuspend: !1 }),
					35: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline72, !1), { _jcoMaySuspend: !1 }),
					36: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline73, !1), { _jcoMaySuspend: !1 }),
					4: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline41, !1), { _jcoMaySuspend: !1 }),
					5: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline42, !1), { _jcoMaySuspend: !1 }),
					6: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline43, !1), { _jcoMaySuspend: !1 }),
					7: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline44, !1), { _jcoMaySuspend: !1 }),
					8: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline45, !1), { _jcoMaySuspend: !1 }),
					9: Object.assign(_guardTrap(_jcoComponentRecordTrapContext, 0, trampoline46, !1), { _jcoMaySuspend: !1 })
				},
				main: { _initialize: Object.assign(exports1._initialize, { _jcoMaySuspend: !1 }) },
				shim: { $imports: exports0.$imports }
			})));
		} finally {
			_clearCurrentTask(CURRENT_TASK_META, {
				componentIdx: 0,
				taskID: _initTaskID0,
				threadID: _initThreadID0
			});
			if (_initTask0) {
				_initTask0.resolve([]);
				_initTask0.exit({ skipExclusiveLockCheck: !0 });
			}
		}
		incomingHandler0212Handle = exports1["wasi:http/incoming-handler@0.2.12#handle"];
	})();
	let promise, resolve, reject;
	function normalizeInstantiationError(e) {
		if (typeof WebAssembly < "u" && typeof WebAssembly.SuspendError == "function" && e instanceof WebAssembly.SuspendError) return new WebAssembly.RuntimeError("cannot block a synchronous task before returning");
		return e;
	}
	function runNext(value) {
		try {
			let done;
			do
				({value, done} = gen.next(value));
			while (!(value instanceof Promise) && !done);
			if (done) {
				if (resolve) resolve(value);
				else return value;
			}
			promise ||= new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
			value.then(runNext, (e) => reject(normalizeInstantiationError(e)));
		} catch (e) {
			e = normalizeInstantiationError(e);
			if (reject) reject(e);
			else throw e;
		}
	}
	let maybeSyncReturn = runNext(null);
	return promise || maybeSyncReturn;
})();
const incomingHandler0212 = { handle: handle$1 };
export { incomingHandler0212 as incomingHandler, incomingHandler0212 as "wasi:http/incoming-handler@0.2.12" };
export const _util = {
	stop: _stopInstance.bind(void 0, _jcoComponentStopContext),
	whenIdle: _whenIdle.bind(void 0, _jcoComponentIdleContext)
};
