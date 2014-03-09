#!/bin/sh
echo
echo "instala as dependencias e i3geo em uma distribuicao nova"
echo "nao rode em uma instalacao que ja contem o i3geo"
echo "sudo ./instalasw.sh"
echo "==============================================================="

apt-get install apache2 apache2-doc apache2-utils

apt-get install cgi-mapserver mapserver-bin

apt-get install postgresql postgis postgresql-9.1-postgis

apt-get install sqlite

apt-get install r-base r-base-core r-cran-maptools

apt-get install libapache2-mod-php5 php5 php5-json php5-common php5-curl php5-dev php5-gd php5-mapscript php5-odbc php5-pgsql php5-ps php5-xmlrpc php5-xsl php5-sqlite php5-imagick

apt-get install subversion

svn checkout http://svn.softwarepublico.gov.br/svn/i3geo/subgrupos/i3geosaude/ /var/www --username i3geosaude --password i3geosaude --non-interactive

cd /tmp

wget http://svn.softwarepublico.gov.br/trac/i3geo/export/4449/subgrupos/i3geosaude/databasei3geosaude.backup

#svn checkout http://svn.softwarepublico.gov.br/svn/i3geo/subgrupos/i3geosaude /temp --username i3geosaude --password i3geosaude --non-interactive

chmod -R u=rw,g=rw,o=rw /var/www

mkdir /tmp/ms_tmp

chmod -R u=rw,g=rw,o=rw /tmp/ms_tmp

ln -s /tmp/ms_tmp /var/www/ms_tmp

chmod -R u=rw,g=rw,o=rw /var/www/ms_tmp

su postgres

psql

ALTER USER postgres WITH PASSWORD ‘postgres’; \q

createdb -E UTF8 i3geosaude

createlang -d i3geosaude plpgsql

psql -d i3geosaude -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql

psql -d i3geosaude -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql

psql -d i3geosaude -c "GRANT ALL ON geometry_columns TO PUBLIC;"

psql -d i3geosaude -c "GRANT ALL ON geography_columns TO PUBLIC;"

psql -d i3geosaude -c "GRANT ALL ON spatial_ref_sys TO PUBLIC;"

/usr/bin/pg_restore --host localhost --port 5432 --username "postgres" --dbname "i3geosaude" --no-password --schema-only --list "/tmp/databasei3geosaude.backup"

/usr/bin/pg_restore --host localhost --port 5432 --username "postgres" --dbname "i3geosaude" --no-password --data-only --list "/tmp/databasei3geosaude.backup"

exit