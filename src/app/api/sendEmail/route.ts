import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 📩 Incoming /api/sendEmail request`);

  try {
    const { to, subject, text } = await req.json();

    // Validate request body
    if (!to || !subject || !text) {
      console.warn("⚠️ Missing one or more required fields", { to, subject, text });
      return NextResponse.json(
        { success: false, error: "Missing required fields (to, subject, text)" },
        { status: 400 }
      );
    }

    // Check environment variables
    const emailUserPresent = !!process.env.EMAIL_USER;
    const emailPassPresent = !!process.env.EMAIL_PASS;

    if (!emailUserPresent || !emailPassPresent) {
      console.error("❌ Missing EMAIL_USER or EMAIL_PASS environment variable", {
        emailUserPresent,
        emailPassPresent,
      });
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: missing email credentials" },
        { status: 500 }
      );
    }
//   console.log("📬 Checking environment variables...");
//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log(
//     "EMAIL_PASS length:",
//   process.env.EMAIL_PASS ? process.env.EMAIL_PASS : "undefined"
// );

    console.log("✅ Environment variables loaded correctly");

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
      console.log("🔌 Verifying SMTP connection...");
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError);
      return NextResponse.json(
        { success: false, error: "SMTP verification failed", details: (verifyError as Error).message },
        { status: 500 }
      );
    }

    // Send the email
    console.log(`🚀 Sending email to ${to} with subject "${subject}"...`);
    const info = await transporter.sendMail({
      from: `"STL Data Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📨 Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
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
