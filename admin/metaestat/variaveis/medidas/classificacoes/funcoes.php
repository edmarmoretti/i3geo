<?php
namespace admin\metaestat\variaveis\medidas\classificacoes;
use PDOException;

function listar($dbh, $id_medida_variavel, $id_classificacao = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_classificacao != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_classificacao WHERE id_classificacao = $id_classificacao ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT nome, observacao, id_classificacao from " . $esquemaadmin . "i3geoestat_classificacao WHERE id_medida_variavel = $id_medida_variavel order by lower(nome)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($id_medida_variavel, $nome, $observacao,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"nome"=>'',
			"observacao"=>'',
			"id_medida_variavel"=>$id_medida_variavel
		);
		$id_classificacao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_classificacao", $dataCol, "nome", "id_classificacao" );
		$retorna = \admin\metaestat\variaveis\medidas\classificacoes\alterar ( $id_medida_variavel, $id_classificacao, $nome, $observacao, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_medida_variavel, $id_classificacao, $nome, $observacao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
		$observacao = utf8_decode($observacao);
	}
	$dataCol = array (
			"nome"=>$nome,
			"observacao"=>$observacao,
			"id_medida_variavel"=>$id_medida_variavel
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_classificacao", $dataCol, "WHERE id_classificacao = $id_classificacao" );
	if ($resultado === false) {
		return false;
	}
	return $id_classificacao;
}
function excluir($id_classificacao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_classificacao", "id_classificacao", $id_classificacao, $dbhw, false );
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_classes", "id_classificacao", $id_classificacao, $dbhw, false );
	return $resultado;
}
?>