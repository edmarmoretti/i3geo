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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/arvore") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    if (isset($_POST["id_menu"])) {
        $id_menu = $_POST["id_menu"];
        \admin\php\funcoesAdmin\testaSafeNumerico(array(
            $id_menu
        ));
    }
    if (! isset($idioma) || $idioma == "") {
        $idioma = "pt";
    }
    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\catalogo\menus\adicionar($_POST["publicado_menu"], $_POST["perfil_menu"], $_POST["aberto"], $_POST["desc_menu"], $_POST["nome_menu"], $_POST["es"], $_POST["en"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\menus\alterar($id_menu, $_POST["publicado_menu"], $_POST["perfil_menu"], $_POST["aberto"], $_POST["desc_menu"], $_POST["nome_menu"], $_POST["es"], $_POST["en"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\catalogo\menus\listar($dbh, $id_menu);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "perfis" => $perfis
            ));
        }
        break;
    case "LISTA":
        $dados = \admin\catalogo\menus\listar($dbh);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "perfis" => $perfis
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\menus\excluir($id_menu, $dbhw);
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
