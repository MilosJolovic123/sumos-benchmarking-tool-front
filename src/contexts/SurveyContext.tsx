import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { generateBenchmarkCode } from "@/data/mockData";
import { fetchQuestions, submitSurvey } from "@/lib/api/questions";
import {
  INSTITUTION_TO_STATE,
  QUESTIONNAIRE_VERSION,
  deriveMobilityDone,
} from "@/data/questions";
import type { Answer, AnswerValue, Question, Submission } from "@/types/survey";

interface SurveyState {
  /** Backend-shaped answers: questionKey -> AnswerValue (number | string | Record<string, number>). */
  answers: Record<string, AnswerValue>;
  /** Legacy demographic block — zadržano radi back-compat sa Survey.tsx step 0 i Benchmark filterima. */
  generalInfo: {
    gender: string;
    country: string;
    institution: string;
    mobility: boolean;
  };
  isCompleted: boolean;
  isRealAttempt: boolean | null;
  benchmarkCode: string | null;
  email: string;
}

interface SurveyContextType {
  state: SurveyState;
  questions: Question[];
  questionsLoading: boolean;
  //state za consent
  hasConsented: boolean;
  setHasConsented: (value: boolean) => void;

  /** Univerzalni setter — radi za sve tipove pitanja. */
  setAnswer: (questionKey: string, value: AnswerValue) => void;

  setGeneralInfo: (info: SurveyState["generalInfo"]) => void;
  setIsRealAttempt: (value: boolean) => void;
  setEmail: (email: string) => void;
  completeSurvey: () => Promise<void>;
  resetSurvey: () => void;

  /** Skor računa samo nad LIKERT pitanjima (1..5). */
  getScore: () => number;
  getCategoryScore: (category: string) => number;
  /** Backward-compat za stari Survey.tsx — vraća prosečan LIKERT skor pitanja čija kategorija počinje sa "HABITS - <subcategory>". */
  getSubcategoryScore: (subcategory: string) => number;
  /** Procenat odgovorenih pitanja (osim optional koja se ne računaju). */
  getProgress: () => number;

  /** Da li je student bio na razmeni — derivirano iz odgovora `exchange_status`. */
  mobilityDone: boolean;

  /** Sklapanje payload-a tačno po `Submission` šemi. */
  buildSubmission: () => Submission;
}

const initialState: SurveyState = {
  answers: {},
  generalInfo: { gender: "", country: "", institution: "", mobility: false },
  isCompleted: false,
  isRealAttempt: null,
  benchmarkCode: null,
  email: "",
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SurveyState>(initialState);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [hasConsented, setHasConsented] = useState(false);

  // Učitavanje pitanja preko API loader-a (mock dok backend nije zakačen).
  useEffect(() => {
    let mounted = true;
    fetchQuestions()
      .then((qs) => {
        if (mounted) {
          setQuestions(qs);
          setQuestionsLoading(false);
        }
      })
      .catch(() => mounted && setQuestionsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const setAnswer = (questionKey: string, value: AnswerValue) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionKey]: value },
    }));
  };

  const setGeneralInfo = (info: SurveyState["generalInfo"]) => {
    setState((prev) => ({ ...prev, generalInfo: info }));
  };

  const setIsRealAttempt = (value: boolean) => {
    setState((prev) => ({ ...prev, isRealAttempt: value }));
  };

  const setEmail = (email: string) => {
    setState((prev) => ({ ...prev, email }));
  };

  const mobilityDone = useMemo(() => {
    const v = state.answers["exchange_status"];
    return (
      deriveMobilityDone(typeof v === "string" ? v : undefined) ||
      state.generalInfo.mobility
    );
  }, [state.answers, state.generalInfo.mobility]);

  const completeSurvey = async () => {
    const submission = buildSubmissionFrom(state, questions, mobilityDone);
    try {
      const { benchmarkCode } = await submitSurvey(submission);
      setState((prev) => ({ ...prev, isCompleted: true, benchmarkCode }));
    } catch {
      // Ako submit pukne, ostajemo lokalni — generišemo kod kao fallback.
      setState((prev) => ({
        ...prev,
        isCompleted: true,
        benchmarkCode: generateBenchmarkCode(),
      }));
    }
  };

  const resetSurvey = () => setState(initialState);

  // ───── Skor helperi (rade samo nad LIKERT pitanjima) ─────
  const likertValues = (filterFn: (q: Question) => boolean): number[] =>
    questions
      .filter((q) => q.type === "LIKERT" && filterFn(q))
      .map((q) => state.answers[q.key])
      .filter((v): v is number => typeof v === "number");

  const avg = (vals: number[]) =>
    vals.length === 0
      ? 0
      : Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));

  const getScore = () => avg(likertValues(() => true));
  const getCategoryScore = (category: string) =>
    avg(
      likertValues(
        (q) =>
          q.category === category || q.category.startsWith(`${category} -`),
      ),
    );
  const getSubcategoryScore = (subcategory: string) =>
    avg(likertValues((q) => q.category === `HABITS - ${subcategory}`));

  const getProgress = () => {
    const required = questions.filter((q) => !q.optional);
    if (required.length === 0) return 0;
    const answered = required.filter(
      (q) => state.answers[q.key] !== undefined,
    ).length;
    return Math.round((answered / required.length) * 100);
  };

  const buildSubmission = () =>
    buildSubmissionFrom(state, questions, mobilityDone);

  return (
    <SurveyContext.Provider
      value={{
        state,
        questions,
        questionsLoading,
        hasConsented,
        setHasConsented,
        setAnswer,
        setGeneralInfo,
        setIsRealAttempt,
        setEmail,
        completeSurvey,
        resetSurvey,
        getScore,
        getCategoryScore,
        getSubcategoryScore,
        getProgress,
        mobilityDone,
        buildSubmission,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

function buildSubmissionFrom(
  state: SurveyState,
  questions: Question[],
  mobilityDone: boolean,
): Submission {
  const institution =
    (state.answers["study_status_university"] as string) ||
    state.generalInfo.institution ||
    "Other";
  const stateName =
    INSTITUTION_TO_STATE[institution] || state.generalInfo.country || "Unknown";

  const answers: Answer[] = questions
    .filter((q) => state.answers[q.key] !== undefined)
    .map((q) => ({
      questionKey: q.key,
      questionText: q.text,
      category: q.category,
      questionVersion: q.version,
      value: state.answers[q.key],
    }));

  return {
    state: stateName,
    institution,
    questionnaireVersion: QUESTIONNAIRE_VERSION,
    email: state.email,
    mobilityDone,
    answers,
  };
}

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used within SurveyProvider");
  return ctx;
}
