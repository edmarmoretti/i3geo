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
if (verificaOperacaoSessao ( "admin/html/mapas" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
include ("funcoes.php");
$id_mapa = $_POST ["id_mapa"];
testaSafeNumerico ( [
		$id_mapa
] );

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = \admin\catalogo\mapas\adicionar ( $_POST ["publicado_mapa"], $_POST ["ordem_mapa"], $_POST ["perfil_mapa"], $_POST ["ligados_mapa"], $_POST ["temas_mapa"], $_POST ["desc_mapa"], $_POST ["ext_mapa"], $_POST ["imagem_mapa"], $_POST ["linkdireto_mapa"], $_POST ["nome_mapa"], $_POST ["outros_mapa"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "ALTERAR" :
		$novo = \admin\catalogo\mapas\alterar ( $id_mapa, $_POST ["publicado_mapa"], $_POST ["ordem_mapa"], $_POST ["perfil_mapa"], $_POST ["ligados_mapa"], $_POST ["temas_mapa"], $_POST ["desc_mapa"], $_POST ["ext_mapa"], $_POST ["imagem_mapa"], $_POST ["linkdireto_mapa"], $_POST ["nome_mapa"], $_POST ["outros_mapa"], $_POST ["mapfile"], $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		}
		break;
	case "LISTAUNICO" :
		$mapfile = \admin\catalogo\mapas\listar($dbh, $id_mapa);
		if ($mapfile === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de mapas" );
		} else {
			include ("../../cadastros/perfis/funcoes.php");
			$perfis = \admin\cadastros\perfis\listar( $dbh );
			$dbhw = null;
			$dbh = null;
			// pega a lista de temas
			include ("../../../admin/php/classe_arvore.php");
			$arvore = new Arvore ( $locaplic );
			$temas = $arvore->pegaTodosTemas ( true );
			retornaJSON ( array (
					"dados" => $mapfile,
					"perfis" => $perfis,
					"temas" => $temas
			) );
		}
		break;
		case "LISTA" :
			$mapfile = \admin\catalogo\mapas\listar($dbh);
			if ($mapfile === false) {
				$dbhw = null;
				$dbh = null;
				header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de mapas" );
			} else {
				include ("../../cadastros/perfis/funcoes.php");
				$perfis = \admin\cadastros\perfis\listar( $dbh );
				$dbhw = null;
				$dbh = null;
				// pega a lista de temas
				include ("../../../admin/php/classe_arvore.php");
				$arvore = new Arvore ( $locaplic );
				$temas = $arvore->pegaTodosTemas ( true );
				retornaJSON ( array (
						"dados" => $mapfile,
						"perfis" => $perfis,
						"temas" => $temas
				) );
			}
			break;
	case "EXCLUIR" :
		$retorna = \admin\catalogo\mapas\excluir ( $id_mapa, $dbhw );
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
