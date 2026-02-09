<?php
include (dirname(__FILE__) . "/../../classesphp/sani_request.php");
include_once (dirname(__FILE__) . "/../../classesphp/carrega_ext.php");
include (dirname(__FILE__) . "/../../ms_configura.php");
$_GET = array_merge($_GET, $_POST);
error_reporting(0);
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();
$_GET["tema"] = $_SESSION["mapfilecopia"];
$tema = $_SESSION["mapfilecopia"];

if (isset($_GET["BBOX"])) {
    $_GET["BBOX"] = str_replace(" ", ",", $_GET["BBOX"]);
}
set_time_limit(0);
ini_set('memory_limit', '512M');

include (dirname(__FILE__) . "/../../classesphp/funcoes_gerais.php");
//
// pega os enderecos para compor a url de chamada do gerador de web services
//
$protocolo = explode("/", $_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://' . $_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://' . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php", "", $protocolo . $_SERVER["PHP_SELF"]);

// ajusta o OUTPUTFORMAT
$OUTPUTFORMAT = $_GET["OUTPUTFORMAT"];
//
// caso seja uma requisição WMS com format
//
$format = $_GET["format"];
//
// usa o epsg correto ao inves do apelido inventado pelo Google
//
if ($_GET["SRS"] == "EPSG:900913" || $_GET["srs"] == "EPSG:900913") {
    $_GET["SRS"] = "EPSG:3857";
    $_GET["srs"] = "EPSG:3857";
}
if (! isset($_GET["srs"]) && ! isset($_GET["SRS"])) {
    $_GET["srs"] = "EPSG:4326";
    $_GET["SRS"] = "EPSG:4326";
}
$req = ms_newowsrequestobj();
//
// inclui todos os parametros na requisicao e aproveita para verificar getcapabilities
//
$oMap = ms_newMapobj($tema);
$c = $oMap->numlayers;
$ls = array();
for ($i = 0; $i < $c; ++ $i) {
    $l = $oMap->getlayer($i);
    if ($l->status == MS_DEFAULT) {
        $ls[] = $l->name;
    }
}
$_GET["LAYERS"] = implode(",", $ls);

foreach ($_GET as $k => $v) {
    $req->setParameter(strtoupper($k), $v);
}
//
// cria uma lista de epsgs para o getcapabilities
//
$req->setParameter("srsName", $req->getValueByName("SRS"));
$req->setParameter("VeRsIoN", "1.1.1");
substituiConObj($oMap, $postgis_mapa);
$oMap->setmetadata("ows_enable_request", "*");
$oMap->setmetadata("wms_srs", $_GET["SRS"]);
if (ob_get_contents()) {
    ob_end_clean();
}
ms_ioinstallstdouttobuffer();
$req->setParameter("format", "image/png");
ob_clean();
$oMap->owsdispatch($req);
$contenttype = ms_iostripstdoutbuffercontenttype();
header("Content-type: $contenttype");
$buffer = ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
function nomeRand($n = 10)
{
    $nomes = "";
    $a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $max = 51;
    for ($i = 0; $i < $n; ++ $i) {
        $nomes .= $a{mt_rand(0, $max)};
    }
    return $nomes;
}
?>
