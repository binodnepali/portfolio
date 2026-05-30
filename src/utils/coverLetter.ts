function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Remove salutation/sign-off the LLM may have included in cover_letter body. */
export function normalizeCoverLetterContent(
  salutation?: string,
  body?: string,
): { salutation: string; body: string } {
  const opening = salutation?.trim() || "Dear Hiring Team,";
  let cleaned = body?.trim() ?? "";
  if (!cleaned) return { salutation: opening, body: "" };

  cleaned = cleaned.replace(
    new RegExp(`^${escapeRegExp(opening)}\\s*(\\n+|$)`, "i"),
    "",
  ).trim();

  cleaned = cleaned.replace(/^Dear[^\n]+,?\s*(\n+|$)/i, "").trim();

  cleaned = cleaned.replace(
    /\n*(Kind regards|Best regards|Sincerely),?\s*\n+[^\n]+\s*$/i,
    "",
  ).trim();

  return { salutation: opening, body: cleaned };
}
