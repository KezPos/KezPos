import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EMAIL = "kezposapp@gmail.com";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] px-5 h-12 text-[15px] font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const btn = {
  primary: cn(base, "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:brightness-110"),
  ghost: cn(base, "bg-card text-foreground shadow-soft hover:-translate-y-0.5 hover:text-primary"),
  soft: cn(base, "bg-primary-soft text-primary hover:-translate-y-0.5"),
};

/** Chapter label, like a book running head. */
export function Chapter({ n, children, className }: { n: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase", className)}>
      <span className="text-primary">Page {n}</span>
      <span className="h-px w-8 bg-border" />
      <span>{children}</span>
    </div>
  );
}

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-display text-3xl leading-[1.08] font-medium tracking-tight text-balance sm:text-[2.6rem]", className)}>
      {children}
    </h2>
  );
}

/** A floating paper page with a folio (page number) in the corner. */
export function Page({
  children,
  folio,
  className,
  id,
}: {
  children: ReactNode;
  folio?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("page relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-14 sm:px-12 sm:py-20", className)}>
      {/* stacked sheets behind, like a book block */}
      <div aria-hidden className="absolute inset-x-6 -bottom-2 -z-10 h-6 rounded-b-3xl bg-card/70 shadow-soft" />
      <div aria-hidden className="absolute inset-x-12 -bottom-4 -z-20 h-6 rounded-b-3xl bg-card/40 shadow-soft" />
      {children}
      {folio && (
        <span className="absolute right-6 bottom-5 font-mono text-[11px] text-faint sm:right-10">— {folio} —</span>
      )}
    </section>
  );
}

export function TextLink({ to, children }: { to: "/" | "/features" | "/install" | "/privacy" | "/terms"; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
