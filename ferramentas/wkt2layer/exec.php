<?php
include_once(dirname(__FILE__)."/../inicia.php");
//
//faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; //string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao))
{
/*
Valor: WKT

Insere elementos no mapa como um layer do tipo feature baseado em wkt

*/
	case "FEATURE":
		include_once("../../classesphp/classe_temas.php");
		copiaSeguranca($map_file);
		$m = new Temas($map_file,"");
		if(!isset($marca)){
			$marca="";
		}
		$shp = ms_shapeObjFromWkt($xy);
		if($shp->type == MS_SHAPE_POINT){
			$tipo = "POINT";
		}
		if($shp->type == MS_SHAPE_LINE){
			$tipo = "LINE";
		}
		if($shp->type == MS_SHAPE_POLYGON){
			$tipo = "POLYGON";
		}
		$m->insereFeature($marca,$tipo,$xy,$texto,$position,$partials,$offsetx,$offsety,$minfeaturesize,$mindistance,$force,$shadowcolor,$shadowsizex,$shadowsizey,$outlinecolor,$cor,$sombray,$sombrax,$sombra,$fundo,$angulo,$tamanho,$fonte,$wrap,true,$nometema);
		$m->salva();
		redesenhaMapa();
	break;
	case "SHAPEFILE":
		include_once("../../classesphp/classe_analise.php");
		$m = new Analise($map_file,"");
		$nomeLayer = $m->aplicaFuncaoListaWKT(array($xy),"converteSHP",$dir_tmp,$imgdir);
		$l = $m->mapa->getlayerbyname($nomeLayer);
		$l->setmetadata("tema",$nometema);
		//verifica projecao
		//verifica a projecao
		$shp = ms_shapeObjFromWkt($xy);
		$c = $shp->getCentroid();
		$c = $c->x;
		if($c > -181 && $c < 181){
			$l->setprojection("proj=latlong,a=6378137,b=6378137");
		}
		else{
			$l->setprojection($this->mapa->getProjection());
		}
		$m->salva();
		redesenhaMapa();
	break;

}
if (!connection_aborted()){
	if(isset($map_file) && isset($postgis_mapa) && $map_file != "")
	restauraCon($map_file,$postgis_mapa);
	cpjson($retorno);
}
else
{exit();}
?>