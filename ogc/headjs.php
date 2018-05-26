<?php
define ( "ONDEI3GEO", dirname ( dirname ( __FILE__ ) ) );
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );
include (ONDEI3GEO . "/pacotes/cpaint/cpaint2_compacto.inc.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/dicionario_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/util_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/idioma_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/php_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/arvoredetemas_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/mustache.js");
echo "\n";

if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}
?>