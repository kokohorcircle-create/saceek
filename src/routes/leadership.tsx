import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { MdProfile } from "@/components/md-profile";

export const metadata: Metadata = {
  title: "Leadership | Saceek International",
  description:
    "Meet Samuel Celestine Ekunuchi, Managing Director / Chief Executive Officer of Saceek International Network Limited.",
  openGraph: {
    title: "Leadership at Saceek International",
    description:
      "Leadership rooted in simplicity, responsibility and leading from the front.",
    type: "website",
    url: "https://saceek.com/leadership",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/leadership",
  },
};

const VALUES = [
  {
    title: "Investing in People",
    text: "Human capacity building is treated as a responsibility to humanity, not simply a business strategy.",
  },
  {
    title: "Leading From the Front",
    text: "Simplicity and personal responsibility guide how decisions are made and carried out.",
  },
  {
    title: "Enterprise Development",
    text: "A long-term commitment to building businesses that create sustainable value.",
  },
];

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Led With Purpose and Responsibility"
        subtitle="Our leadership sets the standard for how we build products, serve customers and grow our people."
      />
      <section className="section-y">
        <div className="container-page">
          <MdProfile />
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl border border-border bg-secondary/60 p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <h2 className="font-display text-lg font-semibold text-primary">
                  {v.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
