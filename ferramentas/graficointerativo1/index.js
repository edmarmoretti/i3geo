/**
 * Title: Gr&aacute;fico interativo 1
 *
 * Representa&ccedil;&atilde;o gr&aacute;fica de dados. O gr&aacute;fico &eacute; constru&iacute;do tendo como base os atributos de um tema
 * e &eacute; modificado conforme o usu&aacute;rio navega pelo mapa. A renderiza&ccedil;&atilde;o do gr&aacute;fico &eacute; feito pelo
 * navegador por meio do aplicativo openflashchart. Os dados que ser&atilde;o utilizados no gr&aacute;fico s&atilde;o baseados em um
 * elemento TABLE. Esse elemento pode ser montado com base na tabela de atributos e editada pelo usu&aacute;rio. Os dados podem
 * tamb&eacute;m ser inseridos como par&acirc;metros na inicializa&ccedil;&atilde;o da ferramenta, permitindo que o gr&aacute;fico seja
 * utilizado por outras ferramentas.
 *
 * Veja:
 *
 * <i3GEO.analise.dialogo.graficointerativo1>
 *
 * Arquivo:
 *
 * i3geo/ferramentas/graficointerativo1/index.js.php
 *
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/**
 * Classe: i3GEOF.graficointerativo1
 *
 */
i3GEOF.graficointerativo1 =
	{
		/**
		 * Array com os ids das janelas ja criadas
		 */
		janelas : [],
		propJanelas : {},
		/**
		 * Template no formato mustache E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function(idjanela) {
			return {
				"idjanela" : idjanela,
				"idjanelaA" : '"'+idjanela+'"',
				"locaplic" : i3GEO.configura.locaplic,
				"prop": $trad("p13"),
				"tipo": $trad(1, i3GEOF.graficointerativo1.dicionario),
				"dados": $trad(2, i3GEOF.graficointerativo1.dicionario),
				"grafico": $trad(3, i3GEOF.graficointerativo1.dicionario),
				"escolhatipo": $trad(4, i3GEOF.graficointerativo1.dicionario),
				"pizza2d": $trad(5, i3GEOF.graficointerativo1.dicionario),
				"areasimp": $trad(6, i3GEOF.graficointerativo1.dicionario),
				"distpt": $trad(7, i3GEOF.graficointerativo1.dicionario),
				"linhassimp": $trad(8, i3GEOF.graficointerativo1.dicionario),
				"arvore": $trad(9, i3GEOF.graficointerativo1.dicionario),
				"barrasv": $trad(10, i3GEOF.graficointerativo1.dicionario),
				"barrash": $trad(11, i3GEOF.graficointerativo1.dicionario),
				"configgr": $trad(12, i3GEOF.graficointerativo1.dicionario),
				"tema": $trad(13, i3GEOF.graficointerativo1.dicionario),
				"titulo": $trad(50, i3GEOF.graficointerativo1.dicionario),
				"titux": $trad(51, i3GEOF.graficointerativo1.dicionario),
				"tituy":$trad(52, i3GEOF.graficointerativo1.dicionario),
				"itemcx": $trad(14, i3GEOF.graficointerativo1.dicionario),
				"itemcy": $trad(15, i3GEOF.graficointerativo1.dicionario),
				"excluirval": $trad(16, i3GEOF.graficointerativo1.dicionario),
				"geracor": $trad(17, i3GEOF.graficointerativo1.dicionario),
				"obterdados": $trad(18, i3GEOF.graficointerativo1.dicionario),
				"seescolher": $trad(19, i3GEOF.graficointerativo1.dicionario),
				"inclinax": $trad(20, i3GEOF.graficointerativo1.dicionario),
				"adlinbarras": $trad(21, i3GEOF.graficointerativo1.dicionario),
				"utilizvalacum": $trad(22, i3GEOF.graficointerativo1.dicionario),
				"utilizvalrelat": $trad(23, i3GEOF.graficointerativo1.dicionario),
				"ordenax": $trad(24, i3GEOF.graficointerativo1.dicionario),
				"naoprocessa": $trad(25, i3GEOF.graficointerativo1.dicionario),
				"stacked": $trad(48, i3GEOF.graficointerativo1.dicionario),
				"linhasnascols": $trad(49, i3GEOF.graficointerativo1.dicionario),
				"media": $trad(27, i3GEOF.graficointerativo1.dicionario),
				"tipoagregay": $trad(28, i3GEOF.graficointerativo1.dicionario),
				"fatcalclarg": $trad(29, i3GEOF.graficointerativo1.dicionario),
				"janelasep": $trad(30, i3GEOF.graficointerativo1.dicionario),
				"soma": $trad(26, i3GEOF.graficointerativo1.dicionario),
				"i3GEOgraficointerativo1Titulo": $inputText("", "", idjanela + "i3GEOgraficointerativo1Titulo", "", 40, ""),
				"i3GEOgraficointerativo1TituloX": $inputText("", "", idjanela + "i3GEOgraficointerativo1TituloX", "", 40, ""),
				"i3GEOgraficointerativo1TituloY": $inputText("", "", idjanela + "i3GEOgraficointerativo1TituloY", "", 40, ""),
				"i3GEOgraficointerativo1excluir": $inputText("", "", idjanela + "i3GEOgraficointerativo1excluir", "", 3, "")
			};
		},
		/**
		 * Propriedade: dados
		 *
		 * Dados que serao utilizados. Pode ser passado como parametro.
		 *
		 * Default: {false}
		 */
		dados : false,
		/**
		 * Propriedade: titulo
		 *
		 * T&iacute;tulo do gr&aacute;fico. Se for vazio, ser&aacute; obtido do nome do tema selecionado
		 */
		titulo : "",
		/**
		 * Propriedade: tipo
		 *
		 * Tipo de gr&aacute;fico escolhido pelo usu&aacute;rio.
		 */
		tipo : "",
		/**
		 * Propriedade: acumula
		 *
		 * Acumula os valores ao gerar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		acumula : false,
		/**
		 * Propriedade: relativa
		 *
		 * Utiliza valores relativos ao criar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		relativa : false,
		/**
		 * Propriedade: dadospuros
		 *
		 * N&atilde;o faz nenhum tipo de processamento nos dados antes de gerar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		dadospuros : false,
		/**
		 * Function: iniciaDicionario
		 *
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
		 *
		 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function(dados) {
			i3GEOF.tabela.iniciaJanelaFlutuante(dados);
		},
		/**
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametros:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 *
		 * dados {JSON} - dados para o gr&aacute;fico (opcional) exemplo
		 * ["n;x","'Argentina';33796870","'Paraguay';4773464","'Brazil';151525400","'Chile';13772710"]
		 */
		inicia : function(iddiv, idjanela) {
			// try{
			$i(iddiv).innerHTML += i3GEOF.graficointerativo1.html(idjanela);
			$i(idjanela + "i3GEOgraficointerativo1Acumula").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].acumula;
			$i(idjanela + "i3GEOgraficointerativo1Relativa").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].relativa;
			$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = i3GEOF.graficointerativo1.propJanelas[idjanela].dadospuros;
			// tipos de graficos
			$i(idjanela + "i3GEOgraficointerativo1guia1").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// dados para o grafico
			$i(idjanela + "i3GEOgraficointerativo1guia2").onclick = function() {
				if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia2", idjanela + "i3GEOgraficointerativo1guia");
				i3GEOF.graficointerativo1.configuraDados(idjanela);
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// propriedades adicionais
			$i(idjanela + "i3GEOgraficointerativo1guia3").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia3", idjanela + "i3GEOgraficointerativo1guia");
				$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			// mostra o grafico
			$i(idjanela + "i3GEOgraficointerativo1guia4").onclick = function() {
				if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia4", idjanela + "i3GEOgraficointerativo1guia");
				var t = $i(idjanela + "i3GEOgraficointerativo1Grafico");
				t.style.display = "block";
				t.style.position = "relative";
				t.style.top = "-5px";
				t.visibility = "visible";
				i3GEOF.graficointerativo1.tabela2dados(idjanela);
			};
			$i(idjanela + "i3GEOgraficointerativo1guia5").onclick =
				function() {
					if (i3GEOF.graficointerativo1.tipo === "") {
						alert($trad(4, i3GEOF.graficointerativo1.dicionario));
						return;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
						return;
					}
					i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia5", idjanela + "i3GEOgraficointerativo1guia");
					$i(idjanela + "i3GEOgraficointerativo1Grafico").style.display = "none";
					$i(idjanela + "i3GEOgraficointerativo1guia5obj").innerHTML =
						"<textarea rows='20' cols='52' >" + (i3GEOF.graficointerativo1.tabela2csv()).join("\n") + "</textarea>";
				};
			$i(idjanela + "i3GEOgraficointerativo1guia6").onclick =
				function() {
					if (i3GEOF.graficointerativo1.tipo === "") {
						alert($trad(4, i3GEOF.graficointerativo1.dicionario));
						return;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML === "") {
						return;
					}
					var w, h, form = $i(idjanela + "i3GEOgraficointerativo1PNG"), isvg = form.getElementsByTagName("input")[0], svg =
						$i(idjanela + "i3GEOgraficointerativo1guia4objCanvas").firstChild;
					h = svg.getAttributeNS(null, 'height');
					w = svg.getAttributeNS(null, 'width');
					if (typeof XMLSerializer != "undefined") {
						svg = (new XMLSerializer()).serializeToString(svg);
					} else {
						svg = svg.html();
					}
					isvg.value = svg;
					form.action = form.action + "?" + "w=" + w + "&h=" + h;
					form.submit();
				};
			i3GEOF.graficointerativo1.ativaFoco(idjanela);
			i3GEOF.graficointerativo1.comboTemas(idjanela);
			new YAHOO.widget.Button(idjanela + "i3GEOgraficointerativo1botao1", {
				onclick : {
					fn : function() {
						i3GEOF.graficointerativo1.obterDados(idjanela);
					}
				}
			});
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].dados
				&& i3GEOF.graficointerativo1.propJanelas[idjanela].dados != "undefined") {
				i3GEOF.graficointerativo1.montaTabelaDados(idjanela, i3GEOF.graficointerativo1.propJanelas[idjanela].dados);
				$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
			} else {
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
			}
		},
		/**
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function(idjanela) {
			var ins = Mustache.render(i3GEOF.graficointerativo1.MUSTACHE, i3GEOF.graficointerativo1.mustacheHash(idjanela));
			return ins;
		},
		/**
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 *
		 * Parametro
		 *
		 * dados {JSON} - dados para o gr&aacute;fico
		 */
		iniciaJanelaFlutuante : function(dados) {
			var minimiza, cabecalho, janela, divid, temp, titulo, idjanela;
			// id utilizado para diferenciar cada janela e seus respectivos
			// componentes
			idjanela = "graficoi" + parseInt(Math.random() * 1000000, 10);
			i3GEOF.graficointerativo1.janelas.push(idjanela);
			i3GEOF.graficointerativo1.propJanelas[idjanela] = {};
			i3GEOF.graficointerativo1.propJanelas[idjanela].tema = i3GEO.temaAtivo;
			i3GEOF.graficointerativo1.propJanelas[idjanela].atualiza = true;
			i3GEOF.graficointerativo1.propJanelas[idjanela].dados = dados;

			// guarda para esse grafico alguns valores default obtidos dos
			// parametros gerais da ferramenta
			i3GEOF.graficointerativo1.propJanelas[idjanela].acumula = i3GEOF.graficointerativo1.acumula;
			i3GEOF.graficointerativo1.propJanelas[idjanela].relativa = i3GEOF.graficointerativo1.relativa;
			i3GEOF.graficointerativo1.propJanelas[idjanela].dadospuros = i3GEOF.graficointerativo1.dadospuros;

			if (dados) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].dados = dados;
			}

			// cria a janela flutuante
			cabecalho = function() {
				i3GEOF.graficointerativo1.ativaFoco(idjanela);
			};
			minimiza = function() {
				i3GEO.janela.minimiza(idjanela);
			};
			mudaTamanhoGrafico = function() {
				var t = $i(idjanela + "i3GEOgraficointerativo1Grafico");
				if (t.style.display === "block") {
					i3GEOF.graficointerativo1.tabela2dados(idjanela);
				}
			};
			duplica = function() {
				i3GEOF.graficointerativo1.iniciaJanelaFlutuante();
			};
			titulo =
				"&nbsp;&nbsp;&nbsp;" + $trad("t37b") + " <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=3&idajuda=84' >&nbsp;&nbsp;&nbsp;</a>";
			janela =
				i3GEO.janela.cria(
					"480px",
					"450px",
					"",
					"",
					"",
					titulo,
					idjanela,
					false,
					"hd",
					cabecalho,
					minimiza,
					mudaTamanhoGrafico,
					true,
					i3GEO.configura.locaplic + "/imagens/oxygen/16x16/view-statistics.png",
					duplica);

			divid = janela[2].id;
			i3GEOF.graficointerativo1.aguarde = $i(idjanela + "_imagemCabecalho").style;
			$i(idjanela + "_corpo").style.backgroundColor = "white";
			$i(idjanela + "_corpo").style.overflow = "auto";

			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde = $i(idjanela + "_imagemCabecalho").style;
			i3GEOF.graficointerativo1.propJanelas[idjanela].atualiza = true;
			// indica se a janela sera atualizada na navegacao
			temp = 'i3GEOF.graficointerativo1.propJanelas["' + idjanela + '"].atualiza = this.checked';
			janela[0]
				.setFooter("<div style=background-color:#F2F2F2; ><input class='inputsb' checked style='cursor:pointer;position:relative;top:2px;' onclick='"
					+ temp + "' type=checkbox />&nbsp;" + $trad(53, i3GEOF.graficointerativo1.dicionario) + " (" + idjanela + ")</div>");

			i3GEOF.graficointerativo1.inicia(divid, idjanela);

			if (!i3GEO.Interface) {
				return;
			}
			i3GEO.janela.tempoMsg($trad(37, i3GEOF.graficointerativo1.dicionario));
			if (i3GEO.Interface.ATUAL === "openlayers") {
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo1.atualizaListaDeRegistros()");
			}
			if (i3GEO.Interface.ATUAL === "googlemaps") {
				graficointerativo1Dragend = GEvent.addListener(i3GeoMap, "dragend", function() {
					i3GEOF.graficointerativo1.atualizaListaDeRegistros();
				});
				graficointerativo1Zoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {
					i3GEOF.graficointerativo1.atualizaListaDeRegistros();
				});
			}
			if (i3GEO.Interface.ATUAL === "googleearth") {
				graficointerativo1Dragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {
					i3GEOF.graficointerativo1.atualizaListaDeRegistros();
				});
			}
			temp = function() {
				i3GEOF.graficointerativo1.janelas.remove(idjanela);
				i3GEOF.graficointerativo1.propJanelas[idjanela] = null;
				if (i3GEOF.graficointerativo1.janelas.length === 0) {
					if (i3GEO.Interface.ATUAL === "openlayers") {
						i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo1.atualizaListaDeRegistros()");
					}
					if (i3GEO.Interface.ATUAL === "googlemaps") {
						google.maps.event.removeListener(graficointerativo1Dragend);
						google.maps.event.removeListener(graficointerativo1Zoomend);
					}
					if (i3GEO.Interface.ATUAL === "googleearth") {
						google.earth.removeEventListener(graficointerativo1Dragend);
					}
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			janela[0].bringToTop();
		},
		/**
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function(idjanela) {
			if (i3GEO.Interface) {
				i3GEO.barraDeBotoes.ativaIcone("graficointerativo1");
			}
			var i = $i(idjanela + "_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = i3GEO.janela.ULTIMOZINDEX;
		},
		novaJanela : function(idjanela) {
			var janela = "", divid, g, v, cabecalho, id, minimiza, titulo;
			g = $i(idjanela + "i3GEOgraficointerativo1guia4objCanvas");
			v = g.cloneNode(true);
			cabecalho = function() {
			};
			id = YAHOO.util.Dom.generateId();
			minimiza = function() {
				i3GEO.janela.minimiza(id);
			};
			titulo = "&nbsp;&nbsp;&nbsp;" + i3GEOF.graficointerativo1.propJanelas[idjanela].titulo;
			janela = i3GEO.janela.cria("380px", "280px", "", "", "", titulo, id, false, "hd", cabecalho, minimiza);
			divid = janela[2].id;
			$i(divid).style.marginTop = "0px";
			v.id = id + "ngrafico";
			v.style.marginTop = "0px";
			$i(divid).appendChild(v);
		},
		/**
		 * Function: comboTemas
		 *
		 * Monta o combo para escolha do tema que ser&aacute; utilizado no gr&aacute;fico
		 */
		comboTemas : function(idjanela) {
			if (!i3GEO.Interface) {
				return;
			}
			i3GEO.util.comboTemas(idjanela + "i3GEOgraficointerativo1ComboTemasId", function(retorno) {
				$i(idjanela + "i3GEOgraficointerativo1ComboTemas").innerHTML = retorno.dados;
				$i(idjanela + "i3GEOgraficointerativo1ComboTemas").style.display = "block";
				if ($i(idjanela + "i3GEOgraficointerativo1ComboTemasId")) {
					$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").onchange = function() {
						i3GEO.mapa.ativaTema($i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value);
						i3GEOF.graficointerativo1.comboItensSel(idjanela);
					};
				}
				if (i3GEO.temaAtivo !== "") {
					$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value = i3GEO.temaAtivo;
					$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").onchange.call();
				}
			}, idjanela + "i3GEOgraficointerativo1ComboTemas", "", false, "ligados", "font-size:12px;width:350px");
		},
		/**
		 * Function: ativaTipo
		 *
		 * Define a vari&aacute;vel com o tipo de gr&aacute;fico e mostra a guia2
		 */
		ativaTipo : function(obj, idjanela) {
			if (obj) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].tipo = obj.value;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo == "ponto_1") {
				$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = true;
			} else {
				$i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked = false;
			}
			if (!$i(idjanela + "i3GEOgraficointerativo1tabeladados") || $i(idjanela + "i3GEOgraficointerativo1tabeladados").innerHTML == "") {
				$i(idjanela + "i3GEOgraficointerativo1guia2").onclick.call();
			} else {
				$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
			}
		},
		alteraFatorPixel : function(tipo, idjanela) {
			var delta = 20, temp = $i(idjanela + "i3GEOgraficointerativo1FatorTamanho"), v = parseInt(temp.value, 10);
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
			$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
		},
		/**
		 * Function: configuraDados
		 *
		 * Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para cada tipo de gr&aacute;fico
		 */
		configuraDados : function(idjanela) {
			var ativa = function(comboxlinha, comboylinha, ajudapizza) {
				try {
					$i(idjanela + "i3GEOgraficointerativo1ComboXlinha").style.display = comboxlinha;
					$i(idjanela + "i3GEOgraficointerativo1ComboYlinha").style.display = comboylinha;
					$i(idjanela + "i3GEOgraficointerativo1AjudaPizza").style.display = ajudapizza;
				} catch (e) {
				}
			};
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "") {
				i3GEO.janela.tempoMsg($trad(31, i3GEOF.graficointerativo1.dicionario));
				i3GEO.guias.mostraGuiaFerramenta(idjanela + "i3GEOgraficointerativo1guia1", idjanela + "i3GEOgraficointerativo1guia");
				return;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo === "pizza2d") {
				ativa.call("block", "block", "block");
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
		comboItensSel : function(idjanela) {
			var adicionaFilho = function() {
			}, tema = $i(idjanela + "i3GEOgraficointerativo1ComboTemasId").value;
			i3GEO.util.comboItens(idjanela + "i3GEOgraficointerativo1ComboXid", tema, function(retorno) {
				if (retorno.tipo === "erro") {
					$i(idjanela + "i3GEOgraficointerativo1ComboX").innerHTML =
						"<br><br><span style='color:red'>" + $trad(32, i3GEOF.graficointerativo1.dicionario) + "</span><br><br>";
					$i(idjanela + "i3GEOgraficointerativo1ComboY").innerHTML =
						"<br><br><span style='color:red'>" + $trad(32, i3GEOF.graficointerativo1.dicionario) + "</span><br><br>";
				} else {
					$i(idjanela + "i3GEOgraficointerativo1ComboY").innerHTML =
						"<div>" + retorno.dados + "&nbsp;<input title='" + $trad(33, i3GEOF.graficointerativo1.dicionario)
							+ "' class=digitar type=text size=20 id='" + idjanela + "i3GEOgraficointerativo1ComboYidTitulo' value='' />"
							+ "&nbsp;<input id='" + idjanela
							+ "i3GEOgraficointerativo1ComboYidcor' class=digitar type=text size=8 value='' />"
							+ "<img alt='aquarela.gif' style=position:relative;top:3px;left:3px;cursor:pointer src='"
							+ i3GEO.configura.locaplic + "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\"" + idjanela
							+ "i3GEOgraficointerativo1ComboYidcor\")' /></div>";

					$i(idjanela + "i3GEOgraficointerativo1ComboXid").id = idjanela + "i3GEOgraficointerativo1ComboYid";
					$i(idjanela + "i3GEOgraficointerativo1ComboX").innerHTML =
						"<div>" + retorno.dados + "&nbsp;<input title='" + $trad(33, i3GEOF.graficointerativo1.dicionario)
							+ "' class=digitar type=text size=20 id='" + idjanela
							+ "i3GEOgraficointerativo1ComboXidTitulo' value='' /></div>";
					$i(idjanela + "i3GEOgraficointerativo1ComboXid").style.width = "160px";
					$i(idjanela + "i3GEOgraficointerativo1ComboYid").style.width = "160px";

					adicionaFilho =
						function() {
							var no = document.createElement("div"), id = "CorG" + parseInt(Math.random() * 100000, 10), novoselect;
							no.innerHTML =
								retorno.dados + "&nbsp;<input title='" + $trad(33, i3GEOF.graficointerativo1.dicionario)
									+ "' class=digitar type=text size=20 value='' />" + "&nbsp;<input id='" + id
									+ "' class=digitar type=text size=8 value='' />"
									+ "<img alt='aquarela.gif' style=position:relative;top:3px;left:3px;cursor:pointer src='"
									+ i3GEO.configura.locaplic + "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\"" + id
									+ "\")' /><br>";
							novoselect = no.getElementsByTagName("select")[0];
							novoselect.id = "";
							novoselect.onchange = adicionaFilho;
							novoselect.style.width = "160px";
							$i(idjanela + "i3GEOgraficointerativo1ComboY").appendChild(no);
						};
					$i(idjanela + "i3GEOgraficointerativo1ComboYid").onchange = adicionaFilho;
				}
			}, idjanela + "i3GEOgraficointerativo1ComboX", "");
		},
		/**
		 * Atualiza as janelas obtendo os dados conforme a navegacao ocorre
		 */
		atualizaListaDeRegistros : function() {
			var i, janelas = i3GEOF.graficointerativo1.janelas, propJanelas = i3GEOF.graficointerativo1.propJanelas, n = janelas.length;
			for (i = 0; i < n; i++) {
				if (propJanelas[janelas[i]].atualiza === true) {
					i3GEOF.graficointerativo1.obterDados(janelas[i]);
				}
			}
		},
		/**
		 * Function: obterDados
		 *
		 * Obt&eacute;m os dados que ser&atilde;o utilizados no gr&aacute;fico
		 *
		 * Veja:
		 *
		 * <GRAFICOSELECAO>
		 */
		obterDados : function(idjanela) {
			if (!i3GEO.Interface) {
				return;
			}
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			var tema, excluir, cp, tipo, ordenax, monta, p, x, y, i, n, temp;

			tema = $i(idjanela + "i3GEOgraficointerativo1ComboTemasId");
			if(!tema){
				return;
			}
			else{
				tema = tema.value;
			}
			excluir = $i(idjanela + "i3GEOgraficointerativo1excluir").value;
			cp = new cpaint();
			tipo = $i(idjanela + "i3GEOgraficointerativo1TipoAgregacao").value;
			ordenax = "sim";

			// pega os itens
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboX");
			x = temp.getElementsByTagName("select")[0].value;
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboY");
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
			p =
				i3GEO.configura.locaplic + "/ferramentas/graficointerativo1/exec.php?g_sid=" + i3GEO.configura.sid
					+ "&funcao=graficoSelecao&tema=" + tema + "&itemclasses=" + x + "&itemvalores=" + y + "&exclui=" + excluir + "&ext="
					+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);

			if ($i(idjanela + "i3GEOgraficointerativo1DadosPuros").checked) {
				tipo = "nenhum";
			} else {
				if (x === y) {
					tipo = "conta";
				}
			}
			if (!$i(idjanela + "i3GEOgraficointerativo1OrdenaX").checked) {
				ordenax = "nao";
			}

			if (tema === "") {
				i3GEO.janela.tempoMsg($trad(34, i3GEOF.graficointerativo1.dicionario));
				return;
			}
			if (x === "") {
				i3GEO.janela.tempoMsg($trad(35, i3GEOF.graficointerativo1.dicionario));
				return;
			}
			if (y === "") {
				i3GEO.janela.tempoMsg($trad(36, i3GEOF.graficointerativo1.dicionario));
				return;
			}
			monta = function(retorno) {
				i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
				i3GEOF.graficointerativo1.montaTabelaDados(idjanela, retorno);
				$i(idjanela + "i3GEOgraficointerativo1guia4").onclick.call();
			};
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "visible";
			cp.set_response_type("JSON");
			cp.call(p + "&tipo=" + tipo + "&ordenax=" + ordenax, "graficoSelecao", monta);
		},
		/**
		 * Pega os nomes das colunas
		 */
		nomesColunas : function(idjanela) {
			// pega os nomes das clunas
			var i, n, p, temp = $i(idjanela + "i3GEOgraficointerativo1ComboX"), colunas, cores, alias;
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
			temp = $i(idjanela + "i3GEOgraficointerativo1ComboY");
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
		montaTabelaDados : function(idjanela, retorno) {
			var colunas = [], ncolunas, dados, n, v, ins = [], i, j, id, cor = "#C11515";
			if (!retorno.dados && retorno.data != undefined) {
				dados = retorno.data.dados;
			} else {
				dados = retorno;
			}
			ins.push("<p class=paragrafo >" + $trad(38, i3GEOF.graficointerativo1.dicionario) + "</p><table class=lista4 id='" + idjanela
				+ "i3GEOgraficointerativo1tabeladados' ><tr><td></td>");
			// pega os nomes das clunas
			colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela)[0];
			ncolunas = colunas.length;
			for (i = 0; i < ncolunas; i++) {
				ins
					.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo1.ordenaColuna(this,1)' src='"
						+ i3GEO.configura.locaplic + "/imagens/ordena1.gif' title='ordena' /> " + colunas[i] + "</td>");
			}
			ins.push("<td style=background-color:yellow >" + $trad(41, i3GEOF.graficointerativo1.dicionario) + "</td><td></td></tr>");
			n = dados.length;
			for (i = 1; i < n; i++) {
				v = dados[i].split(";");
				// ins += v[0]+" "+v[1];
				id = idjanela + "i3GEOgraficointerativo1Dados" + i; // layer+indice da classe
				ins.push("<tr><td>");
				ins.push("<img style='cursor:pointer' onclick='i3GEOF.graficointerativo1.excluilinha(this)' src='"
					+ i3GEO.configura.locaplic + "/imagens/x.gif' title='" + $trad(42, i3GEOF.graficointerativo1.dicionario) + "' /></td>");
				ins.push("</td>");
				for (j = 0; j < ncolunas; j++) {
					v[j] = v[j].replace("'", "");
					v[j] = v[j].replace("'", "");
					ins.push("<td>");
					ins.push($inputText("", "", id + colunas[j], $trad(43, i3GEOF.graficointerativo1.dicionario), 20, v[j], colunas[j]));
					ins.push("</td>");
				}

				ins.push("<td>");
				if ($i(idjanela + "i3GEOgraficointerativo1CoresA").checked) {
					cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
				}
				// verifica se no objeto com os dados existe um terceiro
				// valor com
				// as cores
				if (v[ncolunas + 1]) {
					cor = i3GEO.util.rgb2hex(v[ncolunas + 1]);
				}
				ins.push($inputText("", "", id + "_cor", "", 12, cor, $trad(41, i3GEOF.graficointerativo1.dicionario)));
				ins.push("</td><td>");
				ins.push("<img alt='aquarela.gif' style=cursor:pointer src='" + i3GEO.configura.locaplic
					+ "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\"" + id + "_cor\")' />");
				ins.push("</td></tr>");
			}
			ins.push("</table><br>");
			$i(idjanela + "i3GEOgraficointerativo1Dados").innerHTML = ins.join("");
		},
		/**
		 * Function: tabela2csv
		 *
		 * Obt&eacute;m os dados da tabela em CSV
		 */
		tabela2csv : function(idjanela) {
			var colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela), ncolunas = colunas[0].length, inputs =
				$i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("input"), ninputs = inputs.length, i, j, temp, csv = [];

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
		/**
		 * Function: tabela2dados
		 *
		 * Obt&eacute;m os dados da tabela para compor o gr&aacute;fico
		 */
		tabela2dados : function(idjanela) {
			if (i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "visible";
			var colunas = i3GEOF.graficointerativo1.nomesColunas(idjanela), ncolunas = colunas[0].length, temp = 0, ultimo = 0, inputs =
				$i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("input"), ninputs = inputs.length, tipoColuna = "String", metadados =
				[], i, j, acumulado = [], acum, cores = [], par = [], total = 0, menor = 0, maior = 0, legendaX = "", legendaY = "", dados =
				{}, xInclinado = $i(idjanela + "i3GEOgraficointerativo1xInclinado").checked;

			if (ninputs > 0) {
				menor = inputs[1].value * 1;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1ComboTemasId")) {
				titulo =
					$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").options[$i(idjanela + "i3GEOgraficointerativo1ComboTemasId").options.selectedIndex].text;
			}
			if (i3GEOF.graficointerativo1.titulo != "") {
				titulo = i3GEOF.graficointerativo1.titulo;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1ComboXid")) {
				legendaX = $i(idjanela + "i3GEOgraficointerativo1ComboXidTitulo").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1ComboYid")) {
				legendaY = $i(idjanela + "i3GEOgraficointerativo1ComboYidTitulo").value;
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
					if ($i(idjanela + "i3GEOgraficointerativo1Acumula").checked) {
						temp = acum;
					}
					if ($i(idjanela + "i3GEOgraficointerativo1Relativa").checked) {
						temp = (temp * 100) / total;
					}
					par.push([
						inputs[i].value + " ",
						temp
					]);
				}
				if ($i(idjanela + "i3GEOgraficointerativo1Acumula").checked) {
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
			if (legendaX == legendaY && (legendaX != "" && legendaY != "")) {
				menor = 0;
				legendaX += " (" + $trad(45, i3GEOF.graficointerativo1.dicionario) + ")";
				legendaY += " (" + $trad(46, i3GEOF.graficointerativo1.dicionario) + ")";
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
			switch (i3GEOF.graficointerativo1.propJanelas[idjanela].tipo) {
			case "bar_1":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, "vertical");
				break;
			case "bar_2":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, "horizontal");
				break;
			case "linha_1":
				legendaX = "";
				i3GEOF.graficointerativo1.linhas(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado);
				break;
			case "pizza_1":
				legendaX = "";
				i3GEOF.graficointerativo1.pizzas(idjanela, dados, maior, cores, legendaY, legendaX);
				break;
			case "ponto_1":
				i3GEOF.graficointerativo1.pontos(idjanela, dados, maior, cores, legendaY, legendaX);
				break;
			case "area_1":
				legendaX = "";
				i3GEOF.graficointerativo1.areas(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado);
				break;
			case "arvore_1":
				i3GEOF.graficointerativo1.arvores(idjanela, dados, maior, cores, legendaY, legendaX);
				break;
			default:
				// alert($trad(4, i3GEOF.graficointerativo1.dicionario));
			}
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
		ordenaColuna : function(coluna, cid) {
			var tabela = $i(idjanela + "i3GEOgraficointerativo1Dados").getElementsByTagName("table")[0], trs, ntrs = 0, psort = [], t = 0, ins =
				"", p = 0, e, temp, chaves = [], numero = false;

			trs = tabela.getElementsByTagName("tr");
			ntrs = trs.length;

			function sortNumber(a, b) {
				return a - b;
			}
			for (t = 1; t < ntrs; t++) {
				temp = trs[t].childNodes[cid];
				if (temp) {
					psort.push(temp.childNodes[0].value);
					chaves[temp.childNodes[0].value] = t;
					if (temp.childNodes[0].value * 1) {
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
			for (p = 0; p < psort; p++) {
				e = chaves[psort[p]];
				if (trs[e] !== undefined) {
					ins += "<tr>" + trs[e].innerHTML + "</tr>";
				}
			}
			tabela.innerHTML = ins;
		},
		configDefault : function(idjanela, dados, maior, cores, legendaY, legendaX) {
			var temp, config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				height : parseInt($i(idjanela + "_corpo").style.height, 10) - 80,
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
					return "<span style=color:yellow >" + cat + "</span><br>" + format("#.###,", val);
				},
				baseAxisTitleFont : '9px sans-serif',
				yAxisTickFormatter : function(valor) {
					valor = valor + "";
					valor = format("#.###,", valor);
					return valor;
				},
				valueFormat : function(valor) {
					valor = valor + "";
					valor = format("#.###,", valor);
					return valor;
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
				extensionPoints : {
					continuousAxisTicks_strokeStyle : 'gray',
					axisGrid_strokeStyle : 'lightgray',
					xAxisLabel_textStyle : 'black',
					label_textBaseline : "bottom",
					xAxisLabel_font : 'normal 10px sans-serif'
				}
			};
			if (maior > 0) {
				config.orthoAxisFixedMax = maior;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1Titulo").value != "") {
				config.title = $i(idjanela + "i3GEOgraficointerativo1Titulo").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1TituloX").value != "") {
				config.baseAxisTitle = $i(idjanela + "i3GEOgraficointerativo1TituloX").value;
			}
			if ($i(idjanela + "i3GEOgraficointerativo1TituloY").value != "") {
				config.orthoAxisTitle = $i(idjanela + "i3GEOgraficointerativo1TituloY").value;
			}
			temp = $i(idjanela + "i3GEOgraficointerativo1FatorTamanho");
			if (temp && temp.value > 0) {
				config.width = dados.resultset.length * temp.value;
			} else {
				config.width = parseInt($i(idjanela).style.width, 10) - 20;
			}
			return config;
		},
		barras : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = true, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (tipo === "horizontal") {
				config.orientation = 'horizontal';
			}
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			if (dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			} else {
				if (cores != "") {
					config.extensionPoints.bar_fillStyle = function(d) {
						return cores[this.index];
					};
				}
			}
			new pvc.BarChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		linhas : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;

			if (dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		areas : function(idjanela, dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false, sr = false, config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			config.areasVisible = true;

			if (dados.resultset[0].length > 2) {
				config.stacked = $i(idjanela + "i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i(idjanela + "i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows : sr
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		arvores : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {

			config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
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
					return "<span style=color:yellow >" + cat + "</span><br>" + format("#.###,", val);
				}
			};
			if (cores != "") {
				config.colors = cores;
			}
			new pvc.TreemapChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		pizzas : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			var config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				animate : true,
				selectable : true,
				hoverable : true,
				valuesVisible : true,
				valuesLabelStyle : 'inside',
				valuesMask : "{category}",
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
					return "<span style=color:yellow >" + cat + "</span><br>" + format("#.###,", val);
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
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		},
		pontos : function(idjanela, dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(idjanela, dados, maior, cores, legendaY, legendaX);
			var config = {
				canvas : idjanela + "i3GEOgraficointerativo1guia4objCanvas",
				animate : true,
				selectable : true,
				hoverable : true,
				valuesVisible : false,
				orthoAxisTitle : legendaY,
				valuesFont : 'normal 9px sans-serif ',
				baseAxisTitle : legendaX,
				yAxisTickFormatter : function(valor) {
					valor = valor + "";
					valor = format("#.###,", valor);
					return valor;
				},
				valueFormat : function(valor) {
					valor = valor + "";
					valor = format("#.###,", valor);
					return valor;
				},
				tooltipFormat : function(scene) {
					var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
					return "<span style=color:yellow >X: " + cat + "</span><br>Y: " + format("#.###,", val);
				}
			};
			if (cores != "") {
				config.colors = cores;
			}
			new pvc.DotChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.propJanelas[idjanela].aguarde.visibility = "hidden";
		}
	};
