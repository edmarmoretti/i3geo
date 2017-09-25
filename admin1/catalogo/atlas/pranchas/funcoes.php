<?php
namespace admin\catalogo\atlas\pranchas;
use PDOException;
function listar($dbh, $id_atlas = "",$id_prancha = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_prancha != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_atlas, id_prancha, titulo_prancha, ordem_prancha, desc_prancha, h_prancha, icone_prancha, link_prancha, mapext_prancha, w_prancha from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_prancha = '$id_prancha'", $dbh, false);
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_atlas, id_prancha, titulo_prancha from ".$esquemaadmin."i3geoadmin_atlasp WHERE id_atlas = '$id_atlas' ORDER by ordem_prancha", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}

function adicionar( $id_atlas, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
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
		$id_prancha = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlasp",$dataCol,"titulo_prancha","id_prancha");
		$retorna = \admin\catalogo\atlas\pranchas\alterar ( $id_atlas, $id_prancha, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_atlas, $id_prancha, $titulo_prancha, $ordem_prancha, $desc_prancha, $h_prancha, $icone_prancha, $link_prancha, $mapext_prancha, $w_prancha, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$desc_prancha = utf8_decode($desc_prancha);
		$titulo_prancha = utf8_decode($titulo_prancha);
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
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlasp", $dataCol, "WHERE id_prancha = $id_prancha AND id_atlas = $id_atlas" );
	if ($resultado === false) {
		return false;
	}
	return $id_atlas;
}
function excluir($id_prancha, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	include (dirname(__FILE__)."/temas/funcoes.php");
	$temas = \admin\catalogo\atlas\pranchas\temas\listar($dbhw,$id_prancha);
	if(count($temas) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Exclua os temas da prancha primeiro" );
		exit;
	} else {
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlasp", "id_prancha", $id_prancha, $dbhw, false );
		if ($resultado === false) {
			return false;
		} else {
			return $resultado;
		}
	}
}
?>