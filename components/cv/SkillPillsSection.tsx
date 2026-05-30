import { Skill } from "../../src/types/Profile.ts";
import Section from "./Section.tsx";

export default function SkillPillsSection(
  { title, skills }: { title: string; skills: Skill[] },
) {
  if (skills.length === 0) return null;

  const cvCount = skills.filter((s) => s.include_in_cv !== false).length;

  return (
    <Section
      title={title}
      keepTogether
      class={cvCount === 0 ? "print:hidden" : ""}
    >
      <ul class="cv-pill-list flex flex-wrap gap-2">
        {skills.map((skill) => {
          const hiddenInCv = skill.include_in_cv === false;
          return (
            <li
              key={skill.name}
              title={hiddenInCv ? "Not included in CV" : undefined}
              class={`rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 ${
                hiddenInCv ? "opacity-50 print:hidden" : ""
              }`.trim()}
            >
              {skill.name.trim()}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
