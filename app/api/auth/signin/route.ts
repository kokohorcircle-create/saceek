import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs"; 

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
        }

        // Return the session/user ID in JSON so the client can save it to localStorage
        return NextResponse.json({ 
            success: true, 
            message: "Logged in",
            session: {
                userId: user._id.toString(),
                email: user.email
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}