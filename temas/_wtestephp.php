<?php
//
//esse programa é incluido na classe classesphp/classe_mapa.php
//herdando os objetos
//$this->mapa
//$this->arquivo
//
// exemplo
//
function _wtestephp(&$mapa){
	$layer = $mapa->getlayerbyname("copyright");
	$layer->set("status",MS_DEFAULT);
	$layer->setmetadata("TEMA","Veja o texto no mapa");
	$layer->setmetadata("ESCONDIDO","");
	$shp = ms_newshapeobj(MS_SHAPE_POINT);
	$shp->set("text","teste .... teste");
	$lin = ms_newlineobj();
	$lin->addxy(200,100);
	$shp->add($lin);
	$layer->addfeature($shp);
	//altera o nomepara que o i3Geo perceba que algo foi alterado e o mapa seja redesenhado
	$layer->set("name","testephp");
	//para uso no gerador de Web Services OGC
	$layer->setmetadata("ows_title","testephp");
	$layer->setmetadata("gml_include_items","all");
	$layer->set("dump",MS_TRUE);
	$layer->setmetadata("WMS_INCLUDE_ITEMS","all");
	$layer->setmetadata("WFS_INCLUDE_ITEMS","all");				
}
?>