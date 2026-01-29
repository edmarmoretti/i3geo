if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.locregiao = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOlocregiaoContainer",
	    "namespace": "locregiao",
	    "ULTIMO_CODIGO_TIPO_REGIAO": "",
	    "ULTIMO_CODIGO_REGIAO": "",
	    "PENULTIMO_CODIGO_TIPO_REGIAO": "",
	    "PENULTIMO_CODIGO_REGIAO": "",
	    "ATIVAFILTRO": false,
	    "FATORZOOM": 0.05,
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
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    i3f.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));

	    if(p.ATIVAFILTRO === true){
		$i("i3geoLocregiaoBotoesFiltro").style.display = "block";
	    }
	},

	/**
	 * Abre a ferramenta com a opcao de filtro ativada
	 * Com o filtro ativado, apenas a regiao escolhida e mostrada no mapa
	 * Executa i3GEOF.locregiao.comboHierarquiaRegioes
	 */
	abreComFiltro: function(){
	    var p = i3GEOF.locregiao._parameters;
	    p.ATIVAFILTRO = true;
	    var divbotoes = $i("i3geoLocregiaoBotoesFiltro");
	    i3GEOF.locregiao.start();
	    /*
	    if(!divbotoes){
		i3GEOF.locregiao.start();
	    }
	    else{
		divbotoes.style.display = "block";
		$i("i3geoLocregiaoTipoRegiao").innerHTML = "";
		p.ULTIMO_CODIGO_REGIAO = "";
		p.ULTIMO_CODIGO_TIPO_REGIAO = "";
		i3GEOF.locregiao.comboHierarquiaRegioes($i("i3geoLocregiaoTipoRegiao"));
	    }
	    */
	},

	/**
	 * Altera a extensao geografica do mapa para enquadrar uma regiao
	 * @param string contendo a extensao geografica. Essa string e composta, sendo necessario converter em array e obter o segundo valor
	 */
	zoom: function(valorregiaopai){
	    var temp = valorregiaopai.split(";"),
	    retorno = temp[0],
	    f = i3GEOF.locregiao._parameters.FATORZOOM;
	    if(temp.length > 1 && temp[1] != ""){
		temp = temp[1].split(" ");
		temp[0] = temp[0]*1 - f;
		temp[1] = temp[1]*1 - f;
		temp[2] = temp[2]*1 + f;
		temp[3] = temp[3]*1 + f;
		i3GEO.navega.zoomExt("","","",temp.join(" "));
	    }
	    return retorno;
	},
	/**
	 * Executado quando o usuario escolhe uma regiao
	 * Atualiza as variaveis que guardam as selecoes anteriores
	 * Aplica o zoom se for necessario
	 * Executa i3GEOF.locregiao.comboHierarquiaRegioes que ira montar a lista de regioes ou tipos de regioes de nivel inferior
	 * @param objeto DOM do combo de selecao de regioes
	 * @param codigo do tipo de regiao que e pai da atualmente selecionada
	 * @param codigo do tipo de regiao selecionada
	 * @param codigo da regiao pai da regiao selecionada
	 */
	comboHierarquiaRegioesOnChange: function(combo,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
	    var onde = combo.parentNode.parentNode.parentNode.getElementsByTagName("div")[2];
	    var p = i3GEOF.locregiao._parameters;
	    p.PENULTIMO_CODIGO_REGIAO = p.ULTIMO_CODIGO_REGIAO;
	    p.PENULTIMO_CODIGO_TIPO_REGIAO = p.ULTIMO_CODIGO_TIPO_REGIAO;
	    if(valorregiaopai){
		p.ULTIMO_CODIGO_REGIAO = valorregiaopai.split(";")[0];
	    }
	    else{
		p.ULTIMO_CODIGO_REGIAO = "";
	    }
	    if(codigoregiaopai){
		p.ULTIMO_CODIGO_TIPO_REGIAO = codigoregiaopai;
	    }
	    else{
		p.ULTIMO_CODIGO_TIPO_REGIAO = "";
	    }
	    if(combo.value == ""){
		onde.innerHTML = "";
		return;
	    }
	    if(!codigo_tipo_regiao){
		codigo_tipo_regiao = combo.value;
	    }
	    if(valorregiaopai && $i("i3geoLocregiaoNavegaAutoCk").checked === true){
		valorregiaopai = i3GEOF.locregiao.zoom(valorregiaopai);
	    }
	    i3GEOF.locregiao.comboHierarquiaRegioes(onde,codigoregiaopai,codigo_tipo_regiao,valorregiaopai);
	},
	/**
	 * Monta o combo de regioes para escolha do usuario
	 * A funcao onchange podera reexecutar essa funcao para montar o combo de hierarquia inferior
	 * @param objeto DOM onde o combo sera inserido
	 * @param codigo do tipo da regiao pai da atual
	 * @param codigo do tipo de regiao atual
	 * @param codigo da regiao pai
	 */
	comboHierarquiaRegioes: function(objonde,codigoregiaopai,codigo_tipo_regiao,valorregiaopai){
	    var temp = function(dados){
		var onc= "",
		ins = '',
		i,n,icone;
		if(i3GEOF.locregiao._parameters.ATIVAFILTRO === true){
		    icone = Mustache.render(i3GEO.template.botoes.listaDeIcones, {
			title: "Aplica filtro",
			onclick: "i3GEOF.locregiao.aplicaFiltro(this.parentNode.firstChild.firstChild.value,'" + dados.regiaopai + "')",
			icone: "filter_list"
		    });
		}
		else{
		    icone = Mustache.render(i3GEO.template.botoes.listaDeIcones, {
			title: "Zoom para...",
			onclick: "i3GEOF.locregiao.zoom(this.parentNode.firstChild.firstChild.value)",
			icone: "search"
		    });
		}
		if(dados.valores == ""){
		    n = dados.regioes.length;
		    onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,this.value)';
		    ins += "<div style='width: 100%;' class='form-group label-fixed condensed'>";
		    ins += "<div style='width: 100%;display:flex;' class='input-group'><select class='form-control' onchange=\'"+onc+"\'><option value=''>Tipo</option>";
		    for(i=0;i<n;i++){
			ins += "<option value='"+dados.regioes[i].codigo_tipo_regiao+"'>"+dados.regioes[i].nome_tipo_regiao+"</option>";
		    }
		    ins += "</select></div></div>";
		    ins += "<div class='form-inline'></div>";

		}
		else{
		    n = dados.valores.length;
		    if(dados.regioes.length > 0){
			onc = 'i3GEOF.locregiao.comboHierarquiaRegioesOnChange(this,'+dados.regiaopai+','+dados.regioes[0].codigo_tipo_regiao+',this.value)';
		    }
		    else{
			onc = 'i3GEOF.locregiao.zoom(this.value)';
		    }
		    ins += "<div style='width: 80%;' class='form-group label-fixed condensed'>";
		    ins += "<div style='width: 100%;display:flex;' class='input-group'><select class='form-control' onchange=\'"+onc+"\'><option value=''>---</option>";
		    for(i=0;i<n;i++){
			ins += "<option value='"+dados.valores[i].identificador_regiao+";"+dados.valores[i].ext+"'>"+dados.valores[i].nome_regiao+"</option>";
		    }
		    ins += "</select>" + icone + "</div></div>";
		    ins += "<div class='form-inline'></div>";
		}
		if(objonde){
		    objonde.innerHTML = ins;
		}
		return ins;
	    };
	    i3GEO.catalogoRegioes.getRegionsTree(temp,codigo_tipo_regiao,codigoregiaopai,valorregiaopai);
	}
};