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
}, r = () => (e, t) => async (n) => (t.__retryLongPoll = !0, e(n)), i = {
	name: "longPollMiddleware",
	tags: ["RETRY"],
	step: "initialize",
	override: !0
}, a = (e) => ({ applyToStack: (e) => {
	e.add(r(), i);
} });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function o(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/isStreamingPayload/isStreamingPayload.browser.js
var s = (e) => e?.body instanceof ReadableStream, c = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, l = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, u = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => d[t.step] - d[e.step] || f[t.priority || "normal"] - f[e.priority || "normal"]), a = (n) => {
		let i = !1, a = (e) => {
			let t = c(e.name, e.aliases);
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
				for (let t of c(e.name, e.aliases)) r.delete(t);
				return !1;
			}
			return !0;
		};
		return e = e.filter(a), t = t.filter(a), i;
	}, s = (n) => (e.forEach((e) => {
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
		let r = [], a = [], o = {};
		return e.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of c(t.name, t.aliases)) o[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of c(t.name, t.aliases)) o[e] = t;
			a.push(t);
		}), a.forEach((e) => {
			if (e.toMiddleware) {
				let t = o[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${l(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
				}
				e.relation === "after" && t.after.push(e), e.relation === "before" && t.before.push(e);
			}
		}), i(r).map(p).reduce((e, t) => (e.push(...t), e), []);
	}, h = {
		add: (t, n = {}) => {
			let { name: i, override: a, aliases: o } = n, s = {
				step: "initialize",
				priority: "normal",
				middleware: t,
				...n
			}, u = c(i, o);
			if (u.length > 0) {
				if (u.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${l(i, o)}'`);
					for (let t of u) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== s.step || s.priority !== r.priority) throw Error(`"${l(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${l(i, o)}" middleware with ${s.priority} priority in ${s.step} step.`);
						e.splice(n, 1);
					}
				}
				for (let e of u) r.add(e);
			}
			e.push(s);
		},
		addRelativeTo: (e, n) => {
			let { name: i, override: a, aliases: o } = n, s = {
				middleware: e,
				...n
			}, u = c(i, o);
			if (u.length > 0) {
				if (u.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${l(i, o)}'`);
					for (let e of u) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== s.toMiddleware || r.relation !== s.relation) throw Error(`"${l(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${l(i, o)}" middleware ${s.relation} "${s.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of u) r.add(e);
			}
			t.push(s);
		},
		clone: () => s(u()),
		use: (e) => {
			e.applyToStack(h);
		},
		remove: (e) => typeof e == "string" ? a(e) : o(e),
		removeByTag: (n) => {
			let i = !1, a = (e) => {
				let { tags: t, name: a, aliases: o } = e;
				if (t && t.includes(n)) {
					let e = c(a, o);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(a), t = t.filter(a), i;
		},
		concat: (e) => {
			let t = s(u());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: s,
		identify: () => m(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return l(e.name, e.aliases) + " - " + t;
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
}, d = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, f = {
	high: 3,
	normal: 2,
	low: 1
}, p, m = t((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(p ||= {});
})), h, g = t((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(h ||= {});
})), ee = t((() => {
	g();
})), te, ne = t((() => {
	te = "__smithy_context";
})), re = t((() => {
	m(), ee(), ne();
})), ie, ae = t((() => {
	re(), ie = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function _(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var oe = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function se(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var v, ce = t((() => {
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
			return n.query &&= se(n.query), n;
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
})), le, ue = t((() => {
	le = class {
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
})), de, fe, pe = t((() => {
	de = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), fe = (e, t = !1) => {
		if (!t) return de.test(e);
		let n = e.split(".");
		for (let e of n) if (!fe(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function me(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var he = t((() => {})), ge, _e = t((() => {
	ge = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function ve(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var ye = t((() => {})), be, xe = t((() => {
	ye(), be = (e) => {
		if (typeof e == "string") return be(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = ve(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), Se, Ce = t((() => {
	oe(), xe(), Se = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = be(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) _(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return be(e);
	};
})), y = t((() => {
	ae(), oe(), ce(), ue(), pe(), he(), _e(), xe(), Ce();
})), we = (e) => () => Promise.reject(e), Te = class {
	config;
	middlewareStack = u();
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
}, Ee, De = t((() => {
	Ee = (e) => typeof e == "function" ? e() : e;
})), Oe, ke = t((() => {
	Oe = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), Ae, je, Me = t((() => {
	y(), ke(), Ae = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = ie(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(Oe(o, s, c, l, u), {
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
					if (le.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: je(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: je(/^x-[\w-]+-id-2$/, r),
							cfId: je(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, je = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), Ne, Pe = t((() => {
	y(), ke(), Ne = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = ie(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => Se(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(Oe(a, o, s, c, l), r.input, {
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
function Fe(e) {
	return { applyToStack: (t) => {
		t.add(Ne(e), Le), t.add(Ae(e), Ie), e.protocol.setSerdeContext(e);
	} };
}
var Ie, Le, Re = t((() => {
	Me(), Pe(), Ie = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Le = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function ze(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Be[e]) return Be[e];
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
	return Be[e] = t;
}
var Be, Ve = t((() => {
	Be = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function He(e, t) {
	return e instanceof b ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new b(e, t);
}
var Ue, We, Ge, b, Ke, qe, Je = t((() => {
	De(), Ve(), Ue = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, We = [], Ge = {}, b = class e {
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
			for (this._isMemberSchema = !1; Ke(i);) r.push(i[1]), i = i[0], a = Ee(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, ze(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = Ee(a), qe(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (We[t]) return We[t];
			} else if (typeof t == "string") {
				if (Ge[t]) return Ge[t];
			} else if (n && t[Ue.ns]) return t[Ue.ns];
			let r = Ee(t);
			if (r instanceof e) return r;
			if (Ke(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), ze(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Ue.ns] = i : typeof r == "string" ? Ge[r] = i : typeof r == "number" ? We[r] = i : i;
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
			return ze(this.memberTraits);
		}
		getOwnTraits() {
			return ze(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return He([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return He([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return He(Ke(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return He([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[Ue.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = He([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Ue.it] = n;
			}
		}
	}, Ke = (e) => Array.isArray(e) && e.length === 2, qe = (e) => Array.isArray(e) && e.length >= 5;
})), Ye, Xe = t((() => {
	Ye = class e {
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
})), x = t((() => {
	De(), Re(), ke(), Je(), Ve(), Xe();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
x();
var Ze = "***SensitiveInformation***";
function Qe(e, t) {
	if (t == null) return t;
	let n = b.of(e);
	if (n.getMergedTraits().sensitive) return Ze;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return Ze;
		if (Array.isArray(t)) return t.map((t) => Qe(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return Ze;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, Qe(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = Qe(i, e[t]));
		return r;
	}
	return t;
}
re(), x();
var $e = Symbol.for("@smithy/op-event-stream"), et = class {
	middlewareStack = u();
	schema;
	static classBuilder() {
		return new tt();
	}
	resolveMiddlewareWithContext(e, t, n, { middlewareFn: r, clientName: i, commandName: a, inputFilterSensitiveLog: o, outputFilterSensitiveLog: s, smithyContext: c, additionalContext: l, CommandCtor: u }) {
		for (let i of r.bind(this)(u, e, t, n)) this.middlewareStack.use(i);
		let d = e.concat(this.middlewareStack), { logger: f } = t, p = l[te], m = {
			logger: f,
			clientName: i,
			commandName: a,
			inputFilterSensitiveLog: o,
			outputFilterSensitiveLog: s,
			...l,
			[te]: {
				...p,
				commandInstance: this,
				...c,
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
			}
		}, { requestHandler: h } = t, g = n ?? {};
		g.metricsRecorder && (g = { ...g }, delete g.metricsRecorder);
		let ee, ne = this.schema, re = ne?.[$e];
		if (re !== void 0) ee = re;
		else if (ne && Array.isArray(ne) && ne[0] === 9) {
			let [, , , , e, t] = ne;
			ee = ne[$e] = !!(b.of(e).getEventStreamMember() || b.of(t).getEventStreamMember());
		}
		return ee && (g = {
			isEventStream: ee,
			...g
		}), d.resolve((e) => h.handle(e.request, g), m);
	}
}, tt = class {
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
		return t = class extends et {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? Qe.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? Qe.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, nt = class e extends Error {
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
}, rt = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), it = (e) => {
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
y(), re();
var at = Object.values(h), ot = (e) => {
	let t = [];
	for (let n in h) {
		if (!_(h, n)) continue;
		let r = h[n];
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
			at.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, st = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		at.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, ct = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), lt = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, ut = (e) => Object.assign(ot(e), ct(e)), dt = (e) => Object.assign(st(e), lt(e)), ft = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function pt(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return et.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var mt, ht, gt, _t = t((() => {
	mt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ht = Object.entries(mt).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), gt = mt.split("");
})), vt, yt = t((() => {
	_t(), vt = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in ht)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= ht[e[r]] << (a - r) * 6, i += 6;
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
})), bt, xt = t((() => {
	bt = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function St(e) {
	let t;
	t = typeof e == "string" ? bt(e) : e;
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
			i += gt[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var Ct = t((() => {
	xt(), _t();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function wt(e, t, n, r) {
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
var Tt = t((() => {})), Et, Dt = t((() => {
	Et = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function Ot(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, S[t[0]] + S[t[1]] + S[t[2]] + S[t[3]] + "-" + S[t[4]] + S[t[5]] + "-" + S[t[6]] + S[t[7]] + "-" + S[t[8]] + S[t[9]] + "-" + S[t[10]] + S[t[11]] + S[t[12]] + S[t[13]] + S[t[14]] + S[t[15]];
	};
}
var S, kt = t((() => {
	S = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt = t((() => {
	At = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && Gt.warn(Wt(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, jt = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Mt = (e) => {
		let t = At(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > jt) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Nt = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Pt = (e) => It(e, 16), Ft = (e) => It(e, 8), It = (e, t) => {
		let n = Nt(e);
		if (n !== void 0 && Lt(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Lt = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Rt = (e) => At(typeof e == "string" ? Vt(e) : e), zt = (e) => Mt(typeof e == "string" ? Vt(e) : e), Bt = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Vt = (e) => {
		let t = e.match(Bt);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, Ht = (e) => Pt(typeof e == "string" ? Vt(e) : e), Ut = (e) => Ft(typeof e == "string" ? Vt(e) : e), Wt = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), Gt = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function qt(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Jt[r]}, ${c} ${Yt[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln, un, dn, fn, pn, mn, hn, gn = t((() => {
	Kt(), Jt = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], Yt = [
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
	], Xt = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), Zt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
		let t = Xt.exec(e);
		if (!t) throw TypeError("Invalid RFC-3339 date-time value");
		let [n, r, i, a, o, s, c, l, u] = t, d = Ht(hn(r)), f = fn(i, "month", 1, 12), p = fn(a, "day", 1, 31), m = rn(d, f, p, {
			hours: o,
			minutes: s,
			seconds: c,
			fractionalMilliseconds: l
		});
		return u.toUpperCase() != "Z" && m.setTime(m.getTime() - mn(u)), m;
	}, Qt = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), $t = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), en = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), tn = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = Qt.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rn(Ht(hn(i)), cn(r), fn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = $t.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return sn(rn(an(i), cn(r), fn(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = en.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rn(Ht(hn(c)), cn(n), fn(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, nn = (e) => {
		if (e == null) return;
		let t;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") t = Rt(e);
		else if (typeof e == "object" && e.tag === 1) t = e.value;
		else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(t) || t === Infinity || t === -Infinity) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(t * 1e3));
	}, rn = (e, t, n, r) => {
		let i = t - 1;
		return un(e, i, n), new Date(Date.UTC(e, i, n, fn(r.hours, "hour", 0, 23), fn(r.minutes, "minute", 0, 59), fn(r.seconds, "seconds", 0, 60), pn(r.fractionalMilliseconds)));
	}, an = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + Ht(hn(e));
		return n < t ? n + 100 : n;
	}, on = 15768e8, sn = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > on ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, cn = (e) => {
		let t = Yt.indexOf(e);
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
		if (t === 1 && dn(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${Yt[t]} in ${e}: ${n}`);
	}, dn = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), fn = (e, t, n, r) => {
		let i = Ut(hn(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, pn = (e) => e == null ? 0 : zt("0." + e) * 1e3, mn = (e) => {
		let t = e[0], n = 1;
		if (t == "+") n = 1;
		else if (t == "-") n = -1;
		else throw TypeError(`Offset direction, ${t}, must be "+" or "-"`);
		let r = Number(e.substring(1, 3)), i = Number(e.substring(4, 6));
		return n * (r * 60 + i) * 60 * 1e3;
	}, hn = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), _n, vn = t((() => {
	_n = function(e) {
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
	}, _n.from = (e) => e && typeof e == "object" && (e instanceof _n || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? _n(String(e)) : _n(JSON.stringify(e)), _n.fromObject = _n.from;
})), yn, bn, xn = t((() => {
	yn = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, bn = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !yn.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && yn.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function Sn(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in wn) t[n / 2] = wn[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function C(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Cn[e[n]];
	return t;
}
var Cn, wn, Tn = t((() => {
	Cn = {}, wn = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), Cn[e] = t, wn[t] = e;
	}
})), En, Dn, On = t((() => {
	En = typeof TextEncoder == "function" ? new TextEncoder() : null, Dn = (e) => {
		if (typeof e == "string") {
			if (En) return En.encode(e).byteLength;
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
})), w, kn = t((() => {
	xt(), w = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? bt(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function An(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var jn = t((() => {})), Mn, Nn = t((() => {
	Mn = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
})), Pn, Fn = t((() => {
	Pn = async (e) => void 0;
})), In, Ln, Rn, zn, Bn, Vn, Hn = t((() => {
	In = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), Vn(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!Bn(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Ln = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Rn = /(\d+\.){3}\d+/, zn = /\.\./, Bn = (e) => Ln.test(e) && !Rn.test(e) && !zn.test(e), Vn = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), Un = t((() => {
	Hn();
})), Wn, Gn = t((() => {
	Wn = (e, t, n, r = !1) => {
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
})), Kn = t((() => {
	y();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function qn(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(Se(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await Jn(t, n, r);
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
var Jn, Yn = t((() => {
	Un(), Gn(), Kn(), Jn = async (e, t, n) => {
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
				r[t] = await Wn(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await In(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function Xn(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function Zn(e) {
	let t = qn(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && Xn(i, "ENDPOINT_OVERRIDE", "N");
		let o = await t(a.input, { getEndpointParameterInstructions() {
			return n;
		} }, { ...e }, i);
		i.endpointV2 = o, i.authSchemes = o.properties?.authSchemes;
		let s = i.authSchemes?.[0];
		if (s) {
			i.signing_region = s.signingRegion, i.signing_service = s.signingName;
			let e = ie(i)?.selectedHttpAuthScheme?.httpAuthOption;
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
var Qn = t((() => {
	y(), Yn();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function $n(e) {
	let t = Zn(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), tr);
	} });
}
var er, tr, nr = t((() => {
	Qn(), er = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, tr = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: er.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function rr(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => Se(await ge(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: ge(i ?? !1),
			useFipsEndpoint: ge(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var ir = t((() => {
	y(), Kn();
})), ar, or = t((() => {
	ar = class e {
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
})), sr, cr = t((() => {
	sr = class {
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
})), T, lr = t((() => {
	T = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), ur = t((() => {
	lr();
})), dr, fr = t((() => {
	dr = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function pr(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${pr(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(pr).join(", ")})` : JSON.stringify(e, null, 2);
}
var mr = t((() => {})), hr = t((() => {
	fr(), mr();
})), gr, _r = t((() => {
	gr = {};
})), vr, yr = t((() => {
	vr = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function br(...e) {
	for (let t of e) if (t != null) return t;
}
var xr = t((() => {})), Sr, Cr = t((() => {
	ur(), Sr = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new T(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new T(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), wr, Tr = t((() => {
	ur(), Cr(), wr = (e, t) => Sr(t).reduce((n, r) => {
		if (typeof n != "object") throw new T(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Er, Dr = t((() => {
	Er = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function Or(e, t, n) {
	return e ? t : n;
}
var kr = t((() => {})), Ar, jr = t((() => {
	Ar = (e) => !e;
})), Mr, Nr, Pr = t((() => {
	Mr = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), Nr = (e) => Mr.test(e) || e.startsWith("[") && e.endsWith("]");
})), Fr, Ir, Lr = t((() => {
	re(), Pr(), Fr = {
		[p.HTTP]: 80,
		[p.HTTPS]: 443
	}, Ir = (e) => {
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
		if (!Object.values(p).includes(c)) return null;
		let l = Nr(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${Fr[c]}`) || typeof e == "string" && e.includes(`${r}:${Fr[c]}`) ? `:${Fr[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Rr(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var zr = t((() => {})), Br, Vr = t((() => {
	Br = (e, t) => e === t;
})), Hr, Ur = t((() => {
	Hr = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Wr, Gr = t((() => {
	Wr = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Kr = t((() => {
	yr(), xr(), Tr(), Dr(), y(), kr(), jr(), Lr(), zr(), Vr(), Ur(), Gr();
})), qr, Jr = t((() => {
	Kr(), qr = {
		booleanEquals: vr,
		coalesce: br,
		getAttr: wr,
		isSet: Er,
		isValidHostLabel: fe,
		ite: Or,
		not: Ar,
		parseURL: Ir,
		split: Rr,
		stringEquals: Br,
		substring: Hr,
		uriEncode: Wr
	};
})), Yr, Xr = t((() => {
	Kr(), Yr = (e, t) => {
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
				n.push(wr(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), Zr, Qr = t((() => {
	Zr = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), $r, ei, ti, ni = t((() => {
	ur(), _r(), Jr(), Xr(), Qr(), $r = (e, t, n) => {
		if (typeof e == "string") return Yr(e, n);
		if (e.fn) return ti.callFunction(e, n);
		if (e.ref) return Zr(e, n);
		throw new T(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, ei = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = ti.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = gr[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = qr[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, ti = {
		evaluateExpression: $r,
		callFunction: ei
	};
})), ri = t((() => {
	ni();
})), ii, ai = t((() => {
	hr(), ur(), ri(), ii = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new T(`'${n}' is already defined in Reference Record.`);
		let r = ei(e, t);
		t.logger?.debug?.(`${dr} evaluateCondition: ${pr(e)} = ${pr(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), oi, si = t((() => {
	ur(), ni(), oi = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = $r(e, "Header value entry", t);
		if (typeof r != "string") throw new T(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), ci, li, ui, di = t((() => {
	ur(), Xr(), ci = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = ui.getEndpointProperty(r, t), e), {}), li = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => li(e, t));
		switch (typeof e) {
			case "string": return Yr(e, t);
			case "object":
				if (e === null) throw new T(`Unexpected endpoint property: ${e}`);
				return ui.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new T(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, ui = {
		getEndpointProperty: li,
		getEndpointProperties: ci
	};
})), fi, pi = t((() => {
	ur(), ni(), fi = (e, t) => {
		let n = $r(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new T(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), mi, hi, gi = t((() => {
	ur(), ai(), ni(), si(), di(), pi(), mi = 1e8, hi = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < mi;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = ii({
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
		if (o >= mi) {
			let e = i[o - mi];
			if (e[0] === -1) {
				let [, t] = e;
				throw new T($r(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: fi(t, c),
				properties: ci(n, c),
				headers: oi(r ?? {}, c)
			};
		}
		throw new T("No matching endpoint.");
	};
})), _i, vi, yi = t((() => {
	Fn(), Yn(), Qn(), nr(), ir(), y(), or(), cr(), gi(), Pr(), _r(), hr(), ur(), ai(), si(), di(), pi(), ni(), Kn(), _i = rr(Pn), Zn(Pn), vi = $n(Pn);
})), bi, xi = t((() => {
	bi = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Si(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function Ci(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return An(t, r);
}
var wi, Ti = t((() => {
	jn(), xi(), wi = async (e) => bi(e) ? Si(e) : Ci(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Ei(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Di = t((() => {})), Oi, ki, Ai, ji, E = t((() => {
	yt(), Ct(), Tt(), xt(), Dt(), kt(), gn(), vn(), Kt(), xn(), Tn(), On(), kn(), jn(), Nn(), y(), yi(), xi(), Ti(), Di(), Oi = class extends wt(Et, bt, St, vt) {}, ki = (e) => crypto.getRandomValues(e), Ai = Ot(ki), ji = Ai;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
E();
var Mi = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return Oi.mutate(e);
	if (!e) return Oi.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return Oi.mutate(await n);
}, Ni = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/checksum/md5/Md5Js.js
function Pi(e, t) {
	let n = e[0], r = e[1], i = e[2], a = e[3];
	for (let e = 0; e < 64; ++e) {
		let o, s;
		e < 16 ? (o = r & i | ~r & a, s = e) : e < 32 ? (o = a & r | i & ~a, s = (5 * e + 1) % 16) : e < 48 ? (o = r ^ i ^ a, s = (3 * e + 5) % 16) : (o = i ^ (r | ~a), s = 7 * e % 16);
		let c = t.getUint32(s * 4, !0), l = a;
		a = i, i = r;
		let u = Ri[(e >> 4) * 4 + (e & 3)], d = (n + o & Li) + (c + zi[e] & Li) & Li;
		r = r + ((d << u | d >>> 32 - u) >>> 0) & Li, n = l;
	}
	e[0] = e[0] + n & Li, e[1] = e[1] + r & Li, e[2] = e[2] + i & Li, e[3] = e[3] + a & Li;
}
var Fi, Ii, Li, Ri, zi, Bi = t((() => {
	E(), Fi = class {
		digestLength = 16;
		state = Uint32Array.from(Ii);
		writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64));
		bufferLength = 0;
		bytesHashed = 0;
		update(e) {
			let t = w(e), n = 0, r = t.byteLength;
			for (this.bytesHashed += r; r > 0;) this.writeBuffer.setUint8(this.bufferLength++, t[n++]), --r, this.bufferLength === 64 && (Pi(this.state, this.writeBuffer), this.bufferLength = 0);
		}
		async digest() {
			let e = Uint32Array.from(this.state), t = new DataView(this.writeBuffer.buffer.slice(0)), n = this.bufferLength, r = this.bytesHashed * 8;
			if (t.setUint8(n++, 128), this.bufferLength % 64 >= 56) {
				for (let e = n; e < 64; ++e) t.setUint8(e, 0);
				Pi(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) t.setUint8(e, 0);
			t.setUint32(56, r >>> 0, !0), t.setUint32(60, Math.floor(r / 2 ** 32), !0), Pi(e, t);
			let i = /* @__PURE__ */ new Uint8Array(16), a = new DataView(i.buffer);
			for (let t = 0; t < 4; ++t) a.setUint32(t * 4, e[t], !0);
			return i;
		}
		reset() {
			this.state.set(Ii), this.writeBuffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(64)), this.bufferLength = 0, this.bytesHashed = 0;
		}
	}, Ii = [
		1732584193,
		4023233417,
		2562383102,
		271733878
	], Li = 4294967295, Ri = Uint8Array.of(7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21), zi = Array.from({ length: 64 }, (e, t) => Math.abs(Math.sin(t + 1)) * 2 ** 32 >>> 0);
})), Vi, Hi, Ui, Wi = t((() => {
	Vi = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Vi[e] = t >>> 0;
	}
	Hi = 4294967295, Ui = class {
		digestLength = 4;
		checksum = Hi;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Vi[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Hi) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Hi;
		}
	};
})), D, Gi, Ki, qi, Ji, Yi, Xi = t((() => {
	E(), D = 64, Gi = 32, Ki = 2 ** 53 - 1, qi = class e {
		digestLength = Gi;
		state = Int32Array.from(Ji);
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
				for (let e = 0; e < D; ++e) a[e] = 54 ^ n[e], a[e + D] = 92 ^ n[e];
				r.update(a.subarray(0, D)), i.update(a.subarray(D));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = w(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > Ki) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === D && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(Ji), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % D >= 56) {
				for (let e = n; e < D; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array(Gi);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = w(t);
			if (n.byteLength > D) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(D);
				return i.set(r), i;
			}
			if (n.byteLength < D) {
				let e = new Uint8Array(D);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < D; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (Yi[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, Ji = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), Yi = new Int32Array([
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
})), Zi, Qi, $i, ea, ta, na, ra = t((() => {
	E(), Xi(), {digest: Zi, sign: Qi, importKey: $i} = globalThis?.crypto?.subtle ?? {}, ea = typeof Zi == "function" && typeof Qi == "function" && typeof $i == "function" ? globalThis.crypto.subtle : void 0, ta = 8388608, na = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = w(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= ta && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = An(this.pending);
			if (ea) {
				if (this.secret) {
					this.finished = !0;
					let t = await ea.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await ea.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await ea.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new qi(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new qi(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), ia = t((() => {
	Bi(), Wi(), Xi(), ra();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function aa(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var oa, sa = t((() => {
	E(), oa = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && aa(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && aa(e), parseInt(C(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), ca, la, ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba, xa = t((() => {
	y(), E(), sa(), ca = class {
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
					if (e.value.byteLength > ba) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${ba} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > ba) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${ba} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(oa.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!ya.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(Sn(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: ua,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: ua,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: da,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: fa,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: pa,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: ma,
							value: new oa(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ha,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: ga,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: _a,
							value: new Date(new oa(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: va,
							value: `${C(o.subarray(0, 4))}-${C(o.subarray(4, 6))}-${C(o.subarray(6, 8))}-${C(o.subarray(8, 10))}-${C(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(la ||= {}), ua = "boolean", da = "byte", fa = "short", pa = "integer", ma = "long", ha = "binary", ga = "string", _a = "timestamp", va = "uuid", ya = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ba = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function Sa({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Ea) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(Ca, !1), o = r.getUint32(wa, !1), s = r.getUint32(e - Ta, !1), c = new Ui();
	if (c.update(new Uint8Array(n, t, wa)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + wa, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + wa + Ta, a),
		body: new Uint8Array(n, t + wa + Ta + a, i - a - 16)
	};
}
var Ca, wa, Ta, Ea, Da = t((() => {
	ia(), Ca = 4, wa = 8, Ta = 4, Ea = 16;
})), Oa, ka = t((() => {
	ia(), xa(), Da(), Oa = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new ca(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Ui();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = Sa(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), Aa, ja = t((() => {
	Aa = class {
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
			for await (let e of this.options.messageStream) yield this.options.encoder.encode(e);
			this.options.includeEndFrame && (yield /* @__PURE__ */ new Uint8Array());
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
			for await (let e of this.options.messageStream) {
				let t = await this.options.deserializer(e);
				t !== void 0 && (yield t);
			}
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
			for await (let e of this.options.inputStream) yield this.options.serializer(e);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getChunkedStream.js
function Ra(e) {
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
var za = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ba(e, t) {
	let n = Va(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Va(e, t) {
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
var Ha = t((() => {})), Ua, Wa, Ga = t((() => {
	ka(), ja(), Na(), Fa(), La(), za(), Ha(), Ua = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new Oa(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Ra(e);
			return new Pa({
				messageStream: new Aa({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Va(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Ma({
				messageStream: new Ia({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Wa = (e) => new Ua(e);
})), Ka, qa, Ja = t((() => {
	Ka = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), qa = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), Ya, Xa, Za, Qa = t((() => {
	Ga(), Ja(), Ya = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Ua({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = Xa(e) ? Ka(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? qa(n) : n;
		}
	}, Xa = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, Za = (e) => new Ya(e);
})), $a, eo = t((() => {
	$a = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), to, no = t((() => {
	y(), x(), E(), to = class {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? Et)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				let e = a[1], t = Ye.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? bt)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), ro = /* @__PURE__ */ n({
	EventStreamCodec: () => Oa,
	EventStreamMarshaller: () => Ya,
	EventStreamSerde: () => to,
	HeaderMarshaller: () => ca,
	Int64: () => oa,
	MessageDecoderStream: () => Aa,
	MessageEncoderStream: () => Ma,
	SmithyMessageDecoderStream: () => Pa,
	SmithyMessageEncoderStream: () => Ia,
	UniversalEventStreamMarshaller: () => Ua,
	eventStreamSerdeProvider: () => Za,
	getChunkedStream: () => Ra,
	getMessageUnmarshaller: () => Va,
	getUnmarshalledStream: () => Ba,
	iterableToReadableStream: () => qa,
	readableStreamToIterable: () => Ka,
	resolveEventStreamSerdeConfig: () => $a,
	universalEventStreamSerdeProvider: () => Wa
}), io = t((() => {
	ka(), xa(), sa(), ja(), Na(), Fa(), La(), Qa(), Ja(), Ga(), za(), Ha(), eo(), no();
}));
y(), x();
var ao = class extends Ni {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Ye(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return v;
	}
	getResponseType() {
		return le;
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
		let r = b.of(t.input), i = ze(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !me(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (io(), ro));
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
y(), x();
var oo = class extends ao {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = b.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new v({
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
			let i = await Mi(n.body, t);
			throw i.byteLength > 0 && Object.assign(a, await r.read(15, i)), await this.handleError(e, t, n, a, this.deserializeMetadata(n)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
		}
		for (let e in n.headers) {
			if (!_(n.headers, e)) continue;
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
			let e = await Mi(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function so(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/protocol-http/extensions/httpExtensionConfiguration.js
var co = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), lo = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
y();
var uo = "content-length";
function fo(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (v.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(uo) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[uo]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var po = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, mo = (e) => ({ applyToStack: (t) => {
	t.add(fo(e.bodyLengthChecker), po);
} }), ho = (e) => encodeURIComponent(e).replace(/[!'()*]/g, go), go = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function _o(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = ho(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${ho(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${ho(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var vo = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, yo = class {
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
}, bo;
function xo() {
	if (bo === void 0) try {
		if (typeof Buffer != "function") bo = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			bo = typeof e == "object" && !!e;
		}
	} catch {
		bo = !1;
	}
	return bo;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
E();
function So(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? wo(e, t) ? t : new bn(e, "bigDecimal") : Co(e) ? new bn(e, "bigDecimal") : /[eE]/.test(e) ? Eo(e) : BigInt(e);
	}
	return t;
}
function Co(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function wo(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return To(e) === To(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === To(r) : !1;
}
function To(e) {
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
function Eo(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
x();
var Do = Symbol.for("@aws-sdk/reviver");
function Oo(e) {
	let t = b.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (Do in n) return n[Do];
		let e = ko(t, /* @__PURE__ */ new Set());
		return n[Do] = e, e;
	}
	return ko(t, /* @__PURE__ */ new Set());
}
function ko(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (ko(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (ko(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
E();
var Ao = (e, t) => Mi(e, t).then((e) => (t?.utf8Encoder ?? Et)(e));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function jo(e, t, n) {
	let r;
	if (xo() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await Mi(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await Ao(e, t), r.length === 0) return {};
	let i = n && Oo(n) ? So : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var Mo = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), No = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, Po = (e, t, n = !1) => Fo(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), Fo = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = Mo(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return No(e[n]);
			break;
		case "code":
			let r = Mo(t ?? {}, "code");
			if (r && t[r] !== void 0) return No(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return No(t.__type);
	}
};
x(), E(), y();
var Io = class extends vo {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = Oo(e) ? So : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && xo()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await jo(t, this.serdeContext, e);
		return this._read(e, r);
	}
	readObject(e, t) {
		return this._read(e, t);
	}
	_read(e, t) {
		let n = typeof t == "object" && !!t, r = b.of(e);
		if (n) {
			if (r.isStructSchema()) return this._readStruct(r, t);
			if (Array.isArray(t) && r.isListSchema()) {
				let e = r.getValueSchema();
				if (this.needsTransform(e)) for (let n = 0; n < t.length; ++n) t[n] = this._read(e, t[n]);
				return t;
			}
			if (r.isMapSchema()) {
				let e = r.getValueSchema(), n = t;
				if (this.needsTransform(e)) for (let t in n) _(n, t) && (t === "__proto__" && Ei(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return vt(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? _n.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (so(r, this.settings)) {
			case 5: return Zt(t);
			case 6: return tn(t);
			case 7: return nn(t);
			default: return console.warn("Missing timestamp format, parsing value with Date constructor:", t), new Date(t);
		}
		if (r.isBigIntegerSchema() && (typeof t == "number" || typeof t == "string")) return BigInt(t);
		if (r.isBigDecimalSchema() && t != null) {
			if (t instanceof bn) return t;
			let e = t;
			return e.type === "bigDecimal" && "string" in e ? new bn(e.string, e.type) : new bn(String(t), "bigDecimal");
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
				n instanceof bn || (t[e] = this._read(r, n));
			}
			else {
				let e = t;
				for (let t in e) {
					if (!_(e, t)) continue;
					t === "__proto__" && Ei(e);
					let n = e[t];
					n instanceof bn || (e[t] = this._read(r, n));
				}
			}
		}
		return t;
	}
	_readStruct(e, t) {
		let n = e.isUnionSchema(), r = {}, i, a = typeof t.__type == "string", { jsonName: o } = this.settings;
		o && a && (i = {});
		let s;
		n && (s = new yo(t, r));
		for (let [c, l] of e.structIterator()) {
			let e = c;
			o && (e = l.getMergedTraits().jsonName ?? e, a && (i[e] = c)), n && s.mark(e), t[e] != null && (r[c] = this._read(l, t[e]));
		}
		if (n) s.writeUnknown();
		else if (a) for (let e in t) {
			if (!_(t, e)) continue;
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
E();
var Lo = class e extends Uint8Array {
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
			e > Ro + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), Ro = e), this.string = Et(this);
		}
		return this.string;
	}
}, Ro = 0;
x(), E(), y();
var zo = new TextEncoder(), Bo = 123, Vo = 125, Ho = 91, Uo = 93, Wo = 34, Go = 58, Ko = 44, qo = 92, Jo = new Uint8Array([
	116,
	114,
	117,
	101
]), Yo = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), Xo = new Uint8Array([
	110,
	117,
	108,
	108
]), O = Array(128).fill(null);
O[8] = "b", O[9] = "t", O[10] = "n", O[12] = "f", O[13] = "r", O[34] = "\"", O[92] = "\\";
for (let e = 0; e < 32; e++) O[e] === null && (O[e] = "u00" + e.toString(16).padStart(2, "0"));
var Zo = 2048;
function Qo(e) {
	return Lo.allocUnsafe(e);
}
var $o = class e extends vo {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = Qo(Zo);
	}
	write(e, t) {
		this.i = 0, this.rawValue = t, this.rootSchema = b.of(e), this.passthrough = this.rootSchema.isBlobSchema() || this.rootSchema.isStringSchema(), this.passthrough || this.writeValue(this.rootSchema, t, void 0);
	}
	writeDiscriminatedDocument(e, t) {
		this.i = 0, this.rootSchema = b.of(e);
		let n = this.rootSchema;
		if (n.isStructSchema() && typeof t == "object" && t) {
			this.writeValue(n, t, void 0);
			let e = `"__type":"${n.getName(!0) ?? "Unknown"}",`, r = e.length;
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), zo.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = Qo(Zo), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = Qo(r);
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
		n[r++] = Wo;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = Wo, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = Wo;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = O[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = qo;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = zo.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = Wo;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = qo, t[n++] = 117;
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
		r[a++] = Wo;
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
		r[a++] = Wo, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && b.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(ji());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(Xo, this.i), this.i += 4;
			return;
		}
		let r = b.of(e), i = typeof t == "object";
		if (r.isStringSchema()) {
			let e = r.getMergedTraits().mediaType;
			if (e && (e === "application/json" || e.endsWith("+json"))) {
				this.writeJsonString(_n.from(t).toString());
				return;
			}
		}
		if (this.settings.bigNumberAsString && t != null && (r.isBigIntegerSchema() || r.isBigDecimalSchema())) {
			let e = t instanceof bn ? t.string : String(t);
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
			if (t instanceof bn) {
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
				let e = (this.serdeContext?.base64Encoder ?? St)(t);
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
			t ? (n.set(Jo, e), e += 4) : (n.set(Yo, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = Bo;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = Ko), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Go, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Go, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = Ko), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Go, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = Vo;
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
			this.ensure(n.length * 3), this.i += zo.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Ho;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = Ko), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = Uo;
	}
	writeMap(e, t, n) {
		let r = !!e.getMergedTraits().sparse, i = e.getValueSchema();
		if (!n && (i.isStringSchema() || i.isNumericSchema() || i.isBooleanSchema())) {
			let e;
			for (let n in t) {
				if (!_(t, n)) continue;
				let i = t[n];
				Number.isNaN(i) || i === Infinity || i === -Infinity ? ((e ??= {})[n] = i, t[n] = String(i)) : i === null && !r && ((e ??= {})[n] = null, t[n] = void 0);
			}
			let n = JSON.stringify(t);
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += zo.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Bo;
		let a = !0;
		for (let e in t) {
			if (!_(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = Ko), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Go, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = Vo;
	}
	writeTimestamp(e, t) {
		switch (so(e, this.settings)) {
			case 5: {
				let e = t.toISOString().replace(".000Z", "Z");
				this.writeAsciiQuoted(e);
				return;
			}
			case 6:
				this.writeAsciiQuoted(qt(t));
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
}, es = class extends vo {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new $o(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Io(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
}, ts = [
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
], ns = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], rs = [
	500,
	502,
	503,
	504
], is = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], as = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], os = (e) => e?.$retryable !== void 0, ss = (e) => e.$metadata?.clockSkewCorrected, cs = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, ls = (e) => e.$metadata?.httpStatusCode === 429 || ts.includes(e.name) || e.$retryable?.throttling == 1, us = (e, t = 0) => e?.name !== "AbortError" && (os(e) || ss(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || ns.includes(e.name) || is.includes(e?.code || "") || as.includes(e?.code || "") || rs.includes(e.$metadata?.httpStatusCode || 0) || cs(e) || fs(e) || e.cause !== void 0 && t <= 10 && us(e.cause, t + 1)), ds = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !us(e);
	}
	return !1;
};
function fs(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/constants.js
var ps = 2e4, ms = "amz-sdk-invocation-id", hs = "amz-sdk-request";
y(), ue(), E();
function gs(e, t) {
	if (le.isInstance(e)) for (let n in e.headers) {
		if (!_(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (tn(r).getTime() - Date.now()) / 1e3;
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
var _s = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
ce(), E();
function vs(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts();
		if (bs(a)) {
			a = a;
			let s = await a.acquireInitialRetryToken((r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : "")), c = /* @__PURE__ */ Error(), l = 0, u = 0, { request: d } = i, f = v.isInstance(d);
			for (f && (d.headers[ms] = Ai());;) try {
				f && (d.headers[hs] = `attempt=${l + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(s), t.$metadata.attempts = l + 1, t.$metadata.totalRetryDelay = u, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = xs(n, t.logger);
				if (c = _s(n), f && e(d)) throw (r.logger instanceof ft ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), c;
				try {
					s = await a.refreshRetryTokenForRetry(s, i);
				} catch {
					throw c.$metadata || (c.$metadata = {}), c.$metadata.attempts = l + 1, c.$metadata.totalRetryDelay = u, c;
				}
				l = s.getRetryCount();
				let o = s.getRetryDelay();
				u += (s?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await ys(o);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var ys = (e) => new Promise((t) => setTimeout(t, e)), bs = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, xs = (e, t) => {
	let n = {
		error: e,
		errorType: Ss(e)
	}, r = gs(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, Ss = (e) => ls(e) ? "THROTTLING" : us(e) ? "TRANSIENT" : ds(e) ? "SERVER_ERROR" : "CLIENT_ERROR", Cs = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function ws(e) {
	let t = vs(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), Cs);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var Ts = class e {
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
		if (n?.errorType === "THROTTLING" || ls(n?.error ?? e)) {
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
}, k = class e {
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
}, Es = class {
	x = k.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, ps);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, Ds = class {
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
		return Math.min(ps, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Os;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Os ||= {});
var ks = Os.STANDARD, As = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, js = class {
	mode = Os.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= k.delay(), this.retryBackoffStrategy ??= new Es();
	}
	async acquireInitialRetryToken(e) {
		return new Ds(k.delay(), 0, void 0, k.v2026 && e.includes(":longpoll"));
	}
	async refreshRetryTokenForRetry(e, t) {
		let n = await this.getMaxAttempts(), r = this.retryCode(e, t, n), i = r === 0, a = e.isLongPoll?.();
		if (i || a) {
			let n = t.errorType;
			this.retryBackoffStrategy.setDelayBase(n === "THROTTLING" ? k.throttlingDelay() : this.baseDelay);
			let o = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount()), s = o;
			if (t.retryAfterHint instanceof Date && (s = Math.max(o, Math.min(t.retryAfterHint.getTime() - Date.now(), o + 5e3))), i) {
				let t = this.getCapacityCost(n);
				this.capacity -= t;
				let r = new Ds(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = k.v2026 && r === As.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : As.incompatible, a = r < n ? 0 : As.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : As.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === k.modifiedCostType() ? k.throttlingCost() : k.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, Ms = class {
	mode = Os.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new Ts(), this.standardRetryStrategy = t ? new js({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new js(e);
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
_e();
var Ns = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = k.delay() } = t ?? {}, o = ge(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await ge(r)() === Os.ADAPTIVE ? new Ms(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new js({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, Ps = ws(s);
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
k.v2026 ||= typeof process == "object" && {}.AWS_NEW_RETRIES_2026 === "true";
function Fs(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
ce();
function Is(e) {
	return e;
}
var Ls = (e) => (t) => async (n) => {
	if (!v.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, Rs = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, zs = (e) => ({ applyToStack: (t) => {
	t.add(Ls(e), Rs);
} }), Bs = () => (e, t) => async (n) => {
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
}, Vs = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, Hs = (e) => ({ applyToStack: (e) => {
	e.add(Bs(), Vs);
} }), Us = (e) => ({ applyToStack: (e) => {} }), Ws = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
y();
function Gs(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var Ks = (e, t) => (n, r) => async (i) => {
	let a = Ws(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = Gs(e.httpAuthSchemes), s = ie(r), c = [];
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
}, qs = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, Js = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(Ks(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), qs);
} });
ce(), y();
var Ys = (e) => (e) => {
	throw e;
}, Xs = (e, t) => {}, Zs = (e) => (e, t) => async (n) => {
	if (!v.isInstance(n.request)) return e(n);
	let r = ie(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || Ys)(i));
	return (o.successHandler || Xs)(s.response, i), s;
}, Qs = {
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
}, $s = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Zs(e), Qs);
} }), ec = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
y();
var tc = class {
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
}, nc = ((e) => function(t) {
	return rc(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), rc = (e) => e.expiration !== void 0, ic = (e, t, n) => {
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
function ac(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function oc(e) {
	let t = ec(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!ac(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var sc = {
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
}, cc = "", lc = (e) => {
	let { partitions: t } = sc;
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
}, uc = () => cc, dc = /\d{12}\.ddb/;
async function fc(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && Fs(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Os.ADAPTIVE:
				Fs(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Os.STANDARD: Fs(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(dc) && Fs(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				Fs(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				Fs(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": Fs(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && Fs(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) Fs(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var pc = "user-agent", mc = "x-amz-user-agent", hc = /[^!$%&'*+\-.^_`|~\w]/g, gc = /[^!$%&'*+\-.^_`|~\w#]/g, _c = 1024;
function vc(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= _c) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
ce();
var yc = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!v.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(bc) || [], s = (await e.defaultUserAgentProvider()).map(bc);
	await fc(n, e, r);
	let c = n;
	s.push(`m/${vc(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(bc) || [], u = await e.userAgentAppId();
	u && s.push(bc(["app", `${u}`]));
	let d = uc(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[mc] = f : (p && (a[mc] = a["x-amz-user-agent"] ? `${a[pc]} ${p}` : p), a[pc] = f), t({
		...r,
		request: i
	});
}, bc = (e) => {
	let t = e[0].split("/").map((e) => e.replace(hc, "-")).join("/"), n = e[1]?.replace(gc, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, xc = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, Sc = (e) => ({ applyToStack: (t) => {
	t.add(yc(e), xc);
} }), Cc = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? wc.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? wc.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, wc = {
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
yi(), Pr();
var Tc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!Tc(t)) return !1;
		return !0;
	}
	return !(!fe(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || Nr(e));
}, Ec = ":", Dc = "/", Oc = (e) => {
	let t = e.split(Ec);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(Ec) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(Dc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
yi();
var kc = {
	isVirtualHostableS3Bucket: Tc,
	parseArn: Oc,
	partition: lc
};
gr.aws = kc;
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var Ac = (e, t, n) => {
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
var jc = /* @__PURE__ */ new Set(), Mc = (e, t = fe) => {
	if (!jc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else jc.add(e);
}, Nc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), Pc = (e) => Nc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, Fc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = Pc(typeof t == "function" ? await t() : t);
			return Mc(e), e;
		},
		useFipsEndpoint: async () => Nc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, Ic = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], Lc = ({ defaultsMode: e } = {}) => Ac(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(Rc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${Ic.join(", ")}, got ${t}`);
	}
}), Rc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, zc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), Bc = (e) => ({ region: e.region() }), Vc = (e) => Object.assign(e, { useQueueUrlAsEndpoint: e.useQueueUrlAsEndpoint ?? !0 });
function Hc({ useQueueUrlAsEndpoint: e, endpoint: t }) {
	return (n, r) => async (i) => {
		let { input: a } = i, o = r.endpointV2;
		if (!t && a.QueueUrl && o && e) {
			let e = r.logger instanceof ft || !r.logger?.warn ? console : r.logger;
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
var Uc = {
	name: "queueUrlMiddleware",
	relation: "after",
	toMiddleware: "endpointV2Middleware",
	override: !0
}, Wc = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(Hc(e), Uc);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-sqs@3.972.48/node_modules/@aws-sdk/middleware-sdk-sqs/dist-es/receive-message.js
E();
function Gc(e) {
	return (t) => async (n) => {
		let r = await t({ ...n });
		if (e.md5 === !1) return r;
		let i = r.output, a = [];
		if (i.Messages !== void 0) for (let t of i.Messages) {
			let n = t.MD5OfBody, r = new e.md5();
			r.update(w(t.Body || "")), n !== C(await r.digest()) && a.push(t.MessageId);
		}
		if (a.length > 0) throw Error("Invalid MD5 checksum on messages: " + a.join(", "));
		return r;
	};
}
var Kc = {
	step: "initialize",
	tags: ["VALIDATE_BODY_MD5"],
	name: "receiveMessageMiddleware",
	override: !0
}, qc = (e) => ({ applyToStack: (t) => {
	t.add(Gc(e), Kc);
} });
// ../../node_modules/.pnpm/@aws-sdk+middleware-sdk-sqs@3.972.48/node_modules/@aws-sdk/middleware-sdk-sqs/dist-es/send-message.js
E();
var Jc = (e) => (t) => async (n) => {
	let r = await t({ ...n });
	if (e.md5 === !1) return r;
	let i = r.output, a = new e.md5();
	if (a.update(w(n.input.MessageBody || "")), i.MD5OfMessageBody !== C(await a.digest())) throw Error("InvalidChecksumError");
	return r;
}, Yc = {
	step: "initialize",
	tags: ["VALIDATE_BODY_MD5"],
	name: "sendMessageMiddleware",
	override: !0
}, Xc = (e) => ({ applyToStack: (t) => {
	t.add(Jc(e), Yc);
} });
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
ue();
var Zc = (e) => le.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, Qc = (e) => le.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, $c = (e) => new Date(Date.now() + e), el = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e), a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
ce(), re();
var tl = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, nl = (e) => e.context?.[te]?.eventStream?.output === !0, rl = async (e) => {
	let t = tl("context", e.context), n = tl("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await tl("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, il = class {
	async sign(e, t, n) {
		if (!v.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await rl(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || nl(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : $c(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? Zc(n.$response);
				if (t) {
					let r = tl("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = Qc(n.$response), s = el(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = Zc(e);
		if (n) {
			let r = tl("config", t.config), i = t._requestSentAt, a = Qc(e);
			r.systemClockOffset = el(n, r.systemClockOffset, i, a);
		}
	}
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
E();
var al = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!_(e, n)) continue;
			let r = bt(n);
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
				let o = bt(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(cl.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!sl.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Sn(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, ol;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(ol ||= {});
var sl = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, cl = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && ll(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && ll(e), parseInt(C(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function ll(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/constants.js
var ul = "X-Amz-Algorithm", dl = "X-Amz-Credential", fl = "X-Amz-Date", pl = "X-Amz-SignedHeaders", ml = "X-Amz-Expires", hl = "X-Amz-Signature", gl = "X-Amz-Security-Token", _l = "authorization", vl = fl.toLowerCase(), yl = [
	_l,
	vl,
	"date"
];
hl.toLowerCase();
var bl = "x-amz-content-sha256", xl = gl.toLowerCase(), Sl = {
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
}, Cl = /^proxy-/, wl = /^sec-/, Tl = "AWS4-HMAC-SHA256", El = "AWS4-HMAC-SHA256-PAYLOAD", Dl = "UNSIGNED-PAYLOAD", Ol = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
E();
var kl = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!_(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = ho(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${ho(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${ho(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, Al = (e) => jl(e).toISOString().replace(/\.\d{3}Z$/, "Z"), jl = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
_e(), E();
var Ml = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = ge(n), this.credentialProvider = ge(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${kl(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(w(n)), `${r}
${e}
${t}
${C(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return ho(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = Al(e).replace(/[-:]/g, "");
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
E();
var Nl = {}, Pl = [], Fl = (e, t, n) => `${e}/${t}/${n}/${Ol}`, Il = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${C(await Ll(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Nl) return Nl[a];
	for (Pl.push(a); Pl.length > 50;) delete Nl[Pl.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		Ol
	]) o = await Ll(e, o, t);
	return Nl[a] = o;
}, Ll = (e, t, n) => {
	let r = new e(t);
	return r.update(w(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
E();
var Rl = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(_(Sl, a) || t?.has(a) || Cl.test(a) || wl.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Ei(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
E();
var zl = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (_(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Mn(t)) {
		let e = new n();
		return e.update(w(t)), C(await e.digest());
	}
	return Dl;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
E();
var Bl = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (_(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
E(), ce();
var Vl = (e, t = {}) => {
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
E(), ce();
var Hl = (e) => {
	e = v.clone(e);
	for (let t in e.headers) _(e.headers, t) && yl.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
E();
var Ul = class extends Ml {
	headerFormatter = new al();
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
		let m = Fl(p, d, l ?? this.service), h = Vl(Hl(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[gl] = u.sessionToken), h.query[ul] = Tl, h.query[dl] = `${u.accessKeyId}/${m}`, h.query[fl] = f, h.query[ml] = r.toString(10);
		let g = Rl(h, i, o);
		return h.query[pl] = this.getCanonicalHeaderList(g), h.query[hl] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await zl(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = Fl(c, s, a ?? this.service), d = await zl({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			El,
			l,
			u,
			r,
			C(await f.digest()),
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
		return c.update(w(e)), C(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = Hl(e), { longDate: l, shortDate: u } = this.formatDate(t), d = Fl(u, s, a ?? this.service);
		c.headers[vl] = l, o.sessionToken && (c.headers[xl] = o.sessionToken);
		let f = await zl(c, this.sha256);
		!Bl("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[bl] = f);
		let p = Rl(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[_l] = `${Tl} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, Tl), a = new this.sha256(await n);
		return a.update(w(i)), C(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Il(this.sha256, e, n, t, r || this.service);
	}
}, Wl = (e) => (t) => {
	let n = t.credentials, r = !!t.credentials, i;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== i && (r = !0), n = e;
			let a = Kl(t, Gl(t, {
				credentials: n,
				credentialDefaultProvider: t.credentialDefaultProvider
			}));
			if (r && !a.attributed) {
				let e = typeof n == "object" && !!n;
				i = async (t) => {
					let n = await a(t);
					return e && (!n.$source || Object.keys(n.$source).length === 0) ? o(n, "CREDENTIALS_CODE", "e") : n;
				}, i.memoized = a.memoized, i.configBound = a.configBound, i.attributed = !0;
			} else i = a;
		},
		get() {
			return i;
		},
		enumerable: !0,
		configurable: !0
	}), t.credentials = n;
	let { signingEscapePath: a = !0, systemClockOffset: s = t.systemClockOffset || 0, sha256: c } = t, l;
	return l = t.signer ? ec(t.signer) : t.regionInfoProvider ? () => ec(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
			sha256: c,
			uriEscapePath: a
		};
		return new (t.signerConstructor || Ul)(o);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await ec(t.region)(),
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
			uriEscapePath: a
		};
		return new (t.signerConstructor || Ul)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: a,
		signer: l,
		disableClockSkewCorrection: ec(t.disableClockSkewCorrection ?? e)
	});
};
function Gl(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : ic(t, nc, rc) : n ? ec(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function Kl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var ql = Wl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/auth/httpAuthSchemeProvider.js
ae(), _e();
var Jl = async (e, t, n) => ({
	operation: ie(t).operation,
	region: await ge(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function Yl(e) {
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
var Xl = (e) => {
	let t = [];
	return e.operation, t.push(Yl(e)), t;
}, Zl = (e) => {
	let t = ql(e);
	return Object.assign(t, { authSchemePreference: ge(e.authSchemePreference ?? []) });
}, Ql = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "sqs"
}), $l = {
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
}, eu = {
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
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/create-request.js
function tu(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function nu(e = 0) {
	return new Promise((t, n) => {
		e && setTimeout(() => {
			let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
			t.name = "TimeoutError", n(t);
		}, e);
	});
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.0/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
ue();
var ru = { supported: void 0 }, iu = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), ru.supported === void 0 && (ru.supported = typeof Request < "u" && "keepalive" in tu("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = au(t);
			return Promise.reject(e);
		}
		let s = e.path, c = _o(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), ru.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = [o(tu(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new le({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new le({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), nu(r)];
		return t && g.push(new Promise((e, n) => {
			let r = () => {
				n(au(t));
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
function au(e) {
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
x();
var ou = class {
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
		let i = Ye.for(r), a = Ye.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = rt(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return rt(e, t);
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
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.979.1/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
x();
var su = class extends oo {
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
		}), this.serviceTarget = n, this.codec = i ?? new es({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new ou(this.awsQueryCompatible);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`, r.headers["x-amz-target"] = `${this.serviceTarget}.${e.name}`, this.awsQueryCompatible && (r.headers["x-amzn-query-mode"] = "true"), Ee(e.input) !== "unit" && r.body || (r.body = "{}"), r;
	}
	getPayloadCodec() {
		return this.codec;
	}
	async handleError(e, t, n, r, i) {
		let { awsQueryCompatible: a } = this;
		a && this.mixin.setQueryCompatError(r, n);
		let o = Po(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = b.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, cu = class extends su {
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
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/endpoint/bdd.js
yi();
var lu = "ref", uu = -1, du = !0, fu = "isSet", pu = "PartitionResult", mu = "booleanEquals", hu = "getAttr", gu = { [lu]: "Endpoint" }, _u = { [lu]: pu }, vu = {}, yu = [{ [lu]: "Region" }], bu = {
	conditions: [
		[fu, [gu]],
		[fu, yu],
		[
			"aws.partition",
			yu,
			pu
		],
		[mu, [{ [lu]: "UseFIPS" }, du]],
		[mu, [{ [lu]: "UseDualStack" }, du]],
		[mu, [{
			fn: hu,
			argv: [_u, "supportsDualStack"]
		}, du]],
		[mu, [{
			fn: hu,
			argv: [_u, "supportsFIPS"]
		}, du]],
		["stringEquals", [{
			fn: hu,
			argv: [_u, "name"]
		}, "aws-us-gov"]]
	],
	results: [
		[uu],
		[uu, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[uu, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[gu, vu],
		["https://sqs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", vu],
		[uu, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://sqs.{Region}.amazonaws.com", vu],
		["https://sqs-fips.{Region}.{PartitionResult#dnsSuffix}", vu],
		[uu, "FIPS is enabled but this partition does not support FIPS"],
		["https://sqs.{Region}.{PartitionResult#dualStackDnsSuffix}", vu],
		[uu, "DualStack is enabled but this partition does not support DualStack"],
		["https://sqs.{Region}.{PartitionResult#dnsSuffix}", vu],
		[uu, "Invalid Configuration: Missing Region"]
	]
}, xu = 2, Su = new Int32Array([
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
]), Cu = ar.from(Su, xu, bu.conditions, bu.results);
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/endpoint/endpointResolver.js
yi();
var wu = new sr({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), Tu = (e, t = {}) => wu.get(e, () => hi(Cu, {
	endpointParams: e,
	logger: t.logger
}));
gr.aws = kc;
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/models/SQSServiceException.js
var A = class e extends nt {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.sqs#SQSServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, Eu = class e extends A {
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
}, Du = class e extends A {
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
}, Ou = class e extends A {
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
}, ku = class e extends A {
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
}, Au = class e extends A {
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
}, ju = class e extends A {
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
}, Mu = class e extends A {
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
}, Nu = class e extends A {
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
}, Pu = class e extends A {
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
}, Fu = class e extends A {
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
}, Iu = class e extends A {
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
}, Lu = class e extends A {
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
}, Ru = class e extends A {
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
}, zu = class e extends A {
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
}, Bu = class e extends A {
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
}, Vu = class e extends A {
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
}, Hu = class e extends A {
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
}, Uu = class e extends A {
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
}, Wu = class e extends A {
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
}, Gu = class e extends A {
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
}, Ku = class e extends A {
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
}, qu = class e extends A {
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
}, Ju = class e extends A {
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
}, Yu = class e extends A {
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
}, Xu = class e extends A {
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
}, Zu = class e extends A {
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
}, Qu = class e extends A {
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
}, $u = class e extends A {
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
x();
var ed = "AttributeNames", td = "AttributeName", nd = "Attributes", rd = "Attribute", id = "Body", ad = "BatchEntryIdsNotDistinct", od = "BinaryList", sd = "BinaryListValues", cd = "BinaryListValue", ld = "BatchRequestTooLong", ud = "BinaryValue", dd = "CreateQueue", fd = "CreateQueueRequest", pd = "CreateQueueResult", md = "DeleteMessage", hd = "DeleteMessageRequest", gd = "DeleteQueue", _d = "DeleteQueueRequest", vd = "DelaySeconds", yd = "DataType", bd = "EmptyBatchRequest", xd = "GetQueueAttributes", Sd = "GetQueueAttributesRequest", Cd = "GetQueueAttributesResult", wd = "GetQueueUrl", Td = "GetQueueUrlRequest", Ed = "GetQueueUrlResult", Dd = "InvalidAddress", Od = "InvalidAttributeName", kd = "InvalidAttributeValue", Ad = "InvalidBatchEntryId", jd = "InvalidIdFormat", Md = "InvalidMessageContents", Nd = "InvalidSecurity", Pd = "Key", Fd = "KmsAccessDenied", Id = "KmsDisabled", Ld = "KmsInvalidKeyUsage", Rd = "KmsInvalidState", zd = "KmsNotFound", Bd = "KmsOptInRequired", Vd = "KmsThrottled", Hd = "ListQueues", Ud = "ListQueuesRequest", Wd = "ListQueuesResult", Gd = "Message", Kd = "MessageAttributes", qd = "MessageAttributeNames", Jd = "MessageAttributeName", Yd = "MessageAttributeValue", Xd = "MessageAttribute", Zd = "MessageBody", Qd = "MessageBodyAttributeMap", $d = "MessageBodySystemAttributeMap", ef = "MessageDeduplicationId", tf = "MD5OfBody", nf = "MD5OfMessageAttributes", rf = "MD5OfMessageBody", af = "MD5OfMessageSystemAttributes", of = "MessageGroupId", sf = "MessageId", cf = "MessageList", lf = "MessageNotInflight", uf = "MaxNumberOfMessages", df = "MaxResults", ff = "MessageSystemAttributes", pf = "MessageSystemAttributeMap", mf = "MessageSystemAttributeNames", hf = "MessageSystemAttributeValue", gf = "MessageSystemAttribute", _f = "Messages", vf = "Name", yf = "NextToken", bf = "OverLimit", xf = "PurgeQueue", Sf = "PurgeQueueInProgress", Cf = "PurgeQueueRequest", wf = "QueueAttributeMap", Tf = "QueueDoesNotExist", Ef = "QueueDeletedRecently", Df = "QueueName", Of = "QueueNameExists", kf = "QueueNamePrefix", Af = "QueueOwnerAWSAccountId", j = "QueueUrl", jf = "QueueUrls", Mf = "ReceiptHandle", Nf = "ReceiptHandleIsInvalid", Pf = "ReceiveMessage", Ff = "ReceiveMessageRequest", If = "ReceiveMessageResult", Lf = "ResourceNotFoundException", Rf = "ReceiveRequestAttemptId", zf = "RequestThrottled", Bf = "StringList", Vf = "StringListValues", Hf = "StringListValue", Uf = "SendMessage", Wf = "SendMessageRequest", Gf = "SendMessageResult", Kf = "SequenceNumber", qf = "SetQueueAttributes", Jf = "SetQueueAttributesRequest", Yf = "StringValue", Xf = "Tag", Zf = "TagMap", Qf = "TooManyEntriesInBatchRequest", $f = "UnsupportedOperation", ep = "Value", tp = "VisibilityTimeout", np = "WaitTimeSeconds", M = "awsQueryError", N = "client", P = "error", F = "httpError", I = "message", rp = "smithy.ts.sdk.synthetic.com.amazonaws.sqs", ip = "tags", L = "xmlFlattened", R = "xmlName", z = "com.amazonaws.sqs", ap = new Ye(rp), op = [
	-3,
	rp,
	"SQSServiceException",
	0,
	[],
	[]
];
ap.registerError(op, A);
var B = new Ye(z), sp = [
	-3,
	z,
	ad,
	{
		[M]: ["AWS.SimpleQueueService.BatchEntryIdsNotDistinct", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(sp, Fu);
var cp = [
	-3,
	z,
	ld,
	{
		[M]: ["AWS.SimpleQueueService.BatchRequestTooLong", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(cp, $u);
var lp = [
	-3,
	z,
	bd,
	{
		[M]: ["AWS.SimpleQueueService.EmptyBatchRequest", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(lp, Iu);
var up = [
	-3,
	z,
	Dd,
	{
		[M]: ["InvalidAddress", 404],
		[P]: N,
		[F]: 404
	},
	[I],
	[0]
];
B.registerError(up, Eu);
var dp = [
	-3,
	z,
	Od,
	{ [P]: N },
	[I],
	[0]
];
B.registerError(dp, zu);
var fp = [
	-3,
	z,
	kd,
	{ [P]: N },
	[I],
	[0]
];
B.registerError(fp, Bu);
var pp = [
	-3,
	z,
	Ad,
	{
		[M]: ["AWS.SimpleQueueService.InvalidBatchEntryId", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(pp, Lu);
var mp = [
	-3,
	z,
	jd,
	{ [P]: N },
	[],
	[]
];
B.registerError(mp, Uu);
var hp = [
	-3,
	z,
	Md,
	{ [P]: N },
	[I],
	[0]
];
B.registerError(hp, Qu);
var gp = [
	-3,
	z,
	Nd,
	{
		[M]: ["InvalidSecurity", 403],
		[P]: N,
		[F]: 403
	},
	[I],
	[0]
];
B.registerError(gp, Du);
var _p = [
	-3,
	z,
	Fd,
	{
		[M]: ["KMS.AccessDeniedException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(_p, Gu);
var vp = [
	-3,
	z,
	Id,
	{
		[M]: ["KMS.DisabledException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(vp, Ku);
var yp = [
	-3,
	z,
	Ld,
	{
		[M]: ["KMS.InvalidKeyUsageException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(yp, qu);
var bp = [
	-3,
	z,
	Rd,
	{
		[M]: ["KMS.InvalidStateException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(bp, Ju);
var xp = [
	-3,
	z,
	zd,
	{
		[M]: ["KMS.NotFoundException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(xp, Yu);
var Sp = [
	-3,
	z,
	Bd,
	{
		[M]: ["KMS.OptInRequired", 403],
		[P]: N,
		[F]: 403
	},
	[I],
	[0]
];
B.registerError(Sp, Xu);
var Cp = [
	-3,
	z,
	Vd,
	{
		[M]: ["KMS.ThrottlingException", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(Cp, Zu);
var wp = [
	-3,
	z,
	lf,
	{
		[M]: ["AWS.SimpleQueueService.MessageNotInflight", 400],
		[P]: N,
		[F]: 400
	},
	[],
	[]
];
B.registerError(wp, Nu);
var Tp = [
	-3,
	z,
	bf,
	{
		[M]: ["OverLimit", 403],
		[P]: N,
		[F]: 403
	},
	[I],
	[0]
];
B.registerError(Tp, Ou);
var Ep = [
	-3,
	z,
	Sf,
	{
		[M]: ["AWS.SimpleQueueService.PurgeQueueInProgress", 403],
		[P]: N,
		[F]: 403
	},
	[I],
	[0]
];
B.registerError(Ep, Wu);
var Dp = [
	-3,
	z,
	Ef,
	{
		[M]: ["AWS.SimpleQueueService.QueueDeletedRecently", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(Dp, Vu);
var Op = [
	-3,
	z,
	Tf,
	{
		[M]: ["AWS.SimpleQueueService.NonExistentQueue", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(Op, ku);
var kp = [
	-3,
	z,
	Of,
	{
		[M]: ["QueueAlreadyExists", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(kp, Hu);
var Ap = [
	-3,
	z,
	Nf,
	{
		[M]: ["ReceiptHandleIsInvalid", 404],
		[P]: N,
		[F]: 404
	},
	[I],
	[0]
];
B.registerError(Ap, Pu);
var jp = [
	-3,
	z,
	zf,
	{
		[M]: ["RequestThrottled", 403],
		[P]: N,
		[F]: 403
	},
	[I],
	[0]
];
B.registerError(jp, Au);
var Mp = [
	-3,
	z,
	Lf,
	{
		[M]: ["ResourceNotFoundException", 404],
		[P]: N,
		[F]: 404
	},
	[I],
	[0]
];
B.registerError(Mp, Mu);
var Np = [
	-3,
	z,
	Qf,
	{
		[M]: ["AWS.SimpleQueueService.TooManyEntriesInBatchRequest", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(Np, Ru);
var Pp = [
	-3,
	z,
	$f,
	{
		[M]: ["AWS.SimpleQueueService.UnsupportedOperation", 400],
		[P]: N,
		[F]: 400
	},
	[I],
	[0]
];
B.registerError(Pp, ju);
var Fp = [ap, B], Ip = [
	3,
	z,
	fd,
	0,
	[
		Df,
		nd,
		ip
	],
	[
		0,
		[() => cm, {
			[L]: 1,
			[R]: rd
		}],
		[() => lm, {
			[L]: 1,
			[R]: Xf
		}]
	],
	1
], Lp = [
	3,
	z,
	pd,
	0,
	[j],
	[0]
], Rp = [
	3,
	z,
	hd,
	0,
	[j, Mf],
	[0, 0],
	2
], zp = [
	3,
	z,
	_d,
	0,
	[j],
	[0],
	1
], Bp = [
	3,
	z,
	Sd,
	0,
	[j, ed],
	[0, [64, {
		[L]: 1,
		[R]: td
	}]],
	1
], Vp = [
	3,
	z,
	Cd,
	0,
	[nd],
	[[() => cm, {
		[L]: 1,
		[R]: rd
	}]]
], Hp = [
	3,
	z,
	Td,
	0,
	[Df, Af],
	[0, 0],
	1
], Up = [
	3,
	z,
	Ed,
	0,
	[j],
	[0]
], Wp = [
	3,
	z,
	Ud,
	0,
	[
		kf,
		yf,
		df
	],
	[
		0,
		0,
		1
	]
], Gp = [
	3,
	z,
	Wd,
	0,
	[jf, yf],
	[[64, {
		[L]: 1,
		[R]: j
	}], 0]
], Kp = [
	3,
	z,
	Gd,
	0,
	[
		sf,
		Mf,
		tf,
		id,
		nd,
		nf,
		Kd
	],
	[
		0,
		0,
		0,
		0,
		[() => sm, {
			[L]: 1,
			[R]: rd
		}],
		0,
		[() => am, {
			[L]: 1,
			[R]: Xd
		}]
	]
], qp = [
	3,
	z,
	Yd,
	0,
	[
		yd,
		Yf,
		ud,
		Vf,
		sd
	],
	[
		0,
		0,
		21,
		[() => im, {
			[L]: 1,
			[R]: Hf
		}],
		[() => nm, {
			[L]: 1,
			[R]: cd
		}]
	],
	1
], Jp = [
	3,
	z,
	hf,
	0,
	[
		yd,
		Yf,
		ud,
		Vf,
		sd
	],
	[
		0,
		0,
		21,
		[() => im, {
			[L]: 1,
			[R]: Hf
		}],
		[() => nm, {
			[L]: 1,
			[R]: cd
		}]
	],
	1
], Yp = [
	3,
	z,
	Cf,
	0,
	[j],
	[0],
	1
], Xp = [
	3,
	z,
	Ff,
	0,
	[
		j,
		ed,
		mf,
		qd,
		uf,
		tp,
		np,
		Rf
	],
	[
		0,
		[64, {
			[L]: 1,
			[R]: td
		}],
		[64, {
			[L]: 1,
			[R]: td
		}],
		[64, {
			[L]: 1,
			[R]: Jd
		}],
		1,
		1,
		1,
		0
	],
	1
], Zp = [
	3,
	z,
	If,
	0,
	[_f],
	[[() => rm, {
		[L]: 1,
		[R]: Gd
	}]]
], Qp = [
	3,
	z,
	Wf,
	0,
	[
		j,
		Zd,
		vd,
		Kd,
		ff,
		ef,
		of
	],
	[
		0,
		0,
		1,
		[() => am, {
			[L]: 1,
			[R]: Xd
		}],
		[() => om, {
			[L]: 1,
			[R]: gf
		}],
		0,
		0
	],
	2
], $p = [
	3,
	z,
	Gf,
	0,
	[
		rf,
		nf,
		af,
		sf,
		Kf
	],
	[
		0,
		0,
		0,
		0,
		0
	]
], em = [
	3,
	z,
	Jf,
	0,
	[j, nd],
	[0, [() => cm, {
		[L]: 1,
		[R]: rd
	}]],
	2
], tm = "unit", nm = [
	1,
	z,
	od,
	0,
	[21, { [R]: cd }]
], rm = [
	1,
	z,
	cf,
	0,
	[() => Kp, 0]
], im = [
	1,
	z,
	Bf,
	0,
	[0, { [R]: Hf }]
], am = [
	2,
	z,
	Qd,
	0,
	[0, { [R]: vf }],
	[() => qp, { [R]: ep }]
], om = [
	2,
	z,
	$d,
	0,
	[0, { [R]: vf }],
	[() => Jp, { [R]: ep }]
], sm = [
	2,
	z,
	pf,
	0,
	[0, { [R]: vf }],
	[0, { [R]: ep }]
], cm = [
	2,
	z,
	wf,
	0,
	[0, { [R]: vf }],
	[0, { [R]: ep }]
], lm = [
	2,
	z,
	Zf,
	0,
	[0, { [R]: Pd }],
	[0, { [R]: ep }]
], um = [
	9,
	z,
	dd,
	0,
	() => Ip,
	() => Lp
], dm = [
	9,
	z,
	md,
	0,
	() => Rp,
	() => tm
], fm = [
	9,
	z,
	gd,
	0,
	() => zp,
	() => tm
], pm = [
	9,
	z,
	xd,
	0,
	() => Bp,
	() => Vp
], mm = [
	9,
	z,
	wd,
	0,
	() => Hp,
	() => Up
], hm = [
	9,
	z,
	Hd,
	0,
	() => Wp,
	() => Gp
], gm = [
	9,
	z,
	xf,
	0,
	() => Yp,
	() => tm
], _m = [
	9,
	z,
	Pf,
	0,
	() => Xp,
	() => Zp
], vm = [
	9,
	z,
	Uf,
	0,
	() => Qp,
	() => $p
], ym = [
	9,
	z,
	qf,
	0,
	() => em,
	() => tm
];
ia(), xe(), E();
var bm = (e) => ({
	apiVersion: "2012-11-05",
	base64Decoder: e?.base64Decoder ?? vt,
	base64Encoder: e?.base64Encoder ?? St,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Tu,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? Xl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new il()
	}],
	logger: e?.logger ?? new ft(),
	md5: e?.md5 ?? Fi,
	protocol: e?.protocol ?? cu,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.sqs",
		errorTypeRegistries: Fp,
		version: "2012-11-05",
		serviceTarget: "AmazonSQS",
		awsQueryCompatible: !0
	},
	serviceId: e?.serviceId ?? "SQS",
	sha256: e?.sha256 ?? na,
	urlParser: e?.urlParser ?? be,
	utf8Decoder: e?.utf8Decoder ?? bt,
	utf8Encoder: e?.utf8Encoder ?? Et
});
E(), Ti();
var xm = (e) => {
	let t = Lc(e), n = () => t().then(it), r = bm(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? Dn,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? Cc({
			serviceId: r.serviceId,
			clientVersion: eu.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? we("Region is missing"),
		requestHandler: iu.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || ks),
		streamCollector: e?.streamCollector ?? wi,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, Sm = (e) => {
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
}, Cm = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), wm = (e, t) => {
	let n = Object.assign(zc(e), ut(e), co(e), Sm(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, Bc(n), dt(n), lo(n), Cm(n));
};
yi(), x();
var Tm = class extends Te {
	config;
	constructor(...[e]) {
		let t = xm(e || {});
		super(t), this.initConfig = t;
		let n = Is(Fc(Ns(oc(Ql(t))))), r = wm(Zl(Vc(_i(n))), e?.extensions || []);
		this.config = r, this.middlewareStack.use(Fe(this.config)), this.middlewareStack.use(Sc(this.config)), this.middlewareStack.use(Ps(this.config)), this.middlewareStack.use(mo(this.config)), this.middlewareStack.use(zs(this.config)), this.middlewareStack.use(Hs(this.config)), this.middlewareStack.use(Us(this.config)), this.middlewareStack.use(Wc(this.config)), this.middlewareStack.use(Js(this.config, {
			httpAuthSchemeParametersProvider: Jl,
			identityProviderConfigProvider: async (e) => new tc({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use($s(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-sqs@3.1156.0/node_modules/@aws-sdk/client-sqs/dist-es/commandBuilder.js
yi();
var V = pt($l, "AmazonSQS", "SQSClient", vi), H = {}, Em = (e, t, n, r) => [], Dm = (e, t, n, r) => [qc(n), a(n)], Om = (e, t, n, r) => [Xc(n)], km = class extends V(H, Em, "CreateQueue", um) {}, Am = class extends V(H, Em, "DeleteMessage", dm) {}, jm = class extends V(H, Em, "DeleteQueue", fm) {}, Mm = class extends V(H, Em, "GetQueueAttributes", pm) {}, Nm = class extends V(H, Em, "GetQueueUrl", mm) {}, Pm = class extends V(H, Em, "ListQueues", hm) {}, Fm = class extends V(H, Em, "PurgeQueue", gm) {}, Im = class extends V(H, Dm, "ReceiveMessage", _m) {}, Lm = class extends V(H, Om, "SendMessage", vm) {}, Rm = class extends V(H, Em, "SetQueueAttributes", ym) {}, zm = class extends Error {
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
}, Bm = Symbol(), Vm = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), Hm = 1e4, Um = (e) => "headers" in e, Wm = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (Um(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? Gm(e, {
		all: n,
		dot: r
	}) : {};
};
async function Gm(e, t) {
	if (!Um(e) && e.bodyCache.formData) return Km(await e.bodyCache.formData, t);
	let n = Um(e) ? e.headers : e.raw.headers, r = Vm(await e.arrayBuffer(), n.get("Content-Type") || "");
	Um(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? Km(i, t) : {};
}
function Km(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? qm(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (Jm(n, e, t, r), delete n[e]);
	}), n;
}
var qm = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, Jm = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && Ym(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= Hm && Ym(), i[e] = Object.create(null)), i = i[e]);
	});
}, Ym = () => {
	throw Error("Nesting limit exceeded");
}, Xm = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, Zm = (e) => {
	let { groups: t, path: n } = Qm(e);
	return $m(Xm(n), t);
}, Qm = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, $m = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, eh = {}, th = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return eh[r] || (eh[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), eh[r];
	}
	return null;
}, nh = (e, t) => {
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
}, rh = (e) => nh(e, decodeURI), ih = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return rh(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, ah = (e) => {
	let t = ih(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, oh = (e, t, ...n) => (n.length && (t = oh(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), sh = (e) => {
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
}, ch = (e) => e.indexOf("%") === -1 ? e : nh(e, ph), lh = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), ch(e)), uh = (e, t, n) => {
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
					return lh(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = lh(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = lh(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, dh = uh, fh = (e, t) => uh(e, t, !0), ph = decodeURIComponent, mh = class {
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
		return n && ch(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = ch(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return dh(this.url, e);
	}
	queries(e) {
		return fh(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return Wm(this, e);
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
	get [Bm]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, hh = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, gh = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, _h = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => _h(e, t, !1, r, i))).then(() => i[0]));
	return n ? gh(await o, a) : o;
}, vh = "text/plain; charset=UTF-8", yh = (e, t) => ({
	"Content-Type": e,
	...t
}), bh = (e, t) => new Response(e, t), xh = class {
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
		return this.#t ??= new mh(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= bh(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = bh(e.body, e);
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
		this.finalized && (this.#a = bh(this.#a.body, this.#a));
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
		return bh(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, yh(vh, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, yh("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, yh("text/html; charset=UTF-8", n));
		return typeof e == "object" ? _h(e, hh.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => bh(), this.#c(this));
}, Sh = (e, t, n) => (r, i) => {
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
}, Ch = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], wh = "Can not add a route since the matcher is already built.", Th = class extends Error {}, Eh = "__COMPOSED_HANDLER", Dh = (e) => e.text("404 Not Found", 404), Oh = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, kh = class e {
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
		[...Ch, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? ih : ah;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = Dh;
	errorHandler = Oh;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === Oh ? r = e.handler : (r = async (n, r) => (await Sh([], t.errorHandler)(n, () => e.handler(n, r))).res, r[Eh] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = oh(this._basePath, e), t;
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
			let t = oh(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", oh(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = oh(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : oh(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new xh(e, {
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
		let s = Sh(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${oh("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, U = () => Object.create(null), Ah = [];
function jh(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], Ah];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var Mh = "[^/]+", Nh = "(?:|/.*)", Ph = Symbol(), Fh = /* @__PURE__ */ new Set(".\\+*[^]$()");
function Ih(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var Lh = class e {
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
				Mh
			] : null : s === "/*" ? [
				"",
				"",
				Nh
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && Fh.has(n))) throw Ph;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw Ph;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw Ph;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw Ph;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(Ih).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : Fh.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, Rh = class {
	#e = { varIndex: 0 };
	#t = new Lh();
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
}, zh = U();
function Bh(e) {
	return zh[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? Nh : e === "*" ? ".*" : `/:${Mh}`)}$`);
}
function Vh(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (Bh(n).test(t)) return [...e[n]];
}
var Hh = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: U() }, this.#t = { ALL: U() }, this.#n = { ALL: new Rh() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === Ph ? new Th(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(wh);
		if (!r[e]) {
			this.#n[e] = new Rh();
			for (let t of [r, i]) {
				t[e] = U();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = Bh(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = Vh(r[e], t) || Vh(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = sh(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = Vh(r[t], e) || Vh(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = jh;
	buildAllMatchers() {
		let e = U();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, zh = U(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = U(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), U())]) : i[t] = [n.map(([e]) => [e, U()]), Ah];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, Uh = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(wh);
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
				if (e instanceof Th) continue;
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
}, Wh = U(), Gh = 0, Kh = class e {
	#e = [];
	#t = U();
	#n = [];
	#r;
	#i = Wh;
	insert(t, n, r) {
		let i = this, a = Zm(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = th(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++Gh
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
		this.#i = Wh;
		let r = [this], i = Xm(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === Wh ? {} : { ...p.#i };
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
}, qh = class {
	name = "TrieRouter";
	#e = new Kh();
	add(e, t, n) {
		for (let r of sh(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, Jh = class extends kh {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new Uh({ routers: [new Hh(), new qh()] });
	}
}, Yh = [
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
}, Xh = class extends W {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, K = class extends W {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, Zh = class extends W {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, Qh = class extends W {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, q = class extends W {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, $h = class extends W {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, eg = class extends W {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, tg = class extends W {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, ng = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function rg(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && ng.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function ig(e, t) {
	let n = ag(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function ag(e, t) {
	if (e instanceof W) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return rg(e) ? new eg(r, { cause: e }) : new tg(r, { cause: e });
}
var og = 1e3, sg = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function cg(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new G("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new G("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new G("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = lg(r)), a;
}
function lg(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new G("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!sg.includes(t)) throw new G(`sortKey.operator must be one of ${sg.join(", ")}.`);
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
function ug(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new G(`limit must be a whole number between 1 and ${og}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new G(`limit must be between 1 and ${og}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var dg = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], fg = {
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
}, pg = Object.keys(fg).map((e) => ({
	service: e,
	...fg[e]
})).sort(_g);
pg.map((e) => e.service);
function J(e) {
	return Object.hasOwn(fg, e);
}
function mg(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function hg(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function gg(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function _g(e, t) {
	let n = dg.indexOf(e.group) - dg.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var vg = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function yg(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${vg[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var bg = /* @__PURE__ */ new Set([
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
]), xg = /* @__PURE__ */ new Set([
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
]), Sg = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), Cg = /* @__PURE__ */ new Set([
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
]), wg = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), Tg = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), Eg = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function Dg(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function Og(e) {
	if (!Dg(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || bg.has(n)) return new Qh(r, i);
	if (xg.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new Zh(r, i);
	if (Sg.has(n)) return new Xh(r, i);
	if (Cg.has(n)) return new G(r, i);
	if (wg.has(n) || /\.NotFound$/.test(n)) return new K(r, i);
	if (Tg.has(n)) return new $h(r, i);
	if (Eg.has(n) || rg(e)) return new eg(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new G(r, i) : a === 401 || a === 403 ? new Xh(r, i) : a === 404 ? new K(r, i) : a === 409 ? new Zh(r, i) : a === 429 ? new Qh(r, i) : a === 501 ? new $h(r, i) : a === 503 || a === 504 ? new eg(r, i) : new tg(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function kg() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function Ag(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var jg = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, Mg = !1;
function Ng(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = Pg(t);
	return !n && !Mg && (Mg = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function Pg(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(jg, t) ? jg[t] : null;
}
var Fg = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), Ig = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), Lg = 5464, Rg = 8192, zg = 50, Bg = 12e4;
function Vg(e, t = kg) {
	let n = new Jh();
	n.onError((e, t) => {
		if (e instanceof W) {
			let { status: n, body: r } = ig(e);
			return t.json(r, n);
		}
		return e instanceof zm ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : Ng();
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
		return r_(e, 150), Q(e, () => Ag(Bg, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: a_(i.schema(t, n), (t) => e.req.query(t))
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
			if (n.logGroupNames.length > zg) throw new G(`logGroupNames must include at most ${zg} log groups.`);
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
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), t_(e));
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
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), t_(e));
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
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", n_(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), t_(e));
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
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", n_(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = Z(e);
		if (!t) throw new K("Unknown cloud or service");
		return Q(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), cg(n), n_(n));
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
			let i = await Jg(e);
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
			let i = Gg((await Jg(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!Y(t) || !J(n)) throw new K("Unknown cloud or service");
		let i = Kg(e.req.query());
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
		return i_(e, async () => {
			let n = await Yg(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: e_(n.plaintextBase64, "plaintextBase64", Lg),
				encryptionAlgorithm: Xg(n.encryptionAlgorithm),
				encryptionContext: $g(n.encryptionContext)
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
		return i_(e, async () => {
			let n = await Yg(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: e_(n.ciphertextBlobBase64, "ciphertextBlobBase64", Rg),
				encryptionAlgorithm: Xg(n.encryptionAlgorithm),
				encryptionContext: $g(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of Yh) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
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
		return i_(e, async () => {
			let n = await Yg(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: e_(n.messageBase64, "messageBase64", Lg),
				signingAlgorithm: Zg(n.signingAlgorithm)
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
		return i_(e, async () => {
			let n = await Yg(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: e_(n.messageBase64, "messageBase64", Lg),
				signature: e_(n.signatureBase64, "signatureBase64", Rg),
				keyVersionId: Qg(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: Zg(n.signingAlgorithm)
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
			let i = await Jg(e), a = await r(e).createResource(t, n, { values: i });
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
			let i = qg(await Jg(e));
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
var Hg = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], Ug = 100, Wg = 100;
function Gg(e) {
	if (!Array.isArray(e) || e.length === 0) throw new G("messages must contain at least one entry");
	if (e.length > Wg) throw new G(`messages must contain at most ${Wg} entries`);
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
function Kg(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new G("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!Hg.includes(n)) throw new G(`cursorType must be one of ${Hg.join(", ")}`);
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
		if (!Number.isInteger(t) || t < 1 || t > Ug) throw new G(`limit must be an integer between 1 and ${Ug}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function qg(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new G(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function Jg(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new G("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof G ? e : new G("Request body must be valid JSON");
	}
}
var X = class extends G {};
async function Yg(e) {
	try {
		return await Jg(e);
	} catch (e) {
		throw e instanceof G ? new X(e.message) : e;
	}
}
function Xg(e) {
	if (typeof e != "string" || !Fg.has(e)) throw new X("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function Zg(e) {
	if (typeof e != "string" || !Ig.has(e)) throw new X("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function Qg(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new X(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function $g(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new X("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new X("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function e_(e, t, n) {
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
function t_(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: ug(e.req.query("limit"))
	};
}
function n_(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new G("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new G("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: ug(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function r_(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function Q(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = ig(t, Og);
		return e.json(r, n);
	}
}
async function i_(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = ig(t, Og);
		if (t instanceof X) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function a_(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
Vg();
// ../api/src/registry/CloudAdapterRegistry.ts
var o_ = class {
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
}, s_ = async () => {}, c_ = {
	aws: s_,
	azure: s_,
	gcp: s_,
	oci: s_
};
function l_() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var u_ = 5e3, d_ = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = c_, n = Ng(), r = null) {
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
		return Promise.all(pg.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? mg(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: hg(t, e),
				docsUrl: yg(t, e),
				availability: a,
				reason: r.reason ?? f_(a, e, o),
				route: gg(t, e),
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
			endpoint: l_(e),
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
		if (r && Date.now() - r.at < u_) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = l_(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = ig(r, Og);
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
		if (t && Date.now() - t.at < u_) return t.value;
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
		let i = r.emptyBucket.bind(r), a = p_(e, t);
		if (this.emptying.has(a)) throw new Zh(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new Zh(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = p_(e, t);
		if (this.emptying.has(r)) throw new Zh(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
function f_(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function p_(e, t) {
	return JSON.stringify([e, t]);
}
// ../api/src/cloud-spi/messagingSchema.ts
var m_ = [
	{
		name: "name",
		label: "Name"
	},
	{
		name: "type",
		label: "Type"
	},
	{
		name: "messages",
		label: "Messages",
		path: "metadata.approximateMessages"
	},
	{
		name: "createdAt",
		label: "Created At",
		format: "datetime"
	}
], h_ = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}];
function g_(e) {
	return [
		{
			name: "list",
			label: `List ${e}s`,
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "create",
			label: `Create ${e}`,
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "delete",
			label: `Delete ${e}`,
			enabled: !0,
			status: "available",
			runtimeRequired: !0
		},
		{
			name: "inspect",
			label: `Inspect ${e}`,
			enabled: !0,
			status: "available",
			runtimeRequired: !1
		}
	];
}
var __ = [
	{
		name: "sendMessage",
		label: "Send Message",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "receiveMessages",
		label: "Receive Messages",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "deleteMessage",
		label: "Delete Message",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "purgeQueue",
		label: "Purge Queue",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	}
], $ = {
	queueName: {
		pattern: "^([A-Za-z0-9_-]{1,80}|[A-Za-z0-9_-]{1,75}\\.fifo)$",
		message: "Use a valid SQS queue name: up to 80 alphanumeric characters, hyphens, or underscores."
	},
	visibilityTimeout: {
		pattern: "^(0|[1-9][0-9]{0,3}|[1-3][0-9]{4}|4[0-2][0-9]{3}|43[01][0-9]{2}|43200)$",
		message: "Use a whole number of seconds between 0 and 43200."
	},
	messageRetentionPeriod: {
		pattern: "^([6-9][0-9]|[1-9][0-9]{2,5}|1[01][0-9]{5}|120[0-8][0-9]{3}|1209[0-5][0-9]{2}|1209600)$",
		message: "Use a whole number of seconds between 60 and 1209600."
	},
	delaySeconds: {
		pattern: "^(0|[1-9][0-9]?|[1-8][0-9]{2}|900)$",
		message: "Use a whole number of seconds between 0 and 900."
	},
	maximumMessageSizeKb: {
		pattern: "^([1-9][0-9]{0,2}|10[01][0-9]|102[0-4])$",
		message: "Use a whole number of KB between 1 and 1024."
	},
	receiveMessageWaitTimeSeconds: {
		pattern: "^(0|[1-9]|1[0-9]|20)$",
		message: "Use a whole number of seconds between 0 and 20."
	}
};
function v_() {
	return {
		cloud: "aws",
		service: "messaging",
		displayName: "AWS SQS",
		fields: [
			{
				name: "queueName",
				label: "Queue Name",
				type: "text",
				required: !0,
				description: "Up to 80 alphanumeric characters, hyphens, or underscores (FIFO queues must end in .fifo).",
				validation: $.queueName
			},
			{
				name: "visibilityTimeout",
				label: "Visibility Timeout",
				type: "text",
				required: !1,
				description: "Seconds a received message stays hidden (0-43200). Defaults to 30.",
				validation: $.visibilityTimeout
			},
			{
				name: "messageRetentionPeriod",
				label: "Retention Period",
				type: "text",
				required: !1,
				description: "Seconds a message is kept (60-1209600). Defaults to 345600 (4 days).",
				validation: $.messageRetentionPeriod
			},
			{
				name: "delaySeconds",
				label: "Delivery Delay",
				type: "text",
				required: !1,
				description: "Delivery delay for all messages sent to the queue (0-900 seconds). Defaults to 0.",
				validation: $.delaySeconds
			},
			{
				name: "maximumMessageSizeKb",
				label: "Maximum Message Size (KB)",
				type: "text",
				required: !1,
				description: "Maximum message size in KB (1-1024). Defaults to 1024 (1 MB).",
				validation: $.maximumMessageSizeKb
			},
			{
				name: "receiveMessageWaitTimeSeconds",
				label: "Receive Wait Time",
				type: "text",
				required: !1,
				description: "Wait time for ReceiveMessage calls (0-20 seconds). Defaults to 0.",
				validation: $.receiveMessageWaitTimeSeconds
			}
		],
		actions: [
			"list",
			"create",
			"update",
			"inspect",
			"delete"
		],
		filters: h_,
		columns: m_,
		updateFields: [
			{
				name: "visibilityTimeout",
				label: "Visibility Timeout",
				type: "text",
				required: !1,
				valuePath: "metadata.visibilityTimeout",
				description: "Seconds a received message stays hidden (0-43200).",
				validation: $.visibilityTimeout
			},
			{
				name: "messageRetentionPeriod",
				label: "Retention Period",
				type: "text",
				required: !1,
				valuePath: "metadata.messageRetentionPeriod",
				description: "Seconds a message is kept (60-1209600).",
				validation: $.messageRetentionPeriod
			},
			{
				name: "delaySeconds",
				label: "Delivery Delay",
				type: "text",
				required: !1,
				valuePath: "metadata.delaySeconds",
				description: "Delivery delay for all messages sent to the queue (0-900 seconds).",
				validation: $.delaySeconds
			},
			{
				name: "maximumMessageSizeKb",
				label: "Maximum Message Size (KB)",
				type: "text",
				required: !1,
				valuePath: "metadata.maximumMessageSizeKb",
				description: "Maximum message size in KB (1-1024).",
				validation: $.maximumMessageSizeKb
			},
			{
				name: "receiveMessageWaitTimeSeconds",
				label: "Receive Wait Time",
				type: "text",
				required: !1,
				valuePath: "metadata.receiveMessageWaitTimeSeconds",
				description: "Wait time for ReceiveMessage calls (0-20 seconds).",
				validation: $.receiveMessageWaitTimeSeconds
			}
		],
		capabilities: { resourceActions: [
			...g_("queue"),
			{
				name: "update",
				label: "Update queue",
				enabled: !0,
				status: "available",
				runtimeRequired: !0
			},
			...__
		] }
	};
}
// ../api/src/adapter-aws/AwsSqsAdapter.ts
var y_ = class {
	sqs;
	cloud = "aws";
	service = "messaging";
	constructor(e = void 0) {
		this.sqs = e;
	}
	schema() {
		return v_();
	}
	async list(e = {}) {
		let t = (await this.sqs.send(new Pm({}))).QueueUrls ?? [];
		return O_(await Promise.all(t.map(async (e) => b_(w_(e), e, await this.attributesFor(e).catch(() => ({}))))), e.search);
	}
	async get(e) {
		let t = await this.queueUrl(e);
		return t ? b_(e, t, await this.attributesFor(t)) : null;
	}
	async create(e) {
		let t = T_(e.values.queueName ?? e.values.name);
		if (!t) throw new G("queueName is required");
		if (!A_(t)) throw new G("Use a valid SQS queue name: up to 80 alphanumeric characters, hyphens, or underscores.");
		let n = {}, r = E_(e.values.visibilityTimeout, "visibilityTimeout", 0, 43200), i = E_(e.values.messageRetentionPeriod, "messageRetentionPeriod", 60, 1209600), a = E_(e.values.delaySeconds, "delaySeconds", 0, 900), o = D_(e.values), s = E_(e.values.receiveMessageWaitTimeSeconds, "receiveMessageWaitTimeSeconds", 0, 20);
		r && (n.VisibilityTimeout = r), i && (n.MessageRetentionPeriod = i), a && (n.DelaySeconds = a), o && (n.MaximumMessageSize = o), s && (n.ReceiveMessageWaitTimeSeconds = s), k_(t) && (n.FifoQueue = "true");
		let c = (await this.sqs.send(new km({
			QueueName: t,
			...Object.keys(n).length > 0 ? { Attributes: n } : {}
		}))).QueueUrl ?? await this.queueUrl(t) ?? "";
		return b_(t, c, await this.attributesFor(c).catch(() => ({})));
	}
	async update(e, t) {
		let n = await this.requireQueueUrl(e), r = t.values ?? {}, i = {};
		if (r.visibilityTimeout !== void 0) {
			let e = E_(r.visibilityTimeout, "visibilityTimeout", 0, 43200);
			e && (i.VisibilityTimeout = e);
		}
		if (r.messageRetentionPeriod !== void 0) {
			let e = E_(r.messageRetentionPeriod, "messageRetentionPeriod", 60, 1209600);
			e && (i.MessageRetentionPeriod = e);
		}
		if (r.delaySeconds !== void 0) {
			let e = E_(r.delaySeconds, "delaySeconds", 0, 900);
			e && (i.DelaySeconds = e);
		}
		if (r.maximumMessageSizeKb !== void 0 || r.maximumMessageSize !== void 0) {
			let e = D_(r);
			e && (i.MaximumMessageSize = e);
		}
		if (r.receiveMessageWaitTimeSeconds !== void 0) {
			let e = E_(r.receiveMessageWaitTimeSeconds, "receiveMessageWaitTimeSeconds", 0, 20);
			e && (i.ReceiveMessageWaitTimeSeconds = e);
		}
		if (Object.keys(i).length === 0) throw new G("At least one queue attribute must be provided to update.");
		return await this.sqs.send(new Rm({
			QueueUrl: n,
			Attributes: i
		})), b_(e, n, await this.attributesFor(n).catch(() => ({})));
	}
	async delete(e) {
		let t = await this.queueUrl(e);
		if (!t) throw new K(`Queue ${e} does not exist`);
		await this.sqs.send(new jm({ QueueUrl: t }));
	}
	async sendMessage(e, t, n) {
		let r = await this.requireQueueUrl(e), i = n ? Object.fromEntries(Object.entries(n).map(([e, t]) => [e, {
			DataType: "String",
			StringValue: t
		}])) : {}, a = await this.sqs.send(new Lm({
			QueueUrl: r,
			MessageBody: t,
			...Object.keys(i).length > 0 ? { MessageAttributes: i } : {},
			...k_(e) ? { MessageGroupId: e.replace(/\.fifo$/, "") } : {}
		}));
		return {
			messageId: a.MessageId ?? "",
			md5OfMessageBody: a.MD5OfMessageBody
		};
	}
	async receiveMessages(e, t = 10) {
		let n = await this.requireQueueUrl(e);
		return ((await this.sqs.send(new Im({
			QueueUrl: n,
			MaxNumberOfMessages: Math.min(Math.max(t, 1), 10),
			VisibilityTimeout: 0,
			WaitTimeSeconds: 0,
			MessageSystemAttributeNames: ["All"],
			MessageAttributeNames: ["All"]
		}))).Messages ?? []).map((e) => {
			let t = e.MessageAttributes ? Object.fromEntries(Object.entries(e.MessageAttributes).filter(([e, t]) => t !== void 0).map(([e, t]) => [e, {
				dataType: t.DataType ?? "",
				value: t.StringValue ?? "<Binary Data>"
			}])) : {};
			return {
				messageId: e.MessageId ?? "",
				body: e.Body ?? "",
				receiptHandle: e.ReceiptHandle ?? "",
				attributes: e.Attributes,
				messageAttributes: Object.keys(t).length > 0 ? t : void 0,
				md5OfBody: e.MD5OfBody
			};
		});
	}
	async deleteMessage(e, t) {
		let n = await this.requireQueueUrl(e);
		await this.sqs.send(new Am({
			QueueUrl: n,
			ReceiptHandle: t
		}));
	}
	async purgeQueue(e) {
		let t = await this.requireQueueUrl(e);
		await this.sqs.send(new Fm({ QueueUrl: t }));
	}
	async health() {
		await this.sqs.send(new Pm({}));
	}
	async queueUrl(e) {
		try {
			return (await this.sqs.send(new Nm({ QueueName: e }))).QueueUrl ?? null;
		} catch (e) {
			if (j_(e)) return null;
			throw e;
		}
	}
	async requireQueueUrl(e) {
		let t = await this.queueUrl(e);
		if (!t) throw new K(`Queue ${e} does not exist`);
		return t;
	}
	async attributesFor(e) {
		return e ? (await this.sqs.send(new Mm({
			QueueUrl: e,
			AttributeNames: ["All"]
		}))).Attributes ?? {} : {};
	}
};
function b_(e, t, n) {
	return {
		id: e,
		name: e,
		cloud: "aws",
		service: "messaging",
		type: n.FifoQueue === "true" ? "fifo-queue" : "queue",
		region: null,
		createdAt: x_(n.CreatedTimestamp),
		metadata: {
			provider: "aws",
			messagingService: "sqs",
			queueUrl: t,
			arn: n.QueueArn,
			approximateMessages: S_(n.ApproximateNumberOfMessages),
			messagesInFlight: S_(n.ApproximateNumberOfMessagesNotVisible),
			messagesDelayed: S_(n.ApproximateNumberOfMessagesDelayed),
			visibilityTimeout: S_(n.VisibilityTimeout),
			messageRetentionPeriod: S_(n.MessageRetentionPeriod),
			maximumMessageSize: S_(n.MaximumMessageSize),
			maximumMessageSizeKb: C_(S_(n.MaximumMessageSize)),
			delaySeconds: S_(n.DelaySeconds),
			receiveMessageWaitTimeSeconds: S_(n.ReceiveMessageWaitTimeSeconds),
			lastModified: x_(n.LastModifiedTimestamp)
		}
	};
}
function x_(e) {
	if (!e) return null;
	let t = Number(e);
	return Number.isFinite(t) ? (/* @__PURE__ */ new Date(t * 1e3)).toISOString() : null;
}
function S_(e) {
	if (e === void 0) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function C_(e) {
	return e !== null && e % 1024 == 0 ? e / 1024 : null;
}
function w_(e) {
	return e.split("/").filter(Boolean).pop() ?? e;
}
function T_(e) {
	return typeof e == "string" ? e.trim() : "";
}
function E_(e, t, n, r, i = "seconds") {
	let a = T_(e);
	if (!a) return "";
	if (!/^\d+$/.test(a)) throw new G(`${t} must be a whole number of ${i} between ${n} and ${r}.`);
	let o = Number(a);
	if (o < n || o > r) throw new G(`${t} must be between ${n} and ${r} ${i}.`);
	return a;
}
function D_(e) {
	let t = T_(e.maximumMessageSizeKb);
	if (t) {
		let e = E_(t, "maximumMessageSizeKb", 1, 1024, "KB");
		return String(Number(e) * 1024);
	}
	let n = T_(e.maximumMessageSize);
	if (!n) return "";
	if (!/^\d+$/.test(n)) throw new G("maximumMessageSize must be a whole number of bytes between 1024 and 1048576.");
	let r = Number(n);
	if (r < 1024 || r > 1048576) throw new G("maximumMessageSize must be between 1024 and 1048576 bytes.");
	return String(r);
}
function O_(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => e.name.toLowerCase().includes(n)) : e;
}
function k_(e) {
	return e.endsWith(".fifo");
}
function A_(e) {
	return /^[A-Za-z0-9_-]{1,80}$/.test(e) || /^[A-Za-z0-9_-]{1,75}\.fifo$/.test(e);
}
function j_(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e.name;
	return t === "QueueDoesNotExist" || t === "AWS.SimpleQueueService.NonExistentQueue";
}
var M_ = Vg(new d_(new o_([new y_(new Tm({
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
async function N_(e) {
	return M_.fetch(e);
}
export { N_ as handleSqsRequest };
