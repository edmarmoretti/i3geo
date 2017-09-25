<?php
/*
Importante:

A integracaoo do SAIKU com o i3GEO e experimental.

O SAIKU utiliza os arquivos de fonte de dados que sao criados de forma dinamica na pasta ms_tmp/saiku-datasources.
Esses arquivos apontam para o arquivo XML com o esquema utilizado para construir os cubos, que tambem sao criados de forma dinamica.
Como o SAIKU precisa ler esse arquivo XML, o mesmo deve ter permissoes de leitura de forma que o Apache consiga carregar esse arquivo XML.
E importante destacar que ao fazer isso o arquivo xml fica exposto, o que pode permitir que um usuario qualquer tenha acesso a esse XML.
Esse XML contem os SQL utilizados para acessar o banco de dados. Ao usar o SAIKU e necessario avaliar se essa caracteristica pode
apresentar-se como um problema de seguranc
*/
//
//remova essa linhas para poder usar o SAIKU
//
//echo "Bloqueado. Consulte o administrador.";exit;

include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../classesphp/classe_metaestatinfo.php");
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}
if(isset($statusFerramentas) && $statusFerramentas["saiku"] != true){
	exit;
}

$urlXmlEsquema = "";
$nomeConexao = "i3geo.txt";//criaConexaoEsquema();

//$map_file = $_SESSION["map_file"];
//$arquivoXmlEsquema = dirname($map_file)."/".str_replace(".txt","",$nomeConexao).".xml";
gravaDataSource();
if(empty($_GET["regiao"])){
	$_GET["regiao"] = "";
}
ob_clean();
header("Location:".$saikuUrl."/?nomeConexao=".$nomeConexao."&locaplic=".$_GET["locaplic"]."&g_sid=".$_GET["g_sid"]."&mapext=".$_GET["mapext"]."&origem=".$_GET["origem"]."&regiao=".$_GET["regiao"]);

function converte($texto){
	$texto = str_replace("&","&amp;",htmlentities($texto,ENT_NOQUOTES,'UTF-8'));
	return $texto;
}
function criaConexaoEsquema(){
	global $dir_tmp, $urlXmlEsquema;
	$nomeConexao = nomeRandomico();
	//pega a sessao PHP aberta pelo i3Geo ou ms_criamapa.php
	if(!empty($_GET["g_sid"])){
		session_name("i3GeoPHP");
		session_id($_GET["g_sid"]);
		session_start();
		$map_file = $_SESSION["map_file"];
		if(empty($_GET["xmlesquema"])){
			$urlXmlEsquema = $_SESSION["tmpurl"].basename(dirname($map_file))."/".$nomeConexao.".xml";
		}
		else{
			$urlXmlEsquema = $_GET["xmlesquema"];
			//cria um nome de arquivo reaproveitável
			$nomeConexao = md5($_GET["xmlesquema"]);
		}
	}
	//$arquivoXmlEsquema = dirname($map_file)."/".$nomeConexao.".xml";
	return $nomeConexao.".txt";
}
function gravaDataSource(){
	/*
	 $saikuConfigDataSource vem do ms_configura.php

	Exemplo de arquivo de fonte:
	type=OLAP
	name=i3geo
	driver=mondrian.olap4j.MondrianOlap4jDriver
	location=jdbc:mondrian:Jdbc=jdbc:postgresql://localhost:5432/i3geosaude;Catalog=http://localhost/i3geo/ferramentas/saiku/esquemaxml.php;JdbcDrivers=org.postgresql.Driver;
	username=postgres
	password=postgres

	Array com os parametros definidos em ms_configura:

	$saikuConfigDataSource = array(
			"type"=>"OLAP",
			"driver"=>"mondrian.olap4j.MondrianOlap4jDriver",
			"location"=>"jdbc:mondrian:Jdbc=jdbc:postgresql",
			"serverdb"=>"localhost",
			"port"=>"5432",
			"database"=>"i3geosaude",
			"JdbcDrivers"=>"org.postgresql.Driver",
			"username"=>"postgres",
			"password"=>"postgres"
	);
	*/
	global $arquivoXmlEsquema,$saikuConfigDataSource,$nomeConexao,$urlXmlEsquema,$dir_tmp;

	$nomeDatasource = $dir_tmp."/saiku-datasources/".$nomeConexao;
	//nao funciona como url
	//error_reporting(E_ALL);
	//$urlXmlEsquema = "http://localhost/i3geo/ferramentas/saiku/esquemaxml.php";

	$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
	$protocolo = $protocolo[0];
	$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
	$urlXmlEsquema = str_replace("startsaiku","esquemaxml",$protocolo.$_SERVER["PHP_SELF"]);

	//error_log($urlXmlEsquema);

	//if(!file_exists($arquivoXmlEsquema)){
		$stringDatasource = "
		type={$saikuConfigDataSource["type"]}
		name={$nomeConexao}
		driver={$saikuConfigDataSource["driver"]}
		location={$saikuConfigDataSource["location"]}://{$saikuConfigDataSource["serverdb"]}:{$saikuConfigDataSource["port"]}/{$saikuConfigDataSource["database"]};Catalog={$urlXmlEsquema};JdbcDrivers={$saikuConfigDataSource["JdbcDrivers"]};
		username={$saikuConfigDataSource["username"]}
		password={$saikuConfigDataSource["password"]}
		";
		//salva o arquivo com a fonte
		gravaDados(array($stringDatasource),$nomeDatasource);
	//}
}
?>
