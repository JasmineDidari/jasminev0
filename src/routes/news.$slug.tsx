import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [
      { title: "Nyheter — EUROstack" },
      { name: "description", content: "Aktuella nyheter om EU compliance och tech suppliers." },
      { property: "og:title", content: "EUROstack Nyheter" },
      { property: "og:description", content: "Läs om risker, regelverk och supplier exposure." },
    ],
  }),
  component: NewsArticlePage,
});

const articles: Record<string, { title: string; tag: string; body: string[] }> = {
  "microsoft-prices": {
    tag: "Pris",
    title: "Microsoft höjer priserna",
    body: [
      "När amerikanska kärnleverantörer höjer priser påverkas både budget, beroendegrad och förhandlingsposition.",
      "EUROstack rekommenderar att kritiska system kartläggs mot EU-alternativ innan nästa avtalsförnyelse.",
    ],
  },
  nis2: {
    tag: "Lag",
    title: "Ny NIS2-lag träder in",
    body: [
      "NIS2 skärper kraven på riskhantering i leverantörskedjan och gör dokumenterad kontroll viktigare.",
      "Särskilt kritiska IT-, moln- och kommunikationsleverantörer bör riskklassas löpande.",
    ],
  },
  "chatgpt-china": {
    tag: "Geopolitik",
    title: "ChatGPT har flyttat till Kina",
    body: [
      "AI-leverantörer kräver extra granskning eftersom prompts kan innehålla affärskritisk eller personlig data.",
      "Kontrollera datalagring, träningspolicy, jurisdiktion och om EU-baserade modeller kan ersätta känsliga flöden.",
    ],
  },
};

function NewsArticlePage() {
  const { slug } = Route.useParams();
  const article = articles[slug] ?? articles.nis2;

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
      </header>
      <main className="container mx-auto max-w-3xl px-6 py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Tillbaka
        </Link>
        <article className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            <Newspaper className="h-3.5 w-3.5" /> {article.tag}
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">{article.title}</h1>
          <div className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">
            {article.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}