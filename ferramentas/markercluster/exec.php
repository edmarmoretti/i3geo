<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: CRIAMARKERCLUSTER

Adiciona ao mapa uma nova camada para calculo do mapa de calor
*/
	case "CRIAMARKERCLUSTER":
		$nameLayer = "markercluster".nomeRandomico();
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$novolayer = ms_newLayerObj($map, $layer);
		$novolayer->setmetadata("tema",$titulo);
		$parametros = '{"plugin":"markercluster","parametros":{"tipoEstilos": "default","opacity":"'.$opacidade.'","gridSize":"'.$gridSize.'"}}';
		$novolayer->setmetadata("PLUGINI3GEO",$parametros);
		$novolayer->set("name",$nameLayer);
		$novolayer->set("group","");
		$map->save($map_file);
		$retorno = $nameLayer;
	break;
}
if (!connection_aborted()){
	cpjson($retorno);
}
else{
	exit();
}
?>