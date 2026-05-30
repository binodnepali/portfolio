import { AccomplishmentProject } from "../src/types/Profile.ts";
import Section from "./cv/Section.tsx";
import { formatYearRange } from "../src/utils/date.ts";

export default function ProjectsSection(
  { projects }: { projects: AccomplishmentProject[] },
) {
  if (projects.length === 0) return null;

  // Projects with include_in_cv === false stay on the site but are excluded
  // from the printed CV. If none are included, hide the whole section in print
  // so the PDF doesn't show an empty "Projects" heading.
  const cvProjectCount =
    projects.filter((p) => p.include_in_cv !== false).length;

  return (
    <Section
      title="Projects"
      class={cvProjectCount === 0 ? "print:hidden" : ""}
    >
      <div class="flex flex-col gap-4">
        {projects.map((project, i) => {
          const hiddenInCv = project.include_in_cv === false;
          return (
            <div
              class={`cv-entry ${hiddenInCv ? "print:hidden" : ""}`.trim()}
              key={i}
            >
              <div class="flex items-baseline justify-between gap-4">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white">
                  {project.title}
                  {hiddenInCv && (
                    <span class="print:hidden ml-2 rounded-full border border-slate-300 px-2 py-0.5 align-middle text-[10px] font-normal uppercase tracking-wide text-slate-400 dark:border-slate-600">
                      Not in CV
                    </span>
                  )}
                </h3>
                <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {formatYearRange(project.starts_at, project.ends_at)}
                </span>
              </div>
              {project.description && (
                <p class="mt-1 text-sm whitespace-pre-line text-slate-700 dark:text-slate-200">
                  {project.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
