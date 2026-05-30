import {
  AccomplishmentProject,
  Experience,
} from "../../types/Profile.ts";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function experienceId(exp: Experience): string {
  if (exp.id) return exp.id;
  return `${slugify(exp.company)}-${slugify(exp.title)}-${exp.starts_at.year}`;
}

export function projectId(project: AccomplishmentProject): string {
  if (project.id) return project.id;
  return slugify(project.title);
}
