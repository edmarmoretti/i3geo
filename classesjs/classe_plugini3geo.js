/**
 * Title: pluginI3geo
 * 
 * i3GEO.pluginI3geo
 * 
 * Implementam os plugins do i3Geo que adicionam camadas especiais ao mapa,
 * normalmente dados vetoriais.
 * 
 * Arquivo:
 * 
 * i3geo/classesjs/classe_plugini3geo.js
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
 * impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE
 * ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para
 * mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da
 * Licen&ccedil;a P&uacute;blica Geral do GNU junto com este programa; se
 * n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.pluginI3geo = {
	OBJETOS : {},
	/**
	 * Inicia a execucao de um plugin
	 * 
	 * Camada e um objeto gerado pelo i3Geo quando uma camada e adicionada ao
	 * mapa O objeto i3GEO.arvoreDeCamadas.CAMADAS guarda todas as camadas
	 * adicionadas ao mapa Ao adicionar uma camada pelo catalogo, o i3Geo
	 * verifica se a camada possui plugin e direciona para ca Os plugins sao
	 * definidos como metadados em cada mapfile de cada tema
	 * 
	 * Veja em i3geo/classesphp/classe_mapa.php funcao parametrostemas
	 */
	inicia : function(camada) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.inicia()");

		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardePlugin", "Calculando...");
		i3GEO.janela.AGUARDEMODAL = false;
		// chama a funcao conforme o tipo de plugin e a interface atual
		// para cada plugin deve haver um objeto com as funcoes especificas
		// para
		// cada interface
		i3GEO.pluginI3geo[camada.plugini3geo.plugin][i3GEO.Interface.ATUAL].inicia(camada);
	},
	ligaCamada : function(nomecamada) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.ligaCamada('"+nomecamada+"')");

		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada();
			return true;
		}
		return false;
	},
	desligaCamada : function(nomecamada) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.desligaCamada('"+nomecamada+"')");

		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada();
			return true;
		}
		return false;
	},
	removeCamada : function(nomecamada) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.removeCamada('"+nomecamada+"')");

		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada();
			delete (i3GEO.pluginI3geo.OBJETOS[nomecamada]);
			return true;
		}
		return false;
	},
	atualizaCamada : function(nomecamada) {
		if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.atualizaCamada('"+nomecamada+"')");

		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada();
			return true;
		}
		return false;
	},
	existeObjeto : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada) {
			return true;
		}
		return false;
	},
	/**
	 * Aplica as propriedades em um objeto do tipo tema
	 * 
	 * tema e fornecido por i3GEO.arvoreDeCamadas o ajuste das propriedades e
	 * necessario para que as propriedades aparecam de forma correta na arvore
	 * de camadas
	 */
	aplicaPropriedades : function(camada) {
		if (camada.plugini3geo != "") {
			camada = i3GEO.pluginI3geo[camada.plugini3geo.plugin][i3GEO.Interface.ATUAL].aplicaPropriedades(camada);
		}
		return camada;
	},
	/**
	 * Function: heatmap
	 * 
	 * Mapa de calor
	 * 
	 * Gera um layer do tipo mapa de calor e adiciona ao mapa
	 * 
	 * As depend&ecirc;ncias em javascript sao carregadas via script tag por
	 * meio de ferramentas/heatmap/openlayers_js.php
	 * 
	 * Esse programa tamb&eacute;m obt&eacute;m os dados necess&aacute;rios ao
	 * plugin
	 * 
	 * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	 * 
	 * Esse matadado deve conter uma string que ser&aacute; transformada em um
	 * objeto javascript para uso no plugin
	 * 
	 * Exemplo:
	 * 
	 * "PLUGINI3GEO" '{"plugin":"heatmap","parametros":{"coluna":"teste"}}'
	 * 
	 * Coluna &eacute; a que cont&eacute;m os dados num&eacute;ricos que definem
	 * a quantidade de uma medida em cada ponto e &eacute; usada para gerar a
	 * representa&ccedil;&atilde;o. Se for vazia, considera-se o valor como 1
	 * 
	 * As cores das classes existentes no LAYER ser&atilde;o utilizadas para
	 * calcular as cores do mapa de calor. Se n&atilde;o existirem classes,
	 * ser&aacute; usado o default.
	 * 
	 */
	heatmap : {
		googlemaps : {
			aplicaPropriedades : function(camada) {
				camada.sel = "nao";
				camada.download = "nao";
				camada.AGUARDALEGENDA = false;
				camada.temporizador = "";
				camada.copia = false;
				camada.procurar = false;
				camada.toponimia = false;
				camada.etiquetas = false;
				camada.tabela = false;
				camada.grafico = false;
				camada.destacar = false;
				camada.wms = false;
				camada.classe = "NAO";
				return camada;
			},
			inicia : function(camada) {
				var p = i3GEO.configura.locaplic + "/ferramentas/heatmap/googlemaps_js.php", carregaJs = "nao", criaLayer;
				criaLayer = function() {
					var heatmap, pontos;
					heatmap = new HeatmapOverlay(i3GeoMap, camada.name, {
						"radius" : 15,
						"visible" : true,
						"opacity" : 60,
						"gradient" : {
							"0.45" : "rgb(0,0,255)",
							"0.55" : "rgb(0,255,255)",
							"0.65" : "rgb(0,255,0)",
							"0.95" : "yellow",
							"1.0" : "rgb(255,0,0)"
						},
						"legend" : {
							"title" : camada.tema,
							"position" : "bl",
							"offset" : [ 5, 50 ]
						}
					});
					// i3GeoMap.overlayMapTypes.insertAt(0, heatmap);
					pontos = {
						max : 10,
						data : heatmap_dados
					};
					i3GEO.janela.fechaAguarde("aguardePlugin");
					heatmap.setDataSet(pontos);
					heatmap.ligaCamada = function() {
						if (typeof (console) !== 'undefined')
							console.info("i3GEO.pluginI3geo liga googlemaps");

						this.liga();
					};
					heatmap.desLigaCamada = function() {
						if (typeof (console) !== 'undefined')
							console.info("i3GEO.pluginI3geo desliga googlemaps");

						this.desliga();
					};
					heatmap.removeCamada = function() {
						if (typeof (console) !== 'undefined')
							console.info("i3GEO.pluginI3geo remove googlemaps");

						this.destroy();
					};
					heatmap.atualizaCamada = function() {
						if (typeof (console) !== 'undefined')
							console.info("i3GEO.pluginI3geo atualiza googlemaps");

						this.draw();
					};
					i3GEO.pluginI3geo.OBJETOS[camada.name] = heatmap;
					heatmap_dados = null;
				};
				if (typeof (HeatmapOverlay) === 'undefined') {
					carregaJs = "sim";
				}
				p += "?carregajs=" + carregaJs + "&layer=" + camada.name + "&coluna=" + camada.plugini3geo.parametros.coluna + "&g_sid=" + i3GEO.configura.sid + "&nomevariavel=heatmap_dados";
				i3GEO.util.scriptTag(p, criaLayer, "i3GEO.pluginI3geo.heatmap_script");
			}
		},
		//
		// O script que adiciona a camada
		// define os eventos visibilitychanged, moveend e removed
		// A camada e adicionada como um objeto layer, permitindo que as funcoes
		// do i3Geo operem normalmente, sem muitas modificacoes
		//
		openlayers : {
			aplicaPropriedades : function(camada) {
				camada.sel = "nao";
				camada.download = "nao";
				camada.AGUARDALEGENDA = false;
				camada.temporizador = "";
				camada.copia = false;
				camada.procurar = false;
				camada.toponimia = false;
				camada.etiquetas = false;
				camada.tabela = false;
				camada.grafico = false;
				camada.destacar = false;
				camada.wms = false;
				camada.classe = "NAO";
				return camada;
			},
			inicia : function(camada) {
				var p = i3GEO.configura.locaplic + "/ferramentas/heatmap/openlayers_js.php", carregaJs = "nao", criaLayer;
				criaLayer = function() {
					var heatmap, transformedTestData = {
						max : 10,
						data : []
					}, data = heatmap_dados, datalen = heatmap_dados.length, nudata = [];
					// in order to use the OpenLayers Heatmap Layer we have
					// to
					// transform our data into
					// { max: <max>, data: [{lonlat: <OpenLayers.LonLat>,
					// count:
					// <count>},...]}
					while (datalen--) {
						nudata.push({
							lonlat : new OpenLayers.LonLat(data[datalen].lng, heatmap_dados[datalen].lat),
							count : heatmap_dados[datalen].count
						});
					}
					transformedTestData.data = nudata;
					// create our heatmap layer
					heatmap = new OpenLayers.Layer.Heatmap(camada.name, i3geoOL, i3geoOL.baseLayer, {
						visible : true,
						radius : 10,
						"gradient" : {
							"0.45" : "rgb(0,0,255)",
							"0.55" : "rgb(0,255,255)",
							"0.65" : "rgb(0,255,0)",
							"0.95" : "yellow",
							"1.0" : "rgb(255,0,0)"
						},
						"legend" : {
							"title" : camada.tema,
							"position" : "bl",
							"offset" : [ 5, 50 ]
						}
					}, {
						isBaseLayer : false,
						opacity : 0.3,
						projection : new OpenLayers.Projection("EPSG:4326")
					});
					heatmap.ligaCamada = function() {
						this.toggle();
						this.updateLayer();
					};
					heatmap.desLigaCamada = function() {
						this.toggle();
						this.updateLayer();
					};
					heatmap.removeCamada = function() {
						this.destroy();
					};
					heatmap.atualizaCamada = function() {
						this.updateLayer();
					};

					i3GEO.pluginI3geo.OBJETOS[camada.name] = heatmap;
					i3geoOL.addLayer(heatmap);
					heatmap.setDataSet(transformedTestData);
					heatmap_dados = null;
					i3GEO.janela.fechaAguarde("aguardePlugin");
				};
				if (typeof (HeatmapOverlay) === 'undefined') {
					carregaJs = "sim";
				}
				p += "?carregajs=" + carregaJs + "&layer=" + camada.name + "&coluna=" + camada.plugini3geo.parametros.coluna + "&g_sid=" + i3GEO.configura.sid + "&nomevariavel=heatmap_dados";
				i3GEO.util.scriptTag(p, criaLayer, "i3GEO.pluginI3geo.heatmap_script");
			}
		},
		googleearth : {
			inicia : function() {
				alert("Plugin nao disponivel");
			}
		}
	}
};