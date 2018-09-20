<?php
include_once (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
$retorno = "";
include (dirname(__FILE__) . "/../../classesphp/classe_selecao.php");
$selecao = new Selecao($_SESSION["map_file"], $_GET["tema"], $_GET["ext"]);
switch (strtoupper($_GET["funcao"])) {
    case "SELECAOATRIBUTO":
        $selecao->selecaoAtributos2(base64_decode($_GET["filtro"]), $_GET["tipo"]);
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOBOX":
        $selecao->selecaoBOX($_GET["tipo"], $_GET["box"]);
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOPT":
        $selecao->selecaoPT($_GET["xy"], $_GET["tipo"], $_GET["tolerancia"]);
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOWKT":
        $selecao->selecaoPorPoligono($_GET["tipo"], "", "", $_GET["wkt"], $_GET["buffer"]);
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOINVERTE":
        $selecao->selecaoInverte();
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOLIMPA":
        $selecao->selecaoLimpa();
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOCRIATEMA":
        $selecao->selecao2tema($_SESSION["locaplic"], $_SESSION["dir_tmp"]);
        $selecao->salva();
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;
    case "SELECAOTEMA":
        $selecao->selecaoTema($_GET["temao"], $_GET["tipo"], $_GET["buffer"]);
        include (dirname(__FILE__) . "/../../classesphp/classe_mapa.php");
        // retorna os dados para poder atualizar a arvore de camadas
        $m = new Mapa($_SESSION["map_file"]);
        $retorno = $m->parametrosTemas();
        break;

    /*
     * Valor: SELECAOPOLI
     *
     * Sele&ccedil;&atilde;o por poligono (chamado via POST).
     *
     * <Selecao->selecaoPoli>
     */
    case "SELECAOPOLI":
        // esta opera&ccedil;&atilde;o &eacute; chamada com POST via cpaint
        // por isso precisa ser executada com start
        copiaSeguranca($map_file);
        $retorno = selecaoPoli($_GET["xs"], $_GET["ys"], $tema, $_GET["tipo"], $_GET["buffer"]);
        $_SESSION["contadorsalva"] ++;
        redesenhaMapa();
        // restauraCon($map_file,$postgis_mapa);
        break;
    /*
     * Valor: LISTAPONTOSSHAPESEL
     *
     * Lista os pontos dos elementos selecionados de um layer
     *
     * <SHP->listaPontosShapeSel>
     */
    case "LISTAPONTOSSHAPESEL":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_shp.php");
        $m = new SHP($map_file, $tema);
        $retorno = $m->listaPontosShapeSel();
        break;
}
ob_clean();
if (! $retorno) {
    header("HTTP/1.1 500 erro");
} else {
    header("Content-type: application/json");
    echo json_encode($retorno);
}

function selecaoPoli($xs, $ys, $tema, $tipo, $buffer = 0)
{
    global $map_file;
    include_once (dirname(__FILE__) . "/../../classesphp/classe_selecao.php");
    $temas = explode(",", $tema);
    foreach ($temas as $tema) {
        $m = new Selecao($map_file, $tema);
        $ok[] = $m->selecaoPorPoligono($tipo, $xs, $ys, "", $buffer);
        $m->salva();
        $_SESSION["contadorsalva"] ++;
    }
    return implode(",", $ok);
}
?>