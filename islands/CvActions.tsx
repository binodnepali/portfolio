import { IS_BROWSER } from "$fresh/runtime.ts";

interface CvActionsProps {
  exportHref: string;
  pdfFileName: string;
}

export default function CvActions({ exportHref, pdfFileName }: CvActionsProps) {
  function handleSavePdf() {
    if (!IS_BROWSER) return;

    const previousTitle = document.title;
    document.title = pdfFileName;

    const restoreTitle = () => {
      document.title = previousTitle;
      globalThis.removeEventListener("afterprint", restoreTitle);
    };
    globalThis.addEventListener("afterprint", restoreTitle);

    globalThis.print();
  }

  const buttonClass =
    "print:hidden inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors";

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSavePdf}
          class={`${buttonClass} bg-teal-500 text-white hover:bg-teal-600`}
        >
          <span class="material-symbols-outlined text-base">
            picture_as_pdf
          </span>
          Save as PDF
        </button>
        <a
          href={exportHref}
          download
          class={`${buttonClass} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
        >
          <span class="material-symbols-outlined text-base">description</span>
          Export to Docs
        </a>
      </div>
      <p class="print:hidden text-xs text-slate-500 dark:text-slate-400">
        In the print dialog: choose <strong>Save as PDF</strong>, then turn off
        {" "}
        <strong>Headers and footers</strong>{" "}
        under More settings (Chrome) or untick header/footer options (Safari).
      </p>
    </div>
  );
}
