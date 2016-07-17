<?php
define ( ONDEI3GEO, dirname ( dirname ( __FILE__ ) ) );
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );

include (ONDEI3GEO . "/pacotes/jquery/dist/jquery.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/jquery/jquery-ui/jquery-ui.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap/js/bootstrap.min.js");
echo "\n";
// IE10 viewport hack for Surface/desktop Windows 8 bug //
include (ONDEI3GEO . "/pacotes/bootstrap/js/ie10-viewport-bug-workaround.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/js/material.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/cpaint/cpaint2_compacto.inc.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/dicionario_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_util_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_idioma_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_login_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/classe_php_compacto.js");
echo "\n";
include (ONDEI3GEO . "/classesjs/compactados/mustache.js");
echo "\n";
include (ONDEI3GEO . "/admin1/head.js");
echo "\n";
include (ONDEI3GEO . "/admin1/js/core.js");
echo "\n";
include (ONDEI3GEO . "/admin1/dicionario/core.js");
echo "\n";
include (ONDEI3GEO . "/admin1/dicionario/menup.js");
echo "\n";
include (ONDEI3GEO . "/admin1/dicionario.js");
echo "\n";

if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}
?>