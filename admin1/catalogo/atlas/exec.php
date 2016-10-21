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
	if (verificaOperacaoSessao ( "admin/html/atlas" ) === false) {
		header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
		exit ();
	}
}
include (dirname ( __FILE__ ) . "/../../../admin/php/conexao.php");

$id = $_POST["id"];
$id_atlas = $_POST["id_atlas"];
$id_prancha = $_POST["id_prancha"];

testaSafeNumerico([$id,$id_atlas,$id_prancha]);

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "ADICIONAR" :
		$novo = adicionar( $_POST["titulo_atlas"], $_POST["publicado_atlas"], $_POST["ordem_atlas"], $_POST["basemapfile_atlas"], $_POST["desc_atlas"], $_POST["h_atlas"], $_POST["w_atlas"], $_POST["icone_atlas"], $_POST["link_atlas"], $_POST["pranchadefault_atlas"], $_POST["template_atlas"], $_POST["tipoguias_atlas"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		exit ();
		break;
	case "ALTERAR" :
		$novo = alterar ( $id_atlas, $_POST["titulo_atlas"], $_POST["publicado_atlas"], $_POST["ordem_atlas"], $_POST["basemapfile_atlas"], $_POST["desc_atlas"], $_POST["h_atlas"], $_POST["w_atlas"], $_POST["icone_atlas"], $_POST["link_atlas"], $_POST["pranchadefault_atlas"], $_POST["template_atlas"], $_POST["tipoguias_atlas"], $dbhw );
		if ($novo === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$dados = pegaDados ( "SELECT id_atlas  from ".$esquemaadmin."i3geoadmin_atlas WHERE id_atlas = $id_atlas ", $dbh, false );

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
		$dados = pegaDados("SELECT id_atlas, titulo_atlas, publicado_atlas, ordem_atlas, basemapfile_atlas, desc_atlas, h_atlas, w_atlas, icone_atlas,  link_atlas, pranchadefault_atlas, template_atlas, tipoguias_atlas from ".$esquemaadmin."i3geoadmin_atlas WHERE id_atlas = $id_atlas", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de atlas" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados[0]) );
		break;
	case "LISTA" :
		$dados = pegaDados("SELECT id_atlas, titulo_atlas, ordem_atlas from ".$esquemaadmin."i3geoadmin_atlas ORDER BY lower(titulo_atlas), ordem_atlas", $dbh, false);
		if ($dados === false) {
			$dbhw = null;
			$dbh = null;
			header ( "HTTP/1.1 500 erro ao consultar banco de dados tabela de atlas" );
			exit ();
		}
		$dbhw = null;
		$dbh = null;
		retornaJSON ( array("dados"=>$dados) );
		break;
	case "EXCLUIR" :
		$pranchas = pegaDados("SELECT id_prancha from ".$esquemaadmin."i3geoadmin_atlasp where id_atlas = '$id_atlas'");
		if(count($pranchas) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua as pranchas do atlas primeiro" );
			exit ();
		}
		$retorna = excluir ( $id_atlas, $dbhw );
		$dbhw = null;
		$dbh = null;
		if ($retorna === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSON ( $id_atlas );
		exit ();
		break;
}
cpjson ( $retorno );

function adicionar( $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
			"publicado_atlas"=>'',
			"basemapfile_atlas"=>'',
			"desc_atlas"=>'',
			"h_atlas"=>null,
			"w_atlas"=>null,
			"icone_atlas"=>'',
			"link_atlas"=>'',
			"pranchadefault_atlas"=>'',
			"template_atlas"=>'',
			"tipoguias_atlas"=>'',
			"ordem_atlas"=>0,
			"titulo_atlas"=>''
		);
		$id_atlas = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlas",$dataCol,"titulo_atlas","id_atlas");
		$retorna = alterar ( $id_atlas, $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_atlas, $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$desc_atlas = utf8_encode($desc_atlas);
		$titulo_atlas = utf8_encode($titulo_atlas);
	}
	$dataCol = array(
			"publicado_atlas"=>$publicado_atlas,
			"ordem_atlas"=>$ordem_atlas == "" ? 0 : $ordem_atlas,
			"basemapfile_atlas"=>$basemapfile_atlas,
			"desc_atlas"=>$desc_atlas,
			"h_atlas"=>$h_atlas == "" ? 0 : $h_atlas,
			"w_atlas"=>$w_atlas == "" ? 0 : $w_atlas,
			"icone_atlas"=>$icone_atlas,
			"link_atlas"=>$link_atlas,
			"pranchadefault_atlas"=>$pranchadefault_atlas,
			"template_atlas"=>$template_atlas,
			"tipoguias_atlas"=>$tipoguias_atlas,
			"titulo_atlas"=>$titulo_atlas
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlas", $dataCol, "WHERE id_atlas = $id_atlas" );
	if ($resultado === false) {
		return false;
	}
	return $id_atlas;
}
function excluir($id_atlas, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlas", "id_atlas", $id_atlas, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>
