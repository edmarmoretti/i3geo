<?php
if(empty($_POST["g_sid"])){
	echo "erro";
	exit;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../admin/php/classe_metaestat.php");
if(!isset($dir_tmp)){
	include(dirname(__FILE__)."/../../ms_configura.php");
}
//pega o filtro da sessao PHP aberta pelo i3Geo
session_name("i3GeoPHP");
session_id($_POST["g_sid"]);
session_start();
//obtem os layers que sao do sistema metaestat, sao regioes e que possuem selecao
$map_file = $_SESSION["map_file"];
$dados = (array) json_decode($_POST["dados"],true);
echo "<pre>";
$metadados = (array) json_decode($_POST["metadados"],true);
$nmetadados = count($metadados);
//pega o id da regiao (busca pelo posfixo geocod)
$codigo_tipo_regiao = $metadados[0]["identificador"];
$codigo_tipo_regiao = explode("].[",$codigo_tipo_regiao);
$codigo_tipo_regiao = str_replace(array("[","_geocod"),"",$codigo_tipo_regiao[0]);

$nomesColunas = array();
$valores = array();
for($i=1;$i<$nmetadados;$i++){
	$nomesColunas[] = $metadados[$i]["colName"];
	$valores[$metadados[$i]["colName"]] = array();
}

$codigosRegioes = array();

foreach($dados as $dado){
	$codigosRegioes[] = $dado[0];
	for($i=1;$i<$nmetadados;$i++){
		array_push($valores[$metadados[$i]["colName"]],$dado[$i]);
	}
}
var_dump($valores);
?>