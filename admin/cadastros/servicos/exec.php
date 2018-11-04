<?php
/****************************************************************/
// //include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include (dirname(__FILE__) . "/../../php/checaLogin.php");
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
if (@$_GET["funcao"] != "lista" && \admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/webservices") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id_ws = @$_POST["id_ws"];
    $id = @$_POST["id"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id,
        $id_ws
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\cadastros\servicos\adicionar($_POST["autor_ws"], $_POST["desc_ws"], $_POST["link_ws"], $_POST["nome_ws"], $_POST["tipo_ws"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\cadastros\servicos\alterar($id_ws, $_POST["autor_ws"], $_POST["desc_ws"], $_POST["link_ws"], $_POST["nome_ws"], $_POST["tipo_ws"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\cadastros\servicos\listar($dbh, $id_ws);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\cadastros\servicos\listar($dbh);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\cadastros\servicos\excluir($id_ws, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}