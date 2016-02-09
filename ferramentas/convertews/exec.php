<?php
include_once(dirname(__FILE__)."/../inicia.php");
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
		if(!isset($h)){$h = "";}
		$wms = $m->converteWS($locmapserv,$h);
		$wmc = $m->converteWMC($locmapserv,$h);
		$retorno = array("wms"=>$wms,"wmc"=>$wmc);
	break;
}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>