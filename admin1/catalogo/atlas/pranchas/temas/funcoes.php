<?php
namespace admin\catalogo\atlas\pranchas\temas;
use PDOException;
function listar($dbh, $id_prancha = "", $id_tema = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_tema != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_tema, ordem_tema, codigo_tema, ligado_tema from ".$esquemaadmin."i3geoadmin_atlast WHERE id_tema = '$id_tema'", $dbh, false);
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT id_tema, codigo_tema from ".$esquemaadmin."i3geoadmin_atlast WHERE id_prancha = '$id_prancha' ORDER BY ordem_tema", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar( $id_prancha, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw ) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"ordem_tema"=>0,
				"codigo_tema"=>"",
				"ligado_tema"=>"",
				"id_prancha"=>$id_prancha
		);
		$id_tema = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_atlast",$dataCol,"codigo_tema","id_tema");
		$retorna = \admin\catalogo\atlas\pranchas\temas\alterar ( $id_tema, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_tema, $ordem_tema, $ligado_tema, $codigo_tema, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	//caso a atualizacao ocorra apos insert
	$dataCol = array(
			"ordem_tema"=>$ordem_tema,
			"codigo_tema"=>$codigo_tema,
			"ligado_tema"=>$ligado_tema
	);
	//caso registro ja exista
	if($codigo_tema == ""){
		$dataCol = array(
				"ordem_tema"=>$ordem_tema,
				"ligado_tema"=>$ligado_tema
		);
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_atlast", $dataCol, "WHERE id_tema = $id_tema" );
	if ($resultado === false) {
		return false;
	}
	return $id_tema;
}
function excluir($id_tema, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_atlast", "id_tema", $id_tema, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>