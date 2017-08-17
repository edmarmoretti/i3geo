<?php
include(dirname(__FILE__)."/../../ms_configura.php");
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$usuarioGeonames = "i3geo";
//set_time_limit(600);
require_once(dirname(__FILE__)."/../../pacotes/cpaint/cpaint2.inc.php");
include_once (dirname(__FILE__)."/../../classesphp/sani_request.php");
$_GET = array_merge($_GET,$_POST);
$ret = $_GET["ret"];
require_once(dirname(__FILE__)."/../../classesphp/carrega_ext.php");
error_reporting(0);
$cp = new cpaint();
$cp->register('listaartigos');
$cp->start();
$cp->return_data();
function listaartigos()
{
	global $ret, $cp, $usuarioGeonames;
	$e = explode(" ",$ret);
	$url = "http://api.geonames.org/wikipediaBoundingBox?username=".$usuarioGeonames."&style=full&north=".$e[3]."&south=".$e[1]."&east=".$e[2]."&west=".$e[0]."&maxRows=20";
	//echo $url;exit;
	$xml = simplexml_load_file($url."&lang=pt");
	$conta = 0;
	$fim = array();
	$resultado = "";
	foreach($xml->entry as $e)
	{
		$r = $e->xpath('title');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .= "<h4>".$r."</h4> ";

		//$r = $e->xpath('feature');
		//if (function_exists(mb_convert_encoding))
		//{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		//$resultado .=  "<span style=color:red >".$r."</span><br>";

		$r = $e->xpath('summary');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .=  "<h5>" . $r . "</h5>";

		$r = $e->xpath('wikipediaUrl');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .=  "<a href='".$r."' target=blank >abrir Wikpedia</a><br>";
		$resultado .=  "<hr>";
	}
	if ($resultado == "")
	{$resultado = "<span style=color:red >Nada encontrado</span><br><hr>";}
	$cp->set_data($resultado);
}
?>