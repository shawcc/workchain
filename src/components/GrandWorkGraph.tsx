import { useState } from "react";
import { ArrowRight, BrainCircuit, Check, CheckCircle2, GitBranch, Plus, RotateCcw, ShieldCheck, Target } from "lucide-react";

type WorkItem = { title: string; owner: string; status: string };

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
  children: WorkItem[];
  actions: WorkItem[];
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
    <section className="grid gap-3">
      <header className="rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Goal Workspace</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-950">目标节点工作台</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">当前目标的工作界面：定义目标、查看推理、拆解下级目标、处理行动和 review。</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              新建子目标
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" />
              发起 Review
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
        <GoalTree selectedId={selectedId} onSelect={setSelectedId} />
        <GoalDetail key={selected.id} node={selected} />
      </div>
    </section>
  );
}

function GoalTree({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
        <GitBranch className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">目标链路</h2>
      </div>
      <p className="border-b border-slate-100 px-3 py-2 text-xs leading-5 text-slate-500">每一层都是 Goal Node。下级只是更细的一层目标。</p>

      <div className="divide-y divide-slate-100">
        {goalNodes.map((node, index) => {
          const selected = selectedId === node.id;
          return (
            <button
              className={`w-full px-3 py-2.5 text-left transition ${selected ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50"}`}
              key={node.id}
              onClick={() => onSelect(node.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{node.level}</p>
                  <h3 className="mt-1 text-sm font-semibold">{node.title}</h3>
                </div>
                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{node.status}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{node.owner}</p>
              {index < goalNodes.length - 1 ? (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
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
  const defaultWork = node.actions.find((item) => item.status.includes("待")) ?? node.children.find((item) => item.status.includes("待")) ?? node.actions[0] ?? node.children[0];
  const [selectedWork, setSelectedWork] = useState<WorkItem | undefined>(defaultWork);

  return (
    <div className="grid gap-3">
      <article className="rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Current Goal Node</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{node.title}</h2>
            <p className="mt-1 text-sm text-slate-500">负责人：{node.owner} · 状态：{node.status}</p>
          </div>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">{node.level}</span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <InfoBlock icon={Target} title="目标解释" items={[node.interpretation]} />
          <InfoBlock icon={CheckCircle2} title="目标值" items={[node.target]} />
        </div>
      </article>

      <div className="grid gap-3 lg:grid-cols-3">
        <InfoBlock icon={BrainCircuit} title="假设" items={node.assumptions} />
        <InfoBlock icon={ShieldCheck} title="约束" items={node.constraints} />
        <InfoBlock icon={CheckCircle2} title="成功标准" items={node.successCriteria} />
      </div>

      <ReasoningPanel node={node} />

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_320px]">
        <ListPanel items={node.children} onSelect={setSelectedWork} selectedTitle={selectedWork?.title} title="下级目标节点" />
        <ListPanel items={node.actions} onSelect={setSelectedWork} selectedTitle={selectedWork?.title} title="行动" />
        <WorkActionPanel item={selectedWork} />
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, items }: { icon: typeof Target; title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <div className="grid h-6 w-6 place-items-center rounded bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-1 px-3 py-2">
        {items.map((item) => (
          <p className="text-sm leading-6 text-slate-600" key={item}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function ReasoningPanel({ node }: { node: GoalNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">本次推理</h3>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Review</button>
          <button className="rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800">Redo</button>
        </div>
      </div>

      <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
        <ReasoningColumn title="输入 x" items={node.reasoning.input} />
        <ReasoningColumn title="逻辑 f(x)" items={node.reasoning.logic} />
        <ReasoningColumn title="产物 y" items={node.reasoning.output} />
      </div>
    </article>
  );
}

function ReasoningColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-white p-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</h4>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <p className="text-sm leading-5 text-slate-600" key={item}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function ListPanel({
  items,
  onSelect,
  selectedTitle,
  title,
}: {
  items: WorkItem[];
  onSelect: (item: WorkItem) => void;
  selectedTitle?: string;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <button
            className={`flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left transition ${
              selectedTitle === item.title ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
            key={item.title}
            onClick={() => onSelect(item)}
          >
            <div>
              <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
              <p className="mt-0.5 text-xs text-slate-500">{item.owner}</p>
            </div>
            <span
              className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${
                item.status.includes("待") ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              {item.status}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}

function WorkActionPanel({ item }: { item?: WorkItem }) {
  if (!item) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-3">
        <h3 className="text-sm font-semibold text-slate-900">处理面板</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">选择一个下级目标或行动后，在这里处理需要你确认的事项。</p>
      </aside>
    );
  }

  const needsAction = item.status.includes("待");

  return (
    <aside className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-900">处理面板</h3>
        <p className="mt-0.5 text-xs text-slate-500">当前卡片内处理，不再占用全局右栏。</p>
      </div>
      <div className="px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Selected</p>
        <h4 className="mt-1 text-sm font-semibold text-slate-950">{item.title}</h4>
        <p className="mt-1 text-xs text-slate-500">负责人：{item.owner} · 状态：{item.status}</p>

        {needsAction ? (
          <div className="mt-3 grid gap-2">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
              <Check className="h-4 w-4" />
              确认并继续
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <RotateCcw className="h-4 w-4" />
              Review / Redo
            </button>
          </div>
        ) : (
          <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">当前没有必须由你处理的动作，可进入详情查看证据、依赖和下游进展。</p>
        )}
      </div>
    </aside>
  );
}
