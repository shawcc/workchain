import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-600",
  accent: "border-slate-200 bg-slate-50 text-slate-600",
};

interface StatusPillProps {
  children: ReactNode;
  variant?: keyof typeof variants;
}

export function StatusPill({ children, variant = "accent" }: StatusPillProps) {
  return (
    <span className={cn("inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
}
