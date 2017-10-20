<?php
namespace admin\cadastros\sistemas;
use PDOException;
function listar($dbh, $id_sistema = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_sistema != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas WHERE id_sistema = $id_sistema", $dbh, false);
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_sistemas ORDER BY lower(nome_sistema)", $dbh, false);
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar( $publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"publicado_sistema" => '',
				"nome_sistema" => '',
				"perfil_sistema" => ''
		);
		$id_sistema = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_sistemas",$dataCol,"nome_sistema","id_sistema");
		$retorna = \admin\cadastros\sistemas\alterar ( $id_sistema,$publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_sistema,$publicado_sistema,$nome_sistema,$perfil_sistema, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$nome_sistema = utf8_decode($nome_sistema);
	}
	$dataCol = array(
			"publicado_sistema" => $publicado_sistema,
			"nome_sistema" => $nome_sistema,
			"perfil_sistema" => $perfil_sistema
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_sistemas", $dataCol, "WHERE id_sistema = $id_sistema" );
	if ($resultado === false) {
		return false;
	}
	return $id_sistema;
}
function excluir($id_sistema, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	include (dirname(__FILE__)."/funcoes/funcoes.php");
	$funcoes = \admin\cadastros\sistemas\funcoes\listar ( $dbhw, $id_sistema );
	if(count($funcoes) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Exclua as funcoes do sistema primeiro" );
		exit;
	}
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_sistemas", "id_sistema", $id_sistema, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
?>