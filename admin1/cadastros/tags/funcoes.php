<?php
namespace admin\cadastros\tags;
function listar($dbh, $id_tag = ""){
	global $esquemaadmin;
	if($id_tag != ""){
		$dados = pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags WHERE id_tag = $id_tag ", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = pegaDados ( "SELECT id_tag, nome from ".$esquemaadmin."i3geoadmin_tags order by lower(nome)", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"nome" => ''
		);
		$id_tag = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_tags",$dataCol,"nome","id_tag");
		$retorna = \admin\cadastros\tags\alterar ( $id_tag, $nome, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_tag, $nome, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$nome = utf8_decode($nome);
	}
	$dataCol = array(
			"nome" => $nome
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_tags", $dataCol, "WHERE id_tag = $id_tag" );
	if ($resultado === false) {
		return false;
	}
	return $id_tag;
}
function excluir($id_tag, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_tags", "id_tag", $id_tag, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>