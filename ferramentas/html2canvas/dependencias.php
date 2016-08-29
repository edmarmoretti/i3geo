<?php
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)));


/**
 * Carrega os programas javascript necessarios para a ferramenta
 * Esse programa e usado na tag <script> ou com a funcao scripttag do i3Geo
 * Alem de carregar os scripts, carrega tambem o template no formato MUSTACHE, definindo a variavel
 * javascript i3GEOF.html2canvas.MUSTACHE
 * O template e substituido pelos valores definidos em index.js no momento da inicializacao da ferramenta
 */
if(extension_loaded('zlib')){
	ob_start('ob_gzhandler');
}
header("Content-type: text/javascript");
include("../../pacotes/tableexport/html2canvas.js");
include("../../pacotes/canvas2image.js");
include("index.js");
if(extension_loaded('zlib')){
	ob_end_flush();
}
?>