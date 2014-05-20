/*
Title: An&aacute;lise geogr&aacute;fica

i3GEO.analise

Fun&ccedil;oes de gera&ccedil;&atilde;o das analises e abertura dos dialogos das opcoes de analise espacial

Em i3GEO.analise.dialogo estao as funcoes de abertura dos dialogos

Arquivo:

i3geo/classesjs/classe_analise.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
i3GEO.analise = {
		//armazena os pontos coletados nas funcoes de medicao de area e distancia
		//@TODO remover apos concluir a refatoracao do codigo
		pontosdistobj: {},
		/*
	Classe: i3GEO.analise.dialogo

	Abre as telas de dialogo das opcoes de analise

	Exemplo:

	Para abrir a mensagem de dialogo de geracao de buffer, utilize

	i3GEO.analise.dialogo.buffer()
		 */
		dialogo:{
			/*
		Function: saiku

		Abre a janela de dialogo da ferramenta SAIKU
			 */
			saiku: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.saiku()","saiku","saiku");
			},
			/*
		Function: graficoInterativo

		Abre a janela de dialogo da ferramenta graficointerativo versao flash
			 */
			graficoInterativo: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.graficoInterativo()","graficointerativo","graficointerativo");
			},
			/*
		Function: graficoInterativo1

		Abre a janela de dialogo da ferramenta graficointerativo
			 */
			graficoInterativo1: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.graficoInterativo1()","graficointerativo1","graficointerativo1");
			},
			/*
		Function: linhaDoTempo

		Abre a janela de dialogo da ferramenta linhadotempo
			 */
			linhaDoTempo: function(){
				if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.dialogo.linhaDoTempo()");}
				i3GEO.janela.cria("450px","350px",i3GEO.configura.locaplic+"/ferramentas/linhadotempo/index.php","","","Linha do tempo <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=88' >&nbsp;&nbsp;&nbsp;</a>");
				atualizaLinhaDoTempo = function(){
					var doc = "", ifr = "";
					try{
						ifr = $i("wdocai");
						if (navn){
							if (ifr){
								doc = ifr.contentDocument;
							}
						}
						else{
							if(document.frames("wdocai")){
								doc = document.frames("wdocai").document;
							}
						}
						doc.getElementById("tl") ? window.parent.wdocai.carregaDados() : i3GEO.eventos.NAVEGAMAPA.remove("atualizaLinhaDoTempo()");
					}
					catch(e){
						i3GEO.eventos.NAVEGAMAPA.remove("atualizaLinhaDoTempo()");
						if(typeof(console) !== 'undefined'){console.error("i3GEO.analise.linhaDoTempo "+e);}
					}
				};
				if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaLinhaDoTempo()") < 0)
				{i3GEO.eventos.NAVEGAMAPA.push("atualizaLinhaDoTempo()");}
				var ifr = $i("wdocai");
				//ifr.style.height = "75%";
				ifr.style.width = "100%";
			},
			/*
		Function: perfil

		Abre a janela de dialogo da ferramenta perfil
			 */
			perfil: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.perfil()","perfil","perfil");
			},
			/*
		Function: gradePontos

		Abre a janela de dialogo da ferramenta gradepontos
			 */
			gradePontos: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradePontos()","gradepontos","gradeDePontos");
			},
			/*
		Function: gradePol

		Abre a janela de dialogo da ferramenta gradepol
			 */
			gradePol: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradePol()","gradepol","gradeDePoligonos");
			},
			/*
		Function: gradeHex

		Abre a janela de dialogo da ferramenta gradehex
			 */
			gradeHex: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.gradeHex()","gradehex","gradeDeHex");
			},
			/*
		Function: analisaGeometrias

		Abre a janela de dialogo da ferramenta analisageometrias
			 */
			analisaGeometrias: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.analisaGeometrias()","analisageometrias","analisaGeometrias");
			},
			/*
		Function: pontosdistri

		Abre a janela de dialogo da ferramenta pontosdistri
			 */
			pontosdistri: function(){
				i3GEO.parametros.r === "nao" ? i3GEO.janela.tempoMsg($trad("x22")) : i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.pontosdistri()","pontosdistri","pontosDistri");
			},
			/*
		Function: pontoempoligono

		Abre a janela de dialogo da ferramenta pontoempoligono
			 */
			pontoempoligono: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.pontoempoligono()","pontoempoligono","pontoEmPoligono");
			},
			/*
		Function: centromassa

		Abre a janela de dialogo da ferramenta centro medio
			 */
			centromassa: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.centromassa()","centromassa","centromassa");
			},
			/*
		Function: nptPol

		Abre a janela de dialogo da ferramenta nptpol
			 */
			nptPol: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.nptPol()","nptpol","nptpol");
			},
			/*
		Function: buffer

		Abre a janela de dialogo da ferramenta buffer
			 */
			buffer: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.buffer()","buffer","buffer");
			},
			/*
		Function: distanciaptpt

		Abre a janela de dialogo da ferramenta distanciaptpt
			 */
			distanciaptpt: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.distanciaptpt()","distanciaptpt","distanciaptpt");
			},
			/*
		Function: centroide

		Abre a janela de dialogo da ferramenta centroide
			 */
			centroide: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.centroide()","centroide","centroide");
			},
			/*
		Function: dissolve

		Abre a janela de dialogo da ferramenta dissolve
			 */
			dissolve: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.dissolve()","dissolve","dissolve");
			},
			/*
		Function: agrupaElementos

		Abre a janela de dialogo da ferramenta agrupaelementos
			 */
			agrupaElementos: function(){
				i3GEO.util.dialogoFerramenta("i3GEO.analise.dialogo.agrupaElementos()","agrupaelementos","agrupaElementos");
			}
		},
		/**
		 * i3GEO.analise.medeDistancia
		 * Ativa e controla a opcao de medicao de distancias.
		 * A medida e feita quando o usuario clica no mapa com esta opcao ativa
		 * Quando o botao e acionado, abre-se a janela que mostra o resultado da medida, o icone que segue o mouse e alterado.
		 * Para mostrar o resultado do calculo, e incluido um div especifico.
		 */
		medeDistancia:{
			/**
			 * Armazena os pontos clicados para realizar os calculos
			 */
			pontos: {},
			/**
			 * Inicia a operacao de medicao, abrindo a janela de resultados e criando os componentes necessorios
			 * Sao registrados os eventos de clique sobre o mapa e fechamento da janela de resultados
			 */
			inicia: function(){
				if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.medeDistancia.inicia()");}
				i3GEO.eventos.cliquePerm.desativa();
				//@TODO remover apos concluir a refatoracao do codigo
				i3GEO.analise.pontosdistobj = {
						xpt: [],
						ypt: [],
						dist: [],
						distV: [],
						xtela: [],
						ytela: [],
						ximg: [],
						yimg: [],
						linhas: [],
						linhastemp: []
				};
				i3GEO.analise.medeDistancia.criaJanela();
				i3GEO.analise.medeDistancia[i3GEO.Interface["ATUAL"]].inicia();
			},
			/**
			 * Cria a janela para mostrar os resultados da medicao
			 */
			criaJanela: function(){
				var novoel,ins,imagemxy,janela;
				if (!$i("mostradistancia")){
					novoel = document.createElement("div");
					novoel.id = "mostradistancia";
					ins = '<div class="hd" style="font-size:11px">&nbsp;Dist&acirc;ncia aproximada <a class=ajuda_usuario target=_blank href="'+i3GEO.configura.locaplic+'/ajuda_usuario.php?idcategoria=6&idajuda=50" >&nbsp;&nbsp;&nbsp;</a></div>' +
					'<div class="bd" style="text-align:left;padding:3px;" >' +
					'<div style="text-align:left;padding:3px;" id="mostradistancia_calculo" ></div>' +
					'<div style="text-align:left;padding:3px;" id="mostradistancia_calculo_movel" ></div>' +
					'<div style="text-align:left;font-size:10px" >' +
					'<span style="color:navy;cursor:pointer;text-align:left;" >' +
					'<table class=lista7 ><tr><td><input style="cursor:pointer" type="checkbox" id="pararraios" checked /></td><td>Raios</td><td>&nbsp;</td>' +
					'<td>' +
					'<input style="cursor:pointer" type="checkbox" id="parartextos" checked />' +
					'</td><td>Textos<td>' +
					'<td>&nbsp;Estilo:</td><td>'+i3GEO.desenho.caixaEstilos()+'</td>' +
					'<td>&nbsp;<input id=i3GEObotaoPerfil size="22" type="button" value="perfil"></td>' +
					'</tr></table></span>' +
					'</div>' +
					'</div>';
					novoel.innerHTML = ins;
					novoel.style.borderColor="gray";
					document.body.appendChild(novoel);
					janela = new YAHOO.widget.Panel("mostradistancia", {iframe:true,width:"330px",fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
					YAHOO.i3GEO.janela.manager.register(janela);
					janela.render();
					YAHOO.util.Event.addListener(janela.close, "click", i3GEO.analise.medeDistancia.fechaJanela);
				}
				else{
					i3GEO.util.defineValor("mostradistancia_calculo","innerHTML","");
					janela = YAHOO.i3GEO.janela.manager.find("mostradistancia");
				}
				janela.show();
				imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				janela.moveTo(imagemxy[0]+150,imagemxy[1]);
				//
				//botao que abre a ferramenta de calculo de perfis.
				//pontosdistobj contem as coordenadas dos pontos
				//
				new YAHOO.widget.Button(
						"i3GEObotaoPerfil",
						{onclick:{fn: function(){
							var js = i3GEO.configura.locaplic+"/ferramentas/perfil/index.js";
							i3GEO.util.scriptTag(js,"i3GEOF.perfil.criaJanelaFlutuante(i3GEO.analise.pontosdistobj)","i3GEOF.perfil_script");
						}}}
				);
			},
			/**
			 *Fecha a janela e os elementos graficos criados para a ferramenta de medicao
			 *Chama a funcao de cada interface que complementam o processo de fechamento da janela
			 */
			fechaJanela: function(){
				var janela;
				i3GEO.eventos.cliquePerm.ativa();
				janela = YAHOO.i3GEO.janela.manager.find("mostradistancia");
				if(janela){
					YAHOO.i3GEO.janela.manager.remove(janela);
					janela.destroy();
				}
				i3GEO.barraDeBotoes.ativaIcone("pointer");
				i3GEO.analise.medeDistancia[i3GEO.Interface["ATUAL"]].fechaJanela();
			},
			/**
			 * Funcoes especificas da interface openlayers
			 */
			openlayers:{
				/**
				 * Inicializa o processo
				 * Cria a variavel para guardar os pontos
				 * Executa a funcao de inicializacao do desenho, que cria o layer para receber os graficos
				 */
				inicia: function(){
					var linha,
					estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
					controle = i3geoOL.getControlsBy("id","i3GeoMedeDistancia");
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEO.analise.medeDistancia.pontos = {
							xpt: [],
							ypt: [],
							dist: []
					};
					if(controle.length === 0){
						linha = new OpenLayers.Control.DrawFeature(
								i3GEO.desenho.layergrafico,
								OpenLayers.Handler.Path,
								{
									autoActivate: true,
									id: "i3GeoMedeDistancia",
									type: OpenLayers.Control.TYPE_TOOL,
									callbacks:{
										done: function(feature){
											var f = new OpenLayers.Feature.Vector(
													feature,
													{
														origem: "medeDistancia"
													},
													{
														graphicName: "square",
														pointRadius: 10,
														graphicOpacity: 1,
														strokeWidth: estilo.linewidth,
														strokeColor: estilo.linecolor
													}
											);
											i3GEO.desenho.layergrafico.addFeatures([f]);
											if(i3GEO.Interface){
												i3GEO.Interface.openlayers.sobeLayersGraficos();
											}
											i3GEO.analise.medeDistancia.openlayers.mostraParcial(0,0,0);
											i3GEO.analise.medeDistancia.openlayers.inicia();
										},
										modify: function(point){
											var n,x1,y1,x2,y2,trecho,parcial,direcao;
											n = i3GEO.analise.medeDistancia.pontos.ypt.length;
											if(n > 0){
												x1 = i3GEO.analise.medeDistancia.pontos.xpt[n-1];
												y1 = i3GEO.analise.medeDistancia.pontos.ypt[n-1];
												x2 = point.x;
												y2 = point.y;
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
													x2 = temp[2];
													y2 = temp[3];
												}
												trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
												parcial = i3GEO.analise.medeDistancia.openlayers.somaDist();
												direcao = i3GEO.calculo.direcao(x1,y1,x2,y2);
												i3GEO.analise.medeDistancia.openlayers.mostraParcial(trecho,parcial,direcao);
											}
										},
										point: function(point){
											var n,x1,y1,x2,y2,trecho,temp,circ,label,raio,
											//registra os pontos e calcula a distancia
											total = 0;
											i3GEO.analise.medeDistancia.pontos.xpt.push(point.x);
											i3GEO.analise.medeDistancia.pontos.ypt.push(point.y);
											n = i3GEO.analise.medeDistancia.pontos.ypt.length;
											if(n > 1){
												x1 = i3GEO.analise.medeDistancia.pontos.xpt[n-2];
												y1 = i3GEO.analise.medeDistancia.pontos.ypt[n-2];
												x2 = point.x;
												y2 = point.y;
												raio = point.distanceTo(new OpenLayers.Geometry.Point(x1,y1));
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
													x2 = temp[2];
													y2 = temp[3];
												}
												trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
												i3GEO.analise.medeDistancia.pontos.dist.push(trecho);
												total = i3GEO.analise.medeDistancia.openlayers.somaDist();
												i3GEO.analise.medeDistancia.openlayers.mostraTotal(trecho,total);
												//raio
												if($i("pararraios") && $i("pararraios").checked === true ){
													circ = new OpenLayers.Feature.Vector(
															OpenLayers.Geometry.Polygon.createRegularPolygon(
																	new OpenLayers.Geometry.Point(x1,y1),
																	raio,
																	30
															),
															{
																origem: "medeDistanciaExcluir"
															},
															{
																fill: false,
																strokeColor: estilo.circcolor,
																strokeWidth: 1
															}
													);
													i3GEO.desenho.layergrafico.addFeatures([circ]);
												}
												//desenha ponto
												if($i("parartextos") && $i("parartextos").checked === true ){
													label = new OpenLayers.Feature.Vector(
															new OpenLayers.Geometry.Point(point.x,point.y),
															{
																origem: "medeDistanciaExcluir"
															},
															{
																graphicName: "square",
																pointRadius: 3,
																strokeColor: "black",
																graphicOpacity: 1,
																strokeWidth: 1,
																fillColor: "white",
																label: trecho.toFixed(3),
																labelAlign: "rb",
																fontColor: estilo.textcolor,
																fontSize: 12,
																fontWeight: "bold"
															}
													);
													i3GEO.desenho.layergrafico.addFeatures([label]);
												}
											}
										}
									}
								}
						);
						i3geoOL.addControl(linha);
					}
				},
				/**
				 * Soma os valores de distancia guardados em pontos.dist
				 */
				somaDist: function(){
					var n,i,
					total = 0;
					n = i3GEO.analise.medeDistancia.pontos.dist.length;
					for(i=0;i<n;i++){
						total += i3GEO.analise.medeDistancia.pontos.dist[i];
					}
					return total;
				},
				/**
				 * Fecha a janela que mostra os dados
				 * Pergunta ao usuario se os graficos devem ser removidos
				 * Os graficos sao marcados com o atributo "origem"
				 * Os raios e pontos sao sempre removidos
				 */
				fechaJanela: function(){
					var temp,
					controle = i3geoOL.getControlsBy("id","i3GeoMedeDistancia"),
					f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem","medeDistancia");
					if(controle.length > 0){
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
					if(f && f.length > 0){
						temp = window.confirm($trad("x94"));
						if(temp){
							i3GEO.desenho.layergrafico.destroyFeatures(f);
						}
					}
					f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem","medeDistanciaExcluir");
					if(f && f.length > 0){
						i3GEO.desenho.layergrafico.destroyFeatures(f);
					}
				},
				/**
				 * Mostra a totalizacao das linhas ja digitalizadas
				 */
				mostraTotal: function(trecho,total){
					var mostra = $i("mostradistancia_calculo"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("x96")+":</b> "+total.toFixed(3)+" km"+
						"<br><b>"+$trad("x96")+":</b> "+(total*1000).toFixed(2)+" m"+
						"<br>"+$trad("x25")+": "+i3GEO.calculo.metododistancia;
						mostra.innerHTML = texto;
					}
				},
				/**
				 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
				 */
				mostraParcial: function(trecho,parcial,direcao){
					var mostra = $i("mostradistancia_calculo_movel"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("x95")+":</b> "+trecho.toFixed(3)+" km"+
						"<br><b>"+$trad("x97")+":</b> "+(parcial + trecho).toFixed(3)+" km" +
						"<br><b>"+$trad("x23")+" (DMS):</b> "+direcao.toFixed(4);
						mostra.innerHTML = texto;
					}
				}
			},
			googlemaps:{
				/**
				 * Inicializa o processo
				 * Cria a variavel para guardar os pontos
				 * Executa a funcao de inicializacao do desenho, que cria o layer para receber os graficos
				 */
				inicia: function(){
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GeoMap.setOptions({disableDoubleClickZoom:true});
					i3GeoMap.setOptions({draggableCursor:'crosshair'});
					var evtdblclick = null,evtclick = null,evtmousemove = null,
					pontos = {
							xpt: [],
							ypt: [],
							dist: [],
							mvcLine: new google.maps.MVCArray(),
							mvcMarkers: new google.maps.MVCArray(),
							line: null,
							polygon: null
					},
					termina = function(){
						google.maps.event.removeListener(evtdblclick);
						google.maps.event.removeListener(evtclick);
						google.maps.event.removeListener(evtmousemove);
						pontos.line.setOptions({clickable: true});
						google.maps.event.addListener(pontos.line, 'click', function(shape) {
							if(shape.setEditable){
								shape.setEditable(!shape.editable);
							}
						});
						if(pontos){
							i3GEO.desenho.googlemaps.shapes.push(pontos.mvcLine);
							i3GEO.desenho.googlemaps.shapes.push(pontos.line);
							pontos = null;
						}
					};
					evtclick = google.maps.event.addListener(i3GeoMap, "click", function(evt) {
						var x1,x2,y1,y2,trecho=0,total,n,
						estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao];
						// When the map is clicked, pass the LatLng obect to the measureAdd function
						pontos.mvcLine.push(evt.latLng);
						pontos.xpt.push(evt.latLng.lng());
						pontos.ypt.push(evt.latLng.lat());
						n = pontos.xpt.length;
						//desenha um circulo
						if (pontos.mvcLine.getLength() > 1) {
							x1 = pontos.xpt[n-2];
							y1 = pontos.ypt[n-2];
							x2 = evt.latLng.lng();
							y2 = evt.latLng.lat();
							//raio = google.maps.geometry.spherical.computeDistanceBetween(evt.latLng,new google.maps.LatLng(y1,x1))
							trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
							pontos.dist.push(trecho);
							total = i3GEO.analise.medeDistancia.googlemaps.somaDist(pontos);
							i3GEO.analise.medeDistancia.googlemaps.mostraTotal(trecho,total);
							if($i("pararraios") && $i("pararraios").checked === true ){
								i3GEO.desenho.googlemaps.shapes.push(
										new google.maps.Circle({
											map: i3GeoMap,
											fillOpacity: 0,
											clickable: false,
											strokeColor: estilo.circcolor,
											strokeOpacity: 1,
											strokeWeight: estilo.linewidth,
											center: new google.maps.LatLng(y1,x1),
											radius: trecho*1000,
											origem: "medeDistanciaExcluir"
										})
								);
							}
						}
						//desenha uma marca no ponto
						if($i("parartextos") && $i("parartextos").checked === true ){
							i3GEO.desenho.googlemaps.shapes.push(
									new google.maps.Marker({
										map: i3GeoMap,
										fillOpacity: 0,
										clickable: false,
										position:evt.latLng,
										icon: {
											path: google.maps.SymbolPath.CIRCLE,
											scale: 2.5,
											strokeColor: "#ffffff",
											title: trecho.toFixed(0)+" km"
										},
										origem: "medeDistanciaExcluir"
									})
							);
						}
						//mais um ponto para criar uma linha movel
						pontos.mvcLine.push(evt.latLng);
					});
					evtmousemove = google.maps.event.addListener(i3GeoMap, "mousemove", function(evt) {
						if(!$i("mostradistancia_calculo")){
							termina.call();
							return;
						}
						var x1,y1,x2,y2,direcao,parcial,
						estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
						n = pontos.xpt.length;

						// If there is more than one vertex on the line
						if (pontos.mvcLine.getLength() > 0) {
							// If the line hasn't been created yet
							if (!pontos.line) {
								// Create the line (google.maps.Polyline)
								pontos.line = new google.maps.Polyline({
									map: i3GeoMap,
									clickable: false,
									strokeColor: estilo.linecolor,
									strokeOpacity: 1,
									strokeWeight: estilo.linewidth,
									path:pontos.mvcLine,
									origem: "medeDistancia"
								});
							}
							pontos.mvcLine.pop();
							pontos.mvcLine.push(evt.latLng);
							parcial = i3GEO.analise.medeDistancia.googlemaps.somaDist(pontos);
							x1 = pontos.xpt[n-1];
							y1 = pontos.ypt[n-1];
							x2 = evt.latLng.lng();
							y2 = evt.latLng.lat();
							//raio = google.maps.geometry.spherical.computeDistanceBetween(evt.latLng,new google.maps.LatLng(y1,x1))
							trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);							
							direcao = i3GEO.calculo.direcao(x1,y1,x2,y2);
							i3GEO.analise.medeDistancia.googlemaps.mostraParcial(trecho,parcial,direcao);
						}
					});
					evtdblclick = google.maps.event.addListener(i3GeoMap, "dblclick", function(evt) {
						termina.call();
					});
				},
				/**
				 * Soma os valores de distancia guardados em pontos.dist
				 */
				somaDist: function(pontos){
					var n,i,
					total = 0;
					n = pontos.dist.length;
					for(i=0;i<n;i++){
						total += pontos.dist[i];
					}
					return total;
				},
				/**
				 * Fecha a janela que mostra os dados
				 * Pergunta ao usuario se os graficos devem ser removidos
				 * Os graficos sao marcados com o atributo "origem"
				 * Os raios e pontos sao sempre removidos
				 */
				fechaJanela: function(){
					i3GeoMap.setOptions({disableDoubleClickZoom:false});
					i3GeoMap.setOptions({draggableCursor:undefined});
					var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem","medeDistancia");
					if(f && f.length > 0){
						temp = window.confirm($trad("x94"));
						if(temp){
							i3GEO.desenho.googlemaps.destroyFeatures(f);
						}
					}
					f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem","medeDistanciaExcluir");
					if(f && f.length > 0){
						i3GEO.desenho.googlemaps.destroyFeatures(f);
					}
				},
				/**
				 * Mostra a totalizacao das linhas ja digitalizadas
				 */
				mostraTotal: function(trecho,total){
					var mostra = $i("mostradistancia_calculo"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("x96")+":</b> "+total.toFixed(3)+" km"+
						"<br><b>"+$trad("x96")+":</b> "+(total*1000).toFixed(2)+" m"+
						"<br>"+$trad("x25")+": "+i3GEO.calculo.metododistancia;
						mostra.innerHTML = texto;
					}
				},
				/**
				 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
				 */
				mostraParcial: function(trecho,parcial,direcao){
					var mostra = $i("mostradistancia_calculo_movel"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("x95")+":</b> "+trecho.toFixed(3)+" km"+
						"<br><b>"+$trad("x97")+":</b> "+(parcial + trecho).toFixed(3)+" km" +
						"<br><b>"+$trad("x23")+" (DMS):</b> "+direcao.toFixed(4);
						mostra.innerHTML = texto;
					}
				}
			},
			googleearth:{
				inicia: function(){
					if (g_tipoacao !== "mede"){
						if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeDistancia.clique()") < 0)
						{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeDistancia.clique()");}
						if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeDistancia.movimento()") < 0)
						{i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeDistancia.movimento()");}
						if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.analise.medeDistancia.fechaJanela()") < 0)
						{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.analise.medeDistancia.fechaJanela()");}
						$i("mostradistancia").style.display="block";
						g_tipoacao = "mede";
					}
					else{
						var Dom = YAHOO.util.Dom;
						Dom.setStyle("mostradistancia","display","none");
						Dom.setStyle("pontosins","display","none");
					}
				},
				fechaJanela: function(){

				}
			},
		},
		/*
	i3GEO.analise.medeArea

	Ativa e controla a opcao de medicao de area.

	A medida e feita quando o usuario clica no mapa com esta opcao ativa

	Quando o botao e acionado, abre-se a janela que mostra o resultado da medida, o icone que segue o mouse e alterado.

	Para mostrar o resultado do calculo, e incluido um div especifico.
		 */
		medeArea:{
			/**
			 * Armazena os pontos clicados para realizar os calculos
			 */
			pontos: {},
			/*
		Function: inicia

		Inicia a operacao de medicao, abrindo a janela de resultados e criando os componentes necessarios

		Sao registrados os eventos de clique sobre o mapa e fechamento da janela de resultados
			 */
			inicia: function(){
				if(typeof(console) !== 'undefined'){console.info("i3GEO.analise.medeDistancia.inicia()");}
				i3GEO.eventos.cliquePerm.desativa();
				i3GEO.analise.medeArea.criaJanela();
				i3GEO.analise.medeArea[i3GEO.Interface["ATUAL"]].inicia();
			},
			/*
		Cria a janela para mostrar os resultados da medicao
			 */
			criaJanela: function(){
				var novoel,ins,imagemxy,janela;
				if (!$i("mostraarea")){
					novoel = document.createElement("div");
					novoel.id = "mostraarea";
					ins = '<div class="hd" >&Aacute;rea aproximada <a class=ajuda_usuario target=_blank href="'+i3GEO.configura.locaplic+'"/ajuda_usuario.php?idcategoria=6&idajuda=51" >&nbsp;&nbsp;&nbsp;</a></div>' +
					'<div class="bd" style="text-align:left;padding:3px;font-size:10px" >' +
					'Estilo: '+i3GEO.desenho.caixaEstilos()+'<br>' +
					'<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo" ></div>' +
					'<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo_parcial" ></div>' +
					'</div>';
					novoel.innerHTML = ins;
					novoel.style.borderColor="gray";
					document.body.appendChild(novoel);
					janela = new YAHOO.widget.Panel("mostraarea", {width:"220px",fixedcenter: false, constraintoviewport: true, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
					YAHOO.i3GEO.janela.manager.register(janela);
					janela.render();
					YAHOO.util.Event.addListener(janela.close, "click", i3GEO.analise.medeArea.fechaJanela);
				}
				else{
					janela = YAHOO.i3GEO.janela.manager.find("mostraarea");
				}
				janela.show();
				imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
				janela.moveTo(imagemxy[0]+150,imagemxy[1]);
			},
			/*
		Function: fechaJanela

		Fecha a janela e os elementos graficos criados para a ferramenta de medicao
			 */
			fechaJanela: function(){
				var janela;
				i3GEO.eventos.cliquePerm.ativa();
				janela = YAHOO.i3GEO.janela.manager.find("mostraarea");
				if(janela){
					YAHOO.i3GEO.janela.manager.remove(janela);
					janela.destroy();
				}
				i3GEO.barraDeBotoes.ativaIcone("pointer");
				i3GEO.analise.medeArea[i3GEO.Interface["ATUAL"]].fechaJanela();
			},
			/**
			 * Funcoes especificas da interface openlayers
			 */
			openlayers:{
				/**
				 * Inicializa o processo
				 * Cria a variavel para guardar os pontos
				 * Executa a funcao de inicializacao do desenho, que cria o layer para receber os graficos
				 */
				inicia: function(){
					var poligono,
					estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
					controle = i3geoOL.getControlsBy("id","i3GeoMedeArea");
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GEO.analise.medeArea.pontos = {
							xpt: [],
							ypt: [],
							dist: []
					};
					if(controle.length === 0){
						poligono = new OpenLayers.Control.DrawFeature(
								i3GEO.desenho.layergrafico,
								OpenLayers.Handler.Polygon,
								{
									autoActivate: true,
									id: "i3GeoMedeArea",
									type: OpenLayers.Control.TYPE_TOOL,
									callbacks:{
										done: function(feature){
											var f = new OpenLayers.Feature.Vector(
													feature,
													{
														origem: "medeArea"
													},
													{
														graphicName: "square",
														pointRadius: 10,
														graphicOpacity: 1,
														strokeWidth: estilo.linewidth,
														strokeColor: estilo.linecolor,
														fillColor: estilo.fillcolor,
														fillOpacity: 0.3
													}
											);
											i3GEO.desenho.layergrafico.addFeatures([f]);
											if(i3GEO.Interface){
												i3GEO.Interface.openlayers.sobeLayersGraficos();
											}
											i3GEO.analise.medeArea.openlayers.mostraParcial(0,0,0,0);
											i3GEO.analise.medeArea.openlayers.inicia();
										},
										modify: function(point,poligono){
											var n,x1,y1,x2,y2,
											trecho = 0,
											per = 0,
											direcao = 0,
											area = 0,
											proj = new OpenLayers.Projection("EPSG:4326");
											n = i3GEO.analise.medeArea.pontos.ypt.length;
											if(n > 1){
												x1 = i3GEO.analise.medeArea.pontos.xpt[n-1];
												y1 = i3GEO.analise.medeArea.pontos.ypt[n-1];
												x2 = point.x;
												y2 = point.y;
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
													x2 = temp[2];
													y2 = temp[3];
													proj = new OpenLayers.Projection("EPSG:900913");
												}
												trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
												direcao = i3GEO.calculo.direcao(x1,y1,x2,y2);
												per = i3GEO.analise.medeArea.openlayers.somaDist();
												//soma ate o primeiro ponto
												x1 = i3GEO.analise.medeArea.pontos.xpt[0];
												y1 = i3GEO.analise.medeArea.pontos.ypt[0];
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
												}
												per += i3GEO.calculo.distancia(x1,y1,x2,y2);
												area = poligono.geometry.getGeodesicArea(proj);
												i3GEO.analise.medeArea.openlayers.mostraParcial(trecho,per,area,direcao);
											}
										},
										point: function(point,poligono){
											var n,x1,y1,x2,y2,temp,label,
											//registra os pontos e calcula a distancia
											per = 0,
											trecho = 0,
											area = 0,
											proj = new OpenLayers.Projection("EPSG:4326");
											i3GEO.analise.medeArea.pontos.xpt.push(point.x);
											i3GEO.analise.medeArea.pontos.ypt.push(point.y);
											n = i3GEO.analise.medeArea.pontos.ypt.length;
											if(n > 1){
												x1 = i3GEO.analise.medeArea.pontos.xpt[n-2];
												y1 = i3GEO.analise.medeArea.pontos.ypt[n-2];
												x2 = point.x;
												y2 = point.y;
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
													x2 = temp[2];
													y2 = temp[3];
													proj = new OpenLayers.Projection("EPSG:900913");
												}
												trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
												i3GEO.analise.medeArea.pontos.dist.push(trecho);
												per = i3GEO.analise.medeArea.openlayers.somaDist();
												//soma ate o primeiro ponto
												x1 = i3GEO.analise.medeArea.pontos.xpt[0];
												y1 = i3GEO.analise.medeArea.pontos.ypt[0];
												//projeta
												if(i3GEO.Interface.openlayers.googleLike){
													temp = i3GEO.util.extOSM2Geo(x1+" "+y1+" "+x2+" "+y2);
													temp = temp.split(" ");
													x1 = temp[0];
													y1 = temp[1];
												}
												per += i3GEO.calculo.distancia(x1,y1,x2,y2);
												//desenha ponto
												//if($i("parartextos") && $i("parartextos").checked === true ){
												label = new OpenLayers.Feature.Vector(
														new OpenLayers.Geometry.Point(point.x,point.y),
														{
															origem: "medeAreaExcluir"
														},
														{
															graphicName: "square",
															pointRadius: 3,
															strokeColor: "black",
															graphicOpacity: 1,
															strokeWidth: 1,
															fillColor: "white",
															label: trecho.toFixed(3),
															labelAlign: "rb",
															fontColor: estilo.textcolor,
															fontSize: 12,
															fontWeight: "bold"
														}
												);
												i3GEO.desenho.layergrafico.addFeatures([label]);
												if(n > 2){
													area = poligono.getGeodesicArea(proj);
												}
											}
											i3GEO.analise.medeArea.openlayers.mostraTotal(per,area);
										}
									}
								}
						);
						i3geoOL.addControl(poligono);
					}
				},
				/**
				 * Soma os valores de distancia guardados em pontos.dist
				 */
				somaDist: function(){
					var n,i,
					total = 0;
					n = i3GEO.analise.medeArea.pontos.dist.length;
					for(i=0;i<n;i++){
						total += i3GEO.analise.medeArea.pontos.dist[i];
					}
					return total;
				},
				/**
				 * Fecha a janela que mostra os dados
				 * Pergunta ao usuario se os graficos devem ser removidos
				 * Os graficos sao marcados com o atributo "origem"
				 * Os raios e pontos sao sempre removidos
				 */
				fechaJanela: function(){
					var temp,
					controle = i3geoOL.getControlsBy("id","i3GeoMedeArea"),
					f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem","medeArea");
					if(controle.length > 0){
						controle[0].deactivate();
						i3geoOL.removeControl(controle[0]);
					}
					if(f && f.length > 0){
						temp = window.confirm($trad("x94"));
						if(temp){
							i3GEO.desenho.layergrafico.destroyFeatures(f);
						}
					}
					f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem","medeAreaExcluir");
					if(f && f.length > 0){
						i3GEO.desenho.layergrafico.destroyFeatures(f);
					}
				},
				/**
				 * Mostra a totalizacao das linhas ja digitalizadas
				 */
				mostraTotal: function(per,area){
					var mostra = $i("mostraarea_calculo"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("d21at")+":</b> "+(area/1000000).toFixed(3)+" km2"+
						"<br><b>"+$trad("d21at")+":</b> "+(area/10000).toFixed(2)+" ha"+
						"<br><b>"+$trad("x98")+":</b> "+(per).toFixed(2)+" km"+
						"<br>"+$trad("x25")+": "+i3GEO.calculo.metododistancia;
						mostra.innerHTML = texto;
					}
				},
				/**
				 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
				 */
				mostraParcial: function(trecho,per,area,direcao){
					var mostra = $i("mostraarea_calculo_parcial"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("d21at")+":</b> "+(area/1000000).toFixed(3)+" km2"+
						"<br><b>"+$trad("d21at")+":</b> "+(area/10000).toFixed(2)+" ha"+
						"<br><b>"+$trad("x95")+":</b> "+trecho.toFixed(3)+" km"+
						"<br><b>"+$trad("x98")+":</b> "+(per).toFixed(3)+" km" +
						"<br><b>"+$trad("x23")+" (DMS):</b> "+direcao.toFixed(4);
						mostra.innerHTML = texto;
					}
				}
			},
			googlemaps: {
				/**
				 * Inicializa o processo
				 * Cria a variavel para guardar os pontos
				 * Executa a funcao de inicializacao do desenho, que cria o layer para receber os graficos
				 */
				inicia: function(){
					if(!google.maps.geometry){
						alert($trad("x99"));
						return;
					}
					i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
					i3GeoMap.setOptions({disableDoubleClickZoom:true});
					i3GeoMap.setOptions({draggableCursor:'crosshair'});
					var evtdblclick = null,
					evtclick = null,
					evtmousemove = null,
					pontos = {
							xpt: [],
							ypt: [],
							dist: [],
							mvcLine: new google.maps.MVCArray(),
							mvcMarkers: new google.maps.MVCArray(),
							line: null,
							polygon: null
					},
					termina = function(){
						google.maps.event.removeListener(evtdblclick);
						google.maps.event.removeListener(evtclick);
						google.maps.event.removeListener(evtmousemove);
						pontos.line.setOptions({clickable: true});
						google.maps.event.addListener(pontos.line, 'click', function(shape) {
							if(shape.setEditable){
								shape.setEditable(!shape.editable);
							}
						});
						if(pontos){
							i3GEO.desenho.googlemaps.shapes.push(pontos.mvcLine);
							i3GEO.desenho.googlemaps.shapes.push(pontos.line);
							pontos = null;
						}
					};
					evtclick = google.maps.event.addListener(i3GeoMap, "click", function(evt) {
						var area=0,per;
						// When the map is clicked, pass the LatLng obect to the measureAdd function
						pontos.mvcLine.push(evt.latLng);
						pontos.xpt.push(evt.latLng.lng());
						pontos.ypt.push(evt.latLng.lat());
						//desenha um circulo
						if (pontos.mvcLine.getLength() > 0) {
							per = google.maps.geometry.spherical.computeLength(pontos.mvcLine);
							area = google.maps.geometry.spherical.computeArea(pontos.mvcLine);
							i3GEO.analise.medeArea.googlemaps.mostraTotal(per,area);
						}
						//desenha uma marca no ponto
						i3GEO.desenho.googlemaps.shapes.push(
								new google.maps.Marker({
									map: i3GeoMap,
									fillOpacity: 0,
									clickable: false,
									position:evt.latLng,
									icon: {
										path: google.maps.SymbolPath.CIRCLE,
										scale: 2.5,
										strokeColor: "#ffffff"
									},
									origem: "medeAreaExcluir"
								})
						);
						//mais um ponto para criar uma linha movel
						pontos.mvcLine.push(evt.latLng);
					});
					evtmousemove = google.maps.event.addListener(i3GeoMap, "mousemove", function(evt) {
						if(!$i("mostraarea_calculo")){
							termina.call();
							return;
						}
						var x1,y1,x2,y2,direcao,per,area,
						estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao],
						n = pontos.xpt.length;

						// If there is more than one vertex on the line
						if (pontos.mvcLine.getLength() > 0) {
							// If the line hasn't been created yet
							if (!pontos.line) {
								// Create the line (google.maps.Polyline)
								pontos.line = new google.maps.Polygon({
									map: i3GeoMap,
									clickable: false,
									strokeColor: estilo.linecolor,
									strokeOpacity: 1,
									strokeWeight: estilo.linewidth,
									path:pontos.mvcLine,
									origem: "medeArea"
								});
							}
							pontos.mvcLine.pop();
							pontos.mvcLine.push(evt.latLng);
							per = google.maps.geometry.spherical.computeLength(pontos.mvcLine);
							x1 = pontos.xpt[n-1];
							y1 = pontos.ypt[n-1];
							x2 = evt.latLng.lng();
							y2 = evt.latLng.lat();
							trecho = i3GEO.calculo.distancia(x1,y1,x2,y2);
							direcao = i3GEO.calculo.direcao(x1,y1,x2,y2);
							area = google.maps.geometry.spherical.computeArea(pontos.mvcLine);
							i3GEO.analise.medeArea.googlemaps.mostraParcial(trecho,per,area,direcao);
						}
					});
					evtdblclick = google.maps.event.addListener(i3GeoMap, "dblclick", function(evt) {
						pontos.mvcLine.push(new google.maps.LatLng(pontos.ypt[0],pontos.xpt[0]));
						var per = google.maps.geometry.spherical.computeLength(pontos.mvcLine),
						area = google.maps.geometry.spherical.computeArea(pontos.mvcLine);
						i3GEO.analise.medeArea.googlemaps.mostraTotal(per,area);
						termina.call();
					});
				},
				/**
				 * Soma os valores de distancia guardados em pontos.dist
				 */
				somaDist: function(pontos){
					var n,i,
					total = 0;
					n = pontos.dist.length;
					for(i=0;i<n;i++){
						total += pontos.dist[i];
					}
					return total;
				},
				/**
				 * Fecha a janela que mostra os dados
				 * Pergunta ao usuario se os graficos devem ser removidos
				 * Os graficos sao marcados com o atributo "origem"
				 * Os raios e pontos sao sempre removidos
				 */
				fechaJanela: function(){
					i3GeoMap.setOptions({disableDoubleClickZoom:false});
					i3GeoMap.setOptions({draggableCursor:undefined});
					var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem","medeArea");
					if(f && f.length > 0){
						temp = window.confirm($trad("x94"));
						if(temp){
							i3GEO.desenho.googlemaps.destroyFeatures(f);
						}
					}
					f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem","medeAreaExcluir");
					if(f && f.length > 0){
						i3GEO.desenho.googlemaps.destroyFeatures(f);
					}
				},
				/**
				 * Mostra a totalizacao das linhas ja digitalizadas
				 */
				mostraTotal: function(per,area){
					var mostra = $i("mostraarea_calculo"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("d21at")+":</b> "+(area/1000000).toFixed(3)+" km2"+
						"<br><b>"+$trad("d21at")+":</b> "+(area/10000).toFixed(2)+" ha"+
						"<br><b>"+$trad("x98")+":</b> "+(per).toFixed(2)+" km"+
						"<br>"+$trad("x25")+": "+i3GEO.calculo.metododistancia;
						mostra.innerHTML = texto;
					}
				},
				/**
				 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
				 */
				mostraParcial: function(trecho,per,area,direcao){
					var mostra = $i("mostraarea_calculo_parcial"),
					texto;
					if (mostra){
						texto = "<b>"+$trad("d21at")+":</b> "+(area/1000000).toFixed(3)+" km2"+
						"<br><b>"+$trad("d21at")+":</b> "+(area/10000).toFixed(2)+" ha"+
						"<br><b>"+$trad("x95")+":</b> "+trecho.toFixed(3)+" km"+
						"<br><b>"+$trad("x98")+":</b> "+(per).toFixed(3)+" km" +
						"<br><b>"+$trad("x23")+" (DMS):</b> "+direcao.toFixed(4);
						mostra.innerHTML = texto;
					}
				}
			},
			googleearth: {
			}
		}
};
