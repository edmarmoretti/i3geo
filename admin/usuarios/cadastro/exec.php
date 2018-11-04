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
    $id_usuario = @$_POST["id_usuario"];
    $id_papel = @$_POST["id_papel"];

    \admin\php\funcoesAdmin\testaSafeNumerico(array(
        $id_usuario,
        $id_papel
    ));

    $funcao = strtoupper($funcao);
}
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
    $papeis = array();
    foreach (array_keys($_POST) as $k) {
        $teste = explode("-", $k);
        if ($teste[0] == "id_papel") {
            $papeis[] = $teste[1] * 1;
        }
    }
    array_unique($papeis);
}
switch ($funcao) {
    case "ADICIONAR":
        $novo = \admin\usuarios\cadastro\adicionar($_POST["ativo"], $_POST["data_cadastro"], $_POST["email"], $_POST["login"], $_POST["nome_usuario"], $_POST["senha"], $papeis, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo != false) {
            if (strtolower($_POST["enviaSenha"]) == "on") {
                if ($_POST["senha"] == "" || $_POST["email"] == "") {
                    header("HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail");
                } else {
                    $dados = \admin\usuarios\cadastro\enviarSenha($_POST["senha"], $_POST["email"]);
                }
            }
        } else {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        }
        break;
    case "ALTERAR":
        $novo = \admin\usuarios\cadastro\alterar($id_usuario, $_POST["ativo"], $_POST["data_cadastro"], $_POST["email"], $_POST["login"], $_POST["nome_usuario"], $_POST["senha"], $papeis, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($novo === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            if (strtolower($_POST["enviaSenha"]) == "on") {
                if ($_POST["senha"] == "" || $_POST["email"] == "") {
                    $dados = header("HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail");
                } else {
                    $dados = \admin\usuarios\cadastro\enviarSenha($_POST["senha"], $_POST["email"]);
                }
            }
        }
        break;
    case "LISTAUNICO":
        $usuario = \admin\usuarios\cadastro\listar($dbh, $id_usuario);
        if ($usuario === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }

        $papeisusuario = \admin\usuarios\cadastro\listaPapeisUsuario($id_usuario, $dbh);
        // cria o indice do array conforme o id da operacao
        $o = array();
        foreach ($papeisusuario as $op) {
            $o[$op["id_papel"]] = $op;
        }
        $usuario["papeis"] = $o;
        // todos os papeis
        $papeis = \admin\usuarios\cadastro\listaPapeis($dbh);
        $dbhw = null;
        $dbh = null;
        \admin\php\funcoesAdmin\retornaJSON(array(
            "usuario" => $usuario,
            "papeis" => $papeis
        ));
        break;
    case "LISTA":
        $usuarios = \admin\usuarios\cadastro\listar($dbh);
        if ($usuarios === false) {
            $dbhw = null;
            $dbh = null;
            header("HTTP/1.1 500 erro ao consultar banco de dados");
        } else {
            $papeis = \admin\usuarios\cadastro\listaPapeis($dbh);
            $dbhw = null;
            $dbh = null;
            \admin\php\funcoesAdmin\retornaJSON(array(
                "usuarios" => $usuarios,
                "papeis" => $papeis
            ));
        }
        break;
    case "EXCLUIR":
        $retorna = \admin\usuarios\cadastro\excluir($id_usuario, $dbhw);
        $dbhw = null;
        $dbh = null;
        if ($retorna === false) {
            header("HTTP/1.1 500 erro ao consultar banco de dados");
            exit();
        }
        break;
    case "ENVIARSENHA":
        if ($_POST["senha"] == "" || $_POST["email"] == "") {
            header("HTTP/1.1 500 erro ao enviar e-mail. Prrencha o valor de e-mail e senha");
        } else {
            $retorna = \admin\usuarios\cadastro\enviarSenha($_POST["senha"], $_POST["email"]);
            if ($retorna === false) {
                header("HTTP/1.1 500 erro ao enviar e-mail $email");
            } else {
                \admin\php\funcoesAdmin\retornaJSON(true);
            }
        }
        break;
    default:
        if (! empty($funcao))
            header("HTTP/1.1 500 erro funcao nao existe");
        break;
}
?>