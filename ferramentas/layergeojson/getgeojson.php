<?php
define("I3GEO",true);
include("../../pacotes/validaacesso.php");

include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$ch = curl_init();
$arq = $locaplic."/temas/" . $_GET["tema"] . ".map";
//nao e um arquivo e sim uma url
if(!file_exists($arq)){
	//$url = str_replace(".kml","",$_GET["tema"]).".kml";
	session_name("i3GeoPHP");
	session_id($_GET["sid"]);
	session_start();
	$arq = $_SESSION["map_file"];
	//por questoes de seguranca
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
}
$map = ms_newMapObj($arq);
$layer = $map->getlayerbyname($_GET["tema"]);
if($layer == ""){
	exit;
}
$plugin = $layer->getmetadata("PLUGINI3GEO");
$a = json_decode($plugin);
$url = $a->parametros->url;

if(!$ch){
	echo "erro curl_init";
	exit;
}
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
	curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);
ob_clean();
header('Content-type: application/json');
echo $resultado;
?>