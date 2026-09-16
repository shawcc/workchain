import { strict as assert } from "node:assert";
import {
  confirmWorkspaceDecomposition,
  createWorkspaceDecomposition,
  createWorkspaceGoal,
  getWorkspaceSnapshot,
  resetStepwiseStoreForTests,
} from "../api/_stepwise-store";

resetStepwiseStoreForTests();

const before = getWorkspaceSnapshot();
const created = createWorkspaceGoal({
  title: "验证人工创建 Goal",
  intent: "从空白目标定义开始验证 Human DRI 主导的工作流。",
  driName: "测试 DRI",
  driRole: "负责人",
  startsAt: "2026-09-16T09:00:00.000Z",
  dueAt: "2026-09-30T09:00:00.000Z",
  timezone: "Asia/Shanghai",
  successCriteria: ["Goal 已持久化", "创建后可进入 Doc"],
  constraints: ["不得自动创建 Action"],
  autonomy: "可逆工作由 Agent 推进，最终验收由 Human DRI 决策。",
});

const newGoals = Object.values(created.goals).filter(
  (goal) => !before.goals[goal.id],
);
assert.equal(newGoals.length, 1);
assert.equal(created.revision, before.revision + 1);
assert.equal(newGoals[0].level, 0);
assert.equal(newGoals[0].status, "active");
assert.equal(newGoals[0].dri.kind, "human-dri");
assert.equal(created.actions.length, before.actions.length);

const proposed = createWorkspaceDecomposition(newGoals[0].id, {
  question: "如何把目标拆成可分别验收的结果？",
  logic: "按两个互相独立、共同覆盖上级成功标准的结果拆解。",
  completeness: "两个候选分别覆盖定义与验证，缺一不可。",
  boundaryRules: ["按结果拆分，不按活动拆分。"],
  alternatives: [
    {
      title: "按执行角色拆分",
      decision: "rejected",
      rationale: "角色不是可独立验收的结果。",
    },
  ],
  openQuestions: ["确认两个候选的先后依赖。"],
  proposedGoals: [
    {
      title: "形成可执行定义",
      intent: "让目标边界与验收条件明确。",
      successCriteria: ["定义已由 DRI 审查"],
      constraints: ["不创建 Action"],
    },
    {
      title: "完成结果验证",
      intent: "让目标结果可以被独立复核。",
      successCriteria: ["验证结论可追溯"],
      constraints: ["不伪造证据"],
    },
  ],
});
const review = proposed.decompositionReviews.find(
  (item) => item.goalId === newGoals[0].id,
);
assert(review);
assert.equal(review.status, "proposed");
assert.equal(review.proposedGoals.length, 2);
assert.equal(Object.keys(proposed.goals).length, Object.keys(created.goals).length);
assert.equal(review.proposedGoals[0].dri.id, newGoals[0].dri.id);
assert.equal(review.proposedGoals[0].autonomy, newGoals[0].autonomy);
assert.throws(
  () =>
    createWorkspaceDecomposition(newGoals[0].id, {
      question: "重复拆解",
      logic: "不应执行。",
      completeness: "不应执行。",
      boundaryRules: [],
      alternatives: [],
      openQuestions: [],
      proposedGoals: [
        {
          title: "重复一",
          intent: "重复。",
          successCriteria: ["重复"],
          constraints: [],
        },
        {
          title: "重复二",
          intent: "重复。",
          successCriteria: ["重复"],
          constraints: [],
        },
      ],
    }),
  /已有 WISESTEP 拆解记录/,
);

const createdWhilePending = createWorkspaceGoal({
  title: "验证候选 ID 占位",
  intent: "确认新 Goal 不会占用待确认候选的 ID。",
  driName: "测试 DRI",
  driRole: "负责人",
  startsAt: "2026-09-16T09:00:00.000Z",
  dueAt: "2026-09-30T09:00:00.000Z",
  timezone: "Asia/Shanghai",
  successCriteria: ["新 Goal ID 与候选 ID 不冲突"],
  constraints: [],
  autonomy: "",
});
const pendingIds = new Set(
  review.proposedGoals.map((goal) => goal.proposedId),
);
const pendingSafeGoal = Object.values(createdWhilePending.goals).find(
  (goal) =>
    !proposed.goals[goal.id] &&
    goal.title === "验证候选 ID 占位",
);
assert(pendingSafeGoal);
assert.equal(pendingIds.has(pendingSafeGoal.id), false);

const confirmed = confirmWorkspaceDecomposition(
  review.id,
  newGoals[0].dri.id,
);
assert.equal(
  confirmed.decompositionReviews.find((item) => item.id === review.id)?.status,
  "confirmed",
);
for (const childGoalId of review.proposedGoals.map((goal) => goal.proposedId)) {
  assert.equal(confirmed.goals[childGoalId].parentId, newGoals[0].id);
}

assert.throws(
  () =>
    createWorkspaceGoal({
      title: "非法期限",
      intent: "截止时间早于开始时间。",
      driName: "测试 DRI",
      driRole: "负责人",
      startsAt: "2026-09-30T09:00:00.000Z",
      dueAt: "2026-09-16T09:00:00.000Z",
      timezone: "Asia/Shanghai",
      successCriteria: ["应被拒绝"],
      constraints: [],
      autonomy: "",
    }),
  /Deadline 必须晚于开始时间/,
);

resetStepwiseStoreForTests();

console.log(
  JSON.stringify({
    createdGoalId: newGoals[0].id,
    serverAssignedId: true,
    revisionAdvanced: true,
    invalidDeadlineRejected: true,
    noActionCreated: true,
    proposalRequiresConfirmation: true,
    duplicateProposalRejected: true,
    proposedIdsReserved: true,
  }),
);
