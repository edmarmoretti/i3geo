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
<div class=paragrafo id="tl" style="height: 220px; border: 1px solid #aaa;overflow-x:hidden; overflow-y:scroll"> </div>

<script>
//i3GEO = window.parent.i3GEO;
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
					grafico();
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
function grafico(){
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
function carregaDados(){
	tl_el.innerHTML = "<span style=color:red; >Aguarde...</span>";
	var retorna = function(retorno){
		//eventSource1.clear();
		tl = Timeline.create(tl_el, bandInfos, Timeline.HORIZONTAL);
		eventSource1.loadJSON(retorno.data, '.'); // The data was stored into the 
		tl.layout(); // display the Timeline	
	}
	var p = window.parent.i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=dadosLinhaDoTempo&g_sid="+window.parent.i3GEO.configura.sid+"&tema="+$i("tema").value+"&ext="+window.parent.i3GEO.parametros.mapexten;
	cpJSON.call(p,"void",retorna);
}
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

	var xy = window.parent.i3GEO.calculo.dd2tela(wkt[0],wkt[1],window.parent.document.getElementById("img"),window.parent.i3GEO.parametros.mapexten,window.parent.i3GEO.parametros.pixelsize)

	window.parent.i3GEO.util.criaPin('marcaIdentifica',window.parent.i3GEO.configura.locaplic+"/imagens/marker.png","21px","25px");
	var i = window.parent.document.getElementById('marcaIdentifica')
	i.style.top = xy[1]-25+"px";
	i.style.left = xy[0]-10+"px";
	i.style.display = "block"
}
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
	{window.parent.i3GEO.atualiza(retorno);};
	
	window.parent.i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
	window.parent.i3GEO.php.selecaopt(retorna,$i("tema").value,wkt[0]+" "+wkt[1],"adiciona",0);

}

function tituloout(){
	window.parent.i3GEO.util.escondePin();
}
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