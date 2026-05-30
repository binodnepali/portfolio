import { Link } from "./ui/Link.tsx";

export default function SiteFooter() {
  return (
    <footer class="mt-auto">
      <div class="container mx-auto p-4">
        <p class="text-center text-sm text-slate-600 dark:text-slate-300">
          <Link href="/calendar" class="text-teal-500 hover:underline">
            Nepali calendar feed
          </Link>
          <span class="mx-2 opacity-50">·</span>
          &copy; {new Date().getFullYear()} Binod Nepali
        </p>
      </div>
    </footer>
  );
}
