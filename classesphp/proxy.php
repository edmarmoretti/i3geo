<?php
if(!isset($i3geo_proxy_server)){
	include(dirname(__FILE__)."/../ms_configura.php");
}
$ch = curl_init();
if(!$ch){
	echo "erro curl_init";
	exit;
}
if($_GET["url"]){
	curl_setopt($ch, CURLOPT_URL, $_GET["url"]);
}
else{
	curl_setopt($ch, CURLOPT_URL, $_SERVER["QUERY_STRING"]);
}
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
if(isset($i3geo_proxy_server) && $i3geo_proxy_server != ""){
	curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);
if($_GET["tipoRetornoProxy"] == "string"){
	echo '"'.$resultado.'"';
}
else{
	echo $resultado;
}
?>