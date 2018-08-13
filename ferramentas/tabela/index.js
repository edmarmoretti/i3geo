if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.tabela =
{
	LISTAREGATIVO : true,
	refreshOnNavigate : true,
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": "",
	    "mustache": "",
	    "mustachelista": "",
	    "idContainer": "i3GEOtabelaContainer",
	    "idRegistros" : "i3GEOtabelaregistros",
	    "namespace": "tabela",
	    "colunas" :{
		"itens" : [],
		"alias" : []
	    },
	    "registros": []
	},
	start : function(tema){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html",
	    t2 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/templateLista_mst.html";
	    p.tema = tema;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1),$.get(t2)).done(function(r1,r2) {
		    p.mustache = r1[0];
		    p.mustachelista = r2[0];
		    i3f.html();
		    i3GEO.janela.fechaAguarde();
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEOF.tabela._parameters.mustache = "";
	    i3GEOF.tabela._parameters.tema = "";
	    i3GEOF.tabela._parameters.registros = [];
	    i3GEOF.tabela._parameters.colunas = {
		    "itens" : [],
		    "alias" : []
	    };

	    i3GEO.eventos.removeEventos("NAVEGAMAPA", [
		"i3GEOF.tabela.atualizaListaDeRegistros()"
		]);

	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    idRegistros: p.idRegistros,
		    propriedades: $trad("p13"),
		    opcoes: $trad("opcoes"),
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

	    i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia1", "i3GEOtabelaguia");
	    //
	    // eventos das guias
	    //
	    $i("i3GEOtabelaguia6").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia6", "i3GEOtabelaguia");
	    };
	    $i("i3GEOtabelaguia1").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia1", "i3GEOtabelaguia");
	    };
	    $i("i3GEOtabelaguia3").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia3", "i3GEOtabelaguia");
		if (!$i("i3GEOtabelaComboItensGuia3")) {
		    i3GEOF.tabela.comboItensEstat();
		}
	    };
	    // relatorio
	    $i("i3GEOtabelaguia5").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOtabelaguia5", "i3GEOtabelaguia");

		i3GEO.util.comboItens("i3GEOtabelaagrupaItem", i3GEOF.tabela._parameters.tema, function(
			retorno) {
		    if (retorno.tipo === "erro") {
			i3GEO.janela.closeMsg('<div class="alert alert-danger" role="alert">' + $trad('erroTemaOrigem',i3GEOF.tabela.dicionario) + '</div>');
		    } else {
			$i("i3GEOtabelaagrupamento").innerHTML = retorno.dados;
		    }
		}, "i3GEOtabelaagrupamento", "","sim","","form-control");
	    };
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
		"i3GEOF.tabela.atualizaListaDeRegistros()"
		]);
	    i3GEOF.tabela.pegaRegistros();
	},
	comboJanelas : function(idcombo, funcao, w) {
	},
	comboColunas : function(idJanela, idcombo, funcao) {
	    var i, c = i3GEOF.tabela._parameters.colunas, n = c.itens.length;
	    if (!funcao) {
		funcao = "";
	    }
	    ins = "<select class='form-control' id='"
		+ idcombo
		+ "' onchange='"
		+ funcao
		+ "'>"
		+ "	<option value='' >---</option>";
	    for (i = 0; i < n; i++) {
		ins += "<option value='" + c.itens[i] + "' >" + c.alias[i] + "</option>";
	    }
	    ins += "</select>";
	    return ins;
	},
	/*
	 * Function: ativaAutoAtualiza
	 *
	 * Ativa ou desativa a atualiza&ccedil;&atilde;o autom&aacute;tica da tabela quando o usu&aacute;rio navega no mapa
	 */
	atualizaListaDeRegistros : function() {
	    i3GEOF.tabela.pegaRegistros();
	},
	pegaRegistros : function(tipolista, dadosDaClasse, inicio, fim) {
	    var p = this._parameters,
	    i3f = this;
	    $i(p.idRegistros).innerHTML = "";
	    var p, ext, tiporeg = "brasil", cp = new cpaint();
	    // verifica se esta no modo de atualizacao automatica
	    if (i3GEOF.tabela.refreshOnNavigate === true) {
		tiporeg = "mapa";
	    }
	    if (!tipolista) {
		if ($i("i3GEOtabelatipolista").checked) {
		    tipolista = "selecionados";
		} else {
		    tipolista = "tudo";
		}
	    }
	    if (!dadosDaClasse) {
		if ($i("i3GEOtabelalegenda").checked) {
		    dadosDaClasse = "sim";
		} else {
		    dadosDaClasse = "nao";
		}
	    }
	    if (!inicio) {
		inicio = $i("i3GEOtabelainicio").value - 1;
	    } else {
		inicio = "";
	    }
	    if (!fim) {
		fim = $i("i3GEOtabelafim").value - 1;
	    } else {
		fim = "";
	    }
	    funcao = function(retorno) {
		i3GEOF.tabela._parameters.registros = [];
		i3GEOF.tabela.montaTabela(retorno);
	    };
	    ext = i3GEO.parametros.mapexten;
	    ext = i3GEO.util.extOSM2Geo(ext);
	    p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=listaregistros"
		+ "&inicio="
		+ inicio
		+ "&fim="
		+ fim
		+ "&tema="
		+ p.tema
		+ "&tipo="
		+ tiporeg
		+ "&tipolista="
		+ tipolista
		+ "&ext="
		+ ext
		+ "&dadosDaClasse="
		+ dadosDaClasse;
	    cp.set_response_type("JSON");
	    cp.call(p, "listaRegistros", funcao);
	},
	/*
	 * Function: montaTabela
	 *
	 * Monta a visualiza&ccedil;&atilde;o da tabela de atributos
	 */
	montaTabela : function(retorno) {
	    var p = this._parameters,
	    i3f = this;
	    if (retorno.data !== undefined) {
		var mustache = {
			"cabecalho": [{"classe":"hidden"},{"classe":"hidden"},{"classe":"hidden"},{"classe":"hidden"}], //4 colunas com icones
			"linhas": [],
			"ordena": $trad('ordena', i3GEOF.tabela.dicionario),
			"excluir": $trad("t12")
		},
		linha = {
			"classezoom": "",
			"ext": "",
			"indice": ""
		},
		ins, i, vals, cor, j, n, stat, imagem, registros = p.registros, i3GEOtabelalegenda =
		    $i("i3GEOtabelalegenda").checked;
		// cabecalho da tabela
		p.colunas = {
			"itens" : retorno.data[0].itens,
			"alias" : retorno.data[0].alias
		};
		n = retorno.data[0].itens.length;
		for (i = 0; i < n; i++) {
		    mustache.cabecalho.push({
			"idcoluna": i * 1 + 4, //pq tem 3 colunas com icones
			"item": retorno.data[0].itens[i],
			"alias": retorno.data[0].alias[i],
			"classe": ""
		    });
		}
		n = retorno.data[1].registros.length;
		if ($i("i3GEOtabelafim").value === "") {
		    $i("i3GEOtabelafim").value = n - 1;
		}
		for (i = 0; i < n; i++) {
		    linha = {};
		    linha.classezoom = "hidden";
		    linha.ext = "";
		    linha.indice = retorno.data[1].registros[i].indice;
		    if (retorno.data[1].registros[i].ext && retorno.data[1].registros[i].ext != "") {
			linha.classezoom = "";
			linha.ext = retorno.data[1].registros[i].ext;
		    }
		    linha.stat = "";
		    if (retorno.data[1].registros[i].status === "CHECKED") {
			linha.stat = "CHECKED";
		    }
		    if (registros[retorno.data[1].registros[i].indice]) {
			if (registros[retorno.data[1].registros[i].indice] === true) {
			    linha.stat = "CHECKED";
			} else {
			    linha.stat = "";
			}
		    }
		    if (i3GEOtabelalegenda == true) {
			linha.classelegenda = "";
			linha.nomeClasse = retorno.data[1].registros[i].classe["nome"];
			linha.imagemClasse = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
			imagem = retorno.data.legenda[retorno.data[1].registros[i].classe["indice"]];
		    } else {
			linha.classelegenda = "hidden";
			linha.nomeClasse = "";
			linha.imagemClasse = "";
		    }
		    if (linha.stat === "CHECKED") {
			registros[retorno.data[1].registros[i].indice] = true;
		    }
		    vals = retorno.data[1].registros[i].valores;
		    linha.colunas = "";
		    for (j = 0; j < vals.length; j++) {
			linha.colunas += "<td style='min-width: 150px;' title='" + vals[j].item + "' >" + vals[j].valor + "</td>";
		    }
		    mustache.linhas.push(linha);
		}
		ins = Mustache.render(p.mustachelista, mustache);
		$i(p.idRegistros).innerHTML = ins;
	    }
	},
	/*
	 * Function: mais
	 *
	 * Avan&ccedil;a o contador de registros para a listagem
	 */
	mais : function(idjanela) {
	    var i = $i("i3GEOtabelainicio").value * 1, f = $i("i3GEOtabelafim").value * 1, d = f - i;
	    $i("i3GEOtabelainicio").value = f + 1;
	    $i("i3GEOtabelafim").value = f + d + 1;
	    i3GEOF.tabela.pegaRegistros();
	},
	/*
	 * Function: todos
	 *
	 * Avan&ccedil;a o contador de registros para o fim da listagem
	 */
	todos : function(idjanela) {
	    $i("i3GEOtabelainicio").value = 1;
	    $i("i3GEOtabelafim").value = "";
	    i3GEOF.tabela.pegaRegistros(false, false, false, 1, false);
	},
	/*
	 * Function: menos
	 *
	 * Retrocede o contador de registros para a listagem
	 */
	menos : function(idjanela) {
	    var i = $i("i3GEOtabelainicio").value * 1, f = $i("i3GEOtabelafim").value * 1, d = f - i;
	    $i("i3GEOtabelainicio").value = i - d - 1;
	    $i("i3GEOtabelafim").value = i - 1;
	    if ($i("i3GEOtabelainicio").value < 1) {
		$i("i3GEOtabelainicio").value = 1;
		$i("i3GEOtabelafim").value = 1 + d;
	    }
	    i3GEOF.tabela.pegaRegistros();
	},
	/*
	 * Function: excluiColuna
	 *
	 * Exclui uma coluna da visualiza&ccedil;&atilde;o da tabela
	 */
	excluiColuna : function(coluna, cid, idjanela) {
	    try {
		var tabela = $i("i3GEOtabelatabelai"), trs, tds, i, t, nt, ni;
		// pega o indice correto
		tds = coluna.parentNode.parentNode.getElementsByTagName("td");
		nt = tds.length;
		for (t = 0; t < nt; t++) {
		    if (tds[t].accessKey == cid) {
			cid = t;
			break;
		    }
		}
		trs = tabela.getElementsByTagName("tr");
		nt = trs.length;
		for (t = 0; t < nt; t++) {
		    i = trs[t];
		    if (i.getElementsByTagName("td")[cid]) {
			ni = i.getElementsByTagName("td")[cid];
			i.removeChild(ni);
		    }
		}
	    } catch (e) {
		if (typeof (console) !== 'undefined') {
		    console.error(e);
		}
	    }
	},
	/*
	 * Function: ordenaColuna
	 *
	 * Ordena uma coluna da tabela
	 */
	ordenaColuna : function(coluna, cid, idjanela) {
	    try {
		var numero = false,tabela = $i("i3GEOtabelatabelai"), trs = tabela.getElementsByTagName("tr"),
		ntrs = trs.length, tds, nt, psort = [], t, psortfim, npsortfim, ins, p, e, c;

		// pega o indice correto
		tds = coluna.parentNode.parentNode.getElementsByTagName("td");
		nt = tds.length;
		for (t = 0; t < nt; t++) {
		    if (tds[t].accessKey == cid) {
			cid = t;
			break;
		    }
		}
		for (t = 1; t < ntrs; t++) {
		    c = trs[t].getElementsByTagName("td")[cid].innerHTML;
		    psort.push( c + "@$" + t);
		    if (c * 1) {
			numero = true;
		    }
		}
		// recosntroi a tabela
		if(numero){
		    psortfim = psort.sort(function(a, b) {
			return a.split("@$")[0]*1 - b.split("@$")[0]*1;
		    });
		} else {
		    psortfim = psort.sort();
		}

		ins = "<table id=" + "i3GEOtabelatabelai class=lista8 >";
		ins += "<tr>" + trs[0].innerHTML + "</tr>";
		npsortfim = psortfim.length;
		for (p = 0; p < npsortfim; p++) {
		    e = psortfim[p].split("@$")[1] * 1;
		    if (trs[e] !== undefined) {
			ins += "<tr>" + trs[e].innerHTML + "</tr>";
		    }
		}
		$i("i3GEOtabelaregistros").innerHTML = ins + "</table>";
	    } catch (e) {
		if (typeof (console) !== 'undefined') {
		    console.error(e);
		}
	    }
	},
	excluiLinha : function(celula) {
	    var p = celula.parentNode.parentNode;
	    do {
		p.removeChild(p.childNodes[0]);
	    } while (p.childNodes.length > 0);
	    p.parentNode.removeChild(p);
	},
	zoomExt : function(ext, idjanela) {
	    var funcao = function() {
		i3GEOF.tabela.pegaRegistros();
		i3GEO.atualiza();
	    };
	    i3GEO.php.mudaext(funcao, "nenhum", ext);
	},
	registraLinha : function(linha, idjanela) {
	    i3GEOF.tabela._parameters.registros[linha.name] = linha.checked;
	},
	/*
	 * Function: listaMarcados
	 *
	 * Retorna um array com os &iacute;ndices dos registros que est&atilde;o marcados.
	 */
	listaMarcados : function(idjanela) {
	    var lista = [], registros = i3GEOF.tabela._parameters.registros, i, n = registros.length;
	    for (i = 0; i < n; i++) {
		if (registros[i] === true) {
		    lista.push(i);
		}
	    }
	    return lista;
	},
	/*
	 * Function: ativaSelecao
	 *
	 * Seleciona no mapa os elementos que estiverem marcados na guia 2
	 *
	 * Veja:
	 *
	 * <INCLUISEL>
	 */
	ativaSelecao : function() {
	    var lista = i3GEOF.tabela.listaMarcados(), p, cp, temp = function(retorno) {
		if (retorno) {
		    i3GEO.Interface.atualizaTema(retorno, i3GEOF.tabela._parameters.tema);
		}
	    };
	    p =
		i3GEO.configura.locaplic + "/ferramentas/tabela/exec.php?g_sid="
		+ i3GEO.configura.sid
		+ "&funcao=incluisel&tema="
		+ i3GEOF.tabela._parameters.tema
		+ "&ids="
		+ lista.toString();
	    cp = new cpaint();
	    cp.set_response_type("JSON");
	    cp.call(p, "incluiSel", temp);
	},
	/*
	 * Function: limpaSelecao
	 *
	 * Limpa a sele&ccedil;&atilde;o do tema da tabela
	 */
	limpaSelecao : function() {
	    i3GEO.tema.limpasel(i3GEOF.tabela._parameters.tema);
	    i3GEOF.tabela._parameters.registros = [];
	    var lista = $i("i3GEOtabelatabelai").getElementsByTagName("input"), n = lista.length, i;
	    for (i = 0; i < n; i++) {
		lista[i].checked = false;
	    }
	},
	/*
	 * Function: criaNovoTema
	 *
	 * Cria um novo tema contendo a sele&ccedil;&atilde;o existente
	 */
	criaNovoTema : function(idjanela) {
	    var camada = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.tabela._parameters.tema);
	    if(camada.nsel == 0){
		i3GEO.janela.tempoMsg($trad("selUmReg",i3GEOF.tabela.dicionario));
		return;
	    }
	    var temp = function(retorno) {
		i3GEO.atualiza(retorno);
	    };
	    i3GEO.php.criatemaSel(temp, i3GEOF.tabela._parameters.tema);
	},
	/*
	 * Function: comboItens
	 *
	 * Cria um combo para selecionar um item do tema escolhido
	 */
	comboItensEstat : function(idjanela) {
	    var tema = i3GEOF.tabela._parameters.tema;
	    i3GEO.util.comboItens("i3GEOtabelaComboItensGuia3", tema, function(retorno) {
		if (retorno.tipo === "erro") {
		    $i("i3GEOtabelaitensGuia3").innerHTML =
			i3GEO.janela.closeMsg('<div class="alert alert-danger" role="alert">' + $trad('erroTemaOrigem2',i3GEOF.tabela.dicionario) + '</div>');
		} else {
		    $i("i3GEOtabelaitensGuia3").innerHTML = retorno.dados;
		}
	    }, "i3GEOtabelaitensGuia3", "","sim","","form-control");
	},
	estatistica : function(idjanela) {
	    if ($i("i3GEOtabelaComboItensGuia3").value === "") {
		i3GEO.janela.tempoMsg("Escolha um item!");
		return;
	    }
	    try {
		var monta = function(retorno) {
		    var ins = "", nome, valor, i, n;
		    if (retorno.data.indices !== undefined) {
			if (retorno.data.indices) {
			    n = retorno.data.indices.length;
			    for (i = 0; i < n; i++) {
				nome =retorno.data.variaveis[retorno.data.indices[i]];
				valor = retorno.data.valores[retorno.data.indices[i]];
				ins += '<div class="row-content"><h4 class="list-group-item-heading">'+nome+'</h4><p class="list-group-item-text">'+valor+'</p></div>';
				ins += '<div class="list-group-separator">&nbsp;</div>';
			    }
			}
		    } else {
			ins = retorno.data;
		    }
		    $i("i3GEOtabelaoperacoes").innerHTML = ins + "<br>";
		}, exclui = "", cp = new cpaint(), p;
		if ($i("i3GEOtabelafiltro1").value !== "") {
		    exclui = $i("i3GEOtabelafiltro1").value;
		}
		p =
		    i3GEO.configura.locaplic + "/ferramentas/tabela/exec.php?g_sid="
		    + i3GEO.configura.sid
		    + "&funcao=estatistica&item="
		    + $i("i3GEOtabelaComboItensGuia3").value
		    + "&tema="
		    + i3GEOF.tabela._parameters.tema
		    + "&exclui="
		    + exclui
		    + "&ext="
		    + i3GEO.parametros.mapexten;
		cp.set_response_type("JSON");
		cp.call(p, "estatDescritivas", monta);
	    } catch (e) {
		$i("operacoes").innerHTML = "Ocorreu um erro: " + e;
	    }
	},
	tabelaTexto : function() {
	},
	/*
	 * Function: relatorioTabela
	 *
	 * Monta o relat&oacute;rio padr&atilde;o em uma nova janela
	 */
	relatorioTabela : function() {
	    try {
		$i("i3GEOtabelatiporelh").value = "";
		$i("i3GEOtabelaarearelh").value = $i("i3GEOtabelacalculaarea").checked;
		$i("i3GEOtabelastatrelh").value = $i("i3GEOtabelacalculaestat").checked;
		$i("i3GEOtabelaexcluirvalorh").value = $i("i3GEOtabelaexcestat").value;
		$i("i3GEOtabelatemarelh").value = i3GEOF.tabela._parameters.tema;
		$i("i3GEOtabelag_sidh").value = i3GEO.configura.sid;
		$i("i3GEOtabelaitemagruparelh").value = $i("i3GEOtabelaagrupaItem").value;
		var inputs = $i("i3GEOtabelaitensrelatorio").getElementsByTagName("input"), listai = [], listaordem = [], listanomes =
		    [], nome, ordem, i, temp, n = inputs.length;
		for (i = 0; i < n; i++) {
		    if (inputs[i].type === "checkbox" && inputs[i].checked == true) {
			listai.push(inputs[i].id + "|" + inputs[i].name);
			nome = $i(inputs[i].id + inputs[i].name).value;
			listanomes.push(nome);
			ordem = $i("ordem_" + inputs[i].id + inputs[i].name).value;
			if (ordem === "") {
			    ordem = 0;
			}
			listaordem.push(ordem);
		    }
		}
		$i("i3GEOtabelaordemrel").value = listaordem;
		$i("i3GEOtabelanomesrelh").value = listanomes;
		$i("i3GEOtabelaitensrelh").value = listai;
		temp = $i("i3GEOtabelarelatorio").action;
		$i("i3GEOtabelarelatorio").action += "?ext=" + i3GEO.parametros.mapexten;
		$i("i3GEOtabelarelatorio").submit();
		$i("i3GEOtabelarelatorio").action = temp;
	    } catch (e) {
		i3GEO.janela.tempoMsg(e);
	    }
	},
	/*
	 * Function: relatorioTexto
	 *
	 * Gera o relat&oacute;rio no formato CSV
	 */
	relatorioTexto : function(idjanela) {
	    $i("i3GEOtabelaarearelh").value = $i("i3GEOtabelacalculaarea").checked;
	    $i("i3GEOtabelastatrelh").value = $i("i3GEOtabelacalculaestat").checked;
	    $i("i3GEOtabelaexcluirvalorh").value = $i("i3GEOtabelaexcestat").value;
	    $i("i3GEOtabelatemarelh").value = i3GEOF.tabela._parameters.tema;
	    $i("i3GEOtabelag_sidh").value = i3GEO.configura.sid;
	    $i("i3GEOtabelaitemagruparelh").value = $i("i3GEOtabelaagrupaItem").value;
	    $i("i3GEOtabelatiporelh").value = "csv";
	    var inputs = $i("i3GEOtabelaitensrelatorio").getElementsByTagName("input"), listai = [], listanomes = [], nome, i, temp, n =
		inputs.length;
	    for (i = 0; i < n; i++) {
		if (inputs[i].checked === true) {
		    listai.push(inputs[i].id + "|" + inputs[i].name);
		    nome = $i(inputs[i].id + inputs[i].name).value;
		    listanomes.push(nome);
		}
	    }
	    $i("i3GEOtabelanomesrelh").value = listanomes;
	    $i("i3GEOtabelaitensrelh").value = listai;
	    temp = $i("i3GEOtabelarelatorio").action;
	    $i("i3GEOtabelarelatorio").action += "?ext=" + i3GEO.parametros.mapexten;
	    $i("i3GEOtabelarelatorio").submit();
	    $i("i3GEOtabelarelatorio").action = temp;
	}
};