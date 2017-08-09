/*
Title: Sele&ccedil;&atilde;o

Opera&ccedil;&otilde;es de sele&ccedil;&atilde;o de elementos no mapa.

Veja:

<i3GEO.mapa.dialogo.selecao>

Arquivo:

i3geo/ferramentas/selecao/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */

if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
//TODO incluir as propriedades corretas em OL3 para permitir selecao de figuras
/*
 * Classe: i3GEOF.selecao
 */
i3GEOF.selecao =
	{
		tipoSel : "",
		/*
		 * Variavel: aguarde
		 *
		 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		comboTemas: "",
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		MUSTACHELINHAFILTRO: "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.selecao.dicionario);
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			if (i3GEO.Interface.ATUAL === "openlayers"){
				dicionario["i3GEOselecaoboxHidden"] = "hidden";
			}
			else {
				dicionario["i3GEOselecaoboxHidden"] = "";
			}
			dicionario["p8"] = $trad("p8");
			return dicionario;
		},
		/*
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametro:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia : function(iddiv) {
			var t1 = i3GEO.configura.locaplic + "/ferramentas/selecao/template_mst.html",
			t2 = i3GEO.configura.locaplic + "/ferramentas/selecao/template_linhafiltro_mst.html";
			if(i3GEOF.selecao.MUSTACHE == ""){
				$.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
					i3GEOF.selecao.MUSTACHE = r1[0];
					i3GEOF.selecao.MUSTACHELINHAFILTRO = r2[0];
					i3GEOF.selecao.inicia(iddiv);
				}).fail(function() {
				    i3GEO.janela.closeMsg($trad("erroTpl"));
				    return;
				});
				return;
			}
			var b, i, n, ics;

				$i(iddiv).innerHTML += i3GEOF.selecao.html();
				i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1", "i3GEOselecaoguia");
				// eventos das guias
				$i("i3GEOselecaoguia4").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia4", "i3GEOselecaoguia");
				};
				$i("i3GEOselecaoguia1").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia1", "i3GEOselecaoguia");
				};
				$i("i3GEOselecaoguia2").onclick = function() {
					if ($i("i3GEOselecaotemasLigados")) {
						if ($i("i3GEOselecaotemasLigados").value === "") {
							i3GEO.janela.tempoMsg($trad('selecionaTema', i3GEOF.selecao.dicionario));
							return;
						}
						i3GEO.mapa.ativaTema($i("i3GEOselecaotemasLigados").value);
						i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia2", "i3GEOselecaoguia");
						try {
							$i("i3GEOselecaoparametros").innerHTML = "";
						} catch (e) {
						}
						//
						//pega a lista de itens e chama a fun&ccedil;&atilde;o de montagem das op&ccedil;&otilde;es de cria&ccedil;&atilde;o do filtro
						//
						var tema = i3GEOF.selecao.pegaTemasSel();
						tema = tema[1][0];
						i3GEO.util.comboItens(
							"",
							tema,
							function(retorno){
								i3GEOF.selecao.comboTemas = retorno.dados;
								i3GEOF.selecao.adicionaLinhaFiltro();
							},
							"",
							"coluna",
							"",
							"",
							"form-control"
						);
					}
				};
				$i("i3GEOselecaoguia3").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia3", "i3GEOselecaoguia");
					i3GEO.util.comboTemas(
							"i3GEOselecaoTemaoverlay",
							function(retorno) {
								$i("i3GEOselecaooverlay").innerHTML = retorno.dados;
							},
							"i3GEOselecaooverlay",
							"",
							false,
							"naolinearSelecionados",
							"",
							"",
							"",
							"form-control"
					);
				};
				i3GEOF.selecao.criaCombosTemas();
				i3GEOF.selecao.ativaFoco();
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
		html : function() {
			var ins = Mustache.render(i3GEOF.selecao.MUSTACHE, i3GEOF.selecao.mustacheHash());
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var minimiza, cabecalho, janela, divid, temp, titulo;
			if ($i("i3GEOF.selecao")) {
				return;
			}
			// cria a janela flutuante
			cabecalho = function() {
				i3GEOF.selecao.ativaFoco();
			};
			minimiza = function() {
				i3GEO.janela.iconiza("i3GEOF.selecao",100);
			};
			titulo =
				"</div><div id='i3GEOF.selecaoI' style='left:10px;'>"
					+ "</div><a class='i3GeoTituloJanelaBs' href='javascript:void(0)' onclick='i3GEO.ajuda.ferramenta(\"48a\")' >"
					+ $trad("x51")
					+ "</a>";
			janela = i3GEO.janela.cria(
					"510px",
					"230px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.selecao",
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true,
					"",
					"",
					"",
					""
			);
			divid = janela[2].id;
			i3GEOF.selecao.aguarde = $i("i3GEOF.selecao_imagemCabecalho").style;
			$i("i3GEOF.selecao_corpo").style.backgroundColor = "white";
			i3GEOF.selecao.inicia(divid);
			i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS", [
				"i3GEOF.selecao.criaCombosTemas()"
			]);
			i3GEO.eventos.cliquePerm.desativa();

			temp = function() {
				var api;
				i3GEO.eventos.cliquePerm.ativa();
				i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS", [
					"i3GEOF.selecao.criaCombosTemas()"
				]);
				if(i3GEO.Interface["ATUAL"] === "openlayers"){
					if (typeof OpenLayers.Control == "undefined") {
						api = "ol3";
						//i3GEO.Interface.openlayers.interacoes[0].setActive(true);//duplo clique
					} else {
						api = "openlayers";
					}
				}
				else{
					api = i3GEO.Interface["ATUAL"];
				}
				i3GEOF.selecao.removeFiguras[api]();
				if(api == "ol3"){
					i3GEOF.selecao.box.ol3.removeControle();
					i3GEOF.selecao.clique.ol3.removeControle();
					i3GEOF.selecao.figura.ol3.removeControle();
					i3GEOF.selecao.poligono.ol3.removeControle();
				}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		},
		/*
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function() {
			i3GEO.eventos.cliquePerm.desativa();
			i3GEOF.selecao.pegaTemasSel();
			if (i3GEO.Interface.ATUAL != "openlayers") {
				i3GEO.Interface[i3GEO.Interface.ATUAL].recalcPar();
			}
		},
		/*
		 * Function: criaCombosTemas
		 *
		 * Cria os combos de sele&ccedil;&atilde;o de temas
		 */
		criaCombosTemas : function() {
			i3GEO.util.comboTemas(
					"i3GEOselecaotemasLigados",
					function(retorno) {
						var nsel, temp;
						temp = $i("i3GEOselecaoComboTemas");
						if (!temp) {
							return;
						}
						temp.innerHTML = retorno.dados;
						if ($i("i3GEOselecaotemasLigados")) {
							$i("i3GEOselecaotemasLigados").value = i3GEO.temaAtivo;
							// verifica qts elementos selecionados
							if (i3GEO.temaAtivo != "") {
								nsel = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
								$i("i3GEOselecaoNsel").innerHTML = $trad('selecionados', i3GEOF.selecao.dicionario) + ": " + (nsel.nsel) + "<br>";
							}
							$i("i3GEOselecaotemasLigados").onchange = function() {
								i3GEOF.selecao.pegaTemasSel();
							};
						}
					},
					"i3GEOselecaoComboTemas",
					"",
					true,
					"ligados",
					"",
					"",
					"",
					"form-control"
				);
		},
		/*
		 * Function: mudaicone
		 *
		 * Altera as bordas dos &iacute;cones
		 */
		mudaicone : function() {

		},
		/*
		 * Function: pegaTemasSel
		 *
		 * Pega a lista de temas escolhidos pelo usu&aacute;rio
		 */
		pegaTemasSel : function() {
			var selObj = $i("i3GEOselecaotemasLigados"), selectedArray = [], i, nsel;
			if (selObj) {
				for (i = 0; i < selObj.options.length; i++) {
					if (selObj.options[i].selected) {
						selectedArray.push(selObj.options[i].value);
					}
				}
				i3GEO.mapa.ativaTema(selectedArray[0]);
				if (i3GEO.temaAtivo != "") {
					nsel = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
					$i("i3GEOselecaoNsel").innerHTML = $trad('selecionados', i3GEOF.selecao.dicionario) + ": " + (nsel.nsel) + "<br>";
				}
			}
			return [selectedArray.toString(),selectedArray];
		},
		/*
		 * Function: fimSelecao
		 *
		 * Funcoes executadas quando uma operacao de selecao e concluida
		 *
		 */
		fimSelecao : function(retorno) {
			var nsel, tema = i3GEO.temaAtivo;
			i3GEOF.selecao.aguarde.visibility = "hidden";
			i3GEO.janela.fechaAguarde("i3GEO.atualiza");
			i3GEO.Interface.atualizaTema(retorno, tema);
			nsel = i3GEO.arvoreDeCamadas.pegaTema(tema, retorno.data.temas);
			$i("i3GEOselecaoNsel").innerHTML = $trad('selecionados', i3GEOF.selecao.dicionario) + ": " + (nsel.nsel);
			if(i3GEOF.tabela){
				i3GEO.eventos.adicionaEventos("SELECAO", [
					"i3GEOF.tabela.atualizaListaDeRegistros()"
				]);
			}
			i3GEO.eventos.executaEventos(i3GEO.eventos.SELECAO);
		},
		/*
		 * Function: operacao
		 *
		 * Executa uma opera&ccedil;&atilde;o sobre o conjunto de elementos selecionados
		 *
		 * Veja:
		 *
		 * <i3GEO.php.selecaopt>
		 *
		 * Parametro:
		 *
		 * tipo {String} - tipo de opera&ccedil;&atilde;o inverte|limpa
		 */
		operacao : function(tipo) {
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			try {
				if ($i("i3GEOselecaotemasLigados").value === "") {
					i3GEO.janela.tempoMsg("Escolha um tema");
					return;
				}
				i3GEOF.selecao.aguarde.visibility = "visible";
				i3GEO.mapa.ativaTema($i("i3GEOselecaotemasLigados").value);
				var tema = i3GEO.temaAtivo, fim = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.php.selecaopt(fim, tema, "", tipo, 0);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
				i3GEOF.selecao.aguarde.visibility = "hidden";
			}
		},
		/*
		 * Function: tiposel
		 *
		 * Executa um tipo de sele&ccedil;&atilde;o interativa
		 *
		 * Parameter:
		 *
		 * obj {objeto dom) - objeto que foi clicado para disparar a opera&ccedil;&atilde;o. O valor identifica o tipo de
		 * opera&ccedil;&atilde;o
		 */
		tiposel : function(obj) {
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			// try {
				if ($i("i3GEOselecaotemasLigados").value === "") {
					i3GEO.janela.tempoMsg("Escolha um tema");
					return;
				}
				var api, fim = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				}, tema = i3GEOF.selecao.pegaTemasSel();
				tema = tema[0];

				if (i3GEO.Interface["ATUAL"] === "openlayers") {
					if (typeof OpenLayers.Control == "undefined") {
						api = "ol3";
					} else {
						api = "openlayers";
					}
				} else {
					api = i3GEO.Interface["ATUAL"];
				}
				if (obj.value == "i3GEOselecaoext") {
					i3GEOF.selecao.tipoSel = obj.value;
					i3GEOF.selecao.aguarde.visibility = "visible";
					i3GEO.php.selecaobox(fim, tema, $i("i3GEOselecaotipoOperacao").value, i3GEO.parametros.mapexten);
				}
				if (obj.value == "i3GEOselecaobox") {
					i3GEOF.selecao.tipoSel = obj.value;

					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.box[api].inicia();
				}
				if (obj.value == "i3GEOselecaopt") {
					i3GEOF.selecao.tipoSel = obj.value;

					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.clique[api].inicia();
				}
				if (obj.value == "i3GEOselecaopoli") {
					i3GEOF.selecao.tipoSel = obj.value;

					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.poligono[api].inicia();
				}
				if (obj.value == "i3GEOselecaofigura") {
					i3GEOF.selecao.tipoSel = obj.value;

					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.figura[api].inicia();
				}
			// } catch (e) {
				// i3GEO.janela.tempoMsg("Erro: " + e);
				// i3GEOF.selecao.aguarde.visibility = "hidden";
			// }
		},
		/*
		 * Function: removeFiguras Remove as figuras marcadas como origem igual a i3GEOFselecao
		 */
		removeFiguras : {
			ol3 : function(){
				if(!i3GEO.desenho.layergrafico){
					return;
				}
				var features, n, f, i, remover = [], temp;
				features = i3GEO.desenho.layergrafico.getSource().getFeatures();
				n = features.length;
				for(i = 0; i < n; i++){
					f = features[i];
					if(f.getProperties().origem === "i3GEOFselecao"){
						remover.push(f);
					}
				}
				if(remover.length > 0){
					temp = window.confirm($trad("x94"));
					if(temp){
						for(r in remover){
							i3GEO.desenho.layergrafico.getSource().removeFeature(remover[r]);
						}
					}
				}
			},
			openlayers : function() {
				if (i3GEO.desenho.layergrafico) {
					var temp, f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem", "i3GEOFselecao");
					if (f && f.length > 0) {
						temp = window.confirm($trad("x94"));
						if (temp) {
							i3GEO.desenho.layergrafico.destroyFeatures(f);
						}
					}
				}
			},
			googlemaps : function() {
				var temp, f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "i3GEOFselecao");
				if (f && f.length > 0) {
					temp = window.confirm($trad("x94"));
					if (temp) {
						i3GEO.desenho.googlemaps.destroyFeatures(f);
					}
				}
			}
		},
		/*
		 * Classe: i3GEOF.selecao.box
		 *
		 * Controla o desenho do box para a sele&ccedil;&atilde;o e executa a opera&ccedil;&atilde;o de sele&ccedil;&atilde;o
		 */
		box : {
			ol3 : {
				draw : "",
				inicia : function() {
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.box.ol3.removeControle();
					i3GEOF.selecao.box.ol3.draw = new ol.interaction.DragBox({
						//condition: ol.events.condition.shiftKeyOnly,
						style: new ol.style.Style({
							stroke: new ol.style.Stroke({
								color: [0, 0, 255, 1]
							})
						})
					});

					i3GEOF.selecao.box.ol3.draw.on("boxend",function(evt){
						var feature, geo, pol = i3GEOF.selecao.box.ol3.draw.getGeometry();
						if ($i("i3GEOFselecaoMantemFigura").checked === true) {
							feature = new ol.Feature({
								geometry: pol,
								origem: 'i3GEOFselecao'
							});
							//i3GEOF.selecao.box.ol3.draw.feature.setProperties({origem : "i3GEOFselecao"});
							i3GEO.desenho.layergrafico.getSource().addFeature(feature);
						}
						i3GEOF.selecao.box.ol3.removeControle();
						i3GEO.eventos.cliquePerm.ativa();
						pol = i3GEO.util.projOSM2Geo(pol);
						geo = pol.getExtent();
						i3GEOF.selecao.box.termina(
							i3GEO.temaAtivo,
							$i("i3GEOselecaotipoOperacao").value,
							geo.join(" "));
					});
					i3geoOL.addInteraction(i3GEOF.selecao.box.ol3.draw);
				},
				removeControle : function() {
					i3geoOL.removeInteraction(i3GEOF.selecao.box.ol3.draw);
					i3GEOF.selecao.box.ol3.draw = "";
				}
			},
			openlayers : {
				inicia : function() {
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.box.openlayers.removeControle();
					var box =
						new OpenLayers.Control.DrawFeature(i3GEO.desenho.layergrafico, OpenLayers.Handler.Box, {
							autoActivate : true,
							id : "i3GEOFselecaoBox",
							type : OpenLayers.Control.TYPE_TOOL,
							callbacks : {
								done : function(feature) {
									i3GEOF.selecao.box.openlayers.removeControle();
									var g, f, xminymin = i3geoOL.getLonLatFromPixel({
										x : feature.left,
										y : feature.bottom
									}), xmaxymax = i3geoOL.getLonLatFromPixel({
										x : feature.right,
										y : feature.top
									});
									i3GEOF.selecao.box.termina(i3GEO.temaAtivo, $i("i3GEOselecaotipoOperacao").value, xminymin.lon + " "
										+ xminymin.lat
										+ " "
										+ xmaxymax.lon
										+ " "
										+ xmaxymax.lat);
									if ($i("i3GEOFselecaoMantemFigura").checked === true) {
										g = new OpenLayers.Bounds(xminymin.lon, xminymin.lat, xmaxymax.lon, xmaxymax.lat);
										f = new OpenLayers.Feature.Vector(g.toGeometry(), {
											origem : "i3GEOFselecao"
										}, {
											fillColor : "orange",
											fillOpacity : 0.4,
											strokeColor : "orange",
											strokeOpacity : 1,
											strokeWidth : 2
										});

										i3GEO.desenho.layergrafico.addFeatures([
											f
										]);
										if (i3GEO.Interface) {
											i3GEO.Interface.openlayers.sobeLayersGraficos();
										}
									}
								}
							}
						});
					i3geoOL.addControl(box);
				},
				removeControle : function() {
					var controle = i3geoOL.getControlsBy("id", "i3GEOFselecaoBox");
					if (controle.length > 0) {
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
				}
			},
			termina : function(tema, tipo, box) {
				var retorna = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.janela.abreAguarde("i3GEO.atualiza", $trad("o1"));
				i3GEO.eventos.cliquePerm.ativa();
				i3GEO.php.selecaobox(retorna, tema, tipo, box);
			}
		},
		/*
		 * Function: clique
		 *
		 * Seleciona elementos clicando no mapa
		 */
		clique : {
			ol3 : {
				draw : "",
				inicia : function() {
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.clique.ol3.removeControle();
					i3GEOF.selecao.clique.ol3.draw = new ol.interaction.Draw({
						// features : i3GEO.desenho.layergrafico.getFeatures(),
						type : "Point",
						maxPoints : 1
					});
					i3GEOF.selecao.clique.ol3.draw.on("drawend",function(evt){
						var geo, ponto = evt.feature.getGeometry();
						if ($i("i3GEOFselecaoMantemFigura").checked === true) {
							evt.feature.setProperties({origem : "i3GEOFselecao"});
							i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
						}
						i3GEOF.selecao.clique.ol3.removeControle();
						i3GEO.eventos.cliquePerm.ativa();
						ponto = i3GEO.util.projOSM2Geo(ponto);
						geo = ponto.getCoordinates();
						i3GEOF.selecao.clique.termina(
							i3GEO.temaAtivo,
							$i("i3GEOselecaotipoOperacao").value,
							$i("i3GEOselecaotoleranciapt").value,
							geo[0],
							geo[1]);
					});
					i3geoOL.addInteraction(i3GEOF.selecao.clique.ol3.draw);
				},
				removeControle : function() {
					i3geoOL.removeInteraction(i3GEOF.selecao.clique.ol3.draw);
					i3GEOF.selecao.clique.ol3.draw = "";
				}
			},
			// versao 2 do openlayers
			openlayers : {
				inicia : function() {
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.clique.openlayers.removeControle();
					var ponto =
						new OpenLayers.Control.DrawFeature(i3GEO.desenho.layergrafico, OpenLayers.Handler.Point, {
							autoActivate : true,
							id : "i3GEOFselecaoPonto",
							type : OpenLayers.Control.TYPE_TOOL,
							callbacks : {
								done : function(feature) {
									i3GEOF.selecao.clique.openlayers.removeControle();
									feature = i3GEO.util.projOSM2Geo(feature);
									i3GEOF.selecao.clique.termina(
										i3GEO.temaAtivo,
										$i("i3GEOselecaotipoOperacao").value,
										$i("i3GEOselecaotoleranciapt").value,
										feature.x,
										feature.y);
									if ($i("i3GEOFselecaoMantemFigura").checked === true) {
										feature = i3GEO.util.projGeo2OSM(feature);
										f = new OpenLayers.Feature.Vector(feature, {
											origem : "i3GEOFselecao"
										}, {
											fillColor : "orange",
											fillOpacity : 0.4,
											strokeColor : "orange",
											strokeOpacity : 1,
											strokeWidth : 2,
											graphicName : "square",
											pointRadius : 6
										});

										i3GEO.desenho.layergrafico.addFeatures([
											f
										]);
										if (i3GEO.Interface) {
											i3GEO.Interface.openlayers.sobeLayersGraficos();
										}
									}
								}
							}
						});
					i3geoOL.addControl(ponto);
				},
				removeControle : function() {
					var controle = i3geoOL.getControlsBy("id", "i3GEOFselecaoPonto");
					if (controle.length > 0) {
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
				}
			},
			googlemaps : {
				inicia : function() {
					var evtclick = null;
					i3GEO.eventos.cliquePerm.desativa();
					evtclick =
						google.maps.event.addListener(i3GeoMap, "click", function(evt) {
							if (i3GEOF.selecao.tipoSel === "i3GEOselecaopt") {
								i3GEOF.selecao.clique.termina(
									i3GEO.temaAtivo,
									$i("i3GEOselecaotipoOperacao").value,
									$i("i3GEOselecaotoleranciapt").value,
									evt.latLng.lng(),
									evt.latLng.lat());
								if ($i("i3GEOFselecaoMantemFigura").checked === true) {
									i3GEO.desenho.googlemaps.shapes.push(new google.maps.Marker({
										map : i3GeoMap,
										fillOpacity : 0,
										clickable : false,
										position : evt.latLng,
										icon : {
											path : google.maps.SymbolPath.CIRCLE,
											scale : 4,
											strokeColor : "orange"
										},
										origem : "i3GEOFselecao"
									}));
								}

							}
							google.maps.event.removeListener(evtclick);
						});
				}
			},
			termina : function(tema, tipo, tolerancia, x, y) {
				if (typeof (console) !== 'undefined') {
					console.info("i3GEO.selecao.porxy()");
				}
				var retorna = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.eventos.cliquePerm.ativa();
				i3GEO.php.selecaopt(retorna, tema, x + " " + y, tipo, tolerancia);
			}
		},
		/*
		 * Function: figura
		 *
		 * Seleciona elementos com base em uma figura existente no mapa
		 */
		figura : {
			ol3 : {
				draw : "",
				inicia : function() {
					var features = i3GEO.desenho.layergrafico.getFeatures();
					if(features.length === 0){
						return;
					}
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.figura.ol3.removeControle();
					i3GEOF.selecao.figura.ol3.draw = new ol.interaction.Select();
					i3GEOF.selecao.figura.ol3.draw.on("select",function(evt){
						var wkt, i, n, f, format = new ol.format.WKT();
						geo = i3GEOF.selecao.figura.ol3.draw.getFeatures();
						n = evt.selected.length;
						for(i=0; i<n; i++){
							f =evt.selected[i];
							f = i3GEO.util.projOSM2Geo(f);
							wkt = format.writeFeature(f);
							i3GEOF.selecao.figura.termina(i3GEO.temaAtivo, $i("i3GEOselecaotipoOperacao").value, wkt);
						}
						i3GEO.eventos.cliquePerm.ativa();
						i3GEOF.selecao.figura.ol3.removeControle();
					});
					i3geoOL.addInteraction(i3GEOF.selecao.figura.ol3.draw);
				},
				removeControle : function() {
					i3geoOL.removeInteraction(i3GEOF.selecao.figura.ol3.draw);
					i3GEOF.selecao.figura.ol3.draw = "";
				}
			},
			openlayers : {
				executa : function(feature) {
					i3GEOF.selecao.figura.openlayers.removeControle();
					var wkt = i3GEO.util.projOSM2Geo(feature.geometry);
					// var wkt = feature.geometry;
					i3GEOF.selecao.figura.termina(i3GEO.temaAtivo, $i("i3GEOselecaotipoOperacao").value, wkt);
				},
				inicia : function() {
					var ponto, f;
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.figura.openlayers.removeControle();
					// verifica se ja tem uma figura selecionada
					f = i3GEO.desenho.layergrafico.selectedFeatures;
					if (f && f.length > 0) {
						i3GEOF.selecao.figura.openlayers.executa(f[0]);
						return;
					}
					ponto = new OpenLayers.Control.SelectFeature(i3GEO.desenho.layergrafico, {
						clickout : true,
						toggle : true,
						multiple : false,
						hover : false,
						toggleKey : "ctrlKey", // ctrl key removes from selection
						box : false,
						autoActivate : true,
						id : "i3GEOFselecaoFigura",
						type : OpenLayers.Control.TYPE_TOOL,
						onSelect : function(feature) {
							i3GEOF.selecao.figura.openlayers.executa(feature);
						}
					});
					i3geoOL.addControl(ponto);
				},
				removeControle : function() {
					var controle = i3geoOL.getControlsBy("id", "i3GEOFselecaoFigura");
					if (controle.length > 0) {
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
				}
			},
			// FIXME nao funciona no googlemaps
			googlemaps : {
				inicia : function() {
					var n, i, evtclick = null;
					i3GEO.eventos.cliquePerm.desativa();
					i3GEO.editorGM.drawingManager.setOptions({
						drawingMode : null
					});
					n = i3GEO.desenho.googlemaps.shapes.length;
					for (i = 0; i < n; i++) {
						evtclick = google.maps.event.addListener(i3GEO.desenho.googlemaps.shapes[i], "click", function(evt) {
							if (i3GEOF.selecao.tipoSel === "i3GEOselecaofigura") {
								var i, s = [], wkt = new Wkt.Wkt(), n = i3GEO.desenho.googlemaps.shapes.length;
								for (i = 0; i < n; i++) {
									if (i3GEO.desenho.googlemaps.shapes[i] != "" && i3GEO.desenho.googlemaps.shapes[i].editable === true) {
										s = i3GEO.desenho.googlemaps.shapes[i];
									}
								}
								wkt.fromObject(s);
								wkt = wkt.write();
								i3GEOF.selecao.figura.termina(i3GEO.temaAtivo, $i("i3GEOselecaotipoOperacao").value, wkt);
							}
							google.maps.event.removeListener(evtclick);
						});
					}
				}
			},
			termina : function(tema, tipo, wkt) {
				var retorna = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.eventos.cliquePerm.ativa();
				i3GEO.php.selecaoWkt(retorna, tema, tipo, wkt, $i("i3GEOselecaotoleranciapt").value);
			}
		},
		/*
		 * Classe: i3GEOF.selecao.poligono
		 *
		 * Realiza a sele&ccedil;&atilde;o desenhando um pol&iacute;gono no mapa
		 */
		poligono : {
			ol3 : {
				draw : "",
				inicia : function() {
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.poligono.ol3.removeControle();
					i3GEOF.selecao.poligono.ol3.draw = new ol.interaction.Draw({
						// features : i3GEO.desenho.layergrafico.getFeatures(),
						type : "Polygon"
					});
					i3GEO.Interface.openlayers.interacoes[0].setActive(false);
					i3GEOF.selecao.poligono.ol3.draw.on("drawend",function(evt){
						var n, i, x = [],y =[],geo, pol = evt.feature.getGeometry();
						if ($i("i3GEOFselecaoMantemFigura").checked === true) {
							evt.feature.setProperties({origem : "i3GEOFselecao"});
							i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
						}
						i3GEOF.selecao.poligono.ol3.removeControle();
						i3GEO.eventos.cliquePerm.ativa();
						pol = i3GEO.util.projOSM2Geo(pol);
						geo = pol.getCoordinates()[0];
						n = geo.length;
						for(i=0; i<n; i++){
							x.push(geo[i][0]);
							y.push(geo[i][1]);
						}
						i3GEOF.selecao.poligono.termina({
							xpt : x,
							ypt : y
						});
					});
					i3geoOL.addInteraction(i3GEOF.selecao.poligono.ol3.draw);
				},
				removeControle : function() {
					i3geoOL.removeInteraction(i3GEOF.selecao.poligono.ol3.draw);
					i3GEOF.selecao.poligono.ol3.draw = "";
				}
			},
			openlayers : {
				inicia : function() {
					var poligono;
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.poligono.openlayers.removeControle();
					poligono = new OpenLayers.Control.DrawFeature(i3GEO.desenho.layergrafico, OpenLayers.Handler.Polygon, {
						autoActivate : true,
						id : "i3GEOFselecaoPoli",
						type : OpenLayers.Control.TYPE_TOOL,
						callbacks : {
							done : function(feature) {
								i3GEOF.selecao.poligono.openlayers.removeControle();
								feature = i3GEO.util.projOSM2Geo(feature);
								// pega as coordenadas
								var i, x = [], y = [], vertices = feature.components[0].components, n = vertices.length;
								for (i = 0; i < n; i++) {
									x.push(vertices[i].x);
									y.push(vertices[i].y);
								}
								i3GEOF.selecao.poligono.termina({
									xpt : x,
									ypt : y
								});
								if ($i("i3GEOFselecaoMantemFigura").checked === true) {
									feature = i3GEO.util.projGeo2OSM(feature);
									f = new OpenLayers.Feature.Vector(feature, {
										origem : "i3GEOFselecao"
									}, {
										fillColor : "orange",
										fillOpacity : 0.4,
										strokeColor : "orange",
										strokeOpacity : 1,
										strokeWidth : 2
									});

									i3GEO.desenho.layergrafico.addFeatures([
										f
									]);
									if (i3GEO.Interface) {
										i3GEO.Interface.openlayers.sobeLayersGraficos();
									}
								}
							}
						}
					});
					i3geoOL.addControl(poligono);
				},
				removeControle : function() {
					var controle = i3geoOL.getControlsBy("id", "i3GEOFselecaoPoli");
					if (controle.length > 0) {
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
				}
			},
			googlemaps : {
				inicia : function() {
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GeoMap.setOptions({
						disableDoubleClickZoom : true
					});
					i3GeoMap.setOptions({
						draggableCursor : 'crosshair'
					});
					var evtdblclick = null, evtclick = null, evtmousemove = null, pontos = {
						mvcLine : new google.maps.MVCArray(),
						line : null,
						polygon : null,
						x : [],
						y : []
					}, termina = function() {
						google.maps.event.removeListener(evtdblclick);
						google.maps.event.removeListener(evtclick);
						google.maps.event.removeListener(evtmousemove);
						var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "i3GEOFselecao");
						i3GEOF.selecao.poligono.termina({
							xpt : pontos.x,
							ypt : pontos.y
						});
						if (f && f.length > 0 && $i("i3GEOFselecaoMantemFigura").checked === false) {
							i3GEO.desenho.googlemaps.destroyFeatures(f);
						}
						f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "i3GEOFselecaoMarcas");
						if (f && f.length > 0) {
							i3GEO.desenho.googlemaps.destroyFeatures(f);
						}
					};
					evtclick = google.maps.event.addListener(i3GeoMap, "click", function(evt) {
						pontos.mvcLine.push(evt.latLng);
						pontos.x.push(evt.latLng.lng());
						pontos.y.push(evt.latLng.lat());
						i3GEO.desenho.googlemaps.shapes.push(new google.maps.Marker({
							map : i3GeoMap,
							fillOpacity : 0,
							clickable : false,
							position : evt.latLng,
							icon : {
								path : google.maps.SymbolPath.CIRCLE,
								scale : 2.5,
								strokeColor : "#ffffff"
							},
							origem : "i3GEOFselecaoMarcas"
						}));
						// mais um ponto para criar uma linha movel
						pontos.mvcLine.push(evt.latLng);
					});
					evtmousemove = google.maps.event.addListener(i3GeoMap, "mousemove", function(evt) {
						if (pontos.mvcLine.getLength() > 0) {
							if (!pontos.line) {
								// Create the line (google.maps.Polyline)
								pontos.line = new google.maps.Polygon({
									map : i3GeoMap,
									clickable : false,
									strokeColor : "#000000",
									strokeOpacity : 1,
									strokeWeight : 2,
									path : pontos.mvcLine,
									origem : "i3GEOFselecao"
								});
								i3GEO.desenho.googlemaps.shapes.push(pontos.line);
							}
							pontos.mvcLine.pop();
							pontos.mvcLine.push(evt.latLng);
						}
					});
					evtdblclick = google.maps.event.addListener(i3GeoMap, "dblclick", function(evt) {
						termina.call();
					});
				}
			},
			/*
			 * Function: termina
			 *
			 * Termina o desenho do pol&iacute;gono e executa a opera&ccedil;&atilde;o de sele&ccedil;&atilde;o
			 */
			termina : function(pontos) {
				var xs, ys, retorna, p, cp, tema = i3GEO.temaAtivo;
				n = pontos.xpt.length;
				xs = pontos.xpt.toString(",");
				ys = pontos.ypt.toString(",");
				retorna = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.janela.abreAguarde("i3GEO.atualiza", $trad("o1"));
				i3GEO.eventos.cliquePerm.ativa();
				p = i3GEO.configura.locaplic + "/ferramentas/selecao/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=selecaoPoli";
				cp = new cpaint();
				// cp.set_debug(2)
				cp.set_transfer_mode('POST');
				cp.set_response_type("JSON");
				cp.call(
					p,
					"selecaoPoli",
					retorna,
					"xs=" + xs
					+ "&ys=" + ys
					+ "&tema=" + tema
					+ "&tipo=" + $i("i3GEOselecaotipoOperacao").value
					+ "&buffer=" + $i("i3GEOselecaotoleranciapt").value);
			}
		},
		/*
		 * Function: criatema
		 *
		 * Cria um novo tema com a sele&ccedil;&atilde;o atual
		 */
		criatema : function() {
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			try {
				if ($i("i3GEOselecaotemasLigados").value === "") {
					i3GEO.janela.tempoMsg("Escolha um tema");
					return;
				}
				i3GEOF.selecao.aguarde.visibility = "visible";
				var fim = function() {
					i3GEOF.selecao.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				};
				i3GEO.php.criatemaSel(fim, $i("i3GEOselecaotemasLigados").value);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
				i3GEOF.selecao.aguarde.visibility = "hidden";
			}
		},
		removeLinha : function(obj,id){
			var linha = $i("linhaFiltro"+id);
			linha.parentNode.removeChild(linha);
		},
		listaValores: function(id){
			var itemTema = $("#linhaFiltro" + id + " [name='coluna']").val();
			i3GEO.util.comboValoresItem(
				"i3GEOselecaocbitens",
				i3GEOF.selecao.tema,
				itemTema,
				function(retorno){
					$i("i3GEOselecaovalores").innerHTML = "<label class='control-label'>" +
						$trad('selecionaValor',i3GEOF.selecao.dicionario) +
						":</label>" +
						retorno.dados;
					if ($i("i3GEOselecaocbitens")){
						$i("i3GEOselecaocbitens").onchange = function() {
							$("#linhaFiltro" + id + " [name='valor']").val(this.value);
						};
					}
				},
				"i3GEOselecaovalores",
				"form-control"
			);
		},
		/*
		 * Function: adicionaLinhaFiltro
		 *
		 * Adiciona uma nova linha de filtro
		 */
		adicionaLinhaFiltro : function() {
			i3GEOF.selecao.CONTADOR++;
			var temp,ntr,tabela;
			ntr = document.createElement("tr");
			ntr.id = "linhaFiltro"+i3GEOF.selecao.CONTADOR;
			temp = Mustache.render(
					"{{#data}}" + i3GEOF.selecao.MUSTACHELINHAFILTRO + "{{/data}}",
					{"data":{"comboTemas": i3GEOF.selecao.comboTemas,"contador": i3GEOF.selecao.CONTADOR, "escondeGuias": i3GEOF.selecao.dicionario["escondeGuias"]}}
			);
			$(ntr).html(temp);
			tabela = $i("i3GEOselecaoparametros");
			tabela.appendChild(ntr);
		},
		/*
		 * Function: atributo
		 *
		 * Seleciona por atributo
		 */
		atributo : function() {
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			if ($i("i3GEOselecaotemasLigados").value === "") {
				i3GEO.janela.tempoMsg($trad('selecionaTema', i3GEOF.selecao.dicionario));
				return;
			}
			try {
				i3GEOF.selecao.aguarde.visibility = "visible";
				var filtro = "", g, ipt, i, ii, nos, s, itemsel, valor, operador, conector, temp;
				if (navm) {
					ii = 2;
				} else {
					ii = 0;
				}
				g = $i("i3GEOselecaoparametros");
				ipt = g.getElementsByTagName("tr");
				if (ipt.length > 0) {
					for (i = ii; i < ipt.length; i++) {
						nos = ipt[i].childNodes;
						s = nos[2].getElementsByTagName("select");
						itemsel = s[0].value;
						s = nos[3].getElementsByTagName("select");
						operador = s[0].value;
						s = nos[4].getElementsByTagName("input");
						valor = s[0].value;
						s = nos[6].getElementsByTagName("select");
						conector = s[0].value;
						if (valor * 1) {
							filtro = filtro + "([" + itemsel + "] " + operador + " " + valor + ")";
						} else {
							filtro = filtro + "(|[" + itemsel + "]| " + operador + " |" + valor + "|)";
						}
						if ((i + 1) != ipt.length) // tem conector
						{
							filtro = filtro + conector;
						} else {
							filtro = "(" + filtro + ")";
						}
					}
				}
				if (filtro === "") {
					i3GEOF.selecao.aguarde.visibility = "hidden";
					return;
				}
				temp = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.php.selecaoatrib2(temp, i3GEO.temaAtivo, filtro, $i("i3GEOselecaotipoOperacao").value);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
				i3GEOF.selecao.aguarde.visibility = "hidden";
			}
		},
		/*
		 * Function: aplicaselecaoTema
		 *
		 * Realiza a sele&ccedil;&atilde;o cruzando um tema com outro
		 */
		aplicaselecaoTema : function() {
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			if ($i("i3GEOselecaotemasLigados").value === "") {
				i3GEO.janela.tempoMsg($trad('selecionaTema', i3GEOF.selecao.dicionario));
				i3GEOF.selecao.aguarde.visibility = "hidden";
				return;
			}
			try {
				i3GEOF.selecao.aguarde.visibility = "visible";
				var temp = function(retorno) {
					i3GEOF.selecao.fimSelecao(retorno);
				};
				i3GEO.php.selecaotema(
					temp,
					$i("i3GEOselecaoTemaoverlay").value,
					i3GEO.temaAtivo,
					$i("i3GEOselecaotipoOperacao").value,
					$i("i3GEOselecaotoleranciapt").value);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
				i3GEOF.selecao.aguarde.visibility = "hidden";
			}
		},
		/*
		 * Function: grafico
		 *
		 * Abre uma janela flutuante para criar gr&aacute;ficos
		 */
		grafico : function() {
			i3GEO.analise.dialogo.graficoInterativo1();
		},
		/*
		 * Function: graficoPerfil
		 *
		 * Abre uma janela flutuante para criar gr&aacute;ficos de perfil
		 */
		graficoPerfil : function() {
			var cp, p;
			if (i3GEOF.selecao.aguarde.visibility === "visible") {
				return;
			}
			if ($i("i3GEOselecaotemasLigados").value === "") {
				i3GEO.janela.tempoMsg("Escolha um tema");
				return;
			}
			try {
				i3GEOF.selecao.aguarde.visibility = "visible";
				var temp = function(retorno) {
					i3GEOF.selecao.aguarde.visibility = "hidden";
					if (retorno.data != undefined) {
						var x = [], y = [], i, n = retorno.data.length, js = i3GEO.configura.locaplic + "/ferramentas/perfil/index.js";
						for (i = 0; i < n; i++) {
							x.push(retorno.data[i].x);
							y.push(retorno.data[i].y);
						}
						if (x.length == 0) {
							i3GEO.janela.tempoMsg($trad('msgNenhumPontoEncontrado', i3GEOF.selecao.dicionario));
							return;
						}
						pontosdistobj = {
							xpt : x,
							ypt : y
						};
						i3GEO.util.scriptTag(js, "i3GEOF.perfil.criaJanelaFlutuante(pontosdistobj)", "i3GEOF.perfil_script");
					}
				};
				cp = new cpaint();
				cp.set_response_type("JSON");
				p =
					i3GEO.configura.locaplic + "/ferramentas/selecao/exec.php?g_sid="
						+ i3GEO.configura.sid
						+ "&funcao=listaPontosShapeSel&tema="
						+ i3GEO.temaAtivo;
				cp.call(p, "listaPontosShape", temp);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
				i3GEOF.selecao.aguarde.visibility = "hidden";
			}
		}
	};
