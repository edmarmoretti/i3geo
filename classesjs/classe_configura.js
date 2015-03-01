/**
 * Title: Configura&ccedil;&otilde;es gerais
 *
 * Configura&ccedil;&atilde;o do i3geo
 *
 * Vc pode alterar com esta classe a maioria dos par&acirc;metros que controlam o funcionamento do i3geo.
 *
 * Namespace:
 *
 * i3GEO.configura
 *
 * Exemplo:
 *
 * i3GEO.configura.embedLegenda = "nao"
 *
 * i3GEO.configura.cursores.ff = "/imagens/cursores/identifica2.png"
 *
 * i3GEO.configura.cursores.ie = "/imagens/cursores/identifica2.cur"
 *
 * alert(i3GEO.configura.locaplic)
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_configura.js>
 *
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.configura =
	{
		/**
		 * Propriedade: guardaExtensao
		 *
		 * Indica se a extensao geografica do mapa sera armazenada como um cookie
		 *
		 * Se for true a extensao geografica e armazenada sempre que o evento de navegacoa no mapa for disparado
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * {true}
		 */
		guardaExtensao : true,
		/**
		 * Propriedade: grupoLayers
		 *
		 * Lista de grupos e seus respectivos layers, para montagem da &aacute;rvore de camadas.
		 *
		 * Se essa propriedade estiver definida, as camadas ser&atilde;o agrupadas na &aacute;rvore de camadas conforme os grupos definidos.
		 *
		 * Layers que n&atilde;o constarem nessa propriedade ser&atilde;o inclu&iacute;dos no grupo "outros"
		 *
		 * Ao definir grupos, a &aacute;rvore n&atilde;o conter&aacute; as op&ccedil;&otilde;es de mudan&ccedil;a da prdem de desenho das
		 * camadas ( veja http://localhost/i3geo/exemplos/legenda2.htm )
		 *
		 * Por exemplo i3GEO.configura.grupoLayers = [ {nome:"Grupo 1",icone:true,dinamico:true,expandido:true,layers:["zee","estadosl"]},
		 * {nome:"Grupo 2",icone:false,dinamico:true,expandido:false,layers:["mundo"]} ];
		 *
		 * Onde "icone" indica se o &iacute;cone de ligar/desligar todos os temas do grupo ser&aacute; mostrado, "dinamico" significa que o
		 * n&oacute; pode ser expandido ou n&atilde;o, e "expandido" significa que o n&oacute; inicia aberto se a &aacute;rvore for
		 * din&acirc;mica
		 *
		 * Type:
		 *
		 * {Objeto}
		 *
		 * Default:
		 *
		 * ""
		 */
		grupoLayers : "",
		/**
		 * Propriedade: oMenuData
		 *
		 * Itens inclu&iacute;dos no menu suspenso. Define os par&acirc;metros para o gadget menu suspenso
		 *
		 * Mais informa&ccedil;&otilde;es em <classe_gadgets.js> fun&ccedil;&atilde;o <mostraMenuSuspenso>
		 *
		 * Tipo:
		 *
		 * {object}
		 */
		oMenuData : {
			menu : [
				{
					nome : $trad("s1"),
					id : "ajudaMenu"
				},
				{
					nome : $trad("s2"),
					id : "analise"
				},
				{
					nome : $trad("s3"),
					id : "janelas"
				},
				{
					nome : $trad("s4"),
					id : "arquivos"
				},
				{
					nome : $trad("d32"),
					id : "interface"
				},
				{
					nome : $trad("u15a"),
					id : "ferramentas"
				}
			],
			submenus : {
				"ajudaMenu" : [
					{
						id : "omenudataAjudamenu9",
						text : $trad("x68"),
						url : "javascript:i3GEO.janela.tempoMsg(i3GEO.parametros.mensageminicia)"
					},
					{
						id : "omenudataAjudamenu2",
						text : $trad("u2"),
						url : "javascript:i3GEO.ajuda.abreDoc()"
					},
					{
						id : "omenudataAjudamenu3",
						text : $trad("u4a"),
						url : "javascript:i3GEO.ajuda.abreDoc('/documentacao/manual-i3geo-6_0-pt.pdf')"
					},
					{
						id : "omenudataAjudamenu4",
						text : $trad("u4"),
						url : "http://www.softwarepublico.gov.br/dotlrn/clubs/i3geo/file-storage/index?folder%5fid=22667525",
						target : "_blank"
					},
					{
						id : "omenudataAjudamenu5",
						text : $trad("u5a"),
						url : "http://www.softwarepublico.gov.br",
						target : "_blank"
					},
					{
						id : "omenudataAjudamenu1",
						text : $trad("x67"),
						url : "http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332",
						target : "_blank"
					},
					{
						id : "omenudataAjudamenu7",
						text : $trad("u5b"),
						url : "javascript:i3GEO.ajuda.abreDoc('/ajuda_usuario.php')"
					},
					{
						id : "omenudataAjudamenu8",
						text : $trad("u5c"),
						url : "javascript:i3GEO.ajuda.redesSociais()"
					}
				],
				"analise" : [
					{
						id : "omenudataAnalise1",
						text : '<b>' + $trad("u22") + '</b>',
						submenu : {
							id : "subAnalise1",
							itemdata : [
								[
									{
										id : "omenudataAnalise2",
										text : $trad("u7"),
										url : "javascript:i3GEO.analise.dialogo.gradePol()"
									},
									{
										id : "omenudataAnalise3",
										text : $trad("u8"),
										url : "javascript:i3GEO.analise.dialogo.gradePontos()"
									},
									{
										id : "omenudataAnalise4",
										text : $trad("u9"),
										url : "javascript:i3GEO.analise.dialogo.gradeHex()"
									}
								]
							]
						}
					},
					{
						id : "omenudataAnalise5",
						text : '<b>' + $trad("u23") + '</b>',
						submenu : {
							id : "subAnalise2",
							itemdata : [
								[
									{
										id : "omenudataAnalise6",
										text : $trad("u11a"),
										url : "javascript:i3GEO.analise.dialogo.distanciaptpt()"
									},
									{
										id : "omenudataAnalise7",
										text : $trad("u12"),
										url : "javascript:i3GEO.analise.dialogo.nptPol()"
									},
									{
										id : "omenudataAnalise8",
										text : $trad("u13"),
										url : "javascript:i3GEO.analise.dialogo.pontoempoligono()"
									},
									{
										id : "omenudataAnalise9",
										text : $trad("u14"),
										url : "javascript:i3GEO.analise.dialogo.pontosdistri()"
									},
									{
										id : "omenudataAnalise9a",
										text : $trad("u28"),
										url : "javascript:i3GEO.analise.dialogo.centromassa()"
									}
								]
							]
						}
					},
					{
						id : "omenudataAnalise10",
						text : '<b>' + $trad("u24") + '</b>',
						submenu : {
							id : "subAnalise3",
							itemdata : [
								[
									{
										id : "omenudataAnalise11",
										text : $trad("u25"),
										url : "javascript:i3GEO.analise.dialogo.dissolve()"
									}
								]
							]
						}
					},
					{
						id : "omenudataNavegacao1",
						text : '<b>' + $trad("x105") + '</b>',
						submenu : {
							id : "subAnalise4",
							itemdata : [
								[
									{
										id : "omenudataAnalise18",
										text : $trad("d30"),
										url : "javascript:i3GEO.analise.dialogo.linhaDoTempo()"
									},
									{
										id : "omenudataNavegacao2",
										text : $trad("d15t"),
										url : "javascript:i3GEO.navega.dialogo.google()"
									},
									{
										id : "omenudataNavegacao3",
										text : $trad("d9t"),
										url : "javascript:i3GEO.maparef.inicia()"
									},
									{
										id : "omenudataNavegacao4",
										text : $trad("d8t"),
										url : "javascript:i3GEO.mapa.dialogo.mostraExten()"
									}
								]
							]
						}
					},
					{
						id : "omenudataAnalise12",
						text : '<b>' + $trad("u27") + '</b>',
						submenu : {
							id : "subAnalise5",
							itemdata : [
								[
									{
										id : "omenudataAnalise13",
										text : $trad("u6"),
										url : "javascript:i3GEO.analise.dialogo.analisaGeometrias()"
									},
									{
										id : "omenudataAnalise14",
										text : $trad("u10"),
										url : "javascript:i3GEO.analise.dialogo.buffer()"
									},
									{
										id : "omenudataAnalise15",
										text : $trad("u26"),
										url : "javascript:i3GEO.analise.dialogo.agrupaElementos()"
									},
									{
										id : "omenudataAnalise16",
										text : $trad("u11"),
										url : "javascript:i3GEO.analise.dialogo.centroide()"
									},
									{
										id : "omenudataAnalise17",
										text : $trad("t37b"),
										url : "javascript:i3GEO.analise.dialogo.graficoInterativo1()"
									},
									{
										id : "omenudataAnalise20",
										text : $trad("saikuAba"),
										url : "javascript:i3GEO.analise.dialogo.saiku()"
									},
									{
										id : "omenudataAnalise23",
										text : $trad("saikuMapa"),
										url : "javascript:i3GEO.analise.dialogo.saikuMapa()"
									},
									{
										id : "omenudataAnalise21",
										text : $trad("x102"),
										url : "javascript:i3GEO.analise.dialogo.heatmap()"
									},
									{
										id : "omenudataAnalise22",
										text : $trad("x104"),
										url : "javascript:i3GEO.analise.dialogo.markercluster()"
									},
									{
										id : "omenudataAnalise24",
										text : $trad("melhorcaminho"),
										url : "javascript:i3GEO.analise.dialogo.melhorcaminho()"
									}
								]
							]
						}
					}
				],
				"janelas" : [
					{
						id : "omenudataJanelas1",
						text : $trad("u15"),
						url : "javascript:i3GEO.barraDeBotoes.reativa(0);i3GEO.barraDeBotoes.reativa(1)"
					},
					{
						id : "omenudataJanelas2",
						text : $trad("u16"),
						url : "javascript:i3GEO.ajuda.abreJanela()"
					},
					{
						id : "omenudataJanelas3",
						text : $trad("u29"),
						url : "javascript:i3GEO.barraDeBotoes.editor.inicia()"
					}
				],
				"arquivos" : [
					{
						id : "omenudataArquivos1",
						text : $trad("u17"),
						url : "javascript:i3GEO.mapa.dialogo.salvaMapa()"
					},
					{
						id : "omenudataArquivos2",
						text : $trad("u18"),
						url : "javascript:i3GEO.mapa.dialogo.carregaMapa()"
					},
					{
						id : "omenudataArquivos6",
						text : $trad("x72"),
						url : "javascript:i3GEO.mapa.dialogo.listaDeMapasBanco()"
					},
					{
						id : "omenudataArquivos4",
						text : $trad("u20"),
						url : "javascript:i3GEO.mapa.dialogo.convertews()"
					},
					{
						id : "omenudataArquivos5",
						text : $trad("u20a"),
						url : "javascript:i3GEO.mapa.dialogo.convertekml()"
					}
				],
				"interface" : [
					{
						id : "omenudataInterface0a",
						text : '<b>' + $trad("d27") + '</b>',
						submenu : {
							id : "subInt1",
							itemdata : [
								[
									{
										id : "omenudataInterface2",
										text : "OpenLayers",
										url : "javascript:window.location = i3GEO.configura.locaplic+'/interface/black_ol.htm?'+i3GEO.configura.sid"
									},
									{
										id : "omenudataInterface2a",
										text : "OpenLayers OSM",
										url : "javascript:window.location = i3GEO.configura.locaplic+'/interface/black_osm.htm?'+i3GEO.configura.sid"
									},
									{
										id : "omenudataInterface4",
										text : "Google Maps",
										url : "javascript:window.location = i3GEO.configura.locaplic+'/interface/black_gm.phtml?'+i3GEO.configura.sid"
									},
									{
										id : "omenudataInterface5",
										text : "Google Earth",
										url : "javascript:window.location = i3GEO.configura.locaplic+'/interface/googleearth.phtml?'+i3GEO.configura.sid"
									}
								]
							]
						}
					},
					{
						id : "omenudataInterface0b",
						text : '<b>' + $trad("u27") + '</b>',
						submenu : {
							id : "subInt2",
							itemdata : [
								[
									{
										id : "omenudataInterface6",
										text : $trad("u21"),
										url : "javascript:var w = window.open(i3GEO.configura.locaplic+'/geradordelinks.htm')"
									},
									{
										id : "omenudataInterface7",
										text : "Servi&ccedil;os WMS",
										url : "javascript:var w = window.open(i3GEO.configura.locaplic+'/ogc.htm')"
									},
									{
										id : "omenudataInterface9",
										text : "Download de dados",
										url : "javascript:var w = window.open(i3GEO.configura.locaplic+'/datadownload.htm')"
									},
									{
										id : "omenudataInterface11",
										text : $trad("p20"),
										url : "javascript:i3GEO.mapa.dialogo.telaRemota()"
									}
								]
							]
						}
					}
				],
				"ferramentas" : [
					// mapas
					{
						id : "omenudataFerramentas0a",
						text : '<b>' + $trad("g4a") + '</b>',
						submenu : {
							id : "subFerr1",
							itemdata : [
								[
									{
										id : "omenudataFerramentas5a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeBusca'></span>" + $trad("x59"),
										url : "javascript:i3GEO.mapa.dialogo.locregiao()"
									},
									{
										id : "omenudataFerramentas6a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeFiltro'></span>" + $trad("x61"),
										url : "javascript:i3GEO.mapa.dialogo.filtraregiao()"
									},
									{
										id : "omenudataFerramentas4a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeCatalogo'></span>" + $trad("g1a"),
										url : "javascript:i3GEO.arvoreDeTemas.flutuante()"
									},
									{
										id : "omenudataFerramentas1a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeOpacidadeMapa'></span>" + $trad("t20"),
										url : "javascript:i3GEO.mapa.dialogo.opacidade()"
									},
									{
										id : "omenudataFerramentas2a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeAnimacao'></span>" + $trad("p21"),
										url : "javascript:i3GEO.mapa.dialogo.animacao()"
									},
									{
										id : "omenudataFerramentas3a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeSelecao'></span>" + $trad("d24t"),
										url : "javascript:i3GEO.mapa.dialogo.selecao();"
									},
									{
										id : "omenudataFerramentas7a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeCongela'></span>" + $trad("x64a"),
										url : "javascript:i3GEO.mapa.dialogo.congelaMapa();"
									},
									{
										id : "omenudataFerramentas8a",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeAutoredesenha'></span>" + $trad("p12"),
										url : "javascript:i3GEO.mapa.dialogo.autoredesenha()"
									},
									{
										id : "omenudataFerramentas9",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeVinde'></span>" + $trad("x85"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.vinde()"
									},
									{
										id : "omenudataFerramentas10",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeGeoLocal'></span>" + $trad("x93"),
										url : "javascript:i3GEO.mapa.dialogo.geolocal()"
									},
									{
										id : "omenudataFerramentas11",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeInserexy'></span>" + $trad("d22t"),
										url : "javascript:i3GEO.mapa.dialogo.cliquePonto()"
									},
									{
										id : "omenudataFerramentas12",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeCliqueTexto'></span>" + $trad("d25t"),
										url : "javascript:i3GEO.mapa.dialogo.cliqueTexto()"
									}
								]
							]
						}
					},
					// temas
					{
						id : "omenudataFerramentas0b",
						text : '<b>' + $trad("a7") + '</b>',
						submenu : {
							id : "subFerr2",
							itemdata : [
								[
									{
										id : "omenudataFerramentas1b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeTabela'></span>" + $trad("t31"),
										url : "javascript:i3GEO.tema.dialogo.tabela()"
									},
									{
										id : "omenudataFerramentas2b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeBusca'></span>" + $trad("t23"),
										url : "javascript:i3GEO.tema.dialogo.procuraratrib()"
									},
									{
										id : "omenudataFerramentas3b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeToponimia'></span>" + $trad("t25"),
										url : "javascript:i3GEO.tema.dialogo.toponimia()"
									},
									{
										id : "omenudataFerramentas4b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeEtiqueta'></span>" + $trad("t27"),
										url : "javascript:i3GEO.tema.dialogo.etiquetas()"
									},
									{
										id : "omenudataFerramentas5b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeFiltro'></span>" + $trad("t29"),
										url : "javascript:i3GEO.tema.dialogo.filtro()"
									},
									{
										id : "omenudataFerramentas6b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeLegenda'></span>" + $trad("t33"),
										url : "javascript:i3GEO.tema.dialogo.editaLegenda()"
									},
									{
										id : "omenudataFerramentas7b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeCortina'></span>" + $trad("t42"),
										url : "javascript:i3GEO.tema.dialogo.cortina()"
									},
									{
										id : "omenudataFerramentas8b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeGrTema'></span>" + $trad("t37a"),
										url : "javascript:i3GEO.tema.dialogo.graficotema()"
									},
									{
										id : "omenudataFerramentas9b",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeGrafico'></span>" + $trad("t37b"),
										url : "javascript:i3GEO.analise.dialogo.graficoInterativo1()"
									},
									{
										id : "omenudataFerramentasmmscale",
										text : "<span class='i3GEOconeFerramenta i3GEOiconemmscale'></span>" + $trad("variaEscala"),
										url : "javascript:i3GEO.tema.dialogo.mmscale()"
									}
								]
							]
						}
					},
					// cartogramas
					{
						id : "omenudataFerramentas0e",
						text : '<b>' + $trad("x60") + '</b>',
						submenu : {
							id : "subFerr3",
							itemdata : [
								[
									{
										id : "omenudataFerramentas1e",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeCartograma'></span>" + $trad("x57"),
										url : "javascript:i3GEO.mapa.dialogo.metaestat()"
									},
									{
										id : "omenudataFerramentas4e",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeAplicStat'></span>" + $trad("x71"),
										url : "javascript:i3GEO.mapa.dialogo.metaestatListaMapas()"
									},
									{
										id : "omenudataFerramentas3e",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeTme'></span>" + $trad("t49"),
										url : "javascript:i3GEO.tema.dialogo.tme()"
									}
								]
							]
						}
					},
					// conexoes
					{
						id : "omenudataFerramentas0c",
						text : '<b>' + $trad("a15") + '</b>',
						submenu : {
							id : "subFerr4",
							itemdata : [
								[
									{
										id : "omenudataFerramentas14",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeAdd'></span>" + $trad("conexaoServicoGeo"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.conectaservico()"
									}
								]
							]
						}
					},
					// upload
					{
						id : "omenudataFerramentas0d",
						text : '<b>Upload</b>',
						submenu : {
							id : "subFerr5",
							itemdata : [
								[
									{
										id : "omenudataFerramentas13",
										text : "<span class='i3GEOconeFerramenta i3GEOiconeUpload'></span>" + $trad("uploadArquivoGeo"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.uploadarquivo()"
									}
								]
							]
						}
					}
				]
			}
		},
		/**
		 * Propriedade: tipoimagem
		 *
		 * Indica o tipo de filtro de imagem que est&aacute; ativo. O filtro ativo &eacute; aplicado sobre a imagem toda a vez que o mapa
		 * &eacute; refeito.
		 *
		 * Veja <classe_imagem.php> para obter os tipos poss&iacute;veis
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * "nenhum"
		 */
		tipoimagem : "nenhum",
		/**
		 * Propriedade: ajustaDocType
		 *
		 * Ajusta ou n&atilde;o a declara&ccedil;&atilde;o DOCTYPE do documento HTML. O ajuste &eacute; necess&aacute;rio para que algumas
		 * op&ccedil;&otilde;es funcionem adequadamente. Caso vc deseje usar um DOCTYPE espec&iacute;fico, utilize false. O ajuste do
		 * DOCTYPE n&atilde;o funciona no navegador IE.
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		ajustaDocType : true,
		/**
		 * Propriedade: tipotip
		 *
		 * Tipo de tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio estaciona o
		 * mouse sobre o mapa
		 *
		 * Pode ser um id de um elemento existente no HTML
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * completo|simples|balao|id
		 *
		 * Default:
		 *
		 * "balao"
		 */
		tipotip : "balao",
		/**
		 * Propriedade: alturatip
		 *
		 * Altura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * estaciona o mouse sobre o mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * 200px
		 */
		alturatip : "100px",
		/**
		 * Propriedade: larguratip
		 *
		 * Largura em pixel do tip que &eacute; mostrado na fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * estaciona o mouse sobre o mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * 200px
		 */
		larguratip : "200px",
		/**
		 * Propriedade: funcaoTip
		 *
		 * Fun&ccedil;&atilde;o que ser&aacute; executada na opera&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * estaciona o mouse sobre o mapa
		 *
		 * Tipo:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * "i3GEO.mapa.dialogo.verificaTipDefault()"
		 */
		funcaoTip : "i3GEO.mapa.dialogo.verificaTipDefault()",
		/**
		 * Propriedade: funcaoIdentifica
		 *
		 * Fun&ccedil;&atilde;o que ser&aacute; executada na opera&ccedil;&atilde;o de identifica&ccedil;&atilde;o quando o usu&aacute;rio
		 * clica no mapa
		 *
		 * Tipo:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * "i3GEO.mapa.dialogo.cliqueIdentificaDefault()"
		 */
		funcaoIdentifica : "i3GEO.mapa.dialogo.cliqueIdentificaDefault()",
		/**
		 * Propriedade: diminuixM
		 *
		 * Diminui a largura do mapa em pixels no caso do navegador ser o IE. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 13
		 */
		diminuixM : 0,
		/**
		 * Propriedade: diminuixN
		 *
		 * Diminui a largura do mapa em pixels no caso do navegador ser o FF. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 11
		 */
		diminuixN : 00,
		/**
		 * Propriedade: diminuiyM
		 *
		 * Diminui a altura do mapa em pixels no caso do navegador ser o IE. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 106
		 */
		diminuiyM : 70,
		/**
		 * Propriedade: diminuiyN
		 *
		 * Diminui a altura do mapa em pixels no caso do navegador ser o FF. Valores definidos em pixel.
		 *
		 * Tipo:
		 *
		 * {numeric}
		 *
		 * Default:
		 *
		 * 103
		 */
		diminuiyN : 70,
		/**
		 * Propriedade: autotamanho
		 *
		 * Calcula o tamanho do mapa conforme o tamanho da janela do navegador (false) ou calcula o tamanho do mapa conforme o tamanho da
		 * tela do monitor (true)
		 *
		 * Tipo:
		 *
		 * {boolean}
		 *
		 * Default:
		 *
		 * false
		 */
		autotamanho : false,
		/**
		 * Vari&aacute;vel que define o nome do map_file que possu&iacute; o layer para uso na fun&ccedil;&atilde;o 3d. Pode ser utilizado o
		 * caminho completo, se n&atilde;o, busca no diret&oacute;rio aplicmap.
		 *
		 * O mapfile deve conter um layer para c&aacute;lculo dos valores de Z para compor o modelo do relevo sobre o qual o mapa
		 * ser&aacute; desenhado.
		 *
		 * Por padr&atilde;o, o i3geo utiliza o mapfile aplicmpa/3dmap.map
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * ""
		 */
		map3d : "",
		/**
		 * Propriedade: embedLegenda
		 *
		 * Indica se a legenda deve ser incluida no corpo do mapa.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * sim|nao
		 *
		 * Default:
		 *
		 * nao
		 */
		embedLegenda : "nao",
		/**
		 * Propriedade: templateLegenda
		 *
		 * Template HTML que ser&aacute; utilizado na gera&ccedil;&atilde;o da legenda HTML.
		 *
		 * A sintaxe utilizada na montagem do template &eacute; baseado na sintaxe do pr&oacute;prio Mapserver. O HTML pode ser armazenado
		 * em i3geo/aplicmap ou em um outro endere&ccedil;o no servidor. O template serve para definir o layout da legenda que &eacute;
		 * mostrada quando a guia legenda &eacute; ativada. Se for definido como "", &eacute; utilizado o template
		 * i3geo/aplicmap/legenda.htm.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * ""
		 */
		templateLegenda : "legenda8.htm",
		/**
		 * Propriedade: mashuppar
		 *
		 * Define os par&acirc;metros que devem ser aplicados no modo mashup
		 *
		 * O modo mashup possibilita que o i3Geo seja embutido dentro de uma p&aacute;gina HTML. Nesse caso, o mapa n&atilde;o &eacute;
		 * criado no modo convencional, que utiliza o programa i3geo/ms_criamapa.php A variavel mashuppar deve conter os par&acirc;metros
		 * que s&atilde;o utilizados pelo programa ms_criamapa
		 *
		 * Exemplo:
		 *
		 * i3GEO.configura.mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"
		 *
		 * Tipo:
		 *
		 * string
		 *
		 * Default:
		 *
		 * ""
		 */
		mashuppar : "",
		/**
		 * C&oacute;digo da se&ccedil;&atilde;o aberta pelo i3Geo no servidor.
		 *
		 * O c&oacute;digo &eacute; gerado na inicializa&ccedil;&atilde;o do i3Geo pelo programa ms_criamapa.php
		 *
		 * Tipo:
		 *
		 * {String}
		 */
		sid : "",
		/**
		 * Localiza&ccedil;&atilde;o da instala&ccedil;&atilde;o do i3geo (URI)
		 *
		 * Por default, &eacute; definida na inicializa&ccedil;&atilde;o do i3Geo
		 *
		 * Tipo:
		 *
		 * {string}
		 */
		locaplic : "",
		/**
		 * Propriedade: mapaRefDisplay
		 *
		 * Indica se o mapa de refer&ecirc;ncia dever&aacute; ser aberto quando o i3Geo for inicializado.
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * "block"
		 *
		 * Valores:
		 *
		 * block|none
		 */
		mapaRefDisplay : "block",
		/**
		 * Tipo de visual que ser&aacute; utilizado no mapa.
		 *
		 * A lista de visuais existentes &eacute; obtida na inicializa&ccedil;&atilde;o do i3geo.
		 *
		 * Veja o diret&oacute;rio i3geo/imagens/visual
		 *
		 * Tipo:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * default
		 */
		visual : "default",
		/**
		 * Propriedade: cursores
		 *
		 * Imagens utilizadas para os cursores do mouse mostrados no mapa
		 *
		 * A manipula&ccedil;&atilde;o dos cursores &eacute; feita com i3GEO.util.mudaCursor
		 *
		 * &Eacute; poss&iacute;vel utilizar tamb&eacute;m um dos tipos default, pointer, crosshair, help, move, text
		 *
		 * Tipo:
		 *
		 * {Objeto}
		 */
		cursores : {
			"identifica" : {
				ff : "pointer",
				ie : "pointer"
			},
			"pan" : {
				ff : "/imagens/cursores/pan.png",
				ie : "/imagens/cursores/pan.cur"
			},
			"area" : {
				ff : "crosshair",
				ie : "crosshair"
			},
			"distancia" : {
				ff : "crosshair",
				ie : "crosshair"
			},
			"zoom" : {
				ff : "/imagens/cursores/zoom.png",
				ie : "/imagens/cursores/zoom.cur"
			},
			"contexto" : {
				ff : "/imagens/cursores/contexto.png",
				ie : "/imagens/cursores/contexto.cur"
			},
			"identifica_contexto" : {
				ff : "pointer",
				ie : "pointer"
			},
			"pan_contexto" : {
				ff : "/imagens/cursores/pan_contexto.png",
				ie : "/imagens/cursores/pan_contexto.cur"
			},
			"zoom_contexto" : {
				ff : "/imagens/cursores/zoom_contexto.png",
				ie : "/imagens/cursores/zoom_contexto.cur"
			}
		},
		/**
		 * Propriedade: listaDePropriedadesDoMapa
		 *
		 * Lista com as fun&ccedil;&otilde;es que s&atilde;o inclu&iacute;das no item "Propriedades do mapa"
		 *
		 * Tipo:
		 *
		 * {Objeto}
		 */
		listaDePropriedadesDoMapa : {
			"propriedades" : [
				{
					text : "p2",
					url : "javascript:i3GEO.mapa.dialogo.tipoimagem()"
				},
				// { text: "p15", url: "javascript:i3GEO.mapa.dialogo.outputformat()"},
				{
					text : "p3",
					url : "javascript:i3GEO.mapa.dialogo.opcoesLegenda()"
				},
				{
					text : "p4",
					url : "javascript:i3GEO.mapa.dialogo.opcoesEscala()"
				},
				{
					text : "p5",
					url : "javascript:i3GEO.mapa.dialogo.tamanho()"
				},
				{
					text : "p7",
					url : "javascript:i3GEO.mapa.ativaLogo()"
				},
				{
					text : "p8",
					url : "javascript:i3GEO.mapa.dialogo.queryMap()"
				},
				{
					text : "p9",
					url : "javascript:i3GEO.mapa.dialogo.corFundo()"
				},
				{
					text : "p10",
					url : "javascript:i3GEO.mapa.dialogo.gradeCoord()"
				},
				{
					text : "p12",
					url : "javascript:i3GEO.mapa.dialogo.autoredesenha()"
				}
			]
		},
		/**
		 * Propriedade: tempoAplicar
		 *
		 * Tempo em milisegundos que ser&aacute; esperado at&eacute; que o mapa seja desenhado automaticamente.
		 *
		 * Utilizado no bot&atilde;o Aplicar, quando o usu&aacute;rio liga/desliga ou adiciona umtema
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 4000
		 */
		tempoAplicar : 4000,
		/**
		 * Propriedade: tempoMouseParado
		 *
		 * Tempo em milisegundos que ser&aacute; esperado para detectar que o mouse est&aacute; parado.
		 *
		 * Controla o lapso de tempo utilizado para disparar as fun&ccedil;&otilde;es que ocorrem quando o mouse est&aacute; parado sobre o
		 * mapa
		 *
		 * Tipo:
		 *
		 * {Numeric}
		 *
		 * Default:
		 *
		 * 3500
		 */
		tempoMouseParado : 1800,
		/**
		 * Propriedade: iniciaJanelaMensagens
		 *
		 * Inicia o i3geo com a janela de mensagens aberta ou fechada.
		 *
		 * Se o cookie g_janelaMen estiver definido, essa vari&aacute;vel n&atilde;o ter&aacute; efeito
		 *
		 * Tipo:
		 *
		 * {Boolean}
		 *
		 * Default:
		 *
		 * true
		 */
		iniciaJanelaMensagens : false,
		/**
		 * Propriedade: liberaGuias
		 *
		 * Indica se as guias ser&atilde;o montadas em uma janela flutuante sobre o mapa
		 *
		 * Tipo:
		 *
		 * {string}
		 *
		 * Valores:
		 *
		 * {sim|nao}
		 *
		 * Default:
		 *
		 * nao
		 */
		liberaGuias : "nao",
		/**
		 * Propriedade: funcoesBotoes
		 *
		 * Funcionalidades que ser&atilde;o adicionadas aos bot&otilde;es existentes no mapa.
		 *
		 * Essa lista pode ser modificada antes da inicializa&ccedil;&atilde;o do mapa.
		 *
		 * As funcionalidades apenas s&atilde;o inclu&iacute;das se o elemento HTML indicado em iddiv existir. Por isso, caso uma
		 * fun&ccedil;&atilde;o n&atilde;o seja desejada, basta excluir o div do HTML utilizado no mapa.
		 *
		 * A lista de fun&ccedil;&otilde;es &eacute; inclu&iacute;da em i3GEO.configura.funcoesBotoes.botoes
		 *
		 * O elemento 'titulo' &eacute; usado na barra de bot&otilde;es do tipo olho de peixe
		 *
		 * IDs utilizados para selecionar onde os bot&otilde;es ser&atilde;o inseridos:
		 *
		 * historicozoom - zoom anterior e posterior
		 *
		 * Tipo:
		 *
		 * {Object}
		 *
		 */
		funcoesBotoes : {
			"botoes" : [
				{
					iddiv : "historicozoom",
					tipo : "",
					dica : "",
					constroiconteudo : 'i3GEO.gadgets.mostraHistoricoZoom()'
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de zoom para a extens&atilde;o total do mapa.
					iddiv : "zoomtot",
					tipo : "",
					dica : $trad("d2"),
					titulo : $trad("d2t"),
					funcaoonclick : function() {
						if (i3GEO.Interface.ATUAL === "openlayers") {
							i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.extentTotal);
							return;
						}
						if (i3GEO.Interface.ATUAL === "googlemaps") {
							i3GEO.Interface.googlemaps.zoom2extent(i3GEO.parametros.extentTotal);
							return;
						}
						i3GEO.navega.zoomExt(
							i3GEO.configura.locaplic,
							i3GEO.configura.sid,
							i3GEO.configura.tipoimagem,
							i3GEO.parametros.extentTotal);
						marcadorZoom = "";
					}
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de busca r&aacute;pida
					iddiv : "localizar",
					tipo : "",
					dica : $trad("o2"),
					titulo : $trad("o2"),
					funcaoonclick : function() {
						if (!$i("janelaBuscaRapida")) {
							var janela =
								i3GEO.janela.cria(
									"258px",
									"30px",
									"",
									"",
									"",
									$trad("o2"),
									"janelaBuscaRapida",
									false,
									"hd",
									"",
									"",
									"",
									true,
									i3GEO.configura.locaplic + "/imagens/oxygen/16x16/edit-find.png");
							$i("janelaBuscaRapida_corpo").style.backgroundColor = "white";
							i3GEO.gadgets.mostraBuscaRapida(janela[2].id);
						}
					}
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de zoom interativo.
					iddiv : "zoomli",
					tipo : "dinamico",
					dica : $trad("d3"),
					titulo : $trad("d3t"),
					funcaoonclick : function() {
						if (DetectaMobile("DetectMobileLong")) {
							i3GEO.janela.tempoMsg($trad("x70"));
						} else {
							i3GEO.janela.tempoMsg($trad("x69"));
						}
						if (i3GEO.Interface.ATUAL === "googlemaps") {
							// alert("Pressione a tecla CTRL junto com o bot&atilde;o esquerdo do mouse");
							i3GEO.barraDeBotoes.ativaIcone("pan");
							i3GEO.barraDeBotoes.BOTAOPADRAO = "pan";
							i3GeoMap.setOptions({
								draggable : true
							});
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
							return;
						}
						if (i3GEO.Interface.ATUAL === "openlayers") {
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
							// i3GEO.Interface.openlayers.OLpanel.activateControl(i3GEO.Interface.openlayers.OLzoom);
							return;
						}
					}
				},
				{
					iddiv : "zoomanterior",
					tipo : "dinamico",
					dica : "",
					titulo : "",
					funcaoonclick : function() {
						i3GEO.navega.extensaoAnterior();
					}
				},
				{
					iddiv : "zoomproximo",
					tipo : "dinamico",
					dica : "",
					titulo : "",
					funcaoonclick : function() {
						i3GEO.navega.extensaoProximo();
					}
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de deslocamento (pan).
					// ao fazer o pan e motrada uma marca no centro do mapa, veja em
					// i3GEO.navega.marcaCentroDoMapa
					iddiv : "pan",
					tipo : "dinamico",
					dica : $trad("d4"),
					titulo : $trad("d4t"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("pan");
						i3GEO.barraDeBotoes.BOTAOPADRAO = "pan";
						if (i3GEO.Interface.ATUAL === "googlemaps") {
							i3GeoMap.setOptions({
								draggable : true
							});
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
							return;
						}
						if ($i(i3GEO.Interface.IDMAPA)) {
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
						}
						marcadorZoom = "";
						if (i3GEO.Interface.ATUAL === "openlayers") {
							if (i3GEO.Interface.TABLET === false) {
								i3GEO.Interface.openlayers.OLpanel.activateControl(i3GEO.Interface.openlayers.OLpan);
							}
							return;
						}
					}
				},
				{
					// bot&atilde;o que realiza a opera&ccedil;&atilde;o de zoom in.
					iddiv : "zoomiauto",
					tipo : "",
					dica : $trad("d5"),
					titulo : $trad("d5t"),
					funcaoonclick : function() {
						i3GEO.navega.zoomin(i3GEO.configura.locaplic, i3GEO.configura.sid);
						marcadorZoom = '';
					}
				},
				{
					// bot&atilde;o que realiza a opera&ccedil;&atilde;o de zoom out
					iddiv : "zoomoauto",
					tipo : "",
					dica : $trad("d6"),
					titulo : $trad("d6t"),
					funcaoonclick : function() {
						i3GEO.navega.zoomout(i3GEO.configura.locaplic, i3GEO.configura.sid);
						marcadorZoom = "";
					}
				},
				{
					// bot&atilde;o que abre a fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o.
					iddiv : "identifica",
					tipo : "dinamico",
					dica : $trad("d7"),
					titulo : $trad("d7t"),
					funcaoonclick : function() {
						var temp;
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							temp = "identifica";
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, temp, i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
						}
						i3GEO.barraDeBotoes.ativaIcone("identifica");
						if (i3GEO.Interface.ATUAL === "googleearth" || i3GEO.eventos.cliquePerm.ativo === false) {
							// caso seja um clique para desativar
							if (i3GEO.eventos.MOUSECLIQUE.toString().search(i3GEO.configura.funcaoIdentifica) >= 0) {
								i3GEO.eventos.MOUSECLIQUE.remove(i3GEO.configura.funcaoIdentifica);
								return;
							}
							// na opcao de identificacao so e permitido um evento
							i3GEO.eventos.MOUSECLIQUE = [
								i3GEO.configura.funcaoIdentifica
							];
						} else {
							// desativa as outras operacoes de clique, mas apenas se nao for a mesma que ativa o identifica
							i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",[i3GEO.configura.funcaoTip]);
							i3GEO.eventos.adicionaEventos("MOUSECLIQUEPERM",[i3GEO.configura.funcaoIdentifica]);
						}
					}
				},
				{
					// bot&atilde;o que abre a fun&ccedil;&atilde;o de identifica&ccedil;&atilde;o do tipo balao.
					// veja tempoMouseParado
					iddiv : "identificaBalao",
					tipo : "dinamico",
					dica : $trad("d7a"),
					titulo : $trad("d7at"),
					funcaoonclick : function() {
						if (i3GEO.arvoreDeCamadas.filtraCamadas("etiquetas", "", "diferente", i3GEO.arvoreDeCamadas.CAMADAS) === "") {
							i3GEO.janela.tempoMsg($trad("d31"));
							return;
						}
						var temp;
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							temp = "identifica";
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, temp, i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
						}
						i3GEO.barraDeBotoes.ativaIcone("identificaBalao");
						if (i3GEO.Interface.ATUAL === "googleearth" || i3GEO.eventos.cliquePerm.ativo === false) {
							// na opcao de identificacao so e permitido um evento
							i3GEO.eventos.MOUSECLIQUE = [
								i3GEO.configura.funcaoTip
							];
						} else {
							// desativa as outras operacoes de clique, mas apenas se nao for a mesma que ativa o identifica
							i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",[i3GEO.configura.funcaoIdentifica]);
							i3GEO.eventos.adicionaEventos("MOUSECLIQUEPERM",[i3GEO.configura.funcaoTip]);
						}
					}
				},
				{
					// bot&atilde;o que abre a janela com o valor da extens&atilde;o geogr&aacute;fica do mapa atual
					iddiv : "exten",
					tipo : "",
					dica : $trad("d8"),
					titulo : $trad("d8t"),
					funcaoonclick : function() {
						i3GEO.mapa.dialogo.mostraExten();
					}
				},
				{
					// bot&atilde;o que abre a janela com o mapa de refer&ecirc;ncia
					iddiv : "referencia",
					tipo : "",
					dica : $trad("d9"),
					titulo : $trad("d9t"),
					funcaoonclick : function() {
						i3GEO.maparef.inicia();
					}
				},
				{
					// bot&atilde;o de busca na wikipedia
					iddiv : "wiki",
					tipo : "",
					dica : $trad("d11"),
					titulo : $trad("d11t"),
					funcaoonclick : function() {
						i3GEO.navega.dialogo.wiki();
					}
				},
				{
					// bot&atilde;o de busca na rede metar
					iddiv : "metar",
					tipo : "",
					dica : $trad("d29"),
					titulo : $trad("d29"),
					funcaoonclick : function() {
						i3GEO.navega.dialogo.metar();
					}
				},
				{
					// bot&atilde;o de busca de fotos
					iddiv : "buscafotos",
					tipo : "",
					dica : "Fotos",
					titulo : "fotos",
					funcaoonclick : function() {
						i3GEO.navega.dialogo.buscaFotos();
					}
				},
				{
					// bot&atilde;o de impress&atilde;o
					iddiv : "imprimir",
					tipo : "",
					dica : $trad("d12"),
					titulo : $trad("d12"),
					funcaoonclick : function() {
						i3GEO.mapa.dialogo.imprimir();
					}
				},
				{
					// bot&atilde;o de localiza&ccedil;&atilde;o do usu&aacute;rio pelo IP
					iddiv : "ondeestou",
					tipo : "",
					dica : $trad("d13"),
					funcaoonclick : function() {
						i3GEO.navega.zoomIP(i3GEO.configura.locaplic, i3GEO.configura.sid);
					}
				},
				{
					// abre a op&ccedil;&atilde;o de gera&ccedil;&atilde;o de um modelo virtual de eleva&ccedil;&atilde;o
					iddiv : "v3d",
					tipo : "",
					dica : $trad("d14"),
					titulo : $trad("d14"),
					funcaoonclick : function() {
						i3GEO.mapa.dialogo.t3d();
					}
				},
				{
					iddiv : "google",
					tipo : "",
					dica : $trad("d15"),
					titulo : $trad("d15t"),
					funcaoonclick : function() {
						i3GEO.navega.dialogo.google();
					}
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de de busca no site Scielo
					// depreciado
					iddiv : "scielo",
					tipo : "",
					dica : $trad("d16"),
					titulo : $trad("d16t"),
					funcaoonclick : function() {
					}
				},
				{
					// Ativa o bot&atilde;o que realiza a opera&ccedil;&atilde;o de de busca no site confluence
					iddiv : "confluence",
					tipo : "",
					dica : $trad("d17"),
					titulo : $trad("d17t"),
					funcaoonclick : function() {
						i3GEO.navega.dialogo.confluence();
					}
				},
				{
					// Ativa o bot&atilde;o que abre a lente de aumento
					iddiv : "lentei",
					tipo : "",
					dica : $trad("d18"),
					titulo : $trad("d18t"),
					funcaoonclick : function() {
						if (i3GEO.navega.lente.ESTAATIVA === "nao") {
							i3GEO.navega.lente.inicia();
						} else {
							i3GEO.navega.lente.desativa();
						}
					}
				},
				{
					// Coloca as guias em uma janela m&oacute;vel
					iddiv : "encolheFerramentas",
					tipo : "",
					dica : $trad("d19"),
					funcaoonclick : function() {
						i3GEO.guias.libera();
					}
				},
				{
					// bot&atilde;o de reinicializa&ccedil;&atilde;o do mapa que restaura as condi&ccedil;&otilde;es iniciais do mapa
					iddiv : "reinicia",
					tipo : "",
					dica : $trad("d20"),
					titulo : $trad("d20t"),
					funcaoonclick : function() {
						var temp = function() {
							var url = window.location.href;
							url = url.replace("#", "");
							url = url.split("?");
							window.location.href = url[0] + "?" + i3GEO.configura.sid;
						};
						i3GEO.php.reiniciaMapa(temp);
					}
				},
				{
					// bot&atilde;o de medi&ccedil;&atilde;o de dist&acirc;ncias
					iddiv : "mede",
					tipo : "dinamico",
					dica : $trad("d21"),
					titulo : $trad("d21t"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("mede");
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "distancia", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
						}
						i3GEO.analise.medeDistancia.inicia();
					}
				},
				{
					// bot&atilde;o de medi&ccedil;&atilde;o de &aacute;rea
					iddiv : "area",
					tipo : "dinamico",
					dica : $trad("d21a"),
					titulo : $trad("d21at"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("area");
						if ($i(i3GEO.Interface.IDMAPA)) {
							$i(i3GEO.Interface.IDMAPA).title = "";
							i3GEO.util.mudaCursor(i3GEO.configura.cursores, "area", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
						}
						i3GEO.analise.medeArea.inicia();
					}
				},
				{
					// barra de edi&ccedil;&atilde;o
					iddiv : "barraedicao",
					tipo : "",
					dica : $trad("u29"),
					titulo : $trad("u29"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.editor.inicia();
					}
				},
				{
					// bot&atilde;o de digitaliza&ccedil;&atilde;o
					iddiv : "inserexy",
					tipo : "dinamico",
					dica : $trad("d22"),
					titulo : $trad("d22t"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("inserexy");
						i3GEO.mapa.dialogo.cliquePonto();
					}
				},
				{
					// bot&atilde;o de inclus&atilde;o de gr&aacute;ficos
					iddiv : "inseregrafico",
					tipo : "dinamico",
					dica : $trad("d23"),
					funcaoonclick : function() {
						i3GEO.mapa.dialogo.cliqueGrafico();
						i3GEO.util.mudaCursor(i3GEO.configura.cursores, "pointer", i3GEO.Interface.IDMAPA, i3GEO.configura.locaplic);
					}
				},
				{
					// bot&atilde;o de sele&ccedil;&atilde;o
					iddiv : "selecao",
					tipo : "dinamico",
					dica : $trad("d24"),
					titulo : $trad("d24t"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("selecao");
						i3GEO.mapa.dialogo.selecao();
					}
				},
				{
					// bot&atilde;o de inser&ccedil;&atilde;o de topon&iacute;mia
					iddiv : "textofid",
					tipo : "dinamico",
					dica : $trad("d25"),
					titulo : $trad("d25t"),
					funcaoonclick : function() {
						i3GEO.barraDeBotoes.ativaIcone("textofid");
						i3GEO.mapa.dialogo.cliqueTexto();
					}
				},
				{
					// monta rotas com o googlemaps
					iddiv : "rota",
					tipo : "",
					dica : "Rota",
					titulo : "roteamento",
					funcaoonclick : function() {
						if (i3GEO.Interface.ATUAL !== "googlemaps") {
							alert("Operacao disponivel apenas na interface Google Maps");
							return;
						}
						counterClick = 1;
						var parametrosRota =
							function(overlay, latlng) {
								var temp, janela;
								if (counterClick === 1) {
									counterClick++;
									alert("Clique o ponto de destino da rota");
									pontoRota1 = latlng;
									return;
								}
								if (counterClick === 2) {
									pontoRota2 = latlng;
									counterClick = 0;
									GEvent.removeListener(rotaEvento);
									janela = i3GEO.janela.cria("300px", "300px", "", "center", "", $trad("x48"));
									janela[2].style.overflow = "auto";
									janela[2].style.height = "300px";
									directions = new GDirections(i3GeoMap, janela[2]);
									temp = function() {
										$i("wdoca_corpo").innerHTML = "N&atilde;o foi poss&iacute;vel criar a rota";
									};
									GEvent.addListener(directions, "error", temp);
									directions.load("from: " + pontoRota1.lat() + "," + pontoRota1.lng() + " to: " + pontoRota2.lat() + ","
										+ pontoRota2.lng());
								}
							};
						rotaEvento = GEvent.addListener(i3GeoMap, "click", parametrosRota);
						i3GEO.janela.tempoMsg("Clique o ponto de origem da rota");
					}
				},
				{
					// abre a legenda
					iddiv : "abreJanelaLegenda",
					tipo : "",
					dica : $trad("p3"),
					titulo : $trad("p3"),
					funcaoonclick : function() {
						i3GEO.mapa.legendaHTML.libera("sim");
					}
				}
			]
		},
		/**
		 * Propriedade: iniciaFerramentas
		 *
		 * Ferramentas que ser&atilde;o inicializadas com o mapa
		 * Esse objeto cont&eacute;m a fun&ccedil;&atilde;o de inicializa&ccedil;&atilde;o e a lista de ferramentas e seus par&acirc;metros internos
		 *
		 * Cada ferramenta cont&eacute;m uma propriedade chamada &quot;ativa&quot; que indica se ser&aacute; inicializada ou n&atilde;o com o mapa
		 *
		 * A defini&ccedil;&atilde;o de ativa ou n&atilde;o pode ser feita com uso do menu de prefer&ecirc;ncias do i3Geo
		 * 
		 * Ao modificar os par&acirc;metros, atualize a ferramenta i3geo/ferramentas/preferencias
		 *
		 * Ferramentas dispon&iacute;veis:
		 *
		 * legenda|locregiao|metaestat
		 *
		 * Exemplo:
		 *
		 * i3GEO.configura.iniciaFerramentas.quais.legenda.ativa = true;
		 *
		 * Tipo:
		 *
		 * {Objeto}
		*/
		iniciaFerramentas : {
			executa : function() {
				var q = i3GEO.configura.iniciaFerramentas.quais, i = 0;
				for (i in q) {
					if (q[i].ativa === true) {
						q[i].funcao.call();
					}
				}
			},
			"quais" : {
				legenda : {
					ativa : false,
					largura : 302,
					altura : 300,
					topo : 50,
					esquerda : 100,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.legenda;
						i3GEO.mapa.legendaHTML.libera("sim", q.largura, q.altura, q.topo, q.esquerda);
					}
				},
				locregiao : {
					ativa : false,
					largura : 215,
					altura : "",
					topo : 150,
					esquerda : 150,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.locregiao;
						i3GEO.mapa.dialogo.locregiao(q.largura, q.altura, q.topo, q.esquerda);
					}
				},
				metaestat : {
					ativa : false,
					largura : 215,
					altura : "",
					topo : 150,
					esquerda : 150,
					funcao : function() {
						var q = i3GEO.configura.iniciaFerramentas.quais.metaestat;
						i3GEO.mapa.dialogo.metaestat(q.largura, q.altura, q.topo, q.esquerda);
					}
				}
			}
		}
	};
// YAHOO.log("carregou classe configura", "Classes i3geo");
