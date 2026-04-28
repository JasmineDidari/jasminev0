import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/certification-journey")({
  head: () => ({
    meta: [
      { title: "Certification Journey — EUROstack" },
      {
        name: "description",
        content:
          "Roadmap från teknisk audit och legal vetting till EUROstack Badge.",
      },
      { property: "og:title", content: "EUROstack Certification Journey" },
      {
        property: "og:description",
        content: "Se stegen mot verifierad EU-compliance och digital suveränitet.",
      },
    ],
  }),
  component: CertificationJourneyPage,
});

const steps = [
  {
    icon: Wrench,
    title: "Technical Audit",
    text: "Vi granskar leverantörer, data residency, kritikalitet, systemberoenden och tekniska risker mot NIS2, DORA och Data Act.",
  },
  {
    icon: FileCheck2,
    title: "Legal Vetting",
    text: "Avtal, DPA, SCC, GDPR-assurance och suveränitetsrisker kontrolleras så att blockerande punkter blir tydliga.",
  },
  {
    icon: BadgeCheck,
    title: "EUROstack Badge",
    text: "När score, dokumentation och åtgärdsplan uppfyller kraven kan organisationen bli EUROstack Verified.",
  },
];

function CertificationJourneyPage() {
  const { suppliers, quizAnswers } = useAppState();

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
        <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground">
          ← Till dashboard
        </Link>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Page 5 · Certification Journey
            </span>
            <h1 className="mt-5 text-balance text-4xl font-black tracking-tight md:text-6xl">
              Vägen till{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                EUROstack Badge
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
              En tydlig roadmap från teknisk leverantörsanalys till juridisk granskning och verifierad compliance-status.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Data från prototypflödet
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="Suppliers" value={suppliers.length} />
              <Metric label="Quiz-svar" value={quizAnswers.length} />
            </div>
          </div>
        </motion.section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="relative rounded-3xl border border-border bg-[image:var(--gradient-card)] p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary">
                  Steg {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </motion.div>
            );
          })}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Nästa steg</h2>
              <p className="mt-2 text-muted-foreground">
                Fortsätt från dashboarden med blockers, åtgärdslista och EU-matchningar som underlag för audit.
              </p>
            </div>
            <Link
              to="/results"
              className="inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-6 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)]"
            >
              Öppna Value Engine
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}