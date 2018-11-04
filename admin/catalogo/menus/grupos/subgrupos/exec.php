<?php
/****************************************************************/
include (dirname(__FILE__) . "/../../../../../ms_configura.php");
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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/arvore") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id_n1 = $_POST["id_n1"];
    $id_n2 = $_POST["id_n2"];
    $id_menu = $_POST["id_menu"];
    $id_subgrupo = $_POST["id_subgrupo"];
    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_n1,
        $id_n2,
        $id_menu,
        $id_subgrupo
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ORDENA":
        $ordem = explode(" ", $_POST["novaordem"]);
        $dados = \admin\catalogo\menus\grupos\subgrupos\ordenar($id_n1, $ordem, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao ordenar");
        }
        \admin\php\funcoesAdmin\retornaJSON($dados);
        break;
    case "ADICIONAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\adicionar($id_subgrupo, $id_n1, $_POST["publicado"], $_POST["n2_perfil"], $_POST["ordem"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\alterar($id_n2, $id_subgrupo, $id_menu, $publicado, $_POST["n2_perfil"], $_POST["ordem"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\catalogo\menus\grupos\subgrupos\listar($dbh, "", $id_n2);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $subgrupos = \admin\catalogo\menus\grupos\subgrupos\listar($dbh, $id_n1);
        if ($subgrupos === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $raiz = \admin\catalogo\menus\grupos\subgrupos\raiz\listar($dbh, "", $id_n1, $id_menu);
            include ("../../../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            include ("temas/funcoes.php");
            $temas = \admin\catalogo\menus\grupos\subgrupos\temas\todosTemas($dbh);
            include ("listadesubgrupos/funcoes.php");
            $tiposSubGrupos = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\listar($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "raiz" => $raiz,
                "subgrupos" => $subgrupos,
                "perfis" => $perfis,
                "temas" => $temas,
                "tiposSubGrupos" => $tiposSubGrupos
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\menus\grupos\subgrupos\excluir($id_n2, $dbhw);
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
