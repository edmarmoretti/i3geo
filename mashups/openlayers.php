<?php
/*
Parametros:

temas - lista com os temas (mapfiles) do i3Geo que serão incluídos no mapa

numzoomlevels - número de níveis de zoom, default=6

maxextent - extensão geográfica do mapa

controles - lista separada por "," com os nomes dos controles que serão adicionados ao mapa. Se não for definido, todos os controles serão adicionados.

botoes - lista com os nomes dos botoes que serão adicionados ao mapa. Se não for definido, todos os botões serão adicionados

servidor - endereco do servidor OGC utilizado. Por default é "../ogc.php" o que força o uso do i3geo local

largura - lagura do mapa em pixels

altura - altura do mapa em pixels
*/

include_once("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
//
//imprime na tela a ajuda ao usuário
//
if(!isset($temas))
{ajuda();}
if(!isset($largura))
{$largura = 400;}
if(!isset($altura))
{$altura = 400;}
//
//define o nível de zoom
//
if(!isset ($numzoomlevels))
{$numzoomlevels = "6";}
//
//define a extensão geográfica que será aplicada
//
if(!isset($maxextent))
{$maxextent = "-76.5125927 -39.3925675209 -29.5851853 9.49014852081";}
$maxextent = str_replace(" ",",",$maxextent);
//
//define quais controles serão mostrados no mapa
//
$objControles = array();
if(!isset($controles)){
	$objControles[] = "new OpenLayers.Control.Navigation()";
	$objControles[] = "new OpenLayers.Control.PanZoomBar()";
	$objControles[] = "new OpenLayers.Control.LayerSwitcher({'ascending':false})";
	$objControles[] = "new OpenLayers.Control.ScaleLine()";
	$objControles[] = "new OpenLayers.Control.MousePosition({'separator':' '})";
	$objControles[] = "new OpenLayers.Control.OverviewMap()";
	$objControles[] = "new OpenLayers.Control.KeyboardDefaults()";
}
else{
	$controles = str_replace(" ",",",$controles);
	$controles = strtolower($controles);
	$controles = explode(",",$controles);
	if(in_array("navigation",$controles))
	{$objControles[] = "new OpenLayers.Control.Navigation()";}
	if(in_array("panzoombar",$controles))
	{$objControles[] = "new OpenLayers.Control.PanZoomBar()";}
	if(in_array("layerswitcher",$controles))
	{$objControles[] = "new OpenLayers.Control.LayerSwitcher({'ascending':false})";}
	if(in_array("scaleline",$controles))
	{$objControles[] = "new OpenLayers.Control.ScaleLine()";}
	if(in_array("mouseposition",$controles))
	{$objControles[] = "new OpenLayers.Control.MousePosition({'separator':' '})";}
	if(in_array("overviewmap",$controles))
	{$objControles[] = "new OpenLayers.Control.OverviewMap()";}
	if(in_array("keyboarddefaults",$controles))
	{$objControles[] = "new OpenLayers.Control.KeyboardDefaults()";}
}
//
//define quais botoes serão mostrados no mapa
//
$objBotoes = array();
if(!isset($botoes)){
	$objBotoes[] = "'pan':true";
	$objBotoes[] = "'zoombox':true";
	$objBotoes[] = "'zoomtot':true";
	$objBotoes[] = "'legenda':true";
	$objBotoes[] = "'distancia':true";
	$objBotoes[] = "'area':true";
	$objBotoes[] = "'identifica':true";
	$objBotoes[] = "'linha':true";
	$objBotoes[] = "'ponto':true";
	$objBotoes[] = "'poligono':true";
	$objBotoes[] = "'edita':true";
	$objBotoes[] = "'apaga':true";
	$objBotoes[] = "'captura':false";
}
else{
	$botoes = str_replace(" ",",",$botoes);
	$botoes = strtolower($botoes);
	$botoes = explode(",",$botoes);
	if(in_array("pan",$botoes))
	{$objBotoes[] = "'pan':true";}
	if(in_array("zoombox",$botoes))
	{$objBotoes[] = "'zoombox':true";}
	if(in_array("zoomtot",$botoes))
	{$objBotoes[] = "'zoomtot':true";}
	if(in_array("legenda",$botoes))
	{$objBotoes[] = "'legenda':true";}
	if(in_array("distancia",$botoes))
	{$objBotoes[] = "'distancia':true";}
	if(in_array("area",$botoes))
	{$objBotoes[] = "'area':true";}
	if(in_array("identifica",$botoes))
	{$objBotoes[] = "'identifica':true";}
	if(in_array("linha",$botoes))
	{$objBotoes[] = "'linha':true";}
	if(in_array("ponto",$botoes))
	{$objBotoes[] = "'ponto':true";}
	if(in_array("poligono",$botoes))
	{$objBotoes[] = "'poligono':true";}
	if(in_array("edita",$botoes))
	{$objBotoes[] = "'edita':true";}
	if(in_array("apaga",$botoes))
	{$objBotoes[] = "'apaga':true";}
	if(in_array("captura",$botoes))
	{$objBotoes[] = "'captura':false";}
}
$botoes = "{".implode(",",$objBotoes)."}";
//
//define quais os layers que comporão o mapa
//
$temas = str_replace(" ",",",$temas);
$temas = strtolower($temas);
$temas = explode(",",$temas);
$layers = array();
$objOpenLayers = array();
if(isset($servidor) && $servidor != "../ogc.php"){
	$layers = $temas;
	foreach($temas as $tema){
		$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.$tema.'", "'.$servidor.'?tema='.$tema.'&",{layers:"'.$tema.'",transparent: "true", format: "image/png"},{isBaseLayer:false})';
	}
}
else{
	foreach($temas as $tema){
		if(file_exists("../temas/".$tema.".map")){
			$maptemp = @ms_newMapObj("../temas/".$tema.".map");
			for($i=0;$i<($maptemp->numlayers);++$i)
			{
				$layern = $maptemp->getLayer($i);
				$layers[] = $layern->name;
			}
			$objOpenLayers[] = 'new OpenLayers.Layer.WMS( "'.($layern->getmetadata("tema")).'", "../ogc.php?tema='.$tema.'&",{layers:"'.implode(",",$layers).'",transparent: "true", format: "image/png"},{isBaseLayer:false})';
		}
		else
		{echo $tema." não foi encontrado.<br>";}
		$layers = array();
	}
}
function ajuda(){
	echo "
<pre><b>
Mashup OpenLayers
Parâmetros:
	servidor - endereco do servidor OGC utilizado. Por default é ../ogc.php o que força o uso do i3geo local
	temas - lista com os temas (mapfiles) do i3Geo que serão incluídos no mapa
	numzoomlevels - número de níveis de zoom, default=6
	maxextent - extensão geográfica do mapa (xmin,ymin,xmax,ymax)
	largura - lagura do mapa em pixels
	altura - altura do mapa em pixels

	controles - lista com os nomes dos controles que serão adicionados ao mapa. Se não for definido, todos os controles serão adicionados
		navigation
		panzoombar 
		layerswitcher 
		scaleline 
		mouseposition
		overviewmap 
		keyboarddefaults
	botoes - lista com os nomes dos botoes que serão adicionados ao mapa. Se não for definido, todos os botões serão adicionados
		pan
		zoombox
		zoomtot
		distancia
		area
		identifica
		ponto
		linha
		poligono
		edita
		apaga
		captura

	Para ver a lista de códigos de temas, que podem ser utilizados no parâmetro 'temas', acesse: 
	<a href='../ogc.php?lista=temas' >lista de temas</a>. Os códigos são mostrados em vermelho.

	Exemplo:

	&lt;iframe height='400px' src='http://mapas.mma.gov.br/i3geo/mashups/openlayers.php?temas=bioma&amp;altura=350&amp;largura=350' style='border: 0px solid white;' width='400px'&gt;&lt;/iframe&gt;

	";	
	exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<script type="text/javascript" src="../classesjs/compactados/classe_calculo_compacto.js"></script>
<script type="text/javascript" src="../pacotes/openlayers/OpenLayers.js.php"></script>
<link rel="stylesheet" href="theme/default/style.css" type="text/css" />
<link rel="stylesheet" href="openlayers.css" type="text/css" />

</head>
<body>
<div id=i3geoMapa style="width:<?php echo $largura;?>px;height:<?php echo $altura;?>px;"></div>
<script type="text/javascript">
navn = false;
//seta as variáveis navn e navm
var navn = false;
var navm = false;
var app = navigator.appName.substring(0,1);
if (app==='N'){navn=true;}else{navm=true;}

OpenLayers.ImgPath = "../pacotes/openlayers/img/"
OpenLayers.Lang.setCode("pt-BR");
function i3GeoMapaInicia(){
	i3geoOL = new OpenLayers.Map('i3geoMapa', {
		controls: [
			<?php echo implode(",",$objControles); ?>
		],
		numZoomLevels: <?php echo $numzoomlevels;?>,
		maxExtent: new OpenLayers.Bounds(<?php echo $maxextent;?>)
	});
	var ol_wms = new OpenLayers.Layer.WMS.Untiled( "OpenLayers WMS","http://labs.metacarta.com/wms/vmap0",{layers: 'basic'} );
	var jpl_wms = new OpenLayers.Layer.WMS( "NASA Global Mosaic","http://t1.hypercube.telascience.org/cgi-bin/landsat7",{layers: "landsat7"});
	jpl_wms.setVisibility(false);
	layergrafico = new OpenLayers.Layer.Vector("Edição");
	i3geoOL.addLayers([ol_wms, jpl_wms, <?php echo implode(",",$objOpenLayers); ?>,layergrafico]);
	i3geoOL.zoomToMaxExtent();
	//
	//substitui o controle que mostra as coordenadas
	//
	var idcoord = i3geoOL.getControlsBy("separator"," ");
	//alert(idcoord[0].id)
	if(idcoord[0]){
		i3geoOL.events.register("mousemove", i3geoOL, function(e){
			var p,lonlat,d,dc;
			if (navm)
			{p = new OpenLayers.Pixel(e.x,e.y);}
			else
			{p = e.xy;}
			//altera o indicador de localizacao
			lonlat = i3geoOL.getLonLatFromPixel(p);
			d = i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);
			try{
				$i(idcoord[0].id).innerHTML = "Long: "+d[0]+"<br>Lat: "+d[1];
			}
			catch(e){
				if(typeof(console) !== 'undefined'){console.error(e);}
			}
		});
	}
	var botoes = <?php echo $botoes; ?>;
	i3GEOOLcriaBotoes(botoes);
};
function i3GEOOLcriaBotoes(botoes){
	var sketchSymbolizers = {
	    "Point": {
	        pointRadius: 4,
	        graphicName: "square",
	        fillColor: "white",
	        fillOpacity: 1,
	        strokeWidth: 1,
	        strokeOpacity: 1,
	        strokeColor: "#333333"
	    },
	    "Line": {
	        strokeWidth: 3,
	        strokeOpacity: 1,
	        strokeColor: "#666666",
	        strokeDashstyle: "dash"
	    },
	    "Polygon": {
	        strokeWidth: 2,
	        strokeOpacity: 1,
	        strokeColor: "#666666",
	        fillColor: "white",
	        fillOpacity: 0.3
	    }
	};
	var style = new OpenLayers.Style();
	style.addRules([
	    new OpenLayers.Rule({symbolizer: sketchSymbolizers})
	]);
	var styleMap = new OpenLayers.StyleMap({"default": style});

	var adiciona = false;
	var controles = new Array();
	var panel = new OpenLayers.Control.Panel({
		displayClass: "olControlEditingToolbar noprint"
	});
	if(botoes.pan==true){
		controles.push(new OpenLayers.Control.Navigation({title: "Deslocar",displayClass:"pan"}));
		var adiciona = true;
	}
	if(botoes.zoombox==true){
		controles.push(new OpenLayers.Control.ZoomBox({displayClass: "zoombox",title: "Zoom"}));
		var adiciona = true;
	}
	if(botoes.zoomtot==true){
		var button = new OpenLayers.Control.Button({
			displayClass: "zoomtot", 
			trigger: function(){i3geoOL.zoomToMaxExtent();},
			title: "Ajusta extens&atilde;o"
		});
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.legenda==true){
		var button = new OpenLayers.Control.Button({
			displayClass: "legenda", 
			trigger: function(){i3GEOOLmostraLegenda();},
			title: "Legenda"
		});
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.distancia==true){
		var button = new OpenLayers.Control.Measure(
			OpenLayers.Handler.Path,
			{
				handlerOptions: {layerOptions: {styleMap: styleMap}},
				persist: true,
				displayClass: "distancia", 
				title: "Distância"
			}
		);
		button.events.on({
			"measure": function(event){
					var units = event.units;
					var measure = event.measure;
					alert("Distância: " + measure.toFixed(3) + " " + units);
			},
		});
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.area==true){
		var button = new OpenLayers.Control.Measure(
			OpenLayers.Handler.Polygon,
			{
				handlerOptions: {layerOptions: {styleMap: styleMap}},
				persist: true,
				displayClass: "area", 
				title: "Área"
			}
		);
		button.events.on({
			"measure": function(event){
					var units = event.units;
					var measure = event.measure;
					alert("Área: " + measure.toFixed(3) + " " + units + " quadrados");
			},
		});
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.identifica==true){
    	button = new OpenLayers.Control.WMSGetFeatureInfo({
           	maxFeatures:1,
           	infoFormat:'text/plain', //'application/vnd.ogc.gml',
           	layers: i3GEOOLpegaLayers(),
           	queryVisible: true,
           	title: "Identificar",
           	displayClass: "identifica",
            eventListeners: {
                getfeatureinfo: function(event) {
                    var lonlat = i3geoOL.getLonLatFromPixel(event.xy);
                    var lonlattexto = "<hr><pre><span style=color:blue;cursor:pointer onclick='i3GEOOLcaptura(\""+lonlat.lon+","+lonlat.lat+"\")'>captura</span></pre>";
                    i3geoOL.addPopup(new OpenLayers.Popup.FramedCloud(
                        "chicken", 
                        i3geoOL.getLonLatFromPixel(event.xy),
                        null,
                        lonlattexto+"<pre>"+event.text+"</pre>",
                        null,
                        true
                    ));
                }
            }
       	});
		//button.events.register("getfeatureinfo", this, showInfo);
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.linha==true){
		button = new OpenLayers.Control.DrawFeature(
			layergrafico,
            OpenLayers.Handler.Path,
            {
            	displayClass: "linha",
            	title: "digitalizar linha"
            }
		);
		controles.push(button);
		var adiciona = true;
	}	
	if(botoes.ponto==true){
		button = new OpenLayers.Control.DrawFeature(
			layergrafico,
            OpenLayers.Handler.Point,
            {
            	displayClass: "ponto",
            	title: "digitalizar ponto"
            }
		);
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.poligono==true){
		button = new OpenLayers.Control.DrawFeature(
			layergrafico,
            OpenLayers.Handler.Polygon,
            {
            	displayClass: "poligono",
            	title: "digitalizar polígono"
            }
		);
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.edita==true){
		button = new OpenLayers.Control.ModifyFeature(
			layergrafico,
            {
            	displayClass: "edita",
            	title: "edita elemento"
            }
		);
		controles.push(button);
		var adiciona = true;
	}
	//botao de seleção
	if(botoes.apaga==true){
		button = new OpenLayers.Control.SelectFeature(
			layergrafico,
            {
            	displayClass: "selecao",
            	title: "seleciona elemento",
                clickout: true,
                toggle: true,
                multiple: false,
                hover: false,
                toggleKey: "ctrlKey", // ctrl key removes from selection
                multipleKey: "shiftKey", // shift key adds to selection
                box: false
            }
		);
		controles.push(button);
		var adiciona = true;
	}
	if(botoes.apaga==true){
		var button = new OpenLayers.Control.Button({
			displayClass: "apaga", 
			trigger: function(){
				if(layergrafico.selectedFeatures.length > 0){
					var x = window.confirm("Exclui os elementos selecionados?");
					if(x)
					{layergrafico.removeFeatures(layergrafico.selectedFeatures);}
				}
				else
				{alert("Selecione pelo menos um elemento");}
			},
			title: "Apaga selecionados"
		});
		controles.push(button);
		var adiciona = true;
	}	
	if(botoes.captura==true){
		botaoCapturaOL = new OpenLayers.Control.GetFeature({
			protocol: "",
			displayClass: "captura", 
			title: "Captura geometria",
            eventListeners: {
                featureselected: function(e) {
                    layergrafico.addFeatures([e.feature]);
                }
            }
		});
		botaoCapturaOL.events.register(
			"activate",
			this, 
			function(e){
				var layers = i3GEOOLpegaLayers();
                var u = layers[0].url+"&request=getfeature&service=wfs";
                u += "&typename="+layers[0].params.LAYERS;
                u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Point><gml:coordinates>-54,-12</gml:coordinates></gml:Point></Intersect></Filter>";
                botaoCapturaOL.protocol = OpenLayers.Protocol.WFS({
                	url:u
                });
            }
        );
 		controles.push(botaoCapturaOL);
		var adiciona = true;
	}	
	//
	//adiciona o painel ao mapa se alguma opï¿½ï¿½o foi inserida
	//
	if(adiciona == true){
		panel.addControls(controles);
		i3geoOL.addControl(panel);
	}
}
function i3GEOOLmostraLegenda(){
	var layers = pegaLayers()
	var nlayers = layers.length;
	var ins = "";
	for(i=0;i<nlayers;i++){
		var url = layers[i].getFullRequestString({"request":"getlegendgraphic"});
		url = url.replace("LAYERS","LAYER");
		ins += "<img src='"+url+"' /><br>";
	}
	var w = window.open()
	w.document.write(ins)
	w.document.close();

}
function i3GEOOLpegaLayers(){
	var layers = i3geoOL.layers;
	var nlayers = layers.length;
	var ins = new Array();
	for(i=0;i<nlayers;i++){
		if(layers[i].visibility && (layers[i].isBaseLayer == false)){
			ins.push(layers[i]);
		}
	}
	return ins;
}
function i3GEOOLcaptura(lonlat){
	var layers = i3GEOOLpegaLayers();
    var u = layers[0].url+"&request=getfeature&service=wfs&version=1.0.0";
    u += "&OUTPUTFORMAT=gml2&typename="+layers[0].params.LAYERS;
    u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Point><gml:coordinates>"+lonlat+"</gml:coordinates></gml:Point></Intersect></Filter>";
	document.body.style.cursor="wait";
	document.getElementById("i3geoMapa").style.cursor = "wait";
	OpenLayers.Request.issue({
		method: "GET",
		url: u,
		callback: function(retorno){
			document.body.style.cursor="default";
			document.getElementById("i3geoMapa").style.cursor = "default";
			var fromgml = new OpenLayers.Format.GML({
				geometryName: "msGeometry"
			});
			var gml = fromgml.read(retorno.responseText);
			layergrafico.addFeatures(gml);
		},
		failure: function(){
			document.body.style.cursor="default";
			document.getElementById("i3geoMapa").style.cursor = "default";
			alert("Erro");
		}
	})
}
i3GeoMapaInicia();
</script>
</body>
</html>
