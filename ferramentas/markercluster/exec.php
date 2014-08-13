<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: CRIAHEATMAP

Adiciona ao mapa uma nova camada para calculo do mapa de calor
*/
	case "CRIAMARKERCLUSTER":
		$nameLayer = "markercluster".nomeRandomico();
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$novolayer = ms_newLayerObj($map, $layer);
		$novolayer->setmetadata("tema",$titulo);
		if($coluna == ""){
			$coluna = $valorPonto;
		}
		$parametros = '{"plugin":"markercluster","parametros":{"opacity":"'.$opacidade.'","gridSize":"'.$gridSize.'"}}';
		$novolayer->setmetadata("PLUGINI3GEO",$parametros);
		$novolayer->set("name",$nameLayer);
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