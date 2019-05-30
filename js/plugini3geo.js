if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.pluginI3geo =
{
	OBJETOS : {},
	/**
	 * Lista de plugins
	 *
	 * Utilizado no editor de mapfiles do sistema de administracao
	 */
	//XXX criar plugin que aceite um JSON generico
	PLUGINS : [
	    {
		"classe" : "heatmap", // namespace da classe
		"nome" : "Mapa de calor", // tituo do plugin
		"editor" : true
		// inclui no editor de mapfiles
	    }, {
		"classe" : "markercluster",
		"nome" : "Agrupamento de pontos (cluster)",
		"editor" : true
	    }, {
		"classe" : "layerkml",
		"nome" : "Camada Kml",
		"editor" : true
	    }, {
		"classe" : "parametrossql",
		"nome" : "SQL parametrizado",
		"editor" : true
	    }, {
		"classe" : "layergeojson",
		"nome" : "Camada GeoJson",
		"editor" : true
	    }
	    ],
	    /**
	     * Inicia a execucao de um plugin
	     *
	     * Camada e um objeto gerado pelo i3Geo quando uma camada e adicionada ao mapa O objeto i3GEO.arvoreDeCamadas.CAMADAS guarda todas
	     * as camadas adicionadas ao mapa Ao adicionar uma camada pelo catalogo, o i3Geo verifica se a camada possui plugin e direciona para
	     * ca Os plugins sao definidos como metadados em cada mapfile de cada tema
	     *
	     * Veja em i3geo/classesphp/classe_mapa.php funcao parametrostemas
	     */
	    inicia : function(camada) {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.pluginI3geo.inicia()");

		if(camada.plugini3geo){
		    // chama a funcao conforme o tipo de plugin e a interface atual
		    // para cada plugin deve haver um objeto com as funcoes especificas
		    // para
		    // cada interface
		    i3GEO.pluginI3geo[camada.plugini3geo.plugin].inicia(camada);
		}
	    },
	    /**
	     * Retorna o HTML com o formulario para editar os parametros do plugin
	     */
	    formAdmin : function(plugin, configString, onde) {
		var html = i3GEO.pluginI3geo[plugin].formAdmin(configString,onde);
		if(!onde){
		    return html;
		} else {
		    return false;
		}
	    },
	    /**
	     * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
	     * utilizado para reabrir o formulario de parametros
	     */
	    iconeArvoreDeCamadas : function(camada) {
		if (camada.plugini3geo && camada.plugini3geo != "") {
		    return i3GEO.pluginI3geo[camada.plugini3geo.plugin].iconeArvoreDeCamadas(camada.name);
		} else {
		    return false;
		}
	    },
	    clickArvoreDeCamadas : function(camada) {
		if (camada.plugini3geo && camada.plugini3geo != "") {
		    return i3GEO.pluginI3geo[camada.plugini3geo.plugin].clickArvoreDeCamadas(camada.name);
		} else {
		    return false;
		}
	    },
	    linkAjuda : function(plugin) {
		return i3GEO.pluginI3geo[plugin].linkAjuda();
	    },
	    ligaCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada) {
		    i3GEO.pluginI3geo.OBJETOS[nomecamada].ligaCamada();
		    return true;
		}
		return false;
	    },
	    desligaCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada) {
		    i3GEO.pluginI3geo.OBJETOS[nomecamada].desLigaCamada();
		    return true;
		}
		return false;
	    },
	    removeCamada : function(nomecamada) {
		if (i3GEO.pluginI3geo.OBJETOS[nomecamada] && i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada) {
		    i3GEO.pluginI3geo.OBJETOS[nomecamada].removeCamada();
		    i3GEO.pluginI3geo.OBJETOS[nomecamada] = false;
		    delete (i3GEO.pluginI3geo.OBJETOS[nomecamada]);
		    return true;
		}
		return false;
	    },
	    atualizaCamada : function(nomecamada) {
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
	     * tema e fornecido por i3GEO.arvoreDeCamadas o ajuste das propriedades e necessario para que as propriedades aparecam de forma
	     * correta na arvore de camadas
	     */
	    aplicaPropriedades : function(camada) {
		if (camada.plugini3geo && camada.plugini3geo != "") {
		    camada = i3GEO.pluginI3geo[camada.plugini3geo.plugin].aplicaPropriedades(camada);
		}
		return camada;
	    },
	    /**
	     * Cria um layer conforme a API em uso no aplicativo mashup
	     *
	     * Parametros
	     *
	     * {string} - nome da interface em uso openlayers|googlemaps
	     *
	     * {objeto} - objeto camada, conforme definido em i3GEO.arvoreDeCamadas.CAMADAS
	     *
	     * {string} - codigo epsg que sera usado no WMS
	     *
	     * {parametros} - objeto com parametros adicionais especificos da interface em uso
	     */
	    layerMashup : function(Interface, camada, epsg, parametros) {
		if (camada.plugini3geo && camada.plugini3geo != "" && i3GEO.pluginI3geo[camada.plugini3geo.plugin][Interface].layerMashup) {
		    var l = i3GEO.pluginI3geo[camada.plugini3geo.plugin][Interface].layerMashup(camada, epsg, parametros);
		    return l;
		} else {
		    return [
			false
			];
		}
	    },
	    /**
	     * Section: i3GEO.pluginI3geo.heatmap
	     *
	     * Mapa de calor
	     *
	     * Gera um layer do tipo mapa de calor e adiciona ao mapa
	     *
	     * As depend&ecirc;ncias em javascript sao carregadas via script tag por meio de ferramentas/heatmap
	     *
	     * Esse programa tamb&eacute;m obt&eacute;m os dados necess&aacute;rios ao plugin
	     *
	     * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	     *
	     * Esse matadado deve conter uma string que ser&aacute; transformada em um objeto javascript para uso no plugin
	     *
	     * Exemplo:
	     *
	     * "PLUGINI3GEO" '{"plugin":"heatmap","parametros":{"tipoGradiente": "default","coluna":"teste","max":"10","radius":"15"}}'
	     *
	     * Coluna &eacute; a que cont&eacute;m os dados num&eacute;ricos que definem a quantidade de uma medida em cada ponto e &eacute;
	     * usada para gerar a representa&ccedil;&atilde;o. Se for vazia, considera-se o valor como 1
	     *
	     * As cores das classes existentes no LAYER ser&atilde;o utilizadas para calcular as cores do mapa de calor. Se tipoGradiente for
	     * igual a "default" ser&aacute; utilizado o gradiente padrão.
	     *
	     */
	    heatmap : {
		linkAjuda : function() {
		    return i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=121";
		},
		formAdmin : function(config,onde,tema,salva,remove) {
		    if(!i3GEO.template.heatmap){
			var t1 = i3GEO.configura.locaplic + "/js/templates/heatmapForm_mst.html";
			$.get(t1).done(function(r1) {
			    i3GEO.template.heatmap = r1;
			    i3GEO.pluginI3geo.heatmap.formAdmin(config,onde,tema,salva,remove);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		    }
		    var mustache,parametros, ins = "", configDefault = '{"plugin":"heatmap","parametros":{"tipoGradiente": "default","valorPonto":1,"coluna":"","radius":15}}';
		    if (config === "") {
			config = configDefault;
		    }
		    config = JSON.parse(config);
		    if (config.plugin != "heatmap") {
			config = JSON.parse(configDefault);
		    }
		    parametros = config.parametros;
		    mustache = {
			    "coluna": parametros.coluna,
			    "valorPonto": parametros.valorPonto,
			    "radius" : parametros.radius,
			    "tipoGradiente": parametros.tipoGradiente,
			    "linkAjuda": i3GEO.pluginI3geo.linkAjuda("layerkml"),
			    "tema": tema,
			    "salvaPlugin": salva,
			    "removePlugin": remove
		    };
		    ins = Mustache.render(
			    i3GEO.template.heatmap,
			    $.extend(
				    {},
				    mustache,
				    i3GEO.idioma.OBJETOIDIOMA
			    )
		    );
		    if($i(onde)){
			$i(onde).innerHTML = ins;
			return false;
		    } else {
			return ins;
		    }
		},
		/**
		 * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
		 * utilizado para reabrir o formulario de parametros
		 */
		iconeArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
		clickArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
		//
		// O script que adiciona a camada
		// define os eventos visibilitychanged, moveend e removed
		// A camada e adicionada como um objeto layer, permitindo que as
		// funcoes
		// do i3Geo operem normalmente, sem muitas modificacoes
		//
		openlayers : {
		    aplicaPropriedades : function(camada) {
			camada.sel = "nao";
			camada.download = "nao";
			camada.temporizador = "";
			camada.copia = false;
			camada.procurar = false;
			camada.toponimia = false;
			camada.etiquetas = false;
			camada.tabela = false;
			camada.grafico = false;
			camada.destacar = false;
			camada.wms = false;
			camada.classe = "SIM";
			return camada;
		    },
		    layerMashup : function(camada, epsg){
			i3GEO.pluginI3geo.heatmap.openlayers.inicia(camada,i3geoOL);
			return [];
		    },
		    inicia : function(camada, objMapa) {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.pluginI3geo.inicia heatmap");

			var p = i3GEO.configura.locaplic + "/ferramentas/heatmap/openlayers_js.php",criaLayer;
			criaLayer = function() {
			    if (typeof (console) !== 'undefined')
				console.info("criaLayer heatmap");

			    var g, v = true, temp, heatmap, data = heatmap_dados, datalen = heatmap_dados.length, nudata = [];
			    // para uso com o mashup
			    if (!objMapa) {
				objMapa = i3geoOL;
			    }
			    while (datalen--) {
				temp = heatmap_dados[datalen].count;
				g = new ol.geom.Point([data[datalen].lng * 1,data[datalen].lat * 1]);
				g = i3GEO.util.projGeo2OSM(g);
				nudata.push(new ol.Feature({
				    geometry: g,
				    weight: temp
				})
				);
			    }
			    // create our heatmap layer
			    if(camada.status === "0"){
				v = false;
			    }
			    if(!camada.plugini3geo.parametros.max){
				camada.plugini3geo.parametros.max = 10;
			    }
			    heatmap = new ol.layer.Heatmap({
				source: new ol.source.Vector({
				    features : nudata
				}),
				blur: camada.plugini3geo.parametros.max * 1,
				title: camada.tema,
				opacity: (camada.transparency * 1) / 100,
				radius: camada.plugini3geo.parametros.radius * 1,
				name : camada.name,
				isBaseLayer : false,
				visible : v
			    });
			    i3GEO.pluginI3geo.OBJETOS[camada.name] = heatmap;
			    objMapa.addLayer(heatmap);
			    heatmap_dados = null;
			    if (i3GEO.janela) {
				i3GEO.janela.fechaAguarde("aguardePlugin");
			    }
			};
			if (!i3GEO.configura || !i3GEO.configura.sid) {
			    i3GEO.configura.sid = "";
			}
			p +=
			    "?layer="
			    + camada.name
			    + "&coluna="
			    + camada.plugini3geo.parametros.coluna
			    + "&tipoGradiente="
			    + camada.plugini3geo.parametros.tipoGradiente
			    + "&g_sid="
			    + i3GEO.configura.sid
			    + "&nomevariavel=heatmap_dados&nomevariavelConfig=heatmap_config";
			i3GEO.util.scriptTag(p, criaLayer, "");
		    }
		}
	    },
	    /**
	     * Section: i3GEO.pluginI3geo.markercluster
	     *
	     * Markercluster
	     *
	     * Gera um layer que agrupa pontos conforme a dist&acirc;ncia entre eles e insere um contador adiciona ao mapa
	     *
	     * As depend&ecirc;ncias em javascript sao carregadas via script tag por meio de ferramentas/markercluster
	     *
	     * Esse programa tamb&eacute;m obt&eacute;m os dados necess&aacute;rios ao plugin
	     *
	     * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	     *
	     * Esse matadado deve conter uma string que ser&aacute; transformada em um objeto javascript para uso no plugin
	     *
	     * Exemplo:
	     *
	     * "PLUGINI3GEO" '{"plugin":"markercluster","parametros":{"coluna":"teste","gridSize":"50"}}'
	     *
	     * Coluna &eacute; a que cont&eacute;m os dados num&eacute;ricos que definem a quantidade de uma medida em cada ponto e &eacute;
	     * usada para gerar a representa&ccedil;&atilde;o. Se for vazia, considera-se o valor como 1
	     *
	     */
	    markercluster : {
		linkAjuda : function() {
		    return i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=122";
		},
		formAdmin : function(config,onde,tema,salva,remove) {
		    if(!i3GEO.template.markercluster){
			var t1 = i3GEO.configura.locaplic + "/js/templates/markerclusterForm_mst.html";
			$.get(t1).done(function(r1) {
			    i3GEO.template.markercluster = r1;

			    i3GEO.pluginI3geo.markercluster.formAdmin(config,onde,tema,salva,remove);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		    }
		    var mustache,parametros, ins = "", configDefault =
			'{"plugin":"markercluster","parametros":{"tipoEstilos": "default","textcolor":"#fff","strokecolor":"#fff","color":"#3399CC","gridSize":"50"}}';
		    if (config === "") {
			config = configDefault;
		    }
		    config = JSON.parse(config);
		    if (config.plugin != "markercluster") {
			config = JSON.parse(configDefault);
		    }
		    parametros = config.parametros;
		    mustache = {
			    "gridSize": parametros.gridSize,
			    "tipoEstilos": parametros.tipoEstilos,
			    "color": i3GEO.util.hex2rgb(parametros.color),
			    "strokecolor": i3GEO.util.hex2rgb(parametros.strokecolor),
			    "textcolor": i3GEO.util.hex2rgb(parametros.textcolor),
			    "linkAjuda": i3GEO.pluginI3geo.linkAjuda("markercluster"),
			    "tema": tema,
			    "salvaPlugin": salva,
			    "removePlugin": remove
		    };
		    ins = Mustache.render(
			    i3GEO.template.markercluster,
			    $.extend(
				    {},
				    mustache,
				    i3GEO.idioma.OBJETOIDIOMA
			    )
		    );
		    if($i(onde)){
			$i(onde).innerHTML = ins;
			i3GEO.util.aplicaAquarela(onde);
			return false;
		    } else {
			return ins;
		    }
		},
		parametrosFormAdmin : function(onde) {
		    return '{"plugin":"markercluster","parametros":{"tipoEstilos": "'+$i("MCtipoEstilos").value+'","textcolor":"'+i3GEO.util.rgb2hex($i("MCtextcolor").value)+'","strokecolor":"'+i3GEO.util.rgb2hex($i("MCstrokecolor").value)+'","color":"'+i3GEO.util.rgb2hex($i("MCcolor").value)+'","gridSize":"'+$i("MCgridSize").value+'"}}';
		},
		/**
		 * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
		 * utilizado para reabrir o formulario de parametros
		 */
		iconeArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
		clickArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
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
		    layerMashup : function(camada, epsg){
			i3GEO.pluginI3geo.markercluster.openlayers.inicia(camada,i3geoOL);
			return [];
		    },
		    inicia : function(camada, objMapa) {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.pluginI3geo.inicia markercluster");

			// para uso com o mashup
			if (!objMapa) {
			    objMapa = i3geoOL;
			}
			var nomeScript = "markercluster_script", p = i3GEO.configura.locaplic + "/ferramentas/markercluster/openlayers_js.php", carregaJs =
			    "nao", criaLayer;
			criaLayer = function() {
			    if (typeof (console) !== 'undefined')
				console.info("criando layer markercluster");

			    var layerListeners, logMax, logMin, classes, min, max, markercluster = {}, marcas, lonlat, n, i, style, nestilos, intervalo, regra, regras =
				[];

			    marcas = [];
			    n = markercluster_dados.length;
			    for (i = 0; i < n; i++) {
				//console.info([markercluster_dados[i].lng * 1,markercluster_dados[i].lat * 1])
				marcas.push(
					new ol.Feature({
					    geometry: i3GEO.util.projGeo2OSM(new ol.geom.Point([markercluster_dados[i].lng * 1,markercluster_dados[i].lat * 1])),
					    weight: markercluster_dados[i].count
					})
				);
			    }
			    var source = new ol.source.Vector({
				features: marcas
			    });
			    var clusterSource = new ol.source.Cluster({
				distance: camada.plugini3geo.parametros.gridSize,
				source: source
			    });
			    var styleCache = {};
			    var v = true;
			    if(parseInt(camada.status,10) === 0){
				v = false;
			    }
			    markercluster = new ol.layer.Vector({
				opacity: (camada.transparency * 1) / 100,
				title: camada.tema,
				name : camada.name,
				isBaseLayer : false,
				visible : v,
				source: clusterSource,
				style: function(feature) {
				    var size = feature.get('features').length;
				    var r = 10;
				    if(size > 9){
					r = 7 * (size + "").length;
				    }
				    var style = styleCache[size];
				    if (!style) {
					if(size == 1){
					    style = new ol.style.Style({
						image: new ol.style.Circle({
						    radius: 6,
						    stroke: new ol.style.Stroke({
							color: camada.plugini3geo.parametros.strokecolor
						    }),
						    fill: new ol.style.Fill({
							color: camada.plugini3geo.parametros.color
						    })
						})
					    });
					    styleCache[size] = style;

					} else {
					    style = new ol.style.Style({
						image: new ol.style.Circle({
						    radius: r,
						    stroke: new ol.style.Stroke({
							color: camada.plugini3geo.parametros.strokecolor
						    }),
						    fill: new ol.style.Fill({
							color: camada.plugini3geo.parametros.color
						    })
						}),
						text: new ol.style.Text({
						    text: size.toString(),
						    fill: new ol.style.Fill({
							color: camada.plugini3geo.parametros.textcolor
						    }),
						    stroke: new ol.style.Stroke({
							color: 'rgba(0, 0, 0, 0.6)',
							width: 1
						    })
						})
					    });
					    styleCache[size] = style;
					}
				    }
				    return style;
				}
			    });
			    i3GEO.janela.fechaAguarde("aguardePlugin");
			    i3GEO.pluginI3geo.OBJETOS[camada.name] = markercluster;
			    markercluster_dados = null;
			    objMapa.addLayer(markercluster);
			};
			// se o script nao existir carrega o codigo e os dados
			// caso contrario, carrega apenas os dados no script
			if (!$i(nomeScript)) {
			    carregaJs = "sim";
			} else {
			    nomeScript = "";
			}
			p +=
			    "?carregajs=" + carregaJs
			    + "&layer="
			    + camada.name
			    + "&g_sid="
			    + i3GEO.configura.sid
			    + "&tipoEstilos="
			    + camada.plugini3geo.parametros.tipoEstilos;
			i3GEO.util.scriptTag(p, criaLayer, nomeScript);
		    }
		}
	    },
	    /**
	     * Section: i3GEO.pluginI3geo.layerkml
	     *
	     * Adiciona ao mapa uma camada vetorial baseada em um arquivo Kml
	     *
	     * As depend&ecirc;ncias em javascript sao carregadas via script tag por meio de ferramentas/markercluster
	     *
	     * Esse programa tamb&eacute;m obt&eacute;m os dados necess&aacute;rios ao plugin
	     *
	     * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	     *
	     * Esse matadado deve conter uma string que ser&aacute; transformada em um objeto javascript para uso no plugin
	     *
	     * Exemplo:
	     *
	     * "PLUGINI3GEO" '{"plugin":"layerkml","parametros":{"url":"teste"}}'
	     *
	     */
	    layerkml : {
		linkAjuda : function() {
		    return i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=126";
		    // http://localhost/i3geo/aplicmap/dados/sundials.kml
		    // http://dev.openlayers.org/examples/kml/sundials.kml
		},
		formAdmin : function(config,onde,tema,salva,remove) {
		    if(!i3GEO.template.layerkml){
			var t1 = i3GEO.configura.locaplic + "/js/templates/layerkmlForm_mst.html";
			$.get(t1).done(function(r1) {
			    i3GEO.template.layerkml = r1;
			    i3GEO.pluginI3geo.layerkml.formAdmin(config,onde,tema,salva,remove);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		    }
		    var mustache,parametros, ins = "", configDefault = '{"plugin":"layerkml","parametros":{"url": ""}}';
		    if (config === "") {
			config = configDefault;
		    }
		    config = JSON.parse(config);
		    if (config.plugin != "layerkml") {
			config = JSON.parse(configDefault);
		    }
		    parametros = config.parametros;
		    mustache = {
			    "url": parametros.url,
			    "linkAjuda": i3GEO.pluginI3geo.linkAjuda("layerkml"),
			    "tema": tema,
			    "salvaPlugin": salva,
			    "removePlugin": remove
		    };
		    ins = Mustache.render(
			    i3GEO.template.layerkml,
			    $.extend(
				    {},
				    mustache,
				    i3GEO.idioma.OBJETOIDIOMA
			    )
		    );
		    if($i(onde)){
			$i(onde).innerHTML = ins;
			return false;
		    } else {
			return ins;
		    }
		},
		/**
		 * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
		 * utilizado para reabrir o formulario de parametros
		 */
		iconeArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
		clickArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
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
		    layerMashup : function(camada, epsg){
			i3GEO.pluginI3geo.layerkml.openlayers.inicia(camada,i3geoOL);
			return [];
		    },
		    inicia : function(camada) {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.pluginI3geo.inicia layerkml");

			var layerkml, url, temp;
			url = i3GEO.configura.locaplic + "/ferramentas/layerkml/getkml.php?sid=" + i3GEO.configura.sid + "&tema=" + camada.name;
			layerkml = new ol.layer.Vector({
			    name : camada.name,
			    isBaseLayer : false,
			    source : new ol.source.Vector({
				url : url,
				format : new ol.format.KML({
				    extractStyles : true
				}),
				tipoServico : "kml"
			    })
			});
			i3geoOL.addLayer(layerkml);
			i3GEO.pluginI3geo.OBJETOS[camada.name] = layerkml;
		    }
		}
	    },
	    /**
	     * Section: i3GEO.pluginI3geo.parametrossql
	     *
	     * Adiciona ao mapa uma camada vetorial baseada em um arquivo mapfile normal por&eacute;m permite substituir par&acirc;metros no
	     * item DATA do LAYER
	     *
	     * Com o plugin, o i3GEO ir&aacute; mostrar um formul&aacute;rio com par&acirc;metros quando o usu&aacute;rio adicionar uma camada
	     * ao mapa
	     *
	     * O formul&aacute;rio colhe os valores que ser&atilde;o utilizados para substituir chaves inseridas no SQL
	     *
	     * O layer existente no mapfile deve conter um metadata chamado PLUGINI3GEO
	     *
	     * Esse matadado deve conter uma string que ser&aacute; transformada em um objeto javascript para uso no plugin
	     *
	     * Ver ferramentas/parametrossql
	     *
	     * Exemplo:
	     *
	     * "PLUGINI3GEO"
	     * '{"plugin":"parametrossql","parametros":{[{"titulo":"","tipo":"input|select","valores":[],"chave":"","prog":"","ativo":sim|nao}]}}'
	     *
	     * A op&ccedil;&atilde;o &quot;ativo&quot; indica se o formul&aacute;rio ser&aacute; aberto ou n&atilde;o quando a camada for
	     * adicionada ao mapa
	     */
	    parametrossql : {
		linkAjuda : function() {
		    return i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=127";
		},
		formAdmin : function(config,onde,tema,salva,remove) {
		    if (typeof (console) !== 'undefined')
			console.info("i3GEO.pluginI3geo.parametrossql.formAdmin()");

		    if(!i3GEO.template.parametrossql){
			var t1 = i3GEO.configura.locaplic + "/js/templates/parametrossqlForm_mst.html";
			$.get(t1).done(function(r1) {
			    i3GEO.template.parametrossql = r1;
			    i3GEO.pluginI3geo.parametrossql.formAdmin(config,onde,tema,salva,remove);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		    }
		    var linhas=[],temp,mustache, n, i, parametros, ins = "", configDefault =
			'{"plugin":"parametrossql","id":"","ativo":"sim","janela":{"w":"300px","h":"400px","left":"","top":""},"parametros":[{"titulo":"","tipo":"input","required":"sim","valores":[],"nomes":[],"chave":"","prog":"","type":"text"},{"titulo":"","tipo":"input","required":"sim","valores":[],"chave":"","prog":"","type":"text"},{"titulo":"","tipo":"input","required":"sim","valores":[],"chave":"","prog":"","type":"text"},{"titulo":"","tipo":"input","required":"sim","valores":[],"chave":"","prog":"","type":"text"}]}';
		    if (config === "") {
			config = configDefault;
		    }
		    config = JSON.parse(config);
		    if (config.plugin != "parametrossql") {
			config = JSON.parse(configDefault);
		    }
		    parametros = config.parametros;
		    n = parametros.length;
		    if (config.ativo == undefined || config.ativo == "sim") {
			config.ativoSim = "selected";
			config.ativoNao = "";
		    } else {
			config.ativoSim = "";
			config.ativoNao = "selected";
		    }

		    //parametros da janela
		    if (config.janela == undefined) {
			config.janela = JSON.parse(configDefault).janela;
		    }
		    if (config.id == undefined) {
			config.id = "";
		    }
		    for (i = 0; i < n; i++) {
			temp = {};
			if(!parametros[i].type){
			    parametros[i].type = "text";
			}
			if(!parametros[i].required){
			    parametros[i].required = "nao";
			}
			if(!parametros[i].nomes){
			    parametros[i].nomes = "";
			}
			temp.titulo = parametros[i].titulo;
			temp.chave = parametros[i].chave;
			temp.tipo = parametros[i].tipo;
			temp.valores = parametros[i].valores;
			temp.nomes = parametros[i].nomes;
			temp.prog = parametros[i].prog;
			temp.type = parametros[i].type;
			temp.required = parametros[i].required;
			linhas.push(temp);
		    }
		    mustache = {
			    "ativo": config.ativo,
			    "tema": tema,
			    "linhas": linhas,
			    "ativoSim": config.ativoSim,
			    "ativoNao": config.ativoNao,
			    "salvaPlugin": salva,
			    "removePlugin": remove,
			    "janelaw": config.janela.w,
			    "janelah": config.janela.h,
			    "janelatop": config.janela.top,
			    "janelaleft": config.janela.left,
			    "id": config.id
		    };
		    ins = Mustache.render(
			    i3GEO.template.parametrossql,
			    $.extend(
				    {},
				    mustache,
				    i3GEO.idioma.OBJETOIDIOMA
			    )
		    );
		    if($i(onde)){
			$i(onde).innerHTML = ins;
			return false;
		    } else {
			return ins;
		    }
		},
		// pega os valores do formulario quando e aberto no sistema de
		// administracao
		parametrosFormAdmin : function(onde) {
		    var janela, nparametros = 8,
		    campos = $i("parametrosSqlTabela").getElementsByTagName("input"),
		    ncampos = campos.length,
		    par = [], temp = [], i, j;

		    for (j = 0; j < ncampos ; j = j + nparametros) {
			temp = [];
			for (i = 0; i < nparametros; i++) {
			    temp.push('"' + campos[j+i].name + '" : "' + campos[j+i].value + '"');
			}
			par.push("{" + temp.join(",") + "}");
		    }
		    //parametros de confiuracao da janela
		    janela = '{"w":"'
			+ $i("parametrosSqljanelaw").value
			+ '","h":"'
			+ $i("parametrosSqljanelah").value
			+ '","top":"'
			+ $i("parametrosSqljanelatop").value
			+ '","left":"'
			+ $i("parametrosSqljanelaleft").value
			+ '"}';
		    return '{"plugin":"parametrossql","id":"' + $i("parametrosSqlid").value + '","ativo":"' + $i("parametrosSqlAtivo").value + '","janela":' + janela + ',"parametros":[' + par.join(",") + ']}';
		},
		/**
		 * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
		 * utilizado para reabrir o formulario de parametros
		 */
		iconeArvoreDeCamadas : function(nomecamada) {
		    var icone =
			"<img class='pluginParametrossql' " + "onclick='i3GEO.util.animaClique(this);"
			+ "i3GEO.pluginI3geo.parametrossql.buscaParForm(\""
			+ nomecamada
			+ "\");return false;'"
			+ "title='Variaveis' "
			+ "src='"
			+ i3GEO.configura.locaplic
			+ "/imagens/branco.gif' />";
		    return icone;
		},
		//link na forma de texto para incluir no menu de contexto
		clickArvoreDeCamadas : function(nomecamada) {
		    var icone =
			"<p><a class='parametrossql buscaParForm' onclick='"
			+ "i3GEO.pluginI3geo.parametrossql.buscaParForm(\""
			+ nomecamada
			+ "\",\"sim\");return false;'"
			+ ">Par&acirc;metros</a>";
		    return icone;
		},
		buscaParForm : function(nomecamada,novaCamada) {
		    var p, cp, temp, s;
		    temp = function(data) {
			var camada;
			data.ativo = "sim";
			// pega o objeto camada
			if (i3GEO.arvoreDeCamadas) {
			    camada = i3GEO.arvoreDeCamadas.pegaTema(nomecamada);
			    camada.plugini3geo = data;
			} else {
			    camada = {
				    plugini3geo : data,
				    name : nomecamada
			    };
			}
			if(!novaCamada){
			    camada.novaCamada = "hidden";
			} else {
			    camada.novaCamada = "";
			}
			i3GEO.pluginI3geo.parametrossql.inicia(camada);
		    };
		    s = i3GEO.configura.sid;
		    if (s === undefined) {
			s = "";
		    }
		    i3GEO.request.get({
			snackbar: false,
			snackbarmsg: false,
			btn: false,
			par: {
				funcao: "PARAMETROSPLUGIN",
				tema: nomecamada
			},
			prog: "/ferramentas/parametrossql/exec.php",
			fn: temp
		    });
		},
		inicia : function(camada) {
		    if (typeof (console) !== 'undefined')
			    console.info("i3GEO.pluginI3geo.inicia parametrossql");

		    i3GEO.janela.fechaAguarde("aguardePlugin");
		    var iniciaform = function() {
			i3GEOF.parametrossql.start(camada);
		    };
		    i3GEO.util.scriptTag(
			    (i3GEO.configura.locaplic + "/ferramentas/parametrossql/dependencias.php"),
			    iniciaform,
		    "parametrossql_script");
		},
		openlayers : {
		    inicia : function(camada) {
			i3GEO.pluginI3geo.parametrossql.inicia(camada);
		    },
		    aplicaPropriedades : function(camada) {
			return camada;
		    }
		}
	    },
	    layergeojson : {
		linkAjuda : function() {
		    return i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=134";
		},
		formAdmin : function(config,onde,tema,salva,remove) {
		    if(!i3GEO.template.layergeojson){
			var t1 = i3GEO.configura.locaplic + "/js/templates/layergeojsonForm_mst.html";
			$.get(t1).done(function(r1) {
			    i3GEO.template.layergeojson = r1;
			    i3GEO.pluginI3geo.layergeojson.formAdmin(config,onde,tema,salva,remove);
			}).fail(function() {
			    i3GEO.janela.closeMsg($trad("erroTpl"));
			    return;
			});
			return;
		    }
		    var mustache,parametros, ins = "", configDefault = '{"plugin":"layergeojson","parametros":{"url": ""}}';
		    if (config === "") {
			config = configDefault;
		    }
		    config = JSON.parse(config);
		    if (config.plugin != "layergeojson") {
			config = JSON.parse(configDefault);
		    }
		    parametros = config.parametros;
		    mustache = {
			    "url": parametros.url,
			    "linkAjuda": i3GEO.pluginI3geo.linkAjuda("layergeojson"),
			    "tema": tema,
			    "salvaPlugin": salva,
			    "removePlugin": remove
		    };
		    ins = Mustache.render(
			    i3GEO.template.layergeojson,
			    $.extend(
				    {},
				    mustache,
				    i3GEO.idioma.OBJETOIDIOMA
			    )
		    );
		    if($i(onde)){
			$i(onde).innerHTML = ins;
			return false;
		    } else {
			return ins;
		    }
		},
		/**
		 * Constroi um icone que sera adicionado na barra de icones do tema quando for adicionado na arvore de camadas Esse icone e
		 * utilizado para reabrir o formulario de parametros
		 */
		iconeArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
		clickArvoreDeCamadas : function(nomecamada) {
		    return false;
		},
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
		    layerMashup : function(camada, epsg){
			i3GEO.pluginI3geo.layergeojson.openlayers.inicia(camada,i3geoOL);
			return [];
		    },
		    inicia : function(camada) {
			if (typeof (console) !== 'undefined')
			    console.info("i3GEO.pluginI3geo.inicia layergeojson");


			var layergeojson, url, temp;
			url = i3GEO.configura.locaplic + "/ferramentas/layergeojson/getgeojson.php?sid=" + i3GEO.configura.sid + "&tema=" + camada.name;
			layergeojson = new ol.layer.Vector({
			    name : camada.name,
			    isBaseLayer : false,
			    source : new ol.source.Vector({
				url : url,
				format : new ol.format.GeoJSON(),
				tipoServico : "geojson"
			    })
			});
			i3geoOL.addLayer(layergeojson);
			i3GEO.pluginI3geo.OBJETOS[camada.name] = layergeojson;
		    }
		}
	    }
};
