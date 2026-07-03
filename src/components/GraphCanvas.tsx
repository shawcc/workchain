import { graphEdges, graphNodes } from "@/data/workgraph";
import { StatusPill } from "@/components/StatusPill";

const nodeColors = {
  raw_intent: "bg-slate-950 text-white",
  goal_interpretation: "bg-lime-200 text-slate-950",
  goal: "bg-cyan-200 text-slate-950",
  target: "bg-sky-200 text-slate-950",
  assumption: "bg-amber-200 text-slate-950",
  constraint: "bg-orange-200 text-slate-950",
  success_criteria: "bg-teal-200 text-slate-950",
  work_unit: "bg-emerald-200 text-slate-950",
  sub_goal: "bg-emerald-200 text-slate-950",
  task: "bg-blue-200 text-slate-950",
  evidence: "bg-violet-200 text-slate-950",
  exception: "bg-red-200 text-slate-950",
  reasoning_record: "bg-lime-200 text-slate-950",
  review: "bg-rose-200 text-slate-950",
};

export function GraphCanvas() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[32px] border border-slate-950/10 bg-[#dfe7d5] p-5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {graphEdges.map((edge) => {
          const source = graphNodes.find((node) => node.id === edge.source);
          const target = graphNodes.find((node) => node.id === edge.target);
          if (!source || !target) return null;
          return (
            <line
              key={edge.id}
              stroke="rgba(15, 23, 42, 0.35)"
              strokeDasharray={edge.relation === "impacts" || edge.relation === "feedback_to" ? "5 7" : "0"}
              strokeWidth="1.5"
              x1={`${source.x}%`}
              x2={`${target.x}%`}
              y1={`${source.y}%`}
              y2={`${target.y}%`}
            />
          );
        })}
      </svg>

      {graphNodes.map((node) => (
        <article
          className={`absolute w-44 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-950/10 p-3 shadow-xl shadow-slate-950/10 ${nodeColors[node.type]}`}
          key={node.id}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">{node.type}</p>
          <h3 className="mt-1 text-sm font-bold leading-snug">{node.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs opacity-70">{node.description}</p>
        </article>
      ))}

      <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
        <StatusPill variant="low">derives_from</StatusPill>
        <StatusPill variant="high">decomposes_to</StatusPill>
        <StatusPill variant="medium">impacts</StatusPill>
        <StatusPill>proves</StatusPill>
        <StatusPill variant="low">feedback_to</StatusPill>
      </div>
    </div>
  );
}
