if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.gradecoord = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOgradecoordContainer",
	    "namespace": "gradecoord"
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
		    nao: $trad("x15"),
		    sim: $trad("x14"),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    this.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3GEO.util.comboFontes("font","i3GEOgradecoordfontef","form-control");
	},
	get: function(btn){
	    var par = i3GEOF.gradecoord.getFormData();
	    par.g_sid = i3GEO.configura.sid;
	    par.funcao = "gradecoord";
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/gradecoord/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			i3GEO.janela.snackBar({content: $trad('feito')});
			i3GEO.mapa.refresh();
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
	},
	getFormData: function(){
	    var data = {
		    ...i3GEO.util.getFormData("#i3GEOgradecoordContainer form")
	    };
	    return data
	}
};