import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Temporary storage for OTPs (Consider saving to MongoDB in production)
export const globalOtpStore = global.globalOtpStore || new Map<string, { otp: string; expires: number }>();
if (process.env.NODE_ENV !== "production") global.globalOtpStore = globalOtpStore;

const ALLOWED_ADMINS = ["ikennaibenemee@gmail.com", "contact@boringthinkers.com"];

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_EMAIL || "admin@boringthinkers.com",
        pass: process.env.ZOHO_APP_PASSWORD,
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

        // Send via Zoho Mail
        await transporter.sendMail({
            from: `"Saceek Admin" <${process.env.ZOHO_EMAIL || "admin@boringthinkers.com"}>`,
            to: cleanEmail,
            subject: "Your Admin Login Code",
            text: `Your admin verification code is: ${otp}. It expires in 10 minutes.`,
            html: `<div style="font-family:sans-serif;padding:20px;"><h2>Admin Verification Code</h2><p>Your secure login code is:</p><h1 style="color:#0f172a;letter-spacing:4px;">${otp}</h1><p>This code expires in 10 minutes.</p></div>`,
        });

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Zoho Email Error:", error);
        return NextResponse.json({ success: false, error: "Failed to send OTP email" }, { status: 500 });
    }
}