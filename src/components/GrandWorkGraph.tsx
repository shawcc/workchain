import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Plus,
  RotateCcw,
  ShieldCheck,
  Target,
  AlertTriangle,
} from "lucide-react";

/* ── 数据模型 ── */

type LogicNode = {
  text: string;
  chain?: LogicNode[];
};

type ReasoningTrace = {
  input: LogicNode[];
  logic: LogicNode[];
  output: LogicNode[];
  redoImpact?: string[];
};

type ReasonedItem = {
  text: string;
  reasoning: ReasoningTrace;
};

type WorkItem = {
  title: string;
  owner: string;
  status: string;
  reasoning: ReasoningTrace;
};

type GoalNode = {
  id: string;
  level: string;
  title: string;
  owner: string;
  status: string;
  parent?: string;
  interpretation: ReasonedItem;
  target: ReasonedItem;
  assumptions: ReasonedItem[];
  constraints: ReasonedItem[];
  successCriteria: ReasonedItem[];
  reasoning: ReasoningTrace;
  children: WorkItem[];
  actions: WorkItem[];
};

/* ── Mock 数据 ── */

const goalNodes: GoalNode[] = [
  {
    id: "future-work",
    level: "L0",
    title: "设计未来办公系统",
    owner: "产品负责人",
    status: "进行中",
    interpretation: {
      text: "做一个以目标节点为中心的工作系统，让人和 Agent 围绕同一个目标持续推理、拆解、执行和复盘。",
      reasoning: {
        input: [
          {
            text: "用户原始意图：构建人和 Agent 共同协作的新办公模式",
            chain: [
              { text: "当前办公以文档为中心" },
              { text: "文档无法被 Agent 直接执行和推理" },
              { text: "→ 办公系统应以可推理对象为中心" },
            ],
          },
          {
            text: "当前办公工具断裂：聊天不可追踪，文档不可执行，任务缺少决策上下文",
            chain: [
              { text: "聊天承载讨论，但状态不可追踪" },
              { text: "文档承载说明，但不可执行" },
              { text: "项目管理承载任务，但缺少决策上下文" },
              { text: "→ 三个工具各管一段，链路断裂" },
            ],
          },
          { text: "Agent 需要结构化对象才能可靠协作，而不是自然语言聊天" },
        ],
        logic: [
          {
            text: "如果工作载体是目标节点而不是文档，每个工作都能向上追溯来源、向下拆解行动",
            chain: [
              { text: "文档是线性、扁平的" },
              { text: "目标节点是结构化、有向的" },
              { text: "→ 目标节点天然支持追溯和拆解" },
            ],
          },
          { text: "如果人和 Agent 围绕同一个目标节点工作，协作边界清晰，各司其职" },
          {
            text: "如果推理过程被结构化记录，复盘时校准的是推理链本身，而不是重新翻聊天记录",
            chain: [
              { text: "传统复盘：翻聊天记录、找文档、问人" },
              { text: "结构化推理：x → f(x) → y 一目了然" },
              { text: "→ 复盘效率大幅提升，而且可追溯" },
            ],
          },
        ],
        output: [
          { text: "产品核心对象是 Goal Node，不是文档" },
          { text: "首页是目标节点工作台，不是空白文档或聊天窗口" },
          { text: "每次推理记录 x、f(x)、y，支持 review 和 redo" },
        ],
        redoImpact: ["整个目标节点的定义会重新讨论。", "所有下级目标节点和行动都可能被重新拆解。"],
      },
    },
    target: {
      text: "4 周内完成可在线预览的核心原型，验证目标节点、结构化推理和人机协作闭环。",
      reasoning: {
        input: [
          { text: "当前阶段是 MVP 验证，不是正式产品上线" },
          { text: "核心需要验证的是目标节点模型是否成立、推理交互是否可用、人和 Agent 协作是否顺畅" },
          { text: "团队资源有限，不能同时做完整企业功能" },
        ],
        logic: [
          { text: "如果 4 周能做出在线原型，团队就能快速收集反馈并迭代" },
          { text: "如果原型只验证核心闭环，就不会被次要功能拖慢" },
          { text: "目标是验证假设，不是交付完整产品" },
        ],
        output: [
          { text: "4 周时间窗口" },
          { text: "交付物：可在线预览的核心原型" },
          { text: "验证范围：目标节点、结构化推理、人机协作闭环" },
        ],
        redoImpact: ["时间窗口和交付范围的调整会影响所有子目标的排期。"],
      },
    },
    assumptions: [
      {
        text: "目标节点比文档更适合承载连续工作上下文。",
        reasoning: {
          input: [
            { text: "文档是线性阅读的，不适合多分支、多层级的工作追踪" },
            { text: "项目管理和聊天工具只记录状态，不记录推理过程" },
            { text: "Agent 需要结构化的输入，自然语言文档过于模糊" },
          ],
          logic: [
            { text: "如果工作上下文是结构化的目标节点，Agent 可以直接读取和更新" },
            { text: "如果工作链路是图谱而不是文档树，上下游关系、依赖和影响都是显式的" },
            { text: "目标节点天然支持层级拆解，比文档的章节结构更适合工作分解" },
          ],
          output: [{ text: "产品核心载体是 Goal Node 图谱，不是文档" }],
          redoImpact: ["如果这个假设被推翻，产品可能需要在文档和 Goal Node 之间做混合模型。"],
        },
      },
      {
        text: "用户需要先看懂工作从哪里来，再决定下一步做什么。",
        reasoning: {
          input: [
            { text: "当前组织工作中，人们经常不知道手头任务的来源和目标" },
            { text: "决策者需要看到全貌才能判断优先级和资源分配" },
            { text: "Review 时如果只看结果不看推理过程，很难判断问题出在哪里" },
          ],
          logic: [
            { text: "如果用户能向上追溯，就能理解当前工作的上下文和优先级" },
            { text: "如果用户能看到推理过程，就能判断推理是否合理" },
            { text: "目标链路的可见性是 review 和 redo 的前提" },
          ],
          output: [
            { text: "每个目标节点都必须展示上游来源和推理依据" },
            { text: "首页设计应该从目标链路开始，而不是从任务列表开始" },
          ],
          redoImpact: ["如果这个假设有偏差，首页信息架构可能需要重新设计。"],
        },
      },
    ],
    constraints: [
      {
        text: "只展示当前用户有权限看到的上游和知识。",
        reasoning: {
          input: [
            { text: "企业工作有层级和部门边界，不是所有信息都对所有人可见" },
            { text: "CEO 的战略讨论和一线员工的执行细节不在同一个权限范围内" },
            { text: "权限控制是办公系统的底线要求" },
          ],
          logic: [
            { text: "如果用户看到无权限的内容，会产生信息安全风险" },
            { text: "如果无权限上游完全不可见，用户需要明确的边界提示" },
            { text: "权限边界应该是一道清晰的'墙'，用户知道墙外有内容但不可访问" },
          ],
          output: [
            { text: "向上追溯时，无权限上游只显示'权限边界'" },
            { text: "下游拆解和行动只展示当前用户可见的部分" },
          ],
          redoImpact: ["权限模型变更会影响所有页面的可见内容范围。"],
        },
      },
      {
        text: "MVP 不做完整企业 IM 和项目管理替代。",
        reasoning: {
          input: [
            { text: "MVP 目标是验证目标节点和推理模型，不是替代现有工具" },
            { text: "企业 IM 和项目管理是成熟品类，直接替代难度大且没必要" },
            { text: "MVP 应该聚焦差异化价值：推理驱动的目标拆解和 review" },
          ],
          logic: [
            { text: "如果 MVP 试图替代 IM 和项目管理，会分散资源且用户迁移成本高" },
            { text: "如果 MVP 只做目标节点和推理，可以和现有工具互补" },
            { text: "差异化价值更容易被用户感知和记住" },
          ],
          output: [
            { text: "MVP 不包含聊天、日历、看板等传统协作功能" },
            { text: "MVP 聚焦：目标节点定义、推理、拆解、review" },
          ],
          redoImpact: ["如果后期需要集成 IM 或项目管理，架构需要支持外部工具对接。"],
        },
      },
    ],
    successCriteria: [
      {
        text: "任意工作都能追溯到上级目标。",
        reasoning: {
          input: [
            { text: "核心假设：企业工作是一条不可断裂的推理链路" },
            { text: "如果某个工作找不到来源，说明它可能是拍脑袋产生的" },
            { text: "追溯性是 review 和 redo 的基础" },
          ],
          logic: [
            { text: "如果每个 Goal Node 都有 parent 引用，追溯就是自动的" },
            { text: "如果行动挂在 Goal Node 下，行动的来源就是它所属的 Goal Node" },
            { text: "如果追溯中断，说明数据模型或工作流有缺陷" },
          ],
          output: [
            { text: "所有 Goal Node 必须有 parent 或明确的来源引用" },
            { text: "所有 Action 必须挂在某个 Goal Node 下" },
          ],
          redoImpact: ["这个标准不可妥协，如果达不到说明产品核心模型有问题。"],
        },
      },
      {
        text: "每次关键推理都有输入、逻辑和产物。",
        reasoning: {
          input: [
            { text: "产品原则：推理办公的核心是记录每次 f(x)" },
            { text: "如果只有结论没有推理过程，review 时无法判断结论是否合理" },
            { text: "Agent 的推理过程需要被人类审计" },
          ],
          logic: [
            { text: "如果推理过程被结构化记录，人和 Agent 的工作都可以被 review" },
            { text: "如果没有推理记录，redo 就没有依据" },
            { text: "结构化推理也是 Agent 间协作的基础" },
          ],
          output: [
            { text: "每个推理步骤都有 x、f(x)、y 三段结构" },
            { text: "每个推理步骤都可以被 review 和 redo" },
          ],
          redoImpact: ["如果推理记录不完整，review 和 redo 功能就不可用。"],
        },
      },
      {
        text: "下游阻塞能回流上游 review。",
        reasoning: {
          input: [
            { text: "工作链路不能断：下游失败应该影响上游决策" },
            { text: "如果下游阻塞被忽略，上游目标可能基于错误假设继续推进" },
            { text: "反馈闭环是推理驱动工作的关键特征" },
          ],
          logic: [
            { text: "如果下游异常能自动回流到上游，决策者就能及时调整" },
            { text: "如果回流机制缺失，工作链路就会断裂" },
            { text: "review 回流是这个产品和传统项目管理的关键区别" },
          ],
          output: [
            { text: "下游异常自动生成 review 记录" },
            { text: "上游目标节点显示待 review 状态" },
            { text: "redo 时会展示受影响的下游范围" },
          ],
          redoImpact: ["回流机制的设计会影响整个产品的工作流和通知系统。"],
        },
      },
    ],
    reasoning: {
      input: [
        {
          text: "用户希望未来办公系统不是文档中心",
          chain: [
            { text: "当前办公以文档为中心" },
            { text: "文档无法被 Agent 直接执行" },
            { text: "→ 办公系统应以可推理对象为中心" },
          ],
        },
        {
          text: "当前组织工作经常丢失来源和推理过程",
          chain: [
            { text: "决策在文档/会议里，执行在项目管理工具里" },
            { text: "两个系统不互通，上下文断裂" },
            { text: "→ 工作找不到来源，推理过程丢失" },
          ],
        },
        { text: "Agent 需要结构化对象才能可靠协作" },
      ],
      logic: [
        { text: "把所有工作统一为 Goal Node，避免 Goal / SubGoal / WorkUnit 概念分裂" },
        { text: "每个 Goal Node 内置目标定义、假设约束、推理、行动、证据和 review" },
        { text: "通过向下拆解和向上反馈保证工作链不断" },
      ],
      output: [
        { text: "确认产品核心对象：Goal Node" },
        { text: "首页改为目标节点工作台" },
        { text: "每个格子都有推理过程，支持 review 和 redo" },
      ],
      redoImpact: ["整体目标定义变更会影响所有下级目标、行动和推理记录。"],
    },
    children: [
      {
        title: "定义目标节点模型",
        owner: "产品负责人",
        status: "进行中",
        reasoning: {
          input: [
            { text: "用户反馈 Goal / SubGoal / WorkUnit 是一个东西" },
            { text: "多个概念导致用户理解混乱" },
            { text: "需要先明确核心对象才能设计其他功能" },
          ],
          logic: [
            { text: "如果核心对象不统一，后续所有交互都会建立在混乱的概念之上" },
            { text: "如果 Goal Node 是唯一核心对象，所有拆解、执行、review 都围绕它展开" },
            { text: "先定义清楚模型，再设计交互，这是正确的产品开发顺序" },
          ],
          output: [
            { text: "Goal Node 作为唯一核心对象" },
            { text: "SubGoal = Child Goal Node，不是新类型" },
            { text: "Task 降级为 Goal Node 内部 Action" },
          ],
          redoImpact: ["如果 Goal Node 模型变更，所有页面和交互都需要重新设计。"],
        },
      },
      {
        title: "设计结构化推理体验",
        owner: "交互负责人",
        status: "待确认",
        reasoning: {
          input: [
            { text: "用户反馈界面太乱、像说明书" },
            { text: "当前推理展示是整体性的，没有下沉到每个格子" },
            { text: "推理是产品的核心差异化" },
          ],
          logic: [
            { text: "如果每个格子都能看到推理过程，用户就能理解工作不是凭空产生的" },
            { text: "如果推理过程可 review 和 redo，用户就能参与决策" },
            { text: "推理体验的设计直接影响用户对产品的第一印象" },
          ],
          output: [
            { text: "每个目标节点内的格子都有推理入口" },
            { text: "点击任意格子可展开推理 x/f(x)/y" },
            { text: "Review 和 Redo 挂在每个推理上" },
          ],
          redoImpact: ["推理交互的变更会影响所有页面的信息架构。"],
        },
      },
      {
        title: "打通执行与证据回流",
        owner: "Agent 编排",
        status: "待拆解",
        reasoning: {
          input: [
            { text: "推理产生行动，行动需要执行，执行需要证据" },
            { text: "如果执行结果不回流传给推理，推理就无法校准" },
            { text: "证据回流是推理闭环的关键环节" },
          ],
          logic: [
            { text: "如果行动执行后证据自动回填到 Goal Node，推理就有了反馈" },
            { text: "如果证据不足或异常，系统应该触发 review" },
            { text: "执行和推理的闭环是 WorkGraph 区别于传统项目管理的关键" },
          ],
          output: [
            { text: "Action 执行后自动回填证据到所属 Goal Node" },
            { text: "异常自动触发 review 回流" },
            { text: "证据链可追溯，支持验收判断" },
          ],
          redoImpact: ["执行和证据回流的架构会影响整个 Agent 调度和通知系统。"],
        },
      },
    ],
    actions: [
      {
        title: "确认 Goal Node 字段是否足够",
        owner: "产品负责人",
        status: "待决策",
        reasoning: {
          input: [
            { text: "当前 Goal Node 包含 interpretation、target、assumptions、constraints、successCriteria、reasoning、children、actions" },
            { text: "需要确认这些字段是否覆盖了目标节点的所有必要信息" },
            { text: "字段太多会增加复杂度，太少会丢失关键信息" },
          ],
          logic: [
            { text: "如果字段不够，后续拆解时可能缺少必要的上下文" },
            { text: "如果字段太多，用户创建目标节点的成本会很高" },
            { text: "需要在实际使用中验证字段的充分性和必要性" },
          ],
          output: [
            { text: "请产品负责人确认当前字段列表" },
            { text: "如有缺失，补充字段定义" },
            { text: "如有冗余，标记为可选或移除" },
          ],
          redoImpact: ["字段变更会影响所有 Goal Node 的数据结构和页面展示。"],
        },
      },
      {
        title: "每个格子补充推理过程",
        owner: "交互负责人",
        status: "进行中",
        reasoning: {
          input: [
            { text: "用户要求每个格子都有推理过程" },
            { text: "当前只有 Goal Node 级别的推理，没有下沉" },
            { text: "推理是产品核心价值，需要渗透到每个细节" },
          ],
          logic: [
            { text: "如果每个格子都有推理，用户就能理解为什么这个子目标存在" },
            { text: "如果每个推理都可以 review，review 就能精准定位问题步骤" },
            { text: "如果每个推理都可以 redo，redo 的影响范围就是可计算的" },
          ],
          output: [
            { text: "每个假设、约束、成功标准、子目标、行动都附带推理过程" },
            { text: "点击任意格子可展开推理 x/f(x)/y" },
            { text: "每个推理都有 Review 和 Redo 按钮" },
          ],
          redoImpact: ["如果某个推理被 redo，该推理产出的格子内容会变化，所有依赖它的下游格子需要重新评估。"],
        },
      },
    ],
  },
  {
    id: "node-model",
    level: "L1",
    title: "定义目标节点模型",
    owner: "产品负责人",
    status: "进行中",
    parent: "设计未来办公系统",
    interpretation: {
      text: "把 Goal、SubGoal、WorkUnit 收敛为同一个目标节点对象，并定义它在产品里的字段和操作。",
      reasoning: {
        input: [
          { text: "用户明确说 Goal / SubGoal / WorkUnit 是一个东西" },
          { text: "旧界面有三个概念并行出现，导致用户困惑" },
          { text: "产品需要简洁清晰的核心概念" },
        ],
        logic: [
          { text: "如果核心对象只有一个，用户的学习成本最低" },
          { text: "如果 SubGoal 只是 Goal Node 的 child，概念上就不需要新名词" },
          { text: "如果 WorkUnit 只是 Goal Node 在不同层级的表现，统一命名更清晰" },
        ],
        output: [
          { text: "Goal Node 是唯一核心对象" },
          { text: "上级视角叫 Child Goal Node，负责人视角叫 My Goal，系统视角叫 Goal Node" },
        ],
        redoImpact: ["如果核心对象模型变更，整个产品需要重新定义。"],
      },
    },
    target: {
      text: "让用户一眼理解：所有工作都是 Goal Node，只是层级、负责人和上下游关系不同。",
      reasoning: {
        input: [
          { text: "用户三次重复'Goal / SubGoal / WorkUnit 是一个东西'，说明概念混淆是核心痛点" },
          { text: "产品需要让用户在 10 秒内理解核心概念" },
          { text: "如果概念不清，用户不会继续使用" },
        ],
        logic: [
          { text: "如果用户看到页面只出现一个核心对象，就不会产生概念混淆" },
          { text: "如果层级关系用视觉层次表达，而不是用不同名词，理解成本更低" },
          { text: "目标不是在文档里讲清楚概念，而是在界面上让用户直接感知" },
        ],
        output: [
          { text: "页面中只出现 Goal Node 一种核心对象" },
          { text: "层级关系通过视觉层次表达，不引入新名词" },
          { text: "用户不需要读文档就能理解产品在做什么" },
        ],
        redoImpact: ["目标调整会影响所有页面的信息架构和文案。"],
      },
    },
    assumptions: [
      {
        text: "减少概念数量会降低理解成本。",
        reasoning: {
          input: [
            { text: "认知心理学：人类工作记忆有限，概念越多越难理解" },
            { text: "现有产品（Notion、Asana、Jira）都有多个核心概念，学习曲线陡峭" },
            { text: "WorkGraph 是新产品，用户没有先验知识" },
          ],
          logic: [
            { text: "如果只有一个核心概念，用户只需要理解一件事" },
            { text: "如果多个概念可以用一个概念的不同状态表达，就不需要引入新概念" },
            { text: "降低理解成本是新产品获客的关键" },
          ],
          output: [{ text: "核心概念只有一个：Goal Node" }],
          redoImpact: ["如果这个假设不成立，可能需要重新引入 SubGoal 或 WorkUnit 等概念。"],
        },
      },
      {
        text: "目标节点可以承载从决策到执行的完整上下文。",
        reasoning: {
          input: [
            { text: "传统工具中，决策在文档/会议里，执行在项目管理工具里，上下文断裂" },
            { text: "Goal Node 的设计目标就是承载完整工作上下文" },
            { text: "如果 Goal Node 不能承载完整上下文，用户就需要在多个工具间切换" },
          ],
          logic: [
            { text: "如果 Goal Node 包含目标定义、推理、行动、证据，它就是一个完整的工作单元" },
            { text: "如果 Goal Node 可以递归拆解，大目标和小工作都在同一个体系中" },
            { text: "完整上下文意味着 review 时不需要翻找其他工具的信息" },
          ],
          output: [{ text: "Goal Node 包含：目标解释、目标值、假设、约束、成功标准、推理、子目标、行动、证据" }],
          redoImpact: ["如果发现缺少关键字段，需要扩展 Goal Node 的数据模型。"],
        },
      },
    ],
    constraints: [
      {
        text: "不能让首页变成产品说明书。",
        reasoning: {
          input: [
            { text: "用户反馈首页 Concept Map 和说明面板像产品说明书" },
            { text: "产品说明书是给潜在用户看的，真实产品是给当前用户用的" },
            { text: "真实产品应该让用户直接工作，而不是先学习概念" },
          ],
          logic: [
            { text: "如果首页是概念说明，用户会觉得这不是一个可以用的产品" },
            { text: "如果首页是真实工作台，用户可以直接开始工作" },
            { text: "产品说明书可以放在帮助文档里，不应该占用首页空间" },
          ],
          output: [
            { text: "首页是目标节点工作台，不是概念图" },
            { text: "不展示'什么是 Goal Node'等说明卡片" },
            { text: "概念通过交互传递，不通过文字说明传递" },
          ],
          redoImpact: ["如果产品太抽象用户无法理解，可能需要在首页加轻度引导。"],
        },
      },
      {
        text: "不能把 Task 设计成与 Goal Node 平级的核心对象。",
        reasoning: {
          input: [
            { text: "传统项目管理中，Task 是核心对象，Goal/Epic 是上层概念" },
            { text: "WorkGraph 的核心是推理和拆解，Task 只是执行单元" },
            { text: "如果 Task 和 Goal Node 平级，概念数量又会增加" },
          ],
          logic: [
            { text: "如果 Task 是 Goal Node 内部的 Action，它就不会独立于目标存在" },
            { text: "如果 Action 需要独立负责人和继续拆解，它可以升格为新的 Goal Node" },
            { text: "这样可以保持核心对象只有一个，同时不丢失灵活性" },
          ],
          output: [
            { text: "Action 是 Goal Node 的内部字段，不是独立核心对象" },
            { text: "Action 可以升格为 Goal Node" },
          ],
          redoImpact: ["如果发现 Action 需要更强的独立性，可能需要重新设计 Action 模型。"],
        },
      },
    ],
    successCriteria: [
      {
        text: "页面只出现一个核心对象。",
        reasoning: {
          input: [
            { text: "核心设计目标：让用户一眼理解所有工作都是 Goal Node" },
            { text: "如果页面出现多个核心对象名词，说明设计没有达到目标" },
            { text: "这是判断产品是否简洁的核心标准" },
          ],
          logic: [
            { text: "如果页面只出现 Goal Node，用户就不会混淆" },
            { text: "如果出现 SubGoal 或 WorkUnit，说明概念收敛没有完成" },
            { text: "这个标准是一票否决的" },
          ],
          output: [{ text: "所有页面文案只使用 Goal Node 和 Child Goal Node" }],
          redoImpact: ["不达标意味着产品概念模型需要重新设计。"],
        },
      },
      {
        text: "下级目标仍能继续递归拆解。",
        reasoning: {
          input: [
            { text: "Goal Node 模型的核心能力是递归拆解" },
            { text: "如果统一模型后丢失了递归能力，说明模型有缺陷" },
            { text: "递归拆解是工作链路不断的前提" },
          ],
          logic: [
            { text: "如果 Child Goal Node 本身也是一个 Goal Node，它就可以继续拆解" },
            { text: "如果不支持递归，拆解链就断了，违背产品原则" },
            { text: "递归是模型自洽性的证明" },
          ],
          output: [
            { text: "每个 Goal Node 都可以有 children" },
            { text: "每个 Child Goal Node 也可以有自己的 children" },
          ],
          redoImpact: ["如果递归拆解有限制，需要明确限制条件并告知用户。"],
        },
      },
    ],
    reasoning: {
      input: [
        { text: "用户反馈 Goal / SubGoal / WorkUnit 是一个东西" },
        { text: "旧界面 Concept Map 像说明书" },
        { text: "需要更像真实产品" },
      ],
      logic: [
        { text: "把 SubGoal 改成 Child Goal Node" },
        { text: "把 WorkUnit 从核心概念中移除" },
        { text: "把 Task 降级为 Goal Node 内部 Action" },
      ],
      output: [
        { text: "核心对象统一为 Goal Node" },
        { text: "首页改成目标节点工作台" },
        { text: "概念图改为真实工作详情" },
      ],
      redoImpact: ["核心模型变更影响所有页面、数据结构和文档。"],
    },
    children: [
      {
        title: "定义 Goal Node 字段",
        owner: "产品负责人",
        status: "已确认",
        reasoning: {
          input: [
            { text: "需要明确 Goal Node 包含哪些字段" },
            { text: "字段设计影响数据模型、页面展示和交互" },
            { text: "字段太少信息不完整，太多创建成本高" },
          ],
          logic: [
            { text: "解释、目标值、假设、约束、成功标准是目标定义的必要信息" },
            { text: "推理记录是产品核心差异化，必须包含" },
            { text: "子目标和行动是拆解和执行的基本单元" },
          ],
          output: [{ text: "Goal Node 字段：interpretation、target、assumptions、constraints、successCriteria、reasoning、children、actions" }],
          redoImpact: ["字段变更影响所有数据结构和页面。"],
        },
      },
      {
        title: "定义 Goal Node 关系",
        owner: "架构 Agent",
        status: "进行中",
        reasoning: {
          input: [
            { text: "Goal Node 之间需要有关系来表达拆解、反馈、依赖" },
            { text: "关系类型决定了图谱的丰富度和可用性" },
            { text: "关系设计影响权限、通知和 review 回流" },
          ],
          logic: [
            { text: "decomposes_to 表达向下拆解" },
            { text: "feedback_to 表达向上回流" },
            { text: "reviews 表达 review 关系" },
            { text: "depends_on 表达依赖关系" },
          ],
          output: [{ text: "四种关系类型：decomposes_to、feedback_to、reviews、depends_on" }],
          redoImpact: ["关系类型变更影响图谱可视化和通知系统。"],
        },
      },
      {
        title: "Review / Redo 规则",
        owner: "复盘 Agent",
        status: "待确认",
        reasoning: {
          input: [
            { text: "Review 和 Redo 是推理驱动工作的核心操作" },
            { text: "需要明确什么时候触发 review、redo 影响什么范围" },
            { text: "规则不清会导致 review 机制不可用" },
          ],
          logic: [
            { text: "如果下游异常，自动触发上游 review" },
            { text: "如果推理被 redo，所有依赖该推理产出的格子都需要重新评估" },
            { text: "Redo 前必须展示影响范围，避免意外连锁反应" },
          ],
          output: [
            { text: "Review 触发条件：下游阻塞、证据不足、假设失效" },
            { text: "Redo 影响范围：所有依赖该推理产出的 Goal Node 和 Action" },
          ],
          redoImpact: ["Review/Redo 规则变更影响整个工作流引擎。"],
        },
      },
    ],
    actions: [
      {
        title: "更新 PRD 术语",
        owner: "产品负责人",
        status: "进行中",
        reasoning: {
          input: [
            { text: "PRD 中还有大量 SubGoal、WorkUnit、小目标等旧术语" },
            { text: "术语不一致会导致团队沟通混乱" },
            { text: "PRD 是团队的主要参考文档" },
          ],
          logic: [
            { text: "如果 PRD 术语不统一，工程师和设计师会基于旧术语做实现" },
            { text: "术语统一应该从文档开始，再到代码" },
            { text: "PRD 更新后，其他文档也应同步" },
          ],
          output: [
            { text: "PRD 中所有 SubGoal → Child Goal Node" },
            { text: "PRD 中所有 WorkUnit → Goal Node" },
            { text: "PRD 中所有 小目标 → 子目标节点" },
          ],
          redoImpact: ["术语变更影响所有文档和代码中的文案。"],
        },
      },
      {
        title: "同步前端文案",
        owner: "工程 Agent",
        status: "进行中",
        reasoning: {
          input: [
            { text: "前端代码中还有旧术语" },
            { text: "用户看到的是前端界面，不是文档" },
            { text: "前端文案是用户对产品的第一印象" },
          ],
          logic: [
            { text: "如果前端文案和 PRD 不一致，用户会困惑" },
            { text: "如果旧术语出现在界面上，概念收敛就没有完成" },
            { text: "前端文案应该和 PRD 保持同步" },
          ],
          output: [{ text: "前端所有文案统一为 Goal Node 和 Child Goal Node" }],
          redoImpact: ["文案变更影响所有页面组件。"],
        },
      },
    ],
  },
  {
    id: "reasoning-ui",
    level: "L1",
    title: "设计结构化推理体验",
    owner: "交互负责人",
    status: "待确认",
    parent: "设计未来办公系统",
    interpretation: {
      text: "把一次推理拆成可读、可 review、可 redo 的结构化过程，并且下沉到每个格子。",
      reasoning: {
        input: [
          { text: "用户要求每个格子都有推理交互" },
          { text: "用户反馈旧界面太乱、像说明书" },
          { text: "推理是产品核心差异化，交互质量决定用户是否理解产品价值" },
        ],
        logic: [
          { text: "如果每个格子都有推理入口，用户就能理解任何工作都不是凭空产生的" },
          { text: "如果推理过程是 x/f(x)/y 三段式，用户就能快速理解推理结构" },
          { text: "如果推理支持 review 和 redo，用户就能参与决策校准" },
        ],
        output: [
          { text: "每个格子都有推理过程" },
          { text: "点击展开推理，x/f(x)/y 三段展示" },
          { text: "Review 和 Redo 挂在每个推理上" },
        ],
        redoImpact: ["推理交互设计变更影响所有页面。"],
      },
    },
    target: {
      text: "用户能在 10 秒内看懂任意一个推理的输入、逻辑和产物。",
      reasoning: {
        input: [
          { text: "办公场景下用户注意力有限，需要快速理解" },
          { text: "如果推理展示过于复杂，用户会跳过不看" },
          { text: "推理价值在于让用户快速判断推理是否合理" },
        ],
        logic: [
          { text: "如果三段式结构清晰，用户扫一眼就能理解" },
          { text: "如果每段只有 2-3 条关键信息，不会信息过载" },
          { text: "10 秒是判断'是否合理'的合理时间窗口" },
        ],
        output: [
          { text: "x/f(x)/y 三段式展示" },
          { text: "每段不超过 3 条关键信息" },
          { text: "推理面板默认折叠，点击展开" },
        ],
        redoImpact: ["目标调整会影响推理展示的设计细节。"],
      },
    },
    assumptions: [
      {
        text: "三段式结构（x/f(x)/y）比散点图或聊天更易理解。",
        reasoning: {
          input: [
            { text: "散点图适合展示关系，不适合展示推理过程" },
            { text: "聊天适合对话，不适合结构化推理" },
            { text: "三段式结构映射了推理的基本逻辑：输入→处理→输出" },
          ],
          logic: [
            { text: "如果用户看到 x，就知道推理基于什么信息" },
            { text: "如果用户看到 f(x)，就知道推理是怎么做的" },
            { text: "如果用户看到 y，就知道推理产出了什么" },
            { text: "三段式结构是推理的自然表达" },
          ],
          output: [{ text: "推理展示统一使用 x/f(x)/y 三段式" }],
          redoImpact: ["如果用户觉得三段式不够直观，可能需要探索其他展示形式。"],
        },
      },
      {
        text: "用户需要看到人和 Agent 各自做了什么。",
        reasoning: {
          input: [
            { text: "人机协作是产品核心定位" },
            { text: "如果用户不知道哪些是 Agent 做的、哪些是人做的，就无法建立信任" },
            { text: "透明性是人机协作的基础" },
          ],
          logic: [
            { text: "如果推理过程中标注了责任主体，用户就能判断 Agent 的推理是否可靠" },
            { text: "如果用户看到 Agent 的推理有问题，可以 redo 并要求人工介入" },
            { text: "责任主体标注也是合规和审计的要求" },
          ],
          output: [
            { text: "每个推理步骤标注责任主体（人或 Agent）" },
            { text: "推理输入中标注信息来源（人提供 / Agent 采集）" },
          ],
          redoImpact: ["责任主体标注的设计会影响推理面板的信息密度。"],
        },
      },
    ],
    constraints: [
      {
        text: "不要在首屏堆太多概念卡。",
        reasoning: {
          input: [
            { text: "用户反馈旧界面 Concept Map 和说明面板太乱" },
            { text: "首屏应该让用户直接工作，而不是先学习" },
            { text: "信息密度太高会导致认知过载" },
          ],
          logic: [
            { text: "如果首屏只有当前目标节点的工作界面，用户就能立即开始工作" },
            { text: "如果推理默认折叠，用户不会被打扰" },
            { text: "概念通过交互传递，不通过卡片堆叠传递" },
          ],
          output: [
            { text: "首屏只展示当前 Goal Node 的工作界面" },
            { text: "推理默认折叠，点击展开" },
            { text: "不展示概念说明卡片" },
          ],
          redoImpact: ["如果用户需要更多引导，可能需要在首屏增加轻度提示。"],
        },
      },
      {
        text: "Redo 必须显示影响范围。",
        reasoning: {
          input: [
            { text: "用户要求：redo 后所有下游都可能发生变化" },
            { text: "如果用户不知道 redo 会影响什么，就不敢点 redo" },
            { text: "影响范围展示是 redo 功能可信赖的前提" },
          ],
          logic: [
            { text: "如果 redo 前展示影响范围，用户就能做出知情决策" },
            { text: "如果影响范围太大，用户可以选择局部 redo 或分批 redo" },
            { text: "影响范围展示也是 redo 后自动通知下游的基础" },
          ],
          output: [
            { text: "Redo 前展示影响范围列表" },
            { text: "影响范围包括：依赖该推理产出的所有 Goal Node 和 Action" },
          ],
          redoImpact: ["影响范围计算逻辑需要和推理依赖图联动。"],
        },
      },
    ],
    successCriteria: [
      {
        text: "每次推理都有 x、f(x)、y。",
        reasoning: {
          input: [
            { text: "产品原则：推理办公的核心是记录每次 f(x)" },
            { text: "如果推理记录不完整，review 就无法进行" },
            { text: "三段式结构是推理完整性的最低标准" },
          ],
          logic: [
            { text: "如果推理缺 x，review 时不知道推理基于什么信息" },
            { text: "如果推理缺 f(x)，review 时不知道推理是怎么做的" },
            { text: "如果推理缺 y，review 时不知道推理产出了什么" },
          ],
          output: [{ text: "每个推理步骤强制包含 x、f(x)、y" }],
          redoImpact: ["不达标意味着推理记录机制需要重新设计。"],
        },
      },
    ],
    reasoning: {
      input: [
        { text: "用户反馈太乱" },
        { text: "旧页面同时出现概念图、阶梯、右侧解释面板" },
        { text: "真实产品应服务当前工作" },
      ],
      logic: [
        { text: "保留目标节点详情作为主视图" },
        { text: "把推理过程下沉到每个格子" },
        { text: "把右侧收敛为卡片内处理" },
      ],
      output: [
        { text: "主区变成目标节点工作台" },
        { text: "每个格子都有推理入口" },
        { text: "推理在格子内展开，不单独占一个区域" },
      ],
      redoImpact: ["推理交互设计变更影响所有页面。"],
    },
    children: [
      {
        title: "推理输入设计",
        owner: "交互负责人",
        status: "已设计",
        reasoning: {
          input: [
            { text: "推理输入 x 需要展示推理基于什么信息" },
            { text: "输入信息可能来自人、Agent 或系统" },
            { text: "输入需要在 review 时被审视" },
          ],
          logic: [
            { text: "如果输入来源明确，用户就能判断输入是否可信" },
            { text: "如果输入不完整，推理就不可靠" },
            { text: "输入设计要考虑信息的可追溯性" },
          ],
          output: [{ text: "x 区域展示信息来源列表，每条标注来源（人/Agent/系统）" }],
          redoImpact: ["输入设计变更会影响推理面板的布局。"],
        },
      },
      {
        title: "推理逻辑设计",
        owner: "Agent",
        status: "进行中",
        reasoning: {
          input: [
            { text: "推理逻辑 f(x) 需要展示推理步骤" },
            { text: "逻辑步骤需要可读、可审计" },
            { text: "逻辑是 review 的核心对象" },
          ],
          logic: [
            { text: "如果逻辑步骤清晰，review 时就能精准定位问题步骤" },
            { text: "如果逻辑步骤可单独 redo，就能局部修正" },
            { text: "逻辑步骤应该像代码 diff 一样可审视" },
          ],
          output: [{ text: "f(x) 区域展示推理步骤列表，每步可独立 review" }],
          redoImpact: ["逻辑设计变更会影响推理面板的交互复杂度。"],
        },
      },
      {
        title: "推理产物设计",
        owner: "产品负责人",
        status: "待确认",
        reasoning: {
          input: [
            { text: "推理产物 y 是推理的结论" },
            { text: "产物可能是新的子目标、行动、假设或约束" },
            { text: "产物是连接推理和工作的桥梁" },
          ],
          logic: [
            { text: "如果产物是结构化的，就能被系统直接使用" },
            { text: "如果产物是模糊的自然语言，就需要人工二次处理" },
            { text: "产物应该直接映射到 Goal Node 的字段" },
          ],
          output: [{ text: "y 区域展示结构化产物列表，每个产物可操作（确认/修改/拒绝）" }],
          redoImpact: ["产物设计变更会影响推理到工作的转换流程。"],
        },
      },
    ],
    actions: [
      {
        title: "确认推理卡片是否够清楚",
        owner: "产品负责人",
        status: "待决策",
        reasoning: {
          input: [
            { text: "当前推理面板使用 x/f(x)/y 三段式" },
            { text: "需要验证用户是否能快速理解推理结构" },
            { text: "如果推理面板不清楚，用户不会使用 review 功能" },
          ],
          logic: [
            { text: "如果用户能快速理解，三段式设计就是成功的" },
            { text: "如果用户需要解释，说明设计需要调整" },
            { text: "需要真实用户测试来验证" },
          ],
          output: [
            { text: "请产品负责人确认当前推理卡片设计" },
            { text: "如需要，安排用户测试" },
          ],
          redoImpact: ["如果推理卡片设计需要调整，影响所有页面的推理展示。"],
        },
      },
      {
        title: "验证用户是否能理解 redo",
        owner: "研究 Agent",
        status: "待开始",
        reasoning: {
          input: [
            { text: "Redo 是新产品概念，用户可能不熟悉" },
            { text: "Redo 的影响范围展示是用户信任的基础" },
            { text: "需要在真实场景中验证 redo 交互" },
          ],
          logic: [
            { text: "如果用户理解 redo 的含义和影响，就会使用它" },
            { text: "如果用户不理解，可能误操作导致工作丢失" },
            { text: "Redo 应该有确认步骤和撤销能力" },
          ],
          output: [
            { text: "安排用户测试 redo 交互" },
            { text: "收集反馈并优化" },
          ],
          redoImpact: ["Redo 交互设计变更会影响所有推理面板。"],
        },
      },
    ],
  },
];

/* ── 主组件 ── */

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
            <p className="mt-1 max-w-3xl text-sm text-slate-500">每个格子都是推理出来的，点击可查看逻辑链。</p>
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

/* ── 左侧目标链路 ── */

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

/* ── 右侧目标节点详情 ── */

function GoalDetail({ node }: { node: GoalNode }) {
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

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <ReasonedCell id="interpretation" label="目标解释" icon={Target} item={node.interpretation} />
          <ReasonedCell id="target" label="目标值" icon={CheckCircle2} item={node.target} />
        </div>
      </article>

      <div className="grid gap-3 lg:grid-cols-3">
        <ReasonedList id="assumptions" label="假设" icon={BrainCircuit} items={node.assumptions} />
        <ReasonedList id="constraints" label="约束" icon={ShieldCheck} items={node.constraints} />
        <ReasonedList id="successCriteria" label="成功标准" icon={CheckCircle2} items={node.successCriteria} />
      </div>

      <GoalReasoning reasoning={node.reasoning} />

      <div className="grid gap-3 lg:grid-cols-2">
        <ReasonedWorkList id="child" label="下级目标节点" items={node.children} />
        <ReasonedWorkList id="action" label="行动" items={node.actions} />
      </div>
    </div>
  );
}

/* ── 可展开推理的格子组件 ── */

function ReasonedCell({
  id,
  label,
  icon: Icon,
  item,
}: {
  id: string;
  label: string;
  icon: typeof Target;
  item: ReasonedItem;
}) {
  const [expandedId, setExpandedId] = useExpanded();
  const open = expandedId === id;

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
        onClick={() => setExpandedId(open ? null : id)}
      >
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="flex-1 text-sm font-semibold text-slate-900">{label}</h3>
        <BrainCircuit className="h-3.5 w-3.5 text-slate-300" />
      </button>
      <div className="px-3 pb-2">
        <p className="text-sm leading-6 text-slate-600">{item.text}</p>
      </div>
      {open && <ReasoningExpanded reasoning={item.reasoning} />}
    </section>
  );
}

function ReasonedList({
  id,
  label,
  icon: Icon,
  items,
}: {
  id: string;
  label: string;
  icon: typeof Target;
  items: ReasonedItem[];
}) {
  const [expandedId, setExpandedId] = useExpanded();

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <span className="text-[11px] text-slate-400">{items.length} 条</span>
      </div>
      <div>
        {items.map((item, i) => {
          const cellId = `${id}-${i}`;
          const open = expandedId === cellId;
          return (
            <div className="border-b border-slate-50 last:border-b-0" key={i}>
              <button
                className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => setExpandedId(open ? null : cellId)}
              >
                <span className="mt-0.5 text-xs font-medium text-slate-300">{i + 1}.</span>
                <span className="flex-1 text-sm leading-6 text-slate-600">{item.text}</span>
                <BrainCircuit className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
              </button>
              {open && <ReasoningExpanded reasoning={item.reasoning} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReasonedWorkList({
  id,
  label,
  items,
}: {
  id: string;
  label: string;
  items: WorkItem[];
}) {
  const [expandedId, setExpandedId] = useExpanded();

  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900">{label}</h3>
      <div>
        {items.map((item, i) => {
          const cellId = `${id}-${i}`;
          const open = expandedId === cellId;
          return (
            <div className="border-b border-slate-50 last:border-b-0" key={i}>
              <button
                className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                onClick={() => setExpandedId(open ? null : cellId)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                    <BrainCircuit className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{item.owner}</p>
                </div>
                <span
                  className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${
                    item.status.includes("待")
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </button>
              {open && (
                <div className="border-t border-slate-100">
                  <ReasoningExpanded reasoning={item.reasoning} />
                  {item.status.includes("待") && (
                    <div className="flex gap-2 border-t border-slate-100 px-3 py-2">
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                        <Check className="h-4 w-4" />
                        确认
                      </button>
                      <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <RotateCcw className="h-4 w-4" />
                        Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

/* ── 推理展开面板 ── */

function ReasoningExpanded({ reasoning }: { reasoning: ReasoningTrace }) {
  const [showRedoImpact, setShowRedoImpact] = useState(false);

  return (
    <div className="border-t border-slate-100 bg-slate-50 px-3 py-2">
      <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
        <ReasoningColumn title="输入 x" items={reasoning.input} />
        <ReasoningColumn title="逻辑 f(x)" items={reasoning.logic} />
        <ReasoningColumn title="产物 y" items={reasoning.output} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
          Review
        </button>
        <button
          className="rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          onClick={() => setShowRedoImpact(!showRedoImpact)}
        >
          Redo
        </button>
      </div>
      {showRedoImpact && reasoning.redoImpact && reasoning.redoImpact.length > 0 && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-800">Redo 影响范围</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-amber-700">重新推理后，以下内容可能发生变化：</p>
          <ul className="mt-1.5 space-y-0.5">
            {reasoning.redoImpact.map((impact, i) => (
              <li className="text-xs leading-5 text-amber-700" key={i}>
                · {impact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Goal 级别推理面板 ── */

function GoalReasoning({ reasoning }: { reasoning: ReasoningTrace }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">本次推理</h3>
          <span className="text-[11px] text-slate-400">Goal 级别</span>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Review</button>
          <button className="rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800">Redo</button>
        </div>
      </div>

      <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
        <ReasoningColumn title="输入 x" items={reasoning.input} />
        <ReasoningColumn title="逻辑 f(x)" items={reasoning.logic} />
        <ReasoningColumn title="产物 y" items={reasoning.output} />
      </div>
    </article>
  );
}

/* ── 推理列：每个节点可展开逻辑链 ── */

function ReasoningColumn({ title, items }: { title: string; items: LogicNode[] }) {
  return (
    <section className="bg-white p-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</h4>
      <div className="mt-2 space-y-2">
        {items.map((node, i) => (
          <ReasoningNode key={i} node={node} />
        ))}
      </div>
    </section>
  );
}

function ReasoningNode({ node }: { node: LogicNode }) {
  const hasChain = node.chain && node.chain.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className={`group flex w-full items-start gap-1.5 text-left ${hasChain ? "cursor-pointer" : "cursor-default"}`}
        onClick={() => hasChain && setOpen(!open)}
      >
        {hasChain && (
          <ChevronRight
            className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform ${open ? "rotate-90" : ""}`}
          />
        )}
        <span className="text-sm leading-5 text-slate-600">{node.text}</span>
      </button>
      {open && hasChain && (
        <div className="ml-4 mt-1.5">
          <LogicChainView nodes={node.chain!} />
        </div>
      )}
    </div>
  );
}

/* ── 逻辑链视图：A → B → C ── */

function LogicChainNodeView({ node, hasArrow }: { node: LogicNode; hasArrow: boolean }) {
  const hasChain = node.chain && node.chain.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-start gap-2">
        <div className="flex w-5 shrink-0 flex-col items-center pt-1">
          {hasArrow && <ArrowRight className="h-3 w-3 text-slate-300" />}
        </div>
        <div className="min-w-0 flex-1">
          <button
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-left text-xs leading-5 transition ${
              hasChain
                ? "cursor-pointer border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                : "cursor-default border-slate-200 bg-slate-50 text-slate-600"
            }`}
            onClick={() => hasChain && setOpen(!open)}
          >
            {node.text}
            {hasChain && (
              <ChevronRight
                className={`h-3 w-3 shrink-0 text-slate-300 transition-transform ${open ? "rotate-90" : ""}`}
              />
            )}
          </button>
          {open && hasChain && (
            <div className="ml-5 mt-1.5 border-l-2 border-slate-100 pl-3">
              <LogicChainView nodes={node.chain!} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogicChainView({ nodes }: { nodes: LogicNode[] }) {
  return (
    <div className="space-y-1.5">
      {nodes.map((node, i) => (
        <LogicChainNodeView key={i} node={node} hasArrow={i > 0} />
      ))}
    </div>
  );
}

/* ── 展开状态管理 ── */

function useExpanded() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return [expandedId, setExpandedId] as const;
}