i3GEO.catalogoWs = {
    WMS: "",
    MIGALHA: [],
    config: {
        'templateDir': 'templates/dir',
        'templateTema': 'templates/tema',
        'idCatalogoPrincipal': 'catalogoPrincipal',
        'idCatalogoNavegacao': 'catalogoNavegacao',
        'idOndeMigalha': 'catalogoMigalha'
    },
    wait: false,
    carregaTemplates: function () {
        var t1 = i3GEO.catalogoWs.config.templateDir,
            t2 = i3GEO.catalogoWs.config.templateTema,
            t3 = $("#" + i3GEO.catalogoWs.config.idOndeMigalha).attr("data-template");
        $.when($.get(t1), $.get(t2), $.get(t3)).done(function (r1, r2, r3) {
            i3GEO.template.dir = r1[0];
            i3GEO.template.tema = r2[0];
            i3GEO.template.catalogoMigalha = r3[0];
            //i3GEO.caixaDeFerramentas.inicia();
        }).fail(function () {
            i3GEO.janela.closeMsg($trad("erroTpl"));
            return;
        });
    },
    aguarde: function () {
        $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).text($trad("o1"));
    },
    atualizaMigalha: function () {
        var migalha = i3GEO.catalogoWs.MIGALHA;
        var n = migalha.length;
        var nome = migalha[n - 1].nome;
        if (migalha[n - 2]) {
            var onclick = migalha[n - 2].onclick;
        } else {
            var onclick = i3GEO.catalogoWs.inicia;
        }
        var t = Mustache.to_html(
            i3GEO.template.catalogoMigalha,
            { "nome": nome, "onclick": "i3GEO.catalogoWs.MIGALHA.pop();i3GEO.catalogoWs.MIGALHA.pop();" + onclick }
        );
        $("#" + i3GEO.catalogoWs.config.idOndeMigalha).html(t);
        $("#i3GEOguiaMovelConteudo").scrollTop(0);
    },
    escondeCatalogoPrincipal: function () {
        $("#" + i3GEO.catalogoWs.config.idCatalogoPrincipal).hide();
    },
    mostraCatalogoPrincipal: function () {
        $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).fadeOut("fast", function () {
            $("#" + i3GEO.catalogoWs.config.idOndeMigalha).hide();
            $("#" + i3GEO.catalogoWs.config.idCatalogoPrincipal).show();
        });
    },
    inicia: function (config) {
        if (i3GEO.catalogoWs.wait == true) {
            return;
        }
        i3GEO.catalogoWs.wait = true;
        if (typeof (console) !== 'undefined')
            console.info("i3GEO.catalogoWs.inicia");

        if (config) {
            $.each(config, function (i, v) {
                i3GEO.catalogoWs.config[i] = v;
            });
        }
        if (!i3GEO.template.dir || !i3GEO.template.tema || !i3GEO.template.catalogoMigalha) {
            i3GEO.catalogoWs.wait = false;
            i3GEO.catalogoWs.carregaTemplates();
            return;
        } else {
            i3GEO.catalogoWs.aguarde();
            i3GEO.catalogoWs.MIGALHA = [
                { "nome": "", "onclick": "i3GEO.catalogoWs.mostraCatalogoPrincipal()" },
                { "nome": "Webservices", "onclick": "i3GEO.catalogoWs.inicia()" }
            ];
            i3GEO.catalogoWs.atualizaMigalha();

            config = i3GEO.catalogoWs.config;

            i3GEO.catalogoWs.escondeCatalogoPrincipal();

            var t = Mustache.to_html(
                i3GEO.template.catalogoMigalha,
                { "nome": 'Webservices', "onclick": "i3GEO.catalogoWs.mostraCatalogoPrincipal()" }
            );

            i3GEO.catalogoWs.config = config;

            var lista = function (dados) {
                var clone = [],
                    t;

                //ajusta o nome
                //verifica se o menu esta na lista de ids definidos em i3GEO.catalogoWs.IDSMENUS
                $.each(dados, function (i, v) {
                    v.onclick = "i3GEO.catalogoWs.listaCamadas('" + v.nome + "'," + v.id_ws + ",'" + v.nome + "','" + v.link + "',0" + ",'" + v.tipo_ws + "','" + v.layer + "')";
                    if (v.tipo_ws == "KML") {
                        v.onclick = "i3GEO.catalogoWs.addkml('" + v.link + "')";
                        v.hiddenfolder = "hidden";
                    }
                    if (v.tipo_ws == "WMS-Time") {
                        v.onclick = "i3GEO.catalogoWs.addwmstime('" + v.link + "','" + v.id_ws + "','" + v.nome + "')";
                        v.hiddenfolder = "hidden";
                    }
                    if (v.tipo_ws == "GEOJSON") {
                        v.onclick = "i3GEO.catalogoWs.addgeojson('" + v.link + "')";
                        v.hiddenfolder = "hidden";
                    }
                    clone.push(v);
                });
                t = Mustache.to_html(
                    "{{#data}}" + i3GEO.template.dir + "{{/data}}",
                    { "data": clone }
                );
                $("#" + config.idCatalogoNavegacao).html(i3GEO.catalogoWs.getAddServicesBtn() + t);
                $("#" + i3GEO.catalogoWs.config.idOndeMigalha).show();
                $("#" + i3GEO.catalogoWs.config.idCatalogoPrincipal).fadeOut("fast", function () {
                    $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).show();
                });
                i3GEO.janela.snackBar({ content: $trad("catatua"), style: 'green' });
            };
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    idioma: i3GEO.idioma.ATUAL,
                    funcao: "pegalistadewebservices"
                },
                prog: "/serverapi/catalog/",
                fn: function (data) {
                    i3GEO.catalogoWs.wait = false;
                    var dados = [];
                    if (data) {
                        dados = data;
                    }
                    lista(dados.sort(i3GEO.util.dynamicSortString("title")));
                }
            });
        }
    },
    listaCamadas: function (nomeMigalha, id_ws, nome, url, nivel, tipo_ws, layer) {
        if (typeof (console) !== 'undefined')
            console.info("i3GEO.catalogoWs.listaCamadas");

        if (i3GEO.catalogoWs.wait == true) {
            return;
        }
        i3GEO.catalogoWs.wait = true;

        var monta;

        i3GEO.catalogoWs.MIGALHA.push({ "nome": nome, "onclick": "i3GEO.catalogoWs.listaCamadas('" + nome + "','" + id_ws + "','" + nome + "','" + url + "','" + nivel + "','" + tipo_ws + "','" + layer + "')" });
        i3GEO.catalogoWs.atualizaMigalha();

        i3GEO.catalogoWs.aguarde();

        if (tipo_ws == "ARCGISREST") {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.catalogoWs.listaCamadas ARCGISREST");

            monta = function (retorno) {
                //a resposta do ARCGIS no primeiro nivel eh uma lista
                //de diretorios no elemento folders
                //na sequencia, retorna lista com os servicos
                //no ultimo nivel, ao listar o WMS, contem o elemento supportedExtensions
                i3GEO.catalogoWs.wait = false;
                var data = retorno.folders,
                    clone = [],
                    g = "",
                    onclick = "",
                    temas;
                if (retorno.services && retorno.services.length > 0) {
                    data = retorno.services;
                }
                //verifica se o proximo nivel e um wms
                if (!retorno.supportedExtensions) {
                    $.each(data, function (i, v) {
                        if (v) {
                            if (!v.name) {
                                onclick = "i3GEO.catalogoWs.listaCamadas('" + v + "'," + id_ws + ",'/" + v + "','" + url + "','','ARCGISREST','" + v + "')";
                                clone.push({
                                    "nome": v,
                                    "descricao": "",
                                    "onclick": onclick
                                });
                            } else {
                                var s = '/' + v.name;
                                var n = v.name;
                                if (v.type && v.type == "MapServer") {
                                    s = '/' + v.name + '/MapServer';
                                }
                                onclick = "i3GEO.catalogoWs.listaCamadas('" + n + "'," + id_ws + ",'" + s + "','" + url + "','','ARCGISREST','" + n + "')";
                                clone.push({
                                    "nome": v.name,
                                    "descricao": "",
                                    "onclick": onclick
                                });
                            }
                        }
                    });
                    if (clone.length > 0) {
                        g = Mustache.to_html(
                            "{{#data}}" + i3GEO.template.dir + "{{/data}}",
                            { "data": clone }
                        );
                        $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).html(g);
                    }
                } else {
                    if (typeof (console) !== 'undefined')
                        console.info("i3GEO.catalogoWs.listaCamadas camadas wms");

                    i3GEO.catalogoWs.listaCamadas(
                        "WMSServer",
                        id_ws,
                        retorno.serviceDescription,
                        url.replace("rest/", "") + nome + "/WMSServer?",
                        0,
                        'wms',
                        'undefined'
                    );
                }
                i3GEO.janela.snackBar({ content: $trad("catatua"), style: 'green' });
            };
            i3GEO.catalogoWs.wait = true;
            var p = i3GEO.configura.locaplic
                + "/serverapi/catalog?"
                + "funcao=GETLAYERSARCGISREST"
                + "&id_ws=" + id_ws
                + "&nomelayer=" + (nomeMigalha == nome ? "" : nome)
                + "&tipo_ws=ARCGISREST";
            $.get(p).done(function (r) {
                i3GEO.catalogoWs.wait = false;
                monta(r);
            }).fail(function () {
                i3GEO.catalogoWs.wait = false;
                i3GEO.janela.closeMsg($trad("erroTpl"));
                return;
            });
        } else {
            monta = function (data) {
                i3GEO.catalogoWs.wait = false;
                var clone = [],
                    g = "",
                    temas;

                //monta a lista com proximo nivel
                if (data.length > 0) {
                    $.each(data, function (i, v) {
                        if (v.nome + " - " + v.titulo !== "undefined - undefined") {
                            v.descricao = v.titulo;
                            if (!v.estilos) {
                                v.onclick = "i3GEO.catalogoWs.listaCamadas('" + nome + "'," + id_ws + ",'" + v.nome + "','" + url + "'," + (nivel * 1 + 1) + ",'" + tipo_ws + "','" + v.titulo + "')";
                                clone.push(v);
                            } else {
                                i3GEO.catalogoWs.temas({
                                    "estilos": v.estilos,
                                    "servico": url,
                                    "layer": v.nome,
                                    "proj": v.srs.toString(),
                                    "formatoimg": v.formats.toString(),
                                    "versao": v.version.toString(),
                                    "formatoinfo": v.formatsinfo.toString()
                                });
                            }
                        }
                    });
                    if (clone.length > 0) {
                        g = Mustache.to_html(
                            "{{#data}}" + i3GEO.template.dir + "{{/data}}",
                            { "data": clone }
                        );
                        $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).html(g);
                    }

                } else {
                    i3GEO.janela.snackBar({ content: "Erro", style: 'red' });
                    $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).html("");
                }
                i3GEO.janela.snackBar({ content: $trad("catatua"), style: 'green' });
            };
            i3GEO.catalogoWs.wait = true;
            var p = i3GEO.configura.locaplic
                + "/serverapi/catalog?"
                + "funcao=GETLAYERSWMS"
                + "&servico=" + url
                + "&nivel=" + ((nivel * 1) + 1)
                + "&id_ws=" + id_ws
                + "&nomelayer=" + layer
                + "&tipo_ws=" + tipo_ws;
            $.get(p).done(function (r) {
                i3GEO.catalogoWs.wait = false;
                monta(r);
            }).fail(function () {
                i3GEO.catalogoWs.wait = false;
                i3GEO.janela.closeMsg($trad("erroTpl"));
                return;
            });
        }
    },
    temas: function (config) {
        if (typeof (console) !== 'undefined')
            console.info(config);

        var clone = [],
            estilos = config.estilos;

        $.each(estilos, function (i, v) {
            if (v.titulo == "default") {
                v.titulo = i3GEO.catalogoWs.MIGALHA[i3GEO.catalogoWs.MIGALHA.length - 1].nome;
            }
            if (config.proj == "") {
                config.proj = i3geoOL.getView().getProjection().getCode();
            }


            i3GEO.mapa.adicionaTemaWMS({
                wms_name: config.layer,
                url: config.servico,
                proj: 'EPSG:4326',
                formatlist: config.formatoimg,
                version: config.versao,
                infoformat: config.formatoinfo,
                layerTitle: v.titulo
            });

            v.nome = estilos[i].nome + " - " + estilos[i].titulo;
            clone.push(v);
        });
        var t = Mustache.to_html(
            "{{#data}}" + i3GEO.template.tema + "{{/data}}",
            { "data": clone }
        );
        $("#" + i3GEO.catalogoWs.config.idCatalogoNavegacao).html(t);
    },
    getAddServicesBtn: function () {
        var itens = [];
        itens.push({
            title: "",
            text: "KML",
            onclick: "i3GEO.catalogoWs.kml()"
        }, {
            title: "",
            text: "GeoJson",
            onclick: "i3GEO.catalogoWs.geojson()"
        }, {
            title: "",
            text: "WMS",
            onclick: "i3GEO.catalogoWs.wms()"
        });
        //TODO incluir essa opcao para permitir digitar uma nova url
        /*,{
    title : "",
    text: "WMS-Time",
    onclick : "i3GEO.catalogoWs.wmst()"
    });
         */
        var t = Mustache.to_html(
            "{{#data}}" + i3GEO.template.botoes.opcoes + "{{/data}}",
            { "data": itens }
        );
        var btn = ""
            + "<div class='servicesbtn container-fluid container-tools'>"
            + "<div class='form-group condensed'>"
            + t
            + "</div>"
            + "</div>";
        return btn;
    },
    kml: function () {
        i3GEO.util.scriptTag(i3GEO.configura.locaplic
            + "/ferramentas/conectarkml/dependencias.php",
            "i3GEOF.conectarkml.start()",
            "i3GEOF.conectarkml_script");
    },
    geojson: function () {
        i3GEO.util.scriptTag(i3GEO.configura.locaplic
            + "/ferramentas/conectargeojson/dependencias.php",
            "i3GEOF.conectargeojson.start()",
            "i3GEOF.conectargeojson_script");
    },
    wmst: function () {
        i3GEO.util.scriptTag(i3GEO.configura.locaplic
            + "/ferramentas/wmstime/dependencias.php",
            "i3GEOF.wmstime.start()",
            "i3GEOF.wmstime_script");
    },
    wms: function () {
        i3GEO.util.scriptTag(i3GEO.configura.locaplic
            + "/ferramentas/conectarwms/dependencias.php",
            "i3GEOF.conectarwms.start()",
            "i3GEOF.conectarwms_script");
    },
    addwmstime: function (url, id_ws, titulo) {
        var temp = function () {
            i3GEOF.wmstime.start(url, id_ws, titulo);
        };
        i3GEO.util.scriptTag(i3GEO.configura.locaplic
            + "/ferramentas/wmstime/dependencias.php",
            temp,
            "i3GEOF.wmstime_script");
    },
    addkml: function (url) {
        if (i3GEO.catalogoWs.wait == true) {
            return;
        }
        i3GEO.catalogoWs.wait = true;
        i3GEO.janela.abreAguarde();
        var par = {
            g_sid: i3GEO.configura.sid,
            funcao: "crialayer",
            url: url
        };
        $.get(
            i3GEO.configura.locaplic + "/ferramentas/conectarkml/exec.php",
            par
        )
            .done(
                function (data, status) {
                    i3GEO.catalogoWs.wait = false;
                    i3GEO.mapa.refresh();
                    i3GEO.janela.fechaAguarde();
                    i3GEO.janela.snackBar({ content: $trad("camadaadic") });
                }
            )
            .fail(
                function (data) {
                    i3GEO.catalogoWs.wait = false;
                    i3GEO.janela.fechaAguarde();
                    i3GEO.janela.snackBar({ content: data.status, style: 'red' });
                }
            );
    },
    addgeojson: function (url) {
        if (i3GEO.catalogoWs.wait == true) {
            return;
        }
        i3GEO.catalogoWs.wait = true;
        i3GEO.janela.abreAguarde();
        var par = {
            g_sid: i3GEO.configura.sid,
            funcao: "crialayer",
            url: url
        };
        $.get(
            i3GEO.configura.locaplic + "/ferramentas/conectargeojson/exec.php",
            par
        )
            .done(
                function (data, status) {
                    i3GEO.catalogoWs.wait = false;
                    i3GEO.mapa.refresh();
                    i3GEO.janela.fechaAguarde();
                    i3GEO.janela.snackBar({ content: $trad("camadaadic") });
                }
            )
            .fail(
                function (data) {
                    i3GEO.catalogoWs.wait = false;
                    i3GEO.janela.fechaAguarde();
                    i3GEO.janela.snackBar({ content: data.status, style: 'red' });
                }
            );
    }
};
