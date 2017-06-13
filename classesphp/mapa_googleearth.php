<?php
/*
Title: mapa_googleearth.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.

&Eacute; utilizado especificamente nas interfaces que utilizam a biblioteca Google Earth.


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

i3geo/classesphp/mapa_googleearth.php

*/
include("sani_request.php");
//error_reporting(0);
//error_reporting(0);
//para efeitos de compatibilidade
if (!function_exists('ms_GetVersion')){
	include_once ("carrega_ext.php");
}
clearstatcache();
if (!function_exists('ms_GetVersion'))
{
	$s = PHP_SHLIB_SUFFIX;
	@dl( 'php_mapscript.'.$s );
	$ler_extensoes[] = 'php_mapscript';
}
//verifica&ccedil;&atilde;o de seguran&ccedil;a
$_SESSION = array();
session_name("i3GeoPHP");
if(@$_GET["g_sid"])
{session_id($_GET["g_sid"]);}
else
{exit;}
session_start();
if(!isset($_SESSION["map_file"]))
{exit;}
//
$map_fileX = $_SESSION["map_file"];
$postgis_mapa = $_SESSION["postgis_mapa"];
//por seguranca
include_once("funcoes_gerais.php");
restauraCon($map_fileX,$postgis_mapa);

if($_GET["REQUEST"] == "GetKml")
{retornaKml();}
else
{retornaWms($map_fileX,$postgis_mapa);}
return;
function retornaKml(){
	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	//$servidor = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'];
	//$url = $servidor.'http://localhost:80/cgi-bin/mapserv.exe?map=c:/ms4w/tmp/ms_tmp/rPzBHuOtQa/rPzBHuOtQa.map&amp;width=1500&amp;height=1500&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;SRS=EPSG:4618&amp;STYLES=&amp;FORMAT=image/jpeg&amp;TRANSPARENT=TRUE&amp;layers=estadosl';
	$serv = strtolower($protocolo[0]) . '://'.$_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_PORT'] ? ':'.$_SERVER['SERVER_PORT'] : '') . $_SERVER['PHP_SELF'];
	$url = $serv."?g_sid=".$_GET["g_sid"]."&amp;WIDTH=1500&amp;HEIGHT=1500&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;STYLES=&amp;FORMAT=image/png&amp;TRANSPARENT=TRUE&amp;layer=".$_GET["layer"]."&amp;TIPOIMAGEM=".$_GET["TIPOIMAGEM"];
	$kml = '
		<kml xmlns="http://earth.google.com/kml/2.0">
		  <Document>
			<GroundOverlay>
			  <name>'.$_GET["layer"].'</name>
			  <Icon>
				<href>'.$url.'</href>
				<viewRefreshMode>onStop</viewRefreshMode>
				<refreshMode>onChange</refreshMode>
			  </Icon>
			  <LatLonBox>
				<north></north>
				<south></south>
				<east></east>
				<west></west>
			  </LatLonBox>
			</GroundOverlay>
		  </Document>
		</kml>';
	echo header("Content-type: application/xml");
	echo $kml;
}
function retornaWms($map_fileX,$postgis_mapa){
	//error_reporting(0);
	if(isset($_GET["bbox"]))
	{$_GET["BBOX"] = $_GET["bbox"];}
	if(isset($_GET["BBOX"]))
	{
		$_GET["mapext"] = str_replace(","," ",$_GET["BBOX"]);
		$m = explode(" ",$_GET["mapext"]);
		$dx = $m[0] - $m[2];
		if($dx < 0){$dx = $dx * -1;}
		$dy = $m[1] - $m[3];
		if($dy < 0){$dy = $dy * -1;}
		$_GET["HEIGHT"] = ($_GET["WIDTH"] / $dx) * $dy;
		//$_GET["map_size"] = $_GET["WIDTH"]." ".$_GET["HEIGHT"];
	}
	$mapa = ms_newMapObj($map_fileX);
	$mapa->setProjection("init=epsg:4326");
	//
	//resolve o problema da sele&ccedil;&atilde;o na vers&atilde;o nova do mapserver
	//
	$qyfile = dirname($map_fileX)."/".$_GET["layer"]."_qy.map";
	$qy = file_exists($qyfile);
	$o = $mapa->outputformat;
	$o->set("imagemode",MS_IMAGEMODE_RGBA);
		$numlayers = $mapa->numlayers;
		for ($i=0;$i < $numlayers;++$i)
		{
			$l = $mapa->getlayer($i);
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
			$l->set("template","none.htm");
		}
	$mapa->setsize($_GET["WIDTH"],$_GET["HEIGHT"]);
	if(isset($_GET["mapext"])){
		$mapext = explode(" ",$_GET["mapext"]);
		$mapa->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
	}
		$legenda = $mapa->legend;
		$legenda->set("status",MS_OFF);
		$escala = $mapa->scalebar;
		$escala->set("status",MS_OFF);
	//
	//se o layer n&atilde;o for do tipo fundo
	//
	if(isset($_GET["tipolayer"]) && $_GET["tipolayer"] != "fundo")
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

	if(isset($_GET["TIPOIMAGEM"]) && trim($_GET["TIPOIMAGEM"]) != "" && trim($_GET["TIPOIMAGEM"]) != "nenhum")
	{
		if($img->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}
		$nomer = ($img->imagepath)."filtroimgtemp".nomeRandomico().".png";
		$img->saveImage($nomer);
		filtraImagem($nomer,$_GET["TIPOIMAGEM"]);
		$img = imagecreatefrompng($nomer);
		imagealphablending($img, false);
		imagesavealpha($img, true);
		ob_clean();
		echo header("Content-type: image/png \n\n");
		imagepng($img);
	}
	else{
		ob_clean();
		if($img->imagepath == "")
		{echo "Erro IMAGEPATH vazio";exit;}
		$nomer = ($img->imagepath)."imgtemp".nomeRandomico().".png";
		$img->saveImage($nomer);
		$img = imagecreatefrompng($nomer);
		imagealphablending($img, false);
		imagesavealpha($img, true);
		ob_clean();
		echo header("Content-type: image/png \n\n");
		imagepng($img);
	}
}

function nomeRandomico($n=10)
{
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = 51;
	for($i=0; $i < $n; ++$i)
	{$nomes .= $a{mt_rand(0, $max)};}
	return $nomes;
}
function filtraImagem($nomer,$tipoimagem){
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
?>