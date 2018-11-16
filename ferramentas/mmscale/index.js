if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.mmscale = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOmmscaleContainer",
	    "namespace": "mmscale"
	},
	start: function(tema){
	    var i3f = this,
	    p = i3f._parameters,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html";
	    p.tema = tema;
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
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    i3GEOF.mmscale.atual();
	},
	aplica: function(btn){
	    var par = {
		    funcao: "minmax",
		    minscaledenom: parseInt($i("i3GEOmmscaleMinscale").value,10),
		    maxscaledenom: parseInt($i("i3GEOmmscaleMaxscale").value,10)
	    };
	    this.get({
		snackbar: false,
		btn: true,
		par: par,
		refresh: true,
		prog: "exec"
	    });
	},
	atual: function(){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    funcao: "atual"
	    };
	    i3f.get({
		snackbar: false,
		fn: function(retorno){
		    $i("i3GEOmmscaleMinscale").value = retorno.minscaledenom;
		    $i("i3GEOmmscaleMaxscale").value = retorno.maxscaledenom;
		},
		btn: false,
		par: par,
		refresh: false,
		prog: "exec"
	    });
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.mmscale._parameters.tema);
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