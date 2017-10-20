<?php
namespace admin\cadastros\tags;
use PDOException;
function listar($dbh, $id_tag = ""){

    $esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_tag != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags WHERE id_tag = $id_tag ", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags order by lower(nome)", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"nome" => ''
		);
		$id_tag = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_tags",$dataCol,"nome","id_tag");
		$retorna = \admin\cadastros\tags\alterar ( $id_tag, $nome, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_tag, $nome, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
	}
	$dataCol = array(
			"nome" => $nome
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_tags", $dataCol, "WHERE id_tag = $id_tag" );
	if ($resultado === false) {
		return false;
	}
	return $id_tag;
}
function excluir($id_tag, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_tags", "id_tag", $id_tag, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>