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
		"EXCLUIR",
		"LISTA",
		"LISTAUNICO"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/sistemas" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");

$id = $_POST["id"];
$id_sistema = $_POST["id_sistema"];
$id_funcao = $_POST["id_funcao"];

testaSafeNumerico([$id,$id_sistema,$id_funcao]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $_POST["publicado_sistema"],$_POST["nome_sistema"],$_POST["perfil_sistema"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_sistema, $_POST["publicado_sistema"],$_POST["nome_sistema"],$_POST["perfil_sistema"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT *  from ".$esquemaadmin."i3geoadmin_sistemas WHERE id_sistema = $id_sistema ", $dbh, false );

		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTAUNICO" :
		$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas WHERE id_sistema = $id_sistema", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de sistemas" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados[0]) );
		break;
	case "LISTA" :
		$dados = pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas ORDER BY lower(nome_sistema)", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de atlas" );
			exit ();
		}
		$perfis = pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by perfil", $dbh, false );
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados, "perfis"=>$perfis) );
		break;
	case "EXCLUIR" :
		$funcoes = pegaDados("SELECT id_sistema from ".$esquemaadmin."i3geoadmin_sistemasf where id_sistema = '$id_sistema'");
		if(count($funcoes) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua as funcoes do sistema primeiro" );
			exit ();
		}
		$retorna = excluir ( $id_sistema, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_sistema );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"publicado_sistema" => '',
				"nome_sistema" => '',
				"perfil_sistema" => ''
		);
		$id_sistema = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_sistemas",$dataCol,"nome_sistema","id_sistema");
		$retorna = alterar ( $id_sistema,$publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_sistema,$publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$nome_sistema = utf8_decode($nome_sistema);
	}
	$dataCol = array(
			"publicado_sistema" => $publicado_sistema,
			"nome_sistema" => $nome_sistema,
			"perfil_sistema" => $perfil_sistema
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_sistemas", $dataCol, "WHERE id_sistema = $id_sistema" );
	if ($resultado === false) {
		return false;
	}
	return $id_sistema;
}
function excluir($id_sistema, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_sistemas", "id_sistema", $id_sistema, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
