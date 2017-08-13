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
		$wms = "/ferramentas/convertews/ogc.php?sid=".$g_sid;
		$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
		$protocolo = $protocolo[0];
		$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
		$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
		$urli3geo = str_replace("/ferramentas/convertews/exec.php","",$protocolo.$_SERVER["PHP_SELF"]);
		$wmc = $m->converteWMC($locmapserv,$urli3geo);
		$retorno = array("wms"=>$wms,"wmc"=>$wmc);
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>