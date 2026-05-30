import { Handlers, PageProps } from "$fresh/server.ts";

import CvPage, { CvVariantMeta } from "../../components/CvPage.tsx";
import { getProfileForVariant } from "../../src/server/profile/variant.ts";
import { Profile } from "../../src/types/Profile.ts";

interface TailoredCvData {
  profile: Profile;
  variant: CvVariantMeta;
}

export const handler: Handlers<TailoredCvData | null> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const result = await getProfileForVariant(slug);
    if (!result) return ctx.render(null, { status: 404 });
    return ctx.render({
      profile: result.profile,
      variant: {
        slug: result.variant.slug,
        label: result.variant.label,
        target_company: result.variant.target_company,
        target_role: result.variant.target_role,
      },
    });
  },
};

export default function TailoredCvPage(
  { data }: PageProps<TailoredCvData | null>,
) {
  if (!data) {
    return (
      <main class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-2xl font-bold">CV not found</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-300">
          No tailored variant exists at this URL.
        </p>
        <a href="/" class="mt-4 inline-block text-teal-500 underline">
          Back to default CV
        </a>
      </main>
    );
  }

  return <CvPage profile={data.profile} variant={data.variant} />;
}
