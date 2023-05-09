import { Head } from "$fresh/runtime.ts";
import Navbar from "../islands/Navbar.tsx";

export default function Home() {
  return (
    <html class="h-full">
      <Head>
        <title>Portfolio - Binod Nepali</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>

      <body class="min-h-full flex flex-col bg-background-on-light">
        <header>
          <Navbar />
        </header>

        <main class="container mx-auto px-4">
          <h1 class="text-4xl font-bold">Binod Nepali</h1>
          <p class="text-2xl font-semibold">Software Engineer</p>
        </main>

        <footer class="mt-auto">
          <div class="container mx-auto p-4">
            <p class="text-center">
              &copy; {new Date().getFullYear()} Binod Nepali
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
