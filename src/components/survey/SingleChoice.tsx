import { cn } from "@/lib/utils";

interface Props {
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
  questionText: string;
}

export function SingleChoice({ options, value, onChange, questionText }: Props) {
  return (
    <div className="space-y-3 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
