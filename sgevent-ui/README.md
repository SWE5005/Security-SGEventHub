# SG Event Hub - Web

This folder contains the source code for the SG Event Hub web server. The web server uses a React-based static site
generation framework called Gatsby.

Read more about Gatsby: https://www.gatsbyjs.com/

## Quickstart

## 1. Run the local development infrastructure

The docker-compose file at the root directory contains definitions to run all the backend services required for the
web server to run.

```bash
docker-compose up -d
```

## 2. Run the Gatsby development server

1. Navigate to the web server

```bash
cd sgevent-ui
```

The `.env.development.template` file is a reference `.env` file to use for development.

2. Run the following command to copy and rename the `.env.development.template` file

```bash
cp .env.development.template .env.developemt
```

3. Install npm packages

Use your favourite package manager (yarn, npm etc.)

```bash
yarn
```

or

```bash
npm install
```

4. Run Gatsby in development mode:

```bash
npm run develop
```
