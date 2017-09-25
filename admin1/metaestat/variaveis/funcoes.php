<?php
namespace admin\metaestat\variaveis;
use PDOException;

function listar($dbh, $codigo_variavel = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($codigo_variavel != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_variavel WHERE codigo_variavel = $codigo_variavel ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_variavel order by lower(nome)", $dbh, false );
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
			"nome"=>'',
			"descricao"=>''
		);
		$codigo_variavel = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_variavel", $dataCol, "nome", "codigo_variavel" );
		$retorna = \admin\metaestat\variaveis\alterar ( $codigo_variavel, $nome, $descricao, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($codigo_variavel, $nome, $descricao,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
		$descricao = utf8_decode($descricao);
	}
	$dataCol = array (
		"nome"=>$nome,
		"descricao"=>$descricao
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_variavel", $dataCol, "WHERE codigo_variavel = $codigo_variavel" );
	if ($resultado === false) {
		return false;
	}
	return $codigo_tipo_regiao;
}
function excluir($codigo_variavel, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_variavel=$codigo_variavel");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Variavel esta em uso por i3geoestat_medida_variavel" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_variavel", "codigo_variavel", $codigo_variavel, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>