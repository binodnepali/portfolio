import { Head } from "$fresh/runtime.ts";
import Bio from "../islands/Bio.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Portfolio - Binod Nepali</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <p class="my-6">
          Welcome to my portfolio build with `fresh`. I am still working on it.
        </p>

        <Bio />
      </div>
    </>
  );
}
