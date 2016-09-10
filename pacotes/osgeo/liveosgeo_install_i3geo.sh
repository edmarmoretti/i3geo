#!/bin/bash
# Copyright (c) 2009-2010 The Open Source Geospatial Foundation.
# Licensed under the GNU LGPL version >= 2.1.
#
# This library is free software; you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published
# by the Free Software Foundation, either version 2.1 of the License,
# or any later version.  This library is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY, without even the implied
# warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU Lesser General Public License for more details, either
# in the "LICENSE.LGPL.txt" file distributed with this software or at
# web page "http://www.fsf.org/licenses/lgpl.html".
#
# Requires: svn apache2 php5 libapache2-mod-php5 cgi-mapserver mapserver-bin php5-mapscript
# php5-gd php5-sqlite php5-curl php5-json php5-odbc php5-pgsql php5-ps php5-xmlrpc php5-xsl php5-imagick php5-mbstring
#
# Uninstall:
# ============
# sudo rm -rf /var/www/html/i3geo
# sudo rm -rf /var/www/html/ms_tmp
# sudo rm -rf /tmp/ms_tmp

./diskspace_probe.sh "`basename $0`" begin
BUILD_DIR=`pwd`
####


exit

#OSGEO live username is "user"
if [ -z "$USER_NAME" ] ; then
   USER_NAME="user"
fi

#Repository url
I3GEO_DOWNLOAD_URL="http://devel.gvsig.org/svn/i3geo/i3geo60/"

#i3GEO dependencies
I3GEO_DEPENDENCIES=(svn apache2 php5 libapache2-mod-php5 cgi-mapserver mapserver-bin php5-mapscript php5-gd php5-sqlite php5-curl php5-json php5-odbc php5-pgsql php5-ps php5-xmlrpc php5-xsl php5-imagick php5-mbstring)
#R_DEPENDENCIES=(r-cran-maptools)

#Installation variables
ROOT_DIR="/var/www/html"
TMP_DIR="/tmp"
LOCAPLIC="$ROOT_DIR/i3geo"


#Temporary directory, symbolic link to temporary directory
mkdir "$TMP_DIR/ms_tmp"
ln -s "$TMP_DIR/ms_tmp" "$ROOT_DIR/ms_tmp"
#Temporary directory permissions
chown -R www-data:www-data "$TMP_DIR/ms_tmp"
chown -R www-data:www-data "$ROOT_DIR/ms_tmp"
chmod -R 755 "$TMP_DIR/ms_tmp"
chmod -R 755 "$ROOT_DIR/ms_tmp"

#add R repository to have the latest version of R
#cd /etc/apt/
#echo "deb http://cran.es.r-project.org/bin/linux/debian squeeze-cran/" >> sources.list
#apt-key adv --keyserver subkeys.pgp.net --recv-key 381BA480
#apt-get update

#Install i3geo dependencies
for i in "${I3GEO_DEPENDENCIES[@]}"; do
  IS_INSTALLED=$(dpkg --get-selections | grep -w $i | grep -w install)
  if [ -z "$IS_INSTALLED" ]; then
    echo "Package $i is not installed"
    echo "Installing $i ..."
    apt-get -y install "$i"
  else
    echo "$i package is allready installed"
  fi
done

#Deploy i3geo
echo -n "Checkout i3Geo files"
cd "$ROOT_DIR"
svn checkout "$I3GEO_DOWNLOAD_URL" i3geo
echo -n "Done"

#Change permissions
cd "$ROOT_DIR"
chown -R www-data i3geo/
chgrp -R www-data i3geo/
chmod -R 755 i3geo/


# Reload Apache
/etc/init.d/apache2 force-reload

### install desktop icon ##
echo "Installing i3geo desktop icon"
if [ ! -e "/usr/local/share/icons/i3Geo_big.png" ] ; then
   mkdir -p /usr/local/share/icons
   cp "$ROOT_DIR"/i3geo/imagens/i3Geo_big.png /usr/local/share/icons/
fi

#Add Launch icon to desktop
if [ ! -e /usr/local/share/applications/i3geo.desktop ] ; then
   mkdir -p /usr/local/share/applications
   cat << EOF > /usr/local/share/applications/i3geo.desktop
[Desktop Entry]
Type=Application
Encoding=UTF-8
Name=i3geo
Comment=i3geo
Categories=Application;Geography;Geoscience;Education;
Exec=firefox http://localhost/i3geo
Icon=/usr/local/share/icons/i3Geo_big.png
Terminal=false
StartupNotify=false
EOF
fi

# Add launcher into the Desktop folder
USER_HOME="/home/$USER_NAME"
USER_DESKTOP="$USER_HOME/Desktop/"
# Add desktop icon
if [ -d "$USER_DESKTOP" ] ; then
   echo "Copying icon to desktop at $USER_DESKTOP"
   cp /usr/local/share/applications/i3geo.desktop "$USER_DESKTOP/i3geo.desktop"
   chown $USER_NAME:$USER_NAME "$USER_DESKTOP/i3geo.desktop"
   chmod +x "$USER_DESKTOP/i3geo.desktop"
fi

####
#"$BUILD_DIR"/diskspace_probe.sh "`basename $0`" end
