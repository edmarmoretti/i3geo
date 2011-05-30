/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */
var $i = function(id)
{return document.getElementById(id);};
//seta as variáveis navn e navm
var navn = false;
var navm = false;
var app = navigator.appName.substring(0,1);
if (app==='N'){navn=true;}else{navm=true;}

OpenLayers.ImgPath = "../pacotes/openlayers/img/";
OpenLayers.Lang.setCode("pt-BR");
i3GEO.editorOL = {
	nomeFuncaoSalvar: "i3GEO.editorOL.testeSalvar()", 
	ol_mma: new OpenLayers.Layer.WMS(
		"Base cartográfica",
		"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map&",
		{layers:'baseraster',SRS:'EPSG:4291',FORMAT:'image/png'}
	),
	ol_wms: new OpenLayers.Layer.WMS.Untiled(
		"OpenLayers WMS",
		"http://labs.metacarta.com/wms/vmap0",
		{layers: 'basic'}
	),
	jpl_wms: new OpenLayers.Layer.WMS( "NASA Global Mosaic", "http://wms.jpl.nasa.gov/wms.cgi", {layers: "modis,global_mosaic"},{singleTile:true}),
	osm_wms: new OpenLayers.Layer.WMS(
		"Open Street Map",
		"http://full.wms.geofabrik.de/std/demo_key?",
		{layers: ""}
	),
	top_wms: new OpenLayers.Layer.WMS(
		"Toponímia MMA",
		"http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseref.map&",
		{layers: "base",FORMAT:'image/png'}
	),
	est_wms: new OpenLayers.Layer.WMS(
		"Estados do Brasil",
		"http://mapas.mma.gov.br/i3geo/ogc.php?tema=estadosl&",
		{layers: "estadosl",FORMAT:'image/png'}
	),
	fundo: "ol_mma,ol_wms,jpl_wms,osm_wms,top_wms,est_wms",
	layergrafico: new OpenLayers.Layer.Vector("Edição",{displayInLayerSwitcher:true,visibility:true}),
	layersIniciais: [],
	botoes: {
		'pan':true,
		'zoombox':true,
		'zoomtot':true,
		'legenda':true,
		'distancia':true,
		'area':true,
		'identifica':true,
		'linha':true,
		'ponto':true,
		'poligono':true,
		'edita':true,
		'uniao':true,
		'apaga':true,
		'procura':true,
		'selecao':true,
		'salva':true,
		'ajuda':true,
		'propriedades':true,
		'fecha':false
	},
	pontos: [],
	marca: "../pacotes/openlayers/img/marker-gold.png",
	controles: [
		new OpenLayers.Control.Navigation(),
		new OpenLayers.Control.PanZoomBar(),
		new OpenLayers.Control.LayerSwitcher({'ascending':false}),
		new OpenLayers.Control.ScaleLine(),
		new OpenLayers.Control.MousePosition({'separator':' '}),
		new OpenLayers.Control.OverviewMap(),
		new OpenLayers.Control.KeyboardDefaults()	
	],
	numzoom: 12,
	maxext: new OpenLayers.Bounds(-76.5125927,-39.3925675209,-29.5851853,9.49014852081),
	mapa: "",
	inicia: function(){
		var alayers = [],
			fundo = (i3GEO.editorOL.fundo).split(","),
			nfundo = fundo.length,
			ncontroles = i3GEO.editorOL.controles.length,
			i,
			n;
		if(i3GEO.editorOL.mapa === "")
		{alert("O objeto i3GEO.editorOL.mapa precisa ser criado com new OpenLayers.Map()");return;}
		if(i3GEO.editorOL.maxext !== ""){
			i3GEO.editorOL.mapa.setOptions({
				numZoomLevels: i3GEO.editorOL.numzoom,
				maxExtent: i3GEO.editorOL.maxext
			});
		}
		for(i=0;i<ncontroles;i++){
			i3GEO.editorOL.mapa.addControl(i3GEO.editorOL.controles[i]);
		}
		if(i3GEO.editorOL.fundo != ""){
			for(i=nfundo-1;i>=0;i--){
				try{
					eval("i3GEO.editorOL."+fundo[i]+".transitionEffect = 'resize';");
					eval("i3GEO.editorOL."+fundo[i]+".setVisibility(false);");
					eval("alayers.push(i3GEO.editorOL."+fundo[i]+");");
				}
				catch(e){alayers[0].setVisibility(true);}
			}
		}
		i3GEO.editorOL.mapa.addLayers(alayers);
		if(i3GEO.editorOL.layersIniciais !== ""){
			n = i3GEO.editorOL.layersIniciais.length;
			for(i=0;i<n;i++)
			{i3GEO.editorOL.mapa.addLayer(i3GEO.editorOL.layersIniciais[i]);}
		}
		if(i3GEO.editorOL.layergrafico !== ""){
			i3GEO.editorOL.mapa.addLayers([i3GEO.editorOL.layergrafico]);
		}
		i3GEO.editorOL.adicionaMarcas();
		if(i3GEO.editorOL.maxext !== "")
		{i3GEO.editorOL.mapa.zoomToMaxExtent();}
		i3GEO.editorOL.coordenadas();	
		i3GEO.editorOL.criaJanelaBusca();
		i3GEO.editorOL.criaJanelaAtivaTema();
		i3GEO.editorOL.criaBotoes(i3GEO.editorOL.botoes);
	},
	layersLigados: function(){
		var layers = i3GEO.editorOL.mapa.layers,
			nlayers = layers.length,
			ins = [];
		for(i=0;i<nlayers;i++){
			if(layers[i].isBaseLayer === false && layers[i].visibility === true){
				ins.push(layers[i]);
			}
		}
		return ins;
	},
	coordenadas: function(){
		//
		//substitui o controle que mostra as coordenadas
		//
		var idcoord = i3GEO.editorOL.mapa.getControlsBy("separator"," ");
		if(idcoord[0]){
			i3GEO.editorOL.mapa.events.register("mousemove", i3GEO.editorOL.mapa, function(e){
				var p,lonlat,d,dc;
				if (navm)
				{p = new OpenLayers.Pixel(e.x,e.y);}
				else
				{p = e.xy;}
				//altera o indicador de localizacao
				lonlat = i3GEO.editorOL.mapa.getLonLatFromPixel(p);
				d = i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);
				try{
					$i(idcoord[0].id).innerHTML = "Long: "+d[0]+"<br>Lat: "+d[1];
				}
				catch(e){
					if(typeof(console) !== 'undefined'){console.error(e);}
				}
			});
		}	
	},
	criaJanelaBusca: function(){
		var layers = i3GEO.editorOL.layersLigados(),
			nlayers = layers.length,
			i,
			ins,
			combo = "<select id=i3GEOOLlistaTemasBusca ><option value=''>----</option>";
		for(i=0;i<nlayers;i++){
			combo += "<option value='"+i+"' >"+layers[i].name+"</option>";
		}
		combo += "</select>";
		ins = "<div class=paragrafo >Tema:<br>"+combo;
		ins += "<br>Item:<br><span id=i3GEOOLcomboitens ></span>";
		ins += "<br>Procurar por:<br><input type=text size=20 id=i3GEOOLpalavraBusca >";
		ins += "<br><br><input type=button value='Procurar' id='i3GEOOLbotaoBusca' ></div>";
		ins += "<br>Resultado:<br><span id=i3GEOOLcomboresultado ></span>";
		try{
			YAHOO.namespace("procura.container");
			YAHOO.procura.container.panel = new YAHOO.widget.Panel("panelprocura", {zIndex:2000, iframe:false, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.procura.container.panel.setHeader("Encontre no mapa");
			YAHOO.procura.container.panel.setBody(ins);
			YAHOO.procura.container.panel.setFooter("");
			YAHOO.procura.container.panel.render(document.body);
			YAHOO.procura.container.panel.center();

			document.getElementById("i3GEOOLbotaoBusca").onclick = function(){
				var layer = i3GEO.editorOL.layerAtivo(),
					item = document.getElementById("i3GEOOLbuscaItem").value,
					palavra = document.getElementById("i3GEOOLpalavraBusca").value;
				if(item === "" || palavra === "")
				{alert("Escolha o item e o texto de busca");return;}
				i3GEO.editorOL.busca(layer,item,palavra,"i3GEOOLcomboresultado");
			};
			document.getElementById("i3GEOOLlistaTemasBusca").onchange = function(){
				i3GEO.editorOL.ativaTema(this.value);
				document.getElementById("i3GEOOLcomboitens").innerHTML = "...";
				i3GEO.editorOL.listaItens(i3GEO.editorOL.layerAtivo(),"i3GEOOLcomboitens","i3GEOOLbuscaItem");
			};
		}
		catch(e){}
	},
	criaJanelaAtivaTema: function(){
		var layers = i3GEO.editorOL.layersLigados(),
			nlayers = layers.length,
			i,
			temp,
			combo = "<select id=i3GEOOLlistaTemasAtivos >";
		for(i=0;i<nlayers;i++){
			combo += "<option value='"+i+"' >"+layers[i].name+"</option>";
		}
		combo += "</select>";
		if(!document.getElementById("paneltemaativo")){
			YAHOO.namespace("temaativo.container");
			YAHOO.temaativo.container.panel = new YAHOO.widget.Panel("paneltemaativo", {zIndex:20000, iframe:true, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.temaativo.container.panel.setBody(combo);
			if(typeof i3GEO != undefined && i3GEO != "")
			{YAHOO.temaativo.container.panel.setHeader("Tema ativo<div id='paneltemaativo_minimizaCabecalho' class='container-minimiza'></div>");}
			else
			{YAHOO.temaativo.container.panel.setHeader("Tema ativo");}
			YAHOO.temaativo.container.panel.setFooter("");
			YAHOO.temaativo.container.panel.render(document.body);
			YAHOO.temaativo.container.panel.center();
			YAHOO.util.Event.addListener(YAHOO.temaativo.container.panel.close, "click", function(){
				i3GEOpanelEditor.deactivate();
				i3GEOpanelEditor.activate();
				if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEO.editorOL.criaJanelaAtivaTema()") > 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEO.editorOL.criaJanelaAtivaTema()");}				
			});
			if(typeof i3GEO != undefined && i3GEO != ""){
				if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEO.editorOL.criaJanelaAtivaTema()") < 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEO.editorOL.criaJanelaAtivaTema()");}
			}
			temp = $i("paneltemaativo_minimizaCabecalho");
			if(temp){
				temp.onclick = function(){i3GEO.janela.minimiza("paneltemaativo");}
			}
		}
		else{	
			YAHOO.temaativo.container.panel.setBody(combo);
			YAHOO.temaativo.container.panel.render(document.body);
			YAHOO.temaativo.container.panel.show();
		}
		document.getElementById("i3GEOOLlistaTemasAtivos").onchange = function(){
			if(botaoIdentifica){
				botaoIdentifica.layers = [i3GEO.editorOL.layersLigados()[this.value]];
			} 
		};
	},
	ativaTema: function(id){
		document.getElementById("i3GEOOLlistaTemasAtivos").value = id;
	},
	layerAtivo: function(){
		var id = document.getElementById("i3GEOOLlistaTemasAtivos");
		if(id)
		{id = id.value;}
		else
		{id = i3GEO.temaAtivo;}
		return i3GEO.editorOL.layersLigados()[id];
	},
	listaItens: function(layer,idonde,idobj){
	    if(!layer){return;}
	    if(!layer.params){return;}
	    var u = layer.url+"&request=describefeaturetype&service=wfs&version=1.0.0";
	    u += "&typename="+layer.params.LAYERS;
		document.body.style.cursor="wait";
		document.getElementById("i3geoMapa").style.cursor = "wait";
		OpenLayers.Request.issue({
			method: "GET",
			url: u,
			callback: function(retorno){
				document.body.style.cursor="default";
				document.getElementById("i3geoMapa").style.cursor = "default";
				var fromgml = new OpenLayers.Format.WFSDescribeFeatureType({
					geometryName: "msGeometry"
				}),
					gml = fromgml.read(retorno.responseText),
					prop = gml.featureTypes[0].properties,
					nprop = prop.length,
					itens = [],
					i,
					combo = "<select id="+idobj+" ><option value=''>----</option>";
				for(i = 0;i < nprop; i++){
					combo += "<option value="+prop[i].name+" >"+prop[i].name+"</option>";
				}
				combo += "</select>";
				document.getElementById(idonde).innerHTML = combo;
			},
			failure: function(){
				document.body.style.cursor="default";
				document.getElementById("i3geoMapa").style.cursor = "default";
				alert("Erro");
			}
		});			
	},
	busca: function(layer,item,palavra,onde){
		document.body.style.cursor="wait";
		document.getElementById("i3geoMapa").style.cursor = "wait";
	    var u = layer.url+"&request=getfeature&service=wfs&version=1.0.0";
	    u += "&OUTPUTFORMAT=gml2&typename="+layer.params.LAYERS;
	    u += "&filter=<Filter><PropertyIsLike wildcard=* singleChar=. escape=! ><PropertyName>"+item+"</PropertyName><Literal>*"+palavra+"*</Literal></PropertyIsLike></Filter>";
		document.body.style.cursor="wait";
		document.getElementById("i3geoMapa").style.cursor = "wait";
		document.getElementById(onde).innerHTML = "...";
		OpenLayers.Request.issue({
			method: "GET",
			url: u,
			callback: function(retorno){
				document.body.style.cursor="default";
				document.getElementById("i3geoMapa").style.cursor = "default";
				var fromgml = new OpenLayers.Format.GML({
					geometryName: "msGeometry"
				}),
					gml = fromgml.read(retorno.responseText),
					ngml = gml.length,
					i,
					ins = "<select onchange='i3GEO.editorOL.zoomPara(this.value)'>";
				ins += "<option value=''>---</option>";
				for(i=0;i<ngml;i++){
					eval("var valor = gml[i].data."+item);
					var bounds = gml[i].geometry.getBounds();
					bounds = bounds.toBBOX();
					ins += "<option value='"+bounds+"'>"+valor+"</option>";
				}
				ins += "</select>";
				document.getElementById(onde).innerHTML = ins;
			},
			failure: function(){
				document.body.style.cursor="default";
				document.getElementById("i3geoMapa").style.cursor = "default";
				alert("Erro");
			}
		});
	},
	zoomPara: function(bbox){
		var b = new OpenLayers.Bounds.fromString(bbox);
		i3GEO.editorOL.mapa.zoomToExtent(b);
	},
	mostraLegenda: function(){
		var layers = i3GEO.editorOL.layersLigados(),
			nlayers = layers.length,
			ins = "";
		for(i=0;i<nlayers;i++){
			try{
				var url = layers[i].getFullRequestString({"request":"getlegendgraphic"});
				url = url.replace("LAYERS","LAYER");
				ins += "<img src='"+url+"' /><br>";
			}
			catch(e){}
			}
		var w = window.open();
		w.document.write(ins);
		w.document.close();
	},
	captura: function(lonlat){
		var layers = [i3GEO.editorOL.layerAtivo()],
			xy = lonlat.split(","),
			u = layers[0].url+"&request=getfeature&service=wfs&version=1.0.0";
	    u += "&OUTPUTFORMAT=gml2&typename="+layers[0].params.LAYERS;
		
	    //u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Point><gml:coordinates>"+lonlat+"</gml:coordinates></gml:Point></Intersect></Filter>";
		
		xy[0] = xy[0] * 1;
		xy[1] = xy[1] * 1;
		var poligono = (xy[0]-0.1)+","+(xy[1]+0.1) + " "+(xy[0]+0.1)+","+(xy[1]+0.1)+" " + (xy[0]+0.1)+","+(xy[1]-0.1)+" " + (xy[0]-0.1)+","+(xy[1]-0.1)+" "+(xy[0]-0.1)+","+(xy[1]+0.1);
		u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:posList>"+poligono+"</gml:posList></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></Intersect></Filter>";
		
		document.body.style.cursor="wait";
		if(document.getElementById("i3geoMapa"))
		{document.getElementById("i3geoMapa").style.cursor = "wait";}
		OpenLayers.Request.issue({
			method: "GET",
			url: u,
			callback: function(retorno){
				document.body.style.cursor="default";
				if(document.getElementById("i3geoMapa"))
				{document.getElementById("i3geoMapa").style.cursor = "default";}
				var fromgml = new OpenLayers.Format.GML({
					geometryName: "msGeometry"
				});
				var gml = fromgml.read(retorno.responseText);
				i3GEO.editorOL.layergrafico.addFeatures(gml);
			},
			failure: function(){
				document.body.style.cursor="default";
				if(document.getElementById("i3geoMapa"))
				{document.getElementById("i3geoMapa").style.cursor = "default";}
				alert("Erro");
			}
		});
	},
	salvaGeometrias: function(){
		try{
			YAHOO.namespace("salvaGeometrias.container");
			YAHOO.salvaGeometrias.container.panel = new YAHOO.widget.Panel("panelsalvageometrias", {zIndex:2000, iframe:false, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.salvaGeometrias.container.panel.setHeader("Geometrias");
			YAHOO.salvaGeometrias.container.panel.setBody("");
			YAHOO.salvaGeometrias.container.panel.setFooter("");
			YAHOO.salvaGeometrias.container.panel.render(document.body);
			YAHOO.salvaGeometrias.container.panel.center();
		}
		catch(e){}
		YAHOO.salvaGeometrias.container.panel.show();
		var geos = i3GEO.editorOL.layergrafico.selectedFeatures;
		var n = geos.length;
		var ins = "";
		if(n > 0){
			ins += "<p class=paragrafo >Foram encontrada(s) "+n+" geometria(s) selecionada(s) </p>";
			ins += "<p class=paragrafo ><a href='#' onclick='i3GEO.editorOL.listaGeometriasSel()' > Listar geometrias</a> ";
			ins += "<a href='#' onclick='"+i3GEO.editorOL.nomeFuncaoSalvar+"' >Salvar geometria(s)</a></p>";
			YAHOO.salvaGeometrias.container.panel.setBody(ins);
		}
		else
		{alert("Selecione pelo menos um elemento");}
	},
	listaGeometriasSel: function(){
		var geos = i3GEO.editorOL.layergrafico.selectedFeatures;
		var n = geos.length;
		var ins = "";
		for(i=0;i<n;i++){
			ins += "<b>Geometria: "+i+"</b><br>"+geos[i].geometry+"<br><br>";
			ins += "<b>Atributos: "+i+"</b><br>";
			var a = geos[i].attributes;
			var keys = [];
			for(key in a){
   				if(a[key]){
   					ins += key+" = "+a[key]+"<br>";
   				}
			}			
		}
		var w = window.open();
		w.document.write(ins);
		w.document.close();
	},
	testeSalvar: function(){
		alert("Funcao nao disponivel. Defina o nome da funcao em i3GEO.editorOL.nomeFuncaoSalvar ");
	},
	criaBotoes: function(botoes){
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
		},
		style = new OpenLayers.Style(),
		styleMap = new OpenLayers.StyleMap({"default": style}),
		adiciona = false,
		button,
		controles = [];
		
		style.addRules([
		    new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);		
		i3GEOpanelEditor = new OpenLayers.Control.Panel({
			displayClass: "olControlEditingToolbar1 noprint"
		});
		if(botoes.procura===true){
			button = new OpenLayers.Control.Button({
				displayClass: "procura", 
				trigger: function(){YAHOO.procura.container.panel.show();},
				title: "Procurar"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.pan===true){
			controles.push(new OpenLayers.Control.Navigation({title: "Deslocar",displayClass:"pan"}));
			adiciona = true;
		}
		if(botoes.zoombox===true){
			controles.push(new OpenLayers.Control.ZoomBox({displayClass: "zoombox",title: "Zoom"}));
			adiciona = true;
		}
		if(botoes.zoomtot===true){
			button = new OpenLayers.Control.Button({
				displayClass: "zoomtot", 
				trigger: function(){i3GEO.editorOL.mapa.zoomToMaxExtent();},
				title: "Ajusta extens&atilde;o"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.legenda===true){
			button = new OpenLayers.Control.Button({
				displayClass: "legenda", 
				trigger: function(){i3GEO.editorOL.mostraLegenda();},
				title: "Legenda"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.distancia===true){
			button = new OpenLayers.Control.Measure(
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
						var units = event.units,
							measure = event.measure;
						alert("Distância: " + measure.toFixed(3) + " " + units);
				}
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.area===true){
			button = new OpenLayers.Control.Measure(
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
				}
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.identifica===true){
			botaoIdentifica = new OpenLayers.Control.WMSGetFeatureInfo({
				maxFeatures:1,
				infoFormat:'text/plain', //'application/vnd.ogc.gml',
				layers: [i3GEO.editorOL.layerAtivo()],
				queryVisible: true,
				title: "Identificar",
				displayClass: "identifica",
				eventListeners: {
					getfeatureinfo: function(event) {
						var lonlat = i3GEO.editorOL.mapa.getLonLatFromPixel(event.xy);
						var lonlattexto = "<hr><pre><span style=color:blue;cursor:pointer onclick='i3GEO.editorOL.captura(\""+lonlat.lon+","+lonlat.lat+"\")'>captura</span></pre>";
						i3GEO.editorOL.mapa.addPopup(new OpenLayers.Popup.FramedCloud(
							"chicken", 
							i3GEO.editorOL.mapa.getLonLatFromPixel(event.xy),
							null,
							lonlattexto+"<pre>"+event.text+"</pre>",
							null,
							true
						));
					},
					activate: function(){
						i3GEO.editorOL.criaJanelaAtivaTema();
					}
				}
			});
			//button.events.register("getfeatureinfo", this, showInfo);
			controles.push(botaoIdentifica);
			adiciona = true;
		}
		if(botoes.linha===true){
			button = new OpenLayers.Control.DrawFeature(
				i3GEO.editorOL.layergrafico,
				OpenLayers.Handler.Path,
				{
					displayClass: "linha",
					title: "digitalizar linha"
				}
			);
			controles.push(button);
			adiciona = true;
		}	
		if(botoes.ponto===true){
			button = new OpenLayers.Control.DrawFeature(
				i3GEO.editorOL.layergrafico,
				OpenLayers.Handler.Point,
				{
					displayClass: "ponto",
					title: "digitalizar ponto"
				}
			);
			controles.push(button);
			adiciona = true;
		}
		if(botoes.poligono===true){
			button = new OpenLayers.Control.DrawFeature(
				i3GEO.editorOL.layergrafico,
				OpenLayers.Handler.Polygon,
				{
					displayClass: "poligono",
					title: "digitalizar polígono"
				}
			);
			controles.push(button);
			adiciona = true;
		}
		if(botoes.edita===true){
			button = new OpenLayers.Control.ModifyFeature(
				i3GEO.editorOL.layergrafico,
				{
					displayClass: "edita",
					title: "edita elemento"
				}
			);
			controles.push(button);
			adiciona = true;
		}
		if(botoes.uniao===true){
			button = new OpenLayers.Control.Button({
				displayClass: "uniao", 
				trigger: function(){
					i3GEO.editorOL.carregajts("i3GEO.editorOL.uniao()");
				},
				title: "Une geometrias"
			});
			controles.push(button);
			adiciona = true;
		}		
		//botao de seleção
		if(botoes.selecao===true){
			button = new OpenLayers.Control.SelectFeature(
				i3GEO.editorOL.layergrafico,
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
			adiciona = true;
		}
		if(botoes.apaga===true){
			button = new OpenLayers.Control.Button({
				displayClass: "apaga", 
				trigger: function(){
					if(i3GEO.editorOL.layergrafico.selectedFeatures.length > 0){
						var x = window.confirm("Exclui os elementos selecionados?");
						if(x)
						{i3GEO.editorOL.layergrafico.removeFeatures(i3GEO.editorOL.layergrafico.selectedFeatures);}
					}
					else
					{alert("Selecione pelo menos um elemento");}
				},
				title: "Apaga selecionados"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.propriedades===true){
			button = new OpenLayers.Control.Button({
				displayClass: "propriedades", 
				trigger: function(){i3GEO.editorOL.propriedades();},
				title: "Propriedades"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.salva===true){
			button = new OpenLayers.Control.Button({
				displayClass: "salva", 
				trigger: function(){i3GEO.editorOL.salvaGeometrias();},
				title: "Salvar"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.ajuda===true){
			button = new OpenLayers.Control.Button({
				displayClass: "ajuda", 
				trigger: function(){
					try
					{window.open(i3GEO.configura.locaplic+"/mashups/openlayers_ajuda.php");}
					catch(e)
					{window.open("openlayers_ajuda.php");}
				},
				title: "Ajuda"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.fecha===true){
			button = new OpenLayers.Control.Button({
				displayClass: "fecha", 
				trigger: function(){
					if(window.confirm("A edição será perdida. Continua?")){
						i3GEOpanelEditor.destroy();
						YAHOO.temaativo.container.panel.destroy();
						i3GEO.editorOL.mapa.removeLayer(i3GEO.editorOL.layergrafico);
					}
				},
				title: "Fechar editor"
			});
			controles.push(button);
			adiciona = true;
		}
		//
		//controle que permite o snap
		//
        i3GEOOLsnap = new OpenLayers.Control.Snapping({layer: i3GEO.editorOL.layergrafico});
		i3GEOOLsplit = new OpenLayers.Control.Split({
			layer: i3GEO.editorOL.layergrafico,
			source: i3GEO.editorOL.layergrafico,
			tolerance: 0.0001,
			eventListeners: {
				aftersplit: function(event) {
					i3GEO.editorOL.flashFeatures(event.features);
				}
			}
		});	
		//
		//adiciona o painel ao mapa se alguma opï¿½ï¿½o foi inserida
		//
		if(adiciona === true){
			i3GEOpanelEditor.addControls(controles);
			i3GEO.editorOL.mapa.addControl(i3GEOpanelEditor);
		}
	},
	adicionaMarcas: function(){
		if(i3GEO.editorOL.pontos.length === 0)
		{return;}
		var SHADOW_Z_INDEX = 10,
			MARKER_Z_INDEX = 11,      
			DIAMETER = 200,
            layer = new OpenLayers.Layer.Vector(
                "pontos",
                {
                    styleMap: new OpenLayers.StyleMap({
                        externalGraphic: i3GEO.editorOL.marca,
                        backgroundGraphic: "../pacotes/openlayers/img/marker_shadow.png",
                        backgroundXOffset: 0,
                        backgroundYOffset: -7,
                        graphicZIndex: MARKER_Z_INDEX,
                        backgroundGraphicZIndex: SHADOW_Z_INDEX,
                        pointRadius: 10
                    }),
                    isBaseLayer: false,
                    rendererOptions: {yOrdering: true},
					displayInLayerSwitcher:true,
					visibility:true
                }
            ),
			index,
			x = [],
			y = [],
			pixel,
			lonlat,
			features = [];
		for (index = 0; index < i3GEO.editorOL.pontos.length; index = index + 2){
			x.push(i3GEO.editorOL.pontos[index]);
			y.push(i3GEO.editorOL.pontos[index+1]);
		}
		for (index = 0; index < x.length; index++) {
			features.push(
				new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(x[index], y[index])
				)
			);
		}
		layer.addFeatures(features);
		i3GEO.editorOL.mapa.addLayer(layer);
	},
	//obtido de openlayers.org
	propriedades: function(){
		if(!document.getElementById("panelpropriedadesEditor")){
			YAHOO.namespace("editorOL.container");
			YAHOO.editorOL.container.panel = new YAHOO.widget.Panel("panelpropriedadesEditor", {zIndex:20000, iframe:true, width:"350px", visible:false, draggable:true, close:true } );
			var ins = "" +
			'<p class=paragrafo >Ajusta nó em edição para o(a):</p>' +
			'<table class=lista7 >' +
			'	<tr>' +
			'		<td></td><td>nó</td><td></td><td>vértice</td><td></td><td>borda</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.snap()" type="checkbox" id="target_node" /></td><td><input onchange="i3GEO.editorOL.snap()" id="target_nodeTolerance" type="text" size="3" value=15 /></td>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.snap()" type="checkbox" id="target_vertex" /></td><td><input onchange="i3GEO.editorOL.snap()" id="target_vertexTolerance" type="text" size="3" value=15 /></td>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.snap()" type="checkbox" id="target_edge" /></td><td><input onchange="i3GEO.editorOL.snap()" id="target_edgeTolerance" type="text" size="3" value=15 /></td>' +
			'	</tr>' +
			'</table>' +
			'<br />' +
			'<p class=paragrafo >Divide intersecção ao digitalizar</p>' +
			'<table class=lista7 >' +
			'	<tr>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.split()" type="checkbox" id="edge_split_toggle" /></td><td>borda</td>' +
			'	</tr>' +
			'</table>';
			YAHOO.editorOL.container.panel.setBody(ins);
			if(typeof i3GEO != undefined && i3GEO != "")
			{YAHOO.editorOL.container.panel.setHeader("Propriedades<div id='panelpropriedadesEditor_minimizaCabecalho' class='container-minimiza'></div>");}
			else
			{YAHOO.editorOL.container.panel.setHeader("Propriedades");}

			YAHOO.editorOL.container.panel.setFooter("");
			YAHOO.editorOL.container.panel.render(document.body);
			YAHOO.editorOL.container.panel.center();
			YAHOO.util.Event.addListener(YAHOO.editorOL.container.panel.close, "click", function(){
			});
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEO.editorOL.criaJanelaAtivaTema()") < 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEO.editorOL.criaJanelaAtivaTema()");}			
			temp = $i("panelpropriedadesEditor_minimizaCabecalho");
			if(temp){
				temp.onclick = function(){i3GEO.janela.minimiza("panelpropriedadesEditor");}
			}

		}
		else{	
			YAHOO.editorOL.container.panel.render(document.body);
		}
		YAHOO.editorOL.container.panel.show();
	},
	snap: function(){
		var target = i3GEOOLsnap.targets[0],
			tipos = ["node","vertex","edge"],
			ntipos = tipos.length,
			i,
			temp,
			ativa = false;
		i3GEOOLsnap.deactivate();
		for(i=0;i<ntipos;i++){		
			temp = $i("target_"+tipos[i]);
			target[tipos[i]] = temp.checked;
			if(temp.checked === true)
			{ativa = true;}
			temp = $i("target_"+tipos[i]+"Tolerance");
			target[tipos[i]+"Tolerance"] = temp.value;
		}
		if(ativa === true)
		{i3GEOOLsnap.activate();}	
	},
	split: function(){
		i3GEOOLsplit.deactivate();
		var temp = $i("edge_split_toggle");
		if(temp.checked === true)
		{i3GEOOLsplit.activate();}
	},
	uniao: function(){
		var geosel = i3GEO.editorOL.layergrafico.selectedFeatures,
			polis,linhas,pontos,uniaopolis,uniaolinhas,uniaopontos;
		if(geosel.length > 1){
			polis = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.Polygon");
			linhas = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.LineString");
			pontos = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.Point");
			if(polis)
			{uniaopolis = i3GEO.editorOL.uniaojts(polis);}
			if(linhas)
			{uniaolinhas = i3GEO.editorOL.uniaojts(linhas);}
			if(pontos)
			{uniaopontos = i3GEO.editorOL.uniaojts(pontos);}
			if(uniaopolis)
			{i3GEO.editorOL.layergrafico.addFeatures(uniaopolis);}
			if(uniaolinhas)
			{i3GEO.editorOL.layergrafico.addFeatures(uniaolinhas);}
			if(uniaopontos)
			{i3GEO.editorOL.layergrafico.addFeatures(uniaopontos);}
		}
		else
		{alert("Selecione pelo menos dois elementos");}	
	},
	uniaojts: function(geoms){
		var n = geoms.length,
				rwkt = new jsts.io.WKTReader(),
				wwkt = new jsts.io.WKTWriter(),
				fwkt = new OpenLayers.Format.WKT(),
				wkt,
				g,
				i,uniao;
		if(n > 1){
			wkt = fwkt.write(geoms[0]);
			alert(wkt)
			uniao = rwkt.read(wkt);
			for(i=1;i <= n;i++){
				wkt = fwkt.write(geoms[i]);
				g = readerwkt.read(wkt);				
				uniao = uniao.union(g);
			}
			uniao = wwkt.write(uniao);
			return [fwkt.read(uniao)];
		}
		else
		{return false;}
	},
	retornaGeometriasTipo: function(features,tipo){
		var n = features.length,
			lista = [],
			i,temp;
		for(i=0;i<n;i++){
			temp = features[i].geometry;
			if(temp.CLASS_NAME == tipo)
			{lista.push(temp);}
		}
		return lista;
	},
	flashFeatures: function(features, index) {
		if(!index) {
			index = 0;
		}
		var current = features[index];
		if(current && current.layer === i3GEO.editorOL.layergrafico) {
			i3GEO.editorOL.layergrafico.drawFeature(features[index], "select");
		}
		var prev = features[index-1];
		if(prev && prev.layer === i3GEO.editorOL.layergrafico) {
			i3GEO.editorOL.layergrafico.drawFeature(prev, "default");
		}
		++index;
		if(index <= features.length) {
			window.setTimeout(function() {i3GEO.editorOL.flashFeatures(features, index);}, 75);
		}
	},
	carregajts: function(funcao){
		i3GEO.util.scriptTag(i3GEO.configura.locaplic+"/pacotes/jsts/jstsi3geo.js",funcao,"i3GEOjts",true);
	}
};