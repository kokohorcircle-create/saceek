"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Trash2,
  Power,
  ShieldAlert,
  Inbox,
  Mail,
  Phone,
  LogOut,
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

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [items, setItems] = useState<Broadcast[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [intensity, setIntensity] = useState<"mild" | "aggressive">("mild");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [endsAt, setEndsAt] = useState("");

  // State for custom signout confirmation modal
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const loadData = useCallback(async () => {
    console.log("[AdminPage] loadData: Starting fetch for admin data...");
    const session = localStorage.getItem("admin_session");
    console.log(
      "[AdminPage] loadData: Retrieved session from localStorage:",
      session
    );
    try {
      const res = await fetch("/api/admin/data", {
        headers: {
          "x-admin-email": session || "",
        },
      });
      console.log("[AdminPage] loadData: Response status:", res.status);
      const data = await res.json();
      console.log("[AdminPage] loadData: Response data payload:", data);
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load admin data");
      }
      console.log(
        "[AdminPage] loadData: Success! Setting broadcasts and enquiries items."
      );
      setItems(data.broadcasts || []);
      setEnquiries(data.enquiries || []);
      setIsAdmin(true);
    } catch (error) {
      console.error("[AdminPage] loadData: Error caught during fetch:", error);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    console.log(
      "[AdminPage] useEffect: Component mounted, triggering loadData()."
    );
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

  const create = async (e: React.FormEvent) => {
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

  const toggle = async (item: Broadcast) => {
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

  const remove = async (id: string) => {
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
      console.error("[AdminPage] signOut error:", error);
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
      <section className="section-y">
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
              Site Broadcasts
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setShowSignOutModal(true)}
          >
            Sign out
          </Button>
        </div>
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={create}
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
                        : "Re-pushed every 45s after closing."}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="b-cta">Button label (optional)</Label>
                <Input
                  id="b-cta"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="Learn more"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-url">Button link (optional)</Label>
                <Input
                  id="b-url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="/bueno"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-ends">Runs until (optional)</Label>
              <Input
                id="b-ends"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        item.intensity === "aggressive"
                          ? "bg-accent-soft text-destructive"
                          : "bg-primary-soft text-primary"
                      }`}
                    >
                      {item.intensity}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.is_active
                          ? "bg-gold-soft text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.is_active ? "Live" : "Off"}
                    </span>
                    {item.ends_at ? (
                      <span className="text-xs text-muted-foreground">
                        until {new Date(item.ends_at).toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                    {item.body}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => toggle(item)}
                    >
                      <Power className="mr-1 h-3.5 w-3.5" aria-hidden="true" />{" "}
                      {item.is_active ? "Turn off" : "Turn on"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />{" "}
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
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
                  className={`rounded-2xl border bg-card p-5 shadow-card ${
                    item.is_read ? "border-border" : "border-primary/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold">
                      {item.enquiry_type}
                    </span>
                    {!item.is_read ? (
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                        New
                      </span>
                    ) : null}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{item.subject}</h3>
                  <p className="mt-1 text-sm font-medium">{item.full_name}</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 break-all">
                      <Mail
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-primary"
                      >
                        {item.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <a
                        href={`tel:${item.phone}`}
                        className="hover:text-primary"
                      >
                        {item.phone}
                      </a>
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-line rounded-xl bg-secondary/60 p-3 text-sm">
                    {item.message}
                  </p>
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
                      <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />{" "}
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Sign Out Confirmation Modal */}
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
                You will need to sign back in with your credentials to manage
                broadcasts and enquiries.
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
