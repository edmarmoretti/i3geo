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
Valor: INSERESHP

Insere um ponto em um shape file existente.

<SHP->insereSHP>
*/
	case "INSERESHP":
		include_once(dirname(__FILE__)."/../../classesphp/classe_shp.php");
		copiaSeguranca($map_file);
		$m = new SHP($map_file,$tema);
		if (!isset($_GET["projecao"])){$_GET["projecao"] = "";}
		$m->insereSHP($_GET["xy"],$_GET["projecao"],$_GET["item"],$_GET["valor"]);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>