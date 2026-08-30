import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs"; // run npm install bcryptjs @types/bcryptjs

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
        }

        const response = NextResponse.json({ success: true, message: "Logged in" });
        response.cookies.set("admin_session", user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}