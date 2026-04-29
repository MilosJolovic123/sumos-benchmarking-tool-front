import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors",
                i <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("mx-2 h-0.5 w-12 sm:w-20", i < currentStep ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}
