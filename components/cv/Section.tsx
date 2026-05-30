import { ComponentChildren } from "preact";

export default function Section(
  { title, children, class: className = "", keepTogether = false }: {
    title: string;
    children: ComponentChildren;
    class?: string;
    /** Keep the whole section on one page when printing (short sections). */
    keepTogether?: boolean;
  },
) {
  const keepClass = keepTogether ? "cv-section-keep" : "";
  return (
    <section class={`cv-section mt-8 ${keepClass} ${className}`.trim()}>
      <div class="cv-section-heading">
        <h2 class="text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
          {title}
        </h2>
        <div class="mt-1 border-b border-slate-300 dark:border-slate-600" />
      </div>
      <div class="cv-section-body mt-4">{children}</div>
    </section>
  );
}
