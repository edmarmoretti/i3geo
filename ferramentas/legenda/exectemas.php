<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
$m = new Temas($_SESSION["map_file"], $_POST["tema"]);
switch (strtoupper($_GET["funcao"])) {
    case "SALVAPARAMETROSAUTO":
        $map = ms_newMapObj($_SESSION["map_file"]);
        $layer = $map->getlayerbyname($_POST["tema"]);
        $layer->setmetadata("classesitem", $_POST["classesitem"]);
        $layer->setmetadata("classesnome", $_POST["classesnome"]);
        $layer->setmetadata("classescor", $_POST["classescor"]);
        $layer->setmetadata("classessimbolo", $_POST["classessimbolo"]);
        $layer->setmetadata("classestamanho", $_POST["classestamanho"]);
        $layer->setmetadata("palletefile", $_POST["palletefile"]);
        $layer->setmetadata("palletestep", $_POST["palletestep"]);
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
        $layer = $map->getlayerbyname($_POST["tema"]);
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
        $retorno = $m->criaCluster($_POST["group"], $_POST["filter"], $_POST["maxdistance"], $_POST["region"], $_POST["buffer"]);
        $m->salva();
        break;
    case "REMOVERCLUSTER":
        $retorno = $m->removeCluster();
        $m->salva();
        break;
    case "REMOVELABELCLASSE":
        $retorno = $m->removeLabel($_POST["classe"]);
        $m->salva();
        break;
    case "ADICIONALABELCLASSE":
        $l = $m->mapa->getlayerbyname($_POST["tema"]);
        if (empty($_POST["item"])) {
            $retorno = false;
        } else {
            $classe = $l->getclass($_POST["classe"]);
            $retorno = $m->adicionaLabel($classe, $_POST["wrap"], $_POST["fonte"], $_POST["tamanho"], $_POST["angulo"], $_POST["fundo"], $_POST["sombra"], $_POST["cor"], $_POST["outlinecolor"], $_POST["shadowcolor"], $_POST["shadowsizex"], $_POST["shadowsizey"], $_POST["force"], $_POST["mindistance"], $_POST["minfeaturesize"], $_POST["offsetx"], $_POST["offsety"], $_POST["partials"], $_POST["position"], "[" . $_POST["item"] . "]");
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
        $retorno = $m->aplicaProcessos($_POST["lista"]);
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