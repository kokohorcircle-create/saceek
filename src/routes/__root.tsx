"use client";

import { type ReactNode } from "react";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { WhatsAppButton } from "@/src/components/whatsapp-button";
import { ScrollReveal } from "@/src/components/scroll-reveal";
import { BroadcastBanner } from "@/src/components/broadcast-banner";
import { Toaster } from "@/src/components/ui/sonner";
import  "../styles.css";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <ScrollReveal />
      <BroadcastBanner />
      <Toaster />
    </div>
  );
}
