<?php
namespace admin\metaestat\variaveis\medidas;
use PDO;
use PDOException;

function listar($dbh, $codigo_variavel, $id_medida_variavel = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($id_medida_variavel != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_medida_variavel WHERE id_medida_variavel = $id_medida_variavel ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT id_medida_variavel,nomemedida from " . $esquemaadmin . "i3geoestat_medida_variavel WHERE codigo_variavel = $codigo_variavel order by lower(nomemedida)", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"codigo_unidade_medida"=>'',
			"codigo_tipo_periodo"=>'',
			"codigo_variavel"=>'',
			"codigo_tipo_regiao"=>'',
			"codigo_estat_conexao"=>'',
			"esquemadb"=>'',
			"tabela"=>'',
			"colunavalor"=>'',
			"colunaidgeo"=>'',
			"filtro"=>'',
			"nomemedida"=>'',
			"colunaidunico"=>''
		);
		$id_medida_variavel = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_medida_variavel", $dataCol, "nomemedida", "id_medida_variavel" );
		$retorna = \admin\metaestat\variaveis\medidas\alterar ( $id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw );
		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($id_medida_variavel,$codigo_unidade_medida,$codigo_tipo_periodo,$codigo_variavel,$codigo_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunavalor,$colunaidgeo,$filtro,$nomemedida,$colunaidunico,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nomemedida = utf8_decode($nomemedida);
	}
	$dataCol = array (
			"codigo_unidade_medida"=>$codigo_unidade_medida,
			"codigo_tipo_periodo"=>$codigo_tipo_periodo,
			"codigo_variavel"=>$codigo_variavel,
			"codigo_tipo_regiao"=>$codigo_tipo_regiao,
			"codigo_estat_conexao"=>$codigo_estat_conexao,
			"esquemadb"=>$esquemadb,
			"tabela"=>$tabela,
			"colunavalor"=>$colunavalor,
			"colunaidgeo"=>$colunaidgeo,
			"filtro"=>$filtro,
			"nomemedida"=>$nomemedida,
			"colunaidunico"=>$colunaidunico
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_medida_variavel", $dataCol, "WHERE id_medida_variavel = $id_medida_variavel" );
	if ($resultado === false) {
		return false;
	}
	return $id_medida_variavel;
}
function excluir($id_medida_variavel, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_medida_variavel", "id_medida_variavel", $id_medida_variavel, $dbhw, false );

	if (!$resultado === false) {
		$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_medida_variavel_link", "id_medida_variavel", $id_medida_variavel, $dbhw, false );
	}
	return $resultado;
}
function colunasMedida($dbh,$id_medida_variavel){
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$colunas = array();
	//parametros da regiao
	$medida = \admin\metaestat\variaveis\medidas\listar($dbh, "", $id_medida_variavel);
	//parametros de conexao
	//$c = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_conexao WHERE codigo_estat_conexao = " . $medida["codigo_estat_conexao"], $dbh, false );
	//$c = $c[0];
	$c = \admin\php\funcoesAdmin\listaConexaoMetaestat();
	$dbhBD = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);

	$sql = "SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '" . $medida["tabela"] . "' and p.nspname = '" . $medida["esquemadb"] . "' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname";

	try	{
		$q = $dbhBD->query($sql,PDO::FETCH_ASSOC);
		$colunas = $q->fetchAll();
	}
	catch (PDOException $e)	{
		$colunas = false;
	}
	$dbhBD = null;
	return $colunas;
}
function nomesColunasMedida($dbh,$id_medida_variavel){
	$colunas = \admin\metaestat\variaveis\medidas\colunasMedida($dbh,$id_medida_variavel);
	$nomesColunas = \admin\metaestat\variaveis\medidas\nomesColunas($colunas);
	return $nomesColunas;
}
function nomesColunas($colunas){
	$nomes = array();
	foreach ($colunas AS $c){
		$nomes[] = array("nome" => $c["field"]);
	}
	return $nomes;
}
?>