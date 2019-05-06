if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.pontoempoligono = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOpontoempoligonoContainer",
	    "namespace": "pontoempoligono"
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
	    i3GEOF.pontoempoligono.t0();
	},
	t0: function()
	{
	    i3GEO.util.proximoAnterior("","i3GEOF.pontoempoligono.t1()","","i3GEOFgradeDePontost0","i3GEOpontoempoligonoresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.pontoempoligono.t0()","i3GEOF.pontoempoligono.t2()","","i3GEOF.pontoempoligono.t1","i3GEOpontoempoligonoresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.pontoempoligono.comboTemasSelPt();
	},
	t2: function(){
	    var erro = function(){
		i3GEO.janela.tempoMsg($trad('msgSelecionaTema',i3GEOF.pontoempoligono.dicionario));
		i3GEO.util.proximoAnterior("i3GEOF.pontoempoligono.t1()","","","i3GEOF.pontoempoligono.t2","i3GEOpontoempoligonoresultado",true,"i3GEOToolFormModalFooter");
	    };
	    if($i("i3GEOpontoempoligonotemasComSelPt"))
	    {
		if ($i("i3GEOpontoempoligonotemasComSelPt").value == ""){
		    erro();
		}
		else{
		    i3GEO.util.proximoAnterior("i3GEOF.pontoempoligono.t1()","i3GEOF.pontoempoligono.t3()","","i3GEOF.pontoempoligono.t2","i3GEOpontoempoligonoresultado",true,"i3GEOToolFormModalFooter");
		    i3GEOF.pontoempoligono.comboTemasSelPo();
		}
	    }
	    else{
		erro();
	    }
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.pontoempoligono.t2()","","","i3GEOF.pontoempoligono.t3","i3GEOpontoempoligonoresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var t,tsl = [],i,n;
	    t = $i("i3GEOpontoempoligonoSelTemasPo").getElementsByTagName("input");
	    n = t.length;
	    for (i=0;i<n; i++){
		if (t[i].type == "checkbox"){
		    if (t[i].checked == true)
		    {tsl.push(t[i].value);}
		}
	    }
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "pontoempoligono",
		    temaPt: $i("i3GEOpontoempoligonotemasComSelPt").value,
		    temasPo: tsl.join(","),
		    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten)
	    };

	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/exec.php",
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
	/*
	Function: comboTemasSelPt

	Cria um combo com a lista de temas do tipo pontos

	Veja:

	<i3GEO.util.comboTemas>
	 */
	comboTemasSelPt: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOpontoempoligonotemasComSelPt",
		    function(retorno){
			$i("i3GEOpontoempoligonoSelTemasPt").innerHTML = retorno.dados;
			if ($i("i3GEOpontoempoligonotemasComSelPt")){
			    $i("i3GEOpontoempoligonotemasComSelPt").onchange = function(){
				i3GEO.mapa.ativaTema($i("i3GEOpontoempoligonotemasComSelPt").value);
			    };
			}
			if(i3GEO.temaAtivo !== ""){
			    $i("i3GEOpontoempoligonotemasComSelPt").value = i3GEO.temaAtivo;
			    $i("i3GEOpontoempoligonotemasComSelPt").onchange.call();
			}
		    },
		    "i3GEOpontoempoligonoSelTemasPt",
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
	Function: comboTemasSelPo

	Cria uma lista de temas do tipo poligonal ou raster

	Veja:

	<i3GEO.util.checkTemas>
	 */
	comboTemasSelPo: function(){
	    i3GEO.util.checkTemas(
		    "i3GEOpontoempoligonotemasComSelPo",
		    function(retorno,listaNomes,listaValores){
			var r = i3GEO.util.checkCombo("", listaNomes, listaValores);
			$i("i3GEOpontoempoligonoSelTemasPo").innerHTML = r;
		    },
		    "",
		    "",
		    "polraster",
		    "i3GEOpontoempoligono",
		    "260px"
	    );
	}
};
