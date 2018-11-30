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
	    i3GEOF.linhadotempo.comboTemas();
	    i3GEOF.linhadotempo.parametrosAtuais();
	    i3f.t0();
	    if (i3GEO.login.verificaCookieLogin() === true && i3GEO.parametros.editor === "sim" ) {
		//$("#i3GEOFanimagift1").find(".hidden").removeClass("hidden");
	    }
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.linhadotempo.t1()","","i3GEOF.linhadotempo.t0","i3GEOlinhadotemporesultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.animagif.t0()","i3GEOF.animagif.t2()","","i3GEOFanimagift1","i3GEOanimagifresultado",true,"i3GEOToolFormModalFooter");
	},

	inicia: function(iddiv){
	    if(i3GEOF.linhadotempo.MUSTACHE == ""){
		$.get(i3GEO.configura.locaplic + "/ferramentas/linhadotempo/template_mst.html", function(template) {
		    i3GEOF.linhadotempo.MUSTACHE = template;
		    i3GEOF.linhadotempo.inicia(iddiv);
		});
		return;
	    }
	    var b,box;
	    if(iddiv){
		i3GEOF.linhadotempo.iddiv = iddiv;
	    }
	    try{
		$i(iddiv).innerHTML = i3GEOF.linhadotempo.html();
		b = new YAHOO.widget.Button(
			"i3GEOlinhadotempobotao1",
			{onclick:{fn: i3GEOF.linhadotempo.salva}}
		);
		b.addClass("rodar150");

		i3GEO.janela.tempoMsg($trad('msg',i3GEOF.linhadotempo.dicionario));
		i3GEOF.linhadotempo.parametrosAtuais();
	    }
	    catch(erro){i3GEO.janela.tempoMsg(erro);}
	},

	salva: function(){
	    if(i3GEOF.linhadotempo.aguarde.visibility === "visible"){
		return;
	    }
	    i3GEOF.linhadotempo.aguarde.visibility = "visible";
	    var temp,
	    p,
	    cp;
	    temp = function(){
		i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		//refresh iframe
		$i("i3GEOF.linhaDoTempoi").src = $i("i3GEOF.linhaDoTempoi").src.split("?")[0] + "?_=" + new Date().getTime();
	    };
	    p = i3GEO.configura.locaplic+"/ferramentas/linhadotempo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=salva&tema=" + i3GEOF.linhadotempo.tema
	    + "&ltempoformatodata=" + $i("i3GEOlinhadotempoltempoformatodata").value
	    + "&ltempoiteminicio=" + $i("i3GEOlinhadotempoltempoiteminicio").value
	    + "&ltempoitemfim=" + $i("i3GEOlinhadotempoltempoitemfim").value
	    + "&ltempoitemtitulo=" + $i("i3GEOlinhadotempoltempoitemtitulo").value
	    + "&ltempoitemdescricao=" + $i("i3GEOlinhadotempoltempoitemdescricao").value
	    + "&ltempoconvencode=" + $i("i3GEOlinhadotempoltempoconvencode").value
	    + "&ltempoitemtip=" + $i("i3GEOlinhadotempoltempoitemtip").value
	    + "&ltempoitemimagem=" + $i("i3GEOlinhadotempoltempoitemimagem").value
	    + "&ltempoitemicone=" + $i("i3GEOlinhadotempoltempoitemicone").value
	    + "&ltempoitemlink=" + $i("i3GEOlinhadotempoltempoitemlink").value;
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	},
	parametrosAtuais: function(){
	    i3GEOF.linhadotempo.aguarde.visibility = "visible";
	    var p = i3GEO.configura.locaplic+"/ferramentas/linhadotempo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=parametros&tema=" + i3GEOF.linhadotempo.tema,
	    cp = new cpaint(),
	    temp = function(retorno){
		try{
		    if(retorno.data !== ""){
			$i("i3GEOlinhadotempocolunas").innerHTML = retorno.data.colunas;
			$i("i3GEOlinhadotempoltempoformatodata").value = retorno.data.ltempoformatodata;
			$i("i3GEOlinhadotempoltempoiteminicio").value = retorno.data.ltempoiteminicio;
			$i("i3GEOlinhadotempoltempoitemfim").value = retorno.data.ltempoitemfim;
			$i("i3GEOlinhadotempoltempoitemtitulo").value = retorno.data.ltempoitemtitulo;
			$i("i3GEOlinhadotempoltempoitemdescricao").value = retorno.data.ltempoitemdescricao;
			$i("i3GEOlinhadotempoltempoconvencode").value = retorno.data.ltempoconvencode;
			$i("i3GEOlinhadotempoltempoitemtip").value = retorno.data.ltempoitemtip;
			$i("i3GEOlinhadotempoltempoitemimagem").value = retorno.data.ltempoitemimagem;
			$i("i3GEOlinhadotempoltempoitemicone").value = retorno.data.ltempoitemicone;
			$i("i3GEOlinhadotempoltempoitemlink").value = retorno.data.ltempoitemlink;
		    }
		    i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		}catch(e){
		    i3GEO.janela.tempoMsg("Erro. "+e);
		    i3GEOF.linhadotempo.aguarde.visibility = "hidden";
		}
	    };
	    cp.set_response_type("JSON");
	    cp.call(p,"foo",temp);
	}
};