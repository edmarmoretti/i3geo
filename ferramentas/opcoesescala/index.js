if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}

i3GEOF.opcoesescala = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOopcoesescalaContainer",
	    "namespace": "opcoesescala",
	    "dataForm": ""
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic+"/ferramentas/"+p.namespace+"/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=parametrosBarraEscala";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.dataForm = r2[0];
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		    if(p.dataForm.errorMsg && p.dataForm.errorMsg != ""){
			i3GEO.janela.snackBar({content: p.dataForm.errorMsg, style:'red'});
			i3GEO.janela.fechaAguarde();
			i3f.destroy();
		    }
		}).fail(function(data) {
		    i3GEO.janela.snackBar({content: "Erro. " + data.status, style:'red'});
		    i3f.destroy();
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEOF.opcoesescala._parameters.mustache = "";
	    i3GEOF.opcoesescala._parameters.dataForm = "";
	    i3GEO.mapa.dialogo.imprimir();
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    sim: $trad("x14"),
		    nao: $trad("x15"),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario),
		    ...{
			values: p.dataForm
		    }
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy
		    });
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3f.applyDataForm(p.dataForm);
	},
	corj: function(obj){
	    i3GEO.util.abreCor("",obj);
	},
	applyDataForm: function(data){
	    var id = this._parameters.idContainer;
	    $.each($("#" + id).find("select"),function(i,v){
		if(data[v.name]){
		    v.value = data[v.name];
		}
	    });
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#" + this._parameters.idContainer + " form");
	    data.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    return data
	},
	mudaEscalaGrafica: function(btn){
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    var par = this.getFormData(),
	    	i3f = this;
	    par.g_sid = i3GEO.configura.sid;
	    par.funcao = "mudaEscalaGrafica";
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: $trad("concluido",i3f.dicionario)});
			i3f.destroy();
		    }
	    )
	    .fail(
		    function(data){
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
			i3f.destroy();
		    }
	    );
	},
	test: function(btn){
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    var par = this.getFormData(),
	    	i3f = this;
	    par.g_sid = i3GEO.configura.sid;
	    par.funcao = "testaescalagrafica";
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.closeMsg("<img src='" + data + "' >");
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	}
};