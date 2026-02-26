// src/app/api/buy-now/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
    const chatId = '892718536';

    const body = await req.json();
    const {
      machine,
      billingStreet,
      billingCity,
      billingState,
      shippingStreet,
      shippingCity,
      shippingState,
      name,
      email,
      phone
    } = body;

    if (
      !machine || !billingStreet || !billingCity || !billingState ||
      !shippingStreet || !shippingCity || !shippingState || !email
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = `
BUY NOW
machine: ${machine}
billingStreet: ${billingStreet}
billingCity: ${billingCity}
billingState: ${billingState}
shippingStreet: ${shippingStreet}
shippingCity: ${shippingCity}
shippingState: ${shippingState}
name: ${name}
email: ${email}
phone: ${phone}
`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const data = await tgRes.json();

    return NextResponse.json({ ok: true, telegram: data });

  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}