<?php
namespace admin\catalogo\menus\grupos\listadegrupos;
function listar($dbh, $id_grupo = ""){
	global $esquemaadmin;
	if($id_grupo != ""){
		$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_grupos WHERE id_grupo = $id_grupo", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = pegaDados ( "SELECT id_grupo,nome_grupo from ".$esquemaadmin."i3geoadmin_grupos order by lower(nome_grupo)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome_grupo, $desc_grupo, $en, $es, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array(
				"nome_grupo" => $nome_grupo,
				"desc_grupo" => "",
				"en" => "",
				"es" => "",
				"it" => ""
		);
		$id_grupo = i3GeoAdminInsertUnico($dbhw,"i3geoadmin_grupos",$dataCol,"nome_grupo","id_grupo");
		$retorna = \admin\catalogo\menus\grupos\listadegrupos\alterar ( $id_grupo, $nome_grupo, $desc_grupo, $en, $es, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_grupo, $nome_grupo, $desc_grupo, $en, $es, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true){
		$nome_grupo = utf8_decode($nome_grupo);
		$desc_grupo = utf8_decode($desc_grupo);
		$en = utf8_decode($en);
		$es = utf8_decode($es);
	}
	$dataCol = array(
			"en" => $en,
			"es" => $es,
			"it" => '',
			"nome_grupo" => $nome_grupo,
			"desc_grupo" => $desc_grupo
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_grupos", $dataCol, "WHERE id_grupo = $id_grupo" );
	if ($resultado === false) {
		return false;
	}
	return $id_grupo;
}
function excluir($id_grupo, $dbhw) {
	global $esquemaadmin;
	$dados = pegaDados ( "SELECT * from ".$esquemaadmin."i3geoadmin_n WHERE id_grupo = $id_grupo", $dbhw, false );
	if(count($dados) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Grupo em uso" );
	} else {
		$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_grupos", "id_grupo", $id_grupo, $dbhw, false );
		if ($resultado === false) {
			return false;
		}
	}
}
?>