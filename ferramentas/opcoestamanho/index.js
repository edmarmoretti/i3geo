if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

i3GEOF.opcoestamanho = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOopcoestamanhoContainer",
	    "namespace": "opcoestamanho",
	    "dataForm": ""
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1,function(r1) {
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
	    i3GEOF.opcoestamanho._parameters.mustache = "";
	    i3GEOF.opcoestamanho._parameters.dataForm = "";
	    i3GEO.mapa.dialogo.imprimir();
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    values: {
			largura: i3GEO.parametros.w,
			altura: i3GEO.parametros.h
		    },
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy
		    });
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#" + this._parameters.idContainer + " form");
	    return data
	},
	mudatamanho: function(btn){
	    var par = this.getFormData();
	    i3GEO.mapa.mudatamanho({
	        after: function(){
	            i3GEOF.opcoestamanho.destroy();
	        },
	        altura: par.altura,
	        largura: par.largura,
	        btn: btn,
	    });
	}
};