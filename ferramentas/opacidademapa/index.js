if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.opacidademapa = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOopacidademapaContainer"
	},
	start : function(){
	    var p = i3GEOF.opacidademapa._parameters;
	    if(p.mustache === ""){
		var t1 = i3GEO.configura.locaplic + "/ferramentas/opacidademapa/template_mst.html";
		$.get(t1, function(template) {
		    p.mustache = template;
		    i3GEOF.opacidademapa.html();
		}).fail(function() {
		    i3GEO.janela.tempoMsg($trad("erroTpl"));
		});
	    } else {
		i3GEOF.opacidademapa.html();
	    }
	},
	html:function() {
	    var p = i3GEOF.opacidademapa._parameters;
	    var hash = i3GEO.idioma.objetoIdioma(i3GEOF.opacidademapa.dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = "opacidademapa";
	    hash["idContainer"] = p.idContainer;
	    i3GEOF.opacidademapa.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	    i3GEOF.opacidademapa.slide();

	},
	slide: function(){
	    var slide = $i(i3GEOF.opacidademapa._parameters.idContainer + "Slide");
	    noUiSlider.create(slide, {
		connect: "lower",
		start: [ 100 ],
		tooltips: [true],
		range: {
		    'min': [  0 ],
		    'max': [ 100 ]
		}
	    });
	    slide.noUiSlider.on('update', function( values, handle ) {
		i3GEO.Interface.aplicaOpacidade(values[0]*1);
	    });
	}
};