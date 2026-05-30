import { Profile } from "../../types/Profile.ts";
import profileData from "../../../data/linkedin-profile.json" with {
  type: "json",
};
import { applyVariant, loadVariant } from "./variant.ts";

export function getMasterProfile(): Profile {
  return profileData as Profile;
}

/** Default homepage CV (master profile, respects include_in_cv flags). */
export function getProfile(): Profile {
  return getMasterProfile();
}

/** Tailored CV for a saved variant under data/variants/. */
export async function getTailoredProfile(
  slug: string,
): Promise<Profile | null> {
  const variant = await loadVariant(slug);
  if (!variant) return null;
  return applyVariant(getMasterProfile(), variant);
}
