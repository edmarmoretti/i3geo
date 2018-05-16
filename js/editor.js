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
	/**
	 * Function: inicia
	 *
	 * Abre as op&ccedil;&otilde;es do editor conforme a interface em uso
	 */
	inicia : function() {
	    if(i3GEOF){
		if(i3GEOF.area && i3GEOF.area.isOn()){
		    return;
		}
		if(i3GEOF.distancia && i3GEOF.distancia.isOn()){
		    return;
		}
	    }
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.editor[i3GEO.Interface.ATUAL].inicia("janelaEditorVetorial");
	},
	removeInteracoes: function(){
	    i3geoOL.removeInteraction(i3GEO.editor.interacoes);
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
	editCut: function(){
	    var nsel = i3GEO.editor.idsSelecionados.length;
	    if (nsel != 1) {
		i3GEO.janela.tempoMsg("Selecione primeiro um elemento para ser cortado");
	    } else {
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.editor.removeInteracoes();
		i3GEO.janela.tempoMsg("Desenhe um pol&iacute;gono");
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
				    if (document.getElementById("panellistagEditor")) {
					i3GEO.editor.listaGeometrias();
				    }
				}
			    };
			    i3GEO.janela.abreAguarde("i3GEO.cortador", "Cortando");
			    i3GEO.php.funcoesGeometriasWkt(temp, cwkt + "|" + fwkt, "difference");
			}
		    }
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
			new ol.style.Style({
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
			})
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		setTimeout(function() {
		    i3GEO.eventos.cliquePerm.ativa();
		},1000);
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
		evt.feature.setStyle(
			new ol.style.Style({
			    image: simbolo
			})
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		setTimeout(function() {
		    i3GEO.eventos.cliquePerm.ativa();
		},1000);

		if (document.getElementById("panellistagEditor")) {
		    i3GEO.editor.listaGeometrias();
		}
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
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
			new ol.style.Style({
			    stroke: new ol.style.Stroke({
				color: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
				width: i3GEO.editor.simbologia.strokeWidth
			    }),
			    fill: new ol.style.Fill({
				color: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')'
			    })
			})
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		i3GEO.eventos.cliquePerm.ativa();
		if (document.getElementById("panellistagEditor")) {
		    i3GEO.editor.listaGeometrias();
		}
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
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
			new ol.style.Style({
			    stroke: new ol.style.Stroke({
				color: 'rgba(' + i3GEO.editor.simbologia.strokeColor + ',' + i3GEO.editor.simbologia.opacidade + ')',
				width: i3GEO.editor.simbologia.strokeWidth
			    }),
			    fill: new ol.style.Fill({
				color: 'rgba(' + i3GEO.editor.simbologia.fillColor + ',' + i3GEO.editor.simbologia.opacidade + ')'
			    })
			})
		);
		evt.feature.setId(i3GEO.util.uid());
		i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		i3GEO.editor.removeInteracoes();
		i3GEO.eventos.cliquePerm.ativa();
		if (document.getElementById("panellistagEditor")) {
		    i3GEO.editor.listaGeometrias();
		}
	    });
	    if(drawendcallback){
		draw.on("drawend",drawendcallback);
	    }
	    i3geoOL.addInteraction(draw);
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
	criaJanela : function() {
	    if ($i("i3GEOjanelaEditor")) {
		return "i3GEOjanelaEditor";
	    }
	    var janela, divid, titulo, cabecalho, minimiza;
	    cabecalho = function() {
	    };
	    minimiza = function() {
		i3GEO.janela.minimiza("i3GEOjanelaEditor");
	    };
	    // cria a janela flutuante
	    titulo = "<div class='i3GeoTituloJanela'>"+$trad("u29")+"</div>";
	    janela = i3GEO.janela.cria("300px", "200px", "", "", "", titulo, "i3GEOjanelaEditor", false, "hd", cabecalho, minimiza);
	    divid = janela[2].id;
	    $i("i3GEOjanelaEditor_corpo").style.backgroundColor = "white";
	    $i("i3GEOjanelaEditor_corpo").style.textAlign = "left";
	    return divid;
	}
};