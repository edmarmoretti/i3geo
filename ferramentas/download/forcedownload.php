<?php
if(empty($_REQUEST["g_sid"])){
    exit;
}
$g_sid = $_REQUEST["g_sid"];
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
if($_SESSION["downloadZipTema"] != ""){
    $arquivo = $_SESSION["downloadZipTema"];
    $_SESSION["downloadZipTema"] = "";
    session_write_close();
    header("Content-Transfer-Encoding: binary");
    header('Content-Disposition: attachment; filename="'.basename($arquivo).'"');
    readfile($arquivo);
    exit;
} else {
    $_SESSION["downloadZipTema"] = "";
    session_write_close();
}
?>