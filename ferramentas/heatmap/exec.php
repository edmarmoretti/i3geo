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
Valor: CRIAHEATMAP

Adiciona ao mapa uma nova camada para calculo do mapa de calor
*/
	case "CRIAHEATMAP":
		$nameLayer = "heatmap".nomeRandomico();
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$novolayer = ms_newLayerObj($map, $layer);
		$novolayer->setmetadata("tema",$_GET["titulo"]);
		$parametros = '{"plugin":"heatmap","parametros":{"max":10,"tipoGradiente":"default","valorPonto":"'.$_GET["valorPonto"].'","coluna":"'.$_GET["coluna"].'","radius":"'.$_GET["raio"].'"}}';
		$novolayer->setmetadata("PLUGINI3GEO",$parametros);
		$novolayer->set("name",$nameLayer);
		$novolayer->set("group","");

		if(!empty($_GET["opacidade"])){
			$novolayer->set("opacity",$_GET["opacidade"]);
		}
		$map->save($map_file);
		$retorno = $nameLayer;
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>