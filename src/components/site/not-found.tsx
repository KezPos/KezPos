import { Link } from "@tanstack/react-router";
import { ArrowRight, Home } from "lucide-react";
import { Logo } from "./shell";
import { ThemeToggle } from "./theme";
import { btn } from "./ui";

/* ──────────────────────────────────────────────────────────────────────────
   404 scene: a cardboard box of REPORTS, doors swung open, a rat running in
   and out, a spider bobbing on its thread, torn reports on the floor.

   HOW IT'S BUILT
   Everything is positioned in a tiny 3D world and projected onto the 2D SVG,
   so the box, doors and paper all share the same perspective.
     u = along the labelled side of the box
     v = along the open end of the box
     y = up
   Colours are fixed (not theme variables) so it looks the same in light/dark.
   ────────────────────────────────────────────────────────────────────────── */

const BOX = "#bf8f5e"; // cardboard. Every shade below is this colour + black/white
const TAPE = "#e9d7a8";
const STAMP = "#2b1d10"; // ink for the stencil on the box
const PAPER = "#f4efe3";
const PAPER_INK = "#a29a88";

/* ── 3D → 2D ─────────────────────────────────────────────────────────────── */

const L = 200; // box length (u)
const W = 210; // box width = the open end (v)
const H = 150; // box height
const T = 5; // cardboard thickness
const DOOR_OPEN = 150; // degrees each door is swung open (180 = flat against the box)

const YAW = (46 * Math.PI) / 180;
const PITCH = (23 * Math.PI) / 180;
const CAM_DIST = 620;
const CAM_H = 300;

/** Raw perspective projection, before fitting to the canvas. */
function raw(u: number, v: number, y: number): [number, number, number] {
  const xc = -Math.cos(YAW) * u + Math.sin(YAW) * v;
  const depth = Math.sin(YAW) * u + Math.cos(YAW) * v + CAM_DIST;
  const up = y - CAM_H;
  const zc = -up * Math.sin(PITCH) + depth * Math.cos(PITCH);
  const yc = up * Math.cos(PITCH) + depth * Math.sin(PITCH);
  return [xc / zc, -yc / zc, zc];
}

// Fit the whole scene (box, open doors, floor area for papers) into the canvas.
const VIEW_W = 640;
const VIEW_H = 380;
const fit = (() => {
  const key: [number, number, number][] = [
    [0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0],
    [0, 0, H], [L, 0, H], [L, W, H], [0, W, H],
    [-60, -112, 0], [-60, W + 112, 0], // door tips
    [-205, 20, 0], [-205, W - 20, 0], // paper area in front of the box
  ];
  const pts = key.map(([u, v, y]) => raw(u, v, y));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const margin = 26;
  const S = Math.min((VIEW_W - 2 * margin) / (maxX - minX), (VIEW_H - 2 * margin) / (maxY - minY));
  return { S, ox: VIEW_W / 2 - ((minX + maxX) / 2) * S, oy: VIEW_H / 2 - ((minY + maxY) / 2) * S };
})();

type V3 = [number, number, number];
const P = ([u, v, y]: V3): [number, number] => {
  const [rx, ry] = raw(u, v, y);
  return [fit.ox + fit.S * rx, fit.oy + fit.S * ry];
};
/** Pixels per world unit at a spot, so things further away are drawn smaller. */
const unitAt = (u: number, v: number, y: number) => fit.S / raw(u, v, y)[2];

const f1 = (n: number) => n.toFixed(1);
const pts = (list: V3[]) => list.map((p) => P(p).map(f1).join(",")).join(" ");
const d = (list: V3[], close = true) =>
  list.map((p, i) => `${i ? "L" : "M"}${P(p).map(f1).join(" ")}`).join("") + (close ? "Z" : "");

/* ── the box ─────────────────────────────────────────────────────────────── */

const reportFace: V3[] = [[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]];
const endFace: V3[] = [[0, 0, 0], [0, W, 0], [0, W, H], [0, 0, H]];
const opening: V3[] = [[0, T, T], [0, W - T, T], [0, W - T, H - T], [0, T, H - T]];
const topFace: V3[] = [[0, 0, H], [L, 0, H], [L, W, H], [0, W, H]];
const tape: V3[] = [[0, W / 2 - 13, H], [L, W / 2 - 13, H], [L, W / 2 + 13, H], [0, W / 2 + 13, H]];

const farWall: V3[] = [[L - T, T, T], [L - T, W - T, T], [L - T, W - T, H - T], [L - T, T, H - T]];
const sideWall: V3[] = [[0, W - T, T], [L - T, W - T, T], [L - T, W - T, H - T], [0, W - T, H - T]];
const floor: V3[] = [[0, T, T], [L - T, T, T], [L - T, W - T, T], [0, W - T, T]];

/** A door hinged on a vertical edge of the opening, swung `deg` degrees outward. */
function door(side: "left" | "right"): V3[] {
  const a = (DOOR_OPEN * Math.PI) / 180;
  const w = W / 2 - 1.5;
  const hingeV = side === "left" ? 0 : W;
  const dir: [number, number] = side === "left" ? [-Math.sin(a), Math.cos(a)] : [-Math.sin(a), -Math.cos(a)];
  const tip: [number, number] = [dir[0] * w, hingeV + dir[1] * w];
  return [[0, hingeV, 0], [tip[0], tip[1], 0], [tip[0], tip[1], H - 1], [0, hingeV, H - 1]];
}
const doorL = door("left");
const doorR = door("right");

/** Place stencil text on the labelled side. Maps (x→, y↓) in face units onto the face. */
const faceMatrix = (() => {
  const topLeft = P([L, 0, H]);
  const topRight = P([0, 0, H]);
  const bottomLeft = P([L, 0, 0]);
  const a = (topRight[0] - topLeft[0]) / L, b = (topRight[1] - topLeft[1]) / L;
  const c = (bottomLeft[0] - topLeft[0]) / H, dd = (bottomLeft[1] - topLeft[1]) / H;
  return `matrix(${a} ${b} ${c} ${dd} ${f1(topLeft[0])} ${f1(topLeft[1])})`;
})();

/* ── torn reports lying on the floor ─────────────────────────────────────── */

type P2 = [number, number];
const rnd = (seed: number) => {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};
/** A ragged torn edge between two points. */
function jag(a: P2, b: P2, n: number, amp: number, seed: number): P2[] {
  const out: P2[] = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const len = Math.hypot(nx, ny) || 1;
    const k = ((rnd(seed + i) - 0.5) * 2 * amp) / len;
    out.push([a[0] + (b[0] - a[0]) * t + nx * k, a[1] + (b[1] - a[1]) * t + ny * k]);
  }
  return out;
}

type Sheet = { u: number; v: number; deg: number; outline: P2[]; marks: (place: (x: number, y: number) => string) => React.ReactNode };

function renderSheet(s: Sheet, key: string) {
  const r = (s.deg * Math.PI) / 180;
  const at = (x: number, y: number): V3 => [s.u + x * Math.cos(r) - y * Math.sin(r), s.v + x * Math.sin(r) + y * Math.cos(r), 0.6];
  const place = (x: number, y: number) => P(at(x, y)).map(f1).join(",");
  const face = "M" + s.outline.map(([x, y]) => place(x, y)).join("L") + "Z";
  return (
    <g key={key}>
      <path d={face} transform="translate(2 3)" fill="#000" fillOpacity="0.3" filter="url(#nf-blur)" />
      <path d={face} transform="translate(0 1.6)" fill="#6f6857" />
      <path d={face} fill={PAPER} stroke="#000" strokeOpacity="0.25" strokeWidth="0.7" strokeLinejoin="round" />
      <g stroke={PAPER_INK} strokeWidth="1.2" strokeLinecap="round" fill="none">{s.marks(place)}</g>
    </g>
  );
}

const line = (place: (x: number, y: number) => string, x0: number, x1: number, y: number, extra?: object) => (
  <polyline key={`${x0}-${x1}-${y}`} points={`${place(x0, y)} ${place(x1, y)}`} {...extra} />
);
const bar = (place: (x: number, y: number) => string, x: number, w: number, y0: number, h: number) => (
  <polygon key={`b${x}`} points={[[x, y0], [x + w, y0], [x + w, y0 - h], [x, y0 - h]].map(([a, b]) => place(a, b)).join(" ")} fill={PAPER_INK} fillOpacity="0.8" stroke="none" />
);

const sheets: Sheet[] = [
  {
    // the main report: title, text, a little bar chart. Torn down the right side.
    u: -62, v: 70, deg: 24,
    outline: [
      [-40, -28], [32, -28], ...jag([32, -28], [40, -16], 3, 3, 1), [40, -16],
      ...jag([40, -16], [35, 28], 6, 3.2, 7), [35, 28], [-40, 28],
    ],
    marks: (p) => [
      line(p, -32, 6, -19, { strokeWidth: 2.4 }),
      line(p, -32, 24, -10), line(p, -32, 20, -3), line(p, -32, 26, 4),
      bar(p, -32, 7, 22, 8), bar(p, -22, 7, 22, 14), bar(p, -12, 7, 22, 10),
      line(p, 2, 26, 15), line(p, 2, 20, 21),
    ],
  },
  {
    // a half-sheet with a table, torn along the left edge. This is the one being nibbled.
    u: -118, v: 150, deg: -16,
    outline: [
      [-26, -22], [34, -22], [34, 22], [-30, 22],
      ...jag([-30, 22], [-26, -22], 7, 3.4, 21),
    ],
    marks: (p) => [
      line(p, -18, 26, -14, { strokeWidth: 2.2 }),
      line(p, -18, 26, -5), line(p, -18, 26, 3), line(p, -18, 26, 11),
      <polyline key="c1" points={`${p(-2, -8)} ${p(-2, 14)}`} />,
      <polyline key="c2" points={`${p(14, -8)} ${p(14, 14)}`} />,
    ],
  },
  {
    // a scrap near the right-hand door
    u: -78, v: 185, deg: 38,
    outline: [[-18, 14], [20, 14], [17, -4], ...jag([17, -4], [-12, -14], 5, 2.8, 33), [-12, -14]],
    marks: (p) => [line(p, -10, 12, 6), line(p, -10, 6, 0)],
  },
];

/* ── rat and spider ──────────────────────────────────────────────────────── */

/** The rat, facing right, drawn around its feet (0,0). */
function Rat() {
  const RAT = "#9b9ba3";
  const PINK = "#dba3a0";
  return (
    <g transform="translate(-35 -38)">
      <g transform="translate(70 0) scale(-1 1)">
        <g className="nf-bob">
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
    </g>
  );
}

// Where the rat walks: along the floor, from deep inside the box to the paper outside.
const RAT_V = 150;
const RAT_IN: V3 = [118, RAT_V, T];
const RAT_OUT: V3 = [-70, RAT_V, 0];
const RAT_LEN = 40; // world units
const ratPose = (p: V3, flip: 1 | -1) => {
  const [x, y] = P(p);
  const s = (unitAt(...p) * RAT_LEN) / 70;
  return `translate(${f1(x)}px, ${f1(y)}px) rotate(${f1(heading)}deg) scale(${(s * flip).toFixed(3)}, ${s.toFixed(3)})`;
};
// slight tilt so the rat walks "along" the floor rather than sideways
const heading = (() => {
  const a = P(RAT_IN), b = P(RAT_OUT);
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
})();

const ratKeyframes = `
  @keyframes nf-rat-run {
    0%   { transform: ${ratPose(RAT_IN, 1)}; }
    8%   { transform: ${ratPose(RAT_IN, 1)}; }
    30%  { transform: ${ratPose(RAT_OUT, 1)}; }
    52%  { transform: ${ratPose(RAT_OUT, 1)}; }
    56%  { transform: ${ratPose(RAT_OUT, -1)}; }
    78%  { transform: ${ratPose(RAT_IN, -1)}; }
    92%  { transform: ${ratPose(RAT_IN, -1)}; }
    96%  { transform: ${ratPose(RAT_IN, 1)}; }
    100% { transform: ${ratPose(RAT_IN, 1)}; }
  }`;

// The spider hangs from the top edge of the opening.
const SPIDER_ANCHOR = P([0, 150, H - T]);
const THREAD = 46;

function Spider() {
  const BODY = "#e9e2d4";
  return (
    <g transform={`translate(${f1(SPIDER_ANCHOR[0])} ${f1(SPIDER_ANCHOR[1])})`}>
      {/* a little web in the corner */}
      <g stroke={BODY} strokeOpacity="0.35" strokeWidth="0.8" fill="none">
        <path d="M0 0 L-16 4 M0 0 L-9 14 M0 0 L9 14 M0 0 L16 4" />
        <path d="M-10 2.5 Q-4 9 0 8 Q4 9 10 2.5 M-5 1.3 Q-2.5 4 0 4 Q2.5 4 5 1.3" />
      </g>
      <rect className="nf-thread" x="-0.5" y="0" width="1" height={THREAD} fill={BODY} fillOpacity="0.7" />
      <g transform={`translate(0 ${THREAD})`}>
        <g className="nf-spider-body">
          <g stroke={BODY} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M-3 0 L-9 -4 L-12 1 M-3 2 L-10 3 L-12 8 M-3 4 L-9 9 L-10 13 M-2 6 L-5 12 L-5 16" />
            <path d="M3 0 L9 -4 L12 1 M3 2 L10 3 L12 8 M3 4 L9 9 L10 13 M2 6 L5 12 L5 16" />
          </g>
          <ellipse cx="0" cy="4.5" rx="4.2" ry="5.2" fill={BODY} />
          <circle cx="0" cy="-1.2" r="2.6" fill={BODY} />
          <circle cx="-1" cy="-1.6" r="0.6" fill="#1a1410" />
          <circle cx="1" cy="-1.6" r="0.6" fill="#1a1410" />
        </g>
      </g>
    </g>
  );
}

/* ── the scene ───────────────────────────────────────────────────────────── */

function BoxScene() {
  const footprint: V3[] = [[-6, -6, 0], [L + 14, -6, 0], [L + 14, W + 14, 0], [-6, W + 14, 0]];
  const outer = d(endFace) + d(opening);
  const edge = { stroke: "#000", strokeOpacity: 0.45, strokeWidth: 1.6, strokeLinejoin: "round" as const };

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="A cardboard box labelled Reports, doors open. A small rat runs in and out, a spider hangs from the lid, and torn pages are scattered on the floor."
      className="block h-auto w-full"
    >
      <defs>
        <filter id="nf-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="nf-blur-lg" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id="nf-opening"><polygon points={pts(opening)} /></clipPath>
        <linearGradient id="nf-face-shade" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* shadows on the ground */}
      <polygon points={pts(footprint)} fill="#000" fillOpacity="0.26" filter="url(#nf-blur-lg)" />
      <path d={d(doorL.map(([u, v]) => [u, v, 0] as V3).slice(0, 2), false)} stroke="#000" strokeOpacity="0.25" strokeWidth="6" filter="url(#nf-blur)" fill="none" />
      <path d={d(doorR.map(([u, v]) => [u, v, 0] as V3).slice(0, 2), false)} stroke="#000" strokeOpacity="0.25" strokeWidth="6" filter="url(#nf-blur)" fill="none" />

      {/* torn reports */}
      {sheets.map((s, i) => renderSheet(s, `s${i}`))}

      {/* inside the box (seen through the opening) */}
      <g clipPath="url(#nf-opening)">
        <polygon points={pts(floor)} fill={BOX} />
        <polygon points={pts(floor)} fill="#000" fillOpacity="0.34" />
        <polygon points={pts(sideWall)} fill={BOX} />
        <polygon points={pts(sideWall)} fill="#000" fillOpacity="0.52" />
        <polygon points={pts(farWall)} fill={BOX} />
        <polygon points={pts(farWall)} fill="#000" fillOpacity="0.64" />
        <g fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="1.4">
          <path d={d([[L - T, T, T], [L - T, W - T, T], [0, W - T, T]], false)} />
          <path d={d([[L - T, W - T, T], [L - T, W - T, H - T]], false)} />
        </g>
        <Spider />
      </g>

      {/* the rat: walks in and out, passing the lip of the box */}
      <g className="nf-rat">
        <ellipse cx="0" cy="1" rx="26" ry="5" fill="#000" fillOpacity="0.32" filter="url(#nf-blur)" />
        <Rat />
      </g>

      {/* labelled side */}
      <polygon points={pts(reportFace)} fill={BOX} />
      <polygon points={pts(reportFace)} fill="url(#nf-face-shade)" />
      <g transform={faceMatrix}>
        <rect x="14" y="18" width="92" height="22" rx="3" fill="none" stroke={STAMP} strokeOpacity="0.7" strokeWidth="1.8" />
        <text x="60" y="34" textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="2.4" fill={STAMP} fillOpacity="0.8" style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}>REPORTS</text>
        <text x="60" y="100" textAnchor="middle" fontSize="54" fontWeight="600" fill={STAMP} fillOpacity="0.78" style={{ fontFamily: "var(--font-display)" }}>404</text>
        <text x="60" y="120" textAnchor="middle" fontSize="8" letterSpacing="2.2" fill={STAMP} fillOpacity="0.6" style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}>NOT FOUND</text>
      </g>
      <polygon points={pts(reportFace)} fill="none" {...edge} />

      {/* the open end: cardboard rim around the opening */}
      <path d={outer} fillRule="evenodd" fill={BOX} />
      <path d={outer} fillRule="evenodd" fill="#000" fillOpacity="0.1" />
      <path d={outer} fillRule="evenodd" fill="none" {...edge} />

      {/* top of the box, with tape down the middle */}
      <polygon points={pts(topFace)} fill={BOX} />
      <polygon points={pts(topFace)} fill="#fff" fillOpacity="0.13" />
      <polygon points={pts(tape)} fill={TAPE} fillOpacity="0.88" />
      <polygon points={pts(topFace)} fill="none" {...edge} />

      {/* the two doors, swung open on their hinges */}
      {[doorL, doorR].map((dr, i) => (
        <g key={i}>
          <polygon points={pts(dr)} fill={BOX} />
          <polygon points={pts(dr)} fill="#000" fillOpacity="0.16" />
          <polygon points={pts(dr)} fill="none" {...edge} />
        </g>
      ))}
    </svg>
  );
}

export function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <style>{`
        ${ratKeyframes}
        @keyframes nf-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
        @keyframes nf-thread { 0% { transform: scaleY(0.45); } 100% { transform: scaleY(1.2); } }
        @keyframes nf-spider { 0% { transform: translateY(${(-THREAD * 0.55).toFixed(1)}px); } 100% { transform: translateY(${(THREAD * 0.2).toFixed(1)}px); } }
        /* resting pose (also used when the visitor prefers reduced motion): rat beside the paper */
        .nf-rat { transform: ${ratPose(RAT_OUT, 1)}; animation: nf-rat-run 16s ease-in-out infinite; }
        .nf-bob { animation: nf-bob 0.42s ease-in-out infinite; }
        .nf-thread { transform-box: fill-box; transform-origin: 50% 0%; transform: scaleY(0.8); animation: nf-thread 2.8s ease-in-out infinite alternate; }
        .nf-spider-body { animation: nf-spider 2.8s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .nf-rat, .nf-bob, .nf-thread, .nf-spider-body { animation: none; } }
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
          <div className="px-6 pt-2 pb-10 text-center sm:px-10">
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
