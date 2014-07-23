<?php
/**
 * Carrega os arquivos javascript necessarios para a producao de graficos
 * Deve ser inserido na tag script de um arquivo HTML
 *
 * @author Edmar Moretti
 *
 * Esse programa faz parte do pacote ccc2sage - veja licenca
 */
if(extension_loaded('zlib')){
	ob_start('ob_gzhandler');
}
header("Content-type: text/javascript");
include("index.js");
include_once ("dicionario.js");
echo "\n";
/**
 * Inclui o template mustache do HTML usado para criar o conteudo da janela
 */
echo 'i3GEOF.graficointerativo1.MUSTACHE = "';
$texto = file_get_contents("template_mst.html");
$texto = str_replace("\n", "", $texto);
$texto = str_replace("\r", "", $texto);
$texto = str_replace("\t", "", $texto);
$texto = str_replace('"', "'", $texto);
echo $texto;
echo '";';

$s = array("../../pacotes/ccc2/ccc/def.js",
		"../../pacotes/ccc2/ccc/jquery.js",
		"../../pacotes/ccc2/ccc/jquery.tipsy.js",
		"../../pacotes/ccc2/ccc/protovis.js",
		"../../pacotes/ccc2/ccc/protovis-msie.js",
		"../../pacotes/ccc2/ccc/pvc-r2.0.js",
		"../../pacotes/ccc2/ccc/tipsy.js",
		"../../pacotes/formatnumber.js"
);
foreach($s as $i){
	include_once($i);
}
if(extension_loaded('zlib')){
	ob_end_flush();
}
?>
