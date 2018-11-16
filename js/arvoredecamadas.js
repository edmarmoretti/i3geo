/**
 * Title: &Aacute;rvore de camadas
 *
 * Monta a &aacute;rvore com os temas existentes no mapa atual. A &aacute;rvore
 * cont&eacute;m as op&ccedil;&otilde;es de ligar e desligar temas,
 * altera&ccedil;&atilde;o na ordem de desenho, links para acesso a
 * funcionalidades, etc.
 *
 * Por padr&atilde;o, a &aacute;rvore &eacute; inserida no elemento HTML da interface do mapa cujo ID for igual a listaTemas
 *
 * i3GEO.arvoreDeCamadas permite controlar quais as op&ccedil;&otilde;es que
 * ser&atilde;o mostradas na &aacute;rvore e seu comportamento em diferentes
 * situa&ccdil;&otilde;s.
 *
 * Alguns itens s&atilde;o inclu&iacute;dos caso sejam localizados na interface elementos html com os seguintes ID
 *
 * listaLayersBase - lista os layers de fundo na interface openLayers
 *
 * buscaRapida - formul&aacute;rio de busca de dados em camadas
 *
 * listaPropriedades - conjunto de atalhos para ferramentas que controlam algumas caracter&iacute;sticas do mapa (na vers&atilde;o 6 do i3Geo esses atalhos constam em outros lugares, sendo desnecess&aacute;rio manter essa lista ativa na &aacute;rvore)
 *
 *
 * Namespace:
 *
 * i3GEO.arvoreDeCamadas
 *
 * Exemplo:
 *
 * Para alterar as op&ccedil;&otilde;es da &aacute;rvore, modifique as
 * propriedades colocando um c&oacute;digo como o seguinte no javascript
 * utilizado na interface de mapa que estiver sendo utilizada
 *
 * i3GEO.arvoreDeCamadas.INCLUILFUNDO = false;
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_arvoredecamadas.js>
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.arvoreDeCamadas =
{
	//isso ainda e utilizado nas ferramentas
	FUNCOES : {
	    farolescala : true,
	    excluir : true,
	    sobe : true,
	    desce : true,
	    fonte : true,
	    zoomtema : true,
	    compartilhar : true,
	    opacidade : true,
	    mudanome : true,
	    procurar : true,
	    toponimia : true,
	    etiquetas : true,
	    filtrar : true,
	    tabela : true,
	    grafico : true,
	    editorlegenda : true,
	    destacar : true,
	    cortina : true,
	    sql : true,
	    comentar : true,
	    temporizador : true,
	    wms : true,
	    tme : true,
	    copia : true,
	    storymap: true,
	    animagif: true
	},
	/**
	 * Variavel: CAMADAS
	 *
	 * Objeto com a lista de camadas existentes no mapa. &Eacute; definido na inicializa&ccedil;&atilde;o ou no redesenho do mapa.
	 *
	 * Este objeto &eacute; constru&iacute;do nas opera&ccedil;&otilde;es em PHP de inicializa&ccedil;&atilde;o ou redesenho do mapa e
	 * lista todos os layers existentes no mapfile tempor&aacute;rio em uso.
	 *
	 * classesphp/classe_mapas.php
	 *
	 * parametrosTemas
	 *
	 * Tipo:
	 *
	 * {objeto}
	 */
	CAMADAS : "",
	FILTRO : "",
	CAMADASINDEXADAS : [], //CAMADAS indexadas pelo name
	config : {
	    "idOnde": "listaTemas", //onde a lista sera inserida
	    "aposIniciar": "", //funcao
	    "templateCamada": "templates/camada.html", //template mustache que monta a lista de camadas
	    "idListaFundo": "", //onde a lista de camadas de fundo sera inserida
	    "templateCamadaFundo": "templates/camadaFundo.html", //template para as camadas de fundo
	    "idListaLayersGr": "", //onde a lista de camadas do tipo layer grafico sera inserida
	    "templateCamadaGr": "templates/camadaGr.html", //template para as camadas do tipo layer grafico
	    "verificaAbrangencia": "" //verifica se a camada esta na abrangencia do mapa e insere essa string como uma classe CSS
	},
	carregaTemplates: function(){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.carregaTemplates()");

	    var t1 = i3GEO.arvoreDeCamadas.config.templateCamada,
	    t2 = i3GEO.arvoreDeCamadas.config.templateCamadaFundo,
	    t3 = i3GEO.arvoreDeCamadas.config.templateCamadaGr;

	    $.ajax(t1).always(function(r1) {
		i3GEO.template.camada = r1;
		if(r1.status){
		    i3GEO.template.camada = "";
		}
		$.ajax(t2).always(function(r2) {
		    i3GEO.template.camadaFundo = r2;
		    if(r2.status){
			i3GEO.template.camadaFundo = "";
		    }
		    $.ajax(t3).always(function(r3) {
			i3GEO.template.camadaGr = r3;
			if(r3.status){
			    i3GEO.template.camadaGr = "";
			}
			i3GEO.arvoreDeCamadas.inicia();
		    });
		});
	    });
	},
	inicia : function(config) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.inicia()");

	    if(config){
		$.each( config, function( i,v ) {
		    if(v != undefined){
			i3GEO.arvoreDeCamadas.config[i] = v;
		    }
		});
	    }
	    if(!i3GEO.template.camada || !i3GEO.template.camadaFundo){
		i3GEO.arvoreDeCamadas.carregaTemplates();
		return;
	    } else {
		config = i3GEO.arvoreDeCamadas.config;
		var novoel, temp;
		i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS);
		if (!$i(config.idOnde)) {
		    return;
		}
		if(config.verificaAbrangencia != ""){
		    i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEO.arvoreDeCamadas.verificaAbrangenciaTemas()"]);
		}
		if (config.aposIniciar !== "") {
		    if (jQuery.isFunction(config.aposIniciar)) {
			config.aposIniciar.call();
		    }
		}
	    }
	},
	adicionaLayersGr : function(){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.adicionaLayersGr()");

	    if (i3GEO.Interface.ATUAL != "openlayers") {
		return;
	    }
	    //i3GEO.desenho.layergrafico nao e retornado com getLayers
	    var temp = $i(i3GEO.arvoreDeCamadas.config.idListaLayersGr),
	    layers = i3geoOL.getLayersGr(), lista = [], camada = {};

	    if(temp){
		$.each( layers, function( i,layer ) {
		    var p = layer.getProperties();
		    camada = {...i3GEO.idioma.OBJETOIDIOMA};
		    camada.name = p.name;
		    camada.tema = p.title;
		    camada.locaplic = i3GEO.configura.locaplic;
		    //ligado ou desligado
		    if(layer.getVisible() == true ){
			camada.checked = "checked";
		    } else {
			camada.checked = "";
		    }
		    lista.push(camada);
		});
		var t = Mustache.render(
			"{{#data}}" + i3GEO.template.camadaGr + "{{/data}}",
			{"data":lista}
		);

		$(temp).html(t);
	    }
	},
	existeCamadaSel: function({msg = true}={}){
	    var sel = false;
	    $.each(i3GEO.arvoreDeCamadas.CAMADAS, function(i,v){
		sel = v.sel.toLowerCase() !== "sim" ? false : true;
	    });
	    if(msg == true && sel == false){
		i3GEO.janela.snackBar({content: $trad("nenhumaSel")});
	    }
	    return sel;
	},
	verifyFilter: function(camada,f) {
	    if(!f){
		f = i3GEO.arvoreDeCamadas.FILTRO;
	    }
	    if(f == ""){
		return true;
	    }
	    var mostra = true;
	    if (f === "desligados" && camada.status != 0 ) {
		mostra = false;
	    }
	    if (f === "ligados" && camada.status == 0) {
		mostra = false;
	    }
	    if (f === "selecionados" && camada.sel.toLowerCase() !== "sim") {
		mostra = false;
	    }
	    if (f === "download" && camada.download.toLowerCase() !== "sim") {
		mostra = false;
	    }
	    if (f === "wms" && camada.connectiontype * 1 !== 7) {
		mostra = false;
	    }
	    if (f === "raster" && camada.type * 1 !== 3) {
		mostra = false;
	    }
	    if (f === "toponimia" && camada.type * 1 !== 4) {
		mostra = false;
	    }
	    return mostra;
	},
	/**
	 * Function: atualiza
	 *
	 * Atualiza a &aacute;rvore de camadas.
	 *
	 * Antes de executar a atualiza&ccedil;&atilde;o, essa fun&ccedil;&atilde;o verifica se &eacute; necess&aacute;rio faz&ecirc;-lo. O
	 * objeto CAMADAS &eacute; comparado com o parametro "temas" para verificar se existem diferen&ccedil;as que justifiquem a
	 * atualiza&ccedil;&atilde;o.
	 *
	 * Parametros:
	 *
	 * {objeto} - Objeto com a lista de camadas e propriedades (veja CAMADAS). Se n&atilde;o existir, a &aacute;rvore &eacute;
	 * redesenhada
	 *
	 * {boolean} - for&ccedil;a a atualiza&ccedil;&atilde;o da &aacute;rvore, sem verificar automaticamente se a
	 * atualiza&ccedil;&atilde;o deve ou n&atilde;o ser feita
	 */
	atualiza : function(temas, forca) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.atualiza()");

	    if(i3GEO.template.camada == undefined || i3GEO.template.camada == false){
		if (typeof (console) !== 'undefined')
		    console.info("template da arvore de camadas nao carregado");

		return;
	    }

	    if (arguments.length === 0) {
		temas = i3GEO.arvoreDeCamadas.CAMADAS;
		i3GEO.arvoreDeCamadas.CAMADAS = "";
		forca = false;
	    }
	    var clone = [],
	    camada = {},
	    config = i3GEO.arvoreDeCamadas.config,
	    temp;
	    //
	    // essa verificacao &eacute; necessaria quando a arvore &eacute; criada
	    // fora dos padr&otilde;es normais
	    //
	    temp = $i(config.idOnde);
	    if (temp) {
		if (forca === true) {
		    temp.innerHTML = "";
		}
		if (temp.innerHTML !== "") {
		    if (i3GEO.arvoreDeCamadas.comparaTemas(temas, i3GEO.arvoreDeCamadas.CAMADAS)) {
			i3GEO.arvoreDeCamadas.CAMADAS = temas;
			return;
		    }
		}
	    }

	    if (typeof (console) !== 'undefined')
		console.info("Indexando CAMADAS e ARVOREDECAMADAS");


	    i3GEO.arvoreDeCamadas.CAMADAS = temas;
	    i3GEO.arvoreDeCamadas.CAMADASINDEXADAS = [];
	    $.each( i3GEO.arvoreDeCamadas.CAMADAS, function( i,tema ) {
		var mostra = true;
		i3GEO.pluginI3geo.aplicaPropriedades(tema);
		camada = {};
		camada.name = tema.name;
		camada.tema = tema.tema;
		//ligado ou desligado
		if(tema.status != 0){
		    camada.checked = "checked";
		} else {
		    camada.checked = "";
		}
		if(tema.sel && tema.sel.toLowerCase() === "sim"){
		    camada.classeCss = "camadaSelecionada";
		} else {
		    camada.classeCss = "";
		}
		//aplica o filtro
		if (temp && i3GEO.arvoreDeCamadas.FILTRO !== "") {
		    mostra = i3GEO.arvoreDeCamadas.verifyFilter(tema);
		}
		if(temp && mostra == true){
		    i3GEO.arvoreDeCamadas.montaIconesTema(tema,camada);
		    i3GEO.arvoreDeCamadas.montaOpcoesTema(tema,camada);
		    i3GEO.arvoreDeCamadas.montaParametrosTema(tema,camada);
		    //
		    // inclui icone do tema
		    //
		    if (tema.iconetema !== "") {
			camada.iconetema = "<img class='i3GEOiconeTema' src='" + tema.iconetema + "' />";
		    }
		    //verifica a restricao de escala
		    if(tema.maxscaledenom && (tema.maxscaledenom*1 > i3GEO.parametros.mapscale*1 && tema.minscaledenom*1 < i3GEO.parametros.mapscale*1 )){
			camada.rangeScale = "out";
			camada.rangeScaleMsg = $trad("rangeScaleMsg");
		    } else {
			camada.rangeScale = "in";
		    }

		    if (tema.escondido.toLowerCase() !== "sim") {
			clone.push(camada);
		    }
		}
		i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[camada.name] = tema;
	    });
	    if(temp){
		var t = Mustache.render(
			"{{#data}}" + i3GEO.template.camada + "{{/data}}",
			{"data":clone}
		);
		$("#" + config.idOnde).html(t);

		$("#" + config.idOnde).sortable({
		    scroll: false,
		    axis: "y",
		    revert: true,
		    update: function( event, ui ) {
			var els = i3GEO.arvoreDeCamadas.listaLigadosDesligadosArvore(config.idOnde);
			var lista = els[2].join(",");
			var temp = function(retorno) {
			    i3GEO.atualiza(retorno);
			    if (i3GEO.Interface.ATUAL === "openlayers") {
				i3GEO.Interface.openlayers.ordenaLayers();
			    }
			    i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true);
			};
			i3GEO.php.reordenatemas(temp, lista);
		    }
		});
	    }
	    i3GEO.arvoreDeCamadas.adicionaCamadasDeFundo(config);
	    i3GEO.arvoreDeCamadas.adicionaLayersGr();
	    i3GEO.eventos.executaEventos(i3GEO.eventos.ATUALIZAARVORECAMADAS);
	    /*

		//
			// monta a &aacute;rvore.
			// se i3GEO.configura.grupoLayers estiver definido
			// o processo &eacute; diferenciado
			//
			if (i3GEO.configura.grupoLayers === "") {

				}
			} else {
				var grupoLayers = i3GEO.configura.grupoLayers;
				nk = temas.length;
				c = grupoLayers.length;
				// grupos
				for (i = 0; i < c; i += 1) {
					noGrupo = "";
					noGrupo += "<div class='i3GEOarvCamGrupo'>" + grupoLayers[i].nome + "</div>";
					d = i3GEO.arvoreDeCamadas.EXPANDIDA;
					if(grupoLayers[i].expandido && grupoLayers[i].expandido === true){
						d = true;
					}
					n = grupoLayers[i].layers.length;

					// layers de um grupo
					for (j = 0; j < n; j += 1) {
						// busca na lista de temas
						for (k = 0; k < nk; k += 1) {
							ltema = temas[k];
							if (ltema.name === grupoLayers[i].layers[j] && ltema.escondido === "nao") {
								if (noGrupo !== "") {
									grupoNode = new YAHOO.widget.HTMLNode({
										enableHighlight : true,
										hasIcon : true,
										html : noGrupo,
										expanded : d
									}, tempNode);
									noGrupo = "";
								}
								textoTema = i3GEO.arvoreDeCamadas.montaTextoTema(ltema);
								if (textoTema !== "") {
									d = {
											expanded : false,
											hasIcon : false,
											html : textoTema,
											idlegenda : ltema.name,
											tipo : "tema",
											enableHighlight : true
									};
									temaNode = new YAHOO.widget.HTMLNode(d, grupoNode);

									// if (i3GEO.arvoreDeCamadas.OPCOESICONES === true) {
									textoTema = i3GEO.arvoreDeCamadas.montaIconesTema(ltema)[0];
									temaNodeFilho = new YAHOO.widget.HTMLNode({
										id : ltema.name,
										expanded : false,
										html : textoTema,
										enableHighlight : false,
										isLeaf : !this.PERMITEEXPANDIRTEMAS
									}, temaNode);
									// }
									if (ltema.classe !== "NAO" && this.PERMITEEXPANDIRTEMAS) {
										temaNodeFilho.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
										if (i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA === true) {
											temaNodeFilho.expand();
										}
									}
									incluidos.push(ltema.name);
								}
							}
						}
					}
				}
				// inclui os temas n&atilde;o agrupados
				grupoNode = new YAHOO.widget.HTMLNode({
					expanded : false,
					hasIcon : true,
					enableHighlight : true,
					html : "<div class='i3GEOarvCamGrupo'>"+$trad("u27")+"</div>"
				}, tempNode);
				c = incluidos.length;
				for (k = 0; k < nk; k += 1) {
					ltema = temas[k];
					n = false;
					for (j = 0; j < c; j += 1) {
						if (incluidos[j] === ltema.name || ltema.escondido.toLowerCase() === "sim") {
							n = true;
						}
					}
					if (n === false) {
						textoTema = i3GEO.arvoreDeCamadas.montaTextoTema(ltema);
						if (textoTema !== "") {
							d = {
									expanded : true,
									hasIcon : false,
									html : textoTema,
									idlegenda : ltema.name,
									tipo : "tema",
									enableHighlight : false
							};
							temaNode = new YAHOO.widget.HTMLNode(d, grupoNode);
							textoTema = i3GEO.arvoreDeCamadas.montaIconesTema(ltema)[0];
							temaNodeFilho = new YAHOO.widget.HTMLNode({
								id : ltema.name,
								expanded : false,
								html : textoTema,
								enableHighlight : false,
								isLeaf : !this.PERMITEEXPANDIRTEMAS
							}, temaNode);
							// }
							if (ltema.classe !== "NAO" && this.PERMITEEXPANDIRTEMAS) {
								temaNodeFilho.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda, 1);
								if (i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA === true) {
									temaNodeFilho.expand();
								}
							}
							incluidos.push(ltema.name);
						}

					}
				}
			}
	     */
	},
	adicionaCamadasDeFundo: function(config){
	    if(i3GEO.Interface.ATUAL == "openlayers"){
		//camadas de fundo
		var temp = temp = $i(config.idOnde);
		if(temp && $("#" + config.idListaFundo).html() == ""){
		    //clone = [{"name":"camadaDeFundo","value":"nenhum","title":$trad("nenhum")}];
		    clone= [];
		    $.each(i3GEO.Interface.openlayers.LAYERSADICIONAIS, function( i , layer ){
			camada = {};
			temp = layer.getProperties();
			camada.name = "camadaDeFundo";
			if(temp.preview){
			    camada.preview = temp.preview;
			} else {
			    camada.preview = "";
			}
			camada.value = temp.name;
			camada.title = temp.title;
			if(temp.visible === true){
			    camada.checked = "checked";
			} else {
			    camada.checked = "";
			}
			clone.push(camada);
		    });
		    var t = Mustache.to_html(
			    "{{#data}}" + i3GEO.template.camadaFundo + "{{/data}}",
			    {"data":clone}
		    );
		    $("#" + config.idListaFundo).html(t);
		    $("#" + config.idListaFundo + " label").tooltip({
			animation : false,
			trigger : "hover",
			placement : "auto",
			html: true,
			template : "<div class='tooltip ' ><div class='tooltip-inner'></div></div>"
		    });
		    //slide
		    $.each(clone,function(i,v){
			var slide = $i("slideFundo" + v.value);
			noUiSlider.create(slide, {
			    connect: "lower",
			    start: [ 100 ],
			    range: {
				'min': [  0 ],
				'max': [ 100 ]
			    },
			    name: v.value
			});
			slide.noUiSlider.on('update', function( values, handle ) {
			    i3GEO.Interface.aplicaOpacidade(values[0]*1,this.options.name);
			});
		    });
		}
	    }
	},
	/**
	 * Function: ligaDesligaTemas
	 *
	 * Marca ou desmarca os checkbox da &aacute;rvore de uma lista de temas
	 *
	 * Parametros:
	 *
	 * {string} - lista, separada por v&iacute;rgulas, dos c&oacute;digos dos temas
	 *
	 * {boolean} - marca ou desmarca
	 */
	ligaDesligaTemas : function(lista, status) {
	    if (typeof (console) !== 'undefined')
		console.info("oops i3GEO.arvoreDeCamadas.ligaDesligaTemas()");
	},
	/**
	 * Function: atualizaLegenda
	 *
	 * Atualiza a legenda de um tema.
	 *
	 * A legenda precisa ser atualizada em algumas circunst&acirc;ncias, como quando &eacute; feitoumzoom no mapa.
	 *
	 * Parametro:
	 *
	 * {String} - ID (name) do tema
	 */
	atualizaLegenda : function(idtema) {
	    if (typeof (console) !== 'undefined')
		console.info("depreciado i3GEO.arvoreDeCamadas.atualizaLegenda()");

	},
	/**
	 * Monta o texto com o t&iacute;tulo do tema. Esse texto &eacute; o que ser&aacute; mostrado nos n&oacute;s principais da
	 * &aacute;rvore e cont&eacute;m o checkbox para ligar e desligar o tema.
	 *
	 * Parametro:
	 *
	 * {Object} - objeto JSON com as propriedades do tema
	 *
	 * Return:
	 *
	 * {string} - texto formatado
	 */
	montaTextoTema : function(tema) {
	    // adiciona o temporizador
	    // que redesenha o tema de tempos em tempos
	    if (i3GEO.tema.TEMPORIZADORESID[tema.name] == undefined && tema.temporizador != "") {
		i3GEO.tema.temporizador(tema.name, tema.temporizador);
	    }
	    return (html);
	},
	montaOpcoesTema : function(temaObj,camada) {
	    if (typeof (console) !== 'undefined')
		console.info("montaOpcoesTema " + camada.name);

	    //A inclusao das opcoes e feita com base no template usado na interface
	    //a classe hidden permite esconder o icone
	    //
	    vetor = "hidden";
	    if ((temaObj.type < 3) && (temaObj.connectiontype !== 7)){
		vetor = "";
	    }
	    if(temaObj.plugini3geo && (temaObj.plugini3geo.plugin == "layerkml" || temaObj.plugini3geo.plugin == "layergeojson")){
		vetor = "hidden";
	    }
	    camada.isnotvetor = vetor;
	    camada.ferramentasTexto = $trad("u15a");
	    camada.ferramentasTitle = $trad("ferramCamadas");
	    camada.removerTexto = $trad("t12");
	    camada.removerTitle = $trad("t12a");
	    camada.sobeTexto = $trad("t13");
	    camada.sobeTitle = $trad("t14");
	    camada.desceTexto = $trad("t15");
	    camada.desceTitle = $trad("t16");
	    camada.tabelaTexto = $trad("tabela");
	    camada.tabelaTitle = $trad("t30");
	    camada.limpaselTexto = $trad("t4");
	    camada.zoomSelTexto = $trad("t4a");
	    camada.linkTexto = $trad("a9");
	    camada.editorlegendaTexto = $trad("t33");
	    camada.procurarTexto = $trad("t23");
	    camada.topoTexto = $trad("t25");
	    camada.etiquetasTexto = $trad("t27");
	    camada.filtroTexto = $trad("t29");
	    camada.selecaoTexto = $trad("x51");
	    camada.graficoTexto = $trad("t37");
	    camada.wmsTexto = "WMS-OGC";
	    camada.tmeTexto = $trad("t49");
	    camada.topoTexto = $trad("x56");
	    camada.nomeCamada = camada.tema;
	    camada.opaCamada = camada.transparency;
	    camada.editorlegendaTexto = $trad("t33");
	    camada.coresTexto = $trad("esquemadecores");
	    camada.copiaTexto = $trad("copiaCamada");
	    camada.contornoTexto = $trad("contorno");
	    camada.opacidade = $trad("t20");
	    camada.cortina = $trad("t42");
	    camada.variaEscala = $trad("variaEscala");
	    camada.opaCamada = temaObj.transparency;

	    if (temaObj.zoomtema.toLowerCase() === "sim"){
		camada.zoomtemaTexto = $trad("t17");
		camada.zoomtemaTitle = $trad("t18");
	    } else {
		camada.zoomtema = "hidden";
	    }
	    if (temaObj.sel.toLowerCase() === "sim"){
		camada.selTexto = $trad("t5");
		camada.selTitle = $trad("t4");
	    } else {
		camada.sel = "hidden";
	    }
	    if (temaObj.sel.toLowerCase() === "sim"){
		camada.zoomSelTexto = $trad("t4a");
	    } else {
		camada.zoomsel = "hidden";
	    }
	    if (temaObj.link_tema != "" && temaObj.features.toLowerCase() !== "sim" && temaObj.name != "mundo"){
		camada.linkTexto = $trad("a9");
		camada.linkTitle = $trad("a9");
	    } else {
		camada.link = "hidden";
	    }
	    if (temaObj.download.toLowerCase() === "sim" || temaObj.download === "" && temaObj.features.toLowerCase() !== "sim") {
		camada.downloadTexto = "Download";
		camada.downloadTitle = $trad("t6");
	    } else {
		camada.download = "hidden";
	    }
	    if (temaObj.permiteogc.toLowerCase() === "sim") {
		camada.permiteogcTexto = "OGC";
	    } else {
		camada.permiteogc = "hidden";
	    }
	    return camada;
	},
	montaParametrosTema: function(temaObj,camada) {
	    if (typeof (console) !== 'undefined')
		console.info("arvoreDeCamadas montaParametrosTema");

	    if(temaObj.ferramentas){
		var html = "", fer="", fers = temaObj.ferramentas;
		for(fer in fers){
		    if(i3GEO.configura.ferramentasLayers[fer] && i3GEO.configura.ferramentasLayers[fer].parametrosForm){
			html += i3GEO.configura.ferramentasLayers[fer].parametrosForm(temaObj);
		    }
		}
		//formsFerramentas deve estar no template de renderizacao da camada
		camada.formsFerramentas = html;
	    }
	},
	montaIconesTema : function(temaObj,camada) {
	    if (typeof (console) !== 'undefined')
		console.info("arvoreDeCamadas montaIconesTema");
	    //A inclusao dos icones e feita com base no template usado na interface
	    //a classe hidden permite esconder o icone
	    //
	    //farol de escala
	    camada.farol = "hidden";
	    if (temaObj.escala != 0) {
		if (temaObj.escala * 1 < i3GEO.parametros.mapscale * 1) {
		    camada.farol = "green";
		    camada.farolTitle = $trad("t9");
		}
		if (temaObj.escala * 1 > i3GEO.parametros.mapscale * 1) {
		    camada.farol = "red";
		    camada.farolTitle = $trad("t10");
		}
		if (temaObj.escala === 0) {
		    camada.farol = "yellow";
		    camada.farolTitle = $trad("t11");
		}
	    }
	    if (temaObj.contextoescala.toLowerCase() === "sim") {
		camada.contextoescala = "";
		camada.contextoescalaTitle = $trad("t36");
	    } else {
		camada.contextoescala = "hidden";
	    }
	    //aqui e gerado um icone para o plugin configurado na camada
	    //esse icone ja e montado como um html
	    if (temaObj.plugini3geo){
		var iconePlugin = i3GEO.pluginI3geo.clickArvoreDeCamadas(temaObj);
		if(iconePlugin != false){
		    camada.iconePlugin = iconePlugin;
		}
	    }
	    //inclui o icone de ferramentas que possuem parametros
	    if(temaObj.ferramentas){
		var html = "", fer="", fers = temaObj.ferramentas;
		for(fer in fers){
		    if(i3GEO.configura.ferramentasLayers[fer] && i3GEO.configura.ferramentasLayers[fer].icone){
			html += i3GEO.configura.ferramentasLayers[fer].icone(temaObj.name);
		    }
		}
		camada.iconeFerramentas = html;
	    }
	    //para testes
	    /*
			camada.farol = "red";
			camada.farolTitle = $trad("t10");
			camada.contextoescala = "";
			camada.contextoescalaTitle = $trad("t36");
	     */
	    return camada;
	},
	/**
	 * Atualiza o farol de cada tema.
	 *
	 * O farol identifica a compatibilidade da escala do mapa com a escala de cada tema
	 *
	 * Parametro:
	 *
	 * {Numeric} - escala de compara&ccedil;&atilde;o com a escala de cada tema
	 */
	atualizaFarol : function(mapscale) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.atualizaFarol()");

	    // YAHOO.log("Atualizando o farol da &aacute;rvore de camadas",
	    // "i3geo");
	    var cor,farol, l, ltema, escala, iu = i3GEO.util, im = i3GEO.configura.locaplic + "/imagens/", camadas =
		i3GEO.arvoreDeCamadas.CAMADAS;
	    farol = "maisamarelo.png";
	    cor = "yellow";
	    l = camadas.length - 1;
	    if (l >= 0) {
		do {
		    ltema = camadas[l];
		    escala = ltema.escala;
		    if (escala != 0){
			if (escala * 1 < mapscale * 1) {
			    farol = "maisverde.png";
			    cor = "green";
			}
			if (escala * 1 > mapscale * 1) {
			    farol = "maisvermelho.png";
			    cor = "red";
			}
			if (escala * 1 === 0) {
			    farol = "maisamarelo.png";
			    cor = "yellow";
			}
			//iu.defineValor("farol" + ltema.name, "src", im + farol);
			//iu.defineValor("farol" + ltema.name, "src", im + farol);
			$("#farol" + ltema.name).css("color",cor);
		    }
		} while (l--);
	    }
	},
	/**
	 * Function: aplicaTemas
	 *
	 * Refaz o mapa ligando e desligando os temas conforme consta na &aacute;rvore de camadas ou ligando/desligando todos
	 *
	 * Parametro:
	 *
	 * {normal|ligartodos|desligartodos} - tipo de opera&ccedil;&atilde;o A op&ccedil;&atilde;o 'normal' ir&aacute; desligar/ligar o que
	 * estiver marcado
	 */
	aplicaTemas : function(tipo) {
	    if (arguments.length === 0) {
		tipo = "normal";
	    }
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.aplicaTemas()");

	    var t = "", temp;
	    if (tipo === "normal") {
		t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("mantem");
	    }
	    if (tipo === "ligartodos") {
		t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("marca");
	    }
	    if (tipo === "desligartodos") {
		t = i3GEO.arvoreDeCamadas.listaLigadosDesligados("desmarca");
	    }
	    //
	    // zera o contador de tempo
	    //
	    temp = function() {
		i3GEO.atualiza();
		i3GEO.janela.fechaAguarde("redesenha");
	    };
	    if (tipo === "normal") {
		i3GEO.php.ligatemas(temp, t[1].toString(), t[0].toString());
		return;
	    }
	    if (tipo === "ligartodos") {
		i3GEO.php.ligatemas(temp, "", t[2].toString());
		return;
	    }
	    if (tipo === "desligartodos") {
		i3GEO.php.ligatemas(temp, t[2].toString(), "");
	    }
	},
	/**
	 * Function: listaLigadosDesligados
	 *
	 * Lista os temas que est&atilde;o ligados e os que est&atilde;o desligados tendo como fonte de busca o objeto CAMADAS.
	 *
	 * Esse m&eacute;todo &eacute; mais demorado pois varre a &aacute;rvore toda. Por&eacute;m, obt&eacute;m o status verdadeiro do
	 * tema.
	 *
	 * Parametro:
	 *
	 * {String} - mantem|marca|desmarca marca, desmarca ou mant&eacute;m o checkbox ap&oacute;s identificar seu status atual
	 *
	 * Return:
	 *
	 * {Array} - array de arrays com os c&oacute;digos dos temas [0]=ligados [1]=desligados [2]=todos na ordem encontrada
	 */
	listaLigadosDesligados : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.listaLigadosDesligados()");

	    if (!i3GEO.arvoreDeCamadas.CAMADAS) {
		return [[],[],[],[]];
	    }

	    var i = 0, filtrados = [], ligados = [], desligados = [], todos = [], camada, camadas = i3GEO.arvoreDeCamadas.CAMADAS;
	    i = camadas.length;
	    while (i > 0) {
		i -= 1;
		camada = camadas[i];
		todos.push(camada["name"]);
		if (parseInt(camada["status"],10) === 2) {
		    ligados.push(camada["name"]);
		} else {
		    desligados.push(camada["name"]);
		}
		if(i3GEO.arvoreDeCamadas.verifyFilter(camada) == true){
		    filtrados.push(camada["name"]);
		}
	    }
	    return ([
		ligados,
		desligados,
		todos,
		filtrados
		]);
	},
	/**
	 * Function: listaLigadosDesligadosArvore
	 *
	 * Lista os temas que est&atilde;o ligados e os que est&atilde;o desligados tendo como fonte de busca o HTML onde esta a lista de camadas.
	 *
	 * Esse m&eacute;todo &eacute; mais demorado pois varre a &aacute;rvore toda. Por&eacute;m, obt&eacute;m o status verdadeiro do
	 * tema.
	 *
	 * Parametro:
	 *
	 * {String} - mantem|marca|desmarca marca, desmarca ou mant&eacute;m o checkbox ap&oacute;s identificar seu status atual
	 *
	 * Return:
	 *
	 * {Array} - array de arrays com os c&oacute;digos dos temas [0]=ligados [1]=desligados [2]=todos na ordem encontrada
	 */
	listaLigadosDesligadosArvore : function(onde) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.listaLigadosDesligadosArvore()");

	    if (!i3GEO.arvoreDeCamadas.CAMADAS) {
		return [[],[],[]];
	    }
	    var n,i, ligados = [], desligados = [], todos = [], camada, camadas;
	    camadas = $i(onde).getElementsByTagName("input");
	    n = camadas.length;
	    for(i=0; i<n; i++){
		camada = camadas[i];
		todos.push(camada.value);
		if (camada.checked == true) {
		    ligados.push(camada["name"]);
		} else {
		    desligados.push(camada["name"]);
		}
	    }
	    return ([
		ligados,
		desligados,
		todos
		]);
	},
	/**
	 * Function: capturaCheckBox
	 *
	 * Retorna o objeto input (check box) que corresponde a uma determinada camada na &aacute;rvore.
	 *
	 * Parametro:
	 *
	 * {String} - c&oacute;digo do tema ao qual o elemento se refere
	 *
	 * Return:
	 *
	 * {Objeto DOM} - objeto do tipo checkbox
	 */
	capturaCheckBox : function(tema) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.capturaCheckBox()");

	    var onde = $i(i3GEO.arvoreDeCamadas.config.idOnde),camadas,n,i;
	    if(onde){
		camadas = onde.getElementsByTagName("input");
		n = camadas.length;
		for(i=0; i<n; i++){
		    if(camadas[i].name == tema){
			return camadas[i];
		    }
		}
	    }
	    return false;
	},
	/**
	 * Compara se dois objetos com as camadas s&atilde;o iguais
	 *
	 * Parametros:
	 *
	 * {objeto} - objeto novo
	 *
	 * {objeto} - objeto atual
	 *
	 * Return:
	 *
	 * {boolean}
	 */
	comparaTemas : function(novo, atual) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.comparaTemas()");

	    try {
		var novon = novo.length, i;
		if (novon !== atual.length) {
		    return (false);
		}

		for (i = 0; i < novon; i += 1) {
		    if (novo[i].name !== atual[i].name) {
			return (false);
		    }
		    if (novo[i].tema !== atual[i].tema) {
			return (false);
		    }
		    if (novo[i].sel !== atual[i].sel) {
			return (false);
		    }
		    if (novo[i].status !== atual[i].status) {
			return (false);
		    }
		}
		return (true);
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return true;
	    }
	},
	/**
	 * Function: pegaTema
	 *
	 * Procura um tema no objeto CAMADAS.
	 *
	 * Parametro:
	 *
	 * {String} valor do parametro
	 *
	 * {Objeto} - objeto com a lista de temas (escape com "" para usar o default)
	 *
	 * {string} - parametro que sera procurado
	 *
	 * Return:
	 *
	 * {objeto}
	 */
	pegaTema : function(valor, camadas, parametro) {
	    var i;
	    if (!camadas || camadas == "") {
		camadas = i3GEO.arvoreDeCamadas.CAMADAS;
	    } else {
		// converte o objeto camadas para a forma valida caso contenha a
		// forma chave/valor, implementada na versao 6.0 do i3Geo
		camadas = i3GEO.arvoreDeCamadas.converteChaveValor2normal(camadas);
	    }
	    if (!parametro) {
		parametro = "name";
	    }
	    i = camadas.length;
	    while (i > 0) {
		i -= 1;
		if (camadas[i][parametro] === valor) {
		    return camadas[i];
		}
	    }
	    return "";
	},
	/**
	 * Busca temas na vari&aacute;vel i3GEO.arvoreDeCamadas.CAMADAS aplicando um filtro
	 *
	 * Parameters:
	 *
	 * {string} - propriedade de CAMADAS que ser&aacute; filtrado
	 *
	 * {string} - valor do filtro
	 *
	 * {string} - operador entre propriedade e valor igual|diferente|menor
	 *
	 * {objeto} - array do tipo i3GEO.arvoreDeCamadas.CAMADAS
	 *
	 * Return: {Array} - lista de camadas
	 */
	filtraCamadas : function(propriedade, valor, operador, camadas) {
	    if(!camadas){
		camadas = i3GEO.arvoreDeCamadas.CAMADAS;
	    }
	    var resultado, i = 0, temp, nelementos = camadas.length, ltema;
	    resultado = [];
	    if (nelementos > 0) {
		do {
		    ltema = camadas[i];
		    if (ltema.escondido.toLowerCase() !== "sim") {
			temp = ltema[propriedade];
			if (operador === "igual") {
			    if (temp+"".toLowerCase() == valor+"".toLowerCase()) // n&atilde;o usar === aqui
			    {
				resultado.push(ltema);
			    }
			}
			if (operador === "diferente") {
			    if (temp+"".toLowerCase() !== valor+"".toLowerCase()) {
				resultado.push(ltema);
			    }
			}
			if (operador === "menor") {
			    if (temp+"".toLowerCase() < valor+"".toLowerCase()) {
				resultado.push(ltema);
			    }
			}
		    }
		    i += 1;
		} while (i < nelementos);
	    }
	    return resultado;
	},
	/**
	 * Function: alteraPropCamadas
	 *
	 * Altera o valor de uma propriedade de um tema do objeto i3GEO.arvoreDeCamadas.CAMADAS
	 *
	 * Parameters:
	 *
	 * {string} - propriedade que ser&aacute; modificada
	 *
	 * {string} - novo valor
	 *
	 * {string} - c&oacute;digo da camada
	 */
	alteraPropCamadas : function(propriedade, valor, camada) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.alteraPropCamadas()");

	    var i = 0, nelementos = i3GEO.arvoreDeCamadas.CAMADAS.length, ltema;
	    if (nelementos > 0) {
		do {
		    ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
		    if (ltema.name === camada) {
			ltema[propriedade] = valor;
		    }
		    i += 1;
		} while (i < nelementos);
	    }
	},
	/**
	 * Verifica se um tema est&aacute; ou n&atilde;o na abrang&ecirc;ncia espacial do mapa atual modificando a cor com que o nome
	 * &eacute; mostrado na &aacute;rvore
	 */
	verificaAbrangenciaTemas : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.verificaAbrangenciaTemas()");

	    var nos = $("#" + i3GEO.arvoreDeCamadas.config.idOnde).find("input");

	    $.each( nos, function( i,no ) {
		var ltema = i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[no.value];
		var temp = ltema.exttema;
		if (temp !== "" && temp != undefined ) {
		    if (i3GEO.util.intersectaBox(temp, i3GEO.parametros.mapexten) === false) {
			$(no).addClass(i3GEO.arvoreDeCamadas.config.verificaAbrangencia);
		    } else {
			$(no).removeClass(i3GEO.arvoreDeCamadas.config.verificaAbrangencia);
		    }
		}

	    });
	},
	/**
	 * Verifica se algum tema est&aacute; marcado com o metadado Aplicaextensao. Retorna a primeira ocorr&ecirc;ncia se houver
	 *
	 * Return:
	 *
	 * {string} - c&oacute;digo do tema ou ""
	 */
	verificaAplicaExtensao : function() {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.verificaAplicaExtensao()");

	    var i = 0, temp = "", nelementos = i3GEO.arvoreDeCamadas.CAMADAS.length, ltema;
	    try {
		if (nelementos > 0) {
		    do {
			ltema = i3GEO.arvoreDeCamadas.CAMADAS[i];
			if (ltema.aplicaextensao.toLowerCase() === "sim") {
			    temp = ltema.name;
			}
			i += 1;
		    } while (i < nelementos);
		}
	    } catch (e) {
		if (typeof (console) !== 'undefined')
		    console.error(e.message)

		    return "";
	    }
	    return temp;
	},
	/**
	 * Converte um objeto com a lsita de camadas do formato chave/valor para o formato normal O formato chave/valor foi introduzido na
	 * versao 6.0 do i3Geo e e fornecido como padrao pelo servidor O objeto i3GEO.arvoreDeCamadas.CAMADAS utiliza o formato normal do
	 * tipo {chave: valor},{chave: valor} Ja o objeto fornecido pelo servidor evita redundancias utilizando o formato
	 * {chaves:{},valores:{}}
	 */
	converteChaveValor2normal : function(obj) {
	    if (obj.chaves) {
		var i, tema, j, t, chaves = obj.chaves, temas = obj.valores, ntemas = temas.length, nchaves = chaves.length, novo = [];
		for (i = 0; i < ntemas; i++) {
		    tema = temas[i];
		    t = {};
		    for (j = 0; j < nchaves; j++) {
			t[chaves[j]] = tema[j];
		    }
		    novo.push(t);
		}
		return novo;
	    } else {
		return obj;
	    }
	},
	/**
	 * Guarda um objeto contendo as definicoes das camadas conforme o padrao utilizado pela arvore de camadas
	 */
	registaCamadas : function(obj) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeCamadas.registaCamadas()");

	    var i;
	    obj = i3GEO.arvoreDeCamadas.converteChaveValor2normal(obj);
	    i3GEO.arvoreDeCamadas.CAMADAS = obj;
	    i3GEO.arvoreDeCamadas.CAMADASINDEXADAS = [];
	    $.each( i3GEO.arvoreDeCamadas.CAMADAS, function( i,tema ) {
		i3GEO.arvoreDeCamadas.CAMADASINDEXADAS[tema.name] = tema;
	    });
	},
	/**
	 * Section: i3GEO.arvoreDeCamadas.dialogo
	 *
	 * Abre as telas de di&aacute;logo das op&ccedil;&otilde;es de manipula&ccedil;&atilde;o da &aacute;rvore
	 */
	dialogo : {
	    /**
	     * Function: filtro
	     *
	     * Abre a janela de di&aacute;logo para o usu&aacute;rio escolher ou alterar o filtro aplicado a &aacute;rvore
	     */
	    filtro : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.arvoreDeCamadas.dialogo.filtro()",
			"filtroarvore",
			"filtroarvore",
			"dependencias.php",
			"i3GEOF.filtroarvore.start()"
		);
	    },
	    /**
	     * Function: excluir
	     *
	     * Abre a janela de di&aacute;logo para o usu&aacute;rio escolher os temas que ser&atilde;o exclu&iacute;dos da &aacute;rvore
	     */
	    excluir : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.arvoreDeCamadas.dialogo.excluir()",
			"excluirarvore",
			"excluirarvore",
			"dependencias.php",
			"i3GEOF.excluirarvore.start()"
		);
	    }
	}
};
