<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
$url = $_GET["url"];
switch (strtoupper($funcao))
{
	case "CRIALAYER":
		$mapa = ms_newMapObj($map_file);
		$novolayer = ms_newLayerObj($mapa);
		$novolayer->set("name",$url);
		$novolayer->setmetadata("TEMA",$url);
		$novolayer->setmetadata("nomeoriginal",$url);
		$novolayer->setmetadata("CLASSE","SIM");
		$novolayer->setmetadata("PLUGINI3GEO",'{"plugin":"layerkml","parametros":{"url":"'.$url.'"}}');
		$novolayer->set("type",MS_LAYER_POINT);
		$classe = ms_newClassObj($novolayer);
		$classe->set("name","");
		$novolayer->set("status",MS_DEFAULT);
		$novolayer->set("template","none.htm");
		$salvo = $mapa->save(str_replace(".map","",$map_file).".map");
		$retorno = "ok";
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>