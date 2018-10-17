if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.distanciaptpt = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOdistanciaptptContainer",
	    "namespace": "distanciaptpt"
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
	    i3GEOF.distanciaptpt.t0();
	},
	t0: function()
	{
	    i3GEO.util.proximoAnterior("","i3GEOF.distanciaptpt.t1()","","i3GEOF.distanciaptpt.t0","i3GEOdistanciaptptresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t0()","i3GEOF.distanciaptpt.t2()","","i3GEOF.distanciaptpt.t1","i3GEOdistanciaptptresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.distanciaptpt.comboTemasOrigem();
	    i3GEOF.distanciaptpt.comboTemasDestino();
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t1()","i3GEOF.distanciaptpt.t3()","","i3GEOF.distanciaptpt.t2","i3GEOdistanciaptptresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.distanciaptpt.comboItensOrigem();
	    i3GEOF.distanciaptpt.comboItensDestino();
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t2()","","","i3GEOF.distanciaptpt.t3","i3GEOdistanciaptptresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "distanciaptpt",
		    distancia: $i("i3GEOFdistanciaptptdistancia").value,
		    temaorigem: $i("i3GEOdistanciaptpttemasComSel").value,
		    temadestino: $i("i3GEOdistanciaptpttemas").value,
		    itemorigem: $i("i3GEOFdistanciaptptItemOrigem").value,
		    itemdestino: $i("i3GEOFdistanciaptptItemDestino").value
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/exec.php",
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
	/*
	Function: comboTemasOrigem

	Cria um combo com a lista de temas pontuais com elementos selecionados

	Veja:

	<i3GEO.util.comboTemas>

	 */
	comboTemasOrigem: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOdistanciaptpttemasComSel",
		    function(retorno){
			$i("i3GEOdistanciaptptSelTemasOrigem").innerHTML = retorno.dados;
			if ($i("i3GEOdistanciaptpttemasComSel")){
			    $i("i3GEOdistanciaptpttemasComSel").onchange = function(){
				i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemasComSel").value);
			    };
			}
			if(i3GEO.temaAtivo !== ""){
			    $i("i3GEOdistanciaptpttemasComSel").value = i3GEO.temaAtivo;
			}
		    },
		    "i3GEOdistanciaptptSelTemasOrigem",
		    "",
		    false,
		    "pontosSelecionados",
		    "",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	/*
	Function: comboTemasDestino

	Cria um combo com a lista de temas pontuais com elementos destino

	Veja:

	<i3GEO.util.comboTemas>

	 */
	comboTemasDestino: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOdistanciaptpttemas",
		    function(retorno){
			$i("i3GEOdistanciaptptSelTemasDestino").innerHTML = retorno.dados;
			if ($i("i3GEOdistanciaptpttemas")){
			    $i("i3GEOdistanciaptpttemas").onchange = function(){
				i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemas").value);
			    };
			}
			if(i3GEO.temaAtivo !== ""){
			    $i("i3GEOdistanciaptpttemas").value = i3GEO.temaAtivo;
			}
		    },
		    "i3GEOdistanciaptptSelTemasDestino",
		    "",
		    false,
		    "pontos",
		    "",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	/*
	Function: comboItensOrigem

	Cria um combo para escolha de um item do tema de origem

	Veja:

	<i3GEO.util.comboItens>

	 */
	comboItensOrigem: function(){
	    i3GEO.util.comboItens(
		    "i3GEOFdistanciaptptItemOrigem",
		    $i("i3GEOdistanciaptpttemasComSel").value,
		    function(retorno){
			$i("i3GEOondeItensTemaOrigem").innerHTML = retorno.dados;
			$i("i3GEOondeItensTemaOrigem").style.display = "block";
		    },
		    "i3GEOondeItensTemaOrigem",
		    "",
		    "",
		    "",
		    "form-control comboTema"
	    );
	},
	/*
	Function: comboItensDestino

	Cria um combo para escolha de um item do tema de destino

	Veja:

	<i3GEO.util.comboItens>

	 */
	comboItensDestino: function(){
	    i3GEO.util.comboItens(
		    "i3GEOFdistanciaptptItemDestino",
		    $i("i3GEOdistanciaptpttemas").value,
		    function(retorno){
			$i("i3GEOondeItensTemaDestino").innerHTML = retorno.dados;
			$i("i3GEOondeItensTemaDestino").style.display = "block";
		    },
		    "i3GEOondeItensTemaDestino",
		    "",
		    "",
		    "",
		    "form-control comboTema"
	    );
	}
};
