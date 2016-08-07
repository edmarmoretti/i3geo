<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Category" content="i3Geo Mapa interativo MMA geoprocessamento sig mobile">
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>i3GEO - Google Maps</title>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=drawing,geometry"></script>
<script type="text/javascript" src="../classesjs/i3geo.js"></script>
<link rel="stylesheet" type="text/css" href="../css/black.css">
<style>
.BtLegend {
    left: 10px;
    top: 0px;
    z-index: 10000;
}
.BtLayerList{
	display: none;
    -moz-user-select: none;
    background-clip: padding-box;
    background-color: #fff;
    color: #000;
    direction: ltr;
    font-family: Roboto,Arial,sans-serif;
    font-size: 11px;
    font-weight: 500;
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 8px;
    text-align: left;
}
.BtLegendHeader {
    -moz-user-select: none;
    background-clip: padding-box;
    background-color: #fff;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
    color: #000;
    direction: ltr;
    font-family: Roboto,Arial,sans-serif;
    font-size: 11px;
    font-weight: 500;
    min-width: 28px;
    overflow-x: hidden;
    overflow-y: hidden;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 8px;
    position: relative;
    text-align: center;
    margin: 20px 10px 1px -10px;
    cursor: pointer;
}

.botoesLegendaFlutuante {
	display: none;
}
</style>
</head>
<body id="i3geo" style='background: white;'>
<div id="contemImg" style="height:100%;width:100%">
	<div id=googlemapsdiv style="position: relative;height:100%;width:100%"></div>
</div>

	<script type="text/javascript">
i3GEO.configura.locaplic = i3GEO.util.protocolo()+"://"+window.location.host+"/i3geo";

i3GEO.configura.mashuppar = "";

i3GEO.Interface.ATUAL = "googlemaps";
i3GEO.Interface.IDCORPO = "contemImg";

i3GEO.configura.diminuiyN = 0;
i3GEO.configura.diminuiyM = 0;

i3GEO.configura.autotamanho = false;
i3GEO.Interface.openlayers.TILES = true;
i3GEO.cria();
i3GEO.configura.mapaRefDisplay = "none";
i3GEO.configura.guardaExtensao = false;
i3GEO.barraDeBotoes.TIPO = "";
i3GEO.ajuda.ATIVAJANELA = false;

i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS = false;
i3GEO.arvoreDeCamadas.MOSTRALISTAKML = false;
i3GEO.arvoreDeCamadas.MOSTRATITULO = false;
i3GEO.mapa.AUTORESIZE = true;
//nao marca o centro do mapa
i3GEO.navega.marcaCentroDoMapa = function(){};

i3GEO.janela.ativaAlerta();
i3GEO.janela.ESTILOAGUARDE = "nenhum";

//i3GEO.Interface.googlemaps.TIPOMAPA = "satellite";

i3GEO.finaliza = function(){
};

i3GEO.finalizaAPI = function(){
	//monta o botao para mostrar a legenda
   		var divMap = i3GeoMap.getDiv();
    	var container = document.createElement("div");
    	container.className = "BtLegend";

    	var layerList = document.createElement("div");
    	layerList.id = "arvoreDeCamadas";

		layerList.className = "BtLayerList i3GEOarvCam";
   		var h = document.createElement("div");
   		h.innerHTML = "<div class='BtLegendHeader'>Legenda</div>";
   		h.alt = "Legenda das camadas do mapa";
   		h.style.width = "60px";
   		google.maps.event.addDomListener(h, 'click', function() {
   			//i3GEO.mapa.legendaHTML.libera("sim");
			if(layerList.style.display === "block"){
				layerList.style.display = "none";
			}
			else{
				layerList.style.display = "block";
				i3GEO.arvoreDeCamadas.inicia("arvoreDeCamadas");
			}
			return false;
   		});
   		google.maps.event.addDomListener(h, 'mouseover', function(evt) {
   	   		evt.stopPropagation();
   		});
   		google.maps.event.addDomListener(container, 'mouseover', function(evt) {
   	   		evt.stopPropagation();
   		});
   		YAHOO.util.Event.addListener(container, "click", YAHOO.util.Event.stopPropagation);
		container.appendChild(h);
		container.appendChild(layerList);
   		i3GeoMap.controls[google.maps.ControlPosition.TOP_LEFT].push(container);
 };
i3GEO.inicia();
</script>
</body>
</html>
