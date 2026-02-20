import dbConnect from "../../../../lib/dbConnect";
import Product from "@/models/product";
import { NextResponse } from "next/server";

const validCategories = ["agri", "construction", "attachments"];
const validConditions = ["New", "Used"];

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const productData = {
      name: body?.name?.trim(),
      category: body?.category,
      price: normalizeNumber(body?.price),
      year: normalizeNumber(body?.year),
      manufacturer: body?.manufacturer?.trim(),
      model: body?.model?.trim(),
      condition: body?.condition || "Used",
      hours: normalizeNumber(body?.hours),
      description: body?.description?.trim() || "",
      loader: body?.loader?.trim() || "",
      backhoe: body?.backhoe?.trim() || "",
      cab: body?.cab?.trim() || "",
      engineHorsepower: normalizeNumber(body?.engineHorsepower),
      drive: body?.drive?.trim() || "",
      transmissionType: body?.transmissionType?.trim() || "",
      stockNumber: normalizeNumber(body?.stockNumber),
      imgs: Array.isArray(body?.imgs)
        ? body.imgs.map((img) => String(img).trim()).filter(Boolean)
        : [],
    };

    const missingFields = ["name", "manufacturer", "model"].filter((key) => !productData[key]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Câmpuri obligatorii lipsă: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!validCategories.includes(productData.category)) {
      return NextResponse.json({ error: "Category invalid." }, { status: 400 });
    }

    if (!validConditions.includes(productData.condition)) {
      return NextResponse.json({ error: "Condition invalid." }, { status: 400 });
    }

    if (!Number.isFinite(productData.price) || !Number.isFinite(productData.year)) {
      return NextResponse.json({ error: "Price și year trebuie să fie numere valide." }, { status: 400 });
    }

    if (Number.isNaN(productData.hours)) {
      return NextResponse.json({ error: "Hours trebuie să fie număr valid." }, { status: 400 });
    }

    if (Number.isNaN(productData.engineHorsepower)) {
      return NextResponse.json({ error: "Engine Horsepower trebuie să fie număr valid." }, { status: 400 });
    }

    if (Number.isNaN(productData.stockNumber)) {
      return NextResponse.json({ error: "Stock Number trebuie să fie număr valid." }, { status: 400 });
    }

    Object.keys(productData).forEach((key) => {
      if (productData[key] === undefined) delete productData[key];
    });

    await dbConnect();
    const product = await Product.create(productData);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "Stock Number există deja. Alege alt număr sau lasă gol pentru generare automată." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Eroare server la crearea produsului." }, { status: 500 });
  }
}
