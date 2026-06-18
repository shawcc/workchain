import { ArrowDown, CircleDot, Database, GitBranch, Hammer, Sigma } from "lucide-react";

const layers = [
  {
    id: "root",
    icon: CircleDot,
    title: "根节点",
    subtitle: "设计目标",
    text: "设计未来的办公系统",
  },
  {
    id: "reasoning",
    icon: Sigma,
    title: "推理层",
    subtitle: "f(x) 展开",
    text: "推演工作表达、人机协作、执行闭环和复盘校准",
  },
  {
    id: "goals",
    icon: GitBranch,
    title: "目标拆解",
    subtitle: "充分条件",
    text: "工作表达、Agent 协作、执行闭环、证据校准",
  },
  {
    id: "tasks",
    icon: Hammer,
    title: "工作节点",
    subtitle: "可执行任务",
    text: "每个任务继续递归：理解目标、推演、拆解、执行、校准",
  },
  {
    id: "evidence",
    icon: Database,
    title: "证据与校准",
    subtitle: "复盘 f(x)",
    text: "用用户反馈、原型结果和执行证据校准推理过程",
  },
];

export function ContextSpine() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/50">CURRENT PATH</p>
      <h2 className="mt-2 text-lg font-semibold text-white">设计主线</h2>
      <div className="mt-5 space-y-3">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <div key={layer.id}>
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 transition hover:bg-white/[0.08]">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-cyan-200/10 text-cyan-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-100/60">{layer.subtitle}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{layer.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{layer.text}</p>
                  </div>
                </div>
              </article>
              {index < layers.length - 1 ? (
                <div className="flex h-5 items-center justify-center text-cyan-100/30">
                  <ArrowDown className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
