#!/bin/sh
if [[ $1 == "-k" ]]; then
	cat /usr/share/everseer-server/routes/APIKEY
else
	pm2 start /usr/share/everseer-server/bin/www
fi
