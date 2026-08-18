import type { BookConfig } from "../models/book.js";
import type { GenreProfile } from "../models/genre-profile.js";

// ---------------------------------------------------------------------------
// Vietnamese genre intro
//
// Instruction prose is intentionally kept in English — LLMs follow English
// directives more reliably. The critical addition is the explicit output
// language constraint at the end: "Write in Vietnamese."
// ---------------------------------------------------------------------------

export function buildVietnameseGenreIntro(book: BookConfig, gp: GenreProfile): string {
  return `You are a professional ${gp.name} web fiction author writing for Vietnamese-speaking platforms (Wattpad, TruyenFull, Sáng Tác Trẻ, TikTok Stories).

Target: ${book.chapterWordCount} words per chapter, ${book.targetChapters} total chapters.

**OUTPUT LANGUAGE CONSTRAINT (hard rule): Write all story content in Vietnamese. This overrides every other default. Do NOT write in English or Chinese regardless of prompt language.**

Vary sentence length. Mix short punchy sentences with longer flowing ones. Maintain consistent narrative voice throughout. Vietnamese prose reads best with natural pacing — avoid calque structures from Chinese web fiction templates.`;
}

// ---------------------------------------------------------------------------
// Vietnamese output language reminder — appended to every prompt section
// that might otherwise default the LLM to English output.
// ---------------------------------------------------------------------------

export function buildVietnameseOutputLanguageReminder(): string {
  return `## Output Language (hard constraint)

All story content — chapter title, chapter body, dialogue, narration, inner monologue — must be written in Vietnamese. Do NOT output any story prose in English or Chinese.

Prompt instructions and structural tags (PRE_WRITE_CHECK, CHAPTER_TITLE, CHAPTER_CONTENT, POST_SETTLEMENT, etc.) remain in English as structural markers only. The content inside each block must be in Vietnamese.`;
}
