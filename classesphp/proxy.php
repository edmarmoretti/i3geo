<?php 
$ch = curl_init();
if(!$ch){
	echo "erro curl_init";
	exit;
}
curl_setopt($ch, CURLOPT_URL, $_GET["url"]);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$resultado = curl_exec($ch);
echo $resultado;
?>