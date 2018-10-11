<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "CRIAHEATMAP":
        $nameLayer = "heatmap".nomeRandomico();
        $map = ms_newMapObj($_SESSION["map_file"]);
        $layer = $map->getlayerbyname($_GET["tema"]);
        $novolayer = ms_newLayerObj($map, $layer);
        $novolayer->setmetadata("tema",$_GET["titulo"]);
        $parametros = '{"plugin":"heatmap","parametros":{"max":10,"tipoGradiente":"default","valorPonto":"'.$_GET["valorPonto"].'","coluna":"'.$_GET["coluna"].'","radius":"'.$_GET["raio"].'"}}';

        $novolayer->setmetadata("PLUGINI3GEO",$parametros);
        $novolayer->set("name",$nameLayer);
        $novolayer->set("group","");
        $novolayer->set("minscaledenom",0);
        $novolayer->set("maxscaledenom",0);
        $novolayer->updateFromString('LAYER COMPOSITE OPACITY '.$_GET["opacidade"].'END END');
        $map->save($_SESSION["map_file"]);
        $retorno = $nameLayer;
        include("funcoes.php");
        heatmapGradiente($_SESSION["map_file"],$nameLayer,"default");
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);