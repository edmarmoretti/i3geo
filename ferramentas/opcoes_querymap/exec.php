<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: PEGAQUERYMAPCOR

Pega a cor de sele&ccedil;&atilde;o atual.

<Mapa->corQM>
*/
	case "PEGAQUERYMAPCOR":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		$m = new Mapa($map_file);
		$retorno = $m->corQM("");
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