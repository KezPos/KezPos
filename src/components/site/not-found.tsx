import { Link } from "@tanstack/react-router";
import { ArrowRight, Home } from "lucide-react";
import { Logo } from "./shell";
import { ThemeToggle } from "./theme";
import { btn } from "./ui";

/**
 * Cardboard box, seen head-on, with a two-flap lid.
 * Open: the flaps sit at the sides and you look down into the box at "404".
 * Closed: the flaps meet in the middle. The lid loops open -> closed -> open.
 *
 * Colour: the box is ONE fixed colour (BOX). Every shade of it is that same
 * colour with black/white laid over it, so it looks identical in light and
 * dark themes and never depends on a theme variable.
 */
const BOX = "#bf8f5e"; // cardboard
const INK = "#f6e7d0"; // cream, for the number on the back wall
const TAPE = "#e9d7a8";

// Each flap is 320 wide (half the box). When open, 150 of it stays in view.
const OPEN_VISIBLE = 150;
const SLIDE = 320 - OPEN_VISIBLE; // how far a flap travels

/** A page lying flat on the floor, in perspective, with a bite taken out of its right edge. */
function BittenPage() {
  // Perspective trapezoid: narrow at the back (v = 0), wide at the front (v = 1).
  const left = (v: number) => 13 * (1 - v);
  const right = (v: number) => 59 + 17 * v;
  const pt = (u: number, v: number) => ({ x: left(v) + u * (right(v) - left(v)), y: v * 34 });

  // Top face, with three tooth-mark scallops cut into the right edge.
  const face =
    "M13 0 H59 L60.6 3.6 " +
    "A5.6 5.6 0 0 0 55.6 10.6 " +
    "A5.6 5.6 0 0 1 55 18.2 " +
    "A5.6 5.6 0 0 0 61 25 " +
    "L71.5 29.5 L76 34 H0 Z";

  // Printed lines follow the perspective, so they converge like the page edges do.
  const lines: [number, number, number][] = [
    [0.12, 0.78, 0.2],
    [0.12, 0.62, 0.38],
    [0.12, 0.5, 0.56],
    [0.12, 0.82, 0.78],
  ];

  return (
    <g transform="translate(226 296) rotate(-3)">
      {/* soft contact shadow */}
      <ellipse cx="38" cy="37" rx="42" ry="5" fill="#000" fillOpacity="0.35" filter="url(#nf-blur)" />
      {/* page thickness */}
      <path d={face} transform="translate(0 2.6)" fill="var(--receipt)" />
      <path d={face} transform="translate(0 2.6)" fill="#000" fillOpacity="0.32" />
      {/* top face */}
      <path d={face} fill="var(--receipt)" />
      <path d={face} fill="url(#nf-paper-shade)" />
      <path d={face} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="0.8" strokeLinejoin="round" />
      {/* printed lines */}
      <g stroke="var(--faint)" strokeWidth="1.4" strokeLinecap="round">
        {lines.map(([u0, u1, v]) => {
          const a = pt(u0, v);
          const b = pt(u1, v);
          return <line key={v} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>
    </g>
  );
}

function Rat() {
  const RAT = "#9b9ba3";
  const PINK = "#dba3a0";
  return (
    <g transform="translate(300 308)">
      <ellipse cx="34" cy="37" rx="36" ry="5" fill="#000" fillOpacity="0.38" filter="url(#nf-blur)" />
      <g className="nf-rat">
        <path d="M52 26 Q74 16 68 38" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="32" cy="24" rx="24" ry="12" fill={RAT} />
        <ellipse cx="32" cy="29" rx="20" ry="6" fill="#fff" fillOpacity="0.1" />
        <path d="M12 21 Q3 21 0 28 Q5 34 14 32 Z" fill={RAT} />
        <circle cx="19" cy="12" r="6" fill={RAT} />
        <circle cx="19" cy="12" r="3.2" fill={PINK} />
        <circle cx="10" cy="24" r="1.7" fill="#15151a" />
        <circle cx="1" cy="28" r="1.8" fill={PINK} />
        <rect x="22" y="33" width="5" height="5" rx="2" fill={RAT} />
        <rect x="42" y="33" width="5" height="5" rx="2" fill={RAT} />
      </g>
    </g>
  );
}

/** One lid flap, drawn in its CLOSED position (x 0..320). Mirrored for the right side. */
function Flap() {
  const ribs = Array.from({ length: 15 }, (_, i) => 20 + i * 19);
  return (
    <>
      <rect width="320" height="360" fill={BOX} />
      <rect width="320" height="360" fill="url(#nf-flap-shade)" />
      {/* corrugation */}
      <g stroke="#000" strokeOpacity="0.07" strokeWidth="1">
        {ribs.map((x) => <line key={x} x1={x} y1="0" x2={x} y2="360" />)}
      </g>
      {/* outer fold */}
      <rect width="12" height="360" fill="#000" fillOpacity="0.16" />
      <line x1="12" y1="0" x2="12" y2="360" stroke="#000" strokeOpacity="0.3" />
      <line x1="13" y1="0" x2="13" y2="360" stroke="#fff" strokeOpacity="0.18" />
      {/* packing tape across the seam */}
      <rect x="294" width="26" height="360" fill={TAPE} fillOpacity="0.82" />
      <rect x="298" width="3" height="360" fill="#fff" fillOpacity="0.35" />
      <line x1="294" y1="0" x2="294" y2="360" stroke="#000" strokeOpacity="0.18" />
      {/* cut edge */}
      <rect x="316" width="4" height="360" fill="#000" fillOpacity="0.28" />
      <rect width="320" height="360" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="2" />
    </>
  );
}

/** Shadow a flap throws into the box. Drawn beneath BOTH flaps so it never tints the other one. */
function FlapShadow() {
  return <rect x="320" width="40" height="360" fill="url(#nf-cast)" />;
}

function BoxScene() {
  const floorLines = [0, 1, 2, 3, 4].map((i) => {
    const t = i / 4;
    return { x1: 230 + 180 * t, x2: OPEN_VISIBLE + 340 * t };
  });
  const floorRows = [268, 292, 322].map((y) => {
    const t = (y - 250) / 110; // 0 at the back wall, 1 at the front edge
    return { y, x1: 230 - 80 * t, x2: 410 + 80 * t };
  });
  const R = 640 - OPEN_VISIBLE;

  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label="An open cardboard box whose lid opens and closes, with a small rat nibbling a page beside the number 404."
      className="block h-auto w-full"
    >
      <defs>
        <radialGradient id="nf-glow" cx="50%" cy="50%" r="65%">
          <stop offset="0" stopColor={INK} stopOpacity="0.3" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nf-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0.66" />
        </linearGradient>
        <linearGradient id="nf-floor" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="nf-wall-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="nf-wall-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000" stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="nf-flap-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="nf-cast" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nf-paper-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <filter id="nf-blur" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* inside of the box */}
      <rect width="640" height="360" fill={BOX} />
      <rect x="230" y="110" width="180" height="140" fill="#000" fillOpacity="0.62" />
      <rect x="230" y="110" width="180" height="140" fill="url(#nf-glow)" />
      <polygon points={`${OPEN_VISIBLE},0 ${R},0 410,110 230,110`} fill="url(#nf-ceil)" />
      <polygon points={`${OPEN_VISIBLE},360 ${R},360 410,250 230,250`} fill="url(#nf-floor)" />
      <polygon points={`${OPEN_VISIBLE},0 230,110 230,250 ${OPEN_VISIBLE},360`} fill="url(#nf-wall-l)" />
      <polygon points={`${R},0 410,110 410,250 ${R},360`} fill="url(#nf-wall-r)" />

      {/* floor seams */}
      <g stroke="#000" strokeOpacity="0.2" strokeWidth="1">
        {floorLines.map((l) => <line key={l.x1} x1={l.x1} y1="250" x2={l.x2} y2="360" />)}
        {floorRows.map((r) => <line key={r.y} x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} />)}
      </g>

      {/* box corner creases */}
      <g fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="230" y="110" width="180" height="140" />
        <line x1={OPEN_VISIBLE} y1="0" x2="230" y2="110" />
        <line x1={R} y1="0" x2="410" y2="110" />
        <line x1={OPEN_VISIBLE} y1="360" x2="230" y2="250" />
        <line x1={R} y1="360" x2="410" y2="250" />
      </g>

      <text x="320" y="196" textAnchor="middle" fontSize="64" fontWeight="500" fill={INK} style={{ fontFamily: "var(--font-display)" }}>404</text>

      <BittenPage />
      <Rat />

      {/* the lid: two flaps that slide shut (shadows first, then the flaps themselves) */}
      <g className="nf-lid nf-lid-l"><FlapShadow /></g>
      <g className="nf-lid nf-lid-r"><g transform="translate(640 0) scale(-1 1)"><FlapShadow /></g></g>
      <g className="nf-lid nf-lid-l"><Flap /></g>
      <g className="nf-lid nf-lid-r"><g transform="translate(640 0) scale(-1 1)"><Flap /></g></g>
    </svg>
  );
}

export function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <style>{`
        /* 8s loop: open (held) -> close -> closed (held) -> open */
        @keyframes nf-lid-l { 0%, 36% { transform: translateX(-${SLIDE}px); } 56%, 80% { transform: translateX(0); } 100% { transform: translateX(-${SLIDE}px); } }
        @keyframes nf-lid-r { 0%, 36% { transform: translateX(${SLIDE}px); } 56%, 80% { transform: translateX(0); } 100% { transform: translateX(${SLIDE}px); } }
        @keyframes nf-nibble { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .nf-lid-l { transform: translateX(-${SLIDE}px); animation: nf-lid-l 8s cubic-bezier(.65, 0, .35, 1) infinite; }
        .nf-lid-r { transform: translateX(${SLIDE}px); animation: nf-lid-r 8s cubic-bezier(.65, 0, .35, 1) infinite; }
        .nf-rat { animation: nf-nibble 0.7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .nf-lid, .nf-rat { animation: none; } }
      `}</style>
      <div aria-hidden className="desk-grid pointer-events-none fixed inset-0 -z-50" />
      <div aria-hidden className="desk-vignette pointer-events-none fixed inset-0 -z-40" />

      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[18px] bg-card/90 px-3 py-2 shadow-soft backdrop-blur-md sm:px-4">
          <Logo />
          <nav className="flex items-center gap-1" aria-label="Current page">
            <span aria-current="page" className="rounded-[12px] bg-primary-soft px-4 py-2 font-mono text-sm text-primary">404</span>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-3 pt-8 pb-16 sm:px-6">
        <div className="page mx-auto max-w-3xl overflow-hidden">
          <BoxScene />
          <div className="px-6 pt-8 pb-10 text-center sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Error 404 · Page not found</p>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl">This page has gone missing.</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              The link may be out of date, or the page may have been moved or removed. Everything else is right where you left it.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/" className={btn.primary}><Home className="size-4" /> Back to home</Link>
              <Link to="/features" className={btn.ghost}>See features <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
