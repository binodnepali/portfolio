import { Skill } from "../src/types/Profile.ts";
import SkillPillsSection from "./cv/SkillPillsSection.tsx";

export default function CoreStrengthsSection(
  { softSkills }: { softSkills: Skill[] },
) {
  return <SkillPillsSection title="Core strengths" skills={softSkills} />;
}
