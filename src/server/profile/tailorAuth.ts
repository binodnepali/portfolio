function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

/** Trim and strip whitespace from a base64 API key string. */
export function normalizeBase64ApiKey(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function isValidBase64ApiKey(value: string): boolean {
  const normalized = normalizeBase64ApiKey(value);
  if (!normalized || normalized.length % 4 === 1) return false;

  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const standard = padded.replace(/-/g, "+").replace(/_/g, "/");

  try {
    atob(standard);
    return true;
  } catch {
    return false;
  }
}

export function isTailorApiConfigured(): boolean {
  const key = Deno.env.get("TAILOR_CV_API_KEY");
  return Boolean(key && isValidBase64ApiKey(key));
}

export function authorizeTailorRequest(req: Request): boolean {
  const expectedRaw = Deno.env.get("TAILOR_CV_API_KEY");
  if (!expectedRaw || !isValidBase64ApiKey(expectedRaw)) return false;

  const providedRaw = req.headers.get("X-API-Key") ??
    req.headers.get("x-api-key") ??
    "";
  if (!providedRaw || !isValidBase64ApiKey(providedRaw)) return false;

  const expected = normalizeBase64ApiKey(expectedRaw);
  const provided = normalizeBase64ApiKey(providedRaw);
  return timingSafeEqual(provided, expected);
}
