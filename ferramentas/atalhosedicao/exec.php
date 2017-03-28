<?php
//TODO verificar login
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
	case "METADATA":
		$mapa = ms_newMapObj($map_file);
		$l = $mapa->getlayerbyname($tema);
		if($l != ""){
			$l->setmetadata($_GET["meta"],$_GET["valor"]);
			$mapa->save($map_file);
		}
		$retorno = "ok";
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>