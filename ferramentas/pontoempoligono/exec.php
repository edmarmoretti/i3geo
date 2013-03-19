<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: PONTOEMPOLIGONO

Cruza um tema pontual com temas poligonais ou raster.

Salva o mapa acrescentando um novo layer com o resultado.

<Analise->pontoEmPoligono>
*/
	case "PONTOEMPOLIGONO":
		include_once(dirname(__FILE__)."/../../classesphp/classe_analise.php");
		copiaSeguranca($map_file);
		$m = new Analise($map_file,$temaPt,$locaplic,$ext);
		$retorno = $m->pontoEmPoligono($temaPt,$temasPo,$locaplic);
		$m->salva();
		$_SESSION["contadorsalva"]++;
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