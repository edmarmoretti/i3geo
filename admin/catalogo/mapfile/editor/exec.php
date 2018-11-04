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
// include ($_SESSION["locaplic"]."/admin/php/conexao.php");
/**
 * ************************************************************
 */
// if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
// header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
// exit ();
// }
if (! empty($funcao)) {
    $codigo = $_GET["codigomap"];

    $codigo = str_replace(" ", "", \admin\php\funcoesAdmin\removeAcentos($codigo));

    $codigo = str_replace(".", "", $codigo);
    $codigo = strip_tags($codigo);
    $codigo = htmlspecialchars($codigo, ENT_QUOTES);

    $funcao = strtoupper($funcao);
}
switch ($funcao) {
    case "REFAZERLAYER":
        $dados = \admin\catalogo\mapfile\editor\refazerLayer($_GET["nomelayer"], $codigo, $_SESSION["locaplic"], $_SESSION["dir_tmp"], $_SESSION["cachedir"], $_GET["maporigem"], $_GET["classe"], $_GET["cache"], $_GET["identifica"]);
        if ($dados === false) {
            header("HTTP/1.1 500 erro ao definir as propriedades");
        }
        \admin\php\funcoesAdmin\retornaJSON(array(
            "dados" => $dados
        ));
        break;
    case "UNDO":
        $mapfile = $_SESSION["dir_tmp"] . "/" . $codigo . "backupEditor.map";
        if (file_exists($mapfile)) {
            $status = copy($mapfile, $_SESSION["locaplic"] . "/temas/" . $codigo . ".map");
            if ($status == false) {
                header("HTTP/1.1 500 nao foi possivel restaurar o arquivo");
            } else {
                // ob_clean();
                // echo "";
                // echo "<meta http-equiv='refresh' content='0;url=index.php?codigo=_lbiomashp&id_tema=108&t'>";
            }
        } else {
            header("HTTP/1.1 500 arquivo de backup nao encontrado");
        }
        break;
}
?>