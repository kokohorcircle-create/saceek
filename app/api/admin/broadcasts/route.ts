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

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") || "")];
    })
  );
  return cookies[name] || null;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isAdminQuery = searchParams.get("admin") === "true";
    const isAdmin = await validateAdmin(request);

    if (isAdminQuery && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let filter = {};

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
    console.error("[API /api/admin/broadcasts] GET Error:", error);
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await validateAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
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
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ────────────────────── PATCH (Toggle) – ID from cookie only ──────────────
export async function PATCH(request: Request) {
  if (!(await validateAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const id = getCookie(request, "admin_broadcast_id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing broadcast ID in cookie" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const isActive = Boolean(body.is_active);

    const updated = await Broadcast.findByIdAndUpdate(
      id,
      { $set: { is_active: isActive } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Broadcast not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      broadcast: {
        id: (updated as any)._id.toString(),
        is_active: Boolean((updated as any).is_active),
      },
    });
  } catch (error) {
    console.error("[API /api/admin/broadcasts] PATCH Error:", error);
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ────────────────────── DELETE – ID from cookie only ──────────────────────
export async function DELETE(request: Request) {
  if (!(await validateAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const id = getCookie(request, "admin_broadcast_delete_id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing broadcast ID in cookie" },
        { status: 400 }
      );
    }

    const deleted = await Broadcast.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Broadcast not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /api/admin/broadcasts] DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}