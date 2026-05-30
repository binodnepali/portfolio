import { IS_BROWSER } from "$fresh/runtime.ts";

export default function DownloadCv() {
  function handlePrint() {
    if (!IS_BROWSER) return;

    const previousTitle = document.title;
    document.title = "CV";

    const restoreTitle = () => {
      document.title = previousTitle;
      globalThis.removeEventListener("afterprint", restoreTitle);
    };
    globalThis.addEventListener("afterprint", restoreTitle);

    globalThis.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={!IS_BROWSER}
      class="print:hidden inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
    >
      <span class="material-symbols-outlined text-base">download</span>
      Download CV
    </button>
  );
}
