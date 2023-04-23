import { Head } from "$fresh/runtime.ts";
import Navbar from "../islands/Navbar.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Portfolio - Binod Nepali</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <header>
        <Navbar />
      </header>
    </>
  );
}
