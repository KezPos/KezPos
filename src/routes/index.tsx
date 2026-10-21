import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, WifiOff, Users, ShieldCheck, ScanLine, Check, ArrowUpRight, FileCheck2, Smartphone } from "lucide-react";
import { SiteShell } from "@/components/site/shell";
import { Chapter, Heading, Page, btn } from "@/components/site/ui";
import { pageHead } from "@/components/site/config";
import { Device, DeviceShowcase, images } from "@/components/site/devices";
import { Reveal } from "@/components/site/reveal";
import { Pricing } from "@/components/site/pricing";
import { ClosingCTA } from "@/components/site/cta";

export const Route = createFileRoute("/")({
  head: () => pageHead("KezPos — The back office for Kenyan retail", "Sales, stock, customers and profit in one offline-first app for Android and Windows, with KRA eTIMS and M-Pesa built in. Made for Kenyan retail."),
  component: Index,
});

function Index() {
  return <SiteShell>
    <section className="mx-auto w-full max-w-6xl px-3 pt-7 pb-2 sm:px-6 sm:pt-10">
      <div className="flex items-center justify-between gap-4 border-b border-dashed pb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"><span>A shopkeeper’s companion</span><span>Made in Kenya · Vol. 01</span></div>
      <div className="relative pt-8 text-center sm:pt-10">
        <p className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-good" /> Built for Kenyan retail</p>
        <h1 className="font-display text-[56px] leading-none font-medium sm:text-[80px]">KezPos<span className="text-primary">.</span></h1>
        <p className="mx-auto mt-5 max-w-xl font-display text-2xl leading-tight sm:text-3xl">Run your shop like it has a back office.</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Sales, stock, customers and profit in one app, with KRA eTIMS and M-Pesa built in.<br className="hidden sm:block" /> Works offline and syncs when you reconnect.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/install" className={btn.primary}><Download className="size-4" /> Download KezPos</Link><Link to="/features" className={btn.ghost}>See features <ArrowRight className="size-4" /></Link></div>
      </div>
      <div className="relative mx-auto mt-10 max-w-[820px] px-1 pb-6 sm:mt-12 sm:px-10">
        <div className="pr-[17%] pt-4 sm:pr-[14%]"><Device src={images.sales} label="Sales in the KezPos Windows app" kind="laptop" /></div>
        <Device src={images.home} label="KezPos Android home screen" className="!absolute right-0 bottom-4 !w-[20%] min-w-[85px] sm:right-4" />
        <div className="mt-8 flex items-center justify-between font-mono text-[10px] text-muted-foreground"><span>01 / YOUR SHOP, IN ORDER</span><span>ANDROID + WINDOWS</span></div>
      </div>
    </section>
    <Page folio="02">
      <Chapter n="01">The essentials</Chapter><div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><Heading>Less paperwork.<br />More shopkeeping.</Heading><p className="max-w-xs text-sm leading-7 text-muted-foreground">The things a busy shop needs, thoughtfully brought together.</p></div>
      <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">{[
        { icon: Users, title: "Customers and credit", text: "Save customers once and edit them any time. Log credit sales, track balances and see exactly who owes what.", color: "text-good" },
        { icon: ShieldCheck, title: "Cashier mode", text: "Give your team limited access to make sales and manage customers. Stock, pricing and settings stay with you.", color: "text-primary" },
        { icon: FileCheck2, title: "KRA eTIMS", text: "Receipts and refunds are submitted through DigiTax automatically. If you are offline, they are queued and retried.", color: "text-primary" },
        { icon: Smartphone, title: "M-Pesa", text: "Send an STK push from the sale, or attach a payment you have already received.", color: "text-good" },
        { icon: ScanLine, title: "Built for electronics", text: "Record condition, IMEI or serial number, and notes for each unit, and see your margin as you price it.", color: "text-primary" },
        { icon: WifiOff, title: "Works offline", text: "Keep selling without a connection. Your data stays on your device and syncs when you are back online.", color: "text-warn" },
      ].map((item, i) => <Reveal key={item.title} delay={i * 60}><div className="flex items-start gap-4 border-t pt-6"><item.icon className={`mt-1 size-6 shrink-0 ${item.color}`} /><div><h3 className="font-display text-xl">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p></div></div></Reveal>)}</div>
    </Page>
    <section className="book-spread mx-auto grid w-full max-w-6xl md:grid-cols-2">
      <div className="px-6 py-12 sm:px-12 sm:py-16"><Chapter n="02">The paper trail</Chapter><Heading className="mt-6">Every sale.<br />Every serial.<br /><span className="text-primary">All on the receipt.</span></Heading><p className="mt-6 text-sm leading-7 text-muted-foreground">Selling phones or electronics? Each unit has its own record, with proof of sale and warranty on a single receipt that you can customise.</p><ul className="mt-7 space-y-4 text-sm">{["IMEI and serial number per item", "New, used or refurbished condition", "Warranty length printed automatically", "Signature space for both parties"].map(t => <li key={t} className="flex items-center gap-3"><Check className="size-4 text-good" />{t}</li>)}</ul><Link to="/features" className="mt-9 inline-flex items-center gap-2 text-sm text-primary">A closer look <ArrowUpRight className="size-4" /></Link></div>
      <div className="flex items-center justify-center border-t px-8 py-12 md:border-t-0"><Device src={images.receipt} label="Electronics receipt with warranty and serial details" className="!w-[190px]" /></div>
    </section>
    <Page folio="04"><div className="grid items-center gap-10 md:grid-cols-2"><div><Chapter n="03">See the bigger picture</Chapter><Heading className="mt-6">Clear numbers.<br />Clearer decisions.</Heading><p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">Follow revenue and profit, and see the detail behind them: your best-selling and most profitable products, and the customers who buy most often.</p><div className="mt-7 space-y-4 border-y border-dashed py-6 text-sm"><p>Revenue and profit, from hourly to yearly</p><p>Most sold, least sold and most profitable products</p><p>Customer spend, debt, visits and refunds</p><p>PDF and CSV exports</p></div><Link to="/features" className="mt-7 inline-flex items-center gap-2 text-sm text-primary">Explore all features <ArrowRight className="size-4" /></Link></div><Device src={images.reports} label="KezPos profit and sales reports" className="!w-[190px]" /></div></Page>
    <Page folio="05"><div className="grid items-center gap-10 md:grid-cols-2"><Device src={images.mpesa} label="KezPos M-Pesa received payments" className="!w-[190px]" /><div><Chapter n="04">Payments and compliance</Chapter><Heading className="mt-6">M-Pesa and KRA eTIMS,<br />part of the sale.</Heading><p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">Request payment from a customer’s phone or attach one you have already received. Receipts and refunds are submitted to KRA through DigiTax. We handle the setup for you.</p><ul className="mt-7 space-y-4 text-sm">{["STK push from the sale", "Received payments attached to sales", "eTIMS receipts and refunds submitted automatically", "Offline sales retried when you reconnect"].map(t => <li key={t} className="flex items-center gap-3"><Check className="size-4 shrink-0 text-good" />{t}</li>)}</ul><Link to="/features" className="mt-7 inline-flex items-center gap-2 text-sm text-primary">Learn more <ArrowRight className="size-4" /></Link></div></div></Page>
    <section className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6"><Chapter n="05">The same shop. Any screen.</Chapter><Heading className="mt-6 text-center">At the counter. At your desk.</Heading><p className="mx-auto mt-4 mb-7 max-w-lg text-center text-sm leading-7 text-muted-foreground">Android or Windows. The same features, the same account, and your business in sync.</p><DeviceShowcase /></section>
    <Pricing /><ClosingCTA />
  </SiteShell>;
}
