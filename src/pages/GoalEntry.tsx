import { ArrowRight, FileUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { agents, goalSummary } from "@/data/workgraph";

export default function GoalEntry() {
  return (
    <div>
      <PageHeader
        description="输入新的设计目标、业务目标或项目目标。"
        eyebrow="Step 01 / Raw Intent"
        title="新建目标"
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <div className="rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex items-center gap-2 text-cyan-100">
            <Sparkles className="h-5 w-5" />
            战略意图输入
          </div>
          <textarea
            className="mt-6 min-h-52 w-full resize-none rounded-[28px] border border-white/10 bg-white/[0.06] p-6 text-3xl font-semibold leading-tight text-white outline-none ring-cyan-200/30 transition placeholder:text-white/30 focus:ring-4"
            defaultValue={goalSummary.rawIntent}
          />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10">
              <FileUp className="h-4 w-4" />
              上传背景材料
            </button>
            <Link
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-200 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
              to="/understanding"
            >
              开始理解目标
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <article className="rounded-[32px] border border-slate-950/10 bg-white/70 p-5">
            <h2 className="text-sm font-bold text-slate-950">推荐参与 Agent</h2>
            <div className="mt-4 space-y-3">
              {agents.map((agent) => (
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white" key={agent.name}>
                  <p className="text-sm font-semibold">{agent.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{agent.role}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-slate-950/10 bg-[#d7f7e5] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-900/50">Graph Mutation</p>
            <h3 className="mt-2 text-lg font-black text-emerald-950">本页会创建</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-950/75">
              <li>raw_intent 原始意图节点</li>
              <li>background_material 背景材料节点</li>
              <li>derives_from 推导关系</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
