// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const {
//       fullName,
//       productName,
//       email,
//       phone,
//       message,
//     } = await req.json();

//     // Validare required
//     if (
//       !fullName ||
//       !email ||
//       !phone) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const token = '7594221274:AAHhvlVReiGLUAbAhePSW6cq0CEW6_5i80s';
//     const chatId = '-5263521263';

//     const text = `
// NEW PRODUCT INQUIRY

// Product: ${productName}

// fullName ${fullName}
// phone: ${phone}
// email: ${email}
// message: ${message}
// `;

//     await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         chat_id: chatId,
//         text,
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import nodemailer from "nodemailer";



export async function POST(req) {
  try {
    const { fullName, productName, email, phone, message } =
      await req.json();

    // Validare required
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const text = `
NEW PRODUCT INQUIRY

Product: ${productName || "-"}

Full Name: ${fullName}
Phone: ${phone}
Email: ${email}
Message: ${message || "-"}
`;

    // =========================
    // EMAIL SETUP (GMAIL)
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "messaging.4006218@gmail.com",
        pass: "zxkm fosn zsts hbji",
      },
    });

    await transporter.sendMail({
      from: `messaging.4006218@gmail.com`,
      to: "sales@cashman-machinery.com", // unde vrei să primești mailul
      subject: "🛒 New Product Inquiry",
      text,
    });

    return NextResponse.json({ ok: true, email: "sent" });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}