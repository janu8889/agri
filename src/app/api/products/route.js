import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/product";
import { NextResponse } from "next/server";

function normalizeNumber(value) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function POST(request) {
  try {
    const body = await request.json(); // body mic, doar URLs
    await dbConnect();

    const product = await Product.create({
      name: body.name?.trim(),
      category: body.category,
      price: normalizeNumber(body.price),
      year: normalizeNumber(body.year),
      manufacturer: body.manufacturer?.trim(),
      model: body.model?.trim(),
      condition: body.condition || "Used",
      hours: body.hours,
      description: body.description || "",
      fuel: body.fuel || "",
      loader: body.loader || "",
      backhoe: body.backhoe || "",
      cab: body.cab || "",
      engineHorsepower: body.engineHorsepower,
      drive: body.drive || "",
      transmissionType: body.transmissionType || "",
      stockNumber: body.stockNumber,
      imgs: Array.isArray(body.imgs) ? body.imgs : [],
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("Eroare server:", err);
    return NextResponse.json({ error: "Eroare la crearea produsului." }, { status: 500 });
  }
}