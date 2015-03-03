/**
 * Title: Mapa
 *
 * Executa opera&ccedil;&otilde;es obre o mapa principal
 *
 * Em i3GEO.mapa.dialogo estao as funcoes de abertura dos dialogos para
 * alteracao das propriedades do mapa, como cor de fundo, tipo de imagem,
 * legenda etc.
 *
 * Namespace:
 *
 * i3GEO.mapa
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_mapa.js>
 */

/**
 * Licen&ccedil;a
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica
 * Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do GNU junto com
 * este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite 330, Boston, MA
 * 02111-1307 USA.
 *
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
//TODO incluir nova ferramenta para usar a opcao de mascara do Mapserver
//TODO incluir opcao para gerar imagem via canvas apenas do corpo do mapa
i3GEO.mapa =
	{
		/**
		 * Propriedade: TEMASINICIAISLIGADOS
		 *
		 * Lista indicando quais temas serao adicionados ao mapa na inicializacao
		 *
		 * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
		 *
		 * Os temas sao aqueles que aparecem em i3geo/temas
		 *
		 * Tipo:
		 *
		 * {string}
		 */
		TEMASINICIAISLIGADOS : "",
		/**
		 * Propriedade: TEMASINICIAIS
		 *
		 * Lista indicando quais temas serao ligados na inicializacao
		 *
		 * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
		 *
		 * Os temas sao aqueles que aparecem em i3geo/temas
		 *
		 * Tipo:
		 *
		 * {string}
		 */
		TEMASINICIAIS : "",
		/**
		 * Propriedade: AUTORESIZE
		 *
		 * Indica se o tamanho do mapa sera ajustado toda vez que o navegador for redimensionado
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		AUTORESIZE : false,
		/**
		 * Propriedade: RESOLUCAOTIP
		 *
		 * Resolu&ccedil;&atilde;o de busca utilizada no bal&atilde;o de identifica&ccedil;&atilde;o
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 12
		 */
		RESOLUCAOTIP : 8,
		/**
		 * Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
		 *
		 * Tipo {Array}
		 */
		GEOXML : [],
		/**
		 * Function: insereDobraPagina
		 *
		 * Insere o icone do tipo "dobra de pagina" que permite alterar o renderizador do mapa
		 *
		 * Parametros:
		 *
		 * {string} - tipo de icone googlemaps|openlayers
		 *
		 * {string} - endereco da imagem que sera utilizada no icone
		 */
		insereDobraPagina : function(tipo, imagem) {
			var novoel = $i("i3GEOdobraPagina");
			if (!novoel) {
				novoel = document.createElement("img");
			}
			novoel.src = imagem;
			novoel.id = "i3GEOdobraPagina";
			if (tipo === "googlemaps") {
				novoel.onclick = function(evt) {
					i3GEO.Interface.atual2gm.inicia();
				};
			}
			if (tipo === "openlayers") {
				novoel.onclick = function(evt) {
					i3GEO.Interface.atual2ol.inicia();
				};
			}
			novoel.style.cursor = "pointer";
			novoel.style.position = "absolute";
			novoel.style.top = i3GEO.parametros.h - 35 + "px";
			novoel.style.zIndex = "5000000";
			novoel.style.left = i3GEO.parametros.w - 35 + "px";
			$i(i3GEO.Interface.IDMAPA).appendChild(novoel);
			YAHOO.util.Event.addListener("i3GEOdobraPagina", "click", YAHOO.util.Event.stopPropagation);
			YAHOO.util.Event.addListener("i3GEOdobraPagina", "click", YAHOO.util.Event.preventDefault);

		},
		/**
		 * Reposiciona o icone do tipo "dobra de pagina"
		 */
		reposicionaDobraPagina : function() {
			var novoel = $i("i3GEOdobraPagina");
			if (!novoel) {
				return;
			}
			novoel.style.top = i3GEO.parametros.h - 35 + "px";
			novoel.style.left = i3GEO.parametros.w - 35 + "px";
		},
		/**
		 * Ativa o redimensionamento automatico do mapa sempre que o navegador for redimensionado
		 *
		 * e definido como um evento do elemento window
		 */
		ativaAutoResize : function() {
			var ativo = true;
			window.onresize = function() {
				var Dw, Dh, r = false;
				Dw = YAHOO.util.Dom.getViewportWidth();
				Dh = YAHOO.util.Dom.getViewportHeight();
				if (Math.abs(Dw - i3GEO.tamanhodoc[0]) > 50) {
					r = true;
				}
				if (Math.abs(Dh - i3GEO.tamanhodoc[1]) > 50) {
					r = true;
				}
				if (r === false) {
					// return;
				}
				i3GEO.tamanhodoc = [
					Dw,
					Dh
				];
				if (ativo === true) {
					setTimeout(function() {
						i3GEO.reCalculaTamanho();
						i3GEO.barraDeBotoes.recria("i3geo_barra2");
						if (i3GEO.Interface.TABLET === true) {
							i3GEO.guias.escondeGuias();
							return;
						}
						if (i3GEO.guias.TIPO === "movel") {
							i3GEO.guias.guiaMovel.reposiciona();
							i3GEO.guias.guiaMovel.abreFecha("fecha");
						} else {
							i3GEO.guias.ajustaAltura();
						}
						i3GEO.mapa.reposicionaDobraPagina();

						ativo = true;
					}, 2000);
				}
				ativo = false;
			};
		},
		/**
		 * Ajusta o posicionamento do corpo do mapa
		 *
		 * Esse ajuste e necessario na inicializacao, uma vez que o mapa utiliza style.position='absolute'
		 *
		 * Parameters:
		 *
		 * elemento {String} - id do elemento HTML que devera ser ajustado e que contem o mapa
		 */
		ajustaPosicao : function(elemento) {
			if (arguments.length === 0) {
				return;
			}
			var imagemxi = 0, imagemyi = 0, dc = $i(elemento), c;
			if (!dc) {
				return;
			}
			try {
				while ((dc.offsetParent) && (dc.offsetParent.id !== "i3geo")) {
					dc = dc.offsetParent;
					imagemxi += dc.offsetLeft;
					imagemyi += dc.offsetTop;
				}
				c = $i(i3GEO.Interface.IDCORPO);
				if (c) {
					c.style.position = "absolute";
					if (navm) {
						i3GEO.util.$left(i3GEO.Interface.IDCORPO, imagemxi - 1);
					} else {
						i3GEO.util.$left(i3GEO.Interface.IDCORPO, imagemxi);
					}
					i3GEO.util.$top(i3GEO.Interface.IDCORPO, imagemyi);
				}
			} catch (e) {
				i3GEO.janela.tempoMsg("Ocorreu um erro. i3GEO.mapa.ajustaPosicao " + e);
			}
		},
		/**
		 * Function: ativaTema
		 *
		 * Altera a variavel i3GEO.temaAtivo e atualiza a interface em funcao do novo tema que for ativado
		 *
		 * O tema anteriormente ativo tem sua cor alterada para a cor normal e o novo tema e destacado com uma cor diferente
		 *
		 * Executa tambem as funcoes armazenadas em i3GEO.eventos.ATIVATEMA
		 *
		 * Parametros:
		 *
		 * {string} - codigo da camada
		 */
		ativaTema : function(codigo) {
			if (codigo) {
				if (codigo === "") {
					return;
				}
				if (i3GEO.temaAtivo !== "") {
					i3GEO.util.defineValor("ArvoreTituloTema" + i3GEO.temaAtivo, "style.color", "");
				}
				i3GEO.temaAtivo = codigo;
				i3GEO.util.defineValor("ArvoreTituloTema" + codigo, "style.color", "brown");
			}
		},
		/**
		 * Function: ativaLogo
		 *
		 * Ativa ou desativa a logo marca.
		 */
		ativaLogo : function() {
			if (i3GEO.Interface.ATUAL === "googlemaps") {
				alert($trad("x21"));
				return;
			}
			i3GEO.php.ativalogo(i3GEO.atualiza);
			var cr = $i("i3GEOcopyright");
			if (cr) {
				if (cr.style.display === "block") {
					cr.style.display = "none";
				} else {
					cr.style.display = "block";
				}
			}
		},
		/**
		 * Verifica se ocorreu algum problema na atualizacao do corpo do mapa e inicia o processo de tentativa de recuperacao
		 *
		 * Parametro:
		 *
		 * {objeto} - objeto recebido da funcao PHP de atualizacao do mapa
		 */
		verifica : function(retorno) {
			try {
				if (retorno.data) {
					retorno = retorno.data;
				}
				if (retorno.variaveis) {
					retorno = retorno.variaveis;
				}
				if ((retorno === "erro") || (typeof (retorno) === 'undefined')) {
					i3GEO.mapa.ajustaPosicao();
					i3GEO.janela.fechaAguarde();
					i3GEO.mapa.recupera.inicia();
				}
				i3GEO.mapa.recupera.TENTATIVA = 0;
			} catch (e) {
				if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
					i3GEO.janela.fechaAguarde();
					return;
				}
				if (this.recupera.TENTATIVA === 0) {
					i3GEO.janela.tempoMsg("Erro no mapa. Sera feita uma tentativa de recuperacao.");
					i3GEO.mapa.recupera.inicia();
				} else {
					i3GEO.janela.tempoMsg("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");
					if (this.recupera.TENTATIVA === 1) {
						this.recupera.TENTATIVA = 2;
						i3GEO.php.reiniciaMapa(i3GEO.atualiza);
					}
				}
			}
		},
		/**
		 * Tenta recuperar o mapa caso ocorra algum problema
		 *
		 * O i3Geo mantem sempre uma copia do arquivo mapfile em uso. Essa funcao tenta usar essa copia para restaurar o funcionamento do
		 * mapa
		 */
		recupera : {
			/**
			 * Armazena a quantidade de tentativas de recuperacao que foram feitas
			 *
			 * Tipo {Integer}
			 */
			TENTATIVA : 0,
			/**
			 * Inicia a tentativa de recuperacao
			 */
			inicia : function() {
				i3GEO.mapa.ajustaPosicao();
				i3GEO.janela.fechaAguarde();
				if (this.recupera.TENTATIVA === 0) {
					this.recupera.TENTATIVA++;
					this.recupera.restaura();
				}
			},
			/**
			 * Restaura o mapa para a copia de seguranca existente no servidor
			 */
			restaura : function() {
				i3GEO.php.recuperamapa(i3GEO.atualiza);
			}
		},
		/**
		 * Controla a obtencao da legenda do mapa na forma de uma imagem
		 *
		 * e utilizado principalmente para armazenar as imagens para a funcao de obtencao do historico do mapa
		 */
		legendaIMAGEM : {
			/**
			 * Faz a chamada em AJAX que gera a legenda
			 *
			 * O resultado e processado pela funcao passada como parametro
			 *
			 * Parametro:
			 *
			 * funcao {function} - funcao que recebera o resultado da chamada AJAX. O objeto CPAINT e enviado como parametro.
			 */
			obtem : function(funcao) {
				i3GEO.php.criaLegendaImagem(funcao);
			}
		},
		/**
		 * Function: compactaLayerGrafico
		 *
		 * Retorna uma string no formato base64 + JSON contendo as geometrias existentes no layer grafico do mapa Essas geometrias podem ser
		 * criadas com o editor vetorial
		 */
		compactaLayerGrafico : function() {
			var geos = false, geometrias = [], n = 0, i, g;
			if (i3GEO.editorOL && i3GEO.desenho.layergrafico && i3GEO.desenho.layergrafico.features) {
				geos = i3GEO.desenho.layergrafico.features;
				n = geos.length;
				for (i = 0; i < n; i++) {
					g = {
						"atributos" : geos[i].attributes,
						"geometria" : geos[i].geometry.toString()
					};
					geometrias.push(g);
				}
			}
			g = YAHOO.lang.JSON.stringify(geometrias);
			return i3GEO.util.base64encode(g);
		},
		/**
		 * Function: desCompactaLayerGrafico
		 *
		 * Descompacta um layer grafico criado com compactaLayerGrafico
		 */
		desCompactaLayerGrafico : function(geometrias) {
			geometrias = YAHOO.lang.JSON.parse(geometrias);
			// carrega o script do editor vetorial
			if (geometrias.length > 0) {
				var inicia = function() {
					i3GEO.barraDeBotoes.editor.ativaPainel();
					var n = geometrias.length, i;
					for (i = 0; i < n; i++) {
						i3GEO.editorOL.adicionaFeatureWkt(geometrias[i].geometria, geometrias[i].atributos);
					}
					$i(i3GEO.editorOL.layergrafico.id).style.zIndex = 5000;
				};
				i3GEO.util.scriptTag(i3GEO.configura.locaplic + "/mashups/openlayers.js", inicia, "openlayers.js", true);
			}
		},
		/**
		 * Function: restauraGraficos
		 *
		 * Descompacta graficos salvos no mapa atual
		 */
		restauraGraficos : function(graficos) {
			// carrega o script do editor vetorial
			if (graficos.length > 0) {
				var inicia = function() {
					i3GEOF.graficointerativo1.restauraGraficos(graficos);
				};
				i3GEO.util.scriptTag(
					i3GEO.configura.locaplic + "/ferramentas/graficointerativo1/dependencias.php",
					inicia,
					"graficointerativo1",
					true);
			}
		},
		/**
		 * Function: restauraTabelas
		 *
		 * Descompacta tabelas salvas no mapa atual
		 */
		restauraTabelas : function(tabelas) {
			// carrega o script do editor vetorial
			if (tabelas.length > 0) {
				var inicia = function() {
					i3GEOF.tabela.restauraTabelas(tabelas);
				};
				i3GEO.util.scriptTag(i3GEO.configura.locaplic + "/ferramentas/tabela/dependencias.php", inicia, "tabela", true);
			}
		},
		//
		// aplica as preferencias armazenadas localmente ou vindas de um mapa
		// salvo no banco de dados
		//
		aplicaPreferencias : function(cookies) {
			// aplica preferencias do usuario
			var props, nprops, i, temp = [], pint;
			if (!cookies) {
				cookies = i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo");
			}
			//TODO remover eval
			if (cookies) {
				props = cookies.split("::");
				nprops = props.length;
				for (i = 0; i < nprops; i++) {
					try {
						temp = props[i].split("|");
						pint = parseInt(temp[1], 10);
						if (temp[1] === 'true' || temp[1] === 'false') {
							if (temp[1] === 'true') {
								temp[1] = true;
							}
							if (temp[1] === 'false') {
								temp[1] = false;
							}
							eval(temp[0] + " = " + temp[1] + ";");
						} else if (pint + "px" == temp[1]) {
							eval(temp[0] + " = '" + temp[1] + "';");
						} else if (YAHOO.lang.isNumber(pint)) {
							eval(temp[0] + " = " + temp[1] + ";");
						} else {
							eval(temp[0] + " = '" + temp[1] + "';");
						}
						// algumas propriedades usam cookies
						if (temp[0] == "i3GEO.configura.mapaRefDisplay") {
							i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay", temp[1]);
						}
					} catch (e) {
					}
				}
			}
		},
		//TODO incluir opcao para escolha do template da legenda
		/**
		 * Section: i3GEO.mapa.legendaHTML
		 *
		 * Controla a obtencao da legenda do mapa formatada em HTML.
		 *
		 * util para mostrar a legenda na tela em um div qualquer
		 *
		 * Por default, a legenda sera inserida no DIV com id = wlegenda_corpo
		 */
		legendaHTML : {
			/**
			 * Propriedade: incluiBotaoLibera
			 *
			 * Define se na legenda sera incluido o botao para liberar a legenda e inclui-la em uma janela flutuante
			 *
			 * Tipo:
			 *
			 * {boolean}
			 *
			 * Default:
			 *
			 * true
			 */
			incluiBotaoLibera : false,
			/**
			 * Armazena o id definido na criacao da legenda
			 */
			ID : "",
			/**
			 * Armazena a lista de camadas que devem ficar escondidas na legenda
			 */
			CAMADASSEMLEGENDA : [],
			/**
			 * Function: cria
			 *
			 * Cria a legenda HTML
			 *
			 * O elemento HTML definido em ID deve ter style=display:block
			 *
			 * A legenda e incluida no id definido. Se id for igual a "", sera apenas definido o evento de atualizacao, permitindo que seja
			 * criada a janela flutuante, por exemplo:
			 *
			 * i3GEO.mapa.legendaHTML.cria(""); i3GEO.mapa.legendaHTML.libera();
			 *
			 * Parametros:
			 *
			 * {String} - id do elemento que recebera a legenda
			 */
			cria : function(id) {
				if (arguments.length === 0) {
					id = "";
				}
				i3GEO.mapa.legendaHTML.ID = id;
				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
					"i3GEO.mapa.legendaHTML.atualiza()"
				]);
				i3GEO.mapa.legendaHTML.atualiza();
			},
			/**
			 * Function: atualiza
			 *
			 * Atualiza o elemento HTML do mapa utilizado para mostrar a legenda
			 */
			atualiza : function() {
				var idleg = $i("wlegenda_corpo"), temp =
					function(retorno) {
						var legenda = "", ins, re, desativar, tema = "", classe = "",b;
						re = new RegExp();
						if (retorno.data !== "erro" && retorno.data !== undefined) {
							// troca os ids pois podem ja existir na arvore de
							// camadas
							re = new RegExp("legendack_", "g");
							retorno.data.legenda = retorno.data.legenda.replace(re, "liblegendack_");
							legenda =
								"<div class='botoesLegendaFlutuante'>"
								+ "<input type='button' value='" + $trad("mostraTodosLegenda") + "' id='legendaMostraTodos' />"
								+ "<input type='button' value='" + $trad("mostraSoLegenda") + "' id='legendaMostraSo' />"
								+ "<input type='button' value='PNG' id='legendaExpImagem' />"
								+ "</div>"
								+ "<div id='i3GEOconteudoLegenda' class='i3GEOconteudoLegendaClass' style='width:100%;height:100%;'><div>" + retorno.data.legenda + "</div>";
						}
						if (legenda != "" && idleg) {
							ins = "";
							//mostra o icone que permite liberar a legenda (usado quando nao esta em uma janela flutuante)
							if (i3GEO.mapa.legendaHTML.incluiBotaoLibera === true) {
								ins +=
									'<div style="cursor: pointer; text-align: left; font-size: 10px; display: block; height: 35px;" onclick="i3GEO.mapa.legendaHTML.libera()"><img id="soltaLeg" src="../imagens/branco.gif" title="clique para liberar" style="margin: 5px; position: relative;"> <p style="position: relative; left: -35px; top: -22px;">'
										+ $trad("x11") + '</p></div>';
							}
							re = new RegExp("<img src='' />", "g");
							legenda = legenda.replace(re, "");
							ins += "<div id='corpoLegi' >" + legenda + "</div>";

							idleg.innerHTML = "<div style='padding:5px;' >" + ins + "</div>";
							//botoes de funcoes especiais
							if($i("legendaMostraTodos")){
								b = new YAHOO.widget.Button(
									"legendaMostraTodos", 
									{onclick:{fn: function(){
										i3GEO.mapa.legendaHTML.mostraTodosOsTemas();
									}}}
								);
								b.addClass("legendaMostraTodosTemas");
								b = new YAHOO.widget.Button(
									"legendaMostraSo", 
									{onclick:{fn: function(){
										var n,i,temp,
											raiz = $i("corpoLegi").parentNode;
										temp = raiz.getElementsByClassName("i3GEOLegendaExcluiTema");
										n = temp.length;
										for(i = 0;i < n; i++){
											temp[i].style.display = "none";
										}
										temp = raiz.getElementsByTagName("input");
										n = temp.length;
										for(i = 0;i < n; i++){
											temp[i].style.display = "none";
										}
									}}}
								);
								b.addClass("legendaMostraSoTemas");
								b = new YAHOO.widget.Button(
									"legendaExpImagem", 
									{onclick:{fn: function(){
										var obj = $i("i3GEOconteudoLegenda");
										obj.style.width = $i("wlegenda").style.width;
										obj.style.height = $i("wlegenda_corpo").style.height;
										i3GEO.mapa.dialogo.html2canvas(obj);
									}}}
								);
								b.addClass("legendaExpImagemPng");
							}
						}
						i3GEO.mapa.legendaHTML.escondeTemasMarcados();
						// desmarca as classes desligadas
						desativar = retorno.data.desativar;
						for (tema in desativar) {
							for (classe in desativar[tema]) {
								ins = $i("liblegendack_" + tema + "_" + desativar[tema][classe]);
								if (ins) {
									ins.checked = false;
								}
							}
						}
					};
				if (idleg && idleg.style.display === "block") {
					// para o caso da legenda ja estar aberta
					if (i3GEO.mapa.legendaHTML.ID !== "") {
						idleg = $i(i3GEO.mapa.legendaHTML.ID);
						if (idleg) {
							idleg.innerHTML = "";
						}
					}
					i3GEO.mapa.legendaHTML.obtem(temp);
				} else {
					if (idleg) {
						idleg.innerHTML = "";
					}
					if (i3GEO.mapa.legendaHTML.ID !== "") {
						idleg = $i(i3GEO.mapa.legendaHTML.ID);
						if (idleg && idleg.style.display === "block") {
							i3GEO.mapa.legendaHTML.obtem(temp);
						}
					}
				}
			},
			/**
			 * Faz a chamada em AJAX que gera a legenda
			 *
			 * O resultado e processado pela funcao passada como parametro
			 *
			 * O template utilizado para gerar a legenda &eacute; definido em i3GEO.configura.templateLegenda
			 *
			 * Parametro:
			 *
			 * funcao {function} - funcao que recebera o resultado da chamada AJAX. O objeto CPAINT e enviado como parametro.
			 */
			obtem : function(funcao) {
				i3GEO.php.criaLegendaHTML(funcao, "", i3GEO.configura.templateLegenda);
			},
			/**
			 * Liga ou desliga um unico tema. Utilizado pela legenda HTML, permitindo que um tema seja processado diretamente na legenda.
			 *
			 * Parametro:
			 *
			 * inputbox {object) - objeto do tipo input checkbox com a propriedade value indicando o codigo do tema que sera processado
			 */
			ativaDesativaTema : function(inputbox) {
				var temp = function() {
					// i3GEO.contadorAtualiza++;
					i3GEO.php.corpo(i3GEO.atualiza, i3GEO.configura.tipoimagem);
					i3GEO.arvoreDeCamadas.atualiza("");
					i3GEO.janela.fechaAguarde("redesenha");
				};
				if (!inputbox.checked) {
					i3GEO.php.ligatemas(temp, inputbox.value, "");
				} else {
					i3GEO.php.ligatemas(temp, "", inputbox.value);
				}
			},
			escondeTema : function(tema) {
				var d = $i("legendaLayer_" + tema);
				if (d) {
					d.style.display = "none";
					i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA.push(tema);
				}
			},
			escondeTemasMarcados : function() {
				var temas = i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA, n = temas.length, i, temp;
				for (i = 0; i < n; i++) {
					temp = $i(temas[i]);
					if (temp) {
						temp.style.display = "none";
					}
				}
			},
			mostraTodosOsTemas : function() {
				i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA = [];
				i3GEO.mapa.legendaHTML.atualiza();
			},
			/**
			 * Function: libera
			 *
			 * Libera a legenda criando uma janela flutuante sobre o mapa
			 *
			 * Parametros:
			 *
			 * {sim|nao} - (opcional) inclui ou nao o checkbox que permitem desligar a camada
			 *
			 * {numeric} - largura da janela
			 *
			 * {numeric} - altura
			 *
			 * {numeric} - posicao desde o topo
			 *
			 * {numeric} - posicao desde a esquerda
			 */
			libera : function(ck, largura, altura, topo, esquerda) {
				if (!ck) {
					ck = "nao";
				}
				if (!largura) {
					largura = 340;
				}
				if (!altura) {
					altura = 300;
				}
				var cabecalho, minimiza, janela, titulo;
				if (!$i("wlegenda")) {
					cabecalho = function() {
					};
					minimiza = function() {
						var t = i3GEO.janela.minimiza("wlegenda", "100px");
						if (t === "min") {
							$i("legendaTituloI").style.display = "none";
						} else {
							$i("legendaTituloI").style.display = "block";
						}
					};
					titulo =
						"<span class='i3GEOconeFerramenta i3GEOiconeLegenda' title='" + $trad("P3") + "'></span>"
							+ "<div id='legendaTituloI' style='display:block;' >" + $trad("p3") + "</div>";
					janela =
						i3GEO.janela.cria(largura + "px", altura + "px", "", "", "", titulo, "wlegenda", false, "hd", cabecalho, minimiza);
				} else {
					janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
					janela.show();
				}
				$i("wlegenda_corpo").style.backgroundColor = "white";

				i3GEO.eventos.adicionaEventos("NAVEGAMAPA", [
					"i3GEO.mapa.legendaHTML.atualiza()"
				]);
				i3GEO.mapa.legendaHTML.atualiza();
				if (topo && esquerda) {
					janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
					janela.moveTo(esquerda, topo);
				}
			}
		},
		/**
		 * Section: i3GEO.mapa.dialogo
		 *
		 * Abre as telas de dialogo das opcoes de manipulacao do mapa atual
		 */
		dialogo : {
			/**
			 * Function: ferramentas
			 *
			 * Abre a janela de di&aacute;logo com as ferramentas que atuam sobre o mapa
			 */
			ferramentas : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.arvoreDeCamadas.dialogo.ferramentas()",
					"atalhosmapa",
					"atalhosmapa",
					"dependencias.php",
					"i3GEOF.atalhosmapa.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: html2canvas
			 * 
			 * Abre uma janela com a conversão de um objeto HTML em PNG
			 * 
			 * Parametros:
			 * 
			 * {obj} - objeto dom contendo o html a ser convertido
			 */
			html2canvas : function(obj) {
				var temp = function() {
					i3GEOF.html2canvas.iniciaJanelaFlutuante(obj);
				};
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.html2canvas()", "html2canvas", "html2canvas", "dependencias.php", temp);
			},
			/**
			 * Function: wkt2layer
			 *
			 * Janela de conversao de wkt em layer
			 *
			 * Parametros:
			 *
			 * {string} - (opcional) WKT
			 *
			 * {texto} - (opcional) texto a ser incluido na feicao
			 */
			wkt2layer : function(wkt, texto) {
				var temp = function() {
					i3GEOF.wkt2layer.iniciaJanelaFlutuante(wkt, texto);
				};
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.wkt2layer()", "wkt2layer", "wkt2layer", "dependencias.php", temp);
			},
			/**
			 * Function: atalhosedicao
			 *
			 * Janela com as principais opcoes de edicao de um layer. Utilizado pelo sistema de administracao
			 *
			 * Parametro:
			 *
			 * {string} - codigo do tema
			 */
			atalhosedicao : function(idtema) {
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.atalhosedicao()",
					"atalhosedicao",
					"atalhosedicao",
					"dependencias.php",
					"i3GEOF.atalhosedicao.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: geolocal
			 *
			 * Abre a janela de dialogo da ferramenta de geolocalizacao do usuario
			 */
			geolocal : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.geolocal()",
					"geolocal",
					"geolocal",
					"dependencias.php",
					"i3GEOF.geolocal.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: listaDeMapasBanco
			 *
			 * Lista os mapas cadastrados no sistema de administracao do i3geo
			 */
			listaDeMapasBanco : function() {
				if (i3GEO.guias.CONFIGURA["mapas"]) {
					var janela, divid;
					if ($i("i3GEOFsalvaMapaLista")) {
						return;
					}
					janela = i3GEO.janela.cria("200px", "450px", "", "", "", "", "i3GEOFsalvaMapaLista", false, "hd");
					divid = janela[2].id;
					// a funcao que mostra a lista de mapas e a mesma que pode
					// ser utilizada ao incluir a lista de mapas
					// como uma guia
					i3GEO.guias.CONFIGURA["mapas"].click.call(this, divid);
				} else {
					window.open(i3GEO.configura.locaplic + "/admin/rssmapas.php", "_blank");
				}
			},
			/**
			 * Function: congelaMapa
			 *
			 * Congela a vis&atilde;o atual do mapa mostrando-o em uma janela flutuante
			 */
			congelaMapa : function() {
				var url = "", idjanela = YAHOO.util.Dom.generateId(), cabecalho = function() {
				}, titulo, minimiza = function() {
					i3GEO.janela.minimiza(idjanela);
				};
				if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
					url =
						i3GEO.configura.locaplic + "/ferramentas/congelamapa/openlayers.php?g_sid=" + i3GEO.configura.sid + "&ext="
							+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
					titulo =
						"<span class='i3GEOconeFerramenta i3GEOiconeCongela'></span>" + "Mapa"
							+ " <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
							+ "/ajuda_usuario.php?idcategoria=6&idajuda=123' >&nbsp;&nbsp;&nbsp;</a>";
					i3GEO.janela.cria("500px", "350px", url, "", "", titulo, idjanela, false, "hd", cabecalho, minimiza);
				}
			},
			/**
			 * Function: metaestat
			 *
			 * Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT
			 */
			metaestat : function(largura, altura, topo, esquerda) {
				var temp = function() {
					i3GEOF.metaestat.MULTIPARAMETROS = true;
					// i3GEOF.metaestat.inicia(largura, altura, topo, esquerda);
					i3GEOF.metaestat.comum.iniciaDicionario(null, largura, altura, topo, esquerda);
				};
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.metaestat()", "metaestat", "metaestat", "index.js", temp);
			},
			/**
			 * Function: metaestatListaMapas
			 *
			 * Lista os mapas publicados no METAESTAT
			 */
			metaestatListaMapas : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.metaestatListaMapas()",
					"metaestat",
					"listamapas",
					"listamapas.js",
					"i3GEOF.listamapas.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: preferencias
			 *
			 * Preferencias do usuario
			 */
			preferencias : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.preferencias()", "preferencias", "preferencias");
			},
			/**
			 * Function: locregiao
			 *
			 * Abre a janela de dialogo da ferramenta de busca de regiao cadastrada no METAESTAT
			 */
			locregiao : function(largura, altura, topo, esquerda) {
				var temp = function() {
					i3GEOF.locregiao.iniciaDicionario(largura, altura, topo, esquerda);
				};
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.locregiao()", "metaestat", "locregiao", "locregiao.js", temp);
			},
			/**
			 * Function: filtraregiao
			 *
			 * Abre a janela de dialogo da ferramenta de busca de regioes cadastradas no METAESTAT com opcao de filtrar a regiao escolhida
			 */
			filtraregiao : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.filtraregiao()",
					"metaestat",
					"locregiao",
					"locregiao.js",
					"i3GEOF.locregiao.abreComFiltro()");
			},
			/**
			 * Function: animacao
			 *
			 * Abre a janela de dialogo da ferramenta que permite animar o mapa atual
			 */
			animacao : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.animacao()",
					"animacao",
					"animacao",
					"dependencias.php",
					"i3GEOF.animacao.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: opacidade
			 *
			 * Abre a janela de dialogo da ferramenta de definicao da transparencia das camadas principais do mapa
			 */
			opacidade : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opacidade()", "opacidademapa", "opacidademapa");
			},
			/**
			 * Function: telaRemota
			 *
			 * Abre a janela de dialogo da ferramenta de configuracao de uma tela remota
			 */
			telaRemota : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.telaremota()", "telaremota", "telaremota");
			},
			/**
			 * Function: t3d
			 *
			 * Abre a janela de dialogo da ferramenta de geracao da visualizacao em 3d
			 */
			t3d : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.t3d()", "3d", "t3d");
			},
			/**
			 * Function: imprimir
			 *
			 * Abre a janela de dialogo da ferramenta que permite imprimir o mapa atual
			 */
			imprimir : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.imprimir()",
					"imprimir",
					"imprimir",
					"dependencias.php",
					"i3GEOF.imprimir.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: mostraExten
			 *
			 * Abre a janela de dialogo da ferramenta que mostra a extensao geografica atual do mapa
			 */
			mostraExten : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.mostraExten()",
					"mostraexten",
					"mostraExten",
					"dependencias.php",
					"i3GEOF.mostraExten.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: outputformat
			 *
			 * Abre a janela de dialogo da ferramenta outputformat
			 */
			outputformat : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.outputformat()",
					"outputformat",
					"outputformat",
					"dependencias.php",
					"i3GEOF.outputformat.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: autoredesenha
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_autoredesenha
			 */
			autoredesenha : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.autoredesenha()",
					"opcoes_autoredesenha",
					"opcoesTempo",
					"dependencias.php",
					"i3GEOF.opcoesTempo.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: salvaMapa
			 *
			 * Abre a janela de dialogo da ferramenta salvamapa
			 */
			salvaMapa : function() {
				if (i3GEO.parametros === "") {
					i3GEO.janela
						.tempoMsg("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");
					return;
				}
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.salvaMapa()",
					"salvamapa",
					"salvaMapa",
					"dependencias.php",
					"i3GEOF.salvaMapa.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: carregaMapa
			 *
			 * Abre a janela de dialogo da ferramenta carregamapa
			 */
			carregaMapa : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.tema.dialogo.carregaMapa()",
					"carregamapa",
					"carregaMapa",
					"dependencias.php",
					"i3GEOF.carregaMapa.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: convertews
			 *
			 * Abre a janela de dialogo da ferramenta convertews
			 */
			convertews : function() {
				if (i3GEO.parametros.mapfile === "") {
					i3GEO.janela
						.tempoMsg("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");
					return;
				}
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.convertews()",
					"convertews",
					"converteMapaWS",
					"dependencias.php",
					"i3GEOF.converteMapaWS.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: convertekml
			 *
			 * Abre a janela de dialogo da ferramenta convertemapakml
			 */
			convertekml : function() {
				if (i3GEO.parametros.mapfile === "") {
					alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");
					return;
				}
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.convertekml()",
					"convertemapakml",
					"converteMapaKml",
					"dependencias.php",
					"i3GEOF.converteMapaKml.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: queryMap
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_querymap
			 */
			queryMap : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.queryMap()",
					"opcoes_querymap",
					"opcoesQuery",
					"dependencias.php",
					"i3GEOF.opcoesQuery.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: template
			 *
			 * Abre a janela de dialogo da ferramenta template
			 */
			template : function() {
				i3GEO.janela.cria(
					"300px",
					"400px",
					i3GEO.configura.locaplic + "/ferramentas/template/index.htm",
					"",
					"",
					"Template <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
						+ "/ajuda_usuario.php?idcategoria=1&idajuda=8' >&nbsp;&nbsp;&nbsp;</a>");
			},
			/**
			 * Function: tamanho
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_tamanho
			 */
			tamanho : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.tamanho()",
					"opcoes_tamanho",
					"opcoesTamanho",
					"dependencias.php",
					"i3GEOF.opcoesTamanho.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: tipoimagem
			 *
			 * Abre a janela de dialogo da ferramenta tipoimagem
			 */
			tipoimagem : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.tipoimagem()",
					"tipoimagem",
					"tipoimagem",
					"dependencias.php",
					"i3GEOF.tipoimagem.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: corFundo
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_fundo
			 */
			corFundo : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.corFundo()",
					"opcoes_fundo",
					"opcoesFundo",
					"dependencias.php",
					"i3GEOF.opcoesFundo.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: opcoesEscala
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_escala
			 */
			opcoesEscala : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.opcoesEscala()",
					"opcoes_escala",
					"opcoesEscala",
					"dependencias.php",
					"i3GEOF.opcoesEscala.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: opcoesLegenda
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_legenda
			 */
			opcoesLegenda : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.opcoesLegenda()",
					"opcoes_legenda",
					"opcoesLegenda",
					"dependencias.php",
					"i3GEOF.opcoesLegenda.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: gradeCoord
			 *
			 * Abre a janela de dialogo da ferramenta gradecoord
			 */
			gradeCoord : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.gradeCoord()",
					"gradecoord",
					"gradeCoord",
					"dependencias.php",
					"i3GEOF.gradeCoord.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: cliqueTexto
			 *
			 * Abre a janela de dialogo da ferramenta inseretxt
			 */
			cliqueTexto : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.cliqueTexto()",
					"inseretxt",
					"inseretxt",
					"dependencias.php",
					"i3GEOF.inseretxt.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: selecao
			 *
			 * Abre a janela de dialogo da ferramenta selecao
			 */
			selecao : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.selecao()", "selecao", "selecao");
			},
			/**
			 * Function: cliquePonto
			 *
			 * Abre a janela de dialogo da ferramenta inserexy2
			 */
			cliquePonto : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.cliquePonto()",
					"inserexy2",
					"inserexy",
					"dependencias.php",
					"i3GEOF.inserexy.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: cliqueGrafico
			 *
			 * Abre a janela de dialogo da ferramenta inseregrafico
			 */
			cliqueGrafico : function() {
				i3GEO.util.dialogoFerramenta(
					"i3GEO.mapa.dialogo.cliqueGrafico()",
					"inseregrafico",
					"insereGrafico",
					"dependencias.php",
					"i3GEOF.insereGrafico.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: cliqueIdentificaDefault
			 *
			 * Abre a janela de dialogo da ferramenta identifica
			 *
			 * Veja tamb&eacute;m i3GEO.configura.tipotip
			 *
			 * Parametros:
			 *
			 * {numerico} - (opcional) coordenada x
			 *
			 * {numerco} - (opcional) coordenada y
			 *
			 */
			cliqueIdentificaDefault : function(x, y) {
				// FIXIT nada elegante
				// evita clicar sobre a barra do googlemaps
				if (objposicaocursor.imgx < 70) {
					return;
				}
				// evita ativar a ferramenta se o botao nao estiver ativo
				// e estiver no modo de clique permanente
				if (i3GEO.barraDeBotoes.BOTAOCLICADO !== "identifica" && i3GEO.eventos.cliquePerm.ativo === false) {
					return;
				}
				i3GEO.eventos.removeEventos("MOUSEPARADO", [
					"verificaTip()"
				]);
				// na interface googleearth verifica se existe mais eventos no
				// mouseclick
				if (i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1) {
					return;
				}
				// javascript nao foi carregado
				if (typeof (i3GEOF.identifica) === 'undefined') {
					// javascript que sera carregado
					var js = i3GEO.configura.locaplic + "/ferramentas/identifica/dependencias.php", temp = function() {
						if (x) {
							i3GEOF.identifica.criaJanelaFlutuante(x, y);
						} else {
							i3GEOF.identifica.criaJanelaFlutuante(objposicaocursor.ddx, objposicaocursor.ddy);
						}
					};
					// carrega o script
					i3GEO.util.scriptTag(js, temp, "i3GEOF.identifica_script");
				} else {
					if (x) {
						i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo, x, y);
					} else {
						i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo, objposicaocursor.ddx, objposicaocursor.ddy);
					}
					return;
				}
			},
			/**
			 * Mostra etiquetas no mapa com informacoes sobre os temas com etiquetas ativas
			 *
			 * Essa e a funcao padrao definida em i3GEO.configura
			 */
			verificaTipDefault : function(e) {
				// evita clicar sobre a barra do googlemaps
				//FIXME nada elegante
				if (objposicaocursor.imgx < 70) {
					return;
				}
				if (i3GEO.barraDeBotoes.BOTAOCLICADO !== "identificaBalao" && i3GEO.eventos.cliquePerm.ativo === false) {
					return;
				}
				if (i3GEO.eventos.cliquePerm.status === false) {
					return;
				} else {
					i3GEO.eventos.cliquePerm.status = false;
				}
				// na interface googleearth verifica se existe mais eventos no
				// mouseclick
				if (i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1) {
					return;
				}
				var ntemas, etiquetas, j, retorna, x = objposicaocursor.ddx, y = objposicaocursor.ddy;

				ntemas = i3GEO.arvoreDeCamadas.CAMADAS.length;
				etiquetas = false;
				for (j = 0; j < ntemas; j += 1) {
					if (i3GEO.arvoreDeCamadas.CAMADAS[j].etiquetas !== "") {
						etiquetas = true;
					}
				}
				if (etiquetas === false) {
					return;
				}
				if (i3GEO.Interface.ATUAL === "googleearth") {
					i3GEO.Interface.googleearth.aguarde.visibility = "visible";
				}
				retorna =
					function(retorno) {
						var textoCompleto = "",textoSimples = "",textoTempCompleto = "",textoTempSimples = "",classeCor, temp, n, mostra, res, temas, ntemas, titulo, tips, j, ntips, r, ds, nds, s, configura =
							i3GEO.configura, tipotip = configura.tipotip;
						i3GEO.eventos.cliquePerm.status = true;
						mostra = false;
						retorno = retorno.data;
						if (retorno !== "") {
							res = "";
							temas = retorno;
							if (!temas) {
								return;
							}
							ntemas = temas.length;
							for (j = 0; j < ntemas; j += 1) {
								titulo = temas[j].nome;
								if (tipotip != "simples") {
									titulo = "<span class='toolTipBalaoTitulo'><b>" + titulo + "</b></span><br>";
								} else {
									titulo = "";
								}
								tips = temas[j].resultado.todosItens;
								ntips = tips.length;
								ins = "";
								textoTempCompleto = "";
								textoTempSimples = "";
								ds = temas[j].resultado.dados;
								if (ds !== " " && ds[0] && ds[0] != " ") {
									try {
										nds = ds.length;
										classeCor = "toolTipBalaoTexto";
										for (s = 0; s < nds; s += 1) {
											textoTempCompleto += "<div class='" + classeCor + "'>";
											textoTempSimples += "<div class='" + classeCor + "'>";
											for (r = 0; r < ntips; r += 1) {
												try {
													temp = "";
													var alias = ds[s][tips[r]].alias;
													var valor = ds[s][tips[r]].valor;
													var link = ds[s][tips[r]].link;
													var img = ds[s][tips[r]].img;
													if (valor !== "" && link === "") {
														temp += "<span>" + alias + " :" + valor + "</span><br>";
													}
													if (valor !== "" && link !== "") {
														temp +=
															"<span>" + alias
																+ " : <a style='color:blue;cursor:pointer' target=_blanck href='"
																+ link + "' >" + valor + "</a></span><br>";
													}
													if (img !== "") {
														temp += img + "<br>";
													}
													if (tipotip === "balao" && ds[s][tips[r]].tip.toLowerCase() === "sim"){
														textoTempSimples += temp;
													}
													textoTempCompleto += temp;
													mostra = true;
												} catch (e) {
												}
											}
											if (classeCor === "toolTipBalaoTexto") {
												classeCor = "toolTipBalaoTexto1";
											} else {
												classeCor = "toolTipBalaoTexto";
											}
											textoTempCompleto += "</div>";
											textoTempSimples += "</div>";
										}

									} catch (e) {
									}
								}
								if (textoTempSimples !== "") {
									textoCompleto += titulo + textoTempCompleto;
									textoSimples += titulo + textoTempSimples;
								}
							}
							if (mostra === true) {
								if (tipotip != "simples") {
									res = textoSimples;
								}
								else{
									res = textoCompleto;
								}
								if (tipotip === "balao") {
									i3GEO.Interface[i3GEO.Interface.ATUAL].balao(textoSimples,textoCompleto, x, y);
								} else {
									// tipotip pode ser um elemento DOM
									n = $i(tipotip);
									if (!n) {
										n = i3GEO.janela.tip();
										n = $i(n);
										n.style.textAlign = "left";
										n.innerHTML += res;
									} else {
										n.innerHTML = res;
									}
								}
							}
						}
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							temp = "identifica";
							i3GEO.util.mudaCursor(configura.cursores, temp, i3GEO.Interface.IDMAPA, configura.locaplic);
						}
					};
				// alert("identifica "+objposicaocursor.ddx+" "+objposicaocursor.ddy)
				i3GEO.php.identifica3(
					retorna,
					x,
					y,
					i3GEO.mapa.RESOLUCAOTIP,
					"tip",
					i3GEO.configura.locaplic,
					i3GEO.configura.sid,
					"ligados",
					i3GEO.parametros.mapexten);
			}
		}
	};