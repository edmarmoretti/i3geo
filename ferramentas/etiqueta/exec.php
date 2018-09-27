<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include (dirname(__FILE__) . "/../../classesphp/classe_toponimia.php");
$m = new Toponimia($_SESSION["map_file"], $_GET["tema"]);
switch (strtoupper($_GET["funcao"]))
{
	case "ATIVAETIQUETAS":
	    $m->layer->setmetadata("cache","nao");
	    $m->layer->setmetadata("IDENTIFICA","");
		$m->layer->setmetadata("TIP",$_GET["tips"]);
		$m->layer->setmetadata("ITENS",$_GET["itens"]);
		$m->layer->setmetadata("ITENSDESC",$_GET["itensdesc"]);
		$m->layer->setmetadata("ITENSLINK",$_GET["itenslink"]);
		$m->layer->setmetadata("UTFDATA",$_GET["utfdata"]);
		$m->layer->setmetadata("itembuscarapida",$_GET["itembuscarapida"]);
		$m->salva();
		$retorno = true;
	break;
	case "REMOVEETIQUETAS":
	    $m->layer->setmetadata("cache","nao");
	    $retorno = $m->removeEtiquetas();
		$m->salva();
		$retorno = true;
	break;
	case "PEGADADOSETIQUETAS":
		$retorno = $m->pegaDadosEtiquetas();
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>