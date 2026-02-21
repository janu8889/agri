import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET(req) {
  await dbConnect();
    console.log("muieeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    const { pathname } = new URL(req.url);

    const parts = pathname.split("/");
    const id = parts[parts.length - 2]; // penultimul segment
    console.log("ID REAL:", id);

  try {
    const product = await Product.findById(id)
console.log(product)
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch product" }), { status: 500 });
  }
}