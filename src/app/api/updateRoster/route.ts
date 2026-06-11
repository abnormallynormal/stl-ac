import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Rate limiting configuration
const EMAILS_PER_SECOND = 2; // Gmail allows ~2 emails/second
const DELAY_BETWEEN_EMAILS = 1000 / EMAILS_PER_SECOND; // ~500ms
const BATCH_SIZE = 10; // Send in batches to avoid overwhelming the server
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to send email to a single recipient
async function sendSingleEmail(
  transporter: nodemailer.Transporter,
  recipient: string,
  subject: string,
  text: string,
  html?: string,
  senderEmail?: string
) {
  const mailOptions = {
    from: `"STL-AC" <${senderEmail || process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    // Validate request body
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { success: false, error: "'to' must be a non-empty array of email addresses" },
        { status: 400 }
      );
    }

    if (!subject || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (subject, text)" },
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

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true, // Use pooled connections for better performance
      maxConnections: 5, // Limit concurrent connections
      rateDelta: 1000, // Time window for rate limiting (1 second)
      rateLimit: 2, // Max emails per rateDelta
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError);
      return NextResponse.json(
        { success: false, error: "SMTP verification failed", details: (verifyError as Error).message },
        { status: 500 }
      );
    }

    // Track results
    const results = {
      successful: [] as string[],
      failed: [] as { email: string; error: string }[],
    };

    // Process emails in batches with rate limiting
    for (let i = 0; i < to.length; i += BATCH_SIZE) {
      const batch = to.slice(i, i + BATCH_SIZE);

      // Send emails in current batch with individual delays
      for (let j = 0; j < batch.length; j++) {
        const email = batch[j];
        
        try {
          await sendSingleEmail(
            transporter,
            email,
            subject,
            text,
            html,
            process.env.EMAIL_USER
          );
          
          results.successful.push(email);

          // Add delay between individual emails (except for the last email in the last batch)
          if (i + j < to.length - 1) {
            await delay(DELAY_BETWEEN_EMAILS);
          }
        } catch (error: any) {
          results.failed.push({
            email,
            error: error.message || "Unknown error",
          });
          console.error(`❌ Failed to send to ${email}:`, error.message);
        }
      }

      // Add delay between batches (except after the last batch)
      if (i + BATCH_SIZE < to.length) {
        await delay(DELAY_BETWEEN_BATCHES);
      }
    }

    // Close the transporter
    transporter.close();

    const summary = {
      total: to.length,
      successful: results.successful.length,
      failed: results.failed.length,
    };

    return NextResponse.json({
      success: true,
      summary,
      results,
    });

  } catch (error: any) {
    console.error("❌ Bulk email route error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
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