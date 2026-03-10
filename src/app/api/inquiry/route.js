import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      fullName,
      productName,
      email,
      phone,
      message,
      contactTime
    } = await req.json();

    // Validare required
    if (
      !fullName ||
      !email ||
      !phone || !contactTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
    const chatId = '-5263521263';

    const text = `
NEW PRODUCT INQUIRY

Product: ${productName}

fullName ${fullName}
phone: ${phone}
ContactTime: ${contactTime}
email: ${email}
message: ${message}
`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}