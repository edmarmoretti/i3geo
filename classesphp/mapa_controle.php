<?php
/*
Title: mapa_controle.php

Controle das requisições em Ajax feitas pelas interfaces normais do i3geo

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

As principais variáveis são obtidas da seção, definida na inicialização do I3Geo. Se a variável $map_file não for enviada, o retorno é uma mensagem linkquebrado e o fim do programa.

Para utilizar esse programa fora do I3Geo, envie o parâmetro "map_file=''", dessa forma, evita-se a mensagem de link quebrado.

O parâmetro "funcao" define qual a operação que será executada (veja exemplo abaixo). esse parâmetro é verificado em um bloco "switch ($funcao)".

Sequência de operações:

pega as variáveis get ou post->pega as variáveis da seção->verifica se o debug deve ser ativado->carrega as extensões doPHP->cria o objeto cpaint->carrega as funções de uso mais comuns->faz uma cópia de segurança do map_file->roda a função desejada->retorna os valores obtidos

About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

About: Parâmetros

funcao - opção que será executada.

Retorno:

cp - o resultado da operação será retornado em um objeto CPAINT.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

About: Variáveis de Seção

dir_tmp - diretório, no servidor, temporário utilizado pelo I3Geo, exemplo: c:/ms4w/tmp/ms_tmp
temasdir - diretório, no servidor, onde ficam os arquivos map_file de cada tema, exemplo: c:/ms4w/apache/htdocs/i3geo/temas
temasaplic - diretório, no servidor, onde ficam os arquivos de inicialização, exemplo: c:\ms4w\apache\htdocs\i3geo\aplicmap
locmapserv - localização, no servidor, do CGI, exemplo: /cgi-bin/mapserv.exe
locaplic - localização, no servidor, do I3Geo, exemplo: c:/ms4w/apache/htdocs/i3geo
locsistemas - localização do xml com a llista de temas, exemplo: /menutemas/sistemas.xml
locidentifica - localilzação do xml que define os sistemas adicionais incluídos na opção de identificação, exemplo: /menutemas/identifica.xml
R_path - localização, no servidor, do executável do pacote R, exemplo: c:/ms4w/apache/htdocs/i3geo/pacotes/r/win/bin/R.exe
imgurl - url das imagens geradas pelo mapa, exemplo: http://localhost/ms_tmp/imgTVHbdijFMk/
tmpurl - url do diretório temporário, exemplo: http://localhost/ms_tmp/
map_file - endereço, no servidor, do mapfile atual, exemplo: c:/ms4w/tmp/ms_tmp/TVHbdijFMk/TVHbdijFMk.map
mapext - extensão geográfica do mapa atual, exemplo: -76.5125927 -39.3925675209 -29.5851853 9.49014852081
perfil - nome do perfil para controlar os temas que serão visíveis na lista de temas.
mapdir - localização, no servidor, do diretório com o mapfile temporário do mapa atual.
imgdir - localização, no servidor, das imagens temporárias do mapa atual. 
debug - (pode ser definido como "sim" indica se o erro_reporting deve ser definido como E_ALL

File: i3geo/classesphp/mapa_controle.php

19/6/2007

Include:
<pega_variaveis.php>, <carrega_ext.php>, <cpaint2.inc.php>, <classe_vermultilayer.php>, <classe_estatistica.php>, <funcoes_gerais.php>

*/
error_reporting(0);

//sleep(5);

//
//pega as variaveis passadas com get ou post
//
$tempo = microtime(1);
include_once("pega_variaveis.php");
//
//inicializa a sessão
//
if ($funcao != "criaMapa")
{
	session_name("i3GeoPHP");
	if (isset($g_sid) && $g_sid != "")
	{
		session_id($g_sid);
	}
	session_start();
	foreach(array_keys($_SESSION) as $k)
	{
		eval("\$".$k."='".$_SESSION[$k]."';");
	}
	if(isset($fingerprint))
	{
		if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $fingerprint)
		{exit;}
	}
}
//
//verifica se deve ativar o debug
//
if (isset($debug) && $debug == "sim")
{error_reporting(E_ALL);}
//
//ativa o php mapscript e as extensões necessárias
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once ("carrega_ext.php");
include_once("../pacotes/cpaint/cpaint2.inc.php");
//
//cria objeto cpaint para uso com ajax
//
$cp = new cpaint();
$cp->set_data("");
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
	$interface = "mashup";
	include_once("ms_criamapa.php");
	$cp->set_data(session_id());
	$cp->return_data();
	return;
}	
if (!isset($map_file))
{
	//nesse caso é necessário criar o diretório temporário e iniciar o mapa
	$cp->set_data("linkquebrado");
	$cp->return_data();
	exit;
}
include_once("classe_vermultilayer.php");
include_once("classe_estatistica.php");
include_once("funcoes_gerais.php");
//
//identifica qual a url do i3geo
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0] . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/classesphp/mapa_controle.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//substitui a string de conexão
//
substituiCon($map_file,$postgis_mapa);

//set_time_limit(240);

//
//faz a busca da função que deve ser executada
//
switch ($funcao)
{
/*
Section: Inicialização

Inicia o mapa.
*/
/*
Property: inicia

Inicia o mapa, pegando os parâmetros necessários para a montagem inicial.

Include:
<mapa_inicia.php>
*/
	case "inicia":
		include_once("mapa_inicia.php");
		$cp->register('iniciaMapa');
		$cp->start();
		if ($cp->get_data() == "")
		{$cp->set_data("erro");}
	break;
/*
Property: montaFlamingo

Gera o arquivo xml de configuração para a interface Flamingo.

O arquivo xml é gravado no diretório temporário do mapserver e contém a string de conexão com o gerador de webservices classesphp/flamingoogc.php
Esse gerador, recebe como parâmetro o id da seção atual e transforma o mapfile atual em um webservcie capaz de ser entendido pelo flamingo.
*/
	case "montaFlamingo":
		$string1 = "<?xml version='1.0' encoding='UTF-8'?>";
		$string1 .= 
'<FLAMINGO xmlns:fmc="fmc" lang="en" languages="en" tooltipdelay="500">
<fmc:Logo id="logo"/>
<fmc:Coordinates right="right" top="top" decimals="4" listento="map">
<style id=".xy" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
<string id="xy">
<en>
<![CDATA[x:[x]<br>y:[y]]]>
</en>
</string>
</fmc:Coordinates>
<fmc:Window skin="g" top="60" right="right -100" width="300" bottom="bottom -70" canresize="true" canclose="true" title="Identificação" visible="false">
<fmc:IdentifyResultsHTML width="100%" height="100%" listento="map">
<style id=".bold" font-family="verdana" font-size="12px" color="#333333" display="block" font-weight="bold"/>
<style id=".normal" font-family="verdana" font-size="11px" color="#333333" display="block" font-weight="normal"/>
<style id=".uitleg" font-family="verdana" font-size="11px" color="#0033cc" display="block" font-weight="normal" font-style="italic"/>
</fmc:IdentifyResultsHTML>
</fmc:Window>
<fmc:Scalebar id="sbkm" skin="style1" left="30" bottom="bottom" width="200" units=" km" magicnumber="1000" listento="map">
<style id=".label" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
<style id=".units" font-family="verdana" font-size="10px" color="#555555" display="block" font-weight="normal"/>
</fmc:Scalebar>
<fmc:ToolGroup left="30" top="0" tool="zoom" listento="map">
<fmc:ToolZoomin id="zoom" title="aproxima"/>
<fmc:ToolZoomout left="30"/>
<fmc:ToolSuperPan left="60"/>
<fmc:ToolMeasure left="90" units=" m" magicnumber="1" decimals="0"/>
</fmc:ToolGroup>
<fmc:ButtonPrev right="210" top="2" listento="map"/>
<fmc:ButtonNext right="240" top="2" listento="map"/>
<fmc:ButtonFull right="270" top="2" listento="map"/>
<fmc:ZoomerV left="5" top="40" height="163" listento="map"/>
<fmc:MonitorLayer id="monitor" left="230" top="55" listento="map">
<style id=".text" font-family="verdana" font-size="12px" color="#666666" display="block" font-weight="normal"/>
<string id="waiting" en="Criando o mapa..."/>
<string id="loading" en="Redesenhando [percentage]%..."/>
</fmc:MonitorLayer>
<fmc:Map id="overview" movequality="HIGH" right="right" bottom="bottom" width="150" height="150" extent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401" fullextent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401">
<fmc:LayerOverview listento="map" followfactor="10000"/>
<fmc:LayerImage id="brasil" imageurl="http://mapas.mma.gov.br/i3geo/imagens/referencia1.png" extent="-79.8713331401,-41.7736536401,-26.2264448599,11.8712346401" />
</fmc:Map>

<fmc:Container borderwidth="0" bordercolor="#b8b8b8" left="left" top="top" bottom="bottom" right="right">
	<fmc:BorderNavigation skin="F1" width="100%" height="100%" listento="map"/>
	<fmc:Map id="map" movequality="HIGH" conform="true" mapunits="DECIMALDEGREES" width="100%" height="100%" fullextent="-180,-90,180,90"  extent="-76.5125927,-39.3925675209,-29.5851853,9.49014852081"  >
		<fmc:LayerIdentifyIcon/>
		<fmc:LayerGrid gridwidth="10" gridheight="10" minscale="11000"/>
		<fmc:LayerGrid gridwidth="5" gridheight="5" minscale="5000" maxscale="11000"/>
		<fmc:LayerGrid gridwidth="2" gridheight="2" minscale="1000" maxscale="5000"/>
		<fmc:LayerGrid gridwidth="1" gridheight="1" minscale= "500" maxscale="1000"/>
		<fmc:LayerGrid gridwidth="0.5" gridheight="0.5" minscale="100" maxscale="500"/>
		<fmc:LayerGrid gridwidth="0.1" gridheight="0.1" maxscale="100"/>
		<fmc:LayerOGWMS id="OG3"  format="PNG" url="';
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$host = $protocolo[0]."://".$_SERVER['HTTP_HOST'];
	//include_once("../ms_configura.php");
	$string2 = $host."/i3geo/classesphp/flamingoogc.php?g_sid=".$g_sid;
	$string3 = '&WMS=OGC:WMS&SERVICE=WMS&VERSION=1.1.0&SRS=EPSG:4291&EXCEPTIONS=INIMAGE&BGCOLOR=0xF0F0F0" LAYERS="copyright"/>
	</fmc:Map>
</fmc:Container>
</FLAMINGO>';
	$stringFinal = $string1.$string2.$string3;
	$arq = dirname($map_file)."/flamingo.xml";
	$fp = fopen($arq,"w");
	fwrite($fp,$stringFinal);
	fclose($fp);
	$cp->set_data($host."/ms_tmp/".basename(dirname($map_file))."/flamingo.xml");
	break;
/*
Section: Análise de geometrias

Opções utilizadas no sistema de análise de geometrias.
*/
/*
Property: incmapageometrias

Incluí geometrias, armazenadas no formato I3Geo, como um tema no mapa atual.

O mapfile é alterado e salvo novamente com os novos layers.

Include:
<classe_analise.php>
*/
	case "incmapageometrias":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->incmapageometrias($dir_tmp,$imgdir,$lista);
		$cp->set_data($resultado);
	break;
/*
Property: funcoesGeometrias

Processa geometrias, armazenadas no formato I3Geo, gerando uma nova geometria.
União, intersecção, etc.

Include:
<classe_analise.php>
*/
	case "funcoesGeometrias":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->funcoesGeometrias($dir_tmp,$imgdir,$lista,$operacao);
		$cp->set_data($resultado);
	break;
/*
Property: calculaGeometrias

Processa geometrias, armazenadas no formato I3Geo, gerando cálculos.
Área, perímetro, etc.

Include:
<classe_analise.php>
*/
	case "calculaGeometrias":
		include_once("classe_analise.php");
		$m = new Analise($map_file,"");
		$resultado = $m->calculaGeometrias($dir_tmp,$imgdir,$lista,$operacao,$postgis_con,$srid_area);
		$cp->set_data($resultado);
	break;
/*
Property: listageometrias

Gera a lista de geometrias disponíveis para o mapa atual.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/
	case "listageometrias":
		include_once("classe_temas.php");
		if(!isset($tema)){$tema = "";}
		$m = new Temas($map_file,$tema);
		$resultado = $m->listaGeometrias($dir_tmp,$imgdir);
		$cp->set_data($resultado);
	break;
/*
Property: capturageometrias

Gera um arquivo de geometrias, no formato I3Geo, para um tema, considerando os elementos selecionados.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/	
	case "capturageometrias":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$resultado = $m->capturaGeometrias($dir_tmp,$imgdir,$nome);
		$cp->set_data($resultado);
	break;
/*
Property: removergeometrias

Remove geometrias do diretório temporário.

As geometrias são armazenadas no diretório temporário do usuário, utilizando um formato próprio do I3Geo.

Include:
<classe_analise.php>
*/	
	case "removergeometrias":
		include_once("classe_temas.php");
		if(!isset($tema)){$tema = "";}
		$m = new Temas($map_file,$tema);
		$resultado = $m->removerGeometrias($dir_tmp,$imgdir,$lista);
		$cp->set_data($resultado);
	break;
/*
Section: Open Layers

Funções específicas da interface OpenLayers utilizadas por aplicmap/openlayers.htm
*/
/*
Property: openlayers

Prepara o mapa atual para funcionar na interface openlayers.

Include:
<classe_mapa.php>
*/
	case "openlayers":
		$map = ms_newMapObj($map_file);
		$mapext = ($map->extent->minx).",".($map->extent->miny).",".($map->extent->maxx).",".($map->extent->maxy);
		$eb = $map->scalebar;
		$eb->set("status",MS_OFF);
		$map->setProjection("init=epsg:4326");
		$cr = $map->getlayerbyname("copyright");
		$cr->set("status",MS_OFF);
		if (connection_aborted()){exit();}
		$map->save($map_file);
		include_once("classe_mapa.php");
		$m = New Mapa($map_file);
		$par = $m->parametrosTemas();
		$resultado = array("mapfile"=>$map_file,"mapext"=>$mapext,"locmapserv"=>$locmapserv,"parametros"=>$par);
		$cp->set_data($resultado);
	break;
/*
Section: Mapa
*/
/*
Property: pegaMensagens

Pega as mensagens do metadata 'mensagem'.
*/
	case "pegaMensagens":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->pegaMensagens());
				
	break;
/*
Property: reiniciaMapa

Reinicia um mapa restaurando a cópia de segurança.
*/	
	case "reiniciaMapa":
		if(file_exists($map_file."qy"))
		{unlink($map_file."qy");}
		unlink($map_file);
		copy(str_replace(".map","reinc.map",$map_file),$map_file);
		$cp->set_data("ok");
	break;
/*
Property: recuperamapa

Recupera o mapfile de segurança.
*/	
	case "recuperamapa":
		if(file_exists($map_file."qy"))
		{unlink($map_file."qy");}
		unlink($map_file);
		copiaSeguranca($map_file);
		$cp->set_data("ok");
	break;
/*
Property: ativalogo

Ativa ou desativa a marca de logo no mapa.

Include:
<classe_mapa.php>
*/
	case "ativalogo":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->ativalogo());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: ativalegenda

Ativa ou desativa a legenda inserida no mapa.

Include:
<classe_mapa.php>
*/
	case "ativalegenda":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->ativalegenda());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudatamanho

Muda o tamanho da imagem do mapa atual.

Include:
<classe_mapa.php>
*/
	case "mudatamanho":
		copiaSeguranca($map_file);
		$map = ms_newMapObj($map_file);
		$map->setsize($largura,$altura);
		if (connection_aborted()){exit();}
		$salvo = $map->save($map_file);
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$m->mudaQS($largura,$altura);
		$cp->set_data("ok");
	break;
/*
Property: gradeCoord

Inclui um tema com a grade de coordenadas.

Include:
<classe_mapa.php>
*/
	case "gradeCoord":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->gradeCoord($intervalo,$corlinha,$larguralinha,$tipolinha,$tamanhotexto,$cortexto,$incluitexto));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: convertews

Converte o mapa atual em um wms.

Include:
<classe_mapa.php>
*/
	case "convertews":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($h)){$h = "";}
		$resultado = $m->converteWS($locmapserv,$h);
		$cp->set_data($resultado);
	break;
/*
Property: querymapcor

Altera a cor de seleção.

Include:
<classe_mapa.php>
*/
	case "querymapcor":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->corQM($cor));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pegaquerymapcor

Pega a cor de seleção atual.

Include:
<classe_mapa.php>
*/
	case "pegaquerymapcor":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corQM(""));
	break;
/*
Property: corfundo

Altera a cor do fundo do mapa.

Include:
<classe_mapa.php>
*/
	case "corfundo":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->corfundo($cor));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pegacorfundo

Pega a cor do fundo do mapa atual.

Include:
<classe_mapa.php>
*/
	case "pegacorfundo":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$cp->set_data($m->corfundo(""));
	break;	
/*
Property: corpo

Redesenha o mapa.

Include:
<classe_mapa.php>
*/
	case "corpo":
		redesenhaMapa();
	break;
/*
Property: corpoentorno

Desenha as imagens do entorno do mapa.

Include:
<classe_mapa.php>
*/
	case "corpoentorno":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->redesenhaEntorno();
		$cp->set_data($resultado);
	break;
/*
Property: adicionaTemaGeoRSS

Adiciona um tema baseado em um RSS.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaGeoRSS":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaGeoRSS($servico,$dir_tmp,$locaplic,$canal);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: adicionaTemaSHP

Adiciona um tema baseado em um arquivo shape file.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaSHP":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaSHP($arq);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: adicionaTemaIMG

Adiciona um tema baseado em um arquivo de imagem.

Include:
<classe_mapa.php>
*/
	case "adicionaTemaIMG":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaIMG($arq);
		$cp->set_data($retorno);
		if ($retorno != "erro")
		{$m->salva();redesenhaMapa();}
		else
		{
			$cp->set_data("erro.Nenhum dado espacializado foi encontrado.");
		}
	break;
/*
Property: listatemas

Lista os temas existentes em um mapa.

Include:
<classe_mapa.php>
*/	
	case "listatemas":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemas($opcao);
		$cp->set_data($resultado);
	break;
/*
Property: listatemaslocais

Lista os temas existentes no diretório temporário do mapa atual.

Include:
<classe_mapa.php>
*/		
	case "listatemaslocais":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemasLocais();
		$cp->set_data($resultado);
	break;
/*
Property: listatemasTipo

Lista os temas existentes por tipo.

Include:
<classe_mapa.php>
*/	
	case "listatemasTipo":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($selecao)){$selecao = "nao";}
		$resultado = $m->listaTemasTipo($tipo,$selecao);
		$cp->set_data($resultado);
	break;
/*
Property: listatemascomsel

Lista os temas que possuem seleção.

Include:
<classe_mapa.php>
*/	
	case "listatemascomsel":
		include_once("classe_mapa.php");
		$m = new Mapa($map_file);
		$resultado = $m->listaTemasComSel();
		$cp->set_data($resultado);
	break;
/*
Property: ligatemas

Liga e desliga temas no mapa atual.

Include:
<classe_mapa.php>
*/		
	case "ligatemas":
  		include_once("classe_mapa.php");
  		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->ligaDesligaTemas($ligar,$desligar));
		$m->salva();
	break;
/*
Property: adtema

Adiciona um novo tema ao mapa.

Include:
<classe_mapa.php>
*/	
	case "adtema":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$salvar = $m->adicionaTema($temas,$locaplic);
		if($salvar)
		$m->salva();
		$teste = testaMapa($map_file,$postgis_mapa);
		if ($teste == "ok")
		{$cp->set_data("ok");}
		else
		{
			$cp->set_data(array("erro"=>"A camada nao pode ser adicionada. ".$teste));	
		}
	break;
/*
Property: excluitema

Exclui um tema do mapa.

Include:
<classe_mapa.php>
*/
	case "excluitema":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$cp->set_data($m->excluiTemas($temas));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: adicionatemawms

Acrescenta um novo tema em um arquivo map file tendo como fonte um WMS.

Include:
<classe_mapa.php>
*/	
	case "adicionatemawms":
		include_once("classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
	 	$m->adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo);
		$teste = testaMapa($map_file,$postgis_mapa);
		if ($teste == "ok")
		{$cp->set_data("ok");}
		else
		{
			$cp->set_data(array("erro"=>"A camada nao pode ser adicionada. ".$teste));	
		}
	break;
/*
Property: referencia

Gera a imagem do mapa de referência.
*/	
	case "referencia":
		$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		$cp->register('retornaReferencia');
		$cp->start();
	break;
/*
Property: referenciadinamica

Gera a imagem do mapa de referência de forma dinâmica, variando com a escala do mapa atual.
*/	
	case "referenciadinamica":
		//$objMapa = ms_newMapObj($map_file);
		$nomeImagem = nomeRandomico();
		$cp->register('retornaReferenciaDinamica');
		$cp->start();
	break;
/*
Section: Temas

Processa os layers do mapa.
*/

/*
Property: listaDrives

Pega a lista de drives registrados para o usuário atual.

A lista de drives é definida no ms_configura e permite que o usuário navegue pelos arquivos do servidor.

Include:
<ms_configura.php>
*/
	case "listaDrives":
		include_once("../ms_configura.php");
		//verifica se está cadastrado
		$ipcliente = pegaIPcliente();
		$retorno = array();
		foreach ($navegadoresLocais as $n)
		{
			if (gethostbyname($n["ip"]) == $ipcliente)
			{$retorno[] = $n["drives"];}	
		}		
		$cp->set_data($retorno);
	break;
/*
Property: alterarepresentacao

Altera o tipo de representação cartográfica do tema.

Include:
<classe_temas.php>
*/
	case "alterarepresentacao":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->alteraRepresentacao());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: geradestaque

Gera uma imagem que será utilizada para destacar um determinado tema.

Include:
<classe_temas.php>
*/
	case "geradestaque":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->geraDestaque());
	break;
/*
Property: download

Gera os arquivos para download de um tema.

*/
	case "download":
		$cp->set_data(downloadTema($map_file,$tema,$locaplic,$dir_tmp));
	break;
/*
function: insereFeature

Insere elemento gráfico em um tema.

Include:
<classe_temas.php>
*/
	case "inserefeature":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,"");
		if(!isset($marca)){$marca="";}
		$cp->set_data($m->insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte));
		$m->salva();
		redesenhaMapa();	
	break;
/*
Property: sobetema

Sobe um tema na ordem de desenho.

Include:
<classe_temas.php>
*/
	case "sobetema":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->sobeTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: descetema

Desce um tema na ordem de desenho.

Include:
<classe_temas.php>
*/
	case "descetema":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->desceTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: reordenatemas

Reordena os temas baseados na localização de um segundo tema no mapa.

Include:
<classe_temas.php>
*/
	case "reordenatemas":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file);
		$cp->set_data($m->reordenatemas($lista));
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: zoomtema

Muda a extensão geográfica do mapa de acordo com a abrangência de um tema.

Include:
<classe_temas.php>
*/
	case "zoomtema":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->zoomTema());
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: insereFiltro

Inclui um filtro no tema.

Include:
<classe_temas.php>
*/
	case "inserefiltro":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		if(!isset($testa)){$testa="";}
		{
			$cp->set_data($m->insereFiltro($filtro,$testa));
			//$cp->return_data();
		}
		if($testa != "sim")
		{
			$m->salva();
			redesenhaMapa();
		}
	break;
/*
Property: pegafiltro

Pega a string do filtro de um tema.

Include:
<classe_temas.php>
*/
	case "pegafiltro":
		include_once("classe_temas.php");
		$m = new Temas($map_file,$tema);
		$cp->set_data($m->pegaFiltro());
	break;
/*
Property: aplicaProcessos

Aplica processos em um tema do tipo imagem

Include:
<classe_temas.php>
*/					
	case "aplicaProcessos":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->aplicaProcessos($lista);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudatransp

Altera a transparência de um tema

Include:
<classe_temas.php>
*/					
	case "mudatransp":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->mudaTransparencia($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudanome

Altera o nome do tema

Include:
<classe_temas.php>
*/					
	case "mudanome":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->mudaNome($valor);
		$m->salva();
		redesenhaMapa();
	break;
/*
Section: Classes

Edita as características das classes de um tema.
*/
/*
Property: alteraclasse

Altera uma classe de um tema, aplicando uma nova classificação ou modificando parâmetros de uma ou mais classes.

Include:
<classe_alteraclasse.php>
*/	
	case "alteraclasse":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		if ($opcao == "adicionaclasse")
		{$cp->set_data($m->adicionaclasse());}
		if ($opcao == "valorunico")
		{$cp->set_data($m->valorunico($item,$ignorar));}
		if ($opcao == "intervalosiguais")
		{$cp->set_data($m->intervalosiguais($item,$nclasses,$ignorar));}
		if ($opcao == "quartis")
		{$cp->set_data($m->quartis($item,$ignorar));}
		if ($opcao == "alteraclasses")
		{
			//esta operação é chamada com POST via cpaint
			//por isso precisa ser executada com start
			$cp->register('alteraclassesPost');
			$cp->start();
			restauraCon($map_file,$postgis_mapa);
			$cp->return_data();
			exit;
		}
		if ($opcao == "simbolounico")
		{$cp->set_data($m->simbolounico());}
		$salvo = $m->salva();
	break;
/*
Property: inverteCoresClasses

Inverte a ordem das cores das classes de um tema.

Include:
<classe_alteraclasse.php>
*/	
	case "inverteCoresClasses":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->inverteCoresClasses());
		$m->salva();
	break;
/*
Property: calculaTamanhoClasses

Calcula o tamanho dos estilos das classes, alterando o tamanho do símbolo.

Include:
<classe_alteraclasse.php>
*/	
	case "calculaTamanhoClasses":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->calculaTamanhoClasses());
		$m->salva();
	break;
/*
Property: alteraCoresClasses

Altera as cores das classes de um tema conforme uma cor inicial e uma final.

Include:
<classe_alteraclasse.php>
*/	
	case "alteraCoresClasses":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->alteraCoresClasses($cori,$corf));
		$m->salva();
	break;
/*
Property: inverteStatusClasse

Altera o status de desenho de uma classe, tornando-a vi´sivel ou não.

Include:
<classe_alteraclasse.php>
*/
	case "inverteStatusClasse":
		include_once("classe_alteraclasse.php");
		copiaSeguranca($map_file);
		$m = new Alteraclasse($map_file,$tema);
		$cp->set_data($m->statusClasse($classe));
		$m->salva();
	break;	
/*
Property: verPaleta

Gera cores tendo como base uma cor inicial e uma cor final.

Include:
<class.palette.php>
*/	
	case "verPaleta":
		include_once("class.palette.php");
		$cori = RGB2hex(explode(",",$cori));
		$corf = RGB2hex(explode(",",$corf));
		$myPalette=new palette(array($cori,$corf),($numclasses + 1));
		foreach ($myPalette->colorRGB as $cores)
		{
			$res[] = $cores[0].",".$cores[1].",".$cores[2];
		}
		$cp->set_data(implode("*",$res));
	break;
/*
Section: Análise geográfica

Executa operações de análise espacial.
*/
/*
Property: dissolvePOligono

Elimina divisas entre polígonos com o mesmo atributo.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "dissolvePoligono":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->dissolvePoligono($item,$locaplic));
		$m->salva();
	break;
/*
Property: agrupaElementos

Agrupa elementos em um polígono.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "agrupaElementos":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->agrupaElementos($item,$locaplic));
		$m->salva();
	break;
/*
Property: pontoEmPoligono

Cruza um tema pontual com temas poligonais ou raster.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "pontoEmPoligono":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->pontoEmPoligono($temaPt,$temasPo,$locaplic));
		$m->salva();
	break;
/*
Property: nptPol

Conta o número de pontos em polígono cruzando dois temas.

Salva o mapa acrescentando um novo layer com o resultado.

Include:
<classe_analise.php>
*/
	case "nptPol":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->nptPol($temaPt,$temaPo,$locaplic));
		$m->salva();
	break;
/*
Property - criaBuffer

Gera entorno (buffer) nos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com o buffer.

Include:
<classe_analise.php>
*/	
	case "criabuffer":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->criaBuffer($distancia,$locaplic,$unir));
		$m->salva();
		//limpa selecao
		if (file_exists($map_file."qy"))
		{unlink ($map_file."qy");}
	break;
/*
Property - distanciaptpt

Calcula a distancia entre um ponto de origem e os pontos em um tema.

São considerados apenas os pontos próximos definidos por um buffer.

Include:
<classe_analise.php>
*/	
	case "distanciaptpt":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$temaorigem);
		$temaoverlay = $m->criaBuffer($distancia,$locaplic);
		$cp->set_data($m->distanciaptpt($temaorigem,$temadestino,$temaoverlay,$locaplic,$itemorigem,$itemdestino));
		$m->salva();
	break;
/*
Property - criaCentroide

Gera centroide dos elementos selecionados de um tema.

Salva o mapa acrescentando um novo layer com os pontos.

Include:
<classe_analise.php>
*/	
	case "criaCentroide":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->criaCentroide($locaplic));
		$m->salva();
	break;
/*
Property: analiseDistriPt

Gera análise de distribuição de pontos.

Executa script R para gerar a imagem.

Include:
<classe_analise.php>,<class.palette.php>
*/	
	case "analiseDistriPt":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema2))
		{$tema2 = "";}
		if(!isset($limitepontos))
		{$limitepontos = "";}
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->analiseDistriPt($locaplic,$dir_tmp,$R_path,$numclasses,$tipo,$cori,$corf,$tmpurl,$sigma,$limitepontos,$tema2));
		$m->salva();
	break;
/*
Property: gradeDePontos

Gera uma grade de pontos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade de coordenadas.

Include:
<classe_analise.php>
*/	
	case "gradedepontos":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->gradeDePontos($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Property: gradeDePol

Gera uma grade de polígonos com espaçamento regular definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

Include:
<classe_analise.php>
*/	
	case "gradedepol":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Analise($map_file,$tema);
		$cp->set_data($m->gradeDePol($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Property: gradeDeHex

Gera uma grade de polígonos hexagonais definido em décimos de grau.

Salva o mapa acrescentando um novo layer com a grade.

Include:
<classe_analise.php>
*/	
	case "gradedehex":
		include_once("classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$tema);
		if(!isset($tema)){$tema = "";}
		$cp->set_data($m->gradeDeHex($xdd,$ydd,$px,$py,$locaplic,$nptx,$npty));
		$m->salva();
	break;
/*
Section: Edição

Cria arquivos shapefile ou altera suas características.
*/
/*
Property: sphPT2shp

Converte os elementos de um tema em um arquivo shp.

Acrescenta um novo tema ao mapa.

Include:
<classe_shp.php>
*/
	case "sphPT2shp":
		include_once("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$cp->set_data($m->shpPT2shp($locaplic,$para));
		$m->salva();
	break;
/*
Property: listaPontosShape

Lista os pontos dos elementos de um arquivo shp.

Include:
<classe_shp.php>
*/
	case "listaPontosShape":
		include_once("classe_shp.php");
		$m = new SHP($map_file,$tema);
		$cp->set_data($m->listaPontosShape());
	break;
/*
Property: criashpvazio

Cria um shapefile vazio e acrescenta como tema ao mapa.

Include:
<classe_shp.php>
*/
	case "criashpvazio":
		include_once("classe_shp.php");
		//se colocar aqui da um erro
		//copiaSeguranca($map_file);
		$m = new SHP($map_file);
		$cp->set_data($m->criaSHPvazio());
		$m->salva();
	break;
/*
Property: insereSHP

Insere um ponto em um shape file existente.

Include:
<classe_shp.php>
*/
	case "insereSHP":
		include_once("classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema);
		if (!isset($projecao)){$projecao = "";}
		$m->insereSHP($xy,$projecao,$item,$valor);
		redesenhaMapa();
	break;
/*
Property: insereSHPgrafico

Cria um gráfico e insere no mapa em um local clicado no mapa.

Os valores para o gráfico são obtidos do tema indicado na classe. Para cada novo gráfico é criado um tema no mapa.

Include:
<classe_shp.php>
*/
	case "insereSHPgrafico":
		include_once("classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema,$locaplic);
		$cp->set_data($m->insereSHPgrafico($tipo,$x,$y,$itens,$imgurl,$width,$inclinacao,$shadow_height));
	break;
/*
Property: mostrawkt

Gera string wkt de um conjunto de pontos.

*/	
	case "mostrawkt":
		$res = xy2wkt($xy);
		$cp->set_data(array($res["ponto"],$res["linha"],$res["poligono"]));
	break;
/*
Section: Gráficos

Criação de representações gráficas de dados estatísticos.
*/
/*
Property: graficoSelecao

Pega os dados necessários para a geração dos gráficos da ferramenta seleção

*/					
	case "graficoSelecao":
		include_once("graficos.php");
		$cp->set_data(iniciaDadosGrafico($map_file,$tema,"",$itemclasses,$itemvalores,"xy",false));
	break;
/*
Property: graficotema

Gera graficos automaticamente para os elementos de um tema

Include:
<classe_temas.php>
*/					
	case "graficotema":
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,$tema);
		$m->graficotema($lista,$tamanho,$tipo,$outlinecolor,$offset);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: fusaografico

Faz a fusão da imagem de um gráfico com a imagem do mapa atual.

Include:
<graficos.php>
*/	
	case "fusaografico":
		include_once("graficos.php");
		//$_SESSION["utilizacgi"] = "nao";
		//$utilizacgi = "nao";
		restauraCon($map_file,$postgis_mapa);
		$cp->register('fusaoGrafico');
		$cp->start();
	break;
/*
Property: graficoestrela

Cria um gráfico do tipo estrela.

Include:
<graficos.php>
*/	
	case "graficoestrela":
		include_once("graficos.php");
		$cp->register('graficoEstrela');
		$cp->start();
	break;
/*
Property: graficoscatter

Cria um gráfico de distribuição de pontos.

Include:
<graficos.php>
*/	
	case "graficoscatter":
		include_once("graficos.php");
		$cp->register('graficoScatter');
		$cp->start();
	break;
/*
Property: graficoscatterbins

Cria um gráfico de distribuição de pontos com agrupamento em pixels (bins).

Include:
<graficos.php>
*/	
	case "graficoscatterbins":
		include_once("graficos.php");
		$cp->register('graficoScatterBins');
		$cp->start();
	break;
/*
Property: graficolinhas

Cria um gráfico de linhas.

Include:
<graficos.php>
*/
	case "graficolinhas":
		include_once("graficos.php");
		$cp->register('graficoLinhas');
		$cp->start();
	break;
/*
Property: graficohist

Cria um gráfico de histograma.

Include:
<graficos.php>
*/
	case "graficohist":
		include_once("graficos.php");
		$cp->register('graficoHist');
		$cp->start();
	break;
/*
Property: graficobarras

Cria um gráfico de barras.

Include:
<graficos.php>
*/
	case "graficobarras":
		include_once("graficos.php");
		$cp->register('graficoBarras');
		$cp->start();
	break;
/*
Property: graficopizza

Cria um gráfico de pizza.

Include:
<graficos.php>
*/
	case "graficopizza":
		include_once("graficos.php");
		$cp->register('graficoPizza');
		$cp->start();
	break;
/*
Section: Menu de temas

Obtém a lista de temas, grupos e sub-grupos.
*/
/*
Property: listaTags

Pega a lista de tags registrados nos menus de temas.

*/
	case "listaTags":
		if(!isset($menutemas))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo);
		$cp->set_data($m->listatags($rss,$nrss));
	break;
/*
Property: pegalistademenus

Pega a lista de menus para incluir na guia adiciona.

Parameters:
*/
	case "pegalistademenus":
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
		$cp->set_data($m->pegaListaDeMenus());
	break;
/*
Property: pegalistadegrupos

Pega a lista de grupos do menu.

Parameters:

map_file

perfil - perfil do usuário

locsistemas - endereço do xml com a lista de sistemas adicionais

idmenu - identificador da árvore de menus que deverá ser considerada (veja o ms_configura.php)
Include:
<classe_menutemas.php>
*/
	case "pegalistadegrupos":
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		if(!isset($urli3geo)){$urli3geo = "";}
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
		if(!isset($idmenu)){$idmenu="";}
		if(!isset($listasistemas)){$listasistemas="nao";}
		if(!isset($listasgrupos)){$listasgrupos="nao";}
		$cp->set_data(array("grupos"=>$m->pegaListaDeGrupos($idmenu,$listasistemas,$listasgrupos)));
	break;
/*
Property: pegalistadeSubgrupos

Pega a lista de subgrupos de um grupo do menu.

Include:
<classe_menutemas.php>
*/
	case "pegalistadeSubgrupos":
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
		$cp->set_data($m->pegaListaDeSubGrupos($grupo,$idmenu));
	break;
/*
Property: pegalistadetemas

Pega a lista de temas do menu.

Include:
<classe_menutemas.php>
*/
	case "pegalistadetemas":
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
		$cp->set_data(array("temas"=>$m->pegaListaDeTemas($grupo,$subgrupo,$idmenu)));
	break;
/*
Property: procurartemas

Procura um tema no menu.

Include:
<classe_menutemas.php>
*/
	case "procurartemas":
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		include_once("classe_menutemas.php");
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo,$editores);
		$cp->set_data($m->procurartemas($procurar));
	break;
/*
Property: pegaMapas

Pega a lista de links para outros mapas.

Utilizado no preenchimento da guia mapas

Include:
<classe_menutemas.php>
*/
	case "pegaMapas":
		include_once("classe_menutemas.php");
		if(!isset($menutemas) || !isset($editores))
		{
			if (file_exists("../ms_configura.php"))
			{include_once("../ms_configura.php");}
			else
			{include_once($locaplic."/ms_configura.php");}
		}
		$m = new Menutemas($map_file,$perfil,$locsistemas,$locaplic,$menutemas,$urli3geo);
		$cp->set_data($m->pegaListaDeMapas($locmapas));
	break;	
/*
Section: Webservices

Processa serviços OGC.
*/
/*
Property: georssCanais

Lista os canais de um georss.

*/
	case "georssCanais":
		$cp->set_data(georssCanais($servico,$map_file,$dir_tmp,$locaplic));
	break;
/*
Property: getcapabilities

Chama a função getcapabilities e retorna o resultado.

Include:
<wmswfs.php>
*/
	case "getcapabilities":
		include_once("wmswfs.php");
		$cp->register('getcapabilities');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: getcapabilities2

Chama a função getcapabilities e retorna o resultado formatado (WMS).

Include:
<wmswfs.php>
*/
	case "getcapabilities2":
		include_once("wmswfs.php");
		$cp->register('getcapabilities2');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: getcapabilities3

Chama a função getcapabilities e retorna o resultado formatado (WFS).

Include:
<wmswfs.php>
*/
	case "getcapabilities3":
		include_once("wmswfs.php");
		$cp->register('getcapabilities3');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Property: temaswms

Retorna a lista de camadas de um WMS formatado em HTML.

Include:
<wmswfs.php>
*/	
	case "temaswms":
		include_once("wmswfs.php");
		restauraCon($map_file,$postgis_mapa);
		$cp->register('temaswms');
		$cp->start();
	break;
/*
Section: Atributos

Processa os atributos da tabela associada ao tema.
*/
/*
Property: buscaRapida

Acessa dados de um serviço de geonames.

Include:
<classe_atributos.php>
*/
	case "buscaRapida":
		$cp->set_data(buscaRapida($servico,$palavra));
	break;
/*
Property: listaitens

Lista os itens de um tema.

Include:
<classe_atributos.php>
*/
	case "listaitens":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->listaItens());
	break;
/*
Property: listavaloresitens

Procura valores em uma tabela que aderem a uma palavra de busca.

Include:
<classe_atributos.php>
*/	
	case "listavaloresitens":
		include_once("classe_atributos.php");
		if(!isset($tema)){$tema = "";}
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->buscaRegistros($palavra,$lista,$tipo,$onde));
	break;
/*
Property: identifica

Identifica elementos no mapa.

Include:
<classe_atributos.php>
*/
	case "identifica":
		if (!isset($tema)){$tema = "";}
		if (!isset($resolucao)){$resolucao = 5;}
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->identifica($opcao,$xy,$resolucao));
	break;
/*
Property: identificaunico

Identifica elementos no mapa retornando apenas o valor de um único item.

Include:
<classe_atributos.php>
*/
	case "identificaunico":
		if (!isset($resolucao)){$resolucao = 5;}
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$xy = explode(",",$xy);
		$cp->set_data($m->identificaQBP($tema,$xy[0],$xy[1],$map_file,$resolucao,$item,$tiporetorno="unico"));
	break;
/*
Property: estatistica

Calcula estatísticas básicas de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "estatistica":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->estatDescritivas($item,$exclui));
	break;
/*
Property: listatexto

Pega todos os valores dos itens de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "listatexto":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->itensTexto($tipo));
	break;
/*
Property: listaregistros

Pega todos os valores dos itens de uma tabela de um tema.

Include:
<classe_atributos.php>
*/	
	case "listaregistros":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		if(!isset($tipo)){$tipo = "";}
		if(!isset($inicio)){$inicio = 0;}
		if(!isset($fim)){$fim = "";}
		if(!isset($tipolista)){$tipolista = "";}
		if(!isset($itemtema)){$itemtema = "";}
		$cp->set_data($m->listaRegistros($itemtema,$tipo,"",$inicio,$fim,$tipolista));
	break;
/*
Property: extregistros

Pega a extensão geográfica de um registro na tabela de atributos de um tema.

Include:
<classe_atributos.php>
*/		
	case "extregistros":
		include_once("classe_atributos.php");
		$m = new Atributos($map_file,$tema);
		$cp->set_data($m->extensaoRegistro($registro));
		$m->salva();
	break;
/*
Section: Navegação

Altera a extensão geográfica do mapa.
*/
/*
Property: geo2utm

Retorna coordenadas utm a partir de coordenadas geo
*/
	case "geo2utm":
		$zona = geo2zonaUTM($x);
		$cp->set_data(geo2utm($x,$y,$zona));
	break;
/*
Property: desativacgi

Desativa o modo cgi.

*/
	case "desativacgi":
		$_SESSION["utilizacgi"] = "nao";
		$cp->set_data($_SESSION["utilizacgi"]);
	break;

/*
Property: mudaext

Muda a extensão geográfica do mapa.

Include:
<classe_navegacao.php>
*/
	case "mudaext":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		if (!isset($ext) || $ext == "" || $ext == " "){$ext="-76.512593 -39.392568 -29.585185 9.490149";}
		$m = new Navegacao($map_file);
		$m->mudaExtensao($ext);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: mudaescala

Muda a escala do mapa.

Include:
<classe_navegacao.php>
*/
	case "mudaescala":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->mudaEscala($escala);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: pan

Desloca a visualização de um mapa (pan).

Include:
<classe_navegacao.php>
*/
	case "pan":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		if(!isset($tipo)){$tipo = "";}
		$m->pan($x,$y,$escala,$tipo);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: aproxima

Aproxima a visualização de um mapa (zoom in)

Include:
<classe_navegacao.php>
*/
	case "aproxima":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->aproxima($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: afasta

Afasta a visualização de um mapa (zoom out)

Include:
<classe_navegacao.php>
*/
	case "afasta":
		include_once("classe_navegacao.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->afasta($nivel);
		$m->salva();
		redesenhaMapa();
	break;
/*
Property: crialente

Aplica uma resolução nova ao mapa atual e gera uma imagem para a lente.

Include:
<classe_navegacao.php>
*/
	case "crialente":
		include_once("classe_navegacao.php");
		$m = new Navegacao($map_file);
		$m->aplicaResolucao($resolucao);
		//$m->desabilitaRASTER();
		$cp->set_data(($m->mapa->width).",".($m->mapa->height).",".$m->gravaImagemCorpo());
	break;
/*
Property: localizaIP

Localiza as coordenadas geográficas do usuário atual.

Baseia-se na identificação do IP e no pacote geoip

Include:
<pacotes/geoip/geoipcity.php>
*/
	case "localizaIP":
		copiaSeguranca($map_file);
		$ip = pegaIPcliente();
		$r = ip2geo($ip);
		if($r["latitude"] == null)
		{
			$ip = pegaIPcliente2();
			$r = ip2geo($ip);
		}
		$cp->set_data($r);
	break;

/*
Property: zoomponto

Desloca o centro do mapa para um ponto específico.

Include:
<classe_navegacao.php>
*/
	case "zoomponto":
		include_once("classe_navegacao.php");
		include_once("classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Navegacao($map_file);
		$m->zoomPonto($xy);
		$m->salva();
		$m = new Temas($map_file,"");
		$m->insereFeature("ponto","POINT",$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte);
		$m->salva();	
		redesenhaMapa();
	break;
/*
Section: Legenda

Processa a legenda do mapa e de temas específicos.
*/
/*
Property: editasimbolo

Define as características de simbologia de uma classe, cria, adiciona e exclui estilos.

Include:
<classe_legenda.php>
*/
	case "editasimbolo":
		include_once("classe_legenda.php");
		copiaSeguranca($map_file);
		if(!isset($tema)){$tema = "";}
		$m = new Legenda($map_file,$locaplic,$tema);
		if ($opcao == "excluiestilo")
		{
			$cp->set_data($m->excluiEstilo($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "adicionaestilo")
		{
			$cp->set_data($m->adicionaEstilo($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "sobeestilo")
		{
			$cp->set_data($m->sobeEstilo ($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "desceestilo")
		{
			$cp->set_data($m->desceEstilo ($classe,$estilo));
			$m->salva();
		}
		if ($opcao == "aplica")
		{
			$cp->set_data($m->aplicaParametro($classe,$estilo,$outlinecolor,$backgroundcolor,$color,$symbolname,$size));
			$m->salva();
		}
		if ($opcao == "listaSimbolos")
		{$cp->set_data($m->listaSimbolos($tipo,$dir_tmp,$imgdir));}
		if ($opcao == "pegaparametros")
		{$cp->set_data($m->pegaParametros($classe));}
	break;
/*
Property: editalegenda

Cria elementos para construir uma legenda no formato de tabela em HTML.

Include:
<classe_legenda.php>
*/
	case "editalegenda":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda();
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: criaLegendaHTML

Gera a legenda processando o template HTML.

Include:
<classe_legenda.php>
*/
	case "criaLegendaHTML":
		include_once("classe_legenda.php");
		//para efeitos de compatibilidade com versões anteriores
		if(isset($template)){$templateLegenda = $template;}
		$m = new Legenda($map_file,$locaplic,$tema,$templateLegenda);
		$r = $m->criaLegenda();
		if(!$r){$r = "erro. Legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: contagemclasse

Acrescenta a contagem de elementos em cada classe.

Include:
<classe_legenda.php>
*/
	case "contagemclasse":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file,$locaplic,$tema);
		$r = $m->tabelaLegenda("sim");
		if (!$r){$r = "erro.Erro legenda nao disponivel";}
		$cp->set_data($r);
	break;
/*
Property: criaLegendaImagem

Desenha a imagem da legenda.

Include:
<classe_legenda.php>
*/
	case "criaLegendaImagem":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file);
		$cp->set_data($m->legendaGrafica());
	break;
/*
Property: pegaParametrosLegImg

Pega os parâmetros da legenda embebida no mapa.

Include:
<classe_legenda.php>
*/
	case "pegaParametrosLegImg":
		include_once("classe_legenda.php");
		$m = new Legenda($map_file);
		$cp->set_data($m->pegaParametrosLegImg());
	break;
/*
Property: aplicaParametrosLegImg

Aplica um parâmetro em um estilo de uma classe.

Include:
<classe_legenda.php>
*/
	case "aplicaParametrosLegImg":
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
		$cp->set_data($m->aplicaParametrosLegImg($imagecolor,$position,$status,$outlinecolor,$keyspacingy,$keyspacingx,$keysizey,$keysizex,$height,$width,$labelsize));
		$m->salva();
	break;
/*
Section: Escala gráfica

Processa a escala gráfica do mapa.
*/
/*
Property: escalagrafica

Gera a imagem da barra de escala.

Include:
<classe_escala.php>
*/
	case "escalagrafica":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->retornaBarraEscala());
	break;
/*
Property: testaescalagrafica

Testa os novos parâmetros de uma barra de escala.

Include:
<classe_escala.php>
*/
	case "testaescalagrafica":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->testaescalagrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor));
	break;
/*
Property: escalaparametros

Pega os parâmetros da barra de escala atual.

Include:
<classe_escala.php>
*/
	case "escalaparametros":
		include_once("classe_escala.php");
		$m = new Escala($map_file);
		$cp->set_data($m->parametrosBarraEscala());
	break;
/*
Property: mudaescalagrafica

Aplica novos parâmetros na barra de escala atual.

Include:
<classe_escala.php>
*/
	case "mudaescalagrafica":
		include_once("classe_escala.php");
		copiaSeguranca($map_file);
		$m = new Escala($map_file);
		$cp->set_data($m->mudaEscalaGrafica($w,$h,$estilo,$intervalos,$unidade,$cor,$bcor,$ocor));
	break;
/*
Section: Seleção

Seleciona elementos do mapa ou processa a seleção existente.
*/
/*
Property: selecaopt

Seleciona elementos utilizando um ponto.

Include:
<classe_selecao.php>
*/	
	case "selecaopt":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		if(!isset($xy)){$xy = "";}
		$cp->set_data($m->selecaoPT($xy,$tipo,$tolerancia));
	break;
/*
Property: selecaoext

Seleciona elementos utilizando a extensão do mapa.

Include:
<classe_selecao.php>
*/	
	case "selecaoext":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoEXT($tipo));
	break;
/*
Property: selecaobox

Seleciona elementos utilizando um retângulo.

Include:
<classe_selecao.php>
*/	
	case "selecaobox":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoBOX($tipo,$ext));
	break;

/*
Property: selecaoatrib

Seleciona elementos com base nos atributos.

Include:
<classe_selecao.php>
*/
	case "selecaoatrib":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoAtributos($tipo,$item,$operador,$valor));
	break;
/*
Property: selecaotema

Sleciona elementos de um tema com base em outro tema.

Include:
<classe_selecao.php>
*/
	case "selecaotema":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoTema($temao,$tipo));
	break;
/*
Property: selecaoPoli

Seleção por poligono (chamado via POST).

Include:
<classe_alteraclasse.php>
*/	
	case "selecaoPoli":
		//esta operação é chamada com POST via cpaint
		//por isso precisa ser executada com start
		copiaSeguranca($map_file);
		$cp->register('selecaoPoli');
		$cp->start();
		restauraCon($map_file,$postgis_mapa);
		$cp->return_data();
	break;
/*
Property: limpasel

Limpa a seleção existente em um tema.

Include:
<classe_selecao.php>
*/
	case "limpasel":
		include_once("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecaoLimpa());
	break;
/*
Property: incluisel

Incluí elementos em uma seleção.

Include:
<classe_selecao.php>
*/
	case "incluisel":
		include_once("classe_selecao.php");
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->incluiSel($ids));
	break;
/*
Property: criatemasel

Cria um novo tema com a seleção atual.

Include:
<classe_selecao.php>
*/
	case "criatemasel":
		include_once("classe_selecao.php");
		copiaSeguranca($map_file);
		$m = new Selecao($map_file,$tema);
		$cp->set_data($m->selecao2tema($locaplic,$dir_tmp));
		$m->salva();
	break;
/*
Section: Toponímia

Processa a toponímia de um tema.
*/
/*
Property: criatoponimia

Cria um novo tema com a toponímia do tema atual.

Include:
<classe_toponimia.php>
*/	
	case "criatoponimia":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		if(!isset($tipo)){$tipo="";}
		$cp->set_data($m->criaToponimia($item,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$tipo));
		if ($tipo != "teste")
		{$m->salva();}
	break;
/*
Property: ativaEtiquetas

Ativa as etiquetas de um tema.

Include:
<classe_toponimia.php>
*/
	case "ativaEtiquetas":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$cp->set_data($m->ativaEtiquetas($item));
		$m->salva();
	break;
/*
Property: removeEtiquetas

Desativa as etiquetas de um tema.

Include:
<classe_toponimia.php>
*/
	case "removeEtiquetas":
		include_once("classe_toponimia.php");
		copiaSeguranca($map_file);
		$m = new Toponimia($map_file,$tema);
		$cp->set_data($m->removeEtiquetas());
		$m->salva();
	break;
/*
Property: listatruetype

Lista as fontes truetype disponíveis.

Include:
<classe_toponimia.php>
*/
	case "listatruetype":
		$cp->register('listaTrueType');
		restauraCon($map_file,$postgis_mapa);
		$cp->start();
	break;
/*
Section: Outros

Opções de uso geral.
*/
/*
Property: areaPixel

Calcula a área de um pixel da imagem.

Parameter:

celsize - tamanho de cada pixel em dd
*/
	case "areaPixel":
		$cp->set_data(calculaAreaPixel($map_file,$celsize));
	break;
/*
Property: listaEpsg

Pega os códigos de projeção EPSG.

*/
	case "listaEpsg":
		$cp->set_data(listaEpsg());
	break;
/*
Property: listaDiretorios

Lista os diretórios de um diretório.

*/
	case "listaDiretorios":
		$cp->set_data(listaDiretorios($diretorio));
	break;
/*
Property: listaArquivos

Lista os arquivos de um diretório.

*/
	case "listaArquivos":
		$cp->set_data(listaArquivos($diretorio));
	break;
}
if (!connection_aborted())
{
	if(isset($map_file) && isset($postgis_mapa))
	restauraCon($map_file,$postgis_mapa);
	$cp->return_data();
}
else
{exit();}
/*
Function: alteraclassesPost

Altera as classes de um tema aplicando novos parâmetros como nome e expressão.

Include:
<classe_alteraclasse.php>
*/
function alteraclassesPost($ids,$nomes,$exps)
{
	global $map_file,$tema,$cp;
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
	global $map_file,$cp;
	include_once("classe_selecao.php");
	$m = new Selecao($map_file,$tema);
	$cp->set_data($m->selecaoPorPoligono($tipo,$xs,$ys));
	$m->salva();
}
/*
Function: redesenhaMapa

Redesenha o mapa e retorna os parâmetros do novo mapa.

Include:
<classe_mapa.php>
*/
function redesenhaMapa()
{
	global $tempo,$map_file,$locsistemas,$locidentifica,$tipoimagem,$cp,$postgis_mapa,$utilizacgi,$locmapserv;
	if($tipoimagem != "nenhum" && $tipoimagem != "")
	{$utilizacgi = "nao";}
	if (connection_aborted()){exit();}
	include_once("classe_mapa.php");
	$m = New Mapa($map_file);
	$par = $m->parametrosTemas();
	$imagem = $m->redesenhaCorpo($locsistemas,$locidentifica,$tipoimagem,$utilizacgi,$locmapserv);
	if ($imagem == "erro")
	{
		unlink($map_file);
		copy(str_replace(".map","seguranca.map",$map_file),$map_file);
		$m = New Mapa($map_file);
		$par = $m->parametrosTemas();
		if (isset($utilizacgi) && strtolower($utilizacgi) == "sim")
		{$imagem = "var mapimagem='".$locmapserv."?map=".$map_file."&mode=map&".nomeRandomico()."'";}
		else
		{$imagem = $m->redesenhaCorpo($locsistemas,$locidentifica,$tipoimagem);}
	}
	restauraCon($map_file,$postgis_mapa);
	if (($par == "") || ($imagem == ""))
	{$cp->set_data("erro");}
	else
	{$cp->set_data($imagem.";".$par.";var tempo=".(microtime(1) - $tempo));}
}
?>