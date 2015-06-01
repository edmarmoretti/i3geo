<?php
include("../../classesphp/pega_variaveis.php");
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
	viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-55.0, -13.0), new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0));
	viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
	//viewer.extend(Cesium.viewerCesiumInspectorMixin);
</script>
</body>
</html>
