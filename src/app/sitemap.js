// agri/src/app/sitemap.js
import { getAllProducts } from "../../lib/products";

export default async function sitemap() {
  // URL-uri statice
  const staticUrls = [
    { url: "https://robinson-equipment.com/", lastModified: new Date() },
    { url: "https://robinson-equipment.com/about", lastModified: new Date() },
    { url: "https://robinson-equipment.com/shipping", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/agriculture", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/construction", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/attachments", lastModified: new Date() },
  ];

  // URL-uri dinamice pentru produse
  const products = await getAllProducts();
  const productUrls = products.map((p) => ({
    url: `https://robinson-equipment.com/products/${p.id}`,
    lastModified: new Date(p.updatedAt),
  }));

  // Combina static + dynamic
  return [...staticUrls, ...productUrls];
}