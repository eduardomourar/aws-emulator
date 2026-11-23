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
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function r(e, t, n) {
	return e.$source ||= {}, e.$source[t] = n, e;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
function i(e, t, n) {
	e.__aws_sdk_context ? e.__aws_sdk_context.features || (e.__aws_sdk_context.features = {}) : e.__aws_sdk_context = { features: {} }, e.__aws_sdk_context.features[t] = n;
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/constants-for-browser.js
var a, o, s, c = t((() => {
	a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = Object.entries(a).reduce((e, [t, n]) => (e[n] = Number(t), e), {}), s = a.split("");
})), l, u = t((() => {
	c(), l = (e) => {
		let t = e.length / 4 * 3;
		e.slice(-2) === "==" ? t -= 2 : e.slice(-1) === "=" && t--;
		let n = new ArrayBuffer(t), r = new DataView(n);
		for (let t = 0; t < e.length; t += 4) {
			let n = 0, i = 0;
			for (let r = t, a = t + 3; r <= a; r++) if (e[r] !== "=") {
				if (!(e[r] in o)) throw TypeError(`Invalid character ${e[r]} in base64 string.`);
				n |= o[e[r]] << (a - r) * 6, i += 6;
			} else n >>= 6;
			let a = t / 4 * 3;
			n >>= i % 8;
			let s = Math.floor(i / 8);
			for (let e = 0; e < s; e++) {
				let t = (s - e - 1) * 8;
				r.setUint8(a + e, (n & 255 << t) >> t);
			}
		}
		return new Uint8Array(n);
	};
})), d, f = t((() => {
	d = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/util-base64/toBase64.browser.js
function p(e) {
	let t;
	t = typeof e == "string" ? d(e) : e;
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
			i += s[(n & 63 << t) >> t];
		}
		i += "==".slice(0, 4 - a);
	}
	return i;
}
var m = t((() => {
	f(), c();
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/blob/Uint8ArrayBlobAdapter.js
function h(e, t, n, r) {
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
var g = t((() => {})), _, ee = t((() => {
	_ = (e) => {
		if (typeof e == "string") return e;
		if (typeof e != "object" || typeof e.byteOffset != "number" || typeof e.byteLength != "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
		return new TextDecoder("utf-8").decode(e);
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/uuid/v4.js
function te(e) {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
		let t = /* @__PURE__ */ new Uint8Array(16);
		return e(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, v[t[0]] + v[t[1]] + v[t[2]] + v[t[3]] + "-" + v[t[4]] + v[t[5]] + "-" + v[t[6]] + v[t[7]] + "-" + v[t[8]] + v[t[9]] + "-" + v[t[10]] + v[t[11]] + v[t[12]] + v[t[13]] + v[t[14]] + v[t[15]];
	};
}
var v, ne = t((() => {
	v = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
})), re, ie = t((() => {
	(function(e) {
		e.HTTP = "http", e.HTTPS = "https";
	})(re ||= {});
})), ae, oe = t((() => {
	(function(e) {
		e.MD5 = "md5", e.CRC32 = "crc32", e.CRC32C = "crc32c", e.SHA1 = "sha1", e.SHA256 = "sha256";
	})(ae ||= {});
})), se = t((() => {
	oe();
})), ce, le = t((() => {
	ce = "__smithy_context";
})), ue = t((() => {
	ie(), se(), le();
})), de, fe = t((() => {
	ue(), de = (e) => e.__smithy_context ||= {};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function y(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var pe = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function me(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var b, he = t((() => {
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
})), ge, _e = t((() => {
	ge = class {
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
})), ve, ye, be = t((() => {
	ve = /* @__PURE__ */ RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), ye = (e, t = !1) => {
		if (!t) return ve.test(e);
		let n = e.split(".");
		for (let e of n) if (!ye(e)) return !1;
		return !0;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/transport/isValidHostname.js
function xe(e) {
	return /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(e);
}
var Se = t((() => {})), x, Ce = t((() => {
	x = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/transport/parseQueryString.js
function we(e) {
	let t = {};
	if (e = e.replace(/^\?/, ""), e) for (let n of e.split("&")) {
		let [e, r = null] = n.split("=");
		e = decodeURIComponent(e), r &&= decodeURIComponent(r), e in t ? Array.isArray(t[e]) ? t[e].push(r) : t[e] = [t[e], r] : t[e] = r;
	}
	return t;
}
var Te = t((() => {})), Ee, De = t((() => {
	Te(), Ee = (e) => {
		if (typeof e == "string") return Ee(new URL(e));
		let { hostname: t, pathname: n, port: r, protocol: i, search: a } = e, o;
		return a && (o = we(a)), {
			hostname: t,
			port: r ? parseInt(r) : void 0,
			protocol: i,
			path: n,
			query: o
		};
	};
})), Oe, ke = t((() => {
	pe(), De(), Oe = (e) => {
		if (typeof e == "object") {
			if ("url" in e) {
				let t = Ee(e.url);
				if (e.headers) {
					t.headers = {};
					for (let n in e.headers) y(e.headers, n) && (t.headers[n.toLowerCase()] = e.headers[n].join(", "));
				}
				return t;
			}
			return e;
		}
		return Ee(e);
	};
})), S = t((() => {
	fe(), pe(), he(), _e(), be(), Se(), Ce(), De(), ke();
})), Ae, je, Me, Ne, Pe, Fe, Ie, Le, Re, ze, Be, Ve, He, Ue, We, Ge, Ke = t((() => {
	Ae = (e) => {
		if (e != null) {
			if (typeof e == "string") {
				let t = parseFloat(e);
				if (!Number.isNaN(t)) return String(t) !== String(e) && Ge.warn(We(`Expected number but observed string: ${e}`)), t;
			}
			if (typeof e == "number") return e;
			throw TypeError(`Expected number, got ${typeof e}: ${e}`);
		}
	}, je = Math.ceil(2 ** 127 * (2 - 2 ** -23)), Me = (e) => {
		let t = Ae(e);
		if (t !== void 0 && !Number.isNaN(t) && t !== Infinity && t !== -Infinity && Math.abs(t) > je) throw TypeError(`Expected 32-bit float, got ${e}`);
		return t;
	}, Ne = (e) => {
		if (e != null) {
			if (Number.isInteger(e) && !Number.isNaN(e)) return e;
			throw TypeError(`Expected integer, got ${typeof e}: ${e}`);
		}
	}, Pe = (e) => Ie(e, 16), Fe = (e) => Ie(e, 8), Ie = (e, t) => {
		let n = Ne(e);
		if (n !== void 0 && Le(n, t) !== n) throw TypeError(`Expected ${t}-bit integer, got ${e}`);
		return n;
	}, Le = (e, t) => {
		switch (t) {
			case 32: return Int32Array.of(e)[0];
			case 16: return Int16Array.of(e)[0];
			case 8: return Int8Array.of(e)[0];
		}
	}, Re = (e) => Ae(typeof e == "string" ? Ve(e) : e), ze = (e) => Me(typeof e == "string" ? Ve(e) : e), Be = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Ve = (e) => {
		let t = e.match(Be);
		if (t === null || t[0].length !== e.length) throw TypeError("Expected real number, got implicit NaN");
		return parseFloat(e);
	}, He = (e) => Pe(typeof e == "string" ? Ve(e) : e), Ue = (e) => Fe(typeof e == "string" ? Ve(e) : e), We = (e) => String(TypeError(e).stack || e).split("\n").slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join("\n"), Ge = { warn: console.warn };
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function qe(e) {
	let t = e.getUTCFullYear(), n = e.getUTCMonth(), r = e.getUTCDay(), i = e.getUTCDate(), a = e.getUTCHours(), o = e.getUTCMinutes(), s = e.getUTCSeconds(), c = i < 10 ? `0${i}` : `${i}`, l = a < 10 ? `0${a}` : `${a}`, u = o < 10 ? `0${o}` : `${o}`, d = s < 10 ? `0${s}` : `${s}`;
	return `${Je[r]}, ${c} ${Ye[n]} ${t} ${l}:${u}:${d} GMT`;
}
var Je, Ye, Xe, Ze, Qe, $e, et, tt, nt, rt, it, at, ot, st, ct, lt, ut, C, dt, ft, pt, mt = t((() => {
	Ke(), Je = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], Ye = [
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
	], Xe = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), Ze = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
		let t = Xe.exec(e);
		if (!t) throw TypeError("Invalid RFC-3339 date-time value");
		let [n, r, i, a, o, s, c, l, u] = t, d = He(pt(r)), f = C(i, "month", 1, 12), p = C(a, "day", 1, 31), m = rt(d, f, p, {
			hours: o,
			minutes: s,
			seconds: c,
			fractionalMilliseconds: l
		});
		return u.toUpperCase() != "Z" && m.setTime(m.getTime() - ft(u)), m;
	}, Qe = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), $e = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), et = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), tt = (e) => {
		if (e == null) return;
		if (typeof e != "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
		let t = Qe.exec(e);
		if (t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rt(He(pt(i)), st(r), C(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			});
		}
		if (t = $e.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return ot(rt(it(i), st(r), C(n, "day", 1, 31), {
				hours: a,
				minutes: o,
				seconds: s,
				fractionalMilliseconds: c
			}));
		}
		if (t = et.exec(e), t) {
			let [e, n, r, i, a, o, s, c] = t;
			return rt(He(pt(c)), st(n), C(r.trimLeft(), "day", 1, 31), {
				hours: i,
				minutes: a,
				seconds: o,
				fractionalMilliseconds: s
			});
		}
		throw TypeError("Invalid RFC-7231 date-time value");
	}, nt = (e) => {
		if (e == null) return;
		let t;
		if (typeof e == "number") t = e;
		else if (typeof e == "string") t = Re(e);
		else if (typeof e == "object" && e.tag === 1) t = e.value;
		else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(t) || t === Infinity || t === -Infinity) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(t * 1e3));
	}, rt = (e, t, n, r) => {
		let i = t - 1;
		return lt(e, i, n), new Date(Date.UTC(e, i, n, C(r.hours, "hour", 0, 23), C(r.minutes, "minute", 0, 59), C(r.seconds, "seconds", 0, 60), dt(r.fractionalMilliseconds)));
	}, it = (e) => {
		let t = (/* @__PURE__ */ new Date()).getUTCFullYear(), n = Math.floor(t / 100) * 100 + He(pt(e));
		return n < t ? n + 100 : n;
	}, at = 15768e8, ot = (e) => e.getTime() - (/* @__PURE__ */ new Date()).getTime() > at ? new Date(Date.UTC(e.getUTCFullYear() - 100, e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())) : e, st = (e) => {
		let t = Ye.indexOf(e);
		if (t < 0) throw TypeError(`Invalid month: ${e}`);
		return t + 1;
	}, ct = [
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
	], lt = (e, t, n) => {
		let r = ct[t];
		if (t === 1 && ut(e) && (r = 29), n > r) throw TypeError(`Invalid day for ${Ye[t]} in ${e}: ${n}`);
	}, ut = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), C = (e, t, n, r) => {
		let i = Ue(pt(e));
		if (i < n || i > r) throw TypeError(`${t} must be between ${n} and ${r}, inclusive`);
		return i;
	}, dt = (e) => e == null ? 0 : ze("0." + e) * 1e3, ft = (e) => {
		let t = e[0], n = 1;
		if (t == "+") n = 1;
		else if (t == "-") n = -1;
		else throw TypeError(`Offset direction, ${t}, must be "+" or "-"`);
		let r = Number(e.substring(1, 3)), i = Number(e.substring(4, 6));
		return n * (r * 60 + i) * 60 * 1e3;
	}, pt = (e) => {
		let t = 0;
		for (; t < e.length - 1 && e.charAt(t) === "0";) t++;
		return t === 0 ? e : e.slice(t);
	};
})), w, ht = t((() => {
	w = function(e) {
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
	}, w.from = (e) => e && typeof e == "object" && (e instanceof w || "deserializeJSON" in e) ? e : typeof e == "string" || Object.getPrototypeOf(e) === String.prototype ? w(String(e)) : w(JSON.stringify(e)), w.fromObject = w.from;
})), gt, T, _t = t((() => {
	gt = /^-?((0|[1-9]\d*)(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/, T = class e {
		string;
		type;
		constructor(e, t) {
			if (this.string = e, this.type = t, !gt.test(e)) throw Error(`@smithy/core/serde - NumericValue string must conform to the Smithy bigDecimal format. Received: "${e}"`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](t) {
			if (!t || typeof t != "object") return !1;
			let n = t;
			return e.prototype.isPrototypeOf(t) || n.type === "bigDecimal" && gt.test(n.string);
		}
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function vt(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in xt) t[n / 2] = xt[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function yt(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += bt[e[n]];
	return t;
}
var bt, xt, St = t((() => {
	bt = {}, xt = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), bt[e] = t, xt[t] = e;
	}
})), Ct, wt, Tt = t((() => {
	Ct = typeof TextEncoder == "function" ? new TextEncoder() : null, wt = (e) => {
		if (typeof e == "string") {
			if (Ct) return Ct.encode(e).byteLength;
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
})), Et, Dt = t((() => {
	f(), Et = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? d(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Ot(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var kt = t((() => {})), At, jt = t((() => {
	At = async (e) => void 0;
})), Mt, Nt, Pt, Ft, It, Lt, Rt = t((() => {
	Mt = async (e) => {
		let t = e?.Bucket || "";
		if (typeof e.Bucket == "string" && (e.Bucket = t.replace(/#/g, "%23").replace(/\?/g, "%3F")), Lt(t)) {
			if (e.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets");
		} else (!It(t) || t.indexOf(".") !== -1 && !String(e.Endpoint).startsWith("http:") || t.toLowerCase() !== t || t.length < 3) && (e.ForcePathStyle = !0);
		return e.DisableMultiRegionAccessPoints && (e.disableMultiRegionAccessPoints = !0, e.DisableMRAP = !0), e;
	}, Nt = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, Pt = /(\d+\.){3}\d+/, Ft = /\.\./, It = (e) => Nt.test(e) && !Pt.test(e) && !Ft.test(e), Lt = (e) => {
		let [t, n, r, , , i] = e.split(":"), a = t === "arn" && e.split(":").length >= 6, o = !!(a && n && r && i);
		if (a && !o) throw Error(`Invalid ARN: ${e} was an invalid ARN.`);
		return o;
	};
})), zt = t((() => {
	Rt();
})), Bt, Vt = t((() => {
	Bt = (e, t, n, r = !1) => {
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
})), Ht = t((() => {
	S();
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/adaptors/getEndpointFromInstructions.js
function Ut(e) {
	return async (t, n, r, i) => {
		if (!r.isCustomEndpoint && !r.ignoreConfiguredEndpointUrls) {
			let t;
			t = r.serviceConfiguredEndpoint ? await r.serviceConfiguredEndpoint() : await e(r.serviceId), t && (r.endpoint = () => Promise.resolve(Oe(t)), r.isCustomEndpoint = !0, i?.logger?.debug?.(`@smithy/core/endpoints - resolved endpoint from config: ${t}`));
		}
		let a = await Wt(t, n, r);
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
var Wt, Gt = t((() => {
	zt(), Vt(), Ht(), Wt = async (e, t, n) => {
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
				r[t] = await Bt(a.name, t, n, a.type !== "builtInParams")();
				break;
			case "operationContextParams":
				r[t] = a.get(e);
				break;
			default: throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(a));
		}
		return Object.keys(i).length === 0 && Object.assign(r, n), String(n.serviceId).toLowerCase() === "s3" && await Mt(r), r;
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/endpointMiddleware.js
function Kt(e, t, n) {
	e.__smithy_context ? e.__smithy_context.features || (e.__smithy_context.features = {}) : e.__smithy_context = { features: {} }, e.__smithy_context.features[t] = n;
}
function qt(e) {
	let t = Ut(e);
	return ({ config: e, instructions: n }) => (r, i) => async (a) => {
		e.isCustomEndpoint && Kt(i, "ENDPOINT_OVERRIDE", "N");
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
var Jt = t((() => {
	S(), Gt();
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/getEndpointPlugin.js
function Yt(e) {
	let t = qt(e);
	return (e, n) => ({ applyToStack: (r) => {
		r.addRelativeTo(t({
			config: e,
			instructions: n
		}), Zt);
	} });
}
var Xt, Zt, Qt = t((() => {
	Jt(), Xt = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	}, Zt = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: !0,
		relation: "before",
		toMiddleware: Xt.name
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/middleware-endpoint/resolveEndpointConfig.js
function $t(e) {
	return (t) => {
		let n = t.tls ?? !0, { endpoint: r, useDualstackEndpoint: i, useFipsEndpoint: a } = t, o = Object.assign(t, {
			endpoint: r == null ? void 0 : async () => Oe(await x(r)()),
			tls: n,
			isCustomEndpoint: !!r,
			useDualstackEndpoint: x(i ?? !1),
			useFipsEndpoint: x(a ?? !1),
			ignoreConfiguredEndpointUrls: !!t.ignoreConfiguredEndpointUrls
		}), s;
		return o.serviceConfiguredEndpoint = async () => (t.serviceId && !s && (s = e(t.serviceId)), s), o;
	};
}
var en = t((() => {
	S(), Ht();
})), tn, nn = t((() => {
	tn = class e {
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
})), rn, an = t((() => {
	rn = class {
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
})), E, on = t((() => {
	E = class extends Error {
		constructor(e) {
			super(e), this.name = "EndpointError";
		}
	};
})), D = t((() => {
	on();
})), sn, cn = t((() => {
	sn = "endpoints";
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/debug/toDebugString.js
function ln(e) {
	return typeof e != "object" || !e ? e : "ref" in e ? `$${ln(e.ref)}` : "fn" in e ? `${e.fn}(${(e.argv || []).map(ln).join(", ")})` : JSON.stringify(e, null, 2);
}
var un = t((() => {})), dn = t((() => {
	cn(), un();
})), fn, pn = t((() => {
	fn = {};
})), mn, hn = t((() => {
	mn = (e, t) => e === t;
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/coalesce.js
function gn(...e) {
	for (let t of e) if (t != null) return t;
}
var _n = t((() => {})), vn, yn = t((() => {
	D(), vn = (e) => {
		let t = e.split("."), n = [];
		for (let r of t) {
			let t = r.indexOf("[");
			if (t !== -1) {
				if (r.indexOf("]") !== r.length - 1) throw new E(`Path: '${e}' does not end with ']'`);
				let i = r.slice(t + 1, -1);
				if (Number.isNaN(parseInt(i))) throw new E(`Invalid array index: '${i}' in path: '${e}'`);
				t !== 0 && n.push(r.slice(0, t)), n.push(i);
			} else n.push(r);
		}
		return n;
	};
})), bn, xn = t((() => {
	D(), yn(), bn = (e, t) => vn(t).reduce((n, r) => {
		if (typeof n != "object") throw new E(`Index '${r}' in '${t}' not found in '${JSON.stringify(e)}'`);
		if (Array.isArray(n)) {
			let e = parseInt(r);
			return n[e < 0 ? n.length + e : e];
		}
		return n[r];
	}, e);
})), Sn, Cn = t((() => {
	Sn = (e) => e != null;
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/ite.js
function wn(e, t, n) {
	return e ? t : n;
}
var Tn = t((() => {})), En, Dn = t((() => {
	En = (e) => !e;
})), On, kn, An = t((() => {
	On = /* @__PURE__ */ RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), kn = (e) => On.test(e) || e.startsWith("[") && e.endsWith("]");
})), jn, Mn, Nn = t((() => {
	ue(), An(), jn = {
		[re.HTTP]: 80,
		[re.HTTPS]: 443
	}, Mn = (e) => {
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
		let l = kn(i);
		return {
			scheme: c,
			authority: `${r}${n.includes(`${r}:${jn[c]}`) || typeof e == "string" && e.includes(`${r}:${jn[c]}`) ? `:${jn[c]}` : ""}`,
			path: a,
			normalizedPath: a.endsWith("/") ? a : `${a}/`,
			isIp: l
		};
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/endpoints/util-endpoints/lib/split.js
function Pn(e, t, n) {
	if (n === 1) return [e];
	if (e === "") return [""];
	let r = e.split(t);
	return n === 0 ? r : r.slice(0, n - 1).concat(r.slice(1).join(t));
}
var Fn = t((() => {})), In, Ln = t((() => {
	In = (e, t) => e === t;
})), Rn, zn = t((() => {
	Rn = (e, t, n, r) => e == null || t >= n || e.length < n || /[^\u0000-\u007f]/.test(e) ? null : r ? e.substring(e.length - n, e.length - t) : e.substring(t, n);
})), Bn, Vn = t((() => {
	Bn = (e) => encodeURIComponent(e).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`);
})), Hn = t((() => {
	hn(), _n(), xn(), Cn(), S(), Tn(), Dn(), Nn(), Fn(), Ln(), zn(), Vn();
})), Un, Wn = t((() => {
	Hn(), Un = {
		booleanEquals: mn,
		coalesce: gn,
		getAttr: bn,
		isSet: Sn,
		isValidHostLabel: ye,
		ite: wn,
		not: En,
		parseURL: Mn,
		split: Pn,
		stringEquals: In,
		substring: Rn,
		uriEncode: Bn
	};
})), Gn, Kn = t((() => {
	Hn(), Gn = (e, t) => {
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
				n.push(bn(r[e] ?? i[e], t));
			} else n.push(r[s] ?? i[s]);
			a = o + 1;
		}
		return n.join("");
	};
})), qn, Jn = t((() => {
	qn = ({ ref: e }, t) => t.referenceRecord[e] ?? t.endpointParams[e];
})), Yn, Xn, Zn, Qn = t((() => {
	D(), pn(), Wn(), Kn(), Jn(), Yn = (e, t, n) => {
		if (typeof e == "string") return Gn(e, n);
		if (e.fn) return Zn.callFunction(e, n);
		if (e.ref) return qn(e, n);
		throw new E(`'${t}': ${String(e)} is not a string, function or reference.`);
	}, Xn = ({ fn: e, argv: t }, n) => {
		let r = Array(t.length);
		for (let e = 0; e < r.length; ++e) {
			let i = t[e];
			typeof i == "boolean" || typeof i == "number" ? r[e] = i : r[e] = Zn.evaluateExpression(i, "arg", n);
		}
		let i = e.indexOf(".");
		if (i !== -1) {
			let t = fn[e.slice(0, i)]?.[e.slice(i + 1)];
			if (typeof t == "function") return t(...r);
		}
		let a = Un[e];
		if (typeof a == "function") return a(...r);
		throw Error(`function ${e} not loaded in endpointFunctions.`);
	}, Zn = {
		evaluateExpression: Yn,
		callFunction: Xn
	};
})), $n = t((() => {
	Qn();
})), er, tr = t((() => {
	dn(), D(), $n(), er = (e, t) => {
		let { assign: n } = e;
		if (n && n in t.referenceRecord) throw new E(`'${n}' is already defined in Reference Record.`);
		let r = Xn(e, t);
		t.logger?.debug?.(`${sn} evaluateCondition: ${ln(e)} = ${ln(r)}`);
		let i = r === "" || !!r;
		return n == null ? { result: i } : {
			result: i,
			toAssign: {
				name: n,
				value: r
			}
		};
	};
})), nr, rr = t((() => {
	D(), Qn(), nr = (e, t) => Object.entries(e ?? {}).reduce((e, [n, r]) => (e[n] = r.map((e) => {
		let r = Yn(e, "Header value entry", t);
		if (typeof r != "string") throw new E(`Header '${n}' value '${r}' is not a string`);
		return r;
	}), e), {});
})), ir, ar, or, sr = t((() => {
	D(), Kn(), ir = (e, t) => Object.entries(e).reduce((e, [n, r]) => (e[n] = or.getEndpointProperty(r, t), e), {}), ar = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => ar(e, t));
		switch (typeof e) {
			case "string": return Gn(e, t);
			case "object":
				if (e === null) throw new E(`Unexpected endpoint property: ${e}`);
				return or.getEndpointProperties(e, t);
			case "boolean": return e;
			default: throw new E(`Unexpected endpoint property type: ${typeof e}`);
		}
	}, or = {
		getEndpointProperty: ar,
		getEndpointProperties: ir
	};
})), cr, lr = t((() => {
	D(), Qn(), cr = (e, t) => {
		let n = Yn(e, "Endpoint URL", t);
		if (typeof n == "string") try {
			return new URL(n);
		} catch (e) {
			throw console.error(`Failed to construct URL with ${n}`, e), e;
		}
		throw new E(`Endpoint URL must be a string, got ${typeof n}`);
	};
})), ur, dr, fr = t((() => {
	D(), tr(), Qn(), rr(), sr(), lr(), ur = 1e8, dr = (e, t) => {
		let { nodes: n, root: r, results: i, conditions: a } = e, o = r, s = {}, c = {
			referenceRecord: s,
			endpointParams: t.endpointParams,
			logger: t.logger
		};
		for (; o !== 1 && o !== -1 && o < ur;) {
			let e = 3 * (Math.abs(o) - 1), [t, r, i] = [
				n[e],
				n[e + 1],
				n[e + 2]
			], [l, u, d] = a[t], f = er({
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
		if (o >= ur) {
			let e = i[o - ur];
			if (e[0] === -1) {
				let [, t] = e;
				throw new E(Yn(t, "Error", c));
			}
			let [t, n, r] = e;
			return {
				url: cr(t, c),
				properties: ir(n, c),
				headers: nr(r ?? {}, c)
			};
		}
		throw new E("No matching endpoint.");
	};
})), pr, mr, hr = t((() => {
	jt(), Gt(), Jt(), Qt(), en(), S(), nn(), an(), fr(), An(), pn(), dn(), D(), tr(), rr(), sr(), lr(), Qn(), Ht(), pr = $t(At), qt(At), mr = Yt(At);
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function gr(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var _r = t((() => {})), vr, yr, br, xr, O = t((() => {
	u(), m(), g(), f(), ee(), ne(), mt(), ht(), Ke(), _t(), St(), Tt(), Dt(), kt(), S(), hr(), _r(), vr = class extends h(_, d, p, l) {}, yr = (e) => crypto.getRandomValues(e), br = te(yr), xr = br;
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
O();
var Sr = async (e = /* @__PURE__ */ new Uint8Array(), t) => {
	if (e instanceof Uint8Array) return vr.mutate(e);
	if (!e) return vr.mutate(/* @__PURE__ */ new Uint8Array());
	let n = t.streamCollector(e);
	return vr.mutate(await n);
}, Cr, wr = t((() => {
	Cr = (e) => typeof e == "function" ? e() : e;
})), Tr, Er = t((() => {
	Tr = (e, t, n, r, i) => ({
		name: t,
		namespace: e,
		traits: n,
		input: r,
		output: i
	});
})), Dr, Or, kr = t((() => {
	S(), Er(), Dr = (e) => (t, n) => async (r) => {
		let { response: i } = await t(r), { operationSchema: a } = de(n), [, o, s, c, l, u] = a ?? [];
		try {
			return {
				response: i,
				output: await e.protocol.deserializeResponse(Tr(o, s, c, l, u), {
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
					if (ge.isInstance(i)) {
						let { headers: t = {}, statusCode: n } = i, r = Object.entries(t);
						e.$metadata = {
							httpStatusCode: n,
							requestId: Or(/^x-[\w-]+-request-?id$/, r),
							extendedRequestId: Or(/^x-[\w-]+-id-2$/, r),
							cfId: Or(/^x-[\w-]+-cf-id$/, r)
						};
					}
				} catch {}
			}
			throw e;
		}
	}, Or = (e, t) => (t.find(([t]) => t.match(e)) || [void 0, void 0])[1];
})), Ar, jr = t((() => {
	S(), Er(), Ar = (e) => (t, n) => async (r) => {
		let { operationSchema: i } = de(n), [, a, o, s, c, l] = i ?? [], u = n.endpointV2 ? async () => Oe(n.endpointV2) : e.endpoint, d = await e.protocol.serializeRequest(Tr(a, o, s, c, l), r.input, {
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/schema/middleware/getSchemaSerdePlugin.js
function Mr(e) {
	return { applyToStack: (t) => {
		t.add(Ar(e), Pr), t.add(Dr(e), Nr), e.protocol.setSerdeContext(e);
	} };
}
var Nr, Pr, Fr = t((() => {
	kr(), jr(), Nr = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: !0
	}, Pr = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: !0
	};
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function Ir(e) {
	if (typeof e == "object") return e;
	if (e |= 0, Lr[e]) return Lr[e];
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
	return Lr[e] = t;
}
var Lr, Rr = t((() => {
	Lr = [];
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function zr(e, t) {
	return e instanceof k ? Object.assign(e, {
		memberName: t,
		_isMemberSchema: !0
	}) : new k(e, t);
}
var Br, Vr, Hr, k, Ur, Wr, Gr = t((() => {
	wr(), Rr(), Br = {
		it: Symbol.for("@smithy/nor-struct-it"),
		ns: Symbol.for("@smithy/ns")
	}, Vr = [], Hr = {}, k = class e {
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
			for (this._isMemberSchema = !1; Ur(i);) r.push(i[1]), i = i[0], a = Cr(i), this._isMemberSchema = !0;
			if (r.length > 0) {
				this.memberTraits = {};
				for (let e = r.length - 1; e >= 0; --e) {
					let t = r[e];
					Object.assign(this.memberTraits, Ir(t));
				}
			} else this.memberTraits = 0;
			if (a instanceof e) {
				let e = this.memberTraits;
				Object.assign(this, a), this.memberTraits = Object.assign({}, e, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = n ?? a.memberName;
			} else if (this.schema = Cr(a), Wr(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !n) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
		}
		static [Symbol.hasInstance](e) {
			let t = this.prototype.isPrototypeOf(e);
			return !t && typeof e == "object" && e ? e.symbol === this.symbol : t;
		}
		static of(t) {
			let n = typeof t == "function" || typeof t == "object" && !!t;
			if (typeof t == "number") {
				if (Vr[t]) return Vr[t];
			} else if (typeof t == "string") {
				if (Hr[t]) return Hr[t];
			} else if (n && t[Br.ns]) return t[Br.ns];
			let r = Cr(t);
			if (r instanceof e) return r;
			if (Ur(r)) {
				let [n, i] = r;
				if (n instanceof e) return Object.assign(n.getMergedTraits(), Ir(i)), n;
				throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(t, null, 2)}.`);
			}
			let i = new e(r);
			return n ? t[Br.ns] = i : typeof r == "string" ? Hr[r] = i : typeof r == "number" ? Vr[r] = i : i;
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
			return Ir(this.memberTraits);
		}
		getOwnTraits() {
			return Ir(this.traits);
		}
		getKeySchema() {
			let [e, t] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!e && !t) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
			let n = this.getSchema();
			return zr([e ? 15 : n[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			let e = this.getSchema(), [t, n, r] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			], i = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : t ? 15 : void 0;
			if (i != null) return zr([i, 0], n ? "value" : "member");
			throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
		}
		getMemberSchema(e) {
			let t = this.getSchema();
			if (this.isStructSchema() && t[4].includes(e)) {
				let n = t[4].indexOf(e), r = t[5][n];
				return zr(Ur(r) ? r : [r, 0], e);
			}
			if (this.isDocumentSchema()) return zr([15, 0], e);
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
			let e = this.getSchema(), t = e[4].length, n = e[Br.it];
			if (n && t === n.length) yield* n;
			else {
				n = Array(t);
				for (let r = 0; r < t; ++r) {
					let t = e[4][r], i = zr([e[5][r], 0], t);
					yield n[r] = [t, i];
				}
				e[Br.it] = n;
			}
		}
	}, Ur = (e) => Array.isArray(e) && e.length === 2, Wr = (e) => Array.isArray(e) && e.length >= 5;
})), Kr, qr = t((() => {
	Kr = class e {
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
})), A = t((() => {
	wr(), Fr(), Er(), Gr(), Rr(), qr();
})), Jr = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Yr, Xr, Zr, Qr = t((() => {
	Yr = /* @__PURE__ */ new Uint32Array(256);
	for (let e = 0; e < 256; ++e) {
		let t = e;
		for (let e = 0; e < 8; ++e) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
		Yr[e] = t >>> 0;
	}
	Xr = 4294967295, Zr = class {
		digestLength = 4;
		checksum = Xr;
		update(e) {
			for (let t = 0; t < e.length; ++t) this.checksum = this.checksum >>> 8 ^ Yr[(this.checksum ^ e[t]) & 255];
		}
		digestSync() {
			return (this.checksum ^ Xr) >>> 0;
		}
		async digest() {
			let e = this.digestSync(), t = /* @__PURE__ */ new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !1), t;
		}
		reset() {
			this.checksum = Xr;
		}
	};
})), j, $r, ei, ti, ni, ri, ii = t((() => {
	O(), j = 64, $r = 32, ei = 2 ** 53 - 1, ti = class e {
		digestLength = $r;
		state = Int32Array.from(ni);
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
				for (let e = 0; e < j; ++e) a[e] = 54 ^ n[e], a[e + j] = 92 ^ n[e];
				r.update(a.subarray(0, j)), i.update(a.subarray(j));
			}
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			if (this.inner) {
				this.inner.update(e);
				return;
			}
			let t = Et(e), n = 0, { byteLength: r } = t;
			if (this.bytesHashed += r, this.bytesHashed * 8 > ei) throw Error("Cannot hash more than 2^53 - 1 bits");
			for (; r > 0;) this.buffer[this.bufferLength++] = t[n++], r--, this.bufferLength === j && (this.hashBuffer(), this.bufferLength = 0);
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
			this.state = Int32Array.from(ni), this.buffer = /* @__PURE__ */ new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0;
		}
		digestSync() {
			let e = this.state.slice(), t = this.buffer.slice(), n = this.bufferLength, r = this.bytesHashed * 8, i = new DataView(t.buffer, t.byteOffset, t.byteLength);
			if (i.setUint8(n++, 128), (n - 1) % j >= 56) {
				for (let e = n; e < j; ++e) i.setUint8(e, 0);
				this.hashBufferWith(e, t), n = 0;
			}
			for (let e = n; e < 56; ++e) i.setUint8(e, 0);
			i.setUint32(56, Math.floor(r / 4294967296), !1), i.setUint32(60, r, !1), this.hashBufferWith(e, t);
			let a = new Uint8Array($r);
			for (let t = 0; t < 8; ++t) a[t * 4] = e[t] >>> 24 & 255, a[t * 4 + 1] = e[t] >>> 16 & 255, a[t * 4 + 2] = e[t] >>> 8 & 255, a[t * 4 + 3] = e[t] >>> 0 & 255;
			return a;
		}
		static normalizeKey(t) {
			let n = Et(t);
			if (n.byteLength > j) {
				let t = new e();
				t.update(n);
				let r = t.digestSync(), i = new Uint8Array(j);
				return i.set(r), i;
			}
			if (n.byteLength < j) {
				let e = new Uint8Array(j);
				return e.set(n), e;
			}
			return n;
		}
		hashBuffer() {
			this.hashBufferWith(this.state, this.buffer);
		}
		hashBufferWith(e, t) {
			let n = this.w ??= /* @__PURE__ */ new Int32Array(64), r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7];
			for (let e = 0; e < j; ++e) {
				if (e < 16) n[e] = (t[e * 4] & 255) << 24 | (t[e * 4 + 1] & 255) << 16 | (t[e * 4 + 2] & 255) << 8 | t[e * 4 + 3] & 255;
				else {
					let t = n[e - 2], r = (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
					t = n[e - 15];
					let i = (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
					n[e] = (r + n[e - 7] | 0) + (i + n[e - 16] | 0);
				}
				let d = (((s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^ (s >>> 25 | s << 7)) + (s & c ^ ~s & l) | 0) + (u + (ri[e] + n[e] | 0) | 0) | 0, f = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & i ^ r & a ^ i & a) | 0;
				u = l, l = c, c = s, s = o + d | 0, o = a, a = i, i = r, r = d + f | 0;
			}
			e[0] += r, e[1] += i, e[2] += a, e[3] += o, e[4] += s, e[5] += c, e[6] += l, e[7] += u;
		}
	}, ni = new Int32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), ri = new Int32Array([
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
})), ai, oi, si, ci, li, ui, di = t((() => {
	O(), ii(), {digest: ai, sign: oi, importKey: si} = globalThis?.crypto?.subtle ?? {}, ci = typeof ai == "function" && typeof oi == "function" && typeof si == "function" ? globalThis.crypto.subtle : void 0, li = 8388608, ui = class {
		digestLength = 32;
		secret;
		pending = [];
		pendingBytes = 0;
		fallback;
		finished = !1;
		constructor(e) {
			e && (this.secret = Et(e));
		}
		update(e) {
			if (this.finished) throw Error("Attempted to update an already finished HMAC.");
			this.fallback ? this.fallback.update(e) : (this.pending.push(e.slice()), this.pendingBytes += e.byteLength, this.pendingBytes >= li && this.switchToFallback());
		}
		async digest() {
			if (this.fallback) return this.fallback.digest();
			if (this.secret && this.finished) throw Error("Attempted to digest an already finished HMAC.");
			let e = Ot(this.pending);
			if (ci) {
				if (this.secret) {
					this.finished = !0;
					let t = await ci.importKey("raw", this.secret, {
						name: "HMAC",
						hash: "SHA-256"
					}, !1, ["sign"]), n = await ci.sign("HMAC", t, e);
					return new Uint8Array(n);
				}
				let t = await ci.digest("SHA-256", e);
				return new Uint8Array(t);
			}
			let t = new ti(this.secret);
			return t.update(e), t.digest();
		}
		reset() {
			this.pending = [], this.pendingBytes = 0, this.fallback = void 0, this.finished = !1;
		}
		switchToFallback() {
			let e = new ti(this.secret);
			for (let t of this.pending) e.update(t);
			this.fallback = e, this.pending = [], this.pendingBytes = 0;
		}
	};
})), fi = t((() => {
	O(), Qr(), ii(), di();
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/Int64.js
function pi(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
var mi, hi = t((() => {
	O(), mi = class e {
		bytes;
		constructor(e) {
			if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(t) {
			if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
			let n = /* @__PURE__ */ new Uint8Array(8);
			for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
			return t < 0 && pi(n), new e(n);
		}
		valueOf() {
			let e = this.bytes.slice(0), t = e[0] & 128;
			return t && pi(e), parseInt(yt(e), 16) * (t ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
})), gi, _i, vi, yi, bi, xi, Si, Ci, wi, Ti, Ei, Di, Oi, ki = t((() => {
	S(), O(), hi(), gi = class {
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
					if (e.value.byteLength > Oi) throw Error(`@smithy/core/event-streams - header value (binary) exceeds ${Oi} bytes: ${e.value.byteLength}`);
					let i = new DataView(new ArrayBuffer(3 + e.value.byteLength));
					i.setUint8(0, 6), i.setUint16(1, e.value.byteLength, !1);
					let a = new Uint8Array(i.buffer);
					return a.set(e.value, 3), a;
				case "string":
					let o = this.fromUtf8(e.value);
					if (o.byteLength > Oi) throw Error(`@smithy/core/event-streams - header value (string) exceeds ${Oi} bytes: ${o.byteLength}`);
					let s = new DataView(new ArrayBuffer(3 + o.byteLength));
					s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
					let c = new Uint8Array(s.buffer);
					return c.set(o, 3), c;
				case "timestamp":
					let l = /* @__PURE__ */ new Uint8Array(9);
					return l[0] = 8, l.set(mi.fromNumber(e.value.valueOf()).bytes, 1), l;
				case "uuid":
					if (!Di.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
					let u = /* @__PURE__ */ new Uint8Array(17);
					return u[0] = 9, u.set(vt(e.value.replace(/-/g, "")), 1), u;
			}
		}
		parse(e) {
			let t = {}, n = 0;
			for (; n < e.byteLength;) {
				let r = e.getUint8(n++), i = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
				switch (n += r, e.getUint8(n++)) {
					case 0:
						t[i] = {
							type: vi,
							value: !0
						};
						break;
					case 1:
						t[i] = {
							type: vi,
							value: !1
						};
						break;
					case 2:
						t[i] = {
							type: yi,
							value: e.getInt8(n++)
						};
						break;
					case 3:
						t[i] = {
							type: bi,
							value: e.getInt16(n, !1)
						}, n += 2;
						break;
					case 4:
						t[i] = {
							type: xi,
							value: e.getInt32(n, !1)
						}, n += 4;
						break;
					case 5:
						t[i] = {
							type: Si,
							value: new mi(new Uint8Array(e.buffer, e.byteOffset + n, 8))
						}, n += 8;
						break;
					case 6:
						let r = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: Ci,
							value: new Uint8Array(e.buffer, e.byteOffset + n, r)
						}, n += r;
						break;
					case 7:
						let a = e.getUint16(n, !1);
						n += 2, t[i] = {
							type: wi,
							value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, a))
						}, n += a;
						break;
					case 8:
						t[i] = {
							type: Ti,
							value: new Date(new mi(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
						}, n += 8;
						break;
					case 9:
						let o = new Uint8Array(e.buffer, e.byteOffset + n, 16);
						n += 16, t[i] = {
							type: Ei,
							value: `${yt(o.subarray(0, 4))}-${yt(o.subarray(4, 6))}-${yt(o.subarray(6, 8))}-${yt(o.subarray(8, 10))}-${yt(o.subarray(10))}`
						};
						break;
					default: throw Error("Unrecognized header type tag");
				}
			}
			return t;
		}
	}, (function(e) {
		e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
	})(_i ||= {}), vi = "boolean", yi = "byte", bi = "short", xi = "integer", Si = "long", Ci = "binary", wi = "string", Ti = "timestamp", Ei = "uuid", Di = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Oi = 32767;
}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-codec/splitMessage.js
function Ai({ byteLength: e, byteOffset: t, buffer: n }) {
	if (e < Pi) throw Error("Provided message too short to accommodate event stream message overhead");
	let r = new DataView(n, t, e), i = r.getUint32(0, !1);
	if (e !== i) throw Error("Reported message length does not match received message length");
	let a = r.getUint32(ji, !1), o = r.getUint32(Mi, !1), s = r.getUint32(e - Ni, !1), c = new Zr();
	if (c.update(new Uint8Array(n, t, Mi)), o !== c.digestSync()) throw Error(`The prelude checksum specified in the message (${o}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
	if (c.update(new Uint8Array(n, t + Mi, e - 12)), s !== c.digestSync()) throw Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${s}`);
	return {
		headers: new DataView(n, t + Mi + Ni, a),
		body: new Uint8Array(n, t + Mi + Ni + a, i - a - 16)
	};
}
var ji, Mi, Ni, Pi, Fi = t((() => {
	fi(), ji = 4, Mi = 8, Ni = 4, Pi = 16;
})), Ii, Li = t((() => {
	fi(), ki(), Fi(), Ii = class {
		headerMarshaller;
		messageBuffer;
		isEndOfStream;
		constructor(e, t) {
			this.headerMarshaller = new gi(e, t), this.messageBuffer = [], this.isEndOfStream = !1;
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
			let n = this.headerMarshaller.format(e), r = n.byteLength + t.byteLength + 16, i = new Uint8Array(r), a = new DataView(i.buffer, i.byteOffset, i.byteLength), o = new Zr();
			return a.setUint32(0, r, !1), a.setUint32(4, n.byteLength, !1), o.update(i.subarray(0, 8)), a.setUint32(8, o.digestSync(), !1), i.set(n, 12), i.set(t, n.byteLength + 12), o.update(i.subarray(8, r - 4)), a.setUint32(r - 4, o.digestSync(), !1), i;
		}
		decode(e) {
			let { headers: t, body: n } = Ai(e);
			return {
				headers: this.headerMarshaller.parse(t),
				body: n
			};
		}
		formatHeaders(e) {
			return this.headerMarshaller.format(e);
		}
	};
})), Ri, zi = t((() => {
	Ri = class {
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
})), Bi, Vi = t((() => {
	Bi = class {
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
})), Hi, Ui = t((() => {
	Hi = class {
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
})), Wi, Gi = t((() => {
	Wi = class {
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getChunkedStream.js
function Ki(e) {
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
var qi = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/event-streams/eventstream-serde-universal/getUnmarshalledStream.js
function Ji(e, t) {
	let n = Yi(t.deserializer, t.toUtf8);
	return { [Symbol.asyncIterator]: async function* () {
		for await (let r of e) {
			let e = t.eventStreamCodec.decode(r), i = await n(e);
			i !== void 0 && (yield i);
		}
	} };
}
function Yi(e, t) {
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
var Xi = t((() => {})), Zi, Qi, $i = t((() => {
	Li(), zi(), Vi(), Ui(), Gi(), qi(), Xi(), Zi = class {
		eventStreamCodec;
		utfEncoder;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.eventStreamCodec = new Ii(e, t), this.utfEncoder = e;
		}
		deserialize(e, t) {
			let n = Ki(e);
			return new Hi({
				messageStream: new Ri({
					inputStream: n,
					decoder: this.eventStreamCodec
				}),
				deserializer: Yi(t, this.utfEncoder)
			});
		}
		serialize(e, t) {
			return new Bi({
				messageStream: new Wi({
					inputStream: e,
					serializer: t
				}),
				encoder: this.eventStreamCodec,
				includeEndFrame: !0
			});
		}
	}, Qi = (e) => new Zi(e);
})), ea, ta, na = t((() => {
	ea = (e) => ({ [Symbol.asyncIterator]: async function* () {
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
	} }), ta = (e) => {
		let t = e[Symbol.asyncIterator]();
		return new ReadableStream({ async pull(e) {
			let { done: n, value: r } = await t.next();
			if (n) return e.close();
			e.enqueue(r);
		} });
	};
})), ra, ia, aa, oa = t((() => {
	$i(), na(), ra = class {
		universalMarshaller;
		constructor({ utf8Encoder: e, utf8Decoder: t }) {
			this.universalMarshaller = new Zi({
				utf8Decoder: t,
				utf8Encoder: e
			});
		}
		deserialize(e, t) {
			let n = ia(e) ? ea(e) : e;
			return this.universalMarshaller.deserialize(n, t);
		}
		serialize(e, t) {
			let n = this.universalMarshaller.serialize(e, t);
			return typeof ReadableStream == "function" ? ta(n) : n;
		}
	}, ia = (e) => typeof ReadableStream == "function" && e instanceof ReadableStream, aa = (e) => new ra(e);
})), sa, ca = t((() => {
	sa = (e) => Object.assign(e, { eventStreamMarshaller: e.eventStreamSerdeProvider(e) });
})), la, ua = t((() => {
	S(), A(), O(), la = class {
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
							if (a ||= !!(t || c), c) s.isBlobSchema() ? r[o] = i : s.isStringSchema() ? r[o] = (this.serdeContext?.utf8Encoder ?? _)(i) : s.isStructSchema() && (r[o] = await this.deserializer.read(s, i));
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
				let e = a[1], t = Kr.for(e);
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
				body: typeof l == "string" ? (this.serdeContext?.utf8Decoder ?? d)(l) : l,
				eventType: i,
				explicitPayloadContentType: o,
				additionalHeaders: c
			};
		}
	};
})), da = /* @__PURE__ */ n({
	EventStreamCodec: () => Ii,
	EventStreamMarshaller: () => ra,
	EventStreamSerde: () => la,
	HeaderMarshaller: () => gi,
	Int64: () => mi,
	MessageDecoderStream: () => Ri,
	MessageEncoderStream: () => Bi,
	SmithyMessageDecoderStream: () => Hi,
	SmithyMessageEncoderStream: () => Wi,
	UniversalEventStreamMarshaller: () => Zi,
	eventStreamSerdeProvider: () => aa,
	getChunkedStream: () => Ki,
	getMessageUnmarshaller: () => Yi,
	getUnmarshalledStream: () => Ji,
	iterableToReadableStream: () => ta,
	readableStreamToIterable: () => ea,
	resolveEventStreamSerdeConfig: () => sa,
	universalEventStreamSerdeProvider: () => Qi
}), fa = t((() => {
	Li(), ki(), hi(), zi(), Vi(), Ui(), Gi(), oa(), na(), $i(), qi(), Xi(), ca(), ua();
}));
S(), A();
var pa = class extends Jr {
	options;
	compositeErrorRegistry;
	constructor(e) {
		super(), this.options = e, this.compositeErrorRegistry = new Kr(e.defaultNamespace);
		for (let t of e.errorTypeRegistries ?? []) this.compositeErrorRegistry.copyFrom(t);
	}
	getRequestType() {
		return b;
	}
	getResponseType() {
		return ge;
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
		let r = k.of(t.input), i = Ir(t.traits ?? {});
		if (i.endpoint) {
			let t = i.endpoint?.[0];
			if (typeof t == "string") {
				for (let [e, i] of r.structIterator()) {
					if (!i.getMergedTraits().hostLabel) continue;
					let r = n[e];
					if (typeof r != "string") throw Error(`@smithy/core/schema - ${e} in input must be a string as hostLabel.`);
					t = t.replace(`{${e}}`, r);
				}
				if (e.hostname = t + e.hostname, !xe(e.hostname)) throw Error(`[${e.hostname}] is not a valid hostname.`);
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
		let { EventStreamSerde: e, eventStreamSerdeProvider: t } = await Promise.resolve().then(() => (fa(), da));
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
S(), A();
var ma = class extends pa {
	async serializeRequest(e, t, n) {
		let r = this.serializer, i = {}, a = {}, o = await n.endpoint(), s = k.of(e?.input), c = s.getSchema(), l, u = t && typeof t == "object" ? t : {}, d = new b({
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
		let r = this.deserializer, i = k.of(e.output), a = {};
		if (this.isErrorResponse(n.statusCode)) {
			let i = await Sr(n.body, t);
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
			let e = await Sr(n.body, t);
			e.byteLength > 0 && Object.assign(a, await r.read(i, e));
		}
		return a.$metadata = this.deserializeMetadata(n), a;
	}
	isErrorResponse(e) {
		return e >= 300;
	}
};
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function ha(e, t) {
	if (t.timestampFormat.useTrait && e.isTimestampSchema() && (e.getSchema() === 5 || e.getSchema() === 6 || e.getSchema() === 7)) return e.getSchema();
	let { httpLabel: n, httpPrefixHeaders: r, httpHeader: i, httpQuery: a } = e.getMergedTraits();
	return (t.httpBindings ? typeof r == "string" || i ? 6 : a || n ? 5 : void 0 : void 0) ?? t.timestampFormat.default;
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/protocol-http/extensions/httpExtensionConfiguration.js
var ga = (e) => (e.logger && e.logger.constructor?.name !== "NoOpLogger" && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("logger"), e.logger), e.defaultSocketTimeout && e.requestHandler?.updateHttpClientConfig?.(Symbol.for("@smithy/defaultSocketTimeout"), e.defaultSocketTimeout), {
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
}), _a = (e) => ({ requestHandler: e.httpHandler() });
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/middleware-content-length/contentLengthMiddleware.js
S();
var va = "content-length";
function ya(e) {
	return (t) => async (n) => {
		let r = n.request;
		if (b.isInstance(r)) {
			let { body: t, headers: n } = r;
			if (t && Object.keys(n).map((e) => e.toLowerCase()).indexOf(va) === -1) try {
				let n = e(t);
				n != null && (r.headers = {
					...r.headers,
					[va]: String(n)
				});
			} catch {}
		}
		return t({
			...n,
			request: r
		});
	};
}
var ba = {
	step: "build",
	tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
	name: "contentLengthMiddleware",
	override: !0
}, xa = (e) => ({ applyToStack: (t) => {
	t.add(ya(e.bodyLengthChecker), ba);
} }), Sa = class {
	serdeContext;
	setSerdeContext(e) {
		this.serdeContext = e;
	}
}, Ca = class {
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
}, wa;
function Ta() {
	if (wa === void 0) try {
		if (typeof Buffer != "function") wa = !1;
		else {
			let e = JSON.parse(Buffer.from([123, 125]));
			wa = typeof e == "object" && !!e;
		}
	} catch {
		wa = !1;
	}
	return wa;
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/json/jsonReviver.js
O();
function Ea(e, t, n) {
	if (n?.source) {
		let e = n.source;
		if (typeof t == "number") return t <= 2 ** 53 - 1 && t >= -(2 ** 53 - 1) ? Oa(e, t) ? t : new T(e, "bigDecimal") : Da(e) ? new T(e, "bigDecimal") : /[eE]/.test(e) ? Aa(e) : BigInt(e);
	}
	return t;
}
function Da(e) {
	let t = e.indexOf(".");
	if (t === -1) return !1;
	let n = e.search(/[eE]/);
	if (n === -1) return !0;
	let r = n - t - 1;
	return parseInt(e.slice(n + 1), 10) < r;
}
function Oa(e, t) {
	if (e === String(t) || Object.is(t, -0)) return !0;
	if (/[eE]/.test(e)) return ka(e) === ka(String(t));
	let n = e.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""), r = String(t);
	return n === r ? !0 : /[eE]/.test(r) ? n === ka(r) : !1;
}
function ka(e) {
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
function Aa(e) {
	let t = e.search(/[eE]/), n = parseInt(e.slice(t + 1), 10), r = e.startsWith("-"), i = e.slice(+!!r, t), a = i.indexOf("."), o, s;
	a === -1 ? (o = i, s = n) : (o = i.slice(0, a) + i.slice(a + 1), s = n - (i.length - a - 1)), o = o.replace(/0+$/, "") || "0";
	let c = BigInt(o) * 10n ** BigInt(s + (i.replace(".", "").length - o.length));
	return r ? -c : c;
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/json/needsReviver.js
A();
var ja = Symbol.for("@aws-sdk/reviver");
function Ma(e) {
	let t = k.of(e), n = t.getSchema();
	if (Array.isArray(n) && t.isStructSchema()) {
		if (ja in n) return n[ja];
		let e = Na(t, /* @__PURE__ */ new Set());
		return n[ja] = e, e;
	}
	return Na(t, /* @__PURE__ */ new Set());
}
function Na(e, t) {
	let n = e.getSchema();
	if (t.has(n)) return !1;
	if (t.add(n), e.isBigIntegerSchema() || e.isBigDecimalSchema()) return !0;
	if (e.isStructSchema()) {
		for (let [, n] of e.structIterator()) if (Na(n, t)) return !0;
	} else if (e.isListSchema() || e.isMapSchema()) {
		if (Na(e.getValueSchema(), t)) return !0;
	} else if (e.isDocumentSchema()) return !0;
	return !1;
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/common.js
O();
var Pa = (e, t) => Sr(e, t).then((e) => (t?.utf8Encoder ?? _)(e));
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/json/parseJsonBody.js
async function Fa(e, t, n) {
	let r;
	if (Ta() && typeof e?.[Symbol.asyncIterator] == "function") {
		let n = await Sr(e, t);
		typeof Buffer == "function" && (r = Buffer.isBuffer(n) ? n : Buffer.from(n.buffer, n.byteOffset, n.byteLength));
	}
	if (r ||= await Pa(e, t), r.length === 0) return {};
	let i = n && Ma(n) ? Ea : void 0;
	try {
		return JSON.parse(r, i);
	} catch (e) {
		throw e?.name === "SyntaxError" && Object.defineProperty(e, "$responseBodyText", { value: typeof r == "string" ? r : r.toString("utf8") }), e;
	}
}
var Ia = (e, t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), La = (e) => {
	let t = e;
	return typeof t == "number" && (t = t.toString()), t.indexOf(",") >= 0 && (t = t.split(",")[0]), t.indexOf(":") >= 0 && (t = t.split(":")[0]), t.indexOf("#") >= 0 && (t = t.split("#")[1]), t;
}, Ra = (e, t, n = !1) => za(e, t, n ? [
	"code",
	"header",
	"type"
] : [
	"type",
	"code",
	"header"
]), za = ({ headers: e }, t, n) => {
	for (; n.length > 0;) switch (n.shift()) {
		case "header":
			let n = Ia(e ?? {}, "x-amzn-errortype");
			if (n !== void 0) return La(e[n]);
			break;
		case "code":
			let r = Ia(t ?? {}, "code");
			if (r && t[r] !== void 0) return La(t[r]);
			break;
		case "type": if (t?.__type !== void 0) return La(t.__type);
	}
};
A(), O(), S();
var Ba = class extends Sa {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	async read(e, t) {
		let n = Ma(e) ? Ea : void 0, r;
		if (typeof t == "string") {
			if (t.length === 0) return {};
			r = JSON.parse(t, n);
		} else if (t instanceof Uint8Array && Ta()) {
			if (t.byteLength === 0) return {};
			let e = Buffer.isBuffer(t) ? t : Buffer.from(t.buffer, t.byteOffset, t.byteLength);
			r = JSON.parse(e, n);
		} else r = await Fa(t, this.serdeContext, e);
		return this._read(e, r);
	}
	readObject(e, t) {
		return this._read(e, t);
	}
	_read(e, t) {
		let n = typeof t == "object" && !!t, r = k.of(e);
		if (n) {
			if (r.isStructSchema()) return this._readStruct(r, t);
			if (Array.isArray(t) && r.isListSchema()) {
				let e = r.getValueSchema();
				if (this.needsTransform(e)) for (let n = 0; n < t.length; ++n) t[n] = this._read(e, t[n]);
				return t;
			}
			if (r.isMapSchema()) {
				let e = r.getValueSchema(), n = t;
				if (this.needsTransform(e)) for (let t in n) y(n, t) && (t === "__proto__" && gr(n), n[t] = this._read(e, n[t]));
				return n;
			}
		}
		if (r.isBlobSchema() && typeof t == "string") return l(t);
		let i = r.getMergedTraits().mediaType;
		if (r.isStringSchema() && typeof t == "string" && i) return i === "application/json" || i.endsWith("+json") ? w.from(t) : t;
		if (r.isTimestampSchema() && t != null) switch (ha(r, this.settings)) {
			case 5: return Ze(t);
			case 6: return tt(t);
			case 7: return nt(t);
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
					if (!y(e, t)) continue;
					t === "__proto__" && gr(e);
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
		n && (s = new Ca(t, r));
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/protocols/json/codec-v2/JsonBytesStringAdapter.js
O();
var Va = class e extends Uint8Array {
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
			e > Ha + 6e4 && (console.warn("@aws-sdk/core/protocols - WARN - JsonCodec2: you have called a string method on a Uint8Array request body. It has been automatically converted to string. In a future version this will throw an error."), Ha = e), this.string = _(this);
		}
		return this.string;
	}
}, Ha = 0;
A(), O(), S();
var Ua = new TextEncoder(), Wa = 123, Ga = 125, Ka = 91, qa = 93, Ja = 34, Ya = 58, Xa = 44, Za = 92, Qa = new Uint8Array([
	116,
	114,
	117,
	101
]), $a = new Uint8Array([
	102,
	97,
	108,
	115,
	101
]), eo = new Uint8Array([
	110,
	117,
	108,
	108
]), M = Array(128).fill(null);
M[8] = "b", M[9] = "t", M[10] = "n", M[12] = "f", M[13] = "r", M[34] = "\"", M[92] = "\\";
for (let e = 0; e < 32; e++) M[e] === null && (M[e] = "u00" + e.toString(16).padStart(2, "0"));
var to = 2048;
function no(e) {
	return Va.allocUnsafe(e);
}
var ro = class e extends Sa {
	settings;
	json;
	i = 0;
	rootSchema;
	rawValue;
	passthrough = !1;
	constructor(e) {
		super(), this.settings = e, this.json = no(to);
	}
	write(e, t) {
		this.i = 0, this.rawValue = t, this.rootSchema = k.of(e), this.passthrough = this.rootSchema.isBlobSchema() || this.rootSchema.isStringSchema(), this.passthrough || this.writeValue(this.rootSchema, t, void 0);
	}
	writeDiscriminatedDocument(e, t) {
		this.i = 0, this.rootSchema = k.of(e);
		let n = this.rootSchema;
		if (n.isStructSchema() && typeof t == "object" && t) {
			this.writeValue(n, t, void 0);
			let e = `"__type":"${n.getName(!0) ?? "Unknown"}",`, r = e.length;
			this.ensure(r), this.json.copyWithin(1 + r, 1, this.i), Ua.encodeInto(e, this.json.subarray(1)), this.i += r;
		} else this.writeValue(n, t, void 0);
	}
	flush() {
		this.rootSchema = void 0;
		let e = this.i;
		this.i = 0;
		let t = this.rawValue;
		if (this.rawValue = void 0, e === 0) return t;
		let n = this.json.subarray(0, e);
		return this.json = no(to), n;
	}
	ensure(e) {
		let { i: t, json: n } = this;
		if (t + e > n.length) {
			let r = n.length * 2;
			for (; r < t + e;) r *= 2;
			let i = no(r);
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
		n[r++] = Ja;
		for (let i = 0; i < t; ++i) n[r++] = e.charCodeAt(i);
		n[r++] = Ja, this.i = r;
	}
	writeJsonString(e) {
		let t = e.length;
		this.ensure(t * 3 + 2), this.json[this.i++] = Ja;
		for (let n = 0; n < t; ++n) {
			let r = e.charCodeAt(n);
			if (r > 34 && r < 92) this.json[this.i++] = r;
			else if (r < 128) {
				let e = M[r];
				if (e !== null) {
					this.ensure(e.length + 1 + (t - n - 1) * 3 + 1), this.json[this.i++] = Za;
					for (let t = 0; t < e.length; t++) this.json[this.i++] = e.charCodeAt(t);
				} else this.json[this.i++] = r;
			} else if (r >= 55296 && r <= 56319) {
				let i = n + 1 < t ? e.charCodeAt(n + 1) : 0;
				if (i >= 56320 && i <= 57343) {
					this.ensure(4);
					let { written: t } = Ua.encodeInto(e.substring(n, n + 2), this.json.subarray(this.i));
					this.i += t, ++n;
				} else this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			} else if (r >= 56320 && r <= 57343) this.ensure(6 + (t - n - 1) * 3 + 1), this.writeUnicodeEscape(r);
			else {
				let { i: e, json: t } = this;
				r < 2048 ? (t[e++] = 192 | r >> 6, t[e++] = 128 | r & 63) : (t[e++] = 224 | r >> 12, t[e++] = 128 | r >> 6 & 63, t[e++] = 128 | r & 63), this.i = e;
			}
		}
		this.json[this.i++] = Ja;
	}
	writeUnicodeEscape(e) {
		let { json: t, i: n } = this;
		t[n++] = Za, t[n++] = 117;
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
		r[a++] = Ja;
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
		r[a++] = Ja, this.i = a;
	}
	writeValue(e, t, n) {
		if (t == null) {
			if (n?.isStructSchema()) {
				if (t === void 0 && k.of(e).isIdempotencyToken()) {
					this.writeAsciiQuoted(xr());
					return;
				}
				return;
			}
			this.ensure(4), this.json.set(eo, this.i), this.i += 4;
			return;
		}
		let r = k.of(e), i = typeof t == "object";
		if (r.isStringSchema()) {
			let e = r.getMergedTraits().mediaType;
			if (e && (e === "application/json" || e.endsWith("+json"))) {
				this.writeJsonString(w.from(t).toString());
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
				let e = (this.serdeContext?.base64Encoder ?? p)(t);
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
			t ? (n.set(Qa, e), e += 4) : (n.set($a, e), e += 5), this.i = e;
		} else typeof t == "bigint" ? this.writeAscii(t.toString()) : this.writeAscii(String(t));
	}
	writeStruct(e, t) {
		this.ensure(2), this.json[this.i++] = Wa;
		let n = !1, r = typeof t.__type == "string", i;
		r && (i = /* @__PURE__ */ new Set());
		for (let [r, a] of e.structIterator()) {
			let o = t[r];
			if (o == null && !a.isIdempotencyToken()) continue;
			n && (this.ensure(1), this.json[this.i++] = Xa), n = !0;
			let s = this.settings.jsonName ? a.getMergedTraits().jsonName ?? r : r;
			i && (i.add(r), i.add(s)), this.writeAsciiQuoted(s), this.json[this.i++] = Ya, this.writeValue(a, o, e);
		}
		if (!n && e.isUnionSchema()) {
			let { $unknown: n } = t;
			if (Array.isArray(n)) {
				let [t, r] = n;
				this.writeAsciiQuoted(t), this.ensure(1), this.json[this.i++] = Ya, this.writeValue(15, r, e);
			}
		} else if (r) for (let e in t) {
			if (i.has(e)) continue;
			i.add(e);
			let r = t[e];
			n && (this.ensure(1), this.json[this.i++] = Xa), n = !0, this.writeAsciiQuoted(e), this.ensure(1), this.json[this.i++] = Ya, this.writeValue(15, r, void 0);
		}
		this.ensure(1), this.json[this.i++] = Ga;
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
			this.ensure(n.length * 3), this.i += Ua.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Ka;
		let a = !1;
		for (let e = 0; e < t.length; ++e) {
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a && (this.ensure(1), this.json[this.i++] = Xa), this.writeValue(i, o, void 0), a = !0);
		}
		this.ensure(1), this.json[this.i++] = qa;
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
			e && Object.assign(t, e), this.ensure(n.length * 3), this.i += Ua.encodeInto(n, this.json.subarray(this.i)).written;
			return;
		}
		this.ensure(2), this.json[this.i++] = Wa;
		let a = !0;
		for (let e in t) {
			if (!y(t, e)) continue;
			let o = t[e];
			(n ? o === void 0 : o == null && !r) || (a || (this.ensure(1), this.json[this.i++] = Xa), a = !1, this.writeJsonString(e), this.ensure(1), this.json[this.i++] = Ya, this.writeValue(i, o, void 0));
		}
		this.ensure(1), this.json[this.i++] = Ga;
	}
	writeTimestamp(e, t) {
		switch (ha(e, this.settings)) {
			case 5: {
				let e = t.toISOString().replace(".000Z", "Z");
				this.writeAsciiQuoted(e);
				return;
			}
			case 6:
				this.writeAsciiQuoted(qe(t));
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
}, io = class extends Sa {
	settings;
	constructor(e) {
		super(), this.settings = e;
	}
	createSerializer() {
		let e = new ro(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
	createDeserializer() {
		let e = new Ba(this.settings);
		return e.setSerdeContext(this.serdeContext), e;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-host-header/hostHeaderMiddleware.js
he();
function ao(e) {
	return e;
}
var oo = (e) => (t) => async (n) => {
	if (!b.isInstance(n.request)) return t(n);
	let { request: r } = n, { handlerProtocol: i = "" } = e.requestHandler.metadata || {};
	if (i.indexOf("h2") >= 0 && !r.headers[":authority"]) delete r.headers.host, r.headers[":authority"] = r.hostname + (r.port ? ":" + r.port : "");
	else if (!r.headers.host) {
		let e = r.hostname;
		r.port != null && (e += `:${r.port}`), r.headers.host = e;
	}
	return t(n);
}, so = {
	name: "hostHeaderMiddleware",
	step: "build",
	priority: "low",
	tags: ["HOST"],
	override: !0
}, co = (e) => ({ applyToStack: (t) => {
	t.add(oo(e), so);
} }), lo = () => (e, t) => async (n) => {
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
}, uo = {
	name: "loggerMiddleware",
	tags: ["LOGGER"],
	step: "initialize",
	override: !0
}, fo = (e) => ({ applyToStack: (e) => {
	e.add(lo(), uo);
} }), po = (e) => ({ applyToStack: (e) => {} }), mo = (e, t) => {
	if (!t || t.length === 0) return e;
	let n = [];
	for (let r of t) for (let t of e) t.schemeId.split("#")[1] === r && n.push(t);
	for (let t of e) n.find(({ schemeId: e }) => e === t.schemeId) || n.push(t);
	return n;
};
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/legacy-root-exports/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
S();
function ho(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.schemeId, n);
	return t;
}
var go = (e, t) => (n, r) => async (i) => {
	let a = mo(e.httpAuthSchemeProvider(await t.httpAuthSchemeParametersProvider(e, r, i.input)), e.authSchemePreference ? await e.authSchemePreference() : []), o = ho(e.httpAuthSchemes), s = de(r), c = [];
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
}, _o = {
	step: "serialize",
	tags: ["HTTP_AUTH_SCHEME"],
	name: "httpAuthSchemeMiddleware",
	override: !0,
	relation: "before",
	toMiddleware: "endpointV2Middleware"
}, vo = (e, { httpAuthSchemeParametersProvider: t, identityProviderConfigProvider: n }) => ({ applyToStack: (r) => {
	r.addRelativeTo(go(e, {
		httpAuthSchemeParametersProvider: t,
		identityProviderConfigProvider: n
	}), _o);
} });
he(), S();
var yo = (e) => (e) => {
	throw e;
}, bo = (e, t) => {}, xo = (e) => (e, t) => async (n) => {
	if (!b.isInstance(n.request)) return e(n);
	let r = de(t).selectedHttpAuthScheme;
	if (!r) throw Error("No HttpAuthScheme was selected: unable to sign request");
	let { httpAuthOption: { signingProperties: i = {} }, identity: a, signer: o } = r, s = await e({
		...n,
		request: await o.sign(n.request, a, i)
	}).catch((o.errorHandler || yo)(i));
	return (o.successHandler || bo)(s.response, i), s;
}, So = {
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
}, Co = (e) => ({ applyToStack: (t) => {
	t.addRelativeTo(xo(e), So);
} }), wo = (e) => {
	if (typeof e == "function") return e;
	let t = Promise.resolve(e);
	return () => t;
};
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/legacy-root-exports/util-identity-and-auth/DefaultIdentityProviderConfig.js
S();
var To = class {
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
}, Eo = ((e) => function(t) {
	return Do(t) && t.expiration.getTime() - Date.now() < e;
})(3e5), Do = (e) => e.expiration !== void 0, Oo = (e, t, n) => {
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
function ko(e) {
	return e === void 0 || typeof e == "string" && e.length <= 50;
}
function Ao(e) {
	let t = wo(e.userAgentAppId ?? void 0), { customUserAgent: n } = e;
	return Object.assign(e, {
		customUserAgent: typeof n == "string" ? [[n]] : n,
		userAgentAppId: async () => {
			let n = await t();
			if (!ko(n)) {
				let t = e.logger?.constructor?.name === "NoOpLogger" || !e.logger ? console : e.logger;
				typeof n == "string" ? n.length > 50 && t?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.") : t?.warn("userAgentAppId must be a string or undefined.");
			}
			return n;
		}
	});
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/lib/aws/partition.js
var jo = {
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
				"me-west-1": { description: "Middle East (Saudi Arabia)" },
				"mx-central-1": { description: "Mexico (Central)" },
				"sa-east-1": { description: "South America (Sao Paulo)" },
				"sa-west-1": { description: "South America (Chile)" },
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
}, Mo = "", No = (e) => {
	let { partitions: t } = jo;
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
}, Po = () => Mo, Fo = (e) => e?.body instanceof ReadableStream, Io = (e, t) => {
	let n = [];
	if (e && n.push(e), t) for (let e of t) n.push(e);
	return n;
}, N = (e, t) => `${e || "anonymous"}${t && t.length > 0 ? ` (a.k.a. ${t.join(",")})` : ""}`, Lo = () => {
	let e = [], t = [], n = !1, r = /* @__PURE__ */ new Set(), i = (e) => e.sort((e, t) => Ro[t.step] - Ro[e.step] || zo[t.priority || "normal"] - zo[e.priority || "normal"]), a = (n) => {
		let i = !1, a = (e) => {
			let t = Io(e.name, e.aliases);
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
				for (let t of Io(e.name, e.aliases)) r.delete(t);
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
			for (let e of Io(t.name, t.aliases)) o[e] = t;
			r.push(t);
		}), t.forEach((e) => {
			let t = {
				...e,
				before: [],
				after: []
			};
			for (let e of Io(t.name, t.aliases)) o[e] = t;
			a.push(t);
		}), a.forEach((e) => {
			if (e.toMiddleware) {
				let t = o[e.toMiddleware];
				if (t === void 0) {
					if (n) return;
					throw Error(`${e.toMiddleware} is not found when adding ${N(e.name, e.aliases)} middleware ${e.relation} ${e.toMiddleware}`);
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
			}, c = Io(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${N(i, o)}'`);
					for (let t of c) {
						let n = e.findIndex((e) => e.name === t || e.aliases?.some((e) => e === t));
						if (n === -1) continue;
						let r = e[n];
						if (r.step !== s.step || s.priority !== r.priority) throw Error(`"${N(r.name, r.aliases)}" middleware with ${r.priority} priority in ${r.step} step cannot be overridden by "${N(i, o)}" middleware with ${s.priority} priority in ${s.step} step.`);
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
			}, c = Io(i, o);
			if (c.length > 0) {
				if (c.some((e) => r.has(e))) {
					if (!a) throw Error(`Duplicate middleware name '${N(i, o)}'`);
					for (let e of c) {
						let n = t.findIndex((t) => t.name === e || t.aliases?.some((t) => t === e));
						if (n === -1) continue;
						let r = t[n];
						if (r.toMiddleware !== s.toMiddleware || r.relation !== s.relation) throw Error(`"${N(r.name, r.aliases)}" middleware ${r.relation} "${r.toMiddleware}" middleware cannot be overridden by "${N(i, o)}" middleware ${s.relation} "${s.toMiddleware}" middleware.`);
						t.splice(n, 1);
					}
				}
				for (let e of c) r.add(e);
			}
			t.push(s);
		},
		clone: () => s(Lo()),
		use: (e) => {
			e.applyToStack(u);
		},
		remove: (e) => typeof e == "string" ? a(e) : o(e),
		removeByTag: (n) => {
			let i = !1, a = (e) => {
				let { tags: t, name: a, aliases: o } = e;
				if (t && t.includes(n)) {
					let e = Io(a, o);
					for (let t of e) r.delete(t);
					return i = !0, !1;
				}
				return !0;
			};
			return e = e.filter(a), t = t.filter(a), i;
		},
		concat: (e) => {
			let t = s(Lo());
			return t.use(e), t.identifyOnResolve(n || t.identifyOnResolve() || (e.identifyOnResolve?.() ?? !1)), t;
		},
		applyToStack: s,
		identify: () => l(!0).map((e) => {
			let t = e.step ?? e.relation + " " + e.toMiddleware;
			return N(e.name, e.aliases) + " - " + t;
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
}, Ro = {
	initialize: 5,
	serialize: 4,
	build: 3,
	finalizeRequest: 2,
	deserialize: 1
}, zo = {
	high: 3,
	normal: 2,
	low: 1
}, Bo = (e) => () => Promise.reject(e), Vo = class {
	config;
	middlewareStack = Lo();
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
};
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/schemaLogFilter.js
A();
var Ho = "***SensitiveInformation***";
function Uo(e, t) {
	if (t == null) return t;
	let n = k.of(e);
	if (n.getMergedTraits().sensitive) return Ho;
	if (n.isListSchema()) {
		let e = n.getValueSchema();
		if (e.getMergedTraits().sensitive) return Ho;
		if (Array.isArray(t)) return t.map((t) => Uo(e, t));
	} else if (n.isMapSchema()) {
		let e = n.getValueSchema();
		if (n.getKeySchema().getMergedTraits().sensitive || e.getMergedTraits().sensitive) return Ho;
		if (typeof t == "object") return Object.fromEntries(Object.entries(t).map(([t, n]) => [t, Uo(e, n)]));
	} else if (n.isStructSchema() && typeof t == "object") {
		let e = t, r = {};
		for (let [t, i] of n.structIterator()) e[t] != null && (r[t] = Uo(i, e[t]));
		return r;
	}
	return t;
}
ue(), A();
var Wo = Symbol.for("@smithy/op-event-stream"), Go = class {
	middlewareStack = Lo();
	schema;
	static classBuilder() {
		return new Ko();
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
				...n?.metricsRecorder === void 0 ? {} : { metricsRecorder: n.metricsRecorder },
				...n?.abortSignal === void 0 ? {} : { abortSignal: n.abortSignal }
			}
		}, { requestHandler: h } = t, g = n ?? {};
		g.metricsRecorder && (g = { ...g }, delete g.metricsRecorder);
		let _, ee = this.schema, te = ee?.[Wo];
		if (te !== void 0) _ = te;
		else if (ee && Array.isArray(ee) && ee[0] === 9) {
			let [, , , , e, t] = ee;
			_ = ee[Wo] = !!(k.of(e).getEventStreamMember() || k.of(t).getEventStreamMember());
		}
		return _ && (g = {
			isEventStream: _,
			...g
		}), d.resolve((e) => h.handle(e.request, g), m);
	}
}, Ko = class {
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
		return t = class extends Go {
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
					inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (a ? Uo.bind(null, o) : (e) => e),
					outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (a ? Uo.bind(null, s) : (e) => e),
					smithyContext: e._smithyContext,
					additionalContext: e._additionalContext
				});
			}
			serialize = e._serializer;
			deserialize = e._deserializer;
		};
	}
}, qo = class e extends Error {
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
}, Jo = (e, t = {}) => (Object.entries(t).filter(([, e]) => e !== void 0).forEach(([t, n]) => {
	(e[t] == null || e[t] === "") && (e[t] = n);
}), e.message = e.message || e.Message || "UnknownError", delete e.Message, e), Yo = (e) => {
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
S(), ue();
var Xo = Object.values(ae), Zo = (e) => {
	let t = [];
	for (let n in ae) {
		if (!y(ae, n)) continue;
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
			Xo.includes(r) ? e.checksumAlgorithms[r.toUpperCase()] = i : e.checksumAlgorithms[r] = i, t.push(n);
		},
		checksumAlgorithms() {
			return t;
		}
	};
}, Qo = (e) => {
	let t = {};
	return e.checksumAlgorithms().forEach((e) => {
		let n = e.algorithmId();
		Xo.includes(n) && (t[n] = e.checksumConstructor());
	}), t;
}, $o = (e) => ({
	setRetryStrategy(t) {
		e.retryStrategy = t;
	},
	retryStrategy() {
		return e.retryStrategy;
	}
}), es = (e) => {
	let t = {};
	return t.retryStrategy = e.retryStrategy(), t;
}, ts = (e) => Object.assign(Zo(e), $o(e)), ns = (e) => Object.assign(Qo(e), es(e)), rs = class {
	trace() {}
	debug() {}
	info() {}
	warn() {}
	error() {}
};
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/client/smithy-client/client-command-builder.js
function is(e, t, n, r) {
	return function(i, a, o, s, c = {}) {
		let l = Object.assign({}, e, i);
		return Go.classBuilder().ep(l).m(function(e, t, n, i) {
			let o = a.call(this, e, t, n, i);
			return o.unshift(r(n, e.getEndpointParameterInstructions())), o;
		}).s(t, o, c).n(n, o.charAt(0).toUpperCase() + o.slice(1) + "Command").sc(s).build();
	};
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/retry/service-error-classification/constants.js
var as = [
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
], os = [
	"TimeoutError",
	"RequestTimeout",
	"RequestTimeoutException"
], ss = [
	500,
	502,
	503,
	504
], cs = [
	"ECONNRESET",
	"ECONNREFUSED",
	"EPIPE",
	"ETIMEDOUT"
], ls = [
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"EAI_AGAIN"
], us = (e) => e?.$retryable !== void 0, ds = (e) => e.$metadata?.clockSkewCorrected, fs = (e) => {
	let t = /* @__PURE__ */ new Set([
		"Failed to fetch",
		"NetworkError when attempting to fetch resource",
		"The Internet connection appears to be offline",
		"Load failed",
		"Network request failed"
	]);
	return e && e instanceof TypeError ? t.has(e.message) : !1;
}, ps = (e) => e.$metadata?.httpStatusCode === 429 || as.includes(e.name) || e.$retryable?.throttling == 1, ms = (e, t = 0) => e?.name !== "AbortError" && (us(e) || ds(e) || e.name === "InvalidSignatureException" && e.message?.includes("Signature expired") || os.includes(e.name) || cs.includes(e?.code || "") || ls.includes(e?.code || "") || ss.includes(e.$metadata?.httpStatusCode || 0) || fs(e) || gs(e) || e.cause !== void 0 && t <= 10 && ms(e.cause, t + 1)), hs = (e) => {
	if (e.$metadata?.httpStatusCode !== void 0) {
		let t = e.$metadata.httpStatusCode;
		return 500 <= t && t <= 599 && !ms(e);
	}
	return !1;
};
function gs(e) {
	return e.code === "ERR_HTTP2_STREAM_ERROR" && e.message.includes("NGHTTP2_REFUSED_STREAM");
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/race.js
var _s = (e, t) => {
	if (!t) return e;
	let n = () => {}, r = new Promise((e, r) => {
		let i = () => r(vs());
		t.aborted ? i() : typeof t.addEventListener == "function" ? (t.addEventListener("abort", i, { once: !0 }), n = () => t.removeEventListener("abort", i)) : t.onabort = i;
	});
	return Promise.race([e, r]).finally(n);
}, vs = () => Object.assign(/* @__PURE__ */ Error("Request aborted"), { name: "AbortError" }), ys = (e) => typeof e == "object" && !!e && "name" in e && e.name === "AbortError", bs = 2e4, xs = "amz-sdk-invocation-id", Ss = "amz-sdk-request";
S(), _e(), O();
function Cs(e, t) {
	if (ge.isInstance(e)) for (let n in e.headers) {
		if (!y(e.headers, n)) continue;
		let r = n.toLowerCase();
		if (r === "retry-after") {
			let r = e.headers[n], i = NaN;
			if (r.endsWith("GMT")) try {
				i = (tt(r).getTime() - Date.now()) / 1e3;
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/util.js
var ws = (e) => e instanceof Error ? e : e instanceof Object ? Object.assign(/* @__PURE__ */ Error(), e) : Error(typeof e == "string" ? e : `AWS SDK error wrapper for ${e}`);
he(), O(), ue();
function Ts(e) {
	return (t) => (n, r) => async (i) => {
		let a = await t.retryStrategy(), o = await t.maxAttempts(), s = r[ce]?.abortSignal;
		if (Es(a)) {
			a = a;
			let c = (r.partition_id ?? "") + (r.__retryLongPoll ? ":longpoll" : ""), l = await _s(a.acquireInitialRetryToken(c), s), u = /* @__PURE__ */ Error(), d = 0, f = 0, { request: p } = i, m = b.isInstance(p);
			for (m && (p.headers[xs] = br());;) try {
				m && (p.headers[Ss] = `attempt=${d + 1}; max=${o}`);
				let { response: e, output: t } = await n(i);
				return a.recordSuccess(l), t.$metadata.attempts = d + 1, t.$metadata.totalRetryDelay = f, {
					response: e,
					output: t
				};
			} catch (n) {
				let i = Ds(n, t.logger);
				if (u = ws(n), m && e(p)) throw (r.logger instanceof rs ? console : r.logger)?.warn("An error was encountered in a non-retryable streaming request."), u;
				try {
					l = await _s(a.refreshRetryTokenForRetry(l, i), s);
				} catch (e) {
					throw s?.aborted && ys(e) ? e : (u.$metadata || (u.$metadata = {}), u.$metadata.attempts = d + 1, u.$metadata.totalRetryDelay = f, u);
				}
				d = l.getRetryCount();
				let o = l.getRetryDelay();
				f += (l?.$retryLog?.acquisitionDelay ?? 0) + o, o > 0 && await _s(new Promise((e) => setTimeout(e, o)), s);
			}
		} else return a = a, a?.mode && (r.userAgent = [...r.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(n, i);
	};
}
var Es = (e) => e.acquireInitialRetryToken !== void 0 && e.refreshRetryTokenForRetry !== void 0 && e.recordSuccess !== void 0, Ds = (e, t) => {
	let n = {
		error: e,
		errorType: Os(e)
	}, r = Cs(e.$response, t);
	return r && (n.retryAfterHint = r), n;
}, Os = (e) => ps(e) ? "THROTTLING" : ms(e) ? "TRANSIENT" : hs(e) ? "SERVER_ERROR" : "CLIENT_ERROR", ks = {
	name: "retryMiddleware",
	tags: ["RETRY"],
	step: "finalizeRequest",
	priority: "high",
	override: !0
};
function As(e) {
	let t = Ts(e);
	return (e) => ({ applyToStack: (n) => {
		n.add(t(e), ks);
	} });
}
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/retry/util-retry/DefaultRateLimiter.js
var js = class e {
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
		if (n?.errorType === "THROTTLING" || ps(n?.error ?? e)) {
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
}, P = class {
	static v2026 = !0;
	static delay() {
		return 50;
	}
	static throttlingDelay() {
		return 1e3;
	}
	static cost() {
		return 14;
	}
	static throttlingCost() {
		return 5;
	}
	static modifiedCostType() {
		return "THROTTLING";
	}
}, Ms = class {
	x = P.delay();
	computeNextBackoffDelay(e) {
		let t = Math.random() * Math.min(this.x * 2 ** e, bs);
		return Math.floor(t);
	}
	setDelayBase(e) {
		this.x = e;
	}
}, Ns = class {
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
		return Math.min(bs, this.delay);
	}
	getRetryCost() {
		return this.cost;
	}
	isLongPoll() {
		return this.longPoll;
	}
}, Ps;
(function(e) {
	e.STANDARD = "standard", e.ADAPTIVE = "adaptive";
})(Ps ||= {});
var Fs = Ps.STANDARD, Is = {
	incompatible: 1,
	attempts: 2,
	capacity: 3
}, Ls = class {
	mode = Ps.STANDARD;
	retryBackoffStrategy;
	capacity = 500;
	maxAttemptsProvider;
	baseDelay;
	constructor(e) {
		typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ??= async () => 3, this.baseDelay ??= P.delay(), this.retryBackoffStrategy ??= new Ms();
	}
	async acquireInitialRetryToken(e) {
		return new Ns(P.delay(), 0, void 0, e.includes(":longpoll"));
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
				let r = new Ns(0, e.getRetryCount() + 1, t, e.isLongPoll?.() ?? !1);
				return await new Promise((e) => setTimeout(e, s)), r.$retryLog.acquisitionDelay = s, r;
			}
			{
				let e = r === Is.capacity && a ? s : 0;
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
		let r = e.getRetryCount() + 1, i = this.isRetryableError(t.errorType) ? 0 : Is.incompatible, a = r < n ? 0 : Is.attempts, o = this.capacity >= this.getCapacityCost(t.errorType) ? 0 : Is.capacity;
		return i || a || o;
	}
	getCapacityCost(e) {
		return e === P.modifiedCostType() ? P.throttlingCost() : P.cost();
	}
	isRetryableError(e) {
		return e === "THROTTLING" || e === "TRANSIENT";
	}
}, Rs = class {
	mode = Ps.ADAPTIVE;
	rateLimiter;
	standardRetryStrategy;
	constructor(e, t) {
		let { rateLimiter: n } = t ?? {};
		this.rateLimiter = n ?? new js(), this.standardRetryStrategy = t ? new Ls({
			maxAttempts: typeof e == "number" ? e : 3,
			...t
		}) : new Ls(e);
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/retry/middleware-retry/configurations.js
Ce();
var zs = (e, t) => {
	let { retryStrategy: n, retryMode: r } = e, { defaultMaxAttempts: i = 3, defaultBaseDelay: a = P.delay() } = t ?? {}, o = x(e.maxAttempts ?? i), s = n ? Promise.resolve(n) : void 0, c = async () => {
		let e = await o();
		return await x(r)() === Ps.ADAPTIVE ? new Rs(o, {
			maxAttempts: e,
			baseDelay: a
		}) : new Ls({
			maxAttempts: e,
			baseDelay: a
		});
	};
	return Object.assign(e, {
		maxAttempts: o,
		retryStrategy: () => s ??= c()
	});
}, Bs = As(Fo), Vs = /\d{12}\.ddb/;
async function Hs(e, t, n) {
	if (n.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor" && i(e, "PROTOCOL_RPC_V2_CBOR", "M"), typeof t.retryStrategy == "function") {
		let n = await t.retryStrategy();
		if (typeof n.mode == "string") switch (n.mode) {
			case Ps.ADAPTIVE:
				i(e, "RETRY_MODE_ADAPTIVE", "F");
				break;
			case Ps.STANDARD: i(e, "RETRY_MODE_STANDARD", "E");
		}
	}
	if (typeof t.accountIdEndpointMode == "function") {
		let n = e.endpointV2;
		switch (String(n?.url?.hostname).match(Vs) && i(e, "ACCOUNT_ID_ENDPOINT", "O"), await t.accountIdEndpointMode?.()) {
			case "disabled":
				i(e, "ACCOUNT_ID_MODE_DISABLED", "Q");
				break;
			case "preferred":
				i(e, "ACCOUNT_ID_MODE_PREFERRED", "P");
				break;
			case "required": i(e, "ACCOUNT_ID_MODE_REQUIRED", "R");
		}
	}
	let r = e.__smithy_context?.selectedHttpAuthScheme?.identity;
	if (r?.$source) {
		let t = r;
		t.accountId && i(e, "RESOLVED_ACCOUNT_ID", "T");
		for (let [n, r] of Object.entries(t.$source ?? {})) i(e, n, r);
	}
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/constants.js
var Us = "user-agent", Ws = "x-amz-user-agent", Gs = /[^!$%&'*+\-.^_`|~\w]/g, Ks = /[^!$%&'*+\-.^_`|~\w#]/g, qs = 1024;
function Js(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (t.length + r.length + 1 <= qs) t.length ? t += "," + r : t += r;
		else break;
	}
	return t;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/middleware-user-agent/user-agent-middleware.js
he();
var Ys = (e) => (t, n) => async (r) => {
	let { request: i } = r;
	if (!b.isInstance(i)) return t(r);
	let { headers: a } = i, o = n?.userAgent?.map(Xs) || [], s = (await e.defaultUserAgentProvider()).map(Xs);
	await Hs(n, e, r);
	let c = n;
	s.push(`m/${Js(Object.assign({}, n.__smithy_context?.features, c.__aws_sdk_context?.features))}`);
	let l = e?.customUserAgent?.map(Xs) || [], u = await e.userAgentAppId();
	u && s.push(Xs(["app", `${u}`]));
	let d = Po(), f = (d ? [d] : []).concat([
		...s,
		...o,
		...l
	]).join(" "), p = [...s.filter((e) => e.startsWith("aws-sdk-")), ...l].join(" ");
	return e.runtime === "browser" ? a[Ws] = f : (p && (a[Ws] = a["x-amz-user-agent"] ? `${a[Us]} ${p}` : p), a[Us] = f), t({
		...r,
		request: i
	});
}, Xs = (e) => {
	let t = e[0].split("/").map((e) => e.replace(Gs, "-")).join("/"), n = e[1]?.replace(Ks, "-"), r = t.indexOf("/"), i = t.substring(0, r), a = t.substring(r + 1);
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
}, Zs = {
	name: "getUserAgentMiddleware",
	step: "build",
	priority: "low",
	tags: ["SET_USER_AGENT", "USER_AGENT"],
	override: !0
}, Qs = (e) => ({ applyToStack: (t) => {
	t.add(Ys(e), Zs);
} }), $s = ({ serviceId: e, clientVersion: t }) => async (n) => {
	let r = typeof window < "u" ? window.navigator : void 0, i = r?.userAgent ?? "", a = r?.userAgentData?.platform ?? ec.os(i) ?? "other", o = r?.userAgentData?.brands ?? [], s = o[o.length - 1], c = s?.brand ?? ec.browser(i) ?? "unknown", l = s?.version ?? "unknown", u = [
		["aws-sdk-js", t],
		["ua", "2.1"],
		[`os/${a}`, void 0],
		["lang/js"],
		["md/browser", `${c}_${l}`]
	];
	e && u.push([`api/${e}`, t]);
	let d = await n?.userAgentAppId?.();
	return d && u.push([`app/${d}`]), u;
}, ec = {
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
hr(), An();
var tc = (e, t = !1) => {
	if (t) {
		for (let t of e.split(".")) if (!tc(t)) return !1;
		return !0;
	}
	return !(!ye(e) || e.length < 3 || e.length > 63 || e !== e.toLowerCase() || kn(e));
}, nc = ":", rc = "/", ic = (e) => {
	let t = e.split(nc);
	if (t.length < 6) return null;
	let [n, r, i, a, o, ...s] = t;
	return n !== "arn" || r === "" || i === "" || s.join(nc) === "" ? null : {
		partition: r,
		service: i,
		region: a,
		accountId: o,
		resourceId: s.map((e) => e.split(rc)).flat()
	};
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/client/util-endpoints/aws.js
hr();
var ac = {
	isVirtualHostableS3Bucket: tc,
	parseArn: ic,
	partition: No
};
fn.aws = ac;
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/config/property-provider/memoize.js
var oc = (e, t, n) => {
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
// ../../node_modules/.pnpm/@smithy+core@3.40.0/node_modules/@smithy/core/dist-es/submodules/config/config-resolver/regionConfig/checkRegion.js
S();
var sc = /* @__PURE__ */ new Set(), cc = (e, t = ye) => {
	if (!sc.has(e) && !t(e)) {
		if (e === "*") console.warn("@smithy/config-resolver WARN - Please use the caller region instead of \"*\". See \"sigv4a\" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.");
		else throw Error(`Region not accepted: region="${e}" is not a valid hostname component.`);
	} else sc.add(e);
}, lc = (e) => typeof e == "string" && (e.startsWith("fips-") || e.endsWith("-fips")), uc = (e) => lc(e) ? ["fips-aws-global", "aws-fips"].includes(e) ? "us-east-1" : e.replace(/fips-(dkr-|prod-)?|-fips/, "") : e, dc = (e) => {
	let { region: t, useFipsEndpoint: n } = e;
	if (!t) throw Error("Region is missing");
	return Object.assign(e, {
		region: async () => {
			let e = uc(typeof t == "function" ? await t() : t);
			return cc(e), e;
		},
		useFipsEndpoint: async () => lc(typeof t == "string" ? t : await t()) ? !0 : typeof n == "function" ? n() : Promise.resolve(!!n)
	});
}, fc = [
	"in-region",
	"cross-region",
	"mobile",
	"standard",
	"legacy"
], pc = ({ defaultsMode: e } = {}) => oc(async () => {
	let t = typeof e == "function" ? await e() : e;
	switch (t?.toLowerCase()) {
		case "auto": return Promise.resolve(mc() ? "mobile" : "standard");
		case "mobile":
		case "in-region":
		case "cross-region":
		case "standard":
		case "legacy": return Promise.resolve(t?.toLocaleLowerCase());
		case void 0: return Promise.resolve("legacy");
		default: throw Error(`Invalid parameter for "defaultsMode", expect ${fc.join(", ")}, got ${t}`);
	}
}), mc = () => {
	let e = window?.navigator;
	if (e?.connection) {
		let { effectiveType: t, rtt: n, downlink: r } = e.connection;
		if (typeof t == "string" && t !== "4g" || Number(n) > 100 || Number(r) < 10) return !0;
	}
	return e?.userAgentData?.mobile || typeof e?.maxTouchPoints == "number" && e?.maxTouchPoints > 1;
}, hc = (e) => ({
	setRegion(t) {
		e.region = t;
	},
	region() {
		return e.region;
	}
}), gc = (e) => ({ region: e.region() });
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
_e();
var _c = (e) => ge.isInstance(e) ? e.headers?.date ?? e.headers?.Date : void 0, vc = (e) => ge.isInstance(e) ? e.headers?.age ?? e.headers?.Age : void 0, yc = (e) => new Date(Date.now() + e), bc = (e, t, n, r) => {
	if (r !== void 0) return t;
	let i = Date.parse(e);
	if (Number.isNaN(i)) return t;
	let a = Date.now();
	return n !== void 0 && a - n > 9e5 ? t : i - a;
};
he(), ue();
var xc = (e, t) => {
	if (!t) throw Error(`Property \`${e}\` is not resolved for AWS SDK SigV4Auth`);
	return t;
}, Sc = (e) => e.context?.[ce]?.eventStream?.output === !0, Cc = async (e) => {
	let t = xc("context", e.context), n = xc("config", e.config), r = t.endpointV2?.properties?.authSchemes?.[0];
	return {
		config: n,
		signer: await xc("signer", n.signer)(r),
		signingRegion: e?.signingRegion,
		signingRegionSet: e?.signingRegionSet,
		signingName: e?.signingName
	};
}, wc = class {
	async sign(e, t, n) {
		if (!b.isInstance(e)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
		let r = await Cc(n), { config: i, signer: a } = r, { signingRegion: o, signingName: s } = r, c = n.context;
		if (c?.authSchemes?.length ?? !1) {
			let [e, t] = c.authSchemes;
			e?.name === "sigv4a" && t?.name === "sigv4" && (o = t?.signingRegion ?? o, s = t?.signingName ?? s);
		}
		let l = await i.disableClockSkewCorrection?.() === !0;
		n._disableClockSkewCorrection = l;
		let u = l || Sc(n);
		return n._skipClockSkewSampling = u, u || (n._preRequestSystemClockOffset = i.systemClockOffset, n._requestSentAt = Date.now()), await a.sign(e, {
			signingDate: l ? /* @__PURE__ */ new Date() : yc(i.systemClockOffset),
			signingRegion: o,
			signingService: s
		});
	}
	errorHandler(e) {
		return (t) => {
			let n = t;
			if (!e._skipClockSkewSampling && !e._disableClockSkewCorrection) {
				let t = n.ServerTime ?? _c(n.$response);
				if (t) {
					let r = xc("config", e.config), i = e._preRequestSystemClockOffset, a = e._requestSentAt, o = vc(n.$response), s = bc(t, r.systemClockOffset, a, o);
					r.systemClockOffset = s, Math.abs(s) >= 24e4 && (s !== i || i !== void 0 && i !== s) && n.$metadata && (n.$metadata.clockSkewCorrected = !0);
				}
			}
			throw t;
		};
	}
	successHandler(e, t) {
		if (t._skipClockSkewSampling || t._disableClockSkewCorrection) return;
		let n = _c(e);
		if (n) {
			let r = xc("config", t.config), i = t._requestSentAt, a = vc(e);
			r.systemClockOffset = bc(n, r.systemClockOffset, i, a);
		}
	}
}, Tc, Ec = t((() => {
	Tc = (e) => new TextEncoder().encode(e);
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/hasOwn.js
function Dc(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
var Oc = t((() => {}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/transport/httpRequest.js
function kc(e) {
	return Object.keys(e).reduce((t, n) => {
		let r = e[n];
		return {
			...t,
			[n]: Array.isArray(r) ? [...r] : r
		};
	}, {});
}
var Ac, jc = t((() => {
	Ac = class e {
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
			return n.query &&= kc(n.query), n;
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
})), Mc, Nc = t((() => {
	Mc = (e) => {
		if (typeof e == "function") return e;
		let t = Promise.resolve(e);
		return () => t;
	};
})), Pc = t((() => {
	Oc(), jc(), Nc();
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/util-hex-encoding/hex-encoding.js
function Fc(e) {
	if (e.length % 2 != 0) throw Error("Hex encoded strings must have an even number length");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < e.length; n += 2) {
		let r = e.slice(n, n + 2).toLowerCase();
		if (r in Rc) t[n / 2] = Rc[r];
		else throw Error(`Cannot decode unrecognized sequence ${r} as hexadecimal`);
	}
	return t;
}
function Ic(e) {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Lc[e[n]];
	return t;
}
var Lc, Rc, zc = t((() => {
	Lc = {}, Rc = {};
	for (let e = 0; e < 256; e++) {
		let t = e.toString(16).toLowerCase();
		t.length === 1 && (t = `0${t}`), Lc[e] = t, Rc[t] = e;
	}
})), Bc, Vc = t((() => {
	Ec(), Bc = (e) => e instanceof Uint8Array ? e : typeof e == "string" ? Tc(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(e);
})), Hc, Uc = t((() => {
	Hc = (e) => typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || Object.prototype.toString.call(e) === "[object ArrayBuffer]";
}));
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/serde/writeKey.js
function Wc(e) {
	Object.defineProperty(e, "__proto__", {
		value: void 0,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
var Gc = t((() => {})), F = t((() => {
	Ec(), Pc(), zc(), Vc(), Uc(), Gc();
}));
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
F();
var Kc = class {
	format(e) {
		let t = [];
		for (let n in e) {
			if (!Dc(e, n)) continue;
			let r = Tc(n);
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
				let o = Tc(e.value), s = new DataView(new ArrayBuffer(3 + o.byteLength));
				s.setUint8(0, 7), s.setUint16(1, o.byteLength, !1);
				let c = new Uint8Array(s.buffer);
				return c.set(o, 3), c;
			case "timestamp":
				let l = /* @__PURE__ */ new Uint8Array(9);
				return l[0] = 8, l.set(Yc.fromNumber(e.value.valueOf()).bytes, 1), l;
			case "uuid":
				if (!Jc.test(e.value)) throw Error(`Invalid UUID received: ${e.value}`);
				let u = /* @__PURE__ */ new Uint8Array(17);
				return u[0] = 9, u.set(Fc(e.value.replace(/-/g, "")), 1), u;
		}
	}
}, qc;
(function(e) {
	e[e.boolTrue = 0] = "boolTrue", e[e.boolFalse = 1] = "boolFalse", e[e.byte = 2] = "byte", e[e.short = 3] = "short", e[e.integer = 4] = "integer", e[e.long = 5] = "long", e[e.byteArray = 6] = "byteArray", e[e.string = 7] = "string", e[e.timestamp = 8] = "timestamp", e[e.uuid = 9] = "uuid";
})(qc ||= {});
var Jc = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, Yc = class e {
	bytes;
	constructor(e) {
		if (this.bytes = e, e.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes");
	}
	static fromNumber(t) {
		if (t > 0x8000000000000000 || t < -0x8000000000000000) throw Error(`${t} is too large (or, if negative, too small) to represent as an Int64`);
		let n = /* @__PURE__ */ new Uint8Array(8);
		for (let e = 7, r = Math.abs(Math.round(t)); e > -1 && r > 0; e--, r /= 256) n[e] = r;
		return t < 0 && Xc(n), new e(n);
	}
	valueOf() {
		let e = this.bytes.slice(0), t = e[0] & 128;
		return t && Xc(e), parseInt(Ic(e), 16) * (t ? -1 : 1);
	}
	toString() {
		return String(this.valueOf());
	}
};
function Xc(e) {
	for (let t = 0; t < 8; t++) e[t] ^= 255;
	for (let t = 7; t > -1 && (e[t]++, e[t] === 0); t--);
}
// ../../node_modules/.pnpm/@smithy+core@3.38.1/node_modules/@smithy/core/dist-es/submodules/protocols/util-uri-escape/escape-uri.js
var Zc = (e) => encodeURIComponent(e).replace(/[!'()*]/g, Qc), Qc = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`, $c = "X-Amz-Algorithm", el = "X-Amz-Credential", tl = "X-Amz-Date", nl = "X-Amz-SignedHeaders", rl = "X-Amz-Expires", il = "X-Amz-Signature", al = "X-Amz-Security-Token", ol = "authorization", sl = tl.toLowerCase(), cl = [
	ol,
	sl,
	"date"
];
il.toLowerCase();
var ll = "x-amz-content-sha256", ul = al.toLowerCase(), dl = {
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
}, fl = /^proxy-/, pl = /^sec-/, ml = "AWS4-HMAC-SHA256", hl = "AWS4-HMAC-SHA256-PAYLOAD", gl = "UNSIGNED-PAYLOAD", _l = "aws4_request";
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
F();
var vl = ({ query: e = {} }) => {
	let t = [], n = {};
	for (let r in e) {
		if (!Dc(e, r) || r.toLowerCase() === "x-amz-signature") continue;
		let i = Zc(r);
		t.push(i);
		let a = e[r];
		typeof a == "string" ? n[i] = `${i}=${Zc(a)}` : Array.isArray(a) && (n[i] = a.slice(0).reduce((e, t) => e.concat([`${i}=${Zc(t)}`]), []).sort().join("&"));
	}
	return t.sort().map((e) => n[e]).filter((e) => e).join("&");
}, yl = (e) => bl(e).toISOString().replace(/\.\d{3}Z$/, "Z"), bl = (e) => typeof e == "number" ? /* @__PURE__ */ new Date(e * 1e3) : typeof e == "string" ? Number(e) ? /* @__PURE__ */ new Date(Number(e) * 1e3) : new Date(e) : e;
Nc(), F();
var xl = class {
	service;
	regionProvider;
	credentialProvider;
	sha256;
	uriEscapePath;
	applyChecksum;
	constructor({ applyChecksum: e, credentials: t, region: n, service: r, sha256: i, uriEscapePath: a = !0 }) {
		this.service = r, this.sha256 = i, this.uriEscapePath = a, this.applyChecksum = typeof e != "boolean" || e, this.regionProvider = Mc(n), this.credentialProvider = Mc(t);
	}
	createCanonicalRequest(e, t, n) {
		let r = Object.keys(t).sort();
		return `${e.method}
${this.getCanonicalPath(e)}
${vl(e)}
${r.map((e) => `${e}:${t[e]}`).join("\n")}

${r.join(";")}
${n}`;
	}
	async createStringToSign(e, t, n, r) {
		let i = new this.sha256();
		return i.update(Bc(n)), `${r}
${e}
${t}
${Ic(await i.digest())}`;
	}
	getCanonicalPath({ path: e }) {
		if (this.uriEscapePath) {
			let t = [];
			for (let n of e.split("/")) n?.length !== 0 && n !== "." && (n === ".." ? t.pop() : t.push(n));
			return Zc(`${e?.startsWith("/") ? "/" : ""}${t.join("/")}${t.length > 0 && e?.endsWith("/") ? "/" : ""}`).replace(/%2F/g, "/");
		}
		return e;
	}
	validateResolvedCredentials(e) {
		if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string") throw Error("Resolved credential object is not valid");
	}
	formatDate(e) {
		let t = yl(e).replace(/[-:]/g, "");
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
F();
var Sl = {}, Cl = [], wl = (e, t, n) => `${e}/${t}/${n}/${_l}`, Tl = async (e, t, n, r, i) => {
	let a = `${n}:${r}:${i}:${Ic(await El(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`;
	if (a in Sl) return Sl[a];
	for (Cl.push(a); Cl.length > 50;) delete Sl[Cl.shift()];
	let o = `AWS4${t.secretAccessKey}`;
	for (let t of [
		n,
		r,
		i,
		_l
	]) o = await El(e, o, t);
	return Sl[a] = o;
}, El = (e, t, n) => {
	let r = new e(t);
	return r.update(Bc(n)), r.digest();
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
F();
var Dl = ({ headers: e }, t, n) => {
	let r = {};
	for (let i of Object.keys(e).sort()) {
		if (e[i] == null) continue;
		let a = i.toLowerCase();
		(Dc(dl, a) || t?.has(a) || fl.test(a) || pl.test(a)) && (!n || n && !n.has(a)) || (a === "__proto__" && Wc(r), r[a] = e[i].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
	}
	return r;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
F();
var Ol = async ({ headers: e, body: t }, n) => {
	for (let t in e) if (Dc(e, t) && t.toLowerCase() === "x-amz-content-sha256") return e[t];
	if (t == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
	if (typeof t == "string" || ArrayBuffer.isView(t) || Hc(t)) {
		let e = new n();
		return e.update(Bc(t)), Ic(await e.digest());
	}
	return gl;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
F();
var kl = (e, t) => {
	e = e.toLowerCase();
	for (let n in t) if (Dc(t, n) && e === n.toLowerCase()) return !0;
	return !1;
};
F(), jc();
var Al = (e, t = {}) => {
	let { headers: n, query: r = {} } = Ac.clone(e);
	for (let e in n) {
		if (!Dc(n, e)) continue;
		let i = e.toLowerCase();
		(i.slice(0, 6) === "x-amz-" && !t.unhoistableHeaders?.has(i) || t.hoistableHeaders?.has(i)) && (r[e] = n[e], delete n[e]);
	}
	return {
		...e,
		headers: n,
		query: r
	};
};
F(), jc();
var jl = (e) => {
	e = Ac.clone(e);
	for (let t in e.headers) Dc(e.headers, t) && cl.indexOf(t.toLowerCase()) > -1 && delete e.headers[t];
	return e;
};
// ../../node_modules/.pnpm/@smithy+signature-v4@5.7.5/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
F();
var Ml = class extends xl {
	headerFormatter = new Kc();
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
		let m = wl(p, d, l ?? this.service), h = Al(jl(e), {
			unhoistableHeaders: a,
			hoistableHeaders: s
		});
		u.sessionToken && (h.query[al] = u.sessionToken), h.query[$c] = ml, h.query[el] = `${u.accessKeyId}/${m}`, h.query[tl] = f, h.query[rl] = r.toString(10);
		let g = Dl(h, i, o);
		return h.query[nl] = this.getCanonicalHeaderList(g), h.query[il] = await this.getSignature(f, m, this.getSigningKey(u, d, p, l), this.createCanonicalRequest(h, g, await Ol(e, this.sha256))), h;
	}
	async sign(e, t) {
		return typeof e == "string" ? this.signString(e, t) : e.headers && e.payload ? this.signEvent(e, t) : e.message ? this.signMessage(e, t) : this.signRequest(e, t);
	}
	async signEvent({ headers: e, payload: t }, { signingDate: n = /* @__PURE__ */ new Date(), priorSignature: r, signingRegion: i, signingService: a, eventStreamCredentials: o }) {
		let s = i ?? await this.regionProvider(), { shortDate: c, longDate: l } = this.formatDate(n), u = wl(c, s, a ?? this.service), d = await Ol({
			headers: {},
			body: t
		}, this.sha256), f = new this.sha256();
		f.update(e);
		let p = [
			hl,
			l,
			u,
			r,
			Ic(await f.digest()),
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
		return c.update(Bc(e)), Ic(await c.digest());
	}
	async signRequest(e, { signingDate: t = /* @__PURE__ */ new Date(), signableHeaders: n, unsignableHeaders: r, signingRegion: i, signingService: a } = {}) {
		let o = await this.credentialProvider();
		this.validateResolvedCredentials(o);
		let s = i ?? await this.regionProvider(), c = jl(e), { longDate: l, shortDate: u } = this.formatDate(t), d = wl(u, s, a ?? this.service);
		c.headers[sl] = l, o.sessionToken && (c.headers[ul] = o.sessionToken);
		let f = await Ol(c, this.sha256);
		!kl("x-amz-content-sha256", c.headers) && this.applyChecksum && (c.headers[ll] = f);
		let p = Dl(c, r, n), m = await this.getSignature(l, d, this.getSigningKey(o, s, u, a), this.createCanonicalRequest(c, p, f));
		return c.headers[ol] = `${ml} Credential=${o.accessKeyId}/${d}, SignedHeaders=${this.getCanonicalHeaderList(p)}, Signature=${m}`, c;
	}
	async getSignature(e, t, n, r) {
		let i = await this.createStringToSign(e, t, r, ml), a = new this.sha256(await n);
		return a.update(Bc(i)), Ic(await a.digest());
	}
	getSigningKey(e, t, n, r) {
		return Tl(this.sha256, e, n, t, r || this.service);
	}
}, Nl = (e) => (t) => {
	let n = t.credentials, i = !!t.credentials, a;
	Object.defineProperty(t, "credentials", {
		set(e) {
			e && e !== n && e !== a && (i = !0), n = e;
			let o = Fl(t, Pl(t, {
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
	return l = t.signer ? wo(t.signer) : t.regionInfoProvider ? () => wo(t.region)().then(async (e) => [await t.regionInfoProvider(e, {
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
		return new (t.signerConstructor || Ml)(a);
	}) : async (e) => {
		e = Object.assign({}, {
			name: "sigv4",
			signingName: t.signingName || t.defaultSigningName,
			signingRegion: await wo(t.region)(),
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
		return new (t.signerConstructor || Ml)(i);
	}, Object.assign(t, {
		systemClockOffset: s,
		signingEscapePath: o,
		signer: l,
		disableClockSkewCorrection: wo(t.disableClockSkewCorrection ?? e)
	});
};
function Pl(e, { credentials: t, credentialDefaultProvider: n }) {
	let r;
	return r = t ? t?.memoized ? t : Oo(t, Eo, Do) : n ? wo(n(Object.assign({}, e, { parentClientConfig: e }))) : async () => {
		throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	}, r.memoized = !0, r;
}
function Fl(e, t) {
	if (t.configBound) return t;
	let n = async (n) => t({
		...n,
		callerClientConfig: e
	});
	return n.memoized = t.memoized, n.configBound = !0, n;
}
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.browser.js
var Il = Nl(!1);
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/auth/httpAuthSchemeProvider.js
fe(), Ce();
var Ll = async (e, t, n) => ({
	operation: de(t).operation,
	region: await x(e.region)() || (() => {
		throw Error("expected `region` to be configured for `aws.auth#sigv4`");
	})()
});
function Rl(e) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "payment-cryptography",
			region: e.region
		},
		propertiesExtractor: (e, t) => ({ signingProperties: {
			config: e,
			context: t
		} })
	};
}
var zl = (e) => {
	let t = [];
	return e.operation, t.push(Rl(e)), t;
}, Bl = (e) => {
	let t = Il(e);
	return Object.assign(t, { authSchemePreference: x(e.authSchemePreference ?? []) });
}, Vl = (e) => Object.assign(e, {
	useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
	useFipsEndpoint: e.useFipsEndpoint ?? !1,
	defaultSigningName: "payment-cryptography"
}), Hl = {
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
}, Ul = {
	name: "@aws-sdk/client-payment-cryptography",
	version: "3.1156.0",
	description: "AWS SDK for JavaScript Payment Cryptography Client for Node.js, Browser and React Native",
	homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-payment-cryptography",
	license: "Apache-2.0",
	author: {
		name: "AWS SDK for JavaScript Team",
		url: "https://aws.amazon.com/sdk-for-javascript/"
	},
	repository: {
		type: "git",
		url: "https://github.com/aws/aws-sdk-js-v3.git",
		directory: "clients/client-payment-cryptography"
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
}, Wl, Gl = t((() => {
	Wl = class {
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
}));
// ../../node_modules/.pnpm/@smithy+core@3.39.0/node_modules/@smithy/core/dist-es/submodules/serde/concatBytes.js
function Kl(e, t) {
	if (t === void 0) {
		t = 0;
		for (let n of e) t += n.byteLength;
	}
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var ql = t((() => {})), Jl, Yl = t((() => {
	Jl = (e) => typeof Blob == "function" && (e?.constructor?.name === Blob.name || e instanceof Blob);
}));
// ../../node_modules/.pnpm/@smithy+core@3.39.0/node_modules/@smithy/core/dist-es/submodules/serde/util-stream/stream-collector.browser.js
async function Xl(e) {
	return e.arrayBuffer().then((e) => new Uint8Array(e));
}
async function Zl(e) {
	let t = [], n = e.getReader(), r = 0;
	for (;;) {
		let { done: e, value: i } = await n.read();
		if (i && (t.push(i), r += i.length), e) break;
	}
	return Kl(t, r);
}
var Ql, $l = t((() => {
	ql(), Yl(), Ql = async (e) => Jl(e) ? Xl(e) : Zl(e);
})), eu = (e) => encodeURIComponent(e).replace(/[!'()*]/g, tu), tu = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
// ../../node_modules/.pnpm/@smithy+core@3.39.0/node_modules/@smithy/core/dist-es/submodules/protocols/querystring-builder/buildQueryString.js
function nu(e) {
	let t = [];
	for (let n of Object.keys(e).sort()) {
		let r = e[n];
		if (n = eu(n), Array.isArray(r)) for (let e = 0, i = r.length; e < i; e++) t.push(`${n}=${eu(r[e])}`);
		else {
			let e = n;
			(r || typeof r == "string") && (e += `=${eu(r)}`), t.push(e);
		}
	}
	return t.join("&");
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.1/node_modules/@smithy/fetch-http-handler/dist-es/create-request.js
function ru(e, t) {
	return new Request(e, t);
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.1/node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function iu(e = 0) {
	let t;
	return {
		promise: new Promise((n, r) => {
			e && (t = setTimeout(() => {
				let t = /* @__PURE__ */ Error(`Request did not complete within ${e} ms`);
				t.name = "TimeoutError", r(t);
			}, e));
		}),
		cancel: () => clearTimeout(t)
	};
}
// ../../node_modules/.pnpm/@smithy+fetch-http-handler@5.8.1/node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
Gl();
var au = { supported: void 0 }, ou = class e {
	config;
	configProvider;
	static create(t) {
		return typeof t?.handle == "function" ? t : new e(t);
	}
	constructor(e) {
		typeof e == "function" ? this.configProvider = e().then((e) => e || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), au.supported === void 0 && (au.supported = typeof Request < "u" && "keepalive" in ru("https://[::1]"));
	}
	destroy() {}
	async handle(e, { abortSignal: t, requestTimeout: n } = {}) {
		this.config ||= await this.configProvider;
		let r = n ?? this.config.requestTimeout, i = this.config.keepAlive === !0, a = this.config.credentials, o = this.config.customFetch ?? fetch;
		if (t?.aborted) {
			let e = su(t);
			return Promise.reject(e);
		}
		let s = e.path, c = nu(e.query || {});
		c && (s += `?${c}`), e.fragment && (s += `#${e.fragment}`);
		let l = "";
		(e.username != null || e.password != null) && (l = `${e.username ?? ""}:${e.password ?? ""}@`);
		let { port: u, method: d } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${s}`, p = d === "GET" || d === "HEAD" ? void 0 : e.body, m = {
			body: p,
			headers: new Headers(e.headers),
			method: d,
			credentials: a
		};
		this.config?.cache && (m.cache = this.config.cache), p && (m.duplex = "half"), typeof AbortController < "u" && (m.signal = t), au.supported && (m.keepalive = i), typeof this.config.requestInit == "function" && Object.assign(m, this.config.requestInit(e));
		let h = () => {}, g = iu(r), _ = [o(ru(f, m)).then((e) => {
			let t = e.headers, n = {};
			for (let e of t.entries()) n[e[0]] = e[1];
			return e.body == null ? e.blob().then((t) => ({ response: new Wl({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: t
			}) })) : { response: new Wl({
				headers: n,
				reason: e.statusText,
				statusCode: e.status,
				body: e.body
			}) };
		}), g.promise];
		return t && _.push(new Promise((e, n) => {
			let r = () => {
				n(su(t));
			};
			if (typeof t.addEventListener == "function") {
				let e = t;
				e.addEventListener("abort", r, { once: !0 }), h = () => e.removeEventListener("abort", r);
			} else t.onabort = r;
		})), Promise.race(_).finally(() => {
			g.cancel(), h();
		});
	}
	updateHttpClientConfig(e, t) {
		this.config = void 0, this.configProvider = this.configProvider.then((n) => (n[e] = t, n));
	}
	httpHandlerConfigs() {
		return this.config ?? {};
	}
};
function su(e) {
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
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ProtocolLib.js
A();
var cu = class {
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
		let i = Kr.for(r), a = Kr.for("smithy.ts.sdk.synthetic." + n);
		e.copyFrom(i), e.copyFrom(a), this.errorRegistry = e;
	}
	decorateServiceException(e, t = {}) {
		if (this.queryCompat) {
			let n = e.Message ?? t.Message, r = Jo(e, t);
			n && (r.message = n);
			let i = r.Error ?? {};
			i.Type = r.Error?.Type, i.Code = r.Error?.Code, i.Message = r.Error?.message ?? r.Error?.Message ?? n, r.Error = i;
			let a = r.$metadata.requestId;
			return a && (r.RequestId = a), r;
		}
		return Jo(e, t);
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
			return e.find((e) => k.of(e).getMergedTraits().awsQueryError?.[0] === t);
		}
	}
};
// ../../node_modules/.pnpm/@aws-sdk+core@3.981.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
A();
var lu = class extends ma {
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
		}), this.serviceTarget = n, this.codec = i ?? new io({
			timestampFormat: {
				useTrait: !0,
				default: 7
			},
			jsonName: !1
		}), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!r, this.mixin = new cu(this.awsQueryCompatible);
	}
	async serializeRequest(e, t, n) {
		let r = await super.serializeRequest(e, t, n);
		return r.path.endsWith("/") || (r.path += "/"), r.headers["content-type"] = `application/x-amz-json-${this.getJsonRpcVersion()}`, r.headers["x-amz-target"] = `${this.serviceTarget}.${e.name}`, this.awsQueryCompatible && (r.headers["x-amzn-query-mode"] = "true"), Cr(e.input) !== "unit" && r.body || (r.body = "{}"), r;
	}
	getPayloadCodec() {
		return this.codec;
	}
	async handleError(e, t, n, r, i) {
		let { awsQueryCompatible: a } = this;
		a && this.mixin.setQueryCompatError(r, n);
		let o = Ra(n, r, a) ?? "Unknown";
		this.mixin.compose(this.compositeErrorRegistry, o, this.options.defaultNamespace);
		let { errorSchema: s, errorMetadata: c } = await this.mixin.getErrorSchemaOrThrowBaseException(o, this.options.defaultNamespace, n, r, i, a ? this.mixin.findQueryCompatibleError : void 0), l = k.of(s), u = r.message ?? r.Message ?? "UnknownError", d = new ((this.compositeErrorRegistry.getErrorCtor(s)) ?? Error)({}), f = {}, p = this.codec.createDeserializer();
		for (let [e, t] of l.structIterator()) r[e] != null && (f[e] = p.readObject(t, r[e]));
		throw a && this.mixin.queryCompatOutput(r, f), this.mixin.decorateServiceException(Object.assign(d, c, {
			$fault: l.getMergedTraits().error,
			message: u
		}, f), r);
	}
}, uu = class extends lu {
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
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/endpoint/bdd.js
hr();
var du = "ref", fu = -1, pu = !0, mu = "isSet", hu = "PartitionResult", gu = "booleanEquals", _u = "getAttr", vu = { [du]: "Endpoint" }, yu = { [du]: hu }, bu = {}, xu = [{ [du]: "Region" }], Su = {
	conditions: [
		[mu, [vu]],
		[mu, xu],
		[
			"aws.partition",
			xu,
			hu
		],
		[gu, [{ [du]: "UseFIPS" }, pu]],
		[gu, [{ [du]: "UseDualStack" }, pu]],
		[gu, [{
			fn: _u,
			argv: [yu, "supportsDualStack"]
		}, pu]],
		[gu, [{
			fn: _u,
			argv: [yu, "supportsFIPS"]
		}, pu]]
	],
	results: [
		[fu],
		[fu, "Invalid Configuration: FIPS and custom endpoint are not supported"],
		[fu, "Invalid Configuration: Dualstack and custom endpoint are not supported"],
		[vu, bu],
		["https://controlplane.payment-cryptography-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", bu],
		[fu, "FIPS and DualStack are enabled, but this partition does not support one or both"],
		["https://controlplane.payment-cryptography-fips.{Region}.{PartitionResult#dnsSuffix}", bu],
		[fu, "FIPS is enabled but this partition does not support FIPS"],
		["https://controlplane.payment-cryptography.{Region}.{PartitionResult#dualStackDnsSuffix}", bu],
		[fu, "DualStack is enabled but this partition does not support DualStack"],
		["https://controlplane.payment-cryptography.{Region}.{PartitionResult#dnsSuffix}", bu],
		[fu, "Invalid Configuration: Missing Region"]
	]
}, Cu = 2, wu = new Int32Array([
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
]), Tu = tn.from(wu, Cu, Su.conditions, Su.results);
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/endpoint/endpointResolver.js
hr();
var Eu = new rn({
	size: 50,
	params: [
		"Endpoint",
		"Region",
		"UseDualStack",
		"UseFIPS"
	]
}), Du = (e, t = {}) => Eu.get(e, () => dr(Tu, {
	endpointParams: e,
	logger: t.logger
}));
fn.aws = ac;
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/models/PaymentCryptographyServiceException.js
var I = class e extends qo {
	static shapeId = "smithy.ts.sdk.synthetic.com.amazonaws.paymentcryptography#PaymentCryptographyServiceException";
	constructor(t) {
		super(t), Object.setPrototypeOf(this, e.prototype);
	}
}, Ou = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#AccessDeniedException";
	name = "AccessDeniedException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "AccessDeniedException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ku = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ConflictException";
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
}, Au = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#InternalServerException";
	name = "InternalServerException";
	$fault = "server";
	Message;
	constructor(t) {
		super({
			name: "InternalServerException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, ju = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ResourceNotFoundException";
	name = "ResourceNotFoundException";
	$fault = "client";
	ResourceId;
	constructor(t) {
		super({
			name: "ResourceNotFoundException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.ResourceId = t.ResourceId;
	}
}, Mu = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ServiceQuotaExceededException";
	name = "ServiceQuotaExceededException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ServiceQuotaExceededException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Nu = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ThrottlingException";
	name = "ThrottlingException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ThrottlingException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Pu = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ValidationException";
	name = "ValidationException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "ValidationException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Fu = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#ServiceUnavailableException";
	name = "ServiceUnavailableException";
	$fault = "server";
	Message;
	constructor(t) {
		super({
			name: "ServiceUnavailableException",
			$fault: "server",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
}, Iu = class e extends I {
	static shapeId = "com.amazonaws.paymentcryptography#PublicPolicyException";
	name = "PublicPolicyException";
	$fault = "client";
	Message;
	constructor(t) {
		super({
			name: "PublicPolicyException",
			$fault: "client",
			...t
		}), Object.setPrototypeOf(this, e.prototype), this.Message = t.Message;
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/schemas/schemas_0.js
A();
var Lu = "AccessDeniedException", Ru = "ConflictException", zu = "CreateKey", Bu = "CreateKeyInput", Vu = "CreateKeyOutput", Hu = "CreateTimestamp", Uu = "Decrypt", Wu = "DeriveKey", Gu = "DeleteKeyInput", Ku = "DeleteKeyInDays", qu = "DeleteKeyOutput", Ju = "DeriveKeyUsage", Yu = "DeleteKey", Xu = "DeletePendingTimestamp", Zu = "DeleteTimestamp", Qu = "Exportable", $u = "Enabled", ed = "Encrypt", td = "Generate", nd = "GetKey", rd = "GetKeyInput", id = "GetKeyOutput", ad = "InitiationDate", od = "InternalServerException", sd = "Key", cd = "KeyArn", ld = "KeyAttributes", ud = "KeyAlgorithm", dd = "KeyCheckValue", fd = "KeyCheckValueAlgorithm", pd = "KeyClass", md = "KeyIdentifier", hd = "KeyModesOfUse", gd = "KeyOrigin", _d = "KeyState", vd = "KeySummaryList", yd = "KeySummary", bd = "KeyUsage", xd = "Keys", Sd = "ListKeys", Cd = "ListKeysInput", wd = "ListKeysOutput", Td = "ListTagsForResource", Ed = "ListTagsForResourceInput", Dd = "ListTagsForResourceOutput", L = "Message", Od = "MaxResults", kd = "MultiRegionKeyType", Ad = "MpaStatus", jd = "MpaSessionArn", Md = "NoRestrictions", Nd = "NextToken", Pd = "PublicPolicyException", Fd = "PrimaryRegion", Id = "ResourceArn", Ld = "ResourceId", Rd = "ResourceNotFoundException", zd = "ReplicationRegions", Bd = "ReplicationStatus", Vd = "ReplicationStatusType", Hd = "Sign", Ud = "StatusMessage", Wd = "ServiceQuotaExceededException", Gd = "ServiceUnavailableException", Kd = "Status", qd = "Tags", Jd = "ThrottlingException", Yd = "TagKeys", Xd = "TagResource", Zd = "TagResourceInput", Qd = "TagResourceOutput", $d = "Tag", ef = "Unwrap", tf = "UsingDefaultReplicationRegions", nf = "UntagResource", rf = "UntagResourceInput", af = "UntagResourceOutput", of = "UsageStartTimestamp", sf = "UsageStopTimestamp", cf = "Verify", lf = "ValidationException", uf = "Value", df = "Wrap", ff = "client", R = "error", z = "httpError", pf = "smithy.ts.sdk.synthetic.com.amazonaws.paymentcryptography", mf = "server", B = "com.amazonaws.paymentcryptography", hf = new Kr(pf), gf = [
	-3,
	pf,
	"PaymentCryptographyServiceException",
	0,
	[],
	[]
];
hf.registerError(gf, I);
var V = new Kr(B), _f = [
	-3,
	B,
	Lu,
	{
		[R]: ff,
		[z]: 403
	},
	[L],
	[0]
];
V.registerError(_f, Ou);
var vf = [
	-3,
	B,
	Ru,
	{
		[R]: ff,
		[z]: 409
	},
	[L],
	[0]
];
V.registerError(vf, ku);
var yf = [
	-3,
	B,
	od,
	{
		[R]: mf,
		[z]: 500
	},
	[L],
	[0]
];
V.registerError(yf, Au);
var bf = [
	-3,
	B,
	Pd,
	{
		[R]: ff,
		[z]: 400
	},
	[L],
	[0]
];
V.registerError(bf, Iu);
var xf = [
	-3,
	B,
	Rd,
	{
		[R]: ff,
		[z]: 404
	},
	[Ld],
	[0]
];
V.registerError(xf, ju);
var Sf = [
	-3,
	B,
	Wd,
	{
		[R]: ff,
		[z]: 402
	},
	[L],
	[0]
];
V.registerError(Sf, Mu);
var Cf = [
	-3,
	B,
	Gd,
	{
		[R]: mf,
		[z]: 503
	},
	[L],
	[0]
];
V.registerError(Cf, Fu);
var wf = [
	-3,
	B,
	Jd,
	{
		[R]: ff,
		[z]: 429
	},
	[L],
	[0]
];
V.registerError(wf, Nu);
var Tf = [
	-3,
	B,
	lf,
	{
		[R]: ff,
		[z]: 400
	},
	[L],
	[0]
];
V.registerError(Tf, Pu);
var Ef = [hf, V], Df = [
	3,
	B,
	Bu,
	0,
	[
		ld,
		Qu,
		fd,
		$u,
		qd,
		Ju,
		zd
	],
	[
		() => Pf,
		2,
		0,
		2,
		() => Yf,
		0,
		64
	],
	2
], Of = [
	3,
	B,
	Vu,
	0,
	[sd],
	[() => Nf],
	1
], kf = [
	3,
	B,
	Gu,
	0,
	[md, Ku],
	[0, 1],
	1
], Af = [
	3,
	B,
	qu,
	0,
	[sd],
	[() => Nf],
	1
], jf = [
	3,
	B,
	rd,
	0,
	[md],
	[0],
	1
], Mf = [
	3,
	B,
	id,
	0,
	[sd],
	[() => Nf],
	1
], Nf = [
	3,
	B,
	sd,
	0,
	[
		cd,
		ld,
		dd,
		fd,
		$u,
		Qu,
		_d,
		gd,
		Hu,
		of,
		sf,
		Xu,
		Zu,
		Ju,
		kd,
		Fd,
		Bd,
		tf,
		Ad
	],
	[
		0,
		() => Pf,
		0,
		0,
		2,
		2,
		0,
		0,
		4,
		4,
		4,
		4,
		4,
		0,
		0,
		0,
		() => Xf,
		2,
		() => Vf
	],
	9
], Pf = [
	3,
	B,
	ld,
	0,
	[
		bd,
		pd,
		ud,
		hd
	],
	[
		0,
		0,
		0,
		() => Ff
	],
	4
], Ff = [
	3,
	B,
	hd,
	0,
	[
		ed,
		Uu,
		df,
		ef,
		td,
		Hd,
		cf,
		Wu,
		Md
	],
	[
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2
	]
], If = [
	3,
	B,
	yd,
	0,
	[
		cd,
		_d,
		ld,
		dd,
		Qu,
		$u,
		kd,
		Fd
	],
	[
		0,
		0,
		() => Pf,
		0,
		2,
		2,
		0,
		0
	],
	6
], Lf = [
	3,
	B,
	Cd,
	0,
	[
		_d,
		Nd,
		Od
	],
	[
		0,
		0,
		1
	]
], Rf = [
	3,
	B,
	wd,
	0,
	[xd, Nd],
	[() => Jf, 0],
	1
], zf = [
	3,
	B,
	Ed,
	0,
	[
		Id,
		Nd,
		Od
	],
	[
		0,
		0,
		1
	],
	1
], Bf = [
	3,
	B,
	Dd,
	0,
	[qd, Nd],
	[() => Yf, 0],
	1
], Vf = [
	3,
	B,
	Ad,
	0,
	[
		jd,
		Kd,
		ad,
		Ud
	],
	[
		0,
		0,
		4,
		0
	],
	3
], Hf = [
	3,
	B,
	Vd,
	0,
	[Kd, Ud],
	[0, 0],
	1
], Uf = [
	3,
	B,
	$d,
	0,
	[sd, uf],
	[0, 0],
	2
], Wf = [
	3,
	B,
	Zd,
	0,
	[Id, qd],
	[0, () => Yf],
	2
], Gf = [
	3,
	B,
	Qd,
	0,
	[],
	[]
], Kf = [
	3,
	B,
	rf,
	0,
	[Id, Yd],
	[0, 64],
	2
], qf = [
	3,
	B,
	af,
	0,
	[],
	[]
], Jf = [
	1,
	B,
	vd,
	0,
	() => If
], Yf = [
	1,
	B,
	qd,
	0,
	() => Uf
], Xf = [
	2,
	B,
	Bd,
	0,
	0,
	() => Hf
], Zf = [
	9,
	B,
	zu,
	0,
	() => Df,
	() => Of
], Qf = [
	9,
	B,
	Yu,
	2,
	() => kf,
	() => Af
], $f = [
	9,
	B,
	nd,
	0,
	() => jf,
	() => Mf
], ep = [
	9,
	B,
	Sd,
	0,
	() => Lf,
	() => Rf
], tp = [
	9,
	B,
	Td,
	0,
	() => zf,
	() => Bf
], np = [
	9,
	B,
	Xd,
	0,
	() => Wf,
	() => Gf
], rp = [
	9,
	B,
	nf,
	0,
	() => Kf,
	() => qf
];
fi(), De(), O();
var ip = (e) => ({
	apiVersion: "2021-09-14",
	base64Decoder: e?.base64Decoder ?? l,
	base64Encoder: e?.base64Encoder ?? p,
	disableHostPrefix: e?.disableHostPrefix ?? !1,
	endpointProvider: e?.endpointProvider ?? Du,
	extensions: e?.extensions ?? [],
	httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? zl,
	httpAuthSchemes: e?.httpAuthSchemes ?? [{
		schemeId: "aws.auth#sigv4",
		identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
		signer: new wc()
	}],
	logger: e?.logger ?? new rs(),
	protocol: e?.protocol ?? uu,
	protocolSettings: e?.protocolSettings ?? {
		defaultNamespace: "com.amazonaws.paymentcryptography",
		errorTypeRegistries: Ef,
		version: "2021-09-14",
		serviceTarget: "PaymentCryptographyControlPlane"
	},
	serviceId: e?.serviceId ?? "Payment Cryptography",
	sha256: e?.sha256 ?? ui,
	urlParser: e?.urlParser ?? Ee,
	utf8Decoder: e?.utf8Decoder ?? d,
	utf8Encoder: e?.utf8Encoder ?? _
});
O(), $l();
var ap = (e) => {
	let t = pc(e), n = () => t().then(Yo), r = ip(e);
	return {
		...r,
		...e,
		runtime: "browser",
		defaultsMode: t,
		bodyLengthChecker: e?.bodyLengthChecker ?? wt,
		credentialDefaultProvider: e?.credentialDefaultProvider ?? ((e) => () => Promise.reject(/* @__PURE__ */ Error("Credential is missing"))),
		defaultUserAgentProvider: e?.defaultUserAgentProvider ?? $s({
			serviceId: r.serviceId,
			clientVersion: Ul.version
		}),
		maxAttempts: e?.maxAttempts ?? 3,
		region: e?.region ?? Bo("Region is missing"),
		requestHandler: ou.create(e?.requestHandler ?? n),
		retryMode: e?.retryMode ?? (async () => (await n()).retryMode || Fs),
		streamCollector: e?.streamCollector ?? Ql,
		useDualstackEndpoint: e?.useDualstackEndpoint ?? (() => Promise.resolve(!1)),
		useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(!1))
	};
}, op = (e) => {
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
}, sp = (e) => ({
	httpAuthSchemes: e.httpAuthSchemes(),
	httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
	credentials: e.credentials()
}), cp = (e, t) => {
	let n = Object.assign(hc(e), ts(e), ga(e), op(e));
	return t.forEach((e) => e.configure(n)), Object.assign(e, gc(n), ns(n), _a(n), sp(n));
};
hr(), A();
var lp = class extends Vo {
	config;
	constructor(...[e]) {
		let t = ap(e || {});
		super(t), this.initConfig = t;
		let n = ao(dc(zs(Ao(Vl(t))))), r = cp(Bl(pr(n)), e?.extensions || []);
		this.config = r, this.middlewareStack.use(Mr(this.config)), this.middlewareStack.use(Qs(this.config)), this.middlewareStack.use(Bs(this.config)), this.middlewareStack.use(xa(this.config)), this.middlewareStack.use(co(this.config)), this.middlewareStack.use(fo(this.config)), this.middlewareStack.use(po(this.config)), this.middlewareStack.use(vo(this.config, {
			httpAuthSchemeParametersProvider: Ll,
			identityProviderConfigProvider: async (e) => new To({ "aws.auth#sigv4": e.credentials })
		})), this.middlewareStack.use(Co(this.config));
	}
	destroy() {
		super.destroy();
	}
};
// ../../node_modules/.pnpm/@aws-sdk+client-payment-cryptography@3.1156.0/node_modules/@aws-sdk/client-payment-cryptography/dist-es/commandBuilder.js
hr();
var up = is(Hl, "PaymentCryptographyControlPlane", "PaymentCryptographyClient", mr), dp = {}, fp = (e, t, n, r) => [], pp = class extends up(dp, fp, "CreateKey", Zf) {}, mp = class extends up(dp, fp, "DeleteKey", Qf) {}, hp = class extends up(dp, fp, "GetKey", $f) {}, gp = class extends up(dp, fp, "ListKeys", ep) {}, _p = class extends up(dp, fp, "ListTagsForResource", tp) {}, vp = class extends up(dp, fp, "TagResource", np) {}, yp = class extends up(dp, fp, "UntagResource", rp) {}, bp = class extends Error {
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
}, xp = Symbol(), Sp = (e, t) => new Response(e, { headers: { "Content-Type": t.replace(/^[^;]+/, (e) => e.toLowerCase()) } }).formData(), Cp = 1e4, wp = (e) => "headers" in e, Tp = async (e, t = Object.create(null)) => {
	let { all: n = !1, dot: r = !1 } = t, i = (wp(e) ? e.headers : e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? Ep(e, {
		all: n,
		dot: r
	}) : {};
};
async function Ep(e, t) {
	if (!wp(e) && e.bodyCache.formData) return Dp(await e.bodyCache.formData, t);
	let n = wp(e) ? e.headers : e.raw.headers, r = Sp(await e.arrayBuffer(), n.get("Content-Type") || "");
	wp(e) || (e.bodyCache.formData = r);
	let i = await r;
	return i ? Dp(i, t) : {};
}
function Dp(e, t) {
	let n = Object.create(null), r = { count: 0 };
	return e.forEach((e, r) => {
		t.all || r.endsWith("[]") ? Op(n, r, e) : n[r] = e;
	}), t.dot && Object.entries(n).forEach(([e, t]) => {
		e.includes(".") && (kp(n, e, t, r), delete n[e]);
	}), n;
}
var Op = (e, t, n) => {
	e[t] === void 0 ? e[t] = t.endsWith("[]") ? [n] : n : Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n];
}, kp = (e, t, n, r) => {
	if (/(?:^|\.)__proto__\./.test(t)) return;
	let i = e, a = t.split(".", 34);
	a.length > 33 && Ap(), a.forEach((e, t) => {
		t === a.length - 1 ? i[e] = n : ((!i[e] || typeof i[e] != "object" || Array.isArray(i[e]) || i[e] instanceof File) && (r.count++ >= Cp && Ap(), i[e] = Object.create(null)), i = i[e]);
	});
}, Ap = () => {
	throw Error("Nesting limit exceeded");
}, jp = (e) => {
	let t = e.split("/");
	return t[0] === "" && t.shift(), t;
}, Mp = (e) => {
	let { groups: t, path: n } = Np(e);
	return Pp(jp(n), t);
}, Np = (e) => {
	let t = [];
	return e = e.replace(/\{[^}]+\}/g, (e, n) => {
		let r = `@${n}`;
		return t.push([r, e]), r;
	}), {
		groups: t,
		path: e
	};
}, Pp = (e, t) => {
	for (let n = t.length - 1; n >= 0; n--) {
		let [r] = t[n];
		for (let i = e.length - 1; i >= 0; i--) if (e[i].includes(r)) {
			e[i] = e[i].replace(r, t[n][1]);
			break;
		}
	}
	return e;
}, Fp = {}, Ip = (e, t) => {
	if (e === "*") return "*";
	let n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (n) {
		let r = `${e}#${t}`;
		return Fp[r] || (Fp[r] = n[2] ? t && t[0] !== ":" && t[0] !== "*" ? [
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
		]), Fp[r];
	}
	return null;
}, Lp = (e, t) => {
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
}, Rp = (e) => Lp(e, decodeURI), zp = (e) => {
	let t = e.url, n = t.indexOf("/", t.indexOf(":") + 4), r = n;
	for (; r < t.length; r++) {
		let e = t.charCodeAt(r);
		if (e === 37) {
			let e = t.indexOf("?", r), i = t.indexOf("#", r), a = e === -1 ? i === -1 ? void 0 : i : i === -1 ? e : Math.min(e, i), o = t.slice(n, a);
			return Rp(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
		}
		if (e === 63 || e === 35) break;
	}
	return t.slice(n, r);
}, Bp = (e) => {
	let t = zp(e);
	return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, Vp = (e, t, ...n) => (n.length && (t = Vp(t, ...n)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), Hp = (e) => {
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
}, Up = (e) => e.indexOf("%") === -1 ? e : Lp(e, Jp), Wp = (e) => (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), Up(e)), Gp = (e, t, n) => {
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
					return Wp(e.slice(n, i === -1 ? void 0 : i));
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
		if (i && (s = Wp(s)), o = t, s === "") continue;
		let c;
		r === -1 ? c = "" : (c = e.slice(r + 1, t === -1 ? void 0 : t), i && (c = Wp(c))), n ? (a[s] && Array.isArray(a[s]) || (a[s] = []), a[s].push(c)) : a[s] ??= c;
	}
	return t ? a[t] : a;
}, Kp = Gp, qp = (e, t) => Gp(e, t, !0), Jp = decodeURIComponent, Yp = class {
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
		return n && Up(n);
	}
	#r() {
		let e = {}, t = Object.keys(this.#t[0][this.routeIndex]?.[1] ?? {});
		for (let n of t) {
			let t = this.#i(this.#t[0][this.routeIndex][1][n]);
			t !== void 0 && (e[n] = Up(t));
		}
		return e;
	}
	#i(e) {
		return this.#t[1] ? this.#t[1][e] : e;
	}
	query(e) {
		return Kp(this.url, e);
	}
	queries(e) {
		return qp(this.url, e);
	}
	header(e) {
		if (e) return this.raw.headers.get(e) ?? void 0;
		let t = Object.create(null);
		return this.raw.headers.forEach((e, n) => {
			t[n] = e;
		}), t;
	}
	async parseBody(e) {
		return Tp(this, e);
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
	get [xp]() {
		return this.#t;
	}
	get matchedRoutes() {
		return this.#t[0].map(([[, e]]) => e);
	}
	get routePath() {
		return this.#t[0].map(([[, e]]) => e)[this.routeIndex].path;
	}
}, Xp = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
}, Zp = (e, t) => {
	let n = new String(e);
	return n.isEscaped = !0, n.callbacks = t, n;
}, Qp = async (e, t, n, r, i) => {
	typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
	let a = e.callbacks;
	if (!a?.length) return Promise.resolve(e);
	i ? i[0] += e : i = [e];
	let o = Promise.all(a.map((e) => e({
		phase: t,
		buffer: i,
		context: r
	}))).then((e) => Promise.all(e.filter(Boolean).map((e) => Qp(e, t, !1, r, i))).then(() => i[0]));
	return n ? Zp(await o, a) : o;
}, $p = "text/plain; charset=UTF-8", em = (e, t) => ({
	"Content-Type": e,
	...t
}), tm = (e, t) => new Response(e, t), nm = class {
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
		return this.#t ??= new Yp(this.#e, this.#d, this.#u), this.#t;
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
		return this.#a ||= tm(null, { headers: this.#l ??= new Headers() });
	}
	set res(e) {
		if (this.#a && e) {
			e = tm(e.body, e);
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
		this.finalized && (this.#a = tm(this.#a.body, this.#a));
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
		return tm(e, {
			status: typeof t == "number" ? t : t?.status ?? this.#r,
			headers: r ?? n
		});
	}
	newResponse = (...e) => this.#f(...e);
	body = (e, t, n) => this.#f(e, t, n);
	text = (e, t, n) => !this.#l && !this.#r && !t && !n && !this.finalized ? new Response(e) : this.#f(e, t, em($p, n));
	json = (e, t, n) => this.#f(JSON.stringify(e), t, em("application/json", n));
	html = (e, t, n) => {
		let r = (e) => this.#f(e, t, em("text/html; charset=UTF-8", n));
		return typeof e == "object" ? Qp(e, Xp.Stringify, !1, {}).then(r) : r(e);
	};
	redirect = (e, t) => {
		let n = String(e);
		return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t ?? 302);
	};
	notFound = () => (this.#c ??= () => tm(), this.#c(this));
}, rm = (e, t, n) => (r, i) => {
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
}, im = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch",
	"query"
], am = "Can not add a route since the matcher is already built.", om = class extends Error {}, sm = "__COMPOSED_HANDLER", cm = (e) => e.text("404 Not Found", 404), lm = (e, t) => {
	if ("getResponse" in e) {
		let n = e.getResponse();
		return t.newResponse(n.body, n);
	}
	return console.error(e), t.text("Internal Server Error", 500);
}, um = class e {
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
		[...im, "all"].forEach((e) => {
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
		Object.assign(this, n), this.getPath = t ?? !0 ? e.getPath ?? zp : Bp;
	}
	#t() {
		let t = new e({
			router: this.router,
			getPath: this.getPath
		});
		return t.errorHandler = this.errorHandler, t.#n = this.#n, t.routes = this.routes, t;
	}
	#n = cm;
	errorHandler = lm;
	route(e, t) {
		let n = this.basePath(e);
		return t.routes.map((e) => {
			let r;
			t.errorHandler === lm ? r = e.handler : (r = async (n, r) => (await rm([], t.errorHandler)(n, () => e.handler(n, r))).res, r[sm] = e.handler), n.#r(e.method, e.path, r, e.basePath);
		}), this;
	}
	basePath(e) {
		let t = this.#t();
		return t._basePath = Vp(this._basePath, e), t;
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
			let t = Vp(this._basePath, e), n = t === "/" ? 0 : t.length;
			return (e) => {
				let t = new URL(e.url);
				return t.pathname = this.getPath(e).slice(n) || "/", new Request(t, e);
			};
		})(), this.#r("ALL", Vp(e, "*"), async (e, n) => {
			let i = await t(r(e.req.raw), ...a(e));
			if (i) return i;
			await n();
		}), this;
	}
	#r(e, t, n, r) {
		t = Vp(this._basePath, t);
		let i = {
			basePath: r === void 0 ? this._basePath : Vp(this._basePath, r),
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
		let i = this.getPath(e, { env: n }), a = this.router.match(r, i), o = new nm(e, {
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
		let s = rm(a[0], this.errorHandler, this.#n);
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
	request = (e, t, n, r) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, r) : (e = e.toString(), this.fetch(new Request(/^https?:\/\//.test(e) ? e : `http://localhost${Vp("/", e)}`, t), n, r));
	fire = () => {
		addEventListener("fetch", (e) => {
			e.respondWith(this.#a(e.request, e, void 0, e.request.method));
		});
	};
}, H = () => Object.create(null), dm = [];
function fm(e, t) {
	let n = this.buildAllMatchers(), r = ((e, t) => {
		let r = n[e] || n.ALL, i = r[2][t];
		if (i) return i;
		let a = t.match(r[0]);
		if (!a) return [[], dm];
		let o = a.indexOf("", 1);
		return [r[1][o], a];
	});
	return this.match = r, r(e, t);
}
// ../../node_modules/.pnpm/hono@4.13.14/node_modules/hono/dist/router/reg-exp-router/node.js
var pm = "[^/]+", mm = "(?:|/.*)", hm = Symbol(), gm = /* @__PURE__ */ new Set(".\\+*[^]$()");
function _m(e, t) {
	return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 ? 1 : e === ".*" || e === "(?:|/.*)" ? t === "(?:|/.*)" ? -1 : 1 : t === ".*" || t === "(?:|/.*)" ? -1 : e === "[^/]+" ? 1 : t === "[^/]+" ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var vm = class e {
	#e;
	#t;
	#n = H();
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
				pm
			] : null : s === "/*" ? [
				"",
				"",
				mm
			] : s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), l;
			if (c) {
				let t = c[1], n = c[2] || "[^/]+";
				if (t && c[2] && (n === ".*" || (n = n.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(n)) || n.length === 1 && gm.has(n))) throw hm;
				if (l = o.#n[n], !l) {
					if (n !== ".*" && n !== "(?:|/.*)") {
						for (let e in o.#n) if ((n.length > 1 || e.length > 1) && e !== ".*" && e !== "(?:|/.*)") throw hm;
					}
					l = o.#n[n] = new e();
				}
				t !== "" && (l.#t ??= i.varIndex++, r.push([t, l.#t]));
			} else if (l = o.#n[s], !l) {
				for (let e in o.#n) if (e.length > 1 && e !== ".*" && e !== "(?:|/.*)") throw hm;
				l = o.#n[s] = new e();
			}
			o = l;
		}
		if (o.#e !== void 0) throw hm;
		o.#e = a ? -1 : n;
	}
	buildRegExpStr() {
		let e = Object.keys(this.#n).sort(_m).map((e) => {
			let t = this.#n[e], n = t.buildRegExpStr();
			return n === "" ? "" : (typeof t.#t == "number" ? `(${e})@${t.#t}` : gm.has(e) ? `\\${e}` : e) + n;
		}).filter(Boolean);
		return typeof this.#e == "number" && this.#e !== -1 && e.unshift(`#${this.#e}`), e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")";
	}
}, ym = class {
	#e = { varIndex: 0 };
	#t = new vm();
	#n = 0;
	paths = H();
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
}, bm = H();
function xm(e) {
	return bm[e] ??= RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (e, t) => t ? `\\${t}` : e === "/*" ? mm : e === "*" ? ".*" : `/:${pm}`)}$`);
}
function Sm(e, t) {
	for (let n of Object.keys(e).sort((e, t) => t.length - e.length)) if (xm(n).test(t)) return [...e[n]];
}
var Cm = class {
	name = "RegExpRouter";
	#e;
	#t;
	#n;
	constructor() {
		this.#e = { ALL: H() }, this.#t = { ALL: H() }, this.#n = { ALL: new ym() };
	}
	#r(e, t) {
		try {
			this.#n[e].insert(t, !/\*|\/:/.test(t));
		} catch (e) {
			throw e === hm ? new om(t) : e;
		}
	}
	add(e, t, n) {
		let r = this.#e, i = this.#t;
		if (!r) throw Error(am);
		if (!r[e]) {
			this.#n[e] = new ym();
			for (let t of [r, i]) {
				t[e] = H();
				for (let n in t.ALL) t[e][n] = [...t.ALL[n]], this.#r(e, n);
			}
		}
		t === "/*" && (t = "*");
		let a = e === "ALL" ? Object.keys(r) : [e];
		if (/\*$/.test(t)) {
			let e = xm(t);
			for (let e of a) r[e][t] || (this.#r(e, t), r[e][t] = Sm(r[e], t) || Sm(r.ALL, t) || []);
			for (let o of [r, i]) for (let r of a) for (let i in o[r]) e.test(i) && o[r][i].push([n, t]);
			return;
		}
		let o = Hp(t) || [t];
		for (let e of o) for (let t of a) i[t][e] || (this.#r(t, e), i[t][e] = Sm(r[t], e) || Sm(r.ALL, e) || []), i[t][e].push([n, e]);
	}
	match = fm;
	buildAllMatchers() {
		let e = H();
		for (let t of Object.keys(this.#t)) e[t] = this.#i(t);
		return this.#e = this.#t = this.#n = void 0, bm = H(), e;
	}
	#i(e) {
		let t = this.#e[e], n = this.#t[e], r = this.#n[e], i = H(), a = [], [o, s, c] = r.buildRegExp();
		for (let e of [t, n]) for (let t in e) {
			let n = e[t], o = r.paths[t];
			o ? a[o[0]] = n.map(([e, t]) => [e, r.paths[t][1].reduceRight((e, [t], n) => (e[t] = c[o[1][n][1]], e), H())]) : i[t] = [n.map(([e]) => [e, H()]), dm];
		}
		return [
			o,
			s.map((e) => a[e]),
			i
		];
	}
}, wm = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(e) {
		this.#e = e.routers;
	}
	add(e, t, n) {
		if (!this.#t) throw Error(am);
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
				if (e instanceof om) continue;
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
}, Tm = H(), Em = 0, Dm = class e {
	#e = [];
	#t = H();
	#n = [];
	#r;
	#i = Tm;
	insert(t, n, r) {
		let i = this, a = Mp(n), o = /* @__PURE__ */ new Set(), s = 0;
		for (let t of a) {
			let n = a[++s], r = Ip(t, n) || (n === void 0 && t && t.indexOf("*") === t.length - 1 ? t : null), c = Array.isArray(r), l = c ? r[0] : r || t, u = i.#t[l] ||= new e();
			r && !u.#r && (u.#r = r, i.#n.push(u)), i = u, c && o.add(r[1]);
		}
		i.#e.push({ [t]: {
			handler: r,
			possibleKeys: [...o],
			score: ++Em
		} });
	}
	#a(e, t, n, r, i) {
		for (let a = 0, o = t.#e.length; a < o; a++) {
			let o = t.#e[a], s = o[n] || o.ALL;
			if (s) {
				s.params = H(), e.push(s);
				for (let e = 0, t = s.possibleKeys.length; e < t; e++) {
					let t = s.possibleKeys[e];
					s.params[t] = i?.[t] && !e ? i[t] : r[t] ?? i?.[t];
				}
			}
		}
	}
	search(e, t) {
		let n = [];
		this.#i = Tm;
		let r = [this], i = jp(t), a = [], o = i.length, s = null;
		for (let c = 0; c < o; c++) {
			let l = i[c], u = c === o - 1, d = [];
			for (let f = 0, p = r.length; f < p; f++) {
				let p = r[f], m = p.#t[l];
				m && (m.#i = p.#i, u ? (m.#t["*"] && this.#a(n, m.#t["*"], e, p.#i), this.#a(n, m, e, p.#i)) : d.push(m));
				for (let r of p.#n) {
					let f = r.#r, m = p.#i === Tm ? {} : { ...p.#i };
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
}, Om = class {
	name = "TrieRouter";
	#e = new Dm();
	add(e, t, n) {
		for (let r of Hp(t) || [t]) this.#e.insert(e, r, n);
	}
	match(e, t) {
		return this.#e.search(e, t);
	}
}, km = class extends um {
	constructor(e = {}) {
		super(e), this.router = e.router ?? new wm({ routers: [new Cm(), new Om()] });
	}
}, Am = [
	"start",
	"stop",
	"reboot"
], U = class extends Error {
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
}, W = class extends U {
	status = 400;
	code = "invalid_request";
	get label() {
		return this.message;
	}
}, jm = class extends U {
	status = 403;
	code = "access_denied";
	label = "Access denied by the runtime";
}, G = class extends U {
	status = 404;
	code = "resource_not_found";
	label = "Resource not found";
}, Mm = class extends U {
	status = 409;
	code = "resource_conflict";
	label = "Resource already exists or is in use";
}, Nm = class extends U {
	status = 429;
	code = "rate_limited";
	label = "Runtime is throttling requests";
}, K = class extends U {
	status = 501;
	code = "operation_not_supported";
	label = "Operation is not supported by this adapter";
}, Pm = class extends U {
	status = 501;
	code = "operation_not_implemented";
	label = "Operation is not implemented by the selected runtime";
}, Fm = class extends U {
	status = 503;
	code = "runtime_unavailable";
	label = "Runtime unavailable";
}, Im = class extends U {
	status = 502;
	code = "runtime_error";
	label = "Runtime request failed";
}, Lm = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
]);
function Rm(e) {
	if (!(e instanceof Error)) return !1;
	if (e.name === "TimeoutError" || e.name === "AbortError") return !0;
	let t = e;
	for (let e = 0; e < 5 && t instanceof Error; e += 1) {
		let e = t.code;
		if (typeof e == "string" && Lm.has(e)) return !0;
		t = t.cause;
	}
	return !1;
}
function zm(e, t) {
	let n = Bm(e, t);
	return {
		status: n.status,
		body: n.toBody()
	};
}
function Bm(e, t) {
	if (e instanceof U) return e;
	let n = t?.(e);
	if (n) return n;
	let r = e instanceof Error ? e.message : "Runtime request failed";
	return Rm(e) ? new Fm(r, { cause: e }) : new Im(r, { cause: e });
}
var Vm = 1e3, Hm = [
	"eq",
	"lt",
	"lte",
	"gt",
	"gte",
	"beginsWith",
	"between"
];
function Um(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new W("A key query must be a JSON object.");
	let { index: t, partitionKey: n, sortKey: r, descending: i } = e;
	if (t != null && (typeof t != "string" || !t)) throw new W("index must be a non-empty string.");
	if (typeof n != "string" || !n) throw new W("partitionKey is required.");
	if (i != null && typeof i != "boolean") throw new W("descending must be a boolean.");
	let a = { partitionKey: n };
	return t && (a.index = t), i && (a.descending = !0), r != null && (a.sortKey = Wm(r)), a;
}
function Wm(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw new W("sortKey must be an object.");
	let { operator: t, value: n, to: r } = e;
	if (!Hm.includes(t)) throw new W(`sortKey.operator must be one of ${Hm.join(", ")}.`);
	if (typeof n != "string" || !n) throw new W("sortKey.value is required.");
	if (t !== "between") {
		if (r != null) throw new W("sortKey.to is only valid with between.");
		return {
			operator: t,
			value: n
		};
	}
	if (typeof r != "string" || !r) throw new W("sortKey.to is required with between.");
	return {
		operator: "between",
		value: n,
		to: r
	};
}
function Gm(e) {
	if (e === void 0 || e === "") return 100;
	if (!/^\d+$/.test(e)) throw new W(`limit must be a whole number between 1 and ${Vm}.`);
	let t = Number(e);
	if (t < 1 || t > 1e3) throw new W(`limit must be between 1 and ${Vm}.`);
	return t;
}
// ../api/src/cloud-spi/serviceCatalog.ts
var Km = [
	"Compute",
	"Storage",
	"Databases",
	"Networking",
	"Integration",
	"Provisioning",
	"Security",
	"Observability"
], qm = {
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
}, Jm = Object.keys(qm).map((e) => ({
	service: e,
	...qm[e]
})).sort(Qm);
Jm.map((e) => e.service);
function q(e) {
	return Object.hasOwn(qm, e);
}
function Ym(e, t) {
	return e.displayNameByCloud?.[t] ?? e.displayName;
}
function Xm(e, t) {
	return e.descriptionByCloud?.[t] ?? e.description;
}
function Zm(e, t) {
	return (t ? e.routeByCloud?.[t] : void 0) ?? e.route ?? e.service;
}
function Qm(e, t) {
	let n = Km.indexOf(e.group) - Km.indexOf(t.group);
	return n === 0 ? e.order - t.order : n;
}
var $m = {
	aws: "https://floci.io/floci/services",
	azure: "https://floci.io/floci-az/services",
	gcp: "https://floci.io/floci-gcp/services",
	oci: "https://floci.io/floci-oci/services"
};
function eh(e, t) {
	let n = e.docsSlugByCloud?.[t];
	return n ? `${$m[t]}/${n}/` : void 0;
}
// ../api/src/adapter-aws/awsErrors.ts
var th = /* @__PURE__ */ new Set([
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
]), nh = /* @__PURE__ */ new Set([
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
]), rh = /* @__PURE__ */ new Set([
	"AccessDenied",
	"AccessDeniedException",
	"UnauthorizedOperation",
	"AuthFailure",
	"InvalidClientTokenId",
	"SignatureDoesNotMatch",
	"Forbidden",
	"MissingAuthenticationToken",
	"InvalidAccessKeyId"
]), ih = /* @__PURE__ */ new Set([
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
]), ah = /* @__PURE__ */ new Set(/* @__PURE__ */ "NoSuchBucket,NoSuchKey,NoSuchEntity,NoSuchEntityException,NotFound,NotFoundException,ResourceNotFoundException,ResourceNotFoundFault,DBInstanceNotFound,DBInstanceNotFoundFault,CacheClusterNotFound,CacheClusterNotFoundFault,ReplicationGroupNotFoundFault,ParameterNotFound,QueueDoesNotExist,StateMachineDoesNotExist,ExecutionDoesNotExist,ClusterNotFoundException,ServiceNotFoundException,RepositoryNotFoundException,NoSuchDistribution,NoSuchInvalidation,LoadBalancerNotFound,LoadBalancerNotFoundException,TargetGroupNotFound,TargetGroupNotFoundException,SecretNotFoundException,NoSuchLogGroup,NoSuchHostedZone,NoSuchHealthCheck,NoSuchResourceException,InvalidInstanceID.NotFound,InvalidVpcID.NotFound,InvalidSubnetID.NotFound,InvalidGroupId.NotFound,InvalidAMIID.NotFound".split(",")), oh = /* @__PURE__ */ new Set([
	"NotImplemented",
	"UnsupportedOperation",
	"UnsupportedOperationException",
	"UnknownOperationException"
]), sh = /* @__PURE__ */ new Set([
	"NetworkingError",
	"TimeoutError",
	"ServiceUnavailable",
	"ServiceUnavailableException",
	"RequestTimeout",
	"InternalFailure",
	"InternalError"
]);
function ch(e) {
	return !e || typeof e != "object" ? !1 : "$metadata" in e || "$fault" in e || "$retryable" in e;
}
function lh(e) {
	if (!ch(e)) return null;
	let t = e, n = t.name ?? "", r = t.message ?? n ?? "AWS request failed", i = { cause: e };
	if (t.$retryable?.throttling === !0 || th.has(n)) return new Nm(r, i);
	if (nh.has(n) || /AlreadyExists(Exception|Fault)?$/.test(n)) return new Mm(r, i);
	if (rh.has(n)) return new jm(r, i);
	if (ih.has(n)) return new W(r, i);
	if (ah.has(n) || /\.NotFound$/.test(n)) return new G(r, i);
	if (oh.has(n)) return new Pm(r, i);
	if (sh.has(n) || Rm(e)) return new Fm(r, i);
	let a = t.$metadata?.httpStatusCode;
	return a === 400 ? new W(r, i) : a === 401 || a === 403 ? new jm(r, i) : a === 404 ? new G(r, i) : a === 409 ? new Mm(r, i) : a === 429 ? new Nm(r, i) : a === 501 ? new Pm(r, i) : a === 503 || a === 504 ? new Fm(r, i) : new Im(r, i);
}
// ../api/browser-bundle/cloudproxy-stub.ts
function uh() {
	throw Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
// ../api/src/service/deadline.ts
async function dh(e, t, n) {
	let r = new AbortController(), i = setTimeout(() => r.abort(new DOMException(`Operation exceeded ${e} ms`, "TimeoutError")), e);
	try {
		return await n(t ? AbortSignal.any([t, r.signal]) : r.signal);
	} finally {
		clearTimeout(i);
	}
}
// ../api/src/service/defaultCloud.ts
var fh = {
	aws: "aws",
	az: "azure",
	azure: "azure",
	gcp: "gcp",
	oci: "oci"
}, ph = !1;
function mh(e = {}) {
	let t = e.FLOCI_CLOUD?.trim().toLowerCase();
	if (!t) return null;
	let n = hh(t);
	return !n && !ph && (ph = !0, console.warn(`Ignoring FLOCI_CLOUD=${t}: expected aws, az, gcp or oci. Serving every cloud.`)), n ?? null;
}
function hh(e) {
	let t = e.trim().toLowerCase();
	return Object.prototype.hasOwnProperty.call(fh, t) ? fh[t] : null;
}
var gh = /* @__PURE__ */ new Set([
	"SYMMETRIC_DEFAULT",
	"RSAES_OAEP_SHA_1",
	"RSAES_OAEP_SHA_256"
]), _h = /* @__PURE__ */ new Set([
	"SHA_256_RSA_PKCS1_V1_5",
	"SHA_384_RSA_PKCS1_V1_5",
	"SHA_512_RSA_PKCS1_V1_5",
	"ECDSA_SHA_256",
	"ECDSA_SHA_384",
	"ECDSA_SHA_512"
]), vh = 5464, yh = 8192, bh = 50, xh = 12e4;
function Sh(e, t = uh) {
	let n = new km();
	n.onError((e, t) => {
		if (e instanceof U) {
			let { status: n, body: r } = zm(e);
			return t.json(r, n);
		}
		return e instanceof bp ? e.getResponse() : (console.error(e), t.text("Internal Server Error", 500));
	});
	let r = (n) => e ?? t(n.req.header("x-floci-account-id") ?? n.req.query("account"), n.req.header("x-floci-region") ?? n.req.query("region")), i = e ? e.scopedCloud() : mh();
	n.use("/:cloud/*", async (e, t) => {
		let n = e.req.param("cloud");
		if (i !== null && J(n) && n !== i) throw new G("Unknown cloud");
		await t();
	}), n.get("/", (e) => e.json(r(e).clouds())), n.get("/:cloud/services", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return e.json(await r(e).services(t));
	}), n.get("/:cloud/status", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		let n = e.req.query("services") === "all";
		return e.json(await r(e).status(t, { includeServices: n }));
	}), n.get("/:cloud/services/:service/status", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return e.json(await r(e).serviceStatus(t, n));
	}), n.get("/:cloud/services/:service/schema", (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = r(e).schema(t, n);
		if (!i) throw new G("Schema not available");
		return e.json(i);
	}), n.get("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listDatabaseSnapshots(t, e.req.query("instanceIdentifier"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/database/snapshots", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).createDatabaseSnapshot(t, n);
			return e.json(i, 201);
		});
	}), n.get("/:cloud/services/database/orderable-classes", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listDatabaseOrderableInstanceClasses(t, e.req.query("engine"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/storage/resources/:id/empty", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Rh(e, 150), Z(e, () => dh(xh, e.req.raw.signal, async (n) => e.json(await r(e).emptyBucket(t, e.req.param("id"), { signal: n }))));
	}), n.get("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = r(e), a = await i.listResources(t, n, {
				search: e.req.query("search"),
				filters: Bh(i.schema(t, n), (t) => e.req.query(t))
			});
			return e.json(a);
		});
	}), n.get("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listCosmosContainers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).createCosmosContainer(t, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteCosmosContainer(t, e.req.param("id"), e.req.param("containerId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listCosmosItems(t, e.req.param("id"), e.req.param("containerId"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/items", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).upsertCosmosItem(t, e.req.param("id"), e.req.param("containerId"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/nosql/resources/:id/containers/:containerId/items/:itemId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteCosmosItem(t, e.req.param("id"), e.req.param("containerId"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/nosql/resources/:id/containers/:containerId/query", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCosmosItems(t, e.req.param("id"), e.req.param("containerId"), n.query ?? "");
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/databases", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlDatabases(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/tables", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await e.req.json(), a = await r(e).listSqlTables(t, n, e.req.param("id"), i);
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/sql/query", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let { query: i = "", ...a } = await e.req.json(), o = await r(e).querySql(t, n, e.req.param("id"), a, i);
			return e.json(o);
		});
	}), n.post("/:cloud/services/logs/resources/:id/query", async (e, t) => {
		let n = e.req.param("cloud");
		if (!J(n)) throw new G("Unknown cloud");
		return n === "aws" ? Z(e, async () => {
			let t = await e.req.json();
			if (typeof t.queryString != "string") throw new W("queryString must be a string.");
			if (typeof t.startTime != "number") throw new W("startTime must be a number (epoch seconds).");
			if (typeof t.endTime != "number") throw new W("endTime must be a number (epoch seconds).");
			if (t.limit !== void 0 && typeof t.limit != "number") throw new W("limit must be a number.");
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
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json();
			if (!Array.isArray(n.logGroupNames) || n.logGroupNames.length === 0 || !n.logGroupNames.every((e) => typeof e == "string")) throw new W("logGroupNames must be a non-empty array of strings.");
			if (n.logGroupNames.length > bh) throw new W(`logGroupNames must include at most ${bh} log groups.`);
			if (typeof n.queryString != "string") throw new W("queryString must be a string.");
			if (typeof n.startTime != "number") throw new W("startTime must be a number (epoch seconds).");
			if (typeof n.endTime != "number") throw new W("endTime must be a number (epoch seconds).");
			if (n.limit !== void 0 && typeof n.limit != "number") throw new W("limit must be a number.");
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
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).clearEmailInbox(t), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listKubernetesNodegroups(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/nodegroups", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).createKubernetesNodegroup(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/nodegroups/:nodegroupId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteKubernetesNodegroup(t, e.req.param("id"), e.req.param("nodegroupId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listKubernetesFargateProfiles(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/k8s/resources/:id/fargate-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).createKubernetesFargateProfile(t, e.req.param("id"), await e.req.json());
			return e.json(n, 201);
		});
	}), n.delete("/:cloud/services/k8s/resources/:id/fargate-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteKubernetesFargateProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).listAppConfigEnvironments(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/environments", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigEnvironment(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/environments/:environmentId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteAppConfigEnvironment(t, e.req.param("id"), e.req.param("environmentId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).listAppConfigConfigurationProfiles(t, e.req.param("id"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigConfigurationProfile(t, e.req.param("id"), { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteAppConfigConfigurationProfile(t, e.req.param("id"), e.req.param("profileId")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).listAppConfigHostedConfigurationVersions(t, e.req.param("id"), e.req.param("profileId"))));
	}), n.post("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
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
		if (!J(t) || n === null) throw new G("Unknown cloud or version");
		return Z(e, async () => {
			let i = await r(e).getAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n);
			if (!i) throw new G("Hosted configuration version not found");
			return e.json(i);
		});
	}), n.delete("/:cloud/services/configuration/resources/:id/configuration-profiles/:profileId/hosted-configuration-versions/:versionNumber", async (e) => {
		let t = e.req.param("cloud"), n = a(e.req.param("versionNumber"));
		if (!J(t) || n === null) throw new G("Unknown cloud or version");
		return Z(e, async () => (await r(e).deleteAppConfigHostedConfigurationVersion(t, e.req.param("id"), e.req.param("profileId"), n), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).listAppConfigDeploymentStrategies(t)));
	}), n.post("/:cloud/services/configuration/deployment-strategies", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).createAppConfigDeploymentStrategy(t, { values: n }), 201);
		});
	}), n.delete("/:cloud/services/configuration/deployment-strategies/:strategyId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).deleteAppConfigDeploymentStrategy(t, e.req.param("strategyId")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json();
			return e.json(await r(e).startAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), { values: n }), 201);
		});
	}), n.get("/:cloud/services/configuration/resources/:id/environments/:environmentId/deployments/:deploymentNumber", async (e) => {
		let t = e.req.param("cloud"), n = Number(e.req.param("deploymentNumber"));
		if (!J(t) || !Number.isInteger(n) || n <= 0) throw new G("Unknown cloud or deployment");
		return Z(e, async () => {
			let i = await r(e).getAppConfigDeployment(t, e.req.param("id"), e.req.param("environmentId"), n);
			if (!i) throw new G("Deployment not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await r(e).listLambdaTriggers(t, e.req.param("id"));
			return e.json(n);
		});
	}), n.post("/:cloud/services/serverless/resources/:id/triggers", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).createLambdaTrigger(t, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/serverless/resources/:id/triggers/:triggerId", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => {
			let n = {
				type: e.req.query("type") ?? void 0,
				bucket: e.req.query("bucket") ?? void 0
			};
			return await r(e).deleteLambdaTrigger(t, e.req.param("id"), e.req.param("triggerId"), n), e.json({ ok: !0 });
		});
	}), n.get("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await r(e).listChildCollections(t.cloud, t.service, e.req.param("id"), Ih(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).createChildCollection(t.cloud, t.service, e.req.param("id"), { values: n });
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => (await r(e).deleteChildCollection(t.cloud, t.service, e.req.param("id"), e.req.param("cid")), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await r(e).listCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), Ih(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/items", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).putCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/collections/:cid/items/:itemId", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => (await r(e).deleteCollectionItem(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/collections/:cid/query", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).queryCollectionItems(t.cloud, t.service, e.req.param("id"), e.req.param("cid"), n.query ?? "", Lh(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await r(e).listFlatItems(t.cloud, t.service, e.req.param("id"), Ih(e));
			return e.json(n);
		});
	}), n.post("/:cloud/services/:service/resources/:id/items", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).putFlatItem(t.cloud, t.service, e.req.param("id"), n);
			return e.json(i, 201);
		});
	}), n.delete("/:cloud/services/:service/resources/:id/items/:itemId", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => (await r(e).deleteFlatItem(t.cloud, t.service, e.req.param("id"), e.req.param("itemId"), e.req.query("partitionKey") ?? null), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/query", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItems(t.cloud, t.service, e.req.param("id"), n.query ?? "", Lh(n));
			return e.json(i);
		});
	}), n.post("/:cloud/services/:service/resources/:id/key-query", async (e) => {
		let t = X(e);
		if (!t) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let n = await e.req.json(), i = await r(e).queryFlatItemsByKey(t.cloud, t.service, e.req.param("id"), Um(n), Lh(n));
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await r(e).getResource(t, n, e.req.param("id"));
			if (!i) throw new G("Resource not found");
			return e.json(i);
		});
	}), n.get("/:cloud/services/:service/resources/:id/objects", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await r(e).listObjects(t, n, e.req.param("id"), e.req.query("prefix") ?? "");
			return e.json(i);
		});
	}), n.put("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new W("Object key is required");
		let a = new Uint8Array(await e.req.arrayBuffer()), o = e.req.header("content-type") ?? "application/octet-stream";
		return Z(e, async () => (await r(e).putObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.get("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new W("Object key is required");
		return Z(e, async () => {
			let a = await r(e).getObject(t, n, e.req.param("id"), i);
			return new Response(a.body, { headers: {
				"content-type": a.contentType,
				...a.contentLength === null ? {} : { "content-length": String(a.contentLength) },
				"content-disposition": `attachment; filename="${i.split("/").pop() ?? i}"`
			} });
		});
	}), n.delete("/:cloud/services/:service/resources/:id/object", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = e.req.query("key") ?? "";
		if (!i) throw new W("Object key is required");
		return Z(e, async () => (await r(e).deleteObject(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/object/copy", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let { srcKey: i, destKey: a, destResourceId: o } = await e.req.json();
		if (!i || !a) throw new W("srcKey and destKey are required");
		return Z(e, async () => (await r(e).copyObject(t, n, e.req.param("id"), i, a, o), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/invoke", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await e.req.json().catch(() => ({})), a = await r(e).invokeResource(t, n, e.req.param("id"), i.payload ?? "{}");
			return e.json(a);
		});
	}), n.post("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await kh(e);
			if (typeof i.body != "string" || i.body.length === 0) throw new W("body is required");
			let a;
			if (i.attributes !== void 0) {
				if (!i.attributes || typeof i.attributes != "object" || Array.isArray(i.attributes) || Object.entries(i.attributes).some(([, e]) => typeof e != "string")) throw new W("attributes must be an object of string values");
				a = i.attributes;
			}
			let o = await r(e).sendQueueMessage(t, n, e.req.param("id"), i.body, a);
			return e.json(o);
		});
	}), n.get("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = e.req.query("maxMessages"), a = i ? Number(i) : void 0;
		if (i !== void 0 && (!Number.isInteger(a) || a < 1 || a > 10)) throw new W("maxMessages must be an integer between 1 and 10");
		return Z(e, async () => {
			let i = await r(e).receiveQueueMessages(t, n, e.req.param("id"), a);
			return e.json({ messages: i });
		});
	}), n.post("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = Eh((await kh(e)).messages);
			return e.json(await r(e).putStreamMessages(t, n, e.req.param("id"), i));
		});
	}), n.get("/:cloud/services/:service/resources/:id/stream-messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = Dh(e.req.query());
		return Z(e, async () => e.json(await r(e).readStreamMessages(t, n, e.req.param("id"), i)));
	}), n.delete("/:cloud/services/:service/resources/:id/messages", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		let i = e.req.query("receiptHandle") ?? "";
		if (!i) throw new W("receiptHandle is required");
		return Z(e, async () => (await r(e).deleteQueueMessage(t, n, e.req.param("id"), i), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources/:id/purge", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => (await r(e).purgeQueue(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/kms/resources/:id/encrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return zh(e, async () => {
			let n = await Ah(e), i = await r(e).encryptKms(t, e.req.param("id"), {
				plaintext: Fh(n.plaintextBase64, "plaintextBase64", vh),
				encryptionAlgorithm: jh(n.encryptionAlgorithm),
				encryptionContext: Ph(n.encryptionContext)
			});
			return e.json({
				ciphertextBlobBase64: Buffer.from(i.ciphertextBlob).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	}), n.post("/:cloud/services/kms/resources/:id/decrypt", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return zh(e, async () => {
			let n = await Ah(e), i = await r(e).decryptKms(t, e.req.param("id"), {
				ciphertextBlob: Fh(n.ciphertextBlobBase64, "ciphertextBlobBase64", yh),
				encryptionAlgorithm: jh(n.encryptionAlgorithm),
				encryptionContext: Ph(n.encryptionContext)
			});
			return e.json({
				plaintextBase64: Buffer.from(i.plaintext).toString("base64"),
				keyId: i.keyId,
				encryptionAlgorithm: i.encryptionAlgorithm
			});
		});
	});
	for (let e of Am) n.post(`/:cloud/services/compute/resources/:id/${e}`, async (t) => {
		let n = t.req.param("cloud");
		if (!J(n)) throw new G("Unknown cloud");
		return Z(t, async () => t.json(await r(t).powerCompute(n, t.req.param("id"), e)));
	});
	return n.post("/:cloud/services/kms/resources/:id/rotate", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).rotateKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/sign", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return zh(e, async () => {
			let n = await Ah(e), i = await r(e).signKms(t, e.req.param("id"), {
				message: Fh(n.messageBase64, "messageBase64", vh),
				signingAlgorithm: Mh(n.signingAlgorithm)
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
		if (!J(t)) throw new G("Unknown cloud");
		return zh(e, async () => {
			let n = await Ah(e), i = await r(e).verifyKms(t, e.req.param("id"), {
				message: Fh(n.messageBase64, "messageBase64", vh),
				signature: Fh(n.signatureBase64, "signatureBase64", yh),
				keyVersionId: Nh(n.keyVersionId, "keyVersionId"),
				signingAlgorithm: Mh(n.signingAlgorithm)
			});
			return e.json(i);
		});
	}), n.post("/:cloud/services/kms/resources/:id/cancel-deletion", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).cancelKmsDeletion(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).recoverKms(t, e.req.param("id"))));
	}), n.post("/:cloud/services/kms/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).purgeDeletedKms(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/secrets/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).recoverSecret(t, e.req.param("id"))));
	}), n.post("/:cloud/services/secrets/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).purgeDeletedSecret(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/identity/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).recoverIdentity(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/recover", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => e.json(await r(e).recoverCertificate(t, e.req.param("id"))));
	}), n.post("/:cloud/services/certificates/resources/:id/purge-deleted", async (e) => {
		let t = e.req.param("cloud");
		if (!J(t)) throw new G("Unknown cloud");
		return Z(e, async () => (await r(e).purgeDeletedCertificate(t, e.req.param("id")), e.json({ ok: !0 })));
	}), n.post("/:cloud/services/:service/resources", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await kh(e), a = await r(e).createResource(t, n, { values: i });
			return e.json(a, 201);
		});
	}), n.patch("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = await e.req.json(), a = await r(e).updateResource(t, n, e.req.param("id"), { values: i });
			return e.json(a, 200);
		});
	}), n.patch("/:cloud/services/:service/resources/:id/tags", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => {
			let i = Oh(await kh(e));
			return await r(e).updateTags(t, n, e.req.param("id"), i), e.json({ ok: !0 });
		});
	}), n.delete("/:cloud/services/:service/resources/:id", async (e) => {
		let t = e.req.param("cloud"), n = e.req.param("service");
		if (!J(t) || !q(n)) throw new G("Unknown cloud or service");
		return Z(e, async () => (await r(e).deleteResource(t, n, e.req.param("id")), e.json({ ok: !0 })));
	}), n;
}
function J(e) {
	return e === "aws" || e === "azure" || e === "gcp" || e === "oci";
}
var Ch = [
	"TRIM_HORIZON",
	"LATEST",
	"AT_OFFSET",
	"AFTER_OFFSET",
	"AT_TIME"
], wh = 100, Th = 100;
function Eh(e) {
	if (!Array.isArray(e) || e.length === 0) throw new W("messages must contain at least one entry");
	if (e.length > Th) throw new W(`messages must contain at most ${Th} entries`);
	return e.map((e) => {
		let t = e;
		if (!t || typeof t != "object" || typeof t.value != "string" || t.value.length === 0) throw new W("each message needs a non-empty value");
		if (t.key !== void 0 && t.key !== null && typeof t.key != "string") throw new W("message key must be a string");
		return {
			key: typeof t.key == "string" && t.key.length > 0 ? t.key : void 0,
			value: t.value
		};
	});
}
function Dh(e) {
	let t = e.partition ?? "";
	if (!/^\d+$/.test(t)) throw new W("partition must be a whole number");
	let n = e.cursorType || "TRIM_HORIZON";
	if (!Ch.includes(n)) throw new W(`cursorType must be one of ${Ch.join(", ")}`);
	let r = {
		partition: t,
		cursorType: n
	};
	if (n === "AT_OFFSET" || n === "AFTER_OFFSET") {
		let t = Number(e.offset);
		if (e.offset === void 0 || e.offset === "" || !Number.isSafeInteger(t) || t < 0) throw new W("offset must be a whole number of 0 or more");
		r.offset = t;
	}
	if (n === "AT_TIME") {
		if (!e.time || Number.isNaN(Date.parse(e.time))) throw new W("time must be an RFC 3339 timestamp");
		r.time = e.time;
	}
	if (e.limit !== void 0 && e.limit !== "") {
		let t = Number(e.limit);
		if (!Number.isInteger(t) || t < 1 || t > wh) throw new W(`limit must be an integer between 1 and ${wh}`);
		r.limit = t;
	}
	return e.cursor && (r.cursor = e.cursor), r;
}
function Oh(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Object.entries(e)) if (r === null) t.set(n, null);
	else if (typeof r == "string") t.set(n, r);
	else throw new W(`the tag ${n} must be a string or null`);
	return Object.fromEntries(t);
}
async function kh(e) {
	try {
		let t = await e.req.json();
		if (!t || typeof t != "object" || Array.isArray(t)) throw new W("Request body must be a JSON object");
		return t;
	} catch (e) {
		throw e instanceof W ? e : new W("Request body must be valid JSON");
	}
}
var Y = class extends W {};
async function Ah(e) {
	try {
		return await kh(e);
	} catch (e) {
		throw e instanceof W ? new Y(e.message) : e;
	}
}
function jh(e) {
	if (typeof e != "string" || !gh.has(e)) throw new Y("encryptionAlgorithm must be a supported KMS encryption algorithm");
	return e;
}
function Mh(e) {
	if (typeof e != "string" || !_h.has(e)) throw new Y("signingAlgorithm must be a supported KMS signing algorithm");
	return e;
}
function Nh(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 512) throw new Y(`${t} must be a non-empty string of at most 512 characters`);
	return e.trim();
}
function Ph(e) {
	if (e === void 0) return;
	if (!e || typeof e != "object" || Array.isArray(e)) throw new Y("encryptionContext must be an object of string values");
	let t = Object.entries(e);
	if (t.some(([, e]) => typeof e != "string")) throw new Y("encryptionContext must be an object of string values");
	return t.length === 0 ? void 0 : Object.fromEntries(t);
}
function Fh(e, t, n) {
	if (typeof e != "string") throw new Y(`${t} must be a base64 string`);
	if (e.length > n) throw new Y(`${t} is too large`);
	if (e.length % 4 != 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)) throw new Y(`${t} must be canonical base64`);
	let r = Buffer.from(e, "base64");
	if (r.toString("base64") !== e) throw new Y(`${t} must be canonical base64`);
	return r;
}
function X(e) {
	let t = e.req.param("cloud"), n = e.req.param("service");
	return !J(t) || !q(n) ? null : {
		cloud: t,
		service: n
	};
}
function Ih(e) {
	return {
		cursor: e.req.query("cursor"),
		limit: Gm(e.req.query("limit"))
	};
}
function Lh(e) {
	if (e.cursor !== void 0 && e.cursor !== null && typeof e.cursor != "string") throw new W("cursor must be a string.");
	if (e.limit !== void 0 && e.limit !== null && typeof e.limit != "number") throw new W("limit must be a number.");
	return {
		cursor: e.cursor || void 0,
		limit: Gm(typeof e.limit == "number" ? String(e.limit) : void 0)
	};
}
function Rh(e, t) {
	let n = e.env?.server;
	if (typeof n?.timeout != "function") throw Error("The Bun server binding is missing; serve the API through createBunFetch.");
	n.timeout(e.req.raw, t);
}
async function Z(e, t) {
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = zm(t, lh);
		return e.json(r, n);
	}
}
async function zh(e, t) {
	e.header("cache-control", "no-store");
	try {
		return await t();
	} catch (t) {
		let { status: n, body: r } = zm(t, lh);
		if (t instanceof Y) return e.json(r, n);
		let i = r.code === "invalid_request" ? "KMS rejected the request" : r.error;
		return e.json({
			error: i,
			code: r.code,
			message: i
		}, n);
	}
}
function Bh(e, t) {
	let n = {};
	for (let r of e?.filters ?? []) {
		if (r.name === "search") continue;
		let e = t(r.name);
		e !== void 0 && e !== "" && (n[r.name] = e);
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
Sh();
// ../api/src/registry/CloudAdapterRegistry.ts
var Vh = class {
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
}, Hh = async () => {}, Uh = {
	aws: Hh,
	azure: Hh,
	gcp: Hh,
	oci: Hh
};
function Wh() {
	return null;
}
// ../api/src/service/CloudProxyService.ts
var Gh = 5e3, Kh = class {
	registry;
	scope;
	awsRegion;
	runtimeCache = /* @__PURE__ */ new Map();
	serviceStatusCache = /* @__PURE__ */ new Map();
	probes;
	objectWrites = /* @__PURE__ */ new Map();
	emptying = /* @__PURE__ */ new Set();
	constructor(e, t = Uh, n = mh(), r = null) {
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
		return Promise.all(Jm.map(async (t) => {
			let n = this.registry.get(e, t.service), r = await n?.resolveDescriptorOverride?.() ?? n?.descriptorOverride?.() ?? {}, i = t.legacyAvailability?.[e] ?? (n ? "available" : "coming_soon"), a = r.availability ?? i, o = r.displayName ?? Ym(t, e);
			return {
				cloud: e,
				service: t.service,
				displayName: o,
				description: Xm(t, e),
				docsUrl: eh(t, e),
				availability: a,
				reason: r.reason ?? qh(a, e, o),
				route: Zm(t, e),
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
			endpoint: Wh(e),
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
		if (r && Date.now() - r.at < Gh) return r.value;
		let i = await this.measureServiceStatus(e, t);
		return this.serviceStatusCache.set(n, {
			at: Date.now(),
			value: i
		}), i;
	}
	async measureServiceStatus(e, t) {
		let n = Wh(e), r = this.registry.get(e, t), i = (/* @__PURE__ */ new Date()).toISOString();
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
			let { body: o } = zm(r, lh);
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
		if (t && Date.now() - t.at < Gh) return t.value;
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
		if (!i.update) throw new K(`Resource updates are not supported for ${e}/${t}`);
		return i.update(n, r);
	}
	async deleteResource(e, t, n) {
		await this.requireAdapter(e, t).delete(n);
	}
	async updateTags(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.updateTags) throw new K(`Tag editing is not supported for ${e}/${t}`);
		await i.updateTags(n, r);
	}
	async encryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.encrypt) throw new K(`${e}/kms encrypt is not supported`);
		return r.encrypt(t, n);
	}
	async decryptKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.decrypt) throw new K(`${e}/kms decrypt is not supported`);
		return r.decrypt(t, n);
	}
	async powerCompute(e, t, n) {
		let r = this.requireAdapter(e, "compute"), i = r[n];
		if (!i) throw new K(`${e}/compute ${n} is not supported`);
		await i.call(r, t);
		let a = await r.get(t);
		if (!a) throw new G(`Instance ${t} not found`);
		return a;
	}
	async rotateKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.rotate) throw new K(`${e}/kms rotate is not supported`);
		return n.rotate(t);
	}
	async signKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.sign) throw new K(`${e}/kms sign is not supported`);
		return r.sign(t, n);
	}
	async verifyKms(e, t, n) {
		let r = this.requireAdapter(e, "kms");
		if (!r.verify) throw new K(`${e}/kms verify is not supported`);
		return r.verify(t, n);
	}
	async cancelKmsDeletion(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.cancelDeletion) throw new K(`${e}/kms cancelDeletion is not supported`);
		return n.cancelDeletion(t);
	}
	async recoverKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.recover) throw new K(`${e}/kms recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedKms(e, t) {
		let n = this.requireAdapter(e, "kms");
		if (!n.purgeDeleted) throw new K(`${e}/kms purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverIdentity(e, t) {
		let n = this.requireAdapter(e, "identity");
		if (!n.recover) throw new K(`${e}/identity recover is not supported`);
		return n.recover(t);
	}
	async recoverSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.recover) throw new K(`${e}/secrets recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedSecret(e, t) {
		let n = this.requireAdapter(e, "secrets");
		if (!n.purgeDeleted) throw new K(`${e}/secrets purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async recoverCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.recover) throw new K(`${e}/certificates recover is not supported`);
		return n.recover(t);
	}
	async purgeDeletedCertificate(e, t) {
		let n = this.requireAdapter(e, "certificates");
		if (!n.purgeDeleted) throw new K(`${e}/certificates purgeDeleted is not supported`);
		await n.purgeDeleted(t);
	}
	async invokeResource(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.invoke) throw new K(`${e}/${t} invoke is not supported`);
		return i.invoke(n, r);
	}
	async sendQueueMessage(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.sendMessage) throw new K(`${e}/${t} sendMessage is not supported`);
		return a.sendMessage(n, r, i);
	}
	async receiveQueueMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.receiveMessages) throw new K(`${e}/${t} receiveMessages is not supported`);
		return i.receiveMessages(n, r);
	}
	async putStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.putMessages) throw new K(`${e}/${t} putMessages is not supported`);
		return i.putMessages(n, r);
	}
	async readStreamMessages(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.readMessages) throw new K(`${e}/${t} readMessages is not supported`);
		return i.readMessages(n, r);
	}
	async deleteQueueMessage(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteMessage) throw new K(`${e}/${t} deleteMessage is not supported`);
		await i.deleteMessage(n, r);
	}
	async purgeQueue(e, t, n) {
		let r = this.requireAdapter(e, t);
		if (!r.purgeQueue) throw new K(`${e}/${t} purgeQueue is not supported`);
		await r.purgeQueue(n);
	}
	async emptyBucket(e, t, n) {
		let r = this.requireAdapter(e, "storage");
		if (!r.emptyBucket) throw new K(`${e}/storage emptyBucket is not supported`);
		let i = r.emptyBucket.bind(r), a = Jh(e, t);
		if (this.emptying.has(a)) throw new Mm(`Empty bucket is already running on "${t}".`);
		if (this.objectWrites.has(a)) throw new Mm(`Object writes to "${t}" are still running, so nothing was deleted. Run Empty bucket again once they finish.`);
		this.emptying.add(a);
		try {
			return await i(t, n);
		} finally {
			this.emptying.delete(a);
		}
	}
	async objectWrite(e, t, n) {
		let r = Jh(e, t);
		if (this.emptying.has(r)) throw new Mm(`Empty bucket is running on "${t}". Try again once it finishes.`);
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
		if (!i.listObjects) throw new K(`Object listing is not supported for ${e}/${t}`);
		return i.listObjects(n, r);
	}
	async putObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.putObject) throw new K(`Object upload is not supported for ${e}/${t}`);
		let s = o.putObject.bind(o);
		await this.objectWrite(e, n, () => s(n, r, i, a));
	}
	async getObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.getObject) throw new K(`Object download is not supported for ${e}/${t}`);
		return i.getObject(n, r);
	}
	async deleteObject(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.deleteObject) throw new K(`Object delete is not supported for ${e}/${t}`);
		let a = i.deleteObject.bind(i);
		await this.objectWrite(e, n, () => a(n, r));
	}
	async copyObject(e, t, n, r, i, a) {
		let o = this.requireAdapter(e, t);
		if (!o.copyObject) throw new K(`Object copy is not supported for ${e}/${t}`);
		let s = o.copyObject.bind(o);
		await this.objectWrite(e, a ?? n, () => s(n, r, i, a));
	}
	async listChildCollections(e, t, n, r) {
		return this.requireDocuments(e, t).listCollections(n, r);
	}
	async createChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.createCollection) throw new K(`Creating collections is not supported for ${e}/${t}`);
		return i.createCollection(n, r);
	}
	async deleteChildCollection(e, t, n, r) {
		let i = this.requireDocuments(e, t);
		if (!i.deleteCollection) throw new K(`Deleting collections is not supported for ${e}/${t}`);
		await i.deleteCollection(n, r);
	}
	async listCollectionItems(e, t, n, r, i) {
		return this.requireDocuments(e, t).listItems(n, r, i);
	}
	async putCollectionItem(e, t, n, r, i) {
		let a = this.requireDocuments(e, t);
		if (!a.putItem) throw new K(`Writing items is not supported for ${e}/${t}`);
		return a.putItem(n, r, i);
	}
	async deleteCollectionItem(e, t, n, r, i, a) {
		let o = this.requireDocuments(e, t);
		if (!o.deleteItem) throw new K(`Deleting items is not supported for ${e}/${t}`);
		await o.deleteItem(n, r, i, a);
	}
	async queryCollectionItems(e, t, n, r, i, a = {}) {
		let o = this.requireDocuments(e, t);
		if (!o.queryItems) throw new K(`Querying items is not supported for ${e}/${t}`);
		return o.queryItems(n, r, i, a);
	}
	async listFlatItems(e, t, n, r) {
		return this.requireItems(e, t).listItems(n, r);
	}
	async putFlatItem(e, t, n, r) {
		let i = this.requireItems(e, t);
		if (!i.putItem) throw new K(`Writing items is not supported for ${e}/${t}`);
		return i.putItem(n, r);
	}
	async deleteFlatItem(e, t, n, r, i) {
		let a = this.requireItems(e, t);
		if (!a.deleteItem) throw new K(`Deleting items is not supported for ${e}/${t}`);
		await a.deleteItem(n, r, i);
	}
	async queryFlatItems(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItems) throw new K(`Querying items is not supported for ${e}/${t}`);
		return a.queryItems(n, r, i);
	}
	async queryFlatItemsByKey(e, t, n, r, i = {}) {
		let a = this.requireItems(e, t);
		if (!a.queryItemsByKey) throw new K(`Querying items by key is not supported for ${e}/${t}`);
		return a.queryItemsByKey(n, r, i);
	}
	requireDocuments(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.documents) throw new K(`Nested collections are not supported for ${e}/${t}`);
		return n.documents;
	}
	requireItems(e, t) {
		let n = this.requireAdapter(e, t);
		if (!n.items) throw new K(`Flat items are not supported for ${e}/${t}`);
		return n.items;
	}
	async listCosmosContainers(e, t) {
		let n = this.requireAdapter(e, "nosql");
		if (!n.listCosmosContainers) throw new K(`Cosmos containers are not supported for ${e}/database`);
		return n.listCosmosContainers(t);
	}
	async createCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.createCosmosContainer) throw new K(`Cosmos container creation is not supported for ${e}/database`);
		return r.createCosmosContainer(t, n);
	}
	async deleteCosmosContainer(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.deleteCosmosContainer) throw new K(`Cosmos container deletion is not supported for ${e}/database`);
		await r.deleteCosmosContainer(t, n);
	}
	async listCosmosItems(e, t, n) {
		let r = this.requireAdapter(e, "nosql");
		if (!r.listCosmosItems) throw new K(`Cosmos items are not supported for ${e}/database`);
		return r.listCosmosItems(t, n);
	}
	async upsertCosmosItem(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.upsertCosmosItem) throw new K(`Cosmos item upsert is not supported for ${e}/database`);
		return i.upsertCosmosItem(t, n, r);
	}
	async deleteCosmosItem(e, t, n, r, i) {
		let a = this.requireAdapter(e, "nosql");
		if (!a.deleteCosmosItem) throw new K(`Cosmos item deletion is not supported for ${e}/database`);
		await a.deleteCosmosItem(t, n, r, i);
	}
	async queryCosmosItems(e, t, n, r) {
		let i = this.requireAdapter(e, "nosql");
		if (!i.queryCosmosItems) throw new K(`Cosmos query is not supported for ${e}/database`);
		return i.queryCosmosItems(t, n, r);
	}
	async listDatabaseSnapshots(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseSnapshots) throw new K(`Snapshot listing is not supported for ${e}/database`);
		return n.listDatabaseSnapshots(t);
	}
	async createDatabaseSnapshot(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.createDatabaseSnapshot) throw new K(`Snapshot creation is not supported for ${e}/database`);
		return n.createDatabaseSnapshot(t);
	}
	async listDatabaseOrderableInstanceClasses(e, t) {
		let n = this.requireAdapter(e, "database");
		if (!n.listDatabaseOrderableInstanceClasses) throw new K(`Orderable instance class listing is not supported for ${e}/database`);
		return n.listDatabaseOrderableInstanceClasses(t);
	}
	async listSqlDatabases(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlDatabases) throw new K(`SQL database browsing is not supported for ${e}/${t}`);
		return i.listSqlDatabases(n, r);
	}
	async listSqlTables(e, t, n, r) {
		let i = this.requireAdapter(e, t);
		if (!i.listSqlTables) throw new K(`SQL table browsing is not supported for ${e}/${t}`);
		return i.listSqlTables(n, r);
	}
	async querySql(e, t, n, r, i) {
		let a = this.requireAdapter(e, t);
		if (!a.querySql) throw new K(`SQL query is not supported for ${e}/${t}`);
		return a.querySql(n, r, i);
	}
	async queryLogs(e, t, n) {
		let r = this.requireAdapter(e, "logs");
		if (!r.queryLogs) throw new K(`Logs Insights query is not supported for ${e}/logs`);
		return r.queryLogs(t, n);
	}
	async listKubernetesNodegroups(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesNodegroups) throw new K(`Nodegroups are not supported for ${e}/k8s`);
		return n.listKubernetesNodegroups(t);
	}
	async createKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesNodegroup) throw new K(`Nodegroup creation is not supported for ${e}/k8s`);
		return r.createKubernetesNodegroup(t, n);
	}
	async deleteKubernetesNodegroup(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesNodegroup) throw new K(`Nodegroup deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesNodegroup(t, n);
	}
	async listKubernetesFargateProfiles(e, t) {
		let n = this.requireAdapter(e, "k8s");
		if (!n.listKubernetesFargateProfiles) throw new K(`Fargate profiles are not supported for ${e}/k8s`);
		return n.listKubernetesFargateProfiles(t);
	}
	async createKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.createKubernetesFargateProfile) throw new K(`Fargate profile creation is not supported for ${e}/k8s`);
		return r.createKubernetesFargateProfile(t, n);
	}
	async deleteKubernetesFargateProfile(e, t, n) {
		let r = this.requireAdapter(e, "k8s");
		if (!r.deleteKubernetesFargateProfile) throw new K(`Fargate profile deletion is not supported for ${e}/k8s`);
		await r.deleteKubernetesFargateProfile(t, n);
	}
	async clearEmailInbox(e) {
		let t = this.requireAdapter(e, "email");
		if (!t.clearEmailInbox) throw new K(`Inbox clearing is not supported for ${e}/email`);
		await t.clearEmailInbox();
	}
	appConfigAdapter(e) {
		let t = this.requireAdapter(e, "configuration");
		if (!t.listAppConfigEnvironments) throw new K(`AppConfig resources are not supported for ${e}/configuration`);
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
		if (!n.listLambdaTriggers) throw new K(`Lambda triggers are not supported for ${e}/serverless`);
		return n.listLambdaTriggers(t);
	}
	async createLambdaTrigger(e, t, n) {
		let r = this.requireAdapter(e, "serverless");
		if (!r.createLambdaTrigger) throw new K(`Lambda triggers are not supported for ${e}/serverless`);
		return r.createLambdaTrigger(t, n);
	}
	async deleteLambdaTrigger(e, t, n, r) {
		let i = this.requireAdapter(e, "serverless");
		if (!i.deleteLambdaTrigger) throw new K(`Lambda triggers are not supported for ${e}/serverless`);
		await i.deleteLambdaTrigger(t, n, r);
	}
	requireAdapter(e, t) {
		let n = this.registry.get(e, t);
		if (!n) throw new K(`No adapter registered for ${e}/${t}`);
		return n;
	}
};
function qh(e, t, n) {
	if (e !== "available") return `No ${t.toUpperCase()} adapter is registered for ${n} yet.`;
}
function Jh(e, t) {
	return JSON.stringify([e, t]);
}
// ../api/src/cloud-spi/paymentCryptographySchema.ts
var Yh = [
	"TR31_B0_BASE_DERIVATION_KEY",
	"TR31_C0_CARD_VERIFICATION_KEY",
	"TR31_D0_SYMMETRIC_DATA_ENCRYPTION_KEY",
	"TR31_D1_ASYMMETRIC_KEY_FOR_DATA_ENCRYPTION",
	"TR31_E0_EMV_MKEY_APP_CRYPTOGRAMS",
	"TR31_E1_EMV_MKEY_CONFIDENTIALITY",
	"TR31_E2_EMV_MKEY_INTEGRITY",
	"TR31_E4_EMV_MKEY_DYNAMIC_NUMBERS",
	"TR31_E5_EMV_MKEY_CARD_PERSONALIZATION",
	"TR31_E6_EMV_MKEY_OTHER",
	"TR31_K0_KEY_ENCRYPTION_KEY",
	"TR31_K1_KEY_BLOCK_PROTECTION_KEY",
	"TR31_K2_TR34_ASYMMETRIC_KEY",
	"TR31_K3_ASYMMETRIC_KEY_FOR_KEY_AGREEMENT",
	"TR31_M0_ISO_16609_MAC_KEY",
	"TR31_M1_ISO_9797_1_MAC_KEY",
	"TR31_M3_ISO_9797_3_MAC_KEY",
	"TR31_M6_ISO_9797_5_CMAC_KEY",
	"TR31_M7_HMAC_KEY",
	"TR31_P0_PIN_ENCRYPTION_KEY",
	"TR31_P1_PIN_GENERATION_KEY",
	"TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE",
	"TR31_V1_IBM3624_PIN_VERIFICATION_KEY",
	"TR31_V2_VISA_PIN_VERIFICATION_KEY"
], Xh = [
	"TDES_2KEY",
	"TDES_3KEY",
	"AES_128",
	"AES_192",
	"AES_256",
	"HMAC_SHA224",
	"HMAC_SHA256",
	"HMAC_SHA384",
	"HMAC_SHA512",
	"RSA_2048",
	"RSA_3072",
	"RSA_4096",
	"ECC_NIST_P256",
	"ECC_NIST_P384",
	"ECC_NIST_P521"
], Zh = [
	"Encrypt",
	"Decrypt",
	"Wrap",
	"Unwrap",
	"DeriveKey",
	"Generate",
	"Sign",
	"Verify",
	"NoRestrictions"
], Qh = ["TDES_2KEY", "TDES_3KEY"], Q = [
	...Qh,
	"AES_128",
	"AES_192",
	"AES_256"
], $h = [
	"HMAC_SHA224",
	"HMAC_SHA256",
	"HMAC_SHA384",
	"HMAC_SHA512"
], eg = [
	"RSA_2048",
	"RSA_3072",
	"RSA_4096"
], tg = [
	"ECC_NIST_P256",
	"ECC_NIST_P384",
	"ECC_NIST_P521"
], ng = [["DeriveKey"], ["NoRestrictions"]], $ = [
	["Generate"],
	["Verify"],
	["Generate", "Verify"],
	["NoRestrictions"]
], rg = [
	[
		"Encrypt",
		"Decrypt",
		"Wrap",
		"Unwrap"
	],
	["Encrypt", "Wrap"],
	["Decrypt", "Unwrap"],
	["NoRestrictions"]
], ig = [
	[
		"Encrypt",
		"Decrypt",
		"Wrap",
		"Unwrap"
	],
	["Encrypt", "Wrap"],
	["Decrypt", "Unwrap"]
], ag = {
	TR31_B0_BASE_DERIVATION_KEY: {
		algorithms: Q,
		modes: ng
	},
	TR31_C0_CARD_VERIFICATION_KEY: {
		algorithms: Q,
		modes: $
	},
	TR31_D0_SYMMETRIC_DATA_ENCRYPTION_KEY: {
		algorithms: Q,
		modes: rg
	},
	TR31_D1_ASYMMETRIC_KEY_FOR_DATA_ENCRYPTION: {
		algorithms: eg,
		modes: ig
	},
	TR31_E0_EMV_MKEY_APP_CRYPTOGRAMS: {
		algorithms: Q,
		modes: ng
	},
	TR31_E1_EMV_MKEY_CONFIDENTIALITY: {
		algorithms: Q,
		modes: ng
	},
	TR31_E2_EMV_MKEY_INTEGRITY: {
		algorithms: Q,
		modes: ng
	},
	TR31_E4_EMV_MKEY_DYNAMIC_NUMBERS: {
		algorithms: Q,
		modes: ng
	},
	TR31_E5_EMV_MKEY_CARD_PERSONALIZATION: {
		algorithms: Q,
		modes: ng
	},
	TR31_E6_EMV_MKEY_OTHER: {
		algorithms: Q,
		modes: ng
	},
	TR31_K0_KEY_ENCRYPTION_KEY: {
		algorithms: Q,
		modes: rg
	},
	TR31_K1_KEY_BLOCK_PROTECTION_KEY: {
		algorithms: Q,
		modes: rg
	},
	TR31_K2_TR34_ASYMMETRIC_KEY: {
		algorithms: eg,
		modes: [["DeriveKey"], ...ig]
	},
	TR31_K3_ASYMMETRIC_KEY_FOR_KEY_AGREEMENT: {
		algorithms: tg,
		modes: [["DeriveKey"]]
	},
	TR31_M0_ISO_16609_MAC_KEY: {
		algorithms: Qh,
		modes: $
	},
	TR31_M1_ISO_9797_1_MAC_KEY: {
		algorithms: Qh,
		modes: $
	},
	TR31_M3_ISO_9797_3_MAC_KEY: {
		algorithms: Qh,
		modes: $
	},
	TR31_M6_ISO_9797_5_CMAC_KEY: {
		algorithms: Q,
		modes: $
	},
	TR31_M7_HMAC_KEY: {
		algorithms: [...Q, ...$h],
		modes: $
	},
	TR31_P0_PIN_ENCRYPTION_KEY: {
		algorithms: Q,
		modes: rg
	},
	TR31_P1_PIN_GENERATION_KEY: {
		algorithms: Q,
		modes: $
	},
	TR31_S0_ASYMMETRIC_KEY_FOR_DIGITAL_SIGNATURE: {
		algorithms: eg,
		modes: [["Sign"], ["Verify"]]
	},
	TR31_V1_IBM3624_PIN_VERIFICATION_KEY: {
		algorithms: Q,
		modes: $
	},
	TR31_V2_VISA_PIN_VERIFICATION_KEY: {
		algorithms: Q,
		modes: $
	}
};
function og(e) {
	return ag[e].algorithms;
}
function sg(e) {
	return e.startsWith("RSA_") || e.startsWith("ECC_") ? "ASYMMETRIC_KEY_PAIR" : "SYMMETRIC_KEY";
}
var cg = [
	{
		name: "name",
		label: "Key ARN",
		format: "code"
	},
	{
		name: "keyClass",
		label: "Key Type",
		path: "metadata.keyClass",
		format: "badge"
	},
	{
		name: "keyUsage",
		label: "Key Usage",
		path: "metadata.keyUsage"
	},
	{
		name: "keyAlgorithm",
		label: "Key Algorithm",
		path: "metadata.keyAlgorithm"
	},
	{
		name: "status",
		label: "State",
		format: "badge"
	},
	{
		name: "enabled",
		label: "Enabled",
		path: "metadata.enabled",
		format: "boolean"
	},
	{
		name: "exportable",
		label: "Exportable",
		path: "metadata.exportable",
		format: "boolean"
	},
	{
		name: "createdAt",
		label: "Created",
		format: "datetime"
	}
], lg = [{
	name: "search",
	label: "Search",
	type: "text",
	required: !1
}], ug = [{
	label: "Allowed",
	value: "true"
}, {
	label: "Not allowed",
	value: "false"
}];
function dg() {
	return Zh.map((e) => ({
		name: `mode${e}`,
		label: e,
		type: "select",
		required: !1,
		group: "Key modes of use",
		defaultValue: "false",
		options: ug
	}));
}
var fg = [
	{
		name: "list",
		label: "List keys",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "create",
		label: "Create key",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "delete",
		label: "Schedule key deletion",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	},
	{
		name: "inspect",
		label: "Inspect key",
		enabled: !0,
		status: "available",
		runtimeRequired: !1
	},
	{
		name: "updateTags",
		label: "Edit tags",
		enabled: !0,
		status: "available",
		runtimeRequired: !0
	}
];
function pg() {
	return {
		cloud: "aws",
		service: "paymentcryptography",
		displayName: "Payment Cryptography",
		fields: [
			{
				name: "keyUsage",
				label: "Key Usage",
				type: "select",
				required: !0,
				group: "Key",
				description: "What the key is for, as TR-31 names it. It decides which algorithms the key may be made of and which combinations of modes of use it may have. The default is the first usage, TR31_B0_BASE_DERIVATION_KEY.",
				defaultValue: "TR31_B0_BASE_DERIVATION_KEY",
				options: Yh.map((e) => ({
					label: e,
					value: e
				}))
			},
			{
				name: "keyAlgorithm",
				label: "Key Algorithm",
				type: "select",
				required: !1,
				group: "Key",
				description: "The algorithm the key is made of. It has to be one the usage allows. Left unset, the first algorithm the usage allows is chosen.",
				options: Xh.map((e) => ({
					label: e,
					value: e
				}))
			},
			{
				name: "exportable",
				label: "Exportable",
				type: "select",
				required: !1,
				group: "Key",
				description: "Whether the key may leave the service. It cannot be changed once the key is made.",
				defaultValue: "false",
				options: ug
			},
			{
				name: "enabled",
				label: "Enabled",
				type: "select",
				required: !1,
				group: "Key",
				description: "Whether the key does any work. A disabled key is refused by every operation that runs under it.",
				defaultValue: "true",
				options: ug
			},
			...dg()
		],
		actions: [
			"list",
			"create",
			"delete",
			"inspect"
		],
		capabilities: { resourceActions: fg },
		filters: lg,
		columns: cg,
		notice: "The keys a payment operator holds: their attributes, their check value and their state. Aliases, key replication and Multi-Party Approval are not in this view."
	};
}
// ../api/src/adapter-aws/AwsPaymentCryptographyAdapter.ts
var mg = 100, hg = class {
	client;
	cloud = "aws";
	service = "paymentcryptography";
	constructor(e) {
		this.client = e;
	}
	schema() {
		return pg();
	}
	async list(e = {}) {
		let t = await this.listKeyArns();
		return wg((await Promise.all(t.map(async (e) => {
			let t = await this.describe(e);
			return t ? xg(t, { tags: [] }) : null;
		}))).filter((e) => e !== null), e.search);
	}
	async get(e) {
		let t = await this.describe(e);
		return t ? xg(t, await this.getTags(e)) : null;
	}
	async create(e) {
		let t = Dg(e.values.keyUsage, Yh, "keyUsage"), n = gg(t, e.values.keyAlgorithm), r = _g(e.values, t), i = await this.client.send(new pp({
			KeyAttributes: {
				KeyUsage: t,
				KeyAlgorithm: n,
				KeyClass: sg(n),
				KeyModesOfUse: r
			},
			Exportable: Eg(e.values.exportable, "exportable", !1),
			Enabled: Eg(e.values.enabled, "enabled", !0)
		}));
		if (!i.Key) throw new Im("Payment Cryptography did not return the key it created");
		return xg(i.Key, { tags: [] });
	}
	async delete(e) {
		await this.client.send(new mp({ KeyIdentifier: e }));
	}
	async updateTags(e, t) {
		let n = Object.entries(t).filter((e) => e[1] !== null), r = Object.keys(t).filter((e) => t[e] === null);
		n.length > 0 && await this.client.send(new vp({
			ResourceArn: e,
			Tags: n.map(([e, t]) => ({
				Key: e,
				Value: t
			}))
		})), r.length > 0 && await this.client.send(new yp({
			ResourceArn: e,
			TagKeys: r
		}));
	}
	async health() {
		await this.client.send(new gp({ MaxResults: 1 }));
	}
	async listKeyArns() {
		let e = [], t;
		do {
			let n = await this.client.send(new gp({
				MaxResults: mg,
				...t ? { NextToken: t } : {}
			}));
			for (let t of n.Keys ?? []) t.KeyArn && e.push(t.KeyArn);
			t = n.NextToken;
		} while (t);
		return e;
	}
	async describe(e) {
		try {
			return (await this.client.send(new hp({ KeyIdentifier: e }))).Key ?? null;
		} catch (e) {
			if (Og(e)) return null;
			throw e;
		}
	}
	async getTags(e) {
		let t = [], n;
		try {
			do {
				let r = await this.client.send(new _p({
					ResourceArn: e,
					...n ? { NextToken: n } : {}
				}));
				for (let e of r.Tags ?? []) t.push({
					key: e.Key ?? "",
					value: e.Value ?? ""
				});
				n = r.NextToken;
			} while (n);
		} catch {
			return {
				tags: t,
				unavailable: !0
			};
		}
		return { tags: t };
	}
};
function gg(e, t) {
	let n = og(e), r = Dg(t, Xh, "keyAlgorithm", n[0]);
	if (!n.includes(r)) throw new W(`keyAlgorithm ${r} is not valid for keyUsage ${e}; use one of ${n.join(", ")}`);
	return r;
}
function _g(e, t) {
	let n = {};
	for (let t of Zh) {
		let r = e[`mode${t}`];
		r != null && r !== "" && Eg(r, `mode${t}`) && (n[t] = !0);
	}
	let r = Object.keys(n), i = ag[t].modes;
	if (!i.some((e) => vg(e, r))) throw new W(`the modes of use ${yg(r)} are not valid for keyUsage ${t}; use one of ${i.map(yg).join(", ")}`);
	return n;
}
function vg(e, t) {
	if (e.length !== t.length) return !1;
	let n = bg(e), r = bg(t);
	return n.every((e, t) => e === r[t]);
}
function yg(e) {
	return e.length === 0 ? "none" : bg(e).join("+");
}
function bg(e) {
	return [...e].sort((e, t) => Zh.indexOf(e) - Zh.indexOf(t));
}
function xg(e, t) {
	let n = e.KeyArn ?? "";
	return {
		id: n,
		name: n,
		cloud: "aws",
		service: "paymentcryptography",
		type: "key",
		region: Sg(n),
		createdAt: e.CreateTimestamp ? e.CreateTimestamp.toISOString() : null,
		status: e.KeyState ?? null,
		metadata: {
			arn: n,
			keyClass: e.KeyAttributes?.KeyClass,
			keyUsage: e.KeyAttributes?.KeyUsage,
			keyAlgorithm: e.KeyAttributes?.KeyAlgorithm,
			keyModesOfUse: e.KeyAttributes?.KeyModesOfUse,
			keyCheckValue: e.KeyCheckValue,
			keyCheckValueAlgorithm: e.KeyCheckValueAlgorithm,
			keyOrigin: e.KeyOrigin,
			enabled: e.Enabled,
			exportable: e.Exportable,
			usageStartTimestamp: Cg(e.UsageStartTimestamp),
			usageStopTimestamp: Cg(e.UsageStopTimestamp),
			deletePendingTimestamp: Cg(e.DeletePendingTimestamp),
			deleteTimestamp: Cg(e.DeleteTimestamp),
			multiRegionKeyType: e.MultiRegionKeyType,
			primaryRegion: e.PrimaryRegion,
			tags: t.tags,
			...t.unavailable ? { tagsUnavailable: !0 } : {}
		}
	};
}
function Sg(e) {
	return e?.split(":")[3] || null;
}
function Cg(e) {
	return e ? e.toISOString() : null;
}
function wg(e, t) {
	let n = t?.trim().toLowerCase();
	return n ? e.filter((e) => {
		let t = String(e.metadata.keyUsage ?? "").toLowerCase();
		return e.name.toLowerCase().includes(n) || t.includes(n);
	}) : e;
}
function Tg(e, t) {
	if (e != null && e !== "") {
		if (typeof e != "string") throw new W(`${t} must be a string`);
		return e;
	}
}
function Eg(e, t, n = !1) {
	let r = Tg(e, t);
	if (r === void 0) return n;
	if (r === "true") return !0;
	if (r === "false") return !1;
	throw new W(`${t} must be either true or false`);
}
function Dg(e, t, n, r = t[0]) {
	let i = Tg(e, n);
	if (i === void 0) return r;
	if (!t.includes(i)) throw new W(`${n} must be one of ${t.join(", ")}`);
	return i;
}
function Og(e) {
	return typeof e != "object" || !e ? !1 : e.name === "ResourceNotFoundException" || e.$metadata?.httpStatusCode === 404;
}
var kg = Sh(new Kh(new Vh([new hg(new lp({
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
async function Ag(e) {
	return kg.fetch(e);
}
export { Ag as handlePaymentCryptographyRequest };
