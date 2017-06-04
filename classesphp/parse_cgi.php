<?php
exit;
/*
Title: parse_cgi.php

Faz o processamento de um mapfile segundo as necessidades do i3geo, como por exemplo, fazendo a substitui&ccedil;&atilde;o
das vari&aacute;veis de conex&atilde;o com banco e outras opera&ccedil;&otilde;es espec&iacute;ficas do i3Geo.

Pode ser utilizado na tag IMG de um arquivo HTML ao inv&eacute;s de ser utilizado o Mapserver em modo CGI.

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
Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/parse_cgi.php

Par&acirc;metros:

$g_sid {string} - c�digo da se&ccedil;&atilde;o aberta no servidor

$map_size {string} - string com o tamanho do novo mapa (w h)

$mapext {string}- extens&atilde;o geogr&aacute;fica do novo mapa (xmin ymin xmax ymax)

$map_imagecolor {string} - cor do fundo do mapa (default &eacute; -1 -1 -1)

$map_transparent {string} - a cor do fundo ser&aacute; transparente? (ON OFF, default &eacute; ON)

Exemplo:

http://localhost/i3geo/classesphp/parse_cgi.php?g_sid=dgge4877dhhhgrjjey&map_size=500 500
*/
//error_reporting(0);
include_once (dirname(__FILE__)."/classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
include_once ("carrega_ext.php");
include_once("funcoes_gerais.php");
$temp = $_GET["mapext"];
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();
$mapext = $temp;
$map_file = $_SESSION["map_file"];
$fingerprint = $_SESSION["fingerprint"];
include(dirname(__FILE__)."/../ms_configura.php");
if(isset($fingerprint))
{
	if (md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id()) != $fingerprint)
	{exit;}
}
if (!isset($_GET["map_imagecolor"])){
	$map_imagecolor = "-1 -1 -1";
} else {
	$map_imagecolor = $_GET["map_imagecolor"];
}

if (!isset($map_transparent)){
	$map_transparent = "ON";
} else {
	$map_transparent = $_GET["map_transparent"];
}
//
//faz uma c�pia do mapfile para poder manipular sem afetar omapfile atual usado pelo i3geo
//
$nomerando = nomerandomico();
//echo $map_file."<br>";
$map_filen = str_replace(basename($map_file),$nomerando.".map",$map_file);
$map_filen = str_replace(".map","",$map_filen).".map";
copy($map_file,$map_filen);
substituiCon($map_filen,$postgis_mapa);
$map = ms_newMapObj($map_filen);
restauraCon($map_filen,$postgis_mapa);
$layersNames = $map->getalllayernames();
foreach ($layersNames as $layerName)
{
	$layer = $map->getLayerByname($layerName);
	if ($layer->getmetadata("classesnome") != "")
	{autoClasses($layer,$map);}
	if($layer->type == MS_LAYER_POLYGON)
	{
		$nclasses = $layer->numclasses;
		for($i=0;$i<$nclasses;++$i){
			$classe = $layer->getclass($i);
			$nestilos = $classe;
			for($j=0;$j<$nestilos;++$j){
				$estilo = $classe->getstyle($j);
				$estilo->set("symbolname","pt1");
			}
		}
	}
}
if(isset($_GET["map_size"]))
{
	$map_size = explode(",",$_GET["map_size"]);
	$map->setsize($map_size[0],$map_size[1]);
}
if(isset($_GET["mapext"]))
{
	$mapext = explode(" ",$_GET["mapext"]);
	$map->setExtent($mapext[0],$mapext[1],$mapext[2],$mapext[3]);
}
//$map->save($map_file);
$s = $map->scalebar;
$s->set("status",MS_OFF);
$map_imagecolor = explode(" ",$map_imagecolor);
$imgcolor = $map->imagecolor;
$imgcolor->setrgb($map_imagecolor[0],$map_imagecolor[1],$map_imagecolor[2]);
$o = $map->outputformat;

if(strtolower($map_transparent) == "on")
$o->set("transparent",MS_ON);
else
$o->set("transparent",MS_OFF);

$img = $map->draw();
echo header("Content-type: " . $map->outputformat->mimetype  . "\n\n");
$img->saveImage("");
unlink($map_filen);
?>
