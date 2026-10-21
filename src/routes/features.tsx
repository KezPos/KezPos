import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/shell";
import { Page, Heading, Chapter } from "@/components/site/ui";
import { pageHead } from "@/components/site/config";
import { Device, images } from "@/components/site/devices";
import { Check, WifiOff, Users, Printer, Palette, ReceiptText } from "lucide-react";
import { ClosingCTA } from "@/components/site/cta";

const chapters = [
  {
    n: "01",
    tag: "Sales & refunds",
    title: "A checkout that keeps pace.",
    text: "Search, select and sell. Totals and change are calculated for you, and refunds are recorded against the original sale so your books always reconcile.",
    src: images.checkout,
    label: "KezPos checkout",
    items: [
      "Search-as-you-type product lookup",
      "Cart and per-item discounts",
      "Credit sales linked to a customer",
      "Refunds linked to the original sale",
    ],
  },
  {
    n: "02",
    tag: "Inventory",
    title: "Organised stock, accurate records.",
    text: "Group products into categories, set tax once per category, and see at a glance what is running low or has run out. Electronics get the extra detail they need.",
    src: images.inventory,
    label: "KezPos inventory",
    items: [
      "Categories with a tax rate set at category level",
      "Low-stock and out-of-stock tracking",
      "Condition (new, used or refurbished), IMEI or serial number, and notes",
      "Tax per item, or follow the category",
      "Margin shown automatically when cost and price are entered",
    ],
  },
  {
    n: "03",
    tag: "Reports",
    title: "Know what the shop actually earns.",
    text: "Revenue and profit, with the detail behind them: which products move, which earn the most, and which customers you rely on.",
    src: images.reports,
    label: "KezPos reports",
    items: [
      "Revenue, profit, discounts and refund totals",
      "Products: most sold, least sold and most profitable",
      "Customers: most active, what they buy, spend, debt, visits and refunds",
      "Hourly through yearly views, with PDF and CSV export",
    ],
  },
];

const essentials = [
  { icon: Users, title: "Customers and credit", text: "Create, save and edit customer profiles. Track what each customer owes and record repayments straight from their profile." },
  { icon: Printer, title: "Receipts, your way", text: "58mm or 80mm thermal printers. Customise the shop name, footer, refund policy, signature and spacing, and share receipts as images." },
  { icon: Palette, title: "Make it yours", text: "Choose an accent colour and switch between light and dark themes, so the app suits your shop and your eyes." },
  { icon: WifiOff, title: "Works offline", text: "Make sales and manage stock without internet. Data syncs automatically when you reconnect, and you can back up and restore from Settings." },
];

const Bullets = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-7 space-y-4 text-sm">
    {items.map((t) => (
      <li key={t} className="flex items-start gap-3"><Check className="mt-0.5 size-4 shrink-0 text-good" />{t}</li>
    ))}
  </ul>
);

export const Route = createFileRoute("/features")({
  head: () => pageHead("Features — KezPos", "Sales and refunds, inventory, customer credit, reports, cashier mode, KRA eTIMS and M-Pesa in KezPos for Android and Windows."),
  component: () => (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-5 pt-10 pb-5 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Inside KezPos</p>
        <h1 className="mt-5 font-display text-4xl sm:text-6xl">Everything the shop needs.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground">Sales, stock, customers, tax compliance and mobile payments, in one app for Android and Windows.</p>
      </section>

      {chapters.map((c, i) => (
        <Page key={c.n} folio={c.n}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <Chapter n={c.n}>{c.tag}</Chapter>
              <Heading className="mt-6">{c.title}</Heading>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{c.text}</p>
              <Bullets items={c.items} />
            </div>
            <Device src={c.src} label={c.label} className="!w-[190px]" />
          </div>
        </Page>
      ))}

      <Page folio="04">
        <Chapter n="04">The everyday details</Chapter>
        <div className="mt-8 grid gap-9 sm:grid-cols-2">
          {essentials.map((item) => (
            <div key={item.title} className="border-t pt-6">
              <item.icon className="size-6 text-primary" />
              <h2 className="mt-5 font-display text-2xl">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Page>

      <Page folio="05">
        <div className="grid items-center gap-9 md:grid-cols-2">
          <div>
            <Chapter n="05">Your team</Chapter>
            <Heading className="mt-6">Their till.<br />Your control.</Heading>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">Cashier mode connects a cashier’s device to your admin device with limited access, so your team can serve customers while the rest stays in your hands.</p>
            <Bullets items={["Cashiers can make sales", "Create and edit customers", "Stock, pricing and settings stay with the admin", "No shared account credentials"]} />
          </div>
          <Device src={images.cashier} kind="laptop" label="KezPos Windows cashier view" />
        </div>
      </Page>

      <Page folio="06">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <Chapter n="06">Tax compliance</Chapter>
            <Heading className="mt-6">KRA eTIMS, integrated.</Heading>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">KezPos connects to KRA eTIMS through DigiTax, so receipts and refunds are submitted as part of normal selling. There is nothing extra to do at the counter.</p>
            <Bullets items={["Receipts and refunds submitted automatically", "Sales made offline are retried automatically once you are back online", "We handle the setup; your credentials are stored securely on our servers, not on your device"]} />
          </div>
          <div className="border-t pt-6 md:border-t-0 md:pt-0">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"><ReceiptText className="size-4 text-primary" /> How setup works</div>
            <ol className="mt-6 space-y-6">
              {[
                ["Send us your details", "Share the business and KRA information needed for eTIMS."],
                ["We configure it", "We connect your shop through DigiTax and store the credentials securely."],
                ["Sell as usual", "Receipts and refunds are submitted automatically. If you are offline, they are queued and retried."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="font-display text-2xl text-primary">0{i + 1}</span>
                  <div><h3 className="font-display text-lg">{t}</h3><p className="mt-1.5 text-sm leading-7 text-muted-foreground">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Page>

      <Page folio="07">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="md:order-2">
            <Chapter n="07">Payments</Chapter>
            <Heading className="mt-6">M-Pesa, built into the sale.</Heading>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">Request payment from a customer’s phone, or open payments you have already received and attach them to a sale. Your records and your M-Pesa stay in step.</p>
            <Bullets items={["Send an STK push request from the sale", "View received M-Pesa payments", "Attach a received payment to a sale", "We handle the setup; your credentials stay on our servers, not on your device"]} />
          </div>
          <Device src={images.mpesa} label="KezPos M-Pesa received payments" className="!w-[190px]" />
        </div>
      </Page>

      <ClosingCTA />
    </SiteShell>
  ),
});
