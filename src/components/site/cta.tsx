import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { btn } from "./ui";

export function ClosingCTA() {
  return <section className="mx-auto w-full max-w-6xl border-t border-dashed px-5 py-14 text-center">
    <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">The next chapter</p>
    <h2 className="mt-5 font-display text-3xl font-medium sm:text-5xl">A better day at the shop.</h2>
    <p className="mt-4 text-sm text-muted-foreground">Your sales, stock and customers. All in one place.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/install" className={btn.primary}><Download className="size-4" /> Install now</Link></div>
  </section>;
}