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
if($_SESSION["downloadTmeLegenda"] != ""){
    readfile($_SESSION["downloadTmeLegenda"]);
    exit;
}
?>