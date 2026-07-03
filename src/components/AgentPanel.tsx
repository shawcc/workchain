import { Bot, Check, Clock3, RotateCcw, UserRound } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";

const decisions = [
  {
    title: "确认核心对象统一为 Goal Node",
    detail: "将 Goal / SubGoal / WorkUnit 收敛为同一个对象。",
    action: "确认",
  },
  {
    title: "是否删除概念说明模块",
    detail: "首页只保留目标节点工作台，不再展示 Concept Map。",
    action: "删除",
  },
  {
    title: "是否重跑结构化推理体验",
    detail: "Redo 会影响首页布局、右侧面板和文档术语。",
    action: "Redo",
  },
];

const agentUpdates = [
  { agent: "产品 Agent", text: "已把核心对象收敛为 Goal Node。", status: "完成" },
  { agent: "交互 Agent", text: "正在替换说明式页面为真实工作台。", status: "进行中" },
  { agent: "工程 Agent", text: "等待你确认后同步推送到 GitHub。", status: "待确认" },
];

export function AgentPanel() {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-y-auto bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Right Now</p>
        <h2 className="mt-1 text-base font-semibold text-slate-950">待我处理</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">只放需要判断、确认或重跑的事项。</p>
      </div>

      <section className="border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <UserRound className="h-4 w-4" />
            需要你决策
          </div>
          <StatusPill>3 条</StatusPill>
        </div>

        <div className="divide-y divide-slate-100">
          {decisions.map((item) => (
            <article className="px-4 py-3" key={item.title}>
              <h3 className="text-sm font-medium text-slate-900">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
              <div className="mt-2 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800">
                  <Check className="h-3.5 w-3.5" />
                  {item.action}
                </button>
                <button className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Review
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900">
          <Bot className="h-4 w-4 text-slate-500" />
          Agent 动态
        </div>

        <div className="divide-y divide-slate-100">
          {agentUpdates.map((item) => (
            <div className="px-4 py-3" key={item.text}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-900">{item.agent}</h3>
                <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{item.status}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Clock3 className="h-4 w-4 text-slate-500" />
          下一步
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500">确认当前目标节点模型后，系统会生成下一级目标节点和行动清单。</p>
      </section>
    </aside>
  );
}
