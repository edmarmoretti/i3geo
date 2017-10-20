<?php
namespace admin\metaestat\unidades;
use PDOException;

function listar($dbh, $codigo_unidade_medida = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($codigo_unidade_medida != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_unidade_medida WHERE codigo_unidade_medida = $codigo_unidade_medida ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_unidade_medida", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome,$sigla,$permitesoma,$permitemedia, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
				"nome" => '',
				"sigla" => '',
				"permitesoma" => '',
				"permitemedia" => ''
		);
		$codigo_unidade_medida = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_unidade_medida", $dataCol, "nome", "codigo_unidade_medida" );
		$retorna = \admin\metaestat\unidades\alterar ( $codigo_unidade_medida,$nome,$sigla,$permitesoma,$permitemedia,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($codigo_unidade_medida, $nome, $sigla,$permitesoma,$permitemedia, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
	}
	$dataCol = array (
			"nome" => $nome,
			"sigla" => $sigla,
			"permitesoma" => $permitesoma,
			"permitemedia" => $permitemedia
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_unidade_medida", $dataCol, "WHERE codigo_unidade_medida = $codigo_unidade_medida" );
	if ($resultado === false) {
		return false;
	}
	return $codigo_unidade_medida;
}
function excluir($codigo_unidade_medida, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_unidade_medida=$codigo_unidade_medida");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Periodo esta em uso por i3geoestat_medida_variavel" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_unidade_medida", "codigo_unidade_medida", $codigo_unidade_medida, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>