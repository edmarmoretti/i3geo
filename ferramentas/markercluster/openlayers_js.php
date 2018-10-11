<?php
/**
Obtem os dados para geracao de mapa de cluster. Envia o codigo javascript necessario se for solicitado.

Parametros:

carregajs sim|nao envia ou nao o codigo javascript

layer codigo da camada que fornecera os dados

coluna coluna que contem os dados

g_sid codigo da secao i3geo

nomevariavel nome da variavel javascript que sera retornada com os valores

 */
$dir = dirname(__FILE__);

//inicializa o programa verificando seguranca e pegando os parametros enviados pela URL e pela secao
include_once($dir."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
include_once($dir."/funcoes.php");
error_reporting(0);
$layer = $_GET["layer"];
$tipoEstilos = $_GET["tipoEstilos"];
$coluna = $_GET["coluna"];

//o plugin pode ser chamado sem um mapfile criado
//usando apenas o mapfile existente em i3geo/temas
//nesse caso e necessario cirar um mapfile temporario
if(!empty($_SESSION["map_file"])){
	$mapateste = ms_newMapObj($_SESSION["map_file"]);
	if($mapateste->getlayerbyname($layer) != ""){
		$map_file = $_SESSION["map_file"];
	}
	else{
		$map_file = "";
	}
}
$map_file = markerclusterMapfile();
//no caso do SAIKU, o nome do mapfile pode estar na sessao
if($map_file == ""){
	$map_file = $_SESSION["map_file"];
}
$resultado = markerclusterDados($map_file);
echo 'markercluster_dados = ['.implode(",",$resultado).'];';
?>