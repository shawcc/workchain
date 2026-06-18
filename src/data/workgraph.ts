import type { AgentAction, GraphEdge, GraphNode, ReasoningRecord, TaskItem } from "@/types/workgraph";

export const goalSummary = {
  rawIntent: "设计未来的办公系统。",
  metric: "可用原型",
  targetValue: "完成核心工作流验证",
  timeRange: "4 周探索周期",
  marketScope: "工作表达 / 人机协作 / 任务执行 / 复盘校准",
  budget: "3 人核心小队 + 4 周时间",
};

export const agents = [
  { name: "工作流 Agent", role: "拆解真实办公场景和协作路径", tone: "目标理解" },
  { name: "交互 Agent", role: "推演节点展开、确认和执行体验", tone: "方案推理" },
  { name: "工程 Agent", role: "拆解图谱编辑和状态同步能力", tone: "实现推演" },
  { name: "复盘 Agent", role: "设计 f(x) 记录、回看和校准机制", tone: "校准" },
];

export const graphNodes: GraphNode[] = [
  {
    id: "intent",
    type: "raw_intent",
    title: "原始意图",
    description: goalSummary.rawIntent,
    status: "已捕获",
    confidence: "high",
    x: 12,
    y: 42,
  },
  {
    id: "goal",
    type: "goal",
    title: "未来办公系统",
    description: "完成从目标输入、推理拆解、节点工作、证据回填到复盘校准的核心原型。",
    status: "待确认",
    confidence: "high",
    x: 34,
    y: 42,
  },
  {
    id: "assumption",
    type: "assumption",
    title: "工作图谱是主界面",
    description: "当前假设：用户应该在同一张上下文图上完成协作，而不是切换多个孤立系统。",
    status: "待验证",
    confidence: "medium",
    x: 55,
    y: 20,
  },
  {
    id: "constraint",
    type: "constraint",
    title: "必须能层层展开",
    description: "核心约束是每个节点都能继续拆解，并保留同一套推理工作流。",
    status: "已加入",
    confidence: "high",
    x: 55,
    y: 62,
  },
  {
    id: "sg-id",
    type: "sub_goal",
    title: "重新定义工作表达",
    description: "把大段文档式沟通改成目标、推理、任务、证据之间的图谱化协作。",
    status: "关键小目标",
    confidence: "high",
    x: 74,
    y: 20,
  },
  {
    id: "sg-th",
    type: "sub_goal",
    title: "设计人和 Agent 协作方式",
    description: "人负责确认、授权和取舍，Agent 负责推演、拆解、执行和回填。",
    status: "试点",
    confidence: "medium",
    x: 74,
    y: 42,
  },
  {
    id: "sg-vn",
    type: "sub_goal",
    title: "把推理变成执行闭环",
    description: "每个任务都可追溯到上层推理，并用证据完成验收和校准。",
    status: "风险前置",
    confidence: "medium",
    x: 74,
    y: 64,
  },
  {
    id: "task",
    type: "task",
    title: "实现可展开的节点工作区",
    description: "交付一张能从根目标逐层展开、点击节点继续工作的原型。",
    status: "进行中",
    confidence: "high",
    x: 92,
    y: 20,
  },
  {
    id: "evidence",
    type: "evidence",
    title: "原型反馈记录",
    description: "包含用户反馈、交互问题、推理链断点和下一轮校准建议。",
    status: "待验收",
    confidence: "medium",
    x: 92,
    y: 48,
  },
  {
    id: "reasoning",
    type: "reasoning_record",
    title: "办公系统形态 f(x) 推理过程",
    description: "记录从办公痛点到图谱化工作流的完整推理链。",
    status: "已记录",
    confidence: "high",
    x: 34,
    y: 72,
  },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "intent", target: "goal", relation: "derives_from" },
  { id: "e2", source: "assumption", target: "sg-id", relation: "supports" },
  { id: "e3", source: "constraint", target: "goal", relation: "impacts" },
  { id: "e4", source: "goal", target: "sg-id", relation: "supports" },
  { id: "e5", source: "goal", target: "sg-th", relation: "supports" },
  { id: "e6", source: "goal", target: "sg-vn", relation: "supports" },
  { id: "e7", source: "sg-id", target: "task", relation: "depends_on" },
  { id: "e8", source: "task", target: "evidence", relation: "proves" },
  { id: "e9", source: "reasoning", target: "sg-id", relation: "approves" },
];

export const reasoningRecords: ReasoningRecord[] = [
  {
    id: "fx-001",
    title: "未来办公系统推演：f(x)",
    inputX: ["传统文档协作割裂", "任务系统丢失上下文", "Agent 需要结构化工作对象", "用户希望上来就能直接工作"],
    processFx: [
      "识别目标：未来办公系统要让推理成为协作主流程",
      "把目标拆成表达载体、人机协作、执行闭环三个充分条件",
      "要求每个节点都能继续展开并复用同一套工作流",
      "把待办、知识、复盘降为节点的辅助能力",
    ],
    outputY: ["中心界面改为可展开图谱", "场景改成设计未来办公系统", "节点支持层层拆解", "清理残留旧场景内容"],
    confidence: "high",
  },
];

export const agentActions: AgentAction[] = [
  { agent: "工作流 Agent", action: "把“未来办公系统”拆成表达、协作、执行三个方向", confidence: "high", changeType: "新增节点" },
  { agent: "交互 Agent", action: "建议节点点击后展开下一层工作流", confidence: "high", changeType: "更新关系" },
  { agent: "工程 Agent", action: "标记风险：静态图无法体现递归推理", confidence: "high", changeType: "风险提示" },
  { agent: "复盘 Agent", action: "生成推理过程校准节点", confidence: "medium", changeType: "新增节点" },
];

export const tasks: TaskItem[] = [
  { id: "t1", title: "设计可展开的根目标图", subGoal: "重新定义工作表达", owner: "交互 Agent", status: "doing", evidence: "可点击原型", priority: "高" },
  { id: "t2", title: "定义节点内的标准工作流", subGoal: "设计人和 Agent 协作方式", owner: "工作流 Agent", status: "todo", evidence: "节点流程清单", priority: "高" },
  { id: "t3", title: "实现展开 / 收起 / 选中节点状态", subGoal: "把推理变成执行闭环", owner: "工程 Agent", status: "doing", evidence: "交互实现", priority: "高" },
  { id: "t4", title: "记录每轮反馈对应的 f(x) 修正", subGoal: "把推理变成执行闭环", owner: "复盘 Agent", status: "todo", evidence: "校准记录", priority: "中" },
];
