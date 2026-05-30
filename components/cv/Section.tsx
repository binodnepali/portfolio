import { ComponentChildren } from "preact";

export default function Section(
  { title, children, class: className = "" }: {
    title: string;
    children: ComponentChildren;
    class?: string;
  },
) {
  return (
    <section class={`cv-section mt-8 ${className}`.trim()}>
      <h2 class="text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
        {title}
      </h2>
      <div class="mt-1 border-b border-slate-300 dark:border-slate-600" />
      <div class="mt-4">{children}</div>
    </section>
  );
}
