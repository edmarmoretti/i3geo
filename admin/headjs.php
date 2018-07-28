<?php
define ( "ONDEI3GEO", dirname ( dirname ( __FILE__ ) ) );
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
include (ONDEI3GEO . "/pacotes/bootstrap-accessibility-plugin/plugins/js/bootstrap-accessibility.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/cpaint/cpaint2_compacto.inc.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/dicionario_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/util_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/idioma_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/login_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/php_compacto.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/mustache.js");
echo "\n";
include (ONDEI3GEO . "/js/template.js");
echo "\n";
include (ONDEI3GEO . "/js/compactados/janela_compacto.js");
echo "\n";
include (ONDEI3GEO . "/admin/menu.js");
echo "\n";
include (ONDEI3GEO . "/admin/js/core.js");
echo "\n";
include (ONDEI3GEO . "/admin/dicionario/core.js");
echo "\n";
include (ONDEI3GEO . "/admin/dicionario/menup.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap-material-design/snackbarjs-1.1.0/dist/snackbar.min.js");
echo "\n";

if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}
?>