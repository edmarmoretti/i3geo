<?php
include_once(dirname(__FILE__)."/../inicia.php");
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
		if(empty($maxscaledenom)){
			$maxscaledenom = -1;
		}
		if(empty($minscaledenom)){
			$minscaledenom = -1;
		}
		$layer->set("maxscaledenom",$maxscaledenom);
		$layer->set("minscaledenom",$minscaledenom);
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
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else{
	exit();
}
?>
