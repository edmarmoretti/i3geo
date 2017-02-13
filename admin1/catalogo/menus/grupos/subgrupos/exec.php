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

include_once (dirname ( __FILE__ ) . "/../../../../../admin/php/login.php");
if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../../../admin/php/conexao.php");
include ("funcoes.php");
$id_n1 = $_POST["id_n1"];
$id_n2 = $_POST["id_n2"];
$id_menu = $_POST["id_menu"];
$id_subgrupo = $_POST["id_subgrupo"];
testaSafeNumerico([$id_n1,$id_n2,$id_menu,$id_subgrupo]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ORDENA" :
		$ordem = explode(" ",$_POST["novaordem"]);
		$dados = \admin\catalogo\menus\grupos\subgrupos\ordenar($id_n1, $ordem, $dbhw);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao ordenar" );
		}
		retornaJSON ( $dados );
		break;
	case "ADICIONAR" :
		$novo = \admin\catalogo\menus\grupos\subgrupos\adicionar( $id_subgrupo, $id_n1, $_POST["publicado"], $_POST["n2_perfil"], $_POST["ordem"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\catalogo\menus\grupos\subgrupos\alterar ( $id_n2, $id_subgrupo, $id_menu, $publicado, $_POST["n2_perfil"], $_POST["ordem"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$dados = \admin\catalogo\menus\grupos\subgrupos\listar ($dbh,"",$id_n2);
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			retornaJSON($dados);
		}
		break;
	case "LISTA" :
		$subgrupos = \admin\catalogo\menus\grupos\subgrupos\listar ($dbh,$id_n1);
		if ($subgrupos === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		} else {
			$raiz = \admin\catalogo\menus\grupos\subgrupos\raiz\listar ($dbh,"",$id_n1, $id_menu);
			include ("../../../../cadastros/perfis/funcoes.php");
			$perfis = \admin\cadastros\perfis\listar( $dbh );
			include ("temas/funcoes.php");
			$temas = \admin\catalogo\menus\grupos\subgrupos\temas\todosTemas($dbh);
			include ("listadesubgrupos/funcoes.php");
			$tiposSubGrupos = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\listar ($dbh);
			$dbhw = null;
			$dbh = null;
			retornaJSON(array(
				"raiz"=>$raiz,
				"subgrupos"=>$subgrupos,
				"perfis"=>$perfis,
				"temas"=>$temas,
				"tiposSubGrupos"=>$tiposSubGrupos
			));
		}
		break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\menus\grupos\subgrupos\excluir ( $id_n2, $dbhw );
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
