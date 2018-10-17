if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.carregamapa = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOcarregamapaContainer",
	    "namespace": "carregamapa"
	},
	start: function(iddiv){
	    var i3f = this,
	    p = i3f._parameters;
	    if(p.mustache === ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/" + p.namespace +"/template_mst.html", function(template) {
		    p.mustache = template;
		    i3f.html();
		});
		return;
	    } else {
		i3f.html();
	    }
	},
	html:function(){
	    var p = i3GEOF.carregamapa._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    sid: i3GEO.configura.sid,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,{
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	},
	submete: function(){
		$i("i3GEOcarregamapaf").submit();
	}
};
