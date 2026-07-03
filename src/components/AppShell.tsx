import { NavLink, Outlet } from "react-router-dom";
import { Activity, BellDot, BookOpen, Eye, Network } from "lucide-react";
import { AgentPanel } from "@/components/AgentPanel";
import { ContextSpine } from "@/components/ContextSpine";
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
    <div className="min-h-screen overflow-hidden bg-[#071014] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(52,211,153,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#071014_0%,#0c1d22_45%,#10130f_100%)]" />
      <div className="noise fixed inset-0 -z-10 opacity-[0.18]" />

      <main className="grid h-screen grid-cols-[260px_minmax(0,1fr)_360px] gap-4 p-4 max-xl:grid-cols-[220px_minmax(0,1fr)] max-xl:[&_.agent-shell]:hidden">
        <aside className="flex min-h-0 flex-col rounded-[32px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
          <div className="rounded-[24px] border border-cyan-200/20 bg-cyan-200/10 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">FUTURE WORK</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-white">设计未来办公系统</h1>
            <p className="mt-3 text-xs leading-5 text-slate-300">我的可见空间 · 权限内图谱</p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                      isActive ? "bg-cyan-200 text-slate-950 shadow-lg shadow-cyan-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white",
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

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
            <ContextSpine />
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 text-xs text-emerald-100">
              <Activity className="h-4 w-4" />
              当前目标
            </div>
            <h2 className="mt-2 text-sm font-semibold text-white">{goalSummary.rawIntent}</h2>
            <p className="mt-2 text-xs text-slate-400">只展示我有权限访问的上游、下游、知识和待办。</p>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <GateBar />
          <div className="min-h-0 flex-1 overflow-y-auto rounded-[32px] border border-white/10 bg-[#eef1e6] p-5 text-slate-950 shadow-2xl shadow-black/20">
            <Outlet />
          </div>
        </section>

        <div className="agent-shell min-h-0">
          <AgentPanel />
        </div>
      </main>
    </div>
  );
}
