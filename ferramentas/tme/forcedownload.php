<?php
if(empty($_REQUEST["g_sid"])){
    exit;
}
$g_sid = $_REQUEST["g_sid"];
session_name("i3GeoPHP");
session_id($g_sid);
session_start([
    'read_and_close' => true
]);
if($_SESSION["downloadTmeKmz"] != ""){
    $arquivo = $_SESSION["downloadTmeKmz"];
    header("Content-Transfer-Encoding: binary");
    header('Content-Disposition: attachment; filename="'.basename($arquivo).'"');
    readfile($arquivo);
    exit;
} else {
    header("HTTP/1.1 500 erro ao localizar o arquivo");
}
?>