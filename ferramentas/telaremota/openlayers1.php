<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="../../pacotes/openlayers/OpenLayers29.js.php"></script>
<script type="text/javascript" src="../../pacotes/cpaint/cpaint2_compacto.inc.js"></script>
</head>
<body onload="inicia()">
<div id=openlayers style="width:100%;height:100%;"></div>
<script>
function inicia(){
	extentAnterior = "";
	contadorSalva = 0;
	$i = function(id){return document.getElementById(id);};
	navn = false;
	//seta as variáveis navn e navm
	navn = false;
	navm = false;
	var app = navigator.appName.substring(0,1);
	if (app==='N'){navn=true;}else{navm=true;}
	OpenLayers.ImgPath = "../../pacotes/openlayers/img/"
	OpenLayers.Lang.setCode("pt-BR");
	var urlLayer = "../../classesphp/mapa_openlayers.php?DESLIGACACHE=sim&g_sid=<?php echo $_GET["g_sid"];?>&telaR=<?php echo $_GET["telaR"];?>";
	var remoto = new OpenLayers.Layer.WMS(
		"Remoto",
		urlLayer,
		{transparent: "false", format: "image/png"},
		{isBaseLayer:false,singleTile:true}
	);
	var remotoFundo = new OpenLayers.Layer.WMS(
		"Fundo",
		urlLayer+"&tipolayer=fundo",
		{transparent: "false", format: "image/png"},
		{isBaseLayer:true,singleTile:true,visibility:true}
	);
	var bra = new OpenLayers.Layer.WMS( 
		"Base carto MMA",
		"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map",
		{layers:"baseraster",srs:"EPSG:4291",format:"image/png"},
		{isBaseLayer:true,visibility:false}
	);
	var osm = new OpenLayers.Layer.WMS( 
		"Open Street Map",
		"http://full.wms.geofabrik.de/std/demo_key",
		{layers:""},
		{isBaseLayer:true,visibility:false}
	);
	mapaRemoto = new OpenLayers.Map({
		div: "openlayers",
		controls: [
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.ScaleLine()
		] 		
	});	
	mapaRemoto.addLayers([remotoFundo,bra,osm,remoto]);
	recuperaMapa();
}
function zoom2ext(ext){
	var m,b;
	m = ext.split(" ");
	b = new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);
	mapaRemoto.zoomToExtent(b);
}
function atualizaMapa(){
	var layers = mapaRemoto.layers,
		nlayers = layers.length,
		i;
	for(i=0;i<nlayers;i++){
		layers[i].mergeNewParams({r:Math.random()});
		layers[i].url = layers[i].url.replace("&&&&&&&&&&&&&&","");
		layers[i].url = layers[i].url+"&&";				
		if(layers[i].visibility === true){
			layers[i].redraw();
		}
	}
}
function recuperaMapa(){
	var temp = function(retorno){
		if(!retorno.data){return;}
		retorno = retorno.data;
		if(extentAnterior != retorno.extent){
			zoom2ext(retorno.extent);
			extentAnterior = retorno.extent;
			contadorSalva = retorno.contadorsalva;
		}
		else{
			if(contadorSalva != retorno.contadorsalva){
				atualizaMapa()
				contadorSalva = retorno.contadorsalva;
			}
		}
		setTimeout('recuperaMapa()',<?php echo $_GET["tempo"];?>);
	};
	p = "recuperamapa.php?g_sid=<?php echo $_GET["g_sid"];?>&funcao=recupera";
	cp = new cpaint();
	cp.set_response_type("JSON");
	cp.call(p,"telaremota",temp);
}
</script>
</body>
</html>
