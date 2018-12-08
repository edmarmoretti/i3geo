/**
 * Title: Eventos
 *
 * Controla as opera&ccedil;&otilde;es que s&atilde;o executadas em eventos que ocorrem no mapa.
 *
 * As listas de opera&ccedil;&otilde;es consistem em vari&aacute;veis com nomes de fun&ccedil;&otilde;es.
 *
 * As listas s&atilde;o inicializadas com algunmas fun&ccedil;&otilde;es j&aacute; pr&eacute;-definidas, mas podem ser acrescentadas outras.
 *
 * Namespace:
 *
 * i3GEO.eventos
 *
 * Exemplos:
 *
 * Para incluir uma fun&ccedil;&atilde;o em um determinado evento utilize
 *
 * i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.agrupaElementos.t0()"]);
 *
 * Para remover utilize
 *
 * i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.agrupaElementos.t0()"]);
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_eventos.js>
 */
//i3GEO.eventos.removeEventos("",[]);
/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral
 * do GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street,
 * Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
/**
 * Variavel: objposicaocursor
 *
 * Utilizada como vari&aacute;vel global para armazenar a posi&ccedil;&atilde;o do mouse
 *
 * (start code)
 *
 * objposicaocursor = { ddx : "", ddy : "", dmsx : "", dmsy : "", telax : "", telay : "", imgx : "", imgy : "", refx : "", refy : "" };
 *
 * (end)
 */
var objposicaocursor = {
	ddx : "",
	ddy : "",
	dmsx : "",
	dmsy : "",
	telax : "",
	telay : "",
	imgx : "",
	imgy : "",
	refx : "",
	refy : ""
};

i3GEO.eventos =
{
	CONTATOUCH : 0,
	MOUSEOVERDATA : [],
	MOUSEOUTDATA : [],
	/**
	 * Variavel: RESIZE
	 *
	 * Armazena as fun&ccedil;&otilde;es (eventos) que ser&atilde;o executadas quando o navegador muda de tamanho.
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	RESIZE : [],
	/**
	 * Variavel: SELECAO
	 *
	 * Armazena as fun&ccedil;&otilde;es (eventos) que ser&atilde;o executadas quando uma operação de seleção e concluida.
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	SELECAO : [],
	/**
	 * Variavel: ATUALIZAARVORECAMADAS
	 *
	 * Armazena as fun&ccedil;&otilde;es (eventos) que ser&atilde;o executadas quando a &aacute;rvore de camadas for atualizada.
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	ATUALIZAARVORECAMADAS : [],
	/**
	 * Variavel: ATIVATEMA
	 *
	 * Armazena as fun&ccedil;&otilde;es (eventos) que ser&atilde;o executadas quando um tema da &aacute;rvore de camadas &eacute;
	 * ativado.
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	ATIVATEMA : [],
	/**
	 * Variavel: NAVEGAMAPA
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando &eacute; feita uma opera&ccedil;&atilde;o de
	 * navega&ccedil;&atilde;o sobre o mapa.
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	NAVEGAMAPA : [],
	/**
	 * Variavel: MOUSEPARADO
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando o usu&aacute;rio estaciona o mouse sobre o mapa por alguns
	 * instantes.
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 */
	MOUSEPARADO : [],
	/**
	 * Variavel: MOUSEMOVE
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando o usu&aacute;rio move o mouse sobre o mapa
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	MOUSEMOVE : [],
	/**
	 * Variavel: MOUSEDOWN
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando o usu&aacute;rio pressiona o bot&atilde;o do mouse sobre o
	 * mapa
	 *
	 * Tipo:
	 *
	 * {Array}
	 */
	MOUSEDOWN : [],
	/**
	 * Variavel: MOUSEUP
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando o usu&aacute;rio solta o bot&atilde;o do mouse sobre o mapa
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *
	 * {["i3GEO.eventos.cliquePerm.executa()"]}
	 */
	MOUSEUP : ["i3GEO.eventos.cliquePerm.executa()"],
	/**
	 * Variavel: MOUSECLIQUE
	 *
	 * Armazena as fun&ccedil;&otilde;es que ser&atilde;o executadas quando o usu&aacute;rio clica sobre o mapa
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *
	 * {["i3GEO.eventos.cliqueCapturaPt()"]}
	 */
	MOUSECLIQUE : ["i3GEO.eventos.cliqueCapturaPt()"],
	/**
	 * Variavel: MOUSECLIQUEPERM
	 *
	 * Armazena as fun&ccedil;&otilde;es permanentes que ser&atilde;o executadas quando o usu&aacute;rio clica sobre o mapa
	 *
	 * As opera&ccedil;&otilde;es definidas aqui normalmente n&atilde;o fazem verifica&ccedil;&atilde;o de status de outras ferramentas
	 * e podem ser bloqueadas momentaneamente alterando-se i3GEO.eventos.cliquePerm.status
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *
	 * i3GEO.configura.funcaoTip
	 */
	MOUSECLIQUEPERM : ["i3GEO.mapa.dialogo.verificaTipDefault(xx,yy)"],
	/**
	 * Timer utilizado pelo contador do mouse parado
	 *
	 * Tipo:
	 *
	 * {Timeout}
	 */
	TIMERPARADO : "",
	/*
	 * Function: mouseOverData
	 *
	 * Indica que o mouse entrou sobre uma area de dados com UTFGRID
	 */
	mouseOverData : function() {
	    i3GEO.eventos.executaEventos(this.MOUSEOVERDATA);
	},
	/*
	 * Function: mouseOutData
	 *
	 * Indica que o mouse saiu de uma area de dados com UTFGRID
	 */
	mouseOutData : function() {
	    i3GEO.eventos.executaEventos(this.MOUSEOUTDATA);
	},
	/**
	 * Function: mouseParado
	 *
	 * Executa as fun&ccedil;&otilde;es definidas em MOUSEPARADO quando &eacute; detectado que o mouse est&aacute; estacionado.
	 *
	 * A execu&ccedil;&atilde;o desse evento &eacute; controlado por um timer definido no evento onmousemove (sobre o mapa).
	 *
	 */
	mouseParado : function() {
	    try {
		clearTimeout(this.TIMERPARADO);
	    } catch (e) {
		this.TIMERPARADO = "";
	    }
	    if (objposicaocursor.dentroDomapa === false) {
		return;
	    }
	    try {
		if (objposicaocursor.imgy === "") {
		    objposicaocursor.imgy = 1;
		    objposicaocursor.imgx = 1;
		}
		if (i3GEO.eventos.MOUSEPARADO.length > 0 && objposicaocursor.imgy > 0 && objposicaocursor.imgx > 0) {
		    if (objposicaocursor.imgx > 0) {
			i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSEPARADO);
		    }
		}
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error("i3GEO.eventos.mouseParado" + e);
	    }
	},
	/**
	 * Function: navegaMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em NAVEGAMAPA, ou seja, opera&ccedil;&otilde;es executadas quando o mapa tem sua
	 * extens&atilde;o geogr&aacute;fica alterada.
	 */
	navegaMapa : function() {
	    i3GEO.eventos.executaEventos(this.NAVEGAMAPA);
	},
	/**
	 * Function: mousemoveMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSEMOVE.
	 */
	mousemoveMapa : function() {
	    i3GEO.eventos.executaEventos(this.MOUSEMOVE);
	},
	/**
	 * Function: mousedownMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSEDOWN.
	 */
	mousedownMapa : function() {
	    i3GEO.eventos.executaEventos(this.MOUSEDOWN);
	},
	/**
	 * Function: mouseupMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSEUP.
	 */
	mouseupMapa : function(exy) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.eventos.mouseupMapa ");

	    if (!exy) {
		i3GEO.eventos.executaEventos(this.MOUSEUP);
	    } else {
		if (i3GEO.Interface.ATUAL === "googlemaps"  && exy.target && !exy.target.src) {
		    //recalcula a posicao do mouse. Necessario em dispositivos touch
		    if(i3GEOtouchesPosMapa === ""){
			i3GEOtouchesPosMapa = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA));
		    }
		    pos = i3GEOtouchesPosMapa;
		    p = new google.maps.Point(exy.clientX - pos[0],exy.clientY - pos[1]);
		    e = null;
		    lonlat = i3GeoMapOverlay.getProjection().fromContainerPixelToLatLng(p);
		    if(lonlat){
			objposicaocursor.ddx = lonlat.lng();
			objposicaocursor.ddy = lonlat.lat();
		    }
		    i3GEO.eventos.executaEventos(this.MOUSEUP);
		}
		else if (i3GEO.Interface.ATUAL === "openlayers" && exy.target && exy.target.tagName === "CANVAS"){
		    //para evitar bubble

		    i3GEO.eventos.executaEventos(this.MOUSEUP);
		}
	    }
	},
	/**
	 * Function: mousecliqueMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSECLIQUE.
	 */
	mousecliqueMapa : function() {
	    i3GEO.eventos.executaEventos(this.MOUSECLIQUE);
	},
	/**
	 * Function: resizeMapa
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSECLIQUE.
	 */
	resizeMapa : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.eventos.resizeMapa");

	    i3GEO.eventos.executaEventos(this.RESIZE);
	},
	/**
	 * Executa a pilha de nomes de funcoes ou funcoes armazenados em um array
	 *
	 * Parameter:
	 *
	 * eventos {array} - array com os nomes das fun&ccedil;&otilde;es
	 */
	executaEventos : function(eventos) {
	    if (i3GEO.Interface.STATUS.pan === true) {
		return;
	    }
	    var f = 0;
	    try {
		if (eventos.length > 0) {
		    f = eventos.length - 1;
		    if (f >= 0) {
			do {
			    if (eventos[f] !== "") {
				if (typeof (eventos[f]) === "function") {
				    eventos[f].call();
				} else {
				    var f = eventos[f];
				    f = f.replace("xx",objposicaocursor.ddx);
				    f = f.replace("yy",objposicaocursor.ddy);
				    eval(f);
				}
			    }
			} while (f--);
		    }
		}
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error("executaEventos " + eventos[f] + e);

		eventos[f] = "";
	    }
	},
	/**
	 * Function: removeEventos
	 *
	 * Remove uma lista de eventos registrados
	 *
	 * Parameters:
	 *
	 * {string} - tipo de evento (MOUSECLIQUE por exemplo)
	 *
	 * {array} - lista dos nomes dos eventos registrados
	 */
	removeEventos : function(tipo,eventos){
	    var i,n = eventos.length;
	    for(i=0;i<n;i++){
		i3GEO.eventos[tipo].remove(eventos[i]);
	    }
	    i3GEO.eventos[tipo].remove("");
	    i3GEO.eventos[tipo] = i3GEO.eventos[tipo].getUnique();
	},
	/**
	 * Function: adicionaEventos
	 *
	 * Registra uma lista de eventos
	 *
	 * Parameters:
	 *
	 * {string} - tipo de evento (MOUSECLIQUE por exemplo)
	 *
	 * {array} - lista dos nomes dos eventos
	 */
	adicionaEventos : function (tipo,eventos){
	    if(eventos == ""){
		i3GEO.eventos[tipo] = i3GEO.eventos[tipo].getUnique();
		return;
	    }
	    var i,n = eventos.length;
	    for(i=0;i<n;i++){
		i3GEO.eventos[tipo].push(eventos[i]);
	    }
	    i3GEO.eventos[tipo] = i3GEO.eventos[tipo].getUnique();
	},
	/**
	 * Captura a posi&ccedil;&atilde;o do mouse sobre um mapa. O c&aacute;lculo pode ser feito sobre o corpo do mapa principal ou sob o
	 * corpo do mapa de refer&ecirc;ncia
	 *
	 * Utilizado apenas pelo mapa de referencia
	 *
	 * O resultado dos c&aacute;lculos s&atilde;o armazenados no objeto objposicaocursor esse objeto ter&aacute; as seguintes
	 * propriedades:
	 *
	 * objposicaocursor.ddx valor de x em d&eacute;cimos de grau
	 *
	 * objposicaocursor.ddy valor de y em d&eacute;cimos de grau
	 *
	 * objposicaocursor.dmsx valor de x em dms
	 *
	 * objposicaocursor.dmsy valor de y em dms
	 *
	 * objposicaocursor.telax posicao x na tela em pixels
	 *
	 * objposicaocursor.telay posicao y na tela em pixels
	 *
	 * objposicaocursor.imgx posicao x no mapa em pixels
	 *
	 * objposicaocursor.imgy: posicao y no mapa em pixels
	 *
	 * objposicaocursor.refx: posicao x no mapa de refer&ecirc;ncia em pixels
	 *
	 * objposicaocursor.refy: posicao x no mapa de refer&ecirc;ncia em pixels
	 *
	 * Parameters:
	 *
	 * e {Event object} - objeto do tipo evento disparado sobre o objeto em foco
	 */
	posicaoMouseMapa : function(e) {
	    // Utilizado pelo mapa de referencia
	    // os eventos da interface googlemaps s&atilde;o definidos em i3GEO.Interface
	    // se a interface for googlemaps ou openlayers, os eventos s&atilde;o controlados
	    // pelas respectivas apis
	    // caso contr&aacute;rio, o i3geo ir&aacute; controlar os c&aacute;lculos
	    //
	    var teladd, teladms, container = "", targ = "", pos, mousex, mousey, xfig, yfig, xreffig, yreffig, xtela, ytela, c, ex;
	    if (!e) {
		e = window.event;
	    }
	    try {
		if (e.target) {
		    targ = e.target;
		} else if (e.srcElement) {
		    targ = e.srcElement;
		}
		if (targ.parentNode) {
		    container = targ.parentNode.id;
		}
	    } catch (erro) {
		return;
	    }
	    if (container !== "mapaReferencia") {
		return;
	    }
	    pos = i3GEO.util.pegaPosicaoObjeto(targ);
	    //
	    // pega a posicao correta do mouse
	    //
	    mousex = 0;
	    mousey = 0;
	    if (e.pageX || e.pageY) {
		mousex = e.pageX;
		mousey = e.pageY;
	    } else if (e.clientX || e.clientY) {
		mousex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		mousey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }
	    //
	    // faz os c&aacute;lculos de posicionamento
	    // fig e reffig s&atilde;o a mesma coisa por enquanto
	    //
	    xfig = mousex - pos[0];
	    yfig = mousey - pos[1];
	    xreffig = xfig;
	    yreffig = yfig;
	    xtela = mousex;
	    ytela = mousey;
	    //
	    // celula e extent s&atilde;o necess&aacute;rios para se fazer a
	    // convers&atilde;o de coordenadas de tela para coordenadas geogr&aacute;ficas
	    // esses valores s&atilde;o obtidos das fun&ccedil;&otilde;es ajax que redesenham ou inicializam o mapa
	    //
	    c = i3GEO.parametros.celularef;
	    ex = i3GEO.parametros.extentref;
	    teladd = i3GEO.calculo.tela2dd(xfig, yfig, c, ex, targ.id);
	    teladms = i3GEO.calculo.dd2dms(teladd[0], teladd[1]);

	    objposicaocursor = {
		    ddx : teladd[0],
		    ddy : teladd[1],
		    dmsx : teladms[0],
		    dmsy : teladms[1],
		    telax : xtela,
		    telay : ytela,
		    imgx : xfig,
		    imgy : yfig,
		    refx : xreffig,
		    refy : yreffig,
		    dentroDomapa : true
	    };
	},
	/**
	 * Ativa os eventos relacionados ao mapa (movimenta&ccedil;&atilde;o do mouse sobre o mapa)
	 *
	 * Define o que ser&aacute; executado quando o mouse &eacute; clicado ou movido sobre o mapa.
	 *
	 * Al&eacute;m das fun&ccedil;&otilde;es padr&atilde;o,s&atilde;o ativadas aquelas definidas nas vari&aacute;veis de
	 * configura&ccedil;&atilde;o (veja classe_configura.js)
	 *
	 * Parametro:
	 *
	 * docMapa {DOM node} - objeto que ser&aacute; alvo da ativa&ccedil;&atilde;o dos cliques
	 */
	ativa : function(docMapa) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.eventos.ativa()");

	    if (!docMapa) {
		return;
	    }

	    var timer = 0;
	    var delay = 300;
	    var prevent = false;

	    docMapa.onmouseover = function() {
		objposicaocursor.dentroDomapa = true;
		this.onmousemove = function(exy) {
		    // var executar = new Function("i3GEO.eventos.mouseParado().call");
		    // ativa o clique sobre o mapa (o evento click e desativado no evento moveend da interface
		    i3GEO.eventos.cliquePerm.status = true;
		    i3GEO.eventos.posicaoMouseMapa(exy);
		    try {
			i3GEO.eventos.mousemoveMapa();
		    } catch (e) {}
		};
	    };
	    docMapa.onmouseout = function() {
		objposicaocursor.dentroDomapa = false;
	    };
	    docMapa.onmousedown = function(exy) {
		if (typeof (console) !== 'undefined')
		    console.info("docMapa.onmousedown");

		if(objposicaocursor.dentroDomapa === false){
		    return;
		}
		i3GEO.eventos.mousedownMapa();
	    };
	    docMapa.onclick = function(exy) {
		if (typeof (console) !== 'undefined')
		    console.info("docMapa.onclick");

		if(objposicaocursor.dentroDomapa === false){
		    return;
		}
		i3GEO.eventos.mousecliqueMapa(exy);
	    };
	    docMapa.ondblclick = function (){
		if (typeof (console) !== 'undefined')
		    console.info("docMapa.ondblclick");

		if(objposicaocursor.dentroDomapa === false){
		    return;
		}
		clearTimeout(timer);
		prevent = true;
	    };
	    docMapa.onmouseup = function(exy) {
		if (typeof (console) !== 'undefined')
		    console.info("docMapa.onmouseup");

		if(objposicaocursor.dentroDomapa === false){
		    return;
		}
		if (i3GEO.Interface.ATUAL === "googlemaps") {
		    if(modoAtual === "move"){
			modoAtual = "";
			return;
		    }
		}
		i3GEO.eventos.cliquePerm.status = true;
		//i3GEO.eventos.mouseupMapa(exy);
		timer = setTimeout(function() {
		    if (!prevent) {
			i3GEO.eventos.mouseupMapa(exy);
		    }
		    prevent = false;
		}, delay);
	    };
	    docMapa.ontouchmove = function(exy) {
		i3GEO.eventos.CONTATOUCH++;
		i3GEO.Interface.STATUS.pan = true;
		i3GEO.eventos.posicaoMouseMapa(exy);
	    };
	    docMapa.ontouchcancel = function(exy) {
		i3GEO.eventos.CONTATOUCH = 0;
	    };
	},
	/**
	 * Retorna true se o bot&atilde;o da direita foi utilizado no evento do mouse
	 *
	 * Parametro:
	 *
	 * exy - evento
	 *
	 * Return: {boolean}
	 */
	botaoDireita : function(exy) {
	    try {
		var k = (navm) ? event.button : exy.button;
		if (k !== 2) {
		    return false;
		} else {
		    return true;
		}
	    } catch (e) {
		return false;
	    }
	},
	/**
	 * Captura um ponto na tela e retorna o resultado para a janela interna que estiver aberta.
	 *
	 * As coordenadas do ponto, em DMS, s&atilde;o repassadas para os campos do tipo input da janela interna que estiver aberta. A
	 * janela aberta deve ter os seguintes elementos do tipo input (ids): ixg,ixm,ixs,iyg,iym,iys
	 */
	cliqueCapturaPt : function(ixg, ixm, ixs, iyg, iym, iys) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.eventos.cliqueCapturaPt()");

	    var x, y, doc = document;
	    if (arguments.length === 0) {
		ixg = "ixg";
		ixm = "ixm";
		ixs = "ixs";
		iyg = "iyg";
		iym = "iym";
		iys = "iys";
		if ($i("wdocai")) {
		    doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
		}
	    }
	    try {
		if (doc) {
		    x = objposicaocursor.dmsx.split(" ");
		    y = objposicaocursor.dmsy.split(" ");
		    if (doc.getElementById(ixg)) {
			doc.getElementById(ixg).value = x[0];
		    }
		    if (doc.getElementById(ixm)) {
			doc.getElementById(ixm).value = x[1];
		    }
		    if (doc.getElementById(ixs)) {
			doc.getElementById(ixs).value = $.number(x[2],2,$trad("dec"),$trad("mil"));
		    }
		    if (doc.getElementById(iyg)) {
			doc.getElementById(iyg).value = y[0];
		    }
		    if (doc.getElementById(iym)) {
			doc.getElementById(iym).value = y[1];
		    }
		    if (doc.getElementById(iys)) {
			doc.getElementById(iys).value = $.number(y[2],2,$trad("dec"),$trad("mil"));
		    }
		}
	    } catch (m) {}
	},
	/**
	 * Section: i3GEO.eventos.cliquePerm
	 *
	 * Executa as fun&ccedil;&otilde;es armazenadas em MOUSECLIQUEPERM
	 *
	 * i3GEO.eventos.cliquePerm.executa &eacute; definido como um evento de clique sobre o mapa
	 *
	 * Essas s&atilde;o opera&ccedil;&otilde;es que ocorrem de forma permanente sempre que o usu&aacute;rio clica no mapa. As
	 * opera&ccedil;&otilde;es de clique devem alterar o status desse objeto para bloquear a execu&ccedil;&atilde;o quando for o caso
	 *
	 * Exemplo, pode ser necess&aacute;rio bloquear as fun&ccedil;&otilde;es permanentes quando o usu&aacute;rio clica no mapa para
	 * calcular dist&acirc;ncias, para isso, altere i3GEO.eventos.cliquePerm.status = false e depois volte para true
	 */
	cliquePerm : {
	    /**
	     * Propriedade: ativo
	     *
	     * Indica se as opera&ccedil;&otilde;es permanentes ser&atilde;o ou n&atilde;o executadas
	     *
	     * Essa propriedade bloqueia todas as opera&ccedil;&otilde;es mesmo que moment&acirc;neamente o status esteja true
	     *
	     * Type:
	     *
	     * {boolean}
	     *
	     * Default:
	     *
	     * true
	     */
	    ativo : true,
	    /**
	     *
	     * Indica se as opera&ccedil;&otilde;es permanentes ser&atilde;o ou n&atilde;o executadas se 'ativo' estiver true. Status pode
	     * ser moment&acirc;neo e controlado em tempo de execu&ccedil;&atilde;o
	     *
	     * Type: boolean
	     */
	    status : true,
	    /**
	     * Executa os eventos definidos em MOUSECLIQUEPERM
	     */
	    executa : function(evt) {
		if (i3GEO.eventos.cliquePerm.ativo === true && i3GEO.eventos.cliquePerm.status === true) {
		    i3GEO.eventos.executaEventos(i3GEO.eventos.MOUSECLIQUEPERM);
		}
	    },
	    /**
	     * Function: ativa
	     *
	     * Ativa os cliques permanentes
	     */
	    ativa : function() {
		if (i3GEO.eventos.cliquePerm.ativoinicial === true) {
		    i3GEO.eventos.cliquePerm.ativo = true;
		}
	    },
	    /**
	     * Function: desativa
	     *
	     * Desaativa momentaneamente os cliques permanentes
	     */
	    desativa : function() {
		if (i3GEO.eventos.cliquePerm.ativoinicial === true) {
		    i3GEO.eventos.cliquePerm.ativo = false;
		}
	    },
	    // uso interno, definido na criacao do mapa
	    ativoinicial : true
	}
};