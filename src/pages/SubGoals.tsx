import { GitBranch, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";

const subGoals = [
  { title: "重新定义工作表达", logic: "从文档沟通转向节点协作", weight: "35%" },
  { title: "设计人和 Agent 协作方式", logic: "人确认，Agent 推演和执行", weight: "30%" },
  { title: "把推理变成执行闭环", logic: "任务必须能回到上层推理", weight: "25%" },
  { title: "建立复盘校准机制", logic: "每轮反馈都修正 f(x)", weight: "10%" },
];

export default function SubGoals() {
  return (
    <div>
      <PageHeader
        description="当前目标：把“设计未来办公系统”拆成可验证的设计条件。"
        eyebrow="Step 03 / Sub-goal Decomposition"
        title="拆解设计条件"
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="rounded-[36px] bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-cyan-200" />
            <h2 className="text-lg font-bold">小目标树</h2>
          </div>
          <div className="mt-6 space-y-3">
            {subGoals.map((goal, index) => (
              <article className="group rounded-[28px] border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/[0.1]" key={goal.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-cyan-100/60">SG-{index + 1}</p>
                    <h3 className="mt-1 text-xl font-bold">{goal.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">支撑逻辑：{goal.logic}</p>
                  </div>
                  <span className="rounded-full bg-cyan-200 px-3 py-1 text-sm font-black text-slate-950">{goal.weight}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <Link className="rounded-2xl bg-cyan-200 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100" to="/graph">
              确认小目标
            </Link>
            <button className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10">
              重新拆解
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <article className="rounded-[32px] border border-slate-950/10 bg-[#fff5cc] p-5">
            <div className="flex items-center gap-2 text-amber-950">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-lg font-black">风险前置</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-amber-950/70">如果中心图不能逐层展开，用户会把它理解成普通 OKR 或项目管理系统。</p>
          </article>
          <article className="rounded-[32px] border border-slate-950/10 bg-white/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Graph Mutation</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>创建 sub_goal 节点</li>
              <li>创建 supports 关系</li>
              <li>记录小目标拆解的 f(x) 推理过程</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
