"use client"

import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { COMPANY } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact | Saceek International, Port Harcourt",
  description:
    "Contact Saceek International Network Limited in Port Harcourt for product, wholesale, distribution, retail supply and partnership enquiries.",
  openGraph: {
    title: "Contact Saceek International",
    description:
      "Let's connect — call 07077914443 or email Saceekinternational@gmail.com.",
    type: "website",
    url: "https://saceek.com/contact",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Connect"
        subtitle="Whether you are a consumer, retailer, wholesaler or potential partner, our team is ready to help."
      />

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">
                Address
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {COMPANY.address}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">Phone</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Product / Sales:{" "}
                <a
                  href={`tel:${COMPANY.salesPhone}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {COMPANY.salesPhone}
                </a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Corporate:{" "}
                <a
                  href={`tel:${COMPANY.corporatePhone}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {COMPANY.corporatePhone}
                </a>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">Email</h2>
              <p className="mt-2 break-all text-sm">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-foreground hover:text-primary"
                >
                  {COMPANY.email}
                </a>
              </p>
              <p className="mt-1 break-all text-sm">
                <a
                  href={`mailto:${COMPANY.altEmail}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {COMPANY.altEmail}
                </a>
              </p>
            </div>

            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-6 transition-colors hover:bg-primary-soft"
            >
              <MessageCircle
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">
                Chat with us on WhatsApp — {COMPANY.salesPhone}
              </span>
            </a>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
