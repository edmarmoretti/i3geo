<?php
define ( "ONDEI3GEO", dirname ( dirname ( __FILE__ ) ) );
if (extension_loaded ( 'zlib' )) {
	ob_start ( 'ob_gzhandler' );
}
header ( "Content-type: text/javascript" );

include (ONDEI3GEO . "/pacotes/jquery/dist/jquery.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap/js/bootstrap.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap/js/ie10-viewport-bug-workaround.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap-material-design/dist/js/material.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap-accessibility-plugin/plugins/js/bootstrap-accessibility.min.js");
echo "\n";
include (ONDEI3GEO . "/pacotes/bootstrap-material-design/snackbarjs-1.1.0/dist/snackbar.min.js");
echo "\n";
if (extension_loaded ( 'zlib' )) {
	ob_end_flush ();
}
?>