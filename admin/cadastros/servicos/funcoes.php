<?php
namespace admin\cadastros\servicos;
use PDOException;
function listar($dbh, $id_ws = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_ws != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_ws,autor_ws,desc_ws,link_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws WHERE id_ws = $id_ws ", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_ws,nome_ws,tipo_ws from ".$esquemaadmin."i3geoadmin_ws order by lower (nome_ws)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
			"desc_ws" => '',
			"nome_ws" => '',
			"link_ws" => '',
			"autor_ws" => '',
			"tipo_ws" => '',
			"nacessos" => 0,
			"nacessosok" => 0
		);
		$id_ws = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_ws",$dataCol,"nome_ws","id_ws");
		$retorna = \admin\cadastros\servicos\alterar ( $id_ws,$autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_ws,$autor_ws,$desc_ws,$link_ws,$nome_ws,$tipo_ws,$dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$nome_ws = utf8_decode($nome_ws);
		$desc_ws = utf8_decode($desc_ws);
		$autor_ws = utf8_decode($autor_ws);
	}
	$dataCol = array(
			"desc_ws" => $desc_ws,
			"nome_ws" => $nome_ws,
			"link_ws" => $link_ws,
			"autor_ws" => $autor_ws,
			"tipo_ws" => $tipo_ws
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_ws", $dataCol, "WHERE id_ws = $id_ws" );
	if ($resultado === false) {
		return false;
	}
	return $id_ws;
}
function excluir($id_ws, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_ws", "id_ws", $id_ws, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>