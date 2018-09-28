<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include(dirname(__FILE__)."/../../classesphp/classe_temas.php");
$m = new Temas($_SESSION["map_file"], $_GET["tema"],$_SESSION["locaplic"]);
switch (strtoupper($_GET["funcao"])) {
	case "GRAFICOTEMA":
	    $retorno = $m->graficotema($_GET["lista"],$_GET["tamanho"],$_GET["tipo"],$_GET["outlinecolor"],$_GET["offset"],true);
		$m->salva();
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>