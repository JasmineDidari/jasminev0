import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper, ShieldCheck, Sparkles, Globe2, BarChart3, Lock } from "lucide-react";

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
    path: "/news/microsoft-prices",
    excerpt:
      "Nya licensavgifter från Q1 nästa år träffar svenska företag hårt. Så förbereder du dig.",
    accent: "from-[oklch(0.78_0.18_60)] to-[oklch(0.7_0.2_30)]",
  },
  {
    tag: "Lag",
    title: "Ny NIS2-lag träder in",
    path: "/news/nis2",
    excerpt:
      "Skärpta krav på cybersäkerhet — vad NIS2 betyder för din leverantörskedja.",
    accent: "from-[oklch(0.55_0.22_265)] to-[oklch(0.7_0.2_285)]",
  },
  {
    tag: "Geopolitik",
    title: "ChatGPT har flyttat till Kina",
    path: "/news/chatgpt-china",
    excerpt:
      "OpenAI:s nya datacenterplaner väcker frågor om var dina prompts faktiskt landar.",
    accent: "from-[oklch(0.7_0.18_150)] to-[oklch(0.6_0.18_180)]",
  },
];

const features = [
  {
    icon: Globe2,
    title: "Geografisk översikt",
    text: "Se exakt var er data faktiskt lagras — region för region.",
  },
  {
    icon: BarChart3,
    title: "EU vs icke-EU",
    text: "Visuell fördelning av er stack på 30 sekunder.",
  },
  {
    icon: Lock,
    title: "Compliance-redo",
    text: "GDPR, NIS2 och CLOUD Act — riskbedömt per leverantör.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#nyheter" className="hover:text-foreground">Nyheter</a>
          <Link to="/how-it-works" className="hover:text-foreground">Så fungerar det</Link>
        </nav>
      </header>

      {/* Hero with quiz CTA */}
      <section
        id="quiz"
        className="container mx-auto px-6 pb-16 pt-10 md:pb-24 md:pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            EUROstack Verified
          </span>
          <h1 className="mt-6 text-balance text-5xl font-black tracking-tight md:text-7xl">
            Förstå var er{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              data faktiskt flödar
            </span>
          </h1>
          <p className="mt-6 text-balance text-lg text-muted-foreground md:text-xl">
            EUROstack hjälper er kartlägga exponering mot EU- och icke-EU
            leverantörer — och visualiserar hur er tekniska data rör sig mellan
            regioner.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10"
          >
            <Link
              to="/suppliers"
              className="group inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-8 py-5 text-lg font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)]"
            >
              Registrera tech suppliers
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/how-it-works"
              className="ml-3 inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-5 text-lg font-bold shadow-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              Så fungerar det
            </Link>
          </motion.div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratis · Ingen registrering · Tar 2 minuter
          </p>
        </motion.div>

        {/* Feature strip */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-bold tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog cards */}
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
              <Link to={b.path} className="block h-full">
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

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EUROstack — Digital suveränitet på riktigt.
      </footer>
    </div>
  );
}
