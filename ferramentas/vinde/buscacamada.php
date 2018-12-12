<?php
// http://localhost/i3geo/ferramentas/vinde/wmsindejson.php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://visualizador.inde.gov.br/api/buscacamada/");
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
if (isset($i3geo_proxy_server) && $i3geo_proxy_server != "") {
    curl_setopt($ch, CURLOPT_PROXY, $i3geo_proxy_server);
}
$resultado = curl_exec($ch);
header("Content-type: application/json");
echo $resultado;
function converte($texto)
{
    $texto = mb_convert_encoding($texto, "ISO-8859-1", "AUTO");
    return $texto;
}