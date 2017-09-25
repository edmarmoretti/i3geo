<?php
namespace admin\cadastros\perfis;
use PDOException;
function listar($dbh, $id_perfil = ""){
	$esquemaadmin = $_SESSION["esquemaadmin"];
	if($id_perfil != ""){
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis WHERE id_perfil = $id_perfil", $dbh, false );
		$dados = $dados[0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_perfil, perfil from ".$esquemaadmin."i3geoadmin_perfis order by lower(perfil)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}

function adicionar($perfil, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	try {
		$dataCol = array(
				"perfil" => ''
		);
		$id_perfil = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico($dbhw,"i3geoadmin_perfis",$dataCol,"perfil","id_perfil");
		$retorna = \admin\cadastros\perfis\alterar ( $id_perfil, $perfil,$dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_perfil, $perfil,$dbhw) {
	$convUTF = $_SESSION["convUTF"];
	$esquemaadmin = $_SESSION["esquemaadmin"];
	//pega o nome conforme o ID
	$original = \admin\php\funcoesAdmin\pegaDados ( "SELECT perfil from ".$esquemaadmin."i3geoadmin_perfis WHERE id_perfil = $id_perfil", $dbh, false );
	$original = $original[0]["perfil"];

	if ($convUTF != true){
		$perfil = utf8_decode($perfil);
	}
	$dataCol = array(
			"perfil" => $perfil
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoadmin_perfis", $dataCol, "WHERE id_perfil = $id_perfil" );
	if ($resultado === false) {
		return false;
	}

	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_mapas WHERE perfil_mapa != ''");
	foreach($q as $row){
		$t = $row['perfil_mapa'];
		$i = $row['id_mapa'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_mapa" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_mapas",$dataCol,"WHERE id_mapa = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_menus WHERE perfil_menu != ''");
	foreach($q as $row){
		$t = $row['perfil_menu'];
		$i = $row['id_menu'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_menu" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_menus",$dataCol,"WHERE id_menu = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n1 WHERE n1_perfil != ''");
	foreach($q as $row){
		$t = $row['n1_perfil'];
		$i = $row['id_n1'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n1_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n1",$dataCol,"WHERE id_n1 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n2 WHERE n2_perfil != ''");
	foreach($q as $row){
		$t = $row['n2_perfil'];
		$i = $row['id_n2'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n2_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n2",$dataCol,"WHERE id_n2 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n3 WHERE n3_perfil != ''");
	foreach($q as $row){
		$t = $row['n3_perfil'];
		$i = $row['id_n3'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n3_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n3",$dataCol,"WHERE id_n3 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_raiz WHERE perfil != ''");
	foreach($q as $row){
		$t = $row['perfil'];
		$i = $row['id_raiz'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_raiz",$dataCol,"WHERE id_raiz = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_sistemas WHERE perfil_sistema != ''");
	foreach($q as $row)
	{
		$t = $row['perfil_sistema'];
		$i = $row['id_sistema'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_sistema" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_sistemas",$dataCol,"WHERE id_sistema = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_sistemasf WHERE perfil_funcao != ''");
	foreach($q as $row){
		$t = $row['perfil_funcao'];
		$i = $row['id_funcao'];
		$ts = trim(str_replace(" ".$original." ",$perfil," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_funcao" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_sistemasf",$dataCol,"WHERE id_funcao = $i");
		}
	}
	return $id_perfil;
}
function excluir($id_perfil, $dbhw) {
	$esquemaadmin = $_SESSION["esquemaadmin"];
	//pega o nome conforme o ID
	$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT perfil from ".$esquemaadmin."i3geoadmin_perfis WHERE id_perfil = $id_perfil", $dbh, false );
	$perfil = $dados[0]["perfil"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoadmin_perfis", "id_perfil", $id_perfil, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	//remove o perfil de outras tabelas
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_mapas");
	foreach($q as $row){
		$t = $row['perfil_mapa'];
		$i = $row['id_mapa'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_mapa" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_mapas",$dataCol,"WHERE id_mapa = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_menus");
	foreach($q as $row){
		$t = $row['perfil_menu'];
		$i = $row['id_menu'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_menu" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_menus",$dataCol,"WHERE id_menu = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n1");
	foreach($q as $row){
		$t = $row['n1_perfil'];
		$i = $row['id_n1'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n1_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n1",$dataCol,"WHERE id_n1 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n2");
	foreach($q as $row){
		$t = $row['n2_perfil'];
		$i = $row['id_n2'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n2_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n2",$dataCol,"WHERE id_n2 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_n3");
	foreach($q as $row){
		$t = $row['n2_perfil'];
		$i = $row['id_n3'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"n2_perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_n3",$dataCol,"WHERE id_n3 = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_raiz");
	foreach($q as $row){
		$t = $row['perfil'];
		$i = $row['id_raiz'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_raiz",$dataCol,"WHERE id_raiz = $i");
		}
	}
	$q = $dbhw->query("select * from ".$esquemaadmin."i3geoadmin_sistemasf");
	foreach($q as $row){
		$t = $row['perfil_funcao'];
		$i = $row['id_funcao'];
		$ts = trim(str_replace(" ".$perfil." ",""," ".$t." "));
		if($t != $ts){
			$dataCol = array(
					"perfil_funcao" => $ts
			);
			\admin\php\funcoesAdmin\i3GeoAdminUpdate($dbhw,"i3geoadmin_sistemasf",$dataCol,"WHERE id_funcao = $i");
		}
	}
	return $resultado;
}
?>