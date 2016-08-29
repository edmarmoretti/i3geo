<?php
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$g_sid = $_GET["g_sid"];
session_name("i3GeoPHP");
session_id($g_sid);
session_start();
$fingerprint = $_SESSION["fingerprint"];
$f = explode(",",$fingerprint);
if($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . session_id())){
	echo "erro";
	return;
}
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
$map_file = $_SESSION["map_file"];
if(empty($map_file)){
	exit;
}
$map_file = str_replace(".map","",$map_file).".map";

restauraCon($map_file,$_SESSION["postgis_mapa"]);

$base = basename($map_file);
$dir = dirname($map_file);
$novo_mapfile = $dir."/".nomeRandomico(5).$base;
copy($map_file,$novo_mapfile);
chmod($novo_mapfile,0744);
$mapa = ms_newMapObj($novo_mapfile);
$mapa->setProjection(pegaProjecaoDefault("proj4"));
$numlayers = $mapa->numlayers;
$layers = array();
for($i = 0;$i < $numlayers;++$i){
	$l = $mapa->getLayer($i);
	$l->setmetadata("permiteogc","sim");
	if($l->status != MS_DEFAULT){
		$l->set("status",MS_DELETE);
	}
	else{
		$layers[] = $l->name;
	}
}
//$legenda = $mapa->legend;
//$legenda->set("status",MS_EMBED);
$mapa->save($novo_mapfile);
$layers = implode(",",$layers);
$mapext = str_replace(" ",",",$_GET["ext"]);
$urllayer = "../../ogc.php?tema=".$novo_mapfile;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<script type="text/javascript" src="../../pacotes/openlayers/OpenLayers2131.js.php"></script>
<style>
.yui-skin-sam .container-minimiza {
	background:transparent url(../../pacotes/yui290/build/assets/skins/sam/sprite.png) no-repeat scroll 0 -450px;
	cursor:pointer;
	height:15px;
	position:absolute;
	right:30px;
	top:1px;
	width:25px;
	z-index:2001;
	opacity:.8;
	filter:alpha(opacity=80);
}
</style>
</head>
<body style="background-color:white">
<div id=mapa style="width:470px;height: 330px"></div>
<script>

mapext = new OpenLayers.Bounds(<?php echo $mapext; ?>);
opcoes = {
	gutter:0,
	isBaseLayer:true,
	displayInLayerSwitcher:false,
	opacity: 1,
	visibility:true,
	singleTile:true,
	numZoomLevels: 12,
	maxExtent: new OpenLayers.Bounds(-180,-90,180,90),
	displayOutsideMaxExtent:true
};
controles = [
	new OpenLayers.Control.Navigation(),
	new OpenLayers.Control.PanZoomBar(),
	new OpenLayers.Control.MousePosition({'separator':' '}),
	new OpenLayers.Control.ScaleLine()
];
OpenLayers.ImgPath = "../../pacotes/openlayers/img/";
mapa = new OpenLayers.Map('mapa',{controls:[]});
layer = new OpenLayers.Layer.WMS(
	"",
	"<?php echo $urllayer; ?>",{
		LAYERS:"<?php echo $layers;?>"
	},
	opcoes
);
mapa.addLayer(layer);
mapa.zoomToExtent(mapext);
ncontroles = controles.length;
for(i=0;i<ncontroles;i++){
	mapa.addControl(controles[i]);
}
</script>
</body>