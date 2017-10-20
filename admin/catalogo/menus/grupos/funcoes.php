<?php
namespace admin\catalogo\menus\grupos {
    use PDOException;
	function listar($dbh, $id_menu = "", $id_n1){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		if($id_n1 != ""){
			$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo where id_n1 = $id_n1", $dbh, false);
			$dados = $dados[0];
		} else {
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT nome_grupo,i3geoadmin_grupos.id_grupo, id_n1, id_menu from ".$esquemaadmin."i3geoadmin_n1 LEFT JOIN ".$esquemaadmin."i3geoadmin_grupos ON i3geoadmin_n1.id_grupo = i3geoadmin_grupos.id_grupo WHERE id_menu='$id_menu' ORDER by ordem", $dbh, false );
		}
		if ($dados === false) {
			return false;
		} else {
			return $dados;
		}
	}
	function ordenar($id_menu, $ordem, $dbhw){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n1 WHERE id_menu = $id_menu", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n1 WHERE id_menu = $id_menu AND id_n1 IN (" . implode(",",$ordem). ")", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_n1","id_n1");
		return $resultado;
	}
	function adicionar( $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		try {
			$dataCol = array(
					"id_menu" => $id_menu,
					"publicado" => 'NAO',
					"ordem" => 0,
					"n1_perfil" => ''
			);
			$id_n1 = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n1",$dataCol,"n1_perfil","id_n1");
			$retorna = \admin\catalogo\menus\grupos\alterar ( $id_n1, $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw );
			return $retorna;
		} catch ( PDOException $e ) {
			return false;
		}
	}
	function alterar($id_n1, $id_grupo, $id_menu, $publicado, $n1_perfil, $ordem, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dataCol = array(
				"publicado" => $publicado,
				"id_grupo" => $id_grupo,
				"ordem" => $ordem,
				"n1_perfil" => $n1_perfil
		);
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n1",$dataCol,"WHERE id_n1 = $id_n1");
		if ($resultado === false) {
			return false;
		}
		return $id_n1;
	}
	function excluir($id_n1, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$r = \admin\php\funcoesAdmin\pegaDados("SELECT id_n2 from ".$esquemaadmin."i3geoadmin_n2 where id_n1 ='$id_n1'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os subgrupos primeiro" );
			exit ();
		}
		$r = \admin\php\funcoesAdmin\pegaDados("SELECT id_raiz from ".$esquemaadmin."i3geoadmin_raiz where nivel='1' and id_nivel ='$id_n1'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os temas na raiz do grupo primeiro" );
			exit ();
		}
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_n1", "id_n1", $id_n1, $dbhw, false );
		if ($resultado === false) {
			return false;
		}
		return $resultado;
	}
}
namespace admin\catalogo\menus\grupos\raiz {
    use PDOException;
	function listar($dbh, $id_raiz = "", $id_menu = ""){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		if($id_raiz != ""){
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_raiz, id_tema, ordem, perfil from ".$esquemaadmin."i3geoadmin_raiz WHERE id_raiz = $id_raiz ", $dbh, false );
			$dados = $dados[0];
		} else {
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_nivel,ordem,codigo_tema,id_raiz,i3geoadmin_raiz.id_tema, nome_tema FROM ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema  where i3geoadmin_raiz.nivel = 0 and i3geoadmin_raiz.id_menu = '$id_menu' order by ordem", $dbh, false );
		}
		if ($dados === false) {
			return false;
		} else {
			return $dados;
		}
	}
	function ordenar($id_menu, $ordem, $dbhw){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_raiz WHERE nivel = 0 AND id_menu = $id_menu", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_raiz WHERE nivel = 0 AND id_menu = $id_menu AND id_raiz IN (" . implode(",",$ordem). ")", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_raiz","id_raiz");
		return $resultado;
	}
	function adicionar($id_menu, $id_tema, $ordem, $perfil, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		try {
			$dataCol = array (
					"id_menu" => $id_menu,
					"id_nivel" => 0,
					"nivel" => 0,
					"ordem" => 0,
					"perfil" => ''
			);
			$id_raiz = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoadmin_raiz", $dataCol, "perfil", "id_raiz" );

			$retorna = \admin\catalogo\menus\grupos\raiz\alterar ( $id_raiz, $id_tema, $ordem, $perfil, $dbhw );

			return $retorna;
		} catch ( PDOException $e ) {
			return false;
		}
	}
	function alterar($id_raiz, $id_tema, $ordem, $perfil, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dataCol = array(
				"id_tema" => $id_tema,
				"perfil" => $perfil,
				"ordem" => $ordem
		);
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_raiz",$dataCol,"WHERE id_raiz = $id_raiz");
		$retorna = $id;
		if ($resultado === false) {
			return false;
		}
		return $id_raiz;
	}
	function excluir($id_raiz, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_raiz", "id_raiz", $id_raiz, $dbhw, false );
		if ($resultado === false) {
			return false;
		}
		return $resultado;
	}
}
?>