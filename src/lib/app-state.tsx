import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  loadUserSuppliers,
  saveUserSuppliers,
  type QuizProfile,
  type UserSupplier,
} from "@/lib/suppliers";

export type QuizAnswer = "ja" | "nej" | "osaker";

type AppStateContextValue = {
  suppliers: UserSupplier[];
  quizAnswers: QuizAnswer[];
  quizProfile: QuizProfile;
  setSuppliers: (suppliers: UserSupplier[]) => void;
  setQuizAnswers: (answers: QuizAnswer[]) => void;
};

const defaultProfile: QuizProfile = {
  securityPriority: true,
  nis2Priority: true,
  dataLocationKnown: false,
  documentationReady: false,
  cloudActAware: false,
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function profileFromAnswers(answers: QuizAnswer[]): QuizProfile {
  return {
    securityPriority: answers[1] !== "nej" || answers[4] === "ja",
    nis2Priority: answers[3] !== "ja" || answers[4] === "ja",
    dataLocationKnown: answers[2] === "ja",
    documentationReady: answers[3] === "ja",
    cloudActAware: answers[4] === "ja",
  };
}

function loadQuizAnswers(): QuizAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("eurostack_quiz_answers") ?? "[]") as QuizAnswer[];
  } catch {
    return [];
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliersState] = useState<UserSupplier[]>([]);
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    setSuppliersState(loadUserSuppliers());
    setQuizAnswersState(loadQuizAnswers());
  }, []);

  const value = useMemo<AppStateContextValue>(() => {
    return {
      suppliers,
      quizAnswers,
      quizProfile: quizAnswers.length ? profileFromAnswers(quizAnswers) : defaultProfile,
      setSuppliers: (next) => {
        setSuppliersState(next);
        saveUserSuppliers(next);
      },
      setQuizAnswers: (next) => {
        setQuizAnswersState(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("eurostack_quiz_answers", JSON.stringify(next));
        }
      },
    };
  }, [quizAnswers, suppliers]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}