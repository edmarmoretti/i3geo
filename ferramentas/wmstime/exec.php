<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"])) {
    case "ADICIONA":
        include ("../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $layer = $m->adicionatemawms($_GET["tema"], $_GET["servico"], $_GET["nome"], $_GET["proj"], $_GET["formato"], $_SESSION["locaplic"], $_GET["tipo"], $_GET["versao"], $_GET["nomecamada"], $_SESSION["dir_tmp"], $_SESSION["imgdir"], $_SESSION["imgurl"], $_GET["tiporep"], $_GET["suportasld"], $_GET["formatosinfo"], $_GET["time"], $_GET["tile"]);
        $layer->setmetadata("wmstime","{'times':'".$_GET["times"]."','time':'".$_GET["time"]."'}");
        $layer->setmetadata("legendawms","");
        $m->salva();
        ob_clean();
        header("Content-type: application/json");
        echo json_encode(array(
            "errorMsg" => ""
        ));
        exit();
        break;
    case "ALTERATIME":
        include ("../../classesphp/classe_mapa.php");
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["layer"]);
        $layer->setmetadata("wmstime","{'times':'".$_GET["times"]."','time':'".$_GET["time"]."'}");
        $layer->setmetadata("wms_time",$_GET["time"]);
        $mapa->save($_SESSION["map_file"]);
        ob_clean();
        header("Content-type: application/json");
        echo json_encode(array(
            "errorMsg" => ""
        ));
        exit();
        break;
}
