if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.editor =
{
	interacoes: "",
	idsSelecionados: [],
	backup : new ol.layer.Vector({
	    source : new ol.source.Vector({
		features : new ol.Collection(),
		useSpatialIndex : false,
		name : "Backup"
	    }),
	    //map : i3geoOL,
	    visible : false
	}),
	featuresBackup : [],
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
	snap : false,
	//ver interface.js
	start : function() {
	    if(i3GEO.Interface.ATUAL == "openlayers" && !i3GEO.editor.snap){
		i3GEO.editor.snap = new ol.interaction.Snap({
		    source: i3GEO.desenho.layergrafico.getSource(),
		    pixelTolerance: 10
		});
	    }
	},
	union : function() {
	    if(i3GEO.editor.idsSelecionados.length < 2){
		i3GEO.janela.tempoMsg($trad("selum"));
		return;
	    }
	    var runUnion = function(geoms){
		if (typeof (console) !== 'undefined')
			console.log("union")

		var fwkt = new ol.format.WKT(),
		rwkt = new jsts.io.WKTReader(),
		wwkt = new jsts.io.WKTWriter(),
		n = geoms.length,
		g, i, uniao;

		if (n > 1) {
		    //converte em wkt
		    uniao = fwkt.writeFeatures([geoms[0]]);
		    //le na jsts
		    uniao = rwkt.read(uniao);
		    for (i = 1; i < n; i++) {
			g = fwkt.writeFeatures([geoms[i]]);
			uniao = uniao.union(rwkt.read(g));
		    }
		    //gera em wkt
		    uniao = wwkt.write(uniao);
		    uniao = fwkt.readFeature(uniao);
		    g = uniao.getGeometry();
		    uniao.setProperties(geoms[0].getProperties());
		    uniao.setGeometry(g);
		    return uniao;
		} else {
		    return false;
		}
	    };
	    var polis = i3GEO.editor.getFeaturesSelByType("Polygon"),
	    	linhas = i3GEO.editor.getFeaturesSelByType("LineString"),
	    	pontos = i3GEO.editor.getFeaturesSelByType("Point"),
	    	fwkt = new ol.format.WKT(),
	    	temp,f,features = [];

	    if (polis.length > 0) {
		temp = runUnion(polis);
		if(temp){
		    temp.setStyle(
			    i3GEO.editor.getPolygonStyle()
		    );
		    temp.setId(i3GEO.util.uid());
		    features.push(temp);
		}
	    }
	    if (linhas.length > 0) {
		temp = runUnion(linhas);
		if(temp){
		    f = fwkt.readFeatures(temp)[0];
		    f.setStyle(
			    i3GEO.editor.getLineStringStyle()
		    );
		    f.setId(i3GEO.util.uid());
		    features.push(f);
		}
	    }
	    if (pontos.length > 0) {
		temp = runUnion(pontos);
		if(temp){
		    f = fwkt.readFeatures(temp)[0];
		    f.setStyle(
			    i3GEO.editor.getPointStyle()
		    );
		    f.setId(i3GEO.util.uid());
		    features.push(f);
		}
	    }
	    if(features.length > 0){
		i3GEO.editor.deleteFeaturesSel();
		i3GEO.desenho.layergrafico.getSource().addFeatures(features);
	    }
	},
	ativateSnap : function(){
	    i3GEO.editor.snap.setActive(true);
	},
	removeInteracoes: function(){
	    i3geoOL.removeInteraction(i3GEO.editor.interacoes);
	    i3geoOL.removeInteraction(i3GEO.editor.snap);
	    i3GEO.editor.interacoes = "";
	},
	unselFeature : function(id) {
	    i3GEO.editor.unselAll(id);
	},
	selDelete: function(){
	    var x, nsel = i3GEO.editor.idsSelecionados.length;
	    i3GEO.editor.featuresBackup = [];
	    if(nsel > 0){
		x = window.confirm($trad("excsel") + "?");
		if(x){
		    i3GEO.editor.deleteFeaturesSel();
		    i3GEO.desenho.layergrafico.getSource().changed();
		}
	    }
	    else{
		i3GEO.janela.tempoMsg($trad("selum"));
	    }
	},
	getFeaturesSel : function(){
	    var s, i, nsel, f, sel = [];
	    nsel = i3GEO.editor.idsSelecionados.length;
	    s = i3GEO.desenho.layergrafico.getSource();
	    for(i=0; i<nsel; i++){
		f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		if(f){
		    sel.push(f);
		}
	    }
	    return sel;
	},
	deleteFeaturesSel : function(){
	    var s, i, nsel, f;
	    nsel = i3GEO.editor.idsSelecionados.length;
	    s = i3GEO.desenho.layergrafico.getSource();
	    for(i=0; i<nsel; i++){
		f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		if(f){
		    i3GEO.editor.featuresBackup.push(f.clone());
		    s.removeFeature(f);
		}
	    }
	    i3GEO.editor.idsSelecionados = [];
	    i3GEO.editor.tableRefresh();
	},
	deleteFeatureById : function(id){
	    var s = i3GEO.desenho.layergrafico.getSource(), f = s.getFeatureById(id);
	    if(f){
		i3GEO.editor.featuresBackup.push(f.clone());
		s.removeFeature(f);
		i3GEO.editor.tableRefresh();
	    }
	},
	getFeaturesSelByType : function(type) {
	    var f, n = i3GEO.editor.idsSelecionados.length, lista = [], i,
	    s = i3GEO.desenho.layergrafico.getSource();
	    for (i = 0; i < n; i++) {
		f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		if (f.getGeometry().getType() == type) {
		    lista.push(f);
		}
	    }
	    return lista;
	},
	selAll: function(idfeature){
	    if(!idfeature){
		i3GEO.editor.unselAll();
	    }
	    var features, n, f, i, id, st;
	    features = i3GEO.desenho.layergrafico.getSource().getFeatures();
	    n = features.length;
	    for (i = 0; i < n; i++) {
		f = features[i];
		id = f.getId();
		if(idfeature && idfeature != id){
		    continue;
		}
		if(!id || id == "" || id == undefined ){
		    id = i3GEO.util.uid();
		    f.setId(id);
		}

		if(i3GEO.editor.idsSelecionados.indexOf(id) < 0){
		    i3GEO.editor.idsSelecionados.push(id);
		}
		st = f.getStyle();
		//para o caso de pontos
		if(st && st.getImage()){
		    f.setStyle(
			    new ol.style.Style({
				image: new ol.style.Circle({
				    radius: i3GEO.editor.simbologia.pointRadius,
				    fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.5)'
				    }),
				    stroke: new ol.style.Stroke({
					color: 'blue',
					width: i3GEO.editor.simbologia.pointRadius / 3
				    })
				})
			    })
		    );

		    if(st.getImage().getSrc){
			f.setProperties({
			    fillColor: "",
			    strokeColor: "",
			    externalGraphic: st.getImage().getSrc(),
			    graphicHeight : st.getImage().getSize()[1],
			    graphicWidth : st.getImage().getSize()[0]
			});
		    }
		    else{
			f.setProperties({
			    fillColor: st.getImage().getFill().getColor(),
			    strokeColor: st.getImage().getStroke().getColor(),
			    externalGraphic: "",
			    graphicHeight: "",
			    graphicWidth: ""
			});
		    }

		}
		else if (st){

		    if(st.getFill()){
			f.setProperties({
			    fillColor: st.getFill().getColor()
			});
		    }
		    if(st.getStroke()){
			f.setProperties({
			    strokeColor: st.getStroke().getColor()
			});
		    }

		    if(st.getFill()){
			st.getFill().setColor('rgba(255, 255, 255, 0.5)');
		    }
		    if(st.getStroke()){
			st.getStroke().setColor('blue');
		    }
		}
	    }
	    i3GEO.desenho.layergrafico.getSource().changed();
	},
	unselAll: function(id){
	    var i, n, f, s, st;
	    s = i3GEO.desenho.layergrafico.getSource();
	    n = i3GEO.editor.idsSelecionados.length;
	    for(i=0; i<n; i++){
		if(id && id != i3GEO.editor.idsSelecionados[i]){
		    continue;
		}
		f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		if(f){
		    st = f.getStyle();
		    //caso de ponto
		    if(st && st.getImage()){
			if(st.getImage().getSrc || f.getProperties().externalGraphic != ""){
			    f.setStyle(
				    new ol.style.Style({
					image: new ol.style.Icon({
					    src : f.getProperties().externalGraphic,
					    size : [f.getProperties().graphicWidth,f.getProperties().graphicHeight]
					})
				    })
			    );
			}
			else{
			    f.setStyle(
				    new ol.style.Style({
					image: new ol.style.Circle({
					    radius: i3GEO.editor.simbologia.pointRadius,
					    fill: new ol.style.Fill({
						color: f.getProperties().fillColor
					    }),
					    stroke: new ol.style.Stroke({
						color: f.getProperties().strokeColor,
						width: i3GEO.editor.simbologia.pointRadius / 3
					    })
					})
				    })
			    );
			}
		    }
		    else if(st){
			if(f.getProperties().fillColor){
			    st.getFill().setColor(f.getProperties().fillColor);
			}
			if(f.getProperties().strokeColor){
			    st.getStroke().setColor(f.getProperties().strokeColor);
			}
		    }
		}
	    }
	    if(id){
		i3GEO.editor.idsSelecionados.remove(id);
	    } else {
		i3GEO.editor.idsSelecionados = [];
	    }
	    i3GEO.desenho.layergrafico.getSource().changed();
	},
	selectOne: function(){
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor.removeInteracoes();
	    var sel = new ol.interaction.Select();
	    i3GEO.editor.interacoes = sel;
	    i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
	    sel.on("select", function(evt) {
		var s,i, n, id, f;
		n = evt.selected.length;
		for(i=0; i<n; i++){
		    f = evt.selected[i];
		    id = f.getId();
		    if(!id || id == "" || id == undefined ){
			id = i3GEO.util.uid();
			f.setId(id);
		    }

		    if(id && i3GEO.util.in_array(id,i3GEO.editor.idsSelecionados)){
			i3GEO.editor.unselFeature(id);
		    }
		    else{
			id = i3GEO.util.uid();
			i3GEO.editor.idsSelecionados.push(id);
			f.setId(id);

			s = f.getStyle();

			if(s && s.getImage()){
			    f.setStyle(
				    new ol.style.Style({
					image: new ol.style.Circle({
					    radius: i3GEO.editor.simbologia.pointRadius,
					    fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.5)'
					    }),
					    stroke: new ol.style.Stroke({
						color: 'blue',
						width: i3GEO.editor.simbologia.pointRadius / 3
					    })
					})
				    })
			    );
			    if(!s.getImage().getSrc){
				f.setProperties({
				    fillColor: s.getImage().getFill().getColor(),
				    strokeColor: s.getImage().getStroke().getColor(),
				    externalGraphic: "",
				    graphicHeight : 25,
				    graphicWidth : 25
				});
			    }
			    else{
				f.setProperties({
				    fillColor: "",
				    strokeColor: "",
				    externalGraphic: s.getImage().getSrc(),
				    graphicHeight : s.getImage().getSize()[1],
				    graphicWidth : s.getImage().getSize()[0]
				});
			    }
			}
			else{
			    f.setProperties({
				externalGraphic: "",
				graphicHeight : 25,
				graphicWidth : 25
			    });
			    if(s.getFill()){
				f.setProperties({fillColor: s.getFill().getColor()});
				s.getFill().setColor('rgba(255, 255, 255, 0.5)');
			    }
			    if(s.getStroke()){
				f.setProperties({strokeColor: s.getStroke().getColor()});
				s.getStroke().setColor('blue');
			    }
			}
		    }
		}
		if (n === 0){
		    i3GEO.editor.unselAll();
		}
		i3GEO.editor.removeInteracoes();
		setTimeout(function() {
		    i3GEO.eventos.cliquePerm.ativa();
		},1000);
	    });
	    i3geoOL.addInteraction(sel);
	},
	edit: function(){
	    i3GEO.editor.featuresBackup = [];
	    var draw, nsel, f, c;
	    nsel = i3GEO.editor.idsSelecionados.length;
	    if(nsel == 1){
		i3GEO.editor.removeInteracoes();
		i3GEO.eventos.cliquePerm.desativa();
		f = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor.idsSelecionados[nsel - 1]);
		i3GEO.editor.featuresBackup.push(f.clone());
		c = new ol.Collection();
		c.push(f);
		draw = new ol.interaction.Modify({
		    features: c
		});
		i3GEO.editor.interacoes = draw;
		i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
		i3geoOL.addInteraction(draw);
		i3geoOL.addInteraction(i3GEO.editor.snap);
	    }
	    else{
		i3GEO.janela.tempoMsg($trad("seluma"));
	    }
	},
	orderToFront: function(){
	    var nsel = i3GEO.editor.idsSelecionados.length;
	    if(nsel > 0){
		var s, i, nsel, id, clone;
		s = i3GEO.desenho.layergrafico.getSource();
		nsel = i3GEO.editor.idsSelecionados.length;
		for(i=0; i<nsel; i++){
		    f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		    if(f){
			clone = f.clone();
			id = f.getId();
			s.removeFeature(f);
			clone.setId(id);
			s.addFeature(clone);
		    }
		}
		s.changed();
	    }
	    else{
		i3GEO.janela.tempoMsg($trad("selum"));
	    }
	},
	tableRefresh: function(){
	    if(i3GEO.editor.table.seletor && $(".layersGrForm button").length > 0){
		i3GEO.editor.table(i3GEO.editor.table.seletor);
	    }
	},
	table: function(seletor){
	    i3GEO.editor.table.seletor = seletor;
	    var keys,propriedades = [],id, temp, f, geos = i3GEO.desenho.layergrafico.getSource().getFeatures(), n = geos.length, ins = "", botoes = [];
	    while (n > 0) {
		n -= 1;
		f = geos[n];
		id = f.getId();
		if(!id || id == "" || id == undefined ){
		    id = i3GEO.util.uid();
		    f.setId(id);
		}
		if(id){
		    botoes = [];
		    propriedades = [];
		    botoes.push({
			"onclick": "i3GEO.editor.unselAll('" + id + "')",
			"title": "Unsel",
			"icone": "check_box_outline_blank"
		    });
		    botoes.push({
			"onclick": "i3GEO.editor.selAll('" + id + "')",
			"title": "Sel",
			"icone": "check_box"
		    });
		    botoes.push({
			"onclick": "i3GEO.editor.deleteFeatureById('" + id + "')",
			"title": "Del",
			"icone": "delete"
		    });
		    botoes.push({
			"onclick": "i3GEO.editor.exportFeatureById('" + id + "')",
			"title": "Export",
			"icone": "save"
		    });
		    ins += Mustache.render("{{#data}}" + i3GEO.template.botoes.listaDeIcones + "{{/data}}", {data: botoes}) + " " + id + " ";
		    keys = f.getKeys();
		    $.each(keys, function( index, name ) {
			if(name != "geometry" && keys.indexOf(name) < 0){
			    propriedades.push(name + " = " +f.get(name));
			}
		    });
		    ins += propriedades.join(" ") + "</br>";
		}
	    }
	    if (geos.length === 0) {
		ins = $trad("meneditor2");
	    }
	    ins = '<div class="alert alert-info alert-dismissible" role="alert" style="background-color:#d3eaf5;">'
		+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ ins
		+ "</div>";
	    $(seletor).html(ins);
	},
	properties : function(seletor){
	    i3GEO.editor.properties.seletor = seletor;
	    var template = "<div class='form-group label-fixed condensed'>"
		+ "<label class='control-label' >{{{label}}}</label>"
		+ "<input id='{{{id}}}' value='{{{value}}}' name='{{{typesymbol}}}' onchange='i3GEO.editor.setPropertie(\"{{{id}}}\");return false;' class='form-control input-lg {{{class}}}' type='text' />"
		+ "</div>";
	    var hash = [
		{
		    "label": "Toler&acirc;ncia Snap",
		    "value": i3GEO.editor.snap.get("pixelTolerance"),
		    "typesymbol":"pixelTolerance",
		    "class":"",
		    "id": "i3GEOeditorpixelTolerance"
		},
		{
		    "label": "Cor do contorno",
		    "value": i3GEO.editor.simbologia.strokeColor,
		    "typesymbol":"strokeColor",
		    "class":"i3geoFormIconeAquarela",
		    "id": "i3GEOeditorstrokeColor"
		},
		{
		    "label": "Cor do preenchimento",
		    "value": i3GEO.editor.simbologia.fillColor,
		    "typesymbol":"fillColor",
		    "class":"i3geoFormIconeAquarela",
		    "id": "i3GEOeditorfillColor"
		},
		{
		    "label": "Cor da fonte",
		    "value": i3GEO.editor.simbologia.fontColor,
		    "typesymbol":"fontColor",
		    "class":"i3geoFormIconeAquarela",
		    "id": "i3GEOeditorfontColor"
		},
		{
		    "label": "Tamanho da fonte",
		    "value": i3GEO.editor.simbologia.fontSize,
		    "typesymbol":"fontSize",
		    "class":"",
		    "id": "i3GEOeditorfontSize"
		},
		{
		    "label": "Opacidade (de 0 a 1)",
		    "value": i3GEO.editor.simbologia.opacidade,
		    "typesymbol":"opacidade",
		    "class":"",
		    "id": "i3GEOeditoropacidade"
		},
		{
		    "label": "Largura da linha/contorno",
		    "value": i3GEO.editor.simbologia.strokeWidth,
		    "typesymbol":"strokeWidth",
		    "class":"",
		    "id": "i3GEOeditorstrokeWidth"
		},
		{
		    "label": "Url de uma imagem",
		    "value": i3GEO.editor.simbologia.externalGraphic,
		    "typesymbol":"externalGraphic",
		    "class":"",
		    "id": "i3GEOeditorexternalGraphic"
		},
		{
		    "label": "Largura da imagem",
		    "value": i3GEO.editor.simbologia.graphicWidth,
		    "typesymbol":"graphicWidth",
		    "class":"",
		    "id": "i3GEOeditorgraphicWidth"
		},
		{
		    "label": "Altura da imagem",
		    "value": i3GEO.editor.simbologia.graphicHeight,
		    "typesymbol":"graphicHeight",
		    "class":"",
		    "id": "i3GEOeditorgraphicHeight"
		}
		];
	    ins = '<div class="alert alert-info alert-dismissible" role="alert" style="background-color:#d3eaf5;">'
		+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ Mustache.render("{{#data}}" + template + "{{/data}}", {data: hash})
		+ "</div>";
	    $(seletor).html(ins);
	    $(seletor).find(".i3geoFormIconeAquarela").click(function() {
		if(this.firstChild){
		    i3GEO.util.abreCor("", $(this).find("input")[0].id);
		} else {
		    i3GEO.util.abreCor("", this.id);
		}
	    });
	},
	setPropertie: function(id){
	    var obj = $i(id),s, i, nsel, f;
	    if(obj.name == "pixelTolerance"){
		i3GEO.editor.snap.set("pixelTolerance",obj.value*1);
		return;
	    }
	    i3GEO.editor.simbologia[obj.name] = obj.value;
	    nsel = i3GEO.editor.idsSelecionados.length;
	    s = i3GEO.desenho.layergrafico.getSource();
	    for(i=0; i<nsel; i++){
		f = s.getFeatureById(i3GEO.editor.idsSelecionados[i]);
		if(f){
		    if(obj.name === "externalGraphic" || obj.name === "graphicWidth" || obj.name === "graphicHeight"){
			f.setProperties({
			    src: i3GEO.editor.simbologia.externalGraphic,
			    size: [
				i3GEO.editor.simbologia.graphicWidth,
				i3GEO.editor.simbologia.graphicHeight
				]
			});
		    }
		    else{
			f.setProperties({
			    fillColor: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
			    strokeColor: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
			    width: i3GEO.editor.simbologia.strokeWidth,
			    fontSize: i3GEO.editor.simbologia.fontSize,
			    fontColor: i3GEO.editor.simbologia.fontColor
			});
		    }
		}
	    }
	},
	exportFeatureById: function(id){
	    var s = i3GEO.desenho.layergrafico.getSource(),
	    	f = s.getFeatureById(id),
	    	w = new Wkt.Wkt(),
	    	format = new ol.format.WKT();
	    f = format.writeFeatures([f]);
	    i3GEO.mapa.dialogo.wkt2layer(f);
	},
	editCut: function(){
	    var nsel = i3GEO.editor.idsSelecionados.length;
	    if (nsel != 1) {
		i3GEO.janela.tempoMsg($trad("selCorta"));
	    } else {
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.editor.removeInteracoes();
		i3GEO.janela.tempoMsg($trad("desPol"));
		var draw = new ol.interaction.Draw({
		    type : "Polygon"
		});
		//adiciona a interacao para poder ser removida
		i3GEO.editor.interacoes = draw;
		i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
		draw.on("drawend", function(evt) {
		    var temp, f, c, format, fwkt, cwkt;
		    f = evt.feature;
		    c = i3GEO.desenho.layergrafico.getSource().getFeatureById(i3GEO.editor.idsSelecionados[nsel - 1]);
		    i3GEO.editor.featuresBackup.push(c.clone());
		    //corta
		    format = new ol.format.WKT();
		    if(f && c){
			fwkt = format.writeFeatures([f]);
			cwkt = format.writeFeatures([c]);
			if(fwkt && cwkt){
			    temp = function(retorno) {
				i3GEO.janela.fechaAguarde("i3GEO.cortador");
				if (retorno != "" && retorno.data && retorno.data != "") {
				    i3GEO.editor.removeInteracoes();
				    i3GEO.eventos.cliquePerm.ativa();
				    i3GEO.janela.fechaAguarde("i3GEO.cortador");
				    c.setGeometry(format.readGeometry(retorno.data));
				    i3GEO.editor.tableRefresh();
				}
			    };
			    i3GEO.janela.abreAguarde("i3GEO.cortador", "Cortando");
			    i3GEO.php.funcoesGeometriasWkt(temp, cwkt + "|" + fwkt, "difference");
			}
		    }
		    i3GEO.editor.tableRefresh();

		});
		i3geoOL.addInteraction(draw);
	    }
	},
	drawText : function(drawendcallback){
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor.removeInteracoes();
	    var draw = new ol.interaction.Draw({
		type : "Point"
	    });
	    //adiciona a interacao para poder ser removida
	    i3GEO.editor.interacoes = draw;
	    i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
	    draw.on("drawend", function(evt) {
		var texto = window.prompt("Texto", "");
		evt.feature.setStyle(
			i3GEO.editor.getTextStyle()
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		setTimeout(function() {
		    i3GEO.eventos.cliquePerm.ativa();
		},1000);
		i3GEO.editor.tableRefresh();
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
	},
	drawPoint : function(drawendcallback){
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor.removeInteracoes();
	    var draw = new ol.interaction.Draw({
		type : "Point"
	    });
	    //adiciona a interacao para poder ser removida
	    i3GEO.editor.interacoes = draw;
	    i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
	    draw.on("drawend", function(evt) {
		evt.feature.setStyle(
			i3GEO.editor.getPointStyle()
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		setTimeout(function() {
		    i3GEO.eventos.cliquePerm.ativa();
		},1000);

		i3GEO.editor.tableRefresh();
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
	    i3geoOL.addInteraction(i3GEO.editor.snap);
	},
	drawLineString : function(drawendcallback){
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor.removeInteracoes();
	    var draw = new ol.interaction.Draw({
		type : "LineString"
	    });
	    //adiciona a interacao para poder ser removida
	    i3GEO.editor.interacoes = draw;
	    //desativa ol.interaction.DoubleClickZoom
	    i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
	    draw.on("drawend", function(evt) {
		evt.feature.setStyle(
			i3GEO.editor.getLineStringStyle()
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		i3GEO.eventos.cliquePerm.ativa();
		i3GEO.editor.tableRefresh();
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
	    i3geoOL.addInteraction(i3GEO.editor.snap);
	},
	drawPolygon : function(drawendcallback){
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor.removeInteracoes();
	    var draw = new ol.interaction.Draw({
		type : "Polygon"
	    });
	    //adiciona a interacao para poder ser removida
	    i3GEO.editor.interacoes = draw;
	    i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
	    draw.on("drawend", function(evt) {
		evt.feature.setStyle(
			i3GEO.editor.getPolygonStyle()
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		i3GEO.eventos.cliquePerm.ativa();
		i3GEO.editor.tableRefresh();
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
	    i3geoOL.addInteraction(i3GEO.editor.snap);
	},
	criaLayerBackup : function(){
	    if (i3GEO.editor && !i3GEO.editor.backup) {
		i3GEO.editor.backup = new ol.layer.Vector({
		    source : new ol.source.Vector({
			features : new ol.Collection(),
			useSpatialIndex : false,
			name : "Backup"
		    }),
		    visible: false
		});
		i3GEO.editor.backup.setMap(i3geoOL);
		i3GEO.editor.backup.getFeatures = function(){
		    return i3GEO.editor.backup.getSource().getFeatures();
		};
	    }
	},
	getPolygonStyle: function(){
	    return new ol.style.Style({
		    stroke: new ol.style.Stroke({
			color: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
			width: i3GEO.editor.simbologia.strokeWidth
		    }),
		    fill: new ol.style.Fill({
			color: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')'
		    })
		});
	},
	getLineStringStyle: function(){
	    return new ol.style.Style({
		    stroke: new ol.style.Stroke({
			color: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
			width: i3GEO.editor.simbologia.strokeWidth
		    }),
		    fill: new ol.style.Fill({
			color: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')'
		    })
		});
	},
	getPointStyle: function(){
	    var simbolo, url;
	    url = i3GEO.editor.simbologia.externalGraphic;
	    if(url === ""){
		simbolo = new ol.style.Circle({
		    radius: i3GEO.editor.simbologia.pointRadius,
		    fill: new ol.style.Fill({
			color: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')'
		    }),
		    stroke: new ol.style.Stroke({
			color: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
			width: i3GEO.editor.simbologia.pointRadius / 3
		    })
		});
	    }
	    else{
		simbolo = new ol.style.Icon({
		    src : url,
		    size : [i3GEO.editor.simbologia.graphicWidth,i3GEO.editor.simbologia.graphicHeight]
		});
	    }
	    return new ol.style.Style({
		    image: simbolo
		});
	},
	getTextStyle: function(){
	    return new ol.style.Style({
		text: new ol.style.Text({
		    text: texto,
		    font: 'Bold ' + parseInt(i3GEO.editor.simbologia.fontSize,10) + 'px Arial',
		    textAlign: 'left',
		    stroke: new ol.style.Stroke({
			color: 'white',
			width: i3GEO.editor.simbologia.strokeWidth
		    }),
		    fill: new ol.style.Fill({
			color: i3GEO.editor.simbologia.fontColor
		    }),
		    zIndex: 2000
		})
	    });
	}

};