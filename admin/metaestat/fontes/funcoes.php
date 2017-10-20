<?php
namespace admin\metaestat\fontes;
use PDOException;

function listar($dbh, $id_fonteinfo = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_fonteinfo != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_fonteinfo WHERE id_fonteinfo = $id_fonteinfo ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_fonteinfo order by lower(titulo)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($titulo, $link, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
				"titulo" => '',
				"link" => ''
		);
		$id_fonteinfo = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_fonteinfo", $dataCol, "titulo", "id_fonteinfo" );
		$retorna = \admin\metaestat\fontes\alterar ( $id_fonteinfo, $titulo, $link, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_fonteinfo, $titulo, $link, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$titulo = utf8_decode($titulo);
	}

	$dataCol = array (
			"titulo" => $titulo,
			"link" => $link
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_fonteinfo", $dataCol, "WHERE id_fonteinfo = $id_fonteinfo" );
	if ($resultado === false) {
		return false;
	}
	return $id_fonteinfo;
}
function excluir($id_fonteinfo, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_fonteinfo_medida where id_fonteinfo=$id_fonteinfo");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Essa fonte esta em uso por i3geoestat_fonteinfo_medida" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_fonteinfo", "id_fonteinfo", $id_fonteinfo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>