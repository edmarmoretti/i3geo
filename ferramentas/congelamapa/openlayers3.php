<?php
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);

$g_sid = strip_tags($_GET["g_sid"]);
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
$mapext = str_replace(" ",",",strip_tags($_GET["ext"]));
$urllayer = "../../ogc.php?tema=".$novo_mapfile;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<script src="../../pacotes/ol3/ol.js"></script>
<link rel="stylesheet" type="text/css" href="../../pacotes/ol3/ol.css">
</head>
<body>
	<div id=mapa style="width: 470px; height: 330px"></div>
	<script>
var source = new ol.source.ImageWMS({
	url : '<?php echo $urllayer; ?>',
	params : {
		'LAYERS' : '<?php echo $layers;?>',
		'VERSION' : '1.1.0'
	},
	projection : "EPSG:4326",
	visible : true
});

var layer = new ol.layer.Image({source : source});

var parametrosMap = {
	target : "mapa",
	layers : [layer],
	controls : [new ol.control.Zoom()],
	loadTilesWhileAnimating : true,
	loadTilesWhileInteracting : true,
	visibility:true,
	maxExtent: [-180,-90,180,90],
	displayOutsideMaxExtent:true,
	view : new ol.View({
		projection : "EPSG:4326"
	}),
	interactions : [
		new ol.interaction.DoubleClickZoom(),
		new ol.interaction.MouseWheelZoom(),
		new ol.interaction.DragPan()
	]
};
mapa = new ol.Map(parametrosMap);

var v = mapa.getView();
v.fit([<?php echo $mapext; ?>], mapa.getSize());

</script>
</body>