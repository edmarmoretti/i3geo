if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.filtroarvore = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOfiltroarvoreguiasContainer"
	},
	start : function(){
	    var p = i3GEOF.filtroarvore._parameters;
	    if(p.mustache === ""){
		var t1 = i3GEO.configura.locaplic + "/ferramentas/filtroarvore/template_mst.html";
		$.get(t1, function(template) {
		    p.mustache = template;
		    i3GEOF.filtroarvore.html();
		}).fail(function() {
		    i3GEO.janela.tempoMsg($trad("erroTpl"));
		});
	    } else {
		i3GEOF.filtroarvore.html();
	    }
	},
	html:function() {
	    var p = i3GEOF.filtroarvore._parameters;
	    var hash = i3GEO.idioma.objetoIdioma(i3GEOF.filtroarvore.dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = "filtroarvore";
	    hash["idContainer"] = p.idContainer;
	    i3GEOF.filtroarvore.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    i3GEO.janela.applyScrollBar(p.idContainer);
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
