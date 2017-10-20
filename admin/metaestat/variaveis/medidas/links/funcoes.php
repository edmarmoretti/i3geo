<?php
namespace admin\metaestat\variaveis\medidas\links;
use PDOException;

function listar($dbh, $id_medida_variavel, $id_link = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_link != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_medida_variavel_link WHERE id_link = $id_link ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_link, nome, link from " . $esquemaadmin . "i3geoestat_medida_variavel_link WHERE id_medida_variavel = $id_medida_variavel order by lower(nome)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($id_medida_variavel, $nome, $link,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"nome"=>'',
			"link"=>'',
			"id_medida_variavel"=>$id_medida_variavel
		);
		$id_link = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_medida_variavel_link", $dataCol, "nome", "id_link" );
		$retorna = \admin\metaestat\variaveis\medidas\links\alterar ( $id_medida_variavel, $id_link, $nome, $link, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_medida_variavel, $id_link, $nome, $link, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome = utf8_decode($nome);
	}
	$dataCol = array (
			"nome"=>$nome,
			"link"=>$link,
			"id_medida_variavel"=>$id_medida_variavel
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_medida_variavel_link", $dataCol, "WHERE id_link = $id_link" );
	if ($resultado === false) {
		return false;
	}
	return $id_medida_variavel;
}
function excluir($id_link, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_medida_variavel_link", "id_link", $id_link, $dbhw, false );
	return $resultado;
}
?>