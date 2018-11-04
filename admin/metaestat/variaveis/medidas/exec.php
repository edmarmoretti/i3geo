<?php
/****************************************************************/
// //include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../php/checaLogin.php");
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
    $codigo_variavel = $_POST["codigo_variavel"];
    $id_medida_variavel = $_POST["id_medida_variavel"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $codigo_variavel,
        $id_medida_variavel
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\variaveis\medidas\adicionar($_POST["codigo_unidade_medida"], $_POST["codigo_tipo_periodo"], $codigo_variavel, $_POST["codigo_tipo_regiao"], $_POST["codigo_estat_conexao"], $_POST["esquemadb"], $_POST["tabela"], $_POST["colunavalor"], $_POST["colunaidgeo"], $_POST["filtro"], $_POST["nomemedida"], $_POST["colunaidunico"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\metaestat\variaveis\medidas\alterar($id_medida_variavel, $_POST["codigo_unidade_medida"], $_POST["codigo_tipo_periodo"], $codigo_variavel, $_POST["codigo_tipo_regiao"], $_POST["codigo_estat_conexao"], $_POST["esquemadb"], $_POST["tabela"], $_POST["colunavalor"], $_POST["colunaidgeo"], $_POST["filtro"], $_POST["nomemedida"], $_POST["colunaidunico"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\metaestat\variaveis\medidas\listar($dbh, "", $id_medida_variavel);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\variaveis\medidas\listar($dbh, $codigo_variavel);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            // listagens
            include ("../../periodos/funcoes.php");
            $periodos = \admin\metaestat\periodos\listar($dbh);
            include ("../../regioes/funcoes.php");
            $regioes = \admin\metaestat\regioes\listar($dbh);
            include ("../../conexoes/funcoes.php");
            $conexoes = \admin\metaestat\conexoes\listar($dbh);
            include ("../../unidades/funcoes.php");
            $unidades = \admin\metaestat\unidades\listar($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "periodos" => $periodos,
                "regioes" => $regioes,
                "conexoes" => $conexoes,
                "unidades" => $unidades
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\variaveis\medidas\excluir($id_medida_variavel, $dbhw);
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