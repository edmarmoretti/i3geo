<?php
/**
 * Carrega os programas javascript necessarios para a ferramenta
 * Esse programa e usado na tag <script> ou com a funcao scripttag do i3Geo
 * Alem de carregar os scripts, carrega tambem o template no formato MUSTACHE, definindo a variavel
 * javascript i3GEOF.atalhosedicao.MUSTACHE
 * O template e substituido pelos valores definidos em index.js no momento da inicializacao da ferramenta
 */
if(extension_loaded('zlib')){
	ob_start('ob_gzhandler');
}
header("Content-type: text/javascript");
include("index.js");
include("dicionario.js");
echo "\n";
/**
 * Inclui o template mustache do HTML usado para criar o conteudo da janela
 */
echo 'i3GEOF.atalhosedicao.MUSTACHE = "';
$texto = file_get_contents("template_mst.html");
$texto = str_replace("\n", "", $texto);
$texto = str_replace("\r", "", $texto);
$texto = str_replace("\t", "", $texto);
$texto = str_replace('"', "'", $texto);
echo $texto;
echo '";';
if(extension_loaded('zlib')){
	ob_end_flush();
}
?>