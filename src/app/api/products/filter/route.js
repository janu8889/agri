// /pages/api/products/filter.js
import dbConnect from "../../../../../lib/dbConnect";
import Product from "../../../../../models/product";

export async function GET(req) {
  await dbConnect();

  try {
    const {
      search,
      category,
      manufacturer,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      hoursMin,
      hoursMax,
      hpMin,
      hpMax,
      sort,
      limit = 6,
      skip = 0,
      initial
    } = Object.fromEntries(new URL(req.url).searchParams);

    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
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

    // 🔥 SORT CONFIG (CORECT)
    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption.price = 1;
        break;
      case "priceHigh":
        sortOption.price = -1;
        break;
      case "hoursLow":
        sortOption.hours = 1;
        break;
      case "hoursHigh":
        sortOption.hours = -1;
        break;
      case "yearNew":
        sortOption.year = -1;
        break;
      case "yearOld":
        sortOption.year = 1;
        break;
      default:
        break;
    }

    let products;

    if (initial == 1) {
      // 🔥 RANDOM (NU sortăm aici)
      products = await Product.aggregate([
        { $match: query },
        { $sample: { size: Math.min(Number(limit), 6) } },
        {
          $project: {
            name: 1,
            price: 1,
            hours: 1,
            engineHorsepower: 1,
            category: 1,
            manufacturer: 1,
            _id: 1,
            imgs: { $slice: ["$imgs", 1] }
          }
        }
      ]);
    } else {
      // 🔥 SORT + PAGINATION (CORECT)
      products = await Product.find(query)
        .sort(sortOption) // 🔥 AICI E TOT
        .skip(Number(skip))
        .limit(Math.min(Number(limit), 6))
        .select({
          name: 1,
          price: 1,
          hours: 1,
          engineHorsepower: 1,
          category: 1,
          manufacturer: 1,
          _id: 1,
          imgs: { $slice: 1 }
        });
    }

    return new Response(JSON.stringify({ products }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}