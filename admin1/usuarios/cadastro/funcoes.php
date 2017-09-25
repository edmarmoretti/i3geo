<?php
namespace admin\usuarios\cadastro;
use PDOException;

function listar($dbh, $id_usuario = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_usuario != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_usuario,ativo,data_cadastro,email,login,nome_usuario from " . $esquemaadmin . "i3geousr_usuarios WHERE id_usuario = $id_usuario order by nome_usuario", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_usuario,nome_usuario from " . $esquemaadmin . "i3geousr_usuarios order by lower(nome_usuario)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function listaPapeis($dbh){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geousr_papeis order by nome", $dbh );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function listaPapeisUsuario($id_usuario,$dbh){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT P.id_papel, P.nome, P.descricao, UP.id_usuario FROM " . $esquemaadmin . "i3geousr_papelusuario AS UP JOIN " . $esquemaadmin . "i3geousr_papeis AS P ON UP.id_papel = P.id_papel WHERE UP.id_usuario = $id_usuario ", $dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function enviarSenha( $senha, $email ){
	$to      = $email;
	$subject = 'senha i3geo criada em '. date('l jS \of F Y h:i:s A');
	$message = $senha;
	return mail($to, $subject, $message);
}
// $papeis deve ser um array
function adicionar($ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];

	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geousr_usuarios WHERE login = '". $login . "'", $dbhw, false );
	if (count($dados) > 0) {
		header ( "HTTP/1.1 403 login ja existe" );
		exit ();
	}

	try {
		$dataCol = array(
			"nome_usuario" => '',
			"login" => '',
			"email" => '',
			"ativo" => 0,
			"data_cadastro" => '',
			"senha" => ''
		);
		$id_usuario = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geousr_usuarios", $dataCol, "nome_usuario", "id_usuario" );
		$data_cadastro = date('l jS \of F Y h:i:s A');
		$retorna = \admin\usuarios\cadastro\alterar ( $id_usuario, $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
// $papeis deve ser um array
function alterar($id_usuario, $ativo, $data_cadastro, $email, $login, $nome_usuario, $senha, $papeis, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true) {
		$nome_usuario = utf8_decode ( $nome_usuario );
	}
	$dataCol = array (
			"nome_usuario" => $nome_usuario,
			"login" => $login,
			"email" => $email,
			"ativo" => $ativo
	);
	// se a senha foi enviada, ela sera trocada
	if ($senha != "") {
		if(!function_exists("password_hash")){
			$dataCol ["senha"] = md5 ( $senha );
		} else {
			$dataCol["senha"] = password_hash($senha, PASSWORD_DEFAULT);
		}
	}
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geousr_usuarios", $dataCol, "WHERE id_usuario = $id_usuario" );
	if ($resultado === false) {
		return false;
	}
	// apaga todos os papeis
	$resultado = \admin\usuarios\cadastro\excluirPapeis ( $id_usuario, $dbhw );
	if ($resultado === false) {
		return false;
	}
	if (! empty ( $papeis )) {
		// atualiza papeis vinculados
		foreach ( $papeis as $p ) {
			$resultado = \admin\usuarios\cadastro\adicionaPapel ( $id_usuario, $p, $dbhw );
			if ($resultado === false) {
				return false;
			}
		}
	}
	return $id_usuario;
}
function adicionaPapel($id_usuario, $id_papel, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dataCol = array (
			"id_usuario" => $id_usuario,
			"id_papel" => $id_papel
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminInsert ( $dbhw, "i3geousr_papelusuario", $dataCol );
	return $resultado;
}
function excluir($id_usuario, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geousr_usuarios", "id_usuario", $id_usuario, $dbhw, false );
	$resultado = \admin\usuarios\cadastro\excluirPapeis ( $id_usuario, $dbhw );
	return $resultado;
}
function excluirPapeis($id_usuario, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geousr_papelusuario", "id_usuario", $id_usuario, $dbhw, false );
	return $resultado;
}
?>