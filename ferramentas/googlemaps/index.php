<?php
include_once("../../ms_configura.php");
?>
<html>
<head>
<script src="../../pacotes/cpaint/cpaint2.inc.compressed.js" type="text/javascript"></script>
<script language="JavaScript" type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2.x&amp;key=<?php echo $googleApiKey; ?>">
</script>
<title></title>
  </head>
  <body onunload="GUnload()">
    <div id="map" style="width: 440px; height: 340px"></div>
  
    <script type="text/javascript" >
    counterClick = 0
    var m = document.getElementById("map")
    m.style.width = window.parent.objmapa.w / 2
    m.style.height = window.parent.objmapa.h / 2
    //chave na producao= ABQIAAAAg9kA9xQlYqK9iBDKaeTpgxSieGwtcPDeiUtRiq7Xa63cyLppcxTVYXnVlPwveOe-sXuXfpBeNpL6pA
    //chave no desenvolvimento = ABQIAAAAg9kA9xQlYqK9iBDKaeTpgxQ_qvn5wqSkbcx9uoqrWGnUcZ7lqhRVzkJwzeDN3nQJheG7FjoxyruBIQ
	i3geoOverlay = false;
	if(window.parent.document.getElementById("boxg"))
	window.parent.document.getElementById("boxg").style.zIndex = 0
    navm = false; // IE
    navn = false; // netscape
    var app = navigator.appName.substring(0,1);
    if (app=='N') navn=true; else navm=true;
    
    if(window.parent.objmapa)
    {
    	docmapa = window.parent.document
    	pol = window.parent.objmapa.extent
    	ret = pol.split(" ")
    	pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1
    	pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1
    	pt = pt1+","+pt2
    }
    else
    {
    	pt1 = "-54";
    	pt2 = "-12";
    }
    map = new GMap2(document.getElementById("map"));
    map.setMapType(G_SATELLITE_MAP);
    map.addMapType(G_SATELLITE_3D_MAP);
    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.addControl(new GScaleControl());
    map.setCenter(new GLatLng(pt2,pt1), 8);
    GEvent.addListener(map, "moveend", function() {
    	ondegoogle(map);
    });
    if(i3geoOverlay)
    {
    	//var boundaries = new GLatLngBounds(new GLatLng(40.716216,-74.213393), new GLatLng(40.765641,-74.139235));
    	wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
		map.addOverlay(wmsmap);
    }
    GEvent.addListener(map, "zoomend", function() {
    	ondegoogle();
    	if(i3geoOverlay)
    	{
    		map.removeOverlay(wmsmap);
    		wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
			map.addOverlay(wmsmap);
		}
    });
    GEvent.addListener(map, "dragend", function() {
    	if(i3geoOverlay)
    	{
    		map.removeOverlay(wmsmap);
    		wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
			map.addOverlay(wmsmap);
    	}
    });
    function botaoI3geo() {
    }
    botaoI3geo.prototype = new GControl();
    botaoI3geo.prototype.initialize = function(map) {
      var container = document.createElement("div");
 
      var i3geo = document.createElement("div");
      this.setButtonStyle_(i3geo);
      container.appendChild(i3geo);
      i3geo.appendChild(document.createTextNode("i3Geo"));
      GEvent.addDomListener(i3geo, "click", function() {
        ativaI3geo();
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
    if(window.parent.objmapa.mapfile)
	map.addControl(new botaoI3geo());

    function moveMapa(bd)
    {
    	nex = bd.minX+" "+bd.minY+" "+bd.maxX+" "+bd.maxY
    	var p = window.parent.g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+nex
    	var cp = new cpaint();
    	//cp.set_debug(2)
    	cp.set_response_type("JSON");
    	cp.call(p,"mudaExtensao",window.parent.ajaxredesenha);
    	//ondegoogle(bd);
    }
    function ondegoogle()
    {
    	if(window.parent.objmapa)
    	{
    		var bd = map.getBounds();
    		var so = bd.getSouthWest();
    		var ne = bd.getNorthEast();
    		var xyMin = window.parent.convddtela(so.lng(),so.lat(),window.parent.document);
    		var xyMax = window.parent.convddtela(ne.lng(),ne.lat(),window.parent.document);
			var box = window.parent.$i("boxg")
			var w = xyMax[0]-xyMin[0]
			var h = xyMin[1]-xyMax[1]
			box.style.display = "block"
			box.style.width = w
			box.style.height = h
			box.style.top = xyMax[1]+"px"
			box.style.left = xyMin[0]+"px"
    		box.style.display="block"
    	}
    }
    
    function panTogoogle()
    {
    	var b = window.parent.document.getElementById("boxg");
    	b.style.display="block";
    	pol = window.parent.objmapa.extent;
    	ret = pol.split(" ");
    	pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    	pt2 = (((ret[1] - ret[3]) / 2)* -1) + ret[1] *1;
    	//map.centerAndZoom(new GLatLng(pt2,pt1),map.getZoom());
    	//map.setZoom(level)
    	map.panTo(new GLatLng(pt2,pt1))
    }
    function bbox()
    {
		var bd = map.getBounds();
		var so = bd.getSouthWest();
		var ne = bd.getNorthEast();
		var bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat()
		return (bbox)
    }
    function criaWMS()
    {
    	var cgi = window.parent.g_locaplic+"/classesphp/parse_cgi.php?g_sid="+window.parent.g_sid
    	var parametros = "&map_size="+parseInt(document.getElementById("map").style.width)
    	parametros += ","+parseInt(document.getElementById("map").style.height)
    	parametros += "&mapext="+bbox()
    	parametros += "&map_imagecolor=-1 -1 -1&map_transparent=on"
    	//alert(cgi+parametros)
    	return(cgi+parametros)
    }
    function ativaI3geo()
    {
    	if(i3geoOverlay)
    	{
    		i3geoOverlay = false;
    		map.removeOverlay(wmsmap);
    	}
    	else
    	{
    		i3geoOverlay = true;
    		wmsmap = new GGroundOverlay(criaWMS(), map.getBounds());
			map.addOverlay(wmsmap);
    	}
    }
    function ativaI3geoRota()
    {
   		rotaEvento = GEvent.addListener(map, "click", parametrosRota);
   		alert("Clique o ponto de origem da rota");
   		counterClick++;
	}
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
    		pontoRota2 = latlng
    		counterClick = 0;
    		GEvent.removeListener(rotaEvento)
    		constroiRota()
    	}
    }
    
    function constroiRota()
    {
    	geocoder = new GClientGeocoder();
    	var pt2 = function(response)
    	{
  			if (!response || response.Status.code != 200) {
    			alert("Status Code:" + response.Status.code);
  			} else {
    			place = response.Placemark[0];
    			point = new GLatLng(place.Point.coordinates[1],place.Point.coordinates[0]);
    			marker = new GMarker(point);
    			map.addOverlay(marker);
    			/*
    			marker.openInfoWindowHtml(
        			'<b>orig latlng:</b>' + response.name + '<br/>' + 
        			'<b>latlng:</b>' + place.Point.coordinates[0] + "," + place.Point.coordinates[1] + '<br>' +
        			'<b>Status Code:</b>' + response.Status.code + '<br>' +
        			'<b>Status Request:</b>' + response.Status.request + '<br>' +
        			'<b>Address:</b>' + place.address + '<br>' +
        			'<b>Accuracy:</b>' + place.AddressDetails.Accuracy + '<br>' +
        			'<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
    			*/
    			endereco2 = place.address;
    			montaRota()
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
    			map.addOverlay(marker);
    			/*
    			marker.openInfoWindowHtml(
        			'<b>orig latlng:</b>' + response.name + '<br/>' + 
        			'<b>latlng:</b>' + place.Point.coordinates[0] + "," + place.Point.coordinates[1] + '<br>' +
        			'<b>Status Code:</b>' + response.Status.code + '<br>' +
        			'<b>Status Request:</b>' + response.Status.request + '<br>' +
        			'<b>Address:</b>' + place.address + '<br>' +
        			'<b>Accuracy:</b>' + place.AddressDetails.Accuracy + '<br>' +
        			'<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);
    			*/
    			endereco1 = place.address;
    		}
    		geocoder.getLocations(pontoRota2, pt2);
    		
    	}
    	geocoder.getLocations(pontoRota1, pt1);
    }
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
		directions.load("from: "+endereco1+" to: "+endereco2);
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
					var p = window.parent.g_locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.g_sid+"&funcao=sphPT2shp&para=linha&tema="+temaNovo;
					cp.call(p,"sphPT2shp",window.parent.ajaxredesenha);
				}
				var p = window.parent.g_locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.g_sid+"&funcao=insereSHP&tema="+retorno.data+"&xy="+pontos.join(" ");
				var cp = new cpaint();
				//cp.set_debug(2)
				cp.set_response_type("JSON");
				cp.call(p,"insereSHP",converteParaLinha);
			}
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.set_transfer_mode("POST");
			var p = window.parent.g_locaplic+"/classesphp/mapa_controle.php?g_sid="+window.parent.g_sid;
			cp.call(p,"criaSHPvazio",ativanovotema,"&funcao=criashpvazio");
			
    	});
	}    
    ondegoogle(map);
    </script>
    </body>
</html>