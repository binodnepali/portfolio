import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

interface CvActionsProps {
  exportHref: string;
  pdfFileName: string;
}

interface Html2PdfWorker {
  set(options: Record<string, unknown>): Html2PdfWorker;
  from(element: HTMLElement): Html2PdfWorker;
  save(): Promise<void>;
}

type Html2PdfFactory = () => Html2PdfWorker;

const HTML2PDF_SCRIPT =
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";

let html2pdfLoad: Promise<Html2PdfFactory> | null = null;

/** Load prebuilt browser bundle — avoids Fresh/esbuild pulling html2canvas from esm.sh. */
function loadHtml2Pdf(): Promise<Html2PdfFactory> {
  if (html2pdfLoad) return html2pdfLoad;

  html2pdfLoad = new Promise((resolve, reject) => {
    const win = globalThis as typeof globalThis & {
      html2pdf?: Html2PdfFactory;
    };

    if (typeof win.html2pdf === "function") {
      resolve(win.html2pdf);
      return;
    }

    const script = document.createElement("script");
    script.src = HTML2PDF_SCRIPT;
    script.async = true;
    script.onload = () => {
      if (typeof win.html2pdf === "function") {
        resolve(win.html2pdf);
        return;
      }
      html2pdfLoad = null;
      reject(new Error("PDF library failed to initialize"));
    };
    script.onerror = () => {
      html2pdfLoad = null;
      reject(new Error("Failed to load PDF library"));
    };
    document.head.appendChild(script);
  });

  return html2pdfLoad;
}

export default function CvActions({ exportHref, pdfFileName }: CvActionsProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownloadPdf() {
    if (!IS_BROWSER) return;

    const sheet = document.querySelector(".cv-sheet");
    if (!(sheet instanceof HTMLElement)) return;

    setBusy(true);
    setError(null);
    document.documentElement.classList.add("cv-export-mode");

    try {
      const html2pdf = await loadHtml2Pdf();
      await html2pdf()
        .set({
          margin: [12, 12, 10, 12],
          filename: `${pdfFileName}.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, logging: false, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: [".cv-entry", ".cv-section-keep", ".cv-section-heading"],
          },
        })
        .from(sheet)
        .save();
    } catch (err) {
      console.error(err);
      setError("Could not generate PDF. Try Print instead.");
    } finally {
      document.documentElement.classList.remove("cv-export-mode");
      setBusy(false);
    }
  }

  function handlePrint() {
    globalThis.print();
  }

  const buttonClass =
    "print:hidden inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors";

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={busy}
          class={`${buttonClass} bg-teal-500 text-white hover:bg-teal-600 disabled:cursor-wait disabled:opacity-70`}
        >
          <span class="material-symbols-outlined text-base">
            {busy ? "hourglass_empty" : "download"}
          </span>
          {busy ? "Generating PDF…" : "Download CV"}
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
      {error && (
        <p class="print:hidden text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <p class="print:hidden text-xs text-slate-500 dark:text-slate-400">
        PDF download has no browser headers.{" "}
        <button
          type="button"
          onClick={handlePrint}
          class="underline hover:text-teal-600 dark:hover:text-teal-400"
        >
          Print
        </button>{" "}
        instead? Turn off <strong>Headers and footers</strong>{" "}
        in the print dialog.
      </p>
    </div>
  );
}
