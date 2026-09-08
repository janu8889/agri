// import { NextResponse } from "next/server";
// import { TbTeapot } from "react-icons/tb";

// export async function POST(req) {
//   try {
//     const {
//       fullName,
//       productName,
//       email,
//       phone,
//       message,
//     } = await req.json();

//     if (!fullName || !email  || !phone) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }


    
//     const text = `
// Fill media REQUEST

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

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const text = `
FILL MEDIA REQUEST

Product: ${productName || "-"}

Full Name: ${fullName}
Phone: ${phone}
Email: ${email}
Message: ${message || "-"}
`;

    // =========================
    // GMAIL TRANSPORT
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "🎬 New Media Request",
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