<?php
if(empty($_GET["g_sid"])){
    exit;
}
$g_sid = $_GET["g_sid"];
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
$f = explode(",", $_SESSION["fingerprint"]);
if ($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . $_GET["g_sid"])) {
    header("Content-type: application/json");
    echo json_encode(array(
        "errorMsg" => "Tentativa de acesso nao permitida. Inicie um novo mapa."
    ));
    exit();
}
include_once (dirname(__FILE__) . "/../../classesphp/funcoes_gerais.php");
include_once (dirname(__FILE__) . "/../blacklist.php");

verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "DOWNLOAD":
        $retorno = downloadTema2($_SESSION["map_file"], $_GET["tema"], $_SESSION["locaplic"], $_SESSION["dir_tmp"], $_SESSION["postgis_mapa"]);
        $retorno["arquivos"] = "";
        $retorno["datas"] = "";
        $_SESSION["downloadZipTema"] = $retorno["shape-zip"];
        $retorno["shape-zip"] = basename($retorno["shape-zip"]);
        session_write_close();
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>