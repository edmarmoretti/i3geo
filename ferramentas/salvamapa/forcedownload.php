<?php
exit;
include(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
//
//faz uma copia temporaria do mapfile
//
$arquivo = dirname($map_file)."/mapfile_".nomeRandomico(6).".map";
$mapa = ms_newMapObj($map_file);
$mapa->save($arquivo);
$mapa = ms_newMapObj($arquivo);
//
//modifica os layers
//
$c = $mapa->numlayers;
for ($i=0;$i < $c;++$i){
	$l = $mapa->getlayer($i);
	//
	//tratamento para layers que contem dados via base de dados
	//
	$ct = $l->connectiontype;
	if($ct != MS_INLINE && $ct != MS_WMS && $ct != MS_GRATICULE){
		$l->set("connection","");
		$l->set("data","");
	}
}
$mapa->save($arquivo);
header("Content-Type:text/plain");
header('Content-Disposition: attachment; filename="'.$arquivo.'"');
readfile($arquivo);
?>