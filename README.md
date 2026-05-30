# Portfolio

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

My [portfolio website](https://binodnepali.me/) build using
[fresh](https://fresh.deno.dev/) a full stack framework for
[deno](https://deno.land/) and [Tailwindcss](https://tailwindcss.com/).

This site is deployed using [deno deploy](https://docs.deno.com/deploy/manual).

## Before getting started

Make sure you have installed [deno 2.4](https://docs.deno.com/runtime/manual) or
higher in your machine.

### Cloning repo

```bash
# https
git clone https://github.com/binodnepali/portfolio.git

# ssh
git clone git@github.com:binodnepali/portfolio.git
```

### Navigate to cloned repo

```bash
cd portfolio
```

### Usage

#### Start the project

```bash
deno task start
```

This will watch the project directory and restart as necessary.

#### Build the project

```bash
deno task build
```

#### Preview the project

```bash
deno task preview
```

#### Update the project

```bash
deno task update
```

Profile content lives in
[`data/linkedin-profile.json`](data/linkedin-profile.json). Edit that file
directly when you update your LinkedIn information.

#### Tailored CVs

Create a job-specific CV with Gemini, then preview at `/cv/<slug>` and print to
PDF from the browser.

**Setup**

```bash
cp .env.sample .env
```

| Variable            | Where to get it                                                 |
| ------------------- | --------------------------------------------------------------- |
| `GEMINI_API_KEY`    | [Google AI Studio](https://aistudio.google.com/apikey)          |
| `TAILOR_CV_API_KEY` | Run `openssl rand -base64 32` — store the output as base64 text |

Set the same variables in the Deno Deploy dashboard for production.

**CLI**

```bash
deno task tailor-cv -- --slug acme-senior-frontend --job ./jobs/acme.txt
```

Put job descriptions in `jobs/` (gitignored). Useful flags:

- `--catalog` — list stable experience/project/skill ids
- `--dry-run` — print JSON without saving

**Browser upload** — `/admin/tailor`

Private page (not linked from the site). Access is controlled by the `X-API-Key`
header — there is no password field on the page.

1. In a browser extension such as [Requestly](https://requestly.com/), add a
   **Modify Headers** rule for your site URL (e.g. `http://localhost:8000/*` and
   `https://binodnepali.me/*`).
2. Set header `X-API-Key` to your base64 `TAILOR_CV_API_KEY` value.
3. Visit `/admin/tailor` — upload a `.txt` or `.md` job posting and create the
   CV.

Without the header, the page shows an unauthorized message instead of the form.

**HTTP API** — for scripts or tools

```bash
curl -X POST http://localhost:8000/api/cv/tailor \
  -H "X-API-Key: $TAILOR_CV_API_KEY" \
  -F "file=@./jobs/acme.txt" \
  -F "slug=acme-senior-frontend"
```

**Storage**

Variants are saved to Deno KV in production. Locally they are also written to
`data/variants/` when the filesystem is writable. Tailored CV pages are
`noindex` and not linked from the public navigation.

#### Generate release

> Make sure you have npm version 5.2.0 or higher

```bash
npx commit-and-tag-version
```

Learn more about
[it](https://github.com/absolute-version/commit-and-tag-version)
