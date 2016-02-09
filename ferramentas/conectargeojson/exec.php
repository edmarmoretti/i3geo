<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: ADICIONATEMAGEOJSON

Adiciona um tema baseado em uma URL GeoJson.

<Mapa->adicionaTemaGeoJson>
*/
	case "ADICIONATEMAGEOJSON":
		include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
		copiaSeguranca($map_file);
		$m = new Mapa($map_file);
		$retorno = $m->adicionaTemaGeoJson($servico,$dir_tmp,$locaplic);
		if ($retorno != "erro")
		{$m->salva();$_SESSION["contadorsalva"]++;redesenhaMapa();}
		else
		{
			$retorno = "erro.";
		}
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