<?php
/****************************************************************/
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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/editormapfile") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id_classificacao = $_POST["id_classificacao"];
    $id_medida_variavel = $_POST["id_medida_variavel"];
    $id_classe = $_POST["id_classe"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_medida_variavel,
        $id_classificacao,
        $id_classe
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\variaveis\medidas\classificacoes\classes\adicionar($id_classificacao, $_POST["titulo"], $_POST["expressao"], $_POST["azul"], $_POST["verde"], $_POST["vermelho"], $_POST["tamanho"], $_POST["simbolo"], $_POST["otamanho"], $_POST["oazul"], $_POST["overde"], $_POST["overmelho"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\metaestat\variaveis\medidas\classificacoes\classes\alterar($id_classe, $id_classificacao, $_POST["titulo"], $_POST["expressao"], $_POST["azul"], $_POST["verde"], $_POST["vermelho"], $_POST["tamanho"], $_POST["simbolo"], $_POST["otamanho"], $_POST["oazul"], $_POST["overde"], $_POST["overmelho"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\metaestat\variaveis\medidas\classificacoes\classes\listar($dbh, "", $id_classe);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\variaveis\medidas\classificacoes\classes\listar($dbh, $id_classificacao);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\variaveis\medidas\classificacoes\classes\excluir($id_classe, $dbhw);
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
?>