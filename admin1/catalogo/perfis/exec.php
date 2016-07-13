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
	if (verificaOperacaoSessao ( "admin/html/arvore" ) == false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");
if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $perfil, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_perfil, $perfil, $dbhw );
		if ($novo == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbh, false );
		if ($dados == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$dados = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbh, false );
		if ($dados == false) {
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
		$retorna = excluir ( $id_perfil, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna == false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_perfil );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($perfil, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"perfil" => ''
		);
		$id_perfil = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_perfis",$dataCol,"perfil","id_perfil");
		$retorna = alterar ( $id_perfil, $perfil,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_perfil, $perfil,$dbhw) {
	global $esquemaadmin;
	if($convUTF){
		$perfil = utf8_encode($perfil);
	}
	$dataCol = array(
		"perfil" => $perfil
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_perfis", $dataCol, "WHERE id_perfil = $id_perfil" );
	if ($resultado == false) {
		return false;
	}
	return $id_perfil;
}
function excluir($id_perfil, $dbhw) {
	global $esquemaadmin;
	//pega o nome conforme o ID
	$dados = pegaDados ( "SELECT perfil from ".$esquemaadmin."i3geoadmin_perfis WHERE id_perfil = $id_perfil", $dbh, false );
	$perfil = $dados[0]["perfil];
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_perfis", "id_perfil", $id_perfil, $dbhw, false );
	if ($resultado == false) {
		return false;
	}
	return $resultado;
}
?>
