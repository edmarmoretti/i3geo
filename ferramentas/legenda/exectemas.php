<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
$m = new Temas($_SESSION["map_file"], $_GET["tema"]);
switch (strtoupper($_GET["funcao"])) {
    case "SALVAPARAMETROSAUTO":
        $map = ms_newMapObj($_SESSION["map_file"]);
        $layer = $map->getlayerbyname($_GET["tema"]);
        $layer->setmetadata("classesitem", $_GET["classesitem"]);
        $layer->setmetadata("classesnome", $_GET["classesnome"]);
        $layer->setmetadata("classescor", $_GET["classescor"]);
        $layer->setmetadata("classessimbolo", $_GET["classessimbolo"]);
        $layer->setmetadata("classestamanho", $_GET["classestamanho"]);
        $layer->setmetadata("palletefile", $_GET["palletefile"]);
        $layer->setmetadata("palletestep", $_GET["palletestep"]);
        $layer->setmetadata("cache", "nao");
        $layer->setmetadata("TILES", "nao");
        autoClasses($layer, $map, $_SESSION["locaplic"]);
        $layer->setmetadata("classesnome", "");
        $layer->setmetadata("palletefile", "");
        $map->save($_SESSION["map_file"]);
        $retorno = true;
        break;
    case "PARAMETROSAUTO":
        $map = ms_newMapObj($_SESSION["map_file"]);
        $layer = $map->getlayerbyname($_GET["tema"]);
        $retorno = array();
        $retorno["classesitem"] = $layer->getmetadata("classesitem");
        $retorno["classesnome"] = $layer->getmetadata("classesnome");
        $retorno["classescor"] = $layer->getmetadata("classescor");
        $retorno["classessimbolo"] = $layer->getmetadata("classessimbolo");
        $retorno["classestamanho"] = $layer->getmetadata("classestamanho");
        $retorno["palletefile"] = $layer->getmetadata("palletefile");
        $retorno["palletestep"] = $layer->getmetadata("palletestep");
        $sopen = $layer->open();
        if ($sopen != MS_FAILURE) {
            $items = $layer->getItems();
        } else {
            $items = array();
        }
        $retorno["colunas"] = implode(",", $items);
        break;
    case "APLICARCLUSTER":
        $retorno = $m->criaCluster($_GET["group"], $_GET["filter"], $_GET["maxdistance"], $_GET["region"], $_GET["buffer"]);
        $m->salva();
        break;
    case "REMOVERCLUSTER":
        $retorno = $m->removeCluster();
        $m->salva();
        break;
    case "REMOVELABELCLASSE":
        $retorno = $m->removeLabel($_GET["classe"]);
        $m->salva();
        break;
    case "ADICIONALABELCLASSE":
        $l = $m->mapa->getlayerbyname($_GET["tema"]);
        if (empty($_GET["item"])) {
            $retorno = false;
        } else {
            $classe = $l->getclass($_GET["classe"]);
            $retorno = $m->adicionaLabel($classe, $_GET["wrap"], $_GET["fonte"], $_GET["tamanho"], $_GET["angulo"], $_GET["fundo"], $_GET["sombra"], $_GET["cor"], $_GET["outlinecolor"], $_GET["shadowcolor"], $_GET["shadowsizex"], $_GET["shadowsizey"], $_GET["force"], $_GET["mindistance"], $_GET["minfeaturesize"], $_GET["offsetx"], $_GET["offsety"], $_GET["partials"], $_GET["position"], "[" . $_GET["item"] . "]");
            $m->salva();
        }
        break;
    case "ALTERAREPRESENTACAO":
        $retorno = $m->alteraRepresentacao();
        $m->salva();
        break;
    case "APLICAOFFSITE":
        $retorno = $m->mudaOffsite($_GET["offsite"]);
        $m->salva();
        break;
    case "APLICAPROCESSOS":
        $retorno = $m->aplicaProcessos($_GET["lista"]);
        $m->salva();
        break;
    case "TEMA2SLD":
        $sld = $m->sld();
        echo header('Content-Disposition: attachment; filename="' . $tema . '.sld"');
        echo header("Content-type: application/xml");
        echo $m->sld();
        exit();
        break;
}
ob_clean();
if (! $retorno) {
    header("HTTP/1.1 500 erro legenda nao disponivel");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}
exit();
?>