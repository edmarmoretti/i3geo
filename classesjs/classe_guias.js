/**
 * Title: Guias
 *
 * Cria e controla os blocos de op&ccedil;&otilde;es ativados por meio de guias
 * ou bot&otilde;es
 *
 * As guias alternam conte&uacute;dos para exibi&ccedil;&atilde;o conforme as escolhas feitas pelo usu&aacute;rio
 *
 * Namespace:
 *
 * i3GEO.guias
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_guias.js>
 */
/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente
 * Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja
 * &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA
 * FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral
 * do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.guias =
	{
		/**
		 * Variavel: ATUAL
		 *
		 * Guia que est&aacute; ativa ou que ser&aacute; ativada ao iniciar o
		 * mapa
		 *
		 * O nome da guia &eacute; a definida na vari&aacute;vel
		 * i3GEO.guias.CONFIGURA
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * temas
		 */
		ATUAL : "temas",
		/**
		 * Propriedade: ALTURACORPOGUIAS
		 *
		 * Altura em pixels que ser&aacute; aplicado em cada guia
		 *
		 * Por default, a altura &eacute; calculada automaticamente, mas em
		 * alguns casos, pode ser necess&aacute;rio especificar o valor para
		 * permitir um melhor ajuste do layout do mapa
		 *
		 * Mantenha como 0 para que o c&aacute;lculo seja autom&aacute;tico
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 0
		 */
		ALTURACORPOGUIAS : 0,
		/**
		 * Propriedade: CONFIGURA
		 *
		 * Define os par&acirc;metros de cada guia que ser&aacute; mostrada no
		 * mapa, como t&iacute;tulo, conte&uacute;do, etc.
		 *
		 * Voc&ecirc; pode modificar o nome de uma guia como no exemplo
		 *
		 * i3GEO.guias.CONFIGURA.legenda.titulo = "nome diferente";
		 *
		 * Por padr&atilde;o s&atilde;o definidas as guias legenda, temas,
		 * adiciona e mapas (links)
		 *
		 * Exemplo:
		 *
		 * (start code)
		 *
		 * i3GEO.guias.CONFIGURA.legenda = {
		 * 		icone : "imagens/gisicons/show-legend.png",
		 * 		titulo : "Legenda",
		 * 		id : "guia4",
		 * 		idconteudo : "guia4obj",
		 * 		click : function() {
		 * 			i3GEO.guias.mostra("legenda");
		 * 			i3GEO.mapa.legendaHTML.cria("guia4obj");
		 * 		}
		 * };
		 *
		 * (end)
		 *
		 * Tipo:
		 *
		 * {objeto}
		 */
		CONFIGURA : {
			"temas" : {
				icone : "imagens/layer.png",
				titulo : $trad("g4a"),
				id : "guia1",
				idconteudo : "guia1obj",
				click : ""
			},
			"adiciona" : {
				icone : "imagens/catalogo.png",
				titulo : $trad("g1a"),
				id : "guia2",
				idconteudo : "guia2obj",
				click : function() {
					var ondeArvore;
					i3GEO.guias.mostra("adiciona");
					if (!$i("arvoreAdicionaTema")) {
						try {
							ondeArvore = objmapa.guiaMenu
								+ "obj";
						} catch (e) {
							ondeArvore = "guia2obj";
						}
					} else {
						ondeArvore = "arvoreAdicionaTema";
					}
					// para efeitos de compatibilidade
					if (document.getElementById("outrasOpcoesAdiciona")) {
						i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde = "outrasOpcoesAdiciona";
						i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore = false;
					}
					i3GEO.arvoreDeTemas.cria(
						i3GEO.configura.sid,
						i3GEO.configura.locaplic,
						ondeArvore);
				}
			},
			"legenda" : {
				icone : "imagens/legenda.png",
				titulo : $trad("g3"),
				id : "guia4",
				idconteudo : "guia4obj",
				click : function() {
					i3GEO.guias.mostra("legenda");
					i3GEO.mapa.legendaHTML.cria("guia4obj");
				}
			},
			"mapas" : {
				icone : "imagens/gisicons/show-links.png",
				titulo : "Links",
				id : "guia5",
				idconteudo : "guia5obj",
				mostraLink : function(id, url) {
					$i("i3geoMapasLink_"
						+ id).innerHTML = "<a href='"
						+ url
						+ "' target=_blank >"
						+ url
						+ "</a>";
				},
				click : function(onde) {
					if (!onde) {
						onde = i3GEO.guias.CONFIGURA.mapas.idconteudo;
					}
					var pegaMapas = function(retorno) {
						var ins, mapa, ig1lt, ig1, nome, lkd, link, temp, combo, urlinterface;
						ins = "<br><div id='banners' style='overflow:auto;text-align:center'>"
							+ "<a href='"
							+ i3GEO.configura.locaplic
							+ "/admin/html/mapas.html' target=_blank >"
							+ $trad("x89")
							+ "</a><br><br>";
						mapa = retorno.data.mapas;
						ig1lt = mapa.length;
						ig1 = 0;
						urlinterface = window.location.origin
							+ window.location.pathname;
						if (ig1lt > 0) {
							do {
								temp = mapa[ig1];
								nome = temp.NOME;
								if (temp.PUBLICADO) {
									if (temp.PUBLICADO.toLowerCase() === "nao") {
										nome = "<s>"
											+ nome
											+ "</s>";
									}
								}
								lkd = temp.LINK;
								link = i3GEO.configura.locaplic
									+ "/ms_criamapa.php?temasa="
									+ temp.TEMAS
									+ "&layers="
									+ temp.LIGADOS;
								if (temp.EXTENSAO !== "") {
									link += "&mapext="
										+ temp.EXTENSAO;
								}
								if (temp.OUTROS !== "") {
									link += "&"
										+ temp.OUTROS;
								}
								if (lkd !== "") {
									link = lkd;
								}
								ins += "<div style='width:170px;background-color:white;padding:5px;margin:auto;border: 1px solid #F0F0F0;border-radius: 5px;box-shadow: 1px 1px 1px 1px #D3D3D3;' >";

								if (temp.IMAGEM
									&& temp.IMAGEM != "") {
									ins += "<div style=text-align:center ><a href='"
										+ link
										+ "' style=text-align:center;text-decoration:none; >"
										+ "<img src='"
										+ temp.IMAGEM
										+ "'></a></div><br>";
								}
								// verifica se o mapfile esta salvo no banco
								// diretamente
								if (temp.CONTEMMAPFILE == "nao") {
									ins += "<div><p class=paragrafo style=text-align:center;cursor:pointer >"
										+ "<a href='"
										+ link
										+ "' style=text-align:center;text-decoration:none; >"
										+ nome
										+ " ("
										+ temp.ID_MAPA
										+ ")</a></p></div>";
								} else {
									// combo de opcoes para abrir os mapas
									// salvos
									// como mapfiles
									// esses links tambem sao colocados em
									// admin/php/xml.php geraRSSmapas
									combo = "<select style='width:170px;' onchange='i3GEO.guias.CONFIGURA.mapas.mostraLink("
										+ ig1
										+ ",this.value)'>"
										+ "<option value=''>"
										+ $trad("x103")
										+ ":</option>"
										+ "<option value='"
										+ link
										+ "'>Como foi salvo</option>"
										+ "<option value='"
										+ link
										+ "&interface="
										+ urlinterface
										+ "'>Com a interface atual</option>"
										+ "<option value='"
										+ i3GEO.configura.locaplic
										+ "/mashups/openlayers.php?restauramapa="
										+ temp.ID_MAPA
										+ "&fundo=e_wsm'>Openlayers com todos os botoes</option>"
										+ "<option value='"
										+ i3GEO.configura.locaplic
										+ "/mashups/openlayers.php?restauramapa="
										+ temp.ID_MAPA
										+ "&fundo=est_wms'>Sem o fundo</option>"
										+ "<option value='"
										+ i3GEO.configura.locaplic
										+ "/mashups/openlayers.php?restauramapa="
										+ temp.ID_MAPA
										+ "&fundo=e_wsm&botoes=legenda pan zoombox zoomtot zoomin zoomout distancia area identifica'>Com booes principais</option>"
										+ "<option value='"
										+ i3GEO.configura.locaplic
										+ "/mashups/openlayers.php?restauramapa="
										+ temp.ID_MAPA
										+ "&botoes=legenda pan zoombox zoomtot zoomin zoomout'>Botoes de navegacao</option>"
										+ "</select>";
									ins += "<div>"
										+ "<p class=paragrafo style=text-align:center;cursor:pointer >"
										+ "<img style=text-align:center src='"
										+ i3GEO.configura.locaplic
										+ "/ferramentas/salvamapa/geraminiatura.php?w=100&h=67&restauramapa="
										+ temp.ID_MAPA
										+ "'><br><br>"
										+ "<a href='"
										+ link
										+ "' style=text-align:center;text-decoration:none; >"
										+ nome
										+ " ("
										+ temp.ID_MAPA
										+ ")</a>"
										+
										// "<br><a target=_blank
										// href='"+i3GEO.configura.locaplic+"/mashups/openlayers.php?"+temp.OUTROS+"&fundo=e_wsm'
										// style=text-align:center;text-decoration:none;color:gray;
										// >Preview</a>" +
										"<br>"
										+ combo
										+ "<br><div style='cursor:pointer;' id='i3geoMapasLink_"
										+ ig1
										+ "' ></div>"
										+ "</p></div>";
								}
								ins += "</div><br>";
								ig1++;
							} while (ig1 < ig1lt);
						}
						$i(onde).innerHTML = ins
							+ "</div>";
					};
					if ($i(i3GEO.guias.CONFIGURA.mapas.idconteudo)) {
						$i(i3GEO.guias.CONFIGURA.mapas.idconteudo).innerHTML = "Aguarde...";
					}
					i3GEO.guias.mostra("mapas");
					i3GEO.php.pegaMapas(pegaMapas);
					i3GEO.navega.removeCookieExtensao();
				}
			}
		},
		/**
		 * Propriedade: ORDEM
		 *
		 * Ordem de inclus&atilde;o das guias no mapa. Essa op&ccedil;&atilde;o
		 * &eacute; mais &uacute;til no caso do tipo sanfona, pois nesse caso, a
		 * primeira guia &eacute; sempre a que fica ativa. Se esse parametro for
		 * uma string vazia, a ordem utilizada ser&aacute; a ordem existente em
		 * i3GEO.guias.CONFIGURA.
		 *
		 * Ao ser definida, apenas as guias indicadas no array ser&atilde;o
		 * inclu&iacute;das
		 *
		 * Exemplo:
		 *
		 * i3GEO.guias.ORDEM = ["temas","adiciona","legenda"];
		 *
		 * Tipo:
		 *
		 * {array}
		 */
		ORDEM : "",
		/**
		 * Propriedade: TIPO
		 *
		 * Tipo de guia
		 *
		 * Quando TIPO = "movel", a inicializa&ccedil;&atilde;o da guia &eacute;
		 * feita em i3GEO.inicia Isso &eacute; ne cess&aacute;rio pq a guia
		 * m&oacute;vel s&oacute; pode ser criada ap&oacute;s o posicionamento
		 * do corpo do mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * guia
		 *
		 * Values:
		 *
		 * guia|sanfona|tablet|movel
		 */
		TIPO : "guia",
		/**
		 * Propriedade: idguias
		 *
		 * ID do elemento DOM, criado pelo YUI, onde ser&atilde;o inseridas as
		 * guias
		 *
		 * Tipo:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * guiasYUI
		 */
		IDGUIAS : "guiasYUI",
		/**
		 * Function: cria
		 *
		 * Cria as guias com base na vari&aacute;vel i3GEO.guias.CONFIGURA
		 *
		 * As guias podem ser definidas no HTML do mapa, sem necessariamente
		 * estarem na vari&aacute;vel configura.<b> As guias, nesse caso, devem
		 * ter como ID "guia'n'", por exemplo id="guia6". Para cada uma dessas
		 * guias deve haver um DIV com o conte&uacute;do. Esse DIV deve ter como
		 * ID "guia'n'obj", por exemplo id="guia6obj". No caso de ser utilizado
		 * a guia m&oacute;vel, com i3GEO.guias.TIPO = "movel" , "guia'n"
		 * n&atilde;o &eacute; necess&aacute;rio, uma vez que s&atilde;o
		 * utilizados os &iacute;cones definidos em i3GEO.guias.CONFIGURA
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento que conter&aacute; as guias
		 */
		cria : function(onde) {
			//
			// obt&eacute;m outras guias que podem existir no mapa
			//
			var nguiasreal = 0, guiaconteudo, id, guia, g, re, ng, tituloguia, i, ins, altura, temp, CONFIGURA = i3GEO.guias.CONFIGURA, guias = i3GEO.util.listaChaves(CONFIGURA), nguias =
				guias.length;
			//
			// no caso de TIPO === "movel", as guias n&atilde;o s&atilde;o
			// constru&iacute;das de imediato, apenas &eacute; criado um objeto
			// com os par&acirc;metros necess&aacute;rios para a
			// cria&ccedil;&atilde;o das guias
			//
			if (i3GEO.guias.TIPO === "movel") {
				i3GEO.guias.IDGUIAS = "i3GEOguiaMovelConteudo";
				for (ng = 0; ng < nguias; ng++) {
					if ($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo)) {
						i3GEO.guias.guiaMovel.config.guias.ids.push(i3GEO.guias.CONFIGURA[guias[ng]].id);
						i3GEO.guias.guiaMovel.config.guias.idsconteudos.push(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo);
						if (i3GEO.guias.CONFIGURA[guias[ng]].icone !== undefined) {
							i3GEO.guias.guiaMovel.config.guias.icones.push(i3GEO.guias.CONFIGURA[guias[ng]].icone);
						} else {
							i3GEO.guias.guiaMovel.config.guias.icones.push("imagens/gisicons/open1.png");
						}
						i3GEO.guias.guiaMovel.config.guias.titulos.push(i3GEO.guias.CONFIGURA[guias[ng]].titulo);
						i3GEO.guias.guiaMovel.config.guias.chaves.push(guias[ng]);
					}
				}
				return;
			}
			try {
				for (g = 0; g < 12; g++) {
					tituloguia = "";
					if ($i("guia"
						+ g)) {
						tituloguia = $i("guia"
							+ g).innerHTML;
						re = new RegExp(
							"&nbsp;", "g");
						tituloguia = tituloguia.replace(
							re,
							'');
						for (ng = 0; ng < nguias; ng++) {
							if (CONFIGURA[guias[ng]].id === "guia"
								+ g) {
								tituloguia = "";
							}
						}
						if (tituloguia !== "") {
							i3GEO.guias.CONFIGURA["guia"
								+ g] = [];
							i3GEO.guias.CONFIGURA["guia"
								+ g].titulo = tituloguia;
							i3GEO.guias.CONFIGURA["guia"
								+ g].id = "guia"
								+ g;
							i3GEO.guias.CONFIGURA["guia"
								+ g].idconteudo = "guia"
								+ g
								+ "obj";
							if ($i('guia'
								+ g).onclick) {
								i3GEO.guias.CONFIGURA["guia"
									+ g].click = $i("guia"
									+ g).onclick;
							}
						}
					}
				}
				if (i3GEO.guias.ORDEM === "") {
					guias = i3GEO.util.listaChaves(CONFIGURA);
				} else {
					guias = i3GEO.guias.ORDEM;
				}
				nguias = guias.length;
				//
				// verifica o div que cont&eacute;m as guias caso n&atilde;o
				// tenha
				// sido passado como parametro
				//
				if (arguments.length === 0) {
					for (ng = 0; ng < nguias; ng++) {
						i = $i(i3GEO.guias.CONFIGURA[guias[ng]].id);
						if (i) {
							onde = i.parentNode;
						}
					}
				} else {
					onde = $i(onde);
				}
				if (!onde) {
					return;
				}
				onde.id = i3GEO.guias.IDGUIAS;
				onde.className = "yui-navset";
				//
				// constroi as TAGs para as guias
				//
				if (i3GEO.guias.TIPO === "guia"
					|| i3GEO.guias.TIPO === "tablet") {
					ins = '<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;text-align:center;">';
					for (ng = 0; ng < nguias; ng++) {
						if ($i(i3GEO.guias.CONFIGURA[guias[ng]].id)) {
							if ($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo)) {
								ins += '<li><a alt="" title=""><em><div id="'
									+ i3GEO.guias.CONFIGURA[guias[ng]].id
									+ '" >'
									+ i3GEO.guias.CONFIGURA[guias[ng]].titulo
									+ '</div></em></a></li>';
							}
						}
					}
					// adiciona uma guia que permite esconder todas as outras
					// guias
					// se for do tipo tablet
					ins += "</ul>";
					onde.innerHTML = ins;
				}
				if (i3GEO.guias.TIPO === "sanfona") {
					ins = '<dl id=sanfona'
						+ onde.id
						+ ' class="accordion" >';
					// verifica a quantidade certa de guias
					if (i3GEO.guias.ORDEM === "") {
						for (ng = 0; ng < nguias; ng++) {
							if ($i(i3GEO.guias.CONFIGURA[guias[ng]].id)) {
								nguiasreal++;
							}
						}
					} else {
						nguiasreal = i3GEO.guias.ORDEM.length;
					}

					if (navn) {
						altura = i3GEO.parametros.h
							- (nguiasreal * 25)
							- 1;
					} else {
						altura = i3GEO.parametros.h
							- (nguiasreal * 23)
							+ 1;
					}
					for (ng = 0; ng < nguias; ng++) {
						if ($i(i3GEO.guias.CONFIGURA[guias[ng]].id)) {
							id = i3GEO.guias.CONFIGURA[guias[ng]].idconteudo;
							temp = $i(id);
							if (temp) {
								guiaconteudo = temp.innerHTML;
								temp.innerHTML = "";
								temp.style.display = "none";
								temp.id = "";
								ins += '<dt style=height:17px id="'
									+ i3GEO.guias.CONFIGURA[guias[ng]].id
									+ '" >'
									+ '<table class=accordiontable ><tr><td width="98%" >'
									+ i3GEO.guias.CONFIGURA[guias[ng]].titulo
									+ '</td><td width="2%" ><img id="" src="'
									+ i3GEO.configura.locaplic
									+ '/imagens/branco.gif" style="width:10px;" /></td></tr></table>'
									+ '<dd clas=close >'
									+ '<div class=bd >'
									+ '<div id="'
									+ id
									+ '" >'
									+ guiaconteudo
									+ '</div></div></dd>';
							}
						}
					}
					ins += "</dl>";
					onde.innerHTML = ins;
					onde.style.height = altura
						+ "px";
					YAHOO.lutsr.accordion.init(
						true,
						5,
						false,
						"sanfona"
							+ onde.id,
						altura);
					i3GEO.guias.ALTURACORPOGUIAS = altura;
				}
				for (g = 0; g < nguias; g++) {
					guia = i3GEO.guias.CONFIGURA[guias[g]];
					id = guia.id;
					guiaconteudo = $i(id);
					if (guiaconteudo) {
						if (guia.click === ""
							|| guia.click === undefined) {
							eval('$i("'
								+ id
								+ '").onclick = function(event){i3GEO.guias.mostra("'
								+ guias[g]
								+ '");}');
						} else {
							guiaconteudo.onclick = guia.click;
						}
						YAHOO.util.Event.addListener(
							$i(id),
							"click",
							YAHOO.util.Event.preventDefault);
						YAHOO.util.Event.addListener(
							$i(id),
							"click",
							YAHOO.util.Event.stopPropagation);
						YAHOO.util.Event.addFocusListener(
							$i(id),
							YAHOO.util.Event.preventDefault);
						guiaconteudo.onmouseover = function() {
						};
						guiaconteudo.onmouseout = function() {
						};
						temp = $i(guia.idconteudo);
						if (temp) {
							temp.style.overflow = "auto";
							if (i3GEO.guias.TIPO === "guia") {
								if (i3GEO.guias.ALTURACORPOGUIAS === 0) {
									temp.style.height = i3GEO.parametros.h
										+ "px";
								} else {
									temp.style.height = i3GEO.guias.ALTURACORPOGUIAS
										+ "px";
								}
							} else {
								temp.style.height = onde.style.height;
							}
						}
					}
				}
			} catch (e) {
			}
			if (i3GEO.guias.TIPO !== "tablet") {
				i3GEO.guias.mostra(i3GEO.guias.ATUAL);
				i3GEO.guias.ativa(i3GEO.guias.ATUAL);
			} else {
				i3GEO.guias.escondeGuias();
			}
		},
		/**
		 * Ajusta a altura das guias conforme a altura da imagem do mapa
		 */
		ajustaAltura : function() {
			var guia, guias, nguias, temp, temps, n, i, g, altura = 0;
			if (i3GEO.guias.ALTURACORPOGUIAS != 0) {
				altura = i3GEO.guias.ALTURACORPOGUIAS;
			}
			guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
			nguias = guias.length;
			for (g = 0; g < nguias; g++) {
				guia = $i(this.CONFIGURA[guias[g]].idconteudo);
				if (guia) {
					guia.style.overflow = "auto";
					if (this.TIPO === "guia") {
						if (altura === 0) {
							guia.style.height = i3GEO.parametros.h
								+ "px";
						} else {
							guia.style.height = altura
								+ "px";
						}

					}
					if (this.TIPO === "sanfona") {
						guia.style.height = altura
							+ "px";
						temp = $i("guiasYUI");
						if (temp) {
							temp.style.height = altura
								+ "px";
							temps = temp.getElementsByTagName("dd");
							n = temps.length;
							for (i = 0; i < n; i++) {
								if (temps[i].style.visibility == "visible") {
									temps[i].style.height = altura
										+ "px";
								}
							}
						}
						YAHOO.lutsr.accordion.properties.altura = altura;
					}
				}
			}
		},
		/**
		 * Esconde todas as guias
		 */
		escondeGuias : function() {
			var guias, nguias, g, temp, attributes, anim;
			guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
			nguias = guias.length;
			for (g = 0; g < nguias; g++) {
				temp = $i(this.CONFIGURA[guias[g]].idconteudo);
				if (temp) {
					if (i3GEO.guias.TIPO === "tablet"
						&& temp.style.display === "block") {
						temp.style.overflow = "hidden";
						attributes = {
							height : {
								to : 0
							},
							id : this.CONFIGURA[guias[g]].idconteudo
						};
						anim = new YAHOO.util.Anim(
							temp, attributes, 1, YAHOO.util.Easing.easeNone);
						anim.onComplete.subscribe(function() {
							var temp = $i(anim.attributes.id);
							temp.style.overflow = "auto";
							temp.style.display = "none";
							if (i3GEO.barraDeBotoes.BARRAS[0]) {
								i3GEO.barraDeBotoes.BARRAS[0].show();
							}
						});
						anim.animate();
					} else {
						temp.style.display = "none";
					}
				}
				if ($i(this.CONFIGURA[guias[g]].id)
					&& i3GEO.guias.TIPO !== "movel") {
					$i(this.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background = "transparent";
				}
			}
		},
		/**
		 * Mostra no mapa uma determinada guia
		 *
		 * Parametro:
		 *
		 * {String} - nome da guia
		 */
		mostra : function(guia) {
			var guias, nguias, g, temp, attributes, anim;
			guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
			nguias = guias.length;
			//
			// se a guia clicada j&aacute; estiver aberta na interface com
			// TABLET
			//
			if (!$i(i3GEO.guias.CONFIGURA[guia].idconteudo)) {
				return;
			}
			if ($i(i3GEO.guias.CONFIGURA[guia].idconteudo).style.display === "block"
				&& i3GEO.guias.TIPO === "tablet") {
				i3GEO.guias.escondeGuias();
				return;
			}
			if (i3GEO.guias.TIPO !== "movel") {
				for (g = 0; g < nguias; g++) {
					if ($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo)) {
						$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.display = "none";
					}
					if ($i(i3GEO.guias.CONFIGURA[guias[g]].id)) {
						$i(i3GEO.guias.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background = "transparent";
					}
				}
			}
			//
			// verifica se o nome da guia passado como parametro est&aacute;
			// correto
			// ou &eacute; o id da guia
			//
			if (i3GEO.guias.CONFIGURA.toString().search(
				guia) < 0) {
				for (g = 0; g < nguias; g++) {
					if (i3GEO.guias.CONFIGURA[guias[g]].id === guia) {
						guia = guias[g];
					}
				}
			}
			if (i3GEO.guias.CONFIGURA[guia]) {
				temp = $i(i3GEO.guias.CONFIGURA[guia].idconteudo);
				if (temp) {
					if (i3GEO.guias.TIPO === "tablet") {
						if (i3GEO.barraDeBotoes.BARRAS[0]) {
							i3GEO.barraDeBotoes.BARRAS[0].hide();
						}
						temp.style.left = (i3GEO.parametros.w / 2)
							- 150
							+ "px";
						temp.style.height = 0;// i3GEO.parametros.h - 10 +
												// "px";
						temp.style.display = "block";
						temp.style.zIndex = 9000;
						temp.style.overflow = "hidden";
						attributes = {
							height : {
								to : i3GEO.parametros.h - 10
							}
						};
						anim = new YAHOO.util.Anim(
							temp, attributes, 1, YAHOO.util.Easing.easeNone);
						anim.onComplete.subscribe(function() {
							temp.style.overflow = "auto";
							temp.style.display = "block";
						});
						if (DetectaMobile("DetectAndroid") === true) {
							temp.style.height = "";
							temp.style.overflow = "auto";
						} else {
							anim.animate();
						}
					} else {
						temp.style.display = "block";
					}
					if (i3GEO.guias.TIPO !== "movel") {
						$i(i3GEO.guias.CONFIGURA[guia].id).parentNode.parentNode.style.backgroundColor = "white";
					}
					i3GEO.guias.ATUAL = guia;
				}
			}
		},
		/**
		 * Function: ativa
		 *
		 * Ativa uma determinada guia
		 *
		 * Parametro:
		 *
		 * {String} - guia que ser&aacute; ativada
		 */
		ativa : function(guia) {
			try {
				i3GEO.guias.ATUAL = guia;
				if (i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click !== "") {
					i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click.call();
				}
			} catch (e) {
			}
		},
		/**
		 * Libera as guias do local atual, colocando-as em uma janela flutuante
		 * sobre o mapa.
		 */
		libera : function() {
			if (!$i("conteudojanelaguias")) {
				var i, w, pos, a, l, temp;
				$i(i3GEO.Interface.IDCORPO).style.left = "0px";
				if ($i(this.IDGUIAS)) {
					$i(this.IDGUIAS).style.display = "none";
				}
				i = $i("contemFerramentas");
				// if(i)
				// {i.style.display = "none";}
				w = parseInt(
					$i("contemFerramentas").style.width,
					10);
				$i("contemFerramentas").style.width = "0px";
				// visual foi depreciado na 4.7
				// i = $i("visual");
				// if (i)
				// {i.style.width="0px";i.innerHTML="";}
				pos = "px";
				a = i3GEO.parametros.h;
				l = i3GEO.parametros.w
					+ w;
				i3GEO.parametros.h = a;
				i3GEO.parametros.w = l;
				// if (navm)
				// {pos = "";}
				i = $i(i3GEO.Interface.IDCORPO);
				if (i) {
					i.style.width = l
						+ pos;
					i.style.height = a
						+ pos;
				}
				i = $i(i3GEO.Interface.IDMAPA);
				if (i) {
					i.style.width = l
						+ pos;
					i.style.height = a
						+ pos;
					i.style.clip = 'rect('
						+ 0
						+ " "
						+ (l * 1 + 2)
						+ " "
						+ (a * 1 + 2)
						+ " "
						+ 0
						+ ')';
				}
				i = $i("mst");
				if (i) {
					i.style.width = l
						+ 1
						+ pos;
				}
				i3GEO.mapa.ajustaPosicao();
				temp =
					function(retorno) {
						// carrega janela
						var novoel, temp, i, g, guias, nguias, janela;
						novoel = document.createElement("div");
						novoel.id = "janelaguias";
						novoel.style.display = "block";
						novoel.innerHTML =
							'<div class="hd">Guias <div onclick ="i3GEO.janela.minimiza(\'conteudojanelaguias\')" id="janelaguias_minimizaCabecalho" class="container-minimiza" ></div></div><div class="bd" id="conteudojanelaguias_corpo" style=padding:0px ></div>';
						temp = $i("i3geo") ? $i(
							"i3geo").appendChild(
							novoel) : document.body.appendChild(novoel);
						janela = new YAHOO.widget.Panel(
							"janelaguias", {
								width : "270px",
								fixedcenter : true,
								constraintoviewport : false,
								underlay : "none",
								close : false,
								visible : true,
								draggable : true,
								modal : false,
								iframe : true
							});
						YAHOO.i3GEO.janela.manager.register(janela);
						janela.render();
						janela.show();
						janela.cfg.setProperty(
							"y",
							0);
						i = $i(i3GEO.guias.IDGUIAS);
						$i(
							"conteudojanelaguias_corpo").appendChild(
							i);
						i.style.borderLeft = "1px solid black";
						i.style.borderRight = "1px solid black";
						guias = i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);
						nguias = guias.length;
						for (g = 0; g < nguias; g++) {
							if ($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo)) {
								$i(
									"conteudojanelaguias_corpo").appendChild(
									$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo));
								temp = $i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style;
								temp.background = "white";
								temp.border = "1px solid black";
								temp.borderTop = "0px solid black";
								temp.width = "270px";
								temp.left = "-1px";
								temp.height = i3GEO.parametros.h
									- 90
									+ "px";
							}
						}
						i3GEO.atualiza("");
						i.style.display = "block";
						i.style.left = "-1px";
						i.style.width = "270px";
					};
				i3GEO.php.mudatamanho(
					temp,
					a,
					l);
			} else {
				janela = YAHOO.i3GEO.janela.manager.find(id);
				janela.show();
				janela.bringToTop();
			}
		},
		/**
		 * Mostra uma determinada guia em uma janela do tipo ferramenta.
		 *
		 * As guias s&atilde;o constru&iacute;das pelo construtor da ferramenta
		 *
		 * Parametros:
		 *
		 * {String} - O elemento html cujo id for igual a guia+"obj"
		 * ter&aacute; seu estilo (display) definido como block, tornando-o
		 * vis&iacute;vel
		 *
		 * {String} - Todos os elementos html que tiverem como id o
		 * namespace, seguindo por um n&uacute;mero e "obj", ter&atilde;o seu
		 * estilo alterado para none, tornando-se invis&iacute;veis
		 *
		 */
		mostraGuiaFerramenta : function(guia, namespace) {
			var g, Dom = YAHOO.util.Dom;
			if (!namespace) {
				namespace = "guia";
			}
			for (g = 0; g < 12; g++) {
				Dom.setStyle(
					namespace
						+ g
						+ "obj",
					"display",
					"none");
			}
			Dom.setStyle(
				guia
					+ "obj",
				"display",
				"block");
		},
		/**
		 * Function: ajustaGuiaFerramenta
		 * 
		 * Ajusta as guias de uma janela para que sempre fiquem no topo da janela, aplicando o overflow ao conte&uacute;do das guias
		 * 
		 * Deve ser utilizado pelas ferramentas ap&oacute;s a janela ter seu conte&uacute;do renderizado.
		 * 
		 * Veja como exemplo a ferramenta tabela
		 * 
		 * Paremeters:
		 * 
		 * {string} - id da janela
		 * 
		 * {string} - namespace da janela utilizado para definir os elementos DIV onde o conte&uacute;do &eacute; renderizado
		 * 
		 */
		ajustaGuiaFerramenta : function(idjanela,namespace){
			var c = $i(idjanela + "_corpo"),
				h,
				g,
				temp;

			c.style.overflow = "unset";
			c.style.overflow = "none";

			h = c.style.height;
			h = parseInt(h,10) - 40 + "px";
			for (g = 0; g < 12; g++) {
				temp = $i(namespace
					+ "guia"
					+ g
					+ "obj");
				if(temp){
					temp.style.height = h;
					temp.style.width = "100%";
					temp.style.overflow = "auto";
				}
			}
		},
		/**
		 * Section: guiaMovel
		 *
		 * Controla as guias do tipo "movel", que apresenta uma janela
		 * retr&aacute;til onde as op&ccedil;&otilde;es s&atilde;o mostradas
		 */
		guiaMovel : {
			/**
			 * Propriedade: ABERTA
			 *
			 * Indica se a guia inicializar&aacute; aberta
			 *
			 * Type:
			 *
			 * {boolean}
			 *
			 * Default:
			 *
			 * false
			 */
			ABERTA : false,
			/**
			 * Propriedade: config
			 *
			 * Define os valores de posicionamento dos elementos que
			 * comp&otilde;em a guia
			 *
			 * Default:
			 *
			 * (start code)
			 * i3GEO.guias.guiaMovel.config = {
			 * 		larguraPuxador : 50,
			 * 		alturaPuxador : 319,
			 * 		alturaGuiaMovel : 0,
			 * 		larguraGuiaMovel : 320,
			 * 		topGuiaMovel : 0,
			 * 		guias : {
			 * 			icones : [],
			 * 			ids : [],
			 * 			idsconteudos : [],
			 * 			titulos : [],
			 * 			chaves : []
			 * 		},
			 * 		posicao : [
			 * 			"c",
			 * 			"r"
			 * 		]
			 * };
			 * (end)
			 */
			config : {
				larguraPuxador : 50,
				alturaPuxador : 319,
				alturaGuiaMovel : 0,
				larguraGuiaMovel : 320,
				topGuiaMovel : 0,
				guias : {
					icones : [],
					ids : [],
					idsconteudos : [],
					titulos : [],
					chaves : []
				},
				posicao : [
					"c",
					"r"
				]
			},
			/**
			 * Valor de posicionamento a esquerda, calculado na
			 * inicializa&ccedil;&atilde;o
			 */
			left : 0,
			/**
			 * Function: inicia
			 *
			 * Inicializa a guia m&oacute;vel
			 */
			inicia : function() {
				var posMapa = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDMAPA)), centroY = posMapa[1]
					+ (i3GEO.parametros.h / 2), config = i3GEO.guias.guiaMovel.config, temp;

				if (i3GEO.guias.ALTURACORPOGUIAS === 0
					&& config.alturaGuiaMovel === 0) {
					i3GEO.guias.guiaMovel.config.alturaGuiaMovel = i3GEO.parametros.h;
				} else {
					i3GEO.guias.guiaMovel.config.alturaGuiaMovel = i3GEO.guias.ALTURACORPOGUIAS;
				}
				config = i3GEO.guias.guiaMovel.config;

				temp = $i("i3GEOguiaMovel").style;
				if (config.posicao[1] === "r") {
					temp.left = (posMapa[0]
						+ i3GEO.parametros.w - config.larguraPuxador)
						+ "px";
					i3GEO.guias.guiaMovel.left = parseInt(
						temp.left,
						10)
						+ "px";
				}
				if (config.posicao[1] === "l") {
					temp.left = posMapa[0]
						+ "px";
					i3GEO.guias.guiaMovel.left = parseInt(
						temp.left,
						10)
						+ "px";
				}
				if (config.topGuiaMovel === 0) {
					temp.top = (centroY - ((config.alturaGuiaMovel - 42) / 2))
						+ "px";
				} else {
					temp.top = config.topGuiaMovel
						+ "px";
				}
				temp.width = config.larguraPuxador
					+ "px";
				temp.height = config.alturaGuiaMovel
					+ "px";
				// aberta temp.width = config.larguraPuxador +
				// config.larguraGuiaMovel + "px";

				temp = $i("i3GEOguiaMovelMolde").style;
				temp.top = "0px";
				if (config.posicao[1] === "r") {
					temp.left = config.larguraPuxador
						+ "px";
				}
				if (config.posicao[1] === "l") {
					temp.left = "1px";
				}

				temp.height = config.alturaGuiaMovel
					+ "px";
				temp.backgroundColor = "white";

				if ($i("i3GEOguiaMovelPuxador")) {
					temp = $i("i3GEOguiaMovelPuxador").style;
					temp.top = ((config.alturaGuiaMovel - config.alturaPuxador) / 2)
						+ "px";
					temp.left = "0px";
					temp.width = config.larguraPuxador
						+ "px";
					temp.height = config.alturaPuxador
						+ "px";
				}
				temp = $i("i3GEOguiaMovelIcones");
				if (temp) {
					temp = temp.style;
					temp.left = "1px";
					temp.top = "1px";
					temp.width = (config.larguraGuiaMovel - 1)
						+ "px";
					temp.height = "35px";

					if (navm) {
						temp.height = "37px";
					}
					temp.zIndex = 5;
					temp.paddingTop = "2px";
					YAHOO.util.Dom.setStyle(
						"i3GEOguiaMovelIcones",
						"opacity",
						0.70);
				}
				temp = $i("i3GEOguiaMovelConteudo").style;
				temp.left = "1px";
				if (temp.top == "") {
					temp.top = "38px";
				}
				temp.height = (config.alturaGuiaMovel - 39)
					+ "px";
				if (navm) {
					temp.width = (config.larguraGuiaMovel - 1)
						+ "px";
				} else {
					temp.width = (config.larguraGuiaMovel - 5)
						+ "px";
				}
				temp.paddingLeft = "4px";

				YAHOO.util.Dom.setStyle(
					"i3GEOguiaMovelConteudo",
					"opacity",
					0.70);

				YAHOO.util.Dom.setStyle(
					"i3GEOguiaMovelMolde",
					"opacity",
					0.10);
				$i("i3GEOguiaMovelMolde").onmouseover = function() {
					if ($i("i3GEOguiaMovelConteudo").style.display === "block") {
						YAHOO.util.Dom.setStyle(
							"i3GEOguiaMovelMolde",
							"opacity",
							0.9);
					}
					if ($i("i3GEOguiaMovelIcones")
						&& $i("i3GEOguiaMovelIcones").innerHTML === "") {
						i3GEO.guias.guiaMovel.mostraIcones();
					}
				};
				$i("i3GEOguiaMovelMolde").onmouseout = function() {
					YAHOO.util.Dom.setStyle(
						"i3GEOguiaMovelMolde",
						"opacity",
						0.90);
					if ($i("i3GEOguiaMovelIcones")
						&& $i("i3GEOguiaMovelIcones").innerHTML === "") {
						i3GEO.guias.guiaMovel.mostraIcones();
					}
				};
				if (i3GEO.guias.guiaMovel.ABERTA === true) {
					i3GEO.guias.guiaMovel.ativa(i3GEO.guias.ATUAL);
				}
				i3GEO.guias.guiaMovel.mostraIcones();
				temp = $i("i3GEOguiaMovel");
				temp.style.visibility = "visible";
				// evita sobreposicao com elementos que tenham onclick
				temp.style.height = parseInt(temp.style.height)
					- 20
					+ "px";
				i3GEO.util.aparece(
					"i3GEOguiaMovel",
					300,
					100);
			},
			/**
			 * Mostra os &iacute;cones que acionam cada guia
			 */
			mostraIcones : function() {
				if ($i("i3GEOguiaMovelIcones")
					&& $i("i3GEOguiaMovelIcones").innerHTML != "") {
					return;
				}
				var n = i3GEO.guias.guiaMovel.config.guias.icones.length, i, temp = i3GEO.guias.guiaMovel.config.guias, ins = "", ico;
				if (i3GEO.guias.ORDEM !== "") {
					temp.chaves = i3GEO.guias.ORDEM;
				}
				for (i = 0; i < n; i++) {
					if (temp.chaves[i]) {
						ico =
							"<button title='"
								+ temp.titulos[i]
								+ "' onmouseout='javascript:this.className = \"iconeGuiaMovel iconeGuiaMovelMouseOut\"' onmouseover='javascript:this.className = \"iconeGuiaMovel iconeGuiaMovelMouseOver\"' onclick='i3GEO.guias.guiaMovel.ativa(\""
								+ temp.chaves[i]
								+ "\")' class=iconeGuiaMovel ><img id='"
								+ temp.ids[i]
								+ "' src='"
								+ i3GEO.configura.locaplic
								+ "/"
								+ temp.icones[i]
								+ "' style='cursor:pointer;' /></button>";
						// verifica se existe um id na interface
						// se existir, o icone e inserido nesse id
						if (!$i("iconeGuia_"
							+ temp.chaves[i])) {
							ins += ico;
						} else {
							$i("iconeGuia_"
								+ temp.chaves[i]).innerHTML = ico;
						}
					}
				}
				if ($i("i3GEOguiaMovelIcones")) {
					$i("i3GEOguiaMovelIcones").innerHTML = ins;
				}
				ins = "1.2px";
				if (navm) {
					ins = "2px";
				}
				for (i = 0; i < n; i++) {
					ico = $i(temp.ids[i]);
					if (ico) {
						YAHOO.util.Dom.setStyle(
							ico,
							"padding",
							ins);
					}
				}

				i3GEO.guias.guiaMovel.desativaIcones();
				if (i3GEO.guias.ATUAL != "") {
					ico = $i(i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].id);
					if (ico) {
						YAHOO.util.Dom.setStyle(
							ico,
							"opacity",
							0.9);
						ico.parentNode.style.boxShadow = "none";
					}
				}
			},
			/**
			 * Altera a cor do fundo dos &iacute;cones, voltando ao original
			 */
			desativaIcones : function() {
				var ims, n, i;

				ims = $i("i3GEOguiaMovelIcones");
				if (ims) {
					ims = ims.getElementsByTagName("button");
					n = ims.length;
					for (i = 0; i < n; i++) {
						YAHOO.util.Dom.setStyle(
							ims[i],
							"opacity",
							0.7);
						ims[i].style.boxShadow = "";
					}
				}
				// verifica se existem icones fora do container
				n = i3GEO.guias.guiaMovel.config.guias.icones.length;
				temp = i3GEO.guias.guiaMovel.config.guias;
				for (i = 0; i < n; i++) {
					if ($i("iconeGuia_"
						+ temp.chaves[i])) {
						ims = $i(
							"iconeGuia_"
								+ temp.chaves[i]).getElementsByTagName(
							"button");
						if (ims.length > 0) {
							ims[0].style.backgroundColor = "white";
							ims[0].style.boxShadow = "none";
							ims[0].style.margin = "0px";
							ims[0].style.padding = "0px";
							if (chro === true) {
								ims[0].style.padding = "1.7px";
							}
							ims[0].style.border = "1px solid gray";
							if (i3GEO.guias.guiaMovel.config.posicao[1] === "l") {
								ims[0].style.borderLeft = "0px solid white";
							} else {
								ims[0].style.borderRight = "0px solid white";
							}

							YAHOO.util.Dom.setStyle(
								ims[0],
								"opacity",
								0.7);
							ims[0].blur();
						}
					}
				}
			},
			/**
			 * Ativa o conte&uacute;do de determinada guia
			 *
			 * Parametro:
			 *
			 * chave {string} - c&oacute;digo da guia, definido em
			 * i3GEO.guias.CONFIGURA
			 */
			ativa : function(chave) {
				if (chave === "") {
					i3GEO.guias.guiaMovel.desativaIcones();
					return;
				}
				i3GEO.guias.escondeGuias();
				i3GEO.guias.guiaMovel.desativaIcones();
				if (i3GEO.guias.ATUAL === chave
					&& $i("i3GEOguiaMovelMolde").style.display === "block") {
					i3GEO.guias.ATUAL = "";
					i3GEO.guias.guiaMovel.abreFecha("fecha");
				} else {
					i3GEO.guias.ATUAL = chave;
					i3GEO.guias.guiaMovel.abreFecha("abre");
					if (i3GEO.guias.CONFIGURA[chave].click) {
						i3GEO.guias.CONFIGURA[chave].click.call();
					}
					i3GEO.guias.mostra(chave);

					var ico = $i(i3GEO.guias.CONFIGURA[chave].id);
					if (ico) {
						ico.parentNode.blur();
						YAHOO.util.Dom.setStyle(
							ico.parentNode,
							"opacity",
							0.9);
						ico.parentNode.style.boxShadow = "none";
						// verifica se esta fora do lugar normal e muda a borda
						if ($i("iconeGuia_"
							+ chave)) {
							if (i3GEO.guias.guiaMovel.config.posicao[1] === "l") {
								ico.parentNode.style.borderLeft = "2px solid white";
							} else {
								ico.parentNode.style.borderRight = "2px solid white";
							}
						}
					}
				}
			},
			/**
			 * Reposiciona a guia m&oacute;vel quando o mapa muda de tamanho
			 */
			reposiciona : function() {
				var temp = $i("i3GEOguiaMovel").style.top;
				i3GEO.guias.guiaMovel.config.alturaGuiaMovel = 0;
				i3GEO.guias.ALTURACORPOGUIAS = 0;
				if ($i("i3GEOguiaMovelIcones")) {
					$i("i3GEOguiaMovelIcones").style.display = "none";
				}
				$i("i3GEOguiaMovelConteudo").style.display = "none";
				$i("i3GEOguiaMovelMolde").style.display = "none";
				i3GEO.guias.escondeGuias();
				i3GEO.guias.guiaMovel.inicia();
				$i("i3GEOguiaMovel").style.top = temp;
			},
			/**
			 * Function: abreFecha
			 *
			 * Abre ou fecha a guia m&oacute;vel
			 */
			abreFecha : function(forca) {
				var molde = $i("i3GEOguiaMovelMolde"), guia = $i("i3GEOguiaMovel"), attributes, anim, anim1, anim2, temp;
				// para efeitos de compatibilidade caso seja chamado com
				// i3GEO.guias.guiaMovel.abreFecha()
				if (!forca) {
					if (molde.style.display === "block") {
						forca = "fecha";
					} else {
						temp = i3GEO.guias.ATUAL;
						i3GEO.guias.ATUAL = "";
						i3GEO.guias.guiaMovel.ativa(temp);
						return;
					}
				}
				if (forca === "fecha") {// esconde
					if ($i("i3GEOguiaMovelIcones")) {
						$i("i3GEOguiaMovelIcones").style.display = "none";
					}
					$i("i3GEOguiaMovelConteudo").style.display = "none";
					attributes = {
						left : {
							to : parseInt(
								i3GEO.guias.guiaMovel.left,
								10)
						},
						id : "i3GEOguiaMovel"
					};
					anim = new YAHOO.util.Anim(
						guia, attributes, 1, YAHOO.util.Easing.easeNone);
					attributes = {
						width : {
							to : 0
						},
						id : "i3GEOguiaMovelMolde"
					};
					anim1 = new YAHOO.util.Anim(
						molde, attributes, 1, YAHOO.util.Easing.easeNone);
					anim.duration = 0.5;
					anim1.duration = 0.5;
					anim1.onComplete.subscribe(function() {
						molde.style.display = "none";
					});
					if (i3GEO.guias.guiaMovel.config.posicao[1] === "l"
						&& $i("i3GEOguiaMovelIconesPuxador")) {
						attributes = {
							left : {
								to : 0
							}
						};
						anim2 = new YAHOO.util.Anim(
							"i3GEOguiaMovelIconesPuxador", attributes, 1, YAHOO.util.Easing.easeNone);
						anim2.duration = 0.5;
						anim2.animate();
					}
					anim.animate();
					anim1.animate();

				} else if (molde.style.display != "block") {
					molde.style.display = "block";
					if (i3GEO.guias.guiaMovel.config.posicao[1] === "l") {
						attributes = {
							rigth : {
								to : (parseInt(
									guia.style.left,
									10) - i3GEO.guias.guiaMovel.config.larguraGuiaMovel)
									* -1
							},
							id : "i3GEOguiaMovel"
						};
					} else {
						attributes = {
							left : {
								to : parseInt(
									guia.style.left,
									10)
									- i3GEO.guias.guiaMovel.config.larguraGuiaMovel
							},
							id : "i3GEOguiaMovel"
						};
					}
					anim = new YAHOO.util.Anim(
						guia, attributes, 1, YAHOO.util.Easing.easeNone);
					attributes = {
						width : {
							to : i3GEO.guias.guiaMovel.config.larguraGuiaMovel
						},
						id : "i3GEOguiaMovelMolde"
					};
					anim1 = new YAHOO.util.Anim(
						molde, attributes, 1, YAHOO.util.Easing.easeNone);
					anim.duration = 0.5;
					anim1.duration = 0.5;
					anim1.onComplete.subscribe(function() {
						if ($i("i3GEOguiaMovelIcones")) {
							$i("i3GEOguiaMovelIcones").style.display = "block";
						}
						$i("i3GEOguiaMovelConteudo").style.display = "block";
						// i3GEO.guias.guiaMovel.mostraIcones();
						YAHOO.util.Dom.setStyle(
							"i3GEOguiaMovelMolde",
							"opacity",
							0.9);
					});
					if (i3GEO.guias.guiaMovel.config.posicao[1] === "l"
						&& $i("i3GEOguiaMovelIconesPuxador")) {
						attributes = {
							left : {
								to : i3GEO.guias.guiaMovel.config.larguraGuiaMovel
							}
						};
						anim2 = new YAHOO.util.Anim(
							"i3GEOguiaMovelIconesPuxador", attributes, 1, YAHOO.util.Easing.easeNone);
						anim2.duration = 0.5;
						anim2.animate();
					}
					anim.animate();
					anim1.animate();
				}
			}
		}
	};
