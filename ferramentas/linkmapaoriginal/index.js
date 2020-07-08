if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.linkMapaOriginal = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOlinkMapaOriginal",
	    "namespace": "linkmapaoriginal"
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
	    var p = i3GEOF.linkMapaOriginal._parameters,
	    i3f = this,
	    camadas = i3GEO.arvoreDeCamadas.listaLigadosDesligados(),
	    url = location.origin + location.pathname,
	    hash = {};

	    hash = {
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    url: i3GEO.configura.locaplic,
		    ext: i3GEO.parametros.mapexten,
		    perfil: i3GEO.parametros.perfil,
		    layers: camadas[2],
		    layersoff: camadas[1],
		    "interface": url.replace(i3GEO.configura.locaplic,"").replace("/",""),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,{
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	}
};
