<?php
/*
Title: Vari&aacute;veis de inicializa&ccedil;&atilde;o ms_configura.php

Nesse programa PHP s&atilde;o definidas as vari&aacute;veis globais principais necess&aacute;rias ao funcionamento do I3Geo do lado do servidor web.

O ms_configura &eacute; inclu&iacute;do em v&aacute;rios programas do i3Geo e os valores das vari&aacute;veis devem ser editados
caso a instala&ccedil;&atilde;o do i3geo tenha sido feita em um diretório diferente do padr&atilde;o.
No windows o diretório padr&atilde;o &eacute; c:\ms4w\apache\htdocs\i3geo e no linux &eacute; /opt/www/html/i3geo

Para verificar a instala&ccedil;&atilde;o do i3geo utilize o programa i3geo/testainstal.php, que pode fornecer algumas dicas
caso estejam ocorrendo problemas na inicialliza&ccedil;&atilde;o.

As vari&aacute;veis de configura&ccedil;&atilde;o s&atilde;o definidas em blocos diferentes conforme o sistema operacional (linux ou windows).

O ms_criamapa.php carrega o ms_configura.php e armazena a maior parte das vari&aacute;veis na se&ccedil;&atilde;o. Algumas vari&aacute;veis
s&atilde;o tamb&eacute;m fornecidas para o cliente (navegador) na inicializa&ccedil;&atilde;o do mapa e ficam dispon&iacute;veis em vari&aacute;veis javascript.


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
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
i3geo/testamapfile.php
Arquivo: ms_configura.php

*/
/*
	Variavel: linkedinoauth (ainda n&atilde;o implementado)

	Par&acirc;metros registrados no Linkedin para permitir que o i3Geo fa&ccedil;a autentica&ccedil;&atilde;o com base na conta do usu&aacute;rio

	O Linkedin exige que cada site seja registrado para permitir que a API de autentica&ccedil;&atilde;o funcione

	Veja o site para maiores informa&ccedil;&otilde;es: http://developer.linkedin.com/docs/DOC-1008

	Caso vc n&atilde;o queira permitir essa op&ccedil;&atilde;o, deixe essa vari&aacute;vel vazia, e.x

	Ao registrai3geo/testamapfile.phpr utilize o valor http://meuservidor/i3geo/pacotes/openid/login.php?login

	Exemplo:

	$linkedinoauth = array(
		"consumerkey" => "0oQ30ge-ggKarx4HGaXVK118n8mekMBbFYTrC-agGV9hvxUXfeWwS1q7ZMvD-8LL",
		"consumersecret" => "nRGXfHp1XNMt0eCG7tWJpoCcXX1uoZseDtgiU-CRy1ajqipo4KpjjZdDUXmqZGQA"
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
		"consumerkey" => "136279263094148",
		"consumersecret" => "679fc4a007b1d289377fa8af8f7086b6"
	);

	Tipo:
	{array}
*/
$facebookoauth = array(
	"consumerkey" => "136279263094148",
	"consumersecret" => "679fc4a007b1d289377fa8af8f7086b6"
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
		"consumerkey" => "vUvBcsOULjS0ewxuSvbS6w",
		"consumersecret" => "0Hj6uCyycDCeNOgzTUF1bBSel75KtfbnCS4bxWVqaxk",
		"requesttokenurl" => "https://twitter.com/oauth/request_token",
		"accesstokenurl" => "https://twitter.com/oauth/access_token",
		"authorizeurl" => "https://twitter.com/oauth/authorize"
	);

	Tipo:
	{array}
*/
$twitteroauth = array(
	"consumerkey" => "vUvBcsOULjS0ewxuSvbS6w",
	"consumersecret" => "0Hj6uCyycDCeNOgzTUF1bBSel75KtfbnCS4bxWVqaxk",
	"requesttokenurl" => "https://twitter.com/oauth/request_token",
	"accesstokenurl" => "https://twitter.com/oauth/access_token",
	"authorizeurl" => "https://twitter.com/oauth/authorize"
);
/*
	Variavel: mensagemInicia

	Mensagem de inicializa&ccedil;&atilde;o mostrada pelo programa ms_criamapa.php

	&Eacute; obtida de um include para permitir a atualiza&ccedil;&atilde;o da vers&atilde;o nos pacotes de corre&ccedil;&atilde;o

	Tipo:
	{string}
*/
if(file_exists("versao.php"))
{include_once("versao.php");}
else
{$mensagemInicia = "";}
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

	A API do Google maps &eacute; utilizada em algumas funcionalidades do i3geo. Vc deve registrar uma chave
	no site do Google para o seu endere&ccedil;o de servidor web. veja como fazer em:
	http://code.google.com/apis/maps/signup.html

	Tipo:
	{string}
*/
$googleApiKey = "ABQIAAAAKguAlmd-hSDulF2T_tfWMxT3OAK09d_ZSDyC36iPGlww-4j-9xSrR2ZZUxVeZC01q8anfe5ntl_U4w";

if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	/*
	Variable: navegadoresLocais (DEPRECIADO)

	Ip dos usuarios que podem navegar no servidor para acessar arquivos de dados geogr&aacute;ficos.

	O i3geo possibilita que os usu&aacute;rios acessem dados geogr&aacute;ficos no servidor diretamente, navegando pelo sistema de arquivos.
	Isso possibilita o acesso aos dados mesmo que n&atilde;o constem na &aacute;rvore de temas definida em menutemas/menutemas.xml
	Por seguran&ccedil;a, essa funcionalidade só &eacute; ativada para n&uacute;meros IP espec&iacute;ficos, definidos nessa vari&aacute;vel.

	Para cada IP registrado, deve-se definir os diretórios que ser&atilde;o acess&iacute;veis, conforme mostrado abaixo.

	A valida&ccedil;&atilde;o do IP &eacute; feita com javascript, na inicializa&ccedil;&atilde;o do mapa, a vari&aacute;vel javascript objmapa.navegacaoDir &eacute; definida como sim (caso $navegadoresLocais for diferente de "") ou nao.

	Se objmapa.navegacaoDir for igual a "sim", ou seja, $navegadoresLocais &eacute; diferente de "", na guia de adi&ccedil;&atilde;o de temas da interface HTML, ser&aacute; mostrada a op&ccedil;&atilde;o de navega&ccedil;&atilde;o. Portanto, se vc n&atilde;o quiser que essa op&ccedil;&atilde;o seja ativada, mantenha essa vari&aacute;vel igual a

	$navegadoresLocais = "";

	Com a op&ccedil;&atilde;o ativa na interface do mapa, o ip do cliente &eacute; verificado e caso estiver registrado no array, a navega&ccedil;&atilde;o pelos diretórios do servidor ser&aacute; permitida. Para mais detalhes, veja a ferramenta i3geo/ferramentas/navegacaodir

	Tipo:
	{array}
	*/
	$navegadoresLocais = "depreciado";

	/*
	Variable: i3geomaster

	Usu&aacute;rio e senha que podem realizar opera&ccedil;&otilde;es de administra&ccedil;&atilde;o inicial do i3Geo, como a cria&ccedil;&atilde;o do banco de dados de administra&ccedil;&atilde;o ou opera&ccedil;&otilde;es cr&iacute;ticas do sistema

	*/
	$i3geomaster = array(
			array("usuario"=>"admin", "senha"=>"admin")
	);
	/*
	Variable: dir_tmp

	Caminho completo do diretório tempor&aacute;rio utilizado pelo mapserver.

	Tipo:
	{string}
	*/
	$dir_tmp = "c:/ms4w/tmp/ms_tmp";
	/*
	Variable: locaplic

	Caminho completo onde fica o I3Geo

	Tipo:
	{string}
	*/
	$locaplic = __DIR__;//"c:/ms4w/apache/htdocs/i3geo";
	/*
	Variable: locmapserv

	Localiza&ccedil;&atilde;o do execut&aacute;vel do Mapserver conforme deve ser acrescentado a URL após o nome do host.

	Essa vari&aacute;vel &eacute; necess&aacute;ria em processos que utilizam o mapserver no modo CGI.

	Por exemplo, se o endere&ccedil;o for http://localhost/cgi-bin/mapserv.exe, a vari&aacute;vel dever&aacute; conter apenas /cgi-bin/mapserv.exe

	Tipo:
	{string}
	*/
	$locmapserv = "/cgi-bin/mapserv.exe";
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
	$R_path = "c:/r/win/bin/R.exe";
	/*
	Variable: R_pathlib

	Onde ficam as bibliotecas adicionais necess&aacute;rias ao funcionamento do R

	Instale no R as bibliotecas SPATSTAT e DELDIR. No Ubuntu, experimente usar o software RKWard que possui um instalador de bibliotecas

	Tipo:
	{string}
	*/
	$R_libpath = "c:/r/win/library";
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
		"teste"=>"user=geodados password=geodados dbname=geodados host=10.1.1.36 port=5432",
		"conexao2"=>"user=geodados password=geodados dbname=geodadosteste host=10.1.1.36 port=5432"
	)

	No exemplo, vc pode usar "teste" ou "conexao2" no seu mapfile veja em i3geo/temas/testesubstring.map

	Se vc n&atilde;o quiser usar essa substitui&ccedil;&atilde;o, deixe como est&aacute; ou use

	$postgis_mapa = ""

	Tipo:
	{array ou  string}
	*/
	$postgis_mapa = array(
		"teste"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432 options='-c client_encoding=LATIN1'",
		"postgres"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432",
	);
	/*
	Variable: utilizacgi

	Vari&aacute;vel indicando se o desenho do corpo do mapa ser&aacute; baseado no modo cgi.

	Por default, o mapserver desenha o mapa via php, por&eacute;m, pode-se alterar o modo de desenho.

	No modo normal, a imagem do mapa &eacute; gerada e armazenada no diretório ms_tmp. Após a gera&ccedil;&atilde;o da imagem
	o endere&ccedil;o do arquivo &eacute; retornado ao mapa (retorno via Ajax) e o javascript se encarrega de alterar o
	endere&ccedil;o da imagem no navegador. Com o uso do CGI a imagem n&atilde;o &eacute; gerada, sendo repassado ao navegador
	o endere&ccedil;o do cgi acrescentado do nome do mapfile, fazendo com que a imagem seja retornada diretamente.

	Em alguns casos o uso do cgi torna a aplica&ccedil;&atilde;o mais r&aacute;pida.

	Tipo:
	{string}
	*/
	$utilizacgi = "nao";
	/*
	 Variable: expoeMapfile

	 Essa vari&aacute;vel controla se o nome do mapfile atual ser&aacute; ou n&atilde;o retornado para a aplica&ccedil;&atilde;o via ajax.

	 Quando essa vari&aacute;vel for definida como "nao" algumas das funcionalidades do i3geo poder&atilde;o ficar prejudicadas, mas sem comprometimento das fun&ccedil;&otilde;es principais.

	 Tipo:
	 {string}
	*/
	$expoeMapfile = "sim";
	/*
	 Variable: conexaoadmin

	 Arquivo PHP que define a string de conex&atilde;o (PDO) com o banco de dados administrativo.

	 Esse arquivo &eacute; inclu&iacute;do no programa i3geo/admin/conexao.php

	 O banco de dados administrativo &eacute; utilizado para definir coisas como a &aacute;rvore de temas, &aacute;rvore de mapas, etc.

	 O banco de dados, originalmente, &eacute; montado em SQLITE, por&eacute;m, em ambientes corporativos, sugere-se o uso de bancos de daods mais robustos.

	 Se voc&ecirc; quiser utilizar a conex&atilde;o default, baseado no SQLITE, mantenha essa vari&aacute;vel vazia.

	 O uso do banco de dados n&atilde;o &eacute; obrigatório, uma vez que os arquivos podem ser mantidos em disco (arquivos XML).

	 O programa PHP que estabelece a conex&atilde;o deve retornar objetos com nomes padronizados. Veja o arquivo i3geo/admin/conexao.php para maiores detalhes.

	 Exemplos:

	 $conexaoadmin = $locaplic."/admin/php/conexaopostgresql.php";
	 $conexaoadmin = $locaplic."/admin/php/conexaomma.php";

	Tipo:
	{string}

	*/
	$conexaoadmin = "";
	/*
	Variable: $esquemaadmin

	Indica em qual esquema do banco de dados de administra&ccedil;&atilde;o est&atilde;o armazenadas as tabelas do sistema de administra&ccedil;&atilde;o. Por default, utiliza-se o esquema public.

	Tipo:
	{string}
	*/
	$esquemaadmin = "";
	/*
	 Variable: interfacePadrao

	 Interface padr&atilde;o utilizada para abrir o mapa.

	 A interface pode ser um arquivo com as extens&otilde;es .htm .html .phtml

	 O arquivo deve estar armazenado em i3geo/aplicmap

	 A interface padr&atilde;o &eacute; utilizada quando n&atilde;o &eacute; definida nenhuma interface via URL.

	 Tipo:
	 {string}
	*/
	$interfacePadrao = "openlayers.htm";
	/*
	Variable: base

	Ender&ccedil;o do arquivo mapfile que ser&aacute; utilizado como base para a cria&ccedil;&atilde;o do mapa

	Se vc n&atilde;o usar o caminho completo, o arquivo ser&aacute; procurado em i3geo/aplicmap

	Quando n&atilde;o for definido, o i3Geo tentar&aacute; escolher o mapfile mais adequado, conforme o que existir em i3geo/aplicmap

	A escolha depende do sistema operacional e da vers&atilde;o do Mapserver.

	Vc pode usar essa vari&aacute;vel para customizar a inicializa&ccedil;&atilde;o do mapa.
	*/
	$base = "";
	/*
	Variable: cachedir

	Pasta onde ficar&atilde;o armazenadas as imagens geradas pelo i3Geo para os LAYERS que permitem cache.

	Os layers que permitem cache s&atilde;o definidos no sistema de administra&ccedil;&atilde;o do i3Geo.

	Se cachedir for vazia, ser&aacute; utilizado o default do i3geo (diretório tempor&aacute;rio)

	Exemplo

	$cachedir = 'c:/temp/cache';
	*/
	$cachedir = "";
}
else //se for linux
{
	//verifica se est&aacute; sendo utilizado o diretório "opt" ou "var"
	$locaplic = __DIR__;
	if(dirname($locaplic) == "/opt/www/html"){
		$dir_tmp = "/var/tmp/ms_tmp";
	}
	if((dirname($locaplic) == "/var/www") || (dirname($locaplic) == "/var/www/html")){
		$dir_tmp = "/tmp/ms_tmp";
	}
	$i3geomaster = array(
				array("usuario"=>"admin", "senha"=>"admin")
			);

	$navegadoresLocais = array(
							array(
								"ip"=>"127.0.0.1",
								"drives"=>array(
									array("caminho"=>"/home","nome"=>"home"),
									array("caminho"=>"/tmp","nome"=>"tmp")
								)
							)
						);
	$locmapserv = "/cgi-bin/mapserv";
	$R_path = "R";
	$R_libpath = "";
	$postgis_mapa = array(
		"teste"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432 options='-c client_encoding=LATIN1'",
		"postgres"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432",
	);
	$utilizacgi = "nao";
	$expoeMapfile = "sim";
	$conexaoadmin = "";//$locaplic."/admin/php/conexaopostgresql.php";
	$esquemaadmin = "";
	$interfacePadrao = "openlayers.htm";
	$base = "";
	$cachedir = "";
}
?>