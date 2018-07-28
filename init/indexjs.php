<?php
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );
include ('../pacotes/cpaint/cpaint2_compacto.inc.js');
echo "\n";
include ('../js/compactados/dicionario_compacto.js');
echo "\n";
include ('../js/compactados/util_compacto.js');
echo "\n";
include ('../js/compactados/idioma_compacto.js');
echo "\n";
include ('../js/compactados/login_compacto.js');
echo "\n";
include ('../js/compactados/php_compacto.js');
echo "\n";
include ('../js/compactados/mustache.js');
echo "\n";
include ('../js/compactados/janela_compacto.js');
echo "\n";
include ('../js/template.js');
echo "\n";
include ('dicionario.js');
echo "\n";
include ('index.js');
echo "\n";
include ('../js/compactados/janela_compacto.js');
echo "\n";
if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}