import { useMemo, useState } from "react";
import {
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Database,
  FileStack,
  GitBranch,
  Hammer,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

type Tone = "root" | "reason" | "goal" | "task" | "risk" | "support";

interface WorkNode {
  id: string;
  parentId?: string;
  title: string;
  meta: string;
  tone: Tone;
  icon: typeof Target;
  workflow: string[];
}

const nodes: WorkNode[] = [
  {
    id: "root",
    title: "设计未来的办公系统",
    meta: "根目标",
    icon: Building2,
    tone: "root",
    workflow: ["理解目标", "推演形态", "拆解方向"],
  },
  {
    id: "expression",
    parentId: "root",
    title: "重新定义工作表达",
    meta: "第一层拆解",
    icon: Network,
    tone: "reason",
    workflow: ["理解现状", "推演替代物", "拆解载体"],
  },
  {
    id: "collaboration",
    parentId: "root",
    title: "设计人和 Agent 协作方式",
    meta: "第一层拆解",
    icon: Bot,
    tone: "goal",
    workflow: ["理解角色", "推演边界", "拆解交互"],
  },
  {
    id: "execution",
    parentId: "root",
    title: "把推理变成执行闭环",
    meta: "第一层拆解",
    icon: Hammer,
    tone: "goal",
    workflow: ["理解任务", "推演证据", "拆解验收"],
  },
  {
    id: "graph-carrier",
    parentId: "expression",
    title: "用工作图谱承载协作",
    meta: "第二层拆解",
    icon: GitBranch,
    tone: "task",
    workflow: ["识别节点", "定义关系", "挂载证据"],
  },
  {
    id: "reasoning-unit",
    parentId: "expression",
    title: "每个节点都记录 f(x)",
    meta: "第二层拆解",
    icon: BrainCircuit,
    tone: "task",
    workflow: ["收集 x", "展开 f(x)", "形成 y"],
  },
  {
    id: "human-agent",
    parentId: "collaboration",
    title: "人确认，Agent 推演",
    meta: "第二层拆解",
    icon: Users,
    tone: "task",
    workflow: ["定义确认门", "定义权限", "处理回流"],
  },
  {
    id: "node-workspace",
    parentId: "collaboration",
    title: "节点就是工作区",
    meta: "第二层拆解",
    icon: Sparkles,
    tone: "task",
    workflow: ["进入节点", "继续拆解", "直接执行"],
  },
  {
    id: "evidence-loop",
    parentId: "execution",
    title: "证据驱动验收",
    meta: "第二层拆解",
    icon: Database,
    tone: "support",
    workflow: ["定义证据", "回填结果", "校准推理"],
  },
  {
    id: "governance",
    parentId: "execution",
    title: "异常回流到上层推理",
    meta: "第二层拆解",
    icon: ShieldCheck,
    tone: "risk",
    workflow: ["识别偏差", "定位上层", "重新推演"],
  },
  {
    id: "node-types",
    parentId: "graph-carrier",
    title: "目标 / 假设 / 任务 / 证据",
    meta: "第三层拆解",
    icon: FileStack,
    tone: "support",
    workflow: ["建模字段", "定义状态", "设计操作"],
  },
  {
    id: "relation-types",
    parentId: "graph-carrier",
    title: "推导 / 支撑 / 依赖 / 证明",
    meta: "第三层拆解",
    icon: GitBranch,
    tone: "support",
    workflow: ["定义关系", "展示路径", "支持追溯"],
  },
  {
    id: "fx-review",
    parentId: "reasoning-unit",
    title: "复盘时校准推理过程",
    meta: "第三层拆解",
    icon: CheckCircle2,
    tone: "support",
    workflow: ["对比结果", "找出跳跃", "更新过程"],
  },
];

const toneClasses: Record<Tone, string> = {
  root: "border-slate-950 bg-slate-950 text-white shadow-slate-950/30",
  reason: "border-lime-700/30 bg-lime-200 text-slate-950 shadow-lime-900/10",
  goal: "border-emerald-700/20 bg-emerald-200 text-slate-950 shadow-emerald-900/10",
  task: "border-cyan-700/20 bg-cyan-100 text-slate-950 shadow-cyan-900/10",
  risk: "border-amber-700/25 bg-amber-200 text-slate-950 shadow-amber-900/10",
  support: "border-violet-700/20 bg-violet-100 text-slate-950 shadow-violet-900/10",
};

export function GrandWorkGraph() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  const [selectedId, setSelectedId] = useState("root");

  const visibleNodes = useMemo(() => {
    const result: Array<WorkNode & { depth: number; x: number; y: number }> = [];

    const walk = (parentId: string | undefined, depth: number) => {
      const children = nodes.filter((node) => node.parentId === parentId);
      children.forEach((node, index) => {
        const siblings = children.length;
        const x = siblings === 1 ? 50 : 13 + (74 / Math.max(siblings - 1, 1)) * index;
        const y = 10 + depth * 22;
        result.push({ ...node, depth, x, y });
        if (expanded.has(node.id)) {
          walk(node.id, depth + 1);
        }
      });
    };

    walk(undefined, 0);
    return result;
  }, [expanded]);

  const visibleEdges = visibleNodes
    .filter((node) => node.parentId && visibleNodes.some((item) => item.id === node.parentId))
    .map((node) => [node.parentId as string, node.id]);

  const selectedNode = visibleNodes.find((node) => node.id === selectedId) ?? visibleNodes[0];

  const toggleNode = (id: string) => {
    setSelectedId(id);
    if (!nodes.some((node) => node.parentId === id)) return;
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="relative min-h-[820px] overflow-hidden rounded-[42px] border border-slate-950/10 bg-[#dfe7d5] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(15,23,42,0.16),transparent_18%),linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {visibleEdges.map(([sourceId, targetId]) => {
          const source = visibleNodes.find((node) => node.id === sourceId);
          const target = visibleNodes.find((node) => node.id === targetId);
          if (!source || !target) return null;
          return (
            <path
              d={`M ${source.x} ${source.y} C ${source.x} ${(source.y + target.y) / 2}, ${target.x} ${(source.y + target.y) / 2}, ${target.x} ${target.y}`}
              fill="none"
              key={`${sourceId}-${targetId}`}
              stroke="rgba(15,23,42,0.32)"
              strokeWidth="0.45"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 backdrop-blur">
          未来办公系统
        </span>
        <span className="rounded-full border border-lime-900/10 bg-lime-200/80 px-4 py-2 text-xs font-bold text-lime-950 backdrop-blur">
          当前节点：{selectedNode?.title}
        </span>
      </div>

      {visibleNodes.map((node) => {
        const Icon = node.icon;
        const hasChildren = nodes.some((item) => item.parentId === node.id);
        const isSelected = selectedId === node.id;
        return (
          <article
            className={`absolute z-10 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border p-4 shadow-2xl transition hover:-translate-y-[54%] hover:scale-[1.02] ${toneClasses[node.tone]} ${isSelected ? "ring-4 ring-slate-950/20" : ""}`}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <button className="w-full text-left" onClick={() => toggleNode(node.id)}>
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/45">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-55">{node.meta}</p>
                  <h3 className="mt-1 text-sm font-black leading-tight">{node.title}</h3>
                </div>
              </div>
              <div className="mt-3 grid gap-1.5">
                {node.workflow.map((item) => (
                  <div className="rounded-xl bg-white/40 px-2.5 py-1.5 text-[11px] font-bold" key={item}>
                    {item}
                  </div>
                ))}
              </div>
              {hasChildren ? (
                <div className="mt-3 rounded-2xl bg-slate-950/10 px-3 py-2 text-center text-xs font-black">
                  {expanded.has(node.id) ? "收起下一层" : "展开下一层"}
                </div>
              ) : null}
            </button>
          </article>
        );
      })}

      <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 md:grid-cols-3">
        <AuxCard icon={Hammer} label="待办" text="调研工作表达 · 设计节点模型 · 验证协作流" />
        <AuxCard icon={Database} label="知识" text="访谈记录 · 旧办公流程 · 竞品截图 · 原型反馈" />
        <AuxCard icon={CheckCircle2} label="校准" text="每轮原型反馈 · 推理链修正 · 下一层拆解" />
      </div>
    </section>
  );
}

function AuxCard({ icon: Icon, label, text }: { icon: typeof Hammer; label: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-950/10 bg-white/70 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-black text-slate-950">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
    </div>
  );
}
