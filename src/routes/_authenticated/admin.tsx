"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Trash2,
  Power,
  ShieldAlert,
  Inbox,
  LogOut,
  PackagePlus,
  Package,
  Pencil,
  X,
  Check,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Enquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  enquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type Broadcast = {
  id: string;
  title: string;
  body: string;
  intensity: string;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  ends_at: string | null;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  scancode_url?: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [items, setItems] = useState<Broadcast[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [productBusy, setProductBusy] = useState(false);

  // Broadcast Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [intensity, setIntensity] = useState<"mild" | "aggressive">("mild");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // Product Form State (Creation)
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productStock, setProductStock] = useState("");

  // Product Editing State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Signout Modal State
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const loadData = useCallback(async () => {
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetch("/api/admin/data", {
        headers: { "x-admin-email": session || "" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load admin data");
      }
      setItems(data.broadcasts || []);
      setEnquiries(data.enquiries || []);

      const prodRes = await fetch("/api/admin/products");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
      }

      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const markRead = async (item: Enquiry) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !item.is_read }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    }
  };

  const removeEnquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Enquiry deleted");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const createBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          intensity,
          cta_label: ctaLabel || null,
          cta_url: ctaUrl || null,
          ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Broadcast published to the site");
      setTitle("");
      setBody("");
      setCtaLabel("");
      setCtaUrl("");
      setEndsAt("");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to publish");
    } finally {
      setBusy(false);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductBusy(true);
    const session = localStorage.getItem("admin_session");

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDesc);
      formData.append("price", productPrice);
      formData.append("stock", productStock || "0");
      if (productImageFile) {
        formData.append("image", productImageFile);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "x-admin-email": session || "",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      toast.success("Product & Scancode created successfully!");
      setProductName("");
      setProductDesc("");
      setProductPrice("");
      setProductImageFile(null);
      setProductStock("");
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setProductBusy(false);
    }
  };

  const startEditingProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditName(p.name);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
  };

  const saveEditedProduct = async (id: string) => {
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": session || "",
        },
        body: JSON.stringify({
          name: editName,
          price: parseFloat(editPrice),
          stock: parseInt(editStock) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Product updated");
      setEditingProductId(null);
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    }
  };

  const deleteProduct = async (id: string) => {
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "x-admin-email": session || "" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Product deleted");
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    }
  };

  const toggleBroadcast = async (item: Broadcast) => {
    try {
      const res = await fetch(`/api/admin/broadcasts/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to toggle");
    }
  };

  const removeBroadcast = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/broadcasts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Broadcast deleted");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const confirmSignOut = async () => {
    try {
      localStorage.removeItem("admin_session");
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/auth");
      router.refresh();
    } catch (error) {
      router.push("/auth");
    }
  };

  if (isAdmin === null) {
    return (
      <section className="section-y">
        <div className="container-page text-center">
          <p className="text-sm text-muted-foreground">
            Checking admin session...
          </p>
        </div>
      </section>
    );
  }

  if (isAdmin === false) {
    return (
      <section className="section-y relative">
        <div className="container-page max-w-xl text-center">
          <ShieldAlert
            className="mx-auto h-10 w-10 text-destructive"
            aria-hidden="true"
          />
          <h1 className="mt-4 font-display text-2xl font-bold">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account does not have administrator permissions.
          </p>
          <Button
            className="mt-5 rounded-full"
            onClick={() => setShowSignOutModal(true)}
          >
            Sign out
          </Button>
        </div>

        {showSignOutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary mx-auto">
                <LogOut className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-display text-lg font-bold">
                  Sign out of admin?
                </h3>
                <p className="text-sm text-muted-foreground">
                  You will need to sign back in with your credentials.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowSignOutModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full"
                  onClick={confirmSignOut}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="section-y relative">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Admin Panel
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold">
              Dashboard Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/products")}
            >
              View Storefront
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setShowSignOutModal(true)}
            >
              Sign out
            </Button>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={createProduct}
            className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <PackagePlus
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />{" "}
              Add Product & Scancode
            </h2>
            <div className="space-y-2">
              <Label htmlFor="p-name">Product Name</Label>
              <Input
                id="p-name"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex. Premium Coffee Beans"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p-price">Price (₦)</Label>
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="29.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-stock">Stock Quantity</Label>
                <Input
                  id="p-stock"
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-image-file">Upload Product Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="p-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductImageFile(e.target.files?.[0] || null)
                  }
                  className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="Describe your product..."
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-full gap-2"
              disabled={productBusy}
            >
              <Upload className="h-4 w-4" />
              {productBusy ? "Uploading & Saving…" : "Upload & Create Product"}
            </Button>
          </form>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Package className="h-4 w-4 text-primary" /> Inventory Products (
              {products.length})
            </h2>
            {products.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No products added yet.
              </p>
            ) : (
              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-card"
                  >
                    {editingProductId === p.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Product Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            placeholder="Price"
                          />
                          <Input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            placeholder="Stock"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={() => saveEditedProduct(p.id)}
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => setEditingProductId(null)}
                          >
                            <X className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {p.image_url && (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">{p.name}</h4>
                            <p className="text-xs text-muted-foreground">
                            ₦{p.price.toFixed(2)} • Stock: {p.stock}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          {p.scancode_url && (
                            <a
                              href={p.scancode_url}
                              target="_blank"
                              rel="noreferrer"
                              title="View QR Scancode"
                              className="text-xs text-primary underline mr-1 font-medium"
                            >
                              Scancode
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => startEditingProduct(p)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => deleteProduct(p.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Broadcasts Section */}
        <div className="mt-12 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={createBroadcast}
            className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Megaphone className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
              New broadcast
            </h2>
            <div className="space-y-2">
              <Label htmlFor="b-title">Title</Label>
              <Input
                id="b-title"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-body">Message</Label>
              <Textarea
                id="b-body"
                required
                rows={4}
                maxLength={1000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Push style</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["mild", "aggressive"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setIntensity(value)}
                    className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                      intensity === value
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <span className="block font-semibold capitalize">
                      {value}
                    </span>
                    <span className="mt-1 block text-xs">
                      {value === "mild"
                        ? "Shows once, stays dismissed."
                        : "Re-pushed every 45s."}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-full"
              disabled={busy}
            >
              {busy ? "Publishing…" : "Publish broadcast"}
            </Button>
          </form>

          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold">
              Published broadcasts
            </h2>
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No broadcasts yet.
              </p>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.body}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => toggleBroadcast(item)}
                    >
                      <Power className="mr-1 h-3.5 w-3.5" />{" "}
                      {item.is_active ? "Turn off" : "Turn on"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => removeBroadcast(item.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Enquiries Section */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <Inbox className="h-5 w-5 text-primary" aria-hidden="true" />{" "}
              Customer Enquiries
            </h2>
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {enquiries.filter((e) => !e.is_read).length} new
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {enquiries.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No enquiries yet.
              </p>
            ) : (
              enquiries.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border bg-card p-5 shadow-card"
                >
                  <h3 className="font-semibold">{item.subject}</h3>
                  <p className="mt-1 text-sm font-medium">{item.full_name}</p>
                  <p className="mt-3 text-sm">{item.message}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => markRead(item)}
                    >
                      {item.is_read ? "Mark unread" : "Mark read"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => removeEnquiry(item.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {showSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary mx-auto">
              <LogOut className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg font-bold">
                Sign out of admin?
              </h3>
              <p className="text-sm text-muted-foreground">
                You will need to sign back in with your credentials.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="rounded-full"
                onClick={confirmSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
