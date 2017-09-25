<?php
namespace admin\metaestat\conexoes;
use PDOException;

function listar($dbh, $codigo_estat_conexao = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($codigo_estat_conexao != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT codigo_estat_conexao, bancodedados, host, porta, usuario from " . $esquemaadmin . "i3geoestat_conexao WHERE codigo_estat_conexao = $codigo_estat_conexao ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT codigo_estat_conexao, bancodedados from " . $esquemaadmin . "i3geoestat_conexao", $dbh, false );
		// $dados = array_merge($dados,\admin\metaestat\conexoes\conexoesMsConfigura());
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($bancodedados, $host, $porta, $usuario, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
				"bancodedados" => '',
				"host" => '',
				"porta" => '',
				"usuario" => '',
				"senha" => ''
		);
		$codigo_estat_conexao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_conexao", $dataCol, "bancodedados", "codigo_estat_conexao" );
		$retorna = \admin\metaestat\conexoes\alterar ( $codigo_estat_conexao, $bancodedados, $host, $porta, $usuario, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($codigo_estat_conexao, $bancodedados, $host, $porta, $usuario, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$dataCol = array (
			"bancodedados" => $bancodedados,
			"host" => $host,
			"porta" => $porta,
			"usuario" => $usuario
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_conexao", $dataCol, "WHERE codigo_estat_conexao = $codigo_estat_conexao" );
	if ($resultado === false) {
		return false;
	}
	return $codigo_estat_conexao;
}
function excluir($codigo_estat_conexao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_estat_conexao=$codigo_estat_conexao");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Essa conexao esta em uso por i3geoestat_medida_variavel" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_conexao", "codigo_estat_conexao", $codigo_estat_conexao, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>