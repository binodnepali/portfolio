export function geminiModelName(): string {
  return Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
}

export function requireGeminiApiKey(): string {
  const apiKey = Deno.env.get("GEMINI_API_KEY") ??
    Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Add it to your environment or .env file.",
    );
  }
  return apiKey;
}
