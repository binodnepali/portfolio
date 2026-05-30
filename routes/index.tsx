import { Handlers, PageProps } from "$fresh/server.ts";

import CvPage from "../components/CvPage.tsx";
import { getProfile } from "../src/server/profile/service.ts";
import { Profile } from "../src/types/Profile.ts";

export const handler: Handlers<Profile> = {
  GET(_req, ctx) {
    return ctx.render(getProfile());
  },
};

export default function Home({ data }: PageProps<Profile>) {
  return <CvPage profile={data} />;
}
