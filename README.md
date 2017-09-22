# Versão em desenvolvimento do i3Geo

Para versões do Mapserver 6.x ou posteriores e Openlayers 3

Utilize esse repositório para manter seu código sempre atualizado diariamente. Isso garante o recebimento de correções de bugs.

Arquivos antigos e outras informações, veja em: https://softwarepublico.gov.br/social/i3geo/

Guia completo sobre instalação e administração do software, veja em: https://softwarepublico.gov.br/gitlab/i3geo/i3geo/wikis/home

Sobre segurança: http://moodle.gvsig-training.com/mod/book/view.php?id=5025&chapterid=116

# Guia de instalação

O i3Geo pode ser instalado em diferentes sistemas operacionais Linux e também no Windows. Nesse tutorial será mostrado como instalar no Windows e no Ubuntu.

Os arquivos do i3Geo estão disponíveis no Portal do Software Público Brasileiro (SPB). Para ter acesso a eles é desejável fazer um cadastro. O SPB, utiliza o GIT, um sistema de controle de versões para disponibilizar o código. Assim, para obter os arquivos do i3Geo é necessário ter um cliente GIT. No Windows pode ser utilizado o Tortoise. A utilização do GIT é importante pois você poderá atualizar o software sempre que achar necessário.

## Windows

Utilize pacote MS4W, que irá transformar o seu computador em um servidor web (apenas para uso pessoal), ao instalar os softwares APACHE, PHP e Mapserver.

Para isso faça o download do arquivo de instalação em http://www.ms4w.com/download.html#download.

Nas opções de pacotes escolha pelo menos "MS4W Base Files" e "Install and Start Apache Server", na opção "Destination root" escolha "C:\" e em "Apache port" mantenha como "80".

Teste a instalação digitando em seu navegador de internet: http://localhost (se não funcionar, reinicie o computador).

Depois de instalado o MS4W você terá em seu computador a pasta c:\ms4w\Apache\htdocs. Dentro dessa pasta é que o i3Geo deverá ser copiado.

Alguns usuários reportaram problemas ao instalar o Apache em algumas versões do Windows. Nesses casos a seguinte rotina pode resolver o problema:

* No Painel de Controle, digite no campo de pesquisa UAC
* Escolha a opção “Alterar configurações de Controle de Contas de Usuário”.
* Na janela que será aberta na sequência, configure para “Nunca notificar“.
* Reinicie o computador
* Execute novamente o arquivo apache-install.bat
* Para confirmar que tudo ocorreu bem, abra o navegador de internet e digite http:\\localhost

### i3Geo

Para obter o código do i3Geo você tem duas opções, a primeira utiliza simplesmente o download de um arquivo e a segunda utiliza o Git. A vantagem da segunda opção é que você poderá atualizar sua instalação de forma mais fácil.

#### Primeira opção:

* Baixe o código do i3Geo: https://softwarepublico.gov.br/gitlab/i3geo/i3geo/repository/archive.zip
* Descompacte a pasta i3GEO.git para dentro da pasta c:\ms4w\Apache\htdocs
* Renomeie a pasta c:\ms4w\Apache\htdocs\i3GEO.git para c:\ms4w\Apache\htdocs\i3geo
* Teste o funcionamento digitando no navegador http://localhost/i3geo

#### Segunda opção:

* Instale o Git: https://git-for-windows.github.io/ utilizando as opções default.
* Após a instalação, clique com o botão da direita sobre a pasta c:\ms4w\Apache\htdocs e escolha a opção "Git Bash Here"
* No terminal digite a sequência de comandos:

```
mkdir i3geo
cd i3geo
git -c http.sslVerify=false clone http://softwarepublico.gov.br/gitlab/i3geo/i3geo.git .
```

Não esqueça o PONTO no final da linha acima.

### Postgis (opcional)

Para instalar o Postgis siga o roteiro mostrado em http://postgis.net/windows_downloads

Instale também o Pgadmin, que é uma interface gráfica para o Postgis: http://www.pgadmin.org/download/windows.php

Caso deseje, carregue no Postgis o banco de dados do i3GeoSaúde. Esse banco é utilizado em alguns dos tutoriais do i3Geo e pode servir de teste para uso com o SAIKU.

* Primeiro baixe o arquivo https://softwarepublico.gov.br/gitlab/i3geo/i3geosaude/blob/master/databasei3geosaude.backup
* Abra o Pgadmin e crie uma nova conexão com o banco de dados. Em nome do host utilize "localhost" e o login e senha que você usou na istalação, normalmente "postgres".
* Utilize as opções do Pgadmin para criar um novo banco de dados chamado i3geosaude. Ao criá-lo, utilize o banco de dados postgres como template e login e senha "postgres".
* Clicando sobre o novo banco de dados, localize a opção "restore" e faça a carga do banco de dados que foi baixado no início.

## Linux (baseado em Ubuntu 14.04)

Instale os softwares necesários para configurar o servidor web com PHP5, Mapserver e outros.

Importante: versões mais novas do Ubuntu utilizam PHP7, nesses casos, o i3Geo não irá funcionar.

No terminal, digite a sequência de comandos abaixo.

```
sudo apt-get install apache2 apache2-doc apache2-utils cgi-mapserver mapserver-bin sqlite libapache2-mod-php5 php5 php5-common php5-dev php5-curl php5-json php5-gd php5-odbc php5-pgsql php5-sqlite php5-ps php5-xmlrpc php5-xsl php5-imagick php5-mapscript
sudo apt-get install proj-epsg
sudo a2enmod cgi
sudo service apache2 restart
sudo mkdir /var/www/html/i3geo
sudo mkdir /tmp/ms_tmp
sudo ln -s /tmp/ms_tmp /var/www/html/ms_tmp
```

Caso queira usar o software em conjunto com o i3Geo:

```
sudo apt-get install r-cran-spatstat
sudo apt-get install r-base r-base-core r-cran-maptools
```

### Dependendo da versão do Ubuntu, pode ser ainda necessário isso:

```
sudo apt-get install php5-mbstring
```

Em alguns casos a mbstring já é instalada junto com o PHP, por isso esse comando pode gerar mensagem de erro sem maiores consequências.

Lista de códigos EPSG, sua ausência faz com que os serviços WMS não funcionem.

```
sudo apt-get install proj-epsg
```

Ativa o modo CGI

```
sudo a2enmod cgi
```

Para reiniciar o Apache e efetivar as mudanças


```
sudo service apache2 restart
```

Teste a instalação digitando no seu navegador web http://localhost

## Linux (baseado em Ubuntu 16)

As versões mais recentes do Ubuntu utilizam como padrão o PHP 7, que é incompatível com o Mapserver e i3Geo.

Nesses casos é necessário adicionar um repositório de código que contenha o PHP 5 e compilar o Mapserver, o que pode ser feito seguindo-se o roteiro:

Digite no terminal Linux:

```
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install apache2
sudo apt-get install php5.6
sudo apt-get install php5.6-memcached php5.6-cli php5.6-mbstring php5.6-mcrypt php5.6-xml php5.6-curl php5.6-json php5.6-gd php5.6-odbc php5.6-pgsql php5.6-sqlite php5.6-ps php5.6-xmlrpc php5.6-xsl php5.6-imagick
sudo apt-get install memcached
a2enmod rewrite
sudo a2enmod cgi
sudo service apache2 restart
wget http://download.osgeo.org/mapserver/mapserver-7.0.6.tar.gz
tar xvf mapserver-7.0.6.tar.gz
cd mapserver-7.0.6/
sudo apt-get install cmake
mkdir build
cd build
apt-get install libfreetype6-dev
apt-get install php5.6-dev
apt-get install libproj-dev
apt-get install libfribidi-dev
apt-get install libharfbuzz-dev
apt-get install libcairo-dev
apt-get install libgdal-dev
cmake -DCMAKE_INSTALL_PREFIX=/opt \
        -DCMAKE_PREFIX_PATH=/usr/local/pgsql/91:/usr/local:/opt \
        -DWITH_CLIENT_WFS=ON \
        -DWITH_CLIENT_WMS=ON \
        -DWITH_CURL=ON \
        -DWITH_SOS=OFF \
        -DWITH_PHP=ON \
        -DWITH_FCGI=OFF \
        -DWITH_PYTHON=OFF \
        -DWITH_SVGCAIRO=OFF \
        -DWITH_GIF=OFF \
        ../ >../configure.out.txt
make
make install
echo extension=php_mapscript.so>/etc/php/5.6/mods-available/mapscript.ini
phpenmod mapscript
service apache2 restart

```

### i3Geo

Para obter o código do i3Geo você tem duas opções, a primeira utiliza simplesmente o download de um arquivo e a segunda utiliza o Git. A vantagem da segunda opção é que você poderá atualizar sua instalação de forma mais fácil.

Após a instalação, digite no navegador web http://localhost/i3geo

#### Primeira opção:

* Baixe o código do i3Geo: https://softwarepublico.gov.br/gitlab/i3geo/i3geo/repository/archive.zip
* Descompacte a pasta i3GEO.git para dentro da pasta /var/www/html
* Renomeie a pasta /var/www/html/i3GEO.git para /var/www/html/i3geo
* Teste o funcionamento digitando no navegador http://localhost/i3geo

#### Segunda opção:

* No terminal digite a sequência de comandos:

```
sudo apt-get install git-core
cd /var/www/html/i3geo
sudo git -c http.sslVerify=false clone http://softwarepublico.gov.br/gitlab/i3geo/i3geo.git .
```

Não esqueça o ponto no final da linha acima.

### Permissões

Para uso local você pode modificar de forma mais liberal as permissões dos arquivos. No terminal digite:

```
sudo chmod -R 777 /var/www/html/i3geo
sudo chmod -R 777 /var/www/html/ms_tmp
```

Em ambiente de produção devem ser consideradas as orientações que constam no artigo sobre segurança (ver Wiki).

### Atualização do código

Válido apenas se você não é um desenvolvedor do i3Geo e não tenha feito checkout via SSH.

Abra o terminal e digite os seguintes comandos (no Linux pode ser necessário usar `sudo`):

```
cd i3geo
git stash
git -c http.sslVerify=false pull
git stash pop
```
### Postgis (opcional)

Instale o PostgreSQL e Postgis

(dependendo da versão do Postgresql pode ser necessário alterar de 9.1 para a versão correta)

```
apt-get install postgresql postgis pgadmin3
apt-get install postgresql-9.1-postgis
```

#### Instalando o banco de dados i3GeoSaude para testes

Observações:

* dependendo da versão do Postgresql pode ser necessário alterar de 9.1 e 1.5 para a versão correta. Veja a pasta /usr/share/postgresql para descobrir a versão instalada)

* pode ser necessário o uso de sudo, exemplo: sudo su postgres -c "createdb i3geosaude"

* você pode primeiro mudar para o usuário postgres e depois executar os comandos. Nesse caso utilize "sudo su postgres" e depois "psql"

* para sair de "psql" digite \d

* usando psql diretamente, termine a linha de comando sempre com ";"

* para entrar em psql no database i3geosaude utilize "psql -d i3geosaude"

* para executar um arquivo SQL utilize "\i arquivo.sql"

Comandos para instalação:

```
su postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD 'postgres'\""
su postgres -c "createdb i3geosaude"
su postgres -c "createlang -d i3geosaude plpgsql"
su postgres -c "psql -d i3geosaude -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql"
su postgres -c "psql -d i3geosaude -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql"
su postgres -c "psql -d i3geosaude -c 'GRANT ALL ON geometry_columns TO PUBLIC;'"
su postgres -c "psql -d i3geosaude -c 'GRANT ALL ON geography_columns TO PUBLIC;'"
su postgres -c "psql -d i3geosaude -c 'GRANT ALL ON spatial_ref_sys TO PUBLIC;'"
/usr/bin/pg_restore --host localhost --port 5432 --username "postgres" --dbname "i3geosaude" --schema-only --list "/var/www/databasei3geosaude.backup"
/usr/bin/pg_restore --host localhost --port 5432 --username "postgres" --dbname "i3geosaude" --data-only --list "/var/www/databasei3geosaude.backup"
```

(o password é: postgres)
