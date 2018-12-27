<?php
//https://www.mediawiki.org/wiki/API:Main_page
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$ret = explode(" ",$_GET["ext"]);
$x = $ret[0]*1 + (($ret[2]*1 - $ret[0]*1) / 2);
$y = $ret[1]*1 + (($ret[3]*1 - $ret[1]*1) / 2);
$url = "https://pt.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=".$y."|".$x."&gsradius=" . $_GET["raio"] . "&gslimit=15&format=json";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//curl_setopt($ch, CURLOPT_TIMEOUT, 120);
//curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
//curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
if (isset($i3geo_proxy_server) && $i3geo_proxy_server != "") {
    curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);
$resultado = json_decode($resultado,false);
$resultado = $resultado->query->geosearch;
header("Content-type: application/json");
echo json_encode($resultado);
/*
array(10) {
  [0]=>
  object(stdClass)#6 (7) {
    ["pageid"]=>
    int(49169990)
    ["ns"]=>
    int(0)
    ["title"]=>
    string(58) "ServiÃ§o Brasileiro de Apoio Ã s Micro e Pequenas Empresas"
    ["lat"]=>
    float(-15.816)
    ["lon"]=>
    float(-47.8882)
    ["dist"]=>
    float(1309.3)
    ["primary"]=>
    string(0) ""
  }
 */