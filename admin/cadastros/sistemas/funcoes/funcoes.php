<?php
namespace admin\cadastros\sistemas\funcoes;
use PDOException;
function listar($dbh, $id_sistema, $id_funcao = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_funcao != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemasf WHERE id_funcao = '$id_funcao'", $dbh, false);
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemasf where id_sistema = $id_sistema", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar( $id_sistema,$nome_funcao,$abrir_funcao,$h_funcao,$w_funcao,$perfil_funcao, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"nome_funcao" => '',
				"perfil_funcao" => '',
				"w_funcao" => '',
				"h_funcao" => '',
				"abrir_funcao" => '',
				"id_sistema" => $id_sistema
		);
		$id_funcao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_sistemasf",$dataCol,"nome_funcao","id_funcao");
		$retorna = \admin\cadastros\sistemas\funcoes\alterar ( $id_funcao,$nome_funcao,$abrir_funcao,$h_funcao,$w_funcao,$perfil_funcao, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_funcao,$nome_funcao,$abrir_funcao,$h_funcao,$w_funcao,$perfil_funcao, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$nome_funcao = utf8_decode($nome_funcao);
	}
	$dataCol = array(
			"nome_funcao" => $nome_funcao,
			"perfil_funcao" => $perfil_funcao,
			"w_funcao" => $w_funcao,
			"h_funcao" => $h_funcao,
			"abrir_funcao" => $abrir_funcao
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_sistemasf", $dataCol, "WHERE id_funcao = $id_funcao" );
	if ($resultado === false) {
		return false;
	}
	return $id_funcao;
}
function excluir($id_funcao, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_sistemasf", "id_funcao", $id_funcao, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>