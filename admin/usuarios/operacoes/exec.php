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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/operacoes") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id = $_POST["id"];
    $id_operacao = $_POST["id_operacao"];
    $id_papel = $_POST["id_papel"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id,
        $id_operacao,
        $id_papel
    ));

    $funcao = strtoupper($funcao);
}
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
    $papeis = array();
    $papeis[] = 1; // admin
    foreach (array_keys($_POST) as $k) {
        $teste = explode("-", $k);
        if ($teste[0] == "id_papel") {
            $papeis[] = $teste[1] * 1;
        }
    }
    array_unique($papeis);
}
switch ($funcao) {
    case "ADICIONAR":
        if ($_POST["codigo"] == "") {
            header("HTTP/1.1 500 codigo nao pode ser vazio");
            exit();
        }
        $novo = \admin\usuarios\operacoes\adicionar($_POST["codigo"], $_POST["descricao"], $papeis, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\usuarios\operacoes\alterar($id_operacao, $_POST["codigo"], $_POST["descricao"], $papeis, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $operacao = \admin\usuarios\operacoes\listar($dbh, $id_operacao);
        if ($operacao === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $papeisoperacao = \admin\usuarios\operacoes\listaPapeisOperacao($dbh, $id_operacao);
            // cria o indice do array conforme o id da operacao
            $o = array();
            foreach ($papeisoperacao as $op) {
                $o[$op["id_papel"]] = $op;
            }
            $operacao["papeis"] = $o;
            // todos os papeis
            $papeis = \admin\usuarios\operacoes\listaPapeis($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "operacao" => $operacao,
                "papeis" => $papeis
            ));
        }
        break;
    case "LISTA":
        $operacoes = \admin\usuarios\operacoes\listar($dbh);
        if ($operacoes === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $papeis = \admin\usuarios\operacoes\listaPapeis($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "operacoes" => $operacoes,
                "papeis" => $papeis
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\usuarios\operacoes\excluir($id_operacao, $dbhw);
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