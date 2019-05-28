if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
//localhost/i3geo/ms_criamapa.php?layers=_llocaliphp&interface=openlayersdebug.php
i3GEOF.parametrossql = {
        renderFunction: i3GEO.janela.formModal,
        _parameters: {
            "mustache": "",
            "idContainer": "i3GEOparametrossqlContainer",
            "namespace": "parametrossql",
            "camada": ""
        },
        start: function(camada){
            var i3f = this,
            p = i3f._parameters,
            t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html";
            p.camada = camada;
            if(p.mustache === ""){
                $.get(t1, function(template) {
                    p.mustache = template;
                    i3f.html();
                }).fail(function() {
                    i3GEO.janela.tempoMsg($trad("erroTpl"));
                });
            } else {
                i3f.html();
            }
        },
        html:function() {
            var p = this._parameters,
            i3f = this,
            camada = p.camada,
            hash = {};
            if(camada.plugini3geo.ativo != undefined && camada.plugini3geo.ativo === "nao"){
                i3GEOF.parametrossql.iniciaDefault();
            }
            if(camada.novaCamada == undefined){
                camada.novaCamada = "hidden";
            }
            hash = {
                    locaplic: i3GEO.configura.locaplic,
                    namespace: p.namespace,
                    extenatual: i3GEO.parametros.mapexten,
                    idContainer: p.idContainer,
                    camada: camada.name,
                    novaCamada: camada.novaCamada,
                    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
            };
            i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
            $i("i3GEOFparametrosSQLForm").innerHTML = i3GEOF.parametrossql.formulario();
            i3GEOF.parametrossql.buscaSelect();
        },
        iniciaDefault : function(){
            console.log("aqui")
            var p = this._parameters,
            i3f = this,
            camada = p.camada,
            aplicaParametros;
            aplicaParametros = function(valores){
                var atualiza, p, cp, par = [];
                for(var i in valores){
                    par.push(valores[i]);
                }
                i3GEOF.parametrossql.get({
                    snackbar: true,
                    fn: atualiza,
                    btn: false,
                    par: {
                        funcao: "aplicar",
                        ativacamada: "sim",
                        tema: camada.name,
                        chaves: "",
                        valores: par.join(",")
                    },
                    refresh: true
                });
            };
            i3GEOF.parametrossql.obtemParametrosDefault(aplicaParametros);
        },
        obtemParametrosDefault : function(funcao){
            var p = this._parameters,
            i3f = this,
            camada = p.camada;
            var parametriza, p, cp, aplicaParametros, valores = {};
            //aplica na camada os parametros de substituicao e atualiza o mapa
            aplicaParametros = function(){
                funcao.call("",valores);
            };
            parametriza = function(plugin){
                var temp, i, pegaParametro, parametros;
                parametros = plugin.parametros;
                //funcao que faz a chamada AJAX que pega os valores caso seja um programa em PHP
                //numParametros e um contador pois as chamas para buscar os valores
                //sao assincronas
                pegaParametro = function(indice){
                    if(parametros.length == indice){
                        aplicaParametros();
                    }
                    else{
                        if(prog != ""){
                            var fim = function(data){
                                valores[indice] = data[0].v;
                                indice += 1;
                                pegaParametro(indice);
                            };
                            i3GEOF.parametrossql.get({
                                snackbar: true,
                                fn: fim,
                                btn: false,
                                par: {
                                    funcao: "includeprog",
                                    ativacamada: "sim",
                                    prog: parametros[indice].prog
                                },
                                refresh: false
                            });
                        }
                        else{
                            indice += 1;
                            pegaParametro(indice);
                        }
                    }
                };
                temp = parametros.length;
                //obtem os valores que nao precisam AJAX
                for(i = 0; i < temp; i++){
                    if(parametros[i].titulo != "" && parametros[i].prog === ""){
                        valores[i] = parametros[i].valores.split(",")[0];
                    }
                }
                //executa as chamadas ajax de modo assincrono para obter os demais parametros
                pegaParametro(0);
            };
            i3GEOF.parametrossql.get({
                snackbar: true,
                fn: parametriza,
                btn: false,
                par: {
                    funcao: "parametrosplugin",
                    tema: camada.name
                },
                refresh: false
            });
        },
        formulario: function(){
            //sobre os parametros ver em classe_plugini3geo
            var p = this._parameters,
            i3f = this,
            camada = p.camada;

            var parametros = camada.plugini3geo.parametros,
            n = parametros.length,
            i,
            ins = "",
            p,
            j,
            nj,
            l,
            nm;
            for(i=0; i<n; i++){
                p = parametros[i];
                if(p.tipo != "" && p.titulo){
                    //prog pode ser um php que precisa ser obtido via ajax
                    //nesse caso e inserido um div com um id para permitir o preenchimento posterior
                    if(p.prog === ""){
                        if(!p.type){
                            p.type = "text";
                        }
                        if(p.tipo === "input"){
                            ins += "<div class='form-group label-fixed condensed' >"
                                + "<label class='control-label' for=''>"+p.titulo+"</label>"
                                + "<input ";
                            if(p.required && p.required == "sim"){
                                ins += " required ";
                            }
                            ins += "data-titulo='" + p.titulo + "' class='form-control input-lg' type='" + p.type + "' name='"+p.chave+"' value='"+p.valores+"' /></div>";
                        }
                        if(p.tipo === "select"){
                            ins += "<div style='width: 100%;' class='form-group label-fixed condensed'>"
                                + "<label class='control-label' for=''>"
                                + p.titulo
                                + "</label><div style='width: 100%;' class='input-group'>"
                                + "<select ";
                            if(p.required && p.required == "sim"){
                                ins += " required ";
                            }
                            ins += "class='form-control' data-titulo='" + p.titulo + "' name='"+p.chave+"' >";
                            l = p.valores.split(",");
                            if(!p.nomes || p.nomes == undefined ){
                                p.nomes = p.valores;
                            }
                            nm = p.nomes.split(",");
                            nj = l.length;
                            if(nj != nm.length){
                                nm = nj;
                            }
                            if(p.required && p.required != "sim"){
                                ins += "<option value='' >---</option>";
                            }
                            for(j=0; j<nj; j++){
                                ins += "<option value='"+ l[j] +"'>"+ nm[j] +"</option>";
                            }
                            ins += "</select><b class='caret careti'></b></div></div>";
                        }
                    }
                    else{
                        ins += "<h5>"+p.titulo+"</h5>";
                        ins += "<div id='i3GeoPlugin_"+p.chave+"' >Aguarde...</div>";
                    }
                }
            }
            return ins;
        },
        buscaSelect: function(){
            var p = this._parameters,
            i3f = this,
            camada = p.camada;
            var parametros = camada.plugini3geo.parametros,
            n = parametros.length,
            i;
            for(i=0; i<n; i++){
                p = parametros[i];
                if(p.prog != ""){
                    onde = $i('i3GeoPlugin_'+p.chave);
                    if (onde){
                        i3GEOF.parametrossql.ajaxSelect(onde,p);
                    }
                }
            }
        },
        ajaxSelect : function(onde,plugin){
            var temp = function(data){
                var i,n,ins = "";
                ins += "<div style='width: 100%;' class='form-group label-fixed condensed'>"
                    + "<div style='width: 100%;' class='input-group'>"
                    + "<select ";
                if(plugin.required && plugin.required == "sim"){
                    ins += " required ";
                }
                ins += "data-titulo='" + plugin.titulo + "'  class='form-control' name='" +plugin.chave+ "' >";

                n = data.length;
                if(plugin.required && plugin.required != "sim"){
                    ins += "<option value='' >---</option>";
                }
                for(i=0; i<n; i++){
                    ins += "<option value='"+ data[i].v +"'>"+ data[i].n +"</option>";
                }
                ins += "</select><b class='caret careti'></b></div></div>";
                onde.innerHTML = ins;
            };
            i3GEOF.parametrossql.get({
                snackbar: false,
                fn: temp,
                btn: false,
                par: {
                    funcao: "includeprog",
                    prog: plugin.prog
                },
                refresh: false
            });
        },
        aplicar: function(){
            var p = this._parameters,
            i3f = this,
            camada = p.camada;
            var temp, fim,cp,p,onde = $i("i3GEOFparametrosSQLForm"),
            campos,n,i,chaves = [], valores = [], titulos = [];
            campos = onde.getElementsByTagName("input");
            n = campos.length;
            for (i = 0; i<n; i++) {
                chaves.push(campos[i].name);
                valores.push(campos[i].value);
                titulos.push($( campos[i] ).data( "titulo" ));
                //titulos.push(campos[i].options[campos[i].selectedIndex].text);
            }
            campos = onde.getElementsByTagName("select");
            n = campos.length;
            for (i = 0; i<n; i++) {
                chaves.push(campos[i].name);
                valores.push(campos[i].value);
                titulos.push($( campos[i] ).data( "titulo" ));
                //titulos.push(campos[i].options[campos[i].selectedIndex].text);
            }
            fim = function(){
                i3GEO.janela.destroi("i3GEOF.parametrossql");
                i3GEO.mapa.refresh();
                i3GEO.Interface.atualizaMapa();
            };
            i3GEOF.parametrossql.get({
                snackbar: true,
                fn: fim,
                btn: false,
                par: {
                    funcao: "aplicar",
                    tema: camada.name,
                    nova: $i("i3GEOFparametrosSQLnova").checked,
                    chaves: chaves.join(","),
                    titulos: titulos.join(","),
                    valores: valores.join(",")
                },
                refresh: false
            });
        },
        cancela: function(){
        },
        get: function({snackbar = true, btn = false, par = {}, refresh = false, fn = false} = {}){
            var p = this._parameters,
            i3f = this;
            i3GEO.janela.abreAguarde();
            if(btn){
                btn = $(btn);
                btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
            }
            i3GEO.janela._formModal.block();
            par.g_sid = i3GEO.configura.sid;
            par.tema = p.camada.name;
            $.get(
                    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/exec.php",
                    par
            )
            .done(
                    function(data, status){
                        i3GEO.janela._formModal.unblock();
                        i3GEO.janela.fechaAguarde();
                        if(btn){
                            btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
                        }
                        if(snackbar){
                            i3GEO.janela.snackBar({content: $trad('feito')});
                        }
                        if(refresh){
                            i3GEO.Interface.atualizaTema("", i3GEOF.parametrossql._parameters.camada.name);
                        }
                        if(fn){
                            fn(data);
                        }
                    }
            )
            .fail(
                    function(data){
                        i3GEO.janela._formModal.unblock();
                        i3GEO.janela.fechaAguarde();
                        if(btn){
                            btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
                        }
                        i3GEO.janela.snackBar({content: data.statusText, style:'red'});
                    }
            );
        }
};
