<?php
/****************************************************************/
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../../php/checaLogin.php");
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
    $id_parametro_medida = $_POST["id_parametro_medida"];
    $id_medida_variavel = $_POST["id_medida_variavel"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_medida_variavel,
        $id_parametro_medida
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\variaveis\medidas\parametros\adicionar($id_medida_variavel, $_POST["coluna"], $_POST["nome"], $_POST["descricao"], $_POST["id_pai"], $_POST["tipo"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\metaestat\variaveis\medidas\parametros\alterar($id_medida_variavel, $id_parametro_medida, $_POST["coluna"], $_POST["nome"], $_POST["descricao"], $_POST["id_pai"], $_POST["tipo"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\metaestat\variaveis\medidas\parametros\listar($dbh, "", $id_parametro_medida);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\variaveis\medidas\parametros\listar($dbh, $id_medida_variavel);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../funcoes.php");
            $colunas = \admin\metaestat\variaveis\medidas\nomesColunasMedida($dbh, $id_medida_variavel);
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "colunas" => $colunas
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\variaveis\medidas\parametros\excluir($id_parametro_medida, $dbhw);
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