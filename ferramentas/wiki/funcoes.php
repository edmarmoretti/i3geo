<?php
//set_time_limit(600);
require_once("../../pacotes/cpaint/cpaint2.inc.php");
require_once("../../classesphp/pega_variaveis.php");
require_once("../../classesphp/carrega_ext.php");
error_reporting(0);
$cp = new cpaint();
$cp->register('listaartigos');
$cp->start();
$cp->return_data();
function listaartigos()
{
	global $ret, $cp;
	$e = explode(" ",$ret);
	$url = "http://ws.geonames.org/wikipediaBoundingBox?srv=121&north=".$e[3]."&south=".$e[1]."&east=".$e[2]."&west=".$e[0]."&maxRows=20";
	$xml = simplexml_load_file($url."&lang=pt");
	$conta = 0;
	$fim = array();
	$resultado = "";
	foreach($xml->entry as $e)
	{
		$r = $e->xpath('title');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .= "<b>".$r."</b> - ";

		$r = $e->xpath('feature');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .=  "<span style=color:red >".$r."</span><br>";

		$r = $e->xpath('summary');
		if (function_exists(mb_convert_encoding))
		{$r = mb_convert_encoding($r[0],"HTML-ENTITIES","auto");}
		$resultado .=  $r."<br>";

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