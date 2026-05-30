import { BirthDate } from "../src/types/Profile.ts";
import CvActions from "../islands/CvActions.tsx";
import Section from "./cv/Section.tsx";

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function BioSection(
  {
    job_start_date,
    profile_pic_url,
    full_name,
    occupation,
    city,
    country_full_name,
    email,
    github_profile_id,
    linkedin_profile_id,
    summary,
    exportHref,
  }: {
    job_start_date: BirthDate;
    profile_pic_url: string;
    full_name: string;
    occupation: string;
    city: string;
    country_full_name: string;
    email: string;
    github_profile_id: string;
    linkedin_profile_id: string;
    summary: string;
    exportHref: string;
  },
) {
  const yearOfExperience = new Date().getFullYear() - job_start_date.year;

  return (
    <header class="cv-section cv-bio">
      <div class="flex flex-col items-start gap-6 sm:flex-row">
        <img
          src={profile_pic_url}
          loading="eager"
          height="112"
          width="112"
          alt={full_name}
          class="print:hidden h-28 w-28 shrink-0 rounded-full object-cover"
        />

        <div class="flex-1">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            {full_name}
          </h1>
          <p class="mt-1 text-lg text-slate-600 dark:text-slate-300">
            {occupation}
          </p>

          <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
            <li>{`${city}, ${country_full_name}`}</li>
            <li>
              <a class="hover:text-teal-500" href={`mailto:${email}`}>
                {email}
              </a>
            </li>
            <li>
              <a
                class="hover:text-teal-500"
                href={linkedin_profile_id}
                target="_blank"
                rel="noreferrer"
              >
                {stripProtocol(linkedin_profile_id)}
              </a>
            </li>
            <li>
              <a
                class="hover:text-teal-500"
                href={github_profile_id}
                target="_blank"
                rel="noreferrer"
              >
                {stripProtocol(github_profile_id)}
              </a>
            </li>
          </ul>

          <div class="mt-4">
            <CvActions
              exportHref={exportHref}
              pdfFileName={`${full_name.replace(/\s+/g, "-")}-CV`}
            />
          </div>
        </div>
      </div>

      <Section title="Summary">
        <p class="text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
          {summary.replace("{{year_of_experience}}", `${yearOfExperience}`)}
        </p>
      </Section>
    </header>
  );
}
