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
}, it = (e) => Object.assign(et(e), nt(e)), at = (e) => Object.assign(tt(e), rt(e)), ot = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function st(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return Je.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var ct, lt, ut, dt = t((() => {
	ct = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", lt = Object.entries(ct).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), ut = ct.split("");
})), ft, pt = t((() => {
	dt(), ft = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in lt)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= lt[e[r]] << (a - r) * 6, i += 6;
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
})), mt, ht = t((() => {
	mt = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function gt(e) {
	let t;
	t = typeof e == "string" ? mt(e) : e;
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
			i += ut[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var _t = t((() => {
	ht(), dt();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function vt(e, t, n, r) {
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
var yt = t((() => {})), bt, xt = t((() => {
	bt = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function St(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, T[t[0]] + T[t[1]] + T[t[2]] + T[t[3]] + "-" + T[t[4]] + T[t[5]] + "-" + T[t[6]] + T[t[7]] + "-" + T[t[8]] + T[t[9]] + "-" + T[t[10]] + T[t[11]] + T[t[12]] + T[t[13]] + T[t[14]] + T[t[15]];
	};
}
var T, Ct = t((() => {
	T = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), wt, Tt, Et, Dt, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt = t((() => {
	wt = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && zt.warn(Rt(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, Tt = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Et = (e) => {
		let t = wt(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > Tt) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Dt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Ot = (e) => At(e, 16), kt = (e) => At(e, 8), At = (e, t) => {
		let n = Dt(e);
		if (n !== void 0 && jt(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, jt = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Mt = (e) => wt(typeof e == "string" ? Ft(e) : e), Nt = (e) => Et(typeof e == "string" ? Ft(e) : e), Pt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Ft = (e) => {
		let t = e.match(Pt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, It = (e) => Ot(typeof e == "string" ? Ft(e) : e), Lt = (e) => kt(typeof e == "string" ? Ft(e) : e), Rt = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), zt = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function Vt(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Ht[r]}, ${c} ${Ut[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, E, on, sn, cn, ln = t((() => {
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
	], Wt = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), Gt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
		let t = Wt.exec(e);
		if (!t) throw TypeError("Invalid RFC-3339 date-time value");
		let [n, r, i, a, o, s, c, l, u] = t, d = It(cn(r)), f = E(i, "month", 1, 12), p = E(a, "day", 1, 31), m = Zt(d, f, p, {
			hours: o,
			minutes: s,
			seconds: c,
			fractionalMilliseconds: l
		});
		return u.toUpperCase() != "Z" && m.setTime(m.getTime() - sn(u)), m;
	}, Kt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), qt = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), Jt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), Yt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = Kt.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Zt(It(cn(i)), tn(r), E(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = qt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return en(Zt(Qt(i), tn(r), E(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = Jt.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return Zt(It(cn(c)), tn(n), E(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, Xt = (e) => {
		if (e == null) return;
		let t;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") t = Mt(e);
		else if (typeof e == "object" && e.tag === 1) t = e.value;
		else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(t) || t === Infinity || t === -Infinity) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(t * 1e3));
	}, Zt = (e, t, n, r) => {
		let i = t - 1;
		return rn(e, i, n), new Date(Date.UTC(e, i, n, E(r.hours, "hour", 0, 23), E(r.minutes, "minute", 0, 59), E(r.seconds, "seconds", 0, 60), on(r.fractionalMilliseconds)));
	}, Qt = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + It(cn(e));
		return n < t ? n + 100 : n;
	}, $t = 15768e8, en = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > $t ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, tn = (e) => {
		let t = Ut.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, nn = [
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
	], rn = (e, t, n) => {
		let r = nn[t];
		if (t === 1 && an(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${Ut[t]} in ${e}: ${n}`);
	}, an = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), E = (e, t, n, r) => {
		let i = Lt(cn(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, on = (e) => e == null ? 0 : Nt("0." + e) * 1e3, sn = (e) => {
		let t = e[0], n = 1;
		if (t == "+") n = 1;
		else if (t == "-") n = -1;
		else throw TypeError(`Offset direction, ${t}, must be "+" or "-"`);
		let r = Number(e.substring(1, 3)), i = Number(e.substring(4, 6));
		return n * (r * 60 + i) * 60 * 1e3;
	}, cn = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), D, un = t((() => {
	D = function(e) {
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
	}, D.from = (e) => e && typeof e == "object" && (e instanceof D || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? D(String(e)) : D(JSON.stringify(e)), D.fromObject = D.from;
})), dn, O, fn = t((() => {
	dn = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, O = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !dn.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && dn.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function pn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in hn) t[n / 2] = hn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function k(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += mn[e[n]];
	return t;
}
var mn, hn, gn = t((() => {
	mn = {}, hn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), mn[e] = t, hn[t] = e;
	}
})), _n, vn, yn = t((() => {
	_n = typeof TextEncoder == "function" ? new TextEncoder() : null, vn = (e) => {
		if (typeof e == "string") {
			if (_n) return _n.encode(e).byteLength;
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
})), bn, xn = t((() => {
	ht(), bn = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? mt(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Sn(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Cn = t((() => {})), wn, Tn = t((() => {
	wn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), En, Dn = t((() => {
	En = async (e) => void 0;
})), On, kn, An, jn, Mn, Nn, Pn = t((() => {
	On = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), Nn(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!Mn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, kn = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, An = /(\d+\.){3}\d+/, jn = /\.\./, Mn = (e) => kn.test(e) && !An.test(e) && !jn.test(e), Nn = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Fn = t((() => {
	Pn();
})), In, Ln = t((() => {
	In = (e, t, n, r = !1) => {
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
})), Rn = t((() => {
	S();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function zn(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(ge(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await Bn(t, n, r);
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
var Bn, Vn = t((() => {
	Fn(), Ln(), Rn(), Bn = async (e, t, n) => {
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
				r[t] = await In(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await On(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function Hn(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function Un(e) {
	let t = zn(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && Hn(i, "ENDPOINT_OVERRIDE", "N");
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
var Wn = t((() => {
	S(), Vn();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function Gn(e) {
	let t = Un(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), qn);
	} });
}
var Kn, qn, Jn = t((() => {
	Wn(), Kn = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, qn = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: Kn.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function Yn(e) {
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
var Xn = t((() => {
	S(), Rn();
})), Zn, Qn = t((() => {
	Zn = class e {
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
})), $n, er = t((() => {
	$n = class {
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
})), A, tr = t((() => {
	A = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), nr = t((() => {
	tr();
})), rr, ir = t((() => {
	rr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function ar(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${ar(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(ar).join(", ")})` : JSON.stringify(e, null, 2);
}
var or = t((() => {})), sr = t((() => {
	ir(), or();
})), cr, lr = t((() => {
	cr = {};
})), ur, dr = t((() => {
	ur = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function fr(...e) {
	for (let t of e) if (t != null) return t;
}
var pr = t((() => {})), mr, hr = t((() => {
	nr(), mr = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new A(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new A(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), gr, _r = t((() => {
	nr(), hr(), gr = (e, t) => mr(t).reduce((n, r) => {
		if (typeof n != "object") throw new A(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), vr, yr = t((() => {
	vr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function br(e, t, n) {
	return e ? t : n;
}
var xr = t((() => {})), Sr, Cr = t((() => {
	Sr = (e) => !e;
})), wr, Tr, Er = t((() => {
	wr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), Tr = (e) => wr.test(e) || e.startsWith("[") && e.endsWith("]");
})), Dr, Or, kr = t((() => {
	_(), Er(), Dr = {
		[u.HTTP]: 80,
		[u.HTTPS]: 443
	}, Or = (e) => {
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
		let l = Tr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Dr[c]}`) || typeof e == "string" && e.includes(`${r}:${Dr[c]}`) ? `:${Dr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Ar(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var jr = t((() => {})), Mr, Nr = t((() => {
	Mr = (e, t) => e === t;
})), Pr, Fr = t((() => {
	Pr = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Ir, Lr = t((() => {
	Ir = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Rr = t((() => {
	dr(), pr(), _r(), yr(), S(), xr(), Cr(), kr(), jr(), Nr(), Fr(), Lr();
})), zr, Br = t((() => {
	Rr(), zr = {
		booleanEquals: ur,
		coalesce: fr,
		getAttr: gr,
		isSet: vr,
		isValidHostLabel: se,
		ite: br,
		not: Sr,
		parseURL: Or,
		split: Ar,
		stringEquals: Mr,
		substring: Pr,
		uriEncode: Ir
	};
})), Vr, Hr = t((() => {
	Rr(), Vr = (e, t) => {
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
				n.push(gr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), Ur, Wr = t((() => {
	Ur = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), Gr, Kr, qr, Jr = t((() => {
	nr(), lr(), Br(), Hr(), Wr(), Gr = (e, t, n) => {
		if (typeof e == "string") return Vr(e, n);
		if (e.fn) return qr.callFunction(e, n);
		if (e.ref) return Ur(e, n);
		throw new A(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, Kr = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = qr.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = cr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = zr[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, qr = {
		evaluateExpression: Gr,
		callFunction: Kr
	};
})), Yr = t((() => {
	Jr();
})), Xr, Zr = t((() => {
	sr(), nr(), Yr(), Xr = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new A(`'${n}' is already defined in Reference Record.`);
		let r = Kr(e, t);
		t.logger?.debug?.(`${rr} evaluateCondition: ${ar(e)} = ${ar(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), Qr, $r = t((() => {
	nr(), Jr(), Qr = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = Gr(e, "Header value entry", t);
		if (typeof r != "string") throw new A(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), ei, ti, ni, ri = t((() => {
	nr(), Hr(), ei = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = ni.getEndpointProperty(r, t), e), {}), ti = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => ti(e, t));
		switch (typeof e) {
			case "string": return Vr(e, t);
			case "object":
				if (e === null) throw new A(`Unexpected endpoint property: ${e}`);
				return ni.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new A(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, ni = {
		getEndpointProperty: ti,
		getEndpointProperties: ei
	};
})), ii, ai = t((() => {
	nr(), Jr(), ii = (e, t) => {
		let n = Gr(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new A(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), oi, si, ci = t((() => {
	nr(), Zr(), Jr(), $r(), ri(), ai(), oi = 1e8, si = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < oi;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = Xr({
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
		if (o >= oi) {
			let e = i[o - oi];
			if (e[0] === -1) {
				let [, t] = e;
				throw new A(Gr(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: ii(t, c),
				properties: ei(n, c),
				headers: Qr(r ?? {}, c)
			};
		}
		throw new A("No matching endpoint.");
	};
})), li, ui, di = t((() => {
	Dn(), Vn(), Wn(), Jn(), Xn(), S(), Qn(), er(), ci(), Er(), lr(), sr(), nr(), Zr(), $r(), ri(), ai(), Jr(), Rn(), li = Yn(En), Un(En), ui = Gn(En);
})), fi, pi = t((() => {
	fi = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function mi(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function hi(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Sn(t, r);
}
var gi, _i = t((() => {
	Cn(), pi(), gi = async (e) => fi(e) ? mi(e) : hi(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function vi(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var yi = t((() => {})), bi, xi, Si, Ci, j = t((() => {
	pt(), _t(), yt(), ht(), xt(), Ct(), ln(), un(), Bt(), fn(), gn(), yn(), xn(), Cn(), Tn(), S(), di(), pi(), _i(), yi(), bi = class extends vt(bt, mt, gt, ft) {}, xi = (e) => crypto.getRandomValues(e), Si = St(xi), Ci = Si;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
j();
var wi = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return bi.mutate(e);
	if (!e) return bi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return bi.mutate(await n);
}, Ti = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Ei, Di, Oi, ki = t((() => {
	Ei = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Ei[e] = t >>> 0;
	}
	Di = 4294967295, Oi = class {
		digestLength = 4;
		checksum = Di;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Ei[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Di) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Di;
		}
	};
})), M, Ai, ji, Mi, Ni, Pi, Fi = t((() => {
	j(), M = 64, Ai = 32, ji = 2 ** 53 - 1, Mi = class e {
		digestLength = Ai;
		state = Int32Array.from(Ni);
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
				for (let e = 0; e < M; ++e) a[e] = 54 ^ n[e], a[e + M] = 92 ^ n[e];
				r.update(a.subarray(0, M)), i.update(a.subarray(M));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = bn(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > ji) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === M && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(Ni), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % M >= 56) {
				for (let e = n; e < M; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(Ai);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = bn(t);
			if (n.byteLength > M) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(M);
				return i.set(r), i;
			}
			if (n.byteLength < M) {
				let e = new Uint8Array(M);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < M; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Pi[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, Ni = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Pi = new Int32Array([
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
})), Ii, Li, Ri, zi, Bi, Vi, Hi = t((() => {
	j(), Fi(), {digest: Ii, sign: Li, importKey: Ri} = globalThis?.crypto?.subtle ?? {}, zi = typeof Ii == "function" && typeof Li == "function" && typeof Ri == "function" ? globalThis.crypto.subtle : void 0, Bi = 8388608, Vi = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = bn(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= Bi && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Sn(this.pending);
			if (zi) {
				if (this.secret) {
					this.finished = !0;
					let t = await zi.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await zi.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await zi.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Mi(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Mi(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), Ui = t((() => {
	j(), ki(), Fi(), Hi();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function Wi(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var Gi, Ki = t((() => {
	j(), Gi = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && Wi(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && Wi(e), parseInt(k(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), qi, Ji, Yi, Xi, Zi, Qi, $i, ea, ta, na, ra, ia, aa, oa = t((() => {
	S(), j(), Ki(), qi = class {
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
					if (e.value.byteLength > aa) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${aa} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > aa) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${aa} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(Gi.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!ia.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(pn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: Yi,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: Yi,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: Xi,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: Zi,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: Qi,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: $i,
							value: new Gi(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ea,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ta,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: na,
							value: new Date(new Gi(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: ra,
							value: `${k(o.subarray(0, 4))}-${k(o.subarray(4, 6))}-${k(o.subarray(6, 8))}-${k(o.subarray(8, 10))}-${k(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(Ji ||= {}), Yi = "boolean", Xi = "byte", Zi = "short", Qi = "integer", $i = "long", ea = "binary", ta = "string", na = "timestamp", ra = "uuid", ia = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, aa = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function sa({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < da) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(ca, !1), o = r.getUint32(la, !1), s = r.getUint32(e - ua, !1), c = new Oi();
	if (c.update(new Uint8Array(n, t, la)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + la, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + la + ua, a),
		body: new Uint8Array(n, t + la + ua + a, i - a - 16)
	};
}
var ca, la, ua, da, fa = t((() => {
	Ui(), ca = 4, la = 8, ua = 4, da = 16;
})), pa, ma = t((() => {
	Ui(), oa(), fa(), pa = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new qi(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Oi();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = sa(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), ha, ga = t((() => {
	ha = class {
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
})), _a, va = t((() => {
	_a = class {
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
})), ya, ba = t((() => {
	ya = class {
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
})), xa, Sa = t((() => {
	xa = class {
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
function Ca(e) {
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
var wa = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ta(e, t) {
	let n = Ea(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Ea(e, t) {
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
var Da = t((() => {})), Oa, ka, Aa = t((() => {
	ma(), ga(), va(), ba(), Sa(), wa(), Da(), Oa = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new pa(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Ca(e);
			return new ya({
				messageStream: new ha({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Ea(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new _a({
				messageStream: new xa({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, ka = (e) => new Oa(e);
})), ja, Ma, Na = t((() => {
	ja = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), Ma = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Pa, Fa, Ia, La = t((() => {
	Aa(), Na(), Pa = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Oa({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Fa(e) ? ja(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Ma(n) : n;
		}
	}, Fa = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Ia = (e) => new Pa(e);
})), Ra, za = t((() => {
	Ra = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), Ba, Va = t((() => {
	S(), w(), j(), Ba = class {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? bt)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? mt)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), Ha = /* @__PURE__ */ n({
	EventStreamCodec: () => pa,
	EventStreamMarshaller: () => Pa,
	EventStreamSerde: () => Ba,
	HeaderMarshaller: () => qi,
	Int64: () => Gi,
	MessageDecoderStream: () => ha,
	MessageEncoderStream: () => _a,
	SmithyMessageDecoderStream: () => ya,
	SmithyMessageEncoderStream: () => xa,
	UniversalEventStreamMarshaller: () => Oa,
	eventStreamSerdeProvider: () => Ia,
	getChunkedStream: () => Ca,
	getMessageUnmarshaller: () => Ea,
	getUnmarshalledStream: () => Ta,
	iterableToReadableStream: () => Ma,
	readableStreamToIterable: () => ja,
	resolveEventStreamSerdeConfig: () => Ra,
	universalEventStreamSerdeProvider: () => ka
}), Ua = t((() => {
	ma(), oa(), Ki(), ga(), va(), ba(), Sa(), La(), Na(), Aa(), wa(), Da(), za(), Va();
}));
S(), w();
var Wa = class extends Ti {
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (Ua(), Ha));
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
S(), w();
var Ga = class extends Wa {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = C.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new b({
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
		let r = this.deserializer, i = C.of(e.output), a = {};
		if (this.isErrorResponse(n.statusCode)) {
			let i = await wi(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!y(n.headers, e)) continue;
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
			let e = await wi(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function Ka(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/protocol-http/extensions/httpExtensionConfiguration.js
var qa = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), Ja = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
S();
var Ya = "content-length";
function Xa(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (b.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(Ya) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[Ya]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var Za = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, Qa = (e) => ({ applyToStack: (t) => {
	t.add(Xa(e.bodyLengthChecker), Za);
} }), $a = (e) => encodeURIComponent(e).replace(/[!'()*]/g, eo), eo = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function to(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = $a(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${$a(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${$a(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var no = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, ro = class {
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
}, io;
function ao() {
	if (io === void 0) try {
		if (typeof Buffer != "function") io = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			io = typeof e == "object" && !!e;
		}
	} catch {
		io = !1;
	}
	return io;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
j();
function oo(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? co(e, t) ? t : new O(e, "bigDecimal") : so(e) ? new O(e, "bigDecimal") : /[eE]/.test(e) ? uo(e) : BigInt(e);
	}
	return t;
}
function so(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function co(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return lo(e) === lo(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === lo(r) : !1;
}
function lo(e) {
	let t = e.startsWith("-"), n = t ? e.slice(1) : e, r = n.search(/[eE]/), i;
	if (r === -1) i = n;
	else {
		let e = parseInt(n.slice(r + 1), 10), t = n.slice(0, r), a = t.indexOf("."), o, s;
		a === -1 ? (o = t, s = t.length) : (o = t.slice(0, a) + t.slice(a + 1), s = a), o = o.replace(/0+$/, "") || "0";
		let c = s + e;
		i = o === "0" ? "0" : c <= 0 ? "0." + "0".repeat(-c) + o : c >= o.length ? o + "0".repeat(c - o.length) : o.slice(0, c) + "." + o.slice(c);
	}
	return i.includes(".") && (i = i.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")), (t ? "-" : "") + i;
}
function uo(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
w();
var fo = Symbol.for("@aws-sdk/reviver");
function po(e) {
	let t = C.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (fo in n) return n[fo];
		let e = mo(t, /* @__PURE__ */ new Set());
		return n[fo] = e, e;
	}
	return mo(t, /* @__PURE__ */ new Set());
}
function mo(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (mo(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (mo(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
j();
var ho = (e, t) => wi(e, t).then((e) => (t?.utf8Encoder ?? bt)(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function go(e, t, n) {
	let r;
	if (ao() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await wi(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await ho(e, t), r.length === 0) return {};
	let i = n && po(n) ? oo : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var _o = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), vo = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, yo = (e, t, n = !1) => bo(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), bo = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = _o(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return vo(e[n]);
			break;
		case "code":
			let r = _o(t ?? {}, "code");
			if (r && t[r] !== void 0) return vo(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return vo(t.__type);
	}
};
w(), j(), S();
var xo = class extends no {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = po(e) ? oo : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && ao()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await go(t, this.serdeContext, e);
		return this._read(e, r);
	}
	readObject(e, t) {
		return this._read(e, t);
	}
	_read(e, t) {
		let n = typeof t == "object" && !!t, r = C.of(e);
		if (n) {
			if (r.isStructSchema()) return this._readStruct(r, t);
			if (Array.isArray(t) && r.isListSchema()) {
				let e = r.getValueSchema();
				if (this.needsTransform(e)) for (let n = 0; n < t.length; ++n) t[n] = this._read(e, t[n]);
				return t;
			}
			if (r.isMapSchema()) {
				let e = r.getValueSchema(), n = t;
				if (this.needsTransform(e)) for (let t in n) y(n, t) && (t === "__proto__" && vi(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return ft(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? D.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (Ka(r, this.settings)) {
			case 5: return Gt(t);
			case 6: return Yt(t);
			case 7: return Xt(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (r.isBigIntegerSchema() && (typeof t == "number" || typeof t == "string")) return BigInt(t);
		if (r.isBigDecimalSchema() && t != null) {
			if (t instanceof O) return t;
			let e = t;
			return e.type === "bigDecimal" && "string" in e ? new O(e.string, e.type) : new O(String(t), "bigDecimal");
		}
		if (r.isNumericSchema() && typeof t == "string") {
			switch (t) {
				case "Infinity": return Infinity;
				case "-Infinity": return -Infinity;
				case "NaN": return NaN;
			}
			return t;
		}
		if (r.isDocumentSchema() && n) {
			if (Array.isArray(t)) for (let e = 0; e < t.length; ++e) {
				let n = t[e];
				n instanceof O || (t[e] = this._read(r, n));
			}
			else {
				let e = t;
				for (let t in e) {
					if (!y(e, t)) continue;
					t === "__proto__" && vi(e);
					let n = e[t];
					n instanceof O || (e[t] = this._read(r, n));
				}
			}
		}
		return t;
	}
	_readStruct(e, t) {
		let n = e.isUnionSchema(), r = {}, i, a = typeof t.__type == "string", { jsonName: o } = this.settings;
		o && a && (i = {});
		let s;
		n && (s = new ro(t, r));
		for (let [c, l] of e.structIterator()) {
			let e = c;
			o && (e = l.getMergedTraits().jsonName ?? e, a && (i[e] = c)), n && s.mark(e), t[e] != null && (r[c] = this._read(l, t[e]));
		}
		if (n) s.writeUnknown();
		else if (a) for (let e in t) {
			if (!y(t, e)) continue;
			let n = t[e], a = o ? i[e] ?? e : e;
			a in r || (r[a] = n);
		}
		return r;
	}
	needsTransform(e) {
		return !!(e.isBlobSchema() || e.isTimestampSchema() || e.isBigIntegerSchema() || e.isBigDecimalSchema() || e.isNumericSchema() || e.isDocumentSchema() || e.isStructSchema() || e.isListSchema() || e.isMapSchema() || e.isStringSchema() && e.getMergedTraits().mediaType);
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/codec-v2/JsonBytesStringAdapter.js
j();
var So = class e extends Uint8Array {
	string = null;
	static allocUnsafe(t) {
		if (typeof Buffer == "function") {
			let n = Buffer.allocUnsafe(t);
			return new e(n.buffer, n.byteOffset, n.byteLength);
		}
		return new e(t);
	}
	toString() {
		return this.s();
	}
	valueOf() {
		return this.s();
	}
	includes(e, t) {
		return typeof e == "string" ? this.s().includes(e, t) : Uint8Array.prototype.includes.call(this, e, t);
	}
	indexOf(e, t) {
		return typeof e == "string" ? this.s().indexOf(e, t) : Uint8Array.prototype.indexOf.call(this, e, t);
	}
	lastIndexOf(e, t) {
		if (typeof e == "string") return this.s().lastIndexOf(e, t);
		let n = Uint8Array.prototype.lastIndexOf;
		return t === void 0 ? n.call(this, e) : n.call(this, e, t);
	}
	startsWith(e, t) {
		return this.s().startsWith(e, t);
	}
	endsWith(e, t) {
		return this.s().endsWith(e, t);
	}
	match(e) {
		return this.s().match(e);
	}
	replace(e, t) {
		return this.s().replace(e, t);
	}
	search(e) {
		return this.s().search(e);
	}
	split(e, t) {
		return this.s().split(e, t);
	}
	substring(e, t) {
		return this.s().substring(e, t);
	}
	trim() {
		return this.s().trim();
	}
	trimStart() {
		return this.s().trimStart();
	}
	trimEnd() {
		return this.s().trimEnd();
	}
	charAt(e) {
		return this.s().charAt(e);
	}
	charCodeAt(e) {
		return this.s().charCodeAt(e);
	}
	padStart(e, t) {
		return this.s().padStart(e, t);
	}
	padEnd(e, t) {
		return this.s().padEnd(e, t);
	}
	repeat(e) {
		return this.s().repeat(e);
	}
	toUpperCase() {
		return this.s().toUpperCase();
	}
	toLowerCase() {
		return this.s().toLowerCase();
	}
	s() {
		if (this.string == null) {
			let e = Date.now();
			e > Co + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), Co = e), this.string = bt(this);
		}
		return this.string;
	}
}, Co = 0;
w(), j(), S();
var wo = new TextEncoder(), To = 123, Eo = 125, Do = 91, Oo = 93, ko = 34, Ao = 58, jo = 44, Mo = 92, No = new Uint8Array([
	116,
	114,
	117,
	101
]), Po = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), Fo = new Uint8Array([
	110,
	117,
	108,
	108
]), N = Array(128).fill(null);
N[8] = "b", N[9] = "t", N[10] = "n", N[12] = "f", N[13] = "r", N[34] = "\"", N[92] = "\\";
for (let e = 0; e < 32; e++) N[e] === null && (N[e] = "u00" + e.toString(16).padStart(2, "0"));
var Io = 2048;
function Lo(e) {
	return So.allocUnsafe(e);
}
var Ro = class e extends no {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = Lo(Io);
	}
	write(e, t) {
		this.i = 0, this.rawValue = t, this.rootSchema = C.of(e), this.passthrough = this.rootSchema.isBlobSchema() || this.rootSchema.isStringSchema(), this.passthrough || this.writeValue(this.rootSchema, t, void 0);
	}
	writeDiscriminatedDocument(e, t) {
		this.i = 0, this.rootSchema = C.of(e);
		let n = this.rootSchema;
		if (n.isStructSchema() && typeof t == "object" && t) {
			this.writeValue(n, t, void 0);
			let e = `"__type":"${n.getName(!0) ?? "Unknown"}",`, r = e.length;
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), wo.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = Lo(Io), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = Lo(r);
			i.set(this.json), this.json = i;
		}
	}
	writeAscii(e) {
		let t = e.length;
		this.ensure(t);
		let { i: n, json: r } = this;
		for (let i = 0; i < t; ++i) r[n] = e.charCodeAt(i), n += 1;
		this.i = n;
	}
	writeAsciiQuoted(e) {
		let t = e.length;
		this.ensure(t + 4);
		let { json: n, i: r } = this;
		n[r++] = ko;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = ko, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = ko;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = N[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = Mo;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = wo.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = ko;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = Mo, t[n++] = 117;
		let r = e.toString(16).padStart(4, "0");
		for (let e = 0; e < 4; ++e) t[n++] = r.charCodeAt(e);
		this.i = n;
	}
	static B64 = (() => {
		let e = /* @__PURE__ */ new Uint8Array(64);
		for (let t = 0; t < 64; ++t) e[t] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(t);
		return e;
	})();
	writeBase64(t) {
		let n = Math.ceil(t.length / 3) * 4;
		this.ensure(n + 2);
		let r = this.json, i = e.B64, a = this.i;
		r[a++] = ko;
		let o = t.length, s = o % 3, c = o - s;
		for (let e = 0; e < c; e += 3) {
			let n = t[e], o = t[e + 1], s = t[e + 2];
			r[a++] = i[n >> 2], r[a++] = i[(n & 3) << 4 | o >> 4], r[a++] = i[(o & 15) << 2 | s >> 6], r[a++] = i[s & 63];
		}
		if (s === 2) {
			let e = t[c], n = t[c + 1];
			r[a++] = i[e >> 2], r[a++] = i[(e & 3) << 4 | n >> 4], r[a++] = i[(n & 15) << 2], r[a++] = 61;
		} else if (s === 1) {
			let e = t[c];
			r[a++] = i[e >> 2], r[a++] = i[(e & 3) << 4], r[a++] = 61, r[a++] = 61;
		}
		r[a++] = ko, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && C.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(Ci());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(Fo, this.i), this.i += 4;
			return;
		}
		let r = C.of(e), i = typeof t == "object";
		if (r.isStringSchema()) {
			let e = r.getMergedTraits().mediaType;
			if (e && (e === "application/json" || e.endsWith("+json"))) {
				this.writeJsonString(D.from(t).toString());
				return;
			}
		}
		if (this.settings.bigNumberAsString && t != null && (r.isBigIntegerSchema() || r.isBigDecimalSchema())) {
			let e = t instanceof O ? t.string : String(t);
			this.writeAsciiQuoted(e);
		} else if (i) {
			if (r.isStructSchema()) {
				this.writeStruct(r, t);
				return;
			}
			if (Array.isArray(t) && (r.isListSchema() || r.isDocumentSchema())) {
				this.writeList(r, t, r.isDocumentSchema());
				return;
			}
			if (r.isMapSchema()) {
				this.writeMap(r, t, !1);
				return;
			}
			if (t instanceof Uint8Array && (r.isBlobSchema() || r.isDocumentSchema())) {
				this.writeBase64(t);
				return;
			}
			if (t instanceof Date && (r.isTimestampSchema() || r.isDocumentSchema())) {
				this.writeTimestamp(r, t);
				return;
			}
			if (t instanceof O) {
				this.writeAscii(t.string);
				return;
			}
			if (r.isDocumentSchema()) {
				Array.isArray(t) ? this.writeList(r, t, !0) : this.writeMap(r, t, !0);
				return;
			}
			let e = JSON.stringify(t);
			this.writeAscii(e);
		} else if (typeof t == "string") {
			if (r.isBlobSchema()) {
				let e = (this.serdeContext?.base64Encoder ?? gt)(t);
				this.writeAsciiQuoted(e);
				return;
			}
			this.writeJsonString(t);
		} else if (typeof t == "number") {
			if (Math.abs(t) === Infinity || Number.isNaN(t)) {
				this.writeAsciiQuoted(String(t));
				return;
			}
			let e = String(t);
			this.writeAscii(e);
		} else if (typeof t == "boolean") {
			this.ensure(5);
			let { i: e, json: n } = this;
			t ? (n.set(No, e), e += 4) : (n.set(Po, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = To;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = jo), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Ao, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Ao, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = jo), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Ao, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = Eo;
	}
	writeList(e, t, n) {
		let r = !!e.getMergedTraits().sparse, i = e.getValueSchema();
		if (!n && (i.isStringSchema() || i.isNumericSchema() || i.isBooleanSchema())) {
			let e = !1;
			for (let n = 0; n < t.length; ++n) {
				let i = t[n];
				if (Number.isNaN(i) || i === Infinity || i === -Infinity || i == null && !r) {
					e = !0;
					break;
				}
			}
			let n;
			if (!e) n = JSON.stringify(t);
			else {
				let e = [];
				for (let n = 0; n < t.length; ++n) {
					let i = t[n];
					(i != null || r) && (Number.isNaN(i) || i === Infinity || i === -Infinity ? e.push(String(i)) : e.push(i));
				}
				n = JSON.stringify(e);
			}
			this.ensure(n.length * 3), this.i += wo.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Do;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = jo), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = Oo;
	}
	writeMap(e, t, n) {
		let r = !!e.getMergedTraits().sparse, i = e.getValueSchema();
		if (!n && (i.isStringSchema() || i.isNumericSchema() || i.isBooleanSchema())) {
			let e;
			for (let n in t) {
				if (!y(t, n)) continue;
				let i = t[n];
				Number.isNaN(i) || i === Infinity || i === -Infinity ? ((e ??= {})[n] = i, t[n] = String(i)) : i === null && !r && ((e ??= {})[n] = null, t[n] = void 0);
			}
			let n = JSON.stringify(t);
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += wo.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = To;
		let a = !0;
		for (let e in t) {
			if (!y(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = jo), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Ao, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = Eo;
	}
	writeTimestamp(e, t) {
		switch (Ka(e, this.settings)) {
			case 5: {
				let e = t.toISOString().replace(".000Z", "Z");
				this.writeAsciiQuoted(e);
				return;
			}
			case 6:
				this.writeAsciiQuoted(Vt(t));
				return;
			case 7: {
				let e = String(t.getTime() / 1e3);
				this.writeAscii(e);
				return;
			}
			default: {
				let e = String(t.getTime() / 1e3);
				this.writeAscii(e);
				return;
			}
		}
	}
}, zo = class extends no {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new Ro(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new xo(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
}, Bo = [
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
], Vo = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], Ho = [
	500,
	502,
	503,
	504
], Uo = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], Wo = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], Go = (e) => e?.$retryable !== void 0, Ko = (e) => e.$metadata?.clockSkewCorrected, qo = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, Jo = (e) => e.$metadata?.httpStatusCode === 429 || Bo.includes(e.name) || e.$retryable?.throttling == 1, Yo = (e, t = 0) => e?.name !== "AbortError" && (Go(e) || Ko(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || Vo.includes(e.name) || Uo.includes(e?.code || "") || Wo.includes(e?.code || "") || Ho.includes(e.$metadata?.httpStatusCode || 0) || qo(e) || Zo(e) || e.cause !== void 0 && t <= 10 && Yo(e.cause, t + 1)), Xo = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !Yo(e);
	}
	return !1;
};
function Zo(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var Qo = 2e4, $o = "amz-sdk-invocation-id", es = "amz-sdk-request";
S(), ae(), j();
function ts(e, t) {
	if (ie.isInstance(e)) for (let n in e.headers) {
		if (!y(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (Yt(r).getTime() - Date.now()) / 1e3;
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
var ns = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
re(), j();
function rs(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (as(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = b.isInstance(d);
			for (f && (d.headers[$o] = Si());;) try {
				f && (d.headers[es] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = os(n, t.logger);
				if (c = ns(n), f && e(d)) throw (r.logger instanceof ot ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await is(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var is = (e) => new Promise((t) => setTimeout(t, e)), as = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, os = (e, t) => {
	let n = {
		error: e,
		errorType: ss(e)
	}, r = ts(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, ss = (e) => Jo(e) ? "THROTTLING" : Yo(e) ? "TRANSIENT" : Xo(e) ? "SERVER_ERROR" : "CLIENT_ERROR", cs = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function ls(e) {
	let t = rs(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), cs);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var us = class e {
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
		if (n?.errorType === "THROTTLING" || Jo(n?.error ?? e)) {
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
}, P = class e {
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
}, ds = class {
	x = P.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, Qo);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, fs = class {
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
		return Math.min(Qo, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, ps;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(ps ||= {});
var ms = ps.STANDARD, hs = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, gs = class {
	mode = ps.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= P.delay(), this.retryBackoffStrategy ??= new ds();
	}
	async acquireInitialRetryToken(e) {
		return new fs(P.delay(), 0, void 0, P.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? P.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new fs(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = P.v2026 && r === hs.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : hs.incompatible, a = r < n ? 0 : hs.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : hs.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === P.modifiedCostType() ? P.throttlingCost() : P.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, _s = class {
	mode = ps.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new us(), this.standardRetryStrategy = t ? new gs({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new gs(e);
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
var vs = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = P.delay() } = t ?? {}, o = x(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await x(r)() === ps.ADAPTIVE ? new _s(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new gs({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, ys = ls(i);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
P.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function F(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
re();
function bs(e) {
	return e;
}
var xs = (e) => (t) => async (n) => {
	if (!b.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, Ss = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, Cs = (e) => ({ applyToStack: (t) => {
	t.add(xs(e), Ss);
} }), ws = () => (e, t) => async (n) => {
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
}, Ts = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, Es = (e) => ({ applyToStack: (e) => {
	e.add(ws(), Ts);
} }), Ds = (e) => ({ applyToStack: (e) => {} }), Os = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
S();
function ks(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var As = (e, t) => (n, r) => async (i) => {
	let a = Os(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = ks(e.httpAuthSchemes), s = v(r), c = [];
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
}, js = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, Ms = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(As(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), js);
} });
re(), S();
var Ns = (e) => (e) => {
	throw e;
}, Ps = (e, t) => {}, Fs = (e) => (e, t) => async (n) => {
	if (!b.isInstance(n.request)) return e(n);
	let r = v(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Ns)(i));
	return (o.successHandler || Ps)(s.response, i), s;
}, Is = {
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
}, Ls = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Fs(e), Is);
} }), Rs = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
S();
var zs = class {
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
}, Bs = ((e) => function(t) {
	return Vs(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), Vs = (e) => e.expiration !== void 0, Hs = (e, t, n) => {
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
function Us(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Ws(e) {
	let t = Rs(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!Us(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var Gs = {
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
}, Ks = "", qs = (e) => {
	let { partitions: t } = Gs;
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
}, Js = () => Ks, Ys = /\d{12}\.ddb/;
async function Xs(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && F(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case ps.ADAPTIVE:
				F(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case ps.STANDARD: F(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(Ys) && F(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				F(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				F(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": F(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && F(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) F(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Zs = "user-agent", Qs = "x-amz-user-agent", $s = /[^!$%&'*+\-.^_`|~\w]/g, ec = /[^!$%&'*+\-.^_`|~\w#]/g, tc = 1024;
function nc(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= tc) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
re();
var rc = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!b.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(ic) || [], s = (await e.defaultUserAgentProvider()).map(ic);
	await Xs(n, e, r);
	let c = n;
	s.push(`m/${nc(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(ic) || [], u = await e.userAgentAppId();
	u && s.push(ic(["app", `${u}`]));
	let d = Js(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Qs] = f : (p && (a[Qs] = a["x-amz-user-agent"] ? `${a[Zs]} ${p}` : p), a[Zs] = f), t({
		...r,
		request: i
	});
}, ic = (e) => {
	let t = e[0].split("/").map((e) => e.replace($s, "-")).join("/"), n = e[1]?.replace(ec, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, ac = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, oc = (e) => ({ applyToStack: (t) => {
	t.add(rc(e), ac);
} }), sc = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? cc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? cc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, cc = {
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
di(), Er();
var lc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!lc(t)) return !1;
		return !0;
	}
	return !(!se(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || Tr(e));
}, uc = ":", dc = "/", fc = (e) => {
	let t = e.split(uc);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(uc) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(dc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
di();
var pc = {
	isVirtualHostableS3Bucket: lc,
	parseArn: fc,
	partition: qs
};
cr.aws = pc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var mc = (e, t, n) => {
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
var hc = /* @__PURE__ */ new Set(), gc = (e, t = se) => {
	if (!hc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else hc.add(e);
}, _c = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), vc = (e) => _c(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, yc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = vc(typeof t == "function" ? await t() : t);
			return gc(e), e;
		},
		useFipsEndpoint: async () => _c(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, bc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], xc = ({ defaultsMode: e } = {}) => mc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(Sc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${bc.join(", ")}, got ${t}`);
	}
}), Sc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, Cc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), wc = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ae();
var Tc = (e) => ie.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, Ec = (e) => ie.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, Dc = (e) => new Date(Date.now() + e), Oc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
re(), _();
var kc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Ac = (e) => e.context?.[h]?.eventStream?.output === !0, jc = async (e) => {
	let t = kc("context", e.context), n = kc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await kc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, Mc = class {
	async sign(e, t, n) {
		if (!b.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await jc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Ac(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Dc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? Tc(n.$response);
				if (t) {
					let r = kc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = Ec(n.$response), s = Oc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = Tc(e);
		if (n) {
			let r = kc("config", t.config), i = t._requestSentAt, a = Ec(e);
			r.systemClockOffset = Oc(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
j();
var Nc = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!y(e, n)) continue;
			let r = mt(n);
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
				let o = mt(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(Ic.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!Fc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(pn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, Pc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(Pc ||= {});
var Fc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Ic = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && Lc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && Lc(e), parseInt(k(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function Lc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var Rc = "X-Amz-Algorithm", zc = "X-Amz-Credential", Bc = "X-Amz-Date", Vc = "X-Amz-SignedHeaders", Hc = "X-Amz-Expires", Uc = "X-Amz-Signature", Wc = "X-Amz-Security-Token", Gc = "authorization", Kc = Bc.toLowerCase(), qc = [
	Gc,
	Kc,
	"date"
];
Uc.toLowerCase();
var Jc = "x-amz-content-sha256", Yc = Wc.toLowerCase(), Xc = {
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
}, Zc = /^proxy-/, Qc = /^sec-/, $c = "AWS4-HMAC-SHA256", el = "AWS4-HMAC-SHA256-PAYLOAD", tl = "UNSIGNED-PAYLOAD", nl = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
j();
var rl = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!y(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = $a(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${$a(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${$a(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, il = (e) => al(e).toISOString().replace(/\.\d{3}Z$/, "Z"), al = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
de(), j();
var ol = class {
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
${rl(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(bn(n)), `${r}
${e}
${t}
${k(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return $a(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = il(e).replace(/[-:]/g, "");
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
j();
var sl = {}, cl = [], ll = (e, t, n) => `${e}/${t}/${n}/${nl}`, ul = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${k(await dl(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in sl) return sl[a];
	for (cl.push(a); cl.length > 50;) delete sl[cl.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		nl
	]) o = await dl(e, o, t);
	return sl[a] = o;
}, dl = (e, t, n) => {
	let r = new e(t);
	return r.update(bn(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
j();
var fl = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(y(Xc, a) || t?.has(a) || Zc.test(a) || Qc.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && vi(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
j();
var pl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (y(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || wn(t)) {
		let e = new n();
		return e.update(bn(t)), k(await e.digest());
	}
	return tl;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
j();
var ml = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (y(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
j(), re();
var hl = (e, t = {}) => {
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
j(), re();
var gl = (e) => {
	e = b.clone(e);
	for (let t in e.headers) y(e.headers, t) && qc.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
j();
var _l = class extends ol {
	headerFormatter = new Nc();
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
		let m = ll(p, d, l ?? this.service), h = hl(gl(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[Wc] = u.sessionToken), h.query[Rc] = $c, h.query[zc] = `${u.accessKeyId}/${m}`, h.query[Bc] = f, h.query[Hc] = r.toString(10);
		let g = fl(h, i, o);
		return h.query[Vc] = this.getCanonicalHeaderList(g), h.query[Uc] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await pl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = ll(c, s, a ?? this.service), d = await pl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			el,
			l,
			u,
			r,
			k(await f.digest()),
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
		return c.update(bn(e)), k(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = gl(e), { longDate: l, shortDate: u } = this.formatDate(t), d = ll(u, s, a ?? this.service);
		c.headers[Kc] = l, o.sessionToken && (c.headers[Yc] = o.sessionToken);
		let f = await pl(c, this.sha256);
		!ml("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[Jc] = f);
		let p = fl(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[Gc] = `${$c} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, $c), a = new this.sha256(await n);
		return a.update(bn(i)), k(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return ul(this.sha256, e, n, t, r || this.service);
	}
}, vl = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = bl(t, yl(t, {
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
	return l = t.signer ? Rs(t.signer) : t.regionInfoProvider ? () => Rs(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || _l)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await Rs(t.region)(),
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
		return new (t.signerConstructor || _l)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: Rs(t.disableClockSkewCorrection ?? e)
	});
};
function yl(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Hs(t, Bs, Vs) : n ? Rs(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function bl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var xl = vl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/auth/httpAuthSchemeProvider.js
ee(), de();
var Sl = async (e, t, n) => ({
	operation: v(t).operation,
	region: await x(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function Cl(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "ecr",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var wl = (e) => {
	let t = [];
	return e.operation, t.push(Cl(e)), t;
}, Tl = (e) => {
	let t = xl(e);
	return Object.assign(t, { authSchemePreference: x(e.authSchemePreference ?? []) });
}, El = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "ecr"
}), Dl = {
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
}, Ol = {
	name: "@aws-sdk/client-ecr",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Ecr Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ecr",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-ecr"
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
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/create-request.js
function kl(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function Al(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ae();
var jl = { supported: void 0 }, Ml = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), jl.supported === void 0 && (jl.supported = typeof Request < "u" && "keepalive" in kl("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = Nl(t);
			return Promise.reject(e);
		}
		let s = e.path, c = to(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), jl.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(kl(f, m)).then((e) => {
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
		}), Al(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(Nl(t));
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
function Nl(e) {
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
var Pl = class {
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
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
w();
var Fl = class extends Ga {
	serializer;
	deserializer;
	serviceTarget;
	codec;
	mixin;
	awsQueryCompatible;
	constructor({ defaultNamespace: e, errorTypeRegistries: t, serviceTarget: n, awsQueryCompatible: r, jsonCodec: i }) {
		super({
			defaultNamespace: e,
			errorTypeRegistries: t
		}), this.serviceTarget = n, this.codec = i ?? new zo({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new Pl(this.awsQueryCompatible);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`, r.headers["x-amz-target"] = `${this.serviceTarget}.${e.name}`, this.awsQueryCompatible && (r.headers["x-amzn-query-mode"] = "true"), be(e.input) !== "unit" && r.body || (r.body = "{}"), r;
	}
	getPayloadCodec() {
		return this.codec;
	}
	async handleError(e, t, n, r, i) {
		let { awsQueryCompatible: a } = this;
		a && this.mixin.setQueryCompatError(r, n);
		let o = yo(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = C.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, Il = class extends Fl {
	constructor({ defaultNamespace: e, errorTypeRegistries: t, serviceTarget: n, awsQueryCompatible: r, jsonCodec: i }) {
		super({
			defaultNamespace: e,
			errorTypeRegistries: t,
			serviceTarget: n,
			awsQueryCompatible: r,
			jsonCodec: i
		});
	}
	getShapeId() {
		return "aws.protocols#awsJson1_1";
	}
	getJsonRpcVersion() {
		return "1.1";
	}
	getDefaultContentType() {
		return "application/x-amz-json-1.1";
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/endpoint/bdd.js
di();
var Ll = "ref", Rl = -1, zl = !0, Bl = "isSet", Vl = "PartitionResult", Hl = "stringEquals", Ul = "booleanEquals", Wl = "getAttr", Gl = { [Ll]: "Endpoint" }, Kl = {
	fn: Wl,
	argv: [{ [Ll]: Vl }, "name"]
}, ql = { [Ll]: Vl }, Jl = {}, Yl = [{ [Ll]: "Region" }], Xl = {
	conditions: [
		[Bl, [Gl]],
		[Bl, Yl],
		[
			"aws.partition",
			Yl,
			Vl
		],
		[Hl, [Kl, "aws-eusc"]],
		[Hl, [Kl, "aws-iso-f"]],
		[Hl, [Kl, "aws-iso-e"]],
		[Hl, [Kl, "aws-iso-b"]],
		[Hl, [Kl, "aws-iso"]],
		[Hl, [Kl, "aws-cn"]],
		[Hl, [Kl, "aws-us-gov"]],
		[Hl, [Kl, "aws"]],
		[Ul, [{ [Ll]: "UseFIPS" }, zl]],
		[Ul, [{
			fn: Wl,
			argv: [ql, "supportsFIPS"]
		}, zl]],
		[Ul, [{ [Ll]: "UseDualStack" }, zl]],
		[Ul, [{
			fn: Wl,
			argv: [ql, "supportsDualStack"]
		}, zl]]
	],
	results: [
		[Rl],
		[Rl, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Rl, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[Gl, Jl],
		["https://api.ecr.{Region}.{PartitionResult#dnsSuffix}", Jl],
		["https://ecr.{Region}.{PartitionResult#dualStackDnsSuffix}", Jl],
		["https://api.ecr-fips.{Region}.{PartitionResult#dnsSuffix}", Jl],
		["https://ecr-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Jl],
		["https://api.ecr-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Jl],
		[Rl, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		[Rl, "FIPS is enabled but this partition does not support FIPS"],
		["https://api.ecr.{Region}.{PartitionResult#dualStackDnsSuffix}", Jl],
		[Rl, "DualStack is enabled but this partition does not support DualStack"],
		[Rl, "Invalid Configuration: Missing Region"]
	]
}, Zl = 2, Ql = new Int32Array([
	-1,
	1,
	-1,
	0,
	23,
	3,
	1,
	4,
	100000013,
	2,
	5,
	100000013,
	3,
	20,
	6,
	4,
	20,
	7,
	5,
	20,
	8,
	6,
	20,
	9,
	7,
	20,
	10,
	8,
	20,
	11,
	9,
	20,
	12,
	10,
	20,
	13,
	11,
	16,
	14,
	13,
	15,
	100000004,
	14,
	100000011,
	100000012,
	12,
	18,
	17,
	13,
	100000009,
	100000010,
	13,
	19,
	100000006,
	14,
	100000008,
	100000009,
	11,
	22,
	21,
	13,
	100000005,
	100000004,
	13,
	100000007,
	100000006,
	11,
	100000001,
	24,
	13,
	100000002,
	100000003
]), $l = Zn.from(Ql, Zl, Xl.conditions, Xl.results);
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/endpoint/endpointResolver.js
di();
var eu = new $n({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), tu = (e, t = {}) => eu.get(e, () => si($l, {
	endpointParams: e,
	logger: t.logger
}));
cr.aws = pc;
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/models/ECRServiceException.js
var I = class e extends Xe {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.ecr#ECRServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, nu = class e extends I {
	static shapeId = "com.amazonaws.ecr#InvalidParameterException";
	name = "InvalidParameterException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidParameterException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ru = class e extends I {
	static shapeId = "com.amazonaws.ecr#RepositoryNotFoundException";
	name = "RepositoryNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "RepositoryNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, iu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ServerException";
	name = "ServerException";
	$fault = "server";
	constructor(t) {
		super({
			name: "ServerException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, au = class e extends I {
	static shapeId = "com.amazonaws.ecr#LimitExceededException";
	name = "LimitExceededException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ou = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnableToGetUpstreamImageException";
	name = "UnableToGetUpstreamImageException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnableToGetUpstreamImageException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, su = class e extends I {
	static shapeId = "com.amazonaws.ecr#ValidationException";
	name = "ValidationException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ValidationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cu = class e extends I {
	static shapeId = "com.amazonaws.ecr#EmptyUploadException";
	name = "EmptyUploadException";
	$fault = "client";
	constructor(t) {
		super({
			name: "EmptyUploadException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lu = class e extends I {
	static shapeId = "com.amazonaws.ecr#InvalidLayerException";
	name = "InvalidLayerException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidLayerException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, uu = class e extends I {
	static shapeId = "com.amazonaws.ecr#KmsException";
	name = "KmsException";
	$fault = "client";
	kmsError;
	constructor(t) {
		super({
			name: "KmsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.kmsError = t.kmsError;
	}
}, du = class e extends I {
	static shapeId = "com.amazonaws.ecr#LayerAlreadyExistsException";
	name = "LayerAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LayerAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, fu = class e extends I {
	static shapeId = "com.amazonaws.ecr#LayerPartTooSmallException";
	name = "LayerPartTooSmallException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LayerPartTooSmallException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UploadNotFoundException";
	name = "UploadNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UploadNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, mu = class e extends I {
	static shapeId = "com.amazonaws.ecr#PullThroughCacheRuleAlreadyExistsException";
	name = "PullThroughCacheRuleAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "PullThroughCacheRuleAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hu = class e extends I {
	static shapeId = "com.amazonaws.ecr#SecretNotFoundException";
	name = "SecretNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "SecretNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnableToAccessSecretException";
	name = "UnableToAccessSecretException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnableToAccessSecretException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _u = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnableToDecryptSecretValueException";
	name = "UnableToDecryptSecretValueException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnableToDecryptSecretValueException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, vu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnsupportedUpstreamRegistryException";
	name = "UnsupportedUpstreamRegistryException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnsupportedUpstreamRegistryException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, yu = class e extends I {
	static shapeId = "com.amazonaws.ecr#InvalidTagParameterException";
	name = "InvalidTagParameterException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidTagParameterException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bu = class e extends I {
	static shapeId = "com.amazonaws.ecr#RepositoryAlreadyExistsException";
	name = "RepositoryAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "RepositoryAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xu = class e extends I {
	static shapeId = "com.amazonaws.ecr#TooManyTagsException";
	name = "TooManyTagsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TooManyTagsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Su = class e extends I {
	static shapeId = "com.amazonaws.ecr#TemplateAlreadyExistsException";
	name = "TemplateAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TemplateAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Cu = class e extends I {
	static shapeId = "com.amazonaws.ecr#LifecyclePolicyNotFoundException";
	name = "LifecyclePolicyNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LifecyclePolicyNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, wu = class e extends I {
	static shapeId = "com.amazonaws.ecr#PullThroughCacheRuleNotFoundException";
	name = "PullThroughCacheRuleNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "PullThroughCacheRuleNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Tu = class e extends I {
	static shapeId = "com.amazonaws.ecr#RegistryPolicyNotFoundException";
	name = "RegistryPolicyNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "RegistryPolicyNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Eu = class e extends I {
	static shapeId = "com.amazonaws.ecr#RepositoryNotEmptyException";
	name = "RepositoryNotEmptyException";
	$fault = "client";
	constructor(t) {
		super({
			name: "RepositoryNotEmptyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Du = class e extends I {
	static shapeId = "com.amazonaws.ecr#TemplateNotFoundException";
	name = "TemplateNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TemplateNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ou = class e extends I {
	static shapeId = "com.amazonaws.ecr#RepositoryPolicyNotFoundException";
	name = "RepositoryPolicyNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "RepositoryPolicyNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ku = class e extends I {
	static shapeId = "com.amazonaws.ecr#SigningConfigurationNotFoundException";
	name = "SigningConfigurationNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "SigningConfigurationNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Au = class e extends I {
	static shapeId = "com.amazonaws.ecr#ExclusionNotFoundException";
	name = "ExclusionNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExclusionNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ju = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageNotFoundException";
	name = "ImageNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Mu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ScanNotFoundException";
	name = "ScanNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ScanNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Nu = class e extends I {
	static shapeId = "com.amazonaws.ecr#LayerInaccessibleException";
	name = "LayerInaccessibleException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LayerInaccessibleException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Pu = class e extends I {
	static shapeId = "com.amazonaws.ecr#LayersNotFoundException";
	name = "LayersNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LayersNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Fu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnableToGetUpstreamLayerException";
	name = "UnableToGetUpstreamLayerException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnableToGetUpstreamLayerException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Iu = class e extends I {
	static shapeId = "com.amazonaws.ecr#LifecyclePolicyPreviewNotFoundException";
	name = "LifecyclePolicyPreviewNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LifecyclePolicyPreviewNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Lu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnableToListUpstreamImageReferrersException";
	name = "UnableToListUpstreamImageReferrersException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnableToListUpstreamImageReferrersException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ru = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageAlreadyExistsException";
	name = "ImageAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, zu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageDigestDoesNotMatchException";
	name = "ImageDigestDoesNotMatchException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageDigestDoesNotMatchException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Bu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageTagAlreadyExistsException";
	name = "ImageTagAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageTagAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Vu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ReferencedImagesNotFoundException";
	name = "ReferencedImagesNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReferencedImagesNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Hu = class e extends I {
	static shapeId = "com.amazonaws.ecr#BlockedByOrganizationPolicyException";
	name = "BlockedByOrganizationPolicyException";
	$fault = "client";
	constructor(t) {
		super({
			name: "BlockedByOrganizationPolicyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Uu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ExclusionAlreadyExistsException";
	name = "ExclusionAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExclusionAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Wu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageArchivedException";
	name = "ImageArchivedException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageArchivedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Gu = class e extends I {
	static shapeId = "com.amazonaws.ecr#UnsupportedImageTypeException";
	name = "UnsupportedImageTypeException";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnsupportedImageTypeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ku = class e extends I {
	static shapeId = "com.amazonaws.ecr#LifecyclePolicyPreviewInProgressException";
	name = "LifecyclePolicyPreviewInProgressException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LifecyclePolicyPreviewInProgressException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, qu = class e extends I {
	static shapeId = "com.amazonaws.ecr#ImageStorageClassUpdateNotSupportedException";
	name = "ImageStorageClassUpdateNotSupportedException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImageStorageClassUpdateNotSupportedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ju = class e extends I {
	static shapeId = "com.amazonaws.ecr#InvalidLayerPartException";
	name = "InvalidLayerPartException";
	$fault = "client";
	registryId;
	repositoryName;
	uploadId;
	lastValidByteReceived;
	constructor(t) {
		super({
			name: "InvalidLayerPartException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.registryId = t.registryId, this.repositoryName = t.repositoryName, this.uploadId = t.uploadId, this.lastValidByteReceived = t.lastValidByteReceived;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/schemas/schemas_0.js
w();
var Yu = "BlockedByOrganizationPolicyException", Xu = "BatchDeleteImage", Zu = "BatchDeleteImageRequest", Qu = "BatchDeleteImageResponse", $u = "CreateRepository", ed = "CreateRepositoryRequest", td = "CreateRepositoryResponse", nd = "DescribeImages", rd = "DescribeImagesFilter", id = "DescribeImagesRequest", ad = "DescribeImagesResponse", od = "DeleteRepository", sd = "DeleteRepositoryRequest", cd = "DeleteRepositoryResponse", ld = "DescribeRepositoriesRequest", ud = "DescribeRepositoriesResponse", dd = "DescribeRepositories", fd = "ExclusionAlreadyExistsException", pd = "EncryptionConfiguration", md = "ExclusionNotFoundException", hd = "EmptyUploadException", gd = "GetLifecyclePolicy", _d = "GetLifecyclePolicyRequest", vd = "GetLifecyclePolicyResponse", yd = "GetRepositoryPolicyRequest", bd = "GetRepositoryPolicyResponse", xd = "GetRepositoryPolicy", Sd = "ImageArchivedException", Cd = "ImageAlreadyExistsException", wd = "ImageDetail", Td = "ImageDigestDoesNotMatchException", Ed = "ImageDetailList", Dd = "ImageFailure", Od = "ImageFailureList", kd = "ImageIdentifier", Ad = "ImageIdentifierList", jd = "InvalidLayerException", Md = "InvalidLayerPartException", Nd = "ImageNotFoundException", Pd = "InvalidParameterException", Fd = "ImageScanningConfiguration", Id = "ImageStorageClassUpdateNotSupportedException", Ld = "ImageScanFindingsSummary", Rd = "ImageScanStatus", zd = "ImageTagAlreadyExistsException", Bd = "ImageTagMutabilityExclusionFilter", Vd = "ImageTagMutabilityExclusionFilters", Hd = "InvalidTagParameterException", Ud = "Key", Wd = "KmsException", Gd = "LayerAlreadyExistsException", Kd = "LimitExceededException", qd = "LayerInaccessibleException", Jd = "LayersNotFoundException", Yd = "LifecyclePolicyNotFoundException", Xd = "LifecyclePolicyPreviewInProgressException", Zd = "LifecyclePolicyPreviewNotFoundException", Qd = "LayerPartTooSmallException", $d = "PullThroughCacheRuleAlreadyExistsException", ef = "PullThroughCacheRuleNotFoundException", tf = "RepositoryAlreadyExistsException", nf = "ReferencedImagesNotFoundException", rf = "RepositoryList", af = "RepositoryNotEmptyException", of = "RepositoryNotFoundException", sf = "RegistryPolicyNotFoundException", cf = "RepositoryPolicyNotFoundException", lf = "Repository", uf = "SigningConfigurationNotFoundException", df = "ServerException", ff = "ScanNotFoundException", pf = "SecretNotFoundException", mf = "Tag", hf = "TemplateAlreadyExistsException", gf = "TagList", _f = "TooManyTagsException", vf = "TemplateNotFoundException", yf = "UnsupportedImageTypeException", bf = "UploadNotFoundException", xf = "UnableToAccessSecretException", Sf = "UnableToDecryptSecretValueException", Cf = "UnableToGetUpstreamImageException", wf = "UnableToGetUpstreamLayerException", Tf = "UnableToListUpstreamImageReferrersException", Ef = "UnsupportedUpstreamRegistryException", Df = "Value", Of = "ValidationException", kf = "artifactMediaType", L = "client", Af = "createdAt", jf = "description", R = "error", Mf = "encryptionConfiguration", Nf = "encryptionType", Pf = "failures", Ff = "failureCode", If = "failureReason", Lf = "findingSeverityCounts", Rf = "filterType", zf = "filter", Bf = "force", Vf = "httpError", Hf = "imageDetails", Uf = "imageDigest", Wf = "imageIds", Gf = "imageId", Kf = "imageManifestMediaType", qf = "imagePushedAt", Jf = "imageStatus", Yf = "imageScanningConfiguration", Xf = "imageScanCompletedAt", Zf = "imageScanFindingsSummary", Qf = "imageSizeInBytes", $f = "imageScanStatus", ep = "imageTags", tp = "imageTagMutability", np = "imageTagMutabilityExclusionFilters", rp = "imageTag", ip = "kmsError", ap = "kmsKey", op = "lastArchivedAt", sp = "lastActivatedAt", cp = "lastEvaluatedAt", lp = "lifecyclePolicyText", up = "lastRecordedPullTime", dp = "lastValidByteReceived", z = "message", fp = "maxResults", pp = "nextToken", mp = "policyText", hp = "repositoryArn", B = "registryId", V = "repositoryName", gp = "repositoryNames", _p = "repositoryUri", vp = "repository", yp = "repositories", bp = "smithy.ts.sdk.synthetic.com.amazonaws.ecr", xp = "subjectManifestDigest", Sp = "scanOnPush", Cp = "server", wp = "status", Tp = "tags", Ep = "tagStatus", Dp = "uploadId", Op = "vulnerabilitySourceUpdatedAt", H = "com.amazonaws.ecr", kp = new Ue(bp), Ap = [
	-3,
	bp,
	"ECRServiceException",
	0,
	[],
	[]
];
kp.registerError(Ap, I);
var U = new Ue(H), jp = [
	-3,
	H,
	Yu,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(jp, Hu);
var Mp = [
	-3,
	H,
	hd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Mp, cu);
var Np = [
	-3,
	H,
	fd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Np, Uu);
var Pp = [
	-3,
	H,
	md,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Pp, Au);
var Fp = [
	-3,
	H,
	Cd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Fp, Ru);
var Ip = [
	-3,
	H,
	Sd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Ip, Wu);
var Lp = [
	-3,
	H,
	Td,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Lp, zu);
var Rp = [
	-3,
	H,
	Nd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Rp, ju);
var zp = [
	-3,
	H,
	Id,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(zp, qu);
var Bp = [
	-3,
	H,
	zd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Bp, Bu);
var Vp = [
	-3,
	H,
	jd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Vp, lu);
var Hp = [
	-3,
	H,
	Md,
	{ [R]: L },
	[
		B,
		V,
		Dp,
		dp,
		z
	],
	[
		0,
		0,
		0,
		1,
		0
	]
];
U.registerError(Hp, Ju);
var Up = [
	-3,
	H,
	Pd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Up, nu);
var Wp = [
	-3,
	H,
	Hd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Wp, yu);
var Gp = [
	-3,
	H,
	Wd,
	{ [R]: L },
	[z, ip],
	[0, 0]
];
U.registerError(Gp, uu);
var Kp = [
	-3,
	H,
	Gd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Kp, du);
var qp = [
	-3,
	H,
	qd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(qp, Nu);
var Jp = [
	-3,
	H,
	Qd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Jp, fu);
var Yp = [
	-3,
	H,
	Jd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Yp, Pu);
var Xp = [
	-3,
	H,
	Yd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Xp, Cu);
var Zp = [
	-3,
	H,
	Xd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Zp, Ku);
var Qp = [
	-3,
	H,
	Zd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Qp, Iu);
var $p = [
	-3,
	H,
	Kd,
	{ [R]: L },
	[z],
	[0]
];
U.registerError($p, au);
var em = [
	-3,
	H,
	$d,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(em, mu);
var tm = [
	-3,
	H,
	ef,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(tm, wu);
var nm = [
	-3,
	H,
	nf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(nm, Vu);
var rm = [
	-3,
	H,
	sf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(rm, Tu);
var im = [
	-3,
	H,
	tf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(im, bu);
var am = [
	-3,
	H,
	af,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(am, Eu);
var om = [
	-3,
	H,
	of,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(om, ru);
var sm = [
	-3,
	H,
	cf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(sm, Ou);
var cm = [
	-3,
	H,
	ff,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(cm, Mu);
var lm = [
	-3,
	H,
	pf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(lm, hu);
var um = [
	-3,
	H,
	df,
	{ [R]: Cp },
	[z],
	[0]
];
U.registerError(um, iu);
var dm = [
	-3,
	H,
	uf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(dm, ku);
var fm = [
	-3,
	H,
	hf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(fm, Su);
var pm = [
	-3,
	H,
	vf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(pm, Du);
var mm = [
	-3,
	H,
	_f,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(mm, xu);
var hm = [
	-3,
	H,
	xf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(hm, gu);
var gm = [
	-3,
	H,
	Sf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(gm, _u);
var _m = [
	-3,
	H,
	Cf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(_m, ou);
var vm = [
	-3,
	H,
	wf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(vm, Fu);
var ym = [
	-3,
	H,
	Tf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(ym, Lu);
var bm = [
	-3,
	H,
	yf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(bm, Gu);
var xm = [
	-3,
	H,
	Ef,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(xm, vu);
var Sm = [
	-3,
	H,
	bf,
	{ [R]: L },
	[z],
	[0]
];
U.registerError(Sm, pu);
var Cm = [
	-3,
	H,
	Of,
	{
		[R]: L,
		[Vf]: 400
	},
	[z],
	[0]
];
U.registerError(Cm, su);
var wm = [kp, U], Tm = [
	3,
	H,
	Zu,
	0,
	[
		V,
		Wf,
		B
	],
	[
		0,
		() => Qm,
		0
	],
	2
], Em = [
	3,
	H,
	Qu,
	0,
	[Wf, Pf],
	[() => Qm, () => Zm]
], Dm = [
	3,
	H,
	ed,
	0,
	[
		V,
		B,
		Tp,
		tp,
		np,
		Yf,
		Mf
	],
	[
		0,
		0,
		() => th,
		0,
		() => $m,
		() => Gm,
		() => Im
	],
	1
], Om = [
	3,
	H,
	td,
	0,
	[vp],
	[() => Jm]
], km = [
	3,
	H,
	sd,
	0,
	[
		V,
		B,
		Bf
	],
	[
		0,
		0,
		2
	],
	1
], Am = [
	3,
	H,
	cd,
	0,
	[vp],
	[() => Jm]
], jm = [
	3,
	H,
	rd,
	0,
	[Ep, Jf],
	[0, 0]
], Mm = [
	3,
	H,
	id,
	0,
	[
		V,
		B,
		Wf,
		pp,
		fp,
		zf
	],
	[
		0,
		0,
		() => Qm,
		0,
		1,
		() => jm
	],
	1
], Nm = [
	3,
	H,
	ad,
	0,
	[Hf, pp],
	[() => Xm, 0]
], Pm = [
	3,
	H,
	ld,
	0,
	[
		B,
		gp,
		pp,
		fp
	],
	[
		0,
		64,
		0,
		1
	]
], Fm = [
	3,
	H,
	ud,
	0,
	[yp, pp],
	[() => eh, 0]
], Im = [
	3,
	H,
	pd,
	0,
	[Nf, ap],
	[0, 0],
	1
], Lm = [
	3,
	H,
	_d,
	0,
	[V, B],
	[0, 0],
	1
], Rm = [
	3,
	H,
	vd,
	0,
	[
		B,
		V,
		lp,
		cp
	],
	[
		0,
		0,
		0,
		4
	]
], zm = [
	3,
	H,
	yd,
	0,
	[V, B],
	[0, 0],
	1
], Bm = [
	3,
	H,
	bd,
	0,
	[
		B,
		V,
		mp
	],
	[
		0,
		0,
		0
	]
], Vm = [
	3,
	H,
	wd,
	0,
	[
		B,
		V,
		Uf,
		ep,
		Qf,
		qf,
		$f,
		Zf,
		Kf,
		kf,
		up,
		xp,
		Jf,
		op,
		sp
	],
	[
		0,
		0,
		0,
		64,
		1,
		4,
		() => Km,
		() => Wm,
		0,
		0,
		4,
		0,
		0,
		4,
		4
	]
], Hm = [
	3,
	H,
	Dd,
	0,
	[
		Gf,
		Ff,
		If
	],
	[
		() => Um,
		0,
		0
	]
], Um = [
	3,
	H,
	kd,
	0,
	[Uf, rp],
	[0, 0]
], Wm = [
	3,
	H,
	Ld,
	0,
	[
		Xf,
		Op,
		Lf
	],
	[
		4,
		4,
		129
	]
], Gm = [
	3,
	H,
	Fd,
	0,
	[Sp],
	[2]
], Km = [
	3,
	H,
	Rd,
	0,
	[wp, jf],
	[0, 0]
], qm = [
	3,
	H,
	Bd,
	0,
	[Rf, zf],
	[0, 0],
	2
], Jm = [
	3,
	H,
	lf,
	0,
	[
		hp,
		B,
		V,
		_p,
		Af,
		tp,
		np,
		Yf,
		Mf
	],
	[
		0,
		0,
		0,
		0,
		4,
		0,
		() => $m,
		() => Gm,
		() => Im
	]
], Ym = [
	3,
	H,
	mf,
	0,
	[Ud, Df],
	[0, 0],
	2
], Xm = [
	1,
	H,
	Ed,
	0,
	() => Vm
], Zm = [
	1,
	H,
	Od,
	0,
	() => Hm
], Qm = [
	1,
	H,
	Ad,
	0,
	() => Um
], $m = [
	1,
	H,
	Vd,
	0,
	() => qm
], eh = [
	1,
	H,
	rf,
	0,
	() => Jm
], th = [
	1,
	H,
	gf,
	0,
	() => Ym
], nh = [
	9,
	H,
	Xu,
	0,
	() => Tm,
	() => Em
], rh = [
	9,
	H,
	$u,
	0,
	() => Dm,
	() => Om
], ih = [
	9,
	H,
	od,
	0,
	() => km,
	() => Am
], ah = [
	9,
	H,
	nd,
	0,
	() => Mm,
	() => Nm
], oh = [
	9,
	H,
	dd,
	0,
	() => Pm,
	() => Fm
], sh = [
	9,
	H,
	gd,
	0,
	() => Lm,
	() => Rm
], ch = [
	9,
	H,
	xd,
	0,
	() => zm,
	() => Bm
];
Ui(), he(), j();
var lh = (e) => ({
	apiVersion: "2015-09-21",
	base64Decoder: e?.base64Decoder ?? ft,
	base64Encoder: e?.base64Encoder ?? gt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? tu,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? wl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Mc()
	}],
	logger: e?.logger ?? new ot(),
	protocol: e?.protocol ?? Il,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.ecr",
		errorTypeRegistries: wm,
		xmlNamespace: "http://ecr.amazonaws.com/doc/2015-09-21/",
		version: "2015-09-21",
		serviceTarget: "AmazonEC2ContainerRegistry_V20150921"
	},
	serviceId: e?.serviceId ?? "ECR",
	sha256: e?.sha256 ?? Vi,
	urlParser: e?.urlParser ?? me,
	utf8Decoder: e?.utf8Decoder ?? mt,
	utf8Encoder: e?.utf8Encoder ?? bt
});
j(), _i();
var uh = (e) => {
	let t = xc(e), n = () => t().then(Qe), r = lh(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? vn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? sc({
			serviceId: r.serviceId,
			clientVersion: Ol.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? ve("Region is missing"),
		requestHandler: Ml.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || ms),
		streamCollector: e?.streamCollector ?? gi,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, dh = (e) => {
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
}, fh = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), ph = (e, t) => {
	let n = Object.assign(Cc(e), it(e), qa(e), dh(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, wc(n), at(n), Ja(n), fh(n));
};
di(), w();
var mh = class extends ye {
	config;
	constructor(...[e]) {
		let t = uh(e || {});
		super(t), this.initConfig = t;
		let n = bs(yc(vs(Ws(El(t))))), r = ph(Tl(li(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(ke(this.config)), this.middlewareStack.use(oc(this.config)), this.middlewareStack.use(ys(this.config)), this.middlewareStack.use(Qa(this.config)), this.middlewareStack.use(Cs(this.config)), this.middlewareStack.use(Es(this.config)), this.middlewareStack.use(Ds(this.config)), this.middlewareStack.use(Ms(this.config, {
			httpAuthSchemeParametersProvider: Sl,
			identityProviderConfigProvider: async (e) => new zs({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Ls(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-ecr@3.1156.0/node_modules/@aws-sdk/client-ecr/dist-es/commandBuilder.js
di();
var hh = st(Dl, "AmazonEC2ContainerRegistry_V20150921", "ECRClient", ui), gh = {}, _h = (e, t, n, r) => [], vh = class extends hh(gh, _h, "BatchDeleteImage", nh) {}, yh = class extends hh(gh, _h, "CreateRepository", rh) {}, bh = class extends hh(gh, _h, "DeleteRepository", ih) {}, xh = class extends hh(gh, _h, "DescribeImages", ah) {}, Sh = class extends hh(gh, _h, "DescribeRepositories", oh) {}, Ch = class extends hh(gh, _h, "GetLifecyclePolicy", sh) {}, wh = class extends hh(gh, _h, "GetRepositoryPolicy", ch) {}, Th = class extends Error {
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
}, Eh = Symbol(), Dh = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), Oh = 1e4, kh = (e) => "headers" in e, Ah = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (kh(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? jh(e, {
		all: n,
		dot: r
	}) : {};
};
async function jh(e, t) {
	if (!kh(e) && e.bodyCache.formData) return Mh(await e.bodyCache.formData, t);
	let n = kh(e) ? e.headers : e.raw.headers, r = Dh(await e.arrayBuffer(), n.get("Content-Type") || "");
	kh(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? Mh(i, t) : {};
}
function Mh(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? Nh(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (Ph(n, e, t, r), delete n[e]);
	}), n;
}
var Nh = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, Ph = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && Fh(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= Oh && Fh(), i[e] = Object.create(null)), i = i[e]);
	});
}, Fh = () => {
	throw Error("Nesting limit exceeded");
}, Ih = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, Lh = (e) => {
	let { groups: t, path: n } = Rh(e);
	return zh(Ih(n), t);
}, Rh = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, zh = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, Bh = {}, Vh = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return Bh[r] || (Bh[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), Bh[r];
	}
	return null;
}, Hh = (e, t) => {
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
}, Uh = (e) => Hh(e, decodeURI), Wh = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return Uh(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, Gh = (e) => {
	let t = Wh(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, Kh = (e, t, ...n) => (n.length && (t = Kh(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), qh = (e) => {
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
}, Jh = (e) => e.indexOf("%") === -1 ? e : Hh(e, $h), Yh = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), Jh(e)), Xh = (e, t, n) => {
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
					return Yh(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = Yh(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = Yh(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, Zh = Xh, Qh = (e, t) => Xh(e, t, !0), $h = decodeURIComponent, eg = class {
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
		return n && Jh(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = Jh(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return Zh(this.url, e);
	}
	queries(e) {
		return Qh(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return Ah(this, e);
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
	get [Eh]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, tg = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, ng = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, rg = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => rg(e, t, !1, r, i))).then(() => i[0]));
	return n ? ng(await o, a) : o;
}, ig = "text/plain; charset=UTF-8", ag = (e, t) => ({
	"Content-Type": e,
	...t
}), og = (e, t) => new Response(e, t), sg = class {
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
		return this.#t ??= new eg(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= og(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = og(e.body, e);
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
		this.finalized && (this.#a = og(this.#a.body, this.#a));
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
		return og(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, ag(ig, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, ag("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, ag("text/html; charset=UTF-8", n));
		return typeof e == "object" ? rg(e, tg.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => og(), this.#c(this));
}, cg = (e, t, n) => (r, i) => {
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
}, lg = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], ug = "Can not add a route since the matcher is already built.", dg = class extends Error {}, fg = "__COMPOSED_HANDLER", pg = (e) => e.text("404 Not Found", 404), mg = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, hg = class e {
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
		[...lg, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? Wh : Gh;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = pg;
	errorHandler = mg;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === mg ? r = e.handler : (r = async (n, r) => (await cg([], t.errorHandler)(n, () => e.handler(n, r))).res, r[fg] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = Kh(this._basePath, e), t;
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
			let t = Kh(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", Kh(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = Kh(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : Kh(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new sg(e, {
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
		let s = cg(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${Kh("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, W = () => Object.create(null), gg = [];
function _g(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], gg];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var vg = "[^/]+", yg = "(?:|/.*)", bg = Symbol(), xg = /* @__PURE__ */ new Set(".\\+*[^]$()");
function Sg(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var Cg = class e {
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
				vg
			] : null : s === "/*" ? [
				"",
				"",
				yg
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && xg.has(n))) throw bg;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw bg;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw bg;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw bg;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(Sg).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : xg.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, wg = class {
	#e = { varIndex: 0 };
	#t = new Cg();
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
}, Tg = W();
function Eg(e) {
	return Tg[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? yg : e === "*" ? ".*" : `/:${vg}`)}$`);
}
function Dg(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (Eg(n).test(t)) return [...e[n]];
}
var Og = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: W() }, this.#t = { ALL: W() }, this.#n = { ALL: new wg() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === bg ? new dg(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(ug);
		if (!r[e]) {
			this.#n[e] = new wg();
			for (let t of [r, i]) {
				t[e] = W();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = Eg(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = Dg(r[e], t) || Dg(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = qh(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = Dg(r[t], e) || Dg(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = _g;
	buildAllMatchers() {
		let e = W();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, Tg = W(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = W(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), W())]) : i[t] = [n.map(([e]) => [e, W()]), gg];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, kg = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(ug);
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
				if (e instanceof dg) continue;
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
}, Ag = W(), jg = 0, Mg = class e {
	#e = [];
	#t = W();
	#n = [];
	#r;
	#i = Ag;
	insert(t, n, r) {
		let i = this, a = Lh(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = Vh(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++jg
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
		this.#i = Ag;
		let r = [this], i = Ih(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === Ag ? {} : { ...p.#i };
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
}, Ng = class {
	name = "TrieRouter";
	#e = new Mg();
	add(e, t, n) {
		for (let r of qh(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, Pg = class extends hg {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new kg({ routers: [new Og(), new Ng()] });
	}
}, Fg = [
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
}, Ig = class extends G {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, q = class extends G {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, Lg = class extends G {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, Rg = class extends G {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, J = class extends G {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, zg = class extends G {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, Bg = class extends G {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, Vg = class extends G {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, Hg = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function Ug(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && Hg.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function Wg(e, t) {
	let n = Gg(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function Gg(e, t) {
	if (e instanceof G) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return Ug(e) ? new Bg(r, { cause: e }) : new Vg(r, { cause: e });
}
var Kg = 1e3, qg = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function Jg(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new K("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new K("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new K("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = Yg(r)), a;
}
function Yg(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!qg.includes(t)) throw new K(`sortKey.operator must be one of ${qg.join(", ")}.`);
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
function Xg(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new K(`limit must be a whole number between 1 and ${Kg}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new K(`limit must be between 1 and ${Kg}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var Zg = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], Qg = {
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
}, $g = Object.keys(Qg).map((e) => ({
	service: e,
	...Qg[e]
})).sort(r_);
$g.map((e) => e.service);
function Y(e) {
	return Object.hasOwn(Qg, e);
}
function e_(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function t_(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function n_(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function r_(e, t) {
	let n = Zg.indexOf(e.group) - Zg.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var i_ = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function a_(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${i_[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var o_ = /* @__PURE__ */ new Set([
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
]), s_ = /* @__PURE__ */ new Set([
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
]), c_ = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), l_ = /* @__PURE__ */ new Set([
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
]), u_ = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), d_ = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), f_ = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function p_(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function m_(e) {
	if (!p_(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || o_.has(n)) return new Rg(r, i);
	if (s_.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new Lg(r, i);
	if (c_.has(n)) return new Ig(r, i);
	if (l_.has(n)) return new K(r, i);
	if (u_.has(n) || /\.NotFound$/.test(n)) return new q(r, i);
	if (d_.has(n)) return new zg(r, i);
	if (f_.has(n) || Ug(e)) return new Bg(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new K(r, i) : a === 401 || a === 403 ? new Ig(r, i) : a === 404 ? new q(r, i) : a === 409 ? new Lg(r, i) : a === 429 ? new Rg(r, i) : a === 501 ? new zg(r, i) : a === 503 || a === 504 ? new Bg(r, i) : new Vg(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function h_() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function g_(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var __ = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, v_ = !1;
function y_(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = b_(t);
	return !n && !v_ && (v_ = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function b_(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(__, t) ? __[t] : null;
}
var x_ = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), S_ = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), C_ = 5464, w_ = 8192, T_ = 50, E_ = 12e4;
function D_(e, t = h_) {
	let n = new Pg();
	n.onError((e, t) => {
		if (e instanceof G) {
			let { status: n, body: r } = Wg(e);
			return t.json(r, n);
		}
		return e instanceof Th ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : y_();
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
		return U_(e, 150), $(e, () => g_(E_, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: G_(i.schema(t, n), (t) => e.req.query(t))
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
			if (n.logGroupNames.length > T_) throw new K(`logGroupNames must include at most ${T_} log groups.`);
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
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), V_(e));
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
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), V_(e));
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
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", H_(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), V_(e));
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
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", H_(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), Jg(n), H_(n));
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
			let i = await P_(e);
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
			let i = j_((await P_(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = M_(e.req.query());
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
		return W_(e, async () => {
			let n = await F_(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: B_(n.plaintextBase64, "plaintextBase64", C_),
				encryptionAlgorithm: I_(n.encryptionAlgorithm),
				encryptionContext: z_(n.encryptionContext)
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
		return W_(e, async () => {
			let n = await F_(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: B_(n.ciphertextBlobBase64, "ciphertextBlobBase64", w_),
				encryptionAlgorithm: I_(n.encryptionAlgorithm),
				encryptionContext: z_(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of Fg) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
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
		return W_(e, async () => {
			let n = await F_(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: B_(n.messageBase64, "messageBase64", C_),
				signingAlgorithm: L_(n.signingAlgorithm)
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
		return W_(e, async () => {
			let n = await F_(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: B_(n.messageBase64, "messageBase64", C_),
				signature: B_(n.signatureBase64, "signatureBase64", w_),
				keyVersionId: R_(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: L_(n.signingAlgorithm)
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
			let i = await P_(e), a = await r(e).createResource(t, n, { values: i });
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
			let i = N_(await P_(e));
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
var O_ = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], k_ = 100, A_ = 100;
function j_(e) {
	if (!Array.isArray(e) || e.length === 0) throw new K("messages must contain at least one entry");
	if (e.length > A_) throw new K(`messages must contain at most ${A_} entries`);
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
function M_(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new K("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!O_.includes(n)) throw new K(`cursorType must be one of ${O_.join(", ")}`);
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
		if (!Number.isInteger(t) || t < 1 || t > k_) throw new K(`limit must be an integer between 1 and ${k_}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function N_(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new K(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function P_(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new K("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof K ? e : new K("Request body must be valid JSON");
	}
}
var Z = class extends K {};
async function F_(e) {
	try {
		return await P_(e);
	} catch (e) {
		throw e instanceof K ? new Z(e.message) : e;
	}
}
function I_(e) {
	if (typeof e != "string" || !x_.has(e)) throw new Z("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function L_(e) {
	if (typeof e != "string" || !S_.has(e)) throw new Z("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function R_(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new Z(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function z_(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Z("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new Z("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function B_(e, t, n) {
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
function V_(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: Xg(e.req.query("limit"))
	};
}
function H_(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new K("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new K("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: Xg(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function U_(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function $(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Wg(t, m_);
		return e.json(r, n);
	}
}
async function W_(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Wg(t, m_);
		if (t instanceof Z) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function G_(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
D_();
// ../api/src/registry/CloudAdapterRegistry.ts
var K_ = class {
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
}, q_ = async () => {}, J_ = {
	aws: q_,
	azure: q_,
	gcp: q_,
	oci: q_
};
function Y_() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var X_ = 5e3, Z_ = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = J_, n = y_(), r = null) {
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
		return Promise.all($g.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? e_(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: t_(t, e),
				docsUrl: a_(t, e),
				availability: a,
				reason: r.reason ?? Q_(a, e, o),
				route: n_(t, e),
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
			endpoint: Y_(e),
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
		if (r && Date.now() - r.at < X_) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = Y_(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = Wg(r, m_);
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
		if (t && Date.now() - t.at < X_) return t.value;
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
		let i = r.emptyBucket.bind(r), a = $_(e, t);
		if (this.emptying.has(a)) throw new Lg(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new Lg(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = $_(e, t);
		if (this.emptying.has(r)) throw new Lg(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
function Q_(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function $_(e, t) {
	return JSON.stringify([e, t]);
}
// ../api/src/cloud-spi/registrySchema.ts
var ev = "^(?:[a-z0-9]+(?:[._\\-][a-z0-9]+)*/)*[a-z0-9]+(?:[._\\-][a-z0-9]+)*$", tv = ["MUTABLE", "IMMUTABLE"], nv = [
	{
		name: "name",
		label: "Repository"
	},
	{
		name: "repositoryUri",
		label: "URI",
		path: "metadata.repositoryUri",
		format: "code",
		emptyText: "-"
	},
	{
		name: "createdAt",
		label: "Created",
		format: "datetime"
	},
	{
		name: "imageTagMutability",
		label: "Tag Mutability",
		path: "metadata.imageTagMutability",
		format: "badge"
	},
	{
		name: "scanOnPush",
		label: "Scan on Push",
		path: "metadata.scanOnPush",
		format: "boolean",
		emptyText: "-"
	},
	{
		name: "encryptionType",
		label: "Encryption",
		path: "metadata.encryptionType",
		emptyText: "-"
	}
], rv = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}];
function iv() {
	return {
		cloud: "aws",
		service: "registry",
		displayName: "ECR Repositories",
		fields: [
			{
				name: "repositoryName",
				label: "Repository Name",
				type: "text",
				required: !0,
				span: !0,
				description: "Lowercase letters, digits, and . _ - separators; use / for namespaces, e.g. team/app.",
				validation: {
					pattern: ev,
					minLength: 2,
					maxLength: 256,
					message: "Use lowercase letters and digits separated by single dots, underscores, hyphens or slashes."
				}
			},
			{
				name: "imageTagMutability",
				label: "Tag Mutability",
				type: "select",
				required: !1,
				defaultValue: "MUTABLE",
				description: "An immutable repository refuses a push that would move an existing tag.",
				options: tv.map((e) => ({
					label: e,
					value: e
				}))
			},
			{
				name: "scanOnPush",
				label: "Scan on Push",
				type: "select",
				required: !1,
				defaultValue: "false",
				description: "Stored on the repository. The local runtime does not scan images.",
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
					label: "List repositories",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "create",
					label: "Create repository",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "delete",
					label: "Delete repository and its images",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "inspect",
					label: "Inspect repository",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				}
			],
			itemActions: [{
				name: "list",
				label: "List images",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}, {
				name: "delete",
				label: "Delete image",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}]
		},
		filters: rv,
		columns: nv
	};
}
// ../api/src/adapter-aws/AwsRegistryAdapter.ts
var av = new RegExp(ev), ov = 1e3, sv = 100, cv = /^[a-z0-9]+(?:[+._-][a-z0-9]+)*:[A-Za-z0-9=_-]+$/, lv = "<untagged>", uv = class {
	ecr;
	cloud = "aws";
	service = "registry";
	items;
	constructor(e) {
		this.ecr = e, this.items = new dv(e);
	}
	schema() {
		return iv();
	}
	async list(e = {}) {
		let t = [], n = /* @__PURE__ */ new Set(), r;
		do {
			let e = await this.ecr.send(new Sh({
				nextToken: r,
				maxResults: ov
			}));
			t.push(...e.repositories ?? []), r = yv(e.nextToken, n, "DescribeRepositories");
		} while (r);
		return bv(t.map(fv), e.search);
	}
	async get(e) {
		let t = await this.describeRepository(e);
		if (!t) return null;
		let [n, r, i] = await Promise.all([
			this.repositoryPolicy(e),
			this.lifecyclePolicy(e),
			this.firstImages(e)
		]), a = fv(t);
		return {
			...a,
			metadata: {
				...a.metadata,
				repositoryPolicyText: n,
				lifecyclePolicyText: r,
				images: i?.images ?? [],
				...i ? {} : { imagesUnavailable: !0 },
				...i?.more ? { imagesTruncated: !0 } : {}
			}
		};
	}
	async create(e) {
		let t = e.values, n = await this.ecr.send(new yh({
			repositoryName: gv(t.repositoryName),
			imageTagMutability: _v(t.imageTagMutability),
			imageScanningConfiguration: { scanOnPush: t.scanOnPush === !0 || t.scanOnPush === "true" }
		}));
		if (!n.repository) throw new Vg("ECR did not return the repository it created");
		return fv(n.repository);
	}
	async delete(e) {
		await this.ecr.send(new bh({
			repositoryName: e,
			force: !0
		}));
	}
	async health() {
		await this.ecr.send(new Sh({ maxResults: 1 }));
	}
	async describeRepository(e) {
		try {
			return (await this.ecr.send(new Sh({ repositoryNames: [e] }))).repositories?.[0] ?? null;
		} catch (e) {
			if (xv(e, "RepositoryNotFoundException")) return null;
			throw e;
		}
	}
	async repositoryPolicy(e) {
		try {
			return (await this.ecr.send(new wh({ repositoryName: e }))).policyText ?? null;
		} catch (e) {
			if (xv(e, "RepositoryPolicyNotFoundException")) return null;
			throw e;
		}
	}
	async lifecyclePolicy(e) {
		try {
			return (await this.ecr.send(new Ch({ repositoryName: e }))).lifecyclePolicyText ?? null;
		} catch (e) {
			if (xv(e, "LifecyclePolicyNotFoundException")) return null;
			throw e;
		}
	}
	async firstImages(e) {
		try {
			let t = await this.items.listItems(e, { limit: sv });
			return {
				images: t.items.map((e) => e.body),
				more: t.nextCursor !== null
			};
		} catch {
			return null;
		}
	}
}, dv = class {
	ecr;
	constructor(e) {
		this.ecr = e;
	}
	async listItems(e, t = {}) {
		let n = await this.ecr.send(new xh({
			repositoryName: e,
			nextToken: t.cursor,
			maxResults: vv(t)
		}));
		return {
			items: mv(n.imageDetails ?? []).map(pv),
			nextCursor: n.nextToken ?? null
		};
	}
	async deleteItem(e, t) {
		if (!cv.test(t)) throw new K("Delete an image by its digest, e.g. sha256:<hex>.");
		let n = await this.ecr.send(new vh({
			repositoryName: e,
			imageIds: [{ imageDigest: t }]
		})), [r] = n.failures ?? [];
		if (r) throw hv(r);
		if (!n.imageIds?.length) throw new Vg(`ECR did not confirm that image ${t} was deleted`);
	}
};
function fv(e) {
	let t = e.repositoryName ?? "";
	return {
		id: t,
		name: t,
		cloud: "aws",
		service: "registry",
		type: "ecr-repository",
		region: e.repositoryArn?.split(":")[3] || null,
		createdAt: e.createdAt?.toISOString() ?? null,
		metadata: {
			provider: "aws",
			arn: e.repositoryArn,
			registryId: e.registryId,
			repositoryUri: e.repositoryUri,
			imageTagMutability: e.imageTagMutability,
			scanOnPush: e.imageScanningConfiguration?.scanOnPush ?? null,
			encryptionType: e.encryptionConfiguration?.encryptionType ?? null,
			kmsKey: e.encryptionConfiguration?.kmsKey
		}
	};
}
function pv(e) {
	let t = e.imageTags ?? [], n = e.imagePushedAt?.toISOString() ?? null;
	return {
		id: e.imageDigest ?? "",
		collectionId: null,
		timestamp: n,
		body: {
			tags: t.length > 0 ? t.join(", ") : lv,
			imageTags: t,
			imageDigest: e.imageDigest,
			imageSizeInBytes: e.imageSizeInBytes,
			imagePushedAt: n,
			imageManifestMediaType: e.imageManifestMediaType,
			artifactMediaType: e.artifactMediaType
		},
		metadata: { registryId: e.registryId }
	};
}
function mv(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = r.imageDigest ? n.get(r.imageDigest) : void 0;
		if (e) for (let t of r.imageTags ?? []) e.imageTags?.includes(t) || e.imageTags?.push(t);
		else {
			let e = {
				...r,
				imageTags: [...r.imageTags ?? []]
			};
			t.push(e), r.imageDigest && n.set(r.imageDigest, e);
		}
	}
	return t;
}
function hv(e) {
	let t = e.failureCode ?? "UnknownFailure", n = `BatchDeleteImage failed with ${t}: ${e.failureReason ?? "no reason given"}`;
	return t === "ImageNotFound" ? new q(n) : t === "ImageReferencedByManifestList" ? new Lg(n) : t === "InvalidImageDigest" ? new K(n) : new Vg(n);
}
function gv(e) {
	let t = typeof e == "string" ? e.trim() : "";
	if (!t) throw new K("repositoryName is required");
	if (t.length < 2 || t.length > 256 || !av.test(t)) throw new K("Use a valid ECR repository name: 2 to 256 lowercase letters and digits, separated by single dots, underscores, hyphens or slashes.");
	return t;
}
function _v(e) {
	if (e != null && e !== "") {
		if (typeof e == "string" && tv.includes(e)) return e;
		throw new K(`imageTagMutability must be one of ${tv.join(", ")}.`);
	}
}
function vv(e) {
	return Math.min(e.limit ?? 100, ov);
}
function yv(e, t, n) {
	if (e) {
		if (t.has(e)) throw new Vg(`ECR ${n} repeated a continuation token`);
		return t.add(e), e;
	}
}
function bv(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n)) : e;
}
function xv(e, t) {
	return e instanceof Error && e.name === t;
}
var Sv = D_(new Z_(new K_([new uv(new mh({
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
async function Cv(e) {
	return Sv.fetch(e);
}
export { Cv as handleEcrRequest };
