if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.filtroarvore = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOfiltroarvoreguiasContainer",
	    "namespace": "filtroarvore"
	},
	start : function(){
	    var p = this._parameters,
	    	i3f = this,
	    	t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
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
	    	hash = i3GEO.idioma.objetoIdioma(i3GEOF[p.namespace].dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = p.namespace;
	    hash["idContainer"] = p.idContainer;
	    i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	    $('#' + p.idContainer + ' button[name="' + i3GEO.arvoreDeCamadas.FILTRO + '"]').button('toggle');
	},
	filtrar: function(filtro){
	    i3GEO.arvoreDeCamadas.FILTRO = filtro;
	    i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true);
	},
	excluir: function(){
	    var lista = i3GEO.arvoreDeCamadas.listaLigadosDesligados();
	    if(lista[3].length > 0){
		i3GEO.arvoreDeCamadas.FILTRO = "";
		i3GEO.php.excluitema(i3GEO.atualiza,lista[3]);
	    }
	}
};
