<?php
namespace admin\metaestat\variaveis\medidas\fontes;
use PDOException;

function listar($dbh, $id_medida_variavel) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT titulo,link,a.id_fonteinfo from " . $esquemaadmin . "i3geoestat_fonteinfo_medida as a JOIN " . $esquemaadmin . "i3geoestat_fonteinfo AS b ON a.id_fonteinfo = b.id_fonteinfo WHERE id_medida_variavel = $id_medida_variavel order by lower(titulo)", $dbh, false );
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($id_medida_variavel, $id_fonteinfo,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"id_medida_variavel"=>$id_medida_variavel,
			"id_fonteinfo"=>$id_fonteinfo
		);
		\admin\php\funcoesAdmin\i3GeoAdminInsert ( $dbhw, "i3geoestat_fonteinfo_medida", $dataCol );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function excluir($id_medida_variavel, $id_fonteinfo, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$tabela = $esquemaadmin . "i3geoestat_fonteinfo_medida";
	try {
		$sql = "DELETE from $tabela WHERE id_medida_variavel = ? AND id_fonteinfo = ?";
		$prep = $dbhw->prepare($sql);
		$prep->execute(array($id_medida_variavel,$id_fonteinfo));
	} catch ( PDOException $e ) {
		return false;
	}
	\admin\php\funcoesAdmin\i3GeoAdminInsertLog($dbhw,$sql,array($id_medida_variavel,$id_fonteinfo));
}
?>