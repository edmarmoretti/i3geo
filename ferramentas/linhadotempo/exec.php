<?php
$_GET = $_POST;

include_once(dirname(__FILE__)."/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$_SESSION["i3geoBlFerramentas"],false);
$retorno = false;
switch (strtoupper($_POST["funcao"])){
	case "PARAMETROS":
		$map = ms_newMapObj($_SESSION["map_file"]);
		$layer = $map->getlayerbyname($_POST["tema"]);
		$retorno = array();
		$retorno["ltempoformatodata"] = $layer->getmetadata("ltempoformatodata");
		$retorno["ltempoiteminicio"] = $layer->getmetadata("ltempoiteminicio");
		$retorno["ltempoitemfim"] = $layer->getmetadata("ltempoitemfim");
		$retorno["ltempoitemtitulo"] = $layer->getmetadata("ltempoitemtitulo");
		$retorno["ltempoitemdescricao"] = $layer->getmetadata("ltempoitemdescricao");
		$retorno["ltempoconvencode"] = $layer->getmetadata("ltempoconvencode");
		$retorno["ltempoitemtip"] = $layer->getmetadata("ltempoitemtip");
		$retorno["ltempoitemimagem"] = $layer->getmetadata("ltempoitemimagem");
		$retorno["ltempoitemicone"] = $layer->getmetadata("ltempoitemicone");
		$retorno["ltempoitemlink"] = $layer->getmetadata("ltempoitemlink");
	break;
	case "SALVA":
		$map = ms_newMapObj($_SESSION["map_file"]);
		$layer = $map->getlayerbyname($_POST["tema"]);
		$layer->setmetadata("ltempoformatodata",$_POST["ltempoformatodata"]);
		$layer->setmetadata("ltempoiteminicio",$_POST["ltempoiteminicio"]);
		$layer->setmetadata("ltempoitemfim",$_POST["ltempoitemfim"]);
		$layer->setmetadata("ltempoitemtitulo",$_POST["ltempoitemtitulo"]);
		$layer->setmetadata("ltempoitemdescricao",$_POST["ltempoitemdescricao"]);
		$layer->setmetadata("ltempoconvencode",$_POST["ltempoconvencode"]);
		$layer->setmetadata("ltempoitemtip",$_POST["ltempoitemtip"]);
		$layer->setmetadata("ltempoitemimagem",$_POST["ltempoitemimagem"]);
		$layer->setmetadata("ltempoitemicone",$_POST["ltempoitemicone"]);
		$layer->setmetadata("ltempoitemlink",$_POST["ltempoitemlink"]);
		$map->save($_SESSION["map_file"]);
		$retorno = true;
		break;
	case "REMOVE":
	    $map = ms_newMapObj($_SESSION["map_file"]);
	    $layer = $map->getlayerbyname($_POST["tema"]);
	    $layer->setmetadata("ltempoformatodata","");
	    $layer->setmetadata("ltempoiteminicio","");
	    $layer->setmetadata("ltempoitemfim","");
	    $layer->setmetadata("ltempoitemtitulo","");
	    $layer->setmetadata("ltempoitemdescricao","");
	    $layer->setmetadata("ltempoconvencode","");
	    $layer->setmetadata("ltempoitemtip","");
	    $layer->setmetadata("ltempoitemimagem","");
	    $layer->setmetadata("ltempoitemicone","");
	    $layer->setmetadata("ltempoitemlink","");
	    $map->save($_SESSION["map_file"]);
	    $retorno = true;
	    break;
	case "DADOS":
	    include ("../../classesphp/graficos.php");
	    $retorno = dadosLinhaDoTempo($_SESSION["map_file"], $_POST["tema"], $_POST["ext"]);
	    break;
}
ob_clean();
if ($retorno == false) {
    header("HTTP/1.1 500 erro ");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}