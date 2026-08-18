import { formatLengthCount, resolveLengthCountingMode } from "@actalk/inkos-core";

export type CliLanguage = "zh" | "en" | "vi";

type WriteIssue = {
  readonly severity: string;
  readonly category: string;
  readonly description: string;
};

type WriteResultShape = {
  readonly chapterNumber: number;
  readonly title: string;
  readonly wordCount: number;
  readonly status: string;
  readonly revised: boolean;
  readonly issues: ReadonlyArray<WriteIssue>;
  readonly auditPassed?: boolean;
  readonly passedAudit?: boolean;
};

type ImportResultShape = {
  readonly importedCount: number;
  readonly totalWords: number;
  readonly nextChapter: number;
  readonly continueBookId: string;
};

function localize(language: CliLanguage, messages: { zh: string; en: string; vi: string }): string {
  if (language === "en") return messages.en;
  if (language === "vi") return messages.vi;
  return messages.zh;
}

function normalizeCliLanguageTag(value: string | undefined): CliLanguage | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("en")) {
    return "en";
  }
  if (normalized.startsWith("zh")) {
    return "zh";
  }
  if (normalized.startsWith("vi")) {
    return "vi";
  }
  return undefined;
}

export function resolveCliLanguage(
  language?: string,
  env: NodeJS.ProcessEnv = process.env,
): CliLanguage {
  const explicit = normalizeCliLanguageTag(language);
  if (explicit) {
    return explicit;
  }

  const requested = normalizeCliLanguageTag(env.INKOS_LOCALE);
  if (requested) {
    return requested;
  }

  const detected = normalizeCliLanguageTag(env.LC_ALL ?? env.LC_MESSAGES ?? env.LANG);
  return detected ?? "zh";
}

export function formatBookCreateCreating(
  language: CliLanguage,
  title: string,
  genre: string,
  platform: string,
): string {
  return localize(language, {
    zh: `创建书籍 "${title}"（${genre} / ${platform}）...`,
    en: `Creating book "${title}" (${genre} / ${platform})...`,
    vi: `Đang tạo tác phẩm "${title}" (${genre} / ${platform})...`,
  });
}

export function formatBookCreateCreated(language: CliLanguage, bookId: string): string {
  return localize(language, {
    zh: `已创建书籍：${bookId}`,
    en: `Book created: ${bookId}`,
    vi: `Đã tạo tác phẩm: ${bookId}`,
  });
}

export function formatBookCreateLocation(language: CliLanguage, bookId: string): string {
  return localize(language, {
    zh: `  位置：books/${bookId}/`,
    en: `  Location: books/${bookId}/`,
    vi: `  Vị trí: books/${bookId}/`,
  });
}

export function formatBookCreateFoundationReady(language: CliLanguage): string {
  return localize(language, {
    zh: "  故事圣经、大纲和书籍规则已生成。",
    en: "  Story bible, outline, book rules generated.",
    vi: "  Đã tạo xong: story bible, cốt truyện và quy tắc tác phẩm.",
  });
}

export function formatBookCreateNextStep(language: CliLanguage, bookId: string): string {
  return localize(language, {
    zh: `下一步：inkos write next ${bookId}`,
    en: `Next: inkos write next ${bookId}`,
    vi: `Bước tiếp theo: inkos write next ${bookId}`,
  });
}

export function formatWriteNextProgress(
  language: CliLanguage,
  current: number,
  total: number,
  bookId: string,
): string {
  return localize(language, {
    zh: `[${current}/${total}] 为「${bookId}」撰写章节...`,
    en: `[${current}/${total}] Writing chapter for "${bookId}"...`,
    vi: `[${current}/${total}] Đang viết chương cho "${bookId}"...`,
  });
}

export function formatWriteNextResultLines(
  language: CliLanguage,
  result: WriteResultShape,
): string[] {
  const auditPassed = result.auditPassed ?? result.passedAudit ?? false;
  const lengthLabel = formatLengthCount(result.wordCount, resolveLengthCountingMode(language));
  const lines = [
    localize(language, {
      zh: `  第${result.chapterNumber}章：${result.title}`,
      en: `  Chapter ${result.chapterNumber}: ${result.title}`,
      vi: `  Chương ${result.chapterNumber}: ${result.title}`,
    }),
    localize(language, {
      zh: `  字数：${lengthLabel}`,
      en: `  Length: ${lengthLabel}`,
      vi: `  Độ dài: ${lengthLabel}`,
    }),
    localize(language, {
      zh: `  审计：${auditPassed ? "通过" : "需复核"}`,
      en: `  Audit: ${auditPassed ? "PASSED" : "NEEDS REVIEW"}`,
      vi: `  Kiểm duyệt: ${auditPassed ? "ĐẠT" : "CẦN XEM LẠI"}`,
    }),
  ];

  if (result.revised) {
    lines.push(localize(language, {
      zh: "  自动修正：已执行（已修复关键问题）",
      en: "  Auto-revised: YES (critical issues were fixed)",
      vi: "  Tự động chỉnh sửa: CÓ (đã sửa các lỗi nghiêm trọng)",
    }));
  }

  lines.push(localize(language, {
    zh: `  状态：${result.status}`,
    en: `  Status: ${result.status}`,
    vi: `  Trạng thái: ${result.status}`,
  }));

  if (result.issues.length > 0) {
    lines.push(localize(language, {
      zh: "  问题：",
      en: "  Issues:",
      vi: "  Vấn đề:",
    }));
    for (const issue of result.issues) {
      lines.push(`    [${issue.severity}] ${issue.category}: ${issue.description}`);
    }
  }

  return lines;
}

export function formatWriteNextComplete(language: CliLanguage): string {
  return localize(language, {
    zh: "完成。",
    en: "Done.",
    vi: "Hoàn tất.",
  });
}

export function formatAutoWriteStart(
  language: CliLanguage,
  bookId: string,
  startChapter: number,
  targetChapter: number,
): string {
  return localize(language, {
    zh: `自动写作「${bookId}」：从第${startChapter}章连续写到第${targetChapter}章...`,
    en: `Auto-writing "${bookId}": chapter ${startChapter} through chapter ${targetChapter}...`,
    vi: `Tự động viết "${bookId}": từ chương ${startChapter} đến chương ${targetChapter}...`,
  });
}

export function formatAutoWriteAlreadyComplete(
  language: CliLanguage,
  bookId: string,
  writtenChapters: number,
  targetChapter: number,
): string {
  return localize(language, {
    zh: `「${bookId}」已写到第${writtenChapters}章（目标第${targetChapter}章），无需继续。`,
    en: `"${bookId}" already has ${writtenChapters} chapter(s) written (target: chapter ${targetChapter}). Nothing to do.`,
    vi: `"${bookId}" đã viết đến chương ${writtenChapters} (mục tiêu: chương ${targetChapter}). Không cần thêm.`,
  });
}

export type NotifyCommandAction = "write-next" | "write-rewrite" | "revise" | "audit" | "auto";

const NOTIFY_ACTION_LABELS: Record<NotifyCommandAction, { zh: string; en: string; vi: string }> = {
  "write-next": { zh: "写作", en: "Write", vi: "Viết" },
  "write-rewrite": { zh: "重写", en: "Rewrite", vi: "Viết lại" },
  revise: { zh: "修订", en: "Revise", vi: "Chỉnh sửa" },
  audit: { zh: "审计", en: "Audit", vi: "Kiểm duyệt" },
  auto: { zh: "自动连写", en: "Auto-write", vi: "Tự động viết" },
};

export function formatNotifyCommandTitle(
  language: CliLanguage,
  action: NotifyCommandAction,
  bookName: string | undefined,
  succeeded: boolean,
): string {
  const label = localize(language, NOTIFY_ACTION_LABELS[action]);
  const book = bookName === undefined
    ? ""
    : localize(language, { zh: `《${bookName}》`, en: `: ${bookName}`, vi: `: ${bookName}` });
  return succeeded
    ? localize(language, { zh: `✅ ${label}完成${book}`, en: `✅ ${label} complete${book}`, vi: `✅ ${label} hoàn tất${book}` })
    : localize(language, { zh: `❌ ${label}失败${book}`, en: `❌ ${label} failed${book}`, vi: `❌ ${label} thất bại${book}` });
}

export function formatNotifyBatchWriteBody(
  language: CliLanguage,
  chapters: ReadonlyArray<{
    readonly chapterNumber: number;
    readonly title: string;
    readonly wordCount: number;
    readonly auditPassed: boolean;
  }>,
): string {
  const first = chapters[0]!;
  const last = chapters[chapters.length - 1]!;
  const lines = [
    localize(language, {
      zh: `本次完成 ${chapters.length} 章（第${first.chapterNumber}章到第${last.chapterNumber}章）`,
      en: `${chapters.length} chapter(s) written (chapter ${first.chapterNumber} to ${last.chapterNumber})`,
      vi: `Đã viết ${chapters.length} chương (chương ${first.chapterNumber} đến ${last.chapterNumber})`,
    }),
    ...chapters.map((ch) => {
      const lengthLabel = formatLengthCount(ch.wordCount, resolveLengthCountingMode(language));
      return localize(language, {
        zh: `第${ch.chapterNumber}章 ${ch.title} | ${lengthLabel} | ${ch.auditPassed ? "审计通过" : "需复核"}`,
        en: `Chapter ${ch.chapterNumber} ${ch.title} | ${lengthLabel} | ${ch.auditPassed ? "audit passed" : "needs review"}`,
        vi: `Chương ${ch.chapterNumber} ${ch.title} | ${lengthLabel} | ${ch.auditPassed ? "đạt kiểm duyệt" : "cần xem lại"}`,
      });
    }),
  ];
  return lines.join("\n");
}

export function formatNotifyAuditBody(
  language: CliLanguage,
  result: {
    readonly chapterNumber: number;
    readonly passed: boolean;
    readonly issueCount: number;
    readonly summary: string;
  },
): string {
  const head = localize(language, {
    zh: `第${result.chapterNumber}章审计${result.passed ? "通过" : "未通过"}（${result.issueCount} 个问题）`,
    en: `Chapter ${result.chapterNumber} audit ${result.passed ? "passed" : "failed"} (${result.issueCount} issue(s))`,
    vi: `Chương ${result.chapterNumber} kiểm duyệt ${result.passed ? "đạt" : "không đạt"} (${result.issueCount} vấn đề)`,
  });
  return result.summary ? `${head}\n${result.summary}` : head;
}

export function formatNotifyReviseBody(
  language: CliLanguage,
  result: {
    readonly chapterNumber: number;
    readonly applied: boolean;
    readonly wordCount: number;
    readonly fixedCount: number;
    readonly skippedReason?: string;
  },
): string {
  if (!result.applied) {
    return localize(language, {
      zh: `第${result.chapterNumber}章保留原稿${result.skippedReason ? `：${result.skippedReason}` : ""}`,
      en: `Chapter ${result.chapterNumber} kept original draft${result.skippedReason ? `: ${result.skippedReason}` : ""}`,
      vi: `Chương ${result.chapterNumber} giữ nguyên bản gốc${result.skippedReason ? `: ${result.skippedReason}` : ""}`,
    });
  }
  const lengthLabel = formatLengthCount(result.wordCount, resolveLengthCountingMode(language));
  return localize(language, {
    zh: `第${result.chapterNumber}章已修订 | ${lengthLabel} | 修复 ${result.fixedCount} 个问题`,
    en: `Chapter ${result.chapterNumber} revised | ${lengthLabel} | ${result.fixedCount} issue(s) fixed`,
    vi: `Chương ${result.chapterNumber} đã chỉnh sửa | ${lengthLabel} | đã sửa ${result.fixedCount} vấn đề`,
  });
}

export function formatNotifyFailureBody(language: CliLanguage, error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);
  return localize(language, {
    zh: `错误：${detail}`,
    en: `Error: ${detail}`,
    vi: `Lỗi: ${detail}`,
  });
}

export function formatImportChaptersDiscovery(
  language: CliLanguage,
  chapterCount: number,
  bookId: string,
): string {
  return localize(language, {
    zh: `发现 ${chapterCount} 章，准备导入到「${bookId}」。`,
    en: `Found ${chapterCount} chapters to import into "${bookId}".`,
    vi: `Tìm thấy ${chapterCount} chương, chuẩn bị nhập vào "${bookId}".`,
  });
}

export function formatImportChaptersResume(
  language: CliLanguage,
  resumeFrom: number,
): string {
  return localize(language, {
    zh: `从第 ${resumeFrom} 章继续导入。`,
    en: `Resuming from chapter ${resumeFrom}.`,
    vi: `Tiếp tục nhập từ chương ${resumeFrom}.`,
  });
}

export function formatImportChaptersComplete(
  language: CliLanguage,
  result: ImportResultShape,
): string[] {
  const lengthLabel = formatLengthCount(result.totalWords, resolveLengthCountingMode(language));
  return [
    localize(language, {
      zh: "导入完成：",
      en: "Import complete:",
      vi: "Nhập hoàn tất:",
    }),
    localize(language, {
      zh: `  已导入章节：${result.importedCount}`,
      en: `  Chapters imported: ${result.importedCount}`,
      vi: `  Số chương đã nhập: ${result.importedCount}`,
    }),
    localize(language, {
      zh: `  总长度：${lengthLabel}`,
      en: `  Total length: ${lengthLabel}`,
      vi: `  Tổng độ dài: ${lengthLabel}`,
    }),
    localize(language, {
      zh: `  下一章编号：${result.nextChapter}`,
      en: `  Next chapter number: ${result.nextChapter}`,
      vi: `  Số chương tiếp theo: ${result.nextChapter}`,
    }),
    "",
    localize(language, {
      zh: `运行 "inkos write next ${result.continueBookId}" 继续写作。`,
      en: `Run "inkos write next ${result.continueBookId}" to continue writing.`,
      vi: `Chạy "inkos write next ${result.continueBookId}" để tiếp tục viết.`,
    }),
  ];
}

export function formatImportCanonStart(
  language: CliLanguage,
  parentBookId: string,
  targetBookId: string,
): string {
  return localize(language, {
    zh: `把 "${parentBookId}" 的正典导入到 "${targetBookId}"...`,
    en: `Importing canon from "${parentBookId}" into "${targetBookId}"...`,
    vi: `Đang nhập canon từ "${parentBookId}" vào "${targetBookId}"...`,
  });
}

export function formatImportCanonComplete(language: CliLanguage): string[] {
  return [
    localize(language, {
      zh: "正典已导入：story/parent_canon.md",
      en: "Canon imported: story/parent_canon.md",
      vi: "Đã nhập canon: story/parent_canon.md",
    }),
    localize(language, {
      zh: "Writer 和 auditor 会在番外模式下自动识别这个文件。",
      en: "Writer and auditor will auto-detect this file for spinoff mode.",
      vi: "Writer và auditor sẽ tự nhận diện file này trong chế độ spinoff.",
    }),
  ];
}

export function formatListModelsEmpty(language: CliLanguage, service: string): string {
  return localize(language, {
    zh: `${service} 没有可用模型（可能需要 --api-key 和 --base-url）`,
    en: `No models available for ${service} (you may need --api-key and --base-url)`,
    vi: `Không có model khả dụng cho ${service} (có thể cần --api-key và --base-url)`,
  });
}

export function formatListModelsHeader(
  language: CliLanguage,
  service: string,
  count: number,
): string {
  return localize(language, {
    zh: `${service}：${count} 个模型`,
    en: `${service}: ${count} model(s)`,
    vi: `${service}: ${count} model`,
  });
}

export function formatDoctorHintQuota(language: CliLanguage): string {
  return localize(language, {
    zh: "检查 API Key 是否正确、模型是否可用，以及账号余额或配额是否足够。",
    en: "Check that the API key is valid, the model is available, and the account has enough balance or quota.",
    vi: "Kiểm tra API Key có đúng không, model có khả dụng không, và tài khoản có đủ số dư hoặc hạn mức không.",
  });
}

export function formatDoctorHintOpenAiProbeExhausted(language: CliLanguage): string {
  return localize(language, {
    zh: "当前已自动尝试 chat/responses 与流式开关组合；如果仍失败，问题更可能在模型名、baseUrl 路径或服务商兼容性本身。",
    en: "All chat/responses and stream on/off combinations were already probed; if it still fails, the problem is more likely the model name, the baseUrl path, or provider compatibility itself.",
    vi: "Đã thử tất cả tổ hợp chat/responses và stream bật/tắt; nếu vẫn thất bại, vấn đề có thể là tên model, đường dẫn baseUrl, hoặc khả năng tương thích của nhà cung cấp.",
  });
}

export function formatDoctorHintBaseUrl(language: CliLanguage): string {
  return localize(language, {
    zh: "baseUrl 可能不正确，检查 INKOS_LLM_BASE_URL 是否包含完整路径（如 /v1）",
    en: "The baseUrl may be wrong. Check that INKOS_LLM_BASE_URL includes the full path (e.g. /v1).",
    vi: "baseUrl có thể sai. Kiểm tra INKOS_LLM_BASE_URL có bao gồm đường dẫn đầy đủ không (vd: /v1).",
  });
}

export function formatDoctorHintStreamRequirement(language: CliLanguage): string {
  return localize(language, {
    zh: "检查提供方文档，确认该接口要求 stream=true、stream=false，还是根本不支持 stream",
    en: "Check the provider docs to confirm whether the endpoint requires stream=true, stream=false, or does not support streaming at all.",
    vi: "Kiểm tra tài liệu nhà cung cấp để xác nhận endpoint yêu cầu stream=true, stream=false, hay không hỗ trợ streaming.",
  });
}

export function formatDoctorHintModelName(language: CliLanguage): string {
  return localize(language, {
    zh: "检查模型名称是否正确（INKOS_LLM_MODEL）",
    en: "Check that the model name is correct (INKOS_LLM_MODEL).",
    vi: "Kiểm tra tên model có đúng không (INKOS_LLM_MODEL).",
  });
}

export function formatDoctorHintInvalidApiKey(language: CliLanguage): string {
  return localize(language, {
    zh: "API Key 无效，检查 INKOS_LLM_API_KEY",
    en: "The API key is invalid. Check INKOS_LLM_API_KEY.",
    vi: "API Key không hợp lệ. Kiểm tra INKOS_LLM_API_KEY.",
  });
}

// Fanfic errors are intentionally bilingual in a single string: they can surface
// through `--json` output or be rethrown before any book language is known.
export function formatFanficInvalidModeError(mode: string): string {
  return `Invalid fanfic mode: "${mode}". Valid modes: canon, au, ooc, cp（无效的同人模式："${mode}"，可选 canon、au、ooc、cp）`;
}

export function formatFanficSourceTooShortError(length: number): string {
  return `Source material too short (${length} chars); provide at least 100 chars（源素材内容过短，仅 ${length} 字符，请提供至少 100 字符的原作素材）`;
}

export function formatFanficCanonMissingError(): string {
  return "No fanfic canon found for this book. Create one with `inkos fanfic init`（该书没有同人正典文件，用 inkos fanfic init 创建同人书）";
}

export function formatFanficSourceDirEmptyError(sourcePath: string): string {
  return `No .txt or .md files found in ${sourcePath}（目录 ${sourcePath} 中没有 .txt 或 .md 文件）`;
}

export function formatChapterSyncNoChanges(language: CliLanguage, checked: number): string {
  return localize(language, {
    zh: `已核对 ${checked} 章，index.json 字数无需修正。`,
    en: `Checked ${checked} chapter(s); index.json word counts already match the files.`,
    vi: `Đã kiểm tra ${checked} chương; số từ trong index.json đã khớp với các file.`,
  });
}

export function formatChapterSyncChange(
  language: CliLanguage,
  change: { number: number; title: string; previousWordCount: number; wordCount: number },
  countingMode: "zh_chars" | "en_words",
): string {
  const from = formatLengthCount(change.previousWordCount, countingMode);
  const to = formatLengthCount(change.wordCount, countingMode);
  return localize(language, {
    zh: `  第${change.number}章 ${change.title}：${from} → ${to}`,
    en: `  Chapter ${change.number} ${change.title}: ${from} → ${to}`,
    vi: `  Chương ${change.number} ${change.title}: ${from} → ${to}`,
  });
}

export function formatChapterSyncSummary(language: CliLanguage, changed: number, checked: number): string {
  return localize(language, {
    zh: `已核对 ${checked} 章，修正了 ${changed} 章的 index.json 字数。`,
    en: `Checked ${checked} chapter(s); corrected ${changed} index.json word count(s).`,
    vi: `Đã kiểm tra ${checked} chương; đã sửa số từ trong index.json cho ${changed} chương.`,
  });
}

export function formatChapterSyncMissingFiles(language: CliLanguage, numbers: ReadonlyArray<number>): string {
  return localize(language, {
    zh: `警告：index.json 中的第 ${numbers.join("、")} 章找不到对应的章节文件，已跳过。`,
    en: `Warning: chapter(s) ${numbers.join(", ")} exist in index.json but have no chapter file on disk; skipped.`,
    vi: `Cảnh báo: chương ${numbers.join(", ")} tồn tại trong index.json nhưng không có file trên đĩa; đã bỏ qua.`,
  });
}

export function formatChapterDeleteConfirm(
  language: CliLanguage,
  params: { bookTitle: string; bookId: string; number: number; title: string },
): string {
  return localize(language, {
    zh: `将删除《${params.bookTitle}》(${params.bookId}) 的最新章：第${params.number}章 ${params.title}。`
      + `章节文件会移入 chapters/.trash/，索引和故事状态回滚到第${params.number - 1}章。确认删除？(y/N) `,
    en: `Delete the latest chapter of "${params.bookTitle}" (${params.bookId}): chapter ${params.number} ${params.title}? `
      + `The chapter file moves to chapters/.trash/ and the index and story state roll back to chapter ${params.number - 1}. (y/N) `,
    vi: `Xóa chương mới nhất của "${params.bookTitle}" (${params.bookId}): chương ${params.number} ${params.title}? `
      + `File chương sẽ chuyển vào chapters/.trash/ và chỉ mục, trạng thái câu chuyện sẽ quay về chương ${params.number - 1}. (y/N) `,
  });
}

export function formatChapterDeleteCancelled(language: CliLanguage): string {
  return localize(language, {
    zh: "已取消。",
    en: "Cancelled.",
    vi: "Đã hủy.",
  });
}

export function formatChapterDeleteDone(
  language: CliLanguage,
  params: { number: number; title: string; trashedFiles: ReadonlyArray<string>; rolledBackTo: number },
): string {
  const trashNote = params.trashedFiles.length > 0
    ? params.trashedFiles.join(", ")
    : localize(language, { zh: "（章节文件已不存在，未移动）", en: "(chapter file was already gone; nothing moved)", vi: "(file chương đã không còn; không di chuyển gì)" });
  return localize(language, {
    zh: `已删除第${params.number}章 ${params.title}：章节文件保留在 ${trashNote}，索引和故事状态已回滚到第${params.rolledBackTo}章。`,
    en: `Deleted chapter ${params.number} ${params.title}: chapter file kept at ${trashNote}; index and story state rolled back to chapter ${params.rolledBackTo}.`,
    vi: `Đã xóa chương ${params.number} ${params.title}: file chương được giữ tại ${trashNote}; chỉ mục và trạng thái câu chuyện đã quay về chương ${params.rolledBackTo}.`,
  });
}

export function formatBookBackupCreated(language: CliLanguage, bookId: string, backupId: string): string {
  return localize(language, {
    zh: `已备份 ${bookId} → .inkos/backups/${bookId}/${backupId}/`,
    en: `Backed up ${bookId} → .inkos/backups/${bookId}/${backupId}/`,
    vi: `Đã sao lưu ${bookId} → .inkos/backups/${bookId}/${backupId}/`,
  });
}

export function formatBookBackupListEmpty(language: CliLanguage, bookId: string): string {
  return localize(language, {
    zh: `${bookId} 还没有备份。用 inkos book backup ${bookId} 创建一份。`,
    en: `No backups for ${bookId} yet. Create one with: inkos book backup ${bookId}`,
    vi: `${bookId} chưa có bản sao lưu. Tạo bằng: inkos book backup ${bookId}`,
  });
}

export function formatBookRestoreDone(
  language: CliLanguage,
  params: { bookId: string; backupId: string; preRestoreBackupId: string | null },
): string {
  const preNote = params.preRestoreBackupId
    ? localize(language, {
        zh: `恢复前的状态已自动备份为 ${params.preRestoreBackupId}。`,
        en: `The pre-restore state was automatically backed up as ${params.preRestoreBackupId}.`,
        vi: `Trạng thái trước khi khôi phục đã được tự động sao lưu là ${params.preRestoreBackupId}.`,
      })
    : localize(language, {
        zh: "书目录当时不存在，未创建恢复前备份。",
        en: "The book directory did not exist, so no pre-restore backup was created.",
        vi: "Thư mục tác phẩm không tồn tại, nên không tạo bản sao lưu trước khi khôi phục.",
      });
  return localize(language, {
    zh: `已把 ${params.bookId} 恢复到备份 ${params.backupId}。${preNote}`,
    en: `Restored ${params.bookId} to backup ${params.backupId}. ${preNote}`,
    vi: `Đã khôi phục ${params.bookId} về bản sao lưu ${params.backupId}. ${preNote}`,
  });
}
