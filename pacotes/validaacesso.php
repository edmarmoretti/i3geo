<?php
/*
 * Utilizado em include para impedir o uso de um php fora do i3Geo
 * Exemplo de uso:
 *
 * define(I3GEO,true); include("validaacesso.php");
 *
 */
defined('I3GEO') or die(header('HTTP/1.0 403 Forbidden'));
session_name("i3GeoPHP");
session_id($_COOKIE["i3GeoPHP"]);
session_start();
if($_SESSION["fingerprint"] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
	echo "Ooops - acesso nao permitido";
	exit;
}
?>