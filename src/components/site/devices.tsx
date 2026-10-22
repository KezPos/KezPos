import home from "@/assets/app-home.png.asset.json";
import checkout from "@/assets/checkout.png.asset.json";
import receipt from "@/assets/elecreceipt.png.asset.json";
import inventory from "@/assets/inventory.png.asset.json";
import cashier from "@/assets/laptop_cashier.png.asset.json";
import sales from "@/assets/laptop_sales.png.asset.json";
import reports from "@/assets/reports.png.asset.json";
import { cn } from "@/lib/utils";
import { Maximize2, Monitor, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

export const images = { home: home.url, checkout: checkout.url, receipt: receipt.url, reports: reports.url, inventory: inventory.url, sales: sales.url, cashier: cashier.url };

export function Device({ src, label, kind = "phone", className }: { src: string; label: string; kind?: "phone" | "laptop"; className?: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <figure className={cn("device-fig relative mx-auto", kind === "phone" ? "w-[210px] max-w-full" : "w-full max-w-[680px]", className)}>
      <div className={kind === "phone" ? "phone-frame" : "laptop-frame"}><img src={src} alt={label} loading="lazy" width={kind === "phone" ? 720 : 1366} height={kind === "phone" ? 1640 : 768} /></div>
      {kind === "laptop" && <div aria-hidden className="laptop-base" />}
      <Button onClick={() => setOpen(true)} aria-label={`Enlarge ${label}`} title={`Enlarge ${label}`} style={{ width: "clamp(22px, 11cqw, 32px)", height: "clamp(22px, 11cqw, 32px)" }} className="absolute right-[3cqw] bottom-[4cqw] rounded-full bg-card/95 p-0"><Maximize2 className="size-3.5" /></Button>
    </figure>
    {open && <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-5 backdrop-blur-sm" onClick={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <Button autoFocus aria-label="Close image" onClick={() => setOpen(false)} className="absolute top-5 right-5 size-11 p-0"><X className="size-5" /></Button>
      <img src={src} alt={label} className="max-h-[88vh] max-w-[94vw] object-contain" />
    </div>}
  </>;
}

export function DeviceShowcase() {
  const [kind, setKind] = useState<"phone" | "laptop">("laptop");
  return <div className="min-w-0">
    <div className="mb-9 flex justify-center gap-2" role="group" aria-label="Device view">
      <Button aria-pressed={kind === "phone"} variant={kind === "phone" ? "soft" : "ghost"} className="h-10 px-4 text-sm" onClick={() => setKind("phone")}><Smartphone className="size-4" /> Phone</Button>
      <Button aria-pressed={kind === "laptop"} variant={kind === "laptop" ? "soft" : "ghost"} className="h-10 px-4 text-sm" onClick={() => setKind("laptop")}><Monitor className="size-4" /> Windows</Button>
    </div>
    <div className="flex min-h-[490px] items-center px-3 sm:px-8"><Device src={kind === "phone" ? images.home : images.sales} label={kind === "phone" ? "KezPos home on Android" : "KezPos sales on Windows"} kind={kind} /></div>
  </div>;
}
