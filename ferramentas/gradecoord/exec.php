<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"])) {
	case "GRADECOORD":
		include_once("../../classesphp/classe_mapa.php");
		$m = new Mapa($_SESSION["map_file"]);
		$retorno = $m->gradeCoord($_GET["intervalo"],$_GET["corlinha"],$_GET["larguralinha"],$_GET["tipolinha"],$_GET["tamanhotexto"],$_GET["font"],$_GET["cortexto"],$_GET["incluitexto"],$_GET["mascara"],$_GET["shadowcolor"],$_GET["shadowsizex"],$_GET["shadowsizey"]);
        $m->salva();
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);