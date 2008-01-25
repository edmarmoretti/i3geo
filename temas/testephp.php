<?php
//
//esse programa é incluido na classe classesphp/classe_mapa.php
//herdando os objetos
//$this->mapa
//$this->arquivo
//
// exemplo
//
$layer = $this->mapa->getlayerbyname("copyright");
$layer->set("status",MS_DEFAULT);
$shp = ms_newshapeobj(MS_SHAPE_POINT);
$shp->set("text","teste .... teste");
$lin = ms_newlineobj();
$lin->addxy(200,100);
$shp->add($lin);
$layer->addfeature($shp);
$shp->free();
?>