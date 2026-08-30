import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="container-page py-7 md:py-10">
        <div className="max-w-3xl rise">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">{title}</h1>
          {subtitle ? (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
              {subtitle}
            </p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
