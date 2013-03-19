<?php
include_once(dirname(__FILE__)."/../inicia.php");
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
		if (!isset($projecao)){$projecao = "";}
		$m->insereSHP($xy,$projecao,$item,$valor);
		$_SESSION["contadorsalva"]++;
		redesenhaMapa();
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