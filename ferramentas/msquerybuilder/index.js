if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.msquerybuilder = {
	_parameters: {
	    "tema": "",
	    "onde": "",
	    "mustache": "",
	    "mustachelinha": "",
	    "idContainer": "i3GEOmsquerybuilderContainer",
	    "namespace": "msquerybuilder",
	    "comboTemas": ""
	},
	start : function(tema,onde){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_linhafiltro_mst.html";
	    p.tema = tema;
	    p.onde = onde;
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
	    i3GEO.janela.closeMsg(Mustache.render(p.mustache, hash));
	    i3GEO.util.comboItens(
		    "",
		    i3GEOF.msquerybuilder._parameters.tema,
		    function(retorno) {
			i3GEOF.msquerybuilder._parameters.comboTemas = retorno.dados;
			i3GEOF.msquerybuilder.adicionaLinhaFiltro();
		    },
		    "",
		    "coluna",
		    "",
		    "",
		    "form-control"
	    );
	},
	removeLinha : function(obj,id){
	    var linha = $i("linhamsquerybuilder"+id);
	    linha.parentNode.removeChild(linha);
	},
	listaValores: function(id){
	    var itemTema = $("#linhamsquerybuilder" + id + " [name='coluna']").val();
	    i3GEO.util.comboValoresItem(
		    "i3GEOmsquerybuildercbitens",
		    i3GEOF.msquerybuilder._parameters.tema,
		    itemTema,
		    function(retorno){
			$i("i3GEOmsquerybuildervalores").innerHTML = "<label class='control-label'>" +
			$trad('selecionaValor',i3GEOF.msquerybuilder.dicionario) +
			":</label>" +
			retorno.dados;
			if ($i("i3GEOmsquerybuildercbitens")){
			    $i("i3GEOmsquerybuildercbitens").onchange = function() {
				$("#linhamsquerybuilder" + id + " [name='valor']").val(this.value);
			    };
			}
		    },
		    "i3GEOmsquerybuildervalores",
		    "form-control"
	    );
	},
	adicionaLinhaFiltro: function(){
	    var p = this._parameters,
	    i3f = this,
	    id = i3GEO.util.uid(),
	    temp,ntr;
	    ntr = document.createElement("tr");
	    ntr.id = "linhamsquerybuilder"+id;
	    temp = Mustache.render(
		    "{{#data}}" + p.mustachelinha + "{{/data}}",
		    {"data":{"comboTemas": p.comboTemas,"id": id, "escondeGuias": i3GEOF.msquerybuilder.dicionario["escondeGuias"]}}
	    );
	    $(ntr).html(temp);
	    $i("i3GEOmsquerybuilderparametros").appendChild(ntr);
	},
	aplicaFiltro: function(){
	    var filtro = i3GEOF.msquerybuilder.formataMapserver();
	    $i(i3GEOF.msquerybuilder._parameters.onde).value = filtro;
	},
	formataMapserver : function(){
	    var filtro = "",g,ipt,i,nos,s,itemsel,operador,valor;
	    g = $i("i3GEOmsquerybuilderparametros");
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