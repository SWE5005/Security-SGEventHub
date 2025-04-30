#!/bin/sh

mkdir -p /app/certs

# Decode base64 certs
echo "$privateKey_B64" | base64 -d > /app/certs/privateKey.pem
echo "$publicKey_B64" | base64 -d > /app/certs/publicKey.pem

# Launch Spring Boot
exec java -jar auth-manager.jar