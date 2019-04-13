<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "CRIALEGENDAJSON":
        include_once ("../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "INVERTESTATUSCLASSE":
        include_once ("../../classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->statusClasse($_GET["classe"]);
        $m->salva();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);