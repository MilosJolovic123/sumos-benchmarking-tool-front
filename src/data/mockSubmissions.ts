import type { Answer, Submission, AnswerValue, Question, RubricDimension } from "@/types/survey";
import { MOCK_QUESTIONS, INSTITUTION_TO_STATE, QUESTIONNAIRE_VERSION, deriveMobilityDone } from "@/data/questions";

/**
 * Generator deterministički "popunjenih" anketa — koristi se za sve grafove i benchmark
 * dok backend nije zakačen. Svaka submisija je 1:1 po `Submission` šemi (NestJS).
 */

// ───── Deterministički PRNG (mulberry32) ─────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(424242);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
/** Likert biased ka 3-4 (realnija raspodela). */
const likert = (bias = 3.4): number => {
  const r = rand();
  // bias-centered, opseg 1..5
  const v = Math.round(bias + (r - 0.5) * 3);
  return Math.min(5, Math.max(1, v));
};

const INSTITUTIONS = Object.keys(INSTITUTION_TO_STATE).filter((i) => i !== "Other");

function answerForQuestion(q: Question, mobility: boolean): AnswerValue | undefined {
  if (q.requiresMobility && !mobility) return undefined;

  switch (q.type) {
    case "LIKERT":
      return likert();
    case "NUMBER":
      // demo_age
      return randInt(18, 28);
    case "TEXT":
      return "";
    case "SINGLE_CHOICE": {
      const opts = q.options as string[];
      // exchange_status: ~45% mobility=true grupa
      if (q.key === "exchange_status") {
        return mobility ? pick(["Yes, once", "I'm currently on my semester abroad", "Yes, twice or more"]) : pick(["No", "Not yet, but I applied for an exchange for the next academic year"]);
      }
      return pick(opts);
    }
    case "LIKERT-MATRIX": {
      const opts = q.options as string[];
      const out: Record<string, number> = {};
      opts.forEach((o) => (out[o] = likert()));
      return out;
    }
    case "RUBRIC": {
      const dims = q.options as RubricDimension[];
      const out: Record<string, number> = {};
      dims.forEach((d) => (out[d.dimension] = likert(3.6)));
      return out;
    }
  }
}

function buildOne(institution: string, idx: number): Submission {
  const mobility = rand() < 0.45;

  // Forsiramo institucijski izbor pre mapiranja state
  const answers: Answer[] = [];
  for (const q of MOCK_QUESTIONS) {
    let value: AnswerValue | undefined;
    if (q.key === "study_status_university") value = institution;
    else value = answerForQuestion(q, mobility);
    if (value === undefined) continue;
    answers.push({
      questionKey: q.key,
      questionText: q.text,
      category: q.category,
      questionVersion: q.version,
      value,
    });
  }

  // Mobilitija je zaista mobility: derivira iz exchange_status odgovora ako postoji
  const exchVal = answers.find((a) => a.questionKey === "exchange_status")?.value as string | undefined;
  const mobilityDone = deriveMobilityDone(exchVal);

  return {
    state: INSTITUTION_TO_STATE[institution] || "Unknown",
    institution,
    questionnaireVersion: QUESTIONNAIRE_VERSION,
    email: `student${idx}@example.edu`,
    mobilityDone,
    answers,
  };
}

/** Generišemo ~520 submisija — približno raspoređeno po 5 institucija. */
function generateAll(total = 520): Submission[] {
  const list: Submission[] = [];
  for (let i = 0; i < total; i++) {
    const inst = INSTITUTIONS[i % INSTITUTIONS.length];
    list.push(buildOne(inst, i + 1));
  }
  return list;
}

export const MOCK_SUBMISSIONS: Submission[] = generateAll();

/** Benchmark code → submisija (deterministički). Prvi su SUM-AAA001..SUM-AAA010 za lakše testiranje. */
export const MOCK_SUBMISSION_CODES: Record<string, Submission> = (() => {
  const map: Record<string, Submission> = {};
  MOCK_SUBMISSIONS.forEach((s, i) => {
    const code = `SUM-${String(i + 1).padStart(5, "0")}`;
    map[code] = s;
  });
  return map;
})();

// ──────────────────────────────────────────────────────────────
// AGREGACIONI HELPERI
// ──────────────────────────────────────────────────────────────

const avg = (vals: number[]): number =>
  vals.length === 0 ? 0 : Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));

/** Prosečan LIKERT skor jedne submisije (preko svih LIKERT pitanja). */
export function submissionScore(s: Submission): number {
  const nums: number[] = [];
  for (const a of s.answers) {
    if (typeof a.value === "number") {
      // demo_age preskačemo
      if (a.questionKey === "demo_age") continue;
      nums.push(a.value);
    } else if (a.value && typeof a.value === "object") {
      // LIKERT-MATRIX i RUBRIC — uprosečimo unutrašnje vrednosti
      const vals = Object.values(a.value as Record<string, number>);
      if (vals.length) nums.push(avg(vals));
    }
  }
  return avg(nums);
}

/** Prosečan skor po državi (za bar chart). */
export function scoreByCountry(submissions: Submission[] = MOCK_SUBMISSIONS) {
  const groups: Record<string, number[]> = {};
  for (const s of submissions) {
    (groups[s.state] ||= []).push(submissionScore(s));
  }
  return Object.entries(groups).map(([country, scores]) => ({
    country,
    score: avg(scores),
    color: "hsl(160, 45%, 45%)",
  }));
}

/** Prosečan LIKERT skor po jednoj kategoriji (npr. AWARENESS), preko submisija. */
export function scoreByCategory(category: string, submissions: Submission[] = MOCK_SUBMISSIONS): number {
  const vals: number[] = [];
  for (const s of submissions) {
    for (const a of s.answers) {
      if (a.category === category && typeof a.value === "number") vals.push(a.value);
    }
  }
  return avg(vals);
}

/** Sustainable behaviour bar chart — prosek po 4 glavne mete-kategorije. */
export function behaviourBars(submissions: Submission[] = MOCK_SUBMISSIONS) {
  return [
    { category: "Awareness", score: scoreByCategory("AWARENESS", submissions) },
    { category: "Attitudes", score: scoreByCategory("ATTITUDES/MOTIVATIONS", submissions) },
    { category: "Habits", score: avgHabitsScore(submissions) },
    { category: "Barriers", score: avgBarriersScore(submissions) },
  ];
}

function avgHabitsScore(submissions: Submission[]): number {
  const vals: number[] = [];
  for (const s of submissions) {
    for (const a of s.answers) {
      if (!a.category.startsWith("HABITS")) continue;
      if (typeof a.value === "number") vals.push(a.value);
      else if (a.value && typeof a.value === "object") {
        vals.push(avg(Object.values(a.value as Record<string, number>)));
      }
    }
  }
  return avg(vals);
}

function avgBarriersScore(submissions: Submission[]): number {
  const vals: number[] = [];
  for (const s of submissions) {
    for (const a of s.answers) {
      if (!a.category.startsWith("BARRIERS")) continue;
      if (typeof a.value === "number") vals.push(a.value);
    }
  }
  return avg(vals);
}

/** Radar — HABITS sub-kategorije po državi. */
export function habitsRadarByCountry(
  countries: string[] = ["Croatia", "France", "Slovakia", "Slovenia", "Serbia"],
  submissions: Submission[] = MOCK_SUBMISSIONS,
) {
  const subs = ["Travel", "Living and accommodation", "Buying and consumption", "Digital habits", "Engagement in the community"];
  return subs.map((sub) => {
    const row: Record<string, number | string> = { category: sub.split(" ")[0], fullMark: 5 };
    for (const c of countries) {
      const filtered = submissions.filter((s) => s.state === c);
      const vals: number[] = [];
      for (const s of filtered) {
        for (const a of s.answers) {
          if (a.category !== `HABITS - ${sub}`) continue;
          if (typeof a.value === "number") vals.push(a.value);
          else if (a.value && typeof a.value === "object") {
            vals.push(avg(Object.values(a.value as Record<string, number>)));
          }
        }
      }
      row[c] = avg(vals);
    }
    return row;
  });
}

/** Globalni statistički sažetak (za Statistics gornje kartice). */
export function statsOverview(submissions: Submission[] = MOCK_SUBMISSIONS) {
  const total = submissions.length;
  const avgScore = avg(submissions.map(submissionScore));
  return {
    totalSurveys: total,
    avgCompletionTime: "10m 42s",
    popularBadge: "Eco Explorer",
    globalGreenScore: avgScore,
  };
}
