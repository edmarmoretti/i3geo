<?php
include("../../ms_configura.php");
include("../../classesphp/pega_variaveis.php");
include("../../classesphp/funcoes_gerais.php");
//define o centro, pegando as coordenadas do mapa de inicializacao
$versao = versao();
$versao = $versao["principal"];
if(isset($base) && $base != ""){
	if(file_exists($base)){
		$f = $base;
	}
	else{
		$f = $locaplic."/aplicmap/".$base.".map";
	}
}
else
{
	$f = "";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
		$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
	}
	else{
		if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
			$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
		}
		if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
		}
		if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
			$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
		}
		if($f == "")
		{
			$f = $locaplic."/aplicmap/geral1v".$versao.".map";
		}
	}
}
$centroX = -55;
$centroY = -13;
if(@ms_newMapObj($f)){
	$mapa = ms_newMapObj($f);

	$c = $mapa->extent;
	$centroX = $c->maxx - ($c->maxx - $c->minx) / 2;
	$centroY = $c->maxy - ($c->maxy - $c->miny) / 2;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>KML 3d</title>
<script src="../../pacotes/cesium/Build/Cesium/Cesium.js"></script>
<style>
@import url(../../pacotes/cesium/Build/Cesium/Widgets/widgets.css);

#cesiumContainer {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	margin: 0;
	overflow: hidden;
	padding: 0;
	font-family: sans-serif;
}

html {
	height: 100%;
}

body {
	padding: 0;
	margin: 0;
	overflow: hidden;
	height: 100%;
}

#legenda {
	margin-bottom: 5px;
	margin-left: 5px;
	margin-right: 5px;
	margin-top: 5px;
	padding-bottom: 2px;
	padding-left: 5px;
	padding-right: 5px;
	padding-top: 2px;
	position: absolute;
	top: 10px;
	left: 10px;
	color: white;
	font-family: Verdana, Arial, Helvetica, sans-serif;
}
</style>
</head>
<body>
	<div id="cesiumContainer"></div>
	<div id="legenda">
		<img src='<?php echo strip_tags(str_replace("legend","logo",$legenda));?>' />
		<br>
		<img src='<?php echo strip_tags($legenda);?>' />
	</div>
	<script>
	var viewer = new Cesium.Viewer(
		'cesiumContainer',
		{
			timeline : false
		}
	);
	// Add a WMS imagery layer

	var imageryLayers = viewer.imageryLayers;
	if('<?php echo $kmlurl;?>' != ''){
		viewer.dataSources.add(Cesium.KmlDataSource.load('<?php echo strip_tags($kmlurl);?>'))
	}
	var center = Cesium.Cartesian3.fromDegrees(<?php echo $centroX.",".$centroY;?>);
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    var camera = viewer.camera;
    camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
    camera.lookAtTransform(transform, new Cesium.Cartesian3(-120000.0, -120000.0, 120000.0));
</script>
</body>
</html>
