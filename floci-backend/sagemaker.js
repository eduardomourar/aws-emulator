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
})), A, bn = t((() => {
	ht(), A = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? mt(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function xn(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Sn = t((() => {})), Cn, wn = t((() => {
	Cn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), Tn, En = t((() => {
	Tn = async (e) => void 0;
})), Dn, On, kn, An, jn, Mn, Nn = t((() => {
	Dn = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), Mn(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!jn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, On = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, kn = /(\d+\.){3}\d+/, An = /\.\./, jn = (e) => On.test(e) && !kn.test(e) && !An.test(e), Mn = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Pn = t((() => {
	Nn();
})), Fn, In = t((() => {
	Fn = (e, t, n, r = !1) => {
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
})), Ln = t((() => {
	S();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function Rn(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(ge(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await zn(t, n, r);
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
var zn, Bn = t((() => {
	Pn(), In(), Ln(), zn = async (e, t, n) => {
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
				r[t] = await Fn(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Dn(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function Vn(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function Hn(e) {
	let t = Rn(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && Vn(i, "ENDPOINT_OVERRIDE", "N");
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
var Un = t((() => {
	S(), Bn();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function Wn(e) {
	let t = Hn(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), Kn);
	} });
}
var Gn, Kn, qn = t((() => {
	Un(), Gn = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, Kn = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: Gn.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function Jn(e) {
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
var Yn = t((() => {
	S(), Ln();
})), Xn, Zn = t((() => {
	Xn = class e {
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
})), Qn, $n = t((() => {
	Qn = class {
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
})), j, er = t((() => {
	j = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), M = t((() => {
	er();
})), tr, nr = t((() => {
	tr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function rr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${rr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(rr).join(", ")})` : JSON.stringify(e, null, 2);
}
var ir = t((() => {})), ar = t((() => {
	nr(), ir();
})), or, sr = t((() => {
	or = {};
})), cr, lr = t((() => {
	cr = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function ur(...e) {
	for (let t of e) if (t != null) return t;
}
var dr = t((() => {})), fr, pr = t((() => {
	M(), fr = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new j(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new j(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), mr, hr = t((() => {
	M(), pr(), mr = (e, t) => fr(t).reduce((n, r) => {
		if (typeof n != "object") throw new j(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), gr, _r = t((() => {
	gr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function vr(e, t, n) {
	return e ? t : n;
}
var yr = t((() => {})), br, xr = t((() => {
	br = (e) => !e;
})), Sr, Cr, wr = t((() => {
	Sr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), Cr = (e) => Sr.test(e) || e.startsWith("[") && e.endsWith("]");
})), Tr, Er, Dr = t((() => {
	_(), wr(), Tr = {
		[u.HTTP]: 80,
		[u.HTTPS]: 443
	}, Er = (e) => {
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
		let l = Cr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Tr[c]}`) || typeof e == "string" && e.includes(`${r}:${Tr[c]}`) ? `:${Tr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Or(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var kr = t((() => {})), Ar, jr = t((() => {
	Ar = (e, t) => e === t;
})), Mr, Nr = t((() => {
	Mr = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Pr, Fr = t((() => {
	Pr = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Ir = t((() => {
	lr(), dr(), hr(), _r(), S(), yr(), xr(), Dr(), kr(), jr(), Nr(), Fr();
})), Lr, Rr = t((() => {
	Ir(), Lr = {
		booleanEquals: cr,
		coalesce: ur,
		getAttr: mr,
		isSet: gr,
		isValidHostLabel: se,
		ite: vr,
		not: br,
		parseURL: Er,
		split: Or,
		stringEquals: Ar,
		substring: Mr,
		uriEncode: Pr
	};
})), zr, Br = t((() => {
	Ir(), zr = (e, t) => {
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
				n.push(mr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), Vr, Hr = t((() => {
	Vr = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), Ur, Wr, Gr, Kr = t((() => {
	M(), sr(), Rr(), Br(), Hr(), Ur = (e, t, n) => {
		if (typeof e == "string") return zr(e, n);
		if (e.fn) return Gr.callFunction(e, n);
		if (e.ref) return Vr(e, n);
		throw new j(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, Wr = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = Gr.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = or[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = Lr[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, Gr = {
		evaluateExpression: Ur,
		callFunction: Wr
	};
})), qr = t((() => {
	Kr();
})), Jr, Yr = t((() => {
	ar(), M(), qr(), Jr = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new j(`'${n}' is already defined in Reference Record.`);
		let r = Wr(e, t);
		t.logger?.debug?.(`${tr} evaluateCondition: ${rr(e)} = ${rr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), Xr, Zr = t((() => {
	M(), Kr(), Xr = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = Ur(e, "Header value entry", t);
		if (typeof r != "string") throw new j(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), Qr, $r, ei, ti = t((() => {
	M(), Br(), Qr = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = ei.getEndpointProperty(r, t), e), {}), $r = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => $r(e, t));
		switch (typeof e) {
			case "string": return zr(e, t);
			case "object":
				if (e === null) throw new j(`Unexpected endpoint property: ${e}`);
				return ei.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new j(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, ei = {
		getEndpointProperty: $r,
		getEndpointProperties: Qr
	};
})), ni, ri = t((() => {
	M(), Kr(), ni = (e, t) => {
		let n = Ur(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new j(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), ii, ai, oi = t((() => {
	M(), Yr(), Kr(), Zr(), ti(), ri(), ii = 1e8, ai = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < ii;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = Jr({
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
		if (o >= ii) {
			let e = i[o - ii];
			if (e[0] === -1) {
				let [, t] = e;
				throw new j(Ur(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: ni(t, c),
				properties: Qr(n, c),
				headers: Xr(r ?? {}, c)
			};
		}
		throw new j("No matching endpoint.");
	};
})), si, ci, li = t((() => {
	En(), Bn(), Un(), qn(), Yn(), S(), Zn(), $n(), oi(), wr(), sr(), ar(), M(), Yr(), Zr(), ti(), ri(), Kr(), Ln(), si = Jn(Tn), Hn(Tn), ci = Wn(Tn);
})), ui, di = t((() => {
	ui = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function fi(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function pi(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return xn(t, r);
}
var mi, hi = t((() => {
	Sn(), di(), mi = async (e) => ui(e) ? fi(e) : pi(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function gi(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var _i = t((() => {})), vi, yi, bi, xi, N = t((() => {
	pt(), _t(), yt(), ht(), xt(), Ct(), ln(), un(), Bt(), fn(), gn(), yn(), bn(), Sn(), wn(), S(), li(), di(), hi(), _i(), vi = class extends vt(bt, mt, gt, ft) {}, yi = (e) => crypto.getRandomValues(e), bi = St(yi), xi = bi;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
N();
var Si = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return vi.mutate(e);
	if (!e) return vi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return vi.mutate(await n);
}, Ci = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, wi, Ti, Ei, Di = t((() => {
	wi = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		wi[e] = t >>> 0;
	}
	Ti = 4294967295, Ei = class {
		digestLength = 4;
		checksum = Ti;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ wi[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Ti) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Ti;
		}
	};
})), P, Oi, ki, Ai, ji, Mi, Ni = t((() => {
	N(), P = 64, Oi = 32, ki = 2 ** 53 - 1, Ai = class e {
		digestLength = Oi;
		state = Int32Array.from(ji);
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
				for (let e = 0; e < P; ++e) a[e] = 54 ^ n[e], a[e + P] = 92 ^ n[e];
				r.update(a.subarray(0, P)), i.update(a.subarray(P));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = A(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > ki) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === P && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(ji), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % P >= 56) {
				for (let e = n; e < P; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(Oi);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = A(t);
			if (n.byteLength > P) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(P);
				return i.set(r), i;
			}
			if (n.byteLength < P) {
				let e = new Uint8Array(P);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < P; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Mi[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, ji = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Mi = new Int32Array([
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
})), Pi, Fi, Ii, Li, Ri, zi, Bi = t((() => {
	N(), Ni(), {digest: Pi, sign: Fi, importKey: Ii} = globalThis?.crypto?.subtle ?? {}, Li = typeof Pi == "function" && typeof Fi == "function" && typeof Ii == "function" ? globalThis.crypto.subtle : void 0, Ri = 8388608, zi = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = A(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= Ri && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = xn(this.pending);
			if (Li) {
				if (this.secret) {
					this.finished = !0;
					let t = await Li.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await Li.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await Li.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Ai(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Ai(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), Vi = t((() => {
	N(), Di(), Ni(), Bi();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function Hi(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var Ui, Wi = t((() => {
	N(), Ui = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && Hi(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && Hi(e), parseInt(k(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), Gi, Ki, qi, Ji, Yi, Xi, Zi, Qi, $i, ea, ta, na, ra, ia = t((() => {
	S(), N(), Wi(), Gi = class {
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
					if (e.value.byteLength > ra) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ra} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ra) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ra} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(Ui.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!na.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
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
							type: qi,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: qi,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: Ji,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: Yi,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: Xi,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: Zi,
							value: new Ui(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: Qi,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: $i,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: ea,
							value: new Date(new Ui(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: ta,
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
	})(Ki ||= {}), qi = "boolean", Ji = "byte", Yi = "short", Xi = "integer", Zi = "long", Qi = "binary", $i = "string", ea = "timestamp", ta = "uuid", na = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ra = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function aa({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < la) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(oa, !1), o = r.getUint32(sa, !1), s = r.getUint32(e - ca, !1), c = new Ei();
	if (c.update(new Uint8Array(n, t, sa)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + sa, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + sa + ca, a),
		body: new Uint8Array(n, t + sa + ca + a, i - a - 16)
	};
}
var oa, sa, ca, la, ua = t((() => {
	Vi(), oa = 4, sa = 8, ca = 4, la = 16;
})), da, fa = t((() => {
	Vi(), ia(), ua(), da = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new Gi(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Ei();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = aa(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), pa, ma = t((() => {
	pa = class {
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
			for await (let e of this.options.messageStream) yield this.options.encoder.encode(e);
			this.options.includeEndFrame && (yield /* @__PURE__ */ new Uint8Array());
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
			for await (let e of this.options.messageStream) {
				let t = await this.options.deserializer(e);
				t !== void 0 && (yield t);
			}
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
			for await (let e of this.options.inputStream) yield this.options.serializer(e);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getChunkedStream.js
function xa(e) {
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
var Sa = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ca(e, t) {
	let n = wa(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function wa(e, t) {
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
var Ta = t((() => {})), Ea, Da, Oa = t((() => {
	fa(), ma(), ga(), va(), ba(), Sa(), Ta(), Ea = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new da(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = xa(e);
			return new _a({
				messageStream: new pa({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: wa(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new ha({
				messageStream: new ya({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Da = (e) => new Ea(e);
})), ka, Aa, ja = t((() => {
	ka = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), Aa = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Ma, Na, Pa, Fa = t((() => {
	Oa(), ja(), Ma = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Ea({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Na(e) ? ka(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Aa(n) : n;
		}
	}, Na = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Pa = (e) => new Ma(e);
})), Ia, La = t((() => {
	Ia = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), Ra, za = t((() => {
	S(), w(), N(), Ra = class {
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
})), Ba = /* @__PURE__ */ n({
	EventStreamCodec: () => da,
	EventStreamMarshaller: () => Ma,
	EventStreamSerde: () => Ra,
	HeaderMarshaller: () => Gi,
	Int64: () => Ui,
	MessageDecoderStream: () => pa,
	MessageEncoderStream: () => ha,
	SmithyMessageDecoderStream: () => _a,
	SmithyMessageEncoderStream: () => ya,
	UniversalEventStreamMarshaller: () => Ea,
	eventStreamSerdeProvider: () => Pa,
	getChunkedStream: () => xa,
	getMessageUnmarshaller: () => wa,
	getUnmarshalledStream: () => Ca,
	iterableToReadableStream: () => Aa,
	readableStreamToIterable: () => ka,
	resolveEventStreamSerdeConfig: () => Ia,
	universalEventStreamSerdeProvider: () => Da
}), Va = t((() => {
	fa(), ia(), Wi(), ma(), ga(), va(), ba(), Fa(), ja(), Oa(), Sa(), Ta(), La(), za();
}));
S(), w();
var Ha = class extends Ci {
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (Va(), Ba));
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
var Ua = class extends Ha {
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
			let i = await Si(n.body, t);
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
			let e = await Si(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function Wa(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/protocol-http/extensions/httpExtensionConfiguration.js
var Ga = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), Ka = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
S();
var qa = "content-length";
function Ja(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (b.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(qa) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[qa]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var Ya = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, Xa = (e) => ({ applyToStack: (t) => {
	t.add(Ja(e.bodyLengthChecker), Ya);
} }), Za = (e) => encodeURIComponent(e).replace(/[!'()*]/g, Qa), Qa = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function $a(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = Za(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${Za(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${Za(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var eo = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, to = class {
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
}, no;
function ro() {
	if (no === void 0) try {
		if (typeof Buffer != "function") no = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			no = typeof e == "object" && !!e;
		}
	} catch {
		no = !1;
	}
	return no;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
N();
function io(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? oo(e, t) ? t : new O(e, "bigDecimal") : ao(e) ? new O(e, "bigDecimal") : /[eE]/.test(e) ? co(e) : BigInt(e);
	}
	return t;
}
function ao(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function oo(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return so(e) === so(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === so(r) : !1;
}
function so(e) {
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
function co(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
w();
var lo = Symbol.for("@aws-sdk/reviver");
function uo(e) {
	let t = C.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (lo in n) return n[lo];
		let e = fo(t, /* @__PURE__ */ new Set());
		return n[lo] = e, e;
	}
	return fo(t, /* @__PURE__ */ new Set());
}
function fo(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (fo(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (fo(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
N();
var po = (e, t) => Si(e, t).then((e) => (t?.utf8Encoder ?? bt)(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function mo(e, t, n) {
	let r;
	if (ro() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await Si(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await po(e, t), r.length === 0) return {};
	let i = n && uo(n) ? io : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var ho = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), go = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, _o = (e, t, n = !1) => vo(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), vo = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = ho(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return go(e[n]);
			break;
		case "code":
			let r = ho(t ?? {}, "code");
			if (r && t[r] !== void 0) return go(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return go(t.__type);
	}
};
w(), N(), S();
var yo = class extends eo {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = uo(e) ? io : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && ro()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await mo(t, this.serdeContext, e);
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
				if (this.needsTransform(e)) for (let t in n) y(n, t) && (t === "__proto__" && gi(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return ft(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? D.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (Wa(r, this.settings)) {
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
					t === "__proto__" && gi(e);
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
		n && (s = new to(t, r));
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
N();
var bo = class e extends Uint8Array {
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
			e > xo + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), xo = e), this.string = bt(this);
		}
		return this.string;
	}
}, xo = 0;
w(), N(), S();
var So = new TextEncoder(), Co = 123, wo = 125, To = 91, Eo = 93, Do = 34, Oo = 58, ko = 44, Ao = 92, jo = new Uint8Array([
	116,
	114,
	117,
	101
]), Mo = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), No = new Uint8Array([
	110,
	117,
	108,
	108
]), F = Array(128).fill(null);
F[8] = "b", F[9] = "t", F[10] = "n", F[12] = "f", F[13] = "r", F[34] = "\"", F[92] = "\\";
for (let e = 0; e < 32; e++) F[e] === null && (F[e] = "u00" + e.toString(16).padStart(2, "0"));
var Po = 2048;
function Fo(e) {
	return bo.allocUnsafe(e);
}
var Io = class e extends eo {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = Fo(Po);
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
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), So.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = Fo(Po), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = Fo(r);
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
		n[r++] = Do;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = Do, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = Do;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = F[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = Ao;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = So.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = Do;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = Ao, t[n++] = 117;
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
		r[a++] = Do;
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
		r[a++] = Do, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && C.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(xi());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(No, this.i), this.i += 4;
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
			t ? (n.set(jo, e), e += 4) : (n.set(Mo, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = Co;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = ko), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Oo, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Oo, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = ko), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Oo, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = wo;
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
			this.ensure(n.length * 3), this.i += So.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = To;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = ko), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = Eo;
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
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += So.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Co;
		let a = !0;
		for (let e in t) {
			if (!y(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = ko), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Oo, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = wo;
	}
	writeTimestamp(e, t) {
		switch (Wa(e, this.settings)) {
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
}, Lo = class extends eo {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new Io(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new yo(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
}, Ro = [
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
], zo = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], Bo = [
	500,
	502,
	503,
	504
], Vo = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], Ho = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], Uo = (e) => e?.$retryable !== void 0, Wo = (e) => e.$metadata?.clockSkewCorrected, Go = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, Ko = (e) => e.$metadata?.httpStatusCode === 429 || Ro.includes(e.name) || e.$retryable?.throttling == 1, qo = (e, t = 0) => e?.name !== "AbortError" && (Uo(e) || Wo(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || zo.includes(e.name) || Vo.includes(e?.code || "") || Ho.includes(e?.code || "") || Bo.includes(e.$metadata?.httpStatusCode || 0) || Go(e) || Yo(e) || e.cause !== void 0 && t <= 10 && qo(e.cause, t + 1)), Jo = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !qo(e);
	}
	return !1;
};
function Yo(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var Xo = 2e4, Zo = "amz-sdk-invocation-id", Qo = "amz-sdk-request";
S(), ae(), N();
function $o(e, t) {
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
var es = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
re(), N();
function ts(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (rs(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = b.isInstance(d);
			for (f && (d.headers[Zo] = bi());;) try {
				f && (d.headers[Qo] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = is(n, t.logger);
				if (c = es(n), f && e(d)) throw (r.logger instanceof ot ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await ns(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var ns = (e) => new Promise((t) => setTimeout(t, e)), rs = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, is = (e, t) => {
	let n = {
		error: e,
		errorType: as(e)
	}, r = $o(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, as = (e) => Ko(e) ? "THROTTLING" : qo(e) ? "TRANSIENT" : Jo(e) ? "SERVER_ERROR" : "CLIENT_ERROR", os = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function ss(e) {
	let t = ts(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), os);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var cs = class e {
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
		if (n?.errorType === "THROTTLING" || Ko(n?.error ?? e)) {
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
}, I = class e {
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
}, ls = class {
	x = I.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, Xo);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, us = class {
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
		return Math.min(Xo, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, ds;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(ds ||= {});
var fs = ds.STANDARD, ps = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, ms = class {
	mode = ds.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= I.delay(), this.retryBackoffStrategy ??= new ls();
	}
	async acquireInitialRetryToken(e) {
		return new us(I.delay(), 0, void 0, I.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? I.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new us(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = I.v2026 && r === ps.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : ps.incompatible, a = r < n ? 0 : ps.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : ps.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === I.modifiedCostType() ? I.throttlingCost() : I.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, hs = class {
	mode = ds.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new cs(), this.standardRetryStrategy = t ? new ms({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new ms(e);
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
var gs = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = I.delay() } = t ?? {}, o = x(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await x(r)() === ds.ADAPTIVE ? new hs(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new ms({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, _s = ss(i);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
I.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function L(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
re();
function vs(e) {
	return e;
}
var ys = (e) => (t) => async (n) => {
	if (!b.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, bs = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, xs = (e) => ({ applyToStack: (t) => {
	t.add(ys(e), bs);
} }), Ss = () => (e, t) => async (n) => {
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
}, Cs = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, ws = (e) => ({ applyToStack: (e) => {
	e.add(Ss(), Cs);
} }), Ts = (e) => ({ applyToStack: (e) => {} }), Es = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
S();
function Ds(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var Os = (e, t) => (n, r) => async (i) => {
	let a = Es(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = Ds(e.httpAuthSchemes), s = v(r), c = [];
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
}, ks = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, As = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(Os(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), ks);
} });
re(), S();
var js = (e) => (e) => {
	throw e;
}, Ms = (e, t) => {}, Ns = (e) => (e, t) => async (n) => {
	if (!b.isInstance(n.request)) return e(n);
	let r = v(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || js)(i));
	return (o.successHandler || Ms)(s.response, i), s;
}, Ps = {
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
}, Fs = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Ns(e), Ps);
} }), Is = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
S();
var Ls = class {
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
}, Rs = ((e) => function(t) {
	return zs(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), zs = (e) => e.expiration !== void 0, Bs = (e, t, n) => {
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
function Vs(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Hs(e) {
	let t = Is(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!Vs(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var Us = {
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
}, Ws = "", Gs = (e) => {
	let { partitions: t } = Us;
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
}, Ks = () => Ws, qs = /\d{12}\.ddb/;
async function Js(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && L(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case ds.ADAPTIVE:
				L(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case ds.STANDARD: L(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(qs) && L(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				L(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				L(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": L(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && L(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) L(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Ys = "user-agent", Xs = "x-amz-user-agent", Zs = /[^!$%&'*+\-.^_`|~\w]/g, Qs = /[^!$%&'*+\-.^_`|~\w#]/g, $s = 1024;
function ec(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= $s) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
re();
var tc = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!b.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(nc) || [], s = (await e.defaultUserAgentProvider()).map(nc);
	await Js(n, e, r);
	let c = n;
	s.push(`m/${ec(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(nc) || [], u = await e.userAgentAppId();
	u && s.push(nc(["app", `${u}`]));
	let d = Ks(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Xs] = f : (p && (a[Xs] = a["x-amz-user-agent"] ? `${a[Ys]} ${p}` : p), a[Ys] = f), t({
		...r,
		request: i
	});
}, nc = (e) => {
	let t = e[0].split("/").map((e) => e.replace(Zs, "-")).join("/"), n = e[1]?.replace(Qs, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, rc = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, ic = (e) => ({ applyToStack: (t) => {
	t.add(tc(e), rc);
} }), ac = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? oc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? oc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, oc = {
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
li(), wr();
var sc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!sc(t)) return !1;
		return !0;
	}
	return !(!se(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || Cr(e));
}, cc = ":", lc = "/", uc = (e) => {
	let t = e.split(cc);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(cc) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(lc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
li();
var dc = {
	isVirtualHostableS3Bucket: sc,
	parseArn: uc,
	partition: Gs
};
or.aws = dc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var fc = (e, t, n) => {
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
var pc = /* @__PURE__ */ new Set(), mc = (e, t = se) => {
	if (!pc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else pc.add(e);
}, hc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), gc = (e) => hc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, _c = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = gc(typeof t == "function" ? await t() : t);
			return mc(e), e;
		},
		useFipsEndpoint: async () => hc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, vc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], yc = ({ defaultsMode: e } = {}) => fc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(bc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${vc.join(", ")}, got ${t}`);
	}
}), bc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, xc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), Sc = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ae();
var Cc = (e) => ie.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, wc = (e) => ie.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, Tc = (e) => new Date(Date.now() + e), Ec = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
re(), _();
var Dc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Oc = (e) => e.context?.[h]?.eventStream?.output === !0, kc = async (e) => {
	let t = Dc("context", e.context), n = Dc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await Dc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, Ac = class {
	async sign(e, t, n) {
		if (!b.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await kc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Oc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Tc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? Cc(n.$response);
				if (t) {
					let r = Dc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = wc(n.$response), s = Ec(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = Cc(e);
		if (n) {
			let r = Dc("config", t.config), i = t._requestSentAt, a = wc(e);
			r.systemClockOffset = Ec(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
N();
var jc = class {
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
				return l[0] = 8, l.set(Pc.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!Nc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(pn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, Mc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(Mc ||= {});
var Nc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Pc = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && Fc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && Fc(e), parseInt(k(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function Fc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var Ic = "X-Amz-Algorithm", Lc = "X-Amz-Credential", Rc = "X-Amz-Date", zc = "X-Amz-SignedHeaders", Bc = "X-Amz-Expires", Vc = "X-Amz-Signature", Hc = "X-Amz-Security-Token", Uc = "authorization", Wc = Rc.toLowerCase(), Gc = [
	Uc,
	Wc,
	"date"
];
Vc.toLowerCase();
var Kc = "x-amz-content-sha256", qc = Hc.toLowerCase(), Jc = {
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
}, Yc = /^proxy-/, Xc = /^sec-/, Zc = "AWS4-HMAC-SHA256", Qc = "AWS4-HMAC-SHA256-PAYLOAD", $c = "UNSIGNED-PAYLOAD", el = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
N();
var tl = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!y(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = Za(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${Za(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${Za(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, nl = (e) => rl(e).toISOString().replace(/\.\d{3}Z$/, "Z"), rl = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
de(), N();
var il = class {
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
${tl(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(A(n)), `${r}
${e}
${t}
${k(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return Za(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = nl(e).replace(/[-:]/g, "");
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
N();
var al = {}, ol = [], sl = (e, t, n) => `${e}/${t}/${n}/${el}`, cl = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${k(await ll(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in al) return al[a];
	for (ol.push(a); ol.length > 50;) delete al[ol.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		el
	]) o = await ll(e, o, t);
	return al[a] = o;
}, ll = (e, t, n) => {
	let r = new e(t);
	return r.update(A(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
N();
var ul = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(y(Jc, a) || t?.has(a) || Yc.test(a) || Xc.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && gi(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
N();
var dl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (y(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Cn(t)) {
		let e = new n();
		return e.update(A(t)), k(await e.digest());
	}
	return $c;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
N();
var fl = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (y(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
N(), re();
var pl = (e, t = {}) => {
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
N(), re();
var ml = (e) => {
	e = b.clone(e);
	for (let t in e.headers) y(e.headers, t) && Gc.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
N();
var hl = class extends il {
	headerFormatter = new jc();
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
		let m = sl(p, d, l ?? this.service), h = pl(ml(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[Hc] = u.sessionToken), h.query[Ic] = Zc, h.query[Lc] = `${u.accessKeyId}/${m}`, h.query[Rc] = f, h.query[Bc] = r.toString(10);
		let g = ul(h, i, o);
		return h.query[zc] = this.getCanonicalHeaderList(g), h.query[Vc] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await dl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = sl(c, s, a ?? this.service), d = await dl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Qc,
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
		return c.update(A(e)), k(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = ml(e), { longDate: l, shortDate: u } = this.formatDate(t), d = sl(u, s, a ?? this.service);
		c.headers[Wc] = l, o.sessionToken && (c.headers[qc] = o.sessionToken);
		let f = await dl(c, this.sha256);
		!fl("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[Kc] = f);
		let p = ul(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[Uc] = `${Zc} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, Zc), a = new this.sha256(await n);
		return a.update(A(i)), k(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return cl(this.sha256, e, n, t, r || this.service);
	}
}, gl = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = vl(t, _l(t, {
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
	return l = t.signer ? Is(t.signer) : t.regionInfoProvider ? () => Is(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || hl)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await Is(t.region)(),
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
		return new (t.signerConstructor || hl)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: Is(t.disableClockSkewCorrection ?? e)
	});
};
function _l(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Bs(t, Rs, zs) : n ? Is(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function vl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var yl = gl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/auth/httpAuthSchemeProvider.js
ee(), de();
var bl = async (e, t, n) => ({
	operation: v(t).operation,
	region: await x(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function xl(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "sagemaker",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var Sl = (e) => {
	let t = [];
	return e.operation, t.push(xl(e)), t;
}, Cl = (e) => {
	let t = yl(e);
	return Object.assign(t, { authSchemePreference: x(e.authSchemePreference ?? []) });
}, wl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "sagemaker"
}), Tl = {
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
}, El = {
	name: "@aws-sdk/client-sagemaker",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Sagemaker Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sagemaker",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-sagemaker"
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
function Dl(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function Ol(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ae();
var kl = { supported: void 0 }, Al = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), kl.supported === void 0 && (kl.supported = typeof Request < "u" && "keepalive" in Dl("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = jl(t);
			return Promise.reject(e);
		}
		let s = e.path, c = $a(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), kl.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(Dl(f, m)).then((e) => {
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
		}), Ol(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(jl(t));
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
function jl(e) {
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
var Ml = class {
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
var Nl = class extends Ua {
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
		}), this.serviceTarget = n, this.codec = i ?? new Lo({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new Ml(this.awsQueryCompatible);
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
		let o = _o(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = C.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, Pl = class extends Nl {
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
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/endpoint/bdd.js
li();
var Fl = "ref", Il = -1, Ll = !0, Rl = "isSet", zl = "PartitionResult", Bl = "booleanEquals", Vl = "getAttr", Hl = "stringEquals", Ul = { [Fl]: "Endpoint" }, Wl = { [Fl]: zl }, Gl = {
	fn: Vl,
	argv: [Wl, "name"]
}, Kl = {}, ql = [{ [Fl]: "Region" }], Jl = {
	conditions: [
		[Rl, [Ul]],
		[Rl, ql],
		[
			"aws.partition",
			ql,
			zl
		],
		[Bl, [{ [Fl]: "UseFIPS" }, Ll]],
		[Bl, [{ [Fl]: "UseDualStack" }, Ll]],
		[Bl, [{
			fn: Vl,
			argv: [Wl, "supportsDualStack"]
		}, Ll]],
		[Bl, [{
			fn: Vl,
			argv: [Wl, "supportsFIPS"]
		}, Ll]],
		[Hl, [Gl, "aws"]],
		[Hl, [Gl, "aws-us-gov"]]
	],
	results: [
		[Il],
		[Il, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Il, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[Ul, Kl],
		["https://api.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Kl],
		[Il, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://api-fips.sagemaker.{Region}.amazonaws.com", Kl],
		["https://api.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}", Kl],
		[Il, "FIPS is enabled but this partition does not support FIPS"],
		["https://api.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}", Kl],
		[Il, "DualStack is enabled but this partition does not support DualStack"],
		["https://api.sagemaker.{Region}.{PartitionResult#dnsSuffix}", Kl],
		[Il, "Invalid Configuration: Missing Region"]
	]
}, Yl = 2, Xl = new Int32Array([
	-1,
	1,
	-1,
	0,
	14,
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
	12,
	9,
	6,
	10,
	100000008,
	7,
	100000006,
	11,
	8,
	100000006,
	100000007,
	5,
	13,
	100000005,
	6,
	100000004,
	100000005,
	3,
	100000001,
	15,
	4,
	100000002,
	100000003
]), Zl = Xn.from(Xl, Yl, Jl.conditions, Jl.results);
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/endpoint/endpointResolver.js
li();
var Ql = new Qn({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), $l = (e, t = {}) => Ql.get(e, () => ai(Zl, {
	endpointParams: e,
	logger: t.logger
}));
or.aws = dc;
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/models/SageMakerServiceException.js
var eu = class e extends Xe {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.sagemaker#SageMakerServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, tu = class e extends eu {
	static shapeId = "com.amazonaws.sagemaker#ResourceLimitExceeded";
	name = "ResourceLimitExceeded";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, nu = class e extends eu {
	static shapeId = "com.amazonaws.sagemaker#ResourceNotFound";
	name = "ResourceNotFound";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ResourceNotFound",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ru = class e extends eu {
	static shapeId = "com.amazonaws.sagemaker#ConflictException";
	name = "ConflictException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, iu = class e extends eu {
	static shapeId = "com.amazonaws.sagemaker#ResourceInUse";
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
};
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/schemas/schemas_0.js
w();
var au = "Alarm", ou = "AcceptEula", su = "AsyncInferenceConfig", cu = "AsyncInferenceClientConfig", lu = "AvailableInstanceCount", uu = "AsyncInferenceNotificationConfig", du = "AsyncInferenceOutputConfig", fu = "AlarmList", pu = "AdditionalModelDataSource", mu = "AdditionalModelDataSources", hu = "AutoMLJobArn", gu = "AlarmName", _u = "AlgorithmName", vu = "AttributeNames", yu = "AutoRollbackConfig", bu = "AutoRollbackConfiguration", xu = "AlgorithmSpecification", Su = "AcceleratorType", Cu = "Alarms", wu = "BlueGreenUpdatePolicy", Tu = "BaseModelArn", Eu = "BillableTokenCount", Du = "BillableTimeInSeconds", Ou = "ContainerArguments", ku = "ClientConfig", Au = "CsvContentTypes", ju = "CaptureContentTypeHeader", Mu = "CheckpointConfig", Nu = "CollectionConfiguration", Pu = "CollectionConfigurations", Fu = "ContainerDefinition", Iu = "CoreDumpConfig", Lu = "ContainerDefinitionList", Ru = "ConflictException", zu = "ClarifyExplainerConfig", Bu = "CreateEndpointConfigInput", Vu = "CreateEndpointConfigOutput", Hu = "CreateEndpointConfig", Uu = "CreateEndpointInput", Wu = "CreateEndpointOutput", Gu = "ContainerEntrypoint", Ku = "CreateEndpoint", qu = "CurrentEpoch", Ju = "ContainerHostname", Yu = "ClarifyInferenceConfig", Xu = "CurrentInstanceCount", Zu = "CooldownInMinutes", Qu = "ContainerMetricsConfig", $u = "CreateModelInput", ed = "CreateModelOutput", td = "CaptureMode", nd = "CreateModel", rd = "ChannelName", id = "CollectionName", ad = "CaptureOption", od = "CaptureOptionList", sd = "CaptureOptions", cd = "CollectionParameters", ld = "CapacityReservationConfig", ud = "CapacityReservationPreference", dd = "ClarifyShapBaselineConfig", fd = "ClarifyShapConfig", pd = "CurrentServerlessConfig", md = "ContainerStartupHealthCheckTimeoutInSeconds", hd = "CurrentSamplingPercentage", gd = "CanarySize", _d = "CapacitySize", vd = "CaptureStatus", yd = "CurrentStep", bd = "CreationTime", xd = "CreationTimeAfter", Sd = "CreationTimeBefore", Cd = "ClarifyTextConfig", wd = "CreateTrainingJob", Td = "CreateTrainingJobRequest", Ed = "CreateTrainingJobResponse", Dd = "CompressionType", Od = "ContentType", kd = "ConcurrencyThreshold", Ad = "ContentTemplate", jd = "CustomizationTechnique", Md = "CurrentWeight", Nd = "Channel", Pd = "Containers", Fd = "DatasetArn", Id = "DataCaptureConfig", Ld = "DataCaptureConfigSummary", Rd = "DeploymentConfig", zd = "DeleteEndpoint", Bd = "DeleteEndpointConfig", Vd = "DeleteEndpointConfigInput", Hd = "DescribeEndpointConfigInput", Ud = "DescribeEndpointConfigOutput", Wd = "DescribeEndpointConfig", Gd = "DeleteEndpointInput", Kd = "DescribeEndpointInput", qd = "DescribeEndpointOutput", Jd = "DescribeEndpoint", Yd = "DebugHookConfig", Xd = "DesiredInstanceCount", Zd = "DeployedImage", Qd = "DeployedImages", $d = "DeleteModelInput", ef = "DescribeModelInput", tf = "DescribeModelOutput", nf = "DeleteModel", rf = "DescribeModel", af = "DirectoryPath", of = "DisableProfiler", sf = "DeploymentRecommendation", cf = "DebugRuleConfigurations", lf = "DebugRuleConfiguration", uf = "DebugRuleEvaluationStatus", df = "DebugRuleEvaluationStatuses", ff = "DataSource", pf = "DesiredServerlessConfig", mf = "DestinationS3Uri", hf = "DatasetSource", gf = "DescribeTrainingJobRequest", _f = "DescribeTrainingJobResponse", vf = "DescribeTrainingJob", yf = "DesiredWeight", bf = "Environment", xf = "EndpointArn", Sf = "EvaluatorArn", Cf = "EndpointConfigArn", wf = "EndpointConfigName", Tf = "Ec2CapacityReservation", Ef = "Ec2CapacityReservationId", Df = "Ec2CapacityReservationsList", Of = "Ec2CapacityReservations", kf = "EndpointConfigSummary", Af = "EndpointConfigSummaryList", jf = "EnableCapture", Mf = "EndpointConfigs", Nf = "ExplainerConfig", Pf = "ExperimentConfig", Ff = "EnableDetailedObservability", If = "EnableEnhancedMetrics", Lf = "EnableExplanations", Rf = "EnableInterContainerTrafficEncryption", zf = "EnableInfraCheck", Bf = "EnableMultipleJobs", Vf = "EnableManagedSpotTraining", Hf = "EndpointName", Uf = "EnableNetworkIsolation", Wf = "ExperimentName", Gf = "ExecutionRoleArn", Kf = "EnableRemoteDebug", qf = "EndpointStatus", Jf = "EndpointSummaryList", Yf = "EnableSageMakerMetricsTimeSeries", Xf = "EnableSSMAccess", Zf = "EnableSessionTagChaining", Qf = "EndpointSummary", $f = "ETag", ep = "EndTime", tp = "ErrorTopic", np = "EvaluationType", rp = "Endpoints", ip = "FeaturesAttribute", ap = "FeatureHeaders", op = "FinalMetricDataList", sp = "FailureReason", cp = "FileSystemAccessMode", lp = "FileSystemDataSource", up = "FileSystemId", dp = "FileSystemType", fp = "FeatureTypes", pp = "Granularity", mp = "HubAccessConfig", hp = "HubContentArn", gp = "HyperParameters", _p = "HookParameters", vp = "InferenceAmiVersion", yp = "InfraCheckConfig", bp = "ImageConfig", xp = "InstanceCount", Sp = "InferenceConfig", Cp = "InputDataConfig", wp = "InferenceExecutionConfig", Tp = "InstanceGroups", Ep = "InstanceGroupName", Dp = "InstanceGroupNames", Op = "InstanceGroup", kp = "InferenceHubAccessConfig", Ap = "InitialInstanceCount", jp = "IncludeInferenceResponseIn", Mp = "InputMode", Np = "InstancePool", Pp = "InstancePlacementConfig", Fp = "InstancePoolList", Ip = "InstancePreferenceList", Lp = "InstancePoolSummary", Rp = "InstancePoolSummaryList", zp = "InstancePreference", Bp = "InstancePools", Vp = "InstancePreferences", Hp = "InferenceSpecificationName", Up = "InitialSamplingPercentage", R = "InstanceType", Wp = "InitialVariantWeight", Gp = "Image", Kp = "JsonContentTypes", qp = "JobType", Jp = "Key", Yp = "KeepAlivePeriodInSeconds", Xp = "KmsKeyId", Zp = "Language", Qp = "LabelAttribute", $p = "LastDeploymentConfig", em = "ListEndpointConfigs", tm = "ListEndpointConfigsInput", nm = "ListEndpointConfigsOutput", rm = "ListEndpointsInput", im = "ListEndpointsOutput", am = "ListEndpoints", om = "LabelHeaders", sm = "LabelIndex", cm = "LabelingJobArn", lm = "ListModelsInput", um = "ListModelsOutput", dm = "LastModifiedTime", fm = "LastModifiedTimeAfter", pm = "LastModifiedTimeBefore", mm = "ListModels", hm = "LocalPath", gm = "LinearStepSize", _m = "ListTrainingJobs", vm = "ListTrainingJobsRequest", ym = "ListTrainingJobsResponse", bm = "Message", xm = "ModelArn", Sm = "ModelAccessConfig", Cm = "ModelArtifacts", wm = "MaximumBatchSize", Tm = "MlflowConfig", Em = "MaxConcurrentInvocationsPerInstance", Dm = "ModelCacheSetting", Om = "MaxConcurrency", km = "MetricsConfig", Am = "ModelDataDownloadTimeoutInSeconds", jm = "MetricDefinitionList", Mm = "ModelDataSource", Nm = "ModelDataUrl", Pm = "MetricDefinitions", Fm = "MetricData", Im = "MetricDefinition", Lm = "MlflowDetails", Rm = "MetricsEndpoints", zm = "MlflowExperimentId", Bm = "MetricsEndpointList", Vm = "MlflowExperimentName", Hm = "MetricsEndpointPath", Um = "MaximumExecutionTimeoutInSeconds", Wm = "ManifestEtag", Gm = "MaxEpoch", Km = "MetricsEndpoint", qm = "MinInstanceCount", Jm = "MaxInstanceCount", Ym = "ManagedInstanceScaling", Xm = "MultiModelConfig", Zm = "MetricName", Qm = "ModelNameOverride", $m = "ModelName", eh = "ModelPackageConfig", th = "MetricPublishFrequencyInSeconds", nh = "ModelPackageGroupArn", rh = "MaxPayloadInMB", ih = "ModelPackageName", ah = "MaxPendingTimeInSeconds", oh = "MaxResults", sh = "MaximumRetryAttempts", ch = "MlflowResourceArn", lh = "MlReservationArn", uh = "MaxRecordCount", dh = "MlflowRunId", fh = "MaxRuntimeInSeconds", ph = "MlflowRunName", mh = "MemorySizeInMB", hh = "ModelSummaryList", gh = "MaximumStepSize", _h = "ManifestS3Uri", vh = "ModelSummary", yh = "MimeType", bh = "MaxWaitTimeInSeconds", xh = "Mode", Sh = "Models", Ch = "Name", wh = "NotificationConfig", Th = "NameContains", Eh = "NumberOfSamples", Dh = "NextToken", Oh = "OutputConfig", kh = "OutputDataConfig", Ah = "OutputModelPackageArn", jh = "ProbabilityAttribute", Mh = "PrefixAwareRoutingConfig", Nh = "PrimaryContainer", Ph = "ProfilerConfig", Fh = "ProvisionedConcurrency", Ih = "PendingDeploymentSummary", Lh = "ProbabilityIndex", Rh = "ProfilingIntervalInMilliseconds", zh = "ProgressInfo", Bh = "PrefixLength", Vh = "PendingProductionVariantSummary", Hh = "PendingProductionVariantSummaryList", Uh = "ProfilingParameters", Wh = "ProfilerRuleConfigurations", Gh = "ProfilerRuleConfiguration", Kh = "ProfilerRuleEvaluationStatuses", qh = "ProfilerRuleEvaluationStatus", Jh = "PlacementSpecifications", Yh = "PlacementSpecification", Xh = "ProfilingStatus", Zh = "ProductionVariants", Qh = "ProductionVariantCoreDumpConfig", $h = "ProductionVariantCapacityReservationConfig", eg = "ProductionVariantCapacityReservationSummary", tg = "ProductionVariantList", ng = "ProductionVariantManagedInstanceScaling", rg = "ProductionVariantManagedInstanceScalingScaleInPolicy", ig = "ProductionVariantRoutingConfig", ag = "ProductionVariantServerlessConfig", og = "ProductionVariantStatusList", sg = "ProductionVariantSummaryList", cg = "ProductionVariantStatus", lg = "ProductionVariantSummary", ug = "ProductionVariant", dg = "Peft", fg = "Priority", pg = "RepositoryAuthConfig", mg = "RepositoryAccessMode", hg = "RoleArn", gg = "ReusedByJob", _g = "RuleConfigurationName", vg = "RepositoryCredentialsProviderArn", yg = "ResourceConfig", bg = "RoutingConfig", xg = "RemoteDebugConfig", Sg = "RuleEvaluatorImage", Cg = "RuleEvaluationJobArn", wg = "RuleEvaluationStatus", Tg = "ResolvedImage", Eg = "ResourceInUse", Dg = "RecommendationId", Og = "ResourceLimitExceeded", kg = "RollbackMaximumBatchSize", Ag = "ResourceNotFound", jg = "RunName", Mg = "RuleParameters", Ng = "ResourceRetainedBillableTimeInSeconds", Pg = "RetryStrategy", Fg = "RecommendationStatus", Ig = "RoutingStrategy", Lg = "RealTimeInferenceRecommendations", Rg = "RealTimeInferenceRecommendation", zg = "ResolutionTime", Bg = "RollingUpdatePolicy", Vg = "RecordWrapperType", Hg = "Regex", Ug = "ShapBaseline", Wg = "ShapBaselineConfig", Gg = "ShapBaselineUri", Kg = "SortBy", qg = "SessionChainingConfig", Jg = "ServerlessConfig", Yg = "ShuffleConfig", Xg = "ShapConfig", Zg = "StoppingCondition", Qg = "S3DataDistributionType", $g = "S3DataSource", e_ = "S3DataType", t_ = "StatusDetails", n_ = "StatusEquals", r_ = "S3FailurePath", i_ = "SecurityGroupIds", a_ = "SelectedInstanceCount", o_ = "ScaleInPolicy", s_ = "SelectedInstanceType", c_ = "SpecifiedImage", l_ = "ServerlessJobConfig", u_ = "SequenceLength", d_ = "StatusMessage", f_ = "S3ModelArtifacts", p_ = "S3ModelDataSource", m_ = "SourceModelPackageArn", h_ = "SortOrder", g_ = "S3OutputPath", __ = "ShadowProductionVariants", v_ = "SecondaryStatusTransitions", y_ = "SecondaryStatusTransition", b_ = "SecondaryStatus", x_ = "StartTime", S_ = "SuccessTopic", C_ = "S3Uri", w_ = "Seed", T_ = "Status", E_ = "Strategy", D_ = "Subnets", O_ = "Type", k_ = "TensorBoardOutputConfig", A_ = "TextConfig", j_ = "TrialComponentDisplayName", M_ = "TrainingEndTime", N_ = "TrainingImage", P_ = "TrainingImageConfig", F_ = "TotalInstanceCount", I_ = "TrainingInputMode", L_ = "TrainingJobArn", R_ = "TuningJobArn", z_ = "TrainingJobName", B_ = "TrainingJobStatus", V_ = "TrainingJobSummaries", H_ = "TrainingJobSummary", U_ = "TagList", W_ = "TrialName", G_ = "TrainingPlanArn", K_ = "TrainingPlanArnEquals", q_ = "TrainingPlanArns", J_ = "TrainingProgressInfo", Y_ = "TrainingRepositoryAuthConfig", X_ = "TrainingRepositoryAccessMode", Z_ = "TrafficRoutingConfiguration", Q_ = "TrainingRepositoryCredentialsProviderArn", $_ = "TrafficRoutingConfig", ev = "TotalStepCountPerEpoch", tv = "TrainingStartTime", nv = "TrainingTimeInSeconds", rv = "TerminationWaitInSeconds", iv = "Tags", av = "Tag", ov = "Timestamp", sv = "UsedByCurrentEndpoint", cv = "UseLogit", lv = "UltraServerId", uv = "VpcConfig", dv = "VariantInstanceProvisionTimeoutInSeconds", fv = "VolumeKmsKeyId", pv = "VariantName", mv = "VolumeSizeInGB", hv = "VariantStatus", gv = "Value", _v = "WaitIntervalInSeconds", vv = "WarmPoolStatus", yv = "WarmPoolStatusEquals", bv = "client", xv = "error", Sv = "smithy.ts.sdk.synthetic.com.amazonaws.sagemaker", z = "com.amazonaws.sagemaker", Cv = new Ue(Sv), wv = [
	-3,
	Sv,
	"SageMakerServiceException",
	0,
	[],
	[]
];
Cv.registerError(wv, eu);
var Tv = new Ue(z), Ev = [
	-3,
	z,
	Ru,
	{ [xv]: bv },
	[bm],
	[0]
];
Tv.registerError(Ev, ru);
var Dv = [
	-3,
	z,
	Eg,
	{ [xv]: bv },
	[bm],
	[0]
];
Tv.registerError(Dv, iu);
var Ov = [
	-3,
	z,
	Og,
	{ [xv]: bv },
	[bm],
	[0]
];
Tv.registerError(Ov, tu);
var kv = [
	-3,
	z,
	Ag,
	{ [xv]: bv },
	[bm],
	[0]
];
Tv.registerError(kv, nu);
var Av = [Cv, Tv], jv = [
	3,
	z,
	pu,
	0,
	[rd, $g],
	[0, () => Fb],
	2
], Mv = [
	3,
	z,
	au,
	0,
	[gu],
	[0]
], Nv = [
	3,
	z,
	xu,
	0,
	[
		I_,
		N_,
		_u,
		Pm,
		Yf,
		Gu,
		Ou,
		P_
	],
	[
		0,
		0,
		0,
		() => mx,
		2,
		64,
		64,
		() => Wb
	],
	1
], Pv = [
	3,
	z,
	cu,
	0,
	[Em],
	[1]
], Fv = [
	3,
	z,
	su,
	0,
	[Oh, ku],
	[() => Lv, () => Pv],
	1
], Iv = [
	3,
	z,
	uu,
	0,
	[
		S_,
		tp,
		jp
	],
	[
		0,
		0,
		64
	]
], Lv = [
	3,
	z,
	du,
	0,
	[
		Xp,
		g_,
		wh,
		r_
	],
	[
		0,
		0,
		() => Iv,
		0
	]
], Rv = [
	3,
	z,
	yu,
	0,
	[Cu],
	[() => Qb]
], zv = [
	3,
	z,
	wu,
	0,
	[
		Z_,
		rv,
		Um
	],
	[
		() => Ub,
		1,
		1
	],
	1
], Bv = [
	3,
	z,
	_d,
	0,
	[O_, gv],
	[0, 1],
	2
], Vv = [
	3,
	z,
	ju,
	0,
	[Au, Kp],
	[64, 64]
], Hv = [
	3,
	z,
	ad,
	0,
	[td],
	[0],
	1
], Uv = [
	3,
	z,
	Nd,
	0,
	[
		rd,
		ff,
		Od,
		Dd,
		Vg,
		Mp,
		Yg
	],
	[
		0,
		() => uy,
		0,
		0,
		0,
		0,
		() => zb
	],
	2
], Wv = [
	3,
	z,
	Mu,
	0,
	[C_, hm],
	[0, 0],
	1
], Gv = [
	3,
	z,
	zu,
	0,
	[
		Xg,
		Lf,
		Sp
	],
	[
		() => Jv,
		0,
		() => Kv
	],
	1
], Kv = [
	3,
	z,
	Yu,
	0,
	[
		ip,
		Ad,
		uh,
		rh,
		Lh,
		sm,
		jh,
		Qp,
		om,
		ap,
		fp
	],
	[
		0,
		0,
		1,
		1,
		1,
		1,
		0,
		0,
		64,
		64,
		64
	]
], qv = [
	3,
	z,
	dd,
	0,
	[
		yh,
		Ug,
		Gg
	],
	[
		0,
		0,
		0
	]
], Jv = [
	3,
	z,
	fd,
	0,
	[
		Wg,
		Eh,
		cv,
		w_,
		A_
	],
	[
		() => qv,
		1,
		2,
		1,
		() => Yv
	],
	1
], Yv = [
	3,
	z,
	Cd,
	0,
	[Zp, pp],
	[0, 0],
	2
], Xv = [
	3,
	z,
	Nu,
	0,
	[id, cd],
	[0, 128]
], Zv = [
	3,
	z,
	Fu,
	0,
	[
		Ju,
		Gp,
		bp,
		xh,
		Nm,
		Mm,
		mu,
		bf,
		ih,
		Hp,
		Xm,
		Qu
	],
	[
		0,
		0,
		() => Fy,
		0,
		0,
		() => ob,
		() => Zb,
		128,
		0,
		0,
		() => lb,
		() => Qv
	]
], Qv = [
	3,
	z,
	Qu,
	0,
	[Rm],
	[() => hx]
], $v = [
	3,
	z,
	Bu,
	0,
	[
		wf,
		Zh,
		Id,
		iv,
		Xp,
		su,
		Nf,
		__,
		Gf,
		uv,
		Uf,
		km
	],
	[
		0,
		() => yx,
		() => sy,
		() => Ex,
		0,
		() => Fv,
		() => My,
		() => yx,
		0,
		() => Jb,
		2,
		() => eb
	],
	2
], ey = [
	3,
	z,
	Vu,
	0,
	[Cf],
	[0],
	1
], ty = [
	3,
	z,
	Uu,
	0,
	[
		Hf,
		wf,
		Rd,
		iv
	],
	[
		0,
		0,
		() => vy,
		() => Ex
	],
	2
], ny = [
	3,
	z,
	Wu,
	0,
	[xf],
	[0],
	1
], ry = [
	3,
	z,
	$u,
	0,
	[
		$m,
		Nh,
		Pd,
		wp,
		Gf,
		iv,
		uv,
		Uf
	],
	[
		0,
		() => Zv,
		() => tx,
		() => Iy,
		0,
		() => Ex,
		() => Jb,
		2
	],
	1
], iy = [
	3,
	z,
	ed,
	0,
	[xm],
	[0],
	1
], ay = [
	3,
	z,
	Td,
	0,
	[
		z_,
		hg,
		kh,
		gp,
		xu,
		Cp,
		yg,
		uv,
		Zg,
		iv,
		Uf,
		Rf,
		Vf,
		Mu,
		Yd,
		cf,
		k_,
		Pf,
		Ph,
		Wh,
		bf,
		Pg,
		xg,
		yp,
		qg,
		l_,
		Tm,
		eh
	],
	[
		0,
		0,
		() => ub,
		128,
		() => Nv,
		() => lx,
		() => jb,
		() => Jb,
		() => Bb,
		() => Ex,
		2,
		2,
		2,
		() => Wv,
		() => dy,
		() => nx,
		() => Hb,
		() => jy,
		() => Tb,
		() => Sx,
		128,
		() => Mb,
		() => kb,
		() => Ry,
		() => Rb,
		() => Lb,
		() => nb,
		() => sb
	],
	3
], oy = [
	3,
	z,
	Ed,
	0,
	[L_],
	[0],
	1
], sy = [
	3,
	z,
	Id,
	0,
	[
		Up,
		mf,
		sd,
		jf,
		Xp,
		ju
	],
	[
		1,
		0,
		() => $b,
		2,
		0,
		() => Vv
	],
	3
], cy = [
	3,
	z,
	Ld,
	0,
	[
		jf,
		vd,
		hd,
		mf,
		Xp
	],
	[
		2,
		0,
		1,
		0,
		0
	],
	5
], ly = [
	3,
	z,
	hf,
	0,
	[Fd],
	[0],
	1
], uy = [
	3,
	z,
	ff,
	0,
	[
		$g,
		lp,
		hf
	],
	[
		() => Pb,
		() => Ny,
		() => ly
	]
], dy = [
	3,
	z,
	Yd,
	0,
	[
		g_,
		hm,
		_p,
		Pu
	],
	[
		0,
		0,
		128,
		() => ex
	],
	1
], fy = [
	3,
	z,
	lf,
	0,
	[
		_g,
		Sg,
		hm,
		g_,
		R,
		mv,
		Mg
	],
	[
		0,
		0,
		0,
		0,
		0,
		1,
		128
	],
	2
], py = [
	3,
	z,
	uf,
	0,
	[
		_g,
		Cg,
		wg,
		t_,
		dm
	],
	[
		0,
		0,
		0,
		0,
		4
	]
], my = [
	3,
	z,
	Vd,
	0,
	[wf],
	[0],
	1
], hy = [
	3,
	z,
	Gd,
	0,
	[Hf],
	[0],
	1
], gy = [
	3,
	z,
	$d,
	0,
	[$m],
	[0],
	1
], _y = [
	3,
	z,
	Zd,
	0,
	[
		c_,
		Tg,
		zg
	],
	[
		0,
		0,
		4
	]
], vy = [
	3,
	z,
	Rd,
	0,
	[
		wu,
		Bg,
		bu
	],
	[
		() => zv,
		() => Nb,
		() => Rv
	]
], yy = [
	3,
	z,
	sf,
	0,
	[Fg, Lg],
	[0, () => wx],
	1
], by = [
	3,
	z,
	Hd,
	0,
	[wf],
	[0],
	1
], xy = [
	3,
	z,
	Ud,
	0,
	[
		wf,
		Cf,
		Zh,
		bd,
		Id,
		Xp,
		su,
		Nf,
		__,
		Gf,
		uv,
		Uf,
		km
	],
	[
		0,
		0,
		() => yx,
		4,
		() => sy,
		0,
		() => Fv,
		() => My,
		() => yx,
		0,
		() => Jb,
		2,
		() => eb
	],
	4
], Sy = [
	3,
	z,
	Kd,
	0,
	[Hf],
	[0],
	1
], Cy = [
	3,
	z,
	qd,
	0,
	[
		Hf,
		xf,
		qf,
		bd,
		dm,
		wf,
		Zh,
		Id,
		sp,
		$p,
		su,
		Ih,
		Nf,
		__,
		km
	],
	[
		0,
		0,
		0,
		4,
		4,
		0,
		() => xx,
		() => cy,
		0,
		() => vy,
		() => Fv,
		() => db,
		() => My,
		() => xx,
		() => eb
	],
	5
], wy = [
	3,
	z,
	ef,
	0,
	[$m],
	[0],
	1
], Ty = [
	3,
	z,
	tf,
	0,
	[
		$m,
		bd,
		xm,
		Nh,
		Pd,
		wp,
		Gf,
		uv,
		Uf,
		sf
	],
	[
		0,
		4,
		0,
		() => Zv,
		() => tx,
		() => Iy,
		0,
		() => Jb,
		2,
		() => yy
	],
	3
], Ey = [
	3,
	z,
	gf,
	0,
	[z_],
	[0],
	1
], Dy = [
	3,
	z,
	_f,
	0,
	[
		z_,
		L_,
		Cm,
		B_,
		b_,
		Zg,
		bd,
		R_,
		cm,
		hu,
		sp,
		gp,
		xu,
		hg,
		Cp,
		kh,
		yg,
		vv,
		uv,
		tv,
		M_,
		dm,
		v_,
		op,
		Uf,
		Rf,
		Vf,
		Mu,
		nv,
		Du,
		Eu,
		Yd,
		Pf,
		cf,
		k_,
		df,
		Ph,
		Wh,
		Kh,
		Xh,
		bf,
		Pg,
		xg,
		yp,
		l_,
		Tm,
		eh,
		Lm,
		zh,
		Ah
	],
	[
		0,
		0,
		() => ab,
		0,
		0,
		() => Bb,
		4,
		0,
		0,
		0,
		0,
		128,
		() => Nv,
		0,
		() => lx,
		() => ub,
		() => jb,
		() => Yb,
		() => Jb,
		4,
		4,
		4,
		() => Tx,
		() => cx,
		2,
		2,
		2,
		() => Wv,
		1,
		1,
		1,
		() => dy,
		() => jy,
		() => nx,
		() => Hb,
		() => rx,
		() => Tb,
		() => Sx,
		() => Cx,
		0,
		128,
		() => Mb,
		() => kb,
		() => Ry,
		() => Lb,
		() => nb,
		() => sb,
		() => rb,
		() => Kb,
		0
	],
	7
], Oy = [
	3,
	z,
	Tf,
	0,
	[
		Ef,
		F_,
		lu,
		sv
	],
	[
		0,
		1,
		1,
		1
	]
], ky = [
	3,
	z,
	kf,
	0,
	[
		wf,
		Cf,
		bd
	],
	[
		0,
		0,
		4
	],
	3
], Ay = [
	3,
	z,
	Qf,
	0,
	[
		Hf,
		xf,
		bd,
		dm,
		qf
	],
	[
		0,
		0,
		4,
		4,
		0
	],
	5
], jy = [
	3,
	z,
	Pf,
	0,
	[
		Wf,
		W_,
		j_,
		jg
	],
	[
		0,
		0,
		0,
		0
	]
], My = [
	3,
	z,
	Nf,
	0,
	[zu],
	[() => Gv]
], Ny = [
	3,
	z,
	lp,
	0,
	[
		up,
		cp,
		dp,
		af
	],
	[
		0,
		0,
		0,
		0
	],
	4
], Py = [
	3,
	z,
	mp,
	0,
	[hp],
	[0],
	1
], Fy = [
	3,
	z,
	bp,
	0,
	[mg, pg],
	[0, () => Ab],
	1
], Iy = [
	3,
	z,
	wp,
	0,
	[xh],
	[0],
	1
], Ly = [
	3,
	z,
	kp,
	0,
	[hp],
	[0],
	1
], Ry = [
	3,
	z,
	yp,
	0,
	[zf],
	[2]
], zy = [
	3,
	z,
	Op,
	0,
	[
		R,
		xp,
		Ep
	],
	[
		0,
		1,
		0
	],
	3
], By = [
	3,
	z,
	Pp,
	0,
	[Bf, Jh],
	[2, () => vx]
], Vy = [
	3,
	z,
	Np,
	0,
	[
		R,
		fg,
		Qm
	],
	[
		0,
		1,
		0
	],
	2
], Hy = [
	3,
	z,
	Lp,
	0,
	[R, Xu],
	[0, 1],
	2
], Uy = [
	3,
	z,
	zp,
	0,
	[
		R,
		xp,
		q_
	],
	[
		0,
		1,
		64
	],
	1
], Wy = [
	3,
	z,
	tm,
	0,
	[
		Kg,
		h_,
		Dh,
		oh,
		Th,
		Sd,
		xd
	],
	[
		0,
		0,
		0,
		1,
		0,
		4,
		4
	]
], Gy = [
	3,
	z,
	nm,
	0,
	[Mf, Dh],
	[() => ox, 0],
	1
], Ky = [
	3,
	z,
	rm,
	0,
	[
		Kg,
		h_,
		Dh,
		oh,
		Th,
		Sd,
		xd,
		pm,
		fm,
		n_
	],
	[
		0,
		0,
		0,
		1,
		0,
		4,
		4,
		4,
		4,
		0
	]
], qy = [
	3,
	z,
	im,
	0,
	[rp, Dh],
	[() => sx, 0],
	1
], Jy = [
	3,
	z,
	lm,
	0,
	[
		Kg,
		h_,
		Dh,
		oh,
		Th,
		Sd,
		xd
	],
	[
		0,
		0,
		0,
		1,
		0,
		4,
		4
	]
], Yy = [
	3,
	z,
	um,
	0,
	[Sh, Dh],
	[() => gx, 0],
	1
], Xy = [
	3,
	z,
	vm,
	0,
	[
		Dh,
		oh,
		xd,
		Sd,
		fm,
		pm,
		Th,
		n_,
		Kg,
		h_,
		yv,
		K_
	],
	[
		0,
		1,
		4,
		4,
		4,
		4,
		0,
		0,
		0,
		0,
		0,
		0
	]
], Zy = [
	3,
	z,
	ym,
	0,
	[V_, Dh],
	[() => Dx, 0],
	1
], Qy = [
	3,
	z,
	Fm,
	0,
	[
		Zm,
		gv,
		ov
	],
	[
		0,
		1,
		4
	]
], $y = [
	3,
	z,
	Im,
	0,
	[Ch, Hg],
	[0, 0],
	2
], eb = [
	3,
	z,
	km,
	0,
	[
		If,
		Ff,
		th
	],
	[
		2,
		2,
		1
	]
], tb = [
	3,
	z,
	Km,
	0,
	[Hm, th],
	[0, 1],
	1
], nb = [
	3,
	z,
	Tm,
	0,
	[
		ch,
		Vm,
		ph
	],
	[
		0,
		0,
		0
	],
	1
], rb = [
	3,
	z,
	Lm,
	0,
	[zm, dh],
	[0, 0]
], ib = [
	3,
	z,
	Sm,
	0,
	[ou],
	[2],
	1
], ab = [
	3,
	z,
	Cm,
	0,
	[f_],
	[0],
	1
], ob = [
	3,
	z,
	Mm,
	0,
	[$g],
	[() => Fb]
], sb = [
	3,
	z,
	eh,
	0,
	[nh, m_],
	[0, 0],
	1
], cb = [
	3,
	z,
	vh,
	0,
	[
		$m,
		xm,
		bd
	],
	[
		0,
		0,
		4
	],
	3
], lb = [
	3,
	z,
	Xm,
	0,
	[Dm],
	[0]
], ub = [
	3,
	z,
	kh,
	0,
	[
		g_,
		Xp,
		Dd
	],
	[
		0,
		0,
		0
	],
	1
], db = [
	3,
	z,
	Ih,
	0,
	[
		wf,
		Zh,
		x_,
		__
	],
	[
		0,
		() => _x,
		4,
		() => _x
	],
	1
], fb = [
	3,
	z,
	Vh,
	0,
	[
		pv,
		Qd,
		Md,
		yf,
		Xu,
		Xd,
		R,
		Bp,
		Su,
		hv,
		pd,
		pf,
		Ym,
		bg
	],
	[
		0,
		() => ix,
		1,
		1,
		1,
		1,
		0,
		() => fx,
		0,
		() => bx,
		() => Sb,
		() => Sb,
		() => yb,
		() => xb
	],
	1
], pb = [
	3,
	z,
	Yh,
	0,
	[xp, lv],
	[1, 0],
	1
], mb = [
	3,
	z,
	Mh,
	0,
	[Bh, kd],
	[1, 1]
], hb = [
	3,
	z,
	ug,
	0,
	[
		pv,
		$m,
		Ap,
		R,
		Bp,
		dv,
		Wp,
		Su,
		Iu,
		Jg,
		mv,
		Am,
		md,
		Xf,
		Ym,
		bg,
		vp,
		ld
	],
	[
		0,
		0,
		1,
		0,
		() => dx,
		1,
		1,
		0,
		() => vb,
		() => Sb,
		1,
		1,
		1,
		2,
		() => yb,
		() => xb,
		0,
		() => gb
	],
	1
], gb = [
	3,
	z,
	$h,
	0,
	[ud, lh],
	[0, 0]
], _b = [
	3,
	z,
	eg,
	0,
	[
		lh,
		ud,
		F_,
		lu,
		sv,
		Of
	],
	[
		0,
		0,
		1,
		1,
		1,
		() => ax
	]
], vb = [
	3,
	z,
	Qh,
	0,
	[mf, Xp],
	[0, 0],
	1
], yb = [
	3,
	z,
	ng,
	0,
	[
		T_,
		qm,
		Jm,
		o_
	],
	[
		0,
		1,
		1,
		() => bb
	]
], bb = [
	3,
	z,
	rg,
	0,
	[
		E_,
		gh,
		Zu
	],
	[
		0,
		1,
		1
	],
	1
], xb = [
	3,
	z,
	ig,
	0,
	[Ig, Mh],
	[0, () => mb],
	1
], Sb = [
	3,
	z,
	ag,
	0,
	[
		mh,
		Om,
		Fh
	],
	[
		1,
		1,
		1
	],
	2
], Cb = [
	3,
	z,
	cg,
	0,
	[
		T_,
		d_,
		x_
	],
	[
		0,
		0,
		4
	],
	1
], wb = [
	3,
	z,
	lg,
	0,
	[
		pv,
		Qd,
		Md,
		yf,
		Xu,
		Xd,
		Bp,
		hv,
		pd,
		pf,
		Ym,
		bg,
		ld
	],
	[
		0,
		() => ix,
		1,
		1,
		1,
		1,
		() => fx,
		() => bx,
		() => Sb,
		() => Sb,
		() => yb,
		() => xb,
		() => _b
	],
	1
], Tb = [
	3,
	z,
	Ph,
	0,
	[
		g_,
		Rh,
		Uh,
		of
	],
	[
		0,
		1,
		128,
		2
	]
], Eb = [
	3,
	z,
	Gh,
	0,
	[
		_g,
		Sg,
		hm,
		g_,
		R,
		mv,
		Mg
	],
	[
		0,
		0,
		0,
		0,
		0,
		1,
		128
	],
	2
], Db = [
	3,
	z,
	qh,
	0,
	[
		_g,
		Cg,
		wg,
		t_,
		dm
	],
	[
		0,
		0,
		0,
		0,
		4
	]
], Ob = [
	3,
	z,
	Rg,
	0,
	[
		Dg,
		R,
		bf
	],
	[
		0,
		0,
		128
	],
	2
], kb = [
	3,
	z,
	xg,
	0,
	[Kf],
	[2]
], Ab = [
	3,
	z,
	pg,
	0,
	[vg],
	[0],
	1
], jb = [
	3,
	z,
	yg,
	0,
	[
		R,
		xp,
		mv,
		fv,
		Yp,
		Tp,
		G_,
		Pp,
		Vp,
		s_,
		a_
	],
	[
		0,
		1,
		1,
		0,
		1,
		() => ux,
		0,
		() => By,
		() => px,
		0,
		1
	]
], Mb = [
	3,
	z,
	Pg,
	0,
	[sh],
	[1],
	1
], Nb = [
	3,
	z,
	Bg,
	0,
	[
		wm,
		_v,
		Um,
		kg
	],
	[
		() => Bv,
		1,
		1,
		() => Bv
	],
	2
], Pb = [
	3,
	z,
	$g,
	0,
	[
		e_,
		C_,
		Qg,
		vu,
		Dp,
		Sm,
		mp
	],
	[
		0,
		0,
		0,
		64,
		64,
		() => ib,
		() => Py
	],
	2
], Fb = [
	3,
	z,
	p_,
	0,
	[
		C_,
		e_,
		Dd,
		Sm,
		mp,
		_h,
		$f,
		Wm
	],
	[
		0,
		0,
		0,
		() => ib,
		() => Ly,
		0,
		0,
		0
	],
	3
], Ib = [
	3,
	z,
	y_,
	0,
	[
		T_,
		x_,
		ep,
		d_
	],
	[
		0,
		4,
		4,
		0
	],
	2
], Lb = [
	3,
	z,
	l_,
	0,
	[
		Tu,
		qp,
		ou,
		jd,
		dg,
		np,
		Sf,
		u_
	],
	[
		0,
		0,
		2,
		0,
		0,
		0,
		0,
		0
	],
	2
], Rb = [
	3,
	z,
	qg,
	0,
	[Zf],
	[2]
], zb = [
	3,
	z,
	Yg,
	0,
	[w_],
	[1],
	1
], Bb = [
	3,
	z,
	Zg,
	0,
	[
		fh,
		bh,
		ah
	],
	[
		1,
		1,
		1
	]
], Vb = [
	3,
	z,
	av,
	0,
	[Jp, gv],
	[0, 0],
	2
], Hb = [
	3,
	z,
	k_,
	0,
	[g_, hm],
	[0, 0],
	1
], Ub = [
	3,
	z,
	$_,
	0,
	[
		O_,
		_v,
		gd,
		gm
	],
	[
		0,
		1,
		() => Bv,
		() => Bv
	],
	2
], Wb = [
	3,
	z,
	P_,
	0,
	[X_, Y_],
	[0, () => qb],
	1
], Gb = [
	3,
	z,
	H_,
	0,
	[
		z_,
		L_,
		bd,
		B_,
		M_,
		dm,
		b_,
		vv,
		G_
	],
	[
		0,
		0,
		4,
		0,
		4,
		4,
		0,
		() => Yb,
		0
	],
	4
], Kb = [
	3,
	z,
	J_,
	0,
	[
		ev,
		yd,
		qu,
		Gm
	],
	[
		1,
		1,
		1,
		1
	]
], qb = [
	3,
	z,
	Y_,
	0,
	[Q_],
	[0],
	1
], Jb = [
	3,
	z,
	uv,
	0,
	[i_, D_],
	[64, 64],
	2
], Yb = [
	3,
	z,
	vv,
	0,
	[
		T_,
		Ng,
		gg
	],
	[
		0,
		1,
		0
	],
	1
], Xb = "unit", Zb = [
	1,
	z,
	mu,
	0,
	() => jv
], Qb = [
	1,
	z,
	fu,
	0,
	() => Mv
], $b = [
	1,
	z,
	od,
	0,
	() => Hv
], ex = [
	1,
	z,
	Pu,
	0,
	() => Xv
], tx = [
	1,
	z,
	Lu,
	0,
	() => Zv
], nx = [
	1,
	z,
	cf,
	0,
	() => fy
], rx = [
	1,
	z,
	df,
	0,
	() => py
], ix = [
	1,
	z,
	Qd,
	0,
	() => _y
], ax = [
	1,
	z,
	Df,
	0,
	() => Oy
], ox = [
	1,
	z,
	Af,
	0,
	() => ky
], sx = [
	1,
	z,
	Jf,
	0,
	() => Ay
], cx = [
	1,
	z,
	op,
	0,
	() => Qy
], lx = [
	1,
	z,
	Cp,
	0,
	() => Uv
], ux = [
	1,
	z,
	Tp,
	0,
	() => zy
], dx = [
	1,
	z,
	Fp,
	0,
	() => Vy
], fx = [
	1,
	z,
	Rp,
	0,
	() => Hy
], px = [
	1,
	z,
	Ip,
	0,
	() => Uy
], mx = [
	1,
	z,
	jm,
	0,
	() => $y
], hx = [
	1,
	z,
	Bm,
	0,
	() => tb
], gx = [
	1,
	z,
	hh,
	0,
	() => cb
], _x = [
	1,
	z,
	Hh,
	0,
	() => fb
], vx = [
	1,
	z,
	Jh,
	0,
	() => pb
], yx = [
	1,
	z,
	tg,
	0,
	() => hb
], bx = [
	1,
	z,
	og,
	0,
	() => Cb
], xx = [
	1,
	z,
	sg,
	0,
	() => wb
], Sx = [
	1,
	z,
	Wh,
	0,
	() => Eb
], Cx = [
	1,
	z,
	Kh,
	0,
	() => Db
], wx = [
	1,
	z,
	Lg,
	0,
	() => Ob
], Tx = [
	1,
	z,
	v_,
	0,
	() => Ib
], Ex = [
	1,
	z,
	U_,
	0,
	() => Vb
], Dx = [
	1,
	z,
	V_,
	0,
	() => Gb
], Ox = [
	9,
	z,
	Ku,
	0,
	() => ty,
	() => ny
], kx = [
	9,
	z,
	Hu,
	0,
	() => $v,
	() => ey
], Ax = [
	9,
	z,
	nd,
	0,
	() => ry,
	() => iy
], jx = [
	9,
	z,
	wd,
	0,
	() => ay,
	() => oy
], Mx = [
	9,
	z,
	zd,
	0,
	() => hy,
	() => Xb
], Nx = [
	9,
	z,
	Bd,
	0,
	() => my,
	() => Xb
], Px = [
	9,
	z,
	nf,
	0,
	() => gy,
	() => Xb
], Fx = [
	9,
	z,
	Jd,
	0,
	() => Sy,
	() => Cy
], Ix = [
	9,
	z,
	Wd,
	0,
	() => by,
	() => xy
], Lx = [
	9,
	z,
	rf,
	0,
	() => wy,
	() => Ty
], Rx = [
	9,
	z,
	vf,
	0,
	() => Ey,
	() => Dy
], zx = [
	9,
	z,
	em,
	0,
	() => Wy,
	() => Gy
], Bx = [
	9,
	z,
	am,
	0,
	() => Ky,
	() => qy
], Vx = [
	9,
	z,
	mm,
	0,
	() => Jy,
	() => Yy
], Hx = [
	9,
	z,
	_m,
	0,
	() => Xy,
	() => Zy
];
Vi(), he(), N();
var Ux = (e) => ({
	apiVersion: "2017-07-24",
	base64Decoder: e?.base64Decoder ?? ft,
	base64Encoder: e?.base64Encoder ?? gt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? $l,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? Sl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Ac()
	}],
	logger: e?.logger ?? new ot(),
	protocol: e?.protocol ?? Pl,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.sagemaker",
		errorTypeRegistries: Av,
		xmlNamespace: "http://sagemaker.amazonaws.com/doc/2017-05-13/",
		version: "2017-07-24",
		serviceTarget: "SageMaker"
	},
	serviceId: e?.serviceId ?? "SageMaker",
	sha256: e?.sha256 ?? zi,
	urlParser: e?.urlParser ?? me,
	utf8Decoder: e?.utf8Decoder ?? mt,
	utf8Encoder: e?.utf8Encoder ?? bt
});
N(), hi();
var Wx = (e) => {
	let t = yc(e), n = () => t().then(Qe), r = Ux(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? vn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? ac({
			serviceId: r.serviceId,
			clientVersion: El.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? ve("Region is missing"),
		requestHandler: Al.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || fs),
		streamCollector: e?.streamCollector ?? mi,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, Gx = (e) => {
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
}, Kx = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), qx = (e, t) => {
	let n = Object.assign(xc(e), it(e), Ga(e), Gx(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Sc(n), at(n), Ka(n), Kx(n));
};
li(), w();
var Jx = class extends ye {
	config;
	constructor(...[e]) {
		let t = Wx(e || {});
		super(t), this.initConfig = t;
		let n = vs(_c(gs(Hs(wl(t))))), r = qx(Cl(si(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(ke(this.config)), this.middlewareStack.use(ic(this.config)), this.middlewareStack.use(_s(this.config)), this.middlewareStack.use(Xa(this.config)), this.middlewareStack.use(xs(this.config)), this.middlewareStack.use(ws(this.config)), this.middlewareStack.use(Ts(this.config)), this.middlewareStack.use(As(this.config, {
			httpAuthSchemeParametersProvider: bl,
			identityProviderConfigProvider: async (e) => new Ls({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Fs(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-sagemaker@3.1156.0/node_modules/@aws-sdk/client-sagemaker/dist-es/commandBuilder.js
li();
var B = st(Tl, "SageMaker", "SageMakerClient", ci), V = {}, H = (e, t, n, r) => [], Yx = class extends B(V, H, "CreateEndpoint", Ox) {}, Xx = class extends B(V, H, "CreateEndpointConfig", kx) {}, Zx = class extends B(V, H, "CreateModel", Ax) {}, Qx = class extends B(V, H, "CreateTrainingJob", jx) {}, $x = class extends B(V, H, "DeleteEndpoint", Mx) {}, eS = class extends B(V, H, "DeleteEndpointConfig", Nx) {}, tS = class extends B(V, H, "DeleteModel", Px) {}, nS = class extends B(V, H, "DescribeEndpoint", Fx) {}, rS = class extends B(V, H, "DescribeEndpointConfig", Ix) {}, iS = class extends B(V, H, "DescribeModel", Lx) {}, aS = class extends B(V, H, "DescribeTrainingJob", Rx) {}, oS = class extends B(V, H, "ListEndpointConfigs", zx) {}, sS = class extends B(V, H, "ListEndpoints", Bx) {}, cS = class extends B(V, H, "ListModels", Vx) {}, lS = class extends B(V, H, "ListTrainingJobs", Hx) {}, uS = class extends Error {
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
}, dS = Symbol(), fS = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), pS = 1e4, mS = (e) => "headers" in e, hS = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (mS(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? gS(e, {
		all: n,
		dot: r
	}) : {};
};
async function gS(e, t) {
	if (!mS(e) && e.bodyCache.formData) return _S(await e.bodyCache.formData, t);
	let n = mS(e) ? e.headers : e.raw.headers, r = fS(await e.arrayBuffer(), n.get("Content-Type") || "");
	mS(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? _S(i, t) : {};
}
function _S(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? vS(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (yS(n, e, t, r), delete n[e]);
	}), n;
}
var vS = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, yS = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && bS(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= pS && bS(), i[e] = Object.create(null)), i = i[e]);
	});
}, bS = () => {
	throw Error("Nesting limit exceeded");
}, xS = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, SS = (e) => {
	let { groups: t, path: n } = CS(e);
	return wS(xS(n), t);
}, CS = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, wS = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, TS = {}, ES = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return TS[r] || (TS[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), TS[r];
	}
	return null;
}, DS = (e, t) => {
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
}, OS = (e) => DS(e, decodeURI), kS = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return OS(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, AS = (e) => {
	let t = kS(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, jS = (e, t, ...n) => (n.length && (t = jS(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), MS = (e) => {
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
}, NS = (e) => e.indexOf("%") === -1 ? e : DS(e, RS), PS = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), NS(e)), FS = (e, t, n) => {
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
					return PS(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = PS(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = PS(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, IS = FS, LS = (e, t) => FS(e, t, !0), RS = decodeURIComponent, zS = class {
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
		return n && NS(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = NS(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return IS(this.url, e);
	}
	queries(e) {
		return LS(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return hS(this, e);
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
	get [dS]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, BS = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, VS = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, HS = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => HS(e, t, !1, r, i))).then(() => i[0]));
	return n ? VS(await o, a) : o;
}, US = "text/plain; charset=UTF-8", WS = (e, t) => ({
	"Content-Type": e,
	...t
}), GS = (e, t) => new Response(e, t), KS = class {
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
		return this.#t ??= new zS(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= GS(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = GS(e.body, e);
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
		this.finalized && (this.#a = GS(this.#a.body, this.#a));
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
		return GS(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, WS(US, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, WS("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, WS("text/html; charset=UTF-8", n));
		return typeof e == "object" ? HS(e, BS.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => GS(), this.#c(this));
}, qS = (e, t, n) => (r, i) => {
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
}, JS = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], YS = "Can not add a route since the matcher is already built.", XS = class extends Error {}, ZS = "__COMPOSED_HANDLER", QS = (e) => e.text("404 Not Found", 404), $S = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, eC = class e {
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
		[...JS, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? kS : AS;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = QS;
	errorHandler = $S;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === $S ? r = e.handler : (r = async (n, r) => (await qS([], t.errorHandler)(n, () => e.handler(n, r))).res, r[ZS] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = jS(this._basePath, e), t;
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
			let t = jS(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", jS(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = jS(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : jS(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new KS(e, {
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
		let s = qS(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${jS("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, U = () => Object.create(null), tC = [];
function nC(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], tC];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var rC = "[^/]+", iC = "(?:|/.*)", aC = Symbol(), oC = /* @__PURE__ */ new Set(".\\+*[^]$()");
function sC(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var cC = class e {
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
				rC
			] : null : s === "/*" ? [
				"",
				"",
				iC
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && oC.has(n))) throw aC;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw aC;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw aC;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw aC;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(sC).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : oC.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, lC = class {
	#e = { varIndex: 0 };
	#t = new cC();
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
}, uC = U();
function dC(e) {
	return uC[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? iC : e === "*" ? ".*" : `/:${rC}`)}$`);
}
function fC(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (dC(n).test(t)) return [...e[n]];
}
var pC = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: U() }, this.#t = { ALL: U() }, this.#n = { ALL: new lC() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === aC ? new XS(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(YS);
		if (!r[e]) {
			this.#n[e] = new lC();
			for (let t of [r, i]) {
				t[e] = U();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = dC(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = fC(r[e], t) || fC(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = MS(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = fC(r[t], e) || fC(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = nC;
	buildAllMatchers() {
		let e = U();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, uC = U(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = U(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), U())]) : i[t] = [n.map(([e]) => [e, U()]), tC];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, mC = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(YS);
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
				if (e instanceof XS) continue;
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
}, hC = U(), gC = 0, _C = class e {
	#e = [];
	#t = U();
	#n = [];
	#r;
	#i = hC;
	insert(t, n, r) {
		let i = this, a = SS(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = ES(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++gC
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
		this.#i = hC;
		let r = [this], i = xS(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === hC ? {} : { ...p.#i };
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
}, vC = class {
	name = "TrieRouter";
	#e = new _C();
	add(e, t, n) {
		for (let r of MS(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, yC = class extends eC {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new mC({ routers: [new pC(), new vC()] });
	}
}, bC = [
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
}, xC = class extends W {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, K = class extends W {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, SC = class extends W {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, CC = class extends W {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, q = class extends W {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, wC = class extends W {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, TC = class extends W {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, EC = class extends W {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, DC = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function OC(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && DC.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function kC(e, t) {
	let n = AC(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function AC(e, t) {
	if (e instanceof W) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return OC(e) ? new TC(r, { cause: e }) : new EC(r, { cause: e });
}
var jC = 1e3, MC = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function NC(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new G("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new G("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new G("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = PC(r)), a;
}
function PC(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!MC.includes(t)) throw new G(`sortKey.operator must be one of ${MC.join(", ")}.`);
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
function FC(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new G(`limit must be a whole number between 1 and ${jC}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new G(`limit must be between 1 and ${jC}.`);
	return t;
}
// src/cloud-spi/serviceCatalog.ts
var IC = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], LC = {
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
}, RC = Object.keys(LC).map((e) => ({
	service: e,
	...LC[e]
})).sort(HC);
RC.map((e) => e.service);
function J(e) {
	return Object.hasOwn(LC, e);
}
function zC(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function BC(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function VC(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function HC(e, t) {
	let n = IC.indexOf(e.group) - IC.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var UC = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function WC(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${UC[t]}/${n}/` : void 0;
}
// src/adapter-aws/awsErrors.ts
var GC = /* @__PURE__ */ new Set([
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
]), KC = /* @__PURE__ */ new Set([
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
]), qC = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), JC = /* @__PURE__ */ new Set([
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
]), YC = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), XC = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), ZC = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function QC(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function $C(e) {
	if (!QC(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || GC.has(n)) return new CC(r, i);
	if (KC.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new SC(r, i);
	if (qC.has(n)) return new xC(r, i);
	if (JC.has(n)) return new G(r, i);
	if (YC.has(n) || /\.NotFound$/.test(n)) return new K(r, i);
	if (XC.has(n)) return new wC(r, i);
	if (ZC.has(n) || OC(e)) return new TC(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new G(r, i) : a === 401 || a === 403 ? new xC(r, i) : a === 404 ? new K(r, i) : a === 409 ? new SC(r, i) : a === 429 ? new CC(r, i) : a === 501 ? new wC(r, i) : a === 503 || a === 504 ? new TC(r, i) : new EC(r, i);
}
// browser-bundle/cloudproxy-stub.ts
function ew() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// src/service/deadline.ts
async function tw(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// src/service/defaultCloud.ts
var nw = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, rw = !1;
function iw(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = aw(t);
	return !n && !rw && (rw = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function aw(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(nw, t) ? nw[t] : null;
}
var ow = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), sw = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), cw = 5464, lw = 8192, uw = 50, dw = 12e4;
function fw(e, t = ew) {
	let n = new yC();
	n.onError((e, t) => {
		if (e instanceof W) {
			let { status: n, body: r } = kC(e);
			return t.json(r, n);
		}
		return e instanceof uS ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : iw();
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
		return Ow(e, 150), Q(e, () => tw(dw, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: Aw(i.schema(t, n), (t) => e.req.query(t))
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
			if (n.logGroupNames.length > uw) throw new G(`logGroupNames must include at most ${uw} log groups.`);
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
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), Ew(e));
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
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), Ew(e));
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
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", Dw(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), Ew(e));
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
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", Dw(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), NC(n), Dw(n));
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
			let i = await yw(e);
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
			let i = gw((await yw(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = _w(e.req.query());
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
		return kw(e, async () => {
			let n = await bw(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: Tw(n.plaintextBase64, "plaintextBase64", cw),
				encryptionAlgorithm: xw(n.encryptionAlgorithm),
				encryptionContext: ww(n.encryptionContext)
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
		return kw(e, async () => {
			let n = await bw(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: Tw(n.ciphertextBlobBase64, "ciphertextBlobBase64", lw),
				encryptionAlgorithm: xw(n.encryptionAlgorithm),
				encryptionContext: ww(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of bC) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
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
		return kw(e, async () => {
			let n = await bw(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: Tw(n.messageBase64, "messageBase64", cw),
				signingAlgorithm: Sw(n.signingAlgorithm)
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
		return kw(e, async () => {
			let n = await bw(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: Tw(n.messageBase64, "messageBase64", cw),
				signature: Tw(n.signatureBase64, "signatureBase64", lw),
				keyVersionId: Cw(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: Sw(n.signingAlgorithm)
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
			let i = await yw(e), a = await r(e).createResource(t, n, { values: i });
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
			let i = vw(await yw(e));
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
var pw = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], mw = 100, hw = 100;
function gw(e) {
	if (!Array.isArray(e) || e.length === 0) throw new G("messages must contain at least one entry");
	if (e.length > hw) throw new G(`messages must contain at most ${hw} entries`);
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
function _w(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new G("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!pw.includes(n)) throw new G(`cursorType must be one of ${pw.join(", ")}`);
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
		if (!Number.isInteger(t) || t < 1 || t > mw) throw new G(`limit must be an integer between 1 and ${mw}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function vw(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new G(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function yw(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new G("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof G ? e : new G("Request body must be valid JSON");
	}
}
var X = class extends G {};
async function bw(e) {
	try {
		return await yw(e);
	} catch (e) {
		throw e instanceof G ? new X(e.message) : e;
	}
}
function xw(e) {
	if (typeof e != "string" || !ow.has(e)) throw new X("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function Sw(e) {
	if (typeof e != "string" || !sw.has(e)) throw new X("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function Cw(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new X(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function ww(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new X("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new X("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function Tw(e, t, n) {
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
function Ew(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: FC(e.req.query("limit"))
	};
}
function Dw(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new G("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new G("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: FC(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function Ow(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function Q(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = kC(t, $C);
		return e.json(r, n);
	}
}
async function kw(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = kC(t, $C);
		if (t instanceof X) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function Aw(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
fw();
// src/registry/CloudAdapterRegistry.ts
var jw = class {
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
}, Mw = async () => {}, Nw = {
	aws: Mw,
	azure: Mw,
	gcp: Mw,
	oci: Mw
};
function Pw() {
	return null;
}
// src/service/CloudProxyService.ts
var Fw = 5e3, Iw = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = Nw, n = iw(), r = null) {
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
		return Promise.all(RC.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? zC(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: BC(t, e),
				docsUrl: WC(t, e),
				availability: a,
				reason: r.reason ?? Lw(a, e, o),
				route: VC(t, e),
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
			endpoint: Pw(e),
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
		if (r && Date.now() - r.at < Fw) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = Pw(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = kC(r, $C);
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
		if (t && Date.now() - t.at < Fw) return t.value;
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
		let i = r.emptyBucket.bind(r), a = Rw(e, t);
		if (this.emptying.has(a)) throw new SC(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new SC(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = Rw(e, t);
		if (this.emptying.has(r)) throw new SC(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
function Lw(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function Rw(e, t) {
	return JSON.stringify([e, t]);
}
// src/cloud-spi/sageMakerSchema.ts
var zw = [
	{
		name: "list",
		label: "List SageMaker AI resources",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "create",
		label: "Create SageMaker AI resource",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "delete",
		label: "Delete SageMaker AI resource",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "inspect",
		label: "Inspect SageMaker AI resource",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "update",
		label: "Update endpoint",
		enabled: !1,
		status: "coming_soon",
		reason: "Floci supports UpdateEndpoint, but the generic Cloud Explorer update form supports only one resource shape at a time.",
		runtimeRequired: !0
	},
	{
		name: "stop",
		label: "Stop training job",
		enabled: !1,
		status: "coming_soon",
		reason: "Floci supports StopTrainingJob, but the generic resource action route is not wired for lifecycle verbs yet.",
		runtimeRequired: !0
	},
	{
		name: "invoke",
		label: "Invoke endpoint",
		enabled: !1,
		status: "coming_soon",
		reason: "Floci exposes SageMaker AI Runtime invocations, but the generic invoke panel is currently Lambda-specific.",
		runtimeRequired: !0
	},
	{
		name: "updateTags",
		label: "Manage tags",
		enabled: !1,
		status: "coming_soon",
		reason: "Floci supports AddTags, ListTags, and DeleteTags, but the Cloud Explorer tag editor is not generic yet.",
		runtimeRequired: !0
	}
], Bw = [
	{
		name: "resourceType",
		label: "Resource Type",
		type: "select",
		required: !0,
		defaultValue: "model",
		description: "Choose which SageMaker AI API create operation to call.",
		options: [
			{
				label: "Model",
				value: "model"
			},
			{
				label: "Endpoint config",
				value: "endpoint-config"
			},
			{
				label: "Endpoint",
				value: "endpoint"
			},
			{
				label: "Training job",
				value: "training-job"
			}
		]
	},
	{
		name: "modelName",
		label: "Model Name",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "model"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "model"
		},
		group: "Model",
		description: "Required when Resource Type is Model."
	},
	{
		name: "executionRoleArn",
		label: "Execution Role ARN",
		type: "text",
		required: !1,
		visibleWhen: {
			field: "resourceType",
			equals: "model"
		},
		group: "Model",
		description: "Optional for Floci, but most SDK examples include one."
	},
	{
		name: "primaryContainer",
		label: "Primary Container JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "model"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "model"
		},
		group: "Model",
		span: !0,
		defaultValue: "{\"Image\":\"example-image\"}",
		description: "CreateModel PrimaryContainer as JSON, for example {\"Image\":\"my-image\",\"ModelDataUrl\":\"s3://bucket/model.tar.gz\"}."
	},
	{
		name: "endpointConfigName",
		label: "Endpoint Config Name",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "endpoint-config"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "endpoint-config"
		},
		group: "Endpoint config",
		description: "Required when Resource Type is Endpoint config."
	},
	{
		name: "productionVariants",
		label: "Production Variants JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "endpoint-config"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "endpoint-config"
		},
		group: "Endpoint config",
		span: !0,
		defaultValue: "[{\"VariantName\":\"AllTraffic\",\"ModelName\":\"model-name\",\"InitialInstanceCount\":1,\"InstanceType\":\"ml.t2.medium\"}]",
		description: "CreateEndpointConfig ProductionVariants array as JSON."
	},
	{
		name: "endpointName",
		label: "Endpoint Name",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "endpoint"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "endpoint"
		},
		group: "Endpoint",
		description: "Required when Resource Type is Endpoint."
	},
	{
		name: "endpointConfigNameForEndpoint",
		label: "Endpoint Config Name",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "endpoint"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "endpoint"
		},
		group: "Endpoint",
		description: "Existing endpoint config to attach to the endpoint."
	},
	{
		name: "trainingJobName",
		label: "Training Job Name",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		description: "Required when Resource Type is Training job."
	},
	{
		name: "algorithmSpecification",
		label: "Algorithm Specification JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		span: !0,
		defaultValue: "{\"TrainingImage\":\"example-image\",\"TrainingInputMode\":\"File\"}",
		description: "CreateTrainingJob AlgorithmSpecification as JSON."
	},
	{
		name: "roleArn",
		label: "Role ARN",
		type: "text",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job"
	},
	{
		name: "outputDataConfig",
		label: "Output Data Config JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		span: !0,
		defaultValue: "{\"S3OutputPath\":\"s3://bucket/output\"}"
	},
	{
		name: "resourceConfig",
		label: "Resource Config JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		span: !0,
		defaultValue: "{\"InstanceType\":\"ml.m5.large\",\"InstanceCount\":1,\"VolumeSizeInGB\":1}"
	},
	{
		name: "stoppingCondition",
		label: "Stopping Condition JSON",
		type: "textarea",
		required: !1,
		requiredWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		span: !0,
		defaultValue: "{\"MaxRuntimeInSeconds\":3600}"
	},
	{
		name: "inputDataConfig",
		label: "Input Data Config JSON",
		type: "textarea",
		required: !1,
		visibleWhen: {
			field: "resourceType",
			equals: "training-job"
		},
		group: "Training job",
		span: !0,
		description: "Optional CreateTrainingJob InputDataConfig array as JSON."
	}
], Vw = [
	{
		name: "name",
		label: "Name"
	},
	{
		name: "kind",
		label: "Kind",
		path: "metadata.kind",
		format: "badge"
	},
	{
		name: "status",
		label: "Status",
		format: "badge",
		emptyText: "—"
	},
	{
		name: "createdAt",
		label: "Created",
		format: "relative",
		emptyText: "—"
	},
	{
		name: "arn",
		label: "ARN",
		path: "metadata.arn",
		emptyText: "—"
	}
];
function Hw() {
	return {
		cloud: "aws",
		service: "sagemaker",
		displayName: "SageMaker AI",
		fields: Bw,
		actions: [
			"list",
			"create",
			"delete",
			"inspect"
		],
		capabilities: { resourceActions: zw },
		filters: [{
			name: "search",
			label: "Search",
			type: "text",
			required: !1
		}],
		columns: Vw
	};
}
// src/adapter-aws/AwsSageMakerAdapter.ts
var Uw = class {
	sagemaker;
	cloud = "aws";
	service = "sagemaker";
	constructor(e) {
		this.sagemaker = e;
	}
	schema() {
		return Hw();
	}
	async list(e = {}) {
		let [t, n, r, i] = await Promise.all([
			this.listModels(),
			this.listEndpointConfigs(),
			this.listEndpoints(),
			this.listTrainingJobs()
		]);
		return oT([
			...t,
			...n,
			...r,
			...i
		], e.search);
	}
	async get(e) {
		let { kind: t, name: n } = Yw(e);
		try {
			switch (t) {
				case "model": return Ww(await this.sagemaker.send(new iS({ ModelName: n })));
				case "endpoint-config": return Gw(await this.sagemaker.send(new rS({ EndpointConfigName: n })));
				case "endpoint": return Kw(await this.sagemaker.send(new nS({ EndpointName: n })));
				case "training-job": return qw(await this.sagemaker.send(new aS({ TrainingJobName: n })));
			}
		} catch (e) {
			if (sT(e)) return null;
			throw e;
		}
	}
	async create(e) {
		let t = Zw(e.values.resourceType, "resourceType");
		switch (t) {
			case "model": return this.createModel(e);
			case "endpoint-config": return this.createEndpointConfig(e);
			case "endpoint": return this.createEndpoint(e);
			case "training-job": return this.createTrainingJob(e);
			default: throw new G(`Unsupported SageMaker AI resourceType: ${t}`);
		}
	}
	async delete(e) {
		let { kind: t, name: n } = Yw(e);
		switch (t) {
			case "model":
				await this.sagemaker.send(new tS({ ModelName: n }));
				return;
			case "endpoint-config":
				await this.sagemaker.send(new eS({ EndpointConfigName: n }));
				return;
			case "endpoint":
				await this.sagemaker.send(new $x({ EndpointName: n }));
				return;
			case "training-job": throw new G("SageMaker AI training jobs cannot be deleted. Use StopTrainingJob from an SDK or CLI for running jobs.");
		}
	}
	async health() {
		await this.sagemaker.send(new cS({ MaxResults: 1 }));
	}
	async listModels() {
		let e = [], t;
		do {
			let n = await this.sagemaker.send(new cS({
				NextToken: t,
				MaxResults: 100
			}));
			e.push(...n.Models ?? []), t = n.NextToken;
		} while (t);
		return e.map(Ww);
	}
	async listEndpointConfigs() {
		let e = [], t;
		do {
			let n = await this.sagemaker.send(new oS({
				NextToken: t,
				MaxResults: 100
			}));
			e.push(...n.EndpointConfigs ?? []), t = n.NextToken;
		} while (t);
		return e.map(Gw);
	}
	async listEndpoints() {
		let e = [], t;
		do {
			let n = await this.sagemaker.send(new sS({
				NextToken: t,
				MaxResults: 100
			}));
			e.push(...n.Endpoints ?? []), t = n.NextToken;
		} while (t);
		return e.map(Kw);
	}
	async listTrainingJobs() {
		let e = [], t;
		do {
			let n = await this.sagemaker.send(new lS({
				NextToken: t,
				MaxResults: 100
			}));
			e.push(...n.TrainingJobSummaries ?? []), t = n.NextToken;
		} while (t);
		return e.map(qw);
	}
	async createModel(e) {
		let t = Zw(e.values.modelName, "modelName"), n = {
			ModelName: t,
			PrimaryContainer: $w(e.values.primaryContainer, "primaryContainer")
		}, r = Qw(e.values.executionRoleArn);
		return r && (n.ExecutionRoleArn = r), await this.sagemaker.send(new Zx(n)), await this.get($("model", t)) ?? Jw("model", t);
	}
	async createEndpointConfig(e) {
		let t = Zw(e.values.endpointConfigName, "endpointConfigName"), n = {
			EndpointConfigName: t,
			ProductionVariants: eT(e.values.productionVariants, "productionVariants")
		};
		return await this.sagemaker.send(new Xx(n)), await this.get($("endpoint-config", t)) ?? Jw("endpoint-config", t);
	}
	async createEndpoint(e) {
		let t = Zw(e.values.endpointName, "endpointName"), n = {
			EndpointName: t,
			EndpointConfigName: Zw(e.values.endpointConfigNameForEndpoint, "endpointConfigNameForEndpoint")
		};
		return await this.sagemaker.send(new Yx(n)), await this.get($("endpoint", t)) ?? Jw("endpoint", t);
	}
	async createTrainingJob(e) {
		let t = Zw(e.values.trainingJobName, "trainingJobName"), n = {
			TrainingJobName: t,
			AlgorithmSpecification: $w(e.values.algorithmSpecification, "algorithmSpecification"),
			RoleArn: Zw(e.values.roleArn, "roleArn"),
			OutputDataConfig: $w(e.values.outputDataConfig, "outputDataConfig"),
			ResourceConfig: $w(e.values.resourceConfig, "resourceConfig"),
			StoppingCondition: $w(e.values.stoppingCondition, "stoppingCondition")
		}, r = tT(e.values.inputDataConfig, "inputDataConfig");
		return r && (n.InputDataConfig = r), await this.sagemaker.send(new Qx(n)), await this.get($("training-job", t)) ?? Jw("training-job", t);
	}
};
function Ww(e) {
	let t = e.ModelName ?? "";
	return {
		id: $("model", t),
		name: t,
		cloud: "aws",
		service: "sagemaker",
		type: "sagemaker-model",
		region: null,
		createdAt: rT(e.CreationTime),
		status: null,
		metadata: {
			kind: "Model",
			arn: e.ModelArn ?? null,
			primaryContainer: "PrimaryContainer" in e ? aT(e.PrimaryContainer) : null,
			containers: "Containers" in e ? iT(e.Containers) : null,
			executionRoleArn: "ExecutionRoleArn" in e ? e.ExecutionRoleArn ?? null : null
		}
	};
}
function Gw(e) {
	let t = e.EndpointConfigName ?? "";
	return {
		id: $("endpoint-config", t),
		name: t,
		cloud: "aws",
		service: "sagemaker",
		type: "sagemaker-endpoint-config",
		region: null,
		createdAt: rT(e.CreationTime),
		status: null,
		metadata: {
			kind: "Endpoint config",
			arn: e.EndpointConfigArn ?? null,
			productionVariants: "ProductionVariants" in e ? e.ProductionVariants ?? null : null
		}
	};
}
function Kw(e) {
	let t = e.EndpointName ?? "";
	return {
		id: $("endpoint", t),
		name: t,
		cloud: "aws",
		service: "sagemaker",
		type: "sagemaker-endpoint",
		region: null,
		createdAt: rT(e.CreationTime),
		status: e.EndpointStatus ?? null,
		metadata: {
			kind: "Endpoint",
			arn: e.EndpointArn ?? null,
			endpointConfigName: "EndpointConfigName" in e ? e.EndpointConfigName ?? null : null,
			lastModifiedAt: rT(e.LastModifiedTime),
			failureReason: "FailureReason" in e ? e.FailureReason ?? null : null
		}
	};
}
function qw(e) {
	let t = e.TrainingJobName ?? "";
	return {
		id: $("training-job", t),
		name: t,
		cloud: "aws",
		service: "sagemaker",
		type: "sagemaker-training-job",
		region: null,
		createdAt: rT(e.CreationTime),
		status: e.TrainingJobStatus ?? null,
		metadata: {
			kind: "Training job",
			arn: e.TrainingJobArn ?? null,
			trainingStartTime: "TrainingStartTime" in e ? rT(e.TrainingStartTime) : null,
			trainingEndTime: "TrainingEndTime" in e ? rT(e.TrainingEndTime) : null,
			failureReason: "FailureReason" in e ? e.FailureReason ?? null : null,
			modelArtifacts: "ModelArtifacts" in e ? e.ModelArtifacts ?? null : null
		}
	};
}
function Jw(e, t) {
	return {
		id: $(e, t),
		name: t,
		cloud: "aws",
		service: "sagemaker",
		type: `sagemaker-${e}`,
		region: null,
		createdAt: null,
		status: null,
		metadata: {
			kind: Xw(e),
			arn: null
		}
	};
}
function $(e, t) {
	return `${e}:${t}`;
}
function Yw(e) {
	let t = e.indexOf(":");
	if (t < 1) throw new G("SageMaker AI resource id must be kind:name");
	let n = e.slice(0, t), r = e.slice(t + 1);
	if (![
		"model",
		"endpoint-config",
		"endpoint",
		"training-job"
	].includes(n) || !r) throw new G("SageMaker AI resource id must be kind:name");
	return {
		kind: n,
		name: r
	};
}
function Xw(e) {
	return {
		model: "Model",
		"endpoint-config": "Endpoint config",
		endpoint: "Endpoint",
		"training-job": "Training job"
	}[e];
}
function Zw(e, t) {
	let n = Qw(e);
	if (!n) throw new G(`${t} is required`);
	return n;
}
function Qw(e) {
	return typeof e == "string" ? e.trim() : "";
}
function $w(e, t) {
	let n = nT(e, t);
	if (!n || typeof n != "object" || Array.isArray(n)) throw new G(`${t} must be a JSON object`);
	return n;
}
function eT(e, t) {
	let n = nT(e, t);
	if (!Array.isArray(n)) throw new G(`${t} must be a JSON array`);
	return n;
}
function tT(e, t) {
	if (!(e == null || typeof e == "string" && !e.trim())) return eT(e, t);
}
function nT(e, t) {
	if (typeof e != "string") return e;
	try {
		return JSON.parse(e);
	} catch {
		throw new G(`${t} must be valid JSON`);
	}
}
function rT(e) {
	return e ? e instanceof Date ? e.toISOString() : e : null;
}
function iT(e) {
	return Array.isArray(e) ? e.map(aT) : null;
}
function aT(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e ?? null;
	let t = { ...e };
	return t.Environment && typeof t.Environment == "object" && !Array.isArray(t.Environment) && (t.Environment = Object.fromEntries(Object.keys(t.Environment).map((e) => [e, "[redacted]"]))), t;
}
function oT(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n) || String(e.metadata.kind ?? "").toLowerCase().includes(n)) : e;
}
function sT(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return t.name === "ResourceNotFoundException" || t.$metadata?.httpStatusCode === 404 || t.name === "ValidationException" && /could not find/i.test(t.message ?? "");
}
var cT = fw(new Iw(new jw([new Uw(new Jx({
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
async function lT(e) {
	return cT.fetch(e);
}
export { lT as handleSageMakerRequest };
