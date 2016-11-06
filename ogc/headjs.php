<?php
define ( ONDEI3GEO, dirname ( dirname ( __FILE__ ) ) );
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );
include (ONDEI3GEO . "/pacotes/cpaint/cpaint2_compacto.inc.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/dicionario_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_util_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_idioma_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_php_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_arvoredetemas_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/mustache.js");
echo "\n";

if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}
?>