if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.tabela =
{
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
	    //i3GEOF.tabela._parameters.mustache = "";
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
		i3GEO.util.checkItensEditaveis(
			i3GEOF.tabela._parameters.tema,
			function(retorno) {
			    if (retorno.tipo === "dados") {
				$i("i3GEOtabelaitensrelatorio").innerHTML = retorno.dados;
			    }
			},
			"i3GEOtabelaitensrelatorio",
			"320px",
			"",
			"sim"
		);

		i3GEO.util.comboItens(
			"i3GEOtabelaagrupaItem",
			i3GEOF.tabela._parameters.tema,
			function(retorno) {
			    $i("i3GEOtabelaagrupamento").innerHTML = retorno.dados;
			},
			"i3GEOtabelaagrupamento",
			"",
			"sim",
			"",
			"form-control"
		);
	    };
	    i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
		"i3GEOF.tabela.atualizaListaDeRegistros()"
		]);
	    i3GEOF.tabela.pegaRegistros();
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
	getFormData: function(){
	    var temp, par = {};
	    if (i3GEOF.tabela.refreshOnNavigate === true) {
		par.tipo = "mapa";
	    } else {
		par.tipo = "brasil";
	    }
	    if ($i("i3GEOtabelatipolista").checked) {
		par.tipolista = "selecionados";
	    } else {
		par.tipolista = "tudo";
	    }
	    if ($i("i3GEOtabelalegenda").checked) {
		par.dadosDaClasse = "sim";
	    } else {
		par.dadosDaClasse = "nao";
	    }
	    temp = $i("i3GEOtabelainicio").value * 1;
	    if(temp != ""){
		par.inicio = (temp*1) - 1;
	    } else {
		par.inicio = "";
	    }
	    if(temp == 0 || temp < 0){
		par.inicio = 0;
	    }
	    temp = $i("i3GEOtabelafim").value * 1;
	    par.fim = temp;
	    if(temp == 0 || temp < 0){
		par.fim = "";
	    }

	    par.ext = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
	    par.tema = i3GEOF.tabela._parameters.tema;
	    par.g_sid = i3GEO.configura.sid;
	    return par;
	},
	pegaRegistros : function() {
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "listaregistros";
	    $i(p.idRegistros).innerHTML = "";
	    i3GEO.janela.abreAguarde();
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEOF.tabela.montaTabela(data);
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
	/*
	 * Function: montaTabela
	 *
	 * Monta a visualiza&ccedil;&atilde;o da tabela de atributos
	 */
	montaTabela : function(retorno) {
	    var p = this._parameters,
	    i3f = this;
	    if (retorno !== undefined) {
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
			"itens" : retorno.itens,
			"alias" : retorno.alias
		};
		n = retorno.itens.length;
		for (i = 0; i < n; i++) {
		    mustache.cabecalho.push({
			"idcoluna": i * 1 + 4, //pq tem 3 colunas com icones
			"item": retorno.itens[i],
			"alias": retorno.alias[i],
			"classe": ""
		    });
		}
		n = retorno.registros.length;
		if ($i("i3GEOtabelafim").value === "") {
		    $i("i3GEOtabelafim").value = n - 1;
		}
		for (i = 0; i < n; i++) {
		    linha = {};
		    linha.classezoom = "hidden";
		    linha.ext = "";
		    linha.indice = retorno.registros[i].indice;
		    if (retorno.registros[i].ext && retorno.registros[i].ext != "") {
			linha.classezoom = "";
			linha.ext = retorno.registros[i].ext;
		    }
		    linha.stat = "";
		    if (retorno.registros[i].status === "CHECKED") {
			linha.stat = "CHECKED";
			registros[retorno.registros[i].indice] = true;
		    } else if (registros[retorno.registros[i].indice] && registros[retorno.registros[i].indice] === true) {
			linha.stat = "CHECKED";
		    }
		    if (i3GEOtabelalegenda == true) {
			linha.classelegenda = "";
			linha.nomeClasse = retorno.registros[i].classe["nome"];
			linha.imagemClasse = retorno.legenda[retorno.registros[i].classe["indice"]];
			imagem = retorno.legenda[retorno.registros[i].classe["indice"]];
		    } else {
			linha.classelegenda = "hidden";
			linha.nomeClasse = "";
			linha.imagemClasse = "";
		    }
		    vals = retorno.registros[i].valores;
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
	ordenaColuna : function(coluna, cid) {
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

		ins = "<table id='i3GEOtabelatabelai' >";
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
	    i3GEO.Interface.zoom2ext(ext);
	    i3GEOF.tabela.pegaRegistros();
	},
	registraLinha : function(linha) {
	    i3GEOF.tabela._parameters.registros[linha.name] = linha.checked;
	},
	listaMarcados : function(idjanela) {
	    var lista = [], registros = i3GEOF.tabela._parameters.registros, i, n = registros.length;
	    for (i = 0; i < n; i++) {
		if (registros[i] === true) {
		    lista.push(i);
		}
	    }
	    return lista;
	},
	ativaSelecao : function(btn) {
	    var p = this._parameters,
	    i3f = this,
	    par = i3f.getFormData();
	    par.funcao = "incluisel";
	    par.ids = i3GEOF.tabela.listaMarcados().toString();
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.Interface.atualizaTema(data, par.tema);
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
	limpaSelecao : function() {
	    i3GEO.tema.limpasel(i3GEOF.tabela._parameters.tema);
	    i3GEOF.tabela._parameters.registros = [];
	    var lista = $i("i3GEOtabelatabelai").getElementsByTagName("input"), n = lista.length, i;
	    for (i = 0; i < n; i++) {
		lista[i].checked = false;
	    }
	},
	criaNovoTema : function(btn) {
	    var p = this._parameters,
	    i3f = this;
	    if(i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[p.tema].nsel < 1){
		i3GEO.janela.snackBar({content: $trad("selUmReg",i3GEOF.tabela.dicionario)});
		return;
	    }
	    i3GEO.janela.abreAguarde();
	    btn = $(btn);
	    btn.prop("disabled",true).find("span").removeClass("hidden");
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    {
			funcao: "selecaocriatema",
			tema: i3GEOF.tabela._parameters.tema,
			g_sid: i3GEO.configura.sid
		    }
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.mapa.refresh();
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			btn.prop("disabled",false).find("span").addClass("hidden");
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
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
	estatistica : function() {
	    if ($i("i3GEOtabelaComboItensGuia3").value === "") {
		i3GEO.janela.snackBar({content: "Escolha um item!"});
		return;
	    }
	    var p = this._parameters,
	    i3f = this,
	    par = {
		    "exclui": $i("i3GEOtabelafiltro1").value,
		    "g_sid": i3GEO.configura.sid,
		    "funcao": "estatistica",
		    "item": $i("i3GEOtabelaComboItensGuia3").value,
		    "tema": p.tema,
		    "ext": i3GEO.parametros.mapexten,
		    "ids": i3f.listaMarcados().toString()
	    };

	    i3GEO.janela.abreAguarde();
	    i3GEO.janela._formModal.block();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/" + i3f._parameters.namespace + "/exec.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			var textoCopy = "", ins = "", nome, valor, i, n;
			if (data.indices !== undefined) {
			    if (data.indices) {
				n = data.indices.length;
				for (i = 0; i < n; i++) {
				    nome = data.variaveis[data.indices[i]];
				    valor = data.valores[data.indices[i]];
				    textoCopy += nome + " = " + valor + "\n";
				    ins += '<div class="row-content"><h4 class="list-group-item-heading">'+nome+'</h4><p class="list-group-item-text">'+valor+'</p></div>';
				    ins += '<div class="list-group-separator">&nbsp;</div>';
				}
			    }
			} else {
			    ins = data;
			}
			$i("i3GEOtabelaEstatisticas").innerHTML = "<span class='copyToMemory' ></span>" + ins + "<br>";
			$("#i3GEOtabelaEstatisticas").on("click",function(){
			    i3GEO.util.copyToClipboard(textoCopy);
			});
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
		    }
	    );
	},
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
		if($i("i3GEOtabelatipoextent").checked){
		    $i("i3GEOtabelarelatorio").action += "?ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
		} else {
		    $i("i3GEOtabelarelatorio").action += "?ext=-180 -90 180 90";
		}
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