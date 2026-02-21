import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET() {
  try {
    await dbConnect();

    // Folosim aggregate + $sample ca să luăm 6 produse random
    const products = await Product.aggregate([
    { $sample: { size: 6 } },
    {
        $project: {
        name: 1,
        price: 1,
        hours: 1,
        engineHorsepower: 1,
        category: 1,
        manufacturer: 1,
        _id: 1,
        imgs: { $slice: ["$imgs", 1] } // doar prima imagine
        }
    }
    ]);
    
    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Could not fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}