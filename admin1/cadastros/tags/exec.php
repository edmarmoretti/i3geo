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
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");

//remove espaco em branco do nome do tag
$nome = str_replace(" ","",$nome);
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $nome, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_tag, $nome, $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags order by nome", $dbh, false );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$dados = pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags order by nome", $dbh, false );
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_tag, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_tag );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($nome, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"nome" => ''
		);
		$id_tag = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_tags",$dataCol,"nome","id_tag");
		$retorna = alterar ( $id_tag, $nome,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_tag, $nome,$dbhw) {
	global $esquemaadmin;
	if($convUTF){
		$nome = utf8_encode($nome);
	}
	$dataCol = array(
		"nome" => $nome
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_tags", $dataCol, "WHERE id_tag = $id_tag" );
	if ($resultado === false) {
		return false;
	}
	return $id_tag;
}
function excluir($id_tag, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_tags", "id_tag", $id_tag, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
