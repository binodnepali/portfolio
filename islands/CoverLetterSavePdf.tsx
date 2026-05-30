import { IS_BROWSER } from "$fresh/runtime.ts";

interface CoverLetterSavePdfProps {
  pdfFileName: string;
}

export default function CoverLetterSavePdf(
  { pdfFileName }: CoverLetterSavePdfProps,
) {
  function handleSavePdf() {
    if (!IS_BROWSER) return;

    const previousTitle = document.title;
    document.title = pdfFileName;
    document.documentElement.classList.add("cover-letter-print-mode");

    const cleanup = () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("cover-letter-print-mode");
      globalThis.removeEventListener("afterprint", cleanup);
    };
    globalThis.addEventListener("afterprint", cleanup);

    globalThis.print();
  }

  return (
    <button
      type="button"
      onClick={handleSavePdf}
      class="print:hidden inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
    >
      <span class="material-symbols-outlined text-base">picture_as_pdf</span>
      Save as PDF
    </button>
  );
}
