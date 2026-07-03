import { BookOpen, LockKeyhole, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const knowledgeItems = [
  { title: "访谈记录：未来办公痛点", scope: "我可见", type: "用户反馈", summary: "任务系统丢上下文，文档不可执行，复盘难以回到推理过程。" },
  { title: "旧办公流程与竞品截图", scope: "团队可见", type: "背景材料", summary: "用于支撑工作图谱作为主界面的产品假设。" },
  { title: "上级经营目标原文", scope: "无权限", type: "上游上下文", summary: "当前账号不可见，仅保留权限边界提示。" },
];

export default function KnowledgeBase() {
  return (
    <div>
      <PageHeader
        description="知识库展示与当前工作相关的材料、证据和背景，但所有内容都受到权限控制。"
        eyebrow="Tab 04 / Permissioned Knowledge"
        title="知识库"
      />

      <div className="mb-5 flex items-center gap-3 rounded-[28px] border border-slate-950/10 bg-white/75 px-5 py-4">
        <Search className="h-5 w-5 text-slate-500" />
        <span className="text-sm font-bold text-slate-500">搜索我有权限访问的目标、材料、证据和复盘记录</span>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {knowledgeItems.map((item) => {
          const locked = item.scope === "无权限";
          return (
            <article className={`rounded-[32px] border p-5 ${locked ? "border-dashed border-slate-400/70 bg-slate-200/70" : "border-slate-950/10 bg-white/75"}`} key={item.title}>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                  {locked ? <LockKeyhole className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                  {item.scope}
                </span>
                <span className="text-xs font-bold text-slate-500">{item.type}</span>
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
