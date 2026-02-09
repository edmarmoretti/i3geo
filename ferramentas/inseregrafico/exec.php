<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"])) {
    case "INSERESHPGRAFICO":
        include (dirname(__FILE__) . "/../../classesphp/classe_shp.php");
        $m = new SHP($_SESSION["map_file"], $_GET["tema"], $_SESSION["locaplic"]);
        $retorno = $m->insereSHPgrafico($_GET["x"], $_GET["y"], $_GET["itens"], $_GET["width"], $_GET["inclinacao"], $_GET["shadow_height"], $_GET["ext"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);