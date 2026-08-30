import type { Metadata } from "next";
import Image from "next/image";
import {
  Activity,
  HeartPulse,
  Leaf,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  Sprout,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/bueno-hero.jpg";
import ingredientsImage from "@/assets/ingredients-flatlay.jpg";
import { COMPANY, INGREDIENTS, NUTRITION } from "@/lib/site-data";


export const metadata: Metadata = {
  title: "Bueno Soyabeans Powder Mix (300 g) | Saceek International",
  description:
    "Bueno Soyabeans Powder Mix combines soybeans, crayfish, groundnut, cashew nut, plantain, tigernut, coconut, catfish and dates in a 300 g nutritious blend.",
  openGraph: {
    title: "Bueno Soyabeans Powder Mix | Saceek International",
    description:
      "Wholesome Nutrition for a Better You. Nourish. Energize. Thrive.",
    type: "website",
    url: "https://saceek.com/bueno",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/bueno",
  },
};

const BENEFITS = [
  { icon: Sprout, title: "Plant-Based Protein" },
  { icon: ShieldCheck, title: "Supports Immunity" },
  { icon: Zap, title: "Sustains Energy" },
  { icon: Activity, title: "Aids Digestion" },
  { icon: HeartPulse, title: "Supports Heart Health" },
];

export default function BuenoPage() {
  const pageUrl = "https://saceek.com/bueno";
  // Generates a crisp QR code pointing to this URL via a secure public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`;

  return (
    <>
      <section className="border-b border-border bg-secondary/50">
        <div className="container-page grid items-center gap-7 py-14 md:py-20 lg:grid-cols-2">
          <div className="rise">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Our Flagship Product
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Bueno Soyabeans Powder Mix
            </h1>
            <p className="mt-4 font-display text-xl text-primary">
              Wholesome Nutrition for a Better You
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Bueno Soyabeans Powder Mix combines carefully selected natural
              food ingredients into a convenient nutritious blend designed for
              wholesome everyday nourishment.
            </p>
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
              <Leaf className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold">Net Weight: 300 g</span>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-7 text-base"
              >
                <a href={`tel:${COMPANY.salesPhone}`}>
                  Call {COMPANY.salesPhone}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-7 text-base"
              >
                <a href={`mailto:${COMPANY.email}`}>Email Us</a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <Image
              src={heroImage}
              alt="Bueno Soyabeans Powder Mix 300 g pouch with prepared drink"
              width={1408}
              height={1104}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="ingredients" className="section-y scroll-mt-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Ingredients</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every pouch is blended from natural food ingredients, chosen for
              nutrition, flavour and familiarity.
            </p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INGREDIENTS.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Leaf className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-3xl border border-border shadow-card">
            <Image
              src={ingredientsImage}
              alt="Bowls of soybeans, crayfish, groundnut, cashew nut, dried plantain, tigernut, coconut, dry catfish and dates"
              loading="lazy"
              width={1408}
              height={912}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 section-y">
        <div className="container-page">
          <h2 className="text-3xl font-bold md:text-4xl">Product Benefits</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {BENEFITS.map((b) => (
              <article
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
                  <b.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {b.title}
                </h3>
              </article>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Disclaimer: Nutritional benefit statements describe general
            nutritional qualities of the ingredients used and are not intended
            as medical advice, diagnosis or treatment.
          </p>
        </div>
      </section>

      <section id="nutrition" className="section-y scroll-mt-24">
        <div className="container-page">
          <h2 className="text-3xl font-bold md:text-4xl">
            Nutritional Information
          </h2>
          <p className="mt-3 text-muted-foreground">
            Approximate Nutritional Values per 100 g
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border shadow-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Approximate nutritional values per 100 g
              </caption>
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Nutrient
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right font-semibold"
                  >
                    Per 100 g
                  </th>
                </tr>
              </thead>
              <tbody>
                {NUTRITION.map(([label, value], i) => (
                  <tr
                    key={label}
                    className={i % 2 ? "bg-secondary/50" : "bg-card"}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3 font-medium text-foreground"
                    >
                      {label}
                    </th>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Values are approximate and may vary slightly between production
            batches.
          </p>
        </div>
      </section>

      <section className="pb-14">
        <div className="container-page">
          <div className="rounded-3xl border border-border bg-primary px-6 py-9 text-primary-foreground md:px-14">
            <h2 className="text-3xl font-bold md:text-4xl">
              Want to Buy or Distribute Bueno?
            </h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/85">
              We welcome enquiries from consumers, retailers, wholesalers and
              distribution partners across Nigeria.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="destructive"
                size="lg"
                className="h-12 rounded-full px-7 text-base"
              >
                <a href={`tel:${COMPANY.salesPhone}`}>
                  <Phone className="mr-1 h-4 w-4" aria-hidden="true" /> Call{" "}
                  {COMPANY.salesPhone}
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-12 rounded-full px-7 text-base"
              >
                <a href={`mailto:${COMPANY.email}`}>
                  <Mail className="mr-1 h-4 w-4" aria-hidden="true" /> Email Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scan Code / QR Code Section at the Bottom */}
      <section className="pb-20">
        <div className="container-page">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-secondary/40 p-8 text-center shadow-card sm:p-12">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <QrCode className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">
              Scan to Open Page
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Scan this code with any mobile device camera to instantly open
              this page on the go.
            </p>
            <div className="mt-6 inline-block rounded-2xl border border-border bg-card p-4 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code linking to Bueno Soyabeans Powder Mix page"
                width={160}
                height={160}
                className="mx-auto h-40 w-40 rounded-lg object-contain"
              />
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {pageUrl}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
