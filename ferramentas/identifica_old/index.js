if (typeof (i3GEOF) === 'undefined') {
    var i3GEOF = {};
}
/*
 * Classe: i3GEOF.identifica
 *
 */
//TODO na listagem de atributos, incluir opcao para abrir os valores das variaveis associadas a uma regiao, quando codigo_tipo_regiao for
//diferente de null
i3GEOF.identifica =
{
	resolution: 8,
	/**
	 * Array com os ids das janelas ja criadas
	 */
	janelas : [],
	propJanelas : {},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	MUSTACHESISTEMAS: "",
	MUSTACHEDADOS: "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(idjanela) {
	    var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.identifica.dicionario);
	    dicionario["idjanela"] = idjanela;
	    dicionario["locaplic"] = i3GEO.configura.locaplic;
	    dicionario["resolution"] = i3GEOF.identifica.resolution;
	    return dicionario;
	},
	/*
	 * Propriedade: mostraLinkGeohack
	 *
	 * Mostra ou n&atilde;o o link para abrir o site GeoHack.
	 *
	 * Este site permite o uso de v&aacute;rios buscadores dispon&iacute;veis na internet.
	 *
	 * Type: {boolean}
	 */
	mostraLinkGeohack : true,
	/*
	 * Propriedade: mostraSistemasAdicionais
	 *
	 * Mostra ou n&atilde;o a lista de sistemas adicionais de busca de dados.
	 *
	 * Type: {boolean}
	 */
	mostraSistemasAdicionais : true,
	/*
	 * Variavel: tema
	 *
	 * C&oacute;digo do tema que ser&aacute; pesquisado
	 *
	 * Type: {String}
	 */
	tema : "",
	/*
	 * Variavel: x
	 *
	 * Coordenada x
	 *
	 * Type: {Numeric}
	 */
	x : 0,
	/*
	 * Variavel: y
	 *
	 * Coordenada y
	 *
	 * Type: {Numeric}
	 */
	y : 0,
	/*
	 * Variavel: sistemasAdicionais
	 *
	 * Guarda a lista de sistemas adicionais que s&atilde;o inclu&iacute;dos na sele&ccedil;&atilde;o de temas
	 *
	 * Type: {Array}
	 */
	sistemasAdicionais : [],
	/*
	 * Variavel: dadosIdentifica
	 *
	 * Guarda os dados obtidos com a chamada em AJAX de identifica&ccedil;&atilde;o
	 *
	 * Type: {Array}
	 */
	dadosIdentifica : [],

	/*
	 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	 */
	criaJanelaFlutuante : function(x, y) {
	    i3GEOF.identifica.iniciaDicionario(x, y);
	},
	/*
	 * Function: iniciaDicionario
	 *
	 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
	 *
	 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	 */
	iniciaDicionario : function(x, y, id) {
	    if (typeof (i3GEOF.identifica.dicionario) === 'undefined') {
		if (x) {
		    i3GEO.util.scriptTag(
			    i3GEO.configura.locaplic + "/ferramentas/identifica/dicionario.js",
			    "i3GEOF.identifica.iniciaJanelaFlutuante(" + x + "," + y + ")",
		    "i3GEOF.identifica.dicionario_script");
		} else {
		    i3GEO.util.scriptTag(
			    i3GEO.configura.locaplic + "/ferramentas/identifica/dicionario.js",
			    "i3GEOF.identifica.iniciaJanelaFlutuante()",
		    "i3GEOF.identifica.dicionario_script");
		}
	    } else {
		if (x) {
		    i3GEOF.identifica.iniciaJanelaFlutuante(x, y);
		} else {
		    i3GEOF.identifica.iniciaJanelaFlutuante();
		}
	    }
	},
	/*
	 * Function: inicia
	 *
	 * Inicia a janela de informa&ccedil;&otilde;es
	 *
	 * Parameters:
	 *
	 * tema {String} - c&oacute;digo do tema, existente no mapfile armazenado na se&ccedil;&atilde;o, que ser&aacute; consultado
	 * j&aacute; na inicializa&ccedil;&atilde;o
	 *
	 * x {Numeric} - coordenada x do ponto que ser&aacute; utilizado para busca dos atributos
	 *
	 * y {Numeric} - coordenada y do ponto
	 *
	 * iddiv {String} - id do elemento html onde o conte&uacute;do da ferramenta ser&aacute; incluido
	 *
	 * mostraLinkGeohack {boolean} - mostra ou n&atilde;o o link para o site geohacks
	 *
	 * mostraSistemasAdicionais {boolean} - mostra ou n&atilde;o os sistemas adicionais de busca de dados
	 *
	 * idjanela {string}
	 */
	inicia : function(tema, x, y, iddiv, mostraLinkGeohack, mostraSistemasAdicionais, idjanela) {
	    if(i3GEOF.identifica.MUSTACHE == ""){
		var t1 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_mst.html",
		t2 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_sistemas_mst.html",
		t3 = i3GEO.configura.locaplic + "/ferramentas/identifica/template_dados_mst.html";

		$.when( $.get(t1),$.get(t2),$.get(t3) ).done(function(r1,r2,r3) {
		    i3GEOF.identifica.MUSTACHE = r1[0];
		    i3GEOF.identifica.MUSTACHESISTEMAS = r2[0];
		    i3GEOF.identifica.MUSTACHEDADOS = r3[0];
		    i3GEOF.identifica.inicia(tema, x, y, iddiv, mostraLinkGeohack, mostraSistemasAdicionais, idjanela);
		}).fail(function() {
		    i3GEO.janela.closeMsg($trad("erroTpl"));
		    return;
		});
		return;
	    }
	    var b, onButtonClick = function(evt) {
		var botao = evt.target;
		if (botao) {
		    if (botao.value != "") {
			i3GEO.mapa.ativaTema(botao.value);
			i3GEOF.identifica.propJanelas[idjanela].tema = botao.value;
			i3GEOF.identifica.propJanelas[idjanela].temaAtivo = botao.value;

			var temp = i3GEO.arvoreDeCamadas.pegaTema(botao.value);
			if (temp.identifica.toLowerCase() !== "nao") {
			    i3GEOF.identifica.buscaDadosTema(botao.value, i3GEOF.identifica.propJanelas[idjanela].x, i3GEOF.identifica.propJanelas[idjanela].y, idjanela);
			}
		    }
		}
	    };
	    try {
		$i(iddiv).innerHTML = i3GEOF.identifica.html(idjanela);
		if (!$i(idjanela + "i3GEOFidentificaComboCabecaSel")) {
		    i3GEO.janela.comboCabecalhoTemasBs(
			    idjanela + "i3GEOFidentificaComboCabeca",
			    idjanela + "i3GEOFidentificaComboCabecaSel",
			    "identifica",
			    "ligados",
			    onButtonClick);
		}
		i3GEOF.identifica.propJanelas[idjanela].tema = tema;
		i3GEOF.identifica.propJanelas[idjanela].temaAtivo = tema;
		i3GEOF.identifica.propJanelas[idjanela].x = x;
		i3GEOF.identifica.propJanelas[idjanela].y = y;
		i3GEOF.identifica.propJanelas[idjanela].marca = false;
		i3GEOF.identifica.mostraLinkGeohack = mostraLinkGeohack;
		i3GEOF.identifica.mostraSistemasAdicionais = mostraSistemasAdicionais;
		// se o usu&aacute;rio for editor, for&ccedil;a mostrar a lista
		// de sistemas
		if (i3GEO.parametros.editor.toLowerCase() == "sim") {
		    i3GEOF.identifica.mostraSistemasAdicionais == true;
		}
		i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOidentificaguia1", idjanela + "i3GEOidentificaguia");
		// eventos das guias
		$i(idjanela + "i3GEOidentificaguia1").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOidentificaguia1", idjanela + "i3GEOidentificaguia");
		    if (i3GEO.identifica.propJanelas[idjanela].temaAtivo === "") {
			$i(idjanela + "i3GEOidentificaguia1obj").innerHTML = $trad('selecionaTema', i3GEOF.identifica.dicionario);
		    }
		};
		$i(idjanela + "i3GEOidentificaguia3").onclick = function() {
		    i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOidentificaguia3", idjanela + "i3GEOidentificaguia");
		};
		$i(idjanela + "i3GEOidentificaguia5").onclick =
		    function() {
		    i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOidentificaguia5", idjanela + "i3GEOidentificaguia");
		    var ins = "",
		    gh = i3GEO.coordenadas.geohash.encodeGeoHash(i3GEOF.identifica.propJanelas[idjanela].y,i3GEOF.identifica.propJanelas[idjanela].x);

		    ins += "<h5>X: " + i3GEOF.identifica.propJanelas[idjanela].x + " Y: " + i3GEOF.identifica.propJanelas[idjanela].y + "</h5>";
		    ins += "<h5>Geohash: <a href='http://geohash.org/" + gh + "' target=_blank >" + gh + "</a></h5>";
		    $i(idjanela + "i3GEOidentificacoord").innerHTML = ins;
		};
		//
		// verifica se existem sistemas para identificar
		//
		i3GEOF.identifica.atualizaSistemas();
		if (i3GEOF.identifica.propJanelas[idjanela].temaAtivo !== "") {
		    // verifica se o tema ativo pode ser identificado
		    var temp = i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.identifica.propJanelas[idjanela].temaAtivo);
		    if (temp.identifica.toLowerCase() !== "nao") {
			i3GEOF.identifica.buscaDadosTema(i3GEOF.identifica.propJanelas[idjanela].temaAtivo, "", "", idjanela);
		    }
		}
	    } catch (erro) {
	    }
	},
	buffer: function(idjanela){
	    var js = i3GEO.configura.locaplic + "/ferramentas/bufferpt/dependencias.php";
	    i3GEO.util.scriptTag(
		    js,
		    "i3GEOF.bufferpt.iniciaJanelaFlutuante(" + i3GEOF.identifica.propJanelas[idjanela].x
		    + ","
		    + i3GEOF.identifica.propJanelas[idjanela].y
		    + ")",
		    "i3GEOF.bufferpt_script"
	    );
	},
	atualizaSistemas : function() {
	    if (i3GEOF.identifica.mostraSistemasAdicionais === true) {
		if (i3GEOF.identifica.sistemasAdicionais.length == 0) {
		    var p =
			i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?funcao=pegaSistemasIdentificacao&g_sid="
			+ i3GEO.configura.sid;
		    cpJSON.call(p, "foo", i3GEOF.identifica.montaListaSistemas);
		} else {
		    i3GEOF.identifica.montaListaSistemas("");
		}
	    }
	},
	/*
	 * Function: iniciaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function(x, y) {
	    var minimiza, cabecalho, duplica, janela, divid, temp, titulo, id = "ident" + parseInt(Math.random() * 1000000, 10);
	    i3GEOF.identifica.janelas.push(id);
	    i3GEOF.identifica.propJanelas[id] = {};
	    if (x) {
		objposicaocursor.ddx = x;
		objposicaocursor.ddy = y;
		i3GEOF.identifica.propJanelas[id].x = x;
		i3GEOF.identifica.propJanelas[id].y = y;
		i3GEOF.identifica.propJanelas[id].marca = false;
		i3GEOF.identifica.x = x;
		i3GEOF.identifica.y = y;
	    }
	    // funcao que sera executada ao ser clicado no cabe&ccedil;alho da
	    // janela
	    cabecalho = function() {
		i3GEOF.identifica.ativaFoco(id);
	    };
	    minimiza = function() {
		i3GEO.janela.minimiza(id);
	    };
	    duplica = function() {
		i3GEOF.identifica.iniciaJanelaFlutuante(i3GEOF.identifica.propJanelas[id].x, i3GEOF.identifica.propJanelas[id].y);
	    };
	    // cria a janela flutuante
	    titulo = "<span class='i3GeoTituloJanelaBsNolink' >"+$trad("d7t")+"</span></div>";

	    janela =
		i3GEO.janela.cria(
			"470px",
			"270px",
			"",
			"",
			"",
			titulo,
			id,
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic + "/imagens/oxygen/16x16/telepathy-kde.png",
			duplica,
			"",
			"",
			"70"
		);
	    divid = janela[2].id;
	    if (i3GEOF.identifica.janelas.length > 1) {
		temp = janela[0].cfg.config;
		janela[0].moveTo(
			temp.x.value + (i3GEOF.identifica.janelas.length * 50),
			temp.y.value + (i3GEOF.identifica.janelas.length * 15));
	    }
	    i3GEOF.identifica.inicia(i3GEO.temaAtivo, objposicaocursor.ddx, objposicaocursor.ddy, divid, true, true, id);
	    janela[2].style.backgroundColor = "white";

	    i3GEOF.identifica.propJanelas[id].aguarde = $i(id + "_imagemCabecalho").style;
	    i3GEOF.identifica.propJanelas[id].atualiza = true;
	    temp = 'i3GEOF.identifica.propJanelas["' + id + '"].atualiza = this.checked';
	    janela[0]
	    .setFooter("<div class='checkbox text-left'><label><input checked id='{{{idjanela}}}i3GEOtabelatipolista' type='checkbox' onclick='" + temp + "'><span class='checkbox-material noprint'><span class='check'></span></span> " + $trad('atualizaJanela', i3GEOF.identifica.dicionario) + "</label></div>");

	    temp = function() {
		i3GEOF.identifica.limpaMarca(id);
		i3GEOF.identifica.janelas.remove(id);
		i3GEOF.identifica.propJanelas[id] = null;
		if (i3GEOF.identifica.janelas.length === 0) {
		    i3GEO.eventos.removeEventos("MOUSECLIQUE", ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
		    i3GEO.eventos.removeEventos("MOUSECLIQUEPERM", ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
		    i3GEO.eventos.adicionaEventos("MOUSECLIQUEPERM", ["i3GEO.mapa.dialogo.verificaTipDefault()"]);
		    // reativa o evento default
		    i3GEO.eventos.cliquePerm.ativa();
		}
	    };
	    YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	limpaMarca : function(id) {
	    i3GEO.desenho.removePins(id);
	    i3GEOF.identifica.propJanelas[id].marca = false;
	},
	/*
	 * Function: ativaFoco
	 *
	 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	 */
	ativaFoco : function(id) {

	},
	mostraImagemPonto : function(id) {
	    if (i3GEO.Interface.ATUAL === "googleearth") {
		return;
	    }
	    if (i3GEOF.identifica.propJanelas[id].marca === false) {
		i3GEOF.identifica.propJanelas[id].marca =
		    i3GEO.desenho.addPin(i3GEOF.identifica.propJanelas[id].x, i3GEOF.identifica.propJanelas[id].y, "", "", "", id);
	    } else {
		i3GEO.desenho.movePin(
			i3GEOF.identifica.propJanelas[id].marca,
			i3GEOF.identifica.propJanelas[id].x,
			i3GEOF.identifica.propJanelas[id].y);
	    }
	},
	/*
	 * Function: html
	 *
	 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
	 *
	 * Retorno:
	 *
	 * String com o c&oacute;digo html
	 */
	html : function(idjanela) {
	    var ins = Mustache.render(i3GEOF.identifica.MUSTACHE, i3GEOF.identifica.mustacheHash(idjanela));
	    return ins;
	},
	/*
	 * Abre a janela flutuante para controlar o processo de reposicionar um ponto. Ativada apenas quando o usuario puder editar um tema
	 */
	janelaMoverPonto : function(tema, idreg) {
	    if ($i("i3GEOF.movePonto_corpo")) {
		return;
	    }
	    var temp, titulo;
	    // cria a janela flutuante
	    titulo = "<div class='i3GeoTituloJanela'>" + $trad('move', i3GEOF.identifica.dicionario) + "</div>";
	    i3GEO.janela.cria("250px", "100px", "", "", "", titulo, "i3GEOF.movePonto", false, "hd", "", "");
	    $i("i3GEOF.movePonto_corpo").style.backgroundColor = "white";
	    i3GEO.eventos.removeEventos("MOUSECLIQUEPERM", ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
	    i3GEO.eventos.adicionaEventos("MOUSECLIQUE", [
		"i3GEOF.identifica.atualizaJanelaMoverPonto()"
		]);
	    temp = function() {
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE", ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
	    };
	    YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	    $i("i3GEOF.movePonto_corpo").innerHTML =
		"" + $trad('cliqueNovaPosicao', i3GEOF.identifica.dicionario)
		+ "<br><br><p class=paragrafo >X: </p>"
		+ "<div class='i3geoForm100 i3geoFormIconeEdita' ><input type=text id=i3GEOF.movePontoX /></div>"
		+ "<br><p class=paragrafo >Y: </p>"
		+ "<div class='i3geoForm100 i3geoFormIconeEdita' ><input type=text id=i3GEOF.movePontoY /></div>"
		+ "<input type=buttom value='"
		+ $trad('move', i3GEOF.identifica.dicionario)
		+ "' id=i3GEOF.moveAplica />"
		+ "<input type=hidden value='"
		+ tema
		+ "' id=i3GEOF.moveAplicaTema />";

	    new YAHOO.widget.Button(
		    "i3GEOF.moveAplica",
		    {
			onclick : {
			    fn : function() {
				var x = $i("i3GEOF.movePontoX").value, y = $i("i3GEOF.movePontoY").value, tema =
				    $i("i3GEOF.moveAplicaTema").value, p =
					i3GEO.configura.locaplic + "/ferramentas/editortema/exec.php?funcao=atualizageometria&g_sid="
					+ i3GEO.configura.sid, temp = function(retorno) {
				    i3GEO.janela.fechaAguarde("aguardeSalvaPonto");
				    i3GEO.Interface.atualizaTema("", tema);
				    i3GEOF.identifica.buscaDadosTema(tema, x, y);
				};
				i3GEO.janela.AGUARDEMODAL = true;
				i3GEO.janela.abreAguarde("aguardeSalvaPonto", "Adicionando...");
				i3GEO.janela.AGUARDEMODAL = false;
				cpJSON.call(p, "foo", temp, "&idunico=" + idreg + "&tema=" + tema + "&wkt=POINT(" + x + " " + y + ")");
			    }
			}
		    });
	},
	atualizaJanelaMoverPonto : function() {
	    if ($i("i3GEOF.movePontoX")) {
		$i("i3GEOF.movePontoX").value = objposicaocursor.ddx;
		$i("i3GEOF.movePontoY").value = objposicaocursor.ddy;
	    } else {
		i3GEO.eventos.removeEventos("MOUSECLIQUE", [
		    "i3GEOF.identifica.atualizaJanelaMoverPonto()"
		    ]);
	    }
	},
	/*
	 * Function: montaLinkGeohack
	 *
	 * Monta o link para o site geohack
	 *
	 * Return:
	 *
	 * {String}
	 */
	montaLinkGeohack : function() {
	    return "<a href='#' onclick='i3GEOF.identifica.abreLinkGeohack()' >Buscadores web</a><br>";
	},
	abreLinkGeohack : function() {
	    var b, x, y, w, s, param;
	    b = i3GEO.calculo.dd2dms(i3GEOF.identifica.x, i3GEOF.identifica.y);
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
	    var l, divins, ig, sistema, pub, exec, temp, t, linhas = [], ltema, i, idjanela, n = i3GEOF.identifica.janelas.length;
	    if (retorno !== undefined ) {
		if (retorno.data && i3GEOF.identifica.sistemasAdicionais.length == 0) {
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
			    i3GEOF.identifica.sistemasAdicionais.push(sistema + "," + exec + "," + t);
			}
		    }
		}
		if (i3GEOF.identifica.sistemasAdicionais.length > 0) {
		    for (i = 0; i < n; i++) {
			idjanela = i3GEOF.identifica.janelas[i];
			divins = $i(idjanela + "i3GEOidentificalistaSistemas");
			linhas = [];
			if (divins) {
			    linhas.push({
				"idjanela": idjanela,
				"nome": "Mostra os dados de todos os temas do mapa",
				"click": "i3GEOF.identifica.buscaDadosTema('ligados','','','" + idjanela	+ "')"
			    });
			    for (l = 0; l < i3GEOF.identifica.sistemasAdicionais.length; l++) {
				ltema = i3GEOF.identifica.sistemasAdicionais[l].split(",");
				if (ltema.length > 1) {
				    linhas.push({
					"idjanela": idjanela,
					"nome": ltema[0],
					"click": "i3GEOF.identifica.mostraDadosSistema('" + ltema[1] + "','" + ltema[2] + "','" + idjanela + "')"
				    });
				}
			    }
			    temp = Mustache.render("{{#data}}" + i3GEOF.identifica.MUSTACHESISTEMAS + "{{/data}}", {"data":linhas});
			    divins.innerHTML = temp;
			}
		    }
		}
	    }
	},
	/*
	 * Function: buscaDadosTema
	 *
	 * Obt&eacute;m os dados de um tema para o ponto de coordenadas clicado no mapa
	 *
	 * Veja:
	 *
	 * <i3GEO.php.identifica3>
	 */
	buscaDadosTema : function(tema, x, y, idjanela) {
	    var res, opcao, resolucao, janelas, n, i, id;
	    if (tema != "" && i3GEO.temaAtivo === "") {
		i3GEO.temaAtivo = tema;
	    }
	    if (idjanela) {
		janelas = [
		    idjanela
		    ];
	    } else {
		janelas = i3GEOF.identifica.janelas;
	    }
	    // guarda o valor de x y nas variaveis de uso global da ferramenta
	    if (x && x != "") {
		i3GEOF.identifica.x = x;
		i3GEOF.identifica.y = y;
	    }
	    n = janelas.length;
	    if (n == 0 || (idjanela && !$i(idjanela + "i3GEOidentificaguia1obj"))) {
		if (x && x != "") {
		    i3GEOF.identifica.criaJanelaFlutuante(x, y);
		} else {
		    i3GEOF.identifica.criaJanelaFlutuante();
		}
		return;
	    }
	    try {
		if (tema === "ligados") {
		    opcao = "ligados";
		    tema = "";
		} else {
		    opcao = "tema";
		}
		for (i = 0; i < n; i++) {
		    id = janelas[i];
		    if (i3GEOF.identifica.propJanelas[id].atualiza == undefined || i3GEOF.identifica.propJanelas[id].atualiza === true) {
			if (x && x != "") {
			    i3GEOF.identifica.propJanelas[id].x = x;
			    i3GEOF.identifica.propJanelas[id].y = y;
			}
			if (tema != "" && idjanela) {
			    i3GEOF.identifica.propJanelas[id].temaAtivo = tema;
			}
			if ($i(id + "i3GEOidentificaguia1obj")) {
			    res = $i(id + "i3GEOidentificaresolucao");
			    if (res) {
				resolucao = res.value;
			    } else {
				resolucao = 5;
			    }
			    i3GEOF.identifica.buscaDadosTemaJanela(id, resolucao, opcao);
			}
		    }
		}
	    } catch (e) {
		if (!x) {
		    i3GEOF.identifica.criaJanelaFlutuante();
		} else {
		    i3GEOF.identifica.criaJanelaFlutuante(x, y);
		}
	    }
	},
	buscaDadosTemaJanela : function(idjanela, resolucao, opcao) {
	    i3GEOF.identifica.mostraImagemPonto(idjanela);
	    var f = function(retorno) {
		// i3GEOF.identifica.dadosIdentifica = retorno.data;
		if (retorno !== undefined) {
		    i3GEOF.identifica.mostraDadosTema(retorno.data, idjanela);
		} else {
		    i3GEOF.identifica.mostraDadosTema(undefined, idjanela);
		}
	    };
	    if(opcao == "ligados"){
		listaDeTemas = "";
	    } else {
		listaDeTemas = i3GEOF.identifica.propJanelas[idjanela].temaAtivo;
	    }
	    // importante: os temas editaveis nao utilizam alias em seus nomes
	    // se o usuario estiver logado
	    i3GEO.php.identifica3(
		    f,
		    i3GEOF.identifica.propJanelas[idjanela].x,
		    i3GEOF.identifica.propJanelas[idjanela].y,
		    resolucao,
		    opcao,
		    i3GEO.configura.locaplic,
		    i3GEO.configura.sid,
		    i3GEOF.identifica.propJanelas[idjanela].temaAtivo,
		    i3GEO.parametros.mapexten,
		    listaDeTemas,
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
	mostraDadosSistema : function(exec, target, idjanela) {
	    i3GEOF.identifica.mostraImagemPonto(idjanela);
	    exec += "&x=" + i3GEOF.identifica.propJanelas[idjanela].x + "&y=" + i3GEOF.identifica.propJanelas[idjanela].y;
	    if (target === "target") {
		window.open(exec);
	    } else {
		i3GEOF.identifica.abrejanelaIframe("500", "500", exec);
	    }
	    var i = $i("i3GEOmarcaIdentifica");
	    if (i) {
		i.style.display = "block";
	    }
	},
	/*
	 * Function abrejanelaIframe
	 *
	 * Abre uma janela flutuante contendo um iframe
	 *
	 * Parametros:
	 *
	 * w {string} - largura
	 *
	 * h {string} - altura
	 *
	 * s {string} - src do iframe
	 */
	abrejanelaIframe : function(w, h, s) {
	    var janelaeditor =
		i3GEO.janela.cria(w, h, s, parseInt(Math.random() * 100, 10), 10, "", "janela" + i3GEO.util.randomRGB(), false);
	    var temp = function() {
		i3GEOF.identifica.sistemasAdicionais = [];
		i3GEOF.identifica.atualizaSistemas();
	    };
	    YAHOO.util.Event.addListener(janelaeditor[0].close, "click", temp, janelaeditor[0].panel, {
		id : janelaeditor[0].id
	    }, true);
	},
	/**
	 * Aplica um estilo a um elemento de todas as janelas
	 */
	aplicaEstilo : function(posFixo, estilo, valor) {
	    var n = i3GEOF.identifica.janelas, i = 0, temp;
	    for (i = 0; i < n; i++) {
		temp = $i(i3GEOF.identifica.janelas[i]);
		if (temp) {
		    temp = $i(i3GEOF.identifica.janelas[i] + posFixo);
		    if (temp) {
			temp.style[estilo] = valor;
		    }
		}
	    }
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
	mostraDadosTema : function(retorno, idjanela) {
	    var classeTemp="",codigo_tipo_regiao = "",alvo, filtro, camada, idreg, idsalva, paramsalva, i, res = "", ntemas, resultados, nres, cor, j, nitens, k, atualN = "todas", inicio =
		0, numResultados = 0, tip, link, textovalor;

	    if ($i(idjanela + "i3GEOFidentificaNocorrencias")) {
		atualN = $i(idjanela + "i3GEOFidentificaNocorrencias").value;
	    }
	    i3GEOF.identifica.aplicaEstilo("_corpo", "scrollTop", 0);
	    if (retorno == undefined || retorno == "") {
		$i(idjanela + "i3GEOidentificaguia1obj").innerHTML = $trad('msgNadaEncontrado', i3GEOF.identifica.dicionario);
		return;
	    }
	    i = $i("i3GEOmarcaIdentifica");
	    if (i) {
		i.style.display = "block";
	    }
	    var lista = [];
	    if (retorno !== undefined) {
		$i(idjanela + "i3GEOidentificaguia1obj").innerHTML = "";
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
			    "idjanela": idjanela,
			    "codigo_tipo_regiao": codigo_tipo_regiao,
			    "classeCssRegiao": classeTemp,
			    "textoRemoveFiltro": $trad('removeFiltro', i3GEOF.identifica.dicionario),
			    "registros" : []
		    };
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
				coluna.idjanela = idjanela;
				coluna.filtraValor = $trad('filtraValor', i3GEOF.identifica.dicionario);
				coluna.tema = retorno[i].tema;

				// verifica se o texto possui tags de abertura e
				// fechamento html
				//try {
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
				//} catch (e) {
				//}

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
		if (ntemas == 1) {
		    res = i3GEOF.identifica.montaOpcoesIdentificaOcorrencia(atualN, numResultados) + res;
		}
		$i(idjanela + "i3GEOidentificaguia1obj").innerHTML = res;
		temp = Mustache.render("{{#data}}" + i3GEOF.identifica.MUSTACHEDADOS + "{{/data}}", {"data":lista});
		$i(idjanela + "i3GEOidentificaguia1obj").innerHTML = temp;

		i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOidentificaguia1", idjanela + "i3GEOidentificaguia");
	    }
	},
	filtrar : function(tema, item, valor, idjanela) {
	    if (i3GEOF.identifica.propJanelas[idjanela].aguarde.visibility === "visible") {
		return;
	    }
	    i3GEOF.identifica.propJanelas[idjanela].aguarde.visibility = "visible";
	    var filtro = "",
	    temp = function(retorno) {
		i3GEOF.identifica.propJanelas[idjanela].aguarde.visibility = "hidden";
		i3GEO.Interface.atualizaTema(retorno, tema);
	    },
	    p = i3GEO.configura.locaplic + "/ferramentas/filtro/exec.php?base64=sim&g_sid=" + i3GEO.configura.sid + "&funcao=inserefiltro",
	    cp = new cpaint();

	    filtro = "(*[" + item + "]* = *" + valor + "*)";
	    cp.set_response_type("JSON");
	    cp.set_transfer_mode('POST');
	    cp.call(p, "insereFiltro", temp, "tema=" + tema + "&filtro=" + i3GEO.util.base64encode(filtro));
	},
	removeFiltro : function(tema, idjanela) {
	    if (i3GEOF.identifica.propJanelas[idjanela].visibility === "visible") {
		return;
	    }
	    i3GEOF.identifica.propJanelas[idjanela].aguarde.visibility = "visible";
	    var temp = function(retorno) {
		i3GEOF.identifica.propJanelas[idjanela].aguarde.visibility = "hidden";
		i3GEO.Interface.atualizaTema(retorno, tema);
	    }, p =
		i3GEO.configura.locaplic + "/ferramentas/filtro/exec.php?base64=nao&g_sid=" + i3GEO.configura.sid + "&funcao=inserefiltro", cp =
		    new cpaint();
	    cp.set_response_type("JSON");
	    cp.set_transfer_mode('POST');
	    cp.call(p, "insereFiltro", temp, "tema=" + tema + "&filtro=");
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
	},
	montaOpcoesIdentificaOcorrencia : function(atual, nres) {
	    var ins, select, i, nocor;
	    if (!atual) {
		atual = "todas";
	    }
	    sel = "";
	    select =
		"<select id=i3GEOFidentificaNocorrencias onchange='i3GEOF.identifica.mostraDadosTema(i3GEOF.identifica.dadosIdentifica)'>";
	    if (atual == "todas") {
		sel = "SELECTED";
	    }
	    select += "<option value='todas' " + sel + " >" + $trad('todas', i3GEOF.identifica.dicionario) + "</option>";
	    nocor = nres + 1;
	    for (i = 1; i < nocor; i++) {
		sel = "";
		if (atual == i) {
		    sel = "SELECTED";
		}
		select += "<option value=" + i + " " + sel + " >" + i + "</option>";
	    }
	    select += "</select>";
	    ins = "<table><tr>";
	    ins += "<td>" + $trad('mostraOcorrencia', i3GEOF.identifica.dicionario) + ": </td>";
	    ins += "<td> " + select + "</td>";
	    ins += "</tr></table>";
	    if (nres == 1) {
		ins = "";
	    }
	    return ins;
	},
	listaVariaveis : function(codigo_tipo_regiao, idjanela) {
	    var p, temp;
	    temp = function(retorno) {
		var ins = "", n, i, m, j, d, dd, nc, ic, ndd, idd;
		n = retorno.length;

		if (n > 0) {
		    // cada variavel
		    for (i = 0; i < n; i++) {
			d = retorno[i];
			ins += "<b>" + d.variavel + "</b>";
			m = d.dados.length;
			// cada medida
			for (j = 0; j < m; j++) {
			    dd = d.dados[j];
			    // ins += " -> " + dd.medida;
			    nc = dd.dados.colunas.length;
			    ins += "<table class='lista4' ><tr>";
			    // cabecalho
			    for (ic = 0; ic < nc; ic++) {
				ins += "<td>" + dd.dados.aliascolunas[ic] + "</td>";
			    }
			    ins += "</tr>";
			    ndd = dd.dados.dados.length;
			    // cada valor
			    for (idd = 0; idd < ndd; idd++) {
				ins += "<tr>";
				for (ic = 0; ic < nc; ic++) {
				    ins += "<td>" + dd.dados.dados[idd][dd.dados.colunas[ic]] + "</td>";
				}
				ins += "</tr>";
			    }
			    ins += "</table>";
			}
		    }
		}
		i3GEO.janela.mensagemSimples("<div style='overflow:auto;height:100%'>" + ins + "</div>", "");
	    };
	    p = i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=LISTATODOSATRIBUTOSMEDIDAVARIAVELXY", cpJSON.call(
		    p,
		    "foo",
		    temp,
		    "&codigo_tipo_regiao=" + codigo_tipo_regiao
		    + "&x="
		    + i3GEOF.identifica.propJanelas[idjanela].x
		    + "&y="
		    + i3GEOF.identifica.propJanelas[idjanela].y);
	}
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("identifica")){
  jQuery.each( i3GEO.configura.ferramentas.identifica, function(index, value) {
      i3GEOF.identifica[index] = i3GEO.configura.ferramentas.identifica[index];
  });
}
