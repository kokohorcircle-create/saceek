"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { COMPANY, NAV } from "@/lib/site-data";
import logoAsset from "@/assets/saceek-mark.png";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5">
      <img
        src={logoAsset.src || logoAsset}
        alt="Saceek International Network Limited logo"
        className="h-10 w-10 shrink-0 object-contain"
      />
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold text-primary">
          Saceek
        </span>
        <span className="block text-[11px] font-bold tracking-wide text-foreground/75 whitespace-nowrap">
          International Network Ltd
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Items that belong to the About/Company dropdown tray
  const aboutGroupItems = NAV.filter((item: any) =>
    ["About Us", "Our Process", "Leadership"].includes(item.label)
  );

  // Other navigation items
  const otherNavItems = NAV.filter(
    (item: any) =>
      !["About Us", "Our Process", "Leadership"].includes(item.label)
  );

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="hidden bg-primary text-primary-foreground lg:block">
          <div className="container-page flex h-9 items-center justify-between text-xs">
            <p>{COMPANY.slogan}</p>
            <p className="text-primary-foreground/80">
              Port Harcourt, Rivers State &middot;{" "}
              <a href={`tel:${COMPANY.salesPhone}`} className="hover:underline">
                {COMPANY.salesPhone}
              </a>
            </p>
          </div>
        </div>

        <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-[4.5rem]">
          <Brand />

          <div className="flex items-center gap-2">
            {/* Desktop Navigation with Dropdown Tray */}
            <nav
              aria-label="Main"
              className="hidden items-center gap-0.5 xl:flex"
            >
              {otherNavItems.map((item: any, index: number) => {
                return (
                  <span key={item.to} className="flex items-center">
                    {index === 1 && (
                      <div
                        ref={dropdownRef}
                        className="relative"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <button
                          onClick={() => setDropdownOpen((prev) => !prev)}
                          className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                          aria-expanded={dropdownOpen}
                        >
                          About{" "}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              dropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Tray */}
                        {dropdownOpen && (
                          <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-border bg-background p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
                            {aboutGroupItems.map((subItem: any) => {
                              const active = isActive(subItem.to);
                              return (
                                <Link
                                  key={subItem.to}
                                  href={subItem.to}
                                  onClick={() => setDropdownOpen(false)}
                                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary ${
                                    active
                                      ? "bg-primary-soft text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {subItem.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      href={item.to}
                      className={`rounded-md px-2.5 py-2 text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary ${
                        isActive(item.to)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </span>
                );
              })}
            </nav>

            <Button
              asChild
              variant="destructive"
              className="hidden rounded-full px-5 sm:inline-flex"
            >
              <Link href="/contact">Order / Enquire Now</Link>
            </Button>

            {/* Hamburger Trigger */}
            <Button
              variant="outline"
              size="icon"
              className="xl:hidden"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sibling Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] xl:hidden flex justify-end">
          {/* Full-Screen Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Full-Screen Height Sliding Panel */}
          <div className="relative w-[85vw] max-w-sm h-full bg-background border-l border-border shadow-2xl flex flex-col z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border p-4 gap-2">
              <div className="overflow-hidden">
                <Brand onClick={() => setMobileMenuOpen(false)} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full h-10 w-10"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Drawer Links */}
            <nav
              aria-label="Mobile"
              className="flex-1 overflow-y-auto flex flex-col p-4 gap-1"
            >
              {NAV.map((item: any) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-primary-soft ${
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-auto border-t border-border pb-6">
                <Button
                  asChild
                  variant="destructive"
                  className="w-full h-12 rounded-full text-base"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Order / Enquire Now
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
