<?php
namespace admin\metaestat\periodos;
use PDOException;

function listar($dbh, $codigo_tipo_periodo = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($codigo_tipo_periodo != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_tipo_periodo WHERE codigo_tipo_periodo = $codigo_tipo_periodo ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_tipo_periodo", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome, $descricao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
				"nome" => '',
				"descricao" => ''
		);
		$codigo_tipo_periodo = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_tipo_periodo", $dataCol, "nome", "codigo_tipo_periodo" );
		$retorna = \admin\metaestat\periodos\alterar ( $codigo_tipo_periodo, $nome, $descricao, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($codigo_tipo_periodo, $nome, $descricao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
		$descricao = utf8_decode($descricao);
	}
	$dataCol = array (
			"nome" => $nome,
			"descricao" => $descricao
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_tipo_periodo", $dataCol, "WHERE codigo_tipo_periodo = $codigo_tipo_periodo" );
	if ($resultado === false) {
		return false;
	}
	return $codigo_tipo_periodo;
}
function excluir($codigo_tipo_periodo, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_tipo_periodo=$codigo_tipo_periodo");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Periodo esta em uso por i3geoestat_medida_variavel" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_tipo_periodo", "codigo_tipo_periodo", $codigo_tipo_periodo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>