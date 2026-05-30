import Navbar from "../islands/Navbar.tsx";
import BioSection from "../components/Bio.tsx";
import ExperienceSection from "../components/Experience.tsx";
import EducationSection from "../components/Education.tsx";
import SiteFooter from "../components/SiteFooter.tsx";

import data from "../data/linkedin-profile.json" with {
  type: "json",
};

// import { getProfile } from "../src/server/getProfile.ts";

export default function Home() {
  //const data = await getProfile();

  return (
    <>
      <header>
        <Navbar
          github_profile_id={data.extra.github_profile_id}
          linkedin_profile_id={data.extra.linkedin_profile_id}
          email={data.email}
        />
      </header>

      <main className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-4 w-full md:w-3/5">
            <BioSection
              birth_date={data.birth_date}
              job_start_date={data.job_start_date}
              profile_pic_url={data.profile_pic_url}
              full_name={data.full_name}
              city={data.city}
              country_full_name={data.country_full_name}
              nationality={data.nationality}
              occupation={data.occupation}
              summary={data.summary}
            />

            <ExperienceSection experiences={data.experiences} />

            <EducationSection educations={data.education} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
