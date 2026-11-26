// SPDX-License-Identifier: CC0-1.0

// A minimal EC2 query-protocol client, SigV4-signed by hand with the Web Crypto
// API, for `vpc-wizard.js` — not from Floci UI's own source (unlike the rest of
// this directory — see its README): every OTHER bundle here gets a real AWS SDK
// client from floci-ui's own build, but this one has no bundle of its own to
// pull one from (`handleVpcWizardRequest` answers a route floci-ui's own
// `routes/ec2.ts` never wires up in this embedded build at all — see
// `vpc-wizard.js`'s own header comment). The credentials and endpoint below are
// not secrets: every OTHER bundle's own build stub (`build-src/*-entry.ts`)
// hardcodes this exact same `{accessKeyId:"test",secretAccessKey:"test"}`
// against this exact same `https://emulator.local.invalid` endpoint, and the
// emulator itself holds no real AWS account for a real credential to protect.

const REGION = "us-east-1";
const SERVICE = "ec2";
const ACCESS_KEY_ID = "test";
const SECRET_ACCESS_KEY = "test";
const ENDPOINT = "https://emulator.local.invalid/";
const API_VERSION = "2016-11-15";

export class Ec2Error extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

async function sha256Hex(bytes) {
  const data = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(keyBytes, data) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, typeof data === "string" ? new TextEncoder().encode(data) : data);
  return new Uint8Array(signature);
}

// EC2's query protocol flattens a list of scalars as `Key.1`, `Key.2`, ... and a
// list of structures (here, just `Tag`) as `Key.1.SubKey`, `Key.2.SubKey`, ...
// — the only two shapes `vpc-wizard.js` ever sends.
function encodeBody(action, params) {
  const body = new URLSearchParams();
  body.set("Action", action);
  body.set("Version", API_VERSION);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (!Array.isArray(value)) {
      body.set(key, String(value));
      continue;
    }
    value.forEach((item, index) => {
      if (item !== null && typeof item === "object") {
        for (const [subKey, subValue] of Object.entries(item)) {
          body.set(`${key}.${index + 1}.${subKey}`, String(subValue));
        }
      } else {
        body.set(`${key}.${index + 1}`, String(item));
      }
    });
  }
  return body.toString();
}

function textOf(doc, tagName) {
  return doc.getElementsByTagName(tagName)[0]?.textContent ?? undefined;
}

/**
 * Sends one SigV4-signed EC2 query-protocol action and returns its parsed XML
 * response. Throws [`Ec2Error`] (the EC2 error `Code`/`Message` pair, read out
 * of the error response's own XML) on anything other than HTTP 200.
 */
export async function ec2Call(action, params = {}) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const body = encodeBody(action, params);
  const host = new URL(ENDPOINT).host;

  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalHeaders = `content-type:application/x-www-form-urlencoded; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${await sha256Hex(body)}`;
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

  const kDate = await hmac(new TextEncoder().encode(`AWS4${SECRET_ACCESS_KEY}`), dateStamp);
  const kRegion = await hmac(kDate, REGION);
  const kService = await hmac(kRegion, SERVICE);
  const kSigning = await hmac(kService, "aws4_request");
  const signature = toHex(await hmac(kSigning, stringToSign));

  // `host` is a forbidden header name for `fetch` to set itself — it's signed
  // above from the URL's own host (which is what the browser actually sends),
  // never passed here.
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=utf-8",
      "x-amz-date": amzDate,
      authorization: `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, "text/xml");
  if (!response.ok) {
    throw new Ec2Error(textOf(doc, "Code") ?? `Http${response.status}`, textOf(doc, "Message") ?? text);
  }
  return doc;
}

export { textOf };
