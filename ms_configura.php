<?php
if($_SERVER['SCRIPT_FILENAME'] == __FILE__){
    exit;
}
//verifica se o pai esta na mesma pasta
if (!strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
	if(!stristr(dirname($_SERVER['SCRIPT_FILENAME']),"/".basename(dirname(__FILE__)))){
	    exit;
	}
}
/*
Title: Vari&aacute;veis de inicializa&ccedil;&atilde;o ms_configura.php

Nesse programa PHP s&atilde;o definidas as vari&aacute;veis globais principais necess&aacute;rias ao funcionamento do I3Geo do lado do servidor web.

O ms_configura &eacute; inclu&iacute;do em v&aacute;rios programas do i3Geo e os valores das vari&aacute;veis devem ser editados
caso a instala&ccedil;&atilde;o do i3geo tenha sido feita em um diret&oacute;rio diferente do padr&atilde;o.
No windows o diret&oacute;rio padr&atilde;o &eacute; c:\ms4w\apache\htdocs\i3geo e no linux &eacute; /opt/www/html/i3geo

Para verificar a instala&ccedil;&atilde;o do i3geo utilize o programa i3geo/testainstal.php, que pode fornecer algumas dicas
caso estejam ocorrendo problemas na inicialliza&ccedil;&atilde;o.

As vari&aacute;veis de configura&ccedil;&atilde;o s&atilde;o definidas em blocos diferentes conforme o sistema operacional (linux ou windows).

O ms_criamapa.php carrega o ms_configura.php e armazena a maior parte das vari&aacute;veis na se&ccedil;&atilde;o. Algumas vari&aacute;veis
s&atilde;o tamb&eacute;m fornecidas para o cliente (navegador) na inicializa&ccedil;&atilde;o do mapa e ficam dispon&iacute;veis em vari&aacute;veis javascript.

Qualquer uma das vari&aacute;veis pode ser colocada dentro do bloco que identifica o sistema operacional. Dessa forma pode-se ter um comportamento diferente de acordo com o ambiente.


Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
i3geo/testamapfile.php
Arquivo: ms_configura.php

*/
/*
Variable: i3geomaster

Usu&aacute;rio e senha que podem realizar opera&ccedil;&otilde;es de administra&ccedil;&atilde;o inicial do i3Geo, como a cria&ccedil;&atilde;o do banco de dados de administra&ccedil;&atilde;o ou opera&ccedil;&otilde;es cr&iacute;ticas do sistema

&Eacute; necess&aacute;rio alterar esse par&acirc;metro quando o i3Geo n&atilde;o estiver em localhost, caso contr&aacute;rio, os mapas ser&atilde;o bloqueados

Tipo:
{array}

Default:
array(array("usuario"=>"admin", "senha"=>"adminx"));

*/
//TODO verificar ao fechar versao - alterar a senha para admin
$i3geomaster = array(
	array("usuario"=>"admin", "senha"=>"admin")
);
//TODO remover chave ao fechar a versao
/*
Variable: i3geoKeys

Chaves utilizadas para criptografar/descriptografar arquivos ou strings.

As chaves devem ser geradas por meio do aplicativo php-encryption.

Para gerar uma chave veja o tutorial: https://github.com/defuse/php-encryption/blob/master/docs/Tutorial.md#scenario-1-keep-data-secret-from-the-database-administrator

i3geoKeys e um array onde o indice corresponde a funcionalidade onde a criptografia sera utilizada

Para decidir sobre o uso ou nao da criptografia, veja a documentacao: https://github.com/defuse/php-encryption

Funcionalidades:

salvaMapfile - utilizado na opcao de download do arquivo mapfile em uso para posterior upload.
Se a chave nao existir a opcao de download/upload ira funcionar no modo padrao.
Nesse caso as informacoes de conexao e fontes de dados (DATA) sao removidas do mapfile e a recuperaco do mapa,
via upload, ira remover LAYERS que nao forem encontrados na pasta i3geo/temas.
Quando a chave for especificada, o mapfile nao e alterado ao ser feito o download, mantendo suas caracteristicas originais.

Exemplo de chave: def00000881f5d29aa8604e109797766cd26754c4cc06be02c09163810a78a8a59564bdfd00170d20cdce0e8ac5342db0286d243f78de63b8b26f52d9bc55ee53080bd68
*/
$i3geoKeys = array(
	"salvaMapfile"=>""
);
/*
Variable: $i3geoPermiteLogin

Permite ou impede que sejam executadas as funcionalidades que exigem login

Quando false o login e bloaueado, mesmo para usuarios cadastrados

Tipo:
{boolean}
*/
$i3geoPermiteLogin = true;
/*
Variable: $i3geoPermiteLoginIp

Lista de IPs que podem fazer login. Valido apenas se $i3geoPermiteLogin for true

A lista e um array, permitindo a inclusao de varios IPs

Para nao fazer a verificacao, ou seja, permitir que qualquer IP faca login, deixe essa variavel em branco

Exemplo de uso:

$i3geoPermiteLoginIp = array("127.0.0.1","200.200.200.200");
*/
$i3geoPermiteLoginIp = array();
/*
 Variable: $logTransacoes

Define se as transacoes no banco de dados de administracao serao mantidas em uma tabela de logs

Para que isso funcione e necessario que exista a tabela que armazena o log.

Se voce possui um banco de administracao anterior a versao 7, utilize o seguinte sql para criar a tabela

- caso esteja utilizando SQLlite:
CREATE TABLE i3geoadmin_log (id_log INTEGER PRIMARY KEY,sql TEXT,serializedata TEXT,usuario TEXT,ip TEXT,timestamp TEXT,outros TEXT)

- caso esteja utilizando postgesql:
CREATE TABLE i3geoadmin.i3geoadmin_log (id_log SERIAL PRIMARY KEY NOT NULL,sql TEXT,serializedata TEXT,usuario TEXT,ip TEXT,timestamp TEXT,outros TEXT);

Tipo:
{boolean}

Default:

false

*/
$logTransacoes = false;
/*
 Variale: $i3geoEsquemasWL

 Lista com nomes dos esquemas, nos bancos de dados acessiveis pelo sistema de administracao, que podem ser utilizados nas listagens de tabelas e colunas.

 O sistema de administracao do i3Geo possui formularios com campos que referem-se a objetos no banco de dados Postgres.
 Essa variavel e uma lista branca, ou seja, permite o acesso apenas aos esquemas e seus objetos que constam na lista.
 Essa lista nao impede o uso desses objetos, apenas evita que os mesmos sejam utilizados para gerar opcoes de selecao para o preenchimento dos formularios.

 O usuario dos formularios ainda poderao inserir manualmente os nomes dos objetos mesmo que os esquemas nao constem nessa lista.

 Tipo:
 {array}
*/
$i3geoEsquemasWL = array();
/*
 Variale: $i3geoUploadDataWL

 Lista com as pastas (caminho completo no sistema de arquivos) ou esquemas em bancos de dados Postgis, que podem ser utilizadas para o
 upload de arquivos shapefile.
 O upload e uma funcao disponivel no sistema de administracao do i3Geo.
 Para nao expor o endereco das pastas nos formularios, cada pasta recebe um apelido.

 No caso dos esquemas, o nome e o mesmo existente no banco. Alem dos esquemas e necessario fornecer os parametros de conexao
 com o banco de dados que permita a escrita nesses esquemas, pois a conversao de shapefile para Postgis exige a cria��o de tabela.
 Esses parametros podem ser diferentes de outros existentes aqui no ms_configura e nao interferem em outras operacoes

 Exemplo:

  $i3geoUploadDataWL = array(
 	"arquivos" => array(
 		"Pasta 1"=>"/tmp/ms_tmp"
 	),
 	"postgis" => array(
 		"esquemas"=>array("esquema1","i3geo_metaestat","public"),
 		"conexao"=>array("user"=> "postgres", "password"=>"postgres", "dbname"=>"i3geosaude", "host"=>"localhost", "port"=>"5432")
 	)
 );

 Tipo:
 {array}
 */
$i3geoUploadDataWL = array();

/*
 Variale: $logExec

 Ativa a geracao do log em ms_tmp/.log_i3geo_

 Para evitar o log, basta definir os valores como false ou $logExec = ''

 Tipo:
 {array}
*/
$logExec = array(
	"mapa_" => false, //mapa_openlayers e mapa_googlemaps
	"init" => false, //ms_criamapa mapa_inicia
	"ogc" => false, //servico ogc
	"upload" => false, //ferramentas de upload
	"ferramentas" => false, //todas as ferramentas que usam safe.php
	"controle" => false //tudo que passa por mapa_controle.php
);
/*
 Variable: $i3GeoProjDefault

Parametros de projecao cartografica utilizados nos mapas e nas exportacoes de arquivos.

Os valores devem ser obtidos do site http://spatialreference.org/

proj4 - corresponde a string de definicao de projecao conforme a biblioteca proj4, exemplo http://spatialreference.org/ref/epsg/4326/proj4/

epsg - corresponde ao codigo da projecao definido pela autoridade EPSG e eh o mesmo utilizado como SRID no Postgis, exemplo http://spatialreference.org/ref/epsg/4326/

prj - string utilizado para gerar arquivos .prj que compoem shapefiles, exemplo: http://spatialreference.org/ref/epsg/4326/esriwkt/

A exportacao de arquivos shapefile gera sempre o PRJ conforme essa definicao.

Quando um mapfile utilizado no i3Geo nao possui a definicao de projecao no LAYER o i3Geo utilizara a projecao definida nessa variavel.

Caso essa variavel esteja definida como vazio ou nao definida aqui o i3Geo utilizara o defaul, que se baseia no EPSG:4326.

Os mapfiles de inicializacao tem seus parametros de projecao sobrepostos por essa variavel.

Tipo:
{array}

Default:
baseado em 4326

*/
$i3GeoProjDefault = array(
	'proj4' => '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
	'epsg' => '4326',
	'prj' => 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
);
/*
Variable: $statusFerramentas

Algumas das funcionalidades do mapa interativo dependem de configuracoes especificas do servidor.
Esse array informa quais dessas ferramentas estao corretamente configuradas.
As que estiverem marcadas como false nao serao mostradas na interface do mapa interativo
Sobre essas configuracoes, veja na pasta i3geo/ferramentas e na documentacao do
sistema de administracao do i3Geo

No caso do SAIKU, verifique tambem se o programa i3geo/ferramentas/saiku/esquemaxml.php nao esta bloqueado (voce deve
abrir e verificar o inicio desse arquivo). Veja tambem: i3geo/ferramentas/saiku/install.txt
 */
$statusFerramentas = array(
	"saiku"=>false,
	"melhorcaminho"=>false
);
/*
Variable: $i3GeoRegistraAcesso

Permite ou nao registrar no banco de dados quando uma camada e adicionada ao mapa, possibilitando a geracao de estatisticas.

Quando true, e necessario que exista um usuario com permissao de escrita no banco de dados de administracao, o que pode nao ser desejado em ambientes de producao.

Afeta apenas as estatisticas de acesso.
 */
$i3GeoRegistraAcesso = false;
/*
Variable: $i3geoBlFerramentas

Lista de ferramentas que sao bloqueadas, impedindo sua execucao.

O bloqueio e feito da seguinte forma:

- diretamente no programa PHP que executa as operacoes relativas a ferramenta

- diretamente no programa que faz a carga dos javascripts necessarios ao funcionamento da ferramenta

Essa lista nao impede que a ferramenta seja mostrada na interface do i3Geo. Para remover da interface
e necessario usar as opcoes de configuracao das inetrfaces. Mesmo a opcao sendo mostrada, ela sera
bloqueada quando o usuario tentar executa-la.

As palavras incluidas na lista correspondem ao nome da pasta onde reside o codigo da ferramenta e
armazenada em i3geo/ferramentas.

Exemplo: para bloquear a funcao de edicao da legenda e a funcao que mostra a tabela de
atributos, basta incluir na lista "legenda","tabela"

$i3geoBlFerramentas = array("legenda","tabela");

Para nao bloquear nenhuma ferramenta, deixe em branco

Excecoes:

As seguintes ferramentas nao podem ser bloqueadas:
(algumas dessas ferramentas sao bloqueadas dependendo da configuracao de cada tema. Algumas
sao agregadores de outras ferramentas ou nao utilizam PHP)

colorpicker,colourramp,convertekml,download,editorgm,editorol,excluirarvore,opacidademapa,
opcoes_autoredesenha,opcoes_label,salvamapfile,wmstime

As seguintes ferramentas podem ser bloqueadas apenas impedindo-se a carga do javascript
(as operacoes via PHP sao realizadas por outras classes que nao residem na pasta ferramentas ou n�o utiliza PHP)

animacao,atalhosedicao,atalhosmapa,busca,buscainde
buscarapida,conectarservicos,convertemapakml,cortina,editorsql,filtroarvore,html2canvas,inseregrafico
inseretxt,mostraexten,outputformat,perfil,tipoimagem

*/
//$i3geoBlFerramentas = array("saiku");
$i3geoBlFerramentas = array("saiku");
/*
Variable: $ogrOutput

Indica se o OGR esta corretamente instalado, permitindo o seu uso nos servicos OGC de exportacao de dados
*/
$ogrOutput = false;
/*
Variable: saikuUrl

URL para acessar o aplicativo SAIKU. Se nao estiver instalado, deixe em branco

Para maiores informacoes sobre como instalar o SAIKU veja em http://localhost/i3geo/ferramentas/saiku/instal.txt
*/
$saikuUrl = "http://localhost:9090";
/*
Variable: saikuConfigDataSource

Parametros de configuracao da fonte de dados utilizada pelo applicativo SAIKU

Indicam onde estao os dados utilizados pelo sistema de metadados estatisticos e que podem ser visualizados na forma
de cubos OLAP

Ajuste os parametros indicando:

serverdb - endereco do servidor postgres
port - porta de acesso ao servidor
database - nome do database que contem as tabelas
username - nome do usuario que pode acessar o database
password - senha desse usuario

Os parametros sao utilizados pelo programa definido em Catalog. Ese programa monta o arquivo de fonte de dados temorario
e armazena em ms_tmp/saiku-datasources

Esse arquivo contera uma string como esse exemplo:

type=OLAP
driver=mondrian.olap4j.MondrianOlap4jDriver
location=jdbc:mondrian:Jdbc=jdbc:postgresql://localhost:5432/i3geosaude;Catalog=http://localhost/i3geo/ferramentas/saiku/esquemaxml.php;JdbcDrivers=org.postgresql.Driver;
username=postgres
password=postgres

Note que o database possui o nome i3geosaude
Se os seus dados estatisticos estiverem em outro banco altere esse valor

Em tabelaDimensaoTempo utilize nome_do_esquema.nome_da_tabela
*/
$saikuConfigDataSource = array(
	"type"=>"OLAP",
	"driver"=>"mondrian.olap4j.MondrianOlap4jDriver",
	"location"=>"jdbc:mondrian:Jdbc=jdbc:postgresql",
	"serverdb"=>"localhost",
	"port"=>"5432",
	"database"=>"i3geosaude",
	"JdbcDrivers"=>"org.postgresql.Driver",
	"username"=>"postgres",
	"password"=>"postgres",
	"tabelaDimensaoTempo"=>"i3geo_metaestat.dim_tempo"
);

/*
	Variable: i3georendermode

	Opcoes que definem a rotina que sera utilizada para enviar ao navegador as imagens geradas de cada camada

	0 - modo default. Utiliza a funcao imagepng() do PHP para enviar a imagem ao navegador
	1 - utiliza a funcao do Mapserver saveImage() para enviar a imagem ao navegador (e mais rapida, mas nao funciona em algumas versoes do Mapserver)
	2 - utiliza X-Sendfile (mais rapido que as outras opcoes) mas exige modificacoes na instalacao do Apache. Veja em: https://tn123.org/mod_xsendfile/ e http://edmarmoretti.blogspot.com.br/
 */
$i3georendermode = 0;
/*
	Variavel: linkedinoauth (ainda n&atilde;o implementado)

	Par&acirc;metros registrados no Linkedin para permitir que o i3Geo fa&ccedil;a autentica&ccedil;&atilde;o com base na conta do usu&aacute;rio

	O Linkedin exige que cada site seja registrado para permitir que a API de autentica&ccedil;&atilde;o funcione

	Veja o site para maiores informa&ccedil;&otilde;es: http://developer.linkedin.com/docs/DOC-1008

	Caso vc n&atilde;o queira permitir essa op&ccedil;&atilde;o, deixe essa vari&aacute;vel vazia, e.x

	Ao registrai3geo/testamapfile.phpr utilize o valor http://meuservidor/i3geo/pacotes/openid/login.php?login

	Exemplo:

	$linkedinoauth = array(
		"consumerkey" => "",
		"consumersecret" => ""
	);

	Tipo:
	{array}
*/
$linkedinoauth = "";
/*
	Variavel: facebookoauth

	Par&acirc;metros registrados no Facebook para permitir que o i3Geo fa&ccedil;a autentica&ccedil;&atilde;o com base na conta do usu&aacute;rio

	O Facebook exige que cada site seja registrado para permitir que a API de autentica&ccedil;&atilde;o funcione

	Veja o site para maiores informa&ccedil;&otilde;es: http://developers.facebook.com/setup/

	Caso vc n&atilde;o queira permitir essa op&ccedil;&atilde;o, deixe essa vari&aacute;vel vazia, e.x

	Ao registrar utilize o valor http://meuservidor/i3geo/pacotes/openid/login.php?login

	Exemplo:

	$facebookoauth = array(
		"consumerkey" => "",
		"consumersecret" => ""
	);

	Tipo:
	{array}
*/
$facebookoauth = array(
	"consumerkey" => "",
	"consumersecret" => ""
);
/*
	Variavel: twitteroauth

	Par&acirc;metros registrados no Twitter para permitir que o i3Geo fa&ccedil;a autentica&ccedil;&atilde;o com base na conta do usu&aacute;rio

	O Twitter exige que cada site seja registrado para permitir que a API de autentica&ccedil;&atilde;o funcione

	Veja o site para maiores informa&ccedil;&otilde;es: http://www.snipe.net/2009/07/writing-your-first-twitter-application-with-oauth/

	Lista de aplica&ccedil;&otilde;es cadastradas: https://twitter.com/oauth_clients/

	Caso vc n&atilde;o queira permitir essa op&ccedil;&atilde;o, deixe essa vari&aacute;vel vazia, e.x

	$twitteroauth = "";

	Ao registrar a aplica&ccedil;&atilde;o, utilize o endere&ccedil;o do i3geo em Application Website, por exemplo http://meuservidor/i3geo

	Ao registrar utilize como "Callback URL" o valor http://meuservidor/i3geo/pacotes/openid/login.php?login

	Exemplo:

	$twitteroauth = array(
		"consumerkey" => "",
		"consumersecret" => "",
		"requesttokenurl" => "https://twitter.com/oauth/request_token",
		"accesstokenurl" => "https://twitter.com/oauth/access_token",
		"authorizeurl" => "https://twitter.com/oauth/authorize"
	);

	Tipo:
	{array}
*/
$twitteroauth = array(
	"consumerkey" => "",
	"consumersecret" => "",
	"requesttokenurl" => "https://twitter.com/oauth/request_token",
	"accesstokenurl" => "https://twitter.com/oauth/access_token",
	"authorizeurl" => "https://twitter.com/oauth/authorize"
);
/*
	Variavel: mensagemInicia

	Mensagem de inicializa&ccedil;&atilde;o mostrada pelo programa ms_criamapa.php

	Por default &eacute; obtida de um include para permitir a atualiza&ccedil;&atilde;o da vers&atilde;o nos pacotes de corre&ccedil;&atilde;o

	Tipo:
	{string}
*/
include(dirname(__FILE__)."/versao.php");
/*
	Variable: tituloInstituicao

	Nome que ser&aacute; utilizado em alguns cabe&ccedil;alhos e t&iacute;tulos de p&aacute;ginas

	Tipo:
	{string}
*/
$tituloInstituicao = "i3Geo";
/*
	Variable: emailInstituicao

	Endere&ccedil;o de e-mail que pode ser mostrado na interface do mapa

	Tipo:
	{string}
*/
$emailInstituicao = "geoprocessamento@mma.gov.br";
/*
	Variable: googleApiKey

	Chave utilizada pela API do Google maps.

	A API do Google maps e utilizada em algumas funcionalidades do i3geo.
	Vc deve registrar uma chave no site do Google para o seu endereco de servidor web.
	Veja como fazer em:
	http://code.google.com/apis/maps/signup.html

	Tipo:
	{string}
*/
$googleApiKey = "";
/*
Variable: metaestatTemplates

Indica a pasta onde ficam os templates utilizados para a publicacao de mapas. E utilizado pelo sistema de metadados estatisticos.
O default e a pasta /ferramentas/metaestat/templates
A pasta deve estar dentro do diretorio onde esta instalado o i3geo
A pasta com os templates deve conter uma pasta chamada "logos" para guardar as logomarcas utilizadas pelos mapas

Tipo:
{string}
*/
$metaestatTemplates = "/ferramentas/metaestat/templates";
/*
Variable: navegadoresLocais

O i3geo possibilita que os usu&aacute;rios acessem dados geogr&aacute;ficos no servidor diretamente,
navegando pelo sistema de arquivos.
Isso possibilita o acesso aos dados mesmo que n&atilde;o constem na &aacute;rvore de temas

Se "ips" for vazio, qualquer IP podera acessar os arquivos

Para desabilitar essa funcao, mantenha a variavel vazia:

$navegadoresLocais = "";

Exemplo:

$navegadoresLocais = array(
		"drives"=>array(
			"dados"=>"/var/www/i3geo/aplicmap/dados",
			"geodados"=>"/var/www/i3geo/aplicmap"
		),
		"ips"=>array("localhost","1.1.1.1")
	);

Tipo:
{array}
*/
//ver opcao especifica abaixo para o sistema operacional
$navegadoresLocais = "";
/*
Variable: dir_tmp

Caminho completo do diret&oacute;rio tempor&aacute;rio utilizado pelo mapserver.

Tipo:
{string}
*/
//ver opcao especifica abaixo para o sistema operacional
$dir_tmp = "";
/*
Variable: locaplic

Caminho completo onde fica o I3Geo

Tipo:
{string}
*/
$locaplic = dirname(__FILE__);
/*
Variable: locmapserv

Localiza&ccedil;&atilde;o do execut&aacute;vel do Mapserver conforme deve ser acrescentado a URL ap&oacute;s o nome do host.

Essa vari&aacute;vel &eacute; necess&aacute;ria em processos que utilizam o mapserver no modo CGI.

Por exemplo, se o endere&ccedil;o for http://localhost/cgi-bin/mapserv.exe, a vari&aacute;vel dever&aacute; conter apenas /cgi-bin/mapserv.exe

Tipo:
{string}
*/
//ver opcao especifica abaixo para o sistema operacional
$locmapserv = "";
/*
Variable: locmapas

Onde fica o xml, para preencher a guia mapas.

Se for "" ser&aacute; utilizado o sistema de administra&ccedil;&atilde;o do i3geo (veja i3geo/admin).

A guia "Mapas" mostra uma lista de links que permitem abrir mapas espec&iacute;ficos. Essa lista &eacute; utilizada tamb&eacute;m pela vers&atilde;o mobile do i3geo.

Veja a documenta&ccedil;&atilde;o espec&iacute;fica do arquivo mapas.xml para maiores detalhes.

Tipo:
{string}
*/
$locmapas = "";
/*
Variable: R_path

Onde esta o executavel do software R

O R &eacute; um pacote estat&iacute;stico utilizado pelo I3Geo para gera&ccedil;&atilde;o de gr&aacute;ficos e an&aacute;lises estat&iacute;sticas
Se vc n&atilde;o possui o R instalado, comente a linha abaixo

Tipo:
{string}
*/
//ver opcao especifica abaixo para o sistema operacional
$R_path = "";
/*
Variable: R_pathlib

Onde ficam as bibliotecas adicionais necess&aacute;rias ao funcionamento do R

Instale no R as bibliotecas SPATSTAT e DELDIR. No Ubuntu, experimente usar o software RKWard que possui um instalador de bibliotecas

Tipo:
{string}
*/
//ver opcao especifica abaixo para o sistema operacional
$R_libpath = "";
/*
Variable: postgis_mapa

String de conex&atilde;o para acesso aos dados (opcional).

Prefira usar o esquema de criptografia nativo do Mapserver, veja em:

http://mapserver.org/utilities/msencrypt.html

Com o uso opcional dessa vari&aacute;vel &eacute; poss&iacute;vel esconder a string de conex&atilde;o com o banco de dados. O Mapserver
n&atilde;o permite esconder essa string, por isso, no i3geo, foi implementado um esquema de substitui&ccedil;&atilde;o.
Toda vez que um objeto "map" &eacute; criado via PHP Mapscript, a string de conex&atilde;o &eacute; substitu&iacute;da pelo valor de $postgis_mapa.
Se n&atilde;o for desejado a substitui&ccedil;&atilde;o, deixe essa vari&aacute;vel em branco.
Se vc especificar essa vari&aacute;vel, o mapa ser&aacute; for&ccedil;ado a recusar o modo de opera&ccedil;&atilde;o CGI.

Para mais detalhes veja a fun&ccedil;&atilde;o substituiCon em classesphp/funcoes_gerais.php

exemplo -

$postgis_mapa = array(
		"teste"=>"user=geodados password=geodados dbname=geodados host=10.1.1.36 port=5432 options='-c client_encoding=LATIN1'",
		"conexao2"=>"user=geodados password=geodados dbname=geodadosteste host=10.1.1.36 port=5432"
)

No exemplo, vc pode usar "teste" ou "conexao2" no seu mapfile veja em i3geo/temas/testesubstring.map

A chave "metaestat" e utilizada pelo sistema de metadados estatisticos e indica o local onde as tabelas
com os dados estatisticos estao armazenadas. Ate a versao 6.0, a definicao da conexao era feita por meio
do banco de dados de administracao

Se vc n&atilde;o quiser usar essa substitui&ccedil;&atilde;o, deixe como est&aacute; ou use

$postgis_mapa = ""

Tipo:
{array ou  string}
*/
//TODO verificar ao fechar versao
$postgis_mapa = array(
		"teste"=>"user=postgres password=postgres dbname=teste host=localhost port=5432",
		"postgres"=>"user=postgres password=postgres dbname=postgres host=localhost port=5432",
		"metaestat"=>"user=postgres password=postgres dbname=i3geosaude host=localhost port=5432 options='-c client_encoding=LATIN1'",
		"i3geosaude"=>"user=postgres password=postgres dbname=i3geosaude host=localhost port=5432"
);
//
//Voce pode querer usar variaveis de ambiente
//
/*
if(getenv('DB_HOST')){
    $envhost = getenv('DB_HOST');
    $envport = getenv('DB_PORT');
    $envdatabase = getenv('DB_DATABASE');
    $envuser = getenv('DB_USER');
    $envpassw = getenv('DB_PASSWORD');
    $postgis_mapa = array(
        "teste"=>"user={$envuser} password={$envpassw} dbname={$envdatabase} host={$envhost} port={$envport}",
        "postgres"=>"user={$envuser} password={$envpassw} dbname={$envdatabase} host={$envhost} port={$envport}",
        "metaestat"=>"user={$envuser} password={$envpassw} dbname={$envdatabase} host={$envhost} port={$envport} options='-c client_encoding=LATIN1'",
        "i3geosaude"=>"user={$envuser} password={$envpassw} dbname={$envdatabase} host={$envhost} port={$envport}"
    );
}
*/
/*
Variable: utilizacgi

Vari&aacute;vel indicando se o desenho do corpo do mapa ser&aacute; baseado no modo cgi.

Por default, o mapserver desenha o mapa via php, por&eacute;m, pode-se alterar o modo de desenho.

No modo normal, a imagem do mapa &eacute; gerada e armazenada no diret&oacute;rio ms_tmp. Ap&oacute;s a gera&ccedil;&atilde;o da imagem
o endere&ccedil;o do arquivo &eacute; retornado ao mapa (retorno via Ajax) e o javascript se encarrega de alterar o
endere&ccedil;o da imagem no navegador. Com o uso do CGI a imagem n&atilde;o &eacute; gerada, sendo repassado ao navegador
o endere&ccedil;o do cgi acrescentado do nome do mapfile, fazendo com que a imagem seja retornada diretamente.

Em alguns casos o uso do cgi torna a aplica&ccedil;&atilde;o mais r&aacute;pida.

Tipo:
{string}
*/
$utilizacgi = "nao";
/*
Variable: expoeMapfile (depreciado)

Essa vari&aacute;vel controla se o nome do mapfile atual ser&aacute; ou n&atilde;o retornado para a aplica&ccedil;&atilde;o via ajax.

Quando essa vari&aacute;vel for definida como "nao" algumas das funcionalidades do i3geo poder&atilde;o ficar prejudicadas, mas sem comprometimento das fun&ccedil;&otilde;es principais.

Tipo:
{string}
*/
$expoeMapfile = "sim";
/*
Variable: conexaoadmin

Arquivo PHP que define a string de conexao (PDO) com o banco de dados administrativo.

Esse arquivo e incluido no programa conexao.php

O banco de dados administrativo e utilizado para definir coisas como a arvore de temas, arvore de mapas, etc.

O banco de dados, originalmente, e montado em SQLITE, porem, em ambientes corporativos, sugere-se o uso de bancos de dados mais robustos.

Se voce quiser utilizar a conexao default, baseado no SQLITE, mantenha essa variavel vazia.

O programa PHP que estabelece a conexao deve retornar objetos com nomes padronizados. Veja o arquivo classesphp/conexao.php, admin/php/conexao.php e i3geo/admin/php/conexaopostgresql.php para maiores detalhes.

Para criar o banco de dados de administracao utilize http://nome_do_host/i3geo/admin/ferramentas/criabanco/index.php

Exemplos:

$conexaoadmin = $locaplic."/admin/php/conexaopostgresql.php";

Tipo:
{string}

*/
$conexaoadmin = "";
/*
Variable: $esquemaadmin

Indica em qual esquema do banco de dados de administracao estao armazenadas as tabelas do sistema de administracao. Por default, utiliza-se o esquema public.

Tipo:
{string}
*/
$esquemaadmin = "";//"public";
/*
Variable: interfacePadrao

Interface padr&atilde;o utilizada para abrir o mapa.

A interface pode ser um arquivo com as extens&otilde;es .htm .html .phtml

O arquivo deve estar armazenado em i3geo/aplicmap

A interface padr&atilde;o &eacute; utilizada quando n&atilde;o &eacute; definida nenhuma interface via URL.

Tipo:
{string}
*/
$interfacePadrao = "ol.php";
/*
Variable: customDir

 Nome da pasta dentro de &quot;i3geo&quot; utilizada para armazenar os arquivos das interfaces de mapas interativos e outras
 customiza&ccedil;&otilde;es espec&iacute;ficas de determinada instala&ccedil;&atilde;o. O valor padr&atilde;o &eacute; &quot;interface&quot;, ou seja, os arquivos ficam
 na pasta i3geo/interface.

 A p&aacute;gina inicial do i3Geo utiliza essa vari&aacute;vel para montar os links que abrem os mapas.

Tipo:
{string}
*/
$customDir = "interface";
/*
Variable: base

Ender&ccedil;o do arquivo mapfile que ser&aacute; utilizado como base para a cria&ccedil;&atilde;o do mapa

Se vc n&atilde;o usar o caminho completo, o arquivo ser&aacute; procurado em i3geo/aplicmap

Quando n&atilde;o for definido, o i3Geo tentar&aacute; escolher o mapfile mais adequado, conforme o que existir em i3geo/aplicmap

A escolha depende do sistema operacional e da vers&atilde;o do Mapserver.

Vc pode usar essa vari&aacute;vel para customizar a inicializa&ccedil;&atilde;o do mapa.

Tipo:
{string}
*/
$base = "";
/*
Variable: cachedir

Pasta onde ficar&atilde;o armazenadas as imagens geradas pelo i3Geo para os LAYERS que permitem cache.

Os layers que permitem cache s&atilde;o definidos no sistema de administra&ccedil;&atilde;o do i3Geo.

Se cachedir for vazia, ser&aacute; utilizado o default do i3geo (diret&oacute;rio tempor&aacute;rio)

Exemplo

$cachedir = 'c:/temp/cache';

Tipo:
{string}
*/
$cachedir = "";
/*
Variable: ogcwsmap

Nome (caminho completo) do arquivo mapfile que sera utilizado como base para a construcao dos servicos OGC

Esse mapfile deve conter os parametros de OWS conforme o default

Se for vazio sera utilizado o default, que depende da versao do mapserver instalado

Os arquivos default ficam na pasta i3geo/aplicmap/ogcws*.map

Uilize um desses para criar o seu proprio arquivo e customizar os parametros desejados

Tipo:
{string}
*/
$ogcwsmap = "";
/*
 Variable: $i3geo_proxy_server

String com a definicao do servidor de proxy.

O programa classesphp/proxy.php utiliza essa variavel para definir o proxy utilizado pela libcurl

Como no caso: localhost/i3geo/classesphp/proxy.php?url=http://dev.openlayers.org/examples/kml/sundials.kml

Exemplo:

$i3geo_proxy_server = 'proxy:80';

Tipo:
{string}
*/
$i3geo_proxy_server = "";

//valores de variaveis especificas para o sistema operacional em uso
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	$dir_tmp = "c:/ms4w/tmp/ms_tmp";
	$locmapserv = "/cgi-bin/mapserv.exe";
	$R_path = "c:/r/win/bin/R.exe";
	$R_libpath = "c:/r/win/library";
    $ogrOutput = false;
}
else //se for linux
{
	$dir_tmp = "/tmp/ms_tmp";
	if(dirname($locaplic) == "/opt/www/html"){
		$dir_tmp = "/var/tmp/ms_tmp";
	}
	if((dirname($locaplic) == "/var/www") || (dirname($locaplic) == "/var/www/html")){
		$dir_tmp = "/tmp/ms_tmp";
	}
	$locmapserv = "/cgi-bin/mapserv";
	$R_path = "R";
	$R_libpath = "";
}
/**
 * Define o idioma de inicializacao (cookies nao devem ter sido definidos anteriormente)
 *
 * Idiomas disponiveis: pt, en, es
 *
 * Para trocar, altere a linha abaixo
 */
if(empty($_COOKIE["i3geolingua"]) && array_key_exists('HTTP_ACCEPT_LANGUAGE',$_SERVER)){
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	$l = "pt";
	if($lang == "en" || $lang == "es"){
		$l = $lang;
	}
	setcookie('i3geolingua', $l, time()+60*60*24*365, '/');
}
error_reporting(0);
?>
