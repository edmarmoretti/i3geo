<?php
include("../../classesphp/pega_variaveis.php");
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello World!</title>
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
    </style>
  </head>
<body>
  <div id="cesiumContainer"></div>
  <script>
    var viewer = new Cesium.Viewer(
		'cesiumContainer',
		{
			timeline : false
		}
    );
    // Add a WMS imagery layer

    var imageryLayers = viewer.imageryLayers;
	viewer.dataSources.add(Cesium.KmlDataSource.load('<?php echo $kmlurl;?>'))
  </script>
</body>
</html>
