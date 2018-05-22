
if (!i3GEO || typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
    i3GEO.Interface = {};
    navn = false;
    navm = false;
    $i = function(id) {
	return document.getElementById(id);
    };
    app = navigator.appName.substring(0, 1);
    if (app === 'N') {
	navn = true;
    } else {
	navm = true;
    }
}
i3GEO.editorOL = {
	interacoes: "",
	MUSTACHESALVAGEOMETRIAS: "",
	MUSTACHEFERRAMENTAS: "",
	MUSTACHEPROPRIEDADES: "",
	layerDefault: "",
	simbologia : {
	    opacidade : 0.8,
	    texto : "",
	    fillColor : "250,180,15",
	    strokeWidth : 5,
	    strokeColor : "250,150,0",
	    pointRadius : 6,
	    graphicName : "square",
	    fontSize : "12px",
	    fontColor : "0,0,0",
	    externalGraphic : "",
	    graphicHeight : 25,
	    graphicWidth : 25
	},
	backup : new ol.layer.Vector({
	    source : new ol.source.Vector({
		features : new ol.Collection(),
		useSpatialIndex : false,
		name : "Backup"
	    }),
	    //map : i3geoOL,
	    visible : false
	}),
	fundo: "",
	nomeFuncaoSalvar : "i3GEO.editorOL.salvaGeo()",
	kml : [],
	layersIniciais : [],
	//essa configuracao dos botoes afeta apenas o mashup
	//para a configuração do editor dentro de um mapa normal, veja i3GEO.editor.ativaPainel()
	botoes : {},
	pontos : [],
	marca : "../pacotes/openlayers/img/marker-gold.png",
	controles : [],
	tiles : true,
	incluilayergrafico : true,
	ativalayerswitcher : false,
	ativarodadomouse : true,
	legendahtml : false,
	numzoom : 12,
	minresolution : 0.703125,
	maxext : "",
	mapext : [-76.5125927, -39.3925675209, -29.5851853, 9.49014852081],
	mapa : "",
	//ids das features graficas selecionadas
	idsSelecionados : [],
	//backup das features
	featuresBackup : [],
	resolutions : [],
	matrixIds : [],
	//utilizado pelo mashup
	inicia : function() {
	    var projectionExtent, size,resolutions,matrixIds,z;
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		projectionExtent = ol.proj.get('EPSG:3857').getExtent();
	    } else {
		projectionExtent = ol.proj.get('EPSG:4326').getExtent();
	    }
	    size = ol.extent.getWidth(projectionExtent) / 256;
	    resolutions = new Array(40);
	    matrixIds = new Array(40);
	    for (z = 0; z < 40; ++z) {
		resolutions[z] = size / Math.pow(2, z);
		matrixIds[z] = z;
	    }
	    i3GEO.editorOL.resolutions = resolutions;
	    i3GEO.editorOL.matrixIds = matrixIds;

	    i3GEO.editorOL.incluilayergrafico = true;

	    i3GEO.Interface.openlayers.parametrosView = {
		    projection : "EPSG:4326",
		    resolutions: resolutions,
		    minResolution: i3GEO.editorOL.minresolution,
		    maxResolution: resolutions[i3GEO.editorOL.numzoom]
	    };
	    i3GEO.Interface.openlayers.parametrosMap = {
		    target : "i3geoMapa",
		    layers : [],
		    controls : []
	    };

	    i3GEO.Interface.openlayers.cria();
	    i3GEO.editorOL.mapa = i3geoOL;
	},
	// layers clonados sao copias WMS de layers TMS necessarios para realizar o getfeature
	// sao criados quando o layer e adicionado
	layersClonados : function(paramsLayers) {
	    var layers = i3GEO.editorOL.mapa.layers, nlayers = layers.length, i;
	    for (i = 0; i < nlayers; i++) {
		if (layers[i].params && layers[i].params.CLONETMS === paramsLayers) {
		    return (layers[i]);
		}
	    }
	    return false;
	},
	layertms2wms : function(tms) {
	    var layer, url;
	    url = tms.url.replace("&cache=sim", "&DESLIGACACHE=sim");
	    url = url.replace("&Z=${z}&X=${x}&Y=${y}", "");
	    url = url.replace("Z=${z}&X=${x}&Y=${y}", "");
	    layer = new OpenLayers.Layer.WMS(tms.layername + "_clone", url, {
		layers : tms.name,
		transparent : true
	    }, {
		gutter : 0,
		isBaseLayer : false,
		displayInLayerSwitcher : false,
		opacity : 1,
		visibility : true,
		singleTile : true
	    });
	    // i3GEO.editorOL.mapa.addLayer(layer);
	    return layer;
	},
	// remove o layer clonado com layertms2wms
	removeClone : function() {
	    var nome = i3GEO.editorOL.layerAtivo().layername + "_clone", busca = i3GEO.editorOL.mapa.getLayersByName(nome);
	    if (busca.length > 0) {
		i3GEO.editorOL.mapa.removeLayer(i3GEO.editorOL.mapa.getLayersByName(camada.name)[0], false);
	    }
	},
	listaItens : function(layer, idonde, idobj) {
	    if (!layer) {
		return;
	    }
	    if (!layer.params) {
		return;
	    }
	    var u = layer.url + "&request=describefeaturetype&service=wfs&version=1.0.0";
	    u += "&typename=" + layer.params.LAYERS;
	    document.body.style.cursor = "wait";
	    document.getElementById("i3geoMapa").style.cursor = "wait";
	    OpenLayers.Request.issue({
		method : "GET",
		url : u,
		callback : function(retorno) {
		    document.body.style.cursor = "default";
		    document.getElementById("i3geoMapa").style.cursor = "default";
		    var fromgml = new OpenLayers.Format.WFSDescribeFeatureType({
			geometryName : "msGeometry"
		    }), gml = fromgml.read(retorno.responseText), prop = gml.featureTypes[0].properties, nprop = prop.length, i, combo =
			"<select id=" + idobj + " ><option value=''>----</option>";
		    for (i = 0; i < nprop; i++) {
			combo += "<option value=" + prop[i].name + " >" + prop[i].name + "</option>";
		    }
		    combo += "</select>";
		    document.getElementById(idonde).innerHTML = combo;
		},
		failure : function() {
		    document.body.style.cursor = "default";
		    document.getElementById("i3geoMapa").style.cursor = "default";
		    alert("Erro");
		}
	    });
	},
	salvaGeometrias : function() {
	    if(i3GEO.editorOL.MUSTACHESALVAGEOMETRIAS == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/editorol/templateSalvaGeometrias_mst.html", function(template) {
		    i3GEO.editorOL.MUSTACHESALVAGEOMETRIAS = template;
		    i3GEO.editorOL.salvaGeometrias();
		});
		return;
	    }
	    var n = i3GEO.editorOL.idsSelecionados.length,
	    ins = "";
	    if (n > 0) {
		if ($i("panelsalvageometrias")) {
		    if (YAHOO.i3GEO) {
			YAHOO.salvaGeometrias.container.panel = YAHOO.i3GEO.janela.manager.find("panelsalvageometrias");
		    }
		    YAHOO.salvaGeometrias.container.panel.show();
		    YAHOO.salvaGeometrias.container.panel.bringToTop();
		} else {
		    try {
			YAHOO.namespace("salvaGeometrias.container");
			YAHOO.salvaGeometrias.container.panel = new YAHOO.widget.Panel("panelsalvageometrias", {
			    zIndex : 2000,
			    iframe : false,
			    width : "350px",
			    visible : false,
			    draggable : true,
			    close : true,
			    strings: {close: "<span class='material-icons'>cancel</span>"}
			});
			YAHOO.salvaGeometrias.container.panel.setHeader("<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u6") + "</span>");
			YAHOO.salvaGeometrias.container.panel.setBody("");
			YAHOO.salvaGeometrias.container.panel.setFooter("");
			YAHOO.salvaGeometrias.container.panel.render(document.body);
			YAHOO.salvaGeometrias.container.panel.center();
			if (YAHOO.i3GEO && YAHOO.i3GEO.janela) {
			    YAHOO.i3GEO.janela.manager.register(YAHOO.salvaGeometrias.container.panel);
			}
			YAHOO.salvaGeometrias.container.panel.show();
		    } catch (e) {
		    }
		}
		var hash = {
			"n" : n,
			"geosel" : $trad("geosel"),
			"listar" : $trad("listar"),
			"nomeFuncaoSalvarHidden" : "hidden",
			"incorpoHidden": "hidden"
		};
		if (i3GEO.editorOL.nomeFuncaoSalvar && i3GEO.editorOL.nomeFuncaoSalvar != "") {
		    hash.nomeFuncaoSalvar = i3GEO.editorOL.nomeFuncaoSalvar;
		    hash.sdados = $trad("sdados");
		    hash.nomeFuncaoSalvarHidden = "";
		}
		if (typeof i3geoOL !== "undefined") {
		    hash.incorpo = $trad("incorpo");
		    hash.ajudaEditorOlSalva =  $trad("ajudaEditorOlSalva");
		    hash.incorpoHidden = "";
		}
		ins = Mustache.render(i3GEO.editorOL.MUSTACHESALVAGEOMETRIAS, hash);

		YAHOO.salvaGeometrias.container.panel.setBody(ins);
	    } else {
		i3GEO.janela.tempoMsg($trad("selum"));
	    }
	},


	testeSalvar : function() {
	    alert("Funcao nao disponivel. Defina o nome da funcao em i3GEO.editorOL.nomeFuncaoSalvar ");
	},
	salvaGeo : function() {
	    if(i3GEO.parametros.editor == "nao"){
		i3GEO.janela.tempoMsg($trad("meneditor3"));
		return;
	    }
	    var s = i3GEO.desenho.layergrafico.getSource(),
	    n = i3GEO.editorOL.idsSelecionados.length,
	    funcaoOK = function() {
		// verifica se a geometria contem o atributo que indica a coluna ou codigo unico
		var f = s.getFeatureById(i3GEO.editorOL.idsSelecionados[0]),
		g = f.getGeometry(),
		tema = $i("editorOLcomboTemaEditavel").value,
		redesenha, p, format;

		g = i3GEO.editorOL.google2wgs(g);
		format = new ol.format.WKT();
		f.setGeometry(g);
		if (tema == "") {
		    return;
		}
		redesenha = function(retorno) {
		    i3GEO.janela.fechaAguarde("aguardeSalvaPonto");
		    i3GEO.editorOL.removeFeaturesSel();
		    i3GEO.Interface.atualizaTema("", tema);
		};
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeSalvaPonto", $trad("adic") + "...");
		i3GEO.janela.AGUARDEMODAL = false;

		// cria um novo registro
		if(!f.getProperties().idUnico || f.getProperties().idUnico == ""){
		    p = i3GEO.configura.locaplic
		    + "/ferramentas/editortema/exec.php?funcao=adicionaGeometria&g_sid="
		    + i3GEO.configura.sid;
		    cpJSON.call(p, "foo", redesenha, "&tema=" + tema + "&wkt=" + format.writeFeatures([f]));
		} else {
		    // atualiza a geometria
		    p = i3GEO.configura.locaplic
		    + "/ferramentas/editortema/exec.php?funcao=atualizaGeometria&g_sid="
		    + i3GEO.configura.sid;
		    cpJSON.call(
			    p,
			    "foo",
			    redesenha,
			    "&idunico=" + f.getProperties().idUnico + "&tema=" + tema + "&wkt=" + format.writeFeatures([f])
		    );
		}
	    },
	    funcaoCombo = function(obj) {
		$i("editorOLondeComboTemaEditavel").innerHTML = obj.dados;
	    },
	    texto = $trad("stema")
	    + "<div style='width: 100%;' class='form-group label-fixed condensed'><label class='control-label' for=''>"
	    + $trad("salvaDadosEditor")
	    + "</label><div style='width: 100%;' class='input-group'><div id='editorOLondeComboTemaEditavel'></div></div></div>";

	    //monta a janela para o usuario escolher em qual camada os dados serao salvos
	    if (n != 1) {
		i3GEO.janela.tempoMsg($trad("seluma"));
	    } else {
		i3GEO.janela.confirma(texto, 300, $trad("salva"), "", funcaoOK);
		i3GEO.util.comboTemas(
			"editorOLcomboTemaEditavel",
			funcaoCombo,
			"editorOLondeComboTemaEditavel",
			"",
			false,
			"editavel",
			" ",
			false,
			true,
			"form-control comboTema"
		);
	    }
	},

	botaoTools: function(){
	    var temp = document.createElement("div");
	    temp.className = "editorOLtoolsItemInactive olButton";
	    temp.title = $trad("u15a");
	    temp.onclick = function(){
		// fora do i3geo, usa o jsts
		if (i3GEO.php) {
		    i3GEO.editorOL.ferramentas();
		} else {
		    i3GEO.editorOL.carregajts("i3GEO.editorOL.ferramentas()");
		}
	    };
	    return temp;
	},
	botaoSalva: function(){
	    var temp = document.createElement("div");
	    temp.className = "editorOLsalvaItemInactive olButton";
	    temp.title = $trad("salva");
	    temp.onclick = function(){
		i3GEO.editorOL.salvaGeometrias();
	    };
	    return temp;
	},
	ferramentas : function() {
	    if(i3GEO.editorOL.MUSTACHEFERRAMENTAS == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/editorol/templateFerramentas_mst.html", function(template) {
		    i3GEO.editorOL.MUSTACHEFERRAMENTAS = template;
		    i3GEO.editorOL.ferramentas();
		});
		return;
	    }
	    var b, ins;
	    if (!document.getElementById("panelferramentasEditor")) {
		YAHOO.namespace("editorOL.ferramentas");
		YAHOO.editorOL.ferramentas.panel = new YAHOO.widget.Panel("panelferramentasEditor", {
		    zIndex : 20000,
		    iframe : true,
		    width : "300px",
		    visible : false,
		    draggable : true,
		    close : true,
		    strings: {close: "<span class='material-icons'>cancel</span>"}
		});
		var hash = {
			"opsel": $trad("opsel"),
			"p14": $trad("p14"),
			"hidden": "hidden"
		};
		if (i3GEO.php) {
		    hash.hidden = "";
		}
		ins = Mustache.render(i3GEO.editorOL.MUSTACHEFERRAMENTAS, hash);
		YAHOO.editorOL.ferramentas.panel.setBody(ins);
		YAHOO.editorOL.ferramentas.panel.setHeader("<span class='i3GeoTituloJanelaBsNolink' >Ferramentas</span>");

		YAHOO.editorOL.ferramentas.panel.setFooter("");
		YAHOO.editorOL.ferramentas.panel.render(document.body);
		YAHOO.editorOL.ferramentas.panel.center();
		YAHOO.util.Event.addListener(YAHOO.editorOL.ferramentas.panel.close, "click", function() {
		});

	    } else {
		YAHOO.editorOL.ferramentas.panel.render(document.body);
	    }
	    YAHOO.editorOL.ferramentas.panel.show();
	},

	split : function() {
	    i3GEOOLsplit.deactivate();
	    var temp = $i("edge_split_toggle");
	    if (temp.checked === true) {
		i3GEOOLsplit.activate();
	    }
	},
	processageo : function(operacao) {
	    if (operacao === "") {
		return;
	    }
	    var polis, linhas, pontos, temp, nsel = i3GEO.editorOL.idsSelecionados.length;
	    if (nsel > 0) {
		temp = function(retorno) {
		    if (i3GEO.janela) {
			i3GEO.janela.fechaAguarde("i3GEO.editorPoli");
			i3GEO.janela.fechaAguarde("i3GEO.editorLinhas");
			i3GEO.janela.fechaAguarde("i3GEO.editorPontos");
		    }
		    if (retorno != "" && retorno.data && retorno.data != "" && operacao != "converteSHP") {
			i3GEO.editorOL.substituiFeaturesSel(retorno.data);
		    }
		    if (operacao === "converteSHP") {
			i3GEO.atualiza();
			i3GEO.janela.minimiza("paneltemaativo");
		    }
		};
		if (operacao === "incorporar") {
		    polis = i3GEO.editorOL.retornaFeaturesTipo("Polygon");
		    linhas = i3GEO.editorOL.retornaFeaturesTipo("LineString");
		    pontos = i3GEO.editorOL.retornaFeaturesTipo("Point");
		    if (polis.length > 0) {
			temp = i3GEO.editorOL.merge(polis);
		    }
		    if (linhas.length > 0) {
			temp = i3GEO.editorOL.merge(linhas);
		    }
		    if (pontos.length > 0) {
			temp = i3GEO.editorOL.desagrupa(pontos);
		    }
		    if (i3GEO.mapa) {
			i3GEO.mapa.dialogo.wkt2layer(temp);
		    }
		    return;
		}
		if (operacao === "union" && !i3GEO.php) {
		    polis = i3GEO.editorOL.retornaFeaturesTipo("Polygon");
		    linhas = i3GEO.editorOL.retornaFeaturesTipo("LineString");
		    pontos = i3GEO.editorOL.retornaFeaturesTipo("Point");
		    if (polis.length > 0) {
			temp = i3GEO.editorOL.uniaojts(polis);
			i3GEO.editorOL.substituiFeaturesSel(temp);
		    }
		    if (linhas.length > 0) {
			temp = i3GEO.editorOL.uniaojts(linhas);
			i3GEO.editorOL.substituiFeaturesSel(temp);
		    }
		    if (pontos.length > 0) {
			temp = i3GEO.editorOL.uniaojts(pontos);
			i3GEO.editorOL.substituiFeaturesSel(temp);
		    }
		} else {
		    polis = i3GEO.editorOL.retornaGeometriasTipo("Polygon");
		    linhas = i3GEO.editorOL.retornaGeometriasTipo("LineString");
		    pontos = i3GEO.editorOL.retornaGeometriasTipo("Point");
		    if (polis.length > 0) {
			i3GEO.janela.abreAguarde("i3GEO.editorPoli", "Poligonos");
			i3GEO.php.funcoesGeometriasWkt(temp, polis.join("|"), operacao);
		    }
		    if (linhas.length > 0) {
			i3GEO.janela.abreAguarde("i3GEO.editorLinhas", "Linhas");
			i3GEO.php.funcoesGeometriasWkt(temp, linhas.join("|"), operacao);
		    }
		    if (pontos.length > 0) {
			i3GEO.janela.abreAguarde("i3GEO.editorPontos", "Pontos");
			i3GEO.php.funcoesGeometriasWkt(temp, pontos.join("|"), operacao);
		    }
		}
		i3GEO.desenho.layergrafico.getSource().changed();
		return;
	    } else {
		i3GEO.janela.tempoMsg("Selecione pelo menos dois elementos");
	    }
	},
	desagrupa : function(geoms) {
	    var n = geoms.length,
	    w = [],
	    g, m, i,
	    format = new ol.format.WKT();
	    for (i = 0; i < n; i++) {
		g = format.writeFeatures([geoms[i]]);
		m = new Wkt.Wkt();
		m.read(g);
		w.push(m);
	    }
	    return w.join("\n");
	},
	merge : function(geoms) {
	    var n = geoms.length,
	    w = new Wkt.Wkt(),
	    g, m, i,f,
	    format = new ol.format.WKT();
	    f = format.writeFeatures([geoms[0]]);
	    w.read(f);
	    if (n > 1) {
		for (i = 1; i < n; i++) {
		    g = format.writeFeatures([geoms[i]]);
		    m = new Wkt.Wkt();
		    m.read(g);
		    w.merge(m);
		}
	    }
	    return w.write();
	},
	retornaGeometriasTipo : function(tipo) {
	    var n = i3GEO.editorOL.idsSelecionados.length, lista = [], i,
	    s = i3GEO.desenho.layergrafico.getSource(),
	    fwkt = new ol.format.WKT();
	    for (i = 0; i < n; i++) {
		f = s.getFeatureById(i3GEO.editorOL.idsSelecionados[i]);
		if (f.getGeometry().getType() == tipo) {
		    lista.push(fwkt.writeFeatures([f]));
		}
	    }
	    return lista;
	},
	unselTodosBackup : function() {
	    var n, i;
	    n = i3GEO.editorOL.backup.features.length;
	    for (i = 0; i < n; i++) {
		i3GEO.editorOL.backup.features[i].renderIntent = "default";
		i3GEO.editorOL.selbutton.unselect(i3GEO.editorOL.backup.features[i]);
	    }
	},
	restauraBackup : function() {
	    if (i3GEO.editorOL.backup.features.length > 0) {
		i3GEO.desenho.layergrafico.removeFeatures(i3GEO.desenho.layergrafico.features);
		i3GEO.desenho.layergrafico.addFeatures(i3GEO.editorOL.backup.features);
	    }
	    if (document.getElementById("panellistagEditor")) {
		i3GEO.editorOL.listaGeometrias();
	    }
	    // i3GEO.editorOL.backup.removeFeatures(i3GEO.editorOL.backup.features);
	},
	substituiFeaturesSel : function(f) {
	    i3GEO.editorOL.removeFeaturesSel();
	    var fwkt = new ol.format.WKT();
	    f = fwkt.readFeatures(f)[0];
	    f.setStyle(
		    new ol.style.Style({
			stroke: new ol.style.Stroke({
			    color: 'rgba(' + i3GEO.editorOL.simbologia.strokeColor + ',' + i3GEO.editorOL.simbologia.opacidade + ')',
			    width: i3GEO.editorOL.simbologia.strokeWidth
			}),
			fill: new ol.style.Fill({
			    color: 'rgba(' + i3GEO.editorOL.simbologia.fillColor + ',' + i3GEO.editorOL.simbologia.opacidade + ')'
			})
		    })
	    );
	    f.setId(i3GEO.util.uid());
	    i3GEO.desenho.layergrafico.getSource().addFeature(f);
	},
	adicionaFeatureWkt : function(wkt, atributos) {
	    var f, fwkt = new OpenLayers.Format.WKT();

	    if (atributos.externalGraphic && atributos.externalGraphic != "") {
		var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
		style_mark.externalGraphic = atributos.externalGraphic;
		style_mark.graphicWidth = atributos.graphicWidth;
		style_mark.graphicHeight = atributos.graphicHeight;
		style_mark.fillOpacity = atributos.opacidade;
		f = fwkt.read(wkt);
		f["attributes"] = atributos;
		f["style"] = style_mark;
	    } else {
		f = fwkt.read(wkt);
		f["attributes"] = atributos;
	    }
	    i3GEO.desenho.layergrafico.addFeatures([
		f
		]);
	    if (document.getElementById("panellistagEditor")) {
		i3GEO.editorOL.listaGeometrias();
	    }
	},
	google2wgs : function(obj) {
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		return obj.transform("EPSG:900913","EPSG:4326");
	    } else {
		return obj;
	    }
	}
};