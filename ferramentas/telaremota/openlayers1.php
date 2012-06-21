<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no;">
<meta name="HandheldFriendly" content="yes" />
<meta name="MobileOptimized" content="width" />
<meta name="apple-mobile-web-app-capable" content="yes">
<script type="text/javascript" src="../../pacotes/openlayers/OpenLayers211.js.php"></script>
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

O clone monitora as mudanças no mapa original e aplica a extensão geográfica e recarrega o mapfile utilizado no original.

A abertura de um clone só é possível tendo-se o código de abertura, gerado pela ferramenta Tela Remota do i3Geo

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/openlayers1.php

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
Title: Tela remota - OpenLayers

Interface baseada na API OpenLayers utilizada na apresentação remota do mapa em uso.

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
	var mapa = $i("openlayers");
	mapa.style.width = YAHOO.util.Dom.getViewportWidth() - 30 +"px";
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
	OpenLayers.ImgPath = "../../pacotes/openlayers/img/"
	OpenLayers.Lang.setCode("pt-BR");
	var urlLayer = "../../classesphp/mapa_openlayers.php?DESLIGACACHE=sim&g_sid=<?php echo $_GET["g_sid"];?>&telaR=<?php echo $_GET["telaR"];?>";
	
	var remoto = new OpenLayers.Layer.WMS(
		"Remoto",
		urlLayer,
		{transparent: "false", format: "image/png"},
		{isBaseLayer:false,singleTile:true,buffer:0,gutter:0,ratio:1}
	);
	var remotoFundo = new OpenLayers.Layer.WMS(
		"Fundo",
		urlLayer+"&tipolayer=fundo",
		{transparent: "false", format: "image/png"},
		{isBaseLayer:true,singleTile:true,visibility:true,buffer:0,gutter:0,ratio:1}
	);
	var bra = new OpenLayers.Layer.WMS( 
		"Base carto MMA",
		"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map",
		{layers:"baseraster",srs:"EPSG:4618",format:"image/png"},
		{isBaseLayer:true,visibility:false}
	);
	mapaRemoto = new OpenLayers.Map({
		div: "openlayers",
		controls: [
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Navigation()
		] 		
	});	
	mapaRemoto.addLayers([remotoFundo,bra,remoto]);
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
