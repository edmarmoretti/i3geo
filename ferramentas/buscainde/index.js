if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
//
//A funcao javascript que faz a inclusao da camada WMS
//e definida em i3geo/pacotes/cswclient/lib/xsl/csw-metadata.xsl
//
i3GEOF.buscainde = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEObuscaindeContainer",
	    "namespace": "buscainde"
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
	    i3GEOF.buscainde._parameters.mustache = "";
	    $i(i3GEOF.buscainde._parameters.idContainer).innerHTML = "";
	    i3GEOF.buscainde.renderFunction.call();
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
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
			close: i3f.destroy
		    });
	},
	listaLayersWms : function(servico) {
	    i3GEO.catalogoOgc.escondeCatalogoPrincipal();
	    i3GEO.catalogoOgc.listaCamadas('WMS',7,'WMS',servico,0,'WMS','undefined');
	    this.destroy();
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("buscainde")){
    jQuery.each( i3GEO.configura.ferramentas.buscainde, function(index, value) {
	i3GEOF.buscainde[index] = i3GEO.configura.ferramentas.buscainde[index];
    });
}
