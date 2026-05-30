import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import TailorCvForm from "../../islands/TailorCvForm.tsx";
import TailorUnauthorized from "../../components/TailorUnauthorized.tsx";
import {
  authorizeTailorRequest,
  isTailorApiConfigured,
} from "../../src/server/profile/tailorAuth.ts";

interface AdminTailorData {
  authorized: boolean;
}

export const handler: Handlers<AdminTailorData> = {
  GET(req, ctx) {
    if (!isTailorApiConfigured() || !authorizeTailorRequest(req)) {
      return ctx.render({ authorized: false }, { status: 401 });
    }
    return ctx.render({ authorized: true });
  },
};

export default function AdminTailorPage({ data }: PageProps<AdminTailorData>) {
  if (!data.authorized) {
    return <TailorUnauthorized />;
  }

  return (
    <>
      <Head>
        <title>Create a tailored CV</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main class="mx-auto max-w-lg px-4 py-12">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          Create a tailored CV
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Upload a job posting and we'll prepare a CV version matched to that
          role. When it's ready, you can review it on screen and print or save
          it as a PDF from your browser.
        </p>

        <div class="mt-8">
          <TailorCvForm />
        </div>
      </main>
    </>
  );
}
