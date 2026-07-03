import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const decisions = [
  { title: "是否确认“工作图谱是主界面”", level: "高优先级", owner: "我", source: "目标节点 / 目标解释", icon: CheckCircle2 },
  { title: "结构化推理体验是否需要重跑", level: "重大偏差", owner: "我", source: "目标节点 / 本次推理", icon: AlertTriangle },
  { title: "哪些上游目标允许当前团队可见", level: "权限决策", owner: "我", source: "知识库 / 权限边界", icon: HelpCircle },
];

export default function Decisions() {
  return (
    <div>
      <PageHeader
        description="这是跨目标节点汇总的全局 inbox。进入某条待办后，会回到它所属的目标节点或行动卡片里处理。"
        eyebrow="Tab 03 / Decision Inbox"
        title="我的决策待办"
      />

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {decisions.map((decision) => {
          const Icon = decision.icon;
          return (
            <article className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0" key={decision.title}>
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{decision.source}</p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-950">{decision.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">负责人：{decision.owner} · 类型：{decision.level}</p>
                </div>
              </div>
              <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                打开来源卡片
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
