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
$id_grupo = $_POST ["id_grupo"];
testaSafeNumerico ( [
		$id_usuario,
		$id_grupo
] );

$funcao = strtoupper ( $funcao );
// converte os parametros de definicao dos papeis em um array
if ($funcao == "ADICIONAR" || $funcao == "ALTERAR") {
	$usuarios = array ();
	foreach ( array_keys ( $_POST ) as $k ) {
		$teste = explode ( "-", $k );
		if ($teste [0] == "id_usuario") {
			$usuarios [] = $teste [1] * 1;
		}
	}
	array_unique ( $usuarios );
}
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\usuarios\grupos\adicionar ( $_POST ["nome"], $_POST ["descricao"], $usuarios, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\usuarios\grupos\alterar ( $id_grupo, $_POST ["nome"], $_POST ["descricao"], $usuarios, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$grupo = \admin\usuarios\grupos\listar($dbh, $id_grupo);
		if ($grupo === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$gruposusuarios = \admin\usuarios\grupos\listaGruposUsuario($id_grupo,$dbh);
			$o = array ();
			foreach ( $gruposusuarios as $gp ) {
				$o [$gp ["id_usuario"]] = $gp;
			}
			$grupo ["usuarios"] = $o;
			$usuarios = \admin\usuarios\grupos\listaUsuarios($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array (
					"grupo" => $grupo,
					"usuarios" => $usuarios
			) );
		}
		break;
	case "LISTA" :
		$grupos = \admin\usuarios\grupos\listar($dbh);
		if ($grupos === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$usuarios = \admin\usuarios\grupos\listaUsuarios($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array (
					"grupos" => $grupos,
					"usuarios" => $usuarios
			) );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\usuarios\grupos\excluir ( $id_grupo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	default :
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>