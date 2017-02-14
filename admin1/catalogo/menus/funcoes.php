<?php

namespace admin\catalogo\menus;

function listar($dbh, $id_menu = "") {
	global $esquemaadmin;
	if ($id_menu != "") {
		$dados = pegaDados ( "SELECT id_menu, publicado_menu, perfil_menu, aberto, desc_menu, nome_menu, es, en from ".$esquemaadmin."i3geoadmin_menus WHERE id_menu = $id_menu ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = pegaDados ( "SELECT id_menu, nome_menu from ".$esquemaadmin."i3geoadmin_menus order by lower(nome_menu)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array (
				"en" => "",
				"es" => "",
				"it" => "",
				"publicado_menu" => "",
				"aberto" => "SIM",
				"nome_menu" => "",
				"desc_menu" => "",
				"perfil_menu" => ""
		);
		$id_menu = i3GeoAdminInsertUnico ( $dbhw, "i3geoadmin_menus", $dataCol, "nome_menu", "id_menu" );
		$retorna = \admin\catalogo\menus\alterar ( $id_menu, $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_menu, $publicado_menu, $perfil_menu, $aberto, $desc_menu, $nome_menu, $es, $en, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true) {
		$nome_menu = utf8_decode ( $nome_menu );
		$desc_menu = utf8_decode ( $desc_menu );
		$en = utf8_decode ( $en );
		$es = utf8_decode ( $es );
		$perfil_menu = utf8_decode ( $perfil_menu );
	}
	$perfil_menu = str_replace ( ",", " ", trim ( $perfil_menu ) );
	$dataCol = array (
			"en" => $en,
			"es" => $es,
			"it" => '',
			"publicado_menu" => $publicado_menu,
			"aberto" => $aberto,
			"nome_menu" => $nome_menu,
			"desc_menu" => $desc_menu,
			"perfil_menu" => $perfil_menu
	);
	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geoadmin_menus", $dataCol, "WHERE id_menu = $id_menu" );
	if ($resultado === false) {
		return false;
	}
	return $id_menu;
}
function excluir($id_menu, $dbhw) {
	global $esquemaadmin;
	$r = pegaDados("select * from ".$esquemaadmin."i3geoadmin_n1 where id_menu=$id_menu");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Exclua os grupos primeiro" );
		exit ();
	}
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_menus", "id_menu", $id_menu, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>