import crypto from "node:crypto";

export function sanitizeText(value, max = 20000) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/<\/?(?:script|iframe|object|embed|style)[^>]*>/gi, "").slice(0, max).trim();
}

export function generatePublicToken() { return crypto.randomBytes(32).toString("base64url"); }
export function hashToken(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
export function timingSafeTokenMatch(token, expectedHash) {
  const actual = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(String(expectedHash || ""), "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
export function stableHash(value) { return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
export function money(value) { const n = Number(value || 0); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0; }
export function calculateTotal(subtotal, taxes, shipping) { return money(money(subtotal) + money(taxes) + money(shipping)); }
export function safePlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => !key.startsWith("$") && !key.includes(".")));
}
export function validateRequiredContract(value) {
  const errors = [];
  if (!value?.orderNumber) errors.push("Order number is required.");
  if (!value?.buyer?.name) errors.push("Buyer name is required.");
  if (!/^\S+@\S+\.\S+$/.test(value?.buyer?.email || "")) errors.push("A valid buyer email is required.");
  if (!value?.equipment?.model) errors.push("Equipment model is required.");
  return errors;
}

export function validateSignature(signature) {
  if (!Array.isArray(signature) || signature.length < 1 || signature.length > 24) return false;
  let points = 0;
  return signature.every((stroke) => Array.isArray(stroke) && stroke.length >= 2 && stroke.length <= 500 && stroke.every((p) => {
    points += 1;
    return points <= 2500 && Array.isArray(p) && p.length === 2 && p.every((n) => Number.isFinite(n) && n >= 0 && n <= 1);
  }));
}

export function normalizeEmail(email) { return sanitizeText(email, 254).trim().toLowerCase(); }
export function signatureMethod(contract) { return contract?.signatureMethod || (contract?.signature?.length ? "drawn" : contract?.signedAt ? "typed_consent" : null); }
export function signingIntegrityPayload(contract) {
  return { snapshotHash: contract.snapshotHash, signerName: contract.signerName, signedAt: contract.signedAt instanceof Date ? contract.signedAt.toISOString() : contract.signedAt, signatureMethod: signatureMethod(contract), signature: contract.signature || null, typedSignatureConsent: contract.typedSignatureConsent === true, signatureConsentText: contract.signatureConsentText || "", signatureConsentVersion: contract.signatureConsentVersion || 1 };
}
export function validateSigningRequest(body) {
  const method = body?.signatureMethod === "typed_consent" ? "typed_consent" : "drawn";
  if (sanitizeText(body?.signerName, 200).length < 2 || body?.acceptedTerms !== true) return { ok: false, method, error: "Full legal name and acceptance of the terms are required." };
  if (body?.typedSignatureConsent !== true) return { ok: false, method, error: "Electronic-signature confirmation is required." };
  if (method === "drawn" && body?.reuseSavedSignature !== true && !validateSignature(body?.signature)) return { ok: false, method, error: "A valid drawn signature is required." };
  return { ok: true, method };
}
