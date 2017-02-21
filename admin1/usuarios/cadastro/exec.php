<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
error_reporting ( 0 );
//
// pega as variaveis passadas com get ou post
//

include_once (dirname ( __FILE__ ) . "/../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/usuarios" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
include ("funcoes.php");

$id_usuario = $_POST ["id_usuario"];
$id_papel = $_POST ["id_papel"];

testaSafeNumerico ( [
		$id_usuario,
		$id_papel
] );

$funcao = strtoupper ( $funcao );
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
	$papeis = array ();
	foreach ( array_keys ( $_POST ) as $k ) {
		$teste = explode ( "-", $k );
		if ($teste [0] == "id_papel") {
			$papeis [] = $teste [1] * 1;
		}
	}
	array_unique ( $papeis );
}
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\usuarios\cadastro\adicionar ( $_POST ["ativo"], $_POST ["data_cadastro"], $_POST ["email"], $_POST ["login"], $_POST ["nome_usuario"], $_POST ["senha"], $papeis, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo != false) {
			if (strtolower ( $enviaSenha ) == "on") {
				if ($senha == "" || $email == "") {
					header ( "HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail" );
				} else {
					$dados = \admin\usuarios\cadastro\enviarSenha ( $senha, $email );
				}
			}
		} else {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\usuarios\cadastro\alterar ( $id_usuario, $_POST ["ativo"], $_POST ["data_cadastro"], $_POST ["email"], $_POST ["login"], $_POST ["nome_usuario"], $_POST ["senha"], $papeis, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			if (strtolower ( $enviaSenha ) == "on") {
				if ($senha == "" || $email == "") {
					$dados = header ( "HTTP/1.1 500 para enviar a senha &eacute; necess&aacute;rio preencher o valor de senha e e-mail" );
				} else {
					$dados = \admin\usuarios\cadastro\enviarSenha ( $senha, $email );
				}
			}
		}
		break;
	case "LISTAUNICO" :
		$usuario = \admin\usuarios\cadastro\listar($dbh, $id_usuario);
		if ($usuario === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}

		$papeisusuario = \admin\usuarios\cadastro\listaPapeisUsuario($id_usuario,$dbh);
		// cria o indice do array conforme o id da operacao
		$o = array ();
		foreach ( $papeisusuario as $op ) {
			$o [$op ["id_papel"]] = $op;
		}
		$usuario ["papeis"] = $o;
		// todos os papeis
		$papeis = \admin\usuarios\cadastro\listaPapeis ( $dbh );
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array (
				"usuario" => $usuario,
				"papeis" => $papeis
		) );
		break;
	case "LISTA" :
		$usuarios = \admin\usuarios\cadastro\listar ( $dbh );
		if ($usuarios === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$papeis = \admin\usuarios\cadastro\listaPapeis ( $dbh );
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array (
					"usuarios" => $usuarios,
					"papeis" => $papeis
			) );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\usuarios\cadastro\excluir ( $id_usuario, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		break;
	case "ENVIARSENHA" :
		if ($_POST ["senha"] == "" || $_POST ["email"] == "") {
			header ( "HTTP/1.1 500 erro ao enviar e-mail. Prrencha o valor de e-mail e senha" );
		} else {
			$retorna = \admin\usuarios\cadastro\enviarSenha ( $_POST ["senha"], $_POST ["email"] );
			if ($retorna === false) {
				header ( "HTTP/1.1 500 erro ao enviar e-mail $email" );
			} else {
				retornaJSON ( true );
			}
		}
		break;
	default :
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>