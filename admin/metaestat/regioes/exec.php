<?php
/****************************************************************/
// //include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/metaestat/geral") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $codigo_tipo_regiao = @$_POST["codigo_tipo_regiao"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $codigo_tipo_regiao
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\regioes\adicionar($_POST["nome_tipo_regiao"], $_POST["descricao_tipo_regiao"], $_POST["codigo_estat_conexao"], $_POST["esquemadb"], $_POST["tabela"], $_POST["colunageo"], $_POST["data"], $_POST["identificador"], $_POST["colunanomeregiao"], $_POST["srid"], $_POST["colunacentroide"], $_POST["colunasvisiveis"], $_POST["apelidos"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\metaestat\regioes\alterar($codigo_tipo_regiao, $_POST["nome_tipo_regiao"], $_POST["descricao_tipo_regiao"], $_POST["codigo_estat_conexao"], $_POST["esquemadb"], $_POST["tabela"], $_POST["colunageo"], $_POST["data"], $_POST["identificador"], $_POST["colunanomeregiao"], $_POST["srid"], $_POST["colunacentroide"], $_POST["colunasvisiveis"], $_POST["apelidos"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\metaestat\regioes\listar($dbh, $codigo_tipo_regiao);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\regioes\listar($dbh);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\regioes\excluir($codigo_tipo_regiao, $dbhw);
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