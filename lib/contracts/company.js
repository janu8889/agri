export function contractCompany(contract = {}) {
  contract = contract || {};
  const templateCompany = contract.templateSnapshot?.company || {};
  const seller = contract.seller || {};
  const value = (key) => Object.prototype.hasOwnProperty.call(seller, key)
    ? String(seller[key] ?? "")
    : String(templateCompany[key] ?? "");

  return {
    name: value("name"),
    legalName: value("legalName"),
    address: value("address"),
    cityStateZip: value("cityStateZip"),
    phone: value("phone"),
    email: value("email"),
    website: String(templateCompany.website ?? ""),
  };
}

export function contractSellerDisplayName(contract = {}, fallback = "the seller") {
  return contractCompany(contract).name.trim() || fallback;
}
