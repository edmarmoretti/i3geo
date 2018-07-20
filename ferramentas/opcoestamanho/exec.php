<?php
include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
switch (strtoupper($_GET["funcao"]))
{
	case "MUDATAMANHO":
		$map = ms_newMapObj($_SESSION["map_file"]);
		$map->setsize($_GET["largura"],$_GET["altura"]);
		$salvo = $map->save($_SESSION["map_file"]);
		$m = new Mapa($_SESSION["map_file"]);
		$m->mudaQS($_GET["largura"],$_GET["altura"]);
		ob_clean();
		header("Content-type: application/json");
		echo json_encode(array(
		    "errorMsg" => ""
		));
		exit;
	break;
}
?>