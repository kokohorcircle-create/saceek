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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await validateAdmin(request))) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await connectDB();
        const { id } = await params; // ← important in newer Next.js
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
        console.error("[API /api/admin/broadcasts/[id]] PATCH Error:", error);
        const message = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await validateAdmin(request))) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await connectDB();
        const { id } = await params;

        const deleted = await Broadcast.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "Broadcast not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API /api/admin/broadcasts/[id]] DELETE Error:", error);
        const message = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}