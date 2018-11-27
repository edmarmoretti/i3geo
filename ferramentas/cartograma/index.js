i3GEOF.cartograma = {
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "mustache": "",
	    "idContainer": "i3GEOcartogramaContainer",
	    "namespace": "cartograma",
	    "ID_MEDIDA_VARIAVEL": "",
	    "CODIGO_VARIAVEL":"",
	    "tipoRep": ["",""],
	    "tipoClassificacao": ["",""],
	    "tipoRegiao": ["",""],
	    "DADOSMEDIDASVARIAVEL": "",
	    "dados":"",
	    "MULTIPARAMETROS": true
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
		    ID_MEDIDA_VARIAVEL: p.ID_MEDIDA_VARIAVEL,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash)
		    }
	    );
	    i3f.opcoesVariaveis();
	},
	opcoesVariaveis: function(){
	    console.log("opcoesVariaveis");
	    var p = this._parameters,
	    i3f = this,
	    temp = function(dados){
		var ins = '';
		//botao para obter mais info
		ins = i3GEOF.cartograma.comboVariaveis(
			dados,
			"i3geoCartoComboVariavel",
			"i3GEOF.cartograma.comboVariaveisOnchange(this)"
		);
		$i("i3geoCartoVariaveis").innerHTML = ins;
		i3GEO.janela.fechaAguarde();
		return ins;
	    };
	    i3GEO.janela.abreAguarde();
	    i3GEO.php.listaVariavel(temp);
	},
	comboVariaveis: function(dados,idcombo,stronchange){
	    console.log("comboVariaveis");
	    var ins,i,n = dados.length,selecionado = "";
	    ins = "<div style='width: 100%;' class='input-group'>"
		+ "<select class='form-control' id='"+idcombo+"' onchange='"+stronchange+"'><option value=''>---</option>";
	    for(i=0;i<n;i++){
		if(dados[i].codigo_variavel === i3GEOF.cartograma._parameters.CODIGO_VARIAVEL){
		    selecionado = "SELECTED";
		}
		else{
		    selecionado = "";
		}
		ins += "<option "+selecionado+" title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
	    }
	    ins += "</select><b class='caret careti'></b></div>";
	    return ins;
	},
	comboVariaveisOnchange: function(combo){
	    var p = i3GEOF.cartograma._parameters;
	    p.CODIGO_VARIAVEL = combo.value;
	    p.ID_MEDIDA_VARIAVEL = "";
	    if(combo.value != ""){
		i3GEOF.cartograma.opcoesMedidasVariavel(combo.value);
	    }
	    else{
		$i("i3geoCartoMedidasVariavel").innerHTML = "";
	    }
	    $i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
	    i3GEOF.cartograma.zeraParametros();
	},
	zeraParametros: function(){
	    var p = i3GEOF.cartograma._parameters;
	    p.tipoRep = ["",""];
	    p.tipoClassificacao = ["",""];
	    p.tipoRegiao = ["",""];
	},
	opcoesMedidasVariavel: function(codigo_variavel){
	    console.log("opcoesMedidasVariavel");
	    var onde = $i("i3geoCartoMedidasVariavel"),
	    temp = function(dados){
		var ins = '<h3>'+$trad('selecionaMedidaVariavel',i3GEOF.cartograma.dicionario)+'</h3>';
		ins += i3GEOF.cartograma.comboMedidasVariavel(dados,"i3geoCartoComboMedidasVariavel","i3GEOF.cartograma.comboMedidaVariavelOnchange(this)");
		if(onde){
		    onde.innerHTML = ins;
		}
		i3GEO.janela.fechaAguarde();
		return ins;
	    };
	    i3GEO.janela.abreAguarde();
	    i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
	},
	comboMedidasVariavel: function(dados,idcombo,stronchange,filtroesquema){
	    console.log("comboMedidasVariavel");
	    var p = i3GEOF.cartograma._parameters;
	    p.DADOSMEDIDASVARIAVEL = dados;
	    var n = dados.length,
	    selecionado = "",
	    ins = '',
	    i;
	    ins += "<div style='width: 100%;' class='input-group'>"
		+ "<select class='form-control' id='"+idcombo+"' onchange='"+stronchange+"'><option value=''>---</option>";
	    for(i=0;i<n;i++){
		if(!filtroesquema || (filtroesquema != "" && dados[i].esquemadb != filtroesquema)){
		    if(p.ID_MEDIDA_VARIAVEL === dados[i].id_medida_variavel){
			selecionado = "selected";
		    }
		    else{
			selecionado = "";
		    }
		    ins += "<option "+selecionado+" value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
		}
	    }
	    ins += "</select><b class='caret careti'></b></div>";
	    return ins;
	},
	comboMedidaVariavelOnchange: function(combo){
	    console.log("comboMedidaVariavelOnchange");
	    i3GEOF.cartograma._parameters.ID_MEDIDA_VARIAVEL = combo.value;
	    $i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
	    if(combo.value != ""){
		i3GEOF.cartograma.parametros.lista(combo.value);
	    }
	    i3GEOF.cartograma.zeraParametros();
	},
	parametros: {
	    /**
	     * Guarda a lista de parametros que foram obtidos na inicializacao
	     */
	    dados: [],
	    /**
	     * Obtem a lista com os parametros da medida
	     * Cria os combos para os parametros que sao pai de todos
	     * Executa i3GEO.php.listaParametrosMedidaVariavel()
	     */
	    lista: function(id_medida_variavel){
		console.log("lista");
		var temp = function(dados){
		    i3GEOF.cartograma.parametros.dados = dados;
		    i3GEOF.cartograma.parametros.combos("0");
		};
		i3GEO.php.listaParametrosMedidaVariavel(id_medida_variavel,temp);
	    },
	    /**
	     * Cria os elementos que receberao so combos para escolher os valores de um parametro
	     * Para criar os combos, executa i3GEOF.metaestat.parametros.valoresCombo()
	     * O combo e inserido no elemento com ID i3geoCartoParametrosMedidasVariavel
	     * Cada combo recebe um ID cujo valor e definido em funcao do id do parametro e do nivel na hierarquia
	     * O combo e inserido dentro de um div ja existente ou e criado um novo se o nivel for 0
	     * @param nivel do parametro na hierarquia, sendo 0 para o pai de todos
	     */
	    combos: function(nivel){
		console.log("combos");
		var dados = i3GEOF.cartograma.parametros.dados,
		n = dados.length,
		onde = $i("i3geoCartoParametrosMedidasVariavel"),
		idpar,idcombo,i,novoel,teste;
		if(n === 0){
		    i3GEOF.cartograma.adicionaCamada();
		}
		//cria o combo para o parametro cujo id_pai for do nivel escolhido
		for(i=0;i<n;i++){
		    if(dados[i].id_pai == nivel){
			idpar = "parametro_"+dados[i].id_parametro_medida;
			idcombo = "parametro_"+dados[i].id_parametro_medida+"_"+nivel;
			teste = i3GEOF.cartograma.parametros.retornaIdPai(dados[i].id_parametro_medida);
			if(teste != false){
			    idpar = "parametro_"+teste;
			}
			if(!$i(idpar)){
			    novoel = document.createElement("div");
			    novoel.id = idpar;
			    novoel.className = "paragrafo";
			    onde.appendChild(novoel);
			}
			onde = $i(idpar);
			if(!$i(idcombo)){

			    novoel = document.createElement("div");
			    novoel.id = idcombo;
			    novoel.className = "paragrafo";
			    onde.appendChild(novoel);
			    i3GEOF.cartograma.parametros.valoresCombo(dados[i].id_parametro_medida,dados[i].nome,nivel,onde,idcombo);
			}
		    }
		}
	    },
	    /**
	     * Cria um combo com os valores de um determinado parametro
	     * Executa i3GEO.php.listaValoresParametroMedidaVariavel() para obter os dados
	     * @param id da medida da variavel
	     * @param titulo do combo
	     * @param nivel na hierarquia de parametros
	     * @param onde o combo sera inserido
	     * @param id que o combo recebera
	     */
	    valoresCombo: function(id_parametro_medida,titulo,nivel,onde,idcombo){

		var temp = function(dados){
		    var n = dados.length,
		    ins = "",
		    oc = "'i3GEOF.cartograma.parametros.antesCombo();i3GEOF.cartograma.parametros.combos(\""+id_parametro_medida+"\")'",
		    filho = i3GEOF.cartograma.parametros.retornaIdFilho(id_parametro_medida),
		    i,novoel;
		    if(filho === false && i3GEOF.cartograma._parameters.MULTIPARAMETROS === false){
			oc = "i3GEOF.cartograma.comum.adicionaCamada()";
		    }
		    ins = "<br><p class=paragrafo >"+titulo+"</p>";
		    if(i3GEOF.cartograma._parameters.MULTIPARAMETROS === false){
			ins += "<select id='combo"+idcombo+"' style='background:beige;' onchange="+oc+" ><option value=''>---</option>";
			for(i=0;i<n;i++){
			    ins += "<option value='"+dados[i]+"'>"+dados[i]+"</option>";
			}
			ins += "</select>";
		    }
		    else{
			ins += i3GEO.util.checkCombo(
				"combo"+idcombo,
				dados,
				dados,
				"",  // "overflow:auto;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px;height:150px;border:1px solid gray;background-color:white",
				oc
			);
		    }
		    novoel = document.createElement("div");
		    novoel.className = "paragrafo";
		    novoel.innerHTML = ins;

		    onde.appendChild(novoel);
		};
		i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
	    },
	    antesCombo: function(){

	    },
	    /**
	     * Retorna o id do parametro que e filho de um outro parametro
	     * Varre a variavel i3GEOF.cartograma.parametros.dados para pegar o filho
	     * @param id pai
	     * @return id do parametro ou false
	     */
	    retornaIdFilho:function(pai){
		var dados = i3GEOF.cartograma.parametros.dados,
		n = dados.length,
		i;
		for(i=0;i<n;i++){
		    if(dados[i].id_pai == pai){
			return dados[i].id_parametro_medida;
		    }
		}
		return false;
	    },
	    /**
	     * Retorna o id do parametro que e pai de um outro parametro
	     * Varre a variavel i3GEOF.cartograma.parametros.dados para pegar o pai
	     * @param id filho
	     * @return id do parametro ou false
	     */
	    retornaIdPai:function(filho){
		var dados = i3GEOF.cartograma.parametros.dados,
		n = dados.length,
		i;
		for(i=0;i<n;i++){
		    if(dados[i].id_parametro_medida == filho){
			return dados[i].id_pai;
		    }
		}
		return false;
	    }
	},
	adicionaCamada: function(botao){
	    if(botao){
		$(botao).prop("disabled",true);
	    }
	    var v = i3GEOF.cartograma.verificaParametros(),
	    temp = function(retorno){
		if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
		    var atualiza = function(){
			i3GEO.atualiza();
			if(botao){
			    $(botao).removeAttr('disabled');
			}
		    };
		    i3GEO.php.adtema(atualiza,retorno.mapfile);
		}
	    };
	    if(v != true){
		i3GEO.janela.tempoMsg("erro: "+v);
		return;
	    }
	    i3GEO.php.mapfileMedidaVariavel(
		    temp,
		    $i("i3geoCartoComboMedidasVariavel").value,
		    i3GEOF.cartograma.defineFiltro(),
		    0,
		    i3GEOF.cartograma._parameters.tipoRep[0],
		    i3GEOF.cartograma.defineTitulo(),
		    i3GEOF.cartograma._parameters.tipoClassificacao[0],
		    i3GEOF.cartograma.defineAgruparPor(),
		    i3GEOF.cartograma._parameters.tipoRegiao[0],
		    ""
	    );
	},
        defineAgruparPor: function(){
            //se nao tiver parametros, filtro e vazio
            if(i3GEOF.cartograma.parametros.dados.length == 0){
                return "";
            }
            //se tiver parametro e todos estiverem vazios, aborta
            var i,n,c,
            t=[],
            dados = i3GEOF.cartograma.parametros.dados;
            n = dados.length;
            for(i=0;i<n;i++){
                c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
                if(c && c.value != ""){
                    t.push(dados[i].coluna);
                }
            }
            if(t.length > 0){
                return t.join(",");
            }
            else{
                return "";
            }
        },
        defineTitulo: function(){
            if(i3GEOF.cartograma.parametros.dados.length == 0){
                return "";
            }
            //deixa vazio para que o titulo seja definido pelo PHP que monta o mapfile
            if(i3GEOF.cartograma._parameters.tipoRep[0] == ""){
                return "";
            }
            var i,n,c,titulo="",
            t=[],
            dados = i3GEOF.metaestat.parametros.dados;
            if($i("i3geoCartoComboVariavel") && $i("i3geoCartoComboVariavel").options){
                titulo = $i("i3geoCartoComboVariavel").options[$i("i3geoCartoComboVariavel").selectedIndex].label +" - ";
            } else {
                titulo = i3GEOF.metaestat.parametros.dados[0].nomemedida;
            }
            if($i("i3geoCartoComboRegioesMedidasVariavel")){
                t.push($i("i3geoCartoComboRegioesMedidasVariavel").options[$i("i3geoCartoComboRegioesMedidasVariavel").selectedIndex].label);
            } else {
                t.push(i3GEOF.cartograma._parameters.tipoRegiao[1]);
            }
            if($i("i3geoCartoComboTipoClassificacao")){
                t.push($i("i3geoCartoComboTipoClassificacao").options[$i("i3geoCartoComboTipoClassificacao").selectedIndex].label);
            } else {
                t.push(i3GEOF.cartograma._parameters.tipoClassificacao[1]);
            }
            if(i3GEOF.cartograma._parameters.tipoRep && i3GEOF.cartograma._parameters.tipoRep[1] != ""){
                t.push(i3GEOF.cartograma._parameters.tipoRep[1]);
            }
            dados = $i("i3geoCartoParametrosMedidasVariavel").getElementsByTagName("input");
            n = dados.length;
            for(i=0;i<n;i++){
                if(dados[i].checked){
                    t.push(dados[i].value);
                }
            }
            if(t.length > 0){
                return titulo +" (" + t.join("/") + ")";
            }
            else{
                return titulo;
            }
        },
        verificaParametros: function(){
            var ok = true,
            combos = ["i3geoCartoComboMedidasVariavel"],
            n = combos.length,
            i,temp;
            for(i=0;i<n;i++){
                temp = $i(combos[i]);
                if(!temp){
                    return combos[i];
                }
                if(temp.value == ""){
                    return combos[i];
                }
            }
            return ok;
        },
        defineFiltro: function(){
            //se nao tiver parametros, filtro e vazio
            if(i3GEOF.cartograma.parametros.dados.length == 0){
                return "";
            }
            //se tiver parametro e todos estiverem vazios, aborta
            var i,n,c,val,
            t=[],
            dados = i3GEOF.cartograma.parametros.dados;
            n = dados.length;
            for(i=0;i<n;i++){
                c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
                if(c){
                    if(c.value != "" && i3GEOF.cartograma._parameters.MULTIPARAMETROS === false){
                        //t.push(dados[i].coluna+'="'+c.value+'"');
                        t.push(dados[i].coluna+'*"'+c.value+'"');
                    }
                    else{
                        val = i3GEO.util.valoresCheckCombo(c.id);
                        if(val.length > 0){
                            //t.push(dados[i].coluna+' IN ("'+val.join('","')+'")');
                            t.push(dados[i].coluna+' * "'+val.join('","')+'"');
                        }
                    }
                }
            }
            if(t.length > 0){
                return t.join("|");
            }
            else{
                return "";
            }
        },
};