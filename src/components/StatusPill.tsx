import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  high: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  medium: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  low: "border-slate-300/30 bg-slate-300/10 text-slate-100",
  accent: "border-cyan-300/40 bg-cyan-300/10 text-cyan-100",
};

interface StatusPillProps {
  children: ReactNode;
  variant?: keyof typeof variants;
}

export function StatusPill({ children, variant = "accent" }: StatusPillProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
}
