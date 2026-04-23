import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle2, MinusCircle } from "lucide-react";
import { loadSuppliers, SUPPLIER_CATALOG, type SupplierInfo } from "@/lib/suppliers";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Riskanalys — EUROstack Verified" },
      {
        name: "description",
        content: "Se EU vs icke-EU fördelning av era leverantörer och en risk per leverantör.",
      },
      { property: "og:title", content: "Din EUROstack-riskanalys" },
      {
        property: "og:description",
        content: "Vilka av era leverantörer är EU-baserade?",
      },
    ],
  }),
  component: ResultsPage,
});

type Resolved = { input: string; info: SupplierInfo | null };

function resolve(name: string): Resolved {
  const key = Object.keys(SUPPLIER_CATALOG).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return { input: name, info: key ? SUPPLIER_CATALOG[key] : null };
}

function ResultsPage() {
  const [items, setItems] = useState<Resolved[]>([]);

  useEffect(() => {
    setItems(loadSuppliers().map(resolve));
  }, []);

  const eu = items.filter((i) => i.info?.region === "EU").length;
  const nonEu = items.filter((i) => i.info?.region === "non-EU").length;
  const unknown = items.filter((i) => !i.info).length;
  const total = items.length || 1;
  const euPct = (eu / total) * 100;
  const nonEuPct = (nonEu / total) * 100;
  const unknownPct = (unknown / total) * 100;

  return (
    <div className="min-h-screen bg-[image:var(--gradient-sky)]">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EUROstack</span>
        </Link>
        <Link to="/suppliers" className="text-sm text-muted-foreground hover:text-foreground">
          Redigera lista
        </Link>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Steg 3 av 3 — Resultat
          </span>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight md:text-5xl">
            Din leverantörs-{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              karta
            </span>
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">
              Du har inte registrerat några leverantörer än.
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
            {/* Measurement bar */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                EU vs icke-EU fördelning
              </h2>

              <div className="mt-6 flex h-12 overflow-hidden rounded-2xl bg-muted">
                {eu > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${euPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex items-center justify-center bg-success text-xs font-bold text-success-foreground"
                  >
                    {euPct > 10 && `${Math.round(euPct)}%`}
                  </motion.div>
                )}
                {nonEu > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${nonEuPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-center bg-destructive text-xs font-bold text-destructive-foreground"
                  >
                    {nonEuPct > 10 && `${Math.round(nonEuPct)}%`}
                  </motion.div>
                )}
                {unknown > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${unknownPct}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex items-center justify-center bg-muted-foreground/40 text-xs font-bold text-foreground"
                  >
                    {unknownPct > 10 && `${Math.round(unknownPct)}%`}
                  </motion.div>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat label="EU-baserade" value={eu} color="success" />
                <Stat label="Icke-EU" value={nonEu} color="destructive" />
                <Stat label="Okänd" value={unknown} color="muted" />
              </div>
            </motion.section>

            {/* Risk per supplier */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Riskanalys per leverantör
              </h2>
              <div className="grid gap-3">
                {items.map((it, i) => (
                  <RiskRow key={it.input + i} item={it} index={i} />
                ))}
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

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "success" | "destructive" | "muted";
}) {
  const map = {
    success: "bg-success/10 text-success-foreground border-success/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    muted: "bg-muted text-foreground border-border",
  };
  return (
    <div className={`rounded-2xl border-2 p-4 ${map[color]}`}>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
        {label}
      </div>
    </div>
  );
}

function RiskRow({ item, index }: { item: Resolved; index: number }) {
  const info = item.info;
  const risk = info?.risk ?? "medium";
  const riskMap = {
    low: {
      icon: CheckCircle2,
      label: "Låg risk",
      cls: "bg-success/10 text-success-foreground border-success/40",
      iconCls: "text-success",
    },
    medium: {
      icon: MinusCircle,
      label: "Medel risk",
      cls: "bg-warning/10 text-warning-foreground border-warning/40",
      iconCls: "text-warning",
    },
    high: {
      icon: AlertTriangle,
      label: "Hög risk",
      cls: "bg-destructive/10 text-destructive border-destructive/40",
      iconCls: "text-destructive",
    },
  };
  const r = riskMap[risk];
  const Icon = r.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-[1fr_auto_auto]"
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold tracking-tight">
            {info?.name ?? item.input}
          </h3>
          {info && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
              {info.category}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {info ? info.riskNote : "Okänd leverantör — manuell granskning rekommenderas."}
        </p>
      </div>
      <div className="text-sm font-semibold">
        {info ? (
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              info.region === "EU"
                ? "bg-success/15 text-success-foreground"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {info.country}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
      <div
        className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-bold ${r.cls}`}
      >
        <Icon className={`h-4 w-4 ${r.iconCls}`} />
        {r.label}
      </div>
    </motion.div>
  );
}