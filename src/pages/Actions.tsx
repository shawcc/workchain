import { AlertTriangle, Play } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TaskBoard } from "@/components/TaskBoard";

export default function Actions() {
  return (
    <div>
      <PageHeader
        description="当前任务：推进节点模型、展开交互、证据回填和复盘校准。"
        eyebrow="Step 05 / Execution Board"
        title="待办"
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-[28px] bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/50">Next Agent Run</p>
          <h2 className="mt-2 text-xl font-black">实现节点逐层展开</h2>
          <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-cyan-200 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
            <Play className="h-4 w-4" />
            启动 Agent 执行
          </button>
        </article>
        <article className="rounded-[28px] border border-amber-900/10 bg-[#fff5cc] p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4" />
            重大偏差候选
          </p>
          <h2 className="mt-2 text-xl font-black text-amber-950">静态图无法表达递归推理</h2>
          <p className="mt-2 text-sm text-amber-950/70">建议回到交互层，优先实现点击展开和节点选中状态。</p>
        </article>
        <article className="rounded-[28px] border border-slate-950/10 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Evidence Rule</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">完成必须有证据</h2>
          <p className="mt-2 text-sm text-slate-600">状态变为 done 前，必须创建 evidence 节点和 proves 关系。</p>
        </article>
      </div>

      <TaskBoard />
    </div>
  );
}
