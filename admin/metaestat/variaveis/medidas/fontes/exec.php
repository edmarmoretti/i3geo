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
    $id_fonteinfo = $_POST["id_fonteinfo"];
    $id_medida_variavel = $_POST["id_medida_variavel"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_medida_variavel,
        $id_fonteinfo
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\variaveis\medidas\fontes\adicionar($id_medida_variavel, $id_fonteinfo, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\variaveis\medidas\fontes\listar($dbh, $id_medida_variavel);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../../../fontes/funcoes.php");
            $fontes = \admin\metaestat\fontes\listar($dbh);
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "fontes" => $fontes
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\variaveis\medidas\fontes\excluir($id_medida_variavel, $id_fonteinfo, $dbhw);
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