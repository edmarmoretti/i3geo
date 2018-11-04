<?php
/****************************************************************/
include (dirname(__FILE__) . "/../../../../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("../../../../../php/checaLogin.php");
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
    $id_n2 = $_POST["id_n2"];
    $id_n3 = $_POST["id_n3"];
    $id_tema = $_POST["id_tema"];
    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_tema,
        $id_n2,
        $id_n3
    ));

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ORDENA":
        $ordem = explode(" ", $_POST["novaordem"]);
        $dados = \admin\catalogo\menus\grupos\subgrupos\temas\ordenar($id_n2, $ordem, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao ordenar");
        }
        break;
    case "ADICIONAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\temas\adicionar($id_tema, $id_n2, $_POST["publicado"], $_POST["n3_perfil"], $_POST["ordem"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\menus\grupos\subgrupos\temas\alterar($id_n3, $id_tema, $id_n2, $_POST["publicado"], $_POST["n3_perfil"], $_POST["ordem"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $dados = \admin\catalogo\menus\grupos\subgrupos\temas\listar($dbh, "", $id_n3);
        $dbhw = null;
        $dbh = null;
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            \admin\php\funcoesAdmin\retornaJSON($dados);
        }
        break;
    case "LISTA":
        $dados = \admin\catalogo\menus\grupos\subgrupos\temas\listar($dbh, $id_n2);
        $temas = \admin\catalogo\menus\grupos\subgrupos\temas\todosTemas($dbh);
        if ($dados === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            include ("../../../../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $dados,
                "perfis" => $perfis,
                "temas" => $temas
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\menus\grupos\subgrupos\temas\excluir($id_n3, $dbhw);
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