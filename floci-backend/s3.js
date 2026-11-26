// \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = {
	WHEN_SUPPORTED: "WHEN_SUPPORTED",
	WHEN_REQUIRED: "WHEN_REQUIRED"
}, i = r.WHEN_SUPPORTED, a = {
	WHEN_SUPPORTED: "WHEN_SUPPORTED",
	WHEN_REQUIRED: "WHEN_REQUIRED"
}, o = r.WHEN_SUPPORTED, s;
(function(e) {
	e.MD5 = "MD5", e.CRC32 = "CRC32", e.CRC32C = "CRC32C", e.CRC64NVME = "CRC64NVME", e.SHA1 = "SHA1", e.SHA256 = "SHA256";
})(s ||= {});
var c;
(function(e) {
	e.HEADER = "header", e.TRAILER = "trailer";
})(c ||= {});
var l = s.CRC32;
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function u(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/isStreamingPayload/isStreamingPayload.browser.js
var d = (e) => e?.body instanceof ReadableStream, f = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, p = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, m = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => h[t.step] - h[e.step] || g[t.priority || "normal"] - g[e.priority || "normal"]), a = (n) => {
		let i = !1, a = (e) => {
			let t = f(e.name, e.aliases);
			if (t.includes(n)) {
				i = !0;
				for (let e of t) r.delete(e);
				return !1;
			}
			return !0;
		};
		return e = e.filter(a), t = t.filter(a), i;
	}, o = (n) => {
		let i = !1, a = (e) => {
			if (e.middleware === n) {
				i = !0;
				for (let t of f(e.name, e.aliases)) r.delete(t);
				return !1;
			}
			return !0;
		};
		return e = e.filter(a), t = t.filter(a), i;
	}, s = (n) => (e.forEach((e) => {
		n.add(e.middleware, { ...e });
	}), t.forEach((e) => {
		n.addRelativeTo(e.middleware, { ...e });
	}), n.identifyOnResolve?.(u.identifyOnResolve()), n), c = (e) => {
		let t = [];
		return e.before.forEach((e) => {
			e.before.length === 0 && e.after.length === 0 ? t.push(e) : t.push(...c(e));
		}), t.push(e), e.after.reverse().forEach((e) => {
			e.before.length === 0 && e.after.length === 0 ? t.push(e) : t.push(...c(e));
		}), t;
	}, l = (n = !1) => {
		let r = [], a = [], o = {};
		return e.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of f(t.name, t.aliases)) o[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of f(t.name, t.aliases)) o[e] = t;
			a.push(t);
		}), a.forEach((e) => {
			if (e.toMiddleware) {
				let t = o[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${p(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
				}
				e.relation === "after" && t.after.push(e), e.relation === "before" && t.before.push(e);
			}
		}), i(r).map(c).reduce((e, t) => (e.push(...t), e), []);
	}, u = {
		add: (t, n = {}) => {
			let { name: i, override: a, aliases: o } = n, s = {
				step: "initialize",
				priority: "normal",
				middleware: t,
				...n
			}, c = f(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${p(i, o)}'`);
					for (let t of c) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== s.step || s.priority !== r.priority) throw Error(`"${p(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${p(i, o)}" middleware with ${s.priority} priority in ${s.step} step.`);
						e.splice(n, 1);
					}
				}
				for (let e of c) r.add(e);
			}
			e.push(s);
		},
		addRelativeTo: (e, n) => {
			let { name: i, override: a, aliases: o } = n, s = {
				middleware: e,
				...n
			}, c = f(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${p(i, o)}'`);
					for (let e of c) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== s.toMiddleware || r.relation !== s.relation) throw Error(`"${p(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${p(i, o)}" middleware ${s.relation} "${s.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of c) r.add(e);
			}
			t.push(s);
		},
		clone: () => s(m()),
		use: (e) => {
			e.applyToStack(u);
		},
		remove: (e) => typeof e == "string" ? a(e) : o(e),
		removeByTag: (n) => {
			let i = !1, a = (e) => {
				let { tags: t, name: a, aliases: o } = e;
				if (t && t.includes(n)) {
					let e = f(a, o);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(a), t = t.filter(a), i;
		},
		concat: (e) => {
			let t = s(m());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: s,
		identify: () => l(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return p(e.name, e.aliases) + " - " + t;
		}),
		identifyOnResolve(e) {
			return typeof e == "boolean" && (n = e), n;
		},
		resolve: (e, t) => {
			for (let n of l().map((e) => e.middleware).reverse()) e = n(e, t);
			return n && console.log(u.identify()), e;
		}
	};
	return u;
}, h = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, g = {
	high: 3,
	normal: 2,
	low: 1
}, ee, te = t((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(ee ||= {});
})), ne, re = t((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(ne ||= {});
})), ie = t((() => {
	re();
})), ae, oe = t((() => {
	ae = "__smithy_context";
})), se = t((() => {
	te(), ie(), oe();
})), ce, le = t((() => {
	se(), ce = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function _(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var ue = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function de(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var v, y = t((() => {
	v = class e {
		method;
		protocol;
		hostname;
		port;
		path;
		query;
		headers;
		username;
		password;
		fragment;
		body;
		constructor(e) {
			this.method = e.method || "GET", this.hostname = e.hostname || "localhost", this.port = e.port, this.query = e.query || {}, this.headers = e.headers || {}, this.body = e.body, this.protocol = e.protocol ? e.protocol.slice(-1) === ":" ? e.protocol : `${e.protocol}:` : "https:", this.path = e.path ? e.path.charAt(0) === "/" ? e.path : `/${e.path}` : "/", this.username = e.username, this.password = e.password, this.fragment = e.fragment;
		}
		static clone(t) {
			let n = new e({
				...t,
				headers: { ...t.headers }
			});
			return n.query &&= de(n.query), n;
		}
		static isInstance(e) {
			if (!e) return !1;
			let t = e;
			return "method" in t && "protocol" in t && "hostname" in t && "path" in t && typeof t.query == "object" && typeof t.headers == "object";
		}
		clone() {
			return e.clone(this);
		}
	};
})), fe, pe = t((() => {
	fe = class {
		statusCode;
		reason;
		headers;
		body;
		constructor(e) {
			this.statusCode = e.statusCode, this.reason = e.reason, this.headers = e.headers || {}, this.body = e.body;
		}
		static isInstance(e) {
			if (!e) return !1;
			let t = e;
			return typeof t.statusCode == "number" && typeof t.headers == "object";
		}
	};
})), me, he, ge = t((() => {
	me = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), he = (e, t = !1) => {
		if (!t) return me.test(e);
		let n = e.split(".");
		for (let e of n) if (!he(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function _e(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var ve = t((() => {})), ye, be = t((() => {
	ye = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function xe(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var Se = t((() => {})), Ce, we = t((() => {
	Se(), Ce = (e) => {
		if (typeof e == "string") return Ce(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = xe(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), Te, Ee = t((() => {
	ue(), we(), Te = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = Ce(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) _(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return Ce(e);
	};
})), b = t((() => {
	le(), ue(), y(), pe(), ge(), ve(), be(), we(), Ee();
})), De = (e) => () => Promise.reject(e), Oe = class {
	config;
	middlewareStack = m();
	initConfig;
	handlers;
	constructor(e) {
		this.config = e;
		let { protocol: t, protocolSettings: n } = e;
		n && typeof t == "function" && (e.protocol = new t(n));
	}
	send(e, t, n) {
		let r = typeof t == "function" ? void 0 : t, i = typeof t == "function" ? t : n, a = r === void 0 && this.config.cacheMiddleware === !0, o;
		if (a) {
			this.handlers ||= /* @__PURE__ */ new WeakMap();
			let t = this.handlers;
			t.has(e.constructor) ? o = t.get(e.constructor) : (o = e.resolveMiddleware(this.middlewareStack, this.config, r), t.set(e.constructor, o));
		} else delete this.handlers, o = e.resolveMiddleware(this.middlewareStack, this.config, r);
		if (i) o(e).then((e) => i(null, e.output), (e) => i(e)).catch(() => {});
		else return o(e).then((e) => e.output);
	}
	destroy() {
		this.config?.requestHandler?.destroy?.(), delete this.handlers;
	}
}, ke, Ae = t((() => {
	ke = (e) => typeof e == "function" ? e() : e;
})), je, Me = t((() => {
	je = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), Ne, Pe, Fe = t((() => {
	b(), Me(), Ne = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = ce(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(je(o, s, c, l, u), {
					...e,
					...n
				}, i)
			};
		} catch (e) {
			if (Object.defineProperty(e, "$response", {
				value: i,
				enumerable: !1,
				writable: !1,
				configurable: !1
			}), !("$metadata" in e)) {
				let t = "Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.";
				try {
					e.message += "\n  " + t;
				} catch {
					!n.logger || n.logger?.constructor?.name === "NoOpLogger" ? console.warn(t) : n.logger?.warn?.(t);
				}
				e.$responseBodyText !== void 0 && e.$response && (e.$response.body = e.$responseBodyText);
				try {
					if (fe.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Pe(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Pe(/^x-[\w-]+-id-2$/, r),
							cfId: Pe(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Pe = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), Ie, Le = t((() => {
	b(), Me(), Ie = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = ce(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => Te(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(je(a, o, s, c, l), r.input, {
			...e,
			...n,
			endpoint: u
		});
		return t({
			...r,
			request: d
		});
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/middleware/getSchemaSerdePlugin.js
function Re(e) {
	return { applyToStack: (t) => {
		t.add(Ie(e), Be), t.add(Ne(e), ze), e.protocol.setSerdeContext(e);
	} };
}
var ze, Be, Ve = t((() => {
	Fe(), Le(), ze = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Be = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function He(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Ue[e]) return Ue[e];
	let t = {}, n = 0;
	for (let r of [
		"httpLabel",
		"idempotent",
		"idempotencyToken",
		"sensitive",
		"httpPayload",
		"httpResponseCode",
		"httpQueryParams"
	]) (e >> n++ & 1) == 1 && (t[r] = 1);
	return Ue[e] = t;
}
var Ue, We = t((() => {
	Ue = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function Ge(e, t) {
	return e instanceof x ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new x(e, t);
}
var Ke, qe, Je, x, Ye, Xe, Ze = t((() => {
	Ae(), We(), Ke = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, qe = [], Je = {}, x = class e {
		ref;
		memberName;
		static symbol = Symbol.for("@smithy/nor");
		symbol = e.symbol;
		name;
		schema;
		_isMemberSchema;
		traits;
		memberTraits;
		normalizedTraits;
		constructor(t, n) {
			this.ref = t, this.memberName = n;
			let r = [], i = t, a = t;
			for (this._isMemberSchema = !1; Ye(i);) r.push(i[1]), i = i[0], a = ke(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, He(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = ke(a), Xe(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (qe[t]) return qe[t];
			} else if (typeof t == "string") {
				if (Je[t]) return Je[t];
			} else if (n && t[Ke.ns]) return t[Ke.ns];
			let r = ke(t);
			if (r instanceof e) return r;
			if (Ye(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), He(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Ke.ns] = i : typeof r == "string" ? Je[r] = i : typeof r == "number" ? qe[r] = i : i;
		}
		getSchema() {
			let e = this.schema;
			return Array.isArray(e) && e[0] === 0 ? e[4] : e;
		}
		getName(e = !1) {
			let { name: t } = this;
			return !e && t && t.includes("#") ? t.split("#")[1] : t || void 0;
		}
		getMemberName() {
			return this.memberName;
		}
		isMemberSchema() {
			return this._isMemberSchema;
		}
		isListSchema() {
			let e = this.getSchema();
			return typeof e == "number" ? e >= 64 && e < 128 : e[0] === 1;
		}
		isMapSchema() {
			let e = this.getSchema();
			return typeof e == "number" ? e >= 128 && e <= 255 : e[0] === 2;
		}
		isStructSchema() {
			let e = this.getSchema();
			if (typeof e != "object") return !1;
			let t = e[0];
			return t === 3 || t === -3 || t === 4;
		}
		isUnionSchema() {
			let e = this.getSchema();
			return typeof e == "object" && e[0] === 4;
		}
		isBlobSchema() {
			let e = this.getSchema();
			return e === 21 || e === 42;
		}
		isTimestampSchema() {
			let e = this.getSchema();
			return typeof e == "number" && e >= 4 && e <= 7;
		}
		isUnitSchema() {
			return this.getSchema() === "unit";
		}
		isDocumentSchema() {
			return this.getSchema() === 15;
		}
		isStringSchema() {
			return this.getSchema() === 0;
		}
		isBooleanSchema() {
			return this.getSchema() === 2;
		}
		isNumericSchema() {
			return this.getSchema() === 1;
		}
		isBigIntegerSchema() {
			return this.getSchema() === 17;
		}
		isBigDecimalSchema() {
			return this.getSchema() === 19;
		}
		isStreaming() {
			let { streaming: e } = this.getMergedTraits();
			return !!e || this.getSchema() === 42;
		}
		isIdempotencyToken() {
			return !!this.getMergedTraits().idempotencyToken;
		}
		getMergedTraits() {
			return this.normalizedTraits ??= {
				...this.getOwnTraits(),
				...this.getMemberTraits()
			};
		}
		getMemberTraits() {
			return He(this.memberTraits);
		}
		getOwnTraits() {
			return He(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return Ge([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return Ge([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return Ge(Ye(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return Ge([15, 0], e);
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no member=${e}.`);
		}
		getMemberSchemas() {
			let e = {};
			try {
				for (let [t, n] of this.structIterator()) e[t] = n;
			} catch {}
			return e;
		}
		getEventStreamMember() {
			if (this.isStructSchema()) {
				for (let [e, t] of this.structIterator()) if (t.isStreaming() && t.isStructSchema()) return e;
			}
			return "";
		}
		*structIterator() {
			if (this.isUnitSchema()) return;
			if (!this.isStructSchema()) throw Error("@smithy/core/schema - cannot iterate non-struct schema.");
			let e = this.getSchema(), t = e[4].length, n = e[Ke.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = Ge([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Ke.it] = n;
			}
		}
	}, Ye = (e) => Array.isArray(e) && e.length === 2, Xe = (e) => Array.isArray(e) && e.length >= 5;
})), Qe, $e = t((() => {
	Qe = class e {
		namespace;
		schemas;
		exceptions;
		static registries = /* @__PURE__ */ new Map();
		constructor(t, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map()) {
			this.namespace = t, this.schemas = n, this.exceptions = r, e.registries.has(t) || e.registries.set(t, this);
		}
		static for(t) {
			return e.registries.get(t) ?? new e(t);
		}
		copyFrom(e) {
			let { schemas: t, exceptions: n } = this;
			for (let [n, r] of e.schemas) t.has(n) || t.set(n, r);
			for (let [t, r] of e.exceptions) n.has(t) || n.set(t, r);
		}
		register(t, n) {
			let r = this.normalizeShapeId(t);
			for (let t of [this, e.for(r.split("#")[0])]) t.schemas.has(r) || t.schemas.set(r, n);
		}
		getSchema(e) {
			let t = this.normalizeShapeId(e);
			if (!this.schemas.has(t)) {
				if (!e.includes("#")) {
					let t = "#" + e, n = [];
					for (let [e, r] of this.schemas.entries()) e.endsWith(t) && n.push(r);
					if (n.length === 1) return n[0];
				}
				throw Error(`@smithy/core/schema - schema not found for ${t}`);
			}
			return this.schemas.get(t);
		}
		registerError(t, n) {
			let r = t, i = r[1], a = i + "#" + r[2];
			n.hasOwnProperty?.("shapeId") || (n.shapeId = a);
			for (let t of [this, e.for(i)]) !t.schemas.has(a) && !t.exceptions.has(r) && (t.schemas.set(a, r), t.exceptions.set(r, n));
		}
		getErrorCtor(t) {
			let n = t;
			return this.exceptions.has(n) ? this.exceptions.get(n) : e.for(n[1]).exceptions.get(n);
		}
		getBaseException() {
			for (let e of this.exceptions.keys()) if (Array.isArray(e)) {
				let [, t, n] = e, r = t + "#" + n;
				if (r.startsWith("smithy.ts.sdk.synthetic.") && r.endsWith("ServiceException")) return e;
			}
		}
		find(e) {
			for (let t of this.schemas.values()) if (e(t)) return t;
		}
		clear() {
			this.schemas.clear(), this.exceptions.clear();
		}
		normalizeShapeId(e) {
			return e.includes("#") ? e : this.namespace + "#" + e;
		}
	};
})), S = t((() => {
	Ae(), Ve(), Me(), Ze(), We(), $e();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
S();
var et = "***SensitiveInformation***";
function tt(e, t) {
	if (t == null) return t;
	let n = x.of(e);
	if (n.getMergedTraits().sensitive) return et;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return et;
		if (Array.isArray(t)) return t.map((t) => tt(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return et;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, tt(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = tt(i, e[t]));
		return r;
	}
	return t;
}
se(), S();
var nt = Symbol.for("@smithy/op-event-stream"), rt = class {
	middlewareStack = m();
	schema;
	static classBuilder() {
		return new it();
	}
	resolveMiddlewareWithContext(e, t, n, { middlewareFn: r, clientName: i, commandName: a, inputFilterSensitiveLog: o, outputFilterSensitiveLog: s, smithyContext: c, additionalContext: l, CommandCtor: u }) {
		for (let i of r.bind(this)(u, e, t, n)) this.middlewareStack.use(i);
		let d = e.concat(this.middlewareStack), { logger: f } = t, p = l[ae], m = {
			logger: f,
			clientName: i,
			commandName: a,
			inputFilterSensitiveLog: o,
			outputFilterSensitiveLog: s,
			...l,
			[ae]: {
				...p,
				commandInstance: this,
				...c,
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
			}
		}, { requestHandler: h } = t, g = n ?? {};
		g.metricsRecorder && (g = { ...g }, delete g.metricsRecorder);
		let ee, te = this.schema, ne = te?.[nt];
		if (ne !== void 0) ee = ne;
		else if (te && Array.isArray(te) && te[0] === 9) {
			let [, , , , e, t] = te;
			ee = te[nt] = !!(x.of(e).getEventStreamMember() || x.of(t).getEventStreamMember());
		}
		return ee && (g = {
			isEventStream: ee,
			...g
		}), d.resolve((e) => h.handle(e.request, g), m);
	}
}, it = class {
	_init = () => {};
	_ep = {};
	_middlewareFn = () => [];
	_commandName = "";
	_clientName = "";
	_additionalContext = {};
	_smithyContext = {};
	_inputFilterSensitiveLog = void 0;
	_outputFilterSensitiveLog = void 0;
	_serializer = null;
	_deserializer = null;
	_operationSchema;
	init(e) {
		this._init = e;
	}
	ep(e) {
		return this._ep = e, this;
	}
	m(e) {
		return this._middlewareFn = e, this;
	}
	s(e, t, n = {}) {
		return this._smithyContext = {
			service: e,
			operation: t,
			...n
		}, this;
	}
	c(e = {}) {
		return this._additionalContext = e, this;
	}
	n(e, t) {
		return this._clientName = e, this._commandName = t, this;
	}
	f(e = (e) => e, t = (e) => e) {
		return this._inputFilterSensitiveLog = e, this._outputFilterSensitiveLog = t, this;
	}
	ser(e) {
		return this._serializer = e, this;
	}
	de(e) {
		return this._deserializer = e, this;
	}
	sc(e) {
		return this._operationSchema = e, this._smithyContext.operationSchema = e, this;
	}
	build() {
		let e = this, t;
		return t = class extends rt {
			input;
			static getEndpointParameterInstructions() {
				return e._ep;
			}
			constructor(...[t]) {
				super(), this.input = t ?? {}, e._init(this), this.schema = e._operationSchema;
			}
			resolveMiddleware(n, r, i) {
				let a = e._operationSchema, o = a?.[4] ?? a?.input, s = a?.[5] ?? a?.output;
				return this.resolveMiddlewareWithContext(n, r, i, {
					CommandCtor: t,
					middlewareFn: e._middlewareFn,
					clientName: e._clientName,
					commandName: e._commandName,
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? tt.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? tt.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, at = class e extends Error {
	static shapeId = "smithy.ts.sdk.synthetic.nonamespace.client#ServiceException";
	$fault;
	$response;
	$retryable;
	$metadata;
	constructor(e) {
		super(e.message), Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = e.name, this.$fault = e.$fault, this.$metadata = e.$metadata;
	}
	static isInstance(t) {
		if (!t) return !1;
		let n = t;
		return e.prototype.isPrototypeOf(n) || !!n.$fault && !!n.$metadata && (n.$fault === "client" || n.$fault === "server");
	}
	static [Symbol.hasInstance](t) {
		if (!t) return !1;
		let n = t;
		if (this === e) return e.isInstance(t);
		if (e.isInstance(t)) {
			if (this.prototype.isPrototypeOf(t)) return !0;
			let r = Object.prototype.hasOwnProperty.call(this, "shapeId") ? this.shapeId : void 0, i = !1;
			if (r) {
				let t = Object.getPrototypeOf(n);
				for (; t && t !== Object.prototype;) {
					let n = t.constructor, a = n !== e && Object.prototype.hasOwnProperty.call(n, "shapeId") ? n?.shapeId : void 0;
					if (a && (i = !0, a === r)) return !0;
					t = Object.getPrototypeOf(t);
				}
			}
			if (r && i) return !1;
			let a = this.name;
			if (a && a.length >= 6) {
				if (n.name === a) return !0;
				let e = Object.getPrototypeOf(n);
				for (; e && e !== Object.prototype;) {
					let t = e.constructor?.name;
					if (t && t !== "Error" && t === a) return !0;
					e = Object.getPrototypeOf(e);
				}
			}
		}
		return !1;
	}
}, ot = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), st = (e) => {
	switch (e) {
		case "standard": return {
			retryMode: "standard",
			connectionTimeout: 3100
		};
		case "in-region": return {
			retryMode: "standard",
			connectionTimeout: 1100
		};
		case "cross-region": return {
			retryMode: "standard",
			connectionTimeout: 3100
		};
		case "mobile": return {
			retryMode: "standard",
			connectionTimeout: 3e4
		};
		default: return {};
	}
};
b(), se();
var ct = Object.values(ne), lt = (e) => {
	let t = [];
	for (let n in ne) {
		if (!_(ne, n)) continue;
		let r = ne[n];
		e[r] !== void 0 && t.push({
			algorithmId: () => r,
			checksumConstructor: () => e[r]
		});
	}
	for (let [n, r] of Object.entries(e.checksumAlgorithms ?? {})) t.push({
		algorithmId: () => n,
		checksumConstructor: () => r
	});
	return {
		addChecksumAlgorithm(n) {
			e.checksumAlgorithms = e.checksumAlgorithms ?? {};
			let r = n.algorithmId(), i = n.checksumConstructor();
			ct.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, ut = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		ct.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, dt = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), ft = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, pt = (e) => Object.assign(lt(e), dt(e)), mt = (e) => Object.assign(ut(e), ft(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/get-value-from-text-node.js
b();
var ht = (e) => {
	let t = "#text";
	for (let n in e) _(e, n) && (e[n][t] === void 0 ? typeof e[n] == "object" && e[n] !== null && (e[n] = ht(e[n])) : e[n] = e[n][t]);
	return e;
}, gt = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function _t(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return rt.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var vt, yt, bt, xt = t((() => {
	vt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", yt = Object.entries(vt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), bt = vt.split("");
})), St, Ct = t((() => {
	xt(), St = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in yt)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= yt[e[r]] << (a - r) * 6, i += 6;
			} else n >>= 6;
			let a = t / 4 * 3;
			n >>= i % 8;
			let o = Math.floor(i / 8);
			for (let e = 0; e < o; e++) {
				let t = (o - e - 1) * 8;
				r.setUint8(a + e, (n & 255 << t) >> t);
			}
		}
		return new Uint8Array(n);
	};
})), wt, Tt = t((() => {
	wt = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function Et(e) {
	let t;
	t = typeof e == "string" ? wt(e) : e;
	let n = typeof t == "object" && typeof t.length == "number", r = typeof t == "object" && typeof t.byteOffset == "number" && typeof t.byteLength == "number";
	if (!n && !r) throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
	let i = "";
	for (let e = 0; e < t.length; e += 3) {
		let n = 0, r = 0;
		for (let i = e, a = Math.min(e + 3, t.length); i < a; i++) n |= t[i] << (a - i - 1) * 8, r += 8;
		let a = Math.ceil(r / 6);
		n <<= a * 6 - r;
		for (let e = 1; e <= a; e++) {
			let t = (a - e) * 6;
			i += bt[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var Dt = t((() => {
	Tt(), xt();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function Ot(e, t, n, r) {
	return class i extends Uint8Array {
		static fromString(e, n = "utf-8") {
			if (typeof e == "string") return n === "base64" ? i.mutate(r(e)) : i.mutate(t(e));
			throw Error(`Unsupported conversion from ${typeof e} to Uint8ArrayBlobAdapter.`);
		}
		static mutate(e) {
			return Object.setPrototypeOf(e, i.prototype), e;
		}
		transformToString(t = "utf-8") {
			return t === "base64" ? n(this) : e(this);
		}
	};
}
var kt = t((() => {})), At, jt = t((() => {
	At = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Mt(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, C[t[0]] + C[t[1]] + C[t[2]] + C[t[3]] + "-" + C[t[4]] + C[t[5]] + "-" + C[t[6]] + C[t[7]] + "-" + C[t[8]] + C[t[9]] + "-" + C[t[10]] + C[t[11]] + C[t[12]] + C[t[13]] + C[t[14]] + C[t[15]];
	};
}
var C, Nt = t((() => {
	C = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt = t((() => {
	Pt = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && Jt.warn(qt(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, Ft = Math.ceil(2 ** 127 * (2 - 2 ** -23)), It = (e) => {
		let t = Pt(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > Ft) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Lt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Rt = (e) => Bt(e, 16), zt = (e) => Bt(e, 8), Bt = (e, t) => {
		let n = Lt(e);
		if (n !== void 0 && Vt(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Vt = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Ht = (e) => It(typeof e == "string" ? Wt(e) : e), Ut = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Wt = (e) => {
		let t = e.match(Ut);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, Gt = (e) => Rt(typeof e == "string" ? Wt(e) : e), Kt = (e) => zt(typeof e == "string" ? Wt(e) : e), qt = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), Jt = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function Xt(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Zt[r]}, ${c} ${Qt[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln, un, dn, fn, pn, mn, hn = t((() => {
	Yt(), Zt = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], Qt = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	], $t = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), en = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), tn = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), nn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = $t.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rn(Gt(mn(i)), cn(r), fn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = en.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return sn(rn(an(i), cn(r), fn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = tn.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rn(Gt(mn(c)), cn(n), fn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, rn = (e, t, n, r) => {
		let i = t - 1;
		return un(e, i, n), new Date(Date.UTC(e, i, n, fn(r.hours, "hour", 0, 23), fn(r.minutes, "minute", 0, 59), fn(r.seconds, "seconds", 0, 60), pn(r.fractionalMilliseconds)));
	}, an = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + Gt(mn(e));
		return n < t ? n + 100 : n;
	}, on = 15768e8, sn = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > on ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, cn = (e) => {
		let t = Qt.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, ln = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	], un = (e, t, n) => {
		let r = ln[t];
		if (t === 1 && dn(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${Qt[t]} in ${e}: ${n}`);
	}, dn = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), fn = (e, t, n, r) => {
		let i = Kt(mn(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, pn = (e) => e == null ? 0 : Ht("0." + e) * 1e3, mn = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), gn, _n = t((() => {
	gn = function(e) {
		return Object.assign(new String(e), {
			deserializeJSON() {
				return JSON.parse(String(e));
			},
			toString() {
				return String(e);
			},
			toJSON() {
				return String(e);
			}
		});
	}, gn.from = (e) => e && typeof e == "object" && (e instanceof gn || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? gn(String(e)) : gn(JSON.stringify(e)), gn.fromObject = gn.from;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/quote-header.js
function vn(e) {
	return (e.includes(",") || e.includes("\"")) && (e = `"${e.replace(/"/g, "\\\"")}"`), e;
}
var yn = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function bn(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw Error(`Value ${r} out of range [${t}, ${n}]`);
}
var xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An, jn, Mn, Nn, Pn = t((() => {
	xn = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", Sn = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", Cn = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", wn = "(\\d?\\d)", Tn = "(\\d{4})", En = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), Dn = RegExp(`^${xn}, ${wn} ${Sn} ${Tn} ${Cn} GMT$`), On = RegExp(`^${xn}, ${wn}-${Sn}-(\\d\\d) ${Cn} GMT$`), kn = RegExp(`^${xn} ${Sn} ( [1-9]|\\d\\d) ${Cn} ${Tn}$`), An = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	], jn = (e) => {
		if (e == null) return;
		let t = NaN;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") {
			if (!/^-?\d*\.?\d+$/.test(e)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
			t = Number.parseFloat(e);
		} else typeof e == "object" && e.tag === 1 && (t = e.value);
		if (isNaN(t) || Math.abs(t) === Infinity) throw TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(t * 1e3));
	}, Mn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC3339 timestamps must be strings");
		let t = En.exec(e);
		if (!t) throw TypeError(`Invalid RFC3339 timestamp format ${e}`);
		let [, n, r, i, a, o, s, , c, l] = t;
		bn(r, 1, 12), bn(i, 1, 31), bn(a, 0, 23), bn(o, 0, 59), bn(s, 0, 60);
		let u = new Date(Date.UTC(Number(n), Number(r) - 1, Number(i), Number(a), Number(o), Number(s), Number(c) ? Math.round(parseFloat(`0.${c}`) * 1e3) : 0));
		if (u.setUTCFullYear(Number(n)), l.toUpperCase() != "Z") {
			let [, e, t, n] = /([+-])(\d\d):(\d\d)/.exec(l) || [
				void 0,
				"+",
				0,
				0
			], r = e === "-" ? 1 : -1;
			u.setTime(u.getTime() + r * (Number(t) * 60 * 60 * 1e3 + Number(n) * 60 * 1e3));
		}
		return u;
	}, Nn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC7231 timestamps must be strings.");
		let t, n, r, i, a, o, s, c;
		if ((c = Dn.exec(e)) ? [, t, n, r, i, a, o, s] = c : (c = On.exec(e)) ? ([, t, n, r, i, a, o, s] = c, r = (Number(r) + 1900).toString()) : (c = kn.exec(e)) && ([, n, t, i, a, o, s, r] = c), r && o) {
			let e = Date.UTC(Number(r), An.indexOf(n), Number(t), Number(i), Number(a), Number(o), s ? Math.round(parseFloat(`0.${s}`) * 1e3) : 0);
			bn(t, 1, 31), bn(i, 0, 23), bn(a, 0, 59), bn(o, 0, 60);
			let c = new Date(e);
			return c.setUTCFullYear(Number(r)), c;
		}
		throw TypeError(`Invalid RFC7231 date-time value ${e}.`);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/split-every.js
function Fn(e, t, n) {
	if (n <= 0 || !Number.isInteger(n)) throw Error("Invalid number of delimiters (" + n + ") for splitEvery.");
	let r = e.split(t);
	if (n === 1) return r;
	let i = [], a = "";
	for (let e = 0; e < r.length; e++) a === "" ? a = r[e] : a += t + r[e], (e + 1) % n === 0 && (i.push(a), a = "");
	return a !== "" && i.push(a), i;
}
var In = t((() => {})), Ln, Rn = t((() => {
	Ln = (e) => {
		let t = e.length, n = [], r = !1, i, a = 0;
		for (let o = 0; o < t; ++o) {
			let t = e[o];
			switch (t) {
				case "\"":
					i !== "\\" && (r = !r);
					break;
				case ",": r || (n.push(e.slice(a, o)), a = o + 1);
			}
			i = t;
		}
		return n.push(e.slice(a)), n.map((e) => {
			e = e.trim();
			let t = e.length;
			return t < 2 ? e : (e[0] === "\"" && e[t - 1] === "\"" && (e = e.slice(1, t - 1)), e.replace(/\\"/g, "\""));
		});
	};
})), zn, Bn, Vn = t((() => {
	zn = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, Bn = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !zn.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && zn.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function Hn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in Gn) t[n / 2] = Gn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function Un(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Wn[e[n]];
	return t;
}
var Wn, Gn, Kn = t((() => {
	Wn = {}, Gn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), Wn[e] = t, Gn[t] = e;
	}
})), qn, Jn, Yn = t((() => {
	qn = typeof TextEncoder == "function" ? new TextEncoder() : null, Jn = (e) => {
		if (typeof e == "string") {
			if (qn) return qn.encode(e).byteLength;
			let t = e.length;
			for (let n = t - 1; n >= 0; n--) {
				let r = e.charCodeAt(n);
				r > 127 && r <= 2047 ? t++ : r > 2047 && r <= 65535 && (t += 2), r >= 56320 && r <= 57343 && n--;
			}
			return t;
		}
		if (typeof e.byteLength == "number") return e.byteLength;
		if (typeof e.size == "number") return e.size;
		throw Error(`Body Length computation failed for ${e}`);
	};
})), Xn, Zn = t((() => {
	Tt(), Xn = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? wt(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Qn(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var $n = t((() => {})), er, tr = t((() => {
	er = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), nr, rr = t((() => {
	nr = async (e) => void 0;
})), ir, ar, or, sr, cr, lr, ur = t((() => {
	ir = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), lr(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!cr(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, ar = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, or = /(\d+\.){3}\d+/, sr = /\.\./, cr = (e) => ar.test(e) && !or.test(e) && !sr.test(e), lr = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), dr = t((() => {
	ur();
})), fr, pr = t((() => {
	fr = (e, t, n, r = !1) => {
		let i = async () => {
			let i;
			return i = r ? n.clientContextParams?.[e] ?? n[e] ?? n[t] : n[e] ?? n[t], typeof i == "function" ? i() : i;
		};
		return e === "credentialScope" || t === "CredentialScope" ? async () => {
			let e = typeof n.credentials == "function" ? await n.credentials() : n.credentials;
			return e?.credentialScope ?? e?.CredentialScope;
		} : e === "accountId" || t === "AccountId" ? async () => {
			let e = typeof n.credentials == "function" ? await n.credentials() : n.credentials;
			return e?.accountId ?? e?.AccountId;
		} : e === "endpoint" || t === "endpoint" ? async () => {
			if (n.isCustomEndpoint === !1) return;
			let e = await i();
			if (e && typeof e == "object") {
				if ("url" in e) return e.url.href;
				if ("hostname" in e) {
					let { protocol: t, hostname: n, port: r, path: i } = e;
					return `${t}//${n}${r ? ":" + r : ""}${i}`;
				}
			}
			return e;
		} : i;
	};
})), mr = t((() => {
	b();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function hr(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(Te(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await gr(t, n, r);
		if (typeof r.endpointProvider != "function") throw Error("config.endpointProvider is not set.");
		let o = r.endpointProvider(a, i);
		if (r.isCustomEndpoint && r.endpoint) {
			let e = await r.endpoint();
			if (e?.headers) {
				o.headers ??= {};
				for (let [t, n] of Object.entries(e.headers)) o.headers[t] = Array.isArray(n) ? n : [n];
			}
		}
		return o;
	};
}
var gr, _r = t((() => {
	dr(), pr(), mr(), gr = async (e, t, n) => {
		let r = {}, i = t?.getEndpointParameterInstructions?.() || {};
		for (let [t, a] of Object.entries(i)) switch (a.type) {
			case "staticContextParams":
				r[t] = a.value;
				break;
			case "contextParams":
				r[t] = e[a.name];
				break;
			case "clientContextParams":
			case "builtInParams":
				r[t] = await fr(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await ir(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function vr(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function yr(e) {
	let t = hr(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && vr(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = ce(i)?.selectedHttpAuthScheme?.httpAuthOption;
			e && (e.signingProperties = Object.assign(e.signingProperties || {}, {
				signing_region: s.signingRegion,
				signingRegion: s.signingRegion,
				signing_service: s.signingName,
				signingName: s.signingName,
				signingRegionSet: s.signingRegionSet
			}, s.properties));
		}
		return r({ ...a });
	};
}
var br = t((() => {
	b(), _r();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function xr(e) {
	let t = yr(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), Cr);
	} });
}
var Sr, Cr, wr = t((() => {
	br(), Sr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, Cr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: Sr.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function Tr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => Te(await ye(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: ye(i ?? !1),
			useFipsEndpoint: ye(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var Er = t((() => {
	b(), mr();
})), Dr, Or = t((() => {
	Dr = class e {
		nodes;
		root;
		conditions;
		results;
		constructor(e, t, n, r) {
			this.nodes = e, this.root = t, this.conditions = n, this.results = r;
		}
		static from(t, n, r, i) {
			return new e(t, n, r, i);
		}
	};
})), kr, Ar = t((() => {
	kr = class {
		capacity;
		data = /* @__PURE__ */ new Map();
		parameters = [];
		constructor({ size: e, params: t }) {
			this.capacity = e ?? 50, t && (this.parameters = t);
		}
		get(e, t) {
			let n = this.hash(e);
			if (n === !1) return t();
			if (!this.data.has(n)) {
				if (this.data.size > this.capacity + 10) {
					let e = this.data.keys(), t = 0;
					for (;;) {
						let { value: n, done: r } = e.next();
						if (this.data.delete(n), r || ++t > 10) break;
					}
				}
				this.data.set(n, t());
			}
			return this.data.get(n);
		}
		size() {
			return this.data.size;
		}
		hash(e) {
			let t = "", { parameters: n } = this;
			if (n.length === 0) return !1;
			for (let r of n) {
				let n = e[r], i = n == null ? "\0" : String(n);
				if (i.includes("|;")) return !1;
				t += i + "|;";
			}
			return t;
		}
	};
})), jr, Mr = t((() => {
	jr = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), Nr = t((() => {
	Mr();
})), Pr, Fr = t((() => {
	Pr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function Ir(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${Ir(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(Ir).join(", ")})` : JSON.stringify(e, null, 2);
}
var Lr = t((() => {})), Rr = t((() => {
	Fr(), Lr();
})), zr, Br = t((() => {
	zr = {};
})), Vr, Hr = t((() => {
	Vr = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function Ur(...e) {
	for (let t of e) if (t != null) return t;
}
var Wr = t((() => {})), Gr, Kr = t((() => {
	Nr(), Gr = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new jr(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new jr(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), qr, Jr = t((() => {
	Nr(), Kr(), qr = (e, t) => Gr(t).reduce((n, r) => {
		if (typeof n != "object") throw new jr(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Yr, Xr = t((() => {
	Yr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Zr(e, t, n) {
	return e ? t : n;
}
var Qr = t((() => {})), $r, ei = t((() => {
	$r = (e) => !e;
})), ti, ni, ri = t((() => {
	ti = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), ni = (e) => ti.test(e) || e.startsWith("[") && e.endsWith("]");
})), ii, ai, oi = t((() => {
	se(), ri(), ii = {
		[ee.HTTP]: 80,
		[ee.HTTPS]: 443
	}, ai = (e) => {
		let t = (() => {
			try {
				if (e instanceof URL) return e;
				if (typeof e == "object" && "hostname" in e) {
					let { hostname: t, port: n, protocol: r = "", path: i = "", query: a = {} } = e, o = new URL(`${r}//${t}${n ? `:${n}` : ""}${i}`);
					return o.search = Object.entries(a).map(([e, t]) => `${e}=${t}`).join("&"), o;
				}
				return new URL(e);
			} catch {
				return null;
			}
		})();
		if (!t) return console.error(`Unable to parse ${JSON.stringify(e)} as a whatwg URL.`), null;
		let n = t.href, { host: r, hostname: i, pathname: a, protocol: o, search: s } = t;
		if (s) return null;
		let c = o.slice(0, -1);
		if (!Object.values(ee).includes(c)) return null;
		let l = ni(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${ii[c]}`) || typeof e == "string" && e.includes(`${r}:${ii[c]}`) ? `:${ii[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function si(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var ci = t((() => {})), li, ui = t((() => {
	li = (e, t) => e === t;
})), di, fi = t((() => {
	di = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), pi, mi = t((() => {
	pi = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), hi = t((() => {
	Hr(), Wr(), Jr(), Xr(), b(), Qr(), ei(), oi(), ci(), ui(), fi(), mi();
})), gi, _i = t((() => {
	hi(), gi = {
		booleanEquals: Vr,
		coalesce: Ur,
		getAttr: qr,
		isSet: Yr,
		isValidHostLabel: he,
		ite: Zr,
		not: $r,
		parseURL: ai,
		split: si,
		stringEquals: li,
		substring: di,
		uriEncode: pi
	};
})), vi, yi = t((() => {
	hi(), vi = (e, t) => {
		let n = [], { referenceRecord: r, endpointParams: i } = t, a = 0;
		for (; a < e.length;) {
			let t = e.indexOf("{", a);
			if (t === -1) {
				n.push(e.slice(a));
				break;
			}
			n.push(e.slice(a, t));
			let o = e.indexOf("}", t);
			if (o === -1) {
				n.push(e.slice(t));
				break;
			}
			e[t + 1] === "{" && e[o + 1] === "}" && (n.push(e.slice(t + 1, o)), a = o + 2);
			let s = e.substring(t + 1, o);
			if (s.includes("#")) {
				let [e, t] = s.split("#");
				n.push(qr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), bi, xi = t((() => {
	bi = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), Si, Ci, wi, Ti = t((() => {
	Nr(), Br(), _i(), yi(), xi(), Si = (e, t, n) => {
		if (typeof e == "string") return vi(e, n);
		if (e.fn) return wi.callFunction(e, n);
		if (e.ref) return bi(e, n);
		throw new jr(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, Ci = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = wi.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = zr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = gi[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, wi = {
		evaluateExpression: Si,
		callFunction: Ci
	};
})), Ei = t((() => {
	Ti();
})), Di, Oi = t((() => {
	Rr(), Nr(), Ei(), Di = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new jr(`'${n}' is already defined in Reference Record.`);
		let r = Ci(e, t);
		t.logger?.debug?.(`${Pr} evaluateCondition: ${Ir(e)} = ${Ir(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), ki, Ai = t((() => {
	Nr(), Ti(), ki = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = Si(e, "Header value entry", t);
		if (typeof r != "string") throw new jr(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), ji, Mi, Ni, Pi = t((() => {
	Nr(), yi(), ji = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = Ni.getEndpointProperty(r, t), e), {}), Mi = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => Mi(e, t));
		switch (typeof e) {
			case "string": return vi(e, t);
			case "object":
				if (e === null) throw new jr(`Unexpected endpoint property: ${e}`);
				return Ni.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new jr(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, Ni = {
		getEndpointProperty: Mi,
		getEndpointProperties: ji
	};
})), Fi, Ii = t((() => {
	Nr(), Ti(), Fi = (e, t) => {
		let n = Si(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new jr(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), Li, Ri, zi = t((() => {
	Nr(), Oi(), Ti(), Ai(), Pi(), Ii(), Li = 1e8, Ri = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < Li;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = Di({
				fn: l,
				assign: d,
				argv: u
			}, c);
			if (f.toAssign) {
				let { name: e, value: t } = f.toAssign;
				s[e] = t;
			}
			o = o >= 0 === f.result ? r : i;
		}
		if (o >= Li) {
			let e = i[o - Li];
			if (e[0] === -1) {
				let [, t] = e;
				throw new jr(Si(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: Fi(t, c),
				properties: ji(n, c),
				headers: ki(r ?? {}, c)
			};
		}
		throw new jr("No matching endpoint.");
	};
})), Bi, Vi, Hi = t((() => {
	rr(), _r(), br(), wr(), Er(), b(), Or(), Ar(), zi(), ri(), Br(), Rr(), Nr(), Oi(), Ai(), Pi(), Ii(), Ti(), mr(), Bi = Tr(nr), yr(nr), Vi = xr(nr);
})), Ui, Wi, Gi = t((() => {
	Ui = typeof ReadableStream == "function" ? ReadableStream : function() {}, Wi = class extends Ui {};
})), Ki, qi, Ji = t((() => {
	Ki = (e) => typeof ReadableStream == "function" && (e?.constructor?.name === ReadableStream.name || e instanceof ReadableStream), qi = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
})), Yi, Xi = t((() => {
	Dt(), Ji(), Gi(), Yi = ({ expectedChecksum: e, checksum: t, source: n, checksumSourceLocation: r, base64Encoder: i }) => {
		if (!Ki(n)) throw Error(`@smithy/util-stream: unsupported source type ${n?.constructor?.name ?? n} in ChecksumStream.`);
		let a = i ?? Et;
		if (typeof TransformStream != "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
		let o = new TransformStream({
			start() {},
			async transform(e, n) {
				t.update(e), n.enqueue(e);
			},
			async flush(n) {
				let i = await t.digest(), o = a(i);
				if (e !== o) {
					let t = /* @__PURE__ */ Error(`Checksum mismatch: expected "${e}" but received "${o}" in response header "${r}".`);
					n.error(t);
				} else n.terminate();
			}
		});
		n.pipeThrough(o);
		let s = o.readable;
		return Object.setPrototypeOf(s, Wi.prototype), s;
	};
})), Zi, Qi = t((() => {
	Zi = class {
		allocByteArray;
		byteLength = 0;
		byteArrays = [];
		constructor(e) {
			this.allocByteArray = e;
		}
		push(e) {
			this.byteArrays.push(e), this.byteLength += e.byteLength;
		}
		flush() {
			if (this.byteArrays.length === 1) {
				let e = this.byteArrays[0];
				return this.reset(), e;
			}
			let e = this.allocByteArray(this.byteLength), t = 0;
			for (let n = 0; n < this.byteArrays.length; ++n) {
				let r = this.byteArrays[n];
				e.set(r, t), t += r.byteLength;
			}
			return this.reset(), e;
		}
		reset() {
			this.byteArrays = [], this.byteLength = 0;
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/createBufferedReadable.browser.js
function $i(e, t, n) {
	let r = e.getReader(), i = !1, a = 0, o = ["", new Zi((e) => new Uint8Array(e))], s = -1, c = async (e) => {
		let { value: l, done: u } = await r.read(), d = l;
		if (u) {
			if (s !== -1) {
				let t = ta(o, s);
				na(t) > 0 && e.enqueue(t);
			}
			e.close();
		} else {
			let r = ra(d, !1);
			if (s !== r && (s >= 0 && e.enqueue(ta(o, s)), s = r), s === -1) {
				e.enqueue(d);
				return;
			}
			let l = na(d);
			a += l;
			let u = na(o[s]);
			if (l >= t && u === 0) e.enqueue(d);
			else {
				let r = ea(o, s, d);
				!i && a > t * 2 && (i = !0, n?.warn(`@smithy/util-stream - stream chunk size ${l} is below threshold of ${t}, automatically buffering.`)), r >= t ? e.enqueue(ta(o, s)) : await c(e);
			}
		}
	};
	return new ReadableStream({ pull: c });
}
function ea(e, t, n) {
	switch (t) {
		case 0: return e[0] += n, na(e[0]);
		case 1:
		case 2: return e[t].push(n), na(e[t]);
	}
}
function ta(e, t) {
	switch (t) {
		case 0:
			let n = e[0];
			return e[0] = "", n;
		case 1:
		case 2: return e[t].flush();
	}
	throw Error(`@smithy/util-stream - invalid index ${t} given to flush()`);
}
function na(e) {
	return e?.byteLength ?? e?.length ?? 0;
}
function ra(e, t = !0) {
	return t && typeof Buffer < "u" && e instanceof Buffer ? 2 : e instanceof Uint8Array ? 1 : typeof e == "string" ? 0 : -1;
}
var ia, aa = t((() => {
	Qi(), ia = $i;
})), oa, sa = t((() => {
	oa = (e, t) => {
		let { base64Encoder: n, bodyLengthChecker: r, checksumAlgorithmFn: i, checksumLocationName: a, streamHasher: o } = t, s = n !== void 0 && r !== void 0 && i !== void 0 && a !== void 0 && o !== void 0, c = s ? o(i, e) : void 0;
		Promise.resolve(c).catch(() => {});
		let l = e.getReader();
		return new ReadableStream({ async pull(e) {
			let { value: t, done: i } = await l.read();
			if (i) {
				if (e.enqueue("0\r\n"), s) {
					let t = n(await c);
					e.enqueue(`${a}:${t}\r\n`), e.enqueue("\r\n");
				}
				e.close();
			} else e.enqueue(`${(r(t) || 0).toString(16)}\r\n${t}\r\n`);
		} });
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function ca(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function la(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Qn(t, r);
}
var ua, da = t((() => {
	$n(), Ji(), ua = async (e) => qi(e) ? ca(e) : la(e);
})), fa, pa, ma, ha = t((() => {
	Dt(), Kn(), jt(), da(), Ji(), fa = "The stream has already been transformed.", pa = (e) => {
		if (!ma(e) && !Ki(e)) {
			let t = e?.__proto__?.constructor?.name || e;
			throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${t}`);
		}
		let t = !1, n = async () => {
			if (t) throw Error(fa);
			return t = !0, await ua(e);
		}, r = (e) => {
			if (typeof e.stream != "function") throw Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
			return e.stream();
		};
		return Object.assign(e, {
			transformToByteArray: n,
			transformToString: async (e) => {
				let t = await n();
				if (e === "base64") return Et(t);
				if (e === "hex") return Un(t);
				if (e === void 0 || e === "utf8" || e === "utf-8") return At(t);
				if (typeof TextDecoder == "function") return new TextDecoder(e).decode(t);
				throw Error("TextDecoder is not available, please make sure polyfill is provided.");
			},
			transformToWebStream: () => {
				if (t) throw Error(fa);
				if (t = !0, ma(e)) return r(e);
				if (Ki(e)) return e;
				throw Error(`Cannot transform payload to web stream, got ${e}`);
			}
		});
	}, ma = (e) => typeof Blob == "function" && e instanceof Blob;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function ga(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var _a = t((() => {})), va, ya, ba, xa, w = t((() => {
	Ct(), Dt(), kt(), Tt(), jt(), Nt(), hn(), _n(), Yt(), yn(), Pn(), In(), Rn(), Vn(), Kn(), Yn(), Zn(), $n(), tr(), b(), Hi(), Gi(), Xi(), aa(), sa(), ha(), Ji(), da(), _a(), va = class extends Ot(At, wt, Et, St) {}, ya = (e) => crypto.getRandomValues(e), ba = Mt(ya), xa = ba;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
w();
var Sa = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return va.mutate(e);
	if (!e) return va.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return va.mutate(await n);
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function Ca(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
		return "%" + e.charCodeAt(0).toString(16).toUpperCase();
	});
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var wa = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/checksum/chunked-blob-reader/chunked-blob-reader.js
async function Ta(e, t, n = 1048576) {
	let r = e.size, i = 0;
	for (; i < r;) {
		let a = e.slice(i, Math.min(r, i + n));
		t(new Uint8Array(await a.arrayBuffer())), i += a.size;
	}
}
var Ea = t((() => {})), Da, Oa = t((() => {
	Ea(), Da = async function(e, t) {
		let n = new e();
		return await Ta(t, (e) => {
			n.update(e);
		}), n.digest();
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/checksum/md5/Md5Js.js
function ka(e, t) {
	let n = e[0], r = e[1], i = e[2], a = e[3];
	for (let e = 0; e < 64; ++e) {
		let o, s;
		e < 16 ? (o = r & i | ~r & a, s = e) : e < 32 ? (o = a & r | i & ~a, s = (5 * e + 1) % 16) : e < 48 ? (o = r ^ i ^ a, s = (3 * e + 5) % 16) : (o = i ^ (r | ~a), s = 7 * e % 16);
		let c = t.getUint32(s * 4, !0), l = a;
		a = i, i = r;
		let u = Na[(e >> 4) * 4 + (e & 3)], d = (n + o & Ma) + (c + Pa[e] & Ma) & Ma;
		r = r + ((d << u | d >>> 32 - u) >>> 0) & Ma, n = l;
	}
	e[0] = e[0] + n & Ma, e[1] = e[1] + r & Ma, e[2] = e[2] + i & Ma, e[3] = e[3] + a & Ma;
}
var Aa, ja, Ma, Na, Pa, Fa = t((() => {
	w(), Aa = class {
		digestLength = 16;
		state = Uint32Array.from(ja);
		writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64));
		bufferLength = 0;
		bytesHashed = 0;
		update(e) {
			let t = Xn(e), n = 0, r = t.byteLength;
			for (this.bytesHashed += r; r > 0;) this.writeBuffer.setUint8(this.bufferLength++, t[n++]), --r, this.bufferLength === 64 && (ka(this.state, this.writeBuffer), this.bufferLength = 0);
		}
		async digest() {
			let e = Uint32Array.from(this.state), t = new DataView(this.writeBuffer.buffer.slice(0)), n = this.bufferLength, r = this.bytesHashed * 8;
			if (t.setUint8(n++, 128), this.bufferLength % 64 >= 56) {
				for (let e = n; e < 64; ++e) t.setUint8(e, 0);
				ka(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) t.setUint8(e, 0);
			t.setUint32(56, r >>> 0, !0), t.setUint32(60, Math.floor(r / 2 ** 32), !0), ka(e, t);
			let i = /* @__PURE__ */ new Uint8Array(16), a = new DataView(i.buffer);
			for (let t = 0; t < 4; ++t) a.setUint32(t * 4, e[t], !0);
			return i;
		}
		reset() {
			this.state.set(ja), this.writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64)), this.bufferLength = 0, this.bytesHashed = 0;
		}
	}, ja = [
		1732584193,
		4023233417,
		2562383102,
		271733878
	], Ma = 4294967295, Na = Uint8Array.of(7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21), Pa = Array.from({ length: 64 }, (e, t) => Math.abs(Math.sin(t + 1)) * 2 ** 32 >>> 0);
})), Ia, La, Ra, za = t((() => {
	Ia = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Ia[e] = t >>> 0;
	}
	La = 4294967295, Ra = class {
		digestLength = 4;
		checksum = La;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Ia[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ La) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = La;
		}
	};
})), Ba, Va, Ha, Ua, Wa, Ga, Ka = t((() => {
	w(), Ba = 64, Va = 32, Ha = 2 ** 53 - 1, Ua = class e {
		digestLength = Va;
		state = Int32Array.from(Wa);
		w;
		buffer = /* @__PURE__ */ new Uint8Array(64);
		bufferLength = 0;
		bytesHashed = 0;
		finished = !1;
		inner;
		outer;
		constructor(t) {
			if (t) {
				let n = e.normalizeKey(t);
				this.inner = new e(), this.outer = new e();
				let { inner: r, outer: i } = this, a = /* @__PURE__ */ new Uint8Array(128);
				for (let e = 0; e < Ba; ++e) a[e] = 54 ^ n[e], a[e + Ba] = 92 ^ n[e];
				r.update(a.subarray(0, Ba)), i.update(a.subarray(Ba));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = Xn(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > Ha) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === Ba && (this.hashBuffer(), this.bufferLength = 0);
		}
		async digest() {
			let { inner: e, outer: t } = this;
			if (e && t) {
				if (this.finished) throw Error("Attempted to digest an already finished HMAC.");
				this.finished = !0;
				let n = e.digestSync();
				return t.update(n), t.digestSync();
			}
			return this.digestSync();
		}
		reset() {
			this.state = Int32Array.from(Wa), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % Ba >= 56) {
				for (let e = n; e < Ba; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(Va);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = Xn(t);
			if (n.byteLength > Ba) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(Ba);
				return i.set(r), i;
			}
			if (n.byteLength < Ba) {
				let e = new Uint8Array(Ba);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < Ba; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Ga[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, Wa = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Ga = new Int32Array([
		1116352408,
		1899447441,
		3049323471,
		3921009573,
		961987163,
		1508970993,
		2453635748,
		2870763221,
		3624381080,
		310598401,
		607225278,
		1426881987,
		1925078388,
		2162078206,
		2614888103,
		3248222580,
		3835390401,
		4022224774,
		264347078,
		604807628,
		770255983,
		1249150122,
		1555081692,
		1996064986,
		2554220882,
		2821834349,
		2952996808,
		3210313671,
		3336571891,
		3584528711,
		113926993,
		338241895,
		666307205,
		773529912,
		1294757372,
		1396182291,
		1695183700,
		1986661051,
		2177026350,
		2456956037,
		2730485921,
		2820302411,
		3259730800,
		3345764771,
		3516065817,
		3600352804,
		4094571909,
		275423344,
		430227734,
		506948616,
		659060556,
		883997877,
		958139571,
		1322822218,
		1537002063,
		1747873779,
		1955562222,
		2024104815,
		2227730452,
		2361852424,
		2428436474,
		2756734187,
		3204031479,
		3329325298
	]);
})), qa, Ja, Ya, Xa, Za, Qa, $a = t((() => {
	w(), Ka(), {digest: qa, sign: Ja, importKey: Ya} = globalThis?.crypto?.subtle ?? {}, Xa = typeof qa == "function" && typeof Ja == "function" && typeof Ya == "function" ? globalThis.crypto.subtle : void 0, Za = 8388608, Qa = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = Xn(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= Za && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Qn(this.pending);
			if (Xa) {
				if (this.secret) {
					this.finished = !0;
					let t = await Xa.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await Xa.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await Xa.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Ua(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Ua(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), eo = t((() => {
	Oa(), Fa(), za(), Ka(), $a();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function to(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var no, ro = t((() => {
	w(), no = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && to(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && to(e), parseInt(Un(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), io, ao, oo, so, co, lo, uo, fo, po, mo, ho, go, _o, vo = t((() => {
	b(), w(), ro(), io = class {
		toUtf8;
		fromUtf8;
		constructor(e, t) {
			this.toUtf8 = e, this.fromUtf8 = t;
		}
		format(e) {
			let t = [];
			for (let n in e) {
				if (!_(e, n)) continue;
				let r = this.fromUtf8(n);
				if (r.byteLength > 255) throw Error(`@smithy/core/event-streams - header name exceeds 255 bytes: ${r.byteLength}`);
				t.push(Uint8Array.from([r.byteLength]), r, this.formatHeaderValue(e[n]));
			}
			let n = new Uint8Array(t.reduce((e, t) => e + t.byteLength, 0)), r = 0;
			for (let e of t) n.set(e, r), r += e.byteLength;
			return n;
		}
		formatHeaderValue(e) {
			switch (e.type) {
				case "boolean": return Uint8Array.from([+!e.value]);
				case "byte": return Uint8Array.from([2, e.value]);
				case "short":
					let t = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(3));
					return t.setUint8(0, 3), t.setInt16(1, e.value, !1), new Uint8Array(t.buffer);
				case "integer":
					let n = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(5));
					return n.setUint8(0, 4), n.setInt32(1, e.value, !1), new Uint8Array(n.buffer);
				case "long":
					let r = /* @__PURE__ */ new Uint8Array(9);
					return r[0] = 5, r.set(e.value.bytes, 1), r;
				case "binary":
					if (e.value.byteLength > _o) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${_o} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > _o) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${_o} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(no.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!go.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(Hn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: oo,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: oo,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: so,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: co,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: lo,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: uo,
							value: new no(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: fo,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: po,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: mo,
							value: new Date(new no(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: ho,
							value: `${Un(o.subarray(0, 4))}-${Un(o.subarray(4, 6))}-${Un(o.subarray(6, 8))}-${Un(o.subarray(8, 10))}-${Un(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(ao ||= {}), oo = "boolean", so = "byte", co = "short", lo = "integer", uo = "long", fo = "binary", po = "string", mo = "timestamp", ho = "uuid", go = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, _o = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function yo({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Co) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(bo, !1), o = r.getUint32(xo, !1), s = r.getUint32(e - So, !1), c = new Ra();
	if (c.update(new Uint8Array(n, t, xo)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + xo, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + xo + So, a),
		body: new Uint8Array(n, t + xo + So + a, i - a - 16)
	};
}
var bo, xo, So, Co, wo = t((() => {
	eo(), bo = 4, xo = 8, So = 4, Co = 16;
})), To, Eo = t((() => {
	eo(), vo(), wo(), To = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new io(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
		}
		feed(e) {
			this.messageBuffer.push(this.decode(e));
		}
		endOfStream() {
			this.isEndOfStream = !0;
		}
		getMessage() {
			let e = this.messageBuffer.pop(), t = this.isEndOfStream;
			return {
				getMessage() {
					return e;
				},
				isEndOfStream() {
					return t;
				}
			};
		}
		getAvailableMessages() {
			let e = this.messageBuffer;
			this.messageBuffer = [];
			let t = this.isEndOfStream;
			return {
				getMessages() {
					return e;
				},
				isEndOfStream() {
					return t;
				}
			};
		}
		encode({ headers: e, body: t }) {
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Ra();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = yo(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), Do, Oo = t((() => {
	Do = class {
		options;
		constructor(e) {
			this.options = e;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (let e of this.options.inputStream) yield this.options.decoder.decode(e);
		}
	};
})), ko, Ao = t((() => {
	ko = class {
		options;
		constructor(e) {
			this.options = e;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (let e of this.options.messageStream) yield this.options.encoder.encode(e);
			this.options.includeEndFrame && (yield /* @__PURE__ */ new Uint8Array());
		}
	};
})), jo, Mo = t((() => {
	jo = class {
		options;
		constructor(e) {
			this.options = e;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (let e of this.options.messageStream) {
				let t = await this.options.deserializer(e);
				t !== void 0 && (yield t);
			}
		}
	};
})), No, Po = t((() => {
	No = class {
		options;
		constructor(e) {
			this.options = e;
		}
		[Symbol.asyncIterator]() {
			return this.asyncIterator();
		}
		async *asyncIterator() {
			for await (let e of this.options.inputStream) yield this.options.serializer(e);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getChunkedStream.js
function Fo(e) {
	let t = 0, n = 0, r = null, i = null, a = (e) => {
		if (typeof e != "number") throw Error("Attempted to allocate an event message where size was not a number: " + e);
		t = e, n = 4, r = new Uint8Array(e), new DataView(r.buffer).setUint32(0, e, !1);
	}, o = async function* () {
		let o = e[Symbol.asyncIterator]();
		for (;;) {
			let { value: e, done: s } = await o.next();
			if (s) {
				if (!t) return;
				if (t === n) yield r;
				else throw Error("Truncated event message received.");
				return;
			}
			let c = e.length, l = 0;
			for (; l < c;) {
				if (!r) {
					let t = c - l;
					i ||= /* @__PURE__ */ new Uint8Array(4);
					let r = Math.min(4 - n, t);
					if (i.set(e.slice(l, l + r), n), n += r, l += r, n < 4) break;
					a(new DataView(i.buffer).getUint32(0, !1)), i = null;
				}
				let o = Math.min(t - n, c - l);
				r.set(e.slice(l, l + o), n), n += o, l += o, t && t === n && (yield r, r = null, t = 0, n = 0);
			}
		}
	};
	return { [Symbol.asyncIterator]: o };
}
var Io = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Lo(e, t) {
	let n = Ro(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Ro(e, t) {
	return async function(n) {
		let { value: r } = n.headers[":message-type"];
		if (r === "error") {
			let e = Error(n.headers[":error-message"].value || "UnknownError");
			throw e.name = n.headers[":error-code"].value, e;
		}
		if (r === "exception") {
			let r = n.headers[":exception-type"].value, i = await e({ [r]: n });
			if (i.$unknown) {
				let e = Error(t(n.body));
				throw e.name = r, e;
			}
			throw i[r];
		}
		if (r === "event") {
			let t = await e({ [n.headers[":event-type"].value]: n });
			return t.$unknown ? void 0 : t;
		}
		throw Error(`Unrecognizable event type: ${n.headers[":event-type"].value}`);
	};
}
var zo = t((() => {})), Bo, Vo, Ho = t((() => {
	Eo(), Oo(), Ao(), Mo(), Po(), Io(), zo(), Bo = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new To(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Fo(e);
			return new jo({
				messageStream: new Do({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Ro(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new ko({
				messageStream: new No({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Vo = (e) => new Bo(e);
})), Uo, Wo, Go = t((() => {
	Uo = (e) => ({ [Symbol.asyncIterator]: async function* () {
		let t = e.getReader();
		try {
			for (;;) {
				let { done: e, value: n } = await t.read();
				if (e) return;
				yield n;
			}
		} finally {
			t.releaseLock();
		}
	} }), Wo = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Ko, qo, Jo, Yo = t((() => {
	Ho(), Go(), Ko = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Bo({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = qo(e) ? Uo(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Wo(n) : n;
		}
	}, qo = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Jo = (e) => new Ko(e);
})), Xo, Zo = t((() => {
	Xo = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), Qo, $o = t((() => {
	b(), S(), w(), Qo = class {
		marshaller;
		serializer;
		deserializer;
		serdeContext;
		defaultContentType;
		compositeErrorRegistry;
		constructor({ marshaller: e, serializer: t, deserializer: n, serdeContext: r, defaultContentType: i, compositeErrorRegistry: a }) {
			this.marshaller = e, this.serializer = t, this.deserializer = n, this.serdeContext = r, this.defaultContentType = i, this.compositeErrorRegistry = a;
		}
		async serializeEventStream({ eventStream: e, requestSchema: t, initialRequest: n, initialMessageType: r }) {
			let i = this.marshaller, a = t.getEventStreamMember(), o = t.getMemberSchema(a), s = this.serializer, c = this.defaultContentType, l = Symbol("initialRequestMarker"), u = { async *[Symbol.asyncIterator]() {
				if (n) {
					let e = {
						":event-type": {
							type: "string",
							value: r ?? "initial-request"
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: c
						}
					};
					s.write(t, n);
					let i = s.flush();
					yield {
						[l]: !0,
						headers: e,
						body: i
					};
				}
				for await (let t of e) yield t;
			} };
			return i.serialize(u, (e) => {
				if (e[l]) return {
					headers: e.headers,
					body: e.body
				};
				let t = "";
				for (let n in e) if (_(e, n) && n !== "__type") {
					t = n;
					break;
				}
				let { additionalHeaders: n, body: r, eventType: i, explicitPayloadContentType: a } = this.writeEventBody(t, o, e);
				return {
					headers: {
						":event-type": {
							type: "string",
							value: i
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: a ?? c
						},
						...n
					},
					body: r
				};
			});
		}
		async deserializeEventStream({ response: e, responseSchema: t, initialResponseContainer: n, initialMessageType: r }) {
			let i = this.marshaller, a = t.getEventStreamMember(), o = t.getMemberSchema(a).getMemberSchemas(), s = Symbol("initialResponseMarker"), c = i.deserialize(e.body, async (e) => {
				let n = "";
				for (let t in e) if (_(e, t) && t !== "__type") {
					n = t;
					break;
				}
				let i = e[n].body;
				if (n === (r ?? "initial-response")) {
					let e = await this.deserializer.read(t, i);
					return delete e[a], {
						[s]: !0,
						...e
					};
				}
				if (n in o) {
					let t = o[n];
					if (t.isStructSchema()) {
						let r = {}, a = !1;
						for (let [o, s] of t.structIterator()) {
							let { eventHeader: t, eventPayload: c } = s.getMergedTraits();
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? At)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
							else if (t) {
								let t = e[n].headers[o]?.value;
								t != null && (r[o] = s.isNumericSchema() ? t && typeof t == "object" && "bytes" in t ? BigInt(t.toString()) : Number(t) : t);
							}
						}
						return { [n]: await this.readEventMember(t, i, a, r) };
					}
					return { [n]: await this.deserializer.read(t, i) };
				}
				return { $unknown: e };
			}), l = c[Symbol.asyncIterator](), u = await l.next();
			if (u.done) return c;
			if (u.value?.[s]) {
				if (!t) throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
				for (let e in u.value) _(u.value, e) && (n[e] = u.value[e]);
			}
			return { async *[Symbol.asyncIterator]() {
				for (u?.value?.[s] || (yield u.value);;) {
					let { done: e, value: t } = await l.next();
					if (e) break;
					yield t;
				}
			} };
		}
		async readEventMember(e, t, n, r) {
			let i, a = e.getSchema();
			if (Array.isArray(a) && a[0] === -3) {
				let e = a[1], t = Qe.for(e);
				this.compositeErrorRegistry?.copyFrom(t), i = (this.compositeErrorRegistry ?? t)?.getErrorCtor(a);
			}
			let o = n ? r : t.byteLength === 0 ? {} : await this.deserializer.read(e, t);
			if (i) {
				let t = o.message ?? o.Message ?? "Unknown", n = {}, r = e.getMergedTraits().error;
				return r && (n.$fault = r), Object.assign(new i({}), n, { message: t }, o);
			}
			return o;
		}
		writeEventBody(e, t, n) {
			let r = this.serializer, i = e, a = null, o, s = t.getSchema()[4].includes(e), c = {};
			if (s) {
				let i = t.getMemberSchema(e);
				if (i.isStructSchema()) {
					for (let [t, r] of i.structIterator()) {
						let { eventHeader: i, eventPayload: o } = r.getMergedTraits();
						if (o) a = t;
						else if (i) {
							let i = n[e][t], a = "binary";
							r.isNumericSchema() ? a = (-2) ** 31 <= i && i <= 2 ** 31 - 1 ? "integer" : "long" : r.isTimestampSchema() ? a = "timestamp" : r.isStringSchema() ? a = "string" : r.isBooleanSchema() && (a = "boolean"), i != null && (c[t] = {
								type: a,
								value: i
							}, delete n[e][t]);
						}
					}
					if (a !== null) {
						let t = i.getMemberSchema(a);
						t.isBlobSchema() ? o = "application/octet-stream" : t.isStringSchema() && (o = "text/plain"), r.write(t, n[e][a]);
					} else r.write(i, n[e]);
				} else if (i.isUnitSchema()) r.write(i, {});
				else throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.");
			} else {
				let [t, a] = n[e];
				i = t, r.write(15, a);
			}
			let l = r.flush() ?? /* @__PURE__ */ new Uint8Array();
			return {
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? wt)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), es = /* @__PURE__ */ n({
	EventStreamCodec: () => To,
	EventStreamMarshaller: () => Ko,
	EventStreamSerde: () => Qo,
	HeaderMarshaller: () => io,
	Int64: () => no,
	MessageDecoderStream: () => Do,
	MessageEncoderStream: () => ko,
	SmithyMessageDecoderStream: () => jo,
	SmithyMessageEncoderStream: () => No,
	UniversalEventStreamMarshaller: () => Bo,
	eventStreamSerdeProvider: () => Jo,
	getChunkedStream: () => Fo,
	getMessageUnmarshaller: () => Ro,
	getUnmarshalledStream: () => Lo,
	iterableToReadableStream: () => Wo,
	readableStreamToIterable: () => Uo,
	resolveEventStreamSerdeConfig: () => Xo,
	universalEventStreamSerdeProvider: () => Vo
}), ts = t((() => {
	Eo(), vo(), ro(), Oo(), Ao(), Mo(), Po(), Yo(), Go(), Ho(), Io(), zo(), Zo(), $o();
}));
b(), S();
var ns = class extends wa {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Qe(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return v;
	}
	getResponseType() {
		return fe;
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.serializer.setSerdeContext(e), this.deserializer.setSerdeContext(e), this.getPayloadCodec() && this.getPayloadCodec().setSerdeContext(e);
	}
	updateServiceEndpoint(e, t) {
		if ("url" in t) {
			e.protocol = t.url.protocol, e.hostname = t.url.hostname, e.port = t.url.port ? Number(t.url.port) : void 0, e.path = t.url.pathname, e.fragment = t.url.hash || void 0, e.username = t.url.username || void 0, e.password = t.url.password || void 0, e.query ||= {};
			for (let [n, r] of t.url.searchParams.entries()) e.query[n] = r;
			if (t.headers) for (let n in t.headers) _(t.headers, n) && (e.headers[n] = t.headers[n].join(", "));
			return e;
		}
		if (e.protocol = t.protocol, e.hostname = t.hostname, e.port = t.port ? Number(t.port) : void 0, e.path = t.path, e.query = { ...t.query }, t.headers) for (let n in t.headers) _(t.headers, n) && (e.headers[n] = t.headers[n]);
		return e;
	}
	setHostPrefix(e, t, n) {
		if (this.serdeContext?.disableHostPrefix) return;
		let r = x.of(t.input), i = He(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !_e(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
			}
		}
	}
	deserializeMetadata(e) {
		return {
			httpStatusCode: e.statusCode,
			requestId: e.headers["x-amzn-requestid"] ?? e.headers["x-amzn-request-id"] ?? e.headers["x-amz-request-id"],
			extendedRequestId: e.headers["x-amz-id-2"],
			cfId: e.headers["x-amz-cf-id"]
		};
	}
	resolveError(e, t, n) {
		let r = [
			-3,
			"",
			"Error",
			0,
			[],
			[],
			0
		], i;
		for (let r of n) for (let n of t) try {
			i = n === "*" ? r.getSchema(e) : r.getSchema(n + "#" + e);
			let t = r.getErrorCtor(i);
			if (t) return [
				i,
				t,
				"modeled"
			];
			{
				let e = r.getBaseException();
				if (e) {
					let t = r.getErrorCtor(e);
					if (t) return [
						i,
						t,
						"synthetic"
					];
				}
			}
		} catch {}
		for (let e of n) {
			let t = e.getBaseException();
			if (t) {
				let n = e.getErrorCtor(t);
				if (n) return [
					t,
					n,
					"synthetic"
				];
			}
		}
		return [
			r,
			Error,
			"native"
		];
	}
	async serializeEventStream({ eventStream: e, requestSchema: t, initialRequest: n }) {
		return (await this.loadEventStreamCapability()).serializeEventStream({
			eventStream: e,
			requestSchema: t,
			initialRequest: n
		});
	}
	async deserializeEventStream({ response: e, responseSchema: t, initialResponseContainer: n }) {
		return (await this.loadEventStreamCapability()).deserializeEventStream({
			response: e,
			responseSchema: t,
			initialResponseContainer: n
		});
	}
	async loadEventStreamCapability() {
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (ts(), es));
		return new e({
			marshaller: this.resolveEventStreamMarshaller(t),
			serializer: this.serializer,
			deserializer: this.deserializer,
			serdeContext: this.serdeContext,
			defaultContentType: this.getDefaultContentType(),
			compositeErrorRegistry: this.compositeErrorRegistry
		});
	}
	getDefaultContentType() {
		throw Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`);
	}
	async deserializeHttpMessage(e, t, n, r, i) {
		return [];
	}
	getEventStreamMarshaller() {
		let e = this.serdeContext;
		if (!e.eventStreamMarshaller) throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
		return e.eventStreamMarshaller;
	}
	resolveEventStreamMarshaller(e) {
		let t = this.serdeContext;
		return t.eventStreamMarshaller ? t.eventStreamMarshaller : e(this.serdeContext);
	}
};
b(), S(), w();
var rs = class extends ns {
	async serializeRequest(e, t, n) {
		let r = t && typeof t == "object" ? t : {}, i = this.serializer, a = {}, o = {}, s = await n.endpoint(), c = x.of(e?.input), l = [], u = [], d = !1, f, p = new v({
			protocol: "",
			hostname: "",
			port: void 0,
			path: "",
			fragment: void 0,
			query: a,
			headers: o,
			body: void 0
		});
		if (s) {
			this.updateServiceEndpoint(p, s), this.setHostPrefix(p, e, r);
			let t = He(e.traits);
			if (t.http) {
				p.method = t.http[0];
				let [e, n] = t.http[1].split("?");
				p.path == "/" ? p.path = e : p.path += e;
				let r = new URLSearchParams(n ?? "");
				for (let [e, t] of r) a[e] = t;
			}
		}
		for (let [e, t] of c.structIterator()) {
			let n = t.getMergedTraits() ?? {}, s = r[e];
			if (s == null && !t.isIdempotencyToken()) {
				if (n.httpLabel && (p.path.includes(`{${e}+}`) || p.path.includes(`{${e}}`))) throw Error(`No value provided for input HTTP label: ${e}.`);
			} else if (n.httpPayload) t.isStreaming() ? t.isStructSchema() ? r[e] && (f = await this.serializeEventStream({
				eventStream: r[e],
				requestSchema: c
			})) : f = s : (i.write(t, s), f = i.flush());
			else if (n.httpLabel) {
				i.write(t, s);
				let n = i.flush();
				p.path.includes(`{${e}+}`) ? p.path = p.path.replace(`{${e}+}`, n.split("/").map(Ca).join("/")) : p.path.includes(`{${e}}`) && (p.path = p.path.replace(`{${e}}`, Ca(n)));
			} else if (n.httpHeader) i.write(t, s), o[n.httpHeader.toLowerCase()] = String(i.flush());
			else if (typeof n.httpPrefixHeaders == "string") for (let e in s) {
				if (!_(s, e)) continue;
				let r = s[e], a = n.httpPrefixHeaders + e;
				i.write([t.getValueSchema(), { httpHeader: a }], r), o[a.toLowerCase()] = i.flush();
			}
			else n.httpQuery || n.httpQueryParams ? this.serializeQuery(t, s, a) : (d = !0, l.push(e), u.push(t));
		}
		if (d && r) {
			let [e, t] = (c.getName(!0) ?? "#Unknown").split("#"), n = c.getSchema()[6], a = [
				3,
				e,
				t,
				c.getMergedTraits(),
				l,
				u,
				void 0
			];
			n ? a[6] = n : a.pop(), i.write(a, r), f = i.flush();
		}
		return p.headers = o, p.query = a, p.body = f, p;
	}
	serializeQuery(e, t, n) {
		let r = this.serializer, i = e.getMergedTraits();
		if (i.httpQueryParams) {
			for (let r in t) if (_(t, r) && !(r in n)) {
				let a = t[r], o = e.getValueSchema();
				Object.assign(o.getMergedTraits(), {
					...i,
					httpQuery: r,
					httpQueryParams: void 0
				}), this.serializeQuery(o, a, n);
			}
		} else if (e.isListSchema()) {
			let a = !!e.getMergedTraits().sparse, o = [];
			for (let n of t) {
				r.write([e.getValueSchema(), i], n);
				let t = r.flush();
				(a || t !== void 0) && o.push(t);
			}
			n[i.httpQuery] = o;
		} else r.write([e, i], t), n[i.httpQuery] = r.flush();
	}
	async deserializeResponse(e, t, n) {
		let r = this.deserializer, i = x.of(e.output), a = {};
		if (n.statusCode >= 300) {
			let i = await Sa(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!_(n.headers, e)) continue;
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = await this.deserializeHttpMessage(i, t, n, a);
		if (o.length) {
			let e = await Sa(n.body, t);
			if (e.byteLength > 0) {
				let t = await r.read(i, e);
				for (let e of o) t[e] != null && (a[e] = t[e]);
			}
		} else o.discardResponseBody && await Sa(n.body, t);
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	async deserializeHttpMessage(e, t, n, r, i) {
		let a;
		a = r instanceof Set ? i : r;
		let o = !0, s = this.deserializer, c = x.of(e), l = [];
		for (let [e, r] of c.structIterator()) {
			let i = r.getMemberTraits();
			if (i.httpPayload) {
				if (o = !1, r.isStreaming()) r.isStructSchema() ? a[e] = await this.deserializeEventStream({
					response: n,
					responseSchema: c
				}) : a[e] = pa(n.body);
				else if (n.body) {
					let i = await Sa(n.body, t);
					i.byteLength > 0 && (a[e] = await s.read(r, i));
				}
			} else if (i.httpHeader) {
				let t = String(i.httpHeader).toLowerCase(), o = n.headers[t];
				if (o != null) {
					if (r.isListSchema()) {
						let n = r.getValueSchema();
						n.getMergedTraits().httpHeader = t;
						let i;
						i = n.isTimestampSchema() && n.getSchema() === 4 ? Fn(o, ",", 2) : Ln(o);
						let c = [];
						for (let e of i) c.push(await s.read(n, e.trim()));
						a[e] = c;
					} else a[e] = await s.read(r, o);
				}
			} else if (i.httpPrefixHeaders !== void 0) {
				a[e] = {};
				for (let t in n.headers) if (_(n.headers, t) && t.startsWith(i.httpPrefixHeaders)) {
					let o = n.headers[t], c = r.getValueSchema();
					c.getMergedTraits().httpHeader = t, a[e][t.slice(i.httpPrefixHeaders.length)] = await s.read(c, o);
				}
			} else i.httpResponseCode ? a[e] = n.statusCode : l.push(e);
		}
		return l.discardResponseBody = o, l;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function is(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
S(), w();
var as = class extends wa {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	read(e, t) {
		let n = x.of(e);
		if (n.isListSchema()) return Ln(t).map((e) => this.read(n.getValueSchema(), e));
		if (n.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? St)(t);
		if (n.isTimestampSchema()) switch (is(n, this.settings)) {
			case 5: return Mn(t);
			case 6: return Nn(t);
			case 7: return jn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (n.isStringSchema()) {
			let e = n.getMergedTraits().mediaType, r = t;
			if (e) return n.getMergedTraits().httpHeader && (r = this.base64ToUtf8(r)), (e === "application/json" || e.endsWith("+json")) && (r = gn.from(r)), r;
		}
		return n.isNumericSchema() ? Number(t) : n.isBigIntegerSchema() ? BigInt(t) : n.isBigDecimalSchema() ? new Bn(t, "bigDecimal") : n.isBooleanSchema() ? String(t).toLowerCase() === "true" : t;
	}
	base64ToUtf8(e) {
		return (this.serdeContext?.utf8Encoder ?? At)((this.serdeContext?.base64Decoder ?? St)(e));
	}
};
S(), w();
var os = class extends wa {
	codecDeserializer;
	stringDeserializer;
	constructor(e, t) {
		super(), this.codecDeserializer = e, this.stringDeserializer = new as(t);
	}
	setSerdeContext(e) {
		this.stringDeserializer.setSerdeContext(e), this.codecDeserializer.setSerdeContext(e), this.serdeContext = e;
	}
	read(e, t) {
		let n = x.of(e), r = n.getMergedTraits(), i = this.serdeContext?.utf8Encoder ?? At;
		if (r.httpHeader || r.httpResponseCode) return this.stringDeserializer.read(n, i(t));
		if (r.httpPayload) {
			if (n.isBlobSchema()) {
				let e = this.serdeContext?.utf8Decoder ?? wt;
				return typeof t == "string" ? e(t) : t;
			}
			if (n.isStringSchema()) return "byteLength" in t ? i(t) : t;
		}
		return this.codecDeserializer.read(n, t);
	}
};
S(), w();
var ss = class extends wa {
	settings;
	stringBuffer = "";
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = x.of(e);
		switch (typeof t) {
			case "object":
				if (t === null) {
					this.stringBuffer = "null";
					return;
				}
				if (n.isTimestampSchema()) {
					if (!(t instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${t} when schema expected Date in ${n.getName(!0)}`);
					switch (is(n, this.settings)) {
						case 5:
							this.stringBuffer = t.toISOString().replace(".000Z", "Z");
							break;
						case 6:
							this.stringBuffer = Xt(t);
							break;
						case 7:
							this.stringBuffer = String(t.getTime() / 1e3);
							break;
						default: console.warn("Missing timestamp format, using epoch seconds", t), this.stringBuffer = String(t.getTime() / 1e3);
					}
					return;
				}
				if (n.isBlobSchema() && "byteLength" in t) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? Et)(t);
					return;
				}
				if (n.isListSchema() && Array.isArray(t)) {
					let e = "";
					for (let r of t) {
						this.write([n.getValueSchema(), n.getMergedTraits()], r);
						let t = this.flush(), i = n.getValueSchema().isTimestampSchema() ? t : vn(t);
						e !== "" && (e += ", "), e += i;
					}
					this.stringBuffer = e;
					return;
				}
				this.stringBuffer = JSON.stringify(t, null, 2);
				break;
			case "string":
				let e = n.getMergedTraits().mediaType, r = t;
				if (e && ((e === "application/json" || e.endsWith("+json")) && (r = gn.from(r)), n.getMergedTraits().httpHeader)) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? Et)(r.toString());
					return;
				}
				this.stringBuffer = t;
				break;
			default: this.stringBuffer = n.isIdempotencyToken() ? xa() : String(t);
		}
	}
	flush() {
		let e = this.stringBuffer;
		return this.stringBuffer = "", e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/HttpInterceptingShapeSerializer.js
S();
var cs = class {
	codecSerializer;
	stringSerializer;
	buffer;
	constructor(e, t, n = new ss(t)) {
		this.codecSerializer = e, this.stringSerializer = n;
	}
	setSerdeContext(e) {
		this.codecSerializer.setSerdeContext(e), this.stringSerializer.setSerdeContext(e);
	}
	write(e, t) {
		let n = x.of(e), r = n.getMergedTraits();
		if (r.httpHeader || r.httpLabel || r.httpQuery) this.stringSerializer.write(n, t), this.buffer = this.stringSerializer.flush();
		else return this.codecSerializer.write(n, t);
	}
	flush() {
		if (this.buffer !== void 0) {
			let e = this.buffer;
			return this.buffer = void 0, e;
		}
		return this.codecSerializer.flush();
	}
}, ls = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
	setHttpHandler(t) {
		e.requestHandler = t;
	},
	httpHandler() {
		return e.requestHandler;
	},
	updateHttpClientConfig(t, n) {
		e.requestHandler?.updateHttpClientConfig(t, n);
	},
	httpHandlerConfigs() {
		return e.requestHandler.httpHandlerConfigs();
	}
}), us = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
b();
var ds = "content-length";
function fs(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (v.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(ds) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[ds]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var ps = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, ms = (e) => ({ applyToStack: (t) => {
	t.add(fs(e.bodyLengthChecker), ps);
} }), hs = (e) => encodeURIComponent(e).replace(/[!'()*]/g, gs), gs = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function _s(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = hs(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${hs(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${hs(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/service-error-classification/constants.js
var vs = [
	"BandwidthLimitExceeded",
	"EC2ThrottledException",
	"LimitExceededException",
	"PriorRequestNotComplete",
	"ProvisionedThroughputExceededException",
	"RequestLimitExceeded",
	"RequestThrottled",
	"RequestThrottledException",
	"SlowDown",
	"ThrottledException",
	"Throttling",
	"ThrottlingException",
	"TooManyRequestsException",
	"TransactionInProgressException"
], ys = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], bs = [
	500,
	502,
	503,
	504
], xs = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], Ss = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], Cs = (e) => e?.$retryable !== void 0, ws = (e) => e.$metadata?.clockSkewCorrected, Ts = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, Es = (e) => e.$metadata?.httpStatusCode === 429 || vs.includes(e.name) || e.$retryable?.throttling == 1, Ds = (e, t = 0) => e?.name !== "AbortError" && (Cs(e) || ws(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || ys.includes(e.name) || xs.includes(e?.code || "") || Ss.includes(e?.code || "") || bs.includes(e.$metadata?.httpStatusCode || 0) || Ts(e) || ks(e) || e.cause !== void 0 && t <= 10 && Ds(e.cause, t + 1)), Os = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !Ds(e);
	}
	return !1;
};
function ks(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var As = 2e4, js = "amz-sdk-invocation-id", Ms = "amz-sdk-request";
b(), pe(), w();
function Ns(e, t) {
	if (fe.isInstance(e)) for (let n in e.headers) {
		if (!_(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (nn(r).getTime() - Date.now()) / 1e3;
			} catch (e) {
				t?.trace?.("Failed to parse retry-after header"), t?.trace?.(e);
			}
			else r.match(/ GMT, ((\d+)|(\d+\.\d+))$/) ? i = Number(r.match(/ GMT, ([\d.]+)$/)?.[1]) : r.match(/^((\d+)|(\d+\.\d+))$/) ? i = Number(r) : Date.parse(r) >= Date.now() && (i = (Date.parse(r) - Date.now()) / 1e3);
			return isNaN(i) ? void 0 : new Date(Date.now() + i * 1e3);
		}
		if (r === "x-amz-retry-after") {
			let r = e.headers[n], i = Number(r);
			if (isNaN(i)) {
				t?.trace?.(`Failed to parse x-amz-retry-after=${r}`);
				return;
			}
			return new Date(Date.now() + i);
		}
	}
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/util.js
var Ps = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
y(), w();
function Fs(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (Ls(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = v.isInstance(d);
			for (f && (d.headers[js] = ba());;) try {
				f && (d.headers[Ms] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = Rs(n, t.logger);
				if (c = Ps(n), f && e(d)) throw (r.logger instanceof gt ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await Is(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var Is = (e) => new Promise((t) => setTimeout(t, e)), Ls = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, Rs = (e, t) => {
	let n = {
		error: e,
		errorType: zs(e)
	}, r = Ns(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, zs = (e) => Es(e) ? "THROTTLING" : Ds(e) ? "TRANSIENT" : Os(e) ? "SERVER_ERROR" : "CLIENT_ERROR", Bs = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function Vs(e) {
	let t = Fs(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), Bs);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var Hs = class e {
	static setTimeoutFn = (e, t) => setTimeout(e, t);
	beta;
	minCapacity;
	minFillRate;
	scaleConstant;
	smooth;
	enabled = !1;
	availableTokens = 0;
	lastMaxRate = 0;
	measuredTxRate = 0;
	requestCount = 0;
	fillRate;
	lastThrottleTime;
	lastTimestamp = 0;
	lastTxRateBucket;
	maxCapacity;
	timeWindow = 0;
	constructor(e) {
		this.beta = e?.beta ?? .7, this.minCapacity = e?.minCapacity ?? 1, this.minFillRate = e?.minFillRate ?? .5, this.scaleConstant = e?.scaleConstant ?? .4, this.smooth = e?.smooth ?? .8, this.lastThrottleTime = this.getCurrentTimeInSeconds(), this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity;
	}
	async getSendToken() {
		return this.acquireTokenBucket(1);
	}
	updateClientSendingRate(e) {
		let t;
		this.updateMeasuredRate();
		let n = e;
		if (n?.errorType === "THROTTLING" || Es(n?.error ?? e)) {
			let e = this.enabled ? Math.min(this.measuredTxRate, this.fillRate) : this.measuredTxRate;
			this.lastMaxRate = e, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), t = this.cubicThrottle(e), this.enableTokenBucket();
		} else this.calculateTimeWindow(), t = this.cubicSuccess(this.getCurrentTimeInSeconds());
		let r = Math.min(t, 2 * this.measuredTxRate);
		this.updateTokenBucketRate(r);
	}
	getCurrentTimeInSeconds() {
		return Date.now() / 1e3;
	}
	async acquireTokenBucket(t) {
		if (this.enabled) {
			for (this.refillTokenBucket(); t > this.availableTokens;) {
				let n = (t - this.availableTokens) / this.fillRate * 1e3;
				await new Promise((t) => e.setTimeoutFn(t, n)), this.refillTokenBucket();
			}
			this.availableTokens -= t;
		}
	}
	refillTokenBucket() {
		let e = this.getCurrentTimeInSeconds();
		if (!this.lastTimestamp) {
			this.lastTimestamp = e;
			return;
		}
		let t = (e - this.lastTimestamp) * this.fillRate;
		this.availableTokens = Math.min(this.maxCapacity, this.availableTokens + t), this.lastTimestamp = e;
	}
	calculateTimeWindow() {
		this.timeWindow = this.getPrecise((this.lastMaxRate * (1 - this.beta) / this.scaleConstant) ** (1 / 3));
	}
	cubicThrottle(e) {
		return this.getPrecise(e * this.beta);
	}
	cubicSuccess(e) {
		return this.getPrecise(this.scaleConstant * (e - this.lastThrottleTime - this.timeWindow) ** 3 + this.lastMaxRate);
	}
	enableTokenBucket() {
		this.enabled = !0;
	}
	updateTokenBucketRate(e) {
		this.refillTokenBucket(), this.fillRate = Math.max(e, this.minFillRate), this.maxCapacity = Math.max(e, this.minCapacity), this.availableTokens = Math.min(this.availableTokens, this.maxCapacity);
	}
	updateMeasuredRate() {
		let e = this.getCurrentTimeInSeconds(), t = Math.floor(e * 2) / 2;
		if (this.requestCount++, t > this.lastTxRateBucket) {
			let e = this.requestCount / (t - this.lastTxRateBucket);
			this.measuredTxRate = this.getPrecise(e * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = t;
		}
	}
	getPrecise(e) {
		return parseFloat(e.toFixed(8));
	}
}, Us = class e {
	static v2026 = typeof process < "u" && {}.SMITHY_NEW_RETRIES_2026 === "true";
	static delay() {
		return e.v2026 ? 50 : 100;
	}
	static throttlingDelay() {
		return e.v2026 ? 1e3 : 500;
	}
	static cost() {
		return e.v2026 ? 14 : 5;
	}
	static throttlingCost() {
		return e.v2026 ? 5 : 10;
	}
	static modifiedCostType() {
		return e.v2026 ? "THROTTLING" : "TRANSIENT";
	}
}, Ws = class {
	x = Us.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, As);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, Gs = class {
	delay;
	count;
	cost;
	longPoll;
	$retryLog = { acquisitionDelay: 0 };
	constructor(e, t, n, r) {
		this.delay = e, this.count = t, this.cost = n, this.longPoll = r;
	}
	getRetryCount() {
		return this.count;
	}
	getRetryDelay() {
		return Math.min(As, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Ks;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Ks ||= {});
var qs = Ks.STANDARD, Js = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, Ys = class {
	mode = Ks.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= Us.delay(), this.retryBackoffStrategy ??= new Ws();
	}
	async acquireInitialRetryToken(e) {
		return new Gs(Us.delay(), 0, void 0, Us.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? Us.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new Gs(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = Us.v2026 && r === Js.capacity && a ? s : 0;
				e > 0 && await new Promise((t) => setTimeout(t, e));
			}
		}
		throw Error("No retry token available");
	}
	recordSuccess(e) {
		this.capacity = Math.min(500, this.capacity + (e.getRetryCost() ?? 1));
	}
	getCapacity() {
		return this.capacity;
	}
	async maxAttempts() {
		return this.maxAttemptsProvider();
	}
	async getMaxAttempts() {
		try {
			return await this.maxAttemptsProvider();
		} catch {
			return console.warn("Max attempts provider could not resolve. Using default of 3"), 3;
		}
	}
	retryCode(e, t, n) {
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : Js.incompatible, a = r < n ? 0 : Js.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : Js.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === Us.modifiedCostType() ? Us.throttlingCost() : Us.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, Xs = class {
	mode = Ks.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new Hs(), this.standardRetryStrategy = t ? new Ys({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new Ys(e);
	}
	async acquireInitialRetryToken(e) {
		let t = await this.standardRetryStrategy.acquireInitialRetryToken(e);
		return await this.rateLimiter.getSendToken(), t;
	}
	async refreshRetryTokenForRetry(e, t) {
		this.rateLimiter.updateClientSendingRate(t);
		let n = await this.standardRetryStrategy.refreshRetryTokenForRetry(e, t);
		return await this.rateLimiter.getSendToken(), n;
	}
	recordSuccess(e) {
		this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(e);
	}
	async maxAttemptsProvider() {
		return this.standardRetryStrategy.maxAttempts();
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/configurations.js
be();
var Zs = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = Us.delay() } = t ?? {}, o = ye(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await ye(r)() === Ks.ADAPTIVE ? new Xs(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new Ys({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, Qs = Vs(d);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
Us.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function T(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
y();
function $s(e) {
	return e;
}
var ec = (e) => (t) => async (n) => {
	if (!v.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, tc = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, nc = (e) => ({ applyToStack: (t) => {
	t.add(ec(e), tc);
} }), rc = () => (e, t) => async (n) => {
	try {
		let r = await e(n), { clientName: i, commandName: a, logger: o, dynamoDbDocumentClientOptions: s = {} } = t, { overrideInputFilterSensitiveLog: c, overrideOutputFilterSensitiveLog: l } = s, u = c ?? t.inputFilterSensitiveLog, d = l ?? t.outputFilterSensitiveLog, { $metadata: f, ...p } = r.output;
		return o?.info?.({
			clientName: i,
			commandName: a,
			input: u(n.input),
			output: d(p),
			metadata: f
		}), r;
	} catch (e) {
		let { clientName: r, commandName: i, logger: a, dynamoDbDocumentClientOptions: o = {} } = t, { overrideInputFilterSensitiveLog: s } = o, c = s ?? t.inputFilterSensitiveLog;
		throw a?.error?.({
			clientName: r,
			commandName: i,
			input: c(n.input),
			error: e,
			metadata: e.$metadata
		}), e;
	}
}, ic = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, ac = (e) => ({ applyToStack: (e) => {
	e.add(rc(), ic);
} }), oc = (e) => ({ applyToStack: (e) => {} }), sc = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
b();
function cc(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var lc = (e, t) => (n, r) => async (i) => {
	let a = sc(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = cc(e.httpAuthSchemes), s = ce(r), c = [];
	for (let n of a) {
		let i = o.get(n.schemeId);
		if (!i) {
			c.push(`HttpAuthScheme \`${n.schemeId}\` was not enabled for this service.`);
			continue;
		}
		let a = i.identityProvider(await t.identityProviderConfigProvider(e));
		if (!a) {
			c.push(`HttpAuthScheme \`${n.schemeId}\` did not have an IdentityProvider configured.`);
			continue;
		}
		let { identityProperties: l = {}, signingProperties: u = {} } = n.propertiesExtractor?.(e, r) || {};
		n.identityProperties = Object.assign(n.identityProperties || {}, l), n.signingProperties = Object.assign(n.signingProperties || {}, u), s.selectedHttpAuthScheme = {
			httpAuthOption: n,
			identity: await a(n.identityProperties),
			signer: i.signer
		};
		break;
	}
	if (!s.selectedHttpAuthScheme) throw Error(c.join("\n"));
	return n(i);
}, uc = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, dc = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(lc(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), uc);
} });
y(), b();
var fc = (e) => (e) => {
	throw e;
}, pc = (e, t) => {}, mc = (e) => (e, t) => async (n) => {
	if (!v.isInstance(n.request)) return e(n);
	let r = ce(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || fc)(i));
	return (o.successHandler || pc)(s.response, i), s;
}, hc = {
	step: "finalizeRequest",
	tags: ["HTTP_SIGNING"],
	name: "httpSigningMiddleware",
	aliases: [
		"apiKeyMiddleware",
		"tokenMiddleware",
		"awsAuthMiddleware"
	],
	override: !0,
	relation: "after",
	toMiddleware: "retryMiddleware"
}, gc = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(mc(e), hc);
} }), _c = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
b();
var vc = class {
	authSchemes = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t in e) {
			if (!_(e, t)) continue;
			let n = e[t];
			n !== void 0 && this.authSchemes.set(t, n);
		}
	}
	getIdentityProvider(e) {
		return this.authSchemes.get(e);
	}
}, yc = ((e) => function(t) {
	return bc(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), bc = (e) => e.expiration !== void 0, xc = (e, t, n) => {
	if (e === void 0) return;
	let r = typeof e == "function" ? e : async () => Promise.resolve(e), i, a, o, s = !1, c = async (e) => {
		a ||= r(e);
		try {
			i = await a, o = !0, s = !1;
		} finally {
			a = void 0;
		}
		return i;
	};
	return t === void 0 ? async (e) => ((!o || e?.forceRefresh) && (i = await c(e)), i) : async (e) => ((!o || e?.forceRefresh) && (i = await c(e)), s ? i : n(i) ? (t(i) && await c(e), i) : (s = !0, i));
};
function Sc(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Cc(e) {
	let t = _c(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!Sc(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var wc = {
	partitions: [
		{
			id: "aws",
			outputs: {
				dnsSuffix: "amazonaws.com",
				dualStackDnsSuffix: "api.aws",
				implicitGlobalRegion: "us-east-1",
				name: "aws",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
			regions: {
				"af-south-1": { description: "Africa (Cape Town)" },
				"ap-east-1": { description: "Asia Pacific (Hong Kong)" },
				"ap-east-2": { description: "Asia Pacific (Taipei)" },
				"ap-northeast-1": { description: "Asia Pacific (Tokyo)" },
				"ap-northeast-2": { description: "Asia Pacific (Seoul)" },
				"ap-northeast-3": { description: "Asia Pacific (Osaka)" },
				"ap-south-1": { description: "Asia Pacific (Mumbai)" },
				"ap-south-2": { description: "Asia Pacific (Hyderabad)" },
				"ap-southeast-1": { description: "Asia Pacific (Singapore)" },
				"ap-southeast-2": { description: "Asia Pacific (Sydney)" },
				"ap-southeast-3": { description: "Asia Pacific (Jakarta)" },
				"ap-southeast-4": { description: "Asia Pacific (Melbourne)" },
				"ap-southeast-5": { description: "Asia Pacific (Malaysia)" },
				"ap-southeast-6": { description: "Asia Pacific (New Zealand)" },
				"ap-southeast-7": { description: "Asia Pacific (Thailand)" },
				"aws-global": { description: "aws global region" },
				"ca-central-1": { description: "Canada (Central)" },
				"ca-west-1": { description: "Canada West (Calgary)" },
				"eu-central-1": { description: "Europe (Frankfurt)" },
				"eu-central-2": { description: "Europe (Zurich)" },
				"eu-north-1": { description: "Europe (Stockholm)" },
				"eu-south-1": { description: "Europe (Milan)" },
				"eu-south-2": { description: "Europe (Spain)" },
				"eu-west-1": { description: "Europe (Ireland)" },
				"eu-west-2": { description: "Europe (London)" },
				"eu-west-3": { description: "Europe (Paris)" },
				"il-central-1": { description: "Israel (Tel Aviv)" },
				"me-central-1": { description: "Middle East (UAE)" },
				"me-south-1": { description: "Middle East (Bahrain)" },
				"mx-central-1": { description: "Mexico (Central)" },
				"sa-east-1": { description: "South America (Sao Paulo)" },
				"us-east-1": { description: "US East (N. Virginia)" },
				"us-east-2": { description: "US East (Ohio)" },
				"us-west-1": { description: "US West (N. California)" },
				"us-west-2": { description: "US West (Oregon)" }
			}
		},
		{
			id: "aws-cn",
			outputs: {
				dnsSuffix: "amazonaws.com.cn",
				dualStackDnsSuffix: "api.amazonwebservices.com.cn",
				implicitGlobalRegion: "cn-northwest-1",
				name: "aws-cn",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^cn\\-\\w+\\-\\d+$",
			regions: {
				"aws-cn-global": { description: "aws-cn global region" },
				"cn-north-1": { description: "China (Beijing)" },
				"cn-northwest-1": { description: "China (Ningxia)" }
			}
		},
		{
			id: "aws-eusc",
			outputs: {
				dnsSuffix: "amazonaws.eu",
				dualStackDnsSuffix: "api.amazonwebservices.eu",
				implicitGlobalRegion: "eusc-de-east-1",
				name: "aws-eusc",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
			regions: { "eusc-de-east-1": { description: "AWS European Sovereign Cloud (Germany)" } }
		},
		{
			id: "aws-iso",
			outputs: {
				dnsSuffix: "c2s.ic.gov",
				dualStackDnsSuffix: "api.aws.ic.gov",
				implicitGlobalRegion: "us-iso-east-1",
				name: "aws-iso",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
			regions: {
				"aws-iso-global": { description: "aws-iso global region" },
				"us-iso-east-1": { description: "US ISO East" },
				"us-iso-west-1": { description: "US ISO WEST" }
			}
		},
		{
			id: "aws-iso-b",
			outputs: {
				dnsSuffix: "sc2s.sgov.gov",
				dualStackDnsSuffix: "api.aws.scloud",
				implicitGlobalRegion: "us-isob-east-1",
				name: "aws-iso-b",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
			regions: {
				"aws-iso-b-global": { description: "aws-iso-b global region" },
				"us-isob-east-1": { description: "US ISOB East (Ohio)" },
				"us-isob-west-1": { description: "US ISOB West" }
			}
		},
		{
			id: "aws-iso-e",
			outputs: {
				dnsSuffix: "cloud.adc-e.uk",
				dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
				implicitGlobalRegion: "eu-isoe-west-1",
				name: "aws-iso-e",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
			regions: {
				"aws-iso-e-global": { description: "aws-iso-e global region" },
				"eu-isoe-west-1": { description: "EU ISOE West" }
			}
		},
		{
			id: "aws-iso-f",
			outputs: {
				dnsSuffix: "csp.hci.ic.gov",
				dualStackDnsSuffix: "api.aws.hci.ic.gov",
				implicitGlobalRegion: "us-isof-south-1",
				name: "aws-iso-f",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
			regions: {
				"aws-iso-f-global": { description: "aws-iso-f global region" },
				"us-isof-east-1": { description: "US ISOF EAST" },
				"us-isof-south-1": { description: "US ISOF SOUTH" }
			}
		},
		{
			id: "aws-us-gov",
			outputs: {
				dnsSuffix: "amazonaws.com",
				dualStackDnsSuffix: "api.aws",
				implicitGlobalRegion: "us-gov-west-1",
				name: "aws-us-gov",
				supportsDualStack: !0,
				supportsFIPS: !0
			},
			regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
			regions: {
				"aws-us-gov-global": { description: "aws-us-gov global region" },
				"us-gov-east-1": { description: "AWS GovCloud (US-East)" },
				"us-gov-west-1": { description: "AWS GovCloud (US-West)" }
			}
		}
	],
	version: "1.1"
}, Tc = "", Ec = (e) => {
	let { partitions: t } = wc;
	for (let n of t) {
		let { regions: t, outputs: r } = n;
		for (let [n, i] of Object.entries(t)) if (n === e) return {
			...r,
			...i
		};
	}
	for (let n of t) {
		let { regionRegex: t, outputs: r } = n;
		if (new RegExp(t).test(e)) return { ...r };
	}
	let n = t.find((e) => e.id === "aws");
	if (!n) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
	return { ...n.outputs };
}, Dc = () => Tc, Oc = /\d{12}\.ddb/;
async function kc(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && T(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Ks.ADAPTIVE:
				T(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Ks.STANDARD: T(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(Oc) && T(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				T(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				T(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": T(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && T(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) T(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Ac = "user-agent", jc = "x-amz-user-agent", Mc = /[^!$%&'*+\-.^_`|~\w]/g, Nc = /[^!$%&'*+\-.^_`|~\w#]/g, Pc = 1024;
function Fc(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= Pc) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
y();
var Ic = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!v.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(Lc) || [], s = (await e.defaultUserAgentProvider()).map(Lc);
	await kc(n, e, r);
	let c = n;
	s.push(`m/${Fc(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(Lc) || [], u = await e.userAgentAppId();
	u && s.push(Lc(["app", `${u}`]));
	let d = Dc(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[jc] = f : (p && (a[jc] = a["x-amz-user-agent"] ? `${a[Ac]} ${p}` : p), a[Ac] = f), t({
		...r,
		request: i
	});
}, Lc = (e) => {
	let t = e[0].split("/").map((e) => e.replace(Mc, "-")).join("/"), n = e[1]?.replace(Nc, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
	return i === "api" && (a = a.toLowerCase()), [
		i,
		a,
		n
	].filter((e) => e && e.length > 0).reduce((e, t, n) => {
		switch (n) {
			case 0: return t;
			case 1: return `${e}/${t}`;
			default: return `${e}#${t}`;
		}
	}, "");
}, Rc = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, zc = (e) => ({ applyToStack: (t) => {
	t.add(Ic(e), Rc);
} }), Bc = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? Vc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? Vc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, Vc = {
	os(e) {
		if (/iPhone|iPad|iPod/.test(e)) return "iOS";
		if (/Macintosh|Mac OS X/.test(e)) return "macOS";
		if (/Windows NT/.test(e)) return "Windows";
		if (/Android/.test(e)) return "Android";
		if (/Linux/.test(e)) return "Linux";
	},
	browser(e) {
		if (/EdgiOS|EdgA|Edg\//.test(e)) return "Microsoft Edge";
		if (/Firefox\//.test(e)) return "Firefox";
		if (/Chrome\//.test(e)) return "Chrome";
		if (/Safari\//.test(e)) return "Safari";
	}
};
Hi(), ri();
var Hc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!Hc(t)) return !1;
		return !0;
	}
	return !(!he(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || ni(e));
}, Uc = ":", Wc = "/", Gc = (e) => {
	let t = e.split(Uc);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(Uc) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(Wc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
Hi();
var Kc = {
	isVirtualHostableS3Bucket: Hc,
	parseArn: Gc,
	partition: Ec
};
zr.aws = Kc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var qc = (e, t, n) => {
	let r, i, a, o = !1, s = async () => {
		i ||= e();
		try {
			r = await i, a = !0, o = !1;
		} finally {
			i = void 0;
		}
		return r;
	};
	return t === void 0 ? async (e) => ((!a || e?.forceRefresh) && (r = await s()), r) : async (e) => ((!a || e?.forceRefresh) && (r = await s()), o ? r : n && !n(r) ? (o = !0, r) : (t(r) && await s(), r));
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/config-resolver/regionConfig/checkRegion.js
b();
var Jc = /* @__PURE__ */ new Set(), Yc = (e, t = he) => {
	if (!Jc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else Jc.add(e);
}, Xc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), Zc = (e) => Xc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, Qc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = Zc(typeof t == "function" ? await t() : t);
			return Yc(e), e;
		},
		useFipsEndpoint: async () => Xc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, $c = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], el = ({ defaultsMode: e } = {}) => qc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(tl() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${$c.join(", ")}, got ${t}`);
	}
}), tl = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, nl = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), rl = (e) => ({ region: e.region() }), il = (e, { requestChecksumRequired: t, requestAlgorithmMember: n, requestChecksumCalculation: i }) => {
	if (!n) return i === r.WHEN_SUPPORTED || t ? l : void 0;
	if (e[n]) return e[n];
}, al = (e) => e === s.MD5 ? "content-md5" : `x-amz-checksum-${e.toLowerCase()}`, ol = (e, t) => {
	let n = e.toLowerCase();
	for (let e of Object.keys(t)) if (n === e.toLowerCase()) return !0;
	return !1;
}, sl = (e, t) => {
	let n = e.toLowerCase();
	for (let e of Object.keys(t)) if (e.toLowerCase().startsWith(n)) return !0;
	return !1;
};
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/isStreaming.js
w();
var cl = (e) => e !== void 0 && typeof e != "string" && !ArrayBuffer.isView(e) && !er(e), ll = /* @__PURE__ */ new Uint32Array(256);
for (let e = 0; e < 256; ++e) {
	let t = e;
	for (let e = 0; e < 8; ++e) t = t & 1 ? 2197175160 ^ t >>> 1 : t >>> 1;
	ll[e] = t >>> 0;
}
var ul = class {
	digestLength = 4;
	crc = 4294967295;
	update(e) {
		let t = this.crc;
		for (let n = 0; n < e.length; ++n) t = t >>> 8 ^ ll[(t ^ e[n]) & 255];
		this.crc = t;
	}
	async digest() {
		let e = (this.crc ^ 4294967295) >>> 0, t = /* @__PURE__ */ new Uint8Array(4);
		return t[0] = e >>> 24, t[1] = e >>> 16 & 255, t[2] = e >>> 8 & 255, t[3] = e & 255, t;
	}
	reset() {
		this.crc = 4294967295;
	}
}, dl = () => {
	let e = Array(8);
	for (let t = 0; t < 8; t++) {
		let n = Array(512);
		for (let e = 0; e < 256; e++) {
			let r = BigInt(e);
			for (let e = 0; e < 8 * (t + 1); e++) r & 1n ? r = r >> 1n ^ 11127430586519243189n : r >>= 1n;
			n[e * 2] = Number(r >> 32n & 4294967295n), n[e * 2 + 1] = Number(r & 4294967295n);
		}
		e[t] = new Uint32Array(n);
	}
	return e;
}, fl, pl, ml, hl, gl, _l, vl, yl, bl, xl = () => {
	fl || (fl = dl(), [pl, ml, hl, gl, _l, vl, yl, bl] = fl);
}, Sl = class {
	c1 = 0;
	c2 = 0;
	constructor() {
		xl(), this.reset();
	}
	update(e) {
		let t = e.length, n = 0, r = this.c1, i = this.c2;
		for (; n + 8 <= t;) {
			let t = ((i ^ e[n++]) & 255) << 1, a = ((i >>> 8 ^ e[n++]) & 255) << 1, o = ((i >>> 16 ^ e[n++]) & 255) << 1, s = ((i >>> 24 ^ e[n++]) & 255) << 1, c = ((r ^ e[n++]) & 255) << 1, l = ((r >>> 8 ^ e[n++]) & 255) << 1, u = ((r >>> 16 ^ e[n++]) & 255) << 1, d = ((r >>> 24 ^ e[n++]) & 255) << 1;
			r = bl[t] ^ yl[a] ^ vl[o] ^ _l[s] ^ gl[c] ^ hl[l] ^ ml[u] ^ pl[d], i = bl[t + 1] ^ yl[a + 1] ^ vl[o + 1] ^ _l[s + 1] ^ gl[c + 1] ^ hl[l + 1] ^ ml[u + 1] ^ pl[d + 1];
		}
		for (; n < t;) {
			let t = ((i ^ e[n]) & 255) << 1;
			i = (i >>> 8 | (r & 255) << 24) >>> 0, r = r >>> 8 ^ pl[t], i ^= pl[t + 1], ++n;
		}
		this.c1 = r, this.c2 = i;
	}
	async digest() {
		let e = this.c1 ^ 4294967295, t = this.c2 ^ 4294967295;
		return new Uint8Array([
			e >>> 24,
			e >>> 16 & 255,
			e >>> 8 & 255,
			e & 255,
			t >>> 24,
			t >>> 16 & 255,
			t >>> 8 & 255,
			t & 255
		]);
	}
	reset() {
		this.c1 = 4294967295, this.c2 = 4294967295;
	}
}, Cl = [
	s.CRC32,
	s.CRC32C,
	s.CRC64NVME,
	s.SHA1,
	s.SHA256
], wl = [
	s.SHA256,
	s.SHA1,
	s.CRC32,
	s.CRC32C,
	s.CRC64NVME
];
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/selectChecksumAlgorithmFunction.js
za();
var Tl = (e, t) => {
	let { checksumAlgorithms: n = {} } = t;
	switch (e) {
		case s.MD5: return n?.MD5 ?? t.md5;
		case s.CRC32: return n?.CRC32 ?? Ra;
		case s.CRC32C: return n?.CRC32C ?? ul;
		case s.CRC64NVME: return n?.CRC64NVME ?? Sl;
		case s.SHA1: return n?.SHA1 ?? t.sha1;
		case s.SHA256: return n?.SHA256 ?? t.sha256;
		default:
			if (n?.[e]) return n[e];
			throw Error(`The checksum algorithm "${e}" is not supported by the client. Select one of ${Cl}, or provide an implementation to  the client constructor checksums field.`);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/stringHasher.js
w();
var El = (e, t) => {
	let n = new e();
	return n.update(Xn(t || "")), n.digest();
};
y(), w();
var Dl = {
	name: "flexibleChecksumsMiddleware",
	step: "build",
	tags: ["BODY_CHECKSUM"],
	override: !0
}, Ol = (e, t) => (n, i) => async (a) => {
	if (!v.isInstance(a.request) || sl("x-amz-checksum-", a.request.headers)) return n(a);
	let { request: o, input: c } = a, { body: u, headers: d } = o, { base64Encoder: f, streamHasher: p } = e, { requestChecksumRequired: m, requestAlgorithmMember: h } = t, g = await e.requestChecksumCalculation(), ee = h?.name, te = h?.httpHeader;
	ee && !c[ee] && (g === r.WHEN_SUPPORTED || m) && (c[ee] = l, te && (d[te] = l));
	let ne = il(c, {
		requestChecksumRequired: m,
		requestAlgorithmMember: h?.name,
		requestChecksumCalculation: g
	}), re = u, ie = d;
	if (ne) {
		switch (ne) {
			case s.CRC32:
				T(i, "FLEXIBLE_CHECKSUMS_REQ_CRC32", "U");
				break;
			case s.CRC32C:
				T(i, "FLEXIBLE_CHECKSUMS_REQ_CRC32C", "V");
				break;
			case s.CRC64NVME:
				T(i, "FLEXIBLE_CHECKSUMS_REQ_CRC64", "W");
				break;
			case s.SHA1:
				T(i, "FLEXIBLE_CHECKSUMS_REQ_SHA1", "X");
				break;
			case s.SHA256: T(i, "FLEXIBLE_CHECKSUMS_REQ_SHA256", "Y");
		}
		let t = al(ne), n = Tl(ne, e);
		if (cl(u)) {
			let { getAwsChunkedEncodingStream: r, bodyLengthChecker: a } = e;
			re = r(typeof e.requestStreamBufferSize == "number" && e.requestStreamBufferSize >= 8192 ? ia(u, e.requestStreamBufferSize, i.logger) : u, {
				base64Encoder: f,
				bodyLengthChecker: a,
				checksumLocationName: t,
				checksumAlgorithmFn: n,
				streamHasher: p
			}), ie = {
				...d,
				"content-encoding": d["content-encoding"] ? `${d["content-encoding"]},aws-chunked` : "aws-chunked",
				"transfer-encoding": "chunked",
				"x-amz-decoded-content-length": d["content-length"],
				"x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
				"x-amz-trailer": t
			}, delete ie["content-length"];
		} else if (!ol(t, d)) {
			let e = await El(n, u);
			ie = {
				...d,
				[t]: f(e)
			};
		}
	}
	try {
		return await n({
			...a,
			request: {
				...o,
				headers: ie,
				body: re
			}
		});
	} catch (e) {
		if (e instanceof Error && e.name === "InvalidChunkSizeError") try {
			e.message.endsWith(".") || (e.message += "."), e.message += " Set [requestStreamBufferSize=number e.g. 65_536] in client constructor to instruct AWS SDK to buffer your input stream.";
		} catch {}
		throw e;
	}
}, kl = {
	name: "flexibleChecksumsInputMiddleware",
	toMiddleware: "serializerMiddleware",
	relation: "before",
	tags: ["BODY_CHECKSUM"],
	override: !0
}, Al = (e, t) => (n, i) => async (o) => {
	let s = o.input, { requestValidationModeMember: c } = t, l = await e.requestChecksumCalculation(), u = await e.responseChecksumValidation();
	switch (l) {
		case r.WHEN_REQUIRED:
			T(i, "FLEXIBLE_CHECKSUMS_REQ_WHEN_REQUIRED", "a");
			break;
		case r.WHEN_SUPPORTED: T(i, "FLEXIBLE_CHECKSUMS_REQ_WHEN_SUPPORTED", "Z");
	}
	switch (u) {
		case a.WHEN_REQUIRED:
			T(i, "FLEXIBLE_CHECKSUMS_RES_WHEN_REQUIRED", "c");
			break;
		case a.WHEN_SUPPORTED: T(i, "FLEXIBLE_CHECKSUMS_RES_WHEN_SUPPORTED", "b");
	}
	return c && !s[c] && u === a.WHEN_SUPPORTED && (s[c] = "ENABLED"), n(o);
}, jl = (e = []) => {
	let t = [], n = wl.length;
	for (let r of e) {
		let e = wl.indexOf(r);
		e === -1 ? t[n++] = r : t[e] = r;
	}
	return t.filter(Boolean);
}, Ml = (e) => {
	let t = e.lastIndexOf("-");
	if (t !== -1) {
		let n = e.slice(t + 1);
		if (!n.startsWith("0")) {
			let e = parseInt(n, 10);
			if (!isNaN(e) && e >= 1 && e <= 1e4) return !0;
		}
	}
	return !1;
}, Nl = async (e, { checksumAlgorithmFn: t, base64Encoder: n }) => n(await El(t, e));
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/validateChecksumFromResponse.js
w();
var Pl = async (e, { config: t, responseAlgorithms: n, logger: r }) => {
	let i = jl(n), { body: a, headers: o } = e;
	for (let n of i) {
		let i = al(n), c = o[i];
		if (c) {
			let o;
			try {
				o = Tl(n, t);
			} catch (e) {
				if (n === s.CRC64NVME) {
					r?.warn(`Skipping ${s.CRC64NVME} checksum validation: ${e.message}`);
					continue;
				}
				throw e;
			}
			let { base64Encoder: l } = t;
			if (cl(a)) {
				e.body = Yi({
					expectedChecksum: c,
					checksumSourceLocation: i,
					checksum: new o(),
					source: a,
					base64Encoder: l
				});
				return;
			}
			let u = await Nl(a, {
				checksumAlgorithmFn: o,
				base64Encoder: l
			});
			if (u === c) break;
			throw Error(`Checksum mismatch: expected "${u}" but received "${c}" in response header "${i}".`);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/flexibleChecksumsResponseMiddleware.js
y();
var Fl = {
	name: "flexibleChecksumsResponseMiddleware",
	toMiddleware: "deserializerMiddleware",
	relation: "after",
	tags: ["BODY_CHECKSUM"],
	override: !0
}, Il = (e, t) => (n, r) => async (i) => {
	if (!v.isInstance(i.request)) return n(i);
	let a = i.input, o = await n(i), s = o.response, { requestValidationModeMember: c, responseAlgorithms: l } = t;
	if (c && a[c] === "ENABLED") {
		let { clientName: t, commandName: n } = r, i = Object.keys(e.checksumAlgorithms ?? {}).filter((e) => {
			let t = al(e);
			return s.headers[t] !== void 0;
		}), a = jl([...l ?? [], ...i]);
		if (t === "S3Client" && n === "GetObjectCommand" && a.every((e) => {
			let t = al(e), n = s.headers[t];
			return !n || Ml(n);
		})) return o;
		await Pl(s, {
			config: e,
			responseAlgorithms: a,
			logger: r.logger
		});
	}
	return o;
}, Ll = (e, t) => ({ applyToStack: (n) => {
	n.add(Ol(e, t), Dl), n.addRelativeTo(Al(e, t), kl), n.addRelativeTo(Il(e, t), Fl);
} });
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/resolveFlexibleChecksumsConfig.js
be();
var Rl = (e) => {
	let { requestChecksumCalculation: t, responseChecksumValidation: n, requestStreamBufferSize: r } = e;
	return Object.assign(e, {
		requestChecksumCalculation: ye(t ?? i),
		responseChecksumValidation: ye(n ?? o),
		requestStreamBufferSize: Number(r ?? 0),
		checksumAlgorithms: e.checksumAlgorithms ?? {}
	});
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-check-content-length-header/check-content-length-header.js
y();
var zl = "content-length", Bl = "x-amz-decoded-content-length";
function Vl() {
	return (e, t) => async (n) => {
		let { request: r } = n;
		if (v.isInstance(r) && !(zl in r.headers) && !(Bl in r.headers)) {
			let e = "Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.";
			typeof t?.logger?.warn == "function" && !(t.logger instanceof gt) ? t.logger.warn(e) : console.warn(e);
		}
		return e({ ...n });
	};
}
var Hl = {
	step: "finalizeRequest",
	tags: ["CHECK_CONTENT_LENGTH_HEADER"],
	name: "getCheckContentLengthHeaderPlugin",
	override: !0
}, Ul = (e) => ({ applyToStack: (e) => {
	e.add(Vl(), Hl);
} }), Wl = (e) => (t, n) => async (r) => {
	let i = await e.region(), a = e.region, o = () => {};
	n.__s3RegionRedirect && (Object.defineProperty(e, "region", {
		writable: !1,
		value: async () => n.__s3RegionRedirect
	}), o = () => Object.defineProperty(e, "region", {
		writable: !0,
		value: a
	}));
	try {
		let a = await t(r);
		if (n.__s3RegionRedirect && (o(), i !== await e.region())) throw Error("Region was not restored following S3 region redirect.");
		return a;
	} catch (e) {
		throw o(), e;
	}
}, Gl = {
	tags: ["REGION_REDIRECT", "S3"],
	name: "regionRedirectEndpointMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-region-redirect/region-redirect-middleware.js
function Kl(e) {
	return (t, n) => async (r) => {
		try {
			return await t(r);
		} catch (i) {
			if (e.followRegionRedirects) {
				let a = i?.$metadata?.httpStatusCode, o = n.commandName === "HeadBucketCommand", s = i?.$response?.headers?.["x-amz-bucket-region"];
				if (s && (a === 301 || a === 400 && (i?.name === "IllegalLocationConstraintException" || o))) {
					try {
						let t = s;
						n.logger?.debug(`Redirecting from ${await e.region()} to ${t}`), n.__s3RegionRedirect = t, T(n, "S3_REGION_REDIRECT", "Ah");
					} catch (e) {
						throw Error("Region redirect failed: " + e);
					}
					return t(r);
				}
			}
			throw i;
		}
	};
}
var ql = {
	step: "initialize",
	tags: ["REGION_REDIRECT", "S3"],
	name: "regionRedirectMiddleware",
	override: !0
}, Jl = (e) => ({ applyToStack: (t) => {
	t.add(Kl(e), ql), t.addRelativeTo(Wl(e), Gl);
} }), Yl = class e {
	data;
	lastPurgeTime = Date.now();
	static EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS = 3e4;
	constructor(e = {}) {
		this.data = e;
	}
	get(e) {
		let t = this.data[e];
		if (t) return t;
	}
	set(e, t) {
		return this.data[e] = t, t;
	}
	delete(e) {
		delete this.data[e];
	}
	clear() {
		this.data = {};
	}
	async purgeExpired() {
		let t = Date.now();
		if (this.lastPurgeTime + e.EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS > t) return;
		let n = this.data;
		for (let e in n) {
			let r = n[e];
			if (!r.isRefreshing) {
				let i = await r.identity;
				i.expiration && i.expiration.getTime() < t && n[e] === r && delete n[e];
			}
		}
	}
}, Xl = class {
	_identity;
	isRefreshing;
	accessed;
	constructor(e, t = !1, n = Date.now()) {
		this._identity = e, this.isRefreshing = t, this.accessed = n;
	}
	get identity() {
		return this.accessed = Date.now(), this._identity;
	}
}, Zl = class e {
	createSessionFn;
	cache;
	static REFRESH_WINDOW_MS = 6e4;
	accessKeyId;
	cacheGeneration = 0;
	constructor(e, t = new Yl()) {
		this.createSessionFn = e, this.cache = t;
	}
	async getS3ExpressIdentity(t, n) {
		let r = n.Bucket, { cache: i } = this;
		t.accessKeyId !== this.accessKeyId && (this.accessKeyId = t.accessKeyId, this.cacheGeneration++, i.clear());
		let a = this.cacheGeneration, o = i.get(r);
		return o ? o.identity.then((t) => (t.expiration?.getTime() ?? 0) < Date.now() ? i.set(r, new Xl(this.getIdentity(r))).identity : ((t.expiration?.getTime() ?? 0) < Date.now() + e.REFRESH_WINDOW_MS && !o.isRefreshing && (o.isRefreshing = !0, this.getIdentity(r).then((e) => {
			a === this.cacheGeneration && i.set(r, new Xl(Promise.resolve(e)));
		})), t)) : i.set(r, new Xl(this.getIdentity(r))).identity;
	}
	async getIdentity(e) {
		await this.cache.purgeExpired().catch((e) => {
			console.warn("Error while clearing expired entries in S3ExpressIdentityCache: \n" + e);
		});
		let t = await this.createSessionFn(e);
		if (!t.Credentials?.AccessKeyId || !t.Credentials?.SecretAccessKey) throw Error("s3#createSession response credential missing AccessKeyId or SecretAccessKey.");
		return {
			accessKeyId: t.Credentials.AccessKeyId,
			secretAccessKey: t.Credentials.SecretAccessKey,
			sessionToken: t.Credentials.SessionToken,
			expiration: t.Credentials.Expiration ? new Date(t.Credentials.Expiration) : void 0
		};
	}
}, Ql = (e, { session: t }) => {
	let [n, r] = t, { forcePathStyle: i, useAccelerateEndpoint: a, disableMultiregionAccessPoints: o, followRegionRedirects: s, s3ExpressIdentityProvider: c, bucketEndpoint: l, expectContinueHeader: u } = e;
	return Object.assign(e, {
		forcePathStyle: i ?? !1,
		useAccelerateEndpoint: a ?? !1,
		disableMultiregionAccessPoints: o ?? !1,
		followRegionRedirects: s ?? !1,
		s3ExpressIdentityProvider: c ?? new Zl(async (e) => n().send(new r({ Bucket: e }))),
		bucketEndpoint: l ?? !1,
		expectContinueHeader: u ?? 2097152
	});
};
pe(), w();
var $l = (e) => (e, t) => async (n) => {
	let r = await e(n), { response: i } = r;
	if (fe.isInstance(i) && i.headers.expires) {
		i.headers.expiresstring = i.headers.expires;
		try {
			nn(i.headers.expires);
		} catch (e) {
			t.logger?.warn(`AWS SDK Warning for ${t.clientName}::${t.commandName} response parsing (${i.headers.expires}): ${e}`), delete i.headers.expires;
		}
	}
	return r;
}, eu = {
	tags: ["S3"],
	name: "s3ExpiresMiddleware",
	override: !0,
	relation: "after",
	toMiddleware: "deserializerMiddleware"
}, tu = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo($l(e), eu);
} });
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
w();
var nu = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!_(e, n)) continue;
			let r = wt(n);
			t.push(Uint8Array.from([r.byteLength]), r, this.formatHeaderValue(e[n]));
		}
		let n = new Uint8Array(t.reduce((e, t) => e + t.byteLength, 0)), r = 0;
		for (let e of t) n.set(e, r), r += e.byteLength;
		return n;
	}
	formatHeaderValue(e) {
		switch (e.type) {
			case "boolean": return Uint8Array.from([+!e.value]);
			case "byte": return Uint8Array.from([2, e.value]);
			case "short":
				let t = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(3));
				return t.setUint8(0, 3), t.setInt16(1, e.value, !1), new Uint8Array(t.buffer);
			case "integer":
				let n = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(5));
				return n.setUint8(0, 4), n.setInt32(1, e.value, !1), new Uint8Array(n.buffer);
			case "long":
				let r = /* @__PURE__ */ new Uint8Array(9);
				return r[0] = 5, r.set(e.value.bytes, 1), r;
			case "binary":
				let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
				i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
				let a = new Uint8Array(i.buffer);
				return a.set(e.value, 3), a;
			case "string":
				let o = wt(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(au.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!iu.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Hn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, ru;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(ru ||= {});
var iu = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, au = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && ou(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && ou(e), parseInt(Un(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function ou(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var su = "X-Amz-Algorithm", cu = "X-Amz-Credential", lu = "X-Amz-Date", uu = "X-Amz-SignedHeaders", du = "X-Amz-Expires", fu = "X-Amz-Signature", pu = "X-Amz-Security-Token", mu = "authorization", hu = lu.toLowerCase(), gu = [
	mu,
	hu,
	"date"
];
fu.toLowerCase();
var _u = "x-amz-content-sha256", vu = pu.toLowerCase(), yu = {
	authorization: !0,
	"cache-control": !0,
	connection: !0,
	expect: !0,
	from: !0,
	"keep-alive": !0,
	"max-forwards": !0,
	pragma: !0,
	referer: !0,
	te: !0,
	trailer: !0,
	"transfer-encoding": !0,
	upgrade: !0,
	"user-agent": !0,
	"x-amzn-trace-id": !0
}, bu = /^proxy-/, xu = /^sec-/, Su = "AWS4-HMAC-SHA256", Cu = "AWS4-HMAC-SHA256-PAYLOAD", wu = "UNSIGNED-PAYLOAD", Tu = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
w();
var Eu = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!_(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = hs(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${hs(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${hs(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, Du = (e) => Ou(e).toISOString().replace(/\.\d{3}Z$/, "Z"), Ou = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
be(), w();
var ku = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = ye(n), this.credentialProvider = ye(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${Eu(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(Xn(n)), `${r}
${e}
${t}
${Un(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return hs(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = Du(e).replace(/[-:]/g, "");
		return {
			longDate: t,
			shortDate: t.slice(0, 8)
		};
	}
	getCanonicalHeaderList(e) {
		return Object.keys(e).sort().join(";");
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
w();
var Au = {}, ju = [], Mu = (e, t, n) => `${e}/${t}/${n}/${Tu}`, Nu = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${Un(await Pu(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Au) return Au[a];
	for (ju.push(a); ju.length > 50;) delete Au[ju.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Tu
	]) o = await Pu(e, o, t);
	return Au[a] = o;
}, Pu = (e, t, n) => {
	let r = new e(t);
	return r.update(Xn(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
w();
var Fu = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(_(yu, a) || t?.has(a) || bu.test(a) || xu.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && ga(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
w();
var Iu = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (_(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || er(t)) {
		let e = new n();
		return e.update(Xn(t)), Un(await e.digest());
	}
	return wu;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
w();
var Lu = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (_(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
w(), y();
var Ru = (e, t = {}) => {
	let { headers: n, query: r = {} } = v.clone(e);
	for (let e in n) {
		if (!_(n, e)) continue;
		let i = e.toLowerCase();
		(i.slice(0, 6) === "x-amz-" && !t.unhoistableHeaders?.has(i) || t.hoistableHeaders?.has(i)) && (r[e] = n[e], delete n[e]);
	}
	return {
		...e,
		headers: n,
		query: r
	};
};
w(), y();
var zu = (e) => {
	e = v.clone(e);
	for (let t in e.headers) _(e.headers, t) && gu.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
w();
var Bu = class extends ku {
	headerFormatter = new nu();
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		super({
			applyChecksum: e,
			credentials: t,
			region: n,
			service: r,
			sha256: i,
			uriEscapePath: a
		});
	}
	async presign(e, t = {}) {
		let { signingDate: n = /* @__PURE__ */ new Date(), expiresIn: r = 3600, unsignableHeaders: i, unhoistableHeaders: a, signableHeaders: o, hoistableHeaders: s, signingRegion: c, signingService: l } = t, u = await this.credentialProvider();
		this.validateResolvedCredentials(u);
		let d = c ?? await this.regionProvider(), { longDate: f, shortDate: p } = this.formatDate(n);
		if (r > 604800) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
		let m = Mu(p, d, l ?? this.service), h = Ru(zu(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[pu] = u.sessionToken), h.query[su] = Su, h.query[cu] = `${u.accessKeyId}/${m}`, h.query[lu] = f, h.query[du] = r.toString(10);
		let g = Fu(h, i, o);
		return h.query[uu] = this.getCanonicalHeaderList(g), h.query[fu] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await Iu(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = Mu(c, s, a ?? this.service), d = await Iu({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Cu,
			l,
			u,
			r,
			Un(await f.digest()),
			d
		].join("\n");
		return this.signString(p, {
			signingDate: n,
			signingRegion: s,
			signingService: a,
			eventStreamCredentials: o
		});
	}
	async signMessage(e, { signingDate: t = /* @__PURE__ */ new Date(), signingRegion: n, signingService: r, eventStreamCredentials: i }) {
		return this.signEvent({
			headers: this.headerFormatter.format(e.message.headers),
			payload: e.message.body
		}, {
			signingDate: t,
			signingRegion: n,
			signingService: r,
			priorSignature: e.priorSignature,
			eventStreamCredentials: i
		}).then((t) => ({
			message: e.message,
			signature: t
		}));
	}
	async signString(e, { signingDate: t = /* @__PURE__ */ new Date(), signingRegion: n, signingService: r, eventStreamCredentials: i } = {}) {
		let a = i ?? await this.credentialProvider();
		this.validateResolvedCredentials(a);
		let o = n ?? await this.regionProvider(), { shortDate: s } = this.formatDate(t), c = new this.sha256(await this.getSigningKey(a, o, s, r));
		return c.update(Xn(e)), Un(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = zu(e), { longDate: l, shortDate: u } = this.formatDate(t), d = Mu(u, s, a ?? this.service);
		c.headers[hu] = l, o.sessionToken && (c.headers[vu] = o.sessionToken);
		let f = await Iu(c, this.sha256);
		!Lu("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[_u] = f);
		let p = Fu(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[mu] = `${Su} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, Su), a = new this.sha256(await n);
		return a.update(Xn(i)), Un(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Nu(this.sha256, e, n, t, r || this.service);
	}
}, Vu = { SignatureV4a: null }, Hu = { CrtSignerV4: null }, Uu = "X-Amz-S3session-Token", Wu = Uu.toLowerCase(), Gu = class extends Bu {
	async signWithCredentials(e, t, n) {
		let r = Ku(t);
		e.headers[Wu] = t.sessionToken;
		let i = this;
		return qu(i, r), i.signRequest(e, n ?? {});
	}
	async presignWithCredentials(e, t, n) {
		let r = Ku(t);
		return delete e.headers[Wu], e.headers[Uu] = t.sessionToken, e.query = e.query ?? {}, e.query[Uu] = t.sessionToken, qu(this, r), this.presign(e, n);
	}
};
function Ku(e) {
	return {
		accessKeyId: e.accessKeyId,
		secretAccessKey: e.secretAccessKey,
		expiration: e.expiration
	};
}
function qu(e, t) {
	let n = e.credentialProvider;
	e.credentialProvider = () => (e.credentialProvider = n, Promise.resolve(t));
}
// ../../node_modules/.pnpm/@aws-sdk+signature-v4-multi-region@3.996.51/node_modules/@aws-sdk/signature-v4-multi-region/dist-es/SignatureV4MultiRegion.js
var Ju = class {
	sigv4aSigner;
	sigv4Signer;
	signerOptions;
	static sigv4aDependency() {
		return typeof Hu.CrtSignerV4 == "function" ? "crt" : typeof Vu.SignatureV4a == "function" ? "js" : "none";
	}
	constructor(e) {
		this.sigv4Signer = new Gu(e), this.signerOptions = e;
	}
	async sign(e, t = {}) {
		return t.signingRegion === "*" ? this.getSigv4aSigner().sign(e, t) : this.sigv4Signer.sign(e, t);
	}
	async signWithCredentials(e, t, n = {}) {
		if (n.signingRegion === "*") {
			let r = this.getSigv4aSigner(), i = Hu.CrtSignerV4;
			if (i && r instanceof i) return r.signWithCredentials(e, t, n);
			throw Error("signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the \"@aws-sdk/signature-v4-crt\" package explicitly. You must also register the package by calling [require(\"@aws-sdk/signature-v4-crt\");] or an ESM equivalent such as [import \"@aws-sdk/signature-v4-crt\";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
		}
		return this.sigv4Signer.signWithCredentials(e, t, n);
	}
	async presign(e, t = {}) {
		if (t.signingRegion === "*") {
			let n = this.getSigv4aSigner(), r = Hu.CrtSignerV4;
			if (r && n instanceof r) return n.presign(e, t);
			throw Error("presign with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the \"@aws-sdk/signature-v4-crt\" package explicitly. You must also register the package by calling [require(\"@aws-sdk/signature-v4-crt\");] or an ESM equivalent such as [import \"@aws-sdk/signature-v4-crt\";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
		}
		return this.sigv4Signer.presign(e, t);
	}
	async presignWithCredentials(e, t, n = {}) {
		if (n.signingRegion === "*") throw Error("Method presignWithCredentials is not supported for [signingRegion=*].");
		return this.sigv4Signer.presignWithCredentials(e, t, n);
	}
	getSigv4aSigner() {
		if (!this.sigv4aSigner) {
			let e = Hu.CrtSignerV4, t = Vu.SignatureV4a;
			if (this.signerOptions.runtime === "node") {
				if (!e && !t) throw Error("Neither CRT nor JS SigV4a implementation is available. Please load either @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
				if (e && typeof e == "function") this.sigv4aSigner = new e({
					...this.signerOptions,
					signingAlgorithm: 1
				});
				else if (t && typeof t == "function") this.sigv4aSigner = new t({ ...this.signerOptions });
				else throw Error("Available SigV4a implementation is not a valid constructor. Please ensure you've properly imported @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a.For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
			} else {
				if (!t || typeof t != "function") throw Error("JS SigV4a implementation is not available or not a valid constructor. Please check whether you have installed the @aws-sdk/signature-v4a package explicitly. The CRT implementation is not available for browsers. You must also register the package by calling [require('@aws-sdk/signature-v4a');] or an ESM equivalent such as [import '@aws-sdk/signature-v4a';]. For more information please go to https://github.com/aws/aws-sdk-js-v3#using-javascript-non-crt-implementation-of-sigv4a");
				this.sigv4aSigner = new t({ ...this.signerOptions });
			}
		}
		return this.sigv4aSigner;
	}
}, Yu = "sigv4-s3express", Xu = "x-amz-s3session-token";
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-s3-express/functions/s3ExpressMiddleware.js
y();
var Zu = (e) => (t, n) => async (r) => {
	if (n.endpointV2) {
		let t = n.endpointV2, i = t.properties?.authSchemes?.[0]?.name === Yu;
		if ((t.properties?.backend === "S3Express" || t.properties?.bucketType === "Directory") && (T(n, "S3_EXPRESS_BUCKET", "J"), n.isS3ExpressBucket = !0), i) {
			let t = r.input.Bucket;
			if (t) {
				let i = await e.s3ExpressIdentityProvider.getS3ExpressIdentity(await e.credentials(), { Bucket: t });
				n.s3ExpressIdentity = i, v.isInstance(r.request) && i.sessionToken && (r.request.headers[Xu] = i.sessionToken);
			}
		}
	}
	return t(r);
}, Qu = {
	name: "s3ExpressMiddleware",
	step: "build",
	tags: ["S3", "S3_EXPRESS"],
	override: !0
}, $u = (e) => ({ applyToStack: (t) => {
	t.add(Zu(e), Qu);
} }), ed = async (e, t, n, r) => {
	let i = await r.signWithCredentials(n, e, {});
	if (i.headers["X-Amz-Security-Token"] || i.headers["x-amz-security-token"]) throw Error("X-Amz-Security-Token must not be set for s3-express requests.");
	return i;
};
le(), y();
var td = (e) => (e) => {
	throw e;
}, nd = (e, t) => {}, rd = (e) => (t, n) => async (r) => {
	if (!v.isInstance(r.request)) return t(r);
	let i = ce(n).selectedHttpAuthScheme;
	if (!i) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: a = {} }, identity: o, signer: s } = i, c;
	c = n.s3ExpressIdentity ? await ed(n.s3ExpressIdentity, a, r.request, await e.signer()) : await s.sign(r.request, o, a);
	let l = await t({
		...r,
		request: c
	}).catch((s.errorHandler || td)(a));
	return (s.successHandler || nd)(l.response, a), l;
}, id = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(rd(e), hc);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/to-stream/toStream.browser.js
function ad(e) {
	return new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} });
}
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-throw-200-exceptions/throw-200-exceptions.js
pe();
var od = {
	CopyObjectCommand: !0,
	UploadPartCopyCommand: !0,
	CompleteMultipartUploadCommand: !0
}, sd = (e) => (t, n) => async (r) => {
	let i = await t(r), { response: a } = i;
	if (!fe.isInstance(a)) return i;
	let { statusCode: o, body: s } = a;
	if (o < 200 || o >= 300) return i;
	let c = await cd(s, e);
	if (a.body = ad(c), c.length === 0 && od[n.commandName]) {
		let e = /* @__PURE__ */ Error("S3 aborted request");
		throw e.$metadata = { httpStatusCode: 503 }, e.name = "InternalError", e;
	}
	let l = e.utf8Encoder(c.subarray(c.length - 16));
	return l && l.endsWith("</Error>") && (a.statusCode = 503), i;
}, cd = (e = /* @__PURE__ */ new Uint8Array(), t) => e instanceof Uint8Array ? Promise.resolve(e) : t.streamCollector(e) || Promise.resolve(/* @__PURE__ */ new Uint8Array()), ld = {
	relation: "after",
	toMiddleware: "deserializerMiddleware",
	tags: ["THROW_200_EXCEPTIONS", "S3"],
	name: "throw200ExceptionsMiddleware",
	override: !0
}, ud = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(sd(e), ld);
} }), dd = (e) => typeof e == "string" && e.indexOf("arn:") === 0 && e.split(":").length >= 6;
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-region-redirect/bucket-endpoint-middleware.js
function fd(e) {
	return (t, n) => async (r) => {
		if (e.bucketEndpoint) {
			let e = n.endpointV2;
			if (e) {
				let t = r.input.Bucket;
				if (typeof t == "string") try {
					let r = new URL(t);
					n.endpointV2 = {
						...e,
						url: r
					};
				} catch (e) {
					let r = `@aws-sdk/middleware-sdk-s3: bucketEndpoint=true was set but Bucket=${t} could not be parsed as URL.`;
					throw n.logger?.constructor?.name === "NoOpLogger" ? console.warn(r) : n.logger?.warn?.(r), e;
				}
			}
		}
		return t(r);
	};
}
var pd = {
	name: "bucketEndpointMiddleware",
	override: !0,
	relation: "after",
	toMiddleware: "endpointV2Middleware"
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-validate-bucket-name/validate-bucket-name.js
function md({ bucketEndpoint: e }) {
	return (t) => async (n) => {
		let { input: { Bucket: r } } = n;
		if (!e && typeof r == "string" && !dd(r) && r.indexOf("/") >= 0) {
			let e = /* @__PURE__ */ Error(`Bucket name shouldn't contain '/', received '${r}'`);
			throw e.name = "InvalidBucketName", e;
		}
		return t({ ...n });
	};
}
var hd = {
	step: "initialize",
	tags: ["VALIDATE_BUCKET_NAME"],
	name: "validateBucketNameMiddleware",
	override: !0
}, gd = (e) => ({ applyToStack: (t) => {
	t.add(md(e), hd), t.addRelativeTo(fd(e), pd);
} });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ProtocolLib.js
S();
var _d = class {
	queryCompat;
	errorRegistry;
	constructor(e = !1) {
		this.queryCompat = e;
	}
	resolveRestContentType(e, t) {
		let n = t.getMemberSchemas(), r = Object.values(n).find((e) => !!e.getMergedTraits().httpPayload);
		if (r) return r.getMergedTraits().mediaType || (r.isStringSchema() ? "text/plain" : r.isBlobSchema() ? "application/octet-stream" : e);
		if (!t.isUnitSchema() && Object.values(n).find((e) => {
			let { httpQuery: t, httpQueryParams: n, httpHeader: r, httpLabel: i, httpPrefixHeaders: a } = e.getMergedTraits();
			return !t && !n && !r && !i && a === void 0;
		})) return e;
	}
	async getErrorSchemaOrThrowBaseException(e, t, n, r, i, a) {
		let o = e;
		e.includes("#") && ([, o] = e.split("#"));
		let s = {
			$metadata: i,
			$fault: n.statusCode < 500 ? "client" : "server"
		};
		if (!this.errorRegistry) throw Error("@aws-sdk/core/protocols - error handler not initialized.");
		try {
			return {
				errorSchema: a?.(this.errorRegistry, o) ?? this.errorRegistry.getSchema(e),
				errorMetadata: s
			};
		} catch {
			r.message = r.message ?? r.Message ?? "UnknownError";
			let e = this.errorRegistry, t = e.getBaseException();
			if (t) {
				let n = e.getErrorCtor(t) ?? Error;
				throw this.decorateServiceException(Object.assign(new n({ name: o }), s), r);
			}
			let n = r, i = n?.message ?? n?.Message ?? n?.Error?.Message ?? n?.Error?.message;
			throw this.decorateServiceException(Object.assign(Error(i), { name: o }, s), r);
		}
	}
	compose(e, t, n) {
		let r = n;
		t.includes("#") && ([r] = t.split("#"));
		let i = Qe.for(r), a = Qe.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = ot(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return ot(e, t);
	}
	setQueryCompatError(e, t) {
		let n = t.headers?.["x-amzn-query-error"];
		if (e !== void 0 && n != null) {
			let [t, r] = n.split(";"), i = Object.keys(e), a = {
				Code: t,
				Type: r
			};
			e.Code = t, e.Type = r;
			for (let t = 0; t < i.length; t++) {
				let n = i[t];
				a[n === "message" ? "Message" : n] = e[n];
			}
			delete a.__type, e.Error = a;
		}
	}
	queryCompatOutput(e, t) {
		e.Error && (t.Error = e.Error), e.Type && (t.Type = e.Type), e.Code && (t.Code = e.Code);
	}
	findQueryCompatibleError(e, t) {
		try {
			return e.getSchema(t);
		} catch {
			return e.find((e) => x.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
}, vd = /[&<>"]/g, yd = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function bd(e) {
	return e.replace(vd, (e) => yd[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/escape-element.js
var xd = /[&"'<>\r\n\u0085\u2028]/g, Sd = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&apos;",
	"<": "&lt;",
	">": "&gt;",
	"\r": "&#x0D;",
	"\n": "&#x0A;",
	"": "&#x85;",
	"\u2028": "&#x2028;"
};
function Cd(e) {
	return e.replace(xd, (e) => Sd[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/XmlText.js
var wd = class {
	value;
	constructor(e) {
		this.value = e;
	}
	toString() {
		return Cd("" + this.value);
	}
}, Td = class e {
	name;
	children;
	attributes = {};
	static of(t, n, r) {
		let i = new e(t);
		return n !== void 0 && i.addChildNode(new wd(n)), r !== void 0 && i.withName(r), i;
	}
	constructor(e, t = []) {
		this.name = e, this.children = t;
	}
	withName(e) {
		return this.name = e, this;
	}
	addAttribute(e, t) {
		return this.attributes[e] = t, this;
	}
	addChildNode(e) {
		return this.children.push(e), this;
	}
	removeAttribute(e) {
		return delete this.attributes[e], this;
	}
	n(e) {
		return this.name = e, this;
	}
	c(e) {
		return this.children.push(e), this;
	}
	a(e, t) {
		return t != null && (this.attributes[e] = t), this;
	}
	cc(t, n, r = n) {
		if (t[n] != null) {
			let i = e.of(n, t[n]).withName(r);
			this.c(i);
		}
	}
	l(e, t, n, r) {
		e[t] != null && r().map((e) => {
			e.withName(n), this.c(e);
		});
	}
	lc(t, n, r, i) {
		if (t[n] != null) {
			let t = i(), n = new e(r);
			t.map((e) => {
				n.c(e);
			}), this.c(n);
		}
	}
	toString() {
		let e = !!this.children.length, t = `<${this.name}`, n = this.attributes;
		for (let e of Object.keys(n)) {
			let r = n[e];
			r != null && (t += ` ${e}="${bd("" + r)}"`);
		}
		return t += e ? `>${this.children.map((e) => e.toString()).join("")}</${this.name}>` : "/>";
	}
}, Ed;
function Dd(e) {
	Ed ||= new DOMParser();
	let t = Ed.parseFromString(e, "application/xml");
	if (t.getElementsByTagName("parsererror").length > 0) throw Error("DOMParser XML parsing error.");
	let n = (e) => {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) return e.textContent;
		if (e.nodeType === Node.ELEMENT_NODE) {
			let t = e;
			if (t.attributes.length === 0 && t.childNodes.length === 0) return "";
			let r = {}, i = Array.from(t.attributes);
			for (let e of i) r[`${e.name}`] = e.value;
			let a = Array.from(t.childNodes);
			for (let e of a) {
				let o = n(e);
				if (o != null) {
					let t = e.nodeName;
					if (a.length === 1 && i.length === 0 && t === "#text") return o;
					t in r ? Array.isArray(r[t]) ? r[t].push(o) : r[t] = [r[t], o] : r[t] = o;
				} else if (a.length === 1 && i.length === 0) return t.textContent;
			}
			return r;
		}
		return null;
	};
	return { [t.documentElement.nodeName]: n(t.documentElement) };
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var Od = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, kd = class {
	from;
	to;
	keys;
	constructor(e, t) {
		this.from = e, this.to = t;
		let n = Object.keys(this.from), r = new Set(n);
		r.delete("__type"), this.keys = r;
	}
	mark(e) {
		this.keys.delete(e);
	}
	hasUnknown() {
		return this.keys.size === 1 && Object.keys(this.to).length === 0;
	}
	writeUnknown() {
		if (this.hasUnknown()) {
			let e = this.keys.values().next().value, t = this.from[e];
			this.to.$unknown = [e, t];
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/writeKey.js
function Ad(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
S(), w();
var jd = class extends Od {
	settings;
	stringDeserializer;
	constructor(e) {
		super(), this.settings = e, this.stringDeserializer = new as(e);
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.stringDeserializer.setSerdeContext(e);
	}
	read(e, t, n) {
		let r = x.of(e), i = r.getMemberSchemas();
		if (r.isStructSchema() && r.isMemberSchema() && Object.values(i).find((e) => !!e.getMemberTraits().eventPayload)) {
			let e = {}, n = Object.keys(i)[0];
			return e[n] = i[n].isBlobSchema() ? t : this.read(i[n], t), e;
		}
		let a = (this.serdeContext?.utf8Encoder ?? At)(t), o = this.parseXml(a);
		return this.readSchema(e, n ? o[n] : o);
	}
	readSchema(e, t) {
		let n = x.of(e);
		if (n.isUnitSchema()) return;
		let r = n.getMergedTraits();
		if (n.isListSchema() && !Array.isArray(t)) return this.readSchema(n, [t]);
		if (t == null) return t;
		if (typeof t == "object") {
			let e = !!r.xmlFlattened;
			if (n.isListSchema()) {
				let r = n.getValueSchema(), i = [], a = r.getMergedTraits().xmlName ?? "member", o = e ? t : (t[0] ?? t)[a];
				if (o == null) return i;
				let s = Array.isArray(o) ? o : [o];
				for (let e of s) i.push(this.readSchema(r, e));
				return i;
			}
			let i = {};
			if (n.isMapSchema()) {
				let r = n.getKeySchema(), a = n.getValueSchema(), o;
				o = e ? Array.isArray(t) ? t : [t] : Array.isArray(t.entry) ? t.entry : [t.entry];
				let s = r.getMergedTraits().xmlName ?? "key", c = a.getMergedTraits().xmlName ?? "value";
				for (let e of o) {
					let t = e[s], n = e[c];
					t === "__proto__" && Ad(i), i[t] = this.readSchema(a, n);
				}
				return i;
			}
			if (n.isStructSchema()) {
				let e = n.isUnionSchema(), r;
				e && (r = new kd(t, i));
				for (let [a, o] of n.structIterator()) {
					let n = o.getMergedTraits(), s = n.httpPayload ? n.xmlName ?? o.getName() : o.getMemberTraits().xmlName ?? a;
					e && r.mark(s), t[s] != null && (i[a] = this.readSchema(o, t[s]));
				}
				return e && r.writeUnknown(), i;
			}
			if (n.isDocumentSchema()) return t;
			throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${n.getName(!0)}`);
		}
		return n.isListSchema() ? [] : n.isMapSchema() || n.isStructSchema() ? {} : this.stringDeserializer.read(n, t);
	}
	parseXml(e) {
		if (e.length) {
			let t;
			try {
				t = Dd(e);
			} catch (t) {
				throw t && typeof t == "object" && Object.defineProperty(t, "$responseBodyText", { value: e }), t;
			}
			let n = "#text", r = Object.keys(t)[0], i = t[r];
			return i[n] && (i[r] = i[n], delete i[n]), ht(i);
		}
		return {};
	}
}, Md = (e, t) => {
	if (t?.Error?.Code !== void 0) return t.Error.Code;
	if (t?.Code !== void 0) return t.Code;
	if (e.statusCode == 404) return "NotFound";
};
S(), w();
var Nd = class extends Od {
	settings;
	stringBuffer;
	byteBuffer;
	buffer;
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = x.of(e);
		if (n.isStringSchema() && typeof t == "string") this.stringBuffer = t;
		else if (n.isBlobSchema()) this.byteBuffer = "byteLength" in t ? t : (this.serdeContext?.base64Decoder ?? St)(t);
		else {
			this.buffer = this.writeStruct(n, t, void 0);
			let e = n.getMergedTraits();
			e.httpPayload && !e.xmlName && this.buffer.withName(n.getName());
		}
	}
	flush() {
		if (this.byteBuffer !== void 0) {
			let e = this.byteBuffer;
			return delete this.byteBuffer, e;
		}
		if (this.stringBuffer !== void 0) {
			let e = this.stringBuffer;
			return delete this.stringBuffer, e;
		}
		let e = this.buffer;
		return this.settings.xmlNamespace && (e?.attributes?.xmlns || e.addAttribute("xmlns", this.settings.xmlNamespace)), delete this.buffer, e.toString();
	}
	writeStruct(e, t, n) {
		let r = e.getMergedTraits(), i = e.isMemberSchema() && !r.httpPayload ? e.getMemberTraits().xmlName ?? e.getMemberName() : r.xmlName ?? e.getName();
		if (!i || !e.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${e.getName(!0)}.`);
		let a = Td.of(i), [o, s] = this.getXmlnsAttribute(e, n);
		for (let [n, r] of e.structIterator()) {
			let e = t[n];
			if (e != null || r.isIdempotencyToken()) {
				if (r.getMergedTraits().xmlAttribute) {
					a.addAttribute(r.getMergedTraits().xmlName ?? n, this.writeSimple(r, e));
					continue;
				}
				if (r.isListSchema()) this.writeList(r, e, a, s);
				else if (r.isMapSchema()) this.writeMap(r, e, a, s);
				else if (r.isStructSchema()) a.addChildNode(this.writeStruct(r, e, s));
				else {
					let t = Td.of(r.getMergedTraits().xmlName ?? r.getMemberName());
					this.writeSimpleInto(r, e, t, s), a.addChildNode(t);
				}
			}
		}
		let { $unknown: c } = t;
		if (c && e.isUnionSchema() && Array.isArray(c) && Object.keys(t).length === 1) {
			let [e, n] = c, r = Td.of(e);
			if (typeof n != "string") {
				if (t instanceof Td || t instanceof wd) a.addChildNode(t);
				else throw Error("@aws-sdk - $unknown union member in XML requires value of type string, @aws-sdk/xml-builder::XmlNode or XmlText.");
			}
			this.writeSimpleInto(0, n, r, s), a.addChildNode(r);
		}
		return s && a.addAttribute(o, s), a;
	}
	writeList(e, t, n, r) {
		if (!e.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${e.getName(!0)}`);
		let i = e.getMergedTraits(), a = e.getValueSchema(), o = a.getMergedTraits(), s = !!o.sparse, c = !!i.xmlFlattened, [l, u] = this.getXmlnsAttribute(e, r), d = (t, n) => {
			if (a.isListSchema()) this.writeList(a, Array.isArray(n) ? n : [n], t, u);
			else if (a.isMapSchema()) this.writeMap(a, n, t, u);
			else if (a.isStructSchema()) {
				let r = this.writeStruct(a, n, u);
				t.addChildNode(r.withName(c ? i.xmlName ?? e.getMemberName() : o.xmlName ?? "member"));
			} else {
				let r = Td.of(c ? i.xmlName ?? e.getMemberName() : o.xmlName ?? "member");
				this.writeSimpleInto(a, n, r, u), t.addChildNode(r);
			}
		};
		if (c) for (let e of t) (s || e != null) && d(n, e);
		else {
			let r = Td.of(i.xmlName ?? e.getMemberName());
			u && r.addAttribute(l, u);
			for (let e of t) (s || e != null) && d(r, e);
			n.addChildNode(r);
		}
	}
	writeMap(e, t, n, r, i = !1) {
		if (!e.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${e.getName(!0)}`);
		let a = e.getMergedTraits(), o = e.getKeySchema(), s = o.getMergedTraits().xmlName ?? "key", c = e.getValueSchema(), l = c.getMergedTraits(), u = l.xmlName ?? "value", d = !!l.sparse, f = !!a.xmlFlattened, [p, m] = this.getXmlnsAttribute(e, r), h = (e, t, n) => {
			let r = Td.of(s, t), [i, a] = this.getXmlnsAttribute(o, m);
			a && r.addAttribute(i, a), e.addChildNode(r);
			let l = Td.of(u);
			c.isListSchema() ? this.writeList(c, n, l, m) : c.isMapSchema() ? this.writeMap(c, n, l, m, !0) : c.isStructSchema() ? l = this.writeStruct(c, n, m) : this.writeSimpleInto(c, n, l, m), e.addChildNode(l);
		};
		if (f) for (let r in t) {
			let i = t[r];
			if (d || i != null) {
				let t = Td.of(a.xmlName ?? e.getMemberName());
				h(t, r, i), n.addChildNode(t);
			}
		}
		else {
			let r;
			i || (r = Td.of(a.xmlName ?? e.getMemberName()), m && r.addAttribute(p, m), n.addChildNode(r));
			for (let e in t) {
				let a = t[e];
				if (d || a != null) {
					let t = Td.of("entry");
					h(t, e, a), (i ? n : r).addChildNode(t);
				}
			}
		}
	}
	writeSimple(e, t) {
		if (t === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
		let n = x.of(e), r = null;
		if (t && typeof t == "object") {
			if (n.isBlobSchema()) r = (this.serdeContext?.base64Encoder ?? Et)(t);
			else if (n.isTimestampSchema() && t instanceof Date) switch (is(n, this.settings)) {
				case 5:
					r = t.toISOString().replace(".000Z", "Z");
					break;
				case 6:
					r = Xt(t);
					break;
				case 7:
					r = String(t.getTime() / 1e3);
					break;
				default: console.warn("Missing timestamp format, using http date", t), r = Xt(t);
			}
			else if (n.isBigDecimalSchema() && t) return t instanceof Bn ? t.string : String(t);
			else if (n.isMapSchema() || n.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
			else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${n.getName(!0)}`);
		}
		if ((n.isBooleanSchema() || n.isNumericSchema() || n.isBigIntegerSchema() || n.isBigDecimalSchema()) && (r = String(t)), n.isStringSchema() && (r = t === void 0 && n.isIdempotencyToken() ? xa() : String(t)), r === null) throw Error(`Unhandled schema-value pair ${n.getName(!0)}=${t}`);
		return r;
	}
	writeSimpleInto(e, t, n, r) {
		let i = this.writeSimple(e, t), a = x.of(e), o = new wd(i), [s, c] = this.getXmlnsAttribute(a, r);
		c && n.addAttribute(s, c), n.addChildNode(o);
	}
	getXmlnsAttribute(e, t) {
		let [n, r] = e.getMergedTraits().xmlNamespace ?? [];
		return r && r !== t ? [n ? `xmlns:${n}` : "xmlns", r] : [void 0, void 0];
	}
}, Pd = class extends Od {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new Nd(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new jd(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/AwsRestXmlProtocol.js
S();
var Fd = class extends rs {
	codec;
	serializer;
	deserializer;
	mixin = new _d();
	constructor(e) {
		super(e);
		let t = {
			timestampFormat: {
				useTrait: !0,
				default: 5
			},
			httpBindings: !0,
			xmlNamespace: e.xmlNamespace,
			serviceNamespace: e.defaultNamespace
		};
		this.codec = new Pd(t), this.serializer = new cs(this.codec.createSerializer(), t), this.deserializer = new os(this.codec.createDeserializer(), t);
	}
	getPayloadCodec() {
		return this.codec;
	}
	getShapeId() {
		return "aws.protocols#restXml";
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = x.of(e.input);
		if (!r.headers["content-type"]) {
			let e = this.mixin.resolveRestContentType(this.getDefaultContentType(), i);
			e && (r.headers["content-type"] = e);
		}
		return typeof r.body == "string" && r.headers["content-type"] === this.getDefaultContentType() && !r.body.startsWith("<?xml ") && !this.hasUnstructuredPayloadBinding(i) && (r.body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + r.body), r;
	}
	async deserializeResponse(e, t, n) {
		return super.deserializeResponse(e, t, n);
	}
	async handleError(e, t, n, r, i) {
		let a = Md(n, r) ?? "Unknown";
		if (this.mixin.compose(this.compositeErrorRegistry, a, this.options.defaultNamespace), r.Error && typeof r.Error == "object") for (let e of Object.keys(r.Error)) r[e] = r.Error[e], e.toLowerCase() === "message" && (r.message = r.Error[e]);
		r.RequestId && !i.requestId && (i.requestId = r.RequestId);
		let { errorSchema: o, errorMetadata: s } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, r, i), c = x.of(o), l = r.Error?.message ?? r.Error?.Message ?? r.message ?? r.Message ?? "UnknownError", u = new ((this.compositeErrorRegistry.getErrorCtor(o)) ?? Error)({});
		await this.deserializeHttpMessage(o, t, n, r);
		let d = {}, f = this.codec.createDeserializer();
		for (let [e, t] of c.structIterator()) {
			let n = t.getMergedTraits().xmlName ?? e, i = r.Error?.[n] ?? r[n];
			d[e] = f.readSchema(t, i);
		}
		throw this.mixin.decorateServiceException(Object.assign(u, s, {
			$fault: c.getMergedTraits().error,
			message: l
		}, d), r);
	}
	getDefaultContentType() {
		return "application/xml";
	}
	hasUnstructuredPayloadBinding(e) {
		for (let [, t] of e.structIterator()) if (t.getMergedTraits().httpPayload) return !(t.isStructSchema() || t.isMapSchema() || t.isListSchema());
		return !1;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/protocol/S3RestXmlProtocol.js
S();
var Id = class extends Fd {
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = x.of(e.input), a = i.getSchema(), o = 0, s = a[6] ?? 0;
		if (t && typeof t == "object") for (let [e, n] of i.structIterator()) {
			if (++o > s) break;
			if (e === "Bucket") {
				if (!t.Bucket && n.getMergedTraits().httpLabel) throw Error("No value provided for input HTTP label: Bucket.");
				break;
			}
		}
		return r;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-expect-continue/middleware-expect-continue.js
y();
function Ld(e) {
	return (t) => async (n) => {
		let { request: r } = n;
		if (e.expectContinueHeader !== !1 && v.isInstance(r) && r.body && e.runtime === "node" && e.requestHandler?.constructor?.name !== "FetchHttpHandler") {
			let t = !0;
			if (typeof e.expectContinueHeader == "number") try {
				t = (Number(r.headers?.["content-length"]) ?? e.bodyLengthChecker?.(r.body) ?? Infinity) >= e.expectContinueHeader;
			} catch {}
			else t = !!e.expectContinueHeader;
			t && (r.headers.Expect = "100-continue");
		}
		return t({
			...n,
			request: r
		});
	};
}
var Rd = {
	step: "build",
	tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
	name: "addExpectContinueMiddleware",
	override: !0
}, zd = (e) => ({ applyToStack: (t) => {
	t.add(Ld(e), Rd);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-location-constraint/middleware-location-constraint.js
function Bd(e) {
	return (t) => async (n) => {
		let { CreateBucketConfiguration: r } = n.input, i = await e.region();
		return !r?.LocationConstraint && !r?.Location && i !== "us-east-1" && (n.input.CreateBucketConfiguration = n.input.CreateBucketConfiguration ?? {}, n.input.CreateBucketConfiguration.LocationConstraint = i), t(n);
	};
}
var Vd = {
	step: "initialize",
	tags: ["LOCATION_CONSTRAINT", "CREATE_BUCKET_CONFIGURATION"],
	name: "locationConstraintMiddleware",
	override: !0
}, Hd = (e) => ({ applyToStack: (t) => {
	t.add(Bd(e), Vd);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-ssec/middleware-ssec.js
function Ud(e) {
	return (t) => async (n) => {
		let r = { ...n.input };
		for (let t of [{
			target: "SSECustomerKey",
			hash: "SSECustomerKeyMD5"
		}, {
			target: "CopySourceSSECustomerKey",
			hash: "CopySourceSSECustomerKeyMD5"
		}]) {
			let n = r[t.target];
			if (n) {
				let i;
				typeof n == "string" ? Kd(n, e) ? i = e.base64Decoder(n) : (i = e.utf8Decoder(n), r[t.target] = e.base64Encoder(i)) : (i = ArrayBuffer.isView(n) ? new Uint8Array(n.buffer, n.byteOffset, n.byteLength) : new Uint8Array(n), r[t.target] = e.base64Encoder(i));
				let a = new e.md5();
				a.update(i), r[t.hash] = e.base64Encoder(await a.digest());
			}
		}
		return t({
			...n,
			input: r
		});
	};
}
var Wd = {
	name: "ssecMiddleware",
	step: "initialize",
	tags: ["SSE"],
	override: !0
}, Gd = (e) => ({ applyToStack: (t) => {
	t.add(Ud(e), Wd);
} });
function Kd(e, t) {
	if (!/^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) return !1;
	try {
		return t.base64Decoder(e).length === 32;
	} catch {
		return !1;
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
pe();
var qd = (e) => fe.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, Jd = (e) => fe.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, Yd = (e) => new Date(Date.now() + e), Xd = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
y(), se();
var Zd = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Qd = (e) => e.context?.[ae]?.eventStream?.output === !0, $d = async (e) => {
	let t = Zd("context", e.context), n = Zd("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await Zd("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, ef = class {
	async sign(e, t, n) {
		if (!v.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await $d(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Qd(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Yd(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? qd(n.$response);
				if (t) {
					let r = Zd("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = Jd(n.$response), s = Xd(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = qd(e);
		if (n) {
			let r = Zd("config", t.config), i = t._requestSentAt, a = Jd(e);
			r.systemClockOffset = Xd(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4ASigner.js
y();
var tf = class extends ef {
	async sign(e, t, n) {
		if (!v.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let { config: r, signer: i, signingRegion: a, signingRegionSet: o, signingName: s } = await $d(n), c = (await r.sigv4aSigningRegionSet?.() ?? o ?? [a]).join(","), l = await r.disableClockSkewCorrection?.() === !0;
		return n._disableClockSkewCorrection = l, l || (n._preRequestSystemClockOffset = r.systemClockOffset, n._requestSentAt = Date.now()), await i.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Yd(r.systemClockOffset),
			signingRegion: c,
			signingService: s
		});
	}
}, nf = (e) => (e.sigv4aSigningRegionSet = _c(e.sigv4aSigningRegionSet), e), rf = (e) => (t) => {
	let n = t.credentials, r = !!t.credentials, i;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== i && (r = !0), n = e;
			let a = of(t, af(t, {
				credentials: n,
				credentialDefaultProvider: t.credentialDefaultProvider
			}));
			if (r && !a.attributed) {
				let e = typeof n == "object" && !!n;
				i = async (t) => {
					let n = await a(t);
					return e && (!n.$source || Object.keys(n.$source).length === 0) ? u(n, "CREDENTIALS_CODE", "e") : n;
				}, i.memoized = a.memoized, i.configBound = a.configBound, i.attributed = !0;
			} else i = a;
		},
		get() {
			return i;
		},
		enumerable: !0,
		configurable: !0
	}), t.credentials = n;
	let { signingEscapePath: a = !0, systemClockOffset: o = t.systemClockOffset || 0, sha256: s } = t, c;
	return c = t.signer ? _c(t.signer) : t.regionInfoProvider ? () => _c(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
		useFipsEndpoint: await t.useFipsEndpoint(),
		useDualstackEndpoint: await t.useDualstackEndpoint()
	}) || {}, e]).then(([e, n]) => {
		let { signingRegion: r, signingService: i } = e;
		t.signingRegion = t.signingRegion || r || n, t.signingName = t.signingName || i || t.serviceId;
		let o = {
			...t,
			credentials: t.credentials,
			region: t.signingRegion,
			service: t.signingName,
			sha256: s,
			uriEscapePath: a
		};
		return new (t.signerConstructor || Bu)(o);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await _c(t.region)(),
			properties: {}
		}, e);
		let n = e.signingRegion, r = e.signingName;
		t.signingRegion = t.signingRegion || n, t.signingName = t.signingName || r || t.serviceId;
		let i = {
			...t,
			credentials: t.credentials,
			region: t.signingRegion,
			service: t.signingName,
			sha256: s,
			uriEscapePath: a
		};
		return new (t.signerConstructor || Bu)(i);
	}, Object.assign(t, {
		systemClockOffset: o,
		signingEscapePath: a,
		signer: c,
		disableClockSkewCorrection: _c(t.disableClockSkewCorrection ?? e)
	});
};
function af(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : xc(t, yc, bc) : n ? _c(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function of(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var sf = rf(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/bdd.js
Hi();
var E = "ref", D = "argv", cf = "backend", lf = "authSchemes", uf = "disableDoubleEncoding", df = "signingName", ff = "signingRegion", pf = "signingRegionSet", O = -1, k = !0, mf = !1, hf = "isSet", gf = "booleanEquals", A = "stringEquals", j = "coalesce", M = "substring", N = "", _f = "aws.partition", vf = "partitionResult", yf = "accessPointSuffix", bf = "regionPrefix", xf = (e) => "outpostId_ssa_" + e + N, Sf = "hardwareType", Cf = "ite", wf = "isValidHostLabel", Tf = "sigv4", Ef = "aws.isVirtualHostableS3Bucket", Df = "url", P = "getAttr", Of = "bucketArn", kf = "--", Af = "arnType", jf = "accesspoint", Mf = (e) => "accessPointName_ssa_" + e + N, Nf = "s3-object-lambda", Pf = "s3-outposts", Ff = "bucketPartition", If = "us-east-1", Lf = "outpostType", Rf = "name", zf = "s3", Bf = "{url#scheme}://{Bucket}.{url#authority}{url#path}", Vf = "{url#scheme}://{url#authority}{url#path}", Hf = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", Uf = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", Wf = "https://{Bucket}.s3.{partitionResult#dnsSuffix}", Gf = (e) => "{url#scheme}://{accessPointName_ssa_" + e + "}-{bucketArn#accountId}.{url#authority}{url#path}", Kf = (e) => "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName_ssa_" + e + "}`", qf = "sigv4a", Jf = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", Yf = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", Xf = "https://s3.{partitionResult#dnsSuffix}", Zf = { [E]: "UseFIPS" }, Qf = { [E]: "UseDualStack" }, F = { [E]: "Bucket" }, $f = {
	fn: P,
	[D]: [{ [E]: vf }, Rf]
}, ep = { [E]: Df }, tp = { [E]: "Region" }, np = { [E]: Of }, rp = { [E]: Af }, ip = { [E]: "accessPointName_ssa_1" }, ap = {
	fn: P,
	[D]: [np, "region"]
}, op = { [E]: Sf }, sp = {
	fn: P,
	[D]: [np, "service"]
}, cp = {
	fn: P,
	[D]: [np, "accountId"]
}, lp = {
	[cf]: "S3Express",
	[lf]: [{
		[uf]: !0,
		[Rf]: "{_s3e_auth}",
		[df]: "s3express",
		[ff]: "{Region}"
	}]
}, up = {
	[cf]: "S3Express",
	[lf]: [{
		[uf]: !0,
		[Rf]: Tf,
		[df]: "s3express",
		[ff]: "{Region}"
	}]
}, dp = { [lf]: [{
	[uf]: !0,
	[Rf]: qf,
	[df]: Pf,
	[pf]: ["*"]
}, {
	[uf]: !0,
	[Rf]: Tf,
	[df]: Pf,
	[ff]: "{Region}"
}] }, I = { [lf]: [{
	[uf]: !0,
	[Rf]: Tf,
	[df]: zf,
	[ff]: If
}] }, L = { [lf]: [{
	[uf]: !0,
	[Rf]: Tf,
	[df]: zf,
	[ff]: "{Region}"
}] }, fp = { [lf]: [{
	[uf]: !0,
	[Rf]: Tf,
	[df]: Nf,
	[ff]: "{bucketArn#region}"
}] }, pp = { [lf]: [{
	[uf]: !0,
	[Rf]: Tf,
	[df]: zf,
	[ff]: "{bucketArn#region}"
}] }, mp = { [lf]: [{
	[uf]: !0,
	[Rf]: qf,
	[df]: Pf,
	[pf]: ["*"]
}, {
	[uf]: !0,
	[Rf]: Tf,
	[df]: Pf,
	[ff]: "{bucketArn#region}"
}] }, hp = { [lf]: [{
	[uf]: !0,
	[Rf]: Tf,
	[df]: Nf,
	[ff]: "{Region}"
}] }, gp = [tp], _p = [{ [E]: "Endpoint" }], vp = [F], yp = [
	F,
	0,
	7,
	!0
], bp = [np, "resourceId[1]"], xp = ["*"], Sp = {
	conditions: [
		[hf, gp],
		[gf, [{ [E]: "Accelerate" }, k]],
		[gf, [Zf, k]],
		[gf, [Qf, k]],
		[hf, _p],
		[hf, vp],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					0,
					6,
					k
				]
			}, N]
		}, "--x-s3"]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: yp
			}, N]
		}, "--xa-s3"]],
		[
			_f,
			gp,
			vf
		],
		[
			M,
			yp,
			yf
		],
		[A, [{ [E]: yf }, "--op-s3"]],
		[
			M,
			[
				F,
				8,
				12,
				k
			],
			bf
		],
		[
			M,
			[
				F,
				32,
				49,
				k
			],
			xf(2)
		],
		[
			M,
			[
				F,
				49,
				50,
				k
			],
			Sf
		],
		[gf, [{ [E]: "ForcePathStyle" }, k]],
		[A, [$f, "aws-cn"]],
		[
			Cf,
			[
				Qf,
				".dualstack",
				N
			],
			"_s3e_ds"
		],
		[wf, [{ [E]: xf(2) }, mf]],
		[
			Cf,
			[
				Zf,
				"-fips",
				N
			],
			"_s3e_fips"
		],
		[
			Cf,
			[
				{
					fn: j,
					[D]: [{ [E]: "DisableS3ExpressSessionAuth" }, mf]
				},
				Tf,
				"sigv4-s3express"
			],
			"_s3e_auth"
		],
		[Ef, [F, mf]],
		[
			"parseURL",
			_p,
			Df
		],
		[gf, [{
			fn: j,
			[D]: [{ [E]: "UseS3ExpressControlEndpoint" }, mf]
		}, k]],
		[Ef, [F, k]],
		[A, [{
			fn: P,
			[D]: [ep, "scheme"]
		}, "http"]],
		[wf, [tp, mf]],
		[
			"aws.parseArn",
			vp,
			Of
		],
		[
			P,
			[{
				fn: "split",
				[D]: [
					F,
					kf,
					0
				]
			}, "[-2]"],
			"s3expressAvailabilityZoneId"
		],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					0,
					4,
					mf
				]
			}, N]
		}, "arn:"]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					16,
					18,
					k
				]
			}, N]
		}, kf]],
		[gf, [{
			fn: P,
			[D]: [ep, "isIp"]
		}, k]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					21,
					23,
					k
				]
			}, N]
		}, kf]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					27,
					29,
					k
				]
			}, N]
		}, kf]],
		[A, [{ [E]: bf }, "beta"]],
		[
			"uriEncode",
			vp,
			"uri_encoded_bucket"
		],
		[wf, [tp, k]],
		[gf, [{
			fn: j,
			[D]: [{ [E]: "UseObjectLambdaEndpoint" }, mf]
		}, k]],
		[
			P,
			[np, "resourceId[0]"],
			Af
		],
		[A, [rp, N]],
		[A, [rp, jf]],
		[
			P,
			bp,
			Mf(1)
		],
		[A, [ip, N]],
		[A, [ap, N]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					14,
					16,
					k
				]
			}, N]
		}, kf]],
		[A, [op, "e"]],
		[A, [op, "o"]],
		[A, [tp, "aws-global"]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					19,
					21,
					k
				]
			}, N]
		}, kf]],
		[A, [sp, Nf]],
		[gf, [{
			fn: j,
			[D]: [{ [E]: "DisableAccessPoints" }, mf]
		}, k]],
		[A, [sp, Pf]],
		[
			_f,
			[ap],
			Ff
		],
		[wf, [ip, k]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					26,
					28,
					k
				]
			}, N]
		}, kf]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					15,
					17,
					k
				]
			}, N]
		}, kf]],
		[P, [np, "resourceId[4]"]],
		[A, [{
			fn: j,
			[D]: [{
				fn: M,
				[D]: [
					F,
					20,
					22,
					k
				]
			}, N]
		}, kf]],
		[gf, [{ [E]: "UseGlobalEndpoint" }, k]],
		[A, [tp, If]],
		[
			P,
			bp,
			xf(1)
		],
		[gf, [{
			fn: j,
			[D]: [{ [E]: "UseArnRegion" }, k]
		}, k]],
		[wf, [{ [E]: xf(1) }, mf]],
		[
			P,
			[np, "resourceId[2]"],
			Lf
		],
		[A, [tp, ap]],
		[A, [{
			fn: P,
			[D]: [{ [E]: Ff }, Rf]
		}, $f]],
		[gf, [{ [E]: "DisableMultiRegionAccessPoints" }, k]],
		[wf, [ap, k]],
		[A, [{
			fn: P,
			[D]: [np, "partition"]
		}, $f]],
		[A, [cp, N]],
		[A, [sp, zf]],
		[wf, [cp, mf]],
		[
			P,
			[np, "resourceId[3]"],
			Mf(2)
		],
		[wf, [ip, mf]],
		[A, [{ [E]: Lf }, jf]],
		[wf, [{ [E]: Mf(2) }, mf]]
	],
	results: [
		[O],
		[O, "Accelerate cannot be used with FIPS"],
		[O, "Cannot set dual-stack in combination with a custom endpoint."],
		[O, "A custom endpoint cannot be combined with FIPS"],
		[O, "A custom endpoint cannot be combined with S3 Accelerate"],
		[O, "Partition does not support FIPS"],
		[O, "S3Express does not support S3 Accelerate."],
		["{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", lp],
		[Bf, lp],
		[O, "S3Express bucket name is not a valid virtual hostable name."],
		["https://s3express-control{_s3e_fips}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", up],
		["https://{Bucket}.s3express{_s3e_fips}-{s3expressAvailabilityZoneId}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}", lp],
		[O, "Unrecognized S3Express bucket name format."],
		[Vf, lp],
		["https://s3express-control{_s3e_fips}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}", up],
		[O, "Expected a endpoint to be specified but no endpoint was found"],
		["https://{Bucket}.ec2.{url#authority}", dp],
		["https://{Bucket}.ec2.s3-outposts.{Region}.{partitionResult#dnsSuffix}", dp],
		["https://{Bucket}.op-{outpostId_ssa_2}.{url#authority}", dp],
		["https://{Bucket}.op-{outpostId_ssa_2}.s3-outposts.{Region}.{partitionResult#dnsSuffix}", dp],
		[O, "Unrecognized hardware type: \"Expected hardware type o or e but got {hardwareType}\""],
		[O, "Invalid Outposts Bucket alias - it must be a valid bucket name."],
		[O, "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`."],
		[O, "Custom endpoint `{Endpoint}` was not a valid URI"],
		[O, "S3 Accelerate cannot be used in this region"],
		["https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", L],
		["https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", L],
		["https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", L],
		["https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", L],
		[Hf, I],
		[Bf, I],
		[Hf, L],
		[Bf, L],
		[Uf, I],
		[Uf, L],
		[Wf, I],
		[Wf, L],
		["https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", L],
		[O, "Invalid region: region was not a valid DNS name."],
		[O, "S3 Object Lambda does not support Dual-stack"],
		[O, "S3 Object Lambda does not support S3 Accelerate"],
		[O, "Access points are not supported for this operation"],
		[O, "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`"],
		[O, "Invalid ARN: Missing account id"],
		[Gf(1), fp],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", fp],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", fp],
		[O, Kf(1)],
		[O, "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`"],
		[O, "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)"],
		[O, "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`"],
		[O, "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`."],
		[O, "Invalid ARN: bucket ARN is missing a region"],
		[O, "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided"],
		[O, "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`"],
		[O, "Access Points do not support S3 Accelerate"],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", pp],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", pp],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", pp],
		[Gf(1), pp],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", pp],
		[O, "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}"],
		[O, "S3 MRAP does not support dual-stack"],
		[O, "S3 MRAP does not support FIPS"],
		[O, "S3 MRAP does not support S3 Accelerate"],
		[O, "Invalid configuration: Multi-Region Access Point ARNs are disabled."],
		["https://{accessPointName_ssa_1}.accesspoint.s3-global.{partitionResult#dnsSuffix}", { [lf]: [{
			[uf]: k,
			name: qf,
			[df]: zf,
			[pf]: xp
		}] }],
		[O, "Client was configured for partition `{partitionResult#name}` but bucket referred to partition `{bucketArn#partition}`"],
		[O, "Invalid Access Point Name"],
		[O, "S3 Outposts does not support Dual-stack"],
		[O, "S3 Outposts does not support FIPS"],
		[O, "S3 Outposts does not support S3 Accelerate"],
		[O, "Invalid Arn: Outpost Access Point ARN contains sub resources"],
		["https://{accessPointName_ssa_2}-{bucketArn#accountId}.{outpostId_ssa_1}.{url#authority}", mp],
		["https://{accessPointName_ssa_2}-{bucketArn#accountId}.{outpostId_ssa_1}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", mp],
		[O, Kf(2)],
		[O, "Expected an outpost type `accesspoint`, found {outpostType}"],
		[O, "Invalid ARN: expected an access point name"],
		[O, "Invalid ARN: Expected a 4-component resource"],
		[O, "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId_ssa_1}`"],
		[O, "Invalid ARN: The Outpost Id was not set"],
		[O, "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})"],
		[O, "Invalid ARN: No ARN type specified"],
		[O, "Invalid ARN: `{Bucket}` was not a valid ARN"],
		[O, "Path-style addressing cannot be used with ARN buckets"],
		["https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", I],
		["https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", L],
		["https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", I],
		["https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", L],
		["https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", I],
		["https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", L],
		[Jf, I],
		[Jf, L],
		[Yf, I],
		[Yf, L],
		["https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", L],
		[O, "Path-style addressing cannot be used with S3 Accelerate"],
		[Vf, hp],
		["https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", hp],
		["https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", hp],
		["https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", L],
		["https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://s3-fips.{Region}.{partitionResult#dnsSuffix}", L],
		["https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", I],
		["https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", L],
		[Vf, I],
		[Vf, L],
		[Xf, I],
		[Xf, L],
		["https://s3.{Region}.{partitionResult#dnsSuffix}", L],
		[O, "A region must be set when sending requests to S3."]
	]
}, Cp = 2, wp = new Int32Array([
	-1,
	1,
	-1,
	0,
	3,
	100000115,
	1,
	424,
	4,
	2,
	272,
	5,
	3,
	233,
	6,
	4,
	85,
	7,
	5,
	15,
	8,
	8,
	9,
	100000115,
	16,
	10,
	13,
	18,
	11,
	13,
	19,
	12,
	13,
	22,
	100000014,
	13,
	35,
	14,
	100000042,
	36,
	100000103,
	435,
	6,
	271,
	16,
	7,
	270,
	17,
	8,
	19,
	18,
	14,
	501,
	106,
	9,
	20,
	24,
	10,
	21,
	24,
	11,
	22,
	24,
	12,
	23,
	24,
	13,
	547,
	24,
	14,
	77,
	25,
	20,
	73,
	26,
	26,
	27,
	78,
	37,
	28,
	100000086,
	38,
	100000086,
	29,
	39,
	47,
	30,
	48,
	100000058,
	31,
	50,
	32,
	100000085,
	51,
	33,
	136,
	55,
	100000076,
	34,
	59,
	35,
	100000084,
	60,
	39,
	36,
	61,
	37,
	100000083,
	62,
	38,
	146,
	63,
	41,
	100000046,
	61,
	40,
	100000083,
	62,
	41,
	150,
	64,
	42,
	100000054,
	66,
	43,
	100000053,
	70,
	44,
	100000052,
	71,
	45,
	100000081,
	73,
	46,
	100000080,
	74,
	100000078,
	100000079,
	40,
	48,
	100000057,
	41,
	100000057,
	49,
	42,
	185,
	50,
	48,
	62,
	51,
	49,
	100000045,
	52,
	51,
	53,
	526,
	60,
	56,
	54,
	62,
	100000055,
	55,
	63,
	57,
	100000046,
	62,
	100000055,
	57,
	64,
	58,
	100000054,
	66,
	59,
	100000053,
	69,
	60,
	100000065,
	70,
	61,
	100000052,
	72,
	100000064,
	100000051,
	49,
	100000045,
	63,
	51,
	64,
	526,
	60,
	67,
	65,
	62,
	100000055,
	66,
	63,
	68,
	100000046,
	62,
	100000055,
	68,
	64,
	69,
	100000054,
	66,
	70,
	100000053,
	68,
	100000047,
	71,
	70,
	72,
	100000052,
	72,
	100000050,
	100000051,
	25,
	74,
	100000042,
	46,
	100000039,
	75,
	57,
	76,
	100000041,
	58,
	100000040,
	100000041,
	26,
	100000088,
	78,
	28,
	100000087,
	79,
	34,
	82,
	80,
	35,
	81,
	545,
	36,
	100000103,
	100000115,
	46,
	100000097,
	83,
	57,
	84,
	100000099,
	58,
	100000098,
	100000099,
	5,
	101,
	86,
	8,
	87,
	100000115,
	16,
	88,
	89,
	18,
	91,
	89,
	19,
	90,
	92,
	21,
	97,
	95,
	19,
	93,
	92,
	21,
	98,
	95,
	21,
	97,
	94,
	22,
	100000014,
	95,
	35,
	96,
	100000042,
	36,
	100000103,
	100000042,
	22,
	100000013,
	98,
	35,
	99,
	100000042,
	36,
	100000101,
	100,
	46,
	100000110,
	100000111,
	6,
	214,
	102,
	7,
	208,
	103,
	8,
	119,
	104,
	14,
	118,
	105,
	21,
	106,
	100000023,
	26,
	107,
	502,
	37,
	108,
	100000086,
	38,
	100000086,
	109,
	39,
	112,
	110,
	48,
	100000058,
	111,
	50,
	136,
	100000085,
	40,
	113,
	100000057,
	41,
	100000057,
	114,
	42,
	115,
	500,
	48,
	100000056,
	116,
	52,
	117,
	100000072,
	65,
	100000069,
	100000072,
	21,
	501,
	100000023,
	9,
	120,
	124,
	10,
	121,
	124,
	11,
	122,
	124,
	12,
	123,
	124,
	13,
	202,
	124,
	14,
	195,
	125,
	20,
	190,
	126,
	21,
	127,
	100000023,
	23,
	128,
	129,
	24,
	189,
	129,
	26,
	130,
	197,
	37,
	131,
	100000086,
	38,
	100000086,
	132,
	39,
	159,
	133,
	48,
	100000058,
	134,
	50,
	135,
	100000085,
	51,
	141,
	136,
	55,
	100000076,
	137,
	59,
	138,
	100000084,
	60,
	100000083,
	139,
	61,
	140,
	100000083,
	63,
	100000083,
	100000046,
	55,
	100000076,
	142,
	59,
	143,
	100000084,
	60,
	148,
	144,
	61,
	145,
	100000083,
	62,
	147,
	146,
	63,
	150,
	100000046,
	63,
	153,
	100000046,
	61,
	149,
	100000083,
	62,
	153,
	150,
	64,
	151,
	100000054,
	66,
	152,
	100000053,
	70,
	100000082,
	100000052,
	64,
	154,
	100000054,
	66,
	155,
	100000053,
	70,
	156,
	100000052,
	71,
	157,
	100000081,
	73,
	158,
	100000080,
	74,
	100000077,
	100000079,
	40,
	160,
	100000057,
	41,
	100000057,
	161,
	42,
	185,
	162,
	48,
	174,
	163,
	49,
	100000045,
	164,
	51,
	165,
	526,
	60,
	168,
	166,
	62,
	100000055,
	167,
	63,
	169,
	100000046,
	62,
	100000055,
	169,
	64,
	170,
	100000054,
	66,
	171,
	100000053,
	69,
	172,
	100000065,
	70,
	173,
	100000052,
	72,
	100000063,
	100000051,
	49,
	100000045,
	175,
	51,
	176,
	526,
	60,
	179,
	177,
	62,
	100000055,
	178,
	63,
	180,
	100000046,
	62,
	100000055,
	180,
	64,
	181,
	100000054,
	66,
	182,
	100000053,
	68,
	100000047,
	183,
	70,
	184,
	100000052,
	72,
	100000048,
	100000051,
	48,
	100000056,
	186,
	52,
	187,
	100000072,
	65,
	100000069,
	188,
	67,
	100000070,
	100000071,
	25,
	100000036,
	100000042,
	21,
	191,
	100000023,
	25,
	192,
	100000042,
	30,
	194,
	193,
	46,
	100000034,
	100000036,
	46,
	100000033,
	100000035,
	21,
	196,
	100000023,
	26,
	100000088,
	197,
	28,
	100000087,
	198,
	34,
	201,
	199,
	35,
	200,
	545,
	36,
	100000101,
	100000115,
	46,
	100000095,
	100000096,
	17,
	203,
	100000022,
	20,
	204,
	100000021,
	21,
	205,
	550,
	33,
	206,
	550,
	44,
	100000016,
	207,
	45,
	100000018,
	100000020,
	8,
	209,
	215,
	16,
	210,
	220,
	18,
	211,
	220,
	19,
	212,
	224,
	20,
	213,
	227,
	21,
	231,
	401,
	8,
	218,
	215,
	19,
	216,
	100000009,
	20,
	217,
	227,
	21,
	231,
	100000009,
	16,
	219,
	220,
	18,
	223,
	220,
	19,
	221,
	224,
	20,
	222,
	227,
	21,
	231,
	100000012,
	19,
	226,
	224,
	20,
	225,
	100000009,
	21,
	100000009,
	100000012,
	20,
	230,
	227,
	21,
	228,
	100000009,
	30,
	229,
	100000009,
	34,
	100000007,
	100000009,
	21,
	231,
	415,
	30,
	232,
	100000008,
	34,
	100000007,
	100000008,
	4,
	100000002,
	234,
	5,
	235,
	480,
	6,
	271,
	236,
	7,
	270,
	237,
	8,
	238,
	491,
	9,
	239,
	243,
	10,
	240,
	243,
	11,
	241,
	243,
	12,
	242,
	243,
	13,
	547,
	243,
	14,
	266,
	244,
	20,
	264,
	245,
	26,
	246,
	267,
	37,
	247,
	100000086,
	38,
	100000086,
	248,
	39,
	249,
	518,
	40,
	250,
	100000057,
	41,
	100000057,
	251,
	42,
	538,
	252,
	48,
	100000043,
	253,
	49,
	100000045,
	254,
	51,
	255,
	526,
	60,
	258,
	256,
	62,
	100000055,
	257,
	63,
	259,
	100000046,
	62,
	100000055,
	259,
	64,
	260,
	100000054,
	66,
	261,
	100000053,
	69,
	262,
	100000065,
	70,
	263,
	100000052,
	72,
	100000062,
	100000051,
	25,
	265,
	100000042,
	46,
	100000031,
	100000032,
	26,
	100000088,
	267,
	28,
	100000087,
	268,
	34,
	269,
	544,
	46,
	100000093,
	100000094,
	8,
	397,
	100000009,
	8,
	407,
	100000009,
	3,
	346,
	273,
	4,
	100000003,
	274,
	5,
	284,
	275,
	8,
	276,
	100000115,
	15,
	100000005,
	277,
	16,
	278,
	281,
	18,
	279,
	281,
	19,
	280,
	281,
	22,
	100000014,
	281,
	35,
	282,
	100000042,
	36,
	100000102,
	283,
	46,
	100000106,
	100000107,
	6,
	405,
	285,
	7,
	395,
	286,
	8,
	295,
	287,
	14,
	501,
	288,
	26,
	289,
	502,
	37,
	290,
	100000086,
	38,
	100000086,
	291,
	39,
	292,
	307,
	40,
	293,
	100000057,
	41,
	100000057,
	294,
	42,
	335,
	500,
	9,
	296,
	300,
	10,
	297,
	300,
	11,
	298,
	300,
	12,
	299,
	300,
	13,
	394,
	300,
	14,
	339,
	301,
	15,
	100000005,
	302,
	20,
	337,
	303,
	26,
	304,
	341,
	37,
	305,
	100000086,
	38,
	100000086,
	306,
	39,
	309,
	307,
	48,
	100000058,
	308,
	50,
	100000074,
	100000085,
	40,
	310,
	100000057,
	41,
	100000057,
	311,
	42,
	335,
	312,
	48,
	324,
	313,
	49,
	100000045,
	314,
	51,
	315,
	526,
	60,
	318,
	316,
	62,
	100000055,
	317,
	63,
	319,
	100000046,
	62,
	100000055,
	319,
	64,
	320,
	100000054,
	66,
	321,
	100000053,
	69,
	322,
	100000065,
	70,
	323,
	100000052,
	72,
	100000061,
	100000051,
	49,
	100000045,
	325,
	51,
	326,
	526,
	60,
	329,
	327,
	62,
	100000055,
	328,
	63,
	330,
	100000046,
	62,
	100000055,
	330,
	64,
	331,
	100000054,
	66,
	332,
	100000053,
	68,
	100000047,
	333,
	70,
	334,
	100000052,
	72,
	100000049,
	100000051,
	48,
	100000056,
	336,
	52,
	100000067,
	100000072,
	25,
	338,
	100000042,
	46,
	100000027,
	100000028,
	15,
	100000005,
	340,
	26,
	100000088,
	341,
	28,
	100000087,
	342,
	34,
	345,
	343,
	35,
	344,
	545,
	36,
	100000102,
	100000115,
	46,
	100000091,
	100000092,
	4,
	100000002,
	347,
	5,
	357,
	348,
	8,
	349,
	100000115,
	15,
	100000005,
	350,
	16,
	351,
	354,
	18,
	352,
	354,
	19,
	353,
	354,
	22,
	100000014,
	354,
	35,
	355,
	100000042,
	36,
	100000043,
	356,
	46,
	100000104,
	100000105,
	6,
	405,
	358,
	7,
	395,
	359,
	8,
	360,
	491,
	9,
	361,
	365,
	10,
	362,
	365,
	11,
	363,
	365,
	12,
	364,
	365,
	13,
	394,
	365,
	14,
	389,
	366,
	15,
	100000005,
	367,
	20,
	387,
	368,
	26,
	369,
	391,
	37,
	370,
	100000086,
	38,
	100000086,
	371,
	39,
	372,
	518,
	40,
	373,
	100000057,
	41,
	100000057,
	374,
	42,
	538,
	375,
	48,
	100000043,
	376,
	49,
	100000045,
	377,
	51,
	378,
	526,
	60,
	381,
	379,
	62,
	100000055,
	380,
	63,
	382,
	100000046,
	62,
	100000055,
	382,
	64,
	383,
	100000054,
	66,
	384,
	100000053,
	69,
	385,
	100000065,
	70,
	386,
	100000052,
	72,
	100000060,
	100000051,
	25,
	388,
	100000042,
	46,
	100000025,
	100000026,
	15,
	100000005,
	390,
	26,
	100000088,
	391,
	28,
	100000087,
	392,
	34,
	393,
	544,
	46,
	100000089,
	100000090,
	15,
	100000005,
	547,
	8,
	396,
	100000009,
	15,
	100000005,
	397,
	16,
	398,
	410,
	18,
	399,
	410,
	19,
	400,
	410,
	20,
	401,
	100000009,
	27,
	402,
	100000012,
	29,
	100000011,
	403,
	31,
	100000011,
	404,
	32,
	100000011,
	422,
	8,
	406,
	100000009,
	15,
	100000005,
	407,
	16,
	408,
	410,
	18,
	409,
	410,
	19,
	411,
	410,
	20,
	100000012,
	100000009,
	20,
	414,
	412,
	22,
	413,
	100000009,
	34,
	100000010,
	100000009,
	22,
	416,
	415,
	27,
	419,
	100000012,
	27,
	418,
	417,
	34,
	100000010,
	100000012,
	34,
	100000010,
	419,
	43,
	100000011,
	420,
	47,
	100000011,
	421,
	53,
	100000011,
	422,
	54,
	100000011,
	423,
	56,
	100000011,
	100000012,
	2,
	100000001,
	425,
	3,
	478,
	426,
	4,
	100000004,
	427,
	5,
	438,
	428,
	8,
	429,
	100000115,
	16,
	430,
	433,
	18,
	431,
	433,
	19,
	432,
	433,
	22,
	100000014,
	433,
	35,
	434,
	100000042,
	36,
	100000044,
	435,
	46,
	100000112,
	436,
	57,
	437,
	100000114,
	58,
	100000113,
	100000114,
	6,
	100000006,
	439,
	7,
	100000006,
	440,
	8,
	450,
	441,
	14,
	501,
	442,
	26,
	443,
	502,
	37,
	444,
	100000086,
	38,
	100000086,
	445,
	39,
	446,
	465,
	40,
	447,
	100000057,
	41,
	100000057,
	448,
	42,
	471,
	449,
	48,
	100000044,
	500,
	9,
	451,
	455,
	10,
	452,
	455,
	11,
	453,
	455,
	12,
	454,
	455,
	13,
	547,
	455,
	14,
	473,
	456,
	15,
	460,
	457,
	20,
	458,
	461,
	25,
	459,
	100000042,
	46,
	100000037,
	100000038,
	20,
	540,
	461,
	26,
	462,
	474,
	37,
	463,
	100000086,
	38,
	100000086,
	464,
	39,
	467,
	465,
	48,
	100000058,
	466,
	50,
	100000075,
	100000085,
	40,
	468,
	100000057,
	41,
	100000057,
	469,
	42,
	471,
	470,
	48,
	100000044,
	524,
	48,
	100000044,
	472,
	52,
	100000068,
	100000072,
	26,
	100000088,
	474,
	28,
	100000087,
	475,
	34,
	100000100,
	476,
	35,
	477,
	545,
	36,
	100000044,
	100000115,
	4,
	100000002,
	479,
	5,
	488,
	480,
	8,
	481,
	100000115,
	16,
	482,
	485,
	18,
	483,
	485,
	19,
	484,
	485,
	22,
	100000014,
	485,
	35,
	486,
	100000042,
	36,
	100000043,
	487,
	46,
	100000108,
	100000109,
	6,
	100000006,
	489,
	7,
	100000006,
	490,
	8,
	503,
	491,
	14,
	501,
	492,
	26,
	493,
	502,
	37,
	494,
	100000086,
	38,
	100000086,
	495,
	39,
	496,
	518,
	40,
	497,
	100000057,
	41,
	100000057,
	498,
	42,
	538,
	499,
	48,
	100000043,
	500,
	49,
	100000045,
	526,
	26,
	100000088,
	502,
	28,
	100000087,
	100000115,
	9,
	504,
	508,
	10,
	505,
	508,
	11,
	506,
	508,
	12,
	507,
	508,
	13,
	547,
	508,
	14,
	541,
	509,
	15,
	513,
	510,
	20,
	511,
	514,
	25,
	512,
	100000042,
	46,
	100000029,
	100000030,
	20,
	540,
	514,
	26,
	515,
	542,
	37,
	516,
	100000086,
	38,
	100000086,
	517,
	39,
	520,
	518,
	48,
	100000058,
	519,
	50,
	100000073,
	100000085,
	40,
	521,
	100000057,
	41,
	100000057,
	522,
	42,
	538,
	523,
	48,
	100000043,
	524,
	49,
	100000045,
	525,
	51,
	529,
	526,
	60,
	100000055,
	527,
	62,
	100000055,
	528,
	63,
	100000055,
	100000046,
	60,
	532,
	530,
	62,
	100000055,
	531,
	63,
	533,
	100000046,
	62,
	100000055,
	533,
	64,
	534,
	100000054,
	66,
	535,
	100000053,
	69,
	536,
	100000065,
	70,
	537,
	100000052,
	72,
	100000059,
	100000051,
	48,
	100000043,
	539,
	52,
	100000066,
	100000072,
	25,
	100000024,
	100000042,
	26,
	100000088,
	542,
	28,
	100000087,
	543,
	34,
	100000100,
	544,
	35,
	546,
	545,
	36,
	100000042,
	100000115,
	36,
	100000043,
	100000115,
	17,
	548,
	100000022,
	20,
	549,
	100000021,
	33,
	552,
	550,
	44,
	100000017,
	551,
	45,
	100000019,
	100000020,
	44,
	100000015,
	553,
	45,
	100000015,
	100000020
]), Tp = Dr.from(wp, Cp, Sp.conditions, Sp.results);
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/endpointResolver.js
Hi();
var Ep = new kr({
	size: 50,
	params: [
		"Accelerate",
		"Bucket",
		"DisableAccessPoints",
		"DisableMultiRegionAccessPoints",
		"DisableS3ExpressSessionAuth",
		"Endpoint",
		"ForcePathStyle",
		"Region",
		"UseArnRegion",
		"UseDualStack",
		"UseFIPS",
		"UseGlobalEndpoint",
		"UseObjectLambdaEndpoint",
		"UseS3ExpressControlEndpoint"
	]
}), Dp = (e, t = {}) => Ep.get(e, () => Ri(Tp, {
	endpointParams: e,
	logger: t.logger
}));
zr.aws = Kc, le(), be(), Hi();
var Op = ((e) => async (t, n, r) => {
	if (!r) throw Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
	let i = await e(t, n, r), a = ce(n)?.commandInstance?.constructor?.getEndpointParameterInstructions;
	if (!a) throw Error(`getEndpointParameterInstructions() is not defined on '${n.commandName}'`);
	let o = await gr(r, { getEndpointParameterInstructions: a }, t);
	return Object.assign(i, o);
})(async (e, t, n) => ({
	operation: ce(t).operation,
	region: await ye(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
}));
function kp(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "s3",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
function Ap(e) {
	return {
		schemeId: "aws.auth#sigv4a",
		signingProperties: {
			name: "s3",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var jp = ((e, t, n) => (r) => {
	let i = e(r).properties?.authSchemes;
	if (!i) return t(r);
	let a = [];
	for (let e of i) {
		let { name: t, properties: o = {}, ...s } = e, c = t.toLowerCase();
		t !== c && console.warn(`HttpAuthScheme has been normalized with lowercasing: '${t}' to '${c}'`);
		let l;
		if (c === "sigv4a") {
			l = "aws.auth#sigv4a";
			let e = i.find((e) => {
				let t = e.name.toLowerCase();
				return t !== "sigv4a" && t.startsWith("sigv4");
			});
			if (Ju.sigv4aDependency() === "none" && e) continue;
		} else if (c.startsWith("sigv4")) l = "aws.auth#sigv4";
		else throw Error(`Unknown HttpAuthScheme found in '@smithy.rules#endpointRuleSet': '${c}'`);
		let u = n[l];
		if (!u) throw Error(`Could not find HttpAuthOption create function for '${l}'`);
		let d = u(r);
		d.schemeId = l, d.signingProperties = {
			...d.signingProperties || {},
			...s,
			...o
		}, a.push(d);
	}
	return a;
})(Dp, (e) => {
	let t = [];
	return e.operation, t.push(kp(e)), t.push(Ap(e)), t;
}, {
	"aws.auth#sigv4": kp,
	"aws.auth#sigv4a": Ap
}), Mp = (e) => {
	let t = nf(sf(e));
	return Object.assign(t, { authSchemePreference: ye(e.authSchemePreference ?? []) });
}, Np = (e) => Object.assign(e, {
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	forcePathStyle: e.forcePathStyle ?? !1,
	useAccelerateEndpoint: e.useAccelerateEndpoint ?? !1,
	useGlobalEndpoint: e.useGlobalEndpoint ?? !1,
	disableMultiregionAccessPoints: e.disableMultiregionAccessPoints ?? !1,
	defaultSigningName: "s3",
	clientContextParams: e.clientContextParams ?? {}
}), Pp = {
	ForcePathStyle: {
		type: "clientContextParams",
		name: "forcePathStyle"
	},
	UseArnRegion: {
		type: "clientContextParams",
		name: "useArnRegion"
	},
	DisableMultiRegionAccessPoints: {
		type: "clientContextParams",
		name: "disableMultiregionAccessPoints"
	},
	Accelerate: {
		type: "clientContextParams",
		name: "useAccelerateEndpoint"
	},
	DisableS3ExpressSessionAuth: {
		type: "clientContextParams",
		name: "disableS3ExpressSessionAuth"
	},
	UseGlobalEndpoint: {
		type: "builtInParams",
		name: "useGlobalEndpoint"
	},
	UseFIPS: {
		type: "builtInParams",
		name: "useFipsEndpoint"
	},
	Endpoint: {
		type: "builtInParams",
		name: "endpoint"
	},
	Region: {
		type: "builtInParams",
		name: "region"
	},
	UseDualStack: {
		type: "builtInParams",
		name: "useDualstackEndpoint"
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/commandBuilder.js
Hi();
var Fp = _t(Pp, "AmazonS3", "S3Client", Vi), Ip = {
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	},
	Key: {
		type: "contextParams",
		name: "Key"
	}
}, Lp = {
	DisableS3ExpressSessionAuth: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	},
	Key: {
		type: "contextParams",
		name: "Key"
	},
	CopySource: {
		type: "contextParams",
		name: "CopySource"
	}
}, Rp = {
	UseS3ExpressControlEndpoint: {
		type: "staticContextParams",
		value: !0
	},
	DisableAccessPoints: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	}
}, zp = {
	UseS3ExpressControlEndpoint: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	}
}, Bp = {
	DisableS3ExpressSessionAuth: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	}
}, Vp = { Bucket: {
	type: "contextParams",
	name: "Bucket"
} }, Hp = {}, Up = {
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	},
	Prefix: {
		type: "contextParams",
		name: "Prefix"
	}
}, Wp = (e, t, n, r) => [ud(n)], Gp = (e, t, n, r) => [ud(n), Gd(n)], Kp = (e, t, n, r) => [ud(n), Hd(n)], qp = (e, t, n, r) => [], Jp = (e, t, n, r) => [Ll(n, {
	requestAlgorithmMember: {
		httpHeader: "x-amz-sdk-checksum-algorithm",
		name: "ChecksumAlgorithm"
	},
	requestChecksumRequired: !0
}), ud(n)], Yp = (e, t, n, r) => [
	Ll(n, {
		requestChecksumRequired: !1,
		requestValidationModeMember: "ChecksumMode",
		responseAlgorithms: [
			"CRC64NVME",
			"CRC32",
			"CRC32C",
			"SHA256",
			"SHA1",
			"SHA512",
			"MD5",
			"XXHASH64",
			"XXHASH3",
			"XXHASH128"
		]
	}),
	Gd(n),
	tu(n)
], Xp = (e, t, n, r) => [
	Ll(n, {
		requestAlgorithmMember: {
			httpHeader: "x-amz-sdk-checksum-algorithm",
			name: "ChecksumAlgorithm"
		},
		requestChecksumRequired: !1
	}),
	Ul(n),
	ud(n),
	Gd(n)
], R = class e extends at {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.s3#S3ServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, Zp = class e extends R {
	static shapeId = "com.amazonaws.s3#NoSuchUpload";
	name = "NoSuchUpload";
	$fault = "client";
	constructor(t) {
		super({
			name: "NoSuchUpload",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Qp = class e extends R {
	static shapeId = "com.amazonaws.s3#AccessDenied";
	name = "AccessDenied";
	$fault = "client";
	constructor(t) {
		super({
			name: "AccessDenied",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, $p = class e extends R {
	static shapeId = "com.amazonaws.s3#ObjectNotInActiveTierError";
	name = "ObjectNotInActiveTierError";
	$fault = "client";
	constructor(t) {
		super({
			name: "ObjectNotInActiveTierError",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, em = class e extends R {
	static shapeId = "com.amazonaws.s3#BucketAlreadyExists";
	name = "BucketAlreadyExists";
	$fault = "client";
	constructor(t) {
		super({
			name: "BucketAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, tm = class e extends R {
	static shapeId = "com.amazonaws.s3#BucketAlreadyOwnedByYou";
	name = "BucketAlreadyOwnedByYou";
	$fault = "client";
	constructor(t) {
		super({
			name: "BucketAlreadyOwnedByYou",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nm = class e extends R {
	static shapeId = "com.amazonaws.s3#NoSuchBucket";
	name = "NoSuchBucket";
	$fault = "client";
	constructor(t) {
		super({
			name: "NoSuchBucket",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, rm = class e extends R {
	static shapeId = "com.amazonaws.s3#NoSuchKey";
	name = "NoSuchKey";
	$fault = "client";
	constructor(t) {
		super({
			name: "NoSuchKey",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, im = class e extends R {
	static shapeId = "com.amazonaws.s3#InvalidObjectState";
	name = "InvalidObjectState";
	$fault = "client";
	StorageClass;
	AccessTier;
	constructor(t) {
		super({
			name: "InvalidObjectState",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.StorageClass = t.StorageClass, this.AccessTier = t.AccessTier;
	}
}, am = class e extends R {
	static shapeId = "com.amazonaws.s3#NoSuchAnnotation";
	name = "NoSuchAnnotation";
	$fault = "client";
	constructor(t) {
		super({
			name: "NoSuchAnnotation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, om = class e extends R {
	static shapeId = "com.amazonaws.s3#NotFound";
	name = "NotFound";
	$fault = "client";
	constructor(t) {
		super({
			name: "NotFound",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, sm = class e extends R {
	static shapeId = "com.amazonaws.s3#InvalidPrefix";
	name = "InvalidPrefix";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidPrefix",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cm = class e extends R {
	static shapeId = "com.amazonaws.s3#EncryptionTypeMismatch";
	name = "EncryptionTypeMismatch";
	$fault = "client";
	constructor(t) {
		super({
			name: "EncryptionTypeMismatch",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lm = class e extends R {
	static shapeId = "com.amazonaws.s3#InvalidRequest";
	name = "InvalidRequest";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidRequest",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, um = class e extends R {
	static shapeId = "com.amazonaws.s3#InvalidWriteOffset";
	name = "InvalidWriteOffset";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidWriteOffset",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, dm = class e extends R {
	static shapeId = "com.amazonaws.s3#TooManyParts";
	name = "TooManyParts";
	$fault = "client";
	constructor(t) {
		super({
			name: "TooManyParts",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, fm = class e extends R {
	static shapeId = "com.amazonaws.s3#AnnotationLimitExceeded";
	name = "AnnotationLimitExceeded";
	$fault = "client";
	constructor(t) {
		super({
			name: "AnnotationLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pm = class e extends R {
	static shapeId = "com.amazonaws.s3#AnnotationNameTooLong";
	name = "AnnotationNameTooLong";
	$fault = "client";
	constructor(t) {
		super({
			name: "AnnotationNameTooLong",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, mm = class e extends R {
	static shapeId = "com.amazonaws.s3#InvalidAnnotationName";
	name = "InvalidAnnotationName";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidAnnotationName",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hm = class e extends R {
	static shapeId = "com.amazonaws.s3#UnsupportedMediaType";
	name = "UnsupportedMediaType";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnsupportedMediaType",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gm = class e extends R {
	static shapeId = "com.amazonaws.s3#IdempotencyParameterMismatch";
	name = "IdempotencyParameterMismatch";
	$fault = "client";
	constructor(t) {
		super({
			name: "IdempotencyParameterMismatch",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _m = class e extends R {
	static shapeId = "com.amazonaws.s3#ObjectAlreadyInActiveTierError";
	name = "ObjectAlreadyInActiveTierError";
	$fault = "client";
	constructor(t) {
		super({
			name: "ObjectAlreadyInActiveTierError",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/schemas/schemas_0.js
S();
var vm = "ACL", ym = "AccessDenied", bm = "AnnotationDirective", xm = "AccessKeyId", Sm = "AnnotationLimitExceeded", Cm = "AnnotationNameTooLong", wm = "AcceptRanges", Tm = "AccessTier", Em = "Bucket", Dm = "BucketArn", Om = "BucketAlreadyExists", km = "BucketAlreadyOwnedByYou", Am = "BypassGovernanceRetention", jm = "BucketInfo", Mm = "BucketKeyEnabled", Nm = "BucketNamespace", Pm = "BucketRegion", Fm = "Body", Im = "Buckets", Lm = "ChecksumAlgorithm", Rm = "CreateBucket", zm = "CreateBucketConfiguration", Bm = "CreateBucketOutput", Vm = "CreateBucketRequest", Hm = "CacheControl", Um = "ChecksumCRC32", Wm = "ChecksumCRC32C", Gm = "ChecksumCRC64NVME", Km = "Cache-Control", qm = "CreationDate", Jm = "Content-Disposition", Ym = "ContentDisposition", Xm = "Content-Encoding", Zm = "ContentEncoding", Qm = "ContentLanguage", $m = "Content-Language", eh = "Content-Length", th = "ContentLength", nh = "Content-MD5", rh = "ChecksumMD5", ih = "ContentMD5", ah = "ChecksumMode", oh = "CopyObject", sh = "CopyObjectOutput", ch = "CopyObjectResult", lh = "CopyObjectRequest", uh = "CommonPrefix", dh = "CommonPrefixList", fh = "CommonPrefixes", ph = "ContentRange", mh = "Content-Range", hh = "ChecksumSHA1", gh = "ChecksumSHA256", _h = "ChecksumSHA512", vh = "CopySourceIfMatch", yh = "CopySourceIfModifiedSince", bh = "CopySourceIfNoneMatch", xh = "CopySourceIfUnmodifiedSince", Sh = "CreateSessionOutput", Ch = "CreateSessionResult", wh = "CreateSessionRequest", Th = "CopySourceSSECustomerAlgorithm", Eh = "CopySourceSSECustomerKey", Dh = "CopySourceSSECustomerKeyMD5", Oh = "CopySourceVersionId", kh = "CopySource", Ah = "CreateSession", jh = "ChecksumType", Mh = "Content-Type", Nh = "ContentType", Ph = "ContinuationToken", Fh = "ChecksumXXHASH64", Ih = "ChecksumXXHASH3", Lh = "ChecksumXXHASH128", Rh = "Code", zh = "Contents", Bh = "Credentials", Vh = "DeleteBucket", Hh = "DeleteBucketRequest", Uh = "DeleteMarker", Wh = "DeleteMarkerEntry", Gh = "DeleteMarkerVersionId", Kh = "DeleteMarkers", qh = "DisplayName", Jh = "DeletedObject", Yh = "DeleteObjectOutput", Xh = "DeleteObjectsOutput", Zh = "DeleteObjectRequest", Qh = "DeleteObjectsRequest", $h = "DeletedObjects", eg = "DeleteObject", tg = "DeleteObjects", ng = "DataRedundancy", rg = "DeleteResult", ig = "Delete", ag = "Deleted", og = "Delimiter", sg = "Error", cg = "ExpectedBucketOwner", lg = "ExpiresString", ug = "ExpectedSourceBucketOwner", dg = "ETag", fg = "EncryptionTypeMismatch", pg = "EncodingType", mg = "Errors", hg = "Expiration", gg = "Expires", _g = "FetchOwner", vg = "GetBucketTagging", yg = "GetBucketTaggingOutput", bg = "GetBucketTaggingRequest", xg = "GetBucketVersioning", Sg = "GetBucketVersioningOutput", Cg = "GetBucketVersioningRequest", wg = "GrantFullControl", Tg = "GetObject", Eg = "GetObjectOutput", Dg = "GetObjectRequest", Og = "GrantRead", kg = "GrantReadACP", Ag = "GrantWrite", jg = "GrantWriteACP", Mg = "InvalidAnnotationName", Ng = "ID", Pg = "IsLatest", Fg = "IfMatch", Ig = "IfMatchLastModifiedTime", Lg = "IfMatchSize", Rg = "If-Modified-Since", zg = "IfModifiedSince", Bg = "If-Match", Vg = "IfNoneMatch", Hg = "If-None-Match", Ug = "InvalidObjectState", Wg = "InvalidPrefix", Gg = "IdempotencyParameterMismatch", Kg = "InvalidRequest", qg = "IsRestoreInProgress", Jg = "IsTruncated", Yg = "IfUnmodifiedSince", Xg = "If-Unmodified-Since", Zg = "InvalidWriteOffset", Qg = "Key", $g = "KeyCount", e_ = "KeyMarker", t_ = "Location", n_ = "ListAllMyBucketsResult", r_ = "ListBuckets", i_ = "ListBucketsOutput", a_ = "ListBucketsRequest", o_ = "ListBucketResult", s_ = "LocationConstraint", c_ = "LocationInfo", l_ = "LastModified", u_ = "LastModifiedTime", d_ = "Last-Modified", f_ = "ListObjectsV2", p_ = "ListObjectsV2Output", m_ = "ListObjectVersionsOutput", h_ = "ListObjectsV2Request", g_ = "ListObjectVersionsRequest", __ = "ListObjectVersions", v_ = "ListVersionsResult", y_ = "Metadata", b_ = "MaxBuckets", x_ = "MetadataDirective", S_ = "MfaDelete", C_ = "MFA", w_ = "MFADelete", T_ = "MaxKeys", E_ = "MissingMeta", D_ = "Message", O_ = "Name", k_ = "NextContinuationToken", A_ = "NotFound", j_ = "NextKeyMarker", M_ = "NoSuchAnnotation", N_ = "NoSuchBucket", P_ = "NoSuchKey", F_ = "NoSuchUpload", I_ = "NextVersionIdMarker", L_ = "Owner", R_ = "ObjectAlreadyInActiveTierError", z_ = "ObjectIdentifier", B_ = "ObjectIdentifierList", V_ = "ObjectLockEnabledForBucket", H_ = "ObjectLockEventHold", U_ = "ObjectLockEventHoldDurationDays", W_ = "ObjectLockEventHoldDurationYears", G_ = "ObjectLockLegalHoldStatus", K_ = "ObjectLockMode", q_ = "ObjectLockRetainUntilDate", J_ = "ObjectList", Y_ = "ObjectNotInActiveTierError", X_ = "ObjectOwnership", Z_ = "OptionalObjectAttributes", Q_ = "ObjectVersion", $_ = "ObjectVersionList", ev = "Objects", tv = "Object", nv = "Prefix", rv = "PartsCount", iv = "PartNumber", av = "PutObject", ov = "PutObjectOutput", sv = "PutObjectRequest", cv = "Quiet", lv = "RequestCharged", uv = "ResponseCacheControl", dv = "ResponseContentDisposition", fv = "ResponseContentEncoding", pv = "ResponseContentLanguage", mv = "ResponseContentType", hv = "ResponseExpires", gv = "RestoreExpiryDate", _v = "RequestPayer", vv = "ReplicationStatus", yv = "RestoreStatus", bv = "Range", xv = "Restore", Sv = "Status", Cv = "StartAfter", wv = "SecretAccessKey", Tv = "StreamingBlob", Ev = "StorageClass", Dv = "SessionCredentialValue", Ov = "SessionCredentials", kv = "SessionMode", Av = "ServerSideEncryption", jv = "SSECustomerAlgorithm", Mv = "SSECustomerKey", Nv = "SSECustomerKeyMD5", Pv = "SSEKMSEncryptionContext", Fv = "SSEKMSKeyId", Iv = "SessionToken", Lv = "Size", Rv = "Tags", zv = "TagCount", Bv = "TaggingDirective", Vv = "TooManyParts", Hv = "TagSet", Uv = "Tag", Wv = "Tagging", Gv = "Type", Kv = "UnsupportedMediaType", qv = "Value", Jv = "VersioningConfiguration", Yv = "VersionId", Xv = "VersionIdMarker", Zv = "Versions", Qv = "Version", $v = "WriteOffsetBytes", ey = "WebsiteRedirectLocation", ty = "accept-ranges", ny = "bucket-region", z = "client", ry = "continuation-token", iy = "delimiter", B = "error", ay = "encoding-type", oy = "fetch-owner", sy = "http", cy = "httpChecksum", V = "httpError", H = "httpHeader", ly = "httpPayload", uy = "httpPrefixHeaders", U = "httpQuery", dy = "key-marker", fy = "max-buckets", py = "max-keys", my = "prefix", hy = "partNumber", gy = "response-cache-control", _y = "response-content-disposition", vy = "response-content-encoding", yy = "response-content-language", by = "response-content-type", xy = "response-expires", Sy = "smithy.ts.sdk.synthetic.com.amazonaws.s3", Cy = "start-after", wy = "streaming", Ty = "versionId", Ey = "version-id-marker", Dy = "xmlFlattened", W = "xmlName", Oy = "x-amz-acl", ky = "x-amz-bucket-arn", Ay = "x-amz-bypass-governance-retention", jy = "x-amz-bucket-namespace", My = "x-amz-bucket-object-lock-enabled", Ny = "x-amz-checksum-algorithm", Py = "x-amz-checksum-crc32", Fy = "x-amz-checksum-crc32c", Iy = "x-amz-checksum-crc64nvme", Ly = "x-amz-checksum-md5", Ry = "x-amz-checksum-mode", zy = "x-amz-checksum-sha1", By = "x-amz-checksum-sha256", Vy = "x-amz-checksum-sha512", Hy = "x-amz-copy-source", Uy = "x-amz-copy-source-if-match", Wy = "x-amz-copy-source-if-modified-since", Gy = "x-amz-copy-source-if-none-match", Ky = "x-amz-copy-source-if-unmodified-since", qy = "x-amz-create-session-mode", Jy = "x-amz-copy-source-server-side-encryption-customer-algorithm", Yy = "x-amz-copy-source-server-side-encryption-customer-key", Xy = "x-amz-copy-source-server-side-encryption-customer-key-MD5", Zy = "x-amz-copy-source-version-id", Qy = "x-amz-checksum-type", $y = "x-amz-checksum-xxhash64", eb = "x-amz-checksum-xxhash3", tb = "x-amz-checksum-xxhash128", nb = "x-amz-delete-marker", rb = "x-amz-expiration", ib = "x-amz-expected-bucket-owner", ab = "x-amz-grant-full-control", ob = "x-amz-grant-read", sb = "x-amz-grant-read-acp", cb = "x-amz-grant-write", lb = "x-amz-grant-write-acp", ub = "x-amz-if-match-last-modified-time", db = "x-amz-if-match-size", fb = "x-amz-meta-", pb = "x-amz-mfa", mb = "x-amz-metadata-directive", hb = "x-amz-missing-meta", gb = "x-amz-mp-parts-count", _b = "x-amz-object-annotation-directive", vb = "x-amz-object-lock-event-hold", yb = "x-amz-object-lock-event-hold-duration-days", bb = "x-amz-object-lock-event-hold-duration-years", xb = "x-amz-object-lock-legal-hold", Sb = "x-amz-object-lock-mode", Cb = "x-amz-object-lock-retain-until-date", wb = "x-amz-object-ownership", Tb = "x-amz-optional-object-attributes", Eb = "x-amz-object-size", Db = "x-amz-restore", Ob = "x-amz-request-charged", kb = "x-amz-request-payer", Ab = "x-amz-replication-status", jb = "x-amz-storage-class", Mb = "x-amz-sdk-checksum-algorithm", Nb = "x-amz-source-expected-bucket-owner", Pb = "x-amz-server-side-encryption", Fb = "x-amz-server-side-encryption-aws-kms-key-id", Ib = "x-amz-server-side-encryption-bucket-key-enabled", Lb = "x-amz-server-side-encryption-context", Rb = "x-amz-server-side-encryption-customer-algorithm", zb = "x-amz-server-side-encryption-customer-key", Bb = "x-amz-server-side-encryption-customer-key-MD5", Vb = "x-amz-tagging", Hb = "x-amz-tagging-count", Ub = "x-amz-tagging-directive", Wb = "x-amz-version-id", Gb = "x-amz-write-offset-bytes", Kb = "x-amz-website-redirect-location", G = "com.amazonaws.s3", qb = new Qe(Sy), Jb = [
	-3,
	Sy,
	"S3ServiceException",
	0,
	[],
	[]
];
qb.registerError(Jb, R);
var K = new Qe(G), Yb = [
	-3,
	G,
	ym,
	{
		[B]: z,
		[V]: 403
	},
	[],
	[]
];
K.registerError(Yb, Qp);
var Xb = [
	-3,
	G,
	Sm,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(Xb, fm);
var Zb = [
	-3,
	G,
	Cm,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(Zb, pm);
var Qb = [
	-3,
	G,
	Om,
	{
		[B]: z,
		[V]: 409
	},
	[],
	[]
];
K.registerError(Qb, em);
var $b = [
	-3,
	G,
	km,
	{
		[B]: z,
		[V]: 409
	},
	[],
	[]
];
K.registerError($b, tm);
var ex = [
	-3,
	G,
	fg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(ex, cm);
var tx = [
	-3,
	G,
	Gg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(tx, gm);
var nx = [
	-3,
	G,
	Mg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(nx, mm);
var rx = [
	-3,
	G,
	Ug,
	{
		[B]: z,
		[V]: 403
	},
	[Ev, Tm],
	[0, 0]
];
K.registerError(rx, im);
var ix = [
	-3,
	G,
	Wg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(ix, sm);
var ax = [
	-3,
	G,
	Kg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(ax, lm);
var ox = [
	-3,
	G,
	Zg,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(ox, um);
var sx = [
	-3,
	G,
	M_,
	{
		[B]: z,
		[V]: 404
	},
	[],
	[]
];
K.registerError(sx, am);
var cx = [
	-3,
	G,
	N_,
	{
		[B]: z,
		[V]: 404
	},
	[],
	[]
];
K.registerError(cx, nm);
var lx = [
	-3,
	G,
	P_,
	{
		[B]: z,
		[V]: 404
	},
	[],
	[]
];
K.registerError(lx, rm);
var ux = [
	-3,
	G,
	F_,
	{
		[B]: z,
		[V]: 404
	},
	[],
	[]
];
K.registerError(ux, Zp);
var dx = [
	-3,
	G,
	A_,
	{ [B]: z },
	[],
	[]
];
K.registerError(dx, om);
var fx = [
	-3,
	G,
	R_,
	{
		[B]: z,
		[V]: 403
	},
	[],
	[]
];
K.registerError(fx, _m);
var px = [
	-3,
	G,
	Y_,
	{
		[B]: z,
		[V]: 403
	},
	[],
	[]
];
K.registerError(px, $p);
var mx = [
	-3,
	G,
	Vv,
	{
		[B]: z,
		[V]: 400
	},
	[],
	[]
];
K.registerError(mx, dm);
var hx = [
	-3,
	G,
	Kv,
	{
		[B]: z,
		[V]: 415
	},
	[],
	[]
];
K.registerError(hx, hm);
var gx = [qb, K], _x = [
	0,
	G,
	Eh,
	8,
	0
], vx = [
	0,
	G,
	Dv,
	8,
	0
], yx = [
	0,
	G,
	Mv,
	8,
	0
], bx = [
	0,
	G,
	Pv,
	8,
	0
], xx = [
	0,
	G,
	Fv,
	8,
	0
], Sx = [
	0,
	G,
	Tv,
	{ [wy]: 1 },
	42
], Cx = [
	3,
	G,
	Em,
	0,
	[
		O_,
		qm,
		Pm,
		Dm
	],
	[
		0,
		4,
		0,
		0
	]
], wx = [
	3,
	G,
	jm,
	0,
	[ng, Gv],
	[0, 0]
], Tx = [
	3,
	G,
	uh,
	0,
	[nv],
	[0]
], Ex = [
	3,
	G,
	sh,
	0,
	[
		ch,
		hg,
		Oh,
		Yv,
		Av,
		jv,
		Nv,
		Fv,
		Pv,
		Mm,
		lv
	],
	[
		[() => Ox, 16],
		[0, { [H]: rb }],
		[0, { [H]: Zy }],
		[0, { [H]: Wb }],
		[0, { [H]: Pb }],
		[0, { [H]: Rb }],
		[0, { [H]: Bb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }],
		[0, { [H]: Ob }]
	]
], Dx = [
	3,
	G,
	lh,
	0,
	[
		Em,
		kh,
		Qg,
		vm,
		Hm,
		Lm,
		Ym,
		Zm,
		Qm,
		Nh,
		vh,
		yh,
		bh,
		xh,
		gg,
		wg,
		Og,
		kg,
		jg,
		Fg,
		Vg,
		y_,
		x_,
		Bv,
		bm,
		Av,
		Ev,
		ey,
		jv,
		Mv,
		Nv,
		Fv,
		Pv,
		Mm,
		Th,
		Eh,
		Dh,
		_v,
		Wv,
		K_,
		q_,
		G_,
		H_,
		U_,
		W_,
		cg,
		ug
	],
	[
		[0, 1],
		[0, { [H]: Hy }],
		[0, 1],
		[0, { [H]: Oy }],
		[0, { [H]: Km }],
		[0, { [H]: Ny }],
		[0, { [H]: Jm }],
		[0, { [H]: Xm }],
		[0, { [H]: $m }],
		[0, { [H]: Mh }],
		[0, { [H]: Uy }],
		[4, { [H]: Wy }],
		[0, { [H]: Gy }],
		[4, { [H]: Ky }],
		[4, { [H]: gg }],
		[0, { [H]: ab }],
		[0, { [H]: ob }],
		[0, { [H]: sb }],
		[0, { [H]: lb }],
		[0, { [H]: Bg }],
		[0, { [H]: Hg }],
		[128, { [uy]: fb }],
		[0, { [H]: mb }],
		[0, { [H]: Ub }],
		[0, { [H]: _b }],
		[0, { [H]: Pb }],
		[0, { [H]: jb }],
		[0, { [H]: Kb }],
		[0, { [H]: Rb }],
		[() => yx, { [H]: zb }],
		[0, { [H]: Bb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }],
		[0, { [H]: Jy }],
		[() => _x, { [H]: Yy }],
		[0, { [H]: Xy }],
		[0, { [H]: kb }],
		[0, { [H]: Vb }],
		[0, { [H]: Sb }],
		[5, { [H]: Cb }],
		[0, { [H]: xb }],
		[0, { [H]: vb }],
		[1, { [H]: yb }],
		[1, { [H]: bb }],
		[0, { [H]: ib }],
		[0, { [H]: Nb }]
	],
	3
], Ox = [
	3,
	G,
	ch,
	0,
	[
		dg,
		l_,
		jh,
		Um,
		Wm,
		Gm,
		hh,
		gh,
		_h,
		rh,
		Fh,
		Ih,
		Lh
	],
	[
		0,
		4,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]
], kx = [
	3,
	G,
	zm,
	0,
	[
		s_,
		t_,
		Em,
		Rv
	],
	[
		0,
		() => tS,
		() => wx,
		[() => bS, 0]
	]
], Ax = [
	3,
	G,
	Bm,
	0,
	[t_, Dm],
	[[0, { [H]: t_ }], [0, { [H]: ky }]]
], jx = [
	3,
	G,
	Vm,
	0,
	[
		Em,
		vm,
		zm,
		wg,
		Og,
		kg,
		Ag,
		jg,
		V_,
		X_,
		Nm
	],
	[
		[0, 1],
		[0, { [H]: Oy }],
		[() => kx, {
			[ly]: 1,
			[W]: zm
		}],
		[0, { [H]: ab }],
		[0, { [H]: ob }],
		[0, { [H]: sb }],
		[0, { [H]: cb }],
		[0, { [H]: lb }],
		[2, { [H]: My }],
		[0, { [H]: wb }],
		[0, { [H]: jy }]
	],
	1
], Mx = [
	3,
	G,
	Sh,
	{ [W]: Ch },
	[
		Bh,
		Av,
		Fv,
		Pv,
		Mm
	],
	[
		[() => lS, { [W]: Bh }],
		[0, { [H]: Pb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }]
	],
	1
], Nx = [
	3,
	G,
	wh,
	0,
	[
		Em,
		kv,
		Av,
		Fv,
		Pv,
		Mm
	],
	[
		[0, 1],
		[0, { [H]: qy }],
		[0, { [H]: Pb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }]
	],
	1
], Px = [
	3,
	G,
	ig,
	0,
	[ev, cv],
	[[() => _S, {
		[Dy]: 1,
		[W]: tv
	}], 2],
	1
], Fx = [
	3,
	G,
	Hh,
	0,
	[Em, cg],
	[[0, 1], [0, { [H]: ib }]],
	1
], Ix = [
	3,
	G,
	Jh,
	0,
	[
		Qg,
		Yv,
		Uh,
		Gh
	],
	[
		0,
		0,
		2,
		0
	]
], Lx = [
	3,
	G,
	Wh,
	0,
	[
		L_,
		Qg,
		Yv,
		Pg,
		l_
	],
	[
		() => aS,
		0,
		0,
		2,
		4
	]
], Rx = [
	3,
	G,
	Yh,
	0,
	[
		Uh,
		Yv,
		lv
	],
	[
		[2, { [H]: nb }],
		[0, { [H]: Wb }],
		[0, { [H]: Ob }]
	]
], zx = [
	3,
	G,
	Zh,
	0,
	[
		Em,
		Qg,
		C_,
		Yv,
		_v,
		Am,
		cg,
		Fg,
		Ig,
		Lg
	],
	[
		[0, 1],
		[0, 1],
		[0, { [H]: pb }],
		[0, { [U]: Ty }],
		[0, { [H]: kb }],
		[2, { [H]: Ay }],
		[0, { [H]: ib }],
		[0, { [H]: Bg }],
		[6, { [H]: ub }],
		[1, { [H]: db }]
	],
	2
], Bx = [
	3,
	G,
	Xh,
	{ [W]: rg },
	[
		ag,
		lv,
		mg
	],
	[
		[() => mS, { [Dy]: 1 }],
		[0, { [H]: Ob }],
		[() => gS, {
			[Dy]: 1,
			[W]: sg
		}]
	]
], Vx = [
	3,
	G,
	Qh,
	0,
	[
		Em,
		ig,
		C_,
		_v,
		Am,
		cg,
		Lm
	],
	[
		[0, 1],
		[() => Px, {
			[ly]: 1,
			[W]: ig
		}],
		[0, { [H]: pb }],
		[0, { [H]: kb }],
		[2, { [H]: Ay }],
		[0, { [H]: ib }],
		[0, { [H]: Mb }]
	],
	2
], Hx = [
	3,
	G,
	sg,
	0,
	[
		Qg,
		Yv,
		Rh,
		D_
	],
	[
		0,
		0,
		0,
		0
	]
], Ux = [
	3,
	G,
	yg,
	{ [W]: Wv },
	[Hv],
	[[() => bS, 0]],
	1
], Wx = [
	3,
	G,
	bg,
	0,
	[Em, cg],
	[[0, 1], [0, { [H]: ib }]],
	1
], Gx = [
	3,
	G,
	Sg,
	{ [W]: Jv },
	[Sv, w_],
	[0, [0, { [W]: S_ }]]
], Kx = [
	3,
	G,
	Cg,
	0,
	[Em, cg],
	[[0, 1], [0, { [H]: ib }]],
	1
], qx = [
	3,
	G,
	Eg,
	0,
	[
		Fm,
		Uh,
		wm,
		hg,
		xv,
		l_,
		th,
		dg,
		Um,
		Wm,
		Gm,
		hh,
		gh,
		_h,
		rh,
		Fh,
		Ih,
		Lh,
		jh,
		E_,
		Yv,
		Hm,
		Ym,
		Zm,
		Qm,
		ph,
		Nh,
		gg,
		lg,
		ey,
		Av,
		y_,
		jv,
		Nv,
		Fv,
		Mm,
		Ev,
		lv,
		vv,
		rv,
		zv,
		K_,
		q_,
		G_,
		H_,
		U_,
		W_
	],
	[
		[() => Sx, 16],
		[2, { [H]: nb }],
		[0, { [H]: ty }],
		[0, { [H]: rb }],
		[0, { [H]: Db }],
		[4, { [H]: d_ }],
		[1, { [H]: eh }],
		[0, { [H]: dg }],
		[0, { [H]: Py }],
		[0, { [H]: Fy }],
		[0, { [H]: Iy }],
		[0, { [H]: zy }],
		[0, { [H]: By }],
		[0, { [H]: Vy }],
		[0, { [H]: Ly }],
		[0, { [H]: $y }],
		[0, { [H]: eb }],
		[0, { [H]: tb }],
		[0, { [H]: Qy }],
		[1, { [H]: hb }],
		[0, { [H]: Wb }],
		[0, { [H]: Km }],
		[0, { [H]: Jm }],
		[0, { [H]: Xm }],
		[0, { [H]: $m }],
		[0, { [H]: mh }],
		[0, { [H]: Mh }],
		[4, { [H]: gg }],
		[0, { [H]: lg }],
		[0, { [H]: Kb }],
		[0, { [H]: Pb }],
		[128, { [uy]: fb }],
		[0, { [H]: Rb }],
		[0, { [H]: Bb }],
		[() => xx, { [H]: Fb }],
		[2, { [H]: Ib }],
		[0, { [H]: jb }],
		[0, { [H]: Ob }],
		[0, { [H]: Ab }],
		[1, { [H]: gb }],
		[1, { [H]: Hb }],
		[0, { [H]: Sb }],
		[5, { [H]: Cb }],
		[0, { [H]: xb }],
		[0, { [H]: vb }],
		[1, { [H]: yb }],
		[1, { [H]: bb }]
	]
], Jx = [
	3,
	G,
	Dg,
	0,
	[
		Em,
		Qg,
		Fg,
		zg,
		Vg,
		Yg,
		bv,
		uv,
		dv,
		fv,
		pv,
		mv,
		hv,
		Yv,
		jv,
		Mv,
		Nv,
		_v,
		iv,
		cg,
		ah
	],
	[
		[0, 1],
		[0, 1],
		[0, { [H]: Bg }],
		[4, { [H]: Rg }],
		[0, { [H]: Hg }],
		[4, { [H]: Xg }],
		[0, { [H]: bv }],
		[0, { [U]: gy }],
		[0, { [U]: _y }],
		[0, { [U]: vy }],
		[0, { [U]: yy }],
		[0, { [U]: by }],
		[6, { [U]: xy }],
		[0, { [U]: Ty }],
		[0, { [H]: Rb }],
		[() => yx, { [H]: zb }],
		[0, { [H]: Bb }],
		[0, { [H]: kb }],
		[1, { [U]: hy }],
		[0, { [H]: ib }],
		[0, { [H]: Ry }]
	],
	2
], Yx = [
	3,
	G,
	i_,
	{ [W]: n_ },
	[
		Im,
		L_,
		Ph,
		nv
	],
	[
		[() => fS, 0],
		() => aS,
		0,
		0
	]
], Xx = [
	3,
	G,
	a_,
	0,
	[
		b_,
		Ph,
		nv,
		Pm
	],
	[
		[1, { [U]: fy }],
		[0, { [U]: ry }],
		[0, { [U]: my }],
		[0, { [U]: ny }]
	]
], Zx = [
	3,
	G,
	p_,
	{ [W]: o_ },
	[
		Jg,
		zh,
		O_,
		nv,
		og,
		T_,
		fh,
		pg,
		$g,
		Ph,
		k_,
		Cv,
		lv
	],
	[
		2,
		[() => vS, { [Dy]: 1 }],
		0,
		0,
		0,
		1,
		[() => pS, { [Dy]: 1 }],
		0,
		1,
		0,
		0,
		0,
		[0, { [H]: Ob }]
	]
], Qx = [
	3,
	G,
	h_,
	0,
	[
		Em,
		og,
		pg,
		T_,
		nv,
		Ph,
		_g,
		Cv,
		_v,
		cg,
		Z_
	],
	[
		[0, 1],
		[0, { [U]: iy }],
		[0, { [U]: ay }],
		[1, { [U]: py }],
		[0, { [U]: my }],
		[0, { [U]: ry }],
		[2, { [U]: oy }],
		[0, { [U]: Cy }],
		[0, { [H]: kb }],
		[0, { [H]: ib }],
		[64, { [H]: Tb }]
	],
	1
], $x = [
	3,
	G,
	m_,
	{ [W]: v_ },
	[
		Jg,
		e_,
		Xv,
		j_,
		I_,
		Zv,
		Kh,
		O_,
		nv,
		og,
		T_,
		fh,
		pg,
		lv
	],
	[
		2,
		0,
		0,
		0,
		0,
		[() => yS, {
			[Dy]: 1,
			[W]: Qv
		}],
		[() => hS, {
			[Dy]: 1,
			[W]: Uh
		}],
		0,
		0,
		0,
		1,
		[() => pS, { [Dy]: 1 }],
		0,
		[0, { [H]: Ob }]
	]
], eS = [
	3,
	G,
	g_,
	0,
	[
		Em,
		og,
		pg,
		e_,
		T_,
		nv,
		Xv,
		cg,
		_v,
		Z_
	],
	[
		[0, 1],
		[0, { [U]: iy }],
		[0, { [U]: ay }],
		[0, { [U]: dy }],
		[1, { [U]: py }],
		[0, { [U]: my }],
		[0, { [U]: Ey }],
		[0, { [H]: ib }],
		[0, { [H]: kb }],
		[64, { [H]: Tb }]
	],
	1
], tS = [
	3,
	G,
	c_,
	0,
	[Gv, O_],
	[0, 0]
], nS = [
	3,
	G,
	tv,
	0,
	[
		Qg,
		l_,
		dg,
		Lm,
		jh,
		Lv,
		Ev,
		L_,
		yv
	],
	[
		0,
		4,
		0,
		[64, { [Dy]: 1 }],
		0,
		1,
		0,
		() => aS,
		() => cS
	]
], rS = [
	3,
	G,
	z_,
	0,
	[
		Qg,
		Yv,
		dg,
		u_,
		Lv
	],
	[
		0,
		0,
		0,
		6,
		1
	],
	1
], iS = [
	3,
	G,
	Q_,
	0,
	[
		dg,
		Lm,
		jh,
		Lv,
		Ev,
		Qg,
		Yv,
		Pg,
		l_,
		L_,
		yv
	],
	[
		0,
		[64, { [Dy]: 1 }],
		0,
		1,
		0,
		0,
		0,
		2,
		4,
		() => aS,
		() => cS
	]
], aS = [
	3,
	G,
	L_,
	0,
	[qh, Ng],
	[0, 0]
], oS = [
	3,
	G,
	ov,
	0,
	[
		hg,
		dg,
		Um,
		Wm,
		Gm,
		hh,
		gh,
		_h,
		rh,
		Fh,
		Ih,
		Lh,
		jh,
		Av,
		Yv,
		jv,
		Nv,
		Fv,
		Pv,
		Mm,
		Lv,
		lv
	],
	[
		[0, { [H]: rb }],
		[0, { [H]: dg }],
		[0, { [H]: Py }],
		[0, { [H]: Fy }],
		[0, { [H]: Iy }],
		[0, { [H]: zy }],
		[0, { [H]: By }],
		[0, { [H]: Vy }],
		[0, { [H]: Ly }],
		[0, { [H]: $y }],
		[0, { [H]: eb }],
		[0, { [H]: tb }],
		[0, { [H]: Qy }],
		[0, { [H]: Pb }],
		[0, { [H]: Wb }],
		[0, { [H]: Rb }],
		[0, { [H]: Bb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }],
		[1, { [H]: Eb }],
		[0, { [H]: Ob }]
	]
], sS = [
	3,
	G,
	sv,
	0,
	[
		Em,
		Qg,
		vm,
		Fm,
		Hm,
		Ym,
		Zm,
		Qm,
		th,
		ih,
		Nh,
		Lm,
		Um,
		Wm,
		Gm,
		hh,
		gh,
		_h,
		rh,
		Fh,
		Ih,
		Lh,
		gg,
		Fg,
		Vg,
		wg,
		Og,
		kg,
		jg,
		$v,
		y_,
		Av,
		Ev,
		ey,
		jv,
		Mv,
		Nv,
		Fv,
		Pv,
		Mm,
		_v,
		Wv,
		K_,
		q_,
		G_,
		H_,
		U_,
		W_,
		cg
	],
	[
		[0, 1],
		[0, 1],
		[0, { [H]: Oy }],
		[() => Sx, 16],
		[0, { [H]: Km }],
		[0, { [H]: Jm }],
		[0, { [H]: Xm }],
		[0, { [H]: $m }],
		[1, { [H]: eh }],
		[0, { [H]: nh }],
		[0, { [H]: Mh }],
		[0, { [H]: Mb }],
		[0, { [H]: Py }],
		[0, { [H]: Fy }],
		[0, { [H]: Iy }],
		[0, { [H]: zy }],
		[0, { [H]: By }],
		[0, { [H]: Vy }],
		[0, { [H]: Ly }],
		[0, { [H]: $y }],
		[0, { [H]: eb }],
		[0, { [H]: tb }],
		[4, { [H]: gg }],
		[0, { [H]: Bg }],
		[0, { [H]: Hg }],
		[0, { [H]: ab }],
		[0, { [H]: ob }],
		[0, { [H]: sb }],
		[0, { [H]: lb }],
		[1, { [H]: Gb }],
		[128, { [uy]: fb }],
		[0, { [H]: Pb }],
		[0, { [H]: jb }],
		[0, { [H]: Kb }],
		[0, { [H]: Rb }],
		[() => yx, { [H]: zb }],
		[0, { [H]: Bb }],
		[() => xx, { [H]: Fb }],
		[() => bx, { [H]: Lb }],
		[2, { [H]: Ib }],
		[0, { [H]: kb }],
		[0, { [H]: Vb }],
		[0, { [H]: Sb }],
		[5, { [H]: Cb }],
		[0, { [H]: xb }],
		[0, { [H]: vb }],
		[1, { [H]: yb }],
		[1, { [H]: bb }],
		[0, { [H]: ib }]
	],
	2
], cS = [
	3,
	G,
	yv,
	0,
	[qg, gv],
	[2, 4]
], lS = [
	3,
	G,
	Ov,
	0,
	[
		xm,
		wv,
		Iv,
		hg
	],
	[
		[0, { [W]: xm }],
		[() => vx, { [W]: wv }],
		[() => vx, { [W]: Iv }],
		[4, { [W]: hg }]
	],
	4
], uS = [
	3,
	G,
	Uv,
	0,
	[Qg, qv],
	[0, 0],
	2
], dS = "unit", fS = [
	1,
	G,
	Im,
	0,
	[() => Cx, { [W]: Em }]
], pS = [
	1,
	G,
	dh,
	0,
	() => Tx
], mS = [
	1,
	G,
	$h,
	0,
	() => Ix
], hS = [
	1,
	G,
	Kh,
	0,
	() => Lx
], gS = [
	1,
	G,
	mg,
	0,
	() => Hx
], _S = [
	1,
	G,
	B_,
	0,
	() => rS
], vS = [
	1,
	G,
	J_,
	0,
	[() => nS, 0]
], yS = [
	1,
	G,
	$_,
	0,
	[() => iS, 0]
], bS = [
	1,
	G,
	Hv,
	0,
	[() => uS, { [W]: Uv }]
], xS = [
	9,
	G,
	oh,
	{ [sy]: [
		"PUT",
		"/{Key+}?x-id=CopyObject",
		200
	] },
	() => Dx,
	() => Ex
], SS = [
	9,
	G,
	Rm,
	{ [sy]: [
		"PUT",
		"/",
		200
	] },
	() => jx,
	() => Ax
], CS = [
	9,
	G,
	Ah,
	{ [sy]: [
		"GET",
		"/?session",
		200
	] },
	() => Nx,
	() => Mx
], wS = [
	9,
	G,
	Vh,
	{ [sy]: [
		"DELETE",
		"/",
		204
	] },
	() => Fx,
	() => dS
], TS = [
	9,
	G,
	eg,
	{ [sy]: [
		"DELETE",
		"/{Key+}?x-id=DeleteObject",
		204
	] },
	() => zx,
	() => Rx
], ES = [
	9,
	G,
	tg,
	{
		[cy]: "-",
		[sy]: [
			"POST",
			"/?delete",
			200
		]
	},
	() => Vx,
	() => Bx
], DS = [
	9,
	G,
	vg,
	{ [sy]: [
		"GET",
		"/?tagging",
		200
	] },
	() => Wx,
	() => Ux
], OS = [
	9,
	G,
	xg,
	{ [sy]: [
		"GET",
		"/?versioning",
		200
	] },
	() => Kx,
	() => Gx
], kS = [
	9,
	G,
	Tg,
	{
		[cy]: "-",
		[sy]: [
			"GET",
			"/{Key+}?x-id=GetObject",
			200
		]
	},
	() => Jx,
	() => qx
], AS = [
	9,
	G,
	r_,
	{ [sy]: [
		"GET",
		"/?x-id=ListBuckets",
		200
	] },
	() => Xx,
	() => Yx
], jS = [
	9,
	G,
	f_,
	{ [sy]: [
		"GET",
		"/?list-type=2",
		200
	] },
	() => Qx,
	() => Zx
], MS = [
	9,
	G,
	__,
	{ [sy]: [
		"GET",
		"/?versions",
		200
	] },
	() => eS,
	() => $x
], NS = [
	9,
	G,
	av,
	{
		[cy]: "-",
		[sy]: [
			"PUT",
			"/{Key+}?x-id=PutObject",
			200
		]
	},
	() => sS,
	() => oS
], PS = class extends Fp(Bp, Wp, "CreateSession", CS) {}, FS = {
	name: "@aws-sdk/client-s3",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-s3"
	},
	files: ["dist-*/**"],
	sideEffects: !1,
	main: "./dist-cjs/index.js",
	module: "./dist-es/index.js",
	browser: { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser" },
	types: "./dist-types/index.d.ts",
	typesVersions: { "<4.5": { "dist-types/*": ["dist-types/ts3.4/*"] } },
	"react-native": { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native" },
	scripts: {
		build: "concurrently 'yarn:build:types' 'yarn:build:es' && yarn build:cjs",
		"build:cjs": "node ../../scripts/compilation/inline",
		"build:es": "premove dist-es && tsc -p tsconfig.es.json",
		"build:include:deps": "yarn g:turbo run build -F=\"$npm_package_name\"",
		"build:types": "premove dist-types && tsc -p tsconfig.types.json",
		"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
		clean: "premove dist-cjs dist-es dist-types",
		"extract:docs": "api-extractor run --local",
		"generate:client": "node ../../scripts/generate-clients/single-service",
		test: "yarn g:vitest run --passWithNoTests",
		"test:watch": "yarn g:vitest watch --passWithNoTests",
		"test:integration": "yarn g:vitest run --passWithNoTests -c vitest.config.integ.mts",
		"test:integration:watch": "yarn g:vitest watch --passWithNoTests -c vitest.config.integ.mts",
		"test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts",
		"test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts",
		"test:browser": "yarn g:vitest run -c vitest.config.browser.mts",
		"test:browser:watch": "yarn g:vitest watch -c vitest.config.browser.mts",
		"test:index": "tsc -p tsconfig.test.json && node ./test/index-objects.spec.mjs"
	},
	dependencies: {
		"@aws-sdk/checksums": "^3.1001.5",
		"@aws-sdk/core": "^3.978.5",
		"@aws-sdk/credential-provider-node": "^3.972.88",
		"@aws-sdk/middleware-sdk-s3": "^3.972.81",
		"@aws-sdk/signature-v4-multi-region": "^3.996.49",
		"@aws-sdk/types": "^3.975.0",
		"@smithy/core": "^3.36.1",
		"@smithy/fetch-http-handler": "^5.8.0",
		"@smithy/node-http-handler": "^4.12.1",
		"@smithy/types": "^4.19.0",
		tslib: "^2.6.2"
	},
	devDependencies: {
		"@aws-sdk/signature-v4-crt": "3.1156.0",
		"@smithy/snapshot-testing": "^2.3.2",
		"@tsconfig/node20": "20.1.8",
		"@types/node": "^20.14.8",
		concurrently: "7.0.0",
		"downlevel-dts": "0.10.1",
		premove: "4.0.0",
		typescript: "~7.0.2",
		vitest: "^4.0.17"
	},
	engines: { node: ">=20.0.0" }
};
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/create-request.js
function IS(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function LS(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
pe();
var RS = { supported: void 0 }, zS = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), RS.supported === void 0 && (RS.supported = typeof Request < "u" && "keepalive" in IS("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = BS(t);
			return Promise.reject(e);
		}
		let s = e.path, c = _s(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), RS.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(IS(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new fe({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new fe({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), LS(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(BS(t));
			};
			if (typeof t.addEventListener == "function") {
				let e = t;
				e.addEventListener("abort", r, { once: !0 }), h = () => e.removeEventListener("abort", r);
			} else t.onabort = r;
		})), Promise.race(g).finally(h);
	}
	updateHttpClientConfig(e, t) {
		this.config = void 0, this.configProvider = this.configProvider.then((n) => (n[e] = t, n));
	}
	httpHandlerConfigs() {
		return this.config ?? {};
	}
};
function BS(e) {
	let t = e && typeof e == "object" && "reason" in e ? e.reason : void 0;
	if (t) {
		if (t instanceof Error) {
			let e = /* @__PURE__ */ Error("Request aborted");
			return e.name = "AbortError", e.cause = t, e;
		}
		let e = Error(String(t));
		return e.name = "AbortError", e;
	}
	let n = /* @__PURE__ */ Error("Request aborted");
	return n.name = "AbortError", n;
}
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/sha/sha1/Sha1Js.js
w();
var q = 64, VS = 20, HS = new Int32Array([
	1732584193,
	4023233417,
	2562383102,
	271733878,
	3285377520
]), US = new Int32Array([
	1518500249,
	1859775393,
	2400959708,
	3395469782
]), WS = class e {
	digestLength = VS;
	state = Int32Array.from(HS);
	w;
	buffer = new Uint8Array(q);
	bufferLength = 0;
	bytesHashed = 0;
	finished = !1;
	inner;
	outer;
	constructor(t) {
		if (t) {
			let n = e.normalizeKey(t);
			this.inner = new e(), this.outer = new e();
			let r = /* @__PURE__ */ new Uint8Array(128);
			for (let e = 0; e < q; ++e) r[e] = 54 ^ n[e], r[e + q] = 92 ^ n[e];
			this.inner.update(r.subarray(0, q)), this.outer.update(r.subarray(q));
		}
	}
	update(e) {
		if (this.finished) throw Error("Attempted to update an already finished HMAC.");
		if (this.inner) {
			this.inner.update(e);
			return;
		}
		let t = 0, { length: n } = e;
		if (this.bytesHashed += n, this.bufferLength > 0) {
			for (; n > 0 && this.bufferLength < q;) this.buffer[this.bufferLength++] = e[t++], --n;
			this.bufferLength === q && (this.hashBuffer(this.buffer, 0), this.bufferLength = 0);
		}
		for (; n >= q;) this.hashBuffer(e, t), t += q, n -= q;
		for (; n > 0;) this.buffer[this.bufferLength++] = e[t++], --n;
	}
	async digest() {
		if (this.inner && this.outer) {
			if (this.finished) throw Error("Attempted to digest an already finished HMAC.");
			this.finished = !0;
			let e = this.inner.digestSync();
			return this.outer.update(e), this.outer.digestSync();
		}
		return this.digestSync();
	}
	reset() {
		this.state = Int32Array.from(HS), this.buffer = new Uint8Array(q), this.bufferLength = 0, this.bytesHashed = 0;
	}
	digestSync() {
		let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed / 536870912 | 0, i = this.bytesHashed << 3;
		if (t[n++] = 128, n > 56) {
			for (let e = n; e < q; ++e) t[e] = 0;
			this.hashBufferWith(e, t, 0), n = 0;
		}
		for (let e = n; e < 56; ++e) t[e] = 0;
		let a = new DataView(t.buffer, t.byteOffset, q);
		a.setUint32(56, r, !1), a.setUint32(60, i, !1), this.hashBufferWith(e, t, 0);
		let o = new Uint8Array(VS);
		return o[0] = e[0] >>> 24 & 255, o[1] = e[0] >>> 16 & 255, o[2] = e[0] >>> 8 & 255, o[3] = e[0] & 255, o[4] = e[1] >>> 24 & 255, o[5] = e[1] >>> 16 & 255, o[6] = e[1] >>> 8 & 255, o[7] = e[1] & 255, o[8] = e[2] >>> 24 & 255, o[9] = e[2] >>> 16 & 255, o[10] = e[2] >>> 8 & 255, o[11] = e[2] & 255, o[12] = e[3] >>> 24 & 255, o[13] = e[3] >>> 16 & 255, o[14] = e[3] >>> 8 & 255, o[15] = e[3] & 255, o[16] = e[4] >>> 24 & 255, o[17] = e[4] >>> 16 & 255, o[18] = e[4] >>> 8 & 255, o[19] = e[4] & 255, o;
	}
	static normalizeKey(t) {
		let n = Xn(t);
		if (n.byteLength > q) {
			let t = new e();
			t.update(n);
			let r = t.digestSync(), i = new Uint8Array(q);
			return i.set(r), i;
		}
		let r = new Uint8Array(q);
		return r.set(n), r;
	}
	hashBuffer(e, t) {
		this.hashBufferWith(this.state, e, t);
	}
	hashBufferWith(e, t, n) {
		let r = this.w ??= /* @__PURE__ */ new Int32Array(80), i = e[0], a = e[1], o = e[2], s = e[3], c = e[4];
		for (let e = 0; e < 16; ++e) r[e] = (t[n + e * 4] & 255) << 24 | (t[n + e * 4 + 1] & 255) << 16 | (t[n + e * 4 + 2] & 255) << 8 | t[n + e * 4 + 3] & 255;
		for (let e = 16; e < 80; ++e) {
			let t = r[e - 3] ^ r[e - 8] ^ r[e - 14] ^ r[e - 16];
			r[e] = t << 1 | t >>> 31;
		}
		for (let e = 0; e < 80; ++e) {
			let t = e < 20 ? 0 : e < 40 ? 1 : e < 60 ? 2 : 3, n = ((i << 5 | i >>> 27) + (t === 0 ? a & o ^ ~a & s : t === 2 ? a & o ^ a & s ^ o & s : a ^ o ^ s) | 0) + (c + (US[t] + r[e] | 0) | 0) | 0;
			c = s, s = o, o = a << 30 | a >>> 2, a = i, i = n;
		}
		e[0] = e[0] + i | 0, e[1] = e[1] + a | 0, e[2] = e[2] + o | 0, e[3] = e[3] + s | 0, e[4] = e[4] + c | 0;
	}
};
eo(), we(), w();
var GS = (e) => ({
	apiVersion: "2006-03-01",
	base64Decoder: e?.base64Decoder ?? St,
	base64Encoder: e?.base64Encoder ?? Et,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Dp,
	extensions: e?.extensions ?? [],
	getAwsChunkedEncodingStream: e?.getAwsChunkedEncodingStream ?? oa,
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? jp,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new ef()
	}, {
		schemeId: "aws.auth#sigv4a",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4a"),
		signer: new tf()
	}],
	logger: e?.logger ?? new gt(),
	md5: e?.md5 ?? Aa,
	protocol: e?.protocol ?? Id,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.s3",
		errorTypeRegistries: gx,
		xmlNamespace: "http://s3.amazonaws.com/doc/2006-03-01/",
		version: "2006-03-01",
		serviceTarget: "AmazonS3"
	},
	sdkStreamMixin: e?.sdkStreamMixin ?? pa,
	serviceId: e?.serviceId ?? "S3",
	sha1: e?.sha1 ?? WS,
	sha256: e?.sha256 ?? Qa,
	signerConstructor: e?.signerConstructor ?? Ju,
	signingEscapePath: e?.signingEscapePath ?? !1,
	urlParser: e?.urlParser ?? Ce,
	useArnRegion: e?.useArnRegion ?? void 0,
	utf8Decoder: e?.utf8Decoder ?? wt,
	utf8Encoder: e?.utf8Encoder ?? At
});
eo(), ts(), w(), da();
var KS = (e) => {
	let t = el(e), n = () => t().then(st), r = GS(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? Jn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Bc({
			serviceId: r.serviceId,
			clientVersion: FS.version
		}),
		eventStreamSerdeProvider: e?.eventStreamSerdeProvider ?? Jo,
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? De("Region is missing"),
		requestHandler: zS.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || qs),
		streamCollector: e?.streamCollector ?? ua,
		streamHasher: e?.streamHasher ?? Da,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, qS = (e) => {
	let t = e.httpAuthSchemes, n = e.httpAuthSchemeProvider, r = e.credentials;
	return {
		setHttpAuthScheme(e) {
			let n = t.findIndex((t) => t.schemeId === e.schemeId);
			n === -1 ? t.push(e) : t.splice(n, 1, e);
		},
		httpAuthSchemes() {
			return t;
		},
		setHttpAuthSchemeProvider(e) {
			n = e;
		},
		httpAuthSchemeProvider() {
			return n;
		},
		setCredentials(e) {
			r = e;
		},
		credentials() {
			return r;
		}
	};
}, JS = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), YS = (e, t) => {
	let n = Object.assign(nl(e), pt(e), ls(e), qS(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, rl(n), mt(n), us(n), JS(n));
};
Hi(), ts(), S();
var XS = class extends Oe {
	config;
	constructor(...[e]) {
		let t = KS(e || {});
		super(t), this.initConfig = t;
		let n = $s(Qc(Zs(Rl(Cc(Np(t)))))), r = Bi(n), i = YS(Ql(Mp(Xo(r)), { session: [() => this, PS] }), e?.extensions || []);
		this.config = i, this.middlewareStack.use(Re(this.config)), this.middlewareStack.use(zc(this.config)), this.middlewareStack.use(Qs(this.config)), this.middlewareStack.use(ms(this.config)), this.middlewareStack.use(nc(this.config)), this.middlewareStack.use(ac(this.config)), this.middlewareStack.use(oc(this.config)), this.middlewareStack.use(dc(this.config, {
			httpAuthSchemeParametersProvider: Op,
			identityProviderConfigProvider: async (e) => new vc({
				"aws.auth#sigv4": e.credentials,
				"aws.auth#sigv4a": e.credentials
			})
		})), this.middlewareStack.use(gc(this.config)), this.middlewareStack.use(gd(this.config)), this.middlewareStack.use(zd(this.config)), this.middlewareStack.use(Jl(this.config)), this.middlewareStack.use($u(this.config)), this.middlewareStack.use(id(this.config));
	}
	destroy() {
		super.destroy();
	}
}, ZS = class extends Fp(Lp, Gp, "CopyObject", xS) {}, QS = class extends Fp(Rp, Kp, "CreateBucket", SS) {}, $S = class extends Fp(zp, qp, "DeleteBucket", wS) {}, eC = class extends Fp(Ip, Wp, "DeleteObject", TS) {}, tC = class extends Fp(Vp, Jp, "DeleteObjects", ES) {}, nC = class extends Fp(zp, Wp, "GetBucketTagging", DS) {}, rC = class extends Fp(zp, Wp, "GetBucketVersioning", OS) {}, iC = class extends Fp(Ip, Yp, "GetObject", kS) {}, aC = class extends Fp(Hp, Wp, "ListBuckets", AS) {}, oC = class extends Fp(Up, Wp, "ListObjectsV2", jS) {}, sC = class extends Fp(Up, Wp, "ListObjectVersions", MS) {}, cC = class extends Fp(Ip, Xp, "PutObject", NS) {}, lC = class extends Error {
	res;
	status;
	constructor(e = 500, t) {
		super(t?.message, { cause: t?.cause }), this.res = t?.res, this.status = e;
	}
	getResponse() {
		return this.res ? new Response(this.res.body, {
			status: this.status,
			headers: this.res.headers
		}) : new Response(this.message, { status: this.status });
	}
}, uC = Symbol(), dC = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), fC = 1e4, pC = (e) => "headers" in e, mC = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (pC(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? hC(e, {
		all: n,
		dot: r
	}) : {};
};
async function hC(e, t) {
	if (!pC(e) && e.bodyCache.formData) return gC(await e.bodyCache.formData, t);
	let n = pC(e) ? e.headers : e.raw.headers, r = dC(await e.arrayBuffer(), n.get("Content-Type") || "");
	pC(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? gC(i, t) : {};
}
function gC(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? _C(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (vC(n, e, t, r), delete n[e]);
	}), n;
}
var _C = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, vC = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && yC(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= fC && yC(), i[e] = Object.create(null)), i = i[e]);
	});
}, yC = () => {
	throw Error("Nesting limit exceeded");
}, bC = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, xC = (e) => {
	let { groups: t, path: n } = SC(e);
	return CC(bC(n), t);
}, SC = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, CC = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, wC = {}, TC = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return wC[r] || (wC[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
			r,
			n[1],
			RegExp(`^${n[2]}(?=/${t})`)
		] : [
			e,
			n[1],
			RegExp(`^${n[2]}$`)
		] : [
			e,
			n[1],
			!0
		]), wC[r];
	}
	return null;
}, EC = (e, t) => {
	try {
		return t(e);
	} catch {
		return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (e) => {
			try {
				return t(e);
			} catch {
				return e;
			}
		});
	}
}, DC = (e) => EC(e, decodeURI), OC = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return DC(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, kC = (e) => {
	let t = OC(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, AC = (e, t, ...n) => (n.length && (t = AC(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), jC = (e) => {
	if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":")) return null;
	let t = e.split("/"), n = [], r = "";
	return t.forEach((e) => {
		if (e !== "" && !/\:/.test(e)) r += "/" + e;
		else if (/\:/.test(e)) {
			if (e.charCodeAt(e.length - 1) === 63) {
				n.length === 0 && r === "" ? n.push("/") : n.push(r);
				let t = e.slice(0, -1);
				r += "/" + t, n.push(r);
			} else r += "/" + e;
		}
	}), n.filter((e, t, n) => n.indexOf(e) === t);
}, MC = (e) => e.indexOf("%") === -1 ? e : EC(e, LC), NC = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), MC(e)), PC = (e, t, n) => {
	let r = e.indexOf("#", 8);
	r !== -1 && (e = e.slice(0, r));
	let i;
	if (!n && t && t.indexOf("%") === -1 && t.indexOf("+") === -1) {
		let n = e.indexOf("?", 8), r = n;
		if (r === -1) return;
		for (e.startsWith(t, r + 1) || (r = e.indexOf(`&${t}`, r + 1)); r !== -1;) {
			let i = e.charCodeAt(r + t.length + 1);
			if (i === 61 || i === 38 || isNaN(i)) {
				if (r > n && /(?:^|&)[^=&]*[%+]/.test(e.slice(n + 1, r))) break;
				if (i === 61) {
					let n = r + t.length + 2, i = e.indexOf("&", n);
					return NC(e.slice(n, i === -1 ? void 0 : i));
				}
				return "";
			}
			r = e.indexOf(`&${t}`, r + 1);
		}
		if (i = /[%+]/.test(e), !i) return;
	}
	let a = Object.create(null);
	i ??= /[%+]/.test(e);
	let o = e.indexOf("?", 8);
	for (; o !== -1;) {
		let t = e.indexOf("&", o + 1), r = e.indexOf("=", o);
		r > t && t !== -1 && (r = -1);
		let s = e.slice(o + 1, r === -1 ? t === -1 ? void 0 : t : r);
		if (i && (s = NC(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = NC(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, FC = PC, IC = (e, t) => PC(e, t, !0), LC = decodeURIComponent, RC = class {
	raw;
	#e;
	#t;
	routeIndex = 0;
	path;
	bodyCache = {};
	constructor(e, t = "/", n = [[]]) {
		this.raw = e, this.path = t, this.#t = n;
	}
	param(e) {
		return e ? this.#n(e) : this.#r();
	}
	#n(e) {
		let t = this.#t[0][this.routeIndex]?.[1][e], n = this.#i(t);
		return n && MC(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = MC(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return FC(this.url, e);
	}
	queries(e) {
		return IC(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return mC(this, e);
	}
	#a = (e) => {
		let { bodyCache: t, raw: n } = this, r = t[e];
		if (r) return r;
		for (let r in t) return t[r].then((t) => {
			r === "json" && (t = JSON.stringify(t));
			let i = r === "formData" ? void 0 : n.headers.get("content-type");
			return new Response(t, { headers: i ? { "Content-Type": i } : void 0 })[e]();
		});
		return t[e] = n[e]();
	};
	json() {
		return this.#a("text").then((e) => JSON.parse(e));
	}
	text() {
		return this.#a("text");
	}
	arrayBuffer() {
		return this.#a("arrayBuffer");
	}
	bytes() {
		return this.#a("arrayBuffer").then((e) => new Uint8Array(e));
	}
	blob() {
		return this.#a("blob");
	}
	formData() {
		return this.#a("formData");
	}
	addValidatedData(e, t) {
		(this.#e ??= {})[e] = t;
	}
	valid(e) {
		return this.#e?.[e];
	}
	get url() {
		return this.raw.url;
	}
	get method() {
		return this.raw.method;
	}
	get [uC]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, zC = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, BC = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, VC = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => VC(e, t, !1, r, i))).then(() => i[0]));
	return n ? BC(await o, a) : o;
}, HC = "text/plain; charset=UTF-8", UC = (e, t) => ({
	"Content-Type": e,
	...t
}), WC = (e, t) => new Response(e, t), GC = class {
	#e;
	#t;
	env = {};
	#n;
	finalized = !1;
	error;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	constructor(e, t) {
		this.#e = e, t && (this.#i = t.executionCtx, this.env = t.env, this.#c = t.notFoundHandler, this.#d = t.path, this.#u = t.matchResult);
	}
	get req() {
		return this.#t ??= new RC(this.#e, this.#d, this.#u), this.#t;
	}
	get event() {
		if (this.#i && "respondWith" in this.#i) return this.#i;
		throw Error("This context has no FetchEvent");
	}
	get executionCtx() {
		if (this.#i) return this.#i;
		throw Error("This context has no ExecutionContext");
	}
	get res() {
		return this.#a ||= WC(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = WC(e.body, e);
			for (let [t, n] of this.#a.headers.entries()) if (t !== "content-type") {
				if (t === "set-cookie") {
					let t = this.#a.headers.getSetCookie();
					e.headers.delete("set-cookie");
					for (let n of t) e.headers.append("set-cookie", n);
				} else e.headers.set(t, n);
			}
		}
		this.#a = e, this.finalized = !0;
	}
	render = (...e) => (this.#s ??= (e) => this.html(e), this.#s(...e));
	setLayout = (e) => this.#o = e;
	getLayout = () => this.#o;
	setRenderer = (e) => {
		this.#s = e;
	};
	header = (e, t, n) => {
		this.finalized && (this.#a = WC(this.#a.body, this.#a));
		let r = this.#a ? this.#a.headers : this.#l ??= new Headers();
		t === void 0 ? r.delete(e) : n?.append ? r.append(e, t) : r.set(e, t);
	};
	status = (e) => {
		this.#r = e;
	};
	set = (e, t) => {
		this.#n ??= /* @__PURE__ */ new Map(), this.#n.set(e, t);
	};
	get = (e) => this.#n ? this.#n.get(e) : void 0;
	get var() {
		return this.#n ? Object.fromEntries(this.#n) : {};
	}
	#f(e, t, n) {
		let r = this.#a ? new Headers(this.#a.headers) : this.#l;
		if (typeof t == "object" && t.headers) {
			r ??= new Headers();
			for (let [e, n] of new Headers(t.headers)) e === "set-cookie" ? r.append(e, n) : r.set(e, n);
		}
		if (n) {
			if (!r) {
				let e = 0;
				for (let t in n) if (++e > 1 || typeof n[t] != "string") {
					r = new Headers();
					break;
				}
			}
			if (r) for (let e in n) {
				let t = n[e];
				if (typeof t == "string") r.set(e, t);
				else {
					r.delete(e);
					for (let n of t) r.append(e, n);
				}
			}
		}
		return WC(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, UC(HC, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, UC("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, UC("text/html; charset=UTF-8", n));
		return typeof e == "object" ? VC(e, zC.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => WC(), this.#c(this));
}, KC = (e, t, n) => (r, i) => {
	let a = -1;
	return o(0);
	async function o(s) {
		if (s <= a) throw Error("next() called multiple times");
		a = s;
		let c, l = !1, u;
		if (e[s] ? (u = e[s][0][0], r.req.routeIndex = s) : u = s === e.length && i || void 0, u) try {
			c = await u(r, () => o(s + 1));
		} catch (e) {
			if (e instanceof Error && t) r.error = e, c = await t(e, r), l = !0;
			else throw e;
		}
		else r.finalized === !1 && n && (c = await n(r));
		return c && (r.finalized === !1 || l) && (r.res = c), r;
	}
}, qC = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], JC = "Can not add a route since the matcher is already built.", YC = class extends Error {}, XC = "__COMPOSED_HANDLER", ZC = (e) => e.text("404 Not Found", 404), QC = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, $C = class e {
	get;
	post;
	put;
	delete;
	options;
	patch;
	query;
	all;
	on;
	use;
	router;
	getPath;
	_basePath = "/";
	#e = "/";
	routes = [];
	constructor(e = {}) {
		[...qC, "all"].forEach((e) => {
			this[e] = (t, ...n) => {
				let r = e.toUpperCase();
				return typeof t == "string" ? this.#e = t : this.#r(r, this.#e, t), n.forEach((e) => {
					this.#r(r, this.#e, e);
				}), this;
			};
		}), this.on = (e, t, ...n) => {
			for (let r of [t].flat()) {
				this.#e = r;
				for (let t of [e].flat()) {
					let e = t.toUpperCase();
					for (let t of n) this.#r(e, this.#e, t);
				}
			}
			return this;
		}, this.use = (e, ...t) => (typeof e == "string" ? this.#e = e : (this.#e = "*", t.unshift(e)), t.forEach((e) => {
			this.#r("ALL", this.#e, e);
		}), this);
		let { strict: t, ...n } = e;
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? OC : kC;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = ZC;
	errorHandler = QC;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === QC ? r = e.handler : (r = async (n, r) => (await KC([], t.errorHandler)(n, () => e.handler(n, r))).res, r[XC] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = AC(this._basePath, e), t;
	}
	onError = (e) => (this.errorHandler = e, this);
	notFound = (e) => (this.#n = e, this);
	mount(e, t, n) {
		let r, i;
		n && (typeof n == "function" ? i = n : (i = n.optionHandler, r = n.replaceRequest === !1 ? (e) => e : n.replaceRequest));
		let a = i ? (e) => {
			let t = i(e);
			return Array.isArray(t) ? t : [t];
		} : (e) => {
			let t;
			try {
				t = e.executionCtx;
			} catch {}
			return [e.env, t];
		};
		return r ||= (() => {
			let t = AC(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", AC(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = AC(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : AC(this._basePath, r),
			path: t,
			method: e,
			handler: n
		};
		this.router.add(e, t, [n, i]), this.routes.push(i);
	}
	#i(e, t) {
		if (e instanceof Error) return this.errorHandler(e, t);
		throw e;
	}
	#a(e, t, n, r) {
		if (r === "HEAD") return (async () => new Response(null, await this.#a(e, t, n, "GET")))();
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new GC(e, {
			path: i,
			matchResult: a,
			env: n,
			executionCtx: t,
			notFoundHandler: this.#n
		});
		if (a[0].length === 1) {
			let e;
			try {
				e = a[0][0][0][0](o, async () => {
					o.res = await this.#n(o);
				});
			} catch (e) {
				return this.#i(e, o);
			}
			return e instanceof Promise ? e.then((e) => e || (o.finalized ? o.res : this.#n(o))).catch((e) => this.#i(e, o)) : e ?? this.#n(o);
		}
		let s = KC(a[0], this.errorHandler, this.#n);
		return (async () => {
			try {
				let e = await s(o);
				if (!e.finalized) throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
				return e.res;
			} catch (e) {
				return this.#i(e, o);
			}
		})();
	}
	fetch = (e, ...t) => this.#a(e, t[1], t[0], e.method);
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${AC("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, ew = () => Object.create(null), tw = [];
function nw(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], tw];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var rw = "[^/]+", iw = "(?:|/.*)", aw = Symbol(), ow = /* @__PURE__ */ new Set(".\\+*[^]$()");
function sw(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var cw = class e {
	#e;
	#t;
	#n = ew();
	insert(t, n, r, i, a) {
		let o = this;
		for (let n = 0, a = t.length; n < a; n++) {
			let s = t[n], c = s.length === 1 ? s === "*" ? n === a - 1 ? [
				"",
				"",
				".*"
			] : [
				"",
				"",
				rw
			] : null : s === "/*" ? [
				"",
				"",
				iw
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && ow.has(n))) throw aw;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw aw;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw aw;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw aw;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(sw).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : ow.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, lw = class {
	#e = { varIndex: 0 };
	#t = new cw();
	#n = 0;
	paths = ew();
	insert(e, t) {
		if (t) {
			this.#t.insert(e.split(""), 0, [], this.#e, !0);
			return;
		}
		let n = [], r = [], i = e;
		for (let e = 0;;) {
			let t = !1;
			if (i = i.replace(/\{[^}]+\}/g, (n) => {
				let i = `@\\${e}`;
				return r[e] = [i, n], e++, t = !0, i;
			}), !t) break;
		}
		let a = i.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
		for (let e = r.length - 1; e >= 0; e--) {
			let [t] = r[e];
			for (let n = a.length - 1; n >= 0; n--) if (a[n].indexOf(t) !== -1) {
				a[n] = a[n].replace(t, r[e][1]);
				break;
			}
		}
		this.#t.insert(a, this.#n, n, this.#e, !1), this.paths[e] = [this.#n++, n];
	}
	buildRegExp() {
		let e = this.#t.buildRegExpStr();
		if (e === "") return [
			/^$/,
			[],
			[]
		];
		let t = 0, n = [], r = [];
		return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (e, i, a) => i === void 0 ? (a === void 0 || (r[Number(a)] = ++t), "") : (n[++t] = Number(i), "$()")), [
			RegExp(`^${e}`),
			n,
			r
		];
	}
}, uw = ew();
function dw(e) {
	return uw[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? iw : e === "*" ? ".*" : `/:${rw}`)}$`);
}
function fw(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (dw(n).test(t)) return [...e[n]];
}
var pw = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: ew() }, this.#t = { ALL: ew() }, this.#n = { ALL: new lw() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === aw ? new YC(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(JC);
		if (!r[e]) {
			this.#n[e] = new lw();
			for (let t of [r, i]) {
				t[e] = ew();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = dw(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = fw(r[e], t) || fw(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = jC(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = fw(r[t], e) || fw(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = nw;
	buildAllMatchers() {
		let e = ew();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, uw = ew(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = ew(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), ew())]) : i[t] = [n.map(([e]) => [e, ew()]), tw];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, mw = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(JC);
		this.#t.push([
			e,
			t,
			n
		]);
	}
	match(e, t) {
		if (!this.#t) throw Error("Fatal error");
		let n = this.#e, r = this.#t, i = n.length, a = 0, o;
		for (; a < i; a++) {
			let i = n[a];
			try {
				for (let e = 0, t = r.length; e < t; e++) i.add(...r[e]);
				o = i.match(e, t);
			} catch (e) {
				if (e instanceof YC) continue;
				throw e;
			}
			this.match = i.match.bind(i), this.#e = [i], this.#t = void 0;
			break;
		}
		if (a === i) throw Error("Fatal error");
		return this.name = `SmartRouter + ${this.activeRouter.name}`, o;
	}
	get activeRouter() {
		if (this.#t || this.#e.length !== 1) throw Error("No active router has been determined yet.");
		return this.#e[0];
	}
}, hw = ew(), gw = 0, _w = class e {
	#e = [];
	#t = ew();
	#n = [];
	#r;
	#i = hw;
	insert(t, n, r) {
		let i = this, a = xC(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = TC(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++gw
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = ew(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = hw;
		let r = [this], i = bC(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === hw ? {} : { ...p.#i };
					if (typeof f == "string") {
						(f === "*" || l.startsWith(f.slice(0, -1))) && (this.#a(n, r, e, p.#i), f === "*" && (r.#i = m, d.push(r)));
						continue;
					}
					let [, h, g] = f;
					if (l || g !== !0) {
						if (g !== !0) {
							if (!s) {
								s = [];
								let e = +(t[0] === "/");
								for (let t = 0; t < o; t++) s[t] = e, e += i[t].length + 1;
							}
							let l = t.slice(s[c]), u = g.exec(l);
							if (u) {
								Object.hasOwn(m, h) || (m[h] = u[0]), this.#a(n, r, e, p.#i, m), u[0].length === l.length && r.#t["*"] && this.#a(n, r.#t["*"], e, p.#i, m);
								for (let e in r.#t) {
									r.#i = m;
									let e = u[0].match(/\//g)?.length ?? 0;
									(a[e] ||= []).push(r);
									break;
								}
								continue;
							}
						}
						(g === !0 || g.test(l)) && (Object.hasOwn(m, h) || (m[h] = l), u ? (this.#a(n, r, e, m, p.#i), r.#t["*"] && this.#a(n, r.#t["*"], e, m, p.#i)) : (r.#i = m, d.push(r)));
					}
				}
			}
			let f = a.shift();
			r = f ? d.concat(f) : d;
		}
		return n[1] && n.sort((e, t) => e.score - t.score), [n.map(({ handler: e, params: t }) => [e, t])];
	}
}, vw = class {
	name = "TrieRouter";
	#e = new _w();
	add(e, t, n) {
		for (let r of jC(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, yw = class extends $C {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new mw({ routers: [new pw(), new vw()] });
	}
}, bw = [
	"start",
	"stop",
	"reboot"
], xw = class extends Error {
	constructor(e, t) {
		super(e, t?.cause === void 0 ? void 0 : { cause: t.cause }), this.name = new.target.name;
	}
	toBody() {
		let e = this.label, t = this.message;
		return {
			error: e,
			code: this.code,
			message: e,
			...t && t !== e ? { detail: t } : {}
		};
	}
}, J = class extends xw {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, Sw = class extends xw {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, Y = class extends xw {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, Cw = class extends xw {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, ww = class extends xw {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, X = class extends xw {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, Tw = class extends xw {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, Ew = class extends xw {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, Dw = class extends xw {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, Ow = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function kw(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && Ow.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function Aw(e, t) {
	let n = jw(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function jw(e, t) {
	if (e instanceof xw) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return kw(e) ? new Ew(r, { cause: e }) : new Dw(r, { cause: e });
}
var Mw = 1e3, Nw = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function Pw(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new J("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new J("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new J("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new J("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = Fw(r)), a;
}
function Fw(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new J("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!Nw.includes(t)) throw new J(`sortKey.operator must be one of ${Nw.join(", ")}.`);
	if (typeof n != "string" || !n) throw new J("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new J("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new J("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function Iw(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new J(`limit must be a whole number between 1 and ${Mw}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new J(`limit must be between 1 and ${Mw}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var Lw = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], Rw = {
	compute: {
		displayName: "Compute",
		description: "Virtual machines for running applications and workloads.",
		docsSlugByCloud: {
			aws: "ec2",
			azure: "vm",
			gcp: "compute"
		},
		iconKey: "compute",
		group: "Compute",
		order: 10
	},
	k8s: {
		displayName: "k8s Engine",
		displayNameByCloud: {
			aws: "EKS",
			azure: "AKS",
			gcp: "GKE",
			oci: "OKE"
		},
		description: "Managed Kubernetes clusters for containerized workloads.",
		docsSlugByCloud: {
			aws: "eks",
			azure: "aks",
			gcp: "gke",
			oci: "containerengine"
		},
		iconKey: "k8s",
		group: "Compute",
		order: 20
	},
	serverless: {
		displayName: "Serverless",
		displayNameByCloud: { oci: "Functions" },
		description: "Run functions without managing servers.",
		docsSlugByCloud: {
			aws: "lambda",
			azure: "functions",
			gcp: "cloud-functions",
			oci: "functions"
		},
		iconKey: "serverless",
		group: "Compute",
		order: 30
	},
	containers: {
		displayName: "Containers",
		displayNameByCloud: {
			aws: "ECS",
			azure: "Container Apps",
			gcp: "Cloud Run"
		},
		description: "Deploy and run containerized applications.",
		docsSlugByCloud: {
			aws: "ecs",
			azure: "container-apps",
			gcp: "cloud-run"
		},
		iconKey: "containers",
		group: "Compute",
		order: 40
	},
	registry: {
		displayName: "Container Registry",
		displayNameByCloud: {
			aws: "ECR",
			azure: "Container Registry"
		},
		description: "Store and manage container images.",
		docsSlugByCloud: {
			aws: "ecr",
			azure: "acr"
		},
		iconKey: "registry",
		group: "Compute",
		order: 45
	},
	sagemaker: {
		displayName: "SageMaker AI",
		description: "Build and host machine learning models.",
		docsSlugByCloud: { aws: "sagemaker" },
		iconKey: "sagemaker",
		group: "Compute",
		order: 50
	},
	storage: {
		displayName: "Storage",
		description: "Store and manage files and objects.",
		docsSlugByCloud: {
			aws: "s3",
			azure: "blob",
			gcp: "gcs",
			oci: "object-storage"
		},
		iconKey: "storage",
		group: "Storage",
		order: 10
	},
	table: {
		displayName: "Table Storage",
		description: "Manage Azure Storage tables.",
		docsSlugByCloud: { azure: "table" },
		iconKey: "database",
		group: "Storage",
		order: 20
	},
	database: {
		displayName: "Database",
		description: "Create and manage relational databases.",
		docsSlugByCloud: {
			aws: "rds",
			azure: "sql",
			gcp: "cloud-sql-postgres",
			oci: "psql"
		},
		iconKey: "database",
		group: "Databases",
		order: 10
	},
	dsql: {
		displayName: "Aurora DSQL",
		description: "Serverless distributed SQL clusters that sign in with IAM.",
		docsSlugByCloud: { aws: "dsql" },
		iconKey: "database",
		group: "Databases",
		order: 15
	},
	cache: {
		displayName: "Cache",
		displayNameByCloud: {
			aws: "ElastiCache",
			azure: "Azure Cache for Redis"
		},
		description: "Run in-memory caches and replication groups.",
		docsSlugByCloud: {
			aws: "elasticache",
			azure: "redis"
		},
		iconKey: "database",
		group: "Databases",
		order: 18
	},
	nosql: {
		displayName: "NoSQL",
		displayNameByCloud: {
			aws: "DynamoDB",
			azure: "Cosmos DB NoSQL",
			gcp: "Firestore"
		},
		description: "Store and query non-relational data.",
		docsSlugByCloud: {
			aws: "dynamodb",
			azure: "cosmos",
			gcp: "firestore"
		},
		iconKey: "nosql",
		group: "Databases",
		order: 20
	},
	search: {
		displayName: "Search",
		displayNameByCloud: { aws: "OpenSearch" },
		description: "Run search and log analytics domains.",
		docsSlugByCloud: { aws: "opensearch" },
		iconKey: "database",
		group: "Databases",
		order: 25
	},
	analytics: {
		displayName: "Analytics",
		displayNameByCloud: {
			aws: "Athena",
			gcp: "BigQuery"
		},
		description: "Browse analytics datasets and the tables inside them.",
		docsSlugByCloud: {
			aws: "athena",
			gcp: "bigquery"
		},
		iconKey: "analytics",
		group: "Databases",
		order: 30
	},
	networking: {
		displayName: "Networking",
		description: "Connect and isolate cloud resources in virtual networks.",
		docsSlugByCloud: {
			aws: "ec2",
			azure: "network"
		},
		iconKey: "networking",
		group: "Networking",
		order: 10
	},
	workflows: {
		displayName: "Workflows",
		displayNameByCloud: { aws: "Step Functions" },
		description: "Coordinate application steps and long-running processes.",
		docsSlugByCloud: { aws: "step-functions" },
		iconKey: "workflows",
		group: "Integration",
		order: 30
	},
	loadbalancing: {
		displayName: "Load Balancing",
		displayNameByCloud: { aws: "ELB" },
		description: "Distribute incoming traffic across application targets.",
		docsSlugByCloud: { aws: "elb" },
		iconKey: "loadbalancing",
		group: "Networking",
		order: 20
	},
	cdn: {
		displayName: "CDN",
		displayNameByCloud: { aws: "CloudFront" },
		description: "Deliver content from edge locations with distributions.",
		docsSlugByCloud: { aws: "cloudfront" },
		iconKey: "networking",
		group: "Networking",
		order: 30
	},
	dns: {
		displayName: "DNS",
		displayNameByCloud: { aws: "Route 53" },
		description: "Manage DNS zones and the records they hold.",
		docsSlugByCloud: { aws: "route53" },
		iconKey: "networking",
		group: "Networking",
		order: 40
	},
	messaging: {
		displayName: "Messaging",
		displayNameByCloud: {
			aws: "SQS",
			gcp: "Pub/Sub",
			oci: "Queue"
		},
		description: "Exchange messages between applications.",
		descriptionByCloud: {
			aws: "Queue messages between applications.",
			gcp: "Publish and subscribe to messages across applications.",
			oci: "Queue messages between applications."
		},
		docsSlugByCloud: {
			aws: "sqs",
			azure: "service-bus",
			gcp: "pubsub",
			oci: "queue"
		},
		iconKey: "messaging",
		group: "Integration",
		order: 10
	},
	sns: {
		displayName: "SNS",
		description: "Manage standard and FIFO notification topics.",
		docsSlugByCloud: { aws: "sns" },
		iconKey: "messaging",
		group: "Integration",
		order: 11
	},
	queue: {
		displayName: "Queue Storage",
		description: "Create and inspect Azure Storage queues.",
		docsSlugByCloud: { azure: "queue" },
		iconKey: "queue",
		group: "Integration",
		order: 11
	},
	streams: {
		displayName: "Streams",
		displayNameByCloud: {
			aws: "Kinesis",
			azure: "Event Hubs",
			gcp: "Managed Kafka",
			oci: "Streaming"
		},
		description: "Collect and process streaming data in real time.",
		docsSlugByCloud: {
			aws: "kinesis",
			azure: "event-hub",
			gcp: "managed-kafka",
			oci: "streaming"
		},
		iconKey: "streams",
		group: "Integration",
		order: 12
	},
	events: {
		displayName: "Events",
		displayNameByCloud: {
			aws: "EventBridge",
			azure: "Event Grid",
			gcp: "Eventarc"
		},
		description: "Route events from producers to application targets.",
		descriptionByCloud: { azure: "Manage Event Grid custom topics and browse their event subscriptions." },
		docsSlugByCloud: {
			aws: "eventbridge",
			azure: "event-grid",
			gcp: "eventarc"
		},
		iconKey: "events",
		group: "Integration",
		order: 15
	},
	eventsv2: {
		displayName: "EventBridge V2",
		description: "Publish events to buses that deliver them to filtered subscribers.",
		docsSlugByCloud: { aws: "eventbridgev2" },
		iconKey: "events",
		group: "Integration",
		order: 16
	},
	identity: {
		displayName: "Identity",
		description: "Manage identities and access to cloud resources.",
		docsSlugByCloud: {
			aws: "iam",
			azure: "entra",
			gcp: "iam",
			oci: "identity"
		},
		iconKey: "iam",
		group: "Security",
		order: 5
	},
	cognito: {
		displayName: "Cognito",
		displayNameByCloud: {
			aws: "Cognito",
			gcp: "Identity Platform"
		},
		description: "Manage user pools and application sign-in.",
		descriptionByCloud: { gcp: "Browse the users who sign in to your applications." },
		docsSlugByCloud: { aws: "cognito" },
		iconKey: "iam",
		group: "Security",
		order: 6
	},
	apigateway: {
		displayName: "API Gateway",
		displayNameByCloud: { azure: "API Management" },
		description: "Create and manage APIs for application clients.",
		descriptionByCloud: { azure: "Browse API Management services, APIs, products and backends." },
		docsSlugByCloud: {
			aws: "api-gateway",
			azure: "apim"
		},
		iconKey: "apigateway",
		group: "Integration",
		order: 10
	},
	email: {
		displayName: "Email",
		displayNameByCloud: { aws: "SES Mailbox" },
		description: "Send and inspect application email.",
		docsSlugByCloud: {
			aws: "ses",
			azure: "email"
		},
		iconKey: "email",
		group: "Integration",
		order: 20
	},
	kms: {
		displayName: "Key Management",
		displayNameByCloud: {
			aws: "KMS",
			azure: "Key Vault Keys",
			gcp: "Cloud KMS",
			oci: "Vault"
		},
		description: "Create and manage encryption keys.",
		docsSlugByCloud: {
			aws: "kms",
			azure: "key-vault",
			gcp: "kms",
			oci: "kms-vault"
		},
		iconKey: "kms",
		group: "Security",
		order: 20
	},
	certificates: {
		displayName: "Certificates",
		displayNameByCloud: {
			aws: "ACM",
			azure: "Key Vault Certificates"
		},
		description: "Issue and manage certificates.",
		docsSlugByCloud: {
			aws: "acm",
			azure: "key-vault"
		},
		iconKey: "kms",
		group: "Security",
		order: 25
	},
	paymentcryptography: {
		displayName: "Payment Cryptography",
		description: "Create and manage the encryption keys a payment operator holds.",
		docsSlugByCloud: { aws: "payment-cryptography" },
		iconKey: "paymentcryptography",
		group: "Security",
		order: 27
	},
	parameters: {
		displayName: "Parameter Store",
		description: "Store configuration values for applications.",
		docsSlugByCloud: { aws: "ssm" },
		iconKey: "parameters",
		group: "Security",
		order: 30
	},
	secrets: {
		displayName: "Secrets Manager",
		displayNameByCloud: {
			azure: "Key Vault",
			gcp: "Secret Manager",
			oci: "Vault Secrets"
		},
		description: "Store and manage application secrets.",
		docsSlugByCloud: {
			aws: "secrets-manager",
			azure: "key-vault",
			gcp: "secret-manager",
			oci: "kms-vault"
		},
		iconKey: "secrets",
		group: "Security",
		order: 10,
		routeByCloud: { aws: "/secretsmanager" }
	},
	iac: {
		displayName: "Infrastructure as Code",
		displayNameByCloud: {
			aws: "CloudFormation",
			azure: "ARM Deployments"
		},
		description: "Provision resources from infrastructure templates.",
		docsSlugByCloud: {
			aws: "cloudformation",
			azure: "deployments"
		},
		iconKey: "iac",
		group: "Provisioning",
		order: 10
	},
	configuration: {
		displayName: "Configuration",
		displayNameByCloud: {
			aws: "AppConfig",
			azure: "App Configuration"
		},
		description: "Manage and deploy application configuration.",
		docsSlugByCloud: {
			aws: "appconfig",
			azure: "app-config"
		},
		iconKey: "configuration",
		group: "Provisioning",
		order: 20
	},
	organizations: {
		displayName: "Organizations",
		description: "Browse child tenancies, links and invitations of an organization.",
		docsSlugByCloud: { oci: "organizations" },
		iconKey: "iam",
		group: "Provisioning",
		order: 40
	},
	governance: {
		displayName: "Governance Rules",
		description: "Browse the governance rules a parent tenancy applies to its child tenancies.",
		docsSlugByCloud: { oci: "governance-rules" },
		iconKey: "iam",
		group: "Provisioning",
		order: 50
	},
	cicd: {
		displayName: "CI/CD",
		displayNameByCloud: { aws: "CodeBuild" },
		description: "Run builds for application projects.",
		docsSlugByCloud: { aws: "codebuild" },
		iconKey: "workflows",
		group: "Provisioning",
		order: 30
	},
	scheduler: {
		displayName: "Scheduler",
		displayNameByCloud: {
			aws: "EventBridge Scheduler",
			gcp: "Cloud Scheduler"
		},
		description: "Run jobs on a schedule.",
		docsSlugByCloud: {
			aws: "scheduler",
			gcp: "scheduler"
		},
		iconKey: "scheduler",
		group: "Integration",
		order: 20
	},
	logs: {
		displayName: "Logs",
		displayNameByCloud: {
			aws: "CloudWatch Logs",
			gcp: "Cloud Logging"
		},
		description: "Collect and inspect application logs.",
		docsSlugByCloud: {
			aws: "cloudwatch",
			azure: "monitor",
			gcp: "logging"
		},
		iconKey: "logs",
		group: "Observability",
		order: 10
	},
	cloudwatch: {
		displayName: "CloudWatch",
		displayNameByCloud: {
			aws: "CloudWatch",
			gcp: "Cloud Monitoring"
		},
		description: "Watch metrics and manage alarms.",
		descriptionByCloud: { gcp: "Browse metric descriptors and their recent points." },
		docsSlugByCloud: {
			aws: "cloudwatch",
			azure: "monitor",
			gcp: "cloud-monitoring"
		},
		iconKey: "monitoring",
		group: "Observability",
		order: 20
	},
	xray: {
		displayName: "X-Ray",
		description: "Follow distributed traces and the services they touched.",
		iconKey: "monitoring",
		group: "Observability",
		order: 30
	},
	workrequests: {
		displayName: "Work Requests",
		description: "Follow asynchronous operations, their progress and errors.",
		iconKey: "monitoring",
		group: "Observability",
		order: 30
	}
}, zw = Object.keys(Rw).map((e) => ({
	service: e,
	...Rw[e]
})).sort(Uw);
zw.map((e) => e.service);
function Z(e) {
	return Object.hasOwn(Rw, e);
}
function Bw(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function Vw(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function Hw(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function Uw(e, t) {
	let n = Lw.indexOf(e.group) - Lw.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var Ww = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function Gw(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${Ww[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var Kw = /* @__PURE__ */ new Set([
	"ThrottlingException",
	"Throttling",
	"ThrottledException",
	"TooManyRequestsException",
	"RequestLimitExceeded",
	"ProvisionedThroughputExceededException",
	"RequestThrottled",
	"RequestThrottledException",
	"SlowDown",
	"LimitExceededException"
]), qw = /* @__PURE__ */ new Set([
	"BucketAlreadyExists",
	"BucketAlreadyOwnedByYou",
	"EntityAlreadyExists",
	"EntityAlreadyExistsException",
	"ResourceExistsException",
	"ResourceInUseException",
	"ResourceConflictException",
	"ConditionalCheckFailedException",
	"QueueNameExists",
	"QueueDeletedRecently",
	"InvalidChangeBatch",
	"DBInstanceAlreadyExists",
	"DBInstanceAlreadyExistsFault",
	"ConcurrentModificationException",
	"IncorrectState",
	"DeleteConflictException",
	"ClusterContainsServicesException",
	"ClusterContainsTasksException",
	"ClusterContainsContainerInstancesException",
	"DistributionNotDisabled",
	"PreconditionFailed",
	"HostedZoneNotEmpty",
	"HostedZoneAlreadyExists",
	"PriorRequestNotComplete"
]), Jw = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), Yw = /* @__PURE__ */ new Set([
	"ValidationException",
	"ValidationError",
	"InvalidParameterValue",
	"InvalidParameterValueException",
	"InvalidParameterCombination",
	"InvalidRequestException",
	"InvalidInput",
	"InvalidInputException",
	"MissingParameter",
	"MissingRequiredParameter",
	"SerializationException",
	"MalformedPolicyDocument",
	"MalformedPolicyDocumentException",
	"InvalidArgsException",
	"InvalidBucketName",
	"InvalidArgumentException",
	"InvalidParameterException"
]), Xw = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), Zw = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), Qw = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function $w(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function eT(e) {
	if (!$w(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || Kw.has(n)) return new ww(r, i);
	if (qw.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new Cw(r, i);
	if (Jw.has(n)) return new Sw(r, i);
	if (Yw.has(n)) return new J(r, i);
	if (Xw.has(n) || /\.NotFound$/.test(n)) return new Y(r, i);
	if (Zw.has(n)) return new Tw(r, i);
	if (Qw.has(n) || kw(e)) return new Ew(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new J(r, i) : a === 401 || a === 403 ? new Sw(r, i) : a === 404 ? new Y(r, i) : a === 409 ? new Cw(r, i) : a === 429 ? new ww(r, i) : a === 501 ? new Tw(r, i) : a === 503 || a === 504 ? new Ew(r, i) : new Dw(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function tT() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function nT(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var rT = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, iT = !1;
function aT(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = oT(t);
	return !n && !iT && (iT = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function oT(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(rT, t) ? rT[t] : null;
}
var sT = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), cT = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), lT = 5464, uT = 8192, dT = 50, fT = 12e4;
function pT(e, t = tT) {
	let n = new yw();
	n.onError((e, t) => {
		if (e instanceof xw) {
			let { status: n, body: r } = Aw(e);
			return t.json(r, n);
		}
		return e instanceof lC ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : aT();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && Q(n) && n !== i) throw new Y("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new Y("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return jT(e, 150), $(e, () => nT(fT, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: NT(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!Q(n)) throw new Y("Unknown cloud");
		return n === "aws" ? $(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new J("queryString must be a string.");
			if (typeof t.startTime != "number") throw new J("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new J("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new J("limit must be a number.");
			let i = await r(e).queryLogs(n, e.req.param("id"), {
				queryString: t.queryString,
				startTime: t.startTime,
				endTime: t.endTime,
				limit: t.limit
			});
			return e.json(i);
		}) : t();
	}), n.post("/:cloud/services/logs/query", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new J("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > dT) throw new J(`logGroupNames must include at most ${dT} log groups.`);
			if (typeof n.queryString != "string") throw new J("queryString must be a string.");
			if (typeof n.startTime != "number") throw new J("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new J("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new J("limit must be a number.");
			let i = await r(e).queryLogs(t, n.logGroupNames, {
				queryString: n.queryString,
				startTime: n.startTime,
				endTime: n.endTime,
				limit: n.limit
			});
			return e.json(i);
		});
	}), n.delete("/:cloud/services/email/inbox", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), { values: n }), 201);
		});
	});
	let a = (e) => {
		let t = Number(e);
		return Number.isInteger(t) && t > 0 ? t : null;
	};
	n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!Q(t) || n === null) throw new Y("Unknown cloud or version");
		return $(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new Y("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!Q(t) || n === null) throw new Y("Unknown cloud or version");
		return $(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!Q(t) || !Number.isInteger(n) || n <= 0) throw new Y("Unknown cloud or deployment");
		return $(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new Y("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), kT(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), kT(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", AT(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), kT(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", AT(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = OT(e);
		if (!t) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), Pw(n), AT(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new Y("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new J("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return $(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new J("Object key is required");
		return $(e, async () => {
			let a = await r(e).getObject(t, n, e.req.param("id"), i);
			return new Response(a.body, { headers: {
				"content-type": a.contentType,
				...a.contentLength === null ? {} : { "content-length": String(a.contentLength) },
				"content-disposition": `attachment; filename="${i.split("/").pop() ?? i}"`
			} });
		});
	}), n.delete("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new J("Object key is required");
		return $(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new J("srcKey and destKey are required");
		return $(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await bT(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new J("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new J("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new J("maxMessages must be an integer between 1 and 10");
		return $(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = _T((await bT(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = vT(e.req.query());
		return $(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new J("receiptHandle is required");
		return $(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return MT(e, async () => {
			let n = await ST(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: DT(n.plaintextBase64, "plaintextBase64", lT),
				encryptionAlgorithm: CT(n.encryptionAlgorithm),
				encryptionContext: ET(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return MT(e, async () => {
			let n = await ST(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: DT(n.ciphertextBlobBase64, "ciphertextBlobBase64", uT),
				encryptionAlgorithm: CT(n.encryptionAlgorithm),
				encryptionContext: ET(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of bw) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!Q(n)) throw new Y("Unknown cloud");
		return $(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return MT(e, async () => {
			let n = await ST(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: DT(n.messageBase64, "messageBase64", lT),
				signingAlgorithm: wT(n.signingAlgorithm)
			});
			return e.json({
				signatureBase64: Buffer.from(i.signature).toString("base64"),
				keyId: i.keyId,
				keyVersionId: i.keyVersionId,
				signingAlgorithm: i.signingAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/verify", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return MT(e, async () => {
			let n = await ST(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: DT(n.messageBase64, "messageBase64", lT),
				signature: DT(n.signatureBase64, "signatureBase64", uT),
				keyVersionId: TT(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: wT(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new Y("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await bT(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => {
			let i = yT(await bT(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !Z(n)) throw new Y("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function Q(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var mT = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], hT = 100, gT = 100;
function _T(e) {
	if (!Array.isArray(e) || e.length === 0) throw new J("messages must contain at least one entry");
	if (e.length > gT) throw new J(`messages must contain at most ${gT} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new J("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new J("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function vT(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new J("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!mT.includes(n)) throw new J(`cursorType must be one of ${mT.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new J("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new J("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > hT) throw new J(`limit must be an integer between 1 and ${hT}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function yT(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new J(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function bT(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new J("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof J ? e : new J("Request body must be valid JSON");
	}
}
var xT = class extends J {};
async function ST(e) {
	try {
		return await bT(e);
	} catch (e) {
		throw e instanceof J ? new xT(e.message) : e;
	}
}
function CT(e) {
	if (typeof e != "string" || !sT.has(e)) throw new xT("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function wT(e) {
	if (typeof e != "string" || !cT.has(e)) throw new xT("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function TT(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new xT(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function ET(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new xT("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new xT("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function DT(e, t, n) {
	if (typeof e != "string") throw new xT(`${t} must be a base64 string`);
	if (e.length > n) throw new xT(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new xT(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new xT(`${t} must be canonical base64`);
	return r;
}
function OT(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !Q(t) || !Z(n) ? null : {
		cloud: t,
		service: n
	};
}
function kT(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: Iw(e.req.query("limit"))
	};
}
function AT(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new J("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new J("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: Iw(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function jT(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function $(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Aw(t, eT);
		return e.json(r, n);
	}
}
async function MT(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Aw(t, eT);
		if (t instanceof xT) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function NT(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
pT();
// ../api/src/registry/CloudAdapterRegistry.ts
var PT = class {
	adapters = /* @__PURE__ */ new Map();
	constructor(e = []) {
		for (let t of e) this.register(t);
	}
	register(e) {
		this.adapters.set(this.key(e.cloud, e.service), e);
	}
	get(e, t) {
		return this.adapters.get(this.key(e, t));
	}
	servicesFor(e) {
		return [...this.adapters.values()].filter((t) => t.cloud === e).map((e) => e.service);
	}
	key(e, t) {
		return `${e}:${t}`;
	}
}, FT = async () => {}, IT = {
	aws: FT,
	azure: FT,
	gcp: FT,
	oci: FT
};
function LT() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var RT = 5e3, zT = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = IT, n = aT(), r = null) {
		this.registry = e, this.scope = n, this.awsRegion = r, this.probes = t;
	}
	clouds() {
		let e = [
			{
				id: "aws",
				displayName: "AWS",
				availability: "available"
			},
			{
				id: "azure",
				displayName: "Azure",
				availability: "available"
			},
			{
				id: "gcp",
				displayName: "GCP",
				availability: "available"
			},
			{
				id: "oci",
				displayName: "OCI",
				availability: "available"
			}
		], t = this.scope ?? "aws";
		return e.filter((e) => this.allows(e.id)).map((e) => ({
			...e,
			default: e.id === t
		}));
	}
	scopedCloud() {
		return this.scope;
	}
	allows(e) {
		return this.scope === null || this.scope === e;
	}
	async services(e) {
		return Promise.all(zw.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? Bw(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: Vw(t, e),
				docsUrl: Gw(t, e),
				availability: a,
				reason: r.reason ?? BT(a, e, o),
				route: Hw(t, e),
				iconKey: t.iconKey,
				group: t.group,
				order: t.order
			};
		}));
	}
	schema(e, t) {
		return this.registry.get(e, t)?.schema() ?? null;
	}
	async status(e, t = {}) {
		let n = this.registry.servicesFor(e), r = await this.probeRuntime(e), i = {
			cloud: e,
			adapterRegistered: n.length > 0,
			runtime: r.runtime,
			endpoint: LT(e),
			checkedAt: r.checkedAt,
			error: r.error,
			...e === "aws" && this.awsRegion ? { region: this.awsRegion } : {}
		};
		return t.includeServices ? {
			...i,
			services: await Promise.all(n.map((t) => this.serviceStatus(e, t)))
		} : i;
	}
	async serviceStatus(e, t) {
		let n = `${e}:${t}`, r = this.serviceStatusCache.get(n);
		if (r && Date.now() - r.at < RT) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = LT(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
		if (!r) return {
			cloud: e,
			service: t,
			adapterRegistered: !1,
			runtime: "coming_soon",
			endpoint: n,
			checkedAt: i,
			latencyMs: null,
			error: null,
			errorCode: null
		};
		let a = performance.now();
		try {
			return r.health ? await r.health() : await r.list(), {
				cloud: e,
				service: t,
				adapterRegistered: !0,
				runtime: "reachable",
				endpoint: n,
				checkedAt: i,
				latencyMs: Math.round(performance.now() - a),
				error: null,
				errorCode: null
			};
		} catch (r) {
			let { body: o } = Aw(r, eT);
			return {
				cloud: e,
				service: t,
				adapterRegistered: !0,
				runtime: "unavailable",
				endpoint: n,
				checkedAt: i,
				latencyMs: Math.round(performance.now() - a),
				error: o.detail ?? o.message,
				errorCode: o.code
			};
		}
	}
	async probeRuntime(e) {
		let t = this.runtimeCache.get(e);
		if (t && Date.now() - t.at < RT) return t.value;
		let n = (/* @__PURE__ */ new Date()).toISOString(), r;
		try {
			await this.probes[e](), r = {
				runtime: "reachable",
				checkedAt: n,
				error: null
			};
		} catch (e) {
			r = {
				runtime: "unavailable",
				checkedAt: n,
				error: e instanceof Error ? e.message : "Runtime check failed"
			};
		}
		return this.runtimeCache.set(e, {
			at: Date.now(),
			value: r
		}), r;
	}
	async listResources(e, t, n) {
		return this.requireAdapter(e, t).list(n);
	}
	async getResource(e, t, n) {
		return this.requireAdapter(e, t).get(n);
	}
	async createResource(e, t, n) {
		return this.requireAdapter(e, t).create(n);
	}
	async updateResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.update) throw new X(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new X(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new X(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new X(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new X(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new Y(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new X(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new X(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new X(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new X(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new X(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new X(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new X(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new X(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new X(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new X(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new X(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new X(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new X(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new X(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new X(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new X(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new X(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new X(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new X(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = VT(e, t);
		if (this.emptying.has(a)) throw new Cw(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new Cw(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = VT(e, t);
		if (this.emptying.has(r)) throw new Cw(`Empty bucket is running on "${t}". Try again once it finishes.`);
		this.objectWrites.set(r, (this.objectWrites.get(r) ?? 0) + 1);
		try {
			return await n();
		} finally {
			let e = (this.objectWrites.get(r) ?? 1) - 1;
			e > 0 ? this.objectWrites.set(r, e) : this.objectWrites.delete(r);
		}
	}
	async listObjects(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listObjects) throw new X(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new X(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new X(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new X(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new X(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new X(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new X(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new X(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new X(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new X(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new X(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new X(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new X(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new X(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new X(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new X(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new X(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new X(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new X(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new X(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new X(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new X(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new X(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new X(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new X(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new X(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new X(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new X(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new X(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new X(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new X(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new X(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new X(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new X(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new X(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new X(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new X(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new X(`AppConfig resources are not supported for ${e}/configuration`);
		return t;
	}
	async listAppConfigEnvironments(e, t) {
		return this.appConfigAdapter(e).listAppConfigEnvironments(t);
	}
	async createAppConfigEnvironment(e, t, n) {
		return this.appConfigAdapter(e).createAppConfigEnvironment(t, n);
	}
	async deleteAppConfigEnvironment(e, t, n) {
		await this.appConfigAdapter(e).deleteAppConfigEnvironment(t, n);
	}
	async listAppConfigConfigurationProfiles(e, t) {
		return this.appConfigAdapter(e).listAppConfigConfigurationProfiles(t);
	}
	async createAppConfigConfigurationProfile(e, t, n) {
		return this.appConfigAdapter(e).createAppConfigConfigurationProfile(t, n);
	}
	async deleteAppConfigConfigurationProfile(e, t, n) {
		await this.appConfigAdapter(e).deleteAppConfigConfigurationProfile(t, n);
	}
	async listAppConfigHostedConfigurationVersions(e, t, n) {
		return this.appConfigAdapter(e).listAppConfigHostedConfigurationVersions(t, n);
	}
	async getAppConfigHostedConfigurationVersion(e, t, n, r) {
		return this.appConfigAdapter(e).getAppConfigHostedConfigurationVersion(t, n, r);
	}
	async createAppConfigHostedConfigurationVersion(e, t, n, r) {
		return this.appConfigAdapter(e).createAppConfigHostedConfigurationVersion(t, n, r);
	}
	async deleteAppConfigHostedConfigurationVersion(e, t, n, r) {
		await this.appConfigAdapter(e).deleteAppConfigHostedConfigurationVersion(t, n, r);
	}
	async listAppConfigDeploymentStrategies(e) {
		return this.appConfigAdapter(e).listAppConfigDeploymentStrategies();
	}
	async createAppConfigDeploymentStrategy(e, t) {
		return this.appConfigAdapter(e).createAppConfigDeploymentStrategy(t);
	}
	async deleteAppConfigDeploymentStrategy(e, t) {
		await this.appConfigAdapter(e).deleteAppConfigDeploymentStrategy(t);
	}
	async startAppConfigDeployment(e, t, n, r) {
		return this.appConfigAdapter(e).startAppConfigDeployment(t, n, r);
	}
	async getAppConfigDeployment(e, t, n, r) {
		return this.appConfigAdapter(e).getAppConfigDeployment(t, n, r);
	}
	async listLambdaTriggers(e, t) {
		let n = this.requireAdapter(e, "serverless");
		if (!n.listLambdaTriggers) throw new X(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new X(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new X(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new X(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function BT(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function VT(e, t) {
	return JSON.stringify([e, t]);
}
// ../api/src/cloud-spi/storageSchema.ts
var HT = [
	{
		name: "name",
		label: "Name"
	},
	{
		name: "type",
		label: "Type"
	},
	{
		name: "cloud",
		label: "Cloud"
	},
	{
		name: "region",
		label: "Region"
	},
	{
		name: "createdAt",
		label: "Created At"
	}
], UT = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}];
function WT(e) {
	return [
		{
			name: "list",
			label: "List resources",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "create",
			label: e,
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "delete",
			label: "Delete resource",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "inspect",
			label: "Inspect resource",
			enabled: !0,
			status: "available",
			runtimeRequired: !1
		}
	];
}
var GT = [
	{
		name: "list",
		label: "List objects",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "upload",
		label: "Upload object",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "download",
		label: "Download object",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "delete",
		label: "Delete object",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "createFolder",
		label: "Create folder",
		enabled: !0,
		status: "partial",
		reason: "Folders are represented as object/blob prefixes, not filesystem directories.",
		runtimeRequired: !0
	},
	{
		name: "copy",
		label: "Copy object",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	}
];
function KT() {
	return {
		cloud: "aws",
		service: "storage",
		displayName: "S3 Storage",
		fields: [{
			name: "bucketName",
			label: "Bucket Name",
			type: "text",
			required: !0,
			description: "3-63 characters. Lowercase letters, numbers, dots, and hyphens.",
			validation: {
				pattern: "^(?!\\d+\\.\\d+\\.\\d+\\.\\d+$)(?!.*\\.\\.)(?!.*\\.-)(?!.*-\\.)(?!.*--x-s3$)(?!.*-s3alias$)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$",
				minLength: 3,
				maxLength: 63,
				message: "Use a valid S3 bucket name: 3-63 lowercase characters, numbers, dots, or hyphens."
			}
		}, {
			name: "region",
			label: "Region",
			type: "select",
			required: !1,
			options: [{
				label: "US East (N. Virginia)",
				value: "us-east-1"
			}, {
				label: "US West (Oregon)",
				value: "us-west-2"
			}]
		}],
		actions: [
			"list",
			"create",
			"delete",
			"inspect"
		],
		capabilities: {
			resourceActions: [...WT("Create bucket"), {
				name: "emptyBucket",
				label: "Empty bucket",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}],
			objectActions: GT
		},
		filters: UT,
		columns: HT
	};
}
// ../api/src/adapter-aws/AwsStorageAdapter.ts
var qT = 1e3, JT = 25e3, YT = 10, XT = 256, ZT = class {
	s3;
	deleteBatchTimeoutMs;
	cloud = "aws";
	service = "storage";
	constructor(e = void 0, t = JT) {
		this.s3 = e, this.deleteBatchTimeoutMs = t;
	}
	schema() {
		return KT();
	}
	async list(e = {}) {
		let t = iE((await this.s3.send(new aC({}))).Buckets ?? [], e.search);
		return Promise.all(t.map(async (e) => {
			let { tags: t, tagsUnavailable: n } = await this.bucketTags(e.Name ?? "");
			return {
				id: e.Name ?? "",
				name: e.Name ?? "",
				cloud: "aws",
				service: "storage",
				type: "bucket",
				region: null,
				createdAt: e.CreationDate?.toISOString() ?? null,
				metadata: {
					provider: "aws",
					storageService: "s3",
					tags: t,
					tagsUnavailable: n
				}
			};
		}));
	}
	async bucketTags(e) {
		if (!e) return {
			tags: [],
			tagsUnavailable: !1
		};
		try {
			return {
				tags: ((await this.s3.send(new nC({ Bucket: e }))).TagSet ?? []).map((e) => ({
					key: e.Key ?? "",
					value: e.Value ?? ""
				})),
				tagsUnavailable: !1
			};
		} catch (e) {
			return e instanceof Error && e.name === "NoSuchTagSet" ? {
				tags: [],
				tagsUnavailable: !1
			} : {
				tags: [],
				tagsUnavailable: !0
			};
		}
	}
	async get(e) {
		let t = (await this.list()).find((t) => t.id === e);
		return t ? {
			...t,
			metadata: {
				...t.metadata,
				versioning: await this.bucketVersioning(e)
			}
		} : null;
	}
	async bucketVersioning(e) {
		try {
			let t = await this.s3.send(new rC({ Bucket: e }));
			return t.Status === void 0 ? "Disabled" : t.Status === "Enabled" || t.Status === "Suspended" ? t.Status : "Unknown";
		} catch {
			return "Unknown";
		}
	}
	async create(e) {
		let t = rE(e.values.bucketName);
		if (!t) throw new J("bucketName is required");
		if (!oE(t)) throw new J("Use a valid S3 bucket name: 3-63 lowercase characters, numbers, dots, or hyphens.");
		return await this.s3.send(new QS({ Bucket: t })), {
			id: t,
			name: t,
			cloud: "aws",
			service: "storage",
			type: "bucket",
			region: rE(e.values.region) || null,
			createdAt: null,
			metadata: {
				provider: "aws",
				storageService: "s3"
			}
		};
	}
	async delete(e) {
		try {
			await this.s3.send(new $S({ Bucket: e }));
		} catch (t) {
			throw t instanceof Error && t.name === "BucketNotEmpty" ? new Cw(`Bucket "${e}" is not empty. It may hold object versions or delete markers that the object list does not show. Use Empty bucket to remove them, then delete the bucket.`, { cause: t }) : t;
		}
	}
	async emptyBucket(e, t = {}) {
		let { signal: n } = t, r = { deleteDispatched: !1 };
		try {
			let t = await this.listAllVersions(e, n, r);
			for (let i = 0; i < t.length; i += qT) {
				QT(n);
				let a = t.slice(i, i + qT);
				r.deleteDispatched = !0;
				let o = await this.sendDeleteBatch(e, a);
				if (o.Errors?.length) throw new Dw(tE(e, o.Errors, a.length));
			}
			QT(n);
			let i = await this.s3.send(new sC({
				Bucket: e,
				MaxKeys: 1
			}), { abortSignal: n });
			if ((i.Versions?.length ?? 0) + (i.DeleteMarkers?.length ?? 0) > 0) throw new Cw(`Bucket "${e}" still holds object versions after emptying, most likely because something wrote to it meanwhile. Stop writes to the bucket and run Empty bucket again.`);
			return { deleted: t.length };
		} catch (t) {
			throw $T(e, t, n, r);
		}
	}
	async sendDeleteBatch(e, t) {
		let n = new AbortController(), r, i = new Promise((e, t) => {
			r = setTimeout(() => {
				let e = new DOMException("Delete batch timed out", "TimeoutError");
				n.abort(e), t(e);
			}, this.deleteBatchTimeoutMs);
		});
		try {
			let r = this.s3.send(new tC({
				Bucket: e,
				Delete: {
					Objects: t,
					Quiet: !0
				}
			}), { abortSignal: n.signal });
			return r.catch(() => {}), await Promise.race([r, i]);
		} catch (e) {
			throw n.signal.aborted ? new Ew(`a delete batch got no response within ${this.deleteBatchTimeoutMs / 1e3} seconds`, { cause: e }) : e;
		} finally {
			clearTimeout(r);
		}
	}
	async listAllVersions(e, t, n) {
		let r = [], i, a;
		for (;;) {
			QT(t);
			let n = await this.s3.send(new sC({
				Bucket: e,
				KeyMarker: i,
				VersionIdMarker: a
			}), { abortSignal: t });
			for (let e of [...n.Versions ?? [], ...n.DeleteMarkers ?? []]) {
				if (!e.Key || !e.VersionId) throw new Dw("ListObjectVersions returned an entry without a key or version ID.");
				r.push({
					Key: e.Key,
					VersionId: e.VersionId
				});
			}
			if (!n.IsTruncated) return r;
			if (!n.NextKeyMarker || !n.NextVersionIdMarker) throw new Dw("ListObjectVersions returned a truncated page without both continuation markers.");
			if (n.NextKeyMarker === i && n.NextVersionIdMarker === a) throw new Dw("ListObjectVersions returned the same continuation markers twice.");
			i = n.NextKeyMarker, a = n.NextVersionIdMarker;
		}
	}
	async listObjects(e, t = "") {
		let n = await this.s3.send(new oC({
			Bucket: e,
			Prefix: t || void 0,
			Delimiter: "/"
		}));
		return {
			prefix: t,
			objects: [...(n.CommonPrefixes ?? []).map((e) => {
				let n = e.Prefix ?? "";
				return {
					key: n,
					name: aE(n, t),
					type: "folder",
					size: null,
					lastModified: null,
					metadata: {
						provider: "aws",
						storageService: "s3",
						prefix: n
					}
				};
			}), ...(n.Contents ?? []).filter((e) => e.Key && e.Key !== t).map((e) => ({
				key: e.Key ?? "",
				name: aE(e.Key ?? "", t),
				type: "object",
				size: e.Size ?? null,
				lastModified: e.LastModified?.toISOString() ?? null,
				metadata: {
					provider: "aws",
					storageService: "s3",
					etag: e.ETag?.replace(/"/g, ""),
					storageClass: e.StorageClass
				}
			}))]
		};
	}
	async putObject(e, t, n, r) {
		await this.s3.send(new cC({
			Bucket: e,
			Key: t,
			Body: n,
			ContentType: r
		}));
	}
	async getObject(e, t) {
		let n = await this.s3.send(new iC({
			Bucket: e,
			Key: t
		}));
		return {
			body: n.Body,
			contentType: n.ContentType ?? "application/octet-stream",
			contentLength: n.ContentLength ?? null
		};
	}
	async deleteObject(e, t) {
		await this.s3.send(new eC({
			Bucket: e,
			Key: t
		}));
	}
	async copyObject(e, t, n, r) {
		let i = r ?? e;
		await this.s3.send(new ZS({
			Bucket: i,
			Key: n,
			CopySource: `${e}/${t}`
		}));
	}
};
function QT(e) {
	if (e?.aborted) throw e.reason ?? new DOMException("The operation was aborted", "AbortError");
}
function $T(e, t, n, r) {
	let i = n?.aborted === !0 && (t === n.reason || eE(t)) ? new Ew(n.reason?.name === "TimeoutError" ? "the operation ran past its time limit" : "the request was cancelled", { cause: t }) : t instanceof xw ? t : eT(t) ?? new Dw(t instanceof Error ? t.message : String(t), { cause: t }), a = r.deleteDispatched ? "stopped after deletion started, so some versions and delete markers may already be permanently deleted. Run Empty bucket again to remove the rest" : "stopped before deleting anything", o = i.constructor;
	return new o(`Emptying bucket "${e}" ${a}: ${i.message}`, { cause: t });
}
function eE(e) {
	return !(e instanceof xw) && e instanceof Error && (e.name === "AbortError" || e.name === "TimeoutError");
}
function tE(e, t, n) {
	let r = t.slice(0, YT).map((e) => [
		`key=${nE(e.Key)}`,
		`versionId=${nE(e.VersionId)}`,
		`code=${nE(e.Code)}`,
		`message=${nE(e.Message)}`
	].join(", ")), i = t.length - r.length;
	return [
		`S3 refused to delete ${t.length} of ${n} entries in a batch of bucket "${e}".`,
		...r,
		...i > 0 ? [`${i} more not shown.`] : []
	].join("\n");
}
function nE(e) {
	return e === void 0 ? "(none)" : e.length > XT ? `${e.slice(0, XT)}...` : e;
}
function rE(e) {
	return typeof e == "string" ? e.trim() : "";
}
function iE(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => (e.Name ?? "").toLowerCase().includes(n)) : e;
}
function aE(e, t) {
	return (e.startsWith(t) ? e.slice(t.length) : e).replace(/\/$/, "") || e;
}
function oE(e) {
	return /^(?!\d+\.\d+\.\d+\.\d+$)(?!.*\.\.)(?!.*\.-)(?!.*-\.)(?!.*--x-s3$)(?!.*-s3alias$)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(e);
}
var sE = pT(new zT(new PT([new ZT(new XS({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test"
	},
	endpoint: "https://emulator.local.invalid",
	forcePathStyle: !0
}))]), {
	aws: async () => {},
	azure: async () => {},
	gcp: async () => {},
	oci: async () => {}
}, "aws", "us-east-1"));
async function cE(e) {
	return sE.fetch(e);
}
export { cE as handleS3Request };
