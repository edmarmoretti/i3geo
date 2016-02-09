# Versão em desenvolvimento do i3Geo

Para versões do Mapserver 6.x ou posteriores e Openlayers 3

Arquivos antigos e outras informações, veja em: https://softwarepublico.gov.br/social/i3geo/

Guia completo sobre instalação e administração do software, veja em: http://moodle.gvsig-training.com/mod/book/view.php?id=5025

# Guia rápido de instalação

## Windows

Utilize pacote MS4W, que irá transformar o seu computador em um servidor web (apenas para uso pessoal), ao instalar os softwares APACHE, PHP e Mapserver.

Para isso faça o download do arquivo de instalação em http://www.ms4w.com/download.html#download.

Nas opções de pacotes escolha pelo menos "MS4W Base Files" e "Install and Start Apache Server", na opção "Destination root" escolha "C:\" e em "Apache port" mantenha como "80".

Teste a instalação digitando em seu navegador de internet: http://localhost (se não funcionar, reinicie o computador).

Depois de instalado o MS4W você terá em seu computador a pasta c:\ms4w\Apache\htdocs. Dentro dessa pasta é que o i3Geo deverá ser copiado.

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

	mkdir i3geo
	
	cd i3geo
	
	git -c http.sslVerify=false clone http://softwarepublico.gov.br/gitlab/i3geo/i3geo.git .
	
Não esqueça o ponto no final da linha acima.

## Linux (baseado em Ubuntu)

Instale os softwares necesários para configurar o servidor web com PHP5, Mapserver e outros.

No terminal, digite a sequência de comandos abaixo.

	sudo apt-get install apache2 apache2-doc apache2-utils cgi-mapserver mapserver-bin sqlite libapache2-mod-php5 php5 php5-common php5-dev php5-curl php5-json php5-gd php5-odbc php5-pgsql php5-sqlite php5-ps php5-xmlrpc php5-xsl php5-imagick php5-mapscript
	
	sudo apt-get install php5-mbstring
	
	sudo apt-get install proj-epsg
	
	sudo a2enmod cgi
	
	sudo service apache2 restart
	
	sudo mkdir /var/www/html/i3geo
	
	sudo mkdir /tmp/ms_tmp
	
	sudo ln -s /tmp/ms_tmp /var/www/html/ms_tmp
	
Teste a instalação digitando no seu navegador web http://localhost
	
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

	sudo apt-get install git-core
	
	cd /var/www/html/i3geo
	
	sudo git -c http.sslVerify=false clone http://softwarepublico.gov.br/gitlab/i3geo/i3geo.git .
	
Não esqueça o ponto no final da linha acima.

### Permissões

Para uso local você pode modificar de forma mais liberal as permissões dos arquivos. No terminal digite:

	sudo chmod -R 777 /var/www/html/i3geo
	
	sudo chmod -R 777 /var/www/html/ms_tmp

### Atualização do código

Válido apenas se você não é um desenvolvedor do i3Geo e não tenha feito checkout via SSH.

Abra o terminal e digite os seguintes comandos (no Linux pode ser necessário usar `sudo`):

	git stash
	
	git -c http.sslVerify=false pull
	
	git stash pop
