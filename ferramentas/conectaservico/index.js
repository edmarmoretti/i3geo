if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.conectaservico =
{
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOconectaservicoContainer",
	    "namespace": "conectaservico"
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
	    i3GEO.janela.applyScrollBar(p.idContainer);
	},
	kml: function() {
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectarkml/dependencias.php",
		    "i3GEOF.conectarkml.start()",
	    "i3GEOF.conectarkml_script");
	},
	geojson: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectargeojson/dependencias.php",
		    "i3GEOF.conectargeojson.start()",
	    "i3GEOF.conectargeojson_script");
	},
	georss: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectargeorss/dependencias.php",
		    "i3GEOF.conectargeorss.start()",
	    "i3GEOF.conectargeorss_script");
	},
	wmst: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/wmstime/dependencias.php",
		    "i3GEOF.wmstime.start()",
	    "i3GEOF.wmstime_script");
	},
	wms: function(){
	    i3GEO.util.scriptTag(i3GEO.configura.locaplic
		    + "/ferramentas/conectarwms/dependencias.php",
		    "i3GEOF.conectarwms.start()",
	    "i3GEOF.conectarwms_script");
	}
};
