const CONTENT_FIELDS = [
  "orderNumber",
  "orderDate",
  "deliveryDate",
  "buyer",
  "deliveryAddress",
  "equipment",
  "equipmentItems",
  "pricing",
  "seller",
  "deliveryChecks",
  "warranty",
  "templateSnapshot",
  "templateVersion",
  "linkTemplate",
];

// A duplicate is a content starting point, never a copy of signing/link state.
// Keeping an allow-list also prevents future lifecycle fields from leaking into
// duplicates when the Contract schema grows.
export function contractDuplicateData(source = {}) {
  const duplicate = {};
  for (const field of CONTENT_FIELDS) {
    if (source[field] !== undefined) duplicate[field] = structuredClone(source[field]);
  }
  duplicate.status = "draft";
  return duplicate;
}
