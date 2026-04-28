import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, Globe2, Lock, Newspaper } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EUROstack Verified — Är dina leverantörer EU-säkra?" },
      {
        name: "description",
        content:
          "Ta quizet och se på 2 minuter vilka av dina leverantörer som är EU-baserade och vilka som utgör en risk.",
      },
      { property: "og:title", content: "EUROstack Verified" },
      {
        property: "og:description",
        content: "Mät din digitala suveränitet. Hitta dina icke-EU leverantörer.",
      },
    ],
  }),
  component: Index,
});

const blogs = [
  {
    tag: "Pris",
    title: "Microsoft höjer priserna",
    slug: "microsoft-prices",
    excerpt:
      "Nya licensavgifter från Q1 nästa år träffar svenska företag hårt. Så förbereder du dig.",
    accent: "from-[oklch(0.78_0.18_60)] to-[oklch(0.7_0.2_30)]",
  },
  {
    tag: "Lag",
    title: "Ny NIS2-lag träder in",
    slug: "nis2",
    excerpt:
      "Skärpta krav på cybersäkerhet — vad NIS2 betyder för din leverantörskedja.",
    accent: "from-[oklch(0.55_0.22_265)] to-[oklch(0.7_0.2_285)]",
  },
  {
    tag: "Geopolitik",
    title: "ChatGPT har flyttat till Kina",
    slug: "chatgpt-china",
    excerpt:
      "OpenAI:s nya datacenterplaner väcker frågor om var dina prompts faktiskt landar.",
    accent: "from-[oklch(0.7_0.18_150)] to-[oklch(0.6_0.18_180)]",
  },
];

const features = [
  {
    icon: Globe2,
    kicker: "EU-suveränitet",
    title: "20+ leverantörer",
    text: "Cloud, AI, fintech",
  },
  {
    icon: BarChart3,
    kicker: "Regelverk",
    title: "GDPR · NIS2 · DORA",
    text: "Vägt per sektor",
  },
  {
    icon: Lock,
    kicker: "Jurisdiktion",
    title: "EU vs. icke-EU",
    text: "CLOUD Act-analys",
  },
];

const processSteps = [
  {
    step: "STEG 01",
    title: "Svara på 6 frågor",
    text: "Bransch, datatyper, EU-lagring, exit-strategi och NIS2-nivå avgör hur riskerna viktas.",
  },
  {
    step: "STEG 02",
    title: "Registrera suppliers",
    text: "Lägg till SaaS, Cloud, Infra och konsulter med land, kritikalitet och måste-behållas-status.",
  },
  {
    step: "STEG 03",
    title: "Få EU-alternativ",
    text: "Dashboarden visar compliance score, blockers och bästa EU-matchning för varje icke-EU-leverantör.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-home-background text-home-foreground">
      <div className="absolute inset-0 -z-0 bg-[image:var(--grid-home)] bg-[length:64px_64px]" />
      <main className="relative z-10">
      <header className="border-b border-home-border/60">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-glow)]">
              <Activity className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-home-background bg-home-signal" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">EuroStack Meter</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.35em] text-home-muted">Vendor Sovereignty Index</div>
            </div>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-home-muted md:flex">
            <Link to="/how-it-works" className="hover:text-home-foreground">Så fungerar det</Link>
            <Link to="/results" className="hover:text-home-foreground">Ranking</Link>
            <Link to="/certification-journey" className="hover:text-home-foreground">Om</Link>
          </nav>
          <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-home-muted md:flex">
            v1.0 <span className="text-home-signal">· Live</span>
          </div>
        </div>
      </header>

      <section
        id="quiz"
        className="container mx-auto px-6 pb-20 pt-28 md:pb-28 md:pt-36"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-tight text-primary-glow shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            EU Digital Sovereignty · NIS2 · GDPR · DORA
          </span>
          <h1 className="mt-7 text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Mät dina leverantörer mot{" "}
            <span className="bg-[image:var(--gradient-euro)] bg-clip-text text-transparent">
              EuroStack
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-8 text-home-muted md:text-xl">
            Bredbandskollen — fast för leverantörer. Få på 60 sekunder en kompatibilitetspoäng som visar hur väl era leverantörer följer EU-suveränitet, GDPR, NIS2 och DORA.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/quiz"
              className="group inline-flex items-center gap-3 rounded-lg bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)]"
            >
              Starta quiz
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-2 py-4 text-sm font-semibold text-home-muted transition-colors hover:text-home-foreground"
            >
              Så fungerar det →
            </Link>
          </motion.div>
        </motion.div>

        <div className="mx-auto mt-20 grid max-w-5xl overflow-hidden rounded-2xl border border-home-border bg-home-surface/80 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-home-border p-6 md:border-r md:last:border-r-0"
            >
              <f.icon className="h-5 w-5 text-home-signal" />
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-home-muted">{f.kicker}</p>
              <h3 className="mt-2 text-lg font-black tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm text-home-muted">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-home-border bg-home-background/80 px-6 py-20">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-home-signal">Process</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Så fungerar mätaren</h2>
          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {processSteps.map((item) => (
              <article key={item.step} className="rounded-2xl border border-home-border bg-home-surface p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-home-signal">{item.step}</p>
                <h3 className="mt-5 text-xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-home-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nyheter" className="container mx-auto px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Newspaper className="h-4 w-4" />
              Senaste nytt
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Vad händer i stacken?
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {blogs.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-card)] p-1 shadow-sm transition-all hover:shadow-[var(--shadow-soft)]"
            >
              <Link to="/news/$slug" params={{ slug: b.slug }} className="block h-full">
                <div className={`h-32 rounded-2xl bg-gradient-to-br ${b.accent}`} />
                <div className="p-6">
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                    {b.tag}
                  </span>
                  <h3 className="mt-4 text-xl font-bold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                    Läs mer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-home-border py-8 text-center text-sm text-home-muted">
        © {new Date().getFullYear()} EUROstack — Digital suveränitet på riktigt.
      </footer>
      </main>
    </div>
  );
}
