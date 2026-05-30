import { Experience } from "../src/types/Profile.ts";
import Section from "./cv/Section.tsx";
import { formatDuration, formatMonthYear } from "../src/utils/date.ts";

interface CompanyGroup {
  company: string;
  location: string;
  roles: Experience[];
}

function RoleBlock({ role }: { role: Experience }) {
  return (
    <>
      <div class="flex items-baseline justify-between gap-4">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          {role.title}
        </p>
        <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
          {`${formatMonthYear(role.starts_at)} – ${
            formatMonthYear(role.ends_at)
          }`}
        </span>
      </div>
      {role.employment_type && (
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {role.employment_type}
        </p>
      )}
      {role.description && (
        <p class="mt-1 text-sm whitespace-pre-line text-slate-700 dark:text-slate-200">
          {role.description}
        </p>
      )}
      {role.skills && role.skills.length > 0 && (
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span class="font-semibold">Skills:</span> {role.skills.map((s) =>
            s.trim()
          ).join(", ")}
        </p>
      )}
    </>
  );
}

export default function ExperienceSection(
  { experiences }: { experiences: Experience[] },
) {
  const groups = experiences.reduce<CompanyGroup[]>((acc, exp) => {
    const group = acc.find((g) => g.company === exp.company);
    if (group) {
      group.roles.push(exp);
    } else {
      acc.push({
        company: exp.company,
        location: exp.location,
        roles: [exp],
      });
    }
    return acc;
  }, []);

  return (
    <Section title="Experience">
      <div class="cv-experience-list flex flex-col gap-3">
        {groups.map((group, i) => (
          <div class="cv-company-group flex flex-col gap-3" key={i}>
            {group.roles.map((role, j) => {
              const earliest = group.roles[group.roles.length - 1];
              const latest = group.roles[0];
              return (
                <div class="cv-entry" key={`${i}-${j}`}>
                  {j === 0 && (
                    <>
                      <div class="flex items-baseline justify-between gap-4">
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">
                          {group.company}
                        </h3>
                        <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          {formatDuration(earliest.starts_at, latest.ends_at)}
                        </span>
                      </div>
                      {group.location && (
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                          {group.location}
                        </p>
                      )}
                    </>
                  )}
                  <div class={j === 0 ? "mt-2" : ""}>
                    <RoleBlock role={role} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Section>
  );
}
