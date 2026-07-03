import { useState } from "react";
import {
  ArrowDown,
  Bot,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type ReasoningStage = {
  id: string;
  level: string;
  label: string;
  title: string;
  owner: string;
  summary: string;
  input: string[];
  logic: string[];
  output: string[];
  human: string[];
  agent: string[];
  children: string[];
};

const stages: ReasoningStage[] = [
  {
    id: "goal",
    level: "L0",
    label: "Goal Node",
    title: "设计未来办公系统",
    owner: "产品负责人",
    summary: "一个目标化工作节点，承载目标解释、推理、拆解、行动、证据和复盘。",
    input: ["原始表达：设计未来办公系统", "背景：文档、会议、任务系统割裂", "约束：必须能解释工作从哪里来"],
    logic: ["先澄清目标口径和成功标准", "识别工作不应拍脑袋，而应来自推理", "确认所有工作都要能追溯来源"],
    output: ["确认 Goal：用工作图谱承载人和 Agent 协作", "Target：验证核心工作流", "Success Criteria：链路可追溯、可 review、可 redo"],
    human: ["确认目标是否值得做", "补充业务语境和边界", "决定目标版本是否生效"],
    agent: ["抽取目标字段", "识别缺失问题", "生成目标解释稿"],
    children: ["工作表达", "人机协作", "执行闭环"],
  },
  {
    id: "work-unit",
    level: "L1",
    label: "Goal Node",
    title: "工作表达",
    owner: "交互负责人",
    summary: "这是上级 Goal Node 拆出来的下一级 Goal Node，不是另一种对象。",
    input: ["上级 Goal Node：用工作图谱承载协作", "假设：图谱比文档更适合表达连续推理", "约束：权限内可见"],
    logic: ["继承上级目标和约束", "把工作表达拆成可操作的界面对象", "判断哪些实体必须第一眼被看见"],
    output: ["统一概念：Goal / SubGoal / WorkUnit 都是 Goal Node", "保留 Target、Assumption、Constraint、Evidence、Review 作为内部结构", "形成单核心对象图"],
    human: ["判断哪些概念是用户必须立刻理解的", "选择信息结构", "确认是否继续向下拆"],
    agent: ["列出候选实体", "检查实体之间关系", "生成可视化方案"],
    children: ["目标解释卡", "推理步骤卡", "Review / Redo 面板"],
  },
  {
    id: "task",
    level: "L2",
    label: "Goal Node",
    title: "设计推理步骤卡",
    owner: "Agent + 设计师",
    summary: "当执行动作需要独立负责人和继续拆解时，它也会升格为一个 Goal Node。",
    input: ["当前 Goal Node：工作表达", "反馈：概念不清，Goal / SubGoal / WorkUnit 像一个东西", "目标：用一张图讲清楚单核心对象"],
    logic: ["去掉散点图和大量连线", "用阶梯表达层层拆解", "用结构化卡片表达一次推理"],
    output: ["概念图：Goal Node 是唯一核心对象", "递归关系：Goal Node -> Child Goal Node", "执行动作：Task 是 Goal Node 内部动作或叶子状态"],
    human: ["指出当前交互不清楚", "确认这一步推理是否合理", "决定是否 redo"],
    agent: ["重组信息层级", "提炼推理链路", "给出下一版候选界面"],
    children: ["可点击原型", "验证反馈", "下一轮 review"],
  },
];

const promiseCards = [
  {
    icon: GitBranch,
    title: "一个核心对象",
    text: "Goal、SubGoal、WorkUnit 都统一成 Goal Node，只是层级和视角不同。",
  },
  {
    icon: BrainCircuit,
    title: "推理有逻辑",
    text: "每次推理都显示输入、逻辑和产物，不再只展示一个结论。",
  },
  {
    icon: UserRound,
    title: "人和 Agent 协作",
    text: "人负责判断和承诺，Agent 负责结构化、补全和生成候选方案。",
  },
];

export function GrandWorkGraph() {
  const [selectedId, setSelectedId] = useState(stages[0].id);
  const selectedStage = stages.find((stage) => stage.id === selectedId) ?? stages[0];

  return (
    <section className="rounded-[36px] border border-slate-950/10 bg-[#eef1e6] p-5">
      <div className="grid gap-3 xl:grid-cols-3">
        {promiseCards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="rounded-[28px] border border-slate-950/10 bg-white/75 p-4 shadow-sm" key={card.title}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-slate-950">{card.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
            </article>
          );
        })}
      </div>

      <ConceptMap />

      <div className="mt-5 grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-slate-950/10 bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/50">Decomposition</p>
              <h2 className="mt-2 text-xl font-black">目标拆解阶梯</h2>
            </div>
            <ShieldCheck className="h-5 w-5 text-cyan-100/70" />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">只展示权限内可见链路。每一层都是同一种 Goal Node，只是层级不同。</p>

          <div className="mt-5 space-y-3">
            {stages.map((stage, index) => {
              const isSelected = selectedStage.id === stage.id;
              return (
                <div key={stage.id}>
                  <button
                    className={`w-full rounded-[24px] border p-4 text-left transition ${
                      isSelected ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                    onClick={() => setSelectedId(stage.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-[0.25em] ${isSelected ? "text-slate-600" : "text-cyan-100/50"}`}>
                          {stage.level} / {stage.label}
                        </p>
                        <h3 className="mt-2 text-base font-black">{stage.title}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${isSelected ? "bg-slate-950 text-white" : "bg-white/10 text-cyan-50"}`}>
                        {stage.owner}
                      </span>
                    </div>
                    <p className={`mt-3 text-sm leading-5 ${isSelected ? "text-slate-700" : "text-slate-400"}`}>{stage.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {stage.children.map((child) => (
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isSelected ? "bg-white/60 text-slate-700" : "bg-white/10 text-slate-300"}`} key={child}>
                          {child}
                        </span>
                      ))}
                    </div>
                  </button>
                  {index < stages.length - 1 ? (
                    <div className="flex h-7 items-center justify-center text-cyan-100/35">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>

        <div className="grid gap-5">
          <ReasoningCard stage={selectedStage} />
          <CollaborationCard stage={selectedStage} />
        </div>
      </div>
    </section>
  );
}

function ConceptMap() {
  const attributes = ["Goal Interpretation", "Target", "Assumption", "Constraint", "Success Criteria", "Reasoning Run", "Actions / Tasks", "Evidence", "Review / Redo"];

  return (
    <article className="mt-5 rounded-[36px] border border-slate-950/10 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-100/50">Concept Map</p>
          <h2 className="mt-2 text-2xl font-black">一张图：所有工作都是 Goal Node</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            `Goal / SubGoal / WorkUnit` 不再是三种对象。它们统一成同一个目标节点，只是所处层级、负责人和上下游关系不同。
          </p>
        </div>
        <span className="rounded-full bg-cyan-200 px-4 py-2 text-xs font-black text-slate-950">Single Core Object</span>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.3fr_1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">Upstream</p>
          <h3 className="mt-2 text-lg font-black">Parent Goal Node</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">提供来源、目标语境、上级约束和成功标准。</p>
          <div className="mt-4 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-cyan-50">feedback_to / review</div>
        </div>

        <div className="rounded-[32px] bg-cyan-200 p-5 text-slate-950">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-600">Core</p>
            <h3 className="mt-2 text-3xl font-black">Goal Node</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">一个目标化工作节点，内部包含推理、约束、行动和证据。</p>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {attributes.map((item) => (
              <div className="rounded-2xl bg-white/65 px-3 py-2 text-center text-xs font-black" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">Downstream</p>
          <h3 className="mt-2 text-lg font-black">Child Goal Nodes</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">下一级不是另一种对象，而是继续递归的目标节点。</p>
          <div className="mt-4 grid gap-2">
            {["子目标 A", "子目标 B", "子目标 C"].map((item) => (
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-cyan-50" key={item}>
                {item} = Goal Node
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ReasoningCard({ stage }: { stage: ReasoningStage }) {
  return (
    <article className="rounded-[36px] border border-slate-950/10 bg-white p-5 shadow-xl shadow-slate-950/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Reasoning Run</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{stage.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{stage.summary}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800">Review 本次推理</button>
          <button className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-950/10 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100">
            <RotateCcw className="h-3.5 w-3.5" />
            Redo
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ReasoningColumn icon={MessageSquareText} items={stage.input} title="1. 输入 x" tone="slate" />
        <ReasoningColumn icon={BrainCircuit} items={stage.logic} title="2. 结构化逻辑 f(x)" tone="cyan" />
        <ReasoningColumn icon={CheckCircle2} items={stage.output} title="3. 产物 y" tone="emerald" />
      </div>
    </article>
  );
}

function ReasoningColumn({
  icon: Icon,
  items,
  title,
  tone,
}: {
  icon: typeof BrainCircuit;
  items: string[];
  title: string;
  tone: "slate" | "cyan" | "emerald";
}) {
  const toneClass = {
    slate: "bg-slate-100 text-slate-950",
    cyan: "bg-cyan-100 text-slate-950",
    emerald: "bg-emerald-100 text-slate-950",
  }[tone];

  return (
    <section className={`rounded-[28px] p-4 ${toneClass}`}>
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/70">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-black">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div className="rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold leading-5" key={item}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function CollaborationCard({ stage }: { stage: ReasoningStage }) {
  return (
    <article className="rounded-[36px] border border-slate-950/10 bg-[#dbe6d2] p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-cyan-100">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Human + Agent</p>
          <h2 className="text-xl font-black text-slate-950">这次推理里的结构化协作</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ActorColumn icon={UserRound} items={stage.human} title="人负责判断和承诺" />
        <ActorColumn icon={Bot} items={stage.agent} title="Agent 负责结构化和候选方案" />
      </div>
    </article>
  );
}

function ActorColumn({ icon: Icon, items, title }: { icon: typeof UserRound; items: string[]; title: string }) {
  return (
    <section className="rounded-[28px] border border-slate-950/10 bg-white/75 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-700" />
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div className="rounded-2xl border border-slate-950/10 bg-white px-3 py-2 text-sm font-semibold leading-5 text-slate-700" key={item}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
