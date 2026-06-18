import { CheckCircle2, CircleDot, GitBranch, ShieldAlert } from "lucide-react";

const steps = [
  { label: "意图已输入", icon: CircleDot, active: true },
  { label: "目标待确认", icon: CheckCircle2, active: true },
  { label: "小目标待确认", icon: GitBranch, active: false },
  { label: "异常待决策", icon: ShieldAlert, active: false },
];

export function GateBar() {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/50">CURRENT</p>
          <h2 className="mt-1 text-sm font-semibold text-white">未来办公系统 → 工作表达 → 人机协作 → 执行闭环</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs transition ${
                  step.active
                    ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50"
                    : "border-white/10 bg-white/[0.03] text-slate-400"
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
