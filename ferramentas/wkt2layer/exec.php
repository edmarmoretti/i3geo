<?php
$_GET = $_POST;
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);

switch (strtoupper($_GET["funcao"])) {
	case "FEATURE":
	    include("../../classesphp/classe_temas.php");
	    $m = new Temas($_SESSION["map_file"],"");
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
	break;
	case "SHAPEFILE":
	    include("../../classesphp/classe_analise.php");
	    $m = new Analise($_SESSION["map_file"],"");
	    $wkt = explode("|",$_GET["xy"]);
		$nomeLayer = $m->aplicaFuncaoListaWKT($wkt,"converteSHP",$_SESSION["dir_tmp"],$_SESSION["imgdir"]);
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
	break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode(true);