<?php
include("../../classesphp/pega_variaveis.php");
if(!isset($fundo)){
	$fundo = "''";
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="../../pacotes/openlayers/OpenLayers2131.js.php"></script>
<script type="text/javascript" src="../../pacotes/cpaint/cpaint2_compacto.inc.js"></script>
<link rel="stylesheet" href="../../mashups/openlayers_compacto.css" type="text/css" />
<script type="text/javascript" src="../../pacotes/yui290/build/yahoo/yahoo-min.js"></script>
<script type="text/javascript" src="../../pacotes/yui290/build/dom/dom-min.js"></script>
</head>
<body onload="inicia()">
<div id=openlayers style="width:500px;height:500px;"></div>
<script>
/*
Title: Interface OpenLayers para a ferramenta tela remota

Clone de um mapa aberto no i3Geo.

O clone monitora as mudan&ccedil;as no mapa original e aplica a extens&atilde;o geogr&aacute;fica e recarrega o mapfile utilizado no original.

A abertura de um clone s&oacute; &eacute; poss&iacute;vel tendo-se o c&oacute;digo de abertura, gerado pela ferramenta Tela Remota do i3Geo

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/openlayers1.php

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
Title: Tela remota - OpenLayers

Interface baseada na API OpenLayers utilizada na apresenta&ccedil;&atilde;o remota do mapa em uso.

Parametros:

g_sid {string} - c&oacute;digo da "section" PHP aberta na cria&ccedil;&atilde;o do mapa em uso

telaR {string} - c&oacute;digo especial que autoriza o uso do mapa atual em um navegador diferente daquele utilizado na cria&ccedil;&atilde;o do mapa em uso

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/index.js.php

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

function inicia(){
	var mapa = $i("openlayers");
	mapa.style.width = YAHOO.util.Dom.getViewportWidth() - 30 +"px";
	mapa.style.height = YAHOO.util.Dom.getViewportHeight() - 30 + "px";
	extentAnterior = "";
	contadorSalva = 0;
	$i = function(id){return document.getElementById(id);};
	navn = false;
	//seta as vari&aacute;veis navn e navm
	navn = false;
	navm = false;
	var app = navigator.appName.substring(0,1);
	if (app==='N'){navn=true;}else{navm=true;}
	OpenLayers.ImgPath = "../../pacotes/openlayers/img/"
	OpenLayers.Lang.setCode("pt-BR");
	var urlLayer = "../../classesphp/mapa_openlayers.php?DESLIGACACHE=sim&g_sid=<?php echo $g_sid;?>&telaR=<?php echo $telaR;?>";
	
	var remoto = new OpenLayers.Layer.WMS(
		"Remoto",
		urlLayer,
		{transparent: "false", format: "image/png"},
		{isBaseLayer:false,singleTile:true,buffer:0,gutter:0,ratio:1}
	);

	var eng = new OpenLayers.Layer.ArcGIS93Rest(
		"ESRI National Geographic",
		"http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/export",
		{
			format : "jpeg"
		}, {
			isBaseLayer : true,
			visibility : true
		});
	var oce = new OpenLayers.Layer.ArcGIS93Rest(
			"ESRI Ocean Basemap",
			"http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/export",
			{
				format : "jpeg"
			}, {
				isBaseLayer : true,
				visibility : true
			});
	var ims = new OpenLayers.Layer.ArcGIS93Rest(
			"ESRI Imagery World 2D",
			"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/export",
			{
				format : "jpeg"
			}, {
				isBaseLayer : true,
				visibility : true
			});
	var wsm = new OpenLayers.Layer.ArcGIS93Rest(
			"ESRI World Street Map",
			"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer/export",
			{
				format : "jpeg"
			}, {
				isBaseLayer : true,
				visibility : true
			});
	var bra = new OpenLayers.Layer.WMS(
			"Base carto MMA",
			"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map",
			{
				layers : "baseraster",
				srs : "EPSG:4618",
				format : "image/png",
				isBaseLayer : false
			}, {
				isBaseLayer : true,
				visibility : true
			});

	var tms = new OpenLayers.Layer.TMS("OSGEO",
			"http://tilecache.osgeo.org/wms-c/Basic.py/", {
				layername : "basic",
				type : "png",
				// set if different than the bottom left of map.maxExtent
				tileOrigin : new OpenLayers.LonLat(-180, -90),
				isBaseLayer : true,
				visibility : true
			});

	var LAYERSADICIONAIS = [ eng, oce, ims, wsm, tms, bra ];

	mapaRemoto = new OpenLayers.Map({
		div: "openlayers",
		controls: [
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Navigation()
		]
	});
	if(<?php echo $fundo; ?> !== ""){
		mapaRemoto.addLayers([LAYERSADICIONAIS[<?php echo $fundo; ?>],remoto]);
	}
	else{
		mapaRemoto.addLayers([remoto]);
	}
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
		if(layers[i].isBaseLayer === false){
			layers[i].mergeNewParams({r:Math.random()});
			layers[i].url = layers[i].url.replace("&&&&&&&&&&&&&&","");
			layers[i].url = layers[i].url+"&&";
			if(layers[i].visibility === true){
				layers[i].redraw();
			}
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
