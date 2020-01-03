if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.identify =
{
        _wait: "",
        BALAOATIVO: true,
        BALAOPROP : {
            url: "",
            templateModal: "",
            removeAoAdicionar : true,
            classeCadeado : "i3GEOiconeAberto",
            autoPan : false,
            autoPanAnimation : {
                duration : 250,
                easing: ol.easing.inAndOut
            },
            minWidth : '200px',
            modal: false,
            simple: true,
            openTipNoData: true,
            baloes : []
        },
        createTooltip: function (retorno){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.createTooltip()");

            var x = retorno.point.x,
            y = retorno.point.y,
            layer = "",
            textCopy = [],
            tituloHtml = "",
            temp,
            ins = "",
            funcoesjsHtml = "",
            btnMaisHtml = "",
            contentHtml = "",
            contentHtmlTemp = "",
            wkts = [];
            i3GEO.eventos.cliquePerm.status = true;
            for (const layerName of Object.keys(retorno.layers)) {
                layer = retorno.layers[layerName];
                textCopy.push(layer.layerTitle);
                //para os nomes de funcoes embutidas
                //funcoes sao configuradas no mapfile
                //exemplo do METADATA
                //"FUNCOESJS" '[{"tipo":"layer","titulo":"teste fake"},{"tipo":"registro","titulo":"teste de nome de uma função","script":"../aplicmap/dados/testefuncaojs.js","funcao":"funcao1","parametros":["FIPS_CNTRY","LONG_NAME"]}]'
                temp = [];
                $.each( layer.funcoesjs, function( key, value ) {
                    if(value.tipo == "layer"){
                        var parametros = [x,y,layerName];
                        parametros = "\"" + parametros.join("\",\"") + "\"";
                        temp.push("<a class='toolTipBalaoFuncoes' href='javascript:void(0);' onclick='" + value.funcao + "(" + parametros + ")' >" + value.titulo + "</a><br>");
                        //adiciona o javascript que contem a funcao
                        if(value.script && value.script != ""){
                            i3GEO.util.scriptTag(value.script, "", "funcaolayer"+value.funcao, false);
                        }
                    }
                });
                funcoesjsHtml = temp.join(" ");

                btnMaisHtml = "<button style='margin: 2px;padding: 0px;vertical-align: middle;position: relative;top: -7px;' class='btn btn-default btn-xs' onclick=\"i3GEO.identify.layer(" + x + "," + y + ",'" + layerName + "');return false;\" ><span style='opacity:0.5;vertical-align: middle;padding: 0px;' class='material-icons'>info</span></button>";
                tituloHtml = "<div class='toolTipBalaoTitulo'>"
                    + btnMaisHtml
                    + " <b>" + layer.layerTitle + "</b><br>"
                    + funcoesjsHtml + "</div>";

                contentHtmlTemp = "";
                for (const data of layer.data) {
                    contentHtmlTemp += "<div class='toolTipBalaoTexto'>";
                    for (const column of Object.keys(data.values)) {
                        temp = "";
                        var alias = data.values[column].alias;
                        var valor = data.values[column].value;
                        var link = data.values[column].link;
                        var img = data.values[column].img;
                        var estilo = "tooltip-"+layerName;
                        if (valor !== "" && link === "") {
                            temp += "<span class='"+estilo+"'><label>" + alias + ": </label>" + valor + "</span><br>";
                            textCopy.push(alias + ":" + valor);
                        }
                        if (valor !== "" && link !== "") {
                            temp +=
                                "<span class='"+estilo+"'><label>" + alias
                                + " : </label><a style='color:blue;cursor:pointer' target=_blanck href='"
                                + link
                                + "' >"
                                + valor
                                + "</a></span><br>";
                            textCopy.push(alias + ":" + valor);
                        }
                        if (img !== "") {
                            temp += img + "<br>";
                        }
                        if (data.values[column].tip.toLowerCase() === "sim") {
                            contentHtmlTemp += temp;
                        }
                        //insere o wkt se existir
                        if(column == "wkt" && data.values["wkt"]["value"] != ""){
                            //wkts[r].wkt.valor
                            //wkts[r].hash
                            data.values["tema"] = layerName;
                            data.values["wkt"] = {"valor":data.values["wkt"]["value"]};
                            wkts.push(data.values);
                            i3GEO.mapa.addWktToGraphicLayer([data.values],layer.layerTitle);
                        }
                    }
                    //para os nomes de funcoes embutidas
                    //funcoes sao configuradas no mapfile
                    //exemplo do METADATA
                    //"FUNCOESJS" '[{"tipo":"layer","titulo":"teste fake"},{"tipo":"registro","titulo":"teste de nome de uma função","script":"../aplicmap/dados/testefuncaojs.js","funcao":"funcao1","parametros":["FIPS_CNTRY","LONG_NAME"]}]'
                    var temp1 = [];
                    $.each( layer.funcoesjs, function( key, value ) {
                        if(value.tipo == "registro"){
                            var parametros = [x,y,layerName];
                            $.each( value.parametros, function( key1, value1 ) {
                                parametros.push(ds[s][value1].valor);
                            });
                            parametros = "\"" + parametros.join("\",\"") + "\"";
                            temp1.push("<a class='toolTipBalaoFuncoes' href='javascript:void(0);' onclick='" + value.funcao + "(" + parametros + ")' >" + value.titulo + "</a><br>");
                            //adiciona o javascript que contem a funcao
                            if(value.script && value.script != ""){
                                i3GEO.util.scriptTag(value.script, "", "funcaolayer"+value.funcao, false);
                            }
                        }
                    });
                    temp1 = temp1.join(" ");
                    contentHtmlTemp += temp1 + "</div>";
                }
                if (contentHtmlTemp !== "") {
                    contentHtml += tituloHtml + contentHtmlTemp;
                }
            }
            contentHtml += "<br>";
            if(i3GEO.identify.BALAOPROP.modal == true){
                i3GEO.janela.closeMsg(contentHtml);
            } else {
                var painel = i3GEO.identify.addTooltip(contentHtml, textCopy, x, y, true, wkts);
            }
        },
        queryVectorLayers: function(painel,x,y){
            var pixel = i3geoOL.getPixelFromCoordinate(i3GEO.util.projGeo2OSM(new ol.geom.Point([x, y])).getCoordinates());
            var dados = {};
            i3geoOL.forEachFeatureAtPixel(
                    pixel,
                    function(feature, layer) {
                        if (typeof (console) !== 'undefined')
                            console.info("i3geoOL.forEachFeatureAtPixel mapa.js");

                        var texto = "";
                        var prop = feature.getProperties();
                        if(feature.get("fat")){
                            var fat = feature.get("fat");
                            var chaves = i3GEO.util.listaChaves(fat);
                            var c = chaves.length;
                            //for (var i = 0; i < c; i++) {
                            $.each(chaves,function( index, element ){
                                var elementTitulo = element;
                                var e = fat[element];
                                if(e.alias && e.alias != ""){
                                    elementTitulo = e.alias;
                                }
                                if(e.tip != "nao"){
                                    if( e.valor != undefined){
                                        texto += elementTitulo + ": " + e.valor + "<br>";
                                    } else {
                                        texto += elementTitulo + ": " + e + "<br>";
                                    }
                                }
                            });
                            //}
                        } else {
                            var chaves = feature.getKeys();
                            var c = chaves.length;
                            for (var i = 0; i < c; i++) {
                                if (chaves[i] != "geometry" && chaves[i] != "styleUrl") {
                                    texto += chaves[i] + ": " + prop[chaves[i]] + "<br>";
                                }
                            }
                        }
                        if(layer){
                            if(dados[layer.get("name")]){
                                dados[layer.get("name")].push(texto);
                            } else {
                                dados[layer.get("name")] = [texto];
                            }
                        } else if (prop.nameLayer && prop.nameLayer != "") {
                            if(dados[prop.nameLayer]){
                                dados[prop.nameLayer].push(texto);
                            } else {
                                dados[prop.nameLayer] = [texto];
                            }
                        }
                    },
                    {
                        hitTolerance: i3GEO.configura.ferramentas.identifica.resolution
                    }
            );
            var html = [];
            for(let d of Object.keys(dados)){
                if(i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[d]){
                    html.push("<div class='toolTipBalaoTitulo'><b>" + i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[d].tema + "</b><br></div>");
                } else {
                    html.push("<div class='toolTipBalaoTitulo'><b>" + d + "</b></div>");
                }
                html.push("<div class='toolTipBalaoTexto'>" + dados[d].join("<br>") + "</div>");
            }
            if(painel){
                $(painel).find(".tooltip-conteudo").prepend(html.join(""));
            }
        },
        showCoordinates: function (x,y){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.showCoordinates()");

            if(i3GEO.identify.BALAOPROP.openTipNoData == false){
                return;
            }
            i3GEO.eventos.cliquePerm.status = true;
            if(i3GEO.identify.BALAOPROP.modal == false){
                var painel = i3GEO.identify.addTooltip(
                        "",
                        "",
                        x,
                        y,
                        true,
                        0,
                        false
                );
                i3GEO.identify.queryVectorLayers(painel,x,y);
            }
        },
        identifica : function({after = false, x = 0, y = 0, resolution = 1, layerNames = [], allColumns = false}={}) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.identifica()");

            if(layerNames.length == 0){
                i3geoOL.removeOverlay(i3GEO.identify._wait);
                i3GEO.identify.showCoordinates(x,y);
                return;
            }
            // verifica se nao e necessario alterar as coordenadas
            extent = i3GEO.mapa.getExtent().geo;
            var par = {
                    x: x,
                    y: y,
                    resolution: resolution,
                    extent: extent,
                    layerNames: layerNames,
                    allColumns: allColumns
            };
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: par,
                prog: "/restmapserver/map/" + i3GEO.configura.sid + "/identify",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
        },
        addTooltip : function(texto, textCopy, x, y, botaoProp, wkts) {
            if (typeof (console) !== 'undefined')
                console.info("monta o balao de identificacao e mostra na tela");

            var hash = {
                    "x": x,
                    "y": y,
                    "xtxt": $.number(x,3,$trad("dec"),$trad("mil")),
                    "ytxt": $.number(y,3,$trad("dec"),$trad("mil")),
                    "resolution": i3GEO.configura.ferramentas.identifica.resolution,
                    "tolerancia": $trad("tolerancia")
            };
            var nwkts = wkts.length;
            if(botaoProp === undefined){
                botaoProp = true;
            }
            hash.texto = texto;

            var createinfotooltip = function(){
                if (typeof (console) !== 'undefined')
                    console.info("createinfotooltip");

                var icone,
                painel,
                b,
                cabecalho,
                conteudo,
                removeBaloes,
                html,
                p = i3GEO.identify.BALAOPROP,
                removeBaloes = function(removeWkt) {
                    if (typeof (console) !== 'undefined')
                        console.info("Removendo baloes com removeWkt = " + removeWkt);

                    var nd,t, n = i3GEO.identify.BALAOPROP.baloes.length, i;
                    for (i = 0; i < n; i++) {
                        t = i3GEO.identify.BALAOPROP.baloes[i];
                        if(t.get("origem") == "balao"){
                            i3geoOL.removeOverlay(t);
                        }
                    }
                    i3GEO.identify.BALAOPROP.baloes = [];
                    if(removeWkt == true && i3GEO.desenho.layergrafico){
                        i3GEO.desenho.removePins();
                    } else if (i3GEO.desenho.layergrafico) {
                        //muda o namespace para nao remover em um proximo
                        //evento de excluir o balao
                        var features, n, f, i;
                        features = i3GEO.desenho.layergrafico.getSource().getFeatures();
                        n = features.length;
                        for (i = 0; i < n; i++) {
                            if(features[i].get("origem") == "pin"){
                                features[i].set("origem","identifica");
                            }
                        }
                    }
                    return false;
                };
                if (p.removeAoAdicionar === true && i3GEO.identify.BALAOPROP.baloes.length > 0) {
                    removeBaloes(true);
                }
                if (i3GEO.eventos.cliquePerm.ativo === false) {
                    return;
                }
                hash.minWidth = p.minWidth;
                hash.lock_open = "hidden";
                hash.lock = "hidden";
                if (p.removeAoAdicionar === true) {
                    hash.lock_open = "";
                } else {
                    hash.lock = "";
                }
                // icone das propriedades
                hash.botaoProp = "hidden";
                if(botaoProp === true){
                    hash.botaoProp = "";
                }
                //icone para remover o balao sem remover wkt
                hash.wkt = "hidden";
                if(nwkts && nwkts > 0){
                    hash.wkt = "";
                }
                painel = document.createElement("div");

                $(painel).hover(function(){
                    $(this).find(".i3GEOCabecalhoInfoWindow").removeClass("hiddenInfo");
                }, function () {
                    $(this).find(".i3GEOCabecalhoInfoWindow").addClass("hiddenInfo");
                });

                painel.innerHTML = Mustache.render(i3GEO.template.infotooltip, hash);

                $(painel).find("[data-info='close']").on("click",function(){removeBaloes(true);});
                $(painel).find("[data-info='wkt']").on("click",function(){removeBaloes(false);});
                $(painel).find("[data-info='info']").on("click",function(){
                    i3GEO.identify.allLayers(x,y);
                    return false;
                });
                $(painel).find("[data-info='settings']").on("click",function(){
                    i3GEO.janela.prompt($trad("tolerancia"), function() {
                        i3GEO.configura.ferramentas.identifica.resolution = $i("i3GEOjanelaprompt").value;
                    }, i3GEO.configura.ferramentas.identifica.resolution);
                    return false;
                });
                $(painel).find("[data-info='lockopen']").on("click",function(e){
                    var p = i3GEO.identify.BALAOPROP;
                    //$(e.target).addClass("hidden");
                    $(e.currentTarget.parentNode).find("[data-info='lockopen']").addClass("hidden");
                    $(e.currentTarget.parentNode).find("[data-info='lock']").removeClass("hidden");
                    p.removeAoAdicionar = false;
                    return false;
                });
                $(painel).find("[data-info='lock']").on("click",function(e){
                    var p = i3GEO.identify.BALAOPROP;
                    $(e.currentTarget.parentNode).find("[data-info='lock']").addClass("hidden");
                    $(e.currentTarget.parentNode).find("[data-info='lockopen']").removeClass("hidden");
                    p.removeAoAdicionar = true;
                    return false;
                });
                $(painel).find('.dropdown-toggle').dropdown();
                $(painel).find("[data-info='copy']").on("click",function(e){
                    if(textCopy && textCopy.isArray()){
                        i3GEO.util.copyToClipboard(textCopy.join("\n"));
                    } else {
                        i3GEO.util.copyToClipboard(x+","+y);
                    }
                });
                b = new ol.Overlay({
                    element : painel,
                    stopEvent : true,
                    autoPan : false,//nao funciona o true
                    autoPanAnimation : p.autoPanAnimation
                });
                b.setProperties({origem : "balao"});
                p.baloes.push(b);
                i3geoOL.addOverlay(b);
                b.setPosition(i3GEO.util.projGeo2OSM(new ol.geom.Point([x, y])).getCoordinates());
                //
                if(p.autoPan == true){
                    i3GEO.Interface.pan2ponto(x,y,p.autoPanAnimation);
                }
                i3GEO.identify.queryVectorLayers(painel,x,y);
                return painel;
            };
            if(i3GEO.template.infotooltip == false){
                $.get(i3GEO.configura.locaplic+"/js/templates/infotooltip.html").done(function(r) {
                    i3GEO.template.infotooltip = r;
                    createinfotooltip();
                });
            } else {
                createinfotooltip();
            }
        },
        /**
         * Mostra etiquetas no mapa com informacoes sobre os temas com etiquetas ativas
         *
         * Essa e a funcao padrao definida em i3GEO.configura
         */
        mapTooltip : function({x = x,y = y,allColumns = false}={}) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.mapTooltip()" + x + " " + y );

            if(i3GEO.identify.BALAOATIVO == false){
                if (typeof (console) !== 'undefined')
                    console.info("balao desativado");

                return;
            }
            if(!x){
                x = objposicaocursor.ddx;
            }
            if(!y){
                y = objposicaocursor.ddy;
            }
            if(x === -1 || y === -1 || i3GEO.eventos.cliquePerm.ativo === false || i3GEO.eventos.cliquePerm.status === false){
                return;
            }
            i3GEO.eventos.cliquePerm.status = false;
            //para evitar duplo clique
            objposicaocursor.ddx = -1;
            objposicaocursor.ddy = -1;
            var ntemas = i3GEO.arvoreDeCamadas.CAMADAS.length;
            var layerNames = [];
            for (var j = 0; j < ntemas; j += 1) {
                if (i3GEO.arvoreDeCamadas.CAMADAS[j].status*1 == 2 && i3GEO.arvoreDeCamadas.CAMADAS[j].identifica != "nao") {
                    layerNames.push(i3GEO.arvoreDeCamadas.CAMADAS[j].name)
                }
            }
            if(i3GEO.identify.BALAOPROP.url != "" && i3GEO.identify.BALAOPROP.templateModal == ""){
                $.get( i3GEO.identify.BALAOPROP.url + "&xx=" + x + "&yy=" + y, function( data ) {
                    i3GEO.janela.closeMsg(data);
                });
                return;
            }
            if(i3GEO.identify.BALAOPROP.templateModal != ""){
                if(i3GEO.identify.BALAOPROP.url != ""){
                    var temp = i3GEO.identify.BALAOPROP.url + "&xx=" + x + "&yy=" + y;
                    temp = i3GEO.identify.BALAOPROP.templateModal.replace("{{{url}}}",temp);
                    i3GEO.janela.closeMsg(temp);
                } else {
                    i3GEO.janela.closeMsg(i3GEO.identify.BALAOPROP.templateModal);
                }
                return;
            }
            i3GEO.identify._wait = i3GEO.mapa.createWaitOverlay(x,y);
            var after = function(retorno){
                i3geoOL.removeOverlay(i3GEO.identify._wait);
                if(retorno && retorno != ""){
                    i3GEO.identify.createTooltip(retorno,x,y);
                }
            };
            i3GEO.identify.identifica({
                after: after,
                x: x,
                y: y,
                resolution: i3GEO.configura.ferramentas.identifica.resolution,
                layerNames: layerNames.join(","),
                allColumns: allColumns
            });
        },
        layer : function(x, y, layerName) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.layer()");

            var temp = function(){
                i3GEO.identify.layer(x, y, layerName);
            };
            // javascript nao foi carregado
            if (typeof (i3GEOF.identifica) === 'undefined') {
                // javascript que sera carregado
                var js = i3GEO.configura.locaplic + "/ferramentas/identifica/dependencias.php";
                // carrega o script
                i3GEO.util.scriptTag(js, temp, "i3GEOF.identifica_script");
            } else {
                i3GEOF.identifica.start({x: x,y: y,tema: layerName});
            }
        },
        allLayers : function(x, y) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.identify.allLayers()");

            var temp = function(){
                i3GEO.identify.allLayers(x, y);
            };
            // javascript nao foi carregado
            if (typeof (i3GEOF.identifica) === 'undefined') {
                // javascript que sera carregado
                var js = i3GEO.configura.locaplic + "/ferramentas/identifica/dependencias.php";
                // carrega o script
                i3GEO.util.scriptTag(js, temp, "i3GEOF.identifica_script");
            } else {
                i3GEOF.identifica.start({x: x,y: y, tema: i3GEO.arvoreDeCamadas.listaLigadosDesligados()[0].join(",")});
            }
        }
};