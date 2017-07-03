if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
i3GEOF.area =
	{
		/**
		 * Armazena os pontos clicados para realizar os calculos
		 */
		pontos : {},
		/**
		 * Armazena o WKT da ultima linha
		 */
		ultimoWkt : "",
		/**
		 * Armazena a ultima medida
		 */
		ultimaMedida : "",
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {

		},
		inicia : function(iddiv) {
			i3GEO.eventos.cliquePerm.desativa();
			$i(iddiv).innerHTML += i3GEOF.area.html();
			i3GEOF.area[i3GEO.Interface["ATUAL"]].inicia();
			//
			// botao que abre a ferramenta de calculo de perfis.
			// pontosdistobj contem as coordenadas dos pontos
			//
			new YAHOO.widget.Button("i3GEObotaoAreaWkt", {
				onclick : {
					fn : function() {
						i3GEO.mapa.dialogo.wkt2layer(i3GEOF.area.ultimoWkt, i3GEOF.area.ultimaMedida);
					}
				}
			});

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
			var ins = '<div class="bd" style="text-align:left;padding:3px;font-size:10px" >'
			// + '<label class=paragrafo style="float:left;top:5px;position:relative;">Estilo:</label>'
			// + '<div class=styled-select style="width:70px;">' + i3GEO.desenho.caixaEstilos() + '</div><br>'
			+ '<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo" ></div>'
			+ '<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo_parcial" ></div>'
			+ '<br><input id=i3GEObotaoAreaWkt size="22" type="button" value="incorporar">'
			+ '</div>';
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var minimiza, cabecalho, janela, divid, temp, titulo,imagemxy;
			if ($i("i3GEOF.area")) {
				return;
			}
			cabecalho = "";
			minimiza = "";
			// cria a janela flutuante
			titulo =
				"<div class='i3GeoTituloJanela'>"
					+ $trad("areaAprox")
					+ "<a class=ajuda_usuario target=_blank href='"
					+ i3GEO.configura.locaplic
					+ "/ajuda_usuario.php?idcategoria=6&idajuda=51' ><b> </b></a></div></div></div>";
			janela =
				i3GEO.janela.cria("220px", "auto", "", "", "", titulo, "i3GEOF.area", false, "hd", cabecalho, minimiza, "", true, "", "", "nao");
			divid = janela[2].id;
			i3GEOF.area.inicia(divid);
			temp =
				function() {
					var janela;
					i3GEO.eventos.cliquePerm.ativa();
					janela = YAHOO.i3GEO.janela.manager.find("area");
					if (janela) {
						YAHOO.i3GEO.janela.manager.remove(janela);
						janela.destroy();
					}
					i3GEOF.area[i3GEO.Interface["ATUAL"]].fechaJanela();
					i3GEO.analise.pontos = {};
				};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
			janela[0].moveTo(imagemxy[0] + 150, imagemxy[1]);
		},
		/*
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco : function() {
		},
		/**
		 * Converte a lista de pontos em WKT
		 */
		pontos2wkt : function() {
			var pontos = [], x = i3GEOF.area.pontos.xpt, y = i3GEOF.area.pontos.ypt, n = x.length, i;
			for (i = 0; i < n; i++) {
				pontos.push(x[i] + " " + y[i]);
			}
			pontos.push(x[0] + " " + y[0]);
			return "POLYGON((" + pontos.join(",") + "))";
		},
		/**
		 * Funcoes especificas da interface openlayers
		 */
		openlayers : {
			draw : "",
			estilo: "",
			featureListener : null,
			//numero de pontos da geometria atual
			//utilizado para saber se houve um clique ou nao
			numpontos : 0,
			removeControle : function() {
				i3geoOL.removeInteraction(i3GEOF.area.openlayers.draw);
				i3GEOF.area.openlayers.draw = "";
			},
			/**
			 * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
			 * layer para receber os graficos
			 */
			inicia : function() {
				var m = i3GEOF.area.openlayers;
				m.estilo = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 5
					}),
					fill: new ol.style.Fill({
						  color: 'rgba(255, 153, 0, 0.8)'
					})
				});
				i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
				m.removeControle();
				m.draw = new ol.interaction.Draw({
					type : "Polygon"
				});
				i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(false);
				m.draw.on("drawend", function(evt) {
					evt.feature.setProperties({
						origem : "i3GeoMedeArea"
					});
					var m = i3GEOF.area.openlayers;
					i3GEO.desenho.layergrafico.getSource().addFeature(evt.feature);
					m.draw.setActive(false);
					m.draw.setActive(true);
				});
				m.draw.on('drawstart', function(evt) {
					i3GEOF.area.pontos = {
						xpt : [],
						ypt : [],
						dist : []
					};
					var m = i3GEOF.area.openlayers,
						sketch = evt.feature;
					m.estilo = sketch.getStyle();
					m.numpontos = 1;
					m.featureListener = sketch.getGeometry().on('change', function(evt) {
						var ponto,
							geom = evt.target,
							coords = geom.getLinearRing(0).getCoordinates(),
							n = coords.length,
							m = i3GEOF.area.openlayers;
						ponto = new ol.geom.Point(coords[n-1]);
						if(m.numpontos === n-1){
							//clicou
							m.numpontos = n;
							m.point(ponto,geom);
						}
						else{
							m.modify(ponto,geom);
						}
					});
				});
				i3geoOL.addInteraction(m.draw);
			},
			modify : function(point,geom) {
				var temp,sourceProj,coordinates,wgs84Sphere, per, area, n, x1, y1, x2, y2, trecho, direcao,
				coord = point.getCoordinates();
				n = i3GEOF.area.pontos.ypt.length;
				if (n > 1) {
					x1 = i3GEOF.area.pontos.xpt[n - 1];
					y1 = i3GEOF.area.pontos.ypt[n - 1];
					x2 = coord[0];
					y2 = coord[1];
					// projeta
					if (i3GEO.Interface.openlayers.googleLike) {
						temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
						temp = temp.split(" ");
						x1 = temp[0];
						y1 = temp[1];
						x2 = temp[2];
						y2 = temp[3];
					}
					trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
					//parcial = i3GEOF.area.openlayers.somaDist();
					direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
					direcao = i3GEO.calculo.dd2dms(direcao, direcao);
					direcao = direcao[0];
					per = i3GEOF.area.openlayers.somaDist();
					// soma ate o primeiro ponto
					x1 = i3GEOF.area.pontos.xpt[0];
					y1 = i3GEOF.area.pontos.ypt[0];
					// projeta
					if (i3GEO.Interface.openlayers.googleLike) {
						temp = i3GEO.util.extOSM2Geo(x1 + " " + y1);
						temp = temp.split(" ");
						x1 = temp[0];
						y1 = temp[1];
					}
					per += i3GEO.calculo.distancia(x1, y1, x2, y2);
					//getGeodesicArea
					sourceProj = i3geoOL.getView().getProjection();
					geom = (geom.clone().transform(sourceProj, 'EPSG:4326'));
					coordinates = geom.getLinearRing(0).getCoordinates();
					wgs84Sphere = new ol.Sphere(6378137);
					area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
					i3GEOF.area.openlayers.mostraParcial(trecho, per, area, direcao);
				}

			},
			point : function(point,geom) {
				var wgs84Sphere,area,coordinates,sourceProj,n, x1, y1, x2, y2, trecho, temp,
				coord = point.getCoordinates(),
				total = 0;
				i3GEOF.area.pontos.xpt.push(coord[0]);
				i3GEOF.area.pontos.ypt.push(coord[1]);
				i3GEO.analise.pontos.xpt.push(coord[0]);
				i3GEO.analise.pontos.ypt.push(coord[1]);
				n = i3GEOF.area.pontos.ypt.length;
				if (n > 1) {
					x1 = i3GEOF.area.pontos.xpt[n - 2];
					y1 = i3GEOF.area.pontos.ypt[n - 2];
					x2 = coord[0];
					y2 = coord[1];
					raio = new ol.geom.LineString([[x1, y1],[x2, y2]]).getLength();
					// projeta
					if (i3GEO.Interface.openlayers.googleLike) {
						temp = i3GEO.util.extOSM2Geo(x1 + " " + y1 + " " + x2 + " " + y2);
						temp = temp.split(" ");
						x1 = temp[0];
						y1 = temp[1];
						x2 = temp[2];
						y2 = temp[3];
					}
					trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
					i3GEOF.area.pontos.dist.push(trecho);
					total = i3GEOF.area.openlayers.somaDist();

					sourceProj = i3geoOL.getView().getProjection();
					geom = (geom.clone().transform(sourceProj, 'EPSG:4326'));
					coordinates = geom.getLinearRing(0).getCoordinates();
					wgs84Sphere = new ol.Sphere(6378137);
					area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

					i3GEOF.area.openlayers.mostraTotal(total, area);
					i3GEOF.area.ultimoWkt = i3GEOF.area.pontos2wkt();
				}
			},
			/**
			 * Soma os valores de distancia guardados em pontos.dist
			 */
			somaDist : function() {
				var n, i, total = 0;
				n = i3GEOF.area.pontos.dist.length;
				for (i = 0; i < n; i++) {
					total += i3GEOF.area.pontos.dist[i];
				}
				return total;
			},
			/**
			 * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
			 * atributo "origem" Os raios e pontos sao sempre removidos
			 */
			fechaJanela : function() {
				i3GEO.Interface.openlayers.parametrosMap.interactions[0].setActive(true);
				var m = i3GEOF.area.openlayers;
				ol.Observable.unByKey(m.featureListener);
				m.featureListener = null;
				m.removeControle();
				m.numpontos = 0;
				i3GEO.eventos.cliquePerm.ativa();

				var features, n, f, i, remover = [], temp;
				features = i3GEO.desenho.layergrafico.getSource().getFeatures();
				n = features.length;
				for (i = 0; i < n; i++) {
					f = features[i];
					if (f.getProperties().origem === "i3GeoMedeArea" || f.getProperties().origem === "medeAreaExcluir") {
						remover.push(f);
					}
				}
				if (remover.length > 0) {
					temp = window.confirm($trad("x94"));
					if (temp) {
						for (r in remover) {
							i3GEO.desenho.layergrafico.getSource().removeFeature(remover[r]);
						}
					}
				}
			},
			/**
			 * Mostra a totalizacao das linhas ja digitalizadas
			 */
			mostraTotal : function(per, area) {
				var mostra = $i("mostraarea_calculo"), texto;
				if (mostra) {
					texto =
						"<b>" + $trad("d21at")
							+ ":</b> "
							+ (area / 1000000).toFixed(3)
							+ " km2"
							+ "<br><b>"
							+ $trad("d21at")
							+ ":</b> "
							+ (area / 10000).toFixed(2)
							+ " ha"
							+ "<br><b>"
							+ $trad("x98")
							+ ":</b> "
							+ (per).toFixed(2)
							+ " km"
							+ "<br>"
							+ $trad("x25")
							+ ": "
							+ i3GEO.calculo.metododistancia;
					mostra.innerHTML = texto;
					i3GEOF.area.ultimaMedida = (area / 1000000).toFixed(3) + " km2";
				}
			},
			/**
			 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
			 */
			mostraParcial : function(trecho, per, area, direcao) {
				var mostra = $i("mostraarea_calculo_parcial"), texto;
				if (mostra) {
					texto =
						"<b>" + $trad("d21at")
							+ ":</b> "
							+ (area / 1000000).toFixed(3)
							+ " km2"
							+ "<br><b>"
							+ $trad("d21at")
							+ ":</b> "
							+ (area / 10000).toFixed(2)
							+ " ha"
							+ "<br><b>"
							+ $trad("x95")
							+ ":</b> "
							+ trecho.toFixed(3)
							+ " km"
							+ "<br><b>"
							+ $trad("x98")
							+ ":</b> "
							+ (per).toFixed(3)
							+ " km"
							+ "<br><b>"
							+ $trad("x23")
							+ " (DMS):</b> "
							+ direcao;
					mostra.innerHTML = texto;
				}
			}
		},
		googlemaps : {
			/**
			 * Inicializa o processo Cria a variavel para guardar os pontos Executa a funcao de inicializacao do desenho, que cria o
			 * layer para receber os graficos
			 */
			inicia : function() {
				i3GEOF.area.pontos = {
					xpt : [],
					ypt : [],
					dist : []
				};
				if (!google.maps.geometry) {
					alert($trad("x99"));
					return;
				}
				i3GEO.desenho[i3GEO.Interface["ATUAL"]].inicia();
				i3GeoMap.setOptions({
					disableDoubleClickZoom : true
				});
				i3GeoMap.setOptions({
					draggableCursor : 'crosshair'
				});
				var evtdblclick = null, evtclick = null, evtmousemove = null, pontos = {
					xpt : [],
					ypt : [],
					dist : [],
					mvcLine : new google.maps.MVCArray(),
					mvcMarkers : new google.maps.MVCArray(),
					line : null,
					polygon : null
				}, termina = function() {
					google.maps.event.removeListener(evtdblclick);
					google.maps.event.removeListener(evtclick);
					google.maps.event.removeListener(evtmousemove);
					pontos.line.setOptions({
						clickable : true
					});
					google.maps.event.addListener(pontos.line, 'click', function(shape) {
						if (shape.setEditable) {
							shape.setEditable(!shape.editable);
						}
					});
					if (pontos) {
						i3GEO.desenho.googlemaps.shapes.push(pontos.mvcLine);
						i3GEO.desenho.googlemaps.shapes.push(pontos.line);
						pontos = null;
					}
					i3GEOF.area.ultimoWkt = i3GEOF.area.pontos2wkt();
				};
				evtclick = google.maps.event.addListener(i3GeoMap, "click", function(evt) {
					var area = 0, per;
					// When the map is clicked, pass the LatLng obect to the
					// measureAdd function
					pontos.mvcLine.push(evt.latLng);
					pontos.xpt.push(evt.latLng.lng());
					pontos.ypt.push(evt.latLng.lat());
					i3GEOF.area.pontos.xpt.push(evt.latLng.lng());
					i3GEOF.area.pontos.ypt.push(evt.latLng.lat());
					// desenha um circulo
					if (pontos.mvcLine.getLength() > 0) {
						per = google.maps.geometry.spherical.computeLength(pontos.mvcLine);
						area = google.maps.geometry.spherical.computeArea(pontos.mvcLine);
						i3GEOF.area.googlemaps.mostraTotal(per, area);
					}
					// desenha uma marca no ponto
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
						origem : "medeAreaExcluir"
					}));
					// mais um ponto para criar uma linha movel
					pontos.mvcLine.push(evt.latLng);
				});
				evtmousemove =
					google.maps.event.addListener(i3GeoMap, "mousemove", function(evt) {
						if (!$i("mostraarea_calculo")) {
							termina.call();
							return;
						}
						var x1, y1, x2, y2, direcao, per, area, estilo = i3GEO.desenho.estilos[i3GEO.desenho.estiloPadrao], n =
							pontos.xpt.length;

						// If there is more than one vertex on the line
						if (pontos.mvcLine.getLength() > 0) {
							// If the line hasn't been created yet
							if (!pontos.line) {
								// Create the line (google.maps.Polyline)
								pontos.line = new google.maps.Polygon({
									map : i3GeoMap,
									clickable : false,
									strokeColor : estilo.linecolor,
									strokeOpacity : 1,
									strokeWeight : estilo.linewidth,
									path : pontos.mvcLine,
									origem : "medeArea"
								});
							}
							pontos.mvcLine.pop();
							pontos.mvcLine.push(evt.latLng);
							per = google.maps.geometry.spherical.computeLength(pontos.mvcLine);
							x1 = pontos.xpt[n - 1];
							y1 = pontos.ypt[n - 1];
							x2 = evt.latLng.lng();
							y2 = evt.latLng.lat();
							trecho = i3GEO.calculo.distancia(x1, y1, x2, y2);
							direcao = i3GEO.calculo.direcao(x1, y1, x2, y2);
							direcao = i3GEO.calculo.dd2dms(direcao, direcao);
							direcao = direcao[0];
							area = google.maps.geometry.spherical.computeArea(pontos.mvcLine);
							i3GEOF.area.googlemaps.mostraParcial(trecho, per, area, direcao);
						}
					});
				evtdblclick =
					google.maps.event.addListener(i3GeoMap, "dblclick", function(evt) {
						pontos.mvcLine.push(new google.maps.LatLng(pontos.ypt[0], pontos.xpt[0]));
						var per = google.maps.geometry.spherical.computeLength(pontos.mvcLine), area =
							google.maps.geometry.spherical.computeArea(pontos.mvcLine);
						i3GEOF.area.googlemaps.mostraTotal(per, area);
						termina.call();
					});
			},
			/**
			 * Soma os valores de distancia guardados em pontos.dist
			 */
			somaDist : function(pontos) {
				var n, i, total = 0;
				n = pontos.dist.length;
				for (i = 0; i < n; i++) {
					total += pontos.dist[i];
				}
				return total;
			},
			/**
			 * Fecha a janela que mostra os dados Pergunta ao usuario se os graficos devem ser removidos Os graficos sao marcados com o
			 * atributo "origem" Os raios e pontos sao sempre removidos
			 */
			fechaJanela : function() {
				i3GeoMap.setOptions({
					disableDoubleClickZoom : false
				});
				i3GeoMap.setOptions({
					draggableCursor : undefined
				});
				var f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "medeArea");
				if (f && f.length > 0) {
					temp = window.confirm($trad("x94"));
					if (temp) {
						i3GEO.desenho.googlemaps.destroyFeatures(f);
					}
				}
				f = i3GEO.desenho.googlemaps.getFeaturesByAttribute("origem", "medeAreaExcluir");
				if (f && f.length > 0) {
					i3GEO.desenho.googlemaps.destroyFeatures(f);
				}
			},
			/**
			 * Mostra a totalizacao das linhas ja digitalizadas
			 */
			mostraTotal : function(per, area) {
				var mostra = $i("mostraarea_calculo"), texto;
				if (mostra) {
					texto =
						"<b>" + $trad("d21at")
							+ ":</b> "
							+ (area / 1000000).toFixed(3)
							+ " km2"
							+ "<br><b>"
							+ $trad("d21at")
							+ ":</b> "
							+ (area / 10000).toFixed(2)
							+ " ha"
							+ "<br><b>"
							+ $trad("x98")
							+ ":</b> "
							+ (per).toFixed(2)
							+ " km"
							+ "<br>"
							+ $trad("x25")
							+ ": "
							+ i3GEO.calculo.metododistancia;
					mostra.innerHTML = texto;
					i3GEOF.area.ultimaMedida = (area / 1000000).toFixed(3) + " km2";
				}
			},
			/**
			 * Mostra o valor do trecho entre o ultimo ponto clicado e a posicao do mouse
			 */
			mostraParcial : function(trecho, per, area, direcao) {
				var mostra = $i("mostraarea_calculo_parcial"), texto;
				if (mostra) {
					texto =
						"<b>" + $trad("d21at")
							+ ":</b> "
							+ (area / 1000000).toFixed(3)
							+ " km2"
							+ "<br><b>"
							+ $trad("d21at")
							+ ":</b> "
							+ (area / 10000).toFixed(2)
							+ " ha"
							+ "<br><b>"
							+ $trad("x95")
							+ ":</b> "
							+ trecho.toFixed(3)
							+ " km"
							+ "<br><b>"
							+ $trad("x98")
							+ ":</b> "
							+ (per).toFixed(3)
							+ " km"
							+ "<br><b>"
							+ $trad("x23")
							+ " (DMS):</b> "
							+ direcao;
					mostra.innerHTML = texto;
				}
			}
		}
	};