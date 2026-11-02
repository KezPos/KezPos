import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** A floating paper page, same shape as <Page> but sized for a single form. */
export function AuthPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="page relative mx-auto my-4 w-full max-w-xl px-6 py-12 sm:px-10 sm:py-14">
      <div aria-hidden className="absolute inset-x-6 -bottom-2 -z-10 h-6 rounded-b-3xl bg-card/70 shadow-soft" />
      <div aria-hidden className="absolute inset-x-12 -bottom-4 -z-20 h-6 rounded-b-3xl bg-card/40 shadow-soft" />
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
      <h1 className="mt-4 font-display text-3xl leading-[1.08] font-medium tracking-tight text-balance sm:text-[2.4rem]">
        {title}
      </h1>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Ledger-style input: mono label above a receipt-paper field. */
export function Field({
  label,
  id,
  className,
  ...props
}: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">{label}</span>
      <input
        id={id}
        className={cn(
          "mt-2 h-12 w-full rounded-[var(--radius-btn)] border bg-receipt px-4 text-[15px] text-foreground transition-colors",
          "placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none",
          "disabled:opacity-60",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "warn";
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-btn)] border p-4 text-sm leading-6",
        tone === "warn"
          ? "border-warn/40 bg-warn/10 text-foreground"
          : "border-destructive/30 bg-destructive/10 text-foreground",
      )}
    >
      <AlertTriangle
        className={cn("mt-0.5 size-4 shrink-0", tone === "warn" ? "text-warn" : "text-destructive")}
      />
      <div>{children}</div>
    </div>
  );
}

export function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-btn)] border border-good/35 bg-good/10 p-5">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="size-5 text-good" />
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className="mt-3 text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}

export function Working({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin text-primary" />
      {label}
    </p>
  );
}
