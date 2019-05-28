if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.tme = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelista": "",
	    "idContainer": "i3GEOtmeContainer",
	    "namespace": "tme",
	    "itemnomeregioes" : "",
	    "itemdados" : "",
	    "titulo" : "",
	    "outlinecolor" : "-1,-1,-1",
	    "numvertices" : 8,
	    "lmax" : 5000,
	    "amax" : 2000000
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/templateLista_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when($.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.mustachelista = r2[0];
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    login: "hidden",
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    if (i3GEO.login.verificaCookieLogin() === true && i3GEO.parametros.editor === "sim") {
		hash.login = "";
	    }
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			footer: true,
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width':'', 'height': '50%','position': 'fixed','top': 0, 'left': 0, 'right': 0, bottom: 'unset', 'margin': 'auto'}
		    });

	    i3f.t0();
	    i3GEOF.tme.comboTemas();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.tme.t1()","","i3GEOF.tme.t0","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.tme.t0()","i3GEOF.tme.t2()","","i3GEOF.tme.t1","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.tme.t1()","i3GEOF.tme.t3()","","i3GEOF.tme.t2","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.tme.t2()","i3GEOF.tme.t4()","","i3GEOF.tme.t3","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.tme.t3()","i3GEOF.tme.t5()","","i3GEOF.tme.t4","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	t5: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.tme.t4()","","","i3GEOF.tme.t5","i3GEOtmeresultado",true,"i3GEOToolFormModalFooter");
	},
	comboItensRegioes: function(){
	    i3GEO.util.comboItens(
		    "i3GEOTMEregioes",
		    i3GEOF.tme._parameters.tema,
		    function(retorno) {
			$i("i3GEOTMEregioeslista").innerHTML = retorno.dados;
			if (i3GEOF.tme._parameters.itemnomeregioes != "") {
			    $i("i3GEOTMEregioes").value = i3GEOF.tme._parameters.itemnomeregioes;
			}
			// lista para escolher as colunas com os valores
			var temp = function(r) {
			    i3GEOF.tme.montaListaItens(r);
			    // se os parametros da ferramenta estiverem definidos na camada
			    camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[i3GEOF.tme._parameters.tema];
			    if (camada != "" && camada.ferramentas.tme && camada.ferramentas.tme.exec === "sim") {
				i3GEOF.tme.ativa();
			    }
			};
			i3GEO.tema.itens(temp, i3GEOF.tme._parameters.tema);
		    },
		    "i3GEOTMEregioeslista",
		    "",
		    "sim",
		    "",
		    "form-control"
	    );
	},
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOtmetemasComSel",
		    function(retorno){
			$i("i3GEOtmeSelTemas").innerHTML = retorno.dados;
			$i("i3GEOtmetemasComSel").value = i3GEOF.tme._parameters.tema;
			$i("i3GEOtmetemasComSel").onchange = function(){
			    var p = i3GEOF.tme._parameters;
			    p.tema = $i("i3GEOtmetemasComSel").value;
			    i3GEOF.tme.comboItensRegioes();
			    var camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[p.tema];
			    if (camada && camada != "" && camada.ferramentas.tme) {
				p.itemnomeregioes = camada.ferramentas.tme.colnome;
				p.itemdados = camada.ferramentas.tme.colsdata.join(",");
				if(camada.ferramentas.tme.auto === "sim"){
				    $i("ativaAoAdic").checked = true;
				}
				if(camada.ferramentas.tme.exec === "sim"){
				    $i("execAoAdic").checked = true;
				}
				$i("i3GEOTMEbarSize").value = camada.ferramentas.tme.amax;
				$i("i3GEOTMEmaxHeight").value = camada.ferramentas.tme.lmax;
				$i("i3GEOTMEtitulo").value = camada.ferramentas.tme.titulo;
				$i("i3GEOTMEoutlinecolor").value = camada.ferramentas.tme.outlinecolor;
				$i("i3GEOTMEnumvertices").value = camada.ferramentas.tme.numvertices;
			    }
			};
			//caso os parametros estiverem definidos na camada
			//preenche o formulario
			if(i3GEOF.tme._parameters.tema != ""){
			    $i("i3GEOtmetemasComSel").onchange.call();
			}
		    },
		    "i3GEOtmeSelTemas",
		    "",
		    false,
		    "comTabela",
		    " ",
		    false,
		    true,
		    "form-control"
	    );
	},
	montaListaItens : function(data) {
	    var p = this._parameters,
	    i3f = this;
	    var ins = [], i, n, item, litens,temp = {}, mustache = [];
	    ins.push("<table>");
	    n = data.valores.length;
	    for (i = 0; i < n; i++) {
		temp = {};
		temp.item = data.valores[i].item;
		mustache.push(temp);
	    }
	    $i("i3GEOtmelistai").innerHTML = Mustache.render(
		    p.mustachelista,
		    {
			"linhas": mustache,
			...i3GEO.idioma.objetoIdioma(i3f.dicionario)
		    }
	    );
	    //
	    // marca as colunas default
	    //
	    litens = p.itemdados.split(",");
	    n = litens.length;
	    for (i = 0; i < n; i++) {
		if ($i("i3GEOtme" + litens[i])) {
		    $i("i3GEOtme" + litens[i]).checked = true;
		}
	    }
	},
	pegaItensMarcados : function() {
	    var listadeitens = [], inputs = $i("i3GEOtmelistai").getElementsByTagName("input"), i, it, n;
	    n = inputs.length;
	    for (i = 0; i < n; i++) {
		if (inputs[i].checked === true) {
		    it = inputs[i].id;
		    listadeitens.push(it.replace("i3GEOtme", ""));
		}
	    }
	    return (listadeitens);
	},
	salvaParametros: function(btn){
	    //monta a string JSON que sera enviada para gravacao
	    //'{"titulo":"População","colnome":"CNTRY_NAME","colsdata":["POP_CNTRY"],"lmax":"100000","amax":"2000000","auto":"sim","exec":"sim"}'
	    var j, colsdata = i3GEOF.tme.pegaItensMarcados(), auto = "nao", exec = "nao";
	    if($i("ativaAoAdic").checked === true){
		auto = "sim";
	    }
	    if($i("execAoAdic").checked === true){
		exec = "sim";
	    }
	    j = '{"titulo":"'
		+ $i("i3GEOTMEtitulo").value
		+ '","colnome":"'
		+ $i("i3GEOTMEregioes").value
		+ '","colsdata":['
		+ '"' + colsdata.join('","') + '"'
		+ '],"lmax":"'
		+ $i("i3GEOTMEmaxHeight").value
		+ '","amax":"'
		+ $i("i3GEOTMEbarSize").value
		+ '","outlinecolor":"'
		+ $i("i3GEOTMEoutlinecolor").value
		+ '","numvertices":"'
		+ $i("i3GEOTMEnumvertices").value
		+ '","auto":"'
		+ auto
		+ '","exec":"'
		+ exec
		+ '"}';

	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": $i("i3GEOtmetemasComSel").value,
		    "sid": i3GEO.configura.sid,
		    "tme": i3GEO.util.base64encode(j),
		    "funcao": "incluitme"
	    };
	    i3f.post({
		snackbar: true,
		btn: btn,
		par: par,
		refresh: true,
		prog: i3GEO.configura.locaplic + "/ferramentas/tme/exec.php"
	    });
	},
	removeParametros: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": $i("i3GEOtmetemasComSel").value,
		    "sid": i3GEO.configura.sid,
		    "funcao": "removetme"
	    };
	    i3f.post({
		snackbar: true,
		btn: btn,
		par: par,
		refresh: true,
		prog: i3GEO.configura.locaplic + "/ferramentas/tme/exec.php"
	    });
	},
	getFormData: function(){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "colunasvalor": i3GEOF.tme.pegaItensMarcados().toString(","),
		    "colunanomeregiao": $i("i3GEOTMEregioes").value,
		    "maxHeight": $i("i3GEOTMEbarSize").value,
		    "barSize": $i("i3GEOTMEmaxHeight").value,
		    "nomelayer": p.tema,
		    "colunanomeregiao": $i("i3GEOTMEregioes").value,
		    "titulo": $i("i3GEOTMEtitulo").value,
		    "descricao": $i("i3GEOTMEdesc").value,
		    "outlinecolor": $i("i3GEOTMEoutlinecolor").value,
		    "numvertices": $i("i3GEOTMEnumvertices").value,
		    "tema": p.tema,
		    "sid": i3GEO.configura.sid
	    };
	    return par;
	},
	ativa : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    i3f.post({
		snackbar: true,
		fn: function(retorno){
		    //var data = jQuery.parseJSON(retorno).data;
		    var url = i3GEO.configura.locaplic + "/ferramentas/tme/forcedownload.php?g_sid=" + i3GEO.configura.sid;
		    var link = document.createElement("a");
		    $(link).click(function(e) {
			e.preventDefault();
			window.location.href = url;
		    });
		    $(link).click();

		    url =
			i3GEO.configura.locaplic + "/ferramentas/cesium/kml3d.php?"
			+ "&g_sid=" + i3GEO.configura.sid
			+ "&mapext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		    var ins =
			"<h5>" + $trad('abreNoCesium', i3GEOF.tme.dicionario)
			+ "</h5><a href='"
			+ url
			+ "' target='new' >"
			+ url
			+ "</a>";

		    $("#i3GEOTMEresultado").html(ins);
		},
		btn: btn,
		par: par,
		refresh: false,
		prog: i3GEO.configura.locaplic + "/pacotes/tme/TME_i3geo.php"
	    });
	},
	post: function({snackbar = true, btn = false, par = {}, refresh = false, prog = "exec", fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    delete par["refresh"];
	    $.post(
		    prog,
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
			    i3GEO.arvoreDeCamadas.CAMADAS = [];
			    i3GEO.mapa.refresh();
			    i3GEO.Interface.atualizaTema("", i3GEOF.tme._parameters.tema);
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
