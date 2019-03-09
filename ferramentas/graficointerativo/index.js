if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.graficointerativo =
{
	renderFunction: i3GEO.janela.formModal,
	_parameters: {
	    "tema": false,
	    "mustache": "",
	    "idContainer": "i3GEOgraficointerativoContainer",
	    "namespace": "graficointerativo",
	    /**
	     * Controla se o evento de atualizacao da lista de registros esta ativo ou nao
	     * E utilizado quando os graficos sao recuperados de um mapa que foi salvo
	     */
	    "listaregativo" : true,
	    //Dados que serao utilizados. Pode ser passado como parametro.
	    "dados": false,
	    //tipo de grafico escolhido
	    "tipo" : "",
	    //acumula os valores ao criar o grafico
	    "acumula": false,
	    //Utiliza valores relativos
	    "relativa": false,
	    //N&atilde;o faz nenhum tipo de processamento nos dados antes de gerar o gr&aacute;fico
	    "dadospuros" : false,
	    "w": 500,
	    "h": 300,
	    "dadosComboItens": "",
	    "atualiza": true
	},
//	i3GEOF.graficointerativo._parameters
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
	    i3GEOF.graficointerativo._parameters = {
		    "tema": false,
		    "mustache": "",
		    "idContainer": "i3GEOgraficointerativoContainer",
		    "namespace": "graficointerativo",
		    "listaregativo" : true,
		    "dados": false,
		    "tipo" : "",
		    "acumula": false,
		    "relativa": false,
		    "dadospuros" : false,
		    "w": 500,
		    "h": 300,
		    "dadosComboItens": "",
		    "atualiza": true
	    };
	    i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.graficointerativo.atualizaListaDeRegistros()"]);
	},
	html:function() {
	    var p = this._parameters,
	    i3f = this,
	    hash = {};
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    idContainer: p.idContainer,
		    prop: $trad('p13'),
		    w: p.w,
		    h: p.h,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    i3f.renderFunction.call(
		    this,
		    {
			texto: Mustache.render(p.mustache, hash),
			onclose: i3f.destroy,
			footer: true,
			resizable: {
			    disabled: false,
			    ghost: true,
			    handles: "se,n"
			},
			css: {'cursor': 'pointer', 'width': '100%', 'height': '50%','position': 'fixed','top': '', 'left': 0, 'right': 0, 'margin': 'auto', 'bottom': 0}
		    });

	    $i("i3GEOgraficointerativoAcumula").checked = i3GEOF.graficointerativo._parameters.acumula;
	    $i("i3GEOgraficointerativoRelativa").checked = i3GEOF.graficointerativo._parameters.relativa;
	    $i("i3GEOgraficointerativoDadosPuros").checked = i3GEOF.graficointerativo._parameters.dadospuros;
	    i3GEOF.graficointerativo.comboTemas();
	    if (i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEOF.graficointerativo.atualizaListaDeRegistros()") < 0) {
		i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo.atualizaListaDeRegistros()");
	    }
	    i3f.t0();
	},
	t0: function(){
	    i3GEO.util.proximoAnterior("","i3GEOF.graficointerativo.t1()","","i3GEOF.graficointerativo.t0","i3GEOgraficointerativoresultado",true,"i3GEOToolFormModalFooter");
	},
	t1: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.graficointerativo.t0()","i3GEOF.graficointerativo.t2()","","i3GEOF.graficointerativo.t1","i3GEOgraficointerativoresultado",true,"i3GEOToolFormModalFooter");
	},
	t2: function(){
	    i3GEOF.graficointerativo.configuraDados();
	    i3GEO.util.proximoAnterior("i3GEOF.graficointerativo.t1()","i3GEOF.graficointerativo.t3()","","i3GEOF.graficointerativo.t2","i3GEOgraficointerativoresultado",true,"i3GEOToolFormModalFooter");
	},
	t3: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.graficointerativo.t2()","i3GEOF.graficointerativo.t4()","","i3GEOF.graficointerativo.t3","i3GEOgraficointerativoresultado",true,"i3GEOToolFormModalFooter");
	},
	t4: function(){
	    i3GEO.util.proximoAnterior("i3GEOF.graficointerativo.t3()","","","i3GEOF.graficointerativo.t4","i3GEOgraficointerativoresultado",true,"i3GEOToolFormModalFooter");
	    i3GEOF.graficointerativo.tabela2grafico();
	},
	csv: function(){
	    i3GEO.janela.closeMsg("<textarea class='form-control input-lg' style='height:400px' >" + (i3GEOF.graficointerativo.tabela2csv()).join("\n") + "</textarea>");
	},
	png: function(){
	    var t,w, h, form = $i("i3GEOgraficointerativoPNG"), isvg = form.getElementsByTagName("input")[0], svg =
		$i("i3GEOgraficointerativoguia4objCanvas").firstChild;
	    h = svg.getAttributeNS(null, 'height');
	    w = svg.getAttributeNS(null, 'width');
	    if (typeof XMLSerializer != "undefined") {
		svg = (new XMLSerializer()).serializeToString(svg);
	    } else {
		svg = svg.html();
	    }
	    isvg.value = svg;
	    t = form.action;
	    form.action = form.action + "?" + "w=" + w + "&h=" + h;
	    form.submit();
	    form.action = t;
	},
	comboTemas : function() {
	    i3GEO.util.comboTemas(
		    "i3GEOgraficointerativoComboTemasId",
		    function(retorno) {
			$i("i3GEOgraficointerativoComboTemas").innerHTML += retorno.dados;
			$i("i3GEOgraficointerativoComboTemasId").onchange = function() {
			    i3GEOF.graficointerativo._parameters.dadosComboItens = "";
			    i3GEOF.graficointerativo._parameters.tema = $i("i3GEOgraficointerativoComboTemasId").value;
			    i3GEOF.graficointerativo.comboItensSel();
			};
		    },
		    "i3GEOgraficointerativoComboTemas",
		    "comTabela",
		    false,
		    "",
		    " ",
		    false,
		    true,
		    "form-control comboTema"
	    );
	},
	ativaTipo : function(tipo) {
	    i3GEOF.graficointerativo._parameters.tipo = tipo;
	    if (i3GEOF.graficointerativo._parameters.tipo == "ponto_1") {
		$i("i3GEOgraficointerativoDadosPuros").checked = true;
	    } else {
		$i("i3GEOgraficointerativoDadosPuros").checked = false;
	    }
	},
	alteraFatorPixel : function(tipo) {
	    var delta = 20,
	    temp = $i("i3GEOgraficointerativoFatorTamanho"),
	    v = parseInt(temp.value, 10);
	    if (temp.value >= 0) {
		if (tipo === "mais") {
		    temp.value = v + delta;
		} else {
		    temp.value = v - delta;
		}
	    }
	    if (parseInt(temp.value, 10) < 0) {
		temp.value = 0;
	    }
	    i3GEOF.graficointerativo.tabela2grafico();
	},
	alteraFatorPixelMenos : function() {
	    i3GEOF.graficointerativo.alteraFatorPixel("menos");
	},
	alteraFatorPixelMais : function() {
	    i3GEOF.graficointerativo.alteraFatorPixel("mais");
	},
	/**
	 * Function: configuraDados
	 *
	 * Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para cada tipo de gr&aacute;fico
	 */
	configuraDados : function() {
	    var ativa = function(comboxlinha, comboylinha, ajudapizza) {
		$i("i3GEOgraficointerativoComboXlinha").style.display = comboxlinha;
		$i("i3GEOgraficointerativoComboYlinha").style.display = comboylinha;
		i3GEO.janela.snackBar({content: $trad("seescolher", i3GEOF.graficointerativo.dicionario)});
	    };
	    if (i3GEOF.graficointerativo._parameters.tipo === "") {
		i3GEO.janela.tempoMsg($trad('selecionaTipoGrafico', i3GEOF.graficointerativo.dicionario));
		i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1", "i3GEOgraficointerativoguia");
		return;
	    }
	    if (i3GEOF.graficointerativo._parameters.tipo === "pizza2d") {
		ativa("block", "block", "block");
	    }
	},
	/**
	 * Function: comboItensSel
	 *
	 * Cria um combo para selecionar os itens do tema escolhido
	 *
	 * Veja:
	 *
	 * <i3GEO.util.comboItens>
	 */
	comboItensSel : function(funcaoFinaliza) {
	    var geraCombo = function() {
	    }, tema = $i("i3GEOgraficointerativoComboTemasId").value;

	    geraCombo =
		function(retorno) {
		if (retorno.tipo === "erro") {
		    $i("i3GEOgraficointerativoComboX").innerHTML =
			"<h5 class='alert alert-error'>" + $trad('erroTemaOrigem', i3GEOF.graficointerativo.dicionario) + "</h5>";
		    $i("i3GEOgraficointerativoComboY").innerHTML =
			"<h5 class='alert alert-error'>" + $trad('erroTemaOrigem', i3GEOF.graficointerativo.dicionario) + "</h5>";
		} else {
		    // guarda o valor para reuso
		    i3GEOF.graficointerativo._parameters.dadosComboItens = retorno;
		    //para escolher o item de Y
		    var temp = retorno.dados.replace("i3GEOgraficointerativoComboXid","i3GEOgraficointerativoComboYid");

		    $i("i3GEOgraficointerativoComboY").innerHTML = "<div>"
			+ temp
			+ "<div class='form-group label-fixed condensed'>"
			+ "	<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo.dicionario) + "'  type=text id='i3GEOgraficointerativoComboYidTitulo' value='' />"
			+ "</div>"
			+ "<br><div class='form-group label-fixed condensed' >"
			+ "	<input class='form-control input-lg i3geoFormIconeAquarela' id='i3GEOgraficointerativoComboYidcor' title='cor' type='text' value='0,0,0' />"
			+ "</div>"
			+ "</div>";


		    i3GEO.util.aplicaAquarela("i3GEOgraficointerativoComboY");

		    //para escolher o item de X
		    $i("i3GEOgraficointerativoComboX").innerHTML = ""
			+ "<div>"
			+ retorno.dados
			+ "<br><div class='form-group label-fixed condensed'>"
			+ "<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo.dicionario) + "' type=text id='i3GEOgraficointerativoComboXidTitulo' value='' />"
			+ "</div></div>";

		    if ($i("i3GEOgraficointerativoComboYid")) {
			adicionaFilho =
			    function() {
			    var no = document.createElement("div"), id = "CorG" + parseInt(Math.random() * 100000, 10), novoselect;
			    no.innerHTML = ""
				+ retorno.dados
				+ "<br><div class='form-group label-fixed condensed'>"
				+ "<input class='form-control input-lg' placeholder='" + $trad('digitaTituloLegenda', i3GEOF.graficointerativo.dicionario) + "' type=text value='' />"
				+ "</div>"
				+ "<br>"
				+ "<input class='form-control input-lg i3geoFormIconeAquarela' value='50,50,50' id='" + id + "' type=text value='' title='cor' />";
			    novoselect = no.getElementsByTagName("select")[0];
			    novoselect.id = "";
			    novoselect.onchange = adicionaFilho;
			    $i("i3GEOgraficointerativoComboY").appendChild(no);
			    i3GEO.util.aplicaAquarela(no.id);
			};
			$i("i3GEOgraficointerativoComboYid").onchange = adicionaFilho;
		    }
		}
		//executa uma funcao que foi enviada como parametros. Usado ao restaurar um grafico
		if(funcaoFinaliza){
		    funcaoFinaliza.call();
		}
	    };
	    //o primeiro combo gerado contem o id Xid
	    if (i3GEOF.graficointerativo._parameters.dadosComboItens == "") {
		i3GEO.util.comboItens(
			"i3GEOgraficointerativoComboXid",
			tema,
			geraCombo,
			"i3GEOgraficointerativoComboX",
			"",
			"",
			"",
			"form-control"
		);
	    } else {
		geraCombo(i3GEOF.graficointerativo._parameters.dadosComboItens);
	    }
	},
	/**
	 * Atualiza as janelas obtendo os dados conforme a navegacao ocorre
	 */
	atualizaListaDeRegistros : function() {
	    if(i3GEOF.graficointerativo._parameters.listaregativo === true){
		if (i3GEOF.graficointerativo._parameters.atualiza === true) {
		    i3GEOF.graficointerativo.obterDados(false);
		    i3GEOF.graficointerativo.tabela2grafico();
		}
	    }
	},
	/**
	 * Function: obterDados
	 *
	 * Obt&eacute;m os dados que ser&atilde;o utilizados no gr&aacute;fico
	 *
	 */
	obterDados : function(btn) {
	    var tema, excluir, cp, tipo, ordenax, monta, p, x, y, i, n, temp;
	    tema = $i("i3GEOgraficointerativoComboTemasId").value;
	    excluir = $i("i3GEOgraficointerativoexcluir").value;
	    tipo = $i("i3GEOgraficointerativoTipoAgregacao").value;
	    ordenax = "sim";
	    // pega os itens
	    temp = $i("i3GEOgraficointerativoComboX");
	    x = temp.getElementsByTagName("select");
	    if (x.length > 0) {
		x = x[0].value;
	    } else {
		x = "";
	    }
	    temp = $i("i3GEOgraficointerativoComboY");
	    temp = temp.getElementsByTagName("select");
	    n = temp.length;
	    if (n === 1) {
		y = temp[0].value;
	    } else {
		y = [];
		for (i = 0; i < n; i++) {
		    if (temp[i].value != "") {
			y.push(temp[i].value);
		    }
		}
		y = y.join(",");
	    }

	    if ($i("i3GEOgraficointerativoDadosPuros").checked) {
		tipo = "nenhum";
	    } else {
		if (x === y) {
		    tipo = "conta";
		}
	    }
	    if (!$i("i3GEOgraficointerativoOrdenaX").checked) {
		ordenax = "nao";
	    }
	    if (tema === "") {
		i3GEO.janela.tempoMsg($trad('selecionaTema', i3GEOF.graficointerativo.dicionario));
		return;
	    }
	    if (x === "") {
		i3GEO.janela.tempoMsg($trad('selecionaItemX', i3GEOF.graficointerativo.dicionario));
		return;
	    }
	    if (y === "") {
		i3GEO.janela.tempoMsg($trad('selecionaItemY', i3GEOF.graficointerativo.dicionario));
		return;
	    }
	    var par = {
		    g_sid: i3GEO.configura.sid,
		    funcao: "graficoSelecao",
		    tema: tema,
		    itemclasses: x,
		    itemvalores: y,
		    exclui: excluir,
		    ext: i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
		    tipo: tipo,
		    ordenax: ordenax
	    };
	    i3GEOF.graficointerativo.get({
		snackbar: true,
		fn: function(data){
		    i3GEOF.graficointerativo.montaTabelaDados(data);
		},
		btn: btn,
		par: par,
		refresh: false
	    });

	},
	/**
	 * Pega os nomes das colunas
	 */
	nomesColunas : function() {
	    // pega os nomes das clunas
	    var i, n, p, temp = $i("i3GEOgraficointerativoComboX"), colunas, cores, alias;
	    if (temp.getElementsByTagName("select")[0]) {
		cores = [];
		colunas = [
		    temp.getElementsByTagName("select")[0].value
		    ];
		alias = [
		    temp.getElementsByTagName("input")[0].value
		    ];
	    } else {
		// caso os dados tenham sido definidos como parametros
		colunas = [
		    "-",
		    "-"
		    ];
		alias = colunas;
		cores = [
		    "#29C152",
		    "#29C152"
		    ];
	    }
	    temp = $i("i3GEOgraficointerativoComboY");
	    temp = temp.getElementsByTagName("select");
	    n = temp.length;
	    for (i = 0; i < n; i++) {
		if (temp[i].value != "") {
		    colunas.push(temp[i].value);
		    // pega o alias
		    p = temp[i].parentNode.getElementsByTagName("input");
		    if (p[0].value != "") {
			alias.push(p[0].value);
		    } else {
			alias.push(temp[i].value);
		    }
		    if (p[1].value != "") {
			cores.push(p[1].value);
		    } else {
			cores.push("#29C152");
		    }
		}
	    }
	    return [
		colunas,
		alias,
		cores
		];
	},
	/**
	 * Function: montaTabelaDados
	 *
	 * Monta a tabela com os dados que ser&atilde;o utilizados no gr&aacute;fico
	 *
	 * Parametro:
	 *
	 * retorno {JSON} - dados no formato JSON
	 */
	montaTabelaDados : function(retorno) {
	    var colunas = [], ncolunas, dados, n, v, ins = [], i, j, id, cor = "#F9C806";
	    dados = retorno.dados;
	    ins.push("<h4>" + $trad('tabelaGrafico', i3GEOF.graficointerativo.dicionario) + "</h4>");
	    ins.push("<table id='i3GEOgraficointerativotabeladados' ><tr><td></td>");
	    // pega os nomes das colunas
	    colunas = i3GEOF.graficointerativo.nomesColunas()[0];
	    ncolunas = colunas.length;
	    for (i = 0; i < ncolunas; i++) {
		ins.push("<td><button onclick='i3GEOF.graficointerativo.ordenaColuna("+i+")' class='btn btn-xs' style='margin: 2px; padding: 2px;'><span class='material-icons'>sort</span></button>&nbsp;" + colunas[i] + "</td>");
	    }
	    ins.push("<td>" + $trad('cor', i3GEOF.graficointerativo.dicionario) + "</td><td></td></tr>");
	    n = dados.length;
	    for (i = 1; i < n; i++) {
		v = dados[i].split(";");
		// ins += v[0]+" "+v[1];
		id = "i3GEOgraficointerativoDados" + i; // layer+indice da classe
		ins.push("<tr>");
		ins.push("<td><button onclick='i3GEOF.graficointerativo.excluilinha(this)' class='btn btn-xs' style='margin:2px;padding:2px;'><span class='material-icons'>clear</span></button></td>");
		for (j = 0; j < ncolunas; j++) {
		    v[j] = v[j].replace("'", "");
		    v[j] = v[j].replace("'", "");
		    ins.push("<td>");
		    ins.push("<div class='form-group label-fixed condensed' ><input class='form-control input-lg' type='text' id='"+id + colunas[j]+"' value='"+v[j]+"' name='"+colunas[j]+"'/></div>");
		    ins.push("</td>");
		}
		ins.push("<td>");
		if ($i("i3GEOgraficointerativoCoresA").checked) {
		    cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
		}
		// verifica se no objeto com os dados existe um terceiro
		// valor com
		// as cores
		if (v[ncolunas + 1]) {
		    cor = i3GEO.util.rgb2hex(v[ncolunas + 1]);
		}
		ins.push("<div class='form-group label-fixed condensed' ><input class='form-control input-lg i3geoFormIconeAquarela' type='text' id='"+ id +"_cor' value='"+cor+"' name=''/></div>");
		ins.push("</td><td>");
		ins.push("</td></tr>");
	    }
	    ins.push("</table><br>");
	    $i("i3GEOgraficointerativoDados").innerHTML = ins.join("");
	    //$i("i3GEOgraficointerativoguia4").onclick.call();
	},
	/**
	 * Function: tabela2csv
	 *
	 * Obt&eacute;m os dados da tabela em CSV
	 */
	tabela2csv : function() {
	    var colunas = i3GEOF.graficointerativo.nomesColunas(), ncolunas = colunas[0].length, inputs =
		$i("i3GEOgraficointerativoDados").getElementsByTagName("input"), ninputs = inputs.length, i, j, temp, csv = [];

	    csv.push(colunas[0].join(";"));
	    for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
		temp = [];
		for (j = 0; j < ncolunas; j++) {
		    temp.push(inputs[i + j].value);
		}
		csv.push(temp.join(";"));
	    }
	    return csv;
	},
	tabela2grafico: function(){
	    var legendaX = "",
	    legendaY = "",
	    dados =	{},
	    xInclinado = false;

	    dados = i3GEOF.graficointerativo.tabela2dados();

	    xInclinado = $i("i3GEOgraficointerativoxInclinado").checked;
	    if ($i("i3GEOgraficointerativoComboXid")) {
		legendaX = $i("i3GEOgraficointerativoComboXidTitulo").value;
	    }
	    if ($i("i3GEOgraficointerativoComboYid")) {
		legendaY = $i("i3GEOgraficointerativoComboYidTitulo").value;
	    }

	    if (legendaX == legendaY && (legendaX != "" && legendaY != "")) {
		legendaX += " (" + $trad('casos', i3GEOF.graficointerativo.dicionario) + ")";
		legendaY += " (" + $trad('numeroCasos', i3GEOF.graficointerativo.dicionario) + ")";
	    }

	    switch (i3GEOF.graficointerativo._parameters.tipo) {
	    case "bar_1":
		legendaX = "";
		i3GEOF.graficointerativo.barras(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado, "vertical");
		break;
	    case "bar_2":
		legendaX = "";
		i3GEOF.graficointerativo.barras(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado, "horizontal");
		break;
	    case "linha_1":
		legendaX = "";
		i3GEOF.graficointerativo.linhas(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado);
		break;
	    case "pizza_1":
		legendaX = "";
		i3GEOF.graficointerativo.pizzas(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
		break;
	    case "ponto_1":
		i3GEOF.graficointerativo.pontos(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
		break;
	    case "area_1":
		legendaX = "";
		i3GEOF.graficointerativo.areas(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX, xInclinado);
		break;
	    case "arvore_1":
		i3GEOF.graficointerativo.arvores(dados["dados"], dados["maior"], dados["cores"], legendaY, legendaX);
		break;
	    default:
		// alert($trad("escolhatipo", i3GEOF.graficointerativo.dicionario));
	    }
	},
	/**
	 * Function: tabela2dados
	 *
	 * Obt&eacute;m os dados da tabela para compor o gr&aacute;fico
	 */
	tabela2dados : function() {
	    var colunas = i3GEOF.graficointerativo.nomesColunas(),
	    ncolunas = colunas[0].length,
	    temp = 0,
	    ultimo = 0,
	    inputs = $i("i3GEOgraficointerativoDados").getElementsByTagName("input"),
	    ninputs = inputs.length,
	    tipoColuna = "String",
	    metadados =	[],
	    i,
	    j,
	    acumulado = [],
	    acum,
	    cores = [],
	    par = [],
	    total = 0,
	    menor = 0,
	    maior = 0,
	    dados =	{};
	    if (ninputs > 0) {
		menor = inputs[1].value * 1;
	    }
	    if (ncolunas === 2) {
		for (i = 0; i < ninputs; i = i + 3) {
		    temp = inputs[i + 1].value * 1;
		    total += temp;
		    cores.push(inputs[i + 2].value);
		}
		for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
		    temp = inputs[i + 1].value * 1;
		    acum = ultimo + temp;
		    acumulado.push(acum);
		    ultimo = ultimo + temp;
		    if (temp > maior) {
			maior = temp;
		    }
		    if (temp < menor) {
			menor = temp;
		    }
		    temp = inputs[i + 1].value * 1;
		    if ($i("i3GEOgraficointerativoAcumula").checked) {
			temp = acum;
		    }
		    if ($i("i3GEOgraficointerativoRelativa").checked) {
			temp = (temp * 100) / total;
		    }
		    par.push([
			inputs[i].value + "",
			temp
			]);
		}
		if ($i("i3GEOgraficointerativoAcumula").checked) {
		    maior = 0;
		}
	    } else {
		total = 0;
		for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
		    temp = [];
		    for (j = 0; j < ncolunas; j++) {
			temp.push(inputs[i + j].value);
		    }
		    par.push(temp);
		}
		cores = colunas[2];
	    }

	    for (j = 0; j < ncolunas; j++) {
		metadados.push({
		    "colIndex" : j,
		    "colType" : tipoColuna,
		    "colName" : colunas[1][j]
		});
		tipoColuna = "Numeric";
	    }
	    dados = {
		    "resultset" : par,
		    "metadata" : metadados
	    };
	    return {
		"dados": dados,
		"cores": cores,
		"menor": menor,
		"maior": maior
	    };
	},
	/**
	 * Function: excluilinha
	 *
	 * Exclui uma linha da tabela de dados
	 */
	excluilinha : function(celula) {
	    var p = celula.parentNode.parentNode;
	    do {
		p.removeChild(p.childNodes[0]);
	    } while (p.childNodes.length > 0);
	    p.parentNode.removeChild(p);
	},
	/**
	 * Function: corj
	 *
	 * Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	 */
	corj : function(obj) {
	    i3GEO.util.abreCor("", obj, "hex");
	},
	/**
	 * Function: ordenaColuna
	 *
	 * Ordena uma coluna da tabela
	 */
	ordenaColuna : function(cid) {
	    var tabela = $i("i3GEOgraficointerativoDados").getElementsByTagName("table")[0], trs, ntrs = 0, psort = [], t = 0, ins =
		"", p = 0, e, temp, chaves = [], numero = false;

	    trs = tabela.getElementsByTagName("tr");
	    ntrs = trs.length;

	    function sortNumber(a, b) {
		return a.split("@$")[0]*1 - b.split("@$")[0]*1;;
	    }
	    for (t = 1; t < ntrs; t++) {
		temp = trs[t].getElementsByTagName("input");
		if (temp) {
		    psort.push(temp[cid].value + "@$" + t);
		    if (temp[cid].value * 1) {
			numero = true;
		    }
		}
	    }
	    // recosntroi a tabela
	    if (numero === true) {
		psort = psort.sort(sortNumber);
	    } else {
		psort = psort.sort();
	    }
	    ins = "<tr>" + trs[0].innerHTML + "</tr>";
	    ntrs = psort.length;
	    for (p = 0; p < ntrs; p++) {
		e = psort[p].split("@$")[1]*1;
		if (trs[e] !== undefined) {
		    ins += "<tr>" + trs[e].innerHTML + "</tr>";
		}
	    }
	    tabela.innerHTML = ins;
	},
	configDefault : function(dados, maior, cores, legendaY, legendaX) {
	    var temp, config = {
		    canvas : "i3GEOgraficointerativoguia4objCanvas",
		    height : $i("i3GEOgraficointerativoH").value*1,
		    width : $i("i3GEOgraficointerativoW").value*1,
		    orthoAxisTitle : legendaY,
		    valuesFont : 'normal 9px sans-serif ',
		    baseAxisTitle : legendaX,
		    baseAxisTitleAlign : 'center',
		    tooltipEnabled : true,
		    tooltipArrowVisible : true,
		    tooltipFade : false,
		    tooltipFollowMouse : false,
		    tooltipFormat : function(scene) {
			var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
			return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
		    },
		    clickAction : function(scene) {
			var funcao1 = function(){
			    var filtro,coluna = $i("i3GEOgraficointerativoComboXid").value,
			    val = scene.atoms.category.value;
			    if (val*1){
				filtro = "(["+coluna+"] = "+val+")";
			    }
			    else{
				filtro = "(|["+coluna+"]| = |"+i3GEO.util.trim(val)+"|)";
			    }
			    i3GEOF.graficointerativo.filtraCamada(filtro);
			};
			var funcao2 = function(){
			    var filtro,coluna = scene.datum.atoms['series'].value,
			    val = scene.datum.atoms['value'].value;
			    if (val*1){
				filtro = "(["+coluna+"] < "+val+")";
			    }
			    else{
				filtro = "(|["+coluna+"]| < |"+i3GEO.util.trim(val)+"|)";
			    }
			    i3GEOF.graficointerativo.filtraCamada(filtro);
			};
			i3GEO.janela.confirma("Filtra a camada?",350,"Com base em X","Menor que Y",funcao1,funcao2);
		    },
		    baseAxisTitleFont : '9px sans-serif',
		    yAxisTickFormatter : function(valor) {
			valor = valor + "";
			return $.number(valor,3,$trad("dec"),$trad("mil"));
		    },
		    valueFormat : function(valor) {
			valor = valor + "";
			return $.number(valor,3,$trad("dec"),$trad("mil"));
		    },
		    valuesAnchor : 'top',
		    valuesVisible : false,
		    orthoAxisOriginIsZero : false,
		    titleAlign : 'center',
		    titleFont : 'bold 14px sans-serif',
		    baseAxisTitleFont : '12px sans-serif',
		    orthoAxisTitleFont : '12px sans-serif',
		    titlePosition : "top",
		    orientation : 'vertical',
		    baseAxisTicks : true,
		    stacked : false,
		    animate : true,
		    hoverable : false,
		    axisGrid : true,
		    contentMargins : 5,
		    axisOffset : 0.02,
		    panelSizeRatio : 0.8,
		    orthoAxisLabelSpacingMin : 2,
		    selectable : false,
		    clickable : true,
		    extensionPoints : {
			continuousAxisTicks_strokeStyle : 'gray',
			axisGrid_strokeStyle : 'white',
			xAxisLabel_textStyle : 'black',
			yAxisLabel_textStyle : 'black',
			label_textBaseline : "bottom",
			xAxisLabel_font : 'normal 10px sans-serif'
		    }
	    };
	    if (maior > 0) {
		config.orthoAxisFixedMax = maior;
	    }
	    if ($i("i3GEOgraficointerativoTitulo").value != "") {
		config.title = $i("i3GEOgraficointerativoTitulo").value;
	    }
	    if ($i("i3GEOgraficointerativoTituloX").value != "") {
		config.baseAxisTitle = $i("i3GEOgraficointerativoTituloX").value;
	    }
	    if ($i("i3GEOgraficointerativoTituloY").value != "") {
		config.orthoAxisTitle = $i("i3GEOgraficointerativoTituloY").value;
	    }
	    temp = $i("i3GEOgraficointerativoFatorTamanho");
	    if (temp && temp.value > 0 && dados.resultset) {
		config.width = dados.resultset.length * temp.value;
	    } else {

	    }
	    return config;
	},
	barras : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
	    var ct = true, sr = false, config = i3GEOF.graficointerativo.configDefault(dados, maior, cores, legendaY, legendaX);
	    if (tipo === "horizontal") {
		config.orientation = 'horizontal';
	    }
	    if (xInclinado == true) {
		config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
		config.extensionPoints.xAxisLabel_textBaseline = 'top';
		config.extensionPoints.xAxisLabel_textAlign = 'right';
	    }
	    config.colors = cores;
	    if (cores != "") {
		config.extensionPoints.bar_fillStyle = function(d) {
		    return config.colors[this.index];
		};
	    }
	    new pvc.BarChart(config).setData(dados, {
		crosstabMode : ct,
		seriesInRows : sr
	    }).render();
	},
	linhas : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
	    var ct = false, sr = false, config = i3GEOF.graficointerativo.configDefault(dados, maior, cores, legendaY, legendaX);
	    if (xInclinado == true) {
		config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
		config.extensionPoints.xAxisLabel_textBaseline = 'top';
		config.extensionPoints.xAxisLabel_textAlign = 'right';
	    }
	    config.dotsVisible = true;
	    new pvc.LineChart(config).setData(dados, {
		crosstabMode : ct,
		seriesInRows : sr
	    }).render();
	},
	areas : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
	    var ct = false, sr = false, config = i3GEOF.graficointerativo.configDefault(dados, maior, cores, legendaY, legendaX);
	    if (xInclinado == true) {
		config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
		config.extensionPoints.xAxisLabel_textBaseline = 'top';
		config.extensionPoints.xAxisLabel_textAlign = 'right';
	    }
	    config.dotsVisible = true;
	    config.areasVisible = true;

	    new pvc.LineChart(config).setData(dados, {
		crosstabMode : ct,
		seriesInRows : sr
	    }).render();
	},
	arvores : function(dados, maior, cores, legendaY, legendaX, tipo) {
	    config = {
		    canvas : "i3GEOgraficointerativoguia4objCanvas",
		    title : legendaY,
		    titleFont : 'italic 14px sans-serif',
		    selectable : true,
		    hoverable : true,
		    legend : false,
		    tooltipEnabled : true,
		    legendPosition : 'right',
		    rootCategoryLabel : legendaX,
		    tooltipFormat : function(scene) {
			var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms.size.value;
			return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
		    }
	    };
	    //
	    //pega os parametros de graficos que fazem composicao com este
	    //
	    dados = i3GEOF.graficointerativo.composicao.incluiDados(dados);
	    config = i3GEOF.graficointerativo.composicao.incluiConfig(config);

	    if (cores != "") {
		config.colors = cores;
	    }

	    new pvc.TreemapChart(config).setData(dados, {
		crosstabMode : false
	    }).render();
	},
	pizzas : function(dados, maior, cores, legendaY, legendaX, tipo) {
	    config = i3GEOF.graficointerativo.configDefault(dados, maior, cores, legendaY, legendaX);
	    var config = {
		    canvas : "i3GEOgraficointerativoguia4objCanvas",
		    animate : true,
		    selectable : true,
		    hoverable : true,
		    valuesVisible : true,
		    valuesLabelStyle : 'inside',
		    valuesMask : "{category}",
		    tooltipFormat : function(scene) {
			var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
			return "<span style=color:yellow >" + cat + "</span><br>" + $.number(val,3,$trad("dec"),$trad("mil"));
		    },
		    extensionPoints : {
			slice_strokeStyle : 'white'
		    }
	    };
	    if (cores != "") {
		config.colors = cores;
	    }

	    new pvc.PieChart(config).setData(dados, {
		crosstabMode : false
	    }).render();
	},
	pontos : function(dados, maior, cores, legendaY, legendaX, tipo) {
	    config = i3GEOF.graficointerativo.configDefault(dados, maior, cores, legendaY, legendaX);
	    var config = {
		    canvas : "i3GEOgraficointerativoguia4objCanvas",
		    animate : true,
		    selectable : true,
		    hoverable : true,
		    valuesVisible : false,
		    orthoAxisTitle : legendaY,
		    valuesFont : 'normal 9px sans-serif ',
		    baseAxisTitle : legendaX,
		    yAxisTickFormatter : function(valor) {
			valor = valor + "";
			return $.number(valor,3,$trad("dec"),$trad("mil"));
		    },
		    valueFormat : function(valor) {
			valor = valor + "";
			return $.number(valor,3,$trad("dec"),$trad("mil"));
		    },
		    tooltipFormat : function(scene) {
			var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
			return "<span style=color:yellow >X: " + cat + "</span><br>Y: " + $.number(val,3,$trad("dec"),$trad("mil"));
		    }
	    };
	    if (cores != "") {
		config.colors = cores;
	    }

	    new pvc.DotChart(config).setData(dados, {
		crosstabMode : false
	    }).render();
	},
	filtraCamada: function(filtro){
	    i3GEOF.graficointerativo.get({
		snackbar: true,
		fn: false,
		btn: false,
		par: {
		    tema: i3GEOF.graficointerativo._parameters.tema,
		    funcao: "inserefiltro",
		    filtro: i3GEO.util.base64encode(filtro)
		},
		refresh: true
	    });
	},
	limparFiltros: function(){
	    i3GEOF.graficointerativo.get({
		snackbar: true,
		fn: false,
		btn: false,
		par: {
		    tema: i3GEOF.graficointerativo._parameters.tema,
		    funcao: "inserefiltro",
		    filtro: ""
		},
		refresh: true
	    });
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
	    par.tema = p.tema;
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
			    i3GEO.Interface.atualizaTema("", i3GEOF.graficointerativo._parameters.tema);
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
