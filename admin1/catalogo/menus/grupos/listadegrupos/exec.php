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

include_once (dirname ( __FILE__ ) . "/../../../../../admin/php/login.php");
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
include (dirname ( __FILE__ ) . "/../../../../../admin/php/conexao.php");

$id_grupo = $_POST["id_grupo"];
testaSafeNumerico([$id_grupo]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $_POST["nome_grupo"], $_POST["desc_grupo"], $_POST["en"], $_POST["es"], $dbhw );
		if ($novo === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_grupo, $_POST["nome_grupo"], $_POST["desc_grupo"], $_POST["en"], $_POST["es"], $dbhw );
		if ($novo === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_grupos WHERE id_grupo = $id_grupo", $dbh, false );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_grupos order by nome_grupo", $dbh, false );
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
		$r = pegaDados("select n1.id_grupo from ".$esquemaadmin."i3geoadmin_n1 as n1, ".$esquemaadmin."i3geoadmin_n2 as n2 where n1.id_n1 = n2.id_n1 and n1.id_grupo = '$id_grupo'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. O grupo esta em uso" );
			exit ();
		}
		$retorna = excluir ( $id_grupo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_grupo );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($nome_grupo, $desc_grupo, $en, $es, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"nome_grupo" => $nome_grupo,
			"desc_grupo" => "",
			"en" => "",
			"es" => "",
			"it" => ""
		);
		$id_grupo = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_grupos",$dataCol,"nome_grupo","id_grupo");
		$retorna = alterar ( $id_grupo, $nome_grupo, $desc_grupo, $en, $es, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_grupo, $nome_grupo, $desc_grupo, $en, $es, $dbhw) {
	global $convUTF, $esquemaadmin;
	if($convUTF){
		$nome_grupo = utf8_encode($nome_grupo);
		$desc_grupo = utf8_encode($desc_grupo);
		$en = utf8_encode($en);
		$es = utf8_encode($es);
	}
	$dataCol = array(
		"en" => $en,
		"es" => $es,
		"it" => '',
		"nome_grupo" => $nome_grupo,
		"desc_grupo" => $desc_grupo
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_grupos", $dataCol, "WHERE id_grupo = $id_grupo" );
	if ($resultado === false) {
		return false;
	}
	return $id_grupo;
}
function excluir($id_grupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_grupos", "id_grupo", $id_grupo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
