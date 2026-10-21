import { ArrowUpRight, Check } from "lucide-react";
import { KEZPOS } from "./config";
import { Reveal } from "./reveal";
import { Chapter, Heading, btn } from "./ui";

export function Pricing() {
  return <section className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-6">
    <Chapter n="05">A fair price</Chapter>
    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><Heading>Simple plans.<br />No fine print.</Heading><p className="max-w-xs text-sm leading-7 text-muted-foreground">Start with a 7-day free trial. All plans include the full KezPos experience, so you only choose how long you stay.</p></div>
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {KEZPOS.plans.map((plan, i) => <Reveal key={plan.months} delay={i * 70}>
        <article className="receipt-paper torn-bottom flex h-full flex-col px-7 pt-7 pb-11">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase text-muted-foreground"><span>KezPos subscription</span><span>No. 00{i + 1}</span></div>
          <h3 className="mt-6 font-display text-2xl">{plan.name}</h3>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{plan.months === 1 ? "1 month" : `${plan.months} months`} · Full access</p>
          <div className="my-6 border-y border-dashed py-6"><span className="font-mono text-sm">Ksh </span><span className="font-display text-4xl">{plan.price.toLocaleString()}</span><p className="mt-2 text-xs text-muted-foreground">{plan.months === 1 ? "Billed monthly" : `For ${plan.months} months`}</p></div>
          <div className="space-y-3 text-sm">{["7-day free trial", "All features included", "Android + Windows", "Cloud sync included"].map(text => <p key={text} className="flex items-center gap-2"><Check className="size-3.5 text-good" />{text}</p>)}</div>
          <p className="mt-6 mb-7 min-h-12 text-xs leading-6 text-muted-foreground">{plan.comment}</p>
          <a href={`https://wa.me/${KEZPOS.whatsapp}?text=${encodeURIComponent(`Hi, I'd like the ${plan.months}-month KezPos plan at Ksh ${plan.price}.`)}`} target="_blank" rel="noreferrer" className={`${i === 2 ? btn.primary : btn.ghost} mt-auto h-11 text-sm`}>Choose plan <ArrowUpRight className="size-4" /></a>
        </article>
      </Reveal>)}
    </div>
  </section>;
}
