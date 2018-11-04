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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/mapas") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    if (isset($_POST["id_mapa"])) {
        $id_mapa = $_POST["id_mapa"];
        \admin\php\funcoesAdmin\testaSafeNumerico(array(
            $id_mapa
        ));
    }
    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\catalogo\mapas\adicionar($_POST["publicado_mapa"], $_POST["ordem_mapa"], $_POST["perfil_mapa"], $_POST["ligados_mapa"], $_POST["temas_mapa"], $_POST["desc_mapa"], $_POST["ext_mapa"], $_POST["imagem_mapa"], $_POST["linkdireto_mapa"], $_POST["nome_mapa"], $_POST["outros_mapa"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\catalogo\mapas\alterar($id_mapa, $_POST["publicado_mapa"], $_POST["ordem_mapa"], $_POST["perfil_mapa"], $_POST["ligados_mapa"], $_POST["temas_mapa"], $_POST["desc_mapa"], $_POST["ext_mapa"], $_POST["imagem_mapa"], $_POST["linkdireto_mapa"], $_POST["nome_mapa"], $_POST["outros_mapa"], $_POST["mapfile"], $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $mapfile = \admin\catalogo\mapas\listar($dbh, $id_mapa);
        if ($mapfile === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de mapas");
        } else {
            include ("../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            $dbhw = null;
            $dbh = null;
            // pega a lista de temas
            include ("../../../classesphp/classe_arvore.php");
            $arvore = new Arvore($_SESSION["locaplic"]);
            $temas = $arvore->pegaTodosTemas(true);
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $mapfile,
                "perfis" => $perfis,
                "temas" => $temas
            ));
        }
        break;
    case "LISTA":
        $mapfile = \admin\catalogo\mapas\listar($dbh);
        if ($mapfile === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados tabela de mapas");
        } else {
            include ("../../cadastros/perfis/funcoes.php");
            $perfis = \admin\cadastros\perfis\listar($dbh);
            $dbhw = null;
            $dbh = null;
            // pega a lista de temas
            include ("../../../classesphp/classe_arvore.php");
            $arvore = new Arvore($_SESSION["locaplic"]);
            $temas = $arvore->pegaTodosTemas(true);
            \admin\php\funcoesAdmin\retornaJSON(array(
                "dados" => $mapfile,
                "perfis" => $perfis,
                "temas" => $temas
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\catalogo\mapas\excluir($id_mapa, $dbhw);
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
