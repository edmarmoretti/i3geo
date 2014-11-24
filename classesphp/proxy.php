<?php
if(!isset($i3geo_proxy_server)){
	include(dirname(__FILE__)."/../ms_configura.php");
}
$ch = curl_init();
if(!$ch){
	echo "erro curl_init";
	exit;
}
curl_setopt($ch, CURLOPT_URL, $_GET["url"]);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
	curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);
echo $resultado;
?>