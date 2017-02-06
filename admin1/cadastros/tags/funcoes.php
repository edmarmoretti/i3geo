<?php
namespace admin\cadastros\tags;
function adicionar($nome, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"nome" => ''
		);
		$id_tag = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_tags",$dataCol,"nome","id_tag");
		$retorna = alterar ( $id_tag, $nome,$dbhw );
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