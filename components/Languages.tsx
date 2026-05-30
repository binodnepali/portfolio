import Section from "./cv/Section.tsx";

export default function LanguagesSection(
  { languages }: { languages: string[] },
) {
  if (languages.length === 0) return null;

  return (
    <Section title="Languages" keepTogether>
      <p class="text-sm text-slate-700 dark:text-slate-200">
        {languages.join(" · ")}
      </p>
    </Section>
  );
}
