import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    // Validate request body
    if (!to || !subject || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (to, subject, text)" },
        { status: 400 }
      );
    }

    // Check environment variables
    const emailUserPresent = !!process.env.EMAIL_USER;
    const emailPassPresent = !!process.env.EMAIL_PASS;

    if (!emailUserPresent || !emailPassPresent) {
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: missing email credentials" },
        { status: 500 }
      );
    }

    // Create transporter with verbose logging
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,  // log internal messages
      debug: true,   // show SMTP conversation in logs
    });

    // Verify SMTP connection before sending
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError);
      return NextResponse.json(
        { success: false, error: "SMTP verification failed", details: (verifyError as Error).message },
        { status: 500 }
      );
    }

    // Send the email
    const info = await transporter.sendMail({
      from: `"STL Data Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
    });

  } catch (error: any) {
    // Capture the full error context
    console.error("❌ Nodemailer route error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        name: error.name,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
