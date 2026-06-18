import { AlertTriangle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { tasks } from "@/data/workgraph";
import type { TaskItem } from "@/types/workgraph";

const columns: Array<{ key: TaskItem["status"]; label: string; icon: typeof Circle }> = [
  { key: "todo", label: "待生成", icon: Circle },
  { key: "doing", label: "执行中", icon: Loader2 },
  { key: "blocked", label: "阻塞", icon: AlertTriangle },
  { key: "done", label: "已完成", icon: CheckCircle2 },
];

export function TaskBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column) => {
        const Icon = column.icon;
        const list = tasks.filter((task) => task.status === column.key);
        return (
          <section className="rounded-[28px] border border-slate-950/10 bg-white/65 p-4" key={column.key}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Icon className="h-4 w-4" />
                {column.label}
              </h3>
              <span className="rounded-full bg-slate-950 px-2 py-1 text-xs text-white">{list.length}</span>
            </div>
            <div className="space-y-3">
              {list.map((task) => (
                <article className="rounded-3xl border border-slate-950/10 bg-[#f6f2e7] p-4 shadow-sm" key={task.id}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold leading-snug text-slate-950">{task.title}</h4>
                    <span className="rounded-full bg-cyan-200 px-2 py-1 text-[10px] font-bold text-slate-950">{task.priority}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600">支撑：{task.subGoal}</p>
                  <p className="mt-1 text-xs text-slate-600">责任：{task.owner}</p>
                  <div className="mt-3 rounded-2xl bg-slate-950/5 px-3 py-2 text-xs text-slate-700">证据：{task.evidence}</div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
