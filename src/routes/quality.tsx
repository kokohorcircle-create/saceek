import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  ClipboardCheck,
  Droplets,
  PackageCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Quality & Safety | Saceek International",
  description:
    "How Saceek protects product quality and food safety: hygiene, traceable sourcing, batch control, safe packaging and staff training.",
  openGraph: {
    title: "Quality & Safety at Saceek International",
    description:
      "Quality Product Is Our Passion — safety practices behind every pack of Bueno.",
    type: "website",
    url: "https://saceek.com/quality",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/quality",
  },
};

const PRACTICES = [
  {
    icon: Droplets,
    title: "Hygiene First",
    text: "Clean production areas, sanitised equipment and protective wear are standard practice throughout processing.",
  },
  {
    icon: ClipboardCheck,
    title: "Ingredient Screening",
    text: "Incoming ingredients are inspected and only accepted when they meet our quality requirements.",
  },
  {
    icon: Boxes,
    title: "Batch Control",
    text: "Production is organised in batches so each pack can be traced back to its production record.",
  },
  {
    icon: PackageCheck,
    title: "Safe Packaging",
    text: "Food-grade packaging is sealed to protect the blend from moisture and contamination.",
  },
  {
    icon: Users,
    title: "Trained People",
    text: "Team members are trained on handling, hygiene and safe food practices relevant to their role.",
  },
  {
    icon: ShieldCheck,
    title: "Standards Compliance",
    text: "Products are developed to comply with the applicable Nigerian food quality and safety standards.",
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality & Safety"
        title="Quality Product Is Our Passion"
        subtitle="Consumers, retailers and distributors should be able to trust every pack that carries our name."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRACTICES.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-6 rounded-3xl border border-border bg-secondary/60 p-7 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-2xl font-bold">
                Storage & Handling Guidance
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>Store in a cool, dry place away from direct sunlight.</li>
                <li>Keep the pack tightly sealed after opening.</li>
                <li>
                  Use a clean, dry spoon each time to avoid introducing
                  moisture.
                </li>
                <li>Consume within the period indicated on the pack.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Report a Quality Concern</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If you have a question or concern about a pack you purchased,
                please contact us with the details and, where possible, the
                batch information printed on the pack.
              </p>
              <Button asChild className="mt-4 rounded-full px-6">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
