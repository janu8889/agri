export const TYPED_CONSENT_TEXT = "I adopt the typed name above as my electronic signature and confirm that I intend to sign this agreement electronically.";
export const TERMS_CONSENT_TEXT = "I have read and agree to the Terms & Conditions and consent to the use of my electronic signature.";

export function strokesToSvgPaths(strokes = [], width = 300, height = 80) {
  return strokes.filter((s) => Array.isArray(s) && s.length > 1).map((stroke) => stroke.map(([x, y], i) => `${i ? "L" : "M"}${round(x * width)} ${round(y * height)}`).join(" "));
}
export function signatureLabel(method) { return method === "drawn" ? "Drawn signature" : method === "typed_consent" ? "Typed consent" : "Not signed"; }
function round(n) { return Math.round(n * 100) / 100; }
