import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  HelpCircle,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import {
  useAppState,
  type DataType,
  type ExitReadiness,
  type Industry,
  type MainDriver,
  type Nis2Strictness,
  type StrategicQuizState,
} from "@/lib/app-state";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Strategic Quiz — EUROstack" },
      {
        name: "description",
        content: "Samla strategisk kontext inför EU supplier-analys och certifiering.",
      },
      { property: "og:title", content: "EUROstack Strategic Quiz" },
      {
        property: "og:description",
        content: "Bransch, datatyper, EU-lagring, exit-strategi och NIS2-nivå.",
      },
    ],
  }),
  component: QuizPage,
});

const industries: Industry[] = ["Finans", "Hälsa", "Offentlig sektor", "SaaS", "Industri", "Annat"];
const dataTypes: DataType[] = [
  "Persondata",
  "Finansiell data",
  "Kunddata",
  "Hälsodata",
  "Källkod",
  "Operativ data",
];
const exitOptions: ExitReadiness[] = ["Låg", "Medel", "Hög"];
const nis2Options: Nis2Strictness[] = ["Inte alls", "Delvis", "Strikt"];
const driverOptions: MainDriver[] = ["Compliance", "Security", "Cost", "Sovereignty"];

function QuizPage() {
  const navigate = useNavigate();
  const { strategicQuiz, setStrategicQuiz, resetStrategicQuiz } = useAppState();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<StrategicQuizState>({
    ...strategicQuiz,
    dataTypes: strategicQuiz.dataTypes ?? [],
  });

  useEffect(() => {
    resetStrategicQuiz();
    setDraft({ dataTypes: [] });
  }, [resetStrategicQuiz]);

  const total = 6;
  const progress = ((step + 1) / total) * 100;
  const canContinue = isStepComplete(step, draft);

  function update(next: Partial<StrategicQuizState>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function goNext(nextDraft: StrategicQuizState) {
    if (!isStepComplete(step, nextDraft)) return;
    if (step + 1 < total) {
      setStep((current) => current + 1);
      return;
    }
    setStrategicQuiz(nextDraft);
    navigate({ to: "/results" });
  }

  function updateAndContinue(next: Partial<StrategicQuizState>) {
    const nextDraft = { ...draft, ...next };
    setDraft(nextDraft);
    window.setTimeout(() => goNext(nextDraft), 180);
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack Strategic Quiz</span>
        </Link>
        <Link to="/suppliers" className="text-sm text-muted-foreground hover:text-foreground">
          Hoppa till registry
        </Link>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>
              Fråga {step + 1} av {total}
            </span>
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
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Layers3 className="h-3.5 w-3.5" />
              Page 2 · Context Gathering
            </div>

            {step === 0 && (
              <Question title="Vilken bransch är företaget inom?">
                <OptionGrid
                  values={industries}
                  selected={draft.industry}
                  onSelect={(value) => updateAndContinue({ industry: value as Industry })}
                />
              </Question>
            )}

            {step === 1 && (
              <Question title="Vilka datatyper hanterar ni primärt?">
                <div className="grid gap-3 md:grid-cols-2">
                  {dataTypes.map((type) => {
                    const selected = draft.dataTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          update({
                            dataTypes: selected
                              ? draft.dataTypes.filter((item) => item !== type)
                              : [...draft.dataTypes, type],
                          })
                        }
                        className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-semibold transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background hover:border-primary"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Database className="h-4 w-4 text-primary" />
                          {type}
                        </span>
                        {selected && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </Question>
            )}

            {step === 2 && (
              <Question title="Hur viktig är EU data lagring för er strategi?">
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateAndContinue({ euStorageImportance: value })}
                      className={`rounded-2xl border-2 py-5 text-2xl font-black transition-all ${
                        draft.euStorageImportance === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:border-primary"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </Question>
            )}

            {step === 3 && (
              <Question title="Hur ser beredskap ut för avstängning av utländska tjänster (Exit-strategi)?">
                <OptionGrid
                  values={exitOptions}
                  selected={draft.exitReadiness}
                  onSelect={(value) => updateAndContinue({ exitReadiness: value as ExitReadiness })}
                />
              </Question>
            )}

            {step === 4 && (
              <Question title="Hur strikt regleras ni av NIS2?">
                <OptionGrid
                  values={nis2Options}
                  selected={draft.nis2Strictness}
                  onSelect={(value) =>
                    updateAndContinue({ nis2Strictness: value as Nis2Strictness })
                  }
                />
              </Question>
            )}

            {step === 5 && (
              <Question title="Viktigaste drivkraft?">
                <OptionGrid
                  values={driverOptions}
                  selected={draft.mainDriver}
                  onSelect={(value) => updateAndContinue({ mainDriver: value as MainDriver })}
                />
              </Question>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Tillbaka
              </button>
              <button
                type="button"
                onClick={() => goNext(draft)}
                disabled={!canContinue}
                className="inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-6 py-3 font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step + 1 === total ? "Se resultat" : "Nästa"}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-balance text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function OptionGrid({
  values,
  selected,
  onSelect,
}: {
  values: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`group flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-semibold transition-all ${
            selected === value
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-background hover:border-primary hover:bg-primary/5"
          }`}
        >
          <span className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-primary" />
            {value}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </button>
      ))}
    </div>
  );
}

function isStepComplete(step: number, draft: StrategicQuizState) {
  if (step === 0) return Boolean(draft.industry);
  if (step === 1) return draft.dataTypes.length > 0;
  if (step === 2) return Boolean(draft.euStorageImportance);
  if (step === 3) return Boolean(draft.exitReadiness);
  if (step === 4) return Boolean(draft.nis2Strictness);
  return Boolean(draft.mainDriver);
}
