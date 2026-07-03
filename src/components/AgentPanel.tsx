import { Bot, BrainCircuit, GitBranch, RotateCcw, UserRound } from "lucide-react";
import { agents } from "@/data/workgraph";
import { StatusPill } from "@/components/StatusPill";
import { ReasoningDrawer } from "@/components/ReasoningDrawer";

const thinkingSteps = [
  { label: "理解", human: "确认目标语义", agent: "抽取对象、范围、口径" },
  { label: "建模", human: "判断假设和约束是否成立", agent: "生成 Target、Assumption、Constraint" },
  { label: "拆解", human: "选择拆解方向", agent: "生成子 Goal Node 和行动候选" },
  { label: "复盘", human: "决定是否 redo", agent: "分析影响范围" },
];

export function AgentPanel() {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/50">SELECTED</p>
        <h2 className="mt-2 text-lg font-semibold text-white">结构化推理协作</h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">每次推理都拆成固定步骤：人做判断，Agent 做结构化和候选生成。</p>
      </div>

      <div className="rounded-[24px] border border-cyan-200/15 bg-cyan-200/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-50">
          <GitBranch className="h-4 w-4" />
          本步可 Review / Redo
        </div>
        <p className="mt-2 text-xs leading-5 text-cyan-50/70">
          Redo 前需要先确认影响范围：3 个子 Goal Node、5 个行动和 2 个证据要求可能被重算。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-2xl bg-cyan-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-100">
            Review 本步
          </button>
          <button className="inline-flex items-center justify-center gap-1 rounded-2xl border border-white/10 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10">
            <RotateCcw className="h-3.5 w-3.5" />
            Redo
          </button>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <BrainCircuit className="h-4 w-4 text-cyan-200" />
          本次推理的分工
        </div>
        <div className="mt-4 space-y-3">
          {thinkingSteps.map((step) => (
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3" key={step.label}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-cyan-50">{step.label}</h3>
                <StatusPill variant="high">结构化</StatusPill>
              </div>
              <div className="mt-3 grid gap-2 text-xs">
                <p className="rounded-xl bg-white/[0.04] px-3 py-2 text-slate-300">
                  <UserRound className="mr-1 inline h-3.5 w-3.5 text-cyan-100" />
                  {step.human}
                </p>
                <p className="rounded-xl bg-white/[0.04] px-3 py-2 text-slate-300">
                  <Bot className="mr-1 inline h-3.5 w-3.5 text-cyan-100" />
                  {step.agent}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {agents.slice(0, 3).map((agent) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={agent.name}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Bot className="h-4 w-4 text-cyan-200" />
              {agent.name}
            </div>
            <p className="mt-1 text-xs text-slate-400">{agent.role}</p>
          </div>
        ))}
      </div>

      <ReasoningDrawer />
    </aside>
  );
}
