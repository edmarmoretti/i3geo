<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
switch (strtoupper($_GET["funcao"])) {
    case "LISTAREGISTROS":
        include_once ("../../classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_POST["tema"], "", $_POST["ext"]);
        $legenda = "";
        if ($_POST["dadosDaClasse"] == "sim") {
            include_once ("../../classesphp/classe_legenda.php");
            $mc = new Legenda($_SESSION["map_file"], $_SESSION["locaplic"], $_POST["tema"]);
            $linhas = $mc->tabelaLegenda();
            foreach ($linhas as $linha) {
                if ($linha["tema"] == $_POST["tema"]) {
                    $legenda[$linha["idclasse"]] = $linha["imagem"];
                }
            }
        }
        $retorno = $m->listaRegistros("", $_POST["tipo"], "", $_POST["inicio"], $_POST["fim"], $_POST["tipolista"], $_POST["dadosDaClasse"]);
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
        $m = new Selecao($_SESSION["map_file"], $_POST["tema"]);
        $m->incluiSel($_POST["ids"]);
        include_once(dirname(__FILE__)."/../../classesphp/classe_mapa.php");
        //retorna os dados para poder atualizar a arvore de camadas
        $m = New Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        ob_clean();
        header("Content-type: application/json");
        echo json_encode($retorno);
        break;
    case "ESTATISTICA":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_atributos.php");
        $m = new Atributos($_SESSION["map_file"], $_POST["tema"], $_SESSION["locaplic"], $_POST["ext"]);
        $retorno = $m->estatDescritivas($_POST["item"], $_POST["exclui"]);
        ob_clean();
        header("Content-type: application/json");
        echo json_encode($retorno);
        break;
}