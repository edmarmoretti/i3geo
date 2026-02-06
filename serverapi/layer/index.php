<?php
define("I3GEOPATH", explode("serverapi",__FILE__)[0]);
include (I3GEOPATH."/serverapi/safe.php");
switch (strtoupper($_GET["funcao"])) {
    case "CRIALEGENDAJSON":
        include (I3GEOPATH."/classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
        $r = $m->criaLegendaJson($_GET["w"], $_GET["h"]);
        $retorno = $r;
        break;
    case "INVERTESTATUSCLASSE":
        include (I3GEOPATH."/classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->statusClasse($_GET["classe"]);
        $m->salva();
        break;
    case "ZOOMSEL":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $retorno = $m->zoomSel();
        $m->salva();
        break;
    case "LIMPASEL":
        include (I3GEOPATH."/classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"], $_GET["tema"]);
        $m->selecaoLimpa();
        $retorno = true;
        break;
    case "INVERTESTATUSLEGENDA":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->inverteStatusLegenda();
        $m->salva();
        $retorno = true;
        break;
    case "COPIA":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_GET["tema"]);
        $m->copiaTema();
        $m->salva();
        $retorno = true;
        break;
    case "ITENS":
        include (I3GEOPATH."/classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $retorno = $m->listaItens();
        break;
    case "VALORESITEM":
        include (I3GEOPATH."/classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $retorno = $m->listaUnicoRapida($_GET["item"]);
        break;
    case "ALTERLAYERNAME":
        include (I3GEOPATH."/classesphp/classe_temas.php");
        $valor = mb_convert_encoding($_GET["title"], "ISO-8859-1", mb_detect_encoding($_GET["title"]));
        $m = new Temas($_SESSION["map_file"], $_GET["idlayer"]);
        $retorno = $m->mudaNome($valor);
        $m->salva();
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);