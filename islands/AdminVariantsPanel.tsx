import { useEffect, useState } from "preact/hooks";

interface VariantSummary {
  slug: string;
  label?: string;
  target_company?: string;
  target_role?: string;
  created_at?: string;
  in_kv: boolean;
  in_file: boolean;
  preview_url: string;
}

interface ListResponse {
  count: number;
  variants: VariantSummary[];
}

interface CleanupResponse {
  dry_run: boolean;
  older_than_days: number;
  deleted_count: number;
  deleted: string[];
  skipped_without_created_at: string[];
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function storageBadges(variant: VariantSummary) {
  const badges: string[] = [];
  if (variant.in_kv) badges.push("KV");
  if (variant.in_file) badges.push("file");
  return badges.length > 0 ? badges.join(" · ") : "—";
}

export default function AdminVariantsPanel() {
  const [variants, setVariants] = useState<VariantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [olderThanDays, setOlderThanDays] = useState("90");
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResponse | null>(
    null,
  );
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function loadVariants() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/variants");
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Access was denied. Check your browser header rule for this site and refresh.",
          );
        }
        throw new Error(payload.error ?? "Could not load variants.");
      }
      setVariants((payload as ListResponse).variants);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load variants.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVariants();
  }, []);

  async function deleteVariant(slug: string) {
    if (
      !globalThis.confirm(
        `Delete variant "${slug}" from KV and data/variants/?`,
      )
    ) {
      return;
    }

    setDeletingSlug(slug);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/variants/${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Delete failed.");
      }
      setCleanupResult(null);
      await loadVariants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingSlug(null);
    }
  }

  async function runCleanup(dryRun: boolean) {
    const days = Number(olderThanDays);
    if (!Number.isFinite(days) || days < 1) {
      setError("Enter a positive number of days.");
      return;
    }

    if (
      !dryRun &&
      !globalThis.confirm(
        `Delete all variants older than ${days} days? This cannot be undone.`,
      )
    ) {
      return;
    }

    setCleanupLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        olderThanDays: String(days),
        ...(dryRun ? { dryRun: "true" } : {}),
      });
      const response = await fetch(
        `/api/admin/variants?${params.toString()}`,
        { method: "DELETE" },
      );
      const payload = await response.json() as CleanupResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Cleanup failed.");
      }
      setCleanupResult(payload);
      if (!dryRun) await loadVariants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cleanup failed.");
    } finally {
      setCleanupLoading(false);
    }
  }

  return (
    <div class="space-y-8">
      <section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-white">
          Delete old variants
        </h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Removes variants with <code class="text-xs">created_at</code>{" "}
          older than the cutoff from KV and{" "}
          <code class="text-xs">data/variants/</code>. Variants without a date
          are skipped.
        </p>

        <div class="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Older than (days)
            </label>
            <input
              type="number"
              min="1"
              value={olderThanDays}
              onInput={(e) => setOlderThanDays(e.currentTarget.value)}
              class="mt-1 w-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <button
            type="button"
            disabled={cleanupLoading}
            onClick={() => runCleanup(true)}
            class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={cleanupLoading}
            onClick={() => runCleanup(false)}
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {cleanupLoading ? "Working…" : "Delete old"}
          </button>
        </div>

        {cleanupResult && (
          <div class="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100">
            {cleanupResult.dry_run ? "Preview:" : "Deleted:"}{" "}
            {cleanupResult.deleted_count}{" "}
            variant{cleanupResult.deleted_count === 1 ? "" : "s"}
            {cleanupResult.deleted.length > 0 && (
              <span class="block mt-1 font-mono text-xs">
                {cleanupResult.deleted.join(", ")}
              </span>
            )}
            {cleanupResult.skipped_without_created_at.length > 0 && (
              <span class="block mt-2 text-slate-600 dark:text-slate-400">
                Skipped (no date):{" "}
                {cleanupResult.skipped_without_created_at.join(", ")}
              </span>
            )}
          </div>
        )}
      </section>

      {error && (
        <p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </p>
      )}

      <section>
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">
            All variants ({variants.length})
          </h2>
          <button
            type="button"
            onClick={() => loadVariants()}
            disabled={loading}
            class="text-sm text-teal-600 underline hover:text-teal-700 disabled:opacity-60 dark:text-teal-400"
          >
            Refresh
          </button>
        </div>

        {loading
          ? <p class="mt-4 text-sm text-slate-500">Loading…</p>
          : variants.length === 0
          ? (
            <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No tailored variants yet.
            </p>
          )
          : (
            <div class="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Variant
                    </th>
                    <th class="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Created
                    </th>
                    <th class="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                      Storage
                    </th>
                    <th class="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
                  {variants.map((variant) => (
                    <tr key={variant.slug}>
                      <td class="px-4 py-3">
                        <p class="font-medium text-slate-900 dark:text-white">
                          {variant.label ?? variant.slug}
                        </p>
                        <p class="mt-0.5 font-mono text-xs text-slate-500">
                          {variant.slug}
                        </p>
                        {(variant.target_company || variant.target_role) && (
                          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            {[variant.target_company, variant.target_role]
                              .filter(
                                Boolean,
                              ).join(" · ")}
                          </p>
                        )}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {formatDate(variant.created_at)}
                      </td>
                      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {storageBadges(variant)}
                      </td>
                      <td class="px-4 py-3 text-right whitespace-nowrap">
                        <a
                          href={variant.preview_url}
                          class="text-teal-600 underline hover:text-teal-700 dark:text-teal-400"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          disabled={deletingSlug === variant.slug}
                          onClick={() => deleteVariant(variant.slug)}
                          class="ml-3 text-red-600 underline hover:text-red-700 disabled:opacity-60 dark:text-red-400"
                        >
                          {deletingSlug === variant.slug
                            ? "Deleting…"
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </div>
  );
}
