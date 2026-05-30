# Portfolio

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

My [portfolio website](https://binodnepali.me/) build using
[fresh](https://fresh.deno.dev/) a full stack framework for
[deno](https://deno.land/) and [Tailwindcss](https://tailwindcss.com/).

This site is deployed using [deno deploy](https://docs.deno.com/deploy/manual).

## Before getting started

Make sure you have installed [deno 1.39.1](https://docs.deno.com/runtime/manual)
or higher in your machine.

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

Profile content lives in [`data/linkedin-profile.json`](data/linkedin-profile.json).
Edit that file directly (or replace it from an external export) when you update
your LinkedIn information.

#### Generate release

> Make sure you have npm version 5.2.0 or higher

```bash
npx commit-and-tag-version
```

Learn more about
[it](https://github.com/absolute-version/commit-and-tag-version)
