<?php
/****************************************************************/
// include (dirname ( __FILE__ ) . "/../../../ms_configura.php");
//
// checa login
// valida _GET e _POST, juntando em _GET
// pega algumas variaveis de uso mais comum
// session_start
//
include ("checaLogin.php");
\admin\php\login\checaLogin();
// funcoes de administracao
include ("funcoesAdmin.php");
//
// carrega outras funcoes e extensoes do PHP
//
include ("../../classesphp/carrega_ext.php");
//
// conexao com o banco de administracao
// cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ("conexao.php");

/**
 * ************************************************************
 */
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/mapas") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (isset($_POST["id_mapa"])) {
    $id_mapa = $_POST["id_mapa"];
    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_mapa
    ));
} else {
    exit;
}
$funcao = strtoupper($funcao);
switch ($funcao) {
    case "SALVAMAPFILE":
        $nameatual = session_name();
        $idatual = session_id();
        session_write_close();

        session_name("i3GeoPHP");
        session_id($_POST["sid"]);
        session_start();
        $arqmapfile = $_SESSION["map_file"];
        $interface = $_SESSION["customDir"]."/".$_SESSION["interfacePadrao"];

        session_write_close();
        session_name("$nameatual");
        session_id($idatual);
        session_start();
        //
        // as configuracoes especiais do mapa, definidas nas preferencias ou em ferramentas abertas quando o mapa e salvo,
        // sao convertidas em base64 do lado do cliente
        // esses dados sao entao armazenados como tags METADATA no mapfile
        // quando o mapa e restaurado, esses valores sao recuperados
        // a string que vai no metadata segue o padrao JSON
        // o parser para reconstruir os valores e feito em javascript, no cliente
        //
        $customizacoesinit = array();
        if (isset($_POST["preferenciasbase64"]) || isset($_POST["geometriasbase64"]) || isset($_POST["graficosbase64"]) || isset($_POST["tabelasbase64"])) {
            $customizacoesinit[] = '"preferenciasbase64":"' . $_POST["preferenciasbase64"] . '"';
            $customizacoesinit[] = '"geometriasbase64":"' . $_POST["geometriasbase64"] . '"';
            $customizacoesinit[] = '"graficosbase64":"' . $_POST["graficosbase64"] . '"';
            $customizacoesinit[] = '"tabelasbase64":"' . $_POST["tabelasbase64"] . '"';
            $m = ms_newMapObj($arqmapfile);
            $m->setmetadata("CUSTOMIZACOESINIT", '{' . implode(",", $customizacoesinit) . '}');
            $m->save($arqmapfile);
        }
        if ($_POST["ext"] && $_POST["ext"] != "") {
            $e = explode(" ", $_POST["ext"]);
            $m = ms_newMapObj($arqmapfile);
            $extatual = $m->extent;
            $extatual->setextent((min($e[0], $e[2])), (min($e[1], $e[3])), (max($e[0], $e[2])), (max($e[1], $e[3])));
            $m->save($arqmapfile);
        }
        $handle = fopen($arqmapfile, 'r');
        $conteudo = fread($handle, filesize($arqmapfile));
        fclose($handle);
        // $conteudo = base64_encode($conteudo);
        $conteudo = str_replace("'", "_!_", $conteudo);
        $conteudo = str_replace('"', "_!!_", $conteudo);
        $conteudo = str_replace(array(
            "<?",
            "?>"
        ), "", $conteudo);
        $dataCol = array(
            "mapfile" => $conteudo,
            "outros_mapa" => "&restauramapa=$id_mapa&interface=" . $_POST["url"]."/".$interface
        );
        $resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_mapas", $dataCol, "WHERE id_mapa = $id_mapa" );
        $dbhw = null;
        $dbh = null;
        if ($resultado === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        $dbh = null;
        \admin\php\funcoesAdmin\retornaJSON( array(
            "status" => "ok"
        ));
        exit();
        break;
    case "REMOVEMAPFILE":
        $dataCol = array(
            "mapfile" => "",
            "outros_mapa" => ""
        );
        $resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_mapas", $dataCol, "WHERE id_mapa = $id_mapa" );
        $dbhw = null;
        $dbh = null;
        if ($resultado === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        $dbh = null;
        \admin\php\funcoesAdmin\retornaJSON( array(
            "status" => "ok"
        ));
        exit();
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}
?>