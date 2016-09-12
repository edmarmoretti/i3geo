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

include_once (dirname ( __FILE__ ) . "/../../../../../../admin/php/login.php");
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
include (dirname ( __FILE__ ) . "/../../../../../../admin/php/conexao.php");

$id_subgrupo = $_POST["id_subgrupo"];
testaSafeNumerico([$id_subgrupo]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $_POST["nome_subgrupo"], $_POST["desc_subgrupo"], $_POST["en"], $_POST["es"], $dbhw );
		if ($novo === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_subgrupo, $_POST["nome_subgrupo"], $_POST["desc_subgrupo"], $_POST["en"], $_POST["es"], $dbhw );
		if ($novo === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos WHERE id_subgrupo = $id_subgrupo", $dbh, false );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $dados );
		exit ();
		break;
	case "LISTA" :
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos order by nome_subgrupo", $dbh, false );
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
		$r = pegaDados("select n2.id_subgrupo from ".$esquemaadmin."i3geoadmin_n3 as n3, ".$esquemaadmin."i3geoadmin_n2 as n2 where n2.id_n2 = n3.id_n3 and n2.id_subgrupo = '$id'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. O grupo esta em uso" );
			exit ();
		}
		$retorna = excluir ( $id_subgrupo, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_subgrupo );
		exit ();
		break;
}
cpjson ( $retorno );

// $papeis deve ser um array
function adicionar($nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"nome_subgrupo" => $nome_subgrupo,
			"desc_subgrupo" => "",
			"en" => "",
			"es" => "",
			"it" => ""
		);
		$id_subgrupo = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_subgrupos",$dataCol,"nome_subgrupo","id_subgrupo");
		$retorna = alterar ( $id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	global $convUTF, $esquemaadmin;
	if($convUTF){
		$nome_subgrupo = utf8_encode($nome_subgrupo);
		$desc_subgrupo = utf8_encode($desc_subgrupo);
		$en = utf8_encode($en);
		$es = utf8_encode($es);
	}
	$dataCol = array(
		"en" => $en,
		"es" => $es,
		"it" => '',
		"nome_subgrupo" => $nome_subgrupo,
		"desc_subgrupo" => $desc_subgrupo
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_subgrupos", $dataCol, "WHERE id_subgrupo = $id_subgrupo" );
	if ($resultado === false) {
		return false;
	}
	return $id_subgrupo;
}
function excluir($id_subgrupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_subgrupos", "id_subgrupo", $id_subgrupo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
