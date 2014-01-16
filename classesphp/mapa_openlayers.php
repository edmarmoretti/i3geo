<?php
/*
Title: mapa_openlayers.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.

&Eacute; utilizado especificamente nas interfaces que utilizam a biblioteca OpenLayers.

Precisa do codigo da "section" PHP aberta pelo i3Geo (veja ms_criamapa.php) ou o codigo para acesso especial indicado no par&acirc;metro telaR
(veja a ferramenta TELAREMOTA).


Parametros:

g_sid {string} - código da "section" PHP

telaR {string} - (opcional) utilizado para autorizar o uso do mapfile aberto (deve estar registrado em $fingerprint (vari&aacute;vel de se&ccedil;&atilde;o)

tipolayer {fundo|} - (opcional) indica que a imagem a ser produzida comp&otilde;e o fundo do mapa

BBOX {xmin xmax ymin ymax} - extens&atilde;o geogr&aacute;fica a ser utilizada no desenho do mapa

WIDTH {numeric} - largura do mapa

HEIGHT {numeric} - altura do mapa

layer {string} - codigo do layer existente no mapa que ser&aacute; desenhado (ignorado quando telaR for definido)

DESLIGACACHE {sim|nao} - for&ccedil;a a n&atilde;o usar o cache de imagens qd definido como "sim", do contr&aacute;rio, o uso ou n&atilde;o do cache ser&aacute; definido automaticamente

TIPOIMAGEM {cinza|sepiaclara|sepianormal|negativo|detectaBordas|embassa|gaussian_blur|selective_blur|mean_removal|pixelate
} - filtro de imagem que ser&aacute; aplicado na imagem

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

Arquivo:

i3geo/classesphp/mapa_openlayers.php

*/
error_reporting(0);
//para efeitos de compatibilidade
if (!function_exists('ms_GetVersion')){
	include_once ("carrega_ext.php");
}
//carrega dados da se&ccedil;&atilde;o, verifica seguran&ccedil;a
inicializa();
//
//calcula a extensao geografica com base no x,y,z
//nos casos do modo notile, a requisicao e feita como se fosse um wms
//quando for do tipo tms $_GET["tms"] contem os parametros do tile
if(isset($_GET["tms"])){
	$_GET["WIDTH"] = 256;
	$_GET["HEIGHT"] = 256;
	$temp = explode("/",$_GET["tms"]);
	$z = $temp[2];
	$x = $temp[3];
	$y = str_replace(".png","",$temp[4]);

	$n = pow(2,$z+1);
	$lon1 = $x / $n * 360.0 - 180.0;
	$lon2 = ($x+1) / $n * 360.0 - 180.0;
	$n = pow(2,$z);
	$lat1 = $y / $n * 180.0 - 90.0;
	$lat2 = ($y+1) / $n * 180.0 - 90.0;
	$_GET["BBOX"] = $lon1." ".$lat1." ".$lon2." ".$lat2;
}
$map_fileX = $_SESSION["map_file"];
//
//verifica se o request e OGC
if(!empty($_GET["request"])){
	$_GET["REQUEST"] = $_GET["request"];
}
//
//resolve o problema da sele&ccedil;&atilde;o na vers&atilde;o nova do mapserver
//
$qyfile = dirname($map_fileX)."/".$_GET["layer"].".php";
$qy = file_exists($qyfile);
if($_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature"){
	$_GET["DESLIGACACHE"] = "sim";
}
if($qy == false && $_GET["cache"] == "sim" && $_GET["DESLIGACACHE"] != "sim"){
	carregaCacheImagem($_SESSION["cachedir"],$_SESSION["map_file"],$_GET["tms"],$_SESSION["i3georendermode"]);
}
//
//map_fileX e para o caso register_globals = On no PHP.INI

if(isset($_GET["tipolayer"]) && $_GET["tipolayer"] == "fundo"){
	$map_fileX = str_replace(".map","fundo.map",$map_fileX);
}
$postgis_mapa = $_SESSION["postgis_mapa"];
$cachedir = $_SESSION["cachedir"];
if(isset($_GET["BBOX"])){
	$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);
	$_GET["map_size"] = $_GET["WIDTH"]." ".$_GET["HEIGHT"];
}
$_GET["TIPOIMAGEM"] = trim($_GET["TIPOIMAGEM"]);
$mapa = ms_newMapObj($map_fileX);

//
//processa os layers do mapfile
//
if(!isset($_GET["telaR"])){//no caso de projecoes remotas, o mapfile nao e alterado
	$numlayers = $mapa->numlayers;
	$cache = false;
	for($i = 0;$i < $numlayers;++$i){
		$l = $mapa->getLayer($i);
		$layerName = $l->name;
		if($layerName != $_GET["layer"]){
			$l->set("status",MS_OFF);
		}
		if($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != ""){
			if ($l->getmetadata("classesnome") != ""){
				if(!function_exists("autoClasses"))
				{include_once("funcoes_gerais.php");}
				autoClasses($l,$mapa);
			}
			$l->set("status",MS_DEFAULT);
			$l->set("template","none.htm");
			if (!empty($postgis_mapa)){
				if ($l->connectiontype == MS_POSTGIS){
					$lcon = $l->connection;
					if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
						if(($lcon == " ") || ($lcon == ""))
						{$l->set("connection",$postgis_mapa);}
						else
						{$l->set("connection",$postgis_mapa[$lcon]);}
					}
				}
			}
		}
		if($layerName == $_GET["layer"]){
			if(strtolower($l->getmetadata("cache")) == "sim"){
				$cache = true;
				$nomecache = $l->getmetadata("nomeoriginal");
				if($nomecache == ""){
					$nomecache = $layerName;
				}
			}
			if($_GET["REQUEST"] == "GetFeatureInfo" || strtolower($_GET["REQUEST"]) == "getfeature" ){
				$l->setmetadata("gml_include_items","all");
				$l->set("template","none.htm");
				$l->setmetadata("WMS_INCLUDE_ITEMS","all");
				$l->setmetadata("WFS_INCLUDE_ITEMS","all");
				$l->setmetadata("ows_enable_request","*");
				$l->set("dump",MS_TRUE);
				$l->setmetadata("ows_srs","AUTO");
				if(strtolower($_GET["REQUEST"]) == "getfeature"){
					$_GET["TYPENAME"] = $l->name;
				}
			}
		}
	}
}

if (!function_exists('imagepng'))
{$_GET["TIPOIMAGEM"] = "";}

if($_GET["layer"] == "")
{$cache = true;}

if(($_GET == false) || ($qy) || (strtolower($_GET["DESLIGACACHE"]) == "sim")){
	$cache = false;
}
elseif($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum")
{$cache = false;}

if($cache == true && $_GET["cache"] != "nao"){
	carregaCacheImagem($cachedir,$map,$_GET["tms"]);
}
if(isset($_GET["map_size"])){
	$map_size = explode(" ",$_GET["map_size"]);
	$mapa->setsize($map_size[0],$map_size[1]);
}
if(isset($_GET["mapext"])){
	$mapext = explode(" ",$_GET["mapext"]);
	$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
}

//
//qd a cahamda e para um WMS, redireciona para ogc.php
//
if($_GET["REQUEST"] == "GetFeatureInfo" || $_GET["REQUEST"] == "getfeature"){
	$req = ms_newowsrequestobj();
	$_GET = array_merge($_GET,$_POST);
	foreach ($_GET as $k=>$v){
		$req->setParameter($k, $v);
	}
	$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
	$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
	$or = $proto.$server.$_SERVER['PHP_SELF'];
	$mapa->setmetadata("wfs_onlineresource",$or."?".$_SERVER["QUERY_STRING"]);

	ms_ioinstallstdouttobuffer();
	$mapa->owsdispatch($req);
	$contenttype = ms_iostripstdoutbuffercontenttype();
	header("Content-type: $contenttype");
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();
	exit;
}

$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);
if(!isset($_GET["telaR"])){
	$legenda = $mapa->legend;
	$legenda->set("status",MS_OFF);
	$escala = $mapa->scalebar;
	$escala->set("status",MS_OFF);
}
//
//se o layer n&atilde;o for do tipo fundo
//
if($_GET["tipolayer"] != "fundo")
{$o->set("transparent",MS_TRUE);}
if($qy != true)
{$img = $mapa->draw();}
else{
	$handle = fopen ($qyfile, "r");
	$conteudo = fread ($handle, filesize ($qyfile));
	fclose ($handle);
	$shp = unserialize($conteudo);
	$l = $mapa->getLayerByname($_GET["layer"]);
	if ($l->connectiontype != MS_POSTGIS){
		$indxlayer = $l->index;
		foreach ($shp as $indx)
		{$mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$qm = $mapa->querymap;
		$qm->set("width",$map_size[0]);
		$qm->set("height",$map_size[1]);
		$img = $mapa->drawQuery();
	}
	else{
		$img = $mapa->draw();
		$c = $mapa->querymap->color;
		$numclasses = $l->numclasses;
		if ($numclasses > 0)
		{
			$classe0 = $l->getClass(0);
			$classe0->setexpression("");
			$classe0->set("name"," ");
			for ($i=1; $i < $numclasses; ++$i)
			{
				$classe = $l->getClass($i);
				$classe->set("status",MS_DELETE);
			}
		}
		$cor = $classe0->getstyle(0)->color;
		$cor->setrgb($c->red,$c->green,$c->blue);
		//$cor = $classe0->getstyle(0)->outlinecolor;
		//$cor->setrgb($c->red,$c->green,$c->blue);
		$status = $l->open();
		$status = $l->whichShapes($mapa->extent);
		while ($shape = $l->nextShape())
		{
			if(in_array($shape->index,$shp))
			$shape->draw($mapa,$l,$img);
		}
		$l->close();
	}
	$cache = false;
}
//nao usa o cache pois e necessario processar a imagem com alguma rotina de filtro
if($_GET["TIPOIMAGEM"] != "" && $_GET["TIPOIMAGEM"] != "nenhum"){
	if($img->imagepath == "")
	{echo "Erro IMAGEPATH vazio";exit;}
	$nomer = ($img->imagepath)."filtroimgtemp".nomeRand().".png";
	$img->saveImage($nomer);
	filtraImg($nomer,$_GET["TIPOIMAGEM"]);
	$img = imagecreatefrompng($nomer);
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
	imagedestroy($img);
}
else{
	if($cache == true && $_GET["cache"] != "nao"){
		//cache ativo. Salva a imagem em cache
		$nomer = salvaCacheImagem($cachedir,$map_fileX,$_GET["tms"]);
		if($_SESSION["i3georendermode"] == 2){
			ob_clean();
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nomer");
			header("Content-type: image/png");
		}
		else{
			ob_clean();
			header('Content-Length: '.filesize($nomer));
			header('Content-Type: image/png');
			//header('Cache-Control: max-age=3600, must-revalidate');
			//header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			fpassthru(fopen($nomer, 'rb'));
		}
	}
	else{
		//cache inativo
		if($img->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}
		if($_SESSION["i3georendermode"] == 0){
			$nomer = ($img->imagepath)."temp".nomeRand().".png";
			$img->saveImage($nomer);
			$img = imagecreatefrompng($nomer);
			imagealphablending($img, false);
			imagesavealpha($img, true);
			ob_clean();
			echo header("Content-type: image/png \n\n");
			imagepng($img);
			imagedestroy($img);
			exit;
		}
		if($_SESSION["i3georendermode"] == 1){
			ob_clean();
			header('Content-Type: image/png');
			$img->saveImage();
		}
		if($_SESSION["i3georendermode"] == 2){
			$nomer = ($img->imagepath)."temp".nomeRand().".png";
			$img->saveImage($nomer);
			ob_clean();
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nomer");
			header("Content-type: image/png");
		}
	}
}
function salvaCacheImagem($cachedir,$map,$tms){
	global $img;
	if($cachedir == ""){
		$nome = dirname(dirname($map))."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	if(!file_exists($nome)){
		@mkdir(dirname($nome),0777,true);
		chmod(dirname($nome),0777);
		$img->saveImage($nome);
		chmod($nome,0777);
	}
	return $nome;
}
function carregaCacheImagem($cachedir,$map,$tms,$i3georendermode=0){
	if($cachedir == ""){
		$nome = dirname(dirname($map))."/cache".$tms;
	}
	else{
		$nome = $cachedir.$tms;
	}
	if(file_exists($nome)){
		if($i3georendermode = 0 || $i3georendermode = 1 || empty($i3georendermode)){
			header('Content-Length: '.filesize($nome));
			header('Content-Type: image/png');
			//header('Cache-Control: max-age=3600, must-revalidate');
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			//header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
			fpassthru(fopen($nome, 'rb'));
		}
		else{
			header('Cache-Control: public, max-age=22222222');
			header('Expires: ' . gmdate('D, d M Y H:i:s', time()+48*60*60) . ' GMT');
			header("X-Sendfile: $nome");
			header("Content-type: image/png");
		}
		exit;
	}
}
function nomeRand($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
function filtraImg($nomer,$tipoimagem){
	include_once("classe_imagem.php");
	$tiposImagem = explode(" ",$tipoimagem);
	foreach ($tiposImagem as $tipoimagem){
		$m = new Imagem($nomer);
		if ($tipoimagem == "cinza")
		{imagepng($m->cinzaNormal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "sepiaclara")
		{imagepng($m->sepiaClara(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "sepianormal")
		{imagepng($m->sepiaNormal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "negativo")
		{imagepng($m->negativo(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "detectaBordas")
		{imagepng($m->detectaBordas(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "embassa")
		{imagepng($m->embassa(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "gaussian_blur")
		{imagepng($m->gaussian_blur(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "selective_blur")
		{imagepng($m->selective_blur(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "mean_removal")
		{imagepng($m->mean_removal(),str_replace("\\","/",$nomer));}
		if ($tipoimagem == "pixelate")
		{imagepng($m->pixelate(),str_replace("\\","/",$nomer));}
	}
}
function inicializa(){
	clearstatcache();
	session_name("i3GeoPHP");
	if(@$_GET["g_sid"]){
		session_id($_GET["g_sid"]);
	}
	else{
		ilegal();
	}
	session_start();
	if(@$_SESSION["fingerprint"]){
		$f = explode(",",$_SESSION["fingerprint"]);
		if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0] && !in_array($_GET["telaR"],$f) )
		{ilegal();}
	}
	else
	{exit;}
	if(!isset($_SESSION["map_file"]))
	{exit;}
}
function ilegal(){
	$img = imagecreatefrompng("../imagens/ilegal.png");
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
	exit;
}
?>