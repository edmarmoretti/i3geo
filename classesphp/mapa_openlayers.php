<?php
/*
Title: mapa_openlayers.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substituição
das variáveis de conexão com banco e outras operações específicas do i3Geo.

É utilizado especificamente nas interfaces que utilizam a biblioteca OpenLayers em LAYERS do tipo WMS.

Precisa do código da "section" PHP aberta pelo i3Geo ou o código para acesso especial indicado no parâmetro telaR
(veja a ferramenta TELAREMOTA).

Parametros:

g_sid {string} - código da "section" PHP

telaR {string} - (opcional) utilizado para autorizar o uso do mapfile aberto (deve estar registrado em $fingerprint (variável de seção)

tipolayer {fundo|} - (opcional) indica que a imagem a ser produzida compõe o fundo do mapa

BBOX {xmin xmax ymin ymax} - extensão geográfica a ser utilizada no desenho do mapa

WIDTH {numeric} - largura do mapa

HEIGHT {numeric} - altura do mapa

layer {string} - código do layer existente no mapa que será desenhado (ignorado quando telaR for definido)

DESLIGACACHE {sim|nao} - força a não usar o cache de imagens qd definido como "sim", do contrário, o uso ou não do cache será definido automaticamente

TIPOIMAGEM {cinza|sepiaclara|sepianormal|negativo|detectaBordas|embassa|gaussian_blur|selective_blur|mean_removal|pixelate
} - filtro de imagem que será aplicado na imagem

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

Arquivo:

i3geo/classesphp/mapa_openlayers.php

*/
error_reporting(0);
//carrega dados da seção, verifica segurança
inicializa();
//
//map_fileX é necessário caso register_globals = On no PHP.INI
$map_fileX = $_SESSION["map_file"];
if(isset($_GET["tipolayer"]) && $_GET["tipolayer"] == "fundo")
{$map_fileX = str_replace(".map","fundo.map",$map_fileX);}
$postgis_mapa = $_SESSION["postgis_mapa"];
$cachedir = $_SESSION["cachedir"];
if(isset($_GET["BBOX"])){
	$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);
	$_GET["map_size"] = $_GET["WIDTH"]." ".$_GET["HEIGHT"];
}
$mapa = ms_newMapObj($map_fileX);
//
//resolve o problema da seleção na versão nova do mapserver
//
$qyfile = dirname($map_fileX)."/".$_GET["layer"].".php";
$qy = file_exists($qyfile);
//
//processa os layers do mapfile
//
if(!isset($_GET["telaR"])){//no caso de projecoes remotas, o mapfile nao e alterado
	$numlayers = $mapa->numlayers;
	$cache = false;
	for($i = 0;$i < $numlayers;$i++)
	{
		$l = $mapa->getLayer($i);
		if ($l->getmetadata("classesnome") != "")
		{
			if(!function_exists("autoClasses"))
			{include_once("funcoes_gerais.php");}
			autoClasses($l,$mapa);
		}
		$layerName = $l->name;
		if($layerName != $_GET["layer"])
		{$l->set("status",MS_OFF);}
		if($layerName == $_GET["layer"] || $l->group == $_GET["layer"] && $l->group != "")
		{
			$l->set("status",MS_DEFAULT);
			if (!empty($postgis_mapa))
			{
				if ($l->connectiontype == MS_POSTGIS)
				{
					$lcon = $l->connection;
					if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa))))
					{
						if(($lcon == " ") || ($lcon == ""))
						{$l->set("connection",$postgis_mapa);}
						else
						{$l->set("connection",$postgis_mapa[$lcon]);}
					}
				}
			}
		}
		if($layerName == $_GET["layer"])
		{
			if(strtolower($l->getmetadata("cache")) == "sim")
			{
				$cache = true;
				$nomecache = $l->getmetadata("nomeoriginal");
				if($nomecache == "")
				{$nomecache = $layerName;}
			}
		}
		$l->set("template","none.htm");
		if($_GET["REQUEST"] == "GetFeatureInfo" || $_GET["request"] == "getfeature"){
			$l->setmetadata("gml_include_items","all");
			$l->setmetadata("WMS_INCLUDE_ITEMS","all");
			$l->setmetadata("WFS_INCLUDE_ITEMS","all");
			$l->set("dump",MS_TRUE);
		}
	}
}
//if($qy || $_GET["HEIGHT"] != 256 )
//{$cache = false;}
if($_GET["layer"] == "")
{$cache = true;}
if($_GET == false)
{$cache = false;}
if(strtolower($_GET["DESLIGACACHE"]) == "sim")
{$cache = false;}
if(trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum")
{$cache = false;}
if($cache == true)
{carregaCacheImagem($cachedir,$_GET["BBOX"],$nomecache,$map_fileX,$_GET["WIDTH"],$_GET["HEIGHT"]);}

$map_size = explode(" ",$_GET["map_size"]);
$mapa->setsize($map_size[0],$map_size[1]);
if(isset($_GET["mapext"])){
	$mapext = explode(" ",$_GET["mapext"]);
	$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
}
//
//qd a cahamda e para um WMS, redireciona para ogc.php
//
if($_GET["REQUEST"] == "GetFeatureInfo" || $_GET["request"] == "getfeature"){
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
//se o layer não for do tipo fundo
//
if($_GET["tipolayer"] != "fundo")
{$o->set("transparent",MS_TRUE);}

if($qy != true)
{$img = $mapa->draw();}
else
{
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
		$cor = $classe0->getstyle(0)->outlinecolor;
		$cor->setrgb($c->red,$c->green,$c->blue);	
		$status = $l->open();
		$status = $l->whichShapes($mapa->extent);
		while ($shape = $l->nextShape())
		{
		  if(in_array($shape->index,$shp))
		  $shape->draw($mapa,$l,$img);
		}
		$l->close();
	}
}
if (!function_exists('imagepng'))
{
	$s = PHP_SHLIB_SUFFIX;
	@dl( 'php_gd.'.$s );
	if (!function_exists('imagepng'))
	{@dl( 'php_gd2.'.$s );}
	if (!function_exists('imagepng'))
	{$_GET["TIPOIMAGEM"] = "";}
}

if(trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum")
{
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
	if($cache == true)
	{$nomer = salvaCacheImagem($cachedir,$_GET["BBOX"],$nomecache,$map_fileX,$_GET["WIDTH"],$_GET["HEIGHT"]);}
	else{
		if($img->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}
		$nomer = ($img->imagepath)."imgtemp".nomeRand().".png";
		$img->saveImage($nomer);
	}
	header('Content-Length: '.filesize($nomer));
	header('Content-Type: image/png');
	//header('Cache-Control: max-age=3600, must-revalidate');
	header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
	header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nomer)).' GMT', true, 200);
	$etag = md5_file($nomer);
	header('Etag: '.$etag);
	fpassthru(fopen($nomer, 'rb'));
	exit;
}
function salvaCacheImagem($cachedir,$bbox,$layer,$map,$w,$h){
	global $img,$map_size;
	//echo "oi".$cachedir;exit;
	//layers que são sempre iguais
	if($layer == "copyright" || $layer == "")
	{$bbox = "";}
	if($layer == "")
	{$layer = "fundo";}
	if($cachedir == "")
	{$cachedir = dirname(dirname($map))."/cache/".$layer;}
	else
	{$cachedir = $cachedir."/".$layer;}
	$nome = $cachedir."/".$w.$h.$bbox.".png";
	if(!file_exists($nome))
	{
		@mkdir($cachedir,0777);
		$img->saveImage($nome);
		chmod($nome,0777);
	}
	return $nome;
}
function carregaCacheImagem($cachedir,$bbox,$layer,$map,$w,$h){
	if($layer == "copyright" || $layer == "")
	{$bbox = "";}
	if($layer == "")
	{$layer = "fundo";}
	$nome = $w.$h.$bbox.".png";
	if($cachedir == "")
	{$nome = dirname(dirname($map))."/cache/".$layer."/".$nome;}
	else
	{$nome = $cachedir."/".$layer."/".$nome;}
	if(file_exists($nome))
	{
/*
		header('Accept-Ranges: bytes');
		header('Content-Length: '.filesize($nome));
		header('Content-Type: image/png');
		ob_start;
		ob_flush();
		readfile($nome);
		exit;

		ob_start();
		// assuming you have image data in $imagedata
		$img = file_get_contents($nome);
		$length = strlen($img);
		header('Accept-Ranges: bytes');
		header('Content-Length: '.$length);
		header('Content-Type: image/png');
		print($img);
		ob_end_flush();
		exit;
*/
		header('Content-Length: '.filesize($nome));
		header('Content-Type: image/png');
		//header('Cache-Control: max-age=3600, must-revalidate');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time()+24*60*60) . ' GMT');
		header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($nome)).' GMT', true, 200);
		$etag = md5_file($nome);
		header('Etag: '.$etag);
		fpassthru(fopen($nome, 'rb'));
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
	$_COOKIE = array();
	if (!function_exists('ms_GetVersion')){
		$s = PHP_SHLIB_SUFFIX;
		@dl( 'php_mapscript.'.$s );
		$ler_extensoes[] = 'php_mapscript';
	}
	//verificação de segurança
	$_SESSION = array();
	session_name("i3GeoPHP");
	if(@$_GET["g_sid"])
	{session_id($_GET["g_sid"]);}
	else
	{ilegal();}
	session_start();
	//var_dump($_SESSION);exit;
	if(@$_SESSION["fingerprint"])
	{
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