<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="../../pacotes/cpaint/cpaint2_compacto.inc.js"></script>
<script type="text/javascript" src="../../pacotes/yui290/build/yahoo/yahoo-min.js"></script>
<script type="text/javascript" src="../../pacotes/yui290/build/dom/dom-min.js"></script>
</head>
<body onload="inicia()">
<div id=googlemapsdiv style="width:500px;height:500px;"></div>
<script>

/*
Title: Interface GoogleMaps para a ferramenta tela remota

Clone de um mapa aberto no i3Geo.

O clone monitora as mudanças no mapa original e aplica a extensão geográfica e recarrega o mapfile utilizado no original.

A abertura de um clone só é possível tendo-se o código de abertura, gerado pela ferramenta Tela Remota do i3Geo

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/googlemaps1.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

/*
Title: Tela remota - Google Maps

Interface baseada na API Google Maps utilizada na apresentação remota do mapa em uso.

Parametros:

g_sid {string} - código da "section" PHP aberta na criação do mapa em uso

telaR {string} - código especial que autoriza o uso do mapa atual em um navegador diferente daquele utilizado na criação do mapa em uso

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

function inicia(){
	var mapa = document.getElementById("googlemapsdiv");
	mapa.style.width = YAHOO.util.Dom.getViewportWidth() - 30 + "px";
	mapa.style.height = YAHOO.util.Dom.getViewportHeight() - 30 + "px";
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