FROM java:8-jre-alpine
MAINTAINER koszegy@inqool.cz

COPY target/Indihu-0.1-SNAPSHOT.jar /usr/src/indihu.jar
COPY run.sh /run.sh

RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
