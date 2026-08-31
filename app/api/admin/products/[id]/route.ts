import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { uploadToBackblaze } from "@/lib/b2";
import QRCode from "qrcode";

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

// GET: Fetch all products with guaranteed slug fallback
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ created_at: -1 }).lean();

    const formattedProducts = products.map((p: any) => {
      // Fallback slug generation if missing in legacy records
      const fallbackSlug = p.name
        ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + p._id.toString().slice(-4)
        : p._id.toString();

      return {
        id: p._id.toString(),
        name: p.name || "",
        slug: p.slug || fallbackSlug,
        description: p.description || "",
        price: p.price || 0,
        image_url: p.image_url || "",
        stock: p.stock || 0,
        scancode_url: p.scancode_url || "",
        created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    const msg = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Create product with slug
export async function POST(request: Request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToBackblaze(buffer, imageFile.name, "products");
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const productUrl = `${baseUrl}/products/${slug}`;

    const qrCodeDataUrl = await QRCode.toDataURL(productUrl);
    const qrBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
    const scancodeUrl = await uploadToBackblaze(qrBuffer, `${slug}-qrcode.png`, "scancodes");

    const newProduct = await Product.create({
      name,
      slug,
      description: description || "",
      price: Number(price),
      image_url: imageUrl,
      stock: Number(stock) || 0,
      scancode_url: scancodeUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully with scancode",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    const msg = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}