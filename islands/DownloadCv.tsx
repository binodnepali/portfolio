import { IS_BROWSER } from "$fresh/runtime.ts";

export default function DownloadCv() {
  return (
    <button
      type="button"
      onClick={() => globalThis.print()}
      disabled={!IS_BROWSER}
      class="print:hidden inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
    >
      <span class="material-symbols-outlined text-base">download</span>
      Download CV
    </button>
  );
}
