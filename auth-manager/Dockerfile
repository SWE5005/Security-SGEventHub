FROM openjdk:21-slim
ENV APP_FILE auth-manager-0.0.1-SNAPSHOT.jar
ENV APP_HOME /usr/app
COPY target/$APP_FILE $APP_HOME/
WORKDIR $APP_HOME
ENTRYPOINT ["sh", "-c"]
CMD ["exec java -jar $APP_FILE"]
