import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import jarRed from "@/assets/bueno-jar-red-lid.png";
import jarGreen from "@/assets/bueno-jar-green-lid.png";
import familyImage from "@/assets/family-nutrition.jpg";
import { COMPANY } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Saceek International | Bueno Soyabeans Powder Mix",
  description:
    "Saceek International Network Limited, Port Harcourt — makers of Bueno Soyabeans Powder Mix. Wholesome nutrition made with purpose.",
  openGraph: {
    title: "Saceek International",
    description:
      "Wholesome nutrition made with purpose. Home of Bueno Soyabeans Powder Mix.",
    type: "website",
    url: "https://saceek.com/",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/",
  },
};

const PILLARS = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    text: "Carefully selected natural food ingredients blended for everyday nourishment.",
  },
  {
    icon: ShieldCheck,
    title: "Standards Driven",
    text: "Products developed to comply with recognised food quality and safety standards.",
  },
  {
    icon: Award,
    title: "Quality First",
    text: "Quality Product Is Our Passion — from sourcing through to finished packaging.",
  },
];

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

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-soft blur-3xl" />
        <div className="container-page relative grid items-center gap-7 py-14 md:py-20 lg:grid-cols-2">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY.slogan}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-foreground md:text-6xl">
              Wholesome Nutrition.
              <span className="block text-primary">Made With Purpose.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Saceek International Network Limited develops quality products
              created to nourish lives, meet recognised standards and deliver
              lasting value.
            </p>
            <p className="mt-4 font-display text-lg font-semibold text-accent md:text-xl">
              Nourish. Energize. Thrive.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-7 text-base"
              >
                <Link href="/bueno">
                  Discover Bueno
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-7 text-base"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          <div className="relative rise">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-secondary p-5 shadow-lift">
              <Image
                src={jarGreen}
                alt="Bueno Soya Beans Powder 300 g jar with a green lid"
                width={1024}
                height={1536}
                className="h-full w-full object-contain"
              />
              <Image
                src={jarRed}
                alt="Bueno Soya Beans Powder 300 g jar with a red lid"
                width={331}
                height={497}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-card sm:left-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Net Weight
              </p>
              <p className="font-display text-lg font-semibold text-primary">
                300 g
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="container-page grid gap-6 py-9 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid items-center gap-7 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <Image
              src={familyImage}
              alt="A family sharing warm nutritious drinks together in a bright kitchen"
              loading="lazy"
              width={1200}
              height={912}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              About Saceek
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Building Quality. Creating Value.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Saceek International Network Limited is a Nigerian company
              established to pursue investment opportunities across diverse
              sectors and subsectors of the economy.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We are committed to developing sustainable, high-quality products
              and services that meet customer needs, comply with applicable
              standards and create enduring value.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 rounded-full px-6"
            >
              <Link href="/about">More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 section-y">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              What Guides Us
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Purpose written into everything we make
            </h2>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-soft text-foreground">
                  <Target className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-primary">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl border border-border bg-primary px-6 py-9 text-primary-foreground md:px-14 md:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <HeartPulse className="h-8 w-8" aria-hidden="true" />
                <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                  Nourishing Lives. Building a Healthier Future.
                </h2>
                <p className="mt-4 max-w-xl text-primary-foreground/85">
                  Bueno Soyabeans Powder Mix brings together carefully selected
                  natural ingredients in a convenient blend for wholesome
                  everyday nourishment.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  variant="destructive"
                  size="lg"
                  className="h-12 rounded-full px-7 text-base"
                >
                  <Link href="/bueno">Explore Bueno</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-full px-7 text-base"
                >
                  <Link href="/contact">Become a Distributor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
