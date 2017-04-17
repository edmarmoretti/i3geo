<?php
namespace admin\metaestat\variaveis\medidas;

function listar($dbh, $codigo_variavel, $id_medida_variavel = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_medida_variavel != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_medida_variavel WHERE id_medida_variavel = $id_medida_variavel ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_medida_variavel,nomemedida from " . $esquemaadmin . "i3geoestat_medida_variavel WHERE codigo_variavel = $codigo_variavel order by lower(nomemedida)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"codigo_unidade_medida"=>'',
			"codigo_tipo_periodo"=>'',
			"codigo_variavel"=>'',
			"codigo_tipo_regiao"=>'',
			"codigo_estat_conexao"=>'',
			"esquemadb"=>'',
			"tabela"=>'',
			"colunavalor"=>'',
			"colunaidgeo"=>'',
			"filtro"=>'',
			"nomemedida"=>'',
			"colunaidunico"=>''
		);
		$id_medida_variavel = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_medida_variavel", $dataCol, "nomemedida", "id_medida_variavel" );
		$retorna = \admin\metaestat\variaveis\medidas\alterar ( $id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nomemedida = utf8_decode($nomemedida);
	}
	$dataCol = array (
			"codigo_unidade_medida"=>$codigo_unidade_medida,
			"codigo_tipo_periodo"=>$codigo_tipo_periodo,
			"codigo_variavel"=>$codigo_variavel,
			"codigo_tipo_regiao"=>$codigo_tipo_regiao,
			"codigo_estat_conexao"=>$codigo_estat_conexao,
			"esquemadb"=>$esquemadb,
			"tabela"=>$tabela,
			"colunavalor"=>$colunavalor,
			"colunaidgeo"=>$colunaidgeo,
			"filtro"=>$filtro,
			"nomemedida"=>$nomemedida,
			"colunaidunico"=>$colunaidunico
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_medida_variavel", $dataCol, "WHERE id_medida_variavel = $id_medida_variavel" );
	if ($resultado === false) {
		return false;
	}
	return $id_medida_variavel;
}
function excluir($id_medida_variavel, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_medida_variavel", "id_medida_variavel", $id_medida_variavel, $dbhw, false );

	if (!$resultado === false) {
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_medida_variavel_link", "id_medida_variavel", $id_medida_variavel, $dbhw, false );
	}
	return $resultado;
}
?>