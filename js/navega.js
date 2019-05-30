if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.navega =
{
	/**
	 * Guarda as ultimas extensoes geograficas das operacoes de navegacao
	 */
	EXTENSOES : {
	    lista : [],
	    redo : [],
	    posicao : 0,
	    emAcao : false
	},
	/**
	 * Function: offset
	 *
	 * Nao implementado para googlemaps
	 *
	 * Desloca o centro do mapa
	 *
	 * pixelx - numero de pixels
	 *
	 * pixely - numero de pixels
	 *
	 */
	offset: function (pixelx,pixely){
	    if(i3GEO.Interface.ATUAL == "openlayers"){
		var view = i3geoOL.getView(),
		mover = [pixelx,pixely],
		s = i3geoOL.getSize(),
		dx  = s[0]/2 + mover[0],
		dy = s[1]/2 + mover[1];
		view.centerOn(view.getCenter(), s, [dx,dy]);
	    }
	},
	/**
	 * Ativa a funcao de navegacao do tipo pan
	 */
	ativaPan: function(){
	    if (i3GEO.Interface.ATUAL === "googlemaps") {
		i3GeoMap.setOptions({
		    draggable : true
		});
	    }
	    if (i3GEO.Interface.ATUAL === "openlayers") {
		marcadorZoom = "";
		i3GEO.Interface.OLpanel.activateControl(i3GEO.Interface.openlayers.OLpan);
	    }
	},
	/**
	 * Registra uma extensao na variavel EXTENSOES
	 */
	registraExt : function(ext) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.registraExt()");

	    if(i3GEO.navega.EXTENSOES.emAcao == false){
		var l = i3GEO.navega.EXTENSOES.lista,
		n = l.length;
		//precisa ter cuidado para nao registrar a mesma extensao atual
		if (n > 10){
		    l.shift();
		}
		n = l.length;
		if(n > 0 && l[n-1] === ext){
		    return;
		}
		l.push(ext);

		if (typeof (console) !== 'undefined')
		    console.info(ext);

	    } else {
		i3GEO.navega.EXTENSOES.emAcao = false;
	    }
	},
	extensaoAnterior : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.extensaoAnterior()" + i3GEO.navega.EXTENSOES.lista.length);

	    i3GEO.navega.EXTENSOES.emAcao = true;

	    var l = i3GEO.navega.EXTENSOES.lista,
	    r = i3GEO.navega.EXTENSOES.redo,
	    a = i3GEO.mapa.getExtent().string,
	    e;
	    if(l.length > 0){
		if(l.length > 1){
		    e = l.pop();
		    i3GEO.navega.zoomExt("", "", "", e);
		    if(r.length > 10){
			r.shift();
		    }
		    if(r.length > 0 && r[r.length -1] === e){
			return;
		    } else {
			r.push(a);
		    }
		}
	    } else {
		l.push(a);
	    }
	},
	extensaoProximo : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.extensaoProximo()" + i3GEO.navega.EXTENSOES.lista.length);

	    var l = i3GEO.navega.EXTENSOES.lista,
	    r = i3GEO.navega.EXTENSOES.redo,
	    a = i3GEO.mapa.getExtent().string,
	    e;

	    i3GEO.navega.EXTENSOES.emAcao = true;

	    if(r.length > 0){
		i3GEO.navega.zoomExt("", "", "", r[r.length-1]);
		e = r.pop();
		if(l.length > 10){
		    l.pop();
		}
		if(l.length > 0 && l[l.length -1] === e){
		    return;
		}
		l.push(a);
	    }
	},
	/**
	 * Function: pan2ponto
	 *
	 * Desloca o centro do mapa para um ponto. Utiliza as funcoes da API em uso para executar o pan
	 *
	 * Parameters:
	 *
	 * {numerico} - longitude
	 *
	 * {numerico} - latitude
	 */
	pan2ponto : function(x, y) {
	    i3GEO.Interface.pan2ponto(x, y);
	    i3GEO.Interface.recalcPar();
	},
	/**
	 * Function: centroDoMapa
	 *
	 * Depreciado na versao 7
	 *
	 * Obt&eacute;m as coordenadas geogr&aacute;ficas do centro do mapa
	 *
	 * Retorno:
	 *
	 * {array|false} - false se falhar ou [x,y] se n&atilde;o falhar
	 */
	centroDoMapa : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.centroDoMapa()");

	    var xy;
	    switch (i3GEO.Interface.ATUAL) {
	    case "openlayers":
		xy = i3geoOL.getCenter();
		if (xy) {
		    return [
			xy.lon,
			xy.lat
			];
		} else {
		    return false;
		}
		break;
	    case "googlemaps":
		xy = i3GeoMap.getCenter();
		if (xy) {
		    return [
			xy.lng(),
			xy.lat()
			];
		} else {
		    return false;
		}
		break;
	    default:
		return false;
	    }
	},
	//a marca e fixa no mapa quando ocorre o PAN
	marcaCentroDoMapa : function(xy) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.marcaCentroDoMapa()");
	    var t = $i("i3GeoCentroDoMapa");
	    if(t && t.style.display === "block"){
		return;
	    }
	    if (xy != false) {
		xy =
		    i3GEO.calculo.dd2tela(
			    xy[0] * 1,
			    xy[1] * 1,
			    $i(i3GEO.Interface.IDMAPA),
			    i3GEO.mapa.getExtent().string,
			    i3GEO.parametros.pixelsize);
		i3GEO.util.criaPin("i3GeoCentroDoMapa", i3GEO.configura.locaplic + '/imagens/alvo.png', '30px', '30px');
		i3GEO.util.posicionaImagemNoMapa("i3GeoCentroDoMapa", xy[0], xy[1]);
	    }
	},
	removeCookieExtensao : function() {
	    var nomecookie = "i3geoOLUltimaExtensao";
	    if (i3GEO.Interface.googleLike === true) {
		nomecookie = "i3geoUltima_ExtensaoOSM";
	    }
	    i3GEO.util.insereCookie(nomecookie, "");
	},
	/**
	 * Function: zoomin
	 *
	 * Aproxima o mapa aplicando um fator de modifica&ccedil;&atilde;o da escala
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 */
	zoomin : function(locaplic, sid) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoomin()");

	    if (i3GEO.Interface.ATUAL === "openlayers") {
		i3geoOL.zoomIn();
		return;
	    }
	},
	/**
	 * Function: zoomout
	 *
	 * Afasta o mapa aplicando um fator de modifica&ccedil;&atilde;o da escala
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 */
	zoomout : function(locaplic, sid) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoomout()");

	    if (i3GEO.Interface.ATUAL === "openlayers") {
		i3geoOL.zoomOut();
		return;
	    }
	},
	/**
	 * Function: zoomponto
	 *
	 * Centraliza o mapa em um ponto e acrescenta o ponto como uma nova camada no mapa
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 *
	 * {Numeric} - coordenada em d&eacute;cimos de grau da longitude
	 *
	 * {Numeric} - coordenada em d&eacute;cimos de grau da latitude
	 *
	 * {Numeric} - opcional, tamanho do s&iacute;mbolo do ponto que ser&aacute; inserido no mapa
	 *
	 * {String} - opcional, nome do s&iacute;mbolo para o ponto
	 *
	 * {String} - opcional, cor em r g b (p.ex. "255 0 0")
	 */
	zoomponto : function(locaplic, sid, x, y, tamanho, simbolo, cor) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoomponto()");

	    if (!simbolo) {
		simbolo = "ponto";
	    }
	    if (!tamanho) {
		tamanho = 15;
	    }
	    if (!cor) {
		cor = "255 0 0";
	    }
	    if (locaplic !== "") {
		i3GEO.configura.locaplic = locaplic;
	    }
	    if (sid !== "") {
		i3GEO.configura.sid = sid;
	    }

	    var retorno = function(retorno) {

		    i3GEO.Interface.pan2ponto(x, y);

		    i3GEO.mapa.refresh();
	    };
	    i3GEO.Interface.pan2ponto(x, y);
	    i3GEO.request.get({
		snackbar: false,
		snackbarmsg: false,
		btn: false,
		par: {
		    funcao: "zoomponto",
		    pin: "pin",
		    xy: x + " " + y,
		    marca: simbolo,
		    tamanho: tamanho,
		    cor: cor
		},
		prog: "/serverapi/map/",
		fn: function(data){
		    i3GEO.mapa.refresh();
		}
	    });

	},
	/**
	 * Function: xy2xy
	 *
	 * Desloca o mapa de um ponto de coordenadas xy para um segundo ponto
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 *
	 * {Numeric} - coordenada x inicial
	 *
	 * {Numeric} - coordenada y inicial
	 *
	 * {Numeric} - coordenada x final
	 *
	 * {Numeric} - coordenada y final
	 *
	 * {String} - extens&atilde;o geogr&aacute;fica do mapa
	 *
	 * {String} - tipo de imagem atual do mapa (sepia,nenhum,cinza)
	 */
	xy2xy : function(locaplic, sid, xi, yi, xf, yf, ext, tipoimagem) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.xy2xy()");

	    var disty, distx, ex, novoxi, novoxf, novoyf, nex;
	    if (locaplic !== "") {
		i3GEO.configura.locaplic = locaplic;
	    }
	    if (sid !== "") {
		i3GEO.configura.sid = sid;
	    }
	    disty = (yi * -1) + yf;
	    distx = (xi * -1) + xf;
	    ex = ext.split(" ");
	    novoxi = (ex[0] * 1) - distx;
	    novoxf = (ex[2] * 1) - distx;
	    novoyi = (ex[1] * 1) - disty;
	    novoyf = (ex[3] * 1) - disty;
	    if ((distx === 0) && (disty === 0)) {
		return false;
	    } else {
		nex = novoxi + " " + novoyi + " " + novoxf + " " + novoyf;
		i3GEO.navega.zoomExt(i3GEO.configura.locaplic, i3GEO.configura.sid, tipoimagem, nex);
		return true;
	    }
	},
	/**
	 * Function: zoomExt
	 *
	 * Aplica uma nova extens&atilde;o geogr&aacute;fica ao mapa.
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 *
	 * {String} - Utlize "" para aplicar o default. Tipo de imagem que ser&aacute; retornada na imagem do mapa que ser&aacute; criada
	 *
	 * {String} - Extens&atilde;o geogr&aacute;fica no formato xmin ymin xmax ymax
	 */
	zoomExt : function(locaplic, sid, tipoimagem, ext) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoomExt()" + ext);

	    var f;
	    if (locaplic !== "") {
		i3GEO.configura.locaplic = locaplic;
	    }
	    if (sid !== "") {
		i3GEO.configura.sid = sid;
	    }
	    if (tipoimagem === "") {
		tipoimagem = "nenhum";
	    }
	    i3GEO.Interface.zoom2ext(ext);
	},
	/**
	 * Function: aplicaEscala
	 *
	 * Aplica ao mapa um novo valor de escala tendo como base o valor do denminador
	 *
	 * Utilize "" caso vc queira usar locaplic e sid default.
	 *
	 * Parametros:
	 *
	 * {String} - endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX. Pode ser ""
	 *
	 * {String} - c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo. pode ser ""
	 *
	 * {Numeric} - denominador da escala
	 */
	aplicaEscala : function(escala) {
	    i3geoOL.zoomToScale(escala, true);
	},
	atualizaEscalaNumerica : function(escala) {
	    var e = $i("i3GEOescalanum");
	    if (!e) {
		return;
	    }
	    if (arguments.length === 1) {
		e.value = $.number(escala,0,$trad("dec"),$trad("mil"));
	    } else {
		e.value = $.number(i3geoOL.getScale(),0,$trad("dec"),$trad("mil"));
	    }
	},
	panFixo : function() {
	    alert("panFixo foi depreciado na versao 6.0");
	},
	mostraRosaDosVentos : function() {
	    alert("mostraRosaDosVentos foi depreciado na versao 6.0");
	},
	zoomBox : {
	    inicia : function() {
		alert("zoomBox depreciado na versao 6.0");
	    }
	},
	//nao funciona por causa da politica de emsma origem
	lente : {
	    _lenteCompose: "",
	    eventMouseout: function() {
		if(i3GEO.navega.lente._lenteCompose != ""){
		    i3GEO.navega.lente.stop(i3geoOL.getTargetElement());
		}
	    },
	    eventMouseMove: function(event) {
		if(i3GEO.navega.lente._lenteCompose != ""){
		    i3geoOL.renderSync();
		}
	    },
	    stop: function(container){
		ol.Observable.unByKey(i3GEO.navega.lente._lenteCompose);
		i3GEO.navega.lente._lenteCompose = "";
		container.removeEventListener('mousemove', i3GEO.navega.lente.eventMouseMove);
		container.removeEventListener('mouseout', i3GEO.navega.lente.eventMouseout);
		i3geoOL.renderSync();
	    },
	    start : function(){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.lente()");

		if(i3GEO.Interface.ATUAL != "openlayers"){
		    return;
		}
		var container = i3geoOL.getTargetElement();
		var radius = 75;
		container.addEventListener('mousemove', i3GEO.navega.lente.eventMouseMove);
		container.addEventListener('mouseout', i3GEO.navega.lente.eventMouseout);
		var a = i3geoOL.on('postcompose', function(event) {
		    var context = event.context;
		    var pixelRatio = event.frameState.pixelRatio;
		    var half = radius * pixelRatio;
		    var centerX = objposicaocursor.imgx * pixelRatio;
		    var centerY = objposicaocursor.imgy * pixelRatio;
		    var originX = centerX - half;
		    var originY = centerY - half;
		    var size = 2 * half + 1;

		    var sourceData = context.getImageData(originX, originY, size, size).data;
		    var dest = context.createImageData(size, size);
		    var destData = dest.data;
		    for (var j = 0; j < size; ++j) {
			for (var i = 0; i < size; ++i) {
			    var dI = i - half;
			    var dJ = j - half;
			    var dist = Math.sqrt(dI * dI + dJ * dJ);
			    var sourceI = i;
			    var sourceJ = j;
			    if (dist < half) {
				sourceI = Math.round(half + dI / 2);
				sourceJ = Math.round(half + dJ / 2);
			    }
			    var destOffset = (j * size + i) * 4;
			    var sourceOffset = (sourceJ * size + sourceI) * 4;
			    destData[destOffset] = sourceData[sourceOffset];
			    destData[destOffset + 1] = sourceData[sourceOffset + 1];
			    destData[destOffset + 2] = sourceData[sourceOffset + 2];
			    destData[destOffset + 3] = sourceData[sourceOffset + 3];
			}
		    }
		    context.beginPath();
		    context.arc(centerX, centerY, half, 0, 2 * Math.PI);
		    context.lineWidth = 3 * pixelRatio;
		    context.strokeStyle = 'rgba(255,255,255,0.5)';
		    context.putImageData(dest, originX, originY);
		    context.stroke();
		    context.restore();
		});
		i3GEO.navega.lente._lenteCompose = [a];
	    }
	},
	destacaTema : {
	    inicia : function() {
		i3GEO.janela.tempoMsg("removido na versao 8");
	    }
	},
	basemapSpy : {
	    _spyCompose: "",
	    eventMouseout: function() {
		if(i3GEO.navega.basemapSpy._spyCompose != ""){
		    i3GEO.navega.basemapSpy.stop(i3geoOL.getLayerBase(),i3geoOL.getTargetElement());
		    //i3geoOL.renderSync();
		}
	    },
	    eventMouseMove: function(event) {
		if(i3GEO.navega.basemapSpy._spyCompose != ""){
		    i3geoOL.renderSync();
		}
	    },
	    stop: function(imagery,container){
		ol.Observable.unByKey(i3GEO.navega.basemapSpy._spyCompose);
		i3GEO.navega.basemapSpy._spyCompose = "";
		imagery.setZIndex(imagery.get("zIndexOriginal"));
		container.removeEventListener('mousemove', i3GEO.navega.basemapSpy.eventMouseMove);
		container.removeEventListener('mouseout', i3GEO.navega.basemapSpy.eventMouseout);
		i3geoOL.renderSync();
	    },
	    start : function(){
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.basemapSpy()");

		if(i3GEO.Interface.ATUAL != "openlayers"){
		    return;
		}
		var imagery = i3geoOL.getLayerBase();
		if(!imagery){
		    imagery = i3geoOL.getAllLayers()[0];
		}
		var container = i3geoOL.getTargetElement();
		if(i3GEO.navega.basemapSpy._spyCompose != ""){
		    i3GEO.navega.basemapSpy.stop(imagery,container);
		    return;
		}
		var radius = 75;
		imagery.set("zIndexOriginal",imagery.getZIndex());
		imagery.setZIndex(1000);

		container.addEventListener('mousemove', i3GEO.navega.basemapSpy.eventMouseMove);
		container.addEventListener('mouseout', i3GEO.navega.basemapSpy.eventMouseout);

		var a = imagery.on('precompose', function(event) {
		    var ctx = event.context;
		    var pixelRatio = event.frameState.pixelRatio;
		    ctx.save();
		    ctx.beginPath();
		    // only show a circle around the mouse
		    ctx.arc(objposicaocursor.imgx * pixelRatio, objposicaocursor.imgy * pixelRatio,
			    radius * pixelRatio, 0, 2 * Math.PI);
		    ctx.lineWidth = 5 * pixelRatio;
		    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
		    ctx.stroke();
		    ctx.clip();
		});
		var b = imagery.on('postcompose', function(event) {
		    var ctx = event.context;
		    ctx.restore();
		});
		i3GEO.navega.basemapSpy._spyCompose = [a,b];
	    }
	},
	/**
	 * Section: i3GEO.navega.dialogo
	 *
	 * Abre as telas de di&aacute;logo das op&ccedil;&otilde;es de navega&ccedil;&atilde;o no mapa atual
	 */
	dialogo : {
	    /**
	     * Function: wiki
	     *
	     * Abre a janela de di&aacute;logo da ferramenta wiki permitindo a navega&ccedil;&atilde;o integrada com a Wikip&eacute;dia
	     */
	    wiki : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.navega.dialogo.wiki()",
			"wiki",
			"wiki",
			"dependencias.php",
		"i3GEOF.wiki.start()");
	    },
	    /**
	     * Function: metar
	     *
	     * Abre a janela de di&aacute;logo da ferramenta metar permitindo a navega&ccedil;&atilde;o integrada com a rede de dados
	     * meteorol&oacute;gicos
	     */
	    metar : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.navega.dialogo.metar()",
			"metar",
			"metar",
			"dependencias.php",
		"i3GEOF.metar.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: buscaFotos
	     *
	     * Abre a janela de di&aacute;logo da ferramenta metar permitindo a navega&ccedil;&atilde;o integrada com servi&ccedil;os de
	     * armazenamento de fotografias
	     */
	    buscaFotos : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.navega.dialogo.buscaFotos()",
			"buscafotos",
			"buscaFotos",
			"dependencias.php",
			"i3GEOF.buscaFotos.iniciaJanelaFlutuante()"
		);
	    },
	    /**
	     * Function: google
	     *
	     * Abre a janela de di&aacute;logo da ferramenta google permitindo a navega&ccedil;&atilde;o integrada com o GoogleMaps
	     *
	     * Parametros:
	     *
	     * {array} - array com os pares de coordenadas x,y que ser&atilde;o adicionados ao mapa do google (opcional)
	     */
	    googlemaps : function(coordenadas) {
		i3GEO.navega.dialogo.googlemaps.coordenadas = coordenadas;
		i3GEO.util.dialogoFerramenta(
			"i3GEO.navega.dialogo.googlemaps()",
			"googlemaps",
			"googlemaps",
			"dependencias.php",
		"i3GEOF.googlemaps.start()");
	    },
	    /**
	     * Function: confluence
	     *
	     * Abre a janela de di&aacute;logo da ferramenta confluence permitindo a navega&ccedil;&atilde;o integrada com a
	     * localiza&ccedil;&atilde;o de conflu&ecirc;ncias
	     */
	    confluence : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.navega.dialogo.confluence()",
			"confluence",
			"confluence",
			"dependencias.php",
		"i3GEOF.confluence.start()");
	    }
	},
	atualizaGoogle : function(idgoogle) {
	    try {
		parent.frames[idgoogle + "i"].panTogoogle();
	    } catch (e) {
		i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEO.navega.atualizaGoogle('"+idgoogle+"')"]);
		i3GEO.desenho.removePins("googlemaps");
		i3GEO.desenho.removePins("boxOndeGoogle");
	    }
	},
	//implementado apenas para OpenLayers
	dragZoom : function(){
	    i3GEO.navega.dragZoom.draw = new ol.interaction.Draw({
		type : "Circle",
		freehand: false,
		geometryFunction: ol.interaction.Draw.createRegularPolygon(4)
	    });
	    i3GEO.navega.dragZoom.draw.setActive(false);
	    i3GEO.navega.dragZoom.draw.on("drawend",function(evt){
		var pol = evt.feature.getGeometry();
		i3geoOL.getView().fit(pol);
		i3GEO.navega.dragZoom.draw.setActive(false);
	    });
	    document.body.addEventListener('keydown', function(event) {
		if (event.keyCode == 16) {
		    i3GEO.navega.dragZoom.draw.setActive(true);
		}
	    });
	    document.body.addEventListener('keyup', function(event) {
		if (event.keyCode == 16) {
		    i3GEO.navega.dragZoom.draw.setActive(false);
		}
	    });
	    return i3GEO.navega.dragZoom.draw;
	}
};