<?php
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])){
    exit;
}
include_once (dirname(__FILE__) . "/../classesphp/sani_request.php");

error_reporting(0);
ini_set("session.use_cookies", 0);
session_name("i3GeoPHP");
if (@$_GET["g_sid"]) {
    session_id($_GET["g_sid"]);
} elseif (@$_COOKIE["i3GeoPHP"]) {
    session_id($_COOKIE["i3GeoPHP"]);
}
session_start([
    'read_and_close' => true
]);

$f = explode(",", $_SESSION["fingerprint"]);
if ($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . $_GET["g_sid"])) {
    header("Content-type: application/json");
    echo json_encode(array(
        "errorMsg" => "Tentativa de acesso nao permitida. Inicie um novo mapa."
    ));
    exit();
}
if(!function_exists("cpjson")){
    include_once (dirname(__FILE__) . "/../classesphp/funcoes_gerais.php");
}
include_once (dirname(__FILE__) . "/blacklist.php");
if ($_SESSION["logExec"]["ferramentas"] == true) {
    i3GeoLog("prog: ferramentas url: " . implode("&", $_GET), $_SESSION["dir_tmp"]);
}
?>