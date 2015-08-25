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
		/*
		 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
		 */
		criaJanelaFlutuante : function() {
			i3GEOF.selecao.iniciaDicionario();
		},
		/*
		 * Function: iniciaDicionario
		 * 
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
		 * 
		 * O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function() {
			if (typeof (i3GEOF.selecao.dicionario) === 'undefined') {
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic + "/ferramentas/selecao/dicionario.js",
					"i3GEOF.selecao.iniciaJanelaFlutuante()",
					"i3GEOF.selecao.dicionario_script");
			} else {
				i3GEOF.selecao.iniciaJanelaFlutuante();
			}
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
			var b, i, n, ics;
			try {
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
						i3GEOF.selecao.adicionaLinhaFiltro();
					}
				};
				$i("i3GEOselecaoguia3").onclick = function() {
					i3GEO.guias.mostraGuiaFerramenta("i3GEOselecaoguia3", "i3GEOselecaoguia");
					i3GEO.util.comboTemas("i3GEOselecaoTemaoverlay", function(retorno) {
						$i("i3GEOselecaooverlay").innerHTML = retorno.dados;
					}, "i3GEOselecaooverlay", "", false, "naolinearSelecionados", "display:block");
				};
				i3GEOF.selecao.criaCombosTemas();

				i3GEO.util.mensagemAjuda("i3GEOselecaomen1", $i("i3GEOselecaomen1").innerHTML);
				i3GEO.util.mensagemAjuda("i3GEOselecaomen2", $i("i3GEOselecaomen2").innerHTML);
				b = new YAHOO.widget.Button("i3GEOselecaobotao1", {
					onclick : {
						fn : i3GEOF.selecao.atributo
					}
				});
				b.addClass("rodar");
				b = new YAHOO.widget.Button("i3GEOselecaobotao2", {
					onclick : {
						fn : i3GEOF.selecao.aplicaselecaoTema
					}
				});
				b.addClass("rodar");

				b = new YAHOO.widget.Button("i3GEOFSelecaoQuery", {
					onclick : {
						fn : i3GEO.mapa.dialogo.queryMap
					}
				});
				b.addClass("abrir");

				i3GEOF.selecao.ativaFoco();
				ics = $i("i3GEOselecaoguia1obj").getElementsByTagName("button");
				n = ics.length;
				for (i = 0; i < n; i++) {
					ics[i].style.backgroundColor = "white";
					ics[i].className = "iconeGuiaMovel";
					ics[i].onmouseout = function() {
						this.className = "iconeGuiaMovel iconeGuiaMovelMouseOut";
					};
					ics[i].onmouseover = function() {
						this.className = "iconeGuiaMovel iconeGuiaMovelMouseOver";
					};
				}
			} catch (erro) {
				i3GEO.janela.tempoMsg(erro);
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
		html : function() {
			var ins =
				'' + '<div id=i3GEOselecaoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">'
					+ '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">'
					+ '		<li><div id="i3GEOselecaoguia4" style="text-align: center; left: 0px;"><a><em><img class="ticPropriedades2" style="height: 14px" src="' + i3GEO.configura.locaplic
					+ '/imagens/branco.gif"></em></a></div></li>'
					+ '		<li><a  ><em><div id="i3GEOselecaoguia1" style="text-align:center;left:0px;" >'
					+ $trad('mapa', i3GEOF.selecao.dicionario)
					+ '</div></em></a></li>'
					+ '		<li><a  ><em><div id="i3GEOselecaoguia2" style="text-align:center;left:0px;" >'
					+ $trad('atributos', i3GEOF.selecao.dicionario)
					+ '</div></em></a></li>'
					+ '		<li><a  ><em><div id="i3GEOselecaoguia3" style="text-align:center;left:0px;" >'
					+ $trad('cruzamento', i3GEOF.selecao.dicionario)
					+ '</div></em></a></li>'
					+ '	</ul>'
					+ '</div><br>'
					+ '<div class=guiaobj id="i3GEOselecaoguia4obj" style="left:1px;display:none;">'
					+ '	<p class="paragrafo">'
					+ '		<input type="checkbox" onclick="" id="i3GEOFselecaoMantemFigura" style="cursor: pointer; border: 0px solid white;" />'
					+ '		<span style="cursor: pointer; position: relative; top: -2px;">'
					+ $trad('mantemfigura', i3GEOF.selecao.dicionario)
					+ '</span>'
					+ '	</p>'
					+ '	<br><p class=paragrafo >'
					+ $trad('distanciaSelecao', i3GEOF.selecao.dicionario)
					+ '	<div class="styled-select">'
					+ '		<input type=text id=i3GEOselecaotoleranciapt value=0 /></div>'
					+ '		<br><p class=paragrafo ><input id=i3GEOFSelecaoQuery type=button value="'
					+ $trad("p8")
					+ '" /></p>'
					+ '	<br><div id=i3GEOselecaomen1 style=left:0px;width:95%; >'
					+ '		<p class=paragrafo >'
					+ $trad('ajuda', i3GEOF.selecao.dicionario)
					+ '	</p></div>'
					+ '</div>'
					+ '<div class=guiaobj id="i3GEOselecaoguia1obj" style="left:1px;display:none;top:-5px">'
					+ '	<p class=paragrafo style=font-size:0px; ><button title="Clique no mapa para selecionar" value="i3GEOselecaopt" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.tiposel(this)"><img id=i3GEOselecaopt src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/select-one.png" /></button>';
			if (i3GEO.Interface.ATUAL != "googleearth") {
				ins +=
					'	<button title="' + $trad('desenhaPoligono', i3GEOF.selecao.dicionario)
						+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.tiposel(this)" value="i3GEOselecaopoli"><img id=i3GEOselecaopoli src="'
						+ i3GEO.configura.locaplic
						+ '/imagens/gisicons/select-polygon.png" /></button>';
			}
			ins +=
				'	<button title="' + $trad('selecionaVisivel', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.tiposel(this)" value="i3GEOselecaoext" ><img id=i3GEOselecaoext src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/map.png" /></button>';
			ins +=
				'	<button title="' + $trad('utilizaFiguraDesenhada', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.tiposel(this)" value="i3GEOselecaofigura"><img id=i3GEOselecaoFigura src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/select.png" /></button>';

			if (i3GEO.Interface.ATUAL === "openlayers") {
				ins +=
					'	<button title="' + $trad('selecionaRetangulo', i3GEOF.selecao.dicionario)
						+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.tiposel(this)" value="i3GEOselecaobox" ><img id=i3GEOselecaobox src="'
						+ i3GEO.configura.locaplic
						+ '/imagens/gisicons/select-rectangle.png" /></button>';
			}
			ins +=
				'	<button title="' + $trad('inverteSelecao', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.operacao(\'inverte\')"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/selection-invert.png" /></button>'
					+ '	<button title="'
					+ $trad('limpaSelecao', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.operacao(\'limpa\')"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/selected-delete.png" /></button>'
					+ '	<button title="'
					+ $trad('salvaSelecao', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.criatema()"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/save1.png" /></button>'
					+ '	<button title="'
					+ $trad('grafico', i3GEOF.selecao.dicionario)
					+ '" onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.grafico()"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/layer-vector-chart-add.png" /></button>'
					+ '	<button title="'
					+ $trad('perfil', i3GEOF.selecao.dicionario)
					+ '"  onclick="i3GEO.util.animaClique(this);i3GEOF.selecao.graficoPerfil()"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/grafico-perfil.png" /></button>'
					+ '	<button title="'
					+ $trad('editor', i3GEOF.selecao.dicionario)
					+ '"  onclick="i3GEO.util.animaClique(this);i3GEO.barraDeBotoes.editor.inicia()"><img src="'
					+ i3GEO.configura.locaplic
					+ '/imagens/gisicons/edit.png" /></button>'
					+ '	<div style=margin-left:8px;text-align:left;  >'
					+ '		<div class="styled-select">'
					+ '		<select title="'
					+ $trad('tipoOperacao', i3GEOF.selecao.dicionario)
					+ '" id=i3GEOselecaotipoOperacao >'
					+ '		<option value="adiciona" >'
					+ $trad('adicionaASelecao', i3GEOF.selecao.dicionario)
					+ '</option>'
					+ '		<option value="novo" >'
					+ $trad('novaSelecao', i3GEOF.selecao.dicionario)
					+ '</option>'
					+ '		<option value="retira" >'
					+ $trad('retiraDaSelecao', i3GEOF.selecao.dicionario)
					+ '</option>'
					+ '		</select></div>'
					+ '		<span id=i3GEOselecaoNsel class=paragrafo >0</span>'
					+ '		<br><p class=paragrafo >'
					+ $trad('temas', i3GEOF.selecao.dicionario)
					+ '<div id=i3GEOselecaoComboTemas style=text-align:left; ></div>'
					+ '		</div> '
					+ '	</div>'
					+ '</div>'
					+ '<div class=guiaobj id="i3GEOselecaoguia2obj" style="left:1px;display:none;">'
					+ '	<p class=paragrafo ><input id=i3GEOselecaobotao1 size=18  type="button" value="'
					+ $trad('seleciona', i3GEOF.selecao.dicionario)
					+ '" /></p>'
					+ '	<table summary="" id="i3GEOselecaoparametros" style="width:380px" >'
					+ '		<tbody><tr><td></td><td></td>'
					+ '			<td style=background-color:yellow >'
					+ $trad('item', i3GEOF.selecao.dicionario)
					+ '</td>'
					+ '			<td style=background-color:yellow >'
					+ $trad('operador', i3GEOF.selecao.dicionario)
					+ '</td>'
					+ '			<td style=background-color:yellow >'
					+ $trad('valor', i3GEOF.selecao.dicionario)
					+ '</td>'
					+ '			<td style=background-color:yellow ></td>'
					+ '			<td style=background-color:yellow >'
					+ $trad('conector', i3GEOF.selecao.dicionario)
					+ '</td>'
					+ '		</tr>'
					+ '		<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr></tbody>'
					+ '	</table>'
					+ '	<div id=i3GEOselecaoresultado style="position:relative;top:5px;left:0px">'
					+ '	</div>'
					+ '	<div id=i3GEOselecaovalores style="position:relative;top:5px;left:0px">'
					+ '	</div>'
					+ '	<div id=i3GEOselecaomen2 style=top:15px;left:0px; ><p class=paragrafo >'
					+ $trad('separaComVirgula', i3GEOF.selecao.dicionario)
					+ '</div>'
					+ '</div> '
					+ '<div class=guiaobj id="i3GEOselecaoguia3obj" style="left:1px;display:none;">'
					+ '	<p class=paragrafo >'
					+ $trad('temaSelecaoMapa', i3GEOF.selecao.dicionario)
					+ '</p>'
					+ '	<div id="i3GEOselecaooverlay" class="styled-select" >'
					+ '	</div>'
					+ '	<br><p class=paragrafo ><input id=i3GEOselecaobotao2 size=10 type=button value="'
					+ $trad('aplica', i3GEOF.selecao.dicionario)
					+ '">'
					+ '</div>';
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
				var t = i3GEO.janela.minimiza("i3GEOF.selecao", "100px");
				if (t === "min") {
					$i("i3GEOFSelecaoCabecalhoI").style.display = "none";
				} else {
					$i("i3GEOFSelecaoCabecalhoI").style.display = "block";
				}
			};
			titulo =
				"<span class='i3GEOiconeFerramenta i3GEOiconeSelecao' title='" + $trad("x51")
					+ "'></span>"
					+ "<div id='i3GEOFSelecaoCabecalhoI' style='left:10px;'>"
					+ "<div class='i3GeoTituloJanela'>"
					+ $trad("x51")
					+ "<a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=5&idajuda=48a' ><b> </b></a></div></div></div>";
			janela = i3GEO.janela.cria("510px", "210px", "", "", "", titulo, "i3GEOF.selecao", false, "hd", cabecalho, minimiza);
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
				i3GEO.barraDeBotoes.ativaPadrao();
				if(i3GEO.Interface["ATUAL"] === "openlayers"){
					if (typeof OpenLayers == "undefined") {
						api = "ol3";
						i3GEO.Interface.openlayers.interacoes[0].setActive(true);//duplo clique
					} else {
						api = "openlayers";
					}
				}
				else{
					api = i3GEO.Interface["ATUAL"];
				}
				i3GEOF.selecao.removeFiguras[api]();
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			i3GEO.util.mudaCursor(i3GEO.configura.cursores, "crosshair", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
		},
		/*
		 * Function: ativaFoco
		 * 
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function() {
			i3GEO.eventos.cliquePerm.desativa();
			i3GEO.util.mudaCursor(i3GEO.configura.cursores, "crosshair", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
			i3GEO.barraDeBotoes.ativaIcone("selecao");
			i3GEOF.selecao.pegaTemasSel();
			i3GEOF.selecao.mudaicone();
			var i = $i("i3GEOF.selecao_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
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
			i3GEO.util.comboTemas("i3GEOselecaotemasLigados", function(retorno) {
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
			}, "i3GEOselecaoComboTemas", "", true, "ligados", "width:440px;font-size:12px");
		},
		/*
		 * Function: mudaicone
		 * 
		 * Altera as bordas dos &iacute;cones
		 */
		mudaicone : function() {
			$i("i3GEOselecaopt").parentNode.style.backgroundColor = "#F5F5F5";
			$i("i3GEOselecaoext").parentNode.style.backgroundColor = "#F5F5F5";
			if ($i("i3GEOselecaobox")) {
				$i("i3GEOselecaobox").parentNode.style.backgroundColor = "#F5F5F5";
			}
			if ($i("i3GEOselecaopoli")) {
				$i("i3GEOselecaopoli").parentNode.style.backgroundColor = "#F5F5F5";
			}
			if ($i("i3GEOselecaoFigura")) {
				$i("i3GEOselecaoFigura").parentNode.style.backgroundColor = "#F5F5F5";
			}
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
			return selectedArray.toString();
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
			i3GEO.eventos.adicionaEventos("SELECAO", [
				"i3GEOF.tabela.atualizaListaDeRegistros()"
			]);
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
				if (i3GEO.Interface["ATUAL"] === "openlayers") {
					if (typeof OpenLayers == "undefined") {
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
					i3GEOF.selecao.mudaicone();
					obj.style.backgroundColor = "#cedff2";
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.box[api].inicia();
				}
				if (obj.value == "i3GEOselecaopt") {
					i3GEOF.selecao.tipoSel = obj.value;
					i3GEOF.selecao.mudaicone();
					obj.style.backgroundColor = "#cedff2";
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.clique[api].inicia();
				}
				if (obj.value == "i3GEOselecaopoli") {
					i3GEOF.selecao.tipoSel = obj.value;
					i3GEOF.selecao.mudaicone();
					obj.style.backgroundColor = "#cedff2";
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEOF.selecao.poligono[api].inicia();
				}
				if (obj.value == "i3GEOselecaofigura") {
					i3GEOF.selecao.tipoSel = obj.value;
					i3GEOF.selecao.mudaicone();
					obj.style.backgroundColor = "#cedff2";
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
				i3GEOF.selecao.mudaicone();
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
				i3GEOF.selecao.mudaicone();
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
					if(features.getLength() === 0){
						return;
					}
					i3GEO.eventos.cliquePerm.desativa();
					i3GEOF.selecao.figura.ol3.removeControle();
					i3GEOF.selecao.figura.ol3.draw = new ol.interaction.Select();
					i3GEOF.selecao.figura.ol3.draw.on("select",function(evt){
						var wkt, geo, i, n, f, format = new ol.format.WKT();
						geo = i3GEOF.selecao.figura.ol3.draw.getFeatures();
						n = geo.getLength();
						for(i=0; i<n; i++){
							f = geo.item(i);
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
					i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
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
				i3GEOF.selecao.mudaicone();
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
				i3GEOF.selecao.mudaicone();
				p = i3GEO.configura.locaplic + "/ferramentas/selecao/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=selecaoPoli";
				cp = new cpaint();
				// cp.set_debug(2)
				cp.set_transfer_mode('POST');
				cp.set_response_type("JSON");
				cp.call(
					p,
					"selecaoPoli",
					retorna,
					"xs=" + xs,
					"ys=" + ys,
					"tema=" + tema,
					"tipo=" + $i("i3GEOselecaotipoOperacao").value,
					"buffer=" + $i("i3GEOselecaotoleranciapt").value);
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
		/*
		 * Function: adicionaLinhaFiltro
		 * 
		 * Adiciona uma nova linha de filtro
		 */
		adicionaLinhaFiltro : function() {
			var add, xis, interrogacao, operador, conector, valor, ntr, ntad, ntd, ntd1, ntd2, ntd3, ntd4, ntd5, tabela;
			try {
				add = document.createElement("img");
				add.src = i3GEO.configura.locaplic + '/imagens/oxygen/16x16/list-add.png';
				add.style.cursor = "pointer";
				add.onclick = function() {
					i3GEOF.selecao.adicionaLinhaFiltro();
				};

				xis = document.createElement("img");
				xis.src = i3GEO.configura.locaplic + '/imagens/oxygen/16x16/edit-delete.png';
				xis.style.cursor = "pointer";
				xis.onclick = function() {
					var p = this.parentNode.parentNode.parentNode, i;
					for (i = 0; i < p.childNodes.length; i++) {
						p.removeChild(p.childNodes[i]);
					}
				};
				interrogacao = document.createElement("img");
				interrogacao.src = i3GEO.configura.locaplic + '/imagens/oxygen/16x16/format-line-spacing-normal.png';
				interrogacao.title = 'mostra valores';
				interrogacao.style.cursor = "pointer";
				interrogacao.style.margin = "5px";
				interrogacao.onclick =
					function() {
						var obj = (this.parentNode.parentNode.getElementsByTagName("input"))[0], itemTema =
							(this.parentNode.parentNode.getElementsByTagName("select"))[0].value;
						i3GEO.util.comboValoresItem("i3GEOselecaocbitens", i3GEO.temaAtivo, itemTema, function(retorno) {
							$i("i3GEOselecaovalores").innerHTML =
								"<br><p class=paragrafo >" + $trad('selecionaValor', i3GEOF.selecao.dicionario)
									+ ":</p>"
									+ "<div class='styled-select'  >"
									+ retorno.dados
									+ "</div>";
							if ($i("i3GEOselecaocbitens")) {
								$i("i3GEOselecaocbitens").onchange = function() {
									obj.value = this.value;
								};
							}
						}, "i3GEOselecaovalores", "display:block");
					};
				operador = "<div class='styled-select' style='width:95px;margin-left:5px;'><select>";
				operador += "<option value='='>=</option>";
				operador += "<option value='!='> != </option>";
				operador += "<option value='<'> < </option>";
				operador += "<option value='>'> > </option>";
				operador += "<option value='<='> <= </option>";
				operador += "<option value='>='> >= </option>";
				operador += "<option value='in'> in </option>";
				operador += "<option value='ilike'>like (Postgis)</option>";
				operador += "<option value='not ilike'>not like (Postgis)</option>";
				operador += "<option value='~='> regExp </option></select></div>";

				conector = "<div class='styled-select' style='width:95px;margin-left:5px;' ><select>";
				conector += "<option value='and'>and</option>";
				conector += "<option value='or'>or</option>";
				conector += "<option value='not'>not</option></select></div>";

				valor = document.createElement("div");
				valor.className = 'i3geoForm100 i3geoFormIconeEdita';
				valor.style.marginLeft = "5px";
				valor.innerHTML = "<input type=text value='' />";

				ntr = document.createElement("tr");
				ntad = document.createElement("td");
				ntad.appendChild(add);
				ntr.appendChild(ntad);

				ntd = document.createElement("td");
				ntd.appendChild(xis);
				ntr.appendChild(ntd);

				ntd1 = document.createElement("td");
				i3GEO.util.comboItens("i3GEOselecaoItensAtrib", i3GEO.temaAtivo, function(retorno) {
					ntd1.innerHTML = "<div class='styled-select' style='width:95px;margin-left:5px;' >" + retorno.dados + "</div>";
					$i("i3GEOselecaoItensAtrib").onchange = function() {
						$i("i3GEOselecaovalores").innerHTML = "";
					};
				});
				ntr.appendChild(ntd1);

				ntd2 = document.createElement("td");
				ntd2.innerHTML = operador;
				ntr.appendChild(ntd2);

				ntd3 = document.createElement("td");
				ntd3.appendChild(valor);
				ntr.appendChild(ntd3);

				ntd4 = document.createElement("td");
				ntd4.appendChild(interrogacao);
				ntr.appendChild(ntd4);

				ntd5 = document.createElement("td");
				ntd5.innerHTML = conector;
				ntr.appendChild(ntd5);

				// ntb = document.createElement("tbody");
				// ntb.appendChild(ntr);
				if (navm) {
					tabela = $i("i3GEOselecaoparametros").getElementsByTagName("tbody")[0];
				} else {
					tabela = $i("i3GEOselecaoparametros");
				}
				tabela.appendChild(ntr);
			} catch (e) {
				i3GEO.janela.tempoMsg("Erro: " + e);
			}
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
