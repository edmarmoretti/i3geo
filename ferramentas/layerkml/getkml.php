<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$arq = $locaplic."/temas/" . $_GET["tema"] . ".map";
if(!file_exists($arq)){
	exit;
}
$map = ms_newMapObj($arq);
$layer = $map->getlayerbyname($_GET["tema"]);
if($layer == ""){
	exit;
}
$plugin = $layer->getmetadata("PLUGINI3GEO");
$a = json_decode($plugin);
$url = $a->parametros->url;

$ch = curl_init();
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
echo $resultado;
?>