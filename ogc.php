<?php
/*
 Title: Gerador de servi&ccedil;os OGC

Gera web services nos padr&otilde;es OGC para os temas existentes na pasta i3geo/temas

A lista de proje&ccedil;&otilde;es mostradas na fun&ccedil;&atilde;o getcapabilities &eacute; definida na vari&aacute;vel $listaepsg. Edite essa vari&aacute;vel diretamente no programa 
se forem necess&aacute;rias outras proje&ccedil;&otilde;es al&eacute;m das existentes

Licen&ccedil;a:

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

Arquivo: i3geo/ogc.php

Par&acirc;metros:

lista - (opcional) se for igual a "temas", mostra uma lista de links em HTML dos temas dispon&iacute;veis,
se for igual a "temaswfs", mostra a lista de links WFS

ajuda - (opcional) mostra uma ajuda ao usu&aacute;rio

tema - (opcional) nome do tema que ser&aacute; mostrado no servi&ccedil;o. Se for definido, o web service conter&aacute; apenas esse tema. O tema &eacute; o nome do mapfile existente em i3geo/temas, mas pode ser especificado um mapfile existente em outra pasta. Nesse caso, deve-se especificar o caminho completo para o arquivo. Se n&atilde;o for definido, ser&atilde;o considerados todos os temas

intervalo - (opcional) valor inicial e final com o n&uacute;mero de temas que ser&atilde;o mostrados no servi&ccedil;o

legenda - (opcional) mostra a legenda no corpo do mapa sim|nao

perfil - (opcional) perfil utilizado para restringir os temas que ser&atilde;o mostrados

format - (opcional) pode ser utilizado a op&ccedil;&atilde;o &format=application/openlayers para abrir o mashup do OpenLayers com as camadas definida em temas

Exemplos:

ogc.php?temas=biomashp&format=application/openlayers&bbox=-54,-14,-50,-10

ogc.php?lista=temas

ogc.php?tema=bioma

ogc.php?tema=/var/www/i3geo/aplicmap/geral1debianv6.map&layers=mundo

ogc.php?intervalo=0,50
*/
//
//valida&ccedil;&otilde;es e includes
//
$cache = true;
require_once(__DIR__."/classesphp/carrega_ext.php");
include(__DIR__."/ms_configura.php");
include(__DIR__."/classesphp/pega_variaveis.php");
if(!isset($temas) && isset($tema))
{
	$temas = $tema;
}
//
//para operar como o Geoserver
//
if(isset($format) && strtolower($format) == "application/openlayers"){
	//var_dump($_SERVER);exit;
	if(!isset($layers)){
		$layers = $temas;
	}
	$urln = dirname($_SERVER["PHP_SELF"])."/mashups/openlayers.php?temas=".$layers."&layers=".$layers."&mapext=".$bbox."&botoes=pan,zoombox,zoomtot,identifica";
	if(!headers_sent()){
		header("Location:".$urln);
	}
	else{
		echo "<meta http-equiv='refresh' content='0;url=$urln'>";
	}
}
//
//pega os endere&ccedil;os para compor a url de chamada do gerador de web services
//ogc.php
//
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php","",$protocolo.$_SERVER["PHP_SELF"]);
//
//imprime na tela a ajuda
//
if(isset($ajuda)){
	ogc_imprimeAjuda();
	exit;
}
//
//imprime na tela a lista de temas dispon&iacute;veis
//
if(isset($lista) && $lista == "temas"){
	include_once(__DIR__."/classesphp/classe_menutemas.php");
	ogc_imprimeListaDeTemas();
	exit;
}
if(isset($lista) && $lista == "temaswfs"){
	include_once(__DIR__."/classesphp/classe_menutemas.php");
	ogc_imprimeListaDeTemasWfs();
	exit;
}
//
//cria o web service
//
include(__DIR__."/classesphp/funcoes_gerais.php");
error_reporting(0);
$versao = versao();
$versao = $versao["principal"];
$req = ms_newowsrequestobj();
$tipo = "";
$_GET = array_merge($_GET,$_POST);
if(isset($_GET["sld"]) || isset($_GET["filter"])){
	$cache = false;
}
if(!isset($_GET["srs"]) && !isset($_GET["SRS"])){
	$_GET["srs"] = "EPSG:4326";
}
foreach ($_GET as $k=>$v){
	$req->setParameter(strtoupper($k), $v);
	if(strtolower($v) == "getcapabilities"){
		$tipo = "metadados";
		$cache = false;
	}
	if(strtolower($k) == "layers" && empty($_GET["tema"]))
	{
		$tema = $v;
	}
	if(strtolower($k) == "layer" && empty($_GET["tema"]))
	{
		$tema = $v;
	}
}
$req->setParameter("srsName",$req->getValueByName("SRS"));
$listaepsg = $req->getValueByName("SRS")." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
//echo $listaepsg;exit;
if(count($_GET) == 0){
	$tipo="intervalo";
	$req->setParameter("REQUEST", "getCapabilities");
	$req->setParameter("SERVICE", "WMS");
	$cache = false;
}
if(isset($tema) && $tipo != "metadados"){
	$tipo = "";
}
if(isset($version) && !isset($VERSION)){
	$VERSION = $version;
}
if(!isset($VERSION)){
	$req->setParameter("VeRsIoN","1.0.0");
}
/*
$n =  $req->numparams;
for($i=0;$i<$n;$i++){
	echo $req->getName($i);
	echo "=";
	echo $req->getValue($i);
	echo "<br>";
}
exit;
*/
$oMap = ms_newMapobj($locaplic."/aplicmap/ogcwsv".$versao.".map");
//
//altera os caminhos das imagens
//
if((isset($legenda)) && (strtolower($legenda) == "sim")){
	$leg = $oMap->legend;
	$leg->set("status",MS_EMBED);
	$cache = false;
}
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$or = $proto.$server.$_SERVER['PHP_SELF'];
if((isset($tema)) && ($tema != "") && ($tipo=="metadados")){
	$or = $or."?tema=".$tema."&";
}
//
//parametros no n&iacute;vel maior
//
$oMap->setmetadata("ows_onlineresource",$or);
$oMap->setmetadata("wms_onlineresource",$or);
$oMap->setmetadata("wms_title",$tituloInstituicao." - i3geo");
$oMap->setmetadata("wfs_title",$tituloInstituicao." - i3geo");
$oMap->setmetadata("wms_attribution_logourl_format","image/png");
$oMap->setmetadata("wms_attribution_logourl_height","56");
$oMap->setmetadata("wms_attribution_logourl_width","85");
$oMap->setmetadata("wms_attribution_logourl_href",$proto.$server.dirname($_SERVER['PHP_SELF'])."/imagens/i3geo.png");
$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
$oMap->setmetadata("wms_attribution_title",$tituloInstituicao);
$oMap->setmetadata("ows_enable_request","*");
$e = $oMap->extent;
$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
if (!isset($intervalo)){
	$intervalo = "0,5000";
}
else{
	$tipo = "intervalo";
}
if(!isset($tema)){
	if(!isset($intervalo))
	{
		$intervalo = "0,5000";
	}
	$tipo = "intervalo";
}
if ($tipo == "" || $tipo == "metadados"){
	$tema = explode(" ",$tema);
	//para o caso do tema ser um arquivo mapfile existente em uma pasta qualquer
	//$temai3geo = true indica que o layer ser&aacute; buscado na pasta i3geo/temas
	$temai3geo = true;
	//FIXME não aceita gvp quando o caminho é completo
	if(file_exists($_GET["tema"])){
		$nmap = ms_newMapobj($_GET["tema"]);
		$temai3geo = false;
		$nmap->setmetadata("ows_enable_request","*");
	}
	foreach ($tema as $tx){
		$extensao = ".map";
		if(file_exists($locaplic."/temas/".$tx.".php") && $temai3geo == true){
			$extensao = ".php";
		}
		if(file_exists($locaplic."/temas/".$tx.".gvp") && $temai3geo == true){
			$extensao = ".gvp";
		}
		if($extensao == ".map"){
			if($temai3geo == true){
				$nmap = ms_newMapobj($locaplic."/temas/".$tx.".map");
				$nmap->setmetadata("ows_enable_request","*");
			}
			if($temai3geo == false || empty($layers))
			{
				$ts = $nmap->getalllayernames();
			}
			else{
				$ts = explode(",",str_replace(" ",",",$layers));
			}
			foreach ($ts as $t){
				$l = $nmap->getlayerbyname($t);
				$permite = $l->getmetadata("permiteogc");
				if(strtolower($permite) != "nao"){
					//necess&aacute;rio pq o mapfile pode ter todos os layers como default
					if($temai3geo == false){
						$l->set("status",MS_OFF);
					}
					if($cache == true && strtolower($l->getmetadata('cache')) == 'sim' && $tipo == '' && count($tema) == 1){
						carregaCacheImagem($_GET['BBOX'],$tx,$_GET['WIDTH'],$_GET['HEIGHT'],$cachedir);
					}
					$l->setmetadata("ows_title",pegaNome($l));
					$l->setmetadata("ows_srs",$listaepsg);
					$l->set("group","");
					//essa linha &eacute; necess&aacute;ria pq as vezes no mapfile n&atilde;o tem nenhum layer com o nome igual ao nome do mapfile
					if(count($ts)==1 && $temai3geo == true){
						$l->set("name",$tx);
					}
					$l->setmetadata("gml_include_items","all");
					$l->set("template","none.htm");
					$l->set("dump",MS_TRUE);
					$l->setmetadata("WMS_INCLUDE_ITEMS","all");
					$l->setmetadata("WFS_INCLUDE_ITEMS","all");
					if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png")){
						$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
						$l->setmetadata("wms_attribution_logourl_format","image/png");
						$l->setmetadata("wms_attribution_logourl_height","50");
						$l->setmetadata("wms_attribution_logourl_width","50");
						$l->setmetadata("wms_attribution_logourl_href",$mini);
					}
					if($l->type == MS_LAYER_RASTER && $l->numclasses > 0){
						$c = $l->getclass(0);
						if($c->name == "")
						{
							$c->name = " ";
						}
					}
					//inclui extensao geografica
					$extensao = $l->getmetadata("EXTENSAO");
					if($extensao == ""){
						$extensao = $extensaoMap;
					}
					$l->setmetadata("wms_extent",$extensao);
					if (!empty($postgis_mapa)){
						if ($l->connectiontype == MS_POSTGIS){
							$lcon = $l->connection;
							if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
								//
								//o metadata CONEXAOORIGINAL guarda o valor original para posterior substitui&ccedil;&atilde;o
								//
								if(($lcon == " ") || ($lcon == "")){
									$l->set("connection",$postgis_mapa);
									$l->setmetadata("CONEXAOORIGINAL",$lcon);
								}
								else{
									$l->set("connection",$postgis_mapa[$lcon]);
									$l->setmetadata("CONEXAOORIGINAL",$lcon);
								}
							}
						}
					}
					autoClasses($l,$oMap);
					ms_newLayerObj($oMap, $l);
					//$req->setParameter("LAYERS", "mundo");
				}
			}
		}
		if($extensao == ".php"){
			include_once($locaplic."/temas/".$tx.".php");
			eval($tx."(\$oMap);");
		}
		if($extensao == ".gvp"){
			include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
			$gm = new gvsig2mapfile($locaplic."/temas/".$tx.".gvp");
			$gvsigview = $gm->getViewsNames();
			foreach($gvsigview as $gv){
				$dataView = $gm->getViewData($gv);
				$oMap = $gm->addLayers($oMap,$gv,$dataView["layerNames"]);
			}
			$numlayers = $oMap->numlayers;
			$layers = array();
			//$layers[] = "default";
			for ($i=0;$i < $numlayers;$i++){
				$l = $oMap->getlayer($i);
				$l->setmetadata("gml_include_items","all");
				$l->set("dump",MS_TRUE);
				$l->setmetadata("WMS_INCLUDE_ITEMS","all");
				$l->setmetadata("WFS_INCLUDE_ITEMS","all");
				$l->setmetadata("ows_srs",$listaepsg);
				$l->setmetadata("ows_title",$l->getmetadata("TEMA"));
				$l->set("status",MS_OFF);
				$layers[] = $l->name;
				if(file_exists($locaplic."/temas/miniaturas/".$tx.".map.mini.png")){
					$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$tx.".map.mini.png";
					$l->setmetadata("wms_attribution_logourl_format","image/png");
					$l->setmetadata("wms_attribution_logourl_height","50");
					$l->setmetadata("wms_attribution_logourl_width","50");
					$l->setmetadata("wms_attribution_logourl_href",$mini);
				}
				if($l->type == MS_LAYER_RASTER && $l->numclasses > 0){
					$c = $l->getclass(0);
					if($c->name == "")
					{
						$c->name = " ";
					}
				}
				//inclui extensao geografica
				$extensao = $l->getmetadata("EXTENSAO");
				if($extensao == ""){
					$extensao = $extensaoMap;
				}
				$l->setmetadata("wms_extent",$extensao);
			}
			$req->setParameter("LAYERS", implode(",",$layers));
			$req->setParameter("STYLES", "");
			//r_dump($req);exit;
		}
	}
}
else{
	$conta = 0;
	$int = explode(",",$intervalo);
	$codigosTema = array();
	if(empty($perfil)){
		$perfil = "";
	}
	include("classesphp/classe_menutemas.php");
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	foreach ($menus as $menu){
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo){
			if(strtolower($grupo["ogc"]) == "sim"){
				foreach($grupo["subgrupos"] as $sgrupo){
					if(strtolower($sgrupo["ogc"]) == "sim"){
						$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($temas as $tema){
							if(strtolower($tema["ogc"]) == "sim"){
								$codigosTema[] = array("tema"=>$tema["tid"],"fonte"=>$tema["link"]);
							}
						}
					}
				}
			}
		}
	}
	//echo "<pre>";
	//var_dump($codigosTema);
	//exit;
	foreach($codigosTema as $c){
		$codigoTema = $c["tema"];
		if(file_exists($locaplic."/temas/".$codigoTema.".map")){
			if (@ms_newMapobj($locaplic."/temas/".$codigoTema.".map")){
				$nmap = ms_newMapobj($locaplic."/temas/".$codigoTema.".map");
				$nmap->setmetadata("ows_enable_request","*");
				$ts = $nmap->getalllayernames();
				if (count($ts) == 1){
					foreach ($ts as $t){
						if ($oMap->getlayerbyname($t) == ""){
							$conta++;
							if (($conta >= $int[0]) && ($conta <= $int[1])){
								$l = $nmap->getlayerbyname($t);
								$extensao = $l->getmetadata("EXTENSAO");
								if($extensao == "")
								{
									$extensao = $extensaoMap;
								}
								$l->setmetadata("wms_extent",$extensao);

								$l->setmetadata("ows_title",pegaNome($l));
								$l->setmetadata("ows_srs",$listaepsg);
								$l->set("status",MS_OFF);
								$l->setmetadata("gml_include_items","all");
								$l->set("dump",MS_TRUE);
								$l->setmetadata("WMS_INCLUDE_ITEMS","all");
								$l->setmetadata("WFS_INCLUDE_ITEMS","all");

								$l->setmetadata("ows_metadataurl_href",$c["fonte"]);
								$l->setmetadata("ows_metadataurl_type","TC211");
								$l->setmetadata("ows_metadataurl_format","text/html");
								if(file_exists($locaplic."/temas/miniaturas/".$t.".map.mini.png")){
									$mini = $proto.$server.dirname($_SERVER['PHP_SELF'])."/temas/miniaturas/".$t.".map.mini.png";
									$l->setmetadata("wms_attribution_logourl_format","image/png");
									$l->setmetadata("wms_attribution_logourl_height","50");
									$l->setmetadata("wms_attribution_logourl_width","50");
									$l->setmetadata("wms_attribution_logourl_href",$mini);
								}
								ms_newLayerObj($oMap, $l);
							}
						}
					}
				}
			}
			else{
				echo "Erro no arquivo ".$locaplic."/temas/".$codigoTema.".map <br>";
				$error = ms_GetErrorObj();
				while($error && $error->code != MS_NOERR){
					printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
					$error = $error->next();
				}
			}
		}
	}
}
if($cache == true){

}
ms_ioinstallstdouttobuffer();

$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
if(strtolower($request) == "getcapabilities")
{
	header('Content-Disposition: attachment; filename=getcapabilities.xml');
}
//header("Content-type: application/xml");
header("Content-type: $contenttype");

$buffer = ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
//
//fun&ccedil;&otilde;es
//
function ogc_pegaListaDeMenus(){
	global $perfil,$locaplic,$urli3geo;
	if(!isset($perfil)){
		$perfil = "";
	}
	$m = new Menutemas("",$perfil,$locsistemas,$locaplic,"",$urli3geo);
	foreach($m->pegaListaDeMenus() as $menu)
	{
		$menus[] = $urli3geo."/admin/xmlmenutemas.php?id_menu=".$menu["idmenu"];
	}
	return $menus;
}
function ogc_imprimeAjuda(){
	echo "<pre><b>Construtor de web services do I3Geo.</b><br><br>";
	echo "Esse utilit&aacute;rio usa os arquivos mapfiles existentes em <br>";
	echo "i3geo/temas para gerar web services no padr&atilde;o OGC.<br>";
	echo "Para escolher um tema, utilize:<br>";
	echo "ogc.php?lista=temas - para listar os temas dispon&iacute;veis<br>";
	echo "Para usar esse web service, al&eacute;m dos par&acirc;metros normais, vc dever&aacute; incluir o par&acirc;metro &tema=,<br>";
	echo "ou seja,http://[host]/i3geo/ogc.php?tema=[código do tema]<br>";
	echo "no lugar do código pode ser especificado tamb&eacute;m um arquivo mapfile qualquer. Nesse caso, deve ser digitado o caminho completo no servidor<br><br>";
	echo "Utilize o sistema de administra&ccedil;&atilde;o do i3Geo para configurar quais os temas da pasta i3geo/temas podem ser utilizados.";
	echo "Utilize o parametro &intervalo=0,20 para definir o n&uacute;mero de temas desejado na fun&ccedil;&atilde;o getcapabilities.";
}
function ogc_imprimeListaDeTemas(){
	global $urli3geo,$perfil,$locaplic;
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	echo '<html><head><title>WMS</title><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"><meta name="description" content="OGC"><meta name="keywords" content="WMS OGC mapa sig gis webmapping geo geoprocessamento interativo meio ambiente MMA cartografia geografia"> <meta name="robots" content="index,follow">';
	echo "<body><b>Lista de temas por grupos e subgrupos e endere&ccedil;os de acesso aos dados por meio de Web Services WMS (os c&oacute;digos dos temas est&atilde;o em vermelho)</b><br><br>";
	$imprimir = "";
	foreach ($menus as $menu){
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo){
			if(strtolower($grupo["ogc"]) == "sim"){
				$imprimegrupo = "<i>".$grupo["nome"]."</i>";
				foreach($grupo["subgrupos"] as $sgrupo){
					if(strtolower($sgrupo["ogc"]) == "sim"){
						$imprimesubgrupo = $sgrupo["nome"];
						$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($temas as $tema){
							if(strtolower($tema["ogc"]) == "sim"){
								$imprimir .= $imprimegrupo."->".$imprimesubgrupo."<br>";
								$imprimir .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								$imprimir .= "<span style=color:red >".$tema["tid"]."</span>";
								$imprimir .= "&nbsp;-&nbsp;".$tema["nome"]."&nbsp";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&service=wms&request=getcapabilities' >Getcapabilities</a>";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX=-76.5125927,-39.3925675209,-29.5851853,9.49014852081&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers=".$tema["tid"]."' >GetMap </a>";
								if($tema["link"] != " ")
									$imprimir .= "&nbsp;&nbsp;<a href='".$tema["link"]."' >fonte</a>";
								$imprimir .= "<br>";
							}
						}
					}
				}
			}
		}
	}
	echo $imprimir."</body></html>";
}
function ogc_imprimeListaDeTemasWfs(){
	global $urli3geo,$perfil,$locaplic;
	$m = new Menutemas("",$perfil,$locaplic,$urli3geo);
	$menus = $m->pegaListaDeMenus();
	echo '<html><head><title>WFS</title><META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1"><meta name="description" content="OGC"><meta name="keywords" content="WMS OGC mapa sig gis webmapping geo geoprocessamento interativo meio ambiente MMA cartografia geografia"> <meta name="robots" content="index,follow">';
	echo "<body><b>Lista de temas por grupos e subgrupos e endere&ccedil;os de acesso aos dados por meio de Web Services WFS (os c&oacute;digos dos temas est&atilde;o em vermelho)</b><br><br>";
	$imprimir = "";
	foreach ($menus as $menu){
		$grupos = $m->pegaListaDeGrupos($menu["idmenu"],$listasistemas="nao",$listasgrupos="sim");
		foreach($grupos as $grupo){
			if(strtolower($grupo["ogc"]) == "sim"){
				$imprimegrupo = "<i>".$grupo["nome"]."</i>";
				foreach($grupo["subgrupos"] as $sgrupo){
					if(strtolower($sgrupo["ogc"]) == "sim"){
						$imprimesubgrupo = $sgrupo["nome"];
						$temas = $m->pegaListaDeTemas($grupo["id_n1"],$sgrupo["id_n2"],$menu["idmenu"]);
						foreach($temas as $tema){
							if(strtolower($tema["ogc"]) == "sim" && strtolower($tema["down"]) !== "nao"){
								$imprimir .= $imprimegrupo."->".$imprimesubgrupo."<br>";
								$imprimir .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								$imprimir .= "<span style=color:red >".$tema["tid"]."</span>";
								$imprimir .= "&nbsp;-&nbsp;".$tema["nome"]."&nbsp";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&service=wfs&request=getcapabilities' >Getcapabilities</a>";
								$imprimir .= "&nbsp;<a href='".$urli3geo."/ogc.php?tema=".$tema["tid"]."&SRS=EPSG:4618&service=wfs&version=1.1.0&request=getfeature&typename=".$tema["tid"]."' >Getfeature </a>";
								if($tema["link"] != " ")
									$imprimir .= "&nbsp;&nbsp;<a href='".$tema["link"]."' >fonte</a>";
								$imprimir .= "<br>";
							}
						}
					}
				}
			}
		}
	}
	echo $imprimir."</body></html>";
}
//FIXME cache fora do novo padrao de xyz
function carregaCacheImagem($bbox,$layer,$w,$h,$cachedir=""){
	global $dir_tmp;
	$nome = $w.$h.$bbox.".png";
	if($cachedir == "")
	{
		$nome = $dir_tmp."/cache/".$layer."/".$nome;
	}
	else
	{$nome = $cachedir."/".$layer."/".$nome;
	}
	if(file_exists($nome)){
		ob_start();
		// assuming you have image data in $imagedata
		$img = file_get_contents($nome);
		$length = strlen($img);
		$ft = filemtime($nome);
		if (isset($_SERVER["HTTP_IF_MODIFIED_SINCE"]) && (strtotime($_SERVER["HTTP_IF_MODIFIED_SINCE"]) == $ft)) {
			// Client's cache IS current, so we just respond '304 Not Modified'.
			header('Last-Modified: '.gmdate('D, d M Y H:i:s', $ft).' GMT', true, 304);
		} else {
			// Image not cached or cache outdated, we respond '200 OK' and output the image.
			header('Last-Modified: '.gmdate('D, d M Y H:i:s', $ft).' GMT', true, 200);
		}
		header('Accept-Ranges: bytes');
		header('Content-Length: '.$length);
		header('Content-Type: image/png');
		print($img);
		ob_end_flush();
		exit;
	}
}
?>