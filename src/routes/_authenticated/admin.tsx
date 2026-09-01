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
  AlertTriangle,
  Loader2,
  Mail,
  Phone,
  Calendar,
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

type ConfirmModalState = {
  isOpen: boolean;
  type:
    | "delete_broadcast"
    | "toggle_broadcast"
    | "delete_product"
    | "delete_enquiry"
    | null;
  id: string | null;
  title: string;
  description: string;
  actionText: string;
  variant: "destructive" | "default";
  payload?: any;
};

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [items, setItems] = useState<Broadcast[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [productBusy, setProductBusy] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Global Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    description: "",
    actionText: "Confirm",
    variant: "destructive",
  });

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeoutMs = 8000
  ) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const loadData = useCallback(async () => {
    console.log("[AdminPage] Loading data...");
    const session = localStorage.getItem("admin_session");
    try {
      // Enquiries
      const res = await fetchWithTimeout("/api/admin/data", {
        headers: { "x-admin-email": session || "" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load admin data");
      }
      setEnquiries(data.enquiries || []);
      console.log("[AdminPage] Enquiries loaded:", data.enquiries);

      // Broadcasts
      const broadcastRes = await fetchWithTimeout("/api/admin/broadcasts", {
        headers: { "x-admin-email": session || "" },
      });
      const broadcastData = await broadcastRes.json();
      if (broadcastRes.ok && broadcastData.success) {
        setItems(broadcastData.broadcasts || []);
        console.log("[AdminPage] Broadcasts loaded:", broadcastData.broadcasts);
      }

      // Products
      const prodRes = await fetchWithTimeout("/api/admin/products", {
        headers: { "x-admin-email": session || "" },
      });
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
        console.log("[AdminPage] Products loaded:", prodData.products);
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("[AdminPage] Error loading data:", error);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const markRead = async (item: Enquiry) => {
    console.log("[Enquiries] Toggling read status for:", item.id);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, is_read: !e.is_read } : e))
    );
    try {
      const res = await fetchWithTimeout(`/api/admin/enquiries/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !item.is_read }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      console.log("[Enquiries] Read status updated for:", item.id);
      await loadData();
    } catch (error) {
      console.error("[Enquiries] Error updating read status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
      await loadData();
    }
  };

  const removeEnquiry = (id: string) => {
    console.log("[Enquiries] Deletion requested for:", id);
    setConfirmModal({
      isOpen: true,
      type: "delete_enquiry",
      id,
      title: "Delete Enquiry",
      description:
        "Are you sure you want to delete this enquiry? This action cannot be undone.",
      actionText: "Delete",
      variant: "destructive",
    });
  };

  const executeRemoveEnquiry = async (id: string) => {
    setActionLoading(true);
    console.log("[Enquiries] Deleting enquiry ID:", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    try {
      const res = await fetchWithTimeout(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      console.log("[Enquiries] Enquiry deleted:", id);
      toast.success("Enquiry deleted");
      await loadData();
    } catch (error) {
      console.error("[Enquiries] Delete failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete");
      await loadData();
    } finally {
      setActionLoading(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const createBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    console.log("[Broadcasts] Creating broadcast:", { title, body, intensity });
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetchWithTimeout("/api/admin/broadcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": session || "",
        },
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
      if (!res.ok || !data.success)
        throw new Error(data.error || "Failed to publish");
      console.log("[Broadcasts] Created broadcast:", data);
      toast.success("Broadcast published to the site");
      setTitle("");
      setBody("");
      setCtaLabel("");
      setCtaUrl("");
      setEndsAt("");
      setIntensity("mild");
      await loadData();
    } catch (error) {
      console.error("[Broadcasts] Error publishing broadcast:", error);
      toast.error(error instanceof Error ? error.message : "Failed to publish");
    } finally {
      setBusy(false);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductBusy(true);
    console.log("[Products] Creating product:", productName);
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
      const res = await fetchWithTimeout("/api/admin/products", {
        method: "POST",
        headers: {
          "x-admin-email": session || "",
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      console.log("[Products] Created product:", data);
      toast.success("Product & Scancode created successfully!");
      setProductName("");
      setProductDesc("");
      setProductPrice("");
      setProductImageFile(null);
      setProductStock("");
      await loadData();
    } catch (error) {
      console.error("[Products] Error creating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setProductBusy(false);
    }
  };

  const startEditingProduct = (p: Product) => {
    console.log("[Products] Editing product ID:", p.id);
    setEditingProductId(p.id);
    setEditName(p.name);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
  };

  const saveEditedProduct = async (id: string) => {
    console.log("[Products] Saving updates for product ID:", id);
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetchWithTimeout(`/api/admin/products/${id}`, {
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
      console.log("[Products] Product updated:", id);
      toast.success("Product updated");
      setEditingProductId(null);
      await loadData();
    } catch (error) {
      console.error("[Products] Error saving edit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    }
  };

  const deleteProduct = (id: string) => {
    console.log("[Products] Delete requested for ID:", id);
    setConfirmModal({
      isOpen: true,
      type: "delete_product",
      id,
      title: "Delete Product",
      description:
        "Are you sure you want to delete this product? This action cannot be undone.",
      actionText: "Delete",
      variant: "destructive",
    });
  };

  const executeDeleteProduct = async (id: string) => {
    setActionLoading(true);
    console.log("[Products] Deleting product ID:", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetchWithTimeout(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "x-admin-email": session || "" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      console.log("[Products] Product deleted:", id);
      toast.success("Product deleted");
      await loadData();
    } catch (error) {
      console.error("[Products] Error deleting product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
      await loadData();
    } finally {
      setActionLoading(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const toggleBroadcast = (item: Broadcast) => {
    const action = item.is_active ? "Turn Off" : "Turn On";
    console.log(
      "[Broadcasts] Toggle requested for ID:",
      item.id,
      "Target state active:",
      !item.is_active
    );
    setConfirmModal({
      isOpen: true,
      type: "toggle_broadcast",
      id: item.id,
      payload: item,
      title: `${action} Broadcast`,
      description: `Are you sure you want to turn ${item.is_active ? "off" : "on"} "${item.title}"?`,
      actionText: action,
      variant: item.is_active ? "destructive" : "default",
    });
  };

  const executeToggleBroadcast = async (item: Broadcast) => {
    setActionLoading(true);
    const nextActiveState = !item.is_active;
    console.log(
      "[Broadcasts] Executing state change for ID:",
      item.id,
      "to active:",
      nextActiveState
    );

    // Immediate optimistic state update
    setItems((prevItems) =>
      prevItems.map((b) =>
        b.id === item.id ? { ...b, is_active: nextActiveState } : b
      )
    );

    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetchWithTimeout(`/api/admin/broadcasts/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": session || "",
        },
        body: JSON.stringify({ is_active: nextActiveState }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Failed to update broadcast");

      console.log(
        "[Broadcasts] Broadcast state saved on server for ID:",
        item.id
      );
      toast.success(`Broadcast turned ${nextActiveState ? "on" : "off"}`);
      await loadData();
    } catch (error) {
      console.error("[Broadcasts] Toggle failed on server:", error);
      toast.error(error instanceof Error ? error.message : "Failed to toggle");
      await loadData();
    } finally {
      setActionLoading(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const removeBroadcast = (id: string) => {
    console.log("[Broadcasts] Delete requested for ID:", id);
    setConfirmModal({
      isOpen: true,
      type: "delete_broadcast",
      id,
      title: "Delete Broadcast",
      description:
        "Are you sure you want to delete this broadcast? It will be removed immediately.",
      actionText: "Delete",
      variant: "destructive",
    });
  };

  const executeRemoveBroadcast = async (id: string) => {
    setActionLoading(true);
    console.log("[Broadcasts] Deleting broadcast ID:", id);
    setItems((prev) => prev.filter((b) => b.id !== id));
    const session = localStorage.getItem("admin_session");
    try {
      const res = await fetchWithTimeout(`/api/admin/broadcasts/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": session || "",
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      console.log("[Broadcasts] Deleted broadcast ID:", id);
      toast.success("Broadcast deleted");
      await loadData();
    } catch (error) {
      console.error("[Broadcasts] Error deleting broadcast:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete");
      await loadData();
    } finally {
      setActionLoading(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleConfirmAction = () => {
    if (!confirmModal.id && confirmModal.type !== "toggle_broadcast") return;
    switch (confirmModal.type) {
      case "delete_broadcast":
        if (confirmModal.id) void executeRemoveBroadcast(confirmModal.id);
        break;
      case "toggle_broadcast":
        if (confirmModal.payload)
          void executeToggleBroadcast(confirmModal.payload);
        break;
      case "delete_product":
        if (confirmModal.id) void executeDeleteProduct(confirmModal.id);
        break;
      case "delete_enquiry":
        if (confirmModal.id) void executeRemoveEnquiry(confirmModal.id);
        break;
      default:
        break;
    }
  };

  const confirmSignOut = async () => {
    console.log("[AdminPage] Signing out user...");
    try {
      localStorage.removeItem("admin_session");
      await fetchWithTimeout("/api/auth/signout", { method: "POST" });
      router.push("/auth");
      router.refresh();
    } catch (error) {
      console.error("[AdminPage] Error during signout:", error);
      router.push("/auth");
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Checking admin session...
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="font-display text-2xl font-bold">
          Admin access required
        </h1>
        <p className="text-muted-foreground">
          This account does not have administrator permissions.
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => setShowSignOutModal(true)}
        >
          Sign out
        </Button>

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
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Admin Panel
          </h1>
          <p className="mt-1 text-muted-foreground">Dashboard Management</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push("/products")}
          >
            View Storefront
          </Button>
          <Button
            variant="outline"
            className="rounded-full gap-2"
            onClick={() => setShowSignOutModal(true)}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Product Management Section */}
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          onSubmit={createProduct}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card"
        >
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <PackagePlus className="h-4 w-4 text-primary" /> Add Product &
            Scancode
          </h2>

          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex. Premium Coffee Beans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Price (₦)</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                required
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="29.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stock Quantity</Label>
              <Input
                id="product-stock"
                type="number"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Upload Product Image</Label>
            <Input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
              className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-desc">Description</Label>
            <Textarea
              id="product-desc"
              required
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
            {productBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading & Saving…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload & Create Product
              </>
            )}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="b-cta-label">CTA Label (optional)</Label>
              <Input
                id="b-cta-label"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="e.g. Shop Now"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="b-cta-url">CTA URL (optional)</Label>
              <Input
                id="b-cta-url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b-ends-at">Ends at (optional)</Label>
            <Input
              id="b-ends-at"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-full"
            disabled={busy}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing…
              </span>
            ) : (
              "Publish broadcast"
            )}
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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                    {item.cta_label && (
                      <p className="mt-1 text-xs text-primary">
                        CTA: {item.cta_label}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.is_active ? "Active" : "Off"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full capitalize"
                    onClick={() => toggleBroadcast(item)}
                    disabled={actionLoading}
                  >
                    <Power className="mr-1 h-3.5 w-3.5" />
                    {item.is_active ? "Turn off" : "Turn on"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => removeBroadcast(item.id)}
                    disabled={actionLoading}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Customer Enquiries Section */}
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
                className="rounded-2xl border bg-card p-5 shadow-card space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-1">
                      {item.enquiry_type || "General"}
                    </span>
                    <h3 className="font-semibold text-base">{item.subject}</h3>
                  </div>
                  {item.created_at && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.full_name}
                  </p>

                  {/* Customer Email & Phone display */}
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {item.email}
                      </a>
                    )}
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {item.phone}
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-foreground/90 bg-muted/40 p-3 rounded-xl border border-border/50">
                  {item.message}
                </p>

                {/* <div className="pt-1 flex gap-2">
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
                </div> */}
              </article>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg font-bold">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {confirmModal.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={actionLoading}
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
              >
                Cancel
              </Button>
              <Button
                variant={confirmModal.variant}
                className="rounded-full gap-2"
                disabled={actionLoading}
                onClick={handleConfirmAction}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmModal.actionText}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
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
