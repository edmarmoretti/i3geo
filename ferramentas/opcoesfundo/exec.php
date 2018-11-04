<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"])) {
	case "CORFUNDO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		$m = new Mapa($_SESSION["map_file"]);
		$retorno = $m->corfundo($_GET["cor"]);
		$m->salva();
	break;

}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);