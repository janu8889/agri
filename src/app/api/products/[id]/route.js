import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params; // 👈 AICI e diferența

  console.log("ID:", id);

  try {
    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}