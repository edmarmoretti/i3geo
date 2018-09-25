if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.filtro = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelinha": "",
	    "idContainer": "i3GEOfiltroContainer",
	    "namespace": "filtro",
	    "comboItens": ""
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_linhafiltro_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.mustachelinha = r2[0];
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
	    //i3GEOF.legenda._parameters.mustache = "";
	    i3GEOF.filtro._parameters.comboItens = "";
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
	    $i("i3GEOfiltroguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
	    };
	    $i("i3GEOfiltroguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia2","i3GEOfiltroguia");
		i3GEOF.filtro.pegaFiltro();
	    };
	    i3GEO.util.comboItens(
		    "",
		    i3GEOF.filtro._parameters.tema,
		    function(retorno) {
			i3GEOF.filtro._parameters.comboItens = retorno.dados;
			i3GEOF.filtro.adicionaLinhaFiltro();
		    },
		    "",
		    "coluna",
		    "",
		    "",
		    "form-control"
	    );
	},
	removeLinha : function(obj,id){
	    var linha = $i("linhaFiltro"+id);
	    linha.parentNode.removeChild(linha);
	},
	listaValores: function(id){
	    var itemTema = $("#linhaFiltro" + id + " [name='coluna']").val();
	    i3GEO.util.comboValoresItem(
		    "i3GEOfiltrocbitens",
		    i3GEOF.filtro._parameters.tema,
		    itemTema,
		    function(retorno){
			$i("i3GEOfiltrovalores").innerHTML = "<label class='control-label'>" +
			$trad('selecionaValor',i3GEOF.filtro.dicionario) +
			":</label>" +
			retorno.dados;
			if ($i("i3GEOfiltrocbitens")){
			    $i("i3GEOfiltrocbitens").onchange = function() {
				$("#linhaFiltro" + id + " [name='valor']").val(this.value);
			    };
			}
		    },
		    "i3GEOfiltrovalores",
		    "form-control"
	    );
	},
	adicionaLinhaFiltro: function(){
	    var p = this._parameters,
	    i3f = this,
	    id = i3GEO.util.uid(),
	    temp,ntr;
	    ntr = document.createElement("tr");
	    ntr.id = "linhaFiltro"+id;
	    temp = Mustache.render(
		    "{{#data}}" + p.mustachelinha + "{{/data}}",
		    {"data":{"comboItens": p.comboItens,"id": id, "escondeGuias": i3GEOF.filtro.dicionario["escondeGuias"]}}
	    );
	    $(ntr).html(temp);
	    $i("i3GEOfiltroparametros").appendChild(ntr);
	},
	get: function({snackbar = true, btn = false, par = {}, refresh = false, prog = "exec", fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    par.tema = p.tema;
	    //esess parametros sao enviados pela funcao run e nao sao necessarios
	    //por isso sao removidos aqui
	    delete par["prog"];
	    delete par["refresh"];
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/" + prog + ".php",
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.filtro._parameters.tema);
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
	},
	pegaFiltro: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "pegafiltro"
	    };
	    i3f.get({
		snackbar: false,
		fn: function(retorno){
		    $i("i3GEOfiltrofiltro").value = i3GEO.util.base64decode(retorno);
		},
		btn: btn,
		par: par,
		refresh: false,
		prog: "exec"
	    });
	},
	limpaFiltro: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "inserefiltro",
		    filtro: ""
	    };
	    i3f.get({
		snackbar: false,
		fn: function(retorno){
		    $i("i3GEOfiltrofiltro").value = "";
		},
		btn: btn,
		par: par,
		refresh: true,
		prog: "exec"
	    });
	},
	aplicaFiltro: function(btn){
	    var filtro = "";
	    if( ($i("i3GEOfiltrofiltro").value !== "") && ($i("i3GEOfiltroguia2obj").style.display === "block")){
		filtro = $i("i3GEOfiltrofiltro").value;
	    }
	    else{
		filtro = i3GEOF.filtro.formataMapserver();
	    }
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "inserefiltro",
		    filtro: i3GEO.util.base64encode(filtro)
	    };
	    i3f.get({
		snackbar: false,
		btn: btn,
		par: par,
		refresh: true,
		prog: "exec"
	    });
	},
	formataMapserver : function(){
	    var filtro = "",g,ipt,i,nos,s,itemsel,operador,valor;
	    g = $i("i3GEOfiltroparametros");
	    ipt = g.getElementsByTagName("tr");
	    if (ipt.length > 1){
		for (i=1;i<ipt.length; i++){
		    itemsel = $(ipt[i]).find("[name='coluna']").val();
		    operador = $(ipt[i]).find("[name='operador']").val();
		    valor = $(ipt[i]).find("[name='valor']").val();
		    conector = $(ipt[i]).find("[name='conector']").val();
		    if (valor*1){
			filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")";
		    }
		    else{
			filtro = filtro + "('["+itemsel+"]' "+operador+" '"+valor+"')";
		    }
		    if ((i + 1) != ipt.length){
			filtro = filtro + conector;
		    }
		    else{
			filtro = "("+filtro+")";
		    }
		}
	    }
	    return filtro;
	}
};