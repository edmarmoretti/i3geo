<?php
include_once(dirname(__FILE__)."/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
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
		if(!isset($_GET["marca"])){
			$_GET["marca"]="";
		}
		$wkt = explode("|",$_GET["xy"]);
		$shp = ms_shapeObjFromWkt($wkt[0]);
		if($shp->type == MS_SHAPE_POINT){
			$tipo = "POINT";
		}
		if($shp->type == MS_SHAPE_LINE){
			$tipo = "LINE";
		}
		if($shp->type == MS_SHAPE_POLYGON){
			$tipo = "POLYGON";
		}
		foreach($wkt as $w){
			$m->insereFeature($_GET["marca"],$_GET["tipo"],$w,$_GET["texto"],$_GET["position"],$_GET["partials"],$_GET["offsetx"],$_GET["offsety"],$_GET["minfeaturesize"],$_GET["mindistance"],$_GET["force"],$_GET["shadowcolor"],$_GET["shadowsizex"],$_GET["shadowsizey"],$_GET["outlinecolor"],$_GET["cor"],$_GET["sombray"],$_GET["sombrax"],$_GET["sombra"],$_GET["fundo"],$_GET["angulo"],$_GET["tamanho"],$_GET["fonte"],$_GET["wrap"],true,$_GET["nometema"]);
		}
		$m->salva();
		redesenhaMapa();
	break;
	case "SHAPEFILE":
		include_once("../../classesphp/classe_analise.php");
		$m = new Analise($map_file,"");
		$wkt = explode("|",$_GET["xy"]);
		$nomeLayer = $m->aplicaFuncaoListaWKT($wkt,"converteSHP",$dir_tmp,$imgdir);

		$l = $m->mapa->getlayerbyname($nomeLayer);
		$l->setmetadata("tema",$_GET["nometema"]);
		//verifica projecao
		$shp = ms_shapeObjFromWkt($wkt[0]);
		$c = $shp->getCentroid();
		$c = $c->x;
		if($c > -181 && $c < 181){
			$l->setprojection(pegaProjecaoDefault("proj4"));
		}
		else{
			$l->setprojection($m->mapa->getProjection());
		}
		$m->salva();
		redesenhaMapa();
	break;

}
if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>