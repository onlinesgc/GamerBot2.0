#!/bin/bash
case "$1" in 
	install)
	(crontab -l 2>/dev/null; echo "0 3 * * * (cd $PWD; git pull; npm install)") |crontab -
	echo "Cronjob added successfully!"
	;;

	remove)

		crontab -l | grep -v "0 3 \* \* \* (cd $PWD; git pull; npm install)" | crontab -

	;;

	*)
	echo "Usage: ./CRONSET {install|remove}"
	exit 1
	;;
esac
