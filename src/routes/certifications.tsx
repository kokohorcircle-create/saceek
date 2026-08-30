import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, FileText, Landmark, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import cacAsset from "@/assets/cac-certificate.png";
import nafdacAsset from "@/assets/nafdac-certificate.png";

export const metadata: Metadata = {
  title: "Certifications & Compliance | Saceek International",
  description:
    "Saceek International Network Limited — CAC Certificate of Incorporation (RC 1314316) and NAFDAC Certificate of Registration for Bueno Soyabeans Powder Mix.",
  openGraph: {
    title: "Certifications & Compliance | Saceek International",
    description:
      "Verified CAC incorporation and NAFDAC product registration certificates for Saceek International Network Limited and Bueno Soyabeans Powder Mix.",
    type: "website",
    url: "https://saceek.com/certifications",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://saceek.com/certifications",
  },
};

const ITEMS = [
  {
    icon: Landmark,
    title: "Corporate Registration",
    text: "Saceek International Network Limited is incorporated in Nigeria and operates from Port Harcourt, Rivers State.",
  },
  {
    icon: ScrollText,
    title: "Regulatory Compliance",
    text: "Our products are developed to comply with applicable Nigerian food regulations and recognised standards.",
  },
  {
    icon: BadgeCheck,
    title: "Product Certification",
    text: "Bueno Soyabeans Powder Mix is registered with NAFDAC and the company is registered with the Corporate Affairs Commission.",
  },
  {
    icon: FileText,
    title: "Documentation on Request",
    text: "Distributors, retailers and partners can request available compliance documentation directly from our team.",
  },
];

const CERTIFICATES = [
  {
    asset: cacAsset,
    title: "Certificate of Incorporation",
    issuer: "Corporate Affairs Commission (CAC)",
    country: "Federal Republic of Nigeria",
    detail:
      "Registered under the Companies and Allied Matters Act 1990. The company is Limited by Shares.",
    meta: [
      { label: "RC Number", value: "RC 1314316" },
      { label: "Date of Incorporation", value: "9 February 2016" },
      { label: "Issued At", value: "Abuja, Nigeria" },
    ],
  },
  {
    asset: nafdacAsset,
    title: "Certificate of Registration",
    issuer:
      "National Agency for Food and Drug Administration and Control (NAFDAC)",
    country: "Federal Republic of Nigeria",
    detail:
      "Granted for the product Bueno Soyabeans Powder Mix, manufactured by Saceek International Network Ltd at Port Harcourt, Rivers State.",
    meta: [
      { label: "Certificate No.", value: "A8-119875L" },
      { label: "Approval Date", value: "3 February 2026" },
      { label: "Expires On", value: "2 February 2028" },
    ],
  },
];

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="Compliance You Can Verify"
        subtitle="We believe claims should be backed by documents. Below are our official registration and product certification records, issued and verifiable."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {ITEMS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft text-foreground">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="container-page">
          <div className="mb-7 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Official Records
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Registered & Certified
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              These are the original certificates as issued by the relevant
              Nigerian authorities. Click any certificate to view it in full.
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-2">
            {CERTIFICATES.map((cert) => (
              <article
                key={cert.title}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <a
                  href={cert.asset.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-secondary/40 p-4"
                  aria-label={`View ${cert.title} in full`}
                >
                  <Image
                    src={cert.asset}
                    alt={`${cert.title} issued by ${cert.issuer}`}
                    width={800}
                    height={1100}
                    className="mx-auto max-h-[520px] w-auto rounded-xl border border-border object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </a>

                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cert.country}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {cert.detail}
                  </p>

                  <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-border pt-4 sm:grid-cols-3">
                    {cert.meta.map((m) => (
                      <div key={m.label}>
                        <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {m.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">
                          {m.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 rounded-3xl border border-dashed border-border bg-secondary/50 p-8 text-center">
            <h2 className="text-xl font-bold">
              Need certified copies for a trade enquiry?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              We can share high-resolution, verified copies of these
              certificates with serious distributors, retailers and partners on
              request.
            </p>
            <Button asChild className="mt-4 rounded-full px-6">
              <Link href="/contact">Request Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
