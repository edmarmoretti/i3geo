<?php
include("../../ms_configura.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="http://www.google.com/jsapi?key=<?php echo $googleApiKey; ?>"></script>
<script type="text/javascript" src="../../pacotes/cpaint/cpaint2_compacto.inc.js"></script>
<script type="text/javascript" src="../../pacotes/yui290/build/yahoo/yahoo-min.js"></script>
<script type="text/javascript" src="../../pacotes/yui290/build/dom/dom-min.js"></script>
</head>
<body onload="inicia()">
<div id=googleearthdiv style="width:500px;height:500px;z-index:0"></div>
<script>
/*
Title: Interface GoogleEarth para a ferramenta tela remota

Clone de um mapa aberto no i3Geo.

O clone monitora as mudan&ccedil;as no mapa original e aplica a extens&atilde;o geogr&aacute;fica e recarrega o mapfile utilizado no original.

A abertura de um clone s&oacute; &eacute; poss&iacute;vel tendo-se o c&oacute;digo de abertura, gerado pela ferramenta Tela Remota do i3Geo

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/googleearth1.php

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
google.load("earth", "1");
mapaRemoto = null;
remoto = null;
function inicia(){
	var mapa = document.getElementById("googleearthdiv");
	mapa.style.width = YAHOO.util.Dom.getViewportWidth() - 30 + "px";
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
	
	google.earth.createInstance("googleearthdiv", 
		function(objeto){
			mapaRemoto = objeto;
			mapaRemoto.getWindow().setVisibility(true);
			mapaRemoto.getNavigationControl().setVisibility(true);
			layerRoot = mapaRemoto.getLayerRoot();
			layerRoot.enableLayerById(mapaRemoto.LAYER_TERRAIN, true);
			var options = mapaRemoto.getOptions();
			options.setMouseNavigationEnabled(true);
			options.setStatusBarVisibility(true);
			options.setOverviewMapVisibility(true);
			options.setScaleLegendVisibility(true);
			options.setAtmosphereVisibility(true);
			options.setGridVisibility(false);
			remoto = criaLayer();
			recuperaMapa();
		}, 
		function(){
			alert("Falhou. Vc precisa do plugin instalado");
		}
	);
}
function criaLayer(){
	var caminho = window.location.protocol+"//"+window.location.host+window.location.pathname,
		kmlUrl = caminho.replace("/ferramentas/telaremota/googleearth1.php","")+"/classesphp/mapa_googleearth.php?g_sid=<?php echo $_GET["g_sid"];?>&telaR=<?php echo $_GET["telaR"];?>&REQUEST=GetKml&r="+Math.random(),
			linki3geo = mapaRemoto.createLink(''),
			nl = mapaRemoto.createNetworkLink('');
	linki3geo.setHref(kmlUrl);
	nl.setLink(linki3geo);
	nl.setFlyToView(false);
	nl.setName("Remoto");
	nl.setVisibility(true);
	mapaRemoto.getFeatures().appendChild(nl);
	return nl;
}
function zoom2ext(ext){
	var r = 6378700,
		lng2,
		lng1,
		lat1,
		lat2,
		ret = ext.split(" "),
		fov = 32,
		camera = mapaRemoto.getView().copyAsCamera(mapaRemoto.ALTITUDE_RELATIVE_TO_GROUND),
		dy,
		dx,
		d,
		dist,
		alt;
	lng2 = (ret[0]*1);
	lng1 = (ret[2]*1);
	lat1 = (ret[1]*1);
	lat2 = (ret[3]*1);
	camera.setLatitude((lat1 + lat2) / 2.0); 
	camera.setLongitude((lng1 + lng2) / 2.0); 
	camera.setHeading(0.0); 
	camera.setTilt(0.0); 
	// determine if the rectangle is portrait or landscape
	dy = Math.max(lat1, lat2) - Math.min(lat1, lat2); 
	dx = Math.max(lng1, lng2) - Math.min(lng1, lng2); 
	// find the longest side
	d = Math.max(dy, dx); 
	// convert the longest side degrees to radians
	d = d * Math.PI/180.0; 
	// find half the chord length
	dist = r * Math.tan(d / 2); 
	// get the altitude using the chord length
	alt = dist/(Math.tan(fov * Math.PI / 180.0)); 
	camera.setAltitude(alt); 
	mapaRemoto.getView().setAbstractView(camera);	
}
function atualizaMapa(){
	mapaRemoto.getFeatures().removeChild(mapaRemoto.getFeatures().getChildNodes().item(0));
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
