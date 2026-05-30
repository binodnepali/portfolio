import { Education } from "../src/types/Profile.ts";
import Section from "./cv/Section.tsx";

export default function EducationSection(
  { educations }: { educations: Education[] },
) {
  if (educations.length === 0) return null;

  return (
    <Section title="Education" keepTogether>
      <div class="flex flex-col gap-4">
        {educations.map((education, i) => (
          <div class="cv-entry" key={i}>
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                {education.school}
              </h3>
              <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                {`${education.starts_at.year} – ${education.ends_at.year}`}
              </span>
            </div>
            <p class="text-sm text-slate-700 dark:text-slate-200">
              {education.degree_name}
              {education.field_of_study ? ` · ${education.field_of_study}` : ""}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
