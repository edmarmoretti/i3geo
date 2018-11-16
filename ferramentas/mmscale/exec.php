<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "ATUAL":
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["tema"]);
        $retorno = array(
            "maxscaledenom"	=> $layer->maxscaledenom,
            "minscaledenom"	=> $layer->minscaledenom
        );
        break;
    case "MINMAX":
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["tema"]);
        if(empty($_GET["maxscaledenom"])){
            $_GET["maxscaledenom"] = -1;
        }
        if(empty($_GET["minscaledenom"])){
            $_GET["minscaledenom"] = -1;
        }
        $layer->set("maxscaledenom",$_GET["maxscaledenom"]);
        $layer->set("minscaledenom",$_GET["minscaledenom"]);
        $layer->setmetadata("cache","");
        $mapa->save($_SESSION["map_file"]);
        $retorno = true;
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
