<!DOCTYPE>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<style type="text/css">
body {
	margin: 0;
	padding: 10px 20px 20px;
	font-family: Arial;
	font-size: 16px;
}

#map-container {
	padding: 6px;
	border-width: 1px;
	border-style: solid;
	border-color: #ccc #ccc #999 #ccc;
	-webkit-box-shadow: rgba(64, 64, 64, 0.5) 0 2px 5px;
	-moz-box-shadow: rgba(64, 64, 64, 0.5) 0 2px 5px;
	box-shadow: rgba(64, 64, 64, 0.1) 0 2px 5px;
	width: 100%;
}

#map {
	width: 100%;
	height: 600px;
}
</style>
</head>
<body>
	<div id="map-container">
		<div id="map"></div>
	</div>
</body>
<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript">
	var center = new google.maps.LatLng(-20,-54);
	mapGM = new google.maps.Map(document.getElementById("map"), {
		zoom: 4,
		center: center
	});
<?php
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
	echo "camada = '_wbiomashp';";
}
else{
	echo "camada = '_lbiomashp';";
}
?>
	camadaOGC = new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var url = "../ogc.php?&cache=nao" +
			"&Z=" + zoom + "&X=" + coord.x + "&Y=" + coord.y +
			"&LAYERS="+camada+"&tema="+camada+"&REQUEST=getMap&TIPOIMAGEM=nenhum&service=wms";
			return url
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		name: camada
	});
	mapGM.overlayMapTypes.insertAt(0, camadaOGC);



	</script>
</html>

