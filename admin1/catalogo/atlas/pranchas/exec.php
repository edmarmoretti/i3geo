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

include_once (dirname ( __FILE__ ) . "/../../../../admin/php/login.php");
$funcoesEdicao = array (
		"ADICIONAR",
		"ALTERAR",
		"EXCLUIR",
		"LISTA",
		"LISTAUNICO"
);
if (in_array ( strtoupper ( $funcao ), $funcoesEdicao )) {
	if (verificaOperacaoSessao ( "admin/html/atlas" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../../admin/php/conexao.php");

$id = $_POST["id"];
$id_atlas = $_POST["id_atlas"];
$id_prancha = $_POST["id_prancha"];

testaSafeNumerico([$id,$id_atlas,$id_prancha]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $id_atlas, $_POST["titulo_prancha"], $_POST["ordem_prancha"], $_POST["desc_prancha"], $_POST["h_prancha"], $_POST["icone_prancha"], $_POST["link_prancha"], $_POST["mapext_prancha"], $_POST["w_prancha"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_atlas, $id_prancha, $_POST["titulo_prancha"], $_POST["ordem_prancha"], $_POST["desc_prancha"], $_POST["h_prancha"], $_POST["icone_prancha"], $_POST["link_prancha"], $_POST["mapext_prancha"], $_POST["w_prancha"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_prancha from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_prancha = $id_prancha", $dbh, false );

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
		$dados = pegaDados("SELECT id_atlas, id_prancha, titulo_prancha, ordem_prancha, desc_prancha, h_prancha, icone_prancha, link_prancha, mapext_prancha, w_prancha from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_prancha = '$id_prancha'", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de pranchas" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados[0]) );
		break;
	case "LISTA" :
		$dados = pegaDados("SELECT id_atlas, id_prancha, titulo_prancha from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_atlas = '$id_atlas' ORDER by ordem_prancha", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de pranchas" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados) );
		break;
	case "EXCLUIR" :
		$temas = pegaDados("SELECT id_tema from ".$esquemaadmin."i3geoadmin_atlast where id_prancha = '$id_prancha'");
		if(count($temas) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os temas da prancha primeiro" );
			exit ();
		}
		$retorna = excluir ( $id_prancha, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_prancha );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $id_atlas, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"ordem_prancha"=>0,
			"mapext_prancha"=>'',
			"desc_prancha"=>'',
			"h_prancha"=>$h_prancha == "" ? 0 : $h_prancha,
			"w_prancha"=>$w_prancha == "" ? 0 : $w_prancha,
			"icone_prancha"=>'',
			"link_prancha"=>'',
			"titulo_prancha"=>'',
			"id_atlas"=>$id_atlas
		);
		$id_prancha = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlasp",$dataCol,"titulo_prancha","id_prancha");
		$retorna = alterar ( $id_atlas, $id_prancha, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_atlas, $id_prancha, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw) {
	global $convUTF, $esquemaadmin;
	if($convUTF){
		$desc_prancha = utf8_encode($desc_prancha);
		$titulo_prancha = utf8_encode($titulo_prancha);
	}
	$dataCol = array(
			"ordem_prancha"=>$ordem_prancha,
			"mapext_prancha"=>$mapext_prancha,
			"desc_prancha"=>$desc_prancha,
			"h_prancha"=>$h_prancha == "" ? 0 : $h_prancha,
			"w_prancha"=>$w_prancha == "" ? 0 : $w_prancha,
			"icone_prancha"=>$icone_prancha,
			"link_prancha"=>$link_prancha,
			"titulo_prancha"=>$titulo_prancha
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlasp", $dataCol, "WHERE id_prancha = $id_prancha AND id_atlas = $id_atlas" );
	if ($resultado === false) {
		return false;
	}
	return $id_atlas;
}
function excluir($id_prancha, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlasp", "id_prancha", $id_prancha, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
