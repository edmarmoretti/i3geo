<?php
/**
Obtem os dados para geracao de markercluster. Envia o codigo javascript necessario se for solicitado.

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

$layer = $_GET["layer"];
$tipoEstilos = $_GET["tipoEstilos"];
$coluna = $_GET["coluna"];

$map_file = markerclusterMapfile();
$resultado = markerclusterDados($map_file);
$tipoEstilos = markerclusterEstilos($map_file,$layer,$tipoEstilos);

echo 'markercluster_dados = ['.implode(",",$resultado).'];';
echo 'markercluster_config = '.$tipoEstilos.';';

if($_GET["carregajs"] === "sim"){
	include_once($dir."/../../pacotes/markercluster/google/markerclusterer.js");
}
?>
