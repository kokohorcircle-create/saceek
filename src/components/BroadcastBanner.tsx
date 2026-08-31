"use client";

import { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Broadcast = {
  id: string;
  title: string;
  body: string;
  intensity: string;
  cta_label?: string | null;
  cta_url?: string | null;
  created_at: string;
};

export function BroadcastBanner() {
  const [currentBroadcast, setCurrentBroadcast] = useState<Broadcast | null>(null);

  useEffect(() => {
    async function fetchBroadcasts() {
      try {
        const res = await fetch("/api/admin/broadcasts"); // ← public endpoint
        const data = await res.json();

        if (!data.success || !data.broadcasts?.length) return;

        const activeBroadcasts: Broadcast[] = data.broadcasts;

        // Get last viewed broadcast signature
        const lastViewed = localStorage.getItem("last_viewed_broadcast");

        // Find the first broadcast the user hasn't seen yet
        const unviewed = activeBroadcasts.find((b) => {
          const signature = `${b.id}:${b.title}:${b.body}`;
          return signature !== lastViewed;
        });

        if (unviewed) {
          setCurrentBroadcast(unviewed);

          // Remember this one so it doesn't show again
          localStorage.setItem(
            "last_viewed_broadcast",
            `${unviewed.id}:${unviewed.title}:${unviewed.body}`
          );

          // Auto dismiss after 30 seconds
          const timer = setTimeout(() => {
            setCurrentBroadcast(null);
          }, 30000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Failed to load broadcasts:", error);
      }
    }

    fetchBroadcasts();
  }, []);

  return (
    <AnimatePresence>
      {currentBroadcast && (
        <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto flex items-start gap-4 max-w-xl w-full rounded-2xl border border-red-500/30 bg-[#0c0c0c]/95 p-4 text-white shadow-2xl backdrop-blur-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-500">
              <Megaphone className="h-5 w-5 animate-pulse" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-sm font-bold tracking-wide text-white">
                  {currentBroadcast.title}
                </h4>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                  New Update
                </span>
              </div>

              <p className="text-xs leading-relaxed text-gray-300">
                {currentBroadcast.body}
              </p>

              {currentBroadcast.cta_url && currentBroadcast.cta_label && (
                <div className="pt-2">
                  <a
                    href={currentBroadcast.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    {currentBroadcast.cta_label} →
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentBroadcast(null)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}