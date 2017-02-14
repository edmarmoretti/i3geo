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
if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
include ("funcoes.php");
$id_menu = $_POST["id_menu"];
testaSafeNumerico([$id_menu]);

if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\catalogo\menus\adicionar( $_POST["publicado_menu"], $_POST["perfil_menu"], $_POST["aberto"], $_POST["desc_menu"], $_POST["nome_menu"], $_POST["es"], $_POST["en"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\catalogo\menus\alterar ( $id_menu, $_POST["publicado_menu"], $_POST["perfil_menu"], $_POST["aberto"], $_POST["desc_menu"], $_POST["nome_menu"], $_POST["es"], $_POST["en"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$dados = \admin\catalogo\menus\listar($dbh, $id_menu);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			include ("../../cadastros/perfis/funcoes.php");
			$perfis = \admin\cadastros\perfis\listar( $dbh );
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array("dados"=>$dados, "perfis"=>$perfis) );
		}
		break;
	case "LISTA" :
		$dados = \admin\catalogo\menus\listar($dbh);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			include ("../../cadastros/perfis/funcoes.php");
			$perfis = \admin\cadastros\perfis\listar( $dbh );
			$dbhw = null;
			$dbh = null;
			retornaJSON ( array("dados"=>$dados, "perfis"=>$perfis) );
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\menus\excluir ( $id_menu, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		break;
	default:
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>
