import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import ProductModalClient from "@/components/ProductModalClient";

export const revalidate = 0; // Always fresh data

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({}).sort({ created_at: -1 }).lean();

  // Clean serialization for client component boundary
  const serializedProducts = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    created_at: p.created_at ? new Date(p.created_at).toISOString() : null,
    updated_at: p.updated_at ? new Date(p.updated_at).toISOString() : null,
  }));

  return (
    <main className="container-page py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-display text-3xl font-bold">Our Products</h1>
        <p className="text-muted-foreground mt-2">
          Explore our collection of items available for order. Click any item to
          view details instantly.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {serializedProducts.map((p: any) => {
          const productSlug =
            p.slug ||
            `${(p.name || "item")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "")}-${p._id.slice(-4)}`;

          return (
            <Link
              key={p._id}
              href={`/products?product=${productSlug}`}
              scroll={false}
              className="group rounded-3xl border border-border bg-card p-4 shadow-card transition hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-48 w-full rounded-2xl object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="h-48 w-full rounded-2xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
                <h3 className="font-semibold mt-4 text-lg">{p.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {p.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">
                  ₦
                  {typeof p.price === "number" ? p.price.toLocaleString() : "0"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Stock: {p.stock ?? 0}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Renders the modal whenever ?product=slug is present in the URL */}
      <ProductModalClient products={serializedProducts} />
    </main>
  );
}
