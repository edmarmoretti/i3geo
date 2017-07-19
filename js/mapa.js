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
i3GEO.mapa =
{
		//permite ou nao que o balao de info funcione ao clicar no mapa
		BALAOATIVO: true,
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
		 * Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
		 *
		 * Tipo {Array}
		 */
		GEOXML : [],
		/**
		 * Function: limpasel
		 *
		 * Limpa a selecao de todos os temas do mapa
		 *
		 */
		limpasel : function() {
			i3GEO.php.limpasel(
					function(retorno) {
						i3GEO.atualiza();
						i3GEO.Interface.atualizaMapa();
					},
					""
			);
		},
		/**
		 * Ativa o redimensionamento automatico do mapa sempre que o navegador for redimensionado
		 *
		 * e definido como um evento do elemento window
		 */
		ativaAutoResize : function() {
			var ativo = true;
			window.onresize = function() {
				var Dw, Dh;
				Dw = window.innerWidth;
				Dh = window.innerHeight;
				i3GEO.tamanhodoc = [
				                    Dw, Dh
				                    ];
				if (ativo === true) {
					setTimeout(function() {
						i3GEO.reCalculaTamanho();
						i3GEO.guias.abreFecha("fecha");
						ativo = true;
					}, 2000);
				}
				ativo = false;
			};
		},
		ativaIdentifica: function(){
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.mapa.ativaIdentifica()");

			i3GEO.eventos.MOUSECLIQUE = ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"];
			i3GEO.eventos.adicionaEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
			i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.verificaTipDefault()"]);
			i3GEO.eventos.cliquePerm.ativa();
		},
		ativaIdentificaBalao: function(){
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.mapa.ativaIdentificaBalao()");

			if (i3GEO.arvoreDeCamadas.filtraCamadas("etiquetas", "", "diferente", i3GEO.arvoreDeCamadas.CAMADAS) === "") {
				i3GEO.janela.tempoMsg($trad("d31"));
				return;
			}
			i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
			i3GEO.eventos.MOUSECLIQUE = ["i3GEO.mapa.dialogo.verificaTipDefault()"];
			i3GEO.eventos.cliquePerm.ativa();
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
				i3GEO.temaAtivo = codigo;
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
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.mapa.inicia()");

				i3GEO.janela.fechaAguarde();
				if (this.recupera && this.recupera.TENTATIVA === 0) {
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
			g = JSON.stringify(geometrias);
			return i3GEO.util.base64encode(g);
		},
		/**
		 * Function: desCompactaLayerGrafico
		 *
		 * Descompacta um layer grafico criado com compactaLayerGrafico
		 */
		desCompactaLayerGrafico : function(geometrias) {
			geometrias = JSON.parse(geometrias);
			// carrega o script do editor vetorial
			if (geometrias.length > 0) {
				var inicia = function() {
					if(!i3GEO.desenho.layergrafico){
						i3GEO.editorOL.criaLayerGrafico();
					}
					i3GEO.editor[i3GEO.Interface.ATUAL].ativaPainel();
					var n = geometrias.length, i;
					for (i = 0; i < n; i++) {
						i3GEO.editorOL.adicionaFeatureWkt(geometrias[i].geometria, geometrias[i].atributos);
					}
					i3GEO.editorOL.sobeLayersGraficos();
				};
				if (!i3GEO.editorOL) {
					i3GEO.util.scriptTag(
							i3GEO.configura.locaplic + "/classesjs/compactados/classe_editorol_compacto.js",
							inicia,
							"editorol.js",
							true);
				}
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
			if (cookies) {
				props = cookies.split("::");
				nprops = props.length;
				// nao tente remover eval com window[], nao funciona com namespace
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
						} else if ($.isNumeric(pint)) {
							eval(temp[0] + " = " + temp[1] + ";");
						} else {
							eval(temp[0] + " = '" + temp[1] + "';");
						}
					} catch (e) {
					}
				}
			}
		},
		/**
		 * Section: i3GEO.mapa.dialogo
		 *
		 * Abre as telas de dialogo das opcoes de manipulacao do mapa atual
		 */
		dialogo : {
			listaLayersWms : function(servico) {
				i3GEO.janela.cria(
						"400px",
						"300px",
						i3GEO.configura.locaplic + "/ferramentas/conectarwms/listalayers.php?servico=" + servico,
						"",
						"",
						"<div class='i3GeoTituloJanela'>" + $trad("a4")
						+ "<a class=ajuda_usuario target=_blank href='"
						+ i3GEO.configura.locaplic
						+ "/ajuda_usuario.php?idcategoria=4&idajuda=28' ><b> </b></a></div>",
						"i3GEO.conectarwms",
						false,
						"hd",
						"",
						"",
						"",
						true);
			},
			/**
			 * Function: mascara
			 *
			 * Abre a janela de di&aacute;logo com as ferramenta mascara
			 */
			mascara : function() {
				i3GEO.util.dialogoFerramenta(
						"i3GEO.mapa.dialogo.mascara()",
						"mascara",
						"mascara",
						"dependencias.php",
				"i3GEOF.mascara.iniciaJanelaFlutuante()");
			},
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
			listaDeMapasBanco : function(idonde) {
				if(idonde){
					i3GEO.guias.CONFIGURA["mapas"].click.call(this, idonde);
					return;
				}
				if (i3GEO.guias.CONFIGURA["mapas"]) {
					var janela, divid;
					if ($i("i3GEOFsalvaMapaLista")) {
						return;
					}
					janela = i3GEO.janela.cria("600px", "350px", "", "", "", "", "i3GEOFsalvaMapaLista", false, "hd");
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
				var url = "", idjanela = i3GEO.util.generateId(), cabecalho = function() {
				}, titulo, minimiza = function() {
					i3GEO.janela.minimiza(idjanela);
				};
				if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
					url =
						i3GEO.configura.locaplic + "/ferramentas/congelamapa/openlayers3.php?g_sid="
						+ i3GEO.configura.sid
						+ "&ext="
						+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
					titulo = "</div><a class='i3GeoTituloJanelaBs' target=_blank href='"
						+ i3GEO.configura.locaplic
						+ "/ajuda_usuario.php?idcategoria=6&idajuda=123' >Mapa</a>";
					i3GEO.janela.cria("500px", "350px", url, "", "", titulo, idjanela, false, "hd", cabecalho, minimiza, "", "", "", "", false);
				}
			},
			/**
			 * Function: metaestat
			 *
			 * Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT
			 */
			metaestat : function(largura, altura, topo, esquerda, Interface, conexao) {
				var temp = function() {
					i3GEOF.metaestat.MULTIPARAMETROS = true;
					if(Interface){
						i3GEOF.metaestat.INTERFACE = Interface;
					}
					if(conexao){
						i3GEOF.metaestat.CONEXAODEFAULT = conexao;
					}
					i3GEOF.metaestat.principal.inicia(null, largura, altura, topo, esquerda);
				};
				i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.metaestat()", "metaestat", "metaestat", "dependencias.php", temp);
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
						"<div class='i3GeoTituloJanela'>Template<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
						+ "/ajuda_usuario.php?idcategoria=1&idajuda=8' ><b> </b></a></div>");
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
			 *
			 * Parametros:
			 *
			 * {numerico} - (opcional) coordenada x
			 *
			 * {numerco} - (opcional) coordenada y
			 *
			 */
			cliqueIdentificaDefault : function(x, y) {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.mapa.cliqueIdentificaDefault()");

				// evita ativar a ferramenta se o botao nao estiver ativo
				// e estiver no modo de clique permanente
				if (i3GEO.eventos.cliquePerm.ativo === false) {
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
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.mapa.dialogo.verificaTipDefault()");

				if(i3GEO.mapa.BALAOATIVO == false){
					if (typeof (console) !== 'undefined')
						console.info("balao desativado");

					return;
				}
				if(i3GEO.eventos.cliquePerm.ativo == false){
					return;
				}

				if (i3GEO.eventos.cliquePerm.status === false) {
					return;
				} else {
					i3GEO.eventos.cliquePerm.status = false;
				}

				var ntemas, etiquetas, j, x = objposicaocursor.ddx, y = objposicaocursor.ddy;
				if(x === -1 || y === -1){
					return;
				}
				//para evitar duplo clique
				objposicaocursor.ddx = -1;
				objposicaocursor.ddy = -1;
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
				if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url != "" && i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal == ""){
					$.get( i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url + "&xx=" + x + "&yy=" + y, function( data ) {
						i3GEO.janela.closeMsg(data);
					});
					return;
				}
				if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal != ""){
					if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url != ""){
						var temp = i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url + "&xx=" + x + "&yy=" + y;
						temp = i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal.replace("{{{url}}}",temp);
						i3GEO.janela.closeMsg(temp);
					} else {
						i3GEO.janela.closeMsg(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal);
					}
					return;
				}
				i3GEO.php.identifica3(
						i3GEO.mapa.montaTip,
						x,
						y,
						i3GEO.configura.ferramentas.identifica.resolution,
						"tip",
						i3GEO.configura.locaplic,
						i3GEO.configura.sid,
						"ligados",
						i3GEO.parametros.mapexten,
						"",
				"nao");
			}
		},
		montaTip: function (retorno){
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.mapa.montaTip()");

			var textoCompleto = "", textoSimples = "", textoTempCompleto = "", textoTempSimples = "", x, y, classeCor, temp, n, mostra, res, temas, ntemas, titulo, tips, j, ntips, r, ds, nds, s, configura =
				i3GEO.configura, wkts = [];

			i3GEO.eventos.cliquePerm.status = true;
			mostra = false;
			if(retorno == ""){
				i3GEO.janela.tempoMsg($trad("tipvazio"));
				return;
			}
			retorno = retorno.data;
			temp = retorno[0].xy.split(",");
			x = temp[0]*1;
			y = temp[1]*1;
			if (retorno !== "") {
				res = "";
				temas = retorno;
				if (!temas) {
					return;
				}
				ntemas = temas.length;
				for (j = 0; j < ntemas; j += 1) {
					titulo = temas[j].nome;
					titulo = "<div class='toolTipBalaoTitulo'><b>" + titulo + "</b></div>";
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
												+ link
												+ "' >"
												+ valor
												+ "</a></span><br>";
										}
										if (img !== "") {
											temp += img + "<br>";
										}
										if (ds[s][tips[r]].tip.toLowerCase() === "sim") {
											textoTempSimples += temp;
										}
										textoTempCompleto += temp;
										mostra = true;
									} catch (e) {}
								}
								if (classeCor === "toolTipBalaoTexto") {
									classeCor = "toolTipBalaoTexto1";
								} else {
									classeCor = "toolTipBalaoTexto";
								}
								textoTempCompleto += "</div>";
								textoTempSimples += "</div>";
								//insere o wkt se existir
								if(ds[s].wkt && ds[s].wkt.valor != ""){
									wkts.push(ds[s].wkt.valor);
								}
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
					res = textoSimples;
					if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.modal == true){
						if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.simple == true){
							i3GEO.janela.closeMsg(textoSimples);
							return;
						} else {
							i3GEO.janela.closeMsg(textoCompleto);
							return;
						}
					} else {
						if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.simple == true){
							i3GEO.Interface[i3GEO.Interface.ATUAL].balao(textoSimples, textoCompleto, x, y);
						} else {
							i3GEO.Interface[i3GEO.Interface.ATUAL].balao(textoCompleto, textoSimples, x, y);
						}
					}
				}
			}
			if (typeof (console) !== 'undefined')
				console.info("adicionando WKT");

			n = wkts.length;
			if(n > 0){
				i3GEO.desenho[i3GEO.Interface.ATUAL].criaLayerGrafico();
				var g, format, f, idunico,c = i3GEO.desenho.layergrafico.getSource();
				if(i3GEO.Interface.ATUAL == "openlayers"){
					format = new ol.format.WKT();
					for(r = 0; r < n; r += 1){
						f = format.readFeatures(wkts[r]);
						f = f[0];
						f.setProperties({
							origem : "pin"
						});
						g = f.getGeometry();
						g = i3GEO.util.projGeo2OSM(g);
						f.setGeometry(g);
						c.addFeature(f);
					}
				}
			}

		}
};