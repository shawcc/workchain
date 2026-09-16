import type {
  DecompositionDraft,
  GoalTimebox,
} from "../src/data/stepwise-model.js";

export type AgentRequest = {
  goal: {
    id: string;
    title: string;
    problem: string;
    objective: string;
    acceptance: string;
    dri: string;
    reasoningAgent: string;
    executionAgents: string[];
    autonomy: string;
    parent?: string;
    children: Array<{ id: string; title: string; relation?: string }>;
  };
  stage: string;
  method: {
    name: string;
    summary: string;
    checks: string[];
  };
  currentDraft: string;
  instruction: string;
};

export type AgentResponse = {
  proposedDraft: string;
  rationale: string;
  questions: string[];
  provider: string;
};

export type ExecutionRequest = {
  goal: AgentRequest["goal"];
  action: string;
  agent: string;
  riskLevel: "low" | "medium" | "high";
  approvedBy: string;
  context: string;
};

export type ExecutionResponse = {
  outcome: string;
  evidence: Array<{
    label: string;
    detail: string;
    kind: "artifact" | "observation" | "claim";
    source?: string;
  }>;
  needsDecision: boolean;
  decisionQuestion?: string;
  provider: string;
};

export type DecompositionAgentRequest = {
  kind: "decomposition";
  goal: {
    id: string;
    title: string;
    intent: string;
    dri: string;
    timebox: GoalTimebox;
    successCriteria: string[];
    constraints: string[];
    autonomy: string;
  };
};

export type DecompositionAgentResponse = DecompositionDraft & {
  provider: string;
};

type AgentEnvironment = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

function isAgentRequest(value: unknown): value is AgentRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<AgentRequest>;
  return Boolean(
    request.goal?.id &&
      request.goal.title &&
      request.stage &&
      request.method?.name &&
      typeof request.currentDraft === "string" &&
      typeof request.instruction === "string",
  );
}

function extractJson(content: string): unknown {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? content;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("模型没有返回 JSON 对象");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function normalizeResponse(value: unknown, provider: string): AgentResponse {
  if (!value || typeof value !== "object") {
    throw new Error("模型返回结构无效");
  }
  const response = value as Partial<AgentResponse>;
  if (!response.proposedDraft || !response.rationale) {
    throw new Error("模型返回缺少 proposedDraft 或 rationale");
  }
  return {
    proposedDraft: String(response.proposedDraft),
    rationale: String(response.rationale),
    questions: Array.isArray(response.questions)
      ? response.questions.map(String).slice(0, 5)
      : [],
    provider,
  };
}

function isExecutionRequest(value: unknown): value is ExecutionRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<ExecutionRequest>;
  return Boolean(
    request.goal?.id &&
      request.goal.title &&
      request.action &&
      request.agent &&
      request.approvedBy &&
      ["low", "medium", "high"].includes(request.riskLevel ?? ""),
  );
}

function isDecompositionRequest(
  value: unknown,
): value is DecompositionAgentRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<DecompositionAgentRequest>;
  return Boolean(
    request.kind === "decomposition" &&
      request.goal?.id &&
      request.goal.title &&
      request.goal.intent &&
      request.goal.dri &&
      request.goal.timebox?.startsAt &&
      request.goal.timebox.dueAt &&
      Array.isArray(request.goal.successCriteria) &&
      Array.isArray(request.goal.constraints),
  );
}

function normalizeStringArray(value: unknown, maximum: number): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, maximum)
    : [];
}

function normalizeDecompositionResponse(
  value: unknown,
  provider: string,
): DecompositionAgentResponse {
  if (!value || typeof value !== "object") {
    throw new Error("拆解 Agent 返回结构无效");
  }
  const response = value as Partial<DecompositionDraft>;
  if (
    !response.question ||
    !response.logic ||
    !response.completeness ||
    !Array.isArray(response.proposedGoals)
  ) {
    throw new Error("拆解 Agent 返回缺少问题、逻辑、完整性或候选 Goal");
  }

  const proposedGoals = response.proposedGoals
    .slice(0, 5)
    .map((goal) => ({
      title: String(goal?.title ?? "").trim(),
      intent: String(goal?.intent ?? "").trim(),
      successCriteria: normalizeStringArray(goal?.successCriteria, 6),
      constraints: normalizeStringArray(goal?.constraints, 6),
    }))
    .filter(
      (goal) =>
        goal.title && goal.intent && goal.successCriteria.length > 0,
    );
  if (proposedGoals.length < 2) {
    throw new Error("拆解 Agent 至少需要返回 2 个有效候选 Goal");
  }

  const alternatives = Array.isArray(response.alternatives)
    ? response.alternatives
        .slice(0, 5)
        .map((alternative) => ({
          title: String(alternative?.title ?? "").trim(),
          decision:
            alternative?.decision === "merged"
              ? ("merged" as const)
              : ("rejected" as const),
          rationale: String(alternative?.rationale ?? "").trim(),
        }))
        .filter((alternative) => alternative.title && alternative.rationale)
    : [];

  return {
    question: String(response.question).trim(),
    logic: String(response.logic).trim(),
    completeness: String(response.completeness).trim(),
    boundaryRules: normalizeStringArray(response.boundaryRules, 6),
    alternatives,
    openQuestions: normalizeStringArray(response.openQuestions, 5),
    proposedGoals,
    provider,
  };
}

function normalizeExecutionResponse(
  value: unknown,
  provider: string,
): ExecutionResponse {
  if (!value || typeof value !== "object") {
    throw new Error("执行 Agent 返回结构无效");
  }
  const response = value as Partial<ExecutionResponse>;
  if (!response.outcome || !Array.isArray(response.evidence)) {
    throw new Error("执行 Agent 返回缺少 outcome 或 evidence");
  }

  return {
    outcome: String(response.outcome),
    evidence: response.evidence.slice(0, 8).map((item) => ({
      label: String(item.label ?? "运行证据"),
      detail: String(item.detail ?? ""),
      kind: ["artifact", "observation", "claim"].includes(item.kind ?? "")
        ? (item.kind as "artifact" | "observation" | "claim")
        : "claim",
      source: item.source ? String(item.source) : undefined,
    })),
    needsDecision: Boolean(response.needsDecision),
    decisionQuestion: response.decisionQuestion
      ? String(response.decisionQuestion)
      : undefined,
    provider,
  };
}

async function requestModelJson(
  systemPrompt: string,
  userPrompt: string,
  environment: AgentEnvironment,
): Promise<{ value: unknown; provider: string }> {
  const apiKey = environment.apiKey;
  const baseUrl = (environment.baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = environment.model ?? "gpt-4.1-mini";

  if (!apiKey) {
    const error = new Error("未配置 WORKGRAPH_AI_API_KEY");
    error.name = "ConfigurationError";
    throw error;
  }

  const result = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!result.ok) {
    const detail = await result.text();
    throw new Error(`模型请求失败（${result.status}）：${detail.slice(0, 300)}`);
  }

  const payload = (await result.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("模型没有返回内容");
  }

  return {
    value: extractJson(content),
    provider: `${model} @ ${baseUrl}`,
  };
}

export async function runAgent(
  value: unknown,
  environment: AgentEnvironment,
): Promise<AgentResponse> {
  if (!isAgentRequest(value)) {
    throw new Error("请求缺少 Goal、阶段、方法或草稿");
  }

  const systemPrompt = [
    "你是 Stepwise 中的协作 Agent。WorkGraph 是目标、工作与证据的底层关系模型。",
    "你的任务是作为当前 Objective 的推理 Agent，改进某一阶段的结构化草稿，而不是替 Human DRI 做最终决定。",
    "Human DRI 对目标、授权边界、高风险取舍和最终验收负责；执行 Agent 只在已授权范围内行动。",
    "任何新任务都必须说明它服务哪个目标或条件、为什么需要、由谁执行以及需要回填什么证据。",
    "低风险、可逆且处于授权边界内的工作可以建议 Agent 自主推进；越权、高影响、不可逆或证据冲突必须提出 DRI 决策请求。",
    "必须保留可追溯事实，不得虚构数据、证据、截止时间或已完成状态。",
    "不确定内容必须明确标为待确认。",
    "只返回 JSON，不要使用 Markdown 代码块。",
    'JSON 格式：{"proposedDraft":"完整的新草稿","rationale":"修改理由","questions":["需要用户确认的问题"]}',
  ].join("\n");

  const userPrompt = JSON.stringify(
    {
      goal: value.goal,
      currentStage: value.stage,
      method: value.method,
      currentDraft: value.currentDraft,
      userInstruction: value.instruction,
    },
    null,
    2,
  );

  const result = await requestModelJson(systemPrompt, userPrompt, environment);
  return normalizeResponse(result.value, result.provider);
}

export async function runDecompositionAgent(
  value: unknown,
  environment: AgentEnvironment,
): Promise<DecompositionAgentResponse> {
  if (!isDecompositionRequest(value)) {
    throw new Error("请求缺少可拆解的 Goal 上下文");
  }

  const systemPrompt = [
    "你是 Stepwise Reasoning Agent，负责把一个叶子 Goal 拆成可分别验收的下级 Goal 提案。",
    "你只提出 Proposal，不得声称已创建 Goal、Action 或完成现实操作；最终确认权属于 Human DRI。",
    "按独立结果拆分，不按活动清单、部门或实现步骤拆分。每个候选 Goal 必须共同穷尽上级成功标准，且彼此边界清晰。",
    "返回 2 至 5 个候选 Goal。候选 Goal 不生成 ID、DRI、期限或授权边界，这些由系统继承并由 Human DRI 审查。",
    "不得虚构外部事实；不确定内容放入 openQuestions。",
    "只返回 JSON，不要使用 Markdown 代码块。",
    'JSON 格式：{"question":"本次拆解要回答的问题","logic":"从上级到下级的拆解逻辑","completeness":"为何这些候选共同完整覆盖上级目标","boundaryRules":["边界规则"],"alternatives":[{"title":"考虑过但未单列的方案","decision":"merged|rejected","rationale":"原因"}],"openQuestions":["待复查问题"],"proposedGoals":[{"title":"结果型标题","intent":"达成后发生的变化","successCriteria":["可观察、可验收标准"],"constraints":["必要约束"]}]}',
  ].join("\n");

  const result = await requestModelJson(
    systemPrompt,
    JSON.stringify({ goal: value.goal }, null, 2),
    environment,
  );
  return normalizeDecompositionResponse(result.value, result.provider);
}

export async function runExecutionAgent(
  value: unknown,
  environment: AgentEnvironment,
): Promise<ExecutionResponse> {
  if (!isExecutionRequest(value)) {
    throw new Error("请求缺少 Goal、Action、执行 Agent 或授权信息");
  }

  const systemPrompt = [
    "你是 Stepwise 中的执行 Agent。",
    "你要执行一个已经由 Human DRI 授权的、边界明确的知识工作 Action，并返回真实可审查的结果。",
    "只使用请求中提供的事实和你在本次运行中实际生成的内容。不得声称访问了网页、文件、系统、API 或完成了现实操作，除非输入上下文明确提供了对应结果。",
    "把模型本次生成的分析、清单、方案或草稿标记为 artifact；从输入直接观察到的事实标记为 observation；仍需外部核验的判断标记为 claim。",
    "如果完成 Action 需要缺失信息、外部工具、高风险操作或超出授权边界，needsDecision 必须为 true，并提出一个具体的 DRI 决策问题。",
    "只返回 JSON，不要使用 Markdown 代码块。",
    'JSON 格式：{"outcome":"本次实际完成的结果","evidence":[{"label":"证据名称","detail":"可复核内容","kind":"artifact|observation|claim","source":"可选来源"}],"needsDecision":false,"decisionQuestion":"可选问题"}',
  ].join("\n");

  const userPrompt = JSON.stringify(
    {
      goal: value.goal,
      authorizedAction: value.action,
      executionAgent: value.agent,
      riskLevel: value.riskLevel,
      approvedBy: value.approvedBy,
      context: value.context,
    },
    null,
    2,
  );

  const result = await requestModelJson(systemPrompt, userPrompt, environment);
  return normalizeExecutionResponse(result.value, result.provider);
}
