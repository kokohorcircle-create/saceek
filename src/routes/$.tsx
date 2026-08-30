import Link from "next/link";
import { Home, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Saceek International",
  description:
    "The page you are looking for is not available. Explore Bueno Soyabeans Powder Mix or get in touch with Saceek International Network Limited.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Page Not Found | Saceek International",
    description:
      "This page is unavailable. Browse our products or contact our team.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function NotFoundPage() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-card md:p-12">
          <p className="text-6xl font-extrabold tracking-tight text-primary md:text-7xl">
            404
          </p>
          <h1 className="mt-3 text-2xl font-bold md:text-3xl">
            This page could not be found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The link may be broken or the page may have been moved. Let us point
            you back to something useful.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full">
              <Link href="/">
                <Home className="mr-1 h-4 w-4" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full"
            >
              <Link href="/contact">
                <Mail className="mr-1 h-4 w-4" aria-hidden="true" />
                Contact Us
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/bueno"
              className="font-medium text-primary hover:underline"
            >
              Bueno Product
            </Link>
            <Link
              href="/about"
              className="font-medium text-primary hover:underline"
            >
              About Us
            </Link>
            <Link
              href="/gallery"
              className="font-medium text-primary hover:underline"
            >
              Gallery
            </Link>
            <Link
              href="/certifications"
              className="font-medium text-primary hover:underline"
            >
              Certifications
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
