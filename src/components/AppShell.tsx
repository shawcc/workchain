import { NavLink, Outlet } from "react-router-dom";
import { Activity, BellDot, BookOpen, Eye, Network } from "lucide-react";
import { GateBar } from "@/components/GateBar";
import { goalSummary } from "@/data/workgraph";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "工作图谱", icon: Network },
  { path: "/focused", label: "关注的工作", icon: Eye },
  { path: "/decisions", label: "决策待办", icon: BellDot },
  { path: "/knowledge", label: "知识库", icon: BookOpen },
];

export function AppShell() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-100 text-slate-900">
      <main className="grid h-screen grid-cols-[220px_minmax(0,1fr)] gap-px bg-slate-200 max-xl:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Future Work</p>
            <h1 className="mt-1 truncate text-base font-semibold text-slate-950">设计未来办公系统</h1>
            <p className="mt-1 text-xs text-slate-500">我的可见空间 · 权限内图谱</p>
          </div>

          <nav className="space-y-1 border-b border-slate-200 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition",
                      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    )
                  }
                  key={item.path}
                  to={item.path}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Goal Nodes</p>
              <span className="text-xs text-slate-400">3</span>
            </div>
            <div className="space-y-1">
              {["设计未来办公系统", "定义目标节点模型", "设计结构化推理体验"].map((item, index) => (
                <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2 hover:bg-slate-50" key={item}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-medium text-slate-800">{item}</h3>
                    <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">L{index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Activity className="h-4 w-4" />
              当前目标
            </div>
            <h2 className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">{goalSummary.rawIntent}</h2>
            <p className="mt-1 text-xs text-slate-500">只展示权限内信息。</p>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden bg-slate-50">
          <GateBar />
          <div className="min-h-0 flex-1 overflow-y-auto p-4 text-slate-950">
            <Outlet />
          </div>
        </section>

      </main>
    </div>
  );
}
