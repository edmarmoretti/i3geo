<?php
namespace admin\catalogo\menus\grupos\subgrupos\listadesubgrupos;
use PDOException;
function listar($dbh, $id_subgrupo = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_subgrupo != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_subgrupos WHERE id_subgrupo = $id_subgrupo", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_subgrupo,nome_subgrupo from ".$esquemaadmin."i3geoadmin_subgrupos order by lower(nome_subgrupo)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"nome_subgrupo" => $nome_subgrupo,
				"desc_subgrupo" => "",
				"en" => "",
				"es" => "",
				"it" => ""
		);
		$id_subgrupo = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_subgrupos",$dataCol,"nome_subgrupo","id_subgrupo");
		$retorna = \admin\catalogo\menus\grupos\subgrupos\listadesubgrupos\alterar ( $id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_subgrupo, $nome_subgrupo, $desc_subgrupo, $en, $es, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
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
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_subgrupos", $dataCol, "WHERE id_subgrupo = $id_subgrupo" );
	if ($resultado === false) {
		return false;
	}
	return $id_subgrupo;
}
function excluir($id_subgrupo, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_n2 WHERE id_subgrupo = $id_subgrupo", $dbhw, false );
	if(count($dados) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Subgrupo em uso" );
	} else {
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_subgrupos", "id_subgrupo", $id_subgrupo, $dbhw, false );
		if ($resultado === false) {
			return false;
		}
	}
}
?>