import type { Question, AnswerValue, RubricDimension } from "@/types/survey";
import { LikertScale } from "@/components/shared/LikertScale";
import { SingleChoice } from "./SingleChoice";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";
import { LikertMatrix } from "./LikertMatrix";
import { RubricMatrix } from "./RubricMatrix";

interface Props {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

/**
 * Univerzalni renderer pitanja. Switch po `question.type`.
 * Sve sub-komponente koriste isti API: { question, value, onChange }.
 */
export function QuestionRenderer({ question, value, onChange }: Props) {
  switch (question.type) {
    case "LIKERT": {
      const v = typeof value === "number" ? value : 3;
      return (
        <LikertScale
          questionText={question.text}
          value={v}
          onChange={(n) => onChange(n)}
          labels={["Strongly disagree", "Strongly agree"]}
        />
      );
    }
    case "SINGLE_CHOICE":
      return (
        <SingleChoice
          questionText={question.text}
          options={question.options as string[]}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "NUMBER":
      return (
        <NumberInput
          questionText={question.text}
          value={typeof value === "number" ? value : undefined}
          onChange={(n) => onChange(n)}
        />
      );
    case "TEXT":
      return (
        <TextInput
          questionText={question.text}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "LIKERT-MATRIX":
      return (
        <LikertMatrix
          questionText={question.text}
          options={question.options as string[]}
          value={isRecord(value) ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    case "RUBRIC":
      return (
        <RubricMatrix
          questionText={question.text}
          dimensions={question.options as RubricDimension[]}
          value={isRecord(value) ? value : undefined}
          onChange={(v) => onChange(v)}
        />
      );
    default:
      return null;
  }
}

function isRecord(v: unknown): v is Record<string, number> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
