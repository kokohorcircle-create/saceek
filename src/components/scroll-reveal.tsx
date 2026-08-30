"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds a mild fade-and-rise reveal to page sections as they scroll into view.
 * Purely presentational; runs only in the browser.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let raf1 = 0;
    let raf2 = 0;

    // Defer all DOM mutation until after hydration commits, otherwise React
    // sees classes/styles it never rendered and reports a mismatch.
    const timeout = setTimeout(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          "main section > *, main section > div > *, main section img",
        ),
      ).filter((el) => !el.hasAttribute("data-revealed"));

      if (prefersReduced) {
        targets.forEach((el) => el.setAttribute("data-revealed", "true"));
        return;
      }

      // Group by section so children cascade in
      const byParent = new Map<Element, HTMLElement[]>();
      targets.forEach((el) => {
        const parent = el.parentElement as Element;
        const list = byParent.get(parent) ?? [];
        list.push(el);
        byParent.set(parent, list);
      });
      byParent.forEach((list) => {
        list.forEach((el, i) => {
          el.classList.add("reveal");
          el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 90}ms`);
        });
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            el.setAttribute("data-revealed", "true");
            observer?.unobserve(el);
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
      );

      // Wait two frames so the browser paints the hidden state first —
      // otherwise already-visible elements flip to revealed with no transition.
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          targets.forEach((el) => observer?.observe(el));
        });
      });
    }, 0);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}