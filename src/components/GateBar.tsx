import { BellDot, BookOpen, Eye, Network } from "lucide-react";

const steps = [
  { label: "可见图谱", icon: Network, active: true },
  { label: "关注工作", icon: Eye, active: true },
  { label: "决策待办", icon: BellDot, active: true },
  { label: "权限知识", icon: BookOpen, active: false },
];

export function GateBar() {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Current</p>
          <h2 className="text-sm font-semibold text-slate-800">我的工作空间：图谱 · 关注 · 决策 · 知识</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition ${
                  step.active ? "border-slate-300 bg-slate-100 text-slate-700" : "border-slate-200 bg-white text-slate-400"
                }`}
                key={step.label}
              >
                <Icon className="h-3.5 w-3.5" />
                {step.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
