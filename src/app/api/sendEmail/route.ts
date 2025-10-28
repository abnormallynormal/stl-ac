// src/app/api/sendEmail/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    if (!to || !subject || !text) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail SMTP and your App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // your Gmail address
        pass: process.env.EMAIL_PASS,  // 16-char App Password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"STL Data Management" <${process.env.EMAIL_USER}>`, // sender
      to,        // recipient
      subject,   // subject
      text,      // plain text message
      // html: "<p>Hello!</p>" // optional HTML version
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
