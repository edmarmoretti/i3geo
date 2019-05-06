if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.dissolve = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOdissolveContainer",
	    "namespace": "dissolve"
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
	    i3GEOF.dissolve.t0();
	    i3GEOF.dissolve.comboTemas();
	},
	t0: function()
	{
	    i3GEO.util.proximoAnterior("","i3GEOF.dissolve.t1()","","i3GEOFgradeDePontost0","i3GEOdissolveresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.dissolve.t0()","i3GEOF.dissolve.t2()","","i3GEOF.dissolve.t1","i3GEOdissolveresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.dissolve.comboTemas();
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.dissolve.t1()","","","i3GEOF.dissolve.t2","i3GEOdissolveresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "dissolvePoligono",
		    tema: $i("i3GEOdissolvetemasComSel").value,
		    ext: i3GEO.parametros.mapexten,
		    item: $i("i3GEOdissolveItem").value
	    };
	    if(par.tema == ""){
		i3GEO.janela.tempoMsg($trad('escolhaTema',i3GEOF.dissolve.dicionario));
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/dissolve/exec.php",
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
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOdissolvetemasComSel",
		    function(retorno){
			$i("i3GEOdissolveSelTemas").innerHTML = retorno.dados;
			var c = $i("i3GEOdissolvetemasComSel");
			c.onchange = function(){
			    i3GEOF.dissolve.comboItem();
			};
		    },
		    "i3GEOdissolveSelTemas",
		    "",
		    false,
		    "poligonosSelecionados",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	comboItem: function(){
	    i3GEO.util.comboItens(
		    "i3GEOdissolveItem",
		    $i("i3GEOdissolvetemasComSel").value,
		    function(retorno){
			$i("i3GEOdissolveDivItem").innerHTML = retorno.dados;
		    },
		    "i3GEOdissolveDivItem",
		    "",
		    "",
		    "",
		    "form-control comboTema"
	    );
	}
};