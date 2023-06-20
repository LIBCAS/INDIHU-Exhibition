FROM alpine:3.6
MAINTAINER koszegy@inqool.cz

RUN apk add --update apache2 apache2-proxy openssl \
    && rm -rf /var/cache/apk/* /var/www/localhost/htdocs && \
    mkdir -p /run/apache2 && \
    sed -i 's/^LoadModule lbmethod_/#&/' /etc/apache2/conf.d/proxy.conf

COPY build /var/www/localhost/htdocs
COPY httpd.conf /etc/apache2/httpd.conf

ADD run.sh /run.sh
RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
