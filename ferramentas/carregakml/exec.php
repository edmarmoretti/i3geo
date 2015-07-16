<?php
include_once(dirname(__FILE__)."/../inicia.php");
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "CRIALAYER":
		$mapa = ms_newMapObj($map_file);
		$novolayer = ms_newLayerObj($mapa);
		$novolayer->set("name",$url);
		$novolayer->setmetadata("TEMA",$url);
		$novolayer->setmetadata("CLASSE","SIM");
		$novolayer->setmetadata("PLUGINI3GEO",'{"plugin":"layerkml","parametros":{"url":"'.$url.'"}}');
		$novolayer->set("type",MS_LAYER_POINT);
		$classe = ms_newClassObj($novolayer);
		$classe->set("name","");
		$novolayer->set("status",MS_DEFAULT);
		$novolayer->set("template","none.htm");
		$salvo = $mapa->save($map_file);
		$retorno = "ok";
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
?>