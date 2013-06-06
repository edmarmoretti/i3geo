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
include_once ("../../pacotes/ccc2/cdf/jquery.js");
include_once ("../../pacotes/ccc2/lib/jquery.tipsy.js");
include_once ("../../pacotes/ccc2/lib/protovis-d3.3.js");
include_once ("../../pacotes/ccc2/lib/protovis-msie.js");
include_once ("../../pacotes/ccc2/def/def.js");
include_once ("../../pacotes/ccc2/lib/tipsy.js");
include_once ("../../pacotes/ccc2/ccc2sage.js");
include_once ("../../pacotes/formatnumber.js");
?>
