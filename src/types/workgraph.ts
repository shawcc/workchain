export type GraphNodeType =
  | "raw_intent"
  | "goal_interpretation"
  | "goal"
  | "target"
  | "assumption"
  | "constraint"
  | "success_criteria"
  | "work_unit"
  | "sub_goal"
  | "task"
  | "evidence"
  | "exception"
  | "reasoning_record"
  | "review";

export type Confidence = "low" | "medium" | "high";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  title: string;
  description: string;
  status?: string;
  confidence?: Confidence;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation:
    | "derives_from"
    | "supports"
    | "depends_on"
    | "proves"
    | "impacts"
    | "approves"
    | "includes"
    | "decomposes_to"
    | "feedback_to"
    | "reviews"
    | "revises";
}

export interface ReasoningRecord {
  id: string;
  title: string;
  inputX: string[];
  processFx: string[];
  outputY: string[];
  confidence: Confidence;
}

export interface TaskItem {
  id: string;
  title: string;
  subGoal: string;
  owner: string;
  status: "todo" | "doing" | "blocked" | "done";
  evidence: string;
  priority: "低" | "中" | "高";
}

export interface AgentAction {
  agent: string;
  action: string;
  confidence: Confidence;
  changeType: "新增节点" | "更新关系" | "风险提示" | "证据回填";
}
