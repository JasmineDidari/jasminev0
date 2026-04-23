import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — EUROstack Verified" },
      {
        name: "description",
        content: "Snabba hook-frågor om din digitala suveränitet och EU-stack.",
      },
      { property: "og:title", content: "EUROstack Quiz" },
      {
        property: "og:description",
        content: "Är du EUROstack Verified? Svara på 5 frågor.",
      },
    ],
  }),
  component: QuizPage,
});

type Q = { q: string; options: { label: string; score: number }[] };

const QUESTIONS: Q[] = [
  {
    q: "Vet du var ert företags data faktiskt lagras?",
    options: [
      { label: "Ja, exakt vilka datacenter", score: 2 },
      { label: "Ungefär — i 'molnet'", score: 1 },
      { label: "Nej, ingen aning", score: 0 },
    ],
  },
  {
    q: "Hur många av era kärnverktyg är EU-baserade?",
    options: [
      { label: "De flesta", score: 2 },
      { label: "Några", score: 1 },
      { label: "Inga", score: 0 },
    ],
  },
  {
    q: "Är ni medvetna om CLOUD Act och dess konsekvenser?",
    options: [
      { label: "Ja, vi har analyserat risken", score: 2 },
      { label: "Hört talas om det", score: 1 },
      { label: "Vad är CLOUD Act?", score: 0 },
    ],
  },
  {
    q: "Har ni en plan för NIS2-efterlevnad?",
    options: [
      { label: "Ja, vi är redo", score: 2 },
      { label: "Vi har börjat", score: 1 },
      { label: "Inte än", score: 0 },
    ],
  },
  {
    q: "Skulle ni klara er om ert amerikanska SaaS-konto stängdes imorgon?",
    options: [
      { label: "Absolut, vi har backup", score: 2 },
      { label: "Det skulle bli jobbigt", score: 1 },
      { label: "Det vore en katastrof", score: 0 },
    ],
  },
];

function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const progress = ((step + (done ? 1 : 0)) / total) * 100;

  function answer(score: number) {
    const next = [...answers, score];
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  const score = answers.reduce((a, b) => a + b, 0);
  const max = total * 2;
  const verdict =
    score >= max * 0.7
      ? { title: "Stark stack 💪", text: "Du är på god väg mot full EU-suveränitet." }
      : score >= max * 0.4
        ? { title: "Halvvägs där 🌗", text: "Det finns mycket att vinna på en översyn." }
        : { title: "Hög exponering ⚠️", text: "Din stack är till stor del icke-europeisk." };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Avbryt
        </Link>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Fråga {Math.min(step + 1, total)} av {total}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-[image:var(--gradient-hero)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10"
            >
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                {QUESTIONS[step].q}
              </h2>
              <div className="mt-8 grid gap-3">
                {QUESTIONS[step].options.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => answer(o.score)}
                    className="group flex items-center justify-between rounded-2xl border-2 border-border bg-background px-6 py-4 text-left font-medium transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <span>{o.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  onClick={() => {
                    setAnswers(answers.slice(0, -1));
                    setStep(step - 1);
                  }}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Tillbaka
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-soft)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight">{verdict.title}</h2>
              <p className="mt-3 text-muted-foreground">{verdict.text}</p>
              <div className="mt-6 inline-block rounded-2xl bg-secondary px-6 py-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                  Din score
                </div>
                <div className="text-3xl font-black text-secondary-foreground">
                  {score} / {max}
                </div>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Nästa steg: registrera era leverantörer för att få en konkret riskanalys.
              </p>
              <button
                onClick={() => navigate({ to: "/suppliers" })}
                className="group mt-6 inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-8 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)]"
              >
                Registrera leverantörer
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}