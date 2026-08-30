import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email: email.toLowerCase(), passwordHash });

        const response = NextResponse.json({ success: true, message: "Account created" }, { status: 201 });
        response.cookies.set("admin_session", newUser._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}