import { useEffect, useRef, useState } from "react";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Broadcast = {
  id: string;
  title: string;
  body: string;
  intensity: string;
  cta_label: string | null;
  cta_url: string | null;
};

/** Aggressive announcements are re-pushed to the visitor after this delay. */
const AGGRESSIVE_REPUSH_MS = 45_000;

export function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase
        .from("broadcasts")
        .select("id, title, body, intensity, cta_label, cta_url")
        .order("created_at", { ascending: false })
        .limit(1);

      const next = data?.[0];
      if (cancelled || !next) return;

      const dismissed = window.localStorage.getItem(`saceek-broadcast-${next.id}`);
      setBroadcast(next);
      if (next.intensity === "aggressive" || !dismissed) {
        setOpen(true);
      }
    })();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!broadcast || !open) return null;

  const aggressive = broadcast.intensity === "aggressive";

  const dismiss = () => {
    setOpen(false);
    window.localStorage.setItem(`saceek-broadcast-${broadcast.id}`, "1");
    if (aggressive) {
      timer.current = setTimeout(() => setOpen(true), AGGRESSIVE_REPUSH_MS);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="broadcast-title"
      className="fixed inset-0 z-[60] grid place-items-center bg-foreground/50 px-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rise relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-lift"
      >
        <div
          className={`h-1.5 w-full ${aggressive ? "bg-destructive" : "bg-primary"}`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close announcement"
          className="absolute right-4 top-5 grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="p-7 md:p-9">
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl ${
              aggressive
                ? "bg-accent-soft text-destructive"
                : "bg-primary-soft text-primary"
            }`}
          >
            <Megaphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <p
            className={`mt-5 text-xs font-semibold uppercase tracking-[0.2em] ${
              aggressive ? "text-destructive" : "text-accent"
            }`}
          >
            {aggressive ? "Important Announcement" : "Announcement"}
          </p>
          <h2
            id="broadcast-title"
            className="mt-2 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl"
          >
            {broadcast.title}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
            {broadcast.body}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {broadcast.cta_url ? (
              <Button
                asChild
                size="lg"
                variant={aggressive ? "destructive" : "default"}
                className="h-11 rounded-full px-6"
              >
                <a href={broadcast.cta_url} onClick={dismiss}>
                  {broadcast.cta_label || "Learn more"}
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-6"
              onClick={dismiss}
            >
              Continue to site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
