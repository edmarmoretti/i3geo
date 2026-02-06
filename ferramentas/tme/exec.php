<?php
session_name("i3GeoLogin");
session_id();
session_start([
    'read_and_close' => true
]);
session_write_close();
if ($_SESSION["usuario"] == "" || ($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"])) {
    header("HTTP/1.1 403 Voce deve fazer login");
    exit();
}
if (verificaOperacaoSessao("admin/html/editormapfile") == false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao. Tente fazer login novamente.");
    exit();
}
ini_set("session.use_cookies", 0);
session_name("i3GeoPHP");
session_id($_POST["g_sid"]);
session_start([
    'read_and_close' => true
]);
include_once (dirname(__FILE__) . "../../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)), "", false);
$retorno = false;
switch (strtoupper($_POST["funcao"]))
{
	case "REMOVETME":
		$mapa = ms_newMapObj($_SESSION["map_file"]);
		$l = $mapa->getlayerbyname($_POST["tema"]);
		if($l != ""){
			$l->setmetadata("tme","");
			$mapa->save($_SESSION["map_file"]);
		}
		$retorno = true;
	break;
	case "INCLUITME":
	    $mapa = ms_newMapObj($_SESSION["map_file"]);
	    $l = $mapa->getlayerbyname($_POST["tema"]);
		if($l != ""){
		    $l->setmetadata("tme",base64_decode($_POST["tme"]));
			$mapa->save($_SESSION["map_file"]);
		}
		$retorno = true;
	break;
}
ob_clean();
if ($retorno == false) {
    header("HTTP/1.1 500 erro ");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}
function verificaOperacaoSessao($operacao)
{
    $resultado = false;
    // verifica se e administrador, caso positivo, permite qq operacao
    foreach ($_SESSION["papeis"] as $p) {
        if ($p == 1) {
            return true;
        }
    }
    if (! empty($_SESSION["operacoes"][$operacao])) {
        $resultado = true;
    }
    return $resultado;
}