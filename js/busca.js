if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.busca = {
        PALAVRA: "",
        config : {
            "ondeConteiner":"",
            "inputOndePalavra": "",
            "inputTemasMapa": "",
            "ondeTemasMapa": "",
            "templateTemasMapa":""
        },
        carregaTemplates: function(){
            if(!i3GEO.template.buscaEmTemas){
                $.get(i3GEO.busca.config.templateTemasMapa, function(template) {
                    i3GEO.template.buscaEmTemas = template;
                    i3GEO.busca.inicia();
                });
            }
        },
        aguarde: function(){
            return '<div class="alert alert-warning" role="alert">' + $trad("o1") + '</div>';
        },
        inicia: function(obj){
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.busca.inicia");

            var palavra="", config = i3GEO.busca.config;

            if(obj){
                obj = $(obj);
                if(obj.attr("data-ondeConteiner") != undefined){
                    config.ondeConteiner = obj.attr("data-ondeConteiner");
                }
                if(obj.attr("data-inputTemasMapa") != undefined){
                    config.inputTemasMapa = obj.attr("data-inputTemasMapa");
                }
                if(obj.attr("data-ondeTemasMapa") != undefined){
                    config.ondeTemasMapa = obj.attr("data-ondeTemasMapa");
                }
                if(obj.attr("data-inputOndePalavra") != undefined){
                    config.inputOndePalavra = obj.attr("data-inputOndePalavra");
                }
                if(obj.attr("data-templateTemasMapa") != undefined){
                    config.templateTemasMapa = obj.attr("data-templateTemasMapa");
                }
            }
            if(!i3GEO.template.buscaEmTemas){
                i3GEO.busca.carregaTemplates();
                return;
            } else {
                var palavra = $(config.ondeConteiner).find(config.inputOndePalavra).val();
                if(palavra != ""){
                    i3GEO.busca.PALAVRA = i3GEO.util.removeAcentos(palavra);
                } else {
                    i3GEO.busca.PALAVRA = "";
                    return false;
                }
                //faz as buscas
                $(config.ondeConteiner).find(config.inputTemasMapa).html(i3GEO.busca.aguarde());
                i3GEO.busca.searchInLayers(i3GEO.busca.resultadoTemas, i3GEO.busca.PALAVRA);
            }
        },
        searchInLayers: function(after, palavra){
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    search: palavra,
                    extent: i3GEO.mapa.getExtent().geo
                },
                prog: "/mapserverapi/map/" + i3GEO.configura.sid + "/searchInLayers",
                fn: function(data){
                    after.call(after, data);
                }
            });
        },
        resultadoTemas : function(data) {
            if (typeof (console) !== 'undefined')
                console.info("i3GEO.busca.resultadoTemasMapa ");

            var t = "",config = i3GEO.busca.config;
            try {
                if (data) {
                    for (const layer of Object.keys(data)) {
                        t += "<div><b>" + data[layer]["layerTitle"] + "</b></div>";
                        t += Mustache.to_html(
                                "{{#data}}" + i3GEO.template.buscaEmTemas + "{{/data}}",
                                {"data": data[layer].data}
                        );
                    }
                    $(config.ondeConteiner).find(config.ondeTemasMapa).html(t);
                }
            } catch (e) {
                $(config.ondeConteiner).find(config.ondeTemasMapa).html("");
            }
        },
        zoom : function(wkt, layer, gid, nm) {
            var adicionaCamada =
                function(layer, gid, nm, ext) {
                if (i3GEO.Interface.googleLike === false) {
                    var s = i3GEO.busca.SERVICOWMS + "?gid=" + gid + "&";
                    i3GEO.mapa.adicionaTemaWMS({
                        wms_name: layer,
                        url: s,
                        proj: 'EPSG:4618',
                        formatlist: 'image/png',
                        version: '1.1.0',
                        infoformat: "text/plain",
                        layerTitle: nm + " - " + layer
                    });
                }
            };
            var ext = i3GEO.util.wkt2ext(wkt, "polygon");
            if (ext == false) {
                return;
            }
            i3GEO.Interface.zoom2ext(ext);
            adicionaCamada(layer, gid, nm, ext)
        },
        mostraxy : function mostraxy(texto, tipo) {
            var ext,b;
            if (tipo === "wkt") {
                ext = i3GEO.util.wkt2ext(texto, "polygon");
            } else {
                ext = texto;
            }
            if (ext == false) {
                return;
            }
            b = ext.split(" ");
            i3GEO.desenho.addBox(b[0]*1, b[1]*1, b[2]*1, b[3]*1, "boxOndeBusca");
        },
        /*
         * Function: escondexy
         *
         * Esconde o box criado com mostraxy
         */
        escondexy : function() {
            i3GEO.desenho.removePins("boxOndeBusca");
        },
        zoomExt : function(ext) {
            i3GEO.Interface.zoom2ext(ext);
        }
};