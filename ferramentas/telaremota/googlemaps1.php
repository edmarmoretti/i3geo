<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="../../pacotes/cpaint/cpaint2_compacto.inc.js"></script>
</head>
<body onload="inicia()">
<div id=googlemapsdiv style="width:100%;height:100%;"></div>
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
	
	mapaRemoto = new google.maps.Map($i("googlemapsdiv"),{scaleControl:true});
	mapaRemoto.setMapTypeId("terrain");
	
	i3GeoMapOverlay = new google.maps.OverlayView();
	i3GeoMapOverlay.draw = function() {};
	criaLayer();
	i3GeoMapOverlay.setMap(mapaRemoto);
	recuperaMapa();
}
function criaLayer(){
	i3GEOTileO = new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var url = "../../classesphp/mapa_googlemaps.php?DESLIGACACHE=sim&g_sid=<?php echo $_GET["g_sid"];?>" +
				"&Z="+ zoom + "&X=" + coord.x + "&Y=" + coord.y + "&layer=&telaR=<?php echo $_GET["telaR"];?>&r="+Math.random();
			return url;
		},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		name: "Remoto"
	});	
	mapaRemoto.overlayMapTypes.insertAt(0, i3GEOTileO);
}
function zoom2ext(ext){
	var ret = ext.split(" ");
	sw = new google.maps.LatLng(ret[1],ret[0]);
	ne = new google.maps.LatLng(ret[3],ret[2]);
	mapaRemoto.fitBounds(new google.maps.LatLngBounds(sw,ne));	
}
function atualizaMapa(){
	mapaRemoto.overlayMapTypes.removeAt(0);
	criaLayer();
}
function recuperaMapa(){
	var temp = function(retorno){
		if(!retorno.data){
			setTimeout('recuperaMapa()',<?php echo $_GET["tempo"];?>);
			return;
		}
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
