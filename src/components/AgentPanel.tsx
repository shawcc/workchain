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
    <aside className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/50">RIGHT NOW</p>
        <h2 className="mt-2 text-lg font-semibold text-white">待我处理</h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">这里只放需要用户判断、确认或重跑的事项。</p>
      </div>

      <section className="rounded-[24px] border border-cyan-200/15 bg-cyan-200/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-50">
            <UserRound className="h-4 w-4" />
            需要你决策
          </div>
          <StatusPill>3 条</StatusPill>
        </div>

        <div className="mt-4 space-y-3">
          {decisions.map((item) => (
            <article className="rounded-2xl border border-white/10 bg-slate-950/45 p-3" key={item.title}>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">{item.detail}</p>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-cyan-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-100">
                  <Check className="h-3.5 w-3.5" />
                  {item.action}
                </button>
                <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:bg-white/10">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Review
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Bot className="h-4 w-4 text-cyan-200" />
          Agent 动态
        </div>

        <div className="mt-4 space-y-3">
          {agentUpdates.map((item) => (
            <div className="rounded-2xl bg-white/[0.04] p-3" key={item.text}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{item.agent}</h3>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-bold text-cyan-100">{item.status}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Clock3 className="h-4 w-4 text-cyan-200" />
          下一步
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">确认当前目标节点模型后，系统会生成下一级目标节点和行动清单。</p>
      </section>
    </aside>
  );
}
