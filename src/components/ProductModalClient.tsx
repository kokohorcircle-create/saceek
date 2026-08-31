"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QrCode, Download, MessageCircle, X } from "lucide-react";
import QRCode from "qrcode";

interface ProductModalClientProps {
  products: any[];
}

export default function ProductModalClient({
  products,
}: ProductModalClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("product");

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Find active product based on the query parameter slug or fallback match
  const product = products.find((p: any) => {
    const slug =
      p.slug ||
      `${(p.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")}-${p._id.toString().slice(-4)}`;
    return slug === activeSlug;
  });

  const slug = product
    ? product.slug ||
      `${(product.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")}-${product._id.toString().slice(-4)}`
    : "";

  // Target URL points directly to the modal query parameter format
  const host = "https://www.saceek.com";
  const productSpecificUrl = `${host}/products?product=${slug}`;

  // Always force-generate QR code dynamically on the fly (ignoring DB)
  useEffect(() => {
    if (product && slug) {
      QRCode.toDataURL(productSpecificUrl, { width: 300, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error("QR Code gen error:", err));
    }
  }, [product, slug, productSpecificUrl]);

  const closeModal = () => {
    router.push("/products", { scroll: false });
  };

  if (!product) return null;

  const whatsappNumber = "2347077914443";
  const whatsappMessage = encodeURIComponent(
    `Hello! I want to book/order this product:\n\n*${product.name}*\nPrice: ₦${product.price.toLocaleString()}\nLink: ${productSpecificUrl}\n\nPlease give me more details.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground border border-border transition hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 md:grid-cols-2 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Product Image */}
          <div className="rounded-2xl border border-border bg-muted overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-72 md:h-full flex items-center justify-center text-xs text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold">
                {product.name}
              </h2>
              <p className="text-2xl font-semibold text-primary">
                ₦
                {typeof product.price === "number"
                  ? product.price.toLocaleString()
                  : "0"}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button className="w-full rounded-full h-12 gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition">
                  <MessageCircle className="h-5 w-5 fill-current" /> Chat on
                  WhatsApp to Book
                </Button>
              </a>

              {qrCodeUrl && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-20 h-20 rounded-xl border p-1 bg-white shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="flex items-center gap-1 font-semibold text-xs">
                      <QrCode className="h-3.5 w-3.5 text-primary" /> Active
                      Scancode Tag
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {productSpecificUrl}
                    </p>
                    <a
                      href={qrCodeUrl}
                      download={`${slug}-qrcode.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <Download className="h-3 w-3" /> Download QR
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
