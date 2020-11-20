# Versão em desenvolvimento do i3Geo

Para versões do Mapserver 7.x ou posteriores e Openlayers 4

Utilize esse repositório para manter seu código sempre atualizado diariamente. Isso garante o recebimento de correções de bugs.

Arquivos antigos e outras informações, veja em: https://softwarepublico.gov.br/social/i3geo/

Sobre segurança: https://softwarepublico.gov.br/gitlab/i3geo/i3geo/wikis/notas-sobre-seguranca

# Guia de instalação

## Docker

Esta versão do i3geo conta com uma imagem Docker que pode ser utilizada para testar rapidamente o software e também utiliá-lo em ambiente produtivo após as suas customizações.

Para usar basta ter o Docker instalado no seu computador e executar o seguinte comando:

`docker run -i -t -p 80:8080 --rm i3geo/i3geo`

Em seguida, acesse um navegador de sua preferência e insira o seguinte endereço:

`http://localhost/i3geo`

Mais opções em https://hub.docker.com/u/i3geo/

Dicas sobre Docker: https://www.digitalocean.com/community/tutorials/como-instalar-e-utilizar-o-docker-primeiros-passos-pt

### PostGIS

Caso deseje, carregue no PostGIS o banco de dados do i3GeoSaúde.

* Primeiro baixe o arquivo https://softwarepublico.gov.br/gitlab/i3geo/i3geosaude/raw/master/databasei3geosaude.backup
* Abra o pgAdmin e crie uma nova conexão com o banco de dados. Em nome do host utilize "localhost" e o login e senha que você usou na istalação, normalmente "postgres".
* Utilize as opções do pgAdmin para criar um novo banco de dados chamado i3geosaude. Ao criá-lo, utilize o banco de dados postgres como template e login e senha "postgres".
* Clicando sobre o novo banco de dados, localize a opção "restore" e faça a carga do banco de dados que foi baixado no início.

### Permissões

Para uso local você pode modificar de forma mais liberal as permissões dos arquivos. No terminal digite:

```
sudo chmod -R 777 /var/www/html/i3geo
sudo chmod -R 777 /var/www/html/ms_tmp
```

Em ambiente de produção devem ser consideradas as orientações que constam no artigo sobre segurança (ver Wiki).

## Chave utilizada pela API do GoogleMaps

Devido às restrições de uso da API do GoogleMaps, é necessário registrar uma chave no site do Google para o seu endereço de servidor para que as funcionalidades do i3Geo que utilizam essa API funcionem. Veja como fazer em: http://code.google.com/apis/maps/signup.html.

A chave deve ser incluída na variável $googleApiKey do arquivo i3geo/ms_configura.php.

