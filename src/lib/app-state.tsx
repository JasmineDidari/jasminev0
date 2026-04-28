import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  loadUserSuppliers,
  saveUserSuppliers,
  type QuizProfile,
  type UserSupplier,
} from "@/lib/suppliers";

export type Industry = "Finans" | "Hälsa" | "Offentlig sektor" | "SaaS" | "Industri" | "Annat";
export type DataType = "Persondata" | "Finansiell data" | "Kunddata" | "Hälsodata" | "Källkod" | "Operativ data";
export type ExitReadiness = "Låg" | "Medel" | "Hög";
export type Nis2Strictness = "Inte alls" | "Delvis" | "Strikt";
export type MainDriver = "Compliance" | "Security" | "Cost" | "Sovereignty";

export type StrategicQuizState = {
  industry?: Industry;
  dataTypes: DataType[];
  euStorageImportance?: number;
  exitReadiness?: ExitReadiness;
  nis2Strictness?: Nis2Strictness;
  mainDriver?: MainDriver;
};

type AppStateContextValue = {
  suppliers: UserSupplier[];
  strategicQuiz: StrategicQuizState;
  quizProfile: QuizProfile;
  setSuppliers: (suppliers: UserSupplier[]) => void;
  setStrategicQuiz: (quiz: StrategicQuizState) => void;
  resetStrategicQuiz: () => void;
};

const defaultStrategicQuiz: StrategicQuizState = {
  dataTypes: [],
};

const defaultProfile: QuizProfile = {
  securityPriority: true,
  nis2Priority: true,
  dataLocationKnown: false,
  documentationReady: false,
  cloudActAware: false,
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function profileFromStrategicQuiz(quiz: StrategicQuizState): QuizProfile {
  return {
    securityPriority: quiz.mainDriver === "Security" || quiz.exitReadiness !== "Hög",
    nis2Priority: quiz.nis2Strictness === "Strikt" || quiz.nis2Strictness === "Delvis",
    dataLocationKnown: (quiz.euStorageImportance ?? 0) >= 4,
    documentationReady: quiz.exitReadiness === "Hög",
    cloudActAware: quiz.mainDriver === "Sovereignty" || (quiz.euStorageImportance ?? 0) >= 4,
  };
}

function loadStrategicQuiz(): StrategicQuizState {
  if (typeof window === "undefined") return defaultStrategicQuiz;
  try {
    const stored = window.localStorage.getItem("eurostack_strategic_quiz");
    if (stored) return { ...defaultStrategicQuiz, ...JSON.parse(stored) } as StrategicQuizState;

    const legacyAnswers = JSON.parse(window.localStorage.getItem("eurostack_quiz_answers") ?? "[]") as string[];
    if (legacyAnswers.length) {
      return {
        dataTypes: [],
        euStorageImportance: legacyAnswers[2] === "ja" ? 5 : legacyAnswers[2] === "osaker" ? 3 : 2,
        exitReadiness: legacyAnswers[3] === "ja" ? "Hög" : legacyAnswers[3] === "osaker" ? "Medel" : "Låg",
        nis2Strictness: legacyAnswers[4] === "ja" ? "Strikt" : "Delvis",
        mainDriver: legacyAnswers[1] === "ja" ? "Sovereignty" : "Compliance",
      };
    }
    return defaultStrategicQuiz;
  } catch {
    return defaultStrategicQuiz;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliersState] = useState<UserSupplier[]>([]);
  const [strategicQuiz, setStrategicQuizState] = useState<StrategicQuizState>(defaultStrategicQuiz);

  useEffect(() => {
    setSuppliersState(loadUserSuppliers());
    setStrategicQuizState(loadStrategicQuiz());
  }, []);

  const value = useMemo<AppStateContextValue>(() => {
    return {
      suppliers,
      strategicQuiz,
      quizProfile: profileFromStrategicQuiz(strategicQuiz),
      setSuppliers: (next) => {
        setSuppliersState(next);
        saveUserSuppliers(next);
      },
      setStrategicQuiz: (next) => {
        setStrategicQuizState(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("eurostack_strategic_quiz", JSON.stringify(next));
        }
      },
      resetStrategicQuiz: () => {
        setStrategicQuizState(defaultStrategicQuiz);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("eurostack_strategic_quiz");
          window.localStorage.removeItem("eurostack_quiz_answers");
        }
      },
    };
  }, [strategicQuiz, suppliers]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
