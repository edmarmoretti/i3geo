if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.selecao =
{
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelinhafiltro": "",
	    "idContainer": "i3GEOselecaoContainer",
	    "namespace": "selecao",
	    "removeFiguras": false
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_linhafiltro_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.mustachelinhafiltro = r2[0];
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEO.eventos.cliquePerm.ativa();
	    i3GEOF.selecao.removeFiguras();
	    i3GEOF.selecao.box.removeControle();
	    i3GEOF.selecao.clique.removeControle();
	    i3GEOF.selecao.figura.removeControle();
	    //i3GEOF.selecao.poligono.removeControle();
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    tema: p.tema,
		    p8: $trad("p8"),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '30%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1", "i3GEOselecaoguia");
	    // eventos das guias
	    $i("i3GEOselecaoguia4").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia4", "i3GEOselecaoguia");
	    };
	    $i("i3GEOselecaoguia1").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1", "i3GEOselecaoguia");
	    };
	    $i("i3GEOselecaoguia2").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia2", "i3GEOselecaoguia");
	    };
	    $i("i3GEOselecaoguia3").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia3", "i3GEOselecaoguia");
		i3GEO.util.comboTemas(
			"i3GEOselecaoTemaoverlay",
			function(retorno) {
			    $i("i3GEOselecaooverlay").innerHTML = retorno.dados;
			},
			"i3GEOselecaooverlay",
			"",
			false,
			"naolinearSelecionados",
			"",
			"",
			"",
			"form-control"
		);
	    };
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3GEO.eventos.cliquePerm.desativa();
	    i3f.nsel();
	},
	nsel: function(){
	    var nsel = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[i3GEOF.selecao._parameters.tema].nsel;
	    $i("i3GEOselecaoNsel").innerHTML = $trad('selecionados', i3GEOF.selecao.dicionario) + ": <span class='badge'>" + nsel + "</span>";
	},
	fimSelecao : function(data) {
	    i3GEO.arvoreDeCamadas.CAMADAS = "";
	    i3GEO.Interface.atualizaTema(data, i3GEOF.selecao._parameters.tema);
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.eventos.executaEventos(i3GEO.eventos.SELECAO);
	    i3GEOF.selecao.nsel();
	},
	get: function({snackbar = true, par = {}, refresh = false, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    par.tema = p.tema;
	    par.tipo = $i("i3GEOselecaotipoOperacao").value;
	    par.tolerancia = $i("i3GEOselecaotoleranciapt").value;
	    par.cor = $i("i3GEOselecaocor").value;
	    if(!par.ext){
		par.ext = i3GEO.util.extOSM2Geo("-180 -90 180 90");
	    }
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(refresh){
			    i3GEOF.selecao.fimSelecao(data);
			}
			if(fn){
			    fn(data);
			}
			if(snackbar){
			    i3GEO.janela.snackBar({content: $trad('feito')});
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	limpa: function(){
	    var par = {
		    funcao: "selecaolimpa"
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: true,
		fn: false
	    });
	},
	ext: function(){
	    var par = {
		    funcao: "selecaobox",
		    box: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: true,
		fn: false
	    });
	},
	inverte: function(){
	    var par = {
		    funcao: "selecaoinverte"
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: true,
		fn: false
	    });
	},
	atributo : function() {
	    var par = {
		    funcao: "selecaoatributo",
		    filtro: i3GEO.util.base64encode($i("i3GEOselecaofiltro").value)
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: true,
		fn: false
	    });
	},
	removeFiguras : function(){
	    if( i3GEOF.selecao._parameters.removeFiguras === false ){
		var features, n, f, i, remover = [];
		features = i3GEO.desenho.layergrafico.getSource().getFeatures();
		n = features.length;
		for(i = 0; i < n; i++){
		    f = features[i];
		    if(f.getProperties().origem === "i3GEOFselecao"){
			remover.push(f);
		    }
		}
		if(remover.length > 0 ){
		    for(r in remover){
			i3GEO.desenho.layergrafico.getSource().removeFeature(remover[r]);
		    }
		}
	    }
	},
	criatema : function() {
	    var par = {
		    funcao: "selecaocriatema"
	    };
	    var temp = function(){
		i3GEO.mapa.refresh();
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: false,
		fn: temp
	    });
	},
	box : {
	    draw : "",
	    inicia : function() {
		i3GEO.eventos.cliquePerm.desativa();
		i3GEOF.selecao.box.removeControle();
		i3GEOF.selecao.box.draw = new ol.interaction.Draw({
		    type : "Circle",
		    freehand: true,
		    geometryFunction: ol.interaction.Draw.createRegularPolygon(4)
		});
		i3GEOF.selecao.box.draw.setActive(true);
		i3GEOF.selecao.box.draw.on("drawend",function(evt){
		    var feature, geo, pol = evt.feature.getGeometry(), format = new ol.format.WKT();
		    pol = i3GEO.util.projOSM2Geo(pol);
		    feature = new ol.Feature({
			geometry: pol,
			origem: 'i3GEOFselecao'
		    });
		    if (i3GEOF.selecao._parameters.removeFiguras === true) {
			i3GEO.desenho.layergrafico.getSource().addFeature(feature);
		    }
		    i3GEOF.selecao.box.removeControle();
		    i3GEO.eventos.cliquePerm.ativa();

		    i3GEOF.selecao.figura.termina(format.writeFeature(feature));
		});
		i3geoOL.addInteraction(i3GEOF.selecao.box.draw);
	    },
	    removeControle : function() {
		i3geoOL.removeInteraction(i3GEOF.selecao.box.draw);
		i3GEOF.selecao.box.draw = "";
	    },
	    termina : function(wkt) {
		var par = {
			funcao: "selecaowkt",
			wkt: wkt,
			buffer: 0
		};
		i3GEOF.selecao.get({
		    snackbar: true,
		    par: par,
		    refresh: true,
		    fn: false
		});
	    }
	},
	clique : {
	    draw : "",
	    inicia : function() {
		i3GEO.eventos.cliquePerm.desativa();
		i3GEOF.selecao.clique.removeControle();
		i3GEOF.selecao.clique.draw = new ol.interaction.Draw({
		    type : "Point",
		    maxPoints : 1
		});
		i3GEOF.selecao.clique.draw.on("drawend",function(evt){
		    if (typeof (console) !== 'undefined')
			console.info("i3GEOF.selecao.clique.draw.on('drawend'");

		    var geo, ponto = evt.feature.getGeometry();
		    if (i3GEOF.selecao._parameters.removeFiguras === true) {
			evt.feature.setProperties({origem : "i3GEOFselecao"});
			i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
		    }
		    i3GEOF.selecao.clique.removeControle();
		    i3GEO.eventos.cliquePerm.ativa();
		    ponto = i3GEO.util.projOSM2Geo(ponto);
		    geo = ponto.getCoordinates();
		    i3GEOF.selecao.clique.termina(geo);
		});
		i3geoOL.addInteraction(i3GEOF.selecao.clique.draw);
	    },
	    removeControle : function() {
		i3geoOL.removeInteraction(i3GEOF.selecao.clique.draw);
		i3GEOF.selecao.clique.draw = "";
	    },
	    termina : function(xy) {
		var par = {
			funcao: "selecaopt",
			xy: xy.join(" ")
		};
		i3GEOF.selecao.get({
		    snackbar: true,
		    par: par,
		    refresh: true,
		    fn: false
		});
	    }
	},
	figura : {
	    draw : "",
	    inicia : function() {
		var features = i3GEO.desenho.layergrafico.getFeatures();
		if(features.length === 0){
		    i3GEO.janela.snackBar({content: $trad('noeditor', i3GEOF.selecao.dicionario)});
		    return;
		}
		i3GEO.janela.snackBar({content: $trad('cliqueSel', i3GEOF.selecao.dicionario)});
		i3GEO.eventos.cliquePerm.desativa();
		i3GEOF.selecao.figura.removeControle();
		i3GEOF.selecao.figura.draw = new ol.interaction.Select();
		i3GEOF.selecao.figura.draw.on("select",function(evt){
		    var wkt, i, n, f, format = new ol.format.WKT();
		    geo = i3GEOF.selecao.figura.draw.getFeatures();
		    n = evt.selected.length;
		    for(i=0; i<n; i++){
			f =evt.selected[i];
			f = i3GEO.util.projOSM2Geo(f);
			wkt = format.writeFeature(f);
			i3GEOF.selecao.figura.termina(wkt);
		    }
		    i3GEO.eventos.cliquePerm.ativa();
		    i3GEOF.selecao.figura.removeControle();
		});
		i3geoOL.addInteraction(i3GEOF.selecao.figura.draw);
	    },
	    removeControle : function() {
		i3geoOL.removeInteraction(i3GEOF.selecao.figura.draw);
		i3GEOF.selecao.figura.draw = "";
	    },
	    termina : function(wkt) {
		var par = {
			funcao: "selecaowkt",
			wkt: wkt,
			buffer: 0
		};
		i3GEOF.selecao.get({
		    snackbar: true,
		    par: par,
		    refresh: true,
		    fn: false
		});
	    }
	},
	figurasel : {
	    inicia : function() {
		var geo = i3GEO.editor.sel.getFeatures();
		if(geo.length === 0){
		    i3GEO.janela.snackBar({content: $trad('nofeature', i3GEOF.selecao.dicionario)});
		    return;
		}
		var wkt, format = new ol.format.WKT();
		for(let f of geo){
		    var fclone = f.clone();
		    fclone.setGeometry(i3GEO.util.projOSM2Geo(fclone.getGeometry()));
		    wkt = format.writeFeature(fclone);
		    i3GEOF.selecao.figura.termina(wkt);
		}
	    },
	    termina : function(wkt) {
		var par = {
			funcao: "selecaowkt",
			wkt: wkt,
			buffer: 0
		};
		i3GEOF.selecao.get({
		    snackbar: true,
		    par: par,
		    refresh: true,
		    fn: false
		});
	    }
	},
	aplicaselecaoTema : function() {
	    if ($i("i3GEOselecaoTemaoverlay").value === "") {
		return;
	    }
	    var par = {
		    funcao: "selecaotema",
		    temao: $i("i3GEOselecaoTemaoverlay").value
	    };
	    i3GEOF.selecao.get({
		snackbar: true,
		par: par,
		refresh: true,
		fn: false
	    });
	}
};
