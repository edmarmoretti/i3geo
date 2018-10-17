if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.buffer = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEObufferContainer",
	    "namespace": "buffer"
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
		    sim: $trad("x14"),
		    nao: $trad("x15"),
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
	    i3f.t0();
	    i3f.comboTemas();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.buffer.t1()","","i3GEOF.buffer.t0","i3GEObufferresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.buffer.t0()","i3GEOF.buffer.t2()","","i3GEOF.buffer.t1","i3GEObufferresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.buffer.comboTemas();
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.buffer.t1()","i3GEOF.buffer.t3()","","i3GEOF.buffer.t2","i3GEObufferresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.buffer.comboItens();
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.buffer.t2()","","","i3GEOF.buffer.t3","i3GEObufferresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "criabuffer",
		    tema: $i("i3GEObuffertemasComSel").value,
		    multiplicar: $i("i3GEObufferdfator").value*1,
		    itemdistancia: $i("i3GEObuffertemasItem").value,
		    distancia: $i("i3GEObufferd").value*1
	    };
	    if(par.itemdistancia != ""){
		par.distancia = 0;
	    } else {
		par.multiplicar = 1;
	    }
	    if(par.tema == ""){
		i3GEO.janela.tempoMsg($trad('selecionaTema2',i3GEOF.centromassa.dicionario));
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/buffer/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			i3GEO.janela.snackBar({content: $trad('feito')});
			i3GEO.atualiza();
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
		    "i3GEObuffertemasComSel",
		    function(retorno){
			$i("i3GEObufferSelTemas").innerHTML = retorno.dados;
		    },
		    "i3GEObufferSelTemas",
		    "",
		    false,
		    "selecionados",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	comboItens: function(){
	    i3GEO.util.comboItens(
		    "i3GEObuffertemasItem",
		    $i("i3GEObuffertemasComSel").value,
		    function(retorno){
			$i("i3GEObufferondeItens").innerHTML = retorno.dados;
		    },
		    "i3GEObufferondeItens",
		    "",
		    "",
		    "",
		    "form-control comboTema"
	    );
	}
};
