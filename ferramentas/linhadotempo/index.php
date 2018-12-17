<?php
include ("../../ms_configura.php");
include ("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $i3geoBlFerramentas, false);
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
.timeline-band-1 .timeline-ether-bg {
	background-color: #370000;
}
.timeline-band-0 .timeline-ether-bg {
    background-color: #631f1f;
}
.timeline-band-2 .timeline-ether-bg {
    background-color: white;
}

.timeline-event-bubble-title {
	visibility: hidden;
	display: none;
}


</style>
</head>
<body onload="inicializa()" onresize="onResize()">
    <div id='tl' style='text-align: left; display: block; overflow-x: hidden; overflow-y: auto; height: 100%;'></div>
    <script>
/*
Title: Linha do tempo

Cria um gr&aacute;fico de linha do tempo, tendo como base os atributos dos elementos de um tema vis&iacute;veis na extens&atilde;o geogr&aacute;fica
do mapa atual. Para possibilitar a gera&ccedil;&atilde;o do gr&aacute;fico, o layer deve estar configurado corretamente, contendo os METADATA
espec&iacute;ficos para essa ferramenta (veja o editor de mapfile do sistema de administra&ccedil;&atilde;o do i3Geo). Essa ferramenta &eacute; baseada
no pacote TIMELINE, distribu&iacute;do junto com o i3Geo.

*/
$i = function(id){
	return document.getElementById(id);
};
var tl;
var eventSource1 = new Timeline.DefaultEventSource();
MARCA = false;
const wpi = window.parent.i3GEO;
const wpf = window.parent.i3GEOF.linhadotempo;
const tema = window.parent.i3GEOF.linhadotempo._parameters.tema;
function inicializa(){
	document.body.className = "";
	document.body.style.background = "white";
	document.body.style.margin = "5px";
    bandas();
    carregaDados();
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
	theme1.autoWidth = false;
	theme1.autoWidth = false;
	bandInfos = [
		Timeline.createBandInfo({
			width:          "10%",
			intervalUnit:   Timeline.DateTime.DECADE,
			intervalPixels: 300,
			overview:       true,
			eventSource:    eventSource1
		}),Timeline.createBandInfo({
            width:          "10%",
            intervalUnit:   Timeline.DateTime.YEAR,
            intervalPixels: 300,
            overview:       true,
            eventSource:    eventSource1
        }),
		Timeline.createBandInfo({
			width:          "80%",
			intervalUnit:   Timeline.DateTime.YEAR,
			intervalPixels: 300,
			eventSource:    eventSource1,
			layout:         'original'  // original, overview, detailed
		})
	];
	bandInfos[1].syncWith = 0;
	bandInfos[2].syncWith = 0;
	bandInfos[0,1,2].highlight = true;
	var url = '.'; // The base url for image, icon and background image
}
function carregaDados(){
	tl_el.innerHTML = "<span style=color:red; >"+$trad("o1")+"</span>";
    par = {
        "tema": wpf._parameters.tema,
        "g_sid": wpi.configura.sid,
        "funcao": "dados",
        "ext": wpi.util.extOSM2Geo(wpi.parametros.mapexten)
    };
    wpf.post({
        snackbar: true,
        btn: false,
        par: par,
        refresh: false,
        fn: function(data){
		  eventSource1.clear();
		  tl = Timeline.create(tl_el, bandInfos, Timeline.HORIZONTAL);
		  eventSource1.loadJSON(data, '.'); // The data was stored into the
		  tl.layout(); // display the Timeline
		  tl.getBand(0).scrollToCenter(Timeline.DateTime.parseGregorianDateTime(data.maiorano));
        },
        prog: wpi.configura.locaplic + "/ferramentas/linhadotempo/exec.php"
    });
}
function tituloover(wkt){
	re = new RegExp("POINT", "g");
	wkt = wkt.replace(re,"");
	wkt = wkt.split("(")[1].split(")")[0];
	wkt = wkt.split(" ");
	if(MARCA === false){
        MARCA = i3GEO.desenho.addPin({
            x: wkt[0]*1,
            y: wkt[1]*1,
            namespace: "linhadotempo"
        });
	}
	else{
		wi.i3GEO.desenho.movePin(MARCA,wkt[0]*1,wkt[1]*1);
	}
}
/*
Function: tituloout

Remove do mapa a marca de localiza&ccedil;&atilde;o do evento quando o usu&aacute;rio move o mouse para fora do t&iacute;tulo do evento

*/
function tituloout(){
    wpi.desenho.removePins("linhadotempo");
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
</script>
</body>

</html>