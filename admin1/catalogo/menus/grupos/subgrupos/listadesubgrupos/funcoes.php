<?php
namespace admin\catalogo\menus\grupos\subgrupos\listadesubgrupos;
function listar($dbh, $id_subgrupo = ""){
	global $esquemaadmin;
	if($id_subgrupo != ""){
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos WHERE id_subgrupo = $id_subgrupo", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = pegaDados ( "SELECT id_subgrupo,nome_subgrupo from ".$esquemaadmin."i3geoadmin_subgrupos order by lower(nome_subgrupo)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"nome_subgrupo" => $nome_subgrupo,
				"desc_subgrupo" => "",
				"en" => "",
				"es" => "",
				"it" => ""
		);
		$id_subgrupo = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_subgrupos",$dataCol,"nome_subgrupo","id_subgrupo");
		$retorna = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\alterar ( $id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$nome_subgrupo = utf8_decode($nome_subgrupo);
		$desc_subgrupo = utf8_decode($desc_subgrupo);
		$en = utf8_decode($en);
		$es = utf8_decode($es);
	}
	$dataCol = array(
			"en" => $en,
			"es" => $es,
			"it" => '',
			"nome_subgrupo" => $nome_subgrupo,
			"desc_subgrupo" => $desc_subgrupo
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_subgrupos", $dataCol, "WHERE id_subgrupo = $id_subgrupo" );
	if ($resultado === false) {
		return false;
	}
	return $id_subgrupo;
}
function excluir($id_subgrupo, $dbhw) {
	global $esquemaadmin;
	$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_n2 WHERE id_subgrupo = $id_subgrupo", $dbhw, false );
	if(count($dados) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Subgrupo em uso" );
	} else {
		$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_subgrupos", "id_subgrupo", $id_subgrupo, $dbhw, false );
		if ($resultado === false) {
			return false;
		}
	}
}
?>