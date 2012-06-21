<html>
<head>
<script src="../../classesjs/i3geo.js" type="text/javascript"></script>
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
<body name="ancora" onload="inicializa()" onresize="onResize()">
<p class=paragrafo >Escolha o tema para gerar a linha do tempo:</p>
<div class=paragrafo id="combotemas" ></div>
<div class=paragrafo id="totaleventos" style="position:absolute;top:30px;left:200px;"></div>
<div class=paragrafo id="tl" style="height: 220px; border: 1px solid #aaa;overflow-x:hidden; overflow-y:scroll"> </div>

<script>
/*
Title: Linha do tempo

Cria um gráfico de linha do tempo, tendo como base os atributos dos elementos de um tema visíveis na extensão geográfica
do mapa atual. Para possibilitar a geração do gráfico, o layer deve estar configurado corretamente, contendo os METADATA
específicos para essa ferramenta (veja o editor de mapfile do sistema de administração do i3Geo). Essa ferramenta é baseada
no pacote TIMELINE, distribuído junto com o i3Geo.

Veja:

<i3GEO.analise.dialogo.linhaDoTempo>

Arquivo:

i3geo/ferramentas/linhadotempo/index.php

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

if(navm){
	alert("o funcionamento da linha do tempo é muito melhor com o Firefox")
}
$i = function(id){
	return document.getElementById(id);
};
cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
var tl;
var eventSource1 = new Timeline.DefaultEventSource();

/*
Function: inicializa

Inicializa a ferramenta construindo o combo para escolha do tema que será usado no gráfico

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
					if($i("tema").value === ""){return;}
					bandas();
					carregaDados();
					window.parent.i3GEO.mapa.ativaTema($i("tema").value);
				};
			}
			if(window.parent.i3GEO.temaAtivo !== ""){
				$i("tema").value = window.parent.i3GEO.temaAtivo;
				if($i("tema").value !== "")
				{$i("tema").onchange.call();}
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

Cria o objeto bandInfos com os parâmetros necessários para a criação do gráfico
*/
function bandas(){
	tl_el = $i("tl");
	tl_el.innerHTML = "<span style=color:red; >Aguarde...</span>";
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

Obtém os dados que serão incluídos no gráfico. É criado o objeto Timeline chamado tl

Veja:

<DADOSLINHADOTEMPO>
*/
function carregaDados(){
	tl_el.innerHTML = "<span style=color:red; >Aguarde...</span>";
	var retorna = function(retorno){
		//eventSource1.clear();
		$i("totaleventos").innerHTML = retorno.data.events.length+" eventos";
		tl = Timeline.create(tl_el, bandInfos, Timeline.HORIZONTAL);
		eventSource1.loadJSON(retorno.data, '.'); // The data was stored into the 
		tl.layout(); // display the Timeline
		tl.getBand(0).scrollToCenter(Timeline.DateTime.parseGregorianDateTime(retorno.data.maiorano));		
	}
	var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=dadosLinhaDoTempo&g_sid="+window.parent.i3GEO.configura.sid+"&tema="+$i("tema").value+"&ext="+window.parent.i3GEO.parametros.mapexten;
	cpJSON.call(p,"void",retorna);
}
/*
Function: tituloover

Indica no mapa a localização de um evento quando o usuário passa o mouse sobre o título de um evento

Parametro:

wkt {String} - coordenadas do evento no formato WKT
*/
function tituloover(wkt){
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

	var xy = window.parent.i3GEO.calculo.dd2tela(wkt[0],wkt[1],window.parent.document.getElementById(window.parent.i3GEO.Interface.IDMAPA),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)

	window.parent.i3GEO.util.criaPin('marcaIdentifica',window.parent.i3GEO.configura.locaplic+"/imagens/marker.png","21px","25px");
	var i = window.parent.document.getElementById('marcaIdentifica')
	i.style.top = xy[1]-25+"px";
	i.style.left = xy[0]-10+"px";
	i.style.display = "block"
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
	
	window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
	window.parent.i3GEO.php.selecaopt(retorna,$i("tema").value,wkt[0]+" "+wkt[1],"adiciona",0);
}
/*
Function: tituloout

Remove do mapa a marca de localização do evento quando o usuário move o mouse para fora do título do evento

*/
function tituloout(){
	window.parent.i3GEO.util.escondePin();
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
</script>	
</body>

</html>