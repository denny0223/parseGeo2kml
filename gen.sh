#!/bin/bash

hostname=https://example.com/kml/
filepath=/var/www/html/kml/
filename=$(date +"%Y%m%d%H%M%S").kml

cat template_head >> $filename
node index.js $1 >> $filename
cat template_tail >> $filename

mv $filename $filepath

echo $hostname/?file=$filename

