# Portfolio

My [portfolio website](https://binodnepali.me/) build using [Nuxt 3](https://v3.nuxtjs.org/) and [OpenProps](https://open-props.style/). And It also makes use of [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) & [SCSS/SASS](https://sass-lang.com/) for styling website.

## Before getting started

Make sure you have installed [Node.js 16.11.0 or higher](https://nodejs.org/en/) on your machine. You can use [nvm](https://github.com/nvm-sh/nvm) to manage multiple node version on your machine.

## Getting started

You can setup this project using npm or yarn package managers.

> I would recommend to installed or enabled [yarn 3.1.1 or higher](https://yarnpkg.com/getting-started) package manager on your machine.

### Clone repo

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

## Setup

### Install app dependencies

```bash
# npm
npm install

# yarn
yarn install
```

### Run app in development

```bash
# npm
npm run dev

# yarn
yarn dev
```

> Start development server on <http://localhost:3000>

### Build app for production

```bash
# npm
npm run build

# yarn
yarn build
```

### Preview for production

```bash
# npm
npm run start

# yarn
yarn start
```

> Start preview server on <http://localhost:3000>

### Deploy to firebase hosting

```bash
# npm
NITRO_PRESET=firebase npm run build
firebase deploy

# yarn
NITRO_PRESET=firebase yarn build
firebase deploy
```

### Reference

* Deployment in firebase hosting - [Learn more](https://v3.nuxtjs.org/docs/deployment/firebase)
