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
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	    i3GEO.guias.mostraGuiaFerramenta("i3GEO" + p.namespace + "guia1","i3GEO" + p.namespace + "guia");
	    //eventos das guias
	    $i("i3GEO" + p.namespace + "guia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEO" + p.namespace + "guia1","i3GEO" + p.namespace + "guia");
	    };
	    $i("i3GEO" + p.namespace + "guia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEO" + p.namespace + "guia2","i3GEO" + p.namespace + "guia");
	    };
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
	    par.tema = $i("i3GEOpontosdistritemasComSel").value;
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
	    par.tema2 = "";
	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    i3f.get({
		snackbar: false,
		fn: function(data){
		    i3GEO.atualiza();
		},
		btn: btn,
		par: par
	    });
	},
	analiseDensidade: function(btn){
	    if(!$i("i3GEOpontosdistritemasComSel"))
	    {return;}
	    if(i3GEOF.pontosdistri.aguarde.visibility === "visible")
	    {return;}
	    i3GEOF.pontosdistri.aguarde.visibility = "visible";
	    try{
		var n = $i("i3GEOpontosdistrinumclasses").value,
		ci = $i("i3GEOpontosdistricori").value,
		cf = $i("i3GEOpontosdistricorf").value,
		temp = function(){
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    i3GEO.atualiza();
		},
		tema = $i("i3GEOpontosdistritemasComSel").value,
		cp = new cpaint(),
		p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=densidade&limitepontos="+$i("i3GEOpontosdistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosdistriextendelimite").value+"&ext="+i3GEO.parametros.mapexten;
		if(tema === ""){
		    i3GEO.janela.tempoMsg("Escolha um tema");
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    return;
		}
		cp.set_response_type("JSON");
		cp.call(p,"analiseDistriPt",temp);
	    }
	    catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosdistri.aguarde.visibility = "hidden";}
	},
	analiseKernel: function(btn){
	    if(!$i("i3GEOpontosdistritemasComSel"))
	    {return;}
	    if(i3GEOF.pontosdistri.aguarde.visibility === "visible")
	    {return;}
	    i3GEOF.pontosdistri.aguarde.visibility = "visible";
	    try{
		var n = $i("i3GEOpontosdistrinumclasses").value,
		ci = $i("i3GEOpontosdistricori").value,
		cf = $i("i3GEOpontosdistricorf").value,
		temp = function(){
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    i3GEO.atualiza();
		},
		tema = $i("i3GEOpontosdistritemasComSel").value,
		cp = new cpaint(),
		p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=kernel&limitepontos="+$i("i3GEOpontosdistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosdistriextendelimite").value+"&sigma="+$i("i3GEOpontosdistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
		if(tema === ""){
		    i3GEO.janela.tempoMsg("Escolha um tema");
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    return;
		}
		cp.set_response_type("JSON");
		cp.call(p,"analiseDistriPt",temp);
	    }
	    catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosdistri.aguarde.visibility = "hidden";}
	},
	analiseDeldir: function(btn){
	    if(!$i("i3GEOpontosdistritemasComSel"))
	    {return;}
	    if(i3GEOF.pontosdistri.aguarde.visibility === "visible")
	    {return;}
	    i3GEOF.pontosdistri.aguarde.visibility = "visible";
	    try{
		var tema = $i("i3GEOpontosdistritemasComSel").value,
		temp = function(){
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    i3GEO.atualiza();
		},
		cp = new cpaint(),
		p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses=&cori=&corf=&tipo=deldir&limitepontos=&extendelimite=&sigma=&ext="+i3GEO.parametros.mapexten;
		if(tema === ""){
		    i3GEO.janela.tempoMsg("Escolha um tema");
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    return;
		}
		cp.set_response_type("JSON");
		cp.call(p,"analiseDistriPt",temp);
	    }
	    catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosdistri.aguarde.visibility = "hidden";}
	},
	analiseRelatorio: function(btn){
	    if(!$i("i3GEOpontosdistritemasComSel"))
	    {return;}
	    if(i3GEOF.pontosdistri.aguarde.visibility === "visible")
	    {return;}
	    i3GEOF.pontosdistri.aguarde.visibility = "visible";
	    try{
		var n = $i("i3GEOpontosdistrinumclasses").value,
		ci = $i("i3GEOpontosdistricori").value,
		cf = $i("i3GEOpontosdistricorf").value,
		temp = function(retorno){
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    window.open(retorno.data);
		},
		tema = $i("i3GEOpontosdistritemasComSel").value,
		cp = new cpaint(),
		p = i3GEO.configura.locaplic+"/ferramentas/pontosdistri/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=relatorio&limitepontos="+$i("i3GEOpontosdistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosdistriextendelimite").value+"&sigma="+$i("i3GEOpontosdistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
		if(tema === ""){
		    i3GEO.janela.tempoMsg("Escolha um tema");
		    i3GEOF.pontosdistri.aguarde.visibility = "hidden";
		    return;
		}
		cp.set_response_type("JSON");
		cp.call(p,"analiseDistriPt",temp);
	    }
	    catch(e){i3GEO.janela.tempoMsg(e);i3GEOF.pontosdistri.aguarde.visibility = "hidden";}
	}
};
