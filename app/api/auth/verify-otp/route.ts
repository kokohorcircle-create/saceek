import { NextResponse } from "next/server";
import { globalOtpStore } from "../send-otp/route";

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();
        const cleanEmail = email?.toLowerCase().trim();

        const record = globalOtpStore.get(cleanEmail);

        if (!record || record.otp !== otp || Date.now() > record.expires) {
            return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
        }

        // Clear OTP after successful use
        globalOtpStore.delete(cleanEmail);

        // Return the token/session data in JSON so the client can save it to localStorage
        return NextResponse.json({ 
            success: true, 
            message: "Verified",
            session: {
                email: cleanEmail
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
    }
}