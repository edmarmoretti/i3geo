<?php
include(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
$dir = dirname(__FILE__);
include_once($dir."/../../pacotes/wicket/wicket-gmap3.js");
include_once($dir."/dicionario.js");
include_once($dir."/../../classesjs/compactados/classe_editorgm_compacto.js");
include_once($dir."/locregiao.js");
?>