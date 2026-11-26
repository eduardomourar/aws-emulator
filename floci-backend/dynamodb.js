// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), c = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, l = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, u = (n, r, o) => (o = n == null ? {} : e(i(n)), l(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), d = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, f = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, p = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => m[t.step] - m[e.step] || h[t.priority || "normal"] - h[e.priority || "normal"]), a = (n) => {
		let i = !1, a = (e) => {
			let t = d(e.name, e.aliases);
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
				for (let t of d(e.name, e.aliases)) r.delete(t);
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
			for (let e of d(t.name, t.aliases)) o[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of d(t.name, t.aliases)) o[e] = t;
			a.push(t);
		}), a.forEach((e) => {
			if (e.toMiddleware) {
				let t = o[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${f(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
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
			}, c = d(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${f(i, o)}'`);
					for (let t of c) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== s.step || s.priority !== r.priority) throw Error(`"${f(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${f(i, o)}" middleware with ${s.priority} priority in ${s.step} step.`);
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
			}, c = d(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${f(i, o)}'`);
					for (let e of c) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== s.toMiddleware || r.relation !== s.relation) throw Error(`"${f(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${f(i, o)}" middleware ${s.relation} "${s.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of c) r.add(e);
			}
			t.push(s);
		},
		clone: () => s(p()),
		use: (e) => {
			e.applyToStack(u);
		},
		remove: (e) => typeof e == "string" ? a(e) : o(e),
		removeByTag: (n) => {
			let i = !1, a = (e) => {
				let { tags: t, name: a, aliases: o } = e;
				if (t && t.includes(n)) {
					let e = d(a, o);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(a), t = t.filter(a), i;
		},
		concat: (e) => {
			let t = s(p());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: s,
		identify: () => l(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return f(e.name, e.aliases) + " - " + t;
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
}, m = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, h = {
	high: 3,
	normal: 2,
	low: 1
}, g, ee = o((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(g ||= {});
})), _, te = o((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(_ ||= {});
})), ne = o((() => {
	te();
})), re, ie = o((() => {
	re = "__smithy_context";
})), ae = o((() => {
	ee(), ne(), ie();
})), oe, se = o((() => {
	ae(), oe = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function v(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var ce = o((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function le(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var y, ue = o((() => {
	y = class e {
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
			return n.query &&= le(n.query), n;
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
})), de, fe = o((() => {
	de = class {
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
})), pe, me, he = o((() => {
	pe = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), me = (e, t = !1) => {
		if (!t) return pe.test(e);
		let n = e.split(".");
		for (let e of n) if (!me(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function ge(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var _e = o((() => {})), b, ve = o((() => {
	b = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function ye(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var be = o((() => {})), xe, Se = o((() => {
	be(), xe = (e) => {
		if (typeof e == "string") return xe(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = ye(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), Ce, we = o((() => {
	ce(), Se(), Ce = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = xe(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) v(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return xe(e);
	};
})), x = o((() => {
	se(), ce(), ue(), fe(), he(), _e(), ve(), Se(), we();
})), Te = (e) => () => Promise.reject(e), Ee = class {
	config;
	middlewareStack = p();
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
}, De, Oe = o((() => {
	De = (e) => typeof e == "function" ? e() : e;
})), ke, Ae = o((() => {
	ke = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), je, Me, Ne = o((() => {
	x(), Ae(), je = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = oe(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(ke(o, s, c, l, u), {
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
					if (de.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Me(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Me(/^x-[\w-]+-id-2$/, r),
							cfId: Me(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Me = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), Pe, Fe = o((() => {
	x(), Ae(), Pe = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = oe(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => Ce(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(ke(a, o, s, c, l), r.input, {
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
function Ie(e) {
	return { applyToStack: (t) => {
		t.add(Pe(e), Re), t.add(je(e), Le), e.protocol.setSerdeContext(e);
	} };
}
var Le, Re, ze = o((() => {
	Ne(), Fe(), Le = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Re = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function Be(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Ve[e]) return Ve[e];
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
	return Ve[e] = t;
}
var Ve, He = o((() => {
	Ve = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function Ue(e, t) {
	return e instanceof S ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new S(e, t);
}
var We, Ge, Ke, S, qe, Je, Ye = o((() => {
	Oe(), He(), We = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, Ge = [], Ke = {}, S = class e {
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
			for (this._isMemberSchema = !1; qe(i);) r.push(i[1]), i = i[0], a = De(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, Be(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = De(a), Je(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (Ge[t]) return Ge[t];
			} else if (typeof t == "string") {
				if (Ke[t]) return Ke[t];
			} else if (n && t[We.ns]) return t[We.ns];
			let r = De(t);
			if (r instanceof e) return r;
			if (qe(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), Be(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[We.ns] = i : typeof r == "string" ? Ke[r] = i : typeof r == "number" ? Ge[r] = i : i;
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
			return Be(this.memberTraits);
		}
		getOwnTraits() {
			return Be(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return Ue([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return Ue([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return Ue(qe(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return Ue([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[We.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = Ue([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[We.it] = n;
			}
		}
	}, qe = (e) => Array.isArray(e) && e.length === 2, Je = (e) => Array.isArray(e) && e.length >= 5;
})), Xe, Ze = o((() => {
	Xe = class e {
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
})), C = o((() => {
	Oe(), ze(), Ae(), Ye(), He(), Ze();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
C();
var Qe = "***SensitiveInformation***";
function $e(e, t) {
	if (t == null) return t;
	let n = S.of(e);
	if (n.getMergedTraits().sensitive) return Qe;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return Qe;
		if (Array.isArray(t)) return t.map((t) => $e(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return Qe;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, $e(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = $e(i, e[t]));
		return r;
	}
	return t;
}
ae(), C();
var et = Symbol.for("@smithy/op-event-stream"), tt = class {
	middlewareStack = p();
	schema;
	static classBuilder() {
		return new nt();
	}
	resolveMiddlewareWithContext(e, t, n, { middlewareFn: r, clientName: i, commandName: a, inputFilterSensitiveLog: o, outputFilterSensitiveLog: s, smithyContext: c, additionalContext: l, CommandCtor: u }) {
		for (let i of r.bind(this)(u, e, t, n)) this.middlewareStack.use(i);
		let d = e.concat(this.middlewareStack), { logger: f } = t, p = l[re], m = {
			logger: f,
			clientName: i,
			commandName: a,
			inputFilterSensitiveLog: o,
			outputFilterSensitiveLog: s,
			...l,
			[re]: {
				...p,
				commandInstance: this,
				...c,
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
			}
		}, { requestHandler: h } = t, g = n ?? {};
		g.metricsRecorder && (g = { ...g }, delete g.metricsRecorder);
		let ee, _ = this.schema, te = _?.[et];
		if (te !== void 0) ee = te;
		else if (_ && Array.isArray(_) && _[0] === 9) {
			let [, , , , e, t] = _;
			ee = _[et] = !!(S.of(e).getEventStreamMember() || S.of(t).getEventStreamMember());
		}
		return ee && (g = {
			isEventStream: ee,
			...g
		}), d.resolve((e) => h.handle(e.request, g), m);
	}
}, nt = class {
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
		return t = class extends tt {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? $e.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? $e.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, rt = class e extends Error {
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
}, it = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), at = (e) => {
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
x(), ae();
var ot = Object.values(_), st = (e) => {
	let t = [];
	for (let n in _) {
		if (!v(_, n)) continue;
		let r = _[n];
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
			ot.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, ct = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		ot.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, lt = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), ut = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, dt = (e) => Object.assign(st(e), lt(e)), ft = (e) => Object.assign(ct(e), ut(e)), pt = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function mt(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return tt.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
var ht = [
	"disabled",
	"preferred",
	"required"
];
function gt(e) {
	return ht.includes(e);
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/account-id-endpoint/AccountIdEndpointModeConfigResolver.js
ve();
var _t = (e) => {
	let { accountIdEndpointMode: t } = e, n = b(t ?? "preferred");
	return Object.assign(e, { accountIdEndpointMode: async () => {
		let e = await n();
		if (!gt(e)) throw Error(`Invalid value for accountIdEndpointMode: ${e}. Valid values are: "required", "preferred", "disabled".`);
		return e;
	} });
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function vt(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/isStreamingPayload/isStreamingPayload.browser.js
var yt = (e) => e?.body instanceof ReadableStream, bt, xt, St, Ct = o((() => {
	bt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", xt = Object.entries(bt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), St = bt.split("");
})), wt, Tt = o((() => {
	Ct(), wt = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in xt)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= xt[e[r]] << (a - r) * 6, i += 6;
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
})), Et, Dt = o((() => {
	Et = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function Ot(e) {
	let t;
	t = typeof e == "string" ? Et(e) : e;
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
			i += St[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var kt = o((() => {
	Dt(), Ct();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function At(e, t, n, r) {
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
var jt = o((() => {})), Mt, Nt = o((() => {
	Mt = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Pt(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, w[t[0]] + w[t[1]] + w[t[2]] + w[t[3]] + "-" + w[t[4]] + w[t[5]] + "-" + w[t[6]] + w[t[7]] + "-" + w[t[8]] + w[t[9]] + "-" + w[t[10]] + w[t[11]] + w[t[12]] + w[t[13]] + w[t[14]] + w[t[15]];
	};
}
var w, Ft = o((() => {
	w = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt = o((() => {
	It = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && Zt.warn(Xt(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, Lt = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Rt = (e) => {
		let t = It(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > Lt) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, zt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Bt = (e) => Ht(e, 16), Vt = (e) => Ht(e, 8), Ht = (e, t) => {
		let n = zt(e);
		if (n !== void 0 && Ut(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Ut = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Wt = (e) => It(typeof e == "string" ? qt(e) : e), Gt = (e) => Rt(typeof e == "string" ? qt(e) : e), Kt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, qt = (e) => {
		let t = e.match(Kt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, Jt = (e) => Bt(typeof e == "string" ? qt(e) : e), Yt = (e) => Vt(typeof e == "string" ? qt(e) : e), Xt = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), Zt = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function $t(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${en[r]}, ${c} ${tn[n]} ${t} ${l}:${u}:${d} GMT`;
}
var en, tn, nn, rn, an, on, sn, cn, ln, un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn = o((() => {
	Qt(), en = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], tn = [
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
	], nn = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), rn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
		let t = nn.exec(e);
		if (!t) throw TypeError("Invalid RFC-3339 date-time value");
		let [n, r, i, a, o, s, c, l, u] = t, d = Jt(xn(r)), f = vn(i, "month", 1, 12), p = vn(a, "day", 1, 31), m = un(d, f, p, {
			hours: o,
			minutes: s,
			seconds: c,
			fractionalMilliseconds: l
		});
		return u.toUpperCase() != "Z" && m.setTime(m.getTime() - bn(u)), m;
	}, an = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), on = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), sn = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), cn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = an.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return un(Jt(xn(i)), mn(r), vn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = on.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return pn(un(dn(i), mn(r), vn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = sn.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return un(Jt(xn(c)), mn(n), vn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, ln = (e) => {
		if (e == null) return;
		let t;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") t = Wt(e);
		else if (typeof e == "object" && e.tag === 1) t = e.value;
		else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(t) || t === Infinity || t === -Infinity) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(t * 1e3));
	}, un = (e, t, n, r) => {
		let i = t - 1;
		return gn(e, i, n), new Date(Date.UTC(e, i, n, vn(r.hours, "hour", 0, 23), vn(r.minutes, "minute", 0, 59), vn(r.seconds, "seconds", 0, 60), yn(r.fractionalMilliseconds)));
	}, dn = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + Jt(xn(e));
		return n < t ? n + 100 : n;
	}, fn = 15768e8, pn = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > fn ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, mn = (e) => {
		let t = tn.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, hn = [
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
	], gn = (e, t, n) => {
		let r = hn[t];
		if (t === 1 && _n(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${tn[t]} in ${e}: ${n}`);
	}, _n = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), vn = (e, t, n, r) => {
		let i = Yt(xn(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, yn = (e) => e == null ? 0 : Gt("0." + e) * 1e3, bn = (e) => {
		let t = e[0], n = 1;
		if (t == "+") n = 1;
		else if (t == "-") n = -1;
		else throw TypeError(`Offset direction, ${t}, must be "+" or "-"`);
		let r = Number(e.substring(1, 3)), i = Number(e.substring(4, 6));
		return n * (r * 60 + i) * 60 * 1e3;
	}, xn = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), Cn, wn = o((() => {
	Cn = function(e) {
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
	}, Cn.from = (e) => e && typeof e == "object" && (e instanceof Cn || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? Cn(String(e)) : Cn(JSON.stringify(e)), Cn.fromObject = Cn.from;
})), Tn, T, En = o((() => {
	Tn = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, T = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !Tn.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && Tn.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function Dn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in kn) t[n / 2] = kn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function E(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += On[e[n]];
	return t;
}
var On, kn, An = o((() => {
	On = {}, kn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), On[e] = t, kn[t] = e;
	}
})), jn, Mn, Nn = o((() => {
	jn = typeof TextEncoder == "function" ? new TextEncoder() : null, Mn = (e) => {
		if (typeof e == "string") {
			if (jn) return jn.encode(e).byteLength;
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
})), Pn, Fn = o((() => {
	Dt(), Pn = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? Et(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function In(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Ln = o((() => {})), Rn, zn = o((() => {
	Rn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), Bn, Vn = o((() => {
	Bn = async (e) => void 0;
})), Hn, Un, Wn, Gn, Kn, qn, Jn = o((() => {
	Hn = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), qn(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!Kn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Un = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Wn = /(\d+\.){3}\d+/, Gn = /\.\./, Kn = (e) => Un.test(e) && !Wn.test(e) && !Gn.test(e), qn = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Yn = o((() => {
	Jn();
})), Xn, Zn = o((() => {
	Xn = (e, t, n, r = !1) => {
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
})), Qn = o((() => {
	x();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function $n(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(Ce(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await er(t, n, r);
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
var er, tr = o((() => {
	Yn(), Zn(), Qn(), er = async (e, t, n) => {
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
				r[t] = await Xn(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Hn(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function nr(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function rr(e) {
	let t = $n(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && nr(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = oe(i)?.selectedHttpAuthScheme?.httpAuthOption;
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
var ir = o((() => {
	x(), tr();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function ar(e) {
	let t = rr(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), sr);
	} });
}
var or, sr, cr = o((() => {
	ir(), or = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, sr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: or.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function lr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => Ce(await b(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: b(i ?? !1),
			useFipsEndpoint: b(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var ur = o((() => {
	x(), Qn();
})), dr, fr = o((() => {
	dr = class e {
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
})), pr, mr = o((() => {
	pr = class {
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
})), D, hr = o((() => {
	D = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), gr = o((() => {
	hr();
})), _r, vr = o((() => {
	_r = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function yr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${yr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(yr).join(", ")})` : JSON.stringify(e, null, 2);
}
var br = o((() => {})), xr = o((() => {
	vr(), br();
})), Sr, Cr = o((() => {
	Sr = {};
})), wr, Tr = o((() => {
	wr = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function Er(...e) {
	for (let t of e) if (t != null) return t;
}
var Dr = o((() => {})), Or, kr = o((() => {
	gr(), Or = (e) => {
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
})), Ar, jr = o((() => {
	gr(), kr(), Ar = (e, t) => Or(t).reduce((n, r) => {
		if (typeof n != "object") throw new D(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Mr, Nr = o((() => {
	Mr = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Pr(e, t, n) {
	return e ? t : n;
}
var Fr = o((() => {})), Ir, Lr = o((() => {
	Ir = (e) => !e;
})), Rr, zr, Br = o((() => {
	Rr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), zr = (e) => Rr.test(e) || e.startsWith("[") && e.endsWith("]");
})), Vr, Hr, Ur = o((() => {
	ae(), Br(), Vr = {
		[g.HTTP]: 80,
		[g.HTTPS]: 443
	}, Hr = (e) => {
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
		if (!Object.values(g).includes(c)) return null;
		let l = zr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Vr[c]}`) || typeof e == "string" && e.includes(`${r}:${Vr[c]}`) ? `:${Vr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Wr(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var Gr = o((() => {})), Kr, qr = o((() => {
	Kr = (e, t) => e === t;
})), Jr, Yr = o((() => {
	Jr = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Xr, Zr = o((() => {
	Xr = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Qr = o((() => {
	Tr(), Dr(), jr(), Nr(), x(), Fr(), Lr(), Ur(), Gr(), qr(), Yr(), Zr();
})), $r, ei = o((() => {
	Qr(), $r = {
		booleanEquals: wr,
		coalesce: Er,
		getAttr: Ar,
		isSet: Mr,
		isValidHostLabel: me,
		ite: Pr,
		not: Ir,
		parseURL: Hr,
		split: Wr,
		stringEquals: Kr,
		substring: Jr,
		uriEncode: Xr
	};
})), ti, ni = o((() => {
	Qr(), ti = (e, t) => {
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
				n.push(Ar(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), ri, ii = o((() => {
	ri = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), ai, oi, si, ci = o((() => {
	gr(), Cr(), ei(), ni(), ii(), ai = (e, t, n) => {
		if (typeof e == "string") return ti(e, n);
		if (e.fn) return si.callFunction(e, n);
		if (e.ref) return ri(e, n);
		throw new D(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, oi = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = si.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = Sr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = $r[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, si = {
		evaluateExpression: ai,
		callFunction: oi
	};
})), li = o((() => {
	ci();
})), ui, di = o((() => {
	xr(), gr(), li(), ui = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new D(`'${n}' is already defined in Reference Record.`);
		let r = oi(e, t);
		t.logger?.debug?.(`${_r} evaluateCondition: ${yr(e)} = ${yr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), fi, pi = o((() => {
	gr(), ci(), fi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = ai(e, "Header value entry", t);
		if (typeof r != "string") throw new D(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), mi, hi, gi, _i = o((() => {
	gr(), ni(), mi = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = gi.getEndpointProperty(r, t), e), {}), hi = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => hi(e, t));
		switch (typeof e) {
			case "string": return ti(e, t);
			case "object":
				if (e === null) throw new D(`Unexpected endpoint property: ${e}`);
				return gi.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new D(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, gi = {
		getEndpointProperty: hi,
		getEndpointProperties: mi
	};
})), vi, yi = o((() => {
	gr(), ci(), vi = (e, t) => {
		let n = ai(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new D(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), bi, xi, Si = o((() => {
	gr(), di(), ci(), pi(), _i(), yi(), bi = 1e8, xi = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < bi;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = ui({
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
		if (o >= bi) {
			let e = i[o - bi];
			if (e[0] === -1) {
				let [, t] = e;
				throw new D(ai(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: vi(t, c),
				properties: mi(n, c),
				headers: fi(r ?? {}, c)
			};
		}
		throw new D("No matching endpoint.");
	};
})), Ci, wi, Ti = o((() => {
	Vn(), tr(), ir(), cr(), ur(), x(), fr(), mr(), Si(), Br(), Cr(), xr(), gr(), di(), pi(), _i(), yi(), ci(), Qn(), Ci = lr(Bn), rr(Bn), wi = ar(Bn);
})), Ei, Di = o((() => {
	Ei = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Oi(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function ki(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return In(t, r);
}
var Ai, ji = o((() => {
	Ln(), Di(), Ai = async (e) => Ei(e) ? Oi(e) : ki(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Mi(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Ni = o((() => {})), Pi, Fi, Ii, Li, O = o((() => {
	Tt(), kt(), jt(), Dt(), Nt(), Ft(), Sn(), wn(), Qt(), En(), An(), Nn(), Fn(), Ln(), zn(), x(), Ti(), Di(), ji(), Ni(), Pi = class extends At(Mt, Et, Ot, wt) {}, Fi = (e) => crypto.getRandomValues(e), Ii = Pt(Fi), Li = Ii;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
O();
var Ri = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return Pi.mutate(e);
	if (!e) return Pi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return Pi.mutate(await n);
}, zi = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Bi, Vi, Hi, Ui = o((() => {
	Bi = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Bi[e] = t >>> 0;
	}
	Vi = 4294967295, Hi = class {
		digestLength = 4;
		checksum = Vi;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Bi[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Vi) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Vi;
		}
	};
})), k, Wi, Gi, Ki, qi, Ji, Yi = o((() => {
	O(), k = 64, Wi = 32, Gi = 2 ** 53 - 1, Ki = class e {
		digestLength = Wi;
		state = Int32Array.from(qi);
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
			let t = Pn(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > Gi) throw Error("Cannot hash more than 2^53 - 1 bits");
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
			this.state = Int32Array.from(qi), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % k >= 56) {
				for (let e = n; e < k; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(Wi);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = Pn(t);
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
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Ji[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, qi = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Ji = new Int32Array([
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
})), Xi, Zi, Qi, $i, ea, ta, na = o((() => {
	O(), Yi(), {digest: Xi, sign: Zi, importKey: Qi} = globalThis?.crypto?.subtle ?? {}, $i = typeof Xi == "function" && typeof Zi == "function" && typeof Qi == "function" ? globalThis.crypto.subtle : void 0, ea = 8388608, ta = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = Pn(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= ea && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = In(this.pending);
			if ($i) {
				if (this.secret) {
					this.finished = !0;
					let t = await $i.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await $i.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await $i.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Ki(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Ki(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), ra = o((() => {
	O(), Ui(), Yi(), na();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function ia(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var aa, oa = o((() => {
	O(), aa = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && ia(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && ia(e), parseInt(E(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), sa, ca, la, ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba = o((() => {
	x(), O(), oa(), sa = class {
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
					if (e.value.byteLength > ya) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ya} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ya) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ya} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(aa.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!va.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(Dn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: la,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: la,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: ua,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: da,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: fa,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: pa,
							value: new aa(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ma,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ha,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: ga,
							value: new Date(new aa(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: _a,
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
	})(ca ||= {}), la = "boolean", ua = "byte", da = "short", fa = "integer", pa = "long", ma = "binary", ha = "string", ga = "timestamp", _a = "uuid", va = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ya = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function xa({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Ta) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(Sa, !1), o = r.getUint32(Ca, !1), s = r.getUint32(e - wa, !1), c = new Hi();
	if (c.update(new Uint8Array(n, t, Ca)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + Ca, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + Ca + wa, a),
		body: new Uint8Array(n, t + Ca + wa + a, i - a - 16)
	};
}
var Sa, Ca, wa, Ta, Ea = o((() => {
	ra(), Sa = 4, Ca = 8, wa = 4, Ta = 16;
})), Da, Oa = o((() => {
	ra(), ba(), Ea(), Da = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new sa(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Hi();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = xa(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), ka, Aa = o((() => {
	ka = class {
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
})), ja, Ma = o((() => {
	ja = class {
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
})), Na, Pa = o((() => {
	Na = class {
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
})), Fa, Ia = o((() => {
	Fa = class {
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
function La(e) {
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
var Ra = o((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function za(e, t) {
	let n = Ba(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Ba(e, t) {
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
var Va = o((() => {})), Ha, Ua, Wa = o((() => {
	Oa(), Aa(), Ma(), Pa(), Ia(), Ra(), Va(), Ha = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new Da(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = La(e);
			return new Na({
				messageStream: new ka({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Ba(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new ja({
				messageStream: new Fa({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Ua = (e) => new Ha(e);
})), Ga, Ka, qa = o((() => {
	Ga = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), Ka = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Ja, Ya, Xa, Za = o((() => {
	Wa(), qa(), Ja = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Ha({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Ya(e) ? Ga(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Ka(n) : n;
		}
	}, Ya = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Xa = (e) => new Ja(e);
})), Qa, $a = o((() => {
	Qa = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), eo, to = o((() => {
	x(), C(), O(), eo = class {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? Mt)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				let e = a[1], t = Xe.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? Et)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), no = /* @__PURE__ */ c({
	EventStreamCodec: () => Da,
	EventStreamMarshaller: () => Ja,
	EventStreamSerde: () => eo,
	HeaderMarshaller: () => sa,
	Int64: () => aa,
	MessageDecoderStream: () => ka,
	MessageEncoderStream: () => ja,
	SmithyMessageDecoderStream: () => Na,
	SmithyMessageEncoderStream: () => Fa,
	UniversalEventStreamMarshaller: () => Ha,
	eventStreamSerdeProvider: () => Xa,
	getChunkedStream: () => La,
	getMessageUnmarshaller: () => Ba,
	getUnmarshalledStream: () => za,
	iterableToReadableStream: () => Ka,
	readableStreamToIterable: () => Ga,
	resolveEventStreamSerdeConfig: () => Qa,
	universalEventStreamSerdeProvider: () => Ua
}), ro = o((() => {
	Oa(), ba(), oa(), Aa(), Ma(), Pa(), Ia(), Za(), qa(), Wa(), Ra(), Va(), $a(), to();
}));
x(), C();
var io = class extends zi {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Xe(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return y;
	}
	getResponseType() {
		return de;
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
		let r = S.of(t.input), i = Be(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !ge(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (ro(), no));
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
x(), C();
var ao = class extends io {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = S.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new y({
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
		let r = this.deserializer, i = S.of(e.output), a = {};
		if (this.isErrorResponse(n.statusCode)) {
			let i = await Ri(n.body, t);
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
			let e = await Ri(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function oo(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/protocol-http/extensions/httpExtensionConfiguration.js
var so = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), co = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
x();
var lo = "content-length";
function uo(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (y.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(lo) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[lo]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var fo = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, po = (e) => ({ applyToStack: (t) => {
	t.add(uo(e.bodyLengthChecker), fo);
} }), mo = (e) => encodeURIComponent(e).replace(/[!'()*]/g, ho), ho = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function go(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = mo(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${mo(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${mo(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var _o = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, vo = class {
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
}, yo;
function bo() {
	if (yo === void 0) try {
		if (typeof Buffer != "function") yo = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			yo = typeof e == "object" && !!e;
		}
	} catch {
		yo = !1;
	}
	return yo;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
O();
function xo(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? Co(e, t) ? t : new T(e, "bigDecimal") : So(e) ? new T(e, "bigDecimal") : /[eE]/.test(e) ? To(e) : BigInt(e);
	}
	return t;
}
function So(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function Co(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return wo(e) === wo(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === wo(r) : !1;
}
function wo(e) {
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
function To(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
C();
var Eo = Symbol.for("@aws-sdk/reviver");
function Do(e) {
	let t = S.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (Eo in n) return n[Eo];
		let e = Oo(t, /* @__PURE__ */ new Set());
		return n[Eo] = e, e;
	}
	return Oo(t, /* @__PURE__ */ new Set());
}
function Oo(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (Oo(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (Oo(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
O();
var ko = (e, t) => Ri(e, t).then((e) => (t?.utf8Encoder ?? Mt)(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function Ao(e, t, n) {
	let r;
	if (bo() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await Ri(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await ko(e, t), r.length === 0) return {};
	let i = n && Do(n) ? xo : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var jo = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), Mo = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, No = (e, t, n = !1) => Po(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), Po = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = jo(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return Mo(e[n]);
			break;
		case "code":
			let r = jo(t ?? {}, "code");
			if (r && t[r] !== void 0) return Mo(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return Mo(t.__type);
	}
};
C(), O(), x();
var Fo = class extends _o {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = Do(e) ? xo : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && bo()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await Ao(t, this.serdeContext, e);
		return this._read(e, r);
	}
	readObject(e, t) {
		return this._read(e, t);
	}
	_read(e, t) {
		let n = typeof t == "object" && !!t, r = S.of(e);
		if (n) {
			if (r.isStructSchema()) return this._readStruct(r, t);
			if (Array.isArray(t) && r.isListSchema()) {
				let e = r.getValueSchema();
				if (this.needsTransform(e)) for (let n = 0; n < t.length; ++n) t[n] = this._read(e, t[n]);
				return t;
			}
			if (r.isMapSchema()) {
				let e = r.getValueSchema(), n = t;
				if (this.needsTransform(e)) for (let t in n) v(n, t) && (t === "__proto__" && Mi(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return wt(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? Cn.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (oo(r, this.settings)) {
			case 5: return rn(t);
			case 6: return cn(t);
			case 7: return ln(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (r.isBigIntegerSchema() && (typeof t == "number" || typeof t == "string")) return BigInt(t);
		if (r.isBigDecimalSchema() && t != null) {
			if (t instanceof T) return t;
			let e = t;
			return e.type === "bigDecimal" && "string" in e ? new T(e.string, e.type) : new T(String(t), "bigDecimal");
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
				n instanceof T || (t[e] = this._read(r, n));
			}
			else {
				let e = t;
				for (let t in e) {
					if (!v(e, t)) continue;
					t === "__proto__" && Mi(e);
					let n = e[t];
					n instanceof T || (e[t] = this._read(r, n));
				}
			}
		}
		return t;
	}
	_readStruct(e, t) {
		let n = e.isUnionSchema(), r = {}, i, a = typeof t.__type == "string", { jsonName: o } = this.settings;
		o && a && (i = {});
		let s;
		n && (s = new vo(t, r));
		for (let [c, l] of e.structIterator()) {
			let e = c;
			o && (e = l.getMergedTraits().jsonName ?? e, a && (i[e] = c)), n && s.mark(e), t[e] != null && (r[c] = this._read(l, t[e]));
		}
		if (n) s.writeUnknown();
		else if (a) for (let e in t) {
			if (!v(t, e)) continue;
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
O();
var Io = class e extends Uint8Array {
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
			e > Lo + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), Lo = e), this.string = Mt(this);
		}
		return this.string;
	}
}, Lo = 0;
C(), O(), x();
var Ro = new TextEncoder(), zo = 123, Bo = 125, Vo = 91, Ho = 93, Uo = 34, Wo = 58, Go = 44, Ko = 92, qo = new Uint8Array([
	116,
	114,
	117,
	101
]), Jo = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), Yo = new Uint8Array([
	110,
	117,
	108,
	108
]), A = Array(128).fill(null);
A[8] = "b", A[9] = "t", A[10] = "n", A[12] = "f", A[13] = "r", A[34] = "\"", A[92] = "\\";
for (let e = 0; e < 32; e++) A[e] === null && (A[e] = "u00" + e.toString(16).padStart(2, "0"));
var Xo = 2048;
function Zo(e) {
	return Io.allocUnsafe(e);
}
var Qo = class e extends _o {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = Zo(Xo);
	}
	write(e, t) {
		this.i = 0, this.rawValue = t, this.rootSchema = S.of(e), this.passthrough = this.rootSchema.isBlobSchema() || this.rootSchema.isStringSchema(), this.passthrough || this.writeValue(this.rootSchema, t, void 0);
	}
	writeDiscriminatedDocument(e, t) {
		this.i = 0, this.rootSchema = S.of(e);
		let n = this.rootSchema;
		if (n.isStructSchema() && typeof t == "object" && t) {
			this.writeValue(n, t, void 0);
			let e = `"__type":"${n.getName(!0) ?? "Unknown"}",`, r = e.length;
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), Ro.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = Zo(Xo), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = Zo(r);
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
		n[r++] = Uo;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = Uo, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = Uo;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = A[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = Ko;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = Ro.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = Uo;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = Ko, t[n++] = 117;
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
		r[a++] = Uo;
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
		r[a++] = Uo, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && S.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(Li());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(Yo, this.i), this.i += 4;
			return;
		}
		let r = S.of(e), i = typeof t == "object";
		if (r.isStringSchema()) {
			let e = r.getMergedTraits().mediaType;
			if (e && (e === "application/json" || e.endsWith("+json"))) {
				this.writeJsonString(Cn.from(t).toString());
				return;
			}
		}
		if (this.settings.bigNumberAsString && t != null && (r.isBigIntegerSchema() || r.isBigDecimalSchema())) {
			let e = t instanceof T ? t.string : String(t);
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
			if (t instanceof T) {
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
				let e = (this.serdeContext?.base64Encoder ?? Ot)(t);
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
			t ? (n.set(qo, e), e += 4) : (n.set(Jo, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = zo;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = Go), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Wo, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Wo, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = Go), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Wo, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = Bo;
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
			this.ensure(n.length * 3), this.i += Ro.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Vo;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = Go), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = Ho;
	}
	writeMap(e, t, n) {
		let r = !!e.getMergedTraits().sparse, i = e.getValueSchema();
		if (!n && (i.isStringSchema() || i.isNumericSchema() || i.isBooleanSchema())) {
			let e;
			for (let n in t) {
				if (!v(t, n)) continue;
				let i = t[n];
				Number.isNaN(i) || i === Infinity || i === -Infinity ? ((e ??= {})[n] = i, t[n] = String(i)) : i === null && !r && ((e ??= {})[n] = null, t[n] = void 0);
			}
			let n = JSON.stringify(t);
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += Ro.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = zo;
		let a = !0;
		for (let e in t) {
			if (!v(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = Go), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Wo, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = Bo;
	}
	writeTimestamp(e, t) {
		switch (oo(e, this.settings)) {
			case 5: {
				let e = t.toISOString().replace(".000Z", "Z");
				this.writeAsciiQuoted(e);
				return;
			}
			case 6:
				this.writeAsciiQuoted($t(t));
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
}, $o = class extends _o {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new Qo(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Fo(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
}, es = [
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
], ts = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], ns = [
	500,
	502,
	503,
	504
], rs = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], is = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], as = (e) => e?.$retryable !== void 0, os = (e) => e.$metadata?.clockSkewCorrected, ss = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, cs = (e) => e.$metadata?.httpStatusCode === 429 || es.includes(e.name) || e.$retryable?.throttling == 1, ls = (e, t = 0) => e?.name !== "AbortError" && (as(e) || os(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || ts.includes(e.name) || rs.includes(e?.code || "") || is.includes(e?.code || "") || ns.includes(e.$metadata?.httpStatusCode || 0) || ss(e) || ds(e) || e.cause !== void 0 && t <= 10 && ls(e.cause, t + 1)), us = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !ls(e);
	}
	return !1;
};
function ds(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var fs = 2e4, ps = "amz-sdk-invocation-id", ms = "amz-sdk-request";
x(), fe(), O();
function hs(e, t) {
	if (de.isInstance(e)) for (let n in e.headers) {
		if (!v(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (cn(r).getTime() - Date.now()) / 1e3;
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
var gs = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
ue(), O();
function _s(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (ys(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = y.isInstance(d);
			for (f && (d.headers[ps] = Ii());;) try {
				f && (d.headers[ms] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = bs(n, t.logger);
				if (c = gs(n), f && e(d)) throw (r.logger instanceof pt ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await vs(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var vs = (e) => new Promise((t) => setTimeout(t, e)), ys = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, bs = (e, t) => {
	let n = {
		error: e,
		errorType: xs(e)
	}, r = hs(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, xs = (e) => cs(e) ? "THROTTLING" : ls(e) ? "TRANSIENT" : us(e) ? "SERVER_ERROR" : "CLIENT_ERROR", Ss = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function Cs(e) {
	let t = _s(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), Ss);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var ws = class e {
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
		if (n?.errorType === "THROTTLING" || cs(n?.error ?? e)) {
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
}, j = class e {
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
}, Ts = class {
	x = j.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, fs);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, Es = class {
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
		return Math.min(fs, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Ds;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Ds ||= {});
var Os = Ds.STANDARD, ks = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, As = class {
	mode = Ds.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= j.delay(), this.retryBackoffStrategy ??= new Ts();
	}
	async acquireInitialRetryToken(e) {
		return new Es(j.delay(), 0, void 0, j.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? j.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new Es(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = j.v2026 && r === ks.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : ks.incompatible, a = r < n ? 0 : ks.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : ks.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === j.modifiedCostType() ? j.throttlingCost() : j.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, js = class {
	mode = Ds.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new ws(), this.standardRetryStrategy = t ? new As({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new As(e);
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
ve();
var Ms = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = j.delay() } = t ?? {}, o = b(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await b(r)() === Ds.ADAPTIVE ? new js(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new As({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, Ns = Cs(yt);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
j.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function Ps(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
ue();
function Fs(e) {
	return e;
}
var Is = (e) => (t) => async (n) => {
	if (!y.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, Ls = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, Rs = (e) => ({ applyToStack: (t) => {
	t.add(Is(e), Ls);
} }), zs = () => (e, t) => async (n) => {
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
}, Bs = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, Vs = (e) => ({ applyToStack: (e) => {
	e.add(zs(), Bs);
} }), Hs = (e) => ({ applyToStack: (e) => {} }), Us = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
x();
function Ws(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var Gs = (e, t) => (n, r) => async (i) => {
	let a = Us(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = Ws(e.httpAuthSchemes), s = oe(r), c = [];
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
}, Ks = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, qs = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(Gs(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), Ks);
} });
ue(), x();
var Js = (e) => (e) => {
	throw e;
}, Ys = (e, t) => {}, Xs = (e) => (e, t) => async (n) => {
	if (!y.isInstance(n.request)) return e(n);
	let r = oe(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Js)(i));
	return (o.successHandler || Ys)(s.response, i), s;
}, Zs = {
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
}, Qs = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Xs(e), Zs);
} }), $s = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
x();
var ec = class {
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
}, tc = ((e) => function(t) {
	return nc(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), nc = (e) => e.expiration !== void 0, rc = (e, t, n) => {
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
function ic(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function ac(e) {
	let t = $s(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!ic(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var oc = {
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
}, sc = "", cc = (e) => {
	let { partitions: t } = oc;
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
}, lc = () => sc, uc = /\d{12}\.ddb/;
async function dc(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && Ps(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Ds.ADAPTIVE:
				Ps(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Ds.STANDARD: Ps(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(uc) && Ps(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				Ps(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				Ps(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": Ps(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && Ps(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) Ps(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var fc = "user-agent", pc = "x-amz-user-agent", mc = /[^!$%&'*+\-.^_`|~\w]/g, hc = /[^!$%&'*+\-.^_`|~\w#]/g, gc = 1024;
function _c(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= gc) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
ue();
var vc = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!y.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(yc) || [], s = (await e.defaultUserAgentProvider()).map(yc);
	await dc(n, e, r);
	let c = n;
	s.push(`m/${_c(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(yc) || [], u = await e.userAgentAppId();
	u && s.push(yc(["app", `${u}`]));
	let d = lc(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[pc] = f : (p && (a[pc] = a["x-amz-user-agent"] ? `${a[fc]} ${p}` : p), a[fc] = f), t({
		...r,
		request: i
	});
}, yc = (e) => {
	let t = e[0].split("/").map((e) => e.replace(mc, "-")).join("/"), n = e[1]?.replace(hc, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, bc = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, xc = (e) => ({ applyToStack: (t) => {
	t.add(vc(e), bc);
} }), Sc = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? Cc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? Cc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, Cc = {
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
Ti(), Br();
var wc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!wc(t)) return !1;
		return !0;
	}
	return !(!me(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || zr(e));
}, Tc = ":", Ec = "/", Dc = (e) => {
	let t = e.split(Tc);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(Tc) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(Ec)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
Ti();
var Oc = {
	isVirtualHostableS3Bucket: wc,
	parseArn: Dc,
	partition: cc
};
Sr.aws = Oc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var kc = (e, t, n) => {
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
x();
var Ac = /* @__PURE__ */ new Set(), jc = (e, t = me) => {
	if (!Ac.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else Ac.add(e);
}, Mc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), Nc = (e) => Mc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, Pc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = Nc(typeof t == "function" ? await t() : t);
			return jc(e), e;
		},
		useFipsEndpoint: async () => Mc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, Fc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], Ic = ({ defaultsMode: e } = {}) => kc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(Lc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${Fc.join(", ")}, got ${t}`);
	}
}), Lc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, Rc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), zc = (e) => ({ region: e.region() }), Bc = /* @__PURE__ */ s(((e, t) => {
	function n(e) {
		Object.defineProperty(this, "_next", {
			writable: !1,
			enumerable: !1,
			value: e
		}), this.done = !1;
	}
	n.prototype.next = function() {
		if (this.done) return { done: !0 };
		var e = this._next();
		return e.done && (this.done = !0), e;
	}, typeof Symbol < "u" && (n.prototype[Symbol.iterator] = function() {
		return this;
	}), n.of = function() {
		var e = arguments, t = e.length, r = 0;
		return new n(function() {
			return r >= t ? { done: !0 } : {
				done: !1,
				value: e[r++]
			};
		});
	}, n.empty = function() {
		var e = new n(null);
		return e.done = !0, e;
	}, n.is = function(e) {
		return e instanceof n || typeof e == "object" && !!e && typeof e.next == "function";
	}, t.exports = n;
})), Vc = /* @__PURE__ */ s(((e, t) => {
	var n = typeof ArrayBuffer < "u", r = typeof Symbol < "u";
	function i(e, t) {
		var i, a, o, s, c;
		if (!e) throw Error("obliterator/forEach: invalid iterable.");
		if (typeof t != "function") throw Error("obliterator/forEach: expecting a callback.");
		if (Array.isArray(e) || n && ArrayBuffer.isView(e) || typeof e == "string" || e.toString() === "[object Arguments]") for (o = 0, s = e.length; o < s; o++) t(e[o], o);
		else if (typeof e.forEach == "function") e.forEach(t);
		else if (r && Symbol.iterator in e && typeof e.next != "function" && (e = e[Symbol.iterator]()), typeof e.next == "function") for (i = e, o = 0; c = i.next(), c.done !== !0;) t(c.value, o), o++;
		else for (a in e) e.hasOwnProperty(a) && t(e[a], a);
	}
	i.forEachWithNullKeys = function(e, t) {
		var i, a, o, s, c;
		if (!e) throw Error("obliterator/forEachWithNullKeys: invalid iterable.");
		if (typeof t != "function") throw Error("obliterator/forEachWithNullKeys: expecting a callback.");
		if (Array.isArray(e) || n && ArrayBuffer.isView(e) || typeof e == "string" || e.toString() === "[object Arguments]") for (o = 0, s = e.length; o < s; o++) t(e[o], null);
		else if (e instanceof Set) e.forEach(function(e) {
			t(e, null);
		});
		else if (typeof e.forEach == "function") e.forEach(t);
		else if (r && Symbol.iterator in e && typeof e.next != "function" && (e = e[Symbol.iterator]()), typeof e.next == "function") for (i = e, o = 0; c = i.next(), c.done !== !0;) t(c.value, null), o++;
		else for (a in e) e.hasOwnProperty(a) && t(e[a], a);
	}, t.exports = i;
})), Hc = /* @__PURE__ */ s(((e) => {
	var t = 2 ** 16 - 1, n = 2 ** 32 - 1, r = 127, i = 2 ** 15 - 1, a = 2 ** 31 - 1;
	e.getPointerArray = function(e) {
		var r = e - 1;
		return r <= 255 ? Uint8Array : r <= t ? Uint16Array : r <= n ? Uint32Array : Float64Array;
	}, e.getSignedPointerArray = function(e) {
		var t = e - 1;
		return t <= r ? Int8Array : t <= i ? Int16Array : t <= a ? Int32Array : Float64Array;
	}, e.getNumberType = function(e) {
		return e === (e | 0) ? Math.sign(e) === -1 ? e <= 127 && e >= -128 ? Int8Array : e <= 32767 && e >= -32768 ? Int16Array : Int32Array : e <= 255 ? Uint8Array : e <= 65535 ? Uint16Array : Uint32Array : Float64Array;
	};
	var o = {
		Uint8Array: 1,
		Int8Array: 2,
		Uint16Array: 3,
		Int16Array: 4,
		Uint32Array: 5,
		Int32Array: 6,
		Float32Array: 7,
		Float64Array: 8
	};
	e.getMinimalRepresentation = function(t, n) {
		for (var r = null, i = 0, a, s, c, l = 0, u = t.length; l < u; l++) c = n ? n(t[l]) : t[l], s = e.getNumberType(c), a = o[s.name], a > i && (i = a, r = s);
		return r;
	}, e.isTypedArray = function(e) {
		return typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
	}, e.concat = function() {
		for (var e = 0, t = 0, n, r = arguments.length; t < r; t++) e += arguments[t].length;
		var i = new arguments[0].constructor(e);
		for (t = 0, n = 0; t < r; t++) i.set(arguments[t], n), n += arguments[t].length;
		return i;
	}, e.indices = function(t) {
		for (var n = new (e.getPointerArray(t))(t), r = 0; r < t; r++) n[r] = r;
		return n;
	};
})), Uc = /* @__PURE__ */ s(((e) => {
	var t = Vc(), n = Hc();
	function r(e) {
		return Array.isArray(e) || n.isTypedArray(e);
	}
	function i(e) {
		if (typeof e.length == "number") return e.length;
		if (typeof e.size == "number") return e.size;
	}
	function a(e) {
		var n = i(e), r = typeof n == "number" ? Array(n) : [], a = 0;
		return t(e, function(e) {
			r[a++] = e;
		}), r;
	}
	function o(e) {
		var r = i(e), a = typeof r == "number" ? n.getPointerArray(r) : Array, o = typeof r == "number" ? Array(r) : [], s = typeof r == "number" ? new a(r) : [], c = 0;
		return t(e, function(e) {
			o[c] = e, s[c] = c++;
		}), [o, s];
	}
	e.isArrayLike = r, e.guessLength = i, e.toArray = a, e.toArrayWithIndices = o;
})), Wc = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	var n = Bc(), r = Vc(), i = Hc(), a = Uc();
	function o(e, t, n) {
		if (arguments.length < 2 && (n = e, e = null, t = null), this.capacity = n, typeof this.capacity != "number" || this.capacity <= 0) throw Error("mnemonist/lru-cache: capacity should be positive number.");
		var r = i.getPointerArray(n);
		this.forward = new r(n), this.backward = new r(n), this.K = typeof e == "function" ? new e(n) : Array(n), this.V = typeof t == "function" ? new t(n) : Array(n), this.size = 0, this.head = 0, this.tail = 0, this.items = {};
	}
	o.prototype.clear = function() {
		this.size = 0, this.head = 0, this.tail = 0, this.items = {};
	}, o.prototype.splayOnTop = function(e) {
		var t = this.head;
		if (this.head === e) return this;
		var n = this.backward[e], r = this.forward[e];
		return this.tail === e ? this.tail = n : this.backward[r] = n, this.forward[n] = r, this.backward[t] = e, this.head = e, this.forward[e] = t, this;
	}, o.prototype.set = function(e, t) {
		var n = this.items[e];
		n === void 0 ? (this.size < this.capacity ? n = this.size++ : (n = this.tail, this.tail = this.backward[n], delete this.items[this.K[n]]), this.items[e] = n, this.K[n] = e, this.V[n] = t, this.forward[n] = this.head, this.backward[this.head] = n, this.head = n) : (this.splayOnTop(n), this.V[n] = t);
	}, o.prototype.setpop = function(e, t) {
		var n = null, r = null, i = this.items[e];
		return i === void 0 ? (this.size < this.capacity ? i = this.size++ : (i = this.tail, this.tail = this.backward[i], n = this.V[i], r = this.K[i], delete this.items[this.K[i]]), this.items[e] = i, this.K[i] = e, this.V[i] = t, this.forward[i] = this.head, this.backward[this.head] = i, this.head = i, r ? {
			evicted: !0,
			key: r,
			value: n
		} : null) : (this.splayOnTop(i), n = this.V[i], this.V[i] = t, {
			evicted: !1,
			key: e,
			value: n
		});
	}, o.prototype.has = function(e) {
		return e in this.items;
	}, o.prototype.get = function(e) {
		var t = this.items[e];
		if (t !== void 0) return this.splayOnTop(t), this.V[t];
	}, o.prototype.peek = function(e) {
		var t = this.items[e];
		if (t !== void 0) return this.V[t];
	}, o.prototype.forEach = function(e, t) {
		t = arguments.length > 1 ? t : this;
		for (var n = 0, r = this.size, i = this.head, a = this.K, o = this.V, s = this.forward; n < r;) e.call(t, o[i], a[i], this), i = s[i], n++;
	}, o.prototype.keys = function() {
		var e = 0, t = this.size, r = this.head, i = this.K, a = this.forward;
		return new n(function() {
			if (e >= t) return { done: !0 };
			var n = i[r];
			return e++, e < t && (r = a[r]), {
				done: !1,
				value: n
			};
		});
	}, o.prototype.values = function() {
		var e = 0, t = this.size, r = this.head, i = this.V, a = this.forward;
		return new n(function() {
			if (e >= t) return { done: !0 };
			var n = i[r];
			return e++, e < t && (r = a[r]), {
				done: !1,
				value: n
			};
		});
	}, o.prototype.entries = function() {
		var e = 0, t = this.size, r = this.head, i = this.K, a = this.V, o = this.forward;
		return new n(function() {
			if (e >= t) return { done: !0 };
			var n = i[r], s = a[r];
			return e++, e < t && (r = o[r]), {
				done: !1,
				value: [n, s]
			};
		});
	}, typeof Symbol < "u" && (o.prototype[Symbol.iterator] = o.prototype.entries), o.prototype.inspect = function() {
		for (var e = /* @__PURE__ */ new Map(), t = this.entries(), n; n = t.next(), !n.done;) e.set(n.value[0], n.value[1]);
		return Object.defineProperty(e, "constructor", {
			value: o,
			enumerable: !1
		}), e;
	}, typeof Symbol < "u" && (o.prototype[Symbol.for("nodejs.util.inspect.custom")] = o.prototype.inspect), o.from = function(e, t, n, i) {
		if (arguments.length < 2) {
			if (i = a.guessLength(e), typeof i != "number") throw Error("mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.");
		} else arguments.length === 2 && (i = t, t = null, n = null);
		var s = new o(t, n, i);
		return r(e, function(e, t) {
			s.set(t, e);
		}), s;
	}, t.exports = o;
})))()), Gc = class {
	cache;
	constructor(e) {
		this.cache = new Wc.default(e);
	}
	getEndpoint(e) {
		let t = this.get(e);
		if (!t || t.length === 0) return;
		let n = t.map((e) => e.Address);
		return n[Math.floor(Math.random() * n.length)];
	}
	get(e) {
		if (!this.has(e)) return;
		let t = this.cache.get(e);
		if (!t) return;
		let n = Date.now(), r = t.filter((e) => n < e.Expires);
		if (r.length === 0) this.delete(e);
		else return r;
	}
	set(e, t) {
		let n = Date.now();
		this.cache.set(e, t.map(({ Address: e, CachePeriodInMinutes: t }) => ({
			Address: e,
			Expires: n + t * 60 * 1e3
		})));
	}
	delete(e) {
		this.cache.set(e, []);
	}
	has(e) {
		if (!this.cache.has(e)) return !1;
		let t = this.cache.peek(e);
		return t ? t.length > 0 : !1;
	}
	clear() {
		this.cache.clear();
	}
}, Kc = (e, { endpointDiscoveryCommandCtor: t }) => {
	let { endpointCacheSize: n, endpointDiscoveryEnabled: r, endpointDiscoveryEnabledProvider: i } = e;
	return Object.assign(e, {
		endpointDiscoveryCommandCtor: t,
		endpointCache: new Gc(n ?? 1e3),
		endpointDiscoveryEnabled: r === void 0 ? i : () => Promise.resolve(r),
		isClientEndpointDiscoveryEnabled: r !== void 0
	});
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
fe();
var qc = (e) => de.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, Jc = (e) => de.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, Yc = (e) => new Date(Date.now() + e), Xc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
ue(), ae();
var Zc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Qc = (e) => e.context?.[re]?.eventStream?.output === !0, $c = async (e) => {
	let t = Zc("context", e.context), n = Zc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await Zc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, el = class {
	async sign(e, t, n) {
		if (!y.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await $c(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Qc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Yc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? qc(n.$response);
				if (t) {
					let r = Zc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = Jc(n.$response), s = Xc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = qc(e);
		if (n) {
			let r = Zc("config", t.config), i = t._requestSentAt, a = Jc(e);
			r.systemClockOffset = Xc(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
O();
var tl = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!v(e, n)) continue;
			let r = Et(n);
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
				let o = Et(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(il.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!rl.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Dn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, nl;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(nl ||= {});
var rl = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, il = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && al(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && al(e), parseInt(E(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function al(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var ol = "X-Amz-Algorithm", sl = "X-Amz-Credential", cl = "X-Amz-Date", ll = "X-Amz-SignedHeaders", ul = "X-Amz-Expires", dl = "X-Amz-Signature", fl = "X-Amz-Security-Token", pl = "authorization", ml = cl.toLowerCase(), hl = [
	pl,
	ml,
	"date"
];
dl.toLowerCase();
var gl = "x-amz-content-sha256", _l = fl.toLowerCase(), vl = {
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
}, yl = /^proxy-/, bl = /^sec-/, xl = "AWS4-HMAC-SHA256", Sl = "AWS4-HMAC-SHA256-PAYLOAD", Cl = "UNSIGNED-PAYLOAD", wl = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
O();
var Tl = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!v(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = mo(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${mo(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${mo(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, El = (e) => Dl(e).toISOString().replace(/\.\d{3}Z$/, "Z"), Dl = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
ve(), O();
var Ol = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = b(n), this.credentialProvider = b(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${Tl(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(Pn(n)), `${r}
${e}
${t}
${E(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return mo(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = El(e).replace(/[-:]/g, "");
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
var kl = {}, Al = [], jl = (e, t, n) => `${e}/${t}/${n}/${wl}`, Ml = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${E(await Nl(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in kl) return kl[a];
	for (Al.push(a); Al.length > 50;) delete kl[Al.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		wl
	]) o = await Nl(e, o, t);
	return kl[a] = o;
}, Nl = (e, t, n) => {
	let r = new e(t);
	return r.update(Pn(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
O();
var Pl = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(v(vl, a) || t?.has(a) || yl.test(a) || bl.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Mi(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
O();
var Fl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (v(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Rn(t)) {
		let e = new n();
		return e.update(Pn(t)), E(await e.digest());
	}
	return Cl;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
O();
var Il = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (v(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
O(), ue();
var Ll = (e, t = {}) => {
	let { headers: n, query: r = {} } = y.clone(e);
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
O(), ue();
var Rl = (e) => {
	e = y.clone(e);
	for (let t in e.headers) v(e.headers, t) && hl.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
O();
var zl = class extends Ol {
	headerFormatter = new tl();
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
		let m = jl(p, d, l ?? this.service), h = Ll(Rl(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[fl] = u.sessionToken), h.query[ol] = xl, h.query[sl] = `${u.accessKeyId}/${m}`, h.query[cl] = f, h.query[ul] = r.toString(10);
		let g = Pl(h, i, o);
		return h.query[ll] = this.getCanonicalHeaderList(g), h.query[dl] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await Fl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = jl(c, s, a ?? this.service), d = await Fl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			Sl,
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
		return c.update(Pn(e)), E(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = Rl(e), { longDate: l, shortDate: u } = this.formatDate(t), d = jl(u, s, a ?? this.service);
		c.headers[ml] = l, o.sessionToken && (c.headers[_l] = o.sessionToken);
		let f = await Fl(c, this.sha256);
		!Il("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[gl] = f);
		let p = Pl(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[pl] = `${xl} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, xl), a = new this.sha256(await n);
		return a.update(Pn(i)), E(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Ml(this.sha256, e, n, t, r || this.service);
	}
}, Bl = (e) => (t) => {
	let n = t.credentials, r = !!t.credentials, i;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== i && (r = !0), n = e;
			let a = Hl(t, Vl(t, {
				credentials: n,
				credentialDefaultProvider: t.credentialDefaultProvider
			}));
			if (r && !a.attributed) {
				let e = typeof n == "object" && !!n;
				i = async (t) => {
					let n = await a(t);
					return e && (!n.$source || Object.keys(n.$source).length === 0) ? vt(n, "CREDENTIALS_CODE", "e") : n;
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
	return c = t.signer ? $s(t.signer) : t.regionInfoProvider ? () => $s(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || zl)(o);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await $s(t.region)(),
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
		return new (t.signerConstructor || zl)(i);
	}, Object.assign(t, {
		systemClockOffset: o,
		signingEscapePath: a,
		signer: c,
		disableClockSkewCorrection: $s(t.disableClockSkewCorrection ?? e)
	});
};
function Vl(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : rc(t, tc, nc) : n ? $s(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function Hl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var Ul = Bl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/auth/httpAuthSchemeProvider.js
se(), ve();
var Wl = async (e, t, n) => ({
	operation: oe(t).operation,
	region: await b(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function Gl(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "dynamodb",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var Kl = (e) => {
	let t = [];
	return e.operation, t.push(Gl(e)), t;
}, ql = (e) => {
	let t = Ul(e);
	return Object.assign(t, { authSchemePreference: b(e.authSchemePreference ?? []) });
}, Jl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "dynamodb"
}), Yl = {
	UseFIPS: {
		type: "builtInParams",
		name: "useFipsEndpoint"
	},
	AccountId: {
		type: "builtInParams",
		name: "accountId"
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
	},
	AccountIdEndpointMode: {
		type: "builtInParams",
		name: "accountIdEndpointMode"
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/commandBuilder.js
Ti();
var Xl = mt(Yl, "DynamoDB_20120810", "DynamoDBClient", wi), Zl = {}, Ql = { ResourceArn: {
	type: "contextParams",
	name: "TableName"
} }, $l = (e, t, n, r) => [], M = class e extends rt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.dynamodb#DynamoDBServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, eu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#BackupInUseException";
	name = "BackupInUseException";
	$fault = "client";
	constructor(t) {
		super({
			name: "BackupInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, tu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#BackupNotFoundException";
	name = "BackupNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "BackupNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#InternalServerError";
	name = "InternalServerError";
	$fault = "server";
	constructor(t) {
		super({
			name: "InternalServerError",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ru = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#RequestLimitExceeded";
	name = "RequestLimitExceeded";
	$fault = "client";
	ThrottlingReasons;
	constructor(t) {
		super({
			name: "RequestLimitExceeded",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.ThrottlingReasons = t.ThrottlingReasons;
	}
}, iu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ThrottlingException";
	name = "ThrottlingException";
	$fault = "client";
	throttlingReasons;
	constructor(t) {
		super({
			name: "ThrottlingException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.throttlingReasons = t.throttlingReasons;
	}
}, au = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#InvalidEndpointException";
	name = "InvalidEndpointException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "InvalidEndpointException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ou = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ProvisionedThroughputExceededException";
	name = "ProvisionedThroughputExceededException";
	$fault = "client";
	ThrottlingReasons;
	constructor(t) {
		super({
			name: "ProvisionedThroughputExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.ThrottlingReasons = t.ThrottlingReasons;
	}
}, su = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ItemCollectionSizeLimitExceededException";
	name = "ItemCollectionSizeLimitExceededException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ItemCollectionSizeLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ReplicatedWriteConflictException";
	name = "ReplicatedWriteConflictException";
	$fault = "client";
	$retryable = {};
	constructor(t) {
		super({
			name: "ReplicatedWriteConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, uu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ContinuousBackupsUnavailableException";
	name = "ContinuousBackupsUnavailableException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ContinuousBackupsUnavailableException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, du = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#LimitExceededException";
	name = "LimitExceededException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, fu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TableInUseException";
	name = "TableInUseException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TableInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, pu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TableNotFoundException";
	name = "TableNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TableNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, mu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#GlobalTableAlreadyExistsException";
	name = "GlobalTableAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "GlobalTableAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, hu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ResourceInUseException";
	name = "ResourceInUseException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, gu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TransactionConflictException";
	name = "TransactionConflictException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TransactionConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, _u = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#PolicyNotFoundException";
	name = "PolicyNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "PolicyNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, vu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ExportNotFoundException";
	name = "ExportNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExportNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, yu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#GlobalTableNotFoundException";
	name = "GlobalTableNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "GlobalTableNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ImportNotFoundException";
	name = "ImportNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImportNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#DuplicateItemException";
	name = "DuplicateItemException";
	$fault = "client";
	constructor(t) {
		super({
			name: "DuplicateItemException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Su = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#IdempotentParameterMismatchException";
	name = "IdempotentParameterMismatchException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "IdempotentParameterMismatchException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Cu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TransactionInProgressException";
	name = "TransactionInProgressException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "TransactionInProgressException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, wu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ExportConflictException";
	name = "ExportConflictException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExportConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Tu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#InvalidExportTimeException";
	name = "InvalidExportTimeException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidExportTimeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Eu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#PointInTimeRecoveryUnavailableException";
	name = "PointInTimeRecoveryUnavailableException";
	$fault = "client";
	constructor(t) {
		super({
			name: "PointInTimeRecoveryUnavailableException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Du = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ImportConflictException";
	name = "ImportConflictException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ImportConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Ou = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TableAlreadyExistsException";
	name = "TableAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "TableAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ku = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#InvalidRestoreTimeException";
	name = "InvalidRestoreTimeException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidRestoreTimeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Au = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ReplicaAlreadyExistsException";
	name = "ReplicaAlreadyExistsException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReplicaAlreadyExistsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ju = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ReplicaNotFoundException";
	name = "ReplicaNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReplicaNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Mu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#IndexNotFoundException";
	name = "IndexNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "IndexNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, Nu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#ConditionalCheckFailedException";
	name = "ConditionalCheckFailedException";
	$fault = "client";
	Item;
	constructor(t) {
		super({
			name: "ConditionalCheckFailedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Item = t.Item;
	}
}, Pu = class e extends M {
	static shapeId = "com.amazonaws.dynamodb#TransactionCanceledException";
	name = "TransactionCanceledException";
	$fault = "client";
	Message;
	CancellationReasons;
	constructor(t) {
		super({
			name: "TransactionCanceledException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message, this.CancellationReasons = t.CancellationReasons;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/schemas/schemas_0.js
C();
var Fu = "ArchivalBackupArn", Iu = "AttributeDefinition", Lu = "ArchivalDateTime", Ru = "AttributeDefinitions", zu = "AttributeMap", Bu = "AttributeName", Vu = "ArchivalReason", Hu = "ArchivalSummary", Uu = "AttributeType", Wu = "AttributesToGet", Gu = "AttributeValue", Ku = "AttributeValueList", qu = "Address", Ju = "Attributes", Yu = "Backfilling", Xu = "BackupInUseException", Zu = "BillingMode", Qu = "BillingModeSummary", $u = "BackupNotFoundException", ed = "BOOL", td = "BS", nd = "B", rd = "Code", id = "ContinuousBackupsUnavailableException", ad = "ConsumedCapacity", od = "ConditionalCheckFailedException", sd = "CreationDateTime", cd = "ConditionExpression", ld = "ComparisonOperator", ud = "ConditionalOperator", dd = "CachePeriodInMinutes", fd = "CancellationReasons", pd = "CancellationReasonList", md = "CancellationReason", hd = "ConsistentRead", gd = "CreateTableInput", _d = "CreateTableOutput", vd = "CreateTable", yd = "CapacityUnits", bd = "Capacity", xd = "Condition", Sd = "Count", Cd = "Dimensions", wd = "DescribeEndpoints", Td = "DescribeEndpointsRequest", Ed = "DescribeEndpointsResponse", Dd = "DistanceFunction", Od = "DuplicateItemException", kd = "DeletionProtectionEnabled", Ad = "DisassociationProtectionEnabled", jd = "DeleteTable", Md = "DeleteTableInput", Nd = "DescribeTableInput", Pd = "DeleteTableOutput", Fd = "DescribeTableOutput", Id = "DescribeTable", Ld = "ExpectedAttributeMap", Rd = "ExpressionAttributeNames", zd = "ExpressionAttributeValues", Bd = "ExpressionAttributeValueMap", Vd = "ExpectedAttributeValue", Hd = "ExportConflictException", Ud = "ExportNotFoundException", Wd = "ExecuteStatementInput", Gd = "ExclusiveStartKey", Kd = "ExecuteStatementOutput", qd = "ExclusiveStartTableName", Jd = "ExecuteStatement", Yd = "Endpoints", Xd = "Enabled", Zd = "Endpoint", Qd = "Expected", $d = "Exists", ef = "FilterConditionMap", tf = "FilterExpression", nf = "GlobalSecondaryIndexes", rf = "GlobalSecondaryIndexDescription", af = "GlobalSecondaryIndexDescriptionList", of = "GlobalSecondaryIndexList", sf = "GlobalSecondaryIndexWarmThroughputDescription", cf = "GlobalSecondaryIndex", lf = "GlobalTableAlreadyExistsException", uf = "GlobalTableNotFoundException", df = "GlobalTableSourceArn", ff = "GlobalTableSettingsReplicationMode", pf = "GlobalTableVersion", mf = "GlobalTableWitnesses", hf = "GlobalTableWitnessDescription", gf = "GlobalTableWitnessDescriptionList", _f = "Item", vf = "IndexArn", yf = "ItemCount", bf = "ImportConflictException", xf = "ItemCollectionKey", Sf = "ItemCollectionKeyAttributeMap", Cf = "ItemCollectionMetrics", wf = "ItemCollectionSizeLimitExceededException", Tf = "InaccessibleEncryptionDateTime", Ef = "InvalidEndpointException", Df = "InvalidExportTimeException", Of = "ItemList", kf = "IndexName", Af = "ImportNotFoundException", jf = "IndexNotFoundException", Mf = "IdempotentParameterMismatchException", Nf = "InvalidRestoreTimeException", Pf = "IndexStatus", Ff = "IndexSizeBytes", If = "InternalServerError", Lf = "Items", Rf = "Key", zf = "KeyConditions", Bf = "KeyConditionExpression", Vf = "KMSMasterKeyArn", Hf = "KMSMasterKeyId", Uf = "KeySchema", Wf = "KeySchemaElement", Gf = "KeyType", Kf = "Limit", qf = "ListAttributeValue", Jf = "LastDecreaseDateTime", Yf = "LimitExceededException", Xf = "LastEvaluatedKey", Zf = "LastEvaluatedTableName", Qf = "LastIncreaseDateTime", $f = "LatestStreamArn", ep = "LocalSecondaryIndexes", tp = "LocalSecondaryIndexDescription", np = "LocalSecondaryIndexDescriptionList", rp = "LocalSecondaryIndexList", ip = "LocalSecondaryIndex", ap = "LatestStreamLabel", op = "ListTables", sp = "ListTablesInput", cp = "ListTablesOutput", lp = "LastUpdateDateTime", up = "LastUpdateToPayPerRequestDateTime", dp = "L", fp = "Message", pp = "MapAttributeValue", mp = "MultiRegionConsistency", hp = "MaxReadRequestUnits", gp = "MaxWriteRequestUnits", _p = "M", vp = "N", yp = "NonKeyAttributes", bp = "NumberOfDecreasesToday", xp = "NS", Sp = "NextToken", Cp = "NULL", wp = "OnDemandThroughput", Tp = "OnDemandThroughputOverride", Ep = "Parameters", Dp = "ProjectionExpression", Op = "PutItem", kp = "PutItemInput", Ap = "PutItemInputAttributeMap", jp = "PutItemOutput", Mp = "PointInTimeRecoveryUnavailableException", Np = "PolicyNotFoundException", Pp = "PreparedStatementParameters", Fp = "ProvisionedThroughput", Ip = "ProvisionedThroughputDescription", Lp = "ProvisionedThroughputExceededException", Rp = "ProvisionedThroughputOverride", zp = "ProjectionType", Bp = "Projection", Vp = "Query", Hp = "QueryFilter", Up = "QueryInput", Wp = "QueryOutput", Gp = "ReplicaAlreadyExistsException", Kp = "ReplicaArn", qp = "ReturnConsumedCapacity", Jp = "ReadCapacityUnits", Yp = "ReplicaDescription", Xp = "ReplicaDescriptionList", Zp = "RestoreDateTime", Qp = "ReplicaGlobalSecondaryIndexDescription", $p = "ReplicaGlobalSecondaryIndexDescriptionList", em = "ReturnItemCollectionMetrics", tm = "ReplicaInaccessibleDateTime", nm = "RestoreInProgress", rm = "ResourceInUseException", im = "RequestLimitExceeded", am = "RegionName", om = "ReplicaNotFoundException", sm = "ResourceNotFoundException", cm = "ResourcePolicy", lm = "ReplicaStatusDescription", um = "ReplicaStatusPercentProgress", dm = "ReplicaStatus", fm = "RestoreSummary", pm = "ReplicaTableClassSummary", mm = "ReadUnitsPerSecond", hm = "ReturnValues", gm = "ReturnValuesOnConditionCheckFailure", _m = "ReplicatedWriteConflictException", vm = "Replicas", ym = "SourceBackupArn", bm = "ScannedCount", xm = "StreamEnabled", Sm = "SizeEstimateRangeGB", Cm = "ScanFilter", wm = "ScanInput", Tm = "SecondaryIndexesCapacityMap", Em = "ScanIndexForward", Dm = "ScanOutput", Om = "StreamSpecification", km = "SearchSchemaElement", Am = "SSEDescription", jm = "SSESpecification", Mm = "SearchSchemaElementType", Nm = "SSEType", Pm = "SS", Fm = "SearchSchema", Im = "SourceTableArn", Lm = "StreamViewType", Rm = "S", zm = "Scan", Bm = "Select", Vm = "Segment", Hm = "Statement", Um = "Status", Wm = "Table", Gm = "TableArn", Km = "TableAlreadyExistsException", qm = "TableClass", Jm = "TransactionCanceledException", Ym = "TransactionConflictException", Xm = "TableClassSummary", Zm = "TableDescription", Qm = "ThrottlingException", $m = "TableId", eh = "TransactionInProgressException", th = "TableInUseException", nh = "TagList", rh = "TableName", ih = "TableNotFoundException", ah = "TableNames", oh = "ThrottlingReasons", sh = "ThrottlingReasonList", ch = "ThrottlingReason", lh = "TableSizeBytes", uh = "TableStatus", dh = "TotalSegments", fh = "TableWarmThroughputDescription", ph = "Tags", mh = "Tag", hh = "Value", gh = "VectorAttribute", _h = "VectorAttributeDefinition", vh = "VectorCapacity", yh = "VectorIndexes", bh = "VectorIndexesCapacityMap", xh = "VectorIndexDescription", Sh = "VectorIndexDescriptionList", Ch = "VectorIndexList", wh = "VectorIndex", Th = "VectorSearchRequestBytes", Eh = "VectorWriteRequestBytes", Dh = "WriteCapacityUnits", Oh = "WitnessStatus", kh = "WarmThroughput", Ah = "WriteUnitsPerSecond", jh = "awsQueryError", N = "client", P = "error", Mh = "httpError", F = "message", Nh = "reason", Ph = "resource", Fh = "smithy.ts.sdk.synthetic.com.amazonaws.dynamodb", Ih = "server", Lh = "throttlingReasons", I = "com.amazonaws.dynamodb", Rh = new Xe(Fh), zh = [
	-3,
	Fh,
	"DynamoDBServiceException",
	0,
	[],
	[]
];
Rh.registerError(zh, M);
var L = new Xe(I), Bh = [
	-3,
	I,
	Xu,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Bh, eu);
var Vh = [
	-3,
	I,
	$u,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Vh, tu);
var Hh = [
	-3,
	I,
	od,
	{ [P]: N },
	[F, _f],
	[0, () => K_]
];
L.registerError(Hh, Nu);
var Uh = [
	-3,
	I,
	id,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Uh, uu);
var Wh = [
	-3,
	I,
	Od,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Wh, xu);
var Gh = [
	-3,
	I,
	Hd,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Gh, wu);
var Kh = [
	-3,
	I,
	Ud,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Kh, vu);
var qh = [
	-3,
	I,
	lf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(qh, mu);
var Jh = [
	-3,
	I,
	uf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Jh, yu);
var Yh = [
	-3,
	I,
	Mf,
	{ [P]: N },
	[fp],
	[0]
];
L.registerError(Yh, Su);
var Xh = [
	-3,
	I,
	bf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Xh, Du);
var Zh = [
	-3,
	I,
	Af,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Zh, bu);
var Qh = [
	-3,
	I,
	jf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(Qh, Mu);
var $h = [
	-3,
	I,
	If,
	{ [P]: Ih },
	[F],
	[0]
];
L.registerError($h, nu);
var eg = [
	-3,
	I,
	Ef,
	{
		[P]: N,
		[Mh]: 421
	},
	[fp],
	[0]
];
L.registerError(eg, au);
var tg = [
	-3,
	I,
	Df,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(tg, Tu);
var ng = [
	-3,
	I,
	Nf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(ng, ku);
var rg = [
	-3,
	I,
	wf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(rg, cu);
var ig = [
	-3,
	I,
	Yf,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(ig, du);
var ag = [
	-3,
	I,
	Mp,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(ag, Eu);
var og = [
	-3,
	I,
	Np,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(og, _u);
var sg = [
	-3,
	I,
	Lp,
	{ [P]: N },
	[F, oh],
	[0, () => U_]
];
L.registerError(sg, ou);
var cg = [
	-3,
	I,
	Gp,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(cg, Au);
var lg = [
	-3,
	I,
	om,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(lg, ju);
var ug = [
	-3,
	I,
	_m,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(ug, lu);
var dg = [
	-3,
	I,
	im,
	{ [P]: N },
	[F, oh],
	[0, () => U_]
];
L.registerError(dg, ru);
var fg = [
	-3,
	I,
	rm,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(fg, hu);
var pg = [
	-3,
	I,
	sm,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(pg, su);
var mg = [
	-3,
	I,
	Km,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(mg, Ou);
var hg = [
	-3,
	I,
	th,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(hg, fu);
var gg = [
	-3,
	I,
	ih,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(gg, pu);
var _g = [
	-3,
	I,
	Qm,
	{
		[jh]: ["Throttling", 400],
		[P]: N,
		[Mh]: 400
	},
	[F, Lh],
	[0, () => U_]
];
L.registerError(_g, iu);
var vg = [
	-3,
	I,
	Jm,
	{ [P]: N },
	[fp, fd],
	[0, () => O_]
];
L.registerError(vg, Pu);
var yg = [
	-3,
	I,
	Ym,
	{ [P]: N },
	[F],
	[0]
];
L.registerError(yg, gu);
var bg = [
	-3,
	I,
	eh,
	{ [P]: N },
	[fp],
	[0]
];
L.registerError(bg, Cu);
var xg = [Rh, L], Sg = [
	3,
	I,
	Hu,
	0,
	[
		Lu,
		Vu,
		Fu
	],
	[
		4,
		0,
		0
	]
], Cg = [
	3,
	I,
	Iu,
	0,
	[Bu, Uu],
	[0, 0],
	2
], wg = [
	3,
	I,
	Qu,
	0,
	[Zu, up],
	[0, 4]
], Tg = [
	3,
	I,
	md,
	0,
	[
		_f,
		rd,
		fp
	],
	[
		() => K_,
		0,
		0
	]
], Eg = [
	3,
	I,
	bd,
	0,
	[
		Jp,
		Dh,
		yd
	],
	[
		1,
		1,
		1
	]
], Dg = [
	3,
	I,
	xd,
	0,
	[ld, Ku],
	[0, () => D_],
	1
], Og = [
	3,
	I,
	ad,
	0,
	[
		rh,
		yd,
		Jp,
		Dh,
		Wm,
		ep,
		nf,
		yh
	],
	[
		0,
		1,
		1,
		1,
		() => Eg,
		() => tv,
		() => tv,
		() => nv
	]
], kg = [
	3,
	I,
	gd,
	0,
	[
		rh,
		Ru,
		Uf,
		ep,
		nf,
		Zu,
		Fp,
		Om,
		jm,
		ph,
		qm,
		kd,
		kh,
		cm,
		wp,
		df,
		ff,
		yh
	],
	[
		0,
		() => E_,
		() => P_,
		() => L_,
		() => j_,
		0,
		() => e_,
		() => h_,
		() => m_,
		() => H_,
		0,
		2,
		() => T_,
		0,
		() => Zg,
		0,
		0,
		() => G_
	],
	1
], Ag = [
	3,
	I,
	_d,
	0,
	[Zm],
	[() => __]
], jg = [
	3,
	I,
	Md,
	0,
	[rh],
	[0],
	1
], Mg = [
	3,
	I,
	Pd,
	0,
	[Zm],
	[() => __]
], Ng = [
	3,
	I,
	Td,
	0,
	[],
	[]
], Pg = [
	3,
	I,
	Ed,
	0,
	[Yd],
	[() => k_],
	1
], Fg = [
	3,
	I,
	Nd,
	0,
	[rh],
	[0],
	1
], Ig = [
	3,
	I,
	Fd,
	0,
	[Wm],
	[() => __]
], Lg = [
	3,
	I,
	Zd,
	0,
	[qu, dd],
	[0, 1],
	2
], Rg = [
	3,
	I,
	Wd,
	0,
	[
		Hm,
		Ep,
		hd,
		Sp,
		qp,
		Kf,
		gm
	],
	[
		0,
		() => R_,
		2,
		0,
		0,
		1,
		0
	],
	1
], zg = [
	3,
	I,
	Kd,
	0,
	[
		Lf,
		Sp,
		ad,
		Xf
	],
	[
		() => N_,
		0,
		() => Og,
		() => Z_
	]
], Bg = [
	3,
	I,
	Vd,
	0,
	[
		hh,
		$d,
		ld,
		Ku
	],
	[
		() => rv,
		2,
		0,
		() => D_
	]
], Vg = [
	3,
	I,
	cf,
	0,
	[
		kf,
		Uf,
		Bp,
		Fp,
		wp,
		kh
	],
	[
		0,
		() => P_,
		() => $g,
		() => e_,
		() => Zg,
		() => T_
	],
	3
], Hg = [
	3,
	I,
	rf,
	0,
	[
		kf,
		Uf,
		Bp,
		Pf,
		Yu,
		Fp,
		Ff,
		yf,
		vf,
		wp,
		kh
	],
	[
		0,
		() => P_,
		() => $g,
		0,
		2,
		() => t_,
		1,
		1,
		0,
		() => Zg,
		() => Ug
	]
], Ug = [
	3,
	I,
	sf,
	0,
	[
		mm,
		Ah,
		Um
	],
	[
		1,
		1,
		0
	]
], Wg = [
	3,
	I,
	hf,
	0,
	[am, Oh],
	[0, 0]
], Gg = [
	3,
	I,
	Cf,
	0,
	[xf, Sm],
	[() => X_, 65]
], Kg = [
	3,
	I,
	Wf,
	0,
	[Bu, Gf],
	[0, 0],
	2
], qg = [
	3,
	I,
	sp,
	0,
	[qd, Kf],
	[0, 1]
], Jg = [
	3,
	I,
	cp,
	0,
	[ah, Zf],
	[64, 0]
], Yg = [
	3,
	I,
	ip,
	0,
	[
		kf,
		Uf,
		Bp
	],
	[
		0,
		() => P_,
		() => $g
	],
	3
], Xg = [
	3,
	I,
	tp,
	0,
	[
		kf,
		Uf,
		Bp,
		Ff,
		yf,
		vf
	],
	[
		0,
		() => P_,
		() => $g,
		1,
		1,
		0
	]
], Zg = [
	3,
	I,
	wp,
	0,
	[hp, gp],
	[1, 1]
], Qg = [
	3,
	I,
	Tp,
	0,
	[hp],
	[1]
], $g = [
	3,
	I,
	Bp,
	0,
	[zp, yp],
	[0, 64]
], e_ = [
	3,
	I,
	Fp,
	0,
	[Jp, Dh],
	[1, 1],
	2
], t_ = [
	3,
	I,
	Ip,
	0,
	[
		Qf,
		Jf,
		bp,
		Jp,
		Dh
	],
	[
		4,
		4,
		1,
		1,
		1
	]
], n_ = [
	3,
	I,
	Rp,
	0,
	[Jp],
	[1]
], r_ = [
	3,
	I,
	kp,
	0,
	[
		rh,
		_f,
		Qd,
		hm,
		qp,
		em,
		ud,
		cd,
		Rd,
		zd,
		gm
	],
	[
		0,
		() => ev,
		() => q_,
		0,
		0,
		0,
		0,
		0,
		128,
		() => J_,
		0
	],
	2
], i_ = [
	3,
	I,
	jp,
	0,
	[
		Ju,
		ad,
		Cf
	],
	[
		() => K_,
		() => Og,
		() => Gg
	]
], a_ = [
	3,
	I,
	Up,
	0,
	[
		rh,
		kf,
		Bm,
		Wu,
		Kf,
		hd,
		zf,
		Hp,
		ud,
		Em,
		Gd,
		qp,
		Dp,
		tf,
		Bf,
		Rd,
		zd
	],
	[
		0,
		0,
		0,
		64,
		1,
		2,
		() => Q_,
		() => Y_,
		0,
		2,
		() => Z_,
		0,
		0,
		0,
		0,
		128,
		() => J_
	],
	1
], o_ = [
	3,
	I,
	Wp,
	0,
	[
		Lf,
		Sd,
		bm,
		Xf,
		ad
	],
	[
		() => N_,
		1,
		1,
		() => Z_,
		() => Og
	]
], s_ = [
	3,
	I,
	Yp,
	0,
	[
		am,
		dm,
		Kp,
		lm,
		um,
		Hf,
		Rp,
		Tp,
		kh,
		nf,
		tm,
		pm,
		ff
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		() => n_,
		() => Qg,
		() => v_,
		() => B_,
		4,
		() => g_,
		0
	]
], c_ = [
	3,
	I,
	Qp,
	0,
	[
		kf,
		Rp,
		Tp,
		kh
	],
	[
		0,
		() => n_,
		() => Qg,
		() => Ug
	]
], l_ = [
	3,
	I,
	fm,
	0,
	[
		Zp,
		nm,
		ym,
		Im
	],
	[
		4,
		2,
		0,
		0
	],
	2
], u_ = [
	3,
	I,
	wm,
	0,
	[
		rh,
		kf,
		Wu,
		Kf,
		Bm,
		Cm,
		ud,
		Gd,
		qp,
		dh,
		Vm,
		Dp,
		tf,
		Rd,
		zd,
		hd
	],
	[
		0,
		0,
		64,
		1,
		0,
		() => Y_,
		0,
		() => Z_,
		0,
		1,
		1,
		0,
		0,
		128,
		() => J_,
		2
	],
	1
], d_ = [
	3,
	I,
	Dm,
	0,
	[
		Lf,
		Sd,
		bm,
		Xf,
		ad
	],
	[
		() => N_,
		1,
		1,
		() => Z_,
		() => Og
	]
], f_ = [
	3,
	I,
	km,
	0,
	[Bu, Mm],
	[0, 0],
	2
], p_ = [
	3,
	I,
	Am,
	0,
	[
		Um,
		Nm,
		Vf,
		Tf
	],
	[
		0,
		0,
		0,
		4
	]
], m_ = [
	3,
	I,
	jm,
	0,
	[
		Xd,
		Nm,
		Hf
	],
	[
		2,
		0,
		0
	]
], h_ = [
	3,
	I,
	Om,
	0,
	[xm, Lm],
	[2, 0],
	1
], g_ = [
	3,
	I,
	Xm,
	0,
	[qm, lp],
	[0, 4]
], __ = [
	3,
	I,
	Zm,
	0,
	[
		Ru,
		rh,
		Uf,
		uh,
		sd,
		Fp,
		lh,
		yf,
		Gm,
		$m,
		Qu,
		ep,
		nf,
		Om,
		ap,
		$f,
		pf,
		vm,
		mf,
		ff,
		fm,
		Am,
		Hu,
		Xm,
		kd,
		Ad,
		wp,
		kh,
		mp,
		yh
	],
	[
		() => E_,
		0,
		() => P_,
		0,
		4,
		() => t_,
		1,
		1,
		0,
		0,
		() => wg,
		() => I_,
		() => A_,
		() => h_,
		0,
		0,
		0,
		() => z_,
		() => M_,
		0,
		() => l_,
		() => p_,
		() => Sg,
		() => g_,
		2,
		2,
		() => Zg,
		() => v_,
		0,
		() => W_
	]
], v_ = [
	3,
	I,
	fh,
	0,
	[
		mm,
		Ah,
		Um
	],
	[
		1,
		1,
		0
	]
], y_ = [
	3,
	I,
	mh,
	0,
	[Rf, hh],
	[0, 0],
	2
], b_ = [
	3,
	I,
	ch,
	0,
	[Nh, Ph],
	[0, 0]
], x_ = [
	3,
	I,
	_h,
	0,
	[Bu],
	[0],
	1
], S_ = [
	3,
	I,
	vh,
	0,
	[Th, Eh],
	[1, 1]
], C_ = [
	3,
	I,
	wh,
	0,
	[
		kf,
		gh,
		Bp,
		Cd,
		Dd,
		Fm
	],
	[
		0,
		() => x_,
		() => $g,
		1,
		0,
		() => V_
	],
	5
], w_ = [
	3,
	I,
	xh,
	0,
	[
		kf,
		Fm,
		Bp,
		gh,
		Cd,
		Dd,
		Pf,
		Yu,
		Ff,
		yf,
		vf
	],
	[
		0,
		() => V_,
		() => $g,
		() => x_,
		1,
		0,
		0,
		2,
		1,
		1,
		0
	]
], T_ = [
	3,
	I,
	kh,
	0,
	[mm, Ah],
	[1, 1]
], E_ = [
	1,
	I,
	Ru,
	0,
	() => Cg
], D_ = [
	1,
	I,
	Ku,
	0,
	() => rv
], O_ = [
	1,
	I,
	pd,
	0,
	() => Tg
], k_ = [
	1,
	I,
	Yd,
	0,
	() => Lg
], A_ = [
	1,
	I,
	af,
	0,
	() => Hg
], j_ = [
	1,
	I,
	of,
	0,
	() => Vg
], M_ = [
	1,
	I,
	gf,
	0,
	() => Wg
], N_ = [
	1,
	I,
	Of,
	0,
	() => K_
], P_ = [
	1,
	I,
	Uf,
	0,
	() => Kg
], F_ = [
	1,
	I,
	qf,
	0,
	() => rv
], I_ = [
	1,
	I,
	np,
	0,
	() => Xg
], L_ = [
	1,
	I,
	rp,
	0,
	() => Yg
], R_ = [
	1,
	I,
	Pp,
	0,
	() => rv
], z_ = [
	1,
	I,
	Xp,
	0,
	() => s_
], B_ = [
	1,
	I,
	$p,
	0,
	() => c_
], V_ = [
	1,
	I,
	Fm,
	0,
	() => f_
], H_ = [
	1,
	I,
	nh,
	0,
	() => y_
], U_ = [
	1,
	I,
	sh,
	0,
	() => b_
], W_ = [
	1,
	I,
	Sh,
	0,
	() => w_
], G_ = [
	1,
	I,
	Ch,
	0,
	() => C_
], K_ = [
	2,
	I,
	zu,
	0,
	0,
	() => rv
], q_ = [
	2,
	I,
	Ld,
	0,
	0,
	() => Bg
], J_ = [
	2,
	I,
	Bd,
	0,
	0,
	() => rv
], Y_ = [
	2,
	I,
	ef,
	0,
	0,
	() => Dg
], X_ = [
	2,
	I,
	Sf,
	0,
	0,
	() => rv
], Z_ = [
	2,
	I,
	Rf,
	0,
	0,
	() => rv
], Q_ = [
	2,
	I,
	zf,
	0,
	0,
	() => Dg
], $_ = [
	2,
	I,
	pp,
	0,
	0,
	() => rv
], ev = [
	2,
	I,
	Ap,
	0,
	0,
	() => rv
], tv = [
	2,
	I,
	Tm,
	0,
	0,
	() => Eg
], nv = [
	2,
	I,
	bh,
	0,
	0,
	() => S_
], rv = [
	4,
	I,
	Gu,
	0,
	[
		Rm,
		vp,
		nd,
		Pm,
		xp,
		td,
		_p,
		dp,
		Cp,
		ed
	],
	[
		0,
		0,
		21,
		64,
		64,
		85,
		() => $_,
		() => F_,
		2,
		2
	]
], iv = [
	9,
	I,
	vd,
	0,
	() => kg,
	() => Ag
], av = [
	9,
	I,
	jd,
	0,
	() => jg,
	() => Mg
], ov = [
	9,
	I,
	wd,
	0,
	() => Ng,
	() => Pg
], sv = [
	9,
	I,
	Id,
	0,
	() => Fg,
	() => Ig
], cv = [
	9,
	I,
	Jd,
	0,
	() => Rg,
	() => zg
], lv = [
	9,
	I,
	op,
	0,
	() => qg,
	() => Jg
], uv = [
	9,
	I,
	Op,
	0,
	() => r_,
	() => i_
], dv = [
	9,
	I,
	Vp,
	0,
	() => a_,
	() => o_
], fv = [
	9,
	I,
	zm,
	0,
	() => u_,
	() => d_
], pv = class extends Xl(Zl, $l, "DescribeEndpoints", ov) {}, mv = {
	name: "@aws-sdk/client-dynamodb",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Dynamodb Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-dynamodb",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-dynamodb"
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
		"@aws-sdk/dynamodb-codec": "^3.973.50",
		"@aws-sdk/middleware-endpoint-discovery": "^3.972.34",
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
function hv(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function gv(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
fe();
var _v = { supported: void 0 }, vv = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), _v.supported === void 0 && (_v.supported = typeof Request < "u" && "keepalive" in hv("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = yv(t);
			return Promise.reject(e);
		}
		let s = e.path, c = go(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), _v.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(hv(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new de({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new de({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), gv(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(yv(t));
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
function yv(e) {
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
C();
var bv = class {
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
		let i = Xe.for(r), a = Xe.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = it(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return it(e, t);
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
			return e.find((e) => S.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
C();
var xv = class extends ao {
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
		}), this.serviceTarget = n, this.codec = i ?? new $o({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new bv(this.awsQueryCompatible);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`, r.headers["x-amz-target"] = `${this.serviceTarget}.${e.name}`, this.awsQueryCompatible && (r.headers["x-amzn-query-mode"] = "true"), De(e.input) !== "unit" && r.body || (r.body = "{}"), r;
	}
	getPayloadCodec() {
		return this.codec;
	}
	async handleError(e, t, n, r, i) {
		let { awsQueryCompatible: a } = this;
		a && this.mixin.setQueryCompatError(r, n);
		let o = No(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = S.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, Sv = class extends xv {
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
		return "aws.protocols#awsJson1_0";
	}
	getJsonRpcVersion() {
		return "1.0";
	}
	getDefaultContentType() {
		return "application/x-amz-json-1.0";
	}
};
C(), O();
var Cv = "com.amazonaws.dynamodb#AttributeValue", wv = class extends Qo {
	writeValue(e, t, n) {
		if (typeof t == "object" && t) {
			let n = S.of(e);
			if (n.isStructSchema() && n.getName(!0) === Cv) {
				this.writeAttributeValue(t);
				return;
			}
		}
		super.writeValue(e, t, n);
	}
	writeAttributeValue(e) {
		let t = this.serdeContext?.base64Encoder ?? Ot;
		this.writeAscii("{");
		let n = !0;
		for (let r in e) {
			let i = e[r];
			if (i != null) switch (n || this.writeAscii(","), n = !1, this.writeAsciiQuoted(r), this.writeAscii(":"), r) {
				case "B":
					i instanceof Uint8Array ? this.writeBase64(i) : this.writeJsonString(i);
					break;
				case "BS":
					this.writeAscii("[");
					{
						let e = i;
						for (let n = 0; n < e.length; n++) {
							n > 0 && this.writeAscii(",");
							let r = e[n];
							r instanceof Uint8Array ? this.writeBase64(r) : this.writeJsonString(t(r));
						}
					}
					this.writeAscii("]");
					break;
				case "L":
					this.writeAscii("[");
					{
						let e = i;
						for (let t = 0; t < e.length; t++) t > 0 && this.writeAscii(","), e[t] == null ? this.writeAscii("null") : this.writeAttributeValue(e[t]);
					}
					this.writeAscii("]");
					break;
				case "M":
					this.writeAscii("{");
					{
						let e = i, t = !0;
						for (let n in e) e[n] != null && (t || this.writeAscii(","), t = !1, this.writeJsonString(n), this.writeAscii(":"), this.writeAttributeValue(e[n]));
					}
					this.writeAscii("}");
					break;
				case "SS":
				case "NS":
					this.writeAscii("[");
					{
						let e = i;
						for (let t = 0; t < e.length; t++) t > 0 && this.writeAscii(","), this.writeJsonString(e[t]);
					}
					this.writeAscii("]");
					break;
				case "S":
				case "N":
					this.writeJsonString(i);
					break;
				case "BOOL":
					this.writeAscii(i ? "true" : "false");
					break;
				case "NULL":
					this.writeAscii(i ? "true" : "false");
					break;
				default: this.writeAscii(JSON.stringify(i));
			}
		}
		this.writeAscii("}");
	}
}, Tv = class extends Fo {
	_read(e, t) {
		let n = S.of(e);
		return n.isStructSchema() && n.getName(!0) === Cv && t && typeof t == "object" ? this.readAttributeValue(t) : super._read(n, t);
	}
	readAttributeValue(e) {
		let t = this.serdeContext?.base64Decoder ?? wt, n = e;
		if (typeof e.B == "string" && (n.B = t(e.B)), Array.isArray(e.BS) && (n.BS = e.BS.map(t)), Array.isArray(e.L) && (n.L = e.L.map((e) => this.readAttributeValue(e))), e.M && typeof e.M == "object") {
			let t = e.M;
			for (let e in t) t[e] = this.readAttributeValue(t[e]);
		}
		return n;
	}
}, Ev = class extends $o {
	constructor() {
		super({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		});
	}
	createSerializer() {
		let e = new wv(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Tv(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/bdd.js
Ti();
var R = "ref", z = "argv", B = -1, Dv = !0, Ov = !1, kv = "isSet", Av = "booleanEquals", jv = "PartitionResult", V = "stringEquals", H = "getAttr", Mv = "parsedEndpoint", Nv = "aws.parseArn", Pv = (e) => "ParsedArn_ssa_" + e, Fv = "service", Iv = "dynamodb", Lv = "isValidHostLabel", Rv = "accountId", zv = "FirstArn", Bv = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.search-ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", Vv = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", Hv = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.search-ddb.{Region}.{PartitionResult#dnsSuffix}", Uv = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.ddb.{Region}.{PartitionResult#dnsSuffix}", Wv = { [R]: "Region" }, Gv = { [R]: jv }, Kv = {
	fn: H,
	[z]: [{ [R]: Mv }, "authority"]
}, qv = { [R]: "AccountIdEndpointMode" }, Jv = {
	fn: H,
	[z]: [Gv, "name"]
}, Yv = { [R]: "ParsedArn_ssa_2" }, Xv = {
	fn: H,
	[z]: [Yv, "region"]
}, Zv = { [R]: "ResourceArnList" }, Qv = {
	fn: H,
	[z]: [{ [R]: "ParsedArn_ssa_1" }, "region"]
}, $v = { [R]: "ParsedArn_ssa_1" }, ey = { [R]: "AccountId" }, ty = {}, U = { metricValues: ["O"] }, ny = [Wv], ry = [{ [R]: "Endpoint" }], iy = [{ [R]: "ResourceArn" }], ay = {
	conditions: [
		[kv, ny],
		[kv, ry],
		[Av, [{ [R]: "UseFIPS" }, Dv]],
		[Av, [{ [R]: "UseDualStack" }, Dv]],
		[
			"aws.partition",
			ny,
			jv
		],
		[V, [Wv, "local"]],
		[Av, [{
			fn: H,
			[z]: [Gv, "supportsFIPS"]
		}, Dv]],
		[
			"parseURL",
			ry,
			Mv
		],
		[V, ["dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", Kv]],
		[Av, [{
			fn: H,
			[z]: [Gv, "supportsDualStack"]
		}, Dv]],
		[V, ["search-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", Kv]],
		[kv, [qv]],
		[V, [Wv, "us-gov-east-1"]],
		[V, [Wv, "cn-north-1"]],
		[V, [Wv, "cn-northwest-1"]],
		[V, [Wv, "us-gov-west-1"]],
		[V, [Jv, "aws"]],
		[V, [qv, "disabled"]],
		[kv, iy],
		[
			Nv,
			iy,
			Pv(2)
		],
		[V, [{
			fn: H,
			[z]: [Yv, Fv]
		}, Iv]],
		[V, [Xv, Wv]],
		[Lv, [{
			fn: H,
			[z]: [Yv, Rv]
		}, Ov]],
		[Lv, [Xv, Ov]],
		[kv, [Zv]],
		[
			H,
			[Zv, "[0]"],
			zv
		],
		[
			Nv,
			[{ [R]: zv }],
			Pv(1)
		],
		[V, [Qv, Wv]],
		[V, [{
			fn: H,
			[z]: [$v, Fv]
		}, Iv]],
		[Lv, [{
			fn: H,
			[z]: [$v, Rv]
		}, Ov]],
		[Lv, [Qv, Ov]],
		[kv, [ey]],
		[V, [qv, "required"]],
		[Lv, [ey, Ov]],
		[V, [Jv, "aws-us-gov"]],
		[Av, [{
			fn: "coalesce",
			[z]: [{ [R]: "IsSearchOperation" }, Ov]
		}, Dv]]
	],
	results: [
		[B],
		[B, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[B, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[B, "Endpoint override is not supported for dual-stack endpoints. Please enable dual-stack functionality by enabling the configuration. For more details, see: https://docs.aws.amazon.com/sdkref/latest/guide/feature-endpoints.html"],
		["{Endpoint}", ty],
		[B, "Invalid Configuration: FIPS and local endpoint are not supported"],
		[B, "Invalid Configuration: Dualstack and local endpoint are not supported"],
		["http://localhost:8000", { authSchemes: [{
			signingRegion: "us-east-1",
			name: "sigv4",
			signingName: Iv
		}] }],
		[B, "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported"],
		["https://search-dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", ty],
		["https://dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", ty],
		[B, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://search-dynamodb.{Region}.{PartitionResult#dnsSuffix}", ty],
		["https://dynamodb.{Region}.{PartitionResult#dnsSuffix}", ty],
		["https://search-dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", ty],
		["https://dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", ty],
		[B, "FIPS is enabled but this partition does not support FIPS"],
		[B, "Invalid Configuration: AccountIdEndpointMode is required but account endpoints are not supported in this region"],
		["https://search-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", ty],
		["https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", ty],
		[Bv(2), U],
		[Vv(2), U],
		[Bv(1), U],
		[Vv(1), U],
		["https://{AccountId}.search-ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", U],
		["https://{AccountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", U],
		[B, "Credentials-sourced account ID parameter is invalid"],
		[B, "AccountIdEndpointMode is required but no AccountID was provided or able to be loaded"],
		[B, "DualStack is enabled but this partition does not support DualStack"],
		[Hv(2), U],
		[Uv(2), U],
		[Hv(1), U],
		[Uv(1), U],
		["https://{AccountId}.search-ddb.{Region}.{PartitionResult#dnsSuffix}", U],
		["https://{AccountId}.ddb.{Region}.{PartitionResult#dnsSuffix}", U],
		[B, "Invalid Configuration: Missing Region"]
	]
}, oy = 2, sy = new Int32Array([
	-1,
	1,
	-1,
	0,
	6,
	3,
	1,
	4,
	100000035,
	2,
	100000001,
	5,
	3,
	100000002,
	100000004,
	1,
	85,
	7,
	2,
	69,
	8,
	3,
	38,
	9,
	4,
	10,
	100000035,
	5,
	100000007,
	11,
	11,
	12,
	77,
	12,
	18,
	13,
	13,
	18,
	14,
	14,
	18,
	15,
	15,
	18,
	16,
	16,
	18,
	17,
	32,
	100000017,
	77,
	17,
	37,
	19,
	18,
	20,
	25,
	19,
	21,
	25,
	20,
	22,
	25,
	21,
	23,
	25,
	22,
	24,
	25,
	23,
	36,
	25,
	24,
	26,
	32,
	25,
	27,
	32,
	26,
	28,
	32,
	27,
	29,
	32,
	28,
	30,
	32,
	29,
	31,
	32,
	30,
	35,
	32,
	31,
	33,
	37,
	33,
	34,
	100000026,
	35,
	100000033,
	100000034,
	35,
	100000031,
	100000032,
	35,
	100000029,
	100000030,
	32,
	100000027,
	77,
	4,
	39,
	100000035,
	5,
	100000006,
	40,
	9,
	41,
	100000028,
	11,
	42,
	68,
	12,
	48,
	43,
	13,
	48,
	44,
	14,
	48,
	45,
	15,
	48,
	46,
	16,
	48,
	47,
	32,
	100000017,
	68,
	17,
	67,
	49,
	18,
	50,
	55,
	19,
	51,
	55,
	20,
	52,
	55,
	21,
	53,
	55,
	22,
	54,
	55,
	23,
	66,
	55,
	24,
	56,
	62,
	25,
	57,
	62,
	26,
	58,
	62,
	27,
	59,
	62,
	28,
	60,
	62,
	29,
	61,
	62,
	30,
	65,
	62,
	31,
	63,
	67,
	33,
	64,
	100000026,
	35,
	100000024,
	100000025,
	35,
	100000022,
	100000023,
	35,
	100000020,
	100000021,
	32,
	100000027,
	68,
	35,
	100000018,
	100000019,
	3,
	78,
	70,
	4,
	71,
	100000035,
	5,
	100000005,
	72,
	6,
	73,
	100000016,
	11,
	74,
	75,
	32,
	100000008,
	75,
	34,
	77,
	76,
	35,
	100000014,
	100000015,
	35,
	100000012,
	100000013,
	4,
	79,
	100000035,
	5,
	100000005,
	80,
	6,
	81,
	100000011,
	9,
	82,
	100000011,
	11,
	83,
	84,
	32,
	100000008,
	84,
	35,
	100000009,
	100000010,
	2,
	100000001,
	86,
	3,
	100000002,
	87,
	4,
	88,
	100000004,
	7,
	89,
	100000004,
	8,
	100000003,
	90,
	10,
	100000003,
	100000004
]), cy = dr.from(sy, oy, ay.conditions, ay.results);
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/endpointResolver.js
Ti();
var ly = new pr({
	size: 50,
	params: [
		"AccountId",
		"AccountIdEndpointMode",
		"Endpoint",
		"IsSearchOperation",
		"Region",
		"ResourceArn",
		"ResourceArnList",
		"UseDualStack",
		"UseFIPS"
	]
}), uy = (e, t = {}) => ly.get(e, () => xi(cy, {
	endpointParams: e,
	logger: t.logger
}));
Sr.aws = Oc, ra(), Se(), O();
var dy = (e) => ({
	apiVersion: "2012-08-10",
	base64Decoder: e?.base64Decoder ?? wt,
	base64Encoder: e?.base64Encoder ?? Ot,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? uy,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? Kl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new el()
	}],
	logger: e?.logger ?? new pt(),
	protocol: e?.protocol ?? Sv,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.dynamodb",
		errorTypeRegistries: xg,
		xmlNamespace: "http://dynamodb.amazonaws.com/doc/2012-08-10/",
		version: "2012-08-10",
		serviceTarget: "DynamoDB_20120810",
		jsonCodec: new Ev()
	},
	serviceId: e?.serviceId ?? "DynamoDB",
	sha256: e?.sha256 ?? ta,
	urlParser: e?.urlParser ?? xe,
	utf8Decoder: e?.utf8Decoder ?? Et,
	utf8Encoder: e?.utf8Encoder ?? Mt
});
O(), ji();
var fy = (e) => {
	let t = Ic(e), n = () => t().then(at), r = dy(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		accountIdEndpointMode: e?.accountIdEndpointMode ?? (() => Promise.resolve("preferred")),
		bodyLengthChecker: e?.bodyLengthChecker ?? Mn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Sc({
			serviceId: r.serviceId,
			clientVersion: mv.version
		}),
		endpointDiscoveryEnabledProvider: e?.endpointDiscoveryEnabledProvider ?? (() => Promise.resolve(void 0)),
		maxAttempts: e?.maxAttempts ?? (j.v2026 ? 4 : 3),
		region: e?.region ?? Te("Region is missing"),
		requestHandler: vv.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || Os),
		streamCollector: e?.streamCollector ?? Ai,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, py = (e) => {
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
}, my = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), hy = (e, t) => {
	let n = Object.assign(Rc(e), dt(e), so(e), py(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, zc(n), ft(n), co(n), my(n));
};
Ti(), C();
var gy = class extends Ee {
	config;
	constructor(...[e]) {
		let t = fy(e || {});
		super(t), this.initConfig = t;
		let n = Fs(Pc(Ms(ac(_t(Jl(t))), {
			defaultBaseDelay: j.v2026 ? 25 : void 0,
			defaultMaxAttempts: j.v2026 ? 4 : void 0
		}))), r = hy(Kc(ql(Ci(n)), { endpointDiscoveryCommandCtor: pv }), e?.extensions || []);
		this.config = r, this.middlewareStack.use(Ie(this.config)), this.middlewareStack.use(xc(this.config)), this.middlewareStack.use(Ns(this.config)), this.middlewareStack.use(po(this.config)), this.middlewareStack.use(Rs(this.config)), this.middlewareStack.use(Vs(this.config)), this.middlewareStack.use(Hs(this.config)), this.middlewareStack.use(qs(this.config, {
			httpAuthSchemeParametersProvider: Wl,
			identityProviderConfigProvider: async (e) => new ec({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Qs(this.config));
	}
	destroy() {
		super.destroy();
	}
}, _y = class extends Xl(Ql, $l, "CreateTable", iv) {}, vy = class extends Xl(Ql, $l, "DeleteTable", av) {}, yy = class extends Xl(Ql, $l, "DescribeTable", sv) {}, by = class extends Xl(Zl, $l, "ExecuteStatement", cv) {}, xy = class extends Xl(Zl, $l, "ListTables", lv) {}, Sy = class extends Xl(Ql, $l, "PutItem", uv) {}, Cy = class extends Xl(Ql, $l, "Query", dv) {}, wy = class extends Xl(Ql, $l, "Scan", fv) {}, Ty = class extends Error {
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
}, Ey = Symbol(), Dy = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), Oy = 1e4, ky = (e) => "headers" in e, Ay = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (ky(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? jy(e, {
		all: n,
		dot: r
	}) : {};
};
async function jy(e, t) {
	if (!ky(e) && e.bodyCache.formData) return My(await e.bodyCache.formData, t);
	let n = ky(e) ? e.headers : e.raw.headers, r = Dy(await e.arrayBuffer(), n.get("Content-Type") || "");
	ky(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? My(i, t) : {};
}
function My(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? Ny(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (Py(n, e, t, r), delete n[e]);
	}), n;
}
var Ny = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, Py = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && Fy(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= Oy && Fy(), i[e] = Object.create(null)), i = i[e]);
	});
}, Fy = () => {
	throw Error("Nesting limit exceeded");
}, Iy = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, Ly = (e) => {
	let { groups: t, path: n } = Ry(e);
	return zy(Iy(n), t);
}, Ry = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, zy = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, By = {}, Vy = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return By[r] || (By[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), By[r];
	}
	return null;
}, Hy = (e, t) => {
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
}, Uy = (e) => Hy(e, decodeURI), Wy = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return Uy(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, Gy = (e) => {
	let t = Wy(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, Ky = (e, t, ...n) => (n.length && (t = Ky(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), qy = (e) => {
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
}, Jy = (e) => e.indexOf("%") === -1 ? e : Hy(e, $y), Yy = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), Jy(e)), Xy = (e, t, n) => {
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
					return Yy(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = Yy(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = Yy(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, Zy = Xy, Qy = (e, t) => Xy(e, t, !0), $y = decodeURIComponent, eb = class {
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
		return n && Jy(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = Jy(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return Zy(this.url, e);
	}
	queries(e) {
		return Qy(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return Ay(this, e);
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
	get [Ey]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, tb = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, nb = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, rb = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => rb(e, t, !1, r, i))).then(() => i[0]));
	return n ? nb(await o, a) : o;
}, ib = "text/plain; charset=UTF-8", ab = (e, t) => ({
	"Content-Type": e,
	...t
}), ob = (e, t) => new Response(e, t), sb = class {
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
		return this.#t ??= new eb(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= ob(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = ob(e.body, e);
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
		this.finalized && (this.#a = ob(this.#a.body, this.#a));
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
		return ob(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, ab(ib, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, ab("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, ab("text/html; charset=UTF-8", n));
		return typeof e == "object" ? rb(e, tb.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => ob(), this.#c(this));
}, cb = (e, t, n) => (r, i) => {
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
}, lb = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], ub = "Can not add a route since the matcher is already built.", db = class extends Error {}, fb = "__COMPOSED_HANDLER", pb = (e) => e.text("404 Not Found", 404), mb = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, hb = class e {
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
		[...lb, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? Wy : Gy;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = pb;
	errorHandler = mb;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === mb ? r = e.handler : (r = async (n, r) => (await cb([], t.errorHandler)(n, () => e.handler(n, r))).res, r[fb] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = Ky(this._basePath, e), t;
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
			let t = Ky(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", Ky(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = Ky(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : Ky(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new sb(e, {
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
		let s = cb(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${Ky("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, W = () => Object.create(null), gb = [];
function _b(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], gb];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var vb = "[^/]+", yb = "(?:|/.*)", bb = Symbol(), xb = /* @__PURE__ */ new Set(".\\+*[^]$()");
function Sb(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var Cb = class e {
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
				vb
			] : null : s === "/*" ? [
				"",
				"",
				yb
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && xb.has(n))) throw bb;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw bb;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw bb;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw bb;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(Sb).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : xb.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, wb = class {
	#e = { varIndex: 0 };
	#t = new Cb();
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
}, Tb = W();
function Eb(e) {
	return Tb[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? yb : e === "*" ? ".*" : `/:${vb}`)}$`);
}
function Db(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (Eb(n).test(t)) return [...e[n]];
}
var Ob = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: W() }, this.#t = { ALL: W() }, this.#n = { ALL: new wb() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === bb ? new db(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(ub);
		if (!r[e]) {
			this.#n[e] = new wb();
			for (let t of [r, i]) {
				t[e] = W();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = Eb(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = Db(r[e], t) || Db(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = qy(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = Db(r[t], e) || Db(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = _b;
	buildAllMatchers() {
		let e = W();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, Tb = W(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = W(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), W())]) : i[t] = [n.map(([e]) => [e, W()]), gb];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, kb = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(ub);
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
				if (e instanceof db) continue;
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
}, Ab = W(), jb = 0, Mb = class e {
	#e = [];
	#t = W();
	#n = [];
	#r;
	#i = Ab;
	insert(t, n, r) {
		let i = this, a = Ly(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = Vy(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++jb
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
		this.#i = Ab;
		let r = [this], i = Iy(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === Ab ? {} : { ...p.#i };
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
}, Nb = class {
	name = "TrieRouter";
	#e = new Mb();
	add(e, t, n) {
		for (let r of qy(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, Pb = class extends hb {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new kb({ routers: [new Ob(), new Nb()] });
	}
}, Fb = [
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
}, Ib = class extends G {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, q = class extends G {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, Lb = class extends G {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, Rb = class extends G {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, J = class extends G {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, zb = class extends G {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, Bb = class extends G {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, Vb = class extends G {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, Hb = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function Ub(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && Hb.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function Wb(e, t) {
	let n = Gb(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function Gb(e, t) {
	if (e instanceof G) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return Ub(e) ? new Bb(r, { cause: e }) : new Vb(r, { cause: e });
}
var Kb = 1e3, qb = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function Jb(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new K("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new K("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new K("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = Yb(r)), a;
}
function Yb(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new K("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!qb.includes(t)) throw new K(`sortKey.operator must be one of ${qb.join(", ")}.`);
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
function Xb(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new K(`limit must be a whole number between 1 and ${Kb}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new K(`limit must be between 1 and ${Kb}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var Zb = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], Qb = {
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
}, $b = Object.keys(Qb).map((e) => ({
	service: e,
	...Qb[e]
})).sort(rx);
$b.map((e) => e.service);
function Y(e) {
	return Object.hasOwn(Qb, e);
}
function ex(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function tx(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function nx(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function rx(e, t) {
	let n = Zb.indexOf(e.group) - Zb.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var ix = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function ax(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${ix[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var ox = /* @__PURE__ */ new Set([
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
]), sx = /* @__PURE__ */ new Set([
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
]), cx = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), lx = /* @__PURE__ */ new Set([
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
]), ux = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), dx = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), fx = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function px(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function mx(e) {
	if (!px(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || ox.has(n)) return new Rb(r, i);
	if (sx.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new Lb(r, i);
	if (cx.has(n)) return new Ib(r, i);
	if (lx.has(n)) return new K(r, i);
	if (ux.has(n) || /\.NotFound$/.test(n)) return new q(r, i);
	if (dx.has(n)) return new zb(r, i);
	if (fx.has(n) || Ub(e)) return new Bb(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new K(r, i) : a === 401 || a === 403 ? new Ib(r, i) : a === 404 ? new q(r, i) : a === 409 ? new Lb(r, i) : a === 429 ? new Rb(r, i) : a === 501 ? new zb(r, i) : a === 503 || a === 504 ? new Bb(r, i) : new Vb(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function hx() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function gx(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var _x = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, vx = !1;
function yx(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = bx(t);
	return !n && !vx && (vx = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function bx(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(_x, t) ? _x[t] : null;
}
var xx = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), Sx = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), Cx = 5464, wx = 8192, Tx = 50, Ex = 12e4;
function Dx(e, t = hx) {
	let n = new Pb();
	n.onError((e, t) => {
		if (e instanceof G) {
			let { status: n, body: r } = Wb(e);
			return t.json(r, n);
		}
		return e instanceof Ty ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : yx();
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
		return Ux(e, 150), $(e, () => gx(Ex, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: Gx(i.schema(t, n), (t) => e.req.query(t))
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
			if (n.logGroupNames.length > Tx) throw new K(`logGroupNames must include at most ${Tx} log groups.`);
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
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), Vx(e));
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
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), Vx(e));
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
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", Hx(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), Vx(e));
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
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", Hx(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Q(e);
		if (!t) throw new q("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), Jb(n), Hx(n));
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
			let i = await Px(e);
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
			let i = jx((await Px(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!X(t) || !Y(n)) throw new q("Unknown cloud or service");
		let i = Mx(e.req.query());
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
		return Wx(e, async () => {
			let n = await Fx(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: Bx(n.plaintextBase64, "plaintextBase64", Cx),
				encryptionAlgorithm: Ix(n.encryptionAlgorithm),
				encryptionContext: zx(n.encryptionContext)
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
		return Wx(e, async () => {
			let n = await Fx(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: Bx(n.ciphertextBlobBase64, "ciphertextBlobBase64", wx),
				encryptionAlgorithm: Ix(n.encryptionAlgorithm),
				encryptionContext: zx(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of Fb) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
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
		return Wx(e, async () => {
			let n = await Fx(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: Bx(n.messageBase64, "messageBase64", Cx),
				signingAlgorithm: Lx(n.signingAlgorithm)
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
		return Wx(e, async () => {
			let n = await Fx(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: Bx(n.messageBase64, "messageBase64", Cx),
				signature: Bx(n.signatureBase64, "signatureBase64", wx),
				keyVersionId: Rx(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: Lx(n.signingAlgorithm)
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
			let i = await Px(e), a = await r(e).createResource(t, n, { values: i });
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
			let i = Nx(await Px(e));
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
var Ox = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], kx = 100, Ax = 100;
function jx(e) {
	if (!Array.isArray(e) || e.length === 0) throw new K("messages must contain at least one entry");
	if (e.length > Ax) throw new K(`messages must contain at most ${Ax} entries`);
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
function Mx(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new K("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!Ox.includes(n)) throw new K(`cursorType must be one of ${Ox.join(", ")}`);
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
		if (!Number.isInteger(t) || t < 1 || t > kx) throw new K(`limit must be an integer between 1 and ${kx}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function Nx(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new K(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function Px(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new K("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof K ? e : new K("Request body must be valid JSON");
	}
}
var Z = class extends K {};
async function Fx(e) {
	try {
		return await Px(e);
	} catch (e) {
		throw e instanceof K ? new Z(e.message) : e;
	}
}
function Ix(e) {
	if (typeof e != "string" || !xx.has(e)) throw new Z("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function Lx(e) {
	if (typeof e != "string" || !Sx.has(e)) throw new Z("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function Rx(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new Z(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function zx(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Z("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new Z("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function Bx(e, t, n) {
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
function Vx(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: Xb(e.req.query("limit"))
	};
}
function Hx(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new K("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new K("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: Xb(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function Ux(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function $(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Wb(t, mx);
		return e.json(r, n);
	}
}
async function Wx(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = Wb(t, mx);
		if (t instanceof Z) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function Gx(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
Dx();
// ../api/src/registry/CloudAdapterRegistry.ts
var Kx = class {
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
}, qx = async () => {}, Jx = {
	aws: qx,
	azure: qx,
	gcp: qx,
	oci: qx
};
function Yx() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var Xx = 5e3, Zx = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = Jx, n = yx(), r = null) {
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
		return Promise.all($b.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? ex(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: tx(t, e),
				docsUrl: ax(t, e),
				availability: a,
				reason: r.reason ?? Qx(a, e, o),
				route: nx(t, e),
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
			endpoint: Yx(e),
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
		if (r && Date.now() - r.at < Xx) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = Yx(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = Wb(r, mx);
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
		if (t && Date.now() - t.at < Xx) return t.value;
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
		let i = r.emptyBucket.bind(r), a = $x(e, t);
		if (this.emptying.has(a)) throw new Lb(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new Lb(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = $x(e, t);
		if (this.emptying.has(r)) throw new Lb(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
function Qx(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function $x(e, t) {
	return JSON.stringify([e, t]);
}
// ../../node_modules/.pnpm/@aws-sdk+util-dynamodb@3.996.9_@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/util-dynamodb/dist-es/NumberValue.js
var eS = class e {
	value;
	constructor(e) {
		this.value = typeof e == "object" && "N" in e ? String(e.N) : String(e);
		let t = typeof e.valueOf() == "number" ? e.valueOf() : 0;
		if (t > 2 ** 53 - 1 || t < -(2 ** 53 - 1) || Math.abs(t) === Infinity || Number.isNaN(t)) throw Error(`NumberValue should not be initialized with an imprecise number=${t}. Use a string instead.`);
	}
	static from(t) {
		return new e(t);
	}
	toAttributeValue() {
		return { N: this.toString() };
	}
	toBigInt() {
		let e = this.toString();
		return BigInt(e);
	}
	toString() {
		return String(this.value);
	}
	valueOf() {
		return this.toString();
	}
}, tS = (e, t) => {
	if (e === void 0) throw Error("Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.");
	if (e === null && typeof e == "object") return oS();
	if (Array.isArray(e)) return nS(e, t);
	if (e?.constructor?.name === "Set") return rS(e, t);
	if (e?.constructor?.name === "Map") return iS(e, t);
	if (e?.constructor?.name === "Object" || !e.constructor && typeof e == "object") return aS(e, t);
	if (fS(e)) return e.length === 0 && t?.convertEmptyValues ? oS() : sS(e);
	if (typeof e == "boolean" || e?.constructor?.name === "Boolean") return { BOOL: e.valueOf() };
	if (typeof e == "number" || e?.constructor?.name === "Number") return dS(e, t);
	if (e instanceof eS) return e.toAttributeValue();
	if (typeof e == "bigint") return lS(e);
	if (typeof e == "string" || e?.constructor?.name === "String") return e.length === 0 && t?.convertEmptyValues ? oS() : cS(e);
	if (t?.convertClassInstanceToMap && typeof e == "object") return aS(e, t);
	throw Error(`Unsupported type passed: ${e}. Pass options.convertClassInstanceToMap=true to marshall typeof object as map attribute.`);
}, nS = (e, t) => ({ L: e.filter((e) => typeof e != "function" && (!t?.removeUndefinedValues || t?.removeUndefinedValues && e !== void 0)).map((e) => tS(e, t)) }), rS = (e, t) => {
	let n = t?.removeUndefinedValues ? new Set([...e].filter((e) => e !== void 0)) : e;
	if (!t?.removeUndefinedValues && n.has(void 0)) throw Error("Pass options.removeUndefinedValues=true to remove undefined values from map/array/set.");
	if (n.size === 0) {
		if (t?.convertEmptyValues) return oS();
		throw Error("Pass a non-empty set, or options.convertEmptyValues=true.");
	}
	let r = n.values().next().value;
	if (r instanceof eS) return { NS: Array.from(n).map((e) => e.toString()) };
	if (typeof r == "number") return { NS: Array.from(n).map((e) => dS(e, t)).map((e) => e.N) };
	if (typeof r == "bigint") return { NS: Array.from(n).map(lS).map((e) => e.N) };
	if (typeof r == "string") return { SS: Array.from(n).map(cS).map((e) => e.S) };
	if (fS(r)) return { BS: Array.from(n).map(sS).map((e) => e.B) };
	throw Error("Only Number Set (NS), Binary Set (BS) or String Set (SS) are allowed.");
}, iS = (e, t) => ({ M: ((e) => {
	let n = {};
	for (let [r, i] of e) typeof i == "function" || i === void 0 && t?.removeUndefinedValues || (n[r] = tS(i, t));
	return n;
})(e) }), aS = (e, t) => ({ M: ((e) => {
	let n = {};
	for (let r in e) {
		let i = e[r];
		typeof i == "function" || i === void 0 && t?.removeUndefinedValues || (n[r] = tS(i, t));
	}
	return n;
})(e) }), oS = () => ({ NULL: !0 }), sS = (e) => ({ B: e }), cS = (e) => ({ S: e.toString() }), lS = (e) => ({ N: e.toString() }), uS = (e) => {
	throw Error(`${e} Use NumberValue from @aws-sdk/lib-dynamodb.`);
}, dS = (e, t) => {
	if ([
		NaN,
		Infinity,
		-Infinity
	].map((e) => e.toString()).includes(e.toString())) throw Error(`Special numeric value ${e.toString()} is not allowed`);
	return t?.allowImpreciseNumbers || (Number(e) > 2 ** 53 - 1 ? uS(`Number ${e.toString()} is greater than Number.MAX_SAFE_INTEGER.`) : Number(e) < -(2 ** 53 - 1) && uS(`Number ${e.toString()} is lesser than Number.MIN_SAFE_INTEGER.`)), { N: e.toString() };
}, fS = (e) => e?.constructor ? [
	"ArrayBuffer",
	"Blob",
	"Buffer",
	"DataView",
	"File",
	"Int8Array",
	"Uint8Array",
	"Uint8ClampedArray",
	"Int16Array",
	"Uint16Array",
	"Int32Array",
	"Uint32Array",
	"Float32Array",
	"Float64Array",
	"BigInt64Array",
	"BigUint64Array"
].includes(e.constructor.name) : !1, pS = (e, t) => {
	for (let [n, r] of Object.entries(e)) if (r !== void 0) switch (n) {
		case "NULL": return null;
		case "BOOL": return !!r;
		case "N": return mS(r, t);
		case "B": return gS(r);
		case "S": return hS(r);
		case "L": return _S(r, t);
		case "M": return vS(r, t);
		case "NS": return new Set(r.map((e) => mS(e, t)));
		case "BS": return new Set(r.map(gS));
		case "SS": return new Set(r.map(hS));
		default: throw Error(`Unsupported type passed: ${n}`);
	}
	throw Error(`No value defined: ${JSON.stringify(e)}`);
}, mS = (e, t) => {
	if (typeof t?.wrapNumbers == "function") return t?.wrapNumbers(e);
	if (t?.wrapNumbers) return eS.from(e);
	let n = Number(e);
	if ((n > 2 ** 53 - 1 || n < -(2 ** 53 - 1)) && ![Infinity, -Infinity].includes(n)) {
		if (typeof BigInt == "function") try {
			return BigInt(e);
		} catch {
			throw Error(`${e} can't be converted to BigInt. Set options.wrapNumbers to get string value.`);
		}
		throw Error(`${e} is outside SAFE_INTEGER bounds. Set options.wrapNumbers to get string value.`);
	}
	return n;
}, hS = (e) => e, gS = (e) => e, _S = (e, t) => e.map((e) => pS(e, t)), vS = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = pS(r, t), e), {});
// ../../node_modules/.pnpm/@aws-sdk+util-dynamodb@3.996.9_@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/util-dynamodb/dist-es/marshall.js
function yS(e, t) {
	let n = tS(e, t), [r, i] = Object.entries(n)[0];
	switch (r) {
		case "M":
		case "L": return t?.convertTopLevelContainer ? n : i;
		default: return n;
	}
}
// ../../node_modules/.pnpm/@aws-sdk+util-dynamodb@3.996.9_@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/util-dynamodb/dist-es/unmarshall.js
var bS = (e, t) => t?.convertWithoutMapWrapper ? pS(e, t) : pS({ M: e }, t), xS = [
	{
		name: "name",
		label: "Table"
	},
	{
		name: "status",
		label: "Status"
	},
	{
		name: "region",
		label: "Region"
	},
	{
		name: "createdAt",
		label: "Created At"
	}
], SS = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}], CS = [
	{
		label: "String",
		value: "S"
	},
	{
		label: "Number",
		value: "N"
	},
	{
		label: "Binary",
		value: "B"
	}
];
function wS() {
	return {
		cloud: "aws",
		service: "nosql",
		displayName: "DynamoDB",
		fields: [
			{
				name: "tableName",
				label: "Table Name",
				type: "text",
				required: !0,
				description: "3-255 characters. Letters, numbers, underscores, dots, and hyphens.",
				validation: {
					pattern: "^(?:[A-Za-z0-9_.]|-){3,255}$",
					minLength: 3,
					maxLength: 255,
					message: "Use a valid DynamoDB table name: 3-255 letters, numbers, underscores, dots, or hyphens."
				}
			},
			{
				name: "partitionKey",
				label: "Partition Key",
				type: "text",
				required: !0,
				group: "Primary key",
				validation: {
					minLength: 1,
					maxLength: 255,
					message: "Partition key must contain 1-255 characters."
				}
			},
			{
				name: "partitionKeyType",
				label: "Partition Key Type",
				type: "select",
				required: !0,
				options: CS
			},
			{
				name: "sortKey",
				label: "Sort Key",
				type: "text",
				required: !1,
				description: "Optional range key.",
				validation: {
					minLength: 1,
					maxLength: 255,
					message: "Sort key must contain 1-255 characters."
				}
			},
			{
				name: "sortKeyType",
				label: "Sort Key Type",
				type: "select",
				required: !1,
				options: CS
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
					label: "List tables",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "create",
					label: "Create table",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "delete",
					label: "Delete table",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "inspect",
					label: "Inspect table",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				}
			],
			itemActions: [
				{
					name: "list",
					label: "Scan items",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "put",
					label: "Put item",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "query",
					label: "Run PartiQL",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				},
				{
					name: "keyQuery",
					label: "Query by key",
					enabled: !0,
					status: "available",
					runtimeRequired: !0
				}
			]
		},
		filters: SS,
		columns: xS
	};
}
// ../api/src/adapter-aws/AwsDynamoDbAdapter.ts
var TS = 10, ES = 8192, DS = class {
	dynamodb;
	cloud = "aws";
	service = "nosql";
	items;
	constructor(e = void 0) {
		this.dynamodb = e, this.items = new OS(e);
	}
	schema() {
		return wS();
	}
	async list(e = {}) {
		let t = YS(await this.listTableNames(), e.search), n = [];
		for (let e = 0; e < t.length; e += TS) {
			let r = t.slice(e, e + TS);
			n.push(...await Promise.all(r.map((e) => this.describe(e))));
		}
		return n;
	}
	async get(e) {
		try {
			return await this.describe(e);
		} catch (e) {
			if (QS(e)) return null;
			throw e;
		}
	}
	async create(e) {
		let t = KS(e.values.tableName, "tableName");
		if (!ZS(t)) throw new K("Use a valid DynamoDB table name: 3-255 letters, numbers, underscores, dots, or hyphens.");
		let n = KS(e.values.partitionKey, "partitionKey"), r = JS(e.values.partitionKeyType, "partitionKeyType"), i = qS(e.values.sortKey);
		if (i === n) throw new K("sortKey must differ from partitionKey");
		let a = [{
			AttributeName: n,
			AttributeType: r
		}], o = [{
			AttributeName: n,
			KeyType: "HASH"
		}];
		return i && (a.push({
			AttributeName: i,
			AttributeType: JS(e.values.sortKeyType || "S", "sortKeyType")
		}), o.push({
			AttributeName: i,
			KeyType: "RANGE"
		})), GS((await this.dynamodb.send(new _y({
			TableName: t,
			AttributeDefinitions: a,
			KeySchema: o,
			BillingMode: "PAY_PER_REQUEST"
		}))).TableDescription ?? {
			TableName: t,
			AttributeDefinitions: a,
			KeySchema: o,
			BillingModeSummary: { BillingMode: "PAY_PER_REQUEST" }
		});
	}
	async delete(e) {
		await this.dynamodb.send(new vy({ TableName: e }));
	}
	async listTableNames() {
		let e = [], t;
		do {
			let n = await this.dynamodb.send(new xy({ ExclusiveStartTableName: t }));
			e.push(...n.TableNames ?? []), t = n.LastEvaluatedTableName;
		} while (t);
		return e;
	}
	async describe(e) {
		return GS(await jS(this.dynamodb, e));
	}
}, OS = class {
	dynamodb;
	constructor(e) {
		this.dynamodb = e;
	}
	async listItems(e, t = {}) {
		let n = FS(await jS(this.dynamodb, e)), r = await this.dynamodb.send(new wy({
			TableName: e,
			Limit: t.limit ?? 100,
			ExclusiveStartKey: t.cursor ? PS(t.cursor) : void 0
		}));
		return {
			items: (r.Items ?? []).map((e, t) => MS(e, n, t)),
			nextCursor: NS(r.LastEvaluatedKey)
		};
	}
	async putItem(e, t) {
		if (!t || typeof t != "object" || Array.isArray(t)) throw new K("Item must be a JSON object.");
		let n = FS(await jS(this.dynamodb, e));
		if (n.length === 0) throw new Vb(`DynamoDB table ${e} has no key schema`);
		let r = n.find(({ type: e }) => !e);
		if (r) throw new Vb(`DynamoDB table ${e} has no type definition for key ${r.name}`);
		let i = IS(t, n);
		return await this.dynamodb.send(new Sy({
			TableName: e,
			Item: i
		})), MS(i, n, 0);
	}
	async queryItems(e, t, n = {}) {
		let r = typeof t == "string" ? t.trim() : "";
		if (!r) throw new K("A PartiQL statement is required.");
		if (r.length > ES) throw new K(`A PartiQL statement must be at most ${ES} characters.`);
		let i = FS(await jS(this.dynamodb, e)), a = await this.dynamodb.send(new by({
			Statement: r,
			Limit: n.limit ?? 100,
			NextToken: n.cursor
		}));
		return {
			items: (a.Items ?? []).map((e, t) => MS(e, i, t)),
			nextCursor: a.NextToken ?? null
		};
	}
	async queryItemsByKey(e, t, n = {}) {
		let r = await jS(this.dynamodb, e), i = t.index ? `index ${t.index}` : `table ${e}`, a = FS(r, t.index ? AS(r, t.index) : r.KeySchema), o = a.find(({ keyType: e }) => e === "HASH"), s = a.find(({ keyType: e }) => e === "RANGE");
		if (!o) throw new Vb(`DynamoDB ${i} has no partition key`);
		let c = [o, s].find((e) => e && !e.type);
		if (c) throw new Vb(`DynamoDB ${i} has no type definition for key ${c.name}`);
		let l = { "#pk": o.name }, u = { ":pk": RS(o, t.partitionKey) }, d = "#pk = :pk";
		if (t.sortKey) {
			if (!s) throw new K(`DynamoDB ${i} has no sort key.`);
			l["#sk"] = s.name, u[":sk"] = RS(s, t.sortKey.value), t.sortKey.operator === "between" && (u[":skTo"] = RS(s, t.sortKey.to ?? "")), d += ` AND ${kS[t.sortKey.operator]}`;
		}
		let f = await this.dynamodb.send(new Cy({
			TableName: e,
			IndexName: t.index,
			KeyConditionExpression: d,
			ExpressionAttributeNames: l,
			ExpressionAttributeValues: u,
			ScanIndexForward: !t.descending,
			Limit: n.limit ?? 100,
			ExclusiveStartKey: n.cursor ? PS(n.cursor) : void 0
		})), p = FS(r);
		return {
			items: (f.Items ?? []).map((e, t) => MS(e, p, t)),
			nextCursor: NS(f.LastEvaluatedKey)
		};
	}
}, kS = {
	eq: "#sk = :sk",
	lt: "#sk < :sk",
	lte: "#sk <= :sk",
	gt: "#sk > :sk",
	gte: "#sk >= :sk",
	beginsWith: "begins_with(#sk, :sk)",
	between: "#sk BETWEEN :sk AND :skTo"
};
function AS(e, t) {
	let n = [...e.GlobalSecondaryIndexes ?? [], ...e.LocalSecondaryIndexes ?? []].find(({ IndexName: e }) => e === t);
	if (!n) throw new K(`DynamoDB table ${e.TableName} has no index named ${t}.`);
	return n.KeySchema ?? [];
}
async function jS(e, t) {
	let n = await e.send(new yy({ TableName: t }));
	if (!n.Table) throw new Vb(`DynamoDB did not return a description for table ${t}`);
	return n.Table;
}
function MS(e, t, n) {
	let r = VS(bS(e, { wrapNumbers: US })), i = t.map(({ name: e }) => e), a = i.length > 0 && i.every((e) => Object.prototype.hasOwnProperty.call(r, e)) ? Object.fromEntries(i.map((e) => [e, r[e]])) : null;
	return {
		id: a ? JSON.stringify(a) : `row-${n}`,
		collectionId: null,
		timestamp: null,
		body: r,
		metadata: { key: a }
	};
}
function NS(e) {
	if (!e || Object.keys(e).length === 0) return null;
	let t = Object.fromEntries(Object.entries(e).map(([e, t]) => t.B === void 0 ? [e, t.S === void 0 ? { N: t.N } : { S: t.S }] : [e, { B: Buffer.from(t.B).toString("base64") }]));
	return Buffer.from(JSON.stringify(t)).toString("base64url");
}
function PS(e) {
	let t;
	try {
		t = JSON.parse(Buffer.from(e, "base64url").toString("utf8"));
	} catch (e) {
		throw new K("cursor is not a valid DynamoDB page cursor.", { cause: e });
	}
	if (!t || typeof t != "object" || Array.isArray(t) || Object.keys(t).length === 0) throw new K("cursor is not a valid DynamoDB page cursor.");
	return Object.fromEntries(Object.entries(t).map(([e, t]) => {
		let n = t;
		if (typeof n?.S == "string") return [e, { S: n.S }];
		if (typeof n?.N == "string") return [e, { N: n.N }];
		if (typeof n?.B == "string") return [e, { B: Buffer.from(n.B, "base64") }];
		throw new K("cursor is not a valid DynamoDB page cursor.");
	}));
}
function FS(e, t = e.KeySchema ?? []) {
	let n = new Map((e.AttributeDefinitions ?? []).filter((e) => !!e.AttributeName).map((e) => [e.AttributeName, e.AttributeType]));
	return t.filter((e) => !!e.AttributeName).map((e) => ({
		name: e.AttributeName,
		type: n.get(e.AttributeName),
		keyType: e.KeyType
	}));
}
function IS(e, t) {
	for (let { name: n } of t) if (!Object.prototype.hasOwnProperty.call(e, n)) throw new K(`Key attribute ${n} is required.`);
	let n = Object.fromEntries(t.map((t) => [t.name, RS(t, e[t.name])]));
	LS(e);
	let r;
	try {
		r = yS(e);
	} catch (e) {
		throw new K(e instanceof Error ? e.message : "Item contains a value DynamoDB cannot store.", { cause: e });
	}
	return {
		...r,
		...n
	};
}
function LS(e, t = "$") {
	if (typeof e == "number" && Number.isInteger(e) && !Number.isSafeInteger(e)) throw new K(`Item value at ${t} must quote integers outside JavaScript's safe range.`);
	if (Array.isArray(e)) e.forEach((e, n) => LS(e, `${t}[${n}]`));
	else if (typeof e == "object" && e) for (let [n, r] of Object.entries(e)) LS(r, `${t}[${JSON.stringify(n)}]`);
}
function RS(e, t) {
	if (e.type === "N") {
		if (typeof t == "number") throw new K(`Key attribute ${e.name} must be a quoted number to preserve precision.`);
		let n = typeof t == "string" ? t : "";
		if (!zS(n)) throw new K(`Key attribute ${e.name} must be a number.`);
		return { N: n };
	}
	if (e.type === "B") {
		if (typeof t != "string" || !BS(t)) throw new K(`Binary key attribute ${e.name} must be a non-empty base64 string.`);
		return { B: Buffer.from(t, "base64") };
	}
	if (typeof t != "string" || !t) throw new K(`Key attribute ${e.name} must be a non-empty string.`);
	return { S: t };
}
function zS(e) {
	return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/.test(e);
}
function BS(e) {
	return e.length > 0 && e.length % 4 == 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e);
}
function VS(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, HS(t)]));
}
function HS(e) {
	return typeof e == "bigint" ? e.toString() : e instanceof Uint8Array ? Buffer.from(e).toString("base64") : e instanceof Set ? Array.from(e, HS) : Array.isArray(e) ? e.map(HS) : typeof e == "object" && e ? VS(e) : e;
}
function US(e) {
	let t = WS(e), n = Number(t);
	return !Number.isFinite(n) || Number.isInteger(n) && !Number.isSafeInteger(n) ? t : WS(String(n)) === t ? n : t;
}
function WS(e) {
	let [t, n = "0"] = e.toLowerCase().split("e"), r = t.startsWith("-") ? "-" : "", [i, a = ""] = t.replace(/^[+-]/, "").split("."), o = (i + a).replace(/^0+/, "");
	if (!o) return "0";
	let s = BigInt(o.length - a.length) + BigInt(n), c = o.replace(/0+$/, "");
	if (s <= -6n || s > 21n) {
		let e = c.slice(1);
		return `${r}${c[0] + (e ? `.${e}` : "")}e${s - 1n}`;
	}
	let l = Number(s);
	return l <= 0 ? `${r}0.${"0".repeat(-l)}${c}` : l >= c.length ? r + c.padEnd(l, "0") : `${r}${c.slice(0, l)}.${c.slice(l)}`;
}
function GS(e) {
	let t = e.TableName ?? "";
	return {
		id: t,
		name: t,
		cloud: "aws",
		service: "nosql",
		type: "dynamodb-table",
		region: XS(e.TableArn),
		createdAt: e.CreationDateTime?.toISOString() ?? null,
		status: e.TableStatus ?? null,
		metadata: {
			arn: e.TableArn,
			tableId: e.TableId,
			itemCount: e.ItemCount,
			tableSizeBytes: e.TableSizeBytes,
			billingMode: e.BillingModeSummary?.BillingMode,
			keySchema: e.KeySchema,
			attributeDefinitions: e.AttributeDefinitions,
			provisionedThroughput: e.ProvisionedThroughput,
			globalSecondaryIndexes: e.GlobalSecondaryIndexes,
			localSecondaryIndexes: e.LocalSecondaryIndexes,
			streamSpecification: e.StreamSpecification,
			deletionProtectionEnabled: e.DeletionProtectionEnabled
		}
	};
}
function KS(e, t) {
	let n = qS(e);
	if (!n) throw new K(`${t} is required`);
	return n;
}
function qS(e) {
	return typeof e == "string" ? e.trim() : "";
}
function JS(e, t) {
	let n = qS(e);
	if (n === "S" || n === "N" || n === "B") return n;
	throw new K(`${t} must be S, N, or B`);
}
function YS(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.toLowerCase().includes(n)) : e;
}
function XS(e) {
	return e?.split(":")[3] || null;
}
function ZS(e) {
	return /^[A-Za-z0-9_.-]{3,255}$/.test(e);
}
function QS(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name === "ResourceNotFoundException" || t.$metadata?.httpStatusCode === 404;
}
var $S = Dx(new Zx(new Kx([new DS(new gy({
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
async function eC(e) {
	return $S.fetch(e);
}
export { eC as handleDynamoDbRequest };
