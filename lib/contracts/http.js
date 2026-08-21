import { NextResponse } from "next/server";
import { sanitizeText, safePlainObject, calculateTotal, validateRequiredContract } from "./security";

const buckets = global.contractRateBuckets || (global.contractRateBuckets = new Map());
export function rateLimited(key, limit = 30, windowMs = 60_000) {
  const now = Date.now(); const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now); buckets.set(key, recent); return recent.length > limit;
}
export function clientIp(request) { return (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim().slice(0, 64); }
export function publicHeaders(response) {
  response.headers.set("Cache-Control", "no-store, private"); response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive"); response.headers.set("Referrer-Policy", "no-referrer"); return response;
}
export function validMutationOrigin(request) {
  const origin = request.headers.get("origin"); const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}
export function jsonError(message, status = 400) { return NextResponse.json({ error: message }, { status }); }
export function cleanContractInput(raw) {
  const value = safePlainObject(raw); const text = (v, max) => sanitizeText(v, max);
  const buyer = safePlainObject(value.buyer), equipment = safePlainObject(value.equipment), seller = safePlainObject(value.seller), pricing = safePlainObject(value.pricing), warranty = safePlainObject(value.warranty), checks = safePlainObject(value.deliveryChecks);
  const subtotal = Number(pricing.subtotal || 0), taxes = Number(pricing.taxes || 0), shipping = Number(pricing.shipping || 0);
  const calculated = calculateTotal(subtotal, taxes, shipping); const override = pricing.totalOverridden === true;
  return {
    orderNumber: text(value.orderNumber, 100), orderDate: value.orderDate || null, deliveryDate: value.deliveryDate || null,
    buyer: { name: text(buyer.name, 200), company: text(buyer.company, 200), address: text(buyer.address, 300), cityStateZip: text(buyer.cityStateZip, 200), phonePrimary: text(buyer.phonePrimary, 50), phoneSecondary: text(buyer.phoneSecondary, 50), email: text(buyer.email, 254).toLowerCase(), contact: text(buyer.contact, 200) },
    deliveryAddress: text(value.deliveryAddress, 500),
    equipment: { make: text(equipment.make, 100), model: text(equipment.model, 100), year: text(equipment.year, 20), serialNumber: text(equipment.serialNumber, 100), hours: text(equipment.hours, 30), description: text(equipment.description, 3000), images: Array.isArray(equipment.images) ? equipment.images.slice(0, 10).map((x) => text(x, 500)).filter((x) => /^https:\/\//.test(x)) : [] },
    pricing: { subtotal, taxes, shipping, total: override ? Number(pricing.total) : calculated, currency: /^[A-Z]{3}$/.test(pricing.currency) ? pricing.currency : "USD", totalOverridden: override },
    seller: { name: text(seller.name, 200), legalName: text(seller.legalName, 300), address: text(seller.address, 300), cityStateZip: text(seller.cityStateZip, 200), phone: text(seller.phone, 50), email: text(seller.email, 254), representativeName: text(seller.representativeName, 200) },
    deliveryChecks: Object.fromEntries(["deliveryCompleted", "buyerInspected", "manualsGiven", "safetyExplained", "maintenanceExplained"].map((k) => [k, checks[k] === true])),
    warranty: { type: text(warranty.type, 100), text: text(warranty.text, 3000), expiresAt: warranty.expiresAt || null, manufacturer: warranty.manufacturer === true, trial: warranty.trial === true, other: warranty.other === true },
    linkExpiresAt: value.linkExpiresAt || null,
  };
}
export function validateContractInput(value) {
  const errors = validateRequiredContract(value);
  for (const key of ["subtotal", "taxes", "shipping", "total"]) if (!Number.isFinite(value.pricing[key]) || value.pricing[key] < 0) errors.push(`${key} must be a non-negative number.`);
  return errors;
}
