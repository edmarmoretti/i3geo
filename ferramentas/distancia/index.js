if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.distancia =
{
        /**
         * Armazena os pontos clicados para realizar os calculos
         */
        pontos : {},
        /**
         * Armazena o WKT da ultima linha
         */
        ultimoWkt : "",
        /**
         * Armazena a ultima medida
         */
        ultimaMedida : "",
        MUSTACHE : "",
        /**
         * Susbtitutos para o template
         */
        mustacheHash : function() {
            var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.distancia.dicionario);
            dicionario["sid"] = i3GEO.configura.sid;
            dicionario["locaplic"] = i3GEO.configura.locaplic;
            dicionario["caixaDeEstilos"] = i3GEO.desenho.caixaEstilos();
            return dicionario;
        },
        inicia : function(iddiv) {
            if(i3GEOF.distancia.MUSTACHE == ""){
                $.get(i3GEO.configura.locaplic + "/ferramentas/distancia/template_mst.html", function(template) {
                    i3GEOF.distancia.MUSTACHE = template;
                    i3GEOF.distancia.inicia(iddiv);
                });
                return;
            }
            i3GEO.eventos.cliquePerm.desativa();
            $i(iddiv).innerHTML = i3GEOF.distancia.html();
            //$('.collapse').collapse();
            i3GEOF.distancia[i3GEO.Interface["ATUAL"]].inicia();
        },
        perfil: function (){
            var js = i3GEO.configura.locaplic + "/ferramentas/perfil/dependencias.php", temp = function() {
                i3GEOF.perfil.iniciaJanelaFlutuante(i3GEO.analise.pontos);
            };
            i3GEO.util.scriptTag(js, temp, "i3GEOF.perfil_script");
        },
        /*
         * Function: html
         *
         * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
         *
         * Retorno:
         *
         * String com o c&oacute;digo html
         */
        html : function() {
            var ins = Mustache.render(i3GEOF.distancia.MUSTACHE, i3GEOF.distancia.mustacheHash());
            return ins;
        },
        isOn : function() {
            if($i("i3GEOF.distancia")){
                return true;
            } else {
                return false;
            }
        },
        /*
         * Function: iniciaJanelaFlutuante
         *
         * Cria a janela flutuante para controle da ferramenta.
         */
        iniciaJanelaFlutuante : function() {
            var minimiza, cabecalho, janela, divid, temp, titulo,imagemxy;
            if ($i("i3GEOF.distancia")) {
                return;
            }
            cabecalho = "";
            minimiza = "";
            // cria a janela flutuante
            titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("distAprox") + "</span></div>";
            janela =
                i3GEO.janela.cria(
                        "355px",
                        "auto",
                        "",
                        "",
                        "",
                        titulo,
                        "i3GEOF.distancia",
                        false,
                        "hd",
                        cabecalho,
                        minimiza,
                        "",
                        true,
                        "",
                        "",
                        "nao",
                        "",
                        "50"
                );
            divid = janela[2].id;
            i3GEOF.distancia.inicia(divid);
            temp = function() {
                i3GEO.distancia.pontos = {};
                var janela;
                i3GEO.eventos.cliquePerm.ativa();
                janela = YAHOO.i3GEO.janela.manager.find("distancia");
                if (janela) {
                    YAHOO.i3GEO.janela.manager.remove(janela);
                    janela.destroy();
                }
                i3GEOF.distancia[i3GEO.Interface["ATUAL"]].fechaJanela();

                i3GEO.analise.pontos = {
                        xpt : [],
                        ypt : []
                };
            };
            YAHOO.util.Event.addListener(janela[0].close, "click", temp);
            imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
            janela[0].moveTo(imagemxy[0] + 150, imagemxy[1]);
        },
        /*
         * Function: ativaFoco
         *
         * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
         */
        ativaFoco : function() {
        },
        /**
         * Converte a lista de pontos em WKT
         */
        pontos2wkt : function() {
            var pontos = [], x = i3GEOF.distancia.pontos.xpt, y = i3GEOF.distancia.pontos.ypt, n = x.length, i;
            for (i = 0; i < n; i++) {
                pontos.push(x[i] + " " + y[i]);
            }
            return "LINESTRING(" + pontos.join(",") + ")";
        },
        removeFiguras : function(){
            i3GEOF.distancia[i3GEO.Interface["ATUAL"]].removeFiguras();
        },
        /**
         * Funcoes especificas da interface openlayers
         */
        openlayers : {
            draw : "",
            estilo: "",
            featureListener : null,
            //numero de pontos da geometria atual
            //utilizado para saber se houve um clique ou nao
            numpontos : 0,
            removeControle : function() {
                i3geoOL.removeInteraction(i3GEOF.distancia.openlayers.draw);
                i3GEOF.distancia.openlayers.draw = "";
            },
            /**
             * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
             * layer para receber os graficos
             */
            inicia : function() {
                i3GEOF.distancia.openlayers.estilo =
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 5
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 153, 0, 0.8)'
                        })
                    });
                i3GEO.desenho.estiloPadrao = "normal";
                var m = i3GEOF.distancia.openlayers;
                i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
                m.removeControle();
                m.draw = new ol.interaction.Draw({
                    type : "LineString"
                });
                i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
                m.draw.on("drawend", function(evt) {
                    evt.feature.setProperties({
                        origem : "medeDistancia"
                    });
                    var m = i3GEOF.distancia.openlayers;
                    evt.feature.setStyle(
                            new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao].linecolor,
                                    width: 5
                                })
                            })
                    );
                    i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
                    m.draw.setActive(false);
                    m.draw.setActive(true);
                });
                m.draw.on('drawstart', function(evt) {
                    i3GEOF.distancia.pontos = {
                            xpt : [],
                            ypt : [],
                            dist : []
                    };
                    //usado no perfil
                    i3GEO.analise.pontos = {
                            xpt : [],
                            ypt : []
                    };
                    var m = i3GEOF.distancia.openlayers,
                    sketch = evt.feature;
                    m.estilo = sketch.getStyle();
                    m.numpontos = 1;
                    m.featureListener = sketch.getGeometry().on('change', function(evt) {
                        var ponto,
                        geom = evt.target,
                        coords = geom.getCoordinates(),
                        n = coords.length,
                        m = i3GEOF.distancia.openlayers;
                        ponto = new ol.geom.Point(coords[n-1]);
                        if(m.numpontos === n-1){
                            //clicou
                            m.numpontos = n;
                            m.point(ponto);
                        }
                        else{
                            m.modify(ponto);
                        }
                    });
                });
                i3geoOL.addInteraction(m.draw);
            },
            modify : function(point) {
                var temp, n, x1, y1, x2, y2, trecho, parcial, direcao,
                coord = point.getCoordinates();
                n = i3GEOF.distancia.pontos.ypt.length;
                if (n > 0) {
                    x1 = i3GEOF.distancia.pontos.xpt[n - 1];
                    y1 = i3GEOF.distancia.pontos.ypt[n - 1];
                    x2 = coord[0];
                    y2 = coord[1];
                    // projeta
                    if (i3GEO.Interface.openlayers.googleLike) {
                        temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
                        temp = temp.split(" ");
                        x1 = temp[0];
                        y1 = temp[1];
                        x2 = temp[2];
                        y2 = temp[3];
                    }
                    trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
                    parcial = i3GEOF.distancia.openlayers.somaDist();
                    direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
                    direcao = i3GEO.calculo.dd2dms(direcao, direcao);
                    direcao = direcao[0];
                    i3GEOF.distancia.openlayers.mostraParcial(trecho, parcial, direcao);
                }
            },
            point : function(point) {
                i3GEO.eventos.cliquePerm.desativa();
                var n, x1, y1, x2, y2, trecho, temp, circ, label, raio,
                estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
                coord = point.getCoordinates(),
                total = 0;
                i3GEOF.distancia.pontos.xpt.push(coord[0]);
                i3GEOF.distancia.pontos.ypt.push(coord[1]);
                i3GEO.analise.pontos.xpt.push(coord[0]);
                i3GEO.analise.pontos.ypt.push(coord[1]);
                n = i3GEOF.distancia.pontos.ypt.length;
                if (n > 1) {
                    x1 = i3GEOF.distancia.pontos.xpt[n - 2];
                    y1 = i3GEOF.distancia.pontos.ypt[n - 2];
                    x2 = coord[0];
                    y2 = coord[1];
                    raio = new ol.geom.LineString([[x1, y1],[x2, y2]]).getLength();
                    // projeta
                    if (i3GEO.Interface.openlayers.googleLike) {
                        temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
                        temp = temp.split(" ");
                        x1 = temp[0];
                        y1 = temp[1];
                        x2 = temp[2];
                        y2 = temp[3];
                    }
                    trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
                    i3GEOF.distancia.pontos.dist.push(trecho);
                    total = i3GEOF.distancia.openlayers.somaDist();
                    i3GEOF.distancia.openlayers.mostraTotal(trecho, total);
                    i3GEOF.distancia.ultimoWkt = i3GEOF.distancia.pontos2wkt();
                    // raio
                    if ($i("pararraios") && $i("pararraios").checked === true) {

                        temp = i3GEO.util.projGeo2OSM(new ol.geom.Point([x1*1, y1*1]));
                        circ = new ol.Feature({
                            geometry: new ol.geom.Circle(temp.getCoordinates(),raio)
                        });
                        circ.setProperties({
                            origem : "medeDistanciaExcluir"
                        });

                        circ.setStyle(
                                new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: estilo.circcolor,
                                        width: 1
                                    }),
                                    zIndex: 2
                                })
                        );

                        i3GEO.desenho.layergrafico.getSource().addFeature(circ);
                    }
                    // desenha ponto
                    if ($i("parartextos") && $i("parartextos").checked === true) {
                        label = new ol.Feature({
                            geometry: i3GEO.util.projGeo2OSM(new ol.geom.Point([x2*1, y2*1]))
                        });
                        label.setProperties({
                            origem : "medeDistanciaExcluir"
                        });
                        label.setStyle(
                                new ol.style.Style({
                                    image: new ol.style.Circle({
                                        radius: 3,
                                        fill: new ol.style.Fill({
                                            color: estilo.circcolor
                                        }),
                                        stroke: new ol.style.Stroke({
                                            color: estilo.circcolor,
                                            width: 1
                                        })
                                    }),
                                    text: new ol.style.Text({
                                        text: trecho.toFixed(3),
                                        font: 'Bold 14px Arial',
                                        textAlign: 'left',
                                        stroke: new ol.style.Stroke({
                                            color: 'white',
                                            width: 1
                                        }),
                                        fill: new ol.style.Fill({
                                            color: estilo.textcolor
                                        }),
                                        zIndex: 2000
                                    })
                                })
                        );
                        i3GEO.desenho.layergrafico.getSource().addFeature(label);
                    }
                }
            },
            /**
             * Soma os valores de distancia guardados em pontos.dist
             */
            somaDist : function() {
                var n, i, total = 0;
                n = i3GEOF.distancia.pontos.dist.length;
                for (i = 0; i < n; i++) {
                    total += i3GEOF.distancia.pontos.dist[i];
                }
                return total;
            },
            /**
             * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
             * atributo "origem" Os raios e pontos sao sempre removidos
             */
            fechaJanela : function() {
                i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
                var m = i3GEOF.distancia.openlayers;
                ol.Observable.unByKey(m.featureListener);
                m.featureListener = null;
                m.removeControle();
                m.numpontos = 0;
                i3GEO.eventos.cliquePerm.ativa();
                i3GEOF.distancia.openlayers.removeFiguras();
            },
            removeFiguras: function(){
                var features, n, f, i, remover = [], temp;
                features = i3GEO.desenho.layergrafico.getSource().getFeatures();
                n = features.length;
                for (i = 0; i < n; i++) {
                    f = features[i];
                    if (f.getProperties().origem === "medeDistancia" || f.getProperties().origem === "medeDistanciaExcluir") {
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
            mostraTotal : function(trecho, total) {
                var mostra = $i("mostradistancia_calculo"), texto;
                if (mostra) {
                    texto =
                        "total <br>" + $trad("x96")
                        + " km: "
                        + total.toFixed(3)
                        + "<br>"
                        + $trad("x96")
                        + " m: "
                        + (total * 1000).toFixed(2)
                        + "<br>"
                        + $trad("x25")
                        + ": "
                        + i3GEO.calculo.metododistancia;
                    mostra.innerHTML = texto + "<hr>";
                }
            },
            /**
             * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
             */
            mostraParcial : function(trecho, parcial, direcao) {
                var mostra = $i("mostradistancia_calculo_movel"), texto;
                if (mostra) {
                    texto =
                        "parcial <br>" + $trad("x95")
                        + " km: "
                        + trecho.toFixed(3)
                        + "<br>"
                        + $trad("x97")
                        + " km: "
                        + (parcial + trecho).toFixed(3)
                        + "<br>"
                        + $trad("x23")
                        + " (DMS): "
                        + direcao;
                    mostra.innerHTML = texto;
                }
            }
        },
        googlemaps : {
            /**
             * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
             * layer para receber os graficos
             */
            inicia : function() {
                i3GEOF.distancia.pontos = {
                        xpt : [],
                        ypt : [],
                        dist : []
                };
                i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
                i3GeoMap.setOptions({
                    disableDoubleClickZoom : true
                });
                i3GeoMap.setOptions({
                    draggableCursor : 'crosshair'
                });
                var t, evtdblclick = null, evtclick = null, evtmousemove = null, pontos = {
                        xpt : [],
                        ypt : [],
                        dist : [],
                        mvcLine : new google.maps.MVCArray(),
                        mvcMarkers : new google.maps.MVCArray(),
                        line : null,
                        polygon : null
                }, termina = function() {
                    google.maps.event.removeListener(evtdblclick);
                    google.maps.event.removeListener(evtclick);
                    google.maps.event.removeListener(evtmousemove);
                    pontos.line.setOptions({
                        clickable : true
                    });
                    google.maps.event.addListener(pontos.line, 'click', function(shape) {
                        if (shape.setEditable) {
                            shape.setEditable(!shape.editable);
                        }
                    });
                    i3GEOF.distancia.ultimoWkt = i3GEOF.distancia.pontos2wkt();
                    t = i3GEOF.distancia.googlemaps.somaDist(pontos);
                    i3GEOF.distancia.ultimaMedida = t.toFixed(3) + " km";
                    if (pontos) {
                        i3GEO.desenho.googlemaps.shapes.push(pontos.mvcLine);
                        i3GEO.desenho.googlemaps.shapes.push(pontos.line);
                        pontos = null;
                    }
                };
                evtclick = google.maps.event.addListener(i3GeoMap, "click", function(evt) {
                    i3GEO.eventos.cliquePerm.desativa();
                    var x1, x2, y1, y2, trecho = 0, total, n;
                    // When the map is clicked, pass the LatLng obect to the
                    // measureAdd function
                    pontos.mvcLine.push(evt.latLng);
                    pontos.xpt.push(evt.latLng.lng());
                    pontos.ypt.push(evt.latLng.lat());
                    i3GEOF.distancia.pontos.xpt.push(evt.latLng.lng());
                    i3GEOF.distancia.pontos.ypt.push(evt.latLng.lat());
                    n = pontos.xpt.length;
                    // desenha um circulo
                    if (pontos.mvcLine.getLength() > 1) {
                        x1 = pontos.xpt[n - 2];
                        y1 = pontos.ypt[n - 2];
                        x2 = evt.latLng.lng();
                        y2 = evt.latLng.lat();
                        // raio =
                        // google.maps.geometry.spherical.computeDistanceBetween(evt.latLng,new
                        // google.maps.LatLng(y1,x1))
                        trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
                        pontos.dist.push(trecho);
                        total = i3GEOF.distancia.googlemaps.somaDist(pontos);
                        i3GEOF.distancia.googlemaps.mostraTotal(trecho, total);
                        if ($i("pararraios") && $i("pararraios").checked === true) {
                            i3GEO.desenho.googlemaps.shapes.push(new google.maps.Circle({
                                map : i3GeoMap,
                                fillOpacity : 0,
                                clickable : false,
                                strokeColor : "black",
                                strokeOpacity : 1,
                                strokeWeight : 2,
                                center : new google.maps.LatLng(y1, x1),
                                radius : trecho * 1000,
                                origem : "medeDistanciaExcluir"
                            }));
                        }
                    }
                    // desenha uma marca no ponto
                    if ($i("parartextos") && $i("parartextos").checked === true) {
                        i3GEO.desenho.googlemaps.shapes.push(new google.maps.Marker({
                            map : i3GeoMap,
                            fillOpacity : 0,
                            clickable : false,
                            position : evt.latLng,
                            icon : {
                                path : google.maps.SymbolPath.CIRCLE,
                                scale : 2.5,
                                strokeColor : "#ffffff",
                                title : trecho.toFixed(0) + " km"
                            },
                            origem : "medeDistanciaExcluir"
                        }));
                    }
                    // mais um ponto para criar uma linha movel
                    pontos.mvcLine.push(evt.latLng);
                });
                evtmousemove =
                    google.maps.event.addListener(i3GeoMap, "mousemove", function(evt) {
                        if (!$i("mostradistancia_calculo")) {
                            termina.call();
                            return;
                        }
                        var x1, y1, x2, y2, direcao, parcial, estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao], n =
                            pontos.xpt.length;

                        // If there is more than one vertex on the line
                        if (pontos.mvcLine.getLength() > 0) {
                            // If the line hasn't been created yet
                            if (!pontos.line) {
                                // Create the line (google.maps.Polyline)
                                pontos.line = new google.maps.Polyline({
                                    map : i3GeoMap,
                                    clickable : false,
                                    strokeColor : estilo.linecolor,
                                    strokeOpacity : 1,
                                    strokeWeight : estilo.linewidth,
                                    path : pontos.mvcLine,
                                    origem : "medeDistancia"
                                });
                            }
                            pontos.mvcLine.pop();
                            pontos.mvcLine.push(evt.latLng);
                            parcial = i3GEOF.distancia.googlemaps.somaDist(pontos);
                            x1 = pontos.xpt[n - 1];
                            y1 = pontos.ypt[n - 1];
                            x2 = evt.latLng.lng();
                            y2 = evt.latLng.lat();
                            // raio =
                            // google.maps.geometry.spherical.computeDistanceBetween(evt.latLng,new
                            // google.maps.LatLng(y1,x1))
                            trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
                            direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
                            direcao = i3GEO.calculo.dd2dms(direcao, direcao);
                            direcao = direcao[0];
                            i3GEOF.distancia.googlemaps.mostraParcial(trecho, parcial, direcao);
                        }
                    });
                evtdblclick = google.maps.event.addListener(i3GeoMap, "dblclick", function(evt) {
                    termina.call();
                });
            },
            /**
             * Soma os valores de distancia guardados em pontos.dist
             */
            somaDist : function(pontos) {
                var n, i, total = 0;
                n = pontos.dist.length;
                for (i = 0; i < n; i++) {
                    total += pontos.dist[i];
                }
                return total;
            },
            /**
             * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
             * atributo "origem" Os raios e pontos sao sempre removidos
             */
            fechaJanela : function() {
                i3GeoMap.setOptions({
                    disableDoubleClickZoom : false
                });
                i3GeoMap.setOptions({
                    draggableCursor : undefined
                });
                i3GEOF.distancia.googlemaps.removeFiguras();
            },
            removeFiguras: function(){
                var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "medeDistancia");
                if (f && f.length > 0) {
                    temp = window.confirm($trad("x94"));
                    if (temp) {
                        i3GEO.desenho.googlemaps.destroyFeatures(f);
                    }
                }
                f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "medeDistanciaExcluir");
                if (f && f.length > 0) {
                    i3GEO.desenho.googlemaps.destroyFeatures(f);
                }
            },
            /**
             * Mostra a totalizacao das linhas ja digitalizadas
             */
            mostraTotal : function(trecho, total) {
                var mostra = $i("mostradistancia_calculo"), texto;
                if (mostra) {
                    texto =
                        "<b>" + $trad("x96")
                        + ":</b> "
                        + total.toFixed(3)
                        + " km"
                        + "<br><b>"
                        + $trad("x96")
                        + ":</b> "
                        + (total * 1000).toFixed(2)
                        + " m"
                        + "<br>"
                        + $trad("x25")
                        + ": "
                        + i3GEO.calculo.metododistancia;
                    mostra.innerHTML = texto;
                }
            },
            /**
             * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
             */
            mostraParcial : function(trecho, parcial, direcao) {
                var mostra = $i("mostradistancia_calculo_movel"), texto;
                if (mostra) {
                    texto =
                        "<b>" + $trad("x95")
                        + ":</b> "
                        + trecho.toFixed(3)
                        + " km"
                        + "<br><b>"
                        + $trad("x97")
                        + ":</b> "
                        + (parcial + trecho).toFixed(3)
                        + " km"
                        + "<br><b>"
                        + $trad("x23")
                        + " (DMS):</b> "
                        + direcao;
                    mostra.innerHTML = texto;
                }
            }
        }
};