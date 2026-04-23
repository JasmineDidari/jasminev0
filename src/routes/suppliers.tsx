import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Plus, X, ArrowRight } from "lucide-react";
import { POPULAR_SUPPLIERS, saveSuppliers, loadSuppliers } from "@/lib/suppliers";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Dina leverantörer — EUROstack Verified" },
      {
        name: "description",
        content: "Registrera vilka digitala leverantörer ni använder idag.",
      },
      { property: "og:title", content: "Registrera leverantörer" },
      {
        property: "og:description",
        content: "Lägg in din nuvarande stack och få en EU-vs-icke-EU analys.",
      },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    setSelected(loadSuppliers());
  }, []);

  function toggle(name: string) {
    setSelected((s) =>
      s.includes(name) ? s.filter((x) => x !== name) : [...s, name],
    );
  }

  function addCustom() {
    const v = custom.trim();
    if (v && !selected.includes(v)) {
      setSelected([...selected, v]);
      setCustom("");
    }
  }

  function submit() {
    saveSuppliers(selected);
    navigate({ to: "/results" });
  }

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

      <main className="container mx-auto max-w-3xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Steg 2 av 3
          </span>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight md:text-5xl">
            Vilka leverantörer{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              använder ni idag?
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Markera de tjänster ni faktiskt använder. Vi bedömer risken på nästa sida.
          </p>
        </motion.div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Vanliga leverantörer
          </h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUPPLIERS.map((name) => {
              const active = selected.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Lägg till egen
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="t.ex. Trello, Figma..."
              className="flex-1 rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <button
              onClick={addCustom}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold hover:border-primary"
            >
              <Plus className="h-4 w-4" /> Lägg till
            </button>
          </div>

          {selected.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Valda ({selected.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1.5 text-sm font-medium text-accent-foreground"
                  >
                    {s}
                    <button onClick={() => toggle(s)} aria-label={`Ta bort ${s}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={submit}
            disabled={selected.length === 0}
            className="group inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-8 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Visa min riskanalys
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </main>
    </div>
  );
}