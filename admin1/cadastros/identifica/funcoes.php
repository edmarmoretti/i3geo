<?php
namespace admin\cadastros\identifica;
function listar($dbh, $id_i = ""){
	global $esquemaadmin;
	if($id_i != ""){
		$dados = pegaDados ( "SELECT id_i, publicado_i, abrir_i, nome_i, target_i from ".$esquemaadmin."i3geoadmin_identifica WHERE id_i = $id_i", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = pegaDados ( "SELECT id_i, nome_i from ".$esquemaadmin."i3geoadmin_identifica order by lower(nome_i)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($publicado_i, $abrir_i, $nome_i, $target_i,$dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"publicado_i" => '',
				"nome_i" => '',
				"abrir_i" => '',
				"target_i" => ''
		);
		$id_i = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_identifica",$dataCol,"nome_i","id_i");
		$retorna = \admin\cadastros\identifica\alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw);
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$nome_i = utf8_decode($nome_i);
	}
	$dataCol = array(
			"publicado_i" => $publicado_i,
			"nome_i" => $nome_i,
			"abrir_i" => $abrir_i,
			"target_i" => $target_i
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_identifica", $dataCol, "WHERE id_i = $id_i" );
	if ($resultado === false) {
		return false;
	}
	return $id_i;
}
function excluir($id_i, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_identifica", "id_i", $id_i, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>