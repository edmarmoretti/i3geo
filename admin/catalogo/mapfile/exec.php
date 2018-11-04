<?php
/****************************************************************/
// include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../php/checaLogin.php");
\admin\php\login\checaLogin();
// funcoes de administracao
include ($_SESSION["locaplic"] . "/admin/php/funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"] . "/classesphp/carrega_ext.php");
//
// carrega as funcoes locais
// depende de funcoesAdmin.php
//
include ("funcoes.php");
//
// conexao com o banco de administracao
// cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"] . "/admin/php/conexao.php");
/**
 * ************************************************************
 */
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/editormapfile") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    if (isset($_POST["codigo"])) {
        $codigo = $_POST["codigo"];
        $codigo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($codigo));
        $codigo = str_replace(".", "", $codigo);
        $codigo = strip_tags($codigo);
        $codigo = htmlspecialchars($codigo, ENT_QUOTES);
    }
    if (isset($_POST["palavra"])) {
        setcookie("palavraFiltro", strip_tags($_POST["palavra"]));
    }
    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        if (empty($_POST["titulolegenda"])) {
            $_POST["titulolegenda"] = $_POST["nome_tema"];
        }
        $novo = \admin\catalogo\mapfile\adicionar($_SESSION["locaplic"], $_POST["titulolegenda"], $_POST["link_tema"], $codigo, $_POST["acessopublico"], $_POST["metaestat"], $_POST["nome_tema"], $_POST["desc_tema"], $_POST["en"], $_POST["es"], true, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            // e necessario retornar o codigo criado pois e usado na interface
            \admin\php\funcoesAdmin\retornaJSON(array(
                "codigo" => $codigo
            ));
        }
        break;
    case "ALTERAR":
        if (empty($_POST["titulolegenda"])) {
            $_POST["titulolegenda"] = $_POST["nome_tema"];
        }
        // quando e feita a listagem unica, o mapfile ja foi registrado no banco se nao tinha sido antes
        $novo = \admin\catalogo\mapfile\alterar($_SESSION["locaplic"], $_POST["id_tema"], $_POST["titulolegenda"], $_POST["link_tema"], $codigo, $_POST["acessopublico"], $_POST["metaestat"], $_POST["nome_tema"], $_POST["desc_tema"], $_POST["en"], $_POST["es"], true, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\mapfile\excluir($codigo, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 400 $retorna");
            exit();
        }
        \admin\php\funcoesAdmin\retornaJSON(array(
            "codigo" => $codigo
        ));
        break;
    case "LISTA":
        $retorna = \admin\catalogo\mapfile\listar($dbh, $_POST["filtro"], $_POST["palavra"], $_POST["validar"]);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        \admin\php\funcoesAdmin\retornaJSON($retorna);
        break;
    case "LISTAUNICO":
        $retorna = \admin\catalogo\mapfile\listaUnico($dbhw, $codigo);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $retorna
            ));
        }
        break;
    case "LIMPACACHE":
        $retorna = \admin\catalogo\mapfile\limpaCache($_SESSION["locaplic"], $codigo, $cachedir, $dir_tmp);
        \admin\php\funcoesAdmin\retornaJSON("ok");
        break;
    case "CLONARMAPFILE":
        $novocodigo = $_POST["novocodigo"];
        $novocodigo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($novocodigo));
        $novocodigo = str_replace(".", "", $novocodigo);
        $novocodigo = strip_tags($novocodigo);
        $novocodigo = htmlspecialchars($novocodigo, ENT_QUOTES);
        $titulo = $_POST["titulo"];
        $retorna = \admin\catalogo\mapfile\clonarMapfile($codigo, $novocodigo, $titulo, $dbh, $dbhw);
        \admin\php\funcoesAdmin\retornaJSON(array(
            "codigo" => $novocodigo
        ));
        break;
    case "PEGAPLUGIN":
        // utilizado na janela de atalhos de edicao
        session_write_close();
        session_name("i3GeoPHP");
        session_id($_GET["g_sid"]);
        session_start();
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["codigoLayer"]);
        \admin\php\funcoesAdmin\retornaJSON($layer->getmetadata("PLUGINI3GEO"));
        break;
    case "GRAVAPLUGIN":
        // utilizado na janela de atalhos de edicao
        session_write_close();
        session_name("i3GeoPHP");
        session_id($_GET["g_sid"]);
        session_start();
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["codigoLayer"]);
        // $plugin = json_encode($_GET["plugin"]);
        $layer->setmetadata("PLUGINI3GEO", $_GET["plugin"]);
        $mapa->save($_SESSION["map_file"]);
        \admin\php\funcoesAdmin\retornaJSON("ok");
        break;
    case "REMOVEPLUGIN":
        // utilizado na janela de atalhos de edicao
        session_write_close();
        session_name("i3GeoPHP");
        session_id($_GET["g_sid"]);
        session_start();
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_GET["codigoLayer"]);
        $layer->setmetadata("PLUGINI3GEO", "");
        $mapa->save($_SESSION["map_file"]);
        \admin\php\funcoesAdmin\retornaJSON("ok");
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}
?>