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
if (\admin\php\funcoesAdmin\verificaOperacaoSessao("admin/html/usuarios") === false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao");
    exit();
}
if (! empty($funcao)) {
    $id_usuario = $_POST["id_usuario"];
    $id_grupo = $_POST["id_grupo"];
    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_usuario,
        $id_grupo
    ));

    $funcao = strtoupper($funcao);
}
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
    $usuarios = array();
    foreach (array_keys($_POST) as $k) {
        $teste = explode("-", $k);
        if ($teste[0] == "id_usuario") {
            $usuarios[] = $teste[1] * 1;
        }
    }
    array_unique($usuarios);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\usuarios\grupos\adicionar($_POST["nome"], $_POST["descricao"], $usuarios, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\usuarios\grupos\alterar($id_grupo, $_POST["nome"], $_POST["descricao"], $usuarios, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "LISTAUNICO":
        $grupo = \admin\usuarios\grupos\listar($dbh, $id_grupo);
        if ($grupo === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $gruposusuarios = \admin\usuarios\grupos\listaGruposUsuario($id_grupo, $dbh);
            $o = array();
            foreach ($gruposusuarios as $gp) {
                $o[$gp["id_usuario"]] = $gp;
            }
            $grupo["usuarios"] = $o;
            $usuarios = \admin\usuarios\grupos\listaUsuarios($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "grupo" => $grupo,
                "usuarios" => $usuarios
            ));
        }
        break;
    case "LISTA":
        $grupos = \admin\usuarios\grupos\listar($dbh);
        if ($grupos === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $usuarios = \admin\usuarios\grupos\listaUsuarios($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "grupos" => $grupos,
                "usuarios" => $usuarios
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\usuarios\grupos\excluir($id_grupo, $dbhw);
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