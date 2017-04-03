<?php
/**
Obtem os dados para geracao de mapa de calor. Envia o codigo javascript necessario se for solicitado.

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
include_once($dir."/funcoes.php");

$layer = $_GET["layer"];
$tipoGradiente = $_GET["tipoGradiente"];
$coluna = $_GET["coluna"];
$valorPonto = $_GET["valorPonto"];


$map_file = heatmapMapfile();
$resultado = heatmapDados($map_file);
$gradiente = heatmapGradiente($map_file,$layer,$tipoGradiente);

if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}

echo 'heatmap_dados = ['.implode(",",$resultado).'];';
echo 'heatmap_config = '.$gradiente.';';

if($carregajs === "sim"){
	include_once($dir."/../../pacotes/heatmap/src/heatmap.js");
	//include_once($dir."/../../pacotes/heatmap/src/heatmap-openlayers-renderer.js");
	include_once($dir."/../../pacotes/heatmap/src/heatmap-gmaps.js");
}

?>
