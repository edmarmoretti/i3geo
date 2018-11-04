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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/editormapfile") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $codigo = $_POST["codigo"];
    $codigo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($codigo));
    $codigo = str_replace(".", "", $codigo);
    $codigo = strip_tags($codigo);
    $codigo = htmlspecialchars($codigo, ENT_QUOTES);

    if (isset($_POST["cacheprefixo"])) {
        $cacheprefixo = $_POST["cacheprefixo"];
        $cacheprefixo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($cacheprefixo));
        $cacheprefixo = str_replace(".", "", $cacheprefixo);
        $cacheprefixo = strip_tags($cacheprefixo);
        $cacheprefixo = htmlspecialchars($cacheprefixo, ENT_QUOTES);
    } else {
        $cacheprefixo = "";
    }

    $id_tema = (int) $_POST["id_tema"];

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ALTERAR":
        $dados = \admin\catalogo\mapfile\renderizacao\alterar($_SESSION["locaplic"], $id_tema, $codigo, $_POST["cache"], $_POST["tiles"], $_POST["maxfeatures"], $_POST["cortepixels"], $cacheprefixo);
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTA":
        $dados = \admin\catalogo\mapfile\renderizacao\listar($_SESSION["locaplic"], $codigo);
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados
        ));
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}
?>
