<?php
namespace admin\metaestat\regioes;
use PDO;
use PDOException;
function listar($dbh, $codigo_tipo_regiao = "") {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	if ($codigo_tipo_regiao != "") {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_tipo_regiao WHERE codigo_tipo_regiao = $codigo_tipo_regiao ", $dbh, false );
		$dados = $dados [0];
	} else {
		$dados = \admin\php\funcoesAdmin\pegaDados ( "SELECT codigo_tipo_regiao, nome_tipo_regiao from " . $esquemaadmin . "i3geoestat_tipo_regiao", $dbh, false );
	}
	if ($dados === false) {
		return false;
	} else {
		return $dados;
	}
}
function adicionar($nome_tipo_regiao,$descricao_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunageo,$data,$identificador,$colunanomeregiao,$srid,$colunacentroide,$colunasvisiveis,$apelidos, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	try {
		$dataCol = array (
			"nome_tipo_regiao"=>'',
			"descricao_tipo_regiao"=>'',
			"codigo_estat_conexao"=>1,
			"esquemadb"=>'',
			"tabela"=>'',
			"colunageo"=>'',
			"data"=>'',
			"identificador"=>'',
			"colunanomeregiao"=>'',
			"srid"=>'',
			"colunacentroide"=>'',
			"colunasvisiveis"=>'',
			"apelidos"=>''
		);
		$codigo_tipo_regiao = \admin\php\funcoesAdmin\i3GeoAdminInsertUnico ( $dbhw, "i3geoestat_tipo_regiao", $dataCol, "nome_tipo_regiao", "codigo_tipo_regiao" );
		$retorna = \admin\metaestat\regioes\alterar ( $codigo_tipo_regiao, $nome_tipo_regiao,$descricao_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunageo,$data,$identificador,$colunanomeregiao,$srid,$colunacentroide,$colunasvisiveis,$apelidos,$dbhw );

		return $retorna;
	} catch ( PDOException $e ) {
		return false;
	}
}
function alterar($codigo_tipo_regiao, $nome_tipo_regiao,$descricao_tipo_regiao,$codigo_estat_conexao,$esquemadb,$tabela,$colunageo,$data,$identificador,$colunanomeregiao,$srid,$colunacentroide,$colunasvisiveis,$apelidos,$dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$convUTF = $_SESSION["convUTF"];
	if ($convUTF != true){
		$nome_tipo_regiao = utf8_decode($nome_tipo_regiao);
		$descricao_tipo_regiao = utf8_decode($descricao_tipo_regiao);
		$apelidos = utf8_decode($apelidos);
	}
	$dataCol = array (
		"nome_tipo_regiao"=>$nome_tipo_regiao,
		"descricao_tipo_regiao"=>$descricao_tipo_regiao,
		"codigo_estat_conexao"=>$codigo_estat_conexao,
		"esquemadb"=>$esquemadb,
		"tabela"=>$tabela,
		"colunageo"=>$colunageo,
		"data"=>$data,
		"identificador"=>$identificador,
		"colunanomeregiao"=>$colunanomeregiao,
		"srid"=>$srid,
		"colunacentroide"=>$colunacentroide,
		"colunasvisiveis"=>$colunasvisiveis,
		"apelidos"=>$apelidos
	);
	$resultado = \admin\php\funcoesAdmin\i3GeoAdminUpdate ( $dbhw, "i3geoestat_tipo_regiao", $dataCol, "WHERE codigo_tipo_regiao = $codigo_tipo_regiao" );
	if ($resultado === false) {
		return false;
	}
	return $codigo_tipo_regiao;
}
function excluir($codigo_tipo_regiao, $dbhw) {
	$esquemaadmin = $_SESSION ["esquemaadmin"];

	$r = \admin\php\funcoesAdmin\pegaDados("select * from ".$esquemaadmin."i3geoestat_medida_variavel where codigo_tipo_regiao=$codigo_tipo_regiao");
	if(count($r) > 0){
		header ( "HTTP/1.1 500 erro ao excluir. Periodo esta em uso por i3geoestat_medida_variavel" );
		exit ();
	}

	$resultado = \admin\php\funcoesAdmin\i3GeoAdminExclui ( $esquemaadmin . "i3geoestat_tipo_regiao", "codigo_tipo_regiao", $codigo_tipo_regiao, $dbhw, false );
	if ($resultado === false) {
		return false;
	}
	return $resultado;
}
function colunasRegiao($dbh,$codigo_tipo_regiao){
	$esquemaadmin = $_SESSION ["esquemaadmin"];
	$colunas = array();
	//parametros da regiao
	$regiao = \admin\metaestat\regioes\listar($dbh, $codigo_tipo_regiao);
	//parametros de conexao
	//$c = \admin\php\funcoesAdmin\pegaDados ( "SELECT * from " . $esquemaadmin . "i3geoestat_conexao WHERE codigo_estat_conexao = " . $regiao["codigo_estat_conexao"], $dbh, false );
	//$c = $c[0];
	$c = \admin\php\funcoesAdmin\listaConexaoMetaestat();
	$dbhBD = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);

	$sql = "SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '" . $regiao["tabela"] . "' and p.nspname = '" . $regiao["esquemadb"] . "' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname";

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
function nomesColunasRegiao($dbh,$codigo_tipo_regiao){
	$colunas = \admin\metaestat\regioes\colunasRegiao($dbh,$codigo_tipo_regiao);
	$nomesColunas = \admin\metaestat\regioes\nomesColunas($colunas);
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