if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.markercluster = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOmarkerclusterContainer",
	    "namespace": "markercluster"
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
	    i3GEO.eventos.cliquePerm.ativa();
	    i3GEO.util.aplicaAquarela(p.idContainer);
	    i3f.t0();
	},
	t0 : function() {
	    i3GEO.util.proximoAnterior(
		    "",
		    "i3GEOF.markercluster.t1()",
		    "",
		    "i3GEOF.markercluster.t0",
		    "i3GEOmarkerclusterresultado",
		    true,
	    "i3GEOToolFormModalFooter");
	},
	t1 : function() {
	    i3GEO.util.proximoAnterior(
		    "i3GEOF.markercluster.t0()",
		    "i3GEOF.markercluster.t2()",
		    "",
		    "i3GEOF.markercluster.t1",
		    "i3GEOmarkerclusterresultado",
		    true,
	    "i3GEOToolFormModalFooter");
	    i3GEOF.markercluster.comboTemas();
	},
	t2 : function() {
	    i3GEO.util.proximoAnterior(
		    "i3GEOF.markercluster.t1()",
		    "i3GEOF.markercluster.t3()",
		    "",
		    "i3GEOF.markercluster.t2",
		    "i3GEOmarkerclusterresultado",
		    true,
	    "i3GEOToolFormModalFooter");
	    //i3GEOF.markercluster.comboItens();
	},
	t3 : function() {
	    i3GEO.util.proximoAnterior(
		    "i3GEOF.markercluster.t2()",
		    "",
		    "",
		    "i3GEOF.markercluster.t3",
		    "i3GEOmarkerclusterresultado",
		    true,
	    "i3GEOToolFormModalFooter");
	},
	get : function(btn) {
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "criamarkercluster",
		    tema: $i("i3GEOmarkerclustertemasComSel").value,
		    titulo: $i("i3GEOmarkerclusterTitulo").value,
		    opacidade: $i("i3GEOmarkerclusterOpacidade").value,
		    gridSize: $i("i3GEOmarkerclusterRaio").value,
		    color: i3GEO.util.rgb2hex($i("i3GEOmarkerclusterColor").value),
		    strokecolor: i3GEO.util.rgb2hex($i("i3GEOmarkerclusterStrokecolor").value),
		    textcolor: $i("i3GEOmarkerclusterTextcolor").value
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/markercluster/exec.php",
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
	comboTemas : function() {
	    i3GEO.util.comboTemas(
		    "i3GEOmarkerclustertemasComSel",
		    function(retorno) {
			$i("i3GEOmarkerclusterSelTemas").innerHTML = retorno.dados;
		    },
		    "i3GEOmarkerclusterSelTemas",
		    "",
		    false,
		    "comTabela",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	comboItens : function() {
	    i3GEO.util.comboItens(
		    "i3GEOmarkerclustertemasItem",
		    $i("i3GEOmarkerclustertemasComSel").value,
		    function(retorno) {
			$i("i3GEOmarkerclusterondeItens").innerHTML = retorno.dados;
		    },
		    "i3GEOmarkerclusterondeItens",
		    "",
		    "",
		    "",
		    "form-control comboTema"
	    );
	}
};