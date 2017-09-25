<?php
namespace admin\usuarios\operacoes;
use PDOException;
function listar($dbh, $id_operacao = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_operacao != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_operacao,codigo,descricao from " . $esquemaadmin . "i3geousr_operacoes where id_operacao = $id_operacao order by codigo", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_operacao,codigo,descricao from " . $esquemaadmin . "i3geousr_operacoes order by codigo", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function listaPapeis($dbh){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geousr_papeis order by nome", $dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function listaPapeisOperacao($dbh,$id_operacao){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT P.id_papel, P.nome, P.descricao,OP.id_operacao FROM " . $esquemaadmin . "i3geousr_operacoespapeis  AS OP JOIN " . $esquemaadmin . "i3geousr_papeis AS P ON OP.id_papel = P.id_papel WHERE OP.id_operacao = $id_operacao ", $dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function adicionar($codigo,$descricao,$papeis,$dbhw){
	$esquemaadmin = $_SESSION["esquemaadmin"];

	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geousr_operacoes WHERE codigo = '". $codigo . "'", $dbhw, false );
	if (count($dados) > 0) {
		header ( "HTTP/1.1 403 operacao ja existe" );
		exit ();
	}

	try{
		$dataCol = array(
				"descricao" => ''
		);
		$id_operacao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geousr_operacoes",$dataCol,"descricao","id_operacao");
		$retorna = \admin\usuarios\operacoes\alterar($id_operacao,$codigo,$descricao,$papeis,$dbhw);
		return $retorna;
	}
	catch (PDOException $e){
		return false;
	}
}
//$papeis deve ser um array
function alterar($id_operacao,$codigo,$descricao,$papeis,$dbhw){
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true){
		$descricao = utf8_decode($descricao);
	}
	$dataCol = array(
			"codigo" => $codigo,
			"descricao" => $descricao
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geousr_operacoes",$dataCol,"WHERE id_operacao = $id_operacao");
	if($resultado === false){
		return false;
	}
	//apaga todos os papeis
	$resultado = \admin\usuarios\operacoes\excluirPapeis($id_operacao,$dbhw);
	if($resultado === false){
		return false;
	}
	if(!empty($papeis)){
		//atualiza papeis vinculados
		foreach($papeis as $p){
			$resultado = \admin\usuarios\operacoes\adicionaPapel($id_operacao,$p,$dbhw);
			if($resultado === false){
				return false;
			}
		}
	}
	return $id_operacao;
}
function adicionaPapel($id_operacao,$id_papel,$dbhw){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dataCol = array(
			"id_operacao" => $id_operacao,
			"id_papel" => $id_papel
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminInsert($dbhw,"i3geousr_operacoespapeis",$dataCol);
	return $resultado;
}
function excluir($id_operacao,$dbhw){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui($esquemaadmin."i3geousr_operacoes","id_operacao",$id_operacao,$dbhw,false);
	if($resultado === false){
		return false;
	}
	if($resultado === true){
		$resultado = \admin\usuarios\operacoes\excluirPapeis($id_operacao,$dbhw);
	}
	return $resultado;
}
function excluirPapeis($id_operacao,$dbhw){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui($esquemaadmin."i3geousr_operacoespapeis","id_operacao",$id_operacao,$dbhw,false);
	return $resultado;
}
?>