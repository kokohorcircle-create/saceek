import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Broadcast } from "@/models/Broadcast";

const ALLOWED_ADMINS = [
  "ikennaibenemee@gmail.com",
  "contact@boringthinkers.com",
  "bensonogholi@gmail.com",
  "okwunkwa29@gmail.com",
];

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
  return Boolean(cleanEmail && ALLOWED_ADMINS.includes(cleanEmail));
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isAdminQuery = searchParams.get("admin") === "true";
    const isAdmin = await validateAdmin(request);

    // If an admin fetch is requested, validate permissions
    if (isAdminQuery && !isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let filter = {};

    // Public view: filter by active status and expiry date
    if (!isAdminQuery && !isAdmin) {
      const now = new Date();
      filter = {
        is_active: true,
        $or: [{ ends_at: null }, { ends_at: { $gt: now } }],
      };
    }

    const broadcasts = await Broadcast.find(filter)
      .sort({ created_at: -1 })
      .lean();

    const formatted = broadcasts.map((b: any) => ({
      id: b._id.toString(),
      title: b.title || "",
      body: b.body || "",
      intensity: b.intensity || "mild",
      cta_label: b.cta_label || null,
      cta_url: b.cta_url || null,
      is_active: Boolean(b.is_active),
      ends_at: b.ends_at ? new Date(b.ends_at).toISOString() : null,
      created_at: b.created_at
        ? new Date(b.created_at).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, broadcasts: formatted });
  } catch (error) {
    console.error("[API /api/broadcasts] GET Error:", error);
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await validateAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const bodyData = await request.json();
    const { title, body, intensity, cta_label, cta_url, ends_at } = bodyData;

    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and body are required" },
        { status: 400 }
      );
    }

    const newBroadcast = await Broadcast.create({
      title: title.trim(),
      body: body.trim(),
      intensity: intensity || "mild",
      cta_label: cta_label || null,
      cta_url: cta_url || null,
      is_active: true,
      ends_at: ends_at ? new Date(ends_at) : null,
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      broadcast: {
        id: newBroadcast._id.toString(),
        title: newBroadcast.title,
        body: newBroadcast.body,
        intensity: newBroadcast.intensity,
        cta_label: newBroadcast.cta_label,
        cta_url: newBroadcast.cta_url,
        is_active: newBroadcast.is_active,
        ends_at: newBroadcast.ends_at
          ? new Date(newBroadcast.ends_at).toISOString()
          : null,
        created_at: newBroadcast.created_at
          ? new Date(newBroadcast.created_at).toISOString()
          : new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[API /api/admin/broadcasts] POST Error:", error);
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}