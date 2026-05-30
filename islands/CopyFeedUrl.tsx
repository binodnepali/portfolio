import { useState } from "preact/hooks";

import { Button } from "../components/ui/Button.tsx";

export default function CopyFeedUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      class="shrink-0 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
