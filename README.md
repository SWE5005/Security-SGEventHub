# SG Event Hub

## Quickstart

The following command will startup all the necessary containers:

-   Databases (Postgres)
-   Forntend Services
    -   Sg Event UI
-   Backend Services
    -   Keycloak
    -   Event Manager

```bash
docker compose up -d
```

## Web Development

The web server is built on the Gatsby framework.

```
cd sgevent-ui
```

```
npm run develop
```

## Backend Development

The backend services are built on the Java Spring framework.

```
cd event-manager
```

```
./mvnw spring-boot:run
```
