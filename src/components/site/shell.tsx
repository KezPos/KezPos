import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Download, Menu, X, MessageCircle, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme";
import { EMAIL, btn } from "./ui";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { KEZPOS } from "./config";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/install", label: "Install" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="KezPos home">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-8 w-8 rounded-[10px] object-contain" />
      <span className="text-[17px] tracking-tight">
        <b className="font-semibold">Kez</b>
        <span className="font-light">Pos</span>
      </span>
    </Link>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={cn(
          "mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] px-3 py-2 transition-all duration-300 sm:flex sm:justify-between sm:px-4",
          scrolled ? "bg-card/90 shadow-soft backdrop-blur-md" : "bg-transparent",
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-[12px] px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!text-primary bg-primary-soft" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/install" className={cn(btn.primary, "hidden h-10 px-4 text-sm sm:inline-flex")}>
            <Download className="h-4 w-4" /> Download
          </Link>
          <Button
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-btn)] bg-card shadow-soft md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="page mx-auto mt-2 max-w-[1600px] p-2 md:hidden">
          {[...NAV, { to: "/privacy" as const, label: "Privacy" }].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block rounded-[12px] px-4 py-3 text-sm"
              activeProps={{ className: "text-primary bg-primary-soft" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-[1600px] px-6 pb-10">
      <div className="flex flex-col gap-6 border-t border-dashed pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">The back office for Kenyan retail.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/features" className="hover:text-foreground">Features</Link>
          <Link to="/install" className="hover:text-foreground">Install</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <a href={`mailto:${EMAIL}`} className="hover:text-foreground">{EMAIL}</a>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 font-mono text-[11px] text-muted-foreground"><p>© {new Date().getFullYear()} KezPos · Made in Kenya</p><a href="https://github.com/KezPos/KezPos" target="_blank" rel="noreferrer" className="flex items-center gap-1">GitHub <ArrowUpRight className="size-3" /></a></div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div aria-hidden className="desk-grid pointer-events-none fixed inset-0 -z-50" />
      <div aria-hidden className="desk-vignette pointer-events-none fixed inset-0 -z-40" />
      <Header />
      <main className="flex flex-col gap-10 px-3 pt-6 sm:gap-14 sm:px-6">{children}</main>
      <Footer />
      <a href={`https://wa.me/${KEZPOS.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className="fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-good text-primary-foreground shadow-soft transition-transform hover:scale-105"><MessageCircle className="size-6" /></a>
    </div>
  );
}
