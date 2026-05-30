import { useState } from "preact/hooks";

interface CopyCoverLetterProps {
  text: string;
}

export default function CopyCoverLetter({ text }: CopyCoverLetterProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      class="print:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
    >
      <span class="material-symbols-outlined text-base">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Copied" : "Copy text"}
    </button>
  );
}
