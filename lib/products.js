import dbConnect from "./dbConnect";

export async function getAllProducts() {
  // exemplu MongoDB
  const client = await dbConnect();

  const db = client.db();
  const products = await db.collection("products").find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();
  client.close();
  return products.map(p => ({ id: p._id.toString(), updatedAt: p.updatedAt }));
}