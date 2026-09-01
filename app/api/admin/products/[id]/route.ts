import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

const ALLOWED_ADMINS = [
    "ikennaibenemee@gmail.com",
    "contact@boringthinkers.com",
    "bensonogholi@gmail.com",
    "okwunkwa29@gmail.com",
];

function validateAdmin(request: Request) {
    const sessionHeader = request.headers.get("x-admin-email");
    let cleanEmail = "";
    if (sessionHeader) {
        try {
            const parsed = sessionHeader.startsWith("{") ? JSON.parse(sessionHeader) : { email: sessionHeader };
            cleanEmail = parsed.email?.toLowerCase().trim();
        } catch (e) {
            cleanEmail = sessionHeader.toLowerCase().trim();
        }
    }
    return cleanEmail && ALLOWED_ADMINS.includes(cleanEmail);
}

// PATCH: Update product details (name, price, stock)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!validateAdmin(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
        }

        await connectDB();
        const body = await request.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...(body.name && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.price !== undefined && { price: Number(body.price) }),
                ...(body.stock !== undefined && { stock: Number(body.stock) }),
            },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        const msg = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

// DELETE: Remove product by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!validateAdmin(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
        }

        await connectDB();

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        const msg = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}