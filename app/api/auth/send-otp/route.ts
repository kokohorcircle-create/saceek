import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { globalOtpStore } from "@/lib/otpStore";

const ALLOWED_ADMINS = ["ikennaibenemee@gmail.com", "contact@boringthinkers.com", "bensonogholi@gmail.com", "okwunkwa29@gmail.com"];

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL || "admin@boringthinkers.com",
    pass: process.env.ZOHO_APP_PASSWORD?.replace(/\s+/g, ""),
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const cleanEmail = email?.toLowerCase().trim();

    if (!ALLOWED_ADMINS.includes(cleanEmail)) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // valid for 10 mins

    globalOtpStore.set(cleanEmail, { otp, expires });

    // Send via Zoho Mail with a beautifully styled HTML template
    await transporter.sendMail({
      from: `"Saceek International" <${process.env.ZOHO_EMAIL || "admin@boringthinkers.com"}>`,
      to: cleanEmail,
      subject: "🔒 Your Saceek Admin Verification Code",
      text: `Your Saceek admin verification code is: ${otp}. It expires in 10 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Admin Verification Code</title>
          </head>
          <body style="background-color: #f8fafc; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 30px 20px 30px; background: #0f172a;">
                  <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.025em;">Saceek International</h1>
                  <p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em; margin: 8px 0 0 0;">Admin Portal Access</p>
                </td>
              </tr>
              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <p style="color: #334155; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">Hello,</p>
                  <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 0 0 24px 0;">You requested secure access to the Saceek Admin Dashboard. Use the verification code below to complete your login:</p>
                  
                  <!-- OTP Box -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                    <tr>
                      <td align="center" style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px;">
                        <span style="font-family: monospace; font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 8px;">${otp}</span>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 24px 0 0 0;">⚠️ This code is valid for <strong>10 minutes</strong>. If you did not request this login attempt, please disregard this email.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px 30px 40px 30px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Saceek International Network Limited. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Zoho Email Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send OTP email" }, { status: 500 });
  }
}