if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.toponimia = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOtoponimiaContainer",
	    "namespace": "toponimia"
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    p.mustache = r1;
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
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    sim: $trad("x14"),
		    nao: $trad("x15"),
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
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");
	    //eventos das guias
	    $i("i3GEOtoponimiaguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");
	    };
	    $i("i3GEOtoponimiaguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia2","i3GEOtoponimiaguia");
	    };
	    i3GEO.util.comboItens(
		    "toponimiaitem",
		    i3GEOF.toponimia._parameters.tema,
		    function(retorno){
			$i("i3GEOtoponimiaDivListaItens").innerHTML = retorno.dados;
			$i("i3GEOtoponimiaDivListaItens").style.display = "block";
		    },
		    "i3GEOtoponimiaDivListaItens",
		    "",
		    "",
		    "",
		    "form-control"
	    );
	    i3GEO.util.comboFontes("fonte","i3GEOtoponimiaDivListaFonte","form-control");
	    i3GEO.util.aplicaAquarela(p.idContainer);
	},
	getFormData: function(){
	    var data = {
		    ...i3GEO.util.getFormData("#i3GEOtoponimiaguia1obj form"),
		    ...i3GEO.util.getFormData("#i3GEOtoponimiaguia2obj form")
	    };
	    data.novotema = $i("i3GEOtoponimianovotema").checked ? "nao" : "sim";
	    if(data.fundo === ""){
		data.fundo = "off";
	    }
	    if(data.sombra === ""){
		data.sombra = "off";
	    }
	    if(data.outlinecolor === ""){
		data.outlinecolor = "off";
	    }
	    if(data.cor === ""){
		data.cor = "off";
	    }
	    if(data.minscale === ""){
		data.minscale = "0";
	    }
	    if(data.maxscale === ""){
		data.maxscale = "0";
	    }
	    data.item = $i("toponimiaitem").value;
	    return data
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
	    par.tema = p.tema;
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.toponimia._parameters.tema);
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
	cria: function(btn){
	    var par = i3GEOF.toponimia.getFormData();
	    par.funcao = "criatoponimia";
	    i3GEOF.toponimia.get({
		snackbar: false,
		fn: function(retorno){
		    if($i("i3GEOtoponimianovotema").checked){
			i3GEO.Interface.atualizaTema("",i3GEOF.toponimia._parameters.tema);
		    }
		    else{
			i3GEO.atualiza();
		    }
		},
		btn: btn,
		par: par,
		refresh: false
	    });
	},
	remove: function(btn){
	    var par = i3GEOF.toponimia.getFormData();
	    par.funcao = "criatoponimia";
	    i3GEOF.toponimia.get({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.Interface.atualizaTema("",i3GEOF.toponimia._parameters.tema);
		},
		btn: btn,
		par: {funcao: "removetoponimia"},
		refresh: false
	    });
	}
};