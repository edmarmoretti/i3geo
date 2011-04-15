$i = function(id){return document.getElementById(id);};
navn = false;
//seta as variáveis navn e navm
var navn = false;
var navm = false;
var app = navigator.appName.substring(0,1);
if (app==='N'){navn=true;}else{navm=true;}

OpenLayers.ImgPath = "../pacotes/openlayers/img/"
OpenLayers.Lang.setCode("pt-BR");
i3GEOOL = {
	nomeFuncaoSalvar: "i3GEOOL.testeSalvar()", 
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
	layergrafico: new OpenLayers.Layer.Vector("Edição",{displayInLayerSwitcher:true,visibility:true}),
	layersIniciais: [<?php
						if(isset($objOpenLayers) && $objOpenLayers != "")
						{echo implode(",",$objOpenLayers);}
						else
						{echo "''";}
					?>],
	botoes: <?php echo $botoes; ?>,
	pontos: [<?php
				if(isset($pontos)){
					$pontos = str_replace(" ",",",$pontos);
					echo $pontos;
				}
			?>],
	marca: "<?php
				if(isset($marca)){echo $marca;}
				else
				{echo "../pacotes/openlayers/img/marker-gold.png";}
			?>",
	mapa: new OpenLayers.Map('i3geoMapa', {
		controls: [
			<?php echo implode(",",$objControles); ?>
		],
		numZoomLevels: <?php echo $numzoomlevels;?>,
		maxExtent: new OpenLayers.Bounds(<?php echo $maxextent;?>)
	}),
	inicia: function(){
		var alayers = [];
		<?php
		foreach($fundo as $f){
			echo "try{";
			echo "i3GEOOL.".$f.".transitionEffect = 'resize';";
			echo "i3GEOOL.".$f.".setVisibility(false);";
			echo "alayers.push(i3GEOOL.".$f.");";
			echo "}catch(e){}";
		}
		echo "try{alayers[0].setVisibility(true);}catch(e){}";
		?>
		i3GEOOL.mapa.addLayers(alayers);
		
		if(i3GEOOL.layersIniciais != ""){
			var n = i3GEOOL.layersIniciais.length;
			for(i=0;i<n;i++)
			{i3GEOOL.mapa.addLayer(i3GEOOL.layersIniciais[i]);}
		}
		if(i3GEOOL.layergrafico != ""){
			i3GEOOL.mapa.addLayers([i3GEOOL.layergrafico]);
		}
		i3GEOOL.adicionaMarcas();
		i3GEOOL.mapa.zoomToMaxExtent();
		i3GEOOL.coordenadas();	
		i3GEOOL.criaJanelaBusca();
		i3GEOOL.criaJanelaAtivaTema();
		i3GEOOL.criaBotoes(i3GEOOL.botoes);
		
	},
	layersLigados: function(){
		var layers = i3GEOOL.mapa.layers;
		var nlayers = layers.length;
		var ins = new Array();
		for(i=0;i<nlayers;i++){
			if(layers[i].isBaseLayer == false){
				ins.push(layers[i]);
			}
		}
		return ins;
	},
	coordenadas: function(){
		//
		//substitui o controle que mostra as coordenadas
		//
		var idcoord = i3GEOOL.mapa.getControlsBy("separator"," ");
		if(idcoord[0]){
			i3GEOOL.mapa.events.register("mousemove", i3GEOOL.mapa, function(e){
				var p,lonlat,d,dc;
				if (navm)
				{p = new OpenLayers.Pixel(e.x,e.y);}
				else
				{p = e.xy;}
				//altera o indicador de localizacao
				lonlat = i3GEOOL.mapa.getLonLatFromPixel(p);
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
		var layers = i3GEOOL.layersLigados();
		var nlayers = layers.length;
		var combo = "<select id=i3GEOOLlistaTemasBusca ><option value=''>----</option>";
		for(i=0;i<nlayers;i++){
			combo += "<option value='"+i+"' >"+layers[i].name+"</option>";
		}
		combo += "</select>";
		var ins = "<div class=paragrafo >Tema:<br>"+combo;
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
				var layer = i3GEOOL.layerAtivo();
				var item = document.getElementById("i3GEOOLbuscaItem").value;
				var palavra = document.getElementById("i3GEOOLpalavraBusca").value;
				if(item == "" || palavra == "")
				{alert("Escolha o item e o texto de busca");return;}
				i3GEOOL.busca(layer,item,palavra,"i3GEOOLcomboresultado");
			};
			document.getElementById("i3GEOOLlistaTemasBusca").onchange = function(){
				i3GEOOL.ativaTema(this.value);
				document.getElementById("i3GEOOLcomboitens").innerHTML = "...";
				i3GEOOL.listaItens(i3GEOOL.layerAtivo(),"i3GEOOLcomboitens","i3GEOOLbuscaItem");
			};
		}
		catch(e){}
	},
	criaJanelaAtivaTema: function(){
		var layers = i3GEOOL.layersLigados();
		var nlayers = layers.length;
		var combo = "<select id=i3GEOOLlistaTemasAtivos >";
		for(i=0;i<nlayers;i++){
			combo += "<option value='"+i+"' >"+layers[i].name+"</option>";
		}
		combo += "</select>";
		try{
			YAHOO.namespace("temaativo.container");
			YAHOO.temaativo.container.panel = new YAHOO.widget.Panel("paneltemaativo", {zIndex:2000, iframe:false, width:"250px", visible:false, draggable:true, close:true } );
			YAHOO.temaativo.container.panel.setHeader("Tema ativo");
			YAHOO.temaativo.container.panel.setBody(combo);
			YAHOO.temaativo.container.panel.setFooter("");
			YAHOO.temaativo.container.panel.render(document.body);
			YAHOO.temaativo.container.panel.center();
			document.getElementById("i3GEOOLlistaTemasAtivos").onchange = function(){
				if(botaoIdentifica){
					botaoIdentifica.layers = [i3GEOOL.layersLigados()[this.value]];
				} 
			};
		}
		catch(e){}
	},
	ativaTema: function(id){
		document.getElementById("i3GEOOLlistaTemasAtivos").value = id;
	},
	layerAtivo: function(){
		var id = document.getElementById("i3GEOOLlistaTemasAtivos").value;
		return i3GEOOL.layersLigados()[id];
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
				});
				var gml = fromgml.read(retorno.responseText);
				var prop = gml.featureTypes[0].properties;
				var nprop = prop.length;
				var itens = new Array();
				var combo = "<select id="+idobj+" ><option value=''>----</option>";
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
		})			
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
				});
				var gml = fromgml.read(retorno.responseText);
				var ngml = gml.length;
				var ins = "<select onchange='i3GEOOL.zoomPara(this.value)'>";
				ins += "<option value=''>---</option>";
				for(i=0;i<ngml;i++){
					eval("var valor = gml[i].data."+item);
					var bounds = gml[i].geometry.getBounds();
					var bounds = bounds.toBBOX();
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
		})
	},
	zoomPara: function(bbox){
		var b = new OpenLayers.Bounds.fromString(bbox);
		i3GEOOL.mapa.zoomToExtent(b);
	},
	mostraLegenda: function(){
		var layers = i3GEOOL.layersLigados();
		var nlayers = layers.length;
		var ins = "";
		for(i=0;i<nlayers;i++){
			try{
				var url = layers[i].getFullRequestString({"request":"getlegendgraphic"});
				url = url.replace("LAYERS","LAYER");
				ins += "<img src='"+url+"' /><br>";
			}
			catch(e){}
			}
		var w = window.open()
		w.document.write(ins)
		w.document.close();
	},
	captura: function(lonlat){
		var layers = [i3GEOOL.layerAtivo()];
	    var u = layers[0].url+"&request=getfeature&service=wfs&version=1.0.0";
	    u += "&OUTPUTFORMAT=gml2&typename="+layers[0].params.LAYERS;
	    //u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Point><gml:coordinates>"+lonlat+"</gml:coordinates></gml:Point></Intersect></Filter>";
		var xy = lonlat.split(",");
		xy[0] = xy[0] * 1;
		xy[1] = xy[1] * 1;
		var poligono = (xy[0]-0.1)+","+(xy[1]+0.1) + " "+(xy[0]+0.1)+","+(xy[1]+0.1)+" " + (xy[0]+0.1)+","+(xy[1]-0.1)+" " + (xy[0]-0.1)+","+(xy[1]-0.1)+" "+(xy[0]-0.1)+","+(xy[1]+0.1);
		u += "&filter=<Filter><Intersect><PropertyName>Geometry</PropertyName><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:posList>"+poligono+"</gml:posList></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></Intersect></Filter>";
		
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
				i3GEOOL.layergrafico.addFeatures(gml);
			},
			failure: function(){
				document.body.style.cursor="default";
				document.getElementById("i3geoMapa").style.cursor = "default";
				alert("Erro");
			}
		})
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
		var geos = i3GEOOL.layergrafico.selectedFeatures;
		var n = geos.length;
		var ins = "";
		if(n > 0){
			ins += "<p class=paragrafo >Foram encontrada(s) "+n+" geometria(s) selecionada(s) </p>";
			ins += "<p class=paragrafo ><a href='#' onclick='i3GEOOL.listaGeometriasSel()' > Listar geometrias</a> ";
			ins += "<a href='#' onclick='"+i3GEOOL.nomeFuncaoSalvar+"' >Salvar geometria(s)</a></p>";
			YAHOO.salvaGeometrias.container.panel.setBody(ins);
		}
		else
		{alert("Selecione pelo menos um elemento");}
	},
	listaGeometriasSel: function(){
		var geos = i3GEOOL.layergrafico.selectedFeatures;
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
		alert("Funcao nao disponivel. Defina o nome da funcao em i3GEOOL.nomeFuncaoSalvar ");
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
		};
		var style = new OpenLayers.Style();
		style.addRules([
		    new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);
		var styleMap = new OpenLayers.StyleMap({"default": style});
		var adiciona = false;
		var controles = new Array();
		var panel = new OpenLayers.Control.Panel({
			displayClass: "olControlEditingToolbar1 noprint"
		});
		if(botoes.procura==true){
			var button = new OpenLayers.Control.Button({
				displayClass: "procura", 
				trigger: function(){YAHOO.procura.container.panel.show();},
				title: "Procurar"
			});
	    	controles.push(button);
	    	var adiciona = true;
		}
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
				trigger: function(){i3GEOOL.mapa.zoomToMaxExtent();},
				title: "Ajusta extens&atilde;o"
			});
			controles.push(button);
			var adiciona = true;
		}
		if(botoes.legenda==true){
			var button = new OpenLayers.Control.Button({
				displayClass: "legenda", 
				trigger: function(){i3GEOOL.mostraLegenda();},
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
				}
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
				}
			});
			controles.push(button);
			var adiciona = true;
		}
		if(botoes.identifica==true){
	    	botaoIdentifica = new OpenLayers.Control.WMSGetFeatureInfo({
	           	maxFeatures:1,
	           	infoFormat:'text/plain', //'application/vnd.ogc.gml',
	           	layers: [i3GEOOL.layerAtivo()],
	           	queryVisible: true,
	           	title: "Identificar",
	           	displayClass: "identifica",
	            eventListeners: {
	                getfeatureinfo: function(event) {
						var lonlat = i3GEOOL.mapa.getLonLatFromPixel(event.xy);
	                    var lonlattexto = "<hr><pre><span style=color:blue;cursor:pointer onclick='i3GEOOL.captura(\""+lonlat.lon+","+lonlat.lat+"\")'>captura</span></pre>";
	                    i3GEOOL.mapa.addPopup(new OpenLayers.Popup.FramedCloud(
	                        "chicken", 
	                        i3GEOOL.mapa.getLonLatFromPixel(event.xy),
	                        null,
	                        lonlattexto+"<pre>"+event.text+"</pre>",
	                        null,
	                        true
	                    ));
	                },
					activate: function(){
						YAHOO.temaativo.container.panel.show();
					}
	            }
	       	});
			//button.events.register("getfeatureinfo", this, showInfo);
			controles.push(botaoIdentifica);
			var adiciona = true;
		}
		if(botoes.linha==true){
			button = new OpenLayers.Control.DrawFeature(
				i3GEOOL.layergrafico,
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
				i3GEOOL.layergrafico,
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
				i3GEOOL.layergrafico,
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
				i3GEOOL.layergrafico,
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
				i3GEOOL.layergrafico,
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
					if(i3GEOOL.layergrafico.selectedFeatures.length > 0){
						var x = window.confirm("Exclui os elementos selecionados?");
						if(x)
						{i3GEOOL.layergrafico.removeFeatures(i3GEOOL.layergrafico.selectedFeatures);}
					}
					else
					{alert("Selecione pelo menos um elemento");}
				},
				title: "Apaga selecionados"
			});
			controles.push(button);
			var adiciona = true;
		}
		if(botoes.salva==true){
			var button = new OpenLayers.Control.Button({
				displayClass: "salva", 
				trigger: function(){i3GEOOL.salvaGeometrias();},
				title: "Salvar"
			});
			controles.push(button);
			var adiciona = true;
		}
		//
		//adiciona o painel ao mapa se alguma opï¿½ï¿½o foi inserida
		//
		if(adiciona == true){
			panel.addControls(controles);
			i3GEOOL.mapa.addControl(panel);
		}
	},
	adicionaMarcas: function(){
		if(i3GEOOL.pontos.length == 0)
		{return;}
		var SHADOW_Z_INDEX = 10,
			MARKER_Z_INDEX = 11,      
			DIAMETER = 200,
            layer = new OpenLayers.Layer.Vector(
                "pontos",
                {
                    styleMap: new OpenLayers.StyleMap({
                        externalGraphic: i3GEOOL.marca,
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
		for (index = 0; index < i3GEOOL.pontos.length; index = index + 2){
			x.push(i3GEOOL.pontos[index]);
			y.push(i3GEOOL.pontos[index+1]);
		};
		for (index = 0; index < x.length; index++) {
			features.push(
				new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(x[index], y[index])
				)
			);
		}
		layer.addFeatures(features);
		i3GEOOL.mapa.addLayer(layer);
	}
};
