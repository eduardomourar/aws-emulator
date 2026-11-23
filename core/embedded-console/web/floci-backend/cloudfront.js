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
})), v, ee = t((() => {
	_(), v = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function y(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var te = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function ne(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var b, re = t((() => {
	b = class e {
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
			return n.query &&= ne(n.query), n;
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
})), ie, ae = t((() => {
	ie = class {
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
})), oe, se, ce = t((() => {
	oe = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), se = (e, t = !1) => {
		if (!t) return oe.test(e);
		let n = e.split(".");
		for (let e of n) if (!se(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function le(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var ue = t((() => {})), x, de = t((() => {
	x = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function fe(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var pe = t((() => {})), me, he = t((() => {
	pe(), me = (e) => {
		if (typeof e == "string") return me(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = fe(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), ge, _e = t((() => {
	te(), he(), ge = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = me(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) y(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return me(e);
	};
})), S = t((() => {
	ee(), te(), re(), ae(), ce(), ue(), de(), he(), _e();
})), ve = (e) => () => Promise.reject(e), ye = class {
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
}, be, xe = t((() => {
	be = (e) => typeof e == "function" ? e() : e;
})), Se, Ce = t((() => {
	Se = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), we, Te, Ee = t((() => {
	S(), Ce(), we = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = v(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(Se(o, s, c, l, u), {
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
					if (ie.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Te(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Te(/^x-[\w-]+-id-2$/, r),
							cfId: Te(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Te = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), De, Oe = t((() => {
	S(), Ce(), De = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = v(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => ge(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(Se(a, o, s, c, l), r.input, {
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
function ke(e) {
	return { applyToStack: (t) => {
		t.add(De(e), je), t.add(we(e), Ae), e.protocol.setSerdeContext(e);
	} };
}
var Ae, je, Me = t((() => {
	Ee(), Oe(), Ae = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, je = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function Ne(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Pe[e]) return Pe[e];
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
	return Pe[e] = t;
}
var Pe, Fe = t((() => {
	Pe = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function Ie(e, t) {
	return e instanceof C ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new C(e, t);
}
var Le, Re, ze, C, Be, Ve, He = t((() => {
	xe(), Fe(), Le = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, Re = [], ze = {}, C = class e {
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
			for (this._isMemberSchema = !1; Be(i);) r.push(i[1]), i = i[0], a = be(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, Ne(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = be(a), Ve(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (Re[t]) return Re[t];
			} else if (typeof t == "string") {
				if (ze[t]) return ze[t];
			} else if (n && t[Le.ns]) return t[Le.ns];
			let r = be(t);
			if (r instanceof e) return r;
			if (Be(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), Ne(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Le.ns] = i : typeof r == "string" ? ze[r] = i : typeof r == "number" ? Re[r] = i : i;
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
			return Ne(this.memberTraits);
		}
		getOwnTraits() {
			return Ne(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return Ie([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return Ie([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return Ie(Be(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return Ie([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[Le.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = Ie([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Le.it] = n;
			}
		}
	}, Be = (e) => Array.isArray(e) && e.length === 2, Ve = (e) => Array.isArray(e) && e.length >= 5;
})), Ue, We = t((() => {
	Ue = class e {
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
})), w = t((() => {
	xe(), Me(), Ce(), He(), Fe(), We();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
w();
var Ge = "***SensitiveInformation***";
function Ke(e, t) {
	if (t == null) return t;
	let n = C.of(e);
	if (n.getMergedTraits().sensitive) return Ge;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return Ge;
		if (Array.isArray(t)) return t.map((t) => Ke(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return Ge;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, Ke(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = Ke(i, e[t]));
		return r;
	}
	return t;
}
_(), w();
var qe = Symbol.for("@smithy/op-event-stream"), Je = class {
	middlewareStack = s();
	schema;
	static classBuilder() {
		return new Ye();
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
		let v, ee = this.schema, y = ee?.[qe];
		if (y !== void 0) v = y;
		else if (ee && Array.isArray(ee) && ee[0] === 9) {
			let [, , , , e, t] = ee;
			v = ee[qe] = !!(C.of(e).getEventStreamMember() || C.of(t).getEventStreamMember());
		}
		return v && (_ = {
			isEventStream: v,
			..._
		}), d.resolve((e) => g.handle(e.request, _), m);
	}
}, Ye = class {
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
		return t = class extends Je {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? Ke.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? Ke.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, Xe = class e extends Error {
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
}, Ze = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), Qe = (e) => {
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
S(), _();
var $e = Object.values(f), et = (e) => {
	let t = [];
	for (let n in f) {
		if (!y(f, n)) continue;
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
			$e.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, tt = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		$e.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, nt = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), rt = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, it = (e) => Object.assign(et(e), nt(e)), at = (e) => Object.assign(tt(e), rt(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/get-value-from-text-node.js
S();
var ot = (e) => {
	let t = "#text";
	for (let n in e) y(e, n) && (e[n][t] === void 0 ? typeof e[n] == "object" && e[n] !== null && (e[n] = ot(e[n])) : e[n] = e[n][t]);
	return e;
}, st = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function ct(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return Je.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var lt, ut, dt, ft = t((() => {
	lt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ut = Object.entries(lt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), dt = lt.split("");
})), pt, mt = t((() => {
	ft(), pt = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in ut)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= ut[e[r]] << (a - r) * 6, i += 6;
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
})), ht, gt = t((() => {
	ht = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function _t(e) {
	let t;
	t = typeof e == "string" ? ht(e) : e;
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
			i += dt[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var vt = t((() => {
	gt(), ft();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function yt(e, t, n, r) {
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
var bt = t((() => {})), xt, St = t((() => {
	xt = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Ct(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, T[t[0]] + T[t[1]] + T[t[2]] + T[t[3]] + "-" + T[t[4]] + T[t[5]] + "-" + T[t[6]] + T[t[7]] + "-" + T[t[8]] + T[t[9]] + "-" + T[t[10]] + T[t[11]] + T[t[12]] + T[t[13]] + T[t[14]] + T[t[15]];
	};
}
var T, wt = t((() => {
	T = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), Tt, Et, Dt, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt = t((() => {
	Tt = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && zt.warn(Rt(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, Et = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Dt = (e) => {
		let t = Tt(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > Et) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Ot = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, kt = (e) => jt(e, 16), At = (e) => jt(e, 8), jt = (e, t) => {
		let n = Ot(e);
		if (n !== void 0 && Mt(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Mt = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Nt = (e) => Dt(typeof e == "string" ? Ft(e) : e), Pt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Ft = (e) => {
		let t = e.match(Pt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, It = (e) => kt(typeof e == "string" ? Ft(e) : e), Lt = (e) => At(typeof e == "string" ? Ft(e) : e), Rt = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), zt = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function Vt(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Ht[r]}, ${c} ${Ut[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on = t((() => {
	Bt(), Ht = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], Ut = [
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
	], Wt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), Gt = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), Kt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), qt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = Wt.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Jt(It(an(i)), Qt(r), nn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = Gt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Zt(Jt(Yt(i), Qt(r), nn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = Kt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Jt(It(an(c)), Qt(n), nn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, Jt = (e, t, n, r) => {
		let i = t - 1;
		return en(e, i, n), new Date(Date.UTC(e, i, n, nn(r.hours, "hour", 0, 23), nn(r.minutes, "minute", 0, 59), nn(r.seconds, "seconds", 0, 60), rn(r.fractionalMilliseconds)));
	}, Yt = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + It(an(e));
		return n < t ? n + 100 : n;
	}, Xt = 15768e8, Zt = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > Xt ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, Qt = (e) => {
		let t = Ut.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, $t = [
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
	], en = (e, t, n) => {
		let r = $t[t];
		if (t === 1 && tn(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${Ut[t]} in ${e}: ${n}`);
	}, tn = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), nn = (e, t, n, r) => {
		let i = Lt(an(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, rn = (e) => e == null ? 0 : Nt("0." + e) * 1e3, an = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), sn, cn = t((() => {
	sn = function(e) {
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
	}, sn.from = (e) => e && typeof e == "object" && (e instanceof sn || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? sn(String(e)) : sn(JSON.stringify(e)), sn.fromObject = sn.from;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/quote-header.js
function ln(e) {
	return (e.includes(",") || e.includes("\"")) && (e = `"${e.replace(/"/g, "\\\"")}"`), e;
}
var un = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function dn(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw Error(`Value ${r} out of range [${t}, ${n}]`);
}
var fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn = t((() => {
	fn = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", pn = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", mn = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", hn = "(\\d?\\d)", gn = "(\\d{4})", _n = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), vn = RegExp(`^${fn}, ${hn} ${pn} ${gn} ${mn} GMT$`), yn = RegExp(`^${fn}, ${hn}-${pn}-(\\d\\d) ${mn} GMT$`), bn = RegExp(`^${fn} ${pn} ( [1-9]|\\d\\d) ${mn} ${gn}$`), xn = [
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
	], Sn = (e) => {
		if (e == null) return;
		let t = NaN;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") {
			if (!/^-?\d*\.?\d+$/.test(e)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
			t = Number.parseFloat(e);
		} else typeof e == "object" && e.tag === 1 && (t = e.value);
		if (isNaN(t) || Math.abs(t) === Infinity) throw TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(t * 1e3));
	}, Cn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC3339 timestamps must be strings");
		let t = _n.exec(e);
		if (!t) throw TypeError(`Invalid RFC3339 timestamp format ${e}`);
		let [, n, r, i, a, o, s, , c, l] = t;
		dn(r, 1, 12), dn(i, 1, 31), dn(a, 0, 23), dn(o, 0, 59), dn(s, 0, 60);
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
	}, wn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC7231 timestamps must be strings.");
		let t, n, r, i, a, o, s, c;
		if ((c = vn.exec(e)) ? [, t, n, r, i, a, o, s] = c : (c = yn.exec(e)) ? ([, t, n, r, i, a, o, s] = c, r = (Number(r) + 1900).toString()) : (c = bn.exec(e)) && ([, n, t, i, a, o, s, r] = c), r && o) {
			let e = Date.UTC(Number(r), xn.indexOf(n), Number(t), Number(i), Number(a), Number(o), s ? Math.round(parseFloat(`0.${s}`) * 1e3) : 0);
			dn(t, 1, 31), dn(i, 0, 23), dn(a, 0, 59), dn(o, 0, 60);
			let c = new Date(e);
			return c.setUTCFullYear(Number(r)), c;
		}
		throw TypeError(`Invalid RFC7231 date-time value ${e}.`);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/split-every.js
function En(e, t, n) {
	if (n <= 0 || !Number.isInteger(n)) throw Error("Invalid number of delimiters (" + n + ") for splitEvery.");
	let r = e.split(t);
	if (n === 1) return r;
	let i = [], a = "";
	for (let e = 0; e < r.length; e++) a === "" ? a = r[e] : a += t + r[e], (e + 1) % n === 0 && (i.push(a), a = "");
	return a !== "" && i.push(a), i;
}
var Dn = t((() => {})), On, kn = t((() => {
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
		if (r in Fn) t[n / 2] = Fn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function E(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Pn[e[n]];
	return t;
}
var Pn, Fn, In = t((() => {
	Pn = {}, Fn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), Pn[e] = t, Fn[t] = e;
	}
})), Ln, Rn, zn = t((() => {
	Ln = typeof TextEncoder == "function" ? new TextEncoder() : null, Rn = (e) => {
		if (typeof e == "string") {
			if (Ln) return Ln.encode(e).byteLength;
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
})), Bn, Vn = t((() => {
	gt(), Bn = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? ht(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Hn(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Un = t((() => {})), Wn, Gn = t((() => {
	Wn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), Kn, qn = t((() => {
	Kn = async (e) => void 0;
})), Jn, Yn, Xn, Zn, Qn, $n, er = t((() => {
	Jn = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), $n(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!Qn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Yn = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Xn = /(\d+\.){3}\d+/, Zn = /\.\./, Qn = (e) => Yn.test(e) && !Xn.test(e) && !Zn.test(e), $n = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), tr = t((() => {
	er();
})), nr, rr = t((() => {
	nr = (e, t, n, r = !1) => {
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
})), ir = t((() => {
	S();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function ar(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(ge(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await or(t, n, r);
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
var or, sr = t((() => {
	tr(), rr(), ir(), or = async (e, t, n) => {
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
				r[t] = await nr(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Jn(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function cr(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function lr(e) {
	let t = ar(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && cr(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = v(i)?.selectedHttpAuthScheme?.httpAuthOption;
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
var ur = t((() => {
	S(), sr();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function dr(e) {
	let t = lr(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), pr);
	} });
}
var fr, pr, mr = t((() => {
	ur(), fr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, pr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: fr.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function hr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => ge(await x(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: x(i ?? !1),
			useFipsEndpoint: x(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var gr = t((() => {
	S(), ir();
})), _r, vr = t((() => {
	_r = class e {
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
})), yr, br = t((() => {
	yr = class {
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
})), D, xr = t((() => {
	D = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), Sr = t((() => {
	xr();
})), Cr, wr = t((() => {
	Cr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function Tr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${Tr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(Tr).join(", ")})` : JSON.stringify(e, null, 2);
}
var Er = t((() => {})), Dr = t((() => {
	wr(), Er();
})), Or, kr = t((() => {
	Or = {};
})), Ar, jr = t((() => {
	Ar = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function Mr(...e) {
	for (let t of e) if (t != null) return t;
}
var Nr = t((() => {})), Pr, Fr = t((() => {
	Sr(), Pr = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new D(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new D(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), Ir, Lr = t((() => {
	Sr(), Fr(), Ir = (e, t) => Pr(t).reduce((n, r) => {
		if (typeof n != "object") throw new D(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Rr, zr = t((() => {
	Rr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Br(e, t, n) {
	return e ? t : n;
}
var Vr = t((() => {})), Hr, Ur = t((() => {
	Hr = (e) => !e;
})), Wr, Gr, Kr = t((() => {
	Wr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), Gr = (e) => Wr.test(e) || e.startsWith("[") && e.endsWith("]");
})), qr, Jr, Yr = t((() => {
	_(), Kr(), qr = {
		[u.HTTP]: 80,
		[u.HTTPS]: 443
	}, Jr = (e) => {
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
		let l = Gr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${qr[c]}`) || typeof e == "string" && e.includes(`${r}:${qr[c]}`) ? `:${qr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Xr(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var Zr = t((() => {})), Qr, $r = t((() => {
	Qr = (e, t) => e === t;
})), ei, ti = t((() => {
	ei = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), ni, ri = t((() => {
	ni = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), ii = t((() => {
	jr(), Nr(), Lr(), zr(), S(), Vr(), Ur(), Yr(), Zr(), $r(), ti(), ri();
})), ai, oi = t((() => {
	ii(), ai = {
		booleanEquals: Ar,
		coalesce: Mr,
		getAttr: Ir,
		isSet: Rr,
		isValidHostLabel: se,
		ite: Br,
		not: Hr,
		parseURL: Jr,
		split: Xr,
		stringEquals: Qr,
		substring: ei,
		uriEncode: ni
	};
})), si, ci = t((() => {
	ii(), si = (e, t) => {
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
				n.push(Ir(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), li, ui = t((() => {
	li = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), di, fi, pi, mi = t((() => {
	Sr(), kr(), oi(), ci(), ui(), di = (e, t, n) => {
		if (typeof e == "string") return si(e, n);
		if (e.fn) return pi.callFunction(e, n);
		if (e.ref) return li(e, n);
		throw new D(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, fi = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = pi.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = Or[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = ai[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, pi = {
		evaluateExpression: di,
		callFunction: fi
	};
})), hi = t((() => {
	mi();
})), gi, _i = t((() => {
	Dr(), Sr(), hi(), gi = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new D(`'${n}' is already defined in Reference Record.`);
		let r = fi(e, t);
		t.logger?.debug?.(`${Cr} evaluateCondition: ${Tr(e)} = ${Tr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), vi, yi = t((() => {
	Sr(), mi(), vi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = di(e, "Header value entry", t);
		if (typeof r != "string") throw new D(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), bi, xi, Si, Ci = t((() => {
	Sr(), ci(), bi = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = Si.getEndpointProperty(r, t), e), {}), xi = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => xi(e, t));
		switch (typeof e) {
			case "string": return si(e, t);
			case "object":
				if (e === null) throw new D(`Unexpected endpoint property: ${e}`);
				return Si.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new D(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, Si = {
		getEndpointProperty: xi,
		getEndpointProperties: bi
	};
})), wi, Ti = t((() => {
	Sr(), mi(), wi = (e, t) => {
		let n = di(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new D(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), Ei, Di, Oi = t((() => {
	Sr(), _i(), mi(), yi(), Ci(), Ti(), Ei = 1e8, Di = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < Ei;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = gi({
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
		if (o >= Ei) {
			let e = i[o - Ei];
			if (e[0] === -1) {
				let [, t] = e;
				throw new D(di(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: wi(t, c),
				properties: bi(n, c),
				headers: vi(r ?? {}, c)
			};
		}
		throw new D("No matching endpoint.");
	};
})), ki, Ai, ji = t((() => {
	qn(), sr(), ur(), mr(), gr(), S(), vr(), br(), Oi(), Kr(), kr(), Dr(), Sr(), _i(), yi(), Ci(), Ti(), mi(), ir(), ki = hr(Kn), lr(Kn), Ai = dr(Kn);
})), Mi, Ni, Pi = t((() => {
	Mi = (e) => typeof ReadableStream == "function" && (e?.constructor?.name === ReadableStream.name || e instanceof ReadableStream), Ni = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Fi(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function Ii(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Hn(t, r);
}
var Li, Ri = t((() => {
	Un(), Pi(), Li = async (e) => Ni(e) ? Fi(e) : Ii(e);
})), zi, Bi, Vi, Hi = t((() => {
	vt(), In(), St(), Ri(), Pi(), zi = "The stream has already been transformed.", Bi = (e) => {
		if (!Vi(e) && !Mi(e)) {
			let t = e?.__proto__?.constructor?.name || e;
			throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${t}`);
		}
		let t = !1, n = async () => {
			if (t) throw Error(zi);
			return t = !0, await Li(e);
		}, r = (e) => {
			if (typeof e.stream != "function") throw Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
			return e.stream();
		};
		return Object.assign(e, {
			transformToByteArray: n,
			transformToString: async (e) => {
				let t = await n();
				if (e === "base64") return _t(t);
				if (e === "hex") return E(t);
				if (e === void 0 || e === "utf8" || e === "utf-8") return xt(t);
				if (typeof TextDecoder == "function") return new TextDecoder(e).decode(t);
				throw Error("TextDecoder is not available, please make sure polyfill is provided.");
			},
			transformToWebStream: () => {
				if (t) throw Error(zi);
				if (t = !0, Vi(e)) return r(e);
				if (Mi(e)) return e;
				throw Error(`Cannot transform payload to web stream, got ${e}`);
			}
		});
	}, Vi = (e) => typeof Blob == "function" && e instanceof Blob;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Ui(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Wi = t((() => {})), Gi, Ki, qi, Ji, O = t((() => {
	mt(), vt(), bt(), gt(), St(), wt(), on(), cn(), Bt(), un(), Tn(), Dn(), kn(), Mn(), In(), zn(), Vn(), Un(), Gn(), S(), ji(), Pi(), Hi(), Ri(), Wi(), Gi = class extends yt(xt, ht, _t, pt) {}, Ki = (e) => crypto.getRandomValues(e), qi = Ct(Ki), Ji = qi;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
O();
var Yi = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return Gi.mutate(e);
	if (!e) return Gi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return Gi.mutate(await n);
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function Xi(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
		return "%" + e.charCodeAt(0).toString(16).toUpperCase();
	});
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var Zi = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Qi, $i, ea, ta = t((() => {
	Qi = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Qi[e] = t >>> 0;
	}
	$i = 4294967295, ea = class {
		digestLength = 4;
		checksum = $i;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Qi[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ $i) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = $i;
		}
	};
})), k, na, ra, ia, aa, oa, sa = t((() => {
	O(), k = 64, na = 32, ra = 2 ** 53 - 1, ia = class e {
		digestLength = na;
		state = Int32Array.from(aa);
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
				for (let e = 0; e < k; ++e) a[e] = 54 ^ n[e], a[e + k] = 92 ^ n[e];
				r.update(a.subarray(0, k)), i.update(a.subarray(k));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = Bn(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > ra) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === k && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(aa), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % k >= 56) {
				for (let e = n; e < k; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(na);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = Bn(t);
			if (n.byteLength > k) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(k);
				return i.set(r), i;
			}
			if (n.byteLength < k) {
				let e = new Uint8Array(k);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < k; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (oa[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, aa = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), oa = new Int32Array([
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
})), ca, la, ua, da, fa, pa, ma = t((() => {
	O(), sa(), {digest: ca, sign: la, importKey: ua} = globalThis?.crypto?.subtle ?? {}, da = typeof ca == "function" && typeof la == "function" && typeof ua == "function" ? globalThis.crypto.subtle : void 0, fa = 8388608, pa = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = Bn(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= fa && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Hn(this.pending);
			if (da) {
				if (this.secret) {
					this.finished = !0;
					let t = await da.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await da.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await da.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new ia(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new ia(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), ha = t((() => {
	O(), ta(), sa(), ma();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function ga(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var _a, va = t((() => {
	O(), _a = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && ga(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && ga(e), parseInt(E(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), ya, ba, xa, Sa, Ca, wa, Ta, Ea, Da, Oa, ka, Aa, ja, Ma = t((() => {
	S(), O(), va(), ya = class {
		toUtf8;
		fromUtf8;
		constructor(e, t) {
			this.toUtf8 = e, this.fromUtf8 = t;
		}
		format(e) {
			let t = [];
			for (let n in e) {
				if (!y(e, n)) continue;
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
					if (e.value.byteLength > ja) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ja} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ja) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ja} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(_a.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!Aa.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
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
							type: xa,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: xa,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: Sa,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: Ca,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: wa,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: Ta,
							value: new _a(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: Ea,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: Da,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: Oa,
							value: new Date(new _a(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: ka,
							value: `${E(o.subarray(0, 4))}-${E(o.subarray(4, 6))}-${E(o.subarray(6, 8))}-${E(o.subarray(8, 10))}-${E(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(ba ||= {}), xa = "boolean", Sa = "byte", Ca = "short", wa = "integer", Ta = "long", Ea = "binary", Da = "string", Oa = "timestamp", ka = "uuid", Aa = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ja = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function Na({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < La) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(Pa, !1), o = r.getUint32(Fa, !1), s = r.getUint32(e - Ia, !1), c = new ea();
	if (c.update(new Uint8Array(n, t, Fa)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + Fa, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + Fa + Ia, a),
		body: new Uint8Array(n, t + Fa + Ia + a, i - a - 16)
	};
}
var Pa, Fa, Ia, La, Ra = t((() => {
	ha(), Pa = 4, Fa = 8, Ia = 4, La = 16;
})), za, Ba = t((() => {
	ha(), Ma(), Ra(), za = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new ya(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new ea();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = Na(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
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
			for await (let e of this.options.inputStream) yield this.options.decoder.decode(e);
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
			for await (let e of this.options.messageStream) yield this.options.encoder.encode(e);
			this.options.includeEndFrame && (yield /* @__PURE__ */ new Uint8Array());
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
			for await (let e of this.options.messageStream) {
				let t = await this.options.deserializer(e);
				t !== void 0 && (yield t);
			}
		}
	};
})), qa, Ja = t((() => {
	qa = class {
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
function Ya(e) {
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
var Xa = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Za(e, t) {
	let n = Qa(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Qa(e, t) {
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
var $a = t((() => {})), eo, to, no = t((() => {
	Ba(), Ha(), Wa(), Ka(), Ja(), Xa(), $a(), eo = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new za(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Ya(e);
			return new Ga({
				messageStream: new Va({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Qa(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Ua({
				messageStream: new qa({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, to = (e) => new eo(e);
})), ro, io, ao = t((() => {
	ro = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), io = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), oo, so, co, lo = t((() => {
	no(), ao(), oo = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new eo({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = so(e) ? ro(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? io(n) : n;
		}
	}, so = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, co = (e) => new oo(e);
})), uo, fo = t((() => {
	uo = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), po, mo = t((() => {
	S(), w(), O(), po = class {
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
				for (let n in e) if (y(e, n) && n !== "__type") {
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
				for (let t in e) if (y(e, t) && t !== "__type") {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? xt)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				for (let e in u.value) y(u.value, e) && (n[e] = u.value[e]);
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
				let e = a[1], t = Ue.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? ht)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), ho = /* @__PURE__ */ n({
	EventStreamCodec: () => za,
	EventStreamMarshaller: () => oo,
	EventStreamSerde: () => po,
	HeaderMarshaller: () => ya,
	Int64: () => _a,
	MessageDecoderStream: () => Va,
	MessageEncoderStream: () => Ua,
	SmithyMessageDecoderStream: () => Ga,
	SmithyMessageEncoderStream: () => qa,
	UniversalEventStreamMarshaller: () => eo,
	eventStreamSerdeProvider: () => co,
	getChunkedStream: () => Ya,
	getMessageUnmarshaller: () => Qa,
	getUnmarshalledStream: () => Za,
	iterableToReadableStream: () => io,
	readableStreamToIterable: () => ro,
	resolveEventStreamSerdeConfig: () => uo,
	universalEventStreamSerdeProvider: () => to
}), go = t((() => {
	Ba(), Ma(), va(), Ha(), Wa(), Ka(), Ja(), lo(), ao(), no(), Xa(), $a(), fo(), mo();
}));
S(), w();
var _o = class extends Zi {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Ue(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return b;
	}
	getResponseType() {
		return ie;
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.serializer.setSerdeContext(e), this.deserializer.setSerdeContext(e), this.getPayloadCodec() && this.getPayloadCodec().setSerdeContext(e);
	}
	updateServiceEndpoint(e, t) {
		if ("url" in t) {
			e.protocol = t.url.protocol, e.hostname = t.url.hostname, e.port = t.url.port ? Number(t.url.port) : void 0, e.path = t.url.pathname, e.fragment = t.url.hash || void 0, e.username = t.url.username || void 0, e.password = t.url.password || void 0, e.query ||= {};
			for (let [n, r] of t.url.searchParams.entries()) e.query[n] = r;
			if (t.headers) for (let n in t.headers) y(t.headers, n) && (e.headers[n] = t.headers[n].join(", "));
			return e;
		}
		if (e.protocol = t.protocol, e.hostname = t.hostname, e.port = t.port ? Number(t.port) : void 0, e.path = t.path, e.query = { ...t.query }, t.headers) for (let n in t.headers) y(t.headers, n) && (e.headers[n] = t.headers[n]);
		return e;
	}
	setHostPrefix(e, t, n) {
		if (this.serdeContext?.disableHostPrefix) return;
		let r = C.of(t.input), i = Ne(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !le(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (go(), ho));
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
S(), w(), O();
var vo = class extends _o {
	async serializeRequest(e, t, n) {
		let r = t && typeof t == "object" ? t : {}, i = this.serializer, a = {}, o = {}, s = await n.endpoint(), c = C.of(e?.input), l = [], u = [], d = !1, f, p = new b({
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
			let t = Ne(e.traits);
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
				p.path.includes(`{${e}+}`) ? p.path = p.path.replace(`{${e}+}`, n.split("/").map(Xi).join("/")) : p.path.includes(`{${e}}`) && (p.path = p.path.replace(`{${e}}`, Xi(n)));
			} else if (n.httpHeader) i.write(t, s), o[n.httpHeader.toLowerCase()] = String(i.flush());
			else if (typeof n.httpPrefixHeaders == "string") for (let e in s) {
				if (!y(s, e)) continue;
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
			for (let r in t) if (y(t, r) && !(r in n)) {
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
		let r = this.deserializer, i = C.of(e.output), a = {};
		if (n.statusCode >= 300) {
			let i = await Yi(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!y(n.headers, e)) continue;
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = await this.deserializeHttpMessage(i, t, n, a);
		if (o.length) {
			let e = await Yi(n.body, t);
			if (e.byteLength > 0) {
				let t = await r.read(i, e);
				for (let e of o) t[e] != null && (a[e] = t[e]);
			}
		} else o.discardResponseBody && await Yi(n.body, t);
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	async deserializeHttpMessage(e, t, n, r, i) {
		let a;
		a = r instanceof Set ? i : r;
		let o = !0, s = this.deserializer, c = C.of(e), l = [];
		for (let [e, r] of c.structIterator()) {
			let i = r.getMemberTraits();
			if (i.httpPayload) {
				if (o = !1, r.isStreaming()) r.isStructSchema() ? a[e] = await this.deserializeEventStream({
					response: n,
					responseSchema: c
				}) : a[e] = Bi(n.body);
				else if (n.body) {
					let i = await Yi(n.body, t);
					i.byteLength > 0 && (a[e] = await s.read(r, i));
				}
			} else if (i.httpHeader) {
				let t = String(i.httpHeader).toLowerCase(), o = n.headers[t];
				if (o != null) {
					if (r.isListSchema()) {
						let n = r.getValueSchema();
						n.getMergedTraits().httpHeader = t;
						let i;
						i = n.isTimestampSchema() && n.getSchema() === 4 ? En(o, ",", 2) : On(o);
						let c = [];
						for (let e of i) c.push(await s.read(n, e.trim()));
						a[e] = c;
					} else a[e] = await s.read(r, o);
				}
			} else if (i.httpPrefixHeaders !== void 0) {
				a[e] = {};
				for (let t in n.headers) if (y(n.headers, t) && t.startsWith(i.httpPrefixHeaders)) {
					let o = n.headers[t], c = r.getValueSchema();
					c.getMergedTraits().httpHeader = t, a[e][t.slice(i.httpPrefixHeaders.length)] = await s.read(c, o);
				}
			} else i.httpResponseCode ? a[e] = n.statusCode : l.push(e);
		}
		return l.discardResponseBody = o, l;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function yo(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
w(), O();
var bo = class extends Zi {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	read(e, t) {
		let n = C.of(e);
		if (n.isListSchema()) return On(t).map((e) => this.read(n.getValueSchema(), e));
		if (n.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? pt)(t);
		if (n.isTimestampSchema()) switch (yo(n, this.settings)) {
			case 5: return Cn(t);
			case 6: return wn(t);
			case 7: return Sn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (n.isStringSchema()) {
			let e = n.getMergedTraits().mediaType, r = t;
			if (e) return n.getMergedTraits().httpHeader && (r = this.base64ToUtf8(r)), (e === "application/json" || e.endsWith("+json")) && (r = sn.from(r)), r;
		}
		return n.isNumericSchema() ? Number(t) : n.isBigIntegerSchema() ? BigInt(t) : n.isBigDecimalSchema() ? new jn(t, "bigDecimal") : n.isBooleanSchema() ? String(t).toLowerCase() === "true" : t;
	}
	base64ToUtf8(e) {
		return (this.serdeContext?.utf8Encoder ?? xt)((this.serdeContext?.base64Decoder ?? pt)(e));
	}
};
w(), O();
var xo = class extends Zi {
	codecDeserializer;
	stringDeserializer;
	constructor(e, t) {
		super(), this.codecDeserializer = e, this.stringDeserializer = new bo(t);
	}
	setSerdeContext(e) {
		this.stringDeserializer.setSerdeContext(e), this.codecDeserializer.setSerdeContext(e), this.serdeContext = e;
	}
	read(e, t) {
		let n = C.of(e), r = n.getMergedTraits(), i = this.serdeContext?.utf8Encoder ?? xt;
		if (r.httpHeader || r.httpResponseCode) return this.stringDeserializer.read(n, i(t));
		if (r.httpPayload) {
			if (n.isBlobSchema()) {
				let e = this.serdeContext?.utf8Decoder ?? ht;
				return typeof t == "string" ? e(t) : t;
			}
			if (n.isStringSchema()) return "byteLength" in t ? i(t) : t;
		}
		return this.codecDeserializer.read(n, t);
	}
};
w(), O();
var So = class extends Zi {
	settings;
	stringBuffer = "";
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = C.of(e);
		switch (typeof t) {
			case "object":
				if (t === null) {
					this.stringBuffer = "null";
					return;
				}
				if (n.isTimestampSchema()) {
					if (!(t instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${t} when schema expected Date in ${n.getName(!0)}`);
					switch (yo(n, this.settings)) {
						case 5:
							this.stringBuffer = t.toISOString().replace(".000Z", "Z");
							break;
						case 6:
							this.stringBuffer = Vt(t);
							break;
						case 7:
							this.stringBuffer = String(t.getTime() / 1e3);
							break;
						default: console.warn("Missing timestamp format, using epoch seconds", t), this.stringBuffer = String(t.getTime() / 1e3);
					}
					return;
				}
				if (n.isBlobSchema() && "byteLength" in t) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? _t)(t);
					return;
				}
				if (n.isListSchema() && Array.isArray(t)) {
					let e = "";
					for (let r of t) {
						this.write([n.getValueSchema(), n.getMergedTraits()], r);
						let t = this.flush(), i = n.getValueSchema().isTimestampSchema() ? t : ln(t);
						e !== "" && (e += ", "), e += i;
					}
					this.stringBuffer = e;
					return;
				}
				this.stringBuffer = JSON.stringify(t, null, 2);
				break;
			case "string":
				let e = n.getMergedTraits().mediaType, r = t;
				if (e && ((e === "application/json" || e.endsWith("+json")) && (r = sn.from(r)), n.getMergedTraits().httpHeader)) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? _t)(r.toString());
					return;
				}
				this.stringBuffer = t;
				break;
			default: this.stringBuffer = n.isIdempotencyToken() ? Ji() : String(t);
		}
	}
	flush() {
		let e = this.stringBuffer;
		return this.stringBuffer = "", e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/HttpInterceptingShapeSerializer.js
w();
var Co = class {
	codecSerializer;
	stringSerializer;
	buffer;
	constructor(e, t, n = new So(t)) {
		this.codecSerializer = e, this.stringSerializer = n;
	}
	setSerdeContext(e) {
		this.codecSerializer.setSerdeContext(e), this.stringSerializer.setSerdeContext(e);
	}
	write(e, t) {
		let n = C.of(e), r = n.getMergedTraits();
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
}, wo = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), To = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
S();
var Eo = "content-length";
function Do(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (b.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(Eo) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[Eo]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var Oo = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, ko = (e) => ({ applyToStack: (t) => {
	t.add(Do(e.bodyLengthChecker), Oo);
} }), Ao = (e) => encodeURIComponent(e).replace(/[!'()*]/g, jo), jo = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function Mo(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = Ao(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${Ao(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${Ao(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/service-error-classification/constants.js
var No = [
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
], Po = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], Fo = [
	500,
	502,
	503,
	504
], Io = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], Lo = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], Ro = (e) => e?.$retryable !== void 0, zo = (e) => e.$metadata?.clockSkewCorrected, Bo = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, Vo = (e) => e.$metadata?.httpStatusCode === 429 || No.includes(e.name) || e.$retryable?.throttling == 1, Ho = (e, t = 0) => e?.name !== "AbortError" && (Ro(e) || zo(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || Po.includes(e.name) || Io.includes(e?.code || "") || Lo.includes(e?.code || "") || Fo.includes(e.$metadata?.httpStatusCode || 0) || Bo(e) || Wo(e) || e.cause !== void 0 && t <= 10 && Ho(e.cause, t + 1)), Uo = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !Ho(e);
	}
	return !1;
};
function Wo(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var Go = 2e4, Ko = "amz-sdk-invocation-id", qo = "amz-sdk-request";
S(), ae(), O();
function Jo(e, t) {
	if (ie.isInstance(e)) for (let n in e.headers) {
		if (!y(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (qt(r).getTime() - Date.now()) / 1e3;
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
var Yo = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
re(), O();
function Xo(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (Qo(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = b.isInstance(d);
			for (f && (d.headers[Ko] = qi());;) try {
				f && (d.headers[qo] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = $o(n, t.logger);
				if (c = Yo(n), f && e(d)) throw (r.logger instanceof st ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await Zo(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var Zo = (e) => new Promise((t) => setTimeout(t, e)), Qo = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, $o = (e, t) => {
	let n = {
		error: e,
		errorType: es(e)
	}, r = Jo(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, es = (e) => Vo(e) ? "THROTTLING" : Ho(e) ? "TRANSIENT" : Uo(e) ? "SERVER_ERROR" : "CLIENT_ERROR", ts = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function ns(e) {
	let t = Xo(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), ts);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var rs = class e {
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
		if (n?.errorType === "THROTTLING" || Vo(n?.error ?? e)) {
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
}, A = class e {
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
}, is = class {
	x = A.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, Go);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, as = class {
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
		return Math.min(Go, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, os;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(os ||= {});
var ss = os.STANDARD, cs = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, ls = class {
	mode = os.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= A.delay(), this.retryBackoffStrategy ??= new is();
	}
	async acquireInitialRetryToken(e) {
		return new as(A.delay(), 0, void 0, A.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? A.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new as(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = A.v2026 && r === cs.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : cs.incompatible, a = r < n ? 0 : cs.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : cs.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === A.modifiedCostType() ? A.throttlingCost() : A.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, us = class {
	mode = os.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new rs(), this.standardRetryStrategy = t ? new ls({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new ls(e);
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
de();
var ds = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = A.delay() } = t ?? {}, o = x(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await x(r)() === os.ADAPTIVE ? new us(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new ls({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, fs = ns(i);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
A.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function ps(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
re();
function ms(e) {
	return e;
}
var hs = (e) => (t) => async (n) => {
	if (!b.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, gs = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, _s = (e) => ({ applyToStack: (t) => {
	t.add(hs(e), gs);
} }), vs = () => (e, t) => async (n) => {
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
}, ys = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, bs = (e) => ({ applyToStack: (e) => {
	e.add(vs(), ys);
} }), xs = (e) => ({ applyToStack: (e) => {} }), Ss = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
S();
function Cs(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var ws = (e, t) => (n, r) => async (i) => {
	let a = Ss(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = Cs(e.httpAuthSchemes), s = v(r), c = [];
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
}, Ts = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, Es = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(ws(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), Ts);
} });
re(), S();
var Ds = (e) => (e) => {
	throw e;
}, Os = (e, t) => {}, ks = (e) => (e, t) => async (n) => {
	if (!b.isInstance(n.request)) return e(n);
	let r = v(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Ds)(i));
	return (o.successHandler || Os)(s.response, i), s;
}, As = {
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
}, js = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(ks(e), As);
} }), Ms = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
S();
var Ns = class {
	authSchemes = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t in e) {
			if (!y(e, t)) continue;
			let n = e[t];
			n !== void 0 && this.authSchemes.set(t, n);
		}
	}
	getIdentityProvider(e) {
		return this.authSchemes.get(e);
	}
}, Ps = ((e) => function(t) {
	return Fs(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), Fs = (e) => e.expiration !== void 0, Is = (e, t, n) => {
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
function Ls(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Rs(e) {
	let t = Ms(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!Ls(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var zs = {
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
}, Bs = "", Vs = (e) => {
	let { partitions: t } = zs;
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
}, Hs = () => Bs, Us = /\d{12}\.ddb/;
async function Ws(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && ps(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case os.ADAPTIVE:
				ps(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case os.STANDARD: ps(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(Us) && ps(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				ps(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				ps(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": ps(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && ps(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) ps(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Gs = "user-agent", Ks = "x-amz-user-agent", qs = /[^!$%&'*+\-.^_`|~\w]/g, Js = /[^!$%&'*+\-.^_`|~\w#]/g, Ys = 1024;
function Xs(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= Ys) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
re();
var Zs = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!b.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(Qs) || [], s = (await e.defaultUserAgentProvider()).map(Qs);
	await Ws(n, e, r);
	let c = n;
	s.push(`m/${Xs(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(Qs) || [], u = await e.userAgentAppId();
	u && s.push(Qs(["app", `${u}`]));
	let d = Hs(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Ks] = f : (p && (a[Ks] = a["x-amz-user-agent"] ? `${a[Gs]} ${p}` : p), a[Gs] = f), t({
		...r,
		request: i
	});
}, Qs = (e) => {
	let t = e[0].split("/").map((e) => e.replace(qs, "-")).join("/"), n = e[1]?.replace(Js, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, $s = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, ec = (e) => ({ applyToStack: (t) => {
	t.add(Zs(e), $s);
} }), tc = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? nc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? nc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, nc = {
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
ji(), Kr();
var rc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!rc(t)) return !1;
		return !0;
	}
	return !(!se(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || Gr(e));
}, ic = ":", ac = "/", oc = (e) => {
	let t = e.split(ic);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(ic) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(ac)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
ji();
var sc = {
	isVirtualHostableS3Bucket: rc,
	parseArn: oc,
	partition: Vs
};
Or.aws = sc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var cc = (e, t, n) => {
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
S();
var lc = /* @__PURE__ */ new Set(), uc = (e, t = se) => {
	if (!lc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else lc.add(e);
}, dc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), fc = (e) => dc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, pc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = fc(typeof t == "function" ? await t() : t);
			return uc(e), e;
		},
		useFipsEndpoint: async () => dc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, mc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], hc = ({ defaultsMode: e } = {}) => cc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(gc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${mc.join(", ")}, got ${t}`);
	}
}), gc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, _c = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), vc = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ae();
var yc = (e) => ie.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, bc = (e) => ie.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, xc = (e) => new Date(Date.now() + e), Sc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
re(), _();
var Cc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, wc = (e) => e.context?.[h]?.eventStream?.output === !0, Tc = async (e) => {
	let t = Cc("context", e.context), n = Cc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await Cc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, Ec = class {
	async sign(e, t, n) {
		if (!b.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await Tc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || wc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : xc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? yc(n.$response);
				if (t) {
					let r = Cc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = bc(n.$response), s = Sc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = yc(e);
		if (n) {
			let r = Cc("config", t.config), i = t._requestSentAt, a = bc(e);
			r.systemClockOffset = Sc(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
O();
var Dc = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!y(e, n)) continue;
			let r = ht(n);
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
				let o = ht(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(Ac.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!kc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Nn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, Oc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(Oc ||= {});
var kc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Ac = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && jc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && jc(e), parseInt(E(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function jc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var Mc = "X-Amz-Algorithm", Nc = "X-Amz-Credential", Pc = "X-Amz-Date", Fc = "X-Amz-SignedHeaders", Ic = "X-Amz-Expires", Lc = "X-Amz-Signature", Rc = "X-Amz-Security-Token", zc = "authorization", Bc = Pc.toLowerCase(), Vc = [
	zc,
	Bc,
	"date"
];
Lc.toLowerCase();
var Hc = "x-amz-content-sha256", Uc = Rc.toLowerCase(), Wc = {
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
}, Gc = /^proxy-/, Kc = /^sec-/, qc = "AWS4-HMAC-SHA256", Jc = "AWS4-HMAC-SHA256-PAYLOAD", Yc = "UNSIGNED-PAYLOAD", Xc = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
O();
var Zc = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!y(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = Ao(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${Ao(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${Ao(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, Qc = (e) => $c(e).toISOString().replace(/\.\d{3}Z$/, "Z"), $c = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
de(), O();
var el = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = x(n), this.credentialProvider = x(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${Zc(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(Bn(n)), `${r}
${e}
${t}
${E(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return Ao(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = Qc(e).replace(/[-:]/g, "");
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
O();
var tl = {}, nl = [], rl = (e, t, n) => `${e}/${t}/${n}/${Xc}`, il = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${E(await al(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in tl) return tl[a];
	for (nl.push(a); nl.length > 50;) delete tl[nl.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Xc
	]) o = await al(e, o, t);
	return tl[a] = o;
}, al = (e, t, n) => {
	let r = new e(t);
	return r.update(Bn(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
O();
var ol = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(y(Wc, a) || t?.has(a) || Gc.test(a) || Kc.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Ui(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
O();
var sl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (y(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Wn(t)) {
		let e = new n();
		return e.update(Bn(t)), E(await e.digest());
	}
	return Yc;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
O();
var cl = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (y(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
O(), re();
var ll = (e, t = {}) => {
	let { headers: n, query: r = {} } = b.clone(e);
	for (let e in n) {
		if (!y(n, e)) continue;
		let i = e.toLowerCase();
		(i.slice(0, 6) === "x-amz-" && !t.unhoistableHeaders?.has(i) || t.hoistableHeaders?.has(i)) && (r[e] = n[e], delete n[e]);
	}
	return {
		...e,
		headers: n,
		query: r
	};
};
O(), re();
var ul = (e) => {
	e = b.clone(e);
	for (let t in e.headers) y(e.headers, t) && Vc.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
O();
var dl = class extends el {
	headerFormatter = new Dc();
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
		let m = rl(p, d, l ?? this.service), h = ll(ul(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[Rc] = u.sessionToken), h.query[Mc] = qc, h.query[Nc] = `${u.accessKeyId}/${m}`, h.query[Pc] = f, h.query[Ic] = r.toString(10);
		let g = ol(h, i, o);
		return h.query[Fc] = this.getCanonicalHeaderList(g), h.query[Lc] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await sl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = rl(c, s, a ?? this.service), d = await sl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Jc,
			l,
			u,
			r,
			E(await f.digest()),
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
		return c.update(Bn(e)), E(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = ul(e), { longDate: l, shortDate: u } = this.formatDate(t), d = rl(u, s, a ?? this.service);
		c.headers[Bc] = l, o.sessionToken && (c.headers[Uc] = o.sessionToken);
		let f = await sl(c, this.sha256);
		!cl("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[Hc] = f);
		let p = ol(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[zc] = `${qc} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, qc), a = new this.sha256(await n);
		return a.update(Bn(i)), E(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return il(this.sha256, e, n, t, r || this.service);
	}
}, fl = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = ml(t, pl(t, {
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
	return l = t.signer ? Ms(t.signer) : t.regionInfoProvider ? () => Ms(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || dl)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await Ms(t.region)(),
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
		return new (t.signerConstructor || dl)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: Ms(t.disableClockSkewCorrection ?? e)
	});
};
function pl(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Is(t, Ps, Fs) : n ? Ms(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function ml(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var hl = fl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/auth/httpAuthSchemeProvider.js
ee(), de();
var gl = async (e, t, n) => ({
	operation: v(t).operation,
	region: await x(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function _l(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "cloudfront",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var vl = (e) => {
	let t = [];
	return e.operation, t.push(_l(e)), t;
}, yl = (e) => {
	let t = hl(e);
	return Object.assign(t, { authSchemePreference: x(e.authSchemePreference ?? []) });
}, bl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "cloudfront"
}), xl = {
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
}, Sl = {
	name: "@aws-sdk/client-cloudfront",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Cloudfront Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cloudfront",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-cloudfront"
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
function Cl(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function wl(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ae();
var Tl = { supported: void 0 }, El = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), Tl.supported === void 0 && (Tl.supported = typeof Request < "u" && "keepalive" in Cl("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = Dl(t);
			return Promise.reject(e);
		}
		let s = e.path, c = Mo(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), Tl.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(Cl(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new ie({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new ie({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), wl(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(Dl(t));
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
function Dl(e) {
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
w();
var Ol = class {
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
		let i = Ue.for(r), a = Ue.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = Ze(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return Ze(e, t);
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
			return e.find((e) => C.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
}, kl = /[&<>"]/g, Al = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function jl(e) {
	return e.replace(kl, (e) => Al[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/escape-element.js
var Ml = /[&"'<>\r\n\u0085\u2028]/g, Nl = {
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
function Pl(e) {
	return e.replace(Ml, (e) => Nl[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/XmlText.js
var Fl = class {
	value;
	constructor(e) {
		this.value = e;
	}
	toString() {
		return Pl("" + this.value);
	}
}, j = class e {
	name;
	children;
	attributes = {};
	static of(t, n, r) {
		let i = new e(t);
		return n !== void 0 && i.addChildNode(new Fl(n)), r !== void 0 && i.withName(r), i;
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
			r != null && (t += ` ${e}="${jl("" + r)}"`);
		}
		return t += e ? `>${this.children.map((e) => e.toString()).join("")}</${this.name}>` : "/>";
	}
}, Il;
function Ll(e) {
	Il ||= new DOMParser();
	let t = Il.parseFromString(e, "application/xml");
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
var Rl = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, zl = class {
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
function Bl(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
w(), O();
var Vl = class extends Rl {
	settings;
	stringDeserializer;
	constructor(e) {
		super(), this.settings = e, this.stringDeserializer = new bo(e);
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.stringDeserializer.setSerdeContext(e);
	}
	read(e, t, n) {
		let r = C.of(e), i = r.getMemberSchemas();
		if (r.isStructSchema() && r.isMemberSchema() && Object.values(i).find((e) => !!e.getMemberTraits().eventPayload)) {
			let e = {}, n = Object.keys(i)[0];
			return e[n] = i[n].isBlobSchema() ? t : this.read(i[n], t), e;
		}
		let a = (this.serdeContext?.utf8Encoder ?? xt)(t), o = this.parseXml(a);
		return this.readSchema(e, n ? o[n] : o);
	}
	readSchema(e, t) {
		let n = C.of(e);
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
					t === "__proto__" && Bl(i), i[t] = this.readSchema(a, n);
				}
				return i;
			}
			if (n.isStructSchema()) {
				let e = n.isUnionSchema(), r;
				e && (r = new zl(t, i));
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
				t = Ll(e);
			} catch (t) {
				throw t && typeof t == "object" && Object.defineProperty(t, "$responseBodyText", { value: e }), t;
			}
			let n = "#text", r = Object.keys(t)[0], i = t[r];
			return i[n] && (i[r] = i[n], delete i[n]), ot(i);
		}
		return {};
	}
}, Hl = (e, t) => {
	if (t?.Error?.Code !== void 0) return t.Error.Code;
	if (t?.Code !== void 0) return t.Code;
	if (e.statusCode == 404) return "NotFound";
};
w(), O();
var Ul = class extends Rl {
	settings;
	stringBuffer;
	byteBuffer;
	buffer;
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = C.of(e);
		if (n.isStringSchema() && typeof t == "string") this.stringBuffer = t;
		else if (n.isBlobSchema()) this.byteBuffer = "byteLength" in t ? t : (this.serdeContext?.base64Decoder ?? pt)(t);
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
		let a = j.of(i), [o, s] = this.getXmlnsAttribute(e, n);
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
					let t = j.of(r.getMergedTraits().xmlName ?? r.getMemberName());
					this.writeSimpleInto(r, e, t, s), a.addChildNode(t);
				}
			}
		}
		let { $unknown: c } = t;
		if (c && e.isUnionSchema() && Array.isArray(c) && Object.keys(t).length === 1) {
			let [e, n] = c, r = j.of(e);
			if (typeof n != "string") {
				if (t instanceof j || t instanceof Fl) a.addChildNode(t);
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
				let r = j.of(c ? i.xmlName ?? e.getMemberName() : o.xmlName ?? "member");
				this.writeSimpleInto(a, n, r, u), t.addChildNode(r);
			}
		};
		if (c) for (let e of t) (s || e != null) && d(n, e);
		else {
			let r = j.of(i.xmlName ?? e.getMemberName());
			u && r.addAttribute(l, u);
			for (let e of t) (s || e != null) && d(r, e);
			n.addChildNode(r);
		}
	}
	writeMap(e, t, n, r, i = !1) {
		if (!e.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${e.getName(!0)}`);
		let a = e.getMergedTraits(), o = e.getKeySchema(), s = o.getMergedTraits().xmlName ?? "key", c = e.getValueSchema(), l = c.getMergedTraits(), u = l.xmlName ?? "value", d = !!l.sparse, f = !!a.xmlFlattened, [p, m] = this.getXmlnsAttribute(e, r), h = (e, t, n) => {
			let r = j.of(s, t), [i, a] = this.getXmlnsAttribute(o, m);
			a && r.addAttribute(i, a), e.addChildNode(r);
			let l = j.of(u);
			c.isListSchema() ? this.writeList(c, n, l, m) : c.isMapSchema() ? this.writeMap(c, n, l, m, !0) : c.isStructSchema() ? l = this.writeStruct(c, n, m) : this.writeSimpleInto(c, n, l, m), e.addChildNode(l);
		};
		if (f) for (let r in t) {
			let i = t[r];
			if (d || i != null) {
				let t = j.of(a.xmlName ?? e.getMemberName());
				h(t, r, i), n.addChildNode(t);
			}
		}
		else {
			let r;
			i || (r = j.of(a.xmlName ?? e.getMemberName()), m && r.addAttribute(p, m), n.addChildNode(r));
			for (let e in t) {
				let a = t[e];
				if (d || a != null) {
					let t = j.of("entry");
					h(t, e, a), (i ? n : r).addChildNode(t);
				}
			}
		}
	}
	writeSimple(e, t) {
		if (t === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
		let n = C.of(e), r = null;
		if (t && typeof t == "object") {
			if (n.isBlobSchema()) r = (this.serdeContext?.base64Encoder ?? _t)(t);
			else if (n.isTimestampSchema() && t instanceof Date) switch (yo(n, this.settings)) {
				case 5:
					r = t.toISOString().replace(".000Z", "Z");
					break;
				case 6:
					r = Vt(t);
					break;
				case 7:
					r = String(t.getTime() / 1e3);
					break;
				default: console.warn("Missing timestamp format, using http date", t), r = Vt(t);
			}
			else if (n.isBigDecimalSchema() && t) return t instanceof jn ? t.string : String(t);
			else if (n.isMapSchema() || n.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
			else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${n.getName(!0)}`);
		}
		if ((n.isBooleanSchema() || n.isNumericSchema() || n.isBigIntegerSchema() || n.isBigDecimalSchema()) && (r = String(t)), n.isStringSchema() && (r = t === void 0 && n.isIdempotencyToken() ? Ji() : String(t)), r === null) throw Error(`Unhandled schema-value pair ${n.getName(!0)}=${t}`);
		return r;
	}
	writeSimpleInto(e, t, n, r) {
		let i = this.writeSimple(e, t), a = C.of(e), o = new Fl(i), [s, c] = this.getXmlnsAttribute(a, r);
		c && n.addAttribute(s, c), n.addChildNode(o);
	}
	getXmlnsAttribute(e, t) {
		let [n, r] = e.getMergedTraits().xmlNamespace ?? [];
		return r && r !== t ? [n ? `xmlns:${n}` : "xmlns", r] : [void 0, void 0];
	}
}, Wl = class extends Rl {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new Ul(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Vl(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/AwsRestXmlProtocol.js
w();
var Gl = class extends vo {
	codec;
	serializer;
	deserializer;
	mixin = new Ol();
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
		this.codec = new Wl(t), this.serializer = new Co(this.codec.createSerializer(), t), this.deserializer = new xo(this.codec.createDeserializer(), t);
	}
	getPayloadCodec() {
		return this.codec;
	}
	getShapeId() {
		return "aws.protocols#restXml";
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = C.of(e.input);
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
		let a = Hl(n, r) ?? "Unknown";
		if (this.mixin.compose(this.compositeErrorRegistry, a, this.options.defaultNamespace), r.Error && typeof r.Error == "object") for (let e of Object.keys(r.Error)) r[e] = r.Error[e], e.toLowerCase() === "message" && (r.message = r.Error[e]);
		r.RequestId && !i.requestId && (i.requestId = r.RequestId);
		let { errorSchema: o, errorMetadata: s } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, r, i), c = C.of(o), l = r.Error?.message ?? r.Error?.Message ?? r.message ?? r.Message ?? "UnknownError", u = new ((this.compositeErrorRegistry.getErrorCtor(o)) ?? Error)({});
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
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/endpoint/bdd.js
ji();
var Kl = "ref", ql = "authSchemes", Jl = "name", Yl = "signingRegion", Xl = -1, Zl = !0, Ql = "isSet", $l = "PartitionResult", eu = "booleanEquals", tu = "stringEquals", nu = "getAttr", ru = { [Kl]: "Endpoint" }, iu = {
	fn: nu,
	argv: [{ [Kl]: $l }, "name"]
}, au = { [Kl]: $l }, ou = { [ql]: [{
	[Jl]: "sigv4",
	[Yl]: "us-east-1"
}] }, su = { [ql]: [{
	[Jl]: "sigv4",
	[Yl]: "cn-northwest-1"
}] }, cu = { [ql]: [{
	[Jl]: "sigv4",
	[Yl]: "{PartitionResult#implicitGlobalRegion}"
}] }, lu = [{ [Kl]: "Region" }], uu = {
	conditions: [
		[Ql, [ru]],
		[Ql, lu],
		[
			"aws.partition",
			lu,
			$l
		],
		[eu, [{ [Kl]: "UseFIPS" }, Zl]],
		[eu, [{ [Kl]: "UseDualStack" }, Zl]],
		[tu, [iu, "aws"]],
		[tu, [iu, "aws-cn"]],
		[eu, [{
			fn: nu,
			argv: [au, "supportsDualStack"]
		}, Zl]],
		[eu, [{
			fn: nu,
			argv: [au, "supportsFIPS"]
		}, Zl]]
	],
	results: [
		[Xl],
		[Xl, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Xl, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[ru, {}],
		["https://cloudfront.global.api.aws", ou],
		["https://cloudfront-fips.global.api.aws", ou],
		["https://cloudfront.cn-northwest-1.amazonaws.com.cn", su],
		["https://cloudfront-fips.cn-northwest-1.amazonaws.com.cn", su],
		["https://cloudfront-fips.{PartitionResult#dualStackDnsSuffix}", cu],
		[Xl, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://cloudfront-fips.{PartitionResult#dnsSuffix}", cu],
		[Xl, "FIPS is enabled but this partition does not support FIPS"],
		["https://cloudfront.{PartitionResult#dualStackDnsSuffix}", cu],
		[Xl, "DualStack is enabled but this partition does not support DualStack"],
		["https://cloudfront.{PartitionResult#dnsSuffix}", cu],
		[Xl, "Invalid Configuration: Missing Region"]
	]
}, du = 2, fu = new Int32Array([
	-1,
	1,
	-1,
	0,
	16,
	3,
	1,
	4,
	100000015,
	2,
	5,
	100000015,
	3,
	10,
	6,
	4,
	8,
	7,
	6,
	100000006,
	100000014,
	5,
	100000004,
	9,
	7,
	100000012,
	100000013,
	4,
	13,
	11,
	6,
	100000007,
	12,
	8,
	100000010,
	100000011,
	5,
	100000005,
	14,
	7,
	15,
	100000009,
	8,
	100000008,
	100000009,
	3,
	100000001,
	17,
	4,
	100000002,
	100000003
]), pu = _r.from(fu, du, uu.conditions, uu.results);
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/endpoint/endpointResolver.js
ji();
var mu = new yr({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), hu = (e, t = {}) => mu.get(e, () => Di(pu, {
	endpointParams: e,
	logger: t.logger
}));
Or.aws = sc;
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/models/CloudFrontServiceException.js
var M = class e extends Xe {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.cloudfront#CloudFrontServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, gu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#AccessDenied";
	name = "AccessDenied";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "AccessDenied",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, _u = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#IllegalUpdate";
	name = "IllegalUpdate";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IllegalUpdate",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, vu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidArgument";
	name = "InvalidArgument";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidArgument",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, yu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchDistribution";
	name = "NoSuchDistribution";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchDistribution",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, bu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionCNAMEs";
	name = "TooManyDistributionCNAMEs";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionCNAMEs",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, xu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#EntityLimitExceeded";
	name = "EntityLimitExceeded";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "EntityLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Su = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#EntityNotFound";
	name = "EntityNotFound";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "EntityNotFound",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Cu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidIfMatchVersion";
	name = "InvalidIfMatchVersion";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidIfMatchVersion",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, wu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#PreconditionFailed";
	name = "PreconditionFailed";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PreconditionFailed",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Tu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#BatchTooLarge";
	name = "BatchTooLarge";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "BatchTooLarge",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Eu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CachePolicyAlreadyExists";
	name = "CachePolicyAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CachePolicyAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Du = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CachePolicyInUse";
	name = "CachePolicyInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CachePolicyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ou = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CannotChangeImmutablePublicKeyFields";
	name = "CannotChangeImmutablePublicKeyFields";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CannotChangeImmutablePublicKeyFields",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ku = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CannotDeleteEntityWhileInUse";
	name = "CannotDeleteEntityWhileInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CannotDeleteEntityWhileInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Au = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CannotUpdateEntityWhileInUse";
	name = "CannotUpdateEntityWhileInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CannotUpdateEntityWhileInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ju = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CNAMEAlreadyExists";
	name = "CNAMEAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CNAMEAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Mu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#DistributionAlreadyExists";
	name = "DistributionAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DistributionAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Nu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior";
	name = "IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Pu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InconsistentQuantities";
	name = "InconsistentQuantities";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InconsistentQuantities",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Fu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidDefaultRootObject";
	name = "InvalidDefaultRootObject";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidDefaultRootObject",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Iu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidErrorCode";
	name = "InvalidErrorCode";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidErrorCode",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Lu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidForwardCookies";
	name = "InvalidForwardCookies";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidForwardCookies",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ru = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidFunctionAssociation";
	name = "InvalidFunctionAssociation";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidFunctionAssociation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, zu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidGeoRestrictionParameter";
	name = "InvalidGeoRestrictionParameter";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidGeoRestrictionParameter",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Bu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidHeadersForS3Origin";
	name = "InvalidHeadersForS3Origin";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidHeadersForS3Origin",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Vu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidLambdaFunctionAssociation";
	name = "InvalidLambdaFunctionAssociation";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidLambdaFunctionAssociation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Hu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidLocationCode";
	name = "InvalidLocationCode";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidLocationCode",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Uu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidMinimumProtocolVersion";
	name = "InvalidMinimumProtocolVersion";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidMinimumProtocolVersion",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Wu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidOrigin";
	name = "InvalidOrigin";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidOrigin",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Gu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidOriginAccessControl";
	name = "InvalidOriginAccessControl";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidOriginAccessControl",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ku = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidOriginAccessIdentity";
	name = "InvalidOriginAccessIdentity";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidOriginAccessIdentity",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, qu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidOriginKeepaliveTimeout";
	name = "InvalidOriginKeepaliveTimeout";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidOriginKeepaliveTimeout",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ju = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidOriginReadTimeout";
	name = "InvalidOriginReadTimeout";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidOriginReadTimeout",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Yu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidProtocolSettings";
	name = "InvalidProtocolSettings";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidProtocolSettings",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Xu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidQueryStringParameters";
	name = "InvalidQueryStringParameters";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidQueryStringParameters",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Zu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidRelativePath";
	name = "InvalidRelativePath";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidRelativePath",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Qu = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidRequiredProtocol";
	name = "InvalidRequiredProtocol";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidRequiredProtocol",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, $u = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidResponseCode";
	name = "InvalidResponseCode";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidResponseCode",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ed = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidTTLOrder";
	name = "InvalidTTLOrder";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidTTLOrder",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, td = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidViewerCertificate";
	name = "InvalidViewerCertificate";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidViewerCertificate",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, nd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidWebACLId";
	name = "InvalidWebACLId";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidWebACLId",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, rd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#MissingBody";
	name = "MissingBody";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "MissingBody",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, id = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchCachePolicy";
	name = "NoSuchCachePolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchCachePolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ad = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchFieldLevelEncryptionConfig";
	name = "NoSuchFieldLevelEncryptionConfig";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchFieldLevelEncryptionConfig",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, od = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchOrigin";
	name = "NoSuchOrigin";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchOrigin",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, sd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchOriginRequestPolicy";
	name = "NoSuchOriginRequestPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchOriginRequestPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, cd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchRealtimeLogConfig";
	name = "NoSuchRealtimeLogConfig";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchRealtimeLogConfig",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ld = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchResponseHeadersPolicy";
	name = "NoSuchResponseHeadersPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchResponseHeadersPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ud = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#RealtimeLogConfigOwnerMismatch";
	name = "RealtimeLogConfigOwnerMismatch";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RealtimeLogConfigOwnerMismatch",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, dd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCacheBehaviors";
	name = "TooManyCacheBehaviors";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCacheBehaviors",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, fd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCertificates";
	name = "TooManyCertificates";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCertificates",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, pd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCookieNamesInWhiteList";
	name = "TooManyCookieNamesInWhiteList";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCookieNamesInWhiteList",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, md = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributions";
	name = "TooManyDistributions";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributions",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, hd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToCachePolicy";
	name = "TooManyDistributionsAssociatedToCachePolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToCachePolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, gd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToFieldLevelEncryptionConfig";
	name = "TooManyDistributionsAssociatedToFieldLevelEncryptionConfig";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToFieldLevelEncryptionConfig",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, _d = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToKeyGroup";
	name = "TooManyDistributionsAssociatedToKeyGroup";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToKeyGroup",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, vd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToOriginAccessControl";
	name = "TooManyDistributionsAssociatedToOriginAccessControl";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToOriginAccessControl",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, yd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToOriginRequestPolicy";
	name = "TooManyDistributionsAssociatedToOriginRequestPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToOriginRequestPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, bd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsAssociatedToResponseHeadersPolicy";
	name = "TooManyDistributionsAssociatedToResponseHeadersPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsAssociatedToResponseHeadersPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, xd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsWithFunctionAssociations";
	name = "TooManyDistributionsWithFunctionAssociations";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsWithFunctionAssociations",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Sd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsWithLambdaAssociations";
	name = "TooManyDistributionsWithLambdaAssociations";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsWithLambdaAssociations",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Cd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyDistributionsWithSingleFunctionARN";
	name = "TooManyDistributionsWithSingleFunctionARN";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyDistributionsWithSingleFunctionARN",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, wd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFunctionAssociations";
	name = "TooManyFunctionAssociations";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFunctionAssociations",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Td = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyHeadersInForwardedValues";
	name = "TooManyHeadersInForwardedValues";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyHeadersInForwardedValues",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ed = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyKeyGroupsAssociatedToDistribution";
	name = "TooManyKeyGroupsAssociatedToDistribution";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyKeyGroupsAssociatedToDistribution",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Dd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyLambdaFunctionAssociations";
	name = "TooManyLambdaFunctionAssociations";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyLambdaFunctionAssociations",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Od = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyOriginCustomHeaders";
	name = "TooManyOriginCustomHeaders";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyOriginCustomHeaders",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, kd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyOriginGroupsPerDistribution";
	name = "TooManyOriginGroupsPerDistribution";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyOriginGroupsPerDistribution",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ad = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyOrigins";
	name = "TooManyOrigins";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyOrigins",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, jd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyQueryStringParameters";
	name = "TooManyQueryStringParameters";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyQueryStringParameters",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Md = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyTrustedSigners";
	name = "TooManyTrustedSigners";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyTrustedSigners",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Nd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TrustedKeyGroupDoesNotExist";
	name = "TrustedKeyGroupDoesNotExist";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustedKeyGroupDoesNotExist",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Pd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TrustedSignerDoesNotExist";
	name = "TrustedSignerDoesNotExist";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TrustedSignerDoesNotExist",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Fd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#EntityAlreadyExists";
	name = "EntityAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "EntityAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Id = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidTagging";
	name = "InvalidTagging";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidTagging",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ld = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#UnsupportedOperation";
	name = "UnsupportedOperation";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "UnsupportedOperation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Rd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCachePolicies";
	name = "TooManyCachePolicies";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCachePolicies",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, zd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCookiesInCachePolicy";
	name = "TooManyCookiesInCachePolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCookiesInCachePolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Bd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyHeadersInCachePolicy";
	name = "TooManyHeadersInCachePolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyHeadersInCachePolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Vd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyQueryStringsInCachePolicy";
	name = "TooManyQueryStringsInCachePolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyQueryStringsInCachePolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Hd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CloudFrontOriginAccessIdentityAlreadyExists";
	name = "CloudFrontOriginAccessIdentityAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CloudFrontOriginAccessIdentityAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ud = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCloudFrontOriginAccessIdentities";
	name = "TooManyCloudFrontOriginAccessIdentities";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCloudFrontOriginAccessIdentities",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Wd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#EntitySizeLimitExceeded";
	name = "EntitySizeLimitExceeded";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "EntitySizeLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Gd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ContinuousDeploymentPolicyAlreadyExists";
	name = "ContinuousDeploymentPolicyAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ContinuousDeploymentPolicyAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Kd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#StagingDistributionInUse";
	name = "StagingDistributionInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "StagingDistributionInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, qd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyContinuousDeploymentPolicies";
	name = "TooManyContinuousDeploymentPolicies";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyContinuousDeploymentPolicies",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Jd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ContinuousDeploymentPolicyInUse";
	name = "ContinuousDeploymentPolicyInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ContinuousDeploymentPolicyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Yd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#IllegalOriginAccessConfiguration";
	name = "IllegalOriginAccessConfiguration";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IllegalOriginAccessConfiguration",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Xd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidDomainNameForOriginAccessControl";
	name = "InvalidDomainNameForOriginAccessControl";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidDomainNameForOriginAccessControl",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Zd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchContinuousDeploymentPolicy";
	name = "NoSuchContinuousDeploymentPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchContinuousDeploymentPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Qd = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#InvalidAssociation";
	name = "InvalidAssociation";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidAssociation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, $d = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FieldLevelEncryptionConfigAlreadyExists";
	name = "FieldLevelEncryptionConfigAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FieldLevelEncryptionConfigAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ef = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchFieldLevelEncryptionProfile";
	name = "NoSuchFieldLevelEncryptionProfile";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchFieldLevelEncryptionProfile",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, tf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#QueryArgProfileEmpty";
	name = "QueryArgProfileEmpty";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "QueryArgProfileEmpty",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, nf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionConfigs";
	name = "TooManyFieldLevelEncryptionConfigs";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionConfigs",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, rf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionContentTypeProfiles";
	name = "TooManyFieldLevelEncryptionContentTypeProfiles";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionContentTypeProfiles",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, af = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionQueryArgProfiles";
	name = "TooManyFieldLevelEncryptionQueryArgProfiles";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionQueryArgProfiles",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, of = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FieldLevelEncryptionProfileAlreadyExists";
	name = "FieldLevelEncryptionProfileAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FieldLevelEncryptionProfileAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, sf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FieldLevelEncryptionProfileSizeExceeded";
	name = "FieldLevelEncryptionProfileSizeExceeded";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FieldLevelEncryptionProfileSizeExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, cf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchPublicKey";
	name = "NoSuchPublicKey";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchPublicKey",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, lf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionEncryptionEntities";
	name = "TooManyFieldLevelEncryptionEncryptionEntities";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionEncryptionEntities",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, uf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionFieldPatterns";
	name = "TooManyFieldLevelEncryptionFieldPatterns";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionFieldPatterns",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, df = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFieldLevelEncryptionProfiles";
	name = "TooManyFieldLevelEncryptionProfiles";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFieldLevelEncryptionProfiles",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ff = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FunctionAlreadyExists";
	name = "FunctionAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FunctionAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, pf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FunctionSizeLimitExceeded";
	name = "FunctionSizeLimitExceeded";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FunctionSizeLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, mf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyFunctions";
	name = "TooManyFunctions";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyFunctions",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, hf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyInvalidationsInProgress";
	name = "TooManyInvalidationsInProgress";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyInvalidationsInProgress",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, gf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#KeyGroupAlreadyExists";
	name = "KeyGroupAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "KeyGroupAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, _f = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyKeyGroups";
	name = "TooManyKeyGroups";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyKeyGroups",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, vf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyPublicKeysInKeyGroup";
	name = "TooManyPublicKeysInKeyGroup";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyPublicKeysInKeyGroup",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, yf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#MonitoringSubscriptionAlreadyExists";
	name = "MonitoringSubscriptionAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "MonitoringSubscriptionAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, bf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#OriginAccessControlAlreadyExists";
	name = "OriginAccessControlAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "OriginAccessControlAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, xf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyOriginAccessControls";
	name = "TooManyOriginAccessControls";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyOriginAccessControls",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Sf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#OriginRequestPolicyAlreadyExists";
	name = "OriginRequestPolicyAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "OriginRequestPolicyAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Cf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCookiesInOriginRequestPolicy";
	name = "TooManyCookiesInOriginRequestPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCookiesInOriginRequestPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, wf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyHeadersInOriginRequestPolicy";
	name = "TooManyHeadersInOriginRequestPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyHeadersInOriginRequestPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Tf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyOriginRequestPolicies";
	name = "TooManyOriginRequestPolicies";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyOriginRequestPolicies",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ef = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyQueryStringsInOriginRequestPolicy";
	name = "TooManyQueryStringsInOriginRequestPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyQueryStringsInOriginRequestPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Df = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#PublicKeyAlreadyExists";
	name = "PublicKeyAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PublicKeyAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Of = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyPublicKeys";
	name = "TooManyPublicKeys";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyPublicKeys",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, kf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#RealtimeLogConfigAlreadyExists";
	name = "RealtimeLogConfigAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RealtimeLogConfigAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Af = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyRealtimeLogConfigs";
	name = "TooManyRealtimeLogConfigs";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyRealtimeLogConfigs",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, jf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ResponseHeadersPolicyAlreadyExists";
	name = "ResponseHeadersPolicyAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResponseHeadersPolicyAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Mf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooLongCSPInResponseHeadersPolicy";
	name = "TooLongCSPInResponseHeadersPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooLongCSPInResponseHeadersPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Nf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyCustomHeadersInResponseHeadersPolicy";
	name = "TooManyCustomHeadersInResponseHeadersPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyCustomHeadersInResponseHeadersPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Pf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyRemoveHeadersInResponseHeadersPolicy";
	name = "TooManyRemoveHeadersInResponseHeadersPolicy";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyRemoveHeadersInResponseHeadersPolicy",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Ff = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyResponseHeadersPolicies";
	name = "TooManyResponseHeadersPolicies";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyResponseHeadersPolicies",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, If = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#StreamingDistributionAlreadyExists";
	name = "StreamingDistributionAlreadyExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "StreamingDistributionAlreadyExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Lf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyStreamingDistributionCNAMEs";
	name = "TooManyStreamingDistributionCNAMEs";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyStreamingDistributionCNAMEs",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Rf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TooManyStreamingDistributions";
	name = "TooManyStreamingDistributions";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TooManyStreamingDistributions",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, zf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#IllegalDelete";
	name = "IllegalDelete";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IllegalDelete",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Bf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#CloudFrontOriginAccessIdentityInUse";
	name = "CloudFrontOriginAccessIdentityInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "CloudFrontOriginAccessIdentityInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Vf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchCloudFrontOriginAccessIdentity";
	name = "NoSuchCloudFrontOriginAccessIdentity";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchCloudFrontOriginAccessIdentity",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Hf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ResourceNotDisabled";
	name = "ResourceNotDisabled";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceNotDisabled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Uf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#DistributionNotDisabled";
	name = "DistributionNotDisabled";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "DistributionNotDisabled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Wf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ResourceInUse";
	name = "ResourceInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Gf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FieldLevelEncryptionConfigInUse";
	name = "FieldLevelEncryptionConfigInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FieldLevelEncryptionConfigInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Kf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FieldLevelEncryptionProfileInUse";
	name = "FieldLevelEncryptionProfileInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FieldLevelEncryptionProfileInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, qf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#FunctionInUse";
	name = "FunctionInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "FunctionInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Jf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchFunctionExists";
	name = "NoSuchFunctionExists";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchFunctionExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Yf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchResource";
	name = "NoSuchResource";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchResource",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Xf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchMonitoringSubscription";
	name = "NoSuchMonitoringSubscription";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchMonitoringSubscription",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Zf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchOriginAccessControl";
	name = "NoSuchOriginAccessControl";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchOriginAccessControl",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Qf = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#OriginAccessControlInUse";
	name = "OriginAccessControlInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "OriginAccessControlInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, $f = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#OriginRequestPolicyInUse";
	name = "OriginRequestPolicyInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "OriginRequestPolicyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ep = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#PublicKeyInUse";
	name = "PublicKeyInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PublicKeyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, tp = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#RealtimeLogConfigInUse";
	name = "RealtimeLogConfigInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "RealtimeLogConfigInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, np = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#ResponseHeadersPolicyInUse";
	name = "ResponseHeadersPolicyInUse";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResponseHeadersPolicyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, rp = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchStreamingDistribution";
	name = "NoSuchStreamingDistribution";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchStreamingDistribution",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ip = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#StreamingDistributionNotDisabled";
	name = "StreamingDistributionNotDisabled";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "StreamingDistributionNotDisabled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ap = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#NoSuchInvalidation";
	name = "NoSuchInvalidation";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "NoSuchInvalidation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, op = class e extends M {
	static shapeId = "com.amazonaws.cloudfront#TestFunctionFailed";
	name = "TestFunctionFailed";
	$fault = "server";
	Message;
	constructor(t) {
		super({
			name: "TestFunctionFailed",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/schemas/schemas_0.js
w();
var sp = "Aliases", cp = "AwsAccountNumber", lp = "AwsAccountNumberList", up = "ACMCertificateArn", dp = "AccessDenied", fp = "AliasICPRecordal", pp = "AliasICPRecordals", mp = "AnycastIpListId", hp = "AliasList", gp = "AllowedMethods", _p = "ARN", vp = "ActiveTrustedKeyGroups", yp = "ActiveTrustedSigners", bp = "AdvertiseTrustStoreCaNames", xp = "Bucket", Sp = "BatchTooLarge", Cp = "Compress", wp = "ConnectionAttempts", Tp = "CacheBehavior", Ep = "CacheBehaviorList", Dp = "CacheBehaviors", Op = "ClientCertificateArn", kp = "CannotChangeImmutablePublicKeyFields", Ap = "CannotDeleteEntityWhileInUse", jp = "ContinuousDeploymentPolicyAlreadyExists", Mp = "ContinuousDeploymentPolicyId", Np = "ContinuousDeploymentPolicyInUse", Pp = "CreateDistributionRequest", Fp = "CreateDistributionResult", Ip = "CreateDistribution", Lp = "CustomErrorResponse", Rp = "CustomErrorResponseList", zp = "CustomErrorResponses", Bp = "ConnectionFunctionAssociation", Vp = "CloudFrontDefaultCertificate", Hp = "CloudFrontOriginAccessIdentityAlreadyExists", Up = "CloudFrontOriginAccessIdentityInUse", Wp = "CustomHeaders", Gp = "CreateInvalidation", Kp = "CreateInvalidationRequest", qp = "CreateInvalidationResult", Jp = "CachedMethods", Yp = "ConnectionMode", Xp = "CookieNames", Zp = "CNAME", Qp = "CNAMEAlreadyExists", $p = "CookieNameList", em = "CustomOriginConfig", tm = "CachePolicyAlreadyExists", nm = "CachePolicyId", rm = "CachePolicyInUse", im = "CookiePreference", am = "CallerReference", om = "CertificateSource", sm = "CommentType", cm = "CacheTagConfig", lm = "ConnectionTimeout", um = "CreateTime", dm = "CannotUpdateEntityWhileInUse", fm = "Certificate", pm = "Comment", mm = "Cookies", hm = "Distribution", gm = "DistributionAlreadyExists", _m = "DistributionConfig", vm = "DefaultCacheBehavior", ym = "DeleteDistribution", bm = "DeleteDistributionRequest", xm = "DistributionId", Sm = "DistributionList", Cm = "DomainName", wm = "DistributionNotDisabled", Tm = "DefaultRootObject", Em = "DistributionSummary", Dm = "DistributionSummaryList", Om = "DefaultTTL", km = "DefaultValue", Am = "Definition", N = "Enabled", jm = "EntityAlreadyExists", Mm = "ErrorCode", Nm = "ErrorCachingMinTTL", Pm = "EntityLimitExceeded", Fm = "EntityNotFound", Im = "EntitySizeLimitExceeded", Lm = "ETag", Rm = "EventType", zm = "FunctionAssociations", Bm = "FunctionAlreadyExists", Vm = "FunctionAssociationList", Hm = "FunctionARN", Um = "FunctionAssociation", Wm = "FailoverCriteria", Gm = "FunctionInUse", Km = "FieldLevelEncryptionConfigAlreadyExists", qm = "FieldLevelEncryptionConfigInUse", Jm = "FieldLevelEncryptionId", Ym = "FieldLevelEncryptionProfileAlreadyExists", Xm = "FieldLevelEncryptionProfileInUse", Zm = "FieldLevelEncryptionProfileSizeExceeded", Qm = "FunctionSizeLimitExceeded", $m = "ForwardedValues", eh = "Forward", th = "GrpcConfig", nh = "GetDistribution", rh = "GetDistributionConfig", ih = "GetDistributionConfigRequest", ah = "GetDistributionConfigResult", oh = "GetDistributionRequest", sh = "GetDistributionResult", ch = "GeoRestriction", lh = "Headers", uh = "HeaderList", dh = "HeaderName", fh = "HTTPPort", ph = "HTTPSPort", mh = "HttpVersion", hh = "HeaderValue", P = "Items", gh = "InvalidArgument", _h = "IAMCertificateId", vh = "IpAddressType", yh = "InvalidAssociation", bh = "InvalidationBatch", xh = "IncludeBody", Sh = "IgnoreCertificateExpiry", Ch = "ICPRecordalStatus", wh = "IncludeCookies", Th = "IllegalDelete", Eh = "InvalidDomainNameForOriginAccessControl", Dh = "InvalidDefaultRootObject", Oh = "InvalidErrorCode", kh = "InvalidFunctionAssociation", Ah = "InvalidForwardCookies", jh = "IllegalFieldLevelEncryptionConfigAssociationWithCacheBehavior", Mh = "InvalidGeoRestrictionParameter", Nh = "InvalidHeadersForS3Origin", Ph = "InvalidIfMatchVersion", Fh = "IsIPV6Enabled", Ih = "InvalidationList", Lh = "InvalidLocationCode", Rh = "InvalidLambdaFunctionAssociation", zh = "IfMatch", Bh = "InvalidMinimumProtocolVersion", Vh = "If-Match", Hh = "InvalidOrigin", Uh = "IllegalOriginAccessConfiguration", Wh = "InvalidOriginAccessControl", Gh = "InvalidOriginAccessIdentity", Kh = "InvalidOriginKeepaliveTimeout", qh = "InvalidOriginReadTimeout", Jh = "InProgressInvalidationBatches", Yh = "InvalidProtocolSettings", Xh = "InconsistentQuantities", Zh = "InvalidQueryStringParameters", Qh = "InvalidResponseCode", $h = "InvalidRelativePath", eg = "InvalidRequiredProtocol", tg = "InvalidationSummaryList", ng = "InvalidationSummary", rg = "InvalidTagging", ig = "InvalidTTLOrder", ag = "IsTruncated", og = "IllegalUpdate", sg = "InvalidViewerCertificate", cg = "InvalidWebACLId", F = "Id", lg = "Invalidation", ug = "KeyGroup", dg = "KeyGroupAlreadyExists", fg = "KeyGroupId", pg = "KGKeyPairIds", mg = "KGKeyPairIdsList", hg = "KeyPairIds", gg = "KeyPairIdList", _g = "KeyPairId", vg = "Location", yg = "LoggingConfig", bg = "ListDistributions", xg = "ListDistributionsRequest", Sg = "ListDistributionsResult", Cg = "LambdaFunctionAssociations", wg = "LambdaFunctionAssociationList", Tg = "LambdaFunctionARN", Eg = "LambdaFunctionAssociation", Dg = "ListInvalidations", Og = "ListInvalidationsRequest", kg = "ListInvalidationsResult", Ag = "LocationList", jg = "LastModifiedTime", Mg = "Logging", I = "Message", Ng = "MissingBody", Pg = "MaxItems", Fg = "MethodsList", Ig = "MinimumProtocolVersion", Lg = "MonitoringSubscriptionAlreadyExists", Rg = "MinTTL", zg = "MaxTTL", Bg = "Marker", Vg = "Members", Hg = "Method", Ug = "Mode", Wg = "Name", Gg = "NextMarker", Kg = "NoSuchContinuousDeploymentPolicy", qg = "NoSuchCloudFrontOriginAccessIdentity", Jg = "NoSuchCachePolicy", Yg = "NoSuchDistribution", Xg = "NoSuchFunctionExists", Zg = "NoSuchFieldLevelEncryptionConfig", Qg = "NoSuchFieldLevelEncryptionProfile", $g = "NoSuchInvalidation", e_ = "NoSuchMonitoringSubscription", t_ = "NoSuchOrigin", n_ = "NoSuchOriginAccessControl", r_ = "NoSuchOriginRequestPolicy", i_ = "NoSuchPublicKey", a_ = "NoSuchResource", o_ = "NoSuchResponseHeadersPolicy", s_ = "NoSuchRealtimeLogConfig", c_ = "NoSuchStreamingDistribution", l_ = "Origins", u_ = "OriginAccessControlAlreadyExists", d_ = "OriginAccessControlId", f_ = "OriginAccessControlInUse", p_ = "OwnerAccountId", m_ = "OriginAccessIdentity", h_ = "OriginCustomHeader", g_ = "OriginCustomHeadersList", __ = "OriginGroups", v_ = "OriginGroupFailoverCriteria", y_ = "OriginGroupList", b_ = "OriginGroupMember", x_ = "OriginGroupMemberList", S_ = "OriginGroupMembers", C_ = "OriginGroup", w_ = "OriginId", T_ = "OriginKeepaliveTimeout", E_ = "OriginList", D_ = "OriginMtlsConfig", O_ = "OriginPath", k_ = "OriginProtocolPolicy", A_ = "OriginRequestPolicyAlreadyExists", j_ = "OriginRequestPolicyId", M_ = "OriginRequestPolicyInUse", N_ = "OriginReadTimeout", P_ = "OriginShield", F_ = "OriginSslProtocols", I_ = "OriginShieldRegion", L_ = "Origin", R_ = "PriceClass", z_ = "ParameterDefinitionSchema", B_ = "ParameterDefinition", V_ = "ParameterDefinitions", H_ = "PreconditionFailed", U_ = "PublicKeyAlreadyExists", W_ = "PublicKeyInUse", G_ = "PathList", K_ = "PathPattern", q_ = "Paths", J_ = "Path", Y_ = "Prefix", L = "Quantity", X_ = "QueryArgProfileEmpty", Z_ = "QueryStringCacheKeys", Q_ = "QueryStringCacheKeysList", $_ = "QueryString", ev = "ResponseCode", tv = "ResponseCompletionTimeout", nv = "ResponseHeadersPolicyAlreadyExists", rv = "ResponseHeadersPolicyId", iv = "ResponseHeadersPolicyInUse", av = "ResourceInUse", ov = "RealtimeLogConfigArn", sv = "RealtimeLogConfigAlreadyExists", cv = "RealtimeLogConfigInUse", lv = "RealtimeLogConfigOwnerMismatch", uv = "ResourceNotDisabled", dv = "ResponsePagePath", fv = "RestrictionType", pv = "Restrictions", mv = "Required", hv = "Status", gv = "SelectionCriteria", _v = "StatusCodeList", vv = "StatusCodes", yv = "StatusCode", bv = "StreamingDistributionAlreadyExists", xv = "StagingDistributionInUse", Sv = "StreamingDistributionNotDisabled", Cv = "SignerList", wv = "S3OriginConfig", Tv = "SslProtocolsList", Ev = "SslProtocol", Dv = "SmoothStreaming", Ov = "StringSchemaConfig", kv = "SSLSupportMethod", Av = "StringSchema", jv = "Signer", Mv = "Staging", Nv = "TenantConfig", Pv = "TestFunctionFailed", Fv = "TrustedKeyGroups", Iv = "TrustedKeyGroupDoesNotExist", Lv = "TrustedKeyGroupIdList", Rv = "TooLongCSPInResponseHeadersPolicy", zv = "TooManyCertificates", Bv = "TooManyCacheBehaviors", Vv = "TooManyContinuousDeploymentPolicies", Hv = "TooManyCloudFrontOriginAccessIdentities", Uv = "TooManyCustomHeadersInResponseHeadersPolicy", Wv = "TooManyCookiesInCachePolicy", Gv = "TooManyCookiesInOriginRequestPolicy", Kv = "TooManyCookieNamesInWhiteList", qv = "TooManyCachePolicies", Jv = "TooManyDistributions", Yv = "TooManyDistributionsAssociatedToCachePolicy", Xv = "TooManyDistributionsAssociatedToFieldLevelEncryptionConfig", Zv = "TooManyDistributionsAssociatedToKeyGroup", Qv = "TooManyDistributionsAssociatedToOriginAccessControl", $v = "TooManyDistributionsAssociatedToOriginRequestPolicy", ey = "TooManyDistributionsAssociatedToResponseHeadersPolicy", ty = "TooManyDistributionCNAMEs", ny = "TooManyDistributionsWithFunctionAssociations", ry = "TooManyDistributionsWithLambdaAssociations", iy = "TooManyDistributionsWithSingleFunctionARN", ay = "TooManyFunctions", oy = "TooManyFunctionAssociations", sy = "TooManyFieldLevelEncryptionConfigs", cy = "TooManyFieldLevelEncryptionContentTypeProfiles", ly = "TooManyFieldLevelEncryptionEncryptionEntities", uy = "TooManyFieldLevelEncryptionFieldPatterns", dy = "TooManyFieldLevelEncryptionProfiles", fy = "TooManyFieldLevelEncryptionQueryArgProfiles", py = "TooManyHeadersInCachePolicy", my = "TooManyHeadersInForwardedValues", hy = "TooManyHeadersInOriginRequestPolicy", gy = "TooManyInvalidationsInProgress", _y = "TooManyKeyGroups", vy = "TooManyKeyGroupsAssociatedToDistribution", yy = "TooManyLambdaFunctionAssociations", by = "TooManyOrigins", xy = "TooManyOriginAccessControls", Sy = "TooManyOriginCustomHeaders", Cy = "TooManyOriginGroupsPerDistribution", wy = "TooManyOriginRequestPolicies", Ty = "TooManyPublicKeys", Ey = "TooManyPublicKeysInKeyGroup", Dy = "TooManyQueryStringsInCachePolicy", Oy = "TooManyQueryStringsInOriginRequestPolicy", ky = "TooManyQueryStringParameters", Ay = "TooManyRemoveHeadersInResponseHeadersPolicy", jy = "TooManyResponseHeadersPolicies", My = "TooManyRealtimeLogConfigs", Ny = "TooManyStreamingDistributions", Py = "TooManyStreamingDistributionCNAMEs", Fy = "TooManyTrustedSigners", Iy = "TargetOriginId", Ly = "TrustedSigners", Ry = "TrustStoreConfig", zy = "TrustedSignerDoesNotExist", By = "TrustStoreId", Vy = "UnsupportedOperation", Hy = "ViewerCertificate", Uy = "ViewerMtlsConfig", Wy = "VpcOriginConfig", Gy = "VpcOriginId", Ky = "ViewerProtocolPolicy", qy = "WebACLId", Jy = "WhitelistedNames", R = "client", z = "error", Yy = "http", B = "httpError", Xy = "httpHeader", Zy = "httpPayload", Qy = "httpQuery", $y = "smithy.ts.sdk.synthetic.com.amazonaws.cloudfront", eb = "sensitiveStringType", tb = "server", V = "xmlName", H = "com.amazonaws.cloudfront", nb = new Ue($y), rb = [
	-3,
	$y,
	"CloudFrontServiceException",
	0,
	[],
	[]
];
nb.registerError(rb, M);
var U = new Ue(H), ib = [
	-3,
	H,
	dp,
	{
		[z]: R,
		[B]: 403
	},
	[I],
	[0]
];
U.registerError(ib, gu);
var ab = [
	-3,
	H,
	Sp,
	{
		[z]: R,
		[B]: 413
	},
	[I],
	[0]
];
U.registerError(ab, Tu);
var ob = [
	-3,
	H,
	tm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(ob, Eu);
var sb = [
	-3,
	H,
	rm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(sb, Du);
var cb = [
	-3,
	H,
	kp,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(cb, Ou);
var lb = [
	-3,
	H,
	Ap,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(lb, ku);
var ub = [
	-3,
	H,
	dm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(ub, Au);
var db = [
	-3,
	H,
	Hp,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(db, Hd);
var fb = [
	-3,
	H,
	Up,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(fb, Bf);
var pb = [
	-3,
	H,
	Qp,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(pb, ju);
var mb = [
	-3,
	H,
	jp,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(mb, Gd);
var hb = [
	-3,
	H,
	Np,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(hb, Jd);
var gb = [
	-3,
	H,
	gm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(gb, Mu);
var _b = [
	-3,
	H,
	wm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(_b, Uf);
var vb = [
	-3,
	H,
	jm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(vb, Fd);
var yb = [
	-3,
	H,
	Pm,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(yb, xu);
var bb = [
	-3,
	H,
	Fm,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(bb, Su);
var xb = [
	-3,
	H,
	Im,
	{
		[z]: R,
		[B]: 413
	},
	[I],
	[0]
];
U.registerError(xb, Wd);
var Sb = [
	-3,
	H,
	Km,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Sb, $d);
var Cb = [
	-3,
	H,
	qm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Cb, Gf);
var wb = [
	-3,
	H,
	Ym,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(wb, of);
var Tb = [
	-3,
	H,
	Xm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Tb, Kf);
var Eb = [
	-3,
	H,
	Zm,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Eb, sf);
var Db = [
	-3,
	H,
	Bm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Db, ff);
var Ob = [
	-3,
	H,
	Gm,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ob, qf);
var kb = [
	-3,
	H,
	Qm,
	{
		[z]: R,
		[B]: 413
	},
	[I],
	[0]
];
U.registerError(kb, pf);
var Ab = [
	-3,
	H,
	Th,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Ab, zf);
var jb = [
	-3,
	H,
	jh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(jb, Nu);
var Mb = [
	-3,
	H,
	Uh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Mb, Yd);
var Nb = [
	-3,
	H,
	og,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Nb, _u);
var Pb = [
	-3,
	H,
	Xh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Pb, Pu);
var Fb = [
	-3,
	H,
	gh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Fb, vu);
var Ib = [
	-3,
	H,
	yh,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ib, Qd);
var Lb = [
	-3,
	H,
	Dh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Lb, Fu);
var Rb = [
	-3,
	H,
	Eh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Rb, Xd);
var zb = [
	-3,
	H,
	Oh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(zb, Iu);
var Bb = [
	-3,
	H,
	Ah,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Bb, Lu);
var Vb = [
	-3,
	H,
	kh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Vb, Ru);
var Hb = [
	-3,
	H,
	Mh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Hb, zu);
var Ub = [
	-3,
	H,
	Nh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Ub, Bu);
var Wb = [
	-3,
	H,
	Ph,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Wb, Cu);
var Gb = [
	-3,
	H,
	Rh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Gb, Vu);
var Kb = [
	-3,
	H,
	Lh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Kb, Hu);
var qb = [
	-3,
	H,
	Bh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(qb, Uu);
var Jb = [
	-3,
	H,
	Hh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Jb, Wu);
var Yb = [
	-3,
	H,
	Wh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Yb, Gu);
var Xb = [
	-3,
	H,
	Gh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Xb, Ku);
var Zb = [
	-3,
	H,
	Kh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Zb, qu);
var Qb = [
	-3,
	H,
	qh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Qb, Ju);
var $b = [
	-3,
	H,
	Yh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError($b, Yu);
var ex = [
	-3,
	H,
	Zh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(ex, Xu);
var tx = [
	-3,
	H,
	$h,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(tx, Zu);
var nx = [
	-3,
	H,
	eg,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(nx, Qu);
var rx = [
	-3,
	H,
	Qh,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(rx, $u);
var ix = [
	-3,
	H,
	rg,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(ix, Id);
var ax = [
	-3,
	H,
	ig,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(ax, ed);
var ox = [
	-3,
	H,
	sg,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(ox, td);
var sx = [
	-3,
	H,
	cg,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(sx, nd);
var cx = [
	-3,
	H,
	dg,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(cx, gf);
var lx = [
	-3,
	H,
	Ng,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(lx, rd);
var ux = [
	-3,
	H,
	Lg,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(ux, yf);
var dx = [
	-3,
	H,
	Jg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(dx, id);
var fx = [
	-3,
	H,
	qg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(fx, Vf);
var px = [
	-3,
	H,
	Kg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(px, Zd);
var mx = [
	-3,
	H,
	Yg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(mx, yu);
var hx = [
	-3,
	H,
	Zg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(hx, ad);
var gx = [
	-3,
	H,
	Qg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(gx, ef);
var _x = [
	-3,
	H,
	Xg,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(_x, Jf);
var vx = [
	-3,
	H,
	$g,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(vx, ap);
var yx = [
	-3,
	H,
	e_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(yx, Xf);
var bx = [
	-3,
	H,
	t_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(bx, od);
var xx = [
	-3,
	H,
	n_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(xx, Zf);
var Sx = [
	-3,
	H,
	r_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(Sx, sd);
var Cx = [
	-3,
	H,
	i_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(Cx, cf);
var wx = [
	-3,
	H,
	s_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(wx, cd);
var Tx = [
	-3,
	H,
	a_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(Tx, Yf);
var Ex = [
	-3,
	H,
	o_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(Ex, ld);
var Dx = [
	-3,
	H,
	c_,
	{
		[z]: R,
		[B]: 404
	},
	[I],
	[0]
];
U.registerError(Dx, rp);
var Ox = [
	-3,
	H,
	u_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ox, bf);
var kx = [
	-3,
	H,
	f_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(kx, Qf);
var Ax = [
	-3,
	H,
	A_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ax, Sf);
var jx = [
	-3,
	H,
	M_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(jx, $f);
var Mx = [
	-3,
	H,
	H_,
	{
		[z]: R,
		[B]: 412
	},
	[I],
	[0]
];
U.registerError(Mx, wu);
var Nx = [
	-3,
	H,
	U_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Nx, Df);
var Px = [
	-3,
	H,
	W_,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Px, ep);
var Fx = [
	-3,
	H,
	X_,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Fx, tf);
var Ix = [
	-3,
	H,
	sv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ix, kf);
var Lx = [
	-3,
	H,
	cv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Lx, tp);
var Rx = [
	-3,
	H,
	lv,
	{
		[z]: R,
		[B]: 401
	},
	[I],
	[0]
];
U.registerError(Rx, ud);
var zx = [
	-3,
	H,
	av,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(zx, Wf);
var Bx = [
	-3,
	H,
	uv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Bx, Hf);
var Vx = [
	-3,
	H,
	nv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Vx, jf);
var Hx = [
	-3,
	H,
	iv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Hx, np);
var Ux = [
	-3,
	H,
	xv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Ux, Kd);
var Wx = [
	-3,
	H,
	bv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Wx, If);
var Gx = [
	-3,
	H,
	Sv,
	{
		[z]: R,
		[B]: 409
	},
	[I],
	[0]
];
U.registerError(Gx, ip);
var Kx = [
	-3,
	H,
	Pv,
	{
		[z]: tb,
		[B]: 500
	},
	[I],
	[0]
];
U.registerError(Kx, op);
var qx = [
	-3,
	H,
	Rv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(qx, Mf);
var Jx = [
	-3,
	H,
	Bv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Jx, dd);
var Yx = [
	-3,
	H,
	qv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Yx, Rd);
var Xx = [
	-3,
	H,
	zv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Xx, fd);
var Zx = [
	-3,
	H,
	Hv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Zx, Ud);
var Qx = [
	-3,
	H,
	Vv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(Qx, qd);
var $x = [
	-3,
	H,
	Kv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError($x, pd);
var eS = [
	-3,
	H,
	Wv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(eS, zd);
var tS = [
	-3,
	H,
	Gv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(tS, Cf);
var nS = [
	-3,
	H,
	Uv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(nS, Nf);
var rS = [
	-3,
	H,
	ty,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(rS, bu);
var iS = [
	-3,
	H,
	Jv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(iS, md);
var aS = [
	-3,
	H,
	Yv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(aS, hd);
var oS = [
	-3,
	H,
	Xv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(oS, gd);
var sS = [
	-3,
	H,
	Zv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(sS, _d);
var cS = [
	-3,
	H,
	Qv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(cS, vd);
var lS = [
	-3,
	H,
	$v,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(lS, yd);
var uS = [
	-3,
	H,
	ey,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(uS, bd);
var dS = [
	-3,
	H,
	ny,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(dS, xd);
var fS = [
	-3,
	H,
	ry,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(fS, Sd);
var pS = [
	-3,
	H,
	iy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(pS, Cd);
var mS = [
	-3,
	H,
	sy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(mS, nf);
var hS = [
	-3,
	H,
	cy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(hS, rf);
var gS = [
	-3,
	H,
	ly,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(gS, lf);
var _S = [
	-3,
	H,
	uy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(_S, uf);
var vS = [
	-3,
	H,
	dy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(vS, df);
var yS = [
	-3,
	H,
	fy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(yS, af);
var bS = [
	-3,
	H,
	oy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(bS, wd);
var xS = [
	-3,
	H,
	ay,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(xS, mf);
var SS = [
	-3,
	H,
	py,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(SS, Bd);
var CS = [
	-3,
	H,
	my,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(CS, Td);
var wS = [
	-3,
	H,
	hy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(wS, wf);
var TS = [
	-3,
	H,
	gy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(TS, hf);
var ES = [
	-3,
	H,
	_y,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(ES, _f);
var DS = [
	-3,
	H,
	vy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(DS, Ed);
var OS = [
	-3,
	H,
	yy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(OS, Dd);
var kS = [
	-3,
	H,
	xy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(kS, xf);
var AS = [
	-3,
	H,
	Sy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(AS, Od);
var jS = [
	-3,
	H,
	Cy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(jS, kd);
var MS = [
	-3,
	H,
	wy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(MS, Tf);
var NS = [
	-3,
	H,
	by,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(NS, Ad);
var PS = [
	-3,
	H,
	Ty,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(PS, Of);
var FS = [
	-3,
	H,
	Ey,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(FS, vf);
var IS = [
	-3,
	H,
	ky,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(IS, jd);
var LS = [
	-3,
	H,
	Dy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(LS, Vd);
var RS = [
	-3,
	H,
	Oy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(RS, Ef);
var zS = [
	-3,
	H,
	My,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(zS, Af);
var BS = [
	-3,
	H,
	Ay,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(BS, Pf);
var VS = [
	-3,
	H,
	jy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(VS, Ff);
var HS = [
	-3,
	H,
	Py,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(HS, Lf);
var US = [
	-3,
	H,
	Ny,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(US, Rf);
var WS = [
	-3,
	H,
	Fy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(WS, Md);
var GS = [
	-3,
	H,
	Iv,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(GS, Nd);
var KS = [
	-3,
	H,
	zy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(KS, Pd);
var qS = [
	-3,
	H,
	Vy,
	{
		[z]: R,
		[B]: 400
	},
	[I],
	[0]
];
U.registerError(qS, Ld);
var JS = [nb, U], YS = [
	0,
	H,
	sm,
	8,
	0
], XS = [
	0,
	H,
	eb,
	8,
	0
], ZS = [
	3,
	H,
	vp,
	0,
	[
		N,
		L,
		P
	],
	[
		2,
		1,
		[() => jw, 0]
	],
	2
], QS = [
	3,
	H,
	yp,
	0,
	[
		N,
		L,
		P
	],
	[
		2,
		1,
		[() => Hw, 0]
	],
	2
], $S = [
	3,
	H,
	sp,
	0,
	[L, P],
	[1, [() => xw, 0]],
	1
], eC = [
	3,
	H,
	fp,
	0,
	[Zp, Ch],
	[0, 0]
], tC = [
	3,
	H,
	gp,
	0,
	[
		L,
		P,
		Jp
	],
	[
		1,
		[() => Pw, 0],
		[() => iC, 0]
	],
	2
], nC = [
	3,
	H,
	Tp,
	0,
	[
		K_,
		Iy,
		Ky,
		Ly,
		Fv,
		gp,
		Dv,
		Cp,
		Cg,
		zm,
		Jm,
		ov,
		nm,
		j_,
		rv,
		th,
		$m,
		Rg,
		Om,
		zg
	],
	[
		0,
		0,
		0,
		[() => mw, 0],
		[() => pw, 0],
		[() => tC, 0],
		2,
		2,
		[() => BC, 0],
		[() => TC, 0],
		0,
		0,
		0,
		0,
		0,
		() => jC,
		[() => CC, 0],
		1,
		1,
		1
	],
	3
], rC = [
	3,
	H,
	Dp,
	0,
	[L, P],
	[1, [() => Cw, 0]],
	1
], iC = [
	3,
	H,
	Jp,
	0,
	[L, P],
	[1, [() => Pw, 0]],
	2
], aC = [
	3,
	H,
	cm,
	0,
	[dh],
	[0],
	1
], oC = [
	3,
	H,
	Bp,
	0,
	[F],
	[0],
	1
], sC = [
	3,
	H,
	Xp,
	0,
	[L, P],
	[1, [() => ww, 0]],
	1
], cC = [
	3,
	H,
	im,
	0,
	[eh, Jy],
	[0, [() => sC, 0]],
	1
], lC = [
	3,
	H,
	Pp,
	0,
	[_m],
	[[() => bC, {
		[Zy]: 1,
		[V]: _m
	}]],
	1
], uC = [
	3,
	H,
	Fp,
	0,
	[
		hm,
		vg,
		Lm
	],
	[
		[() => yC, 16],
		[0, { [Xy]: vg }],
		[0, { [Xy]: Lm }]
	]
], dC = [
	3,
	H,
	Kp,
	0,
	[xm, bh],
	[[0, 1], [() => PC, {
		[Zy]: 1,
		[V]: bh
	}]],
	2
], fC = [
	3,
	H,
	qp,
	0,
	[vg, lg],
	[[0, { [Xy]: vg }], [() => NC, 16]]
], pC = [
	3,
	H,
	Lp,
	0,
	[
		Mm,
		dv,
		ev,
		Nm
	],
	[
		1,
		0,
		0,
		1
	],
	1
], mC = [
	3,
	H,
	zp,
	0,
	[L, P],
	[1, [() => Tw, 0]],
	1
], hC = [
	3,
	H,
	Wp,
	0,
	[L, P],
	[1, [() => Fw, 0]],
	1
], gC = [
	3,
	H,
	em,
	0,
	[
		fh,
		ph,
		k_,
		F_,
		N_,
		T_,
		vh,
		D_
	],
	[
		1,
		1,
		0,
		[() => nw, 0],
		1,
		1,
		0,
		() => $C
	],
	3
], _C = [
	3,
	H,
	vm,
	0,
	[
		Iy,
		Ky,
		Ly,
		Fv,
		gp,
		Dv,
		Cp,
		Cg,
		zm,
		Jm,
		ov,
		nm,
		j_,
		rv,
		th,
		$m,
		Rg,
		Om,
		zg
	],
	[
		0,
		0,
		[() => mw, 0],
		[() => pw, 0],
		[() => tC, 0],
		2,
		2,
		[() => BC, 0],
		[() => TC, 0],
		0,
		0,
		0,
		0,
		0,
		() => jC,
		[() => CC, 0],
		1,
		1,
		1
	],
	2
], vC = [
	3,
	H,
	bm,
	0,
	[F, zh],
	[[0, 1], [0, { [Xy]: Vh }]],
	1
], yC = [
	3,
	H,
	hm,
	0,
	[
		F,
		_p,
		hv,
		jg,
		Jh,
		Cm,
		_m,
		yp,
		vp,
		pp
	],
	[
		0,
		0,
		0,
		4,
		1,
		0,
		[() => bC, 0],
		[() => QS, 0],
		[() => ZS, 0],
		[() => bw, 0]
	],
	7
], bC = [
	3,
	H,
	_m,
	0,
	[
		am,
		l_,
		vm,
		pm,
		N,
		sp,
		Tm,
		__,
		Dp,
		zp,
		Mg,
		R_,
		Hy,
		pv,
		qy,
		mh,
		Fh,
		Mp,
		Mv,
		mp,
		Nv,
		Yp,
		Uy,
		Bp,
		cm
	],
	[
		0,
		[() => ew, 0],
		[() => _C, 0],
		[() => YS, 0],
		2,
		[() => $S, 0],
		0,
		[() => QC, 0],
		[() => rC, 0],
		[() => mC, 0],
		() => GC,
		0,
		() => gw,
		[() => sw, 0],
		0,
		0,
		2,
		0,
		2,
		0,
		[() => fw, 0],
		0,
		() => _w,
		() => oC,
		() => aC
	],
	5
], xC = [
	3,
	H,
	Sm,
	0,
	[
		Bg,
		Pg,
		ag,
		L,
		Gg,
		P
	],
	[
		0,
		1,
		2,
		1,
		0,
		[() => Ew, 0]
	],
	4
], SC = [
	3,
	H,
	Em,
	0,
	[
		F,
		_p,
		hv,
		jg,
		Cm,
		sp,
		l_,
		vm,
		Dp,
		zp,
		pm,
		R_,
		N,
		Hy,
		pv,
		qy,
		mh,
		Fh,
		Mv,
		Lm,
		__,
		pp,
		Yp,
		mp,
		Uy,
		Bp
	],
	[
		0,
		0,
		0,
		4,
		0,
		[() => $S, 0],
		[() => ew, 0],
		[() => _C, 0],
		[() => rC, 0],
		[() => mC, 0],
		[() => XS, 0],
		0,
		2,
		() => gw,
		[() => sw, 0],
		0,
		0,
		2,
		2,
		0,
		[() => QC, 0],
		[() => bw, 0],
		0,
		0,
		() => _w,
		() => oC
	],
	19
], CC = [
	3,
	H,
	$m,
	0,
	[
		$_,
		mm,
		lh,
		Z_
	],
	[
		2,
		[() => cC, 0],
		[() => MC, 0],
		[() => ow, 0]
	],
	2
], wC = [
	3,
	H,
	Um,
	0,
	[Hm, Rm],
	[0, 0],
	2
], TC = [
	3,
	H,
	zm,
	0,
	[L, P],
	[1, [() => Dw, 0]],
	1
], EC = [
	3,
	H,
	ch,
	0,
	[
		fv,
		L,
		P
	],
	[
		0,
		1,
		[() => Nw, 0]
	],
	2
], DC = [
	3,
	H,
	ih,
	0,
	[F],
	[[0, 1]],
	1
], OC = [
	3,
	H,
	ah,
	0,
	[_m, Lm],
	[[() => bC, 16], [0, { [Xy]: Lm }]]
], kC = [
	3,
	H,
	oh,
	0,
	[F],
	[[0, 1]],
	1
], AC = [
	3,
	H,
	sh,
	0,
	[hm, Lm],
	[[() => yC, 16], [0, { [Xy]: Lm }]]
], jC = [
	3,
	H,
	th,
	0,
	[N],
	[2],
	1
], MC = [
	3,
	H,
	lh,
	0,
	[L, P],
	[1, [() => Ow, 0]],
	1
], NC = [
	3,
	H,
	lg,
	0,
	[
		F,
		hv,
		um,
		bh
	],
	[
		0,
		0,
		4,
		[() => PC, 0]
	],
	4
], PC = [
	3,
	H,
	bh,
	0,
	[q_, am],
	[[() => aw, 0], 0],
	2
], FC = [
	3,
	H,
	Ih,
	0,
	[
		Bg,
		Pg,
		ag,
		L,
		Gg,
		P
	],
	[
		0,
		1,
		2,
		1,
		0,
		[() => kw, 0]
	],
	4
], IC = [
	3,
	H,
	ng,
	0,
	[
		F,
		um,
		hv
	],
	[
		0,
		4,
		0
	],
	3
], LC = [
	3,
	H,
	hg,
	0,
	[L, P],
	[1, [() => Aw, 0]],
	1
], RC = [
	3,
	H,
	pg,
	0,
	[fg, hg],
	[0, [() => LC, 0]]
], zC = [
	3,
	H,
	Eg,
	0,
	[
		Tg,
		Rm,
		xh
	],
	[
		0,
		0,
		2
	],
	2
], BC = [
	3,
	H,
	Cg,
	0,
	[L, P],
	[1, [() => Mw, 0]],
	1
], VC = [
	3,
	H,
	xg,
	0,
	[Bg, Pg],
	[[0, { [Qy]: Bg }], [1, { [Qy]: Pg }]]
], HC = [
	3,
	H,
	Sg,
	0,
	[Sm],
	[[() => xC, 16]]
], UC = [
	3,
	H,
	Og,
	0,
	[
		xm,
		Bg,
		Pg
	],
	[
		[0, 1],
		[0, { [Qy]: Bg }],
		[1, { [Qy]: Pg }]
	],
	1
], WC = [
	3,
	H,
	kg,
	0,
	[Ih],
	[[() => FC, 16]]
], GC = [
	3,
	H,
	yg,
	0,
	[
		N,
		wh,
		xp,
		Y_
	],
	[
		2,
		2,
		0,
		0
	]
], KC = [
	3,
	H,
	L_,
	0,
	[
		F,
		Cm,
		O_,
		Wp,
		wv,
		em,
		Wy,
		wp,
		lm,
		tv,
		P_,
		d_
	],
	[
		0,
		0,
		0,
		[() => hC, 0],
		() => cw,
		[() => gC, 0],
		() => vw,
		1,
		1,
		1,
		() => tw,
		0
	],
	2
], qC = [
	3,
	H,
	h_,
	0,
	[dh, hh],
	[0, [() => XS, 0]],
	2
], JC = [
	3,
	H,
	C_,
	0,
	[
		F,
		Wm,
		Vg,
		gv
	],
	[
		0,
		[() => YC, 0],
		[() => ZC, 0],
		0
	],
	3
], YC = [
	3,
	H,
	v_,
	0,
	[vv],
	[[() => uw, 0]],
	1
], XC = [
	3,
	H,
	b_,
	0,
	[w_],
	[0],
	1
], ZC = [
	3,
	H,
	S_,
	0,
	[L, P],
	[1, [() => Lw, 0]],
	2
], QC = [
	3,
	H,
	__,
	0,
	[L, P],
	[1, [() => Iw, 0]],
	1
], $C = [
	3,
	H,
	D_,
	0,
	[Op],
	[0],
	1
], ew = [
	3,
	H,
	l_,
	0,
	[L, P],
	[1, [() => Rw, 0]],
	2
], tw = [
	3,
	H,
	P_,
	0,
	[N, I_],
	[2, 0],
	1
], nw = [
	3,
	H,
	F_,
	0,
	[L, P],
	[1, [() => Uw, 0]],
	2
], rw = [
	3,
	H,
	B_,
	0,
	[Wg, Am],
	[0, [() => iw, 0]],
	2
], iw = [
	3,
	H,
	z_,
	0,
	[Av],
	[[() => dw, 0]]
], aw = [
	3,
	H,
	q_,
	0,
	[L, P],
	[1, [() => Bw, 0]],
	1
], ow = [
	3,
	H,
	Z_,
	0,
	[L, P],
	[1, [() => Vw, 0]],
	1
], sw = [
	3,
	H,
	pv,
	0,
	[ch],
	[[() => EC, 0]],
	1
], cw = [
	3,
	H,
	wv,
	0,
	[m_, N_],
	[0, 1],
	1
], lw = [
	3,
	H,
	jv,
	0,
	[cp, hg],
	[0, [() => LC, 0]]
], uw = [
	3,
	H,
	vv,
	0,
	[L, P],
	[1, [() => Ww, 0]],
	2
], dw = [
	3,
	H,
	Ov,
	0,
	[
		mv,
		pm,
		km
	],
	[
		2,
		[() => XS, 0],
		0
	],
	1
], fw = [
	3,
	H,
	Nv,
	0,
	[V_],
	[[() => zw, 0]]
], pw = [
	3,
	H,
	Fv,
	0,
	[
		N,
		L,
		P
	],
	[
		2,
		1,
		[() => Gw, 0]
	],
	2
], mw = [
	3,
	H,
	Ly,
	0,
	[
		N,
		L,
		P
	],
	[
		2,
		1,
		[() => Sw, 0]
	],
	2
], hw = [
	3,
	H,
	Ry,
	0,
	[
		By,
		bp,
		Sh
	],
	[
		0,
		2,
		2
	],
	1
], gw = [
	3,
	H,
	Hy,
	0,
	[
		Vp,
		_h,
		up,
		kv,
		Ig,
		fm,
		om
	],
	[
		2,
		0,
		0,
		0,
		0,
		0,
		0
	]
], _w = [
	3,
	H,
	Uy,
	0,
	[Ug, Ry],
	[0, () => hw]
], vw = [
	3,
	H,
	Wy,
	0,
	[
		Gy,
		p_,
		N_,
		T_
	],
	[
		0,
		0,
		1,
		1
	],
	1
], yw = "unit", bw = [
	1,
	H,
	pp,
	0,
	[() => eC, { [V]: fp }]
], xw = [
	1,
	H,
	hp,
	0,
	[0, { [V]: Zp }]
], Sw = [
	1,
	H,
	lp,
	0,
	[0, { [V]: cp }]
], Cw = [
	1,
	H,
	Ep,
	0,
	[() => nC, { [V]: Tp }]
], ww = [
	1,
	H,
	$p,
	0,
	[0, { [V]: Wg }]
], Tw = [
	1,
	H,
	Rp,
	0,
	[() => pC, { [V]: Lp }]
], Ew = [
	1,
	H,
	Dm,
	0,
	[() => SC, { [V]: Em }]
], Dw = [
	1,
	H,
	Vm,
	0,
	[() => wC, { [V]: Um }]
], Ow = [
	1,
	H,
	uh,
	0,
	[0, { [V]: Wg }]
], kw = [
	1,
	H,
	tg,
	0,
	[() => IC, { [V]: ng }]
], Aw = [
	1,
	H,
	gg,
	0,
	[0, { [V]: _g }]
], jw = [
	1,
	H,
	mg,
	0,
	[() => RC, { [V]: ug }]
], Mw = [
	1,
	H,
	wg,
	0,
	[() => zC, { [V]: Eg }]
], Nw = [
	1,
	H,
	Ag,
	0,
	[0, { [V]: vg }]
], Pw = [
	1,
	H,
	Fg,
	0,
	[0, { [V]: Hg }]
], Fw = [
	1,
	H,
	g_,
	0,
	[() => qC, { [V]: h_ }]
], Iw = [
	1,
	H,
	y_,
	0,
	[() => JC, { [V]: C_ }]
], Lw = [
	1,
	H,
	x_,
	0,
	[() => XC, { [V]: b_ }]
], Rw = [
	1,
	H,
	E_,
	0,
	[() => KC, { [V]: L_ }]
], zw = [
	1,
	H,
	V_,
	0,
	[() => rw, 0]
], Bw = [
	1,
	H,
	G_,
	0,
	[0, { [V]: J_ }]
], Vw = [
	1,
	H,
	Q_,
	0,
	[0, { [V]: Wg }]
], Hw = [
	1,
	H,
	Cv,
	0,
	[() => lw, { [V]: jv }]
], Uw = [
	1,
	H,
	Tv,
	0,
	[0, { [V]: Ev }]
], Ww = [
	1,
	H,
	_v,
	0,
	[1, { [V]: yv }]
], Gw = [
	1,
	H,
	Lv,
	0,
	[0, { [V]: ug }]
], Kw = [
	9,
	H,
	Ip,
	{ [Yy]: [
		"POST",
		"/2020-05-31/distribution",
		201
	] },
	() => lC,
	() => uC
], qw = [
	9,
	H,
	Gp,
	{ [Yy]: [
		"POST",
		"/2020-05-31/distribution/{DistributionId}/invalidation",
		201
	] },
	() => dC,
	() => fC
], Jw = [
	9,
	H,
	ym,
	{ [Yy]: [
		"DELETE",
		"/2020-05-31/distribution/{Id}",
		204
	] },
	() => vC,
	() => yw
], Yw = [
	9,
	H,
	nh,
	{ [Yy]: [
		"GET",
		"/2020-05-31/distribution/{Id}",
		200
	] },
	() => kC,
	() => AC
], Xw = [
	9,
	H,
	rh,
	{ [Yy]: [
		"GET",
		"/2020-05-31/distribution/{Id}/config",
		200
	] },
	() => DC,
	() => OC
], Zw = [
	9,
	H,
	bg,
	{ [Yy]: [
		"GET",
		"/2020-05-31/distribution",
		200
	] },
	() => VC,
	() => HC
], Qw = [
	9,
	H,
	Dg,
	{ [Yy]: [
		"GET",
		"/2020-05-31/distribution/{DistributionId}/invalidation",
		200
	] },
	() => UC,
	() => WC
];
ha(), he(), O();
var $w = (e) => ({
	apiVersion: "2020-05-31",
	base64Decoder: e?.base64Decoder ?? pt,
	base64Encoder: e?.base64Encoder ?? _t,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? hu,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? vl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Ec()
	}],
	logger: e?.logger ?? new st(),
	protocol: e?.protocol ?? Gl,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.cloudfront",
		errorTypeRegistries: JS,
		xmlNamespace: "http://cloudfront.amazonaws.com/doc/2020-05-31/",
		version: "2020-05-31",
		serviceTarget: "Cloudfront2020_05_31"
	},
	serviceId: e?.serviceId ?? "CloudFront",
	sha256: e?.sha256 ?? pa,
	urlParser: e?.urlParser ?? me,
	utf8Decoder: e?.utf8Decoder ?? ht,
	utf8Encoder: e?.utf8Encoder ?? xt
});
O(), Ri();
var eT = (e) => {
	let t = hc(e), n = () => t().then(Qe), r = $w(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? Rn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? tc({
			serviceId: r.serviceId,
			clientVersion: Sl.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? ve("Region is missing"),
		requestHandler: El.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || ss),
		streamCollector: e?.streamCollector ?? Li,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, tT = (e) => {
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
}, nT = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), rT = (e, t) => {
	let n = Object.assign(_c(e), it(e), wo(e), tT(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, vc(n), at(n), To(n), nT(n));
};
ji(), w();
var iT = class extends ye {
	config;
	constructor(...[e]) {
		let t = eT(e || {});
		super(t), this.initConfig = t;
		let n = ms(pc(ds(Rs(bl(t))))), r = rT(yl(ki(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(ke(this.config)), this.middlewareStack.use(ec(this.config)), this.middlewareStack.use(fs(this.config)), this.middlewareStack.use(ko(this.config)), this.middlewareStack.use(_s(this.config)), this.middlewareStack.use(bs(this.config)), this.middlewareStack.use(xs(this.config)), this.middlewareStack.use(Es(this.config, {
			httpAuthSchemeParametersProvider: gl,
			identityProviderConfigProvider: async (e) => new Ns({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(js(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-cloudfront@3.1156.0/node_modules/@aws-sdk/client-cloudfront/dist-es/commandBuilder.js
ji();
var aT = ct(xl, "Cloudfront2020_05_31", "CloudFrontClient", Ai), oT = {}, sT = (e, t, n, r) => [], cT = class extends aT(oT, sT, "CreateDistribution", Kw) {}, lT = class extends aT(oT, sT, "CreateInvalidation", qw) {}, uT = class extends aT(oT, sT, "DeleteDistribution", Jw) {}, dT = class extends aT(oT, sT, "GetDistribution", Yw) {}, fT = class extends aT(oT, sT, "GetDistributionConfig", Xw) {}, pT = class extends aT(oT, sT, "ListDistributions", Zw) {}, mT = class extends aT(oT, sT, "ListInvalidations", Qw) {}, hT = class extends Error {
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
}, gT = Symbol(), _T = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), vT = 1e4, yT = (e) => "headers" in e, bT = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (yT(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? xT(e, {
		all: n,
		dot: r
	}) : {};
};
async function xT(e, t) {
	if (!yT(e) && e.bodyCache.formData) return ST(await e.bodyCache.formData, t);
	let n = yT(e) ? e.headers : e.raw.headers, r = _T(await e.arrayBuffer(), n.get("Content-Type") || "");
	yT(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? ST(i, t) : {};
}
function ST(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? CT(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (wT(n, e, t, r), delete n[e]);
	}), n;
}
var CT = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, wT = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && TT(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= vT && TT(), i[e] = Object.create(null)), i = i[e]);
	});
}, TT = () => {
	throw Error("Nesting limit exceeded");
}, ET = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, DT = (e) => {
	let { groups: t, path: n } = OT(e);
	return kT(ET(n), t);
}, OT = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, kT = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, AT = {}, jT = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return AT[r] || (AT[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), AT[r];
	}
	return null;
}, MT = (e, t) => {
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
}, NT = (e) => MT(e, decodeURI), PT = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return NT(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, FT = (e) => {
	let t = PT(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, IT = (e, t, ...n) => (n.length && (t = IT(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), LT = (e) => {
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
}, RT = (e) => e.indexOf("%") === -1 ? e : MT(e, UT), zT = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), RT(e)), BT = (e, t, n) => {
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
					return zT(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = zT(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = zT(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, VT = BT, HT = (e, t) => BT(e, t, !0), UT = decodeURIComponent, WT = class {
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
		return n && RT(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = RT(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return VT(this.url, e);
	}
	queries(e) {
		return HT(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return bT(this, e);
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
	get [gT]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, GT = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, KT = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, qT = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => qT(e, t, !1, r, i))).then(() => i[0]));
	return n ? KT(await o, a) : o;
}, JT = "text/plain; charset=UTF-8", YT = (e, t) => ({
	"Content-Type": e,
	...t
}), XT = (e, t) => new Response(e, t), ZT = class {
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
		return this.#t ??= new WT(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= XT(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = XT(e.body, e);
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
		this.finalized && (this.#a = XT(this.#a.body, this.#a));
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
		return XT(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, YT(JT, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, YT("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, YT("text/html; charset=UTF-8", n));
		return typeof e == "object" ? qT(e, GT.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => XT(), this.#c(this));
}, QT = (e, t, n) => (r, i) => {
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
}, $T = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], eE = "Can not add a route since the matcher is already built.", tE = class extends Error {}, nE = "__COMPOSED_HANDLER", rE = (e) => e.text("404 Not Found", 404), iE = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, aE = class e {
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
		[...$T, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? PT : FT;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = rE;
	errorHandler = iE;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === iE ? r = e.handler : (r = async (n, r) => (await QT([], t.errorHandler)(n, () => e.handler(n, r))).res, r[nE] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = IT(this._basePath, e), t;
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
			let t = IT(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", IT(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = IT(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : IT(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new ZT(e, {
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
		let s = QT(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${IT("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, W = () => Object.create(null), oE = [];
function sE(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], oE];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var cE = "[^/]+", lE = "(?:|/.*)", uE = Symbol(), dE = /* @__PURE__ */ new Set(".\\+*[^]$()");
function fE(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var pE = class e {
	#e;
	#t;
	#n = W();
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
				cE
			] : null : s === "/*" ? [
				"",
				"",
				lE
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && dE.has(n))) throw uE;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw uE;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw uE;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw uE;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(fE).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : dE.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, mE = class {
	#e = { varIndex: 0 };
	#t = new pE();
	#n = 0;
	paths = W();
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
}, hE = W();
function gE(e) {
	return hE[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? lE : e === "*" ? ".*" : `/:${cE}`)}$`);
}
function _E(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (gE(n).test(t)) return [...e[n]];
}
var vE = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: W() }, this.#t = { ALL: W() }, this.#n = { ALL: new mE() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === uE ? new tE(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(eE);
		if (!r[e]) {
			this.#n[e] = new mE();
			for (let t of [r, i]) {
				t[e] = W();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = gE(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = _E(r[e], t) || _E(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = LT(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = _E(r[t], e) || _E(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = sE;
	buildAllMatchers() {
		let e = W();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, hE = W(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = W(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), W())]) : i[t] = [n.map(([e]) => [e, W()]), oE];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, yE = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(eE);
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
				if (e instanceof tE) continue;
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
}, bE = W(), xE = 0, SE = class e {
	#e = [];
	#t = W();
	#n = [];
	#r;
	#i = bE;
	insert(t, n, r) {
		let i = this, a = DT(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = jT(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++xE
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = W(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = bE;
		let r = [this], i = ET(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === bE ? {} : { ...p.#i };
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
}, CE = class {
	name = "TrieRouter";
	#e = new SE();
	add(e, t, n) {
		for (let r of LT(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, wE = class extends aE {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new yE({ routers: [new vE(), new CE()] });
	}
}, TE = [
	"start",
	"stop",
	"reboot"
], G = class extends Error {
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
}, K = class extends G {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, EE = class extends G {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, q = class extends G {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, DE = class extends G {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, OE = class extends G {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, J = class extends G {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, kE = class extends G {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, AE = class extends G {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, jE = class extends G {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, ME = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function NE(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && ME.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function PE(e, t) {
	let n = FE(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function FE(e, t) {
	if (e instanceof G) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return NE(e) ? new AE(r, { cause: e }) : new jE(r, { cause: e });
}
var IE = 1e3, LE = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function RE(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new K("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new K("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new K("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = zE(r)), a;
}
function zE(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!LE.includes(t)) throw new K(`sortKey.operator must be one of ${LE.join(", ")}.`);
	if (typeof n != "string" || !n) throw new K("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new K("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new K("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function BE(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new K(`limit must be a whole number between 1 and ${IE}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new K(`limit must be between 1 and ${IE}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var VE = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], HE = {
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
}, UE = Object.keys(HE).map((e) => ({
	service: e,
	...HE[e]
})).sort(qE);
UE.map((e) => e.service);
function Y(e) {
	return Object.hasOwn(HE, e);
}
function WE(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function GE(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function KE(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function qE(e, t) {
	let n = VE.indexOf(e.group) - VE.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var JE = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function YE(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${JE[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var XE = /* @__PURE__ */ new Set([
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
]), ZE = /* @__PURE__ */ new Set([
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
]), QE = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), $E = /* @__PURE__ */ new Set([
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
]), eD = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), tD = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), nD = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function rD(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function iD(e) {
	if (!rD(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || XE.has(n)) return new OE(r, i);
	if (ZE.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new DE(r, i);
	if (QE.has(n)) return new EE(r, i);
	if ($E.has(n)) return new K(r, i);
	if (eD.has(n) || /\.NotFound$/.test(n)) return new q(r, i);
	if (tD.has(n)) return new kE(r, i);
	if (nD.has(n) || NE(e)) return new AE(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new K(r, i) : a === 401 || a === 403 ? new EE(r, i) : a === 404 ? new q(r, i) : a === 409 ? new DE(r, i) : a === 429 ? new OE(r, i) : a === 501 ? new kE(r, i) : a === 503 || a === 504 ? new AE(r, i) : new jE(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function aD() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function oD(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var sD = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, cD = !1;
function lD(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = uD(t);
	return !n && !cD && (cD = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function uD(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(sD, t) ? sD[t] : null;
}
var dD = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), fD = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), pD = 5464, mD = 8192, hD = 50, gD = 12e4;
function _D(e, t = aD) {
	let n = new wE();
	n.onError((e, t) => {
		if (e instanceof G) {
			let { status: n, body: r } = PE(e);
			return t.json(r, n);
		}
		return e instanceof hT ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : lD();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && X(n) && n !== i) throw new q("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new q("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return ND(e, 150), $(e, () => oD(gD, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: FD(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!X(n)) throw new q("Unknown cloud");
		return n === "aws" ? $(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new K("queryString must be a string.");
			if (typeof t.startTime != "number") throw new K("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new K("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new K("limit must be a number.");
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
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new K("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > hD) throw new K(`logGroupNames must include at most ${hD} log groups.`);
			if (typeof n.queryString != "string") throw new K("queryString must be a string.");
			if (typeof n.startTime != "number") throw new K("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new K("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new K("limit must be a number.");
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
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
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
		if (!X(t) || n === null) throw new q("Unknown cloud or version");
		return $(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new q("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!X(t) || n === null) throw new q("Unknown cloud or version");
		return $(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!X(t) || !Number.isInteger(n) || n <= 0) throw new q("Unknown cloud or deployment");
		return $(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new q("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), jD(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), jD(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", MD(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), jD(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", MD(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), RE(n), MD(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new q("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new K("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return $(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new K("Object key is required");
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
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new K("Object key is required");
		return $(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new K("srcKey and destKey are required");
		return $(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await wD(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new K("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new K("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new K("maxMessages must be an integer between 1 and 10");
		return $(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = xD((await wD(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = SD(e.req.query());
		return $(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new K("receiptHandle is required");
		return $(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return PD(e, async () => {
			let n = await TD(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: AD(n.plaintextBase64, "plaintextBase64", pD),
				encryptionAlgorithm: ED(n.encryptionAlgorithm),
				encryptionContext: kD(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return PD(e, async () => {
			let n = await TD(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: AD(n.ciphertextBlobBase64, "ciphertextBlobBase64", mD),
				encryptionAlgorithm: ED(n.encryptionAlgorithm),
				encryptionContext: kD(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of TE) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!X(n)) throw new q("Unknown cloud");
		return $(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return PD(e, async () => {
			let n = await TD(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: AD(n.messageBase64, "messageBase64", pD),
				signingAlgorithm: DD(n.signingAlgorithm)
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
		if (!X(t)) throw new q("Unknown cloud");
		return PD(e, async () => {
			let n = await TD(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: AD(n.messageBase64, "messageBase64", pD),
				signature: AD(n.signatureBase64, "signatureBase64", mD),
				keyVersionId: OD(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: DD(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!X(t)) throw new q("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await wD(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = CD(await wD(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function X(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var vD = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], yD = 100, bD = 100;
function xD(e) {
	if (!Array.isArray(e) || e.length === 0) throw new K("messages must contain at least one entry");
	if (e.length > bD) throw new K(`messages must contain at most ${bD} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new K("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new K("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function SD(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new K("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!vD.includes(n)) throw new K(`cursorType must be one of ${vD.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new K("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new K("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > yD) throw new K(`limit must be an integer between 1 and ${yD}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function CD(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new K(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function wD(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new K("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof K ? e : new K("Request body must be valid JSON");
	}
}
var Z = class extends K {};
async function TD(e) {
	try {
		return await wD(e);
	} catch (e) {
		throw e instanceof K ? new Z(e.message) : e;
	}
}
function ED(e) {
	if (typeof e != "string" || !dD.has(e)) throw new Z("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function DD(e) {
	if (typeof e != "string" || !fD.has(e)) throw new Z("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function OD(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new Z(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function kD(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Z("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new Z("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function AD(e, t, n) {
	if (typeof e != "string") throw new Z(`${t} must be a base64 string`);
	if (e.length > n) throw new Z(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new Z(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new Z(`${t} must be canonical base64`);
	return r;
}
function Q(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !X(t) || !Y(n) ? null : {
		cloud: t,
		service: n
	};
}
function jD(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: BE(e.req.query("limit"))
	};
}
function MD(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new K("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new K("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: BE(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function ND(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function $(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = PE(t, iD);
		return e.json(r, n);
	}
}
async function PD(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = PE(t, iD);
		if (t instanceof Z) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function FD(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
_D();
// ../api/src/registry/CloudAdapterRegistry.ts
var ID = class {
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
}, LD = async () => {}, RD = {
	aws: LD,
	azure: LD,
	gcp: LD,
	oci: LD
};
function zD() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var BD = 5e3, VD = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = RD, n = lD(), r = null) {
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
		return Promise.all(UE.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? WE(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: GE(t, e),
				docsUrl: YE(t, e),
				availability: a,
				reason: r.reason ?? HD(a, e, o),
				route: KE(t, e),
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
			endpoint: zD(e),
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
		if (r && Date.now() - r.at < BD) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = zD(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = PE(r, iD);
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
		if (t && Date.now() - t.at < BD) return t.value;
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
		if (!i.update) throw new J(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new J(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new J(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new J(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new J(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new q(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new J(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new J(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new J(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new J(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new J(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new J(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new J(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new J(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new J(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new J(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new J(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new J(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new J(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new J(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new J(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new J(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new J(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new J(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new J(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = UD(e, t);
		if (this.emptying.has(a)) throw new DE(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new DE(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = UD(e, t);
		if (this.emptying.has(r)) throw new DE(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
		if (!i.listObjects) throw new J(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new J(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new J(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new J(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new J(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new J(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new J(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new J(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new J(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new J(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new J(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new J(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new J(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new J(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new J(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new J(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new J(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new J(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new J(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new J(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new J(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new J(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new J(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new J(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new J(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new J(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new J(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new J(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new J(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new J(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new J(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new J(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new J(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new J(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new J(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new J(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new J(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new J(`AppConfig resources are not supported for ${e}/configuration`);
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
		if (!n.listLambdaTriggers) throw new J(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new J(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new J(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new J(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function HD(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function UD(e, t) {
	return JSON.stringify([e, t]);
}
// ../api/browser-bundle/node-crypto-stub.ts
function WD() {
	return crypto.randomUUID();
}
// ../api/src/cloud-spi/cdnSchema.ts
var GD = [
	{
		name: "name",
		label: "Distribution",
		format: "code"
	},
	{
		name: "status",
		label: "Status",
		format: "badge"
	},
	{
		name: "domainName",
		label: "Domain Name",
		path: "metadata.domainName",
		format: "code",
		emptyText: "—"
	},
	{
		name: "enabled",
		label: "Enabled",
		path: "metadata.enabled",
		format: "boolean"
	},
	{
		name: "comment",
		label: "Comment",
		path: "metadata.comment",
		emptyText: "—"
	},
	{
		name: "lastModifiedTime",
		label: "Last Modified",
		path: "metadata.lastModifiedTime",
		format: "datetime"
	}
], KD = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}], qD = "^[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$";
function JD() {
	return {
		cloud: "aws",
		service: "cdn",
		displayName: "CloudFront Distributions",
		fields: [
			{
				name: "originDomainName",
				label: "Origin Domain Name",
				type: "text",
				required: !0,
				span: !0,
				group: "Required",
				description: "A host name only, e.g. my-bucket.s3.amazonaws.com or app.example.com. S3 bucket hosts become an S3 origin, S3 website hosts an HTTP-only custom origin, anything else a custom origin.",
				validation: {
					pattern: qD,
					minLength: 1,
					maxLength: 253,
					message: "Use a host name without scheme, port or path."
				}
			},
			{
				name: "comment",
				label: "Comment",
				type: "text",
				required: !1,
				validation: { maxLength: 128 }
			},
			{
				name: "enabled",
				label: "Enabled",
				type: "select",
				required: !1,
				defaultValue: "false",
				description: "CloudFront refuses to delete an enabled distribution, so it is created disabled unless you choose otherwise.",
				options: [{
					label: "Disabled",
					value: "false"
				}, {
					label: "Enabled",
					value: "true"
				}]
			}
		],
		actions: [
			"list",
			"create",
			"delete",
			"inspect"
		],
		capabilities: {
			resourceActions: [
				{
					name: "list",
					label: "List distributions",
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
					label: "Create distribution",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "delete",
					label: "Delete",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				}
			],
			collectionActions: [{
				name: "list",
				label: "List distribution collections",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}],
			itemActions: [{
				name: "list",
				label: "List invalidations",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}, {
				name: "put",
				label: "Create invalidation",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}]
		},
		filters: KD,
		columns: GD
	};
}
// ../api/src/adapter-aws/AwsCloudFrontAdapter.ts
var YD = new RegExp(qD), XD = /\.s3-website([.-][a-z0-9-]+)?\.amazonaws\.com$/i, ZD = /\.s3([.-][a-z0-9-]+)?\.amazonaws\.com$/i, QD = 100, $D = "658327ea-f89d-4fab-a63d-7e88639e58f6", eO = "invalidations", tO = class {
	cloudfront;
	cloud = "aws";
	service = "cdn";
	documents;
	constructor(e) {
		this.cloudfront = e, this.documents = new nO(e);
	}
	schema() {
		return JD();
	}
	async list(e = {}) {
		let t = e.search?.trim().toLowerCase(), n = (await this.listSummaries()).map(lO);
		return t ? n.filter((e) => cO(e, t)) : n;
	}
	async get(e) {
		let t = await this.cloudfront.send(new dT({ Id: e }));
		return t.Distribution ? uO(t.Distribution) : null;
	}
	async create(e) {
		let t = iO(e.values), n = await this.cloudfront.send(new cT({ DistributionConfig: t }));
		if (!n.Distribution) throw new jE("CloudFront did not return the distribution it created");
		return uO(n.Distribution);
	}
	async delete(e) {
		let t = await this.cloudfront.send(new fT({ Id: e }));
		await this.cloudfront.send(new uT({
			Id: e,
			IfMatch: t.ETag
		}));
	}
	async health() {
		await this.cloudfront.send(new pT({ MaxItems: 1 }));
	}
	async listSummaries() {
		let e = [], t = /* @__PURE__ */ new Set(), n;
		do {
			let r = await this.cloudfront.send(new pT({
				Marker: n,
				MaxItems: QD
			}));
			if (e.push(...r.DistributionList?.Items ?? []), n = r.DistributionList?.IsTruncated ? r.DistributionList.NextMarker : void 0, n) {
				if (t.has(n)) throw new jE("CloudFront ListDistributions repeated a marker");
				t.add(n);
			}
		} while (n);
		return e;
	}
}, nO = class {
	cloudfront;
	constructor(e) {
		this.cloudfront = e;
	}
	async listCollections(e) {
		let t = await this.cloudfront.send(new dT({ Id: e }));
		if (!t.Distribution) throw new q(`Distribution not found: ${e}`);
		return {
			items: [{
				id: eO,
				name: "Invalidations",
				parentId: e,
				createdAt: null,
				metadata: { inProgressInvalidationBatches: t.Distribution.InProgressInvalidationBatches ?? null }
			}],
			nextCursor: null
		};
	}
	async listItems(e, t, n = {}) {
		rO(t);
		let r = (await this.cloudfront.send(new mT({
			DistributionId: e,
			Marker: n.cursor,
			MaxItems: Math.min(n.limit ?? QD, QD)
		}))).InvalidationList;
		return {
			items: (r?.Items ?? []).map(fO),
			nextCursor: r?.IsTruncated ? r.NextMarker ?? null : null
		};
	}
	async putItem(e, t, n) {
		rO(t);
		let r = sO(n.paths), i = await this.cloudfront.send(new lT({
			DistributionId: e,
			InvalidationBatch: {
				CallerReference: WD(),
				Paths: {
					Quantity: r.length,
					Items: r
				}
			}
		}));
		if (!i.Invalidation) throw new jE("CloudFront did not return the invalidation it created");
		return pO(i.Invalidation);
	}
};
function rO(e) {
	if (e !== eO) throw new q(`Unknown CloudFront collection ${e}; use ${eO}`);
}
function iO(e) {
	let t = oO(e.originDomainName), n = typeof e.comment == "string" ? e.comment.trim() : "";
	if (n.length > 128) throw new K("comment must be at most 128 characters.");
	let r = e.enabled === !0 || e.enabled === "true", i = t;
	return {
		CallerReference: WD(),
		Comment: n,
		Enabled: r,
		Origins: {
			Quantity: 1,
			Items: [{
				Id: i,
				DomainName: t,
				...aO(t)
			}]
		},
		DefaultCacheBehavior: {
			TargetOriginId: i,
			ViewerProtocolPolicy: "redirect-to-https",
			CachePolicyId: $D,
			AllowedMethods: {
				Quantity: 2,
				Items: ["GET", "HEAD"]
			},
			Compress: !0
		}
	};
}
function aO(e) {
	return !XD.test(e) && ZD.test(e) ? { S3OriginConfig: { OriginAccessIdentity: "" } } : { CustomOriginConfig: {
		HTTPPort: 80,
		HTTPSPort: 443,
		OriginProtocolPolicy: XD.test(e) ? "http-only" : "match-viewer"
	} };
}
function oO(e) {
	let t = typeof e == "string" ? e.trim() : "";
	if (!t) throw new K("originDomainName is required");
	if (t.length > 253 || !YD.test(t)) throw new K("Use a host name for the origin, without scheme, port or path.");
	return t;
}
function sO(e) {
	let t = Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : [];
	if (t.some((e) => typeof e != "string")) throw new K("Each path must be a string.");
	let n = t.map((e) => e.trim()).filter(Boolean);
	if (n.length === 0) throw new K("paths is required: one or more paths to invalidate.");
	let r = n.find((e) => !e.startsWith("/"));
	if (r) throw new K(`Each path must start with "/": ${r}`);
	return n;
}
function cO(e, t) {
	let { comment: n, domainName: r, aliases: i } = e.metadata;
	return [
		e.name,
		n,
		r,
		...i ?? []
	].some((e) => e?.toLowerCase().includes(t));
}
function lO(e) {
	return dO({
		id: e.Id,
		arn: e.ARN,
		status: e.Status,
		domainName: e.DomainName,
		lastModifiedTime: e.LastModifiedTime,
		enabled: e.Enabled,
		comment: e.Comment,
		aliases: e.Aliases?.Items,
		origins: e.Origins?.Items,
		priceClass: e.PriceClass,
		inProgressInvalidationBatches: void 0
	});
}
function uO(e) {
	let t = e.DistributionConfig;
	return dO({
		id: e.Id,
		arn: e.ARN,
		status: e.Status,
		domainName: e.DomainName,
		lastModifiedTime: e.LastModifiedTime,
		enabled: t?.Enabled,
		comment: t?.Comment,
		aliases: t?.Aliases?.Items,
		origins: t?.Origins?.Items,
		priceClass: t?.PriceClass,
		inProgressInvalidationBatches: e.InProgressInvalidationBatches
	});
}
function dO(e) {
	let t = e.id ?? "";
	return {
		id: t,
		name: t,
		cloud: "aws",
		service: "cdn",
		type: "cloudfront-distribution",
		region: null,
		createdAt: null,
		status: e.status ?? null,
		metadata: {
			provider: "aws",
			arn: e.arn,
			domainName: e.domainName,
			enabled: e.enabled ?? null,
			comment: e.comment ?? "",
			aliases: e.aliases ?? [],
			origins: (e.origins ?? []).map((e) => ({
				id: e.Id,
				domainName: e.DomainName
			})),
			priceClass: e.priceClass ?? null,
			lastModifiedTime: e.lastModifiedTime?.toISOString() ?? null,
			inProgressInvalidationBatches: e.inProgressInvalidationBatches ?? null
		}
	};
}
function fO(e) {
	let t = e.CreateTime?.toISOString() ?? null;
	return {
		id: e.Id ?? "",
		collectionId: eO,
		timestamp: t,
		body: {
			status: e.Status,
			createTime: t
		},
		metadata: {}
	};
}
function pO(e) {
	let t = e.CreateTime?.toISOString() ?? null, n = e.InvalidationBatch;
	return {
		id: e.Id ?? "",
		collectionId: eO,
		timestamp: t,
		body: {
			status: e.Status,
			createTime: t,
			paths: n?.Paths?.Items ?? [],
			callerReference: n?.CallerReference
		},
		metadata: {}
	};
}
var mO = _D(new VD(new ID([new tO(new iT({
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test"
	},
	endpoint: "https://emulator.local.invalid"
}))]), {
	aws: async () => {},
	azure: async () => {},
	gcp: async () => {},
	oci: async () => {}
}, "aws", "us-east-1"));
async function hO(e) {
	return mO.fetch(e);
}
export { hO as handleCloudFrontRequest };
