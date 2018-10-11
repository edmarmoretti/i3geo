<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "CRIAMARKERCLUSTER":
        $nameLayer = "markercluster".nomeRandomico();
        $map = ms_newMapObj($_SESSION["map_file"]);
        $layer = $map->getlayerbyname($_GET["tema"]);
        $novolayer = ms_newLayerObj($map, $layer);
        $novolayer->setmetadata("tema",$_GET["titulo"]);
        $parametros = '{"plugin":"markercluster","parametros":{"tipoEstilos":"default","color":"'.$_GET["color"].'","strokecolor":"'.$_GET["strokecolor"].'","textcolor":"'.$_GET["textcolor"].'","tipoEstilos": "default","opacity":"'.$_GET["opacidade"].'","gridSize":"'.$_GET["gridSize"].'"}}';
        $novolayer->setmetadata("PLUGINI3GEO",$parametros);
        $novolayer->set("name",$nameLayer);
        $novolayer->setmetadata("tema",$_GET["titulo"]);
        $novolayer->updateFromString('LAYER COMPOSITE OPACITY '.$_GET["opacidade"].'END END');
        $novolayer->set("group","");
        $map->save($_SESSION["map_file"]);
        $retorno = $nameLayer;
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);