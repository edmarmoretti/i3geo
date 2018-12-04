if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.storymap = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOstorymapContainer",
	    "namespace": "storymap"
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
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    if (i3GEO.login.verificaCookieLogin() === true && i3GEO.parametros.editor === "sim") {
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
	    i3GEOF.storymap.comboTemas();
	    i3f.t0();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.storymap.t1()","","i3GEOF.storymap.t0","i3GEOstorymapresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.storymap.t0()","i3GEOF.storymap.t2()","","i3GEOF.storymap.t1","i3GEOstorymapresultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.storymap.t1()","i3GEOF.storymap.t3()","","i3GEOF.storymap.t2","i3GEOstorymapresultado",true,"i3GEOToolFormModalFooter");
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.storymap.t2()","i3GEOF.storymap.t4()","","i3GEOF.storymap.t3","i3GEOstorymapresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.storymap.t3()","","","i3GEOF.storymap.t4","i3GEOstorymapresultado",true,"i3GEOToolFormModalFooter");
	},
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOFstorymaptemas",
		    function(retorno){
			$i("i3GEOFstorymapSelTemas").innerHTML = retorno.dados;
			$i("i3GEOFstorymaptemas").value = i3GEOF.storymap._parameters.tema;
			$i("i3GEOFstorymaptemas").onchange = function(){
			    var p = i3GEOF.storymap._parameters;
			    p.tema = this.value;
			    i3GEOF.storymap.comboItens();
			};
			//caso os parametros estiverem definidos na camada
			//preenche o formulario
			if(i3GEOF.storymap._parameters.tema != ""){
			    $i("i3GEOstorymaptemasComSel").onchange.call();
			}
		    },
		    "i3GEOFstorymapSelTemas",
		    "",
		    false,
		    "comTabela",
		    " ",
		    false,
		    true,
		    "form-control"
	    );
	},
	comboItens: function(){
	    var camada = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[i3GEOF.storymap._parameters.tema];
	    var temp = function(r) {
		var combo = function(dados, idonde) {
		    var n, i, ins;
		    n = dados.length;
		    ins = "<select class='form-control' id='" + idonde + "Combo' >";
		    ins += "<option value='' >---</option>";
		    for (i = 0; i < n; i++) {
			ins += "<option value='" + dados[i]["item"] + "' >" + dados[i]["item"] + "</option>";
		    }
		    ins += "</select>";
		    $i(idonde).innerHTML = ins;
		};
		combo(r.data.valores, "i3GEOFstorymapcabecalhoCol");
		combo(r.data.valores, "i3GEOFstorymaptextoCol");
		combo(r.data.valores, "i3GEOFstorymaplocal");
		combo(r.data.valores, "i3GEOFstorymapmedia");
		combo(r.data.valores, "i3GEOFstorymaplon");
		combo(r.data.valores, "i3GEOFstorymaplat");
		// se os parametros da ferramenta estiverem definidos na camada
		if (camada != "" && camada.ferramentas.storymap) {
		    $i("i3GEOFstorymapcabecalho").value = camada.ferramentas.storymap.cabecalho;
		    $i("i3GEOFstorymaptexto").value = camada.ferramentas.storymap.texto;
		    $i("i3GEOFstorymapcabecalhoColCombo").value = camada.ferramentas.storymap.colcabecalho;
		    $i("i3GEOFstorymaptextoColCombo").value = camada.ferramentas.storymap.coltexto;
		    $i("i3GEOFstorymaplocalCombo").value = camada.ferramentas.storymap.collocal;
		    $i("i3GEOFstorymapmediaCombo").value = camada.ferramentas.storymap.colmedia;
		    $i("i3GEOFstorymaplonCombo").value = camada.ferramentas.storymap.collon;
		    $i("i3GEOFstorymaplatCombo").value = camada.ferramentas.storymap.collat;
		}
	    };
	    i3GEO.php.listaItensTema(temp, i3GEOF.storymap._parameters.tema);
	},
	ativa : function(btn) {
	    var j;
	    j =
		'{"cabecalho":"' + $i("i3GEOFstorymapcabecalho").value
		+ '","texto":"'
		+ $i("i3GEOFstorymaptexto").value
		+ '","colcabecalho":"'
		+ $i("i3GEOFstorymapcabecalhoColCombo").value
		+ '","coltexto":"'
		+ $i("i3GEOFstorymaptextoColCombo").value
		+ '","collocal":"'
		+ $i("i3GEOFstorymaplocalCombo").value
		+ '","colmedia":"'
		+ $i("i3GEOFstorymapmediaCombo").value
		+ '","collon":"'
		+ $i("i3GEOFstorymaplonCombo").value
		+ '","collat":"'
		+ $i("i3GEOFstorymaplatCombo").value
		+ '"}';

	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": $i("i3GEOFstorymaptemas").value,
		    "g_sid": i3GEO.configura.sid,
		    "storymap": i3GEO.util.base64encode(j),
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
	removeParametros : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": $i("i3GEOFstorymaptemas").value,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "remove"
	    };
	    i3f.post({
		snackbar: true,
		btn: btn,
		par: par,
		refresh: true,
		prog: i3GEO.configura.locaplic + "/ferramentas/storymap/exec.php"
	    });
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
			    i3GEO.atualiza();
			    i3GEO.Interface.atualizaTema("", i3GEOF.storymap._parameters.tema);
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
