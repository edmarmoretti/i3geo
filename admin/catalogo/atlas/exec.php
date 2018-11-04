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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/atlas") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id = $_POST["id"];
    $id_atlas = $_POST["id_atlas"];
    $id_prancha = $_POST["id_prancha"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id,
        $id_atlas,
        $id_prancha
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\catalogo\atlas\adicionar($_POST["titulo_atlas"], $_POST["publicado_atlas"], $_POST["ordem_atlas"], $_POST["basemapfile_atlas"], $_POST["desc_atlas"], $_POST["h_atlas"], $_POST["w_atlas"], $_POST["icone_atlas"], $_POST["link_atlas"], $_POST["pranchadefault_atlas"], $_POST["template_atlas"], $_POST["tipoguias_atlas"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\atlas\alterar($id_atlas, $_POST["titulo_atlas"], $_POST["publicado_atlas"], $_POST["ordem_atlas"], $_POST["basemapfile_atlas"], $_POST["desc_atlas"], $_POST["h_atlas"], $_POST["w_atlas"], $_POST["icone_atlas"], $_POST["link_atlas"], $_POST["pranchadefault_atlas"], $_POST["template_atlas"], $_POST["tipoguias_atlas"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\catalogo\atlas\listar($dbh, $id_atlas);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de atlas");
            exit();
        }
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados
        ));
        break;
    case "LISTA":
        $dados = \admin\catalogo\atlas\listar($dbh);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de atlas");
            exit();
        }
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados
        ));
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\atlas\excluir($id_atlas, $dbhw);
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