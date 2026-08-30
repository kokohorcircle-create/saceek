import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, NAV } from "@/lib/site-data";
import logoAsset from "@/assets/saceek-mark.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src={logoAsset}
              alt="Saceek International Network Limited logo"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />
            <span className="font-display text-base font-semibold text-primary">
              Saceek International
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{COMPANY.name}</p>
          <p className="mt-3 font-display text-sm font-semibold text-primary">{COMPANY.motto}</p>
          <p className="mt-1 text-sm text-muted-foreground">{COMPANY.slogan}</p>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Quick Links
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV.filter((n) => n.to !== "/bueno").map((item) => (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Product</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/bueno"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Bueno Soyabeans Powder Mix
              </Link>
            </li>
            <li>
              <Link
                href="/bueno#nutrition"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Nutritional Information
              </Link>
            </li>
            <li>
              <Link
                href="/bueno#ingredients"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Ingredients
              </Link>
            </li>
          </ul>
          <p className="mt-4 font-display text-sm font-semibold text-accent">
            Nourish. Energize. Thrive.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{COMPANY.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex flex-col">
                <a href={`tel:${COMPANY.salesPhone}`} className="hover:text-primary">
                  {COMPANY.salesPhone} (Product / Sales)
                </a>
                <a href={`tel:${COMPANY.corporatePhone}`} className="hover:text-primary">
                  {COMPANY.corporatePhone} (Corporate)
                </a>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex min-w-0 flex-col">
                <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-primary">
                  {COMPANY.email}
                </a>
                <a href={`mailto:${COMPANY.altEmail}`} className="break-all hover:text-primary">
                  {COMPANY.altEmail}
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-5 text-center text-xs text-muted-foreground">
          <span>&copy; {COMPANY.name}. All Rights Reserved.</span>
          <Link href="/auth" className="hover:text-primary">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}