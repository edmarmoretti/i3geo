<?php
include_once("../classesphp/pega_variaveis.php");
$caminho = "../";
$layers = $temasa;
$executa = "iniciamobile";
include("../ms_criamapa.php");
function iniciamobile()
{
	global $wmobile,$hmobile,$tmpfname;
	$mapa = ms_newMapObj($tmpfname);
	$mapa->setsize($wmobile,$hmobile);
	$mapa->save($tmpfname);
	$tipo = "inicia";
	include("mobile.php");
	exit;
}	
?>