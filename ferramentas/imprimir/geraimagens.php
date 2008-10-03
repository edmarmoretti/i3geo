<?php
require_once("../../classesphp/pega_variaveis.php");
error_reporting(0);
session_name("i3GeoPHP");
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
$postgis_mapa = $_SESSION["postgis_mapa"];
//
//se as extensões já estiverem carregadas no PHP, vc pode comentar essa linha para que o processamento fique mais rápido
//
include_once ("../../classesphp/carrega_ext.php");
//
//carrega o phpmapscript
//
$exts = get_loaded_extensions();
if (array_search( "MapScript", $exts) != TRUE)
{
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{
		if(!@dl('php_mapscript_48.dll'))
		dl('php_mapscript.dll');
	}
	else
	{dl('php_mapscript.so');}
}
require("../../classesphp/funcoes_gerais.php");
$nomes = nomeRandomico();

$temp = str_replace(".map","xxx.map",$map_file);
$map = ms_newMapObj($map_file);
$map->save($temp);
substituiCon($temp,$postgis_mapa);
$map = ms_newMapObj($temp);

$w = $map->width;
$h = $map->height;
$legenda =$map->legend;
$legenda->set("status",MS_EMBED);
//altera o nome das classes vazias
$temas = $map->getalllayernames();
foreach ($temas as $tema)
{
	$layer = $map->getlayerbyname($tema);
	if (($layer->data != "") && ($layer->getmetadata("escondido") != "SIM") && ($layer->getmetadata("tema") != "NAO"))
	{
		if ($layer->numclasses > 0)
		{
			$classe = $layer->getclass(0);
			if (($classe->name == "") || ($classe->name == " "))
			{$classe->set("name",$layer->getmetadata("tema"));}
		}
	}
}
$imgo = $map->draw();
$nomer = ($imgo->imagepath)."mapa".$nomes.".png";
$imgo->saveImage($nomer);
$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$nomemapa = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).basename($nomer);
?>