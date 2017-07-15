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
Valor: CRIAMARKERCLUSTER

Adiciona ao mapa uma nova camada para calculo do mapa de cluster
*/
	case "CRIAMARKERCLUSTER":
		$nameLayer = "markercluster".nomeRandomico();
		$map = ms_newMapObj($map_file);
		$layer = $map->getlayerbyname($tema);
		$novolayer = ms_newLayerObj($map, $layer);
		$novolayer->setmetadata("tema",$titulo);
		$parametros = '{"plugin":"markercluster","parametros":{"tipoEstilos":"default","color":"'.$_GET["color"].'","strokecolor":"'.$_GET["strokecolor"].'","textcolor":"'.$_GET["textcolor"].'","tipoEstilos": "default","opacity":"'.$_GET["opacidade"].'","gridSize":"'.$_GET["gridSize"].'"}}';
		$novolayer->setmetadata("PLUGINI3GEO",$parametros);
		$novolayer->set("name",$nameLayer);
		$novolayer->setmetadata("tema",$_GET["titulo"]);
		$novolayer->set("opacity",$_GET["opacidade"]);
		$novolayer->set("group","");
		$map->save($map_file);
		$retorno = $nameLayer;
	break;
}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>