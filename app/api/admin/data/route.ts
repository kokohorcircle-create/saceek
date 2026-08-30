import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Broadcast } from "@/models/Broadcast";
import { ContactMessage } from "@/models/ContactMessage";

const ALLOWED_ADMINS = ["ikennaibenemee@gmail.com", "contact@boringthinkers.com", "bensonogholi@gmail.com", "okwunkwa29@gmail.com"];

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;

    if (!sessionCookie || !ALLOWED_ADMINS.includes(sessionCookie.toLowerCase())) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const broadcasts = await Broadcast.find({}).sort({ created_at: -1 }).lean();
        const enquiries = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

        // Format fields to match frontend types safely
        const formattedBroadcasts = broadcasts.map((b: any) => ({
            id: b._id.toString(),
            title: b.title,
            body: b.body,
            intensity: b.intensity,
            cta_label: b.cta_label || null,
            cta_url: b.cta_url || null,
            is_active: b.is_active,
            ends_at: b.ends_at ? b.ends_at.toISOString() : null,
            created_at: b.created_at ? new Date(b.created_at).toISOString() : new Date().toISOString(),
        }));

        const formattedEnquiries = enquiries.map((e: any) => ({
            id: e._id.toString(),
            full_name: e.name,
            email: e.email || "",
            phone: e.phone,
            subject: e.subject || "Enquiry",
            enquiry_type: e.inquiryType,
            message: e.message,
            is_read: e.is_read || false,
            created_at: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
        }));

        return NextResponse.json({
            success: true,
            broadcasts: formattedBroadcasts,
            enquiries: formattedEnquiries,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}