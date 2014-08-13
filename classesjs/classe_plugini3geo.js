/**
 * Title: PluginI3Geo
 *
 * i3GEO.pluginI3geo
 *
 * Implementa os plugins do i3Geo que adicionam camadas especiais ao mapa,
 * normalmente dados vetoriais processados no navegador Web.
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
	 * Lista de plugins
	 *
	 * Utilizado no editor de mapfiles do sistema de administracao
	 */
	PLUGINS : [
			{
				"classe" : "heatmap",
				"nome" : "Mapa de calor",
				"editor" : true
			}, {
				"classe" : "markercluster",
				"nome" : "Agrupamento de pontos (cluster)",
				"editor" : true
			}
	],
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
		if (i3GEO.janela) {
			i3GEO.janela.AGUARDEMODAL = true;
			i3GEO.janela.abreAguarde(
					"aguardePlugin",
					"Calculando...");
			i3GEO.janela.AGUARDEMODAL = false;
		}
		// chama a funcao conforme o tipo de plugin e a interface atual
		// para cada plugin deve haver um objeto com as funcoes especificas
		// para
		// cada interface
		i3GEO.pluginI3geo[camada.plugini3geo.plugin][i3GEO.Interface.ATUAL].inicia(camada);
	},
	/**
	 * Retorna o HTML com o formulario para editar os parametros do plugin
	 */
	formAdmin : function(plugin, configString) {
		return i3GEO.pluginI3geo[plugin].formAdmin(configString);
	},
	linkAjuda : function(plugin) {
		return i3GEO.pluginI3geo[plugin].linkAjuda();
	},
	ligaCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada]
				&& i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada();
			return true;
		}
		return false;
	},
	desligaCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada]
				&& i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada();
			return true;
		}
		return false;
	},
	removeCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada]
				&& i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada();
			delete (i3GEO.pluginI3geo.OBJETOS[nomecamada]);
			return true;
		}
		return false;
	},
	atualizaCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada]
				&& i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada) {
			i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada();
			return true;
		}
		return false;
	},
	existeObjeto : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada]
				&& i3GEO.pluginI3geo.OBJETOS[nomecamada].atualizaCamada) {
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
		if (camada.plugini3geo
				&& camada.plugini3geo != "") {
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
	 * meio de ferramentas/heatmap
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
	 * "PLUGINI3GEO"
	 * '{"plugin":"heatmap","parametros":{"coluna":"teste","max":"10","radius":"15"}}'
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
		linkAjuda : function() {
			return i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=3&idajuda=121";
		},
		formAdmin : function(config) {
			// {"plugin":"heatmap","parametros":{"coluna":"","radius":15,"max":10}}
			var parametros, ins = "", configDefault = '{"plugin":"heatmap","parametros":{"coluna":"1","radius":15,"max":10}}';
			if (config === "") {
				config = configDefault;
			}
			config = YAHOO.lang.JSON.parse(config);
			if (config.plugin != "heatmap") {
				config = YAHOO.lang.JSON.parse(configDefault);
			}
			parametros = config.parametros;
			ins += ""
					+ "<p>Coluna que cont&eacute;m os dados ou valor num&eacute;rico para cada ponto:"
					+ "<br><input name='coluna' type='text' value='"
					+ parametros.coluna
					+ "' size='30'></p>"
					+ "<p>Raio de cada ponto em pixels:"
					+ "<br><input name='radius' type='text' value='"
					+ parametros.radius
					+ "' size='30'></p>"
					+ "<p>Valor m&aacute;ximo em cada ponto:"
					+ "<br><input name='max' type='text' value='"
					+ parametros.max
					+ "' size='30'></p>";
			return ins;
		},
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
				var p = i3GEO.configura.locaplic
						+ "/ferramentas/heatmap/googlemaps_js.php", carregaJs = "nao", criaLayer;
				criaLayer = function() {
					var heatmap, pontos;

					heatmap = new HeatmapOverlay(i3GeoMap, camada.name, {
						"radius" : camada.plugini3geo.parametros.radius,
						"visible" : true,
						"opacity" : camada.transparency,
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
							"offset" : [
									5, 50
							]
						}
					});
					// i3GeoMap.overlayMapTypes.insertAt(0, heatmap);
					pontos = {
						max : camada.plugini3geo.parametros.max,
						data : heatmap_dados
					};
					i3GEO.janela.fechaAguarde("aguardePlugin");
					heatmap.setDataSet(pontos);
					heatmap.ligaCamada = function() {
						this.liga();
					};
					heatmap.desLigaCamada = function() {
						this.desliga();
					};
					heatmap.removeCamada = function() {
						this.destroy();
					};
					heatmap.atualizaCamada = function() {
						this.draw();
					};
					i3GEO.pluginI3geo.OBJETOS[camada.name] = heatmap;
					heatmap_dados = null;
				};
				if (typeof (HeatmapOverlay) === 'undefined') {
					carregaJs = "sim";
				}
				p += "?carregajs="
						+ carregaJs
						+ "&layer="
						+ camada.name
						+ "&coluna="
						+ camada.plugini3geo.parametros.coluna
						+ "&g_sid="
						+ i3GEO.configura.sid
						+ "&nomevariavel=heatmap_dados";
				i3GEO.util.scriptTag(
						p,
						criaLayer,
						"i3GEO.pluginI3geo.heatmap_script");
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
			inicia : function(camada, objMapa) {
				var p = i3GEO.configura.locaplic
						+ "/ferramentas/heatmap/openlayers_js.php", carregaJs = "nao", criaLayer;
				criaLayer = function() {
					var heatmap, transformedTestData = {
						max : camada.plugini3geo.parametros.max,
						data : []
					}, data = heatmap_dados, datalen = heatmap_dados.length, nudata = [];

					// para uso com o mashup
					if (!objMapa) {
						objMapa = i3geoOL;
					}
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
					heatmap = new OpenLayers.Layer.Heatmap(camada.name, objMapa, objMapa.baseLayer, {
						"visible" : true,
						"opacity" : camada.transparency,
						"radius" : camada.plugini3geo.parametros.radius,
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
							"offset" : [
									5, 50
							]
						}
					}, {
						isBaseLayer : false,
						projection : new OpenLayers.Projection("EPSG:4326"),
						displayInLayerSwitcher : true
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
					objMapa.addLayer(heatmap);
					heatmap.setDataSet(transformedTestData);
					heatmap_dados = null;
					if (i3GEO.janela) {
						i3GEO.janela.fechaAguarde("aguardePlugin");
					}
				};
				if (typeof (HeatmapOverlay) === 'undefined') {
					carregaJs = "sim";
				}
				if (!i3GEO.configura
						|| !i3GEO.configura.sid) {
					i3GEO.configura.sid = "";
				}
				p += "?carregajs="
						+ carregaJs
						+ "&layer="
						+ camada.name
						+ "&coluna="
						+ camada.plugini3geo.parametros.coluna
						+ "&g_sid="
						+ i3GEO.configura.sid
						+ "&nomevariavel=heatmap_dados";
				i3GEO.util.scriptTag(
						p,
						criaLayer,
						"i3GEO.pluginI3geo.heatmap_script");
			}
		},
		googleearth : {
			inicia : function() {
				alert("Plugin nao disponivel");
			}
		}
	},
	/**
	 * Function: markercluster
	 *
	 * Markercluster
	 *
	 * Gera um layer que agrupa pontos conforme a dist&acirc;ncia entre eles e
	 * insere um contador adiciona ao mapa
	 *
	 * As depend&ecirc;ncias em javascript sao carregadas via script tag por
	 * meio de ferramentas/markercluster
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
	 * "PLUGINI3GEO"
	 * '{"plugin":"markercluster","parametros":{"coluna":"teste","gridSize":"50"}}'
	 *
	 * Coluna &eacute; a que cont&eacute;m os dados num&eacute;ricos que definem
	 * a quantidade de uma medida em cada ponto e &eacute; usada para gerar a
	 * representa&ccedil;&atilde;o. Se for vazia, considera-se o valor como 1
	 *
	 */
	markercluster : {
		linkAjuda : function() {
			return i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=3&idajuda=121";
		},
		formAdmin : function(config) {
			var parametros, ins = "", configDefault = '{"plugin":"markercluster","parametros":{"gridSize":50}}';
			if (config === "") {
				config = configDefault;
			}
			config = YAHOO.lang.JSON.parse(config);
			if (config.plugin != "markercluster") {
				config = YAHOO.lang.JSON.parse(configDefault);
			}
			parametros = config.parametros;
			ins += ""
					+ "<p>Dist&acirc;ncia m&aacute;xima entre ponto em pixels:"
					+ "<br><input name='gridSize' type='text' value='"
					+ parametros.gridSize
					+ "' size='30'></p>";
			return ins;
		},
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
				var p = i3GEO.configura.locaplic
						+ "/ferramentas/markercluster/googlemaps_js.php", carregaJs = "nao", criaLayer;
				criaLayer = function() {
					var markercluster, marcas, latLng, marker, n, i;
					n = markercluster_dados.lenght();
					marcas = [];
					for (i = 0; i < n; i++) {
						latLng = new google.maps.LatLng(markercluster_dados[i].lat, markercluster_dados[i].long);
						marker = new google.maps.Marker({
							'position' : latLng
						});
						marcas.push(marker);
					}
					markercluster = new MarkerClusterer(i3GeoMap, marcas, {
						"gridSize" : camada.plugini3geo.parametros.gridSize,
						"visible" : true,
						"opacity" : camada.transparency
					});
					i3GEO.janela.fechaAguarde("aguardePlugin");
					markercluster.ligaCamada = function() {
						this.liga();
					};
					markercluster.desLigaCamada = function() {
						this.desliga();
					};
					markercluster.removeCamada = function() {
						this.destroy();
					};
					markercluster.atualizaCamada = function() {
						this.draw();
					};
					i3GEO.pluginI3geo.OBJETOS[camada.name] = markercluster;
					markercluster_dados = null;
				};
				if (typeof (MarkerClusterer) === 'undefined') {
					carregaJs = "sim";
				}
				p += "?carregajs="
						+ carregaJs
						+ "&layer="
						+ camada.name
						+ "&coluna="
						+ camada.plugini3geo.parametros.coluna
						+ "&g_sid="
						+ i3GEO.configura.sid
						+ "&nomevariavel=markercluster_dados";
				i3GEO.util.scriptTag(
						p,
						criaLayer,
						"i3GEO.pluginI3geo.markercluster_script");
			}
		}
	}
};