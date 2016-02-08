# Versão 6 do i3Geo

Arquivos antigos e outras informações, veja em: https://softwarepublico.gov.br/social/i3geo/

Guia completo sobre instalação e administração do software, veja em: http://moodle.gvsig-training.com/mod/book/view.php?id=5025

Mantenha sua instalação atualizada, veja como: 

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

* Baixe o código da versão em desenvolvimento do i3Geo: https://softwarepublico.gov.br/gitlab/i3geo/i3geo/repository/archive.zip
* Descompacte a pasta i3GEO.git para dentro da pasta c:\ms4w\Apache\htdocs
* Renomeie a pasta c:\ms4w\Apache\htdocs\i3GEO.git para c:\ms4w\Apache\htdocs\i3geo
* Teste o funcionamento digitando no navegador http://localhost/i3geo

#### Segunda opção:

* Instale o Git: https://git-for-windows.github.io/ utilizando as opções default.
* Após a instalação, clique com o botão da direita sobre a pasta c:\ms4w\Apache\htdocs e escolha a opção "Git Bash Here"
* No terminal digite a sequência de comandos:

	mkdir i3geo
	
	cd i3geo
	
	git clone git@softwarepublico.gov.br:i3geo/i3geo.git .
	
Não esqueça o ponto no final da linha acima.

## Linux
