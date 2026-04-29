import { Input } from "@/components/ui/input";

interface Props {
  value: number | undefined;
  onChange: (v: number) => void;
  questionText: string;
}

export function NumberInput({ value, onChange, questionText }: Props) {
  return (
    <div className="space-y-2 py-4 border-b border-border/50 last:border-0">
      <p className="text-sm font-medium text-foreground">{questionText}</p>
      <Input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => {
          const n = e.target.value === "" ? NaN : Number(e.target.value);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className="max-w-[160px]"
      />
    </div>
  );
}
