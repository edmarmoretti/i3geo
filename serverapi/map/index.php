<?php
include ("../safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "EXCLUIRTEMAS":
        include_once ("../../classesphp/classe_mapa.php");
        $m = new Mapa($_SESSION["map_file"]);
        $temas = $m->excluiTemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "REORDENATEMAS":
        include_once ("../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"]);
        $m->reordenatemas($_GET["temas"]);
        $m->salva();
        $retorno = true;
        break;
    case "CRIALEGENDAJSON":
        include_once ("../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], "");
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "MUDATAMANHO":
        $map = ms_newMapObj($_SESSION["map_file"]);
        $map->setsize($_GET["largura"],$_GET["altura"]);
        $salvo = $map->save($_SESSION["map_file"]);
        $m = new Mapa($_SESSION["map_file"]);
        $m->mudaQS($_GET["largura"],$_GET["altura"]);
        $retorno = true;
        break;
    case "ZOOMPONTO":
        include ("../../classesphp/classe_navegacao.php");
        include ("../../classesphp/classe_temas.php");
        $m = new Navegacao($_SESSION["map_file"]);
        $m->zoomPonto($_GET["xy"]);
        $m->salva();
        $m = new Temas($_SESSION["map_file"], "");
        if (! isset($_GET["marca"])) {
            $_GET["marca"] = "ponto";
        }
        $m->insereFeature($marca, "POINT", $_GET["xy"], $_GET["texto"], $_GET["position"], $_GET["partials"], $_GET["offsetx"], $_GET["offsety"], $_GET["minfeaturesize"], $_GET["mindistance"], $_GET["force"], $_GET["shadowcolor"], $_GET["shadowsizex"], $_GET["shadowsizey"], $_GET["outlinecolor"], $_GET["cor"], $_GET["sombray"], $_GET["sombrax"], $_GET["sombra"], $_GET["fundo"], $_GET["angulo"], $_GET["tamanho"], $_GET["fonte"]);
        $m->salva();
        //redesenhaMapa();
        $retorno = true;
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);