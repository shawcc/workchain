import { FunctionSquare, RotateCcw, TrendingUp } from "lucide-react";
import { reasoningRecords } from "@/data/workgraph";

export function ReasoningDrawer() {
  const record = reasoningRecords[0];

  return (
    <article className="rounded-[28px] border border-cyan-200/15 bg-[#061922]/80 p-5 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
          <FunctionSquare className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/50">Reasoning Record</p>
          <h3 className="text-sm font-semibold text-white">{record.title}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ReasoningBlock label="x 输入信息" items={record.inputX} />
        <ReasoningBlock label="f(x) 推理过程" items={record.processFx} />
        <ReasoningBlock label="y 阶段结论" items={record.outputY} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs font-semibold text-cyan-100">步骤级操作</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-cyan-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-100">
            Review
          </button>
          <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-200 transition hover:bg-white/10">
            <RotateCcw className="h-3.5 w-3.5" />
            Redo
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">Redo 会先展示下游 Goal Node、行动和 Evidence 的影响范围。</p>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-xs text-emerald-50">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp className="h-3.5 w-3.5" />
          复盘价值
        </div>
        <p className="mt-1 text-emerald-50/70">待校准：节点拆解是否清晰、协作边界是否准确、执行证据是否足够。</p>
      </div>
    </article>
  );
}

function ReasoningBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-cyan-100">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-slate-300" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
