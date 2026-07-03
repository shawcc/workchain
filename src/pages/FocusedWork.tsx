import { Bell, Eye, Pin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const focusedItems = [
  { title: "重新定义工作表达", type: "已关注", reason: "这是当前原型的主线小目标", update: "交互 Agent 更新了节点展开方案" },
  { title: "节点就是工作区", type: "收藏", reason: "影响后续所有任务的交互范式", update: "工程 Agent 标记了状态同步风险" },
  { title: "证据驱动验收", type: "已关注", reason: "决定任务是否能闭环", update: "复盘 Agent 建议补充 f(x) 校准规则" },
];

export default function FocusedWork() {
  return (
    <div>
      <PageHeader
        description="这里聚合我收藏、关注或被系统判断为重要的工作，不需要从整张图谱里反复查找。"
        eyebrow="Tab 02 / Focused Work"
        title="我关注的工作"
      />

      <section className="grid gap-4 xl:grid-cols-3">
        {focusedItems.map((item) => (
          <article className="rounded-[32px] border border-slate-950/10 bg-white/75 p-5 shadow-sm" key={item.title}>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                {item.type === "收藏" ? <Pin className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {item.type}
              </span>
              <Bell className="h-4 w-4 text-cyan-700" />
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">关注原因：{item.reason}</p>
            <div className="mt-4 rounded-2xl bg-cyan-100 px-4 py-3 text-sm font-bold text-cyan-950">{item.update}</div>
          </article>
        ))}
      </section>
    </div>
  );
}
