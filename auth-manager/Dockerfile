FROM azul/zulu-openjdk-alpine:21-latest AS builder

WORKDIR /app

COPY . .

RUN ./mvnw clean package -Dspring.profiles.active=docker -Dmaven.test.skip=true

FROM azul/zulu-openjdk-alpine:21-latest AS optimizer
ARG APP_VERSION

WORKDIR /app

COPY --from=builder /app/target/auth-manager-${APP_VERSION}.jar application.jar

RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

FROM azul/zulu-openjdk-alpine:21-latest
ARG REVISION

LABEL org.opencontainers.image.source=https://github.com/SWE5005/Security-SGEventHub
LABEL org.opencontainers.image.title="SG Event Hub - Auth Manager"
LABEL org.opencontainers.image.description="Auth Manager Microservice"
LABEL org.opencontainers.image.revision=${REVISION}

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

WORKDIR /app

COPY --from=optimizer /app/extracted/dependencies/ ./
COPY --from=optimizer /app/extracted/snapshot-dependencies/ ./
COPY --from=optimizer /app/extracted/spring-boot-loader/ ./
COPY --from=optimizer /app/extracted/application/ ./

RUN chown -R nonroot:nonroot /app

USER nonroot

RUN mkdir -p /app/logs

CMD ["java", "-jar", "application.jar"]