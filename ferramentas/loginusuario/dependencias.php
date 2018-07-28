<?php
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)));


/**
 * Carrega os programas javascript necessarios para a ferramenta
 * Esse programa e usado na tag <script> ou com a funcao scripttag do i3Geo
 * Alem de carregar os scripts, carrega tambem o template no formato MUSTACHE, definindo a variavel
 * javascript i3GEOF.loginusuario.MUSTACHE
 * O template e substituido pelos valores definidos em index.js no momento da inicializacao da ferramenta
 */

//verifica se o login pode ser realizado
include(dirname(__FILE__)."/../../ms_configura.php");
if(isset($i3geoPermiteLogin) && $i3geoPermiteLogin == false){
	echo "alert('ferramenta de login desativada');";
	//header ( "HTTP/1.1 403 Login desativado" );
	exit ();
}

if(extension_loaded('zlib')){
	ob_start('ob_gzhandler');
}
header("Content-type: text/javascript");
include("index.js");
include("dicionario.js");
echo "\n";
if(extension_loaded('zlib')){
	ob_end_flush();
}
?>