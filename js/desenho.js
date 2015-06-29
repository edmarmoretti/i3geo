/**
 * Title: Desenho
 *
 * Fun&ccedil;&otilde;es compartilhadas pelas opera&ccedil;&otilde;es de desenho de elementos gr&aacute;ficos
 *
 * Funcoes de uso geral para desenho de elementos gr&aacute;ficos.
 *
 * As fun&ccedil;&otilde;es dependem de cada interface em uso no mapa.
 *
 * Aqui estao apenas as funcoes de uso compartilhado. Para mais informacoes veja
 * as opcoes nos editores vetoriais espec&iacute;ficos de cada interface
 *
 * Namespace:
 *
 * i3GEO.desenho
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_desenho.js>
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
i3GEO.desenho =
	{
		/**
		 * Constant: layergrafico
		 * 
		 * Objeto LAYER para a interface OpenLayers criado com i3GEO.desenho.openlayers.criaLayerGrafico
		 * 
		 * Tipo:
		 * 
		 * {OpenLayers.Layer.Vector}
		 * 
		 */
		layergrafico : null,
		/**
		 * Propriedade: estilos
		 * 
		 * Estilos que podem ser utilizados para desenhar os elementos
		 * 
		 * Tipo:
		 * 
		 * {objeto}
		 */
		estilos : {
			"normal" : {
				fillcolor : '#ffffff',
				linecolor : '#000000',
				linewidth : '2',
				circcolor : '#ffffff',
				textcolor : '#787A78'
			},
			"palido" : {
				fillcolor : '#B5A8A8',
				linecolor : '#BAA4AE',
				linewidth : '1',
				circcolor : '#E0D7DC',
				textcolor : '#787A78'
			},
			"vermelho" : {
				fillcolor : '#E8ACAC',
				linecolor : '#F50707',
				linewidth : '1',
				circcolor : '#F09EA6',
				textcolor : '#787A78'
			},
			"verde" : {
				fillcolor : '#3CCC2F',
				linecolor : '#0C6642',
				linewidth : '1',
				circcolor : '#C7D9D2',
				textcolor : '#787A78'
			}
		},
		// @TODO remover apos refatorar codigo
		estilosOld : {
			"normal" : {
				fillcolor : 'red',
				linecolor : 'black',
				linewidth : '1',
				circcolor : 'white',
				textcolor : 'gray'
			},
			"palido" : {
				fillcolor : 'gray',
				linecolor : 'gray',
				linewidth : '1',
				circcolor : 'gray',
				textcolor : 'gray'
			},
			"vermelho" : {
				fillcolor : 'gray',
				linecolor : 'red',
				linewidth : '1',
				circcolor : 'pink',
				textcolor : 'brown'
			},
			"verde" : {
				fillcolor : 'gray',
				linecolor : 'green',
				linewidth : '1',
				circcolor : 'DarkGreen',
				textcolor : 'GreenYellow'
			}
		},
		/**
		 * Propriedade: estiloPadrao
		 * 
		 * Estilo utilizado como padr&atilde;o
		 */
		estiloPadrao : "normal",
		/**
		 * Cria uma caixa de sele&ccedil;&atilde;o para escolha do estilo a ser utilizado
		 */
		caixaEstilos : function() {
			var lista = i3GEO.util.listaChaves(i3GEO.desenho.estilos), n = lista.length, i, caixa, sel;
			caixa = "<select onchange='i3GEO.desenho.definePadrao(this.value)'>";
			for (i = 0; i < n; i += 1) {
				sel = "";
				if (lista[i] === i3GEO.desenho.estiloPadrao) {
					sel = "select";
				}
				caixa += "<option value='" + lista[i] + "'" + sel + ">" + lista[i] + "</option>";
			}
			caixa += "</select>";
			return caixa;
		},
		/**
		 * Function: addBox
		 * 
		 * Adiciona um retangulo
		 * 
		 * Parameter:
		 * 
		 * {numeric} - novo xmin
		 * 
		 * {numeric} - novo ymin
		 * 
		 * {numeric} - novo xmax
		 * 
		 * {numeric} - novo ymax
		 * 
		 * {string} - namespace que identifica o elemento grafico, permitindo busca
		 * 
		 * {string} - cor do contorno
		 * 
		 * {string} - expessura do contorno
		 */
		addBox : function(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth) {
			if (i3GEO.Interface.ATUAL != "googleearth") {
				return i3GEO.desenho[i3GEO.Interface.ATUAL].addBox(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth);
			} else {
				return false;
			}
		},
		/**
		 * Function: moveBox
		 * 
		 * Reposiciona um retangulo
		 * 
		 * Parameter:
		 * 
		 * {object} - box
		 * 
		 * {numeric} - novo xmin
		 * 
		 * {numeric} - novo ymin
		 * 
		 * {numeric} - novo xmax
		 * 
		 * {numeric} - novo ymax
		 */
		moveBox : function(box, xmin, ymin, xmax, ymax) {
			if (i3GEO.Interface.ATUAL != "googleearth") {
				return i3GEO.desenho[i3GEO.Interface.ATUAL].moveBox(box, xmin, ymin, xmax, ymax);
			} else {
				return false;
			}
		},
		/**
		 * Function: removeBox
		 * 
		 * Remove box do mapa (apenas alias para removePins)
		 * 
		 * Parameter:
		 * 
		 * {string} - namespace que identifica o grupo de marcas que serao removidas
		 */
		removeBox : function(namespace) {
			i3GEO.desenho.removePins(namespace);
		},
		/**
		 * Function: addPin
		 * 
		 * Adiciona uma marca no mapa em uma determinada coordenada
		 * 
		 * Parameters:
		 * 
		 * {numeric} - longitude
		 * 
		 * {numeric} - latitude
		 * 
		 * {numeric} - largura da imagem
		 * 
		 * {numeric} - altura da imagem
		 * 
		 * {string} - namespace utilizado para agrupar a marca, permitindo sua remocao
		 * 
		 * {boolean} - posiciona a marca no centro do ponto
		 * 
		 * {function} - fun&ccedil;&atilde;o disparada no evento onclick
		 * 
		 * Return:
		 * 
		 * {objeto}
		 * 
		 */
		addPin : function(x, y, w, h, imagem, namespace, centro, funcaoclick) {
			if (i3GEO.Interface.ATUAL != "googleearth") {
				return i3GEO.desenho[i3GEO.Interface.ATUAL].addPin(x, y, w, h, imagem, namespace, centro);
			} else {
				return false;
			}
		},
		/**
		 * Function: removePins
		 * 
		 * Remove marcas do mapa
		 * 
		 * Parameter:
		 * 
		 * {string} - namespace que identifica o grupo de marcas que serao removidas
		 */
		removePins : function(namespace) {
			if (i3GEO.Interface.ATUAL != "googleearth") {
				i3GEO.desenho[i3GEO.Interface.ATUAL].removePins(namespace);
			}
		},
		/**
		 * Function: movePin
		 * 
		 * Reposiciona uma marca
		 * 
		 * Parameter:
		 * 
		 * {object} - marca
		 * 
		 * {numeric} - novo x
		 * 
		 * {numeric} - novo y
		 */
		movePin : function(pin, x, y) {
			if (i3GEO.Interface.ATUAL != "googleearth") {
				i3GEO.desenho[i3GEO.Interface.ATUAL].movePin(pin, x, y);
			}
		},
		/**
		 * Section: i3GEO.desenho.openlayers
		 * 
		 * Fun&ccedil;&otilde;es utilizadas quando o mapa baseia-se na interface OpenLayers
		 */
		openlayers : {
			/**
			 * Function: inicia
			 * 
			 * Cria o layer onde os desenhos serao inseridos
			 */
			inicia : function() {
				if (!i3GEO.desenho.layergrafico) {
					i3GEO.desenho.openlayers.criaLayerGrafico();
				}
			},
			addBox : function(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth) {
				var bounds, f;
				if (!namespace) {
					namespace = "box";
				}
				if (!strokeColor) {
					strokeColor = "#FF0000";
				}
				if (!strokeWidth) {
					strokeWidth = 2;
				}
				i3GEO.desenho.openlayers.inicia();
				bounds = OpenLayers.Bounds.fromArray([
					xmin, ymin, xmax, ymax
				]);
				bounds = bounds.toGeometry();
				bounds = i3GEO.util.extGeo2OSM(bounds);
				f = new OpenLayers.Feature.Vector(bounds, {
					origem : namespace
				}, {
					fill : false,
					strokeColor : strokeColor,
					strokeWidth : strokeWidth
				});
				i3GEO.desenho.layergrafico.addFeatures([
					f
				]);
				return f;
			},
			moveBox : function(box, xmin, ymin, xmax, ymax) {
				i3GEO.desenho.layergrafico.removeFeatures(box);
				var namespace = box["attributes"].origem, strokeWidth = box["style"].strokeWidth, strokeColor = box["style"].strokeColor;
				box = i3GEO.desenho.addBox(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth);
				return box;
			},
			addPin : function(x, y, w, h, imagem, namespace, centro, funcaoclick) {
				return;
				if (!imagem || imagem === "") {
					imagem = i3GEO.configura.locaplic + "/imagens/google/confluence.png";
				}
				if (!namespace) {
					namespace = "pin";
				}
				if (!w || w === "") {
					w = 27;
				}
				if (!h || h === "") {
					h = 27;
				}
				if (!funcaoclick) {
					funcaoclick = function() {
						i3GEO.desenho.openlayers.removePins(namespace);
					};
				}
				if (!centro) {
					centro = false;
				}
				i3GEO.desenho.openlayers.inicia();
				var point, f, ox, oy;
				if (centro === true) {
					ox = parseInt(w / 2, 10) * -1;
					oy = parseInt(h / 2, 10) * -1;
				} else {
					ox = parseInt(w / 2, 10) * -1;
					oy = h * -1;
				}
				point = new OpenLayers.Geometry.Point(x, y);
				point = i3GEO.util.extGeo2OSM(point);
				f = new OpenLayers.Feature.Vector(point, {
					origem : namespace,
					click : funcaoclick
				}, {
					graphicWidth : w,
					graphicHeight : h,
					graphicXOffset : ox,
					graphicYOffset : oy,
					externalGraphic : imagem
				});
				i3GEO.desenho.layergrafico.addFeatures([
					f
				]);
				return f;
			},
			removePins : function(namespace) {
				return;
				if (!namespace) {
					namespace = "pin";
				}
				if (i3GEO.desenho.layergrafico) {
					var f = i3GEO.desenho.layergrafico.getFeaturesByAttribute("origem", namespace);
					if (f && f.length > 0) {
						i3GEO.desenho.layergrafico.destroyFeatures(f);
					}
				}
			},
			movePin : function(pin, x, y) {
				return;
				var point = new OpenLayers.LonLat(x, y);
				point = i3GEO.util.extGeo2OSM(point);
				pin.move(point);
			},
			criaLayerGrafico : function() {
				if (!i3GEO.desenho.layergrafico) {
					i3GEO.desenho.layergrafico = new ol.FeatureOverlay({
						style : new ol.style.Style({
							fill : new ol.style.Fill({
								color : 'rgba(255, 255, 255, 0.2)'
							}),
							stroke : new ol.style.Stroke({
								color : '#ffcc33',
								width : 2
							}),
							image : new ol.style.Circle({
								radius : 7,
								fill : new ol.style.Fill({
									color : '#ffcc33'
								})
							})
						})
					});
					i3GEO.desenho.layergrafico.setMap(i3geoOL);
				}
				return;
				if (!i3GEO.desenho.layergrafico) {
					var sketchSymbolizers = {
						"Point" : {
							fillColor : "rgb(${fillColor})",
							fillOpacity : "${opacidade}",
							strokeWidth : "${strokeWidth}",
							strokeOpacity : "${opacidade}",
							strokeColor : "rgb(${strokeColor})",
							label : "${texto}",
							pointRadius : "${pointRadius}",
							graphicName : "${graphicName}",
							fontSize : "${fontSize}",
							fontColor : "rgb(${fontColor})",
							fontFamily : "Arial",
							fontWeight : "normal",
							labelAlign : "lb",
							labelXOffset : "3",
							labelYOffset : "3",
							externalGraphic : "${externalGraphic}"
						},
						"Line" : {
							strokeWidth : "${strokeWidth}",
							strokeOpacity : "${opacidade}",
							strokeColor : "rgb(${strokeColor})"
						},
						"Polygon" : {
							strokeWidth : "${strokeWidth}",
							strokeOpacity : "${opacidade}",
							strokeColor : "rgb(${strokeColor})",
							fillColor : "rgb(${fillColor})",
							fillOpacity : "${opacidade}",
							zIndex : 5000
						}
					}, style = new OpenLayers.Style(), styleMap1 = new OpenLayers.StyleMap({
						"default" : style,
						"vertex" : {
							strokeOpacity : 1,
							strokeWidth : 1,
							fillColor : "white",
							fillOpacity : 0.45,
							pointRadius : 4
						}
					}, {
						extendDefault : false
					});
					style.addRules([
						new OpenLayers.Rule({
							symbolizer : sketchSymbolizers
						})
					]);
					i3GEO.desenho.layergrafico = new OpenLayers.Layer.Vector("Graf", {
						styleMap : styleMap1,
						displayInLayerSwitcher : true,
						visibility : true,
						vertexRenderIntent : "vertex",
						eventListeners : {
							featureclick : function(e) {
								// log(e.object.name + " says: " + e.feature.id
								// + " clicked.");
								if (e.feature.data.click) {
									e.feature.data.click.call();
								}
								return false;
							}
						}
					});
					// para efeitos de compatibilidade
					if (i3GEO.editorOL && i3GEO.editorOL.mapa) {
						i3GEO.editorOL.mapa.addLayers([
							i3GEO.desenho.layergrafico
						]);
					} else {
						i3geoOL.addLayers([
							i3GEO.desenho.layergrafico
						]);
					}
				}
			}
		},
		/**
		 * Section: i3GEO.desenho.googlemaps
		 * 
		 * Fun&ccedil;&otilde;es utilizadas quando o mapa baseia-se na interface GoogleMaps
		 */
		googlemaps : {
			/**
			 * Variavel: shapes
			 * 
			 * Array que guarda todos os objetos que estao atualmente no mapa E atualizado toda vez que uma figura e acrescentada ou
			 * removida
			 */
			shapes : [],
			inicia : function() {
			},
			addBox : function(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth) {
				var f;
				if (!namespace) {
					namespace = "box";
				}
				if (!strokeColor) {
					strokeColor = "#FF0000";
				}
				if (!strokeWidth) {
					strokeWidth = 2;
				}
				i3GEO.desenho.googlemaps.inicia();
				f = new google.maps.Rectangle({
					origem : namespace,
					strokeColor : strokeColor,
					strokeWeight : strokeWidth,
					fillOpacity : 0,
					map : i3GeoMap,
					bounds : new google.maps.LatLngBounds(new google.maps.LatLng(ymin, xmin), new google.maps.LatLng(ymax, xmax))
				});
				i3GEO.desenho.googlemaps.shapes.push(f);
				return f;
			},
			moveBox : function(box, xmin, ymin, xmax, ymax) {
				box.setBounds(new google.maps.LatLngBounds(new google.maps.LatLng(ymin, xmin), new google.maps.LatLng(ymax, xmax)));
				return box;
			},
			addPin : function(x, y, w, h, imagem, namespace, centro, funcaoclick) {
				if (!imagem || imagem === "") {
					imagem = i3GEO.configura.locaplic + "/imagens/google/confluence.png";
				}
				if (!namespace) {
					namespace = "pin";
				}
				if (!w || w === "") {
					w = 27;
				}
				if (!h || h === "") {
					h = 27;
				}
				if (!funcaoclick) {
					funcaoclick = function() {
						i3GEO.desenho.googlemaps.removePins(namespace);
					};
				}
				if (!centro) {
					centro = false;
				}
				i3GEO.desenho.googlemaps.inicia();
				var point, f, icon;
				if (centro === false) {
					icon = {
						url : imagem,
						size : new google.maps.Size(w, h)
					};
				} else {
					icon = {
						url : imagem,
						size : new google.maps.Size(w, h),
						origin : new google.maps.Point(0, 0),
						anchor : new google.maps.Point(w / 2, h / 2)
					};
				}
				point = new google.maps.LatLng(y, x);

				f = new google.maps.Marker({
					position : point,
					map : i3GeoMap,
					origem : namespace,
					icon : icon
				});
				i3GEO.desenho.googlemaps.shapes.push(f);
				return f;
			},
			removePins : function(namespace) {
				if (!namespace) {
					namespace = "pin";
				}
				var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", namespace);
				if (f && f.length > 0) {
					i3GEO.desenho.googlemaps.destroyFeatures(f);
				}
			},
			movePin : function(pin, x, y) {
				var point = new google.maps.LatLng(y, x);
				pin.setPosition(point);
			},
			/**
			 * Function: getFeaturesByAttribute
			 * 
			 * Obt&eacute;m uma figura com base em um atributo
			 * 
			 * {string}
			 * 
			 * {string}
			 */
			getFeaturesByAttribute : function(atributo, valor) {
				var i, s = [], n = i3GEO.desenho.googlemaps.shapes.length;
				for (i = 0; i < n; i++) {
					if (i3GEO.desenho.googlemaps.shapes[i] && i3GEO.desenho.googlemaps.shapes[i] != "") {
						if (i3GEO.desenho.googlemaps.shapes[i][atributo] == valor) {
							s.push(i3GEO.desenho.googlemaps.shapes[i]);
						}
					}
				}
				return s;
			},
			/**
			 * Function: destroyFeatures
			 * 
			 * Destroi as figuras
			 * 
			 * {array} - lista de objetos
			 */
			destroyFeatures : function(f) {
				if (f) {
					var i, n = f.length;
					for (i = 0; i < n; i++) {
						f[i].setMap(null);
						f[i] = "";
					}
				}
			}
		},
		/**
		 * Section: i3GEO.desenho.googleearth
		 * 
		 * Fun&ccedil;&otilde;es utilizadas quando o mapa baseia-se na interface GoogleEarth
		 */
		googleearth : {
			insereMarca : function(description, ddx, ddy, name, snippet) {
				if (typeof (console) !== 'undefined')
					console.info("i3GEO.Interface.googleearth.insereMarca()");

				var placemark = i3GeoMap.createPlacemark(''), point = i3GeoMap.createPoint('');
				placemark.setName(name);
				point.setLatitude(ddy);
				point.setLongitude(ddx);
				placemark.setGeometry(point);
				if (description !== "") {
					placemark.setDescription(description);
				}
				placemark.setSnippet(snippet);
				i3GeoMap.getFeatures().appendChild(placemark);
			},
			//
			// c&oacute;digo obtido em
			// http://code.google.com/intl/pt-BR/apis/earth/documentation/geometries.html
			//
			insereCirculo : function(centerLng, centerLat, radius, name, snippet) {
				function makeCircle(centerLat, centerLng, radius) {
					var ring = i3GeoMap.createLinearRing(''), steps = 25, i, pi2 = Math.PI * 2, lat, lng;
					for (i = 0; i < steps; i++) {
						lat = centerLat + radius * Math.cos(i / steps * pi2);
						lng = centerLng + radius * Math.sin(i / steps * pi2);
						ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
					}
					return ring;
				}
				var polygonPlacemark = i3GeoMap.createPlacemark(''), poly = i3GeoMap.createPolygon(''), polyStyle;
				poly.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
				polygonPlacemark.setGeometry(poly);
				polygonPlacemark.getGeometry().setOuterBoundary(makeCircle(centerLat, centerLng, radius));
				polygonPlacemark.setName(name);
				polygonPlacemark.setSnippet(snippet);
				polygonPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
				polyStyle = polygonPlacemark.getStyleSelector().getPolyStyle();
				polyStyle.setFill(0);
				i3GeoMap.getFeatures().appendChild(polygonPlacemark);
			},
			insereLinha : function(xi, yi, xf, yf, name, snippet) {
				var lineStringPlacemark = i3GeoMap.createPlacemark(''), lineString, lineStyle;
				lineStringPlacemark.setName(name);
				lineString = i3GeoMap.createLineString('');
				lineString.setAltitudeMode(i3GeoMap.ALTITUDE_RELATIVE_TO_GROUND);
				lineStringPlacemark.setGeometry(lineString);
				lineString.getCoordinates().pushLatLngAlt(yi, xi, 0);
				lineString.getCoordinates().pushLatLngAlt(yf, xf, 0);

				lineStringPlacemark.setStyleSelector(i3GeoMap.createStyle(''));
				lineStringPlacemark.setSnippet(snippet);
				lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
				lineStyle.setWidth(3);

				i3GeoMap.getFeatures().appendChild(lineStringPlacemark);
			},
			removePlacemark : function(nome) {
				var features = i3GeoMap.getFeatures(), n = features.getChildNodes().getLength(), i, nfeatures = [];
				for (i = 0; i < n; i++) {
					try {
						if (features.getChildNodes().item(i).getName() === nome || features.getChildNodes().item(i).getDescription() === nome
							|| features.getChildNodes().item(i).getSnippet() === nome) {
							// features.getChildNodes().item(i).setVisibility(false);
							nfeatures.push(features.getChildNodes().item(i));
							// features.removeChild(features.getChildNodes().item(i));
						}
					} catch (e) {
					}
				}
				n = nfeatures.length;
				for (i = 0; i < n; i++) {
					features.removeChild(nfeatures[i]);
				}
			}
		}
	};
// YAHOO.log("carregou classe desenho", "Classes i3geo");
