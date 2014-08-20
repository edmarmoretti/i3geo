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
	case "CRIAHEATMAP":
		$nameLayer = "heatmap".nomeRandomico();
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$novolayer = ms_newLayerObj($map, $layer);
		$novolayer->setmetadata("tema",$titulo);
		$parametros = '{"plugin":"heatmap","parametros":{"tipoGradiente":"default","valorPonto":"'.$valorPonto.'","coluna":"'.$coluna.'","radius":"'.$raio.'"}}';
		$novolayer->setmetadata("PLUGINI3GEO",$parametros);
		$novolayer->set("name",$nameLayer);
		if(!empty($opacidade)){
			$novolayer->set("opacity",$opacidade);
		}
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