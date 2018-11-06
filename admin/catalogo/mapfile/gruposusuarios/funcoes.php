<?php
namespace admin\catalogo\mapfile\gruposusuarios;
use PDOException;
function listar($dbh,$locaplic,$codigo){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if(empty($codigo)){
		$dbhw = null;
		$dbh = null;
		header ( "HTTP/1.1 500 erro codigo invalido" );
		exit ();
	}
	if(file_exists($locaplic."/temas/".$codigo.".map")){
		$sql = "
				select ".$esquemaadmin."i3geoadmin_temas.codigo_tema, ".$esquemaadmin."i3geousr_grupos.id_grupo,
				".$esquemaadmin."i3geousr_grupos.nome, ".$esquemaadmin."i3geousr_grupos.descricao,
				".$esquemaadmin."i3geousr_grupotema.id_tema
				from
				".$esquemaadmin."i3geoadmin_temas
                join ".$esquemaadmin."i3geousr_grupotema
                on ".$esquemaadmin."i3geoadmin_temas.id_tema = ".$esquemaadmin."i3geousr_grupotema.id_tema
                join ".$esquemaadmin."i3geousr_grupos
                on ".$esquemaadmin."i3geousr_grupotema.id_grupo = ".$esquemaadmin."i3geousr_grupos.id_grupo
                where codigo_tema = '".$codigo."' order by lower(nome)
			";
		$dados = \admin\php\funcoesAdmin\pegaDados ( $sql, $dbh, false );
	} else {
		$dbhw = null;
		$dbh = null;
		header ( "HTTP/1.1 500 erro mapfile nao existe" );
		exit ();
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($locaplic,$codigo,$id_grupo, $id_tema, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if(!file_exists($locaplic."/temas/".$codigo.".map")){
		$dbhw = null;
		$dbh = null;
		header ( "HTTP/1.1 500 erro mapfile nao existe" );
		exit ();
	}
	if(empty($id_grupo) || empty($id_tema)){
		header ( "HTTP/1.1 500 erro parametro invalido" );
		exit ();
	}
	$sql = "select * from ".$esquemaadmin."i3geousr_grupotema where id_tema = $id_tema and id_grupo = $id_grupo";
	$q = \admin\php\funcoesAdmin\pegaDados($sql, $dbh, false);
	if($q){
		if(count($q) != 0){
			header ( "HTTP/1.1 500 erro valor ja cadastrado" );
			exit ();
		}
	}
	try {
		$dataCol = array(
				"id_tema" => $id_tema,
				"id_grupo" => $id_grupo
		);
		$retorna = \admin\php\funcoesAdmin\i3GeoAdminInsert($dbhw,"i3geousr_grupotema",$dataCol);
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function excluir($id_tema, $id_grupo, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$sql = "DELETE from ".$esquemaadmin."i3geousr_grupotema where id_tema = ? and id_grupo = ? ";
		$prep = $dbhw->prepare($sql);
		$prep->execute(array($id_tema,$id_grupo));
		\admin\php\funcoesAdmin\i3GeoAdminInsertLog($dbhw,$sql,array($id_tema,$id_grupo));
		return true;
	} catch ( PDOException $e ) {
		return false;
	}
}

//apagar

function listaUsuarios($dbh){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_usuario, nome_usuario FROM " . $esquemaadmin . "i3geousr_usuarios WHERE ativo = 1 ORDER BY nome_usuario", $dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}
function listaGruposUsuario($id_grupo,$dbh){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT U.nome_usuario, U.id_usuario, UP.id_grupo FROM " . $esquemaadmin . "i3geousr_grupousuario AS UP JOIN " . $esquemaadmin . "i3geousr_usuarios AS U ON U.id_usuario = UP.id_usuario WHERE UP.id_grupo = $id_grupo", $dbh, false );
	if ($dados === false) {
		header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
		exit ();
	} else {
		return $dados;
	}
}

function alterar($id_grupo, $nome, $descricao, $usuarios, $dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if ($convUTF != true) {
		$nome = utf8_decode ( $nome );
		$descricao = utf8_decode ( $descricao );
	}
	$dataCol = array (
			"nome" => $nome,
			"descricao" => $descricao
	);

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geousr_grupos", $dataCol, "WHERE id_grupo = $id_grupo" );
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
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$dataCol = array (
			"id_usuario" => $id_usuario,
			"id_grupo" => $id_grupo
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminInsert ( $dbhw, "i3geousr_grupousuario", $dataCol );
	return $resultado;
}

function excluirUsuarios($id_grupo, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geousr_grupousuario", "id_grupo", $id_grupo, $dbhw, false );
	return $resultado;
}
?>