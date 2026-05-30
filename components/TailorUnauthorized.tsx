import { Head } from "$fresh/runtime.ts";

export default function TailorUnauthorized() {
  return (
    <>
      <Head>
        <title>Not available</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main class="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          This page isn't available
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          This is a private page. You need the right setup in your browser
          before you can open it.
        </p>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          If you were expecting to see the CV tool, check that your header rule
          is turned on for this site, then refresh.
        </p>
        <a
          href="/"
          class="mt-8 inline-block text-sm text-teal-600 underline hover:text-teal-700 dark:text-teal-400"
        >
          Back to homepage
        </a>
      </main>
    </>
  );
}
