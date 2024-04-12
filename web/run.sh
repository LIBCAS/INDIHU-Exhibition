#!/bin/sh

chown -R apache:apache /var/www/localhost/htdocs

httpd -D FOREGROUND
