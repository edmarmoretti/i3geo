<?php
include(dirname(__FILE__)."/../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)));
//como o nome da pasta mudou, essa linha mantem a compatibilidade
verificaBlFerramentas("upload");
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