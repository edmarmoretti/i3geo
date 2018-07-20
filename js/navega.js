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
		i3GEO.Interface.openlayers.OLpanel.activateControl(i3GEO.Interface.openlayers.OLpan);
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
	    a = i3GEO.parametros.mapexten,
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
		l.push(i3GEO.parametros.mapexten);
	    }
	},
	extensaoProximo : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.extensaoProximo()" + i3GEO.navega.EXTENSOES.lista.length);

	    var l = i3GEO.navega.EXTENSOES.lista,
	    r = i3GEO.navega.EXTENSOES.redo,
	    a = i3GEO.parametros.mapexten,
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
	    i3GEO.Interface[i3GEO.Interface.ATUAL].pan2ponto(x, y);
	    i3GEO.Interface[i3GEO.Interface.ATUAL].recalcPar();
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
			    i3GEO.parametros.mapexten,
			    i3GEO.parametros.pixelsize);
		i3GEO.util.criaPin("i3GeoCentroDoMapa", i3GEO.configura.locaplic + '/imagens/alvo.png', '30px', '30px');
		i3GEO.util.posicionaImagemNoMapa("i3GeoCentroDoMapa", xy[0], xy[1]);
	    }
	},
	removeCookieExtensao : function() {
	    var nomecookie = "i3geoOLUltimaExtensao";
	    if (i3GEO.Interface.openlayers.googleLike === true) {
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
	    i3GEO.php.zoomponto(i3GEO.atualiza,x,y,tamanho,simbolo,cor);
	},
	/**
	 * Function: zoompontoIMG
	 *
	 * Centraliza o mapa em um ponto de coordenadas medidas na imagem do mapa
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 *
	 * {Numeric} - coordenada x da imagem
	 *
	 * {Numeric} - coordenada y da imagem
	 */
	zoompontoIMG : function(locaplic, sid, x, y) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoompontoIMG()");

	    if (locaplic !== "") {
		i3GEO.configura.locaplic = locaplic;
	    }
	    if (sid !== "") {
		i3GEO.configura.sid = sid;
	    }
	    i3GEO.php.pan(i3GEO.atualiza, '', '', x, y);
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
	 * Localiza as coordenadas baseadas no n&uacute;mero IP do usu&aacute;rio.
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 *
	 * {Function} - fun&ccedil;&atilde;o que ser&aacute; executada ao concluir a chamada AJAX. Essa fun&ccedil;&atilde;o receber&aacute;
	 * o objeto JSON obtido.
	 */
	localizaIP : function(locaplic, sid, funcao) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.localizaIP()");

	    if (locaplic !== "") {
		i3GEO.configura.locaplic = locaplic;
	    }
	    if (sid !== "") {
		i3GEO.configura.sid = sid;
	    }
	    i3GEO.php.localizaIP(funcao);
	},
	/**
	 * Mostra no mapa um ponto baseado na localiza&ccedil;&atilde;o do usu&aacute;rio.
	 *
	 * Parametros:
	 *
	 * {String} - (opcional) endere&ccedil;o do i3geo utilizado na gera&ccedil;&atilde;o da URL para fazer a chamada AJAX
	 *
	 * {String} - (opcional) c&oacute;digo da se&ccedil;&atilde;o aberta no servidor pelo i3geo
	 */
	zoomIP : function(locaplic, sid) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.navega.zoomIP()");

	    try {
		if (arguments.length > 0) {
		    i3GEO.configura.locaplic = locaplic;
		    i3GEO.configura.sid = sid;
		}
		var mostraIP = function(retorno) {
		    if (retorno.data.latitude !== null) {
			i3GEO.navega.zoomponto(locaplic, sid, retorno.data.longitude, retorno.data.latitude);
		    } else {
			i3GEO.janela.tempoMsg("Nao foi possivel identificar a localizacao.");
		    }
		};
		i3GEO.navega.localizaIP(locaplic, sid, mostraIP);
	    } catch (e) {
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
	    // verifica se nao e necessario alterar as coordenadas
	    ext = i3GEO.util.extGeo2OSM(ext);
	    i3GEO.php.mudaext(
		    function(retorno){
			i3GEO.atualiza(retorno);
		    },
		    tipoimagem,
		    ext
	    );
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
	    if (i3GEO.Interface.ATUAL === "googlemaps") {
		i3GeoMap.setZoom(i3GEO.Interface.googlemaps.escala2nzoom(escala));
	    }
	    if (i3GEO.Interface.ATUAL === "openlayers") {
		i3geoOL.zoomToScale(escala, true);
		i3GEO.parametros.mapscale = parseInt(i3geoOL.getScale(),10);
	    }
	},
	atualizaEscalaNumerica : function(escala) {
	    var e = $i("i3GEOescalanum");
	    if (!e) {
		return;
	    }
	    if (arguments.length === 1) {
		e.value = $.number(escala,0,$trad("dec"),$trad("mil"));
	    } else {
		if (i3GEO.Interface.ATUAL === "googlemaps") {
		    e.value = parseInt(i3GEO.parametros.mapscale, 10);
		}
		if (i3GEO.Interface.ATUAL === "openlayers") {
		    e.value = $.number(i3geoOL.getScale(),0,$trad("dec"),$trad("mil"));
		}
	    }
	},
	panFixo : function() {
	    alert("panFixo foi depreciado na versao 6.0");
	},
	mostraRosaDosVentos : function() {
	    alert("mostraRosaDosVentos foi depreciado na versao 6.0");
	},
	/**
	 * Section: i3GEO.navega.autoRedesenho
	 *
	 * Controla o redesenho autom&aacute;tico do mapa por meio de um temporizador
	 */
	autoRedesenho : {
	    /**
	     * Propriedade: INTERVALO
	     *
	     * Intervalo de tempo, em milisegundos, que ser&aacute; utilizado para disparar o desenho do mapa
	     *
	     * Tipo:
	     *
	     * {Integer}
	     *
	     * Default:
	     *
	     * 0
	     */
	    INTERVALO : 0,
	    /**
	     * Guarda o valor do ID do elemento HTML que receber&aacute; o contador de tempo
	     *
	     * Tipo: {String}
	     */
	    ID : "tempoRedesenho",
	    /**
	     * Function: ativa
	     *
	     * Ativa o auto-redesenho do mapa
	     *
	     * Parametros:
	     *
	     * {String} - id do elemento onde o contador de tempo ser&aacute; mostrado no mapa. Por default, utiliza "tempoRedesenho".
	     */
	    ativa : function(id) {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.autoRedesenho.ativa()");

		if (arguments.length === 0) {
		    id = "tempoRedesenho";
		}
		i3GEO.navega.autoRedesenho.ID = id;
		if (($i(id)) && i3GEO.navega.autoRedesenho.INTERVALO > 0) {
		    $i(id).style.display = "block";
		}
		if (i3GEO.navega.autoRedesenho.INTERVALO > 0) {
		    i3GEO.navega.tempoRedesenho =
			setTimeout('i3GEO.navega.autoRedesenho.redesenha()', i3GEO.navega.autoRedesenho.INTERVALO);
		}
		if (($i(id)) && (i3GEO.navega.autoRedesenho.INTERVALO > 0)) {
		    $i(id).innerHTML = i3GEO.navega.autoRedesenho.INTERVALO / 1000;
		    i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()', 1000);
		}
	    },
	    /**
	     * Function: desativa
	     *
	     * Desativa o auto-redesenho do mapa
	     */
	    desativa : function() {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.autoRedesenho.desativa()");

		i3GEO.navega.autoRedesenho.INTERVALO = 0;
		clearTimeout(i3GEO.navega.tempoRedesenho);
		clearTimeout(i3GEO.navega.contaTempoRedesenho);
		i3GEO.navega.tempoRedesenho = "";
		i3GEO.navega.contaTempoRedesenho = "";
		if ($i(i3GEO.navega.autoRedesenho.ID)) {
		    $i(i3GEO.navega.autoRedesenho.ID).style.display = "none";
		}
	    },
	    /**
	     * Redesenha o mapa quando o contador de tempo chegar a zero
	     */
	    redesenha : function() {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.autoRedesenho.redesenha()");

		clearTimeout(i3GEO.navega.tempoRedesenho);
		clearTimeout(i3GEO.navega.contaTempoRedesenho);
		switch (i3GEO.Interface.ATUAL) {
		case "openlayers":
		    i3GEO.Interface.openlayers.atualizaMapa();
		    break;
		case "googlemaps":
		    i3GEO.Interface.googlemaps.redesenha();
		    break;
		default:
		    i3GEO.atualiza("");
		}
		i3GEO.navega.autoRedesenho.ativa(i3GEO.navega.autoRedesenho.ID);
	    },
	    /**
	     * Faz a contagem do tempo
	     */
	    contagem : function() {
		if ($i(i3GEO.navega.autoRedesenho.ID)) {
		    $i(i3GEO.navega.autoRedesenho.ID).innerHTML = parseInt($i(i3GEO.navega.autoRedesenho.ID).innerHTML, 10) - 1;
		}
		i3GEO.navega.contaTempoRedesenho = setTimeout('i3GEO.navega.autoRedesenho.contagem()', 1000);
	    }
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
		"i3GEOF.wiki.iniciaJanelaFlutuante()");
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
	    google : function(coordenadas) {
		i3GEO.navega.dialogo.google.coordenadas = coordenadas;
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.navega.dialogo.google()");

		var temp, janela, idgoogle = "googlemaps" + Math.random();
		janela = i3GEO.janela.cria(
			(i3GEO.parametros.w / 2.5) + 25 + "px",
			(i3GEO.parametros.h / 2.5) + 18 + "px",
			i3GEO.configura.locaplic
			+ "/ferramentas/googlemaps1/index.php",
			"",
			"",
			"<span class='i3GeoTituloJanelaBsNolink' >Google maps</span></div>",
			idgoogle,
			false,
			"hd",
			"",
			"",
			"",
			false,
			"",
			"",
			"",
			"",
			"68"
		);

		temp = function() {
		    i3GEO.desenho.removePins("boxOndeGoogle");
		    i3GEO.desenho.removePins("googlemaps");
		};
		$( janela[0].close ).click(temp);
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
		"i3GEOF.confluence.iniciaJanelaFlutuante()");
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
	},
	geolocal: {
	    _timer: "",
	    _delay: 500,
	    _pin: "",
	    start: function(){
		if(i3GEO.navega.geolocal._timer != ""){
		    i3GEO.navega.geolocal.stop();
		} else {
		    i3GEO.navega.geolocal.firstPoint();
		}
	    },
	    firstPoint: function(){
		var retorno = function(position) {
		    console.log(position);
		    i3GEO.navega.geolocal.showPoint(position);
		    i3GEO.navega.geolocal.createTimer();
		};
		navigator.geolocation.getCurrentPosition(retorno, i3GEO.navega.geolocal.erro);
	    },
	    createTimer: function(){
		i3GEO.navega.geolocal._timer = setInterval(function() {
		    i3GEO.navega.geolocal.movePoint();
		}, i3GEO.navega.geolocal._delay);
	    },
	    stop: function(){
		clearInterval(i3GEO.navega.geolocal._timer);
		i3GEO.navega.geolocal._timer = "";
		i3GEO.navega.geolocal.removePoint();
	    },
	    showPoint: function(position){
		var y = position.coords.latitude;
		var x = position.coords.longitude;
		i3GEO.navega.pan2ponto(x,y);
		i3GEO.navega.geolocal._pin = i3GEO.desenho.addPin(
			x,
			y,
			"",
			"",
			i3GEO.configura.locaplic + '/imagens/google/confluence.png',
		"pingeolocal");
	    },
	    movePoint: function(position){
		var retorno = function(position) {
		    var y = position.coords.latitude;
		    var x = position.coords.longitude;
		    //i3GEO.navega.pan2ponto(x,y);
		    i3GEO.desenho.movePin(i3GEO.navega.geolocal._pin,x,y)
		};
		navigator.geolocation.getCurrentPosition(retorno, i3GEO.navega.geolocal.erro);
	    },
	    removePoint: function(){
		i3GEO.desenho.removePins("pingeolocal");
	    },
	    erro : function(error) {
		i3GEO.navega.geolocal.stop();
		var erro = "";
		switch (error.code) {
		case error.PERMISSION_DENIED:
		    erro = "User denied the request for Geolocation.";
		    break;
		case error.POSITION_UNAVAILABLE:
		    erro = "Location information is unavailable.";
		    break;
		case error.TIMEOUT:
		    erro = "The request to get user location timed out.";
		    break;
		case error.UNKNOWN_ERROR:
		    erro = "An unknown error occurred.";
		    break;
		}
		i3GEO.janela.tempoMsg(erro);
	    }
	}
};