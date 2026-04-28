import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Trash2, ArrowRight, Server, Sparkles } from "lucide-react";
import {
  SUPPLIER_TYPES,
  POPULAR_SUPPLIERS,
  SUPPLIER_CATALOG,
  type UserSupplier,
  type SupplierType,
} from "@/lib/suppliers";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Registrera leverantörer — EUROstack Verified" },
      {
        name: "description",
        content:
          "Lägg till era nuvarande tech-leverantörer för en konkret EU vs icke-EU riskanalys.",
      },
      { property: "og:title", content: "Registrera era tech-leverantörer" },
      {
        property: "og:description",
        content: "Bygg en bild av er digitala leverantörskedja.",
      },
    ],
  }),
  component: SuppliersPage,
});

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyRow(): UserSupplier {
  return { id: newId(), name: "", type: "SaaS", country: "", system: "", mustKeep: false, criticality: 3 };
}

function SuppliersPage() {
  const navigate = useNavigate();
  const { suppliers, setSuppliers } = useAppState();
  const [rows, setRows] = useState<UserSupplier[]>([]);

  useEffect(() => {
    setRows(suppliers.length > 0 ? suppliers : [emptyRow()]);
  }, [suppliers]);

  function update<K extends keyof UserSupplier>(
    id: string,
    key: K,
    value: UserSupplier[K],
  ) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  function add() {
    setRows((rs) => [...rs, emptyRow()]);
  }

  function remove(id: string) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }

  function quickAdd(name: string) {
    const known = SUPPLIER_CATALOG[name];
    setRows((rs) => {
      if (rs.some((r) => r.name.toLowerCase() === name.toLowerCase())) return rs;
      const filled: UserSupplier = {
        id: newId(),
        name: known?.name ?? name,
        type: (known?.category === "Cloud"
          ? "Cloud"
          : known?.category === "AI"
            ? "AI"
            : "SaaS") as SupplierType,
        country: known?.country ?? "",
        system: "",
        mustKeep: false,
        criticality: known?.risk === "high" ? 4 : 3,
      };
      // Replace first empty row if it exists, else append
      const idx = rs.findIndex((r) => !r.name.trim());
      if (idx >= 0) {
        const copy = [...rs];
        copy[idx] = filled;
        return copy;
      }
      return [...rs, filled];
    });
  }

  const valid = rows.filter((r) => r.name.trim());
  const canSubmit = valid.length > 0;

  function submit() {
    setSuppliers(valid);
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
        <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
          Så fungerar det
        </Link>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Page 3 · The Inventory
          </span>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight md:text-5xl">
            Lägg till era{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              tech suppliers
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Lägg till, ta bort och klassificera IT-suppliers. Öppna avancerade inställningar för kritikalitet och legacy-system.
          </p>
        </motion.div>

        {/* Quick-add chips */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Snabbval
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUPPLIERS.slice(0, 12).map((name) => (
              <button
                key={name}
                onClick={() => quickAdd(name)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-all hover:border-primary hover:bg-primary/5"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>

        {/* Supplier cards */}
        <div className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {rows.map((row, idx) => (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Server className="h-3.5 w-3.5 text-primary" />
                    Leverantör #{idx + 1}
                  </div>
                  <button
                    onClick={() => remove(row.id)}
                    disabled={rows.length === 1}
                    aria-label="Ta bort leverantör"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name">
                    <input
                      value={row.name}
                      onChange={(e) => update(row.id, "name", e.target.value)}
                      placeholder="t.ex. Microsoft 365"
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </Field>
                  <Field label="Type">
                    <select
                      value={row.type}
                      onChange={(e) =>
                        update(row.id, "type", e.target.value as SupplierType)
                      }
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    >
                      {SUPPLIER_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Country">
                    <input
                      value={row.country}
                      onChange={(e) => update(row.id, "country", e.target.value)}
                      placeholder="t.ex. USA, Tyskland"
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </Field>
                  <Field label="System (valfritt)">
                    <input
                      value={row.system ?? ""}
                      onChange={(e) => update(row.id, "system", e.target.value)}
                      placeholder="t.ex. CRM, mail, lagring"
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </Field>
                </div>

                <details className="mt-5 rounded-2xl border border-border bg-background/70 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-foreground">
                    Advanced Settings
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Criticality Scale (0–5)">
                    <select
                      value={row.criticality ?? 3}
                      onChange={(e) => update(row.id, "criticality", Number(e.target.value))}
                      className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    >
                      {[0, 1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level} {level >= 4 ? "— vital to operations" : level === 3 ? "— important" : "— lower impact"}
                        </option>
                      ))}
                    </select>
                  </Field>
                    <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={Boolean(row.mustKeep)}
                        onChange={(e) => update(row.id, "mustKeep", e.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span>“Måste behållas” — legacy-system som inte kan ersättas direkt.</span>
                    </label>
                  </div>
                </details>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={add}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/50 py-4 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Lägg till leverantör
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {valid.length} leverantör{valid.length === 1 ? "" : "er"} registrerade
          </p>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="group inline-flex items-center gap-3 rounded-2xl bg-[image:var(--gradient-hero)] px-8 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Starta mätning
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
