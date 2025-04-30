FROM azul/zulu-openjdk-alpine:21-latest AS builder

WORKDIR /app

COPY . .

RUN ./mvnw clean package -Dmaven.test.skip=true

FROM azul/zulu-openjdk-alpine:21-latest AS optimizer

WORKDIR /app

COPY --from=builder /app/target/*.jar auth-manager.jar

# Add entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8083
ENTRYPOINT ["/app/entrypoint.sh"]
