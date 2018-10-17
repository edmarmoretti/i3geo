if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.convertews = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOconvertewsContainer",
	    "namespace": "convertews"
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
	    i3f = this;
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/convertews/exec.php",
		    {
			g_sid: i3GEO.configura.sid,
			funcao: "convertewmswmc"
		    }
	    )
	    .done(
		    function(data, status){
			var hash = {
				locaplic: i3GEO.configura.locaplic,
				namespace: p.namespace,
				idContainer: p.idContainer,
				nomewms: i3GEO.configura.locaplic+data.wms+"&",
				nomewmc: window.location.protocol+"//"+window.location.host+data.wmc+"&",
				bbox: i3GEO.parametros.mapexten.split(" ").join(","),
				w: i3GEO.parametros.w,
				h: i3GEO.parametros.h,
				...i3GEO.idioma.objetoIdioma(i3f.dicionario)
			};
			i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	}
};