import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  MapPin,
  Sparkles,
  Download,
  Compass,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";
import {
  COMPLIANCE_SCOREBOOK,
  loadUserSuppliers,
  resolveSupplier,
  locationFor,
  isEUCountry,
  alternativesFor,
  type ComplianceScores,
  type QuizProfile,
  type UserSupplier,
  type SupplierInfo,
} from "@/lib/suppliers";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Riskanalys — EUROstack Verified" },
      {
        name: "description",
        content:
          "EU vs icke-EU fördelning, geografiska dataflöden och risk per leverantör.",
      },
      { property: "og:title", content: "Din EUROstack-riskanalys" },
      {
        property: "og:description",
        content: "Visualisering av EU vs icke-EU exponering i din leverantörskedja.",
      },
    ],
  }),
  component: ResultsPage,
});

type Resolved = {
  user: UserSupplier;
  catalog: SupplierInfo | null;
  region: "EU" | "non-EU" | "Okänd";
  country: string;
  location: string;
};

function buildResolved(u: UserSupplier): Resolved {
  const catalog = resolveSupplier(u.name);
  const country = u.country.trim() || catalog?.country || "Okänd";
  let region: "EU" | "non-EU" | "Okänd";
  if (catalog) region = catalog.region;
  else if (!u.country.trim()) region = "Okänd";
  else region = isEUCountry(u.country) ? "EU" : "non-EU";
  const location =
    locationFor(u.name) ??
    (region === "EU"
      ? `${country} (EU)`
      : region === "non-EU"
        ? `${country} (non-EU)`
        : "Okänd lagringsplats");
  return { user: u, catalog, region, country, location };
}

const defaultProfile: QuizProfile = {
  securityPriority: true,
  nis2Priority: true,
  dataLocationKnown: false,
  documentationReady: false,
  cloudActAware: false,
};

function loadQuizProfile(): QuizProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const answers = JSON.parse(
      window.localStorage.getItem("eurostack_quiz_answers") ?? "[]",
    ) as Array<"ja" | "nej" | "osaker">;
    return {
      securityPriority: answers[1] !== "nej" || answers[4] === "ja",
      nis2Priority: answers[3] !== "ja" || answers[4] === "ja",
      dataLocationKnown: answers[2] === "ja",
      documentationReady: answers[3] === "ja",
      cloudActAware: answers[4] === "ja",
    };
  } catch {
    return defaultProfile;
  }
}

function weightedCompliance(scores: ComplianceScores, profile = defaultProfile): number {
  const nis2Weight = profile.nis2Priority ? 0.34 : 0.26;
  const doraWeight = profile.securityPriority ? 0.31 : 0.25;
  const sovereigntyWeight = profile.dataLocationKnown ? 0.2 : 0.27;
  const gdprWeight = Math.max(0.1, 1 - nis2Weight - doraWeight - sovereigntyWeight);
  return Math.round(
    scores.nis2 * nis2Weight +
      scores.dora * doraWeight +
      scores.sovereignty * sovereigntyWeight +
      scores.gdpr * gdprWeight,
  );
}

function scoresFor(item: Resolved, replacement?: string): ComplianceScores {
  if (replacement && COMPLIANCE_SCOREBOOK[replacement]) return COMPLIANCE_SCOREBOOK[replacement];
  const catalogName = item.catalog?.name.replace("Microsoft 365", "Microsoft");
  if (catalogName && COMPLIANCE_SCOREBOOK[catalogName]) return COMPLIANCE_SCOREBOOK[catalogName];
  if (item.region === "EU") return { nis2: 82, dora: 76, sovereignty: 88, gdpr: 90 };
  if (riskFor(item) === "medium") return { nis2: 58, dora: 52, sovereignty: 42, gdpr: 63 };
  if (riskFor(item) === "high") return { nis2: 38, dora: 34, sovereignty: 22, gdpr: 48 };
  return { nis2: 50, dora: 46, sovereignty: 40, gdpr: 55 };
}

function overallCompliance(items: Resolved[], replacements: Record<string, string>) {
  if (!items.length) return 0;
  const total = items.reduce(
    (acc, item) => acc + weightedCompliance(scoresFor(item, replacements[item.user.id])),
    0,
  );
  return Math.round(total / items.length);
}

function bestMatchFor(item: Resolved, profile: QuizProfile) {
  const names = alternativesFor(item.user.name, item.catalog?.category);
  return names
    .map((name) => ({ name, scores: COMPLIANCE_SCOREBOOK[name] }))
    .filter((candidate): candidate is { name: string; scores: ComplianceScores } => Boolean(candidate.scores))
    .sort((a, b) => weightedCompliance(b.scores, profile) - weightedCompliance(a.scores, profile))[0];
}

function ResultsPage() {
  const [items, setItems] = useState<Resolved[]>([]);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<QuizProfile>(defaultProfile);

  useEffect(() => {
    setItems(loadUserSuppliers().map(buildResolved));
    setProfile(loadQuizProfile());
  }, []);

  const stats = useMemo(() => {
    const eu = items.filter((i) => i.region === "EU").length;
    const nonEu = items.filter((i) => i.region === "non-EU").length;
    const unknown = items.filter((i) => i.region === "Okänd").length;
    const total = items.length;
    const high = items.filter((i) => riskFor(i) === "high").length;
    const nonEuPct = total ? Math.round((nonEu / total) * 100) : 0;
    const euPct = total ? Math.round((eu / total) * 100) : 0;
    return { eu, nonEu, unknown, total, high, nonEuPct, euPct };
  }, [items]);

  const currentScore = useMemo(() => overallCompliance(items, {}), [items]);
  const simulatedScore = useMemo(
    () => overallCompliance(items, replacements),
    [items, replacements],
  );

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
        <Link
          to="/suppliers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Redigera leverantörer
        </Link>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Steg 3 av 3 · Resultat
          </span>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight md:text-5xl">
            Er digitala{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              leverantörskarta
            </span>
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">
              Inga leverantörer registrerade ännu.
            </p>
            <Link
              to="/suppliers"
              className="mt-4 inline-block rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground"
            >
              Lägg till leverantörer
            </Link>
          </div>
        ) : (
          <>
            {/* Donut + stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-10 grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:grid-cols-[auto_1fr]"
            >
              <Donut
                eu={stats.eu}
                nonEu={stats.nonEu}
                unknown={stats.unknown}
                total={stats.total}
              />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  EU vs icke-EU fördelning
                </h2>
                <div className="mt-4 grid gap-3">
                  <Legend
                    color="bg-success"
                    label="EU-baserade"
                    value={stats.eu}
                    pct={stats.euPct}
                  />
                  <Legend
                    color="bg-destructive"
                    label="Icke-EU"
                    value={stats.nonEu}
                    pct={stats.nonEuPct}
                  />
                  {stats.unknown > 0 && (
                    <Legend
                      color="bg-muted-foreground/40"
                      label="Okänd"
                      value={stats.unknown}
                      pct={
                        stats.total
                          ? Math.round((stats.unknown / stats.total) * 100)
                          : 0
                      }
                    />
                  )}
                </div>
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Total Compliance Score
                      </p>
                      <p className="mt-1 text-3xl font-black tracking-tight">
                        {simulatedScore}%
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{currentScore}%</span> nuläge
                      {simulatedScore > currentScore && (
                        <span className="ml-2 rounded-full bg-success/15 px-2 py-1 text-xs font-bold text-success-foreground">
                          +{simulatedScore - currentScore} förbättring
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-[image:var(--gradient-hero)]"
                      animate={{ width: `${simulatedScore}%` }}
                      transition={{ duration: 0.45 }}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Geographic data flow */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
            >
              <div className="mb-5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Var lagras er data?
                </h2>
              </div>
              <div className="grid gap-2">
                {items.map((it, i) => (
                  <motion.div
                    key={it.user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          it.region === "EU"
                            ? "bg-success"
                            : it.region === "non-EU"
                              ? "bg-destructive"
                              : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="font-semibold">{it.user.name}</span>
                      {it.user.system && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                          {it.user.system}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {it.location}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Risk per supplier */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Klickbar riskanalys per leverantör
                </h2>
                <a href="#eu-alternativ" className="text-sm font-bold text-primary hover:text-foreground">
                  Visa EU-alternativ
                </a>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((it, i) => (
                  <RiskCard
                    key={it.user.id}
                    item={it}
                    index={i}
                    profile={profile}
                    replacement={replacements[it.user.id]}
                    onReplace={(name) =>
                      setReplacements((current) => ({ ...current, [it.user.id]: name }))
                    }
                  />
                ))}
              </div>
            </motion.section>

            {/* AI Insight */}
            <motion.section
              id="eu-alternativ"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-card)] p-8 shadow-[var(--shadow-soft)]"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI-insikt
              </div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                Sammanfattning av er exponering
              </h2>
              <div className="mt-3 space-y-3 text-base text-muted-foreground md:text-lg">
                {buildInsight(stats).map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => exportReport(items, stats)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-5 py-3 text-sm font-bold transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Download className="h-4 w-4" />
                  Exportera rapport
                </button>
                <button
                  onClick={() =>
                    alert("EU-alternativ-katalogen är på väg — vi mailar dig så snart den är live.")
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-hero)] px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)]"
                >
                  <Compass className="h-4 w-4" />
                  Få EU-alternativ
                </button>
              </div>
            </motion.section>
          </>
        )}
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EUROstack
      </footer>
    </div>
  );
}

function riskFor(it: Resolved): "low" | "medium" | "high" {
  if (it.catalog) return it.catalog.risk;
  if (it.region === "EU") return "low";
  if (it.region === "non-EU") return "high";
  return "medium";
}

function noteFor(it: Resolved): string {
  if (it.catalog) return it.catalog.riskNote;
  if (it.region === "EU")
    return "EU-baserad leverantör — inom GDPR-jurisdiktion.";
  if (it.region === "non-EU")
    return "Utanför EU — kan vara exponerad mot CLOUD Act eller liknande lagstiftning.";
  return "Land saknas — fyll i för att få en korrekt bedömning.";
}

function Legend({
  color,
  label,
  value,
  pct,
}: {
  color: string;
  label: string;
  value: number;
  pct: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black">{value}</span>
        <span className="text-xs text-muted-foreground">({pct}%)</span>
      </div>
    </div>
  );
}

function Donut({
  eu,
  nonEu,
  unknown,
  total,
}: {
  eu: number;
  nonEu: number;
  unknown: number;
  total: number;
}) {
  const size = 180;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const safeTotal = total || 1;
  const euLen = (eu / safeTotal) * c;
  const nonEuLen = (nonEu / safeTotal) * c;
  const unknownLen = (unknown / safeTotal) * c;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--success)"
          strokeWidth={stroke}
          strokeDasharray={`${euLen} ${c}`}
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${euLen} ${c}` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--destructive)"
          strokeWidth={stroke}
          strokeDasharray={`${nonEuLen} ${c}`}
          strokeDashoffset={-euLen}
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${nonEuLen} ${c}` }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeOpacity={0.4}
          strokeWidth={stroke}
          strokeDasharray={`${unknownLen} ${c}`}
          strokeDashoffset={-(euLen + nonEuLen)}
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${unknownLen} ${c}` }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black">{total}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          leverantörer
        </div>
      </div>
    </div>
  );
}

function RiskCard({
  item,
  index,
  profile,
  replacement,
  onReplace,
}: {
  item: Resolved;
  index: number;
  profile: QuizProfile;
  replacement?: string;
  onReplace: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const risk = riskFor(item);
  const match = item.region === "non-EU" ? bestMatchFor(item, profile) : undefined;
  const currentScores = scoresFor(item);
  const recommendedScores = match?.scores;
  const shownScores = replacement ? scoresFor(item, replacement) : currentScores;
  const map = {
    low: {
      icon: CheckCircle2,
      label: "Låg risk",
      cls: "border-success/40 bg-success/5",
      iconCls: "text-success bg-success/15",
      pillCls: "bg-success/15 text-success-foreground",
    },
    medium: {
      icon: MinusCircle,
      label: "Medel risk",
      cls: "border-warning/40 bg-warning/5",
      iconCls: "text-warning bg-warning/15",
      pillCls: "bg-warning/15 text-warning-foreground",
    },
    high: {
      icon: AlertTriangle,
      label: "Hög risk",
      cls: "border-destructive/40 bg-destructive/5",
      iconCls: "text-destructive bg-destructive/15",
      pillCls: "bg-destructive/15 text-destructive",
    },
  } as const;
  const r = map[risk];
  const Icon = r.icon;

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((v) => !v)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.04 }}
      className={`flex flex-col gap-3 rounded-2xl border-2 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${r.cls}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight">{item.user.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-background px-2 py-0.5 font-bold uppercase tracking-wider">
              {item.user.type}
            </span>
            <span>{item.country}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.iconCls}`}>
            <Icon className="h-5 w-5" />
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{noteFor(item)}</p>
      <div className="flex items-center justify-between">
        <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${r.pillCls}`}>
          {r.label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {item.region}
        </span>
      </div>
      {open && (
        <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
          {match ? (
            <div>
              <p className="font-semibold text-foreground">Bästa EU-matchning</p>
              <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground">{match.name}</p>
                    <p className="text-xs">Matchad mot era quiz-svar: Säkerhet, NIS2/DORA och digital suveränitet.</p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onReplace(match.name);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-3 py-2 text-xs font-bold text-primary-foreground"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Ersätt med EU-alternativ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-foreground">EU-status</p>
              <p className="mt-1">Leverantören är redan EU-baserad eller behöver kompletteras med land/typ.</p>
            </>
          )}
          <div className="mt-4 grid gap-2">
            <ScoreRow label="NIS2-ready" value={shownScores.nis2} improved={recommendedScores?.nis2} />
            <ScoreRow label="DORA-compliant" value={shownScores.dora} improved={recommendedScores?.dora} />
            <ScoreRow label="Digital Suveränitet" value={shownScores.sovereignty} improved={recommendedScores?.sovereignty} />
            <ScoreRow label="GDPR-assurance" value={shownScores.gdpr} improved={recommendedScores?.gdpr} />
          </div>
          {item.user.mustKeep && (
            <p className="mt-3">
              Behåll tills vidare: säkra DPA/SCC, minimera persondata, kräv EU-datalagring,
              sätt exit-plan och prioritera DORA/NIS2-dokumentation.
            </p>
          )}
        </div>
      )}
    </motion.button>
  );
}

function ScoreRow({ label, value, improved }: { label: string; value: number; improved?: number }) {
  const target = improved && improved > value ? improved : value;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold">
        <span className="text-foreground">{label}</span>
        <span>
          {value}%{improved && improved > value ? ` → ${improved}%` : ""}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-[image:var(--gradient-hero)]" style={{ width: `${target}%` }} />
      </div>
    </div>
  );
}

function buildInsight(stats: {
  eu: number;
  nonEu: number;
  unknown: number;
  total: number;
  high: number;
  nonEuPct: number;
  euPct: number;
}): string[] {
  if (stats.total === 0) return ["Inga leverantörer att analysera ännu."];
  const parts: string[] = [];
  parts.push(
    `${stats.nonEuPct}% av era ${stats.total} leverantörer är baserade utanför EU.`,
  );
  if (stats.high > 0) {
    parts.push(
      `${stats.high} av dem klassas som högrisk — ofta på grund av exponering mot CLOUD Act eller liknande utomeuropeisk lagstiftning.`,
    );
  }
  if (stats.unknown > 0) {
    parts.push(
      `${stats.unknown} leverantör${stats.unknown === 1 ? "" : "er"} saknar landinformation och bör granskas manuellt.`,
    );
  }
  if (stats.nonEuPct > 50) {
    parts.push(
      "Vi rekommenderar att ni ser över strategin och successivt diversifierar mot EU-baserade alternativ för bättre compliance och riskreducering.",
    );
  } else if (stats.nonEuPct > 20) {
    parts.push(
      "Ni har en god bas men flera kritiska beroenden ligger utanför EU — börja med att ersätta de mest exponerade.",
    );
  } else {
    parts.push(
      "Ni har en stark EU-position. Säkerställ dokumentation och fortsätt undvika nya icke-EU beroenden.",
    );
  }
  parts.push(
    "Compliance-viktning: DORA ges högst prioritet för kritiska system, följt av NIS2, GDPR, digital suveränitet, Data Act och EU-certifiering som bevis på kontroller.",
  );
  return parts;
}

function exportReport(
  items: Resolved[],
  stats: { eu: number; nonEu: number; unknown: number; total: number; high: number },
) {
  if (typeof window === "undefined") return;
  const lines = [
    "EUROstack Verified — Riskrapport",
    `Genererad: ${new Date().toLocaleString("sv-SE")}`,
    "",
    `Totalt: ${stats.total} leverantörer`,
    `EU: ${stats.eu}  ·  Icke-EU: ${stats.nonEu}  ·  Okänd: ${stats.unknown}`,
    `Högrisk: ${stats.high}`,
    "",
    "Leverantör | Typ | Land | Region | Lagring | Risk | Notering",
    "-----------------------------------------------------------",
    ...items.map((i) =>
      [
        i.user.name,
        i.user.type,
        i.country,
        i.region,
        i.location,
        riskFor(i),
        noteFor(i),
      ].join(" | "),
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "eurostack-rapport.txt";
  a.click();
  URL.revokeObjectURL(url);
}
