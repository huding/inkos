export type WritingLanguage = "zh" | "en" | "vi";

/**
 * Infer the writing language from a free-text brief/premise when the user did not set one explicitly.
 *
 * Conservative by design: defaults to "zh" (preserving prior behaviour) and only
 * returns "en" when the text is clearly Latin-dominant without Vietnamese diacritics.
 * Returns "vi" when Vietnamese-specific diacritics (ă, ơ, ư, đ, etc.) dominate.
 * A brief that mentions an English name or a CJK term still resolves to its dominant script.
 */
export function inferLanguage(text?: string | null): WritingLanguage {
  const t = text ?? "";
  const cjk = (t.match(/[一-鿿]/g) ?? []).length;
  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  // CJK dominant (or only CJK present): Chinese
  if (cjk > 0 && cjk * 4 >= latin) return "zh";
  // Latin-dominant: check for Vietnamese diacritics vs plain English
  if (latin > 0 || cjk === 0) {
    const vietnamese = (t.match(/[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i) ?? []).length;
    if (vietnamese > 0) return "vi";
    if (latin > 0) return "en";
  }
  return "zh";
}
