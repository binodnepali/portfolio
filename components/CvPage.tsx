import { Head } from "$fresh/runtime.ts";

import Navbar from "../islands/Navbar.tsx";
import BioSection from "../components/Bio.tsx";
import ExperienceSection from "../components/Experience.tsx";
import EducationSection from "../components/Education.tsx";
import ProjectsSection from "../components/Projects.tsx";
import SkillsSection from "../components/Skills.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import { Profile } from "../src/types/Profile.ts";

export interface CvVariantMeta {
  slug: string;
  label: string;
  target_company?: string;
  target_role?: string;
}

export default function CvPage(
  { profile, variant }: { profile: Profile; variant?: CvVariantMeta },
) {
  const pageTitle = variant
    ? `${profile.full_name} — ${variant.label}`
    : `${profile.full_name} — ${profile.occupation}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {variant && <meta name="robots" content="noindex" />}
      </Head>

      <header class="print:hidden">
        <Navbar
          github_profile_id={profile.extra.github_profile_id}
          linkedin_profile_id={profile.extra.linkedin_profile_id}
          email={profile.email}
        />
      </header>

      <main class="flex-1 bg-slate-100 dark:bg-slate-900 py-8 print:bg-white print:py-0">
        {variant && (
          <div class="print:hidden mx-auto mb-4 max-w-3xl px-4">
            <div class="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-100">
              <strong>Tailored CV:</strong> {variant.label}
              {" · "}
              <a href="/" class="underline">View default CV</a>
            </div>
          </div>
        )}

        <article class="cv-sheet mx-auto w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 sm:p-10 print:max-w-full print:rounded-none print:p-0 print:shadow-none">
          <BioSection
            job_start_date={profile.job_start_date}
            profile_pic_url={profile.profile_pic_url}
            full_name={profile.full_name}
            occupation={profile.occupation}
            city={profile.city}
            country_full_name={profile.country_full_name}
            email={profile.email}
            github_profile_id={profile.extra.github_profile_id}
            linkedin_profile_id={profile.extra.linkedin_profile_id}
            summary={profile.summary}
          />

          <ExperienceSection experiences={profile.experiences} />

          <EducationSection educations={profile.education} />

          <ProjectsSection projects={profile.accomplishment_projects} />

          <SkillsSection skills={profile.skills} />
        </article>
      </main>

      <div class="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
