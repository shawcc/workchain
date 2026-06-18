import { CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { goalSummary } from "@/data/workgraph";

const draftFields = [
  ["指标", goalSummary.metric],
  ["目标值", goalSummary.targetValue],
  ["时间周期", goalSummary.timeRange],
  ["市场范围", goalSummary.marketScope],
  ["预算约束", goalSummary.budget],
];

const questions = ["用户进入后第一眼应该看到什么？", "每个节点需要哪些固定工作动作？", "哪些步骤必须由人确认？"];

export default function Understanding() {
  return (
    <div>
      <PageHeader
        description="当前目标：确认未来办公系统的核心形态、关键假设、约束和待补信息。"
        eyebrow="Step 02 / Goal Understanding"
        title="理解目标"
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] border border-slate-950/10 bg-white/70 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">结构化目标草案</h2>
            <StatusPill variant="high">置信度 high</StatusPill>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {draftFields.map(([label, value]) => (
              <div className="rounded-3xl bg-slate-950 p-4 text-white" key={label}>
                <p className="text-xs text-cyan-100/60">{label}</p>
                <p className="mt-2 text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <Link className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800" to="/sub-goals">
              确认目标版本
            </Link>
            <button className="rounded-2xl border border-slate-950/15 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-950/5">
              要求重新分析
            </button>
          </div>
        </section>

        <section className="grid gap-4">
          <article className="rounded-[32px] border border-slate-950/10 bg-[#fff5cc] p-5">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
              <HelpCircle className="h-5 w-5" />
              待确认问题
            </h2>
            <div className="mt-4 space-y-2">
              {questions.map((question) => (
                <div className="rounded-2xl border border-amber-900/10 bg-white/50 px-4 py-3 text-sm text-slate-800" key={question}>
                  {question}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-slate-950/10 bg-[#d7f7e5] p-5">
            <h2 className="flex items-center gap-2 text-lg font-black text-emerald-950">
              <CheckCircle2 className="h-5 w-5" />
              本次推理 f(x)
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-950/70">
              x 是用户反馈、办公痛点、Agent 能力和交互约束；f(x) 是 Agent 如何形成目标草案、假设、约束和待确认问题的推理过程。
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
