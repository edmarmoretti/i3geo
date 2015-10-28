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
	exit;
}

if($_GET["tipoRetornoProxy"] == "json"){
	$r = array($resultado);
	//echo json_encode(str_replace(array("\n","\r","\t"),"",$r));
	echo json_encode($r);
	exit;
}
echo $resultado;
?>