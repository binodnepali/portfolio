import { slugify } from "./ids.ts";

export const MAX_JOB_FILE_BYTES = 128 * 1024;

const ALLOWED_EXTENSIONS = [".txt", ".md"];

export function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.(txt|md)$/i, "");
  return slugify(base) || "tailored-cv";
}

export function assertAllowedJobFile(file: File): void {
  const name = file.name.toLowerCase();
  const allowed = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!allowed) {
    throw new Error("Upload a .txt or .md job description file");
  }
  if (file.size === 0) {
    throw new Error("Job description file is empty");
  }
  if (file.size > MAX_JOB_FILE_BYTES) {
    throw new Error(
      `Job description file is too large (max ${MAX_JOB_FILE_BYTES} bytes)`,
    );
  }
}

export async function readJobFile(file: File): Promise<string> {
  assertAllowedJobFile(file);
  return (await file.text()).trim();
}

export function resolveTailorSlug(
  slugInput: FormDataEntryValue | null,
  filename: string,
): string {
  const raw = typeof slugInput === "string" ? slugInput.trim() : "";
  const slug = slugify(raw || slugFromFilename(filename));
  if (!slug) {
    throw new Error("Could not derive a slug from the filename or --slug");
  }
  return slug;
}
