import { Profile } from "../../types/Profile.ts";
import profileData from "../../../data/linkedin-profile.json" with {
  type: "json",
};

export function getProfile(): Profile {
  return profileData as Profile;
}
