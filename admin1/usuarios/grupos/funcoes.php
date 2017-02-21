<?php
namespace admin\usuarios\grupos;
function listar($dbh, $id_grupo = ""){
	global $esquemaadmin;
	if($id_grupo != ""){
		$dados = pegaDados ( "SELECT id_grupo,nome,descricao from " . $esquemaadmin . "i3geousr_grupos WHERE id_grupo = $id_grupo", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = pegaDados ( "SELECT id_grupo,nome from " . $esquemaadmin . "i3geousr_grupos order by lower(nome)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function listaUsuarios($dbh){
	global $esquemaadmin;
	$dados = pegaDados ( "SELECT id_usuario, nome_usuario FROM " . $esquemaadmin . "i3geousr_usuarios WHERE ativo = 1 ORDER BY nome_usuario", dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function listaGruposUsuario($id_grupo,$dbh){
	global $esquemaadmin;
	$dados = pegaDados ( "SELECT U.nome_usuario, U.id_usuario, UP.id_grupo FROM " . $esquemaadmin . "i3geousr_grupousuario AS UP JOIN " . $esquemaadmin . "i3geousr_usuarios AS U ON U.id_usuario = UP.id_usuario WHERE UP.id_grupo = $id_grupo", dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function adicionar($nome, $descricao, $usuarios, $dbhw) {
	global $esquemaadmin;
	try {
		$dataCol = array (
				"nome" => '',
				"descricao" => ''
		);
		$id_grupo = i3GeoAdminInsertUnico ( $dbhw, "i3geousr_grupos", $dataCol, "nome", "id_grupo" );
		$retorna = \admin\usuarios\grupos\alterar ( $id_grupo, $nome, $descricao, $usuarios, $dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_grupo, $nome, $descricao, $usuarios, $dbhw) {
	global $convUTF, $esquemaadmin;
	if ($convUTF != true) {
		$nome = utf8_decode ( $nome );
		$descricao = utf8_decode ( $descricao );
	}
	$dataCol = array (
			"nome" => $nome,
			"descricao" => $descricao
	);

	$resultado = i3GeoAdminUpdate ( $dbhw, "i3geousr_grupos", $dataCol, "WHERE id_grupo = $id_grupo" );
	if ($resultado === false) {
		return false;
	}
	// apaga todos os papeis
	$resultado = \admin\usuarios\grupos\excluirUsuarios ( $id_grupo, $dbhw );
	if ($resultado === false) {
		return false;
	}
	if (! empty ( $usuarios )) {
		// atualiza papeis vinculados
		foreach ( $usuarios as $p ) {
			$resultado = \admin\usuarios\grupos\adicionaUsuario ( $id_grupo, $p, $dbhw );
			if ($resultado === false) {
				return false;
			}
		}
	}
	return $id_grupo;
}
function adicionaUsuario($id_grupo, $id_usuario, $dbhw) {
	global $esquemaadmin;
	$dataCol = array (
			"id_usuario" => $id_usuario,
			"id_grupo" => $id_grupo
	);
	$resultado = i3GeoAdminInsert ( $dbhw, "i3geousr_grupousuario", $dataCol );
	return $resultado;
}
function excluir($id_grupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geousr_grupos", "id_grupo", $id_grupo, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	$resultado = \admin\usuarios\grupos\excluirUsuarios ( $id_grupo, $dbhw );
	return $resultado;
}
function excluirUsuarios($id_grupo, $dbhw) {
	global $esquemaadmin;
	$resultado = i3GeoAdminExclui ( $esquemaadmin . "i3geousr_grupousuario", "id_grupo", $id_grupo, $dbhw, false );
	return $resultado;
}
?>