import { Skill } from "../src/types/Profile.ts";
import SkillPillsSection from "./cv/SkillPillsSection.tsx";

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  return <SkillPillsSection title="Technical skills" skills={skills} />;
}
