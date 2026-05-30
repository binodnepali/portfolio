import CopyCoverLetter from "../islands/CopyCoverLetter.tsx";
import CoverLetterSavePdf from "../islands/CoverLetterSavePdf.tsx";
import { Profile } from "../src/types/Profile.ts";
import { normalizeCoverLetterContent } from "../src/utils/coverLetter.ts";

interface CoverLetterPreviewProps {
  profile: Profile;
  salutation?: string;
  body: string;
  exportHref: string;
  pdfFileName: string;
  targetCompany?: string;
}

function buildPlainText(
  profile: Profile,
  salutation: string,
  body: string,
): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return [
    profile.full_name,
    `${profile.city}, ${profile.country_full_name}`,
    profile.email,
    "",
    date,
    "",
    salutation,
    "",
    body.trim(),
    "",
    "Kind regards,",
    profile.full_name,
  ].join("\n");
}

export default function CoverLetterPreview(
  { profile, salutation, body, exportHref, pdfFileName, targetCompany }:
    CoverLetterPreviewProps,
) {
  const { salutation: opening, body: letterBody } = normalizeCoverLetterContent(
    salutation,
    body,
  );
  const plainText = buildPlainText(profile, opening, letterBody);
  const paragraphs = letterBody.split(/\n\s*\n/).map((p) => p.trim()).filter(
    Boolean,
  );

  return (
    <section class="cover-letter-preview print:hidden mx-auto mb-6 w-full max-w-3xl px-4 sm:px-0">
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div class="print:hidden flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
              Cover letter
              {targetCompany && (
                <span class="font-normal text-slate-500 dark:text-slate-400">
                  · {targetCompany}
                </span>
              )}
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Generated for this application. Review before sending.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <CoverLetterSavePdf pdfFileName={pdfFileName} />
            <CopyCoverLetter text={plainText} />
            <a
              href={exportHref}
              download
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <span class="material-symbols-outlined text-base">
                description
              </span>
              Export to Docs
            </a>
          </div>
        </div>

        <p class="print:hidden mt-3 text-xs text-slate-500 dark:text-slate-400">
          Save as PDF uses the print dialog — turn off{" "}
          <strong>Headers and footers</strong> for a clean file.
        </p>

        <article class="cover-letter-sheet mt-6 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-800 dark:border-slate-600 dark:text-slate-100">
          <p class="font-medium">{profile.full_name}</p>
          <p class="text-slate-600 dark:text-slate-300">
            {profile.city}, {profile.country_full_name}
          </p>
          <p class="text-slate-600 dark:text-slate-300">{profile.email}</p>

          <p class="mt-4 text-slate-600 dark:text-slate-300">
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p class="mt-4">{opening}</p>

          <div class="mt-4 space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p key={i} class="text-justify">{paragraph}</p>
            ))}
          </div>

          <p class="mt-6">Kind regards,</p>
          <p class="mt-2 font-medium">{profile.full_name}</p>
        </article>
      </div>
    </section>
  );
}
