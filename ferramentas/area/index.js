if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.area =
{
	position: [150,0],
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOareaContainer",
	    "namespace": "area",
	    "pontos" : {},
	    "ultimoWkt": "",
	    "ultimaMedida" : ""
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
	    i3GEOF.area.renderFunction.call();
	    i3GEO.analise.pontos = {};
	    i3GEOF.area._parameters.ultimaMedida = "";
	    i3GEOF.area.fechaJanela();
	    i3GEOF.area._parameters.pontos = {};
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			header: "<span class='copyToMemory' onclick='i3GEO.util.copyToClipboard(i3GEOF.area._parameters.ultimaMedida);return false;'></span>",
			onclose: i3f.destroy
		    });
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEOF.area.inicia();
	    i3GEO.janela.snackBar({content: $trad("inicia",i3f.dicionario)});
	},
	isOn : function() {
	    if($i("i3GEOF.area")){
		return true;
	    } else {
		return false;
	    }
	},
	/**
	 * Converte a lista de pontos em WKT
	 */
	pontos2wkt : function() {
	    var pontos = [], x = i3GEOF.area._parameters.pontos.xpt, y = i3GEOF.area._parameters.pontos.ypt, n = x.length, i;
	    for (i = 0; i < n; i++) {
		pontos.push(x[i] + " " + y[i]);
	    }
	    pontos.push(x[0] + " " + y[0]);
	    return "POLYGON((" + pontos.join(",") + "))";
	},
	removeFiguras : function(){
	    i3GEOF.area.removeFiguras();
	},
	    draw : "",
	    estilo: "",
	    featureListener : null,
	    //numero de pontos da geometria atual
	    //utilizado para saber se houve um clique ou nao
	    numpontos : 0,
	    removeControle : function() {
			i3geoOL.removeInteraction(i3GEOF.area.draw);
			i3GEOF.area.draw = "";
		},
	    /**
	     * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
	     * layer para receber os graficos
	     */
	    inicia : function() {
		var m = i3GEOF.area;

		i3GEO.desenho.inicia();
		m.removeControle();
		m.draw = new ol.interaction.Draw({
		    type : "Polygon"
		});
		i3GEO.Interface.parametrosMap.interactions[0].setActive(false);
		m.draw.on("drawend", function(evt) {
		    evt.feature.setProperties({
			origem : "i3GeoMedeArea"
		    });
		    evt.feature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke({
			    color: '#ffcc33',
			    width: 2
			}),
			fill: new ol.style.Fill({
			    color: 'rgba(255, 153, 0, 0.4)'
			})
		    }	));
		    evt.feature.setId(i3GEO.util.uid());
		    var m = i3GEOF.area;
		    i3GEO.editor.setStyleDefault(evt.feature);
		    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		});
		m.draw.on('drawstart', function(evt) {
		    i3GEOF.area._parameters.pontos = {
			    xpt : [],
			    ypt : [],
			    dist : []
		    };
		    i3GEO.analise.pontos = {
			    xpt : [],
			    ypt : []
		    };
		    var m = i3GEOF.area,
		    sketch = evt.feature;
		    m.estilo = sketch.getStyle();
		    m.numpontos = 2;
		    m.featureListener = sketch.getGeometry().on('change', function(evt) {
			var ponto,
			geom = evt.target,
			coords = geom.getLinearRing(0).getCoordinates(),
			n = coords.length,
			m = i3GEOF.area;
			ponto = new ol.geom.Point(coords[n-2]);
			//console.info(coords)
			if(m.numpontos === n-1){
			    //clicou
			    m.numpontos = n;
			    m.point(ponto,geom);
			}
			else{
			    m.modify(ponto,geom);
			}
		    });
		});
		i3geoOL.addInteraction(m.draw);
	    },
	    modify : function(point,geom) {
		var temp,sourceProj,coordinates,wgs84Sphere, per, area, n, x1, y1, x2, y2, trecho, direcao,
		coord = point.getCoordinates();

		n = i3GEOF.area._parameters.pontos.ypt.length;
		if (n > 1) {
		    x1 = i3GEOF.area._parameters.pontos.xpt[n - 1];
		    y1 = i3GEOF.area._parameters.pontos.ypt[n - 1];
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
		    trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
		    //parcial = i3GEOF.area.somaDist();
		    direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
		    direcao = i3GEO.calculo.dd2dms(direcao, direcao);
		    direcao = direcao[0];
		    per = i3GEOF.area.somaDist();
		    // soma ate o primeiro ponto
		    x1 = i3GEOF.area._parameters.pontos.xpt[0];
		    y1 = i3GEOF.area._parameters.pontos.ypt[0];
		    // projeta
		    if (i3GEO.Interface.googleLike) {
			temp = i3GEO.util.extOSM2Geo(x1 + " " + y1);
			temp = temp.split(" ");
			x1 = temp[0];
			y1 = temp[1];
		    }

		    per += i3GEO.calculo.distancia(x1, y1, x2, y2);

		    //getGeodesicArea
		    sourceProj = i3geoOL.getView().getProjection();
		    geom = (geom.clone().transform(sourceProj, 'EPSG:4326'));
		    coordinates = geom.getLinearRing(0).getCoordinates();
		    wgs84Sphere = new ol.Sphere(6378137);
		    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
		    i3GEOF.area.mostraParcial(trecho, per, area, direcao);
		}

	    },
	    point : function(point,geom) {
		i3GEO.eventos.cliquePerm.desativa();
		var wgs84Sphere,area,coordinates,sourceProj,n, x1, y1, x2, y2, trecho, temp,
		coord = point.getCoordinates(),
		total = 0;
		i3GEOF.area._parameters.pontos.xpt.push(coord[0]);
		i3GEOF.area._parameters.pontos.ypt.push(coord[1]);
		i3GEO.analise.pontos.xpt.push(coord[0]);
		i3GEO.analise.pontos.ypt.push(coord[1]);
		n = i3GEOF.area._parameters.pontos.ypt.length;
		if (n > 1) {
		    x1 = i3GEOF.area._parameters.pontos.xpt[n - 2];
		    y1 = i3GEOF.area._parameters.pontos.ypt[n - 2];
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
		    i3GEOF.area._parameters.pontos.dist.push(trecho);
		    total = i3GEOF.area.somaDist();

		    sourceProj = i3geoOL.getView().getProjection();
		    geom = (geom.clone().transform(sourceProj, 'EPSG:4326'));
		    coordinates = geom.getLinearRing(0).getCoordinates();
		    wgs84Sphere = new ol.Sphere(6378137);
		    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

		    i3GEOF.area.mostraTotal(total, area);
		    i3GEOF.area._parameters.ultimoWkt = i3GEOF.area.pontos2wkt();
		}
	    },
	    /**
	     * Soma os valores de distancia guardados em pontos.dist
	     */
	    somaDist : function() {
		var n, i, total = 0;
		n = i3GEOF.area._parameters.pontos.dist.length;
		for (i = 0; i < n; i++) {
		    total += i3GEOF.area._parameters.pontos.dist[i];
		}
		return total;
	    },
	    /**
	     * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
	     * atributo "origem" Os raios e pontos sao sempre removidos
	     */
	    fechaJanela : function() {
		i3GEO.Interface.parametrosMap.interactions[0].setActive(true);
		var m = i3GEOF.area;
		ol.Observable.unByKey(m.featureListener);
		m.featureListener = null;
		m.removeControle();
		m.numpontos = 0;
		i3GEO.eventos.cliquePerm.ativa();
		i3GEOF.area.removeFiguras();
	    },
	    removeFiguras : function(){
		var features, n, f, i, remover = [], temp;
		features = i3GEO.desenho.layergrafico.getSource().getFeatures();
		n = features.length;
		for (i = 0; i < n; i++) {
		    f = features[i];
		    if (f.getProperties().origem === "i3GeoMedeArea" || f.getProperties().origem === "medeAreaExcluir") {
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
	    mostraTotal : function(per, area) {
		var mostra = $i("mostraarea_calculo"), texto;
		if (mostra) {
		    texto =
			"<strong>Total </strong><br>" + $trad("d21at")
			+ " km2: "
			+ $.number((area / 1000000),3,$trad("dec"),$trad("mil"))
			+ "<br>"
			+ $trad("d21at")
			+ " ha: "
			+ $.number((area / 10000),3,$trad("dec"),$trad("mil"))
			+ "<div class='hidden-sm hidden-xs' >"
			+ $trad("x98")
			+ " km: "
			+ $.number(per,2,$trad("dec"),$trad("mil"))
			+ "<br>"
			+ $trad("x25")
			+ ": "
			+ i3GEO.calculo.metododistancia
			+ "</div>";
		    mostra.innerHTML = texto;
		    i3GEOF.area._parameters.ultimaMedida = $.number((area / 1000000),3,$trad("dec"),$trad("mil")) + " km2";
		}
	    },
	    /**
	     * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
	     */
	    mostraParcial : function(trecho, per, area, direcao) {
		var mostra = $i("mostraarea_calculo_parcial"), texto;
			if (mostra) {
				texto =
				"<strong>Parcial</strong> <br>" + $trad("d21at")
				+ " km2:"
				+ $.number((area / 1000000),3,$trad("dec"),$trad("mil"))
				+ "<br>"
				+ $trad("d21at")
				+ " ha: "
				+ $.number((area / 10000),2,$trad("dec"),$trad("mil"))
				+ "<div class='hidden-sm hidden-xs' >"
				+ $trad("x95")
				+ " km: "
				+ $.number(trecho,3,$trad("dec"),$trad("mil"))
				+ "<br>"
				+ $trad("x98")
				+ " km: "
				+ $.number(per,3,$trad("dec"),$trad("mil"))
				+ "<br>"
				+ $trad("x23")
				+ " (DMS):"
				+ direcao
				+ "</div>";
				mostra.innerHTML = texto;
			}
	    }
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("area")){
    jQuery.each( i3GEO.configura.ferramentas.area, function(index, value) {
	i3GEOF.area[index] = i3GEO.configura.ferramentas.area[index];
    });
}