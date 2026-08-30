import type { Metadata } from "next";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { MdProfile } from "@/components/md-profile";

export const metadata: Metadata = {
  title: "About Us | Saceek International",
  description:
    "Saceek International Network Limited is a Nigerian company pursuing investment opportunities across diverse sectors, committed to sustainable, high-quality products.",
  openGraph: {
    title: "About Saceek International",
    description:
      "Building quality. Creating value. Our dream, vision, mission, goal and mandate.",
    type: "website",
    url: "https://bueno-nourish-hub.lovable.app/about",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://bueno-nourish-hub.lovable.app/about",
  },
};

const PRINCIPLES = [
  {
    label: "Our Dream",
    text: "To build an organization that pursues investment opportunities across diverse areas of business and different sectors of the economy.",
  },
  {
    label: "Our Vision",
    text: "To become one of the world's leading inspiring, innovative and forward-thinking organizations.",
  },
  {
    label: "Our Mission",
    text: "To build an organization that motivates and positively impacts people through products and services that provide comfort, value and customer satisfaction.",
  },
  {
    label: "Our Goal",
    text: "To provide sustainable products and services that meet recognised standards and stand the test of time.",
  },
  {
    label: "Our Mandate",
    text: "To provide high-quality finished products and services in every sector or subsector of the economy in which the company operates.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Building Quality. Creating Value."
        subtitle="Saceek International Network Limited is a Nigerian company established to pursue investment opportunities across diverse sectors and subsectors of the economy."
      />

      <section className="section-y">
        <div className="container-page grid gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Who We Are</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We are committed to developing sustainable, high-quality products
              and services that meet customer needs, comply with applicable
              standards and create enduring value. From our base in Port
              Harcourt, Rivers State, we work with partners, suppliers,
              retailers and distributors who share our standard of care.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our flagship consumer product, Bueno Soyabeans Powder Mix,
              reflects that commitment: a convenient, nutritious blend of
              carefully selected natural food ingredients created for wholesome
              everyday nourishment.
            </p>
            <Button asChild className="mt-4 rounded-full px-6">
              <Link href="/bueno">See Bueno Soyabeans Powder Mix</Link>
            </Button>
          </div>
          <aside className="rounded-3xl border border-border bg-secondary/60 p-7">
            <Quote className="h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-4 font-display text-xl font-semibold text-primary">
              With God All Is Possible.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Company motto</p>
            <div className="my-6 h-px bg-border" />
            <p className="font-display text-xl font-semibold text-accent">
              Quality Product Is Our Passion.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Corporate slogan
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 section-y">
        <div className="container-page">
          <h2 className="text-2xl font-bold md:text-3xl">
            Our Guiding Principles
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="font-display text-lg font-semibold text-primary">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Leadership
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">MD / CEO</h2>
          <div className="mt-4">
            <MdProfile />
          </div>
        </div>
      </section>
    </>
  );
}
