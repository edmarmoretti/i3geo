<?php
/**
 * Carrega os arquivos javascript necessarios para a producao de graficos
 * Deve ser inserido na tag script de um arquivo HTML
 *
 * @author Edmar Moretti
 *
 * Esse programa faz parte do pacote ccc2sage - veja licenca
 */
//precisa da zlib: extension_loaded('zlib')
error_reporting(0);
ob_start('ob_gzhandler');
include_once ("dicionario.js");
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
?>
