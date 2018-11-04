<?php
/****************************************************************/
// include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/arvore") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $codigo_tipo_regiao = $_POST["codigo_tipo_regiao"];
    $id_agregaregiao = $_POST["id_agregaregiao"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $codigo_tipo_regiao,
        $id_agregaregiao
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\metaestat\regioes\hierarquia\adicionar($codigo_tipo_regiao, $_POST["colunaligacao_regiaopai"], $_POST["codigo_tipo_regiao_pai"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\metaestat\regioes\hierarquia\alterar($id_agregaregiao, $codigo_tipo_regiao, $_POST["colunaligacao_regiaopai"], $_POST["codigo_tipo_regiao_pai"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\metaestat\regioes\hierarquia\listar($dbh, $codigo_tipo_regiao, $id_agregaregiao);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\metaestat\regioes\hierarquia\listar($dbh, $codigo_tipo_regiao);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../funcoes.php");
            $regioes = \admin\metaestat\regioes\listar($dbh);
            $colunas = \admin\metaestat\regioes\nomesColunasRegiao($dbh, $codigo_tipo_regiao);
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "regioes" => $regioes,
                "colunas" => $colunas
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\metaestat\regioes\hierarquia\excluir($id_agregaregiao, $dbhw);
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
