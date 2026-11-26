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
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function ln(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw Error(`Value ${r} out of range [${t}, ${n}]`);
}
var un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn = t((() => {
	un = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", dn = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", fn = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", pn = "(\\d?\\d)", mn = "(\\d{4})", hn = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), gn = RegExp(`^${un}, ${pn} ${dn} ${mn} ${fn} GMT$`), _n = RegExp(`^${un}, ${pn}-${dn}-(\\d\\d) ${fn} GMT$`), vn = RegExp(`^${un} ${dn} ( [1-9]|\\d\\d) ${fn} ${mn}$`), yn = [
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
	], bn = (e) => {
		if (e == null) return;
		let t = NaN;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") {
			if (!/^-?\d*\.?\d+$/.test(e)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
			t = Number.parseFloat(e);
		} else typeof e == "object" && e.tag === 1 && (t = e.value);
		if (isNaN(t) || Math.abs(t) === Infinity) throw TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(t * 1e3));
	}, xn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC3339 timestamps must be strings");
		let t = hn.exec(e);
		if (!t) throw TypeError(`Invalid RFC3339 timestamp format ${e}`);
		let [, n, r, i, a, o, s, , c, l] = t;
		ln(r, 1, 12), ln(i, 1, 31), ln(a, 0, 23), ln(o, 0, 59), ln(s, 0, 60);
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
	}, Sn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC7231 timestamps must be strings.");
		let t, n, r, i, a, o, s, c;
		if ((c = gn.exec(e)) ? [, t, n, r, i, a, o, s] = c : (c = _n.exec(e)) ? ([, t, n, r, i, a, o, s] = c, r = (Number(r) + 1900).toString()) : (c = vn.exec(e)) && ([, n, t, i, a, o, s, r] = c), r && o) {
			let e = Date.UTC(Number(r), yn.indexOf(n), Number(t), Number(i), Number(a), Number(o), s ? Math.round(parseFloat(`0.${s}`) * 1e3) : 0);
			ln(t, 1, 31), ln(i, 0, 23), ln(a, 0, 59), ln(o, 0, 60);
			let c = new Date(e);
			return c.setUTCFullYear(Number(r)), c;
		}
		throw TypeError(`Invalid RFC7231 date-time value ${e}.`);
	};
})), wn, Tn = t((() => {
	wn = (e) => {
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
})), En, Dn, On = t((() => {
	En = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, Dn = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !En.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && En.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function kn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in jn) t[n / 2] = jn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function E(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += An[e[n]];
	return t;
}
var An, jn, Mn = t((() => {
	An = {}, jn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), An[e] = t, jn[t] = e;
	}
})), Nn, Pn, Fn = t((() => {
	Nn = typeof TextEncoder == "function" ? new TextEncoder() : null, Pn = (e) => {
		if (typeof e == "string") {
			if (Nn) return Nn.encode(e).byteLength;
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
})), In, Ln = t((() => {
	gt(), In = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? ht(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Rn(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var zn = t((() => {})), Bn, Vn = t((() => {
	Bn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), Hn, Un = t((() => {
	Hn = async (e) => void 0;
})), Wn, Gn, Kn, qn, Jn, Yn, Xn = t((() => {
	Wn = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), Yn(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!Jn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Gn = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Kn = /(\d+\.){3}\d+/, qn = /\.\./, Jn = (e) => Gn.test(e) && !Kn.test(e) && !qn.test(e), Yn = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Zn = t((() => {
	Xn();
})), Qn, $n = t((() => {
	Qn = (e, t, n, r = !1) => {
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
})), er = t((() => {
	S();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function tr(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(ge(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await nr(t, n, r);
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
var nr, rr = t((() => {
	Zn(), $n(), er(), nr = async (e, t, n) => {
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
				r[t] = await Qn(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Wn(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function ir(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function ar(e) {
	let t = tr(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && ir(i, "ENDPOINT_OVERRIDE", "N");
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
var or = t((() => {
	S(), rr();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function sr(e) {
	let t = ar(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), lr);
	} });
}
var cr, lr, ur = t((() => {
	or(), cr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, lr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: cr.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function dr(e) {
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
var fr = t((() => {
	S(), er();
})), pr, mr = t((() => {
	pr = class e {
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
})), hr, gr = t((() => {
	hr = class {
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
})), D, _r = t((() => {
	D = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), vr = t((() => {
	_r();
})), yr, br = t((() => {
	yr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function xr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${xr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(xr).join(", ")})` : JSON.stringify(e, null, 2);
}
var Sr = t((() => {})), Cr = t((() => {
	br(), Sr();
})), wr, Tr = t((() => {
	wr = {};
})), Er, Dr = t((() => {
	Er = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function Or(...e) {
	for (let t of e) if (t != null) return t;
}
var kr = t((() => {})), Ar, jr = t((() => {
	vr(), Ar = (e) => {
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
})), Mr, Nr = t((() => {
	vr(), jr(), Mr = (e, t) => Ar(t).reduce((n, r) => {
		if (typeof n != "object") throw new D(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Pr, Fr = t((() => {
	Pr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Ir(e, t, n) {
	return e ? t : n;
}
var Lr = t((() => {})), Rr, zr = t((() => {
	Rr = (e) => !e;
})), Br, Vr, Hr = t((() => {
	Br = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), Vr = (e) => Br.test(e) || e.startsWith("[") && e.endsWith("]");
})), Ur, Wr, Gr = t((() => {
	_(), Hr(), Ur = {
		[u.HTTP]: 80,
		[u.HTTPS]: 443
	}, Wr = (e) => {
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
		let l = Vr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Ur[c]}`) || typeof e == "string" && e.includes(`${r}:${Ur[c]}`) ? `:${Ur[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Kr(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var qr = t((() => {})), Jr, Yr = t((() => {
	Jr = (e, t) => e === t;
})), Xr, Zr = t((() => {
	Xr = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Qr, $r = t((() => {
	Qr = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), ei = t((() => {
	Dr(), kr(), Nr(), Fr(), S(), Lr(), zr(), Gr(), qr(), Yr(), Zr(), $r();
})), ti, ni = t((() => {
	ei(), ti = {
		booleanEquals: Er,
		coalesce: Or,
		getAttr: Mr,
		isSet: Pr,
		isValidHostLabel: se,
		ite: Ir,
		not: Rr,
		parseURL: Wr,
		split: Kr,
		stringEquals: Jr,
		substring: Xr,
		uriEncode: Qr
	};
})), ri, ii = t((() => {
	ei(), ri = (e, t) => {
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
				n.push(Mr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), ai, oi = t((() => {
	ai = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), si, ci, li, ui = t((() => {
	vr(), Tr(), ni(), ii(), oi(), si = (e, t, n) => {
		if (typeof e == "string") return ri(e, n);
		if (e.fn) return li.callFunction(e, n);
		if (e.ref) return ai(e, n);
		throw new D(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, ci = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = li.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = wr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = ti[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, li = {
		evaluateExpression: si,
		callFunction: ci
	};
})), di = t((() => {
	ui();
})), fi, pi = t((() => {
	Cr(), vr(), di(), fi = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new D(`'${n}' is already defined in Reference Record.`);
		let r = ci(e, t);
		t.logger?.debug?.(`${yr} evaluateCondition: ${xr(e)} = ${xr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), mi, hi = t((() => {
	vr(), ui(), mi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = si(e, "Header value entry", t);
		if (typeof r != "string") throw new D(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), gi, _i, vi, yi = t((() => {
	vr(), ii(), gi = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = vi.getEndpointProperty(r, t), e), {}), _i = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => _i(e, t));
		switch (typeof e) {
			case "string": return ri(e, t);
			case "object":
				if (e === null) throw new D(`Unexpected endpoint property: ${e}`);
				return vi.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new D(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, vi = {
		getEndpointProperty: _i,
		getEndpointProperties: gi
	};
})), bi, xi = t((() => {
	vr(), ui(), bi = (e, t) => {
		let n = si(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new D(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), Si, Ci, wi = t((() => {
	vr(), pi(), ui(), hi(), yi(), xi(), Si = 1e8, Ci = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < Si;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = fi({
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
		if (o >= Si) {
			let e = i[o - Si];
			if (e[0] === -1) {
				let [, t] = e;
				throw new D(si(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: bi(t, c),
				properties: gi(n, c),
				headers: mi(r ?? {}, c)
			};
		}
		throw new D("No matching endpoint.");
	};
})), Ti, Ei, Di = t((() => {
	Un(), rr(), or(), ur(), fr(), S(), mr(), gr(), wi(), Hr(), Tr(), Cr(), vr(), pi(), hi(), yi(), xi(), ui(), er(), Ti = dr(Hn), ar(Hn), Ei = sr(Hn);
})), Oi, ki = t((() => {
	Oi = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Ai(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function ji(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Rn(t, r);
}
var Mi, Ni = t((() => {
	zn(), ki(), Mi = async (e) => Oi(e) ? Ai(e) : ji(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Pi(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Fi = t((() => {})), Ii, Li, Ri, zi, O = t((() => {
	mt(), vt(), bt(), gt(), St(), wt(), on(), cn(), Bt(), Cn(), Tn(), On(), Mn(), Fn(), Ln(), zn(), Vn(), S(), Di(), ki(), Ni(), Fi(), Ii = class extends yt(xt, ht, _t, pt) {}, Li = (e) => crypto.getRandomValues(e), Ri = Ct(Li), zi = Ri;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
O();
var Bi = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return Ii.mutate(e);
	if (!e) return Ii.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return Ii.mutate(await n);
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function Vi(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
		return "%" + e.charCodeAt(0).toString(16).toUpperCase();
	});
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var Hi = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Ui, Wi, Gi, Ki = t((() => {
	Ui = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Ui[e] = t >>> 0;
	}
	Wi = 4294967295, Gi = class {
		digestLength = 4;
		checksum = Wi;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Ui[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Wi) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Wi;
		}
	};
})), k, qi, Ji, Yi, Xi, Zi, Qi = t((() => {
	O(), k = 64, qi = 32, Ji = 2 ** 53 - 1, Yi = class e {
		digestLength = qi;
		state = Int32Array.from(Xi);
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
			let t = In(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > Ji) throw Error("Cannot hash more than 2^53 - 1 bits");
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
			this.state = Int32Array.from(Xi), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % k >= 56) {
				for (let e = n; e < k; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(qi);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = In(t);
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
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Zi[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, Xi = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Zi = new Int32Array([
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
})), $i, ea, ta, na, ra, ia, aa = t((() => {
	O(), Qi(), {digest: $i, sign: ea, importKey: ta} = globalThis?.crypto?.subtle ?? {}, na = typeof $i == "function" && typeof ea == "function" && typeof ta == "function" ? globalThis.crypto.subtle : void 0, ra = 8388608, ia = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = In(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= ra && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Rn(this.pending);
			if (na) {
				if (this.secret) {
					this.finished = !0;
					let t = await na.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await na.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await na.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Yi(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Yi(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), oa = t((() => {
	O(), Ki(), Qi(), aa();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function sa(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var ca, la = t((() => {
	O(), ca = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && sa(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && sa(e), parseInt(E(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba, xa, Sa, Ca = t((() => {
	S(), O(), la(), ua = class {
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
					if (e.value.byteLength > Sa) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${Sa} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > Sa) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${Sa} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(ca.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!xa.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(kn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: fa,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: fa,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: pa,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: ma,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: ha,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: ga,
							value: new ca(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: _a,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: va,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: ya,
							value: new Date(new ca(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: ba,
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
	})(da ||= {}), fa = "boolean", pa = "byte", ma = "short", ha = "integer", ga = "long", _a = "binary", va = "string", ya = "timestamp", ba = "uuid", xa = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Sa = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function wa({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Oa) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(Ta, !1), o = r.getUint32(Ea, !1), s = r.getUint32(e - Da, !1), c = new Gi();
	if (c.update(new Uint8Array(n, t, Ea)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + Ea, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + Ea + Da, a),
		body: new Uint8Array(n, t + Ea + Da + a, i - a - 16)
	};
}
var Ta, Ea, Da, Oa, ka = t((() => {
	oa(), Ta = 4, Ea = 8, Da = 4, Oa = 16;
})), Aa, ja = t((() => {
	oa(), Ca(), ka(), Aa = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new ua(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Gi();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = wa(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), Ma, Na = t((() => {
	Ma = class {
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
})), Pa, Fa = t((() => {
	Pa = class {
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
})), Ia, La = t((() => {
	Ia = class {
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
})), Ra, za = t((() => {
	Ra = class {
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
function Ba(e) {
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
var Va = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ha(e, t) {
	let n = Ua(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Ua(e, t) {
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
var Wa = t((() => {})), Ga, Ka, qa = t((() => {
	ja(), Na(), Fa(), La(), za(), Va(), Wa(), Ga = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new Aa(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Ba(e);
			return new Ia({
				messageStream: new Ma({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Ua(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Pa({
				messageStream: new Ra({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Ka = (e) => new Ga(e);
})), Ja, Ya, Xa = t((() => {
	Ja = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), Ya = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Za, Qa, $a, eo = t((() => {
	qa(), Xa(), Za = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Ga({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Qa(e) ? Ja(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Ya(n) : n;
		}
	}, Qa = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, $a = (e) => new Za(e);
})), to, no = t((() => {
	to = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), ro, io = t((() => {
	S(), w(), O(), ro = class {
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
})), ao = /* @__PURE__ */ n({
	EventStreamCodec: () => Aa,
	EventStreamMarshaller: () => Za,
	EventStreamSerde: () => ro,
	HeaderMarshaller: () => ua,
	Int64: () => ca,
	MessageDecoderStream: () => Ma,
	MessageEncoderStream: () => Pa,
	SmithyMessageDecoderStream: () => Ia,
	SmithyMessageEncoderStream: () => Ra,
	UniversalEventStreamMarshaller: () => Ga,
	eventStreamSerdeProvider: () => $a,
	getChunkedStream: () => Ba,
	getMessageUnmarshaller: () => Ua,
	getUnmarshalledStream: () => Ha,
	iterableToReadableStream: () => Ya,
	readableStreamToIterable: () => Ja,
	resolveEventStreamSerdeConfig: () => to,
	universalEventStreamSerdeProvider: () => Ka
}), oo = t((() => {
	ja(), Ca(), la(), Na(), Fa(), La(), za(), eo(), Xa(), qa(), Va(), Wa(), no(), io();
}));
S(), w();
var so = class extends Hi {
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (oo(), ao));
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
var co = class extends so {
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
			let i = await Bi(n.body, t);
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
			let e = await Bi(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function lo(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
w(), O();
var uo = class extends Hi {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	read(e, t) {
		let n = C.of(e);
		if (n.isListSchema()) return wn(t).map((e) => this.read(n.getValueSchema(), e));
		if (n.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? pt)(t);
		if (n.isTimestampSchema()) switch (lo(n, this.settings)) {
			case 5: return xn(t);
			case 6: return Sn(t);
			case 7: return bn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (n.isStringSchema()) {
			let e = n.getMergedTraits().mediaType, r = t;
			if (e) return n.getMergedTraits().httpHeader && (r = this.base64ToUtf8(r)), (e === "application/json" || e.endsWith("+json")) && (r = sn.from(r)), r;
		}
		return n.isNumericSchema() ? Number(t) : n.isBigIntegerSchema() ? BigInt(t) : n.isBigDecimalSchema() ? new Dn(t, "bigDecimal") : n.isBooleanSchema() ? String(t).toLowerCase() === "true" : t;
	}
	base64ToUtf8(e) {
		return (this.serdeContext?.utf8Encoder ?? xt)((this.serdeContext?.base64Decoder ?? pt)(e));
	}
}, fo = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), po = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
S();
var mo = "content-length";
function ho(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (b.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(mo) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[mo]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var go = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, _o = (e) => ({ applyToStack: (t) => {
	t.add(ho(e.bodyLengthChecker), go);
} }), vo = (e) => encodeURIComponent(e).replace(/[!'()*]/g, yo), yo = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function bo(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = vo(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${vo(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${vo(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/service-error-classification/constants.js
var xo = [
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
], So = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], Co = [
	500,
	502,
	503,
	504
], wo = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], To = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], Eo = (e) => e?.$retryable !== void 0, Do = (e) => e.$metadata?.clockSkewCorrected, Oo = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, ko = (e) => e.$metadata?.httpStatusCode === 429 || xo.includes(e.name) || e.$retryable?.throttling == 1, Ao = (e, t = 0) => e?.name !== "AbortError" && (Eo(e) || Do(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || So.includes(e.name) || wo.includes(e?.code || "") || To.includes(e?.code || "") || Co.includes(e.$metadata?.httpStatusCode || 0) || Oo(e) || Mo(e) || e.cause !== void 0 && t <= 10 && Ao(e.cause, t + 1)), jo = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !Ao(e);
	}
	return !1;
};
function Mo(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var No = 2e4, Po = "amz-sdk-invocation-id", Fo = "amz-sdk-request";
S(), ae(), O();
function Io(e, t) {
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
var Lo = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
re(), O();
function Ro(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (Bo(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = b.isInstance(d);
			for (f && (d.headers[Po] = Ri());;) try {
				f && (d.headers[Fo] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = Vo(n, t.logger);
				if (c = Lo(n), f && e(d)) throw (r.logger instanceof st ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await zo(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var zo = (e) => new Promise((t) => setTimeout(t, e)), Bo = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, Vo = (e, t) => {
	let n = {
		error: e,
		errorType: Ho(e)
	}, r = Io(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, Ho = (e) => ko(e) ? "THROTTLING" : Ao(e) ? "TRANSIENT" : jo(e) ? "SERVER_ERROR" : "CLIENT_ERROR", Uo = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function Wo(e) {
	let t = Ro(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), Uo);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var Go = class e {
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
		if (n?.errorType === "THROTTLING" || ko(n?.error ?? e)) {
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
}, Ko = class {
	x = A.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, No);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, qo = class {
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
		return Math.min(No, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Jo;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Jo ||= {});
var Yo = Jo.STANDARD, Xo = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, Zo = class {
	mode = Jo.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= A.delay(), this.retryBackoffStrategy ??= new Ko();
	}
	async acquireInitialRetryToken(e) {
		return new qo(A.delay(), 0, void 0, A.v2026 && e.includes(":longpoll"));
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
				let r = new qo(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = A.v2026 && r === Xo.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : Xo.incompatible, a = r < n ? 0 : Xo.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : Xo.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === A.modifiedCostType() ? A.throttlingCost() : A.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, Qo = class {
	mode = Jo.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new Go(), this.standardRetryStrategy = t ? new Zo({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new Zo(e);
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
var $o = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = A.delay() } = t ?? {}, o = x(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await x(r)() === Jo.ADAPTIVE ? new Qo(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new Zo({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, es = Wo(i);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
A.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function j(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
re();
function ts(e) {
	return e;
}
var ns = (e) => (t) => async (n) => {
	if (!b.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, rs = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, is = (e) => ({ applyToStack: (t) => {
	t.add(ns(e), rs);
} }), as = () => (e, t) => async (n) => {
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
}, os = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, ss = (e) => ({ applyToStack: (e) => {
	e.add(as(), os);
} }), cs = (e) => ({ applyToStack: (e) => {} }), ls = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
S();
function us(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var ds = (e, t) => (n, r) => async (i) => {
	let a = ls(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = us(e.httpAuthSchemes), s = v(r), c = [];
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
}, fs = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, ps = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(ds(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), fs);
} });
re(), S();
var ms = (e) => (e) => {
	throw e;
}, hs = (e, t) => {}, gs = (e) => (e, t) => async (n) => {
	if (!b.isInstance(n.request)) return e(n);
	let r = v(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || ms)(i));
	return (o.successHandler || hs)(s.response, i), s;
}, _s = {
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
}, vs = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(gs(e), _s);
} }), ys = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
S();
var bs = class {
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
}, xs = ((e) => function(t) {
	return Ss(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), Ss = (e) => e.expiration !== void 0, Cs = (e, t, n) => {
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
function ws(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Ts(e) {
	let t = ys(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!ws(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var Es = {
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
}, Ds = "", Os = (e) => {
	let { partitions: t } = Es;
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
}, ks = () => Ds, As = /\d{12}\.ddb/;
async function js(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && j(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Jo.ADAPTIVE:
				j(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Jo.STANDARD: j(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(As) && j(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				j(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				j(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": j(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && j(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) j(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Ms = "user-agent", Ns = "x-amz-user-agent", Ps = /[^!$%&'*+\-.^_`|~\w]/g, Fs = /[^!$%&'*+\-.^_`|~\w#]/g, Is = 1024;
function Ls(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= Is) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
re();
var Rs = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!b.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(zs) || [], s = (await e.defaultUserAgentProvider()).map(zs);
	await js(n, e, r);
	let c = n;
	s.push(`m/${Ls(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(zs) || [], u = await e.userAgentAppId();
	u && s.push(zs(["app", `${u}`]));
	let d = ks(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Ns] = f : (p && (a[Ns] = a["x-amz-user-agent"] ? `${a[Ms]} ${p}` : p), a[Ms] = f), t({
		...r,
		request: i
	});
}, zs = (e) => {
	let t = e[0].split("/").map((e) => e.replace(Ps, "-")).join("/"), n = e[1]?.replace(Fs, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, Bs = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, Vs = (e) => ({ applyToStack: (t) => {
	t.add(Rs(e), Bs);
} }), Hs = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? Us.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? Us.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, Us = {
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
Di(), Hr();
var Ws = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!Ws(t)) return !1;
		return !0;
	}
	return !(!se(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || Vr(e));
}, Gs = ":", Ks = "/", qs = (e) => {
	let t = e.split(Gs);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(Gs) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(Ks)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
Di();
var Js = {
	isVirtualHostableS3Bucket: Ws,
	parseArn: qs,
	partition: Os
};
wr.aws = Js;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var Ys = (e, t, n) => {
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
var Xs = /* @__PURE__ */ new Set(), Zs = (e, t = se) => {
	if (!Xs.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else Xs.add(e);
}, Qs = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), $s = (e) => Qs(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, ec = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = $s(typeof t == "function" ? await t() : t);
			return Zs(e), e;
		},
		useFipsEndpoint: async () => Qs(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, tc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], nc = ({ defaultsMode: e } = {}) => Ys(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(rc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${tc.join(", ")}, got ${t}`);
	}
}), rc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, ic = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), ac = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ae();
var oc = (e) => ie.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, sc = (e) => ie.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, cc = (e) => new Date(Date.now() + e), lc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
re(), _();
var uc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, dc = (e) => e.context?.[h]?.eventStream?.output === !0, fc = async (e) => {
	let t = uc("context", e.context), n = uc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await uc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, pc = class {
	async sign(e, t, n) {
		if (!b.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await fc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || dc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : cc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? oc(n.$response);
				if (t) {
					let r = uc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = sc(n.$response), s = lc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = oc(e);
		if (n) {
			let r = uc("config", t.config), i = t._requestSentAt, a = sc(e);
			r.systemClockOffset = lc(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
O();
var mc = class {
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
				return l[0] = 8, l.set(_c.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!gc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(kn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, hc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(hc ||= {});
var gc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, _c = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && vc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && vc(e), parseInt(E(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function vc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var yc = "X-Amz-Algorithm", bc = "X-Amz-Credential", xc = "X-Amz-Date", Sc = "X-Amz-SignedHeaders", Cc = "X-Amz-Expires", wc = "X-Amz-Signature", Tc = "X-Amz-Security-Token", Ec = "authorization", Dc = xc.toLowerCase(), Oc = [
	Ec,
	Dc,
	"date"
];
wc.toLowerCase();
var kc = "x-amz-content-sha256", Ac = Tc.toLowerCase(), jc = {
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
}, Mc = /^proxy-/, Nc = /^sec-/, Pc = "AWS4-HMAC-SHA256", Fc = "AWS4-HMAC-SHA256-PAYLOAD", Ic = "UNSIGNED-PAYLOAD", Lc = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
O();
var Rc = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!y(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = vo(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${vo(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${vo(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, zc = (e) => Bc(e).toISOString().replace(/\.\d{3}Z$/, "Z"), Bc = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
de(), O();
var Vc = class {
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
${Rc(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(In(n)), `${r}
${e}
${t}
${E(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return vo(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = zc(e).replace(/[-:]/g, "");
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
var Hc = {}, Uc = [], Wc = (e, t, n) => `${e}/${t}/${n}/${Lc}`, Gc = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${E(await Kc(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Hc) return Hc[a];
	for (Uc.push(a); Uc.length > 50;) delete Hc[Uc.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Lc
	]) o = await Kc(e, o, t);
	return Hc[a] = o;
}, Kc = (e, t, n) => {
	let r = new e(t);
	return r.update(In(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
O();
var qc = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(y(jc, a) || t?.has(a) || Mc.test(a) || Nc.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Pi(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
O();
var Jc = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (y(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Bn(t)) {
		let e = new n();
		return e.update(In(t)), E(await e.digest());
	}
	return Ic;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
O();
var Yc = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (y(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
O(), re();
var Xc = (e, t = {}) => {
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
var Zc = (e) => {
	e = b.clone(e);
	for (let t in e.headers) y(e.headers, t) && Oc.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
O();
var Qc = class extends Vc {
	headerFormatter = new mc();
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
		let m = Wc(p, d, l ?? this.service), h = Xc(Zc(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[Tc] = u.sessionToken), h.query[yc] = Pc, h.query[bc] = `${u.accessKeyId}/${m}`, h.query[xc] = f, h.query[Cc] = r.toString(10);
		let g = qc(h, i, o);
		return h.query[Sc] = this.getCanonicalHeaderList(g), h.query[wc] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await Jc(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = Wc(c, s, a ?? this.service), d = await Jc({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Fc,
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
		return c.update(In(e)), E(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = Zc(e), { longDate: l, shortDate: u } = this.formatDate(t), d = Wc(u, s, a ?? this.service);
		c.headers[Dc] = l, o.sessionToken && (c.headers[Ac] = o.sessionToken);
		let f = await Jc(c, this.sha256);
		!Yc("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[kc] = f);
		let p = qc(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[Ec] = `${Pc} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, Pc), a = new this.sha256(await n);
		return a.update(In(i)), E(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Gc(this.sha256, e, n, t, r || this.service);
	}
}, $c = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = tl(t, el(t, {
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
	return l = t.signer ? ys(t.signer) : t.regionInfoProvider ? () => ys(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || Qc)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await ys(t.region)(),
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
		return new (t.signerConstructor || Qc)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: ys(t.disableClockSkewCorrection ?? e)
	});
};
function el(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Cs(t, xs, Ss) : n ? ys(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function tl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var nl = $c(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/auth/httpAuthSchemeProvider.js
ee(), de();
var rl = async (e, t, n) => ({
	operation: v(t).operation,
	region: await x(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function il(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "rds",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var al = (e) => {
	let t = [];
	return e.operation, t.push(il(e)), t;
}, ol = (e) => {
	let t = nl(e);
	return Object.assign(t, { authSchemePreference: x(e.authSchemePreference ?? []) });
}, sl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "rds"
}), cl = {
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
}, ll = {
	name: "@aws-sdk/client-rds",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Rds Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-rds",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-rds"
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
		"@aws-sdk/middleware-sdk-rds": "^3.972.64",
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
function ul(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function dl(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ae();
var fl = { supported: void 0 }, pl = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), fl.supported === void 0 && (fl.supported = typeof Request < "u" && "keepalive" in ul("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = ml(t);
			return Promise.reject(e);
		}
		let s = e.path, c = bo(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), fl.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(ul(f, m)).then((e) => {
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
		}), dl(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(ml(t));
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
function ml(e) {
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
var hl = class {
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
}, gl;
function _l(e) {
	gl ||= new DOMParser();
	let t = gl.parseFromString(e, "application/xml");
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
var vl = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, yl = class {
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
function bl(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
w(), O();
var xl = class extends vl {
	settings;
	stringDeserializer;
	constructor(e) {
		super(), this.settings = e, this.stringDeserializer = new uo(e);
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
					t === "__proto__" && bl(i), i[t] = this.readSchema(a, n);
				}
				return i;
			}
			if (n.isStructSchema()) {
				let e = n.isUnionSchema(), r;
				e && (r = new yl(t, i));
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
				t = _l(e);
			} catch (t) {
				throw t && typeof t == "object" && Object.defineProperty(t, "$responseBodyText", { value: e }), t;
			}
			let n = "#text", r = Object.keys(t)[0], i = t[r];
			return i[n] && (i[r] = i[n], delete i[n]), ot(i);
		}
		return {};
	}
};
w(), O();
var Sl = class extends vl {
	settings;
	buffer;
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t, n = "") {
		this.buffer === void 0 && (this.buffer = "");
		let r = C.of(e);
		if (n && !n.endsWith(".") && (n += "."), r.isBlobSchema()) (typeof t == "string" || t instanceof Uint8Array) && (this.writeKey(n), this.writeValue((this.serdeContext?.base64Encoder ?? _t)(t)));
		else if (r.isBooleanSchema() || r.isNumericSchema() || r.isStringSchema()) t == null ? r.isIdempotencyToken() && (this.writeKey(n), this.writeValue(zi())) : (this.writeKey(n), this.writeValue(String(t)));
		else if (r.isBigIntegerSchema()) t != null && (this.writeKey(n), this.writeValue(String(t)));
		else if (r.isBigDecimalSchema()) t != null && (this.writeKey(n), this.writeValue(t instanceof Dn ? t.string : String(t)));
		else if (r.isTimestampSchema()) {
			if (t instanceof Date) switch (this.writeKey(n), lo(r, this.settings)) {
				case 5:
					this.writeValue(t.toISOString().replace(".000Z", "Z"));
					break;
				case 6:
					this.writeValue(Vt(t));
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
		e.endsWith(".") && (e = e.slice(0, e.length - 1)), this.buffer += `&${Vi(e)}=`;
	}
	writeValue(e) {
		this.buffer += Vi(e);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/query/AwsQueryProtocol.js
w();
var Cl = class extends co {
	options;
	serializer;
	deserializer;
	mixin = new hl();
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
		this.serializer = new Sl(t), this.deserializer = new xl(t);
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
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = "application/x-www-form-urlencoded", be(e.input) !== "unit" && r.body || (r.body = ""), r.body = `Action=${e.name.split("#")[1] ?? e.name}&Version=${this.options.version}` + r.body, r.body.endsWith("&") && (r.body = r.body.slice(-1)), r;
	}
	async deserializeResponse(e, t, n) {
		let r = this.deserializer, i = C.of(e.output), a = {};
		if (n.statusCode >= 300) {
			let i = await Bi(n.body, t);
			i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n));
		}
		for (let e in n.headers) {
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = e.name.split("#")[1] ?? e.name, s = i.isStructSchema() && this.useNestedResult() ? o + "Result" : void 0, c = await Bi(n.body, t);
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
		let { errorSchema: c, errorMetadata: l } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, o, i, this.mixin.findQueryCompatibleError), u = C.of(c), d = new ((this.compositeErrorRegistry.getErrorCtor(c)) ?? Error)({}), f = {
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
};
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/endpoint/bdd.js
Di();
var wl = "ref", Tl = -1, El = !0, Dl = "isSet", Ol = "PartitionResult", kl = "booleanEquals", Al = "getAttr", jl = { [wl]: "Endpoint" }, Ml = { [wl]: Ol }, Nl = {}, Pl = [{ [wl]: "Region" }], Fl = {
	conditions: [
		[Dl, [jl]],
		[Dl, Pl],
		[
			"aws.partition",
			Pl,
			Ol
		],
		[kl, [{ [wl]: "UseFIPS" }, El]],
		[kl, [{ [wl]: "UseDualStack" }, El]],
		[kl, [{
			fn: Al,
			argv: [Ml, "supportsDualStack"]
		}, El]],
		[kl, [{
			fn: Al,
			argv: [Ml, "supportsFIPS"]
		}, El]],
		["stringEquals", [{
			fn: Al,
			argv: [Ml, "name"]
		}, "aws-us-gov"]]
	],
	results: [
		[Tl],
		[Tl, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Tl, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[jl, Nl],
		["https://rds-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Nl],
		[Tl, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://rds.{Region}.amazonaws.com", Nl],
		["https://rds-fips.{Region}.{PartitionResult#dnsSuffix}", Nl],
		[Tl, "FIPS is enabled but this partition does not support FIPS"],
		["https://rds.{Region}.{PartitionResult#dualStackDnsSuffix}", Nl],
		[Tl, "DualStack is enabled but this partition does not support DualStack"],
		["https://rds.{Region}.{PartitionResult#dnsSuffix}", Nl],
		[Tl, "Invalid Configuration: Missing Region"]
	]
}, Il = 2, Ll = new Int32Array([
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
]), Rl = pr.from(Ll, Il, Fl.conditions, Fl.results);
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/endpoint/endpointResolver.js
Di();
var zl = new hr({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), Bl = (e, t = {}) => zl.get(e, () => Ci(Rl, {
	endpointParams: e,
	logger: t.logger
}));
wr.aws = Js;
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/models/RDSServiceException.js
var M = class e extends Xe {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.rds#RDSServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, Vl = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterNotFoundFault";
	name = "DBClusterNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Hl = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterRoleAlreadyExistsFault";
	name = "DBClusterRoleAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterRoleAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ul = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterRoleQuotaExceededFault";
	name = "DBClusterRoleQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterRoleQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Wl = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBClusterStateFault";
	name = "InvalidDBClusterStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBClusterStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Gl = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceNotFoundFault";
	name = "DBInstanceNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Kl = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceRoleAlreadyExistsFault";
	name = "DBInstanceRoleAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceRoleAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ql = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceRoleQuotaExceededFault";
	name = "DBInstanceRoleQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceRoleQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Jl = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBInstanceStateFault";
	name = "InvalidDBInstanceStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBInstanceStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Yl = class e extends M {
	static shapeId = "com.amazonaws.rds#SourceNotFoundFault";
	name = "SourceNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SourceNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Xl = class e extends M {
	static shapeId = "com.amazonaws.rds#SubscriptionNotFoundFault";
	name = "SubscriptionNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SubscriptionNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Zl = class e extends M {
	static shapeId = "com.amazonaws.rds#BlueGreenDeploymentNotFoundFault";
	name = "BlueGreenDeploymentNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "BlueGreenDeploymentNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ql = class e extends M {
	static shapeId = "com.amazonaws.rds#DBCapacityReservationNotFoundFault";
	name = "DBCapacityReservationNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBCapacityReservationNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, $l = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyEndpointNotFoundFault";
	name = "DBProxyEndpointNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyEndpointNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, eu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyNotFoundFault";
	name = "DBProxyNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, tu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyTargetGroupNotFoundFault";
	name = "DBProxyTargetGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyTargetGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBShardGroupNotFoundFault";
	name = "DBShardGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBShardGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ru = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSnapshotNotFoundFault";
	name = "DBSnapshotNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSnapshotNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, iu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSnapshotTenantDatabaseNotFoundFault";
	name = "DBSnapshotTenantDatabaseNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSnapshotTenantDatabaseNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, au = class e extends M {
	static shapeId = "com.amazonaws.rds#IntegrationNotFoundFault";
	name = "IntegrationNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IntegrationNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ou = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBClusterEndpointStateFault";
	name = "InvalidDBClusterEndpointStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBClusterEndpointStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, su = class e extends M {
	static shapeId = "com.amazonaws.rds#TenantDatabaseNotFoundFault";
	name = "TenantDatabaseNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "TenantDatabaseNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cu = class e extends M {
	static shapeId = "com.amazonaws.rds#ResourceNotFoundFault";
	name = "ResourceNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lu = class e extends M {
	static shapeId = "com.amazonaws.rds#AuthorizationAlreadyExistsFault";
	name = "AuthorizationAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "AuthorizationAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, uu = class e extends M {
	static shapeId = "com.amazonaws.rds#AuthorizationQuotaExceededFault";
	name = "AuthorizationQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "AuthorizationQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, du = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSecurityGroupNotFoundFault";
	name = "DBSecurityGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSecurityGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, fu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBSecurityGroupStateFault";
	name = "InvalidDBSecurityGroupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBSecurityGroupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBCapacityReservationStateFault";
	name = "InvalidDBCapacityReservationStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBCapacityReservationStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, mu = class e extends M {
	static shapeId = "com.amazonaws.rds#ExportTaskNotFoundFault";
	name = "ExportTaskNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExportTaskNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidExportTaskStateFault";
	name = "InvalidExportTaskStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidExportTaskStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBParameterGroupAlreadyExistsFault";
	name = "DBParameterGroupAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBParameterGroupAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _u = class e extends M {
	static shapeId = "com.amazonaws.rds#DBParameterGroupNotFoundFault";
	name = "DBParameterGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBParameterGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, vu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBParameterGroupQuotaExceededFault";
	name = "DBParameterGroupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBParameterGroupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, yu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterSnapshotAlreadyExistsFault";
	name = "DBClusterSnapshotAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterSnapshotAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterSnapshotNotFoundFault";
	name = "DBClusterSnapshotNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterSnapshotNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBClusterSnapshotStateFault";
	name = "InvalidDBClusterSnapshotStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBClusterSnapshotStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Su = class e extends M {
	static shapeId = "com.amazonaws.rds#KMSKeyNotAccessibleFault";
	name = "KMSKeyNotAccessibleFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSKeyNotAccessibleFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Cu = class e extends M {
	static shapeId = "com.amazonaws.rds#SnapshotQuotaExceededFault";
	name = "SnapshotQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SnapshotQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, wu = class e extends M {
	static shapeId = "com.amazonaws.rds#CustomAvailabilityZoneNotFoundFault";
	name = "CustomAvailabilityZoneNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CustomAvailabilityZoneNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Tu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSnapshotAlreadyExistsFault";
	name = "DBSnapshotAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSnapshotAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Eu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBSnapshotStateFault";
	name = "InvalidDBSnapshotStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBSnapshotStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Du = class e extends M {
	static shapeId = "com.amazonaws.rds#OptionGroupAlreadyExistsFault";
	name = "OptionGroupAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "OptionGroupAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ou = class e extends M {
	static shapeId = "com.amazonaws.rds#OptionGroupNotFoundFault";
	name = "OptionGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "OptionGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ku = class e extends M {
	static shapeId = "com.amazonaws.rds#OptionGroupQuotaExceededFault";
	name = "OptionGroupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "OptionGroupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Au = class e extends M {
	static shapeId = "com.amazonaws.rds#BlueGreenDeploymentAlreadyExistsFault";
	name = "BlueGreenDeploymentAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "BlueGreenDeploymentAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ju = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterParameterGroupNotFoundFault";
	name = "DBClusterParameterGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterParameterGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Mu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterQuotaExceededFault";
	name = "DBClusterQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Nu = class e extends M {
	static shapeId = "com.amazonaws.rds#InstanceQuotaExceededFault";
	name = "InstanceQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InstanceQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Pu = class e extends M {
	static shapeId = "com.amazonaws.rds#SourceClusterNotSupportedFault";
	name = "SourceClusterNotSupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SourceClusterNotSupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Fu = class e extends M {
	static shapeId = "com.amazonaws.rds#SourceDatabaseNotSupportedFault";
	name = "SourceDatabaseNotSupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SourceDatabaseNotSupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Iu = class e extends M {
	static shapeId = "com.amazonaws.rds#StorageQuotaExceededFault";
	name = "StorageQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "StorageQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Lu = class e extends M {
	static shapeId = "com.amazonaws.rds#CreateCustomDBEngineVersionFault";
	name = "CreateCustomDBEngineVersionFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CreateCustomDBEngineVersionFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ru = class e extends M {
	static shapeId = "com.amazonaws.rds#CustomDBEngineVersionAlreadyExistsFault";
	name = "CustomDBEngineVersionAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CustomDBEngineVersionAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, zu = class e extends M {
	static shapeId = "com.amazonaws.rds#CustomDBEngineVersionNotFoundFault";
	name = "CustomDBEngineVersionNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CustomDBEngineVersionNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Bu = class e extends M {
	static shapeId = "com.amazonaws.rds#CustomDBEngineVersionQuotaExceededFault";
	name = "CustomDBEngineVersionQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CustomDBEngineVersionQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Vu = class e extends M {
	static shapeId = "com.amazonaws.rds#Ec2ImagePropertiesNotSupportedFault";
	name = "Ec2ImagePropertiesNotSupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "Ec2ImagePropertiesNotSupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Hu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidCustomDBEngineVersionStateFault";
	name = "InvalidCustomDBEngineVersionStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidCustomDBEngineVersionStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Uu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBCapacityReservationAlreadyExistsFault";
	name = "DBCapacityReservationAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBCapacityReservationAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Wu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBCapacityReservationUnsupportedFault";
	name = "DBCapacityReservationUnsupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBCapacityReservationUnsupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Gu = class e extends M {
	static shapeId = "com.amazonaws.rds#InsufficientDBInstanceCapacityFault";
	name = "InsufficientDBInstanceCapacityFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InsufficientDBInstanceCapacityFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ku = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterAlreadyExistsFault";
	name = "DBClusterAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, qu = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetGroupDoesNotCoverEnoughAZs";
	name = "DBSubnetGroupDoesNotCoverEnoughAZs";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetGroupDoesNotCoverEnoughAZs",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ju = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetGroupNotFoundFault";
	name = "DBSubnetGroupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetGroupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Yu = class e extends M {
	static shapeId = "com.amazonaws.rds#DomainNotFoundFault";
	name = "DomainNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DomainNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Xu = class e extends M {
	static shapeId = "com.amazonaws.rds#GlobalClusterNotFoundFault";
	name = "GlobalClusterNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "GlobalClusterNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Zu = class e extends M {
	static shapeId = "com.amazonaws.rds#InsufficientStorageClusterCapacityFault";
	name = "InsufficientStorageClusterCapacityFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InsufficientStorageClusterCapacityFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Qu = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBSubnetGroupFault";
	name = "InvalidDBSubnetGroupFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBSubnetGroupFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, $u = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBSubnetGroupStateFault";
	name = "InvalidDBSubnetGroupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBSubnetGroupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ed = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidGlobalClusterStateFault";
	name = "InvalidGlobalClusterStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidGlobalClusterStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, td = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidSubnet";
	name = "InvalidSubnet";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidSubnet",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidVPCNetworkStateFault";
	name = "InvalidVPCNetworkStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidVPCNetworkStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, rd = class e extends M {
	static shapeId = "com.amazonaws.rds#NetworkTypeNotSupported";
	name = "NetworkTypeNotSupported";
	$fault = "client";
	constructor(t) {
		super({
			name: "NetworkTypeNotSupported",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, id = class e extends M {
	static shapeId = "com.amazonaws.rds#StorageTypeNotSupportedFault";
	name = "StorageTypeNotSupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "StorageTypeNotSupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ad = class e extends M {
	static shapeId = "com.amazonaws.rds#VpcEncryptionControlViolationException";
	name = "VpcEncryptionControlViolationException";
	$fault = "client";
	constructor(t) {
		super({
			name: "VpcEncryptionControlViolationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, od = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterEndpointAlreadyExistsFault";
	name = "DBClusterEndpointAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterEndpointAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, sd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterEndpointQuotaExceededFault";
	name = "DBClusterEndpointQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterEndpointQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cd = class e extends M {
	static shapeId = "com.amazonaws.rds#AuthorizationNotFoundFault";
	name = "AuthorizationNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "AuthorizationNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ld = class e extends M {
	static shapeId = "com.amazonaws.rds#BackupPolicyNotFoundFault";
	name = "BackupPolicyNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "BackupPolicyNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ud = class e extends M {
	static shapeId = "com.amazonaws.rds#CertificateNotFoundFault";
	name = "CertificateNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "CertificateNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, dd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceAlreadyExistsFault";
	name = "DBInstanceAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, fd = class e extends M {
	static shapeId = "com.amazonaws.rds#ProvisionedIopsNotAvailableInAZFault";
	name = "ProvisionedIopsNotAvailableInAZFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ProvisionedIopsNotAvailableInAZFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pd = class e extends M {
	static shapeId = "com.amazonaws.rds#TenantDatabaseQuotaExceededFault";
	name = "TenantDatabaseQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "TenantDatabaseQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, md = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetGroupNotAllowedFault";
	name = "DBSubnetGroupNotAllowedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetGroupNotAllowedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyAlreadyExistsFault";
	name = "DBProxyAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyQuotaExceededFault";
	name = "DBProxyQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _d = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyEndpointAlreadyExistsFault";
	name = "DBProxyEndpointAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyEndpointAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, vd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyEndpointQuotaExceededFault";
	name = "DBProxyEndpointQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyEndpointQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, yd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBProxyStateFault";
	name = "InvalidDBProxyStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBProxyStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSecurityGroupAlreadyExistsFault";
	name = "DBSecurityGroupAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSecurityGroupAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSecurityGroupNotSupportedFault";
	name = "DBSecurityGroupNotSupportedFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSecurityGroupNotSupportedFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Sd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSecurityGroupQuotaExceededFault";
	name = "DBSecurityGroupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSecurityGroupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Cd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBShardGroupAlreadyExistsFault";
	name = "DBShardGroupAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBShardGroupAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, wd = class e extends M {
	static shapeId = "com.amazonaws.rds#MaxDBShardGroupLimitReached";
	name = "MaxDBShardGroupLimitReached";
	$fault = "client";
	constructor(t) {
		super({
			name: "MaxDBShardGroupLimitReached",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Td = class e extends M {
	static shapeId = "com.amazonaws.rds#UnsupportedDBEngineVersionFault";
	name = "UnsupportedDBEngineVersionFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnsupportedDBEngineVersionFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ed = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetGroupAlreadyExistsFault";
	name = "DBSubnetGroupAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetGroupAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Dd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetGroupQuotaExceededFault";
	name = "DBSubnetGroupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetGroupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Od = class e extends M {
	static shapeId = "com.amazonaws.rds#DBSubnetQuotaExceededFault";
	name = "DBSubnetQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBSubnetQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, kd = class e extends M {
	static shapeId = "com.amazonaws.rds#EventSubscriptionQuotaExceededFault";
	name = "EventSubscriptionQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "EventSubscriptionQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ad = class e extends M {
	static shapeId = "com.amazonaws.rds#SNSInvalidTopicFault";
	name = "SNSInvalidTopicFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SNSInvalidTopicFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, jd = class e extends M {
	static shapeId = "com.amazonaws.rds#SNSNoAuthorizationFault";
	name = "SNSNoAuthorizationFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SNSNoAuthorizationFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Md = class e extends M {
	static shapeId = "com.amazonaws.rds#SNSTopicArnNotFoundFault";
	name = "SNSTopicArnNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SNSTopicArnNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Nd = class e extends M {
	static shapeId = "com.amazonaws.rds#SubscriptionAlreadyExistFault";
	name = "SubscriptionAlreadyExistFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SubscriptionAlreadyExistFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Pd = class e extends M {
	static shapeId = "com.amazonaws.rds#SubscriptionCategoryNotFoundFault";
	name = "SubscriptionCategoryNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SubscriptionCategoryNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Fd = class e extends M {
	static shapeId = "com.amazonaws.rds#GlobalClusterAlreadyExistsFault";
	name = "GlobalClusterAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "GlobalClusterAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Id = class e extends M {
	static shapeId = "com.amazonaws.rds#GlobalClusterQuotaExceededFault";
	name = "GlobalClusterQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "GlobalClusterQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ld = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBShardGroupStateFault";
	name = "InvalidDBShardGroupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBShardGroupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Rd = class e extends M {
	static shapeId = "com.amazonaws.rds#IntegrationAlreadyExistsFault";
	name = "IntegrationAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IntegrationAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, zd = class e extends M {
	static shapeId = "com.amazonaws.rds#IntegrationConflictOperationFault";
	name = "IntegrationConflictOperationFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IntegrationConflictOperationFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Bd = class e extends M {
	static shapeId = "com.amazonaws.rds#IntegrationQuotaExceededFault";
	name = "IntegrationQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IntegrationQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Vd = class e extends M {
	static shapeId = "com.amazonaws.rds#TenantDatabaseAlreadyExistsFault";
	name = "TenantDatabaseAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "TenantDatabaseAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Hd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidBlueGreenDeploymentStateFault";
	name = "InvalidBlueGreenDeploymentStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidBlueGreenDeploymentStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ud = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterAutomatedBackupQuotaExceededFault";
	name = "DBClusterAutomatedBackupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterAutomatedBackupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Wd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterAutomatedBackupNotFoundFault";
	name = "DBClusterAutomatedBackupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterAutomatedBackupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Gd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBClusterAutomatedBackupStateFault";
	name = "InvalidDBClusterAutomatedBackupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBClusterAutomatedBackupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Kd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterEndpointNotFoundFault";
	name = "DBClusterEndpointNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterEndpointNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, qd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBParameterGroupStateFault";
	name = "InvalidDBParameterGroupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBParameterGroupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Jd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceAutomatedBackupQuotaExceededFault";
	name = "DBInstanceAutomatedBackupQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceAutomatedBackupQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Yd = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceAutomatedBackupNotFoundFault";
	name = "DBInstanceAutomatedBackupNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceAutomatedBackupNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Xd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBInstanceAutomatedBackupStateFault";
	name = "InvalidDBInstanceAutomatedBackupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBInstanceAutomatedBackupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Zd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBProxyEndpointStateFault";
	name = "InvalidDBProxyEndpointStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBProxyEndpointStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Qd = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBSubnetStateFault";
	name = "InvalidDBSubnetStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBSubnetStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, $d = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidEventSubscriptionStateFault";
	name = "InvalidEventSubscriptionStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidEventSubscriptionStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ef = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidIntegrationStateFault";
	name = "InvalidIntegrationStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidIntegrationStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, tf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidOptionGroupStateFault";
	name = "InvalidOptionGroupStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidOptionGroupStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyTargetNotFoundFault";
	name = "DBProxyTargetNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyTargetNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, rf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterBacktrackNotFoundFault";
	name = "DBClusterBacktrackNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterBacktrackNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, af = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceNotReadyFault";
	name = "DBInstanceNotReadyFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceNotReadyFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, of = class e extends M {
	static shapeId = "com.amazonaws.rds#ReservedDBInstanceNotFoundFault";
	name = "ReservedDBInstanceNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReservedDBInstanceNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, sf = class e extends M {
	static shapeId = "com.amazonaws.rds#ReservedDBInstancesOfferingNotFoundFault";
	name = "ReservedDBInstancesOfferingNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReservedDBInstancesOfferingNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidResourceStateFault";
	name = "InvalidResourceStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidResourceStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBLogFileNotFoundFault";
	name = "DBLogFileNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBLogFileNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, uf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidDBClusterCapacityFault";
	name = "InvalidDBClusterCapacityFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidDBClusterCapacityFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, df = class e extends M {
	static shapeId = "com.amazonaws.rds#StorageTypeNotAvailableFault";
	name = "StorageTypeNotAvailableFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "StorageTypeNotAvailableFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ff = class e extends M {
	static shapeId = "com.amazonaws.rds#SharedSnapshotQuotaExceededFault";
	name = "SharedSnapshotQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "SharedSnapshotQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBUpgradeDependencyFailureFault";
	name = "DBUpgradeDependencyFailureFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBUpgradeDependencyFailureFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, mf = class e extends M {
	static shapeId = "com.amazonaws.rds#SubnetAlreadyInUse";
	name = "SubnetAlreadyInUse";
	$fault = "client";
	constructor(t) {
		super({
			name: "SubnetAlreadyInUse",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hf = class e extends M {
	static shapeId = "com.amazonaws.rds#ReservedDBInstanceAlreadyExistsFault";
	name = "ReservedDBInstanceAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReservedDBInstanceAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gf = class e extends M {
	static shapeId = "com.amazonaws.rds#ReservedDBInstanceQuotaExceededFault";
	name = "ReservedDBInstanceQuotaExceededFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReservedDBInstanceQuotaExceededFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _f = class e extends M {
	static shapeId = "com.amazonaws.rds#DBProxyTargetAlreadyRegisteredFault";
	name = "DBProxyTargetAlreadyRegisteredFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBProxyTargetAlreadyRegisteredFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, vf = class e extends M {
	static shapeId = "com.amazonaws.rds#InsufficientAvailableIPsInSubnetFault";
	name = "InsufficientAvailableIPsInSubnetFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InsufficientAvailableIPsInSubnetFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, yf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBClusterRoleNotFoundFault";
	name = "DBClusterRoleNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBClusterRoleNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bf = class e extends M {
	static shapeId = "com.amazonaws.rds#DBInstanceRoleNotFoundFault";
	name = "DBInstanceRoleNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "DBInstanceRoleNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidS3BucketFault";
	name = "InvalidS3BucketFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidS3BucketFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Sf = class e extends M {
	static shapeId = "com.amazonaws.rds#InsufficientDBClusterCapacityFault";
	name = "InsufficientDBClusterCapacityFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InsufficientDBClusterCapacityFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Cf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidRestoreFault";
	name = "InvalidRestoreFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidRestoreFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, wf = class e extends M {
	static shapeId = "com.amazonaws.rds#PointInTimeRestoreNotEnabledFault";
	name = "PointInTimeRestoreNotEnabledFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "PointInTimeRestoreNotEnabledFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Tf = class e extends M {
	static shapeId = "com.amazonaws.rds#ExportTaskAlreadyExistsFault";
	name = "ExportTaskAlreadyExistsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExportTaskAlreadyExistsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ef = class e extends M {
	static shapeId = "com.amazonaws.rds#IamRoleMissingPermissionsFault";
	name = "IamRoleMissingPermissionsFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IamRoleMissingPermissionsFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Df = class e extends M {
	static shapeId = "com.amazonaws.rds#IamRoleNotFoundFault";
	name = "IamRoleNotFoundFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "IamRoleNotFoundFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Of = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidExportOnlyFault";
	name = "InvalidExportOnlyFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidExportOnlyFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, kf = class e extends M {
	static shapeId = "com.amazonaws.rds#InvalidExportSourceStateFault";
	name = "InvalidExportSourceStateFault";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidExportSourceStateFault",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/schemas/schemas_0.js
w();
var Af = "AuthorizationAlreadyExistsFault", jf = "AvailableAdditionalStorageVolumesOption", Mf = "AvailableAdditionalStorageVolumesOptionList", Nf = "AvailableAdditionalStorageVolumesOptions", Pf = "AwsBackupRecoveryPointArn", Ff = "ApplyImmediately", If = "AutomationMode", Lf = "AutoMinorVersionUpgrade", Rf = "AllowMajorVersionUpgrade", zf = "AuthorizationNotFoundFault", Bf = "AvailableProcessorFeature", Vf = "AvailableProcessorFeatureList", Hf = "AvailableProcessorFeatures", Uf = "AuthorizationQuotaExceededFault", Wf = "AssociatedRoles", Gf = "AutomaticRestartTime", Kf = "AllocatedStorage", qf = "AuthSecretArn", Jf = "ActivityStreamEngineNativeAuditFieldsIncluded", Yf = "ActivityStreamKmsKeyId", Xf = "ActivityStreamKinesisStreamName", Zf = "ActivityStreamMode", Qf = "ActivityStreamPolicyStatus", $f = "ActivityStreamStatus", ep = "AdditionalStorageVolume", tp = "AdditionalStorageVolumesList", np = "AdditionalStorageVolumeOutput", rp = "AdditionalStorageVolumesOutputList", ip = "AdditionalStorageVolumes", ap = "AllowedValues", op = "AvailabilityZone", sp = "AvailabilityZoneGroup", cp = "AvailabilityZoneList", lp = "AvailabilityZones", up = "Address", dp = "Arn", fp = "BlueGreenDeploymentAlreadyExistsFault", pp = "BlueGreenDeploymentNotFoundFault", mp = "BackupPolicyNotFoundFault", hp = "BackupRetentionPeriod", gp = "BackupTarget", _p = "CACertificateIdentifier", vp = "CAIdentifier", yp = "CustomAvailabilityZoneNotFoundFault", bp = "CreateCustomDBEngineVersionFault", xp = "CertificateDetails", Sp = "CustomDBEngineVersionAlreadyExistsFault", Cp = "CustomDBEngineVersionNotFoundFault", wp = "CustomDBEngineVersionQuotaExceededFault", Tp = "CreateDBInstance", Ep = "CreateDBInstanceMessage", Dp = "CreateDBInstanceResult", Op = "CreateDBSnapshotMessage", kp = "CreateDBSnapshotResult", Ap = "CreateDBSnapshot", jp = "CustomIamInstanceProfile", Mp = "CloudwatchLogsExportConfiguration", Np = "CertificateNotFoundFault", Pp = "CustomerOwnedIpEnabled", Fp = "CertificateRotationRestart", Ip = "CharacterSetName", Lp = "CopyTagsToSnapshot", Rp = "DeleteAutomatedBackups", zp = "DomainAuthSecretArn", Bp = "DBClusterAutomatedBackupNotFoundFault", Vp = "DBClusterAutomatedBackupQuotaExceededFault", Hp = "DBClusterAlreadyExistsFault", Up = "DBClusterBacktrackNotFoundFault", Wp = "DBClusterEndpointAlreadyExistsFault", Gp = "DBClusterEndpointNotFoundFault", Kp = "DBClusterEndpointQuotaExceededFault", qp = "DBClusterIdentifier", Jp = "DBClusterNotFoundFault", Yp = "DBClusterParameterGroupNotFoundFault", Xp = "DBClusterQuotaExceededFault", Zp = "DBCapacityReservationAlreadyExistsFault", Qp = "DBClusterRoleAlreadyExistsFault", $p = "DBCapacityReservationIdentifier", em = "DBCapacityReservationNotFoundFault", tm = "DBClusterRoleNotFoundFault", nm = "DBClusterRoleQuotaExceededFault", rm = "DBCapacityReservationUnsupportedFault", im = "DBClusterSnapshotAlreadyExistsFault", am = "DBClusterSnapshotNotFoundFault", om = "DBInstance", sm = "DBInstanceArn", cm = "DBInstanceAutomatedBackupsArn", lm = "DBInstanceAutomatedBackupNotFoundFault", um = "DBInstanceAutomatedBackupQuotaExceededFault", dm = "DBInstanceAutomatedBackupsReplications", fm = "DBInstanceAutomatedBackupsReplicationList", pm = "DBInstanceAutomatedBackupsReplication", mm = "DBInstanceAlreadyExistsFault", hm = "DBInstanceClass", N = "DBInstanceIdentifier", gm = "DBInstanceList", _m = "DBInstanceMessage", vm = "DBInstanceNotFoundFault", ym = "DBInstanceNotReadyFault", bm = "DBInstanceRole", xm = "DBInstanceRoleAlreadyExistsFault", Sm = "DBInstanceRoleNotFoundFault", Cm = "DBInstanceRoleQuotaExceededFault", wm = "DBInstanceRoles", Tm = "DBInstanceStatus", Em = "DBInstanceStatusInfo", Dm = "DBInstanceStatusInfoList", Om = "DBInstances", km = "DBLogFileNotFoundFault", Am = "DBName", jm = "DBProxyAlreadyExistsFault", Mm = "DBProxyEndpointAlreadyExistsFault", Nm = "DBProxyEndpointNotFoundFault", Pm = "DBProxyEndpointQuotaExceededFault", Fm = "DBParameterGroup", Im = "DBParameterGroupAlreadyExistsFault", Lm = "DBParameterGroupName", Rm = "DBParameterGroupNotFoundFault", zm = "DBParameterGroupQuotaExceededFault", Bm = "DBParameterGroupStatus", Vm = "DBParameterGroupStatusList", Hm = "DBParameterGroups", Um = "DBProxyNotFoundFault", Wm = "DBPortNumber", Gm = "DBProxyQuotaExceededFault", Km = "DBProxyTargetAlreadyRegisteredFault", qm = "DBProxyTargetGroupNotFoundFault", Jm = "DBProxyTargetNotFoundFault", Ym = "DBSnapshot", Xm = "DBSnapshotArn", Zm = "DBSnapshotAlreadyExistsFault", Qm = "DBSecurityGroup", $m = "DBSecurityGroupAlreadyExistsFault", eh = "DBShardGroupAlreadyExistsFault", th = "DBSubnetGroupAlreadyExistsFault", nh = "DBSubnetGroupArn", rh = "DBSubnetGroupDoesNotCoverEnoughAZs", ih = "DBSubnetGroupDescription", ah = "DBSecurityGroupMembership", oh = "DBSecurityGroupMembershipList", sh = "DBSecurityGroupName", ch = "DBSubnetGroupNotAllowedFault", lh = "DBSecurityGroupNotFoundFault", uh = "DBShardGroupNotFoundFault", dh = "DBSubnetGroupNotFoundFault", fh = "DBSecurityGroupNameList", ph = "DBSecurityGroupNotSupportedFault", mh = "DBSubnetGroupName", hh = "DBSecurityGroupQuotaExceededFault", gh = "DBSubnetGroupQuotaExceededFault", _h = "DBSecurityGroups", vh = "DBSubnetGroup", yh = "DBSystemId", bh = "DBSnapshotIdentifier", xh = "DBSnapshotList", Sh = "DBSnapshotMessage", Ch = "DBSnapshotNotFoundFault", wh = "DBSubnetQuotaExceededFault", Th = "DBSnapshotTenantDatabaseNotFoundFault", Eh = "DBSnapshots", Dh = "DBUpgradeDependencyFailureFault", Oh = "DisableDomain", kh = "DeleteDBInstance", Ah = "DeleteDBInstanceMessage", jh = "DescribeDBInstancesMessage", Mh = "DeleteDBInstanceResult", Nh = "DescribeDBInstances", Ph = "DescribeDBSnapshotsMessage", Fh = "DescribeDBSnapshots", Ih = "DomainDnsIps", Lh = "DomainFqdn", Rh = "DnsIps", zh = "DomainIAMRoleName", Bh = "DatabaseInsightsMode", Vh = "DbInstancePort", Hh = "DisableLogTypes", Uh = "DedicatedLogVolume", Wh = "DomainMemberships", Gh = "DomainMembershipList", Kh = "DomainMembership", qh = "DomainNotFoundFault", Jh = "DomainOu", Yh = "DescribeOrderableDBInstanceOptions", Xh = "DescribeOrderableDBInstanceOptionsMessage", Zh = "DeletionProtection", Qh = "DbiResourceId", $h = "DefaultValue", eg = "Domain", tg = "Engine", ng = "EnableCloudwatchLogsExports", rg = "EnabledCloudwatchLogsExports", ig = "EnableCustomerOwnedIp", ag = "EnableIAMDatabaseAuthentication", og = "Ec2ImagePropertiesNotSupportedFault", sg = "EngineLifecycleSupport", cg = "EnableLogTypes", lg = "EnhancedMonitoringResourceArn", ug = "EnablePerformanceInsights", dg = "EventSubscriptionQuotaExceededFault", fg = "ExportTaskAlreadyExistsFault", pg = "ExportTaskNotFoundFault", mg = "EngineVersion", hg = "Encrypted", gg = "Endpoint", _g = "FinalDBSnapshotIdentifier", vg = "FilterList", yg = "FeatureName", bg = "FQDN", xg = "FullSnapshotSizeInBytes", Sg = "FilterValueList", Cg = "Filters", wg = "Filter", Tg = "GlobalClusterAlreadyExistsFault", Eg = "GlobalClusterNotFoundFault", Dg = "GlobalClusterQuotaExceededFault", Og = "HostedZoneId", kg = "Iops", Ag = "IntegrationAlreadyExistsFault", jg = "InsufficientAvailableIPsInSubnetFault", Mg = "IAMDatabaseAuthenticationEnabled", Ng = "IAMRoleName", Pg = "InvalidBlueGreenDeploymentStateFault", Fg = "InvalidCustomDBEngineVersionStateFault", Ig = "IntegrationConflictOperationFault", Lg = "InstanceCreateTime", Rg = "InvalidDBClusterAutomatedBackupStateFault", zg = "InsufficientDBClusterCapacityFault", Bg = "InvalidDBClusterCapacityFault", Vg = "InvalidDBClusterEndpointStateFault", Hg = "InvalidDBCapacityReservationStateFault", Ug = "InvalidDBClusterStateFault", Wg = "InvalidDBClusterSnapshotStateFault", Gg = "InvalidDBInstanceAutomatedBackupStateFault", Kg = "InsufficientDBInstanceCapacityFault", qg = "InvalidDBInstanceStateFault", Jg = "InvalidDBProxyEndpointStateFault", Yg = "InvalidDBParameterGroupStateFault", Xg = "InvalidDBProxyStateFault", Zg = "InvalidDBSubnetGroupFault", Qg = "InvalidDBSecurityGroupStateFault", $g = "InvalidDBShardGroupStateFault", e_ = "InvalidDBSubnetGroupStateFault", t_ = "InvalidDBSnapshotStateFault", n_ = "InvalidDBSubnetStateFault", r_ = "InvalidExportOnlyFault", i_ = "InvalidEventSubscriptionStateFault", a_ = "InvalidExportSourceStateFault", o_ = "InvalidExportTaskStateFault", s_ = "InvalidGlobalClusterStateFault", c_ = "InvalidIntegrationStateFault", l_ = "IntegrationNotFoundFault", u_ = "InvalidOptionGroupStateFault", d_ = "IOPS", f_ = "IncludePublic", p_ = "InstanceQuotaExceededFault", m_ = "IntegrationQuotaExceededFault", h_ = "InvalidRestoreFault", g_ = "IamRoleMissingPermissionsFault", __ = "IamRoleNotFoundFault", v_ = "InvalidResourceStateFault", y_ = "InvalidSubnet", b_ = "InvalidS3BucketFault", x_ = "InsufficientStorageClusterCapacityFault", S_ = "IsStorageConfigUpgradeAvailable", C_ = "IncludeShared", w_ = "InvalidVPCNetworkStateFault", T_ = "Key", E_ = "KmsKeyId", D_ = "KMSKeyNotAccessibleFault", O_ = "ListenerEndpoint", k_ = "LicenseModel", A_ = "LatestRestorableTime", j_ = "ListTagsForResource", M_ = "ListTagsForResourceMessage", N_ = "LogTypesToDisable", P_ = "LogTypesToEnable", F_ = "MaxAllocatedStorage", I_ = "ModifyAdditionalStorageVolume", L_ = "ModifyAdditionalStorageVolumesList", R_ = "MultiAZ", z_ = "MultiAZCapable", B_ = "ModifyDBInstance", V_ = "ModifyDBInstanceMessage", H_ = "ModifyDBInstanceResult", U_ = "MaxDBShardGroupLimitReached", W_ = "MinIops", G_ = "MinIopsPerDbInstance", K_ = "MaxIopsPerDbInstance", q_ = "MinIopsPerGib", J_ = "MaxIopsPerGib", Y_ = "MaxIops", X_ = "MonitoringInterval", Z_ = "ManageMasterUserPassword", Q_ = "MaxRecords", $_ = "MonitoringRoleArn", ev = "MinStorageSize", tv = "MaxStorageSize", nv = "MinStorageThroughput", rv = "MinStorageThroughputPerDbInstance", iv = "MaxStorageThroughputPerDbInstance", av = "MinStorageThroughputPerIops", ov = "MaxStorageThroughputPerIops", sv = "MaxStorageThroughput", cv = "MultiTenant", lv = "MasterUsername", uv = "MasterUserAuthenticationType", dv = "MasterUserPassword", fv = "MasterUserSecret", pv = "MasterUserSecretKmsKeyId", mv = "Marker", hv = "Message", gv = "Name", _v = "NcharCharacterSetName", vv = "NewDBInstanceIdentifier", yv = "NetworkType", bv = "NetworkTypeNotSupported", xv = "Normal", Sv = "OutpostCapable", Cv = "OrderableDBInstanceOption", wv = "OrderableDBInstanceOptionsList", Tv = "OrderableDBInstanceOptionsMessage", Ev = "OrderableDBInstanceOptions", Dv = "OptionGroupAlreadyExistsFault", Ov = "OptionGroupMemberships", kv = "OptionGroupMembershipList", Av = "OptionGroupMembership", jv = "OptionGroupName", Mv = "OptionGroupNotFoundFault", Nv = "OptionGroupQuotaExceededFault", Pv = "OriginalSnapshotCreateTime", Fv = "OU", Iv = "Outpost", Lv = "Port", Rv = "PubliclyAccessible", zv = "ParameterApplyStatus", Bv = "PreferredBackupWindow", Vv = "PendingCloudwatchLogsExports", Hv = "ProcessorFeatures", Uv = "ProcessorFeatureList", Wv = "ProcessorFeature", Gv = "PerformanceInsightsEnabled", Kv = "PerformanceInsightsKMSKeyId", qv = "ProvisionedIopsNotAvailableInAZFault", Jv = "PerformanceInsightsRetentionPeriod", Yv = "PointInTimeRestoreNotEnabledFault", Xv = "PendingModifiedValues", Zv = "PreferredMaintenanceWindow", Qv = "PercentProgress", $v = "PromotionTier", ey = "RoleArn", ty = "ReservedDBInstanceAlreadyExistsFault", ny = "ReservedDBInstanceNotFoundFault", ry = "ReservedDBInstancesOfferingNotFoundFault", iy = "ReservedDBInstanceQuotaExceededFault", ay = "ResumeFullAutomationModeMinutes", oy = "ResumeFullAutomationModeTime", sy = "ReplicaMode", cy = "RotateMasterUserPassword", ly = "ResourceName", uy = "ResourceNotFoundFault", dy = "ReadReplicaCapable", fy = "ReadReplicaDBClusterIdentifiers", py = "ReadReplicaDBClusterIdentifierList", my = "ReadReplicaDBClusterIdentifier", hy = "ReadReplicaDBInstanceIdentifiers", gy = "ReadReplicaDBInstanceIdentifierList", _y = "ReadReplicaDBInstanceIdentifier", vy = "ReadReplicaSourceDBClusterIdentifier", yy = "ReadReplicaSourceDBInstanceIdentifier", by = "ResourceType", xy = "SubscriptionAlreadyExistFault", Sy = "SubnetAlreadyInUse", Cy = "SupportedActivityStreamModes", wy = "SupportsAdditionalStorageVolumes", Ty = "SnapshotAvailabilityZone", Ey = "SecondaryAvailabilityZone", Dy = "SubnetAvailabilityZone", Oy = "SecretArn", ky = "SubscriptionCategoryNotFoundFault", Ay = "SourceClusterNotSupportedFault", jy = "SnapshotCreateTime", My = "SupportsClusters", Ny = "SourceDBSnapshotIdentifier", Py = "SupportsDedicatedLogVolume", Fy = "SourceDatabaseNotSupportedFault", Iy = "SnapshotDatabaseTime", Ly = "StorageEncrypted", Ry = "SupportedEngineModes", zy = "SupportsEnhancedMonitoring", By = "StorageEncryptionType", Vy = "SetForDelete", Hy = "SkipFinalSnapshot", Uy = "SupportsGlobalDatabases", Wy = "SubnetGroupStatus", Gy = "SupportsHttpEndpoint", Ky = "SupportsIAMDatabaseAuthentication", qy = "StatusInfos", Jy = "SupportsIops", Yy = "SubnetIdentifier", Xy = "SupportsKerberosAuthentication", Zy = "SubnetList", Qy = "SourceNotFoundFault", $y = "SubscriptionNotFoundFault", eb = "SNSInvalidTopicFault", tb = "SNSNoAuthorizationFault", nb = "SNSTopicArnNotFoundFault", rb = "SupportedNetworkTypes", ib = "SubnetOutpost", ab = "StorageOperationPercentProgress", ob = "StorageOperationStatus", sb = "SupportsPerformanceInsights", cb = "SnapshotQuotaExceededFault", lb = "StorageQuotaExceededFault", ub = "SourceRegion", db = "SensitiveString", fb = "SupportsStorageAutoscaling", pb = "SupportsStorageEncryption", mb = "SharedSnapshotQuotaExceededFault", hb = "SupportsStorageThroughput", gb = "SecretStatus", _b = "SubnetStatus", vb = "StorageThroughput", yb = "StorageTypeNotAvailableFault", bb = "StorageTypeNotSupportedFault", xb = "SnapshotTarget", Sb = "SnapshotType", P = "StorageType", Cb = "StatusType", wb = "StorageVolumeStatus", Tb = "Status", Eb = "Subnets", Db = "Subnet", Ob = "Tags", kb = "TdeCredentialArn", Ab = "TdeCredentialPassword", jb = "TenantDatabaseAlreadyExistsFault", Mb = "TenantDatabaseNotFoundFault", Nb = "TenantDatabaseQuotaExceededFault", Pb = "TagList", Fb = "TagListMessage", Ib = "TagSpecifications", Lb = "TagSpecificationList", Rb = "TagSpecification", zb = "Tag", Bb = "Timezone", Vb = "UnsupportedDBEngineVersionFault", Hb = "UseDefaultProcessorFeatures", Ub = "UpgradeRolloutOrder", Wb = "Value", Gb = "VpcEncryptionControlViolationException", Kb = "VpcId", qb = "VolumeName", Jb = "VpcSecurityGroups", Yb = "VpcSecurityGroupIds", Xb = "VpcSecurityGroupIdList", Zb = "VpcSecurityGroupId", Qb = "VpcSecurityGroupMembershipList", $b = "VpcSecurityGroupMembership", ex = "ValidTill", tx = "Values", nx = "Vpc", F = "awsQueryError", I = "client", L = "error", R = "httpError", rx = "item", z = "message", ix = "smithy.ts.sdk.synthetic.com.amazonaws.rds", B = "xmlName", V = "com.amazonaws.rds", ax = new Ue(ix), ox = [
	-3,
	ix,
	"RDSServiceException",
	0,
	[],
	[]
];
ax.registerError(ox, M);
var H = new Ue(V), sx = [
	-3,
	V,
	Af,
	{
		[F]: ["AuthorizationAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(sx, lu);
var cx = [
	-3,
	V,
	zf,
	{
		[F]: ["AuthorizationNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(cx, cd);
var lx = [
	-3,
	V,
	Uf,
	{
		[F]: ["AuthorizationQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(lx, uu);
var ux = [
	-3,
	V,
	mp,
	{
		[F]: ["BackupPolicyNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(ux, ld);
var dx = [
	-3,
	V,
	fp,
	{
		[F]: ["BlueGreenDeploymentAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(dx, Au);
var fx = [
	-3,
	V,
	pp,
	{
		[F]: ["BlueGreenDeploymentNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(fx, Zl);
var px = [
	-3,
	V,
	Np,
	{
		[F]: ["CertificateNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(px, ud);
var mx = [
	-3,
	V,
	bp,
	{
		[F]: ["CreateCustomDBEngineVersionFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(mx, Lu);
var hx = [
	-3,
	V,
	yp,
	{
		[F]: ["CustomAvailabilityZoneNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(hx, wu);
var gx = [
	-3,
	V,
	Sp,
	{
		[F]: ["CustomDBEngineVersionAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(gx, Ru);
var _x = [
	-3,
	V,
	Cp,
	{
		[F]: ["CustomDBEngineVersionNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(_x, zu);
var vx = [
	-3,
	V,
	wp,
	{
		[F]: ["CustomDBEngineVersionQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(vx, Bu);
var yx = [
	-3,
	V,
	Zp,
	{
		[F]: ["DBCapacityReservationAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(yx, Uu);
var bx = [
	-3,
	V,
	em,
	{
		[F]: ["DBCapacityReservationNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(bx, Ql);
var xx = [
	-3,
	V,
	rm,
	{
		[F]: ["DBCapacityReservationUnsupported", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(xx, Wu);
var Sx = [
	-3,
	V,
	Hp,
	{
		[F]: ["DBClusterAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Sx, Ku);
var Cx = [
	-3,
	V,
	Bp,
	{
		[F]: ["DBClusterAutomatedBackupNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Cx, Wd);
var wx = [
	-3,
	V,
	Vp,
	{
		[F]: ["DBClusterAutomatedBackupQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(wx, Ud);
var Tx = [
	-3,
	V,
	Up,
	{
		[F]: ["DBClusterBacktrackNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Tx, rf);
var Ex = [
	-3,
	V,
	Wp,
	{
		[F]: ["DBClusterEndpointAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Ex, od);
var Dx = [
	-3,
	V,
	Gp,
	{
		[F]: ["DBClusterEndpointNotFoundFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Dx, Kd);
var Ox = [
	-3,
	V,
	Kp,
	{
		[F]: ["DBClusterEndpointQuotaExceededFault", 403],
		[L]: I,
		[R]: 403
	},
	[z],
	[0]
];
H.registerError(Ox, sd);
var kx = [
	-3,
	V,
	Jp,
	{
		[F]: ["DBClusterNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(kx, Vl);
var Ax = [
	-3,
	V,
	Yp,
	{
		[F]: ["DBClusterParameterGroupNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Ax, ju);
var jx = [
	-3,
	V,
	Xp,
	{
		[F]: ["DBClusterQuotaExceededFault", 403],
		[L]: I,
		[R]: 403
	},
	[z],
	[0]
];
H.registerError(jx, Mu);
var Mx = [
	-3,
	V,
	Qp,
	{
		[F]: ["DBClusterRoleAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Mx, Hl);
var Nx = [
	-3,
	V,
	tm,
	{
		[F]: ["DBClusterRoleNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Nx, yf);
var Px = [
	-3,
	V,
	nm,
	{
		[F]: ["DBClusterRoleQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Px, Ul);
var Fx = [
	-3,
	V,
	im,
	{
		[F]: ["DBClusterSnapshotAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Fx, yu);
var Ix = [
	-3,
	V,
	am,
	{
		[F]: ["DBClusterSnapshotNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Ix, bu);
var Lx = [
	-3,
	V,
	mm,
	{
		[F]: ["DBInstanceAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Lx, dd);
var Rx = [
	-3,
	V,
	lm,
	{
		[F]: ["DBInstanceAutomatedBackupNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Rx, Yd);
var zx = [
	-3,
	V,
	um,
	{
		[F]: ["DBInstanceAutomatedBackupQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(zx, Jd);
var Bx = [
	-3,
	V,
	vm,
	{
		[F]: ["DBInstanceNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Bx, Gl);
var Vx = [
	-3,
	V,
	ym,
	{
		[F]: ["DBInstanceNotReady", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Vx, af);
var Hx = [
	-3,
	V,
	xm,
	{
		[F]: ["DBInstanceRoleAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Hx, Kl);
var Ux = [
	-3,
	V,
	Sm,
	{
		[F]: ["DBInstanceRoleNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Ux, bf);
var Wx = [
	-3,
	V,
	Cm,
	{
		[F]: ["DBInstanceRoleQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Wx, ql);
var Gx = [
	-3,
	V,
	km,
	{
		[F]: ["DBLogFileNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Gx, lf);
var Kx = [
	-3,
	V,
	Im,
	{
		[F]: ["DBParameterGroupAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Kx, gu);
var qx = [
	-3,
	V,
	Rm,
	{
		[F]: ["DBParameterGroupNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(qx, _u);
var Jx = [
	-3,
	V,
	zm,
	{
		[F]: ["DBParameterGroupQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Jx, vu);
var Yx = [
	-3,
	V,
	jm,
	{
		[F]: ["DBProxyAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Yx, hd);
var Xx = [
	-3,
	V,
	Mm,
	{
		[F]: ["DBProxyEndpointAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Xx, _d);
var Zx = [
	-3,
	V,
	Nm,
	{
		[F]: ["DBProxyEndpointNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(Zx, $l);
var Qx = [
	-3,
	V,
	Pm,
	{
		[F]: ["DBProxyEndpointQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(Qx, vd);
var $x = [
	-3,
	V,
	Um,
	{
		[F]: ["DBProxyNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError($x, eu);
var eS = [
	-3,
	V,
	Gm,
	{
		[F]: ["DBProxyQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(eS, gd);
var tS = [
	-3,
	V,
	Km,
	{
		[F]: ["DBProxyTargetAlreadyRegisteredFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(tS, _f);
var nS = [
	-3,
	V,
	qm,
	{
		[F]: ["DBProxyTargetGroupNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(nS, tu);
var rS = [
	-3,
	V,
	Jm,
	{
		[F]: ["DBProxyTargetNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(rS, nf);
var iS = [
	-3,
	V,
	$m,
	{
		[F]: ["DBSecurityGroupAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(iS, bd);
var aS = [
	-3,
	V,
	lh,
	{
		[F]: ["DBSecurityGroupNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(aS, du);
var oS = [
	-3,
	V,
	ph,
	{
		[F]: ["DBSecurityGroupNotSupported", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(oS, xd);
var sS = [
	-3,
	V,
	hh,
	{
		[F]: ["QuotaExceeded.DBSecurityGroup", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(sS, Sd);
var cS = [
	-3,
	V,
	eh,
	{
		[F]: ["DBShardGroupAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(cS, Cd);
var lS = [
	-3,
	V,
	uh,
	{
		[F]: ["DBShardGroupNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(lS, nu);
var uS = [
	-3,
	V,
	Zm,
	{
		[F]: ["DBSnapshotAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(uS, Tu);
var dS = [
	-3,
	V,
	Ch,
	{
		[F]: ["DBSnapshotNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(dS, ru);
var fS = [
	-3,
	V,
	Th,
	{
		[F]: ["DBSnapshotTenantDatabaseNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(fS, iu);
var pS = [
	-3,
	V,
	th,
	{
		[F]: ["DBSubnetGroupAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(pS, Ed);
var mS = [
	-3,
	V,
	rh,
	{
		[F]: ["DBSubnetGroupDoesNotCoverEnoughAZs", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(mS, qu);
var hS = [
	-3,
	V,
	ch,
	{
		[F]: ["DBSubnetGroupNotAllowedFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(hS, md);
var gS = [
	-3,
	V,
	dh,
	{
		[F]: ["DBSubnetGroupNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(gS, Ju);
var _S = [
	-3,
	V,
	gh,
	{
		[F]: ["DBSubnetGroupQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(_S, Dd);
var vS = [
	-3,
	V,
	wh,
	{
		[F]: ["DBSubnetQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(vS, Od);
var yS = [
	-3,
	V,
	Dh,
	{
		[F]: ["DBUpgradeDependencyFailure", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(yS, pf);
var bS = [
	-3,
	V,
	qh,
	{
		[F]: ["DomainNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(bS, Yu);
var xS = [
	-3,
	V,
	og,
	{
		[F]: ["Ec2ImagePropertiesNotSupportedFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(xS, Vu);
var SS = [
	-3,
	V,
	dg,
	{
		[F]: ["EventSubscriptionQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(SS, kd);
var CS = [
	-3,
	V,
	fg,
	{
		[F]: ["ExportTaskAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(CS, Tf);
var wS = [
	-3,
	V,
	pg,
	{
		[F]: ["ExportTaskNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(wS, mu);
var TS = [
	-3,
	V,
	Tg,
	{
		[F]: ["GlobalClusterAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(TS, Fd);
var ES = [
	-3,
	V,
	Eg,
	{
		[F]: ["GlobalClusterNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(ES, Xu);
var DS = [
	-3,
	V,
	Dg,
	{
		[F]: ["GlobalClusterQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(DS, Id);
var OS = [
	-3,
	V,
	g_,
	{
		[F]: ["IamRoleMissingPermissions", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(OS, Ef);
var kS = [
	-3,
	V,
	__,
	{
		[F]: ["IamRoleNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(kS, Df);
var AS = [
	-3,
	V,
	p_,
	{
		[F]: ["InstanceQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(AS, Nu);
var jS = [
	-3,
	V,
	jg,
	{
		[F]: ["InsufficientAvailableIPsInSubnetFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(jS, vf);
var MS = [
	-3,
	V,
	zg,
	{
		[F]: ["InsufficientDBClusterCapacityFault", 403],
		[L]: I,
		[R]: 403
	},
	[z],
	[0]
];
H.registerError(MS, Sf);
var NS = [
	-3,
	V,
	Kg,
	{
		[F]: ["InsufficientDBInstanceCapacity", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(NS, Gu);
var PS = [
	-3,
	V,
	x_,
	{
		[F]: ["InsufficientStorageClusterCapacity", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(PS, Zu);
var FS = [
	-3,
	V,
	Ag,
	{
		[F]: ["IntegrationAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(FS, Rd);
var IS = [
	-3,
	V,
	Ig,
	{
		[F]: ["IntegrationConflictOperationFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(IS, zd);
var LS = [
	-3,
	V,
	l_,
	{
		[F]: ["IntegrationNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(LS, au);
var RS = [
	-3,
	V,
	m_,
	{
		[F]: ["IntegrationQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(RS, Bd);
var zS = [
	-3,
	V,
	Pg,
	{
		[F]: ["InvalidBlueGreenDeploymentStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(zS, Hd);
var BS = [
	-3,
	V,
	Fg,
	{
		[F]: ["InvalidCustomDBEngineVersionStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(BS, Hu);
var VS = [
	-3,
	V,
	Hg,
	{
		[F]: ["InvalidDBCapacityReservationState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(VS, pu);
var HS = [
	-3,
	V,
	Rg,
	{
		[F]: ["InvalidDBClusterAutomatedBackupStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(HS, Gd);
var US = [
	-3,
	V,
	Bg,
	{
		[F]: ["InvalidDBClusterCapacityFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(US, uf);
var WS = [
	-3,
	V,
	Vg,
	{
		[F]: ["InvalidDBClusterEndpointStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(WS, ou);
var GS = [
	-3,
	V,
	Wg,
	{
		[F]: ["InvalidDBClusterSnapshotStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(GS, xu);
var KS = [
	-3,
	V,
	Ug,
	{
		[F]: ["InvalidDBClusterStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(KS, Wl);
var qS = [
	-3,
	V,
	Gg,
	{
		[F]: ["InvalidDBInstanceAutomatedBackupState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(qS, Xd);
var JS = [
	-3,
	V,
	qg,
	{
		[F]: ["InvalidDBInstanceState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(JS, Jl);
var YS = [
	-3,
	V,
	Yg,
	{
		[F]: ["InvalidDBParameterGroupState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(YS, qd);
var XS = [
	-3,
	V,
	Jg,
	{
		[F]: ["InvalidDBProxyEndpointStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(XS, Zd);
var ZS = [
	-3,
	V,
	Xg,
	{
		[F]: ["InvalidDBProxyStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(ZS, yd);
var QS = [
	-3,
	V,
	Qg,
	{
		[F]: ["InvalidDBSecurityGroupState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(QS, fu);
var $S = [
	-3,
	V,
	$g,
	{
		[F]: ["InvalidDBShardGroupState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError($S, Ld);
var eC = [
	-3,
	V,
	t_,
	{
		[F]: ["InvalidDBSnapshotState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(eC, Eu);
var tC = [
	-3,
	V,
	Zg,
	{
		[F]: ["InvalidDBSubnetGroupFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(tC, Qu);
var nC = [
	-3,
	V,
	e_,
	{
		[F]: ["InvalidDBSubnetGroupStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(nC, $u);
var rC = [
	-3,
	V,
	n_,
	{
		[F]: ["InvalidDBSubnetStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(rC, Qd);
var iC = [
	-3,
	V,
	i_,
	{
		[F]: ["InvalidEventSubscriptionState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(iC, $d);
var aC = [
	-3,
	V,
	r_,
	{
		[F]: ["InvalidExportOnly", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(aC, Of);
var oC = [
	-3,
	V,
	a_,
	{
		[F]: ["InvalidExportSourceState", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(oC, kf);
var sC = [
	-3,
	V,
	o_,
	{
		[F]: ["InvalidExportTaskStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(sC, hu);
var cC = [
	-3,
	V,
	s_,
	{
		[F]: ["InvalidGlobalClusterStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(cC, ed);
var lC = [
	-3,
	V,
	c_,
	{
		[F]: ["InvalidIntegrationStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(lC, ef);
var uC = [
	-3,
	V,
	u_,
	{
		[F]: ["InvalidOptionGroupStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(uC, tf);
var dC = [
	-3,
	V,
	v_,
	{
		[F]: ["InvalidResourceStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(dC, cf);
var fC = [
	-3,
	V,
	h_,
	{
		[F]: ["InvalidRestoreFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(fC, Cf);
var pC = [
	-3,
	V,
	b_,
	{
		[F]: ["InvalidS3BucketFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(pC, xf);
var mC = [
	-3,
	V,
	y_,
	{
		[F]: ["InvalidSubnet", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(mC, td);
var hC = [
	-3,
	V,
	w_,
	{
		[F]: ["InvalidVPCNetworkStateFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(hC, nd);
var gC = [
	-3,
	V,
	D_,
	{
		[F]: ["KMSKeyNotAccessibleFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(gC, Su);
var _C = [
	-3,
	V,
	U_,
	{
		[F]: ["MaxDBShardGroupLimitReached", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(_C, wd);
var vC = [
	-3,
	V,
	bv,
	{
		[F]: ["NetworkTypeNotSupported", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(vC, rd);
var yC = [
	-3,
	V,
	Dv,
	{
		[F]: ["OptionGroupAlreadyExistsFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(yC, Du);
var bC = [
	-3,
	V,
	Mv,
	{
		[F]: ["OptionGroupNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(bC, Ou);
var xC = [
	-3,
	V,
	Nv,
	{
		[F]: ["OptionGroupQuotaExceededFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(xC, ku);
var SC = [
	-3,
	V,
	Yv,
	{
		[F]: ["PointInTimeRestoreNotEnabled", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(SC, wf);
var CC = [
	-3,
	V,
	qv,
	{
		[F]: ["ProvisionedIopsNotAvailableInAZFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(CC, fd);
var wC = [
	-3,
	V,
	ty,
	{
		[F]: ["ReservedDBInstanceAlreadyExists", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(wC, hf);
var TC = [
	-3,
	V,
	ny,
	{
		[F]: ["ReservedDBInstanceNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(TC, of);
var EC = [
	-3,
	V,
	iy,
	{
		[F]: ["ReservedDBInstanceQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(EC, gf);
var DC = [
	-3,
	V,
	ry,
	{
		[F]: ["ReservedDBInstancesOfferingNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(DC, sf);
var OC = [
	-3,
	V,
	uy,
	{
		[F]: ["ResourceNotFoundFault", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(OC, cu);
var kC = [
	-3,
	V,
	mb,
	{
		[F]: ["SharedSnapshotQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(kC, ff);
var AC = [
	-3,
	V,
	cb,
	{
		[F]: ["SnapshotQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(AC, Cu);
var jC = [
	-3,
	V,
	eb,
	{
		[F]: ["SNSInvalidTopic", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(jC, Ad);
var MC = [
	-3,
	V,
	tb,
	{
		[F]: ["SNSNoAuthorization", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(MC, jd);
var NC = [
	-3,
	V,
	nb,
	{
		[F]: ["SNSTopicArnNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(NC, Md);
var PC = [
	-3,
	V,
	Ay,
	{
		[F]: ["SourceClusterNotSupportedFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(PC, Pu);
var FC = [
	-3,
	V,
	Fy,
	{
		[F]: ["SourceDatabaseNotSupportedFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(FC, Fu);
var IC = [
	-3,
	V,
	Qy,
	{
		[F]: ["SourceNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(IC, Yl);
var LC = [
	-3,
	V,
	lb,
	{
		[F]: ["StorageQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(LC, Iu);
var RC = [
	-3,
	V,
	yb,
	{
		[F]: ["StorageTypeNotAvailableFault", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(RC, df);
var zC = [
	-3,
	V,
	bb,
	{
		[F]: ["StorageTypeNotSupported", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(zC, id);
var BC = [
	-3,
	V,
	Sy,
	{
		[F]: ["SubnetAlreadyInUse", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(BC, mf);
var VC = [
	-3,
	V,
	xy,
	{
		[F]: ["SubscriptionAlreadyExist", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(VC, Nd);
var HC = [
	-3,
	V,
	ky,
	{
		[F]: ["SubscriptionCategoryNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(HC, Pd);
var UC = [
	-3,
	V,
	$y,
	{
		[F]: ["SubscriptionNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(UC, Xl);
var WC = [
	-3,
	V,
	jb,
	{
		[F]: ["TenantDatabaseAlreadyExists", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(WC, Vd);
var GC = [
	-3,
	V,
	Mb,
	{
		[F]: ["TenantDatabaseNotFound", 404],
		[L]: I,
		[R]: 404
	},
	[z],
	[0]
];
H.registerError(GC, su);
var KC = [
	-3,
	V,
	Nb,
	{
		[F]: ["TenantDatabaseQuotaExceeded", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(KC, pd);
var qC = [
	-3,
	V,
	Vb,
	{
		[F]: ["UnsupportedDBEngineVersion", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(qC, Td);
var JC = [
	-3,
	V,
	Gb,
	{
		[F]: ["VpcEncryptionControlViolationException", 400],
		[L]: I,
		[R]: 400
	},
	[z],
	[0]
];
H.registerError(JC, ad);
var YC = [ax, H], XC = [
	0,
	V,
	db,
	8,
	0
], ZC = [
	3,
	V,
	ep,
	0,
	[
		qb,
		Kf,
		d_,
		F_,
		vb,
		P
	],
	[
		0,
		1,
		1,
		1,
		1,
		0
	],
	1
], QC = [
	3,
	V,
	np,
	0,
	[
		qb,
		wb,
		ob,
		ab,
		Kf,
		d_,
		F_,
		vb,
		P
	],
	[
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		0
	]
], $C = [
	3,
	V,
	op,
	0,
	[gv],
	[0]
], ew = [
	3,
	V,
	jf,
	0,
	[
		fb,
		hb,
		Jy,
		P,
		ev,
		tv,
		W_,
		Y_,
		q_,
		J_,
		nv,
		sv
	],
	[
		2,
		2,
		2,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1
	]
], tw = [
	3,
	V,
	Bf,
	0,
	[
		gv,
		$h,
		ap
	],
	[
		0,
		0,
		0
	]
], nw = [
	3,
	V,
	xp,
	0,
	[vp, ex],
	[0, 4]
], rw = [
	3,
	V,
	Mp,
	0,
	[cg, Hh],
	[64, 64]
], iw = [
	3,
	V,
	Ep,
	0,
	[
		N,
		hm,
		tg,
		Am,
		Kf,
		lv,
		dv,
		_h,
		Yb,
		op,
		mh,
		Zv,
		Lm,
		hp,
		Bv,
		Lv,
		R_,
		mg,
		Lf,
		k_,
		kg,
		vb,
		jv,
		Ip,
		_v,
		Rv,
		Ob,
		qp,
		P,
		kb,
		Ab,
		Ly,
		E_,
		eg,
		Lh,
		Jh,
		zp,
		Ih,
		Lp,
		X_,
		$_,
		zh,
		$v,
		Bb,
		ag,
		Bh,
		ug,
		Kv,
		Jv,
		ng,
		Hv,
		Zh,
		F_,
		ig,
		yv,
		gp,
		jp,
		yh,
		_p,
		Z_,
		pv,
		cv,
		Uh,
		sg,
		ip,
		Ib,
		$p,
		uv
	],
	[
		0,
		0,
		0,
		0,
		1,
		0,
		[() => XC, 0],
		[() => eT, 0],
		[() => mT, 0],
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		2,
		0,
		2,
		0,
		1,
		1,
		0,
		0,
		0,
		2,
		[() => fT, 0],
		0,
		0,
		0,
		[() => XC, 0],
		2,
		0,
		0,
		0,
		0,
		0,
		64,
		2,
		1,
		0,
		0,
		1,
		0,
		2,
		0,
		2,
		0,
		1,
		64,
		[() => cT, 0],
		2,
		1,
		2,
		0,
		0,
		0,
		0,
		0,
		2,
		0,
		2,
		2,
		0,
		() => Uw,
		[() => pT, 0],
		0,
		0
	],
	3
], aw = [
	3,
	V,
	Dp,
	0,
	[om],
	[[() => cw, 0]]
], ow = [
	3,
	V,
	Op,
	0,
	[
		bh,
		N,
		Ob
	],
	[
		0,
		0,
		[() => fT, 0]
	],
	2
], sw = [
	3,
	V,
	kp,
	0,
	[Ym],
	[[() => hw, 0]]
], cw = [
	3,
	V,
	om,
	0,
	[
		N,
		hm,
		tg,
		Tm,
		lv,
		Am,
		gg,
		Kf,
		Lg,
		Bv,
		hp,
		_h,
		Jb,
		Hm,
		op,
		vh,
		Zv,
		Ub,
		Xv,
		A_,
		R_,
		mg,
		Lf,
		yy,
		hy,
		fy,
		sy,
		k_,
		kg,
		vb,
		Ov,
		Ip,
		_v,
		Ey,
		Rv,
		qy,
		P,
		By,
		kb,
		Vh,
		qp,
		Ly,
		E_,
		Qh,
		_p,
		Wh,
		Lp,
		X_,
		lg,
		$_,
		$v,
		sm,
		Bb,
		Mg,
		Bh,
		Gv,
		Kv,
		Jv,
		rg,
		Hv,
		Zh,
		Wf,
		O_,
		F_,
		Pb,
		If,
		oy,
		Pp,
		yv,
		$f,
		Yf,
		Xf,
		Zf,
		Jf,
		Pf,
		dm,
		gp,
		Gf,
		jp,
		Qf,
		xp,
		yh,
		fv,
		vy,
		Qv,
		cv,
		Uh,
		S_,
		sg,
		ip,
		wb,
		ob,
		ab,
		$p
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		() => ww,
		1,
		4,
		0,
		1,
		[() => $w, 0],
		[() => hT, 0],
		[() => Qw, 0],
		0,
		[() => _w, 0],
		0,
		0,
		[() => Iw, 0],
		4,
		2,
		0,
		2,
		0,
		[() => uT, 0],
		[() => lT, 0],
		0,
		0,
		1,
		1,
		[() => oT, 0],
		0,
		0,
		0,
		2,
		[() => Zw, 0],
		0,
		0,
		0,
		1,
		0,
		2,
		0,
		0,
		0,
		[() => nT, 0],
		2,
		1,
		0,
		0,
		1,
		0,
		0,
		2,
		0,
		2,
		0,
		1,
		64,
		[() => cT, 0],
		2,
		[() => Xw, 0],
		() => ww,
		1,
		[() => fT, 0],
		0,
		4,
		2,
		0,
		0,
		0,
		0,
		0,
		2,
		0,
		[() => Jw, 0],
		0,
		4,
		0,
		0,
		() => nw,
		0,
		() => Dw,
		0,
		0,
		2,
		2,
		2,
		0,
		() => Ww,
		0,
		0,
		1,
		0
	]
], lw = [
	3,
	V,
	pm,
	0,
	[cm],
	[0]
], uw = [
	3,
	V,
	_m,
	0,
	[mv, Om],
	[0, [() => Yw, 0]]
], dw = [
	3,
	V,
	bm,
	0,
	[
		ey,
		yg,
		Tb
	],
	[
		0,
		0,
		0
	]
], fw = [
	3,
	V,
	Em,
	0,
	[
		Cb,
		xv,
		Tb,
		hv
	],
	[
		0,
		2,
		0,
		0
	]
], pw = [
	3,
	V,
	Bm,
	0,
	[Lm, zv],
	[0, 0]
], mw = [
	3,
	V,
	ah,
	0,
	[sh, Tb],
	[0, 0]
], hw = [
	3,
	V,
	Ym,
	0,
	[
		bh,
		N,
		jy,
		tg,
		Kf,
		Tb,
		Lv,
		op,
		Kb,
		Lg,
		lv,
		mg,
		k_,
		Sb,
		kg,
		vb,
		jv,
		Qv,
		ub,
		Ny,
		P,
		kb,
		hg,
		By,
		hp,
		Bv,
		E_,
		Xm,
		Bb,
		Mg,
		Hv,
		Qh,
		Pb,
		xb,
		Pv,
		Iy,
		yh,
		cv,
		Uh,
		ip,
		Ty,
		xg
	],
	[
		0,
		0,
		4,
		0,
		1,
		0,
		1,
		0,
		0,
		4,
		0,
		0,
		0,
		0,
		1,
		1,
		0,
		1,
		0,
		0,
		0,
		0,
		2,
		0,
		1,
		0,
		0,
		0,
		0,
		2,
		[() => cT, 0],
		0,
		[() => fT, 0],
		0,
		4,
		4,
		0,
		2,
		2,
		() => Uw,
		0,
		1
	]
], gw = [
	3,
	V,
	Sh,
	0,
	[mv, Eh],
	[0, [() => tT, 0]]
], _w = [
	3,
	V,
	vh,
	0,
	[
		mh,
		ih,
		Kb,
		Wy,
		Eb,
		nh,
		rb
	],
	[
		0,
		0,
		0,
		0,
		[() => dT, 0],
		0,
		64
	]
], vw = [
	3,
	V,
	Ah,
	0,
	[
		N,
		Hy,
		_g,
		Rp
	],
	[
		0,
		2,
		0,
		2
	],
	1
], yw = [
	3,
	V,
	Mh,
	0,
	[om],
	[[() => cw, 0]]
], bw = [
	3,
	V,
	jh,
	0,
	[
		N,
		Cg,
		Q_,
		mv
	],
	[
		0,
		[() => rT, 0],
		1,
		0
	]
], xw = [
	3,
	V,
	Ph,
	0,
	[
		N,
		bh,
		Sb,
		Cg,
		Q_,
		mv,
		C_,
		f_,
		Qh
	],
	[
		0,
		0,
		0,
		[() => rT, 0],
		1,
		0,
		2,
		2,
		0
	]
], Sw = [
	3,
	V,
	Xh,
	0,
	[
		tg,
		mg,
		hm,
		k_,
		sp,
		nx,
		Cg,
		Q_,
		mv
	],
	[
		0,
		0,
		0,
		0,
		0,
		2,
		[() => rT, 0],
		1,
		0
	],
	1
], Cw = [
	3,
	V,
	Kh,
	0,
	[
		eg,
		Tb,
		bg,
		Ng,
		Fv,
		qf,
		Rh
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		64
	]
], ww = [
	3,
	V,
	gg,
	0,
	[
		up,
		Lv,
		Og
	],
	[
		0,
		1,
		0
	]
], Tw = [
	3,
	V,
	wg,
	0,
	[gv, tx],
	[0, [() => iT, 0]],
	2
], Ew = [
	3,
	V,
	M_,
	0,
	[ly, Cg],
	[0, [() => rT, 0]],
	1
], Dw = [
	3,
	V,
	fv,
	0,
	[
		Oy,
		gb,
		E_
	],
	[
		0,
		0,
		0
	]
], Ow = [
	3,
	V,
	I_,
	0,
	[
		qb,
		Kf,
		d_,
		F_,
		vb,
		P,
		Vy
	],
	[
		0,
		1,
		1,
		1,
		1,
		0,
		2
	],
	1
], kw = [
	3,
	V,
	V_,
	0,
	[
		N,
		Kf,
		hm,
		mh,
		_h,
		Yb,
		Ff,
		dv,
		Lm,
		hp,
		Bv,
		Zv,
		R_,
		mg,
		Rf,
		Lf,
		k_,
		kg,
		vb,
		jv,
		vv,
		P,
		kb,
		Ab,
		_p,
		eg,
		Lh,
		Jh,
		zp,
		Ih,
		Oh,
		Lp,
		X_,
		Wm,
		Rv,
		$_,
		zh,
		$v,
		ag,
		Bh,
		ug,
		Kv,
		Jv,
		Mp,
		Hv,
		Hb,
		Zh,
		F_,
		Fp,
		sy,
		If,
		ay,
		ig,
		yv,
		Pf,
		Z_,
		cy,
		pv,
		cv,
		Uh,
		tg,
		ip,
		$p,
		Ib,
		uv,
		sg
	],
	[
		0,
		1,
		0,
		0,
		[() => eT, 0],
		[() => mT, 0],
		2,
		[() => XC, 0],
		0,
		1,
		0,
		0,
		2,
		0,
		2,
		2,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		[() => XC, 0],
		0,
		0,
		0,
		0,
		0,
		64,
		2,
		2,
		1,
		1,
		2,
		0,
		0,
		1,
		2,
		0,
		2,
		0,
		1,
		() => rw,
		[() => cT, 0],
		2,
		2,
		1,
		2,
		0,
		0,
		1,
		2,
		0,
		0,
		2,
		2,
		0,
		2,
		2,
		0,
		() => aT,
		0,
		[() => pT, 0],
		0,
		0
	],
	1
], Aw = [
	3,
	V,
	H_,
	0,
	[om],
	[[() => cw, 0]]
], jw = [
	3,
	V,
	Av,
	0,
	[jv, Tb],
	[0, 0]
], Mw = [
	3,
	V,
	Cv,
	0,
	[
		tg,
		mg,
		hm,
		k_,
		sp,
		lp,
		z_,
		dy,
		nx,
		pb,
		P,
		Jy,
		hb,
		zy,
		Ky,
		sb,
		ev,
		tv,
		G_,
		K_,
		q_,
		J_,
		rv,
		iv,
		av,
		ov,
		Hf,
		Ry,
		fb,
		Xy,
		Sv,
		Cy,
		Uy,
		rb,
		My,
		Py,
		wy,
		Gy,
		Nf
	],
	[
		0,
		0,
		0,
		0,
		0,
		[() => Gw, 0],
		2,
		2,
		2,
		2,
		0,
		2,
		2,
		2,
		2,
		2,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		[() => qw, 0],
		64,
		2,
		2,
		2,
		64,
		2,
		64,
		2,
		2,
		2,
		2,
		[() => Kw, 0]
	]
], Nw = [
	3,
	V,
	Tv,
	0,
	[Ev, mv],
	[[() => sT, 0], 0]
], Pw = [
	3,
	V,
	Iv,
	0,
	[dp],
	[0]
], Fw = [
	3,
	V,
	Vv,
	0,
	[P_, N_],
	[64, 64]
], Iw = [
	3,
	V,
	Xv,
	0,
	[
		hm,
		Kf,
		dv,
		Lv,
		hp,
		R_,
		mg,
		k_,
		kg,
		vb,
		N,
		P,
		_p,
		mh,
		Vv,
		Hv,
		If,
		oy,
		cv,
		Mg,
		Uh,
		tg,
		ip,
		$p
	],
	[
		0,
		1,
		[() => XC, 0],
		1,
		1,
		2,
		0,
		0,
		1,
		1,
		0,
		0,
		0,
		0,
		() => Fw,
		[() => cT, 0],
		0,
		4,
		2,
		2,
		2,
		0,
		() => Uw,
		0
	]
], Lw = [
	3,
	V,
	Wv,
	0,
	[gv, Wb],
	[0, 0]
], Rw = [
	3,
	V,
	Db,
	0,
	[
		Yy,
		Dy,
		ib,
		_b
	],
	[
		0,
		() => $C,
		() => Pw,
		0
	]
], zw = [
	3,
	V,
	zb,
	0,
	[T_, Wb],
	[0, 0]
], Bw = [
	3,
	V,
	Fb,
	0,
	[Pb],
	[[() => fT, 0]]
], Vw = [
	3,
	V,
	Rb,
	0,
	[by, Ob],
	[0, [() => fT, 0]]
], Hw = [
	3,
	V,
	$b,
	0,
	[Zb, Tb],
	[0, 0]
], Uw = [
	1,
	V,
	tp,
	0,
	() => ZC
], Ww = [
	1,
	V,
	rp,
	0,
	() => QC
], Gw = [
	1,
	V,
	cp,
	0,
	[() => $C, { [B]: op }]
], Kw = [
	1,
	V,
	Mf,
	0,
	[() => ew, { [B]: jf }]
], qw = [
	1,
	V,
	Vf,
	0,
	[() => tw, { [B]: Bf }]
], Jw = [
	1,
	V,
	fm,
	0,
	[() => lw, { [B]: pm }]
], Yw = [
	1,
	V,
	gm,
	0,
	[() => cw, { [B]: om }]
], Xw = [
	1,
	V,
	wm,
	0,
	[() => dw, { [B]: bm }]
], Zw = [
	1,
	V,
	Dm,
	0,
	[() => fw, { [B]: Em }]
], Qw = [
	1,
	V,
	Vm,
	0,
	[() => pw, { [B]: Fm }]
], $w = [
	1,
	V,
	oh,
	0,
	[() => mw, { [B]: Qm }]
], eT = [
	1,
	V,
	fh,
	0,
	[0, { [B]: sh }]
], tT = [
	1,
	V,
	xh,
	0,
	[() => hw, { [B]: Ym }]
], nT = [
	1,
	V,
	Gh,
	0,
	[() => Cw, { [B]: Kh }]
], rT = [
	1,
	V,
	vg,
	0,
	[() => Tw, { [B]: wg }]
], iT = [
	1,
	V,
	Sg,
	0,
	[0, { [B]: Wb }]
], aT = [
	1,
	V,
	L_,
	0,
	() => Ow
], oT = [
	1,
	V,
	kv,
	0,
	[() => jw, { [B]: Av }]
], sT = [
	1,
	V,
	wv,
	0,
	[() => Mw, { [B]: Cv }]
], cT = [
	1,
	V,
	Uv,
	0,
	[() => Lw, { [B]: Wv }]
], lT = [
	1,
	V,
	py,
	0,
	[0, { [B]: my }]
], uT = [
	1,
	V,
	gy,
	0,
	[0, { [B]: _y }]
], dT = [
	1,
	V,
	Zy,
	0,
	[() => Rw, { [B]: Db }]
], fT = [
	1,
	V,
	Pb,
	0,
	[() => zw, { [B]: zb }]
], pT = [
	1,
	V,
	Lb,
	0,
	[() => Vw, { [B]: rx }]
], mT = [
	1,
	V,
	Xb,
	0,
	[0, { [B]: Zb }]
], hT = [
	1,
	V,
	Qb,
	0,
	[() => Hw, { [B]: $b }]
], gT = [
	9,
	V,
	Tp,
	0,
	() => iw,
	() => aw
], _T = [
	9,
	V,
	Ap,
	0,
	() => ow,
	() => sw
], vT = [
	9,
	V,
	kh,
	0,
	() => vw,
	() => yw
], yT = [
	9,
	V,
	Nh,
	0,
	() => bw,
	() => uw
], bT = [
	9,
	V,
	Fh,
	0,
	() => xw,
	() => gw
], xT = [
	9,
	V,
	Yh,
	0,
	() => Sw,
	() => Nw
], ST = [
	9,
	V,
	j_,
	0,
	() => Ew,
	() => Bw
], CT = [
	9,
	V,
	B_,
	0,
	() => kw,
	() => Aw
];
oa(), he(), O();
var wT = (e) => ({
	apiVersion: "2014-10-31",
	base64Decoder: e?.base64Decoder ?? pt,
	base64Encoder: e?.base64Encoder ?? _t,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Bl,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? al,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new pc()
	}],
	logger: e?.logger ?? new st(),
	protocol: e?.protocol ?? Cl,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.rds",
		errorTypeRegistries: YC,
		xmlNamespace: "http://rds.amazonaws.com/doc/2014-10-31/",
		version: "2014-10-31",
		serviceTarget: "AmazonRDSv19"
	},
	serviceId: e?.serviceId ?? "RDS",
	sha256: e?.sha256 ?? ia,
	urlParser: e?.urlParser ?? me,
	utf8Decoder: e?.utf8Decoder ?? ht,
	utf8Encoder: e?.utf8Encoder ?? xt
});
O(), Ni();
var TT = (e) => {
	let t = nc(e), n = () => t().then(Qe), r = wT(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? Pn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Hs({
			serviceId: r.serviceId,
			clientVersion: ll.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? ve("Region is missing"),
		requestHandler: pl.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || Yo),
		streamCollector: e?.streamCollector ?? Mi,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, ET = (e) => {
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
}, DT = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), OT = (e, t) => {
	let n = Object.assign(ic(e), it(e), fo(e), ET(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, ac(n), at(n), po(n), DT(n));
};
Di(), w();
var kT = class extends ye {
	config;
	constructor(...[e]) {
		let t = TT(e || {});
		super(t), this.initConfig = t;
		let n = ts(ec($o(Ts(sl(t))))), r = OT(ol(Ti(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(ke(this.config)), this.middlewareStack.use(Vs(this.config)), this.middlewareStack.use(es(this.config)), this.middlewareStack.use(_o(this.config)), this.middlewareStack.use(is(this.config)), this.middlewareStack.use(ss(this.config)), this.middlewareStack.use(cs(this.config)), this.middlewareStack.use(ps(this.config, {
			httpAuthSchemeParametersProvider: rl,
			identityProviderConfigProvider: async (e) => new bs({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(vs(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-rds@3.1156.0/node_modules/@aws-sdk/client-rds/dist-es/commandBuilder.js
Di();
var AT = ct(cl, "AmazonRDSv19", "RDSClient", Ei), jT = {}, MT = (e, t, n, r) => [], NT = class extends AT(jT, MT, "CreateDBInstance", gT) {}, PT = class extends AT(jT, MT, "CreateDBSnapshot", _T) {}, FT = class extends AT(jT, MT, "DeleteDBInstance", vT) {}, IT = class extends AT(jT, MT, "DescribeDBInstances", yT) {}, LT = class extends AT(jT, MT, "DescribeDBSnapshots", bT) {}, RT = class extends AT(jT, MT, "DescribeOrderableDBInstanceOptions", xT) {}, zT = class extends AT(jT, MT, "ListTagsForResource", ST) {}, BT = class extends AT(jT, MT, "ModifyDBInstance", CT) {}, VT = class extends Error {
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
}, HT = Symbol(), UT = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), WT = 1e4, GT = (e) => "headers" in e, KT = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (GT(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? qT(e, {
		all: n,
		dot: r
	}) : {};
};
async function qT(e, t) {
	if (!GT(e) && e.bodyCache.formData) return JT(await e.bodyCache.formData, t);
	let n = GT(e) ? e.headers : e.raw.headers, r = UT(await e.arrayBuffer(), n.get("Content-Type") || "");
	GT(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? JT(i, t) : {};
}
function JT(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? YT(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (XT(n, e, t, r), delete n[e]);
	}), n;
}
var YT = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, XT = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && ZT(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= WT && ZT(), i[e] = Object.create(null)), i = i[e]);
	});
}, ZT = () => {
	throw Error("Nesting limit exceeded");
}, QT = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, $T = (e) => {
	let { groups: t, path: n } = eE(e);
	return tE(QT(n), t);
}, eE = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, tE = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, nE = {}, rE = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return nE[r] || (nE[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), nE[r];
	}
	return null;
}, iE = (e, t) => {
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
}, aE = (e) => iE(e, decodeURI), oE = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return aE(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, sE = (e) => {
	let t = oE(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, cE = (e, t, ...n) => (n.length && (t = cE(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), lE = (e) => {
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
}, uE = (e) => e.indexOf("%") === -1 ? e : iE(e, hE), dE = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), uE(e)), fE = (e, t, n) => {
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
					return dE(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = dE(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = dE(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, pE = fE, mE = (e, t) => fE(e, t, !0), hE = decodeURIComponent, gE = class {
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
		return n && uE(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = uE(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return pE(this.url, e);
	}
	queries(e) {
		return mE(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return KT(this, e);
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
	get [HT]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, _E = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, vE = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, yE = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => yE(e, t, !1, r, i))).then(() => i[0]));
	return n ? vE(await o, a) : o;
}, bE = "text/plain; charset=UTF-8", xE = (e, t) => ({
	"Content-Type": e,
	...t
}), SE = (e, t) => new Response(e, t), CE = class {
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
		return this.#t ??= new gE(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= SE(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = SE(e.body, e);
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
		this.finalized && (this.#a = SE(this.#a.body, this.#a));
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
		return SE(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, xE(bE, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, xE("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, xE("text/html; charset=UTF-8", n));
		return typeof e == "object" ? yE(e, _E.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => SE(), this.#c(this));
}, wE = (e, t, n) => (r, i) => {
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
}, TE = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], EE = "Can not add a route since the matcher is already built.", DE = class extends Error {}, OE = "__COMPOSED_HANDLER", kE = (e) => e.text("404 Not Found", 404), AE = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, jE = class e {
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
		[...TE, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? oE : sE;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = kE;
	errorHandler = AE;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === AE ? r = e.handler : (r = async (n, r) => (await wE([], t.errorHandler)(n, () => e.handler(n, r))).res, r[OE] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = cE(this._basePath, e), t;
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
			let t = cE(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", cE(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = cE(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : cE(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new CE(e, {
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
		let s = wE(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${cE("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, U = () => Object.create(null), ME = [];
function NE(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], ME];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var PE = "[^/]+", FE = "(?:|/.*)", IE = Symbol(), LE = /* @__PURE__ */ new Set(".\\+*[^]$()");
function RE(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var zE = class e {
	#e;
	#t;
	#n = U();
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
				PE
			] : null : s === "/*" ? [
				"",
				"",
				FE
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && LE.has(n))) throw IE;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw IE;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw IE;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw IE;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(RE).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : LE.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, BE = class {
	#e = { varIndex: 0 };
	#t = new zE();
	#n = 0;
	paths = U();
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
}, VE = U();
function HE(e) {
	return VE[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? FE : e === "*" ? ".*" : `/:${PE}`)}$`);
}
function UE(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (HE(n).test(t)) return [...e[n]];
}
var WE = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: U() }, this.#t = { ALL: U() }, this.#n = { ALL: new BE() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === IE ? new DE(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(EE);
		if (!r[e]) {
			this.#n[e] = new BE();
			for (let t of [r, i]) {
				t[e] = U();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = HE(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = UE(r[e], t) || UE(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = lE(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = UE(r[t], e) || UE(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = NE;
	buildAllMatchers() {
		let e = U();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, VE = U(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = U(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), U())]) : i[t] = [n.map(([e]) => [e, U()]), ME];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, GE = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(EE);
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
				if (e instanceof DE) continue;
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
}, KE = U(), qE = 0, JE = class e {
	#e = [];
	#t = U();
	#n = [];
	#r;
	#i = KE;
	insert(t, n, r) {
		let i = this, a = $T(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = rE(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++qE
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = U(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = KE;
		let r = [this], i = QT(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === KE ? {} : { ...p.#i };
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
}, YE = class {
	name = "TrieRouter";
	#e = new JE();
	add(e, t, n) {
		for (let r of lE(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, XE = class extends jE {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new GE({ routers: [new WE(), new YE()] });
	}
}, ZE = [
	"start",
	"stop",
	"reboot"
], W = class extends Error {
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
}, G = class extends W {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, QE = class extends W {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, K = class extends W {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, $E = class extends W {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, eD = class extends W {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, q = class extends W {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, tD = class extends W {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, nD = class extends W {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, rD = class extends W {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, iD = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function aD(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && iD.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function oD(e, t) {
	let n = sD(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function sD(e, t) {
	if (e instanceof W) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return aD(e) ? new nD(r, { cause: e }) : new rD(r, { cause: e });
}
var cD = 1e3, lD = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function uD(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new G("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new G("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new G("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = dD(r)), a;
}
function dD(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!lD.includes(t)) throw new G(`sortKey.operator must be one of ${lD.join(", ")}.`);
	if (typeof n != "string" || !n) throw new G("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new G("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new G("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function fD(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new G(`limit must be a whole number between 1 and ${cD}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new G(`limit must be between 1 and ${cD}.`);
	return t;
}
// src/cloud-spi/serviceCatalog.ts
var pD = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], mD = {
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
}, hD = Object.keys(mD).map((e) => ({
	service: e,
	...mD[e]
})).sort(yD);
hD.map((e) => e.service);
function J(e) {
	return Object.hasOwn(mD, e);
}
function gD(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function _D(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function vD(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function yD(e, t) {
	let n = pD.indexOf(e.group) - pD.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var bD = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function xD(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${bD[t]}/${n}/` : void 0;
}
// src/adapter-aws/awsErrors.ts
var SD = /* @__PURE__ */ new Set([
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
]), CD = /* @__PURE__ */ new Set([
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
]), wD = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), TD = /* @__PURE__ */ new Set([
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
]), ED = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), DD = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), OD = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function kD(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function AD(e) {
	if (!kD(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || SD.has(n)) return new eD(r, i);
	if (CD.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new $E(r, i);
	if (wD.has(n)) return new QE(r, i);
	if (TD.has(n)) return new G(r, i);
	if (ED.has(n) || /\.NotFound$/.test(n)) return new K(r, i);
	if (DD.has(n)) return new tD(r, i);
	if (OD.has(n) || aD(e)) return new nD(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new G(r, i) : a === 401 || a === 403 ? new QE(r, i) : a === 404 ? new K(r, i) : a === 409 ? new $E(r, i) : a === 429 ? new eD(r, i) : a === 501 ? new tD(r, i) : a === 503 || a === 504 ? new nD(r, i) : new rD(r, i);
}
// browser-bundle/cloudproxy-stub.ts
function jD() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// src/service/deadline.ts
async function MD(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// src/service/defaultCloud.ts
var ND = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, PD = !1;
function FD(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = ID(t);
	return !n && !PD && (PD = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function ID(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(ND, t) ? ND[t] : null;
}
var LD = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), RD = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), zD = 5464, BD = 8192, VD = 50, HD = 12e4;
function UD(e, t = jD) {
	let n = new XE();
	n.onError((e, t) => {
		if (e instanceof W) {
			let { status: n, body: r } = oD(e);
			return t.json(r, n);
		}
		return e instanceof VT ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : FD();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && Y(n) && n !== i) throw new K("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new K("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return aO(e, 150), Q(e, () => MD(HD, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: sO(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!Y(n)) throw new K("Unknown cloud");
		return n === "aws" ? Q(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new G("queryString must be a string.");
			if (typeof t.startTime != "number") throw new G("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new G("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new G("limit must be a number.");
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
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new G("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > VD) throw new G(`logGroupNames must include at most ${VD} log groups.`);
			if (typeof n.queryString != "string") throw new G("queryString must be a string.");
			if (typeof n.startTime != "number") throw new G("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new G("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new G("limit must be a number.");
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
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
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
		if (!Y(t) || n === null) throw new K("Unknown cloud or version");
		return Q(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new K("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!Y(t) || n === null) throw new K("Unknown cloud or version");
		return Q(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!Y(t) || !Number.isInteger(n) || n <= 0) throw new K("Unknown cloud or deployment");
		return Q(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new K("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), rO(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), rO(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", iO(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), rO(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", iO(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), uD(n), iO(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new K("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new G("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return Q(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new G("Object key is required");
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
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new G("Object key is required");
		return Q(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new G("srcKey and destKey are required");
		return Q(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await XD(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new G("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new G("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new G("maxMessages must be an integer between 1 and 10");
		return Q(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = qD((await XD(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = JD(e.req.query());
		return Q(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new G("receiptHandle is required");
		return Q(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return oO(e, async () => {
			let n = await ZD(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: nO(n.plaintextBase64, "plaintextBase64", zD),
				encryptionAlgorithm: QD(n.encryptionAlgorithm),
				encryptionContext: tO(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return oO(e, async () => {
			let n = await ZD(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: nO(n.ciphertextBlobBase64, "ciphertextBlobBase64", BD),
				encryptionAlgorithm: QD(n.encryptionAlgorithm),
				encryptionContext: tO(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of ZE) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!Y(n)) throw new K("Unknown cloud");
		return Q(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return oO(e, async () => {
			let n = await ZD(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: nO(n.messageBase64, "messageBase64", zD),
				signingAlgorithm: $D(n.signingAlgorithm)
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
		if (!Y(t)) throw new K("Unknown cloud");
		return oO(e, async () => {
			let n = await ZD(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: nO(n.messageBase64, "messageBase64", zD),
				signature: nO(n.signatureBase64, "signatureBase64", BD),
				keyVersionId: eO(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: $D(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Y(t)) throw new K("Unknown cloud");
		return Q(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await XD(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = YD(await XD(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function Y(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var WD = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], GD = 100, KD = 100;
function qD(e) {
	if (!Array.isArray(e) || e.length === 0) throw new G("messages must contain at least one entry");
	if (e.length > KD) throw new G(`messages must contain at most ${KD} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new G("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new G("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function JD(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new G("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!WD.includes(n)) throw new G(`cursorType must be one of ${WD.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new G("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new G("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > GD) throw new G(`limit must be an integer between 1 and ${GD}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function YD(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new G(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function XD(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new G("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof G ? e : new G("Request body must be valid JSON");
	}
}
var X = class extends G {};
async function ZD(e) {
	try {
		return await XD(e);
	} catch (e) {
		throw e instanceof G ? new X(e.message) : e;
	}
}
function QD(e) {
	if (typeof e != "string" || !LD.has(e)) throw new X("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function $D(e) {
	if (typeof e != "string" || !RD.has(e)) throw new X("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function eO(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new X(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function tO(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new X("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new X("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function nO(e, t, n) {
	if (typeof e != "string") throw new X(`${t} must be a base64 string`);
	if (e.length > n) throw new X(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new X(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new X(`${t} must be canonical base64`);
	return r;
}
function Z(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !Y(t) || !J(n) ? null : {
		cloud: t,
		service: n
	};
}
function rO(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: fD(e.req.query("limit"))
	};
}
function iO(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new G("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new G("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: fD(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function aO(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function Q(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = oD(t, AD);
		return e.json(r, n);
	}
}
async function oO(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = oD(t, AD);
		if (t instanceof X) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function sO(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
UD();
// src/registry/CloudAdapterRegistry.ts
var cO = class {
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
}, lO = async () => {}, uO = {
	aws: lO,
	azure: lO,
	gcp: lO,
	oci: lO
};
function dO() {
	return null;
}
// src/service/CloudProxyService.ts
var fO = 5e3, pO = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = uO, n = FD(), r = null) {
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
		return Promise.all(hD.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? gD(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: _D(t, e),
				docsUrl: xD(t, e),
				availability: a,
				reason: r.reason ?? mO(a, e, o),
				route: vD(t, e),
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
			endpoint: dO(e),
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
		if (r && Date.now() - r.at < fO) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = dO(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = oD(r, AD);
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
		if (t && Date.now() - t.at < fO) return t.value;
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
		if (!i.update) throw new q(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new q(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new q(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new q(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new q(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new K(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new q(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new q(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new q(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new q(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new q(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new q(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new q(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new q(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new q(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new q(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new q(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new q(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new q(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new q(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new q(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new q(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new q(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new q(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new q(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = hO(e, t);
		if (this.emptying.has(a)) throw new $E(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new $E(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = hO(e, t);
		if (this.emptying.has(r)) throw new $E(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
		if (!i.listObjects) throw new q(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new q(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new q(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new q(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new q(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new q(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new q(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new q(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new q(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new q(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new q(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new q(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new q(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new q(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new q(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new q(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new q(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new q(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new q(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new q(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new q(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new q(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new q(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new q(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new q(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new q(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new q(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new q(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new q(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new q(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new q(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new q(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new q(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new q(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new q(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new q(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new q(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new q(`AppConfig resources are not supported for ${e}/configuration`);
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
		if (!n.listLambdaTriggers) throw new q(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new q(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new q(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new q(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function mO(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function hO(e, t) {
	return JSON.stringify([e, t]);
}
// browser-bundle/aws-stub.ts
var gO = {
	eks: void 0,
	ec2: void 0,
	elbv2: void 0,
	dsql: void 0,
	sts: void 0,
	rds: void 0
}, _O = [
	{
		name: "name",
		label: "Name"
	},
	{
		name: "status",
		label: "Status"
	},
	{
		name: "engine",
		label: "Engine"
	},
	{
		name: "version",
		label: "Version"
	},
	{
		name: "instanceClass",
		label: "Class"
	}
], vO = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}];
function yO() {
	return {
		cloud: "aws",
		service: "database",
		displayName: "AWS RDS",
		fields: [
			{
				name: "dbInstanceIdentifier",
				label: "DB Instance Identifier",
				type: "text",
				required: !0,
				validation: {
					pattern: "^(?!.*--)[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$",
					minLength: 1,
					maxLength: 63
				}
			},
			{
				name: "engine",
				label: "Engine",
				type: "select",
				required: !0,
				defaultValue: "postgres",
				options: [
					{
						label: "PostgreSQL",
						value: "postgres"
					},
					{
						label: "MySQL",
						value: "mysql"
					},
					{
						label: "MariaDB",
						value: "mariadb"
					}
				]
			},
			{
				name: "masterUserPassword",
				label: "Master User Password",
				type: "password",
				required: !0,
				span: !0,
				validation: {
					minLength: 8,
					maxLength: 128
				}
			},
			{
				name: "dbInstanceClass",
				label: "DB Instance Class",
				type: "text",
				required: !1,
				defaultValue: "db.t3.micro"
			},
			{
				name: "allocatedStorage",
				label: "Allocated Storage",
				type: "text",
				required: !1,
				defaultValue: "20",
				validation: { pattern: "^[1-9][0-9]*$" }
			},
			{
				name: "masterUsername",
				label: "Master Username",
				type: "text",
				required: !1,
				defaultValue: "root",
				validation: { maxLength: 63 }
			},
			{
				name: "dbName",
				label: "Database Name",
				type: "text",
				required: !1,
				defaultValue: "",
				validation: { maxLength: 64 }
			},
			{
				name: "engineVersion",
				label: "Engine Version",
				type: "text",
				required: !1,
				defaultValue: ""
			},
			{
				name: "securityGroupIds",
				label: "Security Group IDs",
				type: "text",
				required: !1,
				span: !0,
				description: "One or more SG IDs separated by commas — e.g. sg-111, sg-222"
			}
		],
		actions: [
			"list",
			"create",
			"update",
			"delete",
			"inspect"
		],
		capabilities: {
			resourceActions: [
				{
					name: "list",
					label: "List DB instances",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "create",
					label: "Create DB instance",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "update",
					label: "Update DB instance",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "delete",
					label: "Delete DB instance",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "inspect",
					label: "Inspect DB instance",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				}
			],
			databaseActions: [{
				name: "listSnapshots",
				label: "List DB snapshots",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			}, {
				name: "createSnapshot",
				label: "Create DB snapshot",
				enabled: !0,
				status: "partial",
				reason: "The Cloud Proxy operation is available, but the current Floci runtime does not implement CreateDBSnapshot.",
				runtimeRequired: !0
			}]
		},
		filters: vO,
		columns: _O,
		updateFields: [
			{
				name: "masterUserPassword",
				label: "Master Password",
				type: "password",
				required: !1,
				span: !0,
				description: "Leave blank to keep the current password. Class, storage, engine, and version are omitted because the current emulator does not support modifying them.",
				validation: {
					minLength: 8,
					maxLength: 128
				}
			},
			{
				name: "enableIamDatabaseAuthentication",
				label: "IAM Database Authentication",
				type: "select",
				required: !1,
				valuePath: "metadata.iamDatabaseAuthenticationEnabled",
				description: "Leave unchanged to keep current setting.",
				options: [{
					label: "True",
					value: "true"
				}, {
					label: "False",
					value: "false"
				}]
			},
			{
				name: "dbSubnetGroupName",
				label: "DB Subnet Group",
				type: "text",
				required: !1,
				valuePath: "metadata.subnetGroup.name",
				description: "Leave unchanged or blank to keep current DB subnet group."
			},
			{
				name: "vpcSecurityGroupIds",
				label: "VPC Security Group IDs",
				type: "text",
				required: !1,
				valuePath: "metadata.vpcSecurityGroupIds",
				description: "Comma-separated security group IDs. Leave unchanged or blank to keep current security groups."
			},
			{
				name: "optionGroupName",
				label: "Option Group",
				type: "text",
				required: !1,
				valuePath: "metadata.optionGroupName",
				description: "Leave unchanged or blank to keep current option group."
			},
			{
				name: "autoMinorVersionUpgrade",
				label: "Auto Minor Version Upgrade",
				type: "select",
				required: !1,
				valuePath: "metadata.autoMinorVersionUpgrade",
				description: "Leave unchanged to keep current setting.",
				options: [{
					label: "True",
					value: "true"
				}, {
					label: "False",
					value: "false"
				}]
			}
		]
	};
}
// src/services/rds.ts
function bO(e) {
	return {
		identifier: e.DBInstanceIdentifier ?? "",
		arn: e.DBInstanceArn,
		resourceId: e.DbiResourceId,
		createdAt: e.InstanceCreateTime?.toISOString(),
		status: e.DBInstanceStatus,
		engine: e.Engine,
		engineVersion: e.EngineVersion,
		instanceClass: e.DBInstanceClass,
		dbName: e.DBName,
		masterUsername: e.MasterUsername,
		allocatedStorage: e.AllocatedStorage,
		storageType: e.StorageType,
		availabilityZone: e.AvailabilityZone,
		multiAz: e.MultiAZ,
		publiclyAccessible: e.PubliclyAccessible,
		iamDatabaseAuthenticationEnabled: e.IAMDatabaseAuthenticationEnabled,
		preferredBackupWindow: e.PreferredBackupWindow,
		preferredMaintenanceWindow: e.PreferredMaintenanceWindow,
		endpoint: e.Endpoint ? {
			address: e.Endpoint.Address,
			port: e.Endpoint.Port,
			hostedZoneId: e.Endpoint.HostedZoneId
		} : void 0,
		vpcSecurityGroups: (e.VpcSecurityGroups ?? []).map((e) => ({
			id: e.VpcSecurityGroupId,
			status: e.Status
		})),
		subnetGroup: e.DBSubnetGroup ? {
			name: e.DBSubnetGroup.DBSubnetGroupName,
			vpcId: e.DBSubnetGroup.VpcId,
			status: e.DBSubnetGroup.SubnetGroupStatus,
			subnets: (e.DBSubnetGroup.Subnets ?? []).map((e) => ({
				identifier: e.SubnetIdentifier,
				availabilityZone: e.SubnetAvailabilityZone?.Name,
				status: e.SubnetStatus
			}))
		} : void 0,
		optionGroupName: e.OptionGroupMemberships?.[0]?.OptionGroupName,
		autoMinorVersionUpgrade: e.AutoMinorVersionUpgrade
	};
}
function xO(e) {
	return {
		identifier: e.DBSnapshotIdentifier ?? "",
		instanceIdentifier: e.DBInstanceIdentifier,
		arn: e.DBSnapshotArn,
		status: e.Status,
		engine: e.Engine,
		engineVersion: e.EngineVersion,
		allocatedStorage: e.AllocatedStorage,
		snapshotType: e.SnapshotType,
		createdAt: e.SnapshotCreateTime?.toISOString(),
		port: e.Port,
		availabilityZone: e.AvailabilityZone,
		vpcId: e.VpcId
	};
}
function SO(e = gO.rds) {
	return {
		async listInstances() {
			let t = [], n;
			do {
				let r = await e.send(new IT({ Marker: n }));
				t.push(...(r.DBInstances ?? []).map(bO)), n = r.Marker;
			} while (n);
			return t;
		},
		async describeInstance(t) {
			return bO((await e.send(new IT({ DBInstanceIdentifier: t }))).DBInstances?.[0] ?? {});
		},
		async createInstance(t) {
			return bO((await e.send(new NT(t))).DBInstance ?? {});
		},
		async modifyInstance(t) {
			return bO((await e.send(new BT(t))).DBInstance ?? {});
		},
		async deleteInstance(t, n = !0, r) {
			await e.send(new FT({
				DBInstanceIdentifier: t,
				SkipFinalSnapshot: n,
				...r ? { FinalDBSnapshotIdentifier: r } : {}
			}));
		},
		async listSnapshots(t) {
			let n = [], r;
			do {
				let i = await e.send(new LT({
					DBInstanceIdentifier: t,
					Marker: r
				}));
				n.push(...(i.DBSnapshots ?? []).map(xO)), r = i.Marker;
			} while (r);
			return n;
		},
		async createSnapshot(t, n) {
			return xO((await e.send(new PT({
				DBInstanceIdentifier: t,
				DBSnapshotIdentifier: n
			}))).DBSnapshot ?? {});
		},
		async listOrderableInstanceClasses(t) {
			let n = /* @__PURE__ */ new Set(), r;
			do {
				let i = await e.send(new RT({
					Engine: t,
					Marker: r
				}));
				for (let e of i.OrderableDBInstanceOptions ?? []) e.DBInstanceClass && n.add(e.DBInstanceClass);
				r = i.Marker;
			} while (r);
			return Array.from(n);
		}
	};
}
var CO = SO(), wO = class {
	rdsService_;
	rds;
	cloud = "aws";
	service = "database";
	constructor(e = CO, t = void 0) {
		this.rdsService_ = e, this.rds = t;
	}
	schema() {
		return yO();
	}
	async list(e = {}) {
		let t = await this.rdsService_.listInstances();
		return PO(await Promise.all(t.map((e) => this.toResource(e))), e.search);
	}
	async get(e) {
		try {
			return await this.toResource(await this.rdsService_.describeInstance(e));
		} catch (e) {
			if (FO(e, 404)) return null;
			throw e;
		}
	}
	async create(e) {
		let t = e.values, n = DO(t.dbInstanceIdentifier), r = kO(t.engine), i = AO(t.masterUserPassword), a = $(t.dbInstanceClass) || "db.t3.micro", o = jO(t.allocatedStorage), s = $(t.masterUsername) || "root", c = $(t.dbName) || void 0, l = $(t.engineVersion) || void 0, u = MO(t.securityGroupIds ?? t.vpcSecurityGroupIds), d = await this.rdsService_.createInstance({
			DBInstanceIdentifier: n,
			Engine: r,
			MasterUserPassword: i,
			DBInstanceClass: a,
			AllocatedStorage: o,
			MasterUsername: s,
			DBName: c,
			EngineVersion: l,
			VpcSecurityGroupIds: u
		});
		return this.toResource(d);
	}
	async update(e, t) {
		let n = t.values ?? {}, r = IO(n.masterUserPassword), i = LO(n.enableIamDatabaseAuthentication, "enableIamDatabaseAuthentication"), a = RO(n.dbSubnetGroupName), o = zO(n.vpcSecurityGroupIds), s = RO(n.optionGroupName), c = LO(n.autoMinorVersionUpgrade, "autoMinorVersionUpgrade");
		if (r === void 0 && i === void 0 && a === void 0 && o === void 0 && s === void 0 && c === void 0) throw new G("At least one supported field must be updated");
		let l = {
			DBInstanceIdentifier: e,
			...r !== void 0 && { MasterUserPassword: r },
			...i !== void 0 && { EnableIAMDatabaseAuthentication: i },
			...a !== void 0 && { DBSubnetGroupName: a },
			...o !== void 0 && { VpcSecurityGroupIds: o },
			...s !== void 0 && { OptionGroupName: s },
			...c !== void 0 && { AutoMinorVersionUpgrade: c }
		}, u = await this.rdsService_.modifyInstance(l);
		return this.toResource(u);
	}
	async delete(e) {
		await this.rdsService_.deleteInstance(e);
	}
	async listDatabaseSnapshots(e) {
		let t = $(e) || void 0;
		return (await this.rdsService_.listSnapshots(t)).map(NO);
	}
	async createDatabaseSnapshot(e) {
		let t = DO(e.instanceIdentifier), n = OO(e.snapshotIdentifier);
		return NO(await this.rdsService_.createSnapshot(t, n));
	}
	async listDatabaseOrderableInstanceClasses(e) {
		let t = $(e) || "postgres";
		return await this.rdsService_.listOrderableInstanceClasses(t);
	}
	async toResource(e) {
		let t = e.arn ? await this.getTags(e.arn) : [], n = (e.vpcSecurityGroups ?? []).map((e) => e.id).filter((e) => !!e).join(", ");
		return {
			id: e.identifier,
			name: e.identifier,
			cloud: "aws",
			service: "database",
			type: "db-instance",
			region: e.availabilityZone ?? null,
			createdAt: e.createdAt ?? null,
			status: e.status ?? null,
			version: e.engineVersion ?? null,
			engine: e.engine ?? null,
			instanceClass: e.instanceClass ?? null,
			metadata: {
				arn: e.arn,
				resourceId: e.resourceId,
				dbName: e.dbName,
				masterUsername: e.masterUsername,
				allocatedStorage: e.allocatedStorage,
				storageType: e.storageType,
				endpoint: e.endpoint,
				multiAz: e.multiAz,
				publiclyAccessible: e.publiclyAccessible,
				iamDatabaseAuthenticationEnabled: e.iamDatabaseAuthenticationEnabled,
				preferredBackupWindow: e.preferredBackupWindow,
				preferredMaintenanceWindow: e.preferredMaintenanceWindow,
				vpcSecurityGroups: e.vpcSecurityGroups,
				vpcSecurityGroupIds: n,
				subnetGroup: e.subnetGroup,
				optionGroupName: e.optionGroupName,
				autoMinorVersionUpgrade: e.autoMinorVersionUpgrade,
				tags: t
			}
		};
	}
	async getTags(e) {
		try {
			return ((await this.rds.send(new zT({ ResourceName: e }))).TagList ?? []).map((e) => ({
				key: e.Key ?? "",
				value: e.Value ?? ""
			}));
		} catch (e) {
			if (e instanceof Error && e.message.includes("ListTagsForResource is not supported")) return [];
			throw e;
		}
	}
}, TO = /^(?!.*--)[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/, EO = /^(?!.*--)[A-Za-z](?:[A-Za-z0-9-]{0,253}[A-Za-z0-9])?$/;
function DO(e) {
	let t = $(e);
	if (!TO.test(t)) throw new G("dbInstanceIdentifier must be 1-63 lowercase letters, numbers, or hyphens, begin with a letter, and not end with or repeat a hyphen");
	return t;
}
function OO(e) {
	let t = $(e);
	if (!EO.test(t)) throw new G("snapshotIdentifier must be 1-255 letters, numbers, or hyphens, begin with a letter, and not end with or repeat a hyphen");
	return t;
}
function kO(e) {
	let t = $(e);
	if (t === "postgres" || t === "mysql" || t === "mariadb") return t;
	throw new G("engine must be postgres, mysql, or mariadb");
}
function AO(e) {
	if (typeof e != "string" || e.length < 8 || e.length > 128) throw new G("masterUserPassword must be 8-128 characters");
	return e;
}
function jO(e) {
	if (e === void 0 || typeof e == "string" && !e.trim()) return 20;
	let t = typeof e == "string" ? e.trim() : e;
	if (!(typeof t == "number" || typeof t == "string" && /^[1-9][0-9]*$/.test(t))) throw new G("allocatedStorage must be a positive integer");
	let n = Number(t);
	if (!Number.isSafeInteger(n) || n <= 0) throw new G("allocatedStorage must be a positive integer");
	return n;
}
function $(e) {
	return typeof e == "string" ? e.trim() : "";
}
function MO(e) {
	if (Array.isArray(e)) {
		let t = e.map($).filter(Boolean);
		return t.length > 0 ? t : void 0;
	}
	if (typeof e == "string") {
		let t = e.split(",").map((e) => e.trim()).filter(Boolean);
		return t.length > 0 ? t : void 0;
	}
}
function NO(e) {
	return {
		id: e.identifier,
		name: e.identifier,
		instanceIdentifier: e.instanceIdentifier ?? null,
		status: e.status ?? null,
		engine: e.engine ?? null,
		version: e.engineVersion ?? null,
		createdAt: e.createdAt ?? null,
		metadata: {
			arn: e.arn,
			allocatedStorage: e.allocatedStorage,
			snapshotType: e.snapshotType,
			port: e.port,
			availabilityZone: e.availabilityZone,
			vpcId: e.vpcId
		}
	};
}
function PO(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n)) : e;
}
function FO(e, t) {
	return typeof e != "object" || !e ? !1 : e.$metadata?.httpStatusCode === t;
}
function IO(e) {
	if (e == null) return;
	let t = String(e);
	if (t !== "") {
		if (t.length < 8 || t.length > 128) throw new G("masterUserPassword must be between 8 and 128 characters");
		return t;
	}
}
function LO(e, t) {
	if (e != null) {
		if (typeof e == "boolean") return e;
		if (typeof e == "string") {
			let t = e.trim();
			if (t === "") return;
			if (t === "true") return !0;
			if (t === "false") return !1;
		}
		throw new G(`${t} must be a boolean (true or false)`);
	}
}
function RO(e) {
	if (e == null) return;
	let t = String(e).trim();
	return t === "" ? void 0 : t;
}
function zO(e) {
	if (e == null) return;
	if (Array.isArray(e)) {
		let t = e.map((e) => String(e).trim()).filter(Boolean);
		return t.length > 0 ? t : void 0;
	}
	let t = String(e).trim();
	if (!t) return;
	let n = t.split(",").map((e) => e.trim()).filter(Boolean);
	return n.length > 0 ? n : void 0;
}
// browser-bundle/rds-entry.ts
var BO = {
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test"
	},
	endpoint: "https://emulator.local.invalid"
}, VO = UD(new pO(new cO([new wO(SO(new kT(BO)), new kT(BO))]), {
	aws: async () => {},
	azure: async () => {},
	gcp: async () => {},
	oci: async () => {}
}, "aws", "us-east-1"));
async function HO(e) {
	return VO.fetch(e);
}
export { HO as handleRdsRequest };
