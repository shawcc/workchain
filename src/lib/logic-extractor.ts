/* ── 逻辑提取引擎：自然语言 → LogicNode 树 ── */

/**
 * 逻辑节点（与 GrandWorkGraph 中的类型保持一致）
 */
export type LogicNode = {
  text: string;
  /** 关系标签，如 "→ 因为"、"⇒ 如果"、"⇏ 但是"。无标签 = 叶子节点 */
  relationLabel?: string;
  chain?: LogicNode[];
};

/**
 * 逻辑关系类型
 */
type LogicRelation =
  | "causal"       // 因果：因为 A，所以 B → A → B
  | "conditional"  // 条件：如果 A，那么 B → A ⇒ B
  | "transitional" // 转折：虽然 A，但是 B → A ⇏ B
  | "progressive"  // 递进：不仅 A，而且 B → A → A+B
  | "sequential"   // 顺序：首先 A，然后 B → A → B
  | "purpose"      // 目的：为了 A，需要 B → B → A
  | "concession"   // 让步：除非 A，否则 B → ¬A → B
  | "proportional" // 比例/约束：多少 A，多少 B → A ∝ B

/**
 * 逻辑连接词模式
 */
interface LogicPattern {
  relation: LogicRelation;
  arrow: string;       // 箭头符号
  connectorWord: string; // 中文连接词标签
  patterns: RegExp[];
}

const LOGIC_PATTERNS: LogicPattern[] = [
  /* ── 因果 ── */
  {
    relation: "causal",
    arrow: "→",
    connectorWord: "因为",
    patterns: [
      /因为(.+?)[，,]\s*所以(.+)/,
      /由于(.+?)[，,]\s*因此(.+)/,
      /由于(.+?)[，,]\s*所以(.+)/,
      /(.+?)[，,]\s*因而(.+)/,
      /(.+?)[，,]\s*因此(.+)/,
      /(.+?)[，,]\s*所以(.+)/,
      /(.+?)[，,]\s*导致(.+)/,
      /(.+?)[，,]\s*造成了(.+)/,
      // 隐性因果
      /既然(.+?)[，,]\s*就(.+)/,
      /既然(.+?)[，,]\s*那么(.+)/,
      /既然(.+?)[，,]\s*那(.+)/,
      /幸亏(.+?)[，,]\s*才(.+)/,
      /多亏(.+?)[，,]\s*才(.+)/,
      /要不是(.+?)[，,]\s*.+?就(.+)/,
    ],
  },
  /* ── 条件 ── */
  {
    relation: "conditional",
    arrow: "⇒",
    connectorWord: "如果",
    patterns: [
      /如果(.+?)[，,]\s*那么(.+)/,
      /假如(.+?)[，,]\s*就(.+)/,
      /若(.+?)[，,]\s*则(.+)/,
      /只有(.+?)[，,]\s*才(.+)/,
      /一旦(.+?)[，,]\s*就(.+)/,
      // 隐性条件
      /只要(.+?)[，,]\s*就(.+)/,
      /没有(.+?)[，,]?\s*就(.+)/,
      /(.+?)的话[，,]?\s*(.+)/,
      /凡是(.+?)[，,]\s*都(.+)/,
      /无论(.+?)[，,]\s*都(.+)/,
      /不管(.+?)[，,]\s*都(.+)/,
      /不论(.+?)[，,]\s*都(.+)/,
      /任(.+?)[，,]\s*都(.+)/,
      /万一(.+?)[，,]\s*就(.+)/,
    ],
  },
  /* ── 转折 ── */
  {
    relation: "transitional",
    arrow: "⇏",
    connectorWord: "但是",
    patterns: [
      /虽然(.+?)[，,]\s*但是(.+)/,
      /尽管(.+?)[，,]\s*可是(.+)/,
      /尽管(.+?)[，,]\s*但(.+)/,
      /(.+?)[，,]\s*然而(.+)/,
      /(.+?)[，,]\s*不过(.+)/,
      /(.+?)[，,]\s*可是(.+)/,
      /(.+?)[，,]\s*但(.+)/,
      // 隐性转折
      /即使(.+?)[，,]\s*也(.+)/,
      /即便(.+?)[，,]\s*也(.+)/,
      /就算(.+?)[，,]\s*也(.+)/,
      /不是(.+?)[，,]\s*而是(.+)/,
      /(.+?)[，,]\s*反而(.+)/,
      /(.+?)[，,]\s*反倒(.+)/,
      /与其(.+?)[，,]\s*不如(.+)/,
      /宁可(.+?)[，,]\s*也不(.+)/,
      /宁愿(.+?)[，,]\s*也不(.+)/,
      /(.+?)[，,]\s*却(.+)/,
    ],
  },
  /* ── 递进 ── */
  {
    relation: "progressive",
    arrow: "→",
    connectorWord: "并且",
    patterns: [
      /不仅(.+?)[，,]\s*而且(.+)/,
      /不但(.+?)[，,]\s*还(.+)/,
      /不只(.+?)[，,]\s*还(.+)/,
      /(.+?)[，,]\s*并且(.+)/,
      /(.+?)[，,]\s*同时(.+)/,
      /(.+?)[，,]\s*进而(.+)/,
      // 隐性递进
      /(.+?)[，,]\s*甚至(.+)/,
      /(.+?)[，,]\s*何况(.+)/,
      /(.+?)[，,]\s*况且(.+)/,
      /(.+?)[，,]\s*更何况(.+)/,
      /(.+?)[，,]\s*尤其是(.+)/,
      /(.+?)[，,]\s*特别是(.+)/,
      /越(.+?)[，,]\s*越(.+)/,
    ],
  },
  /* ── 顺序 ── */
  {
    relation: "sequential",
    arrow: "→",
    connectorWord: "然后",
    patterns: [
      /首先(.+?)[，,]\s*然后(.+)/,
      /先(.+?)[，,]\s*再(.+)/,
      /先(.+?)[，,]\s*然后(.+)/,
      /(.+?)[，,]\s*接着(.+)/,
      /(.+?)[，,]\s*之后(.+)/,
      // 隐性顺序
      /一(.+?)[，,]\s*就(.+)/,
      /(.+?)[，,]\s*便(.+)/,
    ],
  },
  /* ── 目的 ── */
  {
    relation: "purpose",
    arrow: "→",
    connectorWord: "为了",
    patterns: [
      /为了(.+?)[，,]\s*需要(.+)/,
      /为(.+?)[，,]\s*应(.+)/,
      /(.+?)[，,]\s*以免(.+)/,
      /(.+?)[，,]\s*免得(.+)/,
      /(.+?)[，,]\s*以防(.+)/,
      /(.+?)[，,]\s*省得(.+)/,
      /(.+?)[，,]\s*以便(.+)/,
      /要(.+?)[，,]\s*就要(.+)/,
      /(.+?)[，,]\s*以(.+)/,
    ],
  },
  /* ── 让步 ── */
  {
    relation: "concession",
    arrow: "⇒",
    connectorWord: "否则",
    patterns: [
      /除非(.+?)[，,]\s*否则(.+)/,
      /除非(.+?)[，,]\s*不然(.+)/,
      /(.+?)[，,]\s*否则(.+)/,
      /(.+?)[，,]\s*不然(.+)/,
    ],
  },
  /* ── 比例/约束 ── */
  {
    relation: "proportional",
    arrow: "→",
    connectorWord: "约束",
    patterns: [
      /(.+?多少)[，,]?\s*(.+?多少)/,
      /(.+?什么)[，,]?\s*(.+?什么)/,
      /(.+?怎么)[，,]?\s*(.+?怎么)/,
      /该(.+?)[，,]?\s*就(.+)/,
      /能(.+?)[，,]\s*就(.+)/,
      /(没有.+?)的[，,]?\s*(不.+)/,
    ],
  },
];

/**
 * 分句：按中文标点拆分为句子列表
 */
function splitSentences(text: string): string[] {
  // 先按句号、问号、感叹号拆分
  const raw = text.split(/[。！？\n]/).filter((s) => s.trim().length > 0);
  // 再按分号拆分（但保留分号前的部分）
  const result: string[] = [];
  for (const part of raw) {
    const subParts = part.split(/[；;]/).filter((s) => s.trim().length > 0);
    result.push(...subParts);
  }
  return result.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * 句首结论/推论词：从前文推导出的结论
 */
const SENTENCE_START_CONCLUSION = /^(?:因此|所以|因而|总之|综上所述|可见|由此可见|看来|归根到底|说到底|换句话说|也就是说|换言之|难怪|为此|于是|故|据此|基于此|基于以上|由此|综上|简言之|简而言之)[，,]?\s*(.+)/;

/**
 * 尝试匹配一条逻辑模式
 * 返回匹配结果和匹配结束位置，或 null
 */
function tryMatchPattern(text: string): { node: LogicNode; end: number } | null {
  // 先检查句首结论词
  const conclusionMatch = text.match(SENTENCE_START_CONCLUSION);
  if (conclusionMatch) {
    const conclusion = conclusionMatch[1].trim();
    return {
      node: {
        text: `→ ${conclusion}`,
        relationLabel: "→ 因此",
        chain: [{ text: conclusion }],
      },
      end: conclusionMatch[0].length,
    };
  }

  for (const pattern of LOGIC_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = regex.exec(text);
      if (match) {
        const a = match[1].trim();
        const b = match[2].trim();
        const relationLabel = `${pattern.arrow} ${pattern.connectorWord}`;

        // 递归提取 A 和 B 内部的子逻辑
        const aChain = extractLogicChain(a);
        const bChain = extractLogicChain(b);

        return {
          node: {
            text: `${a} ${pattern.arrow} ${b}`,
            relationLabel,
            chain: [...aChain, ...bChain],
          },
          end: match.index + match[0].length,
        };
      }
    }
  }
  return null;
}

/**
 * 从一段自然语言文本中提取逻辑链
 * 
 * @example
 * extractLogicChain("因为办公工具断裂，所以需要统一平台。")
 * // [
 * //   {
 * //     text: "办公工具断裂 → 需要统一平台",
 * //     chain: [
 * //       { text: "办公工具断裂" },
 * //       { text: "需要统一平台" }
 * //     ]
 * //   }
 * // ]
 */
export function extractLogicChain(text: string): LogicNode[] {
  const sentences = splitSentences(text);
  const result: LogicNode[] = [];

  for (const sentence of sentences) {
    let remaining = sentence.trim();
    while (remaining.length > 0) {
      const matched = tryMatchPattern(remaining);
      if (matched) {
        result.push(matched.node);
        // 去掉匹配结束后的内容，清理前导标点
        remaining = remaining.slice(matched.end).replace(/^[，,]\s*/, "").trim();
      } else {
        result.push({ text: remaining });
        break;
      }
    }
  }

  return result;
}

/**
 * 将一段文本解析为一条完整的逻辑链（扁平化）
 * 适合用于展示 A → B → C → D 的推导过程
 */
export function extractFlatLogicChain(text: string): LogicNode[] {
  const sentences = splitSentences(text);
  const nodes: LogicNode[] = [];

  for (const sentence of sentences) {
    // 先尝试匹配模式
    let matched = false;
    for (const pattern of LOGIC_PATTERNS) {
      for (const regex of pattern.patterns) {
        const match = sentence.match(regex);
        if (match) {
          const a = match[1].trim();
          const b = match[2].trim();
          nodes.push({ text: a });
          nodes.push({ text: b });
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    if (!matched) {
      nodes.push({ text: sentence });
    }
  }

  return nodes;
}

/**
 * 提取文本中的逻辑关系并分类
 */
export function classifyLogicRelations(text: string): Array<{
  relation: LogicRelation;
  relationLabel: string;
  nodes: LogicNode[];
}> {
  const sentences = splitSentences(text);
  const result: Array<{
    relation: LogicRelation;
    relationLabel: string;
    nodes: LogicNode[];
  }> = [];

  for (const sentence of sentences) {
    for (const pattern of LOGIC_PATTERNS) {
      for (const regex of pattern.patterns) {
        const match = sentence.match(regex);
        if (match) {
          const a = match[1].trim();
          const b = match[2].trim();
          result.push({
            relation: pattern.relation,
            relationLabel: `${pattern.arrow} ${pattern.connectorWord}`,
            nodes: [{ text: a }, { text: b }],
          });
          break;
        }
      }
    }
  }

  return result;
}