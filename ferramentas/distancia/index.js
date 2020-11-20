if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.distancia =
{
	position: [150,0],
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOdistanciaContainer",
	    "namespace": "distancia",
	    "pontos": {},
	    "ultimoWkt": "",
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    i3GEO.janela.fechaAguarde();
		    p.mustache = r1;
		    i3f.html();
		}).fail(function(data) {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: "Erro. " + data.status, style:'red'});
		    i3f.destroy();
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEOF.distancia.renderFunction.call();
	    i3GEO.analise.pontos = {
		    xpt : [],
		    ypt : []
	    };
	    i3GEOF.distancia._parameters.ultimaMedida = "";
	    i3GEOF.distancia.fechaJanela();
	    i3GEOF.distancia._parameters.pontos = {};
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    caixaDeEstilos: i3GEO.desenho.caixaEstilos(),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			header: "<span class='copyToMemory' onclick='i3GEO.util.copyToClipboard(i3GEOF.distancia._parameters.ultimaMedida);return false;'></span>",
			onclose: i3f.destroy
		    });
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEOF.distancia.inicia();
	    i3GEO.janela.snackBar({content: $trad("inicia",i3f.dicionario)});
	},
	isOn : function() {
	    if($i("i3GEOF.distancia")){
		return true;
	    } else {
		return false;
	    }
	},

	/**
	 * Converte a lista de pontos em WKT
	 */
	pontos2wkt : function() {
	    var pontos = [], x = i3GEOF.distancia._parameters.pontos.xpt, y = i3GEOF.distancia._parameters.pontos.ypt, n = x.length, i;
	    for (i = 0; i < n; i++) {
		pontos.push(x[i] + " " + y[i]);
	    }
	    return "LINESTRING(" + pontos.join(",") + ")";
	},
	removeFiguras : function(){
	    i3GEOF.distancia.removeFiguras();
	},
	mostraTotal : function(trecho, total){
	    i3GEOF.distancia.mostraTotal(trecho, total);
	},
	mostraParcial : function(trecho, parcial, direcao){
	    i3GEOF.distancia.mostraParcial(trecho, parcial, direcao);
	},
	    draw : "",
	    estilo: "",
	    featureListener : null,
	    //numero de pontos da geometria atual
	    //utilizado para saber se houve um clique ou nao
	    numpontos : 0,
	    removeControle : function() {
			i3geoOL.removeInteraction(i3GEOF.distancia.draw);
			i3GEOF.distancia.draw = "";
	    },
	    /**
	     * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
	     * layer para receber os graficos
	     */
	    inicia : function() {
		i3GEOF.distancia.estilo =
		    new ol.style.Style({
			stroke: new ol.style.Stroke({
			    color: '#ffcc33',
			    width: 5
			}),
			fill: new ol.style.Fill({
			    color: 'rgba(255, 153, 0, 0.8)'
			})
		    });
		i3GEO.desenho.estiloPadrao = "normal";
		var m = i3GEOF.distancia;
		i3GEO.desenho.inicia();
		m.removeControle();
		m.draw = new ol.interaction.Draw({
		    type : "LineString"
		});
		i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
		m.draw.on("drawend", function(evt) {
		    evt.feature.setProperties({
			origem : "medeDistancia"
		    });
		    var m = i3GEOF.distancia;
		    evt.feature.setStyle(
			    new ol.style.Style({
				stroke: new ol.style.Stroke({
				    color: i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao].linecolor,
				    width: 5
				})
			    })
		    );
		    i3GEO.editor.setStyleDefault(evt.feature);
		    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		    m.draw.setActive(false);
		    m.draw.setActive(true);
		});
		m.draw.on('drawstart', function(evt) {
		    i3GEOF.distancia._parameters.pontos = {
			    xpt : [],
			    ypt : [],
			    dist : []
		    };
		    //usado no perfil
		    i3GEO.analise.pontos = {
			    xpt : [],
			    ypt : []
		    };
		    var m = i3GEOF.distancia,
		    sketch = evt.feature;
		    m.estilo = sketch.getStyle();
		    m.numpontos = 1;
		    m.featureListener = sketch.getGeometry().on('change', function(evt) {
			var ponto,
			geom = evt.target,
			coords = geom.getCoordinates(),
			n = coords.length,
			m = i3GEOF.distancia;
			ponto = new ol.geom.Point(coords[n-1]);
			if(m.numpontos === n-1){
			    //clicou
			    m.numpontos = n;
			    m.point(ponto);
			}
			else{
			    m.modify(ponto);
			}
		    });
		});
		i3geoOL.addInteraction(m.draw);
	    },
	    modify : function(point) {
		var temp, n, x1, y1, x2, y2, trecho, parcial, direcao,
		coord = point.getCoordinates();
		n = i3GEOF.distancia._parameters.pontos.ypt.length;
		if (n > 0) {
		    x1 = i3GEOF.distancia._parameters.pontos.xpt[n - 1];
		    y1 = i3GEOF.distancia._parameters.pontos.ypt[n - 1];
		    x2 = coord[0];
		    y2 = coord[1];
		    // projeta
		    if (i3GEO.Interface.googleLike) {
			temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
			temp = temp.split(" ");
			x1 = temp[0];
			y1 = temp[1];
			x2 = temp[2];
			y2 = temp[3];
		    }
		    //console.info(x1+" "+y1+" "+x2+" "+y2)
		    trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
		    parcial = i3GEOF.distancia.somaDist();
		    direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
		    direcao = i3GEO.calculo.dd2dms(direcao, direcao);
		    direcao = direcao[0];
		    i3GEOF.distancia.mostraParcial(trecho, parcial, direcao);
		}
	    },
	    point : function(point) {
		i3GEO.eventos.cliquePerm.desativa();
		var n, x1, y1, x2, y2, trecho, temp, circ, label, raio,
		estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
		coord = point.getCoordinates(),
		total = 0;
		i3GEOF.distancia._parameters.pontos.xpt.push(coord[0]);
		i3GEOF.distancia._parameters.pontos.ypt.push(coord[1]);
		i3GEO.analise.pontos.xpt.push(coord[0]);
		i3GEO.analise.pontos.ypt.push(coord[1]);
		n = i3GEOF.distancia._parameters.pontos.ypt.length;
		if (n > 1) {
		    x1 = i3GEOF.distancia._parameters.pontos.xpt[n - 2];
		    y1 = i3GEOF.distancia._parameters.pontos.ypt[n - 2];
		    x2 = coord[0];
		    y2 = coord[1];
		    raio = new ol.geom.LineString([[x1, y1],[x2, y2]]).getLength();
		    // projeta
		    if (i3GEO.Interface.googleLike) {
			temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
			temp = temp.split(" ");
			x1 = temp[0];
			y1 = temp[1];
			x2 = temp[2];
			y2 = temp[3];
		    }
		    trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
		    i3GEOF.distancia._parameters.pontos.dist.push(trecho);
		    total = i3GEOF.distancia.somaDist();
		    i3GEOF.distancia.mostraTotal(trecho, total);
		    i3GEOF.distancia._parameters.ultimoWkt = i3GEOF.distancia.pontos2wkt();
		    // raio
		    if ($i("pararraios") && $i("pararraios").checked === true) {

			temp = i3GEO.util.projGeo2OSM(new ol.geom.Point([x1*1, y1*1]));
			circ = new ol.Feature({
			    geometry: new ol.geom.Circle(temp.getCoordinates(),raio)
			});
			circ.setProperties({
			    origem : "medeDistanciaExcluir"
			});

			circ.setStyle(
				new ol.style.Style({
				    stroke: new ol.style.Stroke({
					color: estilo.circcolor,
					width: 1
				    }),
				    zIndex: 2
				})
			);
			i3GEO.editor.setStyleDefault(circ);
			i3GEO.desenho.layergrafico.getSource().addFeature(circ);
		    }
		    // desenha ponto
		    if ($i("parartextos") && $i("parartextos").checked === true) {
			label = new ol.Feature({
			    geometry: i3GEO.util.projGeo2OSM(new ol.geom.Point([x2*1, y2*1]))
			});
			label.setProperties({
			    origem : "medeDistanciaExcluir"
			});
			label.setStyle(
				new ol.style.Style({
				    image: new ol.style.Circle({
					radius: 3,
					fill: new ol.style.Fill({
					    color: estilo.circcolor
					}),
					stroke: new ol.style.Stroke({
					    color: estilo.circcolor,
					    width: 1
					})
				    }),
				    text: new ol.style.Text({
					text : $.number(trecho,3,$trad("dec"),$trad("mil")),
					font: 'Bold 14px Arial',
					textAlign: 'left',
					stroke: new ol.style.Stroke({
					    color: 'white',
					    width: 1
					}),
					fill: new ol.style.Fill({
					    color: estilo.textcolor
					}),
					zIndex: 2000
				    })
				})
			);
			i3GEO.editor.setStyleDefault(label);
			i3GEO.desenho.layergrafico.getSource().addFeature(label);
		    }
		}
	    },
	    /**
	     * Soma os valores de distancia guardados em pontos.dist
	     */
	    somaDist : function() {
		var n, i, total = 0;
		n = i3GEOF.distancia._parameters.pontos.dist.length;
		for (i = 0; i < n; i++) {
		    total += i3GEOF.distancia._parameters.pontos.dist[i];
		}
		return total;
	    },
	    /**
	     * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
	     * atributo "origem" Os raios e pontos sao sempre removidos
	     */
	    fechaJanela : function() {
		i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
		var m = i3GEOF.distancia;
		ol.Observable.unByKey(m.featureListener);
		m.featureListener = null;
		m.removeControle();
		m.numpontos = 0;
		i3GEO.eventos.cliquePerm.ativa();
		i3GEOF.distancia.removeFiguras();
	    },
	    removeFiguras: function(){
		var features, n, f, i, remover = [], temp;
		features = i3GEO.desenho.layergrafico.getSource().getFeatures();
		n = features.length;
		for (i = 0; i < n; i++) {
		    f = features[i];
		    if (f.getProperties().origem === "medeDistancia" || f.getProperties().origem === "medeDistanciaExcluir") {
			remover.push(f);
		    }
		}
		if (remover.length > 0) {
		    temp = window.confirm($trad("x94"));
		    if (temp) {
			for (r in remover) {
			    i3GEO.desenho.layergrafico.getSource().removeFeature(remover[r]);
			}
		    }
		}
	    },
	    /**
	     * Mostra a totalizacao das linhas ja digitalizadas
	     */
	    mostraTotal : function(trecho, total) {
		var mostra = $i("mostradistancia_calculo"), texto;
		if (mostra) {
		    texto =
			"<strong>Total</strong><br>" + $trad("x96")
			+ " km: "
			+ $.number(total,3,$trad("dec"),$trad("mil"))
			+ "<br>"
			+ $trad("x96")
			+ " m: "
			+ $.number((total * 1000),2,$trad("dec"),$trad("mil"))
			+ "<div class='hidden-sm hidden-xs' >"
			+ $trad("x25")
			+ ": "
			+ i3GEO.calculo.metododistancia
			+ "</div>";
		    i3GEOF.distancia._parameters.ultimaMedida = $.number(total,3,$trad("dec"),$trad("mil")) + " km";
		    mostra.innerHTML = texto;
		}
	    },
	    /**
	     * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
	     */
	    mostraParcial : function(trecho, parcial, direcao) {
		var mostra = $i("mostradistancia_calculo_movel"), texto;
		if (mostra) {
		    texto =
			"<strong>Parcial </strong><br>" + $trad("x95")
			+ " km: "
			+ $.number(trecho,3,$trad("dec"),$trad("mil"))
			+ "<br>"
			+ $trad("x97")
			+ " km: "
			+ $.number((parcial + trecho),3,$trad("dec"),$trad("mil"))
			+ "<div class='hidden-sm hidden-xs' >"
			+ $trad("x23")
			+ " (DMS): "
			+ direcao
			+ "</div>";
		    mostra.innerHTML = texto;
		}
	    }
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("distancia")){
    jQuery.each( i3GEO.configura.ferramentas.distancia, function(index, value) {
	i3GEOF.distancia[index] = i3GEO.configura.ferramentas.distancia[index];
    });
}