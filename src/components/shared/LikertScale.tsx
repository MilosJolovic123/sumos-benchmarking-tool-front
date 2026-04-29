import { Slider } from "@/components/ui/slider";

interface LikertScaleProps {
  value: number;
  onChange: (value: number) => void;
  labels: [string, string];
  questionText: string;
}

export function LikertScale({ value, onChange, labels, questionText }: LikertScaleProps) {
  return (
    <div className="space-y-2 py-4 border-b border-border/50 last:border-0">
      <p className="text-center text-sm font-medium text-foreground">{questionText}</p>
      <div className="px-2">
        <div className="flex items-center gap-3">
          <span className="min-w-[80px] text-right text-xs text-muted-foreground">{labels[0]}</span>
          <div className="flex-1">
            <Slider
              value={[value]}
              onValueChange={([v]) => onChange(v)}
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
          </div>
          <span className="min-w-[80px] text-xs text-muted-foreground">{labels[1]}</span>
        </div>
        <div className="flex justify-between px-[80px]">
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} className="text-xs font-medium text-muted-foreground">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
