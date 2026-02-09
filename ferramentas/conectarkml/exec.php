<?php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$retorno = "";
$url = $_GET["url"];
switch (strtoupper($_GET["funcao"]))
{
	case "CRIALAYER":
	    $mapa = ms_newMapObj($_SESSION["map_file"]);
		$novolayer = ms_newLayerObj($mapa);
		$novolayer->set("name",str_replace([".",":","/"],"",$url));
		$novolayer->setmetadata("TEMA",$url);
		$novolayer->setmetadata("nomeoriginal",$url);
		$novolayer->setmetadata("CLASSE","SIM");
		$novolayer->setmetadata("PLUGINI3GEO",'{"plugin":"layerkml","parametros":{"url":"'.$url.'"}}');
		$novolayer->set("type",MS_LAYER_POINT);
		$classe = ms_newClassObj($novolayer);
		$classe->set("name","");
		$novolayer->set("status",MS_DEFAULT);
		$novolayer->set("template","none.htm");
		$salvo = $mapa->save(str_replace(".map","",$_SESSION["map_file"]).".map");
		ob_clean();
		header("Content-type: application/json");
		echo json_encode(array(
		    "errorMsg" => ""
		));
		exit;
	break;
}
?>