import { getAppLanguage } from "./app-language";

const KNOWN_RUNTIME_REPLACEMENTS: ReadonlyArray<{
  readonly pattern: RegExp;
  readonly replacement: { zh: string; en: string; vi: string };
}> = [
  {
    pattern: /Latest chapter (\d+) is state-degraded\. Repair state or rewrite that chapter before continuing\./g,
    replacement: {
      zh: "最新第 $1 章处于状态降级（state-degraded）。继续写下一章前，请先修复状态，或重写这一章。",
      en: "Latest chapter $1 is state-degraded. Repair state or rewrite that chapter before continuing.",
      vi: "Chương mới nhất $1 đang ở trạng thái lỗi (state-degraded). Hãy sửa trạng thái hoặc viết lại chương đó trước khi tiếp tục.",
    },
  },
  {
    pattern: /Chapter (\d+) is not state-degraded\./g,
    replacement: {
      zh: "第 $1 章不是状态降级（state-degraded），无需按状态修复。",
      en: "Chapter $1 is not state-degraded.",
      vi: "Chương $1 không ở trạng thái lỗi (state-degraded), không cần sửa.",
    },
  },
  {
    pattern: /Only the latest state-degraded chapter can be repaired safely \(latest is (\d+)\)\./g,
    replacement: {
      zh: "只能安全修复最新的状态降级（state-degraded）章节；当前最新章是第 $1 章。",
      en: "Only the latest state-degraded chapter can be repaired safely (latest is $1).",
      vi: "Chỉ có thể sửa an toàn chương lỗi (state-degraded) mới nhất; chương mới nhất hiện tại là chương $1.",
    },
  },
  {
    pattern: /State repair still failed for chapter (\d+)\./g,
    replacement: {
      zh: "第 $1 章状态修复仍然失败。",
      en: "State repair still failed for chapter $1.",
      vi: "Sửa trạng thái cho chương $1 vẫn thất bại.",
    },
  },
  {
    pattern: /Studio LLM API key not set\. Open Studio services and save an API key for the selected service\./g,
    replacement: {
      zh: "Studio 模型 API Key 未设置。请打开“模型配置”，为当前服务保存 API Key。",
      en: "Studio LLM API key not set. Open Studio services and save an API key for the selected service.",
      vi: "Chưa cài API Key cho Studio LLM. Mở cấu hình dịch vụ và lưu API Key cho dịch vụ đang chọn.",
    },
  },
  {
    pattern: /INKOS_LLM_API_KEY not set\. Run 'inkos config set-global' or add it to project \.env file\./g,
    replacement: {
      zh: "INKOS_LLM_API_KEY 未设置。请运行 `inkos config set-global`，或在项目 .env 文件中添加它。",
      en: "INKOS_LLM_API_KEY not set. Run 'inkos config set-global' or add it to project .env file.",
      vi: "INKOS_LLM_API_KEY chưa được cài. Chạy `inkos config set-global` hoặc thêm vào file .env của dự án.",
    },
  },
];

export function localizeKnownRuntimeMessage(message: string): string {
  const lang = getAppLanguage();
  let localized = message;
  for (const entry of KNOWN_RUNTIME_REPLACEMENTS) {
    const repl = lang === "zh" ? entry.replacement.zh : lang === "vi" ? entry.replacement.vi : entry.replacement.en;
    localized = localized.replace(entry.pattern, repl);
  }
  return localized;
}
