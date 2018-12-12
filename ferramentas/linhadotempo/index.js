if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.linhadotempo = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "idContainer": "i3GEOlinhadotempoContainer",
	    "namespace": "linhadotempo"
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
	    i3GEOF.linhadotempo.comboTemas();
	    //
	    i3f.t0();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.linhadotempo.t1()","","i3GEOF.linhadotempo.t0","i3GEOlinhadotemporesultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.linhadotempo.t0()","i3GEOF.linhadotempo.t2()","","i3GEOFlinhadotempot1","i3GEOlinhadotemporesultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.linhadotempo.t1()","i3GEOF.linhadotempo.t3()","","i3GEOFlinhadotempot2","i3GEOlinhadotemporesultado",true,"i3GEOToolFormModalFooter");
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.linhadotempo.t2()","","","i3GEOFlinhadotempot3","i3GEOlinhadotemporesultado",true,"i3GEOToolFormModalFooter");
	},
	ativa: function(){
	    var i3f = i3GEOF.linhadotempo,
	    url = i3GEO.configura.locaplic + "/ferramentas/linhadotempo/index.php",
	    ins = '<iframe src="' + url + '" valign="top" style="border:0px white solid;width:100%;height: calc(100% + 1px)"></iframe>';

	    i3f.renderFunction.call(
		    this,
		    {
			texto: ins,
			onclose: i3f.destroy,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });
	},
	comboTemas: function(){
	    i3GEO.util.comboTemas(
		    "i3GEOFlinhadotempotemas",
		    function(retorno){
			$i("i3GEOFlinhadotempoSelTemas").innerHTML = retorno.dados;
			$i("i3GEOFlinhadotempotemas").value = i3GEOF.linhadotempo._parameters.tema;
			$i("i3GEOFlinhadotempotemas").onchange = function(){
			    if(this.value != undefined){
				i3GEOF.linhadotempo._parameters.tema = this.value;
			    }
			    if(this.value != ""){
				i3GEOF.linhadotempo.comboItens();
			    }
			};
			//caso os parametros estiverem definidos na camada
			//preenche o formulario
			if(i3GEOF.linhadotempo._parameters.tema !== ""){
			    $i("i3GEOFlinhadotempotemas").onchange.call();
			}
		    },
		    "i3GEOFlinhadotempoSelTemas",
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
	    var temp = function(r) {
		var opt = "";
		for (const d of r.data.valores) {
		    opt += "<option value='" + d["item"] + "' >" + d["item"] + "</option>";
		}
		var combo = function(dados, idonde, name) {
		    var ins = "<select class='form-control' name='" + name + "' >";
		    ins += "<option value='' >---</option>";
		    ins += opt;
		    ins += "</select><b class='caret careti'></b>";
		    $i(idonde).innerHTML = ins;
		};
		combo(r.data.valores, "i3GEOlinhadotempoltempoiteminicio","ltempoiteminicio");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemfim","ltempoitemfim");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemtitulo","ltempoitemtitulo");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemdescricao","ltempoitemdescricao");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemtip","ltempoitemtip");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemimagem","ltempoitemimagem");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemicone","ltempoitemicone");
		combo(r.data.valores, "i3GEOlinhadotempoltempoitemlink","ltempoitemlink");
		i3GEOF.linhadotempo.parametrosAtuais();
	    };
	    i3GEO.php.listaItensTema(temp, i3GEOF.linhadotempo._parameters.tema);
	},
	parametrosAtuais: function(){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": i3GEOF.linhadotempo._parameters.tema,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "parametros"
	    };
	    i3f.post({
		snackbar: false,
		btn: false,
		par: par,
		refresh: false,
		fn: function(data){
		    i3GEO.util.setFormData("#i3GEOFlinhadotempot2",data);
		},
		prog: i3GEO.configura.locaplic + "/ferramentas/linhadotempo/exec.php"
	    });
	},
	removeParametros: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": i3GEOF.linhadotempo._parameters.tema,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "remove"
	    };
	    i3f.post({
		snackbar: true,
		btn: true,
		par: par,
		refresh: false,
		prog: i3GEO.configura.locaplic + "/ferramentas/linhadotempo/exec.php"
	    });
	},
	salvaparametros: function(btn){
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "tema": i3GEOF.linhadotempo._parameters.tema,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "salva",
		    ...i3GEO.util.getFormData("#i3GEOFlinhadotempot2")
	    };
	    i3f.post({
		snackbar: true,
		btn: true,
		par: par,
		refresh: false,
		prog: i3GEO.configura.locaplic + "/ferramentas/linhadotempo/exec.php"
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.linhadotempo._parameters.tema);
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