<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
switch (strtoupper($_GET["funcao"])) {
    case "EDITALEGENDA":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_POST["tema"]);
        $retorno = $m->tabelaLegenda();
        ob_clean();
        if (! $retorno) {
            header ( "HTTP/1.1 500 erro legenda nao disponivel" );
        } else {
            header("Content-type: application/json");
            echo json_encode($retorno);
        }
        exit();
        break;
        /*
         * Valor: CONTAGEMCLASSE
         *
         * Acrescenta a contagem de elementos em cada classe.
         *
         * <Legenda->tabelaLegenda>
         */
    case "CONTAGEMCLASSE":
        // apresenta erro com palavras acentuadas
        include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_POST["tema"]);
        $retorno = $m->tabelaLegenda("sim");
        $m->salva();
        ob_clean();
        if (! $retorno) {
            header ( "HTTP/1.1 500 erro legenda nao disponivel" );
        } else {
            header("Content-type: application/json");
            echo json_encode($retorno);
        }
        exit();
        break;
    case "ADICIONAOPACIDADE":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_alteraclasse.php");
        $m = new Alteraclasse($_SESSION["map_file"], $_POST["tema"], "", $_POST["ext"]);
        $retorno = $m->adicionaopacidade();
        $m->salva();
        ob_clean();
        if (! $retorno) {
            header ( "HTTP/1.1 500 erro legenda nao disponivel" );
        } else {
            header("Content-type: application/json");
            echo json_encode($retorno);
        }
        exit();
        break;
    case "APLICALEGENDAIMG":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
        $m = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_POST["tema"]);
        $retorno = $m->aplicaLegendaImg($_GET["imagem"]);
        $m->salva();
        ob_clean();
        if (! $retorno) {
            header ( "HTTP/1.1 500 erro legenda nao disponivel" );
        } else {
            header("Content-type: application/json");
            echo json_encode($retorno);
        }
        exit();
        break;
    case "APLICAOFFSITE":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($_SESSION["map_file"], $_POST["tema"]);
        $retorno = $m->mudaOffsite($_GET["offsite"]);
        $m->salva();
        ob_clean();
        if (! $retorno) {
            header ( "HTTP/1.1 500 erro legenda nao disponivel" );
        } else {
            header("Content-type: application/json");
            echo json_encode($retorno);
        }
        exit();
        break;





    case "PARAMETROSAUTO":
        $map = ms_newMapObj($map_file);
        $layer = $map->getlayerbyname($tema);
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
    case "SALVAPARAMETROSAUTO":
        $map = ms_newMapObj($map_file);
        $layer = $map->getlayerbyname($tema);
        $layer->setmetadata("classesitem", $_GET["classesitem"]);
        $layer->setmetadata("classesnome", $_GET["classesnome"]);
        $layer->setmetadata("classescor", $_GET["classescor"]);
        $layer->setmetadata("classessimbolo", $_GET["classessimbolo"]);
        $layer->setmetadata("classestamanho", $_GET["classestamanho"]);
        $layer->setmetadata("palletefile", $_GET["palletefile"]);
        $layer->setmetadata("palletestep", $_GET["palletestep"]);
        $layer->setmetadata("cache", "nao");
        $layer->setmetadata("TILES", "nao");

        autoClasses($layer, $map, $locaplic);
        $layer->setmetadata("classesnome", "");
        $layer->setmetadata("palletefile", "");
        $map->save($map_file);
        $retorno = "ok";
        break;
    /*
     * Valor: TEMA2SLD
     *
     * Mostra na tela o SLD de um tema
     *
     * <Temas->sld>
     */
    case "TEMA2SLD":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $sld = $m->sld();
        echo header('Content-Disposition: attachment; filename="' . $tema . '.sld"');
        echo header("Content-type: application/xml");
        echo $m->sld();
        exit();
        break;
    /*
     * function: ADICIONALABELCLASSE
     *
     * Adiciona LABEL em uma classe de um layer
     *
     * <Temas->adicionaLabel>
     */
    case "ADICIONALABELCLASSE":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $l = $m->mapa->getlayerbyname($tema);
        if (empty($_GET["item"])) {
            $retorno = "erro";
        } else {
            // $l->set("labelitem",$item);
            $novac = $l->getclass($_GET["classe"]);
            $m->adicionaLabel($novac, $_GET["wrap"], $_GET["fonte"], $_GET["tamanho"], $_GET["angulo"], $_GET["fundo"], $_GET["sombra"], $_GET["cor"], $_GET["outlinecolor"], $_GET["shadowcolor"], $_GET["shadowsizex"], $_GET["shadowsizey"], $_GET["force"], $_GET["mindistance"], $_GET["minfeaturesize"], $_GET["offsetx"], $_GET["offsety"], $_GET["partials"], $_GET["position"], "[" . $_GET["item"] . "]");
            $m->salva();
            $retorno = "ok";
        }
        break;
    /*
     * function: REMOVELABELCLASSE
     *
     * Remove LABEL em uma classe de um layer
     */
    case "REMOVELABELCLASSE":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $m->removeLabel($_GET["classe"]);
        $m->salva();
        $retorno = "ok";
        break;


    /*
     * Valor: APLICATODASCLASSES
     *
     * Aplica um parametro a todas as classes
     */
    case "APLICATODASCLASSES":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_legenda.php");
        $m = new Legenda($map_file, $locaplic, $tema);
        $r = $m->aplicaTodasClasses($_GET["parametro"], $_GET["valor"]);
        $m->salva();
        if (! $r) {
            $r = "erro.Erro legenda nao disponivel";
        }
        $retorno = $r;
        break;
    case "APLICARCLUSTER":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $l = $m->mapa->getlayerbyname($tema);
        if ($filter != "") {
            // $filter = base64decode($filter);
        }
        $m->criaCluster($_GET["group"], $_GET["filter"], $_GET["maxdistance"], $_GET["region"], $_GET["buffer"]);
        $m->salva();
        $retorno = "ok";
        break;
    case "REMOVERCLUSTER":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $l = $m->mapa->getlayerbyname($tema);
        $m->removeCluster();
        $m->salva();
        $retorno = "ok";
        break;


}
?>