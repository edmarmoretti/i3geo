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
	 * Objeto LAYER para a interface openLayers criado com i3GEO.desenho.openlayers.criaLayerGrafico
	 *
	 * Tipo:
	 *
	 * {penLayers.Layer.Vector}
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
		linecolor : '#ffcc33',
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
	    caixa = "<select class='form-control' onchange='i3GEO.desenho.definePadrao(this.value)'>";
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
	definePadrao : function(valor){
	    i3GEO.desenho.estiloPadrao = valor;
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
	    return i3GEO.desenho[i3GEO.Interface.ATUAL].addBox(xmin, ymin, xmax, ymax, namespace, strokeColor, strokeWidth);
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
	    return i3GEO.desenho[i3GEO.Interface.ATUAL].moveBox(box, xmin, ymin, xmax, ymax);
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
	    return i3GEO.desenho[i3GEO.Interface.ATUAL].addPin(x, y, w, h, imagem, namespace, centro);
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
	    i3GEO.desenho[i3GEO.Interface.ATUAL].removePins(namespace);
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
	    i3GEO.desenho[i3GEO.Interface.ATUAL].movePin(pin, x, y);
	},
	criaLayerGrafico : function(){
	    if (!i3GEO.desenho.layergrafico) {
		i3GEO.desenho[i3GEO.Interface.ATUAL].criaLayerGrafico();
	    }
	},
	/**
	 * Section: i3GEO.desenho.openlayers
	 *
	 * Fun&ccedil;&otilde;es utilizadas quando o mapa baseia-se na interface openLayers
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
		var pol, f;
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
		xmin = xmin * 1;
		ymin = ymin * 1;
		xmax = xmax * 1;
		ymax = ymax * 1;
		pol = new ol.geom.Polygon([[[xmin,ymin],[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]]]);
		pol = i3GEO.util.extGeo2OSM(pol);
		f = new ol.Feature({
		    geometry: pol
		});
		f.setStyle(
			new ol.style.Style({
			    stroke: new ol.style.Stroke({
				color: strokeColor,
				width: strokeWidth
			    })
			})
		);
		f.setProperties({
		    origem : namespace
		});
		i3GEO.editor.setStyleDefault(f);
		i3GEO.desenho.layergrafico.getSource().addFeature(f);
		return f;
	    },
	    moveBox : function(box, xmin, ymin, xmax, ymax) {
		box.getGeometry().setCoordinates([[[xmin,ymin],[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]]]);
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
			i3GEO.desenho.openlayers.removePins(namespace);
		    };
		}
		if (!centro) {
		    centro = false;
		}
		i3GEO.desenho.openlayers.inicia();
		var point, f, ox, oy;
		if (centro === true) {
		    ox = 0.5;
		    oy = 0.5;
		} else {
		    ox = 0.5;
		    oy = 1;
		}
		point = i3GEO.util.extGeo2OSM(new ol.geom.Point([x, y]));
		f = new ol.Feature({
		    geometry: point
		});
		f.setProperties({
		    origem : namespace
		});
		f.setStyle(
			new ol.style.Style({
			    image: new ol.style.Icon({
				src : imagem,
				size: [w,h],
				anchor: [ox,oy]
			    })
			})
		);
		i3GEO.editor.setStyleDefault(f);
		//FIXME como incluir o evento click?
		//f.on('click',funcaoclick);
		i3GEO.desenho.layergrafico.getSource().addFeature(f);
		i3GEO.editor.tableRefresh();
		return f;
	    },
	    removePins : function(namespace) {
		if (!namespace) {
		    namespace = "pin";
		}
		if (i3GEO.desenho.layergrafico) {
		    var features, n, f, i, remover = [];
		    features = i3GEO.desenho.layergrafico.getSource().getFeatures();
		    n = features.length;
		    for (i = 0; i < n; i++) {
			if(features[i].get("origem") == namespace){
			    remover.push(features[i]);
			}
		    }
		    n = remover.length;
		    for (i = 0; i < n; i++) {
			i3GEO.desenho.layergrafico.getSource().removeFeature(remover[i]);
		    }
		}
	    },
	    movePin : function(pin, x, y) {
		var point = i3GEO.util.extGeo2OSM(new ol.geom.Point([x, y]));
		pin.getGeometry().setCoordinates(point.getCoordinates());
	    },
	    criaLayerGrafico : function() {
		if (!i3GEO.desenho.layergrafico) {
		    i3GEO.desenho.layergrafico = new ol.layer.Vector({
			source : new ol.source.Vector({
			    features : new ol.Collection(),
			    useSpatialIndex : false
			}),
			style : new ol.style.Style({
			    fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			    }),
			    stroke : new ol.style.Stroke({
				color : '#ffcc33',
				width : 4
			    }),
			    image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
				    color : '#ffcc33'
				})
			    })
			})
		    });
		    i3GEO.desenho.layergrafico.setProperties(
			    {
				"layerGr" : true,
				"name" : "i3GEOdesenho",
				"title" : $trad("layerDesenho"),
				"isBaseLayer" : false
			    },
			    true);
		    i3GEO.desenho.layergrafico.setMap(i3geoOL);
		    i3GEO.desenho.layergrafico.getFeatures = function(){
			return i3GEO.desenho.layergrafico.getSource().getFeatures();
		    };
		    i3GEO.editor.criaLayerBackup();
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
	}
};
