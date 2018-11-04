<?php
/****************************************************************/
include (dirname(__FILE__) . "/../../../../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../../../php/checaLogin.php");
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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/arvore") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id_subgrupo = $_POST["id_subgrupo"];
    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_subgrupo
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\adicionar($_POST["nome_subgrupo"], $_POST["desc_subgrupo"], $_POST["en"], $_POST["es"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\alterar($id_subgrupo, $_POST["nome_subgrupo"], $_POST["desc_subgrupo"], $_POST["en"], $_POST["es"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\listar($dbh, $id_subgrupo);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\listar($dbh);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\excluir($id_subgrupo, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}
?>
