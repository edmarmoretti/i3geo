<?php
//
//Executa as operacoes para um grupo de um menu
//
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

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");
include ("funcoes.php");
$id_menu = $_POST["id_menu"];
$id_n1 = $_POST["id_n1"];
$id_grupo = $_POST["id_grupo"];
testaSafeNumerico([$id_menu,$id_n1, $id_grupo]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ORDENA" :
		$ordem = explode(" ",$_POST["novaordem"]);
		$dados = \admin\catalogo\menus\grupos\ordenar($id_menu, $ordem, $dbhw);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao ordenar" );
		}
		retornaJSON ( $dados );
		break;
	case "ADICIONAR" :
		$novo = \admin\catalogo\menus\grupos\adicionar( $id_grupo, $id_menu, $_POST["publicado"], $_POST["n1_perfil"], $_POST["ordem"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\catalogo\menus\grupos\alterar ( $id_n1, $id_grupo, $id_menu, $_POST["publicado"], $_POST["n1_perfil"], $_POST["ordem"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$dados = \admin\catalogo\menus\grupos\listar ($dbh,"",$id_n1);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			retornaJSON($dados);
		}
		break;
	case "LISTA" :
		$grupos = \admin\catalogo\menus\grupos\listar ($dbh,$id_menu);
		if ($grupos === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$raiz = \admin\catalogo\menus\grupos\raiz\listar ($dbh,"",$id_menu);
			include ("../../../cadastros/perfis/funcoes.php");
			$perfis = \admin\cadastros\perfis\listar( $dbh );
			include ("subgrupos/temas/funcoes.php");
			$temas = \admin\catalogo\menus\grupos\subgrupos\temas\todosTemas($dbh);
			include ("listadegrupos/funcoes.php");
			$tiposGrupos = \admin\catalogo\menus\grupos\listadegrupos\listar ($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON(array(
					"raiz"=>$raiz,
					"grupos"=>$grupos,
					"perfis"=>$perfis,
					"temas"=>$temas,
					"tiposGrupos"=>$tiposGrupos
			));
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\menus\grupos\excluir ( $id_n1, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	default:
		header ( "HTTP/1.1 500 erro funcao nao existe" );
		break;
}
?>
