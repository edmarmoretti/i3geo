<?php
//
//executa as operacoes para os temas na reiz de um menu
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
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		if (empty ( $id_tema ) || empty ( $id_menu )) {
			header ( "HTTP/1.1 500 erro nos parametros" );
			exit ();
		}
		$novo = adicionar ( $id_menu, $id_tema, $ordem, $perfil, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_raiz, $id_tema, $ordem, $perfil, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_raiz from " . $esquemaadmin . "i3geoadmin_raiz WHERE id_raiz = $id_raiz", $dbh, false );

		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		exit ();
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_raiz, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_raiz );
		exit ();
		break;
}
cpjson ( $retorno );
function adicionar($id_menu, $id_tema, $ordem, $perfil, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array (
				"id_menu" => $id_menu,
				"id_nivel" => 0,
				"nivel" => 0,
				"ordem" => 0,
				"perfil" => ''
		);
		$id_raiz = i3GeoAdminInsertUnico ( $dbhw, "i3geoadmin_raiz", $dataCol, "perfil", "id_raiz" );

		$retorna = alterar ( $id_raiz, $id_tema, $ordem, $perfil, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_raiz, $id_tema, $ordem, $perfil, $dbhw) {
	global $esquemaadmin;

	$dataCol = array(
			"id_tema" => $id_tema,
			"perfil" => $perfil,
			"ordem" => $ordem
	);
	$resultado = i3GeoAdminUpdate($dbhw,"i3geoadmin_raiz",$dataCol,"WHERE id_raiz = $id_raiz");
	$retorna = $id;
	if ($resultado === false) {
		return false;
	}
	return $id_raiz;
}
function excluir($id_raiz, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_raiz", "id_raiz", $id_raiz, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
