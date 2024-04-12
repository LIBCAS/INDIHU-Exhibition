#!/bin/sh

cd /usr/src
java -jar -Xmx300m indihu.jar > indihu.log

#Docker stopper
tail -f /etc/issue
