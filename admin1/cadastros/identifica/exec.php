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
	if (verificaOperacaoSessao ( "admin/html/identifica" ) == false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_i, publicado_i, abrir_i, nome_i, target_i from ".$esquemaadmin."i3geoadmin_identifica WHERE id_i = $id_i order by nome_i", $dbh, false );
		if ($dados == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$d = pegaDados ( "SELECT id_i, publicado_i, abrir_i, nome_i, target_i from ".$esquemaadmin."i3geoadmin_identifica order by nome_i", $dbh, false );
		if ($d == false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $d );
		break;
	case "EXCLUIR" :
		$retorna = excluir ( $id_i, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_i );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($publicado_i, $abrir_i, $nome_i, $target_i,$dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"publicado_i" => '',
			"nome_i" => '',
			"abrir_i" => '',
			"target_i" => ''
		);
		$id_i = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_identifica",$dataCol,"nome_i","id_i");
		$retorna = alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw);
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw) {
	global $esquemaadmin;
	if($convUTF){
		$nome_i = utf8_encode($nome_i);
	}
	$dataCol = array(
		"publicado_i" => $publicado_i,
		"nome_i" => $nome_i,
		"abrir_i" => $abrir_i,
		"target_i" => $target_i
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_identifica", $dataCol, "WHERE id_i = $id_i" );
	if ($resultado == false) {
		return false;
	}
	return $id_i;
}
function excluir($id_i, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_identifica", "id_i", $id_i, $dbhw, false );
	if ($resultado == false) {
		return false;
	}
	return $resultado;
}
?>
