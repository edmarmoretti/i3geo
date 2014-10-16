/**
 * Title: Mapa
 *
 * i3GEO.mapa
 *
 * Executa opera&ccedil;&otilde;es obre o mapa principal
 *
 * Em i3GEO.mapa.dialogo estao as funcoes de abertura dos dialogos para
 * alteracao das propriedades do mapa, como cor de fundo, tipo de imagem,
 * legenda etc.
 *
 *
 * Arquivo:
 *
 * i3geo/classesjs/classe_mapa.js
 *
 * Licen&ccedil;a:
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
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
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
		 * Tipo {string}
		 *
		 * Default {}
		 */
		TEMASINICIAISLIGADOS : "",
		/**
		 * Propriedade: TEMASINICIAISLIGADOS
		 *
		 * Lista indicando quais temas serao ligados na inicializacao
		 *
		 * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
		 *
		 * Os temas sao aqueles que aparecem em i3geo/temas
		 *
		 * Tipo {string}
		 *
		 * Default {}
		 */
		TEMASINICIAIS : "",
		/**
		 * Propriedade: AUTORESIZE
		 *
		 * Indica se o tamanho do mapa sera ajustado toda vez que o navegador for redimensionado
		 *
		 * Tipo {boolean}
		 *
		 * Default {false}
		 */
		AUTORESIZE : false,
		/**
		 * Propriedade: RESOLUCAOTIP
		 *
		 * Resolu&ccedil;&atilde;o de busca utilizada no bal&atilde;o de identifica&ccedil;&atilde;o
		 *
		 * Tipo {numeric}
		 *
		 * Default {12}
		 */
		RESOLUCAOTIP : 12,
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
		 * tipo {string} - tipo de icone googlemaps|openlayers
		 *
		 * imagem {string} - endereco da imagem que sera utilizada no icone
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
					//return;
				}
				i3GEO.tamanhodoc = [
					Dw,
					Dh
				];
				if(ativo === true){
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
						$left(i3GEO.Interface.IDCORPO, imagemxi - 1);
					} else {
						$left(i3GEO.Interface.IDCORPO, imagemxi);
					}
					$top(i3GEO.Interface.IDCORPO, imagemyi);
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
		 * codigo {string} - codigo da camada
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
		 * retorno {string} - objeto recebido da funcao PHP de atualizacao do mapa
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
		 * Classe: i3GEO.mapa.legendaHTML
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
			 * Tipo {boolean}
			 *
			 * Default {true}
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
			 * id {String} - id do elemento que recebera a legenda
			 */
			cria : function(id) {
				if (arguments.length === 0) {
					id = "";
				}
				i3GEO.mapa.legendaHTML.ID = id;
				if (i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()") < 0) {
					i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()");
				}
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
						var legenda = "", ins, re, desativar, tema = "", classe = "";
						re = new RegExp();
						if (retorno.data !== "erro" && retorno.data !== undefined) {
							//troca os ids pois podem ja existir na arvore de camadas
							re = new RegExp("legendack_", "g");
							retorno.data.legenda = retorno.data.legenda.replace(re, "liblegendack_");
							legenda =
								"<div class=legendaMostraTodosTemas onclick='i3GEO.mapa.legendaHTML.mostraTodosOsTemas()' style=cursor:pointer;font-size:10px;text-align:left; >Mostra tudo</div><br>"
									+ retorno.data.legenda;
						}
						if (legenda != "" && idleg) {
							ins = "";
							if (i3GEO.mapa.legendaHTML.incluiBotaoLibera === true) {
								ins +=
									'<div style="cursor: pointer; text-align: left; font-size: 10px; display: block; height: 35px;" onclick="i3GEO.mapa.legendaHTML.libera()"><img id="soltaLeg" src="../imagens/branco.gif" title="clique para liberar" style="margin: 5px; position: relative;"> <p style="position: relative; left: -35px; top: -22px;">'
										+ $trad("x11") + '</p></div>';
							}
							re = new RegExp("<img src='' />", "g");
							legenda = legenda.replace(re, "");
							ins += "<div id='corpoLegi' >" + legenda + "</div>";

							idleg.innerHTML = "<div style='padding:5px;' >"+ins+"</div>";
						}
						i3GEO.mapa.legendaHTML.escondeTemasMarcados();
						//desmarca as classes desligadas
						desativar = retorno.data.desativar;
						for(tema in desativar){
							for(classe in desativar[tema]){
								ins = $i("liblegendack_"+tema+"_"+desativar[tema][classe]);
								if(ins){
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
					idleg = $i("wlegenda_corpo");
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
			 * ck - sim|nao - (opcional) inclui ou nao o checkbox que permitem desligar a camada
			 */
			libera : function(ck, largura, altura, topo, esquerda) {
				if (!ck) {
					ck = "nao";
				}
				if (!largura) {
					largura = 302;
				}
				if (!altura) {
					altura = 300;
				}
				var cabecalho, minimiza, janela;
				if (!$i("wlegenda")) {
					cabecalho = function() {
					};
					minimiza = function() {
						i3GEO.janela.minimiza("wlegenda");
					};
					janela =
						i3GEO.janela.cria(
							largura + "px",
							altura + "px",
							"",
							"",
							"",
							$trad("p3"),
							"wlegenda",
							false,
							"hd",
							cabecalho,
							minimiza);
				} else {
					janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
					janela.show();
				}
				$i("wlegenda_corpo").style.backgroundColor = "white";

				if (i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()") < 0) {
					i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()");
				}
				i3GEO.mapa.legendaHTML.atualiza();
				if (topo && esquerda) {
					janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
					janela.moveTo(esquerda, topo);
				}
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
		 * Classe: i3GEO.mapa.dialogo
		 *
		 * Abre as telas de dialogo das opcoes de manipulacao do mapa atual
		 */
		dialogo : {
			atalhosedicao: function(idtema){
				i3GEO.mapa.ativaTema(idtema);
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.atalhosedicao()","atalhosedicao","atalhosedicao","dependencias.php","i3GEOF.atalhosedicao.iniciaJanelaFlutuante()");
			},
			/**
			 * Function: geolocal
			 *
			 * Abre a janela de dialogo da ferramenta de geolocalizacao do usuario
			 */
			geolocal : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.geolocal()", "geolocal", "geolocal");
			},
			/**
			 * Function: listaDeMapasBanco
			 *
			 * Lista os mapas cadastrados no sistema de administracao do i3geo
			 */
			listaDeMapasBanco : function() {
				if (i3GEO.guias.CONFIGURA["mapas"]) {
					var janela, divid;
					janela = i3GEO.janela.cria("200px", "450px", "", "", "", "", "i3GEOFsalvaMapaLista", false, "hd");
					divid = janela[2].id;
					// a funcao que mostra a lista de mapas e a mesma que pode ser utilizada ao incluir a lista de mapas
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
					titulo = "Mapa"+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=6&idajuda=123' >&nbsp;&nbsp;&nbsp;</a>";
					i3GEO.janela.cria("500px", "350px", url, "", "", titulo, idjanela, false, "hd", cabecalho, minimiza);
				}
			},
			/**
			 * Function: metaestat
			 *
			 * Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT
			 */
			metaestat : function() {
				var temp = function() {
					i3GEOF.metaestat.MULTIPARAMETROS = true;
					i3GEOF.metaestat.inicia();
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
			locregiao : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.locregiao()", "metaestat", "locregiao", "locregiao.js");
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
				i3GEO.util.dialogoFerramenta("i3GEO.tema.dialogo.animacao()","animacao","animacao","dependencias.php","i3GEOF.animacao.iniciaJanelaFlutuante()");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.imprimir()", "imprimir", "imprimir");
			},
			/**
			 * Function: mostraExten
			 *
			 * Abre a janela de dialogo da ferramenta que mostra a extensao geografica atual do mapa
			 */
			mostraExten : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.mostraExten()", "mostraexten", "mostraExten");
			},
			/**
			 * Function: outputformat
			 *
			 * Abre a janela de dialogo da ferramenta outputformat
			 */
			outputformat : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.outputformat()", "outputformat", "outputformat");
			},
			/**
			 * Function: autoredesenha
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_autoredesenha
			 */
			autoredesenha : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.autoredesenha()", "opcoes_autoredesenha", "opcoesTempo");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.salvaMapa()", "salvamapa", "salvaMapa");
			},
			/**
			 * Function: carregaMapa
			 *
			 * Abre a janela de dialogo da ferramenta carregamapa
			 */
			carregaMapa : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.carregaMapa()", "carregamapa", "carregaMapa");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.convertews()", "convertews", "converteMapaWS");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.convertekml()", "convertemapakml", "converteMapaKml");
			},
			/**
			 * Function: queryMap
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_querymap
			 */
			queryMap : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.queryMap()", "opcoes_querymap", "opcoesQuery");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.tamanho()", "opcoes_tamanho", "opcoesTamanho");
			},
			/**
			 * Function: tipoimagem
			 *
			 * Abre a janela de dialogo da ferramenta tipoimagem
			 */
			tipoimagem : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.tipoimagem()", "tipoimagem", "tipoimagem");
			},
			/**
			 * Function: corFundo
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_fundo
			 */
			corFundo : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.corFundo()", "opcoes_fundo", "opcoesFundo");
			},
			/**
			 * Function: opcoesEscala
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_escala
			 */
			opcoesEscala : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opcoesEscala()", "opcoes_escala", "opcoesEscala");
			},
			/**
			 * Function: opcoesLegenda
			 *
			 * Abre a janela de dialogo da ferramenta opcoes_legenda
			 */
			opcoesLegenda : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opcoesLegenda()", "opcoes_legenda", "opcoesLegenda");
			},
			/**
			 * Function: gradeCoord
			 *
			 * Abre a janela de dialogo da ferramenta gradecoord
			 */
			gradeCoord : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.gradeCoord()", "gradecoord", "gradeCoord");
			},
			/**
			 * Function: cliqueTexto
			 *
			 * Abre a janela de dialogo da ferramenta inseretxt
			 */
			cliqueTexto : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliqueTexto()", "inseretxt", "inseretxt");
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
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliquePonto()", "inserexy2", "inserexy");
			},
			/**
			 * Function: cliqueGrafico
			 *
			 * Abre a janela de dialogo da ferramenta inseregrafico
			 */
			cliqueGrafico : function() {
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliqueGrafico()", "inseregrafico", "insereGrafico");
			},
			/**
			 * Function: cliqueIdentificaDefault
			 *
			 * Abre a janela de dialogo da ferramenta identifica
			 *
			 * Parameters:
			 *
			 * x,y - opcional
			 *
			 */
			cliqueIdentificaDefault : function(x, y) {
				// @FIXIT nada elegante
				// evita clicar sobre a barra do googlemaps
				if (objposicaocursor.imgx < 70) {
					return;
				}
				// evita ativar a ferramenta se o botao nao estiver ativo
				// e estiver no modo de clique permanente
				if (i3GEO.barraDeBotoes.BOTAOCLICADO !== "identifica" && i3GEO.eventos.cliquePerm.ativo === false) {
					return;
				}
				i3GEO.eventos.MOUSEPARADO.remove("verificaTip()");
				// na interface googleearth verifica se existe mais eventos no mouseclick
				if (i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1) {
					return;
				}
				// javascript nao foi carregado
				if (typeof (i3GEOF.identifica) === 'undefined') {
					// javascript que sera carregado
					var js = i3GEO.configura.locaplic + "/ferramentas/identifica/index.js", temp = function() {
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
				// @FIXIT nada elegante
				// console.warn(objposicaocursor.imgx)
				if (objposicaocursor.imgx < 70) {
					return;
				}
				if (i3GEO.barraDeBotoes.BOTAOCLICADO !== "identificaBalao" && i3GEO.eventos.cliquePerm.ativo === false) {
					return;
				}
				// na interface googleearth verifica se existe mais eventos no mouseclick
				if (i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1) {
					return;
				}
				var ntemas, etiquetas, j, retorna, targ = "";

				if (!e) {
					e = window.event;
				}
				try {
					if (e.target) {
						targ = e.target;
					} else {
						if (e.srcElement) {
							targ = e.srcElement;
						}
					}
					if (targ.parentNode) {
						container = targ.parentNode.id;
						// alert(container);
					}

				} catch (erro) {
					targ = null;
				}

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
						var classeCor, pos, temp, n, i, mostra, res, temas, ntemas, titulo, tips, j, ntips, ins, r, ds, nds, s, balloon, configura =
							i3GEO.configura, tipotip = configura.tipotip;
						i = $i("i3geo_rosa");
						if (i) {
							i.style.display = "none";
						}
						mostra = false;
						// try{
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
								if (tipotip === "completo" || tipotip === "balao") {
									titulo = "<span class='toolTipBalaoTitulo'><b>" + titulo + "</b></span><br>";
								} else {
									titulo = "";
								}
								tips = (temas[j].resultado.tips).split(",");
								ntips = tips.length;
								ins = "";
								ds = temas[j].resultado.dados;
								if (ds !== " " && ds[0] && ds[0] != " ") {
									try {
										nds = ds.length;
										classeCor = "toolTipBalaoTexto";
										for (s = 0; s < nds; s += 1) {
											ins += "<div class='" + classeCor + "'>";
											for (r = 0; r < ntips; r += 1) {
												try {
													eval("var alias = ds[s]." + tips[r] + ".alias");
													eval("var valor = ds[s]." + tips[r] + ".valor");
													eval("var link = ds[s]." + tips[r] + ".link");
													eval("var img = ds[s]." + tips[r] + ".img");
													if (tipotip === "completo" || tipotip === "balao") {
														if (valor !== "" && link === "") {
															ins += "<span>" + alias + " :" + valor + "</span><br>";
														}
														if (valor !== "" && link !== "") {
															ins +=
																"<span>" + alias
																	+ " : <a style='color:blue;cursor:pointer' target=_blanck href='"
																	+ link + "' >" + valor + "</a></span><br>";
														}
														if (img !== "") {
															ins += img + "<br>";
														}
														mostra = true;
													} else {
														ins += "<span>" + valor + "</span><br>";
														mostra = true;
													}
												} catch (e) {
												}
											}
											if (classeCor === "toolTipBalaoTexto") {
												classeCor = "toolTipBalaoTexto1";
											} else {
												classeCor = "toolTipBalaoTexto";
											}
											ins += "</div>";
										}

									} catch (e) {
									}
								}
								if (ins !== "") {
									res += titulo + ins;
								}
							}
							if (!mostra) {
								if ($i("tip")) {
									$i("tip").style.display = "none";
								}
							} else {
								if (tipotip !== "balao") {
									n = i3GEO.janela.tip();
									$i(n).style.textAlign = "left";
									$i(n).innerHTML += res;
								} else {
									if (i3GEO.Interface.ATUAL === "googleearth") {
										i3GEO.Interface.googleearth.balao(res, objposicaocursor.ddx, objposicaocursor.ddy);
										i3GEO.Interface.googleearth.aguarde.visibility = "hidden";
									} else {
										hideAllTooltips();
										if(balloonIsVisible && balloonIsVisible === true){
											return;
										}
										temp = i3GEO.util.criaPin('marcaIdentifica', configura.locaplic + "/imagens/grabber.gif", "12px", "12px");
										i3GEO.janela.TIPS.remove("marcaIdentifica");
										i3GEO.janela.TIPS.push('marcaIdentifica');

										pos = i3GEO.util.posicionaImagemNoMapa("marcaIdentifica");
										balloon = new Balloon();
										BalloonConfig(balloon, 'GBox');
										balloon.delayTime = 0;
										res =
											"<div style=text-align:left;overflow:auto;height:" + configura.alturatip + ";width:"
												+ configura.larguratip + "; >" + res + "</div>";

										if (temp[1]) {
											balloon.showTooltip(temp[1], res, null, null, null, pos[1], pos[0]);
											balloon.addCloseButton();
											temp[1].onclick = function(e) {
												if (!e) {
													e = window.event;
												}
												document.body.removeChild(balloon.getEventTarget(e));
												balloon.hideTooltip();
											};

										}
									}
								}
							}
						}
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							temp = "identifica";
							if (i3GEO.Interface.ATIVAMENUCONTEXTO) {
								temp = "identifica_contexto";
							}
							i3GEO.util.mudaCursor(configura.cursores, temp, i3GEO.Interface.IDMAPA, configura.locaplic);
						}
					};
				xy = i3GEO.navega.centroDoMapa();
				i3GEO.php.identifica3(
					retorna,
					objposicaocursor.ddx,
					objposicaocursor.ddy,
					i3GEO.mapa.RESOLUCAOTIP,
					"tip",
					i3GEO.configura.locaplic,
					i3GEO.configura.sid,
					"ligados",
					i3GEO.parametros.mapexten);
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
		//
		// aplica as preferencias armazenadas localmente ou vindas de um mapa salvo no banco de dados
		//
		aplicaPreferencias : function(cookies) {
			// aplica preferencias do usuario
			var props, nprops, i, temp = [], pint;
			if (!cookies) {
				cookies = i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo");
			}
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
		}
	};
// YAHOO.log("carregou classe mapa", "Classes i3geo");
