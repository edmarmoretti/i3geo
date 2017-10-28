if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.listaDeFerramentas = {
			menu : [
				{
					nome : $trad("s1"),
					descricao: $trad("descMenuAjuda"),
					id : "ajudaMenu"
				},
				{
					nome : $trad("s2"),
					descricao: $trad("descMenuAnalise"),
					id : "analise"
				},
				{
					nome : $trad("s4"),
					descricao: $trad("descArquivos"),
					id : "arquivos"
				},
				{
					nome : $trad("operacoesMapaTema"),
					descricao:  $trad("descOperacoesMapaTema"),
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
						text : "Youtube",
						url : "https://www.youtube.com/results?search_query=i3geo",
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
						url : "https://softwarepublico.gov.br/social/i3geo",
						target : "_blank"
					},
					{
						id : "omenudataAjudamenu7",
						text : "Git",
						url : "https://softwarepublico.gov.br/gitlab/groups/i3geo",
						target : "_blank"
					}
				],
				"analise" : [
					{
						id : "omenudataMedir",
						text : $trad("medir"),
						submenu : {
							id : "subAnaliseMedir",
							itemdata : [
								[
									{
										id : "omenudataMedirArea",
										text : $trad("d21at"),
										url : "javascript:i3GEO.analise.dialogo.area()"
									},
									{
										id : "omenudataMedirDist",
										text : $trad("d21t"),
										url : "javascript:i3GEO.analise.dialogo.distancia()"
									}
								]
							]
						}
					},
					{
						id : "omenudataAnalise1",
						text : $trad("u22"),
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
						text : $trad("u23"),
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
						text : $trad("u24"),
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
						id : "omenudataAnalise12",
						text : $trad("u27"),
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
						text : $trad("d27"),
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
									}
								]
							]
						}
					},
					{
						id : "omenudataInterface0b",
						text : $trad("u27"),
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
									}
								]
							]
						}
					}
				],
				"ferramentas" : [
					// mapas
					// apos modificar, veja se a ferramenta i3GEO.mapa.dialogo.ferramentas() vai funcionar
					// essa ferramenta faz um parser das strings existentes em text e url
					// text deve sempre ter a tag </span> e url deve sempre ter javascript:
					//
					{
						id : "omenudataFerramentas0a",
						text : $trad("g4a"),
						submenu : {
							id : "mapa",
							itemdata : [
								[
									{
										id : "omenudataFerramentas5a",
										text : $trad("x59"),
										url : "javascript:i3GEO.mapa.dialogo.locregiao()"
									},
									{
										id : "omenudataFerramentas6a",
										text : $trad("x61"),
										url : "javascript:i3GEO.mapa.dialogo.filtraregiao()"
									},
									{
										id : "omenudataFerramentas1a",
										text : $trad("t20"),
										url : "javascript:i3GEO.mapa.dialogo.opacidade()"
									},
									{
										id : "omenudataFerramentas2a",
										text : $trad("p21"),
										url : "javascript:i3GEO.mapa.dialogo.animacao()"
									},
									{
										id : "omenudataFerramentas3a",
										text : $trad("d24t"),
										url : "javascript:i3GEO.mapa.dialogo.selecao();"
									},
									{
										id : "omenudataFerramentas11",
										text : $trad("d22t"),
										url : "javascript:i3GEO.mapa.dialogo.cliquePonto()"
									},
									{
										id : "omenudataFerramentas12",
										text : $trad("d25t"),
										url : "javascript:i3GEO.mapa.dialogo.cliqueTexto()"
									},
									{
										id : "omenudataImprimir",
										text : $trad("d12"),
										url : "javascript:i3GEO.mapa.dialogo.imprimir()"
									},
									{
										id : "omenudataTipoImg",
										text : $trad("p2"),
										url : "javascript:i3GEO.mapa.dialogo.tipoimagem()"
									},
									{
										id : "omenudataCorFundo",
										text : $trad("p9"),
										url : "javascript:i3GEO.mapa.dialogo.corFundo()"
									},
									{
										id : "gradeCoordenadas",
										text : $trad("p10"),
										url : "javascript:i3GEO.mapa.dialogo.gradeCoord()"
									},
									{
										id : "mascara",
										text : $trad("mascara"),
										url : "javascript:i3GEO.mapa.dialogo.mascara()"
									},
									{
										id : "wkt2layer",
										text : $trad("wkt2layer"),
										url : "javascript:i3GEO.mapa.dialogo.wkt2layer()"
									},
									{
										id : "omenudataFerramentasCliqueGrafico",
										text : $trad("d23t"),
										url : "javascript:i3GEO.mapa.dialogo.cliqueGrafico()"
									}
								]
							]
						}
					},
					// temas
					{
						id : "omenudataFerramentas0b",
						text : $trad("a7"),
						submenu : {
							id : "camada",
							itemdata : [
								[
									{
										id : "omenudataFerramentas1b",
										text : $trad("t31"),
										url : "javascript:i3GEO.tema.dialogo.tabela()"
									},
									{
										id : "omenudataFerramentas2b",
										text : $trad("t23"),
										url : "javascript:i3GEO.tema.dialogo.procuraratrib()" //feramentas/busca
									},
									{
										id : "omenudataFerramentas3b",
										text : $trad("t25"),
										url : "javascript:i3GEO.tema.dialogo.toponimia()"
									},
									{
										id : "omenudataFerramentas4b",
										text : $trad("t27"),
										url : "javascript:i3GEO.tema.dialogo.etiquetas()"
									},
									{
										id : "omenudataFerramentas5b",
										text : $trad("t29"),
										url : "javascript:i3GEO.tema.dialogo.filtro()"
									},
									{
										id : "omenudataFerramentas6b",
										text : $trad("t33"),
										url : "javascript:i3GEO.tema.dialogo.editaLegenda()"
									},
									/*
									{
										id : "omenudataFerramentas7b",
										text : $trad("t42"),
										url : "javascript:i3GEO.tema.dialogo.cortina()"
									},
									*/
									{
										id : "omenudataFerramentas8b",
										text : $trad("t37a"),
										url : "javascript:i3GEO.tema.dialogo.graficotema()"
									},
									{
										id : "omenudataFerramentas9b",
										text : $trad("t37b"),
										url : "javascript:i3GEO.analise.dialogo.graficoInterativo1()"
									},
									{
										id : "omenudataFerramentasmmscale",
										text : $trad("variaEscala"),
										url : "javascript:i3GEO.tema.dialogo.mmscale()"
									},
									{
										id : "omenudataFerramentas3e",
										text : $trad("t49"),
										url : "javascript:i3GEO.tema.dialogo.tme()"
									},
									{
										id : "omenudataFerramentasStoryMap",
										text : "StoryMap",
										url : "javascript:i3GEO.tema.dialogo.storymap()"
									},
									{
										id : "omenudataFerramentasAnimagif",
										text : "Anima Gif",
										url : "javascript:i3GEO.tema.dialogo.animagif()"
									}
								]
							]
						}
					},
					// cartogramas
					{
						id : "omenudataFerramentas0e",
						text : $trad("x60"),
						submenu : {
							id : "subFerr3",
							itemdata : [
								[
									{
										id : "omenudataFerramentas1e",
										text : $trad("x57"),
										url : "javascript:i3GEO.mapa.dialogo.metaestat()"
									}
									/* TODO ver se reativa isso
									,
									{
										id : "omenudataFerramentas4e",
										text : $trad("x71"),
										url : "javascript:i3GEO.mapa.dialogo.metaestatListaMapas()"
									}
									*/
								]
							]
						}
					},
					// conexoes
					{
						id : "omenudataFerramentas0c",
						text : $trad("a15"),
						submenu : {
							id : "subFerr4",
							itemdata : [
								[
									{
										id : "omenudataFerramentas14",
										text : $trad("conexaoServicoGeo"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.conectaservico()"
									}
									/* TODO reativar?,
									{
										id : "omenudataFerramentas9i",
										text : $trad("x85"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.vinde()"
									}
									*/
								]
							]
						}
					},
					// upload
					{
						id : "omenudataFerramentas0d",
						text : 'Upload',
						submenu : {
							id : "subFerr5",
							itemdata : [
								[
									{
										id : "omenudataFerramentas13",
										text : $trad("uploadArquivoGeo"),
										url : "javascript:i3GEO.arvoreDeTemas.dialogo.uploadarquivo()"
									}
								]
							]
						}
					},
					//navegacao
					{
						id : "omenudataNavegacao1",
						text : $trad("x105"),
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
									/*
									{
										id : "omenudataNavegacao3",
										text : $trad("d9t"),
										url : "javascript:i3GEO.maparef.inicia()"
									},
									*/
									{
										id : "omenudataNavegacao4",
										text : $trad("d8t"),
										url : "javascript:i3GEO.mapa.dialogo.mostraExten()"
									},
									{
										id : "omenudataNavegacaoWiki",
										text : $trad("d11t"),
										url : "javascript:i3GEO.navega.dialogo.wiki()"
									},
									{
										id : "omenudataNavegacaoMetar",
										text : $trad("d29"),
										url : "javascript:i3GEO.navega.dialogo.metar()"
									},
									{
										id : "omenudataNavegacaoFotos",
										text : "Fotos",
										url : "javascript:i3GEO.navega.dialogo.buscaFotos()"
									},
									{
										id : "omenudataNavegacaoConfluence",
										text : $trad("d17t"),
										url : "javascript:i3GEO.navega.dialogo.confluence()"
									},
									/*
									{
										id : "omenudataNavegacaoLente",
										text : $trad("d18t"),
										url : "javascript:i3GEO.navega.lente.inicia()"
									},
									*/
									{
										id : "omenudataFerramentas7a",
										text : $trad("x64a"),
										url : "javascript:i3GEO.mapa.dialogo.congelaMapa();"
									},
									{
										id : "omenudataFerramentas8a",
										text : $trad("p12"),
										url : "javascript:i3GEO.mapa.dialogo.autoredesenha()"
									},
									{
										id : "omenudataFerramentas10",
										text : $trad("x93"),
										url : "javascript:i3GEO.mapa.dialogo.geolocal()"
									}
								]
							]
						}
					},
					{
						id : "omenudataBarraEdicao",
						text : $trad("u29"),
						url : "javascript:i3GEO.editor.inicia()",
						Interface : "openlayers" //so para a interface openlayers
					}
				]
			}
};