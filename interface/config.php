<?php
//utilizado para facilitar a carga de javascript das interfaces do i3geo
//tipo pode ser OL|OSM|GM (openlayers, OSM, google maps)
?>
i3GEO.configura.locaplic = i3GEO.util.protocolo() + "://"
+ window.location.host + "/i3geo";
i3GEO.configura.autotamanho = false;
i3GEO.Interface.IDCORPO = "contemImg";
i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.permiteLogin = true;

i3GEO.Interface.openlayers.TILES = true;

<?php
$tipo = filter_var($_GET["tipo"], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
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
?>
i3GEO.scrollerWidth = 0;

i3GEO.configura.guardaExtensao = true;
i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza = 'if($i("omenudataInterface1")){i3GEOoMenuBar.getMenuItem("omenudataInterface1").cfg.setProperty("text", " ");}';

i3GEO.configura.mapaRefDisplay = "none";
i3GEO.barraDeBotoes.ATIVA = false;
i3GEO.configura.oMenuData["submenus"]["janelas"] = [];
i3GEO.ajuda.ATIVAJANELA = false;
i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios = false;
i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS = false;
i3GEO.arvoreDeCamadas.MOSTRALISTAKML = false;
i3GEO.arvoreDeCamadas.MOSTRATITULO = true;
i3GEO.mapa.AUTORESIZE = true;
i3GEO.guias.TIPO = "movel";
i3GEO.guias.guiaMovel.config.topGuiaMovel = 36;
i3GEO.janela.ativaAlerta();
i3GEO.finaliza = function() {
	if ($i("i3GEOlogoMarca")) {
		$i("i3GEOlogoMarca").style.display = "none";
	}
};
//indica se a opcao de navegacao nas pastas do servidor sera ativada
i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir = true;
i3GEO.janela.TRANSICAOSUAVE = true;
//desliga a camada com o mapa mundi
i3GEO.configura.mashuppar = "&desligar=mundo";
(function() {
	if(typeof ol != "undefined" && i3GEO.Interface.googleLike === false){
		var eng = new ol.layer.Tile(
				{
					title : "ESRI National Geographic",
					visible : true,
					isBaseLayer : true,
					name : "eng",
					source : new ol.source.TileArcGISRest(
							{
								url : "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a href="http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var oce = new ol.layer.Tile(
				{
					title : "ESRI Ocean Basemap",
					visible : false,
					isBaseLayer : true,
					name : "oce",
					source : new ol.source.TileArcGISRest(
							{
								url : "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a href="http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var ims = new ol.layer.Tile(
				{
					title : "ESRI Imagery World 2D",
					visible : false,
					isBaseLayer : true,
					name : "ims",
					source : new ol.source.TileArcGISRest(
							{
								url : "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a href="http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var wsm = new ol.layer.Tile(
				{
					title : "ESRI World Street Map",
					visible : false,
					isBaseLayer : true,
					name : "wsm",
					source : new ol.source.TileArcGISRest(
							{
								url : "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer",
								attributions : [ new ol.Attribution(
										{
											html : 'Tiles &copy; <a href="http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer">ArcGIS</a>'
										}) ]
							})
				});
		var bra = new ol.layer.Tile(
				{
					title : "Base carto MMA",
					visible : false,
					isBaseLayer : true,
					name : "bra",
					source : new ol.source.TileWMS(
							{
								url : "http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map&",
								params : {
									'layers' : "baseraster",
									'srs' : "EPSG:4326",
									'format' : "image/png"
								}
							})
				});
		var tms = new ol.layer.Tile(
				{
					title : "OSGEO",
					visible : false,
					isBaseLayer : true,
					name : "tms",
					source : new ol.source.TileWMS(
							{
								url : "http://tilecache.osgeo.org/wms-c/Basic.py/",
								params : {
									'layers' : "basic",
									'type' : "png",
									'srs' : "EPSG:4326",
									'format' : "image/png",
									'VERSION' : '1.1.1'
								},
								attributions : [ new ol.Attribution(
										{
											html : '&copy; <a href="http://www.tilecache.org/">2006-2010, TileCache Contributors</a>'
										}) ]
							})
				});
		i3GEO.Interface.openlayers.LAYERSADICIONAIS = [ eng, oce, ims, wsm,
		                                                bra, tms ];
	}
	if(typeof ol != "undefined" && i3GEO.Interface.openlayers.googleLike === true){
			var attribOSMData = 'Map Data: &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors';
			var attribMapQuestAerial = 'Map Data: &copy; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">';
			var attribStamen = 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA';

			var osm = new ol.layer.Tile({
				title : "OSM",
				visible : true,
				isBaseLayer : true,
				name : "osm",
				source: new ol.source.OSM({
			    	  attributions : [new ol.Attribution({html: attribOSMData})],
			    	  crossOrigin : "anonymous",
			    	  url : "http://tile.openstreetmap.org/{z}/{x}/{y}.png"
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
			    	  url : "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
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
			    	  url : "http://tile.stamen.com/toner/{z}/{x}/{y}.png"
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
			    	  url : "http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
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
			    	  url : "http://oatile4.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg"
			      })
			    });

			i3GEO.Interface.openlayers.LAYERSADICIONAIS = [ osm, aquarela, toner, tonerlite, layMapQuestAerial ];
	}
})();
//para a interface googlemaps
if(i3GEO.Interface.ATUAL === "googlemaps"){
	i3GEO.configura.diminuiyM = 1;
	i3GEO.configura.diminuiyN = 1;
	i3GEO.Interface.googlemaps.MAPOPTIONS = {
		scaleControl : true,
		mapTypeControl:true,
		mapTypeControlOptions: {
			position:google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControl:true,
		zoomControlOptions: {
			style:google.maps.ZoomControlStyle.SMALL,
			position:google.maps.ControlPosition.LEFT_CENTER
		},
		streetViewControl:true,
		streetViewControlOptions: {
			position:google.maps.ControlPosition.LEFT_CENTER
		}
	};
}
