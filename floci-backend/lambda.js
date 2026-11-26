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
}) : o, n));
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function d(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/isStreamingPayload/isStreamingPayload.browser.js
var f = (e) => e?.body instanceof ReadableStream, p = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, m = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, ee = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => te[t.step] - te[e.step] || ne[t.priority || "normal"] - ne[e.priority || "normal"]), a = (n) => {
		let i = !1, a = (e) => {
			let t = p(e.name, e.aliases);
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
				for (let t of p(e.name, e.aliases)) r.delete(t);
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
			for (let e of p(t.name, t.aliases)) o[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of p(t.name, t.aliases)) o[e] = t;
			a.push(t);
		}), a.forEach((e) => {
			if (e.toMiddleware) {
				let t = o[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${m(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
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
			}, c = p(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${m(i, o)}'`);
					for (let t of c) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== s.step || s.priority !== r.priority) throw Error(`"${m(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${m(i, o)}" middleware with ${s.priority} priority in ${s.step} step.`);
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
			}, c = p(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${m(i, o)}'`);
					for (let e of c) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== s.toMiddleware || r.relation !== s.relation) throw Error(`"${m(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${m(i, o)}" middleware ${s.relation} "${s.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of c) r.add(e);
			}
			t.push(s);
		},
		clone: () => s(ee()),
		use: (e) => {
			e.applyToStack(u);
		},
		remove: (e) => typeof e == "string" ? a(e) : o(e),
		removeByTag: (n) => {
			let i = !1, a = (e) => {
				let { tags: t, name: a, aliases: o } = e;
				if (t && t.includes(n)) {
					let e = p(a, o);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(a), t = t.filter(a), i;
		},
		concat: (e) => {
			let t = s(ee());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: s,
		identify: () => l(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return m(e.name, e.aliases) + " - " + t;
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
}, te = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, ne = {
	high: 3,
	normal: 2,
	low: 1
}, re, ie = o((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(re ||= {});
})), ae, oe = o((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(ae ||= {});
})), se = o((() => {
	oe();
})), ce, le = o((() => {
	ce = "__smithy_context";
})), ue = o((() => {
	ie(), se(), le();
})), de, fe = o((() => {
	ue(), de = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function h(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var pe = o((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function me(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var he, ge = o((() => {
	he = class e {
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
			return n.query &&= me(n.query), n;
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
})), _e, ve = o((() => {
	_e = class {
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
})), ye, be, xe = o((() => {
	ye = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), be = (e, t = !1) => {
		if (!t) return ye.test(e);
		let n = e.split(".");
		for (let e of n) if (!be(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function Se(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var Ce = o((() => {})), we, Te = o((() => {
	we = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function Ee(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var De = o((() => {})), Oe, ke = o((() => {
	De(), Oe = (e) => {
		if (typeof e == "string") return Oe(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = Ee(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), Ae, je = o((() => {
	pe(), ke(), Ae = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = Oe(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) h(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return Oe(e);
	};
})), Me = o((() => {
	fe(), pe(), ge(), ve(), xe(), Ce(), Te(), ke(), je();
})), Ne = (e) => () => Promise.reject(e), Pe = class {
	config;
	middlewareStack = ee();
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
}, Fe, Ie = o((() => {
	Fe = (e) => typeof e == "function" ? e() : e;
})), Le, Re = o((() => {
	Le = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), ze, Be, Ve = o((() => {
	Me(), Re(), ze = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = de(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(Le(o, s, c, l, u), {
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
					if (_e.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Be(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Be(/^x-[\w-]+-id-2$/, r),
							cfId: Be(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Be = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), He, Ue = o((() => {
	Me(), Re(), He = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = de(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => Ae(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(Le(a, o, s, c, l), r.input, {
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
function We(e) {
	return { applyToStack: (t) => {
		t.add(He(e), Ke), t.add(ze(e), Ge), e.protocol.setSerdeContext(e);
	} };
}
var Ge, Ke, qe = o((() => {
	Ve(), Ue(), Ge = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Ke = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function Je(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Ye[e]) return Ye[e];
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
	return Ye[e] = t;
}
var Ye, Xe = o((() => {
	Ye = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function Ze(e, t) {
	return e instanceof g ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new g(e, t);
}
var Qe, $e, et, g, tt, nt, rt = o((() => {
	Ie(), Xe(), Qe = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, $e = [], et = {}, g = class e {
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
			for (this._isMemberSchema = !1; tt(i);) r.push(i[1]), i = i[0], a = Fe(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, Je(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = Fe(a), nt(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if ($e[t]) return $e[t];
			} else if (typeof t == "string") {
				if (et[t]) return et[t];
			} else if (n && t[Qe.ns]) return t[Qe.ns];
			let r = Fe(t);
			if (r instanceof e) return r;
			if (tt(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), Je(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Qe.ns] = i : typeof r == "string" ? et[r] = i : typeof r == "number" ? $e[r] = i : i;
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
			return Je(this.memberTraits);
		}
		getOwnTraits() {
			return Je(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return Ze([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return Ze([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return Ze(tt(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return Ze([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[Qe.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = Ze([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Qe.it] = n;
			}
		}
	}, tt = (e) => Array.isArray(e) && e.length === 2, nt = (e) => Array.isArray(e) && e.length >= 5;
})), it, at = o((() => {
	it = class e {
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
})), _ = o((() => {
	Ie(), qe(), Re(), rt(), Xe(), at();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
_();
var ot = "***SensitiveInformation***";
function st(e, t) {
	if (t == null) return t;
	let n = g.of(e);
	if (n.getMergedTraits().sensitive) return ot;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return ot;
		if (Array.isArray(t)) return t.map((t) => st(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return ot;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, st(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = st(i, e[t]));
		return r;
	}
	return t;
}
ue(), _();
var ct = Symbol.for("@smithy/op-event-stream"), lt = class {
	middlewareStack = ee();
	schema;
	static classBuilder() {
		return new ut();
	}
	resolveMiddlewareWithContext(e, t, n, { middlewareFn: r, clientName: i, commandName: a, inputFilterSensitiveLog: o, outputFilterSensitiveLog: s, smithyContext: c, additionalContext: l, CommandCtor: u }) {
		for (let i of r.bind(this)(u, e, t, n)) this.middlewareStack.use(i);
		let d = e.concat(this.middlewareStack), { logger: f } = t, p = l[ce], m = {
			logger: f,
			clientName: i,
			commandName: a,
			inputFilterSensitiveLog: o,
			outputFilterSensitiveLog: s,
			...l,
			[ce]: {
				...p,
				commandInstance: this,
				...c,
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
			}
		}, { requestHandler: ee } = t, te = n ?? {};
		te.metricsRecorder && (te = { ...te }, delete te.metricsRecorder);
		let ne, re = this.schema, ie = re?.[ct];
		if (ie !== void 0) ne = ie;
		else if (re && Array.isArray(re) && re[0] === 9) {
			let [, , , , e, t] = re;
			ne = re[ct] = !!(g.of(e).getEventStreamMember() || g.of(t).getEventStreamMember());
		}
		return ne && (te = {
			isEventStream: ne,
			...te
		}), d.resolve((e) => ee.handle(e.request, te), m);
	}
}, ut = class {
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
		return t = class extends lt {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? st.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? st.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, dt = class e extends Error {
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
}, ft = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), pt = (e) => {
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
Me(), ue();
var mt = Object.values(ae), ht = (e) => {
	let t = [];
	for (let n in ae) {
		if (!h(ae, n)) continue;
		let r = ae[n];
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
			mt.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, gt = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		mt.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, _t = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), vt = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, yt = (e) => Object.assign(ht(e), _t(e)), bt = (e) => Object.assign(gt(e), vt(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/get-value-from-text-node.js
Me();
var xt = (e) => {
	let t = "#text";
	for (let n in e) h(e, n) && (e[n][t] === void 0 ? typeof e[n] == "object" && e[n] !== null && (e[n] = xt(e[n])) : e[n] = e[n][t]);
	return e;
}, St = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function Ct(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return lt.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var wt, Tt, Et, Dt = o((() => {
	wt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Tt = Object.entries(wt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), Et = wt.split("");
})), Ot, kt = o((() => {
	Dt(), Ot = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in Tt)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= Tt[e[r]] << (a - r) * 6, i += 6;
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
})), At, jt = o((() => {
	At = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function Mt(e) {
	let t;
	t = typeof e == "string" ? At(e) : e;
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
			i += Et[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var Nt = o((() => {
	jt(), Dt();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function Pt(e, t, n, r) {
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
var Ft = o((() => {})), It, Lt = o((() => {
	It = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Rt(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, zt[t[0]] + zt[t[1]] + zt[t[2]] + zt[t[3]] + "-" + zt[t[4]] + zt[t[5]] + "-" + zt[t[6]] + zt[t[7]] + "-" + zt[t[8]] + zt[t[9]] + "-" + zt[t[10]] + zt[t[11]] + zt[t[12]] + zt[t[13]] + zt[t[14]] + zt[t[15]];
	};
}
var zt, Bt = o((() => {
	zt = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn = o((() => {
	Vt = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && nn.warn(tn(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, Ht = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Ut = (e) => {
		let t = Vt(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > Ht) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Wt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Gt = (e) => qt(e, 16), Kt = (e) => qt(e, 8), qt = (e, t) => {
		let n = Wt(e);
		if (n !== void 0 && Jt(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Jt = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Yt = (e) => Vt(typeof e == "string" ? Qt(e) : e), Xt = (e) => Ut(typeof e == "string" ? Qt(e) : e), Zt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Qt = (e) => {
		let t = e.match(Zt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, $t = (e) => Gt(typeof e == "string" ? Qt(e) : e), en = (e) => Kt(typeof e == "string" ? Qt(e) : e), tn = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), nn = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function an(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${on[r]}, ${c} ${sn[n]} ${t} ${l}:${u}:${d} GMT`;
}
var on, sn, cn, ln, un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn = o((() => {
	rn(), on = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], sn = [
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
	], cn = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), ln = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
		let t = cn.exec(e);
		if (!t) throw TypeError("Invalid RFC-3339 date-time value");
		let [n, r, i, a, o, s, c, l, u] = t, d = $t(En(r)), f = Cn(i, "month", 1, 12), p = Cn(a, "day", 1, 31), m = hn(d, f, p, {
			hours: o,
			minutes: s,
			seconds: c,
			fractionalMilliseconds: l
		});
		return u.toUpperCase() != "Z" && m.setTime(m.getTime() - Tn(u)), m;
	}, un = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), dn = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), fn = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), pn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = un.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return hn($t(En(i)), yn(r), Cn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = dn.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return vn(hn(gn(i), yn(r), Cn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = fn.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return hn($t(En(c)), yn(n), Cn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, mn = (e) => {
		if (e == null) return;
		let t;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") t = Yt(e);
		else if (typeof e == "object" && e.tag === 1) t = e.value;
		else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(t) || t === Infinity || t === -Infinity) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(t * 1e3));
	}, hn = (e, t, n, r) => {
		let i = t - 1;
		return xn(e, i, n), new Date(Date.UTC(e, i, n, Cn(r.hours, "hour", 0, 23), Cn(r.minutes, "minute", 0, 59), Cn(r.seconds, "seconds", 0, 60), wn(r.fractionalMilliseconds)));
	}, gn = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + $t(En(e));
		return n < t ? n + 100 : n;
	}, _n = 15768e8, vn = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > _n ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, yn = (e) => {
		let t = sn.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, bn = [
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
	], xn = (e, t, n) => {
		let r = bn[t];
		if (t === 1 && Sn(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${sn[t]} in ${e}: ${n}`);
	}, Sn = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), Cn = (e, t, n, r) => {
		let i = en(En(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, wn = (e) => e == null ? 0 : Xt("0." + e) * 1e3, Tn = (e) => {
		let t = e[0], n = 1;
		if (t == "+") n = 1;
		else if (t == "-") n = -1;
		else throw TypeError(`Offset direction, ${t}, must be "+" or "-"`);
		let r = Number(e.substring(1, 3)), i = Number(e.substring(4, 6));
		return n * (r * 60 + i) * 60 * 1e3;
	}, En = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), On, kn = o((() => {
	On = function(e) {
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
	}, On.from = (e) => e && typeof e == "object" && (e instanceof On || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? On(String(e)) : On(JSON.stringify(e)), On.fromObject = On.from;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/quote-header.js
function An(e) {
	return (e.includes(",") || e.includes("\"")) && (e = `"${e.replace(/"/g, "\\\"")}"`), e;
}
var jn = o((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function Mn(e, t, n) {
	let r = Number(e);
	if (r < t || r > n) throw Error(`Value ${r} out of range [${t}, ${n}]`);
}
var Nn, Pn, Fn, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, Kn = o((() => {
	Nn = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", Pn = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", Fn = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", In = "(\\d?\\d)", Ln = "(\\d{4})", Rn = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), zn = RegExp(`^${Nn}, ${In} ${Pn} ${Ln} ${Fn} GMT$`), Bn = RegExp(`^${Nn}, ${In}-${Pn}-(\\d\\d) ${Fn} GMT$`), Vn = RegExp(`^${Nn} ${Pn} ( [1-9]|\\d\\d) ${Fn} ${Ln}$`), Hn = [
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
	], Un = (e) => {
		if (e == null) return;
		let t = NaN;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") {
			if (!/^-?\d*\.?\d+$/.test(e)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
			t = Number.parseFloat(e);
		} else typeof e == "object" && e.tag === 1 && (t = e.value);
		if (isNaN(t) || Math.abs(t) === Infinity) throw TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(t * 1e3));
	}, Wn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC3339 timestamps must be strings");
		let t = Rn.exec(e);
		if (!t) throw TypeError(`Invalid RFC3339 timestamp format ${e}`);
		let [, n, r, i, a, o, s, , c, l] = t;
		Mn(r, 1, 12), Mn(i, 1, 31), Mn(a, 0, 23), Mn(o, 0, 59), Mn(s, 0, 60);
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
	}, Gn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC7231 timestamps must be strings.");
		let t, n, r, i, a, o, s, c;
		if ((c = zn.exec(e)) ? [, t, n, r, i, a, o, s] = c : (c = Bn.exec(e)) ? ([, t, n, r, i, a, o, s] = c, r = (Number(r) + 1900).toString()) : (c = Vn.exec(e)) && ([, n, t, i, a, o, s, r] = c), r && o) {
			let e = Date.UTC(Number(r), Hn.indexOf(n), Number(t), Number(i), Number(a), Number(o), s ? Math.round(parseFloat(`0.${s}`) * 1e3) : 0);
			Mn(t, 1, 31), Mn(i, 0, 23), Mn(a, 0, 59), Mn(o, 0, 60);
			let c = new Date(e);
			return c.setUTCFullYear(Number(r)), c;
		}
		throw TypeError(`Invalid RFC7231 date-time value ${e}.`);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/split-every.js
function qn(e, t, n) {
	if (n <= 0 || !Number.isInteger(n)) throw Error("Invalid number of delimiters (" + n + ") for splitEvery.");
	let r = e.split(t);
	if (n === 1) return r;
	let i = [], a = "";
	for (let e = 0; e < r.length; e++) a === "" ? a = r[e] : a += t + r[e], (e + 1) % n === 0 && (i.push(a), a = "");
	return a !== "" && i.push(a), i;
}
var Jn = o((() => {})), Yn, Xn = o((() => {
	Yn = (e) => {
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
})), Zn, Qn, $n = o((() => {
	Zn = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, Qn = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !Zn.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && Zn.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function er(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in rr) t[n / 2] = rr[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function tr(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += nr[e[n]];
	return t;
}
var nr, rr, ir = o((() => {
	nr = {}, rr = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), nr[e] = t, rr[t] = e;
	}
})), ar, or, sr = o((() => {
	ar = typeof TextEncoder == "function" ? new TextEncoder() : null, or = (e) => {
		if (typeof e == "string") {
			if (ar) return ar.encode(e).byteLength;
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
})), cr, lr = o((() => {
	jt(), cr = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? At(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function ur(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var dr = o((() => {})), fr, pr = o((() => {
	fr = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), mr, hr = o((() => {
	mr = async (e) => void 0;
})), gr, _r, vr, yr, br, xr, Sr = o((() => {
	gr = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), xr(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!br(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, _r = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, vr = /(\d+\.){3}\d+/, yr = /\.\./, br = (e) => _r.test(e) && !vr.test(e) && !yr.test(e), xr = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Cr = o((() => {
	Sr();
})), wr, Tr = o((() => {
	wr = (e, t, n, r = !1) => {
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
})), Er = o((() => {
	Me();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function Dr(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(Ae(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await Or(t, n, r);
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
var Or, kr = o((() => {
	Cr(), Tr(), Er(), Or = async (e, t, n) => {
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
				r[t] = await wr(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await gr(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function Ar(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function jr(e) {
	let t = Dr(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && Ar(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = de(i)?.selectedHttpAuthScheme?.httpAuthOption;
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
var Mr = o((() => {
	Me(), kr();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function Nr(e) {
	let t = jr(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), Fr);
	} });
}
var Pr, Fr, Ir = o((() => {
	Mr(), Pr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, Fr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: Pr.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function Lr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => Ae(await we(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: we(i ?? !1),
			useFipsEndpoint: we(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var Rr = o((() => {
	Me(), Er();
})), zr, Br = o((() => {
	zr = class e {
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
})), Vr, Hr = o((() => {
	Vr = class {
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
})), Ur, Wr = o((() => {
	Ur = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), Gr = o((() => {
	Wr();
})), Kr, qr = o((() => {
	Kr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function Jr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${Jr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(Jr).join(", ")})` : JSON.stringify(e, null, 2);
}
var Yr = o((() => {})), Xr = o((() => {
	qr(), Yr();
})), Zr, Qr = o((() => {
	Zr = {};
})), $r, ei = o((() => {
	$r = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function ti(...e) {
	for (let t of e) if (t != null) return t;
}
var ni = o((() => {})), ri, ii = o((() => {
	Gr(), ri = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new Ur(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new Ur(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), ai, oi = o((() => {
	Gr(), ii(), ai = (e, t) => ri(t).reduce((n, r) => {
		if (typeof n != "object") throw new Ur(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), si, ci = o((() => {
	si = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function li(e, t, n) {
	return e ? t : n;
}
var ui = o((() => {})), di, fi = o((() => {
	di = (e) => !e;
})), pi, mi, hi = o((() => {
	pi = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), mi = (e) => pi.test(e) || e.startsWith("[") && e.endsWith("]");
})), gi, _i, vi = o((() => {
	ue(), hi(), gi = {
		[re.HTTP]: 80,
		[re.HTTPS]: 443
	}, _i = (e) => {
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
		if (!Object.values(re).includes(c)) return null;
		let l = mi(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${gi[c]}`) || typeof e == "string" && e.includes(`${r}:${gi[c]}`) ? `:${gi[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function yi(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var bi = o((() => {})), xi, Si = o((() => {
	xi = (e, t) => e === t;
})), Ci, wi = o((() => {
	Ci = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Ti, Ei = o((() => {
	Ti = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Di = o((() => {
	ei(), ni(), oi(), ci(), Me(), ui(), fi(), vi(), bi(), Si(), wi(), Ei();
})), Oi, ki = o((() => {
	Di(), Oi = {
		booleanEquals: $r,
		coalesce: ti,
		getAttr: ai,
		isSet: si,
		isValidHostLabel: be,
		ite: li,
		not: di,
		parseURL: _i,
		split: yi,
		stringEquals: xi,
		substring: Ci,
		uriEncode: Ti
	};
})), Ai, ji = o((() => {
	Di(), Ai = (e, t) => {
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
				n.push(ai(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), Mi, Ni = o((() => {
	Mi = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), Pi, Fi, Ii, Li = o((() => {
	Gr(), Qr(), ki(), ji(), Ni(), Pi = (e, t, n) => {
		if (typeof e == "string") return Ai(e, n);
		if (e.fn) return Ii.callFunction(e, n);
		if (e.ref) return Mi(e, n);
		throw new Ur(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, Fi = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = Ii.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = Zr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = Oi[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, Ii = {
		evaluateExpression: Pi,
		callFunction: Fi
	};
})), Ri = o((() => {
	Li();
})), zi, Bi = o((() => {
	Xr(), Gr(), Ri(), zi = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new Ur(`'${n}' is already defined in Reference Record.`);
		let r = Fi(e, t);
		t.logger?.debug?.(`${Kr} evaluateCondition: ${Jr(e)} = ${Jr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), Vi, Hi = o((() => {
	Gr(), Li(), Vi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = Pi(e, "Header value entry", t);
		if (typeof r != "string") throw new Ur(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), Ui, Wi, Gi, Ki = o((() => {
	Gr(), ji(), Ui = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = Gi.getEndpointProperty(r, t), e), {}), Wi = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => Wi(e, t));
		switch (typeof e) {
			case "string": return Ai(e, t);
			case "object":
				if (e === null) throw new Ur(`Unexpected endpoint property: ${e}`);
				return Gi.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new Ur(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, Gi = {
		getEndpointProperty: Wi,
		getEndpointProperties: Ui
	};
})), qi, Ji = o((() => {
	Gr(), Li(), qi = (e, t) => {
		let n = Pi(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new Ur(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), Yi, Xi, Zi = o((() => {
	Gr(), Bi(), Li(), Hi(), Ki(), Ji(), Yi = 1e8, Xi = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < Yi;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = zi({
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
		if (o >= Yi) {
			let e = i[o - Yi];
			if (e[0] === -1) {
				let [, t] = e;
				throw new Ur(Pi(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: qi(t, c),
				properties: Ui(n, c),
				headers: Vi(r ?? {}, c)
			};
		}
		throw new Ur("No matching endpoint.");
	};
})), Qi, $i, ea = o((() => {
	hr(), kr(), Mr(), Ir(), Rr(), Me(), Br(), Hr(), Zi(), hi(), Qr(), Xr(), Gr(), Bi(), Hi(), Ki(), Ji(), Li(), Er(), Qi = Lr(mr), jr(mr), $i = Nr(mr);
})), ta, na, ra = o((() => {
	ta = (e) => typeof ReadableStream == "function" && (e?.constructor?.name === ReadableStream.name || e instanceof ReadableStream), na = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
})), ia, aa = o((() => {
	ia = (e, t) => {
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
async function oa(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function sa(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return ur(t, r);
}
var ca, la = o((() => {
	dr(), ra(), ca = async (e) => na(e) ? oa(e) : sa(e);
})), ua, da, fa, pa = o((() => {
	Nt(), ir(), Lt(), la(), ra(), ua = "The stream has already been transformed.", da = (e) => {
		if (!fa(e) && !ta(e)) {
			let t = e?.__proto__?.constructor?.name || e;
			throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${t}`);
		}
		let t = !1, n = async () => {
			if (t) throw Error(ua);
			return t = !0, await ca(e);
		}, r = (e) => {
			if (typeof e.stream != "function") throw Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
			return e.stream();
		};
		return Object.assign(e, {
			transformToByteArray: n,
			transformToString: async (e) => {
				let t = await n();
				if (e === "base64") return Mt(t);
				if (e === "hex") return tr(t);
				if (e === void 0 || e === "utf8" || e === "utf-8") return It(t);
				if (typeof TextDecoder == "function") return new TextDecoder(e).decode(t);
				throw Error("TextDecoder is not available, please make sure polyfill is provided.");
			},
			transformToWebStream: () => {
				if (t) throw Error(ua);
				if (t = !0, fa(e)) return r(e);
				if (ta(e)) return e;
				throw Error(`Cannot transform payload to web stream, got ${e}`);
			}
		});
	}, fa = (e) => typeof Blob == "function" && e instanceof Blob;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function ma(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var ha = o((() => {})), ga, _a, va, ya, v = o((() => {
	kt(), Nt(), Ft(), jt(), Lt(), Bt(), Dn(), kn(), rn(), jn(), Kn(), Jn(), Xn(), $n(), ir(), sr(), lr(), dr(), pr(), Me(), ea(), ra(), aa(), pa(), la(), ha(), ga = class extends Pt(It, At, Mt, Ot) {}, _a = (e) => crypto.getRandomValues(e), va = Rt(_a), ya = va;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
v();
var ba = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return ga.mutate(e);
	if (!e) return ga.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return ga.mutate(await n);
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function xa(e) {
	return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
		return "%" + e.charCodeAt(0).toString(16).toUpperCase();
	});
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var Sa = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/checksum/chunked-blob-reader/chunked-blob-reader.js
async function Ca(e, t, n = 1048576) {
	let r = e.size, i = 0;
	for (; i < r;) {
		let a = e.slice(i, Math.min(r, i + n));
		t(new Uint8Array(await a.arrayBuffer())), i += a.size;
	}
}
var wa = o((() => {})), Ta, Ea = o((() => {
	wa(), Ta = async function(e, t) {
		let n = new e();
		return await Ca(t, (e) => {
			n.update(e);
		}), n.digest();
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/checksum/md5/Md5Js.js
function Da(e, t) {
	let n = e[0], r = e[1], i = e[2], a = e[3];
	for (let e = 0; e < 64; ++e) {
		let o, s;
		e < 16 ? (o = r & i | ~r & a, s = e) : e < 32 ? (o = a & r | i & ~a, s = (5 * e + 1) % 16) : e < 48 ? (o = r ^ i ^ a, s = (3 * e + 5) % 16) : (o = i ^ (r | ~a), s = 7 * e % 16);
		let c = t.getUint32(s * 4, !0), l = a;
		a = i, i = r;
		let u = ja[(e >> 4) * 4 + (e & 3)], d = (n + o & Aa) + (c + Ma[e] & Aa) & Aa;
		r = r + ((d << u | d >>> 32 - u) >>> 0) & Aa, n = l;
	}
	e[0] = e[0] + n & Aa, e[1] = e[1] + r & Aa, e[2] = e[2] + i & Aa, e[3] = e[3] + a & Aa;
}
var Oa, ka, Aa, ja, Ma, Na = o((() => {
	v(), Oa = class {
		digestLength = 16;
		state = Uint32Array.from(ka);
		writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64));
		bufferLength = 0;
		bytesHashed = 0;
		update(e) {
			let t = cr(e), n = 0, r = t.byteLength;
			for (this.bytesHashed += r; r > 0;) this.writeBuffer.setUint8(this.bufferLength++, t[n++]), --r, this.bufferLength === 64 && (Da(this.state, this.writeBuffer), this.bufferLength = 0);
		}
		async digest() {
			let e = Uint32Array.from(this.state), t = new DataView(this.writeBuffer.buffer.slice(0)), n = this.bufferLength, r = this.bytesHashed * 8;
			if (t.setUint8(n++, 128), this.bufferLength % 64 >= 56) {
				for (let e = n; e < 64; ++e) t.setUint8(e, 0);
				Da(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) t.setUint8(e, 0);
			t.setUint32(56, r >>> 0, !0), t.setUint32(60, Math.floor(r / 2 ** 32), !0), Da(e, t);
			let i = /* @__PURE__ */ new Uint8Array(16), a = new DataView(i.buffer);
			for (let t = 0; t < 4; ++t) a.setUint32(t * 4, e[t], !0);
			return i;
		}
		reset() {
			this.state.set(ka), this.writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64)), this.bufferLength = 0, this.bytesHashed = 0;
		}
	}, ka = [
		1732584193,
		4023233417,
		2562383102,
		271733878
	], Aa = 4294967295, ja = Uint8Array.of(7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21), Ma = Array.from({ length: 64 }, (e, t) => Math.abs(Math.sin(t + 1)) * 2 ** 32 >>> 0);
})), Pa, Fa, Ia, La = o((() => {
	Pa = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Pa[e] = t >>> 0;
	}
	Fa = 4294967295, Ia = class {
		digestLength = 4;
		checksum = Fa;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Pa[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Fa) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Fa;
		}
	};
})), Ra, za, Ba, Va, Ha, Ua, Wa = o((() => {
	v(), Ra = 64, za = 32, Ba = 2 ** 53 - 1, Va = class e {
		digestLength = za;
		state = Int32Array.from(Ha);
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
				for (let e = 0; e < Ra; ++e) a[e] = 54 ^ n[e], a[e + Ra] = 92 ^ n[e];
				r.update(a.subarray(0, Ra)), i.update(a.subarray(Ra));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = cr(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > Ba) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === Ra && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(Ha), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % Ra >= 56) {
				for (let e = n; e < Ra; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(za);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = cr(t);
			if (n.byteLength > Ra) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(Ra);
				return i.set(r), i;
			}
			if (n.byteLength < Ra) {
				let e = new Uint8Array(Ra);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < Ra; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Ua[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, Ha = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Ua = new Int32Array([
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
})), Ga, Ka, qa, Ja, Ya, Xa, Za = o((() => {
	v(), Wa(), {digest: Ga, sign: Ka, importKey: qa} = globalThis?.crypto?.subtle ?? {}, Ja = typeof Ga == "function" && typeof Ka == "function" && typeof qa == "function" ? globalThis.crypto.subtle : void 0, Ya = 8388608, Xa = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = cr(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= Ya && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = ur(this.pending);
			if (Ja) {
				if (this.secret) {
					this.finished = !0;
					let t = await Ja.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await Ja.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await Ja.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new Va(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new Va(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), Qa = o((() => {
	Ea(), Na(), La(), Wa(), Za();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function $a(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var eo, to = o((() => {
	v(), eo = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && $a(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && $a(e), parseInt(tr(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), no, ro, io, ao, oo, so, co, lo, uo, fo, po, mo, ho, go = o((() => {
	Me(), v(), to(), no = class {
		toUtf8;
		fromUtf8;
		constructor(e, t) {
			this.toUtf8 = e, this.fromUtf8 = t;
		}
		format(e) {
			let t = [];
			for (let n in e) {
				if (!h(e, n)) continue;
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
					if (e.value.byteLength > ho) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ho} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ho) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ho} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(eo.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!mo.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(er(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: io,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: io,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: ao,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: oo,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: so,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: co,
							value: new eo(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: lo,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: uo,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: fo,
							value: new Date(new eo(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: po,
							value: `${tr(o.subarray(0, 4))}-${tr(o.subarray(4, 6))}-${tr(o.subarray(6, 8))}-${tr(o.subarray(8, 10))}-${tr(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(ro ||= {}), io = "boolean", ao = "byte", oo = "short", so = "integer", co = "long", lo = "binary", uo = "string", fo = "timestamp", po = "uuid", mo = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ho = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function _o({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < xo) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(vo, !1), o = r.getUint32(yo, !1), s = r.getUint32(e - bo, !1), c = new Ia();
	if (c.update(new Uint8Array(n, t, yo)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + yo, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + yo + bo, a),
		body: new Uint8Array(n, t + yo + bo + a, i - a - 16)
	};
}
var vo, yo, bo, xo, So = o((() => {
	Qa(), vo = 4, yo = 8, bo = 4, xo = 16;
})), Co, wo = o((() => {
	Qa(), go(), So(), Co = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new no(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Ia();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = _o(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), To, Eo = o((() => {
	To = class {
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
})), Do, Oo = o((() => {
	Do = class {
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
})), ko, Ao = o((() => {
	ko = class {
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
})), jo, Mo = o((() => {
	jo = class {
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
function No(e) {
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
var Po = o((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Fo(e, t) {
	let n = Io(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Io(e, t) {
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
var Lo = o((() => {})), Ro, zo, Bo = o((() => {
	wo(), Eo(), Oo(), Ao(), Mo(), Po(), Lo(), Ro = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new Co(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = No(e);
			return new ko({
				messageStream: new To({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Io(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Do({
				messageStream: new jo({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, zo = (e) => new Ro(e);
})), Vo, Ho, Uo = o((() => {
	Vo = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), Ho = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Wo, Go, Ko, qo = o((() => {
	Bo(), Uo(), Wo = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Ro({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Go(e) ? Vo(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? Ho(n) : n;
		}
	}, Go = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Ko = (e) => new Wo(e);
})), Jo, Yo = o((() => {
	Jo = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), Xo, Zo = o((() => {
	Me(), _(), v(), Xo = class {
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
				for (let n in e) if (h(e, n) && n !== "__type") {
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
				for (let t in e) if (h(e, t) && t !== "__type") {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? It)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				for (let e in u.value) h(u.value, e) && (n[e] = u.value[e]);
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
				let e = a[1], t = it.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? At)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), Qo = /* @__PURE__ */ c({
	EventStreamCodec: () => Co,
	EventStreamMarshaller: () => Wo,
	EventStreamSerde: () => Xo,
	HeaderMarshaller: () => no,
	Int64: () => eo,
	MessageDecoderStream: () => To,
	MessageEncoderStream: () => Do,
	SmithyMessageDecoderStream: () => ko,
	SmithyMessageEncoderStream: () => jo,
	UniversalEventStreamMarshaller: () => Ro,
	eventStreamSerdeProvider: () => Ko,
	getChunkedStream: () => No,
	getMessageUnmarshaller: () => Io,
	getUnmarshalledStream: () => Fo,
	iterableToReadableStream: () => Ho,
	readableStreamToIterable: () => Vo,
	resolveEventStreamSerdeConfig: () => Jo,
	universalEventStreamSerdeProvider: () => zo
}), $o = o((() => {
	wo(), go(), to(), Eo(), Oo(), Ao(), Mo(), qo(), Uo(), Bo(), Po(), Lo(), Yo(), Zo();
}));
Me(), _();
var es = class extends Sa {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new it(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return he;
	}
	getResponseType() {
		return _e;
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.serializer.setSerdeContext(e), this.deserializer.setSerdeContext(e), this.getPayloadCodec() && this.getPayloadCodec().setSerdeContext(e);
	}
	updateServiceEndpoint(e, t) {
		if ("url" in t) {
			e.protocol = t.url.protocol, e.hostname = t.url.hostname, e.port = t.url.port ? Number(t.url.port) : void 0, e.path = t.url.pathname, e.fragment = t.url.hash || void 0, e.username = t.url.username || void 0, e.password = t.url.password || void 0, e.query ||= {};
			for (let [n, r] of t.url.searchParams.entries()) e.query[n] = r;
			if (t.headers) for (let n in t.headers) h(t.headers, n) && (e.headers[n] = t.headers[n].join(", "));
			return e;
		}
		if (e.protocol = t.protocol, e.hostname = t.hostname, e.port = t.port ? Number(t.port) : void 0, e.path = t.path, e.query = { ...t.query }, t.headers) for (let n in t.headers) h(t.headers, n) && (e.headers[n] = t.headers[n]);
		return e;
	}
	setHostPrefix(e, t, n) {
		if (this.serdeContext?.disableHostPrefix) return;
		let r = g.of(t.input), i = Je(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !Se(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => ($o(), Qo));
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
Me(), _(), v();
var ts = class extends es {
	async serializeRequest(e, t, n) {
		let r = t && typeof t == "object" ? t : {}, i = this.serializer, a = {}, o = {}, s = await n.endpoint(), c = g.of(e?.input), l = [], u = [], d = !1, f, p = new he({
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
			let t = Je(e.traits);
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
				p.path.includes(`{${e}+}`) ? p.path = p.path.replace(`{${e}+}`, n.split("/").map(xa).join("/")) : p.path.includes(`{${e}}`) && (p.path = p.path.replace(`{${e}}`, xa(n)));
			} else if (n.httpHeader) i.write(t, s), o[n.httpHeader.toLowerCase()] = String(i.flush());
			else if (typeof n.httpPrefixHeaders == "string") for (let e in s) {
				if (!h(s, e)) continue;
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
			for (let r in t) if (h(t, r) && !(r in n)) {
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
		let r = this.deserializer, i = g.of(e.output), a = {};
		if (n.statusCode >= 300) {
			let i = await ba(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!h(n.headers, e)) continue;
			let t = n.headers[e];
			delete n.headers[e], n.headers[e.toLowerCase()] = t;
		}
		let o = await this.deserializeHttpMessage(i, t, n, a);
		if (o.length) {
			let e = await ba(n.body, t);
			if (e.byteLength > 0) {
				let t = await r.read(i, e);
				for (let e of o) t[e] != null && (a[e] = t[e]);
			}
		} else o.discardResponseBody && await ba(n.body, t);
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	async deserializeHttpMessage(e, t, n, r, i) {
		let a;
		a = r instanceof Set ? i : r;
		let o = !0, s = this.deserializer, c = g.of(e), l = [];
		for (let [e, r] of c.structIterator()) {
			let i = r.getMemberTraits();
			if (i.httpPayload) {
				if (o = !1, r.isStreaming()) r.isStructSchema() ? a[e] = await this.deserializeEventStream({
					response: n,
					responseSchema: c
				}) : a[e] = da(n.body);
				else if (n.body) {
					let i = await ba(n.body, t);
					i.byteLength > 0 && (a[e] = await s.read(r, i));
				}
			} else if (i.httpHeader) {
				let t = String(i.httpHeader).toLowerCase(), o = n.headers[t];
				if (o != null) {
					if (r.isListSchema()) {
						let n = r.getValueSchema();
						n.getMergedTraits().httpHeader = t;
						let i;
						i = n.isTimestampSchema() && n.getSchema() === 4 ? qn(o, ",", 2) : Yn(o);
						let c = [];
						for (let e of i) c.push(await s.read(n, e.trim()));
						a[e] = c;
					} else a[e] = await s.read(r, o);
				}
			} else if (i.httpPrefixHeaders !== void 0) {
				a[e] = {};
				for (let t in n.headers) if (h(n.headers, t) && t.startsWith(i.httpPrefixHeaders)) {
					let o = n.headers[t], c = r.getValueSchema();
					c.getMergedTraits().httpHeader = t, a[e][t.slice(i.httpPrefixHeaders.length)] = await s.read(c, o);
				}
			} else i.httpResponseCode ? a[e] = n.statusCode : l.push(e);
		}
		return l.discardResponseBody = o, l;
	}
};
Me(), _();
var ns = class extends es {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = g.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new he({
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
		let r = this.deserializer, i = g.of(e.output), a = {};
		if (this.isErrorResponse(n.statusCode)) {
			let i = await ba(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!h(n.headers, e)) continue;
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
			let e = await ba(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function rs(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
_(), v();
var is = class extends Sa {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	read(e, t) {
		let n = g.of(e);
		if (n.isListSchema()) return Yn(t).map((e) => this.read(n.getValueSchema(), e));
		if (n.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? Ot)(t);
		if (n.isTimestampSchema()) switch (rs(n, this.settings)) {
			case 5: return Wn(t);
			case 6: return Gn(t);
			case 7: return Un(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (n.isStringSchema()) {
			let e = n.getMergedTraits().mediaType, r = t;
			if (e) return n.getMergedTraits().httpHeader && (r = this.base64ToUtf8(r)), (e === "application/json" || e.endsWith("+json")) && (r = On.from(r)), r;
		}
		return n.isNumericSchema() ? Number(t) : n.isBigIntegerSchema() ? BigInt(t) : n.isBigDecimalSchema() ? new Qn(t, "bigDecimal") : n.isBooleanSchema() ? String(t).toLowerCase() === "true" : t;
	}
	base64ToUtf8(e) {
		return (this.serdeContext?.utf8Encoder ?? It)((this.serdeContext?.base64Decoder ?? Ot)(e));
	}
};
_(), v();
var as = class extends Sa {
	codecDeserializer;
	stringDeserializer;
	constructor(e, t) {
		super(), this.codecDeserializer = e, this.stringDeserializer = new is(t);
	}
	setSerdeContext(e) {
		this.stringDeserializer.setSerdeContext(e), this.codecDeserializer.setSerdeContext(e), this.serdeContext = e;
	}
	read(e, t) {
		let n = g.of(e), r = n.getMergedTraits(), i = this.serdeContext?.utf8Encoder ?? It;
		if (r.httpHeader || r.httpResponseCode) return this.stringDeserializer.read(n, i(t));
		if (r.httpPayload) {
			if (n.isBlobSchema()) {
				let e = this.serdeContext?.utf8Decoder ?? At;
				return typeof t == "string" ? e(t) : t;
			}
			if (n.isStringSchema()) return "byteLength" in t ? i(t) : t;
		}
		return this.codecDeserializer.read(n, t);
	}
};
_(), v();
var os = class extends Sa {
	settings;
	stringBuffer = "";
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = g.of(e);
		switch (typeof t) {
			case "object":
				if (t === null) {
					this.stringBuffer = "null";
					return;
				}
				if (n.isTimestampSchema()) {
					if (!(t instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${t} when schema expected Date in ${n.getName(!0)}`);
					switch (rs(n, this.settings)) {
						case 5:
							this.stringBuffer = t.toISOString().replace(".000Z", "Z");
							break;
						case 6:
							this.stringBuffer = an(t);
							break;
						case 7:
							this.stringBuffer = String(t.getTime() / 1e3);
							break;
						default: console.warn("Missing timestamp format, using epoch seconds", t), this.stringBuffer = String(t.getTime() / 1e3);
					}
					return;
				}
				if (n.isBlobSchema() && "byteLength" in t) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? Mt)(t);
					return;
				}
				if (n.isListSchema() && Array.isArray(t)) {
					let e = "";
					for (let r of t) {
						this.write([n.getValueSchema(), n.getMergedTraits()], r);
						let t = this.flush(), i = n.getValueSchema().isTimestampSchema() ? t : An(t);
						e !== "" && (e += ", "), e += i;
					}
					this.stringBuffer = e;
					return;
				}
				this.stringBuffer = JSON.stringify(t, null, 2);
				break;
			case "string":
				let e = n.getMergedTraits().mediaType, r = t;
				if (e && ((e === "application/json" || e.endsWith("+json")) && (r = On.from(r)), n.getMergedTraits().httpHeader)) {
					this.stringBuffer = (this.serdeContext?.base64Encoder ?? Mt)(r.toString());
					return;
				}
				this.stringBuffer = t;
				break;
			default: this.stringBuffer = n.isIdempotencyToken() ? ya() : String(t);
		}
	}
	flush() {
		let e = this.stringBuffer;
		return this.stringBuffer = "", e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/HttpInterceptingShapeSerializer.js
_();
var ss = class {
	codecSerializer;
	stringSerializer;
	buffer;
	constructor(e, t, n = new os(t)) {
		this.codecSerializer = e, this.stringSerializer = n;
	}
	setSerdeContext(e) {
		this.codecSerializer.setSerdeContext(e), this.stringSerializer.setSerdeContext(e);
	}
	write(e, t) {
		let n = g.of(e), r = n.getMergedTraits();
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
}, cs = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), ls = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
Me();
var us = "content-length";
function ds(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (he.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(us) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[us]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var fs = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, ps = (e) => ({ applyToStack: (t) => {
	t.add(ds(e.bodyLengthChecker), fs);
} }), ms = (e) => encodeURIComponent(e).replace(/[!'()*]/g, hs), hs = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function gs(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = ms(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${ms(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${ms(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var _s = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, vs = class {
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
}, ys;
function bs() {
	if (ys === void 0) try {
		if (typeof Buffer != "function") ys = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			ys = typeof e == "object" && !!e;
		}
	} catch {
		ys = !1;
	}
	return ys;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
v();
function xs(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? Cs(e, t) ? t : new Qn(e, "bigDecimal") : Ss(e) ? new Qn(e, "bigDecimal") : /[eE]/.test(e) ? Ts(e) : BigInt(e);
	}
	return t;
}
function Ss(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function Cs(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return ws(e) === ws(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === ws(r) : !1;
}
function ws(e) {
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
function Ts(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
_();
var Es = Symbol.for("@aws-sdk/reviver");
function Ds(e) {
	let t = g.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (Es in n) return n[Es];
		let e = Os(t, /* @__PURE__ */ new Set());
		return n[Es] = e, e;
	}
	return Os(t, /* @__PURE__ */ new Set());
}
function Os(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (Os(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (Os(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
v();
var ks = (e, t) => ba(e, t).then((e) => (t?.utf8Encoder ?? It)(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function As(e, t, n) {
	let r;
	if (bs() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await ba(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await ks(e, t), r.length === 0) return {};
	let i = n && Ds(n) ? xs : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var js = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), Ms = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, Ns = (e, t) => Fs(e, t, [
	"header",
	"code",
	"type"
]), Ps = (e, t, n = !1) => Fs(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), Fs = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = js(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return Ms(e[n]);
			break;
		case "code":
			let r = js(t ?? {}, "code");
			if (r && t[r] !== void 0) return Ms(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return Ms(t.__type);
	}
};
_(), v(), Me();
var Is = class extends _s {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = Ds(e) ? xs : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && bs()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await As(t, this.serdeContext, e);
		return this._read(e, r);
	}
	readObject(e, t) {
		return this._read(e, t);
	}
	_read(e, t) {
		let n = typeof t == "object" && !!t, r = g.of(e);
		if (n) {
			if (r.isStructSchema()) return this._readStruct(r, t);
			if (Array.isArray(t) && r.isListSchema()) {
				let e = r.getValueSchema();
				if (this.needsTransform(e)) for (let n = 0; n < t.length; ++n) t[n] = this._read(e, t[n]);
				return t;
			}
			if (r.isMapSchema()) {
				let e = r.getValueSchema(), n = t;
				if (this.needsTransform(e)) for (let t in n) h(n, t) && (t === "__proto__" && ma(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return Ot(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? On.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (rs(r, this.settings)) {
			case 5: return ln(t);
			case 6: return pn(t);
			case 7: return mn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (r.isBigIntegerSchema() && (typeof t == "number" || typeof t == "string")) return BigInt(t);
		if (r.isBigDecimalSchema() && t != null) {
			if (t instanceof Qn) return t;
			let e = t;
			return e.type === "bigDecimal" && "string" in e ? new Qn(e.string, e.type) : new Qn(String(t), "bigDecimal");
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
				n instanceof Qn || (t[e] = this._read(r, n));
			}
			else {
				let e = t;
				for (let t in e) {
					if (!h(e, t)) continue;
					t === "__proto__" && ma(e);
					let n = e[t];
					n instanceof Qn || (e[t] = this._read(r, n));
				}
			}
		}
		return t;
	}
	_readStruct(e, t) {
		let n = e.isUnionSchema(), r = {}, i, a = typeof t.__type == "string", { jsonName: o } = this.settings;
		o && a && (i = {});
		let s;
		n && (s = new vs(t, r));
		for (let [c, l] of e.structIterator()) {
			let e = c;
			o && (e = l.getMergedTraits().jsonName ?? e, a && (i[e] = c)), n && s.mark(e), t[e] != null && (r[c] = this._read(l, t[e]));
		}
		if (n) s.writeUnknown();
		else if (a) for (let e in t) {
			if (!h(t, e)) continue;
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
v();
var Ls = class e extends Uint8Array {
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
			e > Rs + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), Rs = e), this.string = It(this);
		}
		return this.string;
	}
}, Rs = 0;
_(), v(), Me();
var zs = new TextEncoder(), Bs = 123, Vs = 125, Hs = 91, Us = 93, Ws = 34, Gs = 58, Ks = 44, qs = 92, Js = new Uint8Array([
	116,
	114,
	117,
	101
]), Ys = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), Xs = new Uint8Array([
	110,
	117,
	108,
	108
]), Zs = Array(128).fill(null);
Zs[8] = "b", Zs[9] = "t", Zs[10] = "n", Zs[12] = "f", Zs[13] = "r", Zs[34] = "\"", Zs[92] = "\\";
for (let e = 0; e < 32; e++) Zs[e] === null && (Zs[e] = "u00" + e.toString(16).padStart(2, "0"));
var Qs = 2048;
function $s(e) {
	return Ls.allocUnsafe(e);
}
var ec = class e extends _s {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = $s(Qs);
	}
	write(e, t) {
		this.i = 0, this.rawValue = t, this.rootSchema = g.of(e), this.passthrough = this.rootSchema.isBlobSchema() || this.rootSchema.isStringSchema(), this.passthrough || this.writeValue(this.rootSchema, t, void 0);
	}
	writeDiscriminatedDocument(e, t) {
		this.i = 0, this.rootSchema = g.of(e);
		let n = this.rootSchema;
		if (n.isStructSchema() && typeof t == "object" && t) {
			this.writeValue(n, t, void 0);
			let e = `"__type":"${n.getName(!0) ?? "Unknown"}",`, r = e.length;
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), zs.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = $s(Qs), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = $s(r);
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
		n[r++] = Ws;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = Ws, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = Ws;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = Zs[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = qs;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = zs.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = Ws;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = qs, t[n++] = 117;
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
		r[a++] = Ws;
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
		r[a++] = Ws, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && g.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(ya());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(Xs, this.i), this.i += 4;
			return;
		}
		let r = g.of(e), i = typeof t == "object";
		if (r.isStringSchema()) {
			let e = r.getMergedTraits().mediaType;
			if (e && (e === "application/json" || e.endsWith("+json"))) {
				this.writeJsonString(On.from(t).toString());
				return;
			}
		}
		if (this.settings.bigNumberAsString && t != null && (r.isBigIntegerSchema() || r.isBigDecimalSchema())) {
			let e = t instanceof Qn ? t.string : String(t);
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
			if (t instanceof Qn) {
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
				let e = (this.serdeContext?.base64Encoder ?? Mt)(t);
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
			t ? (n.set(Js, e), e += 4) : (n.set(Ys, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = Bs;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = Ks), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Gs, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Gs, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = Ks), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Gs, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = Vs;
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
			this.ensure(n.length * 3), this.i += zs.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Hs;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = Ks), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = Us;
	}
	writeMap(e, t, n) {
		let r = !!e.getMergedTraits().sparse, i = e.getValueSchema();
		if (!n && (i.isStringSchema() || i.isNumericSchema() || i.isBooleanSchema())) {
			let e;
			for (let n in t) {
				if (!h(t, n)) continue;
				let i = t[n];
				Number.isNaN(i) || i === Infinity || i === -Infinity ? ((e ??= {})[n] = i, t[n] = String(i)) : i === null && !r && ((e ??= {})[n] = null, t[n] = void 0);
			}
			let n = JSON.stringify(t);
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += zs.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Bs;
		let a = !0;
		for (let e in t) {
			if (!h(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = Ks), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Gs, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = Vs;
	}
	writeTimestamp(e, t) {
		switch (rs(e, this.settings)) {
			case 5: {
				let e = t.toISOString().replace(".000Z", "Z");
				this.writeAsciiQuoted(e);
				return;
			}
			case 6:
				this.writeAsciiQuoted(an(t));
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
}, tc = class extends _s {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new ec(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Is(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
}, nc = [
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
], rc = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], ic = [
	500,
	502,
	503,
	504
], ac = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], oc = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], sc = (e) => e?.$retryable !== void 0, cc = (e) => e.$metadata?.clockSkewCorrected, lc = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, uc = (e) => e.$metadata?.httpStatusCode === 429 || nc.includes(e.name) || e.$retryable?.throttling == 1, dc = (e, t = 0) => e?.name !== "AbortError" && (sc(e) || cc(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || rc.includes(e.name) || ac.includes(e?.code || "") || oc.includes(e?.code || "") || ic.includes(e.$metadata?.httpStatusCode || 0) || lc(e) || pc(e) || e.cause !== void 0 && t <= 10 && dc(e.cause, t + 1)), fc = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !dc(e);
	}
	return !1;
};
function pc(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var mc = 2e4, hc = "amz-sdk-invocation-id", gc = "amz-sdk-request";
Me(), ve(), v();
function _c(e, t) {
	if (_e.isInstance(e)) for (let n in e.headers) {
		if (!h(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (pn(r).getTime() - Date.now()) / 1e3;
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
var vc = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
ge(), v();
function yc(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (xc(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = he.isInstance(d);
			for (f && (d.headers[hc] = va());;) try {
				f && (d.headers[gc] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = Sc(n, t.logger);
				if (c = vc(n), f && e(d)) throw (r.logger instanceof St ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await bc(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var bc = (e) => new Promise((t) => setTimeout(t, e)), xc = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, Sc = (e, t) => {
	let n = {
		error: e,
		errorType: Cc(e)
	}, r = _c(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, Cc = (e) => uc(e) ? "THROTTLING" : dc(e) ? "TRANSIENT" : fc(e) ? "SERVER_ERROR" : "CLIENT_ERROR", wc = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function Tc(e) {
	let t = yc(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), wc);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var Ec = class e {
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
		if (n?.errorType === "THROTTLING" || uc(n?.error ?? e)) {
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
}, Dc = class e {
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
}, Oc = class {
	x = Dc.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, mc);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, kc = class {
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
		return Math.min(mc, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Ac;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Ac ||= {});
var jc = Ac.STANDARD, Mc = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, Nc = class {
	mode = Ac.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= Dc.delay(), this.retryBackoffStrategy ??= new Oc();
	}
	async acquireInitialRetryToken(e) {
		return new kc(Dc.delay(), 0, void 0, Dc.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? Dc.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new kc(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = Dc.v2026 && r === Mc.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : Mc.incompatible, a = r < n ? 0 : Mc.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : Mc.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === Dc.modifiedCostType() ? Dc.throttlingCost() : Dc.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, Pc = class {
	mode = Ac.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new Ec(), this.standardRetryStrategy = t ? new Nc({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new Nc(e);
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
Te();
var Fc = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = Dc.delay() } = t ?? {}, o = we(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await we(r)() === Ac.ADAPTIVE ? new Pc(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new Nc({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, Ic = Tc(f);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
Dc.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function Lc(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
ge();
function Rc(e) {
	return e;
}
var zc = (e) => (t) => async (n) => {
	if (!he.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, Bc = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, Vc = (e) => ({ applyToStack: (t) => {
	t.add(zc(e), Bc);
} }), Hc = () => (e, t) => async (n) => {
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
}, Uc = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, Wc = (e) => ({ applyToStack: (e) => {
	e.add(Hc(), Uc);
} }), Gc = (e) => ({ applyToStack: (e) => {} }), Kc = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
Me();
function qc(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var Jc = (e, t) => (n, r) => async (i) => {
	let a = Kc(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = qc(e.httpAuthSchemes), s = de(r), c = [];
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
}, Yc = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, Xc = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(Jc(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), Yc);
} });
ge(), Me();
var Zc = (e) => (e) => {
	throw e;
}, Qc = (e, t) => {}, $c = (e) => (e, t) => async (n) => {
	if (!he.isInstance(n.request)) return e(n);
	let r = de(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Zc)(i));
	return (o.successHandler || Qc)(s.response, i), s;
}, el = {
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
}, tl = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo($c(e), el);
} }), nl = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
Me();
var rl = class {
	authSchemes = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let t in e) {
			if (!h(e, t)) continue;
			let n = e[t];
			n !== void 0 && this.authSchemes.set(t, n);
		}
	}
	getIdentityProvider(e) {
		return this.authSchemes.get(e);
	}
}, il = ((e) => function(t) {
	return al(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), al = (e) => e.expiration !== void 0, ol = (e, t, n) => {
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
function sl(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function cl(e) {
	let t = nl(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!sl(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var ll = {
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
}, ul = "", dl = (e) => {
	let { partitions: t } = ll;
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
}, fl = () => ul, pl = /\d{12}\.ddb/;
async function ml(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && Lc(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Ac.ADAPTIVE:
				Lc(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Ac.STANDARD: Lc(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(pl) && Lc(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				Lc(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				Lc(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": Lc(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && Lc(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) Lc(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var hl = "user-agent", gl = "x-amz-user-agent", _l = /[^!$%&'*+\-.^_`|~\w]/g, vl = /[^!$%&'*+\-.^_`|~\w#]/g, yl = 1024;
function bl(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= yl) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
ge();
var xl = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!he.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(Sl) || [], s = (await e.defaultUserAgentProvider()).map(Sl);
	await ml(n, e, r);
	let c = n;
	s.push(`m/${bl(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(Sl) || [], u = await e.userAgentAppId();
	u && s.push(Sl(["app", `${u}`]));
	let d = fl(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[gl] = f : (p && (a[gl] = a["x-amz-user-agent"] ? `${a[hl]} ${p}` : p), a[hl] = f), t({
		...r,
		request: i
	});
}, Sl = (e) => {
	let t = e[0].split("/").map((e) => e.replace(_l, "-")).join("/"), n = e[1]?.replace(vl, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, Cl = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, wl = (e) => ({ applyToStack: (t) => {
	t.add(xl(e), Cl);
} }), Tl = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? El.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? El.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, El = {
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
ea(), hi();
var Dl = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!Dl(t)) return !1;
		return !0;
	}
	return !(!be(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || mi(e));
}, Ol = ":", kl = "/", Al = (e) => {
	let t = e.split(Ol);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(Ol) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(kl)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
ea();
var jl = {
	isVirtualHostableS3Bucket: Dl,
	parseArn: Al,
	partition: dl
};
Zr.aws = jl;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var Ml = (e, t, n) => {
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
Me();
var Nl = /* @__PURE__ */ new Set(), Pl = (e, t = be) => {
	if (!Nl.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else Nl.add(e);
}, Fl = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), Il = (e) => Fl(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, Ll = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = Il(typeof t == "function" ? await t() : t);
			return Pl(e), e;
		},
		useFipsEndpoint: async () => Fl(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, Rl = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], zl = ({ defaultsMode: e } = {}) => Ml(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(Bl() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${Rl.join(", ")}, got ${t}`);
	}
}), Bl = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, Vl = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), Hl = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ve();
var Ul = (e) => _e.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, Wl = (e) => _e.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, Gl = (e) => new Date(Date.now() + e), Kl = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
ge(), ue();
var ql = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Jl = (e) => e.context?.[ce]?.eventStream?.output === !0, Yl = async (e) => {
	let t = ql("context", e.context), n = ql("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await ql("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, Xl = class {
	async sign(e, t, n) {
		if (!he.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await Yl(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Jl(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Gl(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? Ul(n.$response);
				if (t) {
					let r = ql("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = Wl(n.$response), s = Kl(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = Ul(e);
		if (n) {
			let r = ql("config", t.config), i = t._requestSentAt, a = Wl(e);
			r.systemClockOffset = Kl(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4ASigner.js
ge();
var Zl = class extends Xl {
	async sign(e, t, n) {
		if (!he.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let { config: r, signer: i, signingRegion: a, signingRegionSet: o, signingName: s } = await Yl(n), c = (await r.sigv4aSigningRegionSet?.() ?? o ?? [a]).join(","), l = await r.disableClockSkewCorrection?.() === !0;
		return n._disableClockSkewCorrection = l, l || (n._preRequestSystemClockOffset = r.systemClockOffset, n._requestSentAt = Date.now()), await i.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : Gl(r.systemClockOffset),
			signingRegion: c,
			signingService: s
		});
	}
}, Ql = (e) => (e.sigv4aSigningRegionSet = nl(e.sigv4aSigningRegionSet), e);
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
v();
var $l = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!h(e, n)) continue;
			let r = At(n);
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
				let o = At(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(nu.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!tu.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(er(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, eu;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(eu ||= {});
var tu = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, nu = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && ru(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && ru(e), parseInt(tr(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function ru(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var iu = "X-Amz-Algorithm", au = "X-Amz-Credential", ou = "X-Amz-Date", su = "X-Amz-SignedHeaders", cu = "X-Amz-Expires", lu = "X-Amz-Signature", uu = "X-Amz-Security-Token", du = "authorization", fu = ou.toLowerCase(), pu = [
	du,
	fu,
	"date"
];
lu.toLowerCase();
var mu = "x-amz-content-sha256", hu = uu.toLowerCase(), gu = {
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
}, _u = /^proxy-/, vu = /^sec-/, yu = "AWS4-HMAC-SHA256", bu = "AWS4-HMAC-SHA256-PAYLOAD", xu = "UNSIGNED-PAYLOAD", Su = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
v();
var Cu = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!h(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = ms(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${ms(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${ms(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, wu = (e) => Tu(e).toISOString().replace(/\.\d{3}Z$/, "Z"), Tu = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
Te(), v();
var Eu = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = we(n), this.credentialProvider = we(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${Cu(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(cr(n)), `${r}
${e}
${t}
${tr(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return ms(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = wu(e).replace(/[-:]/g, "");
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
v();
var Du = {}, Ou = [], ku = (e, t, n) => `${e}/${t}/${n}/${Su}`, Au = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${tr(await ju(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Du) return Du[a];
	for (Ou.push(a); Ou.length > 50;) delete Du[Ou.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Su
	]) o = await ju(e, o, t);
	return Du[a] = o;
}, ju = (e, t, n) => {
	let r = new e(t);
	return r.update(cr(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
v();
var Mu = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(h(gu, a) || t?.has(a) || _u.test(a) || vu.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && ma(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
v();
var Nu = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (h(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || fr(t)) {
		let e = new n();
		return e.update(cr(t)), tr(await e.digest());
	}
	return xu;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
v();
var Pu = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (h(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
v(), ge();
var Fu = (e, t = {}) => {
	let { headers: n, query: r = {} } = he.clone(e);
	for (let e in n) {
		if (!h(n, e)) continue;
		let i = e.toLowerCase();
		(i.slice(0, 6) === "x-amz-" && !t.unhoistableHeaders?.has(i) || t.hoistableHeaders?.has(i)) && (r[e] = n[e], delete n[e]);
	}
	return {
		...e,
		headers: n,
		query: r
	};
};
v(), ge();
var Iu = (e) => {
	e = he.clone(e);
	for (let t in e.headers) h(e.headers, t) && pu.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
v();
var Lu = class extends Eu {
	headerFormatter = new $l();
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
		let m = ku(p, d, l ?? this.service), ee = Fu(Iu(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (ee.query[uu] = u.sessionToken), ee.query[iu] = yu, ee.query[au] = `${u.accessKeyId}/${m}`, ee.query[ou] = f, ee.query[cu] = r.toString(10);
		let te = Mu(ee, i, o);
		return ee.query[su] = this.getCanonicalHeaderList(te), ee.query[lu] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(ee, te, await Nu(e, this.sha256))), ee;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = ku(c, s, a ?? this.service), d = await Nu({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			bu,
			l,
			u,
			r,
			tr(await f.digest()),
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
		return c.update(cr(e)), tr(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = Iu(e), { longDate: l, shortDate: u } = this.formatDate(t), d = ku(u, s, a ?? this.service);
		c.headers[fu] = l, o.sessionToken && (c.headers[hu] = o.sessionToken);
		let f = await Nu(c, this.sha256);
		!Pu("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[mu] = f);
		let p = Mu(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[du] = `${yu} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, yu), a = new this.sha256(await n);
		return a.update(cr(i)), tr(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Au(this.sha256, e, n, t, r || this.service);
	}
}, Ru = { SignatureV4a: null }, zu = (e) => (t) => {
	let n = t.credentials, r = !!t.credentials, i;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== i && (r = !0), n = e;
			let a = Vu(t, Bu(t, {
				credentials: n,
				credentialDefaultProvider: t.credentialDefaultProvider
			}));
			if (r && !a.attributed) {
				let e = typeof n == "object" && !!n;
				i = async (t) => {
					let n = await a(t);
					return e && (!n.$source || Object.keys(n.$source).length === 0) ? d(n, "CREDENTIALS_CODE", "e") : n;
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
	return c = t.signer ? nl(t.signer) : t.regionInfoProvider ? () => nl(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || Lu)(o);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await nl(t.region)(),
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
		return new (t.signerConstructor || Lu)(i);
	}, Object.assign(t, {
		systemClockOffset: o,
		signingEscapePath: a,
		signer: c,
		disableClockSkewCorrection: nl(t.disableClockSkewCorrection ?? e)
	});
};
function Bu(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : ol(t, il, al) : n ? nl(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function Vu(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var Hu = zu(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthSchemeProvider.js
fe(), Te();
var Uu = async (e, t, n) => ({
	operation: de(t).operation,
	region: await we(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function Wu(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "lambda",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var Gu = (e) => {
	let t = [];
	return e.operation, t.push(Wu(e)), t;
}, Ku = (e) => {
	let t = Hu(e);
	return Object.assign(t, { authSchemePreference: we(e.authSchemePreference ?? []) });
}, qu = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "lambda"
}), Ju = {
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
}, Yu = {
	name: "@aws-sdk/client-lambda",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Lambda Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-lambda",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-lambda"
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
function Xu(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function Zu(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ve();
var Qu = { supported: void 0 }, $u = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), Qu.supported === void 0 && (Qu.supported = typeof Request < "u" && "keepalive" in Xu("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = ed(t);
			return Promise.reject(e);
		}
		let s = e.path, c = gs(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), Qu.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let ee = () => {}, te = [o(Xu(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new _e({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new _e({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), Zu(r)];
		return t && te.push(new Promise((e, n) => {
			let r = () => {
				n(ed(t));
			};
			if (typeof t.addEventListener == "function") {
				let e = t;
				e.addEventListener("abort", r, { once: !0 }), ee = () => e.removeEventListener("abort", r);
			} else t.onabort = r;
		})), Promise.race(te).finally(ee);
	}
	updateHttpClientConfig(e, t) {
		this.config = void 0, this.configProvider = this.configProvider.then((n) => (n[e] = t, n));
	}
	httpHandlerConfigs() {
		return this.config ?? {};
	}
};
function ed(e) {
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
_();
var td = class {
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
		let i = it.for(r), a = it.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = ft(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return ft(e, t);
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
			return e.find((e) => g.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
_();
var nd = class extends ns {
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
		}), this.serviceTarget = n, this.codec = i ?? new tc({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new td(this.awsQueryCompatible);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`, r.headers["x-amz-target"] = `${this.serviceTarget}.${e.name}`, this.awsQueryCompatible && (r.headers["x-amzn-query-mode"] = "true"), Fe(e.input) !== "unit" && r.body || (r.body = "{}"), r;
	}
	getPayloadCodec() {
		return this.codec;
	}
	async handleError(e, t, n, r, i) {
		let { awsQueryCompatible: a } = this;
		a && this.mixin.setQueryCompatError(r, n);
		let o = Ps(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = g.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, rd = class extends nd {
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
}, id = class extends nd {
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
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsRestJsonProtocol.js
_();
var ad = class extends ts {
	serializer;
	deserializer;
	codec;
	mixin = new td();
	constructor({ defaultNamespace: e, errorTypeRegistries: t, jsonCodec: n }) {
		super({
			defaultNamespace: e,
			errorTypeRegistries: t
		});
		let r = {
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			httpBindings: !0,
			jsonName: !0
		};
		this.codec = n ?? new tc(r), this.serializer = new ss(this.codec.createSerializer(), r), this.deserializer = new as(this.codec.createDeserializer(), r);
	}
	getShapeId() {
		return "aws.protocols#restJson1";
	}
	getPayloadCodec() {
		return this.codec;
	}
	setSerdeContext(e) {
		this.codec.setSerdeContext(e), super.setSerdeContext(e);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = g.of(e.input);
		if (!r.headers["content-type"]) {
			let e = this.mixin.resolveRestContentType(this.getDefaultContentType(), i);
			e && (r.headers["content-type"] = e);
		}
		return r.body == null && r.headers["content-type"] === this.getDefaultContentType() && (r.body = "{}"), r;
	}
	async deserializeResponse(e, t, n) {
		let r = await super.deserializeResponse(e, t, n), i = g.of(e.output);
		for (let [e, t] of i.structIterator()) t.getMemberTraits().httpPayload && !(e in r) && (r[e] = null);
		return r;
	}
	async handleError(e, t, n, r, i) {
		let a = Ns(n, r) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, a, this.options.defaultNamespace);
		let { errorSchema: o, errorMetadata: s } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, r, i), c = g.of(o), l = r.message ?? r.Message ?? "UnknownError", u = new ((this.compositeErrorRegistry.getErrorCtor(o)) ?? Error)({});
		await this.deserializeHttpMessage(o, t, n, r);
		let d = {}, f = this.codec.createDeserializer();
		for (let [e, t] of c.structIterator()) {
			let n = t.getMergedTraits().jsonName ?? e;
			d[e] = f.readObject(t, r[n]);
		}
		throw this.mixin.decorateServiceException(Object.assign(u, s, {
			$fault: c.getMergedTraits().error,
			message: l
		}, d), r);
	}
	getDefaultContentType() {
		return "application/json";
	}
}, od = /[&<>"]/g, sd = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function cd(e) {
	return e.replace(od, (e) => sd[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/escape-element.js
var ld = /[&"'<>\r\n\u0085\u2028]/g, ud = {
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
function dd(e) {
	return e.replace(ld, (e) => ud[e]);
}
// ../../node_modules/.pnpm/@aws-sdk+xml-builder@3.972.42/node_modules/@aws-sdk/xml-builder/dist-es/XmlText.js
var fd = class {
	value;
	constructor(e) {
		this.value = e;
	}
	toString() {
		return dd("" + this.value);
	}
}, pd = class e {
	name;
	children;
	attributes = {};
	static of(t, n, r) {
		let i = new e(t);
		return n !== void 0 && i.addChildNode(new fd(n)), r !== void 0 && i.withName(r), i;
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
			r != null && (t += ` ${e}="${cd("" + r)}"`);
		}
		return t += e ? `>${this.children.map((e) => e.toString()).join("")}</${this.name}>` : "/>";
	}
}, md;
function hd(e) {
	md ||= new DOMParser();
	let t = md.parseFromString(e, "application/xml");
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
var gd = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, _d = class {
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
function vd(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
_(), v();
var yd = class extends gd {
	settings;
	stringDeserializer;
	constructor(e) {
		super(), this.settings = e, this.stringDeserializer = new is(e);
	}
	setSerdeContext(e) {
		this.serdeContext = e, this.stringDeserializer.setSerdeContext(e);
	}
	read(e, t, n) {
		let r = g.of(e), i = r.getMemberSchemas();
		if (r.isStructSchema() && r.isMemberSchema() && Object.values(i).find((e) => !!e.getMemberTraits().eventPayload)) {
			let e = {}, n = Object.keys(i)[0];
			return e[n] = i[n].isBlobSchema() ? t : this.read(i[n], t), e;
		}
		let a = (this.serdeContext?.utf8Encoder ?? It)(t), o = this.parseXml(a);
		return this.readSchema(e, n ? o[n] : o);
	}
	readSchema(e, t) {
		let n = g.of(e);
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
					t === "__proto__" && vd(i), i[t] = this.readSchema(a, n);
				}
				return i;
			}
			if (n.isStructSchema()) {
				let e = n.isUnionSchema(), r;
				e && (r = new _d(t, i));
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
				t = hd(e);
			} catch (t) {
				throw t && typeof t == "object" && Object.defineProperty(t, "$responseBodyText", { value: e }), t;
			}
			let n = "#text", r = Object.keys(t)[0], i = t[r];
			return i[n] && (i[r] = i[n], delete i[n]), xt(i);
		}
		return {};
	}
}, bd = (e, t) => {
	if (t?.Error?.Code !== void 0) return t.Error.Code;
	if (t?.Code !== void 0) return t.Code;
	if (e.statusCode == 404) return "NotFound";
};
_(), v();
var xd = class extends gd {
	settings;
	stringBuffer;
	byteBuffer;
	buffer;
	constructor(e) {
		super(), this.settings = e;
	}
	write(e, t) {
		let n = g.of(e);
		if (n.isStringSchema() && typeof t == "string") this.stringBuffer = t;
		else if (n.isBlobSchema()) this.byteBuffer = "byteLength" in t ? t : (this.serdeContext?.base64Decoder ?? Ot)(t);
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
		let a = pd.of(i), [o, s] = this.getXmlnsAttribute(e, n);
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
					let t = pd.of(r.getMergedTraits().xmlName ?? r.getMemberName());
					this.writeSimpleInto(r, e, t, s), a.addChildNode(t);
				}
			}
		}
		let { $unknown: c } = t;
		if (c && e.isUnionSchema() && Array.isArray(c) && Object.keys(t).length === 1) {
			let [e, n] = c, r = pd.of(e);
			if (typeof n != "string") {
				if (t instanceof pd || t instanceof fd) a.addChildNode(t);
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
				let r = pd.of(c ? i.xmlName ?? e.getMemberName() : o.xmlName ?? "member");
				this.writeSimpleInto(a, n, r, u), t.addChildNode(r);
			}
		};
		if (c) for (let e of t) (s || e != null) && d(n, e);
		else {
			let r = pd.of(i.xmlName ?? e.getMemberName());
			u && r.addAttribute(l, u);
			for (let e of t) (s || e != null) && d(r, e);
			n.addChildNode(r);
		}
	}
	writeMap(e, t, n, r, i = !1) {
		if (!e.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${e.getName(!0)}`);
		let a = e.getMergedTraits(), o = e.getKeySchema(), s = o.getMergedTraits().xmlName ?? "key", c = e.getValueSchema(), l = c.getMergedTraits(), u = l.xmlName ?? "value", d = !!l.sparse, f = !!a.xmlFlattened, [p, m] = this.getXmlnsAttribute(e, r), ee = (e, t, n) => {
			let r = pd.of(s, t), [i, a] = this.getXmlnsAttribute(o, m);
			a && r.addAttribute(i, a), e.addChildNode(r);
			let l = pd.of(u);
			c.isListSchema() ? this.writeList(c, n, l, m) : c.isMapSchema() ? this.writeMap(c, n, l, m, !0) : c.isStructSchema() ? l = this.writeStruct(c, n, m) : this.writeSimpleInto(c, n, l, m), e.addChildNode(l);
		};
		if (f) for (let r in t) {
			let i = t[r];
			if (d || i != null) {
				let t = pd.of(a.xmlName ?? e.getMemberName());
				ee(t, r, i), n.addChildNode(t);
			}
		}
		else {
			let r;
			i || (r = pd.of(a.xmlName ?? e.getMemberName()), m && r.addAttribute(p, m), n.addChildNode(r));
			for (let e in t) {
				let a = t[e];
				if (d || a != null) {
					let t = pd.of("entry");
					ee(t, e, a), (i ? n : r).addChildNode(t);
				}
			}
		}
	}
	writeSimple(e, t) {
		if (t === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
		let n = g.of(e), r = null;
		if (t && typeof t == "object") {
			if (n.isBlobSchema()) r = (this.serdeContext?.base64Encoder ?? Mt)(t);
			else if (n.isTimestampSchema() && t instanceof Date) switch (rs(n, this.settings)) {
				case 5:
					r = t.toISOString().replace(".000Z", "Z");
					break;
				case 6:
					r = an(t);
					break;
				case 7:
					r = String(t.getTime() / 1e3);
					break;
				default: console.warn("Missing timestamp format, using http date", t), r = an(t);
			}
			else if (n.isBigDecimalSchema() && t) return t instanceof Qn ? t.string : String(t);
			else if (n.isMapSchema() || n.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
			else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${n.getName(!0)}`);
		}
		if ((n.isBooleanSchema() || n.isNumericSchema() || n.isBigIntegerSchema() || n.isBigDecimalSchema()) && (r = String(t)), n.isStringSchema() && (r = t === void 0 && n.isIdempotencyToken() ? ya() : String(t)), r === null) throw Error(`Unhandled schema-value pair ${n.getName(!0)}=${t}`);
		return r;
	}
	writeSimpleInto(e, t, n, r) {
		let i = this.writeSimple(e, t), a = g.of(e), o = new fd(i), [s, c] = this.getXmlnsAttribute(a, r);
		c && n.addAttribute(s, c), n.addChildNode(o);
	}
	getXmlnsAttribute(e, t) {
		let [n, r] = e.getMergedTraits().xmlNamespace ?? [];
		return r && r !== t ? [n ? `xmlns:${n}` : "xmlns", r] : [void 0, void 0];
	}
}, Sd = class extends gd {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new xd(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new yd(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/AwsRestXmlProtocol.js
_();
var Cd = class extends ts {
	codec;
	serializer;
	deserializer;
	mixin = new td();
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
		this.codec = new Sd(t), this.serializer = new ss(this.codec.createSerializer(), t), this.deserializer = new as(this.codec.createDeserializer(), t);
	}
	getPayloadCodec() {
		return this.codec;
	}
	getShapeId() {
		return "aws.protocols#restXml";
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = g.of(e.input);
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
		let a = bd(n, r) ?? "Unknown";
		if (this.mixin.compose(this.compositeErrorRegistry, a, this.options.defaultNamespace), r.Error && typeof r.Error == "object") for (let e of Object.keys(r.Error)) r[e] = r.Error[e], e.toLowerCase() === "message" && (r.message = r.Error[e]);
		r.RequestId && !i.requestId && (i.requestId = r.RequestId);
		let { errorSchema: o, errorMetadata: s } = await this.mixin.getErrorSchemaOrThrowBaseException(a, this.options.defaultNamespace, n, r, i), c = g.of(o), l = r.Error?.message ?? r.Error?.Message ?? r.message ?? r.Message ?? "UnknownError", u = new ((this.compositeErrorRegistry.getErrorCtor(o)) ?? Error)({});
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
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/endpoint/bdd.js
ea();
var wd = "ref", Td = -1, Ed = !0, Dd = "isSet", Od = "PartitionResult", kd = "booleanEquals", Ad = "getAttr", jd = { [wd]: "Endpoint" }, Md = { [wd]: Od }, Nd = {}, Pd = [{ [wd]: "Region" }], Fd = {
	conditions: [
		[Dd, [jd]],
		[Dd, Pd],
		[
			"aws.partition",
			Pd,
			Od
		],
		[kd, [{ [wd]: "UseFIPS" }, Ed]],
		[kd, [{ [wd]: "UseDualStack" }, Ed]],
		[kd, [{
			fn: Ad,
			argv: [Md, "supportsDualStack"]
		}, Ed]],
		[kd, [{
			fn: Ad,
			argv: [Md, "supportsFIPS"]
		}, Ed]]
	],
	results: [
		[Td],
		[Td, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[Td, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[jd, Nd],
		["https://lambda-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Nd],
		[Td, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://lambda-fips.{Region}.{PartitionResult#dnsSuffix}", Nd],
		[Td, "FIPS is enabled but this partition does not support FIPS"],
		["https://lambda.{Region}.{PartitionResult#dualStackDnsSuffix}", Nd],
		[Td, "DualStack is enabled but this partition does not support DualStack"],
		["https://lambda.{Region}.{PartitionResult#dnsSuffix}", Nd],
		[Td, "Invalid Configuration: Missing Region"]
	]
}, Id = 2, Ld = new Int32Array([
	-1,
	1,
	-1,
	0,
	12,
	3,
	1,
	4,
	100000011,
	2,
	5,
	100000011,
	3,
	8,
	6,
	4,
	7,
	100000010,
	5,
	100000008,
	100000009,
	4,
	10,
	9,
	6,
	100000006,
	100000007,
	5,
	11,
	100000005,
	6,
	100000004,
	100000005,
	3,
	100000001,
	13,
	4,
	100000002,
	100000003
]), Rd = zr.from(Ld, Id, Fd.conditions, Fd.results);
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/endpoint/endpointResolver.js
ea();
var zd = new Vr({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), Bd = (e, t = {}) => zd.get(e, () => Xi(Rd, {
	endpointParams: e,
	logger: t.logger
}));
Zr.aws = jl;
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/models/LambdaServiceException.js
var y = class e extends dt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.lambda#LambdaServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, Vd = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidParameterValueException";
	name = "InvalidParameterValueException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "InvalidParameterValueException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Hd = class e extends y {
	static shapeId = "com.amazonaws.lambda#PolicyLengthExceededException";
	name = "PolicyLengthExceededException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "PolicyLengthExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Ud = class e extends y {
	static shapeId = "com.amazonaws.lambda#PreconditionFailedException";
	name = "PreconditionFailedException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "PreconditionFailedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Wd = class e extends y {
	static shapeId = "com.amazonaws.lambda#ResourceConflictException";
	name = "ResourceConflictException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "ResourceConflictException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Gd = class e extends y {
	static shapeId = "com.amazonaws.lambda#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Kd = class e extends y {
	static shapeId = "com.amazonaws.lambda#ServiceException";
	name = "ServiceException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ServiceException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, qd = class e extends y {
	static shapeId = "com.amazonaws.lambda#TooManyRequestsException";
	name = "TooManyRequestsException";
	$fault = "client";
	retryAfterSeconds;
	Type;
	Reason;
	constructor(t) {
		super({
			name: "TooManyRequestsException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.retryAfterSeconds = t.retryAfterSeconds, this.Type = t.Type, this.Reason = t.Reason;
	}
}, Jd = class e extends y {
	static shapeId = "com.amazonaws.lambda#PublicPolicyException";
	name = "PublicPolicyException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "PublicPolicyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Yd = class e extends y {
	static shapeId = "com.amazonaws.lambda#AliasLimitExceededException";
	name = "AliasLimitExceededException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "AliasLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Xd = class e extends y {
	static shapeId = "com.amazonaws.lambda#CapacityProviderLimitExceededException";
	name = "CapacityProviderLimitExceededException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "CapacityProviderLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Zd = class e extends y {
	static shapeId = "com.amazonaws.lambda#KMSAccessDeniedException";
	name = "KMSAccessDeniedException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "KMSAccessDeniedException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Qd = class e extends y {
	static shapeId = "com.amazonaws.lambda#KMSDisabledException";
	name = "KMSDisabledException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "KMSDisabledException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, $d = class e extends y {
	static shapeId = "com.amazonaws.lambda#KMSInvalidStateException";
	name = "KMSInvalidStateException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "KMSInvalidStateException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, ef = class e extends y {
	static shapeId = "com.amazonaws.lambda#KMSNotFoundException";
	name = "KMSNotFoundException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "KMSNotFoundException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, tf = class e extends y {
	static shapeId = "com.amazonaws.lambda#ResourceInUseException";
	name = "ResourceInUseException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ResourceInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, nf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeSigningConfigNotFoundException";
	name = "CodeSigningConfigNotFoundException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "CodeSigningConfigNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, rf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeStorageExceededException";
	name = "CodeStorageExceededException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "CodeStorageExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, af = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeVerificationFailedException";
	name = "CodeVerificationFailedException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "CodeVerificationFailedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, of = class e extends y {
	static shapeId = "com.amazonaws.lambda#FunctionVersionsPerCapacityProviderLimitExceededException";
	name = "FunctionVersionsPerCapacityProviderLimitExceededException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "FunctionVersionsPerCapacityProviderLimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, sf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidCodeSignatureException";
	name = "InvalidCodeSignatureException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "InvalidCodeSignatureException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, cf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeArtifactUserDeletedException";
	name = "CodeArtifactUserDeletedException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "CodeArtifactUserDeletedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, lf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeArtifactUserFailedException";
	name = "CodeArtifactUserFailedException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "CodeArtifactUserFailedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, uf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CodeArtifactUserPendingException";
	name = "CodeArtifactUserPendingException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "CodeArtifactUserPendingException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, df = class e extends y {
	static shapeId = "com.amazonaws.lambda#DurableExecutionAlreadyStartedException";
	name = "DurableExecutionAlreadyStartedException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "DurableExecutionAlreadyStartedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, ff = class e extends y {
	static shapeId = "com.amazonaws.lambda#EC2AccessDeniedException";
	name = "EC2AccessDeniedException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EC2AccessDeniedException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, pf = class e extends y {
	static shapeId = "com.amazonaws.lambda#EC2ThrottledException";
	name = "EC2ThrottledException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EC2ThrottledException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, mf = class e extends y {
	static shapeId = "com.amazonaws.lambda#EC2UnexpectedException";
	name = "EC2UnexpectedException";
	$fault = "server";
	Type;
	Message;
	EC2ErrorCode;
	constructor(t) {
		super({
			name: "EC2UnexpectedException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message, this.EC2ErrorCode = t.EC2ErrorCode;
	}
}, hf = class e extends y {
	static shapeId = "com.amazonaws.lambda#EFSIOException";
	name = "EFSIOException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EFSIOException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, gf = class e extends y {
	static shapeId = "com.amazonaws.lambda#EFSMountConnectivityException";
	name = "EFSMountConnectivityException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EFSMountConnectivityException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, _f = class e extends y {
	static shapeId = "com.amazonaws.lambda#EFSMountFailureException";
	name = "EFSMountFailureException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EFSMountFailureException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, vf = class e extends y {
	static shapeId = "com.amazonaws.lambda#EFSMountTimeoutException";
	name = "EFSMountTimeoutException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "EFSMountTimeoutException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, yf = class e extends y {
	static shapeId = "com.amazonaws.lambda#ENILimitReachedException";
	name = "ENILimitReachedException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ENILimitReachedException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, bf = class e extends y {
	static shapeId = "com.amazonaws.lambda#ENINotReadyException";
	name = "ENINotReadyException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ENINotReadyException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, xf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidRequestContentException";
	name = "InvalidRequestContentException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "InvalidRequestContentException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Sf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidRuntimeException";
	name = "InvalidRuntimeException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "InvalidRuntimeException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Cf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidSecurityGroupIDException";
	name = "InvalidSecurityGroupIDException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "InvalidSecurityGroupIDException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, wf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidSubnetIDException";
	name = "InvalidSubnetIDException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "InvalidSubnetIDException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Tf = class e extends y {
	static shapeId = "com.amazonaws.lambda#InvalidZipFileException";
	name = "InvalidZipFileException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "InvalidZipFileException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Ef = class e extends y {
	static shapeId = "com.amazonaws.lambda#ModeNotSupportedException";
	name = "ModeNotSupportedException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "ModeNotSupportedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Df = class e extends y {
	static shapeId = "com.amazonaws.lambda#NoPublishedVersionException";
	name = "NoPublishedVersionException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "NoPublishedVersionException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Of = class e extends y {
	static shapeId = "com.amazonaws.lambda#RecursiveInvocationException";
	name = "RecursiveInvocationException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "RecursiveInvocationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, kf = class e extends y {
	static shapeId = "com.amazonaws.lambda#RequestTooLargeException";
	name = "RequestTooLargeException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "RequestTooLargeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Af = class e extends y {
	static shapeId = "com.amazonaws.lambda#ResourceNotReadyException";
	name = "ResourceNotReadyException";
	$fault = "server";
	Type;
	constructor(t) {
		super({
			name: "ResourceNotReadyException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, jf = class e extends y {
	static shapeId = "com.amazonaws.lambda#S3FilesMountConnectivityException";
	name = "S3FilesMountConnectivityException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "S3FilesMountConnectivityException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Mf = class e extends y {
	static shapeId = "com.amazonaws.lambda#S3FilesMountFailureException";
	name = "S3FilesMountFailureException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "S3FilesMountFailureException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Nf = class e extends y {
	static shapeId = "com.amazonaws.lambda#S3FilesMountTimeoutException";
	name = "S3FilesMountTimeoutException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "S3FilesMountTimeoutException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Pf = class e extends y {
	static shapeId = "com.amazonaws.lambda#SerializedRequestEntityTooLargeException";
	name = "SerializedRequestEntityTooLargeException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "SerializedRequestEntityTooLargeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Ff = class e extends y {
	static shapeId = "com.amazonaws.lambda#ServiceQuotaExceededException";
	name = "ServiceQuotaExceededException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "ServiceQuotaExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, If = class e extends y {
	static shapeId = "com.amazonaws.lambda#SnapStartException";
	name = "SnapStartException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "SnapStartException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Lf = class e extends y {
	static shapeId = "com.amazonaws.lambda#SnapStartNotReadyException";
	name = "SnapStartNotReadyException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "SnapStartNotReadyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Rf = class e extends y {
	static shapeId = "com.amazonaws.lambda#SnapStartRegenerationFailureException";
	name = "SnapStartRegenerationFailureException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "SnapStartRegenerationFailureException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, zf = class e extends y {
	static shapeId = "com.amazonaws.lambda#SnapStartTimeoutException";
	name = "SnapStartTimeoutException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "SnapStartTimeoutException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Bf = class e extends y {
	static shapeId = "com.amazonaws.lambda#SubnetIPAddressLimitReachedException";
	name = "SubnetIPAddressLimitReachedException";
	$fault = "server";
	Type;
	Message;
	constructor(t) {
		super({
			name: "SubnetIPAddressLimitReachedException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
}, Vf = class e extends y {
	static shapeId = "com.amazonaws.lambda#UnsupportedMediaTypeException";
	name = "UnsupportedMediaTypeException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "UnsupportedMediaTypeException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Hf = class e extends y {
	static shapeId = "com.amazonaws.lambda#ProvisionedConcurrencyConfigNotFoundException";
	name = "ProvisionedConcurrencyConfigNotFoundException";
	$fault = "client";
	Type;
	constructor(t) {
		super({
			name: "ProvisionedConcurrencyConfigNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type;
	}
}, Uf = class e extends y {
	static shapeId = "com.amazonaws.lambda#CallbackTimeoutException";
	name = "CallbackTimeoutException";
	$fault = "client";
	Type;
	Message;
	constructor(t) {
		super({
			name: "CallbackTimeoutException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Type = t.Type, this.Message = t.Message;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/schemas/schemas_0.js
_();
var Wf = "Action", Gf = "AccessConfigs", Kf = "AliasLimitExceededException", qf = "ApplicationLogLevel", Jf = "AmazonManagedKafkaEventSourceConfig", Yf = "ApplyOn", Xf = "AddPermissionRequest", Zf = "AddPermissionResponse", Qf = "AddPermission", $f = "Architectures", ep = "Arn", tp = "Attribute", np = "Blob", rp = "BisectBatchOnFunctionError", ip = "BatchSize", ap = "Concurrency", op = "CodeArtifactUserDeletedException", sp = "CodeArtifactUserFailedException", cp = "CodeArtifactUserPendingException", lp = "ClientContext", up = "CreateEventSourceMapping", dp = "CreateEventSourceMappingRequest", fp = "CreateFunction", pp = "CreateFunctionRequest", mp = "ConsumerGroupId", hp = "CollectionName", gp = "CapacityProviderArn", _p = "CapacityProviderConfig", vp = "CapacityProviderLimitExceededException", yp = "CodeSize", bp = "CodeSigningConfigArn", xp = "CodeSigningConfigNotFoundException", Sp = "CodeStorageExceededException", Cp = "CodeSha256", wp = "ConfigSha256", Tp = "CallbackTimeoutException", Ep = "CodeVerificationFailedException", Dp = "Code", Op = "Command", kp = "Configuration", Ap = "Description", jp = "DestinationConfig", Mp = "DurableConfig", Np = "DocumentDBEventSourceConfig", Pp = "DurableExecutionArn", Fp = "DurableExecutionAlreadyStartedException", Ip = "DurableExecutionName", Lp = "DeleteEventSourceMapping", Rp = "DeleteEventSourceMappingRequest", zp = "DeleteFunction", Bp = "DeleteFunctionRequest", Vp = "DeleteFunctionResponse", Hp = "DeadLetterConfig", Up = "DatabaseName", Wp = "DirectS3Read", Gp = "Destination", Kp = "Error", qp = "ErrorCode", Jp = "EC2AccessDeniedException", Yp = "EC2ErrorCode", Xp = "EC2ThrottledException", Zp = "EC2UnexpectedException", Qp = "EnvironmentError", $p = "ExecutionEnvironmentMemoryGiBPerVCpu", em = "EFSIOException", tm = "EFSMountConnectivityException", nm = "EFSMountFailureException", rm = "EFSMountTimeoutException", im = "ENILimitReachedException", am = "ENINotReadyException", om = "EntryPoint", sm = "EnvironmentResponse", cm = "EventRecordFormat", lm = "EphemeralStorage", um = "EventSourceArn", dm = "EventSourceMappings", fm = "EventSourceMappingArn", pm = "EventSourceMappingConfiguration", mm = "EventSourceMappingsList", hm = "EventSourceMappingLoggingConfig", gm = "EventSourceMappingMetricsConfig", _m = "EventSourceToken", vm = "ExecutionTimeout", ym = "ExecutedVersion", bm = "EnvironmentVariableName", xm = "EnvironmentVariableValue", Sm = "EnvironmentVariables", Cm = "Enabled", wm = "Endpoints", Tm = "Environment", Em = "Filter", Dm = "FunctionArn", Om = "FilterCriteriaError", km = "FunctionCodeLocation", Am = "FunctionCodeLocationError", jm = "FilterCriteria", Mm = "FunctionCode", Nm = "FunctionConfiguration", Pm = "FullDocument", Fm = "FunctionError", Im = "FilterList", Lm = "FunctionList", Rm = "FunctionName", zm = "FunctionResponseTypes", Bm = "FileSystemConfigs", Vm = "FileSystemConfigList", Hm = "FileSystemConfig", Um = "FunctionUrlAuthType", Wm = "FunctionVersion", Gm = "FunctionVersionsPerCapacityProviderLimitExceededException", Km = "Filters", qm = "Functions", Jm = "GetEventSourceMapping", Ym = "GetEventSourceMappingRequest", Xm = "GetFunction", Zm = "GetFunctionRequest", Qm = "GetFunctionResponse", $m = "Handler", eh = "Ipv6AllowedForDualStack", th = "ImageConfig", nh = "ImageConfigError", rh = "ImageConfigResponse", ih = "InvalidCodeSignatureException", ah = "InvalidParameterValueException", oh = "InvalidRequestContentException", sh = "InvalidRuntimeException", ch = "InvocationRequest", lh = "InvocationResponse", uh = "InvalidSecurityGroupIDException", dh = "InvalidSubnetIDException", fh = "InvocationType", ph = "ImageUri", mh = "InvokedViaFunctionUrl", hh = "InvalidZipFileException", gh = "Invoke", _h = "KMSAccessDeniedException", vh = "KMSDisabledException", yh = "KMSInvalidStateException", bh = "KMSKeyArn", xh = "KMSNotFoundException", Sh = "KafkaSchemaRegistryAccessConfig", Ch = "KafkaSchemaRegistryAccessConfigList", wh = "KafkaSchemaRegistryConfig", Th = "KafkaSchemaValidationConfig", Eh = "KafkaSchemaValidationConfigList", Dh = "Layers", Oh = "LoggingConfig", kh = "ListEventSourceMappings", Ah = "ListEventSourceMappingsRequest", jh = "ListEventSourceMappingsResponse", Mh = "LogFormat", Nh = "ListFunctionsRequest", Ph = "ListFunctionsResponse", Fh = "ListFunctions", Ih = "LogGroup", Lh = "LastModified", Rh = "LambdaManagedInstancesCapacityProviderConfig", zh = "LocalMountPath", Bh = "LastProcessingResult", Vh = "LogResult", Hh = "LayersReferenceList", Uh = "LogType", Wh = "LastUpdateStatus", Gh = "LastUpdateStatusReason", Kh = "LastUpdateStatusReasonCode", qh = "Layer", Jh = "Location", b = "Message", Yh = "MasterArn", Xh = "MaximumBatchingWindowInSeconds", Zh = "MetricsConfig", Qh = "MaximumConcurrency", $h = "MaxItems", eg = "ModeNotSupportedException", tg = "MinimumPollers", ng = "MaximumPollers", rg = "MasterRegion", ig = "MaximumRetryAttempts", ag = "MaximumRecordAgeInSeconds", og = "MemorySize", sg = "Marker", cg = "Metrics", lg = "Mode", ug = "NextMarker", dg = "NoPublishedVersionException", fg = "OnFailure", pg = "OnSuccess", mg = "OptimizationStatus", hg = "Principal", gg = "ProvisionedConcurrencyConfigNotFoundException", _g = "PerExecutionEnvironmentMaxConcurrency", vg = "ParallelizationFactor", yg = "PreconditionFailedException", bg = "PollerGroupName", xg = "PolicyLengthExceededException", Sg = "PrincipalOrgID", Cg = "ProvisionedPollerConfig", wg = "PublicPolicyException", Tg = "PackageType", Eg = "PublishTo", Dg = "Payload", Og = "Pattern", kg = "Publish", Ag = "Qualifier", jg = "Queues", Mg = "Reason", Ng = "Retry-After", Pg = "ResourceConflictException", Fg = "ReservedConcurrentExecutions", Ig = "RevisionId", Lg = "RecursiveInvocationException", Rg = "ResolvedImageUri", zg = "ResourceInUseException", Bg = "ResourceNotFoundException", Vg = "ResourceNotReadyException", Hg = "RetentionPeriodInDays", Ug = "ResolvedS3Object", Wg = "RepositoryType", Gg = "RequestTooLargeException", Kg = "RuntimeVersionArn", qg = "RuntimeVersionConfig", Jg = "RuntimeVersionError", Yg = "Role", Xg = "Runtime", Zg = "Statement", Qg = "SourceArn", $g = "SourceAccessConfigurations", e_ = "SourceAccessConfiguration", t_ = "SourceAccount", n_ = "S3Bucket", r_ = "ScalingConfig", i_ = "StatusCode", a_ = "ServiceException", o_ = "S3FilesConfig", s_ = "S3FilesMountConnectivityException", c_ = "S3FilesMountFailureException", l_ = "S3FilesMountTimeoutException", u_ = "SecurityGroupIds", d_ = "StatementId", f_ = "SubnetIPAddressLimitReachedException", p_ = "SubnetIds", m_ = "SigningJobArn", h_ = "S3Key", g_ = "SourceKMSKeyArn", __ = "SystemLogLevel", v_ = "SelfManagedEventSource", y_ = "SelfManagedKafkaEventSourceConfig", b_ = "S3ObjectStorageMode", x_ = "S3ObjectVersion", S_ = "StartingPositionTimestamp", C_ = "SigningProfileVersionArn", w_ = "StartingPosition", T_ = "ServiceQuotaExceededException", E_ = "StateReason", D_ = "SchemaRegistryConfig", O_ = "StateReasonCode", k_ = "SerializedRequestEntityTooLargeException", A_ = "SchemaRegistryURI", j_ = "SensitiveString", M_ = "SnapStartException", N_ = "SnapStartNotReadyException", P_ = "SnapStartResponse", F_ = "SnapStartRegenerationFailureException", I_ = "SnapStartTimeoutException", L_ = "SnapStart", R_ = "StateTransitionReason", z_ = "SchemaValidationConfigs", B_ = "Size", V_ = "State", x = "Type", H_ = "TargetArn", U_ = "TracingConfigResponse", W_ = "TenancyConfig", G_ = "TracingConfig", K_ = "TagsError", q_ = "TenantId", J_ = "TenantIsolationMode", Y_ = "TooManyRequestsException", X_ = "TumblingWindowInSeconds", Z_ = "Tags", Q_ = "Timeout", $_ = "Topics", ev = "UnsupportedMediaTypeException", tv = "URI", nv = "UUID", rv = "Variables", iv = "VpcConfig", av = "VpcConfigResponse", ov = "VpcId", sv = "Version", cv = "WorkingDirectory", lv = "X-Amz-Client-Context", uv = "X-Amz-Durable-Execution-Arn", dv = "X-Amz-Durable-Execution-Name", fv = "X-Amz-Executed-Version", pv = "X-Amz-Function-Error", mv = "X-Amz-Invocation-Type", hv = "X-Amz-Log-Result", gv = "X-Amz-Log-Type", _v = "X-Amz-Tenant-Id", vv = "ZipFile", S = "client", C = "error", yv = "http", w = "httpError", bv = "httpHeader", xv = "httpQuery", Sv = "message", Cv = "retryAfterSeconds", wv = "smithy.ts.sdk.synthetic.com.amazonaws.lambda", Tv = "server", T = "com.amazonaws.lambda", Ev = new it(wv), Dv = [
	-3,
	wv,
	"LambdaServiceException",
	0,
	[],
	[]
];
Ev.registerError(Dv, y);
var E = new it(T), Ov = [
	-3,
	T,
	Kf,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Ov, Yd);
var kv = [
	-3,
	T,
	Tp,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(kv, Uf);
var Av = [
	-3,
	T,
	vp,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Av, Xd);
var jv = [
	-3,
	T,
	op,
	{
		[C]: S,
		[w]: 409
	},
	[x, Sv],
	[0, 0]
];
E.registerError(jv, cf);
var Mv = [
	-3,
	T,
	sp,
	{
		[C]: S,
		[w]: 409
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Mv, lf);
var Nv = [
	-3,
	T,
	cp,
	{
		[C]: S,
		[w]: 409
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Nv, uf);
var Pv = [
	-3,
	T,
	xp,
	{
		[C]: S,
		[w]: 404
	},
	[x, b],
	[0, 0]
];
E.registerError(Pv, nf);
var Fv = [
	-3,
	T,
	Sp,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Fv, rf);
var Iv = [
	-3,
	T,
	Ep,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(Iv, af);
var Lv = [
	-3,
	T,
	Fp,
	{
		[C]: S,
		[w]: 409
	},
	[x, b],
	[0, 0]
];
E.registerError(Lv, df);
var Rv = [
	-3,
	T,
	Jp,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Rv, ff);
var zv = [
	-3,
	T,
	Xp,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(zv, pf);
var Bv = [
	-3,
	T,
	Zp,
	{
		[C]: Tv,
		[w]: 502
	},
	[
		x,
		b,
		Yp
	],
	[
		0,
		0,
		0
	]
];
E.registerError(Bv, mf);
var Vv = [
	-3,
	T,
	em,
	{
		[C]: S,
		[w]: 410
	},
	[x, b],
	[0, 0]
];
E.registerError(Vv, hf);
var Hv = [
	-3,
	T,
	tm,
	{
		[C]: S,
		[w]: 408
	},
	[x, b],
	[0, 0]
];
E.registerError(Hv, gf);
var Uv = [
	-3,
	T,
	nm,
	{
		[C]: S,
		[w]: 403
	},
	[x, b],
	[0, 0]
];
E.registerError(Uv, _f);
var Wv = [
	-3,
	T,
	rm,
	{
		[C]: S,
		[w]: 408
	},
	[x, b],
	[0, 0]
];
E.registerError(Wv, vf);
var Gv = [
	-3,
	T,
	im,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Gv, yf);
var Kv = [
	-3,
	T,
	am,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Kv, bf);
var qv = [
	-3,
	T,
	Gm,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(qv, of);
var Jv = [
	-3,
	T,
	ih,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(Jv, sf);
var Yv = [
	-3,
	T,
	ah,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Yv, Vd);
var Xv = [
	-3,
	T,
	oh,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(Xv, xf);
var Zv = [
	-3,
	T,
	sh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Zv, Sf);
var Qv = [
	-3,
	T,
	uh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Qv, Cf);
var $v = [
	-3,
	T,
	dh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError($v, wf);
var ey = [
	-3,
	T,
	hh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(ey, Tf);
var ty = [
	-3,
	T,
	_h,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(ty, Zd);
var ny = [
	-3,
	T,
	vh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(ny, Qd);
var ry = [
	-3,
	T,
	yh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(ry, $d);
var iy = [
	-3,
	T,
	xh,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(iy, ef);
var ay = [
	-3,
	T,
	eg,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(ay, Ef);
var oy = [
	-3,
	T,
	dg,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(oy, Df);
var sy = [
	-3,
	T,
	xg,
	{
		[C]: S,
		[w]: 400
	},
	[x, Sv],
	[0, 0]
];
E.registerError(sy, Hd);
var cy = [
	-3,
	T,
	yg,
	{
		[C]: S,
		[w]: 412
	},
	[x, Sv],
	[0, 0]
];
E.registerError(cy, Ud);
var ly = [
	-3,
	T,
	gg,
	{
		[C]: S,
		[w]: 404
	},
	[x, Sv],
	[0, 0]
];
E.registerError(ly, Hf);
var uy = [
	-3,
	T,
	wg,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(uy, Jd);
var dy = [
	-3,
	T,
	Lg,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(dy, Of);
var fy = [
	-3,
	T,
	Gg,
	{
		[C]: S,
		[w]: 413
	},
	[x, Sv],
	[0, 0]
];
E.registerError(fy, kf);
var py = [
	-3,
	T,
	Pg,
	{
		[C]: S,
		[w]: 409
	},
	[x, Sv],
	[0, 0]
];
E.registerError(py, Wd);
var my = [
	-3,
	T,
	zg,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(my, tf);
var hy = [
	-3,
	T,
	Bg,
	{
		[C]: S,
		[w]: 404
	},
	[x, b],
	[0, 0]
];
E.registerError(hy, Gd);
var gy = [
	-3,
	T,
	Vg,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, Sv],
	[0, 0]
];
E.registerError(gy, Af);
var _y = [
	-3,
	T,
	s_,
	{
		[C]: S,
		[w]: 408
	},
	[x, b],
	[0, 0]
];
E.registerError(_y, jf);
var vy = [
	-3,
	T,
	c_,
	{
		[C]: S,
		[w]: 403
	},
	[x, b],
	[0, 0]
];
E.registerError(vy, Mf);
var yy = [
	-3,
	T,
	l_,
	{
		[C]: S,
		[w]: 408
	},
	[x, b],
	[0, 0]
];
E.registerError(yy, Nf);
var by = [
	-3,
	T,
	k_,
	{
		[C]: S,
		[w]: 413
	},
	[x, Sv],
	[0, 0]
];
E.registerError(by, Pf);
var xy = [
	-3,
	T,
	a_,
	{
		[C]: Tv,
		[w]: 500
	},
	[x, b],
	[0, 0]
];
E.registerError(xy, Kd);
var Sy = [
	-3,
	T,
	T_,
	{
		[C]: S,
		[w]: 402
	},
	[x, b],
	[0, 0]
];
E.registerError(Sy, Ff);
var Cy = [
	-3,
	T,
	M_,
	{
		[C]: S,
		[w]: 400
	},
	[x, b],
	[0, 0]
];
E.registerError(Cy, If);
var wy = [
	-3,
	T,
	N_,
	{
		[C]: S,
		[w]: 409
	},
	[x, b],
	[0, 0]
];
E.registerError(wy, Lf);
var Ty = [
	-3,
	T,
	F_,
	{
		[C]: S,
		[w]: 409
	},
	[x, b],
	[0, 0]
];
E.registerError(Ty, Rf);
var Ey = [
	-3,
	T,
	I_,
	{
		[C]: S,
		[w]: 408
	},
	[x, b],
	[0, 0]
];
E.registerError(Ey, zf);
var Dy = [
	-3,
	T,
	f_,
	{
		[C]: Tv,
		[w]: 502
	},
	[x, b],
	[0, 0]
];
E.registerError(Dy, Bf);
var Oy = [
	-3,
	T,
	Y_,
	{
		[C]: S,
		[w]: 429
	},
	[
		Cv,
		x,
		Sv,
		Mg
	],
	[
		[0, { [bv]: Ng }],
		0,
		0,
		0
	]
];
E.registerError(Oy, qd);
var ky = [
	-3,
	T,
	ev,
	{
		[C]: S,
		[w]: 415
	},
	[x, Sv],
	[0, 0]
];
E.registerError(ky, Vf);
var Ay = [Ev, E], jy = [
	0,
	T,
	np,
	8,
	21
], My = [
	0,
	T,
	bm,
	8,
	0
], Ny = [
	0,
	T,
	xm,
	8,
	0
], Py = [
	0,
	T,
	j_,
	8,
	0
], Fy = [
	3,
	T,
	Xf,
	0,
	[
		Rm,
		d_,
		Wf,
		hg,
		Qg,
		Um,
		mh,
		t_,
		_m,
		Ag,
		Ig,
		Sg
	],
	[
		[0, 1],
		0,
		0,
		0,
		0,
		0,
		2,
		0,
		0,
		[0, { [xv]: Ag }],
		0,
		0
	],
	4
], Iy = [
	3,
	T,
	Zf,
	0,
	[Zg],
	[0]
], Ly = [
	3,
	T,
	Jf,
	0,
	[mp, D_],
	[0, () => yb]
], Ry = [
	3,
	T,
	_p,
	0,
	[Rh],
	[() => xb],
	1
], zy = [
	3,
	T,
	ap,
	0,
	[Fg],
	[1]
], By = [
	3,
	T,
	dp,
	0,
	[
		Rm,
		um,
		Cm,
		ip,
		jm,
		bh,
		Zh,
		Oh,
		r_,
		Xh,
		vg,
		w_,
		S_,
		jp,
		ag,
		rp,
		ig,
		Z_,
		X_,
		$_,
		jg,
		$g,
		v_,
		zm,
		Jf,
		y_,
		Np,
		Cg
	],
	[
		0,
		0,
		2,
		1,
		() => ib,
		0,
		() => tb,
		() => eb,
		() => Fb,
		1,
		1,
		0,
		4,
		() => Ky,
		1,
		2,
		1,
		128,
		1,
		64,
		64,
		() => ex,
		() => Ib,
		64,
		() => Ly,
		() => Lb,
		() => qy,
		() => Ab
	],
	1
], Vy = [
	3,
	T,
	pp,
	0,
	[
		Rm,
		Yg,
		Dp,
		Xg,
		$m,
		Ap,
		Q_,
		og,
		kg,
		Eg,
		iv,
		Tg,
		Hp,
		Tm,
		bh,
		G_,
		Z_,
		Dh,
		Bm,
		bp,
		th,
		$f,
		lm,
		L_,
		Oh,
		W_,
		_p,
		Mp
	],
	[
		0,
		0,
		[() => ob, 0],
		0,
		0,
		0,
		1,
		1,
		2,
		0,
		() => Gb,
		0,
		() => Hy,
		[() => Yy, 0],
		0,
		() => Ub,
		128,
		64,
		() => Jb,
		0,
		() => pb,
		64,
		() => Qy,
		() => Rb,
		() => Db,
		() => Hb,
		() => Ry,
		() => Jy
	],
	3
], Hy = [
	3,
	T,
	Hp,
	0,
	[H_],
	[0]
], Uy = [
	3,
	T,
	Rp,
	0,
	[nv],
	[[0, 1]],
	1
], Wy = [
	3,
	T,
	Bp,
	0,
	[Rm, Ag],
	[[0, 1], [0, { [xv]: Ag }]],
	1
], Gy = [
	3,
	T,
	Vp,
	0,
	[i_],
	[[1, 32]]
], Ky = [
	3,
	T,
	jp,
	0,
	[pg, fg],
	[() => kb, () => Ob]
], qy = [
	3,
	T,
	Np,
	0,
	[
		Up,
		hp,
		Pm
	],
	[
		0,
		0,
		0
	]
], Jy = [
	3,
	T,
	Mp,
	0,
	[
		bh,
		Hg,
		vm
	],
	[
		0,
		1,
		1
	]
], Yy = [
	3,
	T,
	Tm,
	0,
	[rv],
	[[() => tx, 0]]
], Xy = [
	3,
	T,
	Qp,
	0,
	[qp, b],
	[0, [() => Py, 0]]
], Zy = [
	3,
	T,
	sm,
	0,
	[rv, Kp],
	[[() => tx, 0], [() => Xy, 0]]
], Qy = [
	3,
	T,
	lm,
	0,
	[B_],
	[1],
	1
], $y = [
	3,
	T,
	pm,
	0,
	[
		nv,
		w_,
		S_,
		ip,
		Xh,
		vg,
		um,
		jm,
		Om,
		bh,
		Zh,
		Oh,
		r_,
		Dm,
		Lh,
		Bh,
		V_,
		R_,
		jp,
		$_,
		jg,
		$g,
		v_,
		ag,
		rp,
		ig,
		X_,
		zm,
		Jf,
		y_,
		Np,
		fm,
		Cg
	],
	[
		0,
		0,
		4,
		1,
		1,
		1,
		0,
		() => ib,
		() => ab,
		0,
		() => tb,
		() => eb,
		() => Fb,
		0,
		4,
		0,
		0,
		0,
		() => Ky,
		64,
		64,
		() => ex,
		() => Ib,
		1,
		2,
		1,
		1,
		64,
		() => Ly,
		() => Lb,
		() => qy,
		0,
		() => Ab
	]
], eb = [
	3,
	T,
	hm,
	0,
	[__],
	[0]
], tb = [
	3,
	T,
	gm,
	0,
	[cg],
	[64]
], nb = [
	3,
	T,
	Hm,
	0,
	[
		ep,
		zh,
		o_
	],
	[
		0,
		0,
		() => Pb
	],
	2
], rb = [
	3,
	T,
	Em,
	0,
	[Og],
	[0]
], ib = [
	3,
	T,
	jm,
	0,
	[Km],
	[() => Yb]
], ab = [
	3,
	T,
	Om,
	0,
	[qp, b],
	[0, 0]
], ob = [
	3,
	T,
	Mm,
	0,
	[
		vv,
		n_,
		h_,
		x_,
		b_,
		ph,
		g_
	],
	[
		[() => jy, 0],
		0,
		0,
		0,
		0,
		0,
		0
	]
], sb = [
	3,
	T,
	km,
	0,
	[
		Wg,
		Jh,
		ph,
		Rg,
		Ug,
		g_,
		Kp
	],
	[
		0,
		0,
		0,
		0,
		() => jb,
		0,
		[() => cb, 0]
	]
], cb = [
	3,
	T,
	Am,
	0,
	[qp, b],
	[0, [() => Py, 0]]
], lb = [
	3,
	T,
	Nm,
	0,
	[
		Rm,
		Dm,
		Xg,
		Yg,
		$m,
		yp,
		Ap,
		Q_,
		og,
		Lh,
		Cp,
		sv,
		iv,
		Hp,
		Tm,
		bh,
		G_,
		Yh,
		Ig,
		Dh,
		V_,
		E_,
		O_,
		Wh,
		Gh,
		Kh,
		Bm,
		C_,
		m_,
		Tg,
		rh,
		$f,
		lm,
		L_,
		qg,
		Oh,
		W_,
		_p,
		wp,
		Mp
	],
	[
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		0,
		0,
		() => Kb,
		() => Hy,
		[() => Zy, 0],
		0,
		() => Wb,
		0,
		0,
		() => $b,
		0,
		0,
		0,
		0,
		0,
		0,
		() => Jb,
		0,
		0,
		0,
		[() => hb, 0],
		64,
		() => Qy,
		() => zb,
		[() => Mb, 0],
		() => Db,
		() => Hb,
		() => Ry,
		0,
		() => Jy
	]
], ub = [
	3,
	T,
	Ym,
	0,
	[nv],
	[[0, 1]],
	1
], db = [
	3,
	T,
	Zm,
	0,
	[Rm, Ag],
	[[0, 1], [0, { [xv]: Ag }]],
	1
], fb = [
	3,
	T,
	Qm,
	0,
	[
		kp,
		Dp,
		Z_,
		K_,
		ap
	],
	[
		[() => lb, 0],
		[() => sb, 0],
		128,
		() => Vb,
		() => zy
	]
], pb = [
	3,
	T,
	th,
	0,
	[
		om,
		Op,
		cv
	],
	[
		64,
		64,
		0
	]
], mb = [
	3,
	T,
	nh,
	0,
	[qp, b],
	[0, [() => Py, 0]]
], hb = [
	3,
	T,
	rh,
	0,
	[th, Kp],
	[() => pb, [() => mb, 0]]
], gb = [
	3,
	T,
	ch,
	0,
	[
		Rm,
		fh,
		Uh,
		lp,
		Ip,
		Dg,
		Ag,
		q_
	],
	[
		[0, 1],
		[0, { [bv]: mv }],
		[0, { [bv]: gv }],
		[0, { [bv]: lv }],
		[0, { [bv]: dv }],
		[() => jy, 16],
		[0, { [xv]: Ag }],
		[0, { [bv]: _v }]
	],
	1
], _b = [
	3,
	T,
	lh,
	0,
	[
		i_,
		Fm,
		Vh,
		Dg,
		ym,
		Pp
	],
	[
		[1, 32],
		[0, { [bv]: pv }],
		[0, { [bv]: hv }],
		[() => jy, 16],
		[0, { [bv]: fv }],
		[0, { [bv]: uv }]
	]
], vb = [
	3,
	T,
	Sh,
	0,
	[x, tv],
	[0, 0]
], yb = [
	3,
	T,
	wh,
	0,
	[
		A_,
		cm,
		Gf,
		z_
	],
	[
		0,
		0,
		() => Zb,
		() => Qb
	]
], bb = [
	3,
	T,
	Th,
	0,
	[tp],
	[0]
], xb = [
	3,
	T,
	Rh,
	0,
	[
		gp,
		_g,
		$p
	],
	[
		0,
		1,
		1
	],
	1
], Sb = [
	3,
	T,
	qh,
	0,
	[
		ep,
		yp,
		C_,
		m_
	],
	[
		0,
		1,
		0,
		0
	]
], Cb = [
	3,
	T,
	Ah,
	0,
	[
		um,
		Rm,
		sg,
		$h
	],
	[
		[0, { [xv]: um }],
		[0, { [xv]: Rm }],
		[0, { [xv]: sg }],
		[1, { [xv]: $h }]
	]
], wb = [
	3,
	T,
	jh,
	0,
	[ug, dm],
	[0, () => qb]
], Tb = [
	3,
	T,
	Nh,
	0,
	[
		rg,
		Wm,
		sg,
		$h
	],
	[
		[0, { [xv]: rg }],
		[0, { [xv]: Wm }],
		[0, { [xv]: sg }],
		[1, { [xv]: $h }]
	]
], Eb = [
	3,
	T,
	Ph,
	0,
	[ug, qm],
	[0, [() => Xb, 0]]
], Db = [
	3,
	T,
	Oh,
	0,
	[
		Mh,
		qf,
		__,
		Ih
	],
	[
		0,
		0,
		0,
		0
	]
], Ob = [
	3,
	T,
	fg,
	0,
	[Gp],
	[0]
], kb = [
	3,
	T,
	pg,
	0,
	[Gp],
	[0]
], Ab = [
	3,
	T,
	Cg,
	0,
	[
		tg,
		ng,
		bg
	],
	[
		1,
		1,
		0
	]
], jb = [
	3,
	T,
	Ug,
	0,
	[
		n_,
		h_,
		x_
	],
	[
		0,
		0,
		0
	]
], Mb = [
	3,
	T,
	qg,
	0,
	[Kg, Kp],
	[0, [() => Nb, 0]]
], Nb = [
	3,
	T,
	Jg,
	0,
	[qp, b],
	[0, [() => Py, 0]]
], Pb = [
	3,
	T,
	o_,
	0,
	[Wp],
	[0]
], Fb = [
	3,
	T,
	r_,
	0,
	[Qh],
	[1]
], Ib = [
	3,
	T,
	v_,
	0,
	[wm],
	[[
		2,
		T,
		wm,
		0,
		0,
		64
	]]
], Lb = [
	3,
	T,
	y_,
	0,
	[mp, D_],
	[0, () => yb]
], Rb = [
	3,
	T,
	L_,
	0,
	[Yf],
	[0]
], zb = [
	3,
	T,
	P_,
	0,
	[Yf, mg],
	[0, 0]
], Bb = [
	3,
	T,
	e_,
	0,
	[x, tv],
	[0, 0]
], Vb = [
	3,
	T,
	K_,
	0,
	[qp, b],
	[0, 0],
	2
], Hb = [
	3,
	T,
	W_,
	0,
	[J_],
	[0],
	1
], Ub = [
	3,
	T,
	G_,
	0,
	[lg],
	[0]
], Wb = [
	3,
	T,
	U_,
	0,
	[lg],
	[0]
], Gb = [
	3,
	T,
	iv,
	0,
	[
		p_,
		u_,
		eh
	],
	[
		64,
		64,
		2
	]
], Kb = [
	3,
	T,
	av,
	0,
	[
		p_,
		u_,
		ov,
		eh
	],
	[
		64,
		64,
		0,
		2
	]
], qb = [
	1,
	T,
	mm,
	0,
	() => $y
], Jb = [
	1,
	T,
	Vm,
	0,
	() => nb
], Yb = [
	1,
	T,
	Im,
	0,
	() => rb
], Xb = [
	1,
	T,
	Lm,
	0,
	[() => lb, 0]
], Zb = [
	1,
	T,
	Ch,
	0,
	() => vb
], Qb = [
	1,
	T,
	Eh,
	0,
	() => bb
], $b = [
	1,
	T,
	Hh,
	0,
	() => Sb
], ex = [
	1,
	T,
	$g,
	0,
	() => Bb
], tx = [
	2,
	T,
	Sm,
	8,
	[() => My, 0],
	[() => Ny, 0]
], nx = [
	9,
	T,
	Qf,
	{ [yv]: [
		"POST",
		"/2015-03-31/functions/{FunctionName}/policy",
		201
	] },
	() => Fy,
	() => Iy
], rx = [
	9,
	T,
	up,
	{ [yv]: [
		"POST",
		"/2015-03-31/event-source-mappings",
		202
	] },
	() => By,
	() => $y
], ix = [
	9,
	T,
	fp,
	{ [yv]: [
		"POST",
		"/2015-03-31/functions",
		201
	] },
	() => Vy,
	() => lb
], ax = [
	9,
	T,
	Lp,
	{ [yv]: [
		"DELETE",
		"/2015-03-31/event-source-mappings/{UUID}",
		202
	] },
	() => Uy,
	() => $y
], ox = [
	9,
	T,
	zp,
	{ [yv]: [
		"DELETE",
		"/2015-03-31/functions/{FunctionName}",
		200
	] },
	() => Wy,
	() => Gy
], sx = [
	9,
	T,
	Jm,
	{ [yv]: [
		"GET",
		"/2015-03-31/event-source-mappings/{UUID}",
		200
	] },
	() => ub,
	() => $y
], cx = [
	9,
	T,
	Xm,
	{ [yv]: [
		"GET",
		"/2015-03-31/functions/{FunctionName}",
		200
	] },
	() => db,
	() => fb
], lx = [
	9,
	T,
	gh,
	{ [yv]: [
		"POST",
		"/2015-03-31/functions/{FunctionName}/invocations",
		200
	] },
	() => gb,
	() => _b
], ux = [
	9,
	T,
	kh,
	{ [yv]: [
		"GET",
		"/2015-03-31/event-source-mappings",
		200
	] },
	() => Cb,
	() => wb
], dx = [
	9,
	T,
	Fh,
	{ [yv]: [
		"GET",
		"/2015-03-31/functions",
		200
	] },
	() => Tb,
	() => Eb
];
Qa(), ke(), v();
var fx = (e) => ({
	apiVersion: "2015-03-31",
	base64Decoder: e?.base64Decoder ?? Ot,
	base64Encoder: e?.base64Encoder ?? Mt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Bd,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? Gu,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Xl()
	}],
	logger: e?.logger ?? new St(),
	protocol: e?.protocol ?? ad,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.lambda",
		errorTypeRegistries: Ay,
		version: "2015-03-31",
		serviceTarget: "AWSGirApiService"
	},
	serviceId: e?.serviceId ?? "Lambda",
	sha256: e?.sha256 ?? Xa,
	urlParser: e?.urlParser ?? Oe,
	utf8Decoder: e?.utf8Decoder ?? At,
	utf8Encoder: e?.utf8Encoder ?? It
});
$o(), v(), la();
var px = (e) => {
	let t = zl(e), n = () => t().then(pt), r = fx(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? or,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Tl({
			serviceId: r.serviceId,
			clientVersion: Yu.version
		}),
		eventStreamSerdeProvider: e?.eventStreamSerdeProvider ?? Ko,
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? Ne("Region is missing"),
		requestHandler: $u.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || jc),
		streamCollector: e?.streamCollector ?? ca,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, mx = (e) => {
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
}, hx = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), gx = (e, t) => {
	let n = Object.assign(Vl(e), yt(e), cs(e), mx(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Hl(n), bt(n), ls(n), hx(n));
};
ea(), $o(), _();
var _x = class extends Pe {
	config;
	constructor(...[e]) {
		let t = px(e || {});
		super(t), this.initConfig = t;
		let n = Rc(Ll(Fc(cl(qu(t))))), r = Qi(n), i = gx(Ku(Jo(r)), e?.extensions || []);
		this.config = i, this.middlewareStack.use(We(this.config)), this.middlewareStack.use(wl(this.config)), this.middlewareStack.use(Ic(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(Vc(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Gc(this.config)), this.middlewareStack.use(Xc(this.config, {
			httpAuthSchemeParametersProvider: Uu,
			identityProviderConfigProvider: async (e) => new rl({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(tl(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-lambda@3.1156.0/node_modules/@aws-sdk/client-lambda/dist-es/commandBuilder.js
ea();
var vx = Ct(Ju, "AWSGirApiService", "LambdaClient", $i), yx = {}, bx = (e, t, n, r) => [], xx = class extends vx(yx, bx, "AddPermission", nx) {}, Sx = class extends vx(yx, bx, "CreateEventSourceMapping", rx) {}, Cx = class extends vx(yx, bx, "CreateFunction", ix) {}, wx = class extends vx(yx, bx, "DeleteEventSourceMapping", ax) {}, Tx = class extends vx(yx, bx, "DeleteFunction", ox) {}, Ex = class extends vx(yx, bx, "GetEventSourceMapping", sx) {}, Dx = class extends vx(yx, bx, "GetFunction", cx) {}, Ox = class extends vx(yx, bx, "Invoke", lx) {}, kx = class extends vx(yx, bx, "ListEventSourceMappings", ux) {}, Ax = class extends vx(yx, bx, "ListFunctions", dx) {}, jx = {
	WHEN_SUPPORTED: "WHEN_SUPPORTED",
	WHEN_REQUIRED: "WHEN_REQUIRED"
}, Mx = jx.WHEN_SUPPORTED, Nx = jx.WHEN_SUPPORTED, Px;
(function(e) {
	e.MD5 = "MD5", e.CRC32 = "CRC32", e.CRC32C = "CRC32C", e.CRC64NVME = "CRC64NVME", e.SHA1 = "SHA1", e.SHA256 = "SHA256";
})(Px ||= {});
var Fx;
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/flexible-checksums/resolveFlexibleChecksumsConfig.js
(function(e) {
	e.HEADER = "header", e.TRAILER = "trailer";
})(Fx ||= {}), Px.CRC32, Te();
var Ix = (e) => {
	let { requestChecksumCalculation: t, responseChecksumValidation: n, requestStreamBufferSize: r } = e;
	return Object.assign(e, {
		requestChecksumCalculation: we(t ?? Mx),
		responseChecksumValidation: we(n ?? Nx),
		requestStreamBufferSize: Number(r ?? 0),
		checksumAlgorithms: e.checksumAlgorithms ?? {}
	});
}, Lx = (e) => (t, n) => async (r) => {
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
}, Rx = {
	tags: ["REGION_REDIRECT", "S3"],
	name: "regionRedirectEndpointMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-region-redirect/region-redirect-middleware.js
function zx(e) {
	return (t, n) => async (r) => {
		try {
			return await t(r);
		} catch (i) {
			if (e.followRegionRedirects) {
				let a = i?.$metadata?.httpStatusCode, o = n.commandName === "HeadBucketCommand", s = i?.$response?.headers?.["x-amz-bucket-region"];
				if (s && (a === 301 || a === 400 && (i?.name === "IllegalLocationConstraintException" || o))) {
					try {
						let t = s;
						n.logger?.debug(`Redirecting from ${await e.region()} to ${t}`), n.__s3RegionRedirect = t, Lc(n, "S3_REGION_REDIRECT", "Ah");
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
var Bx = {
	step: "initialize",
	tags: ["REGION_REDIRECT", "S3"],
	name: "regionRedirectMiddleware",
	override: !0
}, Vx = (e) => ({ applyToStack: (t) => {
	t.add(zx(e), Bx), t.addRelativeTo(Lx(e), Rx);
} }), Hx = class e {
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
}, Ux = class {
	_identity;
	isRefreshing;
	accessed;
	constructor(e, t = !1, n = Date.now()) {
		this._identity = e, this.isRefreshing = t, this.accessed = n;
	}
	get identity() {
		return this.accessed = Date.now(), this._identity;
	}
}, Wx = class e {
	createSessionFn;
	cache;
	static REFRESH_WINDOW_MS = 6e4;
	accessKeyId;
	cacheGeneration = 0;
	constructor(e, t = new Hx()) {
		this.createSessionFn = e, this.cache = t;
	}
	async getS3ExpressIdentity(t, n) {
		let r = n.Bucket, { cache: i } = this;
		t.accessKeyId !== this.accessKeyId && (this.accessKeyId = t.accessKeyId, this.cacheGeneration++, i.clear());
		let a = this.cacheGeneration, o = i.get(r);
		return o ? o.identity.then((t) => (t.expiration?.getTime() ?? 0) < Date.now() ? i.set(r, new Ux(this.getIdentity(r))).identity : ((t.expiration?.getTime() ?? 0) < Date.now() + e.REFRESH_WINDOW_MS && !o.isRefreshing && (o.isRefreshing = !0, this.getIdentity(r).then((e) => {
			a === this.cacheGeneration && i.set(r, new Ux(Promise.resolve(e)));
		})), t)) : i.set(r, new Ux(this.getIdentity(r))).identity;
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
}, Gx = (e, { session: t }) => {
	let [n, r] = t, { forcePathStyle: i, useAccelerateEndpoint: a, disableMultiregionAccessPoints: o, followRegionRedirects: s, s3ExpressIdentityProvider: c, bucketEndpoint: l, expectContinueHeader: u } = e;
	return Object.assign(e, {
		forcePathStyle: i ?? !1,
		useAccelerateEndpoint: a ?? !1,
		disableMultiregionAccessPoints: o ?? !1,
		followRegionRedirects: s ?? !1,
		s3ExpressIdentityProvider: c ?? new Wx(async (e) => n().send(new r({ Bucket: e }))),
		bucketEndpoint: l ?? !1,
		expectContinueHeader: u ?? 2097152
	});
}, Kx = { CrtSignerV4: null }, qx = "X-Amz-S3session-Token", Jx = qx.toLowerCase(), Yx = class extends Lu {
	async signWithCredentials(e, t, n) {
		let r = Xx(t);
		e.headers[Jx] = t.sessionToken;
		let i = this;
		return Zx(i, r), i.signRequest(e, n ?? {});
	}
	async presignWithCredentials(e, t, n) {
		let r = Xx(t);
		return delete e.headers[Jx], e.headers[qx] = t.sessionToken, e.query = e.query ?? {}, e.query[qx] = t.sessionToken, Zx(this, r), this.presign(e, n);
	}
};
function Xx(e) {
	return {
		accessKeyId: e.accessKeyId,
		secretAccessKey: e.secretAccessKey,
		expiration: e.expiration
	};
}
function Zx(e, t) {
	let n = e.credentialProvider;
	e.credentialProvider = () => (e.credentialProvider = n, Promise.resolve(t));
}
// ../../node_modules/.pnpm/@aws-sdk+signature-v4-multi-region@3.996.51/node_modules/@aws-sdk/signature-v4-multi-region/dist-es/SignatureV4MultiRegion.js
var Qx = class {
	sigv4aSigner;
	sigv4Signer;
	signerOptions;
	static sigv4aDependency() {
		return typeof Kx.CrtSignerV4 == "function" ? "crt" : typeof Ru.SignatureV4a == "function" ? "js" : "none";
	}
	constructor(e) {
		this.sigv4Signer = new Yx(e), this.signerOptions = e;
	}
	async sign(e, t = {}) {
		return t.signingRegion === "*" ? this.getSigv4aSigner().sign(e, t) : this.sigv4Signer.sign(e, t);
	}
	async signWithCredentials(e, t, n = {}) {
		if (n.signingRegion === "*") {
			let r = this.getSigv4aSigner(), i = Kx.CrtSignerV4;
			if (i && r instanceof i) return r.signWithCredentials(e, t, n);
			throw Error("signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the \"@aws-sdk/signature-v4-crt\" package explicitly. You must also register the package by calling [require(\"@aws-sdk/signature-v4-crt\");] or an ESM equivalent such as [import \"@aws-sdk/signature-v4-crt\";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
		}
		return this.sigv4Signer.signWithCredentials(e, t, n);
	}
	async presign(e, t = {}) {
		if (t.signingRegion === "*") {
			let n = this.getSigv4aSigner(), r = Kx.CrtSignerV4;
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
			let e = Kx.CrtSignerV4, t = Ru.SignatureV4a;
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
}, $x = "sigv4-s3express", eS = "x-amz-s3session-token";
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-s3-express/functions/s3ExpressMiddleware.js
ge();
var tS = (e) => (t, n) => async (r) => {
	if (n.endpointV2) {
		let t = n.endpointV2, i = t.properties?.authSchemes?.[0]?.name === $x;
		if ((t.properties?.backend === "S3Express" || t.properties?.bucketType === "Directory") && (Lc(n, "S3_EXPRESS_BUCKET", "J"), n.isS3ExpressBucket = !0), i) {
			let t = r.input.Bucket;
			if (t) {
				let i = await e.s3ExpressIdentityProvider.getS3ExpressIdentity(await e.credentials(), { Bucket: t });
				n.s3ExpressIdentity = i, he.isInstance(r.request) && i.sessionToken && (r.request.headers[eS] = i.sessionToken);
			}
		}
	}
	return t(r);
}, nS = {
	name: "s3ExpressMiddleware",
	step: "build",
	tags: ["S3", "S3_EXPRESS"],
	override: !0
}, rS = (e) => ({ applyToStack: (t) => {
	t.add(tS(e), nS);
} }), iS = async (e, t, n, r) => {
	let i = await r.signWithCredentials(n, e, {});
	if (i.headers["X-Amz-Security-Token"] || i.headers["x-amz-security-token"]) throw Error("X-Amz-Security-Token must not be set for s3-express requests.");
	return i;
};
fe(), ge();
var aS = (e) => (e) => {
	throw e;
}, oS = (e, t) => {}, sS = (e) => (t, n) => async (r) => {
	if (!he.isInstance(r.request)) return t(r);
	let i = de(n).selectedHttpAuthScheme;
	if (!i) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: a = {} }, identity: o, signer: s } = i, c;
	c = n.s3ExpressIdentity ? await iS(n.s3ExpressIdentity, a, r.request, await e.signer()) : await s.sign(r.request, o, a);
	let l = await t({
		...r,
		request: c
	}).catch((s.errorHandler || aS)(a));
	return (s.successHandler || oS)(l.response, a), l;
}, cS = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(sS(e), el);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/to-stream/toStream.browser.js
function lS(e) {
	return new ReadableStream({ start(t) {
		t.enqueue(e), t.close();
	} });
}
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-throw-200-exceptions/throw-200-exceptions.js
ve();
var uS = {
	CopyObjectCommand: !0,
	UploadPartCopyCommand: !0,
	CompleteMultipartUploadCommand: !0
}, dS = (e) => (t, n) => async (r) => {
	let i = await t(r), { response: a } = i;
	if (!_e.isInstance(a)) return i;
	let { statusCode: o, body: s } = a;
	if (o < 200 || o >= 300) return i;
	let c = await fS(s, e);
	if (a.body = lS(c), c.length === 0 && uS[n.commandName]) {
		let e = /* @__PURE__ */ Error("S3 aborted request");
		throw e.$metadata = { httpStatusCode: 503 }, e.name = "InternalError", e;
	}
	let l = e.utf8Encoder(c.subarray(c.length - 16));
	return l && l.endsWith("</Error>") && (a.statusCode = 503), i;
}, fS = (e = /* @__PURE__ */ new Uint8Array(), t) => e instanceof Uint8Array ? Promise.resolve(e) : t.streamCollector(e) || Promise.resolve(/* @__PURE__ */ new Uint8Array()), pS = {
	relation: "after",
	toMiddleware: "deserializerMiddleware",
	tags: ["THROW_200_EXCEPTIONS", "S3"],
	name: "throw200ExceptionsMiddleware",
	override: !0
}, mS = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(dS(e), pS);
} }), hS = (e) => typeof e == "string" && e.indexOf("arn:") === 0 && e.split(":").length >= 6;
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-region-redirect/bucket-endpoint-middleware.js
function gS(e) {
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
var _S = {
	name: "bucketEndpointMiddleware",
	override: !0,
	relation: "after",
	toMiddleware: "endpointV2Middleware"
};
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/middleware-validate-bucket-name/validate-bucket-name.js
function vS({ bucketEndpoint: e }) {
	return (t) => async (n) => {
		let { input: { Bucket: r } } = n;
		if (!e && typeof r == "string" && !hS(r) && r.indexOf("/") >= 0) {
			let e = /* @__PURE__ */ Error(`Bucket name shouldn't contain '/', received '${r}'`);
			throw e.name = "InvalidBucketName", e;
		}
		return t({ ...n });
	};
}
var yS = {
	step: "initialize",
	tags: ["VALIDATE_BUCKET_NAME"],
	name: "validateBucketNameMiddleware",
	override: !0
}, bS = (e) => ({ applyToStack: (t) => {
	t.add(vS(e), yS), t.addRelativeTo(gS(e), _S);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.972.85/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/submodules/s3/protocol/S3RestXmlProtocol.js
_();
var xS = class extends Cd {
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n), i = g.of(e.input), a = i.getSchema(), o = 0, s = a[6] ?? 0;
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
ge();
function SS(e) {
	return (t) => async (n) => {
		let { request: r } = n;
		if (e.expectContinueHeader !== !1 && he.isInstance(r) && r.body && e.runtime === "node" && e.requestHandler?.constructor?.name !== "FetchHttpHandler") {
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
var CS = {
	step: "build",
	tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
	name: "addExpectContinueMiddleware",
	override: !0
}, wS = (e) => ({ applyToStack: (t) => {
	t.add(SS(e), CS);
} });
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/bdd.js
ea();
var D = "ref", O = "argv", TS = "backend", ES = "authSchemes", DS = "disableDoubleEncoding", OS = "signingName", kS = "signingRegion", AS = "signingRegionSet", k = -1, A = !0, jS = !1, MS = "isSet", NS = "booleanEquals", j = "stringEquals", PS = "coalesce", FS = "substring", IS = "", LS = "aws.partition", RS = "partitionResult", zS = "accessPointSuffix", BS = "regionPrefix", VS = (e) => "outpostId_ssa_" + e + IS, HS = "hardwareType", US = "ite", WS = "isValidHostLabel", GS = "sigv4", KS = "aws.isVirtualHostableS3Bucket", qS = "url", JS = "getAttr", YS = "bucketArn", XS = "--", ZS = "arnType", QS = "accesspoint", $S = (e) => "accessPointName_ssa_" + e + IS, eC = "s3-object-lambda", tC = "s3-outposts", nC = "bucketPartition", rC = "us-east-1", iC = "outpostType", aC = "name", oC = "s3", sC = "{url#scheme}://{Bucket}.{url#authority}{url#path}", cC = "{url#scheme}://{url#authority}{url#path}", lC = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", uC = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", dC = "https://{Bucket}.s3.{partitionResult#dnsSuffix}", fC = (e) => "{url#scheme}://{accessPointName_ssa_" + e + "}-{bucketArn#accountId}.{url#authority}{url#path}", pC = (e) => "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName_ssa_" + e + "}`", mC = "sigv4a", hC = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", gC = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", _C = "https://s3.{partitionResult#dnsSuffix}", vC = { [D]: "UseFIPS" }, yC = { [D]: "UseDualStack" }, bC = { [D]: "Bucket" }, xC = {
	fn: JS,
	[O]: [{ [D]: RS }, aC]
}, SC = { [D]: qS }, CC = { [D]: "Region" }, wC = { [D]: YS }, TC = { [D]: ZS }, EC = { [D]: "accessPointName_ssa_1" }, DC = {
	fn: JS,
	[O]: [wC, "region"]
}, OC = { [D]: HS }, kC = {
	fn: JS,
	[O]: [wC, "service"]
}, AC = {
	fn: JS,
	[O]: [wC, "accountId"]
}, jC = {
	[TS]: "S3Express",
	[ES]: [{
		[DS]: !0,
		[aC]: "{_s3e_auth}",
		[OS]: "s3express",
		[kS]: "{Region}"
	}]
}, MC = {
	[TS]: "S3Express",
	[ES]: [{
		[DS]: !0,
		[aC]: GS,
		[OS]: "s3express",
		[kS]: "{Region}"
	}]
}, NC = { [ES]: [{
	[DS]: !0,
	[aC]: mC,
	[OS]: tC,
	[AS]: ["*"]
}, {
	[DS]: !0,
	[aC]: GS,
	[OS]: tC,
	[kS]: "{Region}"
}] }, PC = { [ES]: [{
	[DS]: !0,
	[aC]: GS,
	[OS]: oC,
	[kS]: rC
}] }, FC = { [ES]: [{
	[DS]: !0,
	[aC]: GS,
	[OS]: oC,
	[kS]: "{Region}"
}] }, IC = { [ES]: [{
	[DS]: !0,
	[aC]: GS,
	[OS]: eC,
	[kS]: "{bucketArn#region}"
}] }, LC = { [ES]: [{
	[DS]: !0,
	[aC]: GS,
	[OS]: oC,
	[kS]: "{bucketArn#region}"
}] }, RC = { [ES]: [{
	[DS]: !0,
	[aC]: mC,
	[OS]: tC,
	[AS]: ["*"]
}, {
	[DS]: !0,
	[aC]: GS,
	[OS]: tC,
	[kS]: "{bucketArn#region}"
}] }, zC = { [ES]: [{
	[DS]: !0,
	[aC]: GS,
	[OS]: eC,
	[kS]: "{Region}"
}] }, BC = [CC], VC = [{ [D]: "Endpoint" }], HC = [bC], UC = [
	bC,
	0,
	7,
	!0
], WC = [wC, "resourceId[1]"], GC = ["*"], KC = {
	conditions: [
		[MS, BC],
		[NS, [{ [D]: "Accelerate" }, A]],
		[NS, [vC, A]],
		[NS, [yC, A]],
		[MS, VC],
		[MS, HC],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					0,
					6,
					A
				]
			}, IS]
		}, "--x-s3"]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: UC
			}, IS]
		}, "--xa-s3"]],
		[
			LS,
			BC,
			RS
		],
		[
			FS,
			UC,
			zS
		],
		[j, [{ [D]: zS }, "--op-s3"]],
		[
			FS,
			[
				bC,
				8,
				12,
				A
			],
			BS
		],
		[
			FS,
			[
				bC,
				32,
				49,
				A
			],
			VS(2)
		],
		[
			FS,
			[
				bC,
				49,
				50,
				A
			],
			HS
		],
		[NS, [{ [D]: "ForcePathStyle" }, A]],
		[j, [xC, "aws-cn"]],
		[
			US,
			[
				yC,
				".dualstack",
				IS
			],
			"_s3e_ds"
		],
		[WS, [{ [D]: VS(2) }, jS]],
		[
			US,
			[
				vC,
				"-fips",
				IS
			],
			"_s3e_fips"
		],
		[
			US,
			[
				{
					fn: PS,
					[O]: [{ [D]: "DisableS3ExpressSessionAuth" }, jS]
				},
				GS,
				"sigv4-s3express"
			],
			"_s3e_auth"
		],
		[KS, [bC, jS]],
		[
			"parseURL",
			VC,
			qS
		],
		[NS, [{
			fn: PS,
			[O]: [{ [D]: "UseS3ExpressControlEndpoint" }, jS]
		}, A]],
		[KS, [bC, A]],
		[j, [{
			fn: JS,
			[O]: [SC, "scheme"]
		}, "http"]],
		[WS, [CC, jS]],
		[
			"aws.parseArn",
			HC,
			YS
		],
		[
			JS,
			[{
				fn: "split",
				[O]: [
					bC,
					XS,
					0
				]
			}, "[-2]"],
			"s3expressAvailabilityZoneId"
		],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					0,
					4,
					jS
				]
			}, IS]
		}, "arn:"]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					16,
					18,
					A
				]
			}, IS]
		}, XS]],
		[NS, [{
			fn: JS,
			[O]: [SC, "isIp"]
		}, A]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					21,
					23,
					A
				]
			}, IS]
		}, XS]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					27,
					29,
					A
				]
			}, IS]
		}, XS]],
		[j, [{ [D]: BS }, "beta"]],
		[
			"uriEncode",
			HC,
			"uri_encoded_bucket"
		],
		[WS, [CC, A]],
		[NS, [{
			fn: PS,
			[O]: [{ [D]: "UseObjectLambdaEndpoint" }, jS]
		}, A]],
		[
			JS,
			[wC, "resourceId[0]"],
			ZS
		],
		[j, [TC, IS]],
		[j, [TC, QS]],
		[
			JS,
			WC,
			$S(1)
		],
		[j, [EC, IS]],
		[j, [DC, IS]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					14,
					16,
					A
				]
			}, IS]
		}, XS]],
		[j, [OC, "e"]],
		[j, [OC, "o"]],
		[j, [CC, "aws-global"]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					19,
					21,
					A
				]
			}, IS]
		}, XS]],
		[j, [kC, eC]],
		[NS, [{
			fn: PS,
			[O]: [{ [D]: "DisableAccessPoints" }, jS]
		}, A]],
		[j, [kC, tC]],
		[
			LS,
			[DC],
			nC
		],
		[WS, [EC, A]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					26,
					28,
					A
				]
			}, IS]
		}, XS]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					15,
					17,
					A
				]
			}, IS]
		}, XS]],
		[JS, [wC, "resourceId[4]"]],
		[j, [{
			fn: PS,
			[O]: [{
				fn: FS,
				[O]: [
					bC,
					20,
					22,
					A
				]
			}, IS]
		}, XS]],
		[NS, [{ [D]: "UseGlobalEndpoint" }, A]],
		[j, [CC, rC]],
		[
			JS,
			WC,
			VS(1)
		],
		[NS, [{
			fn: PS,
			[O]: [{ [D]: "UseArnRegion" }, A]
		}, A]],
		[WS, [{ [D]: VS(1) }, jS]],
		[
			JS,
			[wC, "resourceId[2]"],
			iC
		],
		[j, [CC, DC]],
		[j, [{
			fn: JS,
			[O]: [{ [D]: nC }, aC]
		}, xC]],
		[NS, [{ [D]: "DisableMultiRegionAccessPoints" }, A]],
		[WS, [DC, A]],
		[j, [{
			fn: JS,
			[O]: [wC, "partition"]
		}, xC]],
		[j, [AC, IS]],
		[j, [kC, oC]],
		[WS, [AC, jS]],
		[
			JS,
			[wC, "resourceId[3]"],
			$S(2)
		],
		[WS, [EC, jS]],
		[j, [{ [D]: iC }, QS]],
		[WS, [{ [D]: $S(2) }, jS]]
	],
	results: [
		[k],
		[k, "Accelerate cannot be used with FIPS"],
		[k, "Cannot set dual-stack in combination with a custom endpoint."],
		[k, "A custom endpoint cannot be combined with FIPS"],
		[k, "A custom endpoint cannot be combined with S3 Accelerate"],
		[k, "Partition does not support FIPS"],
		[k, "S3Express does not support S3 Accelerate."],
		["{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", jC],
		[sC, jC],
		[k, "S3Express bucket name is not a valid virtual hostable name."],
		["https://s3express-control{_s3e_fips}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", MC],
		["https://{Bucket}.s3express{_s3e_fips}-{s3expressAvailabilityZoneId}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}", jC],
		[k, "Unrecognized S3Express bucket name format."],
		[cC, jC],
		["https://s3express-control{_s3e_fips}{_s3e_ds}.{Region}.{partitionResult#dnsSuffix}", MC],
		[k, "Expected a endpoint to be specified but no endpoint was found"],
		["https://{Bucket}.ec2.{url#authority}", NC],
		["https://{Bucket}.ec2.s3-outposts.{Region}.{partitionResult#dnsSuffix}", NC],
		["https://{Bucket}.op-{outpostId_ssa_2}.{url#authority}", NC],
		["https://{Bucket}.op-{outpostId_ssa_2}.s3-outposts.{Region}.{partitionResult#dnsSuffix}", NC],
		[k, "Unrecognized hardware type: \"Expected hardware type o or e but got {hardwareType}\""],
		[k, "Invalid Outposts Bucket alias - it must be a valid bucket name."],
		[k, "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`."],
		[k, "Custom endpoint `{Endpoint}` was not a valid URI"],
		[k, "S3 Accelerate cannot be used in this region"],
		["https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", FC],
		["https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", FC],
		["https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", FC],
		["https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", FC],
		[lC, PC],
		[sC, PC],
		[lC, FC],
		[sC, FC],
		[uC, PC],
		[uC, FC],
		[dC, PC],
		[dC, FC],
		["https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", FC],
		[k, "Invalid region: region was not a valid DNS name."],
		[k, "S3 Object Lambda does not support Dual-stack"],
		[k, "S3 Object Lambda does not support S3 Accelerate"],
		[k, "Access points are not supported for this operation"],
		[k, "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`"],
		[k, "Invalid ARN: Missing account id"],
		[fC(1), IC],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", IC],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", IC],
		[k, pC(1)],
		[k, "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`"],
		[k, "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)"],
		[k, "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`"],
		[k, "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`."],
		[k, "Invalid ARN: bucket ARN is missing a region"],
		[k, "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided"],
		[k, "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`"],
		[k, "Access Points do not support S3 Accelerate"],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", LC],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", LC],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", LC],
		[fC(1), LC],
		["https://{accessPointName_ssa_1}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", LC],
		[k, "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}"],
		[k, "S3 MRAP does not support dual-stack"],
		[k, "S3 MRAP does not support FIPS"],
		[k, "S3 MRAP does not support S3 Accelerate"],
		[k, "Invalid configuration: Multi-Region Access Point ARNs are disabled."],
		["https://{accessPointName_ssa_1}.accesspoint.s3-global.{partitionResult#dnsSuffix}", { [ES]: [{
			[DS]: A,
			name: mC,
			[OS]: oC,
			[AS]: GC
		}] }],
		[k, "Client was configured for partition `{partitionResult#name}` but bucket referred to partition `{bucketArn#partition}`"],
		[k, "Invalid Access Point Name"],
		[k, "S3 Outposts does not support Dual-stack"],
		[k, "S3 Outposts does not support FIPS"],
		[k, "S3 Outposts does not support S3 Accelerate"],
		[k, "Invalid Arn: Outpost Access Point ARN contains sub resources"],
		["https://{accessPointName_ssa_2}-{bucketArn#accountId}.{outpostId_ssa_1}.{url#authority}", RC],
		["https://{accessPointName_ssa_2}-{bucketArn#accountId}.{outpostId_ssa_1}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", RC],
		[k, pC(2)],
		[k, "Expected an outpost type `accesspoint`, found {outpostType}"],
		[k, "Invalid ARN: expected an access point name"],
		[k, "Invalid ARN: Expected a 4-component resource"],
		[k, "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId_ssa_1}`"],
		[k, "Invalid ARN: The Outpost Id was not set"],
		[k, "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})"],
		[k, "Invalid ARN: No ARN type specified"],
		[k, "Invalid ARN: `{Bucket}` was not a valid ARN"],
		[k, "Path-style addressing cannot be used with ARN buckets"],
		["https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", PC],
		["https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", FC],
		["https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", PC],
		["https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", FC],
		["https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", PC],
		["https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", FC],
		[hC, PC],
		[hC, FC],
		[gC, PC],
		[gC, FC],
		["https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", FC],
		[k, "Path-style addressing cannot be used with S3 Accelerate"],
		[cC, zC],
		["https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", zC],
		["https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", zC],
		["https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", FC],
		["https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://s3-fips.{Region}.{partitionResult#dnsSuffix}", FC],
		["https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", PC],
		["https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", FC],
		[cC, PC],
		[cC, FC],
		[_C, PC],
		[_C, FC],
		["https://s3.{Region}.{partitionResult#dnsSuffix}", FC],
		[k, "A region must be set when sending requests to S3."]
	]
}, qC = 2, JC = new Int32Array([
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
]), YC = zr.from(JC, qC, KC.conditions, KC.results);
// ../../node_modules/.pnpm/@aws-sdk+client-s3@3.1156.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/endpointResolver.js
ea();
var XC = new Vr({
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
}), ZC = (e, t = {}) => XC.get(e, () => Xi(YC, {
	endpointParams: e,
	logger: t.logger
}));
Zr.aws = jl, fe(), Te(), ea();
var QC = ((e) => async (t, n, r) => {
	if (!r) throw Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
	let i = await e(t, n, r), a = de(n)?.commandInstance?.constructor?.getEndpointParameterInstructions;
	if (!a) throw Error(`getEndpointParameterInstructions() is not defined on '${n.commandName}'`);
	let o = await Or(r, { getEndpointParameterInstructions: a }, t);
	return Object.assign(i, o);
})(async (e, t, n) => ({
	operation: de(t).operation,
	region: await we(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
}));
function $C(e) {
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
function ew(e) {
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
var tw = ((e, t, n) => (r) => {
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
			if (Qx.sigv4aDependency() === "none" && e) continue;
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
})(ZC, (e) => {
	let t = [];
	return e.operation, t.push($C(e)), t.push(ew(e)), t;
}, {
	"aws.auth#sigv4": $C,
	"aws.auth#sigv4a": ew
}), nw = (e) => {
	let t = Ql(Hu(e));
	return Object.assign(t, { authSchemePreference: we(e.authSchemePreference ?? []) });
}, rw = (e) => Object.assign(e, {
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	forcePathStyle: e.forcePathStyle ?? !1,
	useAccelerateEndpoint: e.useAccelerateEndpoint ?? !1,
	useGlobalEndpoint: e.useGlobalEndpoint ?? !1,
	disableMultiregionAccessPoints: e.disableMultiregionAccessPoints ?? !1,
	defaultSigningName: "s3",
	clientContextParams: e.clientContextParams ?? {}
}), iw = {
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
ea();
var aw = Ct(iw, "AmazonS3", "S3Client", $i), ow = {
	UseS3ExpressControlEndpoint: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	}
}, sw = {
	DisableS3ExpressSessionAuth: {
		type: "staticContextParams",
		value: !0
	},
	Bucket: {
		type: "contextParams",
		name: "Bucket"
	}
}, cw = {}, lw = (e, t, n, r) => [mS(n)], uw = (e, t, n, r) => [], dw = class e extends dt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.s3#S3ServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, fw = class e extends dw {
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
}, pw = class e extends dw {
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
}, mw = class e extends dw {
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
}, hw = class e extends dw {
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
}, gw = class e extends dw {
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
}, _w = class e extends dw {
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
}, vw = class e extends dw {
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
}, yw = class e extends dw {
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
}, bw = class e extends dw {
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
}, xw = class e extends dw {
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
}, Sw = class e extends dw {
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
}, Cw = class e extends dw {
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
}, ww = class e extends dw {
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
}, Tw = class e extends dw {
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
}, Ew = class e extends dw {
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
}, Dw = class e extends dw {
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
}, Ow = class e extends dw {
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
}, kw = class e extends dw {
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
}, Aw = class e extends dw {
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
}, jw = class e extends dw {
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
}, Mw = class e extends dw {
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
_();
var Nw = "AccessDenied", Pw = "AccessKeyId", Fw = "AnnotationLimitExceeded", Iw = "AnnotationNameTooLong", Lw = "AccessTier", Rw = "Bucket", zw = "BucketArn", Bw = "BucketAlreadyExists", Vw = "BucketAlreadyOwnedByYou", Hw = "BucketKeyEnabled", Uw = "BucketRegion", Ww = "Buckets", Gw = "CreationDate", Kw = "CloudFunction", qw = "CloudFunctionConfiguration", Jw = "CreateSessionOutput", Yw = "CreateSessionResult", Xw = "CreateSessionRequest", Zw = "CreateSession", Qw = "ContinuationToken", $w = "Credentials", eT = "DisplayName", tT = "EventBridgeConfiguration", nT = "ExpectedBucketOwner", rT = "EncryptionTypeMismatch", iT = "Events", aT = "Event", oT = "Expiration", sT = "Filter", cT = "FilterRule", lT = "FilterRuleList", uT = "FilterRules", dT = "GetBucketNotificationConfiguration", fT = "GetBucketNotificationConfigurationRequest", pT = "Id", mT = "InvalidAnnotationName", hT = "ID", gT = "InvalidObjectState", _T = "InvalidPrefix", vT = "IdempotencyParameterMismatch", yT = "InvalidRequest", bT = "InvalidWriteOffset", xT = "Key", ST = "ListAllMyBucketsResult", CT = "ListBuckets", wT = "ListBucketsOutput", TT = "ListBucketsRequest", ET = "LambdaFunctionArn", DT = "LambdaFunctionConfiguration", OT = "LambdaFunctionConfigurationList", kT = "LambdaFunctionConfigurations", AT = "MaxBuckets", jT = "Name", MT = "NotificationConfiguration", NT = "NotificationConfigurationFilter", PT = "NotFound", FT = "NoSuchAnnotation", IT = "NoSuchBucket", LT = "NoSuchKey", RT = "NoSuchUpload", zT = "Owner", BT = "ObjectAlreadyInActiveTierError", VT = "ObjectNotInActiveTierError", HT = "Prefix", UT = "PutBucketNotificationConfiguration", WT = "PutBucketNotificationConfigurationRequest", GT = "QueueArn", KT = "QueueConfigurationList", qT = "QueueConfigurations", JT = "QueueConfiguration", YT = "Queue", XT = "SecretAccessKey", ZT = "StorageClass", QT = "SessionCredentialValue", $T = "SessionCredentials", eE = "SkipDestinationValidation", tE = "S3KeyFilter", nE = "S3Key", rE = "SessionMode", iE = "ServerSideEncryption", aE = "SSEKMSEncryptionContext", oE = "SSEKMSKeyId", sE = "SessionToken", cE = "TopicArn", lE = "TopicConfigurationList", uE = "TopicConfigurations", dE = "TopicConfiguration", fE = "TooManyParts", pE = "Topic", mE = "UnsupportedMediaType", hE = "Value", gE = "bucket-region", _E = "client", vE = "continuation-token", yE = "error", bE = "http", xE = "httpError", SE = "httpHeader", CE = "httpPayload", wE = "httpQuery", TE = "max-buckets", EE = "prefix", DE = "smithy.ts.sdk.synthetic.com.amazonaws.s3", OE = "xmlFlattened", kE = "xmlName", AE = "x-amz-create-session-mode", jE = "x-amz-expected-bucket-owner", ME = "x-amz-skip-destination-validation", NE = "x-amz-server-side-encryption", PE = "x-amz-server-side-encryption-aws-kms-key-id", FE = "x-amz-server-side-encryption-bucket-key-enabled", IE = "x-amz-server-side-encryption-context", M = "com.amazonaws.s3", LE = new it(DE), RE = [
	-3,
	DE,
	"S3ServiceException",
	0,
	[],
	[]
];
LE.registerError(RE, dw);
var zE = new it(M), BE = [
	-3,
	M,
	Nw,
	{
		[yE]: _E,
		[xE]: 403
	},
	[],
	[]
];
zE.registerError(BE, pw);
var VE = [
	-3,
	M,
	Fw,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(VE, Dw);
var HE = [
	-3,
	M,
	Iw,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(HE, Ow);
var UE = [
	-3,
	M,
	Bw,
	{
		[yE]: _E,
		[xE]: 409
	},
	[],
	[]
];
zE.registerError(UE, hw);
var WE = [
	-3,
	M,
	Vw,
	{
		[yE]: _E,
		[xE]: 409
	},
	[],
	[]
];
zE.registerError(WE, gw);
var GE = [
	-3,
	M,
	rT,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(GE, Cw);
var KE = [
	-3,
	M,
	vT,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(KE, jw);
var qE = [
	-3,
	M,
	mT,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(qE, kw);
var JE = [
	-3,
	M,
	gT,
	{
		[yE]: _E,
		[xE]: 403
	},
	[ZT, Lw],
	[0, 0]
];
zE.registerError(JE, yw);
var YE = [
	-3,
	M,
	_T,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(YE, Sw);
var XE = [
	-3,
	M,
	yT,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(XE, ww);
var ZE = [
	-3,
	M,
	bT,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(ZE, Tw);
var QE = [
	-3,
	M,
	FT,
	{
		[yE]: _E,
		[xE]: 404
	},
	[],
	[]
];
zE.registerError(QE, bw);
var $E = [
	-3,
	M,
	IT,
	{
		[yE]: _E,
		[xE]: 404
	},
	[],
	[]
];
zE.registerError($E, _w);
var eD = [
	-3,
	M,
	LT,
	{
		[yE]: _E,
		[xE]: 404
	},
	[],
	[]
];
zE.registerError(eD, vw);
var tD = [
	-3,
	M,
	RT,
	{
		[yE]: _E,
		[xE]: 404
	},
	[],
	[]
];
zE.registerError(tD, fw);
var nD = [
	-3,
	M,
	PT,
	{ [yE]: _E },
	[],
	[]
];
zE.registerError(nD, xw);
var rD = [
	-3,
	M,
	BT,
	{
		[yE]: _E,
		[xE]: 403
	},
	[],
	[]
];
zE.registerError(rD, Mw);
var iD = [
	-3,
	M,
	VT,
	{
		[yE]: _E,
		[xE]: 403
	},
	[],
	[]
];
zE.registerError(iD, mw);
var aD = [
	-3,
	M,
	fE,
	{
		[yE]: _E,
		[xE]: 400
	},
	[],
	[]
];
zE.registerError(aD, Ew);
var oD = [
	-3,
	M,
	mE,
	{
		[yE]: _E,
		[xE]: 415
	},
	[],
	[]
];
zE.registerError(oD, Aw);
var sD = [LE, zE], cD = [
	0,
	M,
	QT,
	8,
	0
], lD = [
	0,
	M,
	aE,
	8,
	0
], uD = [
	0,
	M,
	oE,
	8,
	0
], dD = [
	3,
	M,
	Rw,
	0,
	[
		jT,
		Gw,
		Uw,
		zw
	],
	[
		0,
		4,
		0,
		0
	]
], fD = [
	3,
	M,
	Jw,
	{ [kE]: Yw },
	[
		$w,
		iE,
		oE,
		aE,
		Hw
	],
	[
		[() => ED, { [kE]: $w }],
		[0, { [SE]: NE }],
		[() => uD, { [SE]: PE }],
		[() => lD, { [SE]: IE }],
		[2, { [SE]: FE }]
	],
	1
], pD = [
	3,
	M,
	Xw,
	0,
	[
		Rw,
		rE,
		iE,
		oE,
		aE,
		Hw
	],
	[
		[0, 1],
		[0, { [SE]: AE }],
		[0, { [SE]: NE }],
		[() => uD, { [SE]: PE }],
		[() => lD, { [SE]: IE }],
		[2, { [SE]: FE }]
	],
	1
], mD = [
	3,
	M,
	tT,
	0,
	[],
	[]
], hD = [
	3,
	M,
	cT,
	0,
	[jT, hE],
	[0, 0]
], gD = [
	3,
	M,
	fT,
	0,
	[Rw, nT],
	[[0, 1], [0, { [SE]: jE }]],
	1
], _D = [
	3,
	M,
	DT,
	0,
	[
		ET,
		iT,
		pT,
		sT
	],
	[
		[0, { [kE]: Kw }],
		[64, {
			[OE]: 1,
			[kE]: aT
		}],
		0,
		[() => xD, 0]
	],
	2
], vD = [
	3,
	M,
	wT,
	{ [kE]: ST },
	[
		Ww,
		zT,
		Qw,
		HT
	],
	[
		[() => kD, 0],
		() => SD,
		0,
		0
	]
], yD = [
	3,
	M,
	TT,
	0,
	[
		AT,
		Qw,
		HT,
		Uw
	],
	[
		[1, { [wE]: TE }],
		[0, { [wE]: vE }],
		[0, { [wE]: EE }],
		[0, { [wE]: gE }]
	]
], bD = [
	3,
	M,
	MT,
	0,
	[
		uE,
		qT,
		kT,
		tT
	],
	[
		[() => ND, {
			[OE]: 1,
			[kE]: dE
		}],
		[() => MD, {
			[OE]: 1,
			[kE]: JT
		}],
		[() => jD, {
			[OE]: 1,
			[kE]: qw
		}],
		() => mD
	]
], xD = [
	3,
	M,
	NT,
	0,
	[xT],
	[[() => TD, { [kE]: nE }]]
], SD = [
	3,
	M,
	zT,
	0,
	[eT, hT],
	[0, 0]
], CD = [
	3,
	M,
	WT,
	0,
	[
		Rw,
		MT,
		nT,
		eE
	],
	[
		[0, 1],
		[() => bD, {
			[CE]: 1,
			[kE]: MT
		}],
		[0, { [SE]: jE }],
		[2, { [SE]: ME }]
	],
	2
], wD = [
	3,
	M,
	JT,
	0,
	[
		GT,
		iT,
		pT,
		sT
	],
	[
		[0, { [kE]: YT }],
		[64, {
			[OE]: 1,
			[kE]: aT
		}],
		0,
		[() => xD, 0]
	],
	2
], TD = [
	3,
	M,
	tE,
	0,
	[uT],
	[[() => AD, {
		[OE]: 1,
		[kE]: cT
	}]]
], ED = [
	3,
	M,
	$T,
	0,
	[
		Pw,
		XT,
		sE,
		oT
	],
	[
		[0, { [kE]: Pw }],
		[() => cD, { [kE]: XT }],
		[() => cD, { [kE]: sE }],
		[4, { [kE]: oT }]
	],
	4
], DD = [
	3,
	M,
	dE,
	0,
	[
		cE,
		iT,
		pT,
		sT
	],
	[
		[0, { [kE]: pE }],
		[64, {
			[OE]: 1,
			[kE]: aT
		}],
		0,
		[() => xD, 0]
	],
	2
], OD = "unit", kD = [
	1,
	M,
	Ww,
	0,
	[() => dD, { [kE]: Rw }]
], AD = [
	1,
	M,
	lT,
	0,
	() => hD
], jD = [
	1,
	M,
	OT,
	0,
	[() => _D, 0]
], MD = [
	1,
	M,
	KT,
	0,
	[() => wD, 0]
], ND = [
	1,
	M,
	lE,
	0,
	[() => DD, 0]
], PD = [
	9,
	M,
	Zw,
	{ [bE]: [
		"GET",
		"/?session",
		200
	] },
	() => pD,
	() => fD
], FD = [
	9,
	M,
	dT,
	{ [bE]: [
		"GET",
		"/?notification",
		200
	] },
	() => gD,
	() => bD
], ID = [
	9,
	M,
	CT,
	{ [bE]: [
		"GET",
		"/?x-id=ListBuckets",
		200
	] },
	() => yD,
	() => vD
], LD = [
	9,
	M,
	UT,
	{ [bE]: [
		"PUT",
		"/?notification",
		200
	] },
	() => CD,
	() => OD
], RD = class extends aw(sw, lw, "CreateSession", PD) {}, zD = {
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
// ../../node_modules/.pnpm/@aws-sdk+checksums@3.1002.1/node_modules/@aws-sdk/checksums/dist-es/submodules/sha/sha1/Sha1Js.js
v();
var BD = 64, VD = 20, HD = new Int32Array([
	1732584193,
	4023233417,
	2562383102,
	271733878,
	3285377520
]), UD = new Int32Array([
	1518500249,
	1859775393,
	2400959708,
	3395469782
]), WD = class e {
	digestLength = VD;
	state = Int32Array.from(HD);
	w;
	buffer = new Uint8Array(BD);
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
			for (let e = 0; e < BD; ++e) r[e] = 54 ^ n[e], r[e + BD] = 92 ^ n[e];
			this.inner.update(r.subarray(0, BD)), this.outer.update(r.subarray(BD));
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
			for (; n > 0 && this.bufferLength < BD;) this.buffer[this.bufferLength++] = e[t++], --n;
			this.bufferLength === BD && (this.hashBuffer(this.buffer, 0), this.bufferLength = 0);
		}
		for (; n >= BD;) this.hashBuffer(e, t), t += BD, n -= BD;
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
		this.state = Int32Array.from(HD), this.buffer = new Uint8Array(BD), this.bufferLength = 0, this.bytesHashed = 0;
	}
	digestSync() {
		let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed / 536870912 | 0, i = this.bytesHashed << 3;
		if (t[n++] = 128, n > 56) {
			for (let e = n; e < BD; ++e) t[e] = 0;
			this.hashBufferWith(e, t, 0), n = 0;
		}
		for (let e = n; e < 56; ++e) t[e] = 0;
		let a = new DataView(t.buffer, t.byteOffset, BD);
		a.setUint32(56, r, !1), a.setUint32(60, i, !1), this.hashBufferWith(e, t, 0);
		let o = new Uint8Array(VD);
		return o[0] = e[0] >>> 24 & 255, o[1] = e[0] >>> 16 & 255, o[2] = e[0] >>> 8 & 255, o[3] = e[0] & 255, o[4] = e[1] >>> 24 & 255, o[5] = e[1] >>> 16 & 255, o[6] = e[1] >>> 8 & 255, o[7] = e[1] & 255, o[8] = e[2] >>> 24 & 255, o[9] = e[2] >>> 16 & 255, o[10] = e[2] >>> 8 & 255, o[11] = e[2] & 255, o[12] = e[3] >>> 24 & 255, o[13] = e[3] >>> 16 & 255, o[14] = e[3] >>> 8 & 255, o[15] = e[3] & 255, o[16] = e[4] >>> 24 & 255, o[17] = e[4] >>> 16 & 255, o[18] = e[4] >>> 8 & 255, o[19] = e[4] & 255, o;
	}
	static normalizeKey(t) {
		let n = cr(t);
		if (n.byteLength > BD) {
			let t = new e();
			t.update(n);
			let r = t.digestSync(), i = new Uint8Array(BD);
			return i.set(r), i;
		}
		let r = new Uint8Array(BD);
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
			let t = e < 20 ? 0 : e < 40 ? 1 : e < 60 ? 2 : 3, n = ((i << 5 | i >>> 27) + (t === 0 ? a & o ^ ~a & s : t === 2 ? a & o ^ a & s ^ o & s : a ^ o ^ s) | 0) + (c + (UD[t] + r[e] | 0) | 0) | 0;
			c = s, s = o, o = a << 30 | a >>> 2, a = i, i = n;
		}
		e[0] = e[0] + i | 0, e[1] = e[1] + a | 0, e[2] = e[2] + o | 0, e[3] = e[3] + s | 0, e[4] = e[4] + c | 0;
	}
};
Qa(), ke(), v();
var GD = (e) => ({
	apiVersion: "2006-03-01",
	base64Decoder: e?.base64Decoder ?? Ot,
	base64Encoder: e?.base64Encoder ?? Mt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? ZC,
	extensions: e?.extensions ?? [],
	getAwsChunkedEncodingStream: e?.getAwsChunkedEncodingStream ?? ia,
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? tw,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Xl()
	}, {
		schemeId: "aws.auth#sigv4a",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4a"),
		signer: new Zl()
	}],
	logger: e?.logger ?? new St(),
	md5: e?.md5 ?? Oa,
	protocol: e?.protocol ?? xS,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.s3",
		errorTypeRegistries: sD,
		xmlNamespace: "http://s3.amazonaws.com/doc/2006-03-01/",
		version: "2006-03-01",
		serviceTarget: "AmazonS3"
	},
	sdkStreamMixin: e?.sdkStreamMixin ?? da,
	serviceId: e?.serviceId ?? "S3",
	sha1: e?.sha1 ?? WD,
	sha256: e?.sha256 ?? Xa,
	signerConstructor: e?.signerConstructor ?? Qx,
	signingEscapePath: e?.signingEscapePath ?? !1,
	urlParser: e?.urlParser ?? Oe,
	useArnRegion: e?.useArnRegion ?? void 0,
	utf8Decoder: e?.utf8Decoder ?? At,
	utf8Encoder: e?.utf8Encoder ?? It
});
Qa(), $o(), v(), la();
var KD = (e) => {
	let t = zl(e), n = () => t().then(pt), r = GD(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? or,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Tl({
			serviceId: r.serviceId,
			clientVersion: zD.version
		}),
		eventStreamSerdeProvider: e?.eventStreamSerdeProvider ?? Ko,
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? Ne("Region is missing"),
		requestHandler: $u.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || jc),
		streamCollector: e?.streamCollector ?? ca,
		streamHasher: e?.streamHasher ?? Ta,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, qD = (e) => {
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
}, JD = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), YD = (e, t) => {
	let n = Object.assign(Vl(e), yt(e), cs(e), qD(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Hl(n), bt(n), ls(n), JD(n));
};
ea(), $o(), _();
var XD = class extends Pe {
	config;
	constructor(...[e]) {
		let t = KD(e || {});
		super(t), this.initConfig = t;
		let n = Rc(Ll(Fc(Ix(cl(rw(t)))))), r = Qi(n), i = YD(Gx(nw(Jo(r)), { session: [() => this, RD] }), e?.extensions || []);
		this.config = i, this.middlewareStack.use(We(this.config)), this.middlewareStack.use(wl(this.config)), this.middlewareStack.use(Ic(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(Vc(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Gc(this.config)), this.middlewareStack.use(Xc(this.config, {
			httpAuthSchemeParametersProvider: QC,
			identityProviderConfigProvider: async (e) => new rl({
				"aws.auth#sigv4": e.credentials,
				"aws.auth#sigv4a": e.credentials
			})
		})), this.middlewareStack.use(tl(this.config)), this.middlewareStack.use(bS(this.config)), this.middlewareStack.use(wS(this.config)), this.middlewareStack.use(Vx(this.config)), this.middlewareStack.use(rS(this.config)), this.middlewareStack.use(cS(this.config));
	}
	destroy() {
		super.destroy();
	}
}, ZD = class extends aw(ow, lw, "GetBucketNotificationConfiguration", FD) {}, QD = class extends aw(cw, lw, "ListBuckets", ID) {}, $D = class extends aw(ow, uw, "PutBucketNotificationConfiguration", LD) {}, eO = [
	"disabled",
	"preferred",
	"required"
];
function tO(e) {
	return eO.includes(e);
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/account-id-endpoint/AccountIdEndpointModeConfigResolver.js
Te();
var nO = (e) => {
	let { accountIdEndpointMode: t } = e, n = we(t ?? "preferred");
	return Object.assign(e, { accountIdEndpointMode: async () => {
		let e = await n();
		if (!tO(e)) throw Error(`Invalid value for accountIdEndpointMode: ${e}. Valid values are: "required", "preferred", "disabled".`);
		return e;
	} });
}, rO = /* @__PURE__ */ s(((e, t) => {
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
})), iO = /* @__PURE__ */ s(((e, t) => {
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
})), aO = /* @__PURE__ */ s(((e) => {
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
})), oO = /* @__PURE__ */ s(((e) => {
	var t = iO(), n = aO();
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
})), sO = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	var n = rO(), r = iO(), i = aO(), a = oO();
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
})))()), cO = class {
	cache;
	constructor(e) {
		this.cache = new sO.default(e);
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
}, lO = (e, { endpointDiscoveryCommandCtor: t }) => {
	let { endpointCacheSize: n, endpointDiscoveryEnabled: r, endpointDiscoveryEnabledProvider: i } = e;
	return Object.assign(e, {
		endpointDiscoveryCommandCtor: t,
		endpointCache: new cO(n ?? 1e3),
		endpointDiscoveryEnabled: r === void 0 ? i : () => Promise.resolve(r),
		isClientEndpointDiscoveryEnabled: r !== void 0
	});
};
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/auth/httpAuthSchemeProvider.js
fe(), Te();
var uO = async (e, t, n) => ({
	operation: de(t).operation,
	region: await we(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function dO(e) {
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
var fO = (e) => {
	let t = [];
	return e.operation, t.push(dO(e)), t;
}, pO = (e) => {
	let t = Hu(e);
	return Object.assign(t, { authSchemePreference: we(e.authSchemePreference ?? []) });
}, mO = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "dynamodb"
}), hO = {
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
ea();
var gO = Ct(hO, "DynamoDB_20120810", "DynamoDBClient", $i), _O = {}, vO = { ResourceArn: {
	type: "contextParams",
	name: "TableName"
} }, yO = (e, t, n, r) => [], N = class e extends dt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.dynamodb#DynamoDBServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, bO = class e extends N {
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
}, xO = class e extends N {
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
}, SO = class e extends N {
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
}, CO = class e extends N {
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
}, wO = class e extends N {
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
}, TO = class e extends N {
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
}, EO = class e extends N {
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
}, DO = class e extends N {
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
}, OO = class e extends N {
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
}, kO = class e extends N {
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
}, AO = class e extends N {
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
}, jO = class e extends N {
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
}, MO = class e extends N {
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
}, NO = class e extends N {
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
}, PO = class e extends N {
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
}, FO = class e extends N {
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
}, IO = class e extends N {
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
}, LO = class e extends N {
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
}, RO = class e extends N {
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
}, zO = class e extends N {
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
}, BO = class e extends N {
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
}, VO = class e extends N {
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
}, HO = class e extends N {
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
}, UO = class e extends N {
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
}, WO = class e extends N {
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
}, GO = class e extends N {
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
}, KO = class e extends N {
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
}, qO = class e extends N {
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
}, JO = class e extends N {
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
}, YO = class e extends N {
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
}, XO = class e extends N {
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
}, ZO = class e extends N {
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
}, QO = class e extends N {
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
}, $O = class e extends N {
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
}, ek = class e extends N {
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
_();
var tk = "ArchivalBackupArn", nk = "AttributeDefinition", rk = "ArchivalDateTime", ik = "AttributeDefinitions", ak = "AttributeMap", ok = "AttributeName", sk = "ArchivalReason", ck = "ArchivalSummary", lk = "AttributeType", uk = "AttributeValue", dk = "Address", fk = "Backfilling", pk = "BackupInUseException", mk = "BillingMode", hk = "BillingModeSummary", gk = "BackupNotFoundException", _k = "BOOL", vk = "BS", yk = "B", bk = "Code", xk = "ContinuousBackupsUnavailableException", Sk = "ConditionalCheckFailedException", Ck = "CreationDateTime", wk = "CreateGlobalSecondaryIndexAction", Tk = "CreateGlobalTableWitnessGroupMemberAction", Ek = "CachePeriodInMinutes", Dk = "CancellationReasons", Ok = "CreateReplicationGroupMemberAction", kk = "CancellationReasonList", Ak = "CancellationReason", jk = "CreateVectorIndexAction", Mk = "Create", Nk = "Dimensions", Pk = "DescribeEndpoints", Fk = "DescribeEndpointsRequest", Ik = "DescribeEndpointsResponse", Lk = "DistanceFunction", Rk = "DeleteGlobalSecondaryIndexAction", zk = "DeleteGlobalTableWitnessGroupMemberAction", Bk = "DuplicateItemException", Vk = "DisassociationMode", Hk = "DeletionProtectionEnabled", Uk = "DisassociationProtectionEnabled", Wk = "DeleteReplicationGroupMemberAction", Gk = "DisassociateReplicationGroupMemberAction", Kk = "DescribeTableInput", qk = "DescribeTableOutput", Jk = "DescribeTable", Yk = "DeleteVectorIndexAction", Xk = "Delete", Zk = "Disassociate", Qk = "ExportConflictException", $k = "ExportNotFoundException", eA = "Endpoints", tA = "Enabled", nA = "Endpoint", rA = "GlobalSecondaryIndexes", iA = "GlobalSecondaryIndexDescription", aA = "GlobalSecondaryIndexDescriptionList", oA = "GlobalSecondaryIndexUpdate", sA = "GlobalSecondaryIndexUpdateList", cA = "GlobalSecondaryIndexUpdates", lA = "GlobalSecondaryIndexWarmThroughputDescription", uA = "GlobalTableAlreadyExistsException", dA = "GlobalTableNotFoundException", fA = "GlobalTableSettingsReplicationMode", pA = "GlobalTableVersion", mA = "GlobalTableWitnesses", hA = "GlobalTableWitnessDescription", gA = "GlobalTableWitnessDescriptionList", _A = "GlobalTableWitnessGroupUpdate", vA = "GlobalTableWitnessGroupUpdateList", yA = "GlobalTableWitnessUpdates", bA = "Item", xA = "IndexArn", SA = "ItemCount", CA = "ImportConflictException", wA = "ItemCollectionSizeLimitExceededException", TA = "InaccessibleEncryptionDateTime", EA = "InvalidEndpointException", DA = "InvalidExportTimeException", OA = "IndexName", kA = "ImportNotFoundException", AA = "IndexNotFoundException", jA = "IdempotentParameterMismatchException", MA = "InvalidRestoreTimeException", NA = "IndexStatus", PA = "IndexSizeBytes", FA = "InternalServerError", IA = "KMSMasterKeyArn", LA = "KMSMasterKeyId", RA = "KeySchema", zA = "KeySchemaElement", BA = "KeyType", VA = "ListAttributeValue", HA = "LastDecreaseDateTime", UA = "LimitExceededException", WA = "LastIncreaseDateTime", GA = "LatestStreamArn", KA = "LocalSecondaryIndexes", qA = "LocalSecondaryIndexDescription", JA = "LocalSecondaryIndexDescriptionList", YA = "LatestStreamLabel", XA = "LastUpdateDateTime", ZA = "LastUpdateToPayPerRequestDateTime", QA = "L", $A = "Message", ej = "MapAttributeValue", tj = "MultiRegionConsistency", nj = "MaxReadRequestUnits", rj = "MaxWriteRequestUnits", ij = "M", aj = "N", oj = "NonKeyAttributes", sj = "NumberOfDecreasesToday", cj = "NS", lj = "NULL", uj = "OnDemandThroughput", dj = "OnDemandThroughputOverride", fj = "PointInTimeRecoveryUnavailableException", pj = "PolicyNotFoundException", mj = "ProvisionedThroughput", hj = "ProvisionedThroughputDescription", gj = "ProvisionedThroughputExceededException", _j = "ProvisionedThroughputOverride", vj = "ProjectionType", yj = "Projection", bj = "ReplicaAlreadyExistsException", xj = "ReplicaArn", Sj = "ReadCapacityUnits", Cj = "ReplicaDescription", wj = "ReplicaDescriptionList", Tj = "RestoreDateTime", Ej = "ReplicaGlobalSecondaryIndex", Dj = "ReplicaGlobalSecondaryIndexDescription", Oj = "ReplicaGlobalSecondaryIndexDescriptionList", kj = "ReplicaGlobalSecondaryIndexList", Aj = "ReplicationGroupUpdate", jj = "ReplicationGroupUpdateList", Mj = "ReplicaInaccessibleDateTime", Nj = "RestoreInProgress", Pj = "ResourceInUseException", Fj = "RequestLimitExceeded", Ij = "RegionName", Lj = "ReplicaNotFoundException", Rj = "ResourceNotFoundException", zj = "ReplicaStatusDescription", Bj = "ReplicaStatusPercentProgress", Vj = "ReplicaStatus", Hj = "RestoreSummary", Uj = "ReplicaTableClassSummary", Wj = "ReadUnitsPerSecond", Gj = "ReplicaUpdates", Kj = "ReplicatedWriteConflictException", qj = "Replicas", Jj = "SourceBackupArn", Yj = "StreamEnabled", Xj = "StreamSpecification", Zj = "SearchSchemaElement", Qj = "SSEDescription", $j = "SSESpecification", eM = "SearchSchemaElementType", tM = "SSEType", nM = "SS", rM = "SearchSchema", iM = "SourceTableArn", aM = "StreamViewType", oM = "S", sM = "Status", cM = "Table", lM = "TableArn", uM = "TableAlreadyExistsException", dM = "TableClass", fM = "TransactionCanceledException", pM = "TransactionConflictException", mM = "TableClassOverride", hM = "TableClassSummary", gM = "TableDescription", _M = "ThrottlingException", vM = "TableId", yM = "TransactionInProgressException", bM = "TableInUseException", xM = "TableName", SM = "TableNotFoundException", CM = "ThrottlingReasons", wM = "ThrottlingReasonList", TM = "ThrottlingReason", EM = "TableSizeBytes", DM = "TableStatus", OM = "TableWarmThroughputDescription", kM = "Update", AM = "UpdateGlobalSecondaryIndexAction", jM = "UpdateReplicationGroupMemberAction", MM = "UpdateTable", NM = "UpdateTableInput", PM = "UpdateTableOutput", FM = "VectorAttribute", IM = "VectorAttributeDefinition", LM = "VectorIndexes", RM = "VectorIndexDescription", zM = "VectorIndexDescriptionList", BM = "VectorIndexUpdates", VM = "VectorIndexUpdateList", HM = "VectorIndexUpdate", UM = "WriteCapacityUnits", WM = "WitnessStatus", GM = "WarmThroughput", KM = "WriteUnitsPerSecond", qM = "awsQueryError", P = "client", F = "error", JM = "httpError", I = "message", YM = "reason", XM = "resource", ZM = "smithy.ts.sdk.synthetic.com.amazonaws.dynamodb", QM = "server", $M = "throttlingReasons", L = "com.amazonaws.dynamodb", eN = new it(ZM), tN = [
	-3,
	ZM,
	"DynamoDBServiceException",
	0,
	[],
	[]
];
eN.registerError(tN, N);
var R = new it(L), nN = [
	-3,
	L,
	pk,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(nN, bO);
var rN = [
	-3,
	L,
	gk,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(rN, xO);
var iN = [
	-3,
	L,
	Sk,
	{ [F]: P },
	[I, bA],
	[0, () => eF]
];
R.registerError(iN, $O);
var aN = [
	-3,
	L,
	xk,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(aN, AO);
var oN = [
	-3,
	L,
	Bk,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(oN, VO);
var sN = [
	-3,
	L,
	Qk,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(sN, WO);
var cN = [
	-3,
	L,
	$k,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(cN, RO);
var lN = [
	-3,
	L,
	uA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(lN, PO);
var uN = [
	-3,
	L,
	dA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(uN, zO);
var dN = [
	-3,
	L,
	jA,
	{ [F]: P },
	[$A],
	[0]
];
R.registerError(dN, HO);
var fN = [
	-3,
	L,
	CA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(fN, qO);
var pN = [
	-3,
	L,
	kA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(pN, BO);
var mN = [
	-3,
	L,
	AA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(mN, QO);
var hN = [
	-3,
	L,
	FA,
	{ [F]: QM },
	[I],
	[0]
];
R.registerError(hN, SO);
var gN = [
	-3,
	L,
	EA,
	{
		[F]: P,
		[JM]: 421
	},
	[$A],
	[0]
];
R.registerError(gN, TO);
var _N = [
	-3,
	L,
	DA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(_N, GO);
var vN = [
	-3,
	L,
	MA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(vN, YO);
var yN = [
	-3,
	L,
	wA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(yN, OO);
var bN = [
	-3,
	L,
	UA,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(bN, jO);
var xN = [
	-3,
	L,
	fj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(xN, KO);
var SN = [
	-3,
	L,
	pj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(SN, LO);
var CN = [
	-3,
	L,
	gj,
	{ [F]: P },
	[I, CM],
	[0, () => ZP]
];
R.registerError(CN, EO);
var wN = [
	-3,
	L,
	bj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(wN, XO);
var TN = [
	-3,
	L,
	Lj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(TN, ZO);
var EN = [
	-3,
	L,
	Kj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(EN, kO);
var DN = [
	-3,
	L,
	Fj,
	{ [F]: P },
	[I, CM],
	[0, () => ZP]
];
R.registerError(DN, CO);
var ON = [
	-3,
	L,
	Pj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(ON, FO);
var kN = [
	-3,
	L,
	Rj,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(kN, DO);
var AN = [
	-3,
	L,
	uM,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(AN, JO);
var jN = [
	-3,
	L,
	bM,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(jN, MO);
var MN = [
	-3,
	L,
	SM,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(MN, NO);
var NN = [
	-3,
	L,
	_M,
	{
		[qM]: ["Throttling", 400],
		[F]: P,
		[JM]: 400
	},
	[I, $M],
	[0, () => ZP]
];
R.registerError(NN, wO);
var PN = [
	-3,
	L,
	fM,
	{ [F]: P },
	[$A, Dk],
	[0, () => LP]
];
R.registerError(PN, ek);
var FN = [
	-3,
	L,
	pM,
	{ [F]: P },
	[I],
	[0]
];
R.registerError(FN, IO);
var IN = [
	-3,
	L,
	yM,
	{ [F]: P },
	[$A],
	[0]
];
R.registerError(IN, UO);
var LN = [eN, R], RN = [
	3,
	L,
	ck,
	0,
	[
		rk,
		sk,
		tk
	],
	[
		4,
		0,
		0
	]
], zN = [
	3,
	L,
	nk,
	0,
	[ok, lk],
	[0, 0],
	2
], BN = [
	3,
	L,
	hk,
	0,
	[mk, ZA],
	[0, 4]
], VN = [
	3,
	L,
	Ak,
	0,
	[
		bA,
		bk,
		$A
	],
	[
		() => eF,
		0,
		0
	]
], HN = [
	3,
	L,
	wk,
	0,
	[
		OA,
		RA,
		yj,
		mj,
		uj,
		GM
	],
	[
		0,
		() => UP,
		() => dP,
		() => fP,
		() => lP,
		() => FP
	],
	3
], UN = [
	3,
	L,
	Tk,
	0,
	[Ij],
	[0],
	1
], WN = [
	3,
	L,
	Ok,
	0,
	[
		Ij,
		LA,
		_j,
		dj,
		rA,
		mM
	],
	[
		0,
		0,
		() => mP,
		() => uP,
		() => JP,
		0
	],
	1
], GN = [
	3,
	L,
	jk,
	0,
	[
		OA,
		FM,
		yj,
		Nk,
		Lk,
		rM
	],
	[
		0,
		() => MP,
		() => dP,
		1,
		0,
		() => XP
	],
	5
], KN = [
	3,
	L,
	Rk,
	0,
	[OA],
	[0],
	1
], qN = [
	3,
	L,
	zk,
	0,
	[Ij],
	[0],
	1
], JN = [
	3,
	L,
	Wk,
	0,
	[Ij],
	[0],
	1
], YN = [
	3,
	L,
	Yk,
	0,
	[OA],
	[0],
	1
], XN = [
	3,
	L,
	Fk,
	0,
	[],
	[]
], ZN = [
	3,
	L,
	Ik,
	0,
	[eA],
	[() => RP],
	1
], QN = [
	3,
	L,
	Kk,
	0,
	[xM],
	[0],
	1
], $N = [
	3,
	L,
	qk,
	0,
	[cM],
	[() => TP]
], eP = [
	3,
	L,
	Gk,
	0,
	[Ij, Vk],
	[0, 0],
	2
], tP = [
	3,
	L,
	nA,
	0,
	[dk, Ek],
	[0, 1],
	2
], nP = [
	3,
	L,
	iA,
	0,
	[
		OA,
		RA,
		yj,
		NA,
		fk,
		mj,
		PA,
		SA,
		xA,
		uj,
		GM
	],
	[
		0,
		() => UP,
		() => dP,
		0,
		2,
		() => pP,
		1,
		1,
		0,
		() => lP,
		() => iP
	]
], rP = [
	3,
	L,
	oA,
	0,
	[
		kM,
		Mk,
		Xk
	],
	[
		() => OP,
		() => HN,
		() => KN
	]
], iP = [
	3,
	L,
	lA,
	0,
	[
		Wj,
		KM,
		sM
	],
	[
		1,
		1,
		0
	]
], aP = [
	3,
	L,
	hA,
	0,
	[Ij, WM],
	[0, 0]
], oP = [
	3,
	L,
	_A,
	0,
	[Mk, Xk],
	[() => UN, () => qN]
], sP = [
	3,
	L,
	zA,
	0,
	[ok, BA],
	[0, 0],
	2
], cP = [
	3,
	L,
	qA,
	0,
	[
		OA,
		RA,
		yj,
		PA,
		SA,
		xA
	],
	[
		0,
		() => UP,
		() => dP,
		1,
		1,
		0
	]
], lP = [
	3,
	L,
	uj,
	0,
	[nj, rj],
	[1, 1]
], uP = [
	3,
	L,
	dj,
	0,
	[nj],
	[1]
], dP = [
	3,
	L,
	yj,
	0,
	[vj, oj],
	[0, 64]
], fP = [
	3,
	L,
	mj,
	0,
	[Sj, UM],
	[1, 1],
	2
], pP = [
	3,
	L,
	hj,
	0,
	[
		WA,
		HA,
		sj,
		Sj,
		UM
	],
	[
		4,
		4,
		1,
		1,
		1
	]
], mP = [
	3,
	L,
	_j,
	0,
	[Sj],
	[1]
], hP = [
	3,
	L,
	Cj,
	0,
	[
		Ij,
		Vj,
		xj,
		zj,
		Bj,
		LA,
		_j,
		dj,
		GM,
		rA,
		Mj,
		Uj,
		fA
	],
	[
		0,
		0,
		0,
		0,
		0,
		0,
		() => mP,
		() => uP,
		() => EP,
		() => qP,
		4,
		() => wP,
		0
	]
], gP = [
	3,
	L,
	Ej,
	0,
	[
		OA,
		_j,
		dj
	],
	[
		0,
		() => mP,
		() => uP
	],
	1
], _P = [
	3,
	L,
	Dj,
	0,
	[
		OA,
		_j,
		dj,
		GM
	],
	[
		0,
		() => mP,
		() => uP,
		() => iP
	]
], vP = [
	3,
	L,
	Aj,
	0,
	[
		Mk,
		kM,
		Xk,
		Zk
	],
	[
		() => WN,
		() => kP,
		() => JN,
		() => eP
	]
], yP = [
	3,
	L,
	Hj,
	0,
	[
		Tj,
		Nj,
		Jj,
		iM
	],
	[
		4,
		2,
		0,
		0
	],
	2
], bP = [
	3,
	L,
	Zj,
	0,
	[ok, eM],
	[0, 0],
	2
], xP = [
	3,
	L,
	Qj,
	0,
	[
		sM,
		tM,
		IA,
		TA
	],
	[
		0,
		0,
		0,
		4
	]
], SP = [
	3,
	L,
	$j,
	0,
	[
		tA,
		tM,
		LA
	],
	[
		2,
		0,
		0
	]
], CP = [
	3,
	L,
	Xj,
	0,
	[Yj, aM],
	[2, 0],
	1
], wP = [
	3,
	L,
	hM,
	0,
	[dM, XA],
	[0, 4]
], TP = [
	3,
	L,
	gM,
	0,
	[
		ik,
		xM,
		RA,
		DM,
		Ck,
		mj,
		EM,
		SA,
		lM,
		vM,
		hk,
		KA,
		rA,
		Xj,
		YA,
		GA,
		pA,
		qj,
		mA,
		fA,
		Hj,
		Qj,
		ck,
		hM,
		Hk,
		Uk,
		uj,
		GM,
		tj,
		LM
	],
	[
		() => IP,
		0,
		() => UP,
		0,
		4,
		() => pP,
		1,
		1,
		0,
		0,
		() => BN,
		() => GP,
		() => zP,
		() => CP,
		0,
		0,
		0,
		() => KP,
		() => VP,
		0,
		() => yP,
		() => xP,
		() => RN,
		() => wP,
		2,
		2,
		() => lP,
		() => EP,
		0,
		() => QP
	]
], EP = [
	3,
	L,
	OM,
	0,
	[
		Wj,
		KM,
		sM
	],
	[
		1,
		1,
		0
	]
], DP = [
	3,
	L,
	TM,
	0,
	[YM, XM],
	[0, 0]
], OP = [
	3,
	L,
	AM,
	0,
	[
		OA,
		mj,
		uj,
		GM
	],
	[
		0,
		() => fP,
		() => lP,
		() => FP
	],
	1
], kP = [
	3,
	L,
	jM,
	0,
	[
		Ij,
		LA,
		_j,
		dj,
		rA,
		mM
	],
	[
		0,
		0,
		() => mP,
		() => uP,
		() => JP,
		0
	],
	1
], AP = [
	3,
	L,
	NM,
	0,
	[
		xM,
		ik,
		mk,
		mj,
		cA,
		Xj,
		$j,
		Gj,
		dM,
		Hk,
		tj,
		yA,
		uj,
		GM,
		fA,
		Uk,
		BM
	],
	[
		0,
		() => IP,
		0,
		() => fP,
		() => BP,
		() => CP,
		() => SP,
		() => YP,
		0,
		2,
		0,
		() => HP,
		() => lP,
		() => FP,
		0,
		2,
		() => $P
	],
	1
], jP = [
	3,
	L,
	PM,
	0,
	[gM],
	[() => TP]
], MP = [
	3,
	L,
	IM,
	0,
	[ok],
	[0],
	1
], NP = [
	3,
	L,
	RM,
	0,
	[
		OA,
		rM,
		yj,
		FM,
		Nk,
		Lk,
		NA,
		fk,
		PA,
		SA,
		xA
	],
	[
		0,
		() => XP,
		() => dP,
		() => MP,
		1,
		0,
		0,
		2,
		1,
		1,
		0
	]
], PP = [
	3,
	L,
	HM,
	0,
	[Mk, Xk],
	[() => GN, () => YN]
], FP = [
	3,
	L,
	GM,
	0,
	[Wj, KM],
	[1, 1]
], IP = [
	1,
	L,
	ik,
	0,
	() => zN
], LP = [
	1,
	L,
	kk,
	0,
	() => VN
], RP = [
	1,
	L,
	eA,
	0,
	() => tP
], zP = [
	1,
	L,
	aA,
	0,
	() => nP
], BP = [
	1,
	L,
	sA,
	0,
	() => rP
], VP = [
	1,
	L,
	gA,
	0,
	() => aP
], HP = [
	1,
	L,
	vA,
	0,
	() => oP
], UP = [
	1,
	L,
	RA,
	0,
	() => sP
], WP = [
	1,
	L,
	VA,
	0,
	() => nF
], GP = [
	1,
	L,
	JA,
	0,
	() => cP
], KP = [
	1,
	L,
	wj,
	0,
	() => hP
], qP = [
	1,
	L,
	Oj,
	0,
	() => _P
], JP = [
	1,
	L,
	kj,
	0,
	() => gP
], YP = [
	1,
	L,
	jj,
	0,
	() => vP
], XP = [
	1,
	L,
	rM,
	0,
	() => bP
], ZP = [
	1,
	L,
	wM,
	0,
	() => DP
], QP = [
	1,
	L,
	zM,
	0,
	() => NP
], $P = [
	1,
	L,
	VM,
	0,
	() => PP
], eF = [
	2,
	L,
	ak,
	0,
	0,
	() => nF
], tF = [
	2,
	L,
	ej,
	0,
	0,
	() => nF
], nF = [
	4,
	L,
	uk,
	0,
	[
		oM,
		aj,
		yk,
		nM,
		cj,
		vk,
		ij,
		QA,
		lj,
		_k
	],
	[
		0,
		0,
		21,
		64,
		64,
		85,
		() => tF,
		() => WP,
		2,
		2
	]
], rF = [
	9,
	L,
	Pk,
	0,
	() => XN,
	() => ZN
], iF = [
	9,
	L,
	Jk,
	0,
	() => QN,
	() => $N
], aF = [
	9,
	L,
	MM,
	0,
	() => AP,
	() => jP
], oF = class extends gO(_O, yO, "DescribeEndpoints", rF) {}, sF = {
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
_(), v();
var cF = "com.amazonaws.dynamodb#AttributeValue", lF = class extends ec {
	writeValue(e, t, n) {
		if (typeof t == "object" && t) {
			let n = g.of(e);
			if (n.isStructSchema() && n.getName(!0) === cF) {
				this.writeAttributeValue(t);
				return;
			}
		}
		super.writeValue(e, t, n);
	}
	writeAttributeValue(e) {
		let t = this.serdeContext?.base64Encoder ?? Mt;
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
}, uF = class extends Is {
	_read(e, t) {
		let n = g.of(e);
		return n.isStructSchema() && n.getName(!0) === cF && t && typeof t == "object" ? this.readAttributeValue(t) : super._read(n, t);
	}
	readAttributeValue(e) {
		let t = this.serdeContext?.base64Decoder ?? Ot, n = e;
		if (typeof e.B == "string" && (n.B = t(e.B)), Array.isArray(e.BS) && (n.BS = e.BS.map(t)), Array.isArray(e.L) && (n.L = e.L.map((e) => this.readAttributeValue(e))), e.M && typeof e.M == "object") {
			let t = e.M;
			for (let e in t) t[e] = this.readAttributeValue(t[e]);
		}
		return n;
	}
}, dF = class extends tc {
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
		let e = new lF(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new uF(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/bdd.js
ea();
var fF = "ref", pF = "argv", mF = -1, hF = !0, gF = !1, _F = "isSet", vF = "booleanEquals", yF = "PartitionResult", bF = "stringEquals", xF = "getAttr", SF = "parsedEndpoint", CF = "aws.parseArn", wF = (e) => "ParsedArn_ssa_" + e, TF = "service", EF = "dynamodb", DF = "isValidHostLabel", OF = "accountId", kF = "FirstArn", AF = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.search-ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", jF = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", MF = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.search-ddb.{Region}.{PartitionResult#dnsSuffix}", NF = (e) => "https://{ParsedArn_ssa_" + e + "#accountId}.ddb.{Region}.{PartitionResult#dnsSuffix}", PF = { [fF]: "Region" }, FF = { [fF]: yF }, IF = {
	fn: xF,
	[pF]: [{ [fF]: SF }, "authority"]
}, LF = { [fF]: "AccountIdEndpointMode" }, RF = {
	fn: xF,
	[pF]: [FF, "name"]
}, zF = { [fF]: "ParsedArn_ssa_2" }, BF = {
	fn: xF,
	[pF]: [zF, "region"]
}, VF = { [fF]: "ResourceArnList" }, HF = {
	fn: xF,
	[pF]: [{ [fF]: "ParsedArn_ssa_1" }, "region"]
}, UF = { [fF]: "ParsedArn_ssa_1" }, WF = { [fF]: "AccountId" }, GF = {}, KF = { metricValues: ["O"] }, qF = [PF], JF = [{ [fF]: "Endpoint" }], YF = [{ [fF]: "ResourceArn" }], XF = {
	conditions: [
		[_F, qF],
		[_F, JF],
		[vF, [{ [fF]: "UseFIPS" }, hF]],
		[vF, [{ [fF]: "UseDualStack" }, hF]],
		[
			"aws.partition",
			qF,
			yF
		],
		[bF, [PF, "local"]],
		[vF, [{
			fn: xF,
			[pF]: [FF, "supportsFIPS"]
		}, hF]],
		[
			"parseURL",
			JF,
			SF
		],
		[bF, ["dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", IF]],
		[vF, [{
			fn: xF,
			[pF]: [FF, "supportsDualStack"]
		}, hF]],
		[bF, ["search-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", IF]],
		[_F, [LF]],
		[bF, [PF, "us-gov-east-1"]],
		[bF, [PF, "cn-north-1"]],
		[bF, [PF, "cn-northwest-1"]],
		[bF, [PF, "us-gov-west-1"]],
		[bF, [RF, "aws"]],
		[bF, [LF, "disabled"]],
		[_F, YF],
		[
			CF,
			YF,
			wF(2)
		],
		[bF, [{
			fn: xF,
			[pF]: [zF, TF]
		}, EF]],
		[bF, [BF, PF]],
		[DF, [{
			fn: xF,
			[pF]: [zF, OF]
		}, gF]],
		[DF, [BF, gF]],
		[_F, [VF]],
		[
			xF,
			[VF, "[0]"],
			kF
		],
		[
			CF,
			[{ [fF]: kF }],
			wF(1)
		],
		[bF, [HF, PF]],
		[bF, [{
			fn: xF,
			[pF]: [UF, TF]
		}, EF]],
		[DF, [{
			fn: xF,
			[pF]: [UF, OF]
		}, gF]],
		[DF, [HF, gF]],
		[_F, [WF]],
		[bF, [LF, "required"]],
		[DF, [WF, gF]],
		[bF, [RF, "aws-us-gov"]],
		[vF, [{
			fn: "coalesce",
			[pF]: [{ [fF]: "IsSearchOperation" }, gF]
		}, hF]]
	],
	results: [
		[mF],
		[mF, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[mF, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[mF, "Endpoint override is not supported for dual-stack endpoints. Please enable dual-stack functionality by enabling the configuration. For more details, see: https://docs.aws.amazon.com/sdkref/latest/guide/feature-endpoints.html"],
		["{Endpoint}", GF],
		[mF, "Invalid Configuration: FIPS and local endpoint are not supported"],
		[mF, "Invalid Configuration: Dualstack and local endpoint are not supported"],
		["http://localhost:8000", { authSchemes: [{
			signingRegion: "us-east-1",
			name: "sigv4",
			signingName: EF
		}] }],
		[mF, "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported"],
		["https://search-dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", GF],
		["https://dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", GF],
		[mF, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://search-dynamodb.{Region}.{PartitionResult#dnsSuffix}", GF],
		["https://dynamodb.{Region}.{PartitionResult#dnsSuffix}", GF],
		["https://search-dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", GF],
		["https://dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", GF],
		[mF, "FIPS is enabled but this partition does not support FIPS"],
		[mF, "Invalid Configuration: AccountIdEndpointMode is required but account endpoints are not supported in this region"],
		["https://search-dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", GF],
		["https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", GF],
		[AF(2), KF],
		[jF(2), KF],
		[AF(1), KF],
		[jF(1), KF],
		["https://{AccountId}.search-ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", KF],
		["https://{AccountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}", KF],
		[mF, "Credentials-sourced account ID parameter is invalid"],
		[mF, "AccountIdEndpointMode is required but no AccountID was provided or able to be loaded"],
		[mF, "DualStack is enabled but this partition does not support DualStack"],
		[MF(2), KF],
		[NF(2), KF],
		[MF(1), KF],
		[NF(1), KF],
		["https://{AccountId}.search-ddb.{Region}.{PartitionResult#dnsSuffix}", KF],
		["https://{AccountId}.ddb.{Region}.{PartitionResult#dnsSuffix}", KF],
		[mF, "Invalid Configuration: Missing Region"]
	]
}, ZF = 2, QF = new Int32Array([
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
]), $F = zr.from(QF, ZF, XF.conditions, XF.results);
// ../../node_modules/.pnpm/@aws-sdk+client-dynamodb@3.1156.0/node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/endpointResolver.js
ea();
var eI = new Vr({
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
}), tI = (e, t = {}) => eI.get(e, () => Xi($F, {
	endpointParams: e,
	logger: t.logger
}));
Zr.aws = jl, Qa(), ke(), v();
var nI = (e) => ({
	apiVersion: "2012-08-10",
	base64Decoder: e?.base64Decoder ?? Ot,
	base64Encoder: e?.base64Encoder ?? Mt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? tI,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? fO,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Xl()
	}],
	logger: e?.logger ?? new St(),
	protocol: e?.protocol ?? rd,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.dynamodb",
		errorTypeRegistries: LN,
		xmlNamespace: "http://dynamodb.amazonaws.com/doc/2012-08-10/",
		version: "2012-08-10",
		serviceTarget: "DynamoDB_20120810",
		jsonCodec: new dF()
	},
	serviceId: e?.serviceId ?? "DynamoDB",
	sha256: e?.sha256 ?? Xa,
	urlParser: e?.urlParser ?? Oe,
	utf8Decoder: e?.utf8Decoder ?? At,
	utf8Encoder: e?.utf8Encoder ?? It
});
v(), la();
var rI = (e) => {
	let t = zl(e), n = () => t().then(pt), r = nI(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		accountIdEndpointMode: e?.accountIdEndpointMode ?? (() => Promise.resolve("preferred")),
		bodyLengthChecker: e?.bodyLengthChecker ?? or,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Tl({
			serviceId: r.serviceId,
			clientVersion: sF.version
		}),
		endpointDiscoveryEnabledProvider: e?.endpointDiscoveryEnabledProvider ?? (() => Promise.resolve(void 0)),
		maxAttempts: e?.maxAttempts ?? (Dc.v2026 ? 4 : 3),
		region: e?.region ?? Ne("Region is missing"),
		requestHandler: $u.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || jc),
		streamCollector: e?.streamCollector ?? ca,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, iI = (e) => {
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
}, aI = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), oI = (e, t) => {
	let n = Object.assign(Vl(e), yt(e), cs(e), iI(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Hl(n), bt(n), ls(n), aI(n));
};
ea(), _();
var sI = class extends Pe {
	config;
	constructor(...[e]) {
		let t = rI(e || {});
		super(t), this.initConfig = t;
		let n = Rc(Ll(Fc(cl(nO(mO(t))), {
			defaultBaseDelay: Dc.v2026 ? 25 : void 0,
			defaultMaxAttempts: Dc.v2026 ? 4 : void 0
		}))), r = oI(lO(pO(Qi(n)), { endpointDiscoveryCommandCtor: oF }), e?.extensions || []);
		this.config = r, this.middlewareStack.use(We(this.config)), this.middlewareStack.use(wl(this.config)), this.middlewareStack.use(Ic(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(Vc(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Gc(this.config)), this.middlewareStack.use(Xc(this.config, {
			httpAuthSchemeParametersProvider: uO,
			identityProviderConfigProvider: async (e) => new rl({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(tl(this.config));
	}
	destroy() {
		super.destroy();
	}
}, cI = class extends gO(vO, yO, "DescribeTable", iF) {}, lI = class extends gO(vO, yO, "UpdateTable", aF) {}, uI = (e) => Object.assign(e, { useQueueUrlAsEndpoint: e.useQueueUrlAsEndpoint ?? !0 });
function dI({ useQueueUrlAsEndpoint: e, endpoint: t }) {
	return (n, r) => async (i) => {
		let { input: a } = i, o = r.endpointV2;
		if (!t && a.QueueUrl && o && e) {
			let e = r.logger instanceof St || !r.logger?.warn ? console : r.logger;
			try {
				let t = new URL(a.QueueUrl), n = new URL(t.origin);
				o.url.origin !== n.origin && (e.warn(`QueueUrl=${a.QueueUrl} differs from SQSClient resolved endpoint=${o.url.toString()}, using QueueUrl host as endpoint.
Set [endpoint=string] or [useQueueUrlAsEndpoint=false] on the SQSClient.`), r.endpointV2 = {
					...o,
					url: n
				});
			} catch (t) {
				e.warn(t);
			}
		}
		return n(i);
	};
}
var fI = {
	name: "queueUrlMiddleware",
	relation: "after",
	toMiddleware: "endpointV2Middleware",
	override: !0
}, pI = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(dI(e), fI);
} });
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/auth/httpAuthSchemeProvider.js
fe(), Te();
var mI = async (e, t, n) => ({
	operation: de(t).operation,
	region: await we(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function hI(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "sqs",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var gI = (e) => {
	let t = [];
	return e.operation, t.push(hI(e)), t;
}, _I = (e) => {
	let t = Hu(e);
	return Object.assign(t, { authSchemePreference: we(e.authSchemePreference ?? []) });
}, vI = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "sqs"
}), yI = {
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
}, bI = {
	name: "@aws-sdk/client-sqs",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Sqs Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sqs",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-sqs"
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
		"test:browser": "yarn g:vitest run -c vitest.config.browser.e2e.mts",
		"test:browser:watch": "yarn g:vitest watch -c vitest.config.browser.e2e.mts",
		"test:index": "tsc -p tsconfig.test.json && node ./test/index-objects.spec.mjs"
	},
	dependencies: {
		"@aws-sdk/core": "^3.978.5",
		"@aws-sdk/credential-provider-node": "^3.972.88",
		"@aws-sdk/middleware-sdk-sqs": "^3.972.46",
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
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/endpoint/bdd.js
ea();
var xI = "ref", SI = -1, CI = !0, wI = "isSet", TI = "PartitionResult", EI = "booleanEquals", DI = "getAttr", OI = { [xI]: "Endpoint" }, kI = { [xI]: TI }, AI = {}, jI = [{ [xI]: "Region" }], MI = {
	conditions: [
		[wI, [OI]],
		[wI, jI],
		[
			"aws.partition",
			jI,
			TI
		],
		[EI, [{ [xI]: "UseFIPS" }, CI]],
		[EI, [{ [xI]: "UseDualStack" }, CI]],
		[EI, [{
			fn: DI,
			argv: [kI, "supportsDualStack"]
		}, CI]],
		[EI, [{
			fn: DI,
			argv: [kI, "supportsFIPS"]
		}, CI]],
		["stringEquals", [{
			fn: DI,
			argv: [kI, "name"]
		}, "aws-us-gov"]]
	],
	results: [
		[SI],
		[SI, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[SI, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[OI, AI],
		["https://sqs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", AI],
		[SI, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://sqs.{Region}.amazonaws.com", AI],
		["https://sqs-fips.{Region}.{PartitionResult#dnsSuffix}", AI],
		[SI, "FIPS is enabled but this partition does not support FIPS"],
		["https://sqs.{Region}.{PartitionResult#dualStackDnsSuffix}", AI],
		[SI, "DualStack is enabled but this partition does not support DualStack"],
		["https://sqs.{Region}.{PartitionResult#dnsSuffix}", AI],
		[SI, "Invalid Configuration: Missing Region"]
	]
}, NI = 2, PI = new Int32Array([
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
]), FI = zr.from(PI, NI, MI.conditions, MI.results);
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/endpoint/endpointResolver.js
ea();
var II = new Vr({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), LI = (e, t = {}) => II.get(e, () => Xi(FI, {
	endpointParams: e,
	logger: t.logger
}));
Zr.aws = jl;
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/models/SQSServiceException.js
var z = class e extends dt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.sqs#SQSServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, RI = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidAddress";
	name = "InvalidAddress";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidAddress",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, zI = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidSecurity";
	name = "InvalidSecurity";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidSecurity",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, BI = class e extends z {
	static shapeId = "com.amazonaws.sqs#OverLimit";
	name = "OverLimit";
	$fault = "client";
	constructor(t) {
		super({
			name: "OverLimit",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, VI = class e extends z {
	static shapeId = "com.amazonaws.sqs#QueueDoesNotExist";
	name = "QueueDoesNotExist";
	$fault = "client";
	constructor(t) {
		super({
			name: "QueueDoesNotExist",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, HI = class e extends z {
	static shapeId = "com.amazonaws.sqs#RequestThrottled";
	name = "RequestThrottled";
	$fault = "client";
	constructor(t) {
		super({
			name: "RequestThrottled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, UI = class e extends z {
	static shapeId = "com.amazonaws.sqs#UnsupportedOperation";
	name = "UnsupportedOperation";
	$fault = "client";
	constructor(t) {
		super({
			name: "UnsupportedOperation",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, WI = class e extends z {
	static shapeId = "com.amazonaws.sqs#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, GI = class e extends z {
	static shapeId = "com.amazonaws.sqs#MessageNotInflight";
	name = "MessageNotInflight";
	$fault = "client";
	constructor(t) {
		super({
			name: "MessageNotInflight",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, KI = class e extends z {
	static shapeId = "com.amazonaws.sqs#ReceiptHandleIsInvalid";
	name = "ReceiptHandleIsInvalid";
	$fault = "client";
	constructor(t) {
		super({
			name: "ReceiptHandleIsInvalid",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, qI = class e extends z {
	static shapeId = "com.amazonaws.sqs#BatchEntryIdsNotDistinct";
	name = "BatchEntryIdsNotDistinct";
	$fault = "client";
	constructor(t) {
		super({
			name: "BatchEntryIdsNotDistinct",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, JI = class e extends z {
	static shapeId = "com.amazonaws.sqs#EmptyBatchRequest";
	name = "EmptyBatchRequest";
	$fault = "client";
	constructor(t) {
		super({
			name: "EmptyBatchRequest",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, YI = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidBatchEntryId";
	name = "InvalidBatchEntryId";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidBatchEntryId",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, XI = class e extends z {
	static shapeId = "com.amazonaws.sqs#TooManyEntriesInBatchRequest";
	name = "TooManyEntriesInBatchRequest";
	$fault = "client";
	constructor(t) {
		super({
			name: "TooManyEntriesInBatchRequest",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, ZI = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidAttributeName";
	name = "InvalidAttributeName";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidAttributeName",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, QI = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidAttributeValue";
	name = "InvalidAttributeValue";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidAttributeValue",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, $I = class e extends z {
	static shapeId = "com.amazonaws.sqs#QueueDeletedRecently";
	name = "QueueDeletedRecently";
	$fault = "client";
	constructor(t) {
		super({
			name: "QueueDeletedRecently",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, eL = class e extends z {
	static shapeId = "com.amazonaws.sqs#QueueNameExists";
	name = "QueueNameExists";
	$fault = "client";
	constructor(t) {
		super({
			name: "QueueNameExists",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, tL = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidIdFormat";
	name = "InvalidIdFormat";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidIdFormat",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, nL = class e extends z {
	static shapeId = "com.amazonaws.sqs#PurgeQueueInProgress";
	name = "PurgeQueueInProgress";
	$fault = "client";
	constructor(t) {
		super({
			name: "PurgeQueueInProgress",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, rL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsAccessDenied";
	name = "KmsAccessDenied";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsAccessDenied",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, iL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsDisabled";
	name = "KmsDisabled";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsDisabled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, aL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsInvalidKeyUsage";
	name = "KmsInvalidKeyUsage";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsInvalidKeyUsage",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, oL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsInvalidState";
	name = "KmsInvalidState";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsInvalidState",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, sL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsNotFound";
	name = "KmsNotFound";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsNotFound",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, cL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsOptInRequired";
	name = "KmsOptInRequired";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsOptInRequired",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, lL = class e extends z {
	static shapeId = "com.amazonaws.sqs#KmsThrottled";
	name = "KmsThrottled";
	$fault = "client";
	constructor(t) {
		super({
			name: "KmsThrottled",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, uL = class e extends z {
	static shapeId = "com.amazonaws.sqs#InvalidMessageContents";
	name = "InvalidMessageContents";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidMessageContents",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, dL = class e extends z {
	static shapeId = "com.amazonaws.sqs#BatchRequestTooLong";
	name = "BatchRequestTooLong";
	$fault = "client";
	constructor(t) {
		super({
			name: "BatchRequestTooLong",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/schemas/schemas_0.js
_();
var fL = "AttributeNames", pL = "AttributeName", mL = "Attributes", hL = "Attribute", gL = "BatchEntryIdsNotDistinct", _L = "BatchRequestTooLong", vL = "EmptyBatchRequest", yL = "GetQueueAttributes", bL = "GetQueueAttributesRequest", xL = "GetQueueAttributesResult", SL = "GetQueueUrl", CL = "GetQueueUrlRequest", wL = "GetQueueUrlResult", TL = "InvalidAddress", EL = "InvalidAttributeName", DL = "InvalidAttributeValue", OL = "InvalidBatchEntryId", kL = "InvalidIdFormat", AL = "InvalidMessageContents", jL = "InvalidSecurity", ML = "KmsAccessDenied", NL = "KmsDisabled", PL = "KmsInvalidKeyUsage", FL = "KmsInvalidState", IL = "KmsNotFound", LL = "KmsOptInRequired", RL = "KmsThrottled", zL = "MessageNotInflight", BL = "Name", VL = "OverLimit", HL = "PurgeQueueInProgress", UL = "QueueAttributeMap", WL = "QueueDoesNotExist", GL = "QueueDeletedRecently", KL = "QueueName", qL = "QueueNameExists", JL = "QueueOwnerAWSAccountId", YL = "QueueUrl", XL = "ReceiptHandleIsInvalid", ZL = "ResourceNotFoundException", QL = "RequestThrottled", $L = "TooManyEntriesInBatchRequest", eR = "UnsupportedOperation", tR = "Value", nR = "awsQueryError", B = "client", V = "error", rR = "httpError", H = "message", iR = "smithy.ts.sdk.synthetic.com.amazonaws.sqs", aR = "xmlFlattened", oR = "xmlName", U = "com.amazonaws.sqs", sR = new it(iR), cR = [
	-3,
	iR,
	"SQSServiceException",
	0,
	[],
	[]
];
sR.registerError(cR, z);
var W = new it(U), lR = [
	-3,
	U,
	gL,
	{
		[nR]: ["AWS.SimpleQueueService.BatchEntryIdsNotDistinct", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(lR, qI);
var uR = [
	-3,
	U,
	_L,
	{
		[nR]: ["AWS.SimpleQueueService.BatchRequestTooLong", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(uR, dL);
var dR = [
	-3,
	U,
	vL,
	{
		[nR]: ["AWS.SimpleQueueService.EmptyBatchRequest", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(dR, JI);
var fR = [
	-3,
	U,
	TL,
	{
		[nR]: ["InvalidAddress", 404],
		[V]: B,
		[rR]: 404
	},
	[H],
	[0]
];
W.registerError(fR, RI);
var pR = [
	-3,
	U,
	EL,
	{ [V]: B },
	[H],
	[0]
];
W.registerError(pR, ZI);
var mR = [
	-3,
	U,
	DL,
	{ [V]: B },
	[H],
	[0]
];
W.registerError(mR, QI);
var hR = [
	-3,
	U,
	OL,
	{
		[nR]: ["AWS.SimpleQueueService.InvalidBatchEntryId", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(hR, YI);
var gR = [
	-3,
	U,
	kL,
	{ [V]: B },
	[],
	[]
];
W.registerError(gR, tL);
var _R = [
	-3,
	U,
	AL,
	{ [V]: B },
	[H],
	[0]
];
W.registerError(_R, uL);
var vR = [
	-3,
	U,
	jL,
	{
		[nR]: ["InvalidSecurity", 403],
		[V]: B,
		[rR]: 403
	},
	[H],
	[0]
];
W.registerError(vR, zI);
var yR = [
	-3,
	U,
	ML,
	{
		[nR]: ["KMS.AccessDeniedException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(yR, rL);
var bR = [
	-3,
	U,
	NL,
	{
		[nR]: ["KMS.DisabledException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(bR, iL);
var xR = [
	-3,
	U,
	PL,
	{
		[nR]: ["KMS.InvalidKeyUsageException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(xR, aL);
var SR = [
	-3,
	U,
	FL,
	{
		[nR]: ["KMS.InvalidStateException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(SR, oL);
var CR = [
	-3,
	U,
	IL,
	{
		[nR]: ["KMS.NotFoundException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(CR, sL);
var wR = [
	-3,
	U,
	LL,
	{
		[nR]: ["KMS.OptInRequired", 403],
		[V]: B,
		[rR]: 403
	},
	[H],
	[0]
];
W.registerError(wR, cL);
var TR = [
	-3,
	U,
	RL,
	{
		[nR]: ["KMS.ThrottlingException", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(TR, lL);
var ER = [
	-3,
	U,
	zL,
	{
		[nR]: ["AWS.SimpleQueueService.MessageNotInflight", 400],
		[V]: B,
		[rR]: 400
	},
	[],
	[]
];
W.registerError(ER, GI);
var DR = [
	-3,
	U,
	VL,
	{
		[nR]: ["OverLimit", 403],
		[V]: B,
		[rR]: 403
	},
	[H],
	[0]
];
W.registerError(DR, BI);
var OR = [
	-3,
	U,
	HL,
	{
		[nR]: ["AWS.SimpleQueueService.PurgeQueueInProgress", 403],
		[V]: B,
		[rR]: 403
	},
	[H],
	[0]
];
W.registerError(OR, nL);
var kR = [
	-3,
	U,
	GL,
	{
		[nR]: ["AWS.SimpleQueueService.QueueDeletedRecently", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(kR, $I);
var AR = [
	-3,
	U,
	WL,
	{
		[nR]: ["AWS.SimpleQueueService.NonExistentQueue", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(AR, VI);
var jR = [
	-3,
	U,
	qL,
	{
		[nR]: ["QueueAlreadyExists", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(jR, eL);
var MR = [
	-3,
	U,
	XL,
	{
		[nR]: ["ReceiptHandleIsInvalid", 404],
		[V]: B,
		[rR]: 404
	},
	[H],
	[0]
];
W.registerError(MR, KI);
var NR = [
	-3,
	U,
	QL,
	{
		[nR]: ["RequestThrottled", 403],
		[V]: B,
		[rR]: 403
	},
	[H],
	[0]
];
W.registerError(NR, HI);
var PR = [
	-3,
	U,
	ZL,
	{
		[nR]: ["ResourceNotFoundException", 404],
		[V]: B,
		[rR]: 404
	},
	[H],
	[0]
];
W.registerError(PR, WI);
var FR = [
	-3,
	U,
	$L,
	{
		[nR]: ["AWS.SimpleQueueService.TooManyEntriesInBatchRequest", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(FR, XI);
var IR = [
	-3,
	U,
	eR,
	{
		[nR]: ["AWS.SimpleQueueService.UnsupportedOperation", 400],
		[V]: B,
		[rR]: 400
	},
	[H],
	[0]
];
W.registerError(IR, UI);
var LR = [sR, W], RR = [
	3,
	U,
	bL,
	0,
	[YL, fL],
	[0, [64, {
		[aR]: 1,
		[oR]: pL
	}]],
	1
], zR = [
	3,
	U,
	xL,
	0,
	[mL],
	[[() => HR, {
		[aR]: 1,
		[oR]: hL
	}]]
], BR = [
	3,
	U,
	CL,
	0,
	[KL, JL],
	[0, 0],
	1
], VR = [
	3,
	U,
	wL,
	0,
	[YL],
	[0]
], HR = [
	2,
	U,
	UL,
	0,
	[0, { [oR]: BL }],
	[0, { [oR]: tR }]
], UR = [
	9,
	U,
	yL,
	0,
	() => RR,
	() => zR
], WR = [
	9,
	U,
	SL,
	0,
	() => BR,
	() => VR
];
Qa(), ke(), v();
var GR = (e) => ({
	apiVersion: "2012-11-05",
	base64Decoder: e?.base64Decoder ?? Ot,
	base64Encoder: e?.base64Encoder ?? Mt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? LI,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? gI,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Xl()
	}],
	logger: e?.logger ?? new St(),
	md5: e?.md5 ?? Oa,
	protocol: e?.protocol ?? rd,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.sqs",
		errorTypeRegistries: LR,
		version: "2012-11-05",
		serviceTarget: "AmazonSQS",
		awsQueryCompatible: !0
	},
	serviceId: e?.serviceId ?? "SQS",
	sha256: e?.sha256 ?? Xa,
	urlParser: e?.urlParser ?? Oe,
	utf8Decoder: e?.utf8Decoder ?? At,
	utf8Encoder: e?.utf8Encoder ?? It
});
v(), la();
var KR = (e) => {
	let t = zl(e), n = () => t().then(pt), r = GR(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? or,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Tl({
			serviceId: r.serviceId,
			clientVersion: bI.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? Ne("Region is missing"),
		requestHandler: $u.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || jc),
		streamCollector: e?.streamCollector ?? ca,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, qR = (e) => {
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
}, JR = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), YR = (e, t) => {
	let n = Object.assign(Vl(e), yt(e), cs(e), qR(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Hl(n), bt(n), ls(n), JR(n));
};
ea(), _();
var XR = class extends Pe {
	config;
	constructor(...[e]) {
		let t = KR(e || {});
		super(t), this.initConfig = t;
		let n = Rc(Ll(Fc(cl(vI(t))))), r = YR(_I(uI(Qi(n))), e?.extensions || []);
		this.config = r, this.middlewareStack.use(We(this.config)), this.middlewareStack.use(wl(this.config)), this.middlewareStack.use(Ic(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(Vc(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Gc(this.config)), this.middlewareStack.use(pI(this.config)), this.middlewareStack.use(Xc(this.config, {
			httpAuthSchemeParametersProvider: mI,
			identityProviderConfigProvider: async (e) => new rl({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(tl(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/commandBuilder.js
ea();
var ZR = Ct(yI, "AmazonSQS", "SQSClient", $i), QR = {}, $R = (e, t, n, r) => [], ez = class extends ZR(QR, $R, "GetQueueAttributes", UR) {}, tz = class extends ZR(QR, $R, "GetQueueUrl", WR) {};
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/auth/httpAuthSchemeProvider.js
fe(), Te();
var nz = async (e, t, n) => ({
	operation: de(t).operation,
	region: await we(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function rz(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "kinesis",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var iz = (e) => {
	let t = [];
	return e.operation, t.push(rz(e)), t;
}, az = (e) => {
	let t = Hu(e);
	return Object.assign(t, { authSchemePreference: we(e.authSchemePreference ?? []) });
}, oz = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "kinesis"
}), sz = {
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
}, cz = {
	name: "@aws-sdk/client-kinesis",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Kinesis Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-kinesis",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-kinesis"
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
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/endpoint/bdd.js
ea();
var lz = "ref", G = -1, uz = !1, dz = !0, fz = "isSet", pz = "PartitionResult", K = "stringEquals", mz = "substring", hz = "coalesce", gz = "", _z = "-", vz = "aws.parseArn", yz = (e) => "arn_ssa_" + e + gz, bz = "isValidHostLabel", xz = "getAttr", Sz = "accountId", Cz = "region", wz = "service", Tz = "kinesis", Ez = "resourceId[0]", Dz = (e) => "arnType_ssa_" + e + gz, Oz = "stream", kz = "partition", Az = "channel", jz = "resourceId[1]", Mz = (e) => "resourceId_ssa_" + e + gz, Nz = "booleanEquals", Pz = (e) => "https://{arn_ssa_" + e + "#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Fz = (e) => "https://{arn_ssa_" + e + "#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}", Iz = (e) => "https://{arn_ssa_" + e + "#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}", Lz = (e) => "https://{arn_ssa_" + e + "#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}", Rz = (e) => "Partition: {arn_ssa_" + e + "#partition} from ARN doesn't match with partition name: {PartitionResult#name}.", zz = (e) => "Invalid ARN: Kinesis ARNs don't support `{arnType_ssa_" + e + "}` arn types.", Bz = (e) => "Invalid ARN: The ARN was not for the Kinesis service, found: {arn_ssa_" + e + "#service}.", Vz = (e) => "https://{resourceId_ssa_" + e + "}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", Hz = (e) => "https://{resourceId_ssa_" + e + "}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}", Uz = (e) => "https://{resourceId_ssa_" + e + "}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}", Wz = (e) => "https://{resourceId_ssa_" + e + "}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}", Gz = {
	fn: xz,
	argv: [{ [lz]: pz }, "name"]
}, Kz = { [lz]: "StreamId" }, qz = { [lz]: "Endpoint" }, Jz = { [lz]: "arn_ssa_2" }, Yz = { [lz]: "arnType_ssa_2" }, Xz = { [lz]: "arn_ssa_4" }, Zz = { [lz]: "arnType_ssa_1" }, Qz = { [lz]: "AccountIdEndpointMode" }, $z = { [lz]: "AccountId" }, eB = { [lz]: "arn_ssa_1" }, tB = { [lz]: "arnType_ssa_4" }, nB = { [lz]: "arn_ssa_3" }, rB = { [lz]: "arnType_ssa_3" }, iB = { [lz]: "OperationType" }, aB = { [lz]: pz }, q = {}, oB = { metricValues: ["O"] }, sB = [{ [lz]: "Region" }], cB = [{ [lz]: "StreamARN" }], lB = [{ [lz]: "ConsumerARN" }], uB = [{ [lz]: "ResourceARN" }], dB = [{ [lz]: "ChannelARN" }], fB = {
	conditions: [
		[fz, sB],
		[
			"aws.partition",
			sB,
			pz
		],
		[K, [Gz, "aws-iso-b"]],
		[K, [Gz, "aws-iso"]],
		[fz, [Kz]],
		[
			mz,
			[
				Kz,
				21,
				24,
				uz
			],
			"StreamIdSuffixValue"
		],
		[
			mz,
			[
				Kz,
				0,
				20,
				uz
			],
			"StreamIdPrefixValue"
		],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					Kz,
					20,
					21,
					uz
				]
			}, gz]
		}, _z]],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					Kz,
					3,
					4,
					dz
				]
			}, gz]
		}, _z]],
		[fz, [qz]],
		[fz, cB],
		[fz, lB],
		[
			vz,
			lB,
			yz(2)
		],
		[
			mz,
			[
				qz,
				15,
				20,
				uz
			],
			"HttpsCustomEndpointSuffixValue"
		],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					qz,
					15,
					16,
					uz
				]
			}, gz]
		}, _z]],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					qz,
					20,
					21,
					uz
				]
			}, gz]
		}, "."]],
		[
			mz,
			[
				qz,
				7,
				12,
				uz
			],
			"PlainCustomEndpointSuffixValue"
		],
		[bz, [{
			fn: xz,
			argv: [Jz, Sz]
		}, uz]],
		[bz, [{
			fn: xz,
			argv: [Jz, Cz]
		}, uz]],
		[K, [{
			fn: xz,
			argv: [Jz, wz]
		}, Tz]],
		[
			xz,
			[Jz, Ez],
			Dz(2)
		],
		[K, [Yz, gz]],
		[
			vz,
			cB,
			yz(4)
		],
		[bz, [{
			fn: xz,
			argv: [Xz, Sz]
		}, uz]],
		[K, [Yz, Oz]],
		[bz, [{
			fn: xz,
			argv: [Xz, Cz]
		}, uz]],
		[K, [Gz, {
			fn: xz,
			argv: [Jz, kz]
		}]],
		[K, [{
			fn: xz,
			argv: [Xz, wz]
		}, Tz]],
		[
			xz,
			[Xz, Ez],
			Dz(1)
		],
		[K, [Zz, gz]],
		[fz, uB],
		[fz, dB],
		[fz, [Qz]],
		[fz, [$z]],
		[
			vz,
			dB,
			yz(1)
		],
		[K, [Qz, "disabled"]],
		[bz, [$z, uz]],
		[bz, [{
			fn: xz,
			argv: [eB, Sz]
		}, uz]],
		[bz, [{
			fn: xz,
			argv: [eB, Cz]
		}, uz]],
		[K, [{
			fn: xz,
			argv: [eB, wz]
		}, Tz]],
		[
			xz,
			[eB, Ez],
			Dz(4)
		],
		[K, [tB, gz]],
		[K, [tB, Az]],
		[K, [Gz, {
			fn: xz,
			argv: [eB, kz]
		}]],
		[
			vz,
			uB,
			yz(3)
		],
		[bz, [{
			fn: xz,
			argv: [nB, Sz]
		}, uz]],
		[bz, [{
			fn: xz,
			argv: [nB, Cz]
		}, uz]],
		[K, [{
			fn: xz,
			argv: [nB, wz]
		}, Tz]],
		[
			xz,
			[nB, Ez],
			Dz(3)
		],
		[K, [rB, gz]],
		[K, [rB, Oz]],
		[K, [rB, Az]],
		[K, [Gz, {
			fn: xz,
			argv: [nB, kz]
		}]],
		[K, [Zz, Oz]],
		[K, [Gz, {
			fn: xz,
			argv: [Xz, kz]
		}]],
		[K, [Qz, "required"]],
		[fz, [iB]],
		[
			xz,
			[nB, jz],
			Mz(1)
		],
		[bz, [{ [lz]: Mz(1) }, uz]],
		[
			xz,
			[eB, jz],
			Mz(2)
		],
		[bz, [{ [lz]: Mz(2) }, uz]],
		[K, [iB, "data"]],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					qz,
					7,
					8,
					uz
				]
			}, gz]
		}, _z]],
		[Nz, [{ [lz]: "UseFIPS" }, dz]],
		[Nz, [{ [lz]: "UseDualStack" }, dz]],
		[Nz, [{
			fn: xz,
			argv: [aB, "supportsFIPS"]
		}, dz]],
		[Nz, [{
			fn: xz,
			argv: [aB, "supportsDualStack"]
		}, dz]],
		[K, [Gz, "aws-us-gov"]],
		[K, [{
			fn: hz,
			argv: [{
				fn: mz,
				argv: [
					qz,
					12,
					13,
					uz
				]
			}, gz]
		}, "."]]
	],
	results: [
		[G],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{HttpsCustomEndpointSuffixValue}-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		[G, "DualStack is enabled, but this partition does not support DualStack."],
		[G, "FIPS is enabled, but this partition does not support FIPS."],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{HttpsCustomEndpointSuffixValue}-fips.{Region}.{PartitionResult#dnsSuffix}", q],
		[G, "FIPS is enabled but this partition does not support FIPS"],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{HttpsCustomEndpointSuffixValue}.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		[G, "DualStack is enabled but this partition does not support DualStack"],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{HttpsCustomEndpointSuffixValue}.{Region}.{PartitionResult#dnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{PlainCustomEndpointSuffixValue}-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{PlainCustomEndpointSuffixValue}-fips.{Region}.{PartitionResult#dnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{PlainCustomEndpointSuffixValue}.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis{PlainCustomEndpointSuffixValue}.{Region}.{PartitionResult#dnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		["https://{StreamIdPrefixValue}.{StreamIdSuffixValue}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}", q],
		[G, "Operation Type is not set. Please contact service team for resolution."],
		[Pz(4), q],
		[Fz(4), q],
		[Iz(4), q],
		[Lz(4), q],
		[G, Rz(4)],
		[G, zz(1)],
		[G, "Invalid ARN: No ARN type specified"],
		[G, Bz(4)],
		[G, "Invalid ARN: Invalid region."],
		[G, "Invalid ARN: Invalid account id."],
		[G, "Invalid ARN: Failed to parse ARN."],
		[Pz(2), q],
		[Fz(2), q],
		[Iz(2), q],
		[Lz(2), q],
		[G, Rz(2)],
		[G, zz(2)],
		[G, Bz(2)],
		[G, "Invalid ARN: Unsupported resource type `{arnType_ssa_3}`. Expected: stream or channel"],
		[Pz(3), q],
		[Fz(3), q],
		[Iz(3), q],
		[Lz(3), q],
		[Vz(1), q],
		[Hz(1), q],
		[Uz(1), q],
		[Wz(1), q],
		[G, "Invalid ARN: Invalid channel id."],
		[G, "Invalid ARN: Missing channel id."],
		[G, Rz(3)],
		[G, Bz(3)],
		[Vz(2), q],
		[Hz(2), q],
		[Uz(2), q],
		[Wz(2), q],
		[G, "ChannelARN does not support the `data` operation type."],
		[G, Rz(1)],
		[G, "Invalid ARN: ChannelARN only supports `channel` arn types, found: `{arnType_ssa_4}`."],
		[G, Bz(1)],
		["https://{AccountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", oB],
		["https://{AccountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}", oB],
		["https://{AccountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}", oB],
		["https://{AccountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}", oB],
		[G, "Invalid account id."],
		[G, "AccountIdEndpointMode is required but no AccountID was provided or able to be loaded"],
		[G, "Invalid Configuration: AccountIdEndpointMode is required but account endpoints are not supported in this partition"],
		[G, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[G, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[qz, q],
		["https://kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		[G, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://kinesis.{Region}.amazonaws.com", q],
		["https://kinesis-fips.{Region}.{PartitionResult#dnsSuffix}", q],
		["https://kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}", q],
		["https://kinesis.{Region}.{PartitionResult#dnsSuffix}", q],
		[G, "Invalid Configuration: Missing Region"]
	]
}, pB = 2, mB = new Int32Array([
	-1,
	1,
	-1,
	0,
	3,
	4,
	1,
	5,
	4,
	9,
	154,
	100000073,
	2,
	143,
	6,
	3,
	143,
	7,
	4,
	8,
	12,
	5,
	9,
	12,
	6,
	10,
	12,
	7,
	11,
	12,
	8,
	109,
	12,
	9,
	154,
	13,
	10,
	93,
	14,
	11,
	77,
	15,
	30,
	49,
	16,
	31,
	30,
	17,
	32,
	18,
	146,
	33,
	19,
	29,
	35,
	29,
	20,
	36,
	21,
	100000061,
	56,
	22,
	100000017,
	63,
	25,
	23,
	64,
	24,
	100000060,
	66,
	100000059,
	100000007,
	64,
	27,
	26,
	65,
	100000058,
	100000005,
	65,
	28,
	100000003,
	66,
	100000057,
	100000002,
	55,
	100000062,
	146,
	34,
	31,
	100000028,
	37,
	32,
	100000027,
	38,
	33,
	100000026,
	39,
	34,
	100000056,
	40,
	35,
	100000024,
	41,
	100000024,
	36,
	42,
	37,
	100000055,
	43,
	38,
	100000054,
	56,
	39,
	100000017,
	59,
	40,
	100000046,
	60,
	41,
	100000045,
	61,
	100000053,
	42,
	63,
	45,
	43,
	64,
	44,
	100000052,
	66,
	100000051,
	100000007,
	64,
	47,
	46,
	65,
	100000050,
	100000005,
	65,
	48,
	100000003,
	66,
	100000049,
	100000002,
	44,
	50,
	100000028,
	45,
	51,
	100000027,
	46,
	52,
	100000026,
	47,
	53,
	100000048,
	48,
	54,
	100000024,
	49,
	100000024,
	55,
	50,
	68,
	56,
	51,
	57,
	100000036,
	52,
	58,
	100000047,
	56,
	59,
	100000017,
	57,
	60,
	100000046,
	58,
	61,
	100000045,
	63,
	64,
	62,
	64,
	63,
	100000044,
	66,
	100000043,
	100000007,
	64,
	66,
	65,
	65,
	100000042,
	100000005,
	65,
	67,
	100000003,
	66,
	100000041,
	100000002,
	52,
	69,
	100000047,
	56,
	70,
	100000017,
	63,
	73,
	71,
	64,
	72,
	100000040,
	66,
	100000039,
	100000007,
	64,
	75,
	74,
	65,
	100000038,
	100000005,
	65,
	76,
	100000003,
	66,
	100000037,
	100000002,
	12,
	78,
	100000028,
	17,
	79,
	100000027,
	18,
	80,
	100000026,
	19,
	81,
	100000035,
	20,
	82,
	100000024,
	21,
	100000024,
	83,
	24,
	84,
	100000034,
	26,
	85,
	100000033,
	56,
	86,
	100000017,
	63,
	89,
	87,
	64,
	88,
	100000032,
	66,
	100000031,
	100000007,
	64,
	91,
	90,
	65,
	100000030,
	100000005,
	65,
	92,
	100000003,
	66,
	100000029,
	100000002,
	22,
	94,
	100000028,
	23,
	95,
	100000027,
	25,
	96,
	100000026,
	27,
	97,
	100000025,
	28,
	98,
	100000024,
	29,
	100000024,
	99,
	53,
	100,
	100000023,
	54,
	101,
	100000022,
	56,
	102,
	100000017,
	63,
	105,
	103,
	64,
	104,
	100000021,
	66,
	100000020,
	100000007,
	64,
	107,
	106,
	65,
	100000019,
	100000005,
	65,
	108,
	100000003,
	66,
	100000018,
	100000002,
	9,
	110,
	114,
	13,
	111,
	113,
	14,
	112,
	113,
	15,
	135,
	113,
	16,
	115,
	114,
	56,
	117,
	100000017,
	56,
	116,
	100000017,
	62,
	124,
	117,
	63,
	120,
	118,
	64,
	119,
	100000016,
	66,
	100000015,
	100000007,
	64,
	122,
	121,
	65,
	100000014,
	100000005,
	65,
	123,
	100000003,
	66,
	100000013,
	100000002,
	63,
	129,
	125,
	64,
	127,
	126,
	68,
	100000012,
	100000016,
	66,
	128,
	100000007,
	68,
	100000011,
	100000015,
	64,
	132,
	130,
	65,
	131,
	100000005,
	68,
	100000010,
	100000014,
	65,
	133,
	100000003,
	66,
	134,
	100000002,
	68,
	100000009,
	100000013,
	56,
	136,
	100000017,
	63,
	139,
	137,
	64,
	138,
	100000008,
	66,
	100000006,
	100000007,
	64,
	141,
	140,
	65,
	100000004,
	100000005,
	65,
	142,
	100000003,
	66,
	100000001,
	100000002,
	9,
	154,
	144,
	32,
	145,
	146,
	55,
	100000063,
	146,
	63,
	149,
	147,
	64,
	148,
	100000072,
	66,
	100000071,
	100000007,
	64,
	152,
	150,
	65,
	151,
	100000005,
	67,
	100000069,
	100000070,
	65,
	153,
	100000068,
	66,
	100000067,
	100000068,
	63,
	100000064,
	155,
	64,
	100000065,
	100000066
]), hB = zr.from(mB, pB, fB.conditions, fB.results);
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/endpoint/endpointResolver.js
ea();
var gB = new Vr({
	size: 50,
	params: [
		"AccountId",
		"AccountIdEndpointMode",
		"ChannelARN",
		"ConsumerARN",
		"Endpoint",
		"OperationType",
		"Region",
		"ResourceARN",
		"StreamARN",
		"StreamId",
		"UseDualStack",
		"UseFIPS"
	]
}), _B = (e, t = {}) => gB.get(e, () => Xi(hB, {
	endpointParams: e,
	logger: t.logger
}));
Zr.aws = jl;
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/models/KinesisServiceException.js
var vB = class e extends dt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.kinesis#KinesisServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, yB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#AccessDeniedException";
	name = "AccessDeniedException";
	$fault = "client";
	constructor(t) {
		super({
			name: "AccessDeniedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, bB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#InvalidArgumentException";
	name = "InvalidArgumentException";
	$fault = "client";
	constructor(t) {
		super({
			name: "InvalidArgumentException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, xB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#LimitExceededException";
	name = "LimitExceededException";
	$fault = "client";
	constructor(t) {
		super({
			name: "LimitExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, SB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ResourceInUseException";
	name = "ResourceInUseException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceInUseException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, CB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, wB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSAccessDeniedException";
	name = "KMSAccessDeniedException";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSAccessDeniedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, TB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSDisabledException";
	name = "KMSDisabledException";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSDisabledException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, EB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSInvalidStateException";
	name = "KMSInvalidStateException";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSInvalidStateException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, DB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSNotFoundException";
	name = "KMSNotFoundException";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, OB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSOptInRequired";
	name = "KMSOptInRequired";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSOptInRequired",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, kB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#KMSThrottlingException";
	name = "KMSThrottlingException";
	$fault = "client";
	constructor(t) {
		super({
			name: "KMSThrottlingException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, AB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ValidationException";
	name = "ValidationException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ValidationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, jB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#DryRunOperationException";
	name = "DryRunOperationException";
	$fault = "client";
	constructor(t) {
		super({
			name: "DryRunOperationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, MB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ExpiredIteratorException";
	name = "ExpiredIteratorException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExpiredIteratorException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, NB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ExpiredNextTokenException";
	name = "ExpiredNextTokenException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ExpiredNextTokenException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, PB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#InternalFailureException";
	name = "InternalFailureException";
	$fault = "server";
	constructor(t) {
		super({
			name: "InternalFailureException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
}, FB = class e extends vB {
	static shapeId = "com.amazonaws.kinesis#ProvisionedThroughputExceededException";
	name = "ProvisionedThroughputExceededException";
	$fault = "client";
	constructor(t) {
		super({
			name: "ProvisionedThroughputExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype);
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/schemas/schemas_0.js
_();
var IB = "AccessDeniedException", LB = "ChannelCount", RB = "ConsumerCount", zB = "CurrentMiBps", BB = "DryRunOperationException", VB = "DescribeStreamSummary", HB = "DescribeStreamSummaryInput", UB = "DescribeStreamSummaryOutput", WB = "ExpiredIteratorException", GB = "EnhancedMetrics", KB = "EnhancedMonitoringList", qB = "EnhancedMonitoring", JB = "ExpiredNextTokenException", YB = "EncryptionType", XB = "InvalidArgumentException", ZB = "InternalFailureException", QB = "KeyId", $B = "KMSAccessDeniedException", eV = "KMSDisabledException", tV = "KMSInvalidStateException", nV = "KMSNotFoundException", rV = "KMSOptInRequired", iV = "KMSThrottlingException", aV = "LimitExceededException", oV = "MaxRecordSizeInKiB", sV = "OpenShardCount", cV = "ProvisionedThroughputExceededException", lV = "RecordDistributionStrategy", uV = "ResourceInUseException", dV = "ResourceNotFoundException", fV = "RetentionPeriodHours", pV = "StreamARN", mV = "StreamCreationTimestamp", hV = "StreamDescriptionSummary", gV = "StreamId", _V = "ShardLevelMetrics", vV = "StreamMode", yV = "StreamModeDetails", bV = "StreamName", xV = "StreamStatus", SV = "TargetMiBps", CV = "ValidationException", wV = "WarmThroughput", TV = "WarmThroughputObject", EV = "client", DV = "error", OV = "message", kV = "smithy.ts.sdk.synthetic.com.amazonaws.kinesis", AV = "server", J = "com.amazonaws.kinesis", jV = new it(kV), MV = [
	-3,
	kV,
	"KinesisServiceException",
	0,
	[],
	[]
];
jV.registerError(MV, vB);
var NV = new it(J), PV = [
	-3,
	J,
	IB,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(PV, yB);
var FV = [
	-3,
	J,
	BB,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(FV, jB);
var IV = [
	-3,
	J,
	WB,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(IV, MB);
var LV = [
	-3,
	J,
	JB,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(LV, NB);
var RV = [
	-3,
	J,
	ZB,
	{ [DV]: AV },
	[OV],
	[0]
];
NV.registerError(RV, PB);
var zV = [
	-3,
	J,
	XB,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(zV, bB);
var BV = [
	-3,
	J,
	$B,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(BV, wB);
var VV = [
	-3,
	J,
	eV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(VV, TB);
var HV = [
	-3,
	J,
	tV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(HV, EB);
var UV = [
	-3,
	J,
	nV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(UV, DB);
var WV = [
	-3,
	J,
	rV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(WV, OB);
var GV = [
	-3,
	J,
	iV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(GV, kB);
var KV = [
	-3,
	J,
	aV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(KV, xB);
var qV = [
	-3,
	J,
	cV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(qV, FB);
var JV = [
	-3,
	J,
	uV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(JV, SB);
var YV = [
	-3,
	J,
	dV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(YV, CB);
var XV = [
	-3,
	J,
	CV,
	{ [DV]: EV },
	[OV],
	[0]
];
NV.registerError(XV, AB);
var ZV = [jV, NV], QV = [
	3,
	J,
	HB,
	0,
	[
		bV,
		pV,
		gV
	],
	[
		0,
		0,
		0
	]
], $V = [
	3,
	J,
	UB,
	0,
	[hV],
	[() => tH],
	1
], eH = [
	3,
	J,
	GB,
	0,
	[_V],
	[64]
], tH = [
	3,
	J,
	hV,
	0,
	[
		bV,
		pV,
		xV,
		fV,
		mV,
		qB,
		sV,
		gV,
		yV,
		YB,
		QB,
		RB,
		wV,
		oV,
		LB,
		lV
	],
	[
		0,
		0,
		0,
		1,
		4,
		() => iH,
		1,
		0,
		() => nH,
		0,
		0,
		1,
		() => rH,
		1,
		1,
		0
	],
	7
], nH = [
	3,
	J,
	yV,
	0,
	[vV],
	[0],
	1
], rH = [
	3,
	J,
	TV,
	0,
	[SV, zB],
	[1, 1]
], iH = [
	1,
	J,
	KB,
	0,
	() => eH
], aH = [
	9,
	J,
	VB,
	0,
	() => QV,
	() => $V
];
Qa(), ke(), v();
var oH = (e) => ({
	apiVersion: "2013-12-02",
	base64Decoder: e?.base64Decoder ?? Ot,
	base64Encoder: e?.base64Encoder ?? Mt,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? _B,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? iz,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new Xl()
	}],
	logger: e?.logger ?? new St(),
	protocol: e?.protocol ?? id,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.kinesis",
		errorTypeRegistries: ZV,
		xmlNamespace: "http://kinesis.amazonaws.com/doc/2013-12-02",
		version: "2013-12-02",
		serviceTarget: "Kinesis_20131202"
	},
	serviceId: e?.serviceId ?? "Kinesis",
	sha256: e?.sha256 ?? Xa,
	urlParser: e?.urlParser ?? Oe,
	utf8Decoder: e?.utf8Decoder ?? At,
	utf8Encoder: e?.utf8Encoder ?? It
});
$o(), v(), la();
var sH = (e) => {
	let t = zl(e), n = () => t().then(pt), r = oH(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		accountIdEndpointMode: e?.accountIdEndpointMode ?? (() => Promise.resolve("preferred")),
		bodyLengthChecker: e?.bodyLengthChecker ?? or,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Tl({
			serviceId: r.serviceId,
			clientVersion: cz.version
		}),
		eventStreamSerdeProvider: e?.eventStreamSerdeProvider ?? Ko,
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? Ne("Region is missing"),
		requestHandler: $u.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || jc),
		streamCollector: e?.streamCollector ?? ca,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, cH = (e) => {
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
}, lH = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), uH = (e, t) => {
	let n = Object.assign(Vl(e), yt(e), cs(e), cH(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Hl(n), bt(n), ls(n), lH(n));
};
ea(), $o(), _();
var dH = class extends Pe {
	config;
	constructor(...[e]) {
		let t = sH(e || {});
		super(t), this.initConfig = t;
		let n = Rc(Ll(Fc(cl(nO(oz(t)))))), r = Qi(n), i = uH(az(Jo(r)), e?.extensions || []);
		this.config = i, this.middlewareStack.use(We(this.config)), this.middlewareStack.use(wl(this.config)), this.middlewareStack.use(Ic(this.config)), this.middlewareStack.use(ps(this.config)), this.middlewareStack.use(Vc(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Gc(this.config)), this.middlewareStack.use(Xc(this.config, {
			httpAuthSchemeParametersProvider: nz,
			identityProviderConfigProvider: async (e) => new rl({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(tl(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-kinesis@3.1156.0/node_modules/@aws-sdk/client-kinesis/dist-es/commandBuilder.js
ea();
var fH = Ct(sz, "Kinesis_20131202", "KinesisClient", $i), pH = {
	OperationType: {
		type: "staticContextParams",
		value: "control"
	},
	StreamId: {
		type: "contextParams",
		name: "StreamId"
	},
	StreamARN: {
		type: "contextParams",
		name: "StreamARN"
	}
}, mH = (e, t, n, r) => [], hH = class extends fH(pH, mH, "DescribeStreamSummary", aH) {}, gH = class extends Error {
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
}, _H = Symbol(), vH = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), yH = 1e4, bH = (e) => "headers" in e, xH = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (bH(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? SH(e, {
		all: n,
		dot: r
	}) : {};
};
async function SH(e, t) {
	if (!bH(e) && e.bodyCache.formData) return CH(await e.bodyCache.formData, t);
	let n = bH(e) ? e.headers : e.raw.headers, r = vH(await e.arrayBuffer(), n.get("Content-Type") || "");
	bH(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? CH(i, t) : {};
}
function CH(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? wH(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (TH(n, e, t, r), delete n[e]);
	}), n;
}
var wH = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, TH = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && EH(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= yH && EH(), i[e] = Object.create(null)), i = i[e]);
	});
}, EH = () => {
	throw Error("Nesting limit exceeded");
}, DH = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, OH = (e) => {
	let { groups: t, path: n } = kH(e);
	return AH(DH(n), t);
}, kH = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, AH = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, jH = {}, MH = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return jH[r] || (jH[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), jH[r];
	}
	return null;
}, NH = (e, t) => {
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
}, PH = (e) => NH(e, decodeURI), FH = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return PH(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, IH = (e) => {
	let t = FH(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, LH = (e, t, ...n) => (n.length && (t = LH(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), RH = (e) => {
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
}, zH = (e) => e.indexOf("%") === -1 ? e : NH(e, WH), BH = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), zH(e)), VH = (e, t, n) => {
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
					return BH(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = BH(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = BH(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, HH = VH, UH = (e, t) => VH(e, t, !0), WH = decodeURIComponent, GH = class {
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
		return n && zH(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = zH(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return HH(this.url, e);
	}
	queries(e) {
		return UH(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return xH(this, e);
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
	get [_H]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, KH = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, qH = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, JH = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => JH(e, t, !1, r, i))).then(() => i[0]));
	return n ? qH(await o, a) : o;
}, YH = "text/plain; charset=UTF-8", XH = (e, t) => ({
	"Content-Type": e,
	...t
}), ZH = (e, t) => new Response(e, t), QH = class {
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
		return this.#t ??= new GH(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= ZH(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = ZH(e.body, e);
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
		this.finalized && (this.#a = ZH(this.#a.body, this.#a));
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
		return ZH(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, XH(YH, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, XH("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, XH("text/html; charset=UTF-8", n));
		return typeof e == "object" ? JH(e, KH.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => ZH(), this.#c(this));
}, $H = (e, t, n) => (r, i) => {
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
}, eU = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], tU = "Can not add a route since the matcher is already built.", nU = class extends Error {}, rU = "__COMPOSED_HANDLER", iU = (e) => e.text("404 Not Found", 404), aU = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, oU = class e {
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
		[...eU, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? FH : IH;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = iU;
	errorHandler = aU;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === aU ? r = e.handler : (r = async (n, r) => (await $H([], t.errorHandler)(n, () => e.handler(n, r))).res, r[rU] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = LH(this._basePath, e), t;
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
			let t = LH(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", LH(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = LH(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : LH(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new QH(e, {
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
		let s = $H(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${LH("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, sU = () => Object.create(null), cU = [];
function lU(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], cU];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var uU = "[^/]+", dU = "(?:|/.*)", fU = Symbol(), pU = /* @__PURE__ */ new Set(".\\+*[^]$()");
function mU(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var hU = class e {
	#e;
	#t;
	#n = sU();
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
				uU
			] : null : s === "/*" ? [
				"",
				"",
				dU
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && pU.has(n))) throw fU;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw fU;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw fU;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw fU;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(mU).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : pU.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, gU = class {
	#e = { varIndex: 0 };
	#t = new hU();
	#n = 0;
	paths = sU();
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
}, _U = sU();
function vU(e) {
	return _U[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? dU : e === "*" ? ".*" : `/:${uU}`)}$`);
}
function yU(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (vU(n).test(t)) return [...e[n]];
}
var bU = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: sU() }, this.#t = { ALL: sU() }, this.#n = { ALL: new gU() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === fU ? new nU(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(tU);
		if (!r[e]) {
			this.#n[e] = new gU();
			for (let t of [r, i]) {
				t[e] = sU();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = vU(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = yU(r[e], t) || yU(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = RH(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = yU(r[t], e) || yU(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = lU;
	buildAllMatchers() {
		let e = sU();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, _U = sU(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = sU(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), sU())]) : i[t] = [n.map(([e]) => [e, sU()]), cU];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, xU = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(tU);
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
				if (e instanceof nU) continue;
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
}, SU = sU(), CU = 0, wU = class e {
	#e = [];
	#t = sU();
	#n = [];
	#r;
	#i = SU;
	insert(t, n, r) {
		let i = this, a = OH(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = MH(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++CU
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = sU(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = SU;
		let r = [this], i = DH(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === SU ? {} : { ...p.#i };
					if (typeof f == "string") {
						(f === "*" || l.startsWith(f.slice(0, -1))) && (this.#a(n, r, e, p.#i), f === "*" && (r.#i = m, d.push(r)));
						continue;
					}
					let [, ee, te] = f;
					if (l || te !== !0) {
						if (te !== !0) {
							if (!s) {
								s = [];
								let e = +(t[0] === "/");
								for (let t = 0; t < o; t++) s[t] = e, e += i[t].length + 1;
							}
							let l = t.slice(s[c]), u = te.exec(l);
							if (u) {
								Object.hasOwn(m, ee) || (m[ee] = u[0]), this.#a(n, r, e, p.#i, m), u[0].length === l.length && r.#t["*"] && this.#a(n, r.#t["*"], e, p.#i, m);
								for (let e in r.#t) {
									r.#i = m;
									let e = u[0].match(/\//g)?.length ?? 0;
									(a[e] ||= []).push(r);
									break;
								}
								continue;
							}
						}
						(te === !0 || te.test(l)) && (Object.hasOwn(m, ee) || (m[ee] = l), u ? (this.#a(n, r, e, m, p.#i), r.#t["*"] && this.#a(n, r.#t["*"], e, m, p.#i)) : (r.#i = m, d.push(r)));
					}
				}
			}
			let f = a.shift();
			r = f ? d.concat(f) : d;
		}
		return n[1] && n.sort((e, t) => e.score - t.score), [n.map(({ handler: e, params: t }) => [e, t])];
	}
}, TU = class {
	name = "TrieRouter";
	#e = new wU();
	add(e, t, n) {
		for (let r of RH(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, EU = class extends oU {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new xU({ routers: [new bU(), new TU()] });
	}
}, DU = [
	"start",
	"stop",
	"reboot"
], OU = class extends Error {
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
}, Y = class extends OU {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, kU = class extends OU {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, X = class extends OU {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, AU = class extends OU {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, jU = class extends OU {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, Z = class extends OU {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, MU = class extends OU {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, NU = class extends OU {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, PU = class extends OU {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, FU = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function IU(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && FU.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function LU(e, t) {
	let n = RU(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function RU(e, t) {
	if (e instanceof OU) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return IU(e) ? new NU(r, { cause: e }) : new PU(r, { cause: e });
}
var zU = 1e3, BU = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function VU(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Y("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new Y("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new Y("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new Y("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = HU(r)), a;
}
function HU(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Y("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!BU.includes(t)) throw new Y(`sortKey.operator must be one of ${BU.join(", ")}.`);
	if (typeof n != "string" || !n) throw new Y("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new Y("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new Y("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function UU(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new Y(`limit must be a whole number between 1 and ${zU}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new Y(`limit must be between 1 and ${zU}.`);
	return t;
}
// src/cloud-spi/serviceCatalog.ts
var WU = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], GU = {
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
}, KU = Object.keys(GU).map((e) => ({
	service: e,
	...GU[e]
})).sort(ZU);
KU.map((e) => e.service);
function qU(e) {
	return Object.hasOwn(GU, e);
}
function JU(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function YU(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function XU(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function ZU(e, t) {
	let n = WU.indexOf(e.group) - WU.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var QU = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function $U(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${QU[t]}/${n}/` : void 0;
}
// src/adapter-aws/awsErrors.ts
var eW = /* @__PURE__ */ new Set([
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
]), tW = /* @__PURE__ */ new Set([
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
]), nW = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), rW = /* @__PURE__ */ new Set([
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
]), iW = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), aW = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), oW = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function sW(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function cW(e) {
	if (!sW(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || eW.has(n)) return new jU(r, i);
	if (tW.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new AU(r, i);
	if (nW.has(n)) return new kU(r, i);
	if (rW.has(n)) return new Y(r, i);
	if (iW.has(n) || /\.NotFound$/.test(n)) return new X(r, i);
	if (aW.has(n)) return new MU(r, i);
	if (oW.has(n) || IU(e)) return new NU(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new Y(r, i) : a === 401 || a === 403 ? new kU(r, i) : a === 404 ? new X(r, i) : a === 409 ? new AU(r, i) : a === 429 ? new jU(r, i) : a === 501 ? new MU(r, i) : a === 503 || a === 504 ? new NU(r, i) : new PU(r, i);
}
// browser-bundle/cloudproxy-stub.ts
function lW() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// src/service/deadline.ts
async function uW(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// src/service/defaultCloud.ts
var dW = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, fW = !1;
function pW(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = mW(t);
	return !n && !fW && (fW = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function mW(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(dW, t) ? dW[t] : null;
}
var hW = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), gW = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), _W = 5464, vW = 8192, yW = 50, bW = 12e4;
function xW(e, t = lW) {
	let n = new EU();
	n.onError((e, t) => {
		if (e instanceof OU) {
			let { status: n, body: r } = LU(e);
			return t.json(r, n);
		}
		return e instanceof gH ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : pW();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && Q(n) && n !== i) throw new X("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new X("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return zW(e, 150), $(e, () => uW(bW, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: VW(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!Q(n)) throw new X("Unknown cloud");
		return n === "aws" ? $(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new Y("queryString must be a string.");
			if (typeof t.startTime != "number") throw new Y("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new Y("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new Y("limit must be a number.");
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
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new Y("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > yW) throw new Y(`logGroupNames must include at most ${yW} log groups.`);
			if (typeof n.queryString != "string") throw new Y("queryString must be a string.");
			if (typeof n.startTime != "number") throw new Y("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new Y("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new Y("limit must be a number.");
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
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
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
		if (!Q(t) || n === null) throw new X("Unknown cloud or version");
		return $(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new X("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!Q(t) || n === null) throw new X("Unknown cloud or version");
		return $(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!Q(t) || !Number.isInteger(n) || n <= 0) throw new X("Unknown cloud or deployment");
		return $(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new X("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), LW(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), LW(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", RW(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), LW(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", RW(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = IW(e);
		if (!t) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), VU(n), RW(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new X("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new Y("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return $(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new Y("Object key is required");
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
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new Y("Object key is required");
		return $(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new Y("srcKey and destKey are required");
		return $(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await OW(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new Y("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new Y("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new Y("maxMessages must be an integer between 1 and 10");
		return $(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = TW((await OW(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = EW(e.req.query());
		return $(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new Y("receiptHandle is required");
		return $(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return BW(e, async () => {
			let n = await AW(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: FW(n.plaintextBase64, "plaintextBase64", _W),
				encryptionAlgorithm: jW(n.encryptionAlgorithm),
				encryptionContext: PW(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return BW(e, async () => {
			let n = await AW(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: FW(n.ciphertextBlobBase64, "ciphertextBlobBase64", vW),
				encryptionAlgorithm: jW(n.encryptionAlgorithm),
				encryptionContext: PW(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of DU) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!Q(n)) throw new X("Unknown cloud");
		return $(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return BW(e, async () => {
			let n = await AW(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: FW(n.messageBase64, "messageBase64", _W),
				signingAlgorithm: MW(n.signingAlgorithm)
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
		if (!Q(t)) throw new X("Unknown cloud");
		return BW(e, async () => {
			let n = await AW(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: FW(n.messageBase64, "messageBase64", _W),
				signature: FW(n.signatureBase64, "signatureBase64", vW),
				keyVersionId: NW(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: MW(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!Q(t)) throw new X("Unknown cloud");
		return $(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await OW(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => {
			let i = DW(await OW(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Q(t) || !qU(n)) throw new X("Unknown cloud or service");
		return $(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function Q(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var SW = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], CW = 100, wW = 100;
function TW(e) {
	if (!Array.isArray(e) || e.length === 0) throw new Y("messages must contain at least one entry");
	if (e.length > wW) throw new Y(`messages must contain at most ${wW} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new Y("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new Y("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function EW(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new Y("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!SW.includes(n)) throw new Y(`cursorType must be one of ${SW.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new Y("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new Y("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > CW) throw new Y(`limit must be an integer between 1 and ${CW}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function DW(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new Y(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function OW(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new Y("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof Y ? e : new Y("Request body must be valid JSON");
	}
}
var kW = class extends Y {};
async function AW(e) {
	try {
		return await OW(e);
	} catch (e) {
		throw e instanceof Y ? new kW(e.message) : e;
	}
}
function jW(e) {
	if (typeof e != "string" || !hW.has(e)) throw new kW("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function MW(e) {
	if (typeof e != "string" || !gW.has(e)) throw new kW("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function NW(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new kW(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function PW(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new kW("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new kW("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function FW(e, t, n) {
	if (typeof e != "string") throw new kW(`${t} must be a base64 string`);
	if (e.length > n) throw new kW(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new kW(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new kW(`${t} must be canonical base64`);
	return r;
}
function IW(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !Q(t) || !qU(n) ? null : {
		cloud: t,
		service: n
	};
}
function LW(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: UU(e.req.query("limit"))
	};
}
function RW(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new Y("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new Y("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: UU(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function zW(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function $(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = LU(t, cW);
		return e.json(r, n);
	}
}
async function BW(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = LU(t, cW);
		if (t instanceof kW) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function VW(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
xW();
// src/registry/CloudAdapterRegistry.ts
var HW = class {
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
}, UW = async () => {}, WW = {
	aws: UW,
	azure: UW,
	gcp: UW,
	oci: UW
};
function GW() {
	return null;
}
// src/service/CloudProxyService.ts
var KW = 5e3, qW = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = WW, n = pW(), r = null) {
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
		return Promise.all(KU.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? JU(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: YU(t, e),
				docsUrl: $U(t, e),
				availability: a,
				reason: r.reason ?? JW(a, e, o),
				route: XU(t, e),
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
			endpoint: GW(e),
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
		if (r && Date.now() - r.at < KW) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = GW(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = LU(r, cW);
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
		if (t && Date.now() - t.at < KW) return t.value;
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
		if (!i.update) throw new Z(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new Z(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new Z(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new Z(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new Z(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new X(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new Z(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new Z(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new Z(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new Z(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new Z(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new Z(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new Z(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new Z(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new Z(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new Z(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new Z(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new Z(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new Z(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new Z(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new Z(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new Z(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new Z(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new Z(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new Z(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = YW(e, t);
		if (this.emptying.has(a)) throw new AU(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new AU(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = YW(e, t);
		if (this.emptying.has(r)) throw new AU(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
		if (!i.listObjects) throw new Z(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new Z(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new Z(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new Z(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new Z(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new Z(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new Z(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new Z(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new Z(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new Z(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new Z(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new Z(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new Z(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new Z(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new Z(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new Z(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new Z(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new Z(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new Z(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new Z(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new Z(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new Z(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new Z(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new Z(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new Z(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new Z(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new Z(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new Z(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new Z(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new Z(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new Z(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new Z(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new Z(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new Z(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new Z(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new Z(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new Z(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new Z(`AppConfig resources are not supported for ${e}/configuration`);
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
		if (!n.listLambdaTriggers) throw new Z(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new Z(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new Z(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new Z(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function JW(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function YW(e, t) {
	return JSON.stringify([e, t]);
}
// src/cloud-spi/serverlessSchema.ts
var XW = [
	{
		name: "name",
		label: "Function Name"
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
		name: "runtime",
		label: "Runtime",
		path: "metadata.runtime"
	},
	{
		name: "status",
		label: "Status"
	},
	{
		name: "updatedAt",
		label: "Last Updated",
		path: "metadata.lastModified",
		format: "datetime"
	}
];
function ZW(e) {
	return [
		{
			name: "list",
			label: "List functions",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "create",
			label: "Create function",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "delete",
			label: "Delete function",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "inspect",
			label: "Inspect function",
			enabled: !0,
			status: "available",
			runtimeRequired: !1
		},
		e
	];
}
var QW = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}, {
	name: "runtime",
	label: "Runtime",
	type: "text",
	required: !1
}];
function $W() {
	return {
		cloud: "aws",
		service: "serverless",
		displayName: "AWS Lambda",
		fields: [
			{
				name: "functionName",
				label: "Function Name",
				type: "text",
				required: !0,
				description: "Unique Lambda function name."
			},
			{
				name: "runtime",
				label: "Runtime",
				type: "select",
				required: !0,
				options: [
					{
						label: "Node.js 20.x",
						value: "nodejs20.x"
					},
					{
						label: "Node.js 18.x",
						value: "nodejs18.x"
					},
					{
						label: "Python 3.12",
						value: "python3.12"
					},
					{
						label: "Python 3.11",
						value: "python3.11"
					}
				]
			},
			{
				name: "handler",
				label: "Handler",
				type: "text",
				required: !0,
				description: "Example: index.handler"
			},
			{
				name: "role",
				label: "Execution Role ARN",
				type: "text",
				required: !0,
				description: "IAM role ARN used by the Lambda function."
			},
			{
				name: "memorySize",
				label: "Memory Size",
				type: "text",
				required: !1,
				description: "Memory in MB. Default: 128."
			},
			{
				name: "timeout",
				label: "Timeout",
				type: "text",
				required: !1,
				description: "Timeout in seconds. Default: 3."
			},
			{
				name: "description",
				label: "Description",
				type: "text",
				required: !1
			},
			{
				name: "code",
				label: "Inline Code",
				type: "text",
				required: !1,
				description: "Optional inline starter code. ZIP upload will come in a later PR.",
				span: !0
			}
		],
		actions: [
			"list",
			"create",
			"inspect",
			"delete"
		],
		filters: QW,
		columns: XW,
		capabilities: { resourceActions: ZW({
			name: "invoke",
			label: "Invoke function",
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		}) }
	};
}
// src/adapter-aws/zipArchive.ts
var eG = tG();
function tG() {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t += 1) {
		let n = t;
		for (let e = 0; e < 8; e += 1) n = n & 1 ? 3988292384 ^ n >>> 1 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
}
function nG(e) {
	let t = 4294967295;
	for (let n of e) t = eG[(t ^ n) & 255] ^ t >>> 8;
	return (t ^ 4294967295) >>> 0;
}
function rG(e) {
	let t = new TextEncoder(), n = [], r = [], i = 0, a = 0;
	for (let o of e) {
		let e = t.encode(o.name), s = typeof o.content == "string" ? t.encode(o.content) : o.content, c = nG(s), l = new Uint8Array(30 + e.length), u = new DataView(l.buffer);
		u.setUint32(0, 67324752, !0), u.setUint16(4, 20, !0), u.setUint16(6, 0, !0), u.setUint16(8, 0, !0), u.setUint16(10, 0, !0), u.setUint16(12, 33, !0), u.setUint32(14, c, !0), u.setUint32(18, s.length, !0), u.setUint32(22, s.length, !0), u.setUint16(26, e.length, !0), u.setUint16(28, 0, !0), l.set(e, 30);
		let d = new Uint8Array(46 + e.length), f = new DataView(d.buffer);
		f.setUint32(0, 33639248, !0), f.setUint16(4, 20, !0), f.setUint16(6, 20, !0), f.setUint16(8, 0, !0), f.setUint16(10, 0, !0), f.setUint16(12, 0, !0), f.setUint16(14, 33, !0), f.setUint32(16, c, !0), f.setUint32(20, s.length, !0), f.setUint32(24, s.length, !0), f.setUint16(28, e.length, !0), f.setUint16(30, 0, !0), f.setUint16(32, 0, !0), f.setUint16(34, 0, !0), f.setUint16(36, 0, !0), f.setUint32(38, 33188 << 16, !0), f.setUint32(42, i, !0), d.set(e, 46), n.push(l, s), r.push(d), i += l.length + s.length, a += l.length + s.length;
	}
	let o = r.reduce((e, t) => e + t.length, 0), s = /* @__PURE__ */ new Uint8Array(22), c = new DataView(s.buffer);
	return c.setUint32(0, 101010256, !0), c.setUint16(4, 0, !0), c.setUint16(6, 0, !0), c.setUint16(8, e.length, !0), c.setUint16(10, e.length, !0), c.setUint32(12, o, !0), c.setUint32(16, a, !0), c.setUint16(20, 0, !0), iG([
		...n,
		...r,
		s
	]);
}
function iG(e) {
	let t = e.reduce((e, t) => e + t.length, 0), n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
function aG(e, t) {
	return `${e.split(".").slice(0, -1).join(".") || "index"}.${t.startsWith("python") ? "py" : t.startsWith("ruby") ? "rb" : "js"}`;
}
// src/adapter-aws/AwsServerlessAdapter.ts
var oG = class {
	lambda;
	s3;
	dynamodb;
	sqs;
	kinesis;
	cloud = "aws";
	service = "serverless";
	constructor(e = void 0, t = void 0, n = void 0, r = void 0, i = void 0) {
		this.lambda = e, this.s3 = t, this.dynamodb = n, this.sqs = r, this.kinesis = i;
	}
	schema() {
		return $W();
	}
	async list(e = {}) {
		return dG(uG(((await this.lambda.send(new Ax({}))).Functions ?? []).map((e) => ({
			id: e.FunctionName ?? e.FunctionArn ?? "",
			name: e.FunctionName ?? "",
			cloud: "aws",
			service: "serverless",
			type: "lambda",
			region: lG(e.FunctionArn),
			createdAt: null,
			status: e.State ?? null,
			metadata: {
				arn: e.FunctionArn,
				runtime: e.Runtime,
				handler: e.Handler,
				lastModified: e.LastModified,
				memorySize: e.MemorySize,
				timeout: e.Timeout,
				codeSize: e.CodeSize,
				packageType: e.PackageType,
				description: e.Description
			}
		})), e.search), e.filters?.runtime);
	}
	async get(e) {
		try {
			let t = (await this.lambda.send(new Dx({ FunctionName: e }))).Configuration;
			return t ? {
				id: t.FunctionName ?? t.FunctionArn ?? e,
				name: t.FunctionName ?? e,
				cloud: "aws",
				service: "serverless",
				type: "lambda",
				region: lG(t.FunctionArn),
				createdAt: null,
				status: t.State ?? null,
				metadata: {
					arn: t.FunctionArn,
					runtime: t.Runtime,
					handler: t.Handler,
					lastModified: t.LastModified,
					memorySize: t.MemorySize,
					timeout: t.Timeout,
					codeSize: t.CodeSize,
					packageType: t.PackageType,
					description: t.Description,
					role: t.Role,
					version: t.Version,
					codeSha256: t.CodeSha256,
					environment: t.Environment?.Variables
				}
			} : null;
		} catch (e) {
			if (fG(e, 404)) return null;
			throw e;
		}
	}
	async create(e) {
		let t = e.values, n = String(t.functionName ?? t.name ?? "").trim(), r = String(t.runtime ?? "").trim(), i = String(t.handler ?? "").trim(), a = String(t.role ?? "").trim(), o = String(t.description ?? "").trim(), s = Number(t.memorySize ?? 128), c = Number(t.timeout ?? 3), l = String(t.code ?? "").trim() || "exports.handler = async (event) => {\n  return {\n    statusCode: 200,\n    body: JSON.stringify({\n      message: \"Hello from Floci Cloud Explorer\",\n      event\n    })\n  };\n};";
		if (!n) throw new Y("functionName is required");
		if (!r) throw new Y("runtime is required");
		if (!i) throw new Y("handler is required");
		if (!a) throw new Y("role is required");
		let u = await this.lambda.send(new Cx({
			FunctionName: n,
			Runtime: r,
			Handler: i,
			Role: a,
			Description: o || void 0,
			MemorySize: Number.isFinite(s) ? s : 128,
			Timeout: Number.isFinite(c) ? c : 3,
			Code: { ZipFile: rG([{
				name: aG(i, r),
				content: l
			}]) }
		}));
		return {
			id: u.FunctionName ?? u.FunctionArn ?? n,
			name: u.FunctionName ?? n,
			cloud: "aws",
			service: "serverless",
			type: "lambda",
			region: lG(u.FunctionArn),
			createdAt: null,
			status: u.State ?? null,
			metadata: {
				arn: u.FunctionArn,
				runtime: u.Runtime,
				handler: u.Handler,
				lastModified: u.LastModified,
				memorySize: u.MemorySize,
				timeout: u.Timeout,
				codeSize: u.CodeSize,
				packageType: u.PackageType,
				description: u.Description,
				role: u.Role,
				version: u.Version,
				codeSha256: u.CodeSha256
			}
		};
	}
	async delete(e) {
		await this.lambda.send(new Tx({ FunctionName: e }));
	}
	async invoke(e, t) {
		let n = performance.now(), r = await this.lambda.send(new Ox({
			FunctionName: e,
			Payload: new TextEncoder().encode(t || "{}"),
			LogType: "Tail"
		})), i = Math.round(performance.now() - n);
		return {
			statusCode: r.StatusCode ?? 0,
			payload: sG(r.Payload),
			...r.FunctionError ? { functionError: r.FunctionError } : {},
			...r.LogResult ? { logResult: cG(r.LogResult) } : {},
			executionDuration: i
		};
	}
	async listLambdaTriggers(e) {
		let t = [], n = (await this.get(e))?.metadata?.arn || "", r;
		do {
			let n = await this.lambda.send(new kx({
				FunctionName: e,
				Marker: r
			}));
			for (let e of n.EventSourceMappings ?? []) {
				let n = e.EventSourceArn ?? "", r = "dynamodb", i = n;
				n.includes(":dynamodb:") || n.includes(":table/") ? (r = "dynamodb", i = n.split(":table/")[1]?.split("/")[0] ?? n) : n.includes(":sqs:") ? (r = "sqs", i = n.split(":").pop() ?? n) : n.includes(":kinesis:") && (r = "kinesis", i = n.split(":stream/")[1] ?? n), t.push({
					id: e.UUID ?? "",
					type: r,
					sourceArn: n,
					sourceName: i,
					status: e.State ?? "Enabled",
					createdAt: e.LastModified ? typeof e.LastModified == "number" ? (/* @__PURE__ */ new Date(e.LastModified * 1e3)).toISOString() : new Date(e.LastModified).toISOString() : null,
					details: {
						batchSize: e.BatchSize,
						startingPosition: e.StartingPosition,
						filterCriteria: e.FilterCriteria?.Filters ? { filters: e.FilterCriteria.Filters } : void 0
					}
				});
			}
			r = n.NextMarker;
		} while (r);
		let i = await this.s3.send(new QD({}));
		for (let r of i.Buckets ?? []) if (r.Name) try {
			let i = await this.s3.send(new ZD({ Bucket: r.Name }));
			for (let [a, o] of (i.LambdaFunctionConfigurations ?? []).entries()) {
				let i = o.LambdaFunctionArn ?? "";
				if (n && i === n || i.endsWith(`:${e}`) || i === e) {
					let e = o.Filter?.Key?.FilterRules?.find((e) => e.Name?.toLowerCase() === "prefix")?.Value, n = o.Filter?.Key?.FilterRules?.find((e) => e.Name?.toLowerCase() === "suffix")?.Value;
					t.push({
						id: o.Id ?? `${r.Name}-${a}`,
						type: "s3",
						sourceArn: `arn:aws:s3:::${r.Name}`,
						sourceName: r.Name,
						status: "Active",
						createdAt: r.CreationDate ? new Date(r.CreationDate).toISOString() : null,
						details: {
							events: o.Events ? [...o.Events] : ["s3:ObjectCreated:*"],
							prefix: e,
							suffix: n
						}
					});
				}
			}
		} catch (e) {
			!fG(e, 403) && fG(e, 404);
		}
		return t;
	}
	async createLambdaTrigger(e, t) {
		if (!t.type) throw new Y("Trigger type is required");
		if (t.type === "s3") {
			let n = String(t.bucketName ?? "").trim();
			if (!n) throw new Y("bucketName is required for S3 trigger");
			let r = await this.get(e);
			if (!r) throw new X(`Function ${e} not found`);
			let i = r?.metadata?.arn || `arn:aws:lambda:us-east-1:000000000000:function:${e}`, a = `s3-trigger-${e}-${n}`;
			try {
				await this.lambda.send(new xx({
					FunctionName: e,
					StatementId: a,
					Action: "lambda:InvokeFunction",
					Principal: "s3.amazonaws.com",
					SourceArn: `arn:aws:s3:::${n}`
				}));
			} catch {}
			let o = await this.s3.send(new ZD({ Bucket: n })), s = [...o.LambdaFunctionConfigurations ?? []], c = `lambda-trigger-${Date.now()}`, l = [];
			return t.prefix && l.push({
				Name: "prefix",
				Value: t.prefix
			}), t.suffix && l.push({
				Name: "suffix",
				Value: t.suffix
			}), s.push({
				Id: c,
				LambdaFunctionArn: i,
				Events: t.events && t.events.length > 0 ? t.events : ["s3:ObjectCreated:*"],
				Filter: l.length > 0 ? { Key: { FilterRules: l } } : void 0
			}), await this.s3.send(new $D({
				Bucket: n,
				NotificationConfiguration: {
					...o,
					LambdaFunctionConfigurations: s
				}
			})), {
				id: c,
				type: "s3",
				sourceArn: `arn:aws:s3:::${n}`,
				sourceName: n,
				status: "Active",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				details: {
					events: t.events && t.events.length > 0 ? t.events : ["s3:ObjectCreated:*"],
					prefix: t.prefix,
					suffix: t.suffix
				}
			};
		}
		if (t.type === "dynamodb") {
			let n = String(t.tableName ?? "").trim();
			if (!n) throw new Y("tableName is required for DynamoDB trigger");
			let r = "", i = n;
			if (n.startsWith("arn:aws:dynamodb:") && n.includes("/stream/") ? (r = n, i = n.split(":table/")[1]?.split("/")[0] ?? n) : (i = n, r = (await this.dynamodb.send(new cI({ TableName: n }))).Table?.LatestStreamArn ?? "", r ||= (await this.dynamodb.send(new lI({
				TableName: n,
				StreamSpecification: {
					StreamEnabled: !0,
					StreamViewType: "NEW_AND_OLD_IMAGES"
				}
			})), (await this.dynamodb.send(new cI({ TableName: n }))).Table?.LatestStreamArn ?? "")), !r) throw new Y(`DynamoDB stream is not enabled or stream ARN could not be resolved for table: ${n}`);
			let a = await this.lambda.send(new Sx({
				FunctionName: e,
				EventSourceArn: r,
				BatchSize: Number.isFinite(t.batchSize) ? t.batchSize : 100,
				StartingPosition: t.startingPosition ?? "LATEST",
				Enabled: t.enabled ?? !0
			}));
			return {
				id: a.UUID ?? "",
				type: "dynamodb",
				sourceArn: r,
				sourceName: i,
				status: a.State ?? "Enabled",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				details: {
					batchSize: a.BatchSize ?? t.batchSize ?? 100,
					startingPosition: a.StartingPosition ?? t.startingPosition ?? "LATEST"
				}
			};
		}
		if (t.type === "sqs") {
			let n = String(t.queueNameOrUrl ?? "").trim();
			if (!n) throw new Y("queueNameOrUrl is required for SQS trigger");
			let r = "", i = n;
			if (n.startsWith("arn:aws:sqs:")) r = n, i = n.split(":").pop() ?? n;
			else if (n.startsWith("http://") || n.startsWith("https://")) i = n.split("/").pop() ?? n, r = (await this.sqs.send(new ez({
				QueueUrl: n,
				AttributeNames: ["QueueArn"]
			}))).Attributes?.QueueArn ?? "";
			else {
				i = n;
				let e = await this.sqs.send(new tz({ QueueName: n }));
				if (!e.QueueUrl) throw new Y(`Failed to resolve QueueUrl for queue: ${n}`);
				r = (await this.sqs.send(new ez({
					QueueUrl: e.QueueUrl,
					AttributeNames: ["QueueArn"]
				}))).Attributes?.QueueArn ?? "";
			}
			if (!r) throw new Y(`Failed to resolve QueueArn for queue: ${n}`);
			let a = await this.lambda.send(new Sx({
				FunctionName: e,
				EventSourceArn: r,
				BatchSize: Number.isFinite(t.batchSize) ? t.batchSize : 10,
				Enabled: t.enabled ?? !0
			}));
			return {
				id: a.UUID ?? "",
				type: "sqs",
				sourceArn: r,
				sourceName: i,
				status: a.State ?? "Enabled",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				details: { batchSize: a.BatchSize ?? t.batchSize ?? 10 }
			};
		}
		if (t.type === "kinesis") {
			let n = String(t.streamName ?? "").trim();
			if (!n) throw new Y("streamName is required for Kinesis trigger");
			let r = "", i = n;
			if (n.startsWith("arn:aws:kinesis:") ? (r = n, i = n.split(":stream/")[1] ?? n) : (i = n, r = (await this.kinesis.send(new hH({ StreamName: i }))).StreamDescriptionSummary?.StreamARN ?? ""), !r) throw new Y(`Failed to resolve Kinesis Stream ARN for stream: ${n}`);
			let a = await this.lambda.send(new Sx({
				FunctionName: e,
				EventSourceArn: r,
				BatchSize: Number.isFinite(t.batchSize) ? t.batchSize : 100,
				StartingPosition: t.startingPosition ?? "LATEST",
				Enabled: t.enabled ?? !0
			}));
			return {
				id: a.UUID ?? "",
				type: "kinesis",
				sourceArn: r,
				sourceName: i,
				status: a.State ?? "Enabled",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				details: {
					batchSize: a.BatchSize ?? t.batchSize ?? 100,
					startingPosition: a.StartingPosition ?? t.startingPosition ?? "LATEST"
				}
			};
		}
		throw new Y(`Unsupported trigger type: ${t.type}`);
	}
	async deleteLambdaTrigger(e, t, n) {
		let r = (await this.get(e))?.metadata?.arn || "";
		if (n?.type === "s3" || n?.bucket) {
			let i = n?.bucket;
			if (i) {
				let n = await this.s3.send(new ZD({ Bucket: i })), a = n.LambdaFunctionConfigurations ?? [], o = -1;
				for (let n = 0; n < a.length; n++) {
					let s = a[n];
					if ((!r || s.LambdaFunctionArn === r || s.LambdaFunctionArn?.endsWith(`:${e}`) || s.LambdaFunctionArn === e) && (s.Id ? s.Id === t : `${i}-${n}` === t)) {
						o = n;
						break;
					}
				}
				if (o === -1) throw new X(`Trigger ${t} on bucket ${i} not found or does not belong to function ${e}`);
				let s = a.filter((e, t) => t !== o);
				await this.s3.send(new $D({
					Bucket: i,
					NotificationConfiguration: {
						...n,
						LambdaFunctionConfigurations: s
					}
				}));
				return;
			}
			let a = await this.s3.send(new QD({}));
			for (let n of a.Buckets ?? []) if (n.Name) try {
				let i = await this.s3.send(new ZD({ Bucket: n.Name })), a = i.LambdaFunctionConfigurations ?? [], o = -1;
				for (let i = 0; i < a.length; i++) {
					let s = a[i];
					if ((!r || s.LambdaFunctionArn === r || s.LambdaFunctionArn?.endsWith(`:${e}`) || s.LambdaFunctionArn === e) && (s.Id ? s.Id === t : `${n.Name}-${i}` === t)) {
						o = i;
						break;
					}
				}
				if (o !== -1) {
					let e = a.filter((e, t) => t !== o);
					await this.s3.send(new $D({
						Bucket: n.Name,
						NotificationConfiguration: {
							...i,
							LambdaFunctionConfigurations: e
						}
					}));
					return;
				}
			} catch {}
			throw new X(`S3 trigger ${t} not found or does not belong to function ${e}`);
		}
		let i = (await this.lambda.send(new Ex({ UUID: t }))).FunctionArn ?? "";
		if (!(i === e || i.endsWith(`:${e}`) || r && i === r)) throw new Y(`Event source mapping ${t} does not belong to function ${e}`);
		await this.lambda.send(new wx({ UUID: t }));
	}
};
function sG(e) {
	return e ? new TextDecoder().decode(e) : "";
}
function cG(e) {
	try {
		return Buffer.from(e, "base64").toString("utf8");
	} catch {
		return e;
	}
}
function lG(e) {
	return e?.split(":")[3] || null;
}
function uG(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n)) : e;
}
function dG(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => String(e.metadata.runtime ?? "").toLowerCase().includes(n)) : e;
}
function fG(e, t) {
	return typeof e != "object" || !e ? !1 : e.$metadata?.httpStatusCode === t;
}
// browser-bundle/lambda-entry.ts
var pG = {
	region: "us-east-1",
	credentials: {
		accessKeyId: "test",
		secretAccessKey: "test"
	},
	endpoint: "https://emulator.local.invalid"
}, mG = xW(new qW(new HW([new oG(new _x(pG), new XD({
	...pG,
	forcePathStyle: !0
}), new sI(pG), new XR(pG), new dH(pG))]), {
	aws: async () => {},
	azure: async () => {},
	gcp: async () => {},
	oci: async () => {}
}, "aws", "us-east-1"));
async function hG(e) {
	return mG.fetch(e);
}
export { hG as handleLambdaRequest };
