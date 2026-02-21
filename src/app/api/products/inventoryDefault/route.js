import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "agriculture"; // default agriculture
  const limit = 6;

  try {
    const count = await Product.countDocuments({ category });
    if (count === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    const randomProducts = await Product.aggregate([
        { $match: { category } },
        { $sample: { size: limit } },
        { $project: {
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


    return new Response(JSON.stringify({ products: randomProducts }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
  }
}