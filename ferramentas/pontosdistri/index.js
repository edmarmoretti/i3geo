if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.pontosdistri = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOpontosdistriContainer",
	    "namespace": "pontosdistri"
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.get(t1).done(function(r1) {
		    p.mustache = r1;
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.snackBar({content: $trad("erroTpl"),style: "red"});
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    //i3GEOF.legenda._parameters.mustache = "";
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    limitePontos: i3GEO.util.comboSimNao('limitepontos','sim'),
		    idContainer: p.idContainer,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			footer: true,
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width':'', 'height': '50%','position': 'fixed','top': 0, 'left': 0, 'right': 0, bottom: 'unset', 'margin': 'auto'}

		    });
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3GEO.util.comboTemas(
		    "",
		    function(retorno){
			$i("i3GEOpontosdistriTemas").innerHTML = retorno.dados;
		    },
		    "i3GEOpontosdistriTemas",
		    "tema",
		    false,
		    "selecionados",
		    " "
	    );
	    i3GEO.janela.snackBar({content: $trad('alerta1',i3GEOF.pontosdistri.dicionario)});
	    i3GEOF.pontosdistri.t0();
	},
	t0: function()
	{
	    i3GEO.util.proximoAnterior("","i3GEOF.pontosdistri.t1()","","i3GEOF.pontosdistri.t0","i3GEOpontosdistriresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.pontosdistri.t0()","i3GEOF.pontosdistri.t2()","","i3GEOF.pontosdistri.t1","i3GEOpontosdistriresultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.pontosdistri.t1()","","","i3GEOF.pontosdistri.t2","i3GEOpontosdistriresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function({snackbar = true, btn = false, par = {}, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + p.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			if(snackbar){
			    i3GEO.janela.snackBar({content: $trad('feito')});
			}
			if(fn){
			    fn(data);
			}
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
		    ...i3GEO.util.getFormData("#i3GEOpontosdistriguia1obj form"),
		    ...i3GEO.util.getFormData("#i3GEOpontosdistriguia2obj form")
	    };
	    return data
	},
	verCores: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "verPaleta";
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    var ins = "",
		    i,
		    n = data.length;
		    for (i=0;i<n;i++){
			ins += "<div style=background-color:rgb("+data[i]+") >"+data[i]+"</div>";
		    }
		    $i("i3GEOpontosdistrimostracores").innerHTML = ins;
		},
		btn: btn,
		par: par
	    });
	},
	analiseDistancia: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "analiseDistriPt";
	    par.tipo = "distancia";
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: par
	    });
	},
	analiseDensidade: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "analiseDistriPt";
	    par.tipo = "densidade";
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: par
	    });
	},
	analiseKernel: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "analiseDistriPt";
	    par.tipo = "kernel";
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: par
	    });
	},
	analiseDeldir: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "analiseDistriPt";
	    par.tipo = "deldir";
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.mapa.refresh();
		},
		btn: btn,
		par: par
	    });
	},
	analiseRelatorio: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "analiseDistriPt";
	    par.tipo = "relatorio";
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.janela.closeMsg("<div class='text-left container-fluid'>"+data+"</div>");
		},
		btn: btn,
		par: par
	    });
	}
};
