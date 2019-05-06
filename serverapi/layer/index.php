<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "CRIALEGENDAJSON":
        include ("../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "INVERTESTATUSCLASSE":
        include ("../../classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->statusClasse($_GET["classe"]);
        $m->salva();
        break;
    case "ZOOMSEL":
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->zoomSel();
        $m->salva();
        break;
    case "LIMPASEL":
        include ("../../classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"], $_GET["tema"]);
        $m->selecaoLimpa();
        $retorno = true;
        break;
    case "INVERTESTATUSLEGENDA":
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->inverteStatusLegenda();
        $m->salva();
        $retorno = true;
        break;
    case "COPIA":
        include ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->copiaTema();
        $m->salva();
        $retorno = true;
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);