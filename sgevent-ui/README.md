# SG Event Hub - Web

This folder contains the source code for the SG Event Hub web server. The web server uses a React-based static site
generation framework called Gatsby.

Read more about Gatsby: https://www.gatsbyjs.com/

## Authentication

This application uses Keycloak for authentication via OpenID Connect (OIDC) Authorization Code Flow.

### Authentication Flow

1. User clicks "Login" or "Sign Up" button
2. User is redirected to the Keycloak login page
3. After successful authentication, Keycloak redirects back to the application
4. The application verifies the authentication token and sets an HTTP-only cookie
5. The user is now authenticated and can access protected resources

### Environment Variables

The following environment variables are required for authentication:

```
# Keycloak OIDC Configuration
GATSBY_KEYCLOAK_URL=http://localhost:8080/realms/sgeventhub
GATSBY_KEYCLOAK_CLIENT_ID=sgevent-ui
GATSBY_KEYCLOAK_CLIENT_SECRET=your-client-secret
GATSBY_REDIRECT_URI=http://localhost:8000/api/auth/callback
GATSBY_LOGOUT_REDIRECT_URI=http://localhost:8000/login
GATSBY_COOKIE_SECRET=your-cookie-secret
```

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

## Keycloak Setup

1. Create a Keycloak realm (e.g., "sgeventhub")
2. Create a client (e.g., "sgevent-ui")
3. Configure the client:
   - Access Type: confidential
   - Valid Redirect URIs: http://localhost:8000/api/auth/callback
   - Web Origins: http://localhost:8000
4. Get the client secret from the "Credentials" tab
5. Update the .env file with the client secret
