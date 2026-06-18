import { Bot, Check, Pencil, X } from "lucide-react";
import { agentActions, agents } from "@/data/workgraph";
import { StatusPill } from "@/components/StatusPill";
import { ReasoningDrawer } from "@/components/ReasoningDrawer";

export function AgentPanel() {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/50">SELECTED</p>
        <h2 className="mt-2 text-lg font-semibold text-white">工作表达</h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">待处理：表达载体、节点模型、协作边界、证据回填。</p>
      </div>

      <div className="grid gap-2">
        {agents.map((agent) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={agent.name}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Bot className="h-4 w-4 text-cyan-200" />
              {agent.name}
            </div>
            <p className="mt-1 text-xs text-slate-400">{agent.role}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">下一步</h3>
          <StatusPill>4 条</StatusPill>
        </div>
        <div className="space-y-3">
          {agentActions.map((action) => (
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={action.action}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-cyan-100">{action.agent}</p>
                  <h4 className="mt-1 text-sm font-medium text-white">{action.action}</h4>
                </div>
                <StatusPill variant={action.confidence}>{action.confidence}</StatusPill>
              </div>
              <p className="mt-2 text-xs text-slate-400">{action.changeType}</p>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-cyan-200 px-2 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-100">
                  <Check className="h-3 w-3" />
                  接受
                </button>
                <button className="rounded-xl border border-white/10 px-2 py-2 text-xs text-slate-300 transition hover:bg-white/10">
                  <Pencil className="h-3 w-3" />
                </button>
                <button className="rounded-xl border border-white/10 px-2 py-2 text-xs text-slate-300 transition hover:bg-white/10">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ReasoningDrawer />
    </aside>
  );
}
