import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import AdminVariantsPanel from "../../islands/AdminVariantsPanel.tsx";
import TailorUnauthorized from "../../components/TailorUnauthorized.tsx";
import {
  authorizeTailorRequest,
  isTailorApiConfigured,
} from "../../src/server/profile/tailorAuth.ts";

interface AdminVariantsData {
  authorized: boolean;
}

export const handler: Handlers<AdminVariantsData> = {
  GET(req, ctx) {
    if (!isTailorApiConfigured() || !authorizeTailorRequest(req)) {
      return ctx.render({ authorized: false }, { status: 401 });
    }
    return ctx.render({ authorized: true });
  },
};

export default function AdminVariantsPage(
  { data }: PageProps<AdminVariantsData>,
) {
  if (!data.authorized) {
    return <TailorUnauthorized />;
  }

  return (
    <>
      <Head>
        <title>Manage tailored CVs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main class="mx-auto max-w-4xl px-4 py-12">
        <nav class="mb-6 flex flex-wrap gap-4 text-sm">
          <a
            href="/admin/tailor"
            class="text-teal-600 underline hover:text-teal-700 dark:text-teal-400"
          >
            Create tailored CV
          </a>
          <span class="text-slate-400">Manage variants</span>
        </nav>

        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Manage tailored CVs
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          List and delete job-specific CV variants stored in Deno KV and{" "}
          <code class="text-xs">data/variants/</code>.
        </p>

        <div class="mt-8">
          <AdminVariantsPanel />
        </div>
      </main>
    </>
  );
}
