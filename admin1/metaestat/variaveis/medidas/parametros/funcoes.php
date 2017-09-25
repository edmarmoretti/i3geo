<?php
namespace admin\metaestat\variaveis\medidas\parametros;
use PDOException;

function listar($dbh, $id_medida_variavel, $id_parametro_medida = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_parametro_medida != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_parametro_medida WHERE id_parametro_medida = $id_parametro_medida ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_parametro_medida, nome from " . $esquemaadmin . "i3geoestat_parametro_medida WHERE id_medida_variavel = $id_medida_variavel order by lower(nome)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($id_medida_variavel, $coluna, $nome, $descricao, $id_pai, $tipo ,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"coluna"=>'',
			"nome"=>'',
			"descricao"=>'',
			"id_pai"=>'',
			"tipo"=>'',
			"id_medida_variavel"=>$id_medida_variavel
		);
		$id_parametro_medida = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_parametro_medida", $dataCol, "nome", "id_parametro_medida" );
		$retorna = \admin\metaestat\variaveis\medidas\parametros\alterar ( $id_medida_variavel, $id_parametro_medida, $coluna, $nome, $descricao, $id_pai, $tipo, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_medida_variavel, $id_parametro_medida, $coluna, $nome, $descricao, $id_pai, $tipo ,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
		$descricao = utf8_decode($descricao);
	}
	$dataCol = array (
		"coluna"=>$coluna,
		"nome"=>$nome,
		"descricao"=>$descricao,
		"id_pai"=>$id_pai,
		"tipo"=>$tipo,
		"id_medida_variavel"=>$id_medida_variavel
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_parametro_medida", $dataCol, "WHERE id_parametro_medida = $id_parametro_medida" );
	if ($resultado === false) {
		return false;
	}
	return $id_parametro_medida;
}
function excluir($id_parametro_medida, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_parametro_medida", "id_parametro_medida", $id_parametro_medida, $dbhw, false );
	return $resultado;
}
?>