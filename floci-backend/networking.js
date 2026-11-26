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
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function r(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/isStreamingPayload/isStreamingPayload.browser.js
var i = (e) => e?.body instanceof ReadableStream, a = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, o = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, s = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => c[t.step] - c[e.step] || l[t.priority || "normal"] - l[e.priority || "normal"]), u = (n) => {
		let i = !1, o = (e) => {
			let t = a(e.name, e.aliases);
			if (t.includes(n)) {
				i = !0;
				for (let e of t) r.delete(e);
				return !1;
			}
			return !0;
		};
		return e = e.filter(o), t = t.filter(o), i;
	}, d = (n) => {
		let i = !1, o = (e) => {
			if (e.middleware === n) {
				i = !0;
				for (let t of a(e.name, e.aliases)) r.delete(t);
				return !1;
			}
			return !0;
		};
		return e = e.filter(o), t = t.filter(o), i;
	}, f = (n) => (e.forEach((e) => {
		n.add(e.middleware, { ...e });
	}), t.forEach((e) => {
		n.addRelativeTo(e.middleware, { ...e });
	}), n.identifyOnResolve?.(h.identifyOnResolve()), n), p = (e) => {
		let t = [];
		return e.before.forEach((e) => {
			e.before.length === 0 && e.after.length === 0 ? t.push(e) : t.push(...p(e));
		}), t.push(e), e.after.reverse().forEach((e) => {
			e.before.length === 0 && e.after.length === 0 ? t.push(e) : t.push(...p(e));
		}), t;
	}, m = (n = !1) => {
		let r = [], s = [], c = {};
		return e.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of a(t.name, t.aliases)) c[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of a(t.name, t.aliases)) c[e] = t;
			s.push(t);
		}), s.forEach((e) => {
			if (e.toMiddleware) {
				let t = c[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${o(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
				}
				e.relation === "after" && t.after.push(e), e.relation === "before" && t.before.push(e);
			}
		}), i(r).map(p).reduce((e, t) => (e.push(...t), e), []);
	}, h = {
		add: (t, n = {}) => {
			let { name: i, override: s, aliases: c } = n, l = {
				step: "initialize",
				priority: "normal",
				middleware: t,
				...n
			}, u = a(i, c);
			if (u.length > 0) {
				if (u.some((e) => r.has(e))) {
					if (!s) throw Error(`Duplicate middleware name '${o(i, c)}'`);
					for (let t of u) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== l.step || l.priority !== r.priority) throw Error(`"${o(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${o(i, c)}" middleware with ${l.priority} priority in ${l.step} step.`);
						e.splice(n, 1);
					}
				}
				for (let e of u) r.add(e);
			}
			e.push(l);
		},
		addRelativeTo: (e, n) => {
			let { name: i, override: s, aliases: c } = n, l = {
				middleware: e,
				...n
			}, u = a(i, c);
			if (u.length > 0) {
				if (u.some((e) => r.has(e))) {
					if (!s) throw Error(`Duplicate middleware name '${o(i, c)}'`);
					for (let e of u) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== l.toMiddleware || r.relation !== l.relation) throw Error(`"${o(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${o(i, c)}" middleware ${l.relation} "${l.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of u) r.add(e);
			}
			t.push(l);
		},
		clone: () => f(s()),
		use: (e) => {
			e.applyToStack(h);
		},
		remove: (e) => typeof e == "string" ? u(e) : d(e),
		removeByTag: (n) => {
			let i = !1, o = (e) => {
				let { tags: t, name: o, aliases: s } = e;
				if (t && t.includes(n)) {
					let e = a(o, s);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(o), t = t.filter(o), i;
		},
		concat: (e) => {
			let t = f(s());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: f,
		identify: () => m(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return o(e.name, e.aliases) + " - " + t;
		}),
		identifyOnResolve(e) {
			return typeof e == "boolean" && (n = e), n;
		},
		resolve: (e, t) => {
			for (let n of m().map((e) => e.middleware).reverse()) e = n(e, t);
			return n && console.log(h.identify()), e;
		}
	};
	return h;
}, c = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, l = {
	high: 3,
	normal: 2,
	low: 1
}, u, d = t((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(u ||= {});
})), f, p = t((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(f ||= {});
})), m = t((() => {
	p();
})), h, g = t((() => {
	h = "__smithy_context";
})), _ = t((() => {
	d(), m(), g();
})), ee, te = t((() => {
	_(), ee = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function v(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var ne = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function re(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var ie, ae = t((() => {
	ie = class e {
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
			return n.query &&= re(n.query), n;
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
})), oe, se = t((() => {
	oe = class {
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
})), ce, le, ue = t((() => {
	ce = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), le = (e, t = !1) => {
		if (!t) return ce.test(e);
		let n = e.split(".");
		for (let e of n) if (!le(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function de(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var fe = t((() => {})), pe, me = t((() => {
	pe = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function he(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var ge = t((() => {})), _e, ve = t((() => {
	ge(), _e = (e) => {
		if (typeof e == "string") return _e(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = he(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), ye, be = t((() => {
	ne(), ve(), ye = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = _e(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) v(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return _e(e);
	};
})), y = t((() => {
	te(), ne(), ae(), se(), ue(), fe(), me(), ve(), be();
})), xe = (e) => () => Promise.reject(e), Se = class {
	config;
	middlewareStack = s();
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
}, Ce, we = t((() => {
	Ce = (e) => typeof e == "function" ? e() : e;
})), Te, Ee = t((() => {
	Te = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), De, Oe, ke = t((() => {
	y(), Ee(), De = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = ee(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(Te(o, s, c, l, u), {
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
					if (oe.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Oe(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Oe(/^x-[\w-]+-id-2$/, r),
							cfId: Oe(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Oe = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), Ae, je = t((() => {
	y(), Ee(), Ae = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = ee(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => ye(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(Te(a, o, s, c, l), r.input, {
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
function Me(e) {
	return { applyToStack: (t) => {
		t.add(Ae(e), Pe), t.add(De(e), Ne), e.protocol.setSerdeContext(e);
	} };
}
var Ne, Pe, Fe = t((() => {
	ke(), je(), Ne = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Pe = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function Ie(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Le[e]) return Le[e];
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
	return Le[e] = t;
}
var Le, Re = t((() => {
	Le = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function ze(e, t) {
	return e instanceof b ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new b(e, t);
}
var Be, Ve, He, b, Ue, We, Ge = t((() => {
	we(), Re(), Be = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, Ve = [], He = {}, b = class e {
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
			for (this._isMemberSchema = !1; Ue(i);) r.push(i[1]), i = i[0], a = Ce(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, Ie(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = Ce(a), We(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (Ve[t]) return Ve[t];
			} else if (typeof t == "string") {
				if (He[t]) return He[t];
			} else if (n && t[Be.ns]) return t[Be.ns];
			let r = Ce(t);
			if (r instanceof e) return r;
			if (Ue(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), Ie(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Be.ns] = i : typeof r == "string" ? He[r] = i : typeof r == "number" ? Ve[r] = i : i;
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
			return Ie(this.memberTraits);
		}
		getOwnTraits() {
			return Ie(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return ze([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return ze([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return ze(Ue(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return ze([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[Be.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = ze([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Be.it] = n;
			}
		}
	}, Ue = (e) => Array.isArray(e) && e.length === 2, We = (e) => Array.isArray(e) && e.length >= 5;
})), Ke, qe = t((() => {
	Ke = class e {
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
})), Je = t((() => {
	we(), Fe(), Ee(), Ge(), Re(), qe();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
Je();
var Ye = "***SensitiveInformation***";
function Xe(e, t) {
	if (t == null) return t;
	let n = b.of(e);
	if (n.getMergedTraits().sensitive) return Ye;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return Ye;
		if (Array.isArray(t)) return t.map((t) => Xe(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return Ye;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, Xe(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = Xe(i, e[t]));
		return r;
	}
	return t;
}
_(), Je();
var Ze = Symbol.for("@smithy/op-event-stream"), Qe = class {
	middlewareStack = s();
	schema;
	static classBuilder() {
		return new $e();
	}
	resolveMiddlewareWithContext(e, t, n, { middlewareFn: r, clientName: i, commandName: a, inputFilterSensitiveLog: o, outputFilterSensitiveLog: s, smithyContext: c, additionalContext: l, CommandCtor: u }) {
		for (let i of r.bind(this)(u, e, t, n)) this.middlewareStack.use(i);
		let d = e.concat(this.middlewareStack), { logger: f } = t, p = l[h], m = {
			logger: f,
			clientName: i,
			commandName: a,
			inputFilterSensitiveLog: o,
			outputFilterSensitiveLog: s,
			...l,
			[h]: {
				...p,
				commandInstance: this,
				...c,
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
			}
		}, { requestHandler: g } = t, _ = n ?? {};
		_.metricsRecorder && (_ = { ..._ }, delete _.metricsRecorder);
		let ee, te = this.schema, v = te?.[Ze];
		if (v !== void 0) ee = v;
		else if (te && Array.isArray(te) && te[0] === 9) {
			let [, , , , e, t] = te;
			ee = te[Ze] = !!(b.of(e).getEventStreamMember() || b.of(t).getEventStreamMember());
		}
		return ee && (_ = {
			isEventStream: ee,
			..._
		}), d.resolve((e) => g.handle(e.request, _), m);
	}
}, $e = class {
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
		return t = class extends Qe {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? Xe.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? Xe.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, et = class e extends Error {
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
}, tt = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), nt = (e) => {
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
y(), _();
var rt = Object.values(f), it = (e) => {
	let t = [];
	for (let n in f) {
		if (!v(f, n)) continue;
		let r = f[n];
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
			rt.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, at = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		rt.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, ot = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), st = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, ct = (e) => Object.assign(it(e), ot(e)), lt = (e) => Object.assign(at(e), st(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/get-value-from-text-node.js
y();
var ut = (e) => {
	let t = "#text";
	for (let n in e) v(e, n) && (e[n][t] === void 0 ? typeof e[n] == "object" && e[n] !== null && (e[n] = ut(e[n])) : e[n] = e[n][t]);
	return e;
}, dt = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function ft(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return Qe.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var pt, mt, ht, gt = t((() => {
	pt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", mt = Object.entries(pt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), ht = pt.split("");
})), _t, vt = t((() => {
	gt(), _t = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in mt)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= mt[e[r]] << (a - r) * 6, i += 6;
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
})), yt, bt = t((() => {
	yt = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function xt(e) {
	let t;
	t = typeof e == "string" ? yt(e) : e;
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
			i += ht[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var St = t((() => {
	bt(), gt();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function Ct(e, t, n, r) {
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
var wt = t((() => {})), Tt, Et = t((() => {
	Tt = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Dt(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, x[t[0]] + x[t[1]] + x[t[2]] + x[t[3]] + "-" + x[t[4]] + x[t[5]] + "-" + x[t[6]] + x[t[7]] + "-" + x[t[8]] + x[t[9]] + "-" + x[t[10]] + x[t[11]] + x[t[12]] + x[t[13]] + x[t[14]] + x[t[15]];
	};
}
var x, Ot = t((() => {
	x = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt = t((() => {
	kt = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && Ut.warn(Ht(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, At = Math.ceil(2 ** 127 * (2 - 2 ** -23)), jt = (e) => {
		let t = kt(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > At) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Mt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Nt = (e) => Ft(e, 16), Pt = (e) => Ft(e, 8), Ft = (e, t) => {
		let n = Mt(e);
		if (n !== void 0 && It(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, It = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Lt = (e) => jt(typeof e == "string" ? zt(e) : e), Rt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, zt = (e) => {
		let t = e.match(Rt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, Bt = (e) => Nt(typeof e == "string" ? zt(e) : e), Vt = (e) => Pt(typeof e == "string" ? zt(e) : e), Ht = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), Ut = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function Gt(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Kt[r]}, ${c} ${qt[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln, un = t((() => {
	Wt(), Kt = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], qt = [
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
	], Jt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), Yt = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), Xt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), Zt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = Jt.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Qt(Bt(ln(i)), nn(r), sn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = Yt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return tn(Qt($t(i), nn(r), sn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = Xt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Qt(Bt(ln(c)), nn(n), sn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, Qt = (e, t, n, r) => {
		let i = t - 1;
		return an(e, i, n), new Date(Date.UTC(e, i, n, sn(r.hours, "hour", 0, 23), sn(r.minutes, "minute", 0, 59), sn(r.seconds, "seconds", 0, 60), cn(r.fractionalMilliseconds)));
	}, $t = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + Bt(ln(e));
		return n < t ? n + 100 : n;
	}, en = 15768e8, tn = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > en ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, nn = (e) => {
		let t = qt.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, rn = [
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
	], an = (e, t, n) => {
		let r = rn[t];
		if (t === 1 && on(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${qt[t]} in ${e}: ${n}`);
	}, on = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), sn = (e, t, n, r) => {
		let i = Vt(ln(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, cn = (e) => e == null ? 0 : Lt("0." + e) * 1e3, ln = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), dn, fn = t((() => {
	dn = function(e) {
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
	}, dn.from = (e) => e && typeof e == "object" && (e instanceof dn || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? dn(String(e)) : dn(JSON.stringify(e)), dn.fromObject = dn.from;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function pn(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw Error(`Value ${r} out of range [${t}, ${n}]`);
}
var mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn = t((() => {
	mn = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", hn = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", gn = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", _n = "(\\d?\\d)", vn = "(\\d{4})", yn = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), bn = RegExp(`^${mn}, ${_n} ${hn} ${vn} ${gn} GMT$`), xn = RegExp(`^${mn}, ${_n}-${hn}-(\\d\\d) ${gn} GMT$`), Sn = RegExp(`^${mn} ${hn} ( [1-9]|\\d\\d) ${gn} ${vn}$`), Cn = [
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
	], wn = (e) => {
		if (e == null) return;
		let t = NaN;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") {
			if (!/^-?\d*\.?\d+$/.test(e)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
			t = Number.parseFloat(e);
		} else typeof e == "object" && e.tag === 1 && (t = e.value);
		if (isNaN(t) || Math.abs(t) === Infinity) throw TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(t * 1e3));
	}, Tn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC3339 timestamps must be strings");
		let t = yn.exec(e);
		if (!t) throw TypeError(`Invalid RFC3339 timestamp format ${e}`);
		let [, n, r, i, a, o, s, , c, l] = t;
		pn(r, 1, 12), pn(i, 1, 31), pn(a, 0, 23), pn(o, 0, 59), pn(s, 0, 60);
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
	}, En = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC7231 timestamps must be strings.");
		let t, n, r, i, a, o, s, c;
		if ((c = bn.exec(e)) ? [, t, n, r, i, a, o, s] = c : (c = xn.exec(e)) ? ([, t, n, r, i, a, o, s] = c, r = (Number(r) + 1900).toString()) : (c = Sn.exec(e)) && ([, n, t, i, a, o, s, r] = c), r && o) {
			let e = Date.UTC(Number(r), Cn.indexOf(n), Number(t), Number(i), Number(a), Number(o), s ? Math.round(parseFloat(`0.${s}`) * 1e3) : 0);
			pn(t, 1, 31), pn(i, 0, 23), pn(a, 0, 59), pn(o, 0, 60);
			let c = new Date(e);
			return c.setUTCFullYear(Number(r)), c;
		}
		throw TypeError(`Invalid RFC7231 date-time value ${e}.`);
	};
})), On, kn = t((() => {
	On = (e) => {
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
})), An, jn, Mn = t((() => {
	An = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, jn = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !An.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && An.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function Nn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in In) t[n / 2] = In[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function Pn(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Fn[e[n]];
	return t;
}
var Fn, In, Ln = t((() => {
	Fn = {}, In = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), Fn[e] = t, In[t] = e;
	}
})), Rn, zn, Bn = t((() => {
	Rn = typeof TextEncoder == "function" ? new TextEncoder() : null, zn = (e) => {
		if (typeof e == "string") {
			if (Rn) return Rn.encode(e).byteLength;
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
})), Vn, Hn = t((() => {
	bt(), Vn = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? yt(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Un(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Wn = t((() => {})), Gn, Kn = t((() => {
	Gn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), qn, Jn = t((() => {
	qn = async (e) => void 0;
})), Yn, Xn, Zn, Qn, $n, er, tr = t((() => {
	Yn = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), er(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!$n(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Xn = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Zn = /(\d+\.){3}\d+/, Qn = /\.\./, $n = (e) => Xn.test(e) && !Zn.test(e) && !Qn.test(e), er = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), nr = t((() => {
	tr();
})), rr, ir = t((() => {
	rr = (e, t, n, r = !1) => {
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
})), ar = t((() => {
	y();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function or(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(ye(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await sr(t, n, r);
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
var sr, cr = t((() => {
	nr(), ir(), ar(), sr = async (e, t, n) => {
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
				r[t] = await rr(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Yn(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function lr(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function ur(e) {
	let t = or(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && lr(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = ee(i)?.selectedHttpAuthScheme?.httpAuthOption;
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
var dr = t((() => {
	y(), cr();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function fr(e) {
	let t = ur(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), mr);
	} });
}
var pr, mr, hr = t((() => {
	dr(), pr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, mr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: pr.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function gr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => ye(await pe(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: pe(i ?? !1),
			useFipsEndpoint: pe(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var _r = t((() => {
	y(), ar();
})), vr, yr = t((() => {
	vr = class e {
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
})), br, xr = t((() => {
	br = class {
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
})), Sr, Cr = t((() => {
	Sr = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), wr = t((() => {
	Cr();
})), Tr, Er = t((() => {
	Tr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function Dr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${Dr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(Dr).join(", ")})` : JSON.stringify(e, null, 2);
}
var Or = t((() => {})), kr = t((() => {
	Er(), Or();
})), Ar, jr = t((() => {
	Ar = {};
})), Mr, Nr = t((() => {
	Mr = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function Pr(...e) {
	for (let t of e) if (t != null) return t;
}
var Fr = t((() => {})), Ir, Lr = t((() => {
	wr(), Ir = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new Sr(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new Sr(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), Rr, zr = t((() => {
	wr(), Lr(), Rr = (e, t) => Ir(t).reduce((n, r) => {
		if (typeof n != "object") throw new Sr(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Br, Vr = t((() => {
	Br = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Hr(e, t, n) {
	return e ? t : n;
}
var Ur = t((() => {})), Wr, Gr = t((() => {
	Wr = (e) => !e;
})), Kr, qr, Jr = t((() => {
	Kr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), qr = (e) => Kr.test(e) || e.startsWith("[") && e.endsWith("]");
})), Yr, Xr, Zr = t((() => {
	_(), Jr(), Yr = {
		[u.HTTP]: 80,
		[u.HTTPS]: 443
	}, Xr = (e) => {
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
		if (!Object.values(u).includes(c)) return null;
		let l = qr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Yr[c]}`) || typeof e == "string" && e.includes(`${r}:${Yr[c]}`) ? `:${Yr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Qr(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var $r = t((() => {})), ei, ti = t((() => {
	ei = (e, t) => e === t;
})), ni, ri = t((() => {
	ni = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), ii, ai = t((() => {
	ii = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), oi = t((() => {
	Nr(), Fr(), zr(), Vr(), y(), Ur(), Gr(), Zr(), $r(), ti(), ri(), ai();
})), si, ci = t((() => {
	oi(), si = {
		booleanEquals: Mr,
		coalesce: Pr,
		getAttr: Rr,
		isSet: Br,
		isValidHostLabel: le,
		ite: Hr,
		not: Wr,
		parseURL: Xr,
		split: Qr,
		stringEquals: ei,
		substring: ni,
		uriEncode: ii
	};
})), li, ui = t((() => {
	oi(), li = (e, t) => {
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
				n.push(Rr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), di, fi = t((() => {
	di = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), pi, mi, hi, gi = t((() => {
	wr(), jr(), ci(), ui(), fi(), pi = (e, t, n) => {
		if (typeof e == "string") return li(e, n);
		if (e.fn) return hi.callFunction(e, n);
		if (e.ref) return di(e, n);
		throw new Sr(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, mi = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = hi.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = Ar[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = si[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, hi = {
		evaluateExpression: pi,
		callFunction: mi
	};
})), _i = t((() => {
	gi();
})), vi, yi = t((() => {
	kr(), wr(), _i(), vi = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new Sr(`'${n}' is already defined in Reference Record.`);
		let r = mi(e, t);
		t.logger?.debug?.(`${Tr} evaluateCondition: ${Dr(e)} = ${Dr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), bi, xi = t((() => {
	wr(), gi(), bi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = pi(e, "Header value entry", t);
		if (typeof r != "string") throw new Sr(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), Si, Ci, wi, Ti = t((() => {
	wr(), ui(), Si = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = wi.getEndpointProperty(r, t), e), {}), Ci = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => Ci(e, t));
		switch (typeof e) {
			case "string": return li(e, t);
			case "object":
				if (e === null) throw new Sr(`Unexpected endpoint property: ${e}`);
				return wi.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new Sr(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, wi = {
		getEndpointProperty: Ci,
		getEndpointProperties: Si
	};
})), Ei, Di = t((() => {
	wr(), gi(), Ei = (e, t) => {
		let n = pi(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new Sr(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), Oi, ki, Ai = t((() => {
	wr(), yi(), gi(), xi(), Ti(), Di(), Oi = 1e8, ki = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < Oi;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = vi({
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
		if (o >= Oi) {
			let e = i[o - Oi];
			if (e[0] === -1) {
				let [, t] = e;
				throw new Sr(pi(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: Ei(t, c),
				properties: Si(n, c),
				headers: bi(r ?? {}, c)
			};
		}
		throw new Sr("No matching endpoint.");
	};
})), ji, Mi, Ni = t((() => {
	Jn(), cr(), dr(), hr(), _r(), y(), yr(), xr(), Ai(), Jr(), jr(), kr(), wr(), yi(), xi(), Ti(), Di(), gi(), ar(), ji = gr(qn), ur(qn), Mi = fr(qn);
})), Pi, Fi = t((() => {
	Pi = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Ii(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function Li(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Un(t, r);
}
var Ri, zi = t((() => {
	Wn(), Fi(), Ri = async (e) => Pi(e) ? Ii(e) : Li(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Bi(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Vi = t((() => {})), Hi, Ui, Wi, Gi, S = t((() => {
	vt(), St(), wt(), bt(), Et(), Ot(), un(), fn(), Wt(), Dn(), kn(), Mn(), Ln(), Bn(), Hn(), Wn(), Kn(), y(), Ni(), Fi(), zi(), Vi(), Hi = class extends Ct(Tt, yt, xt, _t) {}, Ui = (e) => crypto.getRandomValues(e), Wi = Dt(Ui), Gi = Wi;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
S();
var Ki = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return Hi.mutate(e);
	if (!e) return Hi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return Hi.mutate(await n);
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function qi(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
		return "%" + e.charCodeAt(0).toString(16).toUpperCase();
	});
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var Ji = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Yi, Xi, Zi, Qi = t((() => {
	Yi = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Yi[e] = t >>> 0;
	}
	Xi = 4294967295, Zi = class {
		digestLength = 4;
		checksum = Xi;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Yi[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Xi) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Xi;
		}
	};
})), $i, ea, ta, na, ra, ia, aa = t((() => {
	S(), $i = 64, ea = 32, ta = 2 ** 53 - 1, na = class e {
		digestLength = ea;
		state = Int32Array.from(ra);
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
				for (let e = 0; e < $i; ++e) a[e] = 54 ^ n[e], a[e + $i] = 92 ^ n[e];
				r.update(a.subarray(0, $i)), i.update(a.subarray($i));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = Vn(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > ta) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === $i && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(ra), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % $i >= 56) {
				for (let e = n; e < $i; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(ea);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = Vn(t);
			if (n.byteLength > $i) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array($i);
				return i.set(r), i;
			}
			if (n.byteLength < $i) {
				let e = new Uint8Array($i);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < $i; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (ia[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, ra = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), ia = new Int32Array([
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
})), oa, sa, ca, la, ua, da, fa = t((() => {
	S(), aa(), {digest: oa, sign: sa, importKey: ca} = globalThis?.crypto?.subtle ?? {}, la = typeof oa == "function" && typeof sa == "function" && typeof ca == "function" ? globalThis.crypto.subtle : void 0, ua = 8388608, da = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = Vn(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= ua && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Un(this.pending);
			if (la) {
				if (this.secret) {
					this.finished = !0;
					let t = await la.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await la.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await la.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new na(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new na(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), pa = t((() => {
	S(), Qi(), aa(), fa();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function ma(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var ha, ga = t((() => {
	S(), ha = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && ma(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && ma(e), parseInt(Pn(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), _a, va, ya, ba, xa, Sa, Ca, wa, Ta, Ea, Da, Oa, ka, Aa = t((() => {
	y(), S(), ga(), _a = class {
		toUtf8;
		fromUtf8;
		constructor(e, t) {
			this.toUtf8 = e, this.fromUtf8 = t;
		}
		format(e) {
			let t = [];
			for (let n in e) {
				if (!v(e, n)) continue;
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
					if (e.value.byteLength > ka) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ka} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ka) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ka} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(ha.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!Oa.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(Nn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: ya,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: ya,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: ba,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: xa,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: Sa,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: Ca,
							value: new ha(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: wa,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: Ta,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: Ea,
							value: new Date(new ha(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: Da,
							value: `${Pn(o.subarray(0, 4))}-${Pn(o.subarray(4, 6))}-${Pn(o.subarray(6, 8))}-${Pn(o.subarray(8, 10))}-${Pn(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(va ||= {}), ya = "boolean", ba = "byte", xa = "short", Sa = "integer", Ca = "long", wa = "binary", Ta = "string", Ea = "timestamp", Da = "uuid", Oa = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ka = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function ja({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Fa) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(Ma, !1), o = r.getUint32(Na, !1), s = r.getUint32(e - Pa, !1), c = new Zi();
	if (c.update(new Uint8Array(n, t, Na)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + Na, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + Na + Pa, a),
		body: new Uint8Array(n, t + Na + Pa + a, i - a - 16)
	};
}
var Ma, Na, Pa, Fa, Ia = t((() => {
	pa(), Ma = 4, Na = 8, Pa = 4, Fa = 16;
})), La, Ra = t((() => {
	pa(), Aa(), Ia(), La = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new _a(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Zi();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = ja(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), za, Ba = t((() => {
	za = class {
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
})), Va, Ha = t((() => {
	Va = class {
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
})), Ua, Wa = t((() => {
	Ua = class {
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
})), Ga, Ka = t((() => {
	Ga = class {
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
function qa(e) {
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
var Ja = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ya(e, t) {
	let n = Xa(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Xa(e, t) {
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
var Za = t((() => {})), Qa, $a, eo = t((() => {
	Ra(), Ba(), Ha(), Wa(), Ka(), Ja(), Za(), Qa = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new La(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = qa(e);
			return new Ua({
				messageStream: new za({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Xa(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Va({
				messageStream: new Ga({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, $a = (e) => new Qa(e);
})), to, no, ro = t((() => {
	to = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), no = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), io, ao, oo, so = t((() => {
	eo(), ro(), io = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Qa({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = ao(e) ? to(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? no(n) : n;
		}
	}, ao = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, oo = (e) => new io(e);
})), co, lo = t((() => {
	co = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), uo, fo = t((() => {
	y(), Je(), S(), uo = class {
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
				for (let n in e) if (v(e, n) && n !== "__type") {
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
				for (let t in e) if (v(e, t) && t !== "__type") {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? Tt)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				for (let e in u.value) v(u.value, e) && (n[e] = u.value[e]);
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
				let e = a[1], t = Ke.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? yt)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), po = /* @__PURE__ */ n({
	EventStreamCodec: () => La,
	EventStreamMarshaller: () => io,
	EventStreamSerde: () => uo,
	HeaderMarshaller: () => _a,
	Int64: () => ha,
	MessageDecoderStream: () => za,
	MessageEncoderStream: () => Va,
	SmithyMessageDecoderStream: () => Ua,
	SmithyMessageEncoderStream: () => Ga,
	UniversalEventStreamMarshaller: () => Qa,
	eventStreamSerdeProvider: () => oo,
	getChunkedStream: () => qa,
	getMessageUnmarshaller: () => Xa,
	getUnmarshalledStream: () => Ya,
	iterableToReadableStream: () => no,
	readableStreamToIterable: () => to,
	resolveEventStreamSerdeConfig: () => co,
	universalEventStreamSerdeProvider: () => $a
}), mo = t((() => {
	Ra(), Aa(), ga(), Ba(), Ha(), Wa(), Ka(), so(), ro(), eo(), Ja(), Za(), lo(), fo();
}));
y(), Je();
var ho = class extends Ji {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Ke(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return ie;
	}
	getResponseType() {
		return oe;
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.serializer.setSerdeContext(e), this.deserializer.setSerdeContext(e), this.getPayloadCodec() && this.getPayloadCodec().setSerdeContext(e);
	}
	updateServiceEndpoint(e, t) {
		if ("url" in t) {
			e.protocol = t.url.protocol, e.hostname = t.url.hostname, e.port = t.url.port ? Number(t.url.port) : void 0, e.path = t.url.pathname, e.fragment = t.url.hash || void 0, e.username = t.url.username || void 0, e.password = t.url.password || void 0, e.query ||= {};
			for (let [n, r] of t.url.searchParams.entries()) e.query[n] = r;
			if (t.headers) for (let n in t.headers) v(t.headers, n) && (e.headers[n] = t.headers[n].join(", "));
			return e;
		}
		if (e.protocol = t.protocol, e.hostname = t.hostname, e.port = t.port ? Number(t.port) : void 0, e.path = t.path, e.query = { ...t.query }, t.headers) for (let n in t.headers) v(t.headers, n) && (e.headers[n] = t.headers[n]);
		return e;
	}
	setHostPrefix(e, t, n) {
		if (this.serdeContext?.disableHostPrefix) return;
		let r = b.of(t.input), i = Ie(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !de(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (mo(), po));
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
y(), Je();
var go = class extends ho {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = b.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new ie({
			protocol: "",
			hostname: "",
			port: void 0,
			path: "/",
			fragment: void 0,
			query: i,
			headers: a,
			body: void 0
		});
		if (o && (this.updateServiceEndpoint(d, o), this.setHostPrefix(d, e, u)), u) {
			let e = s.getEventStreamMember();
			if (e) {
				if (u[e]) {
					let t = {};
					for (let [n] of s.structIterator()) n !== e && u[n] != null && (t[n] = u[n]);
					l = await this.serializeEventStream({
						eventStream: u[e],
						requestSchema: s,
						initialRequest: t
					});
				}
			} else r.write(c, u), l = r.flush();
		}
		return d.headers = Object.assign(d.headers, a), d.query = i, d.body = l, d.method = "POST", d;
	}
	async deserializeResponse(e, t, n) {
		let r = this.deserializer, i = b.of(e.output), a = {};
		if (this.isErrorResponse(n.statusCode)) {
			let i = await Ki(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!v(n.headers, e)) continue;
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = i.getEventStreamMember();
		if (o) a[o] = await this.deserializeEventStream({
			response: n,
			responseSchema: i,
			initialResponseContainer: a
		});
		else {
			let e = await Ki(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function _o(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
Je(), S();
var vo = class extends Ji {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	read(e, t) {
		let n = b.of(e);
		if (n.isListSchema()) return On(t).map((e) => this.read(n.getValueSchema(), e));
		if (n.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? _t)(t);
		if (n.isTimestampSchema()) switch (_o(n, this.settings)) {
			case 5: return Tn(t);
			case 6: return En(t);
			case 7: return wn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (n.isStringSchema()) {
			let e = n.getMergedTraits().mediaType, r = t;
			if (e) return n.getMergedTraits().httpHeader && (r = this.base64ToUtf8(r)), (e === "application/json" || e.endsWith("+json")) && (r = dn.from(r)), r;
		}
		return n.isNumericSchema() ? Number(t) : n.isBigIntegerSchema() ? BigInt(t) : n.isBigDecimalSchema() ? new jn(t, "bigDecimal") : n.isBooleanSchema() ? String(t).toLowerCase() === "true" : t;
	}
	base64ToUtf8(e) {
		return (this.serdeContext?.utf8Encoder ?? Tt)((this.serdeContext?.base64Decoder ?? _t)(e));
	}
}, yo = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), bo = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
y();
var xo = "content-length";
function So(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (ie.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(xo) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[xo]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var Co = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, wo = (e) => ({ applyToStack: (t) => {
	t.add(So(e.bodyLengthChecker), Co);
} }), To = (e) => encodeURIComponent(e).replace(/[!'()*]/g, Eo), Eo = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function Do(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = To(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${To(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${To(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/service-error-classification/constants.js
var Oo = [
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
], ko = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], Ao = [
	500,
	502,
	503,
	504
], jo = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], Mo = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], No = (e) => e?.$retryable !== void 0, Po = (e) => e.$metadata?.clockSkewCorrected, Fo = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, Io = (e) => e.$metadata?.httpStatusCode === 429 || Oo.includes(e.name) || e.$retryable?.throttling == 1, Lo = (e, t = 0) => e?.name !== "AbortError" && (No(e) || Po(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || ko.includes(e.name) || jo.includes(e?.code || "") || Mo.includes(e?.code || "") || Ao.includes(e.$metadata?.httpStatusCode || 0) || Fo(e) || zo(e) || e.cause !== void 0 && t <= 10 && Lo(e.cause, t + 1)), Ro = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !Lo(e);
	}
	return !1;
};
function zo(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var Bo = 2e4, Vo = "amz-sdk-invocation-id", Ho = "amz-sdk-request";
y(), se(), S();
function Uo(e, t) {
	if (oe.isInstance(e)) for (let n in e.headers) {
		if (!v(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (Zt(r).getTime() - Date.now()) / 1e3;
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
var Wo = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
ae(), S();
function Go(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (qo(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = ie.isInstance(d);
			for (f && (d.headers[Vo] = Wi());;) try {
				f && (d.headers[Ho] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = Jo(n, t.logger);
				if (c = Wo(n), f && e(d)) throw (r.logger instanceof dt ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await Ko(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var Ko = (e) => new Promise((t) => setTimeout(t, e)), qo = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, Jo = (e, t) => {
	let n = {
		error: e,
		errorType: Yo(e)
	}, r = Uo(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, Yo = (e) => Io(e) ? "THROTTLING" : Lo(e) ? "TRANSIENT" : Ro(e) ? "SERVER_ERROR" : "CLIENT_ERROR", Xo = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function Zo(e) {
	let t = Go(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), Xo);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var Qo = class e {
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
		if (n?.errorType === "THROTTLING" || Io(n?.error ?? e)) {
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
}, $o = class e {
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
}, es = class {
	x = $o.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, Bo);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, ts = class {
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
		return Math.min(Bo, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, ns;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(ns ||= {});
var rs = ns.STANDARD, is = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, as = class {
	mode = ns.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= $o.delay(), this.retryBackoffStrategy ??= new es();
	}
	async acquireInitialRetryToken(e) {
		return new ts($o.delay(), 0, void 0, $o.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? $o.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new ts(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = $o.v2026 && r === is.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : is.incompatible, a = r < n ? 0 : is.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : is.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === $o.modifiedCostType() ? $o.throttlingCost() : $o.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, os = class {
	mode = ns.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new Qo(), this.standardRetryStrategy = t ? new as({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new as(e);
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
me();
var ss = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = $o.delay() } = t ?? {}, o = pe(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await pe(r)() === ns.ADAPTIVE ? new os(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new as({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, cs = Zo(i);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
$o.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function ls(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
ae();
function us(e) {
	return e;
}
var ds = (e) => (t) => async (n) => {
	if (!ie.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, fs = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, ps = (e) => ({ applyToStack: (t) => {
	t.add(ds(e), fs);
} }), ms = () => (e, t) => async (n) => {
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
}, hs = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, gs = (e) => ({ applyToStack: (e) => {
	e.add(ms(), hs);
} }), _s = (e) => ({ applyToStack: (e) => {} }), vs = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
y();
function ys(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var bs = (e, t) => (n, r) => async (i) => {
	let a = vs(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = ys(e.httpAuthSchemes), s = ee(r), c = [];
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
}, xs = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, Ss = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(bs(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), xs);
} });
ae(), y();
var Cs = (e) => (e) => {
	throw e;
}, ws = (e, t) => {}, Ts = (e) => (e, t) => async (n) => {
	if (!ie.isInstance(n.request)) return e(n);
	let r = ee(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Cs)(i));
	return (o.successHandler || ws)(s.response, i), s;
}, Es = {
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
}, Ds = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Ts(e), Es);
} }), Os = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
y();
var ks = class {
	authSchemes = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t in e) {
			if (!v(e, t)) continue;
			let n = e[t];
			n !== void 0 && this.authSchemes.set(t, n);
		}
	}
	getIdentityProvider(e) {
		return this.authSchemes.get(e);
	}
}, As = ((e) => function(t) {
	return js(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), js = (e) => e.expiration !== void 0, Ms = (e, t, n) => {
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
function Ns(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Ps(e) {
	let t = Os(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!Ns(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var Fs = {
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
}, Is = "", Ls = (e) => {
	let { partitions: t } = Fs;
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
}, Rs = () => Is, zs = /\d{12}\.ddb/;
async function Bs(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && ls(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case ns.ADAPTIVE:
				ls(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case ns.STANDARD: ls(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(zs) && ls(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				ls(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				ls(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": ls(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && ls(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) ls(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Vs = "user-agent", Hs = "x-amz-user-agent", Us = /[^!$%&'*+\-.^_`|~\w]/g, Ws = /[^!$%&'*+\-.^_`|~\w#]/g, Gs = 1024;
function Ks(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= Gs) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
ae();
var qs = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!ie.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(Js) || [], s = (await e.defaultUserAgentProvider()).map(Js);
	await Bs(n, e, r);
	let c = n;
	s.push(`m/${Ks(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(Js) || [], u = await e.userAgentAppId();
	u && s.push(Js(["app", `${u}`]));
	let d = Rs(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Hs] = f : (p && (a[Hs] = a["x-amz-user-agent"] ? `${a[Vs]} ${p}` : p), a[Vs] = f), t({
		...r,
		request: i
	});
}, Js = (e) => {
	let t = e[0].split("/").map((e) => e.replace(Us, "-")).join("/"), n = e[1]?.replace(Ws, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, Ys = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, Xs = (e) => ({ applyToStack: (t) => {
	t.add(qs(e), Ys);
} }), Zs = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? Qs.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? Qs.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, Qs = {
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
Ni(), Jr();
var $s = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!$s(t)) return !1;
		return !0;
	}
	return !(!le(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || qr(e));
}, ec = ":", tc = "/", nc = (e) => {
	let t = e.split(ec);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(ec) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(tc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
Ni();
var rc = {
	isVirtualHostableS3Bucket: $s,
	parseArn: nc,
	partition: Ls
};
Ar.aws = rc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var ic = (e, t, n) => {
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
y();
var ac = /* @__PURE__ */ new Set(), oc = (e, t = le) => {
	if (!ac.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else ac.add(e);
}, sc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), cc = (e) => sc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, lc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = cc(typeof t == "function" ? await t() : t);
			return oc(e), e;
		},
		useFipsEndpoint: async () => sc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, uc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], dc = ({ defaultsMode: e } = {}) => ic(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(fc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${uc.join(", ")}, got ${t}`);
	}
}), fc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, pc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), mc = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
se();
var hc = (e) => oe.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, gc = (e) => oe.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, _c = (e) => new Date(Date.now() + e), vc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
ae(), _();
var yc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, bc = (e) => e.context?.[h]?.eventStream?.output === !0, xc = async (e) => {
	let t = yc("context", e.context), n = yc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await yc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, Sc = class {
	async sign(e, t, n) {
		if (!ie.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await xc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || bc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : _c(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? hc(n.$response);
				if (t) {
					let r = yc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = gc(n.$response), s = vc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = hc(e);
		if (n) {
			let r = yc("config", t.config), i = t._requestSentAt, a = gc(e);
			r.systemClockOffset = vc(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
S();
var Cc = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!v(e, n)) continue;
			let r = yt(n);
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
				let o = yt(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(Ec.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!Tc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Nn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, wc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(wc ||= {});
var Tc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Ec = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && Dc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && Dc(e), parseInt(Pn(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function Dc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var Oc = "X-Amz-Algorithm", kc = "X-Amz-Credential", Ac = "X-Amz-Date", jc = "X-Amz-SignedHeaders", Mc = "X-Amz-Expires", Nc = "X-Amz-Signature", Pc = "X-Amz-Security-Token", Fc = "authorization", Ic = Ac.toLowerCase(), Lc = [
	Fc,
	Ic,
	"date"
];
Nc.toLowerCase();
var Rc = "x-amz-content-sha256", zc = Pc.toLowerCase(), Bc = {
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
}, Vc = /^proxy-/, Hc = /^sec-/, Uc = "AWS4-HMAC-SHA256", Wc = "AWS4-HMAC-SHA256-PAYLOAD", Gc = "UNSIGNED-PAYLOAD", Kc = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
S();
var qc = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!v(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = To(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${To(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${To(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, Jc = (e) => Yc(e).toISOString().replace(/\.\d{3}Z$/, "Z"), Yc = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
me(), S();
var Xc = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = pe(n), this.credentialProvider = pe(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${qc(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(Vn(n)), `${r}
${e}
${t}
${Pn(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return To(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = Jc(e).replace(/[-:]/g, "");
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
S();
var Zc = {}, Qc = [], $c = (e, t, n) => `${e}/${t}/${n}/${Kc}`, el = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${Pn(await tl(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Zc) return Zc[a];
	for (Qc.push(a); Qc.length > 50;) delete Zc[Qc.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Kc
	]) o = await tl(e, o, t);
	return Zc[a] = o;
}, tl = (e, t, n) => {
	let r = new e(t);
	return r.update(Vn(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
S();
var nl = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(v(Bc, a) || t?.has(a) || Vc.test(a) || Hc.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Bi(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
S();
var rl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (v(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Gn(t)) {
		let e = new n();
		return e.update(Vn(t)), Pn(await e.digest());
	}
	return Gc;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
S();
var il = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (v(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
S(), ae();
var al = (e, t = {}) => {
	let { headers: n, query: r = {} } = ie.clone(e);
	for (let e in n) {
		if (!v(n, e)) continue;
		let i = e.toLowerCase();
		(i.slice(0, 6) === "x-amz-" && !t.unhoistableHeaders?.has(i) || t.hoistableHeaders?.has(i)) && (r[e] = n[e], delete n[e]);
	}
	return {
		...e,
		headers: n,
		query: r
	};
};
S(), ae();
var ol = (e) => {
	e = ie.clone(e);
	for (let t in e.headers) v(e.headers, t) && Lc.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
S();
var sl = class extends Xc {
	headerFormatter = new Cc();
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
		let m = $c(p, d, l ?? this.service), h = al(ol(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[Pc] = u.sessionToken), h.query[Oc] = Uc, h.query[kc] = `${u.accessKeyId}/${m}`, h.query[Ac] = f, h.query[Mc] = r.toString(10);
		let g = nl(h, i, o);
		return h.query[jc] = this.getCanonicalHeaderList(g), h.query[Nc] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await rl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = $c(c, s, a ?? this.service), d = await rl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Wc,
			l,
			u,
			r,
			Pn(await f.digest()),
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
		return c.update(Vn(e)), Pn(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = ol(e), { longDate: l, shortDate: u } = this.formatDate(t), d = $c(u, s, a ?? this.service);
		c.headers[Ic] = l, o.sessionToken && (c.headers[zc] = o.sessionToken);
		let f = await rl(c, this.sha256);
		!il("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[Rc] = f);
		let p = nl(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[Fc] = `${Uc} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, Uc), a = new this.sha256(await n);
		return a.update(Vn(i)), Pn(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return el(this.sha256, e, n, t, r || this.service);
	}
}, cl = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = ul(t, ll(t, {
				credentials: n,
				credentialDefaultProvider: t.credentialDefaultProvider
			}));
			if (i && !o.attributed) {
				let e = typeof n == "object" && !!n;
				a = async (t) => {
					let n = await o(t);
					return e && (!n.$source || Object.keys(n.$source).length === 0) ? r(n, "CREDENTIALS_CODE", "e") : n;
				}, a.memoized = o.memoized, a.configBound = o.configBound, a.attributed = !0;
			} else a = o;
		},
		get() {
			return a;
		},
		enumerable: !0,
		configurable: !0
	}), t.credentials = n;
	let { signingEscapePath: o = !0, systemClockOffset: s = t.systemClockOffset || 0, sha256: c } = t, l;
	return l = t.signer ? Os(t.signer) : t.regionInfoProvider ? () => Os(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
		useFipsEndpoint: await t.useFipsEndpoint(),
		useDualstackEndpoint: await t.useDualstackEndpoint()
	}) || {}, e]).then(([e, n]) => {
		let { signingRegion: r, signingService: i } = e;
		t.signingRegion = t.signingRegion || r || n, t.signingName = t.signingName || i || t.serviceId;
		let a = {
			...t,
			credentials: t.credentials,
			region: t.signingRegion,
			service: t.signingName,
			sha256: c,
			uriEscapePath: o
		};
		return new (t.signerConstructor || sl)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await Os(t.region)(),
			properties: {}
		}, e);
		let n = e.signingRegion, r = e.signingName;
		t.signingRegion = t.signingRegion || n, t.signingName = t.signingName || r || t.serviceId;
		let i = {
			...t,
			credentials: t.credentials,
			region: t.signingRegion,
			service: t.signingName,
			sha256: c,
			uriEscapePath: o
		};
		return new (t.signerConstructor || sl)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: Os(t.disableClockSkewCorrection ?? e)
	});
};
function ll(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Ms(t, As, js) : n ? Os(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function ul(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var dl = cl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/auth/httpAuthSchemeProvider.js
te(), me();
var fl = async (e, t, n) => ({
	operation: ee(t).operation,
	region: await pe(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function pl(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "ec2",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var ml = (e) => {
	let t = [];
	return e.operation, t.push(pl(e)), t;
}, hl = (e) => {
	let t = dl(e);
	return Object.assign(t, { authSchemePreference: pe(e.authSchemePreference ?? []) });
}, gl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "ec2"
}), _l = {
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
}, vl = {
	name: "@aws-sdk/client-ec2",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Ec2 Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ec2",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-ec2"
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
		"test:index": "tsc -p tsconfig.test.json && node ./test/index-objects.spec.mjs"
	},
	dependencies: {
		"@aws-sdk/core": "^3.978.5",
		"@aws-sdk/credential-provider-node": "^3.972.88",
		"@aws-sdk/middleware-sdk-ec2": "^3.972.64",
		"@aws-sdk/types": "^3.975.0",
		"@smithy/core": "^3.36.1",
		"@smithy/fetch-http-handler": "^5.8.0",
		"@smithy/node-http-handler": "^4.12.1",
		"@smithy/types": "^4.19.0",
		tslib: "^2.6.2"
	},
	devDependencies: {
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
function yl(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function bl(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
se();
var xl = { supported: void 0 }, Sl = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), xl.supported === void 0 && (xl.supported = typeof Request < "u" && "keepalive" in yl("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = Cl(t);
			return Promise.reject(e);
		}
		let s = e.path, c = Do(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), xl.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(yl(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new oe({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new oe({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), bl(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(Cl(t));
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
function Cl(e) {
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
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ProtocolLib.js
Je();
var wl = class {
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
		let i = Ke.for(r), a = Ke.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = tt(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return tt(e, t);
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
			return e.find((e) => b.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
}, Tl;
function El(e) {
	Tl ||= new DOMParser();
	let t = Tl.parseFromString(e, "application/xml");
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
var Dl = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Ol = class {
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
function kl(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
Je(), S();
var Al = class extends Dl {
	settings;
	stringDeserializer;
	constructor(e) {
		super(), this.settings = e, this.stringDeserializer = new vo(e);
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.stringDeserializer.setSerdeContext(e);
	}
	read(e, t, n) {
		let r = b.of(e), i = r.getMemberSchemas();
		if (r.isStructSchema() && r.isMemberSchema() && Object.values(i).find((e) => !!e.getMemberTraits().eventPayload)) {
			let e = {}, n = Object.keys(i)[0];
			return e[n] = i[n].isBlobSchema() ? t : this.read(i[n], t), e;
		}
		let a = (this.serdeContext?.utf8Encoder ?? Tt)(t), o = this.parseXml(a);
		return this.readSchema(e, n ? o[n] : o);
	}
	readSchema(e, t) {
		let n = b.of(e);
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
					t === "__proto__" && kl(i), i[t] = this.readSchema(a, n);
				}
				return i;
			}
			if (n.isStructSchema()) {
				let e = n.isUnionSchema(), r;
				e && (r = new Ol(t, i));
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
				t = El(e);
			} catch (t) {
				throw t && typeof t == "object" && Object.defineProperty(t, "$responseBodyText", { value: e }), t;
			}
			let n = "#text", r = Object.keys(t)[0], i = t[r];
			return i[n] && (i[r] = i[n], delete i[n]), ut(i);
		}
		return {};
	}
};
Je(), S();
var jl = class extends Dl {
	settings;
	buffer;
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t, n = "") {
		this.buffer === void 0 && (this.buffer = "");
		let r = b.of(e);
		if (n && !n.endsWith(".") && (n += "."), r.isBlobSchema()) (typeof t == "string" || t instanceof Uint8Array) && (this.writeKey(n), this.writeValue((this.serdeContext?.base64Encoder ?? xt)(t)));
		else if (r.isBooleanSchema() || r.isNumericSchema() || r.isStringSchema()) t == null ? r.isIdempotencyToken() && (this.writeKey(n), this.writeValue(Gi())) : (this.writeKey(n), this.writeValue(String(t)));
		else if (r.isBigIntegerSchema()) t != null && (this.writeKey(n), this.writeValue(String(t)));
		else if (r.isBigDecimalSchema()) t != null && (this.writeKey(n), this.writeValue(t instanceof jn ? t.string : String(t)));
		else if (r.isTimestampSchema()) {
			if (t instanceof Date) switch (this.writeKey(n), _o(r, this.settings)) {
				case 5:
					this.writeValue(t.toISOString().replace(".000Z", "Z"));
					break;
				case 6:
					this.writeValue(Gt(t));
					break;
				case 7: this.writeValue(String(t.getTime() / 1e3));
			}
		} else if (r.isDocumentSchema()) Array.isArray(t) ? this.write(79, t, n) : t instanceof Date ? this.write(4, t, n) : t instanceof Uint8Array ? this.write(21, t, n) : t && typeof t == "object" ? this.write(143, t, n) : (this.writeKey(n), this.writeValue(String(t)));
		else if (r.isListSchema()) {
			if (Array.isArray(t)) {
				if (t.length === 0) this.settings.serializeEmptyLists && (this.writeKey(n), this.writeValue(""));
				else {
					let e = r.getValueSchema(), i = this.settings.flattenLists || r.getMergedTraits().xmlFlattened, a = 1;
					for (let r of t) {
						if (r == null) continue;
						let t = e.getMergedTraits(), o = this.getKey("member", t.xmlName, t.ec2QueryName), s = i ? `${n}${a}` : `${n}${o}.${a}`;
						this.write(e, r, s), ++a;
					}
				}
			}
		} else if (r.isMapSchema()) {
			if (t && typeof t == "object") {
				let e = r.getKeySchema(), i = r.getValueSchema(), a = r.getMergedTraits().xmlFlattened, o = 1;
				for (let r in t) {
					let s = t[r];
					if (s == null) continue;
					let c = e.getMergedTraits(), l = this.getKey("key", c.xmlName, c.ec2QueryName), u = a ? `${n}${o}.${l}` : `${n}entry.${o}.${l}`, d = i.getMergedTraits(), f = this.getKey("value", d.xmlName, d.ec2QueryName), p = a ? `${n}${o}.${f}` : `${n}entry.${o}.${f}`;
					this.write(e, r, u), this.write(i, s, p), ++o;
				}
			}
		} else if (r.isStructSchema()) {
			if (t && typeof t == "object") {
				let e = !1;
				for (let [i, a] of r.structIterator()) {
					if (t[i] == null && !a.isIdempotencyToken()) continue;
					let r = a.getMergedTraits(), o = this.getKey(i, r.xmlName, r.ec2QueryName, "struct"), s = `${n}${o}`;
					this.write(a, t[i], s), e = !0;
				}
				if (!e && r.isUnionSchema()) {
					let { $unknown: e } = t;
					if (Array.isArray(e)) {
						let [t, r] = e, i = `${n}${t}`;
						this.write(15, r, i);
					}
				}
			}
		} else if (!r.isUnitSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${r.getName(!0)}`);
	}
	flush() {
		if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
		let e = this.buffer;
		return delete this.buffer, e;
	}
	getKey(e, t, n, r) {
		let { ec2: i, capitalizeKeys: a } = this.settings;
		if (i && n) return n;
		let o = t ?? e;
		return a && r === "struct" ? o[0].toUpperCase() + o.slice(1) : o;
	}
	writeKey(e) {
		e.endsWith(".") && (e = e.slice(0, e.length - 1)), this.buffer += `&${qi(e)}=`;
	}
	writeValue(e) {
		this.buffer += qi(e);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/query/AwsQueryProtocol.js
Je();
var Ml = class extends go {
	options;
	serializer;
	deserializer;
	mixin = new wl();
	constructor(e) {
		super({
			defaultNamespace: e.defaultNamespace,
			errorTypeRegistries: e.errorTypeRegistries
		}), this.options = e;
		let t = {
			timestampFormat: {
				useTrait: !0,
				default: 5
			},
			httpBindings: !1,
			xmlNamespace: e.xmlNamespace,
			serviceNamespace: e.defaultNamespace,
			serializeEmptyLists: !0
		};
		this.serializer = new jl(t), this.deserializer = new Al(t);
	}
	getShapeId() {
		return "aws.protocols#awsQuery";
	}
	setSerdeContext(e) {
		this.serializer.setSerdeContext(e), this.deserializer.setSerdeContext(e);
	}
	getPayloadCodec() {
		throw Error("AWSQuery protocol has no payload codec.");
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = "application/x-www-form-urlencoded", Ce(e.input) !== "unit" && r.body || (r.body = ""), r.body = `Action=${e.name.split("#")[1] ?? e.name}&Version=${this.options.version}` + r.body, r.body.endsWith("&") && (r.body = r.body.slice(-1)), r;
	}
	async deserializeResponse(e, t, n) {
		let r = this.deserializer, i = b.of(e.output), a = {};
		if (n.statusCode >= 300) {
			let i = await Ki(n.body, t);
			i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n));
		}
		for (let e in n.headers) {
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = e.name.split("#")[1] ?? e.name, s = i.isStructSchema() && this.useNestedResult() ? o + "Result" : void 0, c = await Ki(n.body, t);
		return c.byteLength > 0 && Object.assign(a, await r.read(i, c, s)), a.$metadata = this.deserializeMetadata(n), a;
	}
	useNestedResult() {
		return !0;
	}
	async handleError(e, t, n, r, i) {
		let a = this.loadQueryErrorCode(n, r) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, a, this.options.defaultNamespace);
		let o = this.loadQueryError(r) ?? {}, s = this.loadQueryErrorMessage(r);
		o.message = s, o.Error = {
			Type: o.Type,
			Code: o.Code,
			Message: s
		};
		let { errorSchema: c, errorMetadata: l } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, o, i, this.mixin.findQueryCompatibleError), u = b.of(c), d = new ((this.compositeErrorRegistry.getErrorCtor(c)) ?? Error)({}), f = {
			Type: o.Error.Type,
			Code: o.Error.Code,
			Error: o.Error
		};
		for (let [e, t] of u.structIterator()) {
			let n = t.getMergedTraits().xmlName ?? e, i = o[n] ?? r[n];
			f[e] = this.deserializer.readSchema(t, i);
		}
		throw this.mixin.decorateServiceException(Object.assign(d, l, {
			$fault: u.getMergedTraits().error,
			message: s
		}, f), r);
	}
	loadQueryErrorCode(e, t) {
		let n = (t.Errors?.[0]?.Error ?? t.Errors?.Error ?? t.Error)?.Code;
		if (n !== void 0) return n;
		if (e.statusCode == 404) return "NotFound";
	}
	loadQueryError(e) {
		return e.Errors?.[0]?.Error ?? e.Errors?.Error ?? e.Error;
	}
	loadQueryErrorMessage(e) {
		let t = this.loadQueryError(e);
		return t?.message ?? t?.Message ?? e.message ?? e.Message ?? "Unknown";
	}
	getDefaultContentType() {
		return "application/x-www-form-urlencoded";
	}
}, Nl = class extends Ml {
	options;
	constructor(e) {
		super(e), this.options = e, Object.assign(this.serializer.settings, {
			capitalizeKeys: !0,
			flattenLists: !0,
			serializeEmptyLists: !1,
			ec2: !0
		});
	}
	getShapeId() {
		return "aws.protocols#ec2Query";
	}
	useNestedResult() {
		return !1;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/endpoint/bdd.js
Ni();
var Pl = "ref", Fl = -1, Il = !0, Ll = "isSet", Rl = "PartitionResult", zl = "booleanEquals", Bl = "getAttr", Vl = { [Pl]: "Endpoint" }, Hl = { [Pl]: Rl }, Ul = {}, Wl = [{ [Pl]: "Region" }], Gl = {
	conditions: [
		[Ll, [Vl]],
		[Ll, Wl],
		[
			"aws.partition",
			Wl,
			Rl
		],
		[zl, [{ [Pl]: "UseFIPS" }, Il]],
		[zl, [{ [Pl]: "UseDualStack" }, Il]],
		[zl, [{
			fn: Bl,
			argv: [Hl, "supportsDualStack"]
		}, Il]],
		[zl, [{
			fn: Bl,
			argv: [Hl, "supportsFIPS"]
		}, Il]],
		["stringEquals", [{
			fn: Bl,
			argv: [Hl, "name"]
		}, "aws-us-gov"]]
	],
	results: [
		[Fl],
		[Fl, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Fl, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[Vl, Ul],
		["https://ec2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Ul],
		[Fl, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://ec2.{Region}.amazonaws.com", Ul],
		["https://ec2-fips.{Region}.{PartitionResult#dnsSuffix}", Ul],
		[Fl, "FIPS is enabled but this partition does not support FIPS"],
		["https://ec2.{Region}.{PartitionResult#dualStackDnsSuffix}", Ul],
		[Fl, "DualStack is enabled but this partition does not support DualStack"],
		["https://ec2.{Region}.{PartitionResult#dnsSuffix}", Ul],
		[Fl, "Invalid Configuration: Missing Region"]
	]
}, Kl = 2, ql = new Int32Array([
	-1,
	1,
	-1,
	0,
	13,
	3,
	1,
	4,
	100000012,
	2,
	5,
	100000012,
	3,
	8,
	6,
	4,
	7,
	100000011,
	5,
	100000009,
	100000010,
	4,
	11,
	9,
	6,
	10,
	100000008,
	7,
	100000006,
	100000007,
	5,
	12,
	100000005,
	6,
	100000004,
	100000005,
	3,
	100000001,
	14,
	4,
	100000002,
	100000003
]), Jl = vr.from(ql, Kl, Gl.conditions, Gl.results);
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/endpoint/endpointResolver.js
Ni();
var Yl = new br({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), Xl = (e, t = {}) => Yl.get(e, () => ki(Jl, {
	endpointParams: e,
	logger: t.logger
}));
Ar.aws = rc;
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/models/EC2ServiceException.js
var Zl = class e extends et {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.ec2#EC2ServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/schemas/schemas_0.js
Je();
var Ql = "Address", $l = "AllocateAddressRequest", eu = "AllocateAddressResult", tu = "AssociateAddressRequest", nu = "AssociateAddressResult", ru = "AllAvailabilityZones", iu = "AllocateAddress", au = "ApplianceArn", ou = "AssociateAddress", su = "AttachedAppliances", cu = "AttributeBooleanValue", lu = "AssociateCarrierIpAddress", uu = "AdditionalFlexibleNetworkInterfaces", du = "AvailableIpAddressCount", fu = "AssignIpv6AddressOnCreation", pu = "AttachInternetGateway", mu = "AttachInternetGatewayRequest", hu = "AllocationIdList", gu = "AdditionalInfo", _u = "AllocationId", vu = "AllocationIds", yu = "AssociationId", bu = "AttachmentId", xu = "AmiLaunchIndex", Su = "AttachmentLimitType", Cu = "AddressList", wu = "AvailabilityMode", Tu = "AssociatePublicIpAddress", Eu = "AmazonProvidedIpv6CidrBlock", Du = "AutoProvisionZones", Ou = "AutoRecoverySupported", ku = "AssociateRouteTableRequest", Au = "AssociateRouteTableResult", ju = "AssociateRouteTable", Mu = "AllowReassociation", Nu = "AssociatedResource", Pu = "AutoRecovery", Fu = "AuthorizeSecurityGroupEgress", Iu = "AuthorizeSecurityGroupEgressRequest", Lu = "AuthorizeSecurityGroupEgressResult", Ru = "AuthorizeSecurityGroupIngressRequest", zu = "AuthorizeSecurityGroupIngressResult", Bu = "AuthorizeSecurityGroupIngress", Vu = "AutoScalingIps", Hu = "AmdSevSnp", Uu = "AssociationState", Wu = "AttachmentState", Gu = "ArchitectureTypeList", Ku = "AttachTime", qu = "AvailabilityZone", Ju = "AvailabilityZoneAddress", Yu = "AvailabilityZoneAddresses", Xu = "AvailabilityZoneGeography", Zu = "AvailabilityZoneGeographyList", Qu = "AvailabilityZoneId", $u = "AvailabilityZoneList", ed = "AvailabilityZoneMessage", td = "AvailabilityZoneMessageList", nd = "AvailabilityZoneSubGeography", rd = "AvailabilityZoneSubGeographyList", id = "AvailabilityZones", ad = "Accelerators", od = "Addresses", sd = "Affinity", cd = "Arn", ld = "Architecture", ud = "Associations", dd = "Association", fd = "Attribute", pd = "Attachment", md = "Attachments", hd = "BaselineBandwidthInGbps", gd = "BaselineBandwidthInMbps", _d = "BlockDeviceMapping", vd = "BlockDeviceMappingList", yd = "BlockDeviceMappingRequestList", bd = "BlockDeviceMappings", xd = "BlockDurationMinutes", Sd = "BaselineIops", Cd = "BootMode", wd = "BootModeOverride", Td = "BootModeTypeList", Ed = "BareMetal", Dd = "BlockPublicAccessStates", Od = "BurstablePerformanceSupported", kd = "BaselineThroughputInMBps", Ad = "BandwidthWeighting", jd = "BandwidthWeightingTypeList", Md = "BandwidthWeightings", Nd = "CidrBlock", Pd = "CidrBlockAssociationSet", Fd = "CapacityBlockId", Id = "CidrBlockState", Ld = "CoreCountList", Rd = "CoreCount", zd = "CpuCredits", Bd = "CreationDate", Vd = "CarrierGatewayId", Hd = "CurrentGeneration", Ud = "CarrierIp", Wd = "CurrentInstanceBootMode", Gd = "CreateInternetGateway", Kd = "CreateInternetGatewayRequest", qd = "CreateInternetGatewayResult", Jd = "CreateImageRequest", Yd = "CreateImageResult", Xd = "CidrIp", Zd = "CidrIpv6", Qd = "CidrIpv4", $d = "CoreInfo", ef = "CreateImage", tf = "CreateKeyPair", nf = "CreateKeyPairRequest", rf = "CoreNetworkArn", af = "CreateNatGateway", of = "CreateNatGatewayRequest", sf = "CreateNatGatewayResult", cf = "CpuOptions", lf = "CustomerOwnedIp", uf = "CustomerOwnedIpv4Pool", df = "CpuOptionsRequest", ff = "CapacityReservationId", pf = "CapacityReservationPreference", mf = "CreateRouteRequest", hf = "CapacityReservationResourceGroupArn", gf = "CreateRouteResult", _f = "CapacityReservationSpecificationResponse", vf = "CapacityReservationSpecification", yf = "CapacityReservationTarget", bf = "CapacityReservationTargetResponse", xf = "CreateRouteTableRequest", Sf = "CreateRouteTableResult", Cf = "CreateRouteTable", wf = "CreateRoute", Tf = "CreateSecurityGroup", Ef = "CreateSecurityGroupRequest", Df = "CreateSecurityGroupResult", Of = "CreateSubnetRequest", kf = "CreateSubnetResult", Af = "CreditSpecificationRequest", jf = "CreditSpecification", Mf = "CreateSubnet", Nf = "CurrentState", Pf = "ClientToken", Ff = "ConnectionTrackingConfiguration", If = "CreateTagsRequest", Lf = "ConnectionTrackingSpecification", Rf = "ConnectionTrackingSpecificationRequest", zf = "ConnectionTrackingSpecificationResponse", Bf = "ConnectivityType", Vf = "CreateTime", Hf = "CreateTags", Uf = "CreateVpcRequest", Wf = "CreateVpcResult", Gf = "CreateVpc", Kf = "Code", qf = "Configured", Jf = "Count", Yf = "DescribeAddressesRequest", Xf = "DescribeAddressesResult", Zf = "DisassociateAddressRequest", Qf = "DeleteAssociatedSnapshots", $f = "DisableApiStop", ep = "DisableApiTermination", tp = "DescribeAvailabilityZonesRequest", np = "DescribeAvailabilityZonesResult", rp = "DescribeAvailabilityZones", ip = "DescribeAddresses", ap = "DisassociateAddress", op = "DestinationCidrBlock", sp = "DefaultConnectionTrackingConfiguration", cp = "DefaultCores", lp = "DefaultEnaQueueCountPerInterface", up = "DefaultForAz", dp = "DedicatedHostsSupported", fp = "DeviceIndex", pp = "DestinationIpv6CidrBlock", mp = "DeleteInternetGateway", hp = "DeleteInternetGatewayRequest", gp = "DescribeInternetGatewaysRequest", _p = "DescribeInternetGatewaysResult", vp = "DetachInternetGatewayRequest", yp = "DescribeInternetGateways", bp = "DetachInternetGateway", xp = "DiskInfoList", Sp = "DeregisterImageRequest", Cp = "DeregisterImageResult", wp = "DescribeImagesRequest", Tp = "DescribeImagesResult", Ep = "DescribeInstancesRequest", Dp = "DescribeInstancesResult", Op = "DescribeInstanceTypesRequest", kp = "DescribeInstanceTypesResult", Ap = "DescribeInstanceTypes", jp = "DeregisterImage", Mp = "DescribeImages", Np = "DescribeInstances", Pp = "DiskInfo", Fp = "DeleteKeyPair", Ip = "DeleteKeyPairRequest", Lp = "DeleteKeyPairResult", Rp = "DescribeKeyPairsRequest", zp = "DescribeKeyPairsResult", Bp = "DescribeKeyPairs", Vp = "DisableLniAtDeviceIndex", Hp = "DeviceName", Up = "DefaultNetworkCardIndex", Wp = "DeleteNatGateway", Gp = "DeleteNatGatewayRequest", Kp = "DeleteNatGatewayResult", qp = "DescribeNatGatewaysRequest", Jp = "DescribeNatGatewaysResult", Yp = "DescribeNatGateways", Xp = "DhcpOptionsId", Zp = "DeleteOnTermination", Qp = "DestinationPrefixListId", $p = "DeregistrationProtection", C = "DryRun", em = "DeleteRouteRequest", tm = "DeleteRouteTable", nm = "DeleteRouteTableRequest", rm = "DescribeRouteTablesRequest", im = "DescribeRouteTablesResult", am = "DisassociateRouteTableRequest", om = "DescribeRouteTables", sm = "DisassociateRouteTable", cm = "DeleteRoute", lm = "DeleteSecurityGroup", um = "DeleteSecurityGroupRequest", dm = "DeleteSecurityGroupResult", fm = "DescribeSecurityGroupsRequest", pm = "DescribeSecurityGroupsResult", mm = "DescribeSecurityGroups", hm = "DeleteSnapshotReturnCode", gm = "DeleteSnapshotResultSet", _m = "DeleteSubnetRequest", vm = "DeleteSnapshotResults", ym = "DescribeSubnetsRequest", bm = "DescribeSubnetsResult", xm = "DeleteSubnet", Sm = "DescribeSubnets", Cm = "DefaultTcpEstablishedTimeout", wm = "DefaultThreadsPerCore", Tm = "DeleteTagsRequest", Em = "DeprecationTime", Dm = "DeleteTime", Om = "DeleteTags", km = "DefaultUdpStreamTimeout", Am = "DefaultUdpTimeout", jm = "DescribeVpcAttributeRequest", Mm = "DescribeVpcAttributeResult", Nm = "DescribeVpcAttribute", Pm = "DefaultVCpus", Fm = "DeleteVpcRequest", Im = "DescribeVpcsRequest", Lm = "DescribeVpcsResult", Rm = "DeleteVpc", zm = "DescribeVpcs", Bm = "Description", Vm = "Disks", Hm = "Domain", Um = "EbsBlockDevice", Wm = "ExecutableByStringList", Gm = "ExecutableBy", Km = "EbsCardIndex", qm = "EbsCardInfoList", Jm = "EbsCardInfo", Ym = "EbsCards", Xm = "EncryptionControl", Zm = "EnableDnsHostnames", Qm = "EnableDnsSupport", $m = "EnableDns64", eh = "ElasticFileSystem", th = "ElasticFileSystemExclusion", nh = "ElasticGpuAssociation", rh = "ElasticGpuAssociationId", ih = "ElasticGpuAssociationList", ah = "ElasticGpuAssociationState", oh = "ElasticGpuAssociationTime", sh = "ElasticGpuAssociations", ch = "ElasticGpuId", lh = "ElasticGpuSpecification", uh = "ElasticGpuSpecifications", dh = "ElasticInferenceAccelerator", fh = "ElasticInferenceAcceleratorAssociation", ph = "ElasticInferenceAcceleratorAssociationId", mh = "ElasticInferenceAcceleratorAssociationList", hh = "ElasticInferenceAcceleratorAssociationState", gh = "ElasticInferenceAcceleratorAssociationTime", _h = "ElasticInferenceAcceleratorArn", vh = "ElasticInferenceAcceleratorAssociations", yh = "ElasticInferenceAccelerators", bh = "EbsInstanceBlockDevice", xh = "EncryptionInTransitSupported", Sh = "EbsInfo", Ch = "EfaInfo", wh = "EnableLniAtDeviceIndex", Th = "EnableNetworkAddressUsageMetrics", Eh = "EbsOptimized", Dh = "EbsOptimizedInfo", Oh = "EgressOnlyInternetGateway", kh = "EgressOnlyInternetGatewayExclusion", Ah = "EgressOnlyInternetGatewayId", jh = "EnclaveOptionsRequest", Mh = "EbsOptimizedSupport", Nh = "EnclaveOptions", Ph = "EnablePrimaryIpv6", Fh = "EnaQueueCount", Ih = "EnableResourceNameDnsAAAARecord", Lh = "EnableResourceNameDnsAAAARecordOnLaunch", Rh = "EnableResourceNameDnsARecord", zh = "EnableResourceNameDnsARecordOnLaunch", Bh = "EnaSrdEnabled", Vh = "EnaSrdSpecification", Hh = "EnaSrdSpecificationRequest", Uh = "EnaSrdSupported", Wh = "EnaSrdUdpEnabled", Gh = "EnaSrdUdpSpecification", Kh = "EnaSrdUdpSpecificationRequest", qh = "EfaSupported", Jh = "EncryptionSupport", Yh = "EnaSupport", Xh = "ExecutableUsers", Zh = "Ebs", Qh = "Enabled", $h = "Encrypted", eg = "Force", tg = "FailureCode", ng = "FpgaDeviceInfo", rg = "FpgaDeviceInfoList", ig = "FpgaDeviceMemoryInfo", ag = "FlexibleEnaQueuesSupport", og = "FpgaInfo", sg = "FilterList", cg = "FailureMessage", lg = "FromPort", ug = "FreeTierEligible", dg = "Filters", fg = "Filter", pg = "Fpgas", mg = "Groups", hg = "GetConsoleOutput", gg = "GetConsoleOutputRequest", _g = "GetConsoleOutputResult", vg = "GroupDescription", yg = "GpuDeviceInfo", bg = "GpuDeviceInfoList", xg = "GpuDeviceMemoryInfo", Sg = "GatewayId", Cg = "GroupIdentifierList", wg = "GroupIdStringList", Tg = "GpuInfo", w = "GroupId", Eg = "GroupIds", Dg = "GroupIdentifier", Og = "GroupLongName", kg = "GroupName", Ag = "GroupNameStringList", jg = "GroupNames", Mg = "GroupOwnerId", Ng = "GpuPartitionSize", Pg = "Geography", Fg = "Gpus", Ig = "HiddenByDefault", Lg = "HttpEndpoint", Rg = "HostId", zg = "HibernationOptions", Bg = "HibernationOptionsRequest", Vg = "HttpProtocolIpv6", Hg = "HttpPutResponseHopLimit", Ug = "HostResourceGroupArn", Wg = "HibernationSupported", Gg = "HttpTokens", Kg = "HostnameType", qg = "Hibernate", Jg = "Hypervisor", Yg = "Id", Xg = "Ipv6Addresses", Zg = "Ipv6AddressAttribute", Qg = "Ipv6AddressCount", $g = "InstanceAttachmentEnaSrdSpecification", e_ = "InstanceAttachmentEnaSrdUdpSpecification", t_ = "InferenceAcceleratorInfo", n_ = "Ipv4AddressesPerInterface", r_ = "Ipv6AddressesPerInterface", i_ = "Ipv4AddressesPerSecondaryInterface", a_ = "ImageAllowed", o_ = "IpAddress", s_ = "Ipv6Address", c_ = "InstanceBlockDeviceMapping", l_ = "InstanceBlockDeviceMappingList", u_ = "Ipv6CidrBlock", d_ = "Ipv6CidrBlockAssociationSet", f_ = "Ipv6CidrBlockNetworkBorderGroup", p_ = "Ipv6CidrBlockState", m_ = "IncludeDeprecated", h_ = "InferenceDeviceInfo", g_ = "InferenceDeviceInfoList", __ = "InferenceDeviceMemoryInfo", v_ = "IncludeDisabled", y_ = "IsDefault", b_ = "IsEgress", x_ = "InternetGateway", S_ = "InternetGatewayAttachment", C_ = "InternetGatewayAttachmentList", w_ = "InternetGatewayBlockMode", T_ = "InternetGatewayExclusion", E_ = "InternetGatewayId", D_ = "InternetGatewayIdList", O_ = "InternetGatewayIds", k_ = "InternetGatewayList", A_ = "InternetGateways", j_ = "InstanceId", M_ = "InstanceIpv6Address", N_ = "InstanceIpv6AddressList", P_ = "InstanceInterruptionBehavior", F_ = "IamInstanceProfile", I_ = "Ipv6IpamPoolId", L_ = "Ipv4IpamPoolId", R_ = "InstanceIpv4PrefixList", z_ = "InstanceIpv6PrefixList", B_ = "IamInstanceProfileSpecification", V_ = "InstanceIpv4Prefix", H_ = "InstanceIpv6Prefix", U_ = "InstanceInitiatedShutdownBehavior", W_ = "ImageIdStringList", G_ = "InstanceIdStringList", K_ = "ImageId", q_ = "ImageIds", J_ = "InstanceIds", Y_ = "ImageLocation", X_ = "ImageList", Z_ = "InstanceLifecycle", Q_ = "InstanceList", $_ = "IpList", ev = "InstanceMaintenanceOptions", tv = "InstanceMaintenanceOptionsRequest", nv = "InstanceMarketOptionsRequest", rv = "InstanceMetadataOptionsRequest", iv = "InstanceMetadataOptionsResponse", av = "InstanceMarketOptions", ov = "IncludeManagedResources", sv = "InstanceMetadataTags", cv = "Ipv6Native", lv = "InstanceNetworkInterface", uv = "InstanceNetworkInterfaceAssociation", dv = "InstanceNetworkInterfaceAttachment", fv = "InstanceNetworkInterfaceList", pv = "InstanceNetworkInterfaceSpecification", mv = "InstanceNetworkInterfaceSpecificationList", hv = "Ipv6NetmaskLength", gv = "Ipv4NetmaskLength", _v = "InstanceNetworkPerformanceOptions", vv = "InstanceNetworkPerformanceOptionsRequest", yv = "ImageOwnerAlias", bv = "IpOwnerId", xv = "InstanceOwnerId", Sv = "Ipv6PrefixCount", Cv = "Ipv4PrefixCount", wv = "IpPermissionsEgress", Tv = "IpamPoolId", Ev = "InstancePrivateIpAddress", Dv = "InstancePrivateIpAddressList", Ov = "IsPrimaryIpv6", kv = "IncludePublicKey", Av = "IpPermissionList", jv = "Ipv4PrefixList", Mv = "Ipv6PrefixList", Nv = "Ipv4PrefixSpecificationRequest", Pv = "Ipv6PrefixSpecificationRequest", Fv = "Ipv6Prefixes", Iv = "IpPermissions", Lv = "IpPermission", Rv = "IpProtocol", zv = "Ipv6Prefix", Bv = "Ipv6Pool", Vv = "Ipv4Prefixes", Hv = "Ipv4Prefix", Uv = "IsPrimary", Wv = "IpRangeList", Gv = "Ipv6RangeList", Kv = "IpRanges", qv = "IpRange", Jv = "Ipv6Ranges", Yv = "Ipv6Range", Xv = "InstanceStateChange", Zv = "InstanceStateChangeList", Qv = "InstanceSecondaryInterfaceAttachment", $v = "InstanceSecondaryInterfaceList", ey = "InstanceSecondaryInterfacePrivateIpAddress", ty = "InstanceSecondaryInterfacePrivateIpAddressList", ny = "InstanceSecondaryInterfacePrivateIpAddressListRequest", ry = "InstanceSecondaryInterfacePrivateIpAddressRequest", iy = "InstanceSecondaryInterfaceSpecificationListRequest", ay = "InstanceSecondaryInterfaceSpecificationRequest", oy = "InstanceSecondaryInterface", sy = "InstanceStorageInfo", cy = "InstanceStorageSupported", ly = "ImdsSupport", uy = "InstanceState", dy = "IpSource", fy = "Ipv6Supported", py = "InstanceType", my = "InstanceTypeInfoList", hy = "InstanceTypeInfo", gy = "InstanceTypeItem", _y = "InstanceTypeSpecification", vy = "ImageType", yy = "InstanceTenancy", by = "InstanceTypes", xy = "InterfaceType", Sy = "InterfaceTypes", Cy = "IncludeUnsupportedInRegion", wy = "ImageWatermarks", Ty = "ImageWatermarkList", Ey = "ImageWatermark", Dy = "Images", Oy = "Image", ky = "Instance", Ay = "Instances", jy = "Iops", My = "Key", Ny = "KeyFormat", Py = "KeyFingerprint", Fy = "KernelId", Iy = "KmsKeyId", Ly = "KeyMaterial", Ry = "KeyName", zy = "KeyNameStringList", By = "KeyNames", Vy = "KeyPairs", Hy = "KeyPairId", Uy = "KeyPairIdStringList", Wy = "KeyPairIds", Gy = "KeyPairInfo", Ky = "KeyPairList", qy = "KeyPair", Jy = "KeyType", Yy = "Lambda", Xy = "LicenseConfigurationArn", Zy = "LicenseConfigurationRequest", Qy = "LicenseConfiguration", $y = "LambdaExclusion", eb = "LogicalGpuCount", tb = "LocalGatewayId", nb = "LicenseList", rb = "LastLaunchedTime", ib = "LicenseSpecificationListRequest", ab = "LicenseSpecifications", ob = "LicenseSpecification", sb = "LaunchTemplate", cb = "LaunchTemplateId", lb = "LaunchTemplateName", ub = "LaunchTemplateSpecification", db = "LaunchTime", fb = "Latest", pb = "Licenses", mb = "MediaAcceleratorInfo", hb = "MacAddress", gb = "MaximumBandwidthInMbps", _b = "MapCustomerOwnedIpOnLaunch", vb = "MaxCount", yb = "MinCount", bb = "MediaDeviceInfo", xb = "MediaDeviceInfoList", Sb = "MediaDeviceMemoryInfo", Cb = "MaximumEbsAttachments", wb = "MaximumEbsCards", Tb = "MaximumEfaInterfaces", Eb = "MaximumEnaQueueCount", Db = "MaximumEnaQueueCountPerInterface", Ob = "MaximumIops", kb = "MemoryInfo", Ab = "MaximumNetworkCards", jb = "MaximumNetworkInterfaces", Mb = "MetadataOptions", Nb = "MaintenanceOptions", Pb = "MapPublicIpOnLaunch", Fb = "MaxPrice", Ib = "MaxResults", Lb = "ModifySubnetAttributeRequest", Rb = "ModifySubnetAttribute", zb = "MaximumSecondaryNetworkInterfaces", Bb = "ModificationState", Vb = "MaximumThroughputInMBps", Hb = "MarketType", Ub = "ModifyVpcAttributeRequest", Wb = "ModifyVpcAttribute", Gb = "Main", Kb = "Manufacturer", qb = "Managed", Jb = "Message", Yb = "Messages", Xb = "Mode", Zb = "Monitoring", Qb = "Name", $b = "NetworkBorderGroup", ex = "NetworkCards", tx = "NetworkCardIndex", nx = "NetworkCardInfoList", rx = "NetworkCardInterfaceTypeList", ix = "NetworkCardInfo", ax = "NoDevice", ox = "NeuronDeviceCoreInfo", sx = "NeuronDeviceInfo", cx = "NeuronDeviceInfoList", lx = "NeuronDeviceMemoryInfo", ux = "NeuronDevices", dx = "NitroEnclavesSupport", fx = "NatGateway", px = "NatGatewayAddresses", mx = "NatGatewayAttachedAppliance", hx = "NatGatewayAttachedApplianceList", gx = "NatGatewayAddressList", _x = "NatGatewayAddress", vx = "NatGatewayExclusion", yx = "NatGatewayId", bx = "NatGatewayIdStringList", xx = "NatGatewayIds", Sx = "NatGatewayList", Cx = "NatGateways", wx = "NetworkInterfaceId", Tx = "NetworkInterfaceOwnerId", Ex = "NetworkInterfaces", Dx = "NetworkInfo", Ox = "NeuronInfo", kx = "NetworkPerformanceOptions", Ax = "NetworkPerformance", jx = "NoReboot", Mx = "NvmeSupport", Nx = "NitroTpmInfo", Px = "NitroTpmSupport", Fx = "NitroTpmSupportedVersionsList", T = "NextToken", Ix = "NestedVirtualization", Lx = "Origin", Rx = "OutpostArn", zx = "OwnerId", Bx = "OptInStatus", Vx = "OdbNetworkArn", Hx = "OperatorRequest", Ux = "OperatorResponse", Wx = "OwnerStringList", Gx = "Operator", Kx = "Output", qx = "Owners", Jx = "Owner", Yx = "Principal", Xx = "ProvisionedBandwidth", Zx = "PeakBandwidthInGbps", Qx = "ProductCodeId", $x = "ProductCodeList", eS = "ProductCodeType", tS = "ProductCode", nS = "ProductCodes", rS = "PrivateDnsHostnameTypeOnLaunch", iS = "PrivateDnsName", aS = "PrivateDnsNameOptions", oS = "PrivateDnsNameOptionsOnLaunch", sS = "PrivateDnsNameOptionsRequest", cS = "PrivateDnsNameOptionsResponse", lS = "PublicDnsName", uS = "PlatformDetails", dS = "PlacementGroupInfo", fS = "PlacementGroupStrategyList", pS = "PublicIp", mS = "PrivateIpAddressCount", hS = "PrivateIpAddressSpecification", gS = "PrivateIpAddressSpecificationList", _S = "PrivateIpAddress", vS = "PrivateIpAddresses", yS = "PublicIpAddress", bS = "PublicIpv4Pool", xS = "PublicIpStringList", SS = "PrimaryIpv6", CS = "PrivateIp", wS = "ProcessorInfo", TS = "PublicIps", ES = "PublicKey", DS = "PrefixListId", OS = "PrefixListIdList", kS = "PrefixListIds", AS = "PartitionNumber", jS = "PublicSsmParameterName", MS = "PeeringStatus", NS = "PhcSupport", PS = "PreviousState", FS = "ProvisionTime", IS = "PropagatingVgw", LS = "PropagatingVgwList", RS = "PropagatingVgws", zS = "ParentZoneId", BS = "ParentZoneName", VS = "Platform", HS = "Placement", US = "Primary", WS = "Provisioned", GS = "Public", KS = "Return", qS = "ReleaseAddressRequest", JS = "ReleaseAddress", YS = "ReturnCode", XS = "RootDeviceName", ZS = "RootDeviceType", QS = "RootDeviceTypeList", $S = "ResourceExclusions", eC = "ReferencedGroupId", tC = "ReferencedGroupInfo", nC = "RunInstancesMonitoringEnabled", rC = "RebootInstancesRequest", iC = "RunInstancesRequest", aC = "RunInstancesUserData", oC = "RamdiskId", sC = "ReservationId", cC = "RebootInstances", lC = "RequesterId", uC = "ResourceId", dC = "RunInstances", fC = "ReservationList", pC = "RouteList", mC = "RebootMigrationSupport", hC = "RebootMigration", gC = "RegionName", _C = "ReferencedSecurityGroup", vC = "RevokeSecurityGroupEgress", yC = "RevokeSecurityGroupEgressRequest", bC = "RevokeSecurityGroupEgressResult", xC = "RevokeSecurityGroupIngressRequest", SC = "RevokeSecurityGroupIngressResult", CC = "RevokeSecurityGroupIngress", wC = "RevokedSecurityGroupRule", TC = "RevokedSecurityGroupRuleList", EC = "RevokedSecurityGroupRules", DC = "RouteTableAssociation", OC = "RouteTableAssociationId", kC = "RouteTableAssociationList", AC = "RouteTableAssociationState", jC = "RouteTableId", MC = "RouteTableIdStringList", NC = "RouteTableIds", PC = "RouteTableList", FC = "ResourceType", IC = "RequestTime", LC = "RouteTable", RC = "RouteTables", zC = "Requested", BC = "Resources", VC = "Reservations", HC = "Reservation", UC = "Route", WC = "Routes", GC = "SecondaryAllocationIds", KC = "SecondaryAllocationId", qC = "SupportedAdditionalProcessorFeatureList", JC = "SubnetArn", YC = "SupportedArchitectures", XC = "SupportedBootModes", ZC = "SubnetCidrBlockState", QC = "SustainedClockSpeedInGhz", $C = "SourceDestCheck", ew = "SpreadDomain", tw = "SupportedFeatures", nw = "SubGeography", rw = "SecurityGroupArn", iw = "SecurityGroupId", aw = "SecurityGroupIdStringList", ow = "SecurityGroupIds", sw = "SecurityGroupList", cw = "SecurityGroupRules", lw = "SecurityGroupRuleArn", uw = "SecurityGroupRuleIds", dw = "SecurityGroupRuleIdList", fw = "SecurityGroupRuleId", pw = "SecurityGroupRuleList", mw = "SecurityGroupRule", hw = "SecurityGroupStringList", gw = "SecurityGroups", _w = "SecurityGroup", vw = "SubnetIds", yw = "SubnetIpv6CidrBlockAssociation", bw = "SubnetIpv6CidrBlockAssociationSet", xw = "SourceImageCreationTime", Sw = "SizeInGB", Cw = "SourceImageId", ww = "SecondaryInterfaceId", Tw = "SourceInstanceId", Ew = "SizeInMiB", Dw = "SpotInstanceRequestId", Ow = "SourceImageRegion", kw = "StartInstancesRequest", Aw = "StartInstancesResult", jw = "StopInstancesRequest", Mw = "StopInstancesResult", Nw = "SupportedInRegion", Pw = "SubnetIdStringList", Fw = "SupportedInstanceTypes", Iw = "SupportedInstanceTypeSet", Lw = "SpotInstanceType", Rw = "SecondaryInterfaces", zw = "SecondaryInterface", Bw = "SnapshotId", Vw = "StartingInstances", Hw = "StartInstances", Uw = "StoppingInstances", Ww = "StopInstances", Gw = "SubnetId", Kw = "SnapshotLocation", qw = "SubnetList", Jw = "ServiceManaged", Yw = "SpotMarketOptions", Xw = "StatusMessage", Zw = "StateMessage", Qw = "SecondaryNetworkId", $w = "SriovNetSupport", eT = "SecondaryNetworkSupported", tT = "SpotOptions", nT = "SkipOsShutdown", rT = "SecondaryPrivateIpAddresses", iT = "SecondaryPrivateIpAddressCount", aT = "SecondaryPrivateIpAddress", oT = "SupportedRootDeviceTypes", sT = "StateReason", cT = "SourceSecurityGroupName", lT = "SourceSecurityGroupOwnerId", uT = "SecondarySubnetId", dT = "SupportedStrategies", fT = "StateTransitionReason", pT = "SupportedUsageClasses", mT = "SensitiveUserData", hT = "SupportedVirtualizationTypes", gT = "SupportedVersions", E = "State", _T = "Status", vT = "Subnet", yT = "Subnets", D = "Tags", bT = "TcpEstablishedTimeout", xT = "TotalFpgaMemoryInMiB", ST = "TransitGatewayId", CT = "TotalGpuMemoryInMiB", wT = "TerminateInstances", TT = "TotalInferenceMemoryInMiB", ET = "TerminateInstancesRequest", DT = "TerminateInstancesResult", OT = "TerminatingInstances", kT = "TagList", AT = "TotalMediaMemoryInMiB", jT = "TotalNeuronDeviceMemoryInMiB", MT = "ToPort", NT = "ThreadsPerCore", PT = "ThreadsPerCoreList", FT = "TagSpecifications", IT = "TotalSizeInGB", LT = "TagSpecificationList", RT = "TagSpecification", zT = "TpmSupport", BT = "Tag", VT = "Tenancy", HT = "Throughput", UT = "Timestamp", WT = "Type", GT = "UsageClassTypeList", KT = "UserData", qT = "UserId", JT = "UserIdGroupPairs", YT = "UserIdGroupPairList", XT = "UserIdGroupPair", ZT = "UnknownIpPermissions", QT = "UnsupportedInstanceTypes", $T = "UnsupportedInstanceTypeSet", eE = "UsageOperation", tE = "UsageOperationUpdateTime", nE = "UdpStreamTimeout", rE = "UdpTimeout", iE = "Value", aE = "VpcCidrBlockAssociation", oE = "VpcCidrBlockAssociationSet", sE = "VpcCidrBlockState", cE = "VCpuInfo", lE = "ValidCores", uE = "VpcEncryptionControl", dE = "VpcEncryptionControlConfiguration", fE = "VpcEncryptionControlExclusion", pE = "VpcEncryptionControlExclusions", mE = "VpcEncryptionControlId", hE = "VpcEndpointId", O = "VpcId", gE = "VpcIpv6CidrBlockAssociation", _E = "VpcIpv6CidrBlockAssociationSet", vE = "VolumeInitializationRate", yE = "VpcIdStringList", bE = "VolumeId", xE = "VpcIds", SE = "VpcLattice", CE = "VpcLatticeExclusion", wE = "VpcList", TE = "VirtualName", EE = "VolumeOwnerId", DE = "VpcPeering", OE = "VpcPeeringConnectionId", kE = "VpcPeeringExclusion", AE = "VirtualPrivateGateway", jE = "VirtualPrivateGatewayExclusion", ME = "ValueStringList", NE = "VolumeSize", PE = "VolumeType", FE = "VirtualizationTypeList", IE = "ValidThreadsPerCore", LE = "VirtualizationType", RE = "ValidUntil", zE = "Values", BE = "Version", VE = "Vpc", HE = "Vpcs", UE = "WatermarkCreationTime", WE = "WatermarkKey", GE = "WorkloadsList", KE = "Workloads", qE = "ZoneId", JE = "ZoneIdStringList", YE = "ZoneIds", XE = "ZoneName", ZE = "ZoneNameStringList", QE = "ZoneNames", $E = "ZoneType", eD = "attachedApplianceSet", tD = "applianceArn", nD = "additionalFlexibleNetworkInterfaces", rD = "allocationId", iD = "availableIpAddressCount", aD = "assignIpv6AddressOnCreation", oD = "additionalInfo", sD = "associationId", cD = "attachmentId", lD = "amiLaunchIndex", uD = "attachmentLimitType", dD = "availabilityMode", fD = "associatePublicIpAddress", pD = "amazonProvidedIpv6CidrBlock", mD = "autoProvisionZones", hD = "autoRecoverySupported", gD = "allowReassociation", _D = "associatedResource", vD = "autoRecovery", yD = "associationState", bD = "autoScalingIps", xD = "amdSevSnp", SD = "addressesSet", CD = "associationSet", wD = "attachmentSet", TD = "attachmentState", ED = "attachTime", DD = "availabilityZone", OD = "availabilityZoneId", kD = "availabilityZoneInfo", AD = "accelerators", jD = "affinity", MD = "arn", ND = "architecture", PD = "association", FD = "attachment", ID = "baselineBandwidthInGbps", LD = "baselineBandwidthInMbps", RD = "blockDeviceMapping", zD = "baselineIops", BD = "bootMode", VD = "bareMetal", HD = "blockPublicAccessStates", UD = "burstablePerformanceSupported", WD = "baselineThroughputInMBps", GD = "bandwidthWeighting", KD = "bandwidthWeightings", qD = "cidrBlock", JD = "cidrBlockAssociationSet", YD = "capacityBlockId", XD = "cidrBlockState", ZD = "coreCount", QD = "creationDate", $D = "carrierGatewayId", eO = "currentGeneration", tO = "carrierIp", nO = "currentInstanceBootMode", rO = "cidrIp", iO = "cidrIpv6", aO = "cidrIpv4", oO = "coreInfo", sO = "coreNetworkArn", cO = "cpuOptions", lO = "customerOwnedIp", uO = "customerOwnedIpv4Pool", dO = "capacityReservationId", fO = "capacityReservationPreference", pO = "capacityReservationResourceGroupArn", mO = "capacityReservationSpecification", hO = "capacityReservationTarget", gO = "currentState", _O = "clientToken", vO = "connectionTrackingConfiguration", yO = "connectivityType", bO = "createTime", xO = "code", SO = "configured", CO = "count", wO = "disableApiTermination", TO = "destinationCidrBlock", EO = "defaultCores", DO = "defaultEnaQueueCountPerInterface", OO = "defaultForAz", kO = "dedicatedHostsSupported", AO = "deviceIndex", jO = "destinationIpv6CidrBlock", MO = "deviceName", NO = "defaultNetworkCardIndex", PO = "dnsName", FO = "dhcpOptionsId", IO = "deleteOnTermination", LO = "destinationPrefixListId", RO = "deregistrationProtection", k = "dryRun", zO = "deleteSnapshotResultSet", BO = "defaultTcpEstablishedTimeout", VO = "defaultThreadsPerCore", HO = "deprecationTime", UO = "deleteTime", WO = "defaultUdpStreamTimeout", GO = "defaultUdpTimeout", KO = "defaultVCpus", qO = "description", JO = "disks", YO = "domain", XO = "ebsCardIndex", ZO = "ebsCardSet", QO = "encryptionControl", $O = "enableDnsHostnames", ek = "enableDnsSupport", tk = "enableDns64", nk = "elasticFileSystem", rk = "elasticGpuAssociationId", ik = "elasticGpuAssociationState", ak = "elasticGpuAssociationSet", ok = "elasticGpuAssociationTime", sk = "elasticGpuId", ck = "elasticInferenceAcceleratorArn", lk = "elasticInferenceAcceleratorAssociationId", uk = "elasticInferenceAcceleratorAssociationState", dk = "elasticInferenceAcceleratorAssociationSet", fk = "elasticInferenceAcceleratorAssociationTime", pk = "encryptionInTransitSupported", mk = "ebsInfo", hk = "efaInfo", gk = "enableLniAtDeviceIndex", _k = "enableNetworkAddressUsageMetrics", vk = "ebsOptimized", yk = "ebsOptimizedInfo", bk = "egressOnlyInternetGateway", xk = "egressOnlyInternetGatewayId", Sk = "ebsOptimizedSupport", Ck = "enclaveOptions", wk = "enaQueueCount", A = "ec2QueryName", Tk = "enableResourceNameDnsAAAARecord", Ek = "enableResourceNameDnsARecord", Dk = "enaSrdEnabled", Ok = "enaSrdSpecification", kk = "enaSrdSupported", Ak = "enaSrdUdpEnabled", jk = "enaSrdUdpSpecification", Mk = "efaSupported", Nk = "encryptionSupport", Pk = "enaSupport", Fk = "ebs", Ik = "enabled", Lk = "encrypted", Rk = "failureCode", zk = "flexibleEnaQueuesSupport", Bk = "fpgaInfo", Vk = "failureMessage", Hk = "fromPort", Uk = "freeTierEligible", Wk = "force", Gk = "fpgas", Kk = "groupDescription", qk = "gatewayId", Jk = "gpuInfo", Yk = "groupId", Xk = "groupLongName", Zk = "groupName", Qk = "groupOwnerId", $k = "gpuPartitionSize", eA = "geographySet", tA = "groupSet", nA = "gpus", rA = "groups", iA = "hypervisor", aA = "hiddenByDefault", oA = "httpEndpoint", sA = "hostId", cA = "hibernationOptions", lA = "httpProtocolIpv6", uA = "httpPutResponseHopLimit", dA = "hostResourceGroupArn", fA = "hibernationSupported", pA = "httpTokens", mA = "hostnameType", hA = "id", gA = "ipv6AddressAttribute", _A = "ipv6AddressCount", vA = "inferenceAcceleratorInfo", yA = "ipv4AddressesPerInterface", bA = "ipv6AddressesPerInterface", xA = "ipv4AddressesPerSecondaryInterface", SA = "ipv6AddressesSet", CA = "imageAllowed", wA = "ipAddress", TA = "ipv6Address", EA = "ipv6CidrBlock", DA = "ipv6CidrBlockAssociationSet", OA = "ipv6CidrBlockState", kA = "isDefault", AA = "isEgress", jA = "internetGateway", MA = "internetGatewayBlockMode", NA = "internetGatewayId", PA = "internetGatewaySet", FA = "instanceId", IA = "iamInstanceProfile", LA = "instanceInitiatedShutdownBehavior", RA = "imageId", zA = "imageLocation", BA = "instanceLifecycle", VA = "instanceMetadataTags", HA = "ipv6Native", UA = "imageOwnerAlias", WA = "imageOwnerId", GA = "instanceOwnerId", KA = "ipOwnerId", qA = "ipPermissionsEgress", JA = "isPrimaryIpv6", YA = "ipv4PrefixSet", XA = "ipv6PrefixSet", ZA = "ipProtocol", QA = "ipPermissions", $A = "ipv4Prefix", ej = "ipv6Pool", tj = "ipv6Prefix", nj = "isPublic", rj = "isPrimary", ij = "ipRanges", aj = "ipv6Ranges", oj = "instanceStorageInfo", sj = "instanceStorageSupported", cj = "imagesSet", lj = "imageState", uj = "imdsSupport", dj = "instancesSet", fj = "instanceState", pj = "ipSource", mj = "ipv6Supported", hj = "instanceType", gj = "instanceTypeSet", _j = "instanceTypeSpecification", vj = "interfaceTypeSet", yj = "idempotencyToken", bj = "imageType", xj = "instanceTenancy", Sj = "interfaceType", Cj = "imageWatermarkSet", wj = "iops", j = "item", Tj = "key", Ej = "keyFingerprint", Dj = "kernelId", Oj = "kmsKeyId", kj = "keyMaterial", Aj = "keyName", jj = "keyPairId", Mj = "keySet", Nj = "keyType", Pj = "lambda", Fj = "licenseConfigurationArn", Ij = "logicalGpuCount", Lj = "localGatewayId", Rj = "lastLaunchedTime", zj = "licenseSet", Bj = "launchTime", Vj = "mediaAcceleratorInfo", Hj = "macAddress", Uj = "maximumBandwidthInMbps", Wj = "mapCustomerOwnedIpOnLaunch", Gj = "maximumEbsAttachments", Kj = "maximumEbsCards", qj = "maximumEfaInterfaces", Jj = "maximumEnaQueueCount", Yj = "maximumEnaQueueCountPerInterface", Xj = "maximumIops", Zj = "memoryInfo", Qj = "maximumNetworkCards", $j = "maximumNetworkInterfaces", eM = "metadataOptions", tM = "maintenanceOptions", nM = "mapPublicIpOnLaunch", rM = "maxResults", iM = "messageSet", aM = "maximumSecondaryNetworkInterfaces", oM = "modificationState", sM = "maximumThroughputInMBps", cM = "main", lM = "manufacturer", uM = "managed", dM = "message", fM = "mode", pM = "monitoring", mM = "name", hM = "networkBorderGroup", gM = "networkCards", _M = "networkCardIndex", vM = "noDevice", yM = "neuronDevices", bM = "nitroEnclavesSupport", xM = "natGateway", SM = "natGatewayAddressSet", CM = "natGatewayId", wM = "natGatewaySet", TM = "networkInterfaceId", EM = "networkInterfaceOwnerId", DM = "networkInterfaceSet", OM = "networkInterface", kM = "networkInfo", AM = "neuronInfo", jM = "networkPerformanceOptions", MM = "networkPerformance", NM = "noReboot", PM = "nvmeSupport", FM = "nitroTpmInfo", IM = "nitroTpmSupport", LM = "nextToken", RM = "nestedVirtualization", zM = "origin", BM = "outpostArn", VM = "ownerId", HM = "optInStatus", UM = "odbNetworkArn", WM = "operator", GM = "output", KM = "principal", qM = "provisionedBandwidth", JM = "peakBandwidthInGbps", YM = "productCodes", XM = "productCode", ZM = "privateDnsNameOptions", QM = "privateDnsNameOptionsOnLaunch", $M = "privateDnsName", eN = "publicDnsName", tN = "platformDetails", nN = "placementGroupInfo", rN = "publicIp", iN = "privateIpAddressesSet", aN = "privateIpAddressSet", oN = "privateIpAddress", sN = "publicIpv4Pool", cN = "processorInfo", lN = "privateIp", uN = "publicKey", dN = "prefixListId", fN = "prefixListIds", pN = "partitionNumber", mN = "publicSsmParameterName", hN = "peeringStatus", gN = "phcSupport", _N = "previousState", vN = "provisionTime", yN = "propagatingVgwSet", bN = "parentZoneId", xN = "parentZoneName", SN = "platform", CN = "placement", wN = "primary", TN = "provisioned", EN = "return", DN = "returnCode", ON = "rootDeviceName", kN = "rootDeviceType", AN = "resourceExclusions", jN = "referencedGroupId", MN = "referencedGroupInfo", NN = "reservationId", PN = "ramdiskId", FN = "requesterId", IN = "resourceId", LN = "rebootMigrationSupport", RN = "rebootMigration", zN = "regionName", BN = "revokedSecurityGroupRuleSet", VN = "reservationSet", HN = "routeSet", UN = "routeTableAssociationId", WN = "routeTableId", GN = "routeTableSet", KN = "resourceType", qN = "requestTime", JN = "routeTable", YN = "reason", XN = "requested", ZN = "smithy.ts.sdk.synthetic.com.amazonaws.ec2", QN = "supportedArchitectures", $N = "subnetArn", eP = "supportedBootModes", tP = "sustainedClockSpeedInGhz", nP = "sourceDestCheck", rP = "spreadDomain", iP = "supportedFeatures", aP = "securityGroupArn", oP = "securityGroupInfo", sP = "securityGroupRuleArn", cP = "securityGroupRuleId", lP = "securityGroupRuleSet", uP = "subGeographySet", dP = "sourceImageCreationTime", fP = "sizeInGB", pP = "sourceInstanceId", mP = "secondaryInterfaceId", hP = "sourceImageId", gP = "sizeInMiB", _P = "sourceImageRegion", vP = "spotInstanceRequestId", yP = "supportedInRegion", bP = "secondaryInterfaceSet", xP = "supportedInstanceTypeSet", SP = "snapshotId", CP = "subnetId", wP = "serviceManaged", TP = "statusMessage", EP = "stateMessage", DP = "secondaryNetworkId", OP = "secondaryNetworkSupported", kP = "sriovNetSupport", AP = "secondaryPrivateIpAddressCount", jP = "supportedRootDeviceTypes", MP = "stateReason", NP = "sourceSecurityGroupName", PP = "sourceSecurityGroupOwnerId", FP = "secondarySubnetId", IP = "subnetSet", LP = "supportedStrategies", RP = "supportedUsageClasses", zP = "supportedVirtualizationTypes", BP = "supportedVersions", VP = "state", HP = "status", UP = "subnet", WP = "tcpEstablishedTimeout", GP = "totalFpgaMemoryInMiB", KP = "transitGatewayId", qP = "totalGpuMemoryInMiB", JP = "totalInferenceMemoryInMiB", YP = "totalMediaMemoryInMiB", XP = "totalNeuronDeviceMemoryInMiB", ZP = "toPort", QP = "threadsPerCore", $P = "tagSet", eF = "totalSizeInGB", tF = "tpmSupport", nF = "tag", rF = "tenancy", iF = "throughput", aF = "timestamp", oF = "type", sF = "userId", cF = "unknownIpPermissionSet", lF = "unsupportedInstanceTypeSet", uF = "usageOperation", dF = "usageOperationUpdateTime", fF = "udpStreamTimeout", pF = "udpTimeout", mF = "value", hF = "vCpuInfo", gF = "validCores", _F = "vpcEncryptionControlId", vF = "vpcEndpointId", M = "vpcId", yF = "volumeId", bF = "vpcLattice", xF = "virtualName", SF = "volumeOwnerId", CF = "vpcPeering", wF = "vpcPeeringConnectionId", TF = "virtualPrivateGateway", EF = "volumeSize", DF = "vpcSet", OF = "volumeType", kF = "validThreadsPerCore", AF = "virtualizationType", jF = "version", MF = "vpc", NF = "watermarkCreationTime", PF = "watermarkKey", FF = "workloadSet", N = "xmlName", IF = "zoneId", LF = "zoneName", RF = "zoneState", zF = "zoneType", P = "com.amazonaws.ec2", BF = new Ke(ZN), VF = [
	-3,
	ZN,
	"EC2ServiceException",
	0,
	[],
	[]
];
BF.registerError(VF, Zl);
var HF = [BF], UF = [
	0,
	P,
	aC,
	8,
	0
], WF = [
	0,
	P,
	mT,
	8,
	0
], GF = [
	3,
	P,
	Ql,
	0,
	[
		_u,
		yu,
		Hm,
		wx,
		Tx,
		_S,
		D,
		bS,
		$b,
		lf,
		uf,
		Ud,
		Gw,
		Jw,
		j_,
		pS
	],
	[
		[0, {
			[A]: "AllocationId",
			[N]: rD
		}],
		[0, {
			[A]: "AssociationId",
			[N]: sD
		}],
		[0, {
			[A]: "Domain",
			[N]: YO
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "NetworkInterfaceOwnerId",
			[N]: EM
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "PublicIpv4Pool",
			[N]: sN
		}],
		[0, {
			[A]: "NetworkBorderGroup",
			[N]: hM
		}],
		[0, {
			[A]: "CustomerOwnedIp",
			[N]: lO
		}],
		[0, {
			[A]: "CustomerOwnedIpv4Pool",
			[N]: uO
		}],
		[0, {
			[A]: "CarrierIp",
			[N]: tO
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "ServiceManaged",
			[N]: wP
		}],
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[0, {
			[A]: "PublicIp",
			[N]: rN
		}]
	]
], KF = [
	3,
	P,
	$l,
	0,
	[
		Hm,
		Ql,
		bS,
		$b,
		uf,
		FT,
		Tv,
		C
	],
	[
		0,
		0,
		0,
		0,
		0,
		[() => $V, { [N]: RT }],
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], qF = [
	3,
	P,
	eu,
	0,
	[
		_u,
		bS,
		$b,
		Hm,
		lf,
		uf,
		Ud,
		pS
	],
	[
		[0, {
			[A]: "AllocationId",
			[N]: rD
		}],
		[0, {
			[A]: "PublicIpv4Pool",
			[N]: sN
		}],
		[0, {
			[A]: "NetworkBorderGroup",
			[N]: hM
		}],
		[0, {
			[A]: "Domain",
			[N]: YO
		}],
		[0, {
			[A]: "CustomerOwnedIp",
			[N]: lO
		}],
		[0, {
			[A]: "CustomerOwnedIpv4Pool",
			[N]: uO
		}],
		[0, {
			[A]: "CarrierIp",
			[N]: tO
		}],
		[0, {
			[A]: "PublicIp",
			[N]: rN
		}]
	]
], JF = [
	3,
	P,
	tu,
	0,
	[
		_u,
		j_,
		pS,
		C,
		wx,
		_S,
		Mu
	],
	[
		0,
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[2, {
			[A]: "AllowReassociation",
			[N]: gD
		}]
	]
], YF = [
	3,
	P,
	nu,
	0,
	[yu],
	[[0, {
		[A]: "AssociationId",
		[N]: sD
	}]]
], XF = [
	3,
	P,
	ku,
	0,
	[
		jC,
		Sg,
		bS,
		C,
		Gw
	],
	[
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}],
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}]
	],
	1
], ZF = [
	3,
	P,
	Au,
	0,
	[yu, Uu],
	[[0, {
		[A]: "AssociationId",
		[N]: sD
	}], [() => zz, {
		[A]: "AssociationState",
		[N]: yD
	}]]
], QF = [
	3,
	P,
	mu,
	0,
	[
		E_,
		O,
		C
	],
	[
		[0, {
			[A]: "InternetGatewayId",
			[N]: NA
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	2
], $F = [
	3,
	P,
	cu,
	0,
	[iE],
	[[2, {
		[A]: "Value",
		[N]: mF
	}]]
], eI = [
	3,
	P,
	Iu,
	0,
	[
		w,
		FT,
		C,
		cT,
		lT,
		Rv,
		lg,
		MT,
		Xd,
		Iv
	],
	[
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[() => $V, { [N]: RT }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "SourceSecurityGroupName",
			[N]: NP
		}],
		[0, {
			[A]: "SourceSecurityGroupOwnerId",
			[N]: PP
		}],
		[0, {
			[A]: "IpProtocol",
			[N]: ZA
		}],
		[1, {
			[A]: "FromPort",
			[N]: Hk
		}],
		[1, {
			[A]: "ToPort",
			[N]: ZP
		}],
		[0, {
			[A]: "CidrIp",
			[N]: rO
		}],
		[() => uV, {
			[A]: "IpPermissions",
			[N]: QA
		}]
	],
	1
], tI = [
	3,
	P,
	Lu,
	0,
	[KS, cw],
	[[2, {
		[A]: "Return",
		[N]: EN
	}], [() => KV, {
		[A]: "SecurityGroupRuleSet",
		[N]: lP
	}]]
], nI = [
	3,
	P,
	Ru,
	0,
	[
		Xd,
		lg,
		w,
		kg,
		Iv,
		Rv,
		cT,
		lT,
		MT,
		FT,
		C
	],
	[
		0,
		1,
		0,
		0,
		[() => uV, 0],
		0,
		0,
		0,
		1,
		[() => $V, { [N]: RT }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], rI = [
	3,
	P,
	zu,
	0,
	[KS, cw],
	[[2, {
		[A]: "Return",
		[N]: EN
	}], [() => KV, {
		[A]: "SecurityGroupRuleSet",
		[N]: lP
	}]]
], iI = [
	3,
	P,
	qu,
	0,
	[
		Bx,
		Yb,
		gC,
		XE,
		qE,
		kg,
		$b,
		$E,
		BS,
		zS,
		Og,
		Pg,
		nw,
		E
	],
	[
		[0, {
			[A]: "OptInStatus",
			[N]: HM
		}],
		[() => bB, {
			[A]: "MessageSet",
			[N]: iM
		}],
		[0, {
			[A]: "RegionName",
			[N]: zN
		}],
		[0, {
			[A]: "ZoneName",
			[N]: LF
		}],
		[0, {
			[A]: "ZoneId",
			[N]: IF
		}],
		[0, {
			[A]: "GroupName",
			[N]: Zk
		}],
		[0, {
			[A]: "NetworkBorderGroup",
			[N]: hM
		}],
		[0, {
			[A]: "ZoneType",
			[N]: zF
		}],
		[0, {
			[A]: "ParentZoneName",
			[N]: xN
		}],
		[0, {
			[A]: "ParentZoneId",
			[N]: bN
		}],
		[0, {
			[A]: "GroupLongName",
			[N]: Xk
		}],
		[() => vB, {
			[A]: "GeographySet",
			[N]: eA
		}],
		[() => xB, {
			[A]: "SubGeographySet",
			[N]: uP
		}],
		[0, {
			[A]: "ZoneState",
			[N]: RF
		}]
	]
], aI = [
	3,
	P,
	Ju,
	0,
	[
		qu,
		Qu,
		vu
	],
	[
		0,
		0,
		[() => hB, { [N]: _u }]
	]
], oI = [
	3,
	P,
	Xu,
	0,
	[Qb],
	[[0, {
		[A]: "Name",
		[N]: mM
	}]]
], sI = [
	3,
	P,
	ed,
	0,
	[Jb],
	[[0, {
		[A]: "Message",
		[N]: dM
	}]]
], cI = [
	3,
	P,
	nd,
	0,
	[Qb],
	[[0, {
		[A]: "Name",
		[N]: mM
	}]]
], lI = [
	3,
	P,
	_d,
	0,
	[
		Zh,
		ax,
		Hp,
		TE
	],
	[
		[() => AL, {
			[A]: "Ebs",
			[N]: Fk
		}],
		[0, {
			[A]: "NoDevice",
			[N]: vM
		}],
		[0, {
			[A]: "DeviceName",
			[N]: MO
		}],
		[0, {
			[A]: "VirtualName",
			[N]: xF
		}]
	]
], uI = [
	3,
	P,
	Dd,
	0,
	[w_],
	[[0, {
		[A]: "InternetGatewayBlockMode",
		[N]: MA
	}]]
], dI = [
	3,
	P,
	vf,
	0,
	[pf, yf],
	[0, () => pI]
], fI = [
	3,
	P,
	_f,
	0,
	[pf, yf],
	[[0, {
		[A]: "CapacityReservationPreference",
		[N]: fO
	}], [() => mI, {
		[A]: "CapacityReservationTarget",
		[N]: hO
	}]]
], pI = [
	3,
	P,
	yf,
	0,
	[ff, hf],
	[0, 0]
], mI = [
	3,
	P,
	bf,
	0,
	[ff, hf],
	[[0, {
		[A]: "CapacityReservationId",
		[N]: dO
	}], [0, {
		[A]: "CapacityReservationResourceGroupArn",
		[N]: pO
	}]]
], hI = [
	3,
	P,
	Rf,
	0,
	[
		bT,
		nE,
		rE
	],
	[
		1,
		1,
		1
	]
], gI = [
	3,
	P,
	zf,
	0,
	[
		bT,
		nE,
		rE
	],
	[
		[1, {
			[A]: "TcpEstablishedTimeout",
			[N]: WP
		}],
		[1, {
			[A]: "UdpStreamTimeout",
			[N]: fF
		}],
		[1, {
			[A]: "UdpTimeout",
			[N]: pF
		}]
	]
], _I = [
	3,
	P,
	cf,
	0,
	[
		Rd,
		NT,
		Hu,
		Ix
	],
	[
		[1, {
			[A]: "CoreCount",
			[N]: ZD
		}],
		[1, {
			[A]: "ThreadsPerCore",
			[N]: QP
		}],
		[0, {
			[A]: "AmdSevSnp",
			[N]: xD
		}],
		[0, {
			[A]: "NestedVirtualization",
			[N]: RM
		}]
	]
], vI = [
	3,
	P,
	df,
	0,
	[
		Rd,
		NT,
		Hu,
		Ix
	],
	[
		1,
		1,
		0,
		0
	]
], yI = [
	3,
	P,
	Jd,
	0,
	[
		j_,
		Qb,
		FT,
		Kw,
		wd,
		C,
		Bm,
		jx,
		bd
	],
	[
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[() => $V, { [N]: RT }],
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[2, {
			[A]: "NoReboot",
			[N]: NM
		}],
		[() => wB, {
			[A]: "BlockDeviceMapping",
			[N]: RD
		}]
	],
	2
], bI = [
	3,
	P,
	Yd,
	0,
	[K_],
	[[0, {
		[A]: "ImageId",
		[N]: RA
	}]]
], xI = [
	3,
	P,
	Kd,
	0,
	[FT, C],
	[[() => $V, { [N]: RT }], [2, {
		[A]: "DryRun",
		[N]: k
	}]]
], SI = [
	3,
	P,
	qd,
	0,
	[x_],
	[[() => zR, {
		[A]: "InternetGateway",
		[N]: jA
	}]]
], CI = [
	3,
	P,
	nf,
	0,
	[
		Ry,
		Jy,
		FT,
		Ny,
		C
	],
	[
		0,
		0,
		[() => $V, { [N]: RT }],
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], wI = [
	3,
	P,
	of,
	0,
	[
		wu,
		_u,
		Pf,
		C,
		Gw,
		O,
		Yu,
		FT,
		Bf,
		_S,
		GC,
		rT,
		iT
	],
	[
		0,
		0,
		[0, 4],
		2,
		0,
		0,
		[() => _B, { [N]: Ju }],
		[() => $V, { [N]: RT }],
		0,
		0,
		[() => hB, { [N]: KC }],
		[() => lV, { [N]: aT }],
		1
	]
], TI = [
	3,
	P,
	sf,
	0,
	[Pf, fx],
	[[0, {
		[A]: "ClientToken",
		[N]: _O
	}], [() => iz, {
		[A]: "NatGateway",
		[N]: xM
	}]]
], EI = [
	3,
	P,
	mf,
	0,
	[
		jC,
		Qp,
		hE,
		ST,
		tb,
		Vd,
		rf,
		Vx,
		C,
		op,
		Sg,
		pp,
		Ah,
		j_,
		wx,
		OE,
		yx
	],
	[
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "DestinationCidrBlock",
			[N]: TO
		}],
		[0, {
			[A]: "GatewayId",
			[N]: qk
		}],
		[0, {
			[A]: "DestinationIpv6CidrBlock",
			[N]: jO
		}],
		[0, {
			[A]: "EgressOnlyInternetGatewayId",
			[N]: xk
		}],
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "VpcPeeringConnectionId",
			[N]: wF
		}],
		[0, {
			[A]: "NatGatewayId",
			[N]: CM
		}]
	],
	1
], DI = [
	3,
	P,
	gf,
	0,
	[KS],
	[[2, {
		[A]: "Return",
		[N]: EN
	}]]
], OI = [
	3,
	P,
	xf,
	0,
	[
		O,
		FT,
		Pf,
		C
	],
	[
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[() => $V, { [N]: RT }],
		[0, 4],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], kI = [
	3,
	P,
	Sf,
	0,
	[LC, Pf],
	[[() => Lz, {
		[A]: "RouteTable",
		[N]: JN
	}], [0, {
		[A]: "ClientToken",
		[N]: _O
	}]]
], AI = [
	3,
	P,
	Ef,
	0,
	[
		Bm,
		kg,
		O,
		FT,
		C
	],
	[
		[0, { [N]: vg }],
		0,
		0,
		[() => $V, { [N]: RT }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	2
], jI = [
	3,
	P,
	Df,
	0,
	[
		w,
		D,
		rw
	],
	[
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "SecurityGroupArn",
			[N]: aP
		}]
	]
], MI = [
	3,
	P,
	Of,
	0,
	[
		O,
		FT,
		qu,
		Qu,
		Nd,
		u_,
		Rx,
		cv,
		L_,
		gv,
		I_,
		hv,
		C
	],
	[
		0,
		[() => $V, { [N]: RT }],
		0,
		0,
		0,
		0,
		0,
		2,
		0,
		1,
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], NI = [
	3,
	P,
	kf,
	0,
	[vT],
	[[() => Xz, {
		[A]: "Subnet",
		[N]: UP
	}]]
], PI = [
	3,
	P,
	If,
	0,
	[
		BC,
		D,
		C
	],
	[
		[64, { [N]: uC }],
		[() => F, { [N]: BT }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	2
], FI = [
	3,
	P,
	Uf,
	0,
	[
		Nd,
		Bv,
		u_,
		L_,
		gv,
		I_,
		hv,
		f_,
		uE,
		FT,
		C,
		yy,
		Eu
	],
	[
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		0,
		() => lB,
		[() => $V, { [N]: RT }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "InstanceTenancy",
			[N]: xj
		}],
		[2, {
			[A]: "AmazonProvidedIpv6CidrBlock",
			[N]: pD
		}]
	]
], II = [
	3,
	P,
	Wf,
	0,
	[VE],
	[[() => aB, {
		[A]: "Vpc",
		[N]: MF
	}]]
], LI = [
	3,
	P,
	Af,
	0,
	[zd],
	[0],
	1
], RI = [
	3,
	P,
	sp,
	0,
	[
		Cm,
		Am,
		km
	],
	[
		[1, {
			[A]: "DefaultTcpEstablishedTimeout",
			[N]: BO
		}],
		[1, {
			[A]: "DefaultUdpTimeout",
			[N]: GO
		}],
		[1, {
			[A]: "DefaultUdpStreamTimeout",
			[N]: WO
		}]
	]
], zI = [
	3,
	P,
	hp,
	0,
	[E_, C],
	[[0, {
		[A]: "InternetGatewayId",
		[N]: NA
	}], [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], BI = [
	3,
	P,
	Ip,
	0,
	[
		Ry,
		Hy,
		C
	],
	[
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], VI = [
	3,
	P,
	Lp,
	0,
	[KS, Hy],
	[[2, {
		[A]: "Return",
		[N]: EN
	}], [0, {
		[A]: "KeyPairId",
		[N]: jj
	}]]
], HI = [
	3,
	P,
	Gp,
	0,
	[yx, C],
	[[0, { [N]: yx }], 2],
	1
], UI = [
	3,
	P,
	Kp,
	0,
	[yx],
	[[0, {
		[A]: "NatGatewayId",
		[N]: CM
	}]]
], WI = [
	3,
	P,
	em,
	0,
	[
		jC,
		Qp,
		C,
		op,
		pp
	],
	[
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}],
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "DestinationCidrBlock",
			[N]: TO
		}],
		[0, {
			[A]: "DestinationIpv6CidrBlock",
			[N]: jO
		}]
	],
	1
], GI = [
	3,
	P,
	nm,
	0,
	[jC, C],
	[[0, {
		[A]: "RouteTableId",
		[N]: WN
	}], [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], KI = [
	3,
	P,
	um,
	0,
	[
		w,
		kg,
		C
	],
	[
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], qI = [
	3,
	P,
	dm,
	0,
	[KS, w],
	[[2, {
		[A]: "Return",
		[N]: EN
	}], [0, {
		[A]: "GroupId",
		[N]: Yk
	}]]
], JI = [
	3,
	P,
	hm,
	0,
	[Bw, YS],
	[[0, {
		[A]: "SnapshotId",
		[N]: SP
	}], [0, {
		[A]: "ReturnCode",
		[N]: DN
	}]]
], YI = [
	3,
	P,
	_m,
	0,
	[Gw, C],
	[0, [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], XI = [
	3,
	P,
	Tm,
	0,
	[
		BC,
		C,
		D
	],
	[
		[64, {
			[A]: "ResourceId",
			[N]: IN
		}],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => F, {
			[A]: "Tag",
			[N]: nF
		}]
	],
	1
], ZI = [
	3,
	P,
	Fm,
	0,
	[O, C],
	[0, [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], QI = [
	3,
	P,
	Sp,
	0,
	[
		K_,
		Qf,
		C
	],
	[
		0,
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], $I = [
	3,
	P,
	Cp,
	0,
	[KS, vm],
	[[2, {
		[A]: "Return",
		[N]: EN
	}], [() => DB, {
		[A]: "DeleteSnapshotResultSet",
		[N]: zO
	}]]
], eL = [
	3,
	P,
	Yf,
	0,
	[
		TS,
		C,
		dg,
		vu
	],
	[
		[() => FV, { [N]: pS }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }],
		[() => hB, { [N]: _u }]
	]
], tL = [
	3,
	P,
	Xf,
	0,
	[od],
	[[() => mB, {
		[A]: "AddressesSet",
		[N]: SD
	}]]
], nL = [
	3,
	P,
	tp,
	0,
	[
		QE,
		YE,
		ru,
		C,
		dg
	],
	[
		[() => fH, { [N]: XE }],
		[() => dH, { [N]: qE }],
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }]
	]
], rL = [
	3,
	P,
	np,
	0,
	[id],
	[[() => yB, {
		[A]: "AvailabilityZoneInfo",
		[N]: kD
	}]]
], iL = [
	3,
	P,
	wp,
	0,
	[
		Xh,
		q_,
		qx,
		m_,
		v_,
		Ib,
		T,
		C,
		dg
	],
	[
		[() => PB, { [N]: Gm }],
		[() => VB, { [N]: K_ }],
		[() => kV, { [N]: Jx }],
		2,
		2,
		1,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }]
	]
], aL = [
	3,
	P,
	Tp,
	0,
	[T, Dy],
	[[0, {
		[A]: "NextToken",
		[N]: LM
	}], [() => HB, {
		[A]: "ImagesSet",
		[N]: cj
	}]]
], oL = [
	3,
	P,
	Ep,
	0,
	[
		J_,
		ov,
		C,
		dg,
		T,
		Ib
	],
	[
		[() => KB, { [N]: j_ }],
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }],
		[0, {
			[A]: "NextToken",
			[N]: LM
		}],
		[1, {
			[A]: "MaxResults",
			[N]: rM
		}]
	]
], sL = [
	3,
	P,
	Dp,
	0,
	[T, VC],
	[[0, {
		[A]: "NextToken",
		[N]: LM
	}], [() => IV, {
		[A]: "ReservationSet",
		[N]: VN
	}]]
], cL = [
	3,
	P,
	Op,
	0,
	[
		C,
		by,
		dg,
		Ib,
		T,
		Cy
	],
	[
		2,
		[64, { [N]: py }],
		[() => FB, { [N]: fg }],
		1,
		0,
		2
	]
], lL = [
	3,
	P,
	kp,
	0,
	[by, T],
	[[() => aV, {
		[A]: "InstanceTypeSet",
		[N]: gj
	}], [0, {
		[A]: "NextToken",
		[N]: LM
	}]]
], uL = [
	3,
	P,
	gp,
	0,
	[
		T,
		Ib,
		C,
		O_,
		dg
	],
	[
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => sV, {
			[A]: "InternetGatewayId",
			[N]: NA
		}],
		[() => FB, { [N]: fg }]
	]
], dL = [
	3,
	P,
	_p,
	0,
	[A_, T],
	[[() => cV, {
		[A]: "InternetGatewaySet",
		[N]: PA
	}], [0, {
		[A]: "NextToken",
		[N]: LM
	}]]
], fL = [
	3,
	P,
	Rp,
	0,
	[
		By,
		Wy,
		kv,
		C,
		dg
	],
	[
		[() => hV, { [N]: Ry }],
		[() => gV, { [N]: Hy }],
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }]
	]
], pL = [
	3,
	P,
	zp,
	0,
	[Vy],
	[[() => _V, {
		[A]: "KeySet",
		[N]: Mj
	}]]
], mL = [
	3,
	P,
	qp,
	0,
	[
		C,
		fg,
		Ib,
		xx,
		T
	],
	[
		2,
		[() => FB, 0],
		1,
		[() => CV, { [N]: yx }],
		0
	]
], hL = [
	3,
	P,
	Jp,
	0,
	[Cx, T],
	[[() => wV, {
		[A]: "NatGatewaySet",
		[N]: wM
	}], [0, {
		[A]: "NextToken",
		[N]: LM
	}]]
], gL = [
	3,
	P,
	rm,
	0,
	[
		T,
		Ib,
		C,
		NC,
		dg
	],
	[
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => VV, { [N]: jC }],
		[() => FB, { [N]: fg }]
	]
], _L = [
	3,
	P,
	im,
	0,
	[RC, T],
	[[() => HV, {
		[A]: "RouteTableSet",
		[N]: GN
	}], [0, {
		[A]: "NextToken",
		[N]: LM
	}]]
], vL = [
	3,
	P,
	fm,
	0,
	[
		Eg,
		jg,
		T,
		Ib,
		C,
		dg
	],
	[
		[() => zB, { [N]: w }],
		[() => BB, { [N]: kg }],
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[() => FB, { [N]: fg }]
	]
], yL = [
	3,
	P,
	pm,
	0,
	[T, gw],
	[[0, {
		[A]: "NextToken",
		[N]: LM
	}], [() => WV, {
		[A]: "SecurityGroupInfo",
		[N]: oP
	}]]
], bL = [
	3,
	P,
	ym,
	0,
	[
		dg,
		vw,
		T,
		Ib,
		C
	],
	[
		[() => FB, { [N]: fg }],
		[() => JV, { [N]: Gw }],
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], xL = [
	3,
	P,
	bm,
	0,
	[T, yT],
	[[0, {
		[A]: "NextToken",
		[N]: LM
	}], [() => XV, {
		[A]: "SubnetSet",
		[N]: IP
	}]]
], SL = [
	3,
	P,
	jm,
	0,
	[
		fd,
		O,
		C
	],
	[
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	2
], CL = [
	3,
	P,
	Mm,
	0,
	[
		Zm,
		Qm,
		Th,
		O
	],
	[
		[() => $F, {
			[A]: "EnableDnsHostnames",
			[N]: $O
		}],
		[() => $F, {
			[A]: "EnableDnsSupport",
			[N]: ek
		}],
		[() => $F, {
			[A]: "EnableNetworkAddressUsageMetrics",
			[N]: _k
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}]
	]
], wL = [
	3,
	P,
	Im,
	0,
	[
		dg,
		xE,
		T,
		Ib,
		C
	],
	[
		[() => FB, { [N]: fg }],
		[() => sH, { [N]: O }],
		0,
		1,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], TL = [
	3,
	P,
	Lm,
	0,
	[T, HE],
	[[0, {
		[A]: "NextToken",
		[N]: LM
	}], [() => lH, {
		[A]: "VpcSet",
		[N]: DF
	}]]
], EL = [
	3,
	P,
	vp,
	0,
	[
		E_,
		O,
		C
	],
	[
		[0, {
			[A]: "InternetGatewayId",
			[N]: NA
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	2
], DL = [
	3,
	P,
	Zf,
	0,
	[
		yu,
		pS,
		C
	],
	[
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], OL = [
	3,
	P,
	am,
	0,
	[yu, C],
	[[0, {
		[A]: "AssociationId",
		[N]: sD
	}], [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], kL = [
	3,
	P,
	Pp,
	0,
	[
		Sw,
		Jf,
		WT
	],
	[
		[1, {
			[A]: "SizeInGB",
			[N]: fP
		}],
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[0, {
			[A]: "Type",
			[N]: oF
		}]
	]
], AL = [
	3,
	P,
	Um,
	0,
	[
		Zp,
		jy,
		Bw,
		NE,
		PE,
		Iy,
		HT,
		Rx,
		qu,
		$h,
		vE,
		Qu,
		Km
	],
	[
		[2, {
			[A]: "DeleteOnTermination",
			[N]: IO
		}],
		[1, {
			[A]: "Iops",
			[N]: wj
		}],
		[0, {
			[A]: "SnapshotId",
			[N]: SP
		}],
		[1, {
			[A]: "VolumeSize",
			[N]: EF
		}],
		[0, {
			[A]: "VolumeType",
			[N]: OF
		}],
		[0, {
			[A]: "KmsKeyId",
			[N]: Oj
		}],
		[1, {
			[A]: "Throughput",
			[N]: iF
		}],
		[0, {
			[A]: "OutpostArn",
			[N]: BM
		}],
		[0, {
			[A]: "AvailabilityZone",
			[N]: DD
		}],
		[2, {
			[A]: "Encrypted",
			[N]: Lk
		}],
		1,
		0,
		1
	]
], jL = [
	3,
	P,
	Jm,
	0,
	[
		Km,
		gd,
		kd,
		Sd,
		gb,
		Vb,
		Ob
	],
	[
		[1, {
			[A]: "EbsCardIndex",
			[N]: XO
		}],
		[1, {
			[A]: "BaselineBandwidthInMbps",
			[N]: LD
		}],
		[1, {
			[A]: "BaselineThroughputInMBps",
			[N]: WD
		}],
		[1, {
			[A]: "BaselineIops",
			[N]: zD
		}],
		[1, {
			[A]: "MaximumBandwidthInMbps",
			[N]: Uj
		}],
		[1, {
			[A]: "MaximumThroughputInMBps",
			[N]: sM
		}],
		[1, {
			[A]: "MaximumIops",
			[N]: Xj
		}]
	]
], ML = [
	3,
	P,
	Sh,
	0,
	[
		Mh,
		Jh,
		Dh,
		Mx,
		Cb,
		Su,
		wb,
		Ym
	],
	[
		[0, {
			[A]: "EbsOptimizedSupport",
			[N]: Sk
		}],
		[0, {
			[A]: "EncryptionSupport",
			[N]: Nk
		}],
		[() => PL, {
			[A]: "EbsOptimizedInfo",
			[N]: yk
		}],
		[0, {
			[A]: "NvmeSupport",
			[N]: PM
		}],
		[1, {
			[A]: "MaximumEbsAttachments",
			[N]: Gj
		}],
		[0, {
			[A]: "AttachmentLimitType",
			[N]: uD
		}],
		[1, {
			[A]: "MaximumEbsCards",
			[N]: Kj
		}],
		[() => kB, {
			[A]: "EbsCardSet",
			[N]: ZO
		}]
	]
], NL = [
	3,
	P,
	bh,
	0,
	[
		Ku,
		Zp,
		_T,
		bE,
		Nu,
		EE,
		Gx,
		Km
	],
	[
		[4, {
			[A]: "AttachTime",
			[N]: ED
		}],
		[2, {
			[A]: "DeleteOnTermination",
			[N]: IO
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[0, {
			[A]: "VolumeId",
			[N]: yF
		}],
		[0, {
			[A]: "AssociatedResource",
			[N]: _D
		}],
		[0, {
			[A]: "VolumeOwnerId",
			[N]: SF
		}],
		[() => hz, {
			[A]: "Operator",
			[N]: WM
		}],
		[1, {
			[A]: "EbsCardIndex",
			[N]: XO
		}]
	]
], PL = [
	3,
	P,
	Dh,
	0,
	[
		gd,
		kd,
		Sd,
		gb,
		Vb,
		Ob
	],
	[
		[1, {
			[A]: "BaselineBandwidthInMbps",
			[N]: LD
		}],
		[1, {
			[A]: "BaselineThroughputInMBps",
			[N]: WD
		}],
		[1, {
			[A]: "BaselineIops",
			[N]: zD
		}],
		[1, {
			[A]: "MaximumBandwidthInMbps",
			[N]: Uj
		}],
		[1, {
			[A]: "MaximumThroughputInMBps",
			[N]: sM
		}],
		[1, {
			[A]: "MaximumIops",
			[N]: Xj
		}]
	]
], FL = [
	3,
	P,
	Ch,
	0,
	[Tb],
	[[1, {
		[A]: "MaximumEfaInterfaces",
		[N]: qj
	}]]
], IL = [
	3,
	P,
	nh,
	0,
	[
		ch,
		rh,
		ah,
		oh
	],
	[
		[0, {
			[A]: "ElasticGpuId",
			[N]: sk
		}],
		[0, {
			[A]: "ElasticGpuAssociationId",
			[N]: rk
		}],
		[0, {
			[A]: "ElasticGpuAssociationState",
			[N]: ik
		}],
		[0, {
			[A]: "ElasticGpuAssociationTime",
			[N]: ok
		}]
	]
], LL = [
	3,
	P,
	lh,
	0,
	[WT],
	[0],
	1
], RL = [
	3,
	P,
	dh,
	0,
	[WT, Jf],
	[0, 1],
	1
], zL = [
	3,
	P,
	fh,
	0,
	[
		_h,
		ph,
		hh,
		gh
	],
	[
		[0, {
			[A]: "ElasticInferenceAcceleratorArn",
			[N]: ck
		}],
		[0, {
			[A]: "ElasticInferenceAcceleratorAssociationId",
			[N]: lk
		}],
		[0, {
			[A]: "ElasticInferenceAcceleratorAssociationState",
			[N]: uk
		}],
		[4, {
			[A]: "ElasticInferenceAcceleratorAssociationTime",
			[N]: fk
		}]
	]
], BL = [
	3,
	P,
	Hh,
	0,
	[Bh, Gh],
	[2, () => VL]
], VL = [
	3,
	P,
	Kh,
	0,
	[Wh],
	[2]
], HL = [
	3,
	P,
	Nh,
	0,
	[Qh],
	[[2, {
		[A]: "Enabled",
		[N]: Ik
	}]]
], UL = [
	3,
	P,
	jh,
	0,
	[Qh],
	[2]
], WL = [
	3,
	P,
	fg,
	0,
	[Qb, zE],
	[0, [() => iH, { [N]: iE }]]
], GL = [
	3,
	P,
	ng,
	0,
	[
		Qb,
		Kb,
		Jf,
		kb
	],
	[
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[0, {
			[A]: "Manufacturer",
			[N]: lM
		}],
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[() => KL, {
			[A]: "MemoryInfo",
			[N]: Zj
		}]
	]
], KL = [
	3,
	P,
	ig,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], qL = [
	3,
	P,
	og,
	0,
	[pg, xT],
	[[() => IB, {
		[A]: "Fpgas",
		[N]: Gk
	}], [1, {
		[A]: "TotalFpgaMemoryInMiB",
		[N]: GP
	}]]
], JL = [
	3,
	P,
	gg,
	0,
	[
		j_,
		fb,
		C
	],
	[
		0,
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], YL = [
	3,
	P,
	_g,
	0,
	[
		j_,
		UT,
		Kx
	],
	[
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[4, {
			[A]: "Timestamp",
			[N]: aF
		}],
		[0, {
			[A]: "Output",
			[N]: GM
		}]
	]
], XL = [
	3,
	P,
	yg,
	0,
	[
		Qb,
		Kb,
		Jf,
		eb,
		Ng,
		KE,
		kb
	],
	[
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[0, {
			[A]: "Manufacturer",
			[N]: lM
		}],
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[1, {
			[A]: "LogicalGpuCount",
			[N]: Ij
		}],
		[1, {
			[A]: "GpuPartitionSize",
			[N]: $k
		}],
		[() => uH, {
			[A]: "WorkloadSet",
			[N]: FF
		}],
		[() => ZL, {
			[A]: "MemoryInfo",
			[N]: Zj
		}]
	]
], ZL = [
	3,
	P,
	xg,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], QL = [
	3,
	P,
	Tg,
	0,
	[Fg, CT],
	[[() => LB, {
		[A]: "Gpus",
		[N]: nA
	}], [1, {
		[A]: "TotalGpuMemoryInMiB",
		[N]: qP
	}]]
], $L = [
	3,
	P,
	Dg,
	0,
	[w, kg],
	[[0, {
		[A]: "GroupId",
		[N]: Yk
	}], [0, {
		[A]: "GroupName",
		[N]: Zk
	}]]
], eR = [
	3,
	P,
	zg,
	0,
	[qf],
	[[2, {
		[A]: "Configured",
		[N]: SO
	}]]
], tR = [
	3,
	P,
	Bg,
	0,
	[qf],
	[2]
], nR = [
	3,
	P,
	F_,
	0,
	[cd, Yg],
	[[0, {
		[A]: "Arn",
		[N]: MD
	}], [0, {
		[A]: "Id",
		[N]: hA
	}]]
], rR = [
	3,
	P,
	B_,
	0,
	[cd, Qb],
	[[0, {
		[A]: "Arn",
		[N]: MD
	}], [0, {
		[A]: "Name",
		[N]: mM
	}]]
], iR = [
	3,
	P,
	Oy,
	0,
	[
		uS,
		eE,
		bd,
		Bm,
		Yh,
		Jg,
		yv,
		Qb,
		XS,
		ZS,
		$w,
		sT,
		D,
		LE,
		Cd,
		zT,
		Em,
		ly,
		Tw,
		$p,
		rb,
		a_,
		Cw,
		Ow,
		ug,
		jS,
		wy,
		_y,
		K_,
		Y_,
		E,
		zx,
		Bd,
		GS,
		nS,
		ld,
		vy,
		Fy,
		oC,
		VS
	],
	[
		[0, {
			[A]: "PlatformDetails",
			[N]: tN
		}],
		[0, {
			[A]: "UsageOperation",
			[N]: uF
		}],
		[() => CB, {
			[A]: "BlockDeviceMapping",
			[N]: RD
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[2, {
			[A]: "EnaSupport",
			[N]: Pk
		}],
		[0, {
			[A]: "Hypervisor",
			[N]: iA
		}],
		[0, {
			[A]: "ImageOwnerAlias",
			[N]: UA
		}],
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[0, {
			[A]: "RootDeviceName",
			[N]: ON
		}],
		[0, {
			[A]: "RootDeviceType",
			[N]: kN
		}],
		[0, {
			[A]: "SriovNetSupport",
			[N]: kP
		}],
		[() => qz, {
			[A]: "StateReason",
			[N]: MP
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "VirtualizationType",
			[N]: AF
		}],
		[0, {
			[A]: "BootMode",
			[N]: BD
		}],
		[0, {
			[A]: "TpmSupport",
			[N]: tF
		}],
		[0, {
			[A]: "DeprecationTime",
			[N]: HO
		}],
		[0, {
			[A]: "ImdsSupport",
			[N]: uj
		}],
		[0, {
			[A]: "SourceInstanceId",
			[N]: pP
		}],
		[0, {
			[A]: "DeregistrationProtection",
			[N]: RO
		}],
		[0, {
			[A]: "LastLaunchedTime",
			[N]: Rj
		}],
		[2, {
			[A]: "ImageAllowed",
			[N]: CA
		}],
		[0, {
			[A]: "SourceImageId",
			[N]: hP
		}],
		[0, {
			[A]: "SourceImageRegion",
			[N]: _P
		}],
		[2, {
			[A]: "FreeTierEligible",
			[N]: Uk
		}],
		[0, {
			[A]: "PublicSsmParameterName",
			[N]: mN
		}],
		[() => UB, {
			[A]: "ImageWatermarkSet",
			[N]: Cj
		}],
		[() => RR, {
			[A]: "InstanceTypeSpecification",
			[N]: _j
		}],
		[0, {
			[A]: "ImageId",
			[N]: RA
		}],
		[0, {
			[A]: "ImageLocation",
			[N]: zA
		}],
		[0, {
			[A]: "ImageState",
			[N]: lj
		}],
		[0, {
			[A]: "ImageOwnerId",
			[N]: WA
		}],
		[0, {
			[A]: "CreationDate",
			[N]: QD
		}],
		[2, {
			[A]: "IsPublic",
			[N]: nj
		}],
		[() => NV, {
			[A]: "ProductCodes",
			[N]: YM
		}],
		[0, {
			[A]: "Architecture",
			[N]: ND
		}],
		[0, {
			[A]: "ImageType",
			[N]: bj
		}],
		[0, {
			[A]: "KernelId",
			[N]: Dj
		}],
		[0, {
			[A]: "RamdiskId",
			[N]: PN
		}],
		[0, {
			[A]: "Platform",
			[N]: SN
		}]
	]
], aR = [
	3,
	P,
	Ey,
	0,
	[
		WE,
		Ow,
		Cw,
		xw,
		UE
	],
	[
		[0, {
			[A]: "WatermarkKey",
			[N]: PF
		}],
		[0, {
			[A]: "SourceImageRegion",
			[N]: _P
		}],
		[0, {
			[A]: "SourceImageId",
			[N]: hP
		}],
		[4, {
			[A]: "SourceImageCreationTime",
			[N]: dP
		}],
		[4, {
			[A]: "WatermarkCreationTime",
			[N]: NF
		}]
	]
], oR = [
	3,
	P,
	t_,
	0,
	[ad, TT],
	[[() => WB, {
		[A]: "Accelerators",
		[N]: AD
	}], [1, {
		[A]: "TotalInferenceMemoryInMiB",
		[N]: JP
	}]]
], sR = [
	3,
	P,
	h_,
	0,
	[
		Jf,
		Qb,
		Kb,
		kb
	],
	[
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[0, {
			[A]: "Manufacturer",
			[N]: lM
		}],
		[() => cR, {
			[A]: "MemoryInfo",
			[N]: Zj
		}]
	]
], cR = [
	3,
	P,
	__,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], lR = [
	3,
	P,
	ky,
	0,
	[
		ld,
		bd,
		Pf,
		Eh,
		Yh,
		Jg,
		F_,
		Z_,
		sh,
		vh,
		Ex,
		Rx,
		XS,
		ZS,
		gw,
		$C,
		Dw,
		$w,
		sT,
		D,
		LE,
		cf,
		Fd,
		ff,
		vf,
		zg,
		pb,
		Mb,
		Nh,
		Cd,
		uS,
		eE,
		tE,
		aS,
		s_,
		zT,
		Nb,
		Wd,
		kx,
		Gx,
		Rw,
		j_,
		K_,
		E,
		iS,
		lS,
		fT,
		Ry,
		xu,
		nS,
		py,
		db,
		HS,
		Fy,
		oC,
		VS,
		Zb,
		Gw,
		O,
		_S,
		yS
	],
	[
		[0, {
			[A]: "Architecture",
			[N]: ND
		}],
		[() => GB, {
			[A]: "BlockDeviceMapping",
			[N]: RD
		}],
		[0, {
			[A]: "ClientToken",
			[N]: _O
		}],
		[2, {
			[A]: "EbsOptimized",
			[N]: vk
		}],
		[2, {
			[A]: "EnaSupport",
			[N]: Pk
		}],
		[0, {
			[A]: "Hypervisor",
			[N]: iA
		}],
		[() => nR, {
			[A]: "IamInstanceProfile",
			[N]: IA
		}],
		[0, {
			[A]: "InstanceLifecycle",
			[N]: BA
		}],
		[() => AB, {
			[A]: "ElasticGpuAssociationSet",
			[N]: ak
		}],
		[() => MB, {
			[A]: "ElasticInferenceAcceleratorAssociationSet",
			[N]: dk
		}],
		[() => ZB, {
			[A]: "NetworkInterfaceSet",
			[N]: DM
		}],
		[0, {
			[A]: "OutpostArn",
			[N]: BM
		}],
		[0, {
			[A]: "RootDeviceName",
			[N]: ON
		}],
		[0, {
			[A]: "RootDeviceType",
			[N]: kN
		}],
		[() => RB, {
			[A]: "GroupSet",
			[N]: tA
		}],
		[2, {
			[A]: "SourceDestCheck",
			[N]: nP
		}],
		[0, {
			[A]: "SpotInstanceRequestId",
			[N]: vP
		}],
		[0, {
			[A]: "SriovNetSupport",
			[N]: kP
		}],
		[() => qz, {
			[A]: "StateReason",
			[N]: MP
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "VirtualizationType",
			[N]: AF
		}],
		[() => _I, {
			[A]: "CpuOptions",
			[N]: cO
		}],
		[0, {
			[A]: "CapacityBlockId",
			[N]: YD
		}],
		[0, {
			[A]: "CapacityReservationId",
			[N]: dO
		}],
		[() => fI, {
			[A]: "CapacityReservationSpecification",
			[N]: mO
		}],
		[() => eR, {
			[A]: "HibernationOptions",
			[N]: cA
		}],
		[() => vV, {
			[A]: "LicenseSet",
			[N]: zj
		}],
		[() => bR, {
			[A]: "MetadataOptions",
			[N]: eM
		}],
		[() => HL, {
			[A]: "EnclaveOptions",
			[N]: Ck
		}],
		[0, {
			[A]: "BootMode",
			[N]: BD
		}],
		[0, {
			[A]: "PlatformDetails",
			[N]: tN
		}],
		[0, {
			[A]: "UsageOperation",
			[N]: uF
		}],
		[4, {
			[A]: "UsageOperationUpdateTime",
			[N]: dF
		}],
		[() => xz, {
			[A]: "PrivateDnsNameOptions",
			[N]: ZM
		}],
		[0, {
			[A]: "Ipv6Address",
			[N]: TA
		}],
		[0, {
			[A]: "TpmSupport",
			[N]: tF
		}],
		[() => gR, {
			[A]: "MaintenanceOptions",
			[N]: tM
		}],
		[0, {
			[A]: "CurrentInstanceBootMode",
			[N]: nO
		}],
		[() => TR, {
			[A]: "NetworkPerformanceOptions",
			[N]: jM
		}],
		[() => hz, {
			[A]: "Operator",
			[N]: WM
		}],
		[() => eV, {
			[A]: "SecondaryInterfaceSet",
			[N]: bP
		}],
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[0, {
			[A]: "ImageId",
			[N]: RA
		}],
		[() => NR, {
			[A]: "InstanceState",
			[N]: fj
		}],
		[0, {
			[A]: "PrivateDnsName",
			[N]: $M
		}],
		[0, {
			[A]: "DnsName",
			[N]: PO
		}],
		[0, {
			[A]: "Reason",
			[N]: YN
		}],
		[0, {
			[A]: "KeyName",
			[N]: Aj
		}],
		[1, {
			[A]: "AmiLaunchIndex",
			[N]: lD
		}],
		[() => NV, {
			[A]: "ProductCodes",
			[N]: YM
		}],
		[0, {
			[A]: "InstanceType",
			[N]: hj
		}],
		[4, {
			[A]: "LaunchTime",
			[N]: Bj
		}],
		[() => gz, {
			[A]: "Placement",
			[N]: CN
		}],
		[0, {
			[A]: "KernelId",
			[N]: Dj
		}],
		[0, {
			[A]: "RamdiskId",
			[N]: PN
		}],
		[0, {
			[A]: "Platform",
			[N]: SN
		}],
		[() => rz, {
			[A]: "Monitoring",
			[N]: pM
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[0, {
			[A]: "IpAddress",
			[N]: wA
		}]
	]
], uR = [
	3,
	P,
	$g,
	0,
	[Bh, Gh],
	[[2, {
		[A]: "EnaSrdEnabled",
		[N]: Dk
	}], [() => dR, {
		[A]: "EnaSrdUdpSpecification",
		[N]: jk
	}]]
], dR = [
	3,
	P,
	e_,
	0,
	[Wh],
	[[2, {
		[A]: "EnaSrdUdpEnabled",
		[N]: Ak
	}]]
], fR = [
	3,
	P,
	c_,
	0,
	[Hp, Zh],
	[[0, {
		[A]: "DeviceName",
		[N]: MO
	}], [() => NL, {
		[A]: "Ebs",
		[N]: Fk
	}]]
], pR = [
	3,
	P,
	V_,
	0,
	[Hv],
	[[0, {
		[A]: "Ipv4Prefix",
		[N]: $A
	}]]
], mR = [
	3,
	P,
	M_,
	0,
	[s_, Ov],
	[[0, {
		[A]: "Ipv6Address",
		[N]: TA
	}], [2, {
		[A]: "IsPrimaryIpv6",
		[N]: JA
	}]]
], hR = [
	3,
	P,
	H_,
	0,
	[zv],
	[[0, {
		[A]: "Ipv6Prefix",
		[N]: tj
	}]]
], gR = [
	3,
	P,
	ev,
	0,
	[Pu, hC],
	[[0, {
		[A]: "AutoRecovery",
		[N]: vD
	}], [0, {
		[A]: "RebootMigration",
		[N]: RN
	}]]
], _R = [
	3,
	P,
	tv,
	0,
	[Pu],
	[0]
], vR = [
	3,
	P,
	nv,
	0,
	[Hb, tT],
	[0, () => Wz]
], yR = [
	3,
	P,
	rv,
	0,
	[
		Gg,
		Hg,
		Lg,
		Vg,
		sv
	],
	[
		0,
		1,
		0,
		0,
		0
	]
], bR = [
	3,
	P,
	iv,
	0,
	[
		E,
		Gg,
		Hg,
		Lg,
		Vg,
		sv
	],
	[
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "HttpTokens",
			[N]: pA
		}],
		[1, {
			[A]: "HttpPutResponseHopLimit",
			[N]: uA
		}],
		[0, {
			[A]: "HttpEndpoint",
			[N]: oA
		}],
		[0, {
			[A]: "HttpProtocolIpv6",
			[N]: lA
		}],
		[0, {
			[A]: "InstanceMetadataTags",
			[N]: VA
		}]
	]
], xR = [
	3,
	P,
	lv,
	0,
	[
		dd,
		pd,
		Bm,
		mg,
		Xg,
		hb,
		wx,
		zx,
		iS,
		_S,
		vS,
		$C,
		_T,
		Gw,
		O,
		xy,
		Vv,
		Fv,
		Ff,
		Gx
	],
	[
		[() => SR, {
			[A]: "Association",
			[N]: PD
		}],
		[() => CR, {
			[A]: "Attachment",
			[N]: FD
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[() => RB, {
			[A]: "GroupSet",
			[N]: tA
		}],
		[() => JB, {
			[A]: "Ipv6AddressesSet",
			[N]: SA
		}],
		[0, {
			[A]: "MacAddress",
			[N]: Hj
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[0, {
			[A]: "PrivateDnsName",
			[N]: $M
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[() => $B, {
			[A]: "PrivateIpAddressesSet",
			[N]: iN
		}],
		[2, {
			[A]: "SourceDestCheck",
			[N]: nP
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "InterfaceType",
			[N]: Sj
		}],
		[() => qB, {
			[A]: "Ipv4PrefixSet",
			[N]: YA
		}],
		[() => YB, {
			[A]: "Ipv6PrefixSet",
			[N]: XA
		}],
		[() => gI, {
			[A]: "ConnectionTrackingConfiguration",
			[N]: vO
		}],
		[() => hz, {
			[A]: "Operator",
			[N]: WM
		}]
	]
], SR = [
	3,
	P,
	uv,
	0,
	[
		Ud,
		lf,
		bv,
		lS,
		pS
	],
	[
		[0, {
			[A]: "CarrierIp",
			[N]: tO
		}],
		[0, {
			[A]: "CustomerOwnedIp",
			[N]: lO
		}],
		[0, {
			[A]: "IpOwnerId",
			[N]: KA
		}],
		[0, {
			[A]: "PublicDnsName",
			[N]: eN
		}],
		[0, {
			[A]: "PublicIp",
			[N]: rN
		}]
	]
], CR = [
	3,
	P,
	dv,
	0,
	[
		Ku,
		bu,
		Zp,
		fp,
		_T,
		tx,
		Vh,
		Fh
	],
	[
		[4, {
			[A]: "AttachTime",
			[N]: ED
		}],
		[0, {
			[A]: "AttachmentId",
			[N]: cD
		}],
		[2, {
			[A]: "DeleteOnTermination",
			[N]: IO
		}],
		[1, {
			[A]: "DeviceIndex",
			[N]: AO
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[1, {
			[A]: "NetworkCardIndex",
			[N]: _M
		}],
		[() => uR, {
			[A]: "EnaSrdSpecification",
			[N]: Ok
		}],
		[1, {
			[A]: "EnaQueueCount",
			[N]: wk
		}]
	]
], wR = [
	3,
	P,
	pv,
	0,
	[
		Tu,
		Zp,
		Bm,
		fp,
		mg,
		Qg,
		Xg,
		wx,
		_S,
		vS,
		iT,
		Gw,
		lu,
		xy,
		tx,
		Vv,
		Cv,
		Fv,
		Sv,
		SS,
		Vh,
		Lf,
		Fh
	],
	[
		[2, {
			[A]: "AssociatePublicIpAddress",
			[N]: fD
		}],
		[2, {
			[A]: "DeleteOnTermination",
			[N]: IO
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[1, {
			[A]: "DeviceIndex",
			[N]: AO
		}],
		[() => UV, { [N]: iw }],
		[1, {
			[A]: "Ipv6AddressCount",
			[N]: _A
		}],
		[() => JB, {
			[A]: "Ipv6Addresses",
			[N]: SA
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[() => MV, {
			[A]: "PrivateIpAddresses",
			[N]: iN
		}],
		[1, {
			[A]: "SecondaryPrivateIpAddressCount",
			[N]: AP
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		2,
		0,
		1,
		[() => fV, { [N]: Hv }],
		1,
		[() => pV, { [N]: zv }],
		1,
		2,
		() => BL,
		() => hI,
		1
	]
], TR = [
	3,
	P,
	_v,
	0,
	[Ad],
	[[0, {
		[A]: "BandwidthWeighting",
		[N]: GD
	}]]
], ER = [
	3,
	P,
	vv,
	0,
	[Ad],
	[0]
], DR = [
	3,
	P,
	Ev,
	0,
	[
		dd,
		US,
		iS,
		_S
	],
	[
		[() => SR, {
			[A]: "Association",
			[N]: PD
		}],
		[2, {
			[A]: "Primary",
			[N]: wN
		}],
		[0, {
			[A]: "PrivateDnsName",
			[N]: $M
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}]
	]
], OR = [
	3,
	P,
	oy,
	0,
	[
		pd,
		hb,
		ww,
		zx,
		vS,
		$C,
		_T,
		uT,
		Qw,
		xy
	],
	[
		[() => kR, {
			[A]: "Attachment",
			[N]: FD
		}],
		[0, {
			[A]: "MacAddress",
			[N]: Hj
		}],
		[0, {
			[A]: "SecondaryInterfaceId",
			[N]: mP
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[() => tV, {
			[A]: "PrivateIpAddressSet",
			[N]: aN
		}],
		[2, {
			[A]: "SourceDestCheck",
			[N]: nP
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[0, {
			[A]: "SecondarySubnetId",
			[N]: FP
		}],
		[0, {
			[A]: "SecondaryNetworkId",
			[N]: DP
		}],
		[0, {
			[A]: "InterfaceType",
			[N]: Sj
		}]
	]
], kR = [
	3,
	P,
	Qv,
	0,
	[
		Ku,
		bu,
		Zp,
		fp,
		_T,
		tx
	],
	[
		[4, {
			[A]: "AttachTime",
			[N]: ED
		}],
		[0, {
			[A]: "AttachmentId",
			[N]: cD
		}],
		[2, {
			[A]: "DeleteOnTermination",
			[N]: IO
		}],
		[1, {
			[A]: "DeviceIndex",
			[N]: AO
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[1, {
			[A]: "NetworkCardIndex",
			[N]: _M
		}]
	]
], AR = [
	3,
	P,
	ey,
	0,
	[_S],
	[[0, {
		[A]: "PrivateIpAddress",
		[N]: oN
	}]]
], jR = [
	3,
	P,
	ry,
	0,
	[_S],
	[0],
	1
], MR = [
	3,
	P,
	ay,
	0,
	[
		Zp,
		fp,
		vS,
		mS,
		uT,
		xy,
		tx
	],
	[
		2,
		1,
		[() => nV, { [N]: _S }],
		1,
		0,
		0,
		1
	]
], NR = [
	3,
	P,
	uy,
	0,
	[Kf, Qb],
	[[1, {
		[A]: "Code",
		[N]: xO
	}], [0, {
		[A]: "Name",
		[N]: mM
	}]]
], PR = [
	3,
	P,
	Xv,
	0,
	[
		j_,
		Nf,
		PS
	],
	[
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[() => NR, {
			[A]: "CurrentState",
			[N]: gO
		}],
		[() => NR, {
			[A]: "PreviousState",
			[N]: _N
		}]
	]
], FR = [
	3,
	P,
	sy,
	0,
	[
		IT,
		Vm,
		Mx,
		Jh
	],
	[
		[1, {
			[A]: "TotalSizeInGB",
			[N]: eF
		}],
		[() => OB, {
			[A]: "Disks",
			[N]: JO
		}],
		[0, {
			[A]: "NvmeSupport",
			[N]: PM
		}],
		[0, {
			[A]: "EncryptionSupport",
			[N]: Nk
		}]
	]
], IR = [
	3,
	P,
	hy,
	0,
	[
		py,
		Hd,
		ug,
		pT,
		oT,
		hT,
		Ed,
		Jg,
		wS,
		cE,
		kb,
		cy,
		sy,
		Sh,
		Dx,
		Tg,
		og,
		dS,
		t_,
		Wg,
		Od,
		dp,
		Ou,
		XC,
		dx,
		Px,
		Nx,
		mb,
		Ox,
		NS,
		mC,
		Nw
	],
	[
		[0, {
			[A]: "InstanceType",
			[N]: hj
		}],
		[2, {
			[A]: "CurrentGeneration",
			[N]: eO
		}],
		[2, {
			[A]: "FreeTierEligible",
			[N]: Uk
		}],
		[() => nH, {
			[A]: "SupportedUsageClasses",
			[N]: RP
		}],
		[() => RV, {
			[A]: "SupportedRootDeviceTypes",
			[N]: jP
		}],
		[() => aH, {
			[A]: "SupportedVirtualizationTypes",
			[N]: zP
		}],
		[2, {
			[A]: "BareMetal",
			[N]: VD
		}],
		[0, {
			[A]: "Hypervisor",
			[N]: iA
		}],
		[() => Cz, {
			[A]: "ProcessorInfo",
			[N]: cN
		}],
		[() => iB, {
			[A]: "VCpuInfo",
			[N]: hF
		}],
		[() => ez, {
			[A]: "MemoryInfo",
			[N]: Zj
		}],
		[2, {
			[A]: "InstanceStorageSupported",
			[N]: sj
		}],
		[() => FR, {
			[A]: "InstanceStorageInfo",
			[N]: oj
		}],
		[() => ML, {
			[A]: "EbsInfo",
			[N]: mk
		}],
		[() => cz, {
			[A]: "NetworkInfo",
			[N]: kM
		}],
		[() => QL, {
			[A]: "GpuInfo",
			[N]: Jk
		}],
		[() => qL, {
			[A]: "FpgaInfo",
			[N]: Bk
		}],
		[() => _z, {
			[A]: "PlacementGroupInfo",
			[N]: nN
		}],
		[() => oR, {
			[A]: "InferenceAcceleratorInfo",
			[N]: vA
		}],
		[2, {
			[A]: "HibernationSupported",
			[N]: fA
		}],
		[2, {
			[A]: "BurstablePerformanceSupported",
			[N]: UD
		}],
		[2, {
			[A]: "DedicatedHostsSupported",
			[N]: kO
		}],
		[2, {
			[A]: "AutoRecoverySupported",
			[N]: hD
		}],
		[() => TB, {
			[A]: "SupportedBootModes",
			[N]: eP
		}],
		[0, {
			[A]: "NitroEnclavesSupport",
			[N]: bM
		}],
		[0, {
			[A]: "NitroTpmSupport",
			[N]: IM
		}],
		[() => pz, {
			[A]: "NitroTpmInfo",
			[N]: FM
		}],
		[() => ZR, {
			[A]: "MediaAcceleratorInfo",
			[N]: Vj
		}],
		[() => fz, {
			[A]: "NeuronInfo",
			[N]: AM
		}],
		[0, {
			[A]: "PhcSupport",
			[N]: gN
		}],
		[0, {
			[A]: "RebootMigrationSupport",
			[N]: LN
		}],
		[2, {
			[A]: "SupportedInRegion",
			[N]: yP
		}]
	]
], LR = [
	3,
	P,
	gy,
	0,
	[py],
	[[0, {
		[A]: "InstanceType",
		[N]: hj
	}]]
], RR = [
	3,
	P,
	_y,
	0,
	[Fw, QT],
	[[() => QV, {
		[A]: "SupportedInstanceTypeSet",
		[N]: xP
	}], [() => tH, {
		[A]: "UnsupportedInstanceTypeSet",
		[N]: lF
	}]]
], zR = [
	3,
	P,
	x_,
	0,
	[
		md,
		E_,
		zx,
		D
	],
	[
		[() => oV, {
			[A]: "AttachmentSet",
			[N]: wD
		}],
		[0, {
			[A]: "InternetGatewayId",
			[N]: NA
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}]
	]
], BR = [
	3,
	P,
	S_,
	0,
	[E, O],
	[[0, {
		[A]: "State",
		[N]: VP
	}], [0, {
		[A]: "VpcId",
		[N]: M
	}]]
], VR = [
	3,
	P,
	Lv,
	0,
	[
		Rv,
		lg,
		MT,
		JT,
		Kv,
		Jv,
		kS
	],
	[
		[0, {
			[A]: "IpProtocol",
			[N]: ZA
		}],
		[1, {
			[A]: "FromPort",
			[N]: Hk
		}],
		[1, {
			[A]: "ToPort",
			[N]: ZP
		}],
		[() => rH, {
			[A]: "Groups",
			[N]: rA
		}],
		[() => dV, {
			[A]: "IpRanges",
			[N]: ij
		}],
		[() => mV, {
			[A]: "Ipv6Ranges",
			[N]: aj
		}],
		[() => jV, {
			[A]: "PrefixListIds",
			[N]: fN
		}]
	]
], HR = [
	3,
	P,
	qv,
	0,
	[Bm, Xd],
	[[0, {
		[A]: "Description",
		[N]: qO
	}], [0, {
		[A]: "CidrIp",
		[N]: rO
	}]]
], UR = [
	3,
	P,
	Nv,
	0,
	[Hv],
	[0]
], WR = [
	3,
	P,
	Pv,
	0,
	[zv],
	[0]
], GR = [
	3,
	P,
	Yv,
	0,
	[Bm, Zd],
	[[0, {
		[A]: "Description",
		[N]: qO
	}], [0, {
		[A]: "CidrIpv6",
		[N]: iO
	}]]
], KR = [
	3,
	P,
	qy,
	0,
	[
		Hy,
		D,
		Ry,
		Py,
		Ly
	],
	[
		[0, {
			[A]: "KeyPairId",
			[N]: jj
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "KeyName",
			[N]: Aj
		}],
		[0, {
			[A]: "KeyFingerprint",
			[N]: Ej
		}],
		[() => WF, {
			[A]: "KeyMaterial",
			[N]: kj
		}]
	]
], qR = [
	3,
	P,
	Gy,
	0,
	[
		Hy,
		Jy,
		D,
		ES,
		Vf,
		Ry,
		Py
	],
	[
		[0, {
			[A]: "KeyPairId",
			[N]: jj
		}],
		[0, {
			[A]: "KeyType",
			[N]: Nj
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "PublicKey",
			[N]: uN
		}],
		[4, {
			[A]: "CreateTime",
			[N]: bO
		}],
		[0, {
			[A]: "KeyName",
			[N]: Aj
		}],
		[0, {
			[A]: "KeyFingerprint",
			[N]: Ej
		}]
	]
], JR = [
	3,
	P,
	ub,
	0,
	[
		cb,
		lb,
		BE
	],
	[
		0,
		0,
		0
	]
], YR = [
	3,
	P,
	Qy,
	0,
	[Xy],
	[[0, {
		[A]: "LicenseConfigurationArn",
		[N]: Fj
	}]]
], XR = [
	3,
	P,
	Zy,
	0,
	[Xy],
	[0]
], ZR = [
	3,
	P,
	mb,
	0,
	[ad, AT],
	[[() => bV, {
		[A]: "Accelerators",
		[N]: AD
	}], [1, {
		[A]: "TotalMediaMemoryInMiB",
		[N]: YP
	}]]
], QR = [
	3,
	P,
	bb,
	0,
	[
		Jf,
		Qb,
		Kb,
		kb
	],
	[
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[0, {
			[A]: "Manufacturer",
			[N]: lM
		}],
		[() => $R, {
			[A]: "MemoryInfo",
			[N]: Zj
		}]
	]
], $R = [
	3,
	P,
	Sb,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], ez = [
	3,
	P,
	kb,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], tz = [
	3,
	P,
	Lb,
	0,
	[
		Gw,
		fu,
		Pb,
		_b,
		uf,
		$m,
		rS,
		zh,
		Lh,
		wh,
		Vp
	],
	[
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[() => $F, 0],
		[() => $F, 0],
		[() => $F, 0],
		0,
		[() => $F, 0],
		0,
		[() => $F, 0],
		[() => $F, 0],
		1,
		[() => $F, 0]
	],
	1
], nz = [
	3,
	P,
	Ub,
	0,
	[
		O,
		Zm,
		Qm,
		Th
	],
	[
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[() => $F, 0],
		[() => $F, 0],
		[() => $F, 0]
	],
	1
], rz = [
	3,
	P,
	Zb,
	0,
	[E],
	[[0, {
		[A]: "State",
		[N]: VP
	}]]
], iz = [
	3,
	P,
	fx,
	0,
	[
		Vf,
		Dm,
		tg,
		cg,
		px,
		yx,
		Xx,
		E,
		Gw,
		O,
		D,
		Bf,
		wu,
		Vu,
		Du,
		su,
		jC
	],
	[
		[4, {
			[A]: "CreateTime",
			[N]: bO
		}],
		[4, {
			[A]: "DeleteTime",
			[N]: UO
		}],
		[0, {
			[A]: "FailureCode",
			[N]: Rk
		}],
		[0, {
			[A]: "FailureMessage",
			[N]: Vk
		}],
		[() => xV, {
			[A]: "NatGatewayAddressSet",
			[N]: SM
		}],
		[0, {
			[A]: "NatGatewayId",
			[N]: CM
		}],
		[() => Ez, {
			[A]: "ProvisionedBandwidth",
			[N]: qM
		}],
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "ConnectivityType",
			[N]: yO
		}],
		[0, {
			[A]: "AvailabilityMode",
			[N]: dD
		}],
		[0, {
			[A]: "AutoScalingIps",
			[N]: bD
		}],
		[0, {
			[A]: "AutoProvisionZones",
			[N]: mD
		}],
		[() => SV, {
			[A]: "AttachedApplianceSet",
			[N]: eD
		}],
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}]
	]
], az = [
	3,
	P,
	_x,
	0,
	[
		_u,
		wx,
		CS,
		pS,
		yu,
		Uv,
		cg,
		_T,
		qu,
		Qu
	],
	[
		[0, {
			[A]: "AllocationId",
			[N]: rD
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "PrivateIp",
			[N]: lN
		}],
		[0, {
			[A]: "PublicIp",
			[N]: rN
		}],
		[0, {
			[A]: "AssociationId",
			[N]: sD
		}],
		[2, {
			[A]: "IsPrimary",
			[N]: rj
		}],
		[0, {
			[A]: "FailureMessage",
			[N]: Vk
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}],
		[0, {
			[A]: "AvailabilityZone",
			[N]: DD
		}],
		[0, {
			[A]: "AvailabilityZoneId",
			[N]: OD
		}]
	]
], oz = [
	3,
	P,
	mx,
	0,
	[
		WT,
		au,
		hE,
		Wu,
		Bb,
		tg,
		cg
	],
	[
		[0, {
			[A]: "Type",
			[N]: oF
		}],
		[0, {
			[A]: "ApplianceArn",
			[N]: tD
		}],
		[0, {
			[A]: "VpcEndpointId",
			[N]: vF
		}],
		[0, {
			[A]: "AttachmentState",
			[N]: TD
		}],
		[0, {
			[A]: "ModificationState",
			[N]: oM
		}],
		[0, {
			[A]: "FailureCode",
			[N]: Rk
		}],
		[0, {
			[A]: "FailureMessage",
			[N]: Vk
		}]
	]
], sz = [
	3,
	P,
	ix,
	0,
	[
		tx,
		Ax,
		jb,
		uu,
		hd,
		Zx,
		lp,
		Eb,
		Db,
		Sy
	],
	[
		[1, {
			[A]: "NetworkCardIndex",
			[N]: _M
		}],
		[0, {
			[A]: "NetworkPerformance",
			[N]: MM
		}],
		[1, {
			[A]: "MaximumNetworkInterfaces",
			[N]: $j
		}],
		[1, {
			[A]: "AdditionalFlexibleNetworkInterfaces",
			[N]: nD
		}],
		[1, {
			[A]: "BaselineBandwidthInGbps",
			[N]: ID
		}],
		[1, {
			[A]: "PeakBandwidthInGbps",
			[N]: JM
		}],
		[1, {
			[A]: "DefaultEnaQueueCountPerInterface",
			[N]: DO
		}],
		[1, {
			[A]: "MaximumEnaQueueCount",
			[N]: Jj
		}],
		[1, {
			[A]: "MaximumEnaQueueCountPerInterface",
			[N]: Yj
		}],
		[() => EV, {
			[A]: "InterfaceTypeSet",
			[N]: vj
		}]
	]
], cz = [
	3,
	P,
	Dx,
	0,
	[
		Ax,
		jb,
		Ab,
		Up,
		ex,
		n_,
		r_,
		fy,
		Yh,
		qh,
		Ch,
		xh,
		Uh,
		Md,
		ag,
		Ff,
		eT,
		zb,
		i_
	],
	[
		[0, {
			[A]: "NetworkPerformance",
			[N]: MM
		}],
		[1, {
			[A]: "MaximumNetworkInterfaces",
			[N]: $j
		}],
		[1, {
			[A]: "MaximumNetworkCards",
			[N]: Qj
		}],
		[1, {
			[A]: "DefaultNetworkCardIndex",
			[N]: NO
		}],
		[() => TV, {
			[A]: "NetworkCards",
			[N]: gM
		}],
		[1, {
			[A]: "Ipv4AddressesPerInterface",
			[N]: yA
		}],
		[1, {
			[A]: "Ipv6AddressesPerInterface",
			[N]: bA
		}],
		[2, {
			[A]: "Ipv6Supported",
			[N]: mj
		}],
		[0, {
			[A]: "EnaSupport",
			[N]: Pk
		}],
		[2, {
			[A]: "EfaSupported",
			[N]: Mk
		}],
		[() => FL, {
			[A]: "EfaInfo",
			[N]: hk
		}],
		[2, {
			[A]: "EncryptionInTransitSupported",
			[N]: pk
		}],
		[2, {
			[A]: "EnaSrdSupported",
			[N]: kk
		}],
		[() => SB, {
			[A]: "BandwidthWeightings",
			[N]: KD
		}],
		[0, {
			[A]: "FlexibleEnaQueuesSupport",
			[N]: zk
		}],
		[() => RI, {
			[A]: "ConnectionTrackingConfiguration",
			[N]: vO
		}],
		[2, {
			[A]: "SecondaryNetworkSupported",
			[N]: OP
		}],
		[1, {
			[A]: "MaximumSecondaryNetworkInterfaces",
			[N]: aM
		}],
		[1, {
			[A]: "Ipv4AddressesPerSecondaryInterface",
			[N]: xA
		}]
	]
], lz = [
	3,
	P,
	ox,
	0,
	[Jf, BE],
	[[1, {
		[A]: "Count",
		[N]: CO
	}], [1, {
		[A]: "Version",
		[N]: jF
	}]]
], uz = [
	3,
	P,
	sx,
	0,
	[
		Jf,
		Qb,
		$d,
		kb
	],
	[
		[1, {
			[A]: "Count",
			[N]: CO
		}],
		[0, {
			[A]: "Name",
			[N]: mM
		}],
		[() => lz, {
			[A]: "CoreInfo",
			[N]: oO
		}],
		[() => dz, {
			[A]: "MemoryInfo",
			[N]: Zj
		}]
	]
], dz = [
	3,
	P,
	lx,
	0,
	[Ew],
	[[1, {
		[A]: "SizeInMiB",
		[N]: gP
	}]]
], fz = [
	3,
	P,
	Ox,
	0,
	[ux, jT],
	[[() => DV, {
		[A]: "NeuronDevices",
		[N]: yM
	}], [1, {
		[A]: "TotalNeuronDeviceMemoryInMiB",
		[N]: XP
	}]]
], pz = [
	3,
	P,
	Nx,
	0,
	[gT],
	[[() => OV, {
		[A]: "SupportedVersions",
		[N]: BP
	}]]
], mz = [
	3,
	P,
	Hx,
	0,
	[Yx],
	[0]
], hz = [
	3,
	P,
	Ux,
	0,
	[
		qb,
		Yx,
		Ig
	],
	[
		[2, {
			[A]: "Managed",
			[N]: uM
		}],
		[0, {
			[A]: "Principal",
			[N]: KM
		}],
		[2, {
			[A]: "HiddenByDefault",
			[N]: aA
		}]
	]
], gz = [
	3,
	P,
	HS,
	0,
	[
		Qu,
		sd,
		kg,
		AS,
		Rg,
		VT,
		ew,
		Ug,
		w,
		qu
	],
	[
		[0, {
			[A]: "AvailabilityZoneId",
			[N]: OD
		}],
		[0, {
			[A]: "Affinity",
			[N]: jD
		}],
		[0, {
			[A]: "GroupName",
			[N]: Zk
		}],
		[1, {
			[A]: "PartitionNumber",
			[N]: pN
		}],
		[0, {
			[A]: "HostId",
			[N]: sA
		}],
		[0, {
			[A]: "Tenancy",
			[N]: rF
		}],
		[0, {
			[A]: "SpreadDomain",
			[N]: rP
		}],
		[0, {
			[A]: "HostResourceGroupArn",
			[N]: dA
		}],
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[0, {
			[A]: "AvailabilityZone",
			[N]: DD
		}]
	]
], _z = [
	3,
	P,
	dS,
	0,
	[dT],
	[[() => AV, {
		[A]: "SupportedStrategies",
		[N]: LP
	}]]
], vz = [
	3,
	P,
	DS,
	0,
	[Bm, DS],
	[[0, {
		[A]: "Description",
		[N]: qO
	}], [0, {
		[A]: "PrefixListId",
		[N]: dN
	}]]
], yz = [
	3,
	P,
	oS,
	0,
	[
		Kg,
		Rh,
		Ih
	],
	[
		[0, {
			[A]: "HostnameType",
			[N]: mA
		}],
		[2, {
			[A]: "EnableResourceNameDnsARecord",
			[N]: Ek
		}],
		[2, {
			[A]: "EnableResourceNameDnsAAAARecord",
			[N]: Tk
		}]
	]
], bz = [
	3,
	P,
	sS,
	0,
	[
		Kg,
		Rh,
		Ih
	],
	[
		0,
		2,
		2
	]
], xz = [
	3,
	P,
	cS,
	0,
	[
		Kg,
		Rh,
		Ih
	],
	[
		[0, {
			[A]: "HostnameType",
			[N]: mA
		}],
		[2, {
			[A]: "EnableResourceNameDnsARecord",
			[N]: Ek
		}],
		[2, {
			[A]: "EnableResourceNameDnsAAAARecord",
			[N]: Tk
		}]
	]
], Sz = [
	3,
	P,
	hS,
	0,
	[US, _S],
	[[2, {
		[A]: "Primary",
		[N]: wN
	}], [0, {
		[A]: "PrivateIpAddress",
		[N]: oN
	}]]
], Cz = [
	3,
	P,
	wS,
	0,
	[
		YC,
		QC,
		tw,
		Kb
	],
	[
		[() => gB, {
			[A]: "SupportedArchitectures",
			[N]: QN
		}],
		[1, {
			[A]: "SustainedClockSpeedInGhz",
			[N]: tP
		}],
		[() => ZV, {
			[A]: "SupportedFeatures",
			[N]: iP
		}],
		[0, {
			[A]: "Manufacturer",
			[N]: lM
		}]
	]
], wz = [
	3,
	P,
	tS,
	0,
	[Qx, eS],
	[[0, {
		[A]: "ProductCode",
		[N]: XM
	}], [0, {
		[A]: "Type",
		[N]: oF
	}]]
], Tz = [
	3,
	P,
	IS,
	0,
	[Sg],
	[[0, {
		[A]: "GatewayId",
		[N]: qk
	}]]
], Ez = [
	3,
	P,
	Xx,
	0,
	[
		FS,
		WS,
		IC,
		zC,
		_T
	],
	[
		[4, {
			[A]: "ProvisionTime",
			[N]: vN
		}],
		[0, {
			[A]: "Provisioned",
			[N]: TN
		}],
		[4, {
			[A]: "RequestTime",
			[N]: qN
		}],
		[0, {
			[A]: "Requested",
			[N]: XN
		}],
		[0, {
			[A]: "Status",
			[N]: HP
		}]
	]
], Dz = [
	3,
	P,
	rC,
	0,
	[J_, C],
	[[() => KB, { [N]: j_ }], [2, {
		[A]: "DryRun",
		[N]: k
	}]],
	1
], Oz = [
	3,
	P,
	_C,
	0,
	[
		w,
		MS,
		qT,
		O,
		OE
	],
	[
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[0, {
			[A]: "PeeringStatus",
			[N]: hN
		}],
		[0, {
			[A]: "UserId",
			[N]: sF
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "VpcPeeringConnectionId",
			[N]: wF
		}]
	]
], kz = [
	3,
	P,
	qS,
	0,
	[
		_u,
		pS,
		$b,
		C
	],
	[
		0,
		0,
		0,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], Az = [
	3,
	P,
	HC,
	0,
	[
		sC,
		zx,
		lC,
		mg,
		Ay
	],
	[
		[0, {
			[A]: "ReservationId",
			[N]: NN
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[0, {
			[A]: "RequesterId",
			[N]: FN
		}],
		[() => RB, {
			[A]: "GroupSet",
			[N]: tA
		}],
		[() => XB, {
			[A]: "InstancesSet",
			[N]: dj
		}]
	]
], jz = [
	3,
	P,
	wC,
	0,
	[
		fw,
		w,
		b_,
		Rv,
		lg,
		MT,
		Qd,
		Zd,
		DS,
		eC,
		Bm
	],
	[
		[0, {
			[A]: "SecurityGroupRuleId",
			[N]: cP
		}],
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[2, {
			[A]: "IsEgress",
			[N]: AA
		}],
		[0, {
			[A]: "IpProtocol",
			[N]: ZA
		}],
		[1, {
			[A]: "FromPort",
			[N]: Hk
		}],
		[1, {
			[A]: "ToPort",
			[N]: ZP
		}],
		[0, {
			[A]: "CidrIpv4",
			[N]: aO
		}],
		[0, {
			[A]: "CidrIpv6",
			[N]: iO
		}],
		[0, {
			[A]: "PrefixListId",
			[N]: dN
		}],
		[0, {
			[A]: "ReferencedGroupId",
			[N]: jN
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}]
	]
], Mz = [
	3,
	P,
	yC,
	0,
	[
		w,
		uw,
		C,
		cT,
		lT,
		Rv,
		lg,
		MT,
		Xd,
		Iv
	],
	[
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[() => GV, { [N]: fw }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[0, {
			[A]: "SourceSecurityGroupName",
			[N]: NP
		}],
		[0, {
			[A]: "SourceSecurityGroupOwnerId",
			[N]: PP
		}],
		[0, {
			[A]: "IpProtocol",
			[N]: ZA
		}],
		[1, {
			[A]: "FromPort",
			[N]: Hk
		}],
		[1, {
			[A]: "ToPort",
			[N]: ZP
		}],
		[0, {
			[A]: "CidrIp",
			[N]: rO
		}],
		[() => uV, {
			[A]: "IpPermissions",
			[N]: QA
		}]
	],
	1
], Nz = [
	3,
	P,
	bC,
	0,
	[
		KS,
		ZT,
		EC
	],
	[
		[2, {
			[A]: "Return",
			[N]: EN
		}],
		[() => uV, {
			[A]: "UnknownIpPermissionSet",
			[N]: cF
		}],
		[() => LV, {
			[A]: "RevokedSecurityGroupRuleSet",
			[N]: BN
		}]
	]
], Pz = [
	3,
	P,
	xC,
	0,
	[
		Xd,
		lg,
		w,
		kg,
		Iv,
		Rv,
		cT,
		lT,
		MT,
		uw,
		C
	],
	[
		0,
		1,
		0,
		0,
		[() => uV, 0],
		0,
		0,
		0,
		1,
		[() => GV, { [N]: fw }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	]
], Fz = [
	3,
	P,
	SC,
	0,
	[
		KS,
		ZT,
		EC
	],
	[
		[2, {
			[A]: "Return",
			[N]: EN
		}],
		[() => uV, {
			[A]: "UnknownIpPermissionSet",
			[N]: cF
		}],
		[() => LV, {
			[A]: "RevokedSecurityGroupRuleSet",
			[N]: BN
		}]
	]
], Iz = [
	3,
	P,
	UC,
	0,
	[
		op,
		pp,
		Qp,
		Ah,
		Sg,
		j_,
		xv,
		yx,
		ST,
		tb,
		Vd,
		wx,
		Lx,
		E,
		OE,
		rf,
		Vx,
		o_
	],
	[
		[0, {
			[A]: "DestinationCidrBlock",
			[N]: TO
		}],
		[0, {
			[A]: "DestinationIpv6CidrBlock",
			[N]: jO
		}],
		[0, {
			[A]: "DestinationPrefixListId",
			[N]: LO
		}],
		[0, {
			[A]: "EgressOnlyInternetGatewayId",
			[N]: xk
		}],
		[0, {
			[A]: "GatewayId",
			[N]: qk
		}],
		[0, {
			[A]: "InstanceId",
			[N]: FA
		}],
		[0, {
			[A]: "InstanceOwnerId",
			[N]: GA
		}],
		[0, {
			[A]: "NatGatewayId",
			[N]: CM
		}],
		[0, {
			[A]: "TransitGatewayId",
			[N]: KP
		}],
		[0, {
			[A]: "LocalGatewayId",
			[N]: Lj
		}],
		[0, {
			[A]: "CarrierGatewayId",
			[N]: $D
		}],
		[0, {
			[A]: "NetworkInterfaceId",
			[N]: TM
		}],
		[0, {
			[A]: "Origin",
			[N]: zM
		}],
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "VpcPeeringConnectionId",
			[N]: wF
		}],
		[0, {
			[A]: "CoreNetworkArn",
			[N]: sO
		}],
		[0, {
			[A]: "OdbNetworkArn",
			[N]: UM
		}],
		[0, {
			[A]: "IpAddress",
			[N]: wA
		}]
	]
], Lz = [
	3,
	P,
	LC,
	0,
	[
		ud,
		RS,
		jC,
		WC,
		D,
		O,
		zx
	],
	[
		[() => BV, {
			[A]: "AssociationSet",
			[N]: CD
		}],
		[() => PV, {
			[A]: "PropagatingVgwSet",
			[N]: yN
		}],
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}],
		[() => zV, {
			[A]: "RouteSet",
			[N]: HN
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}]
	]
], Rz = [
	3,
	P,
	DC,
	0,
	[
		Gb,
		OC,
		jC,
		Gw,
		Sg,
		bS,
		Uu
	],
	[
		[2, {
			[A]: "Main",
			[N]: cM
		}],
		[0, {
			[A]: "RouteTableAssociationId",
			[N]: UN
		}],
		[0, {
			[A]: "RouteTableId",
			[N]: WN
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "GatewayId",
			[N]: qk
		}],
		[0, {
			[A]: "PublicIpv4Pool",
			[N]: sN
		}],
		[() => zz, {
			[A]: "AssociationState",
			[N]: yD
		}]
	]
], zz = [
	3,
	P,
	AC,
	0,
	[E, Xw],
	[[0, {
		[A]: "State",
		[N]: VP
	}], [0, {
		[A]: "StatusMessage",
		[N]: TP
	}]]
], Bz = [
	3,
	P,
	nC,
	0,
	[Qh],
	[[2, {
		[A]: "Enabled",
		[N]: Ik
	}]],
	1
], Vz = [
	3,
	P,
	iC,
	0,
	[
		vb,
		yb,
		bd,
		K_,
		py,
		Qg,
		Xg,
		Fy,
		Ry,
		Zb,
		HS,
		oC,
		ow,
		gw,
		Gw,
		KT,
		lh,
		yh,
		FT,
		sb,
		av,
		jf,
		cf,
		vf,
		zg,
		ab,
		Mb,
		Nh,
		aS,
		Nb,
		$f,
		Ph,
		kx,
		Gx,
		Rw,
		C,
		ep,
		U_,
		_S,
		Pf,
		gu,
		Ex,
		F_,
		Eh
	],
	[
		1,
		1,
		[() => wB, { [N]: _d }],
		0,
		0,
		1,
		[() => JB, { [N]: s_ }],
		0,
		0,
		[() => Bz, 0],
		[() => gz, 0],
		0,
		[() => UV, { [N]: iw }],
		[() => qV, { [N]: _w }],
		0,
		[() => UF, 0],
		[() => jB, 0],
		[() => NB, { [N]: dh }],
		[() => $V, { [N]: RT }],
		() => JR,
		() => vR,
		() => LI,
		() => vI,
		() => dI,
		() => tR,
		[() => yV, { [N]: ob }],
		() => yR,
		() => UL,
		() => bz,
		() => _R,
		2,
		2,
		() => ER,
		() => mz,
		[() => rV, { [N]: zw }],
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[2, {
			[A]: "DisableApiTermination",
			[N]: wO
		}],
		[0, {
			[A]: "InstanceInitiatedShutdownBehavior",
			[N]: LA
		}],
		[0, {
			[A]: "PrivateIpAddress",
			[N]: oN
		}],
		[0, {
			[A]: "ClientToken",
			[yj]: 1,
			[N]: _O
		}],
		[0, {
			[A]: "AdditionalInfo",
			[N]: oD
		}],
		[() => QB, {
			[A]: "NetworkInterface",
			[N]: OM
		}],
		[() => rR, {
			[A]: "IamInstanceProfile",
			[N]: IA
		}],
		[2, {
			[A]: "EbsOptimized",
			[N]: vk
		}]
	],
	2
], Hz = [
	3,
	P,
	_w,
	0,
	[
		w,
		wv,
		D,
		O,
		rw,
		zx,
		kg,
		Bm,
		Iv
	],
	[
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[() => uV, {
			[A]: "IpPermissionsEgress",
			[N]: qA
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "SecurityGroupArn",
			[N]: aP
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[0, {
			[A]: "GroupName",
			[N]: Zk
		}],
		[0, {
			[A]: "GroupDescription",
			[N]: Kk
		}],
		[() => uV, {
			[A]: "IpPermissions",
			[N]: QA
		}]
	]
], Uz = [
	3,
	P,
	mw,
	0,
	[
		fw,
		w,
		Mg,
		b_,
		Rv,
		lg,
		MT,
		Qd,
		Zd,
		DS,
		tC,
		Bm,
		D,
		lw
	],
	[
		[0, {
			[A]: "SecurityGroupRuleId",
			[N]: cP
		}],
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[0, {
			[A]: "GroupOwnerId",
			[N]: Qk
		}],
		[2, {
			[A]: "IsEgress",
			[N]: AA
		}],
		[0, {
			[A]: "IpProtocol",
			[N]: ZA
		}],
		[1, {
			[A]: "FromPort",
			[N]: Hk
		}],
		[1, {
			[A]: "ToPort",
			[N]: ZP
		}],
		[0, {
			[A]: "CidrIpv4",
			[N]: aO
		}],
		[0, {
			[A]: "CidrIpv6",
			[N]: iO
		}],
		[0, {
			[A]: "PrefixListId",
			[N]: dN
		}],
		[() => Oz, {
			[A]: "ReferencedGroupInfo",
			[N]: MN
		}],
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "SecurityGroupRuleArn",
			[N]: sP
		}]
	]
], Wz = [
	3,
	P,
	Yw,
	0,
	[
		Fb,
		Lw,
		xd,
		RE,
		P_
	],
	[
		0,
		0,
		1,
		4,
		0
	]
], Gz = [
	3,
	P,
	kw,
	0,
	[
		J_,
		gu,
		C
	],
	[
		[() => KB, { [N]: j_ }],
		[0, {
			[A]: "AdditionalInfo",
			[N]: oD
		}],
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], Kz = [
	3,
	P,
	Aw,
	0,
	[Vw],
	[[() => iV, {
		[A]: "InstancesSet",
		[N]: dj
	}]]
], qz = [
	3,
	P,
	sT,
	0,
	[Kf, Jb],
	[[0, {
		[A]: "Code",
		[N]: xO
	}], [0, {
		[A]: "Message",
		[N]: dM
	}]]
], Jz = [
	3,
	P,
	jw,
	0,
	[
		J_,
		qg,
		nT,
		C,
		eg
	],
	[
		[() => KB, { [N]: j_ }],
		2,
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}],
		[2, {
			[A]: "Force",
			[N]: Wk
		}]
	],
	1
], Yz = [
	3,
	P,
	Mw,
	0,
	[Uw],
	[[() => iV, {
		[A]: "InstancesSet",
		[N]: dj
	}]]
], Xz = [
	3,
	P,
	vT,
	0,
	[
		Qu,
		wh,
		_b,
		uf,
		zx,
		fu,
		d_,
		D,
		JC,
		Rx,
		$m,
		cv,
		oS,
		Dd,
		WT,
		Gw,
		E,
		O,
		Nd,
		du,
		qu,
		up,
		Pb
	],
	[
		[0, {
			[A]: "AvailabilityZoneId",
			[N]: OD
		}],
		[1, {
			[A]: "EnableLniAtDeviceIndex",
			[N]: gk
		}],
		[2, {
			[A]: "MapCustomerOwnedIpOnLaunch",
			[N]: Wj
		}],
		[0, {
			[A]: "CustomerOwnedIpv4Pool",
			[N]: uO
		}],
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[2, {
			[A]: "AssignIpv6AddressOnCreation",
			[N]: aD
		}],
		[() => YV, {
			[A]: "Ipv6CidrBlockAssociationSet",
			[N]: DA
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[0, {
			[A]: "SubnetArn",
			[N]: $N
		}],
		[0, {
			[A]: "OutpostArn",
			[N]: BM
		}],
		[2, {
			[A]: "EnableDns64",
			[N]: tk
		}],
		[2, {
			[A]: "Ipv6Native",
			[N]: HA
		}],
		[() => yz, {
			[A]: "PrivateDnsNameOptionsOnLaunch",
			[N]: QM
		}],
		[() => uI, {
			[A]: "BlockPublicAccessStates",
			[N]: HD
		}],
		[0, {
			[A]: "Type",
			[N]: oF
		}],
		[0, {
			[A]: "SubnetId",
			[N]: CP
		}],
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "CidrBlock",
			[N]: qD
		}],
		[1, {
			[A]: "AvailableIpAddressCount",
			[N]: iD
		}],
		[0, {
			[A]: "AvailabilityZone",
			[N]: DD
		}],
		[2, {
			[A]: "DefaultForAz",
			[N]: OO
		}],
		[2, {
			[A]: "MapPublicIpOnLaunch",
			[N]: nM
		}]
	]
], Zz = [
	3,
	P,
	ZC,
	0,
	[E, Xw],
	[[0, {
		[A]: "State",
		[N]: VP
	}], [0, {
		[A]: "StatusMessage",
		[N]: TP
	}]]
], Qz = [
	3,
	P,
	yw,
	0,
	[
		yu,
		u_,
		p_,
		Zg,
		dy
	],
	[
		[0, {
			[A]: "AssociationId",
			[N]: sD
		}],
		[0, {
			[A]: "Ipv6CidrBlock",
			[N]: EA
		}],
		[() => Zz, {
			[A]: "Ipv6CidrBlockState",
			[N]: OA
		}],
		[0, {
			[A]: "Ipv6AddressAttribute",
			[N]: gA
		}],
		[0, {
			[A]: "IpSource",
			[N]: pj
		}]
	]
], $z = [
	3,
	P,
	BT,
	0,
	[My, iE],
	[[0, {
		[A]: "Key",
		[N]: Tj
	}], [0, {
		[A]: "Value",
		[N]: mF
	}]]
], eB = [
	3,
	P,
	RT,
	0,
	[FC, D],
	[[0, {
		[A]: "ResourceType",
		[N]: KN
	}], [() => F, { [N]: BT }]]
], tB = [
	3,
	P,
	ET,
	0,
	[
		J_,
		eg,
		nT,
		C
	],
	[
		[() => KB, { [N]: j_ }],
		2,
		2,
		[2, {
			[A]: "DryRun",
			[N]: k
		}]
	],
	1
], nB = [
	3,
	P,
	DT,
	0,
	[OT],
	[[() => iV, {
		[A]: "InstancesSet",
		[N]: dj
	}]]
], rB = [
	3,
	P,
	XT,
	0,
	[
		Bm,
		qT,
		kg,
		w,
		O,
		OE,
		MS
	],
	[
		[0, {
			[A]: "Description",
			[N]: qO
		}],
		[0, {
			[A]: "UserId",
			[N]: sF
		}],
		[0, {
			[A]: "GroupName",
			[N]: Zk
		}],
		[0, {
			[A]: "GroupId",
			[N]: Yk
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "VpcPeeringConnectionId",
			[N]: wF
		}],
		[0, {
			[A]: "PeeringStatus",
			[N]: hN
		}]
	]
], iB = [
	3,
	P,
	cE,
	0,
	[
		Pm,
		cp,
		wm,
		lE,
		IE
	],
	[
		[1, {
			[A]: "DefaultVCpus",
			[N]: KO
		}],
		[1, {
			[A]: "DefaultCores",
			[N]: EO
		}],
		[1, {
			[A]: "DefaultThreadsPerCore",
			[N]: VO
		}],
		[() => EB, {
			[A]: "ValidCores",
			[N]: gF
		}],
		[() => eH, {
			[A]: "ValidThreadsPerCore",
			[N]: kF
		}]
	]
], aB = [
	3,
	P,
	VE,
	0,
	[
		zx,
		yy,
		d_,
		Pd,
		y_,
		Xm,
		D,
		Dd,
		O,
		E,
		Nd,
		Xp
	],
	[
		[0, {
			[A]: "OwnerId",
			[N]: VM
		}],
		[0, {
			[A]: "InstanceTenancy",
			[N]: xj
		}],
		[() => cH, {
			[A]: "Ipv6CidrBlockAssociationSet",
			[N]: DA
		}],
		[() => oH, {
			[A]: "CidrBlockAssociationSet",
			[N]: JD
		}],
		[2, {
			[A]: "IsDefault",
			[N]: kA
		}],
		[() => cB, {
			[A]: "EncryptionControl",
			[N]: QO
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}],
		[() => uI, {
			[A]: "BlockPublicAccessStates",
			[N]: HD
		}],
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "CidrBlock",
			[N]: qD
		}],
		[0, {
			[A]: "DhcpOptionsId",
			[N]: FO
		}]
	]
], oB = [
	3,
	P,
	aE,
	0,
	[
		yu,
		Nd,
		Id
	],
	[
		[0, {
			[A]: "AssociationId",
			[N]: sD
		}],
		[0, {
			[A]: "CidrBlock",
			[N]: qD
		}],
		[() => sB, {
			[A]: "CidrBlockState",
			[N]: XD
		}]
	]
], sB = [
	3,
	P,
	sE,
	0,
	[E, Xw],
	[[0, {
		[A]: "State",
		[N]: VP
	}], [0, {
		[A]: "StatusMessage",
		[N]: TP
	}]]
], cB = [
	3,
	P,
	uE,
	0,
	[
		O,
		mE,
		Xb,
		E,
		Zw,
		$S,
		D
	],
	[
		[0, {
			[A]: "VpcId",
			[N]: M
		}],
		[0, {
			[A]: "VpcEncryptionControlId",
			[N]: _F
		}],
		[0, {
			[A]: "Mode",
			[N]: fM
		}],
		[0, {
			[A]: "State",
			[N]: VP
		}],
		[0, {
			[A]: "StateMessage",
			[N]: EP
		}],
		[() => dB, {
			[A]: "ResourceExclusions",
			[N]: AN
		}],
		[() => F, {
			[A]: "TagSet",
			[N]: $P
		}]
	]
], lB = [
	3,
	P,
	dE,
	0,
	[
		Xb,
		T_,
		kh,
		vx,
		jE,
		kE,
		$y,
		CE,
		th
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	1
], uB = [
	3,
	P,
	fE,
	0,
	[E, Zw],
	[[0, {
		[A]: "State",
		[N]: VP
	}], [0, {
		[A]: "StateMessage",
		[N]: EP
	}]]
], dB = [
	3,
	P,
	pE,
	0,
	[
		x_,
		Oh,
		fx,
		AE,
		DE,
		Yy,
		SE,
		eh
	],
	[
		[() => uB, {
			[A]: "InternetGateway",
			[N]: jA
		}],
		[() => uB, {
			[A]: "EgressOnlyInternetGateway",
			[N]: bk
		}],
		[() => uB, {
			[A]: "NatGateway",
			[N]: xM
		}],
		[() => uB, {
			[A]: "VirtualPrivateGateway",
			[N]: TF
		}],
		[() => uB, {
			[A]: "VpcPeering",
			[N]: CF
		}],
		[() => uB, {
			[A]: "Lambda",
			[N]: Pj
		}],
		[() => uB, {
			[A]: "VpcLattice",
			[N]: bF
		}],
		[() => uB, {
			[A]: "ElasticFileSystem",
			[N]: nk
		}]
	]
], fB = [
	3,
	P,
	gE,
	0,
	[
		yu,
		u_,
		p_,
		$b,
		Bv,
		Zg,
		dy
	],
	[
		[0, {
			[A]: "AssociationId",
			[N]: sD
		}],
		[0, {
			[A]: "Ipv6CidrBlock",
			[N]: EA
		}],
		[() => sB, {
			[A]: "Ipv6CidrBlockState",
			[N]: OA
		}],
		[0, {
			[A]: "NetworkBorderGroup",
			[N]: hM
		}],
		[0, {
			[A]: "Ipv6Pool",
			[N]: ej
		}],
		[0, {
			[A]: "Ipv6AddressAttribute",
			[N]: gA
		}],
		[0, {
			[A]: "IpSource",
			[N]: pj
		}]
	]
], pB = "unit", mB = [
	1,
	P,
	Cu,
	0,
	[() => GF, { [N]: j }]
], hB = [
	1,
	P,
	hu,
	0,
	[0, { [N]: _u }]
], gB = [
	1,
	P,
	Gu,
	0,
	[0, { [N]: j }]
], _B = [
	1,
	P,
	Yu,
	0,
	[() => aI, { [N]: Ju }]
], vB = [
	1,
	P,
	Zu,
	0,
	[() => oI, { [N]: j }]
], yB = [
	1,
	P,
	$u,
	0,
	[() => iI, { [N]: j }]
], bB = [
	1,
	P,
	td,
	0,
	[() => sI, { [N]: j }]
], xB = [
	1,
	P,
	rd,
	0,
	[() => cI, { [N]: j }]
], SB = [
	1,
	P,
	jd,
	0,
	[0, { [N]: j }]
], CB = [
	1,
	P,
	vd,
	0,
	[() => lI, { [N]: j }]
], wB = [
	1,
	P,
	yd,
	0,
	[() => lI, { [N]: _d }]
], TB = [
	1,
	P,
	Td,
	0,
	[0, { [N]: j }]
], EB = [
	1,
	P,
	Ld,
	0,
	[1, { [N]: j }]
], DB = [
	1,
	P,
	gm,
	0,
	[() => JI, { [N]: j }]
], OB = [
	1,
	P,
	xp,
	0,
	[() => kL, { [N]: j }]
], kB = [
	1,
	P,
	qm,
	0,
	[() => jL, { [N]: j }]
], AB = [
	1,
	P,
	ih,
	0,
	[() => IL, { [N]: j }]
], jB = [
	1,
	P,
	uh,
	0,
	[() => LL, { [N]: j }]
], MB = [
	1,
	P,
	mh,
	0,
	[() => zL, { [N]: j }]
], NB = [
	1,
	P,
	yh,
	0,
	[() => RL, { [N]: j }]
], PB = [
	1,
	P,
	Wm,
	0,
	[0, { [N]: Gm }]
], FB = [
	1,
	P,
	sg,
	0,
	[() => WL, { [N]: fg }]
], IB = [
	1,
	P,
	rg,
	0,
	[() => GL, { [N]: j }]
], LB = [
	1,
	P,
	bg,
	0,
	[() => XL, { [N]: j }]
], RB = [
	1,
	P,
	Cg,
	0,
	[() => $L, { [N]: j }]
], zB = [
	1,
	P,
	wg,
	0,
	[0, { [N]: Yk }]
], BB = [
	1,
	P,
	Ag,
	0,
	[0, { [N]: kg }]
], VB = [
	1,
	P,
	W_,
	0,
	[0, { [N]: K_ }]
], HB = [
	1,
	P,
	X_,
	0,
	[() => iR, { [N]: j }]
], UB = [
	1,
	P,
	Ty,
	0,
	[() => aR, { [N]: j }]
], WB = [
	1,
	P,
	g_,
	0,
	[() => sR, 0]
], GB = [
	1,
	P,
	l_,
	0,
	[() => fR, { [N]: j }]
], KB = [
	1,
	P,
	G_,
	0,
	[0, { [N]: j_ }]
], qB = [
	1,
	P,
	R_,
	0,
	[() => pR, { [N]: j }]
], JB = [
	1,
	P,
	N_,
	0,
	[() => mR, { [N]: j }]
], YB = [
	1,
	P,
	z_,
	0,
	[() => hR, { [N]: j }]
], XB = [
	1,
	P,
	Q_,
	0,
	[() => lR, { [N]: j }]
], ZB = [
	1,
	P,
	fv,
	0,
	[() => xR, { [N]: j }]
], QB = [
	1,
	P,
	mv,
	0,
	[() => wR, { [N]: j }]
], $B = [
	1,
	P,
	Dv,
	0,
	[() => DR, { [N]: j }]
], eV = [
	1,
	P,
	$v,
	0,
	[() => OR, { [N]: j }]
], tV = [
	1,
	P,
	ty,
	0,
	[() => AR, { [N]: j }]
], nV = [
	1,
	P,
	ny,
	0,
	[() => jR, { [N]: j }]
], rV = [
	1,
	P,
	iy,
	0,
	[() => MR, { [N]: j }]
], iV = [
	1,
	P,
	Zv,
	0,
	[() => PR, { [N]: j }]
], aV = [
	1,
	P,
	my,
	0,
	[() => IR, { [N]: j }]
], oV = [
	1,
	P,
	C_,
	0,
	[() => BR, { [N]: j }]
], sV = [
	1,
	P,
	D_,
	0,
	[0, { [N]: j }]
], cV = [
	1,
	P,
	k_,
	0,
	[() => zR, { [N]: j }]
], lV = [
	1,
	P,
	$_,
	0,
	[0, { [N]: j }]
], uV = [
	1,
	P,
	Av,
	0,
	[() => VR, { [N]: j }]
], dV = [
	1,
	P,
	Wv,
	0,
	[() => HR, { [N]: j }]
], fV = [
	1,
	P,
	jv,
	0,
	[() => UR, { [N]: j }]
], pV = [
	1,
	P,
	Mv,
	0,
	[() => WR, { [N]: j }]
], mV = [
	1,
	P,
	Gv,
	0,
	[() => GR, { [N]: j }]
], hV = [
	1,
	P,
	zy,
	0,
	[0, { [N]: Ry }]
], gV = [
	1,
	P,
	Uy,
	0,
	[0, { [N]: Hy }]
], _V = [
	1,
	P,
	Ky,
	0,
	[() => qR, { [N]: j }]
], vV = [
	1,
	P,
	nb,
	0,
	[() => YR, { [N]: j }]
], yV = [
	1,
	P,
	ib,
	0,
	[() => XR, { [N]: j }]
], bV = [
	1,
	P,
	xb,
	0,
	[() => QR, { [N]: j }]
], xV = [
	1,
	P,
	gx,
	0,
	[() => az, { [N]: j }]
], SV = [
	1,
	P,
	hx,
	0,
	[() => oz, { [N]: j }]
], CV = [
	1,
	P,
	bx,
	0,
	[0, { [N]: j }]
], wV = [
	1,
	P,
	Sx,
	0,
	[() => iz, { [N]: j }]
], TV = [
	1,
	P,
	nx,
	0,
	[() => sz, { [N]: j }]
], EV = [
	1,
	P,
	rx,
	0,
	[0, { [N]: j }]
], DV = [
	1,
	P,
	cx,
	0,
	[() => uz, { [N]: j }]
], OV = [
	1,
	P,
	Fx,
	0,
	[0, { [N]: j }]
], kV = [
	1,
	P,
	Wx,
	0,
	[0, { [N]: Jx }]
], AV = [
	1,
	P,
	fS,
	0,
	[0, { [N]: j }]
], jV = [
	1,
	P,
	OS,
	0,
	[() => vz, { [N]: j }]
], MV = [
	1,
	P,
	gS,
	0,
	[() => Sz, { [N]: j }]
], NV = [
	1,
	P,
	$x,
	0,
	[() => wz, { [N]: j }]
], PV = [
	1,
	P,
	LS,
	0,
	[() => Tz, { [N]: j }]
], FV = [
	1,
	P,
	xS,
	0,
	[0, { [N]: pS }]
], IV = [
	1,
	P,
	fC,
	0,
	[() => Az, { [N]: j }]
], LV = [
	1,
	P,
	TC,
	0,
	[() => jz, { [N]: j }]
], RV = [
	1,
	P,
	QS,
	0,
	[0, { [N]: j }]
], zV = [
	1,
	P,
	pC,
	0,
	[() => Iz, { [N]: j }]
], BV = [
	1,
	P,
	kC,
	0,
	[() => Rz, { [N]: j }]
], VV = [
	1,
	P,
	MC,
	0,
	[0, { [N]: j }]
], HV = [
	1,
	P,
	PC,
	0,
	[() => Lz, { [N]: j }]
], UV = [
	1,
	P,
	aw,
	0,
	[0, { [N]: iw }]
], WV = [
	1,
	P,
	sw,
	0,
	[() => Hz, { [N]: j }]
], GV = [
	1,
	P,
	dw,
	0,
	[0, { [N]: j }]
], KV = [
	1,
	P,
	pw,
	0,
	[() => Uz, { [N]: j }]
], qV = [
	1,
	P,
	hw,
	0,
	[0, { [N]: _w }]
], JV = [
	1,
	P,
	Pw,
	0,
	[0, { [N]: Gw }]
], YV = [
	1,
	P,
	bw,
	0,
	[() => Qz, { [N]: j }]
], XV = [
	1,
	P,
	qw,
	0,
	[() => Xz, { [N]: j }]
], ZV = [
	1,
	P,
	qC,
	0,
	[0, { [N]: j }]
], QV = [
	1,
	P,
	Iw,
	0,
	[() => LR, { [N]: j }]
], F = [
	1,
	P,
	kT,
	0,
	[() => $z, { [N]: j }]
], $V = [
	1,
	P,
	LT,
	0,
	[() => eB, { [N]: j }]
], eH = [
	1,
	P,
	PT,
	0,
	[1, { [N]: j }]
], tH = [
	1,
	P,
	$T,
	0,
	[() => LR, { [N]: j }]
], nH = [
	1,
	P,
	GT,
	0,
	[0, { [N]: j }]
], rH = [
	1,
	P,
	YT,
	0,
	[() => rB, { [N]: j }]
], iH = [
	1,
	P,
	ME,
	0,
	[0, { [N]: j }]
], aH = [
	1,
	P,
	FE,
	0,
	[0, { [N]: j }]
], oH = [
	1,
	P,
	oE,
	0,
	[() => oB, { [N]: j }]
], sH = [
	1,
	P,
	yE,
	0,
	[0, { [N]: O }]
], cH = [
	1,
	P,
	_E,
	0,
	[() => fB, { [N]: j }]
], lH = [
	1,
	P,
	wE,
	0,
	[() => aB, { [N]: j }]
], uH = [
	1,
	P,
	GE,
	0,
	[0, { [N]: j }]
], dH = [
	1,
	P,
	JE,
	0,
	[0, { [N]: qE }]
], fH = [
	1,
	P,
	ZE,
	0,
	[0, { [N]: XE }]
], pH = [
	9,
	P,
	iu,
	0,
	() => KF,
	() => qF
], mH = [
	9,
	P,
	ou,
	0,
	() => JF,
	() => YF
], hH = [
	9,
	P,
	ju,
	0,
	() => XF,
	() => ZF
], gH = [
	9,
	P,
	pu,
	0,
	() => QF,
	() => pB
], _H = [
	9,
	P,
	Fu,
	0,
	() => eI,
	() => tI
], vH = [
	9,
	P,
	Bu,
	0,
	() => nI,
	() => rI
], yH = [
	9,
	P,
	ef,
	0,
	() => yI,
	() => bI
], bH = [
	9,
	P,
	Gd,
	0,
	() => xI,
	() => SI
], xH = [
	9,
	P,
	tf,
	0,
	() => CI,
	() => KR
], SH = [
	9,
	P,
	af,
	0,
	() => wI,
	() => TI
], CH = [
	9,
	P,
	wf,
	0,
	() => EI,
	() => DI
], wH = [
	9,
	P,
	Cf,
	0,
	() => OI,
	() => kI
], TH = [
	9,
	P,
	Tf,
	0,
	() => AI,
	() => jI
], EH = [
	9,
	P,
	Mf,
	0,
	() => MI,
	() => NI
], DH = [
	9,
	P,
	Hf,
	0,
	() => PI,
	() => pB
], OH = [
	9,
	P,
	Gf,
	0,
	() => FI,
	() => II
], kH = [
	9,
	P,
	mp,
	0,
	() => zI,
	() => pB
], AH = [
	9,
	P,
	Fp,
	0,
	() => BI,
	() => VI
], jH = [
	9,
	P,
	Wp,
	0,
	() => HI,
	() => UI
], MH = [
	9,
	P,
	cm,
	0,
	() => WI,
	() => pB
], NH = [
	9,
	P,
	tm,
	0,
	() => GI,
	() => pB
], PH = [
	9,
	P,
	lm,
	0,
	() => KI,
	() => qI
], FH = [
	9,
	P,
	xm,
	0,
	() => YI,
	() => pB
], IH = [
	9,
	P,
	Om,
	0,
	() => XI,
	() => pB
], LH = [
	9,
	P,
	Rm,
	0,
	() => ZI,
	() => pB
], RH = [
	9,
	P,
	jp,
	0,
	() => QI,
	() => $I
], zH = [
	9,
	P,
	ip,
	0,
	() => eL,
	() => tL
], BH = [
	9,
	P,
	rp,
	0,
	() => nL,
	() => rL
], VH = [
	9,
	P,
	Mp,
	0,
	() => iL,
	() => aL
], HH = [
	9,
	P,
	Np,
	0,
	() => oL,
	() => sL
], UH = [
	9,
	P,
	Ap,
	0,
	() => cL,
	() => lL
], WH = [
	9,
	P,
	yp,
	0,
	() => uL,
	() => dL
], GH = [
	9,
	P,
	Bp,
	0,
	() => fL,
	() => pL
], KH = [
	9,
	P,
	Yp,
	0,
	() => mL,
	() => hL
], qH = [
	9,
	P,
	om,
	0,
	() => gL,
	() => _L
], JH = [
	9,
	P,
	mm,
	0,
	() => vL,
	() => yL
], YH = [
	9,
	P,
	Sm,
	0,
	() => bL,
	() => xL
], XH = [
	9,
	P,
	Nm,
	0,
	() => SL,
	() => CL
], ZH = [
	9,
	P,
	zm,
	0,
	() => wL,
	() => TL
], QH = [
	9,
	P,
	bp,
	0,
	() => EL,
	() => pB
], $H = [
	9,
	P,
	ap,
	0,
	() => DL,
	() => pB
], eU = [
	9,
	P,
	sm,
	0,
	() => OL,
	() => pB
], tU = [
	9,
	P,
	hg,
	0,
	() => JL,
	() => YL
], nU = [
	9,
	P,
	Rb,
	0,
	() => tz,
	() => pB
], rU = [
	9,
	P,
	Wb,
	0,
	() => nz,
	() => pB
], iU = [
	9,
	P,
	cC,
	0,
	() => Dz,
	() => pB
], aU = [
	9,
	P,
	JS,
	0,
	() => kz,
	() => pB
], oU = [
	9,
	P,
	vC,
	0,
	() => Mz,
	() => Nz
], sU = [
	9,
	P,
	CC,
	0,
	() => Pz,
	() => Fz
], cU = [
	9,
	P,
	dC,
	0,
	() => Vz,
	() => Az
], lU = [
	9,
	P,
	Hw,
	0,
	() => Gz,
	() => Kz
], uU = [
	9,
	P,
	Ww,
	0,
	() => Jz,
	() => Yz
], dU = [
	9,
	P,
	wT,
	0,
	() => tB,
	() => nB
];
pa(), ve(), S();
var fU = (e) => ({
	apiVersion: "2016-11-15",
	base64Decoder: e?.base64Decoder ?? _t,
	base64Encoder: e?.base64Encoder ?? xt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Xl,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? ml,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Sc()
	}],
	logger: e?.logger ?? new dt(),
	protocol: e?.protocol ?? Nl,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.ec2",
		errorTypeRegistries: HF,
		xmlNamespace: "http://ec2.amazonaws.com/doc/2016-11-15",
		version: "2016-11-15",
		serviceTarget: "AmazonEC2"
	},
	serviceId: e?.serviceId ?? "EC2",
	sha256: e?.sha256 ?? da,
	urlParser: e?.urlParser ?? _e,
	utf8Decoder: e?.utf8Decoder ?? yt,
	utf8Encoder: e?.utf8Encoder ?? Tt
});
S(), zi();
var pU = (e) => {
	let t = dc(e), n = () => t().then(nt), r = fU(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? zn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Zs({
			serviceId: r.serviceId,
			clientVersion: vl.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? xe("Region is missing"),
		requestHandler: Sl.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || rs),
		streamCollector: e?.streamCollector ?? Ri,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, mU = (e) => {
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
}, hU = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), gU = (e, t) => {
	let n = Object.assign(pc(e), ct(e), yo(e), mU(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, mc(n), lt(n), bo(n), hU(n));
};
Ni(), Je();
var _U = class extends Se {
	config;
	constructor(...[e]) {
		let t = pU(e || {});
		super(t), this.initConfig = t;
		let n = us(lc(ss(Ps(gl(t))))), r = gU(hl(ji(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(Me(this.config)), this.middlewareStack.use(Xs(this.config)), this.middlewareStack.use(cs(this.config)), this.middlewareStack.use(wo(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(gs(this.config)), this.middlewareStack.use(_s(this.config)), this.middlewareStack.use(Ss(this.config, {
			httpAuthSchemeParametersProvider: fl,
			identityProviderConfigProvider: async (e) => new ks({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Ds(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ec2@3.1156.0/node_modules/@aws-sdk/client-ec2/dist-es/commandBuilder.js
Ni();
var I = ft(_l, "AmazonEC2", "EC2Client", Mi), L = {}, R = (e, t, n, r) => [], vU = class extends I(L, R, "AllocateAddress", pH) {}, yU = class extends I(L, R, "AssociateAddress", mH) {}, bU = class extends I(L, R, "AssociateRouteTable", hH) {}, xU = class extends I(L, R, "AttachInternetGateway", gH) {}, SU = class extends I(L, R, "AuthorizeSecurityGroupEgress", _H) {}, CU = class extends I(L, R, "AuthorizeSecurityGroupIngress", vH) {}, wU = class extends I(L, R, "CreateImage", yH) {}, TU = class extends I(L, R, "CreateInternetGateway", bH) {}, EU = class extends I(L, R, "CreateKeyPair", xH) {}, DU = class extends I(L, R, "CreateNatGateway", SH) {}, OU = class extends I(L, R, "CreateRoute", CH) {}, kU = class extends I(L, R, "CreateRouteTable", wH) {}, AU = class extends I(L, R, "CreateSecurityGroup", TH) {}, jU = class extends I(L, R, "CreateSubnet", EH) {}, MU = class extends I(L, R, "CreateTags", DH) {}, NU = class extends I(L, R, "CreateVpc", OH) {}, PU = class extends I(L, R, "DeleteInternetGateway", kH) {}, FU = class extends I(L, R, "DeleteKeyPair", AH) {}, IU = class extends I(L, R, "DeleteNatGateway", jH) {}, LU = class extends I(L, R, "DeleteRoute", MH) {}, RU = class extends I(L, R, "DeleteRouteTable", NH) {}, zU = class extends I(L, R, "DeleteSecurityGroup", PH) {}, BU = class extends I(L, R, "DeleteSubnet", FH) {}, VU = class extends I(L, R, "DeleteTags", IH) {}, HU = class extends I(L, R, "DeleteVpc", LH) {}, UU = class extends I(L, R, "DeregisterImage", RH) {}, WU = class extends I(L, R, "DescribeAddresses", zH) {}, GU = class extends I(L, R, "DescribeAvailabilityZones", BH) {}, KU = class extends I(L, R, "DescribeImages", VH) {}, qU = class extends I(L, R, "DescribeInstances", HH) {}, JU = class extends I(L, R, "DescribeInstanceTypes", UH) {}, YU = class extends I(L, R, "DescribeInternetGateways", WH) {}, XU = class extends I(L, R, "DescribeKeyPairs", GH) {}, ZU = class extends I(L, R, "DescribeNatGateways", KH) {}, QU = class extends I(L, R, "DescribeRouteTables", qH) {}, $U = class extends I(L, R, "DescribeSecurityGroups", JH) {}, eW = class extends I(L, R, "DescribeSubnets", YH) {}, tW = class extends I(L, R, "DescribeVpcAttribute", XH) {}, nW = class extends I(L, R, "DescribeVpcs", ZH) {}, rW = class extends I(L, R, "DetachInternetGateway", QH) {}, iW = class extends I(L, R, "DisassociateAddress", $H) {}, aW = class extends I(L, R, "DisassociateRouteTable", eU) {}, oW = class extends I(L, R, "GetConsoleOutput", tU) {}, sW = class extends I(L, R, "ModifySubnetAttribute", nU) {}, cW = class extends I(L, R, "ModifyVpcAttribute", rU) {}, lW = class extends I(L, R, "RebootInstances", iU) {}, uW = class extends I(L, R, "ReleaseAddress", aU) {}, dW = class extends I(L, R, "RevokeSecurityGroupEgress", oU) {}, fW = class extends I(L, R, "RevokeSecurityGroupIngress", sU) {}, pW = class extends I(L, R, "RunInstances", cU) {}, mW = class extends I(L, R, "StartInstances", lU) {}, hW = class extends I(L, R, "StopInstances", uU) {}, gW = class extends I(L, R, "TerminateInstances", dU) {};
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/auth/httpAuthSchemeProvider.js
te(), me();
var _W = async (e, t, n) => ({
	operation: ee(t).operation,
	region: await pe(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function vW(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "elasticloadbalancing",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var yW = (e) => {
	let t = [];
	return e.operation, t.push(vW(e)), t;
}, bW = (e) => {
	let t = dl(e);
	return Object.assign(t, { authSchemePreference: pe(e.authSchemePreference ?? []) });
}, xW = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "elasticloadbalancing"
}), SW = {
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
}, CW = {
	name: "@aws-sdk/client-elastic-load-balancing-v2",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Elastic Load Balancing V2 Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-elastic-load-balancing-v2",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-elastic-load-balancing-v2"
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
		"test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts",
		"test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts",
		"test:index": "tsc -p tsconfig.test.json && node ./test/index-objects.spec.mjs"
	},
	dependencies: {
		"@aws-sdk/core": "^3.978.5",
		"@aws-sdk/credential-provider-node": "^3.972.88",
		"@aws-sdk/types": "^3.975.0",
		"@smithy/core": "^3.36.1",
		"@smithy/fetch-http-handler": "^5.8.0",
		"@smithy/node-http-handler": "^4.12.1",
		"@smithy/types": "^4.19.0",
		tslib: "^2.6.2"
	},
	devDependencies: {
		"@tsconfig/node20": "20.1.8",
		"@types/node": "^20.14.8",
		concurrently: "7.0.0",
		"downlevel-dts": "0.10.1",
		premove: "4.0.0",
		typescript: "~7.0.2"
	},
	engines: { node: ">=20.0.0" }
};
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/endpoint/bdd.js
Ni();
var wW = "ref", TW = -1, EW = !0, DW = "isSet", OW = "PartitionResult", kW = "booleanEquals", AW = "getAttr", jW = { [wW]: "Endpoint" }, MW = { [wW]: OW }, NW = {}, PW = [{ [wW]: "Region" }], FW = {
	conditions: [
		[DW, [jW]],
		[DW, PW],
		[
			"aws.partition",
			PW,
			OW
		],
		[kW, [{ [wW]: "UseFIPS" }, EW]],
		[kW, [{ [wW]: "UseDualStack" }, EW]],
		[kW, [{
			fn: AW,
			argv: [MW, "supportsDualStack"]
		}, EW]],
		[kW, [{
			fn: AW,
			argv: [MW, "supportsFIPS"]
		}, EW]],
		["stringEquals", [{
			fn: AW,
			argv: [MW, "name"]
		}, "aws-us-gov"]]
	],
	results: [
		[TW],
		[TW, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[TW, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[jW, NW],
		["https://elasticloadbalancing-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", NW],
		[TW, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://elasticloadbalancing.{Region}.amazonaws.com", NW],
		["https://elasticloadbalancing-fips.{Region}.{PartitionResult#dnsSuffix}", NW],
		[TW, "FIPS is enabled but this partition does not support FIPS"],
		["https://elasticloadbalancing.{Region}.{PartitionResult#dualStackDnsSuffix}", NW],
		[TW, "DualStack is enabled but this partition does not support DualStack"],
		["https://elasticloadbalancing.{Region}.{PartitionResult#dnsSuffix}", NW],
		[TW, "Invalid Configuration: Missing Region"]
	]
}, IW = 2, LW = new Int32Array([
	-1,
	1,
	-1,
	0,
	13,
	3,
	1,
	4,
	100000012,
	2,
	5,
	100000012,
	3,
	8,
	6,
	4,
	7,
	100000011,
	5,
	100000009,
	100000010,
	4,
	11,
	9,
	6,
	10,
	100000008,
	7,
	100000006,
	100000007,
	5,
	12,
	100000005,
	6,
	100000004,
	100000005,
	3,
	100000001,
	14,
	4,
	100000002,
	100000003
]), RW = vr.from(LW, IW, FW.conditions, FW.results);
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/endpoint/endpointResolver.js
Ni();
var zW = new br({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), BW = (e, t = {}) => zW.get(e, () => ki(RW, {
	endpointParams: e,
	logger: t.logger
}));
Ar.aws = rc;
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/models/ElasticLoadBalancingV2ServiceException.js
var z = class e extends et {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.elasticloadbalancingv2#ElasticLoadBalancingV2ServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, VW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#CertificateNotFoundException";
	name = "CertificateNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CertificateNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, HW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#ListenerNotFoundException";
	name = "ListenerNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ListenerNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, UW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyCertificatesException";
	name = "TooManyCertificatesException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCertificatesException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, WW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DuplicateTagKeysException";
	name = "DuplicateTagKeysException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DuplicateTagKeysException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, GW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#LoadBalancerNotFoundException";
	name = "LoadBalancerNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "LoadBalancerNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, KW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#RuleNotFoundException";
	name = "RuleNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RuleNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, qW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TargetGroupNotFoundException";
	name = "TargetGroupNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TargetGroupNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, JW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyTagsException";
	name = "TooManyTagsException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTagsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, YW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TrustStoreNotFoundException";
	name = "TrustStoreNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustStoreNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, XW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidRevocationContentException";
	name = "InvalidRevocationContentException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidRevocationContentException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ZW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#RevocationContentNotFoundException";
	name = "RevocationContentNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RevocationContentNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, QW = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyTrustStoreRevocationEntriesException";
	name = "TooManyTrustStoreRevocationEntriesException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTrustStoreRevocationEntriesException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, $W = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#AllocationIdNotFoundException";
	name = "AllocationIdNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "AllocationIdNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, eG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#ALPNPolicyNotSupportedException";
	name = "ALPNPolicyNotSupportedException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ALPNPolicyNotSupportedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, tG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#AvailabilityZoneNotSupportedException";
	name = "AvailabilityZoneNotSupportedException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "AvailabilityZoneNotSupportedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, nG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#CaCertificatesBundleNotFoundException";
	name = "CaCertificatesBundleNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CaCertificatesBundleNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, rG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#CapacityDecreaseRequestsLimitExceededException";
	name = "CapacityDecreaseRequestsLimitExceededException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CapacityDecreaseRequestsLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, iG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#CapacityReservationPendingException";
	name = "CapacityReservationPendingException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CapacityReservationPendingException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, aG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#CapacityUnitsLimitExceededException";
	name = "CapacityUnitsLimitExceededException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CapacityUnitsLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, oG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DuplicateListenerException";
	name = "DuplicateListenerException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DuplicateListenerException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, sG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#IncompatibleProtocolsException";
	name = "IncompatibleProtocolsException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IncompatibleProtocolsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, cG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidConfigurationRequestException";
	name = "InvalidConfigurationRequestException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidConfigurationRequestException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, lG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidLoadBalancerActionException";
	name = "InvalidLoadBalancerActionException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidLoadBalancerActionException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, uG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#SSLPolicyNotFoundException";
	name = "SSLPolicyNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "SSLPolicyNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, dG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TargetGroupAssociationLimitException";
	name = "TargetGroupAssociationLimitException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TargetGroupAssociationLimitException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, fG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyActionsException";
	name = "TooManyActionsException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyActionsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, pG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyListenersException";
	name = "TooManyListenersException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyListenersException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, mG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyRegistrationsForTargetIdException";
	name = "TooManyRegistrationsForTargetIdException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyRegistrationsForTargetIdException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, hG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyTargetsException";
	name = "TooManyTargetsException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTargetsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, gG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyUniqueTargetGroupsPerLoadBalancerException";
	name = "TooManyUniqueTargetGroupsPerLoadBalancerException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyUniqueTargetGroupsPerLoadBalancerException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, _G = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TrustStoreNotReadyException";
	name = "TrustStoreNotReadyException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustStoreNotReadyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, vG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#UnsupportedProtocolException";
	name = "UnsupportedProtocolException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "UnsupportedProtocolException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, yG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DuplicateLoadBalancerNameException";
	name = "DuplicateLoadBalancerNameException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DuplicateLoadBalancerNameException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, bG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidSchemeException";
	name = "InvalidSchemeException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidSchemeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, xG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidSecurityGroupException";
	name = "InvalidSecurityGroupException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidSecurityGroupException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, SG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidSubnetException";
	name = "InvalidSubnetException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidSubnetException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, CG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#OperationNotPermittedException";
	name = "OperationNotPermittedException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "OperationNotPermittedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, wG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#ResourceInUseException";
	name = "ResourceInUseException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, TG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#SubnetNotFoundException";
	name = "SubnetNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "SubnetNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, EG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyLoadBalancersException";
	name = "TooManyLoadBalancersException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyLoadBalancersException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, DG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#PriorityInUseException";
	name = "PriorityInUseException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PriorityInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, OG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyRulesException";
	name = "TooManyRulesException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyRulesException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, kG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyTargetGroupsException";
	name = "TooManyTargetGroupsException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTargetGroupsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, AG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DuplicateTargetGroupNameException";
	name = "DuplicateTargetGroupNameException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DuplicateTargetGroupNameException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, jG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DuplicateTrustStoreNameException";
	name = "DuplicateTrustStoreNameException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DuplicateTrustStoreNameException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, MG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidCaCertificatesBundleException";
	name = "InvalidCaCertificatesBundleException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidCaCertificatesBundleException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, NG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TooManyTrustStoresException";
	name = "TooManyTrustStoresException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTrustStoresException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, PG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#DeleteAssociationSameAccountException";
	name = "DeleteAssociationSameAccountException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DeleteAssociationSameAccountException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, FG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TrustStoreAssociationNotFoundException";
	name = "TrustStoreAssociationNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustStoreAssociationNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, IG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#TrustStoreInUseException";
	name = "TrustStoreInUseException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustStoreInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, LG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InvalidTargetException";
	name = "InvalidTargetException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidTargetException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, RG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#HealthUnavailableException";
	name = "HealthUnavailableException";
	$fault = "server";
	Message;
	constructor(t) {
		super({
			name: "HealthUnavailableException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, zG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#RevocationIdNotFoundException";
	name = "RevocationIdNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RevocationIdNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, BG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, VG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#InsufficientCapacityException";
	name = "InsufficientCapacityException";
	$fault = "server";
	Message;
	constructor(t) {
		super({
			name: "InsufficientCapacityException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, HG = class e extends z {
	static shapeId = "com.amazonaws.elasticloadbalancingv2#PriorRequestNotCompleteException";
	name = "PriorRequestNotCompleteException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PriorRequestNotCompleteException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/schemas/schemas_0.js
Je();
var UG = "AllocationId", WG = "AllocationIdNotFoundException", GG = "ALPNPolicyNotSupportedException", KG = "AvailabilityZone", qG = "AvailabilityZoneNotSupportedException", JG = "AvailabilityZones", YG = "CaCertificatesBundleNotFoundException", XG = "CapacityDecreaseRequestsLimitExceededException", ZG = "CanonicalHostedZoneId", QG = "CertificateNotFoundException", $G = "CustomerOwnedIpv4Pool", eK = "CapacityReservationPendingException", tK = "CreatedTime", nK = "CapacityUnitsLimitExceededException", rK = "Code", iK = "DeleteAssociationSameAccountException", aK = "DescribeLoadBalancersInput", oK = "DuplicateLoadBalancerNameException", sK = "DescribeLoadBalancersOutput", cK = "DescribeLoadBalancers", lK = "DuplicateListenerException", uK = "DNSName", dK = "DuplicateTargetGroupNameException", fK = "DuplicateTagKeysException", pK = "DuplicateTrustStoreNameException", mK = "EnablePrefixForIpv6SourceNat", hK = "EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic", gK = "HealthUnavailableException", _K = "IpAddress", vK = "IpAddressType", yK = "InvalidCaCertificatesBundleException", bK = "InsufficientCapacityException", xK = "InvalidConfigurationRequestException", SK = "Ipv4IpamPoolId", CK = "InvalidLoadBalancerActionException", wK = "IpamPools", TK = "IPv6Address", EK = "IncompatibleProtocolsException", DK = "InvalidRevocationContentException", OK = "InvalidSchemeException", kK = "InvalidSubnetException", AK = "InvalidSecurityGroupException", jK = "InvalidTargetException", MK = "LoadBalancers", NK = "LoadBalancerAddresses", PK = "LoadBalancerArn", FK = "LoadBalancerArns", IK = "LoadBalancerAddress", LK = "LoadBalancerName", RK = "LoadBalancerNotFoundException", zK = "LoadBalancerState", BK = "LoadBalancer", VK = "ListenerNotFoundException", B = "Message", HK = "Marker", UK = "NextMarker", WK = "Names", GK = "OutpostId", KK = "OperationNotPermittedException", qK = "PrivateIPv4Address", JK = "PriorityInUseException", YK = "PriorRequestNotCompleteException", XK = "PageSize", ZK = "Reason", QK = "RevocationContentNotFoundException", $K = "RevocationIdNotFoundException", eq = "ResourceInUseException", tq = "ResourceNotFoundException", nq = "RuleNotFoundException", rq = "State", iq = "SecurityGroups", aq = "SubnetId", oq = "SubnetNotFoundException", sq = "SourceNatIpv6Prefixes", cq = "SSLPolicyNotFoundException", lq = "Scheme", uq = "Type", dq = "TargetGroupAssociationLimitException", fq = "TargetGroupNotFoundException", pq = "TooManyActionsException", mq = "TooManyCertificatesException", hq = "TooManyLoadBalancersException", gq = "TooManyListenersException", _q = "TooManyRulesException", vq = "TooManyRegistrationsForTargetIdException", yq = "TooManyTagsException", bq = "TooManyTargetsException", xq = "TooManyTargetGroupsException", Sq = "TooManyTrustStoresException", Cq = "TooManyTrustStoreRevocationEntriesException", wq = "TooManyUniqueTargetGroupsPerLoadBalancerException", Tq = "TrustStoreAssociationNotFoundException", Eq = "TrustStoreInUseException", Dq = "TrustStoreNotFoundException", Oq = "TrustStoreNotReadyException", kq = "UnsupportedProtocolException", Aq = "VpcId", jq = "ZoneName", V = "awsQueryError", H = "client", U = "error", W = "httpError", Mq = "smithy.ts.sdk.synthetic.com.amazonaws.elasticloadbalancingv2", Nq = "server", G = "com.amazonaws.elasticloadbalancingv2", Pq = new Ke(Mq), Fq = [
	-3,
	Mq,
	"ElasticLoadBalancingV2ServiceException",
	0,
	[],
	[]
];
Pq.registerError(Fq, z);
var K = new Ke(G), Iq = [
	-3,
	G,
	WG,
	{
		[V]: ["AllocationIdNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Iq, $W);
var Lq = [
	-3,
	G,
	GG,
	{
		[V]: ["ALPNPolicyNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Lq, eG);
var Rq = [
	-3,
	G,
	qG,
	{
		[V]: ["AvailabilityZoneNotSupported", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Rq, tG);
var zq = [
	-3,
	G,
	YG,
	{
		[V]: ["CaCertificatesBundleNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(zq, nG);
var Bq = [
	-3,
	G,
	XG,
	{
		[V]: ["CapacityDecreaseRequestLimitExceeded", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Bq, rG);
var Vq = [
	-3,
	G,
	eK,
	{
		[V]: ["CapacityReservationPending", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Vq, iG);
var Hq = [
	-3,
	G,
	nK,
	{
		[V]: ["CapacityUnitsLimitExceeded", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Hq, aG);
var Uq = [
	-3,
	G,
	QG,
	{
		[V]: ["CertificateNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Uq, VW);
var Wq = [
	-3,
	G,
	iK,
	{
		[V]: ["DeleteAssociationSameAccount", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Wq, PG);
var Gq = [
	-3,
	G,
	lK,
	{
		[V]: ["DuplicateListener", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Gq, oG);
var Kq = [
	-3,
	G,
	oK,
	{
		[V]: ["DuplicateLoadBalancerName", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Kq, yG);
var qq = [
	-3,
	G,
	fK,
	{
		[V]: ["DuplicateTagKeys", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(qq, WW);
var Jq = [
	-3,
	G,
	dK,
	{
		[V]: ["DuplicateTargetGroupName", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Jq, AG);
var Yq = [
	-3,
	G,
	pK,
	{
		[V]: ["DuplicateTrustStoreName", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Yq, jG);
var Xq = [
	-3,
	G,
	gK,
	{
		[V]: ["HealthUnavailable", 500],
		[U]: Nq,
		[W]: 500
	},
	[B],
	[0]
];
K.registerError(Xq, RG);
var Zq = [
	-3,
	G,
	EK,
	{
		[V]: ["IncompatibleProtocols", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(Zq, sG);
var Qq = [
	-3,
	G,
	bK,
	{
		[V]: ["InsufficientCapacity", 500],
		[U]: Nq,
		[W]: 500
	},
	[B],
	[0]
];
K.registerError(Qq, VG);
var $q = [
	-3,
	G,
	yK,
	{
		[V]: ["InvalidCaCertificatesBundle", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError($q, MG);
var eJ = [
	-3,
	G,
	xK,
	{
		[V]: ["InvalidConfigurationRequest", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(eJ, cG);
var tJ = [
	-3,
	G,
	CK,
	{
		[V]: ["InvalidLoadBalancerAction", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(tJ, lG);
var nJ = [
	-3,
	G,
	DK,
	{
		[V]: ["InvalidRevocationContent", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(nJ, XW);
var rJ = [
	-3,
	G,
	OK,
	{
		[V]: ["InvalidScheme", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(rJ, bG);
var iJ = [
	-3,
	G,
	AK,
	{
		[V]: ["InvalidSecurityGroup", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(iJ, xG);
var aJ = [
	-3,
	G,
	kK,
	{
		[V]: ["InvalidSubnet", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(aJ, SG);
var oJ = [
	-3,
	G,
	jK,
	{
		[V]: ["InvalidTarget", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(oJ, LG);
var sJ = [
	-3,
	G,
	VK,
	{
		[V]: ["ListenerNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(sJ, HW);
var cJ = [
	-3,
	G,
	RK,
	{
		[V]: ["LoadBalancerNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(cJ, GW);
var lJ = [
	-3,
	G,
	KK,
	{
		[V]: ["OperationNotPermitted", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(lJ, CG);
var uJ = [
	-3,
	G,
	JK,
	{
		[V]: ["PriorityInUse", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(uJ, DG);
var dJ = [
	-3,
	G,
	YK,
	{
		[V]: ["PriorRequestNotComplete", 429],
		[U]: H,
		[W]: 429
	},
	[B],
	[0]
];
K.registerError(dJ, HG);
var fJ = [
	-3,
	G,
	eq,
	{
		[V]: ["ResourceInUse", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(fJ, wG);
var pJ = [
	-3,
	G,
	tq,
	{
		[V]: ["ResourceNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(pJ, BG);
var mJ = [
	-3,
	G,
	QK,
	{
		[V]: ["RevocationContentNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(mJ, ZW);
var hJ = [
	-3,
	G,
	$K,
	{
		[V]: ["RevocationIdNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(hJ, zG);
var gJ = [
	-3,
	G,
	nq,
	{
		[V]: ["RuleNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(gJ, KW);
var _J = [
	-3,
	G,
	cq,
	{
		[V]: ["SSLPolicyNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(_J, uG);
var vJ = [
	-3,
	G,
	oq,
	{
		[V]: ["SubnetNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(vJ, TG);
var yJ = [
	-3,
	G,
	dq,
	{
		[V]: ["TargetGroupAssociationLimit", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(yJ, dG);
var bJ = [
	-3,
	G,
	fq,
	{
		[V]: ["TargetGroupNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(bJ, qW);
var xJ = [
	-3,
	G,
	pq,
	{
		[V]: ["TooManyActions", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(xJ, fG);
var SJ = [
	-3,
	G,
	mq,
	{
		[V]: ["TooManyCertificates", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(SJ, UW);
var CJ = [
	-3,
	G,
	gq,
	{
		[V]: ["TooManyListeners", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(CJ, pG);
var wJ = [
	-3,
	G,
	hq,
	{
		[V]: ["TooManyLoadBalancers", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(wJ, EG);
var TJ = [
	-3,
	G,
	vq,
	{
		[V]: ["TooManyRegistrationsForTargetId", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(TJ, mG);
var EJ = [
	-3,
	G,
	_q,
	{
		[V]: ["TooManyRules", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(EJ, OG);
var DJ = [
	-3,
	G,
	yq,
	{
		[V]: ["TooManyTags", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(DJ, JW);
var OJ = [
	-3,
	G,
	xq,
	{
		[V]: ["TooManyTargetGroups", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(OJ, kG);
var kJ = [
	-3,
	G,
	bq,
	{
		[V]: ["TooManyTargets", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(kJ, hG);
var AJ = [
	-3,
	G,
	Cq,
	{
		[V]: ["TooManyTrustStoreRevocationEntries", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(AJ, QW);
var jJ = [
	-3,
	G,
	Sq,
	{
		[V]: ["TooManyTrustStores", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(jJ, NG);
var MJ = [
	-3,
	G,
	wq,
	{
		[V]: ["TooManyUniqueTargetGroupsPerLoadBalancer", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(MJ, gG);
var NJ = [
	-3,
	G,
	Tq,
	{
		[V]: ["AssociationNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(NJ, FG);
var PJ = [
	-3,
	G,
	Eq,
	{
		[V]: ["TrustStoreInUse", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(PJ, IG);
var FJ = [
	-3,
	G,
	Dq,
	{
		[V]: ["TrustStoreNotFound", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(FJ, YW);
var IJ = [
	-3,
	G,
	Oq,
	{
		[V]: ["TrustStoreNotReady", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(IJ, _G);
var LJ = [
	-3,
	G,
	kq,
	{
		[V]: ["UnsupportedProtocol", 400],
		[U]: H,
		[W]: 400
	},
	[B],
	[0]
];
K.registerError(LJ, vG);
var RJ = [Pq, K], zJ = [
	3,
	G,
	KG,
	0,
	[
		jq,
		aq,
		GK,
		NK,
		sq
	],
	[
		0,
		0,
		0,
		() => qJ,
		64
	]
], BJ = [
	3,
	G,
	aK,
	0,
	[
		FK,
		WK,
		HK,
		XK
	],
	[
		64,
		64,
		0,
		1
	]
], VJ = [
	3,
	G,
	sK,
	0,
	[MK, UK],
	[() => JJ, 0]
], HJ = [
	3,
	G,
	wK,
	0,
	[SK],
	[0]
], UJ = [
	3,
	G,
	BK,
	0,
	[
		PK,
		uK,
		ZG,
		tK,
		LK,
		lq,
		Aq,
		rq,
		uq,
		JG,
		iq,
		vK,
		$G,
		hK,
		mK,
		wK
	],
	[
		0,
		0,
		0,
		4,
		0,
		0,
		0,
		() => GJ,
		0,
		() => KJ,
		64,
		0,
		0,
		0,
		0,
		() => HJ
	]
], WJ = [
	3,
	G,
	IK,
	0,
	[
		_K,
		UG,
		qK,
		TK
	],
	[
		0,
		0,
		0,
		0
	]
], GJ = [
	3,
	G,
	zK,
	0,
	[rK, ZK],
	[0, 0]
], KJ = [
	1,
	G,
	JG,
	0,
	() => zJ
], qJ = [
	1,
	G,
	NK,
	0,
	() => WJ
], JJ = [
	1,
	G,
	MK,
	0,
	() => UJ
], YJ = [
	9,
	G,
	cK,
	0,
	() => BJ,
	() => VJ
];
pa(), ve(), S();
var XJ = (e) => ({
	apiVersion: "2015-12-01",
	base64Decoder: e?.base64Decoder ?? _t,
	base64Encoder: e?.base64Encoder ?? xt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? BW,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? yW,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Sc()
	}],
	logger: e?.logger ?? new dt(),
	protocol: e?.protocol ?? Ml,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.elasticloadbalancingv2",
		errorTypeRegistries: RJ,
		xmlNamespace: "http://elasticloadbalancing.amazonaws.com/doc/2015-12-01/",
		version: "2015-12-01",
		serviceTarget: "ElasticLoadBalancing_v10"
	},
	serviceId: e?.serviceId ?? "Elastic Load Balancing v2",
	sha256: e?.sha256 ?? da,
	urlParser: e?.urlParser ?? _e,
	utf8Decoder: e?.utf8Decoder ?? yt,
	utf8Encoder: e?.utf8Encoder ?? Tt
});
S(), zi();
var ZJ = (e) => {
	let t = dc(e), n = () => t().then(nt), r = XJ(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? zn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Zs({
			serviceId: r.serviceId,
			clientVersion: CW.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? xe("Region is missing"),
		requestHandler: Sl.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || rs),
		streamCollector: e?.streamCollector ?? Ri,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, QJ = (e) => {
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
}, $J = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), eY = (e, t) => {
	let n = Object.assign(pc(e), ct(e), yo(e), QJ(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, mc(n), lt(n), bo(n), $J(n));
};
Ni(), Je();
var tY = class extends Se {
	config;
	constructor(...[e]) {
		let t = ZJ(e || {});
		super(t), this.initConfig = t;
		let n = us(lc(ss(Ps(xW(t))))), r = eY(bW(ji(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(Me(this.config)), this.middlewareStack.use(Xs(this.config)), this.middlewareStack.use(cs(this.config)), this.middlewareStack.use(wo(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(gs(this.config)), this.middlewareStack.use(_s(this.config)), this.middlewareStack.use(Ss(this.config, {
			httpAuthSchemeParametersProvider: _W,
			identityProviderConfigProvider: async (e) => new ks({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Ds(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-elastic-load-balancing-v2@3.1156.0/node_modules/@aws-sdk/client-elastic-load-balancing-v2/dist-es/commandBuilder.js
Ni();
var nY = ft(SW, "ElasticLoadBalancing_v10", "ElasticLoadBalancingV2Client", Mi), rY = {}, iY = (e, t, n, r) => [], aY = class extends nY(rY, iY, "DescribeLoadBalancers", YJ) {}, oY = class extends Error {
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
}, sY = Symbol(), cY = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), lY = 1e4, uY = (e) => "headers" in e, dY = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (uY(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? fY(e, {
		all: n,
		dot: r
	}) : {};
};
async function fY(e, t) {
	if (!uY(e) && e.bodyCache.formData) return pY(await e.bodyCache.formData, t);
	let n = uY(e) ? e.headers : e.raw.headers, r = cY(await e.arrayBuffer(), n.get("Content-Type") || "");
	uY(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? pY(i, t) : {};
}
function pY(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? mY(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (hY(n, e, t, r), delete n[e]);
	}), n;
}
var mY = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, hY = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && gY(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= lY && gY(), i[e] = Object.create(null)), i = i[e]);
	});
}, gY = () => {
	throw Error("Nesting limit exceeded");
}, _Y = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, vY = (e) => {
	let { groups: t, path: n } = yY(e);
	return bY(_Y(n), t);
}, yY = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, bY = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, xY = {}, SY = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return xY[r] || (xY[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), xY[r];
	}
	return null;
}, CY = (e, t) => {
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
}, wY = (e) => CY(e, decodeURI), TY = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return wY(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, EY = (e) => {
	let t = TY(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, DY = (e, t, ...n) => (n.length && (t = DY(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), OY = (e) => {
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
}, kY = (e) => e.indexOf("%") === -1 ? e : CY(e, PY), AY = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), kY(e)), jY = (e, t, n) => {
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
					return AY(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = AY(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = AY(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, MY = jY, NY = (e, t) => jY(e, t, !0), PY = decodeURIComponent, FY = class {
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
		return n && kY(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = kY(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return MY(this.url, e);
	}
	queries(e) {
		return NY(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return dY(this, e);
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
	get [sY]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, IY = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, LY = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, RY = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => RY(e, t, !1, r, i))).then(() => i[0]));
	return n ? LY(await o, a) : o;
}, zY = "text/plain; charset=UTF-8", BY = (e, t) => ({
	"Content-Type": e,
	...t
}), VY = (e, t) => new Response(e, t), HY = class {
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
		return this.#t ??= new FY(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= VY(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = VY(e.body, e);
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
		this.finalized && (this.#a = VY(this.#a.body, this.#a));
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
		return VY(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, BY(zY, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, BY("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, BY("text/html; charset=UTF-8", n));
		return typeof e == "object" ? RY(e, IY.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => VY(), this.#c(this));
}, UY = (e, t, n) => (r, i) => {
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
}, WY = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], GY = "Can not add a route since the matcher is already built.", KY = class extends Error {}, qY = "__COMPOSED_HANDLER", JY = (e) => e.text("404 Not Found", 404), YY = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, XY = class e {
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
		[...WY, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? TY : EY;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = JY;
	errorHandler = YY;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === YY ? r = e.handler : (r = async (n, r) => (await UY([], t.errorHandler)(n, () => e.handler(n, r))).res, r[qY] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = DY(this._basePath, e), t;
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
			let t = DY(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", DY(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = DY(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : DY(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new HY(e, {
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
		let s = UY(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${DY("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, ZY = () => Object.create(null), QY = [];
function $Y(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], QY];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var eX = "[^/]+", tX = "(?:|/.*)", nX = Symbol(), rX = /* @__PURE__ */ new Set(".\\+*[^]$()");
function iX(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var aX = class e {
	#e;
	#t;
	#n = ZY();
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
				eX
			] : null : s === "/*" ? [
				"",
				"",
				tX
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && rX.has(n))) throw nX;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw nX;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw nX;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw nX;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(iX).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : rX.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, oX = class {
	#e = { varIndex: 0 };
	#t = new aX();
	#n = 0;
	paths = ZY();
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
}, sX = ZY();
function cX(e) {
	return sX[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? tX : e === "*" ? ".*" : `/:${eX}`)}$`);
}
function lX(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (cX(n).test(t)) return [...e[n]];
}
var uX = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: ZY() }, this.#t = { ALL: ZY() }, this.#n = { ALL: new oX() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === nX ? new KY(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(GY);
		if (!r[e]) {
			this.#n[e] = new oX();
			for (let t of [r, i]) {
				t[e] = ZY();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = cX(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = lX(r[e], t) || lX(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = OY(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = lX(r[t], e) || lX(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = $Y;
	buildAllMatchers() {
		let e = ZY();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, sX = ZY(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = ZY(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), ZY())]) : i[t] = [n.map(([e]) => [e, ZY()]), QY];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, dX = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(GY);
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
				if (e instanceof KY) continue;
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
}, fX = ZY(), pX = 0, mX = class e {
	#e = [];
	#t = ZY();
	#n = [];
	#r;
	#i = fX;
	insert(t, n, r) {
		let i = this, a = vY(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = SY(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++pX
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = ZY(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = fX;
		let r = [this], i = _Y(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === fX ? {} : { ...p.#i };
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
}, hX = class {
	name = "TrieRouter";
	#e = new mX();
	add(e, t, n) {
		for (let r of OY(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, gX = class extends XY {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new dX({ routers: [new uX(), new hX()] });
	}
}, _X = [
	"start",
	"stop",
	"reboot"
], vX = class extends Error {
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
}, q = class extends vX {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, yX = class extends vX {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, J = class extends vX {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, bX = class extends vX {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, xX = class extends vX {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, Y = class extends vX {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, SX = class extends vX {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, CX = class extends vX {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, wX = class extends vX {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, TX = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function EX(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && TX.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function DX(e, t) {
	let n = OX(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function OX(e, t) {
	if (e instanceof vX) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return EX(e) ? new CX(r, { cause: e }) : new wX(r, { cause: e });
}
var kX = 1e3, AX = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function jX(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new q("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new q("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new q("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new q("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = MX(r)), a;
}
function MX(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new q("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!AX.includes(t)) throw new q(`sortKey.operator must be one of ${AX.join(", ")}.`);
	if (typeof n != "string" || !n) throw new q("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new q("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new q("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function NX(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new q(`limit must be a whole number between 1 and ${kX}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new q(`limit must be between 1 and ${kX}.`);
	return t;
}
// src/cloud-spi/serviceCatalog.ts
var PX = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], FX = {
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
	autoscaling: {
		displayName: "Auto Scaling",
		displayNameByCloud: { aws: "Application Auto Scaling" },
		description: "Automatically adjust capacity for scalable resources across services.",
		docsSlugByCloud: { aws: "application-auto-scaling" },
		iconKey: "compute",
		group: "Compute",
		order: 50
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
}, IX = Object.keys(FX).map((e) => ({
	service: e,
	...FX[e]
})).sort(BX);
IX.map((e) => e.service);
function X(e) {
	return Object.hasOwn(FX, e);
}
function LX(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function RX(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function zX(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function BX(e, t) {
	let n = PX.indexOf(e.group) - PX.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var VX = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function HX(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${VX[t]}/${n}/` : void 0;
}
// src/adapter-aws/awsErrors.ts
var UX = /* @__PURE__ */ new Set([
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
]), WX = /* @__PURE__ */ new Set([
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
]), GX = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), KX = /* @__PURE__ */ new Set([
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
]), qX = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), JX = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), YX = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function XX(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function ZX(e) {
	if (!XX(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || UX.has(n)) return new xX(r, i);
	if (WX.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new bX(r, i);
	if (GX.has(n)) return new yX(r, i);
	if (KX.has(n)) return new q(r, i);
	if (qX.has(n) || /\.NotFound$/.test(n)) return new J(r, i);
	if (JX.has(n)) return new SX(r, i);
	if (YX.has(n) || EX(e)) return new CX(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new q(r, i) : a === 401 || a === 403 ? new yX(r, i) : a === 404 ? new J(r, i) : a === 409 ? new bX(r, i) : a === 429 ? new xX(r, i) : a === 501 ? new SX(r, i) : a === 503 || a === 504 ? new CX(r, i) : new wX(r, i);
}
// browser-bundle/cloudproxy-stub.ts
function QX() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// src/service/deadline.ts
async function $X(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// src/service/defaultCloud.ts
var eZ = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, tZ = !1;
function nZ(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = rZ(t);
	return !n && !tZ && (tZ = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function rZ(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(eZ, t) ? eZ[t] : null;
}
var iZ = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), aZ = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), oZ = 5464, sZ = 8192, cZ = 50, lZ = 12e4;
function uZ(e, t = QX) {
	let n = new gX();
	n.onError((e, t) => {
		if (e instanceof vX) {
			let { status: n, body: r } = DX(e);
			return t.json(r, n);
		}
		return e instanceof oY ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : nZ();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && Z(n) && n !== i) throw new J("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new J("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return OZ(e, 150), Q(e, () => $X(lZ, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: AZ(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!Z(n)) throw new J("Unknown cloud");
		return n === "aws" ? Q(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new q("queryString must be a string.");
			if (typeof t.startTime != "number") throw new q("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new q("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new q("limit must be a number.");
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
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new q("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > cZ) throw new q(`logGroupNames must include at most ${cZ} log groups.`);
			if (typeof n.queryString != "string") throw new q("queryString must be a string.");
			if (typeof n.startTime != "number") throw new q("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new q("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new q("limit must be a number.");
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
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
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
		if (!Z(t) || n === null) throw new J("Unknown cloud or version");
		return Q(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new J("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!Z(t) || n === null) throw new J("Unknown cloud or version");
		return Q(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!Z(t) || !Number.isInteger(n) || n <= 0) throw new J("Unknown cloud or deployment");
		return Q(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new J("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), EZ(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), EZ(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", DZ(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), EZ(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", DZ(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = TZ(e);
		if (!t) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), jX(n), DZ(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new J("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new q("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return Q(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new q("Object key is required");
		return Q(e, async () => {
			let a = await r(e).getObject(t, n, e.req.param("id"), i);
			return new Response(a.body, { headers: {
				"content-type": a.contentType,
				...a.contentLength === null ? {} : { "content-length": String(a.contentLength) },
				"content-disposition": `attachment; filename="${i.split("/").pop() ?? i}"`
			} });
		});
	}), n.delete("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new q("Object key is required");
		return Q(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new q("srcKey and destKey are required");
		return Q(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await _Z(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new q("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new q("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new q("maxMessages must be an integer between 1 and 10");
		return Q(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = mZ((await _Z(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = hZ(e.req.query());
		return Q(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new q("receiptHandle is required");
		return Q(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return kZ(e, async () => {
			let n = await yZ(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: wZ(n.plaintextBase64, "plaintextBase64", oZ),
				encryptionAlgorithm: bZ(n.encryptionAlgorithm),
				encryptionContext: CZ(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return kZ(e, async () => {
			let n = await yZ(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: wZ(n.ciphertextBlobBase64, "ciphertextBlobBase64", sZ),
				encryptionAlgorithm: bZ(n.encryptionAlgorithm),
				encryptionContext: CZ(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of _X) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!Z(n)) throw new J("Unknown cloud");
		return Q(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return kZ(e, async () => {
			let n = await yZ(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: wZ(n.messageBase64, "messageBase64", oZ),
				signingAlgorithm: xZ(n.signingAlgorithm)
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
		if (!Z(t)) throw new J("Unknown cloud");
		return kZ(e, async () => {
			let n = await yZ(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: wZ(n.messageBase64, "messageBase64", oZ),
				signature: wZ(n.signatureBase64, "signatureBase64", sZ),
				keyVersionId: SZ(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: xZ(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Z(t)) throw new J("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await _Z(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => {
			let i = gZ(await _Z(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Z(t) || !X(n)) throw new J("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function Z(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var dZ = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], fZ = 100, pZ = 100;
function mZ(e) {
	if (!Array.isArray(e) || e.length === 0) throw new q("messages must contain at least one entry");
	if (e.length > pZ) throw new q(`messages must contain at most ${pZ} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new q("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new q("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function hZ(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new q("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!dZ.includes(n)) throw new q(`cursorType must be one of ${dZ.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new q("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new q("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > fZ) throw new q(`limit must be an integer between 1 and ${fZ}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function gZ(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new q(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function _Z(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new q("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof q ? e : new q("Request body must be valid JSON");
	}
}
var vZ = class extends q {};
async function yZ(e) {
	try {
		return await _Z(e);
	} catch (e) {
		throw e instanceof q ? new vZ(e.message) : e;
	}
}
function bZ(e) {
	if (typeof e != "string" || !iZ.has(e)) throw new vZ("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function xZ(e) {
	if (typeof e != "string" || !aZ.has(e)) throw new vZ("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function SZ(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new vZ(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function CZ(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new vZ("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new vZ("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function wZ(e, t, n) {
	if (typeof e != "string") throw new vZ(`${t} must be a base64 string`);
	if (e.length > n) throw new vZ(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new vZ(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new vZ(`${t} must be canonical base64`);
	return r;
}
function TZ(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !Z(t) || !X(n) ? null : {
		cloud: t,
		service: n
	};
}
function EZ(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: NX(e.req.query("limit"))
	};
}
function DZ(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new q("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new q("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: NX(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function OZ(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function Q(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = DX(t, ZX);
		return e.json(r, n);
	}
}
async function kZ(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = DX(t, ZX);
		if (t instanceof vZ) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function AZ(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
uZ();
// src/registry/CloudAdapterRegistry.ts
var jZ = class {
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
}, MZ = async () => {}, NZ = {
	aws: MZ,
	azure: MZ,
	gcp: MZ,
	oci: MZ
};
function PZ() {
	return null;
}
// src/service/CloudProxyService.ts
var FZ = 5e3, IZ = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = NZ, n = nZ(), r = null) {
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
		return Promise.all(IX.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? LX(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: RX(t, e),
				docsUrl: HX(t, e),
				availability: a,
				reason: r.reason ?? LZ(a, e, o),
				route: zX(t, e),
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
			endpoint: PZ(e),
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
		if (r && Date.now() - r.at < FZ) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = PZ(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = DX(r, ZX);
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
		if (t && Date.now() - t.at < FZ) return t.value;
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
		if (!i.update) throw new Y(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new Y(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new Y(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new Y(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new Y(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new J(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new Y(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new Y(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new Y(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new Y(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new Y(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new Y(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new Y(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new Y(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new Y(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new Y(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new Y(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new Y(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new Y(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new Y(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new Y(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new Y(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new Y(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new Y(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new Y(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = RZ(e, t);
		if (this.emptying.has(a)) throw new bX(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new bX(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = RZ(e, t);
		if (this.emptying.has(r)) throw new bX(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
		if (!i.listObjects) throw new Y(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new Y(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new Y(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new Y(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new Y(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new Y(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new Y(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new Y(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new Y(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new Y(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new Y(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new Y(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new Y(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new Y(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new Y(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new Y(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new Y(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new Y(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new Y(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new Y(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new Y(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new Y(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new Y(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new Y(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new Y(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new Y(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new Y(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new Y(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new Y(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new Y(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new Y(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new Y(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new Y(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new Y(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new Y(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new Y(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new Y(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new Y(`AppConfig resources are not supported for ${e}/configuration`);
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
		if (!n.listLambdaTriggers) throw new Y(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new Y(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new Y(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new Y(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function LZ(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function RZ(e, t) {
	return JSON.stringify([e, t]);
}
// src/cloud-spi/networkingSchema.ts
var zZ = [
	{
		name: "name",
		label: "Name"
	},
	{
		name: "version",
		label: "CIDR",
		path: "metadata.cidrBlock",
		format: "code"
	},
	{
		name: "status",
		label: "State",
		format: "badge"
	},
	{
		name: "type",
		label: "Type"
	}
], BZ = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}];
function VZ() {
	return {
		cloud: "aws",
		service: "networking",
		displayName: "Networking",
		fields: [],
		actions: ["list"],
		filters: BZ,
		columns: zZ,
		capabilities: { resourceActions: [
			{
				name: "list",
				label: "VPCs",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			},
			{
				name: "inspect",
				label: "Inspect",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			},
			{
				name: "create",
				label: "Create resources",
				enabled: !1,
				status: "partial",
				reason: "Use the Networking panel — VPC and subnet creation need dependent selectors.",
				runtimeRequired: !0
			},
			{
				name: "delete",
				label: "Delete resources",
				enabled: !1,
				status: "partial",
				reason: "Use the Networking panel — deletion must resolve dependent networking resources first.",
				runtimeRequired: !0
			}
		] }
	};
}
var HZ = [
	"network",
	"subnetwork",
	"firewall"
];
[...BZ, HZ.map((e) => ({
	label: e,
	value: e
}))];
// browser-bundle/aws-stub.ts
var UZ = {
	eks: void 0,
	ec2: void 0,
	elbv2: void 0,
	dsql: void 0,
	sts: void 0
};
// src/services/ec2.ts
function WZ(e) {
	return (e ?? []).map((e) => ({
		key: e.Key ?? "",
		value: e.Value ?? ""
	}));
}
function GZ(e) {
	return e?.find((e) => e.Key === "Name")?.Value ?? "";
}
function KZ(e) {
	let t = WZ(e.Tags);
	return {
		instanceId: e.InstanceId ?? "",
		name: GZ(e.Tags) || (e.InstanceId ?? ""),
		state: e.State?.Name,
		instanceType: e.InstanceType,
		availabilityZone: e.Placement?.AvailabilityZone,
		publicIpAddress: e.PublicIpAddress,
		privateIpAddress: e.PrivateIpAddress,
		vpcId: e.VpcId,
		subnetId: e.SubnetId,
		imageId: e.ImageId,
		keyName: e.KeyName,
		launchTime: e.LaunchTime?.toISOString(),
		architecture: e.Architecture,
		platform: e.Platform,
		securityGroups: (e.SecurityGroups ?? []).map((e) => ({
			id: e.GroupId,
			name: e.GroupName
		})),
		tags: t
	};
}
function qZ(e) {
	return {
		imageId: e.ImageId ?? "",
		name: e.Name ?? e.ImageId ?? "",
		description: e.Description,
		state: e.State,
		architecture: e.Architecture,
		platform: e.Platform,
		virtualizationType: e.VirtualizationType,
		rootDeviceType: e.RootDeviceType,
		createdAt: e.CreationDate,
		ownerId: e.OwnerId,
		public: e.Public,
		tags: WZ(e.Tags)
	};
}
function JZ(e) {
	return {
		protocol: e.IpProtocol ?? "-1",
		fromPort: e.FromPort ?? null,
		toPort: e.ToPort ?? null,
		ipRanges: (e.IpRanges ?? []).map((e) => e.CidrIp ?? "").filter(Boolean),
		ipv6Ranges: (e.Ipv6Ranges ?? []).map((e) => e.CidrIpv6 ?? "").filter(Boolean)
	};
}
function YZ(e) {
	return {
		groupId: e.GroupId ?? "",
		groupName: e.GroupName ?? "",
		description: e.Description ?? "",
		vpcId: e.VpcId,
		inboundRules: (e.IpPermissions ?? []).map(JZ),
		outboundRules: (e.IpPermissionsEgress ?? []).map(JZ),
		tags: WZ(e.Tags)
	};
}
function XZ(e) {
	return {
		keyPairId: e.KeyPairId ?? "",
		keyName: e.KeyName ?? "",
		keyFingerprint: e.KeyFingerprint,
		tags: WZ(e.Tags)
	};
}
function ZZ(e) {
	return {
		vpcId: e.VpcId ?? "",
		cidrBlock: e.CidrBlock ?? "",
		state: e.State,
		isDefault: e.IsDefault ?? !1,
		tags: WZ(e.Tags)
	};
}
function QZ(e) {
	return {
		subnetId: e.SubnetId ?? "",
		vpcId: e.VpcId ?? "",
		cidrBlock: e.CidrBlock ?? "",
		availabilityZone: e.AvailabilityZone ?? "",
		availableIpAddressCount: e.AvailableIpAddressCount,
		mapPublicIpOnLaunch: e.MapPublicIpOnLaunch ?? !1,
		state: e.State,
		tags: WZ(e.Tags)
	};
}
function $Z(e) {
	return {
		internetGatewayId: e.InternetGatewayId ?? "",
		attachments: (e.Attachments ?? []).map((e) => ({
			vpcId: e.VpcId ?? "",
			state: e.State ?? ""
		})),
		tags: WZ(e.Tags)
	};
}
function eQ(e) {
	let t = e.NatGatewayAddresses?.[0];
	return {
		natGatewayId: e.NatGatewayId ?? "",
		subnetId: e.SubnetId ?? "",
		vpcId: e.VpcId ?? "",
		state: e.State,
		publicIp: t?.PublicIp,
		privateIp: t?.PrivateIp,
		eipAllocationId: t?.AllocationId,
		tags: WZ(e.Tags)
	};
}
function tQ(e) {
	return {
		routeTableId: e.RouteTableId ?? "",
		vpcId: e.VpcId ?? "",
		routes: (e.Routes ?? []).map((e) => ({
			destinationCidrBlock: e.DestinationCidrBlock,
			gatewayId: e.GatewayId,
			natGatewayId: e.NatGatewayId,
			vpcPeeringConnectionId: e.VpcPeeringConnectionId,
			state: e.State,
			origin: e.Origin
		})),
		associations: (e.Associations ?? []).map((e) => ({
			associationId: e.RouteTableAssociationId ?? "",
			subnetId: e.SubnetId,
			isMain: e.Main ?? !1
		})),
		tags: WZ(e.Tags)
	};
}
function nQ(e) {
	return {
		allocationId: e.AllocationId ?? "",
		publicIp: e.PublicIp ?? "",
		domain: e.Domain,
		associationId: e.AssociationId,
		instanceId: e.InstanceId,
		networkInterfaceId: e.NetworkInterfaceId,
		tags: WZ(e.Tags)
	};
}
function $(e) {
	return e instanceof Error && e.message.includes("is not supported");
}
function rQ(e = UZ.ec2, t = UZ.elbv2) {
	return {
		async listInstances() {
			let t = [], n;
			do {
				let r = await e.send(new qU({ NextToken: n }));
				for (let e of r.Reservations ?? []) t.push(...(e.Instances ?? []).map(KZ));
				n = r.NextToken;
			} while (n);
			return t;
		},
		async describeInstance(t) {
			let n = (await e.send(new qU({ InstanceIds: [t] }))).Reservations?.[0]?.Instances?.[0];
			return KZ(n ?? {});
		},
		async runInstance(t) {
			let n = t.rootVolumeSize ? [{
				DeviceName: "/dev/xvda",
				Ebs: {
					VolumeSize: t.rootVolumeSize,
					VolumeType: t.rootVolumeType ?? "gp3",
					DeleteOnTermination: !0
				}
			}] : void 0, r = t.subnetId ? [{
				DeviceIndex: 0,
				SubnetId: t.subnetId,
				AssociatePublicIpAddress: t.associatePublicIpAddress ?? !1,
				Groups: t.securityGroupIds?.length ? t.securityGroupIds : void 0
			}] : void 0, i = (await e.send(new pW({
				ImageId: t.imageId,
				MinCount: 1,
				MaxCount: 1,
				InstanceType: t.instanceType,
				KeyName: t.keyName || void 0,
				...r ? { NetworkInterfaces: r } : {
					SubnetId: t.subnetId || void 0,
					SecurityGroupIds: t.securityGroupIds?.length ? t.securityGroupIds : void 0
				},
				UserData: t.userData ? Buffer.from(t.userData).toString("base64") : void 0,
				IamInstanceProfile: t.iamInstanceProfileName ? { Name: t.iamInstanceProfileName } : void 0,
				BlockDeviceMappings: n,
				TagSpecifications: [{
					ResourceType: "instance",
					Tags: [{
						Key: "Name",
						Value: t.name
					}]
				}]
			}))).Instances?.[0];
			if (!i) throw Error("RunInstances returned no instance");
			return KZ(i);
		},
		async startInstance(t) {
			await e.send(new mW({ InstanceIds: [t] }));
		},
		async stopInstance(t) {
			await e.send(new hW({ InstanceIds: [t] }));
		},
		async rebootInstance(t) {
			await e.send(new lW({ InstanceIds: [t] }));
		},
		async terminateInstance(t) {
			await e.send(new gW({ InstanceIds: [t] }));
		},
		async updateInstanceTags(t, n, r) {
			n.length > 0 && await e.send(new MU({
				Resources: [t],
				Tags: n.map((e) => ({
					Key: e.key,
					Value: e.value
				}))
			})), r.length > 0 && await e.send(new VU({
				Resources: [t],
				Tags: r.map((e) => ({ Key: e }))
			}));
		},
		async createImage(t) {
			return { imageId: (await e.send(new wU({
				InstanceId: t.instanceId,
				Name: t.name,
				Description: t.description,
				NoReboot: t.noReboot
			}))).ImageId ?? "" };
		},
		async deregisterImage(t) {
			await e.send(new UU({ ImageId: t }));
		},
		async listAmis() {
			try {
				return ((await e.send(new KU({}))).Images ?? []).map(qZ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async getConsoleOutput(t) {
			try {
				let n = await e.send(new oW({ InstanceId: t }));
				return {
					instanceId: t,
					output: n.Output ? Buffer.from(n.Output, "base64").toString("utf-8") : "",
					timestamp: n.Timestamp?.toISOString()
				};
			} catch (e) {
				if ($(e)) return {
					instanceId: t,
					output: ""
				};
				throw e;
			}
		},
		async listKeyPairs() {
			try {
				return ((await e.send(new XU({}))).KeyPairs ?? []).map(XZ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createKeyPair(t) {
			let n = await e.send(new EU({ KeyName: t }));
			return {
				keyPairId: n.KeyPairId ?? "",
				keyName: n.KeyName ?? t,
				keyMaterial: n.KeyMaterial ?? ""
			};
		},
		async deleteKeyPair(t) {
			await e.send(new FU({ KeyName: t }));
		},
		async listSecurityGroups(t) {
			try {
				return ((await e.send(new $U({ Filters: t ? [{
					Name: "vpc-id",
					Values: [t]
				}] : void 0 }))).SecurityGroups ?? []).map(YZ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createSecurityGroup(t, n, r) {
			return { groupId: (await e.send(new AU({
				GroupName: t,
				Description: n,
				VpcId: r
			}))).GroupId ?? "" };
		},
		async deleteSecurityGroup(t) {
			await e.send(new zU({ GroupId: t }));
		},
		async authorizeSecurityGroupIngress(t, n) {
			await e.send(new CU({
				GroupId: t,
				IpPermissions: [{
					IpProtocol: n.protocol,
					FromPort: n.fromPort,
					ToPort: n.toPort,
					IpRanges: [{ CidrIp: n.cidr }]
				}]
			}));
		},
		async revokeSecurityGroupIngress(t, n) {
			await e.send(new fW({
				GroupId: t,
				IpPermissions: [{
					IpProtocol: n.protocol,
					FromPort: n.fromPort,
					ToPort: n.toPort,
					IpRanges: [{ CidrIp: n.cidr }]
				}]
			}));
		},
		async authorizeSecurityGroupEgress(t, n) {
			await e.send(new SU({
				GroupId: t,
				IpPermissions: [{
					IpProtocol: n.protocol,
					FromPort: n.fromPort,
					ToPort: n.toPort,
					IpRanges: [{ CidrIp: n.cidr }]
				}]
			}));
		},
		async revokeSecurityGroupEgress(t, n) {
			await e.send(new dW({
				GroupId: t,
				IpPermissions: [{
					IpProtocol: n.protocol,
					FromPort: n.fromPort,
					ToPort: n.toPort,
					IpRanges: [{ CidrIp: n.cidr }]
				}]
			}));
		},
		async listAvailabilityZones() {
			try {
				return ((await e.send(new GU({}))).AvailabilityZones ?? []).map((e) => ({
					zoneName: e.ZoneName ?? "",
					zoneId: e.ZoneId ?? "",
					state: e.State ?? "available"
				}));
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async listInstanceTypes() {
			try {
				return ((await e.send(new JU({}))).InstanceTypes ?? []).map((e) => ({
					instanceType: e.InstanceType ?? "",
					vcpu: e.VCpuInfo?.DefaultVCpus ?? 0,
					memoryMiB: e.MemoryInfo?.SizeInMiB ?? 0
				}));
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async modifySubnetMapPublicIp(t, n) {
			await e.send(new sW({
				SubnetId: t,
				MapPublicIpOnLaunch: { Value: n }
			}));
		},
		async getVpcAttributes(t) {
			let [n, r] = await Promise.all([e.send(new tW({
				VpcId: t,
				Attribute: "enableDnsHostnames"
			})), e.send(new tW({
				VpcId: t,
				Attribute: "enableDnsSupport"
			}))]);
			return {
				enableDnsHostnames: n.EnableDnsHostnames?.Value ?? !1,
				enableDnsSupport: r.EnableDnsSupport?.Value ?? !1
			};
		},
		async modifyVpcAttribute(t, n, r) {
			let i = n === "enableDnsHostnames" ? new cW({
				VpcId: t,
				EnableDnsHostnames: { Value: r }
			}) : new cW({
				VpcId: t,
				EnableDnsSupport: { Value: r }
			});
			await e.send(i);
		},
		async associateElasticIp(t, n) {
			return { associationId: (await e.send(new yU({
				AllocationId: t,
				InstanceId: n
			}))).AssociationId ?? "" };
		},
		async disassociateElasticIp(t) {
			await e.send(new iW({ AssociationId: t }));
		},
		async listVpcs() {
			try {
				return ((await e.send(new nW({}))).Vpcs ?? []).map(ZZ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createVpc(t) {
			return ZZ((await e.send(new NU({ CidrBlock: t }))).Vpc ?? {});
		},
		async deleteVpc(n) {
			let r;
			do {
				let e = await t.send(new aY(r ? { Marker: r } : {})), i = (e.LoadBalancers ?? []).find((e) => e.VpcId === n);
				if (i) {
					let e = i.LoadBalancerName ?? i.LoadBalancerArn ?? "unknown";
					throw Error(`Delete load balancer ${e} before deleting VPC ${n}`);
				}
				r = e.NextMarker || void 0;
			} while (r);
			let i = [{
				Name: "vpc-id",
				Values: [n]
			}];
			try {
				let t = await e.send(new $U({ Filters: i }));
				for (let n of t.SecurityGroups ?? []) if (n.GroupName !== "default" && n.GroupId) try {
					await e.send(new zU({ GroupId: n.GroupId }));
				} catch {}
			} catch (e) {
				if (!$(e)) throw e;
			}
			try {
				let t = await e.send(new eW({ Filters: i }));
				for (let n of t.Subnets ?? []) if (n.SubnetId) try {
					await e.send(new BU({ SubnetId: n.SubnetId }));
				} catch {}
			} catch (e) {
				if (!$(e)) throw e;
			}
			try {
				let t = await e.send(new YU({ Filters: [{
					Name: "attachment.vpc-id",
					Values: [n]
				}] }));
				for (let n of t.InternetGateways ?? []) if (n.InternetGatewayId) {
					for (let t of n.Attachments ?? []) if (t.VpcId) try {
						await e.send(new rW({
							InternetGatewayId: n.InternetGatewayId,
							VpcId: t.VpcId
						}));
					} catch {}
					try {
						await e.send(new PU({ InternetGatewayId: n.InternetGatewayId }));
					} catch {}
				}
			} catch (e) {
				if (!$(e)) throw e;
			}
			try {
				let t = await e.send(new QU({ Filters: i }));
				for (let n of t.RouteTables ?? []) if (n.RouteTableId && !(n.Associations ?? []).some((e) => e.Main)) {
					for (let t of n.Associations ?? []) if (!t.Main && t.RouteTableAssociationId) try {
						await e.send(new aW({ AssociationId: t.RouteTableAssociationId }));
					} catch {}
					try {
						await e.send(new RU({ RouteTableId: n.RouteTableId }));
					} catch {}
				}
			} catch (e) {
				if (!$(e)) throw e;
			}
			await e.send(new HU({ VpcId: n }));
		},
		async listSubnets(t) {
			try {
				return ((await e.send(new eW({ Filters: t ? [{
					Name: "vpc-id",
					Values: [t]
				}] : void 0 }))).Subnets ?? []).map(QZ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createSubnet(t, n, r) {
			return QZ((await e.send(new jU({
				VpcId: t,
				CidrBlock: n,
				AvailabilityZone: r || void 0
			}))).Subnet ?? {});
		},
		async deleteSubnet(t) {
			await e.send(new BU({ SubnetId: t }));
		},
		async listInternetGateways() {
			try {
				return ((await e.send(new YU({}))).InternetGateways ?? []).map($Z);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createInternetGateway(t) {
			let n = (await e.send(new TU({}))).InternetGateway ?? {};
			return t && n.InternetGatewayId && (await e.send(new MU({
				Resources: [n.InternetGatewayId],
				Tags: [{
					Key: "Name",
					Value: t
				}]
			})), n.Tags = [{
				Key: "Name",
				Value: t
			}]), $Z(n);
		},
		async attachInternetGateway(t, n) {
			await e.send(new xU({
				InternetGatewayId: t,
				VpcId: n
			}));
		},
		async detachInternetGateway(t, n) {
			await e.send(new rW({
				InternetGatewayId: t,
				VpcId: n
			}));
		},
		async deleteInternetGateway(t) {
			let n = (await e.send(new YU({ InternetGatewayIds: [t] }))).InternetGateways?.[0]?.Attachments ?? [];
			for (let r of n) r.VpcId && await e.send(new rW({
				InternetGatewayId: t,
				VpcId: r.VpcId
			}));
			await e.send(new PU({ InternetGatewayId: t }));
		},
		async listNatGateways(t) {
			try {
				return ((await e.send(new ZU({ Filter: t ? [{
					Name: "vpc-id",
					Values: [t]
				}] : void 0 }))).NatGateways ?? []).filter((e) => e.State !== "deleted").map(eQ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createNatGateway(t) {
			let n = t.allocationId;
			n ||= (await e.send(new vU({ Domain: "vpc" }))).AllocationId;
			let r = (await e.send(new DU({
				SubnetId: t.subnetId,
				AllocationId: n,
				ConnectivityType: "public"
			}))).NatGateway.NatGatewayId;
			t.name && await e.send(new MU({
				Resources: [r],
				Tags: [{
					Key: "Name",
					Value: t.name
				}]
			}));
			for (let t = 0; t < 15; t++) {
				let t = (await e.send(new ZU({ NatGatewayIds: [r] }))).NatGateways?.[0];
				if (t?.State === "available") return eQ(t);
				if (t?.State === "failed") throw Error(`NAT Gateway ${r} failed to become available`);
				await new Promise((e) => setTimeout(e, 1e3));
			}
			return eQ((await e.send(new ZU({ NatGatewayIds: [r] }))).NatGateways?.[0] ?? {
				NatGatewayId: r,
				SubnetId: t.subnetId
			});
		},
		async deleteNatGateway(t) {
			await e.send(new IU({ NatGatewayId: t }));
			for (let n = 0; n < 15; n++) {
				let n = (await e.send(new ZU({ NatGatewayIds: [t] }))).NatGateways?.[0]?.State;
				if (!n || n === "deleted") return;
				if (n === "failed") throw Error(`NAT Gateway ${t} deletion failed`);
				await new Promise((e) => setTimeout(e, 1e3));
			}
		},
		async listRouteTables(t) {
			try {
				return ((await e.send(new QU({ Filters: t ? [{
					Name: "vpc-id",
					Values: [t]
				}] : void 0 }))).RouteTables ?? []).map(tQ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async createRouteTable(t, n) {
			let r = (await e.send(new kU({ VpcId: t }))).RouteTable ?? {};
			return n && r.RouteTableId && (await e.send(new MU({
				Resources: [r.RouteTableId],
				Tags: [{
					Key: "Name",
					Value: n
				}]
			})), r.Tags = [{
				Key: "Name",
				Value: n
			}]), tQ(r);
		},
		async deleteRouteTable(t) {
			let n = (await e.send(new QU({ RouteTableIds: [t] }))).RouteTables?.[0];
			if (!n) throw Error(`Route table ${t} not found`);
			if ((n.Associations ?? []).some((e) => e.Main)) throw Error(`Cannot delete the main route table ${t}. Detach subnets and update the VPC's main route table first.`);
			for (let t of n.Associations ?? []) !t.Main && t.RouteTableAssociationId && await e.send(new aW({ AssociationId: t.RouteTableAssociationId }));
			await e.send(new RU({ RouteTableId: t }));
		},
		async createRoute(t, n) {
			await e.send(new OU({
				RouteTableId: t,
				DestinationCidrBlock: n.destinationCidrBlock,
				GatewayId: n.gatewayId || void 0,
				NatGatewayId: n.natGatewayId || void 0,
				VpcPeeringConnectionId: n.vpcPeeringConnectionId || void 0
			}));
		},
		async deleteRoute(t, n) {
			await e.send(new LU({
				RouteTableId: t,
				DestinationCidrBlock: n
			}));
		},
		async associateRouteTable(t, n) {
			return (await e.send(new bU({
				RouteTableId: t,
				SubnetId: n
			}))).AssociationId ?? "";
		},
		async disassociateRouteTable(t) {
			await e.send(new aW({ AssociationId: t }));
		},
		async listElasticIps() {
			try {
				return ((await e.send(new WU({}))).Addresses ?? []).map(nQ);
			} catch (e) {
				if ($(e)) return [];
				throw e;
			}
		},
		async allocateElasticIp(t) {
			let n = await e.send(new vU({ Domain: "vpc" })), r = n.AllocationId ?? "";
			return t && r && await e.send(new MU({
				Resources: [r],
				Tags: [{
					Key: "Name",
					Value: t
				}]
			})), {
				allocationId: r,
				publicIp: n.PublicIp ?? "",
				domain: n.Domain,
				tags: t ? [{
					key: "Name",
					value: t
				}] : []
			};
		},
		async releaseElasticIp(t) {
			await e.send(new uW({ AllocationId: t }));
		},
		async createVpcWizard(t) {
			let { name: n, cidrBlock: r, subnetGroups: i, natGateway: a, availabilityZone: o } = t, s = sQ(r, i);
			if (s) throw Error(s);
			let c = iQ(r, i), l = [], u = async (e) => {
				let t = [];
				for (let n of l.splice(e).reverse()) try {
					await n.run();
				} catch (e) {
					console.warn(`Failed to roll back ${n.resource}`, e), t.push(e);
				}
				return t;
			};
			try {
				let t = (await e.send(new NU({ CidrBlock: r }))).Vpc.VpcId;
				l.push({
					resource: t,
					run: () => e.send(new HU({ VpcId: t }))
				}), await e.send(new MU({
					Resources: [t],
					Tags: [{
						Key: "Name",
						Value: n
					}]
				}));
				let s = (await e.send(new TU({}))).InternetGateway.InternetGatewayId;
				l.push({
					resource: s,
					run: () => e.send(new PU({ InternetGatewayId: s }))
				}), await e.send(new MU({
					Resources: [s],
					Tags: [{
						Key: "Name",
						Value: `${n}-igw`
					}]
				})), await e.send(new xU({
					InternetGatewayId: s,
					VpcId: t
				})), l.push({
					resource: `${s} attachment`,
					run: () => e.send(new rW({
						InternetGatewayId: s,
						VpcId: t
					}))
				});
				let d = [];
				for (let r = 0; r < i.length; r++) {
					let a = i[r], s = [];
					for (let i = 0; i < a.count; i++) {
						let u = (await e.send(new jU({
							VpcId: t,
							CidrBlock: c[r][i],
							AvailabilityZone: a.az || o || void 0
						}))).Subnet.SubnetId;
						l.push({
							resource: u,
							run: () => e.send(new BU({ SubnetId: u }))
						}), await e.send(new MU({
							Resources: [u],
							Tags: [{
								Key: "Name",
								Value: `${n}-${a.name}-${i + 1}`
							}]
						})), s.push(u);
					}
					d.push({
						name: a.name,
						isPublic: a.isPublic,
						subnetIds: s
					});
				}
				let f = d.filter((e) => e.isPublic).flatMap((e) => e.subnetIds), p = d.filter((e) => !e.isPublic).flatMap((e) => e.subnetIds), m = (await e.send(new kU({ VpcId: t }))).RouteTable.RouteTableId;
				if (l.push({
					resource: m,
					run: () => e.send(new RU({ RouteTableId: m }))
				}), await e.send(new MU({
					Resources: [m],
					Tags: [{
						Key: "Name",
						Value: `${n}-pub-rtb`
					}]
				})), f.length > 0) {
					await e.send(new OU({
						RouteTableId: m,
						DestinationCidrBlock: "0.0.0.0/0",
						GatewayId: s
					}));
					for (let t of f) {
						let n = await e.send(new bU({
							RouteTableId: m,
							SubnetId: t
						}));
						if (n.AssociationId) {
							let t = n.AssociationId;
							l.push({
								resource: t,
								run: () => e.send(new aW({ AssociationId: t }))
							});
						}
					}
				}
				let h, g, _;
				if (a && p.length > 0 && f.length > 0) {
					let r = l.length;
					try {
						g = (await e.send(new vU({ Domain: "vpc" }))).AllocationId;
						let r = g;
						l.push({
							resource: r,
							run: () => e.send(new uW({ AllocationId: r }))
						}), h = (await e.send(new DU({
							SubnetId: f[0],
							AllocationId: g,
							ConnectivityType: "public"
						}))).NatGateway.NatGatewayId;
						let i = h;
						l.push({
							resource: i,
							run: async () => {
								await e.send(new IU({ NatGatewayId: i }));
								for (let t = 0; t < 600; t++) {
									let n;
									try {
										n = (await e.send(new ZU({ NatGatewayIds: [i] }))).NatGateways?.[0]?.State;
									} catch (e) {
										if (e instanceof Error && e.name === "NatGatewayNotFound") return;
										throw e;
									}
									if (!n || n === "deleted") return;
									t < 599 && await new Promise((e) => setTimeout(e, 1e3));
								}
								throw Error(`NAT Gateway ${i} was not deleted during rollback`);
							}
						}), await e.send(new MU({
							Resources: [h],
							Tags: [{
								Key: "Name",
								Value: `${n}-nat`
							}]
						}));
						for (let t = 0; t < 15; t++) {
							let t = (await e.send(new ZU({ NatGatewayIds: [h] }))).NatGateways?.[0]?.State;
							if (t === "available") break;
							if (t === "failed") throw Error(`NAT Gateway ${h} failed to become available`);
							await new Promise((e) => setTimeout(e, 1e3));
						}
						_ = (await e.send(new kU({ VpcId: t }))).RouteTable.RouteTableId;
						let a = _;
						l.push({
							resource: a,
							run: () => e.send(new RU({ RouteTableId: a }))
						}), await e.send(new MU({
							Resources: [_],
							Tags: [{
								Key: "Name",
								Value: `${n}-pri-rtb`
							}]
						})), await e.send(new OU({
							RouteTableId: _,
							DestinationCidrBlock: "0.0.0.0/0",
							NatGatewayId: h
						}));
						for (let t of p) {
							let n = await e.send(new bU({
								RouteTableId: _,
								SubnetId: t
							}));
							if (n.AssociationId) {
								let t = n.AssociationId;
								l.push({
									resource: t,
									run: () => e.send(new aW({ AssociationId: t }))
								});
							}
						}
					} catch (e) {
						if (!$(e)) throw e;
						let t = await u(r);
						if (t.length) throw AggregateError([e, ...t], "Failed to clean up unsupported NAT Gateway");
						h = void 0, g = void 0, _ = void 0;
					}
				}
				return {
					vpcId: t,
					igwId: s,
					publicSubnetIds: f,
					privateSubnetIds: p,
					subnetGroups: d,
					natGatewayId: h,
					eipAllocationId: g,
					publicRouteTableId: m,
					privateRouteTableId: _
				};
			} catch (e) {
				throw await u(0), e;
			}
		}
	};
}
function iQ(e, t) {
	let n = e.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
	if (!n) throw Error(`Invalid VPC CIDR: ${e}`);
	let r = Number(n[1]) * 16777216 + Number(n[2]) * 65536 + Number(n[3]) * 256 + Number(n[4]), i = Number(n[5]), a = Math.min(i + 4, 28);
	function o(e, t) {
		return `${Math.floor(e / 16777216)}.${Math.floor(e % 16777216 / 65536)}.${Math.floor(e % 65536 / 256)}.${e % 256}/${t}`;
	}
	let s = r;
	return t.map((e) => {
		let t = e.prefix ?? a, n = 2 ** (32 - t), r = Array.from({ length: e.count }, (e, r) => o(s + r * n, t));
		return s += e.count * n, r;
	});
}
function aQ(e) {
	let t = e.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
	if (!t) return null;
	let n = t.slice(1, 5).map(Number), r = Number(t[5]);
	if (n.some((e) => e > 255) || r < 0 || r > 32) return null;
	let i = n[0] * 16777216 + n[1] * 65536 + n[2] * 256 + n[3], a = 2 ** (32 - r);
	return {
		address: i,
		network: Math.floor(i / a) * a,
		prefix: r
	};
}
function oQ(e, t) {
	let n = aQ(e), r = aQ(t);
	if (!n || !r || n.prefix < r.prefix) return !1;
	let i = 2 ** (32 - n.prefix), a = 2 ** (32 - r.prefix);
	return n.network >= r.network && n.network + i <= r.network + a;
}
function sQ(e, t) {
	let n = aQ(e);
	if (!n) return `Invalid VPC CIDR ${e}`;
	if (n.address !== n.network) return `VPC CIDR ${e} is not a network address`;
	if (n.prefix < 16 || n.prefix > 28) return "VPC CIDR prefix must be between /16 and /28";
	if (t.length === 0) return "At least one subnet group is required";
	let r = 0;
	for (let i of t) {
		let t = i.prefix ?? Math.min(n.prefix + 4, 28);
		if (!Number.isInteger(i.count) || i.count < 1) return `Subnet group ${i.name} must contain at least one subnet`;
		if (!Number.isInteger(t) || t < n.prefix || t > 28) return `Subnet group ${i.name} has an invalid prefix /${t}`;
		if (r += i.count * 2 ** (32 - t), r > 2 ** (32 - n.prefix)) return `Requested subnet plan does not fit within VPC CIDR ${e}`;
	}
	let i = iQ(e, t);
	for (let t = 0; t < i.length; t++) for (let n of i[t]) {
		let t = aQ(n);
		if (!t || t.address !== t.network || !oQ(n, e)) return `Requested subnet ${n} does not fit within VPC CIDR ${e}`;
	}
	return null;
}
var cQ = rQ(), lQ = class {
	service_;
	cloud = "aws";
	service = "networking";
	constructor(e = cQ) {
		this.service_ = e;
	}
	schema() {
		return VZ();
	}
	async list(e = {}) {
		return fQ((await this.service_.listVpcs()).map(uQ), e.search);
	}
	async get(e) {
		let t = (await this.service_.listVpcs()).find((t) => t.vpcId === e);
		return t ? uQ(t) : null;
	}
	async create(e) {
		throw new Y("Use the Networking panel to create VPCs and networking resources.");
	}
	async delete(e) {
		throw new Y("Use the Networking panel to delete networking resources.");
	}
};
function uQ(e) {
	return {
		id: e.vpcId,
		name: dQ(e.tags) || e.vpcId,
		cloud: "aws",
		service: "networking",
		type: "vpc",
		region: null,
		createdAt: null,
		status: e.state ?? null,
		version: e.cidrBlock,
		metadata: {
			cidrBlock: e.cidrBlock,
			isDefault: e.isDefault,
			tags: e.tags
		}
	};
}
function dQ(e) {
	return e.find((e) => e.key === "Name")?.value ?? "";
}
function fQ(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n)) : e;
}
// browser-bundle/networking-entry.ts
var pQ = {
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test"
	},
	endpoint: "https://emulator.local.invalid"
}, mQ = uZ(new IZ(new jZ([new lQ(rQ(new _U(pQ), new tY(pQ)))]), {
	aws: async () => {},
	azure: async () => {},
	gcp: async () => {},
	oci: async () => {}
}, "aws", "us-east-1"));
async function hQ(e) {
	return mQ.fetch(e);
}
export { hQ as handleNetworkingRequest };
