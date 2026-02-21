// /pages/api/products/filter.js
import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET(req) {
  await dbConnect();

  try {
    const { search, category, manufacturer, yearMin, yearMax, priceMin, priceMax, hoursMin, hoursMax, hpMin, hpMax, sort, limit = 6, skip = 0 } = Object.fromEntries(new URL(req.url).searchParams);

    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) {
      query.category = category;
    }

    if (manufacturer) query.manufacturer = manufacturer;
    if (yearMin || yearMax) {
      query.year = {};
      if (yearMin) query.year.$gte = Number(yearMin);
      if (yearMax) query.year.$lte = Number(yearMax);
    }
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }
    if (hoursMin || hoursMax) {
      query.hours = {};
      if (hoursMin) query.hours.$gte = Number(hoursMin);
      if (hoursMax) query.hours.$lte = Number(hoursMax);
    }
    if (hpMin || hpMax) {
      query.engineHorsepower = {};
      if (hpMin) query.engineHorsepower.$gte = Number(hpMin);
      if (hpMax) query.engineHorsepower.$lte = Number(hpMax);
    }

    let mongoQuery = Product.find(query).skip(Number(skip)).limit(Math.min(Number(limit), 6));

    if (sort === "priceAsc") mongoQuery = mongoQuery.sort({ price: 1 });
    if (sort === "priceDesc") mongoQuery = mongoQuery.sort({ price: -1 });
    if (sort === "yearAsc") mongoQuery = mongoQuery.sort({ year: 1 });
    if (sort === "yearDesc") mongoQuery = mongoQuery.sort({ year: -1 });

    const products = await mongoQuery.exec();

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}