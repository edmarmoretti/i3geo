if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.animacao = {
	renderFunction: i3GEO.janela.formModal,
	_parameters : {
	    "mustache": "",
	    "idContainer": "i3GEOanimacaoguiasContainer",
	    "namespace": "animacao",
	    "idlista": "i3GEOanimacaoguiasContainerLista",
	    "codigos": [],
	    "atual": 1000
	},
	start: function(){
	    var i3f = this,
	    p = i3f._parameters,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/" + p.namespace + "/template_mst.html";
	    if(p.mustache === ""){
		$.get(t1, function(template) {
		    p.mustache = template;
		    i3f.html();
		}).fail(function() {
		    i3GEO.janela.tempoMsg($trad("erroTpl"));
		});
	    } else {
		i3f.html();
	    }
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = i3GEO.idioma.objetoIdioma(i3GEOF[p.namespace].dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["namespace"] = p.namespace;
	    hash["idContainer"] = p.idContainer;
	    hash["idlista"] = p.idlista;
	    i3f.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	    i3GEOF.animacao.listaDeCamadas();
	},
	listaDeCamadas: function(){
	    var p = this._parameters,
	    camadas = i3GEO.arvoreDeCamadas.CAMADAS,
	    n = camadas.length,
	    ins = "",
	    hash = [];
	    while(n > 0){
		n -= 1;
		if(camadas[n].tema !== ""){
		    hash.push({
			"title": "",
			"checked": "checked",
			"value": camadas[n].name,
			"id": "i3GEOanima" + camadas[n].name,
			"label": camadas[n].tema
		    });

		    ins += '<div class="checkbox text-left"><label>';
		    ins += '	<input checked id="" type="checkbox" value="'+camadas[n].name+'">';
		    ins += '	<span class="checkbox-material noprint"><span class="check" id="i3GEOanima' + camadas[n].name + '"></span></span> ' + camadas[n].tema;
		    ins += '</label></div>';
		}
	    }
	    ins = Mustache.render("{{#data}}" + i3GEO.template.checkbox + "{{/data}}", {data: hash});
	    $i(p.idlista).innerHTML = ins;
	    i3GEO.janela.snackBar({content: $trad("ajuda",i3GEOF[p.namespace].dicionario)});
	},
	dispara: function(){
	    var codigos = i3GEOF.animacao.obtemTemasAnima();
	    this._parameters.codigos = codigos;
	    i3GEOF.animacao.contador = 0;
	    i3GEOF.animacao.desligaTodos(codigos);
	    i3GEOF.animacao.anima(codigos.length);
	},
	maisrapido: function(){
	    i3GEOF.animacao._parameters.tempo -= 100;
	},
	maislento: function(){
	    i3GEOF.animacao._parameters.tempo += 100;
	},
	anima: function(c){
	    if(this._parameters.codigos.length === 0)
	    {return;}
	    $( "#" + this._parameters.idlista ).toggle(false);
	    if(c < 0){
		i3GEOF.animacao.termina();
		i3GEOF.animacao.dispara();
	    }
	    else{
		i3GEOF.animacao.ligaDesliga(this._parameters.codigos[c],'troca');
		setTimeout("i3GEOF.animacao.anima("+(c - 1)+");",i3GEOF.animacao._parameters.tempo);
	    }
	},
	desligaTodos: function(codigos){
	    var n = codigos.length;
	    while(n >= 0){
		n -= 1;
		if(codigos[n]){
		    i3GEOF.animacao.ligaDesliga(codigos[n],"desliga");
		}
	    }
	},
	ligaDesliga: function(codigoTema,tipo){
	    if(codigoTema == undefined){
		return;
	    }
	    var layer,estilo;
	    switch(i3GEO.Interface.ATUAL){
	    case "openlayers":
		layer = i3geoOL.getLayersByName(codigoTema)[0];
		if(tipo === "troca"){
		    layer.setVisibility(!layer.getVisibility());
		}
		if(tipo === "liga")
		{layer.setVisibility(true);}
		if(tipo === "desliga")
		{layer.setVisibility(false);}
		break;
	    case "googlemaps":
		layer = i3GEO.Interface.googlemaps.retornaDivLayer(codigoTema);
		if(!layer){return;}
		estilo = layer.style.visibility;
		if(tipo === "troca"){
		    if(estilo === "visible" || estilo === "")
		    {layer.style.visibility = "hidden";}
		    else
		    {layer.style.visibility = "visible";}
		}
		if(tipo === "liga")
		{layer.style.visibility = "visible";}
		if(tipo === "desliga")
		{layer.style.visibility = "hidden";}
		break;
	    };
	},
	termina: function(){
	    this._parameters.codigos = [];
	    i3GEOF.animacao.retornaStatusInicial();
	    $( "#" + this._parameters.idlista ).toggle(true);
	},
	obtemTemasAnima: function(){
	    var l = $i(this._parameters.idlista);
	    if(!l){
		this.termina();
		return;
	    }
	    var temp = [],
	    cs = l.getElementsByTagName("input"),
	    n = cs.length;
	    while(n >= 0){
		n -= 1;
		if(cs[n] && cs[n].checked === true){
		    temp.push(cs[n].value);
		}
	    }
	    return temp;
	},
	retornaStatusInicial: function(){
	    if($i(this._parameters.idlista)){
		var temas = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"igual",i3GEO.arvoreDeCamadas.CAMADAS),
		n = temas.length;
		while(n > 0){
		    n -= 1;
		    i3GEOF.animacao.ligaDesliga(temas[n].name,"liga");
		}
		temas = i3GEO.arvoreDeCamadas.filtraCamadas("status",2,"diferente",i3GEO.arvoreDeCamadas.CAMADAS);
		n = temas.length;
		while(n >= 0){
		    n -= 1;
		    if(temas[n]){
			i3GEOF.animacao.ligaDesliga(temas[n].name,"desliga");
		    }
		}
	    }
	}
};
