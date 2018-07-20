<?php
include_once (dirname(__FILE__) . "/../classesphp/sani_request.php");
error_reporting(0);
$_GET = array_merge($_GET, $_POST);
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();
$f = explode(",", $_SESSION["fingerprint"]);
if ($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . $_GET["g_sid"])) {
    header("Content-type: application/json");
    echo json_encode(array(
        "errorMsg" => "Tentativa de acesso nao permitida. Inicie um novo mapa."
    ));
    exit();
}
include_once (dirname(__FILE__) . "/../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__) . "/blacklist.php");
if ($_SESSION["logExec"]["ferramentas"] == true) {
    i3GeoLog("prog: ferramentas url: " . implode("&", $_GET), $_SESSION["dir_tmp"]);
}
?>