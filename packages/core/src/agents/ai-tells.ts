/**
 * Structural AI-tell detection — pure rule-based analysis (no LLM).
 *
 * Detects patterns common in AI-generated text across three languages:
 * - dim 20: Paragraph length uniformity (low variance)
 * - dim 21: Filler/hedge word density
 * - dim 22: Formulaic transition patterns
 * - dim 23: List-like structure (consecutive same-prefix sentences)
 */

export interface AITellIssue {
  readonly severity: "warning" | "info";
  readonly category: string;
  readonly description: string;
  readonly suggestion: string;
}

export interface AITellResult {
  readonly issues: ReadonlyArray<AITellIssue>;
}

export type AITellLanguage = "zh" | "en" | "vi";

// ---------------------------------------------------------------------------
// Word lists — translated equivalents across languages
// ---------------------------------------------------------------------------

const HEDGE_WORDS: Record<AITellLanguage, ReadonlyArray<string>> = {
  zh: ["似乎", "可能", "或许", "大概", "某种程度上", "一定程度上", "在某种意义上"],
  en: ["seems", "seemed", "perhaps", "maybe", "apparently", "in some ways", "to some extent"],
  // Vietnamese hedges: AI overuses these to soften statements instead of writing directly
  vi: ["dường như", "có vẻ như", "hình như", "có lẽ", "chắc là", "tựa hồ", "không biết sao"],
};

const TRANSITION_WORDS: Record<AITellLanguage, ReadonlyArray<string>> = {
  zh: ["然而", "不过", "与此同时", "另一方面", "尽管如此", "话虽如此", "但值得注意的是"],
  en: ["however", "meanwhile", "on the other hand", "nevertheless", "even so", "still"],
  // Vietnamese formulaic transitions: AI defaults to these when pivoting scenes
  vi: ["tuy nhiên", "mặc dù vậy", "trong khi đó", "ngoài ra", "đặc biệt là", "thú vị là", "không thể phủ nhận"],
};

// ---------------------------------------------------------------------------
// Label helpers
// ---------------------------------------------------------------------------

function label(lang: AITellLanguage, zh: string, en: string, vi: string): string {
  if (lang === "zh") return zh;
  if (lang === "vi") return vi;
  return en;
}

/**
 * Analyze text content for structural AI-tell patterns.
 * Returns issues that can be merged into audit results.
 */
export function analyzeAITells(content: string, language: AITellLanguage = "zh"): AITellResult {
  const issues: AITellIssue[] = [];
  const isCjk = language === "zh";
  // Vietnamese uses Latin script with diacritics — treat like en for sentence splitting
  const joiner = isCjk ? "、" : ", ";

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // dim 20: Paragraph length uniformity (needs ≥3 paragraphs)
  if (paragraphs.length >= 3) {
    const paragraphLengths = paragraphs.map((p) => p.length);
    const mean = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
    if (mean > 0) {
      const variance = paragraphLengths.reduce((sum, l) => sum + (l - mean) ** 2, 0) / paragraphLengths.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / mean;
      if (cv < 0.15) {
        issues.push({
          severity: "warning",
          category: label(language, "段落等长", "Paragraph uniformity", "Đoạn văn đều nhau"),
          description: label(
            language,
            `段落长度变异系数仅${cv.toFixed(3)}（阈值<0.15），段落长度过于均匀，呈现AI生成特征`,
            `Paragraph-length coefficient of variation is only ${cv.toFixed(3)} (threshold <0.15), which suggests unnaturally uniform paragraph sizing`,
            `Hệ số biến động độ dài đoạn văn chỉ ${cv.toFixed(3)} (ngưỡng <0.15), đoạn văn đều nhau bất thường — dấu hiệu AI tạo sinh`,
          ),
          suggestion: label(
            language,
            "增加段落长度差异：短段落用于节奏加速或冲击，长段落用于沉浸描写",
            "Increase paragraph-length contrast: use shorter beats for impact and longer blocks for immersive detail",
            "Tăng độ tương phản độ dài đoạn văn: đoạn ngắn cho nhịp căng thẳng, đoạn dài cho mô tả chìm đắm",
          ),
        });
      }
    }
  }

  // dim 21: Hedge word density
  const totalChars = content.length;
  if (totalChars > 0) {
    let hedgeCount = 0;
    for (const word of HEDGE_WORDS[language]) {
      const regex = new RegExp(word, isCjk ? "g" : "gi");
      const matches = content.match(regex);
      hedgeCount += matches?.length ?? 0;
    }
    const hedgeDensity = hedgeCount / (totalChars / 1000);
    if (hedgeDensity > 3) {
      issues.push({
        severity: "warning",
        category: label(language, "套话密度", "Hedge density", "Mật độ từ mờ nhạt"),
        description: label(
          language,
          `套话词（似乎/可能/或许等）密度为${hedgeDensity.toFixed(1)}次/千字（阈值>3），语气过于模糊犹豫`,
          `Hedge-word density is ${hedgeDensity.toFixed(1)} per 1k characters (threshold >3), making the prose sound overly tentative`,
          `Mật độ từ mờ nhạt (dường như/có vẻ/hình như...) là ${hedgeDensity.toFixed(1)} lần/1000 ký tự (ngưỡng >3) — văn quá do dự, thiếu chắc chắn`,
        ),
        suggestion: label(
          language,
          "用确定性叙述替代模糊表达：去掉「似乎」直接描述状态，用具体细节替代「可能」",
          "Replace hedges with firmer narration: remove vague qualifiers and use concrete detail instead",
          "Thay từ mờ nhạt bằng mô tả xác định: bỏ 'dường như', viết thẳng trạng thái; thay 'có lẽ' bằng chi tiết cụ thể",
        ),
      });
    }
  }

  // dim 22: Formulaic transition repetition
  const transitionCounts: Record<string, number> = {};
  for (const word of TRANSITION_WORDS[language]) {
    const regex = new RegExp(word, isCjk ? "g" : "gi");
    const matches = content.match(regex);
    const count = matches?.length ?? 0;
    if (count > 0) {
      transitionCounts[isCjk ? word : word.toLowerCase()] = count;
    }
  }
  const repeatedTransitions = Object.entries(transitionCounts)
    .filter(([, count]) => count >= 3);
  if (repeatedTransitions.length > 0) {
    const detail = repeatedTransitions
      .map(([word, count]) => `"${word}"×${count}`)
      .join(joiner);
    issues.push({
      severity: "warning",
      category: label(language, "公式化转折", "Formulaic transitions", "Từ nối công thức"),
      description: label(
        language,
        `转折词重复使用：${detail}。同一转折模式≥3次暴露AI生成痕迹`,
        `Transition words repeat too often: ${detail}. Reusing the same transition pattern 3+ times creates a formulaic AI texture`,
        `Từ nối lặp quá nhiều: ${detail}. Dùng cùng một mẫu chuyển cảnh ≥3 lần lộ rõ dấu AI tạo sinh`,
      ),
      suggestion: label(
        language,
        "用情节自然转折替代转折词，或换用不同的过渡手法（动作切入、时间跳跃、视角切换）",
        "Let scenes pivot through action, timing, or viewpoint shifts instead of repeating the same transitions",
        "Chuyển cảnh tự nhiên bằng hành động, bước nhảy thời gian, hoặc đổi góc nhìn — không dùng cùng một từ nối",
      ),
    });
  }

  // dim 23: List-like structure (consecutive sentences with same prefix pattern)
  const sentences = content
    .split(isCjk ? /[。！？\n]/ : /[.!?\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  if (sentences.length >= 3) {
    let consecutiveSamePrefix = 1;
    let maxConsecutive = 1;
    for (let i = 1; i < sentences.length; i++) {
      const prevPrefix = isCjk
        ? sentences[i - 1]!.slice(0, 2)
        : sentences[i - 1]!.split(/\s+/)[0]?.toLowerCase() ?? "";
      const currPrefix = isCjk
        ? sentences[i]!.slice(0, 2)
        : sentences[i]!.split(/\s+/)[0]?.toLowerCase() ?? "";
      if (prevPrefix === currPrefix) {
        consecutiveSamePrefix++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveSamePrefix);
      } else {
        consecutiveSamePrefix = 1;
      }
    }
    if (maxConsecutive >= 3) {
      issues.push({
        severity: "info",
        category: label(language, "列表式结构", "List-like structure", "Cấu trúc dạng liệt kê"),
        description: label(
          language,
          `检测到${maxConsecutive}句连续以相同开头的句子，呈现列表式AI生成结构`,
          `Detected ${maxConsecutive} consecutive sentences with the same opening pattern, creating a list-like generated cadence`,
          `Phát hiện ${maxConsecutive} câu liên tiếp mở đầu giống nhau — tạo nhịp liệt kê đặc trưng của AI`,
        ),
        suggestion: label(
          language,
          "变换句式开头：用不同主语、时间词、动作词开头，打破列表感",
          "Vary how sentences open: change subject, timing, or action entry to break the list effect",
          "Đổi cách mở đầu câu: thay chủ ngữ, dùng trạng từ thời gian, hoặc vào thẳng hành động để phá vỡ cảm giác liệt kê",
        ),
      });
    }
  }

  return { issues };
}
