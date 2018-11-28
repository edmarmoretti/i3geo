<?php
include("../../ms_configura.php");
include("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)),$i3geoBlFerramentas,false);
?>
<html>
<head>
<script src="../../pacotes/ol4/ol.js"></script>
<script src="../../js/i3geonaocompacto.js" type="text/javascript"></script>
<script>
Timeline_ajax_url="../../pacotes/simile/timeline_2.3.0/timeline_ajax/simile-ajax-api.js";
Timeline_urlPrefix='../../pacotes/simile/timeline_2.3.0/timeline_js/';
Timeline_parameters='bundle=true';
</script>
<script src="../../pacotes/simile/timeline_2.3.0/timeline_js/timeline-api.js" type="text/javascript"></script>
<style>
.timeline-band-1 .timeline-ether-bg
{background-color:white;}
.timeline-event-bubble-title
{visibility:hidden;display:none;}
</style>
</head>
<body onload="inicializa()" onresize="onResize()">
<img onclick="config()" class='ticPropriedades2' style='cursor: pointer;float: left;width: 20px;height: 20px;top: 5px;position: relative;' title='config' src='../../imagens/branco.gif'>
<div class="styled-select" style="width:90%;" id="combotemas" ></div>

<div class=paragrafo id="totaleventos" ></div>
<div class=paragrafo id="tl" style="height: 80%; border: 0px solid #aaa;overflow-x:hidden; overflow-y:scroll"> </div>

<script>
/*
Title: Linha do tempo

Cria um gr&aacute;fico de linha do tempo, tendo como base os atributos dos elementos de um tema vis&iacute;veis na extens&atilde;o geogr&aacute;fica
do mapa atual. Para possibilitar a gera&ccedil;&atilde;o do gr&aacute;fico, o layer deve estar configurado corretamente, contendo os METADATA
espec&iacute;ficos para essa ferramenta (veja o editor de mapfile do sistema de administra&ccedil;&atilde;o do i3Geo). Essa ferramenta &eacute; baseada
no pacote TIMELINE, distribu&iacute;do junto com o i3Geo.

Veja:

<i3GEO.analise.dialogo.linhaDoTempo>

Arquivo:

i3geo/ferramentas/linhadotempo/index.php

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

$i = function(id){
	return document.getElementById(id);
};
cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
var tl;
var eventSource1 = new Timeline.DefaultEventSource();
MARCA = false;
/*
Function: inicializa

Inicializa a ferramenta construindo o combo para escolha do tema que ser&aacute; usado no gr&aacute;fico

Veja:

<i3GEO.util.comboTemas>
*/
function inicializa(){
	document.body.className = "";
	document.body.style.background = "white";
	document.body.style.margin = "5px";
	i3GEO.arvoreDeCamadas.CAMADAS = window.parent.i3GEO.arvoreDeCamadas.CAMADAS;
	i3GEO.util.comboTemas(
		"tema",
		function(retorno){
			$i("combotemas").innerHTML = retorno.dados;
			if ($i("tema")){
				$i("tema").onchange = function(){
					if($i("tema").value === ""){
                        return;
                    }
					bandas();
					carregaDados();
					window.parent.i3GEO.mapa.ativaTema($i("tema").value);
				};
			}
			window.parent.i3GEO.temaAtivo = $i("tema").value;
			if(window.parent.i3GEO.temaAtivo !== ""){
				$i("tema").value = window.parent.i3GEO.temaAtivo;
				if($i("tema").value !== ""){
                    $i("tema").onchange.call();
                }
			}
		},
		"combotemas",
		"",
		false,
		"linhaDoTempo"
	);
}
/*
Function: bandas

Cria o objeto bandInfos com os parâmetros necess&aacute;rios para a cria&ccedil;&atilde;o do gr&aacute;fico
*/
function bandas(){
	tl_el = $i("tl");
	tl_el.innerHTML = "<span style=color:red; >"+$trad("o1")+"</span>";
	var theme1 = Timeline.ClassicTheme.create();
	theme1.event.bubble.width = 250;
	if(navn){
		theme1.autoWidth = false;
		bandInfos = [
			Timeline.createBandInfo({
				width:          "20%",
				intervalUnit:   Timeline.DateTime.DECADE,
				intervalPixels: 200,
				overview:       true,
				eventSource:    eventSource1
			}),

			Timeline.createBandInfo({
				width:          "80%",
				intervalUnit:   Timeline.DateTime.YEAR,
				intervalPixels: 200,
				eventSource:    eventSource1,
				theme:          theme1,
				layout:         'original'  // original, overview, detailed
			})
		];
		bandInfos[1].syncWith = 0;
		bandInfos[0].highlight = true;
	}
	else{
		theme1.autoWidth = false;
		bandInfos = [
			Timeline.createBandInfo({
				width:          "100%",
				intervalUnit:   Timeline.DateTime.DECADE,
				intervalPixels: 200,
				eventSource:    eventSource1,
				theme:          theme1,
				layout:         'original'  // original, overview, detailed
			})
		];
	}
	var url = '.'; // The base url for image, icon and background image
}
/*
Function: carregaDados

Obt&eacute;m os dados que ser&atilde;o inclu&iacute;dos no gr&aacute;fico. &Eacute; criado o objeto Timeline chamado tl

Veja:

<DADOSLINHADOTEMPO>
*/
function carregaDados(){
	//alert(window.parent.i3GEO.parametros.mapexten)
	tl_el.innerHTML = "<span style=color:red; >"+$trad("o1")+"</span>";
	var retorna = function(retorno){
		eventSource1.clear();
		$i("totaleventos").innerHTML = retorno.data.events.length+" eventos";
		tl = Timeline.create(tl_el, bandInfos, Timeline.HORIZONTAL);
		eventSource1.loadJSON(retorno.data, '.'); // The data was stored into the
		tl.layout(); // display the Timeline
		tl.getBand(0).scrollToCenter(Timeline.DateTime.parseGregorianDateTime(retorno.data.maiorano));
	}
	var ext = window.parent.i3GEO.util.extOSM2Geo(window.parent.i3GEO.parametros.mapexten);
	var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=dadosLinhaDoTempo&g_sid="+window.parent.i3GEO.configura.sid+"&tema="+$i("tema").value+"&ext="+ext;
	cpJSON.call(p,"void",retorna);
}
/*
Function: tituloover

Indica no mapa a localiza&ccedil;&atilde;o de um evento quando o usu&aacute;rio passa o mouse sobre o t&iacute;tulo de um evento

Parametro:

wkt {String} - coordenadas do evento no formato WKT
*/
function tituloover(wkt){
	//@FIXME nao funciona no OSM
	var wi = window.parent;
	if(wi.i3GEO.Interface.openlayers.googleLike === true){
		return;
	}
	try{
		if(!wi){return;}
		if(!wi.i3GEO){return;}
		if(!wi.i3GEO.calculo){return;}
	}
	catch(e){if(typeof(console) !== 'undefined'){console.error(e);};return;}

	re = new RegExp("POINT", "g");
	wkt = wkt.replace(re,"");
	wkt = wkt.split("(")[1].split(")")[0];
	wkt = wkt.split(" ");

	if(MARCA === false){
		MARCA = wi.i3GEO.desenho.addPin(wkt[0],wkt[1],"","",wi.i3GEO.configura.locaplic+'/imagens/google/confluence.png',"linhadotempo");
	}
	else{
		wi.i3GEO.desenho.movePin(MARCA,wkt[0],wkt[1]);
	}
}
/*
Function: tituloclique

Seleciona os elementos do tema ativo com base na coordenada do evento

Parametro:

wkt {String} - coordenadas do evento no formato WKT
*/
function tituloclique(wkt){
	try{
		if(!window.parent){return;}
		if(!window.parent.i3GEO){return;}
		if(!window.parent.i3GEO.calculo){return;}
	}
	catch(e){if(typeof(console) !== 'undefined'){console.error(e);};return;}
	re = new RegExp("POINT", "g");
	wkt = wkt.replace(re,"");
	wkt = wkt.split("(")[1].split(")")[0];
	wkt = wkt.split(" ");
	var retorna = function(retorno)
	{
		window.parent.i3GEO.atualiza(retorno);
		window.parent.i3GEO.Interface.atualizaTema(retorno,$i("tema").value);
	};

	//window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
	window.parent.i3GEO.php.selecaopt(retorna,$i("tema").value,wkt[0]+" "+wkt[1],"adiciona",0);
}
/*
Function: tituloout

Remove do mapa a marca de localiza&ccedil;&atilde;o do evento quando o usu&aacute;rio move o mouse para fora do t&iacute;tulo do evento

*/
function tituloout(){
	var wi = window.parent;
	wi.i3GEO.desenho.removePins("linhadotempo");
	MARCA = false;
}
/*
Function: onResize

Modifica o tamanho da linha do tempo se a janela da ferramenta tiver seu tamanho modificado
*/
function onResize() {
     if (resizeTimerID == null) {
         resizeTimerID = window.setTimeout(function() {
             resizeTimerID = null;
             tl.layout();
         }, 500);
     }
 }
function config(){
	i3GEO.configura.locaplic = window.parent.i3GEO.configura.locaplic;
	window.parent.i3GEO.mapa.ativaTema($i("tema").value);
	window.parent.i3GEO.util.dialogoFerramenta(
		"",
		"linhadotempo",
		"linhadotempo",
		"dependencias.php",
		"i3GEOF.linhadotempo.iniciaJanelaFlutuante()");
}
</script>
</body>

</html>