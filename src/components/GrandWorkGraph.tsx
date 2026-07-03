import { useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, GitBranch, Plus, RotateCcw, ShieldCheck, Target } from "lucide-react";

type GoalNode = {
  id: string;
  level: string;
  title: string;
  owner: string;
  status: string;
  parent?: string;
  interpretation: string;
  target: string;
  assumptions: string[];
  constraints: string[];
  successCriteria: string[];
  reasoning: {
    input: string[];
    logic: string[];
    output: string[];
  };
  children: Array<{ title: string; owner: string; status: string }>;
  actions: Array<{ title: string; owner: string; status: string }>;
};

const goalNodes: GoalNode[] = [
  {
    id: "future-work",
    level: "L0",
    title: "设计未来办公系统",
    owner: "产品负责人",
    status: "进行中",
    interpretation: "做一个以目标节点为中心的工作系统，让人和 Agent 围绕同一个目标持续推理、拆解、执行和复盘。",
    target: "4 周内完成可在线预览的核心原型，验证目标节点、结构化推理和人机协作闭环。",
    assumptions: ["目标节点比文档更适合承载连续工作上下文。", "用户需要先看懂工作从哪里来，再决定下一步做什么。"],
    constraints: ["只展示当前用户有权限看到的上游和知识。", "MVP 不做完整企业 IM 和项目管理替代。"],
    successCriteria: ["任意工作都能追溯到上级目标。", "每次关键推理都有输入、逻辑和产物。", "下游阻塞能回流上游 review。"],
    reasoning: {
      input: ["用户希望未来办公系统不是文档中心。", "当前组织工作经常丢失来源和推理过程。", "Agent 需要结构化对象才能可靠协作。"],
      logic: ["把所有工作统一为 Goal Node，避免 Goal / SubGoal / WorkUnit 概念分裂。", "每个 Goal Node 内置目标定义、假设约束、推理、行动、证据和 review。", "通过向下拆解和向上反馈保证工作链不断。"],
      output: ["确认产品核心对象：Goal Node。", "首页改为目标节点工作台。", "右侧只保留决策和 Agent 动态。"],
    },
    children: [
      { title: "定义目标节点模型", owner: "产品负责人", status: "进行中" },
      { title: "设计结构化推理体验", owner: "交互负责人", status: "待确认" },
      { title: "打通执行与证据回流", owner: "Agent 编排", status: "待拆解" },
    ],
    actions: [
      { title: "确认 Goal Node 字段是否足够", owner: "产品负责人", status: "待决策" },
      { title: "删除概念说明式页面模块", owner: "交互负责人", status: "进行中" },
    ],
  },
  {
    id: "node-model",
    level: "L1",
    title: "定义目标节点模型",
    owner: "产品负责人",
    status: "进行中",
    parent: "设计未来办公系统",
    interpretation: "把 Goal、SubGoal、WorkUnit 收敛为同一个目标节点对象，并定义它在产品里的字段和操作。",
    target: "让用户一眼理解：所有工作都是 Goal Node，只是层级、负责人和上下游关系不同。",
    assumptions: ["减少概念数量会降低理解成本。", "目标节点可以承载从决策到执行的完整上下文。"],
    constraints: ["不能让首页变成产品说明书。", "不能把 Task 设计成与 Goal Node 平级的核心对象。"],
    successCriteria: ["页面只出现一个核心对象。", "下级目标仍能继续递归拆解。", "行动和证据都挂在目标节点内。"],
    reasoning: {
      input: ["用户反馈 Goal / SubGoal / WorkUnit 是一个东西。", "旧界面 Concept Map 像说明书。", "需要更像真实产品。"],
      logic: ["把 SubGoal 改成 Child Goal Node。", "把 WorkUnit 从核心概念中移除。", "把 Task 降级为 Goal Node 内部行动。"],
      output: ["核心对象统一为 Goal Node。", "首页改成目标节点工作台。", "概念图改为真实工作详情。"],
    },
    children: [
      { title: "目标节点字段", owner: "产品负责人", status: "已确认" },
      { title: "目标节点关系", owner: "架构 Agent", status: "进行中" },
      { title: "Review / Redo 规则", owner: "复盘 Agent", status: "待确认" },
    ],
    actions: [
      { title: "更新 PRD 术语", owner: "产品负责人", status: "进行中" },
      { title: "同步前端文案", owner: "工程 Agent", status: "进行中" },
    ],
  },
  {
    id: "reasoning-ui",
    level: "L1",
    title: "设计结构化推理体验",
    owner: "交互负责人",
    status: "待确认",
    parent: "设计未来办公系统",
    interpretation: "把一次推理拆成可读、可 review、可 redo 的结构化过程，而不是展示一段聊天或说明文字。",
    target: "用户能在 10 秒内看懂本次推理用了什么输入、如何推导、产出了什么。",
    assumptions: ["三段式结构比散点图更易理解。", "用户需要看到人和 Agent 各自做了什么。"],
    constraints: ["不要在首屏堆太多概念卡。", "Redo 必须显示影响范围。"],
    successCriteria: ["每次推理都有 x、f(x)、y。", "每一步能 review。", "人和 Agent 的分工清楚。"],
    reasoning: {
      input: ["用户反馈太乱。", "旧页面同时出现概念图、阶梯、右侧解释面板。", "真实产品应服务当前工作。"],
      logic: ["保留目标节点详情作为主视图。", "把推理过程放在当前目标节点内部。", "把右侧收敛为待决策和 Agent 动态。"],
      output: ["主区变成目标节点工作台。", "推理过程作为当前节点的一个模块。", "右侧不再展示说明书式内容。"],
    },
    children: [
      { title: "推理输入", owner: "交互负责人", status: "已设计" },
      { title: "推理逻辑", owner: "Agent", status: "进行中" },
      { title: "推理产物", owner: "产品负责人", status: "待确认" },
    ],
    actions: [
      { title: "确认推理卡是否够清楚", owner: "产品负责人", status: "待决策" },
      { title: "验证用户是否能理解 redo", owner: "研究 Agent", status: "待开始" },
    ],
  },
];

export function GrandWorkGraph() {
  const [selectedId, setSelectedId] = useState(goalNodes[0].id);
  const selected = goalNodes.find((node) => node.id === selectedId) ?? goalNodes[0];

  return (
    <section className="grid gap-5">
      <header className="rounded-[32px] border border-slate-950/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Goal Workspace</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">目标节点工作台</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">这里不是产品说明书，而是当前目标的工作界面：定义目标、查看推理、拆解下级目标、处理行动和 review。</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              新建子目标
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-950/10 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
              <RotateCcw className="h-4 w-4" />
              发起 Review
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <GoalTree selectedId={selectedId} onSelect={setSelectedId} />
        <GoalDetail node={selected} />
      </div>
    </section>
  );
}

function GoalTree({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <aside className="rounded-[32px] border border-slate-950/10 bg-slate-950 p-4 text-white">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-cyan-100" />
        <h2 className="text-lg font-black">目标链路</h2>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">每一层都是 Goal Node。下级不是另一种对象，只是更细的一层目标。</p>

      <div className="mt-5 space-y-3">
        {goalNodes.map((node, index) => {
          const selected = selectedId === node.id;
          return (
            <button
              className={`w-full rounded-[24px] border p-4 text-left transition ${
                selected ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              }`}
              key={node.id}
              onClick={() => onSelect(node.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-[11px] font-black uppercase tracking-[0.24em] ${selected ? "text-slate-600" : "text-cyan-100/50"}`}>{node.level}</p>
                  <h3 className="mt-2 text-sm font-black">{node.title}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${selected ? "bg-slate-950 text-white" : "bg-white/10 text-slate-300"}`}>{node.status}</span>
              </div>
              <p className={`mt-2 text-xs leading-5 ${selected ? "text-slate-700" : "text-slate-400"}`}>{node.owner}</p>
              {index < goalNodes.length - 1 ? (
                <div className={`mt-3 flex items-center gap-2 text-xs font-bold ${selected ? "text-slate-600" : "text-slate-500"}`}>
                  <ArrowRight className="h-3.5 w-3.5" />
                  拆解到下一层
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function GoalDetail({ node }: { node: GoalNode }) {
  return (
    <div className="grid gap-5">
      <article className="rounded-[32px] border border-slate-950/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Current Goal Node</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">{node.title}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">负责人：{node.owner} · 状态：{node.status}</p>
          </div>
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-xs font-black text-slate-700">{node.level}</span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <InfoBlock icon={Target} title="目标解释" items={[node.interpretation]} />
          <InfoBlock icon={CheckCircle2} title="目标值" items={[node.target]} />
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoBlock icon={BrainCircuit} title="假设" items={node.assumptions} />
        <InfoBlock icon={ShieldCheck} title="约束" items={node.constraints} />
        <InfoBlock icon={CheckCircle2} title="成功标准" items={node.successCriteria} />
      </div>

      <ReasoningPanel node={node} />

      <div className="grid gap-5 lg:grid-cols-2">
        <ListPanel title="下级目标节点" items={node.children} />
        <ListPanel title="行动" items={node.actions} />
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, items }: { icon: typeof Target; title: string; items: string[] }) {
  return (
    <section className="rounded-[28px] border border-slate-950/10 bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <p className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold leading-6 text-slate-700" key={item}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function ReasoningPanel({ node }: { node: GoalNode }) {
  return (
    <article className="rounded-[32px] border border-slate-950/10 bg-slate-950 p-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-cyan-100" />
          <h3 className="text-lg font-black">本次推理</h3>
        </div>
        <div className="flex gap-2">
          <button className="rounded-2xl bg-cyan-200 px-4 py-2 text-xs font-black text-slate-950">Review</button>
          <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-black text-white">Redo</button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ReasoningColumn title="输入 x" items={node.reasoning.input} />
        <ReasoningColumn title="逻辑 f(x)" items={node.reasoning.logic} />
        <ReasoningColumn title="产物 y" items={node.reasoning.output} />
      </div>
    </article>
  );
}

function ReasoningColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <h4 className="text-sm font-black text-cyan-50">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-semibold leading-5 text-slate-300" key={item}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function ListPanel({ title, items }: { title: string; items: Array<{ title: string; owner: string; status: string }> }) {
  return (
    <article className="rounded-[32px] border border-slate-950/10 bg-white p-5">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-slate-100 px-4 py-3" key={item.title}>
            <div>
              <h4 className="text-sm font-black text-slate-950">{item.title}</h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.owner}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-600">{item.status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
