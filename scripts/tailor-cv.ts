import { parseArgs } from "$std/cli/parse_args.ts";
import { buildProfileCatalog } from "../src/server/profile/variant.ts";
import { getMasterProfile } from "../src/server/profile/service.ts";
import {
  generateVariant,
  writeVariant,
} from "../src/server/profile/tailorLlm.ts";
import { ProfileVariant } from "../src/types/ProfileVariant.ts";

const usage = `
Usage:
  deno task tailor-cv -- --slug <company-role> --job <path-to-job.txt>
  deno task tailor-cv -- --slug <company-role> --job-text "paste job description"
  deno task tailor-cv -- --catalog

Options:
  --slug       URL-safe id (e.g. acme-senior-frontend). File: data/variants/<slug>.json
  --job        Path to a text file with the job description
  --job-text   Job description as a string (alternative to --job)
  --catalog    Print master profile ids for experiences/projects/skills
  --dry-run    Print generated JSON without writing a file
`;

async function readJobDescription(args: {
  job?: string;
  jobText?: string;
}): Promise<string> {
  if (args.jobText) return args.jobText;
  if (args.job) return await Deno.readTextFile(args.job);
  throw new Error('Provide --job <file> or --job-text "..."');
}

function slugifySlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function cliArgs(): string[] {
  const args = [...Deno.args];
  while (args[0] === "--") args.shift();
  return args;
}

if (import.meta.main) {
  const args = parseArgs(cliArgs(), {
    string: ["slug", "job", "job-text"],
    boolean: ["catalog", "dry-run", "help"],
    alias: { h: "help" },
  });

  if (args.help) {
    console.log(usage.trim());
    Deno.exit(0);
  }

  if (args.catalog) {
    const catalog = buildProfileCatalog(getMasterProfile());
    console.log(JSON.stringify(catalog, null, 2));
    Deno.exit(0);
  }

  if (!args.slug) {
    console.error("Missing --slug\n");
    console.error(usage.trim());
    Deno.exit(1);
  }

  const slug = slugifySlug(args.slug);
  const jobDescription = await readJobDescription({
    job: args.job,
    jobText: args["job-text"],
  });

  console.log(`Generating tailored variant "${slug}"...`);
  const variant: ProfileVariant = await generateVariant(
    slug,
    jobDescription,
  );

  if (args["dry-run"]) {
    console.log(JSON.stringify(variant, null, 2));
    Deno.exit(0);
  }

  const path = await writeVariant(variant);
  console.log(`Wrote ${path}`);
  console.log(`Preview: /cv/${slug}`);
  console.log(
    `Review the JSON, adjust if needed, then print PDF from the page.`,
  );
}
