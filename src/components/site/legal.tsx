import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteShell } from "./shell";
import { Chapter, Page } from "./ui";
import legal from "./legal-content.json";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const sections = legal[kind];
  return <SiteShell><Page folio={kind === "privacy" ? "P" : "T"}>
    <Chapter n="06">Legal</Chapter><h1 className="mt-6 font-display text-4xl sm:text-5xl">{kind === "privacy" ? "Privacy Policy" : "Terms of Service"}</h1>
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground"><span>Last updated: October 2026</span><span>Effective: October 2026</span><span>{kind === "privacy" ? "Kenya Data Protection Act, 2019" : "Governed by the laws of Kenya"}</span></div>
    <div className="mt-10 grid gap-10 md:grid-cols-[210px_minmax(0,1fr)]">
      <aside><nav aria-label="On this page" className="space-y-3 md:sticky md:top-28">{sections.map((section, i) => <a key={section.title} href={`#section-${i + 1}`} className="block text-xs leading-5 text-muted-foreground hover:text-primary">{section.title}</a>)}</nav></aside>
      <div className="space-y-10">{sections.map((section, i) => <section id={`section-${i + 1}`} key={section.title} className="scroll-mt-28"><h2 className="mb-4 font-display text-2xl">{section.title}</h2><div className="space-y-4 text-sm leading-7 text-muted-foreground">{section.blocks.map((block, j) => block.kind === "p" && "text" in block ? <p key={j}>{block.text}</p> : "items" in block ? <ul key={j} className="list-disc space-y-2 pl-5">{block.items?.map(item => <li key={item}>{item}</li>)}</ul> : null)}</div></section>)}</div>
    </div>
    <div className="mt-12 flex flex-wrap justify-between gap-4 border-t pt-6 text-sm text-primary"><Link to="/" className="flex items-center gap-2"><ArrowLeft className="size-4" /> Back home</Link><Link to={kind === "privacy" ? "/terms" : "/privacy"} className="flex items-center gap-2">{kind === "privacy" ? "Terms of Service" : "Privacy Policy"}<ArrowRight className="size-4" /></Link></div>
  </Page></SiteShell>;
}