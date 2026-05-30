import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

import Navbar from "../islands/Navbar.tsx";
import BioSection from "../components/Bio.tsx";
import ExperienceSection from "../components/Experience.tsx";
import EducationSection from "../components/Education.tsx";
import ProjectsSection from "../components/Projects.tsx";
import SkillsSection from "../components/Skills.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import { getProfile } from "../src/server/profile/service.ts";
import { Profile } from "../src/types/Profile.ts";

export const handler: Handlers<Profile> = {
  GET(_req, ctx) {
    return ctx.render(getProfile());
  },
};

export default function Home({ data }: PageProps<Profile>) {
  return (
    <>
      <Head>
        <title>{`${data.full_name} — ${data.occupation}`}</title>
      </Head>

      <header class="print:hidden">
        <Navbar
          github_profile_id={data.extra.github_profile_id}
          linkedin_profile_id={data.extra.linkedin_profile_id}
          email={data.email}
        />
      </header>

      <main class="flex-1 bg-slate-100 dark:bg-slate-900 py-8 print:bg-white print:py-0">
        <article class="cv-sheet mx-auto w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 sm:p-10 print:max-w-full print:rounded-none print:p-0 print:shadow-none">
          <BioSection
            job_start_date={data.job_start_date}
            profile_pic_url={data.profile_pic_url}
            full_name={data.full_name}
            occupation={data.occupation}
            city={data.city}
            country_full_name={data.country_full_name}
            email={data.email}
            github_profile_id={data.extra.github_profile_id}
            linkedin_profile_id={data.extra.linkedin_profile_id}
            summary={data.summary}
          />

          <ExperienceSection experiences={data.experiences} />

          <EducationSection educations={data.education} />

          <ProjectsSection projects={data.accomplishment_projects} />

          <SkillsSection skills={data.skills} />
        </article>
      </main>

      <div class="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
