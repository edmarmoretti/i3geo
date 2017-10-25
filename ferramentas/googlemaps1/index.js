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
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
Function: inicializa

Cria o mapa do Google Maps e adiciona os bot&otilde;es especiais do i3Geo. Define os eventos que disparam modifica&ccedil;&otilde;es no mapa
principal do i3Geo quando &eacute; feita a navega&ccedil;&atilde;o.
*/
navm = false; // IE
navn = false; // netscape
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
i3GEO = window.parent.i3GEO;
MARCA = false;
BOX = false;
ATUALIZABOX = true;
$i = function(id){
	return window.parent.document.getElementById(id);
};
function inicializa(){
	if(i3GEO.parametros.googleApiKey == ""){
		i3GEO.janela.tempoMsg("Essa instala&ccedil;&atilde;o do i3Geo n&atilde;o possu&iacute; uma chave da API do GoogleMaps. Algumas opera&ccedil;&otilde;es podem ficar bloqueadas.");
	}
	counterClick = 0;
	var m = document.getElementById("mapa"),
		nz = 8,
		coordenadas = false,
		pol,ret,pt1,pt2,centro;
	if(i3GEO){
		m.style.width = (i3GEO.parametros.w / 2.5) - 20 + "px";
		m.style.height = (i3GEO.parametros.h / 2.5) -20 + "px";
		i3geoOverlay = false;
		try{
			coordenadas = i3GEO.navega.dialogo.google.coordenadas;
		}
		catch(e){}
		pol = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		ret = pol.split(" ");
		pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
		pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
	}
	else{
		pt1 = -54;
		pt2 = -12;
	}
	centro = new google.maps.LatLng(pt2,pt1);
	if(i3GEO && i3GEO.Interface.ATUAL === "openlayers"){
		nz = window.parent.i3geoOL.getZoom() + 2;
	}
	map = new google.maps.Map(m,{zoom:nz,center:centro,scaleControl:true,mapTypeControl:true,streetViewControl:true,zoomControl:true,mapTypeId:google.maps.MapTypeId.SATELLITE});
	if(coordenadas != false){
		adicionaMarcasMapa(coordenadas);
	}

	google.maps.event.addListener(map, "moveend", function() {
		ondegoogle(map);
	});
	google.maps.event.addListener(map, "bounds_changed", function() {
		if(i3GEO){
			//evita loop entre os eventos do i3geo e do googlemaps
			if(ATUALIZABOX === true){
				var bd = map.getBounds();
				var centro = bd.getCenter();
				i3GEO.Interface[i3GEO.Interface.ATUAL].pan2ponto(centro.lng(),centro.lat());
			}
			ATUALIZABOX = true;
			ondegoogle();
		}
	});
	google.maps.event.addListener(map, "mousemove", function(ponto) {
		var teladms,temp,
			mapexten = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
			x = ponto.latLng.lng(),
			y = ponto.latLng.lat();
		teladms = i3GEO.calculo.dd2dms(x,y);
		window.parent.objposicaocursor = {
			ddx: x,
			ddy: y,
			dmsx: teladms[0],
			dmsy: teladms[1],
			imgx:0,
			imgy:0,
			telax: 0,
			telay: 0
		};
		i3GEO.eventos.mousemoveMapa();
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		temp = mapexten.split(" ");
		if(x < temp[2] && y < temp[3]){
			if(MARCA === false){
				MARCA = i3GEO.desenho.addPin(x,y,"","",i3GEO.configura.locaplic+'/imagens/google/confluence.png',"googlemaps");
			}
			else{
				i3GEO.desenho.movePin(MARCA,x,y);
			}
		}
	});
	if(i3GEO){
		ondegoogle(map);
	}
	botaoRota();
	if(coordenadas)
	{adicionaMarcasMapa(coordenadas);}
}
function botaoI3geo(){
	var controlDiv = document.createElement('div');
	controlDiv.index = 1;
	controlDiv.style.padding = '5px';
	// Set CSS for the control border
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Adiciona o mapa ao Google';
	controlDiv.appendChild(controlUI);
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.innerHTML = '<b>i3Geo</b>';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
		wmsmap = new google.maps.GroundOverlay(criaWMS(), map.getBounds(),{map: map});
	});
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
}
function botaoRota(){
	var controlDiv = document.createElement('div');
	controlDiv.index = 1;
	controlDiv.style.padding = '5px';
	// Set CSS for the control border
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = '';
	controlDiv.appendChild(controlUI);
	var controlText = document.createElement('div');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.innerHTML = '<b>Rota</b>';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
		ativaI3geoRota();
	});
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
}
/*
Function: ondegoogle

Mostra, no mapa principal, um retangulo indicando a extens&atilde;o geogr&aacute;fica do mapa mostrado na janela do GM
*/
function ondegoogle(){
	if(!i3GEO || !map.getBounds()){return;}
	var b = bbox();
	b = b.split(" ");
	if(BOX === false){
		BOX = i3GEO.desenho.addBox(b[0], b[1], b[2], b[3], "boxOndeGoogle");
	}
	else{
		BOX = i3GEO.desenho.moveBox(BOX,b[0], b[1], b[2], b[3]);
	}
}
function moveMapa(bd){
	if(!i3GEO){return;}
	nex = bd.minX+" "+bd.minY+" "+bd.maxX+" "+bd.maxY;
	var p = i3GEO.locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+nex;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",i3GEO.atualiza);
}
/*
Function: panTogoogle

Desloca o mapa do google quando o mapa principal e deslocado
*/
function panTogoogle(){
	if(!i3GEO){return;}
	ATUALIZABOX = false;
	var pol = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	var ret = pol.split(" ");
	var pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
	var pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
	map.panTo(new google.maps.LatLng(pt2,pt1));
}
/*
Function: bbox

Obt&eacute;m os valores de extens&atilde;o geogr&aacute;fica do GM e converte para uma string no formato aceito pelo i3Geo

Return:

{String} - xmin ymin xmax ymax
*/
function bbox(){
	var bd = map.getBounds();
	var so = bd.getSouthWest();
	var ne = bd.getNorthEast();
	var bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();
	return (bbox);
}
/*
Function: criaWMS

Formata uma URL que transforma o mapa atual do i3Geo em um WMS, possibilitando sua inclus&atilde;o como uma camada na janela GM.

Return:

[String} - URL WMS
*/
function criaWMS(){
	var cgi = i3GEO.configura.locaplic+"/classesphp/parse_cgi.php?g_sid="+i3GEO.configura.sid;
	var parametros = "&map_size="+parseInt(document.getElementById("mapa").style.width);
	parametros += ","+parseInt(document.getElementById("mapa").style.height);
	parametros += "&mapext="+bbox();
	parametros += "&map_imagecolor=0 0 0&map_transparent=on";
	return(cgi+parametros);
}
function criaTile(){
	//depreciar???
	var cgi = window.parent.i3GEO.util.protocolo()+"://"+window.location.host+window.parent.i3GEO.parametros.cgi+"?";
	var parametros = "map="+window.parent.i3GEO.parametros.mapfile;
	parametros += "&map.scalebar=status+off&map_imagecolor=-1 -1 -1&map_transparent=on";
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

Inicia a fun&ccedil;&atilde;o de cria&ccedil;&atilde;o de rotas, solicitando a indica&ccedil;&atilde;o do primeiro ponto
*/
function ativaI3geoRota(){
	rotaEvento = google.maps.event.addListener(map, "click", parametrosRota);
	i3GEO.janela.tempoMsg("Clique o ponto de origem da rota");
	counterClick++;
}
/*
Function: parametrosRota

Obt&eacute;m os parametros para cria&ccedil;&atilde;o da rota, inclusive o ponto de destino
*/
function parametrosRota(overlay){
	if(counterClick == 1){
		counterClick++;
		i3GEO.janela.tempoMsg("Clique o ponto de destino da rota");
		pontoRota1 = overlay.latLng;
		return;
	}
	if(counterClick == 2){
		pontoRota2 = overlay.latLng;
		counterClick = 0;
		google.maps.event.removeListener(rotaEvento);
		constroiRota();
		//montaRota();
	}
}
/*
Function: constroiRota

Cria a rota do ponto de origem ao ponto de destino
*/
function constroiRota(){
	var pt2 = function(response,status){
		if (status == google.maps.GeocoderStatus.OK) {
			var place = response[0];
			endereco2 = place.formatted_address;
			endereco2 = i3GEO.janela.prompt(
				"Confirme o endereco do final",
				function(){
					montaRota();
				},
				endereco2
			);
		}
		else{
			i3GEO.janela.tempoMsg("Ocorreu um erro");
		}
	};
	var pt1 = function(response,status){
		//map.clearOverlays();
		if (status == google.maps.GeocoderStatus.OK) {
			var place = response[0];
			endereco1 = place.formatted_address;
			endereco1 = i3GEO.janela.prompt(
				"Confirme o endereco do inicio",
				function(){
					geocoder.geocode(
						{'location':pontoRota2},
						pt2
					);
				},
				endereco1
			);
		}
		else{
			i3GEO.janela.tempoMsg("Ocorreu um erro");
		}
	};
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode(
		{'location':pontoRota1},
		pt1
	);
}
/*
Function: montaRota

Inclui o tra&ccedil;ado da rota como uma nova camada no mapa principal
*/
function montaRota(){
	if(!document.getElementById("descrota")){
		var descrota = document.createElement("div");
		descrota.id = "descrota";
		document.body.appendChild(descrota);
	}
	else{
		descrota = document.getElementById("descrota");
		descrota.innerHTML = "";
	}
	var directions = new google.maps.DirectionsService();
	directions.route(
		{origin: pontoRota1,destination: pontoRota2,'travelMode':google.maps.TravelMode.DRIVING},
		function(retorno, status) {
			if (status == google.maps.GeocoderStatus.OK){
				var i,p,nvertices,vertice,
					directionsDisplay = new google.maps.DirectionsRenderer();
				directionsDisplay.setPanel(descrota);
				directionsDisplay.setMap(map);
				directionsDisplay.setDirections(retorno);

				p = retorno.routes[0].overview_path;
				nvertices = p.length;
				pontos = [];
				for(i=0;i<nvertices;i++){
					vertice = p[i];
					pontos.push(vertice.lng()+" "+vertice.lat());
				}
				function ativanovotema(retorno){
					var temaNovo = retorno.data;
					var converteParaLinha = function(){
						var cp = new cpaint();
						cp.set_response_type("JSON");
						var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=sphPT2shp&para=linha&tema="+temaNovo;
						cp.call(p,"sphPT2shp",i3GEO.atualiza);
					};
					var p = window.parent.i3GEO.configura.locaplic+"/ferramentas/inserexy2/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=insereSHP&tema="+retorno.data;
					var cp = new cpaint();
					cp.set_response_type("JSON");
					cp.set_transfer_mode('POST');
					cp.call(p,"insereSHP",converteParaLinha,"&xy="+pontos.join(" "));
				}
				var cp = new cpaint();
				cp.set_response_type("JSON");
				cp.set_transfer_mode("POST");
				var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid;
				cp.call(p,"criaSHPvazio",ativanovotema,"&funcao=criashpvazio");
			}
		}
	);
}
/*
Function: adicionaMarcasMapa

Adiciona marcas no mapa conforme um array de coordenadas

Parametro:

coordenadas {array} - array de pares separados por ' ' contendo x e y
*/
function adicionaMarcasMapa(coordenadas){
	if(coordenadas){
		var n = coordenadas.length,i,pt,point,marker;
		for(i=0;i<n;i++){
			pt = coordenadas[i].split(" ");
			point = new google.maps.LatLng(pt[1],pt[0]);
			marker = new google.maps.Marker({
					position : point
				});
			//marker = new GMarker(point);
			marker.setMap(map);
		}
	}
}