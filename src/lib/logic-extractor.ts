/* ── 逻辑提取引擎：自然语言 → LogicNode 树 ── */

/**
 * 逻辑节点（与 GrandWorkGraph 中的类型保持一致）
 */
export type LogicNode = {
  text: string;
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
  | "concession";  // 让步：除非 A，否则 B → ¬A → B

/**
 * 逻辑连接词模式
 */
interface LogicPattern {
  relation: LogicRelation;
  label: string; // 显示的箭头符号
  // 每个 pattern 是一组正则，捕获组: 1=前置部分, 2=后置部分
  patterns: RegExp[];
}

const LOGIC_PATTERNS: LogicPattern[] = [
  {
    relation: "causal",
    label: "→",
    patterns: [
      /因为(.+?)[，,]\s*所以(.+)/,
      /由于(.+?)[，,]\s*因此(.+)/,
      /由于(.+?)[，,]\s*所以(.+)/,
      /(.+?)[，,]\s*因而(.+)/,
      /(.+?)[，,]\s*因此(.+)/,
      /(.+?)[，,]\s*所以(.+)/,
      /(.+?)[，,]\s*导致(.+)/,
      /(.+?)[，,]\s*造成了(.+)/,
    ],
  },
  {
    relation: "conditional",
    label: "⇒",
    patterns: [
      /如果(.+?)[，,]\s*那么(.+)/,
      /假如(.+?)[，,]\s*就(.+)/,
      /若(.+?)[，,]\s*则(.+)/,
      /只有(.+?)[，,]\s*才(.+)/,
      /一旦(.+?)[，,]\s*就(.+)/,
    ],
  },
  {
    relation: "transitional",
    label: "⇏",
    patterns: [
      /虽然(.+?)[，,]\s*但是(.+)/,
      /尽管(.+?)[，,]\s*可是(.+)/,
      /尽管(.+?)[，,]\s*但(.+)/,
      /(.+?)[，,]\s*然而(.+)/,
      /(.+?)[，,]\s*不过(.+)/,
      /(.+?)[，,]\s*可是(.+)/,
      /(.+?)[，,]\s*但(.+)/,
    ],
  },
  {
    relation: "progressive",
    label: "→",
    patterns: [
      /不仅(.+?)[，,]\s*而且(.+)/,
      /不但(.+?)[，,]\s*还(.+)/,
      /不只(.+?)[，,]\s*还(.+)/,
      /(.+?)[，,]\s*并且(.+)/,
      /(.+?)[，,]\s*同时(.+)/,
      /(.+?)[，,]\s*进而(.+)/,
    ],
  },
  {
    relation: "sequential",
    label: "→",
    patterns: [
      /首先(.+?)[，,]\s*然后(.+)/,
      /先(.+?)[，,]\s*再(.+)/,
      /先(.+?)[，,]\s*然后(.+)/,
      /(.+?)[，,]\s*接着(.+)/,
      /(.+?)[，,]\s*之后(.+)/,
    ],
  },
  {
    relation: "purpose",
    label: "→",
    patterns: [
      /为了(.+?)[，,]\s*需要(.+)/,
      /为(.+?)[，,]\s*应(.+)/,
      /(.+?)[，,]\s*以便(.+)/,
      /(.+?)[，,]\s*以(.+)/,
    ],
  },
  {
    relation: "concession",
    label: "⇒",
    patterns: [
      /除非(.+?)[，,]\s*否则(.+)/,
      /除非(.+?)[，,]\s*不然(.+)/,
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
 * 句首结论词：因此 / 所以 / 因而 开头的句子
 * 表示从前文推导出的结论，标记为 → 关系
 */
const SENTENCE_START_CONCLUSION = /^(?:因此|所以|因而)[，,]?\s*(.+)/;

/**
 * 尝试匹配一条逻辑模式
 * 返回 LogicNode 或 null（未匹配到）
 */
function tryMatchPattern(text: string): LogicNode | null {
  // 先检查句首结论词
  const conclusionMatch = text.match(SENTENCE_START_CONCLUSION);
  if (conclusionMatch) {
    const conclusion = conclusionMatch[1].trim();
    return {
      text: `→ ${conclusion}`,
      chain: [{ text: conclusion }],
    };
  }

  for (const pattern of LOGIC_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = text.match(regex);
      if (match) {
        const a = match[1].trim();
        const b = match[2].trim();

        // 递归提取 A 和 B 内部的子逻辑
        const aChain = extractLogicChain(a);
        const bChain = extractLogicChain(b);

        return {
          text: `${a} ${pattern.label} ${b}`,
          chain: [...aChain, ...bChain],
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
    const matched = tryMatchPattern(sentence);
    if (matched) {
      result.push(matched);
    } else {
      // 没有匹配到逻辑连接词，作为叶子节点
      result.push({ text: sentence });
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
  label: string;
  nodes: LogicNode[];
}> {
  const sentences = splitSentences(text);
  const result: Array<{
    relation: LogicRelation;
    label: string;
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
            label: pattern.label,
            nodes: [{ text: a }, { text: b }],
          });
          break;
        }
      }
    }
  }

  return result;
}