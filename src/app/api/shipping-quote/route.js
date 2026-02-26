import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      productName,
      name,
      email,
      phone,
      preferredTime,
      address,
      city,
      state,
      zip,
      message,
    } = await req.json();

    if (!name || !email || !phone || !address || !preferredTime || !city || !state || !zip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
    const chatId = '892718536';
    
    const text = `
SHIPPING QUOTE REQUEST

Product: ${productName}

Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Time: ${preferredTime}

Address: ${address}
City: ${city}
State: ${state}
Zip: ${zip}

Message:
${message}
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