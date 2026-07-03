import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const decisions = [
  { title: "是否确认“工作图谱是主界面”", level: "高优先级", owner: "我", source: "目标理解", icon: CheckCircle2 },
  { title: "静态图无法表达递归推理，是否优先改成交互展开", level: "重大偏差", owner: "我", source: "行动板", icon: AlertTriangle },
  { title: "哪些上游目标允许当前团队可见", level: "权限决策", owner: "我", source: "权限边界", icon: HelpCircle },
];

export default function Decisions() {
  return (
    <div>
      <PageHeader
        description="这里不放普通信息流，只放真正需要我确认、取舍、授权或处理的待办。"
        eyebrow="Tab 03 / Decision Inbox"
        title="我的决策待办"
      />

      <section className="space-y-3">
        {decisions.map((decision) => {
          const Icon = decision.icon;
          return (
            <article className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-950/10 bg-white/75 p-5" key={decision.title}>
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{decision.source}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">{decision.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">负责人：{decision.owner} · 类型：{decision.level}</p>
                </div>
              </div>
              <button className="rounded-2xl bg-cyan-200 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                去决策
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
