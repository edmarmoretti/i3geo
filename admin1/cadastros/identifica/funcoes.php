<?php
namespace admin\cadastros\identifica;
use PDOException;
function listar($dbh, $id_i = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_i != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_i, publicado_i, abrir_i, nome_i, target_i from ".$esquemaadmin."i3geoadmin_identifica WHERE id_i = $id_i", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_i, nome_i from ".$esquemaadmin."i3geoadmin_identifica order by lower(nome_i)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($publicado_i, $abrir_i, $nome_i, $target_i,$dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"publicado_i" => '',
				"nome_i" => '',
				"abrir_i" => '',
				"target_i" => ''
		);
		$id_i = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_identifica",$dataCol,"nome_i","id_i");
		$retorna = \admin\cadastros\identifica\alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw);
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_i, $publicado_i, $abrir_i, $nome_i, $target_i, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$nome_i = utf8_decode($nome_i);
	}
	$dataCol = array(
			"publicado_i" => $publicado_i,
			"nome_i" => $nome_i,
			"abrir_i" => $abrir_i,
			"target_i" => $target_i
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_identifica", $dataCol, "WHERE id_i = $id_i" );
	if ($resultado === false) {
		return false;
	}
	return $id_i;
}
function excluir($id_i, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_identifica", "id_i", $id_i, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>