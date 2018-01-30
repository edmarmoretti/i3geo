/*
Title: Adiciona ao mapa uma camada e substitu&iacute; par&acirc;metros no item DATA do Mapfile

Veja:

<i3GEO.pluginI3geo>

Arquivo:

i3geo/ferramentas/parametrossql/index.js.php

About: Licen&ccedil;a

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
/*
Class: i3GEOF.parametrossql
 */
i3GEOF.parametrossql = {
        /*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
         */
        aguarde: "",
        /*
	Variavel: tema

	Codigo do layer adicionado ao mapa
         */
        tema: "",
        /**
         * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
         */
        MUSTACHE : "",
        /**
         * Susbtitutos para o template
         */
        mustacheHash : function(camada) {
            var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.parametrossql.dicionario);
            dicionario["camada"] = camada.name;
            dicionario["novaCamada"] = camada.novaCamada;
            return dicionario;
        },
        /*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	camada - objeto contendo os dados do plugin
         */
        inicia: function(iddiv,camada){
            if(i3GEOF.parametrossql.MUSTACHE == ""){
                $.get(i3GEO.configura.locaplic + "/ferramentas/parametrossql/template_mst.html", function(template) {
                    i3GEOF.parametrossql.MUSTACHE = template;
                    i3GEOF.parametrossql.inicia(iddiv,camada);
                });
                return;
            }
            if(camada.novaCamada == undefined){
                camada.novaCamada = "hidden";
            }

            $i(iddiv).innerHTML = i3GEOF.parametrossql.html(camada);
            var b,
            f = i3GEOF.parametrossql.formulario(camada);
            i3GEOF.parametrossql.tema = camada.name;
            //i3GEOFparametrosSQLForm e definido no template mustache
            $i("i3GEOFparametrosSQLForm").innerHTML = f;
            i3GEOF.parametrossql.buscaSelect(camada);
        },
        /*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
         */
        html:function(camada) {
            var ins = Mustache.render(i3GEOF.parametrossql.MUSTACHE, i3GEOF.parametrossql.mustacheHash(camada));
            return ins;
        },
        /*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
         */
        iniciaJanelaFlutuante: function(camada){
            if(camada.plugini3geo.ativo != undefined && camada.plugini3geo.ativo === "nao"){
                i3GEOF.parametrossql.iniciaDefault(camada);
            }
            else{
                if(camada.plugini3geo.parametros){
                    var cabecalho,janela,divid,temp,titulo;
                    if(camada.plugini3geo.id && camada.plugini3geo.id != "" && $i(camada.plugini3geo.id)){
                        i3GEOF.parametrossql.inicia(camada.plugini3geo.id,camada);
                        return;
                    }
                    if($i("i3GEOF.parametrossql") ){
                        i3GEOF.parametrossql.inicia("i3GEOF.parametrossql_corpo",camada);
                        return;
                    }
                    if(!camada.plugini3geo.janela){
                        camada.plugini3geo.janela = {"w":"290px","h":"auto","left":"","top":""};
                    }
                    //funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
                    cabecalho = function(){
                    };
                    //cria a janela flutuante
                    titulo = "<span class='i3GeoTituloJanelaBsNolink' >Parametros</span></div>";
                    janela = i3GEO.janela.cria(
                            camada.plugini3geo.janela.w,
                            camada.plugini3geo.janela.h,
                            "",
                            "",
                            "",
                            titulo,
                            "i3GEOF.parametrossql",
                            false,
                            "hd",
                            cabecalho,
                            "",
                            "",
                            true,
                            "",
                            "",
                            "",
                            "",
                            "131"
                    );
                    janela[0].moveTo(parseInt(camada.plugini3geo.janela.left,10), parseInt(camada.plugini3geo.janela.top,10));
                    divid = janela[2].id;
                    i3GEOF.parametrossql.aguarde = $i("i3GEOF.parametrossql_imagemCabecalho").style;
                    YAHOO.util.Event.addListener(janela[0].close, "click", i3GEOF.parametrossql.cancela);
                    i3GEOF.parametrossql.inicia(divid,camada);
                }
            }
        },
        //aplica os parametros default na camada
        //usado quando o formulario nao e aberto de imediato para o usuario digitar os valores
        iniciaDefault : function(camada){
            var aplicaParametros;
            aplicaParametros = function(valores){
                var atualiza, p, cp, par = [];
                for(var i in valores){
                    par.push(valores[i]);
                }
                atualiza = function(){
                    i3GEO.atualiza();
                };
                p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
                + "&funcao=aplicar"
                + "&ativacamada=sim"
                + "&tema=" + camada.name
                + "&chaves=&valores=" + par.join(",");
                cp = new cpaint();
                cp.set_response_type("JSON");
                cp.call(p,"foo",atualiza);
            };
            i3GEOF.parametrossql.obtemParametrosDefault(camada,aplicaParametros);
        },
        obtemParametrosDefault : function(camada, funcao){
            var parametriza, p, cp, aplicaParametros, valores = {};
            //aplica na camada os parametros de substituicao e atualiza o mapa
            aplicaParametros = function(){
                funcao.call("",valores);
            };
            parametriza = function(plugin){
                var temp, i, pegaParametro, parametros;
                parametros = plugin.data.parametros;
                //funcao que faz a chamada AJAX que pega os valores caso seja um programa em PHP
                //numParametros e um contador pois as chamas para buscar os valores
                //sao assincronas
                pegaParametro = function(indice){
                    if(parametros.length == indice){
                        aplicaParametros();
                    }
                    else{
                        var fim, p, cp, prog = parametros[indice].prog;
                        if(prog != ""){
                            fim = function(retorno){
                                valores[indice] = retorno.data[0].v;
                                indice += 1;
                                pegaParametro(indice);
                            };
                            p = i3GEO.configura.locaplic
                            + "/ferramentas/parametrossql/exec.php?"
                            + "g_sid=" + i3GEO.configura.sid
                            + "&funcao=INCLUDEPROG&prog=" + prog;
                            cp = new cpaint();
                            cp.set_response_type("JSON");
                            cp.call(p,"foo",fim);
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
            // aqui e necessario buscar os parametros do plugin para pegar os valores default
            //de cada parametro. Quando termina, roda a funcao que monta os parametros
            p = i3GEO.configura.locaplic + "/ferramentas/parametrossql/exec.php?g_sid="
            + i3GEO.configura.sid
            + "&funcao=PARAMETROSPLUGIN&tema="
            + camada.name;
            cp = new cpaint();
            cp.set_response_type("JSON");
            cp.call(p, "foo", parametriza);
        },
        formulario: function(camada){
            //sobre os parametros ver em classe_plugini3geo
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
        buscaSelect: function(camada){
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
            var p,cp,temp;
            temp = function(retorno){
                var i,n,ins = "";
                ins += "<div style='width: 100%;' class='form-group label-fixed condensed'>"
                    + "<div style='width: 100%;' class='input-group'>"
                    + "<select ";
                if(plugin.required && plugin.required == "sim"){
                    ins += " required ";
                }
                ins += "data-titulo='" + plugin.titulo + "'  class='form-control' name='" +plugin.chave+ "' >";

                n = retorno.data.length;
                if(plugin.required && plugin.required != "sim"){
                    ins += "<option value='' >---</option>";
                }
                for(i=0; i<n; i++){
                    ins += "<option value='"+ retorno.data[i].v +"'>"+ retorno.data[i].n +"</option>";
                }
                ins += "</select><b class='caret careti'></b></div></div>";
                onde.innerHTML = ins;
            };
            p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
            + "&funcao=INCLUDEPROG&prog="+ plugin.prog;
            cp = new cpaint();
            cp.set_response_type("JSON");
            cp.call(p,"foo",temp);
        },
        aplicar: function(camada){
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
            //verifica os objetos pois essa funcao pode ter sido chamada do mashup
            if(typeof i3geoOL != 'undefined' || typeof i3GeoMap != 'undefined'){
                fim = function(){
                    i3GEO.janela.destroi("i3GEOF.parametrossql");
                    i3GEO.atualiza();
                    i3GEO.Interface.atualizaMapa();
                };
                p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
                + "&funcao=aplicar"
                + "&tema=" + camada
                + "&nova=" + $i("i3GEOFparametrosSQLnova").checked
                + "&chaves=" + chaves.join(",")
                + "&titulos=" + titulos.join(",")
                + "&valores=" + valores.join(",");
                cp = new cpaint();
                cp.set_response_type("JSON");
                cp.call(p,"foo",fim);
            }
            else if(i3GEO.editorOL.mapa){
                //pega o layer
                temp = i3GEO.editorOL.layerPorParametro("LAYERS",camada);
                //muda os parametros
                n = temp.length;
                for (i = 0; i < n; i++){
                    p = temp[i];
                    p.setVisibility(false);
                    p.clearGrid();
                    $i("i3GEOFparametrosSqlAplicar").innerHTML = "Aguarde...";
                    reg = new RegExp("plugin" + "([=])+([a-zA-Z0-9_]*)");
                    p.url = p.url.replace(reg, "");
                    p.url = p.url + "&plugin=" + valores.join(",");
                    p.setUrl(p.url+"&");
                    p.setVisibility(true);
                }
                i3GEO.janela.destroi("i3GEOF.parametrossql");
            }
        },
        cancela: function(){
            /*
		var fim,cp,p;
		if(typeof i3geoOL != 'undefined' || typeof i3GeoMap != 'undefined'){
			fim = function(){
				i3GEO.atualiza();
			};
			p = i3GEO.configura.locaplic+"/ferramentas/parametrossql/exec.php?g_sid="+i3GEO.configura.sid
				+ "&funcao=remover"
				+ "&tema=" + i3GEOF.parametrossql.tema;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"foo",fim);
		}
             */
        }
};
