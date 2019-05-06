if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.animagif = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOanimagifContainer",
	    "namespace": "animagif"
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
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    login: "hidden",
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    mapext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    if (i3GEO.login.verificaCookieLogin() === true && i3GEO.parametros.editor === "sim" ) {
		hash.login = "";
	    }
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
	    i3GEOF.animagif.comboTemas();
	    i3f.t0();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.animagif.t1()","","i3GEOF.animagif.t0","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.animagif.t0()","i3GEOF.animagif.t2()","","i3GEOFanimagift1","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.animagif.t1()","i3GEOF.animagif.t3()","","i3GEOF.animagif.t2","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.animagif.t2()","i3GEOF.animagif.t4()","","i3GEOF.animagif.t3","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.animagif.t3()","","","i3GEOF.animagif.t4","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOFanimagiftemas",
		    function(retorno){
			$i("i3GEOFanimagifSelTemas").innerHTML = retorno.dados;
			$i("i3GEOFanimagiftemas").value = i3GEOF.animagif._parameters.tema;
			$i("i3GEOFanimagiftemas").onchange = function(){
			    var p = i3GEOF.animagif._parameters;
			    if(this.value != undefined){
				p.tema = this.value;
			    }
			    i3GEOF.animagif.comboItens();
			};
			//caso os parametros estiverem definidos na camada
			//preenche o formulario
			if(i3GEOF.animagif._parameters.tema != ""){
			    $i("i3GEOFanimagiftemas").onchange.call();
			}
		    },
		    "i3GEOFanimagifSelTemas",
		    "",
		    false,
		    "comTabela",
		    " ",
		    false,
		    true,
		    "form-control"
	    );
	},
	comboItens : function() {
	    camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[i3GEOF.animagif._parameters.tema];
	    if (camada && camada.ferramentas.animagif) {
		if(camada.ferramentas.animagif.auto === "sim"){
		    $i("ativaAoAdic").checked = true;
		}
		if(camada.ferramentas.animagif.exec === "sim"){
		    $i("execAoAdic").checked = true;
		}
		$i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0].value = camada.ferramentas.animagif.tipocolunat;
		$i("i3GEOANIMAGIFtempo").value = camada.ferramentas.animagif.tempo;
		$i("i3GEOANIMAGIFw").value = camada.ferramentas.animagif.w;
		$i("i3GEOANIMAGIFh").value = camada.ferramentas.animagif.h;
		$i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0].value = camada.ferramentas.animagif.cache;
		$i("i3GEOANIMAGIFextensao").value = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		$i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0].value = camada.ferramentas.animagif.legenda;
		$i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0].value = camada.ferramentas.animagif.transparencia;
		$i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0].value = camada.ferramentas.animagif.operador;
		$i("i3GEOANIMAGIFnulos").value = camada.ferramentas.animagif.nulos;
		// combo para escolher a coluna com as datas
		i3GEO.util.comboItens(
			"i3GEOanimagifcolunat",
			i3GEOF.animagif._parameters.tema,
			function(retorno) {
			    $i("i3GEOANIMAGIFcolunatSel").innerHTML = retorno.dados;
			    temp = $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0];
			    temp.value = camada.ferramentas.animagif.colunat;
			},
			"i3GEOanimagifcolunatSel",
			"",
			"sim",
			"",
			"form-control"
		);
	    } else if (camada != "") {
		i3GEO.util.comboItens(
			"i3GEOanimagifcolunat",
			i3GEOF.animagif._parameters.tema,
			function(retorno) {
			    $i("i3GEOANIMAGIFcolunatSel").innerHTML = retorno.dados;
			},
			"i3GEOanimagifcolunatSel",
			"",
			"sim",
			"",
			"form-control"
		);
		$i("i3GEOANIMAGIFextensao").value = i3GEO.parametros.mapexten;
	    }
	},
	getFormData: function(){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": p.tema,
		    "sid": i3GEO.configura.sid,
		    "colunat": $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0].value,
		    "tipocolunat": $i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0].value,
		    "tempo": $i("i3GEOANIMAGIFtempo").value,
		    "w": $i("i3GEOANIMAGIFw").value,
		    "h": $i("i3GEOANIMAGIFh").value,
		    "cache": $i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0].value,
		    "mapext": $i("i3GEOANIMAGIFextensao").value,
		    "legenda": $i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0].value,
		    "transparente": $i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0].value,
		    "operador": $i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0].value,
		    "nulos": $i("i3GEOANIMAGIFnulos").value
	    };
	    return par;
	},
	salvaParametros: function(btn){
	    var j, auto = "nao", exec = "nao";
	    if($i("ativaAoAdic").checked === true){
		auto = "sim";
	    }
	    if($i("execAoAdic").checked === true){
		exec = "sim";
	    }
	    j = '{"colunat":"'
		+ $i("i3GEOANIMAGIFcolunatSel").getElementsByTagName("select")[0].value
		+ '","tipocolunat":"'
		+ $i("i3GEOANIMAGIFtipocolunat").getElementsByTagName("select")[0].value
		+ '","tempo":"'
		+ $i("i3GEOANIMAGIFtempo").value
		+ '","w":"'
		+ $i("i3GEOANIMAGIFw").value
		+ '","h":"'
		+ $i("i3GEOANIMAGIFh").value
		+ '","cache":"'
		+ $i("i3GEOANIMAGIFcache").getElementsByTagName("select")[0].value
		+ '","mapext":"'
		+ $i("i3GEOANIMAGIFextensao").value
		+ '","legenda":"'
		+ $i("i3GEOANIMAGIFlegenda").getElementsByTagName("select")[0].value
		+ '","transparente":"'
		+ $i("i3GEOANIMAGIFtransparencia").getElementsByTagName("select")[0].value
		+ '","operador":"'
		+ $i("i3GEOANIMAGIFoperador").getElementsByTagName("select")[0].value
		+ '","nulos":"'
		+ $i("i3GEOANIMAGIFnulos").value
		+ '","auto":"'
		+ auto
		+ '","exec":"'
		+ exec
		+ '"}';

	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": i3GEOF.animagif.tema,
		    "g_sid": i3GEO.configura.sid,
		    "animagif": i3GEO.util.base64encode(j),
		    "funcao": "inclui"
	    };
	    i3f.post({
		snackbar: true,
		btn: btn,
		par: par,
		refresh: true,
		fn: function(){
		    window.open(i3GEO.configura.locaplic+"/ferramentas/storymap/default.php?layers=&tema=" + i3GEOF.storymap._parameters.tema);
		},
		prog: i3GEO.configura.locaplic + "/ferramentas/storymap/exec.php"
	    });
	},
	removeParametros: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": i3GEOF.animagif.tema,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "remove"
	    };
	    i3f.post({
		snackbar: true,
		btn: btn,
		par: par,
		refresh: false,
		prog: i3GEO.configura.locaplic + "/ferramentas/animagif/exec.php"
	    });
	},
	ativa : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData(),
	    url = i3GEO.configura.locaplic+"/ferramentas/animagif/index.php?";
	    url += jQuery.param( par );
	    var html = "<iframe style='border:0px; width: " + ((par.w*1) + 50) + "px; height: " + ((par.h*1) + 100) + "px' src='" + url + "'></iframe>";
	    i3GEO.janela.closeMsg(html);
	},
	post: function({snackbar = true, btn = false, par = {}, refresh = false, prog = "exec", fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    delete par["refresh"];
	    $.post(
		    prog,
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
			if(refresh){
			    i3GEO.arvoreDeCamadas.CAMADAS = [];
			    i3GEO.mapa.refresh();
			    i3GEO.Interface.atualizaTema("", i3GEOF.animagif._parameters.tema);
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
	}
};
