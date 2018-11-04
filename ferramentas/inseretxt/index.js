if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.inseretxt = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOinseretxtContainer",
	    "namespace": "inseretxt",
	    "_parameters.contaPontos": 0,
	    "pontoi": "0,0",
	    "contaPontos": 0
	},
	start : function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
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
	    i3GEO.eventos.cliquePerm.ativa();
	    i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.inseretxt.startAdd('xx yy')"]);
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    sim: $trad("x14"),
		    nao: $trad("x15"),
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

	    i3GEO.eventos.cliquePerm.desativa();
	    i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.inseretxt.startAdd('xx yy')"]);
	    i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");
	    //eventos das guias
	    $i("i3GEOinseretxtguia1").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");
	    };
	    $i("i3GEOinseretxtguia2").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia2","i3GEOinseretxtguia");
	    }
	    i3GEO.util.comboTemas(
		    "i3GEOinseretxtComboTemas",
		    function(retorno){
			$i("i3GEOinseretxtDivComboTemas").innerHTML = retorno.dados;
			$i("i3GEOinseretxtDivComboTemas").style.display = "block";
			if ($i("i3GEOinseretxtComboTemas")){
			    $i("i3GEOinseretxtComboTemas").onchange = function(){
				//combodeitens
				i3GEO.util.comboItens(
					"i3GEOinseretxtComboItens",
					$i("i3GEOinseretxtComboTemas").value,
					function(retorno){
					    $i("i3GEOinseretxtDivComboItens").innerHTML = retorno.dados;
					},
					"i3GEOinseretxtComboItens",
					"",
					"",
					"",
					"form-control"
				);
			    };
			}
		    },
		    "i3GEOinseretxtDivComboTemas",
		    "",
		    false,
		    "ligados",
		    "",
		    false,
		    true,
		    "form-control"
	    );
	    $i("i3GEOinseretxtguia3").onclick = function(){
		i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia3","i3GEOinseretxtguia");
	    };
	    i3GEO.util.comboFontes("fonte","i3GEOinseretxtDivListaFonte","form-control");
	    i3GEO.util.aplicaAquarela(p.idContainer);
	},
	get: function({snackbar = true, btn = false, par = {}, refresh = false, fn = false} = {}){
	    var p = this._parameters,
	    i3f = this;
	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
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
			if(refresh){
			    i3GEO.atualiza();			}
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
		    ...i3GEO.util.getFormData("#i3GEOinseretxtguia3obj form")
	    };
	    if(data.fundo === ""){
		data.fundo = "off";
	    }
	    if(data.sombra === ""){
		data.sombra = "off";
	    }
	    if(data.outlinecolor === ""){
		data.outlinecolor = "off";
	    }
	    if(data.cor === ""){
		data.cor = "off";
	    }
	    if(data.minscale === ""){
		data.minscale = "0";
	    }
	    if(data.maxscale === ""){
		data.maxscale = "0";
	    }
	    if($i("i3GEOinseretxtComboItens")){
		data.item = $i("i3GEOinseretxtComboItens").value;
	    } else {
		data.item = "";
	    }
	    return data;
	},
	startAdd: function(xy){
	    if($i("i3GEOinseretxtguia1obj").style.display === "block"){
		var texto = $i("i3GEOinseretxttexto").value;
		if(texto === ""){
		    return;
		}
		i3GEOF.inseretxt.add(xy,texto);
	    } else {
		i3GEO.php.identificaunico(
			function(retorno){
			    $i("i3GEOinseretxttexto").value = retorno.data;
			    i3GEOF.inseretxt.add(xy,retorno.data[0]);
			},
			xy.replace(" ",","),
			$i("i3GEOinseretxtComboTemas").value,
			$i("i3GEOinseretxtComboItens").value
		);
	    }
	},
	add: function(xy,texto){
	    if($i("i3GEOinseretxttextoconector").checked){
		if(i3GEOF.inseretxt._parameters.contaPontos == 0){
		    i3GEOF.inseretxt._parameters.contaPontos = 1;
		    i3GEOF.inseretxt._parameters.pontoi = xy;
		    i3GEO.janela.tempoMsg($trad('clicaFimConcetor',i3GEOF.inseretxt.dicionario));
		}
		else {
		    var texto = $i("i3GEOinseretxttexto").value;
		    i3GEOF.inseretxt.addTextConector(i3GEOF.inseretxt._parameters.pontoi,xy,texto);
		    i3GEOF.inseretxt._parameters.contaPontos = 0;
		}
	    }
	    else{
		i3GEOF.inseretxt.addText(xy,texto);
	    }
	},
	addTextConector: function(xy1,xy2,texto){
	    var par = i3GEOF.inseretxt.getFormData();
	    par.funcao = "insereconector";
	    par.pin = texto + " - " + i3GEO.util.generateId();
	    par.texto = texto;
	    par.xy1 = xy1;
	    par.xy2 = xy2;
	    i3GEOF.inseretxt.get({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.atualiza();
		},
		btn: false,
		par,
		refresh: false
	    });
	},
	addText: function(xy,texto){
	    var par = i3GEOF.inseretxt.getFormData();
	    par.funcao = "inserefeature";
	    par.pin = texto + " - " + i3GEO.util.generateId();
	    par.texto = texto;
	    par.xy = xy;
	    i3GEOF.inseretxt.get({
		snackbar: false,
		fn: function(retorno){
		    i3GEO.atualiza();
		},
		btn: false,
		par,
		refresh: false
	    });
	}
};