FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY gatsby-config.ts ./
COPY gatsby-node.ts ./
COPY gatsby-browser.tsx ./
COPY gatsby-ssr.tsx ./
COPY src ./src/

RUN npm ci --ignore-scripts --cpu=x64 --os=linux
RUN npm run build

FROM node:22-alpine

ARG REVISION

LABEL org.opencontainers.image.source=https://github.com/SWE5005/Security-SGEventHub
LABEL org.opencontainers.image.title="SG Event Hub - Web"
LABEL org.opencontainers.image.description="The SPA web application application for SG Event Hub"
LABEL org.opencontainers.image.revision=${REVISION}

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

WORKDIR /app

WORKDIR /app

COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

RUN chown -R nonroot:nonroot /app

USER nonroot

EXPOSE 8000

CMD ["npm", "run", "serve"]