<?php
namespace admin\catalogo\menus\grupos\subgrupos {
    use PDOException;
	function listar($dbh, $id_n1 = "", $id_n2){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		if($id_n2 != ""){
			$dados = \admin\php\funcoesAdmin\pegaDados("SELECT * from ".$esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo where id_n2 = '$id_n2'", $dbh, false);
			$dados = $dados[0];
		} else {
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT  id_n2,i3geoadmin_n2.id_subgrupo,nome_subgrupo,ordem from ".$esquemaadmin."i3geoadmin_n2 LEFT JOIN ".$esquemaadmin."i3geoadmin_subgrupos ON i3geoadmin_n2.id_subgrupo = i3geoadmin_subgrupos.id_subgrupo WHERE id_n1 = '$id_n1' ORDER by ordem", $dbh, false );
		}
		if ($dados === false) {
			return false;
		} else {
			return $dados;
		}
	}
	function ordenar($id_n1, $ordem, $dbhw){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n2 WHERE id_n1 = '$id_n1'", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_n2 WHERE id_n1 = $id_n1 AND id_n2 IN (" . implode(",",$ordem). ")", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_n2","id_n2");
		return $resultado;
	}
	function adicionar( $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		try {
			$dataCol = array(
					"id_n1" => $id_n1,
					"publicado" => 'NAO',
					"ordem" => 0,
					"n2_perfil" => ''
			);
			$id_n2 = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_n2",$dataCol,"n2_perfil","id_n2");
			$retorna = \admin\catalogo\menus\grupos\subgrupos\alterar ( $id_n2, $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw );
			return $retorna;
		} catch ( PDOException $e ) {
			return false;
		}
	}
	// $papeis deve ser um array
	function alterar($id_n2, $id_subgrupo, $id_n1, $publicado, $n2_perfil, $ordem, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dataCol = array(
				"publicado" => $publicado,
				"id_subgrupo" => $id_subgrupo,
				"ordem" => $ordem,
				"n2_perfil" => $n2_perfil
		);
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n2",$dataCol,"WHERE id_n2 = $id_n2");
		if ($resultado === false) {
			return false;
		}
		return $id_n2;
	}
	function excluir($id_n2, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$r = \admin\php\funcoesAdmin\pegaDados("SELECT id_n3 from ".$esquemaadmin."i3geoadmin_n3 where id_n2 ='$id_n2'");
		if(count($r) > 0){
			header ( "HTTP/1.1 500 erro ao excluir. Exclua os subgrupos primeiro" );
			exit;
		} else {
			$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_n2", "id_n2", $id_n2, $dbhw, false );
			if ($resultado === false) {
				return false;
			}
			return $resultado;
		}
	}
}
namespace admin\catalogo\menus\grupos\subgrupos\raiz {
    use PDOException;
	function listar($dbh, $id_raiz = "", $id_n1 = "", $id_menu = ""){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		if($id_raiz != ""){
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_raiz, id_tema, ordem, perfil from ".$esquemaadmin."i3geoadmin_raiz WHERE id_raiz = '$id_raiz' ", $dbh, false );
			$dados = $dados[0];
		} else {
			$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_nivel,ordem,codigo_tema,id_raiz,i3geoadmin_raiz.id_tema, nome_tema FROM ".$esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema  where i3geoadmin_raiz.nivel = 1 and i3geoadmin_raiz.id_menu = '$id_menu' and i3geoadmin_raiz.id_nivel = '$id_n1' order by ordem", $dbh, false );
		}
		if ($dados === false) {
			return false;
		} else {
			return $dados;
		}
	}
	function ordenar($id_n1, $ordem, $dbhw){
		$esquemaadmin = $_SESSION["esquemaadmin"];
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_raiz WHERE nivel = 1 AND id_nivel = '$id_n1'", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro numero de registros nao batem" );
			exit ();
		}
		//verifica se os ids existem no mesmo nivel
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT ordem from ".$esquemaadmin."i3geoadmin_raiz WHERE nivel = 1 AND id_nivel = '$id_n1' AND id_raiz IN (" . implode(",",$ordem). ")", $dbhw, false );
		if(count($dados) != count($ordem)){
			header ( "HTTP/1.1 500 erro ids nao batem" );
			exit ();
		}
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminOrdena($dbhw,$ordem,"i3geoadmin_raiz","id_raiz");
		return $resultado;
	}
	function adicionar($id_menu, $id_n1, $id_tema, $ordem, $perfil, $dbhw) {
		$esquemaadmin = $_SESSION["esquemaadmin"];
		try {
			$dataCol = array (
					"id_menu" => $id_menu,
					"id_nivel" => $id_n1,
					"nivel" => 1,
					"ordem" => 0,
					"perfil" => ''
			);
			$id_raiz = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoadmin_raiz", $dataCol, "perfil", "id_raiz" );
			$retorna = \admin\catalogo\menus\grupos\subgrupos\raiz\alterar ( $id_raiz, $id_tema, $ordem, $perfil, $dbhw );
			return $retorna;
		} catch ( PDOException $e ) {
			return false;
		}
	}
	// $papeis deve ser um array
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