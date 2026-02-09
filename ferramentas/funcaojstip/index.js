if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.funcaojstip = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOfuncaojstipContainer",
	    "namespace": "funcaojstip",
	    "funcoesjs": ""
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=pegaFuncoesJs&tema=" + tema;
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
		    i3GEO.janela.fechaAguarde();
		    p.mustache = r1[0];
		    p.funcoesjs = i3GEO.util.base64decode(r2[0]);
		    i3f.html();

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
		    }
	    );
	    $i("i3GEOfuncaojstipfuncoes").value = p.funcoesjs;
	},
	limpa: function(btn){
	    i3GEOF.funcaojstip.get({
		snackbar: true,
		btn: btn,
		par: {funcao: "limpafuncoesjs"},
		refresh: true,
		fn : function(data){
		    i3GEOF.funcaojstip._parameters.funcoesjs = i3GEO.util.base64decode(data);
		    $i("i3GEOfuncaojstipfuncoes").value = data;
		}
	    });
	},
	aplica: function(btn){
	    //[{"titulo":"teste fake"},{"titulo":"teste de nome de uma função","script":"../aplicmap/dados/testefuncaojs.js","funcao":"funcao1","parametros":["CD_LEGENDA"]}]
	    i3GEOF.funcaojstip.get({
		snackbar: true,
		btn: btn,
		par: {
		    funcao: "inserefuncoesjs",
		    texto: $i("i3GEOfuncaojstipfuncoes").value
		},
		refresh: true,
		fn : function(data){
		    i3GEOF.funcaojstip._parameters.funcoesjs = i3GEO.util.base64decode(data);
		    $i("i3GEOfuncaojstipfuncoes").value = i3GEOF.funcaojstip._parameters.funcoesjs;
		}
	    });
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
			    i3GEO.Interface.atualizaTema("", p.tema);
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