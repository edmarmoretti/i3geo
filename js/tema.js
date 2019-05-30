if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.tema =
{
        /**
         * Function: ativaFerramentas
         *
         * Verifica se uma camada possuí ferramentas configuradas e que devem ser abertas ao ser adicionada ao mapa
         *
         * Parametros:
         *
         * {objeto} - objeto camada ver em i3GEO.arvoreDeCamadas.CAMADAS
         */
        ativaFerramentas : function(camada){
            if(camada.ferramentas && camada.ferramentas != ""){
                var f = camada.ferramentas;
                if(f.tme && f.tme.auto && f.tme.auto.toLowerCase() === "sim"){
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.tema.ativaFerramentas tme " + camada.name);

                    i3GEO.tema.dialogo.tme(camada.name);
                }
                if(f.storymap && f.storymap.auto && f.storymap.auto.toLowerCase() === "sim"){
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.tema.ativaFerramentas storymap " + camada.name);

                    i3GEO.tema.dialogo.storymap(camada.name);
                }
                if(f.animagif && f.animagif.auto && f.animagif.auto.toLowerCase() === "sim"){
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.tema.ativaFerramentas animagif " + camada.name);

                    i3GEO.tema.dialogo.animagif(camada.name);
                }
            }
        },
        /**
         * Function: exclui
         *
         * Exclui um tema do mapa
         *
         * Parametros:
         *
         * {string} - codigo do tema
         *
         * {boolean} - confirma exclusao
         */
        exclui : function(temas,confirma,after) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.tema.exclui " + temas);

            if(confirma && confirma === true){
                i3GEO.janela.confirma($trad("removerDoMapa"), 300, $trad("x14"),
                        "", function() {
                    i3GEO.tema.exclui(temas,false,after);
                });
                return;
            }

            if(Array.isArray(temas)){
                var excluir = temas;
            } else {
                var excluir = [temas];
            }
            var grupos = [];
            for (const t of excluir){
                var camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[t];
                for(const c of i3GEO.arvoreDeCamadas.CAMADAS){
                    if(c.group != "" && camada.group != ""){
                        if(c.name == camada.group || camada.group == c.group || camada.name == c.group){
                            grupos.push(c.name);
                        }
                    }
                }
                try {
                    i3GEO.pluginI3geo.removeCamada(t);
                } catch (r) {}
            }
            excluir = [...excluir,...grupos];
            i3GEO.request.get({
                snackbar: true,
                snackbarmsg: false,
                btn: false,
                par: {
                    temas: excluir.getUnique().join(","),
                    funcao: "EXCLUIRTEMAS"
                },
                prog: "/serverapi/map/",
                fn: function(data){
                    i3GEO.mapa.ativaTema();
                    i3GEO.temaAtivo = "";
                    for(const t of excluir){
                        var layer = i3geoOL.getLayersByName(t);
                        if (layer.length > 0) {
                            i3geoOL.removeLayer(layer[0]);
                        }
                    }
                    i3GEO.mapa.refresh();
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        /**
         * Function: fonte
         *
         * Abre os metadados registrados para o tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         *
         * {boolean} - abre em um popup
         */
        fonte : function(tema, popup, link) {
            i3GEO.mapa.ativaTema(tema);
            if(!link){
                link = i3GEO.configura.locaplic + "/ferramentas/abrefontemapfile.php?tema=" + tema;
            }
            if (!popup) {
                window.open(link);
            } else {
                i3GEO.janela.cria(
                        (i3GEO.parametros.w / 2) + 25 + "px",
                        (i3GEO.parametros.h / 2) + 18 + "px",
                        link,
                        "",
                        "",
                        "<div class='i3GeoTituloJanela'>Metadata</div>",
                        "metadata" + tema
                );
            }
        },
        sobe : function(tema) {
            console.error("Veja i3GEO.mapa.moveLayerUp()");
        },
        desce : function(tema) {
            console.error("Veja i3GEO.mapa.moveLayerDown()");
        },
        zoom : function(tema) {
            console.error("Veja i3GEO.mapa.extentToLayer()");
        },
        /**
         * Function: zoomsel
         *
         * Zoom para os elementos selecionados de um tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         */
        zoomsel : function(tema) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    funcao: "zoomsel"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    i3GEO.Interface.zoom2ext(data);
                }
            });
        },
        itens : function(after,tema) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    ext: i3GEO.mapa.getExtent().string,
                    funcao: "itens"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        valoresItem : function(after,tema,item) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    item: item,
                    ext: i3GEO.mapa.getExtent().geo,
                    funcao: "valoresItem"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        /**
         * Function: limpasel
         *
         * Limpa a selecao do tema
         *
         * Parametros:
         *
         * {string} - ID (name) do tema clicado
         */
        limpasel : function(tema) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    funcao: "limpasel"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    i3GEO.Interface.atualizaTema("", tema);
                }
            });
        },

        /**
         * Function: invertestatuslegenda
         *
         * Inverte o status atual do metadata CLASSE, permitindo esconder ou mostrar a legenda do tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         */
        invertestatuslegenda : function(tema) {
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    funcao: "invertestatuslegenda"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    i3GEO.mapa.refresh();
                    i3GEO.arvoreDeCamadas.atualiza();
                }
            });
        },
        /**
         * Function: alteracorclasse
         *
         * Altera a cor de uma classe de um tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         *
         * {numeric} - id da classe
         *
         * {string} - nova cor (r,g,b)
         */
        alteracorclasse : function(after,tema, idclasse, rgb, objImg) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.tema.alteracorclasse()");

            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: tema,
                    idclasse: idclasse,
                    cor: rgb,
                    funcao: "alteracor"
                },
                prog: "/serverapi/class/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    } else {
                        if(objImg){
                            objImg.src = data;
                        } else {
                            i3GEO.legenda.CAMADAS = "";
                            i3GEO.mapa.refresh();
                        }
                        i3GEO.Interface.atualizaTema("", idtema);
                    }
                }
            });
        },
        /**
         * Function: mudanome
         *
         * Muda o nome de um tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         */
        mudanome : function(idlayer,title) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.tema.mudanome() ");

            if (title !== "") {
                i3GEO.request.get({
                    snackbar: false,
                    snackbarmsg: false,
                    btn: false,
                    par: {
                        title: title,
                        idlayer: idlayer,
                        funcao: "alterLayerName"
                    },
                    prog: "/serverapi/layer/",
                    fn: function(data){
                        i3GEO.mapa.refresh();
                    }
                });
            } else {
                i3GEO.janela.tempoMsg($trad("x18"));
            }
        },
        /**
         * Function: copia
         *
         * Adiciona ao mapa uma copia do tema
         *
         * Parametros:
         *
         * {string} - codigo do tema
         */
        copia : function(idtema) {
            i3GEO.request.get({
                snackbar: true,
                snackbarmsg: false,
                btn: false,
                par: {
                    tema: idtema,
                    funcao: "copia"
                },
                prog: "/serverapi/layer/",
                fn: function(data){
                    i3GEO.mapa.refresh();
                }
            });
        },
        cortina : {
            _cortinaCompose: "",
            _slide: "",
            start : function(obj,tema){
                if (typeof (console) !== 'undefined')
                    console.info("i3GEO.tema.cortina.start()");

                var layer = i3geoOL.getLayersByName(tema)[0];

                if(i3GEO.tema.cortina._cortinaCompose == ""){
                    var a = layer.on('precompose', function(event) {
                        var ctx = event.context;
                        var width = ctx.canvas.width * (obj.value / 100);
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
                        ctx.clip();
                    });

                    var b = layer.on('postcompose', function(event) {
                        var ctx = event.context;
                        ctx.restore();
                    });

                    i3GEO.tema.cortina._cortinaCompose = [a,b];

                    obj.addEventListener('input', function() {
                        i3geoOL.render();
                    }, false);
                }
            },
            stop : function(){
                if (typeof (console) !== 'undefined')
                    console.info("i3GEO.tema.cortina.stop()");

                ol.Observable.unByKey(i3GEO.tema.cortina._cortinaCompose);
                i3GEO.tema.cortina._cortinaCompose = "";
                //i3GEO.tema.cortina._slide.value = 50;
                i3geoOL.renderSync();
            }
        },
        /**
         * Section: i3GEO.tema.dialogo
         *
         * Abre as telas de dialogo das opcoes de manipulacao de um tema
         */
        dialogo : {
            /**
             * Function: animagif
             *
             * Abre a ferramenta animagif
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             */
            animagif : function(tema) {
                if(!tema){
                    tema = "";
                }
                var temp = function(){
                    i3GEOF.animagif.start(tema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.animagif()",
                        "animagif",
                        "animagif",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: storymap
             *
             * Abre a ferramenta storymap
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             */
            storymap : function(tema) {
                if(!tema){
                    tema = "";
                }
                var temp = function(){
                    i3GEOF.storymap.start(tema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.storymap()",
                        "storymap",
                        "storymap",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: tme
             *
             * Abre a ferramenta TME
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             */
            tme : function(tema) {
                if(!tema){
                    tema = "";
                }
                var temp = function(){
                    i3GEOF.tme.start(tema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.tme()",
                        "tme",
                        "tme",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: mostraWms
             *
             * Mostra a url que da acesso ao WMS de um tema
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             */
            mostraWms : function(tema) {
                i3GEO.janela.mensagemSimples(i3GEO.configura.locaplic + "/ogc.php?tema=" + tema, "WMS url");
            },
            /**
             * Function: comentario
             *
             * Abre a janela de dialogo para o usuario ver e inserir comentarios em um tema
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             */
            comentario : function(tema) {
                i3GEO.janela
                .cria(
                        "530px",
                        "330px",
                        i3GEO.configura.locaplic + "/ferramentas/comentarios/index.php?tema=" + tema + "&g_sid=" + i3GEO.configura.sid
                        + "&locaplic=" + i3GEO.configura.locaplic,
                        "",
                        "",
                        "<img src='"
                        + i3GEO.configura.locaplic
                        + "/imagens/player_volta.png' style=cursor:pointer onclick='javascript:history.go(-1)'><span style=position:relative;top:-2px; > "
                        + $trad("x19") + " " + tema + "</span><a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
                        + "/ajuda_usuario.php?idcategoria=7&idajuda=68' ><b> </b></a>",
                        "comentario" + Math.random());
            },
            /**
             * Function: mmscale
             *
             * Abre a janela de dialogo que permite definir o comportamento do mapa em fun&ccedil;&atilde;o da escala
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             *
             */
            mmscale : function(tema) {
                var temp = function(){
                    i3GEOF.mmscale.start(tema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.mmscale()",
                        "mmscale",
                        "mmscale",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: abreKml
             *
             * Abre a janela de dialogo da ferramenta convertekml
             *
             * Parametros:
             *
             * {string} - codigo do tema escolhido
             *
             * {string} - tipo de kml - kml|kmz , o tipo kmz permite acessar os dados via kml (por meio de um WMS) e via kml vetorial.
             */
            abreKml : function(tema, tipo) {
                if (arguments.lenght === 1) {
                    tipo = "kml";
                }
                if (typeof (i3GEOF.converteKml) === 'undefined') {
                    i3GEO.util.scriptTag(
                            i3GEO.configura.locaplic + "/ferramentas/convertekml/index.js",
                            "i3GEOF.converteKml.criaJanelaFlutuante('" + tema + "','" + tipo + "')",
                    "i3GEOF.converteKml_script");
                } else {
                    i3GEOF.converteKml.criaJanelaFlutuante(tema, tipo);
                }
            },
            /**
             * Function: salvaMapfile
             *
             * Abre a janela de dialogo da ferramenta salvamapfile
             *
             * Parametros:
             *
             * {string} - codigo do tema
             */
            salvaMapfile : function(idtema) {
                i3GEO.mapa.ativaTema(idtema);
                i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.salvaMapfile()", "salvamapfile", "salvamapfile");
            },
            /**
             * Function: graficotema
             *
             * Abre a janela de dialogo da ferramenta graficotema
             *
             * Parametros:
             *
             * {string} - codigo do tema
             *
             */
            graficotema : function(idtema) {
                if(idtema && idtema != ""){
                    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                    if(t.status < 2){
                        i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                        return;
                    }
                }
                var temp = function(){
                    i3GEOF.graficoTema.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.graficotema()",
                        "graficotema",
                        "graficotema",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: toponimia
             *
             * Abre a janela de dialogo da ferramenta toponimia
             *
             * Parametros:
             *
             * {string} - codigo do tema
             */
            toponimia : function(idtema) {
                var temp = function(){
                    i3GEOF.toponimia.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.toponimia()",
                        "toponimia",
                        "toponimia",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: filtro
             *
             * Abre a janela de dialogo da ferramenta filtro
             *
             * Parametros:
             *
             * {string} - codigo do tema
             *
             * {boolean} - indica o modo de calculadora, que permite retornar o filtro para um ID
             *
             * {string} - id do elemento que recebera o filtro
             */
            filtro : function(idtema) {
                if(idtema && idtema != ""){
                    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                    if(t.status < 2){
                        i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                        return;
                    }
                }
                i3GEO.mapa.ativaTema(idtema);
                var temp = function(){
                    //i3GEOF.filtro.iniciaJanelaFlutuante(modoCalculadora,idRetorno);
                    i3GEOF.filtro.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.filtro()",
                        "filtro",
                        "filtro",
                        "dependencias.php",
                        temp);
            },
            msQueryBuilder : function(idtema,id) {
                var temp = function(){
                    i3GEOF.msquerybuilder.start(idtema,id);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.msQueryBuilder()",
                        "msquerybuilder",
                        "msquerybuilder",
                        "dependencias.php",
                        temp);
            },
            busca : function(idtema) {
                var temp = function(){
                    i3GEOF.busca.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.busca()",
                        "busca",
                        "busca",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: tabela
             *
             * Abre a janela de dialogo da ferramenta tabela
             *
             * Parametros:
             *
             * {string} - id que identifica o tema conforme definido no map file
             */
            tabela : function(idtema) {
                if(idtema && idtema != ""){
                    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                    if(t.status < 2){
                        i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                        return;
                    }
                }
                var temp = function(){
                    i3GEOF.tabela.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.tabela()",
                        "tabela",
                        "tabela",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: etiquetas
             *
             * Abre a janela de dialogo da ferramenta etiqueta
             *
             * Parametros:
             *
             * {string} - id que identifica o tema conforme definido no map file
             */
            etiquetas : function(idtema) {
                var temp = function(){
                    i3GEOF.etiqueta.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.etiqueta()",
                        "etiqueta",
                        "etiqueta",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: funcaojstip
             *
             * Abre a janela de dialogo da ferramenta funcaojstip. Utilizado na ferramenta atalhosedicao
             * Permite alterar o metadata que controla a lista de funcoes JS que são mostradas no balao de
             * informacoes quando o usuario clica no mapa
             *
             * Parametros:
             *
             * {string} - id que identifica o tema conforme definido no map file
             */
            funcaojstip : function(idtema) {
                var temp = function(){
                    i3GEOF.funcaojstip.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.funcaojstip()",
                        "funcaojstip",
                        "funcaojstip",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: editaLegenda
             *
             * Abre a janela de dialogo da ferramenta legenda
             *
             * Parametros:
             *
             * {string} - id que identifica o tema conforme definido no map file
             */
            editaLegenda : function(idtema) {
                if(idtema && idtema != ""){
                    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                    if(t.status < 2){
                        i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                        return;
                    }
                }
                var temp = function(){
                    i3GEOF.legenda.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.editaLegenda()",
                        "legenda",
                        "legenda",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: editaClasseLegenda
             *
             * Abre a janela de dialogo da ferramenta legenda deiretamente no editor de simbolo de uma classe especifica
             *
             * Parametros:
             *
             * {string} - id que identifica o tema conforme definido no map file
             */
            editaClasseLegenda : function(idtema,idclasse) {
                var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                if(t.status < 2){
                    i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                    return;
                }
                i3GEO.mapa.ativaTema(idtema);
                var temp = function() {
                    i3GEOF.legenda.aposIniciar = function(){
                        i3GEOF.legenda.classe = 0;
                        i3GEOF.legenda.estilo = 0;
                        i3GEOF.legenda.editaSimbolo('i3GEOlegendaid_'+idtema+"-"+idclasse);
                        i3GEOF.legenda.aposIniciar = function(){};
                    };
                    i3GEOF.legenda.iniciaJanelaFlutuante(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.editaLegenda()",
                        "legenda",
                        "legenda",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: download
             *
             * Abre a janela de dialogo da ferramenta download
             *
             * Parametros:
             *
             * {string} - id que identifica o tema no map file.
             */
            download : function(idtema) {
                var temp = function(){
                    i3GEOF.download.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.download()",
                        "download",
                        "download",
                        "dependencias.php",
                        temp);
            },
            /**
             * Function: ogcwindow
             *
             * Abre uma aba no navegador com as opcoes de acesso aos dados de um tema via OGC
             *
             * Parametros:
             *
             * {string} - id que identifica o tema no map file.
             */
            ogcwindow : function(idtema) {
                i3GEO.mapa.ativaTema(idtema);
                window.open(i3GEO.configura.locaplic+"/ogc.htm?temaOgc="+idtema);
            },
            /**
             * Function: aplicarsld
             *
             * Fax o upload de um arquivo SLD (xml) e aplica ao tema
             *
             * Parametros:
             *
             * {string} - id que identifica o tema no map file.
             */
            aplicarsld : function(idtema) {
                i3GEO.mapa.ativaTema(idtema);
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.aplicarsld()",
                        "aplicarsld",
                        "aplicarsld",
                        "dependencias.php",
                "i3GEOF.aplicarsld.iniciaJanelaFlutuante()");
            },
            /**
             * Function: mudanome
             *
             * Abre uma janela para o usuario definir o novo nome do tema
             *
             * Parametros:
             *
             * {string} - id que identifica o tema no map file.
             */
            mudanome : function(idtema) {
                i3GEO.mapa.ativaTema(idtema);
                var temp = function(){
                    var valor = $i("i3GEOjanelaprompt").value;
                    i3GEO.tema.mudanome(idtema,valor);
                };
                i3GEO.janela.prompt($trad("novonome"),temp);
            },
            selecao : function(idtema) {
                if(idtema && idtema != ""){
                    var t = i3GEO.arvoreDeCamadas.pegaTema(idtema);
                    if(t.status < 2){
                        i3GEO.janela.snackBar({content: $trad("deveLigada"),style: "red"});
                        return;
                    }
                }
                var temp = function(){
                    i3GEOF.selecao.start(idtema);
                };
                i3GEO.util.dialogoFerramenta(
                        "i3GEO.tema.dialogo.selecao()",
                        "selecao",
                        "selecao",
                        "dependencias.php",
                        temp
                );
            },
        }
};
