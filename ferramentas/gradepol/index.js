if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.gradepol = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOgradepolContainer",
	    "namespace": "gradepol"
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
	    i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.gradepol.capturaPonto()"]);
	    i3GEOF.gradepol.t0();
	},
	t0: function(){
	    var ins = $i("i3GEOgradepolT0").innerHTML;
	    i3GEO.util.proximoAnterior("","i3GEOF.gradepol.t1()",ins,"i3GEOF.gradepol.t0","i3GEOgradepolresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    var ins = "";
	    //false para nao criar dois ids iguais
	    if($i("i3GEOgradepolProj").checked){
		ins = $i("i3GEOgradepolT1a").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradepol.t0()","i3GEOF.gradepol.t2()",ins,"i3GEOF.gradepol.t1a","i3GEOgradepolresultado",false,"i3GEOToolFormModalFooter");
	    }
	    else{
		ins = $i("i3GEOgradepolT1b").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradepol.t0()","i3GEOF.gradepol.t2()",ins,"i3GEOF.gradepol.t1b","i3GEOgradepolresultado",false,"i3GEOToolFormModalFooter");
	    }
	},
	t2: function(){
	    var ins = $i("i3GEOgradepolT2").innerHTML;
	    i3GEO.util.proximoAnterior("i3GEOF.gradepol.t1()","i3GEOF.gradepol.t3()",ins,"i3GEOF.gradepol.t2","i3GEOgradepolresultado",true,"i3GEOToolFormModalFooter");
	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.gradepol.capturaPonto()"]);
	},
	t3: function(){
	    var ins = $i("i3GEOgradepolT3").innerHTML;
	    i3GEO.util.proximoAnterior("i3GEOF.gradepol.t2()","i3GEOF.gradepol.t4()",ins,"i3GEOF.gradepol.t3","i3GEOgradepolresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
	    var ins = $i("i3GEOgradepolT4").innerHTML;
	    i3GEO.util.proximoAnterior("i3GEOF.gradepol.t3()","",ins,"i3GEOF.gradepol.t4","i3GEOgradepolresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "gradedepol"
	    };
	    if(!$i("i3GEOgradepolProj").checked){
		par.xdd = i3GEO.calculo.dms2dd($i("i3GEOgradepolxg").value,$i("i3GEOgradepolxm").value,$i("i3GEOgradepolxs").value);
		par.ydd = i3GEO.calculo.dms2dd($i("i3GEOgradepolyg").value,$i("i3GEOgradepolym").value,$i("i3GEOgradepolys").value);
	    }
	    else{
		par.proj = true;
		par.xdd = $i("i3GEOgradepolxg").value;
		par.ydd = $i("i3GEOgradepolyg").value;
	    }
	    par.px = i3GEO.calculo.dms2dd($i("i3GEOgradepolixg").value,$i("i3GEOgradepolixm").value,$i("i3GEOgradepolixs").value);
	    par.py = i3GEO.calculo.dms2dd($i("i3GEOgradepoliyg").value,$i("i3GEOgradepoliym").value,$i("i3GEOgradepoliys").value);
	    par.nptx = $i("i3GEOgradepolnptx").value;
	    par.npty = $i("i3GEOgradepolnpty").value;
	    if ((par.xdd == 0) || (par.ydd == 0)){
		i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradepol.dicionario));
		return;
	    }
	    if ((par.nptx == 0) || (par.npty == 0)){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradepol.dicionario));
		return;
	    }
	    if (par.nptx * par.npty > 10000){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradepol.dicionario));
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/gradepol/exec.php",
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
	capturaPonto: function(){
	    i3GEO.eventos.cliqueCapturaPt(
		    "i3GEOgradepolixg",
		    "i3GEOgradepolixm",
		    "i3GEOgradepolixs",
		    "i3GEOgradepoliyg",
		    "i3GEOgradepoliym",
		    "i3GEOgradepoliys"
	    );
	}
};
