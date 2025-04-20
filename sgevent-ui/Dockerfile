FROM node:22-alpine AS build

WORKDIR /app

COPY . .

RUN npm i --ignore-scripts
RUN npm run build

FROM node:22-alpine

ARG REVISION

LABEL org.opencontainers.image.source=https://github.com/SWE5005/Security-SGEventHub
LABEL org.opencontainers.image.title="SG Event Hub - Web"
LABEL org.opencontainers.image.description="The SPA web application application for SG Event Hub"
LABEL org.opencontainers.image.revision=${REVISION}

WORKDIR /app

COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

EXPOSE 8000

CMD ["npm", "run", "serve"]