i3GEOF.gradehex = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOgradehexContainer",
	    "namespace": "gradehex"
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
	    i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.gradehex.capturaPonto()"]);
	    i3GEOF.gradehex.t0();
	},
	t0: function(){
		var ins = $i("i3GEOgradehexT0").innerHTML;
		i3GEO.util.proximoAnterior("","i3GEOF.gradehex.t1()",ins,"i3GEOF.gradehex.t0","i3GEOgradehexresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
		var ins = "";
		//false para nao criar dois ids iguais
		if($i("i3GEOgradehexProj").checked){
			ins = $i("i3GEOgradehexT1a").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradehex.t0()","i3GEOF.gradehex.t2()",ins,"i3GEOF.gradehex.t1a","i3GEOgradehexresultado",false,"i3GEOToolFormModalFooter");
		}
		else{
			ins = $i("i3GEOgradehexT1b").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradehex.t0()","i3GEOF.gradehex.t2()",ins,"i3GEOF.gradehex.t1b","i3GEOgradehexresultado",false,"i3GEOToolFormModalFooter");
		}
	},
	t2: function(){
		var ins = $i("i3GEOgradehexT2").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradehex.t1()","i3GEOF.gradehex.t3()",ins,"i3GEOF.gradehex.t2","i3GEOgradehexresultado",true,"i3GEOToolFormModalFooter");
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.gradehex.capturaPonto()"]);
	},
	t3: function(){
		var ins = $i("i3GEOgradehexT3").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradehex.t2()","i3GEOF.gradehex.t4()",ins,"i3GEOF.gradehex.t3","i3GEOgradehexresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
		var ins = $i("i3GEOgradehexT4").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradehex.t3()","",ins,"i3GEOF.gradehex.t4","i3GEOgradehexresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "gradedehex"
	    };
	    if(!$i("i3GEOgradehexProj").checked){
		par.dd = i3GEO.calculo.dms2dd($i("i3GEOgradehexxg").value,$i("i3GEOgradehexxm").value,$i("i3GEOgradehexxs").value);
	    }
	    else{
		par.proj = true;
		par.xdd = $i("i3GEOgradehexxg").value;
		par.ydd = $i("i3GEOgradehexyg").value;
	    }
	    par.px = i3GEO.calculo.dms2dd($i("i3GEOgradehexixg").value,$i("i3GEOgradehexixm").value,$i("i3GEOgradehexixs").value);
	    par.py = i3GEO.calculo.dms2dd($i("i3GEOgradehexiyg").value,$i("i3GEOgradehexiym").value,$i("i3GEOgradehexiys").value);
	    par.nptx = $i("i3GEOgradehexnptx").value;
	    par.npty = $i("i3GEOgradehexnpty").value;
	    if ((par.xdd == 0) || (par.ydd == 0)){
		i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradehex.dicionario));
		return;
	    }
	    if ((par.nptx == 0) || (par.npty == 0)){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradehex.dicionario));
		return;
	    }
	    if (par.nptx * par.npty > 10000){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradehex.dicionario));
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/gradehex/exec.php",
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
		    "i3GEOgradehexixg",
		    "i3GEOgradehexixm",
		    "i3GEOgradehexixs",
		    "i3GEOgradehexiyg",
		    "i3GEOgradehexiym",
		    "i3GEOgradehexiys"
	    );
	}
};
