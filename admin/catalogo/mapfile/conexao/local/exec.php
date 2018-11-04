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

    $id_tema = (int) $_POST["id_tema"];

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "ALTERAR":
        $dados = \admin\catalogo\mapfile\conexao\local\alterar($_SESSION["locaplic"], $codigo, $_POST["connection"], $_POST["connectiontype"], $_POST["data"], $_POST["tileindex"], $_POST["tileitem"], $_POST["type"], $_POST["projection"], $_POST["convcaracter"], $_POST["metaestat"], $_POST["metaestat_id_medida_variavel"], $dbhw);
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao definir as propriedades");
        }
        break;
    case "LISTA":
        $dados = \admin\catalogo\mapfile\conexao\local\listar($_SESSION["locaplic"], $codigo);
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
