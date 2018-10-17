<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);

switch (strtoupper($_GET["funcao"]))
{
	case "CONVERTEWMSWMC":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		$m = new Mapa($_SESSION["map_file"]);
		$wms = "/ferramentas/convertews/ogc.php?sid=".$_GET["g_sid"];
		$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
		$protocolo = $protocolo[0];
		$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
		$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
		$urli3geo = str_replace("/ferramentas/convertews/exec.php","",$protocolo.$_SERVER["PHP_SELF"]);
		$wmc = $m->converteWMC($_SESSION["locmapserv"],$urli3geo);
		$retorno = array("wms"=>$wms,"wmc"=>$wmc);
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);