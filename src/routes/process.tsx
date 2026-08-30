import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import processImage from "@/assets/process-facility.jpg";

export const metadata: Metadata = {
  title: "Our Process | Saceek International",
  description:
    "From sourcing and cleaning to roasting, milling, blending, packaging and dispatch — how Bueno Soyabeans Powder Mix is made.",
  openGraph: {
    title: "Our Process | Saceek International",
    description:
      "A careful, standards-led production process from raw ingredient to sealed pouch.",
    type: "website",
    url: "https://saceek.com/process",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/process",
  },
};

const STEPS = [
  {
    title: "Sourcing",
    text: "Raw ingredients are sourced from trusted suppliers and assessed on arrival for quality and wholesomeness.",
  },
  {
    title: "Sorting & Cleaning",
    text: "Ingredients are sorted, cleaned and prepared to remove foreign matter before processing begins.",
  },
  {
    title: "Roasting & Drying",
    text: "Each component is roasted or dried to the level that best develops flavour and preserves nutrition.",
  },
  {
    title: "Milling",
    text: "Dried ingredients are milled to a fine, consistent powder suitable for easy preparation.",
  },
  {
    title: "Blending",
    text: "Components are combined in controlled proportions so every batch delivers a consistent blend.",
  },
  {
    title: "Quality Checks",
    text: "In-process checks confirm texture, aroma, moisture and appearance before packaging.",
  },
  {
    title: "Packaging & Sealing",
    text: "The blend is filled into 300 g packs and sealed to protect freshness during storage.",
  },
  {
    title: "Storage & Dispatch",
    text: "Finished goods are stored in clean, dry conditions and dispatched to retailers and distributors.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title="Carefully Made, Step by Step"
        subtitle="Quality is built in at every stage — not inspected in at the end."
      />

      <section className="section-y">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="overflow-hidden rounded-3xl border border-border shadow-card lg:sticky lg:top-28">
            <Image
              src={processImage}
              alt="Quality technician inspecting milled powder at a food processing facility"
              loading="lazy"
              width={1408}
              height={912}
              className="h-full w-full object-cover"
            />
          </div>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
