<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
include_once(dirname(__FILE__)."/../../classesphp/classe_toponimia.php");
$m = new Toponimia($_SESSION["map_file"], $_GET["tema"]);
switch (strtoupper($_GET["funcao"])) {
	case "CRIATOPONIMIA":
		if(!isset($_GET["tipo"])){
		    $_GET["tipo"] = "";
		}
		if(!isset($_GET["novotema"])){
		    $_GET["novotema"] = "sim";
		}
		$retorno = $m->criaToponimia($_GET["item"],$_GET["position"],$_GET["partials"],$_GET["offsetx"],$_GET["offsety"],$_GET["minfeaturesize"],$_GET["mindistance"],$_GET["force"],$_GET["shadowcolor"],$_GET["shadowsizex"],$_GET["shadowsizey"],$_GET["outlinecolor"],$_GET["cor"],$_GET["sombray"],$_GET["sombrax"],$_GET["sombra"],$_GET["fundo"],$_GET["angulo"],$_GET["tamanho"],$_GET["font"],$_GET["tipo"],$_GET["wrap"],$_GET["novotema"]);
		if(empty($_GET["maxscale"])){
			$_GET["maxscale"] = -1;
		}
		if(empty($_GET["minscale"])){
			$_GET["minscale"] = -1;
		}
		$m->layer->set("labelmaxscaledenom",$_GET["maxscale"]);
		$m->layer->set("labelminscaledenom",$_GET["minscale"]);
		$p = $m->layer->getProcessing();
		if(!in_array("LABEL_NO_CLIP=True",$p)){
		    $m->layer->setprocessing("LABEL_NO_CLIP=True");
		}
		if(!in_array("POLYLINE_NO_CLIP=True",$p)){
		    $m->layer->setprocessing("POLYLINE_NO_CLIP=True");
		}
		if ($_GET["tipo"] != "teste"){
			$m->salva();
		}
	break;
	case "REMOVETOPONIMIA":
		$retorno = $m->removeToponimia();
		$m->salva();
		break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
?>
