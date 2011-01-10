<?php
/*
Title: mapa_controle.php

Controle das requisições em Ajax feitas pelas interfaces normais do i3geo

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis necessárias são obtidas da seção, definida na inicialização do I3Geo.

Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

Para utilizar esse programa fora do i3Geo, envie o parâmetro "map_file=''", dessa forma, evita-se a mensagem de link quebrado.

O parâmetro "funcao" define qual a operação que será executada (veja exemplo abaixo). Esse parâmetro é verificado em um bloco "switch ($funcao)".

Sequência de operações:

pega as variáveis get ou post->

pega as variáveis da seção->

verifica se o debug deve ser ativado->

carrega as extensões do PHP->

cria o objeto cpaint->

carrega as funções de uso mais comuns->

faz uma cópia de segurança do map_file->

roda a função desejada->

retorna os valores obtidos

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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

Arquivo:

i3geo/classesphp/mapa_controle.php

Parametros:

funcao - opção que será executada (veja abaixo a lista de Valores que esse parâmetro pode assumir).

Retorno:

O resultado da operação será retornado em um objeto CPAINT.

A construção da string JSON é feita preferencialmente pelas funções nativas do PHP.
Para efeitos de compatibilidade, uma vez que até a versão 4.2 a string JSON era construida pelo CPAINT,
o objeto CPAINT ainda é definido, porém, a função cpjson verifica se as funções nativas do PHPO (json)
estão instaladas, se estiverem, utiliza-se a função nativa, se não, utiliza-se o CPAINT para gerar o JSON.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

Variáveis de Seção:

dir_tmp - diretório, no servidor, temporário utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
locmapserv - localização, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
locaplic - localização, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
R_path - localização, no servidor, do executável do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
tmpurl - url do diretório temporário, exemplo: http://localhost/ms_tmp/
map_file - endereço, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
mapext - extensão geográfica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
perfil - nome do perfil para controlar os temas que serão visíveis na lista de temas.
mapdir - localização, no servidor, do diretório com o mapfile temporário do mapa atual.
imgdir - localização, no servidor, das imagens temporárias do mapa atual. 
debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL
*/
error_reporting(0);

//sleep(5);

//
//pega as variaveis passadas com get ou post
//
$tempo = microtime(1);
include_once("pega_variaveis.php");
$interfaceTemp = $interface;
//
//inicializa a sessão
//
if ($funcao != "criaMapa")
{
	session_name("i3GeoPHP");
	if (isset($g_sid) && $g_sid != "")
	{session_id($g_sid);}
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{
		if(!is_array($_SESSION[$k]))
		eval("\$".$k."='".$_SESSION[$k]."';");
	}
	$postgis_mapa = $_SESSION["postgis_mapa"];
	if(isset($fingerprint))
	{
		if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $fingerprint)
		{exit;}
	}
}
//
//isso é necessário pois a variável "interface" pode ser utilizada como parâmetro em algumas funções ajax
//nesses casos, é necessário recuperar o valor correto e não da sessão
//
$_SESSION["interface"] = $interfaceTemp;
$interface = $interfaceTemp;
//
//verifica se deve ativar o debug
//
if (isset($debug) && $debug == "sim")
{error_reporting(E_ALL);}
//
//teste de timeout
//
//for($i==0;$i<5000000000;$i++){}
//
//ativa o php mapscript e as extensões necessárias
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once ("carrega_ext.php");
include_once("funcoes_gerais.php");

if ($funcao == "criaMapa")
{
	session_destroy();
	//
	//primeiro é necessário carregar o ms_configura.php para pegar a variável $locaplic
	//
	$d = "";
	if(!file_exists("ms_configura.php"))
	$d = "../";
	include_once($d."ms_configura.php");
	//
	//é necessário mudar o diretório em função dos includes que são feitos pelo ms_criamapa.php
	//
	chdir($locaplic);
	$interfaceTemp = $interface;
	$interface = "mashup";
	include_once("ms_criamapa.php");
	//$cp->set_data(session_id());
	//$cp->return_data();
	$_SESSION["interface"] = $interfaceTemp;
	cpjson(session_id());
	return;
}
if (!isset($map_file))
{
	//nesse caso é necessário criar o diretório temporário e iniciar o mapa
	//$cp->set_data(array("erro"=>"linkquebrado"));
	//$cp->return_data();
	cpjson(array("erro"=>"linkquebrado"));
	exit;
}
include_once("classe_vermultilayer.php");
include_once("classe_estatistica.php");

if (isset($debug) && $debug == "sim")
{error_reporting(E_ALL);}
//
//identifica qual a url do i3geo
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = strtolower($protocolo[0]) . '://'.$_SERVER['HTTP_HOST'];//$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//substitui a string de conexão
//
if($funcao != "recuperamapa")
{
	if(!substituiCon($map_file,$postgis_mapa))
	{
		//$cp->set_data("erro");
		//$cp->return_data();
		cpjson("erro",$cp);
		return;
	}
}
//set_time_limit(240);

//
//faz a busca da função que deve ser executada
//
$retorno = ""; //string que será retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Section: Inicialização

Inicia o mapa.
*/
/*
Valor: INICIA

Inicia o mapa, pegando os parâmetros necessários para a montagem inicial.

<iniciaMapa>
*/
	case "INICIA":
		include_once("mapa_inicia.php");
		//
		//a variável $editores vem do ms_configura.php
		//
		$editor = verificaEditores($editores);
		iniciaMapa();
	break;
/*
Valor: MONTAFLAMINGO

Gera o arquivo xml de configuração para a interface Flamingo.

O arquivo xml é gravado no diretório temporário do mapserver e contém a string de conexão com o gerador de webservices classesphp/flamingoogc.php
Esse gerador, recebe como parâmetro o id da seção atual e transforma o mapfile atual em um webservcie capaz de ser entendido pelo flamingo.

<flamingo.inc>
*/
	case "MONTAFLAMINGO":
		include("flamingo.inc");
		$retorno = $host."/ms_tmp/".basename(dirname($map_file))."/flamingo.xml";
	break;
/*
Valor: OPENLAYERS

Prepara o mapa atual para funcionar na interface openlayers.
*/
	case "OPENLAYERS":
		$interface = "openlayers";
		include_once("mapa_inicia.php");
		iniciaMapa();
	break;
/*
Valor: GOOGLEMAPS

Prepara o mapa atual para funcionar na interface googlemaps.
*/
	case "GOOGLEMAPS":
		$interface = "googlemaps";
		include_once("mapa_inicia.php");
		iniciaMapa();
	break;
/*
Valor: GOOGLEEARTH

Prepara o mapa atual para funcionar na interface googleearth.
*/
	case "GOOGLEEARTH":
		$interface = "googleearth";
		include_once("mapa_inicia.php");
		iniciaMapa();
	break;
/*
Section: Análise

Análise de dados.

<classe_analise.php>
*/
/*
Valor: INCMAPAGEOMETRIAS

Inclui geometrias, armazenadas no formato I3Geo, como um tema no mapa atual.

O mapfile é alterado e salvo novamente com os novos layers.

<Analise->incmapageometrias>
*/
	case "INCMAPAGEOMETRIAS":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$retorno = $m->incmapageometrias($dir_tmp,$imgdir,$lista);
	break;
/*
Valor: FUNCOESGEOMETRIAS

Processa geometrias, armazenadas no formato I3Geo, gerando uma nova geometria.
União, intersecção, etc.

<Analise->funcoesGeometrias>
*/
	case "FUNCOESGEOMETRIAS":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$retorno = $m->funcoesGeometrias($dir_tmp,$imgdir,$lista,$operacao);
		if($recalcareaper == "true"){
			$m->calculaGeometrias($dir_tmp,$imgdir,basename($retorno),"area");
			$m->calculaGeometrias($dir_tmp,$imgdir,basename($retorno),"perimetro");
		}
	break;
/*
Valor: CALCULAGEOMETRIAS

Processa geometrias, armazenadas no formato I3Geo, gerando cálculos.
Área, perímetro, etc.

<Analise->calculaGeometrias>
*/
	case "CALCULAGEOMETRIAS":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$retorno = $m->calculaGeometrias($dir_tmp,$imgdir,$lista,$operacao);
	break;
/*
Valor: LISTAGEOMETRIAS

Gera a lista de geometrias disponíveis para o mapa atual.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

<Temas->listaGeometrias>
*/
	case "LISTAGEOMETRIAS":
		include_once("classe_temas.php");
		if(!isset($tema)){$tema = "";}
		$m = new Temas($map_file,$tema);
		$retorno = $m->listaGeometrias($dir_tmp,$imgdir);
	break;
/*
Valor: CAPTURAGEOMETRIAS

Gera um arquivo de geometrias, no formato I3Geo, para um tema, considerando os elementos selecionados.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

<Temas->capturaGeometrias>
*/	
	case "CAPTURAGEOMETRIAS":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = $m->capturaGeometrias($dir_tmp,$imgdir,$nome);
	break;
/*
Valor: DISSOLVEPOLIGONO

Elimina divisas entre polígonos com o mesmo atributo.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->dissolvePoligono>
*/
	case "DISSOLVEPOLIGONO":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$retorno = $m->dissolvePoligono($item,$locaplic);
		$m->salva();
	break;
/*
Valor: AGRUPAELEMENTOS

Agrupa elementos em um polígono.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->agrupaElementos>

*/
	case "AGRUPAELEMENTOS":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$retorno = $m->agrupaElementos($item,$locaplic);
		$m->salva();
	break;
/*
Valor: PONTOEMPOLIGONO

Cruza um tema pontual com temas poligonais ou raster.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->pontoEmPoligono>
*/
	case "PONTOEMPOLIGONO":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);	
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}			
		$retorno = $m->pontoEmPoligono($temaPt,$temasPo,$locaplic);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: NPTPOL

Conta o número de pontos em polígono cruzando dois temas.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->nptPol>
*/
	case "NPTPOL":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}	
		$retorno = $m->nptPol($temaPt,$temaPo,$locaplic);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: CRIABUFFER

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

<Analise->criaBuffer>
*/	
	case "CRIABUFFER":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		$retorno = $m->criaBuffer($distancia,$locaplic,$unir);
		$m->salva();
		//limpa selecao
		$qyfile = str_replace(".map",".qy",$map_file);
		if (file_exists($qyfile))
		{unlink ($qyfile);}
	break;
/*
Valor: DISTANCIAPTPT

Calcula a distancia entre um ponto de origem e os pontos em um tema.

São considerados apenas os pontos próximos definidos por um buffer.

<Analise->distanciaptpt>
*/	
	case "DISTANCIAPTPT":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$temaorigem,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}			
		$temaoverlay = $m->criaBuffer($distancia,$locaplic);
		$retorno = $m->distanciaptpt($temaorigem,$temadestino,$temaoverlay,$locaplic,$itemorigem,$itemdestino);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: CRIACENTROIDE

Gera centroide dos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com os pontos.

<Analise->criaCentroide>
*/	
	case "CRIACENTROIDE":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}			
		$retorno = $m->criaCentroide($locaplic);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: CENTROMASSA

Calcula o centro médio de uma distribuição de pontos.

Salva o mapa acrescentando um novo layer com o ponto.

<Analise->centroMassa>
*/	
	case "CENTROMASSA":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}			
		$retorno = $m->centroMassa($item);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: ANALISEDISTRIPT

Gera análise de distribuição de pontos.

Executa script R para gerar a imagem.

<Analise->analiseDistriPt>
*/	
	case "ANALISEDISTRIPT":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema2))
		{$tema2 = "";}
		if(!isset($limitepontos))
		{$limitepontos = "";}	
		$m = new Analise($map_file,$tema,$locaplic,$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}			
		$retorno = $m->analiseDistriPt($locaplic,$dir_tmp,$R_path,$numclasses,$tipo,$cori,$corf,$tmpurl,$sigma,$limitepontos,$tema2,$extendelimite);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	break;
/*
Valor: GRADEDEPONTOS

Gera uma grade de pontos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade de coordenadas.

<Analise->gradeDePontos>
*/	
	case "GRADEDEPONTOS":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		$retorno = $m->gradeDePontos($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty);
		$m->salva();
	break;
/*
Valor: GRADEDEPOL

Gera uma grade de polígonos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

<Analise->gradeDePol>
*/	
	case "GRADEDEPOL":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		$retorno = $m->gradeDePol($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty);
		$m->salva();
	break;
/*
Valor: GRADEDEHEX

Gera uma grade de polígonos hexagonais definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

<Analise->gradeDeHex>
*/	
	case "GRADEDEHEX":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		if(!isset($tema)){$tema = "";}
		$retorno = $m->gradeDeHex($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty);
		$m->salva();
	break;
/*
Section: Mapa

<classe_mapa.php>
*/
/*
Valor: PEGAMENSAGENS

Pega as mensagens do metadata 'mensagem'.

<Mapa->pegaMensagens>
*/
	case "PEGAMENSAGENS":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->pegaMensagens();
	break;
/*
Valor: REINICIAMAPA

Reinicia um mapa restaurando a cópia de segurança.
*/	
	case "REINICIAMAPA":
		$qyfile = str_replace(".map",".qy",$map_file);
		if (file_exists($qyfile))
		{unlink ($qyfile);}
		unlink($map_file);
		copy(str_replace(".map","reinc.map",$map_file),$map_file);
		$retorno = "ok";
	break;
/*
Valor: RECUPERAMAPA

Recupera o mapfile de segurança.
*/	
	case "RECUPERAMAPA":
		$qyfile = str_replace(".map",".qy",$map_file);
		if (file_exists($qyfile))
		{unlink ($qyfile);}
		unlink($map_file);
		$nmf = str_replace(".map","seguranca.map",$map_file);
		if(file_exists($nmf))
		{copy($nmf,$map_file);}
		else
		{
			$nmf = str_replace(".map","reinc.map",$map_file);
			copy($nmf,$map_file);
		}
		$retorno = "ok";
	break;
/*
Valor: ATIVALOGO

Ativa ou desativa a marca de logo no mapa.

<Mapa->ativalogo>
*/
	case "ATIVALOGO":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->ativalogo();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: ATIVALEGENDA

Ativa ou desativa a legenda inserida no mapa.

<Mapa->ativalegenda>
*/
	case "ATIVALEGENDA":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->ativalegenda();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: MUDATAMANHO

Muda o tamanho da imagem do mapa atual.

<Mapa->mudaQS>
*/
	case "MUDATAMANHO":
		copiaSeguranca($map_file);
		$map = ms_newMapObj($map_file);
		$map->setsize($largura,$altura);
		if (connection_aborted()){exit();}
		$salvo = $map->save($map_file);
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$m->mudaQS($largura,$altura);
		$retorno = "ok";
	break;
/*
Valor: GRADECOORD

Inclui um tema com a grade de coordenadas.

<Mapa->gradeCoord>
*/
	case "GRADECOORD":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->gradeCoord($intervalo,$corlinha,$larguralinha,$tipolinha,$tamanhotexto,$fonte,$cortexto,$incluitexto,$mascara,$shadowcolor,$shadowsizex,$shadowsizey);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: CONVERTEWS

Converte o mapa atual em um wms.

<Mapa->converteWS>
*/
	case "CONVERTEWS":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($h)){$h = "";}
		$retorno = $m->converteWS($locmapserv,$h);
	break;
/*
Valor: CONVERTEWMSWMC

Converte o mapa atual em um wms e wmc.

<Mapa->converteWMC>
*/
	case "CONVERTEWMSWMC":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($h)){$h = "";}
		$wms = $m->converteWS($locmapserv,$h);
		$wmc = $m->converteWMC($locmapserv,$h);
		$retorno = array("wms"=>$wms,"wmc"=>$wmc);
	break;
/*
Valor: QUERYMAPCOR

Altera a cor de seleção.

<Mapa->corQM>
*/
	case "QUERYMAPCOR":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->corQM($cor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: PEGAQUERYMAPCOR

Pega a cor de seleção atual.

<Mapa->corQM>
*/
	case "PEGAQUERYMAPCOR":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->corQM("");
	break;
/*
Valor: CORFUNDO

Altera a cor do fundo do mapa.

<Mapa->corfundo>
*/
	case "CORFUNDO":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		//no caso da interface openlayers, o mapfile é outro
		$nomefundo = str_replace(".map","fundo.map",$map_file);
		if(file_exists($nomefundo) && $interface == "openlayers")
		{$m = new Mapa($nomefundo);}
		else
		{$m = new Mapa($map_file);}
		$m->corfundo($cor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: PEGACORFUNDO

Pega a cor do fundo do mapa atual.

<Mapa->corfundo>
*/
	case "PEGACORFUNDO":
		include_once("classe_mapa.php");
		//no caso da interface openlayers, o mapfile é outro
		$nomefundo = str_replace(".map","fundo.map",$map_file);
		if(file_exists($nomefundo) && $interface == "openlayers")
		{$m = new Mapa($nomefundo);}
		else
		{$m = new Mapa($map_file);}
		$retorno = $m->corfundo("");
	break;	
/*
Valor: CORPO

Redesenha o mapa.
*/
	case "CORPO":
		redesenhaMapa();
	break;
/*
Valor: CORPOENTORNO

Desenha as imagens do entorno do mapa.

<Mapa->redesenhaEntorno>
*/
	case "CORPOENTORNO":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->redesenhaEntorno();
	break;
/*
Valor: ADICIONATEMAGEORSS

Adiciona um tema baseado em um RSS.

<Mapa->adicionaTemaGeoRSS>
*/
	case "ADICIONATEMAGEORSS":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaGeoRSS($servico,$dir_tmp,$locaplic,$canal);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$retorno = "erro.Nenhum dado espacializado foi encontrado.";
		}
	break;
/*
Valor: ADICIONATEMASHP

Adiciona um tema baseado em um arquivo shape file.

<Mapa->adicionaTemaSHP>
*/
	case "ADICIONATEMASHP":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaSHP($arq);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$retorno = "erro.Nenhum dado espacializado foi encontrado.";
		}
	break;
/*
Valor: ADICIONATEMAIMG

Adiciona um tema baseado em um arquivo de imagem.

<Mapa->adicionaTemaIMG>
*/
	case "ADICIONATEMAIMG":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaIMG($arq);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$retorno = "erro.Nenhum dado espacializado foi encontrado.";
		}
	break;
/*
Valor: LISTATEMAS

Lista os temas existentes em um mapa.

<Mapa->listaTemas>
*/	
	case "LISTATEMAS":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->listaTemas($tipo);
		$retorno = array_reverse($retorno);
	break;
/*
Valor: LISTATEMASLOCAIS

Lista os temas existentes no diretório temporário do mapa atual.

<Mapa->listaTemasLocais>
*/		
	case "LISTATEMASLOCAIS":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->listaTemasLocais();
	break;
/*
Valor: LISTATEMASTIPO

Lista os temas existentes por tipo.

<Mapa->listaTemasTipo>
*/	
	case "LISTATEMASTIPO":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($selecao)){$selecao = "nao";}
		$retorno = $m->listaTemasTipo($tipo,$selecao);
	break;
/*
Valor: LISTATEMASCOMSEL

Lista os temas que possuem seleção.

<Mapa->listaTemasComSel>
*/	
	case "LISTATEMASCOMSEL":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->listaTemasComSel();
	break;
/*
Valor: LIGATEMAS

Liga e desliga temas no mapa atual.

<Mapa->ligaDesligaTemas>
*/		
	case "LIGATEMAS":
  		include_once("classe_mapa.php");
  		copiaSeguranca($map_file);
		$m = new Mapa($map_file,$locaplic);
		$retorno = $m->ligaDesligaTemas($ligar,$desligar,$adicionar);
		$m->salva();
	break;
/*
Valor: ADTEMA

Adiciona um novo tema ao mapa.

<Mapa->adicionaTema>
*/	
	case "ADTEMA":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$salvar = $m->adicionaTema($temas,$locaplic);
		if($salvar)
		{$m->salva();}
		$retorno = "ok";
		if($interface != "openlayers"){
			$teste = testaMapa($map_file,$postgis_mapa);
			if ($teste == "ok")
			{$retorno = "ok";}
			else
			{$retorno = array("erro"=>"A camada nao pode ser adicionada. ".$teste);}
		}
	break;
/*
Valor: EXCLUITEMA

Exclui um tema do mapa.

<Mapa->excluiTemas>
*/
	case "EXCLUITEMA":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$m->excluiTemas($temas);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: ADICIONATEMAWMS

Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.

<Mapa->adicionatemawms>
*/	
	case "ADICIONATEMAWMS":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
	 	$m->adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo,$time);
		$teste = testaMapa($map_file,$postgis_mapa);
		if ($teste == "ok")
		{$retorno = "ok";}
		else
		{$retorno = array("erro"=>"A camada nao pode ser adicionada. ".$teste);}
	break;
/*
Valor: REFERENCIA

Gera a imagem do mapa de referência.
*/	
	case "REFERENCIA":
		$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		if(!isset($ext))
		{$ext = "";}		
		$retorno = retornaReferencia($ext);
	break;
/*
Valor: REFERENCIADINAMICA

Gera a imagem do mapa de referência de forma dinâmica, variando com a escala do mapa atual.
*/	
	case "REFERENCIADINAMICA":
		//$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		if(!isset($ext))
		{$ext = "";}	
		$retorno = retornaReferenciaDinamica($ext);
	break;
/*
Valor: MUDAOUTPUTFORMAT

Muda o OUTPUTFORMAT.

<Mapa->mudaoutputformat>
*/	
	case "MUDAOUTPUTFORMAT":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
	 	$res = $m->mudaoutputformat($tipo);
		if($res != 1)
		{$m->salva();}
		else
		{$res = "erro";}
		$retorno = $res;
	break;
/*
Section: Temas

Processa os layers do mapa.

<classe_temas.php>
*/
/*
Valor: PEGANOMELAYER

Obtém o nome de um layer e de seu arquivo mapfile original.

<Temas->peganomelayer>
*/	
	case "PEGANOMELAYER":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = $m->peganomelayer();
	break;
/*
Valor: PEGADATA

Obtém o valor definido no elemento DATA de um LAYER.

<Temas->pegadata>
*/	
	case "PEGADATA":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = $m->pegadata();
	break;
/*
Valor: ALTERADATA

Altera o valor definido no elemento DATA de um LAYER.

<Temas->alteradata>
*/	
	case "ALTERADATA":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = $m->alteradata($novodata);
		$m->salva();
	break;
/*
Valor: REMOVERGEOMETRIAS

Remove geometrias do diretório temporário.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

<Temas->removerGeometrias>
*/	
	case "REMOVERGEOMETRIAS":
		include_once("classe_temas.php");
		if(!isset($tema)){$tema = "";}
		$m = new Temas($map_file,$tema);
		$retorno = $m->removerGeometrias($dir_tmp,$imgdir,$lista);
	break;
/*
Valor: ALTERAREPRESENTACAO

Altera o tipo de representação cartográfica do tema.

<Temas->alteraRepresentacao>
*/
	case "ALTERAREPRESENTACAO":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->alteraRepresentacao();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: GERADESTAQUE

Gera uma imagem que será utilizada para destacar um determinado tema.

<Temas->geraDestaque>
*/
	case "GERADESTAQUE":
		include_once("classe_temas.php");		
		$m = new Temas($map_file,$tema,"",$ext);
		$retorno = $m->geraDestaque();
	break;
/*
Valor: DOWNLOAD (depreciado, utilize DOWNLOAD2
*/
	case "DOWNLOAD":
		$retorno = downloadTema($map_file,$tema,$locaplic,$dir_tmp,$postgis_mapa);
	break;
/*
Valor: DOWNLOAD2

Gera os arquivos para download de um tema.
*/
	case "DOWNLOAD2":
		$retorno = downloadTema2($map_file,$tema,$locaplic,$dir_tmp,$postgis_mapa);
	break;
/*
Valor: DOWNLOAD3

Gera os arquivos para download de um tema forçando um mapfile vazio.
*/
	case "DOWNLOAD3":
		$retorno = downloadTema2("",$tema,$locaplic,$dir_tmp,$postgis_mapa);
	break;
/*
function: INSEREFEATURE

Insere elemento gráfico em um tema.

<Temas->insereFeature>
*/
	case "INSEREFEATURE":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,"");
		if(!isset($marca)){$marca="";}
		$m->insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$wrap);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: SOBETEMA

Sobe um tema na ordem de desenho.

<Temas->sobeTema>
*/
	case "SOBETEMA":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->sobeTema();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: DESCETEMA

Desce um tema na ordem de desenho.

<Temas->desceTema>
*/
	case "DESCETEMA":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->desceTema();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: FONTETEMA

Busca o link para a fonte do tema

<Temas->fonteTema>
*/
	case "FONTETEMA":
		include_once("classe_temas.php");
		$m = new Temas($map_file,null,$locaplic);
		$retorno = $m->fonteTema($tema);
	break;
/*
Valor: REORDENATEMAS

Reordena os temas baseados na localização de um segundo tema no mapa.

<Temas->reordenatemas>
*/
	case "REORDENATEMAS":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file);
		$m->reordenatemas($lista);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: ZOOMTEMA

Muda a extensão geográfica do mapa de acordo com a abrangência de um tema.

<Temas->zoomTema>
*/
	case "ZOOMTEMA":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}	
		$m->zoomTema();
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: ZOOMSEL

Muda a extensão geográfica do mapa de acordo com a abrangência dos elementos selecionados de um tema.

<Temas->zoomSel>
*/
	case "ZOOMSEL":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}	
		$m->zoomSel();
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: INSEREFILTRO

Inclui um filtro no tema.

<Temas->insereFiltro>
*/
	case "INSEREFILTRO":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if(!isset($testa)){$testa="";}
		{$retorno = $m->insereFiltro($filtro,$testa);}
		if($testa != "sim")
		{
			$m->salva();
			redesenhaMapa();
		}
	break;
/*
Valor: PEGAFILTRO

Pega a string do filtro de um tema.

<Temas->pegaFiltro>
*/
	case "PEGAFILTRO":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$retorno = $m->pegaFiltro();
	break;
/*
Valor: APLICAPROCESSOS

Aplica processos em um tema do tipo imagem

<Temas->aplicaProcessos>
*/					
	case "APLICAPROCESSOS":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->aplicaProcessos($lista);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: INVERTESTATUSLEGENDA

Inverte o metadata CLASSE

<Temas->inverteStatusLegenda>
*/					
	case "INVERTESTATUSLEGENDA":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->inverteStatusLegenda();
		$m->salva();
		redesenhaMapa();
	break;	
/*
Valor: MUDATRANSP

Altera a transparência de um tema

<Temas->mudaTransparencia>
*/					
	case "MUDATRANSP":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->mudaTransparencia($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: MUDANOME

Altera o nome do tema

<Temas->mudaNome>
*/					
	case "MUDANOME":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->mudaNome($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: TEMA2SLD

Mostra na tela o SLD de um tema

<Temas->sld>
*/
	case "TEMA2SLD":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$sld = $m->sld();
		echo header("Content-type: application/xml");
		echo $m->sld();
		exit;
	break;
/*
Valor: GRAFICOTEMA

Gera graficos automaticamente para os elementos de um tema

<Temas->graficotema>
*/					
	case "GRAFICOTEMA":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema,$locaplic);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}
		$m->graficotema($lista,$tamanho,$tipo,$outlinecolor,$offset);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
		redesenhaMapa();
	break;
/*
Section: Classes

Edita as características das classes de um tema.

<classe_alteraclasse.php>
*/
/*
Valor: ALTERACLASSE

Altera uma classe de um tema, aplicando uma nova classificação ou modificando parâmetros de uma ou mais classes.
*/	
	case "ALTERACLASSE":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema,"",$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}
		if ($opcao == "aplicacoresrgb")
		{
			$cores = str_replace("rgb","",$cores);
			$cores = str_replace(")","",$cores);
			$cores = str_replace("(","",$cores);
			$retorno = $m->aplicacoresrgb(explode(";",$cores));
		}			
		if ($opcao == "alteracor")
		{$retorno = $m->alteracor($idclasse,$cor);}		
		if ($opcao == "adicionaopacidade")
		{$retorno = $m->adicionaopacidade();}
		if ($opcao == "alterageometria")
		{$retorno = $m->alterageometria($tipo);}		
		if ($opcao == "adicionaclasse")
		{$retorno = $m->adicionaclasse();}
		if ($opcao == "valorunico")
		{$retorno = $m->valorunico($item,$ignorar);}
		if ($opcao == "intervalosiguais")
		{$retorno = $m->intervalosiguais($item,$nclasses,$ignorar);}
		if ($opcao == "quartis")
		{
			if(!isset($tipoLegenda))
			{$tipoLegenda = "";}
			$retorno = $m->quartis($item,$ignorar,$tipoLegenda);
		}
		if ($opcao == "alteraclasses")
		{
			//esta operação é chamada com POST via cpaint
			error_reporting(E_ALL);
			alteraclassesPost($ids,$nomes,$exps);
			restauraCon($map_file,$postgis_mapa);
			cpjson("");
		}
		if ($opcao == "simbolounico")
		{$retorno = $m->simbolounico();}
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}		
		$salvo = $m->salva();
	break;
/*
Valor: INVERTECORESCLASSES

Inverte a ordem das cores das classes de um tema.

<Alteraclasse->inverteCoresClasses>
*/	
	case "INVERTECORESCLASSES":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$m->inverteCoresClasses();
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: CALCULATAMANHOCLASSES

Calcula o tamanho dos estilos das classes, alterando o tamanho do símbolo.

<Alteraclasse->calculaTamanhoClasses>
*/	
	case "CALCULATAMANHOCLASSES":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$retorno = $m->calculaTamanhoClasses();
		$m->salva();
	break;
/*
Valor: ALTERACORESCLASSES

Altera as cores das classes de um tema conforme uma cor inicial e uma final.

<Alteraclasse->alteraCoresClasses>
*/	
	case "ALTERACORESCLASSES":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$retorno = $m->alteraCoresClasses($cori,$corf);
		$m->salva();
	break;
/*
Valor: INVERTESTATUSCLASSE

Altera o status de desenho de uma classe, tornando-a vi´sivel ou não.

<Alteraclasse->statusClasse>
*/
	case "INVERTESTATUSCLASSE":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$retorno = $m->statusClasse($classe);
		$m->salva();
	break;	
/*
Valor: VERPALETA

Gera cores tendo como base uma cor inicial e uma cor final.

<class.palette.php>
*/	
	case "VERPALETA":
		include_once("class.palette.php");
		$cori = RGB2hex(explode(",",$cori));
		$corf = RGB2hex(explode(",",$corf));
		$myPalette=new palette(array($cori,$corf),($numclasses + 1));
		foreach ($myPalette->colorRGB as $cores)
		{
			$res[] = $cores[0].",".$cores[1].",".$cores[2];
		}
		$retorno = implode("*",$res);
	break;

/*
Section: Edição

Cria arquivos shapefile ou altera suas características.

<classe_shp.php>
*/
/*
Valor: SPHPT2SHP

Converte os elementos de um tema em um arquivo shp.

Acrescenta um novo tema ao mapa.

<SHP->shpPT2shp>
*/
	case "SPHPT2SHP":
		include_once("classe_shp.php");
		$m = new SHP($map_file,$tema,$locaplic,$ext);
		$retorno = $m->shpPT2shp($locaplic,$para);
		$m->salva();
	break;
/*
Valor: LISTAPONTOSSHAPE

Lista os pontos dos elementos de um arquivo shp.

<SHP->listaPontosShape>
*/
	case "LISTAPONTOSSHAPE":
		include_once("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$retorno = $m->listaPontosShape();
	break;
/*
Valor: CRIASHPVAZIO

Cria um shapefile vazio e acrescenta como tema ao mapa.

<SHP->criaSHPvazio>
*/
	case "CRIASHPVAZIO":
		include_once("classe_shp.php");
		$m = new SHP($map_file);
		if(!isset($tituloTema))
		{$tituloTema = "";}
		$retorno = $m->criaSHPvazio($tituloTema);
		$m->salva();
	break;
/*
Valor: INSERESHP

Insere um ponto em um shape file existente.

<SHP->insereSHP>
*/
	case "INSERESHP":
		include_once("classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema);
		if (!isset($projecao)){$projecao = "";}
		$m->insereSHP($xy,$projecao,$item,$valor);
		redesenhaMapa();
	break;
/*
Valor: PEGAXYULTIMOPONTO

Insere um ponto em um shape file tendo como referência o último ponto existente no tema, a direção e a distância.

<SHP->ultimoXY>
*/
	case "PEGAXYULTIMOPONTO":
		include_once("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$retorno = $m->ultimoXY();
	break;

/*
Valor: INSERESHPGRAFICO

Cria um gráfico e insere no mapa em um local clicado no mapa.

Os valores para o gráfico são obtidos do tema indicado na classe. Para cada novo gráfico é criado um tema no mapa.

<SHP->insereSHPgrafico>
*/
	case "INSERESHPGRAFICO":
		include_once("classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema,$locaplic);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
			$m->salva();
		}		
		$retorno = $m->insereSHPgrafico($x,$y,$itens,$width,$inclinacao,$shadow_height);
		if($interface == "googlemaps")
		{
			$m->mapa->setProjection($projMapa);
			$m->salva();
		}		
	break;
/*
Valor: MOSTRAWKT

Gera string wkt de um conjunto de pontos.
*/	
	case "MOSTRAWKT":
		$res = xy2wkt($xy);
		$retorno = array($res["ponto"],$res["linha"],$res["poligono"]);
	break;
/*
Section: Gráficos

Criação de representações gráficas de dados estatísticos.

<graficos.php>
*/
/*
Valor: GRAFICOSELECAO

Pega os dados necessários para a geração dos gráficos da ferramenta seleção

<iniciaDadosGrafico>
*/					
	case "GRAFICOSELECAO":
		include_once("graficos.php");
		if(!isset($exclui))
		{$exclui = "";}
		if(!isset($tipo))
		{$tipo = "nenhum";}
		$retorno = iniciaDadosGrafico($map_file,$tema,$exclui,$itemclasses,$itemvalores,$tipo,false,$ext);
	break;

/*
Valor: FUSAOGRAFICO

Faz a fusão da imagem de um gráfico com a imagem do mapa atual.

<fusaoGrafico>
*/	
	case "FUSAOGRAFICO":
		include_once("graficos.php");
		//$_SESSION["utilizacgi"] = "nao";
		//$utilizacgi = "nao";
		restauraCon($map_file,$postgis_mapa);
		$retorno = fusaoGrafico();
	break;
/*
Valor: GRAFICOESTRELA

Cria um gráfico do tipo estrela.

<graficoEstrela>
*/	
	case "GRAFICOESTRELA":
		include_once("graficos.php");
		$retorno = graficoEstrela();
	break;
/*
Valor: GRAFICOSCATTER

Cria um gráfico de distribuição de pontos.

<graficoScatter>
*/	
	case "GRAFICOSCATTER":
		include_once("graficos.php");
		$retorno = graficoScatter();
	break;
/*
Valor: GRAFICOSCATTERBINS

Cria um gráfico de distribuição de pontos com agrupamento em pixels (bins).

<graficoScatterBins>
*/	
	case "GRAFICOSCATTERBINS":
		include_once("graficos.php");
		$retorno = graficoScatterBins();
	break;
/*
Valor: GRAFICOLINHAS

Cria um gráfico de linhas.

<graficoLinhas>
*/
	case "GRAFICOLINHAS":
		include_once("graficos.php");
		$retorno = graficoLinhas();
	break;
/*
Valor: GRAFICOHIST

Cria um gráfico de histograma.

<graficoHist>
*/
	case "GRAFICOHIST":
		include_once("graficos.php");
		$retorno = graficoHist();
	break;
/*
Valor: GRAFICOBARRAS

Cria um gráfico de barras.

<graficoBarras>
*/
	case "GRAFICOBARRAS":
		include_once("graficos.php");
		$retorno = graficoBarras();
	break;
/*
Valor: GRAFICOPIZZA

Cria um gráfico de pizza.

<graficoPizza>
*/
	case "GRAFICOPIZZA":
		include_once("graficos.php");
		$retorno = graficoPizza();
	break;
/*
Valor: DADOSLINHADOTEMPO

Pega os dados de um tema para geração do gráfico de linha do tempo.

<graficoPizza>
*/
	case "DADOSLINHADOTEMPO":
		include_once("graficos.php");
		if(!isset($ext))
		{$ext = "";}
		$retorno = dadosLinhaDoTempo($map_file,$tema,$ext);
	break;
/*
Section: Menu de temas

Obtém a lista de temas, grupos e sub-grupos.

<classe_menutemas.php>
*/
/*
Valor: LISTATAGS

Pega a lista de tags registrados nos menus de temas.

<Menutemas->listatags>
*/
	case "LISTATAGS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo);
		$retorno = $m->listatags($rss,$nrss);
	break;
/*
Valor: PEGALISTADEMENUS

Pega a lista de menus para incluir na guia adiciona.

<Menutemas->pegaListaDeMenus>
*/
	case "PEGALISTADEMENUS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		$retorno = $m->pegaListaDeMenus();
	break;
/*
Valor: PEGALISTADEGRUPOS

Pega a lista de grupos do menu.

<Menutemas->pegaListaDeGrupos>
*/
	case "PEGALISTADEGRUPOS":
		include_once("classe_menutemas.php");
		if(!isset($urli3geo)){$urli3geo = "";}
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		if(!isset($idmenu)){$idmenu="";}
		if(!isset($listasistemas)){$listasistemas="nao";}
		if(!isset($listasgrupos)){$listasgrupos="nao";}
		$retorno = array("idmenu"=>$idmenu,"grupos"=>$m->pegaListaDeGrupos($idmenu,$listasistemas,$listasgrupos));
	break;
/*
Valor: PEGASISTEMASIDENTIFICACAO

Pega a lista de sistemas especiais de identificação de elementos no mapa

<Menutemas->pegaSistemasI>
*/
	case "PEGASISTEMASIDENTIFICACAO":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,"",$editores,$idioma);
		$retorno = $m->pegaSistemasI();
	break;
/*
Valor: PEGASISTEMAS

Pega a lista de sistemas.

<Menutemas->pegaSistemas>
*/
	case "PEGASISTEMAS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,"",$editores,$idioma);
		$retorno = $m->pegaSistemas();
	break;
/*
Valor: PEGALISTADESUBGRUPOS

Pega a lista de subgrupos de um grupo do menu.

<Menutemas->pegaListaDeSubGrupos>
*/
	case "PEGALISTADESUBGRUPOS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		if(!isset($idmenu)){$idmenu = "";}
		$retorno = $m->pegaListaDeSubGrupos($grupo,$idmenu);
	break;
/*
Valor: PEGALISTADETEMAS

Pega a lista de temas do menu.

<Menutemas->pegaListaDeTemas>
*/
	case "PEGALISTADETEMAS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		if(!isset($idmenu)){$idmenu = "";}
		$retorno = array("temas"=>$m->pegaListaDeTemas($grupo,$subgrupo,$idmenu));
	break;
/*
Valor: PROCURARTEMAS

Procura um tema no menu considerando apenas os existentes em subgruppos.

<Menutemas->procurartemas>
*/
	case "PROCURARTEMAS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		$retorno = $m->procurartemas($procurar);
	break;
/*
Valor: PROCURARTEMAS2

Procura um tema no menu considerando todos os níveis.

<Menutemas->procurartemas2>
*/
	case "PROCURARTEMAS2":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$editores,$idioma);
		$retorno = $m->procurartemas2($procurar);
	break;	
/*
Valor: PEGAMAPAS

Pega a lista de links para outros mapas.

Utilizado no preenchimento da guia mapas

<Menutemas->pegaListaDeMapas>
*/
	case "PEGAMAPAS":
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locaplic,$urli3geo,$idioma);
		$retorno = $m->pegaListaDeMapas($locmapas);
	break;	
/*
Section: Webservices

Processa serviços OGC.

<wmswfs.php>
*/
/*
Valor: GEORSSCANAIS

Lista os canais de um georss.

<georssCanais>
*/
	case "GEORSSCANAIS":
		$retorno = georssCanais($servico,$map_file,$dir_tmp,$locaplic);
	break;
/*
Valor: GETCAPABILITIES

Chama a função getcapabilities e retorna o resultado.

<getcapabilities>
*/
	case "GETCAPABILITIES":
		include_once("wmswfs.php");
		$retorno = getcapabilities();
		restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: GETCAPABILITIES2

Chama a função getcapabilities e retorna o resultado formatado (WMS).

<getcapabilities2>
*/
	case "GETCAPABILITIES2":
		include_once("wmswfs.php");
		$retorno = getcapabilities2();
		restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: GETCAPABILITIES3

Chama a função getcapabilities e retorna o resultado formatado (WFS).

<getcapabilities3>
*/
	case "GETCAPABILITIES3":
		include_once("wmswfs.php");
		$retorno = getcapabilities3();
		restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: TEMASWMS

Retorna a lista de camadas de um WMS formatado em HTML.

<temaswms>
*/	
	case "TEMASWMS":
		include_once("wmswfs.php");
		restauraCon($map_file,$postgis_mapa);
		$retorno = temaswms();
	break;
/*
Valor: LISTALAYERSWMS

Retorna a lista de layers de um WMS.

<listaLayersWMS>
*/	
	case "LISTALAYERSWMS":
		include_once("wmswfs.php");
		$retorno = listaLayersWMS();
	break;
/*
Section: Atributos

Processa os atributos da tabela associada ao tema.

<classe_atributos.php>
*/
/*
Valor: BUSCARAPIDA

Acessa dados de um serviço de geonames.

<buscaRapida>
*/
	case "BUSCARAPIDA":
		$retorno = buscaRapida($servico,$palavra);
	break;
/*
Valor: LISTAITENS

Lista os itens de um tema.

<Atributos->listaItens>
*/
	case "LISTAITENS":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$retorno = $m->listaItens();
	break;
/*
Valor: LISTAVALORESITENS

Procura valores em uma tabela que aderem a uma palavra de busca.

<Atributos->buscaRegistros>
*/	
	case "LISTAVALORESITENS":
		include_once("classe_atributos.php");
		if(!isset($tema)){$tema = "";}
		$m = new Atributos($map_file,$tema,"",$ext);
		if($interface == "googlemaps")
		{$m->mapa->setProjection("init=epsg:4291");}			
		$retorno = $m->buscaRegistros($palavra,$lista,$tipo,$onde);
	break;
/*
Valor: IDENTIFICA

Depreciado na versão 4.2 (utilize "identifica2")

Identifica elementos no mapa.

<Atributos->identifica>
*/
	case "IDENTIFICA":
		if (!isset($tema)){$tema = "";}
		if (!isset($resolucao)){$resolucao = 5;}
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);	
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
			$m->salva();
		}		
		$retorno = $m->identifica($opcao,$xy,$resolucao);
		if($interface == "googlemaps")
		{
			$m->mapa->setProjection($projMapa);
			$m->salva();
		}
	break;
/*
Valor: IDENTIFICA2

Identifica elementos no mapa.

<Atributos->identifica2>
*/
	case "IDENTIFICA2":
		if (!isset($tema)){$tema = "";}
		if (!isset($resolucao)){$resolucao = 5;}
		include_once("classe_atributos.php");
		if(!isset($ext))
		{$ext = "";}
		$m = new Atributos($map_file,$tema,"",$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
			$m->salva();
		}		
		$retorno = $m->identifica2($opcao,$xy,$resolucao,$ext,$listaDeTemas);
		if($interface == "googlemaps")
		{
			$m->mapa->setProjection($projMapa);
			$m->salva();
		}
	break;
/*
Valor: IDENTIFICAUNICO

Identifica elementos no mapa retornando apenas o valor de um único item.

<Atributos->identificaQBP>
*/
	case "IDENTIFICAUNICO":
		if (!isset($resolucao)){$resolucao = 5;}
		include_once("classe_atributos.php");
		if(!isset($ext))
		{$ext = "";}		
		$m = new Atributos($map_file,$tema,"",$ext);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
			$m->salva();
		}		
		$xy = explode(",",$xy);
		$retorno = $m->identificaQBP($tema,$xy[0],$xy[1],$map_file,$resolucao,$item,$tiporetorno="unico");
		if($interface == "googlemaps")
		{
			$m->mapa->setProjection($projMapa);
			$m->salva();
		}		
	break;
/*
Valor: ESTATISTICA

Calcula estatísticas básicas de uma tabela de um tema.

<Atributos->estatDescritivas>
*/	
	case "ESTATISTICA":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema,$locaplic,$ext);
		$retorno = $m->estatDescritivas($item,$exclui);
	break;
/*
Valor: LISTATEXTO

Pega todos os valores dos itens de uma tabela de um tema.

<Atributos->itensTexto>
*/	
	case "LISTATEXTO":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$retorno = $m->itensTexto($tipo);
	break;
/*
Valor: LISTAREGISTROS

Pega todos os valores dos itens de uma tabela de um tema.

<Atributos->listaRegistros>
*/	
	case "LISTAREGISTROS":
		include_once("classe_atributos.php");
		if(isset($ext) && $ext != "" && $interface == "googlemaps" && $geo == false)
		{$ext = projetaExt($map_file,$ext);}		
		$m = new Atributos($map_file,$tema,"",$ext);
		if(!isset($tipo)){$tipo = "";}
		if(!isset($inicio)){$inicio = 0;}
		if(!isset($fim)){$fim = "";}
		if(!isset($tipolista)){$tipolista = "";}
		if(!isset($itemtema)){$itemtema = "";}
		$retorno = $m->listaRegistros($itemtema,$tipo,"",$inicio,$fim,$tipolista);
	break;
/*
Valor: EXTREGISTROS

Pega a extensão geográfica de um registro na tabela de atributos de um tema.

<Atributos->extensaoRegistro>
*/		
	case "EXTREGISTROS":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$retorno = $m->extensaoRegistro($registro);
		$m->salva();
	break;
/*
Section: Navegação

Altera a extensão geográfica do mapa.

<classe_navegacao.php>
*/
/*
Valor: GEO2UTM

Retorna coordenadas utm a partir de coordenadas geo
*/
	case "GEO2UTM":
		$zona = geo2zonaUTM($x);
		$retorno = geo2utm($x,$y,$zona);
	break;
/*
Valor: DESATIVACGI

Desativa o modo cgi.
*/
	case "DESATIVACGI":
		$_SESSION["utilizacgi"] = "nao";
		$retorno = $_SESSION["utilizacgi"];
	break;

/*
Valor: MUDAEXT

Muda a extensão geográfica do mapa.

<Navegacao->mudaExtensao>
*/
	case "MUDAEXT":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		if (!isset($ext) || $ext == "" || $ext == " ")
		{$ext="-76.512593 -39.392568 -29.585185 9.490149";}
		if(!isset($geo))
		{$geo = false;}
		$m = new Navegacao($map_file);
		if(isset($ext) && $ext != "" && $interface == "googlemaps" && $geo == false)
		{$ext = projetaExt($map_file,$ext);}
		$m->mudaExtensao($ext);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: MUDAESCALA

Muda a escala do mapa.

<Navegacao->mudaEscala>
*/
	case "MUDAESCALA":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->mudaEscala($escala);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: PAN

Desloca a visualização de um mapa (pan).

<Navegacao->pan>
*/
	case "PAN":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		if(!isset($tipo)){$tipo = "";}
		$m->pan($x,$y,$escala,$tipo);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: APROXIMA

Aproxima a visualização de um mapa (zoom in)

<Navegacao->aproxima>
*/
	case "APROXIMA":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->aproxima($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: AFASTA

Afasta a visualização de um mapa (zoom out)

<Navegacao->afasta>
*/
	case "AFASTA":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->afasta($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Valor: CRIALENTE

Aplica uma resolução nova ao mapa atual e gera uma imagem para a lente.

<Navegacao->aplicaResolucao>
*/
	case "CRIALENTE":
		include_once("classe_navegacao.php");
		$m = new Navegacao($map_file);
		if(!isset($ext))
		{$ext = "";}
		$ext = projetaExt($map_file,$ext);
		$m->aplicaResolucao($resolucao,$ext);
		$retorno = ($m->mapa->width).",".($m->mapa->height).",".$m->gravaImagemCorpo();
	break;
/*
Valor: LOCALIZAIP

Localiza as coordenadas geográficas do usuário atual.

Baseia-se na identificação do IP e no pacote geoip
*/
	case "LOCALIZAIP":
		copiaSeguranca($map_file);
		$ip = pegaIPcliente();
		$r = ip2geo($ip);
		if($r["latitude"] == null)
		{
			$ip = pegaIPcliente2();
			$r = ip2geo($ip);
		}
		$retorno = $r;
	break;
/*
Valor: ZOOMPONTO

Desloca o centro do mapa para um ponto específico.

<Navegacao->zoomPonto>
*/
	case "ZOOMPONTO":
		include_once("classe_navegacao.php");
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->zoomPonto($xy);
		$m->salva();
		$m = new Temas($map_file,"");
		if(!isset($marca))
		{$marca = "ponto";}
		$m->insereFeature($marca,"POINT",$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte);
		$m->salva();	
		redesenhaMapa();
	break;
/*
Section: Legenda

Processa a legenda do mapa e de temas específicos.

<classe_legenda.php>
*/
/*
Valor: GERACORESCOLOURRAMP

Retorna uma lista de valores RGB de cores geradas com base nsa grades de cores existentes (ver i3geo/symbols/colourramps)
*/
	case "GERACORESCOLOURRAMP":
		include_once("class.palette.php");
		$m = new palette();
		$retorno = $m->geraCoresColourRamp("..",$codigo,$inicio,$fim,$ncores);
	break;
/*
Valor: EDITASIMBOLO

Define as características de simbologia de uma classe, cria, adiciona e exclui estilos.
*/
	case "EDITASIMBOLO":
		include_once("classe_legenda.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Legenda($map_file,$locaplic,$tema);
		if ($opcao == "excluiestilo")
		{
			$retorno = $m->excluiEstilo($classe,$estilo);
			$m->salva();
		}
		if ($opcao == "adicionaestilo")
		{
			$retorno = $m->adicionaEstilo($classe,$estilo);
			$m->salva();
		}
		if ($opcao == "sobeestilo")
		{
			$retorno = $m->sobeEstilo ($classe,$estilo);
			$m->salva();
		}
		if ($opcao == "desceestilo")
		{
			$retorno = $m->desceEstilo ($classe,$estilo);
			$m->salva();
		}
		if ($opcao == "aplica")
		{
			$retorno = $m->aplicaParametro($classe,$estilo,$outlinecolor,$backgroundcolor,$color,$symbolname,$size,$opacidade);
			$m->salva();
		}
		if ($opcao == "listaSimbolos")
		{$retorno = $m->listaSimbolos($tipo,$dir_tmp,$imgdir,$onclick);}
		if ($opcao == "pegaparametros")
		{$retorno = $m->pegaParametros($classe);}
	break;
/*
Valor: EDITALEGENDA

Cria elementos para construir uma legenda no formato de tabela em HTML.

<Legenda->tabelaLegenda>
*/
	case "EDITALEGENDA":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$retorno = $r;
	break;
/*
Valor: CRIALEGENDAHTML

Gera a legenda processando o template HTML.

<Legenda->criaLegenda>
*/
	case "CRIALEGENDAHTML":
		include_once("classe_legenda.php");
		//para efeitos de compatibilidade com versões anteriores
		if(isset($template)){$templateLegenda = $template;}
		$m = new Legenda($map_file,$locaplic,$tema,$templateLegenda);
		$r = $m->criaLegenda();
		if(!$r){$r = "erro. Legenda nao disponivel";}
		$retorno = $r;
	break;
/*
Valor: TESTALEGENDA

Testa os parâmetros de definição da legenda inserida no mapa.

<Legenda->aplicaParametrosLegImg>
*/
	case "TESTALEGENDA":
		include_once("classe_legenda.php");
		copy($map_file,str_replace(".map","testeleg.map",$map_file));
		$m = new Legenda(str_replace(".map","testeleg.map",$map_file));
		$m->aplicaParametrosLegImg($fonte,$imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize);
		$retorno = $m->legendaGrafica();
	break;
/*
Valor: CONTAGEMCLASSE

Acrescenta a contagem de elementos em cada classe.

<Legenda->tabelaLegenda>
*/
	case "CONTAGEMCLASSE":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda("sim");
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$retorno = $r;
	break;
/*
Valor: CRIALEGENDAIMAGEM

Desenha a imagem da legenda.

<Legenda->legendaGrafica>
*/
	case "CRIALEGENDAIMAGEM":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file);
		$retorno = $m->legendaGrafica();
	break;
/*
Valor: PEGAPARAMETROSLEGIMG

Pega os parâmetros da legenda embebida no mapa.

<Legenda->pegaParametrosLegImg>
*/
	case "PEGAPARAMETROSLEGIMG":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file);
		$retorno = $m->pegaParametrosLegImg();
	break;
/*
Valor: APLICAPARAMETROSLEGIMG

Aplica um parâmetro em um estilo de uma classe.

<Legenda->aplicaParametrosLegImg>
*/
	case "APLICAPARAMETROSLEGIMG":
		include_once("classe_legenda.php");
		//
		//no caso da opção de legenda incluida no mapa, o modo cgi não desenha a imagem corretamente
		//
		if($status == 3)
		{
			$_SESSION["utilizacgi"] = "nao";
			$utilizacgi = "nao";
		}
		$m = new Legenda($map_file);
		$retorno = $m->aplicaParametrosLegImg($fonte,$imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize);
		$m->salva();
	break;
/*
Section: Escala gráfica

Processa a escala gráfica do mapa.

<classe_escala.php>
*/
/*
Valor: ESCALAGRAFICA

Gera a imagem da barra de escala.

<Escala->retornaBarraEscala>
*/
	case "ESCALAGRAFICA":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$retorno = $m->retornaBarraEscala();
	break;
/*
Valor: TESTAESCALAGRAFICA

Testa os novos parâmetros de uma barra de escala.

<Escala->testaescalagrafica>
*/
	case "TESTAESCALAGRAFICA":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$retorno = $m->testaescalagrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor);
	break;
/*
Valor: ESCALAPARAMETROS

Pega os parâmetros da barra de escala atual.

<Escala->parametrosBarraEscala>
*/
	case "ESCALAPARAMETROS":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$retorno = $m->parametrosBarraEscala();
	break;
/*
Valor: MUDAESCALAGRAFICA

Aplica novos parâmetros na barra de escala atual.

<Escala->mudaEscalaGrafica>
*/
	case "MUDAESCALAGRAFICA":
		include_once("classe_escala.php");
		copiaSeguranca($map_file);
		$m = new Escala($map_file);
		$retorno = $m->mudaEscalaGrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor);
	break;
/*
Section: Seleção

Seleciona elementos do mapa ou processa a seleção existente.

<classe_selecao.php>
*/
/*
Valor: SELECAOPT

Seleciona elementos utilizando um ponto.

<Selecao->selecaoPT>
*/	
	case "SELECAOPT":
		//error_reporting(E_ALL);
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		if(!isset($xy)){$xy = "";}
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			if($interface == "googlemaps")
			{
				$projMapa = $m->mapa->getProjection();
				$m->mapa->setProjection("init=epsg:4291");
			}
			$ok[] = $m->selecaoPT($xy,$tipo,$tolerancia);
		}
		redesenhaMapa();
	break;
/*
Valor: SELECAOEXT

Seleciona elementos utilizando a extensão do mapa.

<Selecao->selecaoEXT>
*/	
	case "SELECAOEXT":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			if($interface == "googlemaps")
			{
				$projMapa = $m->mapa->getProjection();
				$m->mapa->setProjection("init=epsg:4291");
			}
			$ok[] = $m->selecaoEXT($tipo);
		}
		//$retorno = implode(",",$ok);
		redesenhaMapa();
	break;
/*
Valor: SELECAOBOX

Seleciona elementos utilizando um retângulo.

<Selecao->selecaoBOX>
*/	
	case "SELECAOBOX":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema,$ext);
			if($interface == "googlemaps")
			{
				$projMapa = $m->mapa->getProjection();
				$m->mapa->setProjection("init=epsg:4291");
			}			
			$ok[] = $m->selecaoBOX($tipo,$ext);
		}
		redesenhaMapa();		
	break;

/*
Valor: SELECAOATRIB

Seleciona elementos com base nos atributos.

<Selecao->selecaoAtributos>
*/
	case "SELECAOATRIB":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema,$ext);
		$retorno = $m->selecaoAtributos($tipo,$item,$operador,$valor);
		redesenhaMapa();
	break;
/*
Valor: SELECAOATRIB2

Seleciona elementos com base nos atributos utilizando sintaxe complexa.

<Selecao->selecaoAtributos2>
*/
	case "SELECAOATRIB2":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema,$ext);
		$retorno = $m->selecaoAtributos2($filtro,$tipo);
		redesenhaMapa();
	break;
/*
Valor: SELECAOTEMA

Sleciona elementos de um tema com base em outro tema.

<Selecao->selecaoTema>
*/
	case "SELECAOTEMA":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$temas = explode(",",$tema);
		foreach($temas as $tema)
		{
			$m = new Selecao($map_file,$tema);
			if($interface == "googlemaps")
			{
				$projMapa = $m->mapa->getProjection();
				$m->mapa->setProjection("init=epsg:4291");
			}			
			$ok[] = $m->selecaoTema($temao,$tipo);
		}
		$retorno = implode(",",$ok);
		redesenhaMapa();
	break;
/*
Valor: SELECAOPOLI

Seleção por poligono (chamado via POST).

<Selecao->selecaoPoli>
*/	
	case "SELECAOPOLI":
		//esta operação é chamada com POST via cpaint
		//por isso precisa ser executada com start
		copiaSeguranca($map_file);
		$retorno = selecaoPoli($xs,$ys,$tema,$tipo);
		redesenhaMapa();
		//restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: LIMPASEL

Limpa a seleção existente em um tema.

<Selecao->selecaoLimpa>
*/
	case "LIMPASEL":
		include_once("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$retorno = $m->selecaoLimpa();
		//
		//é necessário obter os parâmetros do mapa para remontar a árvore de camadas 
		//
		redesenhaMapa();		
	break;
/*
Valor: INCLUISEL

Incluí elementos em uma seleção.

<Selecao->incluiSel>
*/
	case "INCLUISEL":
		include_once("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$retorno = $m->incluiSel($ids);
		//
		//é necessário obter os parâmetros do mapa para remontar a árvore de camadas 
		//
		redesenhaMapa();
	break;
/*
Valor: CRIATEMASEL

Cria um novo tema com a seleção atual.

<Selecao->selecao2tema>
*/
	case "CRIATEMASEL":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$retorno = $m->selecao2tema($locaplic,$dir_tmp);
		$m->salva();
	break;
/*
Section: Toponímia

Processa a toponímia de um tema.

<classe_toponimia.php>
*/
/*
Valor: CRIATOPONIMIA

Cria um novo tema com a toponímia do tema atual.

<Toponimia->criaToponimia>
*/	
	case "CRIATOPONIMIA":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		if(!isset($tipo)){$tipo="";}
		$retorno = $m->criaToponimia($item,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$tipo,$wrap);
		if ($tipo != "teste")
		{$m->salva();}
	break;
/*
Valor: ATIVAETIQUETAS

Ativa as etiquetas de um tema.

<Toponimia->ativaEtiquetas>
*/
	case "ATIVAETIQUETAS":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$retorno = $m->ativaEtiquetas($item);
		$m->salva();
	break;
/*
Valor: REMOVEETIQUETAS

Desativa as etiquetas de um tema.

<Toponimia->removeEtiquetas>
*/
	case "REMOVEETIQUETAS":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$retorno = $m->removeEtiquetas();
		$m->salva();
	break;
/*
Section: Outros

Opções de uso geral.
*/
/*
Valor: LISTATRUETYPE

Lista as fontes truetype disponíveis.
*/
	case "LISTATRUETYPE":
		$retorno = listaTrueType();
		restauraCon($map_file,$postgis_mapa);
	break;
/*
Valor: AREAPIXEL

Calcula a área de um pixel da imagem.
*/
	case "AREAPIXEL":
		$retorno = calculaAreaPixel($map_file,$celsize);
	break;
/*
Valor: LISTAEPSG

Pega os códigos de projeção EPSG.

*/
	case "LISTAEPSG":
		$retorno = listaEpsg();
	break;
/*
Valor: LISTADIRETORIOS

Lista os diretórios de um diretório.

*/
	case "LISTADIRETORIOS":
		$retorno = listaDiretorios($diretorio);
	break;
/*
Valor: LISTAARQUIVOS*

Lista os arquivos de um diretório.
*/
	case "LISTAARQUIVOS":
		$retorno = listaArquivos($diretorio);
	break;
/*
Valor: CHAVEGOOGLE

Retorna o valor da chave registrada para a API do Google maps

Essa chave deve ser registrada em i3geo/ms_configura.php
*/	
	case "CHAVEGOOGLE":
		$retorno = $googleApiKey;
	break;
/*
Valor: LISTADRIVES

Pega a lista de drives registrados para o usuário atual.

A lista de drives é definida no ms_configura e permite que o usuário navegue pelos arquivos do servidor.
*/
	case "LISTADRIVES":
		include_once("../ms_configura.php");
		//verifica se está cadastrado
		$ipcliente = pegaIPcliente();
		$retorno = array();
		foreach ($navegadoresLocais as $n)
		{
			if (gethostbyname($n["ip"]) == $ipcliente)
			{$retorno[] = $n["drives"];}	
		}		
	break;

}
if (!connection_aborted())
{
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	//$cp->return_data();
	cpjson($retorno);
}
else
{exit();}
/*
Function: projetaExt

Projeta uma string com coordenadas geográficas para coordenadas métricas

Parametros:

$map_file {string}

$ext {string} - extensão geográfica com valores separados por espaço ou um par de coordenadas x y

Return:

{string}
*/
function projetaExt($map_file,$ext,$separador=" ")
{
	$ext = str_replace($separador," ",$ext);
	$extA = explode(" ",$ext);
	$mapa = ms_newMapObj($map_file);
	$ponto = false;
	if($extA[0] < 180 &&  $extA[0] > -180)
	{
		if(count($extA) == 2)
		{
			$ponto = true;
			$extA[] = $extA[0] + 1;
			$extA[] = $extA[1] + 1;
		}
		$rect = ms_newRectObj();
		$rect->setextent($extA[0],$extA[1],$extA[2],$extA[3]);
		$prjMapa = $mapa->getProjection();
		$projInObj = ms_newprojectionobj("proj=latlong");
		$projOutObj = ms_newprojectionobj($prjMapa);
		$rect->project($projInObj, $projOutObj);
		if($ponto == false)
		{$ext = $rect->minx." ".$rect->miny." ".$rect->maxx." ".$rect->maxy;}
		else
		{$ext = $rect->minx." ".$rect->miny;}
	}
	$ext = str_replace(" ",$separador,$ext);
	return $ext;	
}
/*
Function: alteraclassesPost

Altera as classes de um tema aplicando novos parâmetros como nome e expressão.

Include:
<classe_alteraclasse.php>
*/
function alteraclassesPost($ids,$nomes,$exps)
{
	global $map_file,$tema;
	$m = new Alteraclasse($map_file,$tema);
	$m->alteraclasses($ids,$nomes,$exps);
	$m->salva();
}
/*
Function: selecaoPoli

Seleciona um tema por polígono baseado em uma lista de pontos.

Include:
<classe_selecao.php>
*/
function selecaoPoli($xs,$ys,$tema,$tipo)
{
	global $map_file;
	include_once("classe_selecao.php");
	$temas = explode(",",$tema);
	foreach($temas as $tema)
	{
		$m = new Selecao($map_file,$tema);
		if($interface == "googlemaps")
		{
			$projMapa = $m->mapa->getProjection();
			$m->mapa->setProjection("init=epsg:4291");
		}		
		$ok[] = $m->selecaoPorPoligono($tipo,$xs,$ys);
		if($interface == "googlemaps")
		{$m->mapa->setProjection($projMapa);}
		$m->salva();
	}
	return implode(",",$ok);
}
/*
Function: redesenhaMapa

Redesenha o mapa e retorna os parâmetros do novo mapa.

Include:
<classe_mapa.php>

Parametros:

tipoimagem {String} - tipo de imagem que será gerada nenhum|cinza|sepianormal|sepiaclara
*/
function redesenhaMapa()
{
	global $tempo,$map_file,$tipoimagem,$cp,$postgis_mapa,$utilizacgi,$locmapserv,$interface,$mapexten;
	if($tipoimagem != "nenhum" && $tipoimagem != "")
	{$utilizacgi = "nao";}
	if (connection_aborted()){exit();}
	if($interface == "googleearth" && $mapexten != ""){
		include_once("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->mudaExtensao($mapexten);
		$m->salva();
	}
	include_once("classe_mapa.php");
	$m = New Mapa($map_file,$locaplic);
	$par = $m->parametrosTemas();
	//
	//na interface googlemaps não é necessário gerar a imagem
	//
	if (isset($interface) && ($interface == "googlemaps" || $interface == "openlayers" || $interface == "googleearth"))
	{
		$e = $m->mapa->extent;
		$ext = $e->minx." ".$e->miny." ".$e->maxx." ".$e->maxy;
		$res["mapimagem"] = "";
		$res["mapexten"] = $ext;
		$res["mapres"] = "";
		$res["erro"] = "";
		$res["mapscale"] = "";
		$res["pixelsize"] = "";
		$res["mapimagem"] = "";
		$res["w"] = "";
		$res["h"] = "";
		$res["mappath"] = "";
		$res["mapurl"] = "";		
	}
	else{
		$res = $m->redesenhaCorpo($tipoimagem,$utilizacgi,$locmapserv);
	}
	$res["mensagens"] = $m->pegaMensagens();
	$res["tempo"] = microtime(1) - $tempo;
	restauraCon($map_file,$postgis_mapa);
	ob_clean();
	if ($par == "")
	{$retorno = "erro";}
	else
	{$retorno = array("variaveis"=>$res,"temas"=>$par);}
	cpjson($retorno);
}
?>