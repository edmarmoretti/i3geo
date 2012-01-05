<?php
/*
Title: Variáveis de inicialização ms_configura.php

Nesse programa PHP são definidas as variáveis globais principais necessárias ao funcionamento do I3Geo do lado do servidor web.

O ms_configura é incluído em vários programas do i3Geo e os valores das variáveis devem ser editados 
caso a instalação do i3geo tenha sido feita em um diretório diferente do padrão.
No windows o diretório padrão é c:\ms4w\apache\htdocs\i3geo e no linux é /opt/www/html/i3geo

Para verificar a instalação do i3geo utilize o programa i3geo/testainstal.php, que pode fornecer algumas dicas
caso estejam ocorrendo problemas na iniciallização.

As variáveis de configuração são definidas em blocos diferentes conforme o sistema operacional (linux ou windows).

O ms_criamapa.php carrega o ms_configura.php e armazena a maior parte das variáveis na seção. Algumas variáveis
são também fornecidas para o cliente (navegador) na inicialização do mapa e ficam disponíveis em variáveis javascript.


Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: ms_configura.php

*/
/*
	Variavel: linkedinoauth (ainda não implementado)
	
	Parâmetros registrados no Linkedin para permitir que o i3Geo faça autenticação com base na conta do usuário
	
	O Linkedin exige que cada site seja registrado para permitir que a API de autenticação funcione
	
	Veja o site para maiores informações: http://developer.linkedin.com/docs/DOC-1008

	Caso vc não queira permitir essa opção, deixe essa variável vazia, e.x
		
	Ao registrar utilize o valor http://meuservidor/i3geo/pacotes/openid/login.php?login

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
	
	Parâmetros registrados no Facebook para permitir que o i3Geo faça autenticação com base na conta do usuário
	
	O Facebook exige que cada site seja registrado para permitir que a API de autenticação funcione
	
	Veja o site para maiores informações: http://developers.facebook.com/setup/

	Caso vc não queira permitir essa opção, deixe essa variável vazia, e.x
		
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
	
	Parâmetros registrados no Twitter para permitir que o i3Geo faça autenticação com base na conta do usuário
	
	O Twitter exige que cada site seja registrado para permitir que a API de autenticação funcione
	
	Veja o site para maiores informações: http://www.snipe.net/2009/07/writing-your-first-twitter-application-with-oauth/

	Lista de aplicações cadastradas: https://twitter.com/oauth_clients/

	Caso vc não queira permitir essa opção, deixe essa variável vazia, e.x
	
	$twitteroauth = "";
	
	Ao registrar a aplicação, utilize o endereço do i3geo em Application Website, por exemplo http://meuservidor/i3geo
	
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
	
	Mensagem de inicialização mostrada pelo programa ms_criamapa.php
	
	É obtida de um include para permitir a atualização da versão nos pacotes de correção
	
	Tipo:
	{string}
*/
if(file_exists("versao.php"))
{include_once("versao.php");}
else
{$mensagemInicia = "";}
/*
	Variable: tituloInstituicao
	
	Nome que será utilizado em alguns cabeçalhos e títulos de páginas
	
	Tipo:
	{string}
*/
$tituloInstituicao = "i3Geo";
/*
	Variable: emailInstituicao
	
	Endereço de e-mail que pode ser mostrado na interface do mapa
	
	Tipo:
	{string}
*/
$emailInstituicao = "geoprocessamento@mma.gov.br";
/*
	Variable: googleApiKey
	
	Chave utilizada pela API do Google maps.
	
	A API do Google maps é utilizada em algumas funcionalidades do i3geo. Vc deve registrar uma chave
	no site do Google para o seu endereço de servidor web. veja como fazer em:
	http://code.google.com/apis/maps/signup.html
	
	Tipo:
	{string}
*/
$googleApiKey = "ABQIAAAAKguAlmd-hSDulF2T_tfWMxT3OAK09d_ZSDyC36iPGlww-4j-9xSrR2ZZUxVeZC01q8anfe5ntl_U4w";

if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	/*
	Variable: navegadoresLocais
	
	Ip dos usuarios que podem navegar no servidor para acessar arquivos de dados geográficos.
	
	O i3geo possibilita que os usuários acessem dados geográficos no servidor diretamente, navegando pelo sistema de arquivos.
	Isso possibilita o acesso aos dados mesmo que não constem na árvore de temas definida em menutemas/menutemas.xml
	Por segurança, essa funcionalidade só é ativada para números IP específicos, definidos nessa variável.
	
	Para cada IP registrado, deve-se definir os diretórios que serão acessíveis, conforme mostrado abaixo.
	
	A validação do IP é feita com javascript, na inicialização do mapa, a variável javascript objmapa.navegacaoDir é definida como sim (caso $navegadoresLocais for diferente de "") ou nao.
	
	Se objmapa.navegacaoDir for igual a "sim", ou seja, $navegadoresLocais é diferente de "", na guia de adição de temas da interface HTML, será mostrada a opção de navegação. Portanto, se vc não quiser que essa opção seja ativada, mantenha essa variável igual a
	
	$navegadoresLocais = "";
	
	Com a opção ativa na interface do mapa, o ip do cliente é verificado e caso estiver registrado no array, a navegação pelos diretórios do servidor será permitida. Para mais detalhes, veja a ferramenta i3geo/ferramentas/navegacaodir
	 
	Tipo:
	{array}
	*/
	$navegadoresLocais = array(
							array(
							"ip"=>"127.0.0.1",
							"drives"=>array(
										array("caminho"=>"c:/","nome"=>"c"),
										array("caminho"=>"d:/","nome"=>"d")
										)
							)
						);
	/*
	Variable: editores
	
	Ip dos usuarios que podem administrar o i3geo via navegador.
	
	Separe os ips por vírgula. Os usuários que tiverem seus ips listados, poderão editar o diretório i3geo/temas, desde que os mesmos tenham direito de leitura e escrita nesse diretório.
	
	Tipo:
	{array}
	*/
	$editores = array("127.0.0.1","localhost");
	/*
	Variable: dir_tmp
	
	Caminho completo do diretório temporário utilizado pelo mapserver.
	
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
	$locaplic = "c:/ms4w/apache/htdocs/i3geo";
	/*
	Variable: locmapserv
	
	Localização do executável do Mapserver conforme deve ser acrescentado a URL após o nome do host.
	
	Essa variável é necessária em processos que utilizam o mapserver no modo CGI.
	
	Por exemplo, se o endereço for http://localhost/cgi-bin/mapserv.exe, a variável deverá conter apenas /cgi-bin/mapserv.exe
	
	Tipo:
	{string}
	*/
	$locmapserv = "/cgi-bin/mapserv.exe";
	/*
	Variable: locmapas 
	
	Onde fica o xml, para preencher a guia mapas.
	
	Se for "" será utilizado o sistema de administração do i3geo (veja i3geo/admin).	
	
	A guia "Mapas" mostra uma lista de links que permitem abrir mapas específicos. Essa lista é utilizada também pela versão mobile do i3geo.
	
	Veja a documentação específica do arquivo mapas.xml para maiores detalhes.
	
	Tipo:
	{string}
	*/
	$locmapas = "";
	/*
	Variable: R_path
	
	Onde esta o executavel do software R
	
	O R é um pacote estatístico utilizado pelo I3Geo para geração de gráficos e análises estatísticas
	Se vc não possui o R instalado, comente a linha abaixo
	
	Tipo:
	{string}
	*/
	$R_path = "c:/r/win/bin/R.exe";
	/*
	Variable: postgis_mapa
	
	String de conexão para acesso aos dados (opcional).
	
	Prefira usar o esquema de criptografia nativo do Mapserver, veja em:
	
	http://mapserver.org/utilities/msencrypt.html
	
	Com o uso opcional dessa variável é possível esconder a string de conexão com o banco de dados. O Mapserver
	não permite esconder essa string, por isso, no i3geo, foi implementado um esquema de substituição.
	Toda vez que um objeto "map" é criado via PHP Mapscript, a string de conexão é substituída de " " para o valor de $postgis_mapa.
	Se não for desejado a substituição, deixe essa variável em branco.
	Se vc especificar essa variável, o mapa será forçado a recusar o modo de operação CGI.
	
	Para mais detalhes veja a função substituiCon em classesphp/funcoes_gerais.php
	
	Importante - se vc usar o modo de substituição de strings, as interfaces que dependem do modo CGI
	para funcionarem, não serão capazes de acessar os dados. Isso afeta por exemplo, a interface Google Maps e Openlayers.
	
	exemplo - 
	
	$postgis_mapa = array(
		"conexao1"=>"user=geodados password=geodados dbname=geodados host=10.1.1.36 port=5432",
		"conexao2"=>"user=geodados password=geodados dbname=geodadosteste host=10.1.1.36 port=5432"
	)
	
	Tipo:
	{array ou  string}
	*/
	$postgis_mapa = array(
		"teste"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432 options='-c client_encoding=LATIN1'",
		"postgres"=>"user=postgres password=postgres dbname=postgis host=localhost port=5432",
	); //"user=geodados password=geodados dbname=geodados host=10.1.1.36 port=5432";
	/*
	Variable: utilizacgi
	
	Variável indicando se o desenho do corpo do mapa será baseado no modo cgi.
	
	Por default, o mapserver desenha o mapa via php, porém, pode-se alterar o modo de desenho.
	
	No modo normal, a imagem do mapa é gerada e armazenada no diretório ms_tmp. Após a geração da imagem 
	o endereço do arquivo é retornado ao mapa (retorno via Ajax) e o javascript se encarrega de alterar o
	endereço da imagem no navegador. Com o uso do CGI a imagem não é gerada, sendo repassado ao navegador
	o endereço do cgi acrescentado do nome do mapfile, fazendo com que a imagem seja retornada diretamente.
	
	Em alguns casos o uso do cgi torna a aplicação mais rápida.
	
	Tipo:
	{string}
	*/
	$utilizacgi = "nao";
	/*
	 Variable: expoeMapfile
	 
	 Essa variável controla se o nome do mapfile atual será ou não retornado para a aplicação via ajax.
	 
	 Quando essa variável for definida como "nao" algumas das funcionalidades do i3geo poderão ficar prejudicadas, mas sem comprometimento das funções principais.
	 
	 Tipo:
	 {string}
	*/
	$expoeMapfile = "sim";
	/*
	 Variable: conexaoadmin
	 
	 Arquivo PHP que define a string de conexão (PDO) com o banco de dados administrativo.
	 
	 Esse arquivo é incluído no programa i3geo/admin/conexao.php
	 
	 O banco de dados administrativo é utilizado para definir coisas como a árvore de temas, árvore de mapas, etc.
	 
	 O banco de dados, originalmente, é montado em SQLITE, porém, em ambientes corporativos, sugere-se o uso de bancos de daods mais robustos.
	 
	 Se você quiser utilizar a conexão default, baseado no SQLITE, mantenha essa variável vazia.
	 
	 O uso do banco de dados não é obrigatório, uma vez que os arquivos podem ser mantidos em disco (arquivos XML).
	
	 O programa PHP que estabelece a conexão deve retornar objetos com nomes padronizados. Veja o arquivo i3geo/admin/conexao.php para maiores detalhes.
	
	 Exemplos:
	 
	 $conexaoadmin = $locaplic."/admin/php/conexaopostgresql.php";
	 $conexaoadmin = $locaplic."/admin/php/conexaomma.php";
	
	Tipo:
	{string}
	*/
	$conexaoadmin = "";
	/*
	 Variable: interfacePadrao
	 
	 Interface padrão utilizada para abrir o mapa.
	 
	 A interface pode ser um arquivo com as extensões .htm .html .phtml
	 
	 O arquivo deve estar armazenado em i3geo/aplicmap
	 
	 A interface padrão é utilizada quando não é definida nenhuma interface via URL.
	 
	 Tipo:
	 {string}
	*/
	$interfacePadrao = "openlayers.htm";
	/*
	Variable: base
	
	Enderço do arquivo mapfile que será utilizado como base para a criação do mapa
	
	Se vc não usar o caminho completo, o arquivo será procurado em i3geo/aplicmap
	
	Quando não for definido, o i3Geo tentará escolher o mapfile mais adequado, conforme o que existir em i3geo/aplicmap
	
	A escolha depende do sistema operacional e da versão do Mapserver.
	
	Vc pode usar essa variável para customizar a inicialização do mapa.
	*/
	$base = "";
}
else //se for linux
{
	//verifica se está sendo utilizado o diretório "opt" ou "var"
	if(file_exists("/opt/www/html/i3geo/ms_criamapa.php")){
		$dir_tmp = "/var/tmp/ms_tmp";
		$locaplic = "/opt/www/html/i3geo";	
	}
	if(file_exists("/var/www/i3geo/ms_criamapa.php")){
		$dir_tmp = "/tmp/ms_tmp";
		$locaplic = "/var/www/i3geo";
	}
	if(file_exists("/var/www/html/i3geo/ms_criamapa.php")){
		$dir_tmp = "/tmp/ms_tmp";
		$locaplic = "/var/www/html/i3geo";
	}
	$editores = array("127.0.0.1","localhost");
	//$navegadoresLocais = "";
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
	$R_path = "R";//se vc não instalou o R no seu servidor, tente o endereço $R_path = $locaplic."/pacotes/r/linux/r";
	$postgis_mapa = "";
	$utilizacgi = "nao";
	$expoeMapfile = "sim";
	$conexaoadmin = "";//$locaplic."/admin/php/conexaopostgresql.php";
	$interfacePadrao = "openlayers.htm";
	$base = "";
}
?>