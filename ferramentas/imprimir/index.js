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
	    	hash = i3GEO.idioma.objetoIdioma(i3GEOF[p.namespace].dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = p.namespace;
	    hash["idContainer"] = p.idContainer;
	    i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    i3GEO.janela.applyScrollBar(p.idContainer);
	    var temp = function(retorno){
		    g_legendaHTML = retorno.data.legenda;
		};
		i3GEO.php.criaLegendaHTML(temp,"","legendaseminput.htm");
	},
	pngExport: function(){
	    i3geoOL.once('postcompose', function(event) {
	          var canvas = event.context.canvas;
	          if (navigator.msSaveBlob) {
	            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
	          } else {
	            canvas.toBlob(function(blob) {
	              saveAs(blob, 'map.png');
	            });
	          }
	        });
	    i3geoOL.renderSync();
	},
	tiffExport: function(){
            var url = i3GEO.configura.locaplic + "/ferramentas/imprimir/geotif.php?g_sid="
            	+ i3GEO.configura.sid
            	+"&mapexten="+i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
            var link = document.createElement("a");
            $(link).click(function(e) {
              e.preventDefault();
              window.location.href = url;
            });
            $(link).click();
	},
	svgExport: function(){
            var url = i3GEO.configura.locaplic + "/ferramentas/imprimir/svg.php?g_sid="
            	+ i3GEO.configura.sid
            	+"&mapexten="+i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
            var link = document.createElement("a");
            $(link).click(function(e) {
              e.preventDefault();
              window.location.href = url;
            });
            $(link).click();
	}
};
