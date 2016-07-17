<?php
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );

include ('../pacotes/cpaint/cpaint2_compacto.inc.js');
echo "\n";
include ('../classesjs/compactados/dicionario_compacto.js');
echo "\n";
include ('../classesjs/compactados/classe_util_compacto.js');
echo "\n";
include ('../classesjs/compactados/classe_idioma_compacto.js');
echo "\n";
include ('../classesjs/compactados/classe_login_compacto.js');
echo "\n";
include ('../classesjs/compactados/classe_php_compacto.js');
echo "\n";
include ('../classesjs/compactados/mustache.js');
echo "\n";
include ('dicionario.js');
echo "\n";
include ('index.js');
echo "\n";

if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}