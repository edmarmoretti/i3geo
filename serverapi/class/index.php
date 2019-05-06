<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "ALTERACOR":
        include ("../../classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"], "");
        if(!isset($_GET["w"])){
            $_GET["w"] = 35;
            $_GET["h"] = 25;
        }
        $retorno = $m->alteracor($_GET["idclasse"], $_GET["cor"],$_GET["w"],$_GET["h"]);
        $m->salva();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);