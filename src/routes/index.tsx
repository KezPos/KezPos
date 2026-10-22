import { pageHead } from "@/components/site/config";
import { ClosingCTA } from "@/components/site/cta";
import { Device, DeviceShowcase, images } from "@/components/site/devices";
import { Pricing } from "@/components/site/pricing";
import { Reveal } from "@/components/site/reveal";
import { SiteShell } from "@/components/site/shell";
import { Chapter, Heading, Page, btn } from "@/components/site/ui";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Download, ScanLine, ShieldCheck, Users, WifiOff } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => pageHead("KezPos — The back office for Kenyan retail", "Sales, stock, customer credit and profit in one offline-first app for Android and Windows. Built for Kenyan retail."),
  component: Index,
});

function Index() {
  return <SiteShell>
    <section className="mx-auto w-full max-w-6xl px-3 pt-7 pb-2 sm:px-6 sm:pt-10">
      <div className="flex items-center justify-between gap-4 border-b border-dashed pb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"><span>A shopkeeper’s companion</span><span>Master ledger · 01</span></div>
      <div className="relative pt-8 text-center sm:pt-10">
        <p className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-good" /> Built for Kenyan retail</p>
        <h1 className="font-display text-[56px] leading-none font-medium sm:text-[80px]">KezPos<span className="text-primary">.</span></h1>
        <p className="mx-auto mt-5 max-w-xl font-display text-2xl leading-tight sm:text-3xl">Run your shop like it has a back office.</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Sales, stock, customer credit, and profit. All in one app.<br className="hidden sm:block" /> Works offline. Syncs itself. Looks good doing it.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/install" className={btn.primary}><Download className="size-4" /> Download KezPos</Link><Link to="/features" className={btn.ghost}>See features <ArrowRight className="size-4" /></Link></div>
      </div>
      <div className="relative mx-auto mt-10 max-w-[820px] px-1 pb-6 sm:mt-12 sm:px-10">
        <div className="pr-[17%] pt-4 sm:pr-[14%]"><Device src={images.sales} label="Sales in the KezPos Windows app" kind="laptop" /></div>
        <Device src={images.home} label="KezPos Android home screen" className="!absolute right-0 bottom-[4.5rem] !w-[21%] sm:right-4" />
        <div className="mt-8 flex items-center justify-between font-mono text-[10px] text-muted-foreground"><span>01 / YOUR SHOP, IN ORDER</span><span>ANDROID + WINDOWS</span></div>
      </div>
    </section>
    <Page folio="02">
      <Chapter n="01">The essentials</Chapter><div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><Heading>Less paperwork.<br />More shopkeeping.</Heading><p className="max-w-xs text-sm leading-7 text-muted-foreground">The things a busy shop needs, thoughtfully brought together.</p></div>
      <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">{[
        { icon: ShieldCheck, title: "Cashier mode", text: "Connect cashier devices over your local network. No shared logins. Your team works the till; you stay in control.", color: "text-primary" },
        { icon: Users, title: "Credit without the notebook", text: "Save a customer once. Log debt sales, track balances, and know exactly who owes what.", color: "text-good" },
        { icon: WifiOff, title: "No signal? No problem.", text: "Keep selling offline. Your data stays on your device and syncs automatically every 10 minutes when you’re back online.", color: "text-warn" },
        { icon: ScanLine, title: "Built for electronics, too", text: "Capture the IMEI, serial number, condition and warranty for every unit. Print it all on the receipt.", color: "text-primary" },
      ].map((item, i) => <Reveal key={item.title} delay={i * 60}><div className="flex items-start gap-4 border-t pt-6"><item.icon className={`mt-1 size-6 shrink-0 ${item.color}`} /><div><h3 className="font-display text-xl">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p></div></div></Reveal>)}</div>
    </Page>
    <section className="book-spread mx-auto grid w-full max-w-6xl md:grid-cols-2">
      <div className="px-6 py-12 sm:px-12 sm:py-16"><Chapter n="02">The paper trail</Chapter><Heading className="mt-6">Every sale.<br />Every serial.<br /><span className="text-primary">All on the receipt.</span></Heading><p className="mt-6 text-sm leading-7 text-muted-foreground">Selling phones or electronics? Every unit gets its own record, with proof of sale and proof of warranty in one slip.</p><ul className="mt-7 space-y-4 text-sm">{["IMEI & serial number per item", "New, used or refurbished condition", "Warranty length printed automatically", "Signature space for both parties"].map(t => <li key={t} className="flex items-center gap-3"><Check className="size-4 text-good" />{t}</li>)}</ul><Link to="/features" className="mt-9 inline-flex items-center gap-2 text-sm text-primary">A closer look <ArrowUpRight className="size-4" /></Link></div>
      <div className="flex items-center justify-center border-t px-8 py-12 md:border-t-0"><Device src={images.receipt} label="Electronics receipt with warranty and serial details" className="!w-[190px]" /></div>
    </section>
    <Page folio="04"><div className="grid items-center gap-10 md:grid-cols-2"><div><Chapter n="03">See the bigger picture</Chapter><Heading className="mt-6">Stop counting coins<br />at midnight.</Heading><p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">See your margins, not just your totals. Track profit, discounts, refunds and stock value. Buy smarter, and close the day with confidence.</p><div className="mt-7 space-y-4 border-y border-dashed py-6 text-sm"><p>Hourly, daily, weekly, monthly & yearly reports</p><p>Detailed PDF and CSV exports</p><p>Low-stock alerts for every product</p></div><Link to="/features" className="mt-7 inline-flex items-center gap-2 text-sm text-primary">Explore all features <ArrowRight className="size-4" /></Link></div><Device src={images.reports} label="KezPos profit and sales reports" className="!w-[190px]" /></div></Page>
    <section className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6"><Chapter n="04">The same shop. Any screen.</Chapter><Heading className="mt-6 text-center">At the counter. At your desk.</Heading><p className="mx-auto mt-4 mb-7 max-w-lg text-center text-sm leading-7 text-muted-foreground">Android or Windows. The same features, the same account, and your business in sync.</p><DeviceShowcase /></section>
    <Pricing /><ClosingCTA />
  </SiteShell>;
}
