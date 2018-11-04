<?php

/****************************************************************/
// //include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
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

if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/sistemas") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id = $_POST["id"];
    $id_sistema = $_POST["id_sistema"];
    $id_funcao = $_POST["id_funcao"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id,
        $id_sistema,
        $id_funcao
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\cadastros\sistemas\funcoes\adicionar($id_sistema, $_POST["nome_funcao"], $_POST["abrir_funcao"], $_POST["h_funcao"], $_POST["w_funcao"], $_POST["perfil_funcao"], $dbhw);
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\cadastros\sistemas\funcoes\alterar($id_funcao, $_POST["nome_funcao"], $_POST["abrir_funcao"], $_POST["h_funcao"], $_POST["w_funcao"], $_POST["perfil_funcao"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\cadastros\sistemas\funcoes\listar($dbh, $id_funcao);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de pranchas");
            exit();
        }
        include ("../../perfis/funcoes.php");
        $perfis = \admin\cadastros\perfis\listar($dbh);
        $dbhw = null;
        $dbh = null;
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados,
            "perfis" => $perfis
        ));
        break;
    case "LISTA":
        $dados = \admin\cadastros\sistemas\funcoes\listar($dbh, $id_sistema);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de pranchas");
            exit();
        }
        include ("../../perfis/funcoes.php");
        $perfis = \admin\cadastros\perfis\listar($dbh);
        $dbhw = null;
        $dbh = null;
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados,
            "perfis" => $perfis
        ));
        break;
    case "EXCLUIR":
        $retorna = \admin\cadastros\sistemas\funcoes\excluir($id_funcao, $dbhw);
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
