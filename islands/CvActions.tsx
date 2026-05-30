interface CvActionsProps {
  exportHref: string;
}

export default function CvActions({ exportHref }: CvActionsProps) {
  function handlePrint() {
    const previousTitle = document.title;
    document.title = "CV";

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
    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handlePrint}
        class={`${buttonClass} bg-teal-500 text-white hover:bg-teal-600`}
      >
        <span class="material-symbols-outlined text-base">download</span>
        Download CV
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
  );
}
