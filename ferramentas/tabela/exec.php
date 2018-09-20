<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
switch (strtoupper($_GET["funcao"])) {
    case "LISTAREGISTROS":
        include_once ("../../classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], "", $_GET["ext"]);
        $legenda = "";
        if ($_GET["dadosDaClasse"] == "sim") {
            include_once ("../../classesphp/classe_legenda.php");
            $mc = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_GET["tema"]);
            $linhas = $mc->tabelaLegenda();
            foreach ($linhas as $linha) {
                if ($linha["tema"] == $_GET["tema"]) {
                    $legenda[$linha["idclasse"]] = $linha["imagem"];
                }
            }
        }
        $retorno = $m->listaRegistros("", $_GET["tipo"], "", $_GET["inicio"], $_GET["fim"], $_GET["tipolista"], $_GET["dadosDaClasse"]);
        ob_clean();
        header("Content-type: application/json");
        echo json_encode(array(
            "legenda"=>$legenda,
            "totalSelecionados"=>$retorno[0]["totalSelecionados"],
            "itens"=>$retorno[0]["itens"],
            "alias"=>$retorno[0]["alias"],
            "totalGeral"=>$retorno[1]["totalGeral"],
            "registros"=>$retorno[1]["registros"],
            "errorMsg" => ""
        ));
        exit;
        break;
    case "INCLUISEL":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_selecao.php");
        $m = new Selecao($_SESSION["map_file"], $_GET["tema"]);
        $m->incluiSel($_GET["ids"]);
        include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
        //retorna os dados para poder atualizar a arvore de camadas
        $m = New Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        ob_clean();
        header("Content-type: application/json");
        echo json_encode($retorno);
        break;
    case "SELECAOCRIATEMA":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_selecao.php");
        $selecao = new Selecao($_SESSION["map_file"], $_GET["tema"]);
        $selecao->selecao2tema($_SESSION["locaplic"], $_SESSION["dir_tmp"]);
        $selecao->salva();
        ob_clean();
        header("Content-type: application/json");
        echo json_encode(true);
        break;
    case "ESTATISTICA":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_GET["tema"], $_SESSION["locaplic"], $_GET["ext"]);
        $retorno = $m->estatDescritivas($_GET["item"], $_GET["exclui"]);
        ob_clean();
        header("Content-type: application/json");
        echo json_encode($retorno);
        break;
}