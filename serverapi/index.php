<?php
include ("safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "EXCLUIRTEMAS":
        include_once ("../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $temas = $m->excluiTemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "REORDENATEMAS":
        include_once ("../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"]);
        $m->reordenatemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "CRIALEGENDAJSON":
        include_once ("../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "INVERTESTATUSCLASSE":
        include_once ("../classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->statusClasse($_GET["classe"]);
        $m->salva();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);