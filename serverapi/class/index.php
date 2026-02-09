<?php
define("I3GEOPATH", explode("serverapi",__FILE__)[0]);
include (I3GEOPATH."/serverapi/safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "ALTERACOR":
        include (I3GEOPATH."/classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"], "");
        if(!isset($_GET["w"])){
            $_GET["w"] = 35;
            $_GET["h"] = 25;
        }
        $retorno = $m->alteracor($_GET["idclasse"], $_GET["cor"],$_GET["w"],$_GET["h"]);
        $m->salva();
        break;
    case "GETCOLOURRAMP":
        include (I3GEOPATH."/classesphp/class.palette.php");
        $m = new palette();
        $retorno = $m->geraCoresColourRamp($_SESSION["locaplic"], $_GET["id"], $_GET["start"], $_GET["end"], $_GET["numcolors"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);