<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"])) {
	//lista os layers que sao mascarados por tema
	case "LISTATEMAS":
	    $map = ms_newMapObj($_SESSION["map_file"]);
		$c = $map->numlayers;
		$retorno = array();
		for ($i=0;$i < $c;++$i)	{
			$l = $map->getlayer($i);
			if($l->mask == $_GET["tema"]){
			    $retorno[] = $_GET["tema"];
			}
		}
	break;
	case "APLICAR":
		$map = ms_newMapObj($_SESSION["map_file"]);
		$c = $map->numlayers;
		$mascarar = explode(",",$_GET["mascarar"]);
		for ($i=0;$i < $c;++$i)	{
			$l = $map->getlayer($i);
			if($l->mask == $_GET["tema"]){
				$l->mask = "";
			}
			if(in_array($l->name,$mascarar)){
			    $l->mask = $_GET["tema"];
				$l->setmetadata("cache","nao");
			}
		}
		$map->save($_SESSION["map_file"]);
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
