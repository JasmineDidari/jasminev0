import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateUserScore } from "@/lib/compliance-score";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/application")({
  head: () => ({
    meta: [
      { title: "Ansökan — EUROstack" },
      {
        name: "description",
        content: "Fyll i ansökan för EUROstack-verifiering när compliance score är minst 80%.",
      },
      { property: "og:title", content: "EUROstack ansökan" },
      {
        property: "og:description",
        content: "Ansökningsformulär för organisationer som nått 80% compliance score.",
      },
    ],
  }),
  component: ApplicationPage,
});

const fields = [
  { id: "company", label: "Företagsnamn", type: "text", autoComplete: "organization" },
  { id: "firstName", label: "Person namn", type: "text", autoComplete: "given-name" },
  { id: "lastName", label: "Efternamn", type: "text", autoComplete: "family-name" },
  { id: "address", label: "Adress", type: "text", autoComplete: "street-address" },
  { id: "city", label: "Ort", type: "text", autoComplete: "address-level2" },
  { id: "phone", label: "Telefon nummer", type: "tel", autoComplete: "tel" },
  { id: "email", label: "Mejl", type: "email", autoComplete: "email" },
];

function ApplicationPage() {
  const { suppliers, quizProfile } = useAppState();
  const userScore = calculateUserScore(suppliers, quizProfile);
  const canApply = userScore >= 80;
  const [open, setOpen] = useState(false);

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
          to="/certification-journey"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Till roadmap
        </Link>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Page 6 · Ansökan
          </span>
          <h1 className="mt-5 text-balance text-4xl font-black tracking-tight md:text-5xl">
            Fyll i formulär
          </h1>
          <p className="mt-4 text-muted-foreground">
            Din realtidsscore är <span className="font-bold text-foreground">{userScore}%</span>.
          </p>
        </motion.section>

        {!canApply ? (
          <section className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-black tracking-tight">Formuläret är låst</h2>
            <p className="mt-2 text-muted-foreground">
              User måste nå eller gå över 80% tröskeln innan ansökan kan fyllas i.
            </p>
            <Link
              to="/results"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] px-6 py-4 font-bold text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Se resultat
            </Link>
          </section>
        ) : (
          <form
            className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2 md:[&:nth-child(4)]:col-span-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    className="h-12 rounded-2xl bg-background/70"
                  />
                </div>
              ))}
            </div>
            <Button type="submit" className="mt-8 h-12 rounded-2xl px-6 font-bold">
              Skicka ansökan
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center text-2xl font-black">
              Ansökan skickats framgångsrikt
            </DialogTitle>
            <DialogDescription className="text-center">
              Tack, din ansökan har registrerats.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}