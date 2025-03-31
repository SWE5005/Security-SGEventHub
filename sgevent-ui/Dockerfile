FROM node:22-alpine as build

WORKDIR /app

COPY . .

RUN npm install \
    && npm run build

FROM node:22-alpine

LABEL org.opencontainers.image.source https://github.com/SWE5005/Security-SGEventHub
LABEL org.opencontainers.image.title "SG Event Hub - Web"
LABEL org.opencontainers.image.description "The static website."
LABEL org.opencontainers.image.revision ${REVISION}

COPY --from=build /app/public /pub