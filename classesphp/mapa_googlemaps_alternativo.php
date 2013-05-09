<?php
/*
Title: mapa_googlemaps.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.

&Eacute; utilizado especificamente nas interfaces que utilizam a biblioteca Googlemaps.

Precisa do codigo da "section" PHP aberta pelo i3Geo ou o codigo para acesso especial indicado no par&acirc;metro telaR
(veja a ferramenta TELAREMOTA).

Parametros:

g_sid {string} - codigo da "section" PHP

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
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/mapa_googlemaps.php

*/
//error_reporting(0);
error_reporting(0);
clearstatcache();
//verifica&ccedil;&atilde;o de seguran&ccedil;a
$_SESSION = array();
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
	if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $f[0] && !in_array($_GET["telaR"],$f) ){
		ilegal();
	}
}
else{
	exit;
}
if(!isset($_SESSION["map_file"])){
	exit;
}
//
$map_fileX = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
$cachedir = $_SESSION["cachedir"];
//
//converte a requisi&ccedil;&atilde;o do tile em coordenadas geo
//http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#tile_numbers_to_lon.2Flat_2
//
$x = $_GET["X"];
$y = $_GET["Y"];
$z = $_GET["Z"];

$qyfile = dirname($map_fileX)."/".$_GET["layer"].".php";
$qy = file_exists($qyfile);

if($qy == false && $_GET["cache"] == "sim" && $_GET["DESLIGACACHE"] != "sim"){
	carregaCacheImagem($_SESSION["cachedir"],$_SESSION["map_file"],$_GET["tms"]);
}

$n = pow(2,$z);
$lon1 = $x / $n * 360.0 - 180.0;
$lat2 = rad2deg(atan(sinh(pi() * (1 - 2 * $y / $n))));
$x++;
$y++;
$lon2 = $x / $n * 360.0 - 180.0;
$lat1 = rad2deg(atan(sinh(pi() * (1 - 2 * $y / $n))));
$x--;
$y--;

$projInObj = ms_newprojectionobj("proj=latlong,a=6378137,b=6378137");
$projOutObj = ms_newprojectionobj("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");

$poPoint1 = ms_newpointobj();
$poPoint1->setXY($lon1, $lat1);
$poPoint1->project($projInObj, $projOutObj);
$poPoint2 = ms_newpointobj();
$poPoint2->setXY($lon2, $lat2);
$poPoint2->project($projInObj, $projOutObj);
$_GET["BBOX"] = $poPoint1->x." ".$poPoint1->y." ".$poPoint2->x." ".$poPoint2->y;
$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);

$mapa = ms_newMapObj($map_fileX);
$ret = $mapa->extent;

$cache = false;
if(!isset($_GET["telaR"])){
	//no caso de projecoes remotas, o mapfile nao e alterado
	$numlayers = $mapa->numlayers;
	for ($i=0;$i < $numlayers;++$i){
		$l = $mapa->getlayer($i);
		$layerName = $l->name;
		$l->set("status",MS_OFF);
		if($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != ""){
			$l->set("template","none.htm");
			$l->set("status",MS_DEFAULT);
			//@TODO verificar se foi corrigido em versoes novas do mapserver
			//corrige um bug do mapserver que nao calcula a escala direito
			$l->set("maxscaledenom",$l->maxscaledenom * 100000);
			$l->set("minscaledenom",$l->minscaledenom * 100000);
			if ($l->getmetadata("classesnome") != ""){
				if(!function_exists("autoClasses")){
					include_once("funcoes_gerais.php");
				}
				autoClasses($l,$mapa);
			}
			if(!empty($postgis_mapa)){
				if($l->connectiontype == MS_POSTGIS){
					$lcon = $l->connection;
					if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
						if(($lcon == " ") || ($lcon == "")){
							$l->set("connection",$postgis_mapa);
						}
						else{
							$l->set("connection",$postgis_mapa[$lcon]);
						}
					}
				}
			}
			if($l->getProjection() == "" ){
				$l->setProjection("proj=latlong,a=6378137,b=6378137");
			}
		}
		if($layerName == $_GET["layer"]){
			if(strtolower($l->getmetadata("cache")) == "sim"){
				$cache = true;
			}
		}
	}
}
else{
	$mapa->setProjection("proj=merc,a=6378137,b=6378137,lat_ts=0.0,lon_0=0.0,x_0=0.0,y_0=0,k=1.0,units=m");
	$numlayers = $mapa->numlayers;
	for ($i=0;$i < $numlayers;++$i){
		$l = $mapa->getlayer($i);
		if($l->getProjection() == "" )
		{$l->setProjection("proj=latlong,a=6378137,b=6378137");}
	}
}
if($_GET["layer"] == "")
{$cache = true;}

if(($_GET == false) || ($qy) || (strtolower($_GET["DESLIGACACHE"]) == "sim"))
{$cache = false;}
elseif(trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum")
{$cache = false;}

if($cache == true){
	carregaCacheImagem();
}
$mapa->setsize(256,256);
$mapext = explode(" ",$_GET["mapext"]);
$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);

$o = $mapa->outputformat;
$o->set("imagemode",MS_IMAGEMODE_RGBA);

if(!isset($_GET["telaR"])){
	$legenda = $mapa->legend;
	$legenda->set("status",MS_OFF);
	$escala = $mapa->scalebar;
	$escala->set("status",MS_OFF);
}
//
//se o layer nao for do tipo fundo
//
if($_GET["tipolayer"] != "fundo")
{$o->set("transparent",MS_TRUE);}
if(trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum")
{$o->setOption("QUANTIZE_FORCE","OFF");}
if($qy != true){
	$img = $mapa->draw();
}
else{
	$handle = fopen ($qyfile, "r");
	$conteudo = fread ($handle, filesize ($qyfile));
	fclose ($handle);
	$shp = unserialize($conteudo);
	$l = $mapa->getLayerByname($_GET["layer"]);
	$indxlayer = $l->index;
	if ($l->connectiontype !== MS_POSTGIS){
		foreach ($shp as $indx)
		{$mapa->querybyindex($indxlayer,-1,$indx,MS_TRUE);}
		$qm = $mapa->querymap;
		$qm->set("width",255);
		$qm->set("height",255);
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
		$cor = $classe0->getstyle(0)->outlinecolor;
		$cor->setrgb($c->red,$c->green,$c->blue);
		$v = versaoMS();
		if($v["principal"] == 6){
			$l->open();
			foreach ($shp as $indx){
				$shape = $l->getShape(new resultObj($indx));
				$shape->draw($mapa,$l,$img);
			}
			$l->close();
		}
		else{
			$l->open();
			foreach ($shp as $indx){
				$shape = $l->getfeature($indx,-1);
				$shape->draw($mapa,$l,$img);
			}
			$l->close();
		}
	}
}
if (!function_exists('imagepng')){
	$s = PHP_SHLIB_SUFFIX;
	@dl( 'php_gd.'.$s );
	if (!function_exists('imagepng'))
	{@dl( 'php_gd2.'.$s );}
	if (!function_exists('imagepng'))
	{$_GET["TIPOIMAGEM"] = "";}
}
if(trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum"){
	if($img->imagepath == "")
	{echo "Erro IMAGEPATH vazio";exit;}
	$nomer = ($img->imagepath)."filtroimgtemp".nomeRand().".png";
	$img->saveImage($nomer);
	filtraImg($nomer,trim($_GET["TIPOIMAGEM"]));
	$img = imagecreatefrompng($nomer);
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
}
else{
	if($cache == true){
		$nomer = salvaCacheImagem();
		header('Content-Length: '.filesize($nomer));
		header('Content-Type: image/png');
		header('Cache-Control: max-age=3600, must-revalidate');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nomer)).' GMT', true, 200);
		fpassthru(fopen($nomer, 'rb'));
	}
	else{
		$nomer = ($img->imagepath)."temp".nomeRand().".png";
		$img->saveImage($nomer);
		$img = imagecreatefrompng($nomer);
		imagealphablending($img, false);
		imagesavealpha($img, true);
		ob_clean();
		echo header("Content-type: image/png \n\n");
		imagepng($img);
		imagedestroy($img);
	}
	exit;
}
//$cachedir e definido no ms_configura.php
function salvaCacheImagem(){
	global $img,$cachedir,$x,$y,$z,$map_fileX;
	$layer = $_GET["layer"];
	if($layer == "")
	{$layer = "fundo";}
	if($cachedir == ""){
		$cachedir = dirname(dirname($map_fileX))."/cache";
	}
	$c = $cachedir."/googlemaps/$layer/$z/$x";
	if(!file_exists($c."/$y.png")){
		mkdir($cachedir."/googlemaps/$layer/$z/$x",0777,true);
		$img->saveImage($c."/$y.png");
		chmod($c."/$y.png",0777);
	}
	return $nome;
}
function carregaCacheImagem(){
	global $img,$cachedir,$x,$y,$z,$map_fileX;
	$layer = $_GET["layer"];
	if($layer == "")
	{$layer = "fundo";}
	if($cachedir == ""){
		$cachedir = dirname(dirname($map_fileX))."/cache";
	}
	$c = $cachedir."/googlemaps/$layer/$z/$x";
	if(file_exists($c."/$y.png")){
		header('Content-Length: '.filesize($c."/$y.png"));
		header('Content-Type: image/png');
		fpassthru(fopen($c."/$y.png", 'rb'));
		exit;
	}
}
/*
function salvaCacheImagem($cachedir,$bbox,$layer,$map,$w,$h){
	global $img,$map_size;
	//layers que s&atilde;o sempre iguais
	//error_reporting(0);
	if($layer == "copyright" || $layer == "")
	{$bbox = "";}
	if($layer == "")
	{$layer = "fundo";}
	if($cachedir == "")
	{$cachedir = dirname(dirname($map))."/cache/googlemaps/".$layer;}
	else
	{$cachedir = $cachedir."/googlemaps/".$layer;}
	@mkdir($cachedir,0777);
	$nome = $cachedir."/".$w.$h.$bbox.".png";
	if(!file_exists($nome))
	{$img->saveImage($nome);}
	return $nome;
}
function carregaCacheImagem($cachedir,$bbox,$layer,$map,$w,$h){
	if($layer == "copyright" || $layer == "")
	{$bbox = "";}
	if($layer == "")
	{$layer = "fundo";}
	$nome = $w.$h.$bbox.".png";
	if($cachedir == "")
	{$nome = dirname(dirname($map))."/cache/googlemaps/".$layer."/".$nome;}
	else
	{$nome = $cachedir."/googlemaps/".$layer."/".$nome;}
	if(file_exists($nome)){
		header('Content-Length: '.filesize($nome));
		header('Content-Type: image/png');
		fpassthru(fopen($nome, 'rb'));
		exit;
	}
}
*/
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
function ilegal(){
	$img = imagecreatefrompng("../imagens/ilegal.png");
	imagealphablending($img, false);
	imagesavealpha($img, true);
	ob_clean();
	echo header("Content-type: image/png \n\n");
	imagepng($img);
	exit;
}
function versaoMS()
{
	$v = "5.0.0";
	$vs = explode(" ",ms_GetVersion());
	$cvs = count($vs);
	for ($i=0;$i<$cvs;++$i)
	{
		if(trim(strtolower($vs[$i])) == "version")
		{
			$v = $vs[$i+1];
		}
	}
	$versao["completa"] = $v;
	$v = explode(".",$v);
	$versao["principal"] = $v[0];
	return $versao;
}
?>