if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.mostraexten = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOmostraextenContainer",
	    "namespace": "mostraexten"
	},
	start: function(tema){
	    var i3f = this,
	    p = i3f._parameters,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html";
	    p.tema = tema;
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
		    extenatual: i3GEO.parametros.mapexten,
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	},
	executa: function(){
	    var x = i3GEO.calculo.dms2dd($i("i3GEOmostraextenxg").value,$i("i3GEOmostraextenxm").value,$i("i3GEOmostraextenxs").value),
	    xx = i3GEO.calculo.dms2dd($i("i3GEOmostraextenxxg").value,$i("i3GEOmostraextenxxm").value,$i("i3GEOmostraextenxxs").value),
	    y = i3GEO.calculo.dms2dd($i("i3GEOmostraextenyg").value,$i("i3GEOmostraextenym").value,$i("i3GEOmostraextenys").value),
	    yy = i3GEO.calculo.dms2dd($i("i3GEOmostraextenyyg").value,$i("i3GEOmostraextenyym").value,$i("i3GEOmostraextenyys").value);
	    if ((x == xx) || (y == yy)){
		i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraextenatual").value);
		return;
	    }
	    if ((x > xx) || (y > yy)){
		i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraextenatual").value);
		return;
	    }
	    i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy));
	}
};