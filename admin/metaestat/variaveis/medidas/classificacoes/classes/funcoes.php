<?php
namespace admin\metaestat\variaveis\medidas\classificacoes\classes;
use PDOException;
function listar($dbh, $id_classificacao, $id_classe = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_classe != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_classes WHERE id_classe = $id_classe ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT titulo, id_classificacao, id_classe from " . $esquemaadmin . "i3geoestat_classes WHERE id_classificacao = $id_classificacao order by lower(titulo)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($id_classificacao, $titulo, $expressao, $azul, $verde, $vermelho, $tamanho, $simbolo, $otamanho, $oazul, $overde, $overmelho, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"id_classificacao"=>$id_classificacao,
			"titulo"=>'',
			"expressao"=>'',
			"azul"=>'',
			"verde"=>'',
			"vermelho"=>'',
			"tamanho"=>'',
			"simbolo"=>'',
			"otamanho"=>'',
			"oazul"=>'',
			"overde"=>'',
			"overmelho"=>''
		);
		$id_classe = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_classes", $dataCol, "titulo", "id_classe" );
		$retorna = \admin\metaestat\variaveis\medidas\classificacoes\classes\alterar ( $id_classe, $id_classificacao, $titulo, $expressao, $azul, $verde, $vermelho, $tamanho, $simbolo, $otamanho, $oazul, $overde, $overmelho, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_classe, $id_classificacao, $titulo, $expressao, $azul, $verde, $vermelho, $tamanho, $simbolo, $otamanho, $oazul, $overde, $overmelho, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$titulo = utf8_decode($titulo);
	}
	$dataCol = array (
			"id_classificacao"=>$id_classificacao,
			"titulo"=>$titulo,
			"expressao"=>$expressao,
			"azul"=>$azul,
			"verde"=>$verde,
			"vermelho"=>$vermelho,
			"tamanho"=>$tamanho,
			"simbolo"=>$simbolo,
			"otamanho"=>$otamanho,
			"oazul"=>$oazul,
			"overde"=>$overde,
			"overmelho"=>$overmelho
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_classes", $dataCol, "WHERE id_classe = $id_classe" );
	if ($resultado === false) {
		return false;
	}
	return $id_classe;
}
function excluir($id_classe, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_classes", "id_classe", $id_classe, $dbhw, false );
	return $resultado;
}
?>