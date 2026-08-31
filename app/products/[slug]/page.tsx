import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Button } from "@/components/ui/button";
import { QrCode, ShoppingCart, Download } from "lucide-react";
import QRCode from "qrcode";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  let product = await Product.findOne({ slug }).lean();

  let activeSlug = slug;
  if (!product) {
    const allProducts = await Product.find({}).lean();
    const found = allProducts.find((p: any) => {
      const generatedSlug =
        p.slug ||
        `${(p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${p._id.toString().slice(-4)}`;
      return generatedSlug === slug;
    });
    if (found) {
      product = found;
      activeSlug = found.slug || slug;
    } else {
      product = null;
    }
  }

  if (!product) notFound();

  // Construct absolute specific target URL for the QR code
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const productSpecificUrl = `${baseUrl}/products/${activeSlug}`;

  // Auto-generate QR code on the fly if missing from database
  let displayScancodeUrl = product.scancode_url;
  if (!displayScancodeUrl) {
    try {
      displayScancodeUrl = await QRCode.toDataURL(productSpecificUrl, {
        width: 300,
        margin: 2,
      });
    } catch (err) {
      console.error("Error generating fallback QR code:", err);
    }
  }

  return (
    <main className="container-page py-12 max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-card">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[400px] bg-muted flex items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description || "No description provided."}
          </p>

          <div className="text-sm font-medium">
            Availability:{" "}
            <span
              className={product.stock > 0 ? "text-green-600" : "text-red-500"}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <Button
            className="w-full rounded-full h-12 gap-2"
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>

          {displayScancodeUrl && (
            <div className="pt-6 border-t border-border flex items-center gap-4">
              <a
                href={displayScancodeUrl}
                target="_blank"
                rel="noreferrer"
                title="Click to view full image"
                className="shrink-0"
              >
                <img
                  src={displayScancodeUrl}
                  alt={`QR Code for ${product.name}`}
                  className="w-24 h-24 rounded-xl border p-1 bg-white transition hover:scale-105"
                />
              </a>
              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 font-semibold text-sm">
                  <QrCode className="h-4 w-4 text-primary" /> Product Scancode
                </h4>
                <p className="text-xs text-muted-foreground">
                  Scan this code to instantly open{" "}
                  <span className="font-mono text-[11px] underline">
                    {productSpecificUrl}
                  </span>{" "}
                  on any mobile device.
                </p>
                <div className="pt-1">
                  <a
                    href={displayScancodeUrl}
                    download={`${activeSlug}-qrcode.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download QR Code
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Bottom Scancode Section (Always renders with auto-generation) */}
      {/* {displayScancodeUrl && (
        <div className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
          <img
            src={displayScancodeUrl}
            alt={`Official QR Tag for ${product.name}`}
            className="w-36 h-36 rounded-2xl border-2 border-border p-2 bg-white shadow-sm shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <QrCode className="h-5 w-5 text-primary" /> Official Product
              Scancode Tag
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Scan this scancode with any smartphone camera to pull up{" "}
              <span className="font-semibold text-foreground">
                {product.name}
              </span>{" "}
              immediately. Designed for physical storefront displays, item tags,
              and inventory scanning.
            </p>
            <div className="pt-3">
              <a
                href={displayScancodeUrl}
                download={`${activeSlug}-scancode.png`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" className="rounded-full gap-2">
                  <Download className="h-4 w-4" /> Download Printable Scancode
                  Tag
                </Button>
              </a>
            </div>
          </div>
        </div>
      )} */}
    </main>
  );
}
