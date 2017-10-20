<?php
namespace admin\catalogo\atlas;
use PDOException;
function listar($dbh, $id_atlas = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_atlas != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_atlas, titulo_atlas, publicado_atlas, ordem_atlas, basemapfile_atlas, desc_atlas, h_atlas, w_atlas, icone_atlas,  link_atlas, pranchadefault_atlas, template_atlas, tipoguias_atlas from ".$esquemaadmin."i3geoadmin_atlas WHERE id_atlas = $id_atlas", $dbh, false);
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_atlas, titulo_atlas, ordem_atlas from ".$esquemaadmin."i3geoadmin_atlas ORDER BY lower(titulo_atlas), ordem_atlas", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar( $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
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
		$id_atlas = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlas",$dataCol,"titulo_atlas","id_atlas");
		$retorna = \admin\catalogo\atlas\alterar ( $id_atlas, $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_atlas, $titulo_atlas, $publicado_atlas, $ordem_atlas, $basemapfile_atlas, $desc_atlas, $h_atlas, $w_atlas, $icone_atlas, $link_atlas, $pranchadefault_atlas, $template_atlas, $tipoguias_atlas, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$desc_atlas = utf8_decode($desc_atlas);
		$titulo_atlas = utf8_decode($titulo_atlas);
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
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlas", $dataCol, "WHERE id_atlas = $id_atlas" );
	if ($resultado === false) {
		return false;
	}
	return $id_atlas;
}
function excluir($id_atlas, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	include (dirname(__FILE__)."/pranchas/funcoes.php");
	$pranchas = \admin\catalogo\atlas\pranchas\listar($dbhw,$id_atlas);
	if(count($pranchas) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Exclua as pranchas primeiro" );
		exit;
	} else {
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlas", "id_atlas", $id_atlas, $dbhw, false );
		if ($resultado === false) {
			return false;
		} else {
			return $resultado;
		}
	}
}
?>