import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Broadcast } from "@/models/Broadcast";
import { ContactMessage } from "@/models/ContactMessage";

const ALLOWED_ADMINS = [
  "ikennaibenemee@gmail.com",
  "contact@boringthinkers.com",
  "bensonogholi@gmail.com",
  "okwunkwa29@gmail.com",
];

export async function GET(request: Request) {
  console.log("[API /api/admin/data] GET request received.");

  const sessionHeader = request.headers.get("x-admin-email");
  console.log("[API /api/admin/data] Received x-admin-email header:", sessionHeader);

  let cleanEmail = "";
  if (sessionHeader) {
    try {
      if (sessionHeader.startsWith("{")) {
        const parsed = JSON.parse(sessionHeader);
        cleanEmail = parsed.email?.toLowerCase().trim();
      } else {
        cleanEmail = sessionHeader.toLowerCase().trim();
      }
    } catch (e) {
      cleanEmail = sessionHeader.toLowerCase().trim();
    }
  }

  console.log("[API /api/admin/data] Cleaned email for validation:", cleanEmail);

  if (!cleanEmail || !ALLOWED_ADMINS.includes(cleanEmail)) {
    console.warn("[API /api/admin/data] Unauthorized access attempt blocked.");
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[API /api/admin/data] Connecting to MongoDB...");
    await connectDB();

    const broadcasts = await Broadcast.find({}).sort({ created_at: -1 }).lean();
    const enquiries = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

    console.log(
      "[API /api/admin/data] Data fetched successfully. Broadcasts count:",
      broadcasts.length,
      "| Enquiries count:",
      enquiries.length
    );

    // Safely format broadcasts with fallbacks for missing dates
    const formattedBroadcasts = broadcasts.map((b: any) => ({
      id: b._id.toString(),
      title: b.title || "",
      body: b.body || "",
      intensity: b.intensity || "mild",
      cta_label: b.cta_label || null,
      cta_url: b.cta_url || null,
      is_active: !!b.is_active,
      ends_at: b.ends_at ? new Date(b.ends_at).toISOString() : null,
      created_at: b.created_at ? new Date(b.created_at).toISOString() : new Date().toISOString(),
    }));

    // Safely format enquiries with fallbacks for missing fields/dates
    const formattedEnquiries = enquiries.map((e: any) => ({
      id: e._id.toString(),
      full_name: e.name || "Unknown",
      email: e.email || "",
      phone: e.phone || "",
      subject: e.subject || "Enquiry",
      enquiry_type: e.inquiryType || "General",
      message: e.message || "",
      is_read: !!e.is_read,
      created_at: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      broadcasts: formattedBroadcasts,
      enquiries: formattedEnquiries,
    });
  } catch (error) {
    console.error("[API /api/admin/data] Database/Server Error:", error);
    // Expose the precise error message to the client for debugging
    const errorMessage = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}