import type { Question, Submission } from "@/types/survey";
import { MOCK_QUESTIONS } from "@/data/questions";
import { generateBenchmarkCode } from "@/data/mockData";

/**
 * Loader pitanja. Faza 1: vraća MOCK_QUESTIONS.
 * Faza 2 (kad backend bude dostupan): zameniti telom:
 *   const res = await fetch("/api/questions");
 *   return (await res.json()) as Question[];
 */
export async function fetchQuestions(): Promise<Question[]> {
  return Promise.resolve(MOCK_QUESTIONS.filter((q) => q.active));
}

/**
 * Submit upitnika. Faza 1: simulacija + lokalno generisan benchmark code.
 * Faza 2: POST /api/submissions sa `submission` body-jem.
 */
export async function submitSurvey(
  submission: Submission,
): Promise<{ benchmarkCode: string }> {
  // eslint-disable-next-line no-console
  console.log("[submitSurvey] payload (mock):", submission);
  return Promise.resolve({ benchmarkCode: generateBenchmarkCode() });
}
