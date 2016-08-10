<?php
include_once(dirname(__FILE__)."/../safe.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: MINMAX

*/
	case "MINMAX":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		if(empty($_GET["maxscaledenom"])){
			$_GET["maxscaledenom"] = -1;
		}
		if(empty($_GET["minscaledenom"])){
			$_GET["minscaledenom"] = -1;
		}
		$layer->set("maxscaledenom",$_GET["maxscaledenom"]);
		$layer->set("minscaledenom",$_GET["minscaledenom"]);
		$layer->setmetadata("cache","");
		$mapa->save($map_file);
		$retorno = "ok";
	break;
	case "ATUAL":
		$mapa = ms_newMapObj($map_file);
		$layer = $mapa->getlayerbyname($tema);
		$retorno = array(
			"maxscaledenom"	=> $layer->maxscaledenom,
			"minscaledenom"	=> $layer->minscaledenom
		);
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>
