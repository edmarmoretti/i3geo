/**
 * Title: i3Geo
 *
 * A classe i3GEO possu&iacute; os m&eacute;todos de cria&ccedil;&atilde;o e
 * atualiza&ccedil;&atilde;o do mapa. Todas as subclasses s&atilde;o baseadas em
 * i3GEO, por exemplo, para criar uma janela flutuante sobre o mapa, utilize
 * i3GEO.janela.cria()
 *
 * Para inicializar o mapa, utilize i3GEO.inicia() e para atualizar o mapa,
 * utilize i3GEO.atualiza(). Ap&oacute;s terminado o processo de
 * inicializa&ccedil;&atilde;o, pode-se executar uma fun&ccedil;&atilde;o de
 * ajuste. Essa fun&ccedil;&atilde;o deve ser definida em i3GEO.finaliza, por
 * exemplo i3GEO.finaliza = "funcaoDeAjuste()" ou i3GEO.finaliza = function(){}
 *
 * Ao inicializar ou atualizar o i3Geo, &eacute; feita uma chamada em AJAX para
 * a obten&ccedil;&atilde;o dos parametros necess&aacute;rios ao funcionamento
 * do mapa. Esses parametros s&atilde;o armazenados na vari&aacute;vel
 * i3GEO.parametros
 *
 * Nessa classe est&atilde;o dispon&iacute;veis vari&aacute;veis internas
 * utilizadas em v&aacute;rias fun&ccedil;&otilde;es, como i3GEO.temaAtivo
 *
 * Namespace:
 *
 * i3GEO
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_i3geo.js>
 */
/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente
 * Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja
 * &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
/**
 * Section: i3GEOF
 *
 * Esse objeto recebe os m&eacute;todos sob demanda por meio de
 * inje&ccedil;&atilde;o de javascripts (script tag). &Eacute; utilizado pelas
 * ferramentas existentes em i3geo/ferramentas.
 *
 * Cada javascript inserido na p&aacute;gina adiciona novos objetos, como por
 * exemplo i3GEOF.buffer.
 */
var i3GEOF = [];
var i3GEOadmin = [];
/**
 * Section: YAHOO.i3GEO
 *
 * Namespace da biblioteca YUI que &eacute; reutiliz&aacute;vel em v&aacute;rios
 * trechos de c&oacute;digo do i3Geo
 *
 * Type:
 *
 * {YAHOO.namespace}
 */
if(typeof YAHOO != "undefined" ){
    YAHOO.namespace("i3GEO");
}
/**
 * Section: i3GEO
 */
var i3GEO = {
	/**
	 * Constant: tamanhodoc
	 * Largura e altura do navegador ap&oacute;s a inicializa&ccedil;&atilde;o
	 * do mapa
	 *
	 * &Eacute; utilizado como um parametro para verificar se o mapa foi ou
	 * n&atilde;o redimensionado pelo usu&aacute;rio de forma consistente
	 *
	 * Type:
	 *
	 * {array}
	 */
	tamanhodoc : [],
	/**
	 * Propriedade: parametros
	 *
	 * Parametros obtidos do mapa atual. Os parametros s&atilde;o fornecidos
	 * pelos programas PHP de redesenho e cria&ccedil;&atilde;o do mapa e
	 * atualizados sempre que o mapa &eacute; alterado.
	 *
	 * Algumas dessas vari&aacute;veis s&atilde;o definidas em ms_configura.php
	 *
	 * Exemplos:
	 *
	 * (start code)
	 * alert(i3GEO.parametros.mapexten);
	 * i3GEO.parametros.mapscale = 25000;
	 * (end)
	 *
	 * Parametros:
	 *
	 * mapexten {String} - extens&atilde;o geogr&aacute;fica do mapa no formato
	 * xmin ymin xmax ymax
	 *
	 * mapscale {Numeric} - denominador da escala do mapa
	 *
	 * mapres {Numeric} - resolu&ccedil;&atilde;o da imagem do mapa em DPI
	 *
	 * pixelsize {Numeric} - tamanho em unidades de terreno dos pixels da imagem
	 *
	 * mapfile {String} - nome do mapfile atualmente em uso
	 *
	 * cgi {String} - endere&ccedil;o do execut&aacute;vel do mapserver no
	 * servidor acess&iacute;vel pela URL
	 *
	 * extentTotal {String} - extens&atilde;o do mapa na
	 * inicializa&ccedil;&atilde;o
	 *
	 * mapimagem {String} - URL da imagem que comp&otilde;e o mapa
	 *
	 * geoip {sim|nao} - indica se o geoip est&aacute; instalado
	 *
	 *
	 * utilizacgi {sim|nao} - indica se o mapa atual est&aacute; no modo CGI
	 *
	 * versaoms {String} - vers&atilde;o do Mapserver instalado no servidor
	 * (maior)
	 *
	 * versaomscompleta {String} - vers&atilde;o do Mapserver instalado no
	 * servidor (completa)
	 *
	 * mensagens {String} - mensagens para uso no letreiro
	 *
	 * w {Integer} - largura do mapa atual
	 *
	 * h {Integer} - altura do mapa atual
	 *
	 * locsistemas {String} - endere&ccedil;o do xml com a lista de sistemas
	 * adicionais
	 *
	 * locidentifica {String} - endere&ccedil;o do xml com a lista de sistemas
	 * de identifica&ccedil;&atilde;o
	 *
	 * r {sim|nao} - indica se o software R est&aacute; instalado no servidor
	 *
	 * locmapas {String} - endere&ccedil;o do xml com a lista de mapas
	 *
	 * extentref {String} - extens&atilde;o geogr&aacute;fica do mapa de
	 * refer&ecirc;ncia
	 *
	 * celularef {Numeric} - tamanho do pixel do mapa de refer&ecirc;ncia em
	 * unidades do terreno
	 *
	 * kmlurl {String} - url de um arquivo kml que ser&aacute; inserido no mapa.
	 * V&aacute;lido apenas na interface Google Maps
	 *
	 * mensagemInicia {String} - mensagem definida em ms_configura.php indicando
	 * a vers&atilde;o atual do i3Geo.
	 *
	 * interfacePadrao {String} - interface padr&atilde;o definida em
	 * ms_configura
	 *
	 * celularef {Numeric} - tamanho da c&eacute;lula do mapa de
	 * refer&ecirc;ncia
	 *
	 * autenticadoopenid {sim|nao} - indica se o usu&aacute;rio foi autenticado
	 * em alguma rede social
	 *
	 * editor {sim|nao} - indica se o usu&aacute;rio atual &eacute; um editor
	 * (administrador)
	 *
	 * cordefundo {r,g,b}
	 *
	 * copyright {String} - texto existente no Layer copyright do mapfile de
	 * inicializa&ccedil;&atilde;o
	 *
	 * statusFerramentas {array} - indicador de status de algumas ferramentas que dependem de configura&ccedil;&otilde;es no servidor
	 */
	parametros : {
	    mapexten : "",
	    mapscale : "",
	    mapres : "",
	    pixelsize : "",
	    mapfile : "",
	    cgi : "",
	    extentTotal : "",
	    mapimagem : "",
	    geoip : "",
	    utilizacgi : "",
	    versaoms : "",
	    versaomscompleta : "",
	    mensagens : "",
	    w : "",
	    h : "",
	    locsistemas : "",
	    locidentifica : "",
	    r : "",
	    locmapas : "",
	    celularef : "",
	    kmlurl : "",
	    mensageminicia : "",
	    interfacePadrao : "openlayers.htm",
	    autenticadoopenid : "nao",
	    cordefundo : "",
	    copyright : "",
	    editor : "nao"
	},
	/**
	 * Propriedade: scrollerWidth
	 *
	 * Largura da barra de rolagem do navegador. Se for igual a "", a largura
	 * ser&aacute; calculada automaticamente.
	 *
	 * O valor "scrollerWidth" ser&aacute; utilizado no calculo da largura do
	 * mapa. Se vc n&atilde;o quer diminuir o tamanho do mapa, subtraindo a
	 * largura da barra de rolagem, defina scrollerWidth = 0
	 *
	 * Tipo:
	 *
	 * {num&eacute;rico}
	 */
	scrollerWidth : "",
	/**
	 * Propriedade: finaliza
	 *
	 * Fun&ccedil;&atilde;o que ser&aacute; executada ap&oacute;s a
	 * cria&ccedil;&atilde;o e posicionamento do mapa. Pode ser uma string
	 * tamb&eacute;m, que ser&aacute; avaliada com "eval".
	 *
	 * Exemplo:
	 *
	 * (start code)
	 *
	 * 	i3GEO.finaliza = function() {
	 * 		if ($i("i3GEOlogoMarca")) {
	 * 			$i("i3GEOlogoMarca").style.display = "none";
	 * 		}
	 * 	};
	 *
	 * (end)
	 *
	 * Tipo:
	 *
	 * {function}
	 */
	finaliza : "",
	/**
	 * Propriedade: finalizaAPI
	 *
	 * Fun&ccedil;&atilde;o que ser&aacute; executada ap&oacute;s a API
	 * utilizada (Openlayers ou Googlemaps) ter sido inicializada e o objeto com
	 * o mapa ter sido criado.
	 *
	 * Tipo:
	 *
	 * {function}
	 */
	finalizaAPI : "",

	/**
	 * Variavel: temaAtivo
	 *
	 * Indica o &uacute;ltimo tema que foi ativado no mapa
	 *
	 * Permite que ao se passar de uma ferramenta para outra, os menus reflitam
	 * a &uacute;ltima escolha.
	 *
	 * Tipo:
	 *
	 * {string}
	 */
	temaAtivo : "",
	/**
	 * Essa vari&aacute;vel &eacute; um contador utilizado para indicar quantos
	 * processos est&atilde;o ativos e que ir&atilde;o executar o redesenho do
	 * mapa. O mapa s&oacute; &eacute; atualizado quando o contador for menor
	 * que 1. Esse contador &eacute; utilizado no m&eacute;todo i3GEO.atualiza O
	 * contador &eacute; necess&aacute;rio para evitar chamadas
	 * desnecess&aacute;rias a fun&ccedil;&atilde;o de redesenho do mapa.
	 *
	 * Tipo: {string}
	 */
	contadorAtualiza : 0,
	//atalho para as funcoes cria e inicia com a possibilidade de aplicacao de parametros
	init: function(parametrosMapa,configMapa){
	    //corrige o problema da opcao de copiar para a memoria em modal
	    //veja https://github.com/zenorocha/clipboard.js/issues/388
	    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
	    if($.material){
		$.material.init();
	    }
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.init()");

	    if(configMapa && configMapa != ""){
		i3GEO.configMapa(configMapa);
	    }
	    if(parametrosMapa && parametrosMapa != ""){
		i3GEO.configura.mashuppar = i3GEO.parametrosMapa2mashuppar(parametrosMapa);
	    } else {
		i3GEO.configura.mashuppar = "";
	    }
	    i3GEO.cria();
	    i3GEO.inicia();
	},
	//
	//Muitos parametros de configuracao podem ser utilizados para controlar o funcionamento da interface
	//Essa funcao centraliza esses parametros para facilitar a customizacao
	//Os parametros sao entao aplicados nos objetos corretos
	//
	configMapa : function(c){
	    i3GEO.configura.guardaExtensao = (c.hasOwnProperty("saveExtension") && c.saveExtension == true) ? true:false;
	    i3GEO.Interface.LAYERPROGRESSBAR = (c.hasOwnProperty("layerProgressBar") && c.layerProgressBar == true) ? true:false;
	    //TODO implementar composite para versao 7 do Mapserver
	    i3GEO.configura.tipoimagem = (c.hasOwnProperty("posRenderType") && c.posRenderType != "") ? c.posRenderType:"nenhum";

	    i3GEO.configura.locaplic = (c.hasOwnProperty("i3GeoServer") && c.i3GeoServer != "") ? c.i3GeoServer:i3GEO.util.protocolo() + "://" + window.location.host + "/i3geo";
	    //
	    if(c.hasOwnProperty("tools")){
		jQuery.each( c.tools, function(index, value) {
		    i3GEO.configura.ferramentas[index] = c.tools[index];
		});
	    }
	    if(c.hasOwnProperty("layerOpacity") && c.hasOwnProperty("layerOpacity") != ""){
		i3GEO.Interface.LAYEROPACITY = c.layerOpacity;
	    }
	    i3GEO.Interface.IDCORPO = (c.hasOwnProperty("mapBody") && c.mapBody != "") ? c.mapBody:"mapai3Geo";
	    i3GEO.finalizaAPI = (c.hasOwnProperty("afterStart") && c.afterStart != "") ? c.afterStart:"";
	    if(c.hasOwnProperty("components")){
		i3GEO.Interface.RESTRICTATT = (c.components.hasOwnProperty("restrictAtt")) ? c.components.restrictAtt : true;
		i3GEO.arvoreDeTemas.IDSMENUS = (c.components.hasOwnProperty("idsMenus")) ? c.components.idsMenus : [];
		i3GEO.catalogoMenus.IDSMENUS = (c.components.hasOwnProperty("idsMenus")) ? c.components.idsMenus : [];
		i3GEO.busca.SERVICO = (c.components.hasOwnProperty("searchService")) ? c.components.searchService : "";
		i3GEO.busca.SERVICOWMS = (c.components.hasOwnProperty("searchWms")) ? c.components.searchWms : "";
		i3GEO.mapa.BALAOATIVO = (c.components.hasOwnProperty("info")) ? c.components.info : true;
		//i3GEO.mapa.INFOTEMPLATE = (c.components.hasOwnProperty("infoTemplate") && c.components.infoTemplate != "") ? c.components.infoTemplate : i3GEO.configura.locaplic + i3GEO.mapa.INFOTEMPLATE;
		if(c.components.referenceMapPosition){
		    i3GEO.maparef.TOP = c.components.referenceMapPosition[0];
		    i3GEO.maparef.RIGHT = c.components.referenceMapPosition[1];
		}
		if(c.components.referenceType){
		    i3GEO.maparef.DEFAULTMAP = c.components.referenceType;
		}
		/*
		if(c.components.scrollBar){
		    i3GEO.janela.scrollBar = c.components.scrollBar;
		}
		*/
		if(c.components.tooltip){
		    var p = i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP;
		    p.removeAoAdicionar = (c.components.tooltip.hasOwnProperty("removeAoAdicionar")) ? c.components.tooltip.removeAoAdicionar : true;
		    p.autoPan = (c.components.tooltip.hasOwnProperty("autoPan")) ? c.components.tooltip.autoPan : true;
		    p.modal = (c.components.tooltip.hasOwnProperty("modal")) ? c.components.tooltip.modal : false;
		    p.url = (c.components.tooltip.hasOwnProperty("url")) ? c.components.tooltip.url : "";
		    p.templateModal = (c.components.tooltip.hasOwnProperty("templateModal")) ? c.components.tooltip.templateModal : "";
		    p.simple = (c.components.tooltip.hasOwnProperty("simple")) ? c.components.tooltip.simple : true;
		    p.minWidth = (c.components.tooltip.hasOwnProperty("minWidth")) ? c.components.tooltip.minWidth : '';
		    p.url = (c.components.tooltip.hasOwnProperty("url")) ? c.components.tooltip.url : '200px';
		    p.autoPanAnimation = (c.components.tooltip.hasOwnProperty("autoPanAnimation")) ? c.components.tooltip.autoPanAnimation : p.autoPanAnimation;
		    if(c.components.tooltip.hasOwnProperty("toolTipSize")){
			i3GEO.configura.alturatip = c.components.tooltip.toolTipSize[0];
			i3GEO.configura.larguratip = c.components.tooltip.toolTipSize[1];
		    }
		    p.openTipNoData = (c.components.tooltip.hasOwnProperty("openTipNoData")) ? c.components.tooltip.openTipNoData : true;
		}
	    }
	    if(c.hasOwnProperty("openLayers") && c.mapType !== "GM" ){
		var d = c.openLayers;
		i3GEO.Interface.ATUAL = "openlayers";
		i3GEO.Interface.openlayers.googleLike = (c.mapType == "OSM") ? true:false;
		//TODO singletile nao funciona
		i3GEO.Interface.openlayers.TILES = (d.hasOwnProperty("singleTile") && d.singleTile != "") ? !d.singleTile:true;
		i3GEO.Interface.openlayers.parametrosMap = d.MapOptions;
		i3GEO.Interface.openlayers.parametrosView = d.ViewOptions;
	    }
	    if(c.hasOwnProperty("googleMaps") && c.mapType == "GM"){
		i3GEO.Interface.ATUAL = "googlemaps";
		i3GEO.Interface.googlemaps.ESTILOPADRAO = c.googleMaps.MapOptions.mapTypeId;
		i3GEO.Interface.googlemaps.MAPOPTIONS = c.googleMaps.MapOptions;
	    }
	},
	//
	//mashuppar e um parametro antigo usado no i3geo para alterar o mapa de inicializacao
	//os parametros utilizados sao os mesmos disponiveis em ms_criamapa.php
	//na versao 7 os nomes dos parametros foram modificados para facilitar seu uso
	//essa funcao faz a conversao dessa nova nomenclatura para poder compatibilizar com a sintaxe utilizada em mashuppar
	//
	parametrosMapa2mashuppar: function(p){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.parametrosMapa2mashuppar()");

	    var par = [],temp;
	    if(p.hasOwnProperty("mapfilebase") && p.mapfilebase != ""){
		par.push("&base="+p.mapfilebase);
	    }
	    if(p.hasOwnProperty("mapext") && p.mapext != "" && p.mapext.length == 4){
		par.push("&mapext="+p.mapext.join(","));
		i3GEO.configura.guardaExtensao = false;
	    }
	    if(p.hasOwnProperty("perfil") && p.perfil != ""){
		par.push("&perfil="+p.perfil);
	    }
	    if(p.hasOwnProperty("layers")){
		if(p.layers.add && p.layers.add.length > 0){
		    par.push("&temasa="+p.layers.add.join(","));
		}
		if(p.layers.on && p.layers.on.length > 0){
		    par.push("&layers="+p.layers.on.join(","));
		}
		if(p.layers.off && p.layers.off.length > 0){
		    par.push("&desligar="+p.layers.off.join(","));
		}
		if(p.layers.metaestat && p.layers.metaestat.length > 0){
		    par.push("&metaestatids="+p.layers.metaestat.join(","));
		}
	    }
	    if(p.hasOwnProperty("points") && p.points.coord.length > 0){
		par.push("&nometemapontos="+p.points.title);
		par.push("&pontos="+p.points.coord.join(","));
	    }
	    if(p.hasOwnProperty("cacheOff") && p.cacheOff == "sim"){
		par.push("&DESLIGACACHE=sim");
	    }
	    if(p.hasOwnProperty("lines")){
		var n = [];
		jQuery.each( p.lines.coord, function(index, value) {
		    if(value.length > 0){
			n.push(value.join(" "));
		    }
		});
		if(n.length > 0){
		    par.push("&nometemalinhas="+p.lines.title);
		    par.push("&linhas="+n.join(","));
		}
	    }
	    if(p.hasOwnProperty("polygons")){
		var n = [];
		jQuery.each( p.polygons.coord, function(index, value) {
		    if(value.length > 0){
			n.push(value.join(" "));
		    }
		});
		if(n.length > 0){
		    par.push("&nometemapoligonos="+p.polygons.title);
		    par.push("&poligonos="+n.join(","));
		}
	    }
	    if(p.hasOwnProperty("wkt") && p.wkt.coord != ""){
		par.push("&nometemawkt="+p.wkt.title);
		par.push("&wkt="+p.wkt.coord);
	    }
	    if(p.hasOwnProperty("symbol")){
		if(p.symbol.name != ""){
		    par.push("&simbolo="+p.symbol.name);
		}
		if(p.symbol.color != ""){
		    par.push("&corsimbolo="+p.symbol.color);
		}
		if(p.symbol.size != ""){
		    par.push("&tamanhosimbolo="+p.symbol.size);
		}
	    }
	    if(p.kml && p.kml.url != ""){
		par.push("&kmlurl="+p.kml.url);
	    }
	    if(p.hasOwnProperty("wms") && p.wms.url != ""){
		if(p.wms.url != ""){
		    par.push("&url_wms="+p.wms.url);
		}
		if(p.wms.layer != ""){
		    par.push("&layer_wms="+p.wms.layer);
		}
		if(p.wms.style != ""){
		    par.push("&style_wms="+p.wms.style);
		}
		if(p.wms.title != ""){
		    par.push("&nome_wms="+p.wms.title);
		}
		if(p.wms.srs != ""){
		    par.push("&srs_wms="+p.wms.srs);
		}
		if(p.wms.imagetype != ""){
		    par.push("&image_wms="+p.wms.imagetype);
		}
		if(p.wms.version != ""){
		    par.push("&versao_wms="+p.wms.version);
		}
	    }
	    if(p.hasOwnProperty("filters")){
		var n = [];
		jQuery.each( p.filters, function(index, value) {
		    if(value.layer != ""){
			n.push("&map_layer_" + value.layer + "_filter=" + value.expression);
		    }
		});
		if(n.length > 0){
		    par.push(n.join(""));
		}
	    }
	    if(p.hasOwnProperty("restoreMapId") && p.restoreMapId != ""){
		par.push("&restauramapa="+p.restoreMapId);
	    }

	    temp = $i(i3GEO.Interface.IDCORPO);
	    if(temp && temp.style && temp.style.width){
		par.push("&largura="+parseInt(temp.style.width,10));
	    }
	    if(temp && temp.style && temp.style.height){
		par.push("&altura="+parseInt(temp.style.height,10));
	    }

	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.parametrosMapa2mashuppar() " + par.join(""));

	    return par.join("");
	},
	/**
	 * Function: cria
	 *
	 * Cria e configura a visualiza&ccedil;&atilde;o do mapa, definindo
	 * posicionamentos, tamanho etc
	 *
	 * Ap&oacute;s as defini&ccedil;&otilde;es b&aacute;sicas, &eacute;
	 * executado o programa <i3GEO.Interface.cria> que ir&aacute; realizar as
	 * opera&ccedil;&otilde;es conforme a interface atualmente em uso. A
	 * interface &eacute; definida em <i3GEO.Interface.ATUAL>
	 */
	cria : function() {
	    //calcula a largura da barra de rolagem para adicionar ao tamanho do mapa
	    i3GEO.scrollerWidth = i3GEO.util.getScrollerWidth();
	    var tamanho, temp;
	    temp = window.location.href.split("?&");
	    if (temp[1]) {
		temp = temp[1].split("&");
		if (temp[0] && temp[0] != "" && temp.length == 1) {
		    i3GEO.configura.sid = temp[0];
		    //
		    // O # precisa ser removido, caso contrario, a opcao de reload
		    // da
		    // pagina pelo browser as vezes nao funciona
		    //
		    if (i3GEO.configura.sid.split("#")[0]) {
			i3GEO.configura.sid = i3GEO.configura.sid.split("#")[0];
		    }
		}
	    } else {
		i3GEO.configura.sid = "";
	    }
	    if (i3GEO.configura.sid === 'undefined') {
		i3GEO.configura.sid = "";
	    }
	    i3GEO.mapa.aplicaPreferencias();
	    //
	    // tenta definir automaticamente a variavel que indica a localizacao do
	    // i3geo
	    //
	    if (!i3GEO.configura.locaplic
		    || i3GEO.configura.locaplic === "") {
		i3GEO.util.localizai3GEO();
	    }
	    //para permitir o uso de {{{locaplic}}} em templates
	    i3GEO.idioma.OBJETOIDIOMA.locaplic = i3GEO.configura.locaplic;
	    $('[data-traduzir="true"]').each(function(){
		this.innerHTML = Mustache.to_html(
			this.innerHTML,
			i3GEO.idioma.OBJETOIDIOMA
		);
	    });
	    //
	    // calcula o tamanho do mapa
	    //

	    temp = $i(i3GEO.Interface.IDCORPO);
	    if (temp && temp.style && temp.style.width && temp.style.height) {
		i3GEO.Interface.cria(
			parseInt(temp.style.width,10),
			parseInt(temp.style.height,10)
		);

	    } else {
		tamanho = i3GEO.calculaTamanho();
		i3GEO.Interface.cria(
			tamanho[0],
			tamanho[1]
		);
	    }
	},
	/**
	 * Function: inicia
	 *
	 * Inicializa o mapa
	 *
	 * Verifica se o mapa apresenta algum problema no processamento no lado do
	 * servidor e realiza as opera&ccedil;&otilde;es de tentativa de
	 * recupera&ccedil;&atilde;o, se for o caso
	 *
	 * No in&iacute;cio do processo &eacute; executada a fun&ccedil;&atilde;o
	 * <i3GEOmantemCompatibilidade> para realizar as opera&ccedil;&otilde;es
	 * necess&aacute;rias de manuten&ccedil;&atilde;o de compatibilidade da
	 * vers&atilde;o atual para as anteriores
	 *
	 * A inicializa&ccedil;&atilde;o &eacute; baseada em <i3GEO.php.inicia> cujo
	 * retorno &eacute; utilizado para definir a vari&aacute;vel
	 * <i3GEO.parametros>
	 *
	 * Ap&oacute;s a inicializa&ccedil;&atilde;o &eacute; executado
	 * <i3GEO.Interface.inicia>
	 */
	inicia : function(retorno) {
	    // define o valor inicial da variavel que controla as etiquetas quando o
	    // usuario clica no mapa
	    i3GEO.eventos.cliquePerm.ativoinicial = i3GEO.eventos.cliquePerm.ativo;
	    var montaMapa, mashup, tamanho, temp;
	    i3GEO.mapa.aplicaPreferencias();
	    montaMapa = function(retorno) {
		try {
		    delete i3GEO.parametrosMapa2mashuppar;
		    delete i3GEO.configMapa;
		    delete i3GEO.init;
		    var temp, nomecookie = "i3geoOLUltimaExtensao", preferencias = "";
		    // verifica se existe bloqueio em funcao da senha no
		    // ms_configura.php
		    if (retorno.bloqueado) {
			alert(retorno.bloqueado);
			return;
		    }
		    if (retorno === "") {
			alert("Ocorreu um erro no mapa - i3GEO.inicia.montaMapa");
			retorno = {
				data : {
				    erro : "erro"
				}
			};
		    }
		    if (retorno.data.erro) {
			// i3GEO.janela.fechaAguarde("montaMapa");
			document.body.style.backgroundColor = "white";
			document.body.innerHTML = "Ocorreu um erro ao criar o mapa";
			return ("linkquebrado");
		    } else {
			if (retorno.data.variaveis) {
			    i3GEO.parametros = retorno.data.variaveis;
			    //
			    // converte string em n&uacute;mero
			    //
			    i3GEO.parametros.mapscale = i3GEO.parametros.mapscale * 1;
			    i3GEO.parametros.mapres = i3GEO.parametros.mapres * 1;
			    i3GEO.parametros.pixelsize = i3GEO.parametros.pixelsize * 1;
			    i3GEO.parametros.w = i3GEO.parametros.w * 1;
			    i3GEO.parametros.h = i3GEO.parametros.h * 1;
			    //
			    // obtem os parametros que foram armazenados ao salvar o
			    // mapa
			    // caso o mapa atual tenha sido recuperado do banco de
			    // dados
			    // os parametros sao armazenados em base64 no objeto
			    // metadata do mapfile
			    //
			    if (retorno.data.customizacoesinit) {
				preferencias = JSON.parse(retorno.data.customizacoesinit);
				temp = i3GEO.util.base64decode(preferencias.preferenciasbase64);
				i3GEO.mapa.aplicaPreferencias(temp);
			    }
			    // obtem o cookie com a ultima extensao geografica
			    if (i3GEO.configura.guardaExtensao === true) {
				if (i3GEO.Interface.openlayers.googleLike === true) {
				    nomecookie = "i3geoUltima_ExtensaoOSM";
				}
				temp = i3GEO.util.pegaCookie(nomecookie);
				if (temp
					&& temp != "") {
				    temp = temp.replace(
					    /[\+]/g,
				    " ");
				    i3GEO.parametros.mapexten = temp;
				}
				i3GEO.eventos.NAVEGAMAPA.push(function() {
				    i3GEO.util.insereCookie(
					    nomecookie,
					    i3GEO.parametros.mapexten);
				});
			    }
			    // anula os cookies de login se for necessario
			    // o servidor verifica se na sessao o login esta ativo
			    if (i3GEO.parametros.logado === "nao") {
				i3GEO.login.anulaCookie();
			    }

			    i3GEO.arvoreDeCamadas.registaCamadas(retorno.data.temas);
			    i3GEO.Interface.inicia();
			    //
			    // obtem os parametros que foram armazenados ao salvar o
			    // mapa
			    // caso o mapa atual tenha sido recuperado do banco de
			    // dados
			    //
			    //TODO refazer essas funcionalidades
			    if (retorno.data.customizacoesinit) {
				// recupera os layers graficos
				if (preferencias.geometriasbase64
					&& preferencias.geometriasbase64 != "") {
				    temp = i3GEO.util.base64decode(preferencias.geometriasbase64);
				    i3GEO.mapa.desCompactaLayerGrafico(temp);
				}
				// recupera os graficos
				if (preferencias.graficosbase64
					&& preferencias.graficosbase64 != "") {
				    i3GEO.mapa.restauraGraficos(preferencias.graficosbase64);
				}
				// recupera as tabelas
				if (preferencias.tabelasbase64
					&& preferencias.tabelasbase64 != "") {
				    i3GEO.mapa.restauraTabelas(preferencias.tabelasbase64);
				}
			    }
			} else {
			    alert("Erro. Impossivel criar o mapa "
				    + retorno.data);
			    return;
			}
		    }
		    i3GEO.aposIniciar();
		} catch (e) {
		    if (typeof (console) !== 'undefined')
			console.error(e.message)

		}
	    };
	    if (!$i("i3geo")) {

		document.body.id = "i3geo";
	    }
	    temp = $i("i3geo");
	    temp.className = "yui-skin-sam";
	    //previne que o tooltip balao crie barras de overflow
	    if(document.body.id === "i3geo" && temp.style && !temp.style.overflow && i3GEO.Interface.ATUAL === "openlayers"){
		temp.style.overflow = "hidden";
	    }
	    //
	    // se i3GEO.configura.sid = "", o html foi aberto diretamente
	    // ent&atilde;o, &eacute; necess&aacute;rio criar os arquivos
	    // tempor&aacute;rios do mapa
	    // essa opera&ccedil;&atilde;o deve ser ass&iacute;ncrona
	    //
	    if (i3GEO.configura.sid === "") {
		mashup = function(retorno) {
		    // verifica se existe bloqueio em funcao da senha no
		    // ms_configura.php
		    if (retorno.bloqueado) {
			alert(retorno.bloqueado);
			return;
		    }
		    i3GEO.configura.sid = retorno.data;
		    i3GEO.inicia(retorno);
		};
		i3GEO.configura.mashuppar += "&interface="
		    + i3GEO.Interface.ATUAL;
		// acrescenta camadas iniciais
		if (i3GEO.mapa.TEMASINICIAIS.length > 0) {
		    i3GEO.configura.mashuppar += "&temasa="
			+ i3GEO.mapa.TEMASINICIAIS;
		}
		if (i3GEO.mapa.TEMASINICIAISLIGADOS.length > 0) {
		    i3GEO.configura.mashuppar += "&layers="
			+ i3GEO.mapa.TEMASINICIAISLIGADOS;
		}

		i3GEO.php.criamapa(
			mashup,
			i3GEO.configura.mashuppar);
	    } else {
		if (i3GEO.parametros.w === ""
		    || i3GEO.parametros.h === "") {
		    tamanho = i3GEO.calculaTamanho();
		    i3GEO.parametros.w = tamanho[0];
		    i3GEO.parametros.h = tamanho[1];
		}
		i3GEO.php.inicia(
			montaMapa,
			i3GEO.parametros.w,
			i3GEO.parametros.h);
	    }
	    //i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.janela.fechaAguarde()","i3GEO.navega.atualizaEscalaNumerica()"]);
	},
	/**
	 * Executa opera&ccedil;&otilde;es ap&oacute;s o mapa ter sido posicionado
	 * na tela
	 *
	 * Executa tamb&eacute;m o que for definido em i3Geo.finaliza
	 */
	aposIniciar : function() {
	    if (jQuery.isFunction(i3GEO.finaliza)) {
		i3GEO.finaliza.call();
	    } else {
		if (i3GEO.finaliza != "") {
		    eval(i3GEO.finaliza);
		}
	    }
	    i3GEO.guias.inicia();
	    //i3GEO.mapa.ativaAutoResize();
	},
	/**
	 * Function: atualiza
	 *
	 * Atualiza o mapa atual, altera a imagem do mapa os gadgets ativos e os
	 * parametros e verifica a integridade do mapa em uso (arquivo mapfile)
	 *
	 * O processo executa tamb&eacute;m a fun&ccedil;&atilde;o de
	 * atualiza&ccedil;&atilde;o espec&iacute;fica da interface atual em uso,
	 * veja <i3GEO.Interface.redesenha>
	 *
	 * Os seguintes gadgets s&atilde;o processados
	 *
	 * <i3GEO.arvoreDeCamadas.atualiza>
	 *
	 * <i3GEO.arvoreDeCamadas.atualizaFarol>
	 *
	 * Os eventos definidos em <i3GEO.eventos.navegaMapa> s&atilde;o executados
	 *
	 * Parametro:
	 *
	 * {Objeto} - parametros do novo mapa. Se retorno
	 * n&atilde;o for especificado ou se for vazio, ser&aacute; feita uma
	 * chamada em ajax para sua obten&ccedil;&atilde;o. O resultado dessa
	 * chamada &eacute; armazenada em i3GEO.parametros
	 */
	atualiza : function(retorno) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.atualiza()");

	    var corpoMapa, erro, mapscale, temp;
	    if (i3GEO.contadorAtualiza > 1) {
		i3GEO.contadorAtualiza--;
		return;
	    }
	    if (i3GEO.contadorAtualiza > 0) {
		i3GEO.contadorAtualiza--;
	    }
	    i3GEO.contadorAtualiza++;
	    //
	    // funcao que pega os dados do mapa no servidor
	    //
	    corpoMapa = function() {
		if ($i("ajaxCorpoMapa")) {
		    return;
		}
		i3GEO.php.corpo(
			i3GEO.atualiza,
			i3GEO.configura.tipoimagem);
	    };
	    //
	    // se retorno n&atilde;o tiver sido definido, busca os dados no servidor
	    // e chama novamente a fun&ccedil;&atilde;o atualiza
	    //
	    if (arguments.length === 0) {
		i3GEO.janela.fechaAguarde("ajaxCorpoMapa");
		corpoMapa.call();
		return;
	    }
	    //
	    // igual a anterior para efeitos de compatibilidade com outras
	    // vers&otilde;es do i3geo
	    //
	    //if (retorno === "") {
	    //	corpoMapa.call();
	    //	return;
	    //}
	    //
	    // se retorno.data n&atilde;o existir, &eacute; pq ocorreu um erro
	    //
	    if (!retorno.data) {
		alert("Ocorreu um erro ao carregar o mapa" + retorno);
		i3GEO.mapa.recupera.inicia();
		// corpoMapa.call();
		return;
	    }
	    // verifica se o parametro retorno existe, caso contr&aacute;rio,
	    // faz a chamada ao programa PHP para obter os parametros
	    try {
		if (retorno.data === "erro") {
		    alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");
		    i3GEO.mapa.recupera.inicia();
		    return;
		} else if (retorno.data === "ok"
		    || retorno.data === "") {
		    corpoMapa.call();
		    return;
		}
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

	    }
	    erro = function() {
		var c = confirm("Ocorreu um erro, quer tentar novamente?");
		if (c) {
		    corpoMapa.call();
		} else {
		    i3GEO.janela.fechaAguarde();
		}
		return;
	    };
	    //
	    // atualiza as vari&aacute;veis
	    //
	    if (arguments.length === 0
		    || retorno === ""
			|| retorno.data.variaveis === undefined) {
		erro.call();
		return;
	    } else {
		//
		// se deu tudo certo, pega os valores do retorno e seta as
		// vari&aacute;veis do mapa
		//
		if (arguments.length === 0) {
		    return;
		}
		i3GEO.mapa.verifica(retorno);
		mapscale = i3GEO.parametros.mapscale;
		i3GEO.atualizaParametros(retorno.data.variaveis);

		if (retorno.data.variaveis.erro !== "") {
		    alert(retorno.data.variaveis.erro);
		}
		//
		// o try aqui &eacute; necess&aacute;rio pois na interface
		// googlemaps os parametros retorno.data.variaveis n&atilde;o
		// s&atilde;o gerados completamente
		//
		temp = i3GEO.arvoreDeCamadas.converteChaveValor2normal(retorno.data.temas);
		try {
		    i3GEO.arvoreDeCamadas.atualiza(temp);
		    if (i3GEO.parametros.mapscale !== mapscale) {
			i3GEO.arvoreDeCamadas.atualizaFarol(i3GEO.parametros.mapscale);
		    }
		} catch (e) {
		    if (typeof (console) !== 'undefined')
			console.error(e.message)
		}
		i3GEO.arvoreDeCamadas.registaCamadas(temp);
		// nesse ponto o layer sera adicionado ao mapa
		i3GEO.Interface.redesenha();
		if ($i("mensagemt")) {
		    $i("mensagemt").value = i3GEO.parametros.mapexten;
		}
		i3GEO.eventos.navegaMapa();
		//
		// verifica se deve ser feito o zoom em algum tema
		//
		temp = i3GEO.arvoreDeCamadas.verificaAplicaExtensao();
		if (temp !== "") {
		    i3GEO.tema.zoom(temp);
		}
	    }
	},
	/**
	 * Calcula o tamanho do mapa atual e define alguns elementos HTML do mapa
	 *
	 * Return: {array} - [w,h]
	 */
	calculaTamanho : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.calculaTamanho()");

	    var diminuix, diminuiy, menos, novow, novoh, w, h, temp, antigoh = i3GEO.parametros.h;

	    temp = $i(i3GEO.Interface.IDCORPO);

	    if(temp && temp.style && temp.style.width && temp.style.height && parseInt(temp.style.height,10) > 100){
		i3GEO.parametros.w = parseInt(temp.style.width,10);
		i3GEO.parametros.h = parseInt(temp.style.height,10);
		return [
		    i3GEO.parametros.w,
		    i3GEO.parametros.h
		    ];
	    }

	    menos = 0;
	    document.body.style.width = "100%";
	    temp = i3GEO.util.tamanhoBrowser();
	    novow = temp[0];
	    novoh = temp[1];
	    temp = (antigoh - novoh);

	    document.body.style.height = novoh
	    + "px";

	    w = novow
	    - menos + i3GEO.scrollerWidth;
	    h = novoh;

	    i3GEO.parametros.w = w;
	    i3GEO.parametros.h = h;
	    return [
		w,
		h
		];
	},
	/**
	 * Recalcula o tamanho do mapa com base nas configura&ccedil;&otilde;es do
	 * navegador
	 *
	 * Return: {array} - [w,h]
	 */
	reCalculaTamanho : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.reCalculaTamanho()");

	    var diminuix, diminuiy, menos, novow, novoh, w, h, temp, antigoh = i3GEO.parametros.h;
	    temp = $i(i3GEO.Interface.IDCORPO);
	    /*
		if(temp && temp.style && temp.style.width && temp.style.height){
			i3GEO.parametros.w = parseInt(temp.style.width,10);
			i3GEO.parametros.h = parseInt(temp.style.height,10);
			i3GEO.eventos.resizeMapa();
			return [
				i3GEO.parametros.w,
				i3GEO.parametros.h
			];
		}
	     */
	    menos = 0;
	    document.body.style.width = "100%";
	    temp = i3GEO.util.tamanhoBrowser();
	    novow = temp[0];
	    novoh = temp[1];
	    temp = antigoh - novoh;

	    document.body.style.height = novoh
	    + "px";
	    w = novow
	    - menos + i3GEO.scrollerWidth;
	    h = novoh;

	    temp = $i(i3GEO.Interface.IDMAPA);
	    if (temp) {
		temp.style.height = h
		+ "px";
		temp.style.width = w
		+ "px";
	    }

	    i3GEO.parametros.w = w;
	    i3GEO.parametros.h = h;
	    temp = function() {
		switch (i3GEO.Interface.ATUAL) {
		case "googlemaps":
		    i3GEO.Interface.googlemaps.zoom2extent(i3GEO.parametros.mapexten);
		    break;
		case "openlayers":
		    i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);
		    i3geoOL.updateSize();

		    break;
		};
		i3GEO.guias.ALTURACORPOGUIAS = h;
		i3GEO.eventos.resizeMapa();
		return [
		    w,
		    h
		    ];
	    };
	    i3GEO.php.mudatamanho(
		    temp,
		    h,
		    w);
	},
	/**
	 * Atualiza os valores da vari&aacute;vel i3GEO.parametros
	 *
	 * Parametro:
	 *
	 * variaveis {obj} - objeto JSON com os valores. Tipicamente &eacute; obtido
	 * do servidor por meio de uma chamada AJAX
	 */
	atualizaParametros : function(variaveis) {
	    i3GEO.parametros.mapscale = variaveis.mapscale * 1;
	    i3GEO.parametros.mapres = variaveis.mapres * 1;
	    i3GEO.parametros.pixelsize = variaveis.pixelsize * 1;
	    i3GEO.parametros.mapexten = variaveis.mapexten;// variaveis.mapexten;
	    i3GEO.parametros.mapimagem = variaveis.mapimagem;
	    i3GEO.parametros.w = variaveis.w * 1;
	    i3GEO.parametros.h = variaveis.h * 1;
	    i3GEO.parametros.mappath = variaveis.mappath;
	    i3GEO.parametros.mapurl = variaveis.mapurl;
	    if (i3GEO.login.verificaCookieLogin()) {
		i3GEO.parametros.editor = "sim";
	    } else {
		i3GEO.parametros.editor = "nao";
	    }
	}
};
