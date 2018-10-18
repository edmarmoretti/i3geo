if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
i3GEOF.identifica = {
	resolution: 8,
	renderFunction: i3GEO.janela.formModal,
	/*
	 * Propriedade: mostraSistemasAdicionais
	 *
	 * Mostra ou n&atilde;o a lista de sistemas adicionais de busca de dados.
	 *
	 * Type: {boolean}
	 */
	mostraSistemasAdicionais : true,
	_sistemasAdicionais : [],
	_export: [],
	_parameters : {
	    "x": 0,
	    "y": 0,
	    "tema": "",
	    "mustache": "",
	    "mustachesistemas": "",
	    "mustachedados": "",
	    "marca": false,
	    "idContainer": "i3GEOidentificaguiasContainer"
	},
	/*
	 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	 */
	start : function({x, y, tema}) {
	    i3GEOF.identifica._parameters = {
		    ...i3GEOF.identifica._parameters,
		    "x": x,
		    "y": y,
		    "tema": tema
	    };
	    var p = i3GEOF.identifica._parameters;
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		var t1 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_mst.html",
		t2 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_sistemas_mst.html",
		t3 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_dados_mst.html";
		$.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
		    i3GEO.janela.fechaAguarde();
		    var p = i3GEOF.identifica._parameters;
		    p.mustache = r1[0];
		    p.mustachesistemas = r2[0];
		    p.mustachedados = r3[0];
		    i3GEOF.identifica.html();
		}).fail(function() {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.tempoMsg($trad("erroTpl"));
		});
	    } else {
		i3GEOF.identifica.html();
	    }
	},
	html : function() {
	    var p = i3GEOF.identifica._parameters;
	    var hash = i3GEO.idioma.objetoIdioma(i3GEOF.identifica.dicionario);
	    hash["locaplic"] = i3GEO.configura.locaplic;
	    hash["resolution"] = i3GEOF.identifica.resolution;
	    hash["namespace"] = "identifica";
	    hash["idContainer"] = p.idContainer;

	    i3GEOF.identifica.renderFunction.call(this,{texto: Mustache.render(p.mustache, hash)});

	    i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1", "i3GEOidentificaguia");

	    $i("i3GEOidentificaguia1").onclick = function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1", "i3GEOidentificaguia");
	    };
	    $i("i3GEOidentificaguia4").onclick = function() {
		i3GEO.util.copyToClipboard(i3GEOF.identifica._export.join("\n"));
	    }
	    $i("i3GEOidentificaguia5").onclick =
		function() {
		i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia5", "i3GEOidentificaguia");
		var ins = "<h5 class='copyToMemory' onclick='i3GEO.util.copyToClipboard(this.innerHTML);return false;'>X: " + p.x + " Y: " + p.y + "</h5>";
		$i("i3GEOidentificacoord").innerHTML = ins;
	    };
	    $i("i3GEOidentificaguia6").onclick = function() {
		var p = i3GEOF.identifica._parameters;
		var gh = i3GEO.coordenadas.geohash.encodeGeoHash(p.y,p.x);
		var linhas = [
		    {
			"nome": "GeoHack",
			"click": "i3GEOF.identifica.abreLinkGeohack()"
		    },{
			"nome": "GeoHash " + gh,
			"click": "window.open('http://geohash.org/" + gh +"')"
		    }
		    ];
		var ins = Mustache.render("{{#data}}" + p.mustachesistemas + "{{/data}}", {"data":linhas});
		$i("i3GEOidentificaSis").innerHTML = ins;
		i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia6", "i3GEOidentificaguia");
		if (i3GEOF.identifica.mostraSistemasAdicionais === true) {
		    i3GEO.janela.abreAguarde();
		    if (i3GEOF.identifica._sistemasAdicionais.length == 0) {
			var p =
			    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?funcao=pegaSistemasIdentificacao&g_sid="
			    + i3GEO.configura.sid;
			cpJSON.call(p, "foo", i3GEOF.identifica.montaListaSistemas);
		    } else {
			i3GEOF.identifica.montaListaSistemas("");
		    }
		}
	    };
	    //i3GEO.janela.applyScrollBar(p.idContainer);
	    i3GEOF.identifica.getData();
	},
	buffer: function(){
	    var js = i3GEO.configura.locaplic + "/ferramentas/bufferpt/dependencias.php";
	    i3GEO.util.scriptTag(
		    js,
		    "i3GEOF.bufferpt.iniciaJanelaFlutuante(" + i3GEOF.identifica._parameters.x
		    + ","
		    + i3GEOF.identifica._parameters.y
		    + ")",
		    "i3GEOF.bufferpt_script"
	    );
	},
	abreLinkGeohack : function() {
	    var b, x, y, w, s, param;
	    b = i3GEO.calculo.dd2dms(i3GEOF.identifica._parameters.x, i3GEOF.identifica._parameters.y);
	    x = b[0].split(" ");
	    y = b[1].split(" ");
	    w = "W";
	    s = "S";
	    if (x[0] * 1 > 0) {
		w = "L";
	    }
	    if (y[0] * 1 > 0) {
		s = "N";
	    }
	    if (x[0] * 1 < 0) {
		x[0] = x[0] * -1;
	    }
	    if (y[0] * 1 < 0) {
		y[0] = y[0] * -1;
	    }
	    param = y[0] + "_" + y[1] + "_" + y[2] + "_" + s + "_" + x[0] + "_" + x[1] + "_" + x[2] + "_" + w;
	    window.open("http://tools.wikimedia.de/~magnus/geo/geohack.php?params=" + param);
	},
	/*
	 * Function: montaListaSistemas
	 *
	 * Obt&eacute;m a lista de sistemas especiais de consulta.
	 *
	 * O resultado &eacute; inserido no div com id "listaSistemas".
	 *
	 * Cada sistema consiste em uma URL para a qual ser&atilde;o passados os parametros x e y.
	 *
	 */
	montaListaSistemas : function(retorno) {
	    i3GEO.janela.fechaAguarde();
	    var l, divins, ig, sistema, pub, exec, temp, t, linhas = [], ltema, i;
	    if (retorno !== undefined ) {
		if (retorno.data && i3GEOF.identifica._sistemasAdicionais.length == 0) {
		    sis = retorno.data;
		    for (ig = 0; ig < sis.length; ig++) {
			if (sis[ig].PUBLICADO && sis[ig].PUBLICADO.toLowerCase() == "sim" ) {
			    sistema = sis[ig].NOME;
			    exec = sis[ig].ABRIR;
			    temp = exec.split("?");
			    if (temp.length !== 2) {
				exec += "?";
			    }
			    t = "blank";
			    if (sis[ig].TARGET) {
				t = sis[ig].TARGET;
			    }
			    i3GEOF.identifica._sistemasAdicionais.push(sistema + "," + exec + "," + t);
			}
		    }
		}
		if (i3GEOF.identifica._sistemasAdicionais.length > 0) {
		    divins = $i("i3GEOidentificalistaSistemas");
		    linhas = [];
		    if (divins) {
			for (l = 0; l < i3GEOF.identifica._sistemasAdicionais.length; l++) {
			    ltema = i3GEOF.identifica._sistemasAdicionais[l].split(",");
			    if (ltema.length > 1) {
				linhas.push({
				    "nome": ltema[0],
				    "click": "i3GEOF.identifica.mostraDadosSistema('" + ltema[1] + "','" + ltema[2] + "')"
				});
			    }
			}
			temp = Mustache.render("{{#data}}" + i3GEOF.identifica._parameters.mustachesistemas + "{{/data}}", {"data":linhas});
			divins.innerHTML = temp;
		    }
		}
	    }
	},
	getData : function() {
	    i3GEO.janela.abreAguarde();
	    var p = i3GEOF.identifica._parameters;
	    var f = function(retorno) {
		i3GEO.janela.fechaAguarde();
		if(retorno){
		    i3GEOF.identifica.mostraDadosTema(retorno.data);
		}
	    };
	    // importante: os temas editaveis nao utilizam alias em seus nomes
	    // se o usuario estiver logado
	    i3GEO.php.identifica3(
		    f,
		    p.x,
		    p.y,
		    i3GEOF.identifica.resolution,
		    (p.tema != "" ? "tema" : "ligados"),
		    i3GEO.configura.locaplic,
		    i3GEO.configura.sid,
		    p.tema,
		    i3GEO.parametros.mapexten,
		    "",
	    "nao");
	},
	/*
	 * Function: mostraDadosSistema
	 *
	 * Obt&eacute;m os dados de um sistema para o ponto de coordenadas clicado no mapa
	 *
	 * Parametros:
	 *
	 * exec {String} - url que ser&aacute; aberta
	 *
	 * target {String} (depreciado) - _self|self| onde a url ser&aacute; aberta. Se for "self", ser&aacute; aberta na mesma janela, caso
	 * contr&aacute;rio, em uma nova p&aacute;gina do navegador
	 */
	mostraDadosSistema : function(exec, target) {
	    exec += "&x=" + i3GEOF.identifica._parameters.x + "&y=" + i3GEOF.identifica._parameters.y;
	    if (target === "target") {
		window.open(exec);
	    } else {
		i3GEOF.identifica.abrejanelaIframe("500", "500", exec);
	    }
	},
	abrejanelaIframe : function(w, h, s) {
	    i3GEO.janela.formModal();
	    i3GEO.janela.cria(
		    w,
		    h,
		    s,
		    parseInt(Math.random() * 100, 10),
		    10,
		    "",
		    "janela" + i3GEO.util.randomRGB(),
		    false
	    );
	},
	/*
	 * Function: mostraDadosTema
	 *
	 * Mostra os dados obtidos de um ou mais temas.
	 *
	 * Recebe o resultado em JSON da opera&ccedil;&atilde;o de consulta realizada pelo servidor e formata os dados para
	 * apresenta&ccedil;&atilde;o na tela.
	 *
	 * Parametros:
	 *
	 * retorno {JSON} - objeto JSON com os dados <i3GEO.php.identifica3>
	 */
	mostraDadosTema : function(retorno) {

	    var classeTemp="",codigo_tipo_regiao = "",alvo, filtro, camada, idreg, idsalva, paramsalva, i, res = "", ntemas, resultados, nres, cor, j, nitens, k, atualN = "todas", inicio =
		0, numResultados = 0, tip, link, textovalor;

	    if (retorno == undefined || retorno == "") {
		$i("i3GEOidentificaguia1obj").innerHTML = $trad('msgNadaEncontrado', i3GEOF.identifica.dicionario);
		return;
	    }
	    var lista = [];
	    if (retorno !== undefined) {
		ntemas = retorno.length;
		for (i = 0; i < ntemas; i++) {
		    // nome do tema e icone de remover filtro
		    // icone que mostra as medidas das variaveis vinculadas a uma regiao, se for o caso
		    if (retorno[i].codigo_tipo_regiao && retorno[i].codigo_tipo_regiao != "") {
			classeTemp = "";
			codigo_tipo_regiao = retorno[i].codigo_tipo_regiao;
		    } else {
			codigo_tipo_regiao = "";
			classeTemp = "hidden";
		    }
		    var dadosTema = {
			    "nome": retorno[i].nome,
			    "codigoTema": retorno[i].tema,
			    "codigo_tipo_regiao": codigo_tipo_regiao,
			    "classeCssRegiao": classeTemp,
			    "textoRemoveFiltro": $trad('removeFiltro', i3GEOF.identifica.dicionario),
			    "registros" : []
		    };
		    i3GEOF.identifica._export.push(retorno[i].nome);
		    resultados = retorno[i].resultado;

		    // encontrou algo
		    if (resultados[0] !== " ") {
			nres = resultados.length;
			numResultados = nres;
			if (atualN != "todas") {
			    nres = atualN * 1;
			    inicio = atualN * 1 - 1;
			}
			var registros = [];
			for (j = inicio; j < nres; j++) {
			    var linha = {};
			    nitens = resultados[j].length;
			    // pega o valor do item que e o id unico no sistema
			    // METAESTAT
			    idreg = "";
			    for (k = 0; k < nitens; k++) {
				if (resultados[j][k].item === retorno[i].colunaidunico) {
				    idreg = resultados[j][k].valor;
				}
			    }
			    linha.idreg = idreg;
			    linha.classeCssEditavel = "hidden";

			    // opcao para apagar e mover o registro
			    if (idreg != "" && retorno[i].editavel == "todos") {
				linha.classeCssEditavel = "";
				linha.tema = retorno[i].tema;
				linha.apagaRegistro = $trad('apagaRegistro', i3GEOF.identifica.dicionario);
				linha.move = $trad('move', i3GEOF.identifica.dicionario);
			    }
			    linha.colunas = [];

			    for (k = 0; k < nitens; k++) {

				tip = "&nbsp;&nbsp;";
				textovalor = resultados[j][k].valor;
				var coluna = {
					"tip": "",
					"textovalor": textovalor,
					"classeCssEditavel": "hidden"
				};
				// insere o input para edicao
				// se for uma regiao cadastrada, todos os campos
				// sao editaveis
				if (idreg != "" && (resultados[j][k].item === retorno[i].editavel || retorno[i].editavel == "todos")) {
				    coluna.classeCssEditavel = "";
				    if (retorno[i].tiposalva == "regiao") {
					retorno[i].id_medida_variavel = 0;
				    }
				    idsalva =
					"idsalva" + retorno[i].tema
					+ "_"
					+ idreg
					+ "_"
					+ resultados[j][k].item
					+ "_"
					+ retorno[i].tiposalva;
				    paramsalva =
					"\"" + retorno[i].tema
					+ "\","
					+ idreg
					+ ",\""
					+ resultados[j][k].item
					+ "\",\""
					+ retorno[i].tiposalva
					+ "\"";
				    coluna.idsalva = idsalva;
				    coluna.paramsalva = paramsalva;
				}
				coluna.etiquetaAtiva = $trad('etiquetaAtiva', i3GEOF.identifica.dicionario);
				if (resultados[j][k].tip && resultados[j][k].tip.toLowerCase() == "sim") {
				    coluna.classeCssTip = "";
				} else {
				    coluna.classeCssTip = "hidden";
				}
				coluna.item = resultados[j][k].item;
				coluna.valor = resultados[j][k].valor;
				coluna.filtraValor = $trad('filtraValor', i3GEOF.identifica.dicionario);
				coluna.tema = retorno[i].tema;

				// verifica se o texto possui tags de abertura e
				// fechamento html

				if (textovalor && (textovalor.search(">") >= 0 || textovalor.search("<") >= 0)) {
				    filtro = "";
				    coluna.classeCssFiltro = "hidden";
				}
				// o mesmo problema pode ocorrer em raster,
				// que possuem o nome da classe como valor
				if (resultados[j][k].alias.search(">") >= 0 || resultados[j][k].alias.search("<") >= 0) {
				    filtro = "";
				    coluna.classeCssFiltro = "hidden";
				}

				if (resultados[j][k].link === "") {
				    coluna.alias = resultados[j][k].alias;
				    coluna.textovalor = textovalor;
				    coluna.link = "";
				    coluna.classeCssLink = "hidden";
				} else {
				    try {
					link = eval(resultados[j][k].link);
				    } catch (e) {
					link = resultados[j][k].link;
				    }
				    if(resultados[j][k].idIframe){
					alvo = resultados[j][k].idIframe;
				    }
				    else{
					alvo = "_blank";
				    }
				    coluna.alias = resultados[j][k].alias;
				    coluna.link = link;
				    coluna.textovalor = textovalor;
				    coluna.alvo = alvo;
				    coluna.classeCssLink = "";
				}
				coluna.classeCssImg = "hidden";
				coluna.img = "";
				if (resultados[j][k].img !== "") {
				    coluna.classeCssImg = "";
				    coluna.img = resultados[j][k].img;
				}
				linha.colunas.push(coluna);
				i3GEOF.identifica._export.push(coluna.alias + ":" + coluna.textovalor);
			    }
			    registros.push(linha);
			}
			dadosTema.registros = registros;

		    } else {
			// verifica o tipo de tema
			camada = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo, "", "name");
			if (retorno[i].tiposalva == "regiao" && parseInt(camada.type, 10) == 0) {
			    // opcao para adicionar um ponto
			    res +=
				$trad('msgNadaEncontrado2', i3GEOF.identifica.dicionario) + "<br><a href='#' onclick='i3GEOF.identifica.adicionaPontoRegiao(\""
				+ idjanela
				+ "\")' >"
				+ $trad('adicionaPonto', i3GEOF.identifica.dicionario)
				+ "</a>";
			} else {
			    res += $trad('msgNadaEncontrado2', i3GEOF.identifica.dicionario);
			}
		    }
		    lista.push(dadosTema);
		}

		temp = Mustache.render("{{#data}}" + i3GEOF.identifica._parameters.mustachedados + "{{/data}}", {"data":lista});

		$i("i3GEOidentificaguia1obj").innerHTML = temp;

		i3GEO.guias.mostraGuiaFerramenta("i3GEOidentificaguia1", "i3GEOidentificaguia");
	    }
	},
	filtrar : function(tema, item, valor) {
	    i3GEO.janela.abreAguarde();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php",
		    {
			g_sid: i3GEO.configura.sid,
			base64: "sim",
			funcao: "inserefiltro",
			tema: tema,
			filtro: i3GEO.util.base64encode("(*[" + item + "]* = *" + valor + "*)")
		    }
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			i3GEO.Interface.atualizaTema(data, tema);
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	removeFiltro : function(tema) {
	    i3GEO.janela.abreAguarde();
	    $.get(
		    i3GEO.configura.locaplic+"/ferramentas/filtro/exec.php",
		    {
			g_sid: i3GEO.configura.sid,
			funcao: "inserefiltro",
			tema: tema,
			filtro: ""
		    }
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			i3GEO.Interface.atualizaTema(data, tema);
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	adicionaPontoRegiao : function(idjanela) {
	    var p = i3GEO.configura.locaplic + "/ferramentas/editortema/exec.php?funcao=adicionaGeometria&g_sid=" + i3GEO.configura.sid, tema =
		i3GEOF.identifica.propJanelas[idjanela].temaAtivo, temp = function(retorno) {
		i3GEO.janela.fechaAguarde("aguardeSalvaPonto");
		i3GEO.Interface.atualizaTema("", tema);
		i3GEOF.identifica.buscaDadosTema(tema);
	    };
	    i3GEO.janela.AGUARDEMODAL = true;
	    i3GEO.janela.abreAguarde("aguardeSalvaPonto", "Adicionando...");
	    i3GEO.janela.AGUARDEMODAL = false;
	    cpJSON.call(p, "foo", temp, "&tema=" + tema
		    + "&wkt=POINT("
		    + i3GEOF.identifica.propJanelas[idjanela].x
		    + " "
		    + i3GEOF.identifica.propJanelas[idjanela].y
		    + ")");
	},
	apagaRegiao : function(tema, idreg) {
	    var excluir =
		function() {
		var p =
		    i3GEO.configura.locaplic + "/ferramentas/editortema/exec.php?funcao=excluiRegistro&g_sid=" + i3GEO.configura.sid, temp =
			function() {
		    i3GEO.janela.fechaAguarde("aguardeRemovendo");
		    i3GEO.Interface.atualizaTema("", tema);
		    i3GEOF.identifica.buscaDadosTema(tema);
		};
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeRemovendo", "Excluindo...");
		i3GEO.janela.AGUARDEMODAL = false;
		cpJSON.call(p, "foo", temp, "&tema=" + tema + "&identificador=" + idreg);
	    };
	    i3GEO.janela.confirma(
		    $trad('removeRegistroBD', i3GEOF.identifica.dicionario),
		    "",
		    $trad('sim', i3GEOF.identifica.dicionario),
		    $trad('cancela', i3GEOF.identifica.dicionario),
		    excluir);
	},
	salvaDados : function(tema, idreg, coluna, tiposalva) {
	    var p = i3GEO.configura.locaplic + "/ferramentas/editortema/exec.php?funcao=salvaRegistro&g_sid=" + i3GEO.configura.sid, idvalor =
		$i("idsalva" + tema + "_" + idreg + "_" + coluna + "_" + tiposalva), temp = function(retorno) {
		i3GEO.janela.fechaAguarde("aguardeSalvaAtributos");
		i3GEO.Interface.atualizaTema("", i3GEOF.identifica.tema);
	    };

	    if (idvalor) {
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeSalvaAtributos", "Salvando...");
		i3GEO.janela.AGUARDEMODAL = false;
		cpJSON.call(p, "foo", temp, "&tema=" + tema + "&coluna=" + coluna + "&valor=" + idvalor.value + "&identificador=" + idreg);
	    } else {
		alert("ocorreu um erro");
	    }
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("identifica")){
    jQuery.each( i3GEO.configura.ferramentas.identifica, function(index, value) {
	i3GEOF.identifica[index] = i3GEO.configura.ferramentas.identifica[index];
    });
}
