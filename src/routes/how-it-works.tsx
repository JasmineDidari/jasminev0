import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, ClipboardList, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "Så fungerar EUROstack Verified" },
      {
        name: "description",
        content: "Så beräknas leverantörsrisk, EU-exponering och compliance-prioritet.",
      },
      { property: "og:title", content: "Så fungerar EUROstack Verified" },
      {
        property: "og:description",
        content: "Förstå modellen bakom quiz, supplier analysis och risknivåer.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    icon: ClipboardList,
    title: "1. Registrera tech suppliers",
    text: "Du börjar med de leverantörer ni faktiskt använder: namn, system, land och om leverantören måste behållas trots icke-EU-risk.",
  },
  {
    icon: BarChart3,
    title: "2. Mätning och quiz",
    text: "Quizet viktar leverantörernas region, datalagring, kritikalitet och om ni har kontroll över dokumentation och avtal.",
  },
  {
    icon: ShieldCheck,
    title: "3. Riskanalys",
    text: "Resultatet visar låg, medel och hög risk med särskild vikt på NIS2, GDPR, Suveränitet, Data Act, EU-certifiering och DORA.",
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
        <Link to="/suppliers" className="text-sm font-semibold text-primary hover:text-foreground">
          Starta analys
        </Link>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          Så beräknas er{" "}
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
            EU-risk
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          EUROstack jämför era tech suppliers mot jurisdiktion, datalagring,
          affärskritikalitet och regulatorisk vikt för att ge en tydlig riktning:
          behåll, reducera risk eller byt till EU-alternativ.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">Compliance-viktning</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["DORA – hög vikt för kritiska system", "NIS2 – leverantörskedja och incidentrisk", "GDPR – persondata och överföring", "Suveränitet – jurisdiktion och ägarskap", "Data Act – kontroll och portabilitet", "EU-certifiering – bevisbar efterlevnad"].map((item) => (
              <div key={item} className="rounded-2xl bg-background/70 px-4 py-3 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </section>

        <Link
          to="/suppliers"
          className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-7 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          Registrera suppliers
          <ArrowRight className="h-5 w-5" />
        </Link>
      </main>
    </div>
  );
}