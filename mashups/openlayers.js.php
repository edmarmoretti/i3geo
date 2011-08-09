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
	simbologia: {
		opacidade: 0.8,
		texto: "",
		fillColor: "250,180,15",
		strokeWidth: 2,
		strokeColor: "250,150,0",
		pointRadius: 4,
		graphicName: "square",
		fontSize: "12px",
		fontColor: "0,0,0"
	},
	backup: new OpenLayers.Layer.Vector("Backup",{displayInLayerSwitcher:false,visibility:false}),
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
	jpl_wms: new OpenLayers.Layer.WMS(
		"NASA Global Mosaic",
		"http://wms.jpl.nasa.gov/wms.cgi",
		{layers: "modis,global_mosaic"},
		{singleTile:true}
	),
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
	kml: [],
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
		'texto':true,
		'edita':true,
		'apaga':true,
		'procura':true,
		'selecao':true,
		'salva':true,
		'ajuda':true,
		'propriedades':true,
		'fecha':false,
		'tools':false,
		'undo':false,
		'frente':false
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
			n,
			sketchSymbolizers = {
					"Point": {
						fillColor: "rgb(${fillColor})",
						fillOpacity: "${opacidade}",
						strokeWidth: "${strokeWidth}",
						strokeOpacity: "${opacidade}",
						strokeColor: "rgb(${strokeColor})",
						label: "${texto}",
						pointRadius: "${pointRadius}",
						graphicName: "${graphicName}",
						fontSize: "${fontSize}",
						fontColor: "rgb(${fontColor})",
						fontFamily: "Arial",
						fontWeight: "normal",
						labelAlign: "lb",
						labelXOffset: "3",
						labelYOffset: "3"						
					},
					"Line": {
						strokeWidth: "${strokeWidth}",
						strokeOpacity: "${opacidade}",
						strokeColor: "rgb(${strokeColor})"
					},
					"Polygon": {
						strokeWidth: "${strokeWidth}",
						strokeOpacity: "${opacidade}",
						strokeColor: "rgb(${strokeColor})",
						fillColor: "rgb(${fillColor})",
						fillOpacity: "${opacidade}"
					}
				},
			style = new OpenLayers.Style(),
			styleMap1 = new OpenLayers.StyleMap({"default": style});

		style.addRules([
			new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);				
		i3GEO.editorOL.layergrafico = new OpenLayers.Layer.Vector("Edição",{
				styleMap: styleMap1,
				displayInLayerSwitcher:true,
				visibility:true
			}
		);		
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
		i3GEO.editorOL.adicionaKml();
		i3GEO.editorOL.adicionaMarcas();
		if(i3GEO.editorOL.maxext !== "")
		{i3GEO.editorOL.mapa.zoomToMaxExtent();}
		i3GEO.editorOL.coordenadas();	
		i3GEO.editorOL.criaJanelaBusca();
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
	criaComboTemas: function(){
		var layers = i3GEO.editorOL.layersLigados(),
			nlayers = layers.length,
			i,
			temp,
			combo = "<select id=i3GEOOLlistaTemasAtivos >";
		//i3GEO.editorOL.layergrafico.setLayerIndex(i3GEO.editorOL.getNumLayers() + 1);
		for(i=0;i<nlayers;i++){
			combo += "<option value='"+i+"' >"+layers[i].name+"</option>";
		}
		combo += "</select>";
		return combo;		
	},
	atualizaJanelaAtivaTema: function(){
		var combo = i3GEO.editorOL.criaComboTemas();
		YAHOO.temaativo.container.panel.setBody(combo);
		document.getElementById("i3GEOOLlistaTemasAtivos").onchange = function(){
			if(botaoIdentifica){
				botaoIdentifica.layers = [i3GEO.editorOL.layersLigados()[this.value]];
			} 
		};		
	},
	criaJanelaAtivaTema: function(){
		var temp;
		if(!document.getElementById("paneltemaativo")){
			YAHOO.namespace("temaativo.container");
			YAHOO.temaativo.container.panel = new YAHOO.widget.Panel("paneltemaativo", {zIndex:20000, iframe:true, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.temaativo.container.panel.setBody("");
			if(typeof i3GEO != undefined && i3GEO != "")
			{YAHOO.temaativo.container.panel.setHeader("Tema ativo<div id='paneltemaativo_minimizaCabecalho' class='container-minimiza'></div>");}
			else
			{YAHOO.temaativo.container.panel.setHeader("Tema ativo");}
			YAHOO.temaativo.container.panel.setFooter("");
			YAHOO.temaativo.container.panel.render(document.body);
			YAHOO.temaativo.container.panel.show();
			YAHOO.temaativo.container.panel.center();
			i3GEO.editorOL.atualizaJanelaAtivaTema();
			YAHOO.util.Event.addListener(YAHOO.temaativo.container.panel.close, "click", function(){
				i3GEOpanelEditor.deactivate();
				i3GEOpanelEditor.activate();
				if(i3GEO.eventos && i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEO.editorOL.atualizaJanelaAtivaTema()") > 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEO.editorOL.atualizaJanelaAtivaTema()");}				
			});
			if(typeof i3GEO != undefined && i3GEO != ""){
				if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEO.editorOL.atualizaJanelaAtivaTema()") < 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEO.editorOL.atualizaJanelaAtivaTema()");}
			}
			temp = $i("paneltemaativo_minimizaCabecalho");
			if(temp){
				temp.onclick = function(){i3GEO.janela.minimiza("paneltemaativo");}
			}
		}
		else{	
			YAHOO.temaativo.container.panel.show();
		}
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
		//var w = window.open();
		//w.document.write(ins);
		//w.document.close();
		var temp;
		if(!document.getElementById("panellegendaeditorOL")){
			YAHOO.namespace("legendaeditorOL.container");
			YAHOO.legendaeditorOL.container.panel = new YAHOO.widget.Panel("panellegendaeditorOL", {zIndex:20000, iframe:true, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.legendaeditorOL.container.panel.setBody(ins);
			YAHOO.legendaeditorOL.container.panel.setHeader("Legenda");
			YAHOO.legendaeditorOL.container.panel.setFooter("");
			YAHOO.legendaeditorOL.container.panel.render(document.body);
			YAHOO.legendaeditorOL.container.panel.show();
			YAHOO.legendaeditorOL.container.panel.center();
			
			YAHOO.util.Event.addListener(YAHOO.legendaeditorOL.container.panel.close, "click", function(){
				//i3GEOpanelEditor.deactivate();
				//i3GEOpanelEditor.activate();
			});
		}
		else{	
			YAHOO.legendaeditorOL.container.panel.setBody(ins);
			YAHOO.legendaeditorOL.container.panel.show();
		}		
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
				var i,n,f,
					fromgml = new OpenLayers.Format.GML({
						geometryName: "msGeometry"
					}),
					gml = fromgml.read(retorno.responseText);
				n = gml.length;
				for(i=0;i<n;i++){
					f = gml[i];
					f["attributes"] = {
						opacidade: i3GEO.editorOL.simbologia.opacidade,
						texto: i3GEO.editorOL.simbologia.texto,
						fillColor: i3GEO.editorOL.simbologia.fillColor,
						strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
						strokeColor: i3GEO.editorOL.simbologia.strokeColor,
						pointRadius: i3GEO.editorOL.simbologia.pointRadius,
						graphicName: i3GEO.editorOL.simbologia.graphicName
					};				
				}
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
		var geos = i3GEO.editorOL.layergrafico.selectedFeatures;
		var n = geos.length;
		var ins = "";
		if(n > 0){
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
			ins += "<p class=paragrafo >Foram encontrada(s) "+n+" geometria(s) selecionada(s) </p>";
			ins += "<p class=paragrafo ><a href='#' onclick='i3GEO.editorOL.listaGeometriasSel()' >Listar</a>&nbsp;&nbsp;";
			ins += "<a href='#' onclick='"+i3GEO.editorOL.nomeFuncaoSalvar+"' >Salvar</a>&nbsp;&nbsp;";
			ins += "<a href='#' onclick='i3GEO.editorOL.exportarSHP()' >Exportar (shapefile)</a></p>";			
			YAHOO.salvaGeometrias.container.panel.setBody(ins);
		}
		else
		{alert("Selecione pelo menos um elemento");}
	},
	exportarSHP: function(){
		i3GEO.editorOL.processageo("converteSHP");
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
			displayClass: "olControlEditingToolbar1 noprint",
			saveState: true,
			activateControl: function(c){
				this.deactivate();
				this.activate();
				try{
					i3GEO.editorOL.ModifyFeature.deactivate();
				}
				catch(e){}
				if(!c.trigger)
				{c.activate();}
				else{
					c.trigger.call();
				}
			}
		});
		if(botoes.procura===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLprocura", 
				trigger: function(){YAHOO.procura.container.panel.show();},
				title: "procura"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.pan===true){
			controles.push(new OpenLayers.Control.Navigation({title: "deslocar",displayClass:"editorOLpan"}));
			adiciona = true;
		}
		if(botoes.zoombox===true){
			controles.push(new OpenLayers.Control.ZoomBox({title: "zoombox",displayClass: "editorOLzoombox"}));
			adiciona = true;
		}
		if(botoes.zoomtot===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLzoomtot", 
				trigger: function(){i3GEO.editorOL.mapa.zoomToMaxExtent();},
				title: "ajusta extens&atilde;o"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.legenda===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLlegenda", 
				trigger: function(){i3GEO.editorOL.mostraLegenda();},
				title: "legenda"
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
					displayClass: "editorOLdistancia", 
					title: "distância"
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
					displayClass: "editorOLarea", 
					title: "área"
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
				title: "identifica",
				displayClass: "editorOLidentifica",
				eventListeners: {
					getfeatureinfo: function(event) {
						var lonlat = i3GEO.editorOL.mapa.getLonLatFromPixel(event.xy),
							lonlattexto = "<hr>";
						if(	botoes.linha === true || botoes.ponto === true || botoes.poligono === true || botoes.edita === true){
							lonlattexto += "<pre><span style=color:blue;cursor:pointer onclick='i3GEO.editorOL.captura(\""+lonlat.lon+","+lonlat.lat+"\")'>captura</span></pre>";
						}
						i3GEO.editorOL.mapa.addPopup(new OpenLayers.Popup.FramedCloud(
							"chicken", 
							i3GEO.editorOL.mapa.getLonLatFromPixel(event.xy),
							null,
							lonlattexto+"<pre>"+event.text+"</pre>",
							null,
							true
						));
					},
					beforegetfeatureinfo: function(event){
						var ativo = [i3GEO.editorOL.layerAtivo()];
						event.object.layers = ativo;
						botaoIdentifica.layers = ativo;
						botaoIdentifica.url = ativo[0].url;
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
					displayClass: "editorOLlinha",
					title: "digitalizar linha",
					callbacks:{
						done: function(feature){
							var f = new OpenLayers.Feature.Vector(feature);
							f["attributes"] = {
								opacidade: i3GEO.editorOL.simbologia.opacidade,
								texto: i3GEO.editorOL.simbologia.texto,
								fillColor: i3GEO.editorOL.simbologia.fillColor,
								strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
								strokeColor: i3GEO.editorOL.simbologia.strokeColor,
								pointRadius: i3GEO.editorOL.simbologia.pointRadius,
								graphicName: i3GEO.editorOL.simbologia.graphicName
							};
							i3GEO.editorOL.layergrafico.addFeatures([f]);
						}
					}
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
					displayClass: "editorOLponto",
					title: "digitalizar ponto",
					callbacks:{
						done: function(feature){
							var f = new OpenLayers.Feature.Vector(feature);
							f["attributes"] = {
								opacidade: i3GEO.editorOL.simbologia.opacidade,
								texto: i3GEO.editorOL.simbologia.texto,
								fillColor: i3GEO.editorOL.simbologia.fillColor,
								strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
								strokeColor: i3GEO.editorOL.simbologia.strokeColor,
								pointRadius: i3GEO.editorOL.simbologia.pointRadius,
								graphicName: i3GEO.editorOL.simbologia.graphicName
							};
							i3GEO.editorOL.layergrafico.addFeatures([f]);
						}
					}					
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
					displayClass: "editorOLpoligono",
					title: "digitalizar polígono",
					//handlerOptions: {holeModifier: "altKey"},
					callbacks:{
						done: function(feature){
							var f = new OpenLayers.Feature.Vector(feature);
							f["attributes"] = {
								opacidade: i3GEO.editorOL.simbologia.opacidade,
								texto: i3GEO.editorOL.simbologia.texto,
								fillColor: i3GEO.editorOL.simbologia.fillColor,
								strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
								strokeColor: i3GEO.editorOL.simbologia.strokeColor,
								pointRadius: i3GEO.editorOL.simbologia.pointRadius,
								graphicName: i3GEO.editorOL.simbologia.graphicName
							};
							i3GEO.editorOL.layergrafico.addFeatures([f]);
						}
					}
				}
			);
			controles.push(button);
			adiciona = true;
		}
		if(botoes.texto===true){
			button = new OpenLayers.Control.DrawFeature(
				i3GEO.editorOL.layergrafico,
				OpenLayers.Handler.Point,
				{
					displayClass: "editorOLtexto",
					title: "incluir texto",
					persist: true,
					callbacks:{
						done: function(feature){
							var texto = window.prompt("Texto",""),
								label = new OpenLayers.Feature.Vector(feature);
							label["attributes"] = {
								opacidade: 0.1,
								fillColor: "white",
								strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
								texto: texto,
								pointRadius: 2,
								graphicName: "square",
								strokeColor: "black",
								fontColor: i3GEO.editorOL.simbologia.fontColor,
								fontSize: i3GEO.editorOL.simbologia.fontSize,
								fontFamily: "Arial",
								fontWeight: "bold",
								labelAlign: "rt"
							};
							if(texto && texto !== "")
							{i3GEO.editorOL.layergrafico.addFeatures([label]);}
						}
					}
				}
			);
			controles.push(button);
			adiciona = true;
		}		
		if(botoes.edita===true){
			i3GEO.editorOL.ModifyFeature = new OpenLayers.Control.ModifyFeature(
				i3GEO.editorOL.layergrafico,
				{
					displayClass: "editorOLedita",
					title: "modifica figura",
					clickout: true,
					toggle: true,
					mode: OpenLayers.Control.ModifyFeature.RESHAPE
				}
			);
			controles.push(i3GEO.editorOL.ModifyFeature);
			adiciona = true;
		}
		if(botoes.frente===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLfrente", 
				trigger: function(){i3GEO.editorOL.trazParaFrente();},
				title: "traz para frente"
			});
			controles.push(button);
			adiciona = true;
		}		
		//só funciona dentro do i3geo
		if(botoes.tools===true && i3GEO.php){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLtools", 
				trigger: function(){
					i3GEO.editorOL.ferramentas();
				},
				title: "ferramentas"
			});
			controles.push(button);
			adiciona = true;
		}		
		//botao de seleção
		if(botoes.selecao===true){
			button = new OpenLayers.Control.SelectFeature(
				i3GEO.editorOL.layergrafico,
				{
					displayClass: "editorOLselecao",
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
				displayClass: "editorOLapaga", 
				trigger: function(){
					if(i3GEO.editorOL.layergrafico.selectedFeatures.length > 0){
						var x = window.confirm("Exclui os elementos selecionados?");
						if(x){
							i3GEO.editorOL.guardaBackup();
							i3GEO.editorOL.layergrafico.removeFeatures(i3GEO.editorOL.layergrafico.selectedFeatures);
						}
					}
					else
					{alert("Selecione pelo menos um elemento");}
				},
				title: "apaga selecionados"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.undo===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLundo", 
				trigger: function(){i3GEO.editorOL.restauraBackup();},
				title: "recupera"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.propriedades===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLpropriedades", 
				trigger: function(){i3GEO.editorOL.propriedades();},
				title: "propriedades"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.salva===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLsalva", 
				trigger: function(){i3GEO.editorOL.salvaGeometrias();},
				title: "salva"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.ajuda===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLajuda", 
				trigger: function(){
					try
					{window.open(i3GEO.configura.locaplic+"/mashups/openlayers_ajuda.php");}
					catch(e)
					{window.open("openlayers_ajuda.php");}
				},
				title: "ajuda"
			});
			controles.push(button);
			adiciona = true;
		}
		if(botoes.fecha===true){
			button = new OpenLayers.Control.Button({
				displayClass: "editorOLfecha", 
				trigger: function(){
					if(window.confirm("A edição será perdida. Continua?")){
						i3GEOpanelEditor.destroy();
						if(YAHOO.temaativo && YAHOO.temaativo.container.panel)
						{YAHOO.temaativo.container.panel.destroy();}
						try{
							if(i3GEO.editorOL.layergrafico)
							{i3GEO.editorOL.mapa.removeLayer(i3GEO.editorOL.layergrafico);}
							if(i3GEO.editorOL.backup)
							{i3GEO.editorOL.mapa.removeLayer(i3GEO.editorOL.backup);}
						}
						catch(e){}
					}
				},
				title: "fecha editor"
			});
			controles.push(button);
			adiciona = true;
		}
		//
		//controle que permite o snap
		//
        i3GEOOLsnap = new OpenLayers.Control.Snapping({
			layer: i3GEO.editorOL.layergrafico
		});
		i3GEOOLsplit = new OpenLayers.Control.Split({
			layer: i3GEO.editorOL.layergrafico,
			source: i3GEO.editorOL.layergrafico,
			tolerance: 0.0001,
			eventListeners: {
				beforesplit: function(event){i3GEO.editorOL.guardaBackup();},
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
	mudaSimbolo: function(estilo,id){
		var valor = $i(id).value;
		if(valor === "")
		{return;}
		if(estilo === "strokeWidth")
		{i3GEO.editorOL.simbologia.strokeWidth = valor;return;}
		if(estilo === "opacidade")
		{i3GEO.editorOL.simbologia.opacidade = valor;return;}
		i3GEO.editorOL.simbologia[estilo] = valor;
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
	adicionaKml: function(){
		var temp,n,i,id,url;
		n = i3GEO.editorOL.kml.length;
		for(i=0;i<n;i++){
			id = "kml"+i;
			url = i3GEO.editorOL.kml[i];
			eval(id+" = new OpenLayers.Layer.Vector('"+id+"', {displayOutsideMaxExtent:true,displayInLayerSwitcher:false,visibility:true, strategies: [new OpenLayers.Strategy.Fixed()],protocol: new OpenLayers.Protocol.HTTP({url: '"+url+"',format: new OpenLayers.Format.KML({extractStyles: true,extractAttributes: true,maxDepth: 5})})})");
			eval("i3GEO.editorOL.mapa.addLayer("+id+");");
			eval("temp = "+id+".div;");
			temp.onclick = function(e){
				var targ,id,temp,features,n,i,j,g,html="";
				if (!e){e = window.event;}
				if (e.target)
				{targ = e.target;}
				else
				if (e.srcElement)
				{targ = e.srcElement;}
				
				temp = targ.id.split("_");
				if(temp[0] === "OpenLayers.Geometry.Point"){
					id = targ.id;
					temp = i3GEO.editorOL.mapa.getLayer(this.id);
					features = temp.features;
					n = features.length;
					for(i=0;i<n;i++){
						if(features[i].geometry.id === id){
							for (j in features[i].attributes) {
								html += j+": "+features[i].attributes[j];
							}
							g = features[i].geometry;
							i3GEO.editorOL.mapa.addPopup(new OpenLayers.Popup.FramedCloud(
								"kml", 
								new OpenLayers.LonLat(g.x,g.y),
								null,
								html,
								null,
								true
							));

						}
					}
				}
			};
		}
	},
	//obtido de openlayers.org
	propriedades: function(){
		if(!document.getElementById("panelpropriedadesEditor")){
			YAHOO.namespace("editorOL.container");
			YAHOO.editorOL.container.panel = new YAHOO.widget.Panel("panelpropriedadesEditor", {zIndex:20000, iframe:true, width:"350px", height:"250px",visible:false, draggable:true, close:true } );
			var ins = "" +
			'<p class=paragrafo ><b>Estilos (utilize a cor no formato r,g,b):</b></p>' +
			'<table class=lista7 >' +
			'	<tr>' +
			'		<td>Cor do contorno</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'strokeColor\',\'i3GEOEditorOLcorContorno\')" type="text" style="cursor:text" id="i3GEOEditorOLcorContorno" size="12" value="'+i3GEO.editorOL.simbologia.strokeColor+'" /></td><td>';
			if(i3GEO.configura)
			{ins += '<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEO.util.abreCor(\'\',\'i3GEOEditorOLcorContorno\');" />';}
			ins += "" +
			'		</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td>Cor do preenchimento</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'fillColor\',\'i3GEOEditorOLcorPre\')" type="text" style="cursor:text" id="i3GEOEditorOLcorPre" size="12" value="'+i3GEO.editorOL.simbologia.fillColor+'" /></td><td>';
			if(i3GEO.configura)
			{ins += '<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEO.util.abreCor(\'\',\'i3GEOEditorOLcorPre\');" />';}
			ins += "" +
			'		</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td>Cor da fonte</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'fontColor\',\'i3GEOEditorOLcorFonte\')" type="text" style="cursor:text" id="i3GEOEditorOLcorFonte" size="12" value="'+i3GEO.editorOL.simbologia.fontColor+'" /></td><td>';
			if(i3GEO.configura)
			{ins += '<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEO.util.abreCor(\'\',\'i3GEOEditorOLcorFonte\');" />';}
			ins += "" +
			'		</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td>Tamanho da fonte</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'fontSize\',\'i3GEOEditorOLfontsize\')" type="text" style="cursor:text" id="i3GEOEditorOLfontsize" size="3" value="'+i3GEO.editorOL.simbologia.fontSize+'" /></td><td></td>' +
			'	</tr>' +			
			'	<tr>' +
			'		<td>Opacidade (de 0 a 1)</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'opacidade\',\'i3GEOEditorOLopacidade\')" type="text" style="cursor:text" id="i3GEOEditorOLopacidade" size="3" value="'+i3GEO.editorOL.simbologia.opacidade+'" /></td><td></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td>Largura da linha/contorno</td><td><input onchange="i3GEO.editorOL.mudaSimbolo(\'strokeWidth\',\'i3GEOEditorOLlarguraLinha\')" type="text" style="cursor:text" id="i3GEOEditorOLlarguraLinha" size="2" value="'+i3GEO.editorOL.simbologia.strokeWidth+'" /></td><td></td>' +
			'	</tr>' +
			'</table>' +
			'<br />' +
			'<p class=paragrafo ><b>Ajusta nó em edição para o(a):</b></p>' +
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
			'<p class=paragrafo ><b>Divide intersecção ao digitalizar</b></p>' +
			'<table class=lista7 >' +
			'	<tr>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.split()" type="checkbox" id="edge_split_toggle" /></td><td>borda</td>' +
			'	</tr>' +
			'</table>' +
			'<br />' +
			'<p class=paragrafo ><b>Operação ativada pelo botão de modificação da figura</b></p>' +
			'<table class=lista7 >' +
			'	<tr>' +
			'		<td><input checked style=cursor:pointer onclick="i3GEO.editorOL.ModifyFeature.mode = OpenLayers.Control.ModifyFeature.RESHAPE;" type="radio" name=i3geoOLtipoEdita /></td><td>altera figura</td>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.ModifyFeature.mode = OpenLayers.Control.ModifyFeature.RESIZE;" type="radio" name=i3geoOLtipoEdita /></td><td>altera tamanho</td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.ModifyFeature.mode = OpenLayers.Control.ModifyFeature.ROTATE;" type="radio" name=i3geoOLtipoEdita /></td><td>rotaciona</td>' +
			'		<td><input style=cursor:pointer onclick="i3GEO.editorOL.ModifyFeature.mode = OpenLayers.Control.ModifyFeature.DRAG;" type="radio" name=i3geoOLtipoEdita /></td><td>desloca</td>' +
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
			YAHOO.util.Event.addListener(YAHOO.editorOL.container.panel.close, "click", function(){});		
			temp = $i("panelpropriedadesEditor_minimizaCabecalho");
			if(temp){
				temp.onclick = function(){i3GEO.janela.minimiza("panelpropriedadesEditor");}
			}
		}
		YAHOO.editorOL.container.panel.show();
		if(i3GEO.configura)
		{$i("panelpropriedadesEditor").getElementsByTagName("div")[2].style.overflow = "auto";}
		else
		{$i("panelpropriedadesEditor").getElementsByTagName("div")[1].style.overflow = "auto";}
	},
	ferramentas: function(){
		if(!document.getElementById("panelferramentasEditor")){
			YAHOO.namespace("editorOL.ferramentas");
			YAHOO.editorOL.ferramentas.panel = new YAHOO.widget.Panel("panelferramentasEditor", {zIndex:20000, iframe:true, width:"300px", visible:false, draggable:true, close:true } );
			var ins = "" +
			'<p class=paragrafo >Operações sobre as figuras selecionadas:</p>' +
			'<select onchange="i3GEO.editorOL.processageo(this.value);this.value = \'\'" >' +
			'	<option value="">---</option>' +
			'	<option value=union >União</option>' +
			'	<option value=intersection >Intersecção</option>' +	
			'	<option value=convexhull >Convex hull</option>' +				
			'	<option value=boundary >Bordas</option>' +				
			'	<option value=difference >Diferença</option>' +				
			'	<option value=symdifference >Diferença simétrica</option>' +								
			'</select>'+
			'<br><br><a class=paragrafo href=# onclick="i3GEO.editorOL.layergrafico.destroyFeatures()" >Apaga tudo</a>';
			'<br><br><a class=paragrafo href=# onclick="i3GEO.editorOL.layergrafico.removeFeatures(i3GEO.editorOL.layergrafico.features)" >Seleciona tudo</a>';

			YAHOO.editorOL.ferramentas.panel.setBody(ins);
			if(typeof i3GEO != undefined && i3GEO != "")
			{YAHOO.editorOL.ferramentas.panel.setHeader("Ferramentas <div id='panelferramentasEditor_minimizaCabecalho' class='container-minimiza'></div>");}
			else
			{YAHOO.editorOL.ferramentas.panel.setHeader("Ferramentas");}

			YAHOO.editorOL.ferramentas.panel.setFooter("");
			YAHOO.editorOL.ferramentas.panel.render(document.body);
			YAHOO.editorOL.ferramentas.panel.center();
			YAHOO.util.Event.addListener(YAHOO.editorOL.ferramentas.panel.close, "click", function(){
			});
			temp = $i("panelferramentasEditor_minimizaCabecalho");
			if(temp){
				temp.onclick = function(){i3GEO.janela.minimiza("panelferramentasEditor");}
			}

		}
		else{	
			YAHOO.editorOL.ferramentas.panel.render(document.body);
		}
		YAHOO.editorOL.ferramentas.panel.show();
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
	processageo: function(operacao){
		if(operacao === ""){return;}
		var geosel = i3GEO.editorOL.layergrafico.selectedFeatures,
			fwkt = new OpenLayers.Format.WKT(),
			polis,linhas,pontos,uniaopolis,uniaolinhas,uniaopontos,n,i,temp;
		if(geosel.length > 0){
			polis = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.Polygon");
			linhas = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.LineString");
			pontos = i3GEO.editorOL.retornaGeometriasTipo(geosel,"OpenLayers.Geometry.Point");
			temp = function(retorno){
				i3GEO.janela.fechaAguarde("i3GEO.editorPoli");
				i3GEO.janela.fechaAguarde("i3GEO.editorLinhas");
				i3GEO.janela.fechaAguarde("i3GEO.editorPontos");
				if(retorno != "" && retorno.data && retorno.data != "" && operacao != "converteSHP")
				{i3GEO.editorOL.substituiFeaturesSel(retorno.data);}
				if(operacao === "converteSHP"){
					i3GEO.atualiza();
					i3GEO.janela.minimiza("paneltemaativo");
				}
			}
			if(polis.length > 0){
				i3GEO.janela.abreAguarde("i3GEO.editorPoli","Poligonos");
				i3GEO.php.funcoesGeometriasWkt(temp,polis.join("|"),operacao);				
			}
			if(linhas.length > 0){
				i3GEO.janela.abreAguarde("i3GEO.editorLinhas","Linhas");
				i3GEO.php.funcoesGeometriasWkt(temp,linhas.join("|"),operacao);				
			}
			if(pontos.length > 0){
				i3GEO.janela.abreAguarde("i3GEO.editorPontos","Pontos");
				i3GEO.php.funcoesGeometriasWkt(temp,pontos.join("|"),operacao);				
			}
			return;
		}
		else
		{alert("Selecione pelo menos dois elementos");}	
	},
	uniaojts: function(geoms){
		var n = geoms.length,
				rwkt = new jsts.io.WKTReader(),
				wwkt = new jsts.io.WKTWriter(),
				fwkt = new OpenLayers.Format.WKT(),
				g,
				i,uniao;
		if(n > 1){
			uniao = (fwkt.read(geoms[0]).geometry).toString();
			uniao = rwkt.read(uniao);
			for(i=1;i <= n;i++){
				g = (fwkt.read(geoms[i]).geometry).toString();				
				uniao = uniao.union(rwkt.read(g));
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
	guardaBackup: function(){
		i3GEO.editorOL.backup = new OpenLayers.Layer.Vector("Backup",{displayInLayerSwitcher:false,visibility:false})
		//i3GEO.editorOL.backup.removeFeatures(i3GEO.editorOL.backup.features);
		i3GEO.editorOL.backup.addFeatures(i3GEO.editorOL.layergrafico.features);
		i3GEO.editorOL.unselTodos();
	},
	unselTodos:function(){
		var n,i,temp;
		n = i3GEO.editorOL.backup.features.length;
		for(i=0;i<n;i++){
			i3GEO.editorOL.backup.features[i].renderIntent = "default";
		}	
	},
	restauraBackup: function(){
		if(i3GEO.editorOL.backup.features.length > 0){
			i3GEO.editorOL.layergrafico.removeFeatures(i3GEO.editorOL.layergrafico.features);
			i3GEO.editorOL.layergrafico.addFeatures(i3GEO.editorOL.backup.features);
		}
		//i3GEO.editorOL.backup.removeFeatures(i3GEO.editorOL.backup.features);
	},	
	substituiFeaturesSel: function(wkt){
		i3GEO.editorOL.guardaBackup();
		try{
			var f,fwkt = new OpenLayers.Format.WKT();
			i3GEO.editorOL.layergrafico.removeFeatures(i3GEO.editorOL.layergrafico.selectedFeatures);
			f = fwkt.read(wkt);
			f["attributes"] = {
				opacidade: i3GEO.editorOL.simbologia.opacidade,
				texto: i3GEO.editorOL.simbologia.texto,
				fillColor: i3GEO.editorOL.simbologia.fillColor,
				strokeWidth: i3GEO.editorOL.simbologia.strokeWidth,
				strokeColor: i3GEO.editorOL.simbologia.strokeColor,
				pointRadius: i3GEO.editorOL.simbologia.pointRadius,
				graphicName: i3GEO.editorOL.simbologia.graphicName
			};			
			i3GEO.editorOL.layergrafico.addFeatures([f]);
		}
		catch(e)
		{i3GEO.editorOL.restauraBackup();}
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
	},
	trazParaFrente: function(){
		var features = i3GEO.editorOL.layergrafico.selectedFeatures;
		if(features.length > 0){
			i3GEO.editorOL.backup = new OpenLayers.Layer.Vector("Backup",{displayInLayerSwitcher:false,visibility:false})
			i3GEO.editorOL.backup.addFeatures(features);
			i3GEO.editorOL.unselTodos();
			i3GEO.editorOL.layergrafico.removeFeatures(features);
			i3GEO.editorOL.layergrafico.addFeatures(i3GEO.editorOL.backup.features);
		}
		else
		{alert("Selecione pelo menos um elemento");}	
	}
};