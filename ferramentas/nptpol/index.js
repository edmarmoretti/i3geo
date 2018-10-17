i3GEOF.nptpol = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOnptpolContainer",
	    "namespace": "nptpol"
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
	    i3GEOF.nptpol.t0();
	},
	t0: function()
	{
	    i3GEO.util.proximoAnterior("","i3GEOF.nptpol.t1()","","i3GEOFnptpolt0","i3GEOnptpolresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.nptpol.t0()","i3GEOF.nptpol.t2()","","i3GEOF.nptpol.t1","i3GEOnptpolresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.nptpol.comboTemasPontos();
	    i3GEOF.nptpol.comboTemasPoligonos();
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.nptpol.t1()","","","i3GEOF.nptpol.t2","i3GEOnptpolresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "nptPol",
		    temaPt: $i("i3GEOnptpolPontos").value,
		    temaPo: $i("i3GEOnptpolPoligonos").value,
		    somaritem: $i("i3GEOnptpoltemasItem").value,
		    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    };
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/nptpol/exec.php",
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
	Function: comboTemasPontos

	Cria um combo com a lista de temas pontuais

	Veja:

	<i3GEO.util.comboTemas>
	 */
	comboTemasPontos: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOnptpolPontos",
		    function(retorno){
			$i("i3GEOnptpolDivPontos").innerHTML = retorno.dados;
			$i("i3GEOnptpolDivPontos").style.display = "block";
			if ($i("i3GEOnptpolPontos")){
			    $i("i3GEOnptpolPontos").onchange = function(){
				var v = $i("i3GEOnptpolPontos").value;
				i3GEO.mapa.ativaTema(v);
				if(v != ""){
				    i3GEOF.nptpol.comboItens();
				}
			    };
			}
			if(i3GEO.temaAtivo !== ""){
			    $i("i3GEOnptpolPontos").value = i3GEO.temaAtivo;
			    i3GEOF.nptpol.comboItens();
			}
		    },
		    "i3GEOnptpolDivPontos",
		    "",
		    false,
		    "pontos",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	/*
	Function: comboTemasPoligonos

	Cria um combo com a lista de temas poligonais

	Veja:

	<i3GEO.util.comboTemas>
	 */
	comboTemasPoligonos: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOnptpolPoligonos",
		    function(retorno){
			$i("i3GEOnptpolDivPoligonos").innerHTML = retorno.dados;
			$i("i3GEOnptpolDivPoligonos").style.display = "block";
			if ($i("i3GEOnptpolPoligonos")){
			    $i("i3GEOnptpolPoligonos").onchange = function(){
				i3GEO.mapa.ativaTema($i("i3GEOnptpolPoligonos").value);
			    };
			}
			if(i3GEO.temaAtivo !== ""){
			    $i("i3GEOnptpolPoligonos").value = i3GEO.temaAtivo;
			}
		    },
		    "i3GEOnptpolDivPoligonos",
		    "",
		    false,
		    "poligonos",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	/*
	Function: comboItens

	Cria um combo para escolha de um item do tema

	Veja:

	<i3GEO.util.comboItens>

	 */
	comboItens: function(){
	    var tema = $i("i3GEOnptpolPontos").value;
	    if(tema != ""){
		i3GEO.util.comboItens(
			"i3GEOnptpoltemasItem",
			tema,
			function(retorno){
			    $i("i3GEOnptpolondeItens").innerHTML = retorno.dados;
			    $i("i3GEOnptpolondeItens").style.display = "block";
			},
			"i3GEOnptpolondeItens",
			"",
			"",
			"",
			"form-control comboTema"
		);
	    }
	    else{
		$i("i3GEOnptpolondeItens").innerHTML = "-";
	    }
	}
};