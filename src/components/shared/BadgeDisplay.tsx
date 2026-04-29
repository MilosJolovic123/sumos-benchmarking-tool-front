import { Award } from "lucide-react";

interface BadgeDisplayProps {
  name: string;
  description: string;
  size?: "sm" | "lg";
}

export function BadgeDisplay({ name, description, size = "lg" }: BadgeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className={`flex items-center justify-center rounded-full bg-sumos-light-green ${size === "lg" ? "h-24 w-24" : "h-16 w-16"}`}>
        <Award className={`text-sumos-teal ${size === "lg" ? "h-12 w-12" : "h-8 w-8"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-foreground ${size === "lg" ? "text-xl" : "text-base"}`}>{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
