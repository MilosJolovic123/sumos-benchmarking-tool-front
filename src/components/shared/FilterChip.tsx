import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-foreground">
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-muted">
        <X className="h-3 w-3 text-muted-foreground" />
      </button>
    </span>
  );
}
