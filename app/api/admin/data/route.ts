import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";

const ALLOWED_ADMINS = [
  "ikennaibenemee@gmail.com",
  "contact@boringthinkers.com",
  "bensonogholi@gmail.com",
  "okwunkwa29@gmail.com",
];

// Helper to validate admin headers
async function validateAdmin(request: Request) {
  const sessionHeader = request.headers.get("x-admin-email");
  let cleanEmail = "";

  if (sessionHeader) {
    try {
      if (sessionHeader.startsWith("{")) {
        const parsed = JSON.parse(sessionHeader);
        cleanEmail = parsed.email?.toLowerCase().trim() || "";
      } else {
        cleanEmail = sessionHeader.toLowerCase().trim();
      }
    } catch {
      cleanEmail = sessionHeader.toLowerCase().trim();
    }
  }

  console.log("[API /api/admin/data] Cleaned email for validation:", cleanEmail);
  return cleanEmail && ALLOWED_ADMINS.includes(cleanEmail);
}

export async function GET(request: Request) {
  console.log("[API /api/admin/data] GET request received.");

  if (!(await validateAdmin(request))) {
    console.warn("[API /api/admin/data] Unauthorized access attempt blocked.");
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[API /api/admin/data] Connecting to MongoDB...");
    await connectDB();

    const enquiries = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

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
      enquiries: formattedEnquiries,
    });
  } catch (error) {
    console.error("[API /api/admin/data] Database/Server Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}