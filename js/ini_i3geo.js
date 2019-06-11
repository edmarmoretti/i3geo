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
         * que 1. Esse contador &eacute; utilizado no m&eacute;todo i3GEO.mapa.refresh O
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
                if(c.components.tooltip){
                    var p = i3GEO.Interface.BALAOPROP;
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
                i3GEO.Interface.googleLike = (c.mapType == "OSM") ? true:false;
                //TODO singletile nao funciona
                i3GEO.Interface.TILES = (d.hasOwnProperty("singleTile") && d.singleTile != "") ? !d.singleTile:true;
                i3GEO.Interface.parametrosMap = d.MapOptions;
                i3GEO.Interface.parametrosView = d.ViewOptions;
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
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.cria()");
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
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.inicia()");
            // define o valor inicial da variavel que controla as etiquetas quando o
            // usuario clica no mapa
            i3GEO.eventos.cliquePerm.ativoinicial = i3GEO.eventos.cliquePerm.ativo;
            var montaMapa, mashup, tamanho, temp;
            i3GEO.mapa.aplicaPreferencias();
            montaMapa = function(data) {
                if (typeof (console) !== 'undefined')
                    console.info("i3GEO.inicia() montamapa");
                //try {
                    delete i3GEO.parametrosMapa2mashuppar;
                    delete i3GEO.configMapa;
                    delete i3GEO.init;
                    var temp, nomecookie = "i3geoOLUltimaExtensao", preferencias = "";
                    // verifica se existe bloqueio em funcao da senha no
                    // ms_configura.php
                    if (data.bloqueado) {
                        alert(data.bloqueado);
                        return;
                    }
                    if (data === "") {
                        alert("Ocorreu um erro no mapa - i3GEO.inicia.montaMapa");
                        data = {
                                erro : "erro"
                        };
                    }
                    if (data.erro) {
                        // i3GEO.janela.fechaAguarde("montaMapa");
                        document.body.style.backgroundColor = "white";
                        document.body.innerHTML = "Ocorreu um erro ao criar o mapa";
                        return ("linkquebrado");
                    } else {
                        if (data.variaveis) {
                            i3GEO.parametros = data.variaveis;
                            //
                            // converte string em n&uacute;mero
                            //
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
                            if (data.customizacoesinit) {
                                preferencias = JSON.parse(data.customizacoesinit);
                                temp = i3GEO.util.base64decode(preferencias.preferenciasbase64);
                                //i3GEO.mapa.aplicaPreferencias(temp);
                            }
                            // obtem o cookie com a ultima extensao geografica
                            if (i3GEO.configura.guardaExtensao === true) {
                                if (i3GEO.Interface.googleLike === true) {
                                    nomecookie = "i3geoUltima_ExtensaoOSM";
                                }
                                temp = i3GEO.util.pegaCookie(nomecookie);
                                if (temp && temp != "") {
                                    temp = temp.replace(/[\+]/g," ");
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
                            i3GEO.arvoreDeCamadas.registaCamadas(data.temas);
                            i3GEO.Interface.inicia();
                            //
                            // obtem os parametros que foram armazenados ao salvar o
                            // mapa
                            // caso o mapa atual tenha sido recuperado do banco de
                            // dados
                            //
                            //TODO refazer essas funcionalidades
                            if (data.customizacoesinit) {
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
                                    + data);
                            return;
                        }
                    }
                    i3GEO.aposIniciar();
                //} catch (e) {
                //    if (typeof (console) !== 'undefined')
                //        console.error(e.message)
               // }
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
                if (typeof (console) !== 'undefined')
                    console.info("criamapa pq sid vazio")

                mashup = function(retorno) {
                    // verifica se existe bloqueio em funcao da senha no
                    // ms_configura.php
                    if (retorno.bloqueado) {
                        alert(retorno.bloqueado);
                        return;
                    }
                    i3GEO.configura.sid = retorno;
                    i3GEO.inicia(retorno);
                };
                if(i3GEO.Interface.googleLike == true){
                    i3GEO.configura.mashuppar += "&interface=googlemaps";
                } else {
                    i3GEO.configura.mashuppar += "&interface=openlayers";
                }
                // acrescenta camadas iniciais
                if (i3GEO.mapa.TEMASINICIAIS.length > 0) {
                    i3GEO.configura.mashuppar += "&temasa="
                        + i3GEO.mapa.TEMASINICIAIS;
                }
                if (i3GEO.mapa.TEMASINICIAISLIGADOS.length > 0) {
                    i3GEO.configura.mashuppar += "&layers="
                        + i3GEO.mapa.TEMASINICIAISLIGADOS;
                }
                i3GEO.request.get({
                    snackbar: false,
                    snackbarmsg: false,
                    btn: false,
                    par: {
                        funcao: "create"
                    },
                    prog: "/serverapi/map/?" + i3GEO.configura.mashuppar,
                    fn: function(data){
                        mashup(data);
                    }
                });
            } else {
                if (typeof (console) !== 'undefined')
                    console.info("i3GEO.inicia() mapa criado anteriormente");

                if (i3GEO.parametros.w === ""
                    || i3GEO.parametros.h === "") {
                    tamanho = i3GEO.calculaTamanho();
                    i3GEO.parametros.w = tamanho[0];
                    i3GEO.parametros.h = tamanho[1];
                }
                i3GEO.request.get({
                    snackbar: false,
                    snackbarmsg: false,
                    btn: false,
                    par: {
                        funcao: "start",
                        w: i3GEO.parametros.w,
                        h: i3GEO.parametros.h,
                        "interface": i3GEO.Interface.googleLike ? "googlemaps" : "openlayers"
                    },
                    prog: "/serverapi/map/?",
                    fn: function(data){
                        //console.log(data);
                        montaMapa(data);
                    }
                });
            }
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
        atualiza : function() {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.atualiza depreciado v8 utilize i3GEO.mapa.refresh");

            i3GEO.mapa.refresh();
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
                i3GEO.Interface.zoom2ext(i3GEO.parametros.mapexten);
                i3geoOL.updateSize();
                i3GEO.guias.ALTURACORPOGUIAS = h;
                i3GEO.eventos.resizeMapa();
                return [w,h];
            };
            i3GEO.mapa.mudatamanho(temp,h,w);
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
            i3GEO.parametros.mapscale = i3geoOL.getScale() * 1;
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
