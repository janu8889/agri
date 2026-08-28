export function contractCompany(contract = {}) {
  contract = contract || {};
  const templateCompany = contract.templateSnapshot?.company || {};
  const seller = contract.seller || {};
  const value = (key) => Object.prototype.hasOwnProperty.call(seller, key)
    ? String(seller[key] ?? "")
    : String(templateCompany[key] ?? "");

  const email = value("email");

  return {
    name: value("name"),
    legalName: value("legalName"),
    address: value("address"),
    cityStateZip: value("cityStateZip"),
    phone: value("phone"),
    email,
    website: websiteFromEmail(email) || String(templateCompany.website ?? ""),
  };
}

export function websiteFromEmail(email = "") {
  const match = String(email).trim().match(/^[^@\s]+@([^@\s]+)$/);
  if (!match) return "";

  const domain = match[1].replace(/^www\./i, "").toLowerCase();
  return domain.includes(".") ? `www.${domain}` : "";
}

export function contractSellerDisplayName(contract = {}, fallback = "the seller") {
  return contractCompany(contract).name.trim() || fallback;
}
