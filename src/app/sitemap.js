// agri/src/app/sitemap.js
import dbConnect from "../../lib/dbConnect";
import Product from "../../models/product";

export default async function sitemap() {
  await dbConnect();

  // fetch produse
  const products = await Product.find({}, { _id: 1, updatedAt: 1 }).lean();

  const staticPages = [
    { url: "https://robinson-equipment.com/", lastModified: new Date() },
    { url: "https://robinson-equipment.com/about", lastModified: new Date() },
    { url: "https://robinson-equipment.com/shipping", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/agriculture", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/construction", lastModified: new Date() },
    { url: "https://robinson-equipment.com/inventory/attachments", lastModified: new Date() },
  ];

  const productPages = products.map((p) => ({
    url: `https://robinson-equipment.com/products/${p._id.toString()}`,
    lastModified: p.updatedAt || new Date(),
  }));

  return [...staticPages, ...productPages];
}