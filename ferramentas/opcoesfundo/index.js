if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.opcoesfundo = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOopcoesfundoContainer",
	    "namespace": "opcoesfundo"
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
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    cor: i3GEO.parametros.cordefundo,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    this.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    i3GEO.util.aplicaAquarela(p.idContainer);
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "corfundo",
		    cor: $i("i3GEOopcoesFundocor").value
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/opcoesfundo/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			i3GEO.janela.snackBar({content: $trad('feito')});
			$i("openlayers").style.backgroundColor = "rgb(" + $i("i3GEOopcoesFundocor").value + ")";
			i3GEO.parametros.cordefundo = $i("i3GEOopcoesFundocor").value;
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	}
};