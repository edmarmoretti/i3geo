if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.conectarkml = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOconectarkmlContainer",
	    "namespace": "conectarkml"
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    i3GEO.janela.fechaAguarde();
		    p.mustache = r1;
		    i3f.html();
		}).fail(function(data) {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: "Erro. " + data.status, style:'red'});
		    i3f.destroy();
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEOF.conectarkml.renderFunction.call();
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    botao: $trad("adicmapa"),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    });
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#" + this._parameters.idContainer + " form");
	    return data
	},
	adiciona: function(formEl){
	    var btn = $(formEl).find(":submit");
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    i3GEO.janela.abreAguarde();
	    var par = this.getFormData(),
	    	i3f = this;
	    par.g_sid = i3GEO.configura.sid;
	    par.funcao = "crialayer";
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.mapa.refresh();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad("concluido",i3f.dicionario)});
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3f.destroy();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3f.destroy();
		    }
	    );
	}
};