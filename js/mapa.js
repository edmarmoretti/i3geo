if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.mapa =
{
        //mostra ou nao o balao de informacoes mesmo se nao existirem dados retornados
        OPENTIPIFEMPTY: true,
        /**
         * Propriedade: TEMASINICIAISLIGADOS
         *
         * Lista indicando quais temas serao adicionados ao mapa na inicializacao
         *
         * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
         *
         * Os temas sao aqueles que aparecem em i3geo/temas
         *
         * Tipo:
         *
         * {string}
         */
        TEMASINICIAISLIGADOS : "",
        /**
         * Propriedade: TEMASINICIAIS
         *
         * Lista indicando quais temas serao ligados na inicializacao
         *
         * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
         *
         * Os temas sao aqueles que aparecem em i3geo/temas
         *
         * Tipo:
         *
         * {string}
         */
        TEMASINICIAIS : "",
        /**
         * Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
         *
         * Tipo {Array}
         */
        GEOXML : [],
        itensvisib: function(seletores){
            $.each(seletores, function(i,v){
                if($(v).hasClass("itensvisib")){
                    $(v).removeClass("itensvisib");
                } else {
                    $(v).addClass("itensvisib");
                }
            });
        },
        /**
         * Function: limpasel
         *
         * Limpa a selecao de todos os temas do mapa
         *
         */
        limpasel : function({verifica = false}={}) {
            if(i3GEO.arvoreDeCamadas.existeCamadaSel({msg: true}) == false){
                return;
            }
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {},
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/clearSel",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    i3GEO.Interface.atualizaMapa();
                }
            });
        },
        infoxy: function(x,y){
            i3GEO.identify.mapTooltip({x: x,y: y, allColumns: false});
        },
        /**
         * Ativa o redimensionamento automatico do mapa sempre que o navegador for redimensionado
         *
         * e definido como um evento do elemento window
         */
        ativaAutoResize : function() {
            var ativo = true;
            window.onresize = function() {
                var Dw, Dh;
                Dw = window.innerWidth;
                Dh = window.innerHeight;
                i3GEO.tamanhodoc = [
                    Dw, Dh
                    ];
                if (ativo === true) {
                    setTimeout(function() {
                        i3GEO.reCalculaTamanho();
                        i3GEO.guias.abreFecha("fecha");
                        ativo = true;
                    }, 2000);
                }
                ativo = false;
            };
        },
        //depreciado na versao 8
        ativaIdentificaBalao: function(){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.mapa.ativaIdentificaBalao depreciado utilize i3GEO.identify.ativaIdentificaBalao()");

        },
        /**
         * Function: ativaTema
         *
         * Altera a variavel i3GEO.temaAtivo e atualiza a interface em funcao do novo tema que for ativado
         *
         * O tema anteriormente ativo tem sua cor alterada para a cor normal e o novo tema e destacado com uma cor diferente
         *
         * Executa tambem as funcoes armazenadas em i3GEO.eventos.ATIVATEMA
         *
         * Parametros:
         *
         * {string} - codigo da camada
         */
        ativaTema : function(codigo) {
            if (codigo) {
                i3GEO.temaAtivo = codigo;
            }
        },
        /**
         * Function: compactaLayerGrafico
         *
         * Retorna uma string no formato base64 + JSON contendo as geometrias existentes no layer grafico do mapa Essas geometrias podem ser
         * criadas com o editor vetorial
         */
        compactaLayerGrafico : function() {
            var geos = false, geometrias = [], n = 0, i, g;
            if (i3GEO.desenho.layergrafico && i3GEO.desenho.layergrafico.features) {
                geos = i3GEO.desenho.layergrafico.features;
                n = geos.length;
                for (i = 0; i < n; i++) {
                    g = {
                            "atributos" : geos[i].attributes,
                            "geometria" : geos[i].geometry.toString()
                    };
                    geometrias.push(g);
                }
            }
            g = JSON.stringify(geometrias);
            return i3GEO.util.base64encode(g);
        },
        /**
         * Function: desCompactaLayerGrafico
         *
         * Descompacta um layer grafico criado com compactaLayerGrafico
         */
        desCompactaLayerGrafico : function(geometrias) {
            geometrias = JSON.parse(geometrias);
            // carrega o script do editor vetorial
            if (geometrias.length > 0) {
                if(!i3GEO.desenho.layergrafico){
                    i3GEO.desenho.criaLayerGrafico();
                }
                i3GEO.editor.openlayers.ativaPainel();
                var n = geometrias.length, i;
                for (i = 0; i < n; i++) {
                    i3GEO.desenho.adicionaFeatureWkt(geometrias[i].geometria, geometrias[i].atributos);
                }
            }
        },
        /**
         * Function: restauraGraficos
         *
         * Descompacta graficos salvos no mapa atual
         */
        restauraGraficos : function(graficos) {
            // carrega o script do editor vetorial
            if (graficos.length > 0) {
                var inicia = function() {
                    i3GEOF.graficointerativo.restauraGraficos(graficos);
                };
                i3GEO.util.scriptTag(
                        i3GEO.configura.locaplic + "/ferramentas/graficointerativo/dependencias.php",
                        inicia,
                        "graficointerativo",
                        true);
            }
        },
        /**
         * Function: restauraTabelas
         *
         * Descompacta tabelas salvas no mapa atual
         */
        restauraTabelas : function(tabelas) {
            // carrega o script do editor vetorial
            if (tabelas.length > 0) {
                var inicia = function() {
                    i3GEOF.tabela.restauraTabelas(tabelas);
                };
                i3GEO.util.scriptTag(i3GEO.configura.locaplic + "/ferramentas/tabela/dependencias.php", inicia, "tabela", true);
            }
        },
        //
        // aplica as preferencias armazenadas localmente ou vindas de um mapa
        // salvo no banco de dados
        //
        aplicaPreferencias : function(cookies) {
            // aplica preferencias do usuario
            var props, nprops, i, temp = [], pint;
            if (!cookies) {
                cookies = i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo");
            }
            if (cookies) {
                props = cookies.split("::");
                nprops = props.length;
                // nao tente remover eval com window[], nao funciona com namespace
                for (i = 0; i < nprops; i++) {
                    try {
                        temp = props[i].split("|");
                        pint = parseInt(temp[1], 10);
                        if (temp[1] === 'true' || temp[1] === 'false') {
                            if (temp[1] === 'true') {
                                temp[1] = true;
                            }
                            if (temp[1] === 'false') {
                                temp[1] = false;
                            }
                            eval(temp[0] + " = " + temp[1] + ";");
                        } else if (pint + "px" == temp[1]) {
                            eval(temp[0] + " = '" + temp[1] + "';");
                        } else if ($.isNumeric(pint)) {
                            eval(temp[0] + " = " + temp[1] + ";");
                        } else {
                            eval(temp[0] + " = '" + temp[1] + "';");
                        }
                    } catch (e) {
                    }
                }
            }
        },
        addLayers : function(after, layerNames) {
            i3GEO.request.get({
                snackbar: true,
                snackbarmsg: $trad("camadaadic"),
                btn: false,
                par: {
                    layerNames: layerNames
                },
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/addLayers",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        textFontList : function(after) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {},
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/textFontList",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        epsgList : function(after) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    funcao: "epsglist"
                },
                prog: "/serverapi/catalog/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        adicionaTemaWMS : function({after=false, layerTitle = "default", wms_name, url, proj, formatlist, version = "1.1.1", wms_style = "", representationtype = "", suportsld = false, infoformat = "text/plain", time = "", tile = 0, allitens = false} = {}) {
            var par = {
                wms_name: wms_name,
                url: url,
                proj: proj,
                formatlist: formatlist,
                version: version,
                wms_style: wms_style,
                representationtype: representationtype,
                suportsld: suportsld,
                infoformat: infoformat,
                time: time,
                tile: tile,
                allitens: allitens,
                layerTitle: layerTitle
            };
            i3GEO.request.get({
                snackbar: true,
                snackbarmsg: $trad("camadaadic"),
                btn: false,
                par: par,
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/addLayerWms",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        addLayerShp : function(after, arq){
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    arq: arq
                },
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/addLayerShp",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        addLayerImg : function(after, arq) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    arq: arq
                },
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/addLayerImg",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        mudatamanho : function({after = false, altura = 500, largura = 500, btn = false, snackbarmsg = false, snackbar = false} = {}) {
            i3GEO.request.get({
                snackbar: snackbar,
                snackbarmsg: snackbarmsg,
                btn: btn,
                par: {
                    h: altura,
                    w: largura
                },
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/setSize",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        getExtent: function(){
            var bounds = i3geoOL.getExtent().toBBOX().split(","),
            s = bounds[0] + " " + bounds[1] + " " + bounds[2] + " " + bounds[3];

            return ({
                string: s,
                bounds: bounds,
                osm: i3GEO.util.extGeo2OSM(s),
                geo: i3GEO.util.extOSM2Geo(s)
            });
        },
        extentToLayer: function(layerName){
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    layerName: layerName
                },
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/extentToLayer",
                fn: function(data){
                    i3GEO.Interface.zoom2ext(data);
                }
            });
        },
        refresh : function(after){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.refresh()");

            i3GEO.request.get({
                snackbar: true,
                snackbarmsg: $trad("maprefresh"),
                btn: false,
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/getParameters",
                fn: function(data){
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.mapa.refresh()");

                    i3GEO.atualizaParametros(data.variaveis);
                    var temp = i3GEO.arvoreDeCamadas.converteChaveValor2normal(data.temas);
                    try {
                        i3GEO.arvoreDeCamadas.atualiza(temp);
                        i3GEO.arvoreDeCamadas.atualizaFarol(i3geoOL.getScale());
                    } catch (e) {}
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
                        i3GEO.mapa.extentToLayer(temp);
                    }
                    if (after){
                        after.call(after, data);
                    }
                    i3GEO.legenda.atualiza({"force":true});
                }
            });
        },
        dialogo : {
            /**
             * Function: mascara
             *
             * Abre a janela de di&aacute;logo com as ferramenta mascara
             */
            mascara : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.mascara()",
                        "mascara",
                        "mascara",
                        "dependencias.php",
                "i3GEOF.mascara.start()");
            },
            /**
             * Function: wkt2layer
             *
             * Janela de conversao de wkt em layer
             *
             * Parametros:
             *
             * {string} - (opcional) WKT
             *
             * {texto} - (opcional) texto a ser incluido na feicao
             */
            wkt2layer : function(wkt, texto) {
                var temp = function() {
                    i3GEOF.wkt2layer.start(wkt, texto);
                };
                i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.wkt2layer()", "wkt2layer", "wkt2layer", "dependencias.php", temp);
            },
            /**
             * Function: geolocal
             *
             * Abre a janela de dialogo da ferramenta de geolocalizacao do usuario
             */
            geolocal : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.geolocal()",
                        "geolocal",
                        "geolocal",
                        "dependencias.php",
                "i3GEOF.geolocal.iniciaJanelaFlutuante()");
            },
            /**
             * Function: congelaMapa
             *
             * Congela a vis&atilde;o atual do mapa mostrando-o em uma janela flutuante
             */
            congelamapa : function() {
                i3GEO.janela.abreAguarde();
                var url = i3GEO.configura.locaplic
                + "/ferramentas/congelamapa/exec.php?g_sid="
                + i3GEO.configura.sid
                + "&funcao=copy"
                + "&ext="
                + i3GEO.mapa.getExtent().geo;
                $.get(url).done(function(data) {
                    i3GEO.janela.fechaAguarde();
                    var url = "", idjanela = i3GEO.util.generateId(), cabecalho = function() {
                    }, titulo, minimiza = function() {
                        i3GEO.janela.minimiza(idjanela);
                    };
                    url = i3GEO.configura.locaplic + "/ferramentas/congelamapa/ogc.php?g_sid="
                    + i3GEO.configura.sid;

                    var map = new ol.Map({
                        layers: [
                            //new ol.layer.Tile({source: new ol.source.OSM()}),
                            new ol.layer.Image({
                                source : new ol.source.ImageWMS({
                                    url : url,
                                    params : {
                                        'LAYERS' : '',
                                        'VERSION' : '1.1.0'
                                    },
                                    projection : i3geoOL.getView().getProjection().getCode(),
                                    ratio : 1
                                }),
                                visible : true
                            })
                            ],
                            //target: 'mapacongelado',
                            controls: [new ol.control.Zoom()],
                            view: new ol.View({
                                center: i3geoOL.getView().getCenter(),
                                zoom: i3geoOL.getView().getZoom()
                            })
                    });
                    i3GEO.janela.formModal({
                        texto: "<div style='width:100%;height: calc(100% + 1px)' id='mapacongelado'></div>",
                        expandable: false,
                        resizable: {
                            disabled: false,
                            ghost: true,
                            handles: "se,n",
                            stop: function(event, ui){
                                map.updateSize();
                            }
                        },
                        css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
                    });
                    map.setTarget('mapacongelado');
                }).fail(function() {
                    i3GEO.janela.fechaAguarde();
                    i3GEO.janela.snackBar({content: $trad("x43"),style: "red"});
                    return;
                });
            },
            /**
             * Function: metaestat
             *
             * Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT

             *@TODO depreciado na versao 8
             */
            metaestat : function(largura, altura, topo, esquerda, Interface, conexao) {
                var temp = function() {
                    i3GEOF.metaestat.MULTIPARAMETROS = true;
                    if(Interface){
                        i3GEOF.metaestat.INTERFACE = Interface;
                    }
                    if(conexao){
                        i3GEOF.metaestat.CONEXAODEFAULT = conexao;
                    }
                    i3GEOF.metaestat.INTERFACE = "flutuante";
                    i3GEOF.metaestat.principal.inicia(null, largura, altura, topo, esquerda);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.metaestat()",
                        "metaestat",
                        "metaestat",
                        "dependencias.php",
                        temp
                );
            },
            cartograma:  function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.cartograma()",
                        "cartograma",
                        "cartograma",
                        "dependencias.php",
                "i3GEOF.cartograma.start()");
            },
            /**
             * Function: metaestatListaMapas
             *
             * Lista os mapas publicados no METAESTAT
             */
            metaestatListaMapas : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.metaestatListaMapas()",
                        "metaestat",
                        "listamapas",
                        "listamapas.js",
                "i3GEOF.listamapas.iniciaJanelaFlutuante()");
            },
            /**
             * Function: preferencias
             *
             * Preferencias do usuario
             */
            preferencias : function() {
                i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.preferencias()", "preferencias", "preferencias");
            },
            /**
             * Function: locregiao
             *
             * Abre a janela de dialogo da ferramenta de busca de regiao cadastrada no METAESTAT
             */
            locregiao : function() {
                var temp = function(){
                    i3GEOF.locregiao._parameters.ATIVAFILTRO = false;
                    i3GEOF.locregiao.start();
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.locregiao()",
                        "locregiao",
                        "locregiao",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: filtraregiao
             *
             * Abre a janela de dialogo da ferramenta de busca de regioes cadastradas no METAESTAT com opcao de filtrar a regiao escolhida
             */
            filtraregiao : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.filtraregiao()",
                        "locregiao",
                        "locregiao",
                        "dependencias.php",
                        "i3GEOF.locregiao.abreComFiltro()"
                );
            },
            /**
             * Function: animacao
             *
             * Abre a janela de dialogo da ferramenta que permite animar o mapa atual
             */
            animacao : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.animacao()",
                        "animacao",
                        "animacao",
                        "dependencias.php",
                "i3GEOF.animacao.start()");
            },
            /**
             * Function: opacidade
             *
             * Abre a janela de dialogo da ferramenta de definicao da transparencia das camadas principais do mapa
             */
            opacidade : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opacidademapa()",
                        "opacidademapa",
                        "opacidademapa",
                        "dependencias.php",
                "i3GEOF.opacidademapa.start()");
            },
            /**
             * Function: t3d
             *
             * Abre a janela de dialogo da ferramenta de geracao da visualizacao em 3d
             */
            t3d : function() {
                i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.t3d()", "3d", "t3d");
            },
            /**
             * Function: imprimir
             *
             * Abre a janela de dialogo da ferramenta que permite imprimir o mapa atual
             */
            imprimir : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.imprimir()",
                        "imprimir",
                        "imprimir",
                        "dependencias.php",
                "i3GEOF.imprimir.start()");
            },
            /**
             * Function: mostraexten
             *
             * Abre a janela de dialogo da ferramenta que mostra a extensao geografica atual do mapa
             */
            mostraexten : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.mostraexten()",
                        "mostraexten",
                        "mostraexten",
                        "dependencias.php",
                "i3GEOF.mostraexten.start()");
            },
            /**
             * Function: autoredesenha depreciado na versao 8
             *
             * Abre a janela de dialogo da ferramenta opcoes_autoredesenha
             */
            autoredesenha : function(){
                console.log("autoredesenha Depreciado. Utilize i3GEO.timer.mapa.start()");
                i3GEO.timer.mapa.start();
            },
            /**
             * Function: linkMapaOriginal
             *
             * Abre a janela de dialogo da ferramenta linkMapaOriginal
             */
            linkMapaOriginal : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.linkMapaOriginal()",
                        "linkmapaoriginal",
                        "linkmapaoriginal",
                        "dependencias.php",
                "i3GEOF.linkMapaOriginal.start()");
            },
            /**
             * Function: salvaMapa
             *
             * Abre a janela de dialogo da ferramenta salvamapa
             */
            salvamapa : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.salvamapa()",
                        "salvamapa",
                        "salvamapa",
                        "dependencias.php",
                "i3GEOF.salvamapa.start()");
            },
            /**
             * Function: carregamapa
             *
             * Abre a janela de dialogo da ferramenta carregamapa
             */
            carregamapa : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.carregamapa()",
                        "carregamapa",
                        "carregamapa",
                        "dependencias.php",
                "i3GEOF.carregamapa.start()");
            },
            /**
             * Function: convertews
             *
             * Abre a janela de dialogo da ferramenta convertews
             */
            convertews : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.convertews()",
                        "convertews",
                        "convertews",
                        "dependencias.php",
                "i3GEOF.convertews.start()");
            },
            /**
             * Function: convertemapakml
             *
             * Abre a janela de dialogo da ferramenta convertemapakml
             */
            convertemapakml : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.convertemapakml()",
                        "convertemapakml",
                        "convertemapakml",
                        "dependencias.php",
                "i3GEOF.convertemapakml.start()");
            },
            /**
             * Function: tamanho
             *
             * Abre a janela de dialogo da ferramenta opcoes_tamanho
             */
            opcoestamanho : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opcoestamanho()",
                        "opcoestamanho",
                        "opcoestamanho",
                        "dependencias.php",
                "i3GEOF.opcoestamanho.start()");
            },
            /**
             * Function: tipoimagem
             *
             * Abre a janela de dialogo da ferramenta tipoimagem
             */
            tipoimagem : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.tipoimagem()",
                        "tipoimagem",
                        "tipoimagem",
                        "dependencias.php",
                "i3GEOF.tipoimagem.start()");
            },
            /**
             * Function: corfundo
             *
             * Abre a janela de dialogo da ferramenta opcoes_fundo
             */
            opcoesfundo : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opcoesfundo()",
                        "opcoesfundo",
                        "opcoesfundo",
                        "dependencias.php",
                "i3GEOF.opcoesfundo.start()");
            },
            /**
             * Function: opcoesEscala
             *
             * Abre a janela de dialogo da ferramenta opcoes_escala
             */
            opcoesescala : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opcoesescala()",
                        "opcoesescala",
                        "opcoesescala",
                        "dependencias.php",
                "i3GEOF.opcoesescala.start()");
            },
            /**
             * Function: opcoeslegenda
             *
             * Abre a janela de dialogo da ferramenta opcoeslegenda
             */
            opcoeslegenda : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opcoeslegenda()",
                        "opcoeslegenda",
                        "opcoeslegenda",
                        "dependencias.php",
                "i3GEOF.opcoeslegenda.start()");
            },
            /**
             * Function: opcoesMapaRef
             *
             * Abre a janela de dialogo da ferramenta opcoes_maparef
             */
            opcoesmaparef : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.opcoesmaparef()",
                        "opcoesmaparef",
                        "opcoesmaparef",
                        "dependencias.php",
                "i3GEOF.opcoesmaparef.start()");
            },
            /**
             * Function: gradeCoord
             *
             * Abre a janela de dialogo da ferramenta gradecoord
             */
            gradecoord : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.gradecoord()",
                        "gradecoord",
                        "gradecoord",
                        "dependencias.php",
                "i3GEOF.gradecoord.start()");
            },
            /**
             * Function: inseretxt
             *
             * Abre a janela de dialogo da ferramenta inseretxt
             */
            inseretxt : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.inseretxt()",
                        "inseretxt",
                        "inseretxt",
                        "dependencias.php",
                "i3GEOF.inseretxt.start()");
            },
            /**
             * Function: selecao
             *
             * Abre a janela de dialogo da ferramenta selecao
             */
            selecao : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.selecao()",
                        "selecao",
                        "selecao",
                        "dependencias.php",
                        "i3GEOF.selecao.iniciaJanelaFlutuante()"
                );
            },
            /**
             * Function: inserexy2
             *
             * Abre a janela de dialogo da ferramenta inserexy2
             */
            inserexy2 : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.inserexy2()",
                        "inserexy2",
                        "inserexy2",
                        "dependencias.php",
                "i3GEOF.inserexy2.start()");
            },
            /**
             * Function: cliqueGrafico
             *
             * Abre a janela de dialogo da ferramenta inseregrafico
             */
            inseregrafico : function() {
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.mapa.dialogo.inseregrafico()",
                        "inseregrafico",
                        "inseregrafico",
                        "dependencias.php",
                "i3GEOF.inseregrafico.start()");
            },
            //depreciado na versao 8
            cliqueIdentificaDefault : function(x, y, tema) {
                if (typeof (console) !== 'undefined')
                    console.info("depreciado i3GEO.mapa.dialogo.cliqueIdentificaDefault() utilize i3GEO.identify.dialogo.cliqueIdentificaDefault()");
            },
            verificaTipDefault : function(x,y) {
                if (typeof (console) !== 'undefined')
                    console.info("depreciado i3GEO.mapa.dialogo.verificaTipDefault() utilize i3GEO.identify.dialogo.verificaTipDefault()");

                i3GEO.identify.mapTooltip({x:x,y:y,allColumns:false});
            }
        },
        createWaitOverlay: function(x,y){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.mapa.createWaitOverlay()" );

            var res = i3GEO.configura.ferramentas.identifica.resolution;
            var bdiv = document.createElement("div");
            bdiv.className = "waitInfoWindow";
            bdiv.style.width = res+"px";
            bdiv.style.height = res+"px";
            bdiv.style.top = (res/2 * -1) + "px";

            var b = new ol.Overlay({
                element : bdiv,
                stopEvent : true,
                autoPan : false,
                origem: "balao",
                autoPanAnimation : false,
                positioning: "center-center",
                position: i3GEO.util.projGeo2OSM(new ol.geom.Point([x, y])).getCoordinates()
            });
            i3geoOL.addOverlay(b);
            return b;
        },
        addWktToGraphicLayer: function(wkts,titulo){
            if (typeof (console) !== 'undefined')
                console.info("adicionando WKT");
            var n = wkts.length;
            if(n > 0){
                i3GEO.desenho.criaLayerGrafico();
                var g, format, f, c = i3GEO.desenho.layergrafico.getSource();
                format = new ol.format.WKT();
                for(r = 0; r < n; r += 1){
                    f = format.readFeatures(wkts[r].wkt.valor);
                    f = f[0];
                    g = f.getGeometry();
                    g = i3GEO.util.projGeo2OSM(g);
                    f.setGeometry(g);
                    if(wkts[r].hash){
                        if(c.getFeatureById(wkts[r].hash)){
                            continue;
                        }
                        f.setId(wkts[r].hash);
                    } else {
                        f.setId(i3GEO.util.uid());
                    }
                    i3GEO.editor.setStyleByTypeFeature(f);
                    i3GEO.editor.setStyleDefault(f);
                    wkts[r].wkt = "",
                    //atributos
                    f.setProperties({
                        fat : wkts[r],
                        origem : "pin",
                        nameLayer: titulo + " (" + $trad("figura") + ")"
                    });
                    c.addFeature(f);
                }
                i3GEO.editor.tableRefresh();
            }
        }
};