<?php
for ($i = 0; $i < $numlayers; ++ $i) {
    $l = $mapa->getLayer($i);
    $l->set("status", MS_OFF);
}
$l = $mapa->getLayerbyname($_GET["layer"]);
//a classe deve ter uma cor
if($l->type == MS_LAYER_POLYGON){
    $numclasses = $l->numclasses;
    if ($numclasses > 0) {
        for ($i = 0; $i < $numclasses; ++ $i) {
            $classe = $l->getClass($i);
            $estilo = $classe->getstyle(0);
            $ncor = $estilo->color;
            $ncor->setrgb(255, 255, 255);
        }
    }
}
$l->set("status", MS_DEFAULT);
$l->setmetadata("WMS_INCLUDE_ITEMS", "all");
if ($l->getmetadata("UTFITEM") != "") {
    $temp = "{\"text\":\"" . $l->getmetadata("UTFITEM") . "\"}";
    $l->updateFromString("LAYER UTFITEM '" . $temp . "' END");
}
if ($l->getmetadata("UTFDATA") != "") {
    //"UTFDATA" "{\"text\":\"[FIPS_CNTRY]\"}"
    $temp = "{\"text\":\"[" . $l->getmetadata("UTFDATA") . "]\"}";
    $l->updateFromString("LAYER UTFDATA '" . $temp . "' END");
}
$mapa->selectOutputFormat("utfgrid");
ms_ioinstallstdouttobuffer();
$req = ms_newowsrequestobj();
$_GET["BBOX"] = str_replace(" ", ",", $_GET["BBOX"]);
foreach ($_GET as $k => $v) {
    $req->setParameter(strtoupper($k), $v);
}
$req->setParameter("REQUEST", "GetMap");
$req->setParameter("SERVICE", "WMS");
$req->setParameter("VERSION", "1.1.1");
$req->setParameter("LAYERS", $_GET["layer"]);
$req->setParameter("FORMAT", "application/json");
$mapa->owsdispatch($req);
//salva em disco para cache
if ($cache == true && $_GET["cache"] != "nao") {
    //caso EPSG:4326
    if($_GET["SRS"] == "EPSG:4326"){
        if ($_SESSION["cachedir"] == "") {
            $nome = dirname(dirname($_SESSION["map_file"])) . "/cache" . $_GET["tms"];
        } else {
            $nome = $_SESSION["cachedir"] . $_GET["tms"];
        }
    } else {
        if ($_SESSION["cachedir"] == "") {
            $nome = dirname(dirname($_SESSION["map_file"])) . "/cache" . "/googlemaps/".$_GET["layer"]."/$z/$x/$y";
        } else {
            $nome = $_SESSION["cachedir"] . "/googlemaps/".$_GET["layer"]."/$z/$x/$y";
        }
    }
    $nome = str_replace([".json",".png"], "", $nome);
    $nome = $nome . ".json";
    if (! file_exists($nome)) {
        if (! file_exists(dirname($nome))) {
            @mkdir(dirname($nome), 0744, true);
            chmod(dirname($nome), 0744);
        }
        ms_iostripstdoutbuffercontenttype();
        file_put_contents($nome,ms_iogetstdoutbufferstring());
        chmod($nome, 0744);
    }
}
ob_clean();
ms_iostripstdoutbuffercontentheaders();
header("Content-type: application/json; subtype=json");
ms_iogetStdoutBufferBytes();
ms_ioresethandlers();
exit();
?>
