/**
 * Title: heatmap
 *
 * Gera um mapa de calor baseado em uma camada existente no mapa.
 *
 * Mapas de calor s&atilde;o camadas que utilizam o plugin de camadas heatmap. Veja em classesjs/classe_plugini3geo.js
 *
 * A ferramenta altera o mapfile em uso clonando o mapfile escolhido e adicionando os metadados necess&aacute;rios ao uso do heatmap
 *
 * Veja:
 *
 * <i3GEO.analise.dialogo.heatmap>
 *
 * Arquivo:
 *
 * i3geo/ferramentas/heatmap/index.js.php
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
i3GEOF.heatmap =
	{
		/**
		 * Variavel: aguarde
		 *
		 * Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/**
		 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
		 */
		criaJanelaFlutuante : function() {
			i3GEOF.heatmap.iniciaDicionario();
		},
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.heatmap.dicionario);
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			return dicionario;
		},
		/**
		 * Function: iniciaDicionario
		 *
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
		 *
		 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function() {
			if (typeof (i3GEOF.heatmap.dicionario) === 'undefined') {
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic + "/ferramentas/heatmap/dicionario.js",
					"i3GEOF.heatmap.iniciaJanelaFlutuante()",
					"i3GEOF.heatmap.dicionario_script");
			} else {
				i3GEOF.heatmap.iniciaJanelaFlutuante();
			}
		},
		/**
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametro:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia : function(iddiv) {
			try {
				$i(iddiv).innerHTML += i3GEOF.heatmap.html();
				i3GEOF.heatmap.t0();
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
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
		html : function() {
			var ins = Mustache.render(i3GEOF.heatmap.MUSTACHE, i3GEOF.heatmap.mustacheHash());
			return ins;
		},
		/**
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var janela, divid, temp, titulo;
			// cria a janela flutuante
			titulo =
				$trad("x102") + " <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=3&idajuda=121' >&nbsp;&nbsp;&nbsp;</a>";
			cabecalho = function() {
			};
			janela = i3GEO.janela.cria("400px", "250px", "", "", "", titulo, "i3GEOF.heatmap", false, "hd", function() {
			}, function() {
				i3GEO.janela.minimiza("i3GEOF.heatmap");
			}, "", false, i3GEO.configura.locaplic + "/imagens/oxygen/16x16/accessories-calculator.png");
			divid = janela[2].id;
			janela[0].setFooter("<div id=i3GEOF.heatmap_rodape style=background-color:#F2F2F2; ></div>");
			i3GEOF.heatmap.aguarde = $i("i3GEOF.heatmap_imagemCabecalho").style;
			i3GEOF.heatmap.inicia(divid);
			temp = function() {
				// i3GEO.janela.tempoMsg("oi");
				if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.heatmap.t0()") > 0) {
					i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.heatmap.t0()");
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.heatmap.t0()") < 0) {
				i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.heatmap.t0()");
			}
		},
		t0 : function() {
			i3GEO.util.proximoAnterior(
				"",
				"i3GEOF.heatmap.t1()",
				"",
				"i3GEOFgradeDePontost0",
				"i3GEOheatmapresultado",
				true,
				"i3GEOF.heatmap_rodape");
		},
		t1 : function() {
			i3GEO.util.proximoAnterior(
				"i3GEOF.heatmap.t0()",
				"i3GEOF.heatmap.t2()",
				"",
				"i3GEOF.heatmap.t1",
				"i3GEOheatmapresultado",
				true,
				"i3GEOF.heatmap_rodape");
			i3GEOF.heatmap.comboTemasSel();
		},
		t2 : function() {
			i3GEO.util.proximoAnterior(
				"i3GEOF.heatmap.t1()",
				"i3GEOF.heatmap.t3()",
				"",
				"i3GEOF.heatmap.t2",
				"i3GEOheatmapresultado",
				true,
				"i3GEOF.heatmap_rodape");
			i3GEOF.heatmap.comboItens();
		},
		t3 : function() {
			i3GEO.util.proximoAnterior(
				"i3GEOF.heatmap.t2()",
				"i3GEOF.heatmap.t4()",
				"",
				"i3GEOF.heatmap.t3",
				"i3GEOheatmapresultado",
				true,
				"i3GEOF.heatmap_rodape");
		},
		t4 : function() {
			i3GEO.util.proximoAnterior(
				"i3GEOF.heatmap.t3()",
				"",
				"",
				"i3GEOF.heatmap.t4",
				"i3GEOheatmapresultado",
				true,
				"i3GEOF.heatmap_rodape");
			var b = new YAHOO.widget.Button("i3GEOheatmapbotao1", {
				onclick : {
					fn : i3GEOF.heatmap.criaheatmap
				}
			});
			b.addClass("rodar");
		},
		/**
		 * Function: criaheatmap
		 *
		 * Executa a opera&ccedil;&atilde;o de gera&ccedil;&atilde;o do heatmap
		 *
		 */
		criaheatmap : function() {
			try {
				if (i3GEOF.heatmap.aguarde.visibility === "visible") {
					return;
				}
				var p, fim, cp;

				i3GEOF.heatmap.aguarde.visibility = "visible";
				fim = function(retorno) {
					i3GEOF.heatmap.aguarde.visibility = "hidden";
					if (retorno.data === undefined) {
						$i("i3GEOheatmapfim").innerHTML = $trad('erroTempo', i3GEOF.heatmap.dicionario);
					} else {
						i3GEO.atualiza();
					}
				};
				p =
					i3GEO.configura.locaplic + "/ferramentas/heatmap/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=criaheatmap"
						+ "&tema=" + $i("i3GEOheatmaptemasComSel").value
						// + "&multiplicar="
						// + $i("i3GEOheatmapdfator").value
						+ "&coluna=" + $i("i3GEOheatmaptemasItem").value + "&valorPonto=" + $i("i3GEOheatmapd").value + "&titulo="
						+ $i("i3GEOheatmapTitulo").value + "&opacidade=" + $i("i3GEOheatmapOpacidade").value + "&raio="
						+ $i("i3GEOheatmapRaio").value;// + "&raio=" + $i("i3GEOheatmapMax").value;

				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p, "criaheatmap", fim);
			} catch (e) {
				$i("i3GEOheatmapfim").innerHTML = "<p class='paragrafo' >Erro. " + e;
				i3GEOF.heatmap.aguarde.visibility = "hidden";
			}
		},
		/**
		 * Function: comboTemasSel
		 *
		 * Cria um combo com a lista de temas
		 *
		 * Veja:
		 *
		 * <i3GEO.util.comboTemas>
		 */
		comboTemasSel : function() {
			i3GEO.util.comboTemas("i3GEOheatmaptemasComSel", function(retorno) {
				$i("i3GEOheatmapSelTemas").innerHTML = retorno.dados;
				$i("i3GEOheatmapSelTemas").style.display = "block";
				if ($i("i3GEOheatmaptemasComSel")) {
					$i("i3GEOheatmaptemasComSel").onchange = function() {
						i3GEO.mapa.ativaTema($i("i3GEOheatmaptemasComSel").value);
					};
				}
				if (i3GEO.temaAtivo !== "") {
					$i("i3GEOheatmaptemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEOheatmaptemasComSel").onchange.call();
				}
			}, "i3GEOheatmapSelTemas", "", false, "ligados","display:block;");
		},
		/**
		 * Function: comboItens
		 *
		 * Cria um combo para escolha de um item do tema
		 *
		 * Veja:
		 *
		 * <i3GEO.util.comboItens>
		 *
		 */
		comboItens : function() {
			i3GEO.util
				.comboItens(
					"i3GEOheatmaptemasItem",
					$i("i3GEOheatmaptemasComSel").value,
					function(retorno) {
						$i("i3GEOheatmapondeItens").innerHTML =
							retorno.dados;
								//+ " "
								//+ $trad('multiplica', i3GEOF.heatmap.dicionario)
								//+ " <input  class=digitar id='i3GEOheatmapdfator' type=text size=10 value='1'/>";
						$i("i3GEOheatmapondeItens").style.display = "block";
					},
					"i3GEOheatmapondeItens");
		}
	};