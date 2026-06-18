import { Link } from "react-router-dom";
import { GraphCanvas } from "@/components/GraphCanvas";
import { PageHeader } from "@/components/PageHeader";

export default function GraphView() {
  return (
    <div>
      <PageHeader
        description="当前查看：设计目标、拆解条件、任务、证据和风险之间的关系。"
        eyebrow="Step 04 / Reasonable Work Graph"
        title="节点关系"
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <GraphCanvas />
        <aside className="space-y-4">
          <article className="rounded-[32px] border border-slate-950/10 bg-white/70 p-5">
            <h2 className="text-lg font-black text-slate-950">选中节点详情</h2>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">reasoning_record</p>
            <h3 className="mt-2 text-xl font-black text-slate-950">未来办公系统 f(x) 推理过程</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">这条记录保存从输入信息到阶段结论的推理链，用于复盘校准推理过程。</p>
          </article>

          <article className="rounded-[32px] bg-slate-950 p-5 text-white">
            <h2 className="text-lg font-black">图谱健康度</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span>孤立任务</span><strong>0</strong></div>
              <div className="flex justify-between"><span>缺少证据</span><strong>1</strong></div>
              <div className="flex justify-between"><span>已记录推理过程</span><strong>3</strong></div>
            </div>
          </article>

          <Link className="block rounded-2xl bg-cyan-200 px-5 py-4 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-100" to="/actions">
            进入行动板
          </Link>
        </aside>
      </div>
    </div>
  );
}
