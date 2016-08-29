<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: CONVERTEWMSWMC

Converte o mapa atual em um wms e wmc.

<Mapa->converteWMC>
*/
	case "CONVERTEWMSWMC":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		$m = new Mapa($map_file);
		if(!isset($_GET["h"])){$_GET["h"] = "";}
		$wms = $m->converteWS($locmapserv,$_GET["h"]);
		$wmc = $m->converteWMC($locmapserv,$_GET["h"]);
		$retorno = array("wms"=>$wms,"wmc"=>$wmc);
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>