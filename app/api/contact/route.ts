import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { name, phone, email, inquiryType, message } = body;

        if (!name || !phone || !message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newEntry = await ContactMessage.create({
            name,
            phone,
            email,
            inquiryType,
            message,
        });

        return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}