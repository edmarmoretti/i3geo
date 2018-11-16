if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.imprimir = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOimprimirguiasContainer",
	    "namespace": "imprimir"
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
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	},
	pngExport: function(){
	    i3GEO.janela.abreAguarde();
	    i3geoOL.once('postcompose', function(event) {
		var canvas = event.context.canvas;
		if (navigator.msSaveBlob) {
		    navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
		} else {
		    canvas.toBlob(function(blob) {
			saveAs(blob, 'map.png');
		    });
		}
		i3GEO.janela.fechaAguarde();
	    });
	    i3geoOL.renderSync();
	},
	tiffExport: function(){
	    i3GEO.janela.abreAguarde();
	    var url = i3GEO.configura.locaplic + "/ferramentas/imprimir/geotif.php?g_sid="
	    + i3GEO.configura.sid
	    +"&mapexten="+i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    var link = document.createElement("a");
	    $(link).click(function(e) {
		e.preventDefault();
		window.location.href = url;
		i3GEO.janela.fechaAguarde();
	    });
	    $(link).click();
	},
	svgExport: function(){
	    i3GEO.janela.abreAguarde();
	    var url = i3GEO.configura.locaplic + "/ferramentas/imprimir/svg.php?g_sid="
	    + i3GEO.configura.sid
	    +"&mapexten="+i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    var link = document.createElement("a");
	    $(link).click(function(e) {
		e.preventDefault();
		window.location.href = url;
		i3GEO.janela.fechaAguarde();
	    });
	    $(link).click();
	},
	legendExport: function(){
	    var url = i3GEO.configura.locaplic + "/ferramentas/opcoeslegenda/exec.php?g_sid="
	    + i3GEO.configura.sid + "&funcao=getlegenda&=" + i3GEO.util.uid();
	    i3GEO.janela.closeMsg("<img src='" + url + "' >");
	},
	scaleExport: function(){
	    var url = i3GEO.configura.locaplic + "/ferramentas/opcoesescala/exec.php?g_sid="
	    + i3GEO.configura.sid
	    + "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    + "&funcao=getscaleimg&="
	    + i3GEO.util.uid();
	    i3GEO.janela.closeMsg("<img src='" + url + "' >");
	},
	maparefExport: function(){
	    var url = i3GEO.configura.locaplic + "/ferramentas/opcoesmaparef/exec.php?g_sid="
	    + i3GEO.configura.sid
	    + "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    + "&funcao=getrefimg&="
	    + i3GEO.util.uid();
	    i3GEO.janela.closeMsg("<img src='" + url + "' >");
	}
};
