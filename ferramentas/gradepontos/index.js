if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.gradepontos = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOgradepontosContainer",
	    "namespace": "gradepontos"
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
	    i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.gradepontos.capturaPonto()"]);
	    i3GEOF.gradepontos.t0();
	},
	t0: function(){
		var ins = $i("i3GEOgradepontosT0").innerHTML;
		i3GEO.util.proximoAnterior("","i3GEOF.gradepontos.t1()",ins,"i3GEOF.gradepontos.t0","i3GEOgradepontosresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
		var ins = "";
		//false para nao criar dois ids iguais
		if($i("i3GEOgradepontosProj").checked){
			ins = $i("i3GEOgradepontosT1a").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradepontos.t0()","i3GEOF.gradepontos.t2()",ins,"i3GEOF.gradepontos.t1a","i3GEOgradepontosresultado",false,"i3GEOToolFormModalFooter");
		}
		else{
			ins = $i("i3GEOgradepontosT1b").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradepontos.t0()","i3GEOF.gradepontos.t2()",ins,"i3GEOF.gradepontos.t1b","i3GEOgradepontosresultado",false,"i3GEOToolFormModalFooter");
		}
	},
	t2: function(){
		var ins = $i("i3GEOgradepontosT2").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradepontos.t1()","i3GEOF.gradepontos.t3()",ins,"i3GEOF.gradepontos.t2","i3GEOgradepontosresultado",true,"i3GEOToolFormModalFooter");
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.gradepontos.capturaPonto()"]);
	},
	t3: function(){
		var ins = $i("i3GEOgradepontosT3").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradepontos.t2()","i3GEOF.gradepontos.t4()",ins,"i3GEOF.gradepontos.t3","i3GEOgradepontosresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
		var ins = $i("i3GEOgradepontosT4").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradepontos.t3()","",ins,"i3GEOF.gradepontos.t4","i3GEOgradepontosresultado",true,"i3GEOToolFormModalFooter");
	},
	get: function(btn){
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    proj: false,
		    funcao: "gradepontos"
	    };
	    if(!$i("i3GEOgradepontosProj").checked){
		par.xdd = i3GEO.calculo.dms2dd($i("i3GEOgradepontosxg").value,$i("i3GEOgradepontosxm").value,$i("i3GEOgradepontosxs").value);
		par.ydd = i3GEO.calculo.dms2dd($i("i3GEOgradepontosyg").value,$i("i3GEOgradepontosym").value,$i("i3GEOgradepontosys").value);
	    }
	    else{
		par.proj = true;
		par.xdd = $i("i3GEOgradepontosxg").value;
		par.ydd = $i("i3GEOgradepontosyg").value;
	    }
	    par.px = i3GEO.calculo.dms2dd($i("i3GEOgradepontosixg").value,$i("i3GEOgradepontosixm").value,$i("i3GEOgradepontosixs").value);
	    par.py = i3GEO.calculo.dms2dd($i("i3GEOgradepontosiyg").value,$i("i3GEOgradepontosiym").value,$i("i3GEOgradepontosiys").value);
	    par.nptx = $i("i3GEOgradepontosnptx").value;
	    par.npty = $i("i3GEOgradepontosnpty").value;
	    if ((par.xdd == 0) || (par.ydd == 0)){
		i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradepontos.dicionario));
		return;
	    }
	    if ((par.nptx == 0) || (par.npty == 0)){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradepontos.dicionario));
		return;
	    }
	    if (par.nptx * par.npty > 10000){
		i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradepontos.dicionario));
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/gradepontos/exec.php",
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
	Function: capturaPonto

	Captura um ponto no mapa e preenche os campos de coordenadas de in&iacute;cio da grade
	*/
	capturaPonto: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradepontosixg",
			"i3GEOgradepontosixm",
			"i3GEOgradepontosixs",
			"i3GEOgradepontosiyg",
			"i3GEOgradepontosiym",
			"i3GEOgradepontosiys"
		);
	}
};
