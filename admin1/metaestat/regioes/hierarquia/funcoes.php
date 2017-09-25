<?php
namespace admin\metaestat\regioes\hierarquia;
use PDOException;

function listar($dbh, $codigo_tipo_regiao, $id_agregaregiao = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_agregaregiao != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * FROM " . $esquemaadmin . "i3geoestat_agregaregiao WHERE id_agregaregiao = $id_agregaregiao", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT i3geoestat_agregaregiao.*,n.nome_tipo_regiao AS nome_tipo_regiao_pai from " . $esquemaadmin . "i3geoestat_agregaregiao LEFT JOIN " . $esquemaadmin . "i3geoestat_tipo_regiao AS n ON n.codigo_tipo_regiao =  i3geoestat_agregaregiao.codigo_tipo_regiao_pai WHERE i3geoestat_agregaregiao.codigo_tipo_regiao = $codigo_tipo_regiao ORDER BY colunaligacao_regiaopai", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($codigo_tipo_regiao, $colunaligacao_regiaopai, $codigo_tipo_regiao_pai,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
				"codigo_tipo_regiao" => '',
				"colunaligacao_regiaopai" => '',
				"codigo_tipo_regiao_pai" => ''
		);
		$id_agregaregiao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_agregaregiao", $dataCol, "colunaligacao_regiaopai", "id_agregaregiao" );
		$retorna = \admin\metaestat\regioes\hierarquia\alterar ( $id_agregaregiao, $codigo_tipo_regiao, $colunaligacao_regiaopai, $codigo_tipo_regiao_pai,$dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_agregaregiao, $codigo_tipo_regiao, $colunaligacao_regiaopai, $codigo_tipo_regiao_pai,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$dataCol = array (
			"codigo_tipo_regiao" => $codigo_tipo_regiao,
			"colunaligacao_regiaopai" => $colunaligacao_regiaopai,
			"codigo_tipo_regiao_pai" => $codigo_tipo_regiao_pai
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_agregaregiao", $dataCol, "WHERE id_agregaregiao = $id_agregaregiao" );
	if ($resultado === false) {
		return false;
	}
	return $id_agregaregiao;
}
function excluir($id_agregaregiao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_agregaregiao", "id_agregaregiao", $id_agregaregiao, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>