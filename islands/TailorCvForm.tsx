import { useState } from "preact/hooks";

interface TailorResult {
  slug: string;
  label: string;
  previewUrl: string;
}

export default function TailorCvForm() {
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResult | null>(null);

  async function onSubmit(event: Event) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please choose a job description file to upload.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    if (slug.trim()) form.append("slug", slug.trim());

    setLoading(true);
    try {
      const response = await fetch("/api/cv/tailor", {
        method: "POST",
        body: form,
      });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Access was denied. Check your browser header rule for this site and try again.",
          );
        }
        throw new Error(
          payload.error ?? "Something went wrong. Please try again.",
        );
      }
      setResult(payload as TailorResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form class="space-y-6" onSubmit={onSubmit}>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Job posting
        </label>
        <input
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          class="mt-1 block w-full text-sm text-slate-600 dark:text-slate-300"
          onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
        />
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Upload the job description as a text file (.txt or .md). Copy the
          posting from the job site and save it as a file if you need to.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Name for this CV{" "}
          <span class="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          type="text"
          value={slug}
          onInput={(e) => setSlug(e.currentTarget.value)}
          class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          placeholder="e.g. booking-software-engineer"
        />
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          A short name so you can find this version later. If you leave this
          blank, we'll use the file name.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Creating your CV…" : "Create tailored CV"}
      </button>

      {error && (
        <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </p>
      )}

      {result && (
        <div class="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-100">
          <p class="font-medium">Your tailored CV is ready</p>
          <p class="mt-1">{result.label}</p>
          <p class="mt-3">
            <a
              href={result.previewUrl}
              class="inline-block rounded-md bg-teal-700 px-3 py-1.5 text-white no-underline hover:bg-teal-800"
            >
              View and print CV
            </a>
          </p>
        </div>
      )}
    </form>
  );
}
