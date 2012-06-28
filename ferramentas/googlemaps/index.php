<?php
include("../../ms_configura.php");
?>
<html>
<head>
<script src="../../pacotes/cpaint/cpaint2.inc.compressed.js" type="text/javascript"></script>
<script type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=<?php echo $googleApiKey; ?>"></script>
<script type="text/javascript">
/*
Title: Google Maps

Abre um mapa, baseado na API do Google Maps, que permite navegar de forma integrada com o mapa principal do i3Geo.

O c&oacute;digo da API do Google Maps &eacute; armazenada em i3geo/ms_configura.php

Veja:

<i3GEO.navega.google>

Arquivo:

i3geo/ferramentas/googlemaps/index.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
Function: inicializa

Cria o mapa do Google Maps e adiciona os bot&otilde;es especiais do i3Geo. Define os eventos que disparam modifica&ccedil;&otilde;es no mapa
principal do i3Geo quando &eacute; feita a navega&ccedil;ão.
*/ 
function inicializa(){
	window.parent.i3GEO.util.criaPin("boxpingoogle",window.parent.i3GEO.configura.locaplic+'/imagens/dot1red.gif',"5px","5px");
	var box = window.parent.$i("boxpingoogle");
	counterClick = 0
    var m = document.getElementById("mapa")
	if(window.parent.i3GEO){
    	m.style.width = (window.parent.i3GEO.parametros.w / 2) - 20 + "px";
    	m.style.height = (window.parent.i3GEO.parametros.h / 2) -20 + "px";
		i3geoOverlay = false;
		if(window.parent.document.getElementById("boxg"))
		window.parent.document.getElementById("boxg").style.zIndex = 0
    	navm = false; // IE
    	navn = false; // netscape
    	var app = navigator.appName.substring(0,1);
    	if (app=='N') navn=true; else navm=true;
    	docmapa = window.parent.document
    	pol = window.parent.i3GEO.parametros.mapexten
    	ret = pol.split(" ")
    	pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1
    	pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1
    	pt = pt1+","+pt2
		try{
			var coordenadas = window.parent.i3GEO.navega.dialogo.google.coordenadas;
		}
		catch(e){}
	}
	else{
		var pt1 = -54;
		var pt2 = -12;
	}
    map = new GMap2(m);
    map.setMapType(G_SATELLITE_MAP);
    map.addMapType(G_SATELLITE_3D_MAP);
    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.addControl(new GScaleControl());
    map.setCenter(new GLatLng(pt2,pt1), 8);
	if(coordenadas)
	{adicionaMarcasMapa(coordenadas);}
    GEvent.addListener(map, "moveend", function() {
    	ondegoogle(map);
    });
   	GEvent.addListener(map, "zoomend", function() {
		if(window.parent.i3GEO){
   			ondegoogle();
   			try{
				map.removeOverlay(wmsmap);
				wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
				map.addOverlay(wmsmap);
   			}catch(x){}
		}
   	}); 	
   	GEvent.addListener(map, "dragend", function() {
		if(window.parent.i3GEO){
			ondegoogle();
			try{
				map.removeOverlay(wmsmap);
   				wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
				map.addOverlay(wmsmap);
			}catch(x){}
		}
   	});
	GEvent.addListener(map, "mousemove", function(ponto) {
		var teladms,tela,temp,
			mapexten = window.parent.i3GEO.parametros.mapexten;
		teladms = window.parent.i3GEO.calculo.dd2dms(ponto.x,ponto.y);
		//tela = map.getProjection().fromLatLngToPixel(ponto);
		window.parent.objposicaocursor = {
			ddx: ponto.x,
			ddy: ponto.y,
			dmsx: teladms[0],
			dmsy: teladms[1],
			imgx:0,
			imgy:0,
			telax: 0,
			telay: 0
		};
		window.parent.i3GEO.eventos.mousemoveMapa();
		if(window.parent.i3GEO.Interface.ATUAL === "googleearth")
		{return;}
	 	temp = mapexten.split(" ");
		if(ponto.x < temp[2] && ponto.y < temp[3]){
			xy = window.parent.i3GEO.calculo.dd2tela(ponto.x,ponto.y,window.parent.document.getElementById(window.parent.i3GEO.Interface.IDMAPA),mapexten,window.parent.i3GEO.parametros.pixelsize);
			box.style.display = "block";
			box.style.width = "5px";
			box.style.height = "5px";
			box.style.top = (parseInt(xy[1],10) + 2.5) +"px";
			box.style.left = (parseInt(xy[0],10) - 2.5) +"px";
		}
	});
	function botaoI3geo() {}
    botaoI3geo.prototype = new GControl();
    botaoI3geo.prototype.initialize = function(map) {
		var container = document.createElement("div");
		var i3geo = document.createElement("div");
		this.setButtonStyle_(i3geo);
    	container.appendChild(i3geo);
      	i3geo.appendChild(document.createTextNode("i3Geo"));
      	GEvent.addDomListener(i3geo, "click", function() {
        	//ativaI3geo();
			try
			{map.removeOverlay(wmsmap);wmsmap = null;}
			catch(x){
				wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
				map.addOverlay(wmsmap);
				if(typeof(console) !== 'undefined'){console.error(x);}
			}
      	});

      	var rota = document.createElement("div");
      	this.setButtonStyle_(rota);
      	container.appendChild(rota);
      	rota.appendChild(document.createTextNode("Rota"));
      	GEvent.addDomListener(rota, "click", function() {
      		ativaI3geoRota();
      	});
      	map.getContainer().appendChild(container);
      	return container;
    }
    botaoI3geo.prototype.getDefaultPosition = function() {
      	return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(50, 50));
    }
    botaoI3geo.prototype.setButtonStyle_ = function(button) {
      	button.style.textDecoration = "none";
      	button.style.color = "black";
      	button.style.backgroundColor = "white";
      	button.style.font = "small Arial";
      	button.style.border = "1px solid black";
      	button.style.padding = "1px";
      	button.style.marginBottom = "3px";
      	button.style.textAlign = "center";
      	button.style.width = "3em";
      	button.style.cursor = "pointer";
    }
    if(window.parent.i3GEO){
    	if(window.parent.i3GEO.parametros.mapfile)
		map.addControl(new botaoI3geo());
		ondegoogle(map);
    }
	if(coordenadas)
	{adicionaMarcasMapa(coordenadas);}
}
function moveMapa(bd)
{
	if(!window.parent.i3GEO){return;}
	nex = bd.minX+" "+bd.minY+" "+bd.maxX+" "+bd.maxY
	var p = window.parent.i3GEO.locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+nex
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",window.parent.i3GEO.atualiza);
}
/*
Function: ondegoogle

Mostra, no mapa principal, um retângulo indicando a extensão geogr&aacute;fica do mapa mostrado na janela do GM
*/
function ondegoogle()
{
	if(!window.parent.i3GEO){return;}
	var bd = map.getBounds();
	var so = bd.getSouthWest();
	var ne = bd.getNorthEast();
	var xyMin = window.parent.i3GEO.calculo.dd2tela(so.lng(),so.lat(),window.parent.document.getElementById(window.parent.i3GEO.Interface.IDMAPA),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize);
	var xyMax = window.parent.i3GEO.calculo.dd2tela(ne.lng(),ne.lat(),window.parent.document.getElementById(window.parent.i3GEO.Interface.IDMAPA),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize);
	
	var box = window.parent.$i("boxg")
	var w = xyMax[0]-xyMin[0]
	var h = xyMin[1]-xyMax[1]
	box.style.display = "block"
	box.style.width = w + "px"
	box.style.height = h+3 + "px"
	box.style.top = xyMax[1]+"px"
	box.style.left = xyMin[0]+"px"
	box.style.display="block"
}
/*
Function: panTogoogle

Desloca o mapa principal conforme a extensão geogr&aacute;fica do mapa do GM
*/
function panTogoogle()
{
	if(!window.parent.i3GEO){return;}
	var b = window.parent.document.getElementById("boxg");
	b.style.display="block";
	pol = window.parent.i3GEO.parametros.mapexten;
	ret = pol.split(" ");
	pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
	pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
	map.panTo(new GLatLng(pt2,pt1))
	//ondegoogle();
}
/*
Function: bbox

Obt&eacute;m os valores de extensão geogr&aacute;fica do GM e converte para uma string no formato aceito pelo i3Geo

Return:

{String} - xmin ymin xmax ymax
*/
function bbox()
{
	var bd = map.getBounds();
	var so = bd.getSouthWest();
	var ne = bd.getNorthEast();
	var bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat()
	return (bbox)
}
/*
Function: criaWMS

Formata uma URL que transforma o mapa atual do i3Geo em um WMS, possibilitando sua inclusão como uma camada na janela GM.

Return:

[String} - URL WMS
*/
function criaWMS()
{
	var cgi = window.parent.i3GEO.configura.locaplic+"/classesphp/parse_cgi.php?g_sid="+window.parent.i3GEO.configura.sid
	var parametros = "&map_size="+parseInt(document.getElementById("mapa").style.width)
	parametros += ","+parseInt(document.getElementById("mapa").style.height)
	parametros += "&mapext="+bbox()
	parametros += "&map_imagecolor=0 0 0&map_transparent=on"
	return(cgi+parametros)
}
function criaTile(){
	var cgi = window.parent.i3GEO.util.protocolo()+"://"+window.location.host+window.parent.i3GEO.parametros.cgi+"?";
	var parametros = "map="+window.parent.i3GEO.parametros.mapfile;
	parametros += "&map.scalebar=status+off&map_imagecolor=-1 -1 -1&map_transparent=on"
	parametros += '&mode=tile';
	parametros += '&tilemode=gmap';
	parametros += '&tile={X}+{Y}+{Z}';
	return(cgi+parametros);		
}
function ativaI3geo()
{
	var i3GEOTile = new GTileLayer(null,0,18,{
		 tileUrlTemplate:criaTile(),
		 isPng:true,
		 opacity:1 });
	i3GEOTileO = new GTileLayerOverlay(i3GEOTile);
	map.addOverlay(i3GEOTileO);
}
/*
Function: ativaI3geoRota

Inicia a fun&ccedil;ão de cria&ccedil;ão de rotas, solicitando a indica&ccedil;ão do primeiro ponto
*/
function ativaI3geoRota()
{
	rotaEvento = GEvent.addListener(map, "click", parametrosRota);
	alert("Clique o ponto de origem da rota");
	counterClick++;
}
/*
Function: parametrosRota

Obt&eacute;m os parâmetros para cria&ccedil;ão da rota, inclusive o ponto de destino
*/
function parametrosRota(overlay,latlng)
{
	if(counterClick == 1)
	{	
		counterClick++;
		alert("Clique o ponto de destino da rota");
		pontoRota1 = latlng
		return;
	}
	if(counterClick == 2)
	{
		cursor("wait");
		pontoRota2 = latlng
		counterClick = 0;
		GEvent.removeListener(rotaEvento)
		constroiRota()
		montaRota();
	}
}
/*
Function: constroiRota

Cria a rota do ponto de origem ao ponto de destino
*/
function constroiRota()
{
	geocoder = new GClientGeocoder();
	var pt2 = function(response)
	{
		if (!response || response.Status.code != 200) {
			alert("Status Code:" + response.Status.code);
			cursor("default");
		} else {
			place = response.Placemark[0];
			point = new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]);
			marker = new GMarker(point);
			map.addOverlay(marker);
			endereco2 = place.address;
			endereco2 = window.prompt("Endereco do final",endereco2)
			if (endereco2!=null && endereco2!="")
			{
				map.addOverlay(marker);
				montaRota();
			}
		}
	}
	
	var pt1 = function(response)
	{  	
		map.clearOverlays();
		if (!response || response.Status.code != 200) {
			alert("Status Code:" + response.Status.code);
		} else {
			place = response.Placemark[0];
			point = new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]);
			marker = new GMarker(point);
			marker.openInfoWindowHtml(
				'<b>orig latlng:</b>' + response.name + '<br/>' + 
				'<b>latlng:</b>' + place.Point.coordinates[0] + "," + place.Point.coordinates[1] + '<br>' +
				'<b>Status Code:</b>' + response.Status.code + '<br>' +
				'<b>Status Request:</b>' + response.Status.request + '<br>' +
				'<b>Address:</b>' + place.address + '<br>' +
				'<b>Accuracy:</b>' + place.AddressDetails.Accuracy + '<br>' +
				'<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
			endereco1 = place.address;
			endereco1 = window.prompt("Endereco do inicio",endereco1)
			if (endereco1!=null && endereco1!="")
			{
				map.addOverlay(marker);
				geocoder.getLocations(pontoRota2, pt2);
			}
		}
	}
	//geocoder.getLocations(pontoRota1, pt1);
}
/*
Function: montaRota

Inclui o tra&ccedil;ado da rota como uma nova camada no mapa principal
*/
function montaRota()
{
	if(!document.getElementById("descrota"))
	{
		var descrota = document.createElement("div");
		descrota.id = "descrota"
		document.body.appendChild(descrota);
	}
	else
	{
		descrota = document.getElementById("descrota")
		descrota.innerHTML = ""
	}
	directions = new GDirections(map, descrota);
	//directions.load("from: "+endereco1+" to: "+endereco2);
	directions.load("from: "+pontoRota1.lat()+","+pontoRota1.lng()+" to: "+pontoRota2.lat()+","+pontoRota2.lng());
	GEvent.addListener(directions, "load", function() {
		var linha = directions.getPolyline();
		var nvertices = linha.getVertexCount();
		pontos = new Array()
		for(i=0;i<nvertices;i++)
		{
			var vertice = linha.getVertex(i);
			pontos.push(vertice.lng()+" "+vertice.lat())
		}
		function ativanovotema(retorno)
		{
			var temaNovo = retorno.data
			var converteParaLinha = function()
			{
				var cp = new cpaint();
				cp.set_response_type("JSON");
				//cp.set_debug(2) 
				var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.i3GEO.configura.sid+"&funcao=sphPT2shp&para=linha&tema="+temaNovo;
				cp.call(p,"sphPT2shp",window.parent.i3GEO.atualiza);
				cursor("default");
			}
			var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.i3GEO.configura.sid+"&funcao=insereSHP&tema="+retorno.data;
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.set_transfer_mode('POST');
			cp.call(p,"insereSHP",converteParaLinha,"&xy="+pontos.join(" "));
		}
		var cp = new cpaint();
		cp.set_response_type("JSON");
		cp.set_transfer_mode("POST");
		var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.i3GEO.configura.sid;
		cp.call(p,"criaSHPvazio",ativanovotema,"&funcao=criashpvazio");
	});
}
/*
Function: adicionaMarcasMapa

Adiciona marcas no mapa conforme um array de coordenadas

Parametro:

coordenadas {array} - array de pares separados por ' ' contendo x e y
*/
function adicionaMarcasMapa(coordenadas){
	var n = coordenadas.length,i,pt,point,marker;
	for(i=0;i<n;i++){
		pt = coordenadas[i].split(" ");
		point = new GLatLng(pt[1],pt[0]);
		marker = new GMarker(point);
		map.addOverlay(marker);
	}
}
function cursor(c){
	var d = document.getElementById("mapa");
	d.firstChild.style.cursor = c;
}
    </script>
  </head>
  <body onload="inicializa()">
    <div id="mapa" style="width: 440px; height: 340px"></div>
    </body>
</html>