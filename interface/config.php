<?php
//utilizado para facilitar a carga de javascript das interfaces do i3geo
//tipo pode ser OL|OSM|GM (openlayers, OSM, google maps)

$tipo = filter_var($_GET["tipo"], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
//e necessario definir isso pq os parametros de config ficam mais adiante no script em linha da interface
if($tipo == "OL"){
	echo 'i3GEO.Interface.ATUAL = "openlayers";';
	echo 'i3GEO.Interface.openlayers.googleLike = false;';
}
if($tipo == "OSM"){
	echo 'i3GEO.Interface.ATUAL = "openlayers";';
	echo 'i3GEO.Interface.openlayers.googleLike = true;';
}
if($tipo == "GM"){
	echo 'i3GEO.Interface.ATUAL = "googlemaps";';
}
//para comodidade de nao ter de calcular isso
$u = basename(dirname(dirname(__FILE__)));
echo 'i3GeoUrl = i3GEO.util.protocolo() + "://" + window.location.host + "/'.$u.'";';
?>
i3GEO.janela.ativaAlerta();

(function() {
	if(typeof ol != "undefined" && i3GEO.Interface.openlayers.googleLike === false){
		var eng = new ol.layer.Tile(
				{
					title : "ESRI National Geographic",
					visible : true,
					isBaseLayer : true,
					name : "eng",
                    preview : "<img class='img-responsive img-thumbnail' src='https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256,256&BBOX=-67.5,-22.5,-45,0&BBOXSR=4326&IMAGESR=4326&DPI=90' >",
					source : new ol.source.TileArcGISRest(
							{
								crossOrigin : "anonymous",
                                url : "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a  href="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var oce = new ol.layer.Tile(
				{
					title : "ESRI Ocean Basemap",
					visible : false,
					isBaseLayer : true,
					name : "oce",
                    preview : "<img class='img-responsive img-thumbnail' src='https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256,256&BBOX=-67.5,-22.5,-45,0&BBOXSR=4326&IMAGESR=4326&DPI=90' >",
					source : new ol.source.TileArcGISRest(
							{
								crossOrigin : "anonymous",
                                url : "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a  href="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var ims = new ol.layer.Tile(
				{
					title : "ESRI Imagery World 2D",
					visible : false,
					isBaseLayer : true,
					name : "ims",
                    preview : "<img class='img-responsive img-thumbnail' src='https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256,256&BBOX=-67.5,-22.5,-45,0&BBOXSR=4326&IMAGESR=4326&DPI=90' >",
					source : new ol.source.TileArcGISRest(
							{
								crossOrigin : "anonymous",
                                url : "https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a  href="https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var wsm = new ol.layer.Tile(
				{
					title : "ESRI World Street Map",
					visible : false,
					isBaseLayer : true,
					name : "wsm",
                    preview : "<img class='img-responsive img-thumbnail' src='http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&SIZE=256,256&BBOX=-67.5,-22.5,-45,0&BBOXSR=4326&IMAGESR=4326&DPI=90' >",
					source : new ol.source.TileArcGISRest(
							{
								crossOrigin : "anonymous",
                                url : "https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a  href="https://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var bra = new ol.layer.Tile(
				{
					title : "Base carto MMA",
					visible : false,
					isBaseLayer : true,
					name : "bra",
                    preview: "<img src=http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&layers=baseraster&srs=EPSG:4326&format=image/png&WIDTH=256&HEIGHT=256&CRS=EPSG:4326&STYLES=&BBOX=-9.66796875,-48.427734375,-9.580078125,-48.33984375 >",
					source : new ol.source.TileWMS(
							{
								url : "http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map&",
								params : {
									'layers' : "baseraster",
									'srs' : "EPSG:4326",
									'format' : "image/png"
								},
                                crossOrigin : "anonymous"
							})
				});
		i3GEO.Interface.openlayers.LAYERSADICIONAIS = [ eng, oce, ims, wsm,
		                                                bra];
	}
	if(typeof ol != "undefined" && i3GEO.Interface.openlayers.googleLike === true){
			var attribOSMData = 'Map Data: &copy; <a  href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
			var attribMapQuestAerial = 'Map Data: &copy; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency, Tiles Courtesy of <a href="https://www.mapquest.com/" target="_blank">MapQuest</a> <img src="https://developer.mapquest.com/content/osm/mq_logo.png">';
			var attribStamen = 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA';

			var osm = new ol.layer.Tile({
				title : "OSM",
				visible : true,
				isBaseLayer : true,
				name : "osm",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribOSMData})],
			    	  crossOrigin : "anonymous",
			    	  url : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
			      })
			    });
			var aquarela = new ol.layer.Tile({
				title : "Aquarela",
				visible : false,
				isBaseLayer : true,
				name : "aquarela",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribStamen})],
			    	  crossOrigin : "anonymous",
			    	  url : "https://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
			      })
			    });
			var toner = new ol.layer.Tile({
				title : "Toner",
				visible : false,
				isBaseLayer : true,
				name : "toner",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribStamen})],
			    	  crossOrigin : "anonymous",
			    	  url : "https://tile.stamen.com/toner/{z}/{x}/{y}.png"
			      })
			    });
			var tonerlite = new ol.layer.Tile({
				title : "Toner Lite",
				visible : false,
				isBaseLayer : true,
				name : "tonerlite",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribStamen})],
			    	  crossOrigin : "anonymous",
			    	  url : "https://tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
			      })
			    });
			var layMapQuestAerial = new ol.layer.Tile({
				title : "MapQuest Open Aerial",
				visible : false,
				isBaseLayer : true,
				name : "layMapQuestAerial",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribMapQuestAerial})],
			    	  crossOrigin : "anonymous",
			    	  url : "https://oatile4.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg"
			      })
			    });
			i3GEO.Interface.openlayers.LAYERSADICIONAIS = [ osm, aquarela, toner, tonerlite, layMapQuestAerial ];
	}
})();