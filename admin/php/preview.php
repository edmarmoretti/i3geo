<?php
/**
Esse programa e uma adaptacao do codigo i3geo/ogc.php
E utilizado no preview de camadas no editor de mapfiles
Evita bloqueios de OGC e nao faz cache
 */
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../../classesphp/pega_variaveis.php");
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/login.php");
if(verificaOperacaoSessao("admin/php/editortexto") == false){
	echo "Vc nao pode realizar essa operacao.";exit;
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
//cria o web service
//
error_reporting(0);
$versao = versao();
$versao = $versao["principal"];
if($_GET["SRS"] == "EPSG:900913"){
	$_GET["SRS"] = "EPSG:3857";
}
$req = ms_newowsrequestobj();
$_GET = array_merge($_GET,$_POST);
if(!isset($_GET["srs"]) && !isset($_GET["SRS"])){
	$_GET["srs"] = "EPSG:4326";
}
foreach ($_GET as $k=>$v){
	$req->setParameter(strtoupper($k), $v);
	if(strtolower($k) == "layers" && empty($_GET["tema"])){
		$tema = $v;
	}
	if(strtolower($k) == "layer" && empty($_GET["tema"])){
		$tema = $v;
	}
}
$req->setParameter("srsName",$req->getValueByName("SRS"));
$listaepsg = $req->getValueByName("SRS")." EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
if(isset($version) && !isset($VERSION)){
	$VERSION = $version;
}
if(!isset($VERSION)){
	$req->setParameter("VeRsIoN","1.0.0");
}
//
//compatibiliza chamadas fora do padrao
//
if(isset($_GET["outputFormat"]) && $_GET["outputFormat"] != ""){
	$_GET["OUTPUTFORMAT"] = $_GET["outputFormat"];
}
//essa variavel e usada para definir se a imagem final gerada devera ser cortada ou nao
$cortePixels = 0;

if(empty($ogcwsmap)){
	$oMap = ms_newMapobj($locaplic."/aplicmap/ogcwsv".$versao.".map");
}
else{
	$oMap = ms_newMapobj($ogcwsmap);
}

$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$or = $proto.$server.$_SERVER['PHP_SELF'];
$or = $or."?tema=".$tema."&";
$oMap->setmetadata("ows_onlineresource",$or);
$oMap->setmetadata("wms_onlineresource",$or);
$oMap->setmetadata("wms_attribution_onlineresource",$proto.$server.dirname($_SERVER['PHP_SELF']));
$oMap->setmetadata("ows_enable_request","*");
//parametro mandatario
if($oMap->getmetadata("wms_srs") == ""){
	$oMap->setmetadata("wms_srs","EPSG:4326");
}
$e = $oMap->extent;
$extensaoMap = ($e->minx)." ".($e->miny)." ".($e->maxx)." ".($e->maxy);
//gera o mapa

$nmap = ms_newMapobj($tema);

$nmap->setmetadata("ows_enable_request","*");
$l = $nmap->getlayer(0);

//$l->setmetadata("ows_title",pegaNome($l));
$l->setmetadata("ows_srs",$listaepsg);
$l->set("group","");
$l->setmetadata("gml_include_items","all");
$l->set("template","none.htm");
$l->set("dump",MS_TRUE);
$l->setmetadata("WMS_INCLUDE_ITEMS","all");
$l->setmetadata("WFS_INCLUDE_ITEMS","all");
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
if($versao > 5){
	$pr = $l->getProcessing();
	if(!in_array("LABEL_NO_CLIP=True",$pr)){
		$l->setprocessing("LABEL_NO_CLIP=True");
	}
	if(!in_array("POLYLINE_NO_CLIP=True",$pr)){
		$l->setprocessing("POLYLINE_NO_CLIP=True");
	}
}
$l->set("status",MS_DEFAULT);
ms_newLayerObj($oMap, $l);

$oMap->setSymbolSet($locaplic."/symbols/".basename($oMap->symbolsetfilename));
$oMap->setFontSet($locaplic."/symbols/".basename($oMap->fontsetfilename));

if(ob_get_contents ()){
	ob_end_clean();
}

	$l = $oMap->getlayer(0);
	$req->setParameter("LAYERS",$l->name);

ms_ioinstallstdouttobuffer();
$req->setParameter("format","image/png");
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
if(!isset($OUTPUTFORMAT)){
	header("Content-type: $contenttype");
}

$buffer = ms_iogetStdoutBufferBytes();
ms_ioresethandlers();

function texto2iso($texto){
	if (function_exists("mb_convert_encoding")){
		if (mb_detect_encoding($texto,"UTF-8",true)){
			$texto = mb_convert_encoding($texto,"ISO-8859-1","UTF-8");
		}
	}
	return $texto;
}
function nomeRand($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{
		$nomes .= $a{mt_rand(0, $max)};
	}
	return $nomes;
}

?>
